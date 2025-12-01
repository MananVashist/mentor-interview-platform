// app/candidate/schedule.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  View, StyleSheet, ScrollView, TouchableOpacity, 
  ActivityIndicator, Alert, StatusBar, Platform, 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { DateTime, Interval } from 'luxon'; 

import { theme } from '@/lib/theme';
import { Heading, AppText } from '@/lib/ui';
import { supabase } from '@/lib/supabase/client';
import { paymentService } from '@/services/payment.service';
import { useAuthStore } from '@/lib/store';

// ----------------------------------------------------------------------
// CONSTANTS & TYPES
// ----------------------------------------------------------------------
const SLOT_DURATION_MINUTES = 60; 
const BOOKING_WINDOW_DAYS = 30; 
const IST_ZONE = 'Asia/Kolkata';

type Slot = {
  time: string;       // "10:00"
  isAvailable: boolean;
  dateTime: DateTime; // Full Luxon object
  reason?: string;    // "Booked", "Time Off", etc.
};

type DayAvailability = {
  dateStr: string;    // "2025-12-01"
  weekdayName: string;// "Mon"
  monthDay: string;   // "Dec 1"
  slots: Slot[];
  isFullDayOff: boolean; 
};

type SelectedSession = {
  dateStr: string;  
  time: string;     
  displayDate: string; 
};

// ----------------------------------------------------------------------
// HELPER COMPONENTS
// ----------------------------------------------------------------------

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

// ----------------------------------------------------------------------
// MAIN SCREEN
// ----------------------------------------------------------------------

export default function ScheduleScreen() {
  const router = useRouter();
  const params = useLocalSearchParams(); 
  
  const mentorId = Array.isArray(params.mentorId) ? params.mentorId[0] : params.mentorId;
  const profileIdParam = Array.isArray(params.profileId) ? params.profileId[0] : params.profileId;

  const authStore = useAuthStore();
  const { user } = authStore;
  const [currentUserId, setCurrentUserId] = useState<string | null>(user?.id || null);

  const [isLoading, setIsLoading] = useState(true);
  const [mentor, setMentor] = useState<any>(null);
  
  const [availabilityData, setAvailabilityData] = useState<DayAvailability[]>([]);
  const [selectedDay, setSelectedDay] = useState<DayAvailability | null>(null);
  
  const [session1, setSession1] = useState<SelectedSession | null>(null);
  const [session2, setSession2] = useState<SelectedSession | null>(null);
  
  const [activeField, setActiveField] = useState<'session1' | 'session2'>('session1');
  const [bookingInProgress, setBookingInProgress] = useState(false);

  // 1. INITIAL SETUP & AUTH CHECK
  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setCurrentUserId(session.user.id);
      }
    }
    init();
  }, []);

  // 2. FETCH MENTOR DETAILS
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

  // 3. CORE LOGIC: FETCH & CALCULATE 30-DAY AVAILABILITY
  const fetchAvailability = useCallback(async () => {
    if (!mentorId) return;
    setIsLoading(true);
    try {
      const now = DateTime.now().setZone(IST_ZONE);
      const startDate = now.plus({ days: 1 }).startOf('day'); 
      const endDate = startDate.plus({ days: BOOKING_WINDOW_DAYS }).endOf('day');

      const { data: rulesData, error: rulesError } = await supabase
        .from('mentor_availability_rules')
        .select('weekdays, weekends')
        .eq('mentor_id', mentorId)
        .single();
      if (rulesError) throw rulesError;

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
        const rawRule = isWeekend ? rulesData?.weekends : rulesData?.weekdays;
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

    const newSelection: SelectedSession = {
      dateStr: selectedDay.dateStr,
      time: time,
      displayDate: selectedDay.monthDay
    };

    const isSameSlot = (session: SelectedSession | null) => 
      session?.time === time && session?.dateStr === selectedDay.dateStr;

    if (activeField === 'session1') {
      if (isSameSlot(session1)) {
        setSession1(null);
        return; 
      }
      if (isSameSlot(session2)) { setSession2(null); }
      setSession1(newSelection);
      setActiveField('session2'); 
    } else {
      if (isSameSlot(session2)) {
        setSession2(null);
        return;
      }
      if (isSameSlot(session1)) { setSession1(null); }
      setSession2(newSelection);
    }
  };

  const handleConfirm = async () => {
    if (!session1 || !session2) {
      Alert.alert('Incomplete', 'Please select 2 time slots.');
      return;
    }

    if (!user && !currentUserId) {
      Alert.alert('Sign In Required', 'Please log in to book an interview.');
      router.push('/auth/sign-in'); 
      return;
    }

    setBookingInProgress(true);

    try {
      const dt1 = DateTime.fromFormat(`${session1.dateStr} ${session1.time}`, "yyyy-MM-dd HH:mm", { zone: IST_ZONE });
      const dt2 = DateTime.fromFormat(`${session2.dateStr} ${session2.time}`, "yyyy-MM-dd HH:mm", { zone: IST_ZONE });
      const slots = [dt1.toISO(), dt2.toISO()].filter(Boolean) as string[];

      // 1. Create Package
      // 🟢 🟢 🟢  UPDATED: Destructure 'keyId' here
      const { package: pkg, orderId, amount, keyId, error } = await paymentService.createPackage(
        currentUserId || user?.id as string,
        mentorId as string,
        Number(profileIdParam),
        slots
      );

      if (error || !pkg) throw new Error(error?.message || 'Booking creation failed');

      if (pkg.payment_status === 'pending_payment') {
        // 2. Redirect to Payment Screen
        router.replace({
          pathname: '/candidate/pgscreen',
          params: {
            packageId: pkg.id,
            amount: amount, // ✅ Correct Paise Amount
            orderId: orderId, // ✅ Correct Order ID
            keyId: keyId // 🟢 ✅ Pass Key ID to Payment Screen
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

  // 5. RENDERING (Simplified for brevity as no logic changes here)
  if (isLoading) return <View style={styles.centerContainer}><ActivityIndicator size="large" color={theme.colors.primary} /></View>;
  if (!mentor) return <View style={styles.centerContainer}><AppText>Mentor not found.</AppText></View>;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <Heading level={2}>Select Dates</Heading>
          <AppText style={styles.subHeader}>Book with {mentor.title} • ₹{(mentor.price * 1.2).toLocaleString()} total</AppText>
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

        {/* Selection */}
        <View style={styles.selectionDisplay}>
          <TouchableOpacity style={[styles.selectionBox, activeField === 'session1' && styles.selectionBoxActive]} onPress={() => setActiveField('session1')}>
            <AppText style={styles.selectionLabel}>SESSION 1</AppText>
            <AppText style={session1 ? styles.selectionValue : [styles.selectionValue, { color: '#CCC', fontSize: 16 }]}>{session1 ? session1.time : 'Select Time'}</AppText>
            {session1 && <AppText style={styles.selectionDate}>{session1.displayDate}</AppText>}
          </TouchableOpacity>
          <Ionicons name="arrow-forward" size={20} color="#999" style={{ marginTop: 12 }} />
          <TouchableOpacity style={[styles.selectionBox, activeField === 'session2' && styles.selectionBoxActive]} onPress={() => setActiveField('session2')}>
            <AppText style={styles.selectionLabel}>SESSION 2</AppText>
            <AppText style={session2 ? styles.selectionValue : [styles.selectionValue, { color: '#CCC', fontSize: 16 }]}>{session2 ? session2.time : 'Select Time'}</AppText>
            {session2 && <AppText style={styles.selectionDate}>{session2.displayDate}</AppText>}
          </TouchableOpacity>
        </View>

        {/* Time Slots */}
        <View style={styles.section}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <AppText style={styles.sectionTitle}><Ionicons name="time-outline" size={16} /> Time Slots for {selectedDay?.monthDay}</AppText>
            {selectedDay?.isFullDayOff && <View style={styles.badgeErr}><AppText style={styles.badgeErrText}>Time Off</AppText></View>}
          </View>
          {(!selectedDay || (selectedDay.slots.length === 0 && !selectedDay.isFullDayOff)) ? (
             <View style={styles.emptyState}><AppText style={{ color: '#999' }}>No slots configured for this day.</AppText></View>
          ) : selectedDay.isFullDayOff ? (
            <View style={styles.emptyState}><AppText style={{ color: '#EF4444' }}>Mentor is unavailable on this date.</AppText></View>
          ) : (
            <View style={styles.grid}>
              {selectedDay.slots.map((slot) => {
                const isSel1 = session1?.time === slot.time && session1?.dateStr === selectedDay.dateStr;
                const isSel2 = session2?.time === slot.time && session2?.dateStr === selectedDay.dateStr;
                const isActive = isSel1 || isSel2;
                const isDisabled = !slot.isAvailable || (activeField === 'session1' ? isSel2 : isSel1);
                return (
                  <TouchableOpacity
                    key={`${selectedDay.dateStr}-${slot.time}`}
                    style={[styles.slot, !slot.isAvailable && styles.slotDisabled, isActive && styles.slotSelected]}
                    disabled={isDisabled && !isActive}
                    onPress={() => handleSlotPress(slot.time)}
                  >
                    <AppText style={[styles.slotText, !slot.isAvailable && styles.slotTextDisabled, isActive && { color: '#FFF', fontWeight: 'bold' }]}>
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
  dayCardDate: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 6 },
  dayCardStatus: { fontSize: 9, color: '#666', marginTop: 4 },
  dayCardTextSelected: { color: theme.colors.primary, fontWeight: '700' },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  selectionDisplay: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, backgroundColor: '#FFF', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#EEE' },
  selectionBox: { flex: 1, alignItems: 'center' },
  selectionBoxActive: { backgroundColor: '#F0FDFA', borderRadius: 8, paddingVertical: 8, marginTop: -8, marginBottom: -8 }, 
  selectionLabel: { fontSize: 10, fontWeight: '700', color: '#999', marginBottom: 4 },
  selectionValue: { fontSize: 20, fontWeight: '600', color: theme.colors.primary },
  selectionDate: { fontSize: 12, fontWeight: '500', color: '#666', marginTop: 2 },
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