// supabase/functions/get-room-code/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const HMS_API_ENDPOINT = "https://api.100ms.live/v2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { sessionId, role } = await req.json(); // role is 'host' or 'guest'
    
    // ✅ FIX: Get environment variables with proper error checking
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const HMS_MANAGEMENT_TOKEN = Deno.env.get('HMS_MANAGEMENT_TOKEN');

    // ✅ FIX: Validate all required environment variables
    if (!HMS_MANAGEMENT_TOKEN || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing required environment variables');
    }

    if (!sessionId) {
      throw new Error('sessionId is required');
    }

    if (!role || !['host', 'guest'].includes(role)) {
      throw new Error('role must be either "host" or "guest"');
    }

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

    // 2. Fetch all active codes for this room from 100ms
    const response = await fetch(`${HMS_API_ENDPOINT}/room-codes/room/${meeting.hms_room_id}`, {
      headers: { "Authorization": `Bearer ${HMS_MANAGEMENT_TOKEN}` },
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
    // Adjust these strings if your template uses 'mentor'/'candidate'
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