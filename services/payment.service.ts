import { supabase } from '@/lib/supabase/client';
import { EMAIL_TEMPLATES } from './email.templates';
import { DateTime } from 'luxon';

export const ENABLE_RAZORPAY = true; 
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://crackjobs.com';

// Tier multiplier mapping
const TIER_MULTIPLIERS: Record<string, number> = {
  bronze: 2.0,   // 100% commission
  silver: 1.75,  // 75% commission
  gold: 1.5,     // 50% commission
};

// ==========================================
// 📧 EMAIL HELPER
// ==========================================

const compileTemplate = (template: string, data: Record<string, any>) => {
  return template.replace(/{{(\w+)}}/g, (_, key) => data[key] || '');
};

async function sendEmail(
  to: string, 
  subject: string, 
  templateHtml: string, 
  data: Record<string, any>
) {
  try {
    const compiledHtml = compileTemplate(templateHtml, data);
    console.log(`📧 [Email Service] Sending to: ${to}`);
    
    // Calls the Edge Function (send-email) with RAW HTML
    const { data: resData, error } = await supabase.functions.invoke('send-email', {
      body: { 
        to, 
        subject, 
        html: compiledHtml // Send compiled HTML directly
      }
    });

    if (error || !resData?.success) {
      console.error('[Email Service] Failed:', error || resData);
      return false;
    }

    console.log('[Email Service] ✅ Success! ID:', resData.id);
    return true;
  } catch (e) {
    console.error('[Email Service] Exception:', e);
    return false;
  }
}

// ==========================================
// 💳 PAYMENT & BOOKING SERVICE
// ==========================================

export const paymentService = {
  /**
   * ✅ ENHANCED: Check if slots are already booked AND verify slot exists
   * Checks for pending, confirmed, scheduled, AND completed sessions
   */
  async checkBookingConflict(mentorId: string, selectedSlots: string[]) {
    if (!selectedSlots || selectedSlots.length === 0) {
      throw new Error('No time slot selected');
    }

    console.log('[Payment] 🔍 Checking booking conflicts for:', selectedSlots);

    // ✅ FIX: Convert to simple date strings for database query
    const slotsQueryStr = selectedSlots.map(slot => {
      const dt = DateTime.fromISO(slot);
      return dt.toFormat('yyyy-MM-dd HH:mm:ss');
    });

    console.log('[Payment] Query strings:', slotsQueryStr);

    const { data, error } = await supabase
      .from('interview_sessions')
      .select('scheduled_at, status')
      .eq('mentor_id', mentorId)
      .in('status', ['pending', 'confirmed', 'completed']) // ✅ 'scheduled' is not a valid enum value
      .in('scheduled_at', slotsQueryStr);

    if (error) {
      console.error('[Payment] ❌ Slot verification error:', error);
      throw new Error('Unable to verify slot availability.');
    }

    if (data && data.length > 0) {
      console.error('[Payment] ❌ Slot conflict detected:', data);
      throw new Error('This slot was just booked by someone else. Please select another time.');
    }

    console.log('[Payment] ✅ No conflicts found - slot is available');
  },

  async createPackage(
    candidateId: string,
    mentorId: string,
    interviewProfileId: number, 
    skillId: string,
    selectedSlot: string 
  ) {
    try {
        console.log("🚀 Starting Booking Process...");
        console.log("📋 Details:", { candidateId, mentorId, selectedSlot });

        // ✅ STEP 1: Verify slot is available FIRST
        console.log("[Payment] 🔒 STEP 1: Pre-flight slot check...");
        await this.checkBookingConflict(mentorId, [selectedSlot]);

        // Fetch mentor data including tier
        const { data: mentorData, error: mentorError } = await supabase
          .from('mentors')
          .select('session_price_inr, tier')
          .eq('id', mentorId)
          .single();

        if (mentorError || !mentorData) {
          console.error('[Payment] ❌ Mentor fetch error:', mentorError);
          throw new Error("Unable to retrieve mentor pricing details.");
        }

        const basePrice = mentorData.session_price_inr || 0;
        const tier = mentorData.tier || 'bronze'; // Default to bronze if not set
        const multiplier = TIER_MULTIPLIERS[tier] || 2.0; // Default to 2.0 if tier not found
        
        console.log(`💰 Pricing Calculation:`, {
          tier,
          basePrice,
          multiplier,
          totalPrice: Math.round(basePrice * multiplier)
        });
        
        const totalPrice = Math.round(basePrice * multiplier); 
        const amountToSend = totalPrice * 100; // in paise
        const mentorPayout = basePrice;
        const platformFee = totalPrice - mentorPayout;

        // ✅ STEP 2: Create Razorpay order
        let razorpayOrderId = null;
        let razorpayKeyId = null;

        if (ENABLE_RAZORPAY) {
          console.log("[Payment] 💳 STEP 2: Creating Razorpay order...");

          const { data: orderData, error: orderError } = await supabase.functions.invoke(
            "create-razorpay-order",
            { 
              body: { 
                amount: amountToSend, 
                currency: "INR", 
                receipt: `rcpt_${Date.now()}`,
                notes: {
                  candidate_id: candidateId,
                  mentor_id: mentorId,
                  skill_id: skillId
                }
              } 
            }
          );

          if (orderError || !orderData?.id) {
            console.error("[Payment] ❌ Razorpay Error:", orderError, orderData);
            throw new Error("Payment order creation failed. Please try again.");
          }
          
          razorpayOrderId = orderData.id;      
          razorpayKeyId = orderData.key_id;     
        }

        // ✅ STEP 3: Create PACKAGE FIRST (this generates the package_id we need)
        console.log("[Payment] 📦 STEP 3: Creating package record...");
        const pkgPayload = {
          candidate_id: candidateId,
          mentor_id: mentorId,
          interview_profile_id: interviewProfileId,
          
          total_amount_inr: totalPrice,
          mentor_payout_inr: mentorPayout,
          platform_fee_inr: platformFee,
          
          payment_status: ENABLE_RAZORPAY ? "pending" : "held_in_escrow",
          razorpay_order_id: razorpayOrderId,
          booking_metadata: {
            skill_id: skillId,
            scheduled_at: selectedSlot
            // session_id will be added after session creation
          }
        };

        const { data: pkg, error: pkgError } = await supabase
          .from("interview_packages")
          .insert(pkgPayload)
          .select("*")
          .single();

        if (pkgError || !pkg) {
           console.error("[Payment] ❌ Package creation failed:", pkgError);
           throw new Error("Unable to create booking record. Please try again.");
        }

        console.log("[Payment] ✅ Package created:", pkg.id);

        // ✅ STEP 4: Now create SESSION with the package_id
        console.log("[Payment] 🔒 STEP 4: Creating session to block slot...");
        
        const { data: newSession, error: sessionError } = await supabase
          .from('interview_sessions')
          .insert({
            package_id: pkg.id,  // ✅ NOW we have the package_id!
            candidate_id: candidateId,
            mentor_id: mentorId,
            skill_id: skillId,
            scheduled_at: selectedSlot,
            status: 'pending',  // ✅ Set to 'pending' so cron can clean up if payment is abandoned
          })
          .select('id')
          .single();

        if (sessionError || !newSession) {
          console.error("[Payment] ❌ Session creation failed:", sessionError);
          
          // Rollback: Delete the package since session creation failed
          await supabase.from('interview_packages').delete().eq('id', pkg.id);
          
          if (sessionError?.code === '23505') {
            throw new Error('This slot was just booked by someone else. Please select another time.');
          }
          throw new Error('Unable to reserve slot. Please try again.');
        }

        console.log("[Payment] ✅ Session created:", newSession.id, "- Slot now BLOCKED");
        const sessionId = newSession.id;

        // ✅ STEP 5: Update package metadata with session_id
        console.log("[Payment] 📝 STEP 5: Linking session to package...");
        const { error: updateError } = await supabase
          .from('interview_packages')
          .update({ 
            booking_metadata: {
              skill_id: skillId,
              scheduled_at: selectedSlot,
              session_id: sessionId
            }
          })
          .eq('id', pkg.id);

        if (updateError) {
          console.warn("[Payment] ⚠️ Failed to update package metadata:", updateError);
        }

        // ✅ Return success (100ms room will be created after payment verification)
        return {
          package: pkg,
          orderId: razorpayOrderId,
          amount: amountToSend,
          keyId: razorpayKeyId,
          error: null
        };

    } catch (err: any) {
        console.error("Payment Logic Exception:", err);
        return { 
          package: null,
          orderId: null,
          amount: null,
          keyId: null,
          error: { message: err.message || 'Booking failed' } 
        };
    }
  },

  async verifyPayment(
    pkgId: string, 
    orderId: string, 
    payId: string, 
    sig: string
  ) {
    try {
      console.log("[Payment Service] 🔐 Verifying payment...", { 
        pkgId, 
        orderId, 
        payId, 
        signature: sig ? '✓ Present' : '✗ Missing' 
      });

      // 1. Call Edge Function to verify signature
      // 2. Edge Function validates signature with Razorpay
      // 3. Return the updated package
      const { data, error } = await supabase.functions.invoke(
        "verify-razorpay-signature",
        { 
          body: { 
            packageId: pkgId,
            orderId, 
            paymentId: payId, 
            signature: sig 
          } 
        }
      );

      console.log("[Payment Service] Edge Function Response:", { data, error });

      // ❌ Check for errors
      if (error) {
        console.error("[Payment Service] ❌ Edge Function error:", error);
        throw new Error(`Verification failed: ${error.message || 'Unknown error'}`);
      }

      if (!data?.valid) {
        console.error("[Payment Service] ❌ Invalid signature:", data);
        throw new Error(data?.error || "Payment verification failed");
      }

      // ✅ Signature is valid and database is already updated by Edge Function
      console.log("[Payment Service] ✅ Payment verified! Package updated:", data.package?.id);

      // Fetch the updated package to get booking metadata
      const { data: pkgData, error: pkgFetchError } = await supabase
        .from('interview_packages')
        .select('*')
        .eq('id', pkgId)
        .single();

      if (pkgFetchError || !pkgData) {
        console.error("[Payment Service] ❌ Failed to fetch package:", pkgFetchError);
        throw new Error("Package not found after verification.");
      }

      const { skill_id, scheduled_at, session_id } = pkgData.booking_metadata || {};
      
      // ✅ Double check for booking conflicts (final validation)
      console.log("[Payment Service] 🔍 Final conflict check...");
      await this.checkBookingConflict(pkgData.mentor_id, [scheduled_at]);

      // ✅ Update session status from 'pending' to 'confirmed' (payment verified)
      console.log("[Payment Service] 📝 Updating session status to 'confirmed'...");
      
      if (!session_id) {
        console.error("[Payment Service] ❌ No session_id in booking metadata!");
        throw new Error("Session ID not found in package metadata");
      }

      const { error: sessionUpdateError } = await supabase
        .from("interview_sessions")
        .update({ status: 'confirmed' })  // ✅ Set to 'confirmed' - payment received, awaiting interview
        .eq('id', session_id);

      if (sessionUpdateError) {
        console.error("[Payment Service] ❌ Failed to update session status:", sessionUpdateError);
        throw new Error("Failed to update session status after payment");
      }

      console.log("[Payment Service] ✅ Session status updated to 'confirmed' - payment received!");

      // ✅ Create 100ms room AFTER payment is verified
      console.log("[Payment Service] 🎥 Creating 100ms video room...");
      
      try {
        const { data: roomData, error: roomError } = await supabase.functions.invoke(
          "create-100ms-room",
          { 
            body: { 
              name: `Interview-${session_id}`,
              description: `Mock interview session`,
            } 
          }
        );

        if (!roomError && roomData?.id) {
          const roomCode = roomData.id;
          console.log("[Payment Service] ✅ 100ms room created:", roomCode);

          const { error: meetingError } = await supabase
            .from("session_meetings")
            .insert({
              session_id: session_id,
              room_code: roomCode,
              status: "created",
            });

          if (meetingError) {
            console.warn("[Payment Service] ⚠️ Failed to store meeting details:", meetingError);
          }
        } else {
          console.warn("[Payment Service] ⚠️ 100ms room creation failed:", roomError);
          // Don't throw error - booking is still valid without the room
        }
      } catch (roomErr) {
        console.warn("[Payment Service] ⚠️ 100ms room creation exception:", roomErr);
        // Don't throw error - booking is still valid
      }

      // ✅ Send confirmation emails (no meeting link needed)
      console.log("[Payment Service] 📧 Triggering confirmation emails...");
      this.triggerBookingConfirmationEmails(pkgId);
      
      return { success: true };

    } catch (err: any) {
      console.error("[Payment Service] 💥 Fatal error in verifyPayment:", err);
      throw new Error(err.message || "Payment verification failed");
    }
  },

  async triggerBookingConfirmationEmails(pkgId: string) {
    try {
        console.log("[Email] 📧 Sending booking confirmation emails for package:", pkgId);

        const { data: pkg } = await supabase
          .from('interview_packages')
          .select('candidate_id, mentor_id, interview_profile_id')
          .eq('id', pkgId)
          .single();
        
        if (!pkg) {
          console.error("[Email] ❌ Package not found:", pkgId);
          return;
        }

        const { data: mentor } = await supabase
          .from('mentors')
          .select('professional_title, profile:profiles!id(email, full_name)')
          .eq('id', pkg.mentor_id)
          .single();
        
        const { data: candidate } = await supabase
          .from('candidates')
          .select('professional_title, profile:profiles!id(email, full_name)')
          .eq('id', pkg.candidate_id)
          .single();
        
        const { data: profile } = await supabase
          .from('interview_profiles_admin')
          .select('name')
          .eq('id', pkg.interview_profile_id)
          .single();
        
        const { data: session } = await supabase
          .from('interview_sessions')
          .select('scheduled_at, skill:interview_skills_admin!skill_id(name)')
          .eq('package_id', pkgId)
          .single();

        const dateTime = session?.scheduled_at 
          ? new Date(session.scheduled_at).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }) 
          : 'TBD';

        // Send to Candidate
        if (candidate?.profile?.email) {
          console.log("[Email] 📧 Sending to candidate:", candidate.profile.email);
          await sendEmail(
            candidate.profile.email,
            `✅ Interview Confirmed - ${profile?.name}`,
            EMAIL_TEMPLATES.CANDIDATE_BOOKING_CONFIRMATION,
            {
              name: candidate.profile.full_name,
              mentorTitle: mentor?.professional_title,
              profileName: profile?.name,
              skillName: session?.skill?.name,
              dateTime: dateTime,
              baseUrl: BASE_URL
            }
          );
        }

        // Send to Mentor
        if (mentor?.profile?.email) {
          console.log("[Email] 📧 Sending to mentor:", mentor.profile.email);
          await sendEmail(
            mentor.profile.email,
            `🎯 New Booking Confirmed - ${profile?.name}`,
            EMAIL_TEMPLATES.MENTOR_BOOKING_CONFIRMATION,
            {
              name: mentor.profile.full_name,
              candidateTitle: candidate?.professional_title,
              profileName: profile?.name,
              skillName: session?.skill?.name,
              dateTime: dateTime,
              baseUrl: BASE_URL
            }
          );
        }

        // Send to Helpdesk
        console.log("[Email] 📧 Sending to helpdesk: crackjobshelpdesk@gmail.com");
        await sendEmail(
          'crackjobshelpdesk@gmail.com',
          `🔔 New Booking Alert - ${profile?.name}`,
          EMAIL_TEMPLATES.HELPDESK_BOOKING_NOTIFICATION,
          {
            packageId: pkgId,
            candidateName: candidate?.profile?.full_name || 'N/A',
            candidateTitle: candidate?.professional_title || 'N/A',
            candidateEmail: candidate?.profile?.email || 'N/A',
            mentorName: mentor?.profile?.full_name || 'N/A',
            mentorTitle: mentor?.professional_title || 'N/A',
            mentorEmail: mentor?.profile?.email || 'N/A',
            profileName: profile?.name || 'N/A',
            skillName: session?.skill?.name || 'N/A',
            dateTime: dateTime,
            baseUrl: BASE_URL
          }
        );

        console.log("[Email] ✅ Booking confirmation emails sent successfully!");

      } catch (err) { 
        console.error("[Email] ❌ Booking confirmation emails failed:", err); 
      }
  },

  async sendMentorWelcomeEmail(mentorId: string) {
    try {
      const { data: mentorData } = await supabase
        .from('mentors')
        .select('profile:profiles!id (email, full_name)')
        .eq('id', mentorId)
        .single();

      if (!mentorData?.profile?.email) {
        console.error('[Email] Mentor email not found');
        return;
      }

      const success = await sendEmail(
        mentorData.profile.email,
        '🎉 Welcome to CrackJobs - Your Mentor Account is Active',
        EMAIL_TEMPLATES.MENTOR_WELCOME,
        {
          name: mentorData.profile.full_name,
          baseUrl: BASE_URL
        }
      );

      if (success) {
        console.log('[Email] ✅ Welcome email sent to mentor:', mentorId);
      }
    } catch (err) {
      console.warn("Mentor welcome email failed:", err);
    }
  }
};