import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createHmac } from "node:crypto";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { 
      headers: corsHeaders,
      status: 200 
    });
  }

  try {
    const { orderId, paymentId, signature } = await req.json() as {
      orderId: string;
      paymentId: string;
      signature: string;
    };

    console.log("[RZP Verify] Incoming:", { orderId, paymentId, signature });

    if (!orderId || !paymentId || !signature) {
      return new Response(
        JSON.stringify({
          valid: false,
          error: "Missing orderId, paymentId or signature"
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    const RZP_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET");
    if (!RZP_SECRET) {
      console.error("[RZP Verify] Missing Razorpay secret");
      return new Response(
        JSON.stringify({
          valid: false,
          error: "Server configuration error"
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    // Razorpay payload format: order_id + "|" + payment_id
    const payload = `${orderId}|${paymentId}`;

    const expectedSignature = createHmac("sha256", RZP_SECRET)
      .update(payload)
      .digest("hex");

    const isValid = expectedSignature === signature;

    console.log("[RZP Verify] Validation result:", {
      expectedSignature: expectedSignature.substring(0, 10) + "...",
      providedSignature: signature.substring(0, 10) + "...",
      isValid,
    });

    return new Response(
      JSON.stringify({ valid: isValid }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
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
        status: 500,
      }
    );
  }
});