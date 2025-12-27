// app/mentor/bookings.tsx
import React, { useEffect, useState } from 'react';
import { 
  View, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, 
  RefreshControl, StatusBar, Linking, Modal, Platform, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

// Libs
import { supabase } from '@/lib/supabase/client';
import { theme } from '@/lib/theme';
import { Heading, AppText, Card, Section, ScreenBackground } from '@/lib/ui';
import { useAuthStore } from '@/lib/store';
import { getBookingState, getBookingDetails, getEvaluationTemplate, BookingUIState } from '@/lib/booking-logic';

// Notification Hook (Only for Success messages now)
import { useNotification } from '@/lib/ui/NotificationBanner';

// Bank Details Modal
import { BankDetailsModal } from '@/components/mentor/BankDetailsModal';

const BookingCard = ({ session, onAccept, onReschedule, onViewDetails, onJoin, onEvaluate, onViewResume }: any) => {
  const uiState = getBookingState(session);
  const details = getBookingDetails(session);
  const counterpartName = details.getCounterpartName('mentor');
  const hasResume = !!session.candidate?.resume_url;

  const skillName = session.skill_name || 'Interview Session';
  const skillDesc = session.skill_description || session.package?.interview_profile_description || "No details provided.";

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
            <AppText style={styles.infoText}>{details.dateLabel} • {details.timeLabel}</AppText>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={14} color="#6B7280" />
            <AppText style={styles.infoText}>55 mins</AppText>
          </View>
          <View style={styles.payoutRow}>
            <Ionicons name="wallet-outline" size={14} color="#059669" />
            <AppText style={styles.payoutText}>₹{details.mentorPayout.toLocaleString()}</AppText>
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

      {uiState === 'SCHEDULED' && (
        <View style={styles.actionRowFull}>
          {hasResume && (
            <TouchableOpacity style={[styles.btnFull, styles.btnOutline]} onPress={() => onViewResume(session.candidate?.resume_url)}>
              <Ionicons name="document-text-outline" size={16} color={theme.colors.primary} style={{marginRight: 4}} />
              <AppText style={styles.textPrimary}>Resume</AppText>
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={[styles.btnFull, styles.btnSecondary]} 
            onPress={() => onViewDetails(skillDesc)}
          >
            <AppText style={styles.textPrimary}>View Details</AppText>
          </TouchableOpacity>
        </View>
      )}

      {uiState === 'JOIN' && (
        <View style={styles.actionRowFull}>
           <TouchableOpacity style={[styles.btnFull, styles.btnGreen]} onPress={() => onJoin(session.meeting_link)}>
            <Ionicons name="videocam" size={18} color="#fff" style={{marginRight:4}}/>
            <AppText style={styles.textWhite}>Join Meeting</AppText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btnFull, styles.btnPrimary]} onPress={() => onEvaluate(session, 'edit')}>
            <AppText style={styles.textWhite}>Evaluate</AppText>
          </TouchableOpacity>
          {hasResume && (
            <TouchableOpacity 
              style={[styles.btnFull, styles.btnOutline, { paddingHorizontal: 8 }]} 
              onPress={() => onViewResume(session.candidate?.resume_url)}
            >
              <Ionicons name="document-text-outline" size={18} color={theme.colors.primary} />
            </TouchableOpacity>
          )}
        </View>
      )}

      {(uiState === 'POST_PENDING' || uiState === 'POST_COMPLETED') && (
        <View style={styles.actionRowFull}>
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
  if(state === 'APPROVAL') { bg = '#FEF3C7'; text = '#B45309'; label = 'Needs Approval'; }
  else if(state === 'SCHEDULED') { bg = '#DBEAFE'; text = '#1E40AF'; label = 'Scheduled'; }
  else if(state === 'JOIN') { bg = '#D1FAE5'; text = '#047857'; label = 'Live Now'; }
  else if(state === 'POST_PENDING') { bg = '#F3F4F6'; text = '#6B7280'; label = 'Pending Review'; }
  else if(state === 'POST_COMPLETED') { bg = '#DEF7EC'; text = '#03543F'; label = 'Completed'; }
  else if(state === 'CANCELLED') { bg = '#FEE2E2'; text = '#991B1B'; label = 'Cancelled'; }
  
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
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [detailContent, setDetailContent] = useState("");
  const [rescheduleModalVisible, setRescheduleModalVisible] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [newDate, setNewDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Bank Details Modal
  const [bankDetailsModalVisible, setBankDetailsModalVisible] = useState(false);
  const [hasBankDetails, setHasBankDetails] = useState(false);

  const fetchSessions = async () => {
    if (!user) return;
    try {
      // Fetch Sessions with package payment status
      const { data, error } = await supabase
        .from('interview_sessions')
        .select(`
        id, scheduled_at, status, skill_id, meeting_link,
        package:interview_packages!package_id ( id, mentor_payout_inr, interview_profile_id, payment_status ),
        candidate:candidates!candidate_id ( professional_title, resume_url )
      `)
        .eq('mentor_id', user.id)
        .order('scheduled_at', { ascending: true });

      if (error) throw error;
      
      // Filter out sessions where payment is still pending (exclude unpaid bookings)
      const paidSessions = (data || []).filter((s: any) => 
        s.package?.payment_status && s.package.payment_status !== 'pending'
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

      // 3. Merge Data
      const enrichedSessions = rawSessions.map((s: any) => {
        const profileId = s.package?.interview_profile_id;
        const profileMeta = profileId != null ? profileMap[String(profileId)] ?? null : null;
        const skillMeta = s.skill_id ? skillMap[s.skill_id] : null;

        return {
          ...s,
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
        if (s.status === 'confirmed' || s.status === 'pending') upcoming++; // pending = awaiting mentor approval
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
        // Check if all required fields are present and not empty
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

  const handleAccept = async (id: string) => {
    // Check bank details first
    const hasDetails = await checkBankDetails();
    if (!hasDetails) {
      setBankDetailsModalVisible(true);
      return;
    }

    try {
      const newMeetingLink = `https://meet.jit.si/crackjobs-${id}`;

      const { error } = await supabase
        .from('interview_sessions')
        .update({ 
            status: 'confirmed',
            meeting_link: newMeetingLink 
        }) 
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
    // Check bank details first
    const hasDetails = await checkBankDetails();
    if (!hasDetails) {
      setBankDetailsModalVisible(true);
      return;
    }

    setSelectedSession(session);
    setNewDate(new Date(session.scheduled_at));
    setRescheduleModalVisible(true);
  };

  const handleRescheduleConfirm = async () => {
    if (!selectedSession) return;
    
    try {
        const newMeetingLink = `https://meet.jit.si/crackjobs-${selectedSession.id}`;

        const { error } = await supabase
            .from('interview_sessions')
            .update({ 
                status: 'confirmed', 
                scheduled_at: newDate.toISOString(),
                meeting_link: newMeetingLink
            })
            .eq('id', selectedSession.id);
        
        setRescheduleModalVisible(false);
        if (error) throw error;

        showNotification('Meeting rescheduled successfully.', 'success');
        fetchSessions();
    } catch (e: any) {
        setRescheduleModalVisible(false);
        Alert.alert('Error', 'Failed to reschedule.');
    }
  };

  const handleJoin = (link: string) => {
    if (!link) {
        Alert.alert('Not Ready', 'Meeting link is not ready yet.');
        return;
    }
    Linking.openURL(link).catch(() => Alert.alert('Error', 'Could not open meeting link.'));
  };

  const handleViewDetails = (details: string) => {
    setDetailContent(details);
    setDetailModalVisible(true);
  };
  
  const handleViewResume = async (path: string) => {
    if (!path) { 
        Alert.alert('No Resume', 'No resume available for this candidate.');
        return; 
    }
    try {
      const { data, error } = await supabase.storage.from('resumes').createSignedUrl(path, 3600);
      if (error || !data?.signedUrl) throw error;
      Linking.openURL(data.signedUrl).catch(() => Alert.alert('Error', 'Could not open resume link.'));
    } catch (e) {
      console.error('Resume view error:', e);
      Alert.alert('Error', 'Could not load resume.');
    }
  };

  const handleEvaluate = (session: any, mode: 'edit' | 'read') => {
    try {
        const template = getEvaluationTemplate(session);
        router.push({ 
        pathname: `/mentor/session/${session.id}`, 
        params: { 
            mode,
            templateTitle: template.title,
            templateContent: template.content,
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
          <Card style={[styles.statCard, styles.earningsCard]}><AppText style={[styles.statValue, {color:'#FFF'}]}>₹{stats.earnings.toLocaleString()}</AppText><AppText style={[styles.statLabel, {color: 'rgba(255,255,255,0.8)'}]}>Earnings</AppText></Card>
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
                onViewDetails={handleViewDetails} onViewResume={handleViewResume}
                onJoin={handleJoin} onEvaluate={handleEvaluate}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Detail Modal */}
      <Modal visible={detailModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Heading level={3} style={{marginBottom:12}}>Interview Focus</Heading>
            <ScrollView style={{maxHeight: 300}}>
                <AppText style={{marginBottom: 20, lineHeight: 22, color: '#374151'}}>{detailContent}</AppText>
            </ScrollView>
            <TouchableOpacity onPress={() => setDetailModalVisible(false)} style={styles.modalCloseBtn}>
              <AppText style={styles.textWhite}>Close</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Reschedule Modal */}
      <Modal visible={rescheduleModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
            <Heading level={3} style={{marginBottom:12}}>Reschedule Interview</Heading>
            <AppText style={{marginBottom: 20}}>Select a new date and time for this candidate.</AppText>
            
            <View style={{marginBottom: 20}}>
                {Platform.OS === 'web' ? (
                <input
                    type="datetime-local"
                    value={newDate.toISOString().slice(0, 16)}
                    onChange={(e) => setNewDate(new Date(e.target.value))}
                    style={{
                    width: '100%',
                    padding: 12,
                    borderRadius: 8,
                    border: `1px solid ${theme.colors.border}`,
                    fontSize: 14,
                    fontFamily: 'inherit'
                    }}
                />
                ) : (
                <>
                    <TouchableOpacity 
                    style={[styles.btn, styles.btnOutline, {marginBottom: 12}]}
                    onPress={() => setShowDatePicker(true)}
                    >
                    <Ionicons name="calendar-outline" size={16} color={theme.colors.primary} style={{marginRight: 8}} />
                    <AppText style={styles.textPrimary}>
                        {newDate.toLocaleDateString()} at {newDate.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                    </AppText>
                    </TouchableOpacity>

                    {showDatePicker && (
                    <DateTimePicker
                        value={newDate}
                        mode="datetime"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={(event, selectedDate) => {
                        setShowDatePicker(Platform.OS === 'ios');
                        if (selectedDate) {
                            setNewDate(selectedDate);
                        }
                        }}
                    />
                    )}
                </>
                )}
            </View>

            <View style={styles.actionRow}>
                <TouchableOpacity onPress={() => {
                setRescheduleModalVisible(false);
                setShowDatePicker(false);
                }} style={[styles.btn, styles.btnOutline, {flex:1}]}>
                <AppText style={styles.textPrimary}>Cancel</AppText>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleRescheduleConfirm} style={[styles.btn, styles.btnPrimary, {flex:1}]}>
                <AppText style={styles.textWhite}>Confirm</AppText>
                </TouchableOpacity>
            </View>
            </View>
        </View>
      </Modal>

      {/* Bank Details Modal */}
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
  actionRow: { flexDirection: 'row', gap: 12, justifyContent: 'space-between', marginTop: 16 },
  btnFull: { flex: 1, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  btn: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  btnPrimary: { backgroundColor: theme.colors.primary },
  btnSecondary: { backgroundColor: '#eff6ff' },
  btnGreen: { backgroundColor: '#059669' },
  btnOutline: { borderWidth: 1, borderColor: theme.colors.primary, backgroundColor: 'transparent' },
  textWhite: { color: '#fff', fontWeight: '600', fontSize: 13 },
  textPrimary: { color: theme.colors.primary, fontWeight: '600', fontSize: 13 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', padding: 24, borderRadius: 16 },
  modalCloseBtn: { backgroundColor: theme.colors.primary, padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 10 },
});