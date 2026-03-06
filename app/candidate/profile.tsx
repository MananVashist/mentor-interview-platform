// app/candidate/profile.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';

import { theme } from '@/lib/theme';
import { Heading, AppText, ScreenBackground } from '@/lib/ui';
import { useAuthStore } from '@/lib/store';
import { supabase } from '@/lib/supabase/client';

const F = Platform.select({
  web: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  default: 'System',
}) as string;

export default function ProfileScreen() {
  const { profile, candidateProfile, setCandidateProfile, setProfile } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [fullName, setFullName] = useState('');
  const [professionalTitle, setProfessionalTitle] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');

  // 🟢 True when name or title is missing on load.
  // Drives the locked-tabs warning banner and required-field highlights.
  // Cleared as soon as handleSave succeeds with both fields filled.
  const [profileIncomplete, setProfileIncomplete] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);

        let userId = profile?.id;
        if (!userId) {
          const { data: { user }, error: authError } = await supabase.auth.getUser();
          if (authError || !user) {
            if (mounted) setLoading(false);
            return;
          }
          userId = user.id;
        }

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .eq('id', userId)
          .single();

        if (profileError) throw profileError;

        const { data: candidateData, error: candidateError } = await supabase
          .from('candidates')
          .select('professional_title, resume_url')
          .eq('id', userId)
          .maybeSingle();

        if (candidateError) console.warn('[Profile] Candidate fetch warning:', candidateError);

        if (mounted) {
          const fetchedName = profileData?.full_name || '';
          const fetchedTitle = candidateData?.professional_title || '';

          setFullName(fetchedName);
          setProfessionalTitle(fetchedTitle);

          // 🟢 Evaluate incompleteness on fresh data from DB (not store)
          setProfileIncomplete(!fetchedName.trim() || !fetchedTitle.trim());

          let resumeUrlToSet = candidateData?.resume_url || '';
          if (resumeUrlToSet && !resumeUrlToSet.startsWith('http')) {
            const { data: publicUrlData } = supabase.storage
              .from('resumes')
              .getPublicUrl(resumeUrlToSet);
            if (publicUrlData?.publicUrl) resumeUrlToSet = publicUrlData.publicUrl;
          }
          setResumeUrl(resumeUrlToSet);

          if (profileData) {
            setProfile({
              id: profileData.id,
              email: profileData.email,
              full_name: profileData.full_name,
              user_type: profile?.user_type || 'candidate',
              created_at: profile?.created_at || new Date().toISOString(),
            });
          }
          if (candidateData) setCandidateProfile(candidateData as any);
        }
      } catch (err) {
        console.error('[ProfileScreen] Load error:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => { mounted = false; };
  }, []);

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;
      const file = result.assets[0];

      if (file.size && file.size > 5 * 1024 * 1024) {
        Alert.alert('Error', 'File size must be under 5MB');
        return;
      }

      setUploading(true);

      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        Alert.alert('Error', 'Session lost. Please log in again.');
        setUploading(false);
        return;
      }

      let fileBody;
      if (Platform.OS === 'web') {
        const req = await fetch(file.uri);
        fileBody = await req.blob();
      } else {
        const formData = new FormData();
        formData.append('file', {
          uri: file.uri,
          name: file.name,
          type: file.mimeType || 'application/pdf',
        } as any);
        fileBody = formData;
      }

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/resume.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, fileBody, { upsert: true, contentType: 'application/pdf' });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from('resumes').getPublicUrl(filePath);
      if (!publicUrlData?.publicUrl) throw new Error('Failed to generate public URL');

      setResumeUrl(publicUrlData.publicUrl);
      Alert.alert('Success', 'Resume uploaded. Click Save to finish.');

    } catch (error: any) {
      Alert.alert('Error', 'Failed to upload resume.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert('Required', 'Full name is required to unlock the dashboard.');
      return;
    }
    if (!professionalTitle.trim()) {
      Alert.alert('Required', 'Professional title is required to unlock the dashboard.');
      return;
    }

    setLoading(true);
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        Alert.alert('Authentication Error', 'Your session has expired. Please log in again.');
        setLoading(false);
        return;
      }

      const userId = user.id;

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: fullName.trim() })
        .eq('id', userId);
      if (profileError) throw profileError;

      const updatedCandidate = {
        professional_title: professionalTitle.trim(),
        resume_url: resumeUrl || null,
        updated_at: new Date(),
      };

      const { data: updateData, error: updateError } = await supabase
        .from('candidates')
        .update(updatedCandidate)
        .eq('id', userId)
        .select();

      let candidateData = updateData;
      let candidateError = updateError;

      if (!updateError && (!updateData || updateData.length === 0)) {
        const { data: insertData, error: insertError } = await supabase
          .from('candidates')
          .insert({ id: userId, ...updatedCandidate })
          .select();
        candidateData = insertData;
        candidateError = insertError;
      }

      if (candidateError) throw candidateError;

      if (profile) setProfile({ ...profile, full_name: fullName.trim() });
      setCandidateProfile({ ...candidateProfile, ...updatedCandidate } as any);

      // 🟢 Profile is now complete — clear the banner
      setProfileIncomplete(false);

      Alert.alert('Success', 'Profile updated successfully!');

    } catch (error: any) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f5f0' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <AppText style={{ marginTop: 12, color: theme.colors.text.light }}>Loading Profile...</AppText>
      </View>
    );
  }

  return (
    <ScreenBackground style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* 🟢 LOCKED TABS BANNER
            Shown when name or title is missing. The _layout.tsx enforcer redirects
            any attempt to visit Browse Mentors or My Bookings back to this page,
            so this banner explains why and tells the user what to do.
            Disappears immediately after a successful save. */}
        {profileIncomplete && (
          <View style={styles.lockedBanner}>
            <View style={styles.lockedBannerInner}>
              <View style={styles.lockedIconWrap}>
                <Ionicons name="lock-closed" size={18} color="#92400E" />
              </View>
              <View style={{ flex: 1 }}>
                <AppText style={styles.lockedBannerTitle}>
                  Complete your profile to unlock the dashboard
                </AppText>
                <AppText style={styles.lockedBannerDesc}>
                  <AppText style={{ fontWeight: '700' }}>Browse Mentors</AppText> and{' '}
                  <AppText style={{ fontWeight: '700' }}>My Bookings</AppText> are locked until
                  you save your Full Name and Professional Title below.
                </AppText>
              </View>
            </View>
          </View>
        )}

        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.headerContent}>
            <Heading level={1} style={styles.pageTitle}>My Profile</Heading>
            <AppText style={styles.pageSubtitle}>
              {profileIncomplete
                ? 'Fill in the required fields and save to access the rest of the platform.'
                : 'Manage your personal details and resume'}
            </AppText>
          </View>
        </View>
        <View style={styles.headerDivider} />

        <View style={styles.contentContainer}>

          {/* 1. Personal Info Card */}
          <View style={[styles.card, profileIncomplete && styles.cardHighlighted]}>
            <View style={styles.cardHeader}>
              <Ionicons name="person-outline" size={20} color={theme.colors.text.main} />
              <View>
                <Heading level={3} style={styles.cardTitle}>Personal Information</Heading>
                <AppText style={styles.cardSubtitle}>Private details used for account management</AppText>
              </View>
            </View>

            <View style={styles.formGrid}>
              <View style={styles.inputGroup}>
                <AppText style={styles.label}>
                  Full Name{' '}
                  <AppText style={styles.required}>*</AppText>
                </AppText>
                <TextInput
                  style={[
                    styles.input,
                    profileIncomplete && !fullName.trim() && styles.inputError,
                  ]}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="John Doe"
                  placeholderTextColor="#9CA3AF"
                />
                {profileIncomplete && !fullName.trim() && (
                  <AppText style={styles.fieldError}>Required to unlock the dashboard</AppText>
                )}
              </View>

              <View style={styles.inputGroup}>
                <AppText style={styles.label}>Email Address</AppText>
                <View style={[styles.input, styles.inputDisabled]}>
                  <AppText style={{ color: theme.colors.text.light }}>{profile?.email || 'Loading...'}</AppText>
                  <Ionicons name="lock-closed" size={14} color={theme.colors.text.light} />
                </View>
              </View>
            </View>
          </View>

          {/* 2. Public Details Card */}
          <View style={[styles.card, profileIncomplete && styles.cardHighlighted]}>
            <View style={styles.cardHeader}>
              <Ionicons name="briefcase-outline" size={20} color={theme.colors.text.main} />
              <View>
                <Heading level={3} style={styles.cardTitle}>Public Details</Heading>
                <AppText style={styles.cardSubtitle}>Information visible to mentors</AppText>
              </View>
            </View>

            <View style={styles.formGrid}>
              <View style={styles.inputGroup}>
                <AppText style={styles.label}>
                  Professional Title{' '}
                  <AppText style={styles.required}>*</AppText>
                </AppText>
                <TextInput
                  style={[
                    styles.input,
                    profileIncomplete && !professionalTitle.trim() && styles.inputError,
                  ]}
                  value={professionalTitle}
                  onChangeText={setProfessionalTitle}
                  placeholder="e.g. Senior Product Manager"
                  placeholderTextColor="#9CA3AF"
                />
                <AppText style={styles.inputHint}>
                  This is the primary title mentors will see.
                </AppText>
                {profileIncomplete && !professionalTitle.trim() && (
                  <AppText style={styles.fieldError}>Required to unlock the dashboard</AppText>
                )}
              </View>

              {/* Resume Upload */}
              <View style={styles.inputGroup}>
                <AppText style={styles.label}>Resume (PDF)</AppText>
                <View style={styles.infoBox}>
                  <Ionicons name="information-circle" size={16} color={theme.colors.primary} />
                  <AppText style={styles.infoBoxText}>
                    Please upload an edited resume without your name or contact info to keep it anonymous.
                  </AppText>
                </View>

                {resumeUrl ? (
                  <View style={styles.fileCard}>
                    <View style={styles.fileIcon}>
                      <Ionicons name="document-text" size={24} color={theme.colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <AppText style={styles.fileName}>Resume.pdf</AppText>
                      <AppText style={styles.fileStatus}>Uploaded</AppText>
                    </View>
                    <TouchableOpacity onPress={() => setResumeUrl('')}>
                      <Ionicons name="trash-outline" size={20} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.uploadArea}
                    onPress={handlePickDocument}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <ActivityIndicator color={theme.colors.primary} />
                    ) : (
                      <>
                        <Ionicons name="cloud-upload-outline" size={24} color={theme.colors.primary} />
                        <AppText style={styles.uploadText}>Click to upload anonymous resume</AppText>
                        <AppText style={styles.uploadSub}>PDF format, max 5MB</AppText>
                      </>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <AppText style={styles.saveButtonText}>
                {profileIncomplete ? 'Save & Unlock Dashboard' : 'Save Changes'}
              </AppText>
            )}
          </TouchableOpacity>

        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f5f0',
  },
  scrollContent: { paddingBottom: 40 },

  // 🟢 Locked banner
  lockedBanner: {
    backgroundColor: '#FFFBEB',
    borderBottomWidth: 1,
    borderBottomColor: '#FDE68A',
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  lockedBannerInner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    maxWidth: 800,
    width: '100%',
    alignSelf: 'flex-start',
  },
  lockedIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  lockedBannerTitle: {
    fontFamily: F,
    fontSize: 14,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 4,
  },
  lockedBannerDesc: {
    fontFamily: F,
    fontSize: 13,
    color: '#92400E',
    lineHeight: 19,
  },

  // Card highlight when incomplete
  cardHighlighted: {
    borderColor: '#FDE68A',
    borderWidth: 1.5,
  },

  // Required field inline error
  required: {
    color: '#EF4444',
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  fieldError: {
    fontFamily: F,
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },

  headerContainer: {
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 32,
    backgroundColor: '#f8f5f0',
  },
  headerContent: {
    maxWidth: 1000,
    width: '100%',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text.main,
    marginBottom: 4,
  },
  pageSubtitle: { fontSize: 15, color: theme.colors.text.light },
  headerDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
    width: '100%',
    marginBottom: 24,
  },
  contentContainer: {
    paddingHorizontal: 32,
    maxWidth: 800,
    width: '100%',
    alignSelf: 'flex-start',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.main,
  },
  cardSubtitle: {
    fontSize: 12,
    color: theme.colors.text.light,
    marginTop: 2,
  },
  formGrid: { gap: 16 },
  inputGroup: { gap: 6 },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.main,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: theme.colors.text.main,
    backgroundColor: '#FFF',
  },
  inputDisabled: {
    backgroundColor: '#F9FAFB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputHint: {
    fontSize: 12,
    color: theme.colors.text.light,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#F0FDFA',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
  },
  infoBoxText: {
    fontSize: 12,
    color: theme.colors.primary,
    flex: 1,
    lineHeight: 18,
  },
  uploadArea: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderStyle: 'dashed',
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  uploadText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  uploadSub: {
    fontSize: 12,
    color: theme.colors.text.light,
  },
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  fileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileName: { fontSize: 14, fontWeight: '600', color: theme.colors.text.main },
  fileStatus: { fontSize: 12, color: theme.colors.primary },
  saveButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  saveButtonDisabled: { opacity: 0.7 },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
});