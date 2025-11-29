// services/payment.service.ts
import { supabase } from '@/lib/supabase/client';

// 🟢 FEATURE FLAG: Set to TRUE to enable Razorpay Flow (Test Mode)
export const ENABLE_RAZORPAY = true; 

// Helper function to simulate email sending
async function sendMeetingInvite(email: string, meetingLink: string, slotTime: string) {
    console.log(`📧 [Email Service] Sending Invite to: ${email}`);
    console.log(`   🔗 Link: ${meetingLink}`);
    console.log(`   ⏰ Time: ${slotTime}`);
}

export const paymentService = {
  /**
   * Helper to check for existing confirmed/pending sessions at the requested times.
   */
  async checkBookingConflict(mentorId: string, selectedSlots: string[]) {
    if (!selectedSlots || selectedSlots.length === 0) return;

    const { data, error } = await supabase
      .from('interview_sessions')
      .select('scheduled_at')
      .eq('mentor_id', mentorId)
      .in('status', ['pending', 'confirmed', 'completed'])
      .in('scheduled_at', selectedSlots);

    if (error) {
      console.error('Conflict check error:', error);
      throw new Error('Unable to verify slot availability. Please try again.');
    }

    if (data && data.length > 0) {
      throw new Error('One or more selected slots have just been booked by another user.');
    }
  },

  /**
   * Creates the booking package.
   * Uses interviewProfileId for database normalization.
   */
  async createPackage(
    candidateId: string,
    mentorId: string,
    interviewProfileId: number, // <--- ID Linking to interview_profiles_admin
    totalPrice: number,
    selectedSlots: string[]
  ) {
    console.log(`🔵 Creating Booking Package (Razorpay Enabled: ${ENABLE_RAZORPAY})...`);

    // 1. PRE-CHECK: Ensure no double booking occurred
    await this.checkBookingConflict(mentorId, selectedSlots);

    // Calculate splits explicitly
    const platformFee = Math.round(totalPrice * 0.2); // 20% platform fee
    const mentorPayout = totalPrice - platformFee;

    try {
      const initialStatus = ENABLE_RAZORPAY ? 'pending_payment' : 'held_in_escrow';
      const paymentId = ENABLE_RAZORPAY ? null : `mvp_mock_${Date.now()}`;

      // 2. Insert Package
      const { data: pkg, error: pkgError } = await supabase
        .from('interview_packages')
        .insert({
          candidate_id: candidateId,
          mentor_id: mentorId,
          interview_profile_id: interviewProfileId, // <--- Saving the profile ID
          total_amount_inr: totalPrice,
          platform_fee_inr: platformFee,
          mentor_payout_inr: mentorPayout,
          payment_status: initialStatus,
          razorpay_payment_id: paymentId,
        })
        .select()
        .single();

      if (pkgError) {
        console.error("❌ Package creation failed:", pkgError);
        throw pkgError;
      }
      
      const packageId = pkg.id;
      console.log("✅ Package created:", packageId, "Status:", initialStatus);

      // 3. IF MVP (Auto-Confirm): Generate Link
      let meetingLink = null;
      if (!ENABLE_RAZORPAY) {
        meetingLink = `https://meet.jit.si/interview-${packageId}-${Date.now()}`;
      }

      // 4. Insert Sessions
      const sessionStatus = ENABLE_RAZORPAY ? 'pending' : 'confirmed';
      
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

      const { error: sessionError } = await supabase
        .from('interview_sessions')
        .insert(sessionsData)
        .select();

      if (sessionError) {
        console.error("❌ Session creation failed:", sessionError);
        throw sessionError;
      }

      // 5. IF MVP: Send Email
      if (!ENABLE_RAZORPAY && meetingLink) {
        this.triggerEmailNotification(packageId, meetingLink);
      }

      return { package: pkg, error: null };

    } catch (error: any) {
      console.error("❌ Payment Logic Exception:", error);
      return { package: null, error };
    }
  },

  /**
   * Generates Razorpay Order ID AND updates the package with it.
   */
  async createRazorpayOrder(amount: number, pkgId: string) {
    if (ENABLE_RAZORPAY) {
        console.log("🔵 Generating Mock Order for Test Mode...");
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockOrderId = `order_mock_${Date.now()}`;

        // IMPORTANT: Save the Order ID to the package now
        await supabase
          .from('interview_packages')
          .update({ razorpay_order_id: mockOrderId })
          .eq('id', pkgId);

        return { 
            order_id: mockOrderId, 
            amount: amount * 100 // Convert to paise
        };
    } else {
        return { order_id: `order_skip_${Date.now()}`, amount: amount * 100 };
    }
  },

  /**
   * Verify payment and confirm booking.
   */
  async verifyPayment(pkgId: string, orderId: string, payId: string, sig: string) {
    console.log("🔵 Payment Verified. Finalizing Booking...");

    // 1. Generate Link
    let meetingLink = `https://meet.jit.si/interview-${pkgId}-${Date.now()}`;

    // 2. Update Package to CONFIRMED
    await supabase
      .from('interview_packages')
      .update({
        payment_status: 'held_in_escrow',
        razorpay_payment_id: payId,
        razorpay_signature: sig 
      })
      .eq('id', pkgId);

    // 3. Update Sessions to CONFIRMED
    await supabase
      .from('interview_sessions')
      .update({
        status: 'confirmed',
        meeting_link: meetingLink
      })
      .eq('package_id', pkgId);
      
    // 4. Send Email Notification
    this.triggerEmailNotification(pkgId, meetingLink);

    return { success: true, meetingLink };
  },

  /**
   * Helper to trigger email notification
   */
  async triggerEmailNotification(pkgId: string, link: string) {
    try {
        const { data: pkgData } = await supabase
          .from('interview_packages')
          .select('mentor:mentors(profile:profiles(email))')
          .eq('id', pkgId)
          .single();
        
        const mentorEmail = (pkgData as any)?.mentor?.profile?.email;
        if (mentorEmail) {
          await sendMeetingInvite(mentorEmail, link, "Scheduled Time");
        }
      } catch (err) {
        console.warn("⚠️ Email trigger failed:", err);
      }
  }
};