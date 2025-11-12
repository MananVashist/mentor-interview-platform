// app/(mentor)/bookings.tsx
import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography, shadows } from '@/lib/theme';
import { Heading, AppText, Section, Card, Button, ScreenBackground } from '@/lib/ui';
import { useAuthStore } from '@/lib/store';

// Types preserved
type Booking = {
  id: string;
  scheduled_at: string;
  status: string;
  notes?: string | null;
  mentor_id: string;
  candidate_id: string;
  candidate?: {
    id: string;
    profile?: {
      id: string;
      full_name?: string | null;
      email?: string | null;
      linkedin_url?: string | null;
    } | null;
  } | null;
};

export default function MentorBookingsScreen() {
  const { profile, session } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        // Keep your existing GET; just presentation changes
        const res = await fetch(
          `https://rcbaaiiawrglvyzmawvr.supabase.co/rest/v1/bookings?mentor_id=eq.${profile?.id}&select=*,candidate:candidates(id,profile:profiles(*))`,
          {
            headers: {
              apikey: session?.access_token || '',
              Authorization: `Bearer ${session?.access_token || ''}`,
            },
          }
        );
        const text = await res.text();
        const data: Booking[] = res.ok && text ? JSON.parse(text) : [];
        if (mounted) setBookings(data || []);
      } catch (e) {
        if (mounted) setBookings([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [profile?.id, session?.access_token]);

  const statusTint = (status?: string) => {
    switch ((status || '').toLowerCase()) {
      case 'scheduled':
      case 'confirmed':
        return { bg: 'rgba(16,185,129,0.12)', fg: colors.success };
      case 'completed':
        return { bg: 'rgba(14,147,132,0.12)', fg: colors.primary };
      case 'cancelled':
      case 'canceled':
        return { bg: 'rgba(239,68,68,0.12)', fg: colors.error };
      default:
        return { bg: 'rgba(37,99,235,0.1)', fg: '#2563eb' };
    }
  };

  if (loading) {
    return (
      <ScreenBackground>
        <Section style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
          <AppText style={{ marginTop: spacing.sm, color: colors.textSecondary }}>
            Loading your bookings…
          </AppText>
        </Section>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }}>
        <Section style={styles.header}>
          <Heading level={1}>My Bookings</Heading>
          <AppText style={styles.sub}>
            Upcoming & past sessions. Tap a booking to manage.
          </AppText>
        </Section>

        {bookings.length === 0 ? (
          <Section>
            <Card style={[styles.emptyCard, shadows.card as any]}>
              <Ionicons name="calendar-outline" size={28} color={colors.textSecondary} />
              <Heading level={2} style={styles.emptyTitle}>No bookings yet</Heading>
              <AppText style={{ color: colors.textSecondary }}>
                You’ll see your scheduled interviews here.
              </AppText>
            </Card>
          </Section>
        ) : (
          <Section style={{ gap: spacing.md }}>
            {bookings.map((b) => {
              const t = statusTint(b.status);
              const candidateName = b.candidate?.profile?.full_name || 'Candidate';
              const when = new Date(b.scheduled_at);
              const whenStr = isNaN(when.getTime())
                ? b.scheduled_at
                : `${when.toLocaleDateString()} • ${when.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

              return (
                <Card key={b.id} style={[styles.bookingCard, shadows.card as any]}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                      <Heading level={2}>{candidateName}</Heading>
                      <AppText style={styles.bookingMeta}>{whenStr}</AppText>
                    </View>

                    <View style={[styles.statusPill, { backgroundColor: t.bg }]}>
                      <AppText style={[styles.statusText, { color: t.fg }]}>{b.status || '—'}</AppText>
                    </View>
                  </View>

                  {b.notes ? (
                    <AppText style={[styles.bookingSub, { marginTop: spacing.sm }]} numberOfLines={3}>
                      {b.notes}
                    </AppText>
                  ) : null}

                  <View style={styles.bookingActions}>
                    <Button
                      title="Open details"
                      variant="outline"
                      onPress={() => {
                        // keep simple action; wire to detail page if/when you create it
                      }}
                    />
                  </View>
                </Card>
              );
            })}
          </Section>
        )}
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: spacing.lg, paddingBottom: spacing.sm },
  sub: { color: colors.textSecondary, marginTop: spacing.xs },

  emptyCard: { alignItems: 'center', gap: spacing.sm, padding: spacing.lg },
  emptyTitle: { fontWeight: '700' },

  bookingCard: { gap: spacing.sm },

  statusPill: {
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
  },
  statusText: {
    fontSize: typography.size.xs,
    fontWeight: '700',
  },
  bookingSub: { color: colors.textSecondary },
  bookingMeta: { color: colors.textTertiary, marginTop: spacing.xs },
  bookingActions: { marginTop: spacing.md, flexDirection: 'row', justifyContent: 'flex-end' },
});
