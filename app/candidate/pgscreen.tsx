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

  const { 
    orderId, 
    packageId, 
    keyId, 
    amount,
    // Params for navigation back on cancellation
    mentorId,
    profileId,
    skillId,
    skillName
  } = params as {
    orderId?: string;
    packageId?: string;
    keyId?: string;
    amount?: string;
    mentorId?: string;
    profileId?: string;
    skillId?: string;
    skillName?: string;
  };

  const [sdkReady, setSdkReady] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const hasRun = useRef(false);

  useEffect(() => {
    console.log('[PGScreen] 🔍 Received Params:', {
      orderId,
      packageId,
      keyId,
      amount: amount ? `₹${Number(amount) / 100}` : 'missing'
    });

    if (!packageId || !keyId || !amount || !orderId) {
      console.error('[PGScreen] ❌ Missing required params');
      
      const navigateBack = () => {
        if (mentorId && profileId && skillId && skillName) {
          router.replace({
            pathname: '/candidate/schedule',
            params: { mentorId, profileId, skillId, skillName }
          });
        } else {
          router.replace('/candidate/bookings');
        }
      };

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
      // WEB CONFIGURATION
      const options: any = {
        key: keyId,
        order_id: orderId,
        
        name: 'CrackJobs',
        description: 'Mock Interview Session',
        theme: { color: '#0E9384' },

        handler: handleSuccess,
        modal: {
            ondismiss: () => {
                console.log('[PGScreen] ⚠️ Checkout dismissed by user');
                hasRun.current = false;
                
                // Navigate back to schedule screen
                if (mentorId && profileId && skillId && skillName) {
                  router.replace({
                    pathname: '/candidate/schedule',
                    params: {
                      mentorId,
                      profileId,
                      skillId,
                      skillName
                    }
                  });
                } else {
                  router.replace('/candidate/bookings');
                }
            }
        },
        retry: { enabled: false }
      };

      console.log('[PGScreen][WEB] 📋 Razorpay Options:', {
        key: keyId,
        order_id: orderId,
        amount: `₹${amountPaise / 100}`
      });

      const rzp = new (window as any).Razorpay(options);

      rzp.on('payment.failed', (resp: any) => {
        console.error('[PGScreen][WEB] ❌ payment.failed:', resp);
        
        const navigateBack = () => {
          if (mentorId && profileId && skillId && skillName) {
            router.replace({
              pathname: '/candidate/schedule',
              params: { mentorId, profileId, skillId, skillName }
            });
          } else {
            router.replace('/candidate/bookings');
          }
        };

        Alert.alert(
          'Payment Failed', 
          resp.error?.description || 'Payment failed. Please try again.',
          [{ text: 'OK', onPress: navigateBack }]
        );
      });

      rzp.open();
      return;
    }

    // NATIVE CONFIGURATION
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

    console.log('[PGScreen][RN] 📋 Razorpay Options:', {
      key: keyId,
      order_id: orderId,
      amount: `₹${amountPaise / 100}`
    });

    RazorpayCheckout.open(rnOptions)
      .then(handleSuccess)
      .catch((err: any) => {
        console.log('[PGScreen][RN] ⚠️ Checkout Error:', err);
        
        const navigateBack = () => {
          if (mentorId && profileId && skillId && skillName) {
            router.replace({
              pathname: '/candidate/schedule',
              params: { mentorId, profileId, skillId, skillName }
            });
          } else {
            router.replace('/candidate/bookings');
          }
        };

        if (err.code === 0 || err.code === 2) {
            // User cancelled payment
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

    try {
      console.log('[PGScreen] 🔐 Starting verification...');
      
      // ✅ FIX: Pass orderId as the 4th argument
      // The Edge Function "verify-razorpay-signature" REQUIRES: packageId, paymentId, signature, AND orderId
      const result = await paymentService.verifyPayment(
        packageId as string,          
        data.razorpay_payment_id,     
        data.razorpay_signature,
        orderId as string // <-- ADDED THIS
      );

      console.log('[PGScreen] ✅ Verification successful!', result);

      // ✅ AUTO-REDIRECT: Navigate immediately after success
      setTimeout(() => {
        router.replace('/candidate/bookings');
      }, 1500); 

    } catch (err: any) {
      console.error('[PGScreen] ❌ Verification failed:', {
        error: err,
        message: err?.message,
        details: err?.details
      });

      setVerifying(false);

      const errorMessage = err?.message || 'Verification failed';
      const errorDetails = err?.details ? `\n\nDetails: ${err.details}` : '';
      
      Alert.alert(
        'Verification Failed', 
        `${errorMessage}${errorDetails}\n\nOrder ID: ${orderId}\n\nPlease contact support if payment was deducted.`,
        [
          { 
            text: 'Go Back', 
            onPress: () => router.replace('/candidate/bookings') 
          }
        ]
      );
    }
  };

  return (
    <SafeAreaView style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: '#FFF' 
    }}>
      <ActivityIndicator size="large" color="#0E9384" />
      <Text style={{ 
        marginTop: 16, 
        fontSize: 16, 
        color: '#374151',
        fontWeight: '500'
      }}>
        {verifying ? '✓ Payment successful! Redirecting...' : 'Securely connecting to Razorpay...'}
      </Text>
      {verifying && (
        <Text style={{ 
          marginTop: 8, 
          fontSize: 13, 
          color: '#10B981',
          fontWeight: '600' 
        }}>
          Booking confirmed
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