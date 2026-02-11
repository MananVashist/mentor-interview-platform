import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { useRouter } from 'expo-router';
import Head from 'expo-router/head';

import { authService } from '@/services/auth.service';
import { supabase } from '@/lib/supabase/client';
import { BrandHeader } from '@/lib/BrandHeader';
import { Footer } from '@/components/Footer';
import { useNotification } from '@/lib/ui/NotificationBanner';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const isWeb = Platform.OS === 'web';
  const { showNotification } = useNotification();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasValidSession, setHasValidSession] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let mounted = true;

    const verifyRecoveryToken = async () => {
      try {
        console.log('[ResetPassword] Starting session check...');
        
        // FIRST: Check if session was already established by parent layout
        // This prevents race conditions and duplicate processing
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        
        if (existingSession) {
          console.log('[ResetPassword] ✅ Session already established (likely by parent layout)');
          if (mounted) {
            setHasValidSession(true);
            setCheckingSession(false);
          }
          return;
        }
        
        // CRITICAL FIX: Check if we're in browser environment
        if (Platform.OS !== 'web') {
          console.log('[ResetPassword] Mobile platform - checking for recovery event');
          
          // On mobile, the recovery token is handled by Supabase automatically
          // We just need to check if there's a valid session
          console.error('[ResetPassword] ❌ No session on mobile and no recovery token');
          if (mounted) {
            setErrorMessage('Invalid or expired reset link');
            setCheckingSession(false);
            showNotification('Invalid reset link. Please request a new one.', 'error');
            setTimeout(() => router.replace('/auth/forgot-password'), 3000);
          }
          return;
        }

        // WEB PLATFORM HANDLING
        if (typeof window === 'undefined') {
          console.error('[ResetPassword] Not in browser environment');
          if (mounted) {
            setErrorMessage('Invalid environment');
            setCheckingSession(false);
          }
          return;
        }

        const hash = window.location.hash;
        console.log('[ResetPassword] URL hash:', hash.substring(0, 50) + '...');

        // Check for errors in URL first
        if (hash.includes('error=')) {
          const params = new URLSearchParams(hash.substring(1));
          const error = params.get('error');
          const errorDescription = params.get('error_description');
          
          console.error('[ResetPassword] Error in URL:', error, errorDescription);
          
          if (mounted) {
            setErrorMessage(
              errorDescription?.replace(/\+/g, ' ') || 'Reset link has expired'
            );
            setCheckingSession(false);
            showNotification('Reset link has expired. Please request a new one.', 'error');
            setTimeout(() => router.replace('/auth/forgot-password'), 3000);
          }
          return;
        }

        // Extract and verify recovery token from hash
        if (hash.includes('access_token=') && hash.includes('type=recovery')) {
          console.log('[ResetPassword] Recovery token detected in URL');
          
          const params = new URLSearchParams(hash.substring(1));
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');
          const type = params.get('type');

          console.log('[ResetPassword] Token details:', {
            hasAccessToken: !!accessToken,
            hasRefreshToken: !!refreshToken,
            type: type,
            accessTokenLength: accessToken?.length
          });

          if (!accessToken || type !== 'recovery') {
            console.error('[ResetPassword] Invalid token parameters');
            if (mounted) {
              setErrorMessage('Invalid reset link - missing or incorrect token');
              setCheckingSession(false);
              showNotification('Invalid reset link', 'error');
              setTimeout(() => router.replace('/auth/forgot-password'), 3000);
            }
            return;
          }

          console.log('[ResetPassword] Setting session with recovery token...');

          // Set the session using the recovery tokens
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          });

          console.log('[ResetPassword] setSession result:', {
            hasSession: !!data.session,
            hasUser: !!data.user,
            userEmail: data.user?.email,
            error: error?.message,
          });

          if (error) {
            console.error('[ResetPassword] setSession error:', error);
            if (mounted) {
              setErrorMessage(error.message || 'Failed to verify reset link');
              setCheckingSession(false);
              showNotification('Invalid or expired reset link', 'error');
              setTimeout(() => router.replace('/auth/forgot-password'), 3000);
            }
            return;
          }

          if (data.session && data.user) {
            console.log('[ResetPassword] ✅ Recovery session established successfully');
            console.log('[ResetPassword] User email:', data.user.email);
            
            if (mounted) {
              setHasValidSession(true);
              setCheckingSession(false);
            }
          } else {
            console.error('[ResetPassword] ❌ No session or user returned from setSession');
            if (mounted) {
              setErrorMessage('Failed to establish session');
              setCheckingSession(false);
              showNotification('Invalid or expired reset link', 'error');
              setTimeout(() => router.replace('/auth/forgot-password'), 3000);
            }
          }
        } else {
          console.error('[ResetPassword] No recovery token in URL hash');
          console.log('[ResetPassword] Hash contents:', hash);
          
          if (mounted) {
            setErrorMessage('Invalid reset link - missing recovery token');
            setCheckingSession(false);
            showNotification('Invalid reset link. Please request a new one.', 'error');
            setTimeout(() => router.replace('/auth/forgot-password'), 3000);
          }
        }
      } catch (err: any) {
        console.error('[ResetPassword] Exception during verification:', err);
        if (mounted) {
          setErrorMessage(err.message || 'Something went wrong');
          setCheckingSession(false);
          showNotification('Something went wrong. Please try again.', 'error');
        }
      }
    };

    // CRITICAL: Process recovery token immediately on mount
    verifyRecoveryToken();

    return () => {
      mounted = false;
    };
  }, [router, showNotification]);

  const handleSubmit = async () => {
    // Validation
    if (!newPassword || !confirmPassword) {
      showNotification('Please fill in all fields', 'error');
      return;
    }

    if (newPassword.length < 6) {
      showNotification('Password must be at least 6 characters', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showNotification('Passwords do not match', 'error');
      return;
    }

    setLoading(true);

    try {
      console.log('[ResetPassword] Updating password...');
      const { error } = await authService.updatePassword(newPassword);

      if (error) {
        console.error('[ResetPassword] Update error:', error);
        showNotification(error.message || 'Failed to update password', 'error');
        setLoading(false);
        return;
      }

      // Success
      console.log('[ResetPassword] ✅ Password updated successfully');
      showNotification('Password updated successfully!', 'success');
      
      // Sign out to force user to sign in with new password
      await authService.signOut();
      
      // Redirect to sign in
      setTimeout(() => {
        router.replace('/auth/sign-in');
      }, 1500);
    } catch (err: any) {
      console.error('[ResetPassword] Update exception:', err);
      showNotification(err.message || 'Something went wrong', 'error');
      setLoading(false);
    }
  };

  // LOADING STATE - Verifying token
  if (checkingSession) {
    return (
      <>
        <Head>
          <title>Reset Password | CrackJobs</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0E9384" />
          <Text style={styles.loadingText}>Verifying reset link...</Text>
        </View>
      </>
    );
  }

  // ERROR STATE - Invalid or expired link
  if (!hasValidSession) {
    return (
      <>
        <Head>
          <title>Invalid Link | CrackJobs</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Invalid Reset Link</Text>
          <Text style={styles.errorMessage}>
            {errorMessage || 'This password reset link is invalid or has expired.'}
          </Text>
          <Text style={styles.errorHint}>
            Reset links expire after a short period for security. Please request a new one.
          </Text>
          <TouchableOpacity
            onPress={() => router.replace('/auth/forgot-password')}
            style={styles.errorButton}
          >
            <Text style={styles.errorButtonText}>Request New Link</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  // MAIN FORM - Valid session, ready to reset password
  return (
    <>
      <Head>
        <title>Reset Password | CrackJobs</title>
        <meta name="description" content="Create a new password for your CrackJobs account" />
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
            <View style={styles.content}>
              <BrandHeader />

              <View style={styles.spacer} />

              <Text style={styles.title}>Create New Password</Text>
              <Text style={styles.subtitle}>
                Choose a strong password for your account.
              </Text>

              <View style={styles.section}>
                <Text style={styles.label}>NEW PASSWORD</Text>
                <TextInput
                  style={styles.input}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                  accessibilityLabel="New password"
                  accessibilityHint="Enter your new password (minimum 6 characters)"
                  textContentType="newPassword"
                  autoComplete="password-new"
                  editable={!loading}
                />
                <Text style={styles.hint}>Minimum 6 characters</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.label}>CONFIRM NEW PASSWORD</Text>
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                  accessibilityLabel="Confirm password"
                  accessibilityHint="Re-enter your new password to confirm"
                  textContentType="newPassword"
                  autoComplete="password-new"
                  editable={!loading}
                />
              </View>

              <TouchableOpacity
                onPress={handleSubmit}
                disabled={loading}
                style={styles.submitButton}
                accessibilityRole="button"
                accessibilityLabel="Reset password"
                accessibilityHint="Update your password with the new one"
                accessibilityState={{ disabled: loading }}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" accessibilityLabel="Updating password" />
                ) : (
                  <Text style={styles.submitButtonText}>Reset Password</Text>
                )}
              </TouchableOpacity>

              <View style={styles.securityNote}>
                <Text style={styles.securityNoteIcon}>🔒</Text>
                <Text style={styles.securityNoteText}>
                  After resetting your password, you'll be redirected to sign in with your new credentials.
                </Text>
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
    lineHeight: 20,
  },
  section: { marginBottom: 16 },
  label: { 
    fontSize: 12, 
    fontWeight: '600', 
    marginBottom: 6, 
    color: '#334155' 
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  hint: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#0E9384',
    borderRadius: 999,
    alignItems: 'center',
    padding: 14,
    marginTop: 8,
  },
  submitButtonText: { 
    color: '#fff', 
    fontWeight: '700',
    fontSize: 16,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 8,
    padding: 12,
    marginTop: 24,
  },
  securityNoteIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  securityNoteText: {
    flex: 1,
    fontSize: 12,
    color: '#1e40af',
    lineHeight: 16,
  },

  // Loading state
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f5f0',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#6b7280',
  },

  // Error state
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f5f0',
    padding: 24,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 12,
  },
  errorHint: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  errorButton: {
    backgroundColor: '#0E9384',
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  errorButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});