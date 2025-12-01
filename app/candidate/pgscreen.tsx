// app/candidate/pgscreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, SafeAreaView, Alert, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { paymentService } from '../../services/payment.service';
// 🛑 REMOVED CONSTANT IMPORT to avoid confusion: import { RAZORPAY_KEY_ID } from '../../constants';
import { useAuth } from '../../hooks/useAuth';

// Metro automatically picks .native.ts for Android/iOS and .ts for Web.
import RazorpayCheckout from 'react-native-razorpay';

export default function PGScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth();

  // 🟢 🟢 🟢 UPDATED: Receive 'keyId' from params
  const { orderId, amount, packageId, keyId } = params;
  
  const [isProcessing, setIsProcessing] = useState(true);
  const [sdkReady, setSdkReady] = useState(false);

  // 1. Initialization Logic: Load SDK if needed
  useEffect(() => {
    console.log('[PGScreen] Mounted with params', { orderId, amount, packageId, keyId: keyId ? 'PRESENT' : 'MISSING', platform: Platform.OS });
    
    // Safety check
    if (!orderId || !amount || !packageId || !keyId) {
        Alert.alert("Error", "Missing booking details. Please try again.");
        router.back();
        return;
    }

    const prepareSDK = async () => {
      if (Platform.OS === 'web') {
        // Web: Load the script manually
        console.log('[PGScreen] Loading Razorpay web SDK...');
        const res = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');
        if (!res) {
          console.error('[PGScreen] Razorpay SDK failed to load on web');
          Alert.alert('Error', 'Razorpay SDK failed to load. Are you online?');
          return;
        }
        setSdkReady(true);
      } else {
        // Native: The library is loaded via the import above. Ready immediately.
        console.log('[PGScreen] Native platform, SDK assumed ready');
        setSdkReady(true);
      }
    };
    prepareSDK();
  }, []);

  // 2. Trigger Payment automatically when SDK is ready
  useEffect(() => {
    if (sdkReady && orderId && amount && keyId) {
      console.log('[PGScreen] SDK ready, initiating payment...');
      initiatePayment();
    }
  }, [sdkReady]);

  const initiatePayment = async () => {
    try {
      // 1. Clean up options (Fixing the 400 Bad Request)
      const options: any = {
        description: 'Mock Interview Session',
        currency: 'INR',
        key: keyId, 
        amount: Number(amount), 
        name: 'CrackJobs',
        order_id: orderId,
        theme: { color: '#0E9384' },
        prefill: {
          email: user?.email || undefined,
          name: user?.user_metadata?.full_name || undefined,
          // 🛑 FIX: Only add 'contact' if it exists. Do not send empty string.
        }
      };

      console.log('[PGScreen] Payment Options:', JSON.stringify(options, null, 2));

      if (Platform.OS === 'web') {
        // --- WEB HANDLER ---
        const rzp1 = new (window as any).Razorpay({
          ...options,
          handler: async function (response: any) {
            console.log('[PGScreen] Web payment success', response);
            await handleVerify(response);
          },
          modal: {
            ondismiss: function() {
              console.log('[PGScreen] Web Razorpay modal dismissed');
              handleCancel();
            }
          }
        });
        
        // Safety check to prevent double opening
        if (isProcessing) {
             rzp1.open();
        }

      } else {
        // --- NATIVE HANDLER ---
        if (RazorpayCheckout) {
          RazorpayCheckout.open(options)
            .then((data: any) => {
              console.log('[PGScreen] Native payment success', data);
              handleVerify(data);
            })
            .catch((error: any) => {
              // Ignore specific error codes if needed
              if (error.code && error.code !== 0) {
                 console.warn('[PGScreen] Native payment error', error);
                 Alert.alert('Payment Error', error.description || 'Something went wrong');
              } else {
                 handleCancel();
              }
            });
        }
      }

    } catch (e) {
      console.error('[PGScreen] Could not initiate payment', e);
      Alert.alert("Error", "Could not initiate payment.");
      router.back();
    }
  };

  const handleCancel = () => {
    setIsProcessing(false);
    Alert.alert("Cancelled", "Payment was cancelled.");
    router.back();
  };

  const handleVerify = async (data: any) => {
      console.log('[PGScreen] Verifying payment...', data);
      try {
        setIsProcessing(true);
        // Call the service to update DB status to 'confirmed'
        await paymentService.verifyPayment(
            packageId as string,
            data.razorpay_order_id, 
            data.razorpay_payment_id,
            data.razorpay_signature
        );
        
        console.log('[PGScreen] Payment verification succeeded');
        Alert.alert("Success", "Interview Booked Successfully!");
        
        // Redirect to Bookings page
        router.replace('/candidate/bookings');
        
      } catch(err) {
          console.error('[PGScreen] Payment verification failed', err);
          Alert.alert("Failed", "Payment successful but verification failed. Please contact support.");
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

// Helper for Web support
function loadRazorpayScript(src: string) {
  return new Promise((resolve) => {
    if (Platform.OS !== 'web') {
        resolve(false);
        return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}