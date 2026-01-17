import { supabase } from '@/lib/supabase/client';
import { EMAIL_TEMPLATES } from './email.templates';

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
  async checkBookingConflict(mentorId: string, selectedSlots: string[]) {
    if (!selectedSlots || selectedSlots.length === 0) return;
    const { data, error } = await supabase
      .from('interview_sessions')
      .select('scheduled_at')
      .eq('mentor_id', mentorId)
      .in('status', ['pending', 'confirmed', 'completed']) 
      .in('scheduled_at', selectedSlots);

    if (error) throw new Error('Unable to verify slot availability.');
    if (data && data.length > 0) throw new Error('Slot already booked.');
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
        await this.checkBookingConflict(mentorId, [selectedSlot]);

        // Fetch mentor data including tier
        const { data: mentorData, error: mentorError } = await supabase
          .from('mentors')
          .select('session_price_inr, tier')
          .eq('id', mentorId)
          .single();

        if (mentorError || !mentorData) throw new Error("Unable to retrieve mentor pricing details.");

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

        let razorpayOrderId = null;
        let razorpayKeyId = null;

        if (ENABLE_RAZORPAY) {
          console.log("💳 Creating Razorpay Order...");
          const { data: orderData, error: orderError } = await supabase.functions.invoke(
            "create-razorpay-order",
            { 
              body: { 
                amount: amountToSend, 
                currency: "INR", 
                receipt: `rcpt_${Date.now()}` // ✅ REQUIRED by Edge Function
              } 
            }
          );

          // ✅ Check for 'id' (Standard Razorpay response), NOT 'orderId'
          if (orderError || !orderData?.id) {
            console.error("Razorpay Error:", orderError, orderData);
            throw new Error("Payment order creation failed.");
          }
          
          razorpayOrderId = orderData.id;      
          razorpayKeyId = orderData.key_id;     
        }

        // ✅ Create package in database
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
          }
        };

        const { data: pkg, error: pkgError } = await supabase
          .from("interview_packages")
          .insert(pkgPayload)
          .select("*")
          .single();

        if (pkgError || !pkg) {
           console.error("Database Insert Error:", pkgError);
           throw new Error("Unable to create package in database.");
        }

        console.log("✅ Package Created:", pkg.id);
        const packageId = pkg.id;

        // 🔥 Create interview_session IMMEDIATELY to block the slot (no meeting_link)
        console.log("📅 Creating interview session to block slot...");
        
        const { data: newSession, error: sessionError } = await supabase.from('interview_sessions').insert({
          package_id: packageId,
          candidate_id: candidateId,
          mentor_id: mentorId,
          skill_id: skillId,
          scheduled_at: selectedSlot,
          status: 'pending', // Will remain pending until payment confirmed
        }).select('id').single();

        if (sessionError || !newSession) {
          console.error("Session Creation Error:", sessionError);
          
          // If session creation fails (e.g., duplicate booking), clean up the package
          await supabase.from('interview_packages').delete().eq('id', packageId);
          
          if (sessionError?.code === '23505') { // Unique constraint violation
            throw new Error('This slot was just booked by someone else. Please select another time.');
          }
          throw new Error('Unable to reserve slot. Please try again.');
        }

        console.log("✅ Session Created:", newSession.id);

        // 🎥 Create 100ms room and store in session_meetings
        console.log("🎥 Creating 100ms video room...");
        try {
          const { data: roomData, error: roomError } = await supabase.functions.invoke(
            "create-meeting",
            { body: { sessionId: newSession.id, scheduledAt: selectedSlot } }
          );

          if (roomError || !roomData?.success) {
            console.error("100ms Room Creation Error:", roomError);
            console.warn("⚠️ Proceeding without video room - can be created on-demand");
          } else {
            console.log("✅ 100ms Room Created:", roomData.roomCode);
          }
        } catch (roomErr) {
          console.error("100ms Room Exception:", roomErr);
          console.warn("⚠️ Video room creation failed but continuing with booking");
        }

        // Send emails only if payment is disabled (test mode)
        if (!ENABLE_RAZORPAY) {
          this.triggerBookingConfirmationEmails(packageId);
        }

        return { package: pkg, orderId: razorpayOrderId, keyId: razorpayKeyId, amount: amountToSend, error: null };

    } catch (error: any) {
      console.error("Payment Logic Exception:", error);
      return { package: null, orderId: null, amount: 0, error };
    }
  },

  async verifyPayment(pkgId: string, orderId: string, payId: string, sig: string) {
    console.log("[Payment Service] 🔐 Starting verification...", {
      packageId: pkgId,
      orderId,
      paymentId: payId,
      signature: sig ? "✓ Present" : "✗ Missing"
    });

    try {
      // ✅ Call Edge Function with ALL required data
      // The Edge Function will:
      // 1. Verify the signature
      // 2. Update the database with razorpay_order_id, razorpay_payment_id, razorpay_signature
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

      const { skill_id, scheduled_at } = pkgData.booking_metadata || {};
      
      // ✅ Double check for booking conflicts
      console.log("[Payment Service] 🔍 Checking for booking conflicts...");
      await this.checkBookingConflict(pkgData.mentor_id, [scheduled_at]);

      // 🔥 Session already exists from createPackage, just verify it exists
      console.log("[Payment Service] 📝 Payment verified - session remains 'pending' for mentor approval...");
      
      const { data: sessionData, error: sessionFetchError } = await supabase
        .from("interview_sessions")
        .select('id')
        .eq('package_id', pkgId)
        .single();

      if (sessionFetchError || !sessionData) {
        console.error("[Payment Service] ❌ Session fetch failed:", sessionFetchError);
        throw new Error("Session not found after payment verification");
      }

      console.log("[Payment Service] ✅ Session found - awaiting mentor approval!");

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