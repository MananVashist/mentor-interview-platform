// app/candidate/schedule.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, StyleSheet, ScrollView, TouchableOpacity, 
  ActivityIndicator, Alert, StatusBar 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { DateTime } from 'luxon';

import { theme } from '@/lib/theme';
import { Heading, AppText } from '@/lib/ui';
import { availabilityService, TimeSlot } from '@/services/availability.service';

export default function ScheduleScreen() {
  const router = useRouter();
  const params = useLocalSearchParams(); 
  const mentorId = Array.isArray(params.mentorId) ? params.mentorId[0] : params.mentorId;

  const [isLoading, setIsLoading] = useState(true);
  
  // ✅ FIX 1: Initialize Date specifically in Indian Standard Time (IST)
  const [selectedDate, setSelectedDate] = useState(
    DateTime.now().setZone('Asia/Kolkata')
  );
  
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  
  // Selection State
  const [session1, setSession1] = useState<string | null>(null);
  const [session2, setSession2] = useState<string | null>(null);
  const [activeField, setActiveField] = useState<'session1' | 'session2'>('session1');

  // 1. Fetch Slots
  useEffect(() => {
    if (mentorId) fetchSlots();
    setIsLoading(false);
  }, [selectedDate, mentorId]);

  const fetchSlots = async () => {
    setLoadingSlots(true);
    try {
      const dateStr = selectedDate.toISODate(); // Returns YYYY-MM-DD based on IST
      if (dateStr && mentorId) {
        const data = await availabilityService.getSlotsForDate(mentorId, dateStr);
        setSlots(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingSlots(false);
    }
  };

  // 2. Handle Slot Tap
  const handleSlotPress = (time: string) => {
    if (activeField === 'session1') {
      if (session2 === time) setSession2(null); // Prevent duplicate
      setSession1(time);
      setActiveField('session2'); // Auto-advance
    } else {
      if (session1 === time) setSession1(null);
      setSession2(time);
    }
  };

  // 3. Proceed to Payment
  const handleProceed = () => {
    if (!session1 || !session2) {
      Alert.alert("Select Slots", "Please select 2 time slots to proceed.");
      return;
    }
    
    const dateStr = selectedDate.toISODate();
    if (!dateStr) return;

    // ✅ FIX 2: Construct ISO timestamps strictly in IST
    // This ensures the backend receives '2025-11-23T14:00:00+05:30'
    const dt1 = DateTime.fromFormat(`${dateStr} ${session1}`, "yyyy-MM-dd HH:mm", { zone: 'Asia/Kolkata' });
    const dt2 = DateTime.fromFormat(`${dateStr} ${session2}`, "yyyy-MM-dd HH:mm", { zone: 'Asia/Kolkata' });

    // Navigate to Payment Screen
    router.push({
      pathname: '/candidate/pgscreen', // ✅ Pointing to your actual payment screen file
      params: { 
        mentorId,
        // Send full ISO string so backend knows the absolute time
        slot1: dt1.toISO(), 
        slot2: dt2.toISO() 
      }
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <Heading level={1} style={styles.pageTitle}>Select Times</Heading>
          <AppText style={styles.pageSubtitle}>Choose 2 slots for your sessions.</AppText>
        </View>

        {/* Selectors */}
        <View style={styles.selectorsRow}>
          <TouchableOpacity 
            style={[styles.selectorBox, activeField === 'session1' && styles.selectorBoxActive]}
            onPress={() => setActiveField('session1')}
            activeOpacity={0.9}
          >
            <AppText style={styles.selectorLabel}>SESSION 1 (IST)</AppText>
            <View style={styles.selectorValueRow}>
              <Ionicons name="time-outline" size={18} color={activeField === 'session1' ? theme.colors.primary : '#9CA3AF'} />
              <AppText style={[styles.selectorValue, !session1 && styles.placeholder]}>
                {session1 || "Select"}
              </AppText>
            </View>
          </TouchableOpacity>

          <Ionicons name="arrow-forward" size={20} color="#D1D5DB" style={{ marginTop: 14 }} />

          <TouchableOpacity 
            style={[styles.selectorBox, activeField === 'session2' && styles.selectorBoxActive]}
            onPress={() => setActiveField('session2')}
            activeOpacity={0.9}
          >
            <AppText style={styles.selectorLabel}>SESSION 2 (IST)</AppText>
            <View style={styles.selectorValueRow}>
              <Ionicons name="time-outline" size={18} color={activeField === 'session2' ? theme.colors.primary : '#9CA3AF'} />
              <AppText style={[styles.selectorValue, !session2 && styles.placeholder]}>
                {session2 || "Select"}
              </AppText>
            </View>
          </TouchableOpacity>
        </View>

        {/* Calendar Navigation */}
        <View style={styles.calendarSection}>
          <View style={styles.dateNav}>
            {/* ✅ FIX 3: Ensure date math keeps the timezone */}
            <TouchableOpacity style={styles.navBtn} onPress={() => setSelectedDate(d => d.minus({ days: 1 }))}>
              <Ionicons name="chevron-back" size={20} color={theme.colors.text.main} />
            </TouchableOpacity>
            
            <View style={styles.dateDisplay}>
              <AppText style={styles.dateDay}>{selectedDate.toFormat('cccc')}</AppText>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
                <AppText style={styles.dateDate}>{selectedDate.toFormat('MMM d')}</AppText>
                {/* Visual Indicator for Timezone */}
                <View style={styles.istBadge}>
                    <AppText style={styles.istText}>IST</AppText>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.navBtn} onPress={() => setSelectedDate(d => d.plus({ days: 1 }))}>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.text.main} />
            </TouchableOpacity>
          </View>

          {/* Slots Grid */}
          <View style={styles.slotsContainer}>
            {loadingSlots ? (
              <ActivityIndicator color={theme.colors.primary} style={{ margin: 20 }} />
            ) : slots.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="moon-outline" size={32} color={theme.colors.text.light} />
                <AppText style={styles.emptyText}>No slots available.</AppText>
              </View>
            ) : (
              <View style={styles.slotsGrid}>
                {slots.map((slot, idx) => {
                  const isSelected1 = session1 === slot.time;
                  const isSelected2 = session2 === slot.time;
                  const isDisabled = !slot.isAvailable || (activeField === 'session1' ? isSelected2 : isSelected1);

                  return (
                    <TouchableOpacity
                      key={idx}
                      activeOpacity={0.7}
                      disabled={isDisabled}
                      onPress={() => handleSlotPress(slot.time)}
                      style={[
                        styles.slotBadge,
                        !slot.isAvailable && styles.slotDisabled,
                        ((activeField === 'session1' && isSelected1) || (activeField === 'session2' && isSelected2)) && styles.slotActiveSelect,
                        (isDisabled && slot.isAvailable) && styles.slotTaken
                      ]}
                    >
                      <AppText style={[
                        styles.slotText,
                        !slot.isAvailable && styles.slotTextDisabled,
                        ((activeField === 'session1' && isSelected1) || (activeField === 'session2' && isSelected2)) && styles.slotTextSelected,
                        (isDisabled && slot.isAvailable) && styles.slotTextTaken
                      ]}>
                        {slot.time}
                      </AppText>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footerContainer}>
           <TouchableOpacity 
            style={[styles.proceedBtn, (!session1 || !session2) && styles.proceedBtnDisabled]}
            onPress={handleProceed}
          >
            <AppText style={styles.proceedBtnText}>Proceed to Payment</AppText>
            <Ionicons name="arrow-forward" size={18} color="#FFF" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  header: { marginBottom: 20 },
  pageTitle: { fontSize: 24, marginBottom: 4 },
  pageSubtitle: { fontSize: 15, color: theme.colors.text.body },
  selectorsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, gap: 8 },
  selectorBox: { flex: 1, backgroundColor: '#FFF', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: theme.colors.border },
  selectorBoxActive: { borderColor: theme.colors.primary, backgroundColor: '#F0FDFA', borderWidth: 2 },
  selectorLabel: { fontSize: 11, fontWeight: '700', color: theme.colors.text.light, marginBottom: 6, letterSpacing: 0.5 },
  selectorValueRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  selectorValue: { fontSize: 15, fontWeight: '700', color: theme.colors.text.main },
  placeholder: { color: '#9CA3AF', fontWeight: '500' },
  calendarSection: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: theme.colors.border, marginBottom: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 3, elevation: 2 },
  dateNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingHorizontal: 8 },
  navBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  dateDisplay: { alignItems: 'center' },
  dateDay: { fontSize: 13, color: theme.colors.text.light, fontWeight: '600', textTransform: 'uppercase' },
  dateDate: { fontSize: 18, color: theme.colors.text.main, fontWeight: '700' },
  istBadge: { backgroundColor: '#ECFDF5', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginLeft: 6 },
  istText: { fontSize: 10, color: '#059669', fontWeight: '800' },
  slotsContainer: { minHeight: 100, justifyContent: 'center' },
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  slotBadge: { flexGrow: 1, flexBasis: '30%', paddingVertical: 12, borderRadius: 10, backgroundColor: theme.colors.pricing.greenBg, borderWidth: 1, borderColor: theme.colors.pricing.greenText, alignItems: 'center', position: 'relative' },
  slotActiveSelect: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  slotDisabled: { backgroundColor: '#F9FAFB', borderColor: '#E5E7EB', opacity: 0.5 },
  slotTaken: { opacity: 0.5, borderColor: theme.colors.text.main },
  slotText: { color: theme.colors.pricing.greenText, fontWeight: '600', fontSize: 14 },
  slotTextSelected: { color: '#FFFFFF' },
  slotTextDisabled: { color: '#9CA3AF', textDecorationLine: 'line-through' },
  slotTextTaken: { color: theme.colors.text.main },
  emptyState: { alignItems: 'center', padding: 20 },
  emptyText: { marginTop: 8, color: theme.colors.text.light, fontSize: 14 },
  footerContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', padding: 20, borderTopWidth: 1, borderTopColor: theme.colors.border },
  proceedBtn: { flexDirection: 'row', backgroundColor: theme.colors.text.main, paddingVertical: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  proceedBtnDisabled: { backgroundColor: '#9CA3AF', shadowOpacity: 0, elevation: 0 },
  proceedBtnText: { color: "#FFF", fontSize: 16, fontWeight: '700', marginRight: 8 },
});