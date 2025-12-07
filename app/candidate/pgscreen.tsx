// app/candidate/pgscreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, SafeAreaView, Alert, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { paymentService } from '../../services/payment.service';
import { useAuthStore } from '@/lib/store';
import RazorpayCheckout from 'react-native-razorpay';

export default function PGScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuthStore(); 

  // 1. Receive data from Schedule Screen (Matches perfectly)
  const { orderId, packageId, keyId } = params; 
  // Note: We deliberately ignore 'amount' here to prevent the Bad Request error.
  
  const [isProcessing, setIsProcessing] = useState(true);
  const [sdkReady, setSdkReady] = useState(false);
  
  const hasInitiated = useRef(false);
  const rzpInstance = useRef<any>(null);

  useEffect(() => {
    if (!orderId || !packageId || !keyId) {
        Alert.alert("Error", "Missing booking details.");
        router.back();
        return;
    }

    const prepareSDK = async () => {
      if (Platform.OS === 'web') {
        const res = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');
        if (!res) {
          Alert.alert('Error', 'Razorpay SDK failed to load.');
          return;
        }
        setSdkReady(true);
      } else {
        setSdkReady(true);
      }
    };
    prepareSDK();

    return () => {
        if (Platform.OS === 'web') {
            const frames = document.querySelectorAll('.razorpay-checkout-frame');
            frames.forEach(frame => frame.remove());
            if (rzpInstance.current) {
                try { rzpInstance.current.close(); } catch(e){}
            }
        }
    };
  }, []);

  useEffect(() => {
    if (sdkReady && orderId && keyId) {
      if (hasInitiated.current) return;
      hasInitiated.current = true;
      initiatePayment();
    }
  }, [sdkReady]);

  const initiatePayment = async () => {
    try {
      console.log("[PGScreen] Initiating Payment with Order ID:", orderId);

      // 🟢 CRITICAL FIX: 
      // We DO NOT pass 'amount' or 'currency' here. 
      // Razorpay automatically pulls them from the 'order_id'.
      // Passing them manually causes the "Bad Request" error you are seeing.
      
      const options: any = {
        name: 'CrackJobs',
        description: 'Mock Interview Session',
        key: keyId,      // From Params (Correct)
        order_id: orderId, // From Params (Correct)
        theme: { color: '#0E9384' },
        retry: { enabled: false },
        modal: {
            ondismiss: function() {
              handleCancel();
            }
        }
      };

      console.log('[PGScreen] Options:', options);

      if (Platform.OS === 'web') {
        const rzp1 = new (window as any).Razorpay({
          ...options,
          handler: async function (response: any) {
            await handleVerify(response);
          }
        });
        
        rzpInstance.current = rzp1;
        rzp1.open();

      } else {
        if (RazorpayCheckout) {
          RazorpayCheckout.open(options)
            .then((data: any) => handleVerify(data))
            .catch((error: any) => {
              if (error.code && error.code !== 0 && error.code !== 2) {
                 Alert.alert('Payment Error', error.description || 'Failed');
              } else {
                 handleCancel();
              }
            });
        }
      }

    } catch (e) {
      console.error('[PGScreen] Init Exception:', e);
      Alert.alert("Error", "Could not initiate payment.");
      router.back();
    }
  };

  const handleCancel = () => {
    setIsProcessing(false);
    setTimeout(() => {
        Alert.alert("Cancelled", "Payment was cancelled.");
        router.back();
    }, 500);
  };

  const handleVerify = async (data: any) => {
      try {
        setIsProcessing(true);
        await paymentService.verifyPayment(
            packageId as string,
            data.razorpay_order_id, 
            data.razorpay_payment_id,
            data.razorpay_signature
        );
        Alert.alert("Success", "Interview Booked Successfully!");
        router.replace('/candidate/bookings');
      } catch(err) {
          Alert.alert("Failed", "Payment verification failed.");
          router.back();
      } finally {
          setIsProcessing(false);
      }
  }

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <ActivityIndicator size="large" color="#0E9384" />
      <View style={{ marginTop: 20 }}>
        <Text style={{ marginBottom: 10, color: '#666' }}>
            {!sdkReady ? "Initializing Payment..." : "Redirecting to Razorpay..."}
        </Text>
        <TouchableOpacity onPress={handleCancel}>
           <Text style={{ color: '#0E9384', fontWeight: '600' }}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function loadRazorpayScript(src: string) {
  return new Promise((resolve) => {
    if (Platform.OS !== 'web') {
      resolve(false);
      return;
    }
    if (document.getElementById('razorpay-sdk')) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.id = 'razorpay-sdk';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}