﻿// app/candidate/sessions.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
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

type Mentor = {
  id: string;
  professional_title?: string | null;
  mentor_level?: string | null;
};

type AvailabilityRow = {
  day_of_week: number; // 0 = Sunday, 1 = Monday ...
  start_time: string;  // HH:mm:ss
  end_time: string;    // HH:mm:ss
};

type UnavailabilityRow = {
  id: string;
  start_at: string; // ISO
  end_at: string;   // ISO
  reason?: string | null;
};

type ExistingSessionRow = {
  id: string;
  scheduled_at: string;
  duration_minutes: number | null;
  status: string;
};

type Slot = {
  id: string;
  startAt: string;   // ISO
  endAt: string;     // ISO
  dateKey: string;   // YYYY-MM-DD
  dateLabel: string; // "Tue, 11 Mar"
  timeLabel: string; // "8:00 PM – 9:00 PM"
};

type DaySlots = {
  dateKey: string;
  dateLabel: string;
  slots: Slot[];
};

// 🚨 IMPORTANT: Update these to match your Postgres enum values for "round"
type SessionRound = 'round_1' | 'round_2';

const DAYS_AHEAD = 14;

function formatTimeLabelFromTimeString(time: string) {
  // time = "20:00:00"
  const [hStr, mStr] = time.split(':');
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  if (Number.isNaN(h) || Number.isNaN(m)) return time;

  const hour12 = ((h + 11) % 12) + 1;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const mm = m.toString().padStart(2, '0');
  return `${hour12}:${mm} ${ampm}`;
}

function overlaps(startA: Date, endA: Date, startB: Date, endB: Date): boolean {
  return startA < endB && endA > startB;
}

export default function SessionsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ mentorId?: string; packageId?: string }>();
  const mentorIdParam = Array.isArray(params.mentorId) ? params.mentorId[0] : params.mentorId;
  const packageIdParam = Array.isArray(params.packageId) ? params.packageId[0] : params.packageId;

  const { profile } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [availability, setAvailability] = useState<AvailabilityRow[]>([]);
  const [unavailability, setUnavailability] = useState<UnavailabilityRow[]>([]);
  const [existingSessions, setExistingSessions] = useState<ExistingSessionRow[]>([]);
  const [daySlots, setDaySlots] = useState<DaySlots[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [selectedSlot1, setSelectedSlot1] = useState<Slot | null>(null);
  const [selectedSlot2, setSelectedSlot2] = useState<Slot | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!mentorIdParam) {
      setError('No mentor selected.');
      setLoading(false);
      return;
    }

    (async () => {
      setLoading(true);
      setError(null);
      try {
        await fetchMentorAndAvailability(mentorIdParam);
      } catch (e) {
        console.log('[candidate/sessions] load error', e);
        setError('Something went wrong while loading availability.');
      } finally {
        setLoading(false);
      }
    })();
  }, [mentorIdParam]);

  const fetchMentorAndAvailability = async (mentorId: string) => {
    // Mentor
    const { data: mentorData, error: mentorError } = await supabase
      .from('mentors')
      .select('id, professional_title, mentor_level')
      .eq('id', mentorId)
      .maybeSingle();

    if (mentorError) {
      console.log('[candidate/sessions] mentor fetch error', mentorError);
      setError('Could not load mentor details.');
      return;
    }
    if (!mentorData) {
      setError('Mentor not found.');
      return;
    }
    setMentor(mentorData as Mentor);

    // Weekly availability
    const { data: availabilityData, error: availabilityError } = await supabase
      .from('mentor_availability')
      .select('day_of_week, start_time, end_time, is_active')
      .eq('mentor_id', mentorId)
      .eq('is_active', true);

    if (availabilityError) {
      console.log('[candidate/sessions] availability fetch error', availabilityError);
      setError('Could not load mentor availability.');
      return;
    }

    const rows = (availabilityData || []) as any[];
    const mappedAvailability: AvailabilityRow[] = rows.map((row) => ({
      day_of_week: row.day_of_week,
      start_time: row.start_time,
      end_time: row.end_time,
    }));
    setAvailability(mappedAvailability);

    // Unavailability (future only)
    const nowISO = new Date().toISOString();

    const { data: unavailData, error: unavailError } = await supabase
      .from('mentor_unavailability')
      .select('id, start_at, end_at, reason')
      .eq('mentor_id', mentorId)
      .gte('end_at', nowISO)
      .order('start_at', { ascending: true });

    if (unavailError) {
      console.log('[candidate/sessions] unavailability fetch error', unavailError);
    }

    const unavailRows = (unavailData || []) as UnavailabilityRow[];
    setUnavailability(unavailRows);

    // Existing interview_sessions for this mentor (pending/confirmed)
    const { data: sessionData, error: sessionError } = await supabase
      .from('interview_sessions')
      .select('id, scheduled_at, duration_minutes, status')
      .eq('mentor_id', mentorId)
      .in('status', ['pending', 'confirmed'])
      .gte('scheduled_at', nowISO)
      .order('scheduled_at', { ascending: true });

    if (sessionError) {
      console.log('[candidate/sessions] sessions fetch error', sessionError);
    }

    const existing = (sessionData || []) as ExistingSessionRow[];
    setExistingSessions(existing);

    // Build actual slots
    const generated = buildSlots(mappedAvailability, unavailRows, existing);
    setDaySlots(generated);
  };

  const buildSlots = (
    availabilityRows: AvailabilityRow[],
    unavailRows: UnavailabilityRow[],
    busySessions: ExistingSessionRow[],
  ): DaySlots[] => {
    const result: DaySlots[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let offset = 0; offset < DAYS_AHEAD; offset++) {
      const date = new Date(today);
      date.setDate(today.getDate() + offset);

      const dayOfWeek = date.getDay(); // 0–6
      const matches = availabilityRows.filter((row) => row.day_of_week === dayOfWeek);
      if (matches.length === 0) continue;

      const dateKey = date.toISOString().slice(0, 10);
      const dateLabel = date.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      });

      const slotsForDay: Slot[] = [];

      for (const row of matches) {
        const startLocal = new Date(`${dateKey}T${row.start_time}`);
        const endLocal = new Date(`${dateKey}T${row.end_time}`);

        // Skip past slots
        const now = new Date();
        if (endLocal <= now) continue;

        // Blocked by time-off?
        const blockedByTimeOff = unavailRows.some((block) => {
          const blockStart = new Date(block.start_at);
          const blockEnd = new Date(block.end_at);
          return overlaps(startLocal, endLocal, blockStart, blockEnd);
        });
        if (blockedByTimeOff) continue;

        // Blocked by another interview_session?
        const blockedBySession = busySessions.some((session) => {
          if (!session.scheduled_at) return false;
          const dur = session.duration_minutes ?? 45;
          const sessionStart = new Date(session.scheduled_at);
          const sessionEnd = new Date(sessionStart.getTime() + dur * 60_000);
          return overlaps(startLocal, endLocal, sessionStart, sessionEnd);
        });
        if (blockedBySession) continue;

        slotsForDay.push({
          id: `${dateKey}-${row.start_time}-${row.end_time}`,
          startAt: startLocal.toISOString(),
          endAt: endLocal.toISOString(),
          dateKey,
          dateLabel,
          timeLabel: `${formatTimeLabelFromTimeString(
            row.start_time,
          )} – ${formatTimeLabelFromTimeString(row.end_time)}`,
        });
      }

      if (slotsForDay.length > 0) {
        result.push({ dateKey, dateLabel, slots: slotsForDay });
      }
    }

    return result;
  };

  const handleSelectSlot1 = (slot: Slot) => {
    setSelectedSlot1(slot);
    if (selectedSlot2 && selectedSlot2.id === slot.id) {
      setSelectedSlot2(null);
    }
  };

  const handleSelectSlot2 = (slot: Slot) => {
    if (selectedSlot1 && selectedSlot1.id === slot.id) return;
    setSelectedSlot2(slot);
  };

  const handleConfirm = async () => {
    if (!profile?.id) {
      Alert.alert('Sign in required', 'Please sign in before scheduling sessions.');
      return;
    }
    if (!mentorIdParam) {
      Alert.alert('No mentor', 'Something went wrong. Please go back and try again.');
      return;
    }
    if (!packageIdParam) {
      Alert.alert(
        'Package not selected',
        'We could not determine which package you are booking. Please start from the packages flow again.',
      );
      return;
    }
    if (!selectedSlot1 || !selectedSlot2) {
      Alert.alert('Select both sessions', 'Please choose two different time slots.');
      return;
    }
    if (selectedSlot1.id === selectedSlot2.id) {
      Alert.alert(
        'Slots must be different',
        'Please pick two different time slots for your sessions.',
      );
      return;
    }

    try {
      setSaving(true);

      const payload = [
        {
          package_id: packageIdParam,
          round: 'round_1' as SessionRound,
          mentor_id: mentorIdParam,
          candidate_id: profile.id,
          scheduled_at: selectedSlot1.startAt,
          duration_minutes: 45,
        },
        {
          package_id: packageIdParam,
          round: 'round_2' as SessionRound,
          mentor_id: mentorIdParam,
          candidate_id: profile.id,
          scheduled_at: selectedSlot2.startAt,
          duration_minutes: 45,
        },
      ];

      const { error: insertError } = await supabase
        .from('interview_sessions')
        .insert(payload);

      if (insertError) {
        console.log('[candidate/sessions] insert error', insertError);
        Alert.alert(
          'Could not save sessions',
          'Something went wrong while saving your sessions. Please try again.',
        );
        return;
      }

      Alert.alert(
        'Sessions booked',
        'Your two mock interviews have been scheduled. You can view them in My Bookings.',
        [
          { text: 'Go to My Bookings', onPress: () => router.push('/candidate/bookings') },
          { text: 'Stay here', style: 'cancel' },
        ],
      );
    } catch (e) {
      console.log('[candidate/sessions] confirm error', e);
      Alert.alert(
        'Error',
        'Something went wrong while saving your sessions. Please try again.',
      );
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <ScreenBackground>
        <Section
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ActivityIndicator color={colors.primary} size="large" />
          <AppText style={{ marginTop: spacing.md, color: colors.textSecondary }}>
            Loading available slots…
          </AppText>
        </Section>
      </ScreenBackground>
    );
  }

  if (error) {
    return (
      <ScreenBackground>
        <Section style={{ paddingTop: spacing.lg }}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="chevron-back" size={18} color={colors.textPrimary} />
            <AppText style={styles.backText}>Back</AppText>
          </TouchableOpacity>
        </Section>
        <Section>
          <Card style={styles.errorCard}>
            <Ionicons name="alert-circle-outline" size={32} color={colors.textSecondary} />
            <Heading level={2} style={{ marginTop: spacing.sm }}>
              Something went wrong
            </Heading>
            <AppText style={styles.errorText}>{error}</AppText>
          </Card>
        </Section>
      </ScreenBackground>
    );
  }

  if (!mentor) {
    return (
      <ScreenBackground>
        <Section style={{ paddingTop: spacing.lg }}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="chevron-back" size={18} color={colors.textPrimary} />
            <AppText style={styles.backText}>Back</AppText>
          </TouchableOpacity>
        </Section>
        <Section>
          <Heading>Schedule sessions</Heading>
          <AppText style={{ marginTop: spacing.sm }}>
            Mentor details could not be loaded.
          </AppText>
        </Section>
      </ScreenBackground>
    );
  }

  const hasSlots = daySlots.length > 0;

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Back link */}
        <Section style={{ paddingTop: spacing.md }}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="chevron-back" size={18} color={colors.textPrimary} />
            <AppText style={styles.backText}>Back to mentor</AppText>
          </TouchableOpacity>
        </Section>

        {/* Header */}
        <Section>
          <Card style={[styles.headerCard, shadows.card as any]}>
            <AppText style={styles.eyebrow}>Schedule your sessions</AppText>
            <Heading level={1} style={styles.title}>
              Choose 2 mock interview slots
            </Heading>
            <AppText style={styles.subtitle}>
              You&apos;re booking with{' '}
              <AppText style={styles.mentorNameInline}>
                {mentor.professional_title || 'this mentor'}
              </AppText>
              . Pick two different time slots that work for you.
            </AppText>
          </Card>
        </Section>

        {!hasSlots ? (
          <Section>
            <Card style={[styles.noSlotsCard, shadows.card as any]}>
              <Ionicons name="time-outline" size={28} color={colors.textSecondary} />
              <Heading level={2} style={{ marginTop: spacing.sm }}>
                No slots available yet
              </Heading>
              <AppText style={styles.noSlotsText}>
                This mentor hasn&apos;t opened any upcoming availability, or all available
                times are blocked with time off or existing sessions. Please check back later.
              </AppText>
            </Card>
          </Section>
        ) : (
          <>
            {/* First session */}
            <Section>
              <Card style={[styles.stepCard, shadows.card as any]}>
                <AppText style={styles.stepLabel}>Session 1</AppText>
                <Heading level={2} style={styles.stepTitle}>
                  Choose your first slot
                </Heading>
                <AppText style={styles.stepDescription}>
                  This will be your first mock interview with the mentor.
                </AppText>

                {daySlots.map((day) => (
                  <View key={day.dateKey} style={styles.dayBlock}>
                    <AppText style={styles.dayLabel}>{day.dateLabel}</AppText>
                    <View style={styles.slotRow}>
                      {day.slots.map((slot) => {
                        const selected = selectedSlot1?.id === slot.id;
                        return (
                          <TouchableOpacity
                            key={slot.id}
                            style={[
                              styles.slotChip,
                              selected && styles.slotChipSelected,
                            ]}
                            onPress={() => handleSelectSlot1(slot)}
                          >
                            <AppText
                              style={[
                                styles.slotChipText,
                                selected && styles.slotChipTextSelected,
                              ]}
                            >
                              {slot.timeLabel}
                            </AppText>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                ))}
              </Card>
            </Section>

            {/* Second session */}
            <Section>
              <Card style={[styles.stepCard, shadows.card as any]}>
                <AppText style={styles.stepLabel}>Session 2</AppText>
                <Heading level={2} style={styles.stepTitle}>
                  Choose your second slot
                </Heading>
                <AppText style={styles.stepDescription}>
                  Pick a different time for your second session. It can be the same day or a
                  different day, but not the exact same slot.
                </AppText>

                {daySlots.map((day) => (
                  <View key={day.dateKey} style={styles.dayBlock}>
                    <AppText style={styles.dayLabel}>{day.dateLabel}</AppText>
                    <View style={styles.slotRow}>
                      {day.slots.map((slot) => {
                        const isDisabled = selectedSlot1?.id === slot.id;
                        const selected = selectedSlot2?.id === slot.id;

                        return (
                          <TouchableOpacity
                            key={slot.id}
                            style={[
                              styles.slotChip,
                              selected && styles.slotChipSelected,
                              isDisabled && styles.slotChipDisabled,
                            ]}
                            disabled={isDisabled}
                            onPress={() => handleSelectSlot2(slot)}
                          >
                            <AppText
                              style={[
                                styles.slotChipText,
                                selected && styles.slotChipTextSelected,
                                isDisabled && styles.slotChipTextDisabled,
                              ]}
                            >
                              {slot.timeLabel}
                            </AppText>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                ))}
              </Card>
            </Section>

            {/* Confirm button */}
            <Section>
              <Button
                title={saving ? 'Saving…' : 'Confirm and continue to My Bookings'}
                onPress={handleConfirm}
                disabled={saving || !selectedSlot1 || !selectedSlot2}
                leftIcon={
                  saving ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={20}
                      color="#FFFFFF"
                    />
                  )
                }
                style={styles.confirmButton}
              />
              <AppText style={styles.confirmHint}>
                These sessions will appear in your bookings once saved.
              </AppText>
            </Section>
          </>
        )}
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.xl,
  },
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
  eyebrow: {
    fontSize: typography.size?.xs ?? 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: typography.size?.xl ?? 20,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.size?.sm ?? 14,
    color: colors.textSecondary,
  },
  mentorNameInline: {
    fontWeight: '600',
    color: colors.textPrimary,
  },
  noSlotsCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  noSlotsText: {
    marginTop: spacing.xs,
    fontSize: typography.size?.sm ?? 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  stepCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  stepLabel: {
    fontSize: typography.size?.xs ?? 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  stepTitle: {
    fontSize: typography.size?.lg ?? 18,
    marginBottom: spacing.xs,
  },
  stepDescription: {
    fontSize: typography.size?.sm ?? 14,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  dayBlock: {
    marginBottom: spacing.md,
  },
  dayLabel: {
    fontSize: typography.size?.sm ?? 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  slotRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  slotChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: (colors as any).backgroundSecondary ?? '#f9fafb',
  },
  slotChipSelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(76, 81, 191, 0.08)',
  },
  slotChipDisabled: {
    opacity: 0.4,
  },
  slotChipText: {
    fontSize: typography.size?.xs ?? 12,
    color: colors.textPrimary,
  },
  slotChipTextSelected: {
    fontWeight: '600',
  },
  slotChipTextDisabled: {
    color: colors.textSecondary,
  },
  confirmButton: {
    marginTop: spacing.sm,
  },
  confirmHint: {
    marginTop: spacing.xs,
    fontSize: typography.size?.xs ?? 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  errorCard: {
    marginTop: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  errorText: {
    marginTop: spacing.xs,
    fontSize: typography.size?.sm ?? 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
