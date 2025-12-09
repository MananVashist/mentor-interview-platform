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

    // For native we require orderId as well, for web we’ll temporarily ignore it
    if (Platform.OS !== 'web' && !orderId) {
      Alert.alert('Error', 'Missing order id for payment.');
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
    if (!Number.isFinite(amountPaise) || amountPaise <= 0) {
      console.warn('[PGScreen] Invalid amount received:', amount);
      Alert.alert('Error', 'Invalid payment amount.');
      router.back();
      return;
    }

    if (Platform.OS === 'web') {
      // 🟢 DEBUG MODE (WEB):
      // Use SIMPLE amount-based checkout (NO order_id) to remove order from equation.
      const options: any = {
        key: keyId,
        amount: amountPaise, // paise
        currency: 'INR',
        name: 'CrackJobs',
        description: 'Mock Interview Session',
        theme: { color: '#0E9384' },
        retry: { enabled: false },
        handler: handleSuccess,
        redirect: false,
      };

      console.log('[PGScreen][WEB] Options (NO order_id):', options);

      const rzp = new (window as any).Razorpay(options);

      rzp.on('payment.failed', (resp: any) => {
        console.log('[PGScreen][WEB] payment.failed:', resp);
        Alert.alert(
          'Payment Failed',
          resp?.error?.description || 'Bad Request / Error'
        );
      });

      rzp.open();
      return;
    }
    const RazorpayCheckout = require('react-native-razorpay').default;
    // 🟢 NATIVE: keep order-based flow (orders API)
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

    console.log('[PGScreen][RN] Options:', rnOptions);

    RazorpayCheckout.open(rnOptions)
      .then(handleSuccess)
      .catch((err: any) => {
        console.log('[PGScreen][RN] Razorpay Error:', err);

        // code 0 / 2 usually user-cancel
        if (err.code === 0 || err.code === 2) {
          handleCancel();
        } else {
          Alert.alert('Payment Error', err.description || 'Bad Request');
        }
      });
  };

  const handleSuccess = async (data: any) => {
    console.log('[PGScreen] Payment Success:', data);

    try {
      await paymentService.verifyPayment(
        packageId as string,
        data.razorpay_order_id,
        data.razorpay_payment_id,
        data.razorpay_signature
      );

      Alert.alert('Success', 'Interview booked!');
      router.replace('/candidate/bookings');
    } catch (err) {
      console.error('[PGScreen] Verification failed:', err);
      Alert.alert('Verification Failed', 'Please contact support.');
      router.back();
    }
  };

  const handleCancel = () => {
    Alert.alert('Cancelled', 'Payment was cancelled.');
    router.back();
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
      }}
    >
      <ActivityIndicator size="large" color="#0E9384" />
      <Text style={{ marginTop: 16 }}>
        {sdkReady ? 'Opening Razorpay…' : 'Preparing payment…'}
      </Text>
    </SafeAreaView>
  );
}

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (Platform.OS !== 'web') return resolve(true);

    if (document.getElementById('razorpay-sdk')) {
      return resolve(true);
    }

    const script = document.createElement('script');
    script.id = 'razorpay-sdk';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}
