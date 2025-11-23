import React, { useEffect, useState } from 'react';
import { 
  View, ScrollView, StyleSheet, ActivityIndicator, 
  TouchableOpacity, RefreshControl, StatusBar, Alert, Linking, Platform
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

  const fetchSessions = async () => {
    if (!user) return;
    console.log("Fetching mentor sessions...");

    try {
      // 1. Fetch Sessions linked to this Mentor
      const { data, error } = await supabase
        .from('interview_sessions')
        .select(`
          id,
          scheduled_at,
          status,
          round,
          meeting_link, 
          package:interview_packages (
            total_amount_inr,
            mentor_payout_inr
          ),
          candidate:candidates (
            profile:profiles ( full_name, email )
          )
        `)
        .eq('mentor_id', user.id)
        // 🎯 FIX: Sort by Created Date (Newest First) to find your test booking
        .order('created_at', { ascending: false });

      if (error) throw error;

      const rawSessions = data || [];
      setSessions(rawSessions);

      // 2. Calculate Stats
      let upcoming = 0;
      let completed = 0;
      let earnings = 0;

      rawSessions.forEach(s => {
        if (s.status === 'scheduled' || s.status === 'confirmed') upcoming++;
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

  // Join Meeting Function
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'scheduled':
      case 'confirmed': 
        return { bg: '#ECFDF5', text: '#059669', icon: 'videocam' };
      case 'completed': 
        return { bg: '#F3F4F6', text: '#6B7280', icon: 'checkmark-circle' };
      case 'cancelled': 
        return { bg: '#FEF2F2', text: '#DC2626', icon: 'close-circle' };
      default: 
        return { bg: '#FFF7ED', text: '#D97706', icon: 'time' };
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

        {/* --- NEW BUTTON: Manage Availability --- */}
        <TouchableOpacity 
          style={styles.availabilityBtn}
          onPress={() => router.push('/mentor/availability')}
        >
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
            {sessions.map((session) => {
              const date = DateTime.fromISO(session.scheduled_at);
              const config = getStatusStyle(session.status);
              const candidateName = session.candidate?.profile?.full_name || 'Candidate';
              const isActionable = session.status === 'confirmed' || session.status === 'scheduled';
              const isCompleted = session.status === 'completed';

              return (
                <Card key={session.id} style={styles.sessionCard}>
                  <View style={styles.dateBox}>
                    <AppText style={styles.dateMonth}>{date.toFormat('MMM')}</AppText>
                    <AppText style={styles.dateDay}>{date.toFormat('dd')}</AppText>
                  </View>

                  <View style={styles.infoCol}>
                    <View style={styles.row}>
                      <AppText style={styles.timeText}>
                        {date.toFormat('h:mm a')} • {date.toFormat('cccc')}
                      </AppText>
                      <View style={[styles.statusChip, { backgroundColor: config.bg }]}>
                        <AppText style={[styles.statusText, { color: config.text }]}>
                          {session.status}
                        </AppText>
                      </View>
                    </View>

                    <Heading level={4} style={styles.candidateName}>
                      {candidateName}
                    </Heading>
                    
                    <AppText style={styles.roundName}>
                      {session.round ? session.round.replace('_', ' ') : 'Interview'}
                    </AppText>

                    <View style={styles.actionRow}>
                        {isActionable && (
                        <TouchableOpacity 
                            style={styles.joinBtn}
                            onPress={() => handleJoin(session.meeting_link)}
                        >
                            <Ionicons name="videocam" size={16} color="#FFF" />
                            <AppText style={styles.joinBtnText}>Start Call</AppText>
                        </TouchableOpacity>
                        )}

                        <TouchableOpacity 
                            style={[styles.evalBtn, isCompleted && styles.evalBtnCompleted]}
                            onPress={() => router.push(`/mentor/session/${session.id}`)}
                        >
                            <AppText style={[styles.evalBtnText, isCompleted && {color: '#6B7280'}]}>
                                {isCompleted ? 'View Feedback' : 'Evaluate'}
                            </AppText>
                            <Ionicons name="chevron-forward" size={16} color={isCompleted ? '#6B7280' : theme.colors.primary} />
                        </TouchableOpacity>
                    </View>

                  </View>
                </Card>
              );
            })}
          </View>
        )}
      </ScrollView>
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

  // --- NEW STYLES FOR AVAILABILITY BUTTON ---
  availabilityBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0E9384', // Primary color
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 24,
    gap: 8,
    // Optional shadow for depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  availabilityBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // ----------------------------------------

  divider: { height: 1, backgroundColor: theme.colors.border, marginBottom: 24 },
  sectionTitle: { marginBottom: 16 },

  list: { gap: 16 },
  sessionCard: { flexDirection: 'row', padding: 16, borderRadius: 16, backgroundColor: '#FFF', borderWidth: 1, borderColor: theme.colors.border },
  
  dateBox: { alignItems: 'center', justifyContent: 'center', paddingRight: 16, borderRightWidth: 1, borderRightColor: '#F3F4F6', marginRight: 16 },
  dateMonth: { fontSize: 12, fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase' },
  dateDay: { fontSize: 24, fontWeight: '700', color: theme.colors.text.main },

  infoCol: { flex: 1, gap: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  timeText: { fontSize: 13, color: theme.colors.text.light, fontWeight: '500' },
  
  statusChip: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  statusText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },

  candidateName: { fontSize: 16, fontWeight: '700', color: theme.colors.text.main },
  roundName: { fontSize: 13, color: theme.colors.text.body, marginBottom: 8 },

  actionRow: { flexDirection: 'row', gap: 10, marginTop: 8 },
  joinBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: theme.colors.primary, paddingVertical: 8, borderRadius: 8 },
  joinBtnText: { color: '#FFF', fontWeight: '600', fontSize: 13 },
  
  evalBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#EFF6FF', paddingVertical: 8, borderRadius: 8 },
  evalBtnCompleted: { backgroundColor: '#F3F4F6' },
  evalBtnText: { color: theme.colors.primary, fontWeight: '600', fontSize: 13 },

  emptyState: { alignItems: 'center', marginTop: 40 },
  emptyText: { marginTop: 16, fontSize: 16, fontWeight: '600', color: theme.colors.text.main },
  emptySub: { marginTop: 4, color: theme.colors.text.light },
});