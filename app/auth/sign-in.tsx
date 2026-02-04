import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import Head from 'expo-router/head';

import { authService } from '@/services/auth.service';
import { candidateService } from '@/services/candidate.service';
import { mentorService } from '@/services/mentor.service';
import { useAuthStore } from '@/lib/store';
import { BrandHeader } from '@/lib/BrandHeader';
import { Footer } from '@/components/Footer';
import { useNotification } from '@/lib/ui/NotificationBanner';

export default function SignInScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const { showNotification } = useNotification();
  
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
          setUser(user);
          setSession(session);
          setProfile(profile as any);
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
          setUser(user);
          setSession(session);
          setProfile(profile as any);
          setMentorProfile(m ?? null);
          showNotification('Welcome back!', 'success');
          router.replace('/mentor/bookings');
          return;
        }

        const c = await candidateService.getCandidateById(user.id);
        setUser(user);
        setSession(session);
        setProfile(profile as any);
        setCandidateProfile(c ?? null);
        showNotification('Welcome back!', 'success');
        router.replace('/candidate');
      } else {
        setUser(user);
        setSession(session);
        showNotification('Welcome!', 'success');
        router.replace('/candidate');
      }
    } catch (err: any) {
      console.error('[SignIn] handlePostAuth error:', err);
      showNotification(err.message || 'Something went wrong after sign in', 'error');
    }
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      showNotification('Please enter both email and password', 'error');
      return;
    }
    setLoading(true);
    try {
      const { user, session, error } = await authService.signIn(email, password);
      
      if (error || !user || !session) {
        showNotification(error?.message || 'Invalid credentials', 'error');
        setLoading(false);
        return;
      }
      await handlePostAuth(user, session);

    } catch (err: any) {
      console.error('[SignIn] handleSignIn error:', err);
      showNotification(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Log In | CrackJobs</title>
        <meta name="description" content="Log in to your CrackJobs account to manage your interviews and bookings." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formWrapper}>
            <View 
              style={styles.content}
              accessibilityLabel="Sign in form"
            >
              <BrandHeader showEyes={true} />

              <View style={styles.spacer} />

              <View style={styles.section}>
                <Text style={styles.label}>
                  EMAIL ADDRESS
                </Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholder="name@email.com"
                  placeholderTextColor="#9CA3AF"
                  accessibilityLabel="Email address"
                  accessibilityHint="Enter your email address"
                  textContentType="emailAddress"
                  autoComplete="email"
                />
              </View>

              <View style={styles.section}>
                <View style={styles.passwordHeader}>
                  <Text style={styles.label}>PASSWORD</Text>
                  <Link href="/auth/forgot-password" asChild>
                    <TouchableOpacity
                      accessibilityRole="button"
                      accessibilityLabel="Forgot password"
                      accessibilityHint="Navigate to password reset page"
                    >
                      <Text style={styles.forgotPasswordLink}>Forgot?</Text>
                    </TouchableOpacity>
                  </Link>
                </View>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                  accessibilityLabel="Password"
                  accessibilityHint="Enter your password"
                  textContentType="password"
                  autoComplete="password"
                />
              </View>

              <TouchableOpacity
                onPress={handleSignIn}
                disabled={loading}
                style={styles.signInButton}
                accessibilityRole="button"
                accessibilityLabel="Sign in"
                accessibilityHint="Sign in to your account"
                accessibilityState={{ disabled: loading }}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" accessibilityLabel="Signing in" />
                ) : (
                  <Text style={styles.signInButtonText}>Sign In</Text>
                )}
              </TouchableOpacity>

              <View style={styles.authFooter}>
                <Text style={styles.authFooterText}>Don't have an account? </Text>
                <Link href="/auth/sign-up" asChild>
                  <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel="Sign up"
                    accessibilityHint="Navigate to sign up page to create a new account"
                  >
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
  formWrapper: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60, 
    width: '100%',
  },
  content: { 
    padding: 24, 
    maxWidth: 400, 
    width: '100%',
    backgroundColor: 'transparent',
  },
  spacer: { marginBottom: 24 },
  section: { marginBottom: 16 },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: { 
    fontSize: 12, 
    fontWeight: '600', 
    color: '#334155' 
  },
  forgotPasswordLink: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0E9384',
  },
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
  signInButtonText: { color: '#fff', fontWeight: '700' },
  authFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  authFooterText: { color: '#6b7280' },
  authFooterLink: { color: '#0E9384', fontWeight: '700' },
});