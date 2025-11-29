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

export default function ProfileScreen() {
  const { profile, candidateProfile, setCandidateProfile, setProfile } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [fullName, setFullName] = useState('');
  const [professionalTitle, setProfessionalTitle] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');

  // --- 1. FETCH DATA ON MOUNT ---
  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // --- STEP 1: RESOLVE USER ID ---
        let userId = profile?.id;

        if (!userId) {
          console.log('[ProfileScreen] Store empty, checking Supabase session...');
          const { data: { user }, error: authError } = await supabase.auth.getUser();
          
          if (authError || !user) {
            console.warn('[ProfileScreen] No active session.');
            if (mounted) setLoading(false);
            return;
          }
          userId = user.id;
        }

        console.log('[ProfileScreen] Fetching details for:', userId);

        // --- STEP 2: FETCH DATA ---
        
        // A. Fetch Core Profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, full_name, email') // Select ID to ensure we have it for store
          .eq('id', userId)
          .single();

        if (profileError) throw profileError;

        // B. Fetch Candidate Details
        const { data: candidateData, error: candidateError } = await supabase
          .from('candidates')
          .select('professional_title, resume_url')
          .eq('id', userId)
          .maybeSingle();

        if (candidateError) console.warn('[Profile] Candidate fetch warning:', candidateError);

        if (mounted) {
          // Update Local Form State
          setFullName(profileData?.full_name || '');
          setProfessionalTitle(candidateData?.professional_title || '');
          setResumeUrl(candidateData?.resume_url || '');

          // Update Global Store (Critical for hydration)
          // We manually reconstruct the profile object if it was missing
          if (profileData) {
             setProfile({
                 id: profileData.id,
                 email: profileData.email,
                 full_name: profileData.full_name,
                 user_type: profile?.user_type || 'candidate', // Preserve type if known
                 created_at: profile?.created_at || new Date().toISOString()
             });
          }
          
          if (candidateData) {
             setCandidateProfile(candidateData as any);
          }
        }
      } catch (err) {
        console.error('[ProfileScreen] Load error:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();

    return () => { mounted = false; };
  }, []); // Run once on mount (we handle store sync internally)

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

      // Auth Check (Get ID directly from session for upload path)
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        Alert.alert('Error', 'Session lost. Please log in again.');
        setUploading(false);
        return;
      }

      // Prepare File
      let fileBody;
      if (Platform.OS === 'web') {
        const req = await fetch(file.uri);
        const blob = await req.blob();
        fileBody = blob; 
      } else {
        const formData = new FormData();
        formData.append('file', {
          uri: file.uri,
          name: file.name,
          type: file.mimeType || 'application/pdf',
        } as any);
        fileBody = formData;
      }

      // Upload
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/resume.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, fileBody, {
          upsert: true,
          contentType: 'application/pdf',
        });

      if (uploadError) throw uploadError;

      setResumeUrl(filePath); 
      Alert.alert('Success', 'Resume uploaded. Click Save to finish.');

    } catch (error: any) {
      console.error('[Upload] Error:', error);
      Alert.alert('Error', 'Failed to upload resume.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    // Robust check: Get ID from store OR session
    let userId = profile?.id;
    if (!userId) {
       const { data } = await supabase.auth.getUser();
       userId = data.user?.id;
    }

    if (!userId) {
        Alert.alert("Error", "No user session found.");
        return;
    }

    if (!fullName.trim()) {
      Alert.alert('Error', 'Full name is required');
      return;
    }

    setLoading(true);
    try {
      // 1. Update Core Profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', userId);

      if (profileError) throw profileError;

      // 2. Update Candidate Details
      const updatedCandidate = {
        professional_title: professionalTitle || null,
        resume_url: resumeUrl || null,
        updated_at: new Date(),
      };

      const { error: candidateError } = await supabase
        .from('candidates')
        .upsert({ id: userId, ...updatedCandidate });

      if (candidateError) throw candidateError;

      // 3. Update Local Store
      if (profile) setProfile({ ...profile, full_name: fullName });
      setCandidateProfile({ ...candidateProfile, ...updatedCandidate } as any);

      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error: any) {
      console.error('[Save] Error:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor: '#f8f5f0'}}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <AppText style={{marginTop: 12, color: theme.colors.text.light}}>Loading Profile...</AppText>
      </View>
    );
  }

  return (
    <ScreenBackground style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <View style={styles.headerContent}>
            <Heading level={1} style={styles.pageTitle}>My Profile</Heading>
            <AppText style={styles.pageSubtitle}>
              Manage your personal details and resume
            </AppText>
          </View>
        </View>
        <View style={styles.headerDivider} />

        {/* CONTENT */}
        <View style={styles.contentContainer}>
          
          {/* 1. Personal Info Card (Private) */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="person-outline" size={20} color={theme.colors.text.main} />
              <View>
                <Heading level={3} style={styles.cardTitle}>Personal Information</Heading>
                <AppText style={styles.cardSubtitle}>Private details used for account management</AppText>
              </View>
            </View>

            <View style={styles.formGrid}>
              <View style={styles.inputGroup}>
                <AppText style={styles.label}>Full Name *</AppText>
                <TextInput
                  style={styles.input}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="John Doe"
                  placeholderTextColor="#9CA3AF"
                />
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

          {/* 2. Public Details Card (Visible to Mentors) */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="briefcase-outline" size={20} color={theme.colors.text.main} />
              <View>
                <Heading level={3} style={styles.cardTitle}>Public Details</Heading>
                <AppText style={styles.cardSubtitle}>Information visible to mentors</AppText>
              </View>
            </View>

            <View style={styles.formGrid}>
              {/* Professional Title */}
              <View style={styles.inputGroup}>
                <AppText style={styles.label}>Professional Title</AppText>
                <TextInput
                  style={styles.input}
                  value={professionalTitle}
                  onChangeText={setProfessionalTitle}
                  placeholder="e.g. Senior Product Manager"
                  placeholderTextColor="#9CA3AF"
                />
                <AppText style={styles.inputHint}>
                  This is the primary title mentors will see.
                </AppText>
              </View>

              {/* Resume Upload */}
              <View style={styles.inputGroup}>
                <AppText style={styles.label}>Resume (PDF)</AppText>
                
                {/* Anonymous Hint Box */}
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

          {/* Action Button */}
          <TouchableOpacity 
            style={[styles.saveButton, loading && styles.saveButtonDisabled]} 
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <AppText style={styles.saveButtonText}>Save Changes</AppText>
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
    backgroundColor: "#f8f5f0", 
  },
  scrollContent: { paddingBottom: 40 },

  headerContainer: {
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 32,
    backgroundColor: "#f8f5f0",
  },
  headerContent: {
    maxWidth: 1000,
    width: '100%',
  },
  pageTitle: { 
    fontSize: 24, 
    fontWeight: "bold", 
    color: theme.colors.text.main, 
    marginBottom: 4 
  },
  pageSubtitle: { fontSize: 15, color: theme.colors.text.light },
  
  headerDivider: { 
    height: 1, 
    backgroundColor: theme.colors.border, 
    width: "100%",
    marginBottom: 24
  },

  contentContainer: {
    paddingHorizontal: 32,
    maxWidth: 800,
    width: '100%',
    alignSelf: 'flex-start',
  },

  // Cards
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text.main,
  },
  cardSubtitle: {
    fontSize: 12,
    color: theme.colors.text.light,
    marginTop: 2,
  },

  // Forms
  formGrid: { gap: 16 },
  inputGroup: { gap: 6 },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text.main,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: theme.colors.text.main,
    backgroundColor: "#FFF",
  },
  inputHint: {
    fontSize: 12,
    color: theme.colors.text.light,
  },
  inputDisabled: {
    backgroundColor: "#F9FAFB",
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Info Box
  infoBox: {
    flexDirection: 'row',
    backgroundColor: "#F0FDFA", // Light teal
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

  // Upload Styles
  uploadArea: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderStyle: 'dashed',
    borderRadius: 8,
    backgroundColor: "#F9FAFB",
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  uploadText: {
    fontSize: 14,
    fontWeight: "600",
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
    borderColor: "#E5E7EB",
    borderRadius: 8,
    backgroundColor: "#F9FAFB",
  },
  fileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0FDFA",
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileName: { fontSize: 14, fontWeight: "600", color: theme.colors.text.main },
  fileStatus: { fontSize: 12, color: theme.colors.primary },

  // Buttons
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
    fontWeight: "600",
    color: "#FFF",
  },
});