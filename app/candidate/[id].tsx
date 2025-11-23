// app/candidate/[id].tsx
import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useLocalSearchParams, useRouter, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AppText, Heading, Card } from "@/lib/ui";
import { supabase } from "@/lib/supabase/client";
import { calculateMentorTier } from "@/lib/logic"; // ✅ NEW IMPORT

// --- THEME ---
const THEME = {
  bg: "#F9FAFB",
  white: "#FFFFFF",
  textMain: "#111827",
  textBody: "#4B5563",
  textLight: "#6B7280",
  border: "#E5E7EB",
  primaryTeal: "#11998e",
  bronzeBg: "#FFF7ED",
  bronzeText: "#C2410C",
  bronzeBorder: "#FFEDD5",
  greenText: "#10B981",
  greenBg: "#ECFDF5",
  blueBg: "#EFF6FF",
  blueIcon: "#3B82F6",
};

export default function MentorDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [mentor, setMentor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // --- DEBUG LOGS ---
  console.log("------------------------------------------------");
  console.log("📍 [MentorDetails] Screen MOUNTED");
  console.log("   ➡️ Current Path:", pathname);
  console.log("   ➡️ ID Param:", id);
  if (id === 'schedule') {
     console.error("🚨 CRITICAL ROUTING ERROR: Router loaded [id].tsx instead of schedule.tsx!");}
  console.log("------------------------------------------------");
  
  useEffect(() => {
    async function fetchMentorDetails() {
      if (!id || id === 'schedule') return; 

      try {
        const { data, error } = await supabase
          .from('mentors')
          // FIX: Removed 'session_price' from selection to fix 400 Error
          // ✅ ADDED total_sessions to this selection for logic calculation
          .select('session_price_inr, professional_title, experience_description, expertise_profiles, total_sessions, profile:profiles(*)')
          .eq('id', id)
          .single();
          
        if (error) {
            console.error("Supabase Fetch Error:", error);
            throw error;
        }
          
        if (data) {
            // Use session_price_inr or default to 1000
            const price = data.session_price_inr || 1000;
            
            // ✅ DYNAMIC TIER CALCULATION (No longer hardcoded fallback)
            const tier = calculateMentorTier(data.total_sessions);
            const levelLabel = tier === 'New' ? "NEW MENTOR" : `${tier.toUpperCase()} MENTOR`;

            setMentor({
                id: id, 
                title: data.professional_title || "Senior Interviewer",
                level: levelLabel, // ✅ Dynamic
                about: data.experience_description || "No description provided.",
                expertise: data.expertise_profiles || ["Software Engineer"],
                priceBreakdown: {
                    mentorReceives: price,
                    platformFee: 300,
                    total: price + 300
                }
            });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    fetchMentorDetails();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={THEME.primaryTeal} />
      </View>
    );
  }

  if (!mentor) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.bg} />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 1. Header */}
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <AppText style={styles.headerTitle}>{mentor.title}</AppText>
            <View style={styles.badge}>
               <Ionicons name="trophy" size={12} color={THEME.bronzeText} style={{ marginRight: 6 }} />
               {/* ✅ Displaying Dynamic Level */}
               <AppText style={styles.badgeText}>{mentor.level}</AppText>
            </View>
          </View>
        </View>

        {/* 2. About */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
             <Ionicons name="information-circle-outline" size={22} color="#9CA3AF" style={{ marginRight: 10 }} />
             <AppText style={styles.sectionTitle}>About This Mentor</AppText>
          </View>
          <AppText style={styles.sectionBody}>{mentor.about}</AppText>
        </View>

        {/* 3. Expertise */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
             <Ionicons name="checkmark-circle-outline" size={22} color="#9CA3AF" style={{ marginRight: 10 }} />
             <AppText style={styles.sectionTitle}>Interview Expertise</AppText>
          </View>
          <AppText style={styles.subLabel}>This mentor can conduct interviews for:</AppText>
          <View style={styles.tagsContainer}>
            {mentor.expertise.map((tag: string, index: number) => (
              <View key={index} style={styles.tag}>
                <AppText style={styles.tagText}>{tag}</AppText>
              </View>
            ))}
          </View>
        </View>

        {/* 4. Pricing */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
             <Ionicons name="pricetag-outline" size={22} color="#9CA3AF" style={{ marginRight: 10 }} />
             <AppText style={styles.sectionTitle}>Package Pricing</AppText>
          </View>
          <AppText style={styles.subLabel}>Each booking includes 2 mock interview sessions</AppText>
          
          <View style={styles.priceContainer}>
            <View style={styles.priceRow}>
              <View style={styles.priceRowLeft}>
                <View style={[styles.iconCircle, { backgroundColor: THEME.greenBg }]}>
                   <Ionicons name="person" size={14} color={THEME.greenText} />
                </View>
                <AppText style={styles.priceLabel}>Mentor receives</AppText>
              </View>
              <AppText style={styles.priceValueGreen}>₹{mentor.priceBreakdown.mentorReceives.toLocaleString()}</AppText>
            </View>

            <View style={styles.priceRow}>
              <View style={styles.priceRowLeft}>
                <View style={[styles.iconCircle, { backgroundColor: THEME.blueBg }]}>
                   <Ionicons name="card" size={14} color={THEME.blueIcon} />
                </View>
                <AppText style={styles.priceLabel}>Platform fee</AppText>
              </View>
              <AppText style={styles.priceValueBlack}>+₹{mentor.priceBreakdown.platformFee}</AppText>
            </View>

            <View style={styles.divider} />

            <View style={styles.priceRow}>
              <View style={styles.priceRowLeft}>
                <View style={[styles.iconCircle, { backgroundColor: THEME.greenBg }]}>
                   <Ionicons name="wallet" size={14} color={THEME.greenText} />
                </View>
                <AppText style={styles.totalLabel}>You pay</AppText>
              </View>
              <AppText style={styles.totalValue}>₹{mentor.priceBreakdown.total.toLocaleString()}</AppText>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* STICKY FOOTER */}
      <SafeAreaView style={styles.footerWrapper}>
        <View style={styles.footerContent}>
          <TouchableOpacity 
            style={styles.scheduleButton}
            activeOpacity={0.9}
            onPress={() => {
                console.log("🔵 Navigating to Schedule Screen for:", id);
                router.push({
                    pathname: '/candidate/schedule', 
                    params: { mentorId: id } 
                });
            }}
          >
            <AppText style={styles.scheduleButtonText}>Schedule session</AppText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.bg },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContent: { padding: 20, gap: 20, paddingBottom: 120 },
  card: {
    backgroundColor: THEME.white,
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: THEME.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 16 },
  headerTitle: { flex: 1, fontSize: 19, fontWeight: "700", color: THEME.textMain, lineHeight: 28 },
  badge: { flexDirection: "row", alignItems: "center", backgroundColor: THEME.bronzeBg, borderWidth: 1, borderColor: THEME.bronzeBorder, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, alignSelf: "flex-start" },
  badgeText: { fontSize: 11, fontWeight: "800", color: THEME.bronzeText, letterSpacing: 0.5, textTransform: "uppercase" },
  sectionHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: THEME.textMain },
  sectionBody: { fontSize: 15, color: THEME.textBody, lineHeight: 24 },
  subLabel: { fontSize: 14, color: "#9CA3AF", marginBottom: 16 },
  tagsContainer: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  tag: { backgroundColor: "#F3F4F6", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 6 },
  tagText: { fontSize: 13, color: "#374151", fontWeight: "600" },
  priceContainer: { marginTop: 8 },
  priceRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 18 },
  priceRowLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconCircle: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  priceLabel: { fontSize: 15, color: "#4B5563", fontWeight: "500" },
  priceValueGreen: { fontSize: 15, fontWeight: "700", color: THEME.greenText },
  priceValueBlack: { fontSize: 15, fontWeight: "800", color: THEME.textMain },
  divider: { height: 1, backgroundColor: "#F3F4F6", marginBottom: 18 },
  totalLabel: { fontSize: 16, fontWeight: "800", color: THEME.textMain },
  totalValue: { fontSize: 20, fontWeight: "800", color: THEME.greenText },
  footerWrapper: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#FFF", borderTopWidth: 1, borderTopColor: THEME.border },
  footerContent: { paddingHorizontal: 24, paddingVertical: 16 },
  scheduleButton: { backgroundColor: THEME.primaryTeal, paddingVertical: 16, borderRadius: 8, alignItems: "center", justifyContent: "center", shadowColor: THEME.primaryTeal, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  scheduleButtonText: { fontSize: 16, fontWeight: "700", color: "#FFF" },
});