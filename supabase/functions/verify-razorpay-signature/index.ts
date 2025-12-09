	import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createHmac } from "npm:crypto";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { orderId, paymentId, signature } = await req.json() as {
      orderId: string;
      paymentId: string;
      signature: string;
    };

    console.log("[RZP Verify] Incoming:", { orderId, paymentId, signature });

    if (!orderId || !paymentId || !signature) {
      throw new Error("Missing orderId, paymentId or signature");
    }

    const RZP_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET");
    if (!RZP_SECRET) {
      throw new Error("Missing Razorpay secret in Edge Function env");
    }

    // Razorpay payload format: order_id + "|" + payment_id
    const payload = `${orderId}|${paymentId}`;

    const expectedSignature = createHmac("sha256", RZP_SECRET)
      .update(payload)
      .digest("hex");

    const isValid = expectedSignature === signature;

    console.log("[RZP Verify] Expected vs Provided:", {
      expectedSignature,
      signature,
      isValid,
    });

    return new Response(
      JSON.stringify({ valid: isValid }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: isValid ? 200 : 400,
      },
    );
  } catch (error: any) {
    console.error("[RZP Verify] Error:", error);
    return new Response(
      JSON.stringify({
        valid: false,
        error: String(error.message || error),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
});
