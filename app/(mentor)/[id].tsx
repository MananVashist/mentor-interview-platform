// app/mentor/[id].tsx
import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const SUPABASE_URL = 'https://rcbaaiiawrglvyzmawvr.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjYmFhaWlhd3JnbHZ5em1hd3ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNTA1NjAsImV4cCI6MjA3NjcyNjU2MH0.V3qRHGXBMlspRS7XFJlXdo4qIcCms60Nepp7dYMEjLA';

export default function MentorDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [mentor, setMentor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      try {
        const url =
          `${SUPABASE_URL}/rest/v1/mentors` +
          `?id=eq.${id}` +
          `&select=*,profile:profiles(*)`;
        const res = await fetch(url, {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
        });
        const text = await res.text();
        if (res.ok) {
          const arr = JSON.parse(text);
          setMentor(arr[0] ?? null);
        } else {
          console.log('[mentor detail] fail', res.status, text);
          setMentor(null);
        }
      } catch (e) {
        console.log('[mentor detail] error', e);
        setMentor(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={{ marginTop: 8, color: '#6b7280' }}>Loading mentor…</Text>
      </View>
    );
  }

  if (!mentor) {
    return (
      <View style={styles.center}>
        <Text style={{ color: '#ef4444', fontWeight: '600' }}>Mentor not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {mentor.profile?.full_name?.charAt(0)?.toUpperCase() || 'M'}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{mentor.profile?.full_name}</Text>
          <Text style={styles.email}>{mentor.profile?.email}</Text>
          <Text style={styles.level}>
            {(mentor.mentor_level || 'bronze').toUpperCase()} mentor
          </Text>
        </View>
      </View>

      {mentor.bio ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.sectionText}>{mentor.bio}</Text>
        </View>
      ) : null}

      {mentor.expertise_profiles?.length ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interview Profiles</Text>
          <View style={styles.tags}>
            {mentor.expertise_profiles.map((p: string) => (
              <View key={p} style={styles.tag}>
                <Text style={styles.tagText}>{p}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Price</Text>
        <Text style={styles.price}>
          ₹{(mentor.session_price_inr || 0).toLocaleString('en-IN')}/session
        </Text>
      </View>

      <TouchableOpacity
        style={styles.primaryBtn}
        onPress={() => router.push('/(candidate)/bookings')}
      >
        <Text style={styles.primaryBtnText}>Book this mentor</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  name: { fontSize: 18, fontWeight: '700', color: '#111827' },
  email: { fontSize: 12, color: '#6b7280', marginBottom: 4 },
  level: { fontSize: 12, color: '#2563eb', fontWeight: '600' },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: { fontWeight: '600', marginBottom: 6, color: '#111827' },
  sectionText: { color: '#4b5563' },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: { color: '#1e40af', fontWeight: '500' },
  price: { fontSize: 18, fontWeight: '700', color: '#111827' },
  primaryBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 40,
  },
  primaryBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  backBtn: {
    marginTop: 16,
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backBtnText: { color: '#111827' },
});
