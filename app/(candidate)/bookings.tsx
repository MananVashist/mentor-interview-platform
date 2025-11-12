import { supabase } from '@/lib/supabase/client';
import { InterviewPackage } from '@/lib/types';

// Razorpay configuration - Replace with actual keys if/when you wire real payments
const RAZORPAY_KEY_ID =
  process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID || 'YOUR_RAZORPAY_KEY_ID';
const RAZORPAY_KEY_SECRET =
  process.env.EXPO_PUBLIC_RAZORPAY_KEY_SECRET || 'YOUR_RAZORPAY_KEY_SECRET';

// 🔸 Small helper so we never hang forever on any await
function withTimeout<T>(p: Promise<T>, ms: number, label = 'operation'): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => {
      const err = new Error(`[TIMEOUT] ${label} did not resolve within ${ms}ms`);
      console.log('[PAYMENT DBG]', err.message);
      reject(err);
    }, ms);
    p.then((v) => {
      clearTimeout(t);
      resolve(v);
    }).catch((e) => {
      clearTimeout(t);
      reject(e);
    });
  });
}

export const paymentService = {
  /**
   * Calculate package pricing
   * Platform takes 50% margin.
   * 3 sessions total (2 technical + 1 HR).
   */
  calculatePackagePrice(
    mentorSessionPrice: number
  ): {
    mentorPayout: number;
    platformFee: number;
    totalAmount: number;
  } {
    const mentorPayoutPerSession = mentorSessionPrice;
    const platformFeePerSession = mentorSessionPrice; // 50% margin
    const totalPerSession = mentorPayoutPerSession + platformFeePerSession;

    return {
      mentorPayout: mentorPayoutPerSession * 3,
      platformFee: platformFeePerSession * 3,
      totalAmount: totalPerSession * 3,
    };
  },

  /**
   * Create interview package (fake payment).
   * Inserts into interview_packages via Supabase client and returns the row.
   * Added detailed debug logs + a hard timeout so UI can recover even if Supabase stalls.
   */
  async createPackage(
    candidateId: string,
    mentorId: string,
    targetProfile: string,
    mentorSessionPrice: number
  ): Promise<{ package: InterviewPackage | null; orderId: string | null; error: any }> {
    console.log('[PAYMENT DBG] createPackage called', {
      candidateId,
      mentorId,
      targetProfile,
      mentorSessionPrice,
      ts: Date.now(),
    });

    try {
      // 🔎 Log current auth user (helps with RLS debugging) — bounded to 3s
      try {
        console.log('[PAYMENT DBG] calling auth.getUser() with 3s timeout');
        const { data: userData, error: userErr } = await Promise.race([
          supabase.auth.getUser(),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('[TIMEOUT] auth.getUser() >3000ms')), 3000)
          ),
        ]) as any;
        console.log('[PAYMENT DBG] auth.getUser() result', {
          userErr,
          userId: userData?.user?.id,
          email: userData?.user?.email,
        });
      } catch (authCheckErr) {
        console.log('[PAYMENT DBG] auth.getUser() skipped', authCheckErr?.message || authCheckErr);
      }

      const pricing = this.calculatePackagePrice(mentorSessionPrice);
      console.log('[PAYMENT DBG] calculated pricing', pricing);

      const payload = {
        candidate_id: candidateId,
        mentor_id: mentorId,
        target_profile: targetProfile,
        total_amount_inr: pricing.totalAmount,
        platform_fee_inr: pricing.platformFee,
        mentor_payout_inr: pricing.mentorPayout,
        payment_status: 'pending', // fake payment, just mark as pending
      };

      console.log('[PAYMENT DBG] insert payload', payload);
      console.time('[PAYMENT DBG] insert_timer');

      // Build query
      console.log('[PAYMENT DBG] building supabase insert query…');
      const query = supabase
        .from('interview_packages')
        .insert(payload)
        .select('*')
        .single();
      console.log('[PAYMENT DBG] supabase insert query built');

      let result;
      try {
        console.log('[PAYMENT DBG] awaiting supabase insert… (timeout 10s)');
        // ⏱️ Hard timeout so we never hang indefinitely
        result = await withTimeout(query, 10_000, 'supabase.insert(interview_packages)');
        console.log('[PAYMENT DBG] supabase insert raw result', result);
      } catch (e) {
        console.timeEnd('[PAYMENT DBG] insert_timer');
        console.log('[PAYMENT DBG] supabase insert threw', e);
        return { package: null, orderId: null, error: e };
      }

      const { data: packageData, error: packageError } = result || {};
      console.timeEnd('[PAYMENT DBG] insert_timer');
      console.log('[PAYMENT DBG] insert destructured', {
        hasData: !!packageData,
        hasError: !!packageError,
        errorMessage: packageError?.message,
        errorCode: packageError?.code,
        errorHint: packageError?.hint,
      });

      if (packageError || !packageData) {
        console.log('[PAYMENT DBG] insert returned error or no data', packageError);
        return {
          package: null,
          orderId: null,
          error: packageError || new Error('Insert returned no data'),
        };
      }

      console.log('[PAYMENT DBG] createPackage returning success', {
        id: (packageData as any)?.id,
        candidate_id: (packageData as any)?.candidate_id,
        mentor_id: (packageData as any)?.mentor_id,
      });

      // No real payment integration yet → no orderId
      return {
        package: packageData as InterviewPackage,
        orderId: null,
        error: null,
      };
    } catch (error) {
      console.error('[PAYMENT DBG] Error in createPackage catch:', error);
      return { package: null, orderId: null, error };
    }
  },

  /**
   * Create Razorpay order
   * PLACEHOLDER: Implement actual Razorpay integration when needed.
   */
  async createRazorpayOrder(
    amountInr: number,
    packageId: string
  ): Promise<string> {
    try {
      // TODO: Implement actual Razorpay order creation using your backend.
      const mockOrderId = `order_${Date.now()}`;
      console.log('[PAYMENT DBG] returning mock order id', mockOrderId);
      return mockOrderId;
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      throw error;
    }
  },

  /**
   * Verify payment and update package status
   * (kept for future real integration)
   */
  async verifyPayment(
    packageId: string,
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ) {
    try {
      // TODO: Implement actual Razorpay signature verification in your backend.

      // Update package status to 'held_in_escrow'
      const { data, error } = await supabase
        .from('interview_packages')
        .update({
          payment_status: 'held_in_escrow',
          razorpay_payment_id: razorpayPaymentId,
        })
        .eq('id', packageId)
        .select()
        .single();

      if (error) throw error;

      // Create interview sessions for this package
      await this.createInterviewSessions(packageId);

      return { data, error: null };
    } catch (error) {
      console.error('Error verifying payment:', error);
      return { data: null, error };
    }
  },

  /**
   * Create interview sessions after payment
   */
  async createInterviewSessions(packageId: string) {
    try {
      const { data: packageData, error: packageError } = await supabase
        .from('interview_packages')
        .select('candidate_id, mentor_id')
        .eq('id', packageId)
        .single();

      if (packageError || !packageData) {
        throw packageError || new Error('Package not found');
      }

      const sessions = [
        { round: 'round_1', mentor_id: (packageData as any).mentor_id },
        { round: 'round_2', mentor_id: (packageData as any).mentor_id },
        { round: 'hr_round', mentor_id: (packageData as any).mentor_id }, // HR mentor assignment later if needed
      ];

      const { data, error } = await supabase
        .from('interview_sessions')
        .insert(
          sessions.map((session) => ({
            package_id: packageId,
            candidate_id: (packageData as any).candidate_id,
            ...session,
            status: 'pending',
          }))
        )
        .select();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error creating sessions:', error);
      return { data: null, error };
    }
  },

  /**
   * Process refund
   */
  async processRefund(packageId: string, refundType: 'full' | 'partial') {
    try {
      const { data: packageData, error: packageError } = await supabase
        .from('interview_packages')
        .select('*')
        .eq('id', packageId)
        .single();

      if (packageError || !packageData) {
        throw packageError || new Error('Package not found');
      }

      // TODO: Implement actual Razorpay refund in backend.

      const newStatus = refundType === 'full' ? 'refunded' : 'partial_refund';

      const { data, error } = await supabase
        .from('interview_packages')
        .update({ payment_status: newStatus })
        .eq('id', packageId)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error processing refund:', error);
      return { data: null, error };
    }
  },

  /**
   * Release payment to mentor after all sessions complete
   */
  async releasePaymentToMentor(packageId: string) {
    try {
      // Check if all sessions are completed
      const { data: sessions, error: sessionsError } = await supabase
        .from('interview_sessions')
        .select('status')
        .eq('package_id', packageId);

      if (sessionsError || !sessions) {
        throw sessionsError || new Error('Sessions not found');
      }

      const allCompleted = sessions.every((s: any) => s.status === 'completed');
      if (!allCompleted) {
        throw new Error('Not all sessions completed');
      }

      // TODO: Implement actual payout flow to mentor if/when needed.

      const { data, error } = await supabase
        .from('interview_packages')
        .update({ payment_status: 'completed' })
        .eq('id', packageId)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error releasing payment to mentor:', error);
      return { data: null, error };
    }
  },
};
