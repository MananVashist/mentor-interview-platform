// app/mentor/bookings.tsx
import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography, shadows } from '@/lib/theme';
import { Heading, AppText, Section, Card, Button, ScreenBackground } from '@/lib/ui';
import { useAuthStore } from '@/lib/store';

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

  const statusConfig = (status?: string) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'scheduled':
      case 'confirmed':
        return { 
          bg: 'rgba(16,185,129,0.12)', 
          fg: colors.success,
          icon: 'checkmark-circle' as const,
          label: 'Scheduled'
        };
      case 'completed':
        return { 
          bg: 'rgba(14,147,132,0.12)', 
          fg: colors.primary,
          icon: 'checkmark-done-circle' as const,
          label: 'Completed'
        };
      case 'cancelled':
      case 'canceled':
        return { 
          bg: 'rgba(239,68,68,0.12)', 
          fg: colors.error,
          icon: 'close-circle' as const,
          label: 'Cancelled'
        };
      default:
        return { 
          bg: 'rgba(37,99,235,0.1)', 
          fg: '#2563eb',
          icon: 'time' as const,
          label: 'Pending'
        };
    }
  };

  // Calculate stats
  const upcomingCount = bookings.filter(b => 
    ['scheduled', 'confirmed'].includes((b.status || '').toLowerCase())
  ).length;
  const completedCount = bookings.filter(b => 
    (b.status || '').toLowerCase() === 'completed'
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
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }}>
        {/* Header */}
        <Section style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons name="calendar" size={32} color={colors.primary} />
          </View>
          <Heading level={1}>My Bookings</Heading>
          <AppText style={styles.headerSub}>
            Manage your scheduled and past interview sessions
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

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <Section>
            <Card style={[styles.emptyCard, shadows.card as any]}>
              <View style={styles.emptyIcon}>
                <Ionicons name="calendar-outline" size={48} color={colors.textTertiary} />
              </View>
              <Heading level={2} style={styles.emptyTitle}>No bookings yet</Heading>
              <AppText style={styles.emptyText}>
                Your scheduled interview sessions will appear here. Once candidates book you, you'll see all the details.
              </AppText>
              <View style={styles.emptyAction}>
                <TouchableOpacity style={styles.emptyLink}>
                  <Ionicons name="information-circle-outline" size={16} color={colors.primary} />
                  <AppText style={styles.emptyLinkText}>Learn about the booking process</AppText>
                </TouchableOpacity>
              </View>
            </Card>
          </Section>
        ) : (
          <Section>
            <View style={styles.bookingsList}>
              {bookings.map((booking) => {
                const config = statusConfig(booking.status);
                const candidateName = booking.candidate?.profile?.full_name || 'Candidate';
                const candidateEmail = booking.candidate?.profile?.email;
                const when = new Date(booking.scheduled_at);
                const isValidDate = !isNaN(when.getTime());
                const dateStr = isValidDate 
                  ? when.toLocaleDateString('en-IN', { 
                      weekday: 'short',
                      day: 'numeric', 
                      month: 'short',
                      year: 'numeric'
                    })
                  : booking.scheduled_at;
                const timeStr = isValidDate
                  ? when.toLocaleTimeString('en-IN', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })
                  : '';

                return (
                  <Card key={booking.id} style={[styles.bookingCard, shadows.card as any]}>
                    {/* Header with status */}
                    <View style={styles.bookingHeader}>
                      <View style={styles.bookingHeaderLeft}>
                        <View style={styles.candidateAvatar}>
                          <AppText style={styles.candidateAvatarText}>
                            {candidateName.charAt(0).toUpperCase()}
                          </AppText>
                        </View>
                        <View style={styles.candidateInfo}>
                          <AppText style={styles.candidateName}>{candidateName}</AppText>
                          {candidateEmail && (
                            <View style={styles.candidateEmail}>
                              <Ionicons name="mail-outline" size={12} color={colors.textTertiary} />
                              <AppText style={styles.candidateEmailText}>{candidateEmail}</AppText>
                            </View>
                          )}
                        </View>
                      </View>
                      
                      <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
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
                          <Ionicons name="calendar-outline" size={16} color={colors.primary} />
                        </View>
                        <AppText style={styles.detailText}>{dateStr}</AppText>
                      </View>
                      
                      {timeStr && (
                        <View style={styles.detailRow}>
                          <View style={styles.detailIcon}>
                            <Ionicons name="time-outline" size={16} color={colors.primary} />
                          </View>
                          <AppText style={styles.detailText}>{timeStr}</AppText>
                        </View>
                      )}
                    </View>

                    {/* Notes */}
                    {booking.notes && (
                      <View style={styles.bookingNotes}>
                        <Ionicons name="document-text-outline" size={14} color={colors.textTertiary} />
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
                          // Wire to detail page
                        }}
                        style={styles.actionButton}
                      />
                      {config.label === 'Scheduled' && (
                        <Button
                          title="Join Session"
                          size="sm"
                          onPress={() => {
                            // Wire to meeting link
                          }}
                          style={styles.actionButton}
                        />
                      )}
                    </View>
                  </Card>
                );
              })}
            </View>
          </Section>
        )}
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
    marginBottom: spacing.md,
  },
  emptyAction: {
    marginTop: spacing.sm,
  },
  emptyLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.sm,
  },
  emptyLinkText: {
    color: colors.primary,
    fontSize: typography.size.sm,
    fontWeight: '600',
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
  candidateAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  candidateAvatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  candidateInfo: {
    flex: 1,
  },
  candidateName: {
    fontSize: typography.size.md,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  candidateEmail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  candidateEmailText: {
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