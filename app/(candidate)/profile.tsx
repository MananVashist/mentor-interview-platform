// app/(candidate)/profile.tsx
// Restyled to use theme + ui primitives. Original business logic preserved.
import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';

import { colors, spacing, borderRadius, typography } from '@/lib/theme';
import { Heading, AppText, Label, Input, Button, Card, Section } from '@/lib/ui';
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.full_name, profile?.phone, candidateProfile?.linkedin_url, candidateProfile?.target_profile, candidateProfile?.resume_url]);

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
        await new Promise(resolve => setTimeout(resolve, 1200));
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
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      {/* Header */}
      <Section style={styles.header}>
        <Heading>My Profile</Heading>
        <AppText style={styles.headerSub}>Manage your details and documents</AppText>
      </Section>

      {/* Personal Info */}
      <Section>
        <Card style={styles.card}>
          <Heading style={styles.cardTitle}>Personal Information</Heading>

          <View style={styles.group}>
            <Label>Full Name *</Label>
            <Input
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your full name"
              editable={!loading}
            />
          </View>

          <View style={styles.group}>
            <Label>Email</Label>
            <Input
              value={profile?.email || ''}
              editable={false}
              placeholder="you@example.com"
            />
            <AppText style={styles.help}>Email cannot be changed</AppText>
          </View>

          <View style={styles.group}>
            <Label>Phone Number</Label>
            <Input
              value={phone}
              onChangeText={setPhone}
              placeholder="+91 98765 43210"
              keyboardType="phone-pad"
              editable={!loading}
            />
          </View>

          <View style={styles.group}>
            <Label>Target Profile</Label>
            <Input
              value={targetProfile}
              onChangeText={setTargetProfile}
              placeholder="e.g., Software Engineer, Product Manager"
              editable={!loading}
            />
            <AppText style={styles.help}>The role you're interviewing for</AppText>
          </View>
        </Card>
      </Section>

      {/* Docs & Links */}
      <Section>
        <Card style={styles.card}>
          <Heading style={styles.cardTitle}>Documents & Links</Heading>

          {/* Resume */}
          <View style={styles.group}>
            <Label>Resume (PDF) *</Label>
            {resumeUrl ? (
              <View style={styles.uploadedRow}>
                <View style={styles.fileInfo}>
                  <Ionicons name="document-text" size={22} color={colors.accent} />
                  <AppText style={styles.fileName}>Resume.pdf</AppText>
                </View>
                <View style={styles.fileActions}>
                  <Button
                    title="View"
                    variant="outline"
                    onPress={() => Alert.alert('Resume URL', resumeUrl)}
                    style={{ paddingHorizontal: spacing.md, paddingVertical: 10 }}
                  />
                  <Button
                    title="Remove"
                    variant="ghost"
                    onPress={() =>
                      Alert.alert('Remove Resume', 'Remove the uploaded resume?', [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Remove', style: 'destructive', onPress: () => setResumeUrl('') },
                      ])
                    }
                    left={<Ionicons name="trash-outline" size={18} color={colors.error} />}
                    textStyle={{ color: colors.error }}
                    style={{ paddingHorizontal: spacing.md, paddingVertical: 10 }}
                  />
                </View>
              </View>
            ) : (
              <Button
                title={uploading ? 'Uploading…' : 'Upload Resume'}
                onPress={handlePickDocument}
                disabled={uploading}
                left={!uploading ? <Ionicons name="cloud-upload-outline" size={20} color={colors.CTA_TEXT} /> : undefined}
              />
            )}
            <AppText style={styles.help}>Your resume will be shared with mentors (PDF only)</AppText>
          </View>

          {/* LinkedIn */}
          <View style={styles.group}>
            <Label>LinkedIn Profile</Label>
            <View style={styles.row}>
              <Ionicons name="logo-linkedin" size={20} color="#0077b5" />
              <View style={{ width: spacing.sm }} />
              <Input
                value={linkedinUrl}
                onChangeText={setLinkedinUrl}
                placeholder="https://linkedin.com/in/yourprofile"
                keyboardType="url"
                autoCapitalize="none"
                style={{ flex: 1 }}
                editable={!loading}
              />
            </View>
            <AppText style={styles.help}>Mentors can view your professional background</AppText>
          </View>
        </Card>
      </Section>

      {/* Save */}
      <Section>
        <Card style={styles.card}>
          <Button
            title={loading ? 'Saving…' : 'Save Changes'}
            onPress={handleSave}
            disabled={loading}
          />
        </Card>
      </Section>
      <View style={{ height: spacing.xl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingTop: spacing.lg, paddingBottom: spacing.md },
  headerSub: { color: colors.textSecondary, marginTop: spacing.xs },

  card: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  cardTitle: {
    fontSize: typography.size.lg,
    marginBottom: spacing.md,
  },

  group: { marginBottom: spacing.md },
  help: { color: colors.textTertiary, marginTop: spacing.xs },

  uploadedRow: {
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    backgroundColor: colors.backgroundSecondary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  fileInfo: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  fileName: { fontWeight: '600' },
  fileActions: { flexDirection: 'row', gap: spacing.sm },

  row: { flexDirection: 'row', alignItems: 'center' },
});
