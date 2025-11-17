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
import { colors, spacing, borderRadius, typography } from '@/lib/theme';
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
};

export default function CandidateMentorsList() {
  const [loading, setLoading] = useState(true);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
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
          <View style={{ gap: spacing.md }}>
            {mentors.map((m) => {
              const basePrice = m.session_price_inr ?? m.session_price ?? 0;
              const candidatePrice = basePrice
                ? Math.round(basePrice * 1.2)
                : 0;

              return (
                <Card key={m.id} style={styles.card}>
                  <View style={styles.row}>
                    <View style={styles.avatarPlaceholder}>
                      <Ionicons
                        name="person-outline"
                        size={22}
                        color={colors.surface}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <AppText style={styles.name}>
                        Interview mentor
                      </AppText>
                      <AppText style={styles.title}>
                        {m.professional_title ||
                          'Experienced CrackJobs mentor'}
                      </AppText>
                      {m.experience_description ? (
                        <AppText numberOfLines={2} style={styles.desc}>
                          {m.experience_description}
                        </AppText>
                      ) : null}
                    </View>
                    <View>
                      <AppText style={styles.priceLabel}>
                        Per booking (2 sessions)
                      </AppText>
                      <AppText style={styles.priceValue}>
                        ₹{candidatePrice.toLocaleString('en-IN')}
                      </AppText>
                    </View>
                  </View>
                  <View style={styles.actions}>
                    <Button
                      title="View details"
                      size="sm"
                      onPress={() => handleView(m.id)}
                    />
                  </View>
                </Card>
              );
            })}
          </View>
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
  card: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 48,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: { fontWeight: '700', fontSize: typography.size.md },
  title: { color: colors.textSecondary, fontSize: typography.size.sm },
  desc: { color: colors.textTertiary, marginTop: spacing.xs },
  priceLabel: { color: colors.textTertiary, fontSize: typography.size.xs },
  priceValue: { fontWeight: '700', fontSize: typography.size.md },
  actions: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
