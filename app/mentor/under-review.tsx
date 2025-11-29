import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/lib/store';

export default function UnderReviewScreen() {
  const router = useRouter();
  const { clear } = useAuthStore();

  const handleLogout = async () => {
    await authService.signOut();
    clear();
    router.replace('/auth/sign-in');
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Ionicons name="hourglass-outline" size={48} color="#D97706" />
        </View>
        
        <Text style={styles.title}>Profile Under Review</Text>
        
        <Text style={styles.text}>
          Thanks for signing up! Your mentor profile is currently being reviewed by the CrackJobs admin team.
        </Text>

        <Text style={styles.text}>
          We screen all mentors to ensure quality. We will contact you via phone/email shortly for a quick verification.
        </Text>

        <View style={styles.helpBox}>
          <Text style={styles.helpText}>Questions?</Text>
          <TouchableOpacity onPress={() => Linking.openURL('mailto:crackjobshelpdesk@gmail.com')}>
            <Text style={styles.emailLink}>crackjobshelpdesk@gmail.com</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', justifyContent: 'center', padding: 20 },
  card: { backgroundColor: '#fff', padding: 32, borderRadius: 16, alignItems: 'center', elevation: 2 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FFF7ED', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 16 },
  text: { fontSize: 16, color: '#4B5563', textAlign: 'center', marginBottom: 12, lineHeight: 24 },
  helpBox: { marginTop: 24, padding: 16, backgroundColor: '#F3F4F6', borderRadius: 8, width: '100%', alignItems: 'center' },
  helpText: { fontSize: 14, color: '#6B7280', marginBottom: 4 },
  emailLink: { fontSize: 16, color: '#2563eb', fontWeight: '600' },
  logoutBtn: { marginTop: 32, paddingVertical: 12, paddingHorizontal: 24 },
  logoutText: { color: '#EF4444', fontWeight: '600', fontSize: 16 }
});