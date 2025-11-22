import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) throw new Error("Unauthorized");

    const { pkgId } = await req.json();

    // 🎯 CONFIG: Use a reliable open Jitsi instance
    const domain = "meet.guifi.net";
    const uniqueRoomId = `CrackJobs-${pkgId}`;

    // 🎯 FIX: Add config params to the URL hash
    // 1. prejoinPageEnabled=false -> Skips the "I am the host" / Lobby screen
    // 2. startWithVideoMuted=true -> Camera starts OFF (Privacy)
    // 3. startWithAudioMuted=true -> Mic starts OFF (Privacy)
    const configHash = "config.prejoinPageEnabled=false&config.startWithVideoMuted=true&config.startWithAudioMuted=true";
    
    const meetingLink = `https://${domain}/${uniqueRoomId}#${configHash}`;

    console.log(`✅ Generated Jitsi Link: ${meetingLink}`);

    return new Response(
      JSON.stringify({ meetingLink }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("❌ Function Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});