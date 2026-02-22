// app/candidate/schedule.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, Alert, StatusBar, TextInput, Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/lib/theme';
import { Heading, AppText } from '@/lib/ui';
import { supabase } from '@/lib/supabase/client';
import { paymentService } from '@/services/payment.service';
import { useAuthStore } from '@/lib/store';
import { availabilityService, type DayAvailability } from '@/services/availability.service';
import { DateTime } from 'luxon';
import { trackEvent } from '@/lib/analytics';

type SessionType = 'intro' | 'mock' | 'bundle';

type SelectedSession = {
  dateStr: string;
  time: string;
  displayDate: string;
  iso: string;
};

const SESSION_TYPE_LABELS: Record<SessionType, string> = {
  intro: 'Intro Call',
  mock: 'Mock Interview',
  bundle: 'Bundle of 3',
};

const SESSION_TYPE_DURATION: Record<SessionType, string> = {
  intro: '25 min',
  mock: '55 min',
  bundle: '55 min each',
};

function DayCard({ day, isSelected, onPress }: { day: DayAvailability; isSelected: boolean; onPress: () => void }) {
  const availableCount = day.slots.filter(s => s.isAvailable).length;
  const isTimeOff = day.isFullDayOff;
  return (
    <TouchableOpacity
      style={[
        styles.dayCard,
        isSelected && styles.dayCardSelected,
        isTimeOff && styles.dayCardTimeOff,
        !isTimeOff && availableCount === 0 && styles.dayCardFull,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <AppText style={[styles.dayCardWeekday, isSelected && styles.dayCardTextSelected]}>{day.weekdayName}</AppText>
      <AppText style={[styles.dayCardDate, isSelected && styles.dayCardTextSelected]}>{day.monthDay}</AppText>
      <View style={[
        styles.statusDot,
        isTimeOff ? { backgroundColor: '#EF4444' }
          : availableCount > 0 ? { backgroundColor: '#10B981' }
          : { backgroundColor: '#9CA3AF' }
      ]} />
      <AppText style={[styles.dayCardStatus, isSelected && styles.dayCardTextSelected]}>
        {isTimeOff ? 'Off' : availableCount > 0 ? `${availableCount} open` : 'Full'}
      </AppText>
    </TouchableOpacity>
  );
}

export default function ScheduleScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const mentorId       = Array.isArray(params.mentorId)    ? params.mentorId[0]    : params.mentorId;
  const profileIdParam = Array.isArray(params.profileId)   ? params.profileId[0]   : params.profileId;
  const sessionTypeParam = Array.isArray(params.sessionType) ? params.sessionType[0] : params.sessionType;
  const sessionType: SessionType = (sessionTypeParam as SessionType) || 'mock';

  // Mock params (single skill)
  const skillIdParam   = Array.isArray(params.skillId)     ? params.skillId[0]     : params.skillId;
  const skillNameParam = Array.isArray(params.skillName)   ? params.skillName[0]   : params.skillName;

  // Bundle params (comma-separated skillIds, pipe-separated skillNames)
  const skillIdsParam  = Array.isArray(params.skillIds)    ? params.skillIds[0]    : params.skillIds;
  const skillNamesParam = Array.isArray(params.skillNames) ? params.skillNames[0]  : params.skillNames;

  const isBundle = sessionType === 'bundle';
  const isIntro  = sessionType === 'intro';

  // Parse bundle skill arrays
  const bundleSkillIds:   string[] = isBundle && skillIdsParam   ? skillIdsParam.split(',')   : [];
  const bundleSkillNames: string[] = isBundle && skillNamesParam ? skillNamesParam.split('|').map(decodeURIComponent) : [];

  // JD detection (mock only — JD not applicable to intro or bundle)
  const isJDBased = sessionType === 'mock' && (skillNameParam?.toLowerCase().includes('jd-based') ?? false);

  const authStore = useAuthStore();
  const { user } = authStore;
  const [currentUserId, setCurrentUserId] = useState<string | null>(user?.id || null);

  const [isLoading, setIsLoading] = useState(true);
  const [mentor, setMentor] = useState<any>(null);
  const [availabilityData, setAvailabilityData] = useState<DayAvailability[]>([]);
  const [selectedDay, setSelectedDay] = useState<DayAvailability | null>(null);

  // Single slot (intro / mock)
  const [selectedSlot, setSelectedSlot] = useState<SelectedSession | null>(null);

  // Multi-slot (bundle — 3 required)
  const [selectedSlots, setSelectedSlots] = useState<SelectedSession[]>([]);

  const [bookingInProgress, setBookingInProgress] = useState(false);

  // JD input
  const [jdText, setJdText] = useState('');
  const [jdError, setJdError] = useState('');

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) setCurrentUserId(session.user.id);
    }
    init();
  }, []);

  useEffect(() => {
    async function fetchMentor() {
      if (!mentorId) return;
      try {
        const { data } = await supabase
          .from('mentors')
          .select('session_price_inr, professional_title, profile:profiles(full_name)')
          .eq('id', mentorId)
          .single();

        setMentor({
          id: mentorId,
          name: data?.profile?.full_name || 'Mentor',
          title: data?.professional_title || 'Senior Interviewer',
          price: data?.session_price_inr || 1000,
        });
      } catch (e) { console.error(e); }
    }
    fetchMentor();
  }, [mentorId]);

  useEffect(() => {
    if (mentor) {
      trackEvent('schedule_screen', {
        mentor_id: mentor.id,
        session_type: sessionType,
        price: mentor.price,
      });
    }
  }, [mentor]);

  const fetchAvailability = useCallback(async () => {
    if (!mentorId) return;
    setIsLoading(true);
    try {
      const daysArray = await availabilityService.generateAvailability(mentorId);
      setAvailabilityData(daysArray);

      if (selectedDay) {
        const stillExists = daysArray.find(d => d.dateStr === selectedDay.dateStr);
        if (stillExists) setSelectedDay(stillExists);
      } else {
        const firstAvailable = daysArray.find(d => !d.isFullDayOff && d.slots.some(s => s.isAvailable));
        if (firstAvailable) setSelectedDay(firstAvailable);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to load availability');
    } finally {
      setIsLoading(false);
    }
  }, [mentorId, selectedDay]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const run = async () => {
        await availabilityService.cleanupExpiredSessions();
        if (isActive) await fetchAvailability();
      };
      run();
      return () => { isActive = false; };
    }, [mentorId])
  );

  const handleDayPress = (day: DayAvailability) => {
    setSelectedDay(day);
    if (!isBundle) setSelectedSlot(null);
  };

  const handleSlotPressSingle = (time: string) => {
    if (!selectedDay) return;
    const slot = selectedDay.slots.find(s => s.time === time);
    if (!slot || !slot.isAvailable) return;
    setSelectedSlot({ dateStr: selectedDay.dateStr, time, displayDate: selectedDay.monthDay, iso: slot.dateTime.toISO()! });
  };

  const handleSlotPressBundle = (time: string) => {
    if (!selectedDay) return;
    const slot = selectedDay.slots.find(s => s.time === time);
    if (!slot || !slot.isAvailable) return;

    const iso = slot.dateTime.toISO()!;
    const existingIndex = selectedSlots.findIndex(s => s.iso === iso);

    if (existingIndex >= 0) {
      setSelectedSlots(prev => prev.filter((_, i) => i !== existingIndex));
      return;
    }
    if (selectedSlots.length >= 3) {
      Alert.alert('3 slots maximum', 'Remove a slot first before adding another.');
      return;
    }
    setSelectedSlots(prev => [...prev, { dateStr: selectedDay.dateStr, time, displayDate: selectedDay.monthDay, iso }]);
  };

  const handleSlotPress = isBundle ? handleSlotPressBundle : handleSlotPressSingle;

  const verifySlotAvailability = async (slotIso: string): Promise<boolean> => {
    try {
      const slotQueryStr = DateTime.fromISO(slotIso).toFormat('yyyy-MM-dd HH:mm:ss');
      const { data, error } = await supabase
        .from('interview_sessions')
        .select('id, status, created_at')
        .eq('mentor_id', mentorId)
        .eq('scheduled_at', slotQueryStr)
        .in('status', ['awaiting_payment', 'pending', 'confirmed']);

      if (error) return false;
      if (data && data.length > 0) {
        const conflict = data[0];
        if (conflict.status === 'awaiting_payment') {
          const age = DateTime.now().toUTC().diff(DateTime.fromISO(conflict.created_at || '').toUTC(), 'minutes').minutes;
          if (age > 15) return true;
        }
        return false;
      }
      return true;
    } catch { return false; }
  };

  const handleConfirm = async () => {
      console.log('[Schedule] handleConfirm', {
  sessionType,
  skillIdsParam,
  bundleSkillIds,
  skillIdsToBook: isBundle ? bundleSkillIds : [],
});
    if (!currentUserId) {
      Alert.alert('Not logged in', 'Please log in to book a session.');
      return;
    }

    // Validate JD
    if (isJDBased && jdText.trim().length < 50) {
      setJdError('Please paste the full job description (at least 50 characters).');
      return;
    }
    setJdError('');

    // Validate slots
    if (isBundle && selectedSlots.length < 3) {
      Alert.alert('Select 3 slots', `Please select all 3 time slots. You've selected ${selectedSlots.length} so far.`);
      return;
    }
    if (!isBundle && !selectedSlot) {
      Alert.alert('No slot selected', 'Please select a time slot.');
      return;
    }

    setBookingInProgress(true);
    try {
      if (isBundle) {
        // Validate no duplicate slots
        const isoSet = new Set(selectedSlots.map(s => s.iso));
        if (isoSet.size !== 3) {
          Alert.alert('Duplicate slots', 'Please select 3 different time slots.');
          setBookingInProgress(false);
          return;
        }

        // Verify all slots are free
        const checks = await Promise.all(selectedSlots.map(s => verifySlotAvailability(s.iso)));
        const failedIdx = checks.findIndex(ok => !ok);
        if (failedIdx >= 0) {
          const bad = selectedSlots[failedIdx];
          Alert.alert(
            'Slot Unavailable',
            `Session ${failedIdx + 1} (${bad.time} on ${bad.displayDate}) was just booked.`,
            [{ text: 'Refresh', onPress: () => { setSelectedSlots([]); fetchAvailability(); } }]
          );
          setBookingInProgress(false);
          return;
        }

        trackEvent('begin_checkout', { mentor_id: mentorId, session_type: 'bundle', slot_count: 3 });
      } else {
        const isAvailable = await verifySlotAvailability(selectedSlot!.iso);
        if (!isAvailable) {
          Alert.alert('Slot Unavailable', 'This slot was just taken.', [{ text: 'Refresh', onPress: fetchAvailability }]);
          setSelectedSlot(null);
          setBookingInProgress(false);
          return;
        }
        trackEvent('begin_checkout', { mentor_id: mentorId, session_type: sessionType, slot_time: selectedSlot!.iso });
      }

      const { data: candidate } = await supabase.from('candidates').select('id').eq('id', currentUserId).maybeSingle();
      if (!candidate) await supabase.from('candidates').insert([{ id: currentUserId }]);

      const slotsToBook = isBundle ? selectedSlots.map(s => s.iso) : [selectedSlot!.iso];

      // For bundle: pass the array of skillIds (one per session slot)
      // For mock:   pass single skillId wrapped in array
      // For intro:  pass empty array (no skill)
      const skillIdsToBook: string[] = isBundle
        ? bundleSkillIds
        : isIntro
          ? []
          : skillIdParam
            ? [skillIdParam]
            : [];

      const { package: pkg, amount, orderId, keyId, error } = await paymentService.createPackage(
        currentUserId,
        mentorId as string,
        Number(profileIdParam),
        skillIdsToBook,
        slotsToBook,
        sessionType,
        isJDBased && jdText.trim() ? jdText.trim() : undefined,
      );

      if (error || !pkg) throw new Error(error?.message || 'Booking failed');

      if (pkg.payment_status === 'pending') {
        router.replace({
          pathname: '/candidate/pgscreen',
          params: {
            packageId: pkg.id,
            amount,
            orderId,
            keyId,
            mentorId,
            profileId: profileIdParam,
            skillId: skillIdParam,
            skillName: skillNameParam,
            sessionType,
          }
        });
      } else {
        Alert.alert('Success', 'Booking confirmed!', [{ text: 'OK', onPress: () => router.replace('/candidate/bookings') }]);
      }
    } catch (err: any) {
      Alert.alert('Booking Failed', err.message);
    } finally {
      setBookingInProgress(false);
    }
  };

  const isConfirmEnabled = isBundle
    ? selectedSlots.length === 3 && (!isJDBased || jdText.trim().length >= 50)
    : !!selectedSlot && (!isJDBased || jdText.trim().length >= 50);

  // Header subtitle text
  const headerSubtitle = (() => {
    if (isIntro) return `Intro call with ${mentor?.title || ''}`;
    if (isBundle) {
      const names = bundleSkillNames.join(' · ');
      return `${names} · ${mentor?.title || ''}`;
    }
    return `${skillNameParam ? `${skillNameParam} ` : ''}interview with ${mentor?.title || ''}`;
  })();

  if (isLoading) return <View style={styles.centerContainer}><ActivityIndicator size="large" color={theme.colors.primary} /></View>;
  if (!mentor) return <View style={styles.centerContainer}><AppText>Mentor not found.</AppText></View>;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.sessionTypePill}>
            <AppText style={styles.sessionTypePillText}>
              {SESSION_TYPE_LABELS[sessionType]} · {SESSION_TYPE_DURATION[sessionType]}
            </AppText>
          </View>
          <Heading level={2}>
            {isBundle ? 'Select 3 Time Slots' : 'Select Date & Time'}
          </Heading>
          <AppText style={styles.subHeader}>{headerSubtitle}</AppText>
        </View>

        {/* BUNDLE SKILL SUMMARY */}
        {isBundle && bundleSkillNames.length === 3 && (
          <View style={styles.bundleSkillSummary}>
            <AppText style={styles.bundleSkillSummaryTitle}>Your 3 Sessions</AppText>
            {bundleSkillNames.map((name, i) => (
              <View key={i} style={styles.bundleSkillSummaryRow}>
                <View style={styles.bundleSkillSummaryDot} />
                <AppText style={styles.bundleSkillSummaryText}>Session {i + 1}: {name}</AppText>
              </View>
            ))}
          </View>
        )}

        {/* JD INPUT — mock only */}
        {isJDBased && (
          <View style={styles.jdSection}>
            <AppText style={styles.jdLabel}>📄 Paste the Job Description</AppText>
            <AppText style={styles.jdSubLabel}>
              Your mentor will tailor interview questions to this specific role.
            </AppText>
            <TextInput
              style={[styles.jdInput, jdError ? styles.jdInputError : null]}
              multiline
              numberOfLines={Platform.OS === 'web' ? 8 : 6}
              placeholder="Paste the full job description here..."
              placeholderTextColor="#9CA3AF"
              value={jdText}
              onChangeText={(t) => { setJdText(t); if (jdError) setJdError(''); }}
              textAlignVertical="top"
            />
            {jdError ? <AppText style={styles.jdErrorText}>{jdError}</AppText> : null}
            <AppText style={styles.jdCharCount}>{jdText.length} characters</AppText>
          </View>
        )}

        {/* BUNDLE SLOT TRACKER */}
        {isBundle && (
          <View style={styles.bundleTracker}>
            <AppText style={styles.bundleTrackerTitle}>Selected Slots ({selectedSlots.length}/3)</AppText>
            <View style={styles.bundleSlotList}>
              {[0, 1, 2].map((i) => {
                const slot = selectedSlots[i];
                const skillName = bundleSkillNames[i] || `Session ${i + 1}`;
                return (
                  <View key={i} style={[styles.bundleSlotBox, slot ? styles.bundleSlotBoxFilled : styles.bundleSlotBoxEmpty]}>
                    <AppText style={styles.bundleSlotSkill} numberOfLines={1}>{skillName}</AppText>
                    {slot ? (
                      <>
                        <AppText style={styles.bundleSlotTime}>{slot.time}</AppText>
                        <AppText style={styles.bundleSlotDate}>{slot.displayDate}</AppText>
                        <TouchableOpacity
                          style={styles.bundleSlotRemove}
                          onPress={() => setSelectedSlots(prev => prev.filter((_, idx) => idx !== i))}
                        >
                          <AppText style={styles.bundleSlotRemoveText}>Remove</AppText>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <AppText style={styles.bundleSlotPlaceholder}>Pick a time</AppText>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* SINGLE SLOT DISPLAY */}
        {!isBundle && (
          <View style={styles.selectionDisplay}>
            <View style={[styles.selectionBox, selectedSlot ? styles.selectionBoxActive : {}]}>
              <AppText style={styles.selectionLabel}>SELECTED SLOT</AppText>
              {selectedSlot ? (
                <View style={{ alignItems: 'center' }}>
                  <AppText style={styles.selectionValue}>{selectedSlot.time}</AppText>
                  <AppText style={styles.selectionDate}>{selectedSlot.displayDate}</AppText>
                </View>
              ) : <AppText style={styles.selectionPlaceholder}>Tap a time below</AppText>}
            </View>
          </View>
        )}

        {/* DAY PICKER */}
        <View style={styles.section}>
          <AppText style={styles.sectionTitle}><Ionicons name="calendar-outline" size={16} /> Available Days</AppText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {availabilityData.map((day) => (
              <DayCard key={day.dateStr} day={day} isSelected={selectedDay?.dateStr === day.dateStr} onPress={() => handleDayPress(day)} />
            ))}
          </ScrollView>
        </View>

        {/* TIME SLOTS */}
        <View style={styles.section}>
          <AppText style={styles.sectionTitle}><Ionicons name="time-outline" size={16} /> Time Slots</AppText>
          {isBundle && selectedSlots.length < 3 && (
            <AppText style={styles.bundleHint}>
              Tap a slot to assign it to Session {selectedSlots.length + 1}. Slots can be on different days.
            </AppText>
          )}
          {(!selectedDay || (selectedDay.slots.length === 0 && !selectedDay.isFullDayOff)) ? (
            <View style={styles.emptyState}><AppText style={{ color: '#999' }}>No slots available.</AppText></View>
          ) : selectedDay.isFullDayOff ? (
            <View style={styles.emptyState}><AppText style={{ color: '#EF4444' }}>Mentor is unavailable.</AppText></View>
          ) : (
            <View style={styles.grid}>
              {selectedDay.slots.map((slot) => {
                const iso = slot.dateTime.toISO()!;
                const bundleIdx = isBundle ? selectedSlots.findIndex(s => s.iso === iso) : -1;
                const isSelected = isBundle ? bundleIdx >= 0 : (selectedSlot?.time === slot.time && selectedSlot?.dateStr === selectedDay.dateStr);

                return (
                  <TouchableOpacity
                    key={`${selectedDay.dateStr}-${slot.time}`}
                    style={[styles.slot, !slot.isAvailable && styles.slotDisabled, isSelected && styles.slotSelected]}
                    disabled={!slot.isAvailable}
                    onPress={() => handleSlotPress(slot.time)}
                  >
                    <AppText style={[styles.slotText, !slot.isAvailable && styles.slotTextDisabled, isSelected && styles.slotTextSelected]}>
                      {slot.time}
                    </AppText>
                    {isBundle && bundleIdx >= 0 && (
                      <AppText style={styles.slotBundleIndex}>{bundleIdx + 1}</AppText>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        {/* CONFIRM */}
        <View style={{ marginTop: 20 }}>
          <TouchableOpacity
            nativeID="btn-initiate-payment"
            style={[styles.btnPrimary, (!isConfirmEnabled || bookingInProgress) && { opacity: 0.6 }]}
            onPress={handleConfirm}
            disabled={!isConfirmEnabled || bookingInProgress}
          >
            {bookingInProgress
              ? <ActivityIndicator color="#FFF" />
              : <AppText style={styles.btnPrimaryText}>
                  {isBundle && selectedSlots.length < 3
                    ? `Select ${3 - selectedSlots.length} more slot${3 - selectedSlots.length > 1 ? 's' : ''}`
                    : 'Confirm Booking'}
                </AppText>
            }
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 20, paddingBottom: 60 },

  header: { marginBottom: 24 },
  sessionTypePill: { alignSelf: 'flex-start', backgroundColor: theme.colors.primary + '18', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, marginBottom: 8 },
  sessionTypePillText: { fontSize: 12, fontWeight: '700', color: theme.colors.primary },
  subHeader: { color: '#666', marginTop: 4, fontSize: 14 },

  // Bundle skill summary
  bundleSkillSummary: { backgroundColor: '#FFFBEB', borderRadius: 10, padding: 14, marginBottom: 20, borderWidth: 1, borderColor: '#FDE68A' },
  bundleSkillSummaryTitle: { fontSize: 12, fontWeight: '700', color: '#92400E', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.4 },
  bundleSkillSummaryRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  bundleSkillSummaryDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#D97706' },
  bundleSkillSummaryText: { fontSize: 13, color: '#78350F', fontWeight: '500' },

  // JD
  jdSection: { marginBottom: 24, backgroundColor: '#F5F3FF', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#DDD6FE' },
  jdLabel: { fontSize: 15, fontWeight: '700', color: '#4C1D95', marginBottom: 4 },
  jdSubLabel: { fontSize: 13, color: '#6B7280', marginBottom: 12 },
  jdInput: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#DDD6FE', borderRadius: 8, padding: 12, fontSize: 14, color: '#111827', minHeight: 140, lineHeight: 20 },
  jdInputError: { borderColor: '#EF4444' },
  jdErrorText: { fontSize: 12, color: '#EF4444', marginTop: 4 },
  jdCharCount: { fontSize: 11, color: '#9CA3AF', textAlign: 'right', marginTop: 4 },

  // Bundle tracker
  bundleTracker: { backgroundColor: '#FFF', borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', padding: 16, marginBottom: 24 },
  bundleTrackerTitle: { fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  bundleSlotList: { flexDirection: 'row', gap: 8 },
  bundleSlotBox: { flex: 1, borderRadius: 10, padding: 10, alignItems: 'center', minHeight: 90, justifyContent: 'center' },
  bundleSlotBoxFilled: { backgroundColor: '#F0FDFA', borderWidth: 1.5, borderColor: theme.colors.primary },
  bundleSlotBoxEmpty: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderStyle: 'dashed' as any },
  bundleSlotSkill: { fontSize: 10, fontWeight: '700', color: '#9CA3AF', marginBottom: 6, textTransform: 'uppercase', textAlign: 'center' },
  bundleSlotTime: { fontSize: 15, fontWeight: '700', color: theme.colors.primary },
  bundleSlotDate: { fontSize: 11, color: '#6B7280', marginTop: 2 },
  bundleSlotPlaceholder: { fontSize: 11, color: '#D1D5DB', fontStyle: 'italic' },
  bundleSlotRemove: { marginTop: 6 },
  bundleSlotRemoveText: { fontSize: 11, color: '#EF4444', fontWeight: '600' },
  bundleHint: { fontSize: 13, color: '#6B7280', marginBottom: 10, fontStyle: 'italic' },

  // Single slot display
  selectionDisplay: { flexDirection: 'row', justifyContent: 'center', marginBottom: 24 },
  selectionBox: { width: '100%', padding: 20, backgroundColor: '#FFF', borderRadius: 16, borderWidth: 1, borderColor: '#EEE', alignItems: 'center' },
  selectionBoxActive: { backgroundColor: '#F0FDFA', borderColor: theme.colors.primary },
  selectionLabel: { fontSize: 11, fontWeight: '700', color: '#999', marginBottom: 8, letterSpacing: 1 },
  selectionValue: { fontSize: 24, fontWeight: '600', color: theme.colors.primary },
  selectionDate: { fontSize: 14, fontWeight: '500', color: '#666', marginTop: 4 },
  selectionPlaceholder: { fontSize: 16, color: '#CCC', fontStyle: 'italic' },

  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#333', marginBottom: 12, textTransform: 'uppercase' },

  dayCard: { width: 64, height: 84, backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center', padding: 4 },
  dayCardSelected: { borderColor: theme.colors.primary, backgroundColor: '#F0FDFA', borderWidth: 2 },
  dayCardTimeOff: { backgroundColor: '#FEF2F2', borderColor: '#FECACA' },
  dayCardFull: { opacity: 0.6, backgroundColor: '#F3F4F6' },
  dayCardWeekday: { fontSize: 11, color: '#888', marginBottom: 2 },
  dayCardDate: { fontSize: 14, fontWeight: '700', color: '#333', marginBottom: 6 },
  dayCardStatus: { fontSize: 9, color: '#666', marginTop: 4 },
  dayCardTextSelected: { color: theme.colors.primary, fontWeight: '700' },
  statusDot: { width: 6, height: 6, borderRadius: 3 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  slot: { width: '30%', paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: theme.colors.primary, backgroundColor: '#FFF', alignItems: 'center', marginBottom: 8, position: 'relative' },
  slotDisabled: { borderColor: '#E5E7EB', backgroundColor: '#F9FAFB', opacity: 0.5 },
  slotSelected: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  slotText: { color: theme.colors.primary, fontWeight: '600', fontSize: 14 },
  slotTextDisabled: { color: '#CCC' },
  slotTextSelected: { color: '#FFF', fontWeight: 'bold' },
  slotBundleIndex: { position: 'absolute', top: 3, right: 6, fontSize: 10, fontWeight: '800', color: 'rgba(255,255,255,0.8)' },

  emptyState: { padding: 20, alignItems: 'center', borderWidth: 1, borderColor: '#EEE', borderRadius: 8, borderStyle: 'dashed' },

  btnPrimary: { backgroundColor: theme.colors.primary, paddingVertical: 16, borderRadius: 12, alignItems: 'center', shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
  btnPrimaryText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});