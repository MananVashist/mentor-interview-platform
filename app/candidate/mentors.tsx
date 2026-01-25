// app/candidate/mentors.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, spacing, borderRadius, typography, shadows } from '@/lib/theme';
import { Heading, AppText, Section, Card, Button } from '@/lib/ui';

const SUPABASE_URL = 'https://rcbaaiiawrglvyzmawvr.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjYmFhaWlhd3JnbHZ5em1hd3ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNTA1NjAsImV4cCI6MjA3NjcyNjU2MH0.V3qRHGXBMlspRS7XFJlXdo4qIcCms60Nepp7dYMEjLA';

type Mentor = {
  id: string;
  professional_title?: string | null;
  experience_description?: string | null;
  expertise_profiles?: string[];
  profile?: {
    full_name?: string | null;
    avatar_url?: string | null;
  };
  session_price_inr?: number | null; // mentor’s own price
  session_price?: number | null;     // legacy fallback
  mentor_level?: string | null;
  tier?: string | null;
};

export default function CandidateMentorsList() {
  const [loading, setLoading] = useState(true);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [tierMap, setTierMap] = useState<Record<string, number>>({});
  const router = useRouter();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // 1. Fetch Tiers
        const { data: tiersData } = await fetch(
            `${SUPABASE_URL}/rest/v1/mentor_tiers?select=tier,percentage_cut`,
            { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
        ).then(r => r.json());
        
        const tMap: Record<string, number> = {};
        tiersData?.forEach((t: any) => tMap[t.tier] = t.percentage_cut);
        setTierMap(tMap);

        // 2. Fetch Mentors
        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/mentors?select=*,profile:profiles(*)`,
          {
            headers: {
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            },
          }
        );
        const text = await res.text();
        if (res.ok) {
          const data = JSON.parse(text) as Mentor[];
          setMentors(data || []);
        } else {
          setMentors([]);
        }
      } catch (err) {
        console.log('[candidate/mentors] error', err);
        setMentors([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleView = (id: string) => {
    router.push({
      pathname: '/candidate/[id]',
      params: { id },
    });
  };

  const getLevelBadgeStyle = (level?: string | null) => {
    const l = (level || 'bronze').toLowerCase();
    switch (l) {
      case 'gold':
        return { bg: '#FEF9C3', fg: '#854D0E', icon: 'star' as const };
      case 'silver':
        return { bg: '#F3F4F6', fg: '#6b7280', icon: 'star-half' as const };
      default:
        return { bg: '#FDF2E9', fg: '#CD7F32', icon: 'medal' as const }; // bronze
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Section style={styles.header}>
        <Heading>All Mentors</Heading>
        <AppText style={styles.sub}>
          Anonymous mentors available for the profiles added by admin.
        </AppText>
      </Section>

      <Section>
        {loading ? (
          <ActivityIndicator color={colors.accent} />
        ) : mentors.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Ionicons
              name="person-outline"
              size={26}
              color={colors.textSecondary}
            />
            <AppText style={styles.emptyText}>No mentors found</AppText>
          </Card>
        ) : (
          <>
            <View style={styles.resultsHeader}>
              <AppText style={styles.resultsCount}>
                {mentors.length} {mentors.length === 1 ? 'mentor' : 'mentors'} available
              </AppText>
            </View>

            <View style={styles.mentorList}>
              {mentors.map((m) => {
                const basePrice = m.session_price_inr ?? m.session_price ?? 0;
                // ✅ UPDATED: Dynamic calculation
                const cut = tierMap[m.tier || 'bronze'] || 50; 
                // Final = Base / (1 - Cut%)
                const candidatePrice = basePrice ? Math.round(basePrice / (1 - (cut/100))) : 0;
                
                const levelCfg = getLevelBadgeStyle(m.mentor_level);

                const subtitle =
                  Array.isArray(m.expertise_profiles) && m.expertise_profiles.length > 0
                    ? `${m.expertise_profiles[0]} Interviewer`
                    : 'Interview mentor';

                return (
                  <Card
                    key={m.id}
                    style={[styles.mentorCard, shadows.card as any]}
                  >
                    {/* Header: avatar + title + level badge */}
                    <View style={styles.mentorHeader}>
                      <View style={styles.avatarPlaceholder}>
                        <Ionicons
                          name="person-outline"
                          size={22}
                          color="#FFFFFF"
                        />
                      </View>

                      <View style={styles.headerText}>
                        <AppText style={styles.name}>
                          {m.professional_title || 'SDE / Software Engineer mentor'}
                        </AppText>
                        <AppText style={styles.subtitle} numberOfLines={1}>
                          {subtitle}
                        </AppText>
                      </View>

                      <View
                        style={[
                          styles.levelBadge,
                          { backgroundColor: levelCfg.bg },
                        ]}
                      >
                        <Ionicons
                          name={levelCfg.icon}
                          size={12}
                          color={levelCfg.fg}
                        />
                        <AppText
                          style={[
                            styles.levelBadgeText,
                            { color: levelCfg.fg },
                          ]}
                        >
                          {(m.mentor_level || 'BRONZE').toUpperCase()}
                        </AppText>
                      </View>
                    </View>

                    {/* Description */}
                    {m.experience_description ? (
                      <AppText style={styles.desc}>
                        {m.experience_description}
                      </AppText>
                    ) : (
                      <AppText style={styles.descPlaceholder}>
                        Experienced professional ready to help you crack your
                        interviews.
                      </AppText>
                    )}

                    {/* Expertise tags */}
                    {m.expertise_profiles && m.expertise_profiles.length > 0 && (
                      <View style={styles.tagsRow}>
                        {m.expertise_profiles.slice(0, 3).map((tag, idx) => (
                          <View key={idx} style={styles.tag}>
                            <AppText style={styles.tagText}>{tag}</AppText>
                          </View>
                        ))}
                        {m.expertise_profiles.length > 3 && (
                          <View style={styles.tag}>
                            <AppText style={styles.tagText}>
                              +{m.expertise_profiles.length - 3}
                            </AppText>
                          </View>
                        )}
                      </View>
                    )}

                    {/* Footer: price + button */}
                    <View style={styles.footerRow}>
                      <View style={styles.priceSection}>
                        <AppText style={styles.priceLabel}>
                          Per booking (2 sessions)
                        </AppText>
                        <AppText style={styles.priceValue}>
                          ₹{candidatePrice.toLocaleString('en-IN')}
                        </AppText>
                        <AppText style={styles.priceSub}>
                          Mentor payout + {cut}% platform fee
                        </AppText>
                      </View>

                      <Button
                        title="View details"
                        size="sm"
                        onPress={() => handleView(m.id)}
                        style={styles.viewButton}
                      />
                    </View>
                  </Card>
                );
              })}
            </View>
          </>
        )}
      </Section>

      <View style={{ height: spacing.xl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  header: { paddingTop: spacing.lg, paddingBottom: spacing.sm },
  sub: { color: colors.textSecondary, marginTop: spacing.xs },

  emptyCard: { alignItems: 'center', gap: spacing.sm, padding: spacing.lg },
  emptyText: { color: colors.textSecondary },

  resultsHeader: {
    marginBottom: spacing.sm,
  },
  resultsCount: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
  },

  mentorList: {
    gap: spacing.md,
  },
  mentorCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    backgroundColor: colors.surface,
  },

  mentorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontWeight: '700',
    fontSize: typography.size.md,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: typography.size.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },

  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 999,
    gap: spacing.xs,
  },
  levelBadgeText: {
    fontSize: typography.size.xxs,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  desc: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  descPlaceholder: {
    fontSize: typography.size.sm,
    color: colors.textTertiary,
    marginBottom: spacing.sm,
  },

  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  tag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: colors.backgroundSecondary,
  },
  tagText: {
    fontSize: typography.size.xs,
    color: colors.textSecondary,
  },

  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  priceSection: {
    flexShrink: 1,
  },
  priceLabel: {
    fontSize: typography.size.xs,
    color: colors.textTertiary,
  },
  priceValue: {
    fontSize: typography.size.md,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  priceSub: {
    fontSize: typography.size.xxs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  viewButton: {
    alignSelf: 'flex-end',
  },
});