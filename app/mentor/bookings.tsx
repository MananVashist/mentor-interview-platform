import React, { useEffect, useState } from 'react';
import { 
  View, ScrollView, StyleSheet, ActivityIndicator, 
  TouchableOpacity, RefreshControl, StatusBar, Alert, Linking, Platform, Modal
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
// This handles the 4 states: Approval, Scheduled, Join, Post
const BookingCard = ({ session, onAccept, onReschedule, onViewDetails, onJoin, onEvaluate }: any) => {
  const date = DateTime.fromISO(session.scheduled_at);
  const diffMinutes = date.diffNow('minutes').minutes; 
  // diffMinutes > 0 = Future | diffMinutes < 0 = Past

  // 🧠 LOGIC: Determine UI State
  let uiState = 'SCHEDULED';
  
  if (session.status === 'pending') {
    uiState = 'APPROVAL';
  } else if (session.status === 'completed') {
    uiState = 'POST';
  } else {
    // Status is 'confirmed'/'scheduled', checking time:
    if (diffMinutes <= 15 && diffMinutes > -60) {
      // Starts in 15 mins OR started less than an hour ago
      uiState = 'JOIN';
    } else if (diffMinutes <= -60) {
      // Meeting happened over an hour ago
      uiState = 'POST';
    } else {
      uiState = 'SCHEDULED';
    }
  }

  // --- RENDER HELPERS ---
  const professionalTitle = session.candidate?.professional_title || 'Candidate';
  // Now using the enriched field set in fetchSessions
  const targetProfile = session.package?.interview_profile_name || 'Interview';
  const mentorPayout = session.package?.mentor_payout_inr || 0; // kept for earnings UI

  // Extract round number from round string (e.g., "round_1" -> "1")
  const roundNumber = session.round ? session.round.match(/\d+/)?.[0] || '1' : '1';

  return (
    <Card style={styles.sessionCard}>
      {/* Split Layout Container */}
      <View style={styles.splitContainer}>
        
        {/* LEFT SIDE: Interview Info */}
        <View style={styles.leftSection}>
          {/* Main Title */}
          <Heading level={4} style={styles.cardTitle}>
            {targetProfile} interview with {professionalTitle}
          </Heading>
          
          {/* Round Info */}
          <View style={styles.infoRow}>
            <Ionicons name="layers-outline" size={14} color="#6B7280" />
            <AppText style={styles.infoText}>Round {roundNumber}</AppText>
          </View>

          {/* Date & Time */}
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={14} color="#6B7280" />
            <AppText style={styles.infoText}>
              {date.toFormat('MMM dd, yyyy')} • {date.toFormat('h:mm a')}
            </AppText>
          </View>

          {/* Duration */}
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={14} color="#6B7280" />
            <AppText style={styles.infoText}>2 x 55 min (45 min interview + 10 min Q&A)</AppText>
          </View>

          {/* Payout */}
          <View style={styles.payoutRow}>
            <Ionicons name="wallet-outline" size={14} color="#059669" />
            <AppText style={styles.payoutText}>₹{mentorPayout.toLocaleString()}</AppText>
            <AppText style={styles.platformFee}>(Platform takes 20%)</AppText>
          </View>
        </View>

        {/* RIGHT SIDE: Badge */}
        <View style={styles.rightSection}>
          <Badge state={uiState} />
        </View>
      </View>

      <View style={styles.cardDivider} />

      {/* --- DYNAMIC ACTIONS BASED ON STATE --- */}

      {/* 1. APPROVAL STATE */}
      {uiState === 'APPROVAL' && (
        <View style={styles.actionRowFull}>
          <TouchableOpacity style={[styles.btnFull, styles.btnOutline]} onPress={() => onReschedule(session)}>
            <AppText style={styles.textPrimary}>Reschedule</AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btnFull, styles.btnPrimary]}
            onPress={() => {
              console.log('[BookingCard] Accept pressed', {
                id: session.id,
                status: session.status,
                scheduled_at: session.scheduled_at,
              });
              onAccept(session.id);
            }}
          >
            <AppText style={styles.textWhite}>Accept</AppText>
          </TouchableOpacity>
        </View>
      )}

      {/* 2. SCHEDULED STATE */}
      {uiState === 'SCHEDULED' && (
        <View style={styles.actionRowFull}>
          <TouchableOpacity 
            style={[styles.btnFull, styles.btnSecondary]} 
            onPress={() =>
              onViewDetails(
                session.package?.interview_profile_description ||
                  "No details provided by admin."
              )
            }
          >
            <AppText style={styles.textPrimary}>View Details</AppText>
          </TouchableOpacity>
        </View>
      )}

      {/* 3. JOIN MEETING STATE (Active 15 mins before) */}
      {uiState === 'JOIN' && (
        <View style={styles.actionRowFull}>
          <TouchableOpacity style={[styles.btnFull, styles.btnGreen]} onPress={() => onJoin(session.meeting_link)}>
            <Ionicons name="videocam" size={18} color="#fff" style={{marginRight:4}}/>
            <AppText style={styles.textWhite}>Join Meeting</AppText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btnFull, styles.btnPrimary]} onPress={() => onEvaluate(session.id, 'edit')}>
            <AppText style={styles.textWhite}>Evaluate</AppText>
          </TouchableOpacity>
        </View>
      )}

      {/* 4. POST MEETING STATE */}
      {uiState === 'POST' && (
        <View style={styles.actionRowFull}>
          <TouchableOpacity 
            style={[styles.btnFull, session.status === 'completed' ? styles.btnSecondary : styles.btnPrimary]} 
            onPress={() => onEvaluate(session.id, session.status === 'completed' ? 'read' : 'edit')}
          >
            <AppText style={session.status === 'completed' ? styles.textPrimary : styles.textWhite}>
              {session.status === 'completed' ? 'View Evaluation' : 'Submit Evaluation'}
            </AppText>
          </TouchableOpacity>
        </View>
      )}
    </Card>
  );
};

// Helper for the Status Badge
const Badge = ({ state }: { state: string }) => {
  let bg = '#E5E7EB'; let text = '#374151'; let label = state;
  if(state === 'APPROVAL') { bg = '#FEF3C7'; text = '#B45309'; label = 'Needs Approval'; }
  if(state === 'SCHEDULED') { bg = '#DBEAFE'; text = '#1E40AF'; label = 'Scheduled'; }
  if(state === 'JOIN') { bg = '#D1FAE5'; text = '#047857'; label = 'Join Now'; }
  if(state === 'POST') { bg = '#F3F4F6'; text = '#6B7280'; label = 'Finished'; }
  
  return (
    <View style={{ backgroundColor: bg, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
      <AppText style={{ color: text, fontSize: 10, fontWeight: '700', textTransform: 'uppercase' }}>{label}</AppText>
    </View>
  );
};


// --- MAIN SCREEN ---
export default function MentorBookingsScreen() {
  const { user } = useAuthStore();
  const router = useRouter();
  
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({ upcoming: 0, completed: 0, earnings: 0 });

  // Modal States
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [detailContent, setDetailContent] = useState("");
  
  const [rescheduleModalVisible, setRescheduleModalVisible] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [newDate, setNewDate] = useState(new Date());

 const fetchSessions = async () => {
  if (!user) return;
  console.log('[MentorBookings] fetchSessions start for mentor:', user.id);

  try {
    // 1) Get sessions + package (with interview_profile_id) + candidate title
    const { data, error } = await supabase
      .from('interview_sessions')
      .select(`
        id,
        scheduled_at,
        status,
        round,
        meeting_link,
        package:interview_packages!package_id (
          id,
          mentor_payout_inr,
          interview_profile_id
        ),
        candidate:candidates!candidate_id (
          professional_title
        )
      `)
      .eq('mentor_id', user.id)
      .order('scheduled_at', { ascending: true });

    if (error) {
      console.error('[MentorBookings] fetchSessions query error:', error);
      throw error;
    }

    const rawSessions = data || [];
    console.log(
      '[MentorBookings] rawSessions:',
      rawSessions.map((s: any) => ({
        id: s.id,
        status: s.status,
        scheduled_at: s.scheduled_at,
        interview_profile_id: s.package?.interview_profile_id,
      }))
    );

    // 2) Collect unique interview_profile_ids from packages
    const profileIds = Array.from(
      new Set(
        rawSessions
          .map((s: any) => s.package?.interview_profile_id)
          .filter((id: any) => id != null)
      )
    );

    let profileMap: Record<string, { name: string; description: string | null }> = {};

    if (profileIds.length > 0) {
      // 3) Fetch interview_profiles_admin rows for those IDs
      const { data: profiles, error: profileError } = await supabase
        .from('interview_profiles_admin')
        .select('id, name, description')
        .in('id', profileIds);

      if (profileError) {
        console.error('[MentorBookings] Error loading interview profiles:', profileError);
      } else if (profiles) {
        profileMap = Object.fromEntries(
          profiles.map((p: any) => [
            String(p.id),
            { name: p.name, description: p.description ?? null },
          ])
        );
      }
    }

    // 4) Enrich sessions with interview_profile_name + description
    const enrichedSessions = rawSessions.map((s: any) => {
      const profileId = s.package?.interview_profile_id;
      const profileMeta =
        profileId != null ? profileMap[String(profileId)] ?? null : null;

      return {
        ...s,
        package: s.package
          ? {
              ...s.package,
              ...(profileMeta
                ? {
                    interview_profile_name: profileMeta.name,
                    interview_profile_description: profileMeta.description,
                  }
                : {
                    interview_profile_name: null,
                    interview_profile_description: null,
                  }),
            }
          : null,
      };
    });

    console.log(
      '[MentorBookings] enrichedSessions (first 5):',
      enrichedSessions.slice(0, 5).map((s: any) => ({
        id: s.id,
        status: s.status,
        profileName: s.package?.interview_profile_name,
      }))
    );

    setSessions(enrichedSessions);

    // 5) Calculate Stats
    let upcoming = 0;
    let completed = 0;
    let earnings = 0;

    enrichedSessions.forEach((s: any) => {
      if (s.status === 'confirmed') {
        upcoming++;
      }

      if (s.status === 'completed') {
        completed++;

        if (s.package?.mentor_payout_inr) {
          earnings += s.package.mentor_payout_inr * 1.2;
        }
      }
    });

    console.log('[MentorBookings] FINAL STATS:', {
      upcoming,
      completed,
      earnings,
    });

    setStats({ upcoming, completed, earnings });

  } catch (err: any) {
    console.error('Error loading mentor bookings:', {
      message: err?.message,
      details: err?.details,
      hint: err?.hint,
      code: err?.code,
    });
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};



  useEffect(() => { fetchSessions(); }, [user]);
  const onRefresh = () => { setRefreshing(true); fetchSessions(); };

  // --- ACTIONS ---

  const handleAccept = async (id: string) => {
    console.log('[handleAccept] DIRECT accept for ID:', id);

    try {
      console.log('[handleAccept] Sending Supabase update:', {
        id,
        newStatus: 'confirmed',
      });

      const { data, error } = await supabase
        .from('interview_sessions')
        .update({ status: 'confirmed' })
        .eq('id', id)
        .select('id, status, scheduled_at')
        .single();

      console.log('[handleAccept] Supabase raw result:', { data, error });

      if (error) {
        console.error('[handleAccept] Supabase UPDATE error:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        Alert.alert('Error', error.message || 'Could not accept this interview.');
        return;
      }

      console.log('[handleAccept] SUCCESS — updated row:', data);
      Alert.alert('Accepted', 'This interview has been confirmed.');

      console.log('[handleAccept] Calling fetchSessions() after accept...');
      fetchSessions();
    } catch (e: any) {
      console.error('[handleAccept] Unexpected error:', e);
      Alert.alert('Error', e?.message || 'Unexpected error while accepting.');
    }
  };

  const handleRescheduleStart = (session: any) => {
    setSelectedSession(session);
    setNewDate(new Date(session.scheduled_at));
    setRescheduleModalVisible(true);
  };

  const handleRescheduleConfirm = async () => {
    if (!selectedSession) return;
    const { error } = await supabase
        .from('interview_sessions')
        .update({ status: 'scheduled', scheduled_at: newDate.toISOString() })
        .eq('id', selectedSession.id);
    
    setRescheduleModalVisible(false);
    if (!error) {
        Alert.alert("Success", "Meeting rescheduled and confirmed.");
        fetchSessions();
    } else {
        Alert.alert("Error", "Failed to reschedule.");
    }
  };

  const handleJoin = (link: string) => {
    if (!link) return Alert.alert("No Link", "Meeting link is not ready yet.");
    Linking.openURL(link).catch(() => Alert.alert("Error", "Could not open link."));
  };

  const handleViewDetails = (details: string) => {
    console.log('[MentorBookings] handleViewDetails called with:', details);
    setDetailContent(details);
    setDetailModalVisible(true);
  };

  const handleEvaluate = (sessionId: string, mode: 'edit' | 'read') => {
    router.push({ pathname: `/mentor/session/${sessionId}`, params: { mode } });
  };

  if (loading) return <View style={styles.loadingContainer}><ActivityIndicator size="large" color={theme.colors.primary} /></View>;

  return (
    <ScreenBackground style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        
        {/* Header */}
        <Section style={styles.header}>
          <Heading level={1} style={{textAlign: 'center'}}>Mentor Dashboard</Heading>
          <AppText style={styles.headerSub}>Manage your upcoming interviews</AppText>
        </Section>

        {/* Stats Grid */}
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
            <AppText style={{marginBottom: 20}}>Select a new date and time for this candidate.</AppText>
            
            <View style={{alignItems:'center', marginBottom: 20}}>
              <DateTimePicker
                value={newDate}
                mode="datetime"
                display="spinner"
                onChange={(e, date) => date && setNewDate(date)}
                textColor="black"
              />
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
  
  // Stats
  statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: { flex: 1, alignItems: 'center', padding: 16, borderRadius: 16, backgroundColor: '#FFF', borderWidth: 1, borderColor: theme.colors.border },
  earningsCard: { backgroundColor: theme.colors.primary, borderWidth: 0 },
  statValue: { fontSize: 20, fontWeight: '700', color: theme.colors.text.main, marginTop: 8 },
  statLabel: { fontSize: 12, color: theme.colors.text.light },

  // Availability Btn
  availabilityBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0E9384', paddingVertical: 14, borderRadius: 12, marginBottom: 24, gap: 8 },
  availabilityBtnText: { color: '#FFF', fontSize: 16, fontWeight: '600' },

  divider: { height: 1, backgroundColor: theme.colors.border, marginBottom: 24 },
  sectionTitle: { marginBottom: 16 },
  list: { gap: 16 },
  emptyState: { alignItems: 'center', marginTop: 40 },
  emptyText: { marginTop: 16, fontSize: 16, fontWeight: '600', color: theme.colors.text.main },

  // --- CARD STYLES ---
  sessionCard: { padding: 16, borderRadius: 16, backgroundColor: '#FFF', borderWidth: 1, borderColor: theme.colors.border },
  
  // Split Layout
  splitContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  leftSection: { flex: 1, paddingRight: 12 },
  rightSection: { paddingTop: 2 },
  
  // Card Content
  cardTitle: { fontSize: 16, fontWeight: '700', color: theme.colors.text.main, marginBottom: 12, lineHeight: 22 },
  
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  infoText: { fontSize: 13, color: '#6B7280', fontWeight: '500' },
  
  payoutRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  payoutText: { fontSize: 14, fontWeight: '700', color: '#059669' },
  platformFee: { fontSize: 11, color: '#9CA3AF', fontStyle: 'italic' },
  
  cardDivider: { height: 1, backgroundColor: theme.colors.border, marginBottom: 12 },
  
  // Action Rows
  actionRowFull: { flexDirection: 'row', gap: 10, justifyContent: 'space-between' },
  actionRow: { flexDirection: 'row', gap: 12, justifyContent: 'space-between', marginTop: 16 },
  
  // Buttons - Full Width
  btnFull: { flex: 1, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  btnPrimary: { backgroundColor: theme.colors.primary },
  btnSecondary: { backgroundColor: '#eff6ff' },
  btnGreen: { backgroundColor: '#059669' },
  btnOutline: { borderWidth: 1, borderColor: theme.colors.primary, backgroundColor: 'transparent' },
  btnDisabled: { backgroundColor: '#f3f4f6' },

  // Text inside buttons
  textWhite: { color: '#fff', fontWeight: '600', fontSize: 13 },
  textPrimary: { color: theme.colors.primary, fontWeight: '600', fontSize: 13 },
  textGray: { color: '#666', fontSize: 13 },

  // Modals
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', padding: 24, borderRadius: 16 },
  modalCloseBtn: { backgroundColor: theme.colors.primary, padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 10 },
});
