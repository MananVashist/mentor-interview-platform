// app/(auth)/sign-in-stylesheet.tsx
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

const THEME = {
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
              placeholderTextColor={THEME.color.placeholder}
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
              placeholderTextColor={THEME.color.placeholder}
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
              <ActivityIndicator color={THEME.color.ctaText} />
            ) : (
              <Text style={styles.ctaText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Don’t have an account? </Text>
            <Link href="/(auth)/sign-up" asChild>
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
  container: { flex: 1, backgroundColor: THEME.color.bg },
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  content: {
    flex: 1,
    paddingHorizontal: THEME.space.xl,
    paddingVertical: THEME.space.xxl,
    justifyContent: 'center',
  },
  header: { marginBottom: THEME.space.xl },
  title: {
    fontFamily: THEME.font.family as string,
    fontSize: THEME.font.h1,
    fontWeight: '800',
    color: THEME.color.text,
    letterSpacing: -0.3,
    marginBottom: THEME.space.xs,
  },
  subtitle: {
    fontFamily: THEME.font.family as string,
    fontSize: THEME.font.h2,
    color: THEME.color.subtext,
  },
  section: { marginBottom: THEME.space.lg },
  label: {
    fontFamily: THEME.font.family as string,
    fontSize: THEME.font.label,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: THEME.color.label,
    opacity: THEME.labelOpacity,
    marginBottom: THEME.space.sm,
  },
  roleRow: { flexDirection: 'row', gap: THEME.space.sm },
  roleButton: {
    flex: 1,
    paddingVertical: THEME.space.md,
    borderRadius: THEME.radius,
    borderWidth: 2,
    borderColor: THEME.color.border,
    backgroundColor: THEME.color.inputBg,
    alignItems: 'center',
  },
  roleButtonActive: {
    borderColor: THEME.color.roleActiveBorder,
    backgroundColor: THEME.color.roleActiveBg,
  },
  roleText: {
    fontFamily: THEME.font.family as string,
    fontSize: THEME.font.body,
    fontWeight: '700',
    color: THEME.color.subtext,
  },
  roleTextActive: { color: THEME.color.text },
  input: {
    width: '100%',
    paddingVertical: THEME.space.md,
    paddingHorizontal: THEME.space.lg,
    borderWidth: 1,
    borderColor: THEME.color.border,
    borderRadius: THEME.radius,
    backgroundColor: THEME.color.bg,
    fontFamily: THEME.font.family as string,
    fontSize: THEME.font.body,
    color: THEME.color.text,
  },
  cta: {
    width: '100%',
    paddingVertical: THEME.space.lg,
    borderRadius: THEME.radius,
    backgroundColor: THEME.color.cta,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: THEME.space.md,
    marginBottom: THEME.space.lg,
    ...(Platform.OS === 'web'
      ? {
          boxShadow: '0 12px 20px rgba(11,139,130,0.35)',
        }
      : {
          shadowColor: THEME.color.cta,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.27,
          shadowRadius: 8,
          elevation: 5,
        }),
  },
  ctaDisabled: { backgroundColor: THEME.color.ctaDisabled },
  ctaText: {
    fontFamily: THEME.font.family as string,
    color: THEME.color.ctaText,
    fontSize: THEME.font.cta,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: THEME.space.md,
  },
  footerText: {
    fontFamily: THEME.font.family as string,
    fontSize: THEME.font.body,
    color: THEME.color.subtext,
  },
  footerLink: {
    fontFamily: THEME.font.family as string,
    fontSize: THEME.font.body,
    color: THEME.color.link,
    fontWeight: '800',
  },
  debugBox: {
    marginTop: THEME.space.lg,
    padding: THEME.space.md,
    backgroundColor: THEME.color.debugBg,
    borderRadius: THEME.radius - 4,
    borderWidth: 1,
    borderColor: THEME.color.debugBorder,
  },
  debugTitle: {
    fontFamily: THEME.font.family as string,
    fontSize: THEME.font.label,
    fontWeight: '700',
    color: THEME.color.debugText,
    marginBottom: 4,
  },
  debugText: {
    fontFamily: THEME.font.family as string,
    fontSize: THEME.font.label,
    color: THEME.color.debugText,
  },
});
