// supabase/functions/generate-session-feedback/index.ts
// Handles two triggers:
// 1. 100ms webhook → transcript ready → fetch transcript → generate feedback if eval exists
// 2. Direct call from mentor submit → eval ready → generate feedback if transcript exists

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const HMS_API_ENDPOINT = "https://api.100ms.live/v2";

// ── JWT generation (same as get-room-code) ─────────────────────────────────
import { create, getNumericDate } from "https://deno.land/x/djwt@v2.9.1/mod.ts";

async function generateManagementToken(appAccessKey: string, appSecret: string): Promise<string> {
  const payload = {
    access_key: appAccessKey,
    type: "management",
    version: 2,
    iat: getNumericDate(0),
    nbf: getNumericDate(0),
    exp: getNumericDate(24 * 60 * 60),
    jti: crypto.randomUUID(),
  };
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(appSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
  return await create({ alg: "HS256", typ: "JWT" }, payload, key);
}

// ── Fetch transcript from 100ms ────────────────────────────────────────────
// 100ms stores post-call transcripts as recording assets of type "transcript",
// one set per room session. A call that drops and is rejoined after everyone
// left produces more than one session, so every completed txt transcript for
// the room is joined in order — otherwise the feedback would read half a call.
type TranscriptFetch = { text: string | null; assets: Array<{ id: string; session_id: string; status: string; created_at: string }> };

// `since` scopes it to the current booking: a rescheduled session keeps its
// room, so a missed earlier attempt (one person waiting alone) would otherwise
// be stitched into the new interview's transcript.
async function fetchTranscriptFrom100ms(roomId: string, managementToken: string, since?: string): Promise<TranscriptFetch> {
  const headers = { Authorization: `Bearer ${managementToken}` };
  const listRes = await fetch(`${HMS_API_ENDPOINT}/recording-assets?room_id=${roomId}&type=transcript&limit=100`, { headers });
  if (!listRes.ok) {
    throw new Error(`100ms recording-assets list failed: ${listRes.status} ${await listRes.text()}`);
  }
  const { data } = await listRes.json();
  const txt = (data || [])
    .filter((a: any) => (a.metadata?.output_mode || "").toLowerCase() === "txt")
    .filter((a: any) => !since || String(a.created_at) >= since)
    .sort((a: any, b: any) => String(a.created_at).localeCompare(String(b.created_at)));
  const assets = txt.map((a: any) => ({ id: a.id, session_id: a.session_id, status: a.status, created_at: a.created_at }));

  const parts: string[] = [];
  for (const asset of txt) {
    if (asset.status !== "completed") continue;
    const urlRes = await fetch(`${HMS_API_ENDPOINT}/recording-assets/${asset.id}/presigned-url`, { headers });
    if (!urlRes.ok) throw new Error(`100ms presigned-url failed for ${asset.id}: ${urlRes.status} ${await urlRes.text()}`);
    const { url } = await urlRes.json();
    const textRes = await fetch(url);
    if (!textRes.ok) throw new Error(`Transcript download failed for ${asset.id}: ${textRes.status}`);
    const text = (await textRes.text()).trim();
    if (text) parts.push(text);
  }
  return { text: parts.length ? parts.join("\n\n--- (call reconnected) ---\n\n") : null, assets };
}

// ── Build Claude prompt ────────────────────────────────────────────────────
function buildPrompt(
  track: string,
  skill: string,
  sessionType: string,
  checklistData: any,
  transcript: string
): string {
  // Format mentor evaluation
  let mentorEvalText = "";
  if (checklistData?.template && checklistData?.answers) {
    for (const section of checklistData.template) {
      mentorEvalText += `\nSection: ${section.title}\n`;
      for (const q of section.questions) {
        const ans = checklistData.answers[q.id];
        if (ans !== undefined && ans !== null) {
          mentorEvalText += `- ${q.text}: ${ans}\n`;
        }
      }
    }
  }

  return `You are an expert interview coach generating structured feedback for a mock interview candidate on the CrackJobs platform.

SESSION CONTEXT:
- Track: ${track}
- Skill: ${skill}
- Session type: ${sessionType}
- Mentor: ${checklistData?.meta?.profile_used || track}

MENTOR EVALUATION:
${mentorEvalText || "No mentor evaluation available — derive scores from transcript only."}

TRANSCRIPT:
${transcript}

Generate a structured JSON feedback report. Follow these rules strictly:

1. readiness_score: 0-100. If mentor ratings exist, derive as weighted average (rating × 20). If no ratings, estimate from transcript quality.
2. readiness_label: 0-39 = "Needs Improvement", 40-64 = "On Track", 65-100 = "Interview Ready"
3. feedback_summary: 2-3 sentences. Be honest, not encouraging. Acknowledge what worked, be direct about gaps.
4. red_flags: array of 1-3 strings. Only genuine red flags. Empty array if none.
5. competencies: one entry per mentor template section (or derive from transcript if no template). For each:
   - title: section title
   - score: mentor rating × 20, or estimated 0-100
   - severity: score < 40 = "Must Fix Before Interview", 40-59 = "Important Gap to Address", 60+ = "Good"
   - did_well: 1-3 bullet points grounded in transcript
   - needs_improvement: 1-3 bullet points grounded in transcript
   - what_you_said: direct quote from transcript showing the gap
   - suggested_answer: concrete example of a strong response specific to this question
6. next_steps: exactly 3 items with action and drill fields
7. Output ONLY valid JSON. No preamble, no markdown, no explanation. Start with { end with }.
8. No repeated feedback across competencies.
9. If transcript is unclear for a section, note it honestly.`;
}

// ── Generate AI feedback via Gemini ───────────────────────────────────────
async function generateAIFeedback(
  track: string,
  skill: string,
  sessionType: string,
  checklistData: any,
  transcript: string,
  geminiKey: string
): Promise<any> {
  const prompt = buildPrompt(track, skill, sessionType, checklistData, transcript);

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": geminiKey },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 16384,
          responseMimeType: "application/json",
        },
      }),
    }
  );

  // Retry once on rate limit or server overload
  if (res.status === 429 || res.status === 503) {
    console.log("[generateAIFeedback] Rate limited, waiting 25s before retry...");
    await new Promise(resolve => setTimeout(resolve, 25000));
    const retryRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": geminiKey },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 16384, responseMimeType: "application/json" },
        }),
      }
    );
    if (!retryRes.ok) {
      const err = await retryRes.text();
      throw new Error(`Gemini API error after retry: ${retryRes.status} ${err}`);
    }
    const retryData = await retryRes.json();
    const retryText = retryData.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const retryClean = retryText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(retryClean);
  }

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error: ${res.status} ${err}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

  // Strip any accidental markdown fences
  const clean = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return JSON.parse(clean);
}

// ── Shared session helpers ─────────────────────────────────────────────────
const HMS_TEMPLATE_ID = "6964f1c5a090b0544dfd9c7d"; // same template create-meeting uses
const FEEDBACK_JOBS_TOPIC = "crackjobs-feedback-jobs"; // scripts/feedback-worker.mjs listens here

// A report written from the transcript alone (the transcript usually lands
// before the mentor submits) is due again once the mentor's evaluation exists,
// so their ratings reach the candidate. Reports from before this marker existed
// carry no flag and are left alone.
function needsReport(evalRow: any): boolean {
  if (!evalRow?.ai_feedback) return true;
  return evalRow.ai_feedback._built_with_mentor_eval === false && !!evalRow.checklist_data;
}

async function loadContext(supabase: any, sessionId: string, hmsKey: string, hmsSecret: string) {
  const { data: evalRow } = await supabase
    .from("session_evaluations")
    .select("id, checklist_data, ai_feedback")
    .eq("session_id", sessionId)
    .maybeSingle();

  const { data: session } = await supabase
    .from("interview_sessions")
    .select(`
      id, session_type, skill_id, candidate_id, scheduled_at,
      package:interview_packages(interview_profile_id)
    `)
    .eq("id", sessionId)
    .maybeSingle();
  if (!session) throw new Error("Session not found: " + sessionId);

  let track = "Product Manager";
  let skill = "General";
  if (session.package?.interview_profile_id) {
    const { data: profile } = await supabase
      .from("interview_profiles_admin").select("name").eq("id", session.package.interview_profile_id).single();
    if (profile?.name) track = profile.name;
  }
  if (session.skill_id) {
    const { data: skillData } = await supabase
      .from("interview_skills_admin").select("name").eq("id", session.skill_id).single();
    if (skillData?.name) skill = skillData.name;
  }

  const { data: meeting } = await supabase
    .from("session_meetings")
    .select("hms_room_id, transcript_text, meeting_ended_at")
    .eq("session_id", sessionId)
    .maybeSingle();

  let transcriptText: string | null = meeting?.transcript_text || null;
  if (!transcriptText && meeting?.hms_room_id && hmsKey && hmsSecret) {
    const token = await generateManagementToken(hmsKey, hmsSecret);
    // A recording restarted mid-call (webhook function) produces one transcript
    // per segment, and the first lands while the interview is still going.
    // Neither fetch nor cache until the room has closed, or the report would be
    // written from half a call and the partial text would stick.
    if (!meeting.meeting_ended_at) {
      const active = await fetch(`${HMS_API_ENDPOINT}/active-rooms/${meeting.hms_room_id}`, { headers: { Authorization: `Bearer ${token}` } });
      const peers = active.ok ? ((await active.json()).session?.peers ?? []) : [];
      if ((Array.isArray(peers) ? peers.length : Object.keys(peers).length) > 0) {
        console.log("[generate-feedback] Call still in progress, not fetching a partial transcript:", sessionId);
        return { evalRow, track, skill, sessionType: session.session_type || "mock", transcriptText: null };
      }
    }
    console.log("[generate-feedback] Fetching transcript from 100ms...");
    // Joining opens 15 minutes early; 30 leaves margin without reaching back a week.
    const since = new Date(new Date(session.scheduled_at).getTime() - 30 * 60 * 1000).toISOString();
    transcriptText = (await fetchTranscriptFrom100ms(meeting.hms_room_id, token, since)).text;
    if (transcriptText) {
      await supabase.from("session_meetings").update({ transcript_text: transcriptText }).eq("session_id", sessionId);
      console.log("[generate-feedback] Transcript saved to DB");
    }
  }

  return { evalRow, track, skill, sessionType: session.session_type || "mock", transcriptText };
}

async function saveReport(supabase: any, sessionId: string, report: any) {
  const { data: existing } = await supabase
    .from("session_evaluations").select("id").eq("session_id", sessionId).maybeSingle();
  const { error } = existing?.id
    ? await supabase.from("session_evaluations").update({ ai_feedback: report }).eq("id", existing.id)
    : await supabase.from("session_evaluations").insert({ session_id: sessionId, ai_feedback: report, status: "in_progress" });
  if (error) throw error;
}

// ── Main handler ───────────────────────────────────────────────────────────
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  // ── Verify webhook secret — only enforce if header is present ───────────────
  // headers.get() returns null if absent, so null = direct call (allow through)
  // non-null = 100ms webhook (must match secret)
  const webhookSecret = req.headers.get("x-webhook-secret");
  const HMS_WEBHOOK_SECRET = Deno.env.get("HMS_WEBHOOK_SECRET");
  if (webhookSecret !== null && webhookSecret !== HMS_WEBHOOK_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const HMS_APP_ACCESS_KEY = Deno.env.get("HMS_APP_ACCESS_KEY")!;
    const HMS_APP_SECRET = Deno.env.get("HMS_APP_SECRET")!;
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    // "claude_cli": this function fetches and stores the transcript, and the
    // feedback worker on the owner's laptop (scripts/feedback-worker.mjs) writes
    // the report with the Claude CLI using buildPrompt() below, unchanged.
    // "gemini": the previous in-function path, kept as a fallback.
    const FEEDBACK_ENGINE = Deno.env.get("FEEDBACK_ENGINE") || "claude_cli";
    const WORKER_TOKEN = Deno.env.get("FEEDBACK_WORKER_TOKEN");

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing required environment variables");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const body = await req.json();
    const json = (o: unknown, status = 200) =>
      new Response(JSON.stringify(o), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    console.log("[generate-feedback] Received body:", JSON.stringify({ ...body, ai_feedback: body.ai_feedback ? "<report>" : undefined }));

    // ── Dry run: prove the 100ms transcript path for a room without writing ──
    // Returns sizes and asset ids only, never transcript text.
    if (body.dry_run && body.room_id) {
      const token = await generateManagementToken(HMS_APP_ACCESS_KEY, HMS_APP_SECRET);
      const { text, assets } = await fetchTranscriptFrom100ms(body.room_id, token);
      return json({ ok: true, dry_run: true, assets, transcript_chars: text?.length ?? 0 });
    }

    // ── Worker modes: transcript text and report writes, so token-gated ──────
    if (body.worker) {
      if (!WORKER_TOKEN || req.headers.get("x-feedback-worker") !== WORKER_TOKEN) {
        return json({ error: "Unauthorized" }, 401);
      }

      if (body.worker === "template") {
        const token = await generateManagementToken(HMS_APP_ACCESS_KEY, HMS_APP_SECRET);
        const r = await fetch(`${HMS_API_ENDPOINT}/templates/${HMS_TEMPLATE_ID}`, { headers: { Authorization: `Bearer ${token}` } });
        return json({ status: r.status, template: await r.json() });
      }

      // Transcripts are made from the recording, so a recording cap shorter than
      // the call silently drops the end of the interview. Only this one field
      // is writable here, between 1 and 3 hours.
      if (body.worker === "set_recording_max_duration") {
        const seconds = Number(body.seconds);
        if (!Number.isInteger(seconds) || seconds < 3600 || seconds > 10800) {
          return json({ error: "seconds must be an integer between 3600 and 10800" }, 400);
        }
        const token = await generateManagementToken(HMS_APP_ACCESS_KEY, HMS_APP_SECRET);
        const auth = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
        const current = await (await fetch(`${HMS_API_ENDPOINT}/templates/${HMS_TEMPLATE_ID}`, { headers: auth })).json();
        const recordings = current.destinations?.browserRecordings || {};
        for (const key of Object.keys(recordings)) recordings[key].maxDuration = seconds;
        const r = await fetch(`${HMS_API_ENDPOINT}/templates/${HMS_TEMPLATE_ID}`, {
          method: "POST",
          headers: auth,
          body: JSON.stringify({ destinations: { ...current.destinations, browserRecordings: recordings } }),
        });
        const updated = await r.json();
        return json({
          status: r.status,
          maxDurations: Object.values(updated.destinations?.browserRecordings || {}).map((d: any) => d.maxDuration),
          transcriptions: Object.keys(updated.destinations?.transcriptions || {}).length,
          error: r.ok ? undefined : updated,
        });
      }

      // Who actually showed up: 100ms's own session history (every peer with
      // join/leave times) next to our join tracking and both accounts' last
      // sign-in. Read-only; answers "the other side never came" disputes.
      if (body.worker === "join_audit") {
        const { data: s } = await supabase
          .from("interview_sessions")
          .select("id, scheduled_at, status, candidate_id, mentor_id")
          .eq("id", body.session_id)
          .maybeSingle();
        if (!s) return json({ error: "Session not found" }, 404);
        const { data: meeting } = await supabase
          .from("session_meetings")
          .select("hms_room_id, mentor_joined_at, candidate_joined_at, both_joined, meeting_started_at, meeting_ended_at, recording_status, recording_duration_seconds")
          .eq("session_id", s.id)
          .maybeSingle();
        const lastSignIn = async (id: string) => (await supabase.auth.admin.getUserById(id)).data?.user?.last_sign_in_at ?? null;
        let hms: unknown = null;
        if (meeting?.hms_room_id) {
          const token = await generateManagementToken(HMS_APP_ACCESS_KEY, HMS_APP_SECRET);
          const r = await fetch(`${HMS_API_ENDPOINT}/sessions?room_id=${meeting.hms_room_id}&limit=20`, { headers: { Authorization: `Bearer ${token}` } });
          const data = (await r.json()).data || [];
          hms = data.map((sess: any) => ({
            created_at: sess.created_at,
            updated_at: sess.updated_at,
            active: sess.active,
            peers: Object.values(sess.peers || {}).map((p: any) => ({ name: p.name, role: p.role, joined_at: p.joined_at, left_at: p.left_at })),
          }));
        }
        const { data: ev } = await supabase
          .from("session_evaluations")
          .select("status, checklist_data, ai_feedback, updated_at")
          .eq("session_id", s.id)
          .maybeSingle();
        return json({
          session: { scheduled_at: s.scheduled_at, status: s.status },
          tracking: meeting,
          evaluation: ev && {
            status: ev.status,
            updated_at: ev.updated_at,
            mentor_checklist_saved: !!ev.checklist_data,
            ai_report: ev.ai_feedback && {
              readiness_score: ev.ai_feedback.readiness_score,
              readiness_label: ev.ai_feedback.readiness_label,
              competencies: (ev.ai_feedback.competencies || []).map((c: any) => `${c.title} (${c.score})`),
              built_with_mentor_eval: ev.ai_feedback._built_with_mentor_eval,
              engine: ev.ai_feedback._engine,
            },
          },
          candidate_last_sign_in: await lastSignIn(s.candidate_id),
          mentor_last_sign_in: await lastSignIn(s.mentor_id),
          hms_sessions: hms,
        });
      }

      // The owner closing out a session the mentor left as a draft: the same two
      // writes as the mentor's final Submit (app/mentor/session/[id].tsx), and
      // nothing else — the mentor's saved ratings are kept exactly as they are.
      if (body.worker === "complete_session") {
        const { data: ev } = await supabase
          .from("session_evaluations").select("id").eq("session_id", body.session_id).maybeSingle();
        if (!ev) return json({ error: "No evaluation row for this session" }, 404);
        const { error: e1 } = await supabase
          .from("session_evaluations").update({ status: "completed", updated_at: new Date().toISOString() }).eq("id", ev.id);
        if (e1) throw e1;
        const { data: s, error: e2 } = await supabase
          .from("interview_sessions").update({ status: "completed" }).eq("id", body.session_id).select("id, status").single();
        if (e2) throw e2;
        console.log("[generate-feedback] Session marked completed by owner:", body.session_id);
        return json({ ok: true, session: s });
      }

      if (body.worker === "queue") {
        // Meetings that ended in the last 3 days and still need a report.
        const since = new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString();
        const { data: meetings } = await supabase
          .from("session_meetings")
          .select("session_id, meeting_ended_at, transcript_text")
          .gte("meeting_ended_at", since);
        // Only sessions whose transcript is already stored: the CLI runs because
        // 100ms produced a transcript, never speculatively.
        const ids = (meetings || []).filter((m: any) => m.transcript_text).map((m: any) => m.session_id);
        const { data: evals } = ids.length
          ? await supabase.from("session_evaluations").select("session_id, checklist_data, ai_feedback").in("session_id", ids)
          : { data: [] as any[] };
        const bySession = new Map((evals || []).map((e: any) => [e.session_id, e]));
        const due = ids.filter((id: string) => needsReport(bySession.get(id)));
        return json({ ok: true, due });
      }

      if (body.worker === "prepare") {
        const ctx = await loadContext(supabase, body.session_id, HMS_APP_ACCESS_KEY, HMS_APP_SECRET);
        if (!needsReport(ctx.evalRow)) return json({ ok: true, skipped: true });
        if (!ctx.transcriptText) return json({ ok: true, pending: true, reason: "transcript_not_ready" });
        const checklistData = ctx.evalRow?.checklist_data || null;
        return json({
          ok: true,
          prompt: buildPrompt(ctx.track, ctx.skill, ctx.sessionType, checklistData, ctx.transcriptText),
          built_with_mentor_eval: !!checklistData,
        });
      }

      if (body.worker === "save") {
        const report = body.ai_feedback;
        const missing = ["readiness_score", "readiness_label", "feedback_summary", "competencies", "next_steps"]
          .filter((k) => report?.[k] === undefined);
        if (missing.length) return json({ error: `Report missing fields: ${missing.join(", ")}` }, 422);
        report._built_with_mentor_eval = !!body.built_with_mentor_eval;
        report._engine = "claude_cli";
        await saveReport(supabase, body.session_id, report);
        console.log("[generate-feedback] ✅ Claude CLI report saved for session:", body.session_id);
        return json({ ok: true, generated: true });
      }

      return json({ error: `Unknown worker mode: ${body.worker}` }, 400);
    }

    // ── Determine session_id ───────────────────────────────────────────────
    let sessionId: string | null = null;

    // Trigger 1: Direct call from mentor submit
    if (body.session_id) {
      sessionId = body.session_id;
      console.log("[generate-feedback] Direct trigger for session:", sessionId);
    }
    // Trigger 2: 100ms webhook (forwarded by the webhook function on transcription.success)
    else if (body.type && body.data) {
      const roomId = body.data?.room_id || body.data?.room?.id;
      if (!roomId) {
        console.log("[generate-feedback] No room_id in webhook, ignoring");
        return json({ ok: true });
      }

      const { data: meeting } = await supabase
        .from("session_meetings")
        .select("session_id")
        .eq("hms_room_id", roomId)
        .maybeSingle();

      if (!meeting?.session_id) {
        console.log("[generate-feedback] No session found for room:", roomId);
        return json({ ok: true });
      }
      sessionId = meeting.session_id;
      console.log("[generate-feedback] Webhook trigger for session:", sessionId);
    }

    if (!sessionId) {
      throw new Error("Could not determine session_id");
    }

    const ctx = await loadContext(supabase, sessionId, HMS_APP_ACCESS_KEY, HMS_APP_SECRET);

    if (!needsReport(ctx.evalRow)) {
      console.log("[generate-feedback] AI feedback already exists, skipping");
      return json({ ok: true, skipped: true });
    }

    if (!ctx.transcriptText) {
      console.log("[generate-feedback] No transcript available yet for session:", sessionId);
      return json({ ok: true, pending: true, reason: "transcript_not_ready" });
    }

    if (FEEDBACK_ENGINE === "claude_cli") {
      // The Claude CLI runs only when 100ms says the transcript exists, never on
      // a schedule (owner, 2026-10-02). The worker has no public address, so it
      // is told over Realtime broadcast. The message carries the session id
      // alone; the transcript is fetched through the token-gated prepare mode.
      if (body.type === "transcription.success") {
        const r = await fetch(`${SUPABASE_URL}/realtime/v1/api/broadcast`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_SERVICE_ROLE_KEY,
            Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          },
          body: JSON.stringify({
            messages: [{ topic: FEEDBACK_JOBS_TOPIC, event: "transcript_ready", payload: { session_id: sessionId } }],
          }),
        });
        console.log(`[generate-feedback] Worker notified for ${sessionId}: ${r.status}`);
      }
      return json({ ok: true, pending: true, reason: "awaiting_claude_cli_worker" });
    }

    if (!GEMINI_API_KEY) throw new Error("FEEDBACK_ENGINE=gemini but GEMINI_API_KEY is not set");

    const checklistData = ctx.evalRow?.checklist_data || null;
    console.log("[generate-feedback] Generating AI feedback with Gemini...");
    const aiFeedback = await generateAIFeedback(ctx.track, ctx.skill, ctx.sessionType, checklistData, ctx.transcriptText, GEMINI_API_KEY);
    aiFeedback._built_with_mentor_eval = !!checklistData;
    aiFeedback._engine = "gemini";
    await saveReport(supabase, sessionId, aiFeedback);

    console.log("[generate-feedback] ✅ AI feedback saved for session:", sessionId);
    return json({ ok: true, generated: true });

  } catch (err: any) {
    console.error("[generate-feedback] Error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  }
});