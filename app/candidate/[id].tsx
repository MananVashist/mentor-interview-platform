// app/candidate/[id].tsx
import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  colors,
  spacing,
  borderRadius,
  typography,
  shadows,
} from '@/lib/theme';
import {
  Heading,
  AppText,
  Section,
  Card,
  Button,
  ScreenBackground,
} from '@/lib/ui';

const SUPABASE_URL = 'https://rcbaaiiawrglvyzmawvr.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjYmFhaWlhd3JnbHZ5em1hd3ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNTA1NjAsImV4cCI6MjA3NjcyNjU2MH0.V3qRHGXBMlspRS7XFJlXdo4qIcCms60Nepp7dYMEjLA';

type Mentor = {
  id: string;
  professional_title?: string | null;
  experience_description?: string | null;
  years_of_experience?: number | null;
  expertise_profiles?: string[] | null;
  session_price_inr?: number | null;
  session_price?: number | null;
  total_sessions?: number | null;
  mentor_level?: string | null;
  profile?: {
    full_name?: string | null;
  };
};

export default function CandidateMentorDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/mentors?select=*,profile:profiles(*)&id=eq.${id}`,
          {
            headers: {
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            },
          }
        );

        const text = await res.text();
        if (!res.ok) {
          console.log('[candidate/[id]] error response', text);
          setError('Could not load mentor details.');
          setMentor(null);
        } else {
          const data = JSON.parse(text) as Mentor[];
          setMentor(data && data.length > 0 ? data[0] : null);
          if (!data || data.length === 0) {
            setError('Mentor not found.');
          }
        }
      } catch (e) {
        console.log('[candidate/[id]] fetch error', e);
        setError('Something went wrong while loading mentor details.');
        setMentor(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleBook = () => {
    if (!id) return;
    router.push({
      pathname: '/candidate/bookings',
      params: { mentorId: String(id) },
    });
  };

  const handleBack = () => {
    router.back();
  };

  const getLevelBadgeStyle = (level?: string | null) => {
    const l = (level || 'bronze').toLowerCase();
    switch (l) {
      case 'gold':
        return { bg: '#FEF9C3', fg: '#854D0E', icon: 'star' as const };
      case 'silver':
        return { bg: '#F3F4F6', fg: '#6b7280', icon: 'star-half' as const };
      default:
        return { bg: '#FDF2E9', fg: '#CD7F32', icon: 'medal' as const };
    }
  };

  // Derive prices
  const basePrice = mentor?.session_price_inr ?? mentor?.session_price ?? 0;
  const candidatePrice = basePrice ? Math.round(basePrice * 1.2) : 0;
  const platformFee = basePrice ? candidatePrice - basePrice : 0;

  if (loading) {
    return (
      <ScreenBackground>
        <Section
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <ActivityIndicator color={colors.primary} size="large" />
          <AppText
            style={{ marginTop: spacing.md, color: colors.textSecondary }}
          >
            Loading mentor details…
          </AppText>
        </Section>
      </ScreenBackground>
    );
  }

  if (!mentor) {
    return (
      <ScreenBackground>
        <Section
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <View style={styles.errorIcon}>
            <Ionicons
              name="alert-circle-outline"
              size={64}
              color={colors.textTertiary}
            />
          </View>
          <Heading level={2} style={styles.errorTitle}>
            Mentor Not Found
          </Heading>
          <AppText style={styles.errorText}>
            {error || 'The mentor you are looking for could not be found.'}
          </AppText>
          <Button
            title="Back to Mentors"
            onPress={handleBack}
            style={{ marginTop: spacing.lg }}
          />
        </Section>
      </ScreenBackground>
    );
  }

  const levelConfig = getLevelBadgeStyle(mentor.mentor_level);

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }}>
        {/* Back Button */}
        <Section style={{ paddingTop: spacing.md }}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons
              name="arrow-back"
              size={20}
              color={colors.textPrimary}
            />
            <AppText style={styles.backText}>Back to mentors</AppText>
          </TouchableOpacity>
        </Section>

        {/* Mentor Header Card */}
        <Section>
          <Card style={[styles.headerCard, shadows.card as any]}>
            <View style={styles.headerTop}>
              <View style={styles.mentorAvatar}>
                <Ionicons name="person-outline" size={32} color="#FFFFFF" />
              </View>
              <View
                style={[
                  styles.levelBadgeLarge,
                  { backgroundColor: levelConfig.bg },
                ]}
              >
                <Ionicons
                  name={levelConfig.icon}
                  size={16}
                  color={levelConfig.fg}
                />
                <AppText
                  style={[styles.levelBadgeText, { color: levelConfig.fg }]}
                >
                  {(mentor.mentor_level || 'bronze').toUpperCase()} MENTOR
                </AppText>
              </View>
            </View>

            {/* anonymised title */}
            <Heading level={1} style={styles.mentorName}>
              Interview mentor
            </Heading>

            {mentor.professional_title && (
              <AppText style={styles.mentorTitle}>
                {mentor.professional_title}
              </AppText>
            )}

            {/* Stats Row */}
            <View style={styles.statsRow}>
              {mentor.years_of_experience != null && (
                <View style={styles.statItem}>
                  <View style={styles.statIcon}>
                    <Ionicons
                      name="calendar-outline"
                      size={18}
                      color={colors.primary}
                    />
                  </View>
                  <AppText style={styles.statText}>
                    {mentor.years_of_experience}{' '}
                    {mentor.years_of_experience === 1 ? 'year' : 'years'}
                  </AppText>
                </View>
              )}

              {mentor.total_sessions != null && mentor.total_sessions > 0 && (
                <View style={styles.statItem}>
                  <View style={styles.statIcon}>
                    <Ionicons
                      name="checkmark-done"
                      size={18}
                      color={colors.success}
                    />
                  </View>
                  <AppText style={styles.statText}>
                    {mentor.total_sessions} sessions
                  </AppText>
                </View>
              )}
            </View>
          </Card>
        </Section>

        {/* About Section */}
        {mentor.experience_description && (
          <Section>
            <Card style={[styles.card, shadows.card as any]}>
              <View style={styles.cardHeader}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={colors.textTertiary}
                />
                <Heading level={2} style={styles.cardTitle}>
                  About This Mentor
                </Heading>
              </View>
              <AppText style={styles.bodyText}>
                {mentor.experience_description}
              </AppText>
            </Card>
          </Section>
        )}

        {/* Expertise Section */}
        {mentor.expertise_profiles && mentor.expertise_profiles.length > 0 && (
          <Section>
            <Card style={[styles.card, shadows.card as any]}>
              <View style={styles.cardHeader}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={20}
                  color={colors.textTertiary}
                />
                <Heading level={2} style={styles.cardTitle}>
                  Interview Expertise
                </Heading>
              </View>
              <AppText style={styles.cardDescription}>
                This mentor can conduct interviews for the following profiles:
              </AppText>
              <View style={styles.expertiseGrid}>
                {mentor.expertise_profiles.map((profile, idx) => (
                  <View key={idx} style={styles.expertiseCard}>
                    <Ionicons
                      name="school"
                      size={16}
                      color={colors.primary}
                    />
                    <AppText style={styles.expertiseText}>{profile}</AppText>
                  </View>
                ))}
              </View>
            </Card>
          </Section>
        )}

        {/* Pricing Section */}
        <Section>
          <Card style={[styles.card, shadows.card as any]}>
            <View style={styles.cardHeader}>
              <Ionicons
                name="pricetag-outline"
                size={20}
                color={colors.textTertiary}
              />
            </View>
            <Heading level={2} style={styles.cardTitle}>
              Package Pricing
            </Heading>
            <AppText style={styles.cardDescription}>
              Each booking includes 2 mock interview sessions
            </AppText>

            <View style={styles.pricingBreakdown}>
              <View style={styles.pricingRow}>
                <View style={styles.pricingLeft}>
                  <View
                    style={[
                      styles.pricingIcon,
                      { backgroundColor: 'rgba(14,147,132,0.1)' },
                    ]}
                  >
                    <Ionicons
                      name="person"
                      size={16}
                      color={colors.primary}
                    />
                  </View>
                  <AppText style={styles.pricingLabel}>Mentor receives</AppText>
                </View>
                <AppText
                  style={[styles.pricingValue, { color: colors.primary }]}
                >
                  ₹{basePrice.toLocaleString('en-IN')}
                </AppText>
              </View>

              <View style={styles.pricingRow}>
                <View style={styles.pricingLeft}>
                  <View
                    style={[
                      styles.pricingIcon,
                      { backgroundColor: 'rgba(37,99,235,0.1)' },
                    ]}
                  >
                    <Ionicons
                      name="business"
                      size={16}
                      color="#2563eb"
                    />
                  </View>
                  <AppText style={styles.pricingLabel}>Platform fee</AppText>
                </View>
                <AppText style={styles.pricingValue}>
                  +₹{platformFee.toLocaleString('en-IN')}
                </AppText>
              </View>

              <View style={[styles.pricingRow, styles.pricingTotal]}>
                <View style={styles.pricingLeft}>
                  <View
                    style={[
                      styles.pricingIcon,
                      { backgroundColor: 'rgba(16,185,129,0.1)' },
                    ]}
                  >
                    <Ionicons
                      name="wallet"
                      size={16}
                      color={colors.success}
                    />
                  </View>
                  <AppText
                    style={[styles.pricingLabel, { fontWeight: '700' }]}
                  >
                    You pay
                  </AppText>
                </View>
                <AppText
                  style={[
                    styles.pricingValueLarge,
                    { color: colors.success },
                  ]}
                >
                  ₹{candidatePrice.toLocaleString('en-IN')}
                </AppText>
              </View>
            </View>
          </Card>
        </Section>

        {/* Book Button */}
        <Section>
          <Button
            title="Book this mentor"
            onPress={handleBook}
            leftIcon={
              <Ionicons name="calendar" size={20} color="#FFFFFF" />
            }
            style={styles.bookButton}
          />
          <AppText style={styles.bookHint}>
            Secure your slot and start preparing for your dream job
          </AppText>
        </Section>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },
  backText: {
    color: colors.textPrimary,
    fontWeight: '500',
  },

  headerCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  mentorAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelBadgeLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
  },
  levelBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  mentorName: {
    marginBottom: spacing.xs,
  },
  mentorTitle: {
    fontSize: typography.size.md,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },

  statsRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statText: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
  },

  card: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  cardTitle: {
    fontSize: typography.size.lg,
  },
  cardDescription: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  bodyText: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
  },

  expertiseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  expertiseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: colors.backgroundSecondary,
  },
  expertiseText: {
    fontSize: typography.size.xs,
    color: colors.textSecondary,
  },

  pricingBreakdown: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pricingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  pricingIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pricingLabel: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
  },
  pricingValue: {
    fontSize: typography.size.sm,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  pricingTotal: {
    marginTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  pricingValueLarge: {
    fontSize: typography.size.lg,
    fontWeight: '700',
  },

  bookButton: {
    marginTop: spacing.sm,
  },
  bookHint: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
    fontSize: typography.size.xs,
    textAlign: 'center',
  },

  errorIcon: {
    marginBottom: spacing.md,
  },
  errorTitle: {
    marginBottom: spacing.xs,
  },
  errorText: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
