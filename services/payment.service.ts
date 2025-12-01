// services/payment.service.ts
import { supabase } from '@/lib/supabase/client';

// 🟢 FEATURE FLAG: Set to TRUE to enable Razorpay Flow
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
    console.log('[PaymentService] checkBookingConflict', { mentorId, selectedSlots });
    if (!selectedSlots || selectedSlots.length === 0) return;

    const { data, error } = await supabase
      .from('interview_sessions')
      .select('scheduled_at')
      .eq('mentor_id', mentorId)
      .in('status', ['pending', 'confirmed', 'completed'])
      .in('scheduled_at', selectedSlots);

    if (error) {
      console.error('[PaymentService] Conflict check error:', error);
      throw new Error('Unable to verify slot availability. Please try again.');
    }

    if (data && data.length > 0) {
      throw new Error('One or more selected slots have just been booked by another user.');
    }
  },

  /**
   * Creates the booking package and (if enabled) generates the Razorpay Order ID 
   * via Edge Function in a single atomic flow.
   */
  async createPackage(
    candidateId: string,
    mentorId: string,
    interviewProfileId: number, 
    selectedSlots: string[]
  ) {
    console.log(`🔵 Creating Booking Package (Razorpay Enabled: ${ENABLE_RAZORPAY})...`);

    try {
        // 1. PRE-CHECK: Ensure no double booking occurred
        await this.checkBookingConflict(mentorId, selectedSlots);

        // 2. FETCH PRICING: Get the mentor's base session price
        const { data: mentorData, error: mentorError } = await supabase
        .from('mentors')
        .select('session_price_inr')
        .eq('id', mentorId)
        .single();

        if (mentorError || !mentorData) {
        throw new Error("Unable to retrieve mentor pricing details.");
        }

        const basePrice = mentorData.session_price_inr || 0; 
        
        // Calculate splits
        // Total Price = Base Price * 1.2
        const totalPrice = Math.round(basePrice * 1.2); 
        const mentorPayout = basePrice;
        const platformFee = totalPrice - mentorPayout;

        // --- 🟢 STEP 3: GENERATE RAZORPAY ORDER ID (EDGE FUNCTION) ---
        let razorpayOrderId = null;
        let razorpayKeyId = null; // 🟢 Valid variable scope

        if (ENABLE_RAZORPAY) {
            console.log("⚡ Invoking Edge Function: create-razorpay-order...");
            
            // Call the deployed Supabase Edge Function
            const { data: orderData, error: orderError } = await supabase.functions.invoke('create-razorpay-order', {
                body: {
                    amount: totalPrice * 100, // Convert to Paise (Required by Razorpay)
                    receipt: `rcpt_${candidateId.slice(0, 4)}_${Date.now()}` 
                }
            });

            if (orderError) {
                console.error("❌ Edge Function Failed:", orderError);
                throw new Error("Failed to initialize payment gateway. Please try again.");
            }

            console.log("✅ Order Created via Edge Function:", orderData);
            razorpayOrderId = orderData.id; // Store the official Razorpay Order ID
            razorpayKeyId = orderData.key_id; // 🟢 Store the Public Key ID returned by Edge Function
        }
        // -------------------------------------------------------------

        const initialStatus = ENABLE_RAZORPAY ? 'pending_payment' : 'held_in_escrow';
        const paymentId = ENABLE_RAZORPAY ? null : `mvp_mock_${Date.now()}`;

        // 4. INSERT PACKAGE (Now includes the razorpay_order_id immediately)
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
                razorpay_order_id: razorpayOrderId, // <--- SAVED HERE
            })
            .select()
            .single();

        if (pkgError) throw pkgError;
        
        const packageId = pkg.id;

        // 5. IF MVP (Auto-Confirm): Generate Link
        let meetingLink = null;
        if (!ENABLE_RAZORPAY) {
            meetingLink = `https://meet.jit.si/interview-${packageId}-${Date.now()}`;
        }

        // 6. INSERT SESSIONS
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
            .insert(sessionsData);

        if (sessionError) throw sessionError;

        // 7. IF MVP: Send Email
        if (!ENABLE_RAZORPAY && meetingLink) {
            this.triggerEmailNotification(packageId, meetingLink);
        }

        // Return everything the frontend needs
        return { 
            package: pkg, 
            orderId: razorpayOrderId, // Frontend uses this to open Razorpay
            keyId: razorpayKeyId, // 🟢 Return the key ID so frontend matches backend
            amount: totalPrice * 100, // Paise
            error: null 
        };

    } catch (error: any) {
      console.error("❌ Payment Logic Exception:", error);
      return { package: null, orderId: null, amount: 0, error };
    }
  },

  /**
   * Verify payment and confirm booking.
   */
  async verifyPayment(pkgId: string, orderId: string, payId: string, sig: string) {
    console.log("🔵 Payment Verified. Finalizing Booking...", {
      pkgId,
      orderId,
      payId,
    });

    // 1. Generate Link
    const meetingLink = `https://meet.jit.si/interview-${pkgId}-${Date.now()}`;

    // 2. Update Package to CONFIRMED
    const { error: pkgError } = await supabase
      .from('interview_packages')
      .update({
        payment_status: 'held_in_escrow',
        razorpay_payment_id: payId
        // razorpay_signature: sig // Removed based on schema
      })
      .eq('id', pkgId);

    if (pkgError) {
      console.error('[PaymentService] Failed to update package after payment:', pkgError);
      throw pkgError;
    }

    // 3. Update Sessions to CONFIRMED
    const { error: sessionError } = await supabase
      .from('interview_sessions')
      .update({
        status: 'confirmed',
        meeting_link: meetingLink
      })
      .eq('package_id', pkgId);
      
    if (sessionError) {
      console.error('[PaymentService] Failed to update sessions after payment:', sessionError);
      throw sessionError;
    } 
      
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