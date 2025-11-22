import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { supabase } from '@/lib/supabase/client';
import { Ionicons } from '@expo/vector-icons';

export default function AdminOverview() {
  const [stats, setStats] = useState({
    mentors: 0,
    candidates: 0,
    bookings: 0,
    pending_mentors: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const { count: mentorCount } = await supabase.from('mentors').select('*', { count: 'exact', head: true });
      const { count: candidateCount } = await supabase.from('candidates').select('*', { count: 'exact', head: true });
      const { count: bookingCount } = await supabase.from('interview_sessions').select('*', { count: 'exact', head: true });
      const { count: pendingCount } = await supabase.from('mentors').select('*', { count: 'exact', head: true }).eq('status', 'pending');

      setStats({
        mentors: mentorCount || 0,
        candidates: candidateCount || 0,
        bookings: bookingCount || 0,
        pending_mentors: pendingCount || 0
      });

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#2563eb" style={{marginTop: 50}} />;

  const StatCard = ({ label, value, icon, color }: any) => (
    <View style={styles.card}>
      <View style={[styles.iconCircle, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Platform Overview</Text>
      
      <View style={styles.grid}>
        <StatCard label="Total Mentors" value={stats.mentors} icon="people" color="#2563eb" />
        <StatCard label="Total Candidates" value={stats.candidates} icon="school" color="#059669" />
        <StatCard label="Total Bookings" value={stats.bookings} icon="calendar" color="#D97706" />
        <StatCard label="Pending Approvals" value={stats.pending_mentors} icon="hourglass" color="#DB2777" />
      </View>

      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={20} color="#64748b" />
        <Text style={styles.infoText}>
            Welcome Admin! Use the sidebar to manage approvals and job profiles.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#1e293b', marginBottom: 24 },
  grid: { flexDirection: 'row', gap: 16, flexWrap: 'wrap' },
  card: { flex: 1, minWidth: 200, backgroundColor: '#fff', padding: 24, borderRadius: 16, flexDirection: 'row', alignItems: 'center', gap: 16, shadowColor: '#000', shadowOpacity: 0.05, elevation: 2 },
  iconCircle: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  statValue: { fontSize: 24, fontWeight: '800', color: '#1e293b' },
  statLabel: { fontSize: 14, color: '#64748b', fontWeight: '500' },
  infoBox: { marginTop: 30, flexDirection: 'row', gap: 8, padding: 16, backgroundColor: '#e2e8f0', borderRadius: 8, alignItems: 'center' },
  infoText: { color: '#475569' }
});