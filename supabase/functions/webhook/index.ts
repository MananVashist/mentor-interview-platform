// supabase/functions/hms-webhook/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const payload = await req.json();
    console.log(`📨 Webhook Type: ${payload.type}`);

    const { room_id } = payload.data || {};

    // ------------------------------------------------------------------
    // 1. HANDLE PEER JOIN - Track Mentor/Candidate Joins
    // ------------------------------------------------------------------
    if (payload.type === "peer.join.success") {
      const { role, user_name } = payload.data;
      
      console.log(`👤 Peer Joined - Role: ${role}, Name: ${user_name}`);

      const isMentor = role === 'host' || role === 'mentor';
      const isCandidate = role === 'guest' || role === 'candidate';

      if (!isMentor && !isCandidate) {
        console.log(`⚠️ Unknown role: ${role}, skipping tracking`);
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: meeting, error: fetchError } = await supabase
        .from("session_meetings")
        .select("*")
        .eq("hms_room_id", room_id)
        .single();

      if (fetchError || !meeting) {
        console.error("❌ Meeting not found for room:", room_id);
        return new Response(JSON.stringify({ error: "Meeting not found" }), { status: 404 });
      }

      const now = new Date().toISOString();
      const updateData: any = {};

      if (isMentor && !meeting.mentor_joined_at) {
        updateData.mentor_joined_at = now;
        console.log("✅ Mentor joined");
      }

      if (isCandidate && !meeting.candidate_joined_at) {
        updateData.candidate_joined_at = now;
        console.log("✅ Candidate joined");
      }

      const mentorJoined = meeting.mentor_joined_at || updateData.mentor_joined_at;
      const candidateJoined = meeting.candidate_joined_at || updateData.candidate_joined_at;

      if (mentorJoined && candidateJoined && !meeting.both_joined) {
        updateData.both_joined = true;
        updateData.meeting_started_at = now;
        console.log("🎬 BOTH PARTICIPANTS JOINED");
      }

      if (Object.keys(updateData).length > 0) {
        const { error: updateError } = await supabase
          .from("session_meetings")
          .update(updateData)
          .eq("hms_room_id", room_id);

        if (updateError) {
          console.error("❌ Failed to update join tracking:", updateError.message);
        }
      }
    }

    // ------------------------------------------------------------------
    // 2. HANDLE PEER LEAVE
    // ------------------------------------------------------------------
    if (payload.type === "peer.leave.success") {
      const { role } = payload.data;
      console.log(`👋 Peer Left - Role: ${role}`);
    }

    // ------------------------------------------------------------------
    // 3. HANDLE SESSION CLOSE
    // ------------------------------------------------------------------
    if (payload.type === "session.close.success") {
      console.log("🔚 Session closed");
      
      const { error } = await supabase
        .from("session_meetings")
        .update({
          meeting_ended_at: new Date().toISOString(),
          meeting_ended_by: "system",
        })
        .eq("hms_room_id", room_id);

      if (error) console.error("❌ Failed to update meeting end:", error.message);
    }

    // ------------------------------------------------------------------
    // 4. HANDLE RECORDING SUCCESS
    // ------------------------------------------------------------------
    if (payload.type === "beam.recording.success" || payload.type === "recording.success") {
      const { location, duration } = payload.data;
      
      if (!location) {
        console.error("❌ Error: Recording location is empty/null");
        return new Response(JSON.stringify({ error: "No location" }), { status: 400 });
      }

      console.log(`🎥 Recording Ready: ${location}`);

      const { error } = await supabase
        .from("session_meetings")
        .update({
          recording_url: location,
          recording_status: "ready",
          recording_duration_seconds: duration,
          recording_ended_at: new Date().toISOString(),
        })
        .eq("hms_room_id", room_id);

      if (error) {
        console.error("❌ DB Recording Update Failed:", error.message);
      } else {
        console.log("✅ Recording URL saved successfully");
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("❌ Fatal Webhook Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});