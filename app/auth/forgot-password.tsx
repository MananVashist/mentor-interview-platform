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
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import Head from 'expo-router/head';

import { authService } from '@/services/auth.service';
import { BrandHeader } from '@/lib/BrandHeader';
import { Footer } from '@/components/Footer';
import { useNotification } from '@/lib/ui/NotificationBanner';
import { isValidEmail } from '@/lib/utils';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const isWeb = Platform.OS === 'web';
  const { showNotification } = useNotification();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async () => {
    // Validate email
    if (!email.trim()) {
      showNotification('Please enter your email address', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showNotification('Please enter a valid email address', 'error');
      return;
    }

    setLoading(true);

    try {
      const { error } = await authService.requestPasswordReset(email.trim().toLowerCase());

      if (error) {
        showNotification(error.message || 'Failed to send reset email', 'error');
        setLoading(false);
        return;
      }

      // Success - show confirmation
      setEmailSent(true);
      showNotification('Password reset email sent! Check your inbox.', 'success');
    } catch (err: any) {
      console.error('[ForgotPassword] Error:', err);
      showNotification(err.message || 'Something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <>
        <Head>
          <title>Check Your Email | CrackJobs</title>
          <meta name="description" content="Password reset email sent" />
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

                {/* Success Icon */}
                <View style={styles.iconContainer}>
                  <Text style={styles.successIcon}>✉️</Text>
                </View>

                <Text style={styles.successTitle}>Check your email</Text>
                <Text style={styles.successMessage}>
                  We've sent a password reset link to {email}. 
                  Click the link in the email to reset your password.
                </Text>

                <View style={styles.instructionsBox}>
                  <Text style={styles.instructionsTitle}>Next steps:</Text>
                  <Text style={styles.instructionItem}>
                    1. Check your inbox (and spam folder)
                  </Text>
                  <Text style={styles.instructionItem}>
                    2. Click the reset link in the email
                  </Text>
                  <Text style={styles.instructionItem}>
                    3. Create a new password
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => router.replace('/auth/sign-in')}
                  style={styles.backButton}
                >
                  <Text style={styles.backButtonText}>Back to Sign In</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setEmailSent(false);
                    setEmail('');
                  }}
                  style={styles.linkContainer}
                >
                  <Text style={styles.linkText}>
                    Didn't receive the email? Try again
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {isWeb && <Footer />}
          </ScrollView>
        </KeyboardAvoidingView>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Forgot Password | CrackJobs</title>
        <meta name="description" content="Reset your CrackJobs account password" />
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

              <Text style={styles.title}>Forgot your password?</Text>
              <Text style={styles.subtitle}>
                No worries! Enter your email address and we'll send you a link to reset your password.
              </Text>

              <View style={styles.section}>
                <Text style={styles.label}>EMAIL ADDRESS</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholder="name@email.com"
                  placeholderTextColor="#9CA3AF"
                  accessibilityLabel="Email address"
                  accessibilityHint="Enter your email address to receive password reset link"
                  textContentType="emailAddress"
                  autoComplete="email"
                  editable={!loading}
                />
              </View>

              <TouchableOpacity
                onPress={handleSubmit}
                disabled={loading}
                style={styles.submitButton}
                accessibilityRole="button"
                accessibilityLabel="Send reset link"
                accessibilityHint="Send password reset link to your email"
                accessibilityState={{ disabled: loading }}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" accessibilityLabel="Sending reset link" />
                ) : (
                  <Text style={styles.submitButtonText}>Send Reset Link</Text>
                )}
              </TouchableOpacity>

              <View style={styles.authFooter}>
                <Text style={styles.authFooterText}>Remember your password? </Text>
                <Link href="/auth/sign-in" asChild>
                  <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel="Sign in"
                    accessibilityHint="Navigate back to sign in page"
                  >
                    <Text style={styles.authFooterLink}>Sign In</Text>
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
  authFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  authFooterText: { 
    color: '#6b7280',
    fontSize: 14,
  },
  authFooterLink: { 
    color: '#0E9384', 
    fontWeight: '700',
    fontSize: 14,
  },
  
  // Success state styles
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  successIcon: {
    fontSize: 64,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  instructionsBox: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#86efac',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#166534',
    marginBottom: 8,
  },
  instructionItem: {
    fontSize: 14,
    color: '#166534',
    marginBottom: 4,
    lineHeight: 20,
  },
  backButton: {
    backgroundColor: '#0E9384',
    borderRadius: 999,
    alignItems: 'center',
    padding: 14,
    marginBottom: 16,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  linkContainer: {
    alignItems: 'center',
  },
  linkText: {
    color: '#0E9384',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});