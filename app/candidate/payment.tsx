import React, { useState, useEffect } from 'react';
import { 
  View, StyleSheet, ScrollView, TouchableOpacity, 
  ActivityIndicator, Alert, StatusBar, Platform
} from 'react-native';
import { useRouter, useLocalSearchParams, usePathname } from 'expo-router';
import { format, parseISO } from 'date-fns';

// Libs
import { supabase } from '@/lib/supabase/client';
import { theme } from '@/lib/theme';
import { Heading, AppText, Card, IconLock } from '@/lib/ui';
import { paymentService } from '@/services/payment.service';
import { useAuthStore } from '@/lib/store';

export default function PaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams(); 
  
  // Access store functions to manually update state if needed
  const { user, setSession } = useAuthStore(); 

  const mentorId = Array.isArray(params.mentorId) ? params.mentorId[0] : params.mentorId;
  const slot1 = Array.isArray(params.slot1) ? params.slot1[0] : params.slot1;
  const slot2 = Array.isArray(params.slot2) ? params.slot2[0] : params.slot2;

  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mentorData, setMentorData] = useState<any>(null);
  const [price, setPrice] = useState(0);

  // --- 0. Session Restoration (Fix for Browser Refresh) ---
  useEffect(() => {
    const checkUser = async () => {
      if (!user) {
        console.log("🔄 Checking for persisted session...");
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          console.log("✅ Restored Session for:", data.user.email);
          // We assume your store has a setSession or similar to update state
          // If setSession expects a session object, fetch it:
          const { data: sessionData } = await supabase.auth.getSession();
          if (sessionData.session) {
             setSession(sessionData.session);
          }
        }
      }
    };
    checkUser();
  }, []);

  // --- 1. Fetch Mentor Details ---
  useEffect(() => {
    async function fetchDetails() {
      if (!mentorId) {
          setIsLoading(false);
          return;
      }
      try {
        const { data, error } = await supabase
          .from('mentors')
          // FIX: Requesting only valid columns
          .select('session_price_inr, professional_title, profile:profiles(full_name)')
          .eq('id', mentorId)
          .single();

        if (error) throw error;

        setPrice(data.session_price_inr || 1000);
        setMentorData(data);
      } catch (err) {
        console.error("Fetch Error:", err);
        Alert.alert("Error", "Could not load payment details");
        router.back();
      } finally {
        setIsLoading(false);
      }
    }
    fetchDetails();
  }, [mentorId]);

  // --- 2. Handle Payment ---
  const handlePayment = async () => {
    // Re-check user from store (it might have just been restored)
    const currentUser = useAuthStore.getState().user;

    if (!currentUser) {
      console.warn("❌ No User Found (even after restore attempt)");
      if (Platform.OS === 'web') {
         alert("Please sign in to continue.");
      } else {
         Alert.alert("Sign In", "Please sign in to continue.");
      }
      return;
    }
    
    setIsProcessing(true);
    try {
      // A. Create Package & Sessions in DB
      const { package: newPkg, error } = await paymentService.createPackage(
        currentUser.id,
        mentorId!,
        mentorData?.professional_title || 'Candidate',
        price, 
        [slot1!, slot2!]
      );

      if (error || !newPkg) throw error || new Error("Creation failed");

      // B. Generate Mock Order ID
      const orderId = await paymentService.createRazorpayOrder(price, newPkg.id);

      // C. Redirect to PG Screen
      router.push({
        pathname: '/candidate/pgscreen',
        params: { 
            orderId: orderId,
            amount: price.toString(),
            packageId: newPkg.id
        }
      });

    } catch (err: any) {
      console.error("Payment Logic Error:", err);
      Alert.alert("Payment Failed", err.message);
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // Formats - Using date-fns instead of luxon
  const fmtTime = (iso: string | undefined) => {
      if (!iso) return 'Invalid Date';
      try {
        const date = parseISO(iso);
        return format(date, 'MMM d, h:mm a');
      } catch {
        return 'Invalid Date';
      }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <Heading level={1} style={styles.pageTitle}>Review & Pay</Heading>
          <AppText style={styles.pageSubtitle}>Complete your booking for 2 sessions.</AppText>
        </View>

        <Card style={styles.summaryCard}>
          <Heading level={3} style={styles.cardTitle}>Booking Summary</Heading>
          
          <View style={styles.row}>
            <AppText style={styles.label}>Mentor</AppText>
            <AppText style={styles.value}>{mentorData?.profile?.full_name || 'Mentor'}</AppText>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.row}>
            <AppText style={styles.label}>Session 1</AppText>
            <AppText style={styles.value}>{slot1 ? fmtTime(slot1) : 'Invalid'}</AppText>
          </View>
          <View style={styles.row}>
            <AppText style={styles.label}>Session 2</AppText>
            <AppText style={styles.value}>{slot2 ? fmtTime(slot2) : 'Invalid'}</AppText>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <AppText style={styles.totalLabel}>Total to Pay</AppText>
            <AppText style={styles.totalValue}>₹{price.toLocaleString()}</AppText>
          </View>

          <TouchableOpacity 
            style={styles.payBtn}
            onPress={handlePayment}
            disabled={isProcessing}
            activeOpacity={0.8}
          >
            {isProcessing ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <AppText style={styles.payBtnText}>Pay ₹{price}</AppText>
            )}
          </TouchableOpacity>
          
           <View style={styles.secureRow}>
             <IconLock size={12} color="#6B7280" />
             <AppText style={styles.secureText}>Secured by Razorpay</AppText>
           </View>
        </Card>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 20 },
  header: { marginBottom: 24 },
  pageTitle: { fontSize: 24, marginBottom: 4 },
  pageSubtitle: { fontSize: 15, color: theme.colors.text.body },

  summaryCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 24, borderWidth: 1, borderColor: theme.colors.border },
  cardTitle: { fontSize: 18, marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  label: { color: theme.colors.text.body, fontSize: 14 },
  value: { color: theme.colors.text.main, fontSize: 14, fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 12 },
  totalLabel: { fontSize: 16, fontWeight: '700', color: theme.colors.text.main },
  totalValue: { fontSize: 20, fontWeight: '800', color: theme.colors.primary },

  payBtn: { backgroundColor: theme.colors.text.main, paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  payBtnText: { color: "#FFF", fontSize: 16, fontWeight: '700' },
  
  secureRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 16, gap: 4 },
  secureText: { fontSize: 12, color: '#6B7280' }
});