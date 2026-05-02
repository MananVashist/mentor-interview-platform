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
async function fetchTranscriptFrom100ms(roomId: string, managementToken: string): Promise<string | null> {
  try {
    // Get sessions for this room
    const sessionsRes = await fetch(`${HMS_API_ENDPOINT}/sessions?room_id=${roomId}&limit=1`, {
      headers: { Authorization: `Bearer ${managementToken}` },
    });
    if (!sessionsRes.ok) {
      console.error("[fetchTranscript] Failed to get sessions:", await sessionsRes.text());
      return null;
    }
    const { data: sessions } = await sessionsRes.json();
    if (!sessions?.length) {
      console.log("[fetchTranscript] No sessions found for room:", roomId);
      return null;
    }

    const sessionId = sessions[0].id;

    // Get transcript for this session
    const transcriptRes = await fetch(`${HMS_API_ENDPOINT}/sessions/${sessionId}/transcripts`, {
      headers: { Authorization: `Bearer ${managementToken}` },
    });
    if (!transcriptRes.ok) {
      console.error("[fetchTranscript] Failed to get transcript:", await transcriptRes.text());
      return null;
    }
    const transcriptData = await transcriptRes.json();

    // Find the txt format transcript
    const txtTranscript = transcriptData?.data?.find((t: any) => t.format === "txt");
    if (!txtTranscript?.presigned_url) {
      console.log("[fetchTranscript] No txt transcript found");
      return null;
    }

    // Download the actual transcript text
    const textRes = await fetch(txtTranscript.presigned_url);
    if (!textRes.ok) return null;
    return await textRes.text();
  } catch (err) {
    console.error("[fetchTranscript] Error:", err);
    return null;
  }
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
          maxOutputTokens: 4096,
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
          generationConfig: { temperature: 0.3, maxOutputTokens: 4096, responseMimeType: "application/json" },
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
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY")!;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !GEMINI_API_KEY) {
      throw new Error("Missing required environment variables");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const body = await req.json();

    console.log("[generate-feedback] Received body:", JSON.stringify(body));

    // ── Determine session_id ───────────────────────────────────────────────
    let sessionId: string | null = null;

    // Trigger 1: Direct call from mentor submit
    if (body.session_id) {
      sessionId = body.session_id;
      console.log("[generate-feedback] Direct trigger for session:", sessionId);
    }
    // Trigger 2: 100ms webhook
    else if (body.type && body.data) {
      // 100ms sends: { type: "beam.recording.success", data: { room_id, ... } }
      const roomId = body.data?.room_id || body.data?.room?.id;
      if (!roomId) {
        console.log("[generate-feedback] No room_id in webhook, ignoring");
        return new Response(JSON.stringify({ ok: true }), { headers: corsHeaders });
      }

      // Find session_id from room_id via session_meetings
      const { data: meeting } = await supabase
        .from("session_meetings")
        .select("session_id")
        .eq("hms_room_id", roomId)
        .maybeSingle();

      if (!meeting?.session_id) {
        console.log("[generate-feedback] No session found for room:", roomId);
        return new Response(JSON.stringify({ ok: true }), { headers: corsHeaders });
      }
      sessionId = meeting.session_id;
      console.log("[generate-feedback] Webhook trigger for session:", sessionId);
    }

    if (!sessionId) {
      throw new Error("Could not determine session_id");
    }

    // ── Check if ai_feedback already exists ───────────────────────────────
    const { data: evalRow } = await supabase
      .from("session_evaluations")
      .select("id, checklist_data, ai_feedback")
      .eq("session_id", sessionId)
      .maybeSingle();

    if (evalRow?.ai_feedback) {
      console.log("[generate-feedback] AI feedback already exists, skipping");
      return new Response(JSON.stringify({ ok: true, skipped: true }), { headers: corsHeaders });
    }

    // ── Fetch session info ─────────────────────────────────────────────────
    const { data: session } = await supabase
      .from("interview_sessions")
      .select(`
        id, session_type, skill_id, candidate_id,
        package:interview_packages(interview_profile_id)
      `)
      .eq("id", sessionId)
      .maybeSingle();

    if (!session) throw new Error("Session not found: " + sessionId);

    // ── Resolve track and skill names ──────────────────────────────────────
    let track = "Product Manager";
    let skill = "General";

    if (session.package?.interview_profile_id) {
      const { data: profile } = await supabase
        .from("interview_profiles_admin")
        .select("name")
        .eq("id", session.package.interview_profile_id)
        .single();
      if (profile?.name) track = profile.name;
    }

    if (session.skill_id) {
      const { data: skillData } = await supabase
        .from("interview_skills_admin")
        .select("name")
        .eq("id", session.skill_id)
        .single();
      if (skillData?.name) skill = skillData.name;
    }

    // ── Get or fetch transcript ────────────────────────────────────────────
    const { data: meeting } = await supabase
      .from("session_meetings")
      .select("hms_room_id, transcript_text")
      .eq("session_id", sessionId)
      .maybeSingle();

    let transcriptText = meeting?.transcript_text || null;

    // If no transcript yet, try to fetch from 100ms
    if (!transcriptText && meeting?.hms_room_id && HMS_APP_ACCESS_KEY && HMS_APP_SECRET) {
      console.log("[generate-feedback] Fetching transcript from 100ms...");
      const token = await generateManagementToken(HMS_APP_ACCESS_KEY, HMS_APP_SECRET);
      transcriptText = await fetchTranscriptFrom100ms(meeting.hms_room_id, token);

      if (transcriptText) {
        // Save transcript to session_meetings
        await supabase
          .from("session_meetings")
          .update({ transcript_text: transcriptText })
          .eq("session_id", sessionId);
        console.log("[generate-feedback] Transcript saved to DB");
      }
    }

    if (!transcriptText) {
      console.log("[generate-feedback] No transcript available yet for session:", sessionId);
      return new Response(
        JSON.stringify({ ok: true, pending: true, reason: "transcript_not_ready" }),
        { headers: corsHeaders }
      );
    }

    // ── Check we have either eval or transcript to proceed ─────────────────
    // We can generate feedback with transcript alone if no eval exists yet
    const checklistData = evalRow?.checklist_data || null;

    // ── Generate AI feedback ───────────────────────────────────────────────
    console.log("[generate-feedback] Generating AI feedback...");
    const aiFeedback = await generateAIFeedback(
      track,
      skill,
      session.session_type || "mock",
      checklistData,
      transcriptText,
      GEMINI_API_KEY
    );

    // ── Save ai_feedback ───────────────────────────────────────────────────
    if (evalRow?.id) {
      // Update existing row
      await supabase
        .from("session_evaluations")
        .update({ ai_feedback: aiFeedback })
        .eq("id", evalRow.id);
    } else {
      // Create new row with just ai_feedback (no checklist yet)
      await supabase
        .from("session_evaluations")
        .insert({
          session_id: sessionId,
          ai_feedback: aiFeedback,
          status: "in_progress",
        });
    }

    console.log("[generate-feedback] ✅ AI feedback saved for session:", sessionId);

    return new Response(
      JSON.stringify({ ok: true, generated: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err: any) {
    console.error("[generate-feedback] Error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  }
});