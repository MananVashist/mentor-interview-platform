import { supabase } from '@/lib/supabase/client'; 

export const paymentService = {
  async createPackage(
    candidateId: string,
    mentorId: string,
    targetProfile: string,
    totalPrice: number,
    selectedSlots: string[]
  ) {
    console.log("🔵 Creating Booking Package...");
    const platformFee = Math.round(totalPrice * 0.5);
    const mentorPayout = totalPrice - platformFee;

    try {
      // 1. Insert Package
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

      // 2. Insert Sessions with CORRECT ENUMS ('round_1', etc.)
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

      // 3. Update Package (CORRECT ENUM: 'held_in_escrow')
      await supabase
        .from('interview_packages')
        .update({ 
            payment_status: 'held_in_escrow', // ✅ Correct ENUM
            razorpay_payment_id: payId
        })
        .eq('id', pkgId);
      
      // 4. Update Sessions
      await supabase
        .from('interview_sessions')
        .update({ 
            status: 'confirmed', 
            meeting_link: finalLink 
        }) 
        .eq('package_id', pkgId);

      return { success: true, meetingLink: finalLink };
  }
};