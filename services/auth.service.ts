// services/auth.service.ts
import { supabase } from '../lib/supabase/client';
import { Session, AuthChangeEvent } from '@supabase/supabase-js';
import * as WebBrowser from 'expo-web-browser'; //
import * as Linking from 'expo-linking'; //

// Warm up the browser for faster load
WebBrowser.maybeCompleteAuthSession();

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
};

// Helper for timing logs
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
 * SIGN IN (Email/Pass)
 */
async function signIn(email: string, password: string) {
  console.log('================ SIGN IN (SDK) ================');
  console.log('🔐 Attempting sign in for:', email);
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log('📱 Sign in response:', {
      hasUser: !!data?.user,
      hasSession: !!data?.session,
      userId: data?.user?.id,
      error: error?.message
    });

    if (error) {
      console.log('[AUTH DBG] Sign in error:', error.message);
      return { user: null, session: null, error };
    }

    // CRITICAL: Verify session was saved
    console.log('✅ Sign in successful, verifying session storage...');
    
    // Wait a bit for storage to complete
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const { data: { session: storedSession } } = await supabase.auth.getSession();
    console.log('📦 Session verification after sign in:', {
      hasStoredSession: !!storedSession,
      storedUserId: storedSession?.user?.id,
      matches: storedSession?.user?.id === data.user?.id
    });

    if (!storedSession) {
      console.error('❌ WARNING: Session was not persisted to storage!');
      console.error('This could be a storage permission or configuration issue');
    }

    return { user: data.user, session: data.session, error: null };
  } catch (err: any) {
    console.error('❌ Sign in exception:', err);
    return { user: null, session: null, error: { message: err?.message || 'Network/auth error' } };
  }
}

/**
 * SIGN IN WITH OAUTH (FIXED)
 */
async function signInWithOAuth(provider: 'google' | 'linkedin_oidc') {
  console.log(`[AUTH] signInWithOAuth called for ${provider}`);
  
  // 1. Create a dynamic redirect URL that works in Expo Go (exp://) and Prod (crackjobs://)
  const redirectUrl = Linking.createURL('/auth/callback'); 
  console.log('[AUTH] Redirect URL:', redirectUrl);

  try {
    // 2. Get the auth URL from Supabase, but DO NOT let Supabase open the browser (skipBrowserRedirect: true)
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider, 
      options: {
        redirectTo: redirectUrl,
        skipBrowserRedirect: true, // We handle the browser manually
      },
    });

    if (error) throw error;

    // 3. Open the browser session manually
    if (data?.url) {
      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
      
      // If the user cancels the browser, we can log it
      if (result.type !== 'success') {
        console.log('[AUTH] User cancelled or browser failed');
        return { data: null, error: { message: 'Login cancelled' } };
      }
      
      // Note: On successful redirect, Supabase's global event listener (in client.ts) 
      // picks up the deep link and sets the session.
      return { data, error: null };
    }
    
    return { data, error: null };
  } catch (err: any) {
    console.error('[AUTH] OAuth Error:', err);
    return { data: null, error: err };
  }
}

/**
 * SIGN UP (supabase-js)
 */
async function signUp(email: string, password: string, fullName: string, role: string) {
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
  return { user: data?.user ?? null, session: data?.session ?? null, error: error ?? null };
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
 * GET CURRENT USER
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