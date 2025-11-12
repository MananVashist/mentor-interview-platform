// services/auth.service.ts
import { supabase } from '@/lib/supabase/client';
import { logger } from '@/lib/debug';

// same values you confirmed in PowerShell and browser
const SUPABASE_URL = 'https://rcbaaiiawrglvyzmawvr.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjYmFhaWlhd3JnbHZ5em1hd3ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNTA1NjAsImV4cCI6MjA3NjcyNjU2MH0.V3qRHGXBMlspRS7XFJlXdo4qIcCms60Nepp7dYMEjLA';

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
};

// small helper for timing logs (still useful for sign-up)
async function withTiming<T>(label: string, fn: () => Promise<T>): Promise<T> {
  const start = Date.now();
  console.log(`[AUTH DBG] ${label} → START at ${new Date(start).toISOString()}`);
  try {
    const res = await fn();
    const end = Date.now();
    console.log(
      `[AUTH DBG] ${label} → DONE in ${end - start}ms at ${new Date(end).toISOString()}`
    );
    return res;
  } catch (err) {
    const end = Date.now();
    console.log(
      `[AUTH DBG] ${label} → ERROR after ${end - start}ms at ${new Date(end).toISOString()}`
    );
    throw err;
  }
}

/**
 * SIGN IN (manual REST call)
 */
async function signIn(email: string, password: string) {
  console.log('================ SIGN IN (manual fetch) ================');
  console.log('[AUTH DBG] signIn called with', { email });

  const url = `${SUPABASE_URL}/auth/v1/token?grant_type=password`;

  const controller = new AbortController();
  const timeout = setTimeout(() => {
    console.log(
      '[AUTH DBG] manual fetch timed out (7s) — likely CORS / localhost / browser issue'
    );
    controller.abort();
  }, 7000);

  try {
    console.log('[AUTH DBG] POST →', url);

    const res = await fetch(url, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ email, password }),
    });

    clearTimeout(timeout);

    console.log('[AUTH DBG] response status =', res.status);
    const json = await res.json().catch(() => ({} as any));
    console.log('[AUTH DBG] response json =', json);

    if (!res.ok) {
      return {
        user: null,
        session: null,
        error: {
          message: json?.error_description || json?.msg || 'Auth failed',
        },
      };
    }

    const session = {
      access_token: json.access_token,
      refresh_token: json.refresh_token,
      token_type: json.token_type,
      expires_in: json.expires_in,
      user: json.user,
    };

    console.log('[AUTH DBG] signIn success, returning user + session');

    return {
      user: json.user ?? null,
      session,
      error: null,
    };
  } catch (err: any) {
    clearTimeout(timeout);
    console.log('[AUTH DBG] fetch error during signIn', err);
    return {
      user: null,
      session: null,
      error: { message: err?.message || 'Network/auth error' },
    };
  }
}

/**
 * SIGN UP (supabase-js)
 */
async function signUp(
  email: string,
  password: string,
  fullName: string,
  role: string
) {
  console.log('================ SIGN UP (service) ================');
  console.log('[AUTH DBG] signUp called with', { email, role });

  const { data, error } = await withTiming('supabase.auth.signUp', () =>
    supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          email,
          full_name: fullName,
          role,
        },
      },
    })
  );

  console.log('[AUTH DBG] raw sign-up data:', data);
  console.log('[AUTH DBG] raw sign-up error:', error);

  return {
    user: data?.user ?? null,
    session: data?.session ?? null,
    error: error ?? null,
  };
}

/**
 * SIGN OUT
 * we add this so UI can call authService.signOut()
 */
async function signOut() {
  console.log('================ SIGN OUT ================');
  // try normal supabase sign out first
  try {
    const { error } = await withTiming('supabase.auth.signOut', () =>
      supabase.auth.signOut()
    );
    if (error) {
      console.log('[AUTH DBG] supabase.auth.signOut returned error:', error);
    } else {
      console.log('[AUTH DBG] supabase.auth.signOut success');
    }
  } catch (err) {
    console.log('[AUTH DBG] supabase.auth.signOut threw, ignoring', err);
  }

  // optional: also clear the browser local session via REST (not strictly needed
  // since UI store is what actually controls navigation)
  return { error: null };
}

/**
 * GET CURRENT USER (auth)
 */
async function getCurrentUser() {
  console.log('================ GET CURRENT USER ================');
  const { data, error } = await withTiming('supabase.auth.getUser', () =>
    supabase.auth.getUser()
  );
  console.log('[AUTH DBG] getUser data:', data);
  console.log('[AUTH DBG] getUser error:', error);
  if (error) return null;
  return data.user ?? null;
}

/**
 * GET CURRENT USER PROFILE
 */
async function getCurrentUserProfile(): Promise<Profile | null> {
  console.log('================ GET CURRENT USER PROFILE ================');
  const user = await getCurrentUser();
  if (!user) {
    console.log('[AUTH DBG] getCurrentUserProfile: no auth user');
    return null;
  }
  return getUserProfileById(user.id);
}

/**
 * GET USER PROFILE BY ID (manual REST)
 */
async function getUserProfileById(userId: string): Promise<Profile | null> {
  console.log('================ GET USER PROFILE BY ID (manual) ================');
  console.log('[AUTH DBG] getUserProfileById called with', { userId });

  const url = `${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=*`;

  try {
    console.log('[AUTH DBG] GET →', url);
    const res = await fetch(url, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    console.log('[AUTH DBG] profile fetch status =', res.status);

    if (!res.ok) {
      console.log('[AUTH DBG] profile fetch failed');
      return null;
    }

    const json = (await res.json()) as any[];
    console.log('[AUTH DBG] profile fetch json =', json);

    if (!json || json.length === 0) {
      console.log('[AUTH DBG] no profile row returned');
      return null;
    }

    return json[0] as Profile;
  } catch (err) {
    console.log('[AUTH DBG] profile fetch error', err);
    return null;
  }
}

export const authService = {
  signIn,
  signUp,
  signOut, // 👈 this was missing
  getCurrentUser,
  getCurrentUserProfile,
  getUserProfileById,
};
