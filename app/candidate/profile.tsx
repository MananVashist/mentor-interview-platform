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
import { Heading, AppText, ScreenBackground, Button } from '@/lib/ui';
import { useAuthStore } from '@/lib/store';
import { candidateService } from '@/services/candidate.service';

export default function ProfileScreen() {
  const { profile, candidateProfile, setCandidateProfile } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [linkedinUrl, setLinkedinUrl] = useState(candidateProfile?.linkedin_url || '');
  const [targetProfile, setTargetProfile] = useState(candidateProfile?.target_profile || '');
  const [resumeUrl, setResumeUrl] = useState(candidateProfile?.resume_url || '');

  // Keep local form fields in sync if store updates
  useEffect(() => {
    setFullName(profile?.full_name || '');
    setPhone(profile?.phone || '');
    setLinkedinUrl(candidateProfile?.linkedin_url || '');
    setTargetProfile(candidateProfile?.target_profile || '');
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
        // Mock upload delay
        await new Promise((resolve) => setTimeout(resolve, 1200));
        const file = result.assets[0];
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
    if (linkedinUrl && !linkedinUrl.includes('linkedin.com')) {
      Alert.alert('Error', 'Please enter a valid LinkedIn URL');
      return;
    }

    setLoading(true);
    try {
      const updatedProfile = { full_name: fullName, phone: phone || null };
      await candidateService.updateProfile(profile.id, updatedProfile);

      const updatedCandidate = {
        linkedin_url: linkedinUrl || null,
        target_profile: targetProfile || null,
        resume_url: resumeUrl || null,
      };
      await candidateService.updateCandidateProfile(profile.id, updatedCandidate);

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
    // 🟢 1. Global Background Set to Cream
    <ScreenBackground style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* 🟢 2. Header Section (White BG + Border) */}
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

              <View style={styles.inputGroup}>
                <AppText style={styles.label}>Phone Number</AppText>
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="+91 98765 43210"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                  editable={!loading}
                />
              </View>

              <View style={styles.inputGroup}>
                <AppText style={styles.label}>Target Role</AppText>
                <TextInput
                  style={styles.input}
                  value={targetProfile}
                  onChangeText={setTargetProfile}
                  placeholder="e.g. Product Manager"
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
              <Heading level={3} style={styles.cardTitle}>Documents & Links</Heading>
            </View>

            {/* Resume Upload */}
            <View style={styles.inputGroup}>
              <AppText style={styles.label}>Resume (PDF)</AppText>
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

            {/* LinkedIn */}
            <View style={[styles.inputGroup, { marginTop: 16 }]}>
              <AppText style={styles.label}>LinkedIn Profile</AppText>
              <View style={styles.iconInputContainer}>
                <View style={styles.inputIcon}>
                  <Ionicons name="logo-linkedin" size={18} color="#0077b5" />
                </View>
                <TextInput
                  style={[styles.input, { paddingLeft: 44 }]}
                  value={linkedinUrl}
                  onChangeText={setLinkedinUrl}
                  placeholder="https://linkedin.com/in/..."
                  placeholderTextColor="#9CA3AF"
                  editable={!loading}
                />
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
  // 🟢 Cream Background to match Index layout
  container: { 
    flex: 1, 
    backgroundColor: "#f8f5f0", // #F9FAFB
  },
  scrollContent: { paddingBottom: 40 },

  // 🟢 Header Styling (White BG + Border)
  headerContainer: {
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 32,
    backgroundColor: "#f8f5f0",
  },
  headerContent: {
    maxWidth: 1000, // Optional max-width for large screens
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
    alignSelf: 'flex-start', // Align left to match dashboard grid
  },

  // Cards (White to pop against Cream bg)
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
  inputDisabled: {
    backgroundColor: "#F9FAFB",
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Upload Styles
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

  // LinkedIn Icon Input
  iconInputContainer: { position: 'relative', justifyContent: 'center' },
  inputIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },

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