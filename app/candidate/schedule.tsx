// app/candidate/schedule.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, StyleSheet, ScrollView, TouchableOpacity, 
  ActivityIndicator, Alert, StatusBar, Platform 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { DateTime, Interval } from 'luxon'; 

import { theme } from '@/lib/theme';
import { Heading, AppText } from '@/lib/ui';
import { supabase } from '@/lib/supabase/client';
import { paymentService } from '@/services/payment.service';
import { useAuthStore } from '@/lib/store';

// CONSTANTS
const SLOT_DURATION_MINUTES = 60; 
const BOOKING_WINDOW_DAYS = 30; 
const IST_ZONE = 'Asia/Kolkata';

type Slot = {
  time: string;
  isAvailable: boolean;
  dateTime: DateTime;
  reason?: string;
};

type DayAvailability = {
  dateStr: string;
  weekdayName: string;
  monthDay: string;
  slots: Slot[];
  isFullDayOff: boolean; 
};

// 🟢 NEW TYPE: Single Selection
type SelectedSession = {
  dateStr: string;  
  time: string;     
  displayDate: string; 
  iso: string; // Full ISO String required for DB
};

// HELPER COMPONENT (DayCard)
function DayCard({ day, isSelected, onPress }: { day: DayAvailability, isSelected: boolean, onPress: () => void }) {
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
      <AppText style={[styles.dayCardWeekday, isSelected && styles.dayCardTextSelected]}>
        {day.weekdayName}
      </AppText>
      <AppText style={[styles.dayCardDate, isSelected && styles.dayCardTextSelected]}>
        {day.monthDay}
      </AppText>
      
      <View style={[
        styles.statusDot, 
        isTimeOff ? { backgroundColor: '#EF4444' } : 
        availableCount > 0 ? { backgroundColor: '#10B981' } : { backgroundColor: '#9CA3AF' }
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
  
  const mentorId = Array.isArray(params.mentorId) ? params.mentorId[0] : params.mentorId;
  const profileIdParam = Array.isArray(params.profileId) ? params.profileId[0] : params.profileId;
  
  // 🟢 NEW PARAMS FROM PROFILE SCREEN
  const skillIdParam = Array.isArray(params.skillId) ? params.skillId[0] : params.skillId;
  const skillNameParam = Array.isArray(params.skillName) ? params.skillName[0] : params.skillName;

  const authStore = useAuthStore();
  const { user } = authStore;
  const [currentUserId, setCurrentUserId] = useState<string | null>(user?.id || null);

  const [isLoading, setIsLoading] = useState(true);
  const [mentor, setMentor] = useState<any>(null);
  
  const [availabilityData, setAvailabilityData] = useState<DayAvailability[]>([]);
  const [selectedDay, setSelectedDay] = useState<DayAvailability | null>(null);
  
  // 🟢 SINGLE SELECTION STATE
  const [selectedSlot, setSelectedSlot] = useState<SelectedSession | null>(null);
  const [bookingInProgress, setBookingInProgress] = useState(false);

  // 1. AUTH CHECK
  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setCurrentUserId(session.user.id);
      }
    }
    init();
  }, []);

  // 2. FETCH MENTOR
  useEffect(() => {
    async function fetchMentor() {
      if (!mentorId) return;
      try {
        const { data, error } = await supabase
          .from('mentors')
          .select('session_price_inr, professional_title, profile:profiles(full_name)')
          .eq('id', mentorId)
          .single();

        if (error) throw error;
        
        setMentor({
          id: mentorId,
          name: data.profile?.full_name || 'Mentor',
          title: data.professional_title || 'Senior Interviewer',
          price: data.session_price_inr || 1000,
        });
      } catch (e) {
        console.error('[Schedule] Error fetching mentor:', e);
      }
    }
    fetchMentor();
  }, [mentorId]);

  // 3. FETCH AVAILABILITY (Core Logic remains mostly same)
  const fetchAvailability = useCallback(async () => {
    if (!mentorId) return;
    setIsLoading(true);
    try {
      // 🧹 STEP 0: Lazy Cleanup
      // Delete any unpaid bookings older than 15 mins BEFORE calculating availability
      const { error: cleanupError } = await supabase.rpc('delete_expired_pending_packages');
      
      if (cleanupError) {
        console.warn('[Schedule] Cleanup failed (non-critical):', cleanupError);
      } else {
        console.log('[Schedule] Expired unpaid slots cleaned up.');
      }

      // ... The rest of your existing logic continues below ...
      const now = DateTime.now().setZone(IST_ZONE);
      const startDate = now.plus({ days: 1 }).startOf('day'); 
      const endDate = startDate.plus({ days: BOOKING_WINDOW_DAYS }).endOf('day');

      const { data: rulesData, error: rulesError } = await supabase
        .from('mentor_availability_rules')
        .select('weekdays, weekends')
        .eq('mentor_id', mentorId)
        .maybeSingle();
      if (rulesError && rulesError.code !== 'PGRST116') throw rulesError;

      const finalRulesData = rulesData || {
        weekdays: { start: '20:00', end: '22:00', isActive: true },
        weekends: { start: '12:00', end: '17:00', isActive: true }
        };

      const { data: unavailData } = await supabase
        .from('mentor_unavailability')
        .select('start_at, end_at')
        .eq('mentor_id', mentorId)
        .or(`start_at.lte.${endDate.toISO()},end_at.gte.${startDate.toISO()}`);
      
      const unavailabilityIntervals = (unavailData || []).map(row => {
        const s = DateTime.fromISO(row.start_at, { zone: IST_ZONE });
        const e = DateTime.fromISO(row.end_at, { zone: IST_ZONE });
        return Interval.fromDateTimes(s, e);
      });

      const { data: bookingsData } = await supabase
        .from('interview_sessions')
        .select('scheduled_at')
        .eq('mentor_id', mentorId)
        .gte('scheduled_at', startDate.toISO())
        .lte('scheduled_at', endDate.toISO())
        .in('status', ['pending', 'confirmed']);

      const bookedTimesSet = new Set(
        (bookingsData || []).map(b => DateTime.fromISO(b.scheduled_at, { zone: IST_ZONE }).toFormat('yyyy-MM-dd HH:mm'))
      );

      const computedDays: DayAvailability[] = [];

      for (let i = 0; i < BOOKING_WINDOW_DAYS; i++) {
        const currentDay = startDate.plus({ days: i });
        const dateStr = currentDay.toISODate(); 
        
        const dayInterval = Interval.fromDateTimes(currentDay.startOf('day'), currentDay.endOf('day'));
        const isFullDayOff = unavailabilityIntervals.some(u => u.engulfs(dayInterval) || (u.contains(currentDay.startOf('day')) && u.contains(currentDay.endOf('day'))));

        if (isFullDayOff) {
          computedDays.push({
            dateStr: dateStr!,
            weekdayName: currentDay.toFormat('ccc'),
            monthDay: currentDay.toFormat('MMM d'),
            slots: [],
            isFullDayOff: true,
          });
          continue; 
        }

        const isWeekend = currentDay.weekday >= 6; 
        const rawRule = isWeekend ? finalRulesData?.weekends : finalRulesData?.weekdays;
        let dayRules: any[] = [];
        if (Array.isArray(rawRule)) { dayRules = rawRule; } 
        else if (rawRule && typeof rawRule === 'object') { dayRules = [rawRule]; }

        const generatedSlots: Slot[] = [];

        dayRules.forEach((rule) => {
          const isActive = rule.isActive === true || rule.isActive === 'true' || rule.isActive === 't';
          if (!isActive) return;

          const startStr = String(rule.start); 
          const endStr = String(rule.end);     
          const ruleStartDT = DateTime.fromFormat(`${dateStr} ${startStr}`, "yyyy-MM-dd HH:mm", { zone: IST_ZONE });
          const ruleEndDT = DateTime.fromFormat(`${dateStr} ${endStr}`, "yyyy-MM-dd HH:mm", { zone: IST_ZONE });
          const duration = rule.slot_duration || rule.slot_duration_minutes || SLOT_DURATION_MINUTES;

          if (!ruleStartDT.isValid || !ruleEndDT.isValid) return;

          let cursor = ruleStartDT;
          while (cursor < ruleEndDT) {
            const slotStart = cursor;
            const slotEnd = cursor.plus({ minutes: duration });
            if (slotEnd > ruleEndDT) break; 

            const slotKey = slotStart.toFormat('yyyy-MM-dd HH:mm');
            const timeLabel = slotStart.toFormat('HH:mm');
            
            const isBooked = bookedTimesSet.has(slotKey);
            const slotInterval = Interval.fromDateTimes(slotStart, slotEnd);
            const isTimeOffSlot = unavailabilityIntervals.some(u => u.overlaps(slotInterval));

            generatedSlots.push({
              time: timeLabel,
              isAvailable: !isBooked && !isTimeOffSlot,
              dateTime: slotStart,
              reason: isBooked ? 'Booked' : isTimeOffSlot ? 'Time Off' : 'Available'
            });
            cursor = slotEnd;
          }
        });

        const uniqueSlots = Array.from(new Map(generatedSlots.map(s => [s.time, s])).values())
                                .sort((a, b) => a.dateTime.toMillis() - b.dateTime.toMillis());

        computedDays.push({
          dateStr: dateStr!,
          weekdayName: currentDay.toFormat('ccc'),
          monthDay: currentDay.toFormat('MMM d'),
          slots: uniqueSlots,
          isFullDayOff: false,
        });
      }

      setAvailabilityData(computedDays);
      const firstActive = computedDays.find(d => !d.isFullDayOff && d.slots.some(s => s.isAvailable));
      if (firstActive) setSelectedDay(firstActive);
      else setSelectedDay(computedDays[0]); 

    } catch (err) {
      console.error('[Schedule] Critical Error:', err);
      Alert.alert('Error', 'Failed to load schedule. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [mentorId]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  // 4. UI HANDLERS 
  const handleDayPress = (day: DayAvailability) => {
    setSelectedDay(day);
  };

  const handleSlotPress = (time: string) => {
    if (!selectedDay) return;

    // Toggle logic: if clicking the same slot, deselect it
    if (selectedSlot?.time === time && selectedSlot?.dateStr === selectedDay.dateStr) {
        setSelectedSlot(null);
        return;
    }

    const dt = DateTime.fromFormat(`${selectedDay.dateStr} ${time}`, "yyyy-MM-dd HH:mm", { zone: IST_ZONE });

    setSelectedSlot({
      dateStr: selectedDay.dateStr,
      time: time,
      displayDate: selectedDay.monthDay,
      iso: dt.toISO()!
    });
  };

  // app/candidate/schedule.tsx

// ... (imports remain the same)

// ... inside ScheduleScreen component ...

  const handleConfirm = async () => {
    if (!selectedSlot) {
      Alert.alert('Incomplete', 'Please select a time slot.');
      return;
    }

    // 1. Get Fresh User Data
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    const finalUserId = currentUser?.id || currentUserId || user?.id;

    if (!finalUserId) {
      Alert.alert('Sign In Required', 'Please log in to book an interview.');
      router.push('/auth/sign-in'); 
      return;
    }

    setBookingInProgress(true);

    try {
      // 2. AUTO-FIX: Ensure candidate row exists
      const { data: existingCandidate } = await supabase
        .from('candidates')
        .select('id')
        .eq('id', finalUserId)
        .maybeSingle();

      if (!existingCandidate) {
        console.log('[Schedule] Candidate profile missing. Creating now...');
        
        // 🟢 FIX: Removed 'email' because your table doesn't have that column
        const { error: createError } = await supabase
          .from('candidates')
          .insert([{ 
            id: finalUserId, 
            created_at: new Date().toISOString() 
          }]);

        if (createError) {
          console.error('[Schedule] Profile creation failed:', createError);
          throw new Error("Could not verify user profile. Please try logging out and back in.");
        }
      }

      // 3. Proceed with Booking
      const { package: pkg, orderId, amount, keyId, error } = await paymentService.createPackage(
        finalUserId as string,
        mentorId as string,
        Number(profileIdParam),
        skillIdParam as string,
        selectedSlot.iso 
      );

      if (error || !pkg) throw new Error(error?.message || 'Booking creation failed');

      if (pkg.payment_status === 'pending') {
        router.replace({
          pathname: '/candidate/pgscreen',
          params: {
            packageId: pkg.id,
            amount: amount, 
            orderId: orderId, 
            keyId: keyId 
          }
        });
      } else {
        Alert.alert('Success', 'Booking confirmed!', [
          { text: 'OK', onPress: () => router.replace('/candidate/bookings') }
        ]);
      }

    } catch (err: any) {
      console.error('[Schedule] Booking Exception:', err);
      Alert.alert('Booking Failed', err.message);
    } finally {
      setBookingInProgress(false);
    }
  };

  if (isLoading) return <View style={styles.centerContainer}><ActivityIndicator size="large" color={theme.colors.primary} /></View>;
  if (!mentor) return <View style={styles.centerContainer}><AppText>Mentor not found.</AppText></View>;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <Heading level={2}>Select Date & Time</Heading>
          {/* 🟢 Skill Name in SubHeader */}
          <AppText style={styles.subHeader}>
             {skillNameParam ? `${skillNameParam} interview` : 'Interview'} with {mentor.title}
          </AppText>
        </View>

        {/* Date Picker */}
        <View style={styles.section}>
          <AppText style={styles.sectionTitle}><Ionicons name="calendar-outline" size={16} /> Available Days (Next 30)</AppText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 4 }}>
            {availabilityData.map((day) => (
              <DayCard key={day.dateStr} day={day} isSelected={selectedDay?.dateStr === day.dateStr} onPress={() => handleDayPress(day)}/>
            ))}
          </ScrollView>
        </View>

        {/* 🟢 NEW: Single Slot Selection Display */}
        <View style={styles.selectionDisplay}>
            <View style={[styles.selectionBox, selectedSlot ? styles.selectionBoxActive : {}]}>
                <AppText style={styles.selectionLabel}>SELECTED SLOT</AppText>
                {selectedSlot ? (
                    <View style={{ alignItems: 'center' }}>
                        <AppText style={styles.selectionValue}>{selectedSlot.time}</AppText>
                        <AppText style={styles.selectionDate}>{selectedSlot.displayDate}</AppText>
                    </View>
                ) : (
                    <AppText style={styles.selectionPlaceholder}>Tap a time below</AppText>
                )}
            </View>
        </View>

        {/* Time Slots */}
        <View style={styles.section}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <AppText style={styles.sectionTitle}><Ionicons name="time-outline" size={16} /> Time Slots</AppText>
            {selectedDay?.isFullDayOff && <View style={styles.badgeErr}><AppText style={styles.badgeErrText}>Time Off</AppText></View>}
          </View>
          {(!selectedDay || (selectedDay.slots.length === 0 && !selectedDay.isFullDayOff)) ? (
             <View style={styles.emptyState}><AppText style={{ color: '#999' }}>No slots configured for this day.</AppText></View>
          ) : selectedDay.isFullDayOff ? (
            <View style={styles.emptyState}><AppText style={{ color: '#EF4444' }}>Mentor is unavailable on this date.</AppText></View>
          ) : (
            <View style={styles.grid}>
              {selectedDay.slots.map((slot) => {
                const isSelected = selectedSlot?.time === slot.time && selectedSlot?.dateStr === selectedDay.dateStr;
                return (
                  <TouchableOpacity
                    key={`${selectedDay.dateStr}-${slot.time}`}
                    style={[
                        styles.slot, 
                        !slot.isAvailable && styles.slotDisabled, 
                        isSelected && styles.slotSelected
                    ]}
                    disabled={!slot.isAvailable}
                    onPress={() => handleSlotPress(slot.time)}
                  >
                    <AppText style={[
                        styles.slotText, 
                        !slot.isAvailable && styles.slotTextDisabled, 
                        isSelected && { color: '#FFF', fontWeight: 'bold' }
                    ]}>
                      {slot.time}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        <View style={{ marginTop: 20 }}>
          <TouchableOpacity style={[styles.btnPrimary, bookingInProgress && { opacity: 0.7 }]} onPress={handleConfirm} disabled={bookingInProgress}>
            {bookingInProgress ? <ActivityIndicator color="#FFF" /> : <AppText style={styles.btnPrimaryText}>Confirm Booking</AppText>}
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
  subHeader: { color: '#666', marginTop: 4, fontSize: 14 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#333', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  dayCard: { width: 64, height: 84, backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center', padding: 4 },
  dayCardSelected: { borderColor: theme.colors.primary, backgroundColor: '#F0FDFA', borderWidth: 2 },
  dayCardTimeOff: { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }, 
  dayCardFull: { opacity: 0.6, backgroundColor: '#F3F4F6' },
  dayCardWeekday: { fontSize: 11, color: '#888', marginBottom: 2 },
  dayCardDate: { fontSize: 14, fontWeight: '700', color: '#333', marginBottom: 6 },
  dayCardStatus: { fontSize: 9, color: '#666', marginTop: 4 },
  dayCardTextSelected: { color: theme.colors.primary, fontWeight: '700' },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  selectionDisplay: { flexDirection: 'row', justifyContent: 'center', marginBottom: 24 },
  selectionBox: { width: '100%', padding: 20, backgroundColor: '#FFF', borderRadius: 16, borderWidth: 1, borderColor: '#EEE', alignItems: 'center' },
  selectionBoxActive: { backgroundColor: '#F0FDFA', borderColor: theme.colors.primary }, 
  selectionLabel: { fontSize: 11, fontWeight: '700', color: '#999', marginBottom: 8, letterSpacing: 1 },
  selectionValue: { fontSize: 24, fontWeight: '600', color: theme.colors.primary },
  selectionDate: { fontSize: 14, fontWeight: '500', color: '#666', marginTop: 4 },
  selectionPlaceholder: { fontSize: 16, color: '#CCC', fontStyle: 'italic' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  slot: { width: '30%', paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: theme.colors.primary, backgroundColor: '#FFF', alignItems: 'center', marginBottom: 8 },
  slotDisabled: { borderColor: '#EEE', backgroundColor: '#F9FAFB' },
  slotSelected: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  slotText: { color: theme.colors.primary, fontWeight: '600' },
  slotTextDisabled: { color: '#CCC', textDecorationLine: 'line-through' },
  badgeErr: { backgroundColor: '#FEF2F2', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  badgeErrText: { color: '#EF4444', fontSize: 10, fontWeight: 'bold' },
  emptyState: { padding: 20, alignItems: 'center', borderWidth: 1, borderColor: '#EEE', borderRadius: 8, borderStyle: 'dashed' },
  btnPrimary: { backgroundColor: theme.colors.primary, paddingVertical: 16, borderRadius: 12, alignItems: 'center', shadowColor: theme.colors.primary, shadowOffset: { width:0, height:4 }, shadowOpacity:0.2, shadowRadius:8 },
  btnPrimaryText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});