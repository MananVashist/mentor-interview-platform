// app/mentor/bookings.tsx
import React, { useEffect, useState } from 'react';
import { 
  View, ScrollView, StyleSheet, ActivityIndicator, 
  TouchableOpacity, RefreshControl, StatusBar, Alert, Linking, Modal, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DateTime } from 'luxon';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

// Libs
import { supabase } from '@/lib/supabase/client';
import { theme } from '@/lib/theme';
import { Heading, AppText, Card, Section, ScreenBackground } from '@/lib/ui';
import { useAuthStore } from '@/lib/store';

// --- SUB-COMPONENT: SMART BOOKING CARD ---
const BookingCard = ({ session, onAccept, onReschedule, onViewDetails, onJoin, onEvaluate, onViewResume }: any) => {
  const date = DateTime.fromISO(session.scheduled_at);
  const diffMinutes = date.diffNow('minutes').minutes; 
  
  // 🧠 LOGIC: Determine UI State (5-Step Flow)
  let uiState = 'SCHEDULED_REQUEST'; // Default
  
  if (session.status === 'pending') {
    uiState = 'SCHEDULED_REQUEST';
  } else if (session.status === 'completed') {
    uiState = 'COMPLETED';
  } else if (session.status === 'confirmed') {
    // Confirmed Logic based on Time
    if (diffMinutes > 15) {
      uiState = 'CONFIRMED';        // Future
    } else if (diffMinutes <= 15 && diffMinutes > -60) {
      uiState = 'JOIN';             // Now (15 mins before to 60 mins after)
    } else {
      uiState = 'EVALUATION';       // Past (Needs evaluation to close)
    }
  }

  // --- RENDER HELPERS ---
  const professionalTitle = session.candidate?.professional_title || 'Candidate';
  const targetProfile = session.package?.interview_profile_name || 'Interview';
  const mentorPayout = session.package?.mentor_payout_inr || 0; 
  const roundNumber = session.round ? session.round.match(/\d+/)?.[0] || '1' : '1';
  const hasResume = !!session.candidate?.resume_url;

  return (
    <Card style={styles.sessionCard}>
      {/* Split Layout Container */}
      <View style={styles.splitContainer}>
        
        {/* LEFT SIDE: Interview Info */}
        <View style={styles.leftSection}>
          <Heading level={4} style={styles.cardTitle}>
            {targetProfile} interview with {professionalTitle}
          </Heading>
          
          <View style={styles.infoRow}>
            <Ionicons name="layers-outline" size={14} color="#6B7280" />
            <AppText style={styles.infoText}>Round {roundNumber}</AppText>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={14} color="#6B7280" />
            <AppText style={styles.infoText}>
              {date.toFormat('MMM dd, yyyy')} • {date.toFormat('h:mm a')}
            </AppText>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={14} color="#6B7280" />
            <AppText style={styles.infoText}>55 min (45 min interview + 10 min Q&A)</AppText>
          </View>

          <View style={styles.payoutRow}>
            <Ionicons name="wallet-outline" size={14} color="#059669" />
            <AppText style={styles.payoutText}>₹{mentorPayout.toLocaleString()}</AppText>
          </View>
        </View>

        {/* RIGHT SIDE: Badge */}
        <View style={styles.rightSection}>
          <Badge state={uiState} />
        </View>
      </View>

      <View style={styles.cardDivider} />

      {/* --- DYNAMIC ACTIONS BASED ON STATE --- */}

      {/* 1. SCHEDULED REQUEST (Pending) */}
      {uiState === 'SCHEDULED_REQUEST' && (
        <View style={styles.actionRowFull}>
          <TouchableOpacity style={[styles.btnFull, styles.btnOutline]} onPress={() => onReschedule(session)}>
            <AppText style={styles.textPrimary}>Reschedule</AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btnFull, styles.btnPrimary]}
            onPress={() => onAccept(session)}
          >
            <AppText style={styles.textWhite}>Accept</AppText>
          </TouchableOpacity>
        </View>
      )}

      {/* 2. CONFIRMED (Future) */}
      {uiState === 'CONFIRMED' && (
        <View style={styles.actionRowFull}>
          {hasResume && (
            <TouchableOpacity 
              style={[styles.btnFull, styles.btnOutline]} 
              onPress={() => onViewResume(session.candidate?.resume_url)}
            >
              <Ionicons name="document-text-outline" size={16} color={theme.colors.primary} style={{marginRight: 4}} />
              <AppText style={styles.textPrimary}>Resume</AppText>
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={[styles.btnFull, styles.btnSecondary]} 
            onPress={() =>
              onViewDetails(
                session.package?.interview_profile_description || "No details provided."
              )
            }
          >
            <AppText style={styles.textPrimary}>View Details</AppText>
          </TouchableOpacity>
        </View>
      )}

      {/* 3. JOIN MEETING (Now) */}
      {uiState === 'JOIN' && (
        <View style={styles.actionRowFull}>
           <TouchableOpacity style={[styles.btnFull, styles.btnGreen]} onPress={() => onJoin(session.meeting_link)}>
            <Ionicons name="videocam" size={18} color="#fff" style={{marginRight:4}}/>
            <AppText style={styles.textWhite}>Join Meeting</AppText>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.btnFull, styles.btnOutline]} onPress={() => onEvaluate(session.id, 'edit')}>
            <AppText style={styles.textPrimary}>Evaluate</AppText>
          </TouchableOpacity>
        </View>
      )}

      {/* 4. EVALUATION (Past - Needs Action) */}
      {uiState === 'EVALUATION' && (
        <View style={styles.actionRowFull}>
          <TouchableOpacity 
            style={[styles.btnFull, styles.btnPrimary]} 
            onPress={() => onEvaluate(session.id, 'edit')}
          >
            <AppText style={styles.textWhite}>Submit Evaluation</AppText>
          </TouchableOpacity>
        </View>
      )}

      {/* 5. COMPLETED (History) */}
      {uiState === 'COMPLETED' && (
        <View style={styles.actionRowFull}>
          <TouchableOpacity 
            style={[styles.btnFull, styles.btnSecondary]} 
            onPress={() => onEvaluate(session.id, 'read')}
          >
            <AppText style={styles.textPrimary}>View Evaluation</AppText>
          </TouchableOpacity>
        </View>
      )}
    </Card>
  );
};

// Helper for the Status Badge
const Badge = ({ state }: { state: string }) => {
  let bg = '#E5E7EB'; let text = '#374151'; let label = state;
  
  if(state === 'SCHEDULED_REQUEST') { bg = '#FEF3C7'; text = '#B45309'; label = 'Request'; } // Yellow
  if(state === 'CONFIRMED') { bg = '#DBEAFE'; text = '#1E40AF'; label = 'Confirmed'; }       // Blue
  if(state === 'JOIN') { bg = '#D1FAE5'; text = '#047857'; label = 'Join Now'; }             // Green
  if(state === 'EVALUATION') { bg = '#FEE2E2'; text = '#991B1B'; label = 'Pending Eval'; }   // Red
  if(state === 'COMPLETED') { bg = '#F3F4F6'; text = '#6B7280'; label = 'Completed'; }       // Grey
  
  return (
    <View style={{ backgroundColor: bg, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
      <AppText style={{ color: text, fontSize: 10, fontWeight: '700', textTransform: 'uppercase' }}>{label}</AppText>
    </View>
  );
};

export default function MentorBookingsScreen() {
  const { user } = useAuthStore();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);
  const [stats, setStats] = useState({ upcoming: 0, completed: 0, earnings: 0 });

  // Modals
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [detailContent, setDetailContent] = useState('');
  const [rescheduleModalVisible, setRescheduleModalVisible] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  
  const [newDate, setNewDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Fetch Sessions
  const fetchSessions = async () => {
  if (!user?.id) return;

  try {
    const { data: rawSessions, error: sessError } = await supabase
      .from('interview_sessions')
      .select(`
        id, 
        candidate_id, 
        mentor_id, 
        package_id, 
        scheduled_at, 
        status, 
        round,
        meeting_link
      `)
      .eq('mentor_id', user.id)
      .order('scheduled_at', { ascending: true });

    if (sessError) throw sessError;
    if (!rawSessions || rawSessions.length === 0) {
      setSessions([]);
      setStats({ upcoming: 0, completed: 0, earnings: 0 });
      return;
    }

    const packageIds = [...new Set(rawSessions.map((s: any) => s.package_id))];
    const { data: packages, error: pkgError } = await supabase
      .from('packages')
      .select('id, name, description, mentor_payout_inr, interview_profile_id')
      .in('id', packageIds);

    if (pkgError) return;

    const packageMap: Record<string, any> = {};
    (packages || []).forEach((pkg: any) => { packageMap[pkg.id] = pkg; });

    const profileIds = [...new Set((packages || []).map((p: any) => p.interview_profile_id).filter(Boolean))];
    let profileMap: Record<string, any> = {};

    if (profileIds.length > 0) {
      const { data: profiles } = await supabase
        .from('interview_profiles_admin')
        .select('id, name, description')
        .in('id', profileIds);
      if (profiles) {
        profileMap = Object.fromEntries(
          profiles.map((p: any) => [String(p.id), { name: p.name, description: p.description ?? null }])
        );
      }
    }

    const candidateIds = [...new Set(rawSessions.map((s: any) => s.candidate_id))];
    const { data: candidates } = await supabase
      .from('profiles')
      .select('id, full_name, professional_title, resume_url')
      .in('id', candidateIds);

    const candidateMap: Record<string, any> = {};
    (candidates || []).forEach((c: any) => { candidateMap[c.id] = c; });

    const enrichedSessions = rawSessions.map((s: any) => {
      const pkg = packageMap[s.package_id];
      const profileId = pkg?.interview_profile_id;
      const profileMeta = profileId != null ? profileMap[String(profileId)] ?? null : null;

      return {
        ...s,
        candidate: candidateMap[s.candidate_id] || null,
        package: pkg
          ? {
              ...pkg,
              ...(profileMeta
                ? { interview_profile_name: profileMeta.name, interview_profile_description: profileMeta.description }
                : { interview_profile_name: null, interview_profile_description: null }),
            }
          : null,
      };
    });

    setSessions(enrichedSessions);

    let upcoming = 0, completed = 0, earnings = 0;
    enrichedSessions.forEach((s: any) => {
      if (s.status === 'confirmed') upcoming++;
      if (s.status === 'completed') {
        completed++;
        if (s.package?.mentor_payout_inr) earnings += s.package.mentor_payout_inr * 1.2;
      }
    });

    setStats({ upcoming, completed, earnings });

  } catch (err: any) {
    console.error('Error loading mentor bookings:', err);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};

  useEffect(() => { fetchSessions(); }, [user]);
  const onRefresh = () => { setRefreshing(true); fetchSessions(); };

  // --- ACTIONS ---

  const handleAccept = async (session: any) => {
    Alert.alert(
      'Confirm Interview',
      `Accept interview with ${session.candidate?.full_name || 'candidate'}?\n\nScheduled: ${DateTime.fromISO(session.scheduled_at).toFormat('MMM dd, h:mm a')}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('interview_sessions')
                .update({ status: 'confirmed' }) // Moves to Confirmed state
                .eq('id', session.id);

              if (error) throw error;
              
              Alert.alert('Success', 'Interview confirmed.');
              fetchSessions();
            } catch (e: any) {
              Alert.alert('Error', e?.message || 'Could not accept.');
            }
          }
        }
      ]
    );
  };

  const handleRescheduleStart = (session: any) => {
    setSelectedSession(session);
    setNewDate(new Date(session.scheduled_at));
    setRescheduleModalVisible(true);
    setShowDatePicker(false);
    setShowTimePicker(false);
  };

  const handleRescheduleConfirm = async () => {
    if (!selectedSession) return;
    Alert.alert(
      'Confirm Reschedule',
      `Reschedule to ${DateTime.fromJSDate(newDate).toFormat('MMM dd, yyyy • h:mm a')}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            const { error } = await supabase
              .from('interview_sessions')
              .update({ 
                status: 'confirmed',  
                scheduled_at: newDate.toISOString() 
              })
              .eq('id', selectedSession.id);
          
            setRescheduleModalVisible(false);
            if (!error) {
              Alert.alert("Success", "Meeting has been rescheduled.");
              fetchSessions();
            } else {
              Alert.alert("Error", "Failed to reschedule.");
            }
          }
        }
      ]
    );
  };

  const handleJoin = (link: string) => {
    if (!link) return Alert.alert("No Link", "Meeting link is not ready yet.");
    Linking.openURL(link).catch(() => Alert.alert("Error", "Could not open link."));
  };

  const handleViewDetails = (details: string) => {
    setDetailContent(details);
    setDetailModalVisible(true);
  };
  
  const handleViewResume = async (path: string) => {
    if (!path) {
      Alert.alert('No Resume', 'The candidate has not uploaded a resume yet.');
      return;
    }
    try {
      const { data, error } = await supabase.storage.from('resumes').createSignedUrl(path, 300);
      if (error || !data?.signedUrl) {
        Alert.alert('Error', 'Could not fetch resume.');
        return;
      }
      Linking.openURL(data.signedUrl).catch(() => Alert.alert('Error', 'Could not open resume.'));
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to view resume.');
    }
  };

  const handleEvaluate = (sessionId: string, mode: 'edit' | 'read') => {
    router.push({ pathname: `/mentor/session/${sessionId}`, params: { mode } });
  };

  if (loading) return <View style={styles.loadingContainer}><ActivityIndicator size="large" color={theme.colors.primary} /></View>;

  return (
    <ScreenBackground style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        
        <Section style={styles.header}>
          <Heading level={1} style={{textAlign: 'center'}}>Mentor Dashboard</Heading>
          <AppText style={styles.headerSub}>Manage your upcoming interviews</AppText>
        </Section>

        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <AppText style={styles.statValue}>{stats.upcoming}</AppText>
            <AppText style={styles.statLabel}>Upcoming</AppText>
          </Card>
          <Card style={styles.statCard}>
            <AppText style={styles.statValue}>{stats.completed}</AppText>
            <AppText style={styles.statLabel}>Completed</AppText>
          </Card>
          <Card style={[styles.statCard, styles.earningsCard]}>
            <AppText style={[styles.statValue, {color:'#FFF'}]}>₹{stats.earnings.toLocaleString()}</AppText>
            <AppText style={[styles.statLabel, {color: 'rgba(255,255,255,0.8)'}]}>Earnings</AppText>
          </Card>
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
                key={session.id} 
                session={session}
                onAccept={handleAccept}
                onReschedule={handleRescheduleStart}
                onViewDetails={handleViewDetails}
                onViewResume={handleViewResume}
                onJoin={handleJoin}
                onEvaluate={handleEvaluate}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* --- MODAL 1: VIEW DETAILS --- */}
      <Modal visible={detailModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Heading level={3} style={{marginBottom:12}}>Interview Details</Heading>
            <AppText style={{marginBottom: 20, lineHeight: 22}}>{detailContent}</AppText>
            <TouchableOpacity onPress={() => setDetailModalVisible(false)} style={styles.modalCloseBtn}>
              <AppText style={styles.textWhite}>Close</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* --- MODAL 2: RESCHEDULE --- */}
      <Modal visible={rescheduleModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Heading level={3} style={{marginBottom:12}}>Reschedule Interview</Heading>
            <AppText style={{marginBottom: 20}}>Select a new date and time.</AppText>
            
            <View style={{marginBottom: 20}}>
              <View style={styles.dateTimeDisplay}>
                <Ionicons name="calendar" size={20} color={theme.colors.primary} />
                <AppText style={styles.dateTimeText}>
                  {DateTime.fromJSDate(newDate).toFormat('MMM dd, yyyy • h:mm a')}
                </AppText>
              </View>

              <View style={styles.pickerButtons}>
                <TouchableOpacity 
                  style={[styles.pickerButton, styles.btnOutline]} 
                  onPress={() => {
                    if (Platform.OS === 'web') {
                      const input = document.createElement('input');
                      input.type = 'date';
                      input.value = DateTime.fromJSDate(newDate).toFormat('yyyy-MM-dd');
                      input.onchange = (e: any) => {
                        const selected = new Date(e.target.value);
                        setNewDate(new Date(selected.getFullYear(), selected.getMonth(), selected.getDate(), newDate.getHours(), newDate.getMinutes()));
                      };
                      input.click();
                    } else {
                      setShowDatePicker(true);
                    }
                  }}
                >
                  <Ionicons name="calendar-outline" size={16} color={theme.colors.primary} />
                  <AppText style={styles.textPrimary}>Change Date</AppText>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.pickerButton, styles.btnOutline]} 
                  onPress={() => {
                    if (Platform.OS === 'web') {
                      const input = document.createElement('input');
                      input.type = 'time';
                      input.value = DateTime.fromJSDate(newDate).toFormat('HH:mm');
                      input.onchange = (e: any) => {
                        const [hours, minutes] = e.target.value.split(':');
                        setNewDate(new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), parseInt(hours), parseInt(minutes)));
                      };
                      input.click();
                    } else {
                      setShowTimePicker(true);
                    }
                  }}
                >
                  <Ionicons name="time-outline" size={16} color={theme.colors.primary} />
                  <AppText style={styles.textPrimary}>Change Time</AppText>
                </TouchableOpacity>
              </View>

              {Platform.OS !== 'web' && showDatePicker && (
                <DateTimePicker
                  value={newDate}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) {
                      setNewDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), newDate.getHours(), newDate.getMinutes()));
                    }
                  }}
                />
              )}

              {Platform.OS !== 'web' && showTimePicker && (
                <DateTimePicker
                  value={newDate}
                  mode="time"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowTimePicker(false);
                    if (selectedDate) {
                      setNewDate(new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), selectedDate.getHours(), selectedDate.getMinutes()));
                    }
                  }}
                />
              )}
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity onPress={() => setRescheduleModalVisible(false)} style={[styles.btn, styles.btnOutline, {flex:1}]}>
                <AppText style={styles.textPrimary}>Cancel</AppText>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleRescheduleConfirm} style={[styles.btn, styles.btnPrimary, {flex:1}]}>
                <AppText style={styles.textWhite}>Confirm</AppText>
              </TouchableOpacity>
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
  headerSub: { color: theme.colors.text.light, marginTop: 4 },
  
  statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: { flex: 1, alignItems: 'center', padding: 16, borderRadius: 16, backgroundColor: '#FFF', borderWidth: 1, borderColor: theme.colors.border },
  earningsCard: { backgroundColor: theme.colors.primary, borderWidth: 0 },
  statValue: { fontSize: 20, fontWeight: '700', color: theme.colors.text.main, marginTop: 8 },
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
  
  dateTimeDisplay: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, backgroundColor: '#F3F4F6', borderRadius: 12, marginBottom: 16 },
  dateTimeText: { fontSize: 16, fontWeight: '600', color: theme.colors.text.main },
  pickerButtons: { flexDirection: 'row', gap: 12 },
  pickerButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8 },
});