// scripts/feedback-worker.mjs
//
// Writes AI feedback reports with the Claude CLI.
//
// The generate-session-feedback edge function fetches the 100ms transcript and
// stores it, but cannot reach a CLI on this laptop. This worker asks it which
// sessions are due, takes the exact prompt the function builds (buildPrompt,
// unchanged from the Gemini path, so the report format is identical), runs it
// through `claude -p`, and hands the JSON back to the function to save.
//
// Usage:
//   node scripts/feedback-worker.mjs               listen for transcript-ready webhooks
//   node scripts/feedback-worker.mjs --once        one pass, then exit
//   node scripts/feedback-worker.mjs --session ID  one session, then exit
//
// Needs FEEDBACK_WORKER_TOKEN in .env.feedback-worker (git-ignored); the same
// value is a secret on the edge function.

import { createClient } from '@supabase/supabase-js';
import { spawn } from 'node:child_process';
import { readFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SUPABASE_URL = 'https://rcbaaiiawrglvyzmawvr.supabase.co';
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/generate-session-feedback`;
const FEEDBACK_JOBS_TOPIC = 'crackjobs-feedback-jobs'; // generate-session-feedback broadcasts here
const CLAUDE_TIMEOUT_MS = 10 * 60 * 1000;

const token = readFileSync(join(ROOT, '.env.feedback-worker'), 'utf8').match(/FEEDBACK_WORKER_TOKEN=(\S+)/)?.[1];
if (!token) throw new Error('FEEDBACK_WORKER_TOKEN missing from .env.feedback-worker');

// Run the CLI outside any repository so no project instructions leak into the report.
const CLAUDE_CWD = join(tmpdir(), 'crackjobs-feedback-worker');
mkdirSync(CLAUDE_CWD, { recursive: true });

const log = (...a) => console.log(new Date().toISOString(), ...a);

async function call(body) {
  const res = await fetch(FUNCTION_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-feedback-worker': token },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${body.worker}: ${res.status} ${JSON.stringify(json)}`);
  return json;
}

function runClaude(prompt) {
  return new Promise((resolve, reject) => {
    // Prompt goes on stdin: an argv string would be truncated at the first newline.
    // Subscription only. A user-level ANTHROPIC_API_KEY (set on this machine,
    // inherited by the scheduled task) makes the CLI bill per token instead of
    // using the claude.ai login — the owner's standing rule is never to pay extra.
    const env = { ...process.env };
    for (const k of ['ANTHROPIC_API_KEY', 'ANTHROPIC_AUTH_TOKEN', 'ANTHROPIC_BASE_URL']) delete env[k];
    const child = spawn('claude', ['-p', '--output-format', 'text'], { cwd: CLAUDE_CWD, shell: true, env });
    let out = '';
    let err = '';
    const timer = setTimeout(() => { child.kill(); reject(new Error('claude CLI timed out')); }, CLAUDE_TIMEOUT_MS);
    child.stdout.on('data', (d) => (out += d));
    child.stderr.on('data', (d) => (err += d));
    child.on('error', (e) => { clearTimeout(timer); reject(e); });
    child.on('close', (code) => {
      clearTimeout(timer);
      if (code !== 0) return reject(new Error(`claude exited ${code}: ${err.slice(0, 500)}`));
      resolve(out);
    });
    child.stdin.end(prompt);
  });
}

// The prompt demands bare JSON; tolerate a fence or a stray sentence anyway.
function parseReport(text) {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start < 0 || end <= start) throw new Error(`No JSON object in CLI output: ${text.slice(0, 300)}`);
  return JSON.parse(text.slice(start, end + 1));
}

async function processSession(sessionId) {
  const prep = await call({ worker: 'prepare', session_id: sessionId });
  if (prep.skipped) return log(sessionId, 'already has a report');
  if (prep.pending) return log(sessionId, 'waiting:', prep.reason);

  log(sessionId, `generating with Claude CLI (mentor eval: ${prep.built_with_mentor_eval ? 'yes' : 'not yet'})`);
  let report;
  try {
    report = parseReport(await runClaude(prep.prompt));
  } catch (e) {
    // One retry: a malformed reply is usually a one-off, and the next poll would retry anyway.
    log(sessionId, 'first attempt failed, retrying:', e.message);
    report = parseReport(await runClaude(prep.prompt));
  }
  await call({ worker: 'save', session_id: sessionId, ai_feedback: report, built_with_mentor_eval: prep.built_with_mentor_eval });
  log(sessionId, `report saved (readiness ${report.readiness_score}, ${report.competencies?.length ?? 0} competencies)`);
}

async function pass() {
  const { due } = await call({ worker: 'queue' });
  if (!due.length) return log('nothing due');
  for (const id of due) {
    try { await processSession(id); } catch (e) { log(id, 'FAILED:', e.message); }
  }
}

// One report at a time: two transcripts landing together should not run two CLIs.
let chain = Promise.resolve();
const enqueue = (id) => {
  chain = chain.then(() => processSession(id)).catch((e) => log(id, 'FAILED:', e.message));
  return chain;
};

const args = process.argv.slice(2);
const sessionArg = args[args.indexOf('--session') + 1];
if (args.includes('--session') && sessionArg) {
  await processSession(sessionArg);
} else if (args.includes('--once')) {
  await pass();
} else {
  // The CLI runs only when 100ms reports a transcript (owner, 2026-10-02): the
  // edge function broadcasts on transcription.success and this listens. No polling.
  const anonKey = readFileSync(join(ROOT, '.env.feedback-worker'), 'utf8').match(/SUPABASE_ANON_KEY=(\S+)/)?.[1];
  if (!anonKey) throw new Error('SUPABASE_ANON_KEY missing from .env.feedback-worker');
  const supabase = createClient(SUPABASE_URL, anonKey, { auth: { persistSession: false } });

  // The socket can die without a status change (the laptop sleeping did exactly
  // that on 2026-10-04 and a transcript-ready message was lost), so liveness is
  // proven end to end: every few minutes the worker broadcasts to itself and
  // must hear it back. Any failure exits, the scheduled task restarts the
  // process within a minute, and the catch-up pass on SUBSCRIBED picks up
  // whatever arrived meanwhile. The probe never runs the CLI.
  const PROBE_EVERY_MS = 5 * 60 * 1000;
  const PROBE_TIMEOUT_MS = 30 * 1000;
  let awaitingProbe = null;
  const die = (why) => { log('exiting for restart:', why); process.exit(1); };

  const channel = supabase
    .channel(FEEDBACK_JOBS_TOPIC, { config: { broadcast: { self: true } } })
    .on('broadcast', { event: 'transcript_ready' }, ({ payload }) => {
      log('transcript ready webhook for', payload?.session_id);
      if (payload?.session_id) enqueue(payload.session_id);
    })
    .on('broadcast', { event: 'worker_probe' }, ({ payload }) => {
      if (payload?.nonce === awaitingProbe) awaitingProbe = null;
    })
    .subscribe((status) => {
      log('realtime:', status);
      if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') die(`realtime ${status}`);
      // Catch up once on (re)connect: a webhook that fired while this laptop was
      // off would otherwise never get a report. Only sessions the webhook already
      // marked ready-and-unreported are picked up.
      if (status === 'SUBSCRIBED') chain = chain.then(pass).catch((e) => log('catch-up failed:', e.message));
    });

  setInterval(async () => {
    const nonce = Math.random().toString(36).slice(2);
    awaitingProbe = nonce;
    try {
      await channel.send({ type: 'broadcast', event: 'worker_probe', payload: { nonce } });
    } catch (e) {
      die(`probe send failed: ${e.message}`);
    }
    setTimeout(() => { if (awaitingProbe === nonce) die('probe not echoed; realtime connection is dead'); }, PROBE_TIMEOUT_MS);
  }, PROBE_EVERY_MS);

  log('feedback worker listening on', FEEDBACK_JOBS_TOPIC);
}
