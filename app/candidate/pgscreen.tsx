// app/candidate/pgscreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { paymentService } from '../../services/payment.service';

export default function PGScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const { orderId, packageId, keyId, amount } = params as {
    orderId?: string;
    packageId?: string;
    keyId?: string;
    amount?: string;
  };

  const [sdkReady, setSdkReady] = useState(false);
  const hasRun = useRef(false);

  useEffect(() => {
    console.log('[PGScreen] Params:', params);

    if (!packageId || !keyId || !amount) {
      Alert.alert('Error', 'Missing payment details.');
      router.back();
      return;
    }

    if (Platform.OS === 'web') {
      loadRazorpayScript().then(() => setSdkReady(true));
    } else {
      setSdkReady(true);
    }
  }, []);

  useEffect(() => {
    if (sdkReady && !hasRun.current) {
      hasRun.current = true;
      openCheckout();
    }
  }, [sdkReady]);

  const openCheckout = () => {
    const amountPaise = Number(amount);

    if (Platform.OS === 'web') {
      // 🟢 WEB CONFIGURATION
      const options: any = {
        key: keyId,
        order_id: orderId, // ✅ Razorpay fetches amount/currency from Order ID
        
        name: 'CrackJobs',
        description: 'Mock Interview Session',
        theme: { color: '#0E9384' },
        
        // ❌ REMOVED 'prefill' block entirely. 
        // Sending { contact: '' } causes a 400 Bad Request because '' is not a valid phone number.
        // Only add 'prefill' if you have actual data (e.g. user.email).

        handler: handleSuccess,
        modal: {
            ondismiss: () => {
                console.log('Checkout dismissed');
                hasRun.current = false;
            }
        },
        retry: { enabled: false }
      };

      console.log('[PGScreen][WEB] Opening options:', options);

      const rzp = new (window as any).Razorpay(options);

      rzp.on('payment.failed', (resp: any) => {
        console.error('[PGScreen][WEB] payment.failed:', resp);
        Alert.alert('Payment Failed', resp.error?.description || 'Payment failed');
      });

      rzp.open();
      return;
    }

    // 🟢 NATIVE CONFIGURATION (React Native)
    const RazorpayCheckout = require('react-native-razorpay').default;
    
    const rnOptions: any = {
      key: keyId,
      order_id: orderId,
      amount: amountPaise, 
      currency: 'INR',
      name: 'CrackJobs',
      description: 'Mock Interview Session',
      theme: { color: '#0E9384' },
      retry: { enabled: false },
    };

    RazorpayCheckout.open(rnOptions)
      .then(handleSuccess)
      .catch((err: any) => {
        console.log('[PGScreen][RN] Error:', err);
        if (err.code === 0 || err.code === 2) {
            // User cancelled
        } else {
          Alert.alert('Payment Error', err.description || 'Something went wrong');
        }
      });
  };

  const handleSuccess = async (data: any) => {
    console.log('[PGScreen] Success Data:', data);

    try {
      await paymentService.verifyPayment(
        packageId as string,
        data.razorpay_order_id,
        data.razorpay_payment_id,
        data.razorpay_signature
      );

      Alert.alert('Success', 'Interview booked!', [
        { text: 'OK', onPress: () => router.replace('/candidate/bookings') }
      ]);
    } catch (err) {
      console.error('[PGScreen] Verification failed:', err);
      Alert.alert('Verification Failed', 'Please contact support with Order ID: ' + orderId);
      router.back();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }}>
      <ActivityIndicator size="large" color="#0E9384" />
      <Text style={{ marginTop: 16 }}>Securely connecting to Razorpay...</Text>
    </SafeAreaView>
  );
}

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (Platform.OS !== 'web') return resolve(true);
    if (document.getElementById('razorpay-sdk')) return resolve(true);

    const script = document.createElement('script');
    script.id = 'razorpay-sdk';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}