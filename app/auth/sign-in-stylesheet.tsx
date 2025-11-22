// app/auth/sign-in-stylesheet.tsx
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
} from 'react-native';
import { Link } from 'expo-router';
import { authService } from '@/services/auth.service';
import { UserRole } from '@/lib/types';
import { logger } from '@/lib/debug';

const theme = {
  color: {
    bg: '#FFFFFF',
    text: '#0F172A',
    subtext: '#64748B',
    label: '#334155',
    border: '#E2E8F0',
    inputBg: '#F8FAFC',
    placeholder: '#94A3B8',
    cta: '#0B8B82',
    ctaText: '#FFFFFF',
    ctaDisabled: '#86E3DD',
    roleActiveBorder: '#0B8B82',
    roleActiveBg: '#E6FFFB',
    link: '#0B8B82',
    debugBg: '#FEF3C7',
    debugBorder: '#FCD34D',
    debugText: '#92400E',
  },
  radius: 14,
  space: { xs: 8, sm: 12, md: 16, lg: 24, xl: 32, xxl: 48 },
  font: {
    family: Platform.select({
      web: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      default: 'System',
    }),
    h1: 34,
    h2: 18,
    body: 16,
    label: 12,
    cta: 18,
  },
  labelOpacity: 0.72,
};

export default function SignInStylesheetScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('candidate');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    logger.info('Auth', 'Sign in attempt', { email, role });

    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    const { error } = await authService.signIn(email, password);
    setLoading(false);

    if (error) {
      Alert.alert('Sign In Failed', error.message || 'Invalid credentials');
      return;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue your journey</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>SELECT YOUR ROLE</Text>
            <View style={styles.roleRow}>
              {(['candidate', 'mentor', 'admin'] as UserRole[]).map((r) => {
                const active = role === r;
                return (
                  <TouchableOpacity
                    key={r}
                    onPress={() => setRole(r)}
                    style={[styles.roleButton, active && styles.roleButtonActive]}
                    activeOpacity={0.9}
                  >
                    <Text style={[styles.roleText, active && styles.roleTextActive]}>
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>EMAIL ADDRESS</Text>
            <TextInput
              style={styles.input}
              placeholder="your.email@example.com"
              placeholderTextColor={theme.color.placeholder}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>PASSWORD</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor={theme.color.placeholder}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          <TouchableOpacity
            onPress={handleSignIn}
            disabled={loading}
            activeOpacity={0.9}
            style={[styles.cta, loading && styles.ctaDisabled]}
          >
            {loading ? (
              <ActivityIndicator color={theme.color.ctaText} />
            ) : (
              <Text style={styles.ctaText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Don’t have an account? </Text>
            <Link href="/auth/sign-up" asChild>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </View>

          {__DEV__ && (
            <View style={styles.debugBox}>
              <Text style={styles.debugTitle}>🔧 DEBUG MODE</Text>
              <Text style={styles.debugText}>Try: candidate@test.com / test123</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.color.bg },
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  content: {
    flex: 1,
    paddingHorizontal: theme.space.xl,
    paddingVertical: theme.space.xxl,
    justifyContent: 'center',
  },
  header: { marginBottom: theme.space.xl },
  title: {
    fontFamily: theme.font.family as string,
    fontSize: theme.font.h1,
    fontWeight: '800',
    color: theme.color.text,
    letterSpacing: -0.3,
    marginBottom: theme.space.xs,
  },
  subtitle: {
    fontFamily: theme.font.family as string,
    fontSize: theme.font.h2,
    color: theme.color.subtext,
  },
  section: { marginBottom: theme.space.lg },
  label: {
    fontFamily: theme.font.family as string,
    fontSize: theme.font.label,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: theme.color.label,
    opacity: theme.labelOpacity,
    marginBottom: theme.space.sm,
  },
  roleRow: { flexDirection: 'row', gap: theme.space.sm },
  roleButton: {
    flex: 1,
    paddingVertical: theme.space.md,
    borderRadius: theme.radius,
    borderWidth: 2,
    borderColor: theme.color.border,
    backgroundColor: theme.color.inputBg,
    alignItems: 'center',
  },
  roleButtonActive: {
    borderColor: theme.color.roleActiveBorder,
    backgroundColor: theme.color.roleActiveBg,
  },
  roleText: {
    fontFamily: theme.font.family as string,
    fontSize: theme.font.body,
    fontWeight: '700',
    color: theme.color.subtext,
  },
  roleTextActive: { color: theme.color.text },
  input: {
    width: '100%',
    paddingVertical: theme.space.md,
    paddingHorizontal: theme.space.lg,
    borderWidth: 1,
    borderColor: theme.color.border,
    borderRadius: theme.radius,
    backgroundColor: theme.color.bg,
    fontFamily: theme.font.family as string,
    fontSize: theme.font.body,
    color: theme.color.text,
  },
  cta: {
    width: '100%',
    paddingVertical: theme.space.lg,
    borderRadius: theme.radius,
    backgroundColor: theme.color.cta,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.space.md,
    marginBottom: theme.space.lg,
    ...(Platform.OS === 'web'
      ? {
          boxShadow: '0 12px 20px rgba(11,139,130,0.35)',
        }
      : {
          shadowColor: theme.color.cta,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.27,
          shadowRadius: 8,
          elevation: 5,
        }),
  },
  ctaDisabled: { backgroundColor: theme.color.ctaDisabled },
  ctaText: {
    fontFamily: theme.font.family as string,
    color: theme.color.ctaText,
    fontSize: theme.font.cta,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.space.md,
  },
  footerText: {
    fontFamily: theme.font.family as string,
    fontSize: theme.font.body,
    color: theme.color.subtext,
  },
  footerLink: {
    fontFamily: theme.font.family as string,
    fontSize: theme.font.body,
    color: theme.color.link,
    fontWeight: '800',
  },
  debugBox: {
    marginTop: theme.space.lg,
    padding: theme.space.md,
    backgroundColor: theme.color.debugBg,
    borderRadius: theme.radius - 4,
    borderWidth: 1,
    borderColor: theme.color.debugBorder,
  },
  debugTitle: {
    fontFamily: theme.font.family as string,
    fontSize: theme.font.label,
    fontWeight: '700',
    color: theme.color.debugText,
    marginBottom: 4,
  },
  debugText: {
    fontFamily: theme.font.family as string,
    fontSize: theme.font.label,
    color: theme.color.debugText,
  },
});
