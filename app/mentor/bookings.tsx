// app/mentor/bookings.tsx
import React, { useEffect, useState } from 'react';
import {
  View, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity,
  RefreshControl, StatusBar, Modal, Platform, Alert, Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { DateTime, Interval } from 'luxon';

// Libs
import { supabase } from '@/lib/supabase/client';
import { theme } from '@/lib/theme';
import { Heading, AppText, Card, Section, ScreenBackground } from '@/lib/ui';
import { useAuthStore } from '@/lib/store';
import { getBookingState, getBookingDetails, getEvaluationTemplate, BookingUIState } from '@/lib/booking-logic';

// Master Templates for Real-Time Lookup
import { MASTER_TEMPLATES, INTRO_CALL_TEMPLATES, INTRO_CALL_TEMPLATE_FALLBACK } from '@/lib/evaluation-templates';

// Notification Hook
import { useNotification } from '@/lib/ui/NotificationBanner';

// Bank Details Modal
import { BankDetailsModal } from '@/components/mentor/BankDetailsModal';

// ✅ OPTIMIZED: Shared Availability Service
import { availabilityService } from '@/services/availability.service';

// DayCard Component for Reschedule Modal
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

const BookingCard = ({ session, onAccept, onReschedule, onJoin, onEvaluate, onViewResume, onViewTemplate }: any) => {
  const uiState = getBookingState(session);
  const details = getBookingDetails(session);
  const counterpartName = details.getCounterpartName('mentor');

  // Helper: Robust Resume URL Check
  const getResumeUrl = (s: any) => {
    const c = s.candidate;
    if (!c) return null;
    if (Array.isArray(c)) return c.length > 0 ? c[0].resume_url : null;
    return c.resume_url;
  };
  const resumeUrl = getResumeUrl(session);
  const hasResume = !!resumeUrl;

  const skillName = session.session_type === 'intro' ? 'Intro Call' : (session.skill_name || 'Interview Session');

  // Helper to check if it's my turn
  const isMyTurn = details.rescheduledBy === 'candidate';

  let displayDesc: string | string[] = session.skill_description || session.package?.interview_profile_description || "No details provided.";

  const handleOpenRecording = async () => {
    try {
      const url = session.recording_url;
      if (!url) {
        Alert.alert('No Recording', 'Recording is not available yet.');
        return;
      }
      const canOpen = await Linking.canOpenURL(url);
      if (!canOpen) {
        Alert.alert('Invalid Link', 'Could not open recording link.');
        return;
      }
      Linking.openURL(url);
    } catch (e) {
      Alert.alert('Error', 'Could not open recording link.');
    }
  };

  return (
    <Card style={styles.sessionCard}>
      <View style={styles.splitContainer}>
        <View style={styles.leftSection}>
          <Heading level={4} style={styles.cardTitle}>
            {details.profileName} interview with {counterpartName}
          </Heading>

          <View style={styles.infoRow}>
            <Ionicons name="bulb-outline" size={14} color="#6B7280" />
            <AppText style={styles.infoText}>{skillName}</AppText>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={14} color="#6B7280" />
            <AppText style={styles.infoText}>{details.dateLabel} , {details.timeLabel}</AppText>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={14} color="#6B7280" />
            <AppText style={styles.infoText}>55 mins</AppText>
          </View>
          <View style={styles.payoutRow}>
            <Ionicons name="wallet-outline" size={14} color="#059669" />
            <AppText style={styles.payoutText}>Rs.{details.mentorPayout.toLocaleString()}</AppText>
          </View>
        </View>
        <View style={styles.rightSection}>
          <Badge state={uiState} />
        </View>
      </View>
      <View style={styles.cardDivider} />

      {/* ACTIONS */}
      {uiState === 'APPROVAL' && (
        <View style={styles.actionRowFull}>
          <TouchableOpacity style={[styles.btnFull, styles.btnOutline]} onPress={() => onReschedule(session)}>
            <AppText style={styles.textPrimary}>Reschedule</AppText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btnFull, styles.btnPrimary]} onPress={() => onAccept(session.id)}>
            <AppText style={styles.textWhite}>Accept</AppText>
          </TouchableOpacity>
        </View>
      )}

      {/* RESCHEDULE LOOP */}
      {uiState === 'RESCHEDULE_PENDING' && (
        <>
          {isMyTurn ? (
            // CASE A: Candidate Initiated -> I can Accept or Reschedule
            <>
              <View style={styles.bannerAction}>
                <View style={styles.bannerHeader}>
                  <Ionicons name="time-outline" size={18} color="#B45309" />
                  <AppText style={styles.bannerTitleAction}>
                    Candidate Proposed New Time
                  </AppText>
                </View>
                <AppText style={styles.bannerTextAction}>
                  {details.dateLabel} at {details.timeLabel}
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
                  onPress={() => onAccept(session.id, true)}
                >
                  <AppText style={styles.textWhite}>Accept Time</AppText>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            // CASE B: Mentor Initiated -> Waiting for Candidate
            <View style={styles.bannerWaiting}>
              <View style={styles.bannerHeader}>
                <Ionicons name="hourglass-outline" size={16} color="#B45309" />
                <AppText style={styles.bannerTitleWaiting}>
                  Reschedule Requested
                </AppText>
              </View>
              <AppText style={styles.bannerTextWaiting}>
                You proposed: {details.dateLabel} at {details.timeLabel}
              </AppText>
              <AppText style={styles.bannerSubTextWaiting}>
                Waiting for candidate to accept the new time
              </AppText>
            </View>
          )}
        </>
      )}

      {/* ACCEPTED STATE (SCHEDULED) - Resume & Template Buttons */}
      {uiState === 'SCHEDULED' && (
        <View style={styles.actionRowFull}>
          {hasResume && (
            <TouchableOpacity
              style={[styles.btnFull, styles.btnOutline]}
              onPress={() => onViewResume(resumeUrl)}
            >
              <Ionicons name="document-text-outline" size={16} color={theme.colors.primary} style={{ marginRight: 4 }} />
              <AppText style={styles.textPrimary}>Resume</AppText>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.btnFull, styles.btnOutline]}
            onPress={() => onViewTemplate(session)}
          >
            <Ionicons name="clipboard-outline" size={16} color={theme.colors.primary} style={{ marginRight: 4 }} />
            <AppText style={styles.textPrimary}>Template</AppText>
          </TouchableOpacity>
        </View>
      )}

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
              <AppText style={styles.textWhite}>Join</AppText>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.btnFull, styles.btnPrimary]} onPress={() => onEvaluate(session, 'edit')}>
              <AppText style={styles.textWhite}>Evaluate</AppText>
            </TouchableOpacity>

            {hasResume && (
              <TouchableOpacity
                style={[styles.btnIconOnly, styles.btnOutline]}
                onPress={() => onViewResume(resumeUrl)}
              >
                <Ionicons name="document-text-outline" size={20} color={theme.colors.primary} />
              </TouchableOpacity>
            )}
          </View>
        </>
      )}

      {/* POST STATES: show recording + evaluation */}
      {(uiState === 'POST_PENDING' || uiState === 'POST_COMPLETED') && (
        <View style={styles.actionRowFull}>
          {!!session.recording_url && (
            <TouchableOpacity
              style={[styles.btnFull, styles.btnOutline]}
              onPress={handleOpenRecording}
            >
              <Ionicons name="play-circle-outline" size={16} color={theme.colors.primary} style={{ marginRight: 6 }} />
              <AppText style={styles.textPrimary}>View Recording</AppText>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.btnFull, uiState === 'POST_COMPLETED' ? styles.btnSecondary : styles.btnPrimary]}
            onPress={() => onEvaluate(session, uiState === 'POST_COMPLETED' ? 'read' : 'edit')}
          >
            <AppText style={uiState === 'POST_COMPLETED' ? styles.textPrimary : styles.textWhite}>
              {uiState === 'POST_COMPLETED' ? 'View Evaluation' : 'Submit Evaluation'}
            </AppText>
          </TouchableOpacity>
        </View>
      )}
    </Card>
  );
};

const Badge = ({ state }: { state: BookingUIState }) => {
  let bg = '#E5E7EB'; let text = '#374151'; let label = 'Unknown';
  if (state === 'APPROVAL') { bg = '#FEF3C7'; text = '#B45309'; label = 'Needs Approval'; }
  else if (state === 'RESCHEDULE_PENDING') { bg = '#FEF3C7'; text = '#B45309'; label = 'Reschedule Pending'; }
  else if (state === 'SCHEDULED') { bg = '#DBEAFE'; text = '#1E40AF'; label = 'Scheduled'; }
  else if (state === 'JOIN') { bg = '#D1FAE5'; text = '#047857'; label = 'Live Now'; }
  else if (state === 'POST_PENDING') { bg = '#F3F4F6'; text = '#6B7280'; label = 'Pending Review'; }
  else if (state === 'POST_COMPLETED') { bg = '#DEF7EC'; text = '#03543F'; label = 'Completed'; }
  else if (state === 'CANCELLED') { bg = '#FEE2E2'; text = '#991B1B'; label = 'Cancelled'; }

  return (
    <View style={{ backgroundColor: bg, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
      <AppText style={{ color: text, fontSize: 10, fontWeight: '700', textTransform: 'uppercase' }}>{label}</AppText>
    </View>
  );
};

export default function MentorBookingsScreen() {
  const { user } = useAuthStore();
  const router = useRouter();

  const { showNotification } = useNotification();

  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({ upcoming: 0, completed: 0, earnings: 0 });

  // Modals
  const [templateModalVisible, setTemplateModalVisible] = useState(false);
  const [templateContent, setTemplateContent] = useState({
    skillName: '',
    templates: [] as Array<{ title: string; examples: string[]; questions: any[] }>
  });
  const [rescheduleModalVisible, setRescheduleModalVisible] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);

  type Slot = { time: string; isAvailable: boolean; dateTime: DateTime };
  type DayAvailability = { dateStr: string; weekdayName: string; monthDay: string; slots: Slot[]; isFullDayOff: boolean };

  const [availabilityData, setAvailabilityData] = useState<DayAvailability[]>([]);
  const [selectedDay, setSelectedDay] = useState<DayAvailability | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loadingReschedule, setLoadingReschedule] = useState(false);

  // Bank Details Modal
  const [bankDetailsModalVisible, setBankDetailsModalVisible] = useState(false);
  const [hasBankDetails, setHasBankDetails] = useState(false);

  const fetchSessions = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('interview_sessions')
        .select(`
          id, scheduled_at, status, skill_id, session_type,pending_reschedule_approval, rescheduled_by,
          meetings:session_meetings ( recording_url ),
          package:interview_packages ( id, mentor_payout_inr, interview_profile_id, payment_status ),
          candidate:candidates ( professional_title, resume_url )
        `)
        .eq('mentor_id', user.id)
        .order('scheduled_at', { ascending: true });

      if (error) throw error;

      // ✅ FILTER: Exclude sessions with status = 'awaiting_payment'
      // - 'awaiting_payment': Payment in progress, not yet confirmed
      // - 'pending': Payment confirmed, awaiting mentor approval (SHOW THIS)
      // - 'confirmed', 'completed', etc.: All other statuses (SHOW THESE)
      const paidSessions = (data || []).filter((s: any) =>
        s.status !== 'awaiting_payment'
      );

      const rawSessions = paidSessions;

      // 1. Fetch Profile Data
      const profileIds = Array.from(new Set(rawSessions.map((s: any) => s.package?.interview_profile_id).filter((id: any) => id != null)));
      let profileMap: Record<string, { name: string; description: string | null }> = {};

      if (profileIds.length > 0) {
        const { data: profiles } = await supabase.from('interview_profiles_admin').select('id, name, description').in('id', profileIds);
        if (profiles) {
          profileMap = Object.fromEntries(profiles.map((p: any) => [String(p.id), { name: p.name, description: p.description ?? null }]));
        }
      }

      // 2. Fetch Skills Data
      const skillIds = [...new Set(rawSessions.map((s: any) => s.skill_id).filter(Boolean))];
      let skillMap: any = {};

      if (skillIds.length > 0) {
        const { data: skillsData } = await supabase
          .from('interview_skills_admin')
          .select('id, name, description')
          .in('id', skillIds);

        if (skillsData) {
          skillMap = skillsData.reduce((acc: any, curr: any) => {
            acc[curr.id] = curr; return acc;
          }, {});
        }
      }

      // 3. Merge Data + normalize recording_url from meetings
      const enrichedSessions = rawSessions.map((s: any) => {
        const profileId = s.package?.interview_profile_id;
        const profileMeta = profileId != null ? profileMap[String(profileId)] ?? null : null;
        const skillMeta = s.skill_id ? skillMap[s.skill_id] : null;

        const recordingUrl =
          Array.isArray(s.meetings) ? (s.meetings?.[0]?.recording_url ?? null) : (s.meetings?.recording_url ?? null);

        return {
          ...s,
          recording_url: recordingUrl,
          skill_name: skillMeta?.name || 'Mock Interview',
          skill_description: skillMeta?.description || '',
          package: s.package ? {
            ...s.package,
            ...profileMeta ? { interview_profile_name: profileMeta.name, interview_profile_description: profileMeta.description } : { interview_profile_name: null, interview_profile_description: null }
          } : null,
        };
      });

      setSessions(enrichedSessions);

      let upcoming = 0;
      let completedCount = 0;
      let totalEarnings = 0;

      enrichedSessions.forEach((s: any) => {
        if (s.status === 'confirmed' || s.status === 'pending') upcoming++;
        if (s.status === 'completed') {
          completedCount++;
          totalEarnings += (s.package?.mentor_payout_inr || 0);
        }
      });

      setStats({ upcoming, completed: completedCount, earnings: totalEarnings });

    } catch (err: any) {
      console.error('Error loading mentor bookings:', err);
    } finally {
      setLoading(false); setRefreshing(false);
    }
  };

  const checkBankDetails = async () => {
    if (!user) return false;

    try {
      const { data: mentor } = await supabase
        .from('mentors')
        .select('bank_details')
        .eq('id', user.id)
        .maybeSingle();

      if (mentor && mentor.bank_details) {
        const bd = mentor.bank_details as any;
        const hasAllDetails = !!(
          bd.holder_name?.trim() &&
          bd.account_number?.trim() &&
          bd.ifsc_code?.trim()
        );
        setHasBankDetails(hasAllDetails);
        return hasAllDetails;
      }

      setHasBankDetails(false);
      return false;
    } catch (e) {
      console.error('Error checking bank details:', e);
      setHasBankDetails(false);
      return false;
    }
  };

  useEffect(() => {
    fetchSessions();
    checkBankDetails();
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchSessions();
    checkBankDetails();
  };

  const handleAccept = async (id: string, isRescheduleAcceptance: boolean = false) => {
    const hasDetails = await checkBankDetails();
    if (!hasDetails) {
      setBankDetailsModalVisible(true);
      return;
    }

    try {
      const newMeetingLink = `https://meet.jit.si/crackjobs-${id}`;

      const updateData: any = {
        status: 'confirmed',
      };

      if (isRescheduleAcceptance) {
        updateData.pending_reschedule_approval = false;
        updateData.rescheduled_by = null;
      }

      const { error } = await supabase
        .from('interview_sessions')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      showNotification('Interview accepted! Meeting link generated.', 'success');
      fetchSessions();
    } catch (e: any) {
      console.error("Accept Error:", e);
      Alert.alert('Error', e?.message || 'Could not accept this interview.');
    }
  };

  const handleRescheduleStart = async (session: any) => {
    const hasDetails = await checkBankDetails();
    if (!hasDetails) {
      setBankDetailsModalVisible(true);
      return;
    }

    setSelectedSession(session);
    setSelectedDay(null);
    setSelectedSlot(null);
    setRescheduleModalVisible(true);

    if (user?.id) {
      generateAvailability(user.id, session.id);
    } else {
      Alert.alert('Error', 'User not found');
    }
  };

  // ✅ OPTIMIZED: Use shared availability service
  const generateAvailability = async (mentorId: string, excludeSessionId?: string) => {
    setLoadingReschedule(true);
    try {
      const days = await availabilityService.generateAvailability(mentorId, excludeSessionId);
      setAvailabilityData(days);
    } catch (err) {
      console.error('[Reschedule] Error generating availability:', err);
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
          rescheduled_by: 'mentor'
        })
        .eq('id', selectedSession.id);

      setRescheduleModalVisible(false);
      if (error) throw error;

      showNotification('Reschedule request sent to candidate for approval.', 'success');
      fetchSessions();
    } catch (e: any) {
      setRescheduleModalVisible(false);
      Alert.alert('Error', 'Failed to reschedule.');
    }
  };

  const handleJoin = (session: any) => {
    const mentorTitle = session.candidate?.professional_title || 'Mentor';

    router.push({
      pathname: '/video-call',
      params: {
        sessionId: session.id,
        defaultName: mentorTitle,
        role: 'host',
      },
    });
  };

  const handleViewTemplate = (session: any) => {
    // ── Intro call: use domain-specific INTRO_CALL_TEMPLATES ──────────────
    if (session.session_type === 'intro') {
      const profileId = Number(session.package?.interview_profile_id);
      const introTemplates = (profileId && INTRO_CALL_TEMPLATES[profileId])
        ? INTRO_CALL_TEMPLATES[profileId]
        : INTRO_CALL_TEMPLATE_FALLBACK;
      const templates = introTemplates.map(template => ({
        title: template.title,
        examples: template.example || [],
        questions: template.questions || []
      }));
      setTemplateContent({ skillName: 'Intro Call', templates });
      setTemplateModalVisible(true);
      return;
    }

    // ── Mock / bundle: existing MASTER_TEMPLATES lookup ───────────────────
    const profileId = Number(session.package?.interview_profile_id);
    const skillId = session.skill_id;

    let skillName = session.skill_name || 'Evaluation Template';
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

    setTemplateContent({ skillName, templates });
    setTemplateModalVisible(true);
  };

  const handleViewResume = async (urlOrPath: string) => {
    if (!urlOrPath) {
      Alert.alert('No Resume', 'No resume available for this candidate.');
      return;
    }
    try {
      let path = urlOrPath;

      if (urlOrPath.startsWith('http')) {
        if (urlOrPath.includes('/resumes/')) {
          const parts = urlOrPath.split('/resumes/');
          if (parts.length > 1) {
            path = parts[1];
          }
        } else {
          const match = urlOrPath.match(/public\/.+\/(.+)$/);
          if (match) path = match[1];
        }
      }

      path = decodeURIComponent(path);

      const { data, error } = await supabase.storage.from('resumes').createSignedUrl(path, 3600);

      if (error || !data?.signedUrl) {
        if (urlOrPath.startsWith('http')) {
          Linking.openURL(urlOrPath).catch(() => Alert.alert('Error', 'Could not open resume link.'));
          return;
        }
        throw error || new Error('Could not sign URL');
      }

      Linking.openURL(data.signedUrl).catch(() => Alert.alert('Error', 'Could not open resume link.'));
    } catch (e) {
      console.error('Resume view error:', e);
      if (urlOrPath.startsWith('http')) {
        Linking.openURL(urlOrPath).catch(() => { });
      } else {
        Alert.alert('Error', 'Could not load resume.');
      }
    }
  };

  const handleEvaluate = (session: any, mode: 'edit' | 'read') => {
    try {
      let templateTitle = '';
      let templateContent = '';

      // ── Intro call: use domain-specific INTRO_CALL_TEMPLATES ─────────────
      if (session.session_type === 'intro') {
        const profileId = Number(session.package?.interview_profile_id);
        const introTemplates = (profileId && INTRO_CALL_TEMPLATES[profileId])
          ? INTRO_CALL_TEMPLATES[profileId]
          : INTRO_CALL_TEMPLATE_FALLBACK;
        const tmpl = introTemplates[0];
        templateTitle = tmpl.title;
        templateContent = JSON.stringify(tmpl);

        router.push({
          pathname: `/mentor/session/${session.id}`,
          params: {
            mode,
            templateTitle,
            templateContent,
            profileName: 'Intro Call',
            round: 'Intro Call'
          }
        });
        return;
      }

      // ── Mock / bundle: existing MASTER_TEMPLATES lookup ──────────────────
      const profileIdNum = Number(session.package?.interview_profile_id);
      const skillId = session.skill_id;

      let foundRealTimeTemplate = false;

      if (profileIdNum && skillId && MASTER_TEMPLATES[profileIdNum]) {
        const skillData = MASTER_TEMPLATES[profileIdNum].skills[skillId];
        if (skillData && skillData.templates && skillData.templates.length > 0) {
          const tmpl = skillData.templates[0];
          templateTitle = tmpl.title;
          templateContent = JSON.stringify(tmpl);
          foundRealTimeTemplate = true;
        }
      }

      if (!foundRealTimeTemplate) {
        console.log("Using legacy template fallback for session:", session.id);
        const legacyTemplate = getEvaluationTemplate(session);
        templateTitle = legacyTemplate.title;
        templateContent = legacyTemplate.content;
      }

      router.push({
        pathname: `/mentor/session/${session.id}`,
        params: {
          mode,
          templateTitle: templateTitle,
          templateContent: templateContent,
          profileName: session.package?.interview_profile_name || '',
          round: session.skill_name || 'Interview'
        }
      });
    } catch (e) {
      console.error('Template fetch error:', e);
      Alert.alert('Error', 'Could not load evaluation template.');
    }
  };

  const handleBankDetailsSuccess = () => {
    checkBankDetails();
    showNotification('Bank details saved successfully! You can now accept bookings.', 'success');
  };

  if (loading) {
    return (
      <ScreenBackground>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />}
      >
        <View style={styles.header}>
          <Heading level={2}>Your Bookings</Heading>
          <AppText style={styles.headerSub}>Manage your interview schedule</AppText>
        </View>

        <View style={styles.statsGrid}>
          <Card style={styles.statCard}><AppText style={styles.statValue}>{stats.upcoming}</AppText><AppText style={styles.statLabel}>Upcoming</AppText></Card>
          <Card style={styles.statCard}><AppText style={styles.statValue}>{stats.completed}</AppText><AppText style={styles.statLabel}>Completed</AppText></Card>
          <Card style={[styles.statCard, styles.earningsCard]}><AppText style={[styles.statValue, { color: '#FFF' }]}>{stats.earnings.toLocaleString()}</AppText><AppText style={[styles.statLabel, { color: 'rgba(255,255,255,0.8)' }]}>Earnings</AppText></Card>
        </View>

        <TouchableOpacity style={styles.availabilityBtn} onPress={() => router.push('/mentor/availability')}>
          <Ionicons name="time-outline" size={22} color="#FFF" />
          <AppText style={styles.availabilityBtnText}>Manage Availability</AppText>
        </TouchableOpacity>

        <View style={styles.divider} />
        <Heading level={3} style={styles.sectionTitle}>Your Schedule</Heading>

        {sessions.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={48} color="#9CA3AF" />
            <AppText style={styles.emptyText}>No sessions booked yet.</AppText>
          </View>
        ) : (
          <View style={styles.list}>
            {sessions.map((session) => (
              <BookingCard
                key={session.id} session={session}
                onAccept={handleAccept} onReschedule={handleRescheduleStart}
                onViewResume={handleViewResume}
                onJoin={handleJoin} onEvaluate={handleEvaluate}
                onViewTemplate={handleViewTemplate}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Evaluation Template Modal */}
      <Modal visible={templateModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Heading level={3} style={{ marginBottom: 12 }}>{templateContent.skillName}</Heading>

              <View style={{ maxHeight: 400, minHeight: 100, backgroundColor: '#fff' }}>
                <ScrollView contentContainerStyle={{ paddingBottom: 20, backgroundColor: '#fff' }}>
                  {templateContent.templates.length > 0 ? (
                    templateContent.templates.map((template, templateIdx) => (
                      <View key={templateIdx} style={{ marginBottom: templateIdx < templateContent.templates.length - 1 ? 24 : 0 }}>
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
                      No evaluation template available for this skill.
                    </AppText>
                  )}
                </ScrollView>
              </View>

              <View style={styles.modalFooter}>
                <TouchableOpacity onPress={() => setTemplateModalVisible(false)} style={styles.btnFullPrimary}>
                  <AppText style={styles.textWhite}>Close</AppText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Reschedule Modal */}
      <Modal visible={rescheduleModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.modalScrollContent} style={{ flex: 1 }}>
              <View style={styles.modalContent}>
                <Heading level={3} style={{ marginBottom: 8 }}>Reschedule Interview</Heading>
                <AppText style={{ marginBottom: 16, color: '#6B7280' }}>
                  Select a new date and time slot
                </AppText>

                {selectedSession && (
                  <View style={{ backgroundColor: '#F9FAFB', padding: 12, borderRadius: 8, marginBottom: 16 }}>
                    <AppText style={{ fontSize: 12, fontWeight: '600', color: '#6B7280', marginBottom: 4 }}>CURRENT TIME</AppText>
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
                      <AppText style={{ fontSize: 11, fontWeight: '700', color: '#999', marginBottom: 8 }}>NEW TIME</AppText>
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
                  <AppText style={styles.textWhite}>Confirm Reschedule</AppText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <BankDetailsModal
        visible={bankDetailsModalVisible}
        userId={user?.id || ''}
        onClose={() => setBankDetailsModalVisible(false)}
        onSuccess={handleBankDetailsSuccess}
      />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 24 },
  headerSub: { color: theme.colors.text.light, marginTop: 4 },
  statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: { flex: 1, alignItems: 'center', padding: 16, borderRadius: 16, backgroundColor: '#FFF', borderWidth: 1, borderColor: theme.colors.border },
  earningsCard: { backgroundColor: theme.colors.primary, borderWidth: 0 },
  statValue: { fontSize: 18, fontWeight: '700', color: theme.colors.text.main, marginTop: 8 },
  statLabel: { fontSize: 12, color: theme.colors.text.light },
  availabilityBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0E9384', paddingVertical: 14, borderRadius: 12, marginBottom: 24, gap: 8 },
  availabilityBtnText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  divider: { height: 1, backgroundColor: theme.colors.border, marginBottom: 24 },
  sectionTitle: { marginBottom: 16 },
  list: { gap: 16 },
  emptyState: { alignItems: 'center', marginTop: 40 },
  emptyText: { marginTop: 16, fontSize: 16, fontWeight: '600', color: theme.colors.text.main },
  sessionCard: { padding: 16, borderRadius: 16, backgroundColor: '#FFF', borderWidth: 1, borderColor: theme.colors.border },
  splitContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  leftSection: { flex: 1, paddingRight: 12 },
  rightSection: { paddingTop: 2 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: theme.colors.text.main, marginBottom: 12, lineHeight: 22 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  infoText: { fontSize: 13, color: '#6B7280', fontWeight: '500' },
  payoutRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  payoutText: { fontSize: 14, fontWeight: '700', color: '#059669' },
  cardDivider: { height: 1, backgroundColor: theme.colors.border, marginBottom: 12 },
  actionRowFull: { flexDirection: 'row', gap: 10, justifyContent: 'space-between' },
  actionRow: { flexDirection: 'row', gap: 12, justifyContent: 'space-between' },
  btnFull: { flex: 1, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  btnIconOnly: { width: 44, height: 44, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  btn: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  btnFullPrimary: { backgroundColor: theme.colors.primary, paddingVertical: 12, borderRadius: 8, alignItems: 'center', width: '100%' },
  btnPrimary: { backgroundColor: theme.colors.primary },
  btnSecondary: { backgroundColor: '#eff6ff' },
  btnGreen: { backgroundColor: '#059669' },
  btnOutline: { borderWidth: 1, borderColor: theme.colors.primary, backgroundColor: 'transparent' },
  textWhite: { color: '#fff', fontWeight: '600', fontSize: 13 },
  textPrimary: { color: theme.colors.primary, fontWeight: '600', fontSize: 13 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
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
    padding: 24,
    paddingBottom: 0
  },
  modalFooter: {
    backgroundColor: '#fff',
    paddingTop: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6'
  },
  modalCloseBtn: { backgroundColor: theme.colors.primary, padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 10 },

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