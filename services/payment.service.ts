// services/payment.service.ts
import { supabase } from '@/lib/supabase/client';

export const ENABLE_RAZORPAY = true; 

async function sendMeetingInvite(email: string, meetingLink: string, slotTime: string) {
    console.log(`📧 [Email Service] Sending Invite to: ${email}`);
}

export const paymentService = {
  async checkBookingConflict(mentorId: string, selectedSlots: string[]) {
    if (!selectedSlots || selectedSlots.length === 0) return;
    const { data, error } = await supabase
      .from('interview_sessions')
      .select('scheduled_at')
      .eq('mentor_id', mentorId)
      // 🟢 Checking valid ENUM states
      .in('status', ['pending', 'confirmed', 'completed']) 
      .in('scheduled_at', selectedSlots);

    if (error) throw new Error('Unable to verify slot availability.');
    if (data && data.length > 0) throw new Error('Slot already booked.');
  },

  async createPackage(
    candidateId: string,
    mentorId: string,
    interviewProfileId: number, 
    selectedSlots: string[]
  ) {
    try {
        await this.checkBookingConflict(mentorId, selectedSlots);

        const { data: mentorData, error: mentorError } = await supabase
        .from('mentors').select('session_price_inr').eq('id', mentorId).single();
        if (mentorError || !mentorData) throw new Error("Unable to retrieve mentor pricing details.");

        const basePrice = mentorData.session_price_inr || 0; 
        const totalPrice = Math.round(basePrice * 1.2); 
        const mentorPayout = basePrice;
        const platformFee = totalPrice - mentorPayout;

        let razorpayOrderId = null;
        let razorpayKeyId = null; 

        if (ENABLE_RAZORPAY) {
            const { data: orderData, error: orderError } = await supabase.functions.invoke('create-razorpay-order', {
                body: { amount: totalPrice * 100, receipt: `rcpt_${candidateId.slice(0, 4)}_${Date.now()}` }
            });
            if (orderError) throw new Error("Payment init failed.");
            razorpayOrderId = orderData.id; 
            razorpayKeyId = orderData.key_id; 
        }

        const initialStatus = ENABLE_RAZORPAY ? 'pending_payment' : 'held_in_escrow';
        const paymentId = ENABLE_RAZORPAY ? null : `mvp_mock_${Date.now()}`;

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
            })
            .select().single();

        if (pkgError) throw pkgError;
        const packageId = pkg.id;

        let meetingLink = null;
        if (!ENABLE_RAZORPAY) meetingLink = `https://meet.jit.si/interview-${packageId}-${Date.now()}`;

        // 🟢 DB Insert: "pending" (Valid ENUM)
        const sessionStatus = 'pending'; 
        
        const sessionsData = selectedSlots.map((slot, index) => {
            let roundName = 'round_1';
            if (index === 1) roundName = 'round_2';
            else if (index === 2) roundName = 'hr_round';

            return {
                package_id: packageId,
                candidate_id: candidateId,
                mentor_id: mentorId,
                round: roundName,
                scheduled_at: slot,
                status: sessionStatus,
                meeting_link: meetingLink
            };
        });

        const { error: sessionError } = await supabase.from('interview_sessions').insert(sessionsData);
        if (sessionError) throw sessionError;

        if (!ENABLE_RAZORPAY && meetingLink) this.triggerEmailNotification(packageId, meetingLink);

        return { package: pkg, orderId: razorpayOrderId, keyId: razorpayKeyId, amount: totalPrice * 100, error: null };

    } catch (error: any) {
      console.error("Payment Logic Exception:", error);
      return { package: null, orderId: null, amount: 0, error };
    }
  },

  async verifyPayment(pkgId: string, orderId: string, payId: string, sig: string) {
    const meetingLink = `https://meet.jit.si/interview-${pkgId}-${Date.now()}`;

    const { error: pkgError } = await supabase
      .from('interview_packages')
      .update({ payment_status: 'held_in_escrow', razorpay_payment_id: payId })
      .eq('id', pkgId);

    if (pkgError) throw pkgError;

    // 🟢 DB Update: Ensure it is "pending" so Mentor sees Approval Request
    const { error: sessionError } = await supabase
      .from('interview_sessions')
      .update({
        status: 'pending', // Valid ENUM
        meeting_link: meetingLink
      })
      .eq('package_id', pkgId);
      
    if (sessionError) throw sessionError; 
    this.triggerEmailNotification(pkgId, meetingLink);
    return { success: true, meetingLink };
  },

  async triggerEmailNotification(pkgId: string, link: string) {
    try {
        const { data: pkgData } = await supabase
          .from('interview_packages')
          .select('mentor:mentors(profile:profiles(email))')
          .eq('id', pkgId)
          .single();
        
        const mentorEmail = (pkgData as any)?.mentor?.profile?.email;
        if (mentorEmail) await sendMeetingInvite(mentorEmail, link, "Scheduled Time");
      } catch (err) { console.warn("Email trigger failed:", err); }
  }
};