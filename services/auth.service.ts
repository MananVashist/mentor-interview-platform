// services/auth.service.ts
import { supabase } from '../lib/supabase/client';
import { Session, AuthChangeEvent } from '@supabase/supabase-js';

// Define User Profile Type
export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
};

// Helper for timing logs (Optional but good for debugging)
async function withTiming<T>(label: string, fn: () => Promise<T>): Promise<T> {
  const start = Date.now();
  console.log(`[AUTH DBG] ${label} → START`);
  try {
    const res = await fn();
    const end = Date.now();
    console.log(`[AUTH DBG] ${label} → DONE in ${end - start}ms`);
    return res;
  } catch (err) {
    const end = Date.now();
    console.log(`[AUTH DBG] ${label} → ERROR after ${end - start}ms`);
    throw err;
  }
}

/**
 * SIGN IN (Switched to SDK to fix CORS on Web)
 */
async function signIn(email: string, password: string) {
  console.log('================ SIGN IN (SDK) ================');
  console.log('[AUTH DBG] signIn called with', { email });

  try {
    // 🟢 USE THE SDK, NOT FETCH
    // This handles CORS automatically on Web and works on Native too.
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log('[AUTH DBG] Sign in error:', error.message);
      return { user: null, session: null, error };
    }

    console.log('[AUTH DBG] signIn success');

    return {
      user: data.user,
      session: data.session,
      error: null,
    };
  } catch (err: any) {
    console.log('[AUTH DBG] unexpected error during signIn', err);
    return {
      user: null,
      session: null,
      error: { message: err?.message || 'Network/auth error' },
    };
  }
}

/**
 * SIGN IN WITH OAUTH
 * Accepts 'google' or 'linkedin_oidc' (since legacy 'linkedin' is deprecated)
 */
async function signInWithOAuth(provider: 'google' | 'linkedin_oidc') {
  console.log(`[AUTH] signInWithOAuth called for ${provider}`);
  
  // 🟢 Force the scheme to match your app.json
  // This ensures the browser knows how to jump back to the app on Android.
  const redirectUrl = 'crackjobs://'; 
  console.log('[AUTH] Redirect URL:', redirectUrl);

  const { data, error } = await supabase.auth.signInWithOAuth({
    // @ts-ignore: TS might complain about 'linkedin_oidc' if types are old, but it works at runtime.
    provider: provider, 
    options: {
      redirectTo: redirectUrl,
      skipBrowserRedirect: false, 
    },
  });

  return { data, error };
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

  return {
    user: data?.user ?? null,
    session: data?.session ?? null,
    error: error ?? null,
  };
}

/**
 * SIGN OUT
 */
async function signOut() {
  console.log('================ SIGN OUT ================');
  const { error } = await supabase.auth.signOut();
  return { error };
}

/**
 * GET CURRENT USER (auth)
 */
async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user ?? null;
}

/**
 * GET CURRENT USER PROFILE
 */
async function getCurrentUserProfile(): Promise<Profile | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  return getUserProfileById(user.id);
}

/**
 * GET USER PROFILE BY ID
 */
async function getUserProfileById(userId: string): Promise<Profile | null> {
  console.log('[AUTH DBG] getUserProfileById called for', userId);

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle(); 

    if (error) {
      console.error('[AUTH DBG] Supabase fetch error:', error);
      return null;
    }

    return data as Profile;

  } catch (err) {
    console.error('[AUTH DBG] Unexpected error:', err);
    return null;
  }
}

/**
 * LISTEN FOR AUTH CHANGES
 */
function onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
  return supabase.auth.onAuthStateChange(callback);
}

export const authService = {
  signIn,
  signInWithOAuth, 
  signUp,
  signOut,
  getCurrentUser,
  getCurrentUserProfile,
  getUserProfileById,
  onAuthStateChange,
};