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
    const { to, subject, html, type } = await req.json() as {
      to: string;
      subject: string;
      html: string;
      type: 'booking_confirmation' | 'mentor_notification' | 'meeting_reminder';
    };

    console.log("[Email Service] Sending email:", { to, subject, type });

    if (!to || !subject || !html) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing required fields: to, subject, html"
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      console.error("[Email Service] Missing Resend API key");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Email service not configured"
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    // Send email via Resend API
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "CrackJobs <onboarding@resend.dev>", // ✅ Update this to your verified domain
        to: [to],
        subject: subject,
        html: html,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[Email Service] Resend API error:", data);
      return new Response(
        JSON.stringify({
          success: false,
          error: data.message || "Failed to send email"
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    console.log("[Email Service] Email sent successfully:", data.id);

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
    console.error("[Email Service] Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: String(error.message || error),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});