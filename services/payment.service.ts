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
   * Checks for awaiting_payment, pending, confirmed, scheduled, AND completed sessions
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
      // ✅ FIXED: Include 'awaiting_payment' to prevent double bookings during payment window
      .in('status', ['awaiting_payment', 'pending', 'confirmed', 'completed'])
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
            // ✅ FIXED: Set to 'awaiting_payment' instead of 'pending'
            // This way cron can clean up abandoned payments AND mentor approval flow works correctly
            status: 'awaiting_payment',
          })
          .select('id')
          .single();

        if (sessionError || !newSession) {
          console.error("[Payment] ❌ Session creation failed:", sessionError);
          
          // Cleanup: Delete the package if session creation fails
          await supabase.from("interview_packages").delete().eq("id", pkg.id);
          
          throw new Error("Unable to reserve slot. It may have just been booked.");
        }

        console.log("[Payment] ✅ Session created and slot blocked:", newSession.id);

        // ✅ STEP 5: Update package with session_id in metadata
        const { error: updateError } = await supabase
          .from("interview_packages")
          .update({
            booking_metadata: {
              ...pkg.booking_metadata,
              session_id: newSession.id
            }
          })
          .eq("id", pkg.id);

        if (updateError) {
          console.warn("[Payment] ⚠️ Failed to update package metadata:", updateError);
        }

        console.log("[Payment] ✅ Booking flow complete!");

        return {
          package: pkg,
          orderId: razorpayOrderId,
          amount: amountToSend,
          keyId: razorpayKeyId,
          error: null
        };

    } catch (err: any) {
      console.error("[Payment] 💥 Fatal error in createPackage:", err);
      return {
        package: null,
        orderId: null,
        amount: 0,
        keyId: null,
        error: err
      };
    }
  },

  async verifyPayment(pkgId: string, razorpayPaymentId: string, razorpaySignature: string) {
    try {
      console.log("[Payment Service] 🔍 Verifying payment for package:", pkgId);

      // ✅ STEP 1: Fetch package to get orderId
      console.log("[Payment Service] 📦 Fetching package to get order ID...");
      
      const { data: pkgData, error: pkgFetchError } = await supabase
        .from('interview_packages')
        .select('razorpay_order_id, booking_metadata')
        .eq('id', pkgId)
        .single();

      if (pkgFetchError || !pkgData) {
        console.error("[Payment Service] ❌ Failed to fetch package:", pkgFetchError);
        throw new Error("Package not found");
      }

      const orderId = pkgData.razorpay_order_id;

      if (!orderId) {
        console.error("[Payment Service] ❌ No order ID in package");
        throw new Error("Order ID not found in package");
      }

      console.log("[Payment Service] ✅ Order ID retrieved:", orderId);

      // ✅ STEP 2: Verify with Razorpay edge function
      // IMPORTANT: Edge function expects { packageId, orderId, paymentId, signature }
      console.log("[Payment Service] 🔐 Calling edge function to verify signature...");
      
      const { data: verifyData, error: verifyError } = await supabase.functions.invoke(
        "verify-razorpay-signature",
        {
          body: {
            packageId: pkgId,
            orderId: orderId,
            paymentId: razorpayPaymentId,
            signature: razorpaySignature
          }
        }
      );

      if (verifyError) {
        console.error("[Payment Service] ❌ Edge function invocation error:", verifyError);
        throw new Error(`Edge function error: ${verifyError.message}`);
      }

      if (!verifyData?.valid) {
        console.error("[Payment Service] ❌ Verification failed:", verifyData);
        throw new Error(verifyData?.error || "Payment verification failed. Please contact support.");
      }

      console.log("[Payment Service] ✅ Payment verified by Razorpay!");
      console.log("[Payment Service] 📊 Verification response:", {
        valid: verifyData.valid,
        message: verifyData.message,
        debug: verifyData.debug
      });

      // ✅ STEP 3: Edge function has already updated both:
      // - interview_packages (payment_status, razorpay_payment_id, razorpay_signature, razorpay_order_id)
      // - interview_sessions (status: awaiting_payment → pending)
      console.log("[Payment Service] ✅ Package and session updated by Edge Function");

      // ✅ STEP 4: Verify the updates actually happened
      console.log("[Payment Service] 🔍 Verifying database updates...");
      
      const { data: updatedPackage, error: verifyPackageError } = await supabase
        .from('interview_packages')
        .select('payment_status, razorpay_payment_id, razorpay_signature, razorpay_order_id, booking_metadata')
        .eq('id', pkgId)
        .single();

      if (verifyPackageError || !updatedPackage) {
        console.error("[Payment Service] ❌ Failed to verify package update:", verifyPackageError);
        throw new Error("Failed to verify package update");
      }

      console.log("[Payment Service] 📊 Package verification:", {
        payment_status: updatedPackage.payment_status,
        has_payment_id: !!updatedPackage.razorpay_payment_id,
        has_signature: !!updatedPackage.razorpay_signature,
        has_order_id: !!updatedPackage.razorpay_order_id
      });

      // Check if payment details were actually saved
      if (!updatedPackage.razorpay_payment_id || !updatedPackage.razorpay_signature) {
        console.error("[Payment Service] ❌ Payment details not saved in package!");
        console.error("[Payment Service] ❌ Current package state:", updatedPackage);
        throw new Error("Payment verification succeeded but details were not saved. Please contact support.");
      }

      // Verify session update
      const session_id = updatedPackage.booking_metadata?.session_id;
      
      if (session_id) {
        const { data: sessionData, error: sessionVerifyError } = await supabase
          .from('interview_sessions')
          .select('status')
          .eq('id', session_id)
          .single();

        if (sessionVerifyError) {
          console.error("[Payment Service] ⚠️ Failed to verify session:", sessionVerifyError);
        } else {
          console.log("[Payment Service] 📊 Session status:", sessionData?.status);
          
          if (sessionData?.status !== 'pending') {
            console.warn("[Payment Service] ⚠️ Session status not updated! Current:", sessionData?.status);
          }
        }
      } else {
        console.warn("[Payment Service] ⚠️ No session_id in booking metadata");
      }

      // ✅ STEP 4.5: Create 100ms meeting after successful payment
      if (session_id) {
        console.log("[Payment Service] 🎥 Creating 100ms meeting for session:", session_id);
        
        const { data: meetingData, error: meetingError } = await supabase.functions.invoke('create-meeting', {
          body: { sessionId: session_id }
        });

        if (meetingError || !meetingData?.success) {
          console.error("[Payment Service] ⚠️ Meeting creation failed:", meetingError || meetingData);
          // Don't fail the entire payment - meeting can be created manually if needed
        } else {
          console.log("[Payment Service] ✅ Meeting created successfully:", meetingData.roomId);
        }
      } else {
        console.warn("[Payment Service] ⚠️ Cannot create meeting - no session_id");
      }

      // ✅ STEP 5: Send notification emails to candidate and mentor
      // 🟢 FIXED: Added await to ensure emails are sent before continuing
      console.log("[Payment Service] 📧 Triggering booking notification emails...");
      await this.triggerBookingNotificationEmails(pkgId);
      
      return { success: true };

    } catch (err: any) {
      console.error("[Payment Service] 💥 Fatal error in verifyPayment:", err);
      throw new Error(err.message || "Payment verification failed");
    }
  },

  async triggerBookingNotificationEmails(pkgId: string) {
    try {
        console.log("[Email] 📧 Sending booking notification emails for package:", pkgId);

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

        // ✅ Send to Candidate - Booking confirmed
        if (candidate?.profile?.email) {
          console.log("[Email] 📧 Sending to candidate:", candidate.profile.email);
          await sendEmail(
            candidate.profile.email,
            `✅ Interview Confirmed`,
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

        // ✅ Send to Mentor - Booking confirmed
        if (mentor?.profile?.email) {
          console.log("[Email] 📧 Sending to mentor:", mentor.profile.email);
          await sendEmail(
            mentor.profile.email,
            `🎯 Interview Confirmed`,
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
          `🔔 New Booking Alert - Awaiting Mentor Approval`,
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

        console.log("[Email] ✅ Booking notification emails sent successfully!");

      } catch (err) { 
        console.error("[Email] ❌ Booking notification emails failed:", err); 
      }
  },

  async triggerBookingConfirmationEmails(pkgId: string) {
    try {
        console.log("[Email] 📧 Sending booking CONFIRMATION emails for package:", pkgId);

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
          console.log("[Email] 📧 Sending confirmation to candidate:", candidate.profile.email);
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
          console.log("[Email] 📧 Sending confirmation to mentor:", mentor.profile.email);
          await sendEmail(
            mentor.profile.email,
            `🎯 Interview Confirmed - ${profile?.name}`,
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