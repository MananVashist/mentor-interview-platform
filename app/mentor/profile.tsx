// app/mentor/profile.tsx
import { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/lib/store';
import { supabase } from '@/lib/supabase/client';

import { colors, spacing, borderRadius, typography, shadows } from '@/lib/theme';
import { Heading, AppText, Section, Card, Button, Input, ScreenBackground, Label } from '@/lib/ui';
import { NotificationBanner } from '@/lib/ui/NotificationBanner';

type MentorRow = {
  id: string;
  profile_id: string;
  professional_title: string | null;
  experience_description: string | null;
  years_of_experience: number | null;
  bio: string | null;
  profile_ids: number[] | null; // <--- This now exists in the DB
};

type InterviewProfile = {
  id: number;
  name: string;
};

type BannerState = { type: 'success' | 'error'; message: string } | null;

export default function MentorProfileScreen() {
  const { profile } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mentorId, setMentorId] = useState<string | null>(null);

  // PUBLIC (shown to candidates)
  const [professionalTitle, setProfessionalTitle] = useState('');
  const [experienceDescription, setExperienceDescription] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');

  // Optional internal bio
  const [bio, setBio] = useState('');

  // Interview profiles selection
  const [availableProfiles, setAvailableProfiles] = useState<InterviewProfile[]>([]);
  const [selectedProfiles, setSelectedProfiles] = useState<number[]>([]);

  // Slider banner
  const [banner, setBanner] = useState<BannerState>(null);

  useEffect(() => {
    if (!profile?.id) return;

    let mounted = true;

    (async () => {
      try {
        setLoading(true);

        // 1) Load mentor row - We now SELECT the new profile_ids column
        const { data: mentor, error: mentorError } = await supabase
          .from('mentors')
          .select('id, professional_title, experience_description, years_of_experience, bio, profile_ids')
          .eq('profile_id', profile.id)
          .maybeSingle();

        if (mentorError) {
          console.log('[mentor/profile] load mentor error', mentorError);
          if (mounted) {
            setBanner({
              type: 'error',
              message: 'Failed to load mentor settings.',
            });
          }
        } else if (mentor && mounted) {
          const m = mentor as MentorRow;
          setMentorId(m.id);
          setProfessionalTitle(m.professional_title ?? '');
          setExperienceDescription(m.experience_description ?? '');
          setYearsOfExperience(
            m.years_of_experience != null ? String(m.years_of_experience) : ''
          );
          setBio(m.bio ?? '');
          setSelectedProfiles(m.profile_ids ?? []); // Load the array of IDs
        }

        // 2) Load available interview profiles (from the ADMIN table)
        const { data: profilesData, error: profilesError } = await supabase
          .from('interview_profiles_admin') // Use the table that exists
          .select('id, name')
          .order('name', { ascending: true });

        if (profilesError) {
          console.log('[mentor/profile] load interview_profiles_admin error', profilesError);
        } else if (profilesData && mounted) {
          setAvailableProfiles(profilesData as InterviewProfile[]);
        }
      } catch (e) {
        console.log('[mentor/profile] unexpected error', e);
        if (mounted) {
          setBanner({
            type: 'error',
            message: 'Something went wrong while loading your profile.',
          });
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [profile?.id]);

  const toggleProfile = (id: number) => {
    setSelectedProfiles((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    if (!mentorId) return;

    const yrs = yearsOfExperience.trim()
      ? Number(yearsOfExperience.trim())
      : null;

    if (yrs != null && (isNaN(yrs) || yrs < 0 || yrs > 60)) {
      setBanner({
        type: 'error',
        message: 'Enter a valid years of experience between 0 and 60.',
      });
      return;
    }

    try {
      setSaving(true);

      // Convert selected profile IDs to names for booking compatibility
      const expertiseProfileNames = availableProfiles
        .filter(p => selectedProfiles.includes(p.id))
        .map(p => p.name);

      const { error } = await supabase
        .from('mentors')
        .update({
          professional_title: professionalTitle.trim() || null,
          experience_description: experienceDescription.trim() || null,
          years_of_experience: yrs,
          bio: bio.trim() || null,
          profile_ids: selectedProfiles,
          expertise_profiles: expertiseProfileNames, // Also store names for booking flow
        })
        .eq('id', mentorId);

      if (error) {
        console.log('[mentor/profile] save error', error);
        setBanner({
          type: 'error',
          message: 'Could not save profile. Please try again.',
        });
      } else {
        setBanner({
          type: 'success',
          message: 'Profile details saved successfully.',
        });
      }
    } catch (e) {
      console.log('[mentor/profile] unexpected save error', e);
      setBanner({
        type: 'error',
        message: 'Unexpected error while saving profile.',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ScreenBackground>
        <NotificationBanner
          visible={!!banner}
          type={banner?.type}
          message={banner?.message ?? ''}
          onHide={() => setBanner(null)}
        />
        <Section style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={colors.primary} size="large" />
          <AppText style={{ marginTop: spacing.md, color: colors.textSecondary, fontSize: typography.size.md }}>
            Loading your profile…
          </AppText>
        </Section>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground>
      <NotificationBanner
        visible={!!banner}
        type={banner?.type}
        message={banner?.message ?? ''}
        onHide={() => setBanner(null)}
      />
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }}>
        {/* Header */}
        <Section style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons name="person-circle-outline" size={32} color={colors.primary} />
          </View>
          <Heading level={1}>My Mentor Profile</Heading>
          <AppText style={styles.headerSub}>
            Manage your professional information and expertise
          </AppText>
        </Section>

        {/* Private identity card */}
        <Section>
          <Card style={[styles.card, shadows.card as any]}>
            <View style={styles.cardHeader}>
              <Ionicons name="lock-closed" size={20} color={colors.textTertiary} />
              <Heading level={2} style={styles.cardTitle}>Private Information</Heading>
            </View>
            <AppText style={styles.cardDescription}>
              Your real name and email are for internal use only and never shown to candidates.
            </AppText>

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="person-outline" size={18} color={colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <AppText style={styles.infoLabel}>Full Name</AppText>
                <AppText style={styles.infoValue}>{profile?.full_name || 'Mentor'}</AppText>
              </View>
            </View>

            {profile?.email && (
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Ionicons name="mail-outline" size={18} color={colors.primary} />
                </View>
                <View style={styles.infoContent}>
                  <AppText style={styles.infoLabel}>Email Address</AppText>
                  <AppText style={styles.infoValue}>{profile.email}</AppText>
                </View>
              </View>
            )}

            <View style={styles.privacyNotice}>
              <Ionicons name="shield-checkmark" size={16} color={colors.success} />
              <AppText style={styles.privacyText}>
                This information is kept private and secure
              </AppText>
            </View>
          </Card>
        </Section>

        {/* Public profile card */}
        <Section>
          <Card style={[styles.card, shadows.card as any]}>
            <View style={styles.cardHeader}>
              <Ionicons name="eye-outline" size={20} color={colors.textTertiary} />
              <Heading level={2} style={styles.cardTitle}>Public Profile</Heading>
            </View>
            <AppText style={styles.cardDescription}>
              This information is visible to candidates browsing mentors
            </AppText>

            <View style={styles.inputGroup}>
              <Label style={styles.inputLabel}>
                <Ionicons name="briefcase-outline" size={14} color={colors.textSecondary} style={{ marginRight: 4 }} />
                Professional Title
              </Label>
              <Input
                value={professionalTitle}
                onChangeText={setProfessionalTitle}
                placeholder="e.g., Senior Engineering Manager at Google"
                style={styles.input}
              />
              <AppText style={styles.inputHint}>
                Your current role and company
              </AppText>
            </View>

            <View style={styles.inputGroup}>
              <Label style={styles.inputLabel}>
                <Ionicons name="document-text-outline" size={14} color={colors.textSecondary} style={{ marginRight: 4 }} />
                About You
              </Label>
              <Input
                value={experienceDescription}
                onChangeText={setExperienceDescription}
                placeholder="Describe your interview expertise and how you help candidates succeed..."
                style={[styles.input, styles.textarea]}
                multiline
                numberOfLines={4}
              />
              <AppText style={styles.inputHint}>
                What makes you a great mentor? What's your interview style?
              </AppText>
            </View>

            <View style={styles.inputGroup}>
              <Label style={styles.inputLabel}>
                <Ionicons name="time-outline" size={14} color={colors.textSecondary} style={{ marginRight: 4 }} />
                Years of Experience
              </Label>
              <Input
                value={yearsOfExperience}
                onChangeText={setYearsOfExperience}
                keyboardType="number-pad"
                placeholder="e.g., 10"
                style={[styles.input, { maxWidth: 120 }]}
              />
            </View>

            <View style={styles.inputGroup}>
              <Label style={styles.inputLabel}>
                <Ionicons name="create-outline" size={14} color={colors.textSecondary} style={{ marginRight: 4 }} />
                Internal Notes (Optional)
              </Label>
              <Input
                value={bio}
                onChangeText={setBio}
                placeholder="Additional background notes for your own reference..."
                style={[styles.input, styles.textarea]}
                multiline
                numberOfLines={3}
              />
              <AppText style={styles.inputHint}>
                Private notes, not shown to candidates
              </AppText>
            </View>
          </Card>
        </Section>

        {/* Interview profiles card */}
        <Section>
          <Card style={[styles.card, shadows.card as any]}>
            <View style={styles.cardHeader}>
              <Ionicons name="checkmark-circle-outline" size={20} color={colors.textTertiary} />
              <Heading level={2} style={styles.cardTitle}>Interview Expertise</Heading>
            </View>
            <AppText style={styles.cardDescription}>
              Select the roles you can conduct mock interviews for. Candidates will find you when searching for these profiles.
            </AppText>

            {availableProfiles.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="albums-outline" size={32} color={colors.textTertiary} />
                <AppText style={styles.emptyText}>
                  No interview profiles available yet. Contact the CrackJobs team to get set up.
                </AppText>
              </View>
            ) : (
              <View style={styles.profilesGrid}>
                {availableProfiles.map((p) => {
                  const selected = selectedProfiles.includes(p.id);
                  return (
                    <TouchableOpacity
                      key={p.id}
                      onPress={() => toggleProfile(p.id)}
                      style={[
                        styles.profileCard,
                        selected && styles.profileCardSelected,
                      ]}
                    >
                      <View style={styles.profileCardContent}>
                        <View style={[
                          styles.profileCheckbox,
                          selected && styles.profileCheckboxSelected
                        ]}>
                          {selected && (
                            <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                          )}
                        </View>
                        <AppText style={[
                          styles.profileName,
                          selected && styles.profileNameSelected
                        ]}>
                          {p.name}
                        </AppText>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            <View style={styles.profilesFooter}>
              <Ionicons name="information-circle-outline" size={16} color={colors.textTertiary} />
              <AppText style={styles.profilesFooterText}>
                Select all profiles you're comfortable interviewing for
              </AppText>
            </View>
          </Card>
        </Section>

        {/* Save button */}
        <Section>
          <Button
            title={saving ? 'Saving Changes…' : 'Save Profile'}
            onPress={handleSave}
            disabled={saving || !mentorId}
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
    color: colors.textSecondary,
    fontSize: typography.size.sm,
    lineHeight: 20,
    marginBottom: spacing.md,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.md,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.md,
    marginTop: spacing.sm,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(14,147,132,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: typography.size.xs,
    color: colors.textTertiary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: typography.size.md,
    fontWeight: '600',
    color: colors.textPrimary,
  },

  privacyNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
    padding: spacing.sm,
    backgroundColor: 'rgba(16,185,192,0.08)',
    borderRadius: borderRadius.sm,
  },
  privacyText: {
    fontSize: typography.size.xs,
    color: colors.success,
    fontWeight: '500',
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
  textarea: {
    height: 100,
    paddingTop: spacing.sm,
  },
  inputHint: {
    fontSize: typography.size.xs,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },

  profilesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  profileCard: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background,
  },
  profileCardSelected: {
    backgroundColor: 'rgba(14,147,132,0.08)',
    borderColor: colors.primary,
  },
  profileCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  profileCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCheckboxSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  profileName: {
    fontSize: typography.size.sm,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  profileNameSelected: {
    color: colors.primary,
    fontWeight: '600',
  },

  profilesFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
    padding: spacing.sm,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.sm,
  },
  profilesFooterText: {
    flex: 1,
    fontSize: typography.size.xs,
    color: colors.textTertiary,
  },

  emptyState: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    marginTop: spacing.sm,
    color: colors.textSecondary,
    textAlign: 'center',
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