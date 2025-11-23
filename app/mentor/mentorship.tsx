// app/mentor/mentorship.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { useAuthStore } from '@/lib/store';
import { supabase } from '@/lib/supabase/client';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography, shadows } from '@/lib/theme';
import {
  Heading,
  AppText,
  Section,
  Card,
  Button,
  Input,
  ScreenBackground,
} from '@/lib/ui';
import { NotificationBanner } from '@/lib/ui/NotificationBanner';

// --- CONFIGURATION ---
const SLACK_INVITE_LINK = "https://join.slack.com/t/YOUR_WORKSPACE/shared_invite/zt-YOUR-TOKEN"; // Replace with real link
const LINKEDIN_SHARE_BASE = "https://www.linkedin.com/feed/?shareActive=true&text=";

type MentorRow = {
  id: string;
  profile_id: string;
  session_price_inr: number | null;
  bookings_count?: number;
  [key: string]: any;
};

type BannerState = { type: 'success' | 'error'; message: string } | null;

export default function MentorshipScreen() {
  const { profile } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mentor, setMentor] = useState<MentorRow | null>(null);
  const [priceInput, setPriceInput] = useState('');
  const [banner, setBanner] = useState<BannerState>(null);

  useEffect(() => {
    if (!profile?.id) return;

    let mounted = true;

    (async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from('mentors')
          .select('*') 
          .eq('profile_id', profile.id)
          .maybeSingle();

        if (error) {
          console.log('[mentorship] load mentor error', error);
          if (mounted) {
            setBanner({
              type: 'error',
              message: 'Failed to load mentorship settings.',
            });
          }
        } else if (data && mounted) {
          const m = data as MentorRow;
          setMentor(m);
          setPriceInput(
            m.session_price_inr != null ? String(m.session_price_inr) : ''
          );
        }
      } catch (e) {
        console.log('[mentorship] unexpected load error', e);
        if (mounted) {
          setBanner({
            type: 'error',
            message: 'Something went wrong while loading mentorship settings.',
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

  const handleSave = async () => {
    if (!mentor) return;

    const value = priceInput.trim() ? Number(priceInput.trim()) : NaN;

    if (isNaN(value) || value < 1000 || value > 10000) {
      setBanner({
        type: 'error',
        message: 'Set a price between ₹1,000 and ₹10,000 per booking.',
      });
      return;
    }

    try {
      setSaving(true);

      const { error } = await supabase
        .from('mentors')
        .update({
          session_price_inr: value,
          session_price: value,
        })
        .eq('id', mentor.id);

      if (error) {
        console.log('[mentorship] save error', error);
        setBanner({
          type: 'error',
          message: 'Could not save pricing. Please try again.',
        });
      } else {
        setMentor((m) => (m ? { ...m, session_price_inr: value } : m));
        setBanner({
          type: 'success',
          message: 'Pricing updated successfully.',
        });
      }
    } catch (e) {
      console.log('[mentorship] unexpected save error', e);
      setBanner({
        type: 'error',
        message: 'Unexpected error while saving pricing.',
      });
    } finally {
      setSaving(false);
    }
  };

  // --- AUTOMATION HANDLERS ---
  const handleClaim = (type: 'slack' | 'linkedin', tier: string) => {
      if (type === 'slack') {
          Linking.openURL(SLACK_INVITE_LINK).catch(() => Alert.alert("Error", "Could not open Slack. Please verify you have the app installed."));
      } else if (type === 'linkedin') {
          const text = `Excited to announce I've reached ${tier} Mentor status on CrackJobs! 🚀 #Mentorship #CareerGrowth`;
          const url = `${LINKEDIN_SHARE_BASE}${encodeURIComponent(text)}`;
          Linking.openURL(url).catch(() => Alert.alert("Error", "Could not open LinkedIn."));
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
          <AppText style={{ marginTop: spacing.md, color: colors.textSecondary }}>
            Loading mentorship settings…
          </AppText>
        </Section>
      </ScreenBackground>
    );
  }

  // Calculations
  const basePriceNum = priceInput.trim() ? Number(priceInput.trim()) : 0;
  const candidatePrice = basePriceNum > 0 ? Math.round(basePriceNum * 1.2) : 0;
  const platformFee = basePriceNum > 0 ? candidatePrice - basePriceNum : 0;

  // Tier calculation logic
  const bookingsCount = (mentor as any)?.total_sessions ?? (mentor as any)?.bookings_count ?? 0;
  
  let currentTier = 'new';
  let nextTier = 'Bronze';
  let target = 1;
  
  if (bookingsCount >= 21) {
      currentTier = 'gold';
      nextTier = 'Platinum';
      target = 50;
  } else if (bookingsCount >= 11) {
      currentTier = 'silver';
      nextTier = 'Gold';
      target = 21;
  } else if (bookingsCount >= 1) {
      currentTier = 'bronze';
      nextTier = 'Silver';
      target = 11;
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
            <Ionicons name="cash-outline" size={32} color={colors.primary} />
          </View>
          <Heading level={1}>Mentorship & Pricing</Heading>
          <AppText style={styles.headerSub}>
            Set your rates and track your mentor journey
          </AppText>
        </Section>

        {/* Current Tier Card */}
        <Section>
          <Card style={[styles.tierCard, shadows.card as any]}>
            <View style={styles.tierHeader}>
              <View style={styles.tierBadge}>
                <Ionicons 
                  name={
                    currentTier === 'gold' ? 'trophy' :
                    currentTier === 'silver' ? 'star' :
                    currentTier === 'bronze' ? 'medal' : 'rocket'
                  } 
                  size={24} 
                  color={
                    currentTier === 'gold' ? '#D97706' :
                    currentTier === 'silver' ? '#9CA3AF' :
                    currentTier === 'bronze' ? '#B45309' : colors.primary
                  } 
                />
              </View>
              <View style={styles.tierInfo}>
                <AppText style={styles.tierLabel}>Current Level</AppText>
                <AppText style={styles.tierName}>
                  {currentTier === 'gold' ? 'Gold Mentor' :
                   currentTier === 'silver' ? 'Silver Mentor' :
                   currentTier === 'bronze' ? 'Bronze Mentor' : 'New Mentor'}
                </AppText>
              </View>
            </View>
            
            <View style={styles.tierProgress}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      width: `${Math.min((bookingsCount / target) * 100, 100)}%`,
                      backgroundColor: 
                        currentTier === 'gold' ? '#D97706' :
                        currentTier === 'silver' ? '#9CA3AF' : 
                        currentTier === 'bronze' ? '#B45309' : colors.primary
                    }
                  ]} 
                />
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 4}}>
                <AppText style={styles.progressText}>
                    {bookingsCount} / {target} bookings
                </AppText>
                <AppText style={styles.progressText}>
                    Next: {nextTier}
                </AppText>
              </View>
            </View>
          </Card>
        </Section>

        {/* Pricing Card */}
        <Section>
          <Card style={[styles.card, shadows.card as any]}>
            <View style={styles.cardHeader}>
              <Ionicons name="pricetag-outline" size={20} color={colors.textTertiary} />
              <Heading level={2} style={styles.cardTitle}>Set Your Price</Heading>
            </View>
            <AppText style={styles.cardDescription}>
              Each booking includes <AppText style={styles.bold}>2 mock interview sessions</AppText> with a candidate. Set how much you want to earn per booking.
            </AppText>

            {/* Price Input */}
            <View style={styles.priceInputSection}>
              <View style={styles.inputWrapper}>
                <AppText style={styles.inputLabel}>Your Earning Per Booking</AppText>
                <View style={styles.inputContainer}>
                  <AppText style={styles.currencySymbol}>₹</AppText>
                  <Input
                    value={priceInput}
                    onChangeText={setPriceInput}
                    keyboardType="number-pad"
                    placeholder="3000"
                    style={styles.priceInput}
                  />
                </View>
                <AppText style={styles.inputHint}>
                  Minimum: ₹1,000 • Maximum: ₹10,000
                </AppText>
              </View>
            </View>

            {/* Price Breakdown */}
            {basePriceNum > 0 && (
              <View style={styles.breakdown}>
                <AppText style={styles.breakdownTitle}>Price Breakdown</AppText>
                
                <View style={styles.breakdownRow}>
                  <View style={styles.breakdownLeft}>
                    <View style={[styles.breakdownIcon, { backgroundColor: 'rgba(14,147,132,0.1)' }]}>
                      <Ionicons name="person" size={16} color={colors.primary} />
                    </View>
                    <AppText style={styles.breakdownLabel}>You Receive</AppText>
                  </View>
                  <AppText style={[styles.breakdownValue, { color: colors.primary }]}>
                    ₹{basePriceNum.toLocaleString('en-IN')}
                  </AppText>
                </View>

                <View style={styles.breakdownRow}>
                  <View style={styles.breakdownLeft}>
                    <View style={[styles.breakdownIcon, { backgroundColor: 'rgba(37,99,235,0.1)' }]}>
                      <Ionicons name="business" size={16} color="#2563eb" />
                    </View>
                    <AppText style={styles.breakdownLabel}>Platform Fee (20%)</AppText>
                  </View>
                  <AppText style={styles.breakdownValue}>
                    +₹{platformFee.toLocaleString('en-IN')}
                  </AppText>
                </View>

                <View style={[styles.breakdownRow, styles.breakdownTotal]}>
                  <View style={styles.breakdownLeft}>
                    <View style={[styles.breakdownIcon, { backgroundColor: 'rgba(16,185,129,0.1)' }]}>
                      <Ionicons name="pricetag" size={16} color={colors.success} />
                    </View>
                    <AppText style={[styles.breakdownLabel, styles.bold]}>
                      Candidate Pays
                    </AppText>
                  </View>
                  <AppText style={[styles.breakdownValue, styles.bold, { color: colors.success }]}>
                    ₹{candidatePrice.toLocaleString('en-IN')}
                  </AppText>
                </View>
              </View>
            )}

            {/* Save Button */}
            <Button
              title={saving ? 'Saving…' : 'Save Pricing'}
              onPress={handleSave}
              disabled={saving || !mentor || !basePriceNum}
              style={styles.saveButton}
            />
          </Card>
        </Section>

        {/* Mentor Levels & Perks */}
        <Section>
          <Card style={[styles.card, shadows.card as any]}>
            <View style={styles.cardHeader}>
              <Ionicons name="trophy-outline" size={20} color={colors.textTertiary} />
              <Heading level={2} style={styles.cardTitle}>Mentor Levels & Perks</Heading>
            </View>
            <AppText style={styles.cardDescription}>
              Unlock exclusive benefits by completing sessions.
            </AppText>

            {/* NEW MENTOR */}
            <View style={[styles.levelCard, currentTier === 'new' && styles.levelCardActive]}>
              <View style={styles.levelHeader}>
                <View style={[styles.levelIcon, { backgroundColor: 'rgba(14,147,132,0.1)' }]}>
                  <Ionicons name="rocket" size={20} color={colors.primary} />
                </View>
                <View style={styles.levelInfo}>
                  <AppText style={styles.levelTitle}>New Mentor</AppText>
                  <AppText style={styles.levelRequirement}>0 bookings</AppText>
                </View>
                {currentTier === 'new' && (
                  <View style={styles.currentBadge}>
                    <AppText style={styles.currentBadgeText}>Current</AppText>
                  </View>
                )}
              </View>
              <AppText style={styles.levelDescription}>
                Start your journey. Complete your first session to reach Bronze.
              </AppText>
            </View>

            {/* ✅ FIX #8: BRONZE MENTOR - Updated Benefits */}
            <View style={[styles.levelCard, currentTier === 'bronze' && styles.levelCardActive]}>
              <View style={styles.levelHeader}>
                <View style={[styles.levelIcon, { backgroundColor: '#FDF2E9' }]}>
                  <Ionicons name="medal" size={20} color="#CD7F32" />
                </View>
                <View style={styles.levelInfo}>
                  <AppText style={styles.levelTitle}>Bronze Mentor</AppText>
                  <AppText style={styles.levelRequirement}>1-10 sessions</AppText>
                </View>
                {currentTier === 'bronze' && (
                  <View style={styles.currentBadge}>
                    <AppText style={styles.currentBadgeText}>Current</AppText>
                  </View>
                )}
              </View>
              
              {/* ✅ SPECIFIC BENEFITS */}
              <View style={styles.benefitsList}>
                <View style={styles.benefitItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#CD7F32" />
                  <AppText style={styles.benefitText}>Verified Mentor Badge</AppText>
                </View>
                <View style={styles.benefitItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#CD7F32" />
                  <AppText style={styles.benefitText}>LinkedIn Appreciation Post</AppText>
                </View>
              </View>
              
              <View style={styles.levelPerks}>
                <TouchableOpacity 
                    onPress={() => handleClaim('slack', 'Bronze')}
                    style={[styles.actionBtn, { borderColor: '#CD7F32' }]}
                    disabled={bookingsCount < 1}
                >
                  <Ionicons name="logo-slack" size={16} color={bookingsCount < 1 ? '#9CA3AF' : '#CD7F32'} />
                  <AppText style={[styles.actionBtnText, {color: bookingsCount < 1 ? '#9CA3AF' : '#CD7F32'}]}>
                      {bookingsCount < 1 ? "Locked: Join Slack" : "Join Slack Community"}
                  </AppText>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={() => handleClaim('linkedin', 'Bronze')}
                    style={[styles.actionBtn, { borderColor: '#0077B5' }]}
                    disabled={bookingsCount < 1}
                >
                  <Ionicons name="logo-linkedin" size={16} color={bookingsCount < 1 ? '#9CA3AF' : '#0077B5'} />
                  <AppText style={[styles.actionBtnText, {color: bookingsCount < 1 ? '#9CA3AF' : '#0077B5'}]}>
                      {bookingsCount < 1 ? "Locked: Share Badge" : "Share Bronze Badge"}
                  </AppText>
                </TouchableOpacity>
              </View>
            </View>

            {/* ✅ FIX #8: SILVER MENTOR - Updated Benefits */}
            <View style={[styles.levelCard, currentTier === 'silver' && styles.levelCardActive]}>
              <View style={styles.levelHeader}>
                <View style={[styles.levelIcon, { backgroundColor: '#F3F4F6' }]}>
                  <Ionicons name="star" size={20} color="#9CA3AF" />
                </View>
                <View style={styles.levelInfo}>
                  <AppText style={styles.levelTitle}>Silver Mentor</AppText>
                  <AppText style={styles.levelRequirement}>11-20 sessions</AppText>
                </View>
                {currentTier === 'silver' && (
                  <View style={styles.currentBadge}>
                    <AppText style={styles.currentBadgeText}>Current</AppText>
                  </View>
                )}
              </View>
              
              {/* ✅ SPECIFIC BENEFITS */}
              <View style={styles.benefitsList}>
                <View style={styles.benefitItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#6B7280" />
                  <AppText style={styles.benefitText}>Added to Silver Mentor Network</AppText>
                </View>
                <View style={styles.benefitItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#6B7280" />
                  <AppText style={styles.benefitText}>Silver Badge</AppText>
                </View>
              </View>

              <View style={styles.levelPerks}>
                <TouchableOpacity 
                    onPress={() => handleClaim('linkedin', 'Silver')}
                    style={[styles.actionBtn, { borderColor: '#9CA3AF' }]}
                    disabled={bookingsCount < 11}
                >
                   <Ionicons name="logo-linkedin" size={16} color={bookingsCount < 11 ? '#9CA3AF' : '#6B7280'} />
                   <AppText style={[styles.actionBtnText, {color: bookingsCount < 11 ? '#9CA3AF' : '#6B7280'}]}>
                       {bookingsCount < 11 ? "Locked: Silver Badge" : "Share Silver Badge"}
                   </AppText>
                </TouchableOpacity>
              </View>
            </View>

            {/* ✅ FIX #8: GOLD MENTOR - Updated Benefits */}
            <View style={[styles.levelCard, currentTier === 'gold' && styles.levelCardActive]}>
              <View style={styles.levelHeader}>
                <View style={[styles.levelIcon, { backgroundColor: '#FFFBEB' }]}>
                  <Ionicons name="trophy" size={20} color="#D97706" />
                </View>
                <View style={styles.levelInfo}>
                  <AppText style={styles.levelTitle}>Gold Mentor</AppText>
                  <AppText style={styles.levelRequirement}>21+ sessions</AppText>
                </View>
                {currentTier === 'gold' && (
                  <View style={styles.currentBadge}>
                    <AppText style={styles.currentBadgeText}>Current</AppText>
                  </View>
                )}
              </View>
              
              {/* ✅ SPECIFIC BENEFITS */}
              <View style={styles.benefitsList}>
                <View style={styles.benefitItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#D97706" />
                  <AppText style={styles.benefitText}>Featured on Top of Browse List</AppText>
                </View>
                <View style={styles.benefitItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#D97706" />
                  <AppText style={styles.benefitText}>Gold Badge</AppText>
                </View>
              </View>

              <View style={styles.levelPerks}>
                <TouchableOpacity 
                    onPress={() => handleClaim('linkedin', 'Gold')}
                    style={[styles.actionBtn, { borderColor: '#D97706' }]}
                    disabled={bookingsCount < 21}
                >
                   <Ionicons name="logo-linkedin" size={16} color={bookingsCount < 21 ? '#9CA3AF' : '#D97706'} />
                   <AppText style={[styles.actionBtnText, {color: bookingsCount < 21 ? '#9CA3AF' : '#D97706'}]}>
                       {bookingsCount < 21 ? "Locked: Gold Badge" : "Share Gold Badge"}
                   </AppText>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.levelFooter}>
              <Ionicons name="information-circle-outline" size={16} color={colors.textTertiary} />
              <AppText style={styles.levelFooterText}>
                All perks are automatically unlocked when you reach the milestone.
              </AppText>
            </View>
          </Card>
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
  tierCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    backgroundColor: 'rgba(14,147,132,0.05)',
  },
  tierHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  tierBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  tierInfo: {
    flex: 1,
  },
  tierLabel: {
    fontSize: typography.size.xs,
    color: colors.textTertiary,
    marginBottom: 2,
  },
  tierName: {
    fontSize: typography.size.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  tierProgress: {
    gap: spacing.xs,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  progressText: {
    fontSize: typography.size.xs,
    color: colors.textSecondary,
    fontWeight: '500',
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
  bold: {
    fontWeight: '700',
  },
  priceInputSection: {
    marginBottom: spacing.md,
  },
  inputWrapper: {
    gap: spacing.xs,
  },
  inputLabel: {
    fontSize: typography.size.sm,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.md,
    paddingLeft: spacing.md,
    borderWidth: 2,
    borderColor: colors.border,
  },
  currencySymbol: {
    fontSize: typography.size.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginRight: spacing.xs,
  },
  priceInput: {
    flex: 1,
    fontSize: typography.size.lg,
    fontWeight: '700',
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  inputHint: {
    fontSize: typography.size.xs,
    color: colors.textTertiary,
  },
  breakdown: {
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  breakdownTitle: {
    fontSize: typography.size.sm,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  breakdownTotal: {
    paddingTop: spacing.sm,
    marginTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  breakdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  breakdownIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  breakdownLabel: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
  },
  breakdownValue: {
    fontSize: typography.size.md,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  saveButton: {
    marginTop: spacing.sm,
  },
  levelCard: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.background,
    marginTop: spacing.sm,
  },
  levelCardActive: {
    backgroundColor: 'rgba(14,147,132,0.05)',
    borderColor: colors.primary,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  levelIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  levelInfo: {
    flex: 1,
  },
  levelTitle: {
    fontSize: typography.size.md,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  levelRequirement: {
    fontSize: typography.size.xs,
    color: colors.textTertiary,
  },
  currentBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 999,
  },
  currentBadgeText: {
    fontSize: typography.size.xs,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  levelDescription: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  // ✅ NEW: Benefits list styles
  benefitsList: {
    gap: 8,
    marginBottom: spacing.sm,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  benefitText: {
    fontSize: typography.size.sm,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  levelPerks: {
    gap: spacing.xs,
    marginTop: 12,
  },
  perkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  perkText: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
  },
  levelFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
    padding: spacing.sm,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.sm,
  },
  levelFooterText: {
    flex: 1,
    fontSize: typography.size.xs,
    color: colors.textTertiary,
  },
  actionBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderWidth: 1,
      borderRadius: 8,
      gap: 8,
      marginTop: 4,
      justifyContent: 'center'
  },
  actionBtnText: {
      fontSize: 12,
      fontWeight: '600',
  }
});