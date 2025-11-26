import React, { useEffect, useState } from 'react';
import { 
  View, ScrollView, StyleSheet, ActivityIndicator, 
  TouchableOpacity, RefreshControl, StatusBar, Alert, Linking, Platform, Modal, TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DateTime } from 'luxon';
import { useRouter } from 'expo-router';

// Libs
import { supabase } from '@/lib/supabase/client';
import { theme } from '@/lib/theme';
import { Heading, AppText, Card, Section, ScreenBackground } from '@/lib/ui';
import { useAuthStore } from '@/lib/store';

export default function MentorBookingsScreen() {
  const { user } = useAuthStore();
  const router = useRouter();
  
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({ upcoming: 0, completed: 0, earnings: 0 });

  // Modal states
  const [interviewDetailsModal, setInterviewDetailsModal] = useState<any>(null);
  const [evaluationModal, setEvaluationModal] = useState<any>(null);
  const [rescheduleModal, setRescheduleModal] = useState<any>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');

  const fetchSessions = async () => {
    if (!user) return;
    console.log("Fetching mentor sessions...");

    try {
      const { data, error } = await supabase
        .from('interview_sessions')
        .select(`
          id,
          scheduled_at,
          status,
          round,
          meeting_link,
          reschedule_count,
          duration_minutes,
          package:interview_packages (
            total_amount_inr,
            mentor_payout_inr,
            payment_status,
            target_profile
          ),
          candidate:candidates (
            id,
            professional_title,
            target_profile,
            linkedin_headline,
            resume_url
          ),
          evaluation:session_evaluations (
            id,
            communication_score,
            problem_solving_score,
            technical_depth_score,
            overall_score,
            strengths,
            areas_for_improvement,
            detailed_feedback,
            checklist_data
          )
        `)
        .eq('mentor_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const rawSessions = data || [];
      setSessions(rawSessions);

      // Calculate Stats
      let upcoming = 0;
      let completed = 0;
      let earnings = 0;

      rawSessions.forEach(s => {
        if (s.status === 'confirmed') upcoming++;
        if (s.status === 'completed') completed++;
        
        if (s.status !== 'cancelled' && s.package?.mentor_payout_inr) {
           earnings += (s.package.mentor_payout_inr / 2);
        }
      });

      setStats({ upcoming, completed, earnings });

    } catch (err) {
      console.error('Error loading mentor bookings:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchSessions();
  };

  // Accept booking
  const handleAccept = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('interview_sessions')
        .update({ 
          status: 'confirmed',
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (error) throw error;

      Alert.alert('Success', 'Booking accepted! Meeting link is ready.');
      fetchSessions();
    } catch (error: any) {
      console.error('Accept error:', error);
      Alert.alert('Error', 'Failed to accept booking');
    }
  };

  // Reschedule
  const handleRescheduleSubmit = async () => {
    if (!rescheduleModal || !rescheduleDate || !rescheduleTime) {
      Alert.alert('Missing Information', 'Please provide both date and time');
      return;
    }

    try {
      // Combine date and time
      const scheduledDateTime = DateTime.fromISO(`${rescheduleDate}T${rescheduleTime}:00`);
      
      if (!scheduledDateTime.isValid) {
        Alert.alert('Invalid Date/Time', 'Please check your date and time format');
        return;
      }

      const { error } = await supabase
        .from('interview_sessions')
        .update({ 
          scheduled_at: scheduledDateTime.toISO(),
          status: 'confirmed',
          reschedule_count: rescheduleModal.reschedule_count + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', rescheduleModal.id);

      if (error) throw error;

      Alert.alert('Success', 'Interview rescheduled successfully');
      setRescheduleModal(null);
      setRescheduleDate('');
      setRescheduleTime('');
      fetchSessions();
    } catch (error: any) {
      console.error('Reschedule error:', error);
      Alert.alert('Error', 'Failed to reschedule interview');
    }
  };

  // Join Meeting
  const handleJoin = (link: string) => {
    if (!link) {
      Alert.alert("No Link", "Meeting link is not ready yet.");
      return;
    }
    
    if (Platform.OS === 'web') {
      const win = window.open(link, '_blank');
      if (!win) Alert.alert("Popup Blocked", "Please allow popups.");
    } else {
      Linking.openURL(link).catch(err => {
        console.error("Linking error:", err);
        Alert.alert("Error", "Could not open link.");
      });
    }
  };

  // Open Interview Details
  const handleInterviewDetails = async (session: any) => {
    try {
      // Fetch profile description
      const { data: profileData } = await supabase
        .from('interview_profiles_admin')
        .select('description')
        .eq('name', session.package?.target_profile || session.candidate?.target_profile)
        .single();

      setInterviewDetailsModal({
        profileDescription: profileData?.description || 'No description available',
        resumeUrl: session.candidate?.resume_url,
        professionalTitle: session.candidate?.professional_title || session.candidate?.linkedin_headline || session.candidate?.target_profile || 'Professional',
        targetProfile: session.package?.target_profile || session.candidate?.target_profile
      });
    } catch (error) {
      console.error('Error loading interview details:', error);
      Alert.alert('Error', 'Could not load interview details');
    }
  };

  // Get payment status display
  const getPaymentStatus = (status: string) => {
    switch (status) {
      case 'pending_payment':
      case 'pending':
        return { label: 'Not Initiated', color: '#EF4444', bg: '#FEE2E2' };
      case 'held_in_escrow':
        return { label: 'In Escrow', color: '#F59E0B', bg: '#FEF3C7' };
      case 'completed':
        return { label: 'Credited', color: '#10B981', bg: '#D1FAE5' };
      default:
        return { label: status || 'Unknown', color: '#6B7280', bg: '#F3F4F6' };
    }
  };

  // Get CTA state based on session status and time
  const getCTAState = (session: any) => {
    const now = DateTime.now();
    const scheduledTime = session.scheduled_at ? DateTime.fromISO(session.scheduled_at) : null;
    const minutesUntilMeeting = scheduledTime ? scheduledTime.diff(now, 'minutes').minutes : null;
    const durationMinutes = session.duration_minutes || 45;
    const meetingEndTime = scheduledTime ? scheduledTime.plus({ minutes: durationMinutes }) : null;
    const meetingHasEnded = meetingEndTime ? now > meetingEndTime : false;
    const hasEvaluation = session.evaluation && session.evaluation.length > 0;

    // State 1: Pending (waiting for mentor acceptance)
    if (session.status === 'pending') {
      return {
        primary: { label: 'Accept', action: () => handleAccept(session.id), icon: 'checkmark-circle', color: '#0E9384' }, // Teal
        secondary: { label: 'Reschedule', action: () => setRescheduleModal(session), icon: 'calendar-outline', color: '#7C3AED' } // Purple
      };
    }

    // State 2: Confirmed - Meeting time logic
    if (session.status === 'confirmed') {
      // State 2a: After meeting has ended
      if (meetingHasEnded) {
        if (hasEvaluation) {
          // Evaluation submitted - show single button
          return {
            primary: { label: 'View Evaluation', action: () => setEvaluationModal(session.evaluation[0]), icon: 'document-text', color: '#2563EB' },
            secondary: null
          };
        } else {
          // Meeting ended but no evaluation - show Review + Submit
          return {
            primary: { label: 'Submit Evaluation', action: () => router.push(`/mentor/session/${session.id}`), icon: 'checkmark-circle', color: '#F59E0B' },
            secondary: { label: 'Review Details', action: () => handleInterviewDetails(session), icon: 'information-circle-outline', color: '#2563EB' }
          };
        }
      }
      
      // State 2b: Less than 15 minutes before meeting
      if (minutesUntilMeeting !== null && minutesUntilMeeting <= 15) {
        return {
          primary: { label: 'Join Meeting', action: () => handleJoin(session.meeting_link), icon: 'videocam', color: '#10B981' },
          secondary: { label: 'Evaluate', action: () => router.push(`/mentor/session/${session.id}`), icon: 'create-outline', color: '#F59E0B' }
        };
      }
      
      // State 2c: More than 15 minutes before meeting
      return {
        primary: { label: 'Scheduled', action: null, icon: 'checkmark', color: '#9CA3AF', disabled: true },
        secondary: { label: 'Interview Details', action: () => handleInterviewDetails(session), icon: 'information-circle-outline', color: '#2563EB' }
      };
    }

    // State 3: Completed status
    if (session.status === 'completed') {
      if (hasEvaluation) {
        return {
          primary: { label: 'View Evaluation', action: () => setEvaluationModal(session.evaluation[0]), icon: 'document-text', color: '#2563EB' },
          secondary: null
        };
      } else {
        return {
          primary: { label: 'Submit Evaluation', action: () => router.push(`/mentor/session/${session.id}`), icon: 'checkmark-circle', color: '#F59E0B' },
          secondary: { label: 'Review Details', action: () => handleInterviewDetails(session), icon: 'information-circle-outline', color: '#2563EB' }
        };
      }
    }

    // State 4: Cancelled or No Show
    if (session.status === 'cancelled' || session.status === 'no_show') {
      return {
        primary: { label: 'View Details', action: () => handleInterviewDetails(session), icon: 'information-circle-outline', color: '#6B7280' },
        secondary: null
      };
    }

    return { primary: null, secondary: null };
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending':
        return { bg: '#FEF3C7', text: '#D97706', label: 'Pending' };
      case 'confirmed': 
        return { bg: '#ECFDF5', text: '#059669', label: 'Confirmed' };
      case 'completed': 
        return { bg: '#F3F4F6', text: '#6B7280', label: 'Completed' };
      case 'cancelled': 
        return { bg: '#FEE2E2', text: '#DC2626', label: 'Cancelled' };
      case 'no_show':
        return { bg: '#FEE2E2', text: '#DC2626', label: 'No Show' };
      default: 
        return { bg: '#F3F4F6', text: '#6B7280', label: status };
    }
  };

  return (
    <ScreenBackground style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Section style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons name="briefcase" size={32} color={theme.colors.primary} />
          </View>
          <Heading level={1} style={{textAlign: 'center'}}>Mentor Dashboard</Heading>
          <AppText style={styles.headerSub}>Manage your upcoming interviews</AppText>
        </Section>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Ionicons name="calendar" size={24} color={theme.colors.primary} />
            <AppText style={styles.statValue}>{stats.upcoming}</AppText>
            <AppText style={styles.statLabel}>Upcoming</AppText>
          </Card>
          <Card style={styles.statCard}>
            <Ionicons name="checkmark-done-circle" size={24} color="#059669" />
            <AppText style={styles.statValue}>{stats.completed}</AppText>
            <AppText style={styles.statLabel}>Completed</AppText>
          </Card>
          <Card style={[styles.statCard, styles.earningsCard]}>
            <Ionicons name="cash" size={24} color="#FFF" />
            <AppText style={[styles.statValue, {color:'#FFF'}]}>
              ₹{stats.earnings.toLocaleString()}
            </AppText>
            <AppText style={[styles.statLabel, {color: 'rgba(255,255,255,0.8)'}]}>
              Earnings
            </AppText>
          </Card>
        </View>

        <View style={styles.divider} />

        <Heading level={3} style={styles.sectionTitle}>Your Schedule</Heading>
        
        {sessions.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={48} color="#9CA3AF" />
            <AppText style={styles.emptyText}>No sessions booked yet.</AppText>
          </View>
        ) : (
          <View style={styles.list}>
            {sessions.map((session) => {
              const date = session.scheduled_at ? DateTime.fromISO(session.scheduled_at) : null;
              const statusConfig = getStatusStyle(session.status);
              const paymentStatus = getPaymentStatus(session.package?.payment_status);
              const ctaState = getCTAState(session);
              const professionalTitle = session.candidate?.professional_title || session.candidate?.linkedin_headline || session.candidate?.target_profile || 'Professional';
              const targetProfile = session.package?.target_profile || session.candidate?.target_profile || 'Not specified';

              return (
                <Card key={session.id} style={styles.sessionCard}>
                  {/* Date Box */}
                  {date && (
                    <View style={styles.dateBox}>
                      <AppText style={styles.dateMonth}>{date.toFormat('MMM')}</AppText>
                      <AppText style={styles.dateDay}>{date.toFormat('dd')}</AppText>
                    </View>
                  )}

                  <View style={styles.infoCol}>
                    {/* Top Row: Time + Status */}
                    <View style={styles.row}>
                      {date && (
                        <AppText style={styles.timeText}>
                          {date.toFormat('h:mm a')} • {date.toFormat('cccc')}
                        </AppText>
                      )}
                      <View style={[styles.statusChip, { backgroundColor: statusConfig.bg }]}>
                        <AppText style={[styles.statusText, { color: statusConfig.text }]}>
                          {statusConfig.label}
                        </AppText>
                      </View>
                    </View>

                    {/* Professional Title */}
                    <Heading level={4} style={styles.professionalTitle}>
                      {professionalTitle}
                    </Heading>

                    {/* Info Pills Row */}
                    <View style={styles.pillsRow}>
                      {/* Round */}
                      <View style={styles.infoPill}>
                        <Ionicons name="layers-outline" size={12} color="#6B7280" />
                        <AppText style={styles.pillText}>
                          {session.round ? session.round.replace('_', ' ').toUpperCase() : 'Round 1'}
                        </AppText>
                      </View>

                      {/* Target Profile */}
                      <View style={styles.infoPill}>
                        <Ionicons name="briefcase-outline" size={12} color="#6B7280" />
                        <AppText style={styles.pillText} numberOfLines={1}>
                          {targetProfile}
                        </AppText>
                      </View>

                      {/* Payment Status */}
                      <View style={[styles.paymentPill, { backgroundColor: paymentStatus.bg }]}>
                        <Ionicons name="cash-outline" size={12} color={paymentStatus.color} />
                        <AppText style={[styles.pillText, { color: paymentStatus.color }]}>
                          {paymentStatus.label}
                        </AppText>
                      </View>
                    </View>

                    {/* CTAs */}
                    <View style={styles.actionRow}>
                      {ctaState.primary && (
                        <TouchableOpacity 
                          style={[
                            styles.ctaBtn, 
                            styles.primaryCta,
                            { backgroundColor: ctaState.primary.color },
                            ctaState.primary.disabled && styles.disabledCta
                          ]}
                          onPress={ctaState.primary.action}
                          disabled={ctaState.primary.disabled}
                        >
                          <Ionicons name={ctaState.primary.icon} size={16} color="#FFF" />
                          <AppText style={styles.ctaBtnText}>{ctaState.primary.label}</AppText>
                        </TouchableOpacity>
                      )}

                      {ctaState.secondary && (
                        <TouchableOpacity 
                          style={[
                            styles.ctaBtn, 
                            styles.secondaryCta,
                            { borderColor: ctaState.secondary.color }
                          ]}
                          onPress={ctaState.secondary.action}
                        >
                          <Ionicons name={ctaState.secondary.icon} size={16} color={ctaState.secondary.color} />
                          <AppText style={[styles.ctaBtnTextSecondary, { color: ctaState.secondary.color }]}>
                            {ctaState.secondary.label}
                          </AppText>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </Card>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Interview Details Modal */}
      <Modal
        visible={!!interviewDetailsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setInterviewDetailsModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Heading level={2}>Interview Details</Heading>
              <TouchableOpacity onPress={() => setInterviewDetailsModal(null)}>
                <Ionicons name="close" size={24} color="#1E293B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Target Profile */}
              <View style={styles.detailSection}>
                <AppText style={styles.detailLabel}>Target Profile</AppText>
                <AppText style={styles.detailValue}>
                  {interviewDetailsModal?.targetProfile || 'Not specified'}
                </AppText>
              </View>

              {/* Professional Title */}
              <View style={styles.detailSection}>
                <AppText style={styles.detailLabel}>Candidate Role</AppText>
                <AppText style={styles.detailValue}>
                  {interviewDetailsModal?.professionalTitle || 'Not provided'}
                </AppText>
              </View>

              {/* Profile Description */}
              <View style={styles.detailSection}>
                <AppText style={styles.detailLabel}>Interview Focus</AppText>
                <AppText style={styles.detailDescription}>
                  {interviewDetailsModal?.profileDescription}
                </AppText>
              </View>

              {/* Resume */}
              {interviewDetailsModal?.resumeUrl && (
                <View style={styles.detailSection}>
                  <AppText style={styles.detailLabel}>Resume</AppText>
                  <TouchableOpacity 
                    style={styles.downloadBtn}
                    onPress={() => {
                      if (Platform.OS === 'web') {
                        window.open(interviewDetailsModal.resumeUrl, '_blank');
                      } else {
                        Linking.openURL(interviewDetailsModal.resumeUrl);
                      }
                    }}
                  >
                    <Ionicons name="download-outline" size={18} color="#2563EB" />
                    <AppText style={styles.downloadText}>Download Resume</AppText>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Evaluation Modal */}
      <Modal
        visible={!!evaluationModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEvaluationModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Heading level={2}>Evaluation Feedback</Heading>
              <TouchableOpacity onPress={() => setEvaluationModal(null)}>
                <Ionicons name="close" size={24} color="#1E293B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Scores */}
              {evaluationModal?.communication_score && (
                <View style={styles.scoreRow}>
                  <AppText style={styles.scoreLabel}>Communication</AppText>
                  <AppText style={styles.scoreValue}>{evaluationModal.communication_score}/10</AppText>
                </View>
              )}
              
              {evaluationModal?.problem_solving_score && (
                <View style={styles.scoreRow}>
                  <AppText style={styles.scoreLabel}>Problem Solving</AppText>
                  <AppText style={styles.scoreValue}>{evaluationModal.problem_solving_score}/10</AppText>
                </View>
              )}
              
              {evaluationModal?.technical_depth_score && (
                <View style={styles.scoreRow}>
                  <AppText style={styles.scoreLabel}>Technical Depth</AppText>
                  <AppText style={styles.scoreValue}>{evaluationModal.technical_depth_score}/10</AppText>
                </View>
              )}
              
              {evaluationModal?.overall_score && (
                <View style={[styles.scoreRow, styles.overallScoreRow]}>
                  <AppText style={[styles.scoreLabel, styles.overallLabel]}>Overall Score</AppText>
                  <AppText style={[styles.scoreValue, styles.overallValue]}>
                    {evaluationModal.overall_score}/10
                  </AppText>
                </View>
              )}

              <View style={styles.dividerModal} />

              {/* Checklist Data */}
              {evaluationModal?.checklist_data && Object.keys(evaluationModal.checklist_data).length > 0 && (
                <View style={styles.detailSection}>
                  <AppText style={styles.detailLabel}>Evaluation Checklist</AppText>
                  {Object.entries(evaluationModal.checklist_data).map(([questionId, criteria]: [string, any]) => (
                    <View key={questionId} style={styles.checklistGroup}>
                      {Object.entries(criteria).map(([criterionId, value]: [string, any]) => (
                        <View key={criterionId} style={styles.checklistItem}>
                          <View style={styles.checklistBullet} />
                          <AppText style={styles.checklistText}>
                            {typeof value === 'boolean' 
                              ? (value ? '✓ Yes' : '✗ No')
                              : `Rating: ${value}`
                            }
                          </AppText>
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
              )}

              {/* Strengths */}
              {evaluationModal?.strengths && (
                <View style={styles.detailSection}>
                  <AppText style={styles.detailLabel}>Strengths</AppText>
                  <AppText style={styles.detailDescription}>{evaluationModal.strengths}</AppText>
                </View>
              )}

              {/* Areas for Improvement */}
              {evaluationModal?.areas_for_improvement && (
                <View style={styles.detailSection}>
                  <AppText style={styles.detailLabel}>Areas for Improvement</AppText>
                  <AppText style={styles.detailDescription}>
                    {evaluationModal.areas_for_improvement}
                  </AppText>
                </View>
              )}

              {/* Detailed Feedback */}
              {evaluationModal?.detailed_feedback && (
                <View style={styles.detailSection}>
                  <AppText style={styles.detailLabel}>Detailed Feedback</AppText>
                  <AppText style={styles.detailDescription}>
                    {evaluationModal.detailed_feedback}
                  </AppText>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Reschedule Modal */}
      <Modal
        visible={!!rescheduleModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setRescheduleModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Heading level={2}>Reschedule Interview</Heading>
              <TouchableOpacity onPress={() => setRescheduleModal(null)}>
                <Ionicons name="close" size={24} color="#1E293B" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <AppText style={styles.helperText}>
                Select a new date and time for this interview
              </AppText>

              <View style={styles.inputGroup}>
                <AppText style={styles.inputLabel}>Date (YYYY-MM-DD)</AppText>
                <TextInput
                  style={styles.input}
                  value={rescheduleDate}
                  onChangeText={setRescheduleDate}
                  placeholder="2025-01-15"
                />
              </View>

              <View style={styles.inputGroup}>
                <AppText style={styles.inputLabel}>Time (HH:MM, 24-hour)</AppText>
                <TextInput
                  style={styles.input}
                  value={rescheduleTime}
                  onChangeText={setRescheduleTime}
                  placeholder="14:30"
                />
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={styles.modalCancelBtn}
                  onPress={() => {
                    setRescheduleModal(null);
                    setRescheduleDate('');
                    setRescheduleTime('');
                  }}
                >
                  <AppText style={styles.modalCancelText}>Cancel</AppText>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.modalConfirmBtn}
                  onPress={handleRescheduleSubmit}
                >
                  <AppText style={styles.modalConfirmText}>Confirm Reschedule</AppText>
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
  container: { flex: 1, backgroundColor: theme.colors.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  
  header: { alignItems: 'center', marginBottom: 24 },
  headerIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#E0F2FE', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  headerSub: { color: theme.colors.text.light, marginTop: 4 },

  statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: { flex: 1, alignItems: 'center', padding: 16, borderRadius: 16, backgroundColor: '#FFF', borderWidth: 1, borderColor: theme.colors.border },
  earningsCard: { backgroundColor: theme.colors.primary, borderWidth: 0 },
  statValue: { fontSize: 20, fontWeight: '700', color: theme.colors.text.main, marginTop: 8 },
  statLabel: { fontSize: 12, color: theme.colors.text.light },

  divider: { height: 1, backgroundColor: theme.colors.border, marginBottom: 24 },
  sectionTitle: { marginBottom: 16 },

  list: { gap: 16 },
  sessionCard: { flexDirection: 'row', padding: 16, borderRadius: 16, backgroundColor: '#FFF', borderWidth: 1, borderColor: theme.colors.border },
  
  dateBox: { alignItems: 'center', justifyContent: 'center', paddingRight: 16, borderRightWidth: 1, borderRightColor: '#F3F4F6', marginRight: 16, minWidth: 56 },
  dateMonth: { fontSize: 12, fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase' },
  dateDay: { fontSize: 24, fontWeight: '700', color: theme.colors.text.main },

  infoCol: { flex: 1, gap: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  timeText: { fontSize: 13, color: theme.colors.text.light, fontWeight: '500' },
  
  statusChip: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },

  professionalTitle: { fontSize: 16, fontWeight: '700', color: theme.colors.text.main },

  pillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  infoPill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F3F4F6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  paymentPill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  pillText: { fontSize: 11, color: '#6B7280', fontWeight: '600' },

  actionRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  ctaBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 8 },
  primaryCta: { },
  secondaryCta: { backgroundColor: '#FFF', borderWidth: 1.5 },
  disabledCta: { opacity: 0.5 },
  ctaBtnText: { color: '#FFF', fontWeight: '600', fontSize: 13 },
  ctaBtnTextSecondary: { fontWeight: '600', fontSize: 13 },

  emptyState: { alignItems: 'center', marginTop: 40 },
  emptyText: { marginTop: 16, fontSize: 16, fontWeight: '600', color: theme.colors.text.main },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: '#FFF', borderRadius: 16, width: '100%', maxWidth: 600, maxHeight: '80%', overflow: 'hidden' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  modalBody: { padding: 20 },
  
  detailSection: { marginBottom: 20 },
  detailLabel: { fontSize: 12, fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', marginBottom: 8, letterSpacing: 0.5 },
  detailValue: { fontSize: 16, fontWeight: '600', color: '#1E293B' },
  detailDescription: { fontSize: 14, color: '#4B5563', lineHeight: 22 },

  downloadBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#EFF6FF', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, borderWidth: 1, borderColor: '#DBEAFE' },
  downloadText: { fontSize: 14, fontWeight: '600', color: '#2563EB' },

  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  scoreLabel: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
  scoreValue: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  overallScoreRow: { backgroundColor: '#F9FAFB', paddingHorizontal: 12, borderRadius: 8, marginTop: 8, borderBottomWidth: 0 },
  overallLabel: { fontSize: 15, fontWeight: '700', color: '#1E293B' },
  overallValue: { fontSize: 20, color: '#2563EB' },

  dividerModal: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 16 },

  checklistGroup: { marginBottom: 12 },
  checklistItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  checklistBullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#2563EB', marginTop: 6, marginRight: 10 },
  checklistText: { flex: 1, fontSize: 14, color: '#4B5563', lineHeight: 20 },

  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12, fontSize: 14 },
  helperText: { fontSize: 13, color: '#6B7280', marginBottom: 16, lineHeight: 20 },

  modalActions: { flexDirection: 'row', gap: 12, marginTop: 24 },
  modalCancelBtn: { flex: 1, paddingVertical: 12, borderRadius: 8, backgroundColor: '#F3F4F6', alignItems: 'center' },
  modalCancelText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  modalConfirmBtn: { flex: 1, paddingVertical: 12, borderRadius: 8, backgroundColor: '#2563EB', alignItems: 'center' },
  modalConfirmText: { fontSize: 14, fontWeight: '700', color: '#FFF' },
});