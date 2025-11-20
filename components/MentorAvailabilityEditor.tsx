import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase/client';

type DaySchedule = {
  day_of_week: number;
  start_time: string; // HH:mm:ss
  end_time: string;   // HH:mm:ss
};

type Unavailability = {
  id: string;
  start_at: string;
  end_at: string;
  reason?: string | null;
};

type Props = {
  mentorId: string;
};

const DAYS_OF_WEEK = [
  { name: 'Monday', value: 1 },
  { name: 'Tuesday', value: 2 },
  { name: 'Wednesday', value: 3 },
  { name: 'Thursday', value: 4 },
  { name: 'Friday', value: 5 },
  { name: 'Saturday', value: 6 },
  { name: 'Sunday', value: 0 },
];

// Extended time slots
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

function formatTimeLabel(value: string) {
  const slot = TIME_SLOTS.find((s) => s.value === value);
  return slot ? slot.label : value;
}

function formatDateTimeRange(startISO: string, endISO: string) {
  const start = new Date(startISO);
  const end = new Date(endISO);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return `${startISO} – ${endISO}`;
  }
  const sameDay =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate();

  const dayFormatter = new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
  const timeFormatter = new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
  });

  if (sameDay) {
    return `${dayFormatter.format(start)}, ${timeFormatter.format(
      start,
    )} – ${timeFormatter.format(end)}`;
  }
  return `${dayFormatter.format(start)}, ${timeFormatter.format(
    start,
  )} – ${dayFormatter.format(end)}, ${timeFormatter.format(end)}`;
}

export default function MentorAvailabilityEditor({ mentorId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [availability, setAvailability] = useState<DaySchedule[]>([]);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  const [unavailability, setUnavailability] = useState<Unavailability[]>([]);
  const [loadingUnavailability, setLoadingUnavailability] = useState(false);
  const [addingUnavailability, setAddingUnavailability] = useState(false);

  const [newDate, setNewDate] = useState('');
  const [newStartTime, setNewStartTime] = useState('');
  const [newEndTime, setNewEndTime] = useState('');
  const [newReason, setNewReason] = useState('');

  useEffect(() => {
    loadAvailability();
    loadUnavailability();
  }, [mentorId]);

  const loadAvailability = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('mentor_availability')
        .select('*')
        .eq('mentor_id', mentorId);

      if (error) {
        console.error('Error loading availability:', error);
        Alert.alert('Error', 'Could not load availability.');
        return;
      }

      const rows = (data || []) as any[];
      
      // Filter to only show ACTIVE days in the UI
      const activeRows = rows.filter(r => r.is_active !== false);
      
      if (rows.length > 0) {
        // Case A: Load existing active schedule
        const mapped: DaySchedule[] = activeRows.map((row) => ({
          day_of_week: row.day_of_week,
          start_time: row.start_time,
          end_time: row.end_time,
        }));
        setAvailability(mapped);
      } else {
        // Case B: Empty DB -> Set Defaults
        const defaults = DAYS_OF_WEEK.map((day) => {
            const isWeekend = day.value === 0 || day.value === 6; // 0=Sun, 6=Sat
            return {
                day_of_week: day.value,
                start_time: isWeekend ? '12:00:00' : '20:00:00',
                end_time: isWeekend ? '17:00:00' : '22:00:00',
            };
        });
        setAvailability(defaults);
      }
    } catch (error) {
      console.error('Unexpected error loading availability:', error);
      Alert.alert('Error', 'Something went wrong while loading availability.');
    } finally {
      setLoading(false);
    }
  };

  const loadUnavailability = async () => {
    try {
      setLoadingUnavailability(true);
      const now = new Date().toISOString();

      const { data, error } = await supabase
        .from('mentor_unavailability')
        .select('*')
        .eq('mentor_id', mentorId)
        .gte('end_at', now)
        .order('start_at', { ascending: true });

      if (error) {
        console.error('Error loading unavailability:', error);
        return;
      }

      setUnavailability((data || []) as Unavailability[]);
    } catch (error) {
      console.error('Unexpected error loading unavailability:', error);
    } finally {
      setLoadingUnavailability(false);
    }
  };

  const isDayActive = (dayValue: number) =>
    availability.some((a) => a.day_of_week === dayValue);

  const toggleDay = (dayValue: number) => {
    if (isDayActive(dayValue)) {
      setAvailability(availability.filter((a) => a.day_of_week !== dayValue));
      if (expandedDay === dayValue) {
        setExpandedDay(null);
      }
    } else {
      const isWeekend = dayValue === 0 || dayValue === 6; 
      const defaultStartTime = isWeekend ? '12:00:00' : '20:00:00';
      const defaultEndTime = isWeekend ? '17:00:00' : '22:00:00';

      setAvailability([
        ...availability,
        {
          day_of_week: dayValue,
          start_time: defaultStartTime,
          end_time: defaultEndTime,
        },
      ]);
      setExpandedDay(dayValue);
    }
  };

  const updateDayTime = (
    dayValue: number,
    field: 'start_time' | 'end_time',
    value: string,
  ) => {
    setAvailability((prev) =>
      prev.map((a) =>
        a.day_of_week === dayValue ? { ...a, [field]: value } : a,
      ),
    );
  };

  const handleSave = async () => {
    // We save ALL 7 days. If in 'availability' state -> Active. Else -> Inactive.
    
    try {
      setSaving(true);

      // 1. Clear old rules
      const { error: deleteError } = await supabase
        .from('mentor_availability')
        .delete()
        .eq('mentor_id', mentorId);

      if (deleteError) {
        console.error('Delete error:', deleteError);
        throw deleteError;
      }

      // 2. Prepare payload for ALL 7 days
      const payload = DAYS_OF_WEEK.map((day) => {
        const schedule = availability.find(a => a.day_of_week === day.value);
        
        if (schedule) {
            return {
                mentor_id: mentorId,
                day_of_week: day.value,
                start_time: schedule.start_time,
                end_time: schedule.end_time,
                is_active: true // ACTIVE
            };
        } else {
            return {
                mentor_id: mentorId,
                day_of_week: day.value,
                start_time: '09:00:00', // Dummy values
                end_time: '17:00:00',
                is_active: false // INACTIVE (Closed)
            };
        }
      });

      const { error: insertError } = await supabase
        .from('mentor_availability')
        .insert(payload);

      if (insertError) {
        console.error('Insert error:', insertError);
        throw insertError;
      }

      Alert.alert('Success', 'Availability updated successfully.', [
        { text: 'OK', onPress: () => router.back() }
      ]);

    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', 'Could not save availability.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddUnavailability = async () => {
    if (!newDate || !newStartTime || !newEndTime) {
      Alert.alert('Missing info', 'Please fill date, start time and end time.');
      return;
    }
    try {
      setAddingUnavailability(true);
      const startISO = `${newDate}T${newStartTime}:00`;
      const endISO = `${newDate}T${newEndTime}:00`;

      const { data, error } = await supabase
        .from('mentor_unavailability')
        .insert({
          mentor_id: mentorId,
          start_at: startISO,
          end_at: endISO,
          reason: newReason || null,
        })
        .select()
        .single();

      if (error) throw error;

      setUnavailability((prev) => [...prev, data as Unavailability]);
      setNewDate(''); setNewStartTime(''); setNewEndTime(''); setNewReason('');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not add time off.');
    } finally {
      setAddingUnavailability(false);
    }
  };

  const handleRemoveUnavailability = async (id: string) => {
    try {
      const { error } = await supabase.from('mentor_unavailability').delete().eq('id', id);
      if (error) throw error;
      setUnavailability((prev) => prev.filter((u) => u.id !== id));
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not remove block.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#7c3aed" />
        <Text style={styles.loadingText}>Loading availability...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Set Your Availability</Text>
          <Text style={styles.subtitle}>Select days/hours for candidate bookings.</Text>
          <View style={styles.defaultTimesNote}>
            <Ionicons name="information-circle-outline" size={18} color="#2563eb" />
            <Text style={styles.defaultTimesText}>
              Weekdays default: 8-10 PM. Weekends default: 12-5 PM.
            </Text>
          </View>
        </View>

        {/* Weekly availability */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Weekly availability</Text>
          <View style={styles.daysContainer}>
            {DAYS_OF_WEEK.map((day) => {
              const isActive = isDayActive(day.value);
              const schedule = availability.find((a) => a.day_of_week === day.value);
              const isExpanded = expandedDay === day.value;

              return (
                <View key={day.value} style={[styles.dayCard, isActive && styles.dayCardActive]}>
                  <TouchableOpacity style={styles.dayToggle} onPress={() => toggleDay(day.value)}>
                    <View style={styles.dayToggleLeft}>
                      <View style={[styles.dayDot, isActive && styles.dayDotActive]} />
                      <View>
                        <Text style={styles.dayName}>{day.name}</Text>
                        <Text style={styles.daySubtitle}>
                          {isActive && schedule ? `${formatTimeLabel(schedule.start_time)} – ${formatTimeLabel(schedule.end_time)}` : 'Not available'}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.dayToggleRight}>
                      <View style={[styles.activePill, isActive && styles.activePillOn]}>
                        <Text style={[styles.activePillText, isActive && styles.activePillTextOn]}>{isActive ? 'Active' : 'Off'}</Text>
                      </View>
                      {isActive && (
                        <TouchableOpacity onPress={() => setExpandedDay(isExpanded ? null : day.value)}>
                          <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={18} color="#6b7280" />
                        </TouchableOpacity>
                      )}
                    </View>
                  </TouchableOpacity>

                  {isActive && isExpanded && schedule && (
                    <View style={styles.expandedRow}>
                      <View style={styles.timeColumn}>
                        <Text style={styles.timeLabel}>Start</Text>
                        <View style={styles.timeOptionsRow}>
                          {TIME_SLOTS.map((slot) => (
                            <TouchableOpacity
                              key={slot.value}
                              style={[styles.timeChip, schedule.start_time === slot.value && styles.timeChipSelected]}
                              onPress={() => updateDayTime(day.value, 'start_time', slot.value)}
                            >
                              <Text style={[styles.timeChipText, schedule.start_time === slot.value && styles.timeChipTextSelected]}>{slot.label}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>
                      <View style={styles.timeColumn}>
                        <Text style={styles.timeLabel}>End</Text>
                        <View style={styles.timeOptionsRow}>
                          {TIME_SLOTS.map((slot) => (
                            <TouchableOpacity
                              key={slot.value}
                              style={[styles.timeChip, schedule.end_time === slot.value && styles.timeChipSelected]}
                              onPress={() => updateDayTime(day.value, 'end_time', slot.value)}
                            >
                              <Text style={[styles.timeChipText, schedule.end_time === slot.value && styles.timeChipTextSelected]}>{slot.label}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* Unavailability Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Time Off & Exceptions</Text>
          {loadingUnavailability ? (
            <ActivityIndicator size="small" color="#7c3aed" />
          ) : unavailability.length === 0 ? (
            <Text style={styles.emptyText}>No time off added.</Text>
          ) : (
            <View style={styles.unavailabilityList}>
              {unavailability.map((block) => (
                <View key={block.id} style={styles.unavailabilityItem}>
                  <View style={styles.unavailabilityTextContainer}>
                    <Text style={styles.unavailabilityRange}>{formatDateTimeRange(block.start_at, block.end_at)}</Text>
                    {block.reason ? <Text style={styles.unavailabilityReason}>{block.reason}</Text> : null}
                  </View>
                  <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveUnavailability(block.id)}>
                    <Ionicons name="trash-outline" size={18} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          <View style={styles.addUnavailabilityContainer}>
            <Text style={styles.addUnavailabilityTitle}>Add Block</Text>
            <View style={styles.formRow}>
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Date (YYYY-MM-DD)</Text>
                <TextInput style={styles.input} value={newDate} onChangeText={setNewDate} placeholder="2023-12-25" />
              </View>
            </View>
            <View style={styles.formRow}>
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Start (HH:MM)</Text>
                <TextInput style={styles.input} value={newStartTime} onChangeText={setNewStartTime} placeholder="09:00" />
              </View>
              <View style={styles.formField}>
                <Text style={styles.formLabel}>End (HH:MM)</Text>
                <TextInput style={styles.input} value={newEndTime} onChangeText={setNewEndTime} placeholder="17:00" />
              </View>
            </View>
            <TouchableOpacity style={styles.addUnavailabilityButton} onPress={handleAddUnavailability} disabled={addingUnavailability}>
              <Text style={styles.addUnavailabilityButtonText}>{addingUnavailability ? 'Adding...' : 'Add Time Off'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveButtonText}>Save Changes</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 24 },
  container: { padding: 16, gap: 16 },
  loadingContainer: { padding: 24, flexDirection: 'row', alignItems: 'center', gap: 8 },
  loadingText: { fontSize: 14, color: '#4b5563' },
  header: { gap: 8 },
  title: { fontSize: 18, fontWeight: '700', color: '#111827' },
  subtitle: { fontSize: 13, color: '#4b5563' },
  defaultTimesNote: { marginTop: 4, flexDirection: 'row', gap: 8, backgroundColor: '#eff6ff', padding: 10, borderRadius: 8 },
  defaultTimesText: { flex: 1, fontSize: 12, color: '#1d4ed8' },
  card: { backgroundColor: '#ffffff', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#e5e7eb', gap: 8 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#111827' },
  cardSubtitle: { fontSize: 12, color: '#6b7280' },
  daysContainer: { marginTop: 8, gap: 8 },
  dayCard: { borderRadius: 10, borderWidth: 1, borderColor: '#e5e7eb', overflow: 'hidden' },
  dayCardActive: { borderColor: '#c4b5fd', backgroundColor: '#faf5ff' },
  dayToggle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12 },
  dayToggleLeft: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  dayDot: { width: 10, height: 10, borderRadius: 5, borderWidth: 1, borderColor: '#d1d5db' },
  dayDotActive: { backgroundColor: '#7c3aed', borderColor: '#7c3aed' },
  dayName: { fontSize: 14, fontWeight: '500', color: '#111827' },
  daySubtitle: { fontSize: 12, color: '#6b7280' },
  dayToggleRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  activePill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, borderWidth: 1, borderColor: '#d1d5db', backgroundColor: '#f9fafb' },
  activePillOn: { borderColor: '#a855f7', backgroundColor: '#f3e8ff' },
  activePillText: { fontSize: 11, color: '#4b5563', fontWeight: '500' },
  activePillTextOn: { color: '#6b21a8' },
  expandedRow: { borderTopWidth: 1, borderTopColor: '#e5e7eb', padding: 10, gap: 10 },
  timeColumn: { gap: 6 },
  timeLabel: { fontSize: 12, fontWeight: '500', color: '#374151' },
  timeOptionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  timeChip: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, borderWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#f9fafb' },
  timeChipSelected: { borderColor: '#7c3aed', backgroundColor: '#f5f3ff' },
  timeChipText: { fontSize: 11, color: '#4b5563' },
  timeChipTextSelected: { color: '#5b21b6', fontWeight: '600' },
  inlineLoading: { marginTop: 8, flexDirection: 'row', alignItems: 'center', gap: 8 },
  inlineLoadingText: { fontSize: 12, color: '#4b5563' },
  emptyText: { marginTop: 8, fontSize: 12, color: '#6b7280' },
  unavailabilityList: { marginTop: 8, gap: 8 },
  unavailabilityItem: { flexDirection: 'row', alignItems: 'center', borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb', padding: 10, gap: 8 },
  unavailabilityTextContainer: { flex: 1, gap: 2 },
  unavailabilityRange: { fontSize: 13, color: '#111827', fontWeight: '500' },
  unavailabilityReason: { fontSize: 12, color: '#6b7280' },
  removeButton: { padding: 4 },
  addUnavailabilityContainer: { marginTop: 12, borderTopWidth: 1, borderTopColor: '#e5e7eb', paddingTop: 10, gap: 8 },
  addUnavailabilityTitle: { fontSize: 13, fontWeight: '600', color: '#111827' },
  formRow: { flexDirection: 'row', gap: 8 },
  formField: { flex: 1 },
  formFieldFull: { marginTop: 8 },
  formLabel: { fontSize: 11, color: '#6b7280', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 6, fontSize: 13, color: '#111827', backgroundColor: '#f9fafb' },
  inputMultiline: { minHeight: 40, textAlignVertical: 'top' },
  addUnavailabilityButton: { marginTop: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 8, borderRadius: 999, backgroundColor: '#4f46e5' },
  addUnavailabilityButtonDisabled: { opacity: 0.7 },
  addUnavailabilityButtonText: { fontSize: 13, fontWeight: '600', color: '#ffffff' },
  saveButton: { marginTop: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 999, backgroundColor: '#4f46e5' },
  saveButtonDisabled: { opacity: 0.7 },
  saveButtonText: { fontSize: 14, fontWeight: '600', color: '#ffffff' },
  infoBox: { marginTop: 8, flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: '#eff6ff', padding: 14, borderRadius: 10 },
  infoText: { flex: 1, fontSize: 13, color: '#1e40af', lineHeight: 18 },
});