// app/candidate/schedule.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, StyleSheet, ScrollView, TouchableOpacity, 
  ActivityIndicator, Alert, StatusBar, Platform 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { theme } from '@/lib/theme';
import { Heading, AppText } from '@/lib/ui';
import { supabase } from '@/lib/supabase/client';
import { paymentService } from '@/services/payment.service';
import { useAuthStore } from '@/lib/store';
import { availabilityService, type DayAvailability } from '@/services/availability.service';

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

  // 3. FETCH AVAILABILITY - OPTIMIZED
  const fetchAvailability = useCallback(async () => {
    if (!mentorId) return;
    setIsLoading(true);
    try {
      // 🧹 Lazy Cleanup
      const { error: cleanupError } = await supabase.rpc('delete_expired_pending_packages');
      if (cleanupError) console.warn('[Schedule] Cleanup failed:', cleanupError);

      // Use shared availability service
      const daysArray = await availabilityService.generateAvailability(mentorId);
      setAvailabilityData(daysArray);
      
      // Auto-select first available day
      const firstAvailable = daysArray.find(d => !d.isFullDayOff && d.slots.some(s => s.isAvailable));
      if (firstAvailable) setSelectedDay(firstAvailable);

    } catch (err) {
      console.error('[Schedule] Error fetching availability:', err);
      Alert.alert('Error', 'Failed to load availability');
    } finally {
      setIsLoading(false);
    }
  }, [mentorId]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  // --- EVENT HANDLERS ---
  const handleDayPress = (day: DayAvailability) => {
    setSelectedDay(day);
    setSelectedSlot(null); // Reset slot when day changes
  };

  const handleSlotPress = (time: string) => {
    if (!selectedDay) return;
    
    const slot = selectedDay.slots.find(s => s.time === time);
    if (!slot || !slot.isAvailable) return;

    setSelectedSlot({
      dateStr: selectedDay.dateStr,
      time: time,
      displayDate: selectedDay.monthDay,
      iso: slot.dateTime.toISO()!
    });
  };

  const handleConfirm = async () => {
    if (!selectedSlot) {
      Alert.alert('No Selection', 'Please select a time slot');
      return;
    }

    if (!currentUserId) {
      Alert.alert('Authentication Required', 'Please log in to book a session');
      return;
    }

    setBookingInProgress(true);

    try {
      const finalUserId = currentUserId;

      // 1. Verify mentor exists
      const { data: mentorExists } = await supabase
        .from('mentors')
        .select('id')
        .eq('id', mentorId)
        .maybeSingle();

      if (!mentorExists) throw new Error('Mentor not found');

      // 2. Ensure candidate profile exists
      const { data: existingCandidate } = await supabase
        .from('candidates')
        .select('id')
        .eq('id', finalUserId)
        .maybeSingle();

      if (!existingCandidate) {
        console.log('[Schedule] Candidate profile missing. Creating now...');
        
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