import { supabase } from '@/lib/supabase/client';
import { EMAIL_TEMPLATES } from './email.templates';

export const ENABLE_RAZORPAY = true; 
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://crackjobs.com';

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

        const { data: mentorData, error: mentorError } = await supabase
          .from('mentors')
          .select('session_price_inr')
          .eq('id', mentorId)
          .single();

        if (mentorError || !mentorData) throw new Error("Unable to retrieve mentor pricing details.");

        const basePrice = mentorData.session_price_inr || 0; 
        const totalPrice = Math.round(basePrice * 1.2); 
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

        // ✅ Updated Payload to match your new Schema
        const pkgPayload = {
          candidate_id: candidateId,
          mentor_id: mentorId,
          interview_profile_id: interviewProfileId,
          
          total_amount_inr: totalPrice, // ✅ FIXED: Changed from total_price_inr
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

        // If Razorpay is disabled (Test Mode) - Create session immediately
        if (!ENABLE_RAZORPAY) {
           const meetingLink = `https://meet.jit.si/interview-${packageId}-${Date.now()}`;
           
           const { error: sessionError } = await supabase.from('interview_sessions').insert({
              package_id: packageId,
              candidate_id: candidateId,
              mentor_id: mentorId,
              skill_id: skillId,
              scheduled_at: selectedSlot,
              status: 'pending',
              meeting_link: meetingLink
           });

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
      { body: { orderId, paymentId: payId, signature: sig } }
    );

    if (error || !data?.valid) throw new Error("Payment verification failed");

    // 2. Fetch Package
    const { data: pkgData } = await supabase.from('interview_packages').select('*').eq('id', pkgId).single();
    if (!pkgData) throw new Error("Package not found.");

    const { skill_id, scheduled_at } = pkgData.booking_metadata || {};
    
    // 3. Double check conflict
    await this.checkBookingConflict(pkgData.mentor_id, [scheduled_at]);

    // 4. Update Package
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

    // 5. Create Session
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

    // 6. Send Emails
    this.triggerBookingConfirmationEmails(pkgId, meetingLink);
    
    return { success: true, meetingLink };
  },

  async triggerBookingConfirmationEmails(pkgId: string, link: string) {
    try {
        const { data: pkg } = await supabase.from('interview_packages').select('candidate_id, mentor_id, interview_profile_id').eq('id', pkgId).single();
        if (!pkg) return;

        const { data: mentor } = await supabase.from('mentors').select('professional_title, profile:profiles!id(email, full_name)').eq('id', pkg.mentor_id).single();
        const { data: candidate } = await supabase.from('candidates').select('professional_title, profile:profiles!id(email, full_name)').eq('id', pkg.candidate_id).single();
        const { data: profile } = await supabase.from('interview_profiles_admin').select('name').eq('id', pkg.interview_profile_id).single();
        const { data: session } = await supabase.from('interview_sessions').select('scheduled_at, skill:interview_skills_admin!skill_id(name)').eq('package_id', pkgId).single();

        const dateTime = session?.scheduled_at ? new Date(session.scheduled_at).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }) : 'TBD';

        // Send to Candidate
        if (candidate?.profile?.email) {
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
              meetingLink: link,
            }
          );
        }

      } catch (err) { 
        console.warn("Booking confirmation emails failed:", err); 
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