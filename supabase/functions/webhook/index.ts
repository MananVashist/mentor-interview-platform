// supabase/functions/hms-webhook/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

import { create, getNumericDate } from "https://deno.land/x/djwt@v2.9.1/mod.ts";

const HMS_API_ENDPOINT = "https://api.100ms.live/v2";

async function generateManagementToken(): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(Deno.env.get("HMS_APP_SECRET") ?? ""),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
  return await create({ alg: "HS256", typ: "JWT" }, {
    access_key: Deno.env.get("HMS_APP_ACCESS_KEY"),
    type: "management",
    version: 2,
    iat: getNumericDate(0),
    nbf: getNumericDate(0),
    exp: getNumericDate(60 * 60),
    jti: crypto.randomUUID(),
  }, key);
}

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

    // ------------------------------------------------------------------
    // 5. HANDLE TRANSCRIPT READY → GENERATE AI FEEDBACK
    // ------------------------------------------------------------------
    // Feedback used to start only when the mentor submitted their evaluation,
    // so a mentor who never submitted, or submitted before 100ms finished
    // transcribing, left the candidate with no report. The transcript being
    // ready is the event the report actually depends on.
    if (payload.type === "transcription.success") {
      console.log(`📝 Transcript ready for room: ${room_id}`);
      const run = fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/generate-session-feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
        },
        body: JSON.stringify({ type: payload.type, data: { room_id } }),
      })
        .then(async (r) => console.log(`🤖 Feedback generation: ${r.status} ${await r.text()}`))
        .catch((e) => console.error("❌ Feedback generation call failed:", e.message));
      // Gemini can take longer than 100ms waits for a webhook reply.
      // @ts-ignore EdgeRuntime is provided by Supabase
      if (typeof EdgeRuntime !== "undefined") EdgeRuntime.waitUntil(run); else await run;
    }

    // ------------------------------------------------------------------
    // 6. RECORDING STOPPED WHILE THE CALL IS STILL GOING → START IT AGAIN
    // ------------------------------------------------------------------
    // Transcripts are made from recordings, so a recording that stops early
    // (the template's max duration, a recorder crash) loses the rest of the
    // interview. If anyone is still in the room, record again; the feedback
    // step joins every segment in order once the room closes. A recording that
    // died within a minute is not restarted, so a broken recorder cannot loop.
    if (payload.type === "beam.stopped.success" || payload.type === "beam.failure") {
      const ranSeconds = Number(payload.data?.duration ?? 0);
      const token = await generateManagementToken();
      const auth = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
      const active = await fetch(`${HMS_API_ENDPOINT}/active-rooms/${room_id}`, { headers: auth });
      const peers = active.ok ? ((await active.json()).session?.peers ?? []) : [];
      const peerCount = Array.isArray(peers) ? peers.length : Object.keys(peers).length;
      console.log(`⏹️ Recording stopped (${payload.type}) after ${ranSeconds}s; peers still in room: ${peerCount}`);

      if (peerCount > 0 && (ranSeconds === 0 || ranSeconds >= 60)) {
        const r = await fetch(`${HMS_API_ENDPOINT}/recordings/room/${room_id}/start`, { method: "POST", headers: auth, body: "{}" });
        console.log(`🔁 Recording restart: ${r.status} ${(await r.text()).slice(0, 300)}`);
      }
    }

    if (payload.type === "transcription.failure") {
      console.error(`❌ 100ms transcription failed for room: ${room_id}`, JSON.stringify(payload.data));
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