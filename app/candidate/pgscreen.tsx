// app/candidate/pgscreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, SafeAreaView, Alert, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { paymentService } from '../../services/payment.service';
import { RAZORPAY_KEY_ID } from '../../constants'; 
import { useAuth } from '../../hooks/useAuth';

// 🟢 FIX: Single import source. 
// Metro automatically picks .native.ts for Android/iOS and .ts for Web.
import RazorpayCheckout from 'react-native-razorpay';

export default function PGScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth();

  const { orderId, amount, packageId } = params;
  const [isProcessing, setIsProcessing] = useState(true);
  const [sdkReady, setSdkReady] = useState(false);

  // 1. Initialization Logic
  useEffect(() => {
    const prepareSDK = async () => {
      if (Platform.OS === 'web') {
        // Web: Load the script manually
        const res = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');
        if (!res) {
          Alert.alert('Error', 'Razorpay SDK failed to load. Are you online?');
          return;
        }
        setSdkReady(true);
      } else {
        // Native: The library is loaded via the import above. Ready immediately.
        setSdkReady(true);
      }
    };
    prepareSDK();
  }, []);

  // 2. Trigger Payment automatically when SDK is ready
  useEffect(() => {
    if (sdkReady && amount) {
      initiatePayment();
    }
  }, [sdkReady]);

  const initiatePayment = async () => {
    try {
      const order = await paymentService.createRazorpayOrder(Number(amount), packageId as string);

      const options = {
        description: 'Mock Interview Session',
        currency: 'INR',
        key: RAZORPAY_KEY_ID, 
        amount: order.amount, // Amount in paise
        name: 'Mentor Platform',
        prefill: {
          email: user?.email || 'test@example.com',
          contact: user?.phone || '9999999999',
        },
        theme: { color: '#0E9384' }
      };

      if (Platform.OS === 'web') {
        // --- WEB HANDLER ---
        const rzp1 = new (window as any).Razorpay({
          ...options,
          handler: async function (response: any) {
            await handleVerify(response);
          },
          modal: {
            ondismiss: function() {
              handleCancel();
            }
          }
        });
        rzp1.open();
      } else {
        // --- NATIVE HANDLER (Android/iOS) ---
        // Check if the module loaded correctly
        if (RazorpayCheckout) {
          RazorpayCheckout.open(options)
            .then((data: any) => {
              handleVerify(data);
            })
            .catch((error: any) => {
              if (error.code === 0) {
                handleCancel();
              } else {
                Alert.alert('Payment Error', error.description || 'Something went wrong');
                router.back();
              }
            });
        } else {
           Alert.alert("Configuration Error", "Native Payment SDK not loaded. Please rebuild the app.");
           router.back();
        }
      }

    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Could not initiate payment.");
      router.back();
    }
  };

  const handleCancel = () => {
    setIsProcessing(false);
    Alert.alert("Cancelled", "Payment was cancelled by user.");
    router.back();
  };

  const handleVerify = async (data: any) => {
      try {
        setIsProcessing(true);
        await paymentService.verifyPayment(
            packageId as string,
            data.razorpay_order_id || 'mock_order_id', 
            data.razorpay_payment_id,
            data.razorpay_signature || 'mock_signature'
        );
        Alert.alert("Success", "Payment Verified!");
        router.replace('/candidate/bookings');
      } catch(err) {
          Alert.alert("Failed", "Verification failed");
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
        <TouchableOpacity onPress={() => router.back()}>
           <Text style={{ color: '#0E9384', fontWeight: '600' }}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Helper for Web support
function loadRazorpayScript(src: string) {
  return new Promise((resolve) => {
    if (Platform.OS !== 'web') {
        resolve(false);
        return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}