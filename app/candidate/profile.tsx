import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Platform, // Ensure Platform is imported
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';

import { theme } from '@/lib/theme';
import { Heading, AppText, ScreenBackground } from '@/lib/ui';
import { useAuthStore } from '@/lib/store';
import { candidateService } from '@/services/candidate.service';
import { supabase } from '@/lib/supabase/client';

export default function ProfileScreen() {
  const { profile, candidateProfile, setCandidateProfile } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [professionalTitle, setProfessionalTitle] = useState(candidateProfile?.professional_title || '');
  const [resumeUrl, setResumeUrl] = useState(candidateProfile?.resume_url || '');

  // Keep local form fields in sync if store updates
  useEffect(() => {
    setFullName(profile?.full_name || '');
    setProfessionalTitle(candidateProfile?.professional_title || '');
    setResumeUrl(candidateProfile?.resume_url || '');
  }, [profile, candidateProfile]);

  const handlePickDocument = async () => {
    try {
      console.log('[Upload] Starting document picker...');
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        console.log('[Upload] Cancelled by user');
        return;
      }
      
      const file = result.assets[0];
      console.log('[Upload] File selected:', { name: file.name, size: file.size, uri: file.uri });
      
      // Validate size (e.g., max 5MB)
      if (file.size && file.size > 5 * 1024 * 1024) {
        Alert.alert('Error', 'File size must be under 5MB');
        return;
      }

      setUploading(true);

      // --- CRITICAL FIX: Get the REAL Auth ID directly from session ---
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.error('[Upload] Auth Error:', authError);
        Alert.alert('Error', 'Authentication session lost. Please log in again.');
        setUploading(false);
        return;
      }

      console.log('[Upload] Authenticated User ID:', user.id);
      console.log('[Upload] Profile Store ID:', profile?.id);

      // 1. Prepare file body based on Platform
      let fileBody;

      if (Platform.OS === 'web') {
        console.log('[Upload] Processing for WEB (Blob)...');
        const req = await fetch(file.uri);
        const blob = await req.blob();
        fileBody = blob; 
      } else {
        console.log('[Upload] Processing for MOBILE (FormData)...');
        const formData = new FormData();
        formData.append('file', {
          uri: file.uri,
          name: file.name,
          type: file.mimeType || 'application/pdf',
        } as any);
        fileBody = formData;
      }

      // 2. Define path using the AUTH USER ID (Guarantees RLS match)
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/resume.${fileExt}`;
      console.log('[Upload] Target Path:', filePath);

      // 3. Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, fileBody, {
          upsert: true,
          contentType: 'application/pdf', // Force PDF content type
        });

      if (uploadError) {
        console.error('[Upload] Supabase Error:', uploadError);
        throw uploadError;
      }

      console.log('[Upload] Success:', data);

      // 4. Save Path
      setResumeUrl(filePath); 
      
      Alert.alert('Success', 'Resume uploaded. Click Save to finish.');

    } catch (error: any) {
      console.error('[Upload] Final Catch:', error);
      Alert.alert('Error', error.message || 'Failed to upload resume.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!profile?.id) return;

    if (!fullName.trim()) {
      Alert.alert('Error', 'Full name is required');
      return;
    }

    setLoading(true);
    try {
      console.log('[Save] Starting update for user:', profile.id);

      // 1. Update Core Profile (Full Name) - Direct Supabase Call
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', profile.id);

      if (profileError) {
        console.error('[Save] Profile Table Error:', profileError);
        throw profileError;
      }

      // 2. Update Candidate Details (Title & Resume) - Direct Supabase Call
      const updatedCandidate = {
        professional_title: professionalTitle || null,
        resume_url: resumeUrl || null,
        updated_at: new Date(), // Good practice to update timestamp
      };

      const { error: candidateError } = await supabase
        .from('candidates')
        .update(updatedCandidate)
        .eq('id', profile.id);

      if (candidateError) {
        console.error('[Save] Candidate Table Error:', candidateError);
        throw candidateError;
      }

      // 3. Update Local State (Zustand Store)
      // Update candidate specific fields
      setCandidateProfile({ ...candidateProfile, ...updatedCandidate } as any);
      
      // Update core profile fields
      useAuthStore.getState().setProfile({ ...profile, full_name: fullName });

      Alert.alert('Success', 'Profile updated successfully!');
      
    } catch (error: any) {
      console.error('[Save] Final Error:', error);
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

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
                  editable={!loading}
                />
              </View>

              <View style={styles.inputGroup}>
                <AppText style={styles.label}>Email Address</AppText>
                <View style={[styles.input, styles.inputDisabled]}>
                  <AppText style={{ color: theme.colors.text.light }}>{profile?.email}</AppText>
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
                  editable={!loading}
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