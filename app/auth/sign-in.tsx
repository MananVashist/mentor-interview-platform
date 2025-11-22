import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Image,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { authService } from '@/services/auth.service';
import { candidateService } from '@/services/candidate.service';
import { mentorService } from '@/services/mentor.service';
import { useAuthStore } from '@/lib/store';
import { logger } from '@/lib/debug';

// OAuth imports
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import Constants from 'expo-constants';
import { supabase } from '@/lib/supabase/client';

WebBrowser.maybeCompleteAuthSession();

const redirectTo = makeRedirectUri({
  scheme: Constants.expoConfig?.scheme ?? 'mentorplatform',
  path: 'auth-callback',
  preferLocalhost: true,
});

export default function SignInScreen() {
  const router = useRouter();
  const {
    setUser,
    setProfile,
    setCandidateProfile,
    setMentorProfile,
    setSession,
  } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const signInWithProvider = async (provider: 'google' | 'linkedin_oidc') => {
    logger.info('[AUTH UI] sign-in with provider', { provider, redirectTo });
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
          skipBrowserRedirect: false,
        },
      });
      if (error) {
        logger.warn('[AUTH UI] provider error', error);
        Alert.alert('Error', error.message ?? 'OAuth failed');
      }
    } catch (e: any) {
      logger.error('[AUTH UI] provider exception', e);
      Alert.alert('Error', 'Unexpected OAuth error');
    }
  };

  const handleSignIn = async () => {
    console.log('🔵 [Sign-In] Button clicked for:', email);
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      // 1. Authenticate
      const { user, session, error } = await authService.signIn(email, password);
      
      if (error || !user || !session) {
        Alert.alert('Login Failed', error?.message || 'Invalid credentials');
        setLoading(false);
        return;
      }

      setUser(user);
      setSession(session);

      // 2. Fetch Profile
      console.log('🔵 [Sign-In] Authenticated. User ID:', user.id);
      let profile = await authService.getUserProfileById(user.id);
      
      // DEBUG: Check raw result
      if (!profile) {
          console.warn('⚠️ [Sign-In] Profile is NULL. RLS might be blocking read, or row missing.');
      } else {
          console.log('✅ [Sign-In] Profile found:', profile);
      }

      // 3. SELF-HEALING: If profile missing, create it!
      if (!profile) {
        console.warn("🛠️ [Sign-In] Attempting to auto-create Mentor profile...");
        
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            full_name: 'New Mentor', 
            role: 'mentor'           
          })
          .select()
          .single();

        if (createError) {
            console.error("🔴 [Sign-In] Failed to auto-create profile:", createError);
            // Even if this fails, we can't proceed without a role.
            // We will fall through to the metadata check below.
        } else {
            console.log("✅ [Sign-In] Profile auto-created:", newProfile);
            profile = newProfile; 
        }
      }

      // 4. Route based on Role
      if (profile) {
        setProfile(profile as any);
        
        // Handle specifics (Candidate/Mentor tables)
        const roleLower = (profile.role || '').toLowerCase().trim();
        // 🎯 1. ADMIN CHECK
        if (roleLower === 'admin' || profile.is_admin) { 
             router.replace('/admin'); // Goes to Admin Dashboard
             return;
        }

        // 🎯 2. MENTOR SCREENING CHECK
        if (roleLower === 'mentor') {
            const m = await mentorService.getMentorById(user.id);
            setMentorProfile(m ?? null);

            // If status is NOT approved, block them
            // (Handles null status, 'pending', or 'rejected')
            if (!m?.status || m.status === 'pending' || m.status === 'rejected') {
                router.replace('/mentor/under-review');
                return;
            }
            
            // Approved -> Go to Dashboard
            router.replace('/mentor');
            
        } else {
            // Candidate Flow
            const c = await candidateService.getCandidateById(user.id);
            setCandidateProfile(c ?? null);
            router.replace('/candidate');
        }

      } else {
        router.replace('/candidate');
      }

    } catch (err: any) {
      logger.error('[AUTH UI] Exception:', err);
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Welcome back 👋</Text>
            <Text style={styles.subtitle}>Sign in to continue your journey</Text>
          </View>

          {/* Email / Password */}
          <View style={styles.section}>
            <Text style={styles.label}>EMAIL ADDRESS</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              placeholder="you@example.com"
              keyboardType="email-address"
              textContentType="emailAddress"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>PASSWORD</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              secureTextEntry
              placeholder="••••••••"
              textContentType="password"
            />
          </View>

          {/* Primary Sign In */}
          <TouchableOpacity
            onPress={handleSignIn}
            disabled={loading}
            style={[styles.signInButton, loading && styles.signInButtonDisabled]}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.signInButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          {/* Divider “or” */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social buttons */}
          <View style={{ gap: 8, width: '100%', marginBottom: 12 }}>
            <TouchableOpacity
              onPress={() => signInWithProvider('google')}
              style={[styles.oauthBtn, styles.googleBtn]}
            >
              <View style={styles.oauthInner}>
                <Image
                  source={{ uri: 'https://developers.google.com/identity/images/g-logo.png' }}
                  style={styles.oauthIcon}
                  resizeMode="contain"
                />
                <Text style={[styles.oauthText, styles.googleText]}>Continue with Google</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => signInWithProvider('linkedin_oidc')}
              style={[styles.oauthBtn, styles.linkedinBtn]}
            >
              <View style={styles.oauthInner}>
                <Image
                  source={{
                    uri: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png',
                  }}
                  style={styles.oauthIcon}
                  resizeMode="contain"
                />
                <Text style={[styles.oauthText, styles.linkedinText]}>Continue with LinkedIn</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Sign up link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don’t have an account? </Text>
            <Link href="/auth/sign-up" asChild>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// --- HELPER FUNCTION FOR REDIRECTION ---
function goToRole(router: any, role: string | null) {
  console.log('🔄 [Redirection] Checking role:', role); 

  if (!role) {
    console.warn('⚠️ No role found, defaulting to candidate');
    router.replace('/candidate');
    return;
  }

  const normalizedRole = role.toLowerCase().trim();
  
  if (normalizedRole === 'mentor') {
    console.log('✅ Redirecting to /mentor');
    router.replace('/mentor');
  } else if (normalizedRole === 'admin') {
    router.replace('/(admin)');
  } else {
    console.log('✅ Redirecting to /candidate');
    router.replace('/candidate');
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  content: { flex: 1, justifyContent: 'center', padding: 24, maxWidth: 520, alignSelf: 'center', width: '100%' },
  header: { marginBottom: 32, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#0f172a' },
  subtitle: { color: '#6b7280', marginTop: 4, textAlign: 'center' },
  section: { marginBottom: 16, width: '100%' },
  label: { fontSize: 12, fontWeight: '600', marginBottom: 6, color: '#334155' },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10, padding: 12, backgroundColor: '#fff' },
  signInButton: { backgroundColor: '#0E9384', borderRadius: 999, alignItems: 'center', padding: 14, marginTop: 8 },
  signInButtonDisabled: { backgroundColor: '#93c5fd' },
  signInButtonText: { color: '#fff', fontWeight: '700' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#e5e7eb' },
  dividerText: { fontSize: 12, color: '#6b7280' },
  oauthBtn: { borderRadius: 999, borderWidth: 1, overflow: 'hidden' },
  oauthInner: { flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'center', paddingVertical: 12 },
  oauthIcon: { width: 18, height: 18 },
  oauthText: { fontSize: 14 },
  googleBtn: { backgroundColor: '#fff', borderColor: '#e5e7eb' },
  googleText: { color: '#111827', fontWeight: '700' },
  linkedinBtn: { backgroundColor: '#0A66C2', borderColor: '#0A66C2' },
  linkedinText: { color: '#fff', fontWeight: '700' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  footerText: { color: '#6b7280' },
  footerLink: { color: '#0E9384', fontWeight: '700' },
});