// services/auth.service.ts
import { supabase } from '../lib/supabase/client';
import { Session, AuthChangeEvent } from '@supabase/supabase-js';
import { EMAIL_TEMPLATES } from './email.templates';

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
 * SIGN UP (supabase-js)
 * Updated to accept phone number for metadata
 */
async function signUp(
  email: string, 
  password: string, 
  fullName: string, 
  role: string, 
  phone: string
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
          phone,
        },
      },
    })
  );

  // Send helpdesk notification for new signups (non-blocking)
  if (data?.user && !error) {
    console.log('[AUTH] 📧 Sending helpdesk signup notification...');
    sendHelpdeskSignupNotification(data.user.id, email, fullName, role).catch(err => {
      console.error('[AUTH] ⚠️ Helpdesk notification failed (non-critical):', err);
    });
  }

  return { user: data?.user ?? null, session: data?.session ?? null, error: error ?? null };
}

/**
 * Send helpdesk notification for new user signups
 */
async function sendHelpdeskSignupNotification(
  userId: string,
  email: string,
  fullName: string,
  role: string
) {
  try {
    const signupTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
    
    // Compile template manually (simple replacement)
    let html = EMAIL_TEMPLATES.HELPDESK_SIGNUP_NOTIFICATION
      .replace(/{{userRole}}/g, role)
      .replace(/{{fullName}}/g, fullName)
      .replace(/{{email}}/g, email)
      .replace(/{{professionalTitle}}/g, 'Pending profile completion')
      .replace(/{{userId}}/g, userId)
      .replace(/{{signupTime}}/g, signupTime);
    
    // Handle conditional mentor/candidate logic
    if (role === 'mentor') {
      html = html.replace(/{{#if isMentor}}/g, '')
        .replace(/{{else}}/g, '<!--')
        .replace(/{{\/if}}/g, '-->');
    } else {
      html = html.replace(/{{#if isMentor}}[\s\S]*?{{else}}/g, '<!--')
        .replace(/{{\/if}}/g, '-->');
    }
    
    const { error } = await supabase.functions.invoke('send-email', {
      body: {
        to: 'crackjobshelpdesk@gmail.com',
        subject: `🆕 New ${role.charAt(0).toUpperCase() + role.slice(1)} Signup - ${fullName}`,
        html: html,
        type: 'helpdesk-signup'
      }
    });

    if (error) {
      console.error('[AUTH] Helpdesk email error:', error);
    } else {
      console.log('[AUTH] ✅ Helpdesk signup notification sent');
    }
  } catch (err) {
    console.error('[AUTH] Exception sending helpdesk notification:', err);
  }
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
  signUp,
  signOut,
  getCurrentUser,
  getCurrentUserProfile,
  getUserProfileById,
  onAuthStateChange,
};