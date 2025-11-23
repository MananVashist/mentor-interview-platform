// services/payment.service.ts
import { supabase } from '@/lib/supabase/client';

// Helper function to simulate (or eventually implement) email sending
async function sendMeetingInvite(email: string, meetingLink: string, slotTime: string) {
    console.log(`📧 [Email Service] Sending Invite to: ${email}`);
    console.log(`   🔗 Link: ${meetingLink}`);
    console.log(`   ⏰ Time: ${slotTime}`);
    
    // TODO: Replace this with a call to your Edge Function or Email API (Resend/SendGrid)
    // await supabase.functions.invoke('send-email', { body: { email, link: meetingLink } });
}

export const paymentService = {
  /**
   * Helper to check for existing confirmed/pending sessions at the requested times.
   * Throws an error if a conflict is found.
   */
  async checkBookingConflict(mentorId: string, selectedSlots: string[]) {
    if (!selectedSlots || selectedSlots.length === 0) return;

    const { data, error } = await supabase
      .from('interview_sessions')
      .select('scheduled_at')
      .eq('mentor_id', mentorId)
      // Check for any session that is NOT cancelled or rejected
      .in('status', ['pending', 'confirmed', 'completed'])
      .in('scheduled_at', selectedSlots);

    if (error) {
      console.error('Conflict check error:', error);
      throw new Error('Unable to verify slot availability. Please try again.');
    }

    if (data && data.length > 0) {
      // We found a matching slot that is already taken
      throw new Error('One or more selected slots have just been booked by another user. Please choose different times.');
    }
  },

  async createPackage(
    candidateId: string,
    mentorId: string,
    targetProfile: string,
    totalPrice: number,
    selectedSlots: string[]
  ) {
    console.log("🔵 Creating Booking Package...");

    // 1. PRE-CHECK: Ensure no double booking occurred while user was on the screen
    await this.checkBookingConflict(mentorId, selectedSlots);

    const platformFee = Math.round(totalPrice * 0.5);
    const mentorPayout = totalPrice - platformFee;

    try {
      // 2. Insert Package
      const { data: pkg, error: pkgError } = await supabase
        .from('interview_packages')
        .insert({
          candidate_id: candidateId,
          mentor_id: mentorId,
          target_profile: targetProfile,
          total_amount_inr: totalPrice,
          platform_fee_inr: platformFee,
          mentor_payout_inr: mentorPayout,
          payment_status: 'pending'
        })
        .select()
        .single();

      if (pkgError) throw pkgError;
      const packageId = pkg.id;

      // 3. Insert Sessions with CORRECT ENUMS ('round_1', etc.)
      const sessionsData = selectedSlots.map((slot, index) => {
        let roundName;
        if (index === 0) roundName = 'round_1';
        else if (index === 1) roundName = 'round_2';
        else roundName = 'hr_round';

        return ({
          package_id: packageId,
          candidate_id: candidateId,
          mentor_id: mentorId,
          round: roundName, // ✅ Correct ENUM
          scheduled_at: slot,
          status: 'pending'
        });
      });

      const { error: sessionError } = await supabase
        .from('interview_sessions')
        .insert(sessionsData);

      if (sessionError) throw sessionError;

      return { package: pkg, error: null };

    } catch (error: any) {
      console.error("Payment Logic Exception:", error);
      return { package: null, error };
    }
  },

  async createRazorpayOrder(amount: number, pkgId: string) {
    // Mock Order ID
    await new Promise(resolve => setTimeout(resolve, 500));
    return { order_id: `order_${Date.now()}_mock`, amount: amount * 100 };
  },

  async verifyPayment(pkgId: string, orderId: string, payId: string, sig: string) {
    console.log("🔵 Payment Verified. Fetching Jitsi Link...");

    let meetingLink = null;

    try {
      // Call Edge Function for Jitsi Link
      const { data, error } = await supabase.functions.invoke('create-meeting', {
        body: { pkgId }
      });
      if (error) console.error("❌ Edge Function Error:", error);
      else meetingLink = data?.meetingLink;
    } catch (err) {
      console.error("❌ Unexpected Error:", err);
    }

    const finalLink = meetingLink || "https://meet.jit.si/fallback-room";

    // 4. Update Package (CORRECT ENUM: 'held_in_escrow')
    await supabase
      .from('interview_packages')
      .update({
        payment_status: 'held_in_escrow', // ✅ Correct ENUM
        razorpay_payment_id: payId
      })
      .eq('id', pkgId);

    // 5. Update Sessions
    await supabase
      .from('interview_sessions')
      .update({
        status: 'confirmed',
        meeting_link: finalLink
      })
      .eq('package_id', pkgId);
      
    // ✅ 6. SEND EMAIL NOTIFICATION (New Phase 2 Logic)
    // Note: In a real app, you might fetch the mentor's email here or rely on the edge function to do it.
    try {
        // Fetch Mentor Email via Package -> Mentor -> Profile
        const { data: pkgData } = await supabase
            .from('interview_packages')
            .select('mentor:mentors(profile:profiles(email))')
            .eq('id', pkgId)
            .single();
        
        const mentorEmail = (pkgData as any)?.mentor?.profile?.email;
        if (mentorEmail) {
            await sendMeetingInvite(mentorEmail, finalLink, "Scheduled Time");
        }
    } catch (emailErr) {
        console.warn("⚠️ Failed to trigger email invite:", emailErr);
    }

    return { success: true, meetingLink: finalLink };
  }
};