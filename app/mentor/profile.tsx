// app/mentor/profile.tsx
import { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/lib/store';
import { supabase } from '@/lib/supabase/client';

import { colors, spacing, borderRadius, typography, shadows } from '@/lib/theme';
import { Heading, AppText, Section, Card, Button, Input, ScreenBackground, Label } from '@/lib/ui';
import { useNotification } from '@/lib/ui/NotificationBanner';

type MentorRow = {
  id: string; 
  professional_title: string | null;
  years_of_experience: number | null; 
  profile_ids: number[] | null; 
  session_price_inr: number | null;    
};

type InterviewProfile = {
  id: number;
  name: string;
};

export default function MentorProfileScreen() {
  const { profile } = useAuthStore();
  const { showNotification } = useNotification();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // 1. Set default state to '1000'
  const [sessionPrice, setSessionPrice] = useState('1000');
  const [availableProfiles, setAvailableProfiles] = useState<InterviewProfile[]>([]);
  const [selectedProfiles, setSelectedProfiles] = useState<number[]>([]);
  const [professionalTitle, setProfessionalTitle] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  useEffect(() => {
    if (!profile?.id) return;
    let mounted = true;

    (async () => {
      try {
        setLoading(true);

        const { data: mentor } = await supabase
          .from('mentors')
          .select('id, professional_title, years_of_experience, profile_ids, session_price_inr')
          .eq('id', profile.id) 
          .maybeSingle();
        
        if (mentor && mounted) {
          const m = mentor as MentorRow;
          setProfessionalTitle(m.professional_title ?? '');
          setYearsOfExperience(m.years_of_experience != null ? String(m.years_of_experience) : '');
          setSelectedProfiles(m.profile_ids ?? []);
          
          // 2. Use DB value if exists, otherwise keep default '1000'
          if (m.session_price_inr != null) {
            setSessionPrice(String(m.session_price_inr));
          } else {
            setSessionPrice('1000');
          }
        }

        const { data: profilesData } = await supabase
          .from('interview_profiles_admin')
          .select('id, name')
          .order('name', { ascending: true });

        if (profilesData && mounted) {
          setAvailableProfiles(profilesData as InterviewProfile[]);
        }
      } catch (e) {
        console.log('[mentor/profile] unexpected error', e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [profile?.id]);

  const toggleProfile = (id: number) => {
    setSelectedProfiles((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    if (!profile?.id) {
      showNotification('User session not found.', 'error');
      return;
    }

    const yrsInput = yearsOfExperience.trim();
    const priceInput = sessionPrice.trim();
    const yrs = yrsInput ? Number(yrsInput) : null;
    const price = priceInput ? Number(priceInput) : null;

    if (yrs != null && (isNaN(yrs) || yrs < 0 || yrs > 60)) {
      showNotification('Enter a valid years of experience (0-60).', 'error');
      return;
    }
    
    // 3. Validation Logic for Price Range (500 - 2500)
    if (price !== null) {
      if (isNaN(price)) {
        showNotification('Price must be a valid number.', 'error');
        return;
      }
      if (price < 500 || price > 2500) {
        showNotification('Price must be between ₹500 and ₹2500.', 'error');
        return;
      }
    } else {
      // Optional: Prevent saving if price is empty? 
      // Assuming price is required based on context:
      showNotification('Please enter a session price.', 'error');
      return;
    }

    try {
      setSaving(true);

      const payload = {
        id: profile.id,
        professional_title: professionalTitle.trim() || null,
        years_of_experience: yrs,
        profile_ids: selectedProfiles,
        session_price_inr: price,
        updated_at: new Date(),
      };

      const { error } = await supabase
        .from('mentors')
        .upsert(payload);

      if (error) {
        showNotification('Could not save profile: ' + error.message, 'error');
      } else {
        showNotification('Profile saved successfully.', 'success');
      }
    } catch (e: any) {
      showNotification('Unexpected error while saving: ' + e.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ScreenBackground>
        <Section style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={colors.primary} size="large" />
        </Section>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }}>
        <Section style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons name="settings-outline" size={32} color={colors.primary} />
          </View>
          <Heading level={1}>My profile</Heading>
        </Section>

        {/* SECTION 1: PRICE SETTING */}
        <Section>
          <Card style={[styles.card, shadows.card as any]}>
            <View style={styles.cardHeader}>
              <Ionicons name="cash-outline" size={20} color={colors.primary} />
              <Heading level={2} style={styles.cardTitle}>Pricing</Heading>
            </View>
            
            {/* 4. Updated Description Text */}
            <AppText style={styles.cardDescription}>
              Set your fee for a complete mock interview session. Range: ₹500 - ₹2500.
            </AppText>

            <View style={styles.inputGroup}>
              <Label style={styles.inputLabel}>Price per Session (INR)</Label>
              <View style={styles.currencyInputContainer}>
                <AppText style={styles.currencySymbol}>₹</AppText>
                <Input
                  value={sessionPrice}
                  onChangeText={setSessionPrice}
                  keyboardType="number-pad"
                  placeholder="e.g. 1000"
                  style={styles.currencyInput}
                />
              </View>
            </View>
          </Card>
        </Section>

        {/* SECTION 2: INTERVIEW EXPERTISE */}
        <Section>
          <Card style={[styles.card, shadows.card as any]}>
            <View style={styles.cardHeader}>
              <Ionicons name="ribbon-outline" size={20} color={colors.primary} />
              <Heading level={2} style={styles.cardTitle}>Interview Expertise</Heading>
            </View>
            <AppText style={styles.cardDescription}>
              Select the roles you are qualified to interview.
            </AppText>

            {availableProfiles.length === 0 ? (
              <AppText style={styles.emptyText}>No profiles loaded.</AppText>
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
          </Card>
        </Section>

        {/* SECTION 3: PRIVATE DETAILS */}
        <Section>
          <Card style={[styles.card, shadows.card as any]}>
            <View style={styles.cardHeader}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.textTertiary} />
              <Heading level={2} style={styles.cardTitle}>Private Details</Heading>
            </View>
            
            <View style={styles.infoRow}>
                <View style={styles.infoContent}>
                <AppText style={styles.infoLabel}>Full Name</AppText>
                <AppText style={styles.infoValue}>{profile?.full_name || 'Mentor'}</AppText>
                </View>
            </View>

            {profile?.email && (
                <View style={styles.infoRow}>
                <View style={styles.infoContent}>
                    <AppText style={styles.infoLabel}>Email</AppText>
                    <AppText style={styles.infoValue}>{profile.email}</AppText>
                </View>
                </View>
            )}

            <View style={styles.privacyNotice}>
               <Ionicons name="shield-checkmark" size={14} color={colors.success} />
               <AppText style={styles.privacyText}>
                 Not visible to candidates
               </AppText>
            </View>
          </Card>
        </Section>

        {/* SECTION 4: PUBLIC PROFILE */}
        <Section>
          <Card style={[styles.card, shadows.card as any]}>
            <View style={styles.cardHeader}>
              <Ionicons name="id-card-outline" size={20} color={colors.textTertiary} />
              <Heading level={2} style={styles.cardTitle}>Public Profile</Heading>
            </View>
            <AppText style={styles.cardDescription}>
               Basic information shown on your mentor card.
            </AppText>

            <View style={styles.inputGroup}>
              <Label style={styles.inputLabel}>Professional Title</Label>
              <Input
                value={professionalTitle}
                onChangeText={setProfessionalTitle}
                placeholder="e.g., Sr Product Manager at TechCorp"
                style={styles.input}
              />
            </View>

            <View style={styles.inputGroup}>
              <Label style={styles.inputLabel}>Years of Experience</Label>
              <Input
                value={yearsOfExperience}
                onChangeText={setYearsOfExperience}
                keyboardType="number-pad"
                placeholder="e.g., 8"
                style={[styles.input, { maxWidth: 100 }]}
              />
            </View>
          </Card>
        </Section>

        <Section>
          <Button
            title={saving ? 'Saving...' : 'Save Settings'}
            onPress={handleSave}
            disabled={saving}
            style={styles.saveButton}
          />
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
    backgroundColor: 'rgba(14,147,132,0.1)',
    width: 60, height: 60,
    borderRadius: 30,
    alignItems: 'center', justifyContent: 'center'
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
    marginBottom: spacing.md,
  },
  
  // Inputs
  inputGroup: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    marginBottom: spacing.xs,
    color: colors.textSecondary,
  },
  input: {
    marginTop: 0,
  },
  
  // Currency
  currencyInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: typography.size.lg,
    fontWeight: '600',
    color: colors.textPrimary,
    marginRight: spacing.sm,
  },
  currencyInput: {
    flex: 1,
    marginTop: 0,
  },

  // Info Rows (Private)
  infoRow: {
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.sm,
  },
  infoContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: typography.size.sm,
    color: colors.textTertiary,
  },
  infoValue: {
    fontSize: typography.size.md,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  privacyNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
    backgroundColor: '#f0fdf4',
    padding: spacing.xs,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start'
  },
  privacyText: {
    fontSize: typography.size.xs,
    color: colors.success,
  },

  // Profiles Grid
  profilesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  profileCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.full,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.background,
  },
  profileCardSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  profileCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  profileCheckbox: {
    display: 'none',
  },
  profileCheckboxSelected: {
    display: 'flex', 
  },
  profileName: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
  },
  profileNameSelected: {
    color: 'white',
    fontWeight: '600',
  },
  emptyText: {
    color: colors.textTertiary,
    fontStyle: 'italic',
  },

  saveButton: {
    marginTop: spacing.sm,
  },
});