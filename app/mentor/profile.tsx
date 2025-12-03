// app/mentor/profile.tsx
import { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/lib/store';
import { supabase } from '@/lib/supabase/client';

import { colors, spacing, borderRadius, typography, shadows } from '@/lib/theme';
import { Heading, AppText, Section, Card, Button, Input, ScreenBackground, Label } from '@/lib/ui';
import { NotificationBanner } from '@/lib/ui/NotificationBanner';

// Updated to match your DB Schema
type MentorRow = {
  id: string; // This is the PK and FK to profiles(id)
  professional_title: string | null;
  years_of_experience: number | null; 
  profile_ids: number[] | null; // Integer array for expertise IDs
  session_price_inr: number | null;    
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
  
  // 1. Price State
  const [sessionPrice, setSessionPrice] = useState('');

  // 2. Expertise State
  const [availableProfiles, setAvailableProfiles] = useState<InterviewProfile[]>([]);
  const [selectedProfiles, setSelectedProfiles] = useState<number[]>([]);

  // 3. Public Profile State
  const [professionalTitle, setProfessionalTitle] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');

  const [banner, setBanner] = useState<BannerState>(null);

  useEffect(() => {
    if (!profile?.id) return;

    let mounted = true;

    (async () => {
      try {
        setLoading(true);

        // A. Load mentor row
        // Query by 'id' which matches the user's profile.id
        const { data: mentor, error: mentorError } = await supabase
          .from('mentors')
          .select('id, professional_title, years_of_experience, profile_ids, session_price_inr')
          .eq('id', profile.id) 
          .maybeSingle();

        if (mentorError) {
          console.log('[mentor/profile] load mentor error', mentorError);
          // Don't show error banner yet, user might just be new
        } 
        
        if (mentor && mounted) {
          const m = mentor as MentorRow;
          
          setProfessionalTitle(m.professional_title ?? '');
          setYearsOfExperience(m.years_of_experience != null ? String(m.years_of_experience) : '');
          setSelectedProfiles(m.profile_ids ?? []);
          setSessionPrice(m.session_price_inr != null ? String(m.session_price_inr) : '');
        }

        // B. Load available interview profiles
        const { data: profilesData, error: profilesError } = await supabase
          .from('interview_profiles_admin')
          .select('id, name')
          .order('name', { ascending: true });

        if (profilesError) {
          console.log('[mentor/profile] load interview_profiles_admin error', profilesError);
        } else if (profilesData && mounted) {
          setAvailableProfiles(profilesData as InterviewProfile[]);
        }
      } catch (e) {
        console.log('[mentor/profile] unexpected error', e);
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
    console.log('[handleSave] Starting save process...');
    
    if (!profile?.id) {
      console.error('[handleSave] No profile ID found in store.');
      setBanner({ type: 'error', message: 'User session not found.' });
      return;
    }

    // Validation inputs
    const yrsInput = yearsOfExperience.trim();
    const priceInput = sessionPrice.trim();
    console.log('[handleSave] Raw inputs:', { yrsInput, priceInput, professionalTitle, selectedProfiles });

    const yrs = yrsInput ? Number(yrsInput) : null;
    const price = priceInput ? Number(priceInput) : null;

    if (yrs != null && (isNaN(yrs) || yrs < 0 || yrs > 60)) {
      console.warn('[handleSave] Invalid years of experience:', yrs);
      setBanner({ type: 'error', message: 'Enter a valid years of experience (0-60).' });
      return;
    }
    
    if (price != null && (isNaN(price) || price < 0)) {
        console.warn('[handleSave] Invalid price:', price);
        setBanner({ type: 'error', message: 'Price cannot be negative.' });
        return;
    }

    try {
      setSaving(true);

      const payload = {
        id: profile.id, // The PK is the user's ID
        professional_title: professionalTitle.trim() || null,
        years_of_experience: yrs,
        profile_ids: selectedProfiles,
        session_price_inr: price,
        updated_at: new Date(),
      };

      console.log('[handleSave] Sending upsert payload to Supabase:', payload);

      // Upsert: Create or Update based on 'id'
      const { data, error } = await supabase
        .from('mentors')
        .upsert(payload)
        .select(); // Selecting returned data can help verify the write

      if (error) {
        console.error('[handleSave] Supabase upsert error:', error);
        setBanner({ type: 'error', message: 'Could not save profile: ' + error.message });
      } else {
        console.log('[handleSave] Success! Returned data:', data);
        setBanner({ type: 'success', message: 'Profile saved successfully.' });
      }
    } catch (e: any) {
      console.error('[handleSave] Unexpected exception:', e);
      setBanner({ type: 'error', message: 'Unexpected error while saving: ' + e.message });
    } finally {
      setSaving(false);
      console.log('[handleSave] Process finished.');
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
      <NotificationBanner
        key={banner ? `${banner.type}-${banner.message}` : 'no-banner'}
        visible={!!banner}
        type={banner?.type ?? 'success'}
        message={banner?.message ?? ''}
        onHide={() => setBanner(null)}
      />
      
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }}>
        {/* Header */}
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
            <AppText style={styles.cardDescription}>
              Set your fee for a complete mock interview booking (includes 2 sessions).
            </AppText>

            <View style={styles.inputGroup}>
              <Label style={styles.inputLabel}>Price per Booking (INR)</Label>
              <View style={styles.currencyInputContainer}>
                <AppText style={styles.currencySymbol}>₹</AppText>
                <Input
                  value={sessionPrice}
                  onChangeText={setSessionPrice}
                  keyboardType="number-pad"
                  placeholder="e.g. 2000"
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

        {/* Save Button */}
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
    borderRadius: borderRadius.full, // Pill shape
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