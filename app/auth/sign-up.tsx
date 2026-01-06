import React, { useEffect, useState } from 'react';
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
  Modal,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import Head from 'expo-router/head';
import { Ionicons } from '@expo/vector-icons';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/lib/store';
import { supabase } from '@/lib/supabase/client';
import { BrandHeader } from '@/lib/ui';
import { useNotification } from '@/lib/ui/NotificationBanner';
import { Footer } from '@/components/Footer';

// --- Types ---
type InterviewProfile = { id: number; name: string };

export default function SignUpScreen() {
  const router = useRouter();
  const { setUser, setProfile } = useAuthStore();
  const { showNotification } = useNotification();
  const isWeb = Platform.OS === 'web';

  // --- State ---
  const [role, setRole] = useState<'candidate' | 'mentor'>('candidate');
  const [loading, setLoading] = useState(false);

  // Common Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Conditional Fields
  const [phone, setPhone] = useState(''); 

  // Candidate Specific
  const [candidateTitle, setCandidateTitle] = useState('');

  // Mentor Specific
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [professionalTitle, setProfessionalTitle] = useState('');
  const [yearsOfExp, setYearsOfExp] = useState('');

  // Mentor Profile Selection
  const [availableProfiles, setAvailableProfiles] = useState<InterviewProfile[]>([]);
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
  const [profilesModalVisible, setProfilesModalVisible] = useState(false);

  // --- Fetch Admin Profiles for Mentors ---
  useEffect(() => {
    if (role === 'mentor') {
      (async () => {
        const { data } = await supabase.from('interview_profiles_admin').select('id, name').eq('is_active', true);
        if (data) setAvailableProfiles(data);
      })();
    }
  }, [role]);

  // --- Validation Function ---
  const validateForm = (): string | null => {
    // Common validations
    if (!name.trim()) {
      return 'Please enter your full name';
    }

    if (!email.trim()) {
      return 'Please enter your email address';
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return 'Please enter a valid email address';
    }

    if (!password) {
      return 'Please enter a password';
    }

    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }

    if (!confirmPassword) {
      return 'Please confirm your password';
    }

    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }

    // Role-specific validations
    if (role === 'candidate') {
      if (!candidateTitle.trim()) {
        return 'Please enter your professional title';
      }
    }

    if (role === 'mentor') {
      if (!phone.trim()) {
        return 'Please enter your phone number';
      }

      if (phone.trim().length < 10) {
        return 'Please enter a valid phone number (minimum 10 digits)';
      }

      if (!linkedinUrl.trim()) {
        return 'Please enter your LinkedIn profile URL';
      }

      if (!linkedinUrl.trim().includes('linkedin.com')) {
        return 'Please enter a valid LinkedIn URL (must contain linkedin.com)';
      }

      if (!professionalTitle.trim()) {
        return 'Please enter your professional title';
      }

      if (!yearsOfExp.trim()) {
        return 'Please enter your years of experience';
      }

      const yearsNum = parseInt(yearsOfExp);
      if (isNaN(yearsNum) || yearsNum < 0) {
        return 'Please enter a valid number for years of experience';
      }

      if (selectedProfiles.length === 0) {
        return 'Please select at least one interview profile';
      }
    }

    return null; // No errors
  };

  // --- Handlers ---
  const toggleProfileSelection = (profileName: string) => {
    if (selectedProfiles.includes(profileName)) {
      setSelectedProfiles((prev) => prev.filter((p) => p !== profileName));
    } else {
      setSelectedProfiles((prev) => [...prev, profileName]);
    }
  };

  const handleSignUp = async () => {
    // Validate form
    const validationError = validateForm();
    if (validationError) {
      showNotification(validationError, 'error');
      return;
    }

    setLoading(true);
    try {
      // 1. Create Auth User
      const phoneToSend = role === 'mentor' ? phone.trim() : '';

      const { user, error: authError } = await authService.signUp(
        email.trim(),
        password.trim(),
        name.trim(),
        role,
        phoneToSend
      );
      
      if (authError) throw new Error(authError.message);
      if (!user) throw new Error('Signup failed. No user returned.');

      // 2. Create Role Specific Entry
      if (role === 'mentor') {
        const profileIds = availableProfiles
          .filter((p) => selectedProfiles.includes(p.name))
          .map((p) => p.id);

        const { error: mentorError } = await supabase.from('mentors').insert({
          id: user.id,
          status: 'pending',
          professional_title: professionalTitle.trim(),
          linkedin_url: linkedinUrl.trim(),
          years_of_experience: parseInt(yearsOfExp) || 0,
          expertise_profiles: selectedProfiles, 
          profile_ids: profileIds,              
          session_price_inr: 1500,
          total_sessions: 0,
        });
        
        if (mentorError) throw new Error(`Mentor profile failed: ${mentorError.message}`);
      } else {
        const { error: candidateError } = await supabase.from('candidates').insert({
          id: user.id,
          professional_title: candidateTitle.trim(),
        });
        if (candidateError) throw new Error(`Candidate profile failed: ${candidateError.message}`);
      }

      // 3. Success State
      setUser(user);
      setProfile({
        id: user.id,
        email: email.trim(),
        full_name: name.trim(),
        role,
        phone: role === 'mentor' ? phone.trim() : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_admin: false,
      });
      showNotification('Account created successfully!', 'success');

      setTimeout(() => {
        if (role === 'candidate') router.replace('/candidate');
        else router.replace('/mentor/under-review');
      }, 1000);
    } catch (err: any) {
      if (err.message?.includes('already registered')) {
        showNotification('This email is already registered. Please login.', 'error');
      } else {
        showNotification(err?.message ?? 'Sign up failed.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Head>
        <title>Sign Up | CrackJobs</title>
        <meta name="description" content="Create a CrackJobs account to start practicing mock interviews or become a mentor." />
      </Head>

      <KeyboardAvoidingView style={styles.flex1} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Form Wrapper */}
          <View style={styles.formWrapper}>
            <View style={styles.content}>
              <BrandHeader />

              <View style={styles.spacer} />

              {/* --- ROLE TOGGLE --- */}
              <View style={styles.section}>
                <Text style={styles.label}>I AM A</Text>
                <View style={styles.roleToggle}>
                  <TouchableOpacity
                    style={[styles.roleButton, role === 'candidate' && styles.roleButtonActive]}
                    onPress={() => setRole('candidate')}
                  >
                    <Text style={[styles.roleButtonText, role === 'candidate' && styles.roleButtonTextActive]}>
                      Candidate
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.roleButton, role === 'mentor' && styles.roleButtonActive]}
                    onPress={() => setRole('mentor')}
                  >
                    <Text style={[styles.roleButtonText, role === 'mentor' && styles.roleButtonTextActive]}>
                      Mentor
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* --- PRIVACY NOTE --- */}
              <View style={styles.privacyNoteContainer}>
                <Text style={styles.privacyNoteText}>
                  All personal details except professional title will be kept private
                </Text>
              </View>

              {/* --- COMMON FIELDS --- */}
              <View style={styles.section}>
                <Text style={styles.label}>FULL NAME <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="John Doe"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.section}>
                <Text style={styles.label}>EMAIL ADDRESS <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholder="name@email.com"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.section}>
                <Text style={styles.label}>PASSWORD <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                />
                <Text style={styles.hintText}>Minimum 6 characters</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.label}>CONFIRM PASSWORD <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              {/* --- CANDIDATE FIELDS --- */}
              {role === 'candidate' && (
                <View style={styles.section}>
                  <Text style={styles.label}>PROFESSIONAL TITLE <Text style={styles.required}>*</Text></Text>
                  <TextInput
                    style={styles.input}
                    value={candidateTitle}
                    onChangeText={setCandidateTitle}
                    placeholder="e.g., Product Manager at Microsoft"
                    placeholderTextColor="#9CA3AF"
                  />
                  <Text style={styles.hintText}>This will be visible to mentors</Text>
                </View>
              )}

              {/* --- MENTOR FIELDS --- */}
              {role === 'mentor' && (
                <>
                  <View style={styles.section}>
                    <Text style={styles.label}>PHONE NUMBER <Text style={styles.required}>*</Text></Text>
                    <TextInput
                      style={styles.input}
                      value={phone}
                      onChangeText={setPhone}
                      keyboardType="phone-pad"
                      placeholder="9876543210"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>

                  <View style={styles.section}>
                    <Text style={styles.label}>PROFESSIONAL TITLE <Text style={styles.required}>*</Text></Text>
                    <TextInput
                      style={styles.input}
                      value={professionalTitle}
                      onChangeText={setProfessionalTitle}
                      placeholder="e.g., Senior Product Manager at Google"
                      placeholderTextColor="#9CA3AF"
                    />
                    <Text style={styles.hintText}>This will be visible to candidates</Text>
                  </View>

                  <View style={styles.section}>
                    <Text style={styles.label}>LINKEDIN URL <Text style={styles.required}>*</Text></Text>
                    <TextInput
                      style={styles.input}
                      value={linkedinUrl}
                      onChangeText={setLinkedinUrl}
                      autoCapitalize="none"
                      placeholder="https://linkedin.com/in/yourprofile"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>

                  <View style={styles.section}>
                    <Text style={styles.label}>YEARS OF EXPERIENCE <Text style={styles.required}>*</Text></Text>
                    <TextInput
                      style={styles.input}
                      value={yearsOfExp}
                      onChangeText={setYearsOfExp}
                      keyboardType="numeric"
                      placeholder="5"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>

                  <View style={styles.section}>
                    <Text style={styles.label}>INTERVIEW PROFILES <Text style={styles.required}>*</Text></Text>
                    <TouchableOpacity style={styles.dropdownButton} onPress={() => setProfilesModalVisible(true)}>
                      <Text style={styles.dropdownText}>
                        {selectedProfiles.length > 0 
                          ? `${selectedProfiles.length} selected` 
                          : 'Select profiles'}
                      </Text>
                      <Ionicons name="chevron-down" size={20} color="#6B7280" />
                    </TouchableOpacity>
                    {selectedProfiles.length > 0 && (
                      <View style={styles.selectedProfilesContainer}>
                        {selectedProfiles.map((profile) => (
                          <View key={profile} style={styles.selectedProfileChip}>
                            <Text style={styles.selectedProfileText}>{profile}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                </>
              )}

              {/* --- SIGN UP BUTTON (Always Active) --- */}
              <TouchableOpacity
                style={styles.signUpButton}
                onPress={handleSignUp}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.signUpButtonText}>Sign Up</Text>
                )}
              </TouchableOpacity>

              {/* --- FOOTER LINK TO SIGN IN --- */}
              <View style={styles.authFooter}>
                <Text style={styles.authFooterText}>Already have an account? </Text>
                <Link href="/auth/sign-in" asChild>
                  <TouchableOpacity>
                    <Text style={styles.authFooterLink}>Sign In</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </View>
          
          {isWeb && <Footer />}

        </ScrollView>
      </KeyboardAvoidingView>

      {/* --- PROFILES SELECTION MODAL --- */}
      <Modal visible={profilesModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Interview Profiles</Text>
              <TouchableOpacity onPress={() => setProfilesModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 400 }}>
              {availableProfiles.map((p) => {
                const isSelected = selectedProfiles.includes(p.name);
                return (
                  <TouchableOpacity
                    key={p.id}
                    style={[styles.modalOption, isSelected && styles.modalOptionSelected]}
                    onPress={() => toggleProfileSelection(p.name)}
                  >
                    <Text style={[styles.modalOptionText, isSelected && styles.modalOptionTextSelected]}>
                      {p.name}
                    </Text>
                    {isSelected && <Ionicons name="checkmark-circle" size={20} color="#0E9384" />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <TouchableOpacity style={styles.modalDoneBtn} onPress={() => setProfilesModalVisible(false)}>
              <Text style={styles.modalDoneText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f5f0' },
  flex1: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    flexDirection: 'column',
  },
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
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    color: '#334155',
  },
  required: { color: '#EF4444' },
  hintText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#111827',
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  dropdownText: {
    fontSize: 16,
    color: '#111827',
  },
  selectedProfilesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  selectedProfileChip: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  selectedProfileText: {
    fontSize: 12,
    color: '#065F46',
    fontWeight: '600',
  },
  roleToggle: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 4,
    backgroundColor: '#E5E7EB',
  },
  roleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  roleButtonActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  roleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  roleButtonTextActive: {
    color: '#0E9384',
  },
  signUpButton: {
    backgroundColor: '#0E9384',
    borderRadius: 999,
    alignItems: 'center',
    padding: 14,
    marginTop: 8,
  },
  signUpButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  authFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  authFooterText: { color: '#6b7280' },
  authFooterLink: {
    color: '#0E9384',
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalOptionSelected: {
    backgroundColor: '#F0FDFA',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#374151',
  },
  modalOptionTextSelected: {
    color: '#0E9384',
    fontWeight: '600',
  },
  modalDoneBtn: {
    marginTop: 16,
    backgroundColor: '#0E9384',
    padding: 14,
    borderRadius: 999,
    alignItems: 'center',
  },    
  privacyNoteContainer: {
    backgroundColor: '#F0FDF9',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 0,
    marginBottom: 16,
  },
  privacyNoteText: {
    fontSize: 12,
    color: '#065F46',
    fontWeight: '500',
    textAlign: 'center',
  },
  modalDoneText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});