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
  useWindowDimensions,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

import { authService } from '@/services/auth.service';
import { candidateService } from '@/services/candidate.service';
import { mentorService } from '@/services/mentor.service';
import { useAuthStore } from '@/lib/store';
import { BrandHeader } from '@/lib/ui';
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

  // --- OAUTH HANDLER ---
  const handleOAuthSignIn = async (provider: 'google' | 'linkedin_oidc') => {
    try {
      setLoading(true);
      const { error } = await authService.signInWithOAuth(provider);
      if (error) {
        showNotification(error.message, 'error');
      }
    } catch (err: any) {
      showNotification(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // --- EMAIL/PASSWORD HANDLER ---
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
                setLoading(false);
                router.replace('/mentor/under-review');
                return;
            }
            setUser(user);
            setSession(session);
            setProfile(profile as any);
            setMentorProfile(m ?? null);
            showNotification('Welcome back!', 'success');
            router.replace('/mentor/bookings');
            
        } else {
            const c = await candidateService.getCandidateById(user.id);
            setUser(user);
            setSession(session);
            setProfile(profile as any);
            setCandidateProfile(c ?? null);
            showNotification('Welcome back!', 'success');
            router.replace('/candidate');
        }
      } else {
        setUser(user);
        setSession(session);
        showNotification('Welcome!', 'success');
        router.replace('/candidate');
      }

    } catch (err: any) {
      showNotification(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        
        {/* Wrapper to Center Form vertically */}
        <View style={styles.formWrapper}>
          <View style={styles.content}>
            
            <BrandHeader />

            <View style={styles.spacer} />

            <View style={styles.section}>
              <Text style={styles.label}>EMAIL ADDRESS</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="name@work-email.com"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>PASSWORD</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <TouchableOpacity onPress={handleSignIn} disabled={loading} style={styles.signInButton}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.signInButtonText}>Sign In</Text>}
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialBtn} onPress={() => handleOAuthSignIn('google')}>
                <AntDesign name="google" size={24} color="#DB4437" />
                <Text style={styles.socialBtnText}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialBtn} onPress={() => handleOAuthSignIn('linkedin_oidc')}>
                <AntDesign name="linkedin-square" size={24} color="#0077B5" />
                <Text style={styles.socialBtnText}>LinkedIn</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.authFooter}>
              <Text style={styles.authFooterText}>Don't have an account? </Text>
              <Link href="/auth/sign-up" asChild>
                <TouchableOpacity>
                  <Text style={styles.authFooterLink}>Sign Up</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>

        {/* Sticky Footer at bottom, full width */}
        {isWeb && <Footer />}

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f5f0' }, // Matches global background
  
  // Key Fix: flexGrow: 1 makes the ScrollView fill the screen
  scrollContent: { flexGrow: 1, flexDirection: 'column' },
  
  // Form Wrapper pushes footer down if content is short
  formWrapper: {
    flex: 1, // Takes all available space
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60, // Add breathing room
    width: '100%',
  },
  
  content: { 
    padding: 24, 
    maxWidth: 400, 
    width: '100%',
    backgroundColor: 'transparent', // Ensure no white box artifact
  },
  
  spacer: { marginBottom: 24 },
  
  section: { marginBottom: 16 },
  
  label: { 
    fontSize: 12, 
    fontWeight: '600', 
    marginBottom: 6, 
    color: '#334155' 
  },
  
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10, padding: 12, backgroundColor: '#fff' },
  signInButton: { backgroundColor: '#0E9384', borderRadius: 999, alignItems: 'center', padding: 14, marginTop: 8 },
  signInButtonText: { color: '#fff', fontWeight: '700' },

  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E2E8F0' },
  dividerText: { marginHorizontal: 12, color: '#94A3B8', fontSize: 12, fontWeight: '500' },
  socialRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  socialBtn: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 12, 
    borderRadius: 10, 
    borderWidth: 1, 
    borderColor: '#E2E8F0', 
    gap: 8,
    backgroundColor: '#fff' 
  },
  socialBtnText: { fontWeight: '600', color: '#334155' },

  // Internal footer for "Sign Up" link
  authFooter: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  authFooterText: { color: '#6b7280' },
  authFooterLink: { color: '#0E9384', fontWeight: '700' },
});