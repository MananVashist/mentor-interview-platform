// app/candidate/bookings.tsx
import React, { useState, useEffect } from 'react';
import {
  View, ScrollView, StyleSheet, TouchableOpacity,
  ActivityIndicator, Alert, RefreshControl, StatusBar, Modal, Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Libs
import { supabase } from '@/lib/supabase/client';
import { useAuthStore } from '@/lib/store';
import { theme } from '@/lib/theme';
import { Heading, AppText, Card, ScreenBackground } from '@/lib/ui';
import { DateTime } from 'luxon';

// Components
import RatingModal from '@/components/RatingModal';

// ✅ SINGLE SOURCE OF TRUTH (Calculates UI state from DB status)
import { getBookingState, getBookingDetails, BookingUIState } from '@/lib/booking-logic';

// Master Templates for Evaluation Display
import { MASTER_TEMPLATES } from '@/lib/evaluation-templates';

// ✅ OPTIMIZED: Shared Availability Service
import { availabilityService, type DayAvailability } from '@/services/availability.service';

// ✅ DayCard Component for Reschedule Modal
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

const BookingCard = ({
  session,
  onJoin,
  onViewDetails,
  onViewEvaluation,
  onRebook,
  onRateSession,
  onAcceptReschedule,
  onReschedule
}: any) => {
  const uiState = getBookingState(session);
  const details = getBookingDetails(session);
  const profileName = session.package?.interview_profile_name || 'Interview';
  const mentorTitle = session.mentor_professional_title || 'Mentor';
  
  // ✅ STRICT CHECK: Only mark as intro if explicitly defined in session or package type
  const isIntro = session.session_type === 'intro' || session.package?.booking_metadata?.session_type === 'intro';
  const skillName = isIntro ? 'Intro Call' : (session.skill_name || 'Interview Session');
  const duration = isIntro ? '25 mins' : '55 mins';

  // ✅ Helper to check if it's my turn to act
  const isMyTurn = details.rescheduledBy === 'mentor';

  const handleOpenRecording = async () => {
    try {
      const url = session.recording_url;
      if (!url) {
        Alert.alert('Error', 'Recording not available yet');
        return;
      }
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Unable to open recording URL');
      }
    } catch (err) {
      console.error('[Recording] Error opening:', err);
      Alert.alert('Error', 'Could not open recording');
    }
  };

  return (
    <Card style={styles.sessionCard}>
      <View style={styles.splitContainer}>
        <View style={styles.leftSection}>
          <AppText style={styles.cardTitle}>{profileName} Interview with {mentorTitle}</AppText>
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={14} color="#6B7280" />
            <AppText style={styles.infoText}>{skillName}</AppText>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={14} color="#6B7280" />
            <AppText style={styles.infoText}>{details.dateLabel} at {details.timeLabel}</AppText>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={14} color="#6B7280" />
            <AppText style={styles.infoText}>{duration}</AppText>
          </View>
        </View>
        <View style={styles.rightSection}>
          <Badge state={uiState} />
        </View>
      </View>

      <View style={styles.cardDivider} />

      {/* 1. APPROVAL STATE (Candidate View) */}
      {uiState === 'APPROVAL' && (
        <View style={{ 
          backgroundColor: '#EFF6FF', 
          padding: 12, 
          borderRadius: 8, 
          borderWidth: 1, 
          borderColor: '#BFDBFE'
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Ionicons name="hourglass-outline" size={18} color="#1E40AF" />
            <AppText style={{ fontSize: 14, fontWeight: '700', color: "#1E40AF" }}>
              Awaiting Mentor Approval
            </AppText>
          </View>
          <AppText style={{ fontSize: 13, color: "#1E3A8A", lineHeight: 20 }}>
            You have booked this slot. Waiting for the mentor to accept or propose a new time.
          </AppText>
        </View>
      )}

      {/* 2. RESCHEDULE PENDING */}
      {uiState === 'RESCHEDULE_PENDING' && (
        <>
          {isMyTurn ? (
            <View style={styles.bannerAction}>
              <View style={styles.bannerHeader}>
                <Ionicons name="alert-circle-outline" size={18} color="#B45309" />
                <AppText style={styles.bannerTitleAction}>Action Required</AppText>
              </View>
              <AppText style={styles.bannerTextAction}>
                Mentor proposed: {details.dateLabel} at {details.timeLabel}
              </AppText>
              <AppText style={styles.bannerSubTextAction}>
                Please accept or propose a different time.
              </AppText>
              <View style={styles.actionRowFull}>
                <TouchableOpacity style={[styles.btnFull, styles.btnOutline]} onPress={() => onReschedule(session)}>
                  <AppText style={styles.textPrimary}>Propose Different Time</AppText>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btnFull, styles.btnPrimary]} onPress={() => onAcceptReschedule(session.id)}>
                  <AppText style={styles.textWhite}>Accept New Time</AppText>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.bannerWaiting}>
              <View style={styles.bannerHeader}>
                <Ionicons name="hourglass-outline" size={18} color="#B45309" />
                <AppText style={styles.bannerTitleWaiting}>Reschedule Request Sent</AppText>
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
            <Ionicons name="checkmark-circle-outline" size={16} color="#059669" style={{ marginRight: 6 }} />
            <AppText style={[styles.textGray, { color: '#059669' }]}>Confirmed</AppText>
          </View>
          <TouchableOpacity style={[styles.btnFull, styles.btnSecondary]} onPress={() => onViewDetails(session)}>
            <AppText style={styles.textPrimary}>View Details</AppText>
          </TouchableOpacity>
        </View>
      )}

      {/* 4. LIVE NOW */}
      {uiState === 'JOIN' && (
        <>
          <View style={{ backgroundColor: '#F0FDFA', padding: 12, borderRadius: 8, marginBottom: 12, flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
            <Ionicons name="information-circle-outline" size={18} color="#14B8A6" style={{ marginTop: 2 }} />
            <AppText style={{ flex: 1, fontSize: 13, color: '#0F766E', lineHeight: 20 }}>
              This meeting will be recorded. Please download the recording within 48 hrs after the session
            </AppText>
          </View>
          <View style={styles.actionRowFull}>
            <TouchableOpacity style={[styles.btnFull, styles.btnGreen]} onPress={() => onJoin(session)}>
              <Ionicons name="videocam" size={18} color="#fff" style={{ marginRight: 4 }} />
              <AppText style={styles.textWhite}>Join Meeting</AppText>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* 5. PAST (Ended, awaiting evaluation) */}
      {uiState === 'POST_PENDING' && (
        <View style={styles.actionRowFull}>
          {!!session.recording_url && (
            <TouchableOpacity style={[styles.btnFull, styles.btnOutline]} onPress={handleOpenRecording}>
              <Ionicons name="play-circle-outline" size={16} color={theme.colors.primary} style={{ marginRight: 6 }} />
              <AppText style={styles.textPrimary}>View Recording</AppText>
            </TouchableOpacity>
          )}
          <View style={[styles.btnFull, styles.btnDisabled]}>
            <Ionicons name="clipboard-outline" size={16} color="#6B7280" style={{ marginRight: 6 }} />
            <AppText style={styles.textGray}>Awaiting Evaluation</AppText>
          </View>
        </View>
      )}

      {/* 6. COMPLETED - With Rate Session */}
      {uiState === 'POST_COMPLETED' && (
        <>
          <View style={styles.actionRowFull}>
            {!!session.recording_url && (
              <TouchableOpacity style={[styles.btnFull, styles.btnOutline]} onPress={handleOpenRecording}>
                <Ionicons name="play-circle-outline" size={16} color={theme.colors.primary} style={{ marginRight: 6 }} />
                <AppText style={styles.textPrimary}>View Recording</AppText>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={[styles.btnFull, styles.btnSecondary]} onPress={() => onRebook(session.mentor_id)}>
              <Ionicons name="refresh-outline" size={16} color={theme.colors.primary} style={{ marginRight: 6 }} />
              <AppText style={styles.textPrimary}>Rebook</AppText>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.btnFull, styles.btnPrimary]} onPress={() => onViewEvaluation(session.id)}>
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
            <TouchableOpacity style={styles.rateBtn} onPress={() => onRateSession(session)}>
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

  if (state === 'APPROVAL') { bg = '#FEF3C7'; text = '#B45309'; label = 'Pending'; }
  else if (state === 'RESCHEDULE_PENDING') { bg = '#FEF3C7'; text = '#B45309'; label = 'Reschedule Requested'; }
  else if (state === 'SCHEDULED') { bg = '#DBEAFE'; text = '#1E40AF'; label = 'Confirmed'; }
  else if (state === 'JOIN') { bg = '#D1FAE5'; text = '#047857'; label = 'Live Now'; }
  else if (state === 'POST_PENDING') { bg = '#F3F4F6'; text = '#6B7280'; label = 'Ended'; }
  else if (state === 'POST_COMPLETED') { bg = '#DEF7EC'; text = '#03543F'; label = 'Finished'; }
  else if (state === 'CANCELLED') { bg = '#FEE2E2'; text = '#991B1B'; label = 'Cancelled'; }

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

  // ✅ Reschedule modal states
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
      const { data: sessionsData, error } = await supabase
        .from('interview_sessions')
        .select(`
          id, scheduled_at, status, skill_id, mentor_id, package_id, session_type,
          pending_reschedule_approval, rescheduled_by,
          meetings:session_meetings ( recording_url ),
          package:interview_packages!package_id(*)
        `)
        .eq('candidate_id', currentUser.id)
        .in('status', ['pending', 'confirmed', 'completed'])
        .order('scheduled_at', { ascending: true });
            
      if (error) throw error;
      if (!sessionsData || sessionsData.length === 0) {
        setSessions([]);
        setLoading(false); setRefreshing(false);
        return;
      }

      const packageIds = [...new Set(sessionsData.map(s => s.package_id).filter(Boolean))];
      
      // ✅ STRICT RESOLUTION: Only fetch skills that explicitly exist on the session rows
      const skillIds = [...new Set(sessionsData.map(s => s.skill_id).filter(Boolean))];
      const mentorIds = [...new Set(sessionsData.map(s => s.mentor_id).filter(Boolean))];

      const profilesPromise = packageIds.length > 0
        ? supabase.from('interview_profiles_admin').select('id, name').in('id', packageIds.map(id => sessionsData.find(s => s.package_id === id)?.package?.interview_profile_id).filter(Boolean))
        : Promise.resolve({ data: [], error: null });

      const skillsPromise = skillIds.length > 0
        ? supabase.from('interview_skills_admin').select('id, name, description').in('id', skillIds)
        : Promise.resolve({ data: [], error: null });

      const mentorsPromise = mentorIds.length > 0
        ? supabase.from('mentors').select('id, professional_title').in('id', mentorIds)
        : Promise.resolve({ data: [], error: null });

      const reviewsPromise = packageIds.length > 0
        ? supabase.from('candidate_reviews').select('package_id, rating').in('package_id', packageIds)
        : Promise.resolve({ data: [], error: null });

      const [profilesRes, skillsRes, mentorsRes, reviewsRes] = await Promise.all([profilesPromise, skillsPromise, mentorsPromise, reviewsPromise]);

      const profilesMap: Record<number, string> = {};
      (profilesRes.data || []).forEach((p: any) => { profilesMap[p.id] = p.name; });

      const skillsMap: Record<string, { name: string; description?: string }> = {};
      (skillsRes.data || []).forEach((sk: any) => { skillsMap[sk.id] = { name: sk.name, description: sk.description }; });

      const mentorsMap: Record<string, string> = {};
      (mentorsRes.data || []).forEach((m: any) => { mentorsMap[m.id] = m.professional_title || 'Mentor'; });

      const reviewsMap: Record<string, number> = {};
      (reviewsRes.data || []).forEach((r: any) => { reviewsMap[r.package_id] = r.rating; });

      const enrichedSessions = sessionsData.map((s: any) => {
        const profileId = s.package?.interview_profile_id;
        const profileName = profileId ? profilesMap[profileId] || 'Interview' : 'Interview';
        
        // ✅ STRICT RESOLUTION: Directly use the skill attached to this specific session row
        const activeSkillId = s.skill_id;
        const skillData = activeSkillId ? skillsMap[activeSkillId] : null;
        const finalSkillName = skillData?.name || 'Interview Session';
        
        const meetingsArray = Array.isArray(s.meetings) ? s.meetings : (s.meetings ? [s.meetings] : []);
        const recording_url = meetingsArray.find((m: any) => m.recording_url)?.recording_url || null;

        return {
          ...s,
          package: { ...s.package, interview_profile_name: profileName },
          skill_id: activeSkillId, 
          skill_name: finalSkillName,
          skill_description: skillData?.description || null,
          mentor_professional_title: mentorsMap[s.mentor_id] || 'Mentor',
          recording_url,
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

  const handleJoin = (session: any) => {
    router.push({
      pathname: '/video-call',
      params: {
        sessionId: session.id,
        defaultName: 'Candidate',
        role: 'guest',
      },
    });
  };

  const handleViewDetails = (session: any) => {
    const profileId = Number(session.package?.interview_profile_id);
    const skillId = session.skill_id;

    let skillName = session.skill_name || 'Interview Details';
    let templates: Array<{ title: string; examples: string[]; questions: any[] }> = [];

    if (profileId && skillId && MASTER_TEMPLATES[profileId]?.skills[skillId]) {
      const skillData = MASTER_TEMPLATES[profileId].skills[skillId];
      skillName = skillData.skill_name || session.skill_name;

      if (skillData.templates && skillData.templates.length > 0) {
        templates = skillData.templates.map(template => ({
          title: template.title,
          examples: template.example || [],
          questions: template.questions || []
        }));
      }
    }

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
  
  const handleRatingSubmit = async (rating: number, review: string) => {
    if (!selectedSession) return;

    try {
      const { error } = await supabase
        .from('candidate_reviews')
        .insert({
          package_id: selectedSession.id,
          mentor_id: selectedSession.mentor_id,
          package_id: selectedSession.package_id,
          candidate_id: user?.id || selectedSession.candidate_id,
          rating: rating,
          review_text: review,
        });

      if (error) throw error;

      Alert.alert('Success', 'Thank you for your feedback!');
      setRatingModalVisible(false);
      setSelectedSession(null);
      fetchBookings();

    } catch (err: any) {
      console.error('[Rating] Error:', err);
      Alert.alert('Error', 'Failed to submit review.');
    }
  };
  
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

  const handleRescheduleStart = (session: any) => {
    setSelectedSession(session);
    setSelectedDay(null);
    setSelectedSlot(null);
    setRescheduleModalVisible(true);

    if (session.mentor_id) {
      generateAvailability(session.mentor_id, session.id);
    } else {
      Alert.alert('Error', 'Mentor information not found');
    }
  };

  const generateAvailability = async (mentorId: string, excludeSessionId?: string) => {
    setLoadingReschedule(true);
    try {
      const days = await availabilityService.generateAvailability(mentorId, excludeSessionId);
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

      const { error } = await supabase
        .from('interview_sessions')
        .update({
          scheduled_at: slot.dateTime.toISO(),
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
              contentContainerStyle={{ paddingBottom: 20, backgroundColor: '#fff' }}
            >
              {detailContent.templates.length > 0 ? (
                detailContent.templates.map((template, templateIdx) => (
                  <View key={templateIdx} style={{ marginBottom: templateIdx < detailContent.templates.length - 1 ? 24 : 0 }}>
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

                    {template.examples.length > 0 && (
                      <View style={{ marginBottom: 16 }}>
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
                                    <AppText style={{ color: '#6B7280', fontSize: 14 }}>?</AppText>
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
                <AppText style={{ color: '#6B7280', fontStyle: 'italic' }}>
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
          mentorName={selectedSession.mentor_professional_title || 'Mentor'} 
          onClose={() => {
            setRatingModalVisible(false);
            setSelectedSession(null);
          }}
          onSubmit={handleRatingSubmit} 
        />
      )}

      {/* Reschedule Modal */}
      <Modal visible={rescheduleModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.modalScrollContent} style={{ flex: 1 }}>
              <View style={styles.modalContent}>
                <Heading level={3} style={{ marginBottom: 8 }}>Propose New Time</Heading>
                <AppText style={{ marginBottom: 16, color: '#6B7280' }}>
                  Select a time that works better for you
                </AppText>

                {selectedSession && (
                  <View style={{ backgroundColor: '#F9FAFB', padding: 12, borderRadius: 8, marginBottom: 16 }}>
                    <AppText style={{ fontSize: 12, fontWeight: '600', color: '#6B7280', marginBottom: 4 }}>CURRENT PROPOSED TIME</AppText>
                    <AppText style={{ fontSize: 14, color: '#374151' }}>
                      📅 {new Date(selectedSession.scheduled_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(selectedSession.scheduled_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </AppText>
                  </View>
                )}

                {loadingReschedule ? (
                  <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginVertical: 40 }} />
                ) : (
                  <>
                    <View style={{ marginBottom: 16 }}>
                      <AppText style={{ fontSize: 12, fontWeight: '700', color: '#333', marginBottom: 8, textTransform: 'uppercase' }}>
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

                    <View style={{ backgroundColor: selectedSlot ? '#F0FDFA' : '#FFF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: selectedSlot ? theme.colors.primary : '#EEE', alignItems: 'center', marginBottom: 16 }}>
                      <AppText style={{ fontSize: 11, fontWeight: '700', color: '#999', marginBottom: 8 }}>YOUR PROPOSED TIME</AppText>
                      {selectedSlot && selectedDay ? (
                        <View style={{ alignItems: 'center' }}>
                          <AppText style={{ fontSize: 20, fontWeight: '600', color: theme.colors.primary }}>{selectedSlot}</AppText>
                          <AppText style={{ fontSize: 14, fontWeight: '500', color: '#666', marginTop: 4 }}>
                            {DateTime.fromFormat(selectedDay.dateStr, 'yyyy-MM-dd').toFormat('MMM dd, yyyy')}
                          </AppText>
                        </View>
                      ) : (
                        <AppText style={{ fontSize: 16, color: '#CCC', fontStyle: 'italic' }}>Tap a time below</AppText>
                      )}
                    </View>

                    <View style={{ marginBottom: 16 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <AppText style={{ fontSize: 12, fontWeight: '700', color: '#333', textTransform: 'uppercase' }}>
                          <Ionicons name="time-outline" size={14} /> Time Slots (IST)
                        </AppText>
                        {selectedDay?.isFullDayOff && (
                          <View style={{ backgroundColor: '#FEF2F2', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 }}>
                            <AppText style={{ color: '#EF4444', fontSize: 10, fontWeight: 'bold' }}>Time Off</AppText>
                          </View>
                        )}
                      </View>

                      {(!selectedDay || (selectedDay.slots.length === 0 && !selectedDay.isFullDayOff)) ? (
                        <View style={{ padding: 20, alignItems: 'center', borderWidth: 1, borderColor: '#EEE', borderRadius: 8, borderStyle: 'dashed' }}>
                          <AppText style={{ color: '#999' }}>No slots configured for this day.</AppText>
                        </View>
                      ) : selectedDay.isFullDayOff ? (
                        <View style={{ padding: 20, alignItems: 'center', borderWidth: 1, borderColor: '#EEE', borderRadius: 8, borderStyle: 'dashed' }}>
                          <AppText style={{ color: '#EF4444' }}>Mentor is unavailable on this date.</AppText>
                        </View>
                      ) : (
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
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

            <View style={styles.modalFooter}>
              <View style={styles.actionRow}>
                <TouchableOpacity
                  onPress={() => {
                    setRescheduleModalVisible(false);
                    setSelectedDay(null);
                    setSelectedSlot(null);
                    setAvailabilityData([]);
                  }}
                  style={[styles.btn, styles.btnOutline, { flex: 1 }]}
                >
                  <AppText style={styles.textPrimary}>Cancel</AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleRescheduleConfirm}
                  style={[styles.btn, styles.btnPrimary, { flex: 1 }, (!selectedSlot || !selectedDay) && { opacity: 0.5 }]}
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

  actionRowFull: { flexDirection: 'row', gap: 10, justifyContent: 'space-between', flexWrap: 'wrap' },
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
    width: '100%',        
    maxWidth: 500,
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
  modalCloseBtn: { backgroundColor: theme.colors.primary, padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 16 },
  
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