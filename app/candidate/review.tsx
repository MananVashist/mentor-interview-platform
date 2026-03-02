// app/candidate/review.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Platform, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Svg, Path, Rect } from 'react-native-svg';
import { theme } from '@/lib/theme';
import { paymentService } from '@/services/payment.service';
import { useAuthStore } from '@/lib/store';
import { supabase } from '@/lib/supabase/client';

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

  const {
    mentorId, profileId, skillId, skillName, sessionType,
    slotsIso, slotsDisplay, jdText, price, bundleSave, mentorName, avatarUrl, mentorTitle
  } = params as any;

  // Extremely safe query parameter parsing to protect against Expo Router splitting strings with commas
  const safeString = (val: any) => {
    if (!val) return '';
    const str = Array.isArray(val) ? val[0] : val;
    try { return decodeURIComponent(str); } catch { return str; }
  };

  const decodedSlotsIso = safeString(slotsIso);
  let parsedSlotsIso: string[] = [];
  if (decodedSlotsIso) {
      try { parsedSlotsIso = JSON.parse(decodedSlotsIso); } catch(e) {}
  }
  
  const decodedSlotsDisplay = safeString(slotsDisplay);
  let parsedSlotsDisplay: any[] = [];
  if (decodedSlotsDisplay) {
      try { parsedSlotsDisplay = JSON.parse(decodedSlotsDisplay); } catch(e) {}
  }

  const safeJdText = safeString(jdText);
  const decodedAvatarUrl = safeString(avatarUrl);
  const safeSkillName = safeString(skillName);
  const safeMentorName = safeString(mentorName);
  const safeMentorTitle = safeString(mentorTitle);

  const isBundle = sessionType === 'bundle';
  const displayType = sessionType === 'intro' ? 'Intro Call (25 min)' : sessionType === 'mock' ? 'Mock Interview (55 min)' : 'Prep Course (3 × 55 min)';
  
  const safeProfileId = (profileId && profileId !== 'null' && profileId !== 'undefined') ? Number(profileId) : null;
  const safeSkillId = (skillId && skillId !== 'null' && skillId !== 'undefined') ? skillId : null;

  const handleConfirmAndPay = async () => {
    if (!parsedSlotsIso || parsedSlotsIso.length === 0) {
        Alert.alert("Error", "Session slots are missing. Please go back and select a time slot.");
        return;
    }

    setProcessing(true);
    try {
      const uid = authStore.user?.id;
      if (!uid) throw new Error("User not authenticated.");

      const { data: cand } = await supabase.from("candidates").select("id").eq("id", uid).maybeSingle();
      if (!cand) await supabase.from("candidates").insert([{ id: uid }]);

      // Log JD context to db
      if (safeJdText && safeJdText.trim().length > 0) {
        const { error: jdError } = await supabase.from('job_descriptions').insert({
          candidate_id: uid,
          jd_text: safeJdText.trim(),
        });
        if (jdError) console.error("Failed to save Job Description:", jdError);
      }

      const skIds = isBundle ? Array(3).fill(safeSkillId || '') : (sessionType === 'mock' && safeSkillId ? [safeSkillId] : []);
      
      const { package: pkg, amount, orderId, keyId, error } = await paymentService.createPackage(
        uid, mentorId as string, safeProfileId, skIds, parsedSlotsIso, sessionType as any, safeJdText || undefined
      );

      if (error || !pkg) throw new Error(error?.message || "Failed to initialize payment.");

      if (pkg.payment_status === "pending") {
        router.replace({
          pathname: '/candidate/pgscreen',
          params: {
            packageId: pkg.id,
            amount: amount?.toString(),
            orderId,
            keyId,
            mentorId,
            profileId: safeProfileId?.toString() || '',
            skillId: safeSkillId || '',
            skillName: safeSkillName,
            sessionType,
          }
        });
      } else {
        Alert.alert("Success", "Booking confirmed natively.");
        router.replace('/candidate/bookings');
      }
    } catch (err: any) {
      Alert.alert("Booking Error", err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        
        <TouchableOpacity 
          style={styles.backBtn} 
          onPress={() => router.replace({ pathname: '/mentors/[id]', params: { id: mentorId } })} 
          activeOpacity={0.7}
        >
          <IcoArrowLeft s={15} />
          <Text style={styles.backTxt}>Edit booking</Text>
        </TouchableOpacity>

        <Text style={styles.pageTitle}>Review & Confirm</Text>

        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>MENTOR</Text>
          <View style={styles.mentorRow}>
             <Image source={{ uri: decodedAvatarUrl || `https://api.dicebear.com/9.x/micah/png?seed=Mentor&backgroundColor=e5e7eb,f3f4f6` }} style={styles.avatar} />
             <View>
                <Text style={styles.mentorName}>{safeMentorName || 'Mentor'}</Text>
                <Text style={styles.mentorTitle}>{safeMentorTitle}</Text>
             </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.cardSectionTitle}>SESSION DETAILS</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Type</Text>
            <Text style={styles.detailValue}>{displayType}</Text>
          </View>
          
          {sessionType === 'mock' && safeSkillId && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Focus</Text>
              <Text style={styles.detailValue}>{safeSkillName}</Text>
            </View>
          )}

          {parsedSlotsDisplay.map((s: any, idx: number) => (
            <View key={idx} style={styles.detailRow}>
              <Text style={styles.detailLabel}>{isBundle ? `Session ${idx + 1}` : 'Time'}</Text>
              <Text style={styles.detailValue}>{s.time}, {s.displayDate}</Text>
            </View>
          ))}

          {safeJdText && safeJdText.trim().length > 0 && (
             <View style={styles.jdContextRow}>
                <Text style={styles.detailLabel}>Role Context</Text>
                <Text style={styles.jdContextValue} numberOfLines={1}>Job Description Attached</Text>
             </View>
          )}

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
  
  jdContextRow: { marginTop: 4, padding: 12, backgroundColor: '#F5F3FF', borderRadius: 8, borderWidth: 1, borderColor: '#DDD6FE' },
  jdContextValue: { fontFamily: SYSTEM_FONT, fontSize: 13, color: '#4C1D95', fontWeight: '600', marginTop: 4 },

  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  totalLabel: { fontFamily: SYSTEM_FONT, fontSize: 16, fontWeight: '800', color: '#111827' },
  totalValue: { fontFamily: SYSTEM_FONT, fontSize: 24, fontWeight: '800', color: theme.colors.primary },
  
  payBtn: { backgroundColor: theme.colors.primary, paddingVertical: 18, borderRadius: 12, alignItems: 'center' },
  payBtnDisabled: { opacity: 0.7 },
  payBtnTxt: { fontFamily: SYSTEM_FONT, fontSize: 16, fontWeight: '800', color: '#FFF', letterSpacing: 0.3 },
  
  trustRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 16 },
  trustTxt: { fontFamily: SYSTEM_FONT, fontSize: 12, color: '#9CA3AF', fontWeight: '500' }
});