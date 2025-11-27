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
import { Ionicons } from '@expo/vector-icons';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/lib/store';
import { useToastStore } from '@/lib/toast.store';
import { supabase } from '@/lib/supabase/client';
import { BrandHeader } from '@/lib/ui';

type InterviewProfile = { id: number; name: string };

export default function SignUpScreen() {
  const router = useRouter();
  const { setUser, setProfile } = useAuthStore();
  const toast = useToastStore();

  const [role, setRole] = useState<'candidate' | 'mentor'>('candidate');
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Candidate
  const [candidateTitle, setCandidateTitle] = useState('');

  // Mentor
  const [phone, setPhone] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [professionalTitle, setProfessionalTitle] = useState('');
  const [yearsOfExp, setYearsOfExp] = useState('');
  const [description, setDescription] = useState('');
  const [availableProfiles, setAvailableProfiles] = useState<InterviewProfile[]>([]);
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
  const [profilesModalVisible, setProfilesModalVisible] = useState(false);

  useEffect(() => {
    if (role === 'mentor') {
      (async () => {
        const { data } = await supabase.from('interview_profiles_admin').select('id, name').eq('is_active', true);
        if (data) setAvailableProfiles(data);
      })();
    }
  }, [role]);

  const isCommonValid = name.trim().length > 0 && email.trim().length > 0 && password.length >= 6 && password === confirmPassword;
  const isCandidateValid = isCommonValid && candidateTitle.trim().length > 0;
  const isMentorValid = isCommonValid && phone.trim().length >= 10 && linkedinUrl.trim().includes('linkedin.com') && professionalTitle.trim().length > 0 && yearsOfExp.trim().length > 0 && description.trim().length > 0 && selectedProfiles.length > 0;
  const isFormValid = role === 'candidate' ? isCandidateValid : isMentorValid;

  const toggleProfileSelection = (profileName: string) => {
    if (selectedProfiles.includes(profileName)) {
      setSelectedProfiles((prev) => prev.filter((p) => p !== profileName));
    } else {
      setSelectedProfiles((prev) => [...prev, profileName]);
    }
  };

  const handleSignUp = async () => {
    if (!isFormValid) {
      toast.show('Please fill in all required fields correctly.', 'error');
      return;
    }

    setLoading(true);
    try {
      let finalUser = null;
      let isExistingUser = false;
      let finalMentorStatus = 'pending'; 

      // 1. Try Sign Up
      const { user: newUser, error: authError } = await authService.signUp(email.trim(), password.trim(), name.trim(), role);

      if (authError) {
        const errorMsg = authError.message.toLowerCase();
        if (errorMsg.includes('registered') || errorMsg.includes('exists') || errorMsg.includes('already')) {
          const { user: existingUser, error: signInError } = await authService.signIn(email.trim(), password.trim());
          if (signInError || !existingUser) throw new Error("This email is registered. Please check your password or sign in.");
          finalUser = existingUser;
          isExistingUser = true;
        } else {
          throw new Error(authError.message);
        }
      } else {
        finalUser = newUser;
      }

      if (!finalUser) throw new Error('Authentication failed.');

      // 3. Upsert Profile
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: finalUser.id,
        email: email.trim(),
        full_name: name.trim(),
        role: role,
        phone: role === 'mentor' ? phone.trim() : null,
        is_admin: false,
        updated_at: new Date().toISOString(),
      });
      if (profileError) throw new Error(`Profile update failed: ${profileError.message}`);

      // 4. Upsert Role Profile
      if (role === 'mentor') {
        if (isExistingUser) {
          const { data: existingMentor } = await supabase.from('mentors').select('status').eq('profile_id', finalUser.id).single();
          if (existingMentor?.status) finalMentorStatus = existingMentor.status; 
        }

        // 🟢 FIX: Explicitly send 'id' as 'finalUser.id' to satisfy constraint
        const { error: mentorError } = await supabase.from('mentors').upsert({
          id: finalUser.id, // <--- CRITICAL FIX HERE
          profile_id: finalUser.id,
          status: finalMentorStatus,
          professional_title: professionalTitle.trim(),
          linkedin_url: linkedinUrl.trim(),
          years_of_experience: parseInt(yearsOfExp) || 0,
          experience_description: description.trim(),
          expertise_profiles: selectedProfiles,
          session_price_inr: 2000,
          is_hr_mentor: false,
          updated_at: new Date().toISOString(),
        });
        if (mentorError) throw new Error(`Mentor profile failed: ${mentorError.message}`);
      } else {
        // Candidate upsert (also explicitly setting ID is good practice for 1:1)
        const { error: candidateError } = await supabase.from('candidates').upsert({
          id: finalUser.id, // Good practice to match pattern
          profile_id: finalUser.id,
          professional_title: candidateTitle.trim(),
          updated_at: new Date().toISOString(),
        });
        if (candidateError) throw new Error(`Candidate profile failed: ${candidateError.message}`);
      }

      // 5. Update Local Store
      setUser(finalUser);
      setProfile({
        id: finalUser.id,
        email: email.trim(),
        full_name: name.trim(),
        role,
        phone: role === 'mentor' ? phone.trim() : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_admin: false,
      });
      
      const successMsg = isExistingUser ? 'Profile updated! Logging you in...' : 'Account created! Logging you in...';
      toast.show(successMsg, 'success');

      setTimeout(() => {
        if (role === 'candidate') {
          router.replace('/candidate');
        } else {
          if (finalMentorStatus === 'approved') router.replace('/mentor/bookings');
          else router.replace('/mentor/under-review');
        }
      }, 1000);

    } catch (err: any) {
      toast.show(err?.message ?? 'Sign up failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView style={styles.flex1} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={styles.formWrapper}>
            <View style={styles.content}>
              <BrandHeader />
              <View style={styles.spacer} />

              <View style={styles.section}>
                <Text style={styles.label}>I AM A</Text>
                <View style={styles.roleToggle}>
                  <TouchableOpacity style={[styles.roleButton, role === 'candidate' && styles.roleButtonActive]} onPress={() => setRole('candidate')}>
                    <Text style={[styles.roleButtonText, role === 'candidate' && styles.roleButtonTextActive]}>Candidate</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.roleButton, role === 'mentor' && styles.roleButtonActive]} onPress={() => setRole('mentor')}>
                    <Text style={[styles.roleButtonText, role === 'mentor' && styles.roleButtonTextActive]}>Mentor</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.label}>FULL NAME <Text style={styles.req}>*</Text></Text>
                <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="John Doe" placeholderTextColor="#9CA3AF" />
              </View>

              <View style={styles.section}>
                <Text style={styles.label}>EMAIL ADDRESS <Text style={styles.req}>*</Text></Text>
                <TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="name@work-email.com" placeholderTextColor="#9CA3AF" />
                <Text style={styles.hintText}>We'll never share your email with anyone</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.label}>PASSWORD <Text style={styles.req}>*</Text></Text>
                <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry placeholder="Minimum 6 characters" placeholderTextColor="#9CA3AF" />
              </View>

              <View style={styles.section}>
                <Text style={styles.label}>CONFIRM PASSWORD <Text style={styles.req}>*</Text></Text>
                <TextInput style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry placeholder="Re-enter your password" placeholderTextColor="#9CA3AF" />
              </View>

              {role === 'candidate' ? (
                <View style={styles.section}>
                  <Text style={styles.label}>PROFESSIONAL TITLE <Text style={styles.req}>*</Text></Text>
                  <TextInput style={styles.input} value={candidateTitle} onChangeText={setCandidateTitle} placeholder="e.g., Product Manager, Data Analyst" placeholderTextColor="#9CA3AF" />
                </View>
              ) : (
                <>
                  <Text style={styles.confidentialText}>🔒 Your private details (Phone & Email) are kept 100% confidential and only used for verification.</Text>
                  <View style={styles.section}>
                    <Text style={styles.label}>PHONE NUMBER <Text style={styles.req}>*</Text></Text>
                    <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="+91 98765 43210" placeholderTextColor="#9CA3AF" />
                    <Text style={styles.hintText}>Only for admin verification calls.</Text>
                  </View>
                  <View style={styles.section}>
                    <Text style={styles.label}>LINKEDIN PROFILE <Text style={styles.req}>*</Text></Text>
                    <TextInput style={styles.input} value={linkedinUrl} onChangeText={setLinkedinUrl} autoCapitalize="none" placeholder="https://linkedin.com/in/yourprofile" placeholderTextColor="#9CA3AF" />
                  </View>
                  <View style={styles.section}>
                    <Text style={styles.label}>PROFESSIONAL TITLE <Text style={styles.req}>*</Text></Text>
                    <TextInput style={styles.input} value={professionalTitle} onChangeText={setProfessionalTitle} placeholder="e.g., Senior PM at Google" placeholderTextColor="#9CA3AF" />
                  </View>
                  <View style={styles.section}>
                    <Text style={styles.label}>YEARS OF EXPERIENCE <Text style={styles.req}>*</Text></Text>
                    <TextInput style={styles.input} value={yearsOfExp} onChangeText={setYearsOfExp} keyboardType="numeric" placeholder="5" placeholderTextColor="#9CA3AF" />
                  </View>
                  <View style={styles.section}>
                    <Text style={styles.label}>EXPERTISE AREAS <Text style={styles.req}>*</Text></Text>
                    <TouchableOpacity style={styles.dropdownButton} onPress={() => setProfilesModalVisible(true)}>
                      <Text style={styles.dropdownText}>{selectedProfiles.length > 0 ? `${selectedProfiles.length} selected` : 'Select areas'}</Text>
                      <Ionicons name="chevron-down" size={20} color="#6B7280" />
                    </TouchableOpacity>
                    {selectedProfiles.length > 0 && (
                      <View style={styles.selectedProfilesContainer}>
                        {selectedProfiles.map((p, idx) => (
                          <View key={idx} style={styles.selectedProfileChip}><Text style={styles.selectedProfileText}>{p}</Text></View>
                        ))}
                      </View>
                    )}
                  </View>
                  <View style={styles.section}>
                    <Text style={styles.label}>EXPERIENCE DESCRIPTION <Text style={styles.req}>*</Text></Text>
                    <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} multiline placeholder="Brief description of your relevant experience..." placeholderTextColor="#9CA3AF" />
                  </View>
                </>
              )}

              <TouchableOpacity style={[styles.signUpButton, (!isFormValid || loading) && styles.signUpButtonDisabled]} onPress={handleSignUp} disabled={!isFormValid || loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.signUpButtonText}>{role === 'candidate' ? 'Create Account' : 'Submit Application'}</Text>}
              </TouchableOpacity>

              <View style={styles.authFooter}>
                <Text style={styles.authFooterText}>Already have an account? </Text>
                <Link href="/auth/sign-in" asChild><TouchableOpacity><Text style={styles.authFooterLink}>Sign In</Text></TouchableOpacity></Link>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={profilesModalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Your Expertise</Text>
              <TouchableOpacity onPress={() => setProfilesModalVisible(false)}><Ionicons name="close" size={24} color="#334155" /></TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 400 }}>
              {availableProfiles.map((p) => {
                const isSelected = selectedProfiles.includes(p.name);
                return (
                  <TouchableOpacity key={p.id} style={[styles.modalOption, isSelected && styles.modalOptionSelected]} onPress={() => toggleProfileSelection(p.name)}>
                    <Text style={[styles.modalOptionText, isSelected && styles.modalOptionTextSelected]}>{p.name}</Text>
                    {isSelected && <Ionicons name="checkmark-circle" size={20} color="#0E9384" />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <TouchableOpacity style={styles.modalDoneBtn} onPress={() => setProfilesModalVisible(false)}><Text style={styles.modalDoneText}>Done</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f5f0' },
  flex1: { flex: 1 },
  scrollContent: { flexGrow: 1, flexDirection: 'column' },
  formWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60, width: '100%' },
  content: { padding: 24, maxWidth: 400, width: '100%', backgroundColor: 'transparent' },
  spacer: { marginBottom: 24 },
  section: { marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '600', marginBottom: 6, color: '#334155' },
  req: { color: '#EF4444' },
  hintText: { fontSize: 12, color: '#6B7280', marginTop: 6 },
  confidentialText: { fontSize: 12, color: '#065F46', textAlign: 'center', marginBottom: 20, paddingHorizontal: 10, paddingVertical: 8, backgroundColor: '#D1FAE5', borderRadius: 8, overflow: 'hidden' },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10, padding: 12, backgroundColor: '#fff', fontSize: 16, color: '#111827' },
  textArea: { height: 80, textAlignVertical: 'top' },
  dropdownButton: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10, padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff' },
  dropdownText: { fontSize: 16, color: '#111827' },
  selectedProfilesContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8, gap: 8 },
  selectedProfileChip: { backgroundColor: '#D1FAE5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  selectedProfileText: { fontSize: 12, color: '#065F46', fontWeight: '600' },
  roleToggle: { flexDirection: 'row', borderRadius: 10, padding: 4, backgroundColor: '#E5E7EB' },
  roleButton: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  roleButtonActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  roleButtonText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  roleButtonTextActive: { color: '#0E9384' },
  signUpButton: { backgroundColor: '#0E9384', borderRadius: 999, alignItems: 'center', padding: 14, marginTop: 8 },
  signUpButtonDisabled: { backgroundColor: '#9CA3AF' },
  signUpButtonText: { color: '#fff', fontWeight: '700' },
  authFooter: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  authFooterText: { color: '#6b7280' },
  authFooterLink: { color: '#0E9384', fontWeight: '700' },
  banner: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 200, paddingVertical: 16, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: Platform.OS === 'ios' ? 50 : 16 },
  bannerText: { color: '#fff', fontWeight: '600', flex: 1, fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 16, padding: 20, width: '100%', maxWidth: 400, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  modalOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  modalOptionSelected: { backgroundColor: '#F0FDFA' },
  modalOptionText: { fontSize: 16, color: '#374151' },
  modalOptionTextSelected: { color: '#0E9384', fontWeight: '600' },
  modalDoneBtn: { marginTop: 16, backgroundColor: '#0E9384', padding: 14, borderRadius: 999, alignItems: 'center' },
  modalDoneText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});