// app/candidate/pgscreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, SafeAreaView, Alert, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Relative imports
import { paymentService } from '../../services/payment.service';
import { RAZORPAY_KEY_ID } from '../../constants'; 
import { useAuth } from '../../hooks/useAuth';

export default function PGScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth();

  const { orderId, amount, packageId } = params;
  const [isProcessing, setIsProcessing] = useState(true); // Start true to load script
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // 🎯 FIX: Dynamically load the Razorpay script
  useEffect(() => {
    const loadScript = async () => {
      if (Platform.OS === 'web') {
        const res = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');
        if (!res) {
          Alert.alert('Error', 'Razorpay SDK failed to load. Are you online?');
          return;
        }
        setScriptLoaded(true);
      }
    };
    loadScript();
  }, []);

  // 🎯 FIX: Trigger payment only after script is loaded
  useEffect(() => {
    if (scriptLoaded && amount) {
      initiatePayment();
    }
  }, [scriptLoaded]);

  const initiatePayment = async () => {
    try {
      // 1. Create Order
      const order = await paymentService.createRazorpayOrder(Number(amount), packageId as string);

      // 2. Open Options
      const options = {
        description: 'Mock Interview Session',
        currency: 'INR',
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        name: 'Mentor Platform',
        //order_id: order.order_id,
        prefill: {
          email: user?.email || 'test@example.com',
          contact: user?.phone || '',
        },
        theme: { color: '#2563eb' },
        handler: async function (response: any) {
            // 🎯 Success Callback (Web specific handler)
            await handleVerify(response);
        },
        modal: {
            ondismiss: function() {
                setIsProcessing(false);
                Alert.alert("Payment Cancelled");
                router.back();
            }
        }
      };

      // 3. Launch using window object (Safe for web)
      const rzp1 = new (window as any).Razorpay(options);
      rzp1.open();

    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Could not initiate payment.");
      router.back();
    }
  };

  const handleVerify = async (data: any) => {
      try {
        await paymentService.verifyPayment(
            packageId as string,
            data.razorpay_order_id,
            data.razorpay_payment_id,
            data.razorpay_signature
        );
        Alert.alert("Success", "Payment Verified!");
        router.replace('/candidate/bookings');
      } catch(err) {
          Alert.alert("Failed", "Verification failed");
      } finally {
          setIsProcessing(false);
      }
  }

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#2563eb" />
      <View style={{ marginTop: 20 }}>
        <Text style={{ marginBottom: 10 }}>
            {!scriptLoaded ? "Loading Payment SDK..." : "Redirecting to Razorpay..."}
        </Text>
        <TouchableOpacity onPress={() => router.back()}>
           <Text style={{ color: 'blue' }}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// 🎯 HELPER: Load Script Function
function loadRazorpayScript(src: string) {
  return new Promise((resolve) => {
    if (Platform.OS !== 'web') {
        resolve(false); // Strategy for native apps differs
        return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}