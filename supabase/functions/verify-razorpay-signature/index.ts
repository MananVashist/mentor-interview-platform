import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createHmac } from "node:crypto";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

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
    const { packageId, orderId, paymentId, signature } = await req.json() as {
      packageId: string;
      orderId: string;
      paymentId: string;
      signature: string;
    };

    console.log("[RZP Verify] 🔍 Incoming:", { packageId, orderId, paymentId, signature: signature ? "✓ Present" : "✗ Missing" });

    // ✅ Validate required fields
    if (!packageId || !orderId || !paymentId || !signature) {
      return new Response(
        JSON.stringify({
          valid: false,
          error: "Missing required fields: packageId, orderId, paymentId or signature"
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // ✅ Get Razorpay secret
    const RZP_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET");
    if (!RZP_SECRET) {
      console.error("[RZP Verify] ❌ Missing Razorpay secret");
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

    // ✅ Verify Razorpay signature
    const payload = `${orderId}|${paymentId}`;
    const expectedSignature = createHmac("sha256", RZP_SECRET)
      .update(payload)
      .digest("hex");

    const isValid = expectedSignature === signature;

    console.log("[RZP Verify] 🔐 Validation result:", {
      expectedSignature: expectedSignature.substring(0, 10) + "...",
      providedSignature: signature.substring(0, 10) + "...",
      isValid,
    });

    // ❌ If signature is invalid, return immediately
    if (!isValid) {
      console.error("[RZP Verify] ❌ Invalid signature!");
      return new Response(
        JSON.stringify({ 
          valid: false,
          error: "Invalid payment signature" 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // ✅ Signature is valid - Now update the database
    console.log("[RZP Verify] ✅ Signature valid - Updating database...");

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("[RZP Verify] ❌ Missing Supabase credentials");
      return new Response(
        JSON.stringify({
          valid: false,
          error: "Database configuration error"
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // ✅ Update interview_packages table with all Razorpay fields
    const { data: updatedPackage, error: updateError } = await supabase
      .from("interview_packages")
      .update({
        payment_status: "held_in_escrow",
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
        razorpay_order_id: orderId,
        updated_at: new Date().toISOString()
      })
      .eq("id", packageId)
      .select("*")
      .single();

    if (updateError) {
      console.error("[RZP Verify] ❌ Database update failed:", updateError);
      return new Response(
        JSON.stringify({
          valid: false,
          error: "Failed to update payment record",
          details: updateError.message
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    console.log("[RZP Verify] ✅ Database updated successfully:", {
      packageId,
      payment_status: updatedPackage.payment_status,
      razorpay_order_id: updatedPackage.razorpay_order_id,
      razorpay_payment_id: updatedPackage.razorpay_payment_id,
      razorpay_signature: updatedPackage.razorpay_signature ? "✓ Set" : "✗ Missing"
    });

    // ✅ Return success with updated package data
    return new Response(
      JSON.stringify({ 
        valid: true,
        package: updatedPackage
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error: any) {
    console.error("[RZP Verify] 💥 Fatal Error:", error);
    return new Response(
      JSON.stringify({
        valid: false,
        error: "Internal server error",
        details: String(error.message || error),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});