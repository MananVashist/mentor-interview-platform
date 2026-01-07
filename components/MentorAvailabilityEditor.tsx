import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase/client';

// --- TYPES ---
type DaySchedule = {
  day_of_week: number;
  start_time: string; // HH:mm:ss
  end_time: string;   // HH:mm:ss
  is_active: boolean;
};

type Unavailability = {
  id: string;
  start_at: string; // ISO Timestamp
  end_at: string;   // ISO Timestamp
  reason?: string | null;
};

type Props = {
  mentorId: string;
};

// --- CONSTANTS ---
const DAYS_OF_WEEK = [
  { name: 'Monday', value: 1, key: 'monday', isWeekend: false },
  { name: 'Tuesday', value: 2, key: 'tuesday', isWeekend: false },
  { name: 'Wednesday', value: 3, key: 'wednesday', isWeekend: false },
  { name: 'Thursday', value: 4, key: 'thursday', isWeekend: false },
  { name: 'Friday', value: 5, key: 'friday', isWeekend: false },
  { name: 'Saturday', value: 6, key: 'saturday', isWeekend: true },
  { name: 'Sunday', value: 0, key: 'sunday', isWeekend: true },
];

const TIME_SLOTS = [
  { label: '8:00 AM', value: '08:00:00' },
  { label: '9:00 AM', value: '09:00:00' },
  { label: '10:00 AM', value: '10:00:00' },
  { label: '11:00 AM', value: '11:00:00' },
  { label: '12:00 PM', value: '12:00:00' },
  { label: '1:00 PM', value: '13:00:00' },
  { label: '2:00 PM', value: '14:00:00' },
  { label: '3:00 PM', value: '15:00:00' },
  { label: '4:00 PM', value: '16:00:00' },
  { label: '5:00 PM', value: '17:00:00' },
  { label: '6:00 PM', value: '18:00:00' },
  { label: '7:00 PM', value: '19:00:00' },
  { label: '8:00 PM', value: '20:00:00' },
  { label: '9:00 PM', value: '21:00:00' },
  { label: '10:00 PM', value: '22:00:00' },
  { label: '11:00 PM', value: '23:00:00' },
];

// --- HELPERS ---
function formatTimeLabel(value: string) {
  const slot = TIME_SLOTS.find((s) => s.value === value);
  if (slot) return slot.label;
  const [h, m] = value.split(':');
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${m} ${ampm}`;
}

function formatDateTimeRange(startISO: string, endISO: string) {
  const start = new Date(startISO);
  const end = new Date(endISO);
  
  const dateStr = start.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  const timeStart = start.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const timeEnd = end.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  
  return `${dateStr}, ${timeStart} - ${timeEnd}`;
}

export default function MentorAvailabilityEditor({ mentorId }: Props) {
  const router = useRouter();
  
  // State
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [availability, setAvailability] = useState<DaySchedule[]>([]);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  // Unavailability State
  const [unavailability, setUnavailability] = useState<Unavailability[]>([]);
  const [loadingUnavailability, setLoadingUnavailability] = useState(false);
  const [addingUnavailability, setAddingUnavailability] = useState(false);
  
  // Form Inputs
  const [newDate, setNewDate] = useState('');
  const [newStartTime, setNewStartTime] = useState('');
  const [newEndTime, setNewEndTime] = useState('');
  const [newReason, setNewReason] = useState('');

  // --- LOAD DATA ---
  useEffect(() => {
    if (mentorId) {
      loadAvailability();
      loadUnavailability();
    }
  }, [mentorId]);

  const loadAvailability = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('mentor_availability_rules')
        .select('weekdays, weekends')
        .eq('mentor_id', mentorId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        // NEW FORMAT: weekdays/weekends contain individual day objects
        const weekdaysData = data.weekdays || {};
        const weekendsData = data.weekends || {};
        
        const expanded = DAYS_OF_WEEK.map(day => {
          const source = day.isWeekend ? weekendsData : weekdaysData;
          const dayConfig = source[day.key] || {
            start: day.isWeekend ? '12:00' : '20:00',
            end: day.isWeekend ? '17:00' : '22:00',
            isActive: true
          };
          
          return {
            day_of_week: day.value,
            start_time: `${dayConfig.start}:00`,
            end_time: `${dayConfig.end}:00`,
            is_active: dayConfig.isActive !== false
          };
        }).filter(d => d.is_active);
        
        setAvailability(expanded);
      } else {
        // No rules exist - use defaults
        const defaults = DAYS_OF_WEEK.map(d => ({
          day_of_week: d.value,
          start_time: d.isWeekend ? '12:00:00' : '20:00:00',
          end_time: d.isWeekend ? '17:00:00' : '22:00:00',
          is_active: true
        }));
        setAvailability(defaults);
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to load availability');
    } finally {
      setLoading(false);
    }
  };

  const loadUnavailability = async () => {
    try {
      setLoadingUnavailability(true);
      const today = new Date().toISOString();
      const { data, error } = await supabase
        .from('mentor_unavailability')
        .select('*')
        .eq('mentor_id', mentorId)
        .gte('end_at', today)
        .order('start_at', { ascending: true });

      if (error) throw error;
      setUnavailability(data as Unavailability[]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUnavailability(false);
    }
  };

  // --- WEEKLY SCHEDULE LOGIC ---
  const isDayActive = (dayVal: number) => availability.some(a => a.day_of_week === dayVal);

  const toggleDay = (dayVal: number) => {
    if (isDayActive(dayVal)) {
      setAvailability(prev => prev.filter(a => a.day_of_week !== dayVal));
      if (expandedDay === dayVal) setExpandedDay(null);
    } else {
      const dayInfo = DAYS_OF_WEEK.find(d => d.value === dayVal);
      const isWeekend = dayInfo?.isWeekend || false;
      setAvailability(prev => [...prev, {
        day_of_week: dayVal,
        start_time: isWeekend ? '12:00:00' : '20:00:00',
        end_time: isWeekend ? '17:00:00' : '22:00:00',
        is_active: true
      }]);
      setExpandedDay(dayVal);
    }
  };

  const updateTime = (dayVal: number, field: 'start_time'|'end_time', time: string) => {
    setAvailability(prev => prev.map(a => 
      a.day_of_week === dayVal ? { ...a, [field]: time } : a
    ));
  };

  const handleSaveWeekly = async () => {
    try {
      setSaving(true);

      // Build weekdays and weekends objects with individual day schedules
      const weekdaysObj: any = {};
      const weekendsObj: any = {};

      DAYS_OF_WEEK.forEach(day => {
        const daySchedule = availability.find(a => a.day_of_week === day.value);
        
        const config = daySchedule ? {
          start: daySchedule.start_time.slice(0, 5), // "HH:mm"
          end: daySchedule.end_time.slice(0, 5),     // "HH:mm"
          isActive: true
        } : {
          start: day.isWeekend ? '12:00' : '20:00',
          end: day.isWeekend ? '17:00' : '22:00',
          isActive: false
        };

        if (day.isWeekend) {
          weekendsObj[day.key] = config;
        } else {
          weekdaysObj[day.key] = config;
        }
      });

      const { error } = await supabase
        .from('mentor_availability_rules')
        .upsert({
          mentor_id: mentorId,
          weekdays: weekdaysObj,
          weekends: weekendsObj
        }, { onConflict: 'mentor_id' });

      if (error) throw error;

      Alert.alert('Success', 'Weekly schedule saved!');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to save availability');
    } finally {
      setSaving(false);
    }
  };

  const handleAddException = async () => {
    if (!newDate || !newStartTime || !newEndTime) {
      Alert.alert('Missing Fields', 'Please fill in date, start time, and end time');
      return;
    }

    setAddingUnavailability(true);
    try {
      const startISO = new Date(`${newDate}T${newStartTime}`).toISOString();
      const endISO = new Date(`${newDate}T${newEndTime}`).toISOString();

      const { data, error } = await supabase
        .from('mentor_unavailability')
        .insert({
          mentor_id: mentorId,
          start_at: startISO,
          end_at: endISO,
          reason: newReason
        })
        .select()
        .single();

      if (error) throw error;

      setUnavailability(prev => [...prev, data]);
      setNewDate(''); setNewStartTime(''); setNewEndTime(''); setNewReason('');
    } catch (err: any) {
      Alert.alert('Error', 'Invalid Date/Time format. Use YYYY-MM-DD and HH:MM');
      console.error(err);
    } finally {
      setAddingUnavailability(false);
    }
  };

  const handleRemoveException = async (id: string) => {
    const { error } = await supabase.from('mentor_unavailability').delete().eq('id', id);
    if (!error) {
      setUnavailability(prev => prev.filter(u => u.id !== id));
    }
  };

  if (loading) return <ActivityIndicator style={{marginTop: 50}} color="#0E9384" />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Weekly Schedule</Text>
        <Text style={styles.subtitle}>Set your availability for each day (IST)</Text>
      </View>

      {/* WEEKLY LIST */}
      <View style={styles.section}>
        {DAYS_OF_WEEK.map((day) => {
          const isActive = isDayActive(day.value);
          const schedule = availability.find(a => a.day_of_week === day.value);

          return (
            <View key={day.value} style={[styles.card, isActive && styles.activeCard]}>
              <TouchableOpacity 
                style={styles.cardHeader} 
                onPress={() => toggleDay(day.value)}
              >
                <Text style={styles.dayName}>{day.name}</Text>
                
                <View style={styles.switchRow}>
                  <Text style={[styles.statusText, isActive ? styles.on : styles.off]}>
                    {isActive ? 'Active' : 'Off'}
                  </Text>
                  {isActive && (
                     <Ionicons name="chevron-down" size={20} color="#666" />
                  )}
                </View>
              </TouchableOpacity>

              {/* EXPANDED TIME SELECTOR */}
              {isActive && (
                <View style={styles.timeSelector}>
                  <Text style={styles.label}>Start Time</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeScroll}>
                    {TIME_SLOTS.map(slot => (
                      <TouchableOpacity 
                        key={`start-${day.value}-${slot.value}`}
                        style={[styles.chip, schedule?.start_time === slot.value && styles.selectedChip]}
                        onPress={() => updateTime(day.value, 'start_time', slot.value)}
                      >
                        <Text style={[styles.chipText, schedule?.start_time === slot.value && styles.selectedChipText]}>
                          {slot.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  <Text style={[styles.label, {marginTop: 10}]}>End Time</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeScroll}>
                    {TIME_SLOTS.map(slot => (
                      <TouchableOpacity 
                        key={`end-${day.value}-${slot.value}`}
                        style={[styles.chip, schedule?.end_time === slot.value && styles.selectedChip]}
                        onPress={() => updateTime(day.value, 'end_time', slot.value)}
                      >
                        <Text style={[styles.chipText, schedule?.end_time === slot.value && styles.selectedChipText]}>
                          {slot.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          );
        })}

        <TouchableOpacity 
          style={styles.saveBtn} 
          onPress={handleSaveWeekly}
          disabled={saving}
        >
          {saving ? <ActivityIndicator color="#fff"/> : <Text style={styles.saveBtnText}>Save Weekly Schedule</Text>}
        </TouchableOpacity>
      </View>

      {/* EXCEPTIONS SECTION */}
      <View style={[styles.header, {marginTop: 30}]}>
        <Text style={styles.title}>Exceptions / Time Off</Text>
        <Text style={styles.subtitle}>Specific dates you are unavailable</Text>
      </View>

      <View style={styles.section}>
        {/* LIST EXISTING */}
        {unavailability.map(u => (
          <View key={u.id} style={styles.exceptionItem}>
            <View>
              <Text style={styles.exceptionDate}>{formatDateTimeRange(u.start_at, u.end_at)}</Text>
              {u.reason && <Text style={styles.exceptionReason}>{u.reason}</Text>}
            </View>
            <TouchableOpacity onPress={() => handleRemoveException(u.id)}>
              <Ionicons name="trash-outline" size={20} color="red" />
            </TouchableOpacity>
          </View>
        ))}

        {/* ADD NEW */}
        <View style={styles.addBox}>
          <Text style={styles.addTitle}>Add Exception</Text>
          <TextInput 
            placeholder="YYYY-MM-DD (e.g. 2025-12-25)" 
            style={styles.input} 
            value={newDate} 
            onChangeText={setNewDate}
          />
          <View style={{flexDirection: 'row', gap: 10}}>
            <TextInput 
              placeholder="09:00" 
              style={[styles.input, {flex:1}]} 
              value={newStartTime} 
              onChangeText={setNewStartTime}
            />
             <TextInput 
              placeholder="17:00" 
              style={[styles.input, {flex:1}]} 
              value={newEndTime} 
              onChangeText={setNewEndTime}
            />
          </View>
          <TextInput 
            placeholder="Reason (Optional)" 
            style={styles.input} 
            value={newReason} 
            onChangeText={setNewReason}
          />
          <TouchableOpacity 
            style={styles.addBtn} 
            onPress={handleAddException}
            disabled={addingUnavailability}
          >
             <Text style={styles.addBtnText}>+ Add Unavailable Block</Text>
          </TouchableOpacity>
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 50, backgroundColor: '#f8fafc' },
  header: { marginBottom: 15 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1e293b' },
  subtitle: { color: '#64748b' },
  section: { gap: 10 },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  activeCard: { borderColor: '#0E9384', backgroundColor: '#f0fdfa' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dayName: { fontSize: 16, fontWeight: '600', color: '#334155' },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  on: { color: '#0E9384' },
  off: { color: '#94a3b8' },
  timeSelector: { marginTop: 15, borderTopWidth: 1, borderTopColor: '#e2e8f0', paddingTop: 10 },
  label: { fontSize: 12, fontWeight: '600', color: '#64748b', marginBottom: 5 },
  timeScroll: { flexDirection: 'row', gap: 8 },
  chip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, backgroundColor: '#f1f5f9', marginRight: 8 },
  selectedChip: { backgroundColor: '#0E9384' },
  chipText: { fontSize: 12, color: '#475569' },
  selectedChipText: { color: '#fff' },
  saveBtn: { backgroundColor: '#0f172a', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  saveBtnText: { color: '#fff', fontWeight: 'bold' },
  
  // Exception Styles
  exceptionItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0' },
  exceptionDate: { fontWeight: '600', color: '#334155' },
  exceptionReason: { fontSize: 12, color: '#64748b' },
  addBox: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginTop: 10, borderWidth: 1, borderColor: '#cbd5e1' },
  addTitle: { fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 6, padding: 10, marginBottom: 10, backgroundColor: '#f8fafc' },
  addBtn: { backgroundColor: '#0E9384', padding: 10, borderRadius: 6, alignItems: 'center' },
  addBtnText: { color: '#fff', fontWeight: '600' }
});