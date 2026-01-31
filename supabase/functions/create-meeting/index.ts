// supabase/functions/create-meeting/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
// ✅ NEW: Import JWT signing libraries (Required for 100ms)
import { create, getNumericDate } from "https://deno.land/x/djwt@v2.9.1/mod.ts";

const HMS_API_ENDPOINT = "https://api.100ms.live/v2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ✅ FIXED: Generate Management Token locally (No fetch)
async function generateManagementToken(appAccessKey: string, appSecret: string): Promise<string> {
  try {
    const payload = {
      access_key: appAccessKey,
      type: "management",
      version: 2,
      iat: getNumericDate(0),
      nbf: getNumericDate(0),
      exp: getNumericDate(24 * 60 * 60), // 24 hours
      jti: crypto.randomUUID(),
    };

    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(appSecret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign", "verify"],
    );

    const token = await create({ alg: "HS256", typ: "JWT" }, payload, key);
    console.log('[generateManagementToken] ✅ Locally generated management token');
    return token;
  } catch (error) {
    console.error('[generateManagementToken] Error generating token:', error);
    throw error;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const HMS_APP_ACCESS_KEY = Deno.env.get('HMS_APP_ACCESS_KEY');
    const HMS_APP_SECRET = Deno.env.get('HMS_APP_SECRET');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!HMS_APP_ACCESS_KEY || !HMS_APP_SECRET || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing required environment variables');
    }

    const { sessionId } = await req.json();
    if (!sessionId) throw new Error('sessionId is required');

    console.log('[create-meeting] Creating meeting for session:', sessionId);

    // 1. Generate Token (Now works locally)
    const managementToken = await generateManagementToken(HMS_APP_ACCESS_KEY, HMS_APP_SECRET);

    // 2. Create Room in 100ms
    const roomPayload = {
      name: `Interview-${sessionId}`,
      description: "CrackJobs Mock Interview Session",
      template_id: "6964f1c5a090b0544dfd9c7d", // Your Template ID
      region: "in",
    };

    const roomResponse = await fetch(`${HMS_API_ENDPOINT}/rooms`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${managementToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(roomPayload),
    });

    if (!roomResponse.ok) {
      const errorText = await roomResponse.text();
      console.error('[create-meeting] Room creation failed:', errorText);
      throw new Error(`100ms Room Error: ${errorText}`);
    }
    
    const roomData = await roomResponse.json();
    const roomId = roomData.id;

    console.log('[create-meeting] ✅ Room created:', roomId);

    // 3. Generate Room Codes
    const codesResponse = await fetch(`${HMS_API_ENDPOINT}/room-codes/room/${roomId}`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${managementToken}` },
    });

    if (!codesResponse.ok) {
      const errorText = await codesResponse.text();
      console.error('[create-meeting] Code generation failed:', errorText);
      throw new Error(`100ms Code Gen Error: ${errorText}`);
    }
    
    const codesData = await codesResponse.json();
    
    // Find 'host' or 'mentor' code
    const hostCodeObj = codesData.data.find((c: any) => c.role === 'host' || c.role === 'mentor');
    const hostCode = hostCodeObj ? hostCodeObj.code : codesData.data[0]?.code;

    if (!hostCode) {
      throw new Error('Failed to generate room codes');
    }

    // 4. Save to Supabase
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { error: dbError } = await supabase
      .from('session_meetings')
      .insert({
        session_id: sessionId,
        hms_room_id: roomId,
        hms_room_code: hostCode,
        recording_status: 'pending',
      });

    if (dbError) {
      console.error('[create-meeting] Database insert failed:', dbError);
      throw dbError;
    }

    console.log('[create-meeting] ✅ Meeting saved to database');

    return new Response(JSON.stringify({ 
      success: true, 
      roomId, 
      hostCode 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('[create-meeting] Error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});