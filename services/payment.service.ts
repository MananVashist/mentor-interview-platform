// services/payment.service.ts
import { supabase } from '@/lib/supabase/client';

export const ENABLE_RAZORPAY = true; 

async function sendMeetingInvite(email: string, meetingLink: string, slotTime: string) {
    console.log(`📧 [Email Service] Sending Invite to: ${email}`);
}

export const paymentService = {
  // 1. Check for Conflicts (accepts array to keep logic flexible, though we send only 1 now)
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

  // 2. Create Package (Now Logic is for 1 Session + Skill ID)
  async createPackage(
    candidateId: string,
    mentorId: string,
    interviewProfileId: number, 
    skillId: string,          // <--- NEW: Skill ID
    selectedSlot: string      // <--- CHANGED: Single slot string (ISO)
  ) {
    try {
        // Wrap in array for the conflict checker
        await this.checkBookingConflict(mentorId, [selectedSlot]);

        const { data: mentorData, error: mentorError } = await supabase
        .from('mentors').select('session_price_inr').eq('id', mentorId).single();
        if (mentorError || !mentorData) throw new Error("Unable to retrieve mentor pricing details.");

        const basePrice = mentorData.session_price_inr || 0; 
        
        // Pricing Logic: Base + 20% Platform Fee
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

        // Create the Package Container
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

        // 🟢 DB Insert: Single Session with Skill ID
        const sessionData = {
            package_id: packageId,
            candidate_id: candidateId,
            mentor_id: mentorId,
            skill_id: skillId,      // <--- Mapping to Skill Table
            scheduled_at: selectedSlot,
            status: 'pending',
            meeting_link: meetingLink
        };

        const { error: sessionError } = await supabase.from('interview_sessions').insert(sessionData);
        if (sessionError) throw sessionError;

        if (!ENABLE_RAZORPAY && meetingLink) this.triggerEmailNotification(packageId, meetingLink);

        return { package: pkg, orderId: razorpayOrderId, keyId: razorpayKeyId, amount: totalPrice, error: null };

    } catch (error: any) {
      console.error("Payment Logic Exception:", error);
      return { package: null, orderId: null, amount: 0, error };
    }
  },

  async verifyPayment(pkgId: string, orderId: string, payId: string, sig: string) {
  // 1. Verify signature via Edge Function (secret stays server-side)
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

  // 2. Only now consider the payment as valid
  const meetingLink = `https://meet.jit.si/interview-${pkgId}-${Date.now()}`;

  const { error: pkgError } = await supabase
    .from("interview_packages")
    .update({
      payment_status: "held_in_escrow",
      razorpay_payment_id: payId,
      razorpay_signature: sig,
      // optional: ensure order id stored too:
      razorpay_order_id: orderId,
    })
    .eq("id", pkgId);

  if (pkgError) throw pkgError;

  const { error: sessionError } = await supabase
    .from("interview_sessions")
    .update({
      status: "pending",
      meeting_link: meetingLink,
    })
    .eq("package_id", pkgId);

  if (sessionError) throw sessionError;

  this.triggerEmailNotification(pkgId, meetingLink);
  return { success: true, meetingLink };
}
,

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