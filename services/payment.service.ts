// services/payment.service.ts
import { supabase } from '../lib/supabase/client'; // 🎯 Relative path

export const paymentService = {
  async createPackage(
    candidateId: string,
    mentorId: string,
    targetProfile: string,
    totalPrice: number,
    selectedSlots: string[]
  ) {
    // ... (Keep your existing createPackage logic)
    console.log("createPackage placeholder"); 
    return { package: { id: 'test_pkg_id' }, error: null };
  },

  // 🎯 NEW: Create Order (Mocks the server call)
  async createRazorpayOrder(amount: number, pkgId: string) {
      console.log("🔵 Mocking Secure Backend Call for Order...");
      // In real production, fetch('/api/razorpay/create-order') here
      await new Promise(resolve => setTimeout(resolve, 500));
      return { order_id: `order_${Date.now()}_mock`, amount: amount * 100 };
  },

  // 🎯 NEW: Verify Payment (Mocks the server call)
  async verifyPayment(pkgId: string, orderId: string, payId: string, sig: string) {
      console.log("🔵 Mocking Secure Backend Call for Verification...");
      // In real production, fetch('/api/razorpay/verify-payment') here
      
      // Update DB locally for now (Mocking the server action)
      const { error } = await supabase
        .from('interview_packages')
        .update({ 
            payment_status: 'held_in_escrow',
            razorpay_payment_id: payId
        })
        .eq('id', pkgId);
      
      if (error) console.error("DB Update Failed", error);
        
      return { success: true };
  }
};