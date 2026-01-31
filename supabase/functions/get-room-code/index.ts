// supabase/functions/get-room-code/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
// ✅ NEW: Import JWT signing libraries
import { create, getNumericDate } from "https://deno.land/x/djwt@v2.9.1/mod.ts"; 

const HMS_API_ENDPOINT = "https://api.100ms.live/v2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ✅ FIXED: Function now generates a signed JWT locally instead of fetching from API
async function generateManagementToken(appAccessKey: string, appSecret: string): Promise<string> {
  try {
    const payload = {
      access_key: appAccessKey,
      type: "management",
      version: 2,
      iat: getNumericDate(0),
      nbf: getNumericDate(0),
      exp: getNumericDate(24 * 60 * 60), // Valid for 24 hours
      jti: crypto.randomUUID(),
    };

    // Import the secret key for signing
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(appSecret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign", "verify"],
    );

    // Sign the token using HS256
    const token = await create({ alg: "HS256", typ: "JWT" }, payload, key);

    console.log('[generateManagementToken] ✅ Successfully generated local management token');
    return token;
  } catch (error) {
    console.error('[generateManagementToken] Error:', error);
    throw error;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { sessionId, role } = await req.json(); // role is 'host' or 'guest'
    
    // ✅ Get environment variables
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const HMS_APP_ACCESS_KEY = Deno.env.get('HMS_APP_ACCESS_KEY');
    const HMS_APP_SECRET = Deno.env.get('HMS_APP_SECRET');

    // ✅ Validate all required environment variables
    if (!HMS_APP_ACCESS_KEY || !HMS_APP_SECRET || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing required environment variables');
    }

    if (!sessionId) {
      throw new Error('sessionId is required');
    }

    if (!role || !['host', 'guest'].includes(role)) {
      throw new Error('role must be either "host" or "guest"');
    }

    // ✅ NEW: Generate management token on-demand
    console.log('[get-room-code] Generating fresh management token...');
    const managementToken = await generateManagementToken(HMS_APP_ACCESS_KEY, HMS_APP_SECRET);

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 1. Find the Room ID associated with this session
    const { data: meeting, error } = await supabase
      .from('session_meetings')
      .select('hms_room_id')
      .eq('session_id', sessionId)
      .single();

    if (error || !meeting) {
      console.error('[get-room-code] Meeting not found for session:', sessionId, error);
      throw new Error('Meeting not found for this session');
    }

    if (!meeting.hms_room_id) {
      console.error('[get-room-code] No hms_room_id for session:', sessionId);
      throw new Error('Room ID not found for this session');
    }

    console.log('[get-room-code] Found room:', meeting.hms_room_id, 'for session:', sessionId);

    // 2. Fetch all active codes for this room from 100ms using the fresh token
    const response = await fetch(`${HMS_API_ENDPOINT}/room-codes/room/${meeting.hms_room_id}`, {
      headers: { "Authorization": `Bearer ${managementToken}` },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[get-room-code] 100ms API error:', response.status, errorText);
      throw new Error(`Failed to fetch codes from 100ms: ${response.status} ${errorText}`);
    }
    
    const { data: codes } = await response.json();

    if (!codes || codes.length === 0) {
      console.error('[get-room-code] No codes found for room:', meeting.hms_room_id);
      throw new Error('No room codes found');
    }

    console.log('[get-room-code] Available codes:', codes.map((c: any) => c.role).join(', '));

    // 3. Match the requested "App Role" to the "100ms Role"
    let targetRole = '';
    
    if (role === 'host') {
        // Try to find 'mentor' first, fallback to 'host'
        targetRole = codes.some((c: any) => c.role === 'mentor') ? 'mentor' : 'host';
    } else {
        // Try to find 'candidate' first, fallback to 'guest'
        targetRole = codes.some((c: any) => c.role === 'candidate') ? 'candidate' : 'guest';
    }

    const matchedCode = codes.find((c: any) => c.role === targetRole);

    if (!matchedCode) {
      console.error('[get-room-code] No matching code for target role:', targetRole);
      throw new Error(`No code found for role: ${targetRole}. Available: ${codes.map((c:any)=>c.role).join(', ')}`);
    }

    console.log('[get-room-code] ✅ Returning code for role:', targetRole);

    return new Response(JSON.stringify({ code: matchedCode.code }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[get-room-code] Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});