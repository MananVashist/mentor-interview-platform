// Marks a package paid (JAR-329). A valid signature proves a payment happened; the order behind it must also be this
// package's: Razorpay's own amount for the order must equal the package's total, and an order pays for one package only.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper: Convert ArrayBuffer to Hex String for standard Web Crypto
function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders, status: 200 });
  }

  try {
    const { packageId, orderId, paymentId, signature } = await req.json();

    if (!packageId || !orderId || !paymentId || !signature) {
      throw new Error("Missing required fields: packageId, orderId, paymentId, or signature");
    }

    const RZP_KEY = Deno.env.get("RAZORPAY_KEY_ID");
    const RZP_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET");
    if (!RZP_KEY || !RZP_SECRET) throw new Error("Server configuration error: Missing Secret");

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(RZP_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(`${orderId}|${paymentId}`));
    if (toHex(signatureBuffer) !== signature) {
      throw new Error("Invalid payment signature");
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { autoRefreshToken: false, persistSession: false } },
    );

    const { data: existingPackage, error: fetchError } = await supabase
      .from("interview_packages")
      .select("id, payment_status, total_amount_inr, razorpay_order_id")
      .eq("id", packageId)
      .single();

    if (fetchError || !existingPackage) {
      throw new Error(`Package not found: ${packageId}`);
    }

    // The order must be this package's: the one recorded on it, not spent on another, for its full amount.
    if (existingPackage.razorpay_order_id && existingPackage.razorpay_order_id !== orderId) {
      throw new Error("This order does not belong to this package");
    }
    const { count: usedElsewhere } = await supabase
      .from("interview_packages")
      .select("id", { count: "exact", head: true })
      .eq("razorpay_order_id", orderId)
      .neq("id", packageId);
    if ((usedElsewhere ?? 0) > 0) throw new Error("This order has already paid for another package");

    const orderRes = await fetch(`https://api.razorpay.com/v1/orders/${encodeURIComponent(orderId)}`, {
      headers: { Authorization: `Basic ${btoa(`${RZP_KEY}:${RZP_SECRET}`)}` },
    });
    if (!orderRes.ok) throw new Error("Could not confirm the order with Razorpay");
    const order = await orderRes.json();
    if (Number(order.amount) !== existingPackage.total_amount_inr * 100) {
      console.error("[RZP Verify] Amount mismatch on package", packageId);
      throw new Error("The order amount does not match this package");
    }

    const { data: updatedPackage, error: packageError } = await supabase
      .from("interview_packages")
      .update({
        payment_status: "held_in_escrow",
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
        razorpay_order_id: orderId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", packageId)
      .select("*")
      .single();

    if (packageError || !updatedPackage) {
      throw new Error(`Failed to update package: ${packageError?.message || "Unknown error"}`);
    }

    const { data: existingSessions, error: sessionFetchError } = await supabase
      .from("interview_sessions")
      .select("id")
      .eq("package_id", packageId);

    if (sessionFetchError) {
      // the payment is recorded; the session update is secondary
      console.error("[RZP Verify] Failed to fetch sessions:", sessionFetchError.message);
    } else if (existingSessions && existingSessions.length > 0) {
      const { error: sessionError } = await supabase
        .from("interview_sessions")
        .update({ status: "pending", updated_at: new Date().toISOString() })
        .eq("package_id", packageId)
        .eq("status", "awaiting_payment"); // only sessions still waiting on payment
      if (sessionError) console.error("[RZP Verify] Session status update failed:", sessionError.message);
    }

    return new Response(
      JSON.stringify({
        valid: true,
        package: updatedPackage,
        message: "Payment verified and records updated",
        debug: {
          packageUpdated: true,
          packageId: updatedPackage.id,
          paymentStatus: updatedPackage.payment_status,
          sessionUpdated: !!existingSessions && existingSessions.length > 0,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
    );
  } catch (error: any) {
    console.error("[RZP Verify] Error:", error?.message);
    return new Response(
      JSON.stringify({ valid: false, error: error.message || "Internal server error", details: error.details || null }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 },
    );
  }
});
