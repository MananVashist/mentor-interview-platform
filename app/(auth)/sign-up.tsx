// app/(auth)/sign-up.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/lib/theme';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/lib/store';

// slide-down banner
function TopBanner({
  visible,
  message,
  type,
  onHide,
}: {
  visible: boolean;
  message: string;
  type: 'success' | 'error';
  onHide?: () => void;
}) {
  const slide = useRef(new Animated.Value(-80)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slide, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          Animated.timing(slide, {
            toValue: -80,
            duration: 180,
            useNativeDriver: true,
          }).start(() => {
            onHide && onHide();
          });
        }, 2500);
      });
    }
  }, [visible, slide, onHide]);

  if (!visible) return null;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        transform: [{ translateY: slide }],
      }}
    >
      <View
        style={{
          backgroundColor: type === 'success' ? '#10B981' : '#EF4444',
          paddingVertical: 12,
          paddingHorizontal: 18,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Ionicons
          name={type === 'success' ? 'checkmark-circle' : 'alert-circle'}
          size={20}
          color="#fff"
        />
        <Text style={{ color: '#fff', fontWeight: '600', flex: 1 }}>{message}</Text>
      </View>
    </Animated.View>
  );
}

export default function SignUpScreen() {
  const router = useRouter();
  const { setUser, setProfile } = useAuthStore();

  const [name, setName] = useState('');
  const [role, setRole] = useState<'candidate' | 'mentor' | 'admin'>('candidate');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [bannerVisible, setBannerVisible] = useState(false);
  const [bannerMsg, setBannerMsg] = useState('');
  const [bannerType, setBannerType] = useState<'success' | 'error'>('success');

  const showBanner = (msg: string, type: 'success' | 'error') => {
    setBannerMsg(msg);
    setBannerType(type);
    setBannerVisible(true);
  };

  const isFormValid =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    password.trim().length > 0 &&
    confirmPassword.trim().length > 0 &&
    password === confirmPassword &&
    password.length >= 6;

  const handleSignUp = async () => {
    if (!isFormValid) {
      if (password !== confirmPassword) {
        showBanner('Passwords do not match', 'error');
      } else if (password.length < 6) {
        showBanner('Password must be at least 6 characters', 'error');
      } else {
        showBanner('Please fill in all fields', 'error');
      }
      return;
    }

    setLoading(true);
    try {
      const { user, profile } = await authService.signUp(
        email.trim(),
        password.trim(),
        role,
        name.trim()
      );

      setUser(user);
      setProfile(profile);
      showBanner('Account created successfully!', 'success');

      if (role === 'candidate') {
        router.replace('/candidate');
      } else if (role === 'mentor') {
        router.replace('/mentor');
      } else {
        router.replace('/(admin)');
      }
    } catch (err: any) {
      showBanner(err?.message ?? 'Sign up failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  // quick prefills
  const fillQuick = (r: 'candidate' | 'mentor' | 'admin') => {
    setRole(r);
    if (r === 'candidate') {
      setName('Candidate User');
      setEmail('candidate2@gmail.com');
    } else if (r === 'mentor') {
      setName('Mentor User');
      setEmail('mentor@example.com');
    } else {
      setName('Admin User');
      setEmail('admin@example.com');
    }
    setPassword('password');
    setConfirmPassword('password');
  };

  return (
    <View style={{ flex: 1 }}>
      <TopBanner
        visible={bannerVisible}
        message={bannerMsg}
        type={bannerType}
        onHide={() => setBannerVisible(false)}
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join MentorInterviews</Text>
            </View>

            {/* social */}
            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-google" size={18} color="#DB4437" />
                <Text style={styles.socialText}>Continue with Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-linkedin" size={18} color="#0A66C2" />
                <Text style={styles.socialText}>Continue with LinkedIn</Text>
              </TouchableOpacity>
            </View>

            {/* role toggle */}
            <View style={styles.section}>
              <Text style={styles.label}>I AM A</Text>
              <View style={styles.roleToggle}>
                <TouchableOpacity
                    style={[
                      styles.roleButton,
                      role === 'candidate' ? styles.roleButtonActive : null,
                    ]}
                    onPress={() => setRole('candidate')}
                    disabled={loading}
                  >
                  <Text
                    style={[
                      styles.roleButtonText,
                      role === 'candidate' ? styles.roleButtonTextActive : null,
                    ]}
                  >
                    Candidate
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                      styles.roleButton,
                      role === 'mentor' ? styles.roleButtonActive : null,
                    ]}
                    onPress={() => setRole('mentor')}
                    disabled={loading}
                  >
                  <Text
                    style={[
                      styles.roleButtonText,
                      role === 'mentor' ? styles.roleButtonTextActive : null,
                    ]}
                  >
                    Mentor
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                      styles.roleButton,
                      role === 'admin' ? styles.roleButtonActive : null,
                    ]}
                    onPress={() => setRole('admin')}
                    disabled={loading}
                  >
                  <Text
                    style={[
                      styles.roleButtonText,
                      role === 'admin' ? styles.roleButtonTextActive : null,
                    ]}
                  >
                    Admin
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* name */}
            <View style={styles.section}>
              <Text style={styles.label}>FULL NAME</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="John Doe"
                placeholderTextColor={theme.colors.textTertiary}
                editable={!loading}
              />
            </View>

            {/* email */}
            <View style={styles.section}>
              <Text style={styles.label}>EMAIL</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor={theme.colors.textTertiary}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!loading}
              />
            </View>

            {/* password */}
            <View style={styles.section}>
              <Text style={styles.label}>PASSWORD</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Min. 6 characters"
                placeholderTextColor={theme.colors.textTertiary}
                secureTextEntry
                editable={!loading}
              />
            </View>

            {/* confirm */}
            <View style={styles.section}>
              <Text style={styles.label}>CONFIRM PASSWORD</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Re-enter password"
                placeholderTextColor={theme.colors.textTertiary}
                secureTextEntry
                editable={!loading}
              />
            </View>

            {/* submit */}
            <TouchableOpacity
              style={[
                styles.signUpButton,
                (!isFormValid || loading) ? styles.signUpButtonDisabled : null,
              ]}
              onPress={handleSignUp}
              disabled={!isFormValid || loading}
            >
              {loading ? (
                <ActivityIndicator color={theme.colors.background} />
              ) : (
                <Text style={styles.signUpButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            {/* quick presets */}
            <View style={styles.quickWrap}>
              <Text style={styles.quickTitle}>Quick presets</Text>
              <View style={styles.quickRow}>
                <TouchableOpacity style={styles.quickBtn} onPress={() => fillQuick('candidate')}>
                  <Text style={styles.quickBtnText}>Candidate</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quickBtn} onPress={() => fillQuick('mentor')}>
                  <Text style={styles.quickBtnText}>Mentor</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quickBtn} onPress={() => fillQuick('admin')}>
                  <Text style={styles.quickBtnText}>Admin</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <Link href="/(auth)/sign-in" asChild>
                <TouchableOpacity>
                  <Text style={styles.footerLink}>Sign In</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: 60,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  socialRow: {
    gap: 10,
    marginBottom: 10,
  },
  socialButton: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: theme.colors.surface,
  },
  socialText: {
    color: theme.colors.text,
    fontWeight: '500',
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    color: theme.colors.text,
  },
  roleToggle: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 4,
    backgroundColor: theme.colors.backgroundSecondary,
    gap: 6,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  roleButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  roleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  roleButtonTextActive: {
    color: theme.colors.background,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: theme.colors.text,
    backgroundColor: theme.colors.background,
  },
  signUpButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 999,
    alignItems: 'center',
    padding: 14,
    marginTop: 8,
  },
  signUpButtonDisabled: {
    backgroundColor: theme.colors.disabled,
  },
  signUpButtonText: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: '700',
  },
  quickWrap: {
    marginTop: 18,
  },
  quickTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: 6,
  },
  quickRow: {
    flexDirection: 'row',
    gap: 10,
  },
  quickBtn: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  quickBtnText: {
    fontWeight: '600',
    color: theme.colors.text,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  footerText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  footerLink: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});