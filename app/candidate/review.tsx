// app/candidate/review.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Platform, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Svg, Path, Circle, Rect } from 'react-native-svg';
import { theme } from '@/lib/theme';
import { paymentService } from '@/services/payment.service';
import { useAuthStore } from '@/lib/store';
import { supabase } from '@/lib/supabase/client';
import { trackEvent } from '@/lib/analytics';

const SYSTEM_FONT = Platform.select({
  web: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
  ios: "System", android: "Roboto", default: "System"
}) as string;

const IcoLock = ({ s = 14, c = "#10B981" }) => (<Svg width={s} height={s} viewBox="0 0 24 24" fill="none"><Rect x="3" y="11" width="18" height="11" rx="2" stroke={c} strokeWidth="2" /><Path d="M7 11V7a5 5 0 0110 0v4" stroke={c} strokeWidth="2" strokeLinecap="round" /></Svg>);
const IcoArrowLeft = ({ s = 16, c = "#6B7280" }) => (<Svg width={s} height={s} viewBox="0 0 24 24" fill="none"><Path d="M19 12H5M5 12l7 7M5 12l7-7" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></Svg>);

export default function ReviewBookingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const authStore = useAuthStore();
  const [processing, setProcessing] = useState(false);

  // Extract Params
  const {
    mentorId, profileId, skillId, skillName, sessionType,
    slotsIso, slotsDisplay, jdText, price, bundleSave, mentorName, avatarUrl, mentorTitle
  } = params as any;

  const parsedSlotsIso = slotsIso ? JSON.parse(slotsIso) : [];
  const parsedSlotsDisplay = slotsDisplay ? JSON.parse(slotsDisplay) : [];
  const isBundle = sessionType === 'bundle';
  const displayType = sessionType === 'intro' ? 'Intro Call (25 min)' : sessionType === 'mock' ? 'Mock Interview (55 min)' : 'Prep Course (3 × 55 min)';

  const handleConfirmAndPay = async () => {
    setProcessing(true);
    try {
      const uid = authStore.user?.id;
      if (!uid) throw new Error("User not authenticated.");

      // Ensure candidate record exists
      const { data: cand } = await supabase.from("candidates").select("id").eq("id", uid).maybeSingle();
      if (!cand) await supabase.from("candidates").insert([{ id: uid }]);

      // Package creation mapping
      const skIds = isBundle ? Array(3).fill(skillId || '') : (sessionType === 'mock' && skillId ? [skillId] : []);
      
      const { package: pkg, amount, orderId, keyId, error } = await paymentService.createPackage(
        uid, mentorId, Number(profileId), skIds, parsedSlotsIso, sessionType, jdText || undefined
      );

      if (error || !pkg) throw new Error(error?.message || "Failed to initialize payment.");

      // Forward to existing Razorpay screen
      if (pkg.payment_status === "pending") {
        router.replace({
          pathname: '/candidate/pgscreen',
          params: {
            packageId: pkg.id,
            amount: amount?.toString(),
            orderId,
            keyId,
            mentorId,
            profileId,
            skillId,
            skillName,
            sessionType,
          }
        });
      } else {
        Alert.alert("Success", "Booking confirmed natively.");
        router.replace('/candidate/bookings');
      }
    } catch (err: any) {
      Alert.alert("Booking Error", err.message);
      setProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <IcoArrowLeft s={15} />
          <Text style={styles.backTxt}>Edit booking</Text>
        </TouchableOpacity>

        <Text style={styles.pageTitle}>Review & Confirm</Text>

        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>MENTOR</Text>
          <View style={styles.mentorRow}>
             <Image source={{ uri: avatarUrl }} style={styles.avatar} />
             <View>
                <Text style={styles.mentorName}>{mentorTitle}</Text>
             </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.cardSectionTitle}>SESSION DETAILS</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Type</Text>
            <Text style={styles.detailValue}>{displayType}</Text>
          </View>
          
          {sessionType === 'mock' && skillName && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Focus</Text>
              <Text style={styles.detailValue}>{skillName}</Text>
            </View>
          )}

          {parsedSlotsDisplay.map((s: any, idx: number) => (
            <View key={idx} style={styles.detailRow}>
              <Text style={styles.detailLabel}>{isBundle ? `Session ${idx + 1}` : 'Time'}</Text>
              <Text style={styles.detailValue}>{s.time}, {s.displayDate}</Text>
            </View>
          ))}

          <View style={styles.divider} />

          <Text style={styles.cardSectionTitle}>PAYMENT SUMMARY</Text>
          {isBundle && Number(bundleSave) > 0 && (
             <View style={styles.detailRow}>
               <Text style={styles.detailLabel}>Bundle Discount applied</Text>
               <Text style={[styles.detailValue, { color: '#059669' }]}>- ₹{Number(bundleSave).toLocaleString()}</Text>
             </View>
          )}
          <View style={styles.totalRow}>
             <Text style={styles.totalLabel}>Total</Text>
             <Text style={styles.totalValue}>₹{Number(price).toLocaleString()}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.payBtn, processing && styles.payBtnDisabled]} 
          onPress={handleConfirmAndPay}
          disabled={processing}
          activeOpacity={0.8}
        >
          {processing ? (
             <ActivityIndicator color="#FFF" />
          ) : (
             <Text style={styles.payBtnTxt}>Proceed to Payment</Text>
          )}
        </TouchableOpacity>

        <View style={styles.trustRow}>
          <IcoLock s={12} c="#9CA3AF" />
          <Text style={styles.trustTxt}>Payments are secure and encrypted by Razorpay</Text>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  content: { maxWidth: 600, width: '100%', alignSelf: 'center', padding: 24, paddingTop: 40 },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 24, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 100, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', alignSelf: "flex-start" },
  backTxt: { fontFamily: SYSTEM_FONT, fontSize: 13, fontWeight: "600", color: '#6B7280' },
  pageTitle: { fontFamily: SYSTEM_FONT, fontSize: 24, fontWeight: '800', color: '#111827', marginBottom: 24 },
  
  card: { backgroundColor: '#FFF', borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', padding: 24, marginBottom: 24 },
  cardSectionTitle: { fontFamily: SYSTEM_FONT, fontSize: 11, fontWeight: '800', color: '#9CA3AF', letterSpacing: 0.8, marginBottom: 16 },
  
  mentorRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F3F4F6' },
  mentorName: { fontFamily: SYSTEM_FONT, fontSize: 16, fontWeight: '700', color: '#111827' },
  mentorTitle: { fontFamily: SYSTEM_FONT, fontSize: 13, color: '#6B7280', marginTop: 2 },
  
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 20 },
  
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  detailLabel: { fontFamily: SYSTEM_FONT, fontSize: 14, color: '#6B7280', fontWeight: '500' },
  detailValue: { fontFamily: SYSTEM_FONT, fontSize: 14, color: '#111827', fontWeight: '600' },
  
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  totalLabel: { fontFamily: SYSTEM_FONT, fontSize: 16, fontWeight: '800', color: '#111827' },
  totalValue: { fontFamily: SYSTEM_FONT, fontSize: 24, fontWeight: '800', color: theme.colors.primary },
  
  payBtn: { backgroundColor: theme.colors.primary, paddingVertical: 18, borderRadius: 12, alignItems: 'center' },
  payBtnDisabled: { opacity: 0.7 },
  payBtnTxt: { fontFamily: SYSTEM_FONT, fontSize: 16, fontWeight: '800', color: '#FFF', letterSpacing: 0.3 },
  
  trustRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 16 },
  trustTxt: { fontFamily: SYSTEM_FONT, fontSize: 12, color: '#9CA3AF', fontWeight: '500' }
});