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
  StyleSheet
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { authService } from '@/services/auth.service';
import { candidateService } from '@/services/candidate.service';
import { mentorService } from '@/services/mentor.service';
import { useAuthStore } from '@/lib/store';

export default function SignInScreen() {
  const router = useRouter();
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

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      // 1. Authenticate
      const { user, session, error } = await authService.signIn(email, password);
      
      if (error || !user || !session) {
        Alert.alert('Login Failed', error?.message || 'Invalid credentials');
        setLoading(false);
        return;
      }

      // ⚠️ IMPORTANT: Do NOT call setUser/setSession here yet.
      // Calling them triggers the global router to redirect immediately,
      // creating a race condition that bypasses the checks below.

      // 2. Fetch Profile to determine Role
      let profile = await authService.getUserProfileById(user.id);
      
      if (profile) {
        const roleLower = (profile.role || '').toLowerCase().trim();
        
        // ---------------------------------------------------------
        // A. ADMIN FLOW
        // ---------------------------------------------------------
        if (roleLower === 'admin' || profile.is_admin) { 
             setUser(user);
             setSession(session);
             setProfile(profile as any);
             router.replace('/admin'); 
             return;
        }

        // ---------------------------------------------------------
        // B. MENTOR FLOW (With Strict Status Check)
        // ---------------------------------------------------------
        if (roleLower === 'mentor') {
            console.log('🔵 [Sign-In] Mentor role detected. Fetching mentor record...');
            
            const m = await mentorService.getMentorById(user.id);
            
            // Debug logging
            console.log('🔵 [Sign-In] Mentor data:', {
                id: m?.id,
                status: m?.status,
                profile_id: m?.profile_id
            });

            // ⛔ BLOCKING CHECK
            // If no record, or status is NOT 'approved', we block access.
            if (!m || !m.status || m.status !== 'approved') {
                const reason = !m ? 'No mentor record found' : 
                              !m.status ? 'Status field missing' : 
                              `Status is '${m.status}' (not approved)`;
                
                console.warn('⛔ [Sign-In] MENTOR BLOCKED:', reason);
                
                Alert.alert(
                    'Account Under Review',
                    'Your mentor application is still being reviewed. You will be notified once approved.',
                    [{ text: 'OK' }]
                );

                // Force sign out immediately at Supabase level
                await authService.signOut();
                setLoading(false);
                
                // Redirect to the "Under Review" or "Welcome" page
                router.replace('/mentor/under-review');
                return;
            }

            // ✅ APPROVED: Now safe to update Global State
            setUser(user);
            setSession(session);
            setProfile(profile as any);
            setMentorProfile(m ?? null);

            console.log('✅ [Sign-In] Mentor approved. Redirecting to dashboard...');
            router.replace('/mentor/bookings');
            
        } else {
            // ---------------------------------------------------------
            // C. CANDIDATE FLOW
            // ---------------------------------------------------------
            console.log('🔵 [Sign-In] Candidate role detected');
            const c = await candidateService.getCandidateById(user.id);
            
            // ✅ Update Global State
            setUser(user);
            setSession(session);
            setProfile(profile as any);
            setCandidateProfile(c ?? null);

            router.replace('/candidate');
        }

      } else {
        // ---------------------------------------------------------
        // D. FALLBACK (No Profile Found)
        // ---------------------------------------------------------
        console.warn('⚠️ [Sign-In] No profile found, defaulting to candidate');
        
        setUser(user);
        setSession(session);
        
        router.replace('/candidate');
      }

    } catch (err: any) {
      console.error('❌ [Sign-In] Error:', err);
      Alert.alert('Error', err.message);
    } finally {
      // Only turn off loading if we haven't redirected (or if we blocked the user)
      // Note: If we redirect, the component unmounts anyway.
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Welcome back 👋</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>EMAIL ADDRESS</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>PASSWORD</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity onPress={handleSignIn} disabled={loading} style={styles.signInButton}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.signInButtonText}>Sign In</Text>}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Link href="/auth/sign-up" asChild>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { flexGrow: 1, justifyContent: 'center' },
  content: { padding: 24, maxWidth: 400, alignSelf: 'center', width: '100%' },
  header: { marginBottom: 32, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#0f172a' },
  subtitle: { color: '#6b7280', marginTop: 4 },
  section: { marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '600', marginBottom: 6, color: '#334155' },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10, padding: 12, backgroundColor: '#fff' },
  signInButton: { backgroundColor: '#0E9384', borderRadius: 999, alignItems: 'center', padding: 14, marginTop: 8 },
  signInButtonText: { color: '#fff', fontWeight: '700' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  footerText: { color: '#6b7280' },
  footerLink: { color: '#0E9384', fontWeight: '700' },
});