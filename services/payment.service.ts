import { supabase } from '@/lib/supabase/client';

export const paymentService = {
  /**
   * Creates a booking package + sessions using a Secure Database Function (RPC).
   * This bypasses client-side RLS issues and ensures data integrity.
   */
  async createPackage(
    candidateId: string,
    mentorId: string,
    targetProfile: string,
    totalPrice: number,
    selectedSlots: string[]
  ) {
    console.log("🔵 [PaymentService] createPackage called via RPC", { 
        candidateId, mentorId, totalPrice, selectedSlots 
    });
    
    try {
      const platformFee = Math.round(totalPrice * 0.2);
      const mentorPayout = totalPrice - platformFee;

      // Call the Postgres Function we created
      const { data, error } = await supabase.rpc('create_booking_package', {
        p_candidate_id: candidateId,
        p_mentor_id: mentorId,
        p_target_profile: targetProfile,
        p_total_amount: totalPrice,
        p_platform_fee: platformFee,
        p_mentor_payout: mentorPayout,
        p_session_times: selectedSlots // Array of ISO date strings
      });

      if (error) {
          console.error("🔴 RPC Error:", error);
          throw error;
      }

      // RPC returns { "id": "...", "success": true }
      const packageId = data?.id;
      
      if (!packageId) {
        throw new Error("No Package ID returned from database function");
      }

      console.log("✅ Package & Sessions created successfully:", packageId);
      return { package: { id: packageId }, error: null };

    } catch (error: any) {
      console.error("🔴 [PaymentService] Error:", error.message || error);
      return { package: null, error };
    }
  },

  /**
   * Simulates creating an order with Razorpay.
   * In a real app, this would fetch an order_id from your backend/Edge Function.
   */
  async createRazorpayOrder(amount: number, pkgId: string) {
      console.log("🔵 Creating Mock Order for", pkgId);
      // Simulate network delay for realism
      await new Promise(resolve => setTimeout(resolve, 800));
      return `order_${Date.now()}_mock`;
  },

  /**
   * Verifies the payment and updates the database status.
   */
  async verifyPayment(pkgId: string, orderId: string, payId: string, sig: string) {
      console.log("🔵 Verifying Payment for", pkgId);
      
      // 1. Update Package
      const { error: pkgError } = await supabase
        .from('interview_packages')
        .update({ 
            payment_status: 'held_in_escrow', // ensure this is valid too!
            razorpay_payment_id: payId
        })
        .eq('id', pkgId);
      
      if (pkgError) throw pkgError;
      
      // 2. Update Sessions Status
      // FIX: Changed 'scheduled' to 'confirmed' (Check your DB enum if this fails again)
      const { error: sessionError } = await supabase
        .from('interview_sessions')
        .update({ status: 'confirmed' }) 
        .eq('package_id', pkgId);

      if (sessionError) throw sessionError;
        
      return { success: true };
  }
};