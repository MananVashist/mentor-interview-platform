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
  Modal,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/lib/store';
import { supabase } from '@/lib/supabase/client';
import { BrandHeader } from '@/lib/ui';

// --- Types ---
type InterviewProfile = { id: number; name: string };

// --- Top Banner Component ---
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
    <Animated.View
      style={[
        styles.banner,
        { backgroundColor: type === 'success' ? '#10B981' : '#EF4444', transform: [{ translateY: slide }] },
      ]}
    >
      <Ionicons name={type === 'success' ? 'checkmark-circle' : 'alert-circle'} size={24} color="#fff" />
      <Text style={styles.bannerText}>{message}</Text>
    </Animated.View>
  );
}

export default function SignUpScreen() {
  const router = useRouter();
  const { setUser, setProfile } = useAuthStore();

  // --- State ---
  const [role, setRole] = useState<'candidate' | 'mentor'>('candidate');
  const [loading, setLoading] = useState(false);

  // Common Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Candidate Specific
  const [candidateTitle, setCandidateTitle] = useState('');

  // Mentor Specific
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [professionalTitle, setProfessionalTitle] = useState('');
  const [yearsOfExp, setYearsOfExp] = useState('');
  const [description, setDescription] = useState('');

  // Mentor Profile Selection
  const [availableProfiles, setAvailableProfiles] = useState<InterviewProfile[]>([]);
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
  const [profilesModalVisible, setProfilesModalVisible] = useState(false);

  // Banner State
  const [bannerVisible, setBannerVisible] = useState(false);
  const [bannerMsg, setBannerMsg] = useState('');
  const [bannerType, setBannerType] = useState<'success' | 'error'>('success');

  // --- Fetch Admin Profiles for Mentors ---
  useEffect(() => {
    if (role === 'mentor') {
      (async () => {
        const { data } = await supabase.from('interview_profiles_admin').select('id, name').eq('is_active', true);
        if (data) setAvailableProfiles(data);
      })();
    }
  }, [role]);

  const showBanner = (msg: string, type: 'success' | 'error') => {
    setBannerMsg(msg);
    setBannerType(type);
    setBannerVisible(true);
  };

  // --- Validation ---
  const isCommonValid =
    name.trim().length > 0 && email.trim().length > 0 && password.length >= 6 && password === confirmPassword;

  const isCandidateValid = isCommonValid && candidateTitle.trim().length > 0;

  const isMentorValid =
    isCommonValid &&
    linkedinUrl.trim().includes('linkedin.com') &&
    professionalTitle.trim().length > 0 &&
    yearsOfExp.trim().length > 0 &&
    description.trim().length > 0 &&
    selectedProfiles.length > 0;

  const isFormValid = role === 'candidate' ? isCandidateValid : isMentorValid;

  // --- Handlers ---
  const toggleProfileSelection = (profileName: string) => {
    if (selectedProfiles.includes(profileName)) {
      setSelectedProfiles((prev) => prev.filter((p) => p !== profileName));
    } else {
      setSelectedProfiles((prev) => [...prev, profileName]);
    }
  };

  const handleSignUp = async () => {
    if (!isFormValid) {
      showBanner('Please fill in all required fields correctly.', 'error');
      return;
    }

    setLoading(true);
    try {
      // 1. Create Auth User
      const { user, error: authError } = await authService.signUp(
        email.trim(),
        password.trim(),
        name.trim(),
        role
      );
      if (authError) throw new Error(authError.message);
      if (!user) throw new Error('Signup failed. No user returned.');

      // 2. Create Base Profile
      const { error: profileError } = await supabase.from('profiles').insert({
        id: user.id,
        email: email.trim(),
        full_name: name.trim(),
        role: role,
        is_admin: false,
      });
      if (profileError) throw new Error(`Profile creation failed: ${profileError.message}`);

      // 3. Create Role Specific Entry
      if (role === 'mentor') {
        const { error: mentorError } = await supabase.from('mentors').insert({
          profile_id: user.id,
          status: 'pending',
          professional_title: professionalTitle.trim(),
          linkedin_url: linkedinUrl.trim(),
          years_of_experience: parseInt(yearsOfExp) || 0,
          experience_description: description.trim(),
          expertise_profiles: selectedProfiles,
          session_price_inr: 2000, // Default
          total_sessions: 0,
          is_hr_mentor: false,
        });
        if (mentorError) throw new Error(`Mentor profile failed: ${mentorError.message}`);
      } else {
        const { error: candidateError } = await supabase.from('candidates').insert({
          profile_id: user.id,
          professional_title: candidateTitle.trim(),
        });
        if (candidateError) throw new Error(`Candidate profile failed: ${candidateError.message}`);
      }

      // 4. Success State
      setUser(user);
      setProfile({
        id: user.id,
        email: email.trim(),
        full_name: name.trim(),
        role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        phone: null,
        is_admin: false,
      });
      showBanner('Account created successfully!', 'success');

      setTimeout(() => {
        if (role === 'candidate') router.replace('/candidate');
        else router.replace('/mentor/under-review');
      }, 1000);
    } catch (err: any) {
      showBanner(err?.message ?? 'Sign up failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TopBanner visible={bannerVisible} message={bannerMsg} type={bannerType} onHide={() => setBannerVisible(false)} />

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

              {/* --- COMMON FIELDS --- */}
              <View style={styles.section}>
                <Text style={styles.label}>FULL NAME</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="John Doe"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

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

              <View style={styles.section}>
                <Text style={styles.label}>CONFIRM PASSWORD</Text>
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              {/* --- CANDIDATE SPECIFIC FIELDS --- */}
              {role === 'candidate' && (
                <View style={styles.section}>
                  <Text style={styles.label}>CURRENT ROLE / TITLE</Text>
                  <TextInput
                    style={styles.input}
                    value={candidateTitle}
                    onChangeText={setCandidateTitle}
                    placeholder="e.g., Software Engineer, Product Manager"
                    placeholderTextColor="#9CA3AF"
                  />
                  <Text style={styles.hintText}>What role are you currently in or seeking?</Text>
                </View>
              )}

              {/* --- MENTOR SPECIFIC FIELDS --- */}
              {role === 'mentor' && (
                <>
                  <View style={styles.section}>
                    <Text style={styles.label}>PROFESSIONAL TITLE</Text>
                    <TextInput
                      style={styles.input}
                      value={professionalTitle}
                      onChangeText={setProfessionalTitle}
                      placeholder="e.g., Senior PM at Google"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>

                  <View style={styles.section}>
                    <Text style={styles.label}>LINKEDIN URL</Text>
                    <TextInput
                      style={styles.input}
                      value={linkedinUrl}
                      onChangeText={setLinkedinUrl}
                      placeholder="https://linkedin.com/in/yourprofile"
                      placeholderTextColor="#9CA3AF"
                      autoCapitalize="none"
                    />
                  </View>

                  <View style={styles.section}>
                    <Text style={styles.label}>YEARS OF EXPERIENCE</Text>
                    <TextInput
                      style={styles.input}
                      value={yearsOfExp}
                      onChangeText={setYearsOfExp}
                      placeholder="e.g., 5"
                      keyboardType="numeric"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>

                  <View style={styles.section}>
                    <Text style={styles.label}>EXPERIENCE DESCRIPTION</Text>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      value={description}
                      onChangeText={setDescription}
                      placeholder="Brief summary of your professional experience..."
                      placeholderTextColor="#9CA3AF"
                      multiline
                    />
                  </View>

                  <View style={styles.section}>
                    <Text style={styles.label}>EXPERTISE / INTERVIEW PROFILES</Text>
                    <TouchableOpacity style={styles.dropdownButton} onPress={() => setProfilesModalVisible(true)}>
                      <Text style={[styles.dropdownText, selectedProfiles.length === 0 && { color: '#9CA3AF' }]}>
                        {selectedProfiles.length > 0
                          ? `${selectedProfiles.length} profile${selectedProfiles.length > 1 ? 's' : ''} selected`
                          : 'Select profiles...'}
                      </Text>
                      <Ionicons name="chevron-down" size={20} color="#6B7280" />
                    </TouchableOpacity>
                    {selectedProfiles.length > 0 && (
                      <View style={styles.selectedProfilesContainer}>
                        {selectedProfiles.map((profile, idx) => (
                          <View key={idx} style={styles.selectedProfileChip}>
                            <Text style={styles.selectedProfileText}>{profile}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                </>
              )}

              {/* --- SUBMIT BUTTON --- */}
              <TouchableOpacity
                style={[styles.signUpButton, (!isFormValid || loading) && styles.signUpButtonDisabled]}
                onPress={handleSignUp}
                disabled={!isFormValid || loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.signUpButtonText}>Create Account</Text>
                )}
              </TouchableOpacity>

              {/* --- FOOTER --- */}
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
        </ScrollView>
      </KeyboardAvoidingView>

      {/* --- MODAL FOR MENTOR PROFILES --- */}
      <Modal visible={profilesModalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Your Expertise</Text>
              <TouchableOpacity onPress={() => setProfilesModalVisible(false)}>
                <Ionicons name="close" size={24} color="#334155" />
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
  // Main Container - Matches Sign-In
  container: { flex: 1, backgroundColor: '#f8f5f0' },
  flex1: { flex: 1 },

  // ScrollView Content
  scrollContent: {
    flexGrow: 1,
    flexDirection: 'column',
  },

  // Form Wrapper - Centered with max-width
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

  // Typography - Matches Sign-In
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    color: '#334155',
  },

  hintText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 6,
  },

  // Inputs - Matches Sign-In
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#111827',
  },

  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },

  // Dropdown Button
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

  // Selected Profiles Chips
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

  // Role Toggle
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

  // Sign Up Button - Matches Sign-In
  signUpButton: {
    backgroundColor: '#0E9384',
    borderRadius: 999,
    alignItems: 'center',
    padding: 14,
    marginTop: 8,
  },

  signUpButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },

  signUpButtonText: {
    color: '#fff',
    fontWeight: '700',
  },

  // Auth Footer - Matches Sign-In
  authFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },

  authFooterText: {
    color: '#6b7280',
  },

  authFooterLink: {
    color: '#0E9384',
    fontWeight: '700',
  },

  // Banner (Top notification)
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 200,
    paddingVertical: 16,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
  },

  bannerText: {
    color: '#fff',
    fontWeight: '600',
    flex: 1,
    fontSize: 14,
  },

  // Modal Styles
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

  modalDoneText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});