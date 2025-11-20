import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppText, Heading } from '@/lib/ui';
import { paymentService } from '@/services/payment.service';

export default function PGScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const { orderId, amount, packageId } = params;
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async (status: 'success' | 'failure') => {
    setIsProcessing(true);
    
    // Simulate Network Delay (2 seconds)
    setTimeout(async () => {
      if (status === 'success') {
        try {
          // Verify in DB
          await paymentService.verifyPayment(
            packageId as string, 
            orderId as string, 
            'pay_mock_123', 
            'sig_mock_123'
          );
          
          // Go to Success Page
          router.replace({
            pathname: '/candidate/booking-confirmed',
            params: { bookingId: orderId }
          });
        } catch (e) {
          console.error(e);
          alert('Verification Failed');
          setIsProcessing(false);
        }
      } else {
        alert('Payment Cancelled');
        router.back();
      }
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logo}>
          <Ionicons name="wallet" size={24} color="#FFF" />
        </View>
        <View>
          <AppText style={styles.merchant}>Mentor Platform</AppText>
          <AppText style={styles.orderId}>Order #{orderId?.slice(0, 8)}</AppText>
        </View>
        <AppText style={styles.amount}>₹{amount}</AppText>
      </View>

      {/* Payment Options */}
      <View style={styles.card}>
        <Heading level={3} style={{ marginBottom: 16 }}>Select Payment Method</Heading>
        
        {['UPI', 'Card', 'Netbanking'].map((method, i) => (
          <TouchableOpacity 
            key={method}
            style={styles.option} 
            onPress={() => handlePayment('success')}
            disabled={isProcessing}
          >
            <View style={styles.iconBox}>
              <Ionicons name={i===0 ? "qr-code" : i===1 ? "card" : "globe"} size={20} color="#374151" />
            </View>
            <AppText style={styles.optionText}>{method}</AppText>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Cancel */}
      <TouchableOpacity onPress={() => handlePayment('failure')} style={styles.cancelBtn}>
        <AppText style={{ color: '#6B7280', fontWeight: '600' }}>Cancel Payment</AppText>
      </TouchableOpacity>

      {/* Loading Overlay */}
      {isProcessing && (
        <View style={styles.overlay}>
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#2563EB" />
            <AppText style={{ marginTop: 12, fontWeight: '600' }}>Processing...</AppText>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { backgroundColor: '#111827', padding: 24, flexDirection: 'row', alignItems: 'center', gap: 12 },
  logo: { width: 40, height: 40, backgroundColor: '#374151', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  merchant: { color: '#FFF', fontWeight: '700' },
  orderId: { color: '#9CA3AF', fontSize: 12 },
  amount: { color: '#FFF', fontSize: 18, fontWeight: '700', marginLeft: 'auto' },
  
  card: { backgroundColor: '#FFF', margin: 16, borderRadius: 12, padding: 16, elevation: 2 },
  option: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderColor: '#F3F4F6', gap: 12 },
  iconBox: { width: 40, height: 40, backgroundColor: '#F3F4F6', borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  optionText: { flex: 1, fontSize: 16, fontWeight: '500', color: '#111827' },
  
  cancelBtn: { alignItems: 'center', padding: 16 },
  
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' },
  loader: { backgroundColor: '#FFF', padding: 24, borderRadius: 16, alignItems: 'center' }
});