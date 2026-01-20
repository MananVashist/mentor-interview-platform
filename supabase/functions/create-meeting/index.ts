// supabase/functions/create-meeting/index.ts
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
    const HMS_MANAGEMENT_TOKEN = Deno.env.get('HMS_MANAGEMENT_TOKEN');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!HMS_MANAGEMENT_TOKEN || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing required environment variables');
    }

    const { sessionId } = await req.json();
    if (!sessionId) throw new Error('sessionId is required');

    console.log('[create-meeting] Creating meeting for session:', sessionId);

    // 1. Create Room in 100ms
    const roomPayload = {
      name: `Interview-${sessionId}`,
      description: "CrackJobs Mock Interview Session",
      template_id: "6964f1c5a090b0544dfd9c7d", // Your specific Template ID
      region: "in",
    };

    const roomResponse = await fetch(`${HMS_API_ENDPOINT}/rooms`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HMS_MANAGEMENT_TOKEN}`,
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

    // 2. Generate Room Codes
    // This creates codes like 'abc-def-ghi' for every role in your template
    const codesResponse = await fetch(`${HMS_API_ENDPOINT}/room-codes/room/${roomId}`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${HMS_MANAGEMENT_TOKEN}` },
    });

    if (!codesResponse.ok) {
      const errorText = await codesResponse.text();
      console.error('[create-meeting] Code generation failed:', errorText);
      throw new Error(`100ms Code Gen Error: ${errorText}`);
    }
    
    const codesData = await codesResponse.json();
    
    console.log('[create-meeting] Generated codes for roles:', codesData.data?.map((c: any) => c.role).join(', '));
    
    // Attempt to find the correct role codes. 
    // We check for 'host' OR 'mentor' to be safe.
    const hostCodeObj = codesData.data.find((c: any) => c.role === 'host' || c.role === 'mentor');
    
    // Fallback: If no host/mentor role found, grab the first available code (risky but better than crashing)
    const hostCode = hostCodeObj ? hostCodeObj.code : codesData.data[0]?.code;

    if (!hostCode) {
      console.error("[create-meeting] CRITICAL: No room codes generated", codesData);
      throw new Error('Failed to generate room codes');
    }

    console.log('[create-meeting] Host code selected for role:', hostCodeObj?.role || 'fallback');

    // 3. Save to Supabase
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: insertedMeeting, error: dbError } = await supabase
      .from('session_meetings')
      .insert({
        session_id: sessionId,
        hms_room_id: roomId,
        hms_room_code: hostCode, // Saving the HOST code
        recording_status: 'pending',
      })
      .select()
      .single();

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