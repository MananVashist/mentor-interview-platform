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
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase/client'; 
import { useAuth } from '../../hooks/useAuth';
import { useRouter, useNavigation } from 'expo-router';

export default function BookingsScreen() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const navigation = useNavigation();
  
  const [sessions, setSessions] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

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
        .select('*')
        .eq('candidate_id', user?.id)
        // 🎯 FIX: Sort by 'created_at' Descending (Newest bookings first)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!sessionsData || sessionsData.length === 0) {
          setSessions([]);
          return;
      }

      // Manual Join for Mentor Name
      const mentorIds = [...new Set(sessionsData.map(s => s.mentor_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', mentorIds);
      
      const profileMap = (profiles || []).reduce((acc: any, p: any) => {
          acc[p.id] = p; return acc;
      }, {});

      const merged = sessionsData.map(s => ({
          ...s,
          mentor_name: profileMap[s.mentor_id]?.full_name || 'Mentor'
      }));

      setSessions(merged);
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

  const renderSession = ({ item }: { item: any }) => {
    const date = new Date(item.scheduled_at);
    const dateStr = date.toLocaleDateString();
    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const statusDisplay = item.status ? item.status.toUpperCase() : 'PENDING';
    const isConfirmed = item.status === 'confirmed';

    return (
      <View style={styles.card}>
        <View style={styles.headerRow}>
            <View>
                <Text style={styles.mentorName}>{item.mentor_name}</Text>
                <Text style={styles.role}>Mock Interview</Text>
            </View>
            <View style={[styles.badge, isConfirmed ? styles.bgGreen : styles.bgGray]}>
                <Text style={[styles.badgeText, isConfirmed ? styles.textGreen : styles.textGray]}>
                    {statusDisplay}
                </Text>
            </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
            <Ionicons name="calendar" size={16} color="#666" />
            <Text style={styles.detailText}>{dateStr} • {timeStr}</Text>
        </View>
        {isConfirmed && (
          <TouchableOpacity 
            style={styles.joinButton} 
            onPress={() => handleJoin(item.meeting_link)}
          >
            <Ionicons name="videocam" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.joinButtonText}>Join Jitsi Meet</Text>
          </TouchableOpacity>
        )}
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
                </View>
            }
        />
      )}
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
  
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, elevation: 2 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  mentorName: { fontSize: 18, fontWeight: '700' },
  role: { color: '#6B7280', fontSize: 12 },
  
  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  detailText: { color: '#374151', fontSize: 14 },
  
  joinButton: { 
      backgroundColor: '#2563eb', 
      padding: 12, 
      borderRadius: 8, 
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'center' 
  },
  joinButtonText: { color: '#fff', fontWeight: 'bold' },
  emptyText: { textAlign: 'center', color: '#6B7280', fontSize: 16 },

  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  bgGreen: { backgroundColor: '#D1FAE5' },
  bgGray: { backgroundColor: '#F3F4F6' },
  badgeText: { fontSize: 10, fontWeight: '700' },
  textGreen: { color: '#059669' },
  textGray: { color: '#6B7280' },
});