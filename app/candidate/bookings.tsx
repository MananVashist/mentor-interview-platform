import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Linking, 
  ActivityIndicator,
  Alert,
  Platform,
  Modal,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DateTime } from 'luxon';
import { supabase } from '../../lib/supabase/client'; 
import { useAuth } from '../../hooks/useAuth';
import { useRouter, useNavigation } from 'expo-router';

export default function BookingsScreen() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const navigation = useNavigation();
  
  const [sessions, setSessions] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Modal states
  const [interviewDetailsModal, setInterviewDetailsModal] = useState<any>(null);
  const [feedbackModal, setFeedbackModal] = useState<any>(null);

  // Trigger Fetch only when Auth is ready
  useEffect(() => {
    if (authLoading) return; 

    if (!user) {
      setDataLoading(false);
      return;
    }
    fetchBookings();
  }, [user, authLoading]);

  // Navigation listener for refreshing on return
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (!authLoading && user) {
        fetchBookings();
      }
    });
    return unsubscribe;
  }, [navigation, user, authLoading]);

  const fetchBookings = async () => {
    console.log("Fetching bookings for user:", user?.id);
    setDataLoading(true);
    try {
      const { data: sessionsData, error } = await supabase
        .from('interview_sessions')
        .select(`
          id,
          scheduled_at,
          status,
          round,
          meeting_link,
          duration_minutes,
          package:interview_packages (
            total_amount_inr,
            target_profile
          ),
          mentor:mentors!inner (
            professional_title,
            years_of_experience,
            experience_description,
            expertise_profiles
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
        .eq('candidate_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSessions(sessionsData || []);
    } catch (err) {
      console.error("Fetch Bookings Failed:", err);
    } finally {
      setDataLoading(false);
    }
  };

  const handleJoin = (link: string) => {
    if (!link) {
      Alert.alert("No Link", "Meeting link is not available yet.");
      return;
    }
    if (Platform.OS === 'web') {
      window.open(link, '_blank');
    } else {
      Linking.openURL(link).catch(err => console.error("Link Error:", err));
    }
  };

  // Open Interview Details
  const handleInterviewDetails = async (session: any) => {
    try {
      // Fetch profile description from admin
      const { data: profileData } = await supabase
        .from('interview_profiles_admin')
        .select('description')
        .eq('name', session.package?.target_profile)
        .single();

      setInterviewDetailsModal({
        mentorTitle: session.mentor?.professional_title || 'Professional',
        yearsOfExp: session.mentor?.years_of_experience || 0,
        description: session.mentor?.experience_description || 'Experienced mentor ready to help you succeed.',
        profileDescription: profileData?.description || 'Interview preparation session',
        targetProfile: session.package?.target_profile || 'Not specified',
        round: session.round
      });
    } catch (error) {
      console.error('Error loading interview details:', error);
      Alert.alert('Error', 'Could not load interview details');
    }
  };

  // Get CTA state based on session status and time
  const getCTAState = (session: any) => {
    const now = DateTime.now();
    const scheduledTime = session.scheduled_at ? DateTime.fromISO(session.scheduled_at) : null;
    const minutesUntilMeeting = scheduledTime ? scheduledTime.diff(now, 'minutes').minutes : null;
    const durationMinutes = session.duration_minutes || 50;
    const meetingEndTime = scheduledTime ? scheduledTime.plus({ minutes: durationMinutes }) : null;
    const meetingHasEnded = meetingEndTime ? now > meetingEndTime : false;
    const hasEvaluation = session.evaluation && session.evaluation.length > 0;

    // State 1: Pending (waiting for mentor acceptance)
    if (session.status === 'pending') {
      return {
        primary: { label: 'Awaiting Confirmation', action: null, icon: 'time', color: '#9CA3AF', disabled: true },
        secondary: { label: 'Interview Details', action: () => handleInterviewDetails(session), icon: 'information-circle-outline', color: '#2563EB' }
      };
    }

    // State 2: Confirmed - Meeting time logic
    if (session.status === 'confirmed') {
      // State 2a: After meeting has ended
      if (meetingHasEnded) {
        if (hasEvaluation) {
          // Evaluation submitted - show feedback
          return {
            primary: { label: 'View Feedback', action: () => setFeedbackModal(session.evaluation[0]), icon: 'document-text', color: '#2563EB' },
            secondary: { label: 'Interview Details', action: () => handleInterviewDetails(session), icon: 'information-circle-outline', color: '#2563EB' }
          };
        } else {
          // Meeting ended but no evaluation yet
          return {
            primary: { label: 'Awaiting Feedback', action: null, icon: 'time', color: '#F59E0B', disabled: true },
            secondary: { label: 'Interview Details', action: () => handleInterviewDetails(session), icon: 'information-circle-outline', color: '#2563EB' }
          };
        }
      }
      
      // State 2b: Less than 15 minutes before meeting
      if (minutesUntilMeeting !== null && minutesUntilMeeting <= 15) {
        return {
          primary: { label: 'Join Meeting', action: () => handleJoin(session.meeting_link), icon: 'videocam', color: '#10B981' },
          secondary: { label: 'Interview Details', action: () => handleInterviewDetails(session), icon: 'information-circle-outline', color: '#2563EB' }
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
          primary: { label: 'View Feedback', action: () => setFeedbackModal(session.evaluation[0]), icon: 'document-text', color: '#2563EB' },
          secondary: { label: 'Interview Details', action: () => handleInterviewDetails(session), icon: 'information-circle-outline', color: '#2563EB' }
        };
      } else {
        return {
          primary: { label: 'Awaiting Feedback', action: null, icon: 'time', color: '#F59E0B', disabled: true },
          secondary: { label: 'Interview Details', action: () => handleInterviewDetails(session), icon: 'information-circle-outline', color: '#2563EB' }
        };
      }
    }

    // State 4: Cancelled or No Show
    if (session.status === 'cancelled' || session.status === 'no_show') {
      return {
        primary: { label: 'Cancelled', action: null, icon: 'close-circle', color: '#6B7280', disabled: true },
        secondary: null
      };
    }

    return { primary: null, secondary: null };
  };

  const renderSession = ({ item }: { item: any }) => {
    const date = item.scheduled_at ? new Date(item.scheduled_at) : null;
    const dateStr = date ? date.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' }) : 'TBD';
    const timeStr = date ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
    
    const statusDisplay = item.status ? item.status.toUpperCase() : 'PENDING';
    const isConfirmed = item.status === 'confirmed';
    
    const mentorTitle = item.mentor?.professional_title || 'Professional Mentor';
    const targetProfile = item.package?.target_profile || 'Interview';
    const roundDisplay = item.round ? item.round.replace('_', ' ').toUpperCase() : 'ROUND 1';

    const ctaState = getCTAState(item);

    return (
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.leftSection}>
            <Text style={styles.profileType}>{targetProfile} Interview</Text>
            <View style={styles.mentorInfoRow}>
              <Ionicons name="person-circle-outline" size={16} color="#64748B" />
              <Text style={styles.mentorInfo}>with {mentorTitle}</Text>
            </View>
          </View>
          <View style={[styles.badge, isConfirmed ? styles.badgeConfirmed : styles.badgePending]}>
            <Text style={[styles.badgeText, isConfirmed ? styles.badgeTextConfirmed : styles.badgeTextPending]}>
              {statusDisplay}
            </Text>
          </View>
        </View>

        {/* Horizontal Details Row - COMPACT & SINGLE LINE */}
        <View style={styles.detailsRow}>
          {/* Date & Time */}
          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <Text style={styles.detailEmoji}>📅</Text>
            </View>
            <Text style={styles.detailInlineText} numberOfLines={1}>
              <Text style={styles.detailInlineLabel}>Date: </Text>
              <Text style={styles.detailInlineValue}>{dateStr} • {timeStr}</Text>
            </Text>
          </View>

          {/* Round */}
          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <Text style={styles.detailEmoji}>📊</Text>
            </View>
            <Text style={styles.detailInlineText} numberOfLines={1}>
              <Text style={styles.detailInlineLabel}>Round: </Text>
              <Text style={styles.detailInlineValue}>{roundDisplay.replace('ROUND ', 'R')}</Text>
            </Text>
          </View>

          {/* Duration */}
          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <Text style={styles.detailEmoji}>⏱️</Text>
            </View>
            <Text style={styles.detailInlineText} numberOfLines={1}>
              <Text style={styles.detailInlineLabel}>Time: </Text>
              <Text style={styles.detailInlineValue}>{item.duration_minutes || 50}m</Text>
            </Text>
          </View>
        </View>

        {/* CTAs */}
        <View style={styles.ctaRow}>
          {ctaState.primary && (
            <TouchableOpacity 
              style={[
                styles.primaryCta,
                { backgroundColor: ctaState.primary.color },
                ctaState.primary.disabled && styles.disabledCta
              ]}
              onPress={ctaState.primary.action}
              disabled={ctaState.primary.disabled}
            >
              <Ionicons name={ctaState.primary.icon} size={18} color="#fff" />
              <Text style={styles.ctaText}>{ctaState.primary.label}</Text>
            </TouchableOpacity>
          )}

          {ctaState.secondary && (
            <TouchableOpacity 
              style={[
                styles.secondaryCta,
                { borderColor: ctaState.secondary.color }
              ]}
              onPress={ctaState.secondary.action}
            >
              <Ionicons name={ctaState.secondary.icon} size={18} color={ctaState.secondary.color} />
              <Text style={[styles.ctaTextSecondary, { color: ctaState.secondary.color }]}>
                {ctaState.secondary.label}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>My Bookings</Text>
      </View>

      {(authLoading || dataLoading) ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : (
        <FlatList 
          data={sessions} 
          renderItem={renderSession} 
          keyExtractor={i => i.id} 
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>No bookings found.</Text>
              <TouchableOpacity onPress={() => router.push('/candidate')} style={{ marginTop: 12 }}>
                <Text style={{ color: '#2563eb', fontWeight: 'bold' }}>Book a Session</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

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
              <Text style={styles.modalTitle}>Interview Details</Text>
              <TouchableOpacity onPress={() => setInterviewDetailsModal(null)}>
                <Ionicons name="close" size={24} color="#1E293B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Target Profile */}
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Interview Type</Text>
                <Text style={styles.detailValue}>{interviewDetailsModal?.targetProfile}</Text>
              </View>

              {/* Round */}
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Round</Text>
                <Text style={styles.detailValue}>
                  {interviewDetailsModal?.round ? interviewDetailsModal.round.replace('_', ' ').toUpperCase() : 'Round 1'}
                </Text>
              </View>

              {/* Mentor Title */}
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Your Interviewer</Text>
                <Text style={styles.detailValue}>{interviewDetailsModal?.mentorTitle}</Text>
              </View>

              {/* Years of Experience */}
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Experience</Text>
                <Text style={styles.detailValue}>
                  {interviewDetailsModal?.yearsOfExp} years in the industry
                </Text>
              </View>

              {/* Mentor Description */}
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>About Your Interviewer</Text>
                <Text style={styles.detailDescription}>{interviewDetailsModal?.description}</Text>
              </View>

              {/* Profile Description */}
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>What to Expect</Text>
                <Text style={styles.detailDescription}>{interviewDetailsModal?.profileDescription}</Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* View Feedback Modal */}
      <Modal
        visible={!!feedbackModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFeedbackModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Interview Feedback</Text>
              <TouchableOpacity onPress={() => setFeedbackModal(null)}>
                <Ionicons name="close" size={24} color="#1E293B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Scores Section */}
              {(feedbackModal?.communication_score || feedbackModal?.problem_solving_score || 
                feedbackModal?.technical_depth_score || feedbackModal?.overall_score) && (
                <>
                  <Text style={styles.sectionTitle}>Performance Scores</Text>
                  
                  {feedbackModal?.communication_score && (
                    <View style={styles.scoreRow}>
                      <Text style={styles.scoreLabel}>Communication</Text>
                      <Text style={styles.scoreValue}>{feedbackModal.communication_score}/10</Text>
                    </View>
                  )}
                  
                  {feedbackModal?.problem_solving_score && (
                    <View style={styles.scoreRow}>
                      <Text style={styles.scoreLabel}>Problem Solving</Text>
                      <Text style={styles.scoreValue}>{feedbackModal.problem_solving_score}/10</Text>
                    </View>
                  )}
                  
                  {feedbackModal?.technical_depth_score && (
                    <View style={styles.scoreRow}>
                      <Text style={styles.scoreLabel}>Technical Depth</Text>
                      <Text style={styles.scoreValue}>{feedbackModal.technical_depth_score}/10</Text>
                    </View>
                  )}
                  
                  {feedbackModal?.overall_score && (
                    <View style={[styles.scoreRow, styles.overallScoreRow]}>
                      <Text style={[styles.scoreLabel, styles.overallLabel]}>Overall Score</Text>
                      <Text style={[styles.scoreValue, styles.overallValue]}>
                        {feedbackModal.overall_score}/10
                      </Text>
                    </View>
                  )}

                  <View style={styles.dividerModal} />
                </>
              )}

              {/* Checklist Data - Hierarchical Display */}
              {feedbackModal?.checklist_data && Object.keys(feedbackModal.checklist_data).length > 0 && (
                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Evaluation Criteria</Text>
                  {Object.entries(feedbackModal.checklist_data).map(([questionId, criteria]: [string, any]) => (
                    <View key={questionId} style={styles.checklistGroup}>
                      {Object.entries(criteria).map(([criterionId, value]: [string, any]) => (
                        <View key={criterionId} style={styles.checklistItem}>
                          <View style={styles.checklistBullet} />
                          <Text style={styles.checklistText}>
                            {typeof value === 'boolean' 
                              ? (value ? '✓ Yes' : '✗ No')
                              : typeof value === 'number'
                              ? `Rating: ${value}/5`
                              : value
                            }
                          </Text>
                        </View>
                      ))}
                    </View>
                  ))}
                  <View style={styles.dividerModal} />
                </View>
              )}

              {/* Strengths */}
              {feedbackModal?.strengths && (
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Strengths</Text>
                  <Text style={styles.detailDescription}>{feedbackModal.strengths}</Text>
                </View>
              )}

              {/* Areas for Improvement */}
              {feedbackModal?.areas_for_improvement && (
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Areas for Improvement</Text>
                  <Text style={styles.detailDescription}>{feedbackModal.areas_for_improvement}</Text>
                </View>
              )}

              {/* Detailed Feedback */}
              {feedbackModal?.detailed_feedback && (
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Detailed Feedback</Text>
                  <Text style={styles.detailDescription}>{feedbackModal.detailed_feedback}</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f5f0' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  topBar: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 20, 
    backgroundColor: '#f8f5f0', 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee',
    paddingTop: Platform.OS === 'ios' ? 60 : 20 
  },
  backBtn: { marginRight: 16 },
  title: { fontSize: 20, fontWeight: 'bold' },
  
  card: { 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 12, 
    marginBottom: 12, 
    elevation: 2,
    borderTopWidth: 4,
    borderTopColor: '#CC785C'
  },
  
  headerRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start', 
    marginBottom: 20 
  },
  leftSection: { flex: 1, paddingRight: 12 },
  profileType: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: '#1E293B', 
    marginBottom: 6,
    lineHeight: 26
  },
  mentorInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start'
  },
  mentorInfo: { 
    fontSize: 14, 
    color: '#64748B',
    fontWeight: '500'
  },
  
  badge: { 
    paddingHorizontal: 14, 
    paddingVertical: 8, 
    borderRadius: 6 
  },
  badgeConfirmed: { backgroundColor: '#D1FAE5' },
  badgePending: { backgroundColor: '#F3F4F6' },
  badgeText: { 
    fontSize: 11, 
    fontWeight: '700', 
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  badgeTextConfirmed: { color: '#059669' },
  badgeTextPending: { color: '#6B7280' },

  // --- UPDATED COMPACT STYLES ---
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FAFAFA',
    paddingVertical: 12, // Reduced padding
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 16,
    // gap: 8 // Reduced gap
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
    // Removed minWidth
  },
  detailIcon: {
    width: 28, // Smaller icon container
    height: 28,
    backgroundColor: '#FFF',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4 // Tighter spacing
  },
  detailEmoji: {
    fontSize: 14 // Smaller emoji
  },
  detailInlineText: {
    textAlign: 'center',
    fontSize: 11, // Smaller text to fit single line
    flexWrap: 'nowrap', // Force single line behavior
  },
  detailInlineLabel: {
    color: '#64748B',
    fontWeight: '600'
  },
  detailInlineValue: {
    color: '#1E293B',
    fontWeight: '700'
  },
  // -----------------------------

  ctaRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  primaryCta: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 6, 
    padding: 12, 
    borderRadius: 8 
  },
  secondaryCta: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 6, 
    padding: 12, 
    borderRadius: 8, 
    backgroundColor: '#fff', 
    borderWidth: 1.5 
  },
  disabledCta: { opacity: 0.6 },
  ctaText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  ctaTextSecondary: { fontWeight: 'bold', fontSize: 14 },
  
  emptyText: { textAlign: 'center', color: '#6B7280', fontSize: 16 },

  // Modal Styles
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
  },
  modalContent: { 
    backgroundColor: '#FFF', 
    borderRadius: 16, 
    width: '100%', 
    maxWidth: 600, 
    maxHeight: '80%', 
    overflow: 'hidden' 
  },
  modalHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 20, 
    borderBottomWidth: 1, 
    borderBottomColor: '#F3F4F6' 
  },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: '#1E293B' 
  },
  modalBody: { padding: 20 },
  
  detailSection: { marginBottom: 20 },
  detailLabel: { 
    fontSize: 12, 
    fontWeight: '700', 
    color: '#6B7280', 
    textTransform: 'uppercase', 
    marginBottom: 8, 
    letterSpacing: 0.5 
  },
  detailValue: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#1E293B' 
  },
  detailDescription: { 
    fontSize: 14, 
    color: '#4B5563', 
    lineHeight: 22 
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12
  },

  scoreRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: 12, 
    borderBottomWidth: 1, 
    borderBottomColor: '#F3F4F6' 
  },
  scoreLabel: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
  scoreValue: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  overallScoreRow: { 
    backgroundColor: '#F9FAFB', 
    paddingHorizontal: 12, 
    borderRadius: 8, 
    marginTop: 8, 
    borderBottomWidth: 0 
  },
  overallLabel: { fontSize: 15, fontWeight: '700', color: '#1E293B' },
  overallValue: { fontSize: 20, color: '#2563EB' },

  dividerModal: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 16 },

  checklistGroup: { marginBottom: 12 },
  checklistItem: { 
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    marginBottom: 8 
  },
  checklistBullet: { 
    width: 6, 
    height: 6, 
    borderRadius: 3, 
    backgroundColor: '#2563EB', 
    marginTop: 6, 
    marginRight: 10 
  },
  checklistText: { 
    flex: 1, 
    fontSize: 14, 
    color: '#4B5563', 
    lineHeight: 20 
  },
});