import { supabase } from '@/lib/supabase/client';
import { InterviewPackage } from '@/lib/types';

const SUPABASE_URL = 'https://rcbaaiiawrglvyzmawvr.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjYmFhaWlhd3JnbHZ5em1hd3ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNTA1NjAsImV4cCI6MjA3NjcyNjU2MH0.V3qRHGXBMlspRS7XFJlXdo4qIcCms60Nepp7dYMEjLA';

function withTimeout<T>(p: Promise<T>, ms: number, label = 'operation'): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => {
      const err = new Error(`[TIMEOUT] ${label} did not resolve within ${ms}ms`);
      console.log('[PAYMENT DBG]', err.message);
      reject(err);
    }, ms);
    p.then((v) => { clearTimeout(t); resolve(v); })
     .catch((e) => { clearTimeout(t); reject(e); });
  });
}

export const paymentService = {
  calculatePackagePrice(mentorSessionPrice: number) {
    const mentorPayoutPerSession = mentorSessionPrice;
    const platformFeePerSession = mentorSessionPrice; // 50% margin (mirror your logic)
    const totalPerSession = mentorPayoutPerSession + platformFeePerSession;
    return {
      mentorPayout: mentorPayoutPerSession * 3,
      platformFee: platformFeePerSession * 3,
      totalAmount: totalPerSession * 3,
    };
  },

  async createPackage(
    candidateId: string,
    mentorId: string,
    targetProfile: string,
    mentorSessionPrice: number
  ): Promise<{ package: InterviewPackage | null; orderId: string | null; error: any }> {
    console.log('[PAYMENT DBG] createPackage called', {
      candidateId, mentorId, targetProfile, mentorSessionPrice, ts: Date.now(),
    });

    // 0) Soft check: session visibility from client (helps spot RLS/auth)
    try {
      console.log('[PAYMENT DBG] STEP 0: auth.getUser() (3s cap)…');
      const { data: userData, error: userErr } = await withTimeout(
        supabase.auth.getUser(),
        3000,
        'auth.getUser'
      );
      console.log('[PAYMENT DBG] STEP 0 result', {
        userErr,
        userId: userData?.user?.id,
        email: userData?.user?.email,
      });
    } catch (e: any) {
      console.log('[PAYMENT DBG] STEP 0 skipped/timeout', e?.message || e);
    }

    // 1) Pricing + payload
    const pricing = this.calculatePackagePrice(mentorSessionPrice);
    const payload = {
      candidate_id: candidateId,
      mentor_id: mentorId,
      target_profile: targetProfile,
      total_amount_inr: pricing.totalAmount,
      platform_fee_inr: pricing.platformFee,
      mentor_payout_inr: pricing.mentorPayout,
      payment_status: 'pending',
    };
    console.log('[PAYMENT DBG] STEP 1: payload', payload);

    // 2) Try client insert first (RLS-respecting)
    console.log('[PAYMENT DBG] STEP 2: supabase client insert (10s cap)…');
    try {
      const query = supabase.from('interview_packages').insert(payload).select('*').single();
      const result = await withTimeout(query, 10_000, 'supabase.insert(interview_packages)');
      console.log('[PAYMENT DBG] STEP 2 done → raw result', result);

      if (result?.error || !result?.data) {
        console.log('[PAYMENT DBG] STEP 2 returned error/no data', {
          error: result?.error,
        });
        // continue to fallback
      } else {
        console.log('[PAYMENT DBG] STEP 2 success', {
          id: result.data?.id,
          candidate_id: result.data?.candidate_id,
          mentor_id: result.data?.mentor_id,
        });
        return { package: result.data as InterviewPackage, orderId: null, error: null };
      }
    } catch (e) {
      console.log('[PAYMENT DBG] STEP 2 threw', e);
      // continue to fallback
    }

    // 3) Fallback: REST insert (clear error surface if RLS/policy blocks)
    console.log('[PAYMENT DBG] STEP 3: REST fallback insert…');
    try {
      const res = await withTimeout(
        fetch(`${SUPABASE_URL}/rest/v1/interview_packages`, {
          method: 'POST',
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            Prefer: 'return=representation',
          },
          body: JSON.stringify(payload),
        }),
        8000,
        'REST insert(interview_packages)'
      );
      const text = await res.text();
      console.log('[PAYMENT DBG] STEP 3 response', res.status, text);
      if (!res.ok) {
        return { package: null, orderId: null, error: new Error(`${res.status} ${text}`) };
      }
      const row = JSON.parse(text)[0] as InterviewPackage | undefined;
      if (!row) {
        return { package: null, orderId: null, error: new Error('REST insert returned no row') };
      }
      return { package: row, orderId: null, error: null };
    } catch (e) {
      console.log('[PAYMENT DBG] STEP 3 threw', e);
      return { package: null, orderId: null, error: e };
    }
  },

  async createRazorpayOrder(amountInr: number, packageId: string): Promise<string> {
    const mockOrderId = `order_${Date.now()}`;
    console.log('[PAYMENT DBG] returning mock order id', mockOrderId);
    return mockOrderId;
  },

  async verifyPayment(packageId: string, razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string) {
    try {
      const { data, error } = await supabase
        .from('interview_packages')
        .update({ payment_status: 'held_in_escrow', razorpay_payment_id: razorpayPaymentId })
        .eq('id', packageId)
        .select()
        .single();
      if (error) throw error;
      await this.createInterviewSessions(packageId);
      return { data, error: null };
    } catch (error) {
      console.error('Error verifying payment:', error);
      return { data: null, error };
    }
  },

  async createInterviewSessions(packageId: string) {
    try {
      const { data: packageData, error: packageError } = await supabase
        .from('interview_packages')
        .select('candidate_id, mentor_id')
        .eq('id', packageId)
        .single();
      if (packageError || !packageData) throw packageError || new Error('Package not found');

      const sessions = [
        { round: 'round_1', mentor_id: (packageData as any).mentor_id },
        { round: 'round_2', mentor_id: (packageData as any).mentor_id },
        { round: 'hr_round', mentor_id: (packageData as any).mentor_id },
      ];

      const { data, error } = await supabase
        .from('interview_sessions')
        .insert(
          sessions.map((s) => ({
            package_id: packageId,
            candidate_id: (packageData as any).candidate_id,
            ...s,
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

  async processRefund(packageId: string, refundType: 'full' | 'partial') {
    try {
      const { data: pkg, error: pkgErr } = await supabase
        .from('interview_packages')
        .select('*')
        .eq('id', packageId)
        .single();
      if (pkgErr || !pkg) throw pkgErr || new Error('Package not found');

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

  async releasePaymentToMentor(packageId: string) {
    try {
      const { data: sessions, error: sessionsError } = await supabase
        .from('interview_sessions')
        .select('status')
        .eq('package_id', packageId);
      if (sessionsError || !sessions) throw sessionsError || new Error('Sessions not found');

      const allCompleted = sessions.every((s: any) => s.status === 'completed');
      if (!allCompleted) throw new Error('Not all sessions completed');

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
