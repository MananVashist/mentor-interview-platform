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
  // 1. Handle Preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { 
      headers: corsHeaders,
      status: 200 
    });
  }

  try {
    const { packageId, orderId, paymentId, signature } = await req.json();

    console.log("[RZP Verify] 🔍 Incoming:", { 
      packageId, 
      orderId, 
      paymentId, 
      signature: signature ? "✓ Present" : "✗ Missing" 
    });

    // 2. Validate required fields
    if (!packageId || !orderId || !paymentId || !signature) {
      throw new Error("Missing required fields: packageId, orderId, paymentId, or signature");
    }

    // 3. Get Razorpay secret
    const RZP_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET");
    if (!RZP_SECRET) throw new Error("Server configuration error: Missing Secret");

    // 4. Verify Razorpay signature using Web Crypto API (Standard for Edge)
    const encoder = new TextEncoder();
    const keyData = encoder.encode(RZP_SECRET);
    const message = encoder.encode(`${orderId}|${paymentId}`);

    const key = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const signatureBuffer = await crypto.subtle.sign("HMAC", key, message);
    const generatedSignature = toHex(signatureBuffer);

    const isValid = generatedSignature === signature;

    console.log("[RZP Verify] 🔐 Validation result:", {
      match: isValid,
      generatedSignature: generatedSignature.substring(0, 10) + "...",
      receivedSignature: signature.substring(0, 10) + "..."
    });

    if (!isValid) {
      throw new Error("Invalid payment signature");
    }

    // 5. Initialize Supabase Admin Client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    console.log("[RZP Verify] 📊 Verifying package exists...");

    // 6. First, verify the package exists and get its current state
    const { data: existingPackage, error: fetchError } = await supabase
      .from("interview_packages")
      .select("id, payment_status, candidate_id, mentor_id")
      .eq("id", packageId)
      .single();

    if (fetchError || !existingPackage) {
      console.error("[RZP Verify] ❌ Package not found:", fetchError);
      throw new Error(`Package not found: ${packageId}`);
    }

    console.log("[RZP Verify] ✅ Package found, current payment_status:", existingPackage.payment_status);

    // 7. Update 'interview_packages' (Record the Payment)
    console.log("[RZP Verify] 💳 Updating package payment details...");
    
    const { data: updatedPackage, error: packageError } = await supabase
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

    if (packageError || !updatedPackage) {
      console.error("[RZP Verify] ❌ Package update failed:", packageError);
      throw new Error(`Failed to update package: ${packageError?.message || 'Unknown error'}`);
    }

    console.log("[RZP Verify] ✅ Package updated successfully:", {
      id: updatedPackage.id,
      payment_status: updatedPackage.payment_status,
      razorpay_payment_id: updatedPackage.razorpay_payment_id ? "✓ Set" : "✗ Missing",
      razorpay_signature: updatedPackage.razorpay_signature ? "✓ Set" : "✗ Missing",
      razorpay_order_id: updatedPackage.razorpay_order_id ? "✓ Set" : "✗ Missing"
    });

    // 8. Verify session exists before updating
    console.log("[RZP Verify] 🔍 Checking for associated session...");
    
    const { data: existingSessions, error: sessionFetchError } = await supabase
      .from("interview_sessions")
      .select("id, status, scheduled_at")
      .eq("package_id", packageId);

    if (sessionFetchError) {
      console.error("[RZP Verify] ❌ Failed to fetch sessions:", sessionFetchError);
      // Don't throw - package update succeeded, session update is secondary
    } else if (!existingSessions || existingSessions.length === 0) {
      console.error("[RZP Verify] ⚠️ No sessions found for package:", packageId);
      // Don't throw - package update succeeded
    } else {
      console.log("[RZP Verify] ✅ Found sessions:", existingSessions.map(s => ({
        id: s.id,
        status: s.status,
        scheduled_at: s.scheduled_at
      })));

      // 9. Update 'interview_sessions' (Set status to pending)
      // ✅ CRITICAL FIX: Only update sessions that are currently 'awaiting_payment'
      console.log("[RZP Verify] 📝 Updating session status from 'awaiting_payment' to 'pending'...");
      
      const { data: updatedSessions, error: sessionError } = await supabase
        .from("interview_sessions")
        .update({
          status: "pending",
          updated_at: new Date().toISOString()
        })
        .eq("package_id", packageId)
        .eq("status", "awaiting_payment") // ✅ SAFETY: Only update if currently awaiting_payment
        .select("id, status");

      if (sessionError) {
        // We log this but don't fail the whole request since payment succeeded
        console.error("[RZP Verify] ⚠️ Session status update failed:", sessionError);
        console.error("[RZP Verify] ⚠️ Error details:", {
          message: sessionError.message,
          details: sessionError.details,
          hint: sessionError.hint,
          code: sessionError.code
        });
      } else if (!updatedSessions || updatedSessions.length === 0) {
        console.warn("[RZP Verify] ⚠️ No sessions were updated. Possible reasons:");
        console.warn("  - Sessions might not be in 'awaiting_payment' status");
        console.warn("  - Package ID might not match any sessions");
        console.warn("  - RLS policies might be blocking the update");
        console.warn("  Current sessions:", existingSessions);
      } else {
        console.log("[RZP Verify] ✅ Session status updated to 'pending':", updatedSessions);
      }
    }

    // 10. Return Success
    return new Response(
      JSON.stringify({ 
        valid: true,
        package: updatedPackage,
        message: "Payment verified and records updated",
        debug: {
          packageUpdated: true,
          packageId: updatedPackage.id,
          paymentStatus: updatedPackage.payment_status,
          sessionUpdated: existingSessions && existingSessions.length > 0
        }
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error: any) {
    console.error("[RZP Verify] 💥 Fatal Error:", error);
    console.error("[RZP Verify] 💥 Error stack:", error.stack);
    
    return new Response(
      JSON.stringify({
        valid: false,
        error: error.message || "Internal server error",
        details: error.details || null,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});