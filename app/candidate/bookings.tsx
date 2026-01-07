// app/candidate/bookings.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, ScrollView, StyleSheet, TouchableOpacity, Linking, 
  ActivityIndicator, Alert, Platform, RefreshControl, StatusBar, Modal 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Libs
import { supabase } from '@/lib/supabase/client'; 
import { useAuthStore } from '@/lib/store';
import { theme } from '@/lib/theme';
import { Heading, AppText, Card, ScreenBackground } from '@/lib/ui';
import { DateTime, Interval } from 'luxon';

// Components
import RatingModal from '@/components/RatingModal';

// 🟢 SINGLE SOURCE OF TRUTH (Calculates UI state from DB status)
import { getBookingState, getBookingDetails, BookingUIState } from '@/lib/booking-logic';

// Master Templates for Evaluation Display
import { MASTER_TEMPLATES } from '@/lib/evaluation-templates';

// 🟢 DayCard Component for Reschedule Modal
type DayAvailability = { dateStr: string; weekdayName: string; monthDay: string; slots: any[]; isFullDayOff: boolean };

// Day mapping: Luxon weekday (1=Mon, 7=Sun) to day keys
const DAY_KEY_MAP = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

const DayCard = ({ day, isSelected, onPress }: { day: DayAvailability, isSelected: boolean, onPress: () => void }) => {
  const availableCount = day.slots.filter((s: any) => s.isAvailable).length;
  const isTimeOff = day.isFullDayOff;

  return (
    <TouchableOpacity
      style={[
        rescheduleDayCardStyles.dayCard,
        isSelected && rescheduleDayCardStyles.dayCardSelected,
        isTimeOff && rescheduleDayCardStyles.dayCardTimeOff,
        !isTimeOff && availableCount === 0 && rescheduleDayCardStyles.dayCardFull,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <AppText style={[rescheduleDayCardStyles.dayCardWeekday, isSelected && rescheduleDayCardStyles.dayCardTextSelected]}>
        {day.weekdayName}
      </AppText>
      <AppText style={[rescheduleDayCardStyles.dayCardDate, isSelected && rescheduleDayCardStyles.dayCardTextSelected]}>
        {day.monthDay}
      </AppText>
      
      <View style={[
        rescheduleDayCardStyles.statusDot, 
        isTimeOff ? { backgroundColor: '#EF4444' } : 
        availableCount > 0 ? { backgroundColor: '#10B981' } : { backgroundColor: '#9CA3AF' }
      ]} />
      
      <AppText style={[rescheduleDayCardStyles.dayCardStatus, isSelected && rescheduleDayCardStyles.dayCardTextSelected]}>
        {isTimeOff ? 'Off' : availableCount > 0 ? `${availableCount} open` : 'Full'}
      </AppText>
    </TouchableOpacity>
  );
};

const rescheduleDayCardStyles = StyleSheet.create({
  dayCard: { width: 70, height: 84, backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center', padding: 4 },
  dayCardSelected: { borderColor: theme.colors.primary, backgroundColor: '#F0FDFA', borderWidth: 2 },
  dayCardTimeOff: { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }, 
  dayCardFull: { opacity: 0.6, backgroundColor: '#F3F4F6' },
  dayCardWeekday: { fontSize: 11, color: '#888', marginBottom: 2 },
  dayCardDate: { fontSize: 12, fontWeight: '700', color: '#333', marginBottom: 6 },
  dayCardStatus: { fontSize: 9, color: '#666', marginTop: 4 },
  dayCardTextSelected: { color: theme.colors.primary, fontWeight: '700' },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
});

const BookingCard = ({ session, onJoin, onViewDetails, onViewEvaluation, onRebook, onRateSession, onAcceptReschedule, onReschedule }: any) => {
  const uiState = getBookingState(session);
  const details = getBookingDetails(session);

  const profileName = session.package?.interview_profile_name || 'Interview';
  const mentorTitle = session.mentor_professional_title || 'Mentor';
  const skillName = session.skill_name || 'Interview Session';
  
  // 🟢 Helper to check if it's my turn to act
  const isMyTurn = details.rescheduledBy === 'mentor';

  return (
    <Card style={styles.sessionCard}>
      <View style={styles.splitContainer}>
        {/* LEFT SIDE: Info */}
        <View style={styles.leftSection}>
          <Heading level={4} style={styles.cardTitle}>
            {profileName} interview with {mentorTitle}
          </Heading>
          
          <View style={styles.infoRow}>
            <Ionicons name="bulb-outline" size={14} color="#6B7280" />
            <AppText style={styles.infoText}>{skillName}</AppText>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={14} color="#6B7280" />
            <AppText style={styles.infoText}>
              {details.dateLabel} • {details.timeLabel}
            </AppText>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={14} color="#6B7280" />
            <AppText style={styles.infoText}>55 mins (45 min interview + 10 min feedback)</AppText>
          </View>
        </View>

        {/* RIGHT SIDE: Badge */}
        <View style={styles.rightSection}>
          <Badge state={uiState} />
        </View>
      </View>

      <View style={styles.cardDivider} />

      {/* --- DYNAMIC ACTIONS --- */}

      {/* 1. PENDING APPROVAL */}
      {uiState === 'APPROVAL' && (
        <View style={styles.actionRowFull}>
          <View style={[styles.btnFull, styles.btnDisabled]}>
            <Ionicons name="hourglass-outline" size={16} color="#6B7280" style={{marginRight: 6}} />
            <AppText style={styles.textGray}>Pending Mentor Approval</AppText>
          </View>
        </View>
      )}

      {/* 2. RESCHEDULE PENDING (The Loop) */}
      {uiState === 'RESCHEDULE_PENDING' && (
        <>
          {isMyTurn ? (
            // CASE A: Mentor Proposed -> I can Accept or Reschedule
            <>
              <View style={styles.bannerAction}>
                <View style={styles.bannerHeader}>
                  <Ionicons name="time-outline" size={18} color="#B45309" />
                  <AppText style={styles.bannerTitleAction}>
                    Mentor Proposed New Time
                  </AppText>
                </View>
                <AppText style={styles.bannerTextAction}>
                  📅 {details.dateLabel} at {details.timeLabel}
                </AppText>
                <AppText style={styles.bannerSubTextAction}>
                  Accept this time or propose a different one
                </AppText>
              </View>
              <View style={styles.actionRowFull}>
                <TouchableOpacity 
                  style={[styles.btnFull, styles.btnOutline]} 
                  onPress={() => onReschedule(session)}
                >
                  <AppText style={styles.textPrimary}>Reschedule</AppText>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.btnFull, styles.btnPrimary]} 
                  onPress={() => onAcceptReschedule(session.id)}
                >
                  <AppText style={styles.textWhite}>Accept Time</AppText>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            // CASE B: I Proposed -> Waiting for Mentor
            <View style={styles.bannerWaiting}>
              <View style={styles.bannerHeader}>
                <Ionicons name="hourglass-outline" size={18} color="#B45309" />
                <AppText style={styles.bannerTitleWaiting}>
                  Reschedule Request Sent
                </AppText>
              </View>
              <AppText style={styles.bannerTextWaiting}>
                You proposed: {details.dateLabel} at {details.timeLabel}
              </AppText>
              <AppText style={styles.bannerSubTextWaiting}>
                Waiting for mentor to accept or propose a different time.
              </AppText>
            </View>
          )}
        </>
      )}

      {/* 3. CONFIRMED Future */}
      {uiState === 'SCHEDULED' && (
        <View style={styles.actionRowFull}>
           <View style={[styles.btnFull, styles.btnDisabled]}>
            <Ionicons name="checkmark-circle-outline" size={16} color="#059669" style={{marginRight: 6}} />
            <AppText style={[styles.textGray, {color: '#059669'}]}>Confirmed</AppText>
          </View>
          <TouchableOpacity 
            style={[styles.btnFull, styles.btnSecondary]} 
            onPress={() => onViewDetails(session)}
          >
            <AppText style={styles.textPrimary}>View Details</AppText>
          </TouchableOpacity>
        </View>
      )}

      {/* 4. LIVE NOW */}
      {uiState === 'JOIN' && (
        <>
          <View style={{backgroundColor: '#F0FDFA', padding: 12, borderRadius: 8, marginBottom: 12, flexDirection: 'row', alignItems: 'flex-start', gap: 8}}>
            <Ionicons name="information-circle-outline" size={18} color="#14B8A6" style={{marginTop: 2}} />
            <AppText style={{flex: 1, fontSize: 13, color: '#0F766E', lineHeight: 20}}>
              Feel free to record this meeting for later reference and review.
            </AppText>
          </View>
          <View style={styles.actionRowFull}>
            <TouchableOpacity style={[styles.btnFull, styles.btnGreen]} onPress={() => onJoin(session.meeting_link)}>
              <Ionicons name="videocam" size={18} color="#fff" style={{marginRight:4}}/>
              <AppText style={styles.textWhite}>Join Meeting</AppText>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* 5. PAST */}
      {uiState === 'POST_PENDING' && (
        <View style={styles.actionRowFull}>
          <View style={[styles.btnFull, styles.btnDisabled]}>
            <Ionicons name="clipboard-outline" size={16} color="#6B7280" style={{marginRight: 6}} />
            <AppText style={styles.textGray}>Awaiting Evaluation</AppText>
          </View>
        </View>
      )}

      {/* 6. COMPLETED - With Rate Session */}
      {uiState === 'POST_COMPLETED' && (
        <>
          <View style={styles.actionRowFull}>
            <TouchableOpacity 
              style={[styles.btnFull, styles.btnSecondary]} 
              onPress={() => onRebook(session.mentor_id)}
            >
              <Ionicons name="refresh-outline" size={16} color={theme.colors.primary} style={{marginRight: 6}} />
              <AppText style={styles.textPrimary}>Rebook</AppText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.btnFull, styles.btnPrimary]} 
              onPress={() => onViewEvaluation(session.id)}
            >
              <AppText style={styles.textWhite}>View Feedback</AppText>
            </TouchableOpacity>
          </View>
          
          {/* Rating Section */}
          {session.review_rating ? (
            <View style={styles.ratingSection}>
              <AppText style={styles.ratedLabel}>Your rating:</AppText>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <AppText key={star} style={styles.starText}>
                    {star <= session.review_rating ? '⭐' : '☆'}
                  </AppText>
                ))}
              </View>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.rateBtn} 
              onPress={() => onRateSession(session)}
            >
              <Ionicons name="star-outline" size={16} color={theme.colors.primary} />
              <AppText style={styles.rateText}>Rate this session</AppText>
            </TouchableOpacity>
          )}
        </>
      )}
    </Card>
  );
};

const Badge = ({ state }: { state: BookingUIState }) => {
  let bg = '#E5E7EB'; let text = '#374151'; let label = 'Unknown';
  
  if(state === 'APPROVAL') { bg = '#FEF3C7'; text = '#B45309'; label = 'Pending'; }
  else if(state === 'RESCHEDULE_PENDING') { bg = '#FEF3C7'; text = '#B45309'; label = 'Reschedule Requested'; }
  else if(state === 'SCHEDULED') { bg = '#DBEAFE'; text = '#1E40AF'; label = 'Confirmed'; }
  else if(state === 'JOIN') { bg = '#D1FAE5'; text = '#047857'; label = 'Live Now'; }
  else if(state === 'POST_PENDING') { bg = '#F3F4F6'; text = '#6B7280'; label = 'Ended'; }
  else if(state === 'POST_COMPLETED') { bg = '#DEF7EC'; text = '#03543F'; label = 'Finished'; }
  else if(state === 'CANCELLED') { bg = '#FEE2E2'; text = '#991B1B'; label = 'Cancelled'; }
  
  return (
    <View style={{ backgroundColor: bg, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
      <AppText style={{ color: text, fontSize: 10, fontWeight: '700', textTransform: 'uppercase' }}>{label}</AppText>
    </View>
  );
};

// --- MAIN SCREEN ---
export default function CandidateBookingsScreen() {
  const { user } = useAuthStore(); 
  const router = useRouter();
  
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);

  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [detailContent, setDetailContent] = useState({ 
    skillName: '', 
    templates: [] as Array<{ title: string; examples: string[]; questions: any[] }> 
  });

  // 🟢 NEW: Reschedule modal states (matching mentor side)
  type Slot = { time: string; isAvailable: boolean; dateTime: any };
  type DayAvailability = { dateStr: string; weekdayName: string; monthDay: string; slots: Slot[]; isFullDayOff: boolean };
  
  const [rescheduleModalVisible, setRescheduleModalVisible] = useState(false);
  const [availabilityData, setAvailabilityData] = useState<DayAvailability[]>([]);
  const [selectedDay, setSelectedDay] = useState<DayAvailability | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loadingReschedule, setLoadingReschedule] = useState(false);

  const fetchBookings = async () => {
    let currentUser = user;
    if (!currentUser) {
       const { data } = await supabase.auth.getUser();
       currentUser = data.user;
    }

    if (!currentUser) {
        setLoading(false); setRefreshing(false);
        return;
    }
    
    try {
      // 🟢 UPDATED: Added pending_reschedule_approval and rescheduled_by
      const { data: sessionsData, error } = await supabase
        .from('interview_sessions')
        .select(`
          id, scheduled_at, status, skill_id, meeting_link, mentor_id, package_id,
          pending_reschedule_approval, rescheduled_by,
          package:interview_packages!package_id(id, payment_status, interview_profile_id)
        `)
        .eq('candidate_id', currentUser.id)
        .order('scheduled_at', { ascending: true });

      if (error) throw error;
      if (!sessionsData || sessionsData.length === 0) {
        setSessions([]);
        setLoading(false); setRefreshing(false);
        return;
      }

      // Filter out sessions where payment is still pending (exclude unpaid bookings)
      const paidSessions = sessionsData.filter((s: any) => 
        s.package?.payment_status && s.package.payment_status !== 'pending'
      );

      // 🆕 2. Fetch Reviews for these packages
      const packageIds = paidSessions.map((s: any) => s.package_id).filter(Boolean);
      let reviewsMap: any = {};

      if (packageIds.length > 0) {
        const { data: reviewsData } = await supabase
          .from('candidate_reviews')
          .select('package_id, rating')
          .in('package_id', packageIds);

        if (reviewsData) {
          reviewsMap = reviewsData.reduce((acc: any, curr: any) => {
            acc[curr.package_id] = curr.rating;
            return acc;
          }, {});
        }
      }

      // 3. Fetch Mentors
      const mentorIds = [...new Set(paidSessions.map((s: any) => s.mentor_id))];
      const { data: mentorData, error: mentorError } = await supabase
        .from('mentors')
        .select('id, professional_title, average_rating, total_sessions')
        .in('id', mentorIds);

      if (mentorError) {
        console.error('[Bookings] Error fetching mentors:', mentorError);
      }

      console.log('[Bookings] Fetched mentors:', mentorData);

      const mentorMap = (mentorData || []).reduce((acc: any, curr: any) => {
        acc[curr.id] = curr;
        return acc;
      }, {});

      // 4. Fetch Interview Profiles
      const profileIds = Array.from(new Set(paidSessions.map((s: any) => s.package?.interview_profile_id).filter((id) => id != null)));
      let profileMap: any = {};

      if (profileIds.length > 0) {
        const { data: profiles } = await supabase
          .from('interview_profiles_admin')
          .select('id, name, description')
          .in('id', profileIds);

        if (profiles) {
          profileMap = Object.fromEntries(profiles.map((p: any) => [String(p.id), { name: p.name, description: p.description ?? null }]));
        }
      }

      // 5. Fetch Skills
      const skillIds = [...new Set(paidSessions.map((s: any) => s.skill_id).filter(Boolean))];
      let skillMap: any = {};

      if (skillIds.length > 0) {
        const { data: skillsData } = await supabase
          .from('interview_skills_admin')
          .select('id, name, description')
          .in('id', skillIds);

        if (skillsData) {
          skillMap = skillsData.reduce((acc: any, curr: any) => {
            acc[curr.id] = curr;
            return acc;
          }, {});
        }
      }

      // 6. Merge Data
      const enrichedSessions = paidSessions.map((s: any) => {
        const mentor = mentorMap[s.mentor_id];
        const profileId = s.package?.interview_profile_id;
        const profileMeta = profileId != null ? profileMap[String(profileId)] ?? null : null;
        const skillMeta = s.skill_id ? skillMap[s.skill_id] : null;

        // Debug: Log mentor data for this session
        console.log('[Bookings] Session:', s.id, 'Mentor ID:', s.mentor_id);
        console.log('[Bookings] Mentor data:', mentor);
        console.log('[Bookings] Professional title:', mentor?.professional_title);

        return {
          ...s,
          mentor_professional_title: mentor?.professional_title || 'MentorP',
          mentor_rating: mentor?.average_rating || 0,
          mentor_session_count: mentor?.total_sessions || 0,
          skill_name: skillMeta?.name || 'Mock Interview',
          skill_description: skillMeta?.description || '',
          package: {
            ...s.package,
            interview_profile_name: profileMeta?.name || 'Interview',
            interview_profile_description: profileMeta?.description || '',
          },
          review_rating: reviewsMap[s.package_id] || null,
        };
      });

      setSessions(enrichedSessions);
    } catch (err: any) {
      console.error('[Bookings] Error:', err);
      Alert.alert('Error', err.message || 'Failed to load bookings');
      setSessions([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  const handleJoin = (meetingLink: string) => {
    if (!meetingLink) {
      Alert.alert('Error', 'No meeting link available.');
      return;
    }
    Linking.openURL(meetingLink);
  };

  const handleViewDetails = (session: any) => {
    const profileId = Number(session.package?.interview_profile_id);
    const skillId = session.skill_id;

    let skillName = session.skill_name || 'Interview Details';
    let templates: Array<{ title: string; examples: string[]; questions: any[] }> = [];

    // Try to get templates from MASTER_TEMPLATES
    if (profileId && skillId && MASTER_TEMPLATES[profileId]?.skills[skillId]) {
      const skillData = MASTER_TEMPLATES[profileId].skills[skillId];
      skillName = skillData.skill_name || session.skill_name;
      
      if (skillData.templates && skillData.templates.length > 0) {
        // Map all templates, grouping by title
        templates = skillData.templates.map(template => ({
          title: template.title,
          examples: template.example || [],
          questions: template.questions || []
        }));
      }
    }

    // Fallback to skill description if no templates found
    if (templates.length === 0 && session.skill_description) {
      templates = [{
        title: 'Description',
        examples: [session.skill_description],
        questions: []
      }];
    }

    setDetailContent({ skillName, templates });
    setDetailModalVisible(true);
  };

  const handleViewEvaluation = (sessionId: string) => {
    router.push(`/candidate/session/${sessionId}`);
  };

  const handleRebook = (mentorId: string) => {
    router.push(`/candidate/mentors/${mentorId}`);
  };

  const handleOpenRatingModal = (session: any) => {
    setSelectedSession(session);
    setRatingModalVisible(true);
  };

  // 🟢 NEW: Accept Reschedule
  const handleAcceptReschedule = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('interview_sessions')
        .update({
          status: 'confirmed',
          pending_reschedule_approval: false,
          rescheduled_by: null
        })
        .eq('id', sessionId);

      if (error) throw error;

      Alert.alert('Success', 'New time confirmed!');
      fetchBookings();
    } catch (err: any) {
      console.error('[AcceptReschedule] Error:', err);
      Alert.alert('Error', err.message || 'Failed to accept reschedule');
    }
  };

  // 🟢 NEW: Reschedule Modal Handlers
  const handleRescheduleStart = (session: any) => {
    setSelectedSession(session);
    setSelectedDay(null);
    setSelectedSlot(null);
    setRescheduleModalVisible(true);
    
    // Generate 30 days availability for the mentor
    if (session.mentor_id) {
      generateAvailability(session.mentor_id, session.id);
    } else {
      Alert.alert('Error', 'Mentor information not found');
    }
  };

  const generateAvailability = async (mentorId: string, excludeSessionId?: string) => {
    console.log('[Reschedule] Starting availability generation for mentor:', mentorId, 'excluding session:', excludeSessionId);
    setLoadingReschedule(true);
    try {
      const IST_ZONE = 'Asia/Kolkata';
      const BOOKING_WINDOW_DAYS = 30;
      
      const now = DateTime.now().setZone(IST_ZONE);
      const startDate = now.plus({ days: 1 }).startOf('day'); 
      const endDate = startDate.plus({ days: BOOKING_WINDOW_DAYS }).endOf('day');

      // 1. Get availability rules
      const { data: rulesData, error: rulesError } = await supabase
        .from('mentor_availability_rules')
        .select('weekdays, weekends')
        .eq('mentor_id', mentorId)
        .maybeSingle();
        
      if (rulesError && rulesError.code !== 'PGRST116') throw rulesError;

      const finalRulesData = rulesData || {
        weekdays: {
          monday: { start: '20:00', end: '22:00', isActive: true },
          tuesday: { start: '20:00', end: '22:00', isActive: true },
          wednesday: { start: '20:00', end: '22:00', isActive: true },
          thursday: { start: '20:00', end: '22:00', isActive: true },
          friday: { start: '20:00', end: '22:00', isActive: true }
        },
        weekends: {
          saturday: { start: '12:00', end: '17:00', isActive: true },
          sunday: { start: '12:00', end: '17:00', isActive: true }
        }
      };


      console.log('[Reschedule] Rules:', finalRulesData);

      // 2. Get unavailability
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

      // 3. Get existing bookings (filter in JS to avoid query builder issues)
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('interview_sessions')
        .select('scheduled_at, id')
        .eq('mentor_id', mentorId)
        .gte('scheduled_at', startDate.toISO())
        .lte('scheduled_at', endDate.toISO())
        .in('status', ['pending', 'confirmed', 'scheduled']);
      
      if (bookingsError) {
        console.error('[Reschedule] Error fetching bookings:', bookingsError);
      }

      // Filter out the current session being rescheduled
      const filteredBookings = (bookingsData || []).filter(b => b.id !== excludeSessionId);

      const bookedSlots = new Set(
        filteredBookings.map(b => DateTime.fromISO(b.scheduled_at, { zone: IST_ZONE }).toISO())
      );

      console.log('[Reschedule] Booked slots count:', bookedSlots.size);

      // 4. Generate days
      const days: DayAvailability[] = [];
      let currentDate = startDate;

      while (currentDate <= endDate) {
        const dayOfWeek = currentDate.weekday % 7; // 0=Sunday, 1=Monday, ..., 6=Saturday
        const dayKey = DAY_KEY_MAP[dayOfWeek];
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const source = isWeekend ? finalRulesData.weekends : finalRulesData.weekdays;
        const rules = source?.[dayKey] || { start: '09:00', end: '17:00', isActive: false };

        // Check if full day blocked
        const dayInterval = Interval.fromDateTimes(currentDate.startOf('day'), currentDate.endOf('day'));
        const isFullDayOff = unavailabilityIntervals.some(uInterval => 
          uInterval.engulfs(dayInterval) || !rules.isActive
        );

        const slots: any[] = [];
        
        if (!isFullDayOff && rules.isActive) {
          const [startHour] = rules.start.split(':').map(Number);
          const [endHour] = rules.end.split(':').map(Number);
          
          for (let hour = startHour; hour < endHour; hour++) {
            const slotDateTime = currentDate.set({ hour, minute: 0, second: 0 });
            const slotISO = slotDateTime.toISO();
            
            const isBooked = bookedSlots.has(slotISO);
            const isBlocked = unavailabilityIntervals.some(interval => interval.contains(slotDateTime));
            const isAvailable = !isBooked && !isBlocked;
            
            slots.push({
              time: slotDateTime.toFormat('HH:mm'),
              isAvailable,
              dateTime: slotDateTime
            });
          }
        }

        days.push({
          dateStr: currentDate.toFormat('yyyy-MM-dd'),
          weekdayName: currentDate.toFormat('EEE'),
          monthDay: currentDate.toFormat('MMM d'),
          slots,
          isFullDayOff
        });

        currentDate = currentDate.plus({ days: 1 });
      }

      console.log('[Reschedule] Generated', days.length, 'days. Days with slots:', days.filter(d => d.slots.length > 0).length);
      setAvailabilityData(days);
    } catch (err) {
      console.error('[Reschedule] Error generating availability:', err);
      Alert.alert('Error', 'Could not load availability');
      setAvailabilityData([]);
    } finally {
      setLoadingReschedule(false);
    }
  };

  const handleRescheduleConfirm = async () => {
    if (!selectedSession || !selectedDay || !selectedSlot) {
      Alert.alert('Error', 'Please select a date and time slot');
      return;
    }
    
    try {
        const slot = selectedDay.slots.find((s: any) => s.time === selectedSlot);
        if (!slot) throw new Error('Invalid slot selected');
        
        const newMeetingLink = `https://meet.jit.si/crackjobs-${selectedSession.id}`;

        // 🟢 Set pending_reschedule_approval flag with rescheduled_by: 'candidate'
        // This ensures the mentor gets the request next.
        const { error } = await supabase
            .from('interview_sessions')
            .update({ 
                scheduled_at: slot.dateTime.toISO(),
                meeting_link: newMeetingLink,
                pending_reschedule_approval: true,
                rescheduled_by: 'candidate'
            })
            .eq('id', selectedSession.id);
        
        setRescheduleModalVisible(false);
        if (error) throw error;

        Alert.alert('Success', 'Reschedule request sent to mentor for approval.');
        fetchBookings();
    } catch (e: any) {
        setRescheduleModalVisible(false);
        console.error('[Reschedule] Error:', e);
        Alert.alert('Error', e?.message || 'Could not reschedule the interview.');
    }
  };

  if (loading) {
    return (
      <ScreenBackground style={styles.container}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
      >
        <View style={styles.header}>
          <Heading level={2} style={styles.title}>My Bookings</Heading>
        </View>

        {sessions.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color="#D1D5DB" />
            <AppText style={styles.emptyText}>No bookings yet</AppText>
            <AppText style={styles.emptyHint}>Book a session to get started!</AppText>
          </View>
        ) : (
          sessions.map((session) => (
            <BookingCard
              key={session.id}
              session={session}
              onJoin={handleJoin}
              onViewDetails={handleViewDetails}
              onViewEvaluation={handleViewEvaluation}
              onRebook={handleRebook}
              onRateSession={handleOpenRatingModal}
              onAcceptReschedule={handleAcceptReschedule}
              onReschedule={handleRescheduleStart}
            />
          ))
        )}
      </ScrollView>

      {/* Detail Modal */}
      <Modal visible={detailModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Heading level={3} style={styles.modalTitle}>{detailContent.skillName}</Heading>
            
            <ScrollView 
              style={{ maxHeight: 400, backgroundColor: '#fff' }} 
              contentContainerStyle={{paddingBottom: 20, backgroundColor: '#fff'}}
            >
              
              {/* Loop through templates, grouped by title */}
              {detailContent.templates.length > 0 ? (
                detailContent.templates.map((template, templateIdx) => (
                  <View key={templateIdx} style={{marginBottom: templateIdx < detailContent.templates.length - 1 ? 24 : 0}}>
                    
                    {/* Template Title */}
                    <AppText style={{ 
                      fontWeight: '700', 
                      color: theme.colors.primary, 
                      marginBottom: 12, 
                      fontSize: 16,
                      borderBottomWidth: 1,
                      borderBottomColor: '#E5E7EB',
                      paddingBottom: 8
                    }}>
                      {template.title}
                    </AppText>

                    {/* Examples Section */}
                    {template.examples.length > 0 && (
                      <View style={{marginBottom: 16}}>
                        <AppText style={{ fontWeight: '600', color: theme.colors.text.main, marginBottom: 8, fontSize: 14 }}>
                          Example Scenarios:
                        </AppText>
                        {template.examples.map((example, idx) => (
                          <View key={idx} style={{ flexDirection: 'row', gap: 8, paddingRight: 10, marginBottom: 6 }}>
                            <AppText style={{ color: theme.colors.primary, fontSize: 16 }}>•</AppText>
                            <AppText style={{ flex: 1, color: '#374151', lineHeight: 22 }}>
                              {example}
                            </AppText>
                          </View>
                        ))}
                      </View>
                    )}

                    {/* Questions Section */}
                    {template.questions.length > 0 && (
                      <View>
                        <AppText style={{ fontWeight: '600', color: theme.colors.text.main, marginBottom: 8, fontSize: 14 }}>
                          Evaluation Questions:
                        </AppText>
                        {template.questions.map((question, idx) => (
                          <View key={idx} style={{ marginBottom: 12 }}>
                            <AppText style={{ fontWeight: '500', color: '#374151', marginBottom: 4 }}>
                              {idx + 1}. {question.text}
                            </AppText>
                            {question.title && Array.isArray(question.title) && question.title.length > 0 && (
                              <View style={{ paddingLeft: 16, marginTop: 4 }}>
                                {question.title.map((tip, tipIdx) => (
                                  <View key={tipIdx} style={{ flexDirection: 'row', gap: 6, marginBottom: 2 }}>
                                    <AppText style={{ color: '#6B7280', fontSize: 14 }}>◦</AppText>
                                    <AppText style={{ flex: 1, color: '#6B7280', fontSize: 14, lineHeight: 20 }}>
                                      {tip}
                                    </AppText>
                                  </View>
                                ))}
                              </View>
                            )}
                          </View>
                        ))}
                      </View>
                    )}

                  </View>
                ))
              ) : (
                /* Fallback if no templates found */
                <AppText style={{color: '#6B7280', fontStyle: 'italic'}}>
                  No details available for this interview.
                </AppText>
              )}

            </ScrollView>

            <TouchableOpacity onPress={() => setDetailModalVisible(false)} style={styles.modalCloseBtn}>
              <AppText style={styles.textWhite}>Close</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Rating Modal */}
      {selectedSession && (
        <RatingModal
          visible={ratingModalVisible}
          onClose={() => {
            setRatingModalVisible(false);
            setSelectedSession(null);
          }}
          session={selectedSession}
          onRatingSubmitted={() => {
            setRatingModalVisible(false);
            setSelectedSession(null);
            fetchBookings();
          }}
        />
      )}

      {/* Reschedule Modal */}
      <Modal visible={rescheduleModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.modalScrollContent} style={{flex: 1}}>
              <View style={styles.modalContent}>
                <Heading level={3} style={{marginBottom:8}}>Propose New Time</Heading>
                <AppText style={{marginBottom: 16, color: '#6B7280'}}>
                  Select a time that works better for you
                </AppText>
                
                {/* Current Time */}
                {selectedSession && (
                  <View style={{backgroundColor: '#F9FAFB', padding: 12, borderRadius: 8, marginBottom: 16}}>
                    <AppText style={{fontSize: 12, fontWeight: '600', color: '#6B7280', marginBottom: 4}}>CURRENT PROPOSED TIME</AppText>
                    <AppText style={{fontSize: 14, color: '#374151'}}>
                      📅 {new Date(selectedSession.scheduled_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(selectedSession.scheduled_at).toLocaleTimeString('en-IN', {hour: '2-digit', minute: '2-digit', hour12: true})}
                    </AppText>
                  </View>
                )}

                {loadingReschedule ? (
                  <ActivityIndicator size="large" color={theme.colors.primary} style={{marginVertical: 40}} />
                ) : (
                  <>
                    {/* Date Picker */}
                    <View style={{marginBottom: 16}}>
                      <AppText style={{fontSize: 12, fontWeight: '700', color: '#333', marginBottom: 8, textTransform: 'uppercase'}}>
                        <Ionicons name="calendar-outline" size={14} /> Available Days (Next 30)
                      </AppText>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 4 }}>
                        {availabilityData.map((day) => (
                          <DayCard 
                            key={day.dateStr} 
                            day={day} 
                            isSelected={selectedDay?.dateStr === day.dateStr} 
                            onPress={() => {
                              setSelectedDay(day);
                              setSelectedSlot(null);
                            }}
                          />
                        ))}
                      </ScrollView>
                    </View>

                    {/* Selected Slot Display */}
                    <View style={{backgroundColor: selectedSlot ? '#F0FDFA' : '#FFF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: selectedSlot ? theme.colors.primary : '#EEE', alignItems: 'center', marginBottom: 16}}>
                      <AppText style={{fontSize: 11, fontWeight: '700', color: '#999', marginBottom: 8}}>YOUR PROPOSED TIME</AppText>
                      {selectedSlot && selectedDay ? (
                        <View style={{ alignItems: 'center' }}>
                          <AppText style={{fontSize: 20, fontWeight: '600', color: theme.colors.primary}}>{selectedSlot}</AppText>
                          <AppText style={{fontSize: 14, fontWeight: '500', color: '#666', marginTop: 4}}>
                            {DateTime.fromFormat(selectedDay.dateStr, 'yyyy-MM-dd').toFormat('MMM dd, yyyy')}
                          </AppText>
                        </View>
                      ) : (
                        <AppText style={{fontSize: 16, color: '#CCC', fontStyle: 'italic'}}>Tap a time below</AppText>
                      )}
                    </View>

                    {/* Time Slots */}
                    <View style={{marginBottom: 16}}>
                      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12}}>
                        <AppText style={{fontSize: 12, fontWeight: '700', color: '#333', textTransform: 'uppercase'}}>
                          <Ionicons name="time-outline" size={14} /> Time Slots (IST)
                        </AppText>
                        {selectedDay?.isFullDayOff && (
                          <View style={{backgroundColor: '#FEF2F2', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4}}>
                            <AppText style={{color: '#EF4444', fontSize: 10, fontWeight: 'bold'}}>Time Off</AppText>
                          </View>
                        )}
                      </View>
                      
                      {(!selectedDay || (selectedDay.slots.length === 0 && !selectedDay.isFullDayOff)) ? (
                        <View style={{padding: 20, alignItems: 'center', borderWidth: 1, borderColor: '#EEE', borderRadius: 8, borderStyle: 'dashed'}}>
                          <AppText style={{ color: '#999' }}>No slots configured for this day.</AppText>
                        </View>
                      ) : selectedDay.isFullDayOff ? (
                        <View style={{padding: 20, alignItems: 'center', borderWidth: 1, borderColor: '#EEE', borderRadius: 8, borderStyle: 'dashed'}}>
                          <AppText style={{ color: '#EF4444' }}>Mentor is unavailable on this date.</AppText>
                        </View>
                      ) : (
                        <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 10}}>
                          {selectedDay.slots.map((slot: any) => {
                            const isSelected = selectedSlot === slot.time;
                            return (
                              <TouchableOpacity
                                key={`${selectedDay.dateStr}-${slot.time}`}
                                style={[
                                  styles.rescheduleSlot,
                                  !slot.isAvailable && styles.rescheduleSlotDisabled,
                                  isSelected && styles.rescheduleSlotSelected
                                ]}
                                disabled={!slot.isAvailable}
                                onPress={() => setSelectedSlot(slot.time)}
                              >
                                <AppText style={[
                                  styles.rescheduleSlotText,
                                  !slot.isAvailable && styles.rescheduleSlotTextDisabled,
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
                  </>
                )}
              </View>
            </ScrollView>

            {/* Buttons outside ScrollView */}
            <View style={styles.modalFooter}>
              <View style={styles.actionRow}>
                <TouchableOpacity 
                  onPress={() => {
                    setRescheduleModalVisible(false);
                    setSelectedDay(null);
                    setSelectedSlot(null);
                    setAvailabilityData([]);
                  }} 
                  style={[styles.btn, styles.btnOutline, {flex:1}]}
                >
                  <AppText style={styles.textPrimary}>Cancel</AppText>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={handleRescheduleConfirm} 
                  style={[styles.btn, styles.btnPrimary, {flex:1}, (!selectedSlot || !selectedDay) && {opacity: 0.5}]}
                  disabled={!selectedSlot || !selectedDay}
                >
                  <AppText style={styles.textWhite}>Propose Time</AppText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  loader: { marginTop: 100 },
  header: { marginBottom: 20, marginTop: 10 },
  title: { fontSize: 26, fontWeight: '700', color: '#111' },
  emptyState: { marginTop: 100, alignItems: 'center' },
  emptyText: { marginTop: 16, fontSize: 18, fontWeight: '600', color: '#6B7280' },
  emptyHint: { marginTop: 4, fontSize: 14, color: '#9CA3AF' },
  
  sessionCard: { marginBottom: 16, padding: 16 },
  splitContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  leftSection: { flex: 1, paddingRight: 12 },
  rightSection: { paddingTop: 4 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: theme.colors.text.main, marginBottom: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  infoText: { fontSize: 13, color: '#6B7280', flex: 1 },
  cardDivider: { height: 1, backgroundColor: theme.colors.border, marginTop: 12, marginBottom: 12 },
  
  actionRowFull: { flexDirection: 'row', gap: 10, justifyContent: 'space-between' },
  btnFull: { flex: 1, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  btnPrimary: { backgroundColor: theme.colors.primary },
  btnSecondary: { backgroundColor: '#eff6ff' },
  btnGreen: { backgroundColor: '#059669' },
  btnOutline: { borderWidth: 1, borderColor: theme.colors.primary, backgroundColor: 'transparent' },
  btnDisabled: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB' },
  textWhite: { color: '#fff', fontWeight: '600', fontSize: 13 },
  textPrimary: { color: theme.colors.primary, fontWeight: '600', fontSize: 13 },
  textGray: { color: '#6B7280', fontWeight: '600', fontSize: 13 },
  
  ratingSection: { marginTop: 12, padding: 12, backgroundColor: '#F9FAFB', borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  ratedLabel: { fontSize: 13, color: '#6B7280', fontWeight: '600' },
  starsRow: { flexDirection: 'row', gap: 2 },
  starText: { fontSize: 18 },
  rateBtn: { marginTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, backgroundColor: '#F0FDFA', borderRadius: 8, gap: 6 },
  rateText: { fontSize: 13, color: theme.colors.primary, fontWeight: '600' },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContainer: { 
    backgroundColor: '#fff', 
    borderRadius: 16, 
    maxHeight: '85%',
    overflow: 'hidden'
  },
  modalScrollContent: { 
    flexGrow: 0
  },
  modalContent: { 
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    paddingBottom: 0,
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5
  },
  modalFooter: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6'
  },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#111', marginBottom: 16 },
  modalBody: { fontSize: 14, color: '#374151', lineHeight: 22 },
  modalCloseBtn: { backgroundColor: theme.colors.primary, padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 16 },
  
  // Reschedule modal styles
  actionRow: { flexDirection: 'row', gap: 12, justifyContent: 'space-between' },
  btn: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  rescheduleSlot: { 
    width: '30%', 
    paddingVertical: 12, 
    borderRadius: 8, 
    borderWidth: 1, 
    borderColor: theme.colors.primary, 
    backgroundColor: '#FFF', 
    alignItems: 'center' 
  },
  rescheduleSlotDisabled: { 
    borderColor: '#EEE', 
    backgroundColor: '#F9FAFB' 
  },
  rescheduleSlotSelected: { 
    backgroundColor: theme.colors.primary, 
    borderColor: theme.colors.primary 
  },
  rescheduleSlotText: { 
    color: theme.colors.primary, 
    fontWeight: '600' 
  },
  rescheduleSlotTextDisabled: { 
    color: '#CCC', 
    textDecorationLine: 'line-through' 
  },

  // 🟢 NEW Banner Styles
  bannerAction: {
    backgroundColor: '#FFFBEB', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#FEF3C7', marginBottom: 12
  },
  bannerHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  bannerTitleAction: { fontSize: 14, fontWeight: '700', color: '#B45309' },
  bannerTextAction: { fontSize: 13, color: '#92400E', lineHeight: 20, marginBottom: 4 },
  bannerSubTextAction: { fontSize: 12, color: '#92400E', lineHeight: 18 },

  bannerWaiting: {
    backgroundColor: '#F3F4F6', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 12
  },
  bannerTitleWaiting: { fontSize: 14, fontWeight: '700', color: '#4B5563' },
  bannerTextWaiting: { fontSize: 13, color: '#374151', lineHeight: 20, marginBottom: 4 },
  bannerSubTextWaiting: { fontSize: 12, color: '#6B7280' },
});