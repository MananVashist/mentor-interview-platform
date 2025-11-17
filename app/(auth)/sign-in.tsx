// app/(auth)/sign-in.tsx
// Always a pure sign-in screen (no landing here)

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
  Image, // ✅ ADD
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { authService } from '@/services/auth.service';
import { candidateService } from '@/services/candidate.service';
import { mentorService } from '@/services/mentor.service';
import { useAuthStore } from '@/lib/store';
import { logger } from '@/lib/debug';

// ✅ OAuth imports (unchanged)
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import Constants from 'expo-constants';
import { supabase } from '@/lib/supabase/client';

WebBrowser.maybeCompleteAuthSession();

// ✅ Redirect target for web & native (unchanged)
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
    logger.info('[AUTH UI] sign-in button clicked', { email });
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      logger.info('[AUTH UI] calling authService.signIn');
      const { user, session, error } = await authService.signIn(email, password);
      logger.info('[AUTH UI] signIn result', { hasUser: !!user, hasSession: !!session, error });

      if (error) {
        Alert.alert('Sign In Failed', error.message || 'Invalid email or password');
        setLoading(false);
        return;
      }

      if (!user || !session) {
        Alert.alert('Sign In Failed', 'Unable to sign in. Please try again.');
        setLoading(false);
        return;
      }

      setUser(user);
      setSession(session);

      logger.info('[AUTH UI] fetching profile from DB', { userId: user.id });
      const profile = await authService.getUserProfileById(user.id);
      logger.info('[AUTH UI] profile fetched', profile);

      if (profile) {
        setProfile(profile as any);

        if (profile.role === 'candidate') {
          const candidate = await candidateService.getCandidateById(user.id);
          setCandidateProfile(candidate ?? null);
        } else if (profile.role === 'mentor') {
          const mentor = await mentorService.getMentorById(user.id);
          setMentorProfile(mentor ?? null);
        }

        goToRole(router, profile.role);
      } else {
        const meta = (user as any).user_metadata || {};
        const fallback = {
          id: user.id,
          email: user.email ?? '',
          full_name: meta.full_name ?? null,
          role: meta.role ?? null,
        };
        setProfile(fallback as any);
        if (fallback.role) {
          goToRole(router, fallback.role);
        } else {
          Alert.alert('Signed in', 'But no role found. Please contact admin.');
        }
      }

      setLoading(false);
    } catch (err: any) {
      logger.error('[AUTH UI] sign-in exception', err);
      Alert.alert('Error', 'Unexpected error during sign in.');
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

          {/* Social buttons moved BELOW Sign In and ABOVE Sign Up */}
          <View style={{ gap: 8, width: '100%', marginBottom: 12 }}>
            {/* Google: white button, dark text, Google “G” logo on left (official) */}
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

            {/* LinkedIn: blue button, white text, official “in” glyph */}
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
            <Link href="/(auth)/sign-up" asChild>
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

function goToRole(router: any, role: string | null) {
  if (!role) return;
  switch (role) {
    case 'candidate':
      router.replace('/candidate');
      break;
    case 'mentor':
      router.replace('/mentor');
      break;
    case 'admin':
      router.replace('/(admin)');
      break;
    default:
      router.replace('/candidate');
      break;
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
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#fff',
  },

  signInButton: {
    backgroundColor: '#0E9384',
    borderRadius: 999,
    alignItems: 'center',
    padding: 14,
    marginTop: 8,
  },
  signInButtonDisabled: { backgroundColor: '#93c5fd' },
  signInButtonText: { color: '#fff', fontWeight: '700' },

  // Divider
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    fontSize: 12,
    color: '#6b7280',
  },

  // OAuth buttons
  oauthBtn: {
    borderRadius: 999,
    borderWidth: 1,
    overflow: 'hidden',
  },
  oauthInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'center',
    paddingVertical: 12,
  },
  oauthIcon: { width: 18, height: 18 },

  // Google style (white button, dark text)
  googleBtn: { backgroundColor: '#fff', borderColor: '#e5e7eb' },
  googleText: { color: '#111827', fontWeight: '700' },

  // LinkedIn style (brand blue, white text)
  linkedinBtn: { backgroundColor: '#0A66C2', borderColor: '#0A66C2' },
  linkedinText: { color: '#fff', fontWeight: '700' },

  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  footerText: { color: '#6b7280' },
  footerLink: { color: '#0E9384', fontWeight: '700' },
});
