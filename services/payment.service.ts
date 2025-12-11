// services/payment.service.ts
import { supabase } from '@/lib/supabase/client';

export const ENABLE_RAZORPAY = true; 

// Email templates
const emailTemplates = {
  mentorNotification: (mentorName: string, candidateName: string, profileName: string, skillName: string, dateTime: string, meetingLink: string) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0E9384 0%, #059669 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
        .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
        .button { display: inline-block; background: #0E9384; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
        .details { background: #f9fafb; padding: 20px; border-radius: 6px; margin: 20px 0; }
        .detail-row { margin: 10px 0; }
        .label { color: #6b7280; font-size: 14px; }
        .value { color: #1f2937; font-weight: 600; font-size: 16px; }
        .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">🎯 New Interview Request</h1>
        </div>
        <div class="content">
          <p>Hi ${mentorName},</p>
          <p>You have a new interview booking request! A candidate is waiting for your approval.</p>
          
          <div class="details">
            <div class="detail-row">
              <div class="label">Candidate</div>
              <div class="value">${candidateName}</div>
            </div>
            <div class="detail-row">
              <div class="label">Interview Type</div>
              <div class="value">${profileName} - ${skillName}</div>
            </div>
            <div class="detail-row">
              <div class="label">Scheduled For</div>
              <div class="value">${dateTime}</div>
            </div>
            <div class="detail-row">
              <div class="label">Meeting Link</div>
              <div class="value"><a href="${meetingLink}" style="color: #0E9384;">${meetingLink}</a></div>
            </div>
          </div>

          <p><strong>Next Steps:</strong></p>
          <ol>
            <li>Review the booking details in your dashboard</li>
            <li>Accept or reschedule the interview</li>
            <li>Join the meeting at the scheduled time</li>
          </ol>

          <a href="https://crackjobs.in/mentor/bookings" class="button">View Booking</a>

          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            Please respond within 24 hours. If you don't accept, the candidate will be notified to choose another mentor.
          </p>
        </div>
        <div class="footer">
          <p>CrackJobs - Mock Interview Platform</p>
          <p>This email was sent to ${mentorName} regarding a new booking</p>
        </div>
      </div>
    </body>
    </html>
  `,

  candidateConfirmation: (candidateName: string, mentorName: string, profileName: string, skillName: string, dateTime: string) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0E9384 0%, #059669 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
        .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
        .success-badge { background: #D1FAE5; color: #065F46; padding: 8px 16px; border-radius: 20px; display: inline-block; font-weight: 600; margin: 10px 0; }
        .details { background: #f9fafb; padding: 20px; border-radius: 6px; margin: 20px 0; }
        .detail-row { margin: 10px 0; }
        .label { color: #6b7280; font-size: 14px; }
        .value { color: #1f2937; font-weight: 600; font-size: 16px; }
        .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">✅ Booking Confirmed!</h1>
        </div>
        <div class="content">
          <p>Hi ${candidateName},</p>
          
          <div style="text-align: center;">
            <span class="success-badge">Payment Successful</span>
          </div>

          <p>Your mock interview has been booked successfully! Your mentor will review and confirm the booking shortly.</p>
          
          <div class="details">
            <div class="detail-row">
              <div class="label">Mentor</div>
              <div class="value">${mentorName}</div>
            </div>
            <div class="detail-row">
              <div class="label">Interview Type</div>
              <div class="value">${profileName} - ${skillName}</div>
            </div>
            <div class="detail-row">
              <div class="label">Scheduled For</div>
              <div class="value">${dateTime}</div>
            </div>
          </div>

          <p><strong>What happens next?</strong></p>
          <ol>
            <li>Your mentor will review the booking (usually within 24 hours)</li>
            <li>Once approved, you'll receive the meeting link</li>
            <li>Join the meeting at the scheduled time</li>
            <li>Get detailed feedback after the interview</li>
          </ol>

          <p style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 12px; border-radius: 4px; margin: 20px 0;">
            <strong>⏰ Pro Tip:</strong> Add this to your calendar and prepare your questions in advance!
          </p>

          <p style="color: #6b7280; font-size: 14px;">
            You can track your booking status in your dashboard anytime.
          </p>
        </div>
        <div class="footer">
          <p>CrackJobs - Mock Interview Platform</p>
          <p>Need help? Reply to this email or visit our support page</p>
        </div>
      </div>
    </body>
    </html>
  `
};

async function sendEmail(to: string, subject: string, html: string, type: string) {
  try {
    console.log(`📧 [Email Service] Sending ${type} to: ${to}`);
    
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: { to, subject, html, type }
    });

    if (error) {
      console.error('[Email Service] Error:', error);
      return false;
    }

    console.log('[Email Service] ✅ Email sent successfully:', data);
    return true;
  } catch (e) {
    console.error('[Email Service] Exception:', e);
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

        console.log("--------------------------------------------------");
        console.log("🔍 DEBUG: DB Raw Value:", mentorData.session_price_inr); 
        console.log("🔍 DEBUG: Mentor ID:", mentorId);

        const basePrice = mentorData.session_price_inr || 0; 
        
        // Pricing Logic: Base + 20% Platform Fee
        const totalPrice = Math.round(basePrice * 1.2); 
        const amountToSend = totalPrice * 100;

        console.log("🔍 DEBUG: Total Price (INR):", totalPrice);

        const mentorPayout = basePrice;
        const platformFee = totalPrice - mentorPayout;

        let razorpayOrderId = null;
        let razorpayKeyId = null; 

        if (ENABLE_RAZORPAY) {
            console.log("🔍 DEBUG: Sending to Razorpay (Paise):", amountToSend);
            console.log("--------------------------------------------------");

            const { data: orderData, error: orderError } = await supabase.functions.invoke('create-razorpay-order', {
                body: { 
                    amount: amountToSend,
                    receipt: `rcpt_${candidateId.slice(0, 4)}_${Date.now()}` 
                }
            });

            if (orderError) {
                console.error("❌ Razorpay Order Error:", orderError);
                throw new Error("Payment init failed.");
            }
            razorpayOrderId = orderData.id; 
            razorpayKeyId = orderData.key_id; 
        }

        const initialStatus = ENABLE_RAZORPAY ? 'pending_payment' : 'held_in_escrow';
        const paymentId = ENABLE_RAZORPAY ? null : `mvp_mock_${Date.now()}`;

        // Create Package - Store session details in booking_metadata (assuming JSONB column exists)
        // This ensures we persist the intent without creating the session record yet.
        const { data: pkg, error: pkgError } = await supabase
            .from('interview_packages')
            .insert({
                candidate_id: candidateId,
                mentor_id: mentorId,
                interview_profile_id: interviewProfileId,
                total_amount_inr: totalPrice,
                platform_fee_inr: platformFee,
                mentor_payout_inr: mentorPayout,
                payment_status: initialStatus,
                razorpay_payment_id: paymentId,
                razorpay_order_id: razorpayOrderId, 
                // IMPORTANT: Ensure your DB has a `booking_metadata` (JSONB) column
                booking_metadata: { 
                  skill_id: skillId, 
                  scheduled_at: selectedSlot 
                }
            })
            .select().single();

        if (pkgError) throw pkgError;
        const packageId = pkg.id;

        // Logic Change: Only create session immediately if Razorpay is DISABLED.
        // If Razorpay is enabled, we wait for verifyPayment.
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
           
           this.triggerEmailNotification(packageId, meetingLink);
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
      console.error("[PaymentService] Razorpay verification failed:", error, data);
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
    // Since we didn't block the slot in createPackage, we must check again now.
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
    // Now that payment is held_in_escrow, we finally create the booking.
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

    // 7. Send emails
    this.triggerEmailNotification(pkgId, meetingLink);
    
    return { success: true, meetingLink };
  },

  async triggerEmailNotification(pkgId: string, link: string) {
    try {
        // ✅ FIXED: Fetch data in separate queries to avoid relationship ambiguity
        
        // 1. Get package basic data
        const { data: pkgData, error: pkgError } = await supabase
          .from('interview_packages')
          .select('id, candidate_id, mentor_id, interview_profile_id')
          .eq('id', pkgId)
          .single();

        if (pkgError || !pkgData) {
          console.error('[Email] Failed to fetch package data:', pkgError);
          return;
        }

        // 2. Get mentor details
        const { data: mentorData } = await supabase
          .from('mentors')
          .select(`
            id,
            profile:profiles!id (full_name, email)
          `)
          .eq('id', pkgData.mentor_id)
          .single();

        // 3. Get candidate details
        const { data: candidateData } = await supabase
          .from('candidates')
          .select(`
            id,
            profile:profiles!id (full_name, email)
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
        const mentorName = mentorData?.profile?.full_name || 'Mentor';
        const candidateEmail = candidateData?.profile?.email;
        const candidateName = candidateData?.profile?.full_name || 'Candidate';
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

        // Send email to mentor
        if (mentorEmail) {
          const mentorHtml = emailTemplates.mentorNotification(
            mentorName,
            candidateName,
            profileName,
            skillName,
            scheduledDate,
            link
          );
          
          await sendEmail(
            mentorEmail,
            `🎯 New Interview Request - ${profileName}`,
            mentorHtml,
            'mentor_notification'
          );
        }

        // Send email to candidate
        if (candidateEmail) {
          const candidateHtml = emailTemplates.candidateConfirmation(
            candidateName,
            mentorName,
            profileName,
            skillName,
            scheduledDate
          );
          
          await sendEmail(
            candidateEmail,
            `✅ Interview Booked - ${profileName}`,
            candidateHtml,
            'booking_confirmation'
          );
        }

      } catch (err) { 
        console.warn("Email trigger failed:", err); 
      }
  }
};