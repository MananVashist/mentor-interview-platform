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
import { Ionicons, AntDesign } from '@expo/vector-icons'; 
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/lib/store';
import { supabase } from '@/lib/supabase/client';
import { BrandHeader } from '@/lib/ui';

// Slide-down banner component
function TopBanner({ visible, message, type, onHide }: any) {
  const slide = useRef(new Animated.Value(-80)).current;
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (visible) {
      Animated.timing(slide, { toValue: 0, duration: 220, useNativeDriver: true }).start(() => {
        timer = setTimeout(() => {
          Animated.timing(slide, { toValue: -80, duration: 180, useNativeDriver: true }).start(() => {
            onHide && onHide();
          });
        }, 3500);
      });
    }
    return () => clearTimeout(timer);
  }, [visible, slide, onHide]);

  if (!visible) return null;
  return (
    <Animated.View style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 200, transform: [{ translateY: slide }] }}>
      <View style={{ backgroundColor: type === 'success' ? '#10B981' : '#EF4444', paddingVertical: 16, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: Platform.OS === 'ios' ? 50 : 16 }}>
        <Ionicons name={type === 'success' ? 'checkmark-circle' : 'alert-circle'} size={24} color="#fff" />
        <Text style={{ color: '#fff', fontWeight: '600', flex: 1, fontSize: 14 }}>{message}</Text>
      </View>
    </Animated.View>
  );
}

export default function SignUpScreen() {
  const router = useRouter();
  const { setUser, setProfile } = useAuthStore();

  const [name, setName] = useState('');
  const [role, setRole] = useState<'candidate' | 'mentor'>('candidate');
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

  const isFormValid = name.trim().length > 0 && email.trim().length > 0 && password.trim().length > 0 && confirmPassword.trim().length > 0 && password === confirmPassword && password.length >= 6;

  const handleOAuthSignUp = async (provider: 'google' | 'linkedin') => {
    try {
      setLoading(true);
      const { error } = await authService.signInWithOAuth(provider);
      if (error) showBanner(error.message, 'error');
    } catch (err: any) {
      showBanner(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!isFormValid) {
      if (password !== confirmPassword) showBanner('Passwords do not match', 'error');
      else if (password.length < 6) showBanner('Password must be at least 6 characters', 'error');
      else showBanner('Please fill in all fields', 'error');
      return;
    }

    setLoading(true);
    try {
      const { user, error: authError } = await authService.signUp(email.trim(), password.trim(), name.trim(), role);
      if (authError) throw new Error(authError.message); 
      if (!user) throw new Error("Signup failed. No user returned.");

      const { error: profileError } = await supabase.from('profiles').insert({
          id: user.id, email: email.trim(), full_name: name.trim(), role: role, is_admin: false
      });
      if (profileError) throw new Error(`Failed to create profile: ${profileError.message}`);

      if (role === 'mentor') {
        const { error: mentorError } = await supabase.from('mentors').insert({
            profile_id: user.id, status: 'pending', professional_title: 'Mentor', expertise_profiles: ['General'], session_price_inr: 2000, total_sessions: 0, years_of_experience: 0, experience_description: '', is_hr_mentor: false, 
        });
        if (mentorError) {
          await supabase.from('profiles').delete().eq('id', user.id);
          await supabase.auth.signOut(); 
          throw new Error(`Failed to create mentor profile: ${mentorError.message}`);
        }
      } else if (role === 'candidate') {
        const { error: candidateError } = await supabase.from('candidates').insert({ profile_id: user.id });
        if (candidateError) {
          await supabase.from('profiles').delete().eq('id', user.id);
          await supabase.auth.signOut();
          throw new Error(`Failed to create candidate profile: ${candidateError.message}`);
        }
      }

      setUser(user);
      setProfile({ id: user.id, email: email.trim(), full_name: name.trim(), role: role, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), phone: null, is_admin: false });
      showBanner('Account created successfully!', 'success');

      setTimeout(() => {
        if (role === 'candidate') router.replace('/candidate');
        else if (role === 'mentor') router.replace('/mentor/under-review');
        else router.replace('/auth/sign-in');
      }, 500);

    } catch (err: any) {
      showBanner(err?.message ?? 'Sign up failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <TopBanner visible={bannerVisible} message={bannerMsg} type={bannerType} onHide={() => setBannerVisible(false)} />
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            
            <BrandHeader />

            <View style={styles.spacer} />

            <View style={styles.section}>
              {/* 🟢 REVERTED: Dark Gray Label */}
              <Text style={styles.label}>I AM A</Text>
              <View style={styles.roleToggle}>
                <TouchableOpacity style={[styles.roleButton, role === 'candidate' ? styles.roleButtonActive : null]} onPress={() => setRole('candidate')} disabled={loading}>
                  <Text style={[styles.roleButtonText, role === 'candidate' ? styles.roleButtonTextActive : null]}>Candidate</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.roleButton, role === 'mentor' ? styles.roleButtonActive : null]} onPress={() => setRole('mentor')} disabled={loading}>
                  <Text style={[styles.roleButtonText, role === 'mentor' ? styles.roleButtonTextActive : null]}>Mentor</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.roleDescription}>
                {role === 'mentor' ? "You take interviews of potential candidates" : "You give interviews to real professionals"}
              </Text>
            </View>

            <View style={styles.section}>
              {/* 🟢 REVERTED: Dark Gray Label */}
              <Text style={styles.label}>FULL NAME</Text>
              <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="John Doe" placeholderTextColor="#9CA3AF" editable={!loading} />
            </View>

            <View style={styles.section}>
              {/* 🟢 REVERTED: Dark Gray Label */}
              <Text style={styles.label}>EMAIL</Text>
              <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="you@example.com" placeholderTextColor="#9CA3AF" autoCapitalize="none" keyboardType="email-address" editable={!loading} />
            </View>

            <View style={styles.section}>
              {/* 🟢 REVERTED: Dark Gray Label */}
              <Text style={styles.label}>PASSWORD</Text>
              <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Min. 6 characters" placeholderTextColor="#9CA3AF" secureTextEntry editable={!loading} />
            </View>

            <View style={styles.section}>
              {/* 🟢 REVERTED: Dark Gray Label */}
              <Text style={styles.label}>CONFIRM PASSWORD</Text>
              <TextInput style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Re-enter password" placeholderTextColor="#9CA3AF" secureTextEntry editable={!loading} />
            </View>

            <TouchableOpacity style={[styles.signUpButton, (!isFormValid || loading) ? styles.signUpButtonDisabled : null]} onPress={handleSignUp} disabled={!isFormValid || loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.signUpButtonText}>Create Account</Text>}
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialBtn} onPress={() => handleOAuthSignUp('google')}>
                <AntDesign name="google" size={24} color="#DB4437" />
                <Text style={styles.socialBtnText}>Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialBtn} onPress={() => handleOAuthSignUp('linkedin')}>
                <AntDesign name="linkedin-square" size={24} color="#0077B5" />
                <Text style={styles.socialBtnText}>LinkedIn</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <Link href="/auth/sign-in" asChild>
                <TouchableOpacity><Text style={styles.footerLink}>Sign In</Text></TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 60 },
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  content: { flex: 1, justifyContent: 'center', padding: 24 },
  
  spacer: { marginBottom: 24 }, 

  section: { marginBottom: 16 },
  
  // 🟢 REVERTED STYLE: Dark Gray Labels
  label: { 
    fontSize: 12, 
    fontWeight: '600', 
    marginBottom: 6, 
    color: '#334155' // Dark Gray
  },

  roleToggle: { flexDirection: 'row', borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB', padding: 4, backgroundColor: '#F9FAFB', gap: 6 },
  roleDescription: { marginTop: 8, fontSize: 12, color: '#6B7280', fontStyle: 'italic' },
  roleButton: { flex: 1, paddingVertical: 8, borderRadius: 6, alignItems: 'center' },
  roleButtonActive: { backgroundColor: '#0E9384' },
  roleButtonText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  roleButtonTextActive: { color: '#fff' },
  input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 12, fontSize: 16, color: '#1F2937', backgroundColor: '#fff' },
  signUpButton: { backgroundColor: '#0E9384', borderRadius: 999, alignItems: 'center', padding: 14, marginTop: 8 },
  signUpButtonDisabled: { backgroundColor: '#9CA3AF' },
  signUpButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E2E8F0' },
  dividerText: { marginHorizontal: 12, color: '#94A3B8', fontSize: 12, fontWeight: '500' },
  socialRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  socialBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', gap: 8, backgroundColor: '#fff' },
  socialBtnText: { fontWeight: '600', color: '#334155' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  footerText: { color: '#6B7280', fontSize: 14 },
  footerLink: { color: '#0E9384', fontSize: 14, fontWeight: '700' },
});