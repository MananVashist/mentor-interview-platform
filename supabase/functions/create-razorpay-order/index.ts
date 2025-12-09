import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    let { amount, receipt } = await req.json();
    console.log("[RZP][Edge] Incoming:", { amount, receipt });

    if (!amount || !receipt) throw new Error("Missing amount/receipt");

    const amountPaise = parseInt(String(amount), 10);
    if (!Number.isFinite(amountPaise) || amountPaise <= 0)
      throw new Error("Invalid amount (must be positive integer in paise)");

    const KEY = Deno.env.get("RAZORPAY_KEY_ID");
    const SECRET = Deno.env.get("RAZORPAY_KEY_SECRET");
    if (!KEY || !SECRET) throw new Error("Missing Razorpay credentials");

    const auth = `Basic ${btoa(`${KEY}:${SECRET}`)}`;

    const body = {
      amount: amountPaise, // paise
      currency: "INR",
      receipt: receipt,
      payment_capture: 1,
    };

    console.log("[RZP][Edge] Sending to Razorpay:", body);

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: auth },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log("[RZP][Edge] Razorpay responded:", data);

    if (!response.ok) {
      console.error("[RZP][Edge] Razorpay Error RAW:", data);
      throw new Error(data.error?.description || "Failed to create order");
    }

    return new Response(
      JSON.stringify({
        ...data,
        key_id: KEY,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (err) {
    console.error("[RZP][Edge] Fatal:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
