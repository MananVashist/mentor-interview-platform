﻿// app/(candidate)/[id].tsx
// Same logic as your current file, but with extra debug logs in handleBook.

import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/lib/store';
import { paymentService } from '@/services/payment.service';
import { colors, spacing, borderRadius, typography } from '@/lib/theme';

const SUPABASE_URL = 'https://rcbaaiiawrglvyzmawvr.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjYmFhaWlhd3JnbHZ5em1hd3ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNTA1NjAsImV4cCI6MjA3NjcyNjU2MH0.V3qRHGXBMlspRS7XFJlXdo4qIcCms60Nepp7dYMEjLA';

type AdminProfile = {
  id: number;
  name: string;
  description: string | null;
  is_active: boolean;
};

type SessionSlot = {
  date: Date | null;
  time: string | null;
};

type MentorAvailability = {
  id: string;
  mentor_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
};

export default function CandidateMentorDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { profile: authProfile } = useAuthStore();

  const [mentor, setMentor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mentorAvailability, setMentorAvailability] = useState<MentorAvailability[]>([]);

  const [adminProfiles, setAdminProfiles] = useState<AdminProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);

  const [session1, setSession1] = useState<SessionSlot>({ date: null, time: null });
  const [session2, setSession2] = useState<SessionSlot>({ date: null, time: null });
  const [session3, setSession3] = useState<SessionSlot>({ date: null, time: null });

  const [showScheduling, setShowScheduling] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  // fetch mentor
  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      try {
        const url =
          `${SUPABASE_URL}/rest/v1/mentors` +
          `?id=eq.${id}` +
          `&select=*,profile:profiles(*)`;
        const res = await fetch(url, {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
        });
        const text = await res.text();
        if (res.ok) {
          const arr = JSON.parse(text);
          const m = arr[0] ?? null;
          setMentor(m);
        } else {
          console.log('[mentor detail] fetch failed', res.status, text);
          setMentor(null);
        }
      } catch (e) {
        console.log('[mentor detail] error', e);
        setMentor(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // fetch availability
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const url =
          `${SUPABASE_URL}/rest/v1/mentor_availability` +
          `?mentor_id=eq.${id}` +
          `&is_active=eq.true` +
          `&select=*`;
        const res = await fetch(url, {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
        });
        const text = await res.text();
        if (res.ok) {
          const data = JSON.parse(text) as MentorAvailability[];
          setMentorAvailability(data || []);
        } else {
          console.log('[mentor detail] availability fetch failed', res.status, text);
          setMentorAvailability([]);
        }
      } catch (e) {
        console.log('[mentor detail] availability error', e);
        setMentorAvailability([]);
      }
    })();
  }, [id]);

  // fetch admin profiles
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/interview_profiles_admin?select=*`,
          {
            headers: {
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            },
          }
        );
        const text = await res.text();
        if (res.ok) {
          const data = JSON.parse(text) as AdminProfile[];
          const actives = (data || []).filter((p) => p.is_active !== false);
          setAdminProfiles(actives);
        } else {
          setAdminProfiles([]);
        }
      } catch (err) {
        console.log('[mentor detail] admin profiles error', err);
        setAdminProfiles([]);
      }
    })();
  }, []);

  // auto-select profile
  useEffect(() => {
    if (!mentor || !adminProfiles.length) return;
    const mentorProfiles: string[] = mentor.expertise_profiles || [];
    const match = adminProfiles.find((p) => mentorProfiles.includes(p.name));
    if (match) {
      setSelectedProfile(match.name);
    } else if (adminProfiles.length > 0) {
      setSelectedProfile(adminProfiles[0].name);
    }
  }, [mentor, adminProfiles]);

  const handleContinue = () => {
    if (!selectedProfile) {
      Alert.alert('Select Interview Type', 'Please choose an interview type to continue.');
      return;
    }
    setShowScheduling(true);
  };

  // UPDATED: same logic, but with debug logs + redirect to bookings.
  const handleBook = async () => {
    console.log('[BOOK DBG] handleBook called');

    if (!authProfile?.id) {
      console.log('[BOOK DBG] missing authProfile.id');
      Alert.alert('Not signed in', 'Please sign in as candidate first.');
      return;
    }
    if (!mentor) {
      console.log('[BOOK DBG] missing mentor');
      Alert.alert('Error', 'Mentor data missing.');
      return;
    }
    if (!selectedProfile) {
      console.log('[BOOK DBG] missing selectedProfile');
      Alert.alert('Select profile', 'Please pick what interview you want to book.');
      return;
    }

    if (!session1.date || !session1.time) {
      console.log('[BOOK DBG] missing session1');
      Alert.alert('Schedule Session 1', 'Please schedule your first technical session.');
      return;
    }
    if (!session2.date || !session2.time) {
      console.log('[BOOK DBG] missing session2');
      Alert.alert('Schedule Session 2', 'Please schedule your second technical session.');
      return;
    }
    if (!session3.date || !session3.time) {
      console.log('[BOOK DBG] missing session3');
      Alert.alert('Schedule HR Session', 'Please schedule your HR round.');
      return;
    }

    console.log('[BOOK DBG] setting bookingLoading -> true');
    setBookingLoading(true);

    try {
      const sessionPrice = mentor.session_price_inr || mentor.session_price || 0;
      console.log('[BOOK DBG] calling paymentService.createPackage', {
        candidateId: authProfile.id,
        mentorId: mentor.id,
        selectedProfile,
        sessionPrice,
      });

      const { package: pkg, error } = await paymentService.createPackage(
        authProfile.id,
        mentor.id,
        selectedProfile,
        sessionPrice
      );

      console.log('[BOOK DBG] createPackage result', { pkg, error });

      if (error || !pkg) {
        console.log('[BOOK DBG] createPackage failed', error);
        Alert.alert('Could not start booking', 'Please try again or contact admin.');
        return;
      }

      // After successful payment/package creation, go to My Bookings.
      // If you just care about redirect, this is enough.
      if (pkg?.id) {
        console.log('[BOOK DBG] navigating to bookings with bookingId', pkg.id);
        router.push({
          pathname: '/(candidate)/bookings',
          params: { bookingId: pkg.id },
        });
      } else {
        console.log('[BOOK DBG] navigating to bookings (no bookingId)');
        router.push('/(candidate)/bookings');
      }
    } catch (err) {
      console.log('[BOOK DBG] exception in handleBook', err);
      Alert.alert('Error', 'Something went wrong while booking.');
    } finally {
      console.log('[BOOK DBG] setting bookingLoading -> false (finally)');
      setBookingLoading(false);
    }
  };

  // helpers
  const getDefaultTitle = () => {
    if (!mentor) return '';
    const profiles = mentor.expertise_profiles || [];
    if (profiles.length === 0) return 'Interview Professional';
    return `${profiles.slice(0, 2).join(' / ')} Interviewer`;
  };

  const getDefaultDescription = () => {
    if (!mentor) return '';
    const profiles = mentor.expertise_profiles || [];
    const sessions = mentor.total_sessions || 0;
    if (profiles.length === 0) {
      return 'Experienced interviewer ready to help you prepare.';
    }
    if (sessions > 0) {
      return `${sessions} sessions completed. Specializes in ${profiles
        .slice(0, 2)
        .join(' and ')} interviews.`;
    }
    return `Specialized in ${profiles.slice(0, 2).join(' and ')} interviews.`;
  };

  const professionalTitle = mentor?.professional_title || getDefaultTitle();
  const professionalDescription =
    mentor?.experience_description || getDefaultDescription();
  const mentorLevel = mentor?.mentor_level || 'bronze';

  const filteredAdminProfiles = mentor
    ? adminProfiles.filter((p) => mentor.expertise_profiles?.includes(p.name))
    : [];

  const availabilityDays = mentorAvailability.map((a) => {
    const dayNames = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    return dayNames[a.day_of_week];
  });

  const convertTo24Hour = (timeStr: string): number => {
    const [time, period] = timeStr.split(' ');
    const [hour] = time.split(':').map(Number);
    if (period === 'PM' && hour !== 12) return hour + 12;
    if (period === 'AM' && hour === 12) return 0;
    return hour;
  };

  const getTimeSlotsForDate = (date: Date): string[] => {
    const dayOfWeek = date.getDay();
    const dayAvailability = mentorAvailability.filter(
      (a) => a.day_of_week === dayOfWeek
    );

    if (dayAvailability.length === 0) {
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      return isWeekend
        ? ['12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM']
        : ['8:00 PM', '9:00 PM'];
    }

    const allSlots: string[] = [];
    dayAvailability.forEach((avail) => {
      try {
        const startHour = parseInt(String(avail.start_time).split(':')[0]);
        const endHour = parseInt(String(avail.end_time).split(':')[0]);
        for (let hour = startHour; hour < endHour; hour++) {
          const isPM = hour >= 12;
          const displayHour =
            hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
          allSlots.push(`${displayHour}:00 ${isPM ? 'PM' : 'AM'}`);
        }
      } catch (error) {
        console.log('time parse error', error);
      }
    });

    if (allSlots.length === 0) {
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      return isWeekend
        ? ['12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM']
        : ['8:00 PM', '9:00 PM'];
    }

    return Array.from(new Set(allSlots)).sort((a, b) => {
      const timeA = convertTo24Hour(a);
      const timeB = convertTo24Hour(b);
      return timeA - timeB;
    });
  };

  const getAvailableDates = () => {
    const dates: Date[] = [];
    const today = new Date();

    if (mentorAvailability.length === 0) {
      for (let i = 1; i <= 14; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push(date);
      }
      return dates;
    }

    const availableDays = mentorAvailability.map((a) => a.day_of_week);
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      if (availableDays.includes(date.getDay())) {
        dates.push(date);
        if (dates.length >= 14) break;
      }
    }
    return dates;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      weekday: 'short',
    });
  };

  const sessionPrice =
    mentor?.session_price_inr || mentor?.session_price || 1500;
  const totalPrice = sessionPrice * 3;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (!mentor) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Mentor not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (showScheduling) {
    const availableDates = getAvailableDates();
    return (
      <ScrollView style={styles.container}>
        <View style={styles.schedulingHeader}>
          <TouchableOpacity onPress={() => setShowScheduling(false)}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.schedulingTitle}>Schedule Sessions</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* session 1 */}
        <View style={styles.section}>
          <View style={styles.sessionHeader}>
            <Ionicons name="calendar" size={20} color={colors.accent} />
            <Text style={styles.sessionTitle}>Session 1 - Technical</Text>
          </View>

          <Text style={styles.scheduleLabel}>Select Date</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.dateScroll}
          >
            {availableDates.map((date, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.dateCard,
                  session1.date?.toDateString() === date.toDateString() &&
                    styles.dateCardSelected,
                ]}
                onPress={() => setSession1({ date, time: null })}
              >
                <Text
                  style={[
                    styles.dateText,
                    session1.date?.toDateString() ===
                      date.toDateString() && styles.dateTextSelected,
                  ]}
                >
                  {formatDate(date)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {session1.date && (
            <>
              <Text
                style={[styles.scheduleLabel, { marginTop: spacing.sm }]}
              >
                Select Time
              </Text>
              <View style={styles.timeGrid}>
                {getTimeSlotsForDate(session1.date).map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={[
                      styles.timeSlot,
                      session1.time === time && styles.timeSlotSelected,
                    ]}
                    onPress={() => setSession1({ ...session1, time })}
                  >
                    <Text
                      style={[
                        styles.timeText,
                        session1.time === time &&
                          styles.timeTextSelected,
                      ]}
                    >
                      {time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
        </View>

        {/* session 2 */}
        <View style={styles.section}>
          <View style={styles.sessionHeader}>
            <Ionicons name="calendar" size={20} color={colors.accent} />
            <Text style={styles.sessionTitle}>Session 2 - Technical</Text>
          </View>

          <Text style={styles.scheduleLabel}>Select Date</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.dateScroll}
          >
            {availableDates.map((date, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.dateCard,
                  session2.date?.toDateString() === date.toDateString() &&
                    styles.dateCardSelected,
                ]}
                onPress={() => setSession2({ date, time: null })}
              >
                <Text
                  style={[
                    styles.dateText,
                    session2.date?.toDateString() ===
                      date.toDateString() && styles.dateTextSelected,
                  ]}
                >
                  {formatDate(date)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {session2.date && (
            <>
              <Text
                style={[styles.scheduleLabel, { marginTop: spacing.sm }]}
              >
                Select Time
              </Text>
              <View style={styles.timeGrid}>
                {getTimeSlotsForDate(session2.date).map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={[
                      styles.timeSlot,
                      session2.time === time && styles.timeSlotSelected,
                    ]}
                    onPress={() => setSession2({ ...session2, time })}
                  >
                    <Text
                      style={[
                        styles.timeText,
                        session2.time === time &&
                          styles.timeTextSelected,
                      ]}
                    >
                      {time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
        </View>

        {/* session 3 */}
        <View style={styles.section}>
          <View style={styles.sessionHeader}>
            <Ionicons name="calendar" size={20} color={colors.accent} />
            <Text style={styles.sessionTitle}>Session 3 - HR Round</Text>
          </View>

          <Text style={styles.scheduleLabel}>Select Date</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.dateScroll}
          >
            {availableDates.map((date, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.dateCard,
                  session3.date?.toDateString() === date.toDateString() &&
                    styles.dateCardSelected,
                ]}
                onPress={() => setSession3({ date, time: null })}
              >
                <Text
                  style={[
                    styles.dateText,
                    session3.date?.toDateString() ===
                      date.toDateString() && styles.dateTextSelected,
                  ]}
                >
                  {formatDate(date)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {session3.date && (
            <>
              <Text
                style={[styles.scheduleLabel, { marginTop: spacing.sm }]}
              >
                Select Time
              </Text>
              <View style={styles.timeGrid}>
                {getTimeSlotsForDate(session3.date).map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={[
                      styles.timeSlot,
                      session3.time === time && styles.timeSlotSelected,
                    ]}
                    onPress={() => setSession3({ ...session3, time })}
                  >
                    <Text
                      style={[
                        styles.timeText,
                        session3.time === time &&
                          styles.timeTextSelected,
                      ]}
                    >
                      {time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
        </View>

        {/* summary */}
        {session1.date &&
          session1.time &&
          session2.date &&
          session2.time &&
          session3.date &&
          session3.time && (
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Booking Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Session 1:</Text>
                <Text style={styles.summaryValue}>
                  {formatDate(session1.date)} at {session1.time}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Session 2:</Text>
                <Text style={styles.summaryValue}>
                  {formatDate(session2.date)} at {session2.time}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Session 3 (HR):</Text>
                <Text style={styles.summaryValue}>
                  {formatDate(session3.date)} at {session3.time}
                </Text>
              </View>
              <View
                style={[
                  styles.summaryRow,
                  {
                    marginTop: 12,
                    paddingTop: 12,
                    borderTopWidth: 1,
                    borderTopColor: colors.border,
                  },
                ]}
              >
                <Text
                  style={[styles.summaryLabel, { fontWeight: 'bold' }]}
                >
                  Total:
                </Text>
                <Text
                  style={[
                    styles.summaryValue,
                    {
                      fontWeight: 'bold',
                      fontSize: 16,
                      color: colors.accent,
                    },
                  ]}
                >
                  ₹{totalPrice.toLocaleString()}
                </Text>
              </View>
            </View>
          )}

        <TouchableOpacity
          style={[
            styles.bookButton,
            bookingLoading && styles.bookButtonDisabled,
          ]}
          onPress={handleBook}
          disabled={bookingLoading}
        >
          {bookingLoading ? (
            <>
              <ActivityIndicator size="small" color={colors.CTA_TEXT} />
              <Text style={styles.bookButtonText}>Processing...</Text>
            </>
          ) : (
            <>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={colors.CTA_TEXT}
              />
              <Text style={styles.bookButtonText}>Confirm & Pay</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={{ height: spacing.lg }} />
      </ScrollView>
    );
  }

  // main detail
  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerCard}>
        <View style={styles.photoContainer}>
          {mentor.profile?.avatar_url ? (
            <Image
              source={{ uri: mentor.profile.avatar_url }}
              style={styles.photo}
            />
          ) : (
            <View style={[styles.photo, styles.photoPlaceholder]}>
              <Text style={styles.photoInitials}>
                {mentor.profile?.full_name?.charAt(0) || 'M'}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.mentorName}>
            {mentor.profile?.full_name || 'Mentor'}
          </Text>
          <Text style={styles.mentorTitle}>{professionalTitle}</Text>
          <View style={[styles.levelBadge]}>
            <Text style={styles.levelText}>
              {mentorLevel.toUpperCase()} LEVEL
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Ionicons name="star" size={20} color="#F59E0B" />
          <Text style={styles.statValue}>{mentor.rating || '5.0'}</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Ionicons name="checkmark-circle" size={20} color={colors.accent} />
          <Text style={styles.statValue}>{mentor.total_sessions || 0}</Text>
          <Text style={styles.statLabel}>Sessions</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Ionicons name="cash" size={20} color={colors.accent} />
          <Text style={styles.statValue}>₹{sessionPrice}</Text>
          <Text style={styles.statLabel}>Per Session</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.aboutText}>{professionalDescription}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Interview Type</Text>
        <Text style={styles.sectionSubtitle}>
          Choose the type of interview you want to practice
        </Text>
        {filteredAdminProfiles.length === 0 ? (
          <Text style={styles.emptyText}>No interview profiles available</Text>
        ) : (
          <View style={{ gap: spacing.sm }}>
            {filteredAdminProfiles.map((profile) => (
              <TouchableOpacity
                key={profile.id}
                style={[
                  styles.profileCard,
                  selectedProfile === profile.name &&
                    styles.profileCardSelected,
                ]}
                onPress={() => setSelectedProfile(profile.name)}
              >
                <View style={styles.profileCardHeader}>
                  <Text
                    style={[
                      styles.profileCardTitle,
                      selectedProfile === profile.name &&
                        styles.profileCardTitleSelected,
                    ]}
                  >
                    {profile.name}
                  </Text>
                  <Ionicons
                    name={
                      selectedProfile === profile.name
                        ? 'radio-button-on'
                        : 'radio-button-off'
                    }
                    size={20}
                    color={
                      selectedProfile === profile.name
                        ? colors.accent
                        : colors.textSecondary
                    }
                  />
                </View>
                {profile.description ? (
                  <Text style={styles.profileCardDescription}>
                    {profile.description}
                  </Text>
                ) : null}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Availability</Text>
        {availabilityDays.length > 0 ? (
          <>
            <View style={styles.calendarDays}>
              {availabilityDays.map((day, idx) => (
                <View key={idx} style={styles.dayCard}>
                  <Ionicons
                    name="calendar"
                    size={14}
                    color={colors.accent}
                  />
                  <Text style={styles.dayText}>{day}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.availabilityNote}>
              Sessions will be scheduled based on mentor&apos;s availability
            </Text>
          </>
        ) : (
          <View style={styles.emptyAvailability}>
            <Ionicons
              name="calendar-outline"
              size={40}
              color={colors.textSecondary}
            />
            <Text style={styles.emptyText}>Default scheduling available</Text>
            <Text style={styles.availabilityNote}>
              Weekdays: 8-10 PM • Weekends: 12-5 PM
            </Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Interview Package</Text>
        <Text style={styles.sectionSubtitle}>
          Comprehensive 3-session preparation
        </Text>
        <View style={styles.packageDetails}>
          <View style={styles.packageRow}>
            <Ionicons
              name="checkmark-circle"
              size={18}
              color={colors.accent}
            />
            <Text style={styles.packageText}>
              Session 1: Technical Interview (60 min)
            </Text>
          </View>
          <View style={styles.packageRow}>
            <Ionicons
              name="checkmark-circle"
              size={18}
              color={colors.accent}
            />
            <Text style={styles.packageText}>
              Session 2: Technical Deep Dive (60 min)
            </Text>
          </View>
          <View style={styles.packageRow}>
            <Ionicons
              name="checkmark-circle"
              size={18}
              color={colors.accent}
            />
            <Text style={styles.packageText}>
              Session 3: HR/Behavioral Round (60 min)
            </Text>
          </View>
        </View>
        <View style={styles.priceBox}>
          <Text style={styles.priceLabel}>Total Package Price</Text>
          <Text style={styles.priceValue}>
            ₹{totalPrice.toLocaleString()}
          </Text>
          <Text style={styles.priceNote}>
            ₹{sessionPrice} × 3 sessions
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.bookButton}
        onPress={handleContinue}
      >
        <Ionicons name="calendar" size={20} color={colors.CTA_TEXT} />
        <Text style={styles.bookButtonText}>
          Continue to Schedule Sessions
        </Text>
      </TouchableOpacity>

      <View style={{ height: spacing.lg }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  errorText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  backBtn: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  backBtnText: { color: colors.CTA_TEXT, fontWeight: '600' },
  headerCard: {
    backgroundColor: colors.background,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  photoContainer: { alignItems: 'center', marginBottom: spacing.md },
  photo: { width: 100, height: 100, borderRadius: 999 },
  photoPlaceholder: {
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoInitials: { fontSize: 36, fontWeight: 'bold', color: '#fff' },
  headerInfo: { alignItems: 'center' },
  mentorName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  mentorTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  levelBadge: {
    backgroundColor: 'rgba(14,147,132,0.1)',
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
  },
  levelText: { color: colors.accent, fontWeight: '700', fontSize: 12 },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 4,
  },
  statLabel: { fontSize: 12, color: colors.textSecondary },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.sm,
  },
  section: {
    backgroundColor: colors.background,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  aboutText: { fontSize: 14, color: colors.text, lineHeight: 20 },
  emptyText: { fontSize: 14, color: colors.textSecondary, marginTop: spacing.xs },
  profileCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    backgroundColor: colors.background,
  },
  profileCardSelected: {
    borderColor: colors.accent,
    backgroundColor: 'rgba(14,147,132,0.06)',
  },
  profileCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  profileCardTitle: { fontSize: 14, fontWeight: '600', color: colors.text },
  profileCardTitleSelected: { color: colors.accent },
  profileCardDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  calendarDays: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  dayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    backgroundColor: 'rgba(14,147,132,0.08)',
    borderRadius: borderRadius.sm,
  },
  dayText: { fontSize: 13, fontWeight: '600', color: colors.text },
  availabilityNote: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  emptyAvailability: { alignItems: 'center', paddingVertical: spacing.lg },
  packageDetails: { gap: spacing.sm, marginBottom: spacing.sm },
  packageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  packageText: { fontSize: 14, color: colors.text },
  priceBox: {
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  priceLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  priceValue: { fontSize: 26, fontWeight: '700', color: colors.text },
  priceNote: { fontSize: 12, color: colors.textTertiary, marginTop: 2 },
  schedulingHeader: {
    backgroundColor: colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  schedulingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: spacing.sm,
  },
  sessionTitle: { fontSize: 16, fontWeight: '600', color: colors.text },
  scheduleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  dateScroll: { marginBottom: 6 },
  dateCard: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.md,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  dateCardSelected: {
    backgroundColor: 'rgba(14,147,132,0.1)',
    borderColor: colors.accent,
  },
  dateText: { fontSize: 13, color: colors.textSecondary },
  dateTextSelected: { color: colors.accent, fontWeight: '600' },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  timeSlot: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  timeSlotSelected: {
    backgroundColor: 'rgba(14,147,132,0.08)',
    borderColor: colors.accent,
  },
  timeText: { fontSize: 13, color: colors.textSecondary },
  timeTextSelected: { color: colors.accent, fontWeight: '600' },
  summaryCard: {
    backgroundColor: colors.background,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  summaryLabel: { fontSize: 14, color: colors.textSecondary },
  summaryValue: { fontSize: 14, color: colors.text },
  bookButton: {
    backgroundColor: colors.CTA,
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  bookButtonDisabled: { opacity: 0.6 },
  bookButtonText: {
    color: colors.CTA_TEXT,
    fontSize: 16,
    fontWeight: '600',
  },
});
