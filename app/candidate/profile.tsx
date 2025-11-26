import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';

import { theme } from '@/lib/theme';
import { Heading, AppText, ScreenBackground } from '@/lib/ui';
import { useAuthStore } from '@/lib/store';
import { candidateService } from '@/services/candidate.service';

export default function ProfileScreen() {
  const { profile, candidateProfile, setCandidateProfile } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [fullName, setFullName] = useState(profile?.full_name || '');
  // Mapped to 'professional_title' column in candidates table
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
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;

      if (result.assets && result.assets[0]) {
        setUploading(true);
        // Mock upload delay - In production, replace with real Supabase Storage upload
        await new Promise((resolve) => setTimeout(resolve, 1200));
        const file = result.assets[0];
        
        // TODO: Replace with real storage URL after upload
        const uploadedUrl = `https://storage.example.com/resumes/${Date.now()}_${file.name}`;

        setResumeUrl(uploadedUrl);
        Alert.alert('Success', 'Resume uploaded successfully!');
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to upload resume');
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
      // 1. Update User Profile (profiles table)
      const updatedProfile = { full_name: fullName };
      await candidateService.updateProfile(profile.id, updatedProfile);

      // 2. Update Candidate Profile (candidates table)
      // Only saving professional_title and resume_url as requested
      const updatedCandidate = {
        professional_title: professionalTitle || null,
        resume_url: resumeUrl || null,
      };
      await candidateService.updateCandidateProfile(profile.id, updatedCandidate);

      // 3. Update Local Store
      setCandidateProfile({ ...candidateProfile, ...updatedCandidate } as any);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
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
              Manage your personal details and documents
            </AppText>
          </View>
        </View>
        <View style={styles.headerDivider} />

        {/* CONTENT */}
        <View style={styles.contentContainer}>
          
          {/* Personal Info Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="person-outline" size={20} color={theme.colors.text.main} />
              <Heading level={3} style={styles.cardTitle}>Personal Information</Heading>
            </View>

            <View style={styles.formGrid}>
              
              {/* Full Name */}
              <View style={styles.inputGroup}>
                <AppText style={styles.label}>Full Name (will be kept private)</AppText>
                <TextInput
                  style={styles.input}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="John Doe"
                  placeholderTextColor="#9CA3AF"
                  editable={!loading}
                />
              </View>

              {/* Email (Read-only) */}
              <View style={styles.inputGroup}>
                <AppText style={styles.label}>Email Address</AppText>
                <View style={[styles.input, styles.inputDisabled]}>
                  <AppText style={{ color: theme.colors.text.light }}>{profile?.email}</AppText>
                  <Ionicons name="lock-closed" size={14} color={theme.colors.text.light} />
                </View>
              </View>

              {/* Professional Title (Mapped to DB: professional_title) */}
              <View style={styles.inputGroup}>
                <AppText style={styles.label}>Professional Title (will be shown to mentors)</AppText>
                <TextInput
                  style={styles.input}
                  value={professionalTitle}
                  onChangeText={setProfessionalTitle}
                  placeholder="e.g. Senior Product Manager"
                  placeholderTextColor="#9CA3AF"
                  editable={!loading}
                />
              </View>

            </View>
          </View>

          {/* Documents Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="document-text-outline" size={20} color={theme.colors.text.main} />
              <Heading level={3} style={styles.cardTitle}>Resume</Heading>
            </View>

            {/* Resume Upload */}
            <View style={styles.inputGroup}>
              <AppText style={styles.label}>Upload Resume (PDF)</AppText>
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
                      <AppText style={styles.uploadText}>Click to upload resume</AppText>
                      <AppText style={styles.uploadSub}>PDF format, max 5MB</AppText>
                    </>
                  )}
                </TouchableOpacity>
              )}
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
    alignItems: 'center',
    gap: 10,
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
  inputDisabled: {
    backgroundColor: "#F9FAFB",
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  uploadArea: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderStyle: 'dashed',
    borderRadius: 8,
    backgroundColor: "#F0FDFA",
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