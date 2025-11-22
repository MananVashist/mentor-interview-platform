import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, StatusBar } from 'react-native';
import { supabase } from '@/lib/supabase/client';
import { Ionicons } from '@expo/vector-icons';

export default function ApprovalsScreen() {
  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingMentors();
  }, []);

  const fetchPendingMentors = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('mentors')
      .select('*, profile:profiles(full_name, email, phone)')
      .eq('status', 'pending');

    if (error) console.error(error);
    setMentors(data || []);
    setLoading(false);
  };

  const updateStatus = async (mentorId: string, newStatus: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from('mentors')
      .update({ status: newStatus })
      .eq('id', mentorId);

    if (error) {
      Alert.alert("Error", "Failed to update status");
    } else {
      Alert.alert("Success", `Mentor ${newStatus}!`);
      fetchPendingMentors(); 
    }
  };

  const renderMentor = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.name}>{item.profile?.full_name || 'Unknown'}</Text>
        <View style={styles.pendingBadge}>
            <Text style={styles.statusText}>PENDING</Text>
        </View>
      </View>
      
      <View style={styles.infoBox}>
        <Text style={styles.detail}>📧 {item.profile?.email}</Text>
        <Text style={styles.detail}>📱 {item.profile?.phone || 'No Phone'}</Text>
        <Text style={styles.detail}>💼 {item.professional_title || 'No Title'}</Text>
        <Text style={styles.detail}>⭐ {item.years_of_experience || 0} Years Exp</Text>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity 
          style={[styles.btn, styles.rejectBtn]} 
          onPress={() => updateStatus(item.id, 'rejected')}
        >
          <Ionicons name="close-circle" size={20} color="#fff" />
          <Text style={styles.btnText}>Reject</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.btn, styles.approveBtn]} 
          onPress={() => updateStatus(item.id, 'approved')}
        >
          <Ionicons name="checkmark-circle" size={20} color="#fff" />
          <Text style={styles.btnText}>Approve</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.headerTitle}>Pending Approvals</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" style={{marginTop: 50}} />
      ) : (
        <FlatList
          data={mentors}
          renderItem={renderMentor}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 50 }}
          ListEmptyComponent={
            <View style={styles.emptyState}>
                <Ionicons name="checkmark-done-circle-outline" size={64} color="#10B981" />
                <Text style={styles.empty}>All caught up!</Text>
                <Text style={styles.emptySub}>No pending mentor requests.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#1e293b', marginBottom: 24 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, alignItems: 'center' },
  name: { fontSize: 20, fontWeight: '700', color: '#1F2937' },
  pendingBadge: { backgroundColor: '#FFF7ED', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 12, fontWeight: '800', color: '#D97706' },
  infoBox: { gap: 6, marginBottom: 16 },
  detail: { fontSize: 15, color: '#4B5563' },
  actionRow: { flexDirection: 'row', gap: 12 },
  btn: { flex: 1, padding: 14, borderRadius: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 },
  approveBtn: { backgroundColor: '#059669' },
  rejectBtn: { backgroundColor: '#EF4444' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  emptyState: { alignItems: 'center', marginTop: 60 },
  empty: { textAlign: 'center', marginTop: 16, color: '#111827', fontSize: 20, fontWeight: '700' },
  emptySub: { color: '#6B7280', marginTop: 8 }
});