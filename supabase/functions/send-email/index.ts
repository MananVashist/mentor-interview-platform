import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { to, subject, html, templateId, templateData, type } = await req.json() as {
      to: string;
      subject: string;
      html?: string;
      templateId?: string;
      templateData?: Record<string, any>;
      type: string;
    };

    console.log(`[Email Service] Processing '${type}' for: ${to}`);

    // Basic Validation
    if (!to || !subject) {
      throw new Error("Missing required fields: to, subject");
    }

    if (!html && !templateId) {
      throw new Error("Must provide either 'html' or 'templateId'");
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      console.error("[Email Service] Missing Resend API key");
      throw new Error("Email service configuration missing");
    }

    // ---------------------------------------------------------
    // CONSTRUCT RESEND PAYLOAD
    // ---------------------------------------------------------
    
    // ⚠️ REPLACE THIS WITH YOUR VERIFIED DOMAIN ONCE READY
    const FROM_EMAIL = "CrackJobs <no-reply@crackjobs.com>";
    // const FROM_EMAIL = "CrackJobs <onboarding@resend.dev>"; 

    let resendPayload: any = {
      from: FROM_EMAIL,
      to: [to],
      subject: subject,
    };

    if (templateId) {
      // ✅ CORRECT SYNTAX for Resend Dashboard Templates
      resendPayload.template_id = templateId;
      resendPayload.data = templateData || {}; 
      console.log(`[Email Service] Using Template: ${templateId}`);
    } else {
      // Raw HTML Fallback
      resendPayload.html = html;
      console.log("[Email Service] Using raw HTML");
    }

    // ---------------------------------------------------------
    // SEND REQUEST TO RESEND
    // ---------------------------------------------------------
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resendPayload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[Email Service] ❌ Resend API Error:", data);
      // Return 500 so the client knows it failed
      return new Response(
        JSON.stringify({
          success: false,
          error: data.message || "Failed to send email via Resend",
          details: data
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    console.log("[Email Service] ✅ Sent Successfully! ID:", data.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        emailId: data.id 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error: any) {
    console.error("[Email Service] Exception:", error.message);
    return new Response(
      JSON.stringify({
        success: false,
        error: String(error.message || error),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500, // Internal Server Error
      }
    );
  }
});