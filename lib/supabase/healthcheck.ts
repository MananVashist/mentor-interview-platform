// lib/supabase/healthcheck.ts
import { supabase } from '@/lib/supabase/client';

type Diag = {
  ok: boolean;
  step: string;
  data?: any;
  error?: any;
};

export async function supabaseQuickDiag(userId?: string) {
  const out: Diag[] = [];
  const push = (x: Diag) => {
    out.push(x);
    const emoji = x.ok ? '✅' : '❌';
    // eslint-disable-next-line no-console
    console.log(`${emoji} [SB DIAG] ${x.step}`, x.error ?? x.data ?? '');
  };

  try {
    // 0) Basic client info (won't print keys, just lengths)
    // @ts-ignore
    const url = (supabase as any).rest?.url || (supabase as any).supabaseUrl || 'unknown';
    // @ts-ignore
    const anonLen = ((supabase as any).supabaseKey || '').length;
    push({ ok: true, step: `Client init: url=${url}, anonKeyLength=${anonLen}` });

    // 1) Session
    const { data: sessData, error: sessErr } = await supabase.auth.getSession();
    push({
      ok: !sessErr,
      step: 'auth.getSession()',
      data: sessData?.session
        ? {
            hasSession: true,
            userId: sessData.session.user.id,
            expiresAt: sessData.session.expires_at,
          }
        : { hasSession: false },
      error: sessErr,
    });

    // 2) Auth user (metadata/role lives here)
    const { data: userRes, error: userErr } = await supabase.auth.getUser();
    push({
      ok: !userErr,
      step: 'auth.getUser()',
      data: userRes?.user
        ? {
            id: userRes.user.id,
            email: userRes.user.email,
            role: userRes.user.user_metadata?.role,
            meta: userRes.user.user_metadata,
          }
        : null,
      error: userErr,
    });

    // 3) Simple public select from profiles (no filters)
    const { data: anyProfile, error: anyErr } = await supabase
      .from('profiles')
      .select('id, role')
      .limit(1);
    push({
      ok: !anyErr,
      step: 'from(profiles).select(id,role).limit(1)',
      data: anyProfile,
      error: anyErr,
    });

    // 4) Specific profile (if userId given or we have one)
    const id =
      userId ||
      (userRes?.user?.id ?? null);

    if (id) {
      const { data: profData, error: profErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      push({
        ok: !profErr,
        step: `from(profiles).eq(id, ${id}).maybeSingle()`,
        data: profData,
        error: profErr,
      });
    } else {
      push({
        ok: false,
        step: 'profiles by id skipped (no user id)',
      });
    }

    // 5) Final verdict
    const anyFail = out.some((x) => !x.ok);
    push({
      ok: !anyFail,
      step: anyFail ? 'Verdict: failures detected' : 'Verdict: all calls returned',
      data: out,
    });
  } catch (e) {
    push({ ok: false, step: 'Unexpected exception', error: e });
  }

  return out;
}

// Optional: expose to window for quick manual call from DevTools
// @ts-ignore
if (typeof window !== 'undefined') (window as any).__sbDiag = supabaseQuickDiag;
