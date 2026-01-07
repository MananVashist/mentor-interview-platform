import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  ScrollView, 
  TouchableOpacity, 
  Modal, 
  FlatList,
  Alert,
  Switch
} from 'react-native';
import { useAuthStore } from '@/lib/store';
import { supabase } from '@/lib/supabase/client';
import { Ionicons } from '@expo/vector-icons'; 
import { useNotification } from '@/lib/ui/NotificationBanner';

// --- Types ---
type TimeSlot = string; 

interface DayScheduleConfig {
  start: TimeSlot;
  end: TimeSlot;
  isActive: boolean;
}

interface Unavailability {
  id: string;
  startDate: Date;
  endDate: Date;
}

// --- Constants ---
const DAYS_OF_WEEK = [
  { name: 'Monday', key: 'monday', isWeekend: false },
  { name: 'Tuesday', key: 'tuesday', isWeekend: false },
  { name: 'Wednesday', key: 'wednesday', isWeekend: false },
  { name: 'Thursday', key: 'thursday', isWeekend: false },
  { name: 'Friday', key: 'friday', isWeekend: false },
  { name: 'Saturday', key: 'saturday', isWeekend: true },
  { name: 'Sunday', key: 'sunday', isWeekend: true },
];

const HOURS = Array.from({ length: 24 }, (_, i) => {
  const hour = i;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return {
    label: `${hour12}:00 ${ampm}`,
    value: `${hour.toString().padStart(2, '0')}:00`
  };
});

const UPCOMING_DATES = Array.from({ length: 60 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i);
  return {
    label: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }), 
    value: d.toISOString().split('T')[0] 
  };
});

export default function AvailabilityPage() {
  const { user, mentorProfile } = useAuthStore();
  const { showNotification } = useNotification();
  
  // --- State ---
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Store schedule for each day individually
  const [daySchedules, setDaySchedules] = useState<Record<string, DayScheduleConfig>>({
    monday: { start: '20:00', end: '22:00', isActive: true },
    tuesday: { start: '20:00', end: '22:00', isActive: true },
    wednesday: { start: '20:00', end: '22:00', isActive: true },
    thursday: { start: '20:00', end: '22:00', isActive: true },
    friday: { start: '20:00', end: '22:00', isActive: true },
    saturday: { start: '12:00', end: '17:00', isActive: true },
    sunday: { start: '12:00', end: '17:00', isActive: true },
  });

  const [exceptions, setExceptions] = useState<Unavailability[]>([]);
  const [isAddingException, setIsAddingException] = useState(false);
  
  const [tempException, setTempException] = useState({
    startStr: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endStr: new Date().toISOString().split('T')[0],
    endTime: '17:00'
  });

  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  
  const [pickerTarget, setPickerTarget] = useState<{
    dayKey: string | 'exceptionStart' | 'exceptionEnd', 
    field: 'start' | 'end'
  } | null>(null);

  const [dateTarget, setDateTarget] = useState<'start' | 'end'>('start');

  // --- 1. Load Data on Mount ---
  useEffect(() => {
    if (!mentorProfile) return;

    const loadAvailability = async () => {
      try {
        setLoading(true);
        
        // A. Fetch Recurring Rules
        const { data: rulesData, error: rulesError } = await supabase
          .from('mentor_availability_rules')
          .select('weekdays, weekends')
          .eq('mentor_id', mentorProfile.id)
          .maybeSingle();

        if (rulesData) {
          // Parse the new format with individual days
          const weekdaysData = rulesData.weekdays || {};
          const weekendsData = rulesData.weekends || {};
          
          const loadedSchedules: Record<string, DayScheduleConfig> = {};
          
          DAYS_OF_WEEK.forEach(day => {
            const source = day.isWeekend ? weekendsData : weekdaysData;
            loadedSchedules[day.key] = source[day.key] || {
              start: day.isWeekend ? '12:00' : '20:00',
              end: day.isWeekend ? '17:00' : '22:00',
              isActive: true
            };
          });
          
          setDaySchedules(loadedSchedules);
        }

        // B. Fetch Exceptions
        const { data: exData, error: exError } = await supabase
          .from('mentor_unavailability')
          .select('*')
          .eq('mentor_id', mentorProfile.id);

        if (exData) {
          const formattedExceptions: Unavailability[] = exData.map((item: any) => ({
            id: item.id,
            startDate: new Date(item.start_at),
            endDate: new Date(item.end_at)
          }));
          setExceptions(formattedExceptions);
        }

      } catch (e) {
        console.error('Error loading availability:', e);
      } finally {
        setLoading(false);
      }
    };

    loadAvailability();
  }, [mentorProfile]);

  if (!user || !mentorProfile || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0E9384" />
      </View>
    );
  }

  // --- Handlers ---
  
  const handleSave = async () => {
    if (!mentorProfile) return;
    setSaving(true);

    try {
      // Build weekdays and weekends objects from daySchedules
      const weekdaysObj: any = {};
      const weekendsObj: any = {};

      DAYS_OF_WEEK.forEach(day => {
        const schedule = daySchedules[day.key];
        if (day.isWeekend) {
          weekendsObj[day.key] = schedule;
        } else {
          weekdaysObj[day.key] = schedule;
        }
      });

      // 1. Upsert Rules
      const { error: rulesError } = await supabase
        .from('mentor_availability_rules')
        .upsert({
          mentor_id: mentorProfile.id,
          weekdays: weekdaysObj,
          weekends: weekendsObj
        });

      if (rulesError) throw rulesError;

      // 2. Sync Exceptions
      await supabase
        .from('mentor_unavailability')
        .delete()
        .eq('mentor_id', mentorProfile.id);

      if (exceptions.length > 0) {
        const { error: exError } = await supabase
          .from('mentor_unavailability')
          .insert(
            exceptions.map(ex => ({
              mentor_id: mentorProfile.id,
              start_at: ex.startDate.toISOString(),
              end_at: ex.endDate.toISOString()
            }))
          );
        if (exError) throw exError;
      }

      showNotification('Availability updated successfully', 'success');

    } catch (error: any) {
      console.error(error);
      showNotification(error.message || 'Failed to save availability', 'error');
    } finally {
      setSaving(false);
    }
  };

  const toggleDay = (dayKey: string) => {
    setDaySchedules(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        isActive: !prev[dayKey].isActive
      }
    }));
  };

  const addException = () => {
    const start = new Date(`${tempException.startStr}T${tempException.startTime}`);
    const end = new Date(`${tempException.endStr}T${tempException.endTime}`);

    if (end <= start) {
      Alert.alert('Invalid Range', 'End time must be after start time.');
      return;
    }
    setExceptions([...exceptions, { id: Date.now().toString(), startDate: start, endDate: end }]);
    setIsAddingException(false);
  };

  const removeException = (id: string) => {
    setExceptions(exceptions.filter(e => e.id !== id));
  };

  const openTimePicker = (dayKey: string, field: 'start' | 'end') => {
    setPickerTarget({ dayKey, field });
    setTimePickerVisible(true);
  };

  const handleTimeSelect = (timeValue: string) => {
    if (!pickerTarget) return;

    if (pickerTarget.dayKey === 'exceptionStart') {
      setTempException(prev => ({ ...prev, startTime: timeValue }));
    } else if (pickerTarget.dayKey === 'exceptionEnd') {
      setTempException(prev => ({ ...prev, endTime: timeValue }));
    } else {
      // Update specific day schedule
      setDaySchedules(prev => ({
        ...prev,
        [pickerTarget.dayKey]: {
          ...prev[pickerTarget.dayKey],
          [pickerTarget.field]: timeValue
        }
      }));
    }

    setTimePickerVisible(false);
  };

  const openDatePicker = (target: 'start' | 'end') => {
    setDateTarget(target);
    setDatePickerVisible(true);
  };

  const handleDateSelect = (dateValue: string) => {
    if (dateTarget === 'start') {
      setTempException(prev => ({ ...prev, startStr: dateValue }));
    } else {
      setTempException(prev => ({ ...prev, endStr: dateValue }));
    }
    setDatePickerVisible(false);
  };

  const formatTime = (time: string) => {
    const hour = HOURS.find(h => h.value === time);
    return hour ? hour.label : time;
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Availability</Text>
          <Text style={styles.subtitle}>Set your weekly schedule and time-off periods</Text>
        </View>

        {/* Weekly Schedule - Individual Days */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Weekly Schedule</Text>
          <Text style={styles.helperText}>Configure availability for each day of the week</Text>

          {DAYS_OF_WEEK.map(day => {
            const schedule = daySchedules[day.key];
            return (
              <View key={day.key} style={styles.scheduleRow}>
                <View style={styles.rowHeader}>
                  <Text style={styles.dayLabel}>{day.name}</Text>
                  <Switch
                    value={schedule.isActive}
                    onValueChange={() => toggleDay(day.key)}
                    trackColor={{ false: '#cbd5e1', true: '#0E9384' }}
                    thumbColor="#fff"
                  />
                </View>

                {schedule.isActive && (
                  <View style={styles.timeSelectorContainer}>
                    <TouchableOpacity 
                      style={styles.dropdown} 
                      onPress={() => openTimePicker(day.key, 'start')}
                    >
                      <Text style={styles.dropdownText}>{formatTime(schedule.start)}</Text>
                      <Ionicons name="chevron-down" size={16} color="#64748b" />
                    </TouchableOpacity>

                    <Text style={styles.toText}>to</Text>

                    <TouchableOpacity 
                      style={styles.dropdown} 
                      onPress={() => openTimePicker(day.key, 'end')}
                    >
                      <Text style={styles.dropdownText}>{formatTime(schedule.end)}</Text>
                      <Ionicons name="chevron-down" size={16} color="#64748b" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Unavailability Blocks */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>Time Off</Text>
              <Text style={styles.helperText}>Block out specific dates when unavailable</Text>
            </View>
            <TouchableOpacity onPress={() => setIsAddingException(true)}>
              <Ionicons name="add-circle" size={32} color="#0E9384" />
            </TouchableOpacity>
          </View>

          {exceptions.length === 0 ? (
            <Text style={styles.emptyText}>No time-off blocks scheduled</Text>
          ) : (
            exceptions.map(ex => (
              <View key={ex.id} style={styles.exceptionItem}>
                <View>
                  <Text style={styles.exceptionDate}>
                    {ex.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </Text>
                  <Text style={styles.toTextVertical}>to</Text>
                  <Text style={styles.exceptionDate}>
                    {ex.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => removeException(ex.id)}>
                  <Ionicons name="trash-outline" size={22} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {/* Save Button */}
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
             <ActivityIndicator color="white" />
          ) : (
             <Text style={styles.saveButtonText}>Update Availability</Text>
          )}
        </TouchableOpacity>

      </ScrollView>

      {/* --- Modals --- */}

      {/* 1. Add Exception Form Modal */}
      <Modal visible={isAddingException} animationType="slide">
        <View style={styles.fullScreenModal}>
          <View style={styles.modalHeader}>
             <Text style={styles.modalTitleLarge}>Schedule Time Off</Text>
             <TouchableOpacity onPress={() => setIsAddingException(false)}>
                <Ionicons name="close" size={24} color="#000" />
             </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>Select the range you are unavailable.</Text>

          {/* Start DateTime Group */}
          <View style={styles.inputGroup}>
            <Text style={styles.groupLabel}>Start</Text>
            <View style={styles.rowInputs}>
              <TouchableOpacity style={styles.inputField} onPress={() => openDatePicker('start')}>
                <Text style={styles.inputText}>{tempException.startStr}</Text>
                <Ionicons name="calendar-outline" size={18} color="#64748b" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.inputField} onPress={() => openTimePicker('exceptionStart', 'start')}>
                 <Text style={styles.inputText}>{tempException.startTime}</Text> 
                 <Ionicons name="time-outline" size={18} color="#64748b" />
              </TouchableOpacity>
            </View>
          </View>

          {/* End DateTime Group */}
          <View style={styles.inputGroup}>
            <Text style={styles.groupLabel}>End</Text>
            <View style={styles.rowInputs}>
              <TouchableOpacity style={styles.inputField} onPress={() => openDatePicker('end')}>
                <Text style={styles.inputText}>{tempException.endStr}</Text>
                <Ionicons name="calendar-outline" size={18} color="#64748b" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.inputField} onPress={() => openTimePicker('exceptionEnd', 'end')}>
                 <Text style={styles.inputText}>{tempException.endTime}</Text> 
                 <Ionicons name="time-outline" size={18} color="#64748b" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setIsAddingException(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={addException}>
              <Text style={styles.confirmButtonText}>Add Block</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 2. Time Picker Modal */}
      <Modal visible={timePickerVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setTimePickerVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Time</Text>
            <FlatList 
              data={HOURS}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.pickerOption} 
                  onPress={() => handleTimeSelect(item.value)}
                >
                  <Text style={styles.pickerOptionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 3. Date Picker Modal */}
      <Modal visible={datePickerVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setDatePickerVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Date</Text>
            <FlatList 
              data={UPCOMING_DATES}
              keyExtractor={(item) => item.value}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.pickerOption} 
                  onPress={() => handleDateSelect(item.value)}
                >
                  <Text style={styles.pickerOptionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 20 },
  header: { marginBottom: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1e293b' },
  subtitle: { fontSize: 14, color: '#64748b', marginTop: 4 },
  
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#334155', marginBottom: 4 },
  helperText: { fontSize: 12, color: '#94a3b8', marginBottom: 16 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  
  scheduleRow: { marginBottom: 16 },
  rowHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  dayLabel: { fontSize: 16, fontWeight: '500', color: '#0f172a' },
  timeSelectorContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', padding: 8, borderRadius: 8 },
  
  dropdown: { 
    backgroundColor: 'white', 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    borderRadius: 6, 
    borderWidth: 1, 
    borderColor: '#e2e8f0',
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 100,
    justifyContent: 'space-between'
  },
  dropdownText: { fontSize: 14, color: '#334155' },
  toText: { marginHorizontal: 10, color: '#64748b', fontSize: 14 },
  divider: { height: 1, backgroundColor: '#e2e8f0', marginVertical: 12 },

  // Unavailability
  linkText: { color: '#0E9384', fontWeight: '600' },
  emptyText: { color: '#94a3b8', fontStyle: 'italic', fontSize: 14 },
  exceptionItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: '#fff1f2', 
    padding: 12, 
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444'
  },
  exceptionDate: { fontSize: 14, color: '#be123c', fontWeight: '500' },
  toTextVertical: { fontSize: 12, color: '#9f1239' },

  // Buttons
  saveButton: { backgroundColor: '#0E9384', padding: 16, borderRadius: 12, alignItems: 'center' },
  saveButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

  // Modals
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: 'white', width: '80%', maxHeight: '60%', borderRadius: 12, padding: 0 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', margin: 16, textAlign: 'center' },
  pickerOption: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingHorizontal: 20 },
  pickerOptionText: { fontSize: 16, textAlign: 'center', color: '#334155' },

  // Full Screen Modal (Add Exception)
  fullScreenModal: { flex: 1, padding: 24, paddingTop: 60, backgroundColor: 'white' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitleLarge: { fontSize: 24, fontWeight: 'bold', color: '#0f172a' },
  
  inputGroup: { marginTop: 24 },
  groupLabel: { fontSize: 14, fontWeight: '600', color: '#475569', marginBottom: 8 },
  rowInputs: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  
  inputField: { 
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1, 
    borderColor: '#cbd5e1', 
    padding: 12, 
    borderRadius: 8, 
    backgroundColor: '#f8fafc' 
  },
  inputText: { fontSize: 15, color: '#334155' },
  
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 40 },
  cancelButton: { padding: 16, flex: 1, marginRight: 8, alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 8 },
  confirmButton: { padding: 16, flex: 1, marginLeft: 8, alignItems: 'center', backgroundColor: '#0f172a', borderRadius: 8 },
  cancelButtonText: { color: '#475569', fontWeight: '600' },
  confirmButtonText: { color: 'white', fontWeight: 'bold' },
});