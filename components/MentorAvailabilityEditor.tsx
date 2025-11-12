import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase/client';

type DaySchedule = {
  day_of_week: number;
  start_time: string; // "09:00:00"
  end_time: string; // "17:00:00"
  is_active: boolean;
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

// Extended time slots to include evening hours
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

export default function MentorAvailabilityEditor({ mentorId }: Props) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [availability, setAvailability] = useState<DaySchedule[]>([]);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  useEffect(() => {
    loadAvailability();
  }, [mentorId]);

  const loadAvailability = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('mentor_availability')
        .select('*')
        .eq('mentor_id', mentorId)
        .eq('is_active', true);

      if (error) {
        console.error('Error loading availability:', error);
        return;
      }

      setAvailability(data || []);
    } catch (error) {
      console.error('Exception loading availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const isDayActive = (dayValue: number) => {
    return availability.some(a => a.day_of_week === dayValue);
  };

  const getDaySchedule = (dayValue: number) => {
    return availability.find(a => a.day_of_week === dayValue);
  };

  const toggleDay = (dayValue: number) => {
    if (isDayActive(dayValue)) {
      // Remove day
      setAvailability(availability.filter(a => a.day_of_week !== dayValue));
      if (expandedDay === dayValue) {
        setExpandedDay(null);
      }
    } else {
      // Add day with CORRECT default times based on weekday/weekend
      const isWeekend = dayValue === 0 || dayValue === 6; // Sunday=0, Saturday=6
      
      const defaultStartTime = isWeekend ? '12:00:00' : '20:00:00'; // 12 PM or 8 PM
      const defaultEndTime = isWeekend ? '17:00:00' : '22:00:00';   // 5 PM or 10 PM
      
      console.log(`Adding ${isWeekend ? 'weekend' : 'weekday'} schedule:`, defaultStartTime, '-', defaultEndTime);
      
      setAvailability([
        ...availability,
        {
          day_of_week: dayValue,
          start_time: defaultStartTime,
          end_time: defaultEndTime,
          is_active: true,
        }
      ]);
      setExpandedDay(dayValue);
    }
  };

  const updateDayTime = (dayValue: number, field: 'start_time' | 'end_time', value: string) => {
    setAvailability(availability.map(a => {
      if (a.day_of_week === dayValue) {
        return { ...a, [field]: value };
      }
      return a;
    }));
  };

  const handleSave = async () => {
    if (availability.length === 0) {
      Alert.alert('No Availability Set', 'Please select at least one day when you\'re available.');
      return;
    }

    try {
      setSaving(true);

      // Delete all existing availability for this mentor
      const { error: deleteError } = await supabase
        .from('mentor_availability')
        .delete()
        .eq('mentor_id', mentorId);

      if (deleteError) {
        console.error('Error deleting old availability:', deleteError);
        Alert.alert('Error', 'Failed to update availability. Please try again.');
        return;
      }

      // Insert new availability
      const records = availability.map(a => ({
        mentor_id: mentorId,
        day_of_week: a.day_of_week,
        start_time: a.start_time,
        end_time: a.end_time,
        is_active: true,
      }));

      const { error: insertError } = await supabase
        .from('mentor_availability')
        .insert(records);

      if (insertError) {
        console.error('Error inserting availability:', insertError);
        Alert.alert('Error', 'Failed to save availability. Please try again.');
        return;
      }

      Alert.alert('Success', 'Your availability has been saved successfully!');
    } catch (error) {
      console.error('Exception saving availability:', error);
      Alert.alert('Error', 'An unexpected error occurred.');
    } finally {
      setSaving(false);
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Set Your Availability</Text>
        <Text style={styles.subtitle}>
          Select days and hours when candidates can book sessions with you
        </Text>
        <View style={styles.defaultTimesNote}>
          <Ionicons name="information-circle" size={16} color="#6b7280" />
          <Text style={styles.defaultTimesText}>
            Defaults: Weekdays 8-10 PM • Weekends 12-5 PM
          </Text>
        </View>
      </View>

      <View style={styles.daysContainer}>
        {DAYS_OF_WEEK.map((day) => {
          const isActive = isDayActive(day.value);
          const isExpanded = expandedDay === day.value;
          const schedule = getDaySchedule(day.value);

          return (
            <View key={day.value} style={styles.dayCard}>
              {/* Day Toggle */}
              <TouchableOpacity
                style={[styles.dayToggle, isActive && styles.dayToggleActive]}
                onPress={() => toggleDay(day.value)}
              >
                <View style={styles.dayToggleLeft}>
                  <Ionicons
                    name={isActive ? 'checkmark-circle' : 'ellipse-outline'}
                    size={22}
                    color={isActive ? '#7c3aed' : '#9ca3af'}
                  />
                  <Text style={[styles.dayName, isActive && styles.dayNameActive]}>
                    {day.name}
                  </Text>
                </View>
                {isActive && (
                  <TouchableOpacity
                    onPress={() => setExpandedDay(isExpanded ? null : day.value)}
                  >
                    <Ionicons
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={20}
                      color="#6b7280"
                    />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>

              {/* Time Selector (Expanded) */}
              {isActive && isExpanded && schedule && (
                <View style={styles.timeSelector}>
                  <View style={styles.timeRow}>
                    <Text style={styles.timeLabel}>Start Time</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      <View style={styles.timeOptions}>
                        {TIME_SLOTS.slice(0, -1).map((slot) => (
                          <TouchableOpacity
                            key={slot.value}
                            style={[
                              styles.timeOption,
                              schedule.start_time === slot.value && styles.timeOptionSelected
                            ]}
                            onPress={() => updateDayTime(day.value, 'start_time', slot.value)}
                          >
                            <Text style={[
                              styles.timeOptionText,
                              schedule.start_time === slot.value && styles.timeOptionTextSelected
                            ]}>
                              {slot.label}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </ScrollView>
                  </View>

                  <View style={styles.timeRow}>
                    <Text style={styles.timeLabel}>End Time</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      <View style={styles.timeOptions}>
                        {TIME_SLOTS.slice(1).map((slot) => (
                          <TouchableOpacity
                            key={slot.value}
                            style={[
                              styles.timeOption,
                              schedule.end_time === slot.value && styles.timeOptionSelected
                            ]}
                            onPress={() => updateDayTime(day.value, 'end_time', slot.value)}
                          >
                            <Text style={[
                              styles.timeOptionText,
                              schedule.end_time === slot.value && styles.timeOptionTextSelected
                            ]}>
                              {slot.label}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </ScrollView>
                  </View>

                  <View style={styles.summaryBox}>
                    <Ionicons name="time-outline" size={16} color="#6b7280" />
                    <Text style={styles.summaryText}>
                      Available {TIME_SLOTS.find(s => s.value === schedule.start_time)?.label} - {TIME_SLOTS.find(s => s.value === schedule.end_time)?.label}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          );
        })}
      </View>

      {/* Save Button */}
      <TouchableOpacity
        style={[styles.saveButton, saving && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? (
          <>
            <ActivityIndicator size="small" color="#ffffff" />
            <Text style={styles.saveButtonText}>Saving...</Text>
          </>
        ) : (
          <>
            <Ionicons name="checkmark-circle" size={20} color="#ffffff" />
            <Text style={styles.saveButtonText}>Save Availability</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Info Box */}
      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={18} color="#2563eb" />
        <Text style={styles.infoText}>
          Candidates will only be able to book sessions during these time slots. You can update your availability anytime.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 24,
  },
  loadingText: {
    fontSize: 14,
    color: '#6b7280',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  defaultTimesNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  defaultTimesText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  daysContainer: {
    gap: 12,
    marginBottom: 20,
  },
  dayCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  dayToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  dayToggleActive: {
    backgroundColor: '#faf5ff',
  },
  dayToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dayName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
  },
  dayNameActive: {
    color: '#7c3aed',
    fontWeight: '600',
  },
  timeSelector: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    padding: 16,
    gap: 16,
    backgroundColor: '#fafafa',
  },
  timeRow: {
    gap: 8,
  },
  timeLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  timeOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  timeOption: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  timeOptionSelected: {
    backgroundColor: '#eff6ff',
    borderColor: '#2563eb',
  },
  timeOptionText: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  timeOptionTextSelected: {
    color: '#2563eb',
    fontWeight: '600',
  },
  summaryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  summaryText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#7c3aed',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#eff6ff',
    padding: 14,
    borderRadius: 10,
    marginTop: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#1e40af',
    lineHeight: 18,
  },
});