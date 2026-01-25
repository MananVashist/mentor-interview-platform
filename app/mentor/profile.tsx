// app/mentor/profile.tsx
import { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/lib/store';
import { supabase } from '@/lib/supabase/client';

import { colors, spacing, borderRadius, typography, shadows } from '@/lib/theme';
import { Heading, AppText, Section, Card, Button, Input, ScreenBackground, Label } from '@/lib/ui';
import { useNotification } from '@/lib/ui/NotificationBanner';

type TierType = 'bronze' | 'silver' | 'gold';

type MentorRow = {
  id: string; 
  professional_title: string | null;
  years_of_experience: number | null; 
  profile_ids: number[] | null; 
  session_price_inr: number | null;
  total_sessions: number | null;
  average_rating: number | null;
  experience_description: string | null;
  tier: TierType | null;
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

type TierConfig = {
  tier: string;
  min_price: number;
  max_price: number;
  percentage_cut: number;
};

// UI Config for display/colors only
const TIER_UI = {
  bronze: { displayName: 'Bronze', color: '#CD7F32', bgColor: '#FEF2F2' },
  silver: { displayName: 'Silver', color: '#9CA3AF', bgColor: '#F8F9FA' },
  gold: { displayName: 'Gold', color: '#F59E0B', bgColor: '#FFFBEB' },
};

export default function MentorProfileScreen() {
  const { profile } = useAuthStore();
  const { showNotification } = useNotification();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Tier Logic
  const [tier, setTier] = useState<TierType>('bronze');
  const [tierConfigs, setTierConfigs] = useState<Record<string, TierConfig>>({});
  const [currentTierConfig, setCurrentTierConfig] = useState<TierConfig | null>(null);

  const [sessionPrice, setSessionPrice] = useState('');
  const [availableProfiles, setAvailableProfiles] = useState<InterviewProfile[]>([]);
  const [selectedProfiles, setSelectedProfiles] = useState<number[]>([]);
  const [professionalTitle, setProfessionalTitle] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [experienceDescription, setExperienceDescription] = useState('');
  
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

        // 1. Fetch Tier Configurations from DB
        const { data: tiersData } = await supabase.from('mentor_tiers').select('*');
        const tierMap: Record<string, TierConfig> = {};
        if (tiersData) {
            tiersData.forEach((t: any) => tierMap[t.tier] = t);
            if (mounted) setTierConfigs(tierMap);
        }

        const { data: mentor } = await supabase
          .from('mentors')
          .select('id, professional_title, years_of_experience, profile_ids, session_price_inr, total_sessions, average_rating, experience_description, tier, bank_details')
          .eq('id', profile.id) 
          .maybeSingle();
        
        if (mentor && mounted) {
          const m = mentor as MentorRow;
          const mentorTier = (m.tier || 'bronze') as TierType;
          setTier(mentorTier);

          // Set current config for easy access
          if (tierMap[mentorTier]) {
            setCurrentTierConfig(tierMap[mentorTier]);
          }
          
          setProfessionalTitle(m.professional_title ?? '');
          setYearsOfExperience(m.years_of_experience != null ? String(m.years_of_experience) : '');
          setSelectedProfiles(m.profile_ids ?? []);
          setTotalSessions(m.total_sessions ?? 0);
          setAverageRating(m.average_rating ?? 0);
          setExperienceDescription(m.experience_description ?? '');
          
          // Load bank details
          if (m.bank_details) {
            setAccountHolderName(m.bank_details.holder_name ?? '');
            setAccountNumber(m.bank_details.account_number ?? '');
            setIfscCode(m.bank_details.ifsc_code ?? '');
          }
          
          // Set price - use existing or tier min default
          if (m.session_price_inr != null) {
            setSessionPrice(String(m.session_price_inr));
          } else if (tierMap[mentorTier]) {
            setSessionPrice(String(tierMap[mentorTier].min_price));
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
    
    // ✅ VALIDATION FROM DB CONFIG
    if (!currentTierConfig) {
        showNotification('Tier configuration not loaded. Please refresh.', 'error');
        return;
    }
    
    if (price !== null) {
      if (isNaN(price)) {
        showNotification('Price must be a valid number.', 'error');
        return;
      }
      if (price < currentTierConfig.min_price || price > currentTierConfig.max_price) {
        showNotification(
          `Price must be between ₹${currentTierConfig.min_price.toLocaleString()} and ₹${currentTierConfig.max_price.toLocaleString()} for ${tier} tier.`,
          'error'
        );
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
        experience_description: experienceDescription.trim() || null,
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

  const tierUi = TIER_UI[tier] || TIER_UI.bronze;
  const basePrice = sessionPrice ? Number(sessionPrice) : (currentTierConfig?.min_price || 0);
  
  // Calculate display price using DB cut
  const percentageCut = currentTierConfig?.percentage_cut || 50;
  const candidatePrice = Math.round(basePrice / (1 - (percentageCut / 100)));

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }}>
        <Section style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons name="settings-outline" size={32} color={colors.primary} />
          </View>
          <Heading level={1}>My profile</Heading>
        </Section>

        {/* TIER BADGE */}
        <Section>
          <Card style={[styles.tierCard, { backgroundColor: tierUi.bgColor }]}>
            <View style={styles.tierContent}>
              <View style={[styles.tierBadge, { borderColor: tierUi.color }]}>
                <Ionicons name="ribbon" size={20} color={tierUi.color} />
                <AppText style={[styles.tierText, { color: tierUi.color }]}>
                  {tierUi.displayName} Tier
                </AppText>
              </View>
              {currentTierConfig && (
                <AppText style={styles.tierDescription}>
                    Price Range: ₹{currentTierConfig.min_price.toLocaleString()} - ₹{currentTierConfig.max_price.toLocaleString()}
                </AppText>
              )}
            </View>
          </Card>
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
              Set your base fee for a mock interview session. Your tier is {tierUi.displayName}.
            </AppText>

            <View style={styles.inputGroup}>
              <Label style={styles.inputLabel}>Your Base Price (INR)</Label>
              <View style={styles.currencyInputContainer}>
                <AppText style={styles.currencySymbol}>₹</AppText>
                <Input
                  value={sessionPrice}
                  onChangeText={setSessionPrice}
                  keyboardType="number-pad"
                  placeholder={String(currentTierConfig?.min_price || 0)}
                  style={styles.currencyInput}
                />
              </View>
              {currentTierConfig && (
                <AppText style={styles.priceHint}>
                    Range: ₹{currentTierConfig.min_price.toLocaleString()} - ₹{currentTierConfig.max_price.toLocaleString()}
                </AppText>
              )}
            </View>
          </Card>
        </Section>

        {/* SECTION 2: PROFILES */}
        <Section>
          <Card style={[styles.card, shadows.card as any]}>
            <View style={styles.cardHeader}>
              <Ionicons name="briefcase-outline" size={20} color={colors.primary} />
              <Heading level={2} style={styles.cardTitle}>Interview Profiles</Heading>
            </View>

            <AppText style={styles.cardDescription}>
              Select the types of interviews you can conduct.
            </AppText>

            <View style={styles.profilesGrid}>
              {availableProfiles.length === 0 ? (
                <AppText style={styles.emptyText}>No profiles available.</AppText>
              ) : (
                availableProfiles.map((p) => {
                  const isSelected = selectedProfiles.includes(p.id);
                  return (
                    <TouchableOpacity
                      key={p.id}
                      style={[styles.profileCard, isSelected && styles.profileCardSelected]}
                      onPress={() => toggleProfile(p.id)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.profileCardContent}>
                        <Ionicons
                          name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                          size={16}
                          color={isSelected ? 'white' : colors.textSecondary}
                          style={[
                            styles.profileCheckbox,
                            isSelected && styles.profileCheckboxSelected,
                          ]}
                        />
                        <AppText style={[styles.profileName, isSelected && styles.profileNameSelected]}>
                          {p.name}
                        </AppText>
                      </View>
                    </TouchableOpacity>
                  );
                })
              )}
            </View>
          </Card>
        </Section>

        {/* SECTION 3: BANK DETAILS */}
        <Section>
          <Card style={[styles.card, shadows.card as any]}>
            <View style={styles.cardHeader}>
              <Ionicons name="card-outline" size={20} color={colors.primary} />
              <Heading level={2} style={styles.cardTitle}>Bank Details</Heading>
            </View>

            <AppText style={styles.cardDescription}>
              For receiving payments. This information is kept private.
            </AppText>

            <View style={styles.inputGroup}>
              <Label style={styles.inputLabel}>Account Holder Name</Label>
              <Input
                value={accountHolderName}
                onChangeText={setAccountHolderName}
                placeholder="Full name as per bank account"
                style={styles.input}
              />
            </View>

            <View style={styles.inputGroup}>
              <Label style={styles.inputLabel}>Account Number</Label>
              <Input
                value={accountNumber}
                onChangeText={setAccountNumber}
                placeholder="Your bank account number"
                keyboardType="number-pad"
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

            <View style={styles.bankNotice}>
              <Ionicons name="shield-checkmark" size={16} color={colors.success} />
              <AppText style={styles.bankNoticeText}>
                Your banking details are stored securely and never shared with candidates.
              </AppText>
            </View>
          </Card>
        </Section>

        {/* SECTION 4: PROFESSIONAL INFO */}
        <Section>
          <Card style={[styles.card, shadows.card as any]}>
            <View style={styles.cardHeader}>
              <Ionicons name="person-outline" size={20} color={colors.primary} />
              <Heading level={2} style={styles.cardTitle}>Professional Information</Heading>
            </View>

            <AppText style={styles.cardDescription}>
              Help candidates understand your background. No personal details required.
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

            <View style={styles.inputGroup}>
              <Label style={styles.inputLabel}>About You</Label>
              <Input
                value={experienceDescription}
                onChangeText={setExperienceDescription}
                placeholder="Brief description of your background, expertise, and what candidates can expect from your mentorship..."
                multiline
                numberOfLines={4}
                style={[styles.input, styles.textArea]}
              />
              <AppText style={styles.charCount}>
                {experienceDescription.length} characters
              </AppText>
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
  
  // Tier Card
  tierCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
  },
  tierContent: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    backgroundColor: 'white',
  },
  tierText: {
    fontSize: typography.size.md,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  tierDescription: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    textAlign: 'center',
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
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: spacing.sm,
  },
  charCount: {
    fontSize: typography.size.xs,
    color: colors.textTertiary,
    marginTop: spacing.xs,
    textAlign: 'right',
  },
  priceHint: {
    fontSize: typography.size.xs,
    color: colors.textTertiary,
    marginTop: spacing.xs,
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

  // Price Breakdown
  priceBreakdown: {
    backgroundColor: '#F9FAFB',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownLabel: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
  },
  breakdownValue: {
    fontSize: typography.size.sm,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  breakdownTotal: {
    paddingTop: spacing.sm,
    marginTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  breakdownTotalLabel: {
    fontSize: typography.size.md,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  breakdownTotalValue: {
    fontSize: typography.size.lg,
    fontWeight: '800',
    color: colors.primary,
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