// app/candidate/bookings.tsx - NEW SCREEN
import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography, shadows } from '@/lib/theme';
import {
  Heading,
  AppText,
  Section,
  Card,
  Button,
  ScreenBackground,
} from '@/lib/ui';
import { useAuthStore } from '@/lib/store';
import { supabase } from '@/lib/supabase/client';

type Booking = {
  id: string;
  scheduled_at: string;
  status: string;
  notes?: string | null;
  package_id: string;
  mentor?: {
    id: string;
    profile?: {
      full_name?: string | null;
    };
  };
};

export default function CandidateBookingsScreen() {
  const { profile } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const fetchBookings = async () => {
    if (!profile?.id) return;

    try {
      // TODO: Replace with actual bookings query
      // For now, return empty array
      const { data, error } = await supabase
        .from('interview_sessions')
        .select('*, package:interview_packages(mentor:mentors(profile:profiles(*)))')
        .eq('candidate_id', profile.id)
        .order('scheduled_at', { ascending: true });

      if (error) {
        console.log('[candidate/bookings] fetch error', error);
        setBookings([]);
      } else {
        setBookings((data as any) || []);
      }
    } catch (err) {
      console.log('[candidate/bookings] error', err);
      setBookings([]);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchBookings();
      setLoading(false);
    })();
  }, [profile?.id]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBookings();
    setRefreshing(false);
  };

  const getStatusConfig = (status?: string) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'scheduled':
      case 'confirmed':
        return {
          bg: 'rgba(16,185,129,0.12)',
          fg: colors.success,
          icon: 'checkmark-circle' as const,
          label: 'Scheduled',
        };
      case 'completed':
        return {
          bg: 'rgba(14,147,132,0.12)',
          fg: colors.primary,
          icon: 'checkmark-done-circle' as const,
          label: 'Completed',
        };
      case 'cancelled':
      case 'canceled':
        return {
          bg: 'rgba(239,68,68,0.12)',
          fg: colors.error,
          icon: 'close-circle' as const,
          label: 'Cancelled',
        };
      default:
        return {
          bg: 'rgba(37,99,235,0.1)',
          fg: '#2563eb',
          icon: 'time' as const,
          label: 'Pending',
        };
    }
  };

  // Calculate stats
  const upcomingCount = bookings.filter((b) =>
    ['scheduled', 'confirmed', 'pending'].includes((b.status || '').toLowerCase())
  ).length;
  const completedCount = bookings.filter(
    (b) => (b.status || '').toLowerCase() === 'completed'
  ).length;

  if (loading) {
    return (
      <ScreenBackground>
        <Section style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={colors.primary} size="large" />
          <AppText style={{ marginTop: spacing.md, color: colors.textSecondary }}>
            Loading your bookings…
          </AppText>
        </Section>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        contentContainerStyle={{ paddingBottom: spacing.xl }}
      >
        {/* Header */}
        <Section style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons name="calendar" size={32} color={colors.primary} />
          </View>
          <Heading level={1}>My Bookings</Heading>
          <AppText style={styles.headerSub}>
            View and manage your scheduled interview sessions
          </AppText>
        </Section>

        {/* Stats Cards */}
        {bookings.length > 0 && (
          <Section>
            <View style={styles.statsGrid}>
              <Card style={[styles.statCard, styles.statCardPrimary, shadows.card as any]}>
                <View style={styles.statIcon}>
                  <Ionicons name="calendar-outline" size={24} color={colors.primary} />
                </View>
                <AppText style={styles.statValue}>{upcomingCount}</AppText>
                <AppText style={styles.statLabel}>Upcoming</AppText>
              </Card>

              <Card style={[styles.statCard, shadows.card as any]}>
                <View style={[styles.statIcon, { backgroundColor: 'rgba(16,185,129,0.1)' }]}>
                  <Ionicons name="checkmark-done" size={24} color={colors.success} />
                </View>
                <AppText style={styles.statValue}>{completedCount}</AppText>
                <AppText style={styles.statLabel}>Completed</AppText>
              </Card>

              <Card style={[styles.statCard, shadows.card as any]}>
                <View style={[styles.statIcon, { backgroundColor: 'rgba(37,99,235,0.1)' }]}>
                  <Ionicons name="people" size={24} color="#2563eb" />
                </View>
                <AppText style={styles.statValue}>{bookings.length}</AppText>
                <AppText style={styles.statLabel}>Total</AppText>
              </Card>
            </View>
          </Section>
        )}

        {/* Bookings List or Empty State */}
        <Section>
          {bookings.length === 0 ? (
            <Card style={[styles.emptyCard, shadows.card as any]}>
              <View style={styles.emptyIcon}>
                <Ionicons name="calendar-outline" size={64} color={colors.textTertiary} />
              </View>
              <Heading level={2} style={styles.emptyTitle}>No bookings yet</Heading>
              <AppText style={styles.emptyText}>
                You haven't booked any interview sessions yet. Browse mentors and book your first session to start preparing for your dream job!
              </AppText>
              <Button
                title="Browse Mentors"
                onPress={() => {
                  /* TODO: Navigate to mentor list */
                }}
                style={{ marginTop: spacing.md }}
              />
            </Card>
          ) : (
            <View style={styles.bookingsList}>
              {bookings.map((booking) => {
                const config = getStatusConfig(booking.status);
                const mentorName =
                  (booking.mentor as any)?.profile?.full_name || 'Mentor';
                const when = new Date(booking.scheduled_at);
                const isValidDate = !isNaN(when.getTime());
                const dateStr = isValidDate
                  ? when.toLocaleDateString('en-IN', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })
                  : booking.scheduled_at;
                const timeStr = isValidDate
                  ? when.toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '';

                return (
                  <Card key={booking.id} style={[styles.bookingCard, shadows.card as any]}>
                    {/* Header with mentor and status */}
                    <View style={styles.bookingHeader}>
                      <View style={styles.bookingHeaderLeft}>
                        <View style={styles.mentorAvatar}>
                          <AppText style={styles.mentorAvatarText}>
                            {mentorName.charAt(0).toUpperCase()}
                          </AppText>
                        </View>
                        <View style={styles.mentorInfo}>
                          <AppText style={styles.mentorName}>
                            Session with {mentorName}
                          </AppText>
                          <AppText style={styles.bookingType}>
                            Mock Interview Session
                          </AppText>
                        </View>
                      </View>

                      <View
                        style={[styles.statusBadge, { backgroundColor: config.bg }]}
                      >
                        <Ionicons name={config.icon} size={14} color={config.fg} />
                        <AppText style={[styles.statusText, { color: config.fg }]}>
                          {config.label}
                        </AppText>
                      </View>
                    </View>

                    {/* Date & Time */}
                    <View style={styles.bookingDetails}>
                      <View style={styles.detailRow}>
                        <View style={styles.detailIcon}>
                          <Ionicons
                            name="calendar-outline"
                            size={16}
                            color={colors.primary}
                          />
                        </View>
                        <AppText style={styles.detailText}>{dateStr}</AppText>
                      </View>

                      {timeStr && (
                        <View style={styles.detailRow}>
                          <View style={styles.detailIcon}>
                            <Ionicons
                              name="time-outline"
                              size={16}
                              color={colors.primary}
                            />
                          </View>
                          <AppText style={styles.detailText}>{timeStr}</AppText>
                        </View>
                      )}
                    </View>

                    {/* Notes */}
                    {booking.notes && (
                      <View style={styles.bookingNotes}>
                        <Ionicons
                          name="document-text-outline"
                          size={14}
                          color={colors.textTertiary}
                        />
                        <AppText style={styles.notesText} numberOfLines={2}>
                          {booking.notes}
                        </AppText>
                      </View>
                    )}

                    {/* Actions */}
                    <View style={styles.bookingActions}>
                      <Button
                        title="View Details"
                        variant="outline"
                        size="sm"
                        onPress={() => {
                          /* TODO: Navigate to booking detail */
                        }}
                        style={styles.actionButton}
                      />
                      {config.label === 'Scheduled' && (
                        <Button
                          title="Join Session"
                          size="sm"
                          onPress={() => {
                            /* TODO: Open meeting link */
                          }}
                          style={styles.actionButton}
                        />
                      )}
                    </View>
                  </Card>
                );
              })}
            </View>
          )}
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

  // Stats
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  statCardPrimary: {
    backgroundColor: 'rgba(14,147,132,0.05)',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(14,147,132,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: typography.size.xs,
    color: colors.textSecondary,
    fontWeight: '500',
  },

  // Empty state
  emptyCard: {
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  emptyIcon: {
    marginBottom: spacing.md,
    opacity: 0.6,
  },
  emptyTitle: {
    marginBottom: spacing.xs,
  },
  emptyText: {
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Bookings list
  bookingsList: {
    gap: spacing.md,
  },
  bookingCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
  },

  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  bookingHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.sm,
  },
  mentorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mentorAvatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  mentorInfo: {
    flex: 1,
  },
  mentorName: {
    fontSize: typography.size.md,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  bookingType: {
    fontSize: typography.size.xs,
    color: colors.textTertiary,
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusText: {
    fontSize: typography.size.xs,
    fontWeight: '700',
  },

  bookingDetails: {
    gap: spacing.xs,
    marginBottom: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  detailIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(14,147,132,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailText: {
    fontSize: typography.size.sm,
    color: colors.textPrimary,
    fontWeight: '500',
  },

  bookingNotes: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
    padding: spacing.sm,
    backgroundColor: 'rgba(37,99,235,0.05)',
    borderRadius: borderRadius.sm,
    marginBottom: spacing.md,
  },
  notesText: {
    flex: 1,
    fontSize: typography.size.xs,
    color: colors.textSecondary,
    lineHeight: 18,
  },

  bookingActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
});