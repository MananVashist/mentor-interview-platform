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
  total_sessions: number | null;
  average_rating: number | null;
  bank_details: {
    holder_name?: string;
    account_number?: string;
    ifsc_code?: string;
  } | null;
};

type InterviewProfile = {
  id: number;
  name: string;
  is_active: boolean;
};

export default function MentorProfileScreen() {
  const { profile } = useAuthStore();
  const { showNotification } = useNotification();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [sessionPrice, setSessionPrice] = useState('1000');
  const [availableProfiles, setAvailableProfiles] = useState<InterviewProfile[]>([]);
  const [selectedProfiles, setSelectedProfiles] = useState<number[]>([]);
  const [professionalTitle, setProfessionalTitle] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  
  // Stats
  const [totalSessions, setTotalSessions] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  
  // Bank Details
  const [accountHolderName, setAccountHolderName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');

  useEffect(() => {
    if (!profile?.id) return;
    let mounted = true;

    (async () => {
      try {
        setLoading(true);

        const { data: mentor } = await supabase
          .from('mentors')
          .select('id, professional_title, years_of_experience, profile_ids, session_price_inr, total_sessions, average_rating, bank_details')
          .eq('id', profile.id) 
          .maybeSingle();
        
        if (mentor && mounted) {
          const m = mentor as MentorRow;
          setProfessionalTitle(m.professional_title ?? '');
          setYearsOfExperience(m.years_of_experience != null ? String(m.years_of_experience) : '');
          setSelectedProfiles(m.profile_ids ?? []);
          setTotalSessions(m.total_sessions ?? 0);
          setAverageRating(m.average_rating ?? 0);
          
          // Load bank details
          if (m.bank_details) {
            setAccountHolderName(m.bank_details.holder_name ?? '');
            setAccountNumber(m.bank_details.account_number ?? '');
            setIfscCode(m.bank_details.ifsc_code ?? '');
          }
          
          if (m.session_price_inr != null) {
            setSessionPrice(String(m.session_price_inr));
          } else {
            setSessionPrice('1000');
          }
        }

        const { data: profilesData } = await supabase
          .from('interview_profiles_admin') 
          .select('id, name, is_active')
          .eq('is_active', true)
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
      showNotification('Please enter a session price.', 'error');
      return;
    }

    // Prepare bank details object
    const bankDetailsObj: any = {};
    const holderTrimmed = accountHolderName.trim();
    const accountTrimmed = accountNumber.trim();
    const ifscTrimmed = ifscCode.trim();

    if (holderTrimmed || accountTrimmed || ifscTrimmed) {
      if (holderTrimmed) bankDetailsObj.holder_name = holderTrimmed;
      if (accountTrimmed) bankDetailsObj.account_number = accountTrimmed;
      if (ifscTrimmed) bankDetailsObj.ifsc_code = ifscTrimmed.toUpperCase();
    }

    try {
      setSaving(true);

      const payload: any = {
        professional_title: professionalTitle.trim() || null,
        years_of_experience: yrs,
        profile_ids: selectedProfiles,
        session_price_inr: price,
        updated_at: new Date(),
      };

      // Only include bank_details if there's data
      if (Object.keys(bankDetailsObj).length > 0) {
        payload.bank_details = bankDetailsObj;
      }

      const { error } = await supabase
        .from('mentors')
        .update(payload)
        .eq('id', profile.id);

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

        {/* STATS CARD */}
        <Section>
          <Card style={[styles.statsCard, shadows.card as any]}>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <Ionicons name="star" size={24} color="#F59E0B" />
                </View>
                <View style={styles.statContent}>
                  <AppText style={styles.statValue}>
                    {averageRating > 0 ? averageRating.toFixed(1) : 'N/A'}
                  </AppText>
                  <AppText style={styles.statLabel}>Average Rating</AppText>
                </View>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <Ionicons name="trophy" size={24} color={colors.primary} />
                </View>
                <View style={styles.statContent}>
                  <AppText style={styles.statValue}>{totalSessions}</AppText>
                  <AppText style={styles.statLabel}>
                    {totalSessions === 1 ? 'Session' : 'Sessions'} Completed
                  </AppText>
                </View>
              </View>
            </View>
          </Card>
        </Section>

        {/* SECTION 1: PRICE SETTING */}
        <Section>
          <Card style={[styles.card, shadows.card as any]}>
            <View style={styles.cardHeader}>
              <Ionicons name="cash-outline" size={20} color={colors.primary} />
              <Heading level={2} style={styles.cardTitle}>Pricing</Heading>
            </View>
            
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

        {/* SECTION 2: BANK DETAILS */}
        <Section>
          <Card style={[styles.card, shadows.card as any]}>
            <View style={styles.cardHeader}>
              <Ionicons name="card-outline" size={20} color={colors.primary} />
              <Heading level={2} style={styles.cardTitle}>Bank Details</Heading>
            </View>
            
            <AppText style={styles.cardDescription}>
              Add your bank account details to receive payouts.
            </AppText>

            <View style={styles.inputGroup}>
              <Label style={styles.inputLabel}>Account Holder Name</Label>
              <Input
                value={accountHolderName}
                onChangeText={setAccountHolderName}
                placeholder="e.g., Rahul Verma"
                style={styles.input}
              />
            </View>

            <View style={styles.inputGroup}>
              <Label style={styles.inputLabel}>Account Number</Label>
              <Input
                value={accountNumber}
                onChangeText={setAccountNumber}
                keyboardType="number-pad"
                placeholder="e.g., 12345678901234"
                style={styles.input}
              />
            </View>

            <View style={styles.inputGroup}>
              <Label style={styles.inputLabel}>IFSC Code</Label>
              <Input
                value={ifscCode}
                onChangeText={setIfscCode}
                placeholder="e.g., SBIN0001234"
                autoCapitalize="characters"
                style={styles.input}
              />
            </View>

            {(accountHolderName || accountNumber || ifscCode) && (
              <View style={styles.bankNotice}>
                <Ionicons name="shield-checkmark" size={14} color={colors.success} />
                <AppText style={styles.bankNoticeText}>
                  Bank details are securely encrypted
                </AppText>
              </View>
            )}
          </Card>
        </Section>

        {/* SECTION 3: INTERVIEW PROFILES */}
        <Section>
          <Card style={[styles.card, shadows.card as any]}>
            <View style={styles.cardHeader}>
              <Ionicons name="briefcase-outline" size={20} color={colors.primary} />
              <Heading level={2} style={styles.cardTitle}>Interview Profiles</Heading>
            </View>
            
            <AppText style={styles.cardDescription}>
              Select the domains you can mentor in. Candidates will see you when searching for these profiles.
            </AppText>

            {availableProfiles.length === 0 ? (
              <AppText style={styles.emptyText}>No profiles available</AppText>
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
                        selected && styles.profileCardSelected
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

        {/* SECTION 4: PRIVATE DETAILS */}
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

        {/* SECTION 5: PUBLIC PROFILE */}
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
  
  // Stats Card
  statsCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(14,147,132,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: typography.size.xl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: typography.size.xs,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
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

  // Bank Notice
  bankNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
    backgroundColor: '#f0fdf4',
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  bankNoticeText: {
    fontSize: typography.size.xs,
    color: colors.success,
    flex: 1,
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