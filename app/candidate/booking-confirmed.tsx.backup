import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppText, Heading, ScreenBackground } from '@/lib/ui';

export default function BookingConfirmedScreen() {
  const router = useRouter();
  const { bookingId } = useLocalSearchParams();

  return (
    <ScreenBackground style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark" size={48} color="#FFF" />
        </View>
        
        <Heading level={1} style={styles.title}>Booking Confirmed!</Heading>
        <AppText style={styles.subTitle}>
          Your sessions have been successfully scheduled. We've sent a confirmation email to your inbox.
        </AppText>

        <View style={styles.infoBox}>
          <AppText style={styles.label}>Booking Reference</AppText>
          <AppText style={styles.value}>{bookingId}</AppText>
        </View>

        <TouchableOpacity 
          style={styles.btn}
          onPress={() => router.replace('/candidate/sessions')} // Redirect to My Bookings
        >
          <AppText style={styles.btnText}>Go to My Bookings</AppText>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.outlineBtn}
          onPress={() => router.replace('/candidate')}
        >
          <AppText style={styles.outlineBtnText}>Back to Dashboard</AppText>
        </TouchableOpacity>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#FFF' },
  content: { alignItems: 'center', width: '100%', maxWidth: 400, alignSelf: 'center' },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#10B981', alignItems: 'center', justifyContent: 'center', marginBottom: 24, shadowColor: '#10B981', shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
  title: { fontSize: 24, marginBottom: 12, textAlign: 'center' },
  subTitle: { textAlign: 'center', color: '#6B7280', marginBottom: 32, lineHeight: 24 },
  
  infoBox: { backgroundColor: '#F9FAFB', padding: 16, borderRadius: 12, width: '100%', alignItems: 'center', marginBottom: 32, borderWidth: 1, borderColor: '#E5E7EB' },
  label: { fontSize: 12, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  value: { fontSize: 16, fontWeight: '700', color: '#111827' },
  
  btn: { backgroundColor: '#111827', width: '100%', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  btnText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
  outlineBtn: { padding: 16 },
  outlineBtnText: { color: '#4B5563', fontWeight: '600' }
});