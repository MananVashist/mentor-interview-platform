import { supabase } from '@/lib/supabase/client';

export const ENABLE_RAZORPAY = true; 

// Resend Template IDs
const RESEND_TEMPLATES = {
  MENTOR_WELCOME: '4ed4161d-83cf-43a3-b581-c0b923883e94', 
  CANDIDATE_BOOKING_CONFIRMATION: '4fcb02c7-e884-4945-9d7e-dd23cbbb3351', 
  MENTOR_BOOKING_CONFIRMATION: 'f6634c20-97cf-4053-b763-d9dc167d9c20', 
};

// Base URL for the application
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://crackjobs.com';

async function sendTemplatedEmail(
  to: string, 
  subject: string, 
  templateId: string, 
  templateData: Record<string, any>,
  type: string
): Promise<boolean> {
  try {
    console.log(`📧 [Email Service] Sending ${type} to: ${to}`);
    
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: { 
        to, 
        subject, 
        templateId,
        templateData,
        type 
      }
    });

    if (error) {
      console.error(`[Email Service] ❌ Failed to invoke function for ${type}:`, error);
      return false;
    }

    if (!data?.success) {
        console.error(`[Email Service] ❌ API returned error for ${type}:`, data?.error);
        return false;
    }

    console.log(`[Email Service] ✅ Email (${type}) sent successfully. ID:`, data.emailId);
    return true;
  } catch (e) {
    console.error(`[Email Service] Exception sending ${type}:`, e);
    return false;
  }
}

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
        await this.checkBookingConflict(mentorId, [selectedSlot]);

        // 1. Fetch Mentor Price
        const { data: mentorData, error: mentorError } = await supabase
          .from('mentors')
          .select('session_price_inr')
          .eq('id', mentorId)
          .single();

        if (mentorError || !mentorData) throw new Error("Unable to retrieve mentor pricing details.");

        const basePrice = mentorData.session_price_inr || 0; 
        
        // Pricing Logic: Base + 20% Platform Fee
        const totalPrice = Math.round(basePrice * 1.2); 
        const amountToSend = totalPrice * 100;

        const mentorPayout = basePrice;
        const platformFee = totalPrice - mentorPayout;

        // 2. Create a Razorpay Order (if enabled)
        let razorpayOrderId = null;
        let razorpayKeyId = null;

        if (ENABLE_RAZORPAY) {
          const { data: orderData, error: orderError } = await supabase.functions.invoke(
            "create-razorpay-order",
            { body: { amount: amountToSend, currency: "INR" } }
          );

          if (orderError || !orderData?.orderId) {
            console.error("Razorpay order creation failed:", orderError, orderData);
            throw new Error("Payment order creation failed.");
          }

          razorpayOrderId = orderData.orderId;
          razorpayKeyId = orderData.keyId;
        }

        // 3. Insert Package Record
        const pkgPayload = {
          candidate_id: candidateId,
          mentor_id: mentorId,
          interview_profile_id: interviewProfileId,
          total_price_inr: totalPrice,
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
          console.error("Package creation failed:", pkgError);
          throw new Error("Unable to create package.");
        }

        const packageId = pkg.id;

        // If Razorpay is disabled (test mode), create the session immediately
        if (!ENABLE_RAZORPAY) {
           const meetingLink = `https://meet.jit.si/interview-${packageId}-${Date.now()}`;
           
           const sessionData = {
              package_id: packageId,
              candidate_id: candidateId,
              mentor_id: mentorId,
              skill_id: skillId,
              scheduled_at: selectedSlot,
              status: 'pending',
              meeting_link: meetingLink
           };

           const { error: sessionError } = await supabase.from('interview_sessions').insert(sessionData);
           if (sessionError) throw sessionError;
           
           this.triggerBookingConfirmationEmails(packageId, meetingLink);
        }

        return { package: pkg, orderId: razorpayOrderId, keyId: razorpayKeyId, amount: amountToSend, error: null };

    } catch (error: any) {
      console.error("Payment Logic Exception:", error);
      return { package: null, orderId: null, amount: 0, error };
    }
  },

  async verifyPayment(pkgId: string, orderId: string, payId: string, sig: string) {
    // 1. Verify Signature
    const { data, error } = await supabase.functions.invoke(
      "verify-razorpay-signature",
      {
        body: {
          orderId,
          paymentId: payId,
          signature: sig,
        },
      }
    );

    if (error || !data?.valid) {
      throw new Error("Payment verification failed");
    }

    // 2. Fetch the package to get stored booking metadata
    const { data: pkgData, error: pkgFetchError } = await supabase
      .from('interview_packages')
      .select('*')
      .eq('id', pkgId)
      .single();

    if (pkgFetchError || !pkgData) throw new Error("Package not found for verification.");

    // 3. Extract Metadata
    const { skill_id, scheduled_at } = pkgData.booking_metadata || {};
    if (!skill_id || !scheduled_at) throw new Error("Booking metadata missing in package.");

    // 4. Double check conflict (Race condition check)
    await this.checkBookingConflict(pkgData.mentor_id, [scheduled_at]);

    // 5. Update Package Status
    const { error: pkgError } = await supabase
      .from("interview_packages")
      .update({
        payment_status: "held_in_escrow",
        razorpay_payment_id: payId,
        razorpay_signature: sig,
        razorpay_order_id: orderId,
      })
      .eq("id", pkgId);

    if (pkgError) throw pkgError;

    // 6. Create the Interview Session (The Booking)
    const meetingLink = `https://meet.jit.si/interview-${pkgId}-${Date.now()}`;
    
    const { error: sessionError } = await supabase
      .from("interview_sessions")
      .insert({
        package_id: pkgId,
        candidate_id: pkgData.candidate_id,
        mentor_id: pkgData.mentor_id,
        skill_id: skill_id,
        scheduled_at: scheduled_at,
        status: "pending",
        meeting_link: meetingLink,
      });

    if (sessionError) throw sessionError;

    // 7. Send booking confirmation emails
    this.triggerBookingConfirmationEmails(pkgId, meetingLink);
    
    return { success: true, meetingLink };
  },

  async triggerBookingConfirmationEmails(pkgId: string, link: string) {
    try {
        // 1. Get package basic data
        const { data: pkgData, error: pkgError } = await supabase
          .from('interview_packages')
          .select('id, candidate_id, mentor_id, interview_profile_id')
          .eq('id', pkgId)
          .single();

        if (pkgError || !pkgData) return;

        // 2. Get mentor details
        const { data: mentorData } = await supabase
          .from('mentors')
          .select(`
            id,
            professional_title,
            profile:profiles!id (email, full_name)
          `)
          .eq('id', pkgData.mentor_id)
          .single();

        // 3. Get candidate details
        const { data: candidateData } = await supabase
          .from('candidates')
          .select(`
            id,
            professional_title,
            profile:profiles!id (email, full_name)
          `)
          .eq('id', pkgData.candidate_id)
          .single();

        // 4. Get interview profile name
        const { data: profileData } = await supabase
          .from('interview_profiles_admin')
          .select('name')
          .eq('id', pkgData.interview_profile_id)
          .single();

        // 5. Get session details
        const { data: sessionData } = await supabase
          .from('interview_sessions')
          .select(`
            scheduled_at,
            skill:interview_skills_admin!skill_id (name)
          `)
          .eq('package_id', pkgId)
          .single();

        const mentorEmail = mentorData?.profile?.email;
        const candidateEmail = candidateData?.profile?.email;
        const profileName = profileData?.name || 'Interview';
        const skillName = sessionData?.skill?.name || 'Session';
        
        const scheduledDate = sessionData?.scheduled_at 
          ? new Date(sessionData.scheduled_at).toLocaleString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              timeZone: 'Asia/Kolkata'
            })
          : 'TBD';

        // Email to Candidate
        if (candidateEmail) {
          await sendTemplatedEmail(
            candidateEmail,
            `✅ Interview Confirmed - ${profileName}`,
            RESEND_TEMPLATES.CANDIDATE_BOOKING_CONFIRMATION,
            {
              name: candidateData?.profile?.full_name,
              mentorTitle: mentorData?.professional_title || 'Mentor',
              profileName,
              skillName,
              dateTime: scheduledDate,
              baseUrl: BASE_URL
            },
            'candidate_booking_confirmation'
          );
        }

        // Email to Mentor
        if (mentorEmail) {
          await sendTemplatedEmail(
            mentorEmail,
            `🎯 New Booking Confirmed - ${profileName}`,
            RESEND_TEMPLATES.MENTOR_BOOKING_CONFIRMATION,
            {
              name: mentorData?.profile?.full_name,
              candidateTitle: candidateData?.professional_title || 'Candidate',
              profileName,
              skillName,
              dateTime: scheduledDate,
              meetingLink: link,
              baseUrl: BASE_URL
            },
            'mentor_booking_confirmation'
          );
        }

      } catch (err) { 
        console.warn("Booking confirmation emails failed:", err); 
      }
  },

  async sendMentorWelcomeEmail(mentorId: string) {
    try {
      // Get mentor details (added full_name for personalization)
      const { data: mentorData } = await supabase
        .from('mentors')
        .select(`
          professional_title,
          profile:profiles!id (email, full_name)
        `)
        .eq('id', mentorId)
        .single();

      if (!mentorData?.profile?.email) {
        console.error('[Email] Mentor email not found');
        return;
      }

      const success = await sendTemplatedEmail(
        mentorData.profile.email,
        '🎉 Welcome to CrackJobs - Your Mentor Account is Active',
        RESEND_TEMPLATES.MENTOR_WELCOME,
        {
          name: mentorData.profile.full_name,
          baseUrl: BASE_URL
        },
        'mentor_welcome'
      );

      if (success) {
          console.log('[Email] ✅ Welcome email process completed for:', mentorId);
      } else {
          console.warn('[Email] ⚠️ Welcome email failed (check Edge Function logs)');
      }

    } catch (err) {
      console.warn("Mentor welcome email exception:", err);
    }
  }
};