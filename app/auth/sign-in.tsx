// app/auth/sign-in.tsx
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator,
  KeyboardAvoidingView, Platform, StyleSheet, Keyboard, Linking,
} from 'react-native';
import { Link, useRouter, useLocalSearchParams } from 'expo-router';
import Head from 'expo-router/head';

import { authService } from '@/services/auth.service';
import { candidateService } from '@/services/candidate.service';
import { mentorService } from '@/services/mentor.service';
import { useAuthStore } from '@/lib/store';
import { BrandHeader } from '@/lib/BrandHeader';
import { Footer } from '@/components/Footer';
import { useNotification } from '@/lib/ui/NotificationBanner';

const TEAL = '#0E9384';
const HELPDESK = 'crackjobshelpdesk@gmail.com';

export default function SignInScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const isWeb = Platform.OS === 'web';
  const { showNotification } = useNotification();

  const { setUser, setProfile, setCandidateProfile, setMentorProfile, setSession } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // 🟢 When sign-in fails with invalid credentials, show an inline help card
  // instead of just a toast. Guides the user to their inbox (dummy password),
  // Forgot Password, or the helpdesk — covers the guest-account scenario cleanly.
  const [showCredHint, setShowCredHint] = useState(false);

  const finishSignIn = () => {
    showNotification('Welcome back!', 'success');
    const { redirectTo, ...bookingParams } = params;
    if (redirectTo) {
      router.replace({ pathname: redirectTo as any, params: bookingParams });
    } else {
      router.replace('/candidate');
    }
  };

  const handlePostAuth = async (user: any, session: any) => {
    if (!user || !session) {
      showNotification('Login failed: missing session information', 'error');
      return;
    }
    try {
      let profile = await authService.getUserProfileById(user.id);

      if (profile) {
        const roleLower = (profile.role || '').toLowerCase().trim();

        if (roleLower === 'admin' || profile.is_admin) {
          setUser(user); setSession(session); setProfile(profile as any);
          showNotification('Welcome back, Admin!', 'success');
          router.replace('/admin');
          return;
        }

        if (roleLower === 'mentor') {
          const m = await mentorService.getMentorById(user.id);
          if (!m || !m.status || m.status !== 'approved') {
            showNotification('Your mentor application is still being reviewed', 'error');
            await authService.signOut();
            router.replace('/mentor/under-review');
            return;
          }
          setUser(user); setSession(session); setProfile(profile as any); setMentorProfile(m ?? null);
          showNotification('Welcome back!', 'success');
          router.replace('/mentor/bookings');
          return;
        }

        // Candidate
        const c = await candidateService.getCandidateById(user.id);
        const title = c?.professional_title?.trim();
        const name = profile.full_name?.trim();

        setUser(user); setSession(session); setProfile(profile as any); setCandidateProfile(c ?? null);

        if (!title || title.toLowerCase() === 'candidate' || !name) {
          showNotification('Please complete your profile to continue', 'info');
          router.replace('/candidate/profile');
          return;
        }

        finishSignIn();
      } else {
        setUser(user); setSession(session);
        finishSignIn();
      }
    } catch (err: any) {
      showNotification(err.message || 'Something went wrong after sign in', 'error');
    }
  };

  const handleSignIn = async () => {
    Keyboard.dismiss();
    const safeEmail = email.trim().toLowerCase();

    if (!safeEmail || !password) {
      showNotification('Please enter both email and password', 'error');
      return;
    }
    if (loading) return;

    setShowCredHint(false);
    setLoading(true);

    try {
      const { user, session, error } = await authService.signIn(safeEmail, password);

      if (error || !user || !session) {
        const msg = error?.message?.toLowerCase() || '';

        if (msg.includes('aborted') || msg.includes('network')) {
          showNotification('Network timed out. Please check your connection and try again.', 'error');
        } else if (
          msg.includes('invalid') ||
          msg.includes('credentials') ||
          msg.includes('incorrect') ||
          msg.includes('wrong password') ||
          msg.includes('email not confirmed')
        ) {
          // 🟢 Show the inline hint card — covers guest accounts who may not know
          // their dummy password, as well as any regular wrong-password scenario.
          setShowCredHint(true);
        } else {
          showNotification(error?.message || 'Sign in failed', 'error');
        }

        setLoading(false);
        return;
      }

      await handlePostAuth(user, session);

    } catch (err: any) {
      const msg = err?.message?.toLowerCase() || '';
      if (msg.includes('aborted') || msg.includes('network')) {
        showNotification('Network timed out. Please check your connection and try again.', 'error');
      } else {
        showNotification(err?.message || 'Sign in failed', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Log In | CrackJobs</title>
        <meta name="description" content="Log in to your CrackJobs account to manage your interviews and bookings." />
      </Head>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formWrapper}>
            <View style={styles.content}>
              <BrandHeader showEyes={true} />
              <View style={styles.spacer} />

              <View style={styles.section}>
                <Text style={styles.label}>EMAIL ADDRESS</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={(t) => { setEmail(t); setShowCredHint(false); }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholder="name@email.com"
                  placeholderTextColor="#9CA3AF"
                  textContentType="emailAddress"
                  autoComplete="email"
                />
              </View>

              <View style={styles.section}>
                <View style={styles.passwordHeader}>
                  <Text style={styles.label}>PASSWORD</Text>
                  <Link href="/auth/forgot-password" asChild>
                    <TouchableOpacity>
                      <Text style={styles.forgotPasswordLink}>Forgot?</Text>
                    </TouchableOpacity>
                  </Link>
                </View>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={(t) => { setPassword(t); setShowCredHint(false); }}
                  secureTextEntry
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                  textContentType="password"
                  autoComplete="password"
                />
              </View>

              {/* 🟢 INLINE CREDENTIAL HINT CARD
                  Shown when sign-in fails with an invalid credentials error.
                  Covers the guest account scenario: they received a dummy password
                  by email and may be trying the wrong password or have forgotten it. */}
              {showCredHint && (
                <View style={styles.hintCard}>
                  <Text style={styles.hintTitle}>Can't sign in?</Text>
                  <Text style={styles.hintBody}>
                    If you booked a session as a guest, your password was sent to your inbox automatically.
                  </Text>
                  <View style={styles.hintActions}>
                    <TouchableOpacity
                      style={styles.hintBtn}
                      onPress={() => router.push('/auth/forgot-password')}
                    >
                      <Text style={styles.hintBtnTxt}>🔑 Forgot Password</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.hintBtn, styles.hintBtnSecondary]}
                      onPress={() => Linking.openURL(`mailto:${HELPDESK}`)}
                    >
                      <Text style={[styles.hintBtnTxt, { color: '#374151' }]}>✉️ Get Help</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.hintHelpdesk}>
                    Or email us at{' '}
                    <Text
                      style={styles.hintHelpdeskLink}
                      onPress={() => Linking.openURL(`mailto:${HELPDESK}`)}
                    >
                      {HELPDESK}
                    </Text>
                  </Text>
                </View>
              )}

              <TouchableOpacity
                onPress={handleSignIn}
                disabled={loading}
                style={styles.signInButton}
              >
                {loading
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={styles.signInButtonText}>Sign In</Text>
                }
              </TouchableOpacity>

              <View style={styles.authFooter}>
                <Text style={styles.authFooterText}>Don't have an account? </Text>
                <Link href={{ pathname: '/auth/sign-up', params }} asChild>
                  <TouchableOpacity>
                    <Text style={styles.authFooterLink}>Sign Up</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </View>
          {isWeb && <Footer />}
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f5f0' },
  scrollContent: { flexGrow: 1, flexDirection: 'column' },
  formWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60, width: '100%' },
  content: { padding: 24, maxWidth: 400, width: '100%', backgroundColor: 'transparent' },
  spacer: { marginBottom: 24 },
  section: { marginBottom: 16 },
  passwordHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  label: { fontSize: 12, fontWeight: '600', color: '#334155' },
  forgotPasswordLink: { fontSize: 12, fontWeight: '600', color: TEAL },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10, padding: 12, backgroundColor: '#fff', color: '#111827' },

  // 🟢 Inline hint card
  hintCard: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  hintTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 6,
  },
  hintBody: {
    fontSize: 13,
    color: '#78350F',
    lineHeight: 19,
    marginBottom: 14,
  },
  hintActions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  hintBtn: {
    flex: 1,
    backgroundColor: TEAL,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  hintBtnSecondary: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  hintBtnTxt: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  hintHelpdesk: {
    fontSize: 12,
    color: '#92400E',
    textAlign: 'center',
  },
  hintHelpdeskLink: {
    fontWeight: '700',
    color: TEAL,
    textDecorationLine: 'underline',
  },

  signInButton: { backgroundColor: TEAL, borderRadius: 999, alignItems: 'center', padding: 14, marginTop: 8 },
  signInButtonText: { color: '#fff', fontWeight: '700' },
  authFooter: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  authFooterText: { color: '#6b7280' },
  authFooterLink: { color: TEAL, fontWeight: '700' },
});