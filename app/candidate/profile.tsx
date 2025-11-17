// app/candidate/profile.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';

import { colors, spacing, borderRadius, typography, shadows } from '@/lib/theme';
import { Heading, AppText, Label, Input, Button, Card, Section, ScreenBackground } from '@/lib/ui';
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
  }, [
    profile?.full_name,
    profile?.phone,
    candidateProfile?.linkedin_url,
    candidateProfile?.target_profile,
    candidateProfile?.resume_url,
  ]);

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;

      if (result.assets && result.assets[0]) {
        setUploading(true);

        // TODO: replace with real upload (S3/Supabase storage) and returned URL
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
      // Update base profile
      const updatedProfile = {
        full_name: fullName,
        phone: phone || null,
      };
      await candidateService.updateProfile(profile.id, updatedProfile);

      // Update candidate details
      const updatedCandidate = {
        linkedin_url: linkedinUrl || null,
        target_profile: targetProfile || null,
        resume_url: resumeUrl || null,
      };
      await candidateService.updateCandidateProfile(profile.id, updatedCandidate);

      // Local store
      setCandidateProfile({
        ...candidateProfile,
        ...updatedCandidate,
      } as any);

      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }}>
        {/* Header */}
        <Section style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons name="person-circle-outline" size={32} color={colors.primary} />
          </View>
          <Heading level={1}>My Profile</Heading>
          <AppText style={styles.headerSub}>
            Manage your details and documents for interview bookings
          </AppText>
        </Section>

        {/* Personal Info Card */}
        <Section>
          <Card style={[styles.card, shadows.card as any]}>
            <View style={styles.cardHeader}>
              <Ionicons name="person-outline" size={20} color={colors.textTertiary} />
              <Heading level={2} style={styles.cardTitle}>Personal Information</Heading>
            </View>

            <View style={styles.inputGroup}>
              <Label style={styles.inputLabel}>
                <Ionicons name="person" size={14} color={colors.textSecondary} style={{ marginRight: 4 }} />
                Full Name *
              </Label>
              <Input
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter your full name"
                editable={!loading}
                style={styles.input}
              />
            </View>

            <View style={styles.inputGroup}>
              <Label style={styles.inputLabel}>
                <Ionicons name="mail" size={14} color={colors.textSecondary} style={{ marginRight: 4 }} />
                Email Address
              </Label>
              <View style={styles.lockedInput}>
                <Input
                  value={profile?.email || ''}
                  editable={false}
                  placeholder="you@example.com"
                  style={[styles.input, { opacity: 0.6 }]}
                />
                <View style={styles.lockBadge}>
                  <Ionicons name="lock-closed" size={12} color={colors.textTertiary} />
                  <AppText style={styles.lockText}>Verified</AppText>
                </View>
              </View>
              <AppText style={styles.inputHint}>
                Your email is verified and cannot be changed
              </AppText>
            </View>

            <View style={styles.inputGroup}>
              <Label style={styles.inputLabel}>
                <Ionicons name="call" size={14} color={colors.textSecondary} style={{ marginRight: 4 }} />
                Phone Number
              </Label>
              <Input
                value={phone}
                onChangeText={setPhone}
                placeholder="+91 98765 43210"
                keyboardType="phone-pad"
                editable={!loading}
                style={styles.input}
              />
              <AppText style={styles.inputHint}>
                Optional contact number for mentor coordination
              </AppText>
            </View>

            <View style={styles.inputGroup}>
              <Label style={styles.inputLabel}>
                <Ionicons name="briefcase" size={14} color={colors.textSecondary} style={{ marginRight: 4 }} />
                Target Profile
              </Label>
              <Input
                value={targetProfile}
                onChangeText={setTargetProfile}
                placeholder="e.g., Software Engineer, Product Manager"
                editable={!loading}
                style={styles.input}
              />
              <AppText style={styles.inputHint}>
                The role you're preparing to interview for
              </AppText>
            </View>
          </Card>
        </Section>

        {/* Documents & Links Card */}
        <Section>
          <Card style={[styles.card, shadows.card as any]}>
            <View style={styles.cardHeader}>
              <Ionicons name="document-text-outline" size={20} color={colors.textTertiary} />
              <Heading level={2} style={styles.cardTitle}>Documents & Links</Heading>
            </View>
            <AppText style={styles.cardDescription}>
              Share your resume and professional profile with mentors
            </AppText>

            {/* Resume Upload */}
            <View style={styles.inputGroup}>
              <Label style={styles.inputLabel}>
                <Ionicons name="document" size={14} color={colors.textSecondary} style={{ marginRight: 4 }} />
                Resume (PDF) *
              </Label>
              
              {resumeUrl ? (
                <View style={styles.uploadedFile}>
                  <View style={styles.filePreview}>
                    <View style={styles.fileIcon}>
                      <Ionicons name="document-text" size={24} color={colors.primary} />
                    </View>
                    <View style={styles.fileInfo}>
                      <AppText style={styles.fileName}>Resume.pdf</AppText>
                      <AppText style={styles.fileSize}>Uploaded successfully</AppText>
                    </View>
                  </View>
                  
                  <View style={styles.fileActions}>
                    <TouchableOpacity
                      style={styles.fileActionButton}
                      onPress={() => Alert.alert('Resume URL', resumeUrl)}
                    >
                      <Ionicons name="eye-outline" size={18} color={colors.primary} />
                      <AppText style={styles.fileActionText}>View</AppText>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[styles.fileActionButton, styles.fileActionDanger]}
                      onPress={() =>
                        Alert.alert(
                          'Remove Resume',
                          'Are you sure you want to remove your resume?',
                          [
                            { text: 'Cancel', style: 'cancel' },
                            {
                              text: 'Remove',
                              style: 'destructive',
                              onPress: () => setResumeUrl(''),
                            },
                          ]
                        )
                      }
                    >
                      <Ionicons name="trash-outline" size={18} color={colors.error} />
                      <AppText style={[styles.fileActionText, { color: colors.error }]}>
                        Remove
                      </AppText>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={handlePickDocument}
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <ActivityIndicator color={colors.primary} />
                      <AppText style={styles.uploadingText}>Uploading...</AppText>
                    </>
                  ) : (
                    <>
                      <View style={styles.uploadIcon}>
                        <Ionicons name="cloud-upload-outline" size={32} color={colors.primary} />
                      </View>
                      <AppText style={styles.uploadText}>Upload Resume</AppText>
                      <AppText style={styles.uploadHint}>PDF format only • Max 5MB</AppText>
                    </>
                  )}
                </TouchableOpacity>
              )}
              
              <AppText style={styles.inputHint}>
                Your resume will be shared with mentors before sessions
              </AppText>
            </View>

            {/* LinkedIn */}
            <View style={styles.inputGroup}>
              <Label style={styles.inputLabel}>
                <Ionicons name="logo-linkedin" size={14} color="#0077b5" style={{ marginRight: 4 }} />
                LinkedIn Profile
              </Label>
              <View style={styles.linkedinInput}>
                <View style={styles.linkedinIcon}>
                  <Ionicons name="logo-linkedin" size={20} color="#0077b5" />
                </View>
                <Input
                  value={linkedinUrl}
                  onChangeText={setLinkedinUrl}
                  placeholder="https://linkedin.com/in/yourprofile"
                  keyboardType="url"
                  autoCapitalize="none"
                  style={[styles.input, { flex: 1 }]}
                  editable={!loading}
                />
              </View>
              <AppText style={styles.inputHint}>
                Optional: Mentors can review your professional background
              </AppText>
            </View>
          </Card>
        </Section>

        {/* Save Button */}
        <Section>
          <Button
            title={loading ? 'Saving Changes…' : 'Save Profile'}
            onPress={handleSave}
            disabled={loading}
            style={styles.saveButton}
          />
          <AppText style={styles.saveHint}>
            Remember to save your changes before leaving this page
          </AppText>
        </Section>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    alignItems: 'center',
  },
  headerIcon: {
    marginBottom: spacing.sm,
  },
  headerSub: {
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },

  card: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  cardTitle: {
    fontSize: typography.size.lg,
  },
  cardDescription: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },

  inputGroup: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  input: {
    marginTop: 0,
  },
  inputHint: {
    fontSize: typography.size.xs,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },

  lockedInput: {
    position: 'relative',
  },
  lockBadge: {
    position: 'absolute',
    right: spacing.md,
    top: '50%',
    transform: [{ translateY: -10 }],
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16,185,129,0.1)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 999,
  },
  lockText: {
    fontSize: typography.size.xs,
    color: colors.success,
    fontWeight: '600',
  },

  uploadButton: {
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: borderRadius.md,
    padding: spacing.xl,
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
  },
  uploadIcon: {
    marginBottom: spacing.sm,
  },
  uploadText: {
    fontSize: typography.size.md,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  uploadHint: {
    fontSize: typography.size.xs,
    color: colors.textTertiary,
  },
  uploadingText: {
    marginTop: spacing.sm,
    color: colors.primary,
  },

  uploadedFile: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    backgroundColor: 'rgba(14,147,132,0.05)',
  },
  filePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  fileIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(14,147,132,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: typography.size.md,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  fileSize: {
    fontSize: typography.size.xs,
    color: colors.success,
  },
  fileActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  fileActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  fileActionDanger: {
    borderColor: 'rgba(239,68,68,0.3)',
    backgroundColor: 'rgba(239,68,68,0.05)',
  },
  fileActionText: {
    fontSize: typography.size.sm,
    fontWeight: '600',
    color: colors.primary,
  },

  linkedinInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  linkedinIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    backgroundColor: 'rgba(0,119,181,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  saveButton: {
    marginTop: spacing.sm,
  },
  saveHint: {
    marginTop: spacing.sm,
    fontSize: typography.size.xs,
    color: colors.textTertiary,
    textAlign: 'center',
  },
});