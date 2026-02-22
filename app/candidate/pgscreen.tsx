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
import { trackEvent } from '@/lib/analytics';
import { authService } from '../../services/auth.service';
import { supabase } from '../../lib/supabase/client';

type SessionType = 'intro' | 'mock' | 'bundle';

const SESSION_DESCRIPTIONS: Record<SessionType, string> = {
  intro: 'Intro Call — Discovery & Planning',
  mock:  'Mock Interview Session',
  bundle: 'Interview Bundle — 3 Sessions',
};

export default function PGScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const {
    orderId,
    packageId,
    keyId,
    amount,
    mentorId,
    profileId,
    skillId,
    skillName,
    sessionType: sessionTypeParam,
  } = params as {
    orderId?: string;
    packageId?: string;
    keyId?: string;
    amount?: string;
    mentorId?: string;
    profileId?: string;
    skillId?: string;
    skillName?: string;
    sessionType?: string;
  };

  const sessionType: SessionType = (sessionTypeParam as SessionType) || 'mock';
  const sessionDescription = SESSION_DESCRIPTIONS[sessionType];

  const [sdkReady, setSdkReady] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const hasRun = useRef(false);

  // Build the "back to schedule" URL including sessionType
  const scheduleBackUrl = (mentorId && profileId && skillId && skillName)
    ? {
        pathname: '/candidate/schedule' as const,
        params: { mentorId, profileId, skillId, skillName, sessionType },
      }
    : null;

  const navigateBack = () => {
    if (scheduleBackUrl) {
      router.replace(scheduleBackUrl);
    } else {
      router.replace('/candidate/bookings');
    }
  };

  useEffect(() => {
    console.log('[PGScreen] 🔍 Received Params:', {
      orderId,
      packageId,
      keyId,
      sessionType,
      amount: amount ? `₹${Number(amount) / 100}` : 'missing'
    });

    if (!packageId || !keyId || !amount || !orderId) {
      console.error('[PGScreen] ❌ Missing required params');
      Alert.alert('Error', 'Missing payment details.', [
        { text: 'OK', onPress: navigateBack }
      ]);
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
      console.log('[PGScreen] 🚀 SDK Ready, opening checkout...');
      openCheckout();
    }
  }, [sdkReady]);

  const openCheckout = () => {
    const amountPaise = Number(amount);

    if (Platform.OS === 'web') {
      const options: any = {
        key: keyId,
        order_id: orderId,
        name: 'CrackJobs',
        description: sessionDescription,
        theme: { color: '#0E9384' },
        handler: handleSuccess,
        modal: {
          ondismiss: () => {
            console.log('[PGScreen] ⚠️ Checkout dismissed by user');
            hasRun.current = false;
            navigateBack();
          }
        },
        retry: { enabled: false }
      };

      console.log('[PGScreen][WEB] 📋 Razorpay Options:', {
        key: keyId,
        order_id: orderId,
        amount: `₹${amountPaise / 100}`,
        description: sessionDescription,
      });

      const rzp = new (window as any).Razorpay(options);

      rzp.on('payment.failed', (resp: any) => {
        console.error('[PGScreen][WEB] ❌ payment.failed:', resp);
        Alert.alert(
          'Payment Failed',
          resp.error?.description || 'Payment failed. Please try again.',
          [{ text: 'OK', onPress: navigateBack }]
        );
      });

      rzp.open();
      return;
    }

    // NATIVE
    const RazorpayCheckout = require('react-native-razorpay').default;

    const rnOptions: any = {
      key: keyId,
      order_id: orderId,
      amount: amountPaise,
      currency: 'INR',
      name: 'CrackJobs',
      description: sessionDescription,
      theme: { color: '#0E9384' },
      retry: { enabled: false },
    };

    console.log('[PGScreen][RN] 📋 Razorpay Options:', {
      key: keyId,
      order_id: orderId,
      amount: `₹${amountPaise / 100}`,
      description: sessionDescription,
    });

    RazorpayCheckout.open(rnOptions)
      .then(handleSuccess)
      .catch((err: any) => {
        console.log('[PGScreen][RN] ⚠️ Checkout Error:', err);
        if (err.code === 0 || err.code === 2) {
          console.log('[PGScreen][RN] User cancelled payment');
          navigateBack();
        } else {
          Alert.alert(
            'Payment Error',
            err.description || 'Something went wrong',
            [{ text: 'OK', onPress: navigateBack }]
          );
        }
      });
  };

  const handleSuccess = async (data: any) => {
    console.log('[PGScreen] ✅ Payment Success! Data:', {
      order_id: data.razorpay_order_id,
      payment_id: data.razorpay_payment_id,
      signature: data.razorpay_signature ? '✓ Present' : '✗ Missing'
    });

    setVerifying(true);

    let userEmail: string | undefined;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      userEmail = user?.email;
      console.log('[PGScreen] 📧 Retrieved email from session:', userEmail);
    } catch (err) {
      console.warn('[PGScreen] ⚠️ Could not retrieve email from session:', err);
    }

    try {
      console.log('[PGScreen] 🔐 Starting verification...');

      const result = await paymentService.verifyPayment(
        packageId as string,
        data.razorpay_payment_id,
        data.razorpay_signature,
        orderId as string,
      );

      console.log('[PGScreen] ✅ Verification successful!', result);

      trackEvent('purchase', {
        transaction_id: data.razorpay_payment_id,
        value: Number(amount) / 100,
        currency: 'INR',
        package_id: packageId,
        session_type: sessionType,
      });

      trackEvent('payment_success', {
        value: Number(amount) / 100,
        currency: 'INR',
        transaction_id: data.razorpay_payment_id,
        session_type: sessionType,
        email: userEmail,
      });

      setTimeout(() => {
        router.replace('/candidate/bookings');
      }, 1500);

    } catch (err: any) {
      console.error('[PGScreen] ❌ Verification failed:', {
        error: err,
        message: err?.message,
        details: err?.details,
      });

      setVerifying(false);

      const errorMessage = err?.message || 'Verification failed';
      const errorDetails = err?.details ? `\n\nDetails: ${err.details}` : '';

      Alert.alert(
        'Verification Failed',
        `${errorMessage}${errorDetails}\n\nOrder ID: ${orderId}\n\nPlease contact support if payment was deducted.`,
        [{ text: 'Go Back', onPress: () => router.replace('/candidate/bookings') }]
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }}>
      <ActivityIndicator size="large" color="#0E9384" />
      <Text style={{ marginTop: 16, fontSize: 16, color: '#374151', fontWeight: '500' }}>
        {verifying ? '✓ Payment successful! Redirecting...' : 'Securely connecting to Razorpay...'}
      </Text>
      {verifying && (
        <Text style={{ marginTop: 8, fontSize: 13, color: '#10B981', fontWeight: '600' }}>
          {sessionType === 'bundle' ? 'Bundle of 3 sessions confirmed' : 'Booking confirmed'}
        </Text>
      )}
    </SafeAreaView>
  );
}

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (Platform.OS !== 'web') return resolve(true);
    if (document.getElementById('razorpay-sdk')) {
      console.log('[PGScreen] ✓ Razorpay SDK already loaded');
      return resolve(true);
    }

    console.log('[PGScreen] 📥 Loading Razorpay SDK...');
    const script = document.createElement('script');
    script.id = 'razorpay-sdk';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      console.log('[PGScreen] ✓ Razorpay SDK loaded successfully');
      resolve(true);
    };
    script.onerror = () => {
      console.error('[PGScreen] ✗ Razorpay SDK failed to load');
      resolve(false);
    };
    document.body.appendChild(script);
  });
}