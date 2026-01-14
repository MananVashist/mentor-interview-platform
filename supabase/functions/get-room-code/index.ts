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
    
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const HMS_TOKEN = Deno.env.get('HMS_MANAGEMENT_TOKEN');

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 1. Find the Room ID associated with this session
    const { data: meeting, error } = await supabase
      .from('session_meetings')
      .select('hms_room_id')
      .eq('session_id', sessionId)
      .single();

    if (error || !meeting) throw new Error('Meeting not found');

    // 2. Fetch all active codes for this room from 100ms
    const response = await fetch(`${HMS_API_ENDPOINT}/room-codes/room/${meeting.hms_room_id}`, {
      headers: { "Authorization": `Bearer ${HMS_TOKEN}` },
    });
    
    if (!response.ok) throw new Error('Failed to fetch codes from 100ms');
    
    const { data: codes } = await response.json();

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
      throw new Error(`No code found for role: ${targetRole}. Available: ${codes.map((c:any)=>c.role).join(', ')}`);
    }

    return new Response(JSON.stringify({ code: matchedCode.code }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});