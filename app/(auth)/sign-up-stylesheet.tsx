import { useState } from 'react';
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

const THEME = {
  color: {
    bg: '#FFFFFF',
    text: '#0F172A',
    subtext: '#64748B',
    label: '#334155',
    border: '#E2E8F0',
    inputBg: '#F8FAFC',
    placeholder: '#94A3B8',
    cta: '#0B8B82',          // ✅ same CTA green
    ctaText: '#FFFFFF',
    ctaDisabled: '#86E3DD',
    roleActiveBorder: '#0B8B82',
    roleActiveBg: '#E6FFFB',
    link: '#0B8B82',
  },
  radius: 14,
  space: { xs: 8, sm: 12, md: 16, lg: 24, xl: 32, xxl: 48 },
  font: {
    family: Platform.select({
      web: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
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

export default function SignUpScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('candidate');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const { error } = await authService.signUp(email, password, fullName, role);
    setLoading(false);

    if (error) {
      Alert.alert('Sign Up Failed', error.message || 'Could not create account');
      return;
    }

    Alert.alert('Success', 'Account created! Check your email to verify.', [
      { text: 'OK' },
    ]);
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
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to get started</Text>
          </View>

          {/* Role */}
          <View style={styles.section}>
            <Text style={styles.label}>SELECT YOUR ROLE</Text>
            <View style={styles.roleRow}>
              {(['candidate', 'mentor'] as UserRole[]).map((r) => {
                const active = role === r;
                return (
                  <TouchableOpacity
                    key={r}
                    onPress={() => setRole(r)}
                    activeOpacity={0.9}
                    style={[
                      styles.roleButton,
                      active && styles.roleButtonActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.roleText,
                        active && styles.roleTextActive,
                      ]}
                    >
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Full name */}
          <View style={styles.section}>
            <Text style={styles.label}>FULL NAME</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor={THEME.color.placeholder}
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
              editable={!loading}
            />
          </View>

          {/* Email */}
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
              autoComplete="email"
              editable={!loading}
            />
          </View>

          {/* Passwords */}
          <View style={styles.section}>
            <Text style={styles.label}>PASSWORD</Text>
            <TextInput
              style={styles.input}
              placeholder="Create a password (min 6 characters)"
              placeholderTextColor={THEME.color.placeholder}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>CONFIRM PASSWORD</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm your password"
              placeholderTextColor={THEME.color.placeholder}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          {/* CTA */}
          <TouchableOpacity
            onPress={handleSignUp}
            disabled={loading}
            activeOpacity={0.9}
            style={[styles.cta, loading && styles.ctaDisabled]}
          >
            {loading ? (
              <ActivityIndicator color={THEME.color.ctaText} />
            ) : (
              <Text style={styles.ctaText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Link href="/(auth)/sign-in" asChild>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>

          <Text style={styles.terms}>
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </Text>
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
  roleTextActive: { color: THEME.color.roleActiveBorder },
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
    marginTop: THEME.space.sm,
    marginBottom: THEME.space.lg,
    shadowColor: THEME.color.cta,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.27,
    shadowRadius: 8,
    elevation: 5,
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
  terms: {
    fontFamily: THEME.font.family as string,
    fontSize: THEME.font.label,
    color: THEME.color.subtext,
    textAlign: 'center',
  },
});
