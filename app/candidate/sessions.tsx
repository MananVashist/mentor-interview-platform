import React, { useEffect, useState } from 'react';
import { 
  View, StyleSheet, ScrollView, ActivityIndicator, 
  RefreshControl, TouchableOpacity, StatusBar 
} from 'react-native';
import { useRouter } from 'expo-router';
import { format, parseISO } from 'date-fns';

// Libs
import { supabase } from '@/lib/supabase/client';
import { theme } from '@/lib/theme';
import { Heading, AppText, Card, IconCalendar, IconClock } from '@/lib/ui';
import { useAuthStore } from '@/lib/store';

export default function MyBookingsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSessions = async () => {
    if (!user) {
        console.warn("⚠️ Debug: No user found in auth store.");
        return;
    }

    console.log("------------------------------------------------");
    console.log("🔍 DEBUG: Fetching Sessions for User:", user.id);
    
    try {
      // --- TEST 1: Simple Query (No Joins) ---
      // This checks if you can read the session table AT ALL.
      const { data: simpleData, error: simpleError } = await supabase
        .from('interview_sessions')
        .select('id, status, candidate_id')
        .eq('candidate_id', user.id);

      if (simpleError) {
          console.error("❌ TEST 1 FAILED (Simple Query):", simpleError);
      } else {
          console.log(`✅ TEST 1 SUCCESS: Found ${simpleData?.length} raw sessions.`);
          if (simpleData?.length === 0) {
              console.warn("   ⚠️ Warning: DB has rows, but query returned 0. RLS is likely blocking 'interview_sessions'.");
          }
      }

      // --- TEST 2: Full Query (With Joins) ---
      // This checks if you can see the Mentor details attached to the session.
      const { data, error } = await supabase
        .from('interview_sessions')
        .select(`
          id,
          scheduled_at,
          status,
          round,
          meeting_link,
          mentor:mentors (
            professional_title,
            profile:profiles ( full_name )
          )
        `)
        .eq('candidate_id', user.id)
        .order('scheduled_at', { ascending: true });

      if (error) {
        console.error("❌ TEST 2 FAILED (Full Query):", error);
        throw error;
      }

      console.log(`✅ TEST 2 SUCCESS: Retrieved ${data?.length} full records.`);
      
      if (simpleData?.length > 0 && data?.length === 0) {
          console.error("🚨 CRITICAL: Simple query worked, but Full query failed.");
          console.error("   This means RLS is blocking access to 'mentors' or 'profiles' table.");
      }

      setSessions(data || []);
    } catch (err: any) {
      console.error('🔥 Fatal Error:', err.message);
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return { bg: '#ECFDF5', text: '#059669' }; // Green
      case 'completed': return { bg: '#F3F4F6', text: '#6B7280' }; // Gray
      case 'cancelled': return { bg: '#FEF2F2', text: '#DC2626' }; // Red
      default: return { bg: '#FFF7ED', text: '#D97706' }; // Orange (Pending)
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        
        <View style={styles.header}>
          <Heading level={1} style={styles.pageTitle}>My Bookings</Heading>
          <AppText style={styles.pageSubtitle}>Manage your upcoming interviews.</AppText>
        </View>

        {sessions.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <IconCalendar size={48} color="#9CA3AF" />
            </View>
            <Heading level={3}>No sessions yet</Heading>
            <AppText style={styles.emptyText}>
              You haven't booked any mock interviews yet.
            </AppText>
            <TouchableOpacity 
              style={styles.browseBtn}
              onPress={() => router.push('/candidate')} 
            >
              <AppText style={styles.browseBtnText}>Find a Mentor</AppText>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.list}>
            {sessions.map((session) => {
              let date: Date;
              let isValidDate = false;
              
              try {
                date = parseISO(session.scheduled_at);
                isValidDate = !isNaN(date.getTime());
              } catch {
                date = new Date();
                isValidDate = false;
              }
              
              const statusStyle = getStatusColor(session.status);
              
              // Safe Access to Mentor Data
              const mentorName = session.mentor?.profile?.full_name || 'Unknown Mentor';
              const mentorTitle = session.mentor?.professional_title || 'Interviewer';

              return (
                <Card key={session.id} style={styles.sessionCard}>
                  {/* Date Badge */}
                  <View style={styles.dateBadge}>
                    <AppText style={styles.dateMonth}>
                      {isValidDate ? format(date, 'MMM') : '??'}
                    </AppText>
                    <AppText style={styles.dateDay}>
                      {isValidDate ? format(date, 'dd') : '--'}
                    </AppText>
                  </View>

                  {/* Content */}
                  <View style={styles.cardContent}>
                    <AppText style={styles.roundText}>
                      {session.round ? session.round.replace('_', ' ').toUpperCase() : 'SESSION'}
                    </AppText>
                    <Heading level={4} style={styles.mentorName}>{mentorName}</Heading>
                    <AppText style={styles.mentorTitle}>{mentorTitle}</AppText>
                    
                    <View style={styles.timeRow}>
                      <IconClock size={14} color="#6B7280" />
                      <AppText style={styles.timeText}>
                        {isValidDate ? format(date, 'EEEE, h:mm a') : 'Date Invalid'}
                      </AppText>
                    </View>
                  </View>

                  {/* Status */}
                  <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                    <AppText style={[styles.statusText, { color: statusStyle.text }]}>
                      {session.status}
                    </AppText>
                  </View>
                </Card>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  
  header: { marginBottom: 24 },
  pageTitle: { fontSize: 28, marginBottom: 4 },
  pageSubtitle: { fontSize: 15, color: theme.colors.text.body },

  list: { gap: 16 },
  
  sessionCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 16,
  },
  
  dateBadge: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateMonth: { fontSize: 12, fontWeight: '700', color: '#6B7280', textTransform: 'uppercase' },
  dateDay: { fontSize: 20, fontWeight: '800', color: '#111827' },

  cardContent: { flex: 1 },
  roundText: { fontSize: 10, fontWeight: '700', color: theme.colors.primary, marginBottom: 4, letterSpacing: 0.5 },
  mentorName: { fontSize: 16, fontWeight: '700', color: '#111827' },
  mentorTitle: { fontSize: 12, color: '#6B7280', marginBottom: 8 },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timeText: { fontSize: 13, color: '#4B5563', fontWeight: '500' },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  statusText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },

  emptyState: { alignItems: 'center', marginTop: 60 },
  emptyIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  emptyText: { textAlign: 'center', color: '#6B7280', marginTop: 8, marginBottom: 24 },
  browseBtn: { backgroundColor: theme.colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  browseBtnText: { color: '#FFF', fontWeight: '600' },
});