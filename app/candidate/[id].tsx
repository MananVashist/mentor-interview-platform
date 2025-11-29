import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "@/lib/ui"; 
import { supabase } from "@/lib/supabase/client";
import { calculateMentorTier } from "@/lib/logic";
import { theme } from "@/lib/theme";

export default function MentorDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [mentor, setMentor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMentorDetails() {
      if (!id || id === 'schedule') return; 

      try {
        // 1. UPDATE: Fetch 'profile_ids' alongside 'expertise_profiles'
        const { data, error } = await supabase
          .from('mentors')
          .select('session_price_inr, professional_title, experience_description, expertise_profiles, profile_ids, total_sessions, profile:profiles(*)')
          .eq('id', id)
          .single();
          
        if (error) throw error;
          
        if (data) {
            const basePrice = data.session_price_inr || 1000;
            const totalPrice = Math.round(basePrice * 1.2);
            
            const tier = calculateMentorTier(data.total_sessions);
            const levelLabel = tier === 'New' ? "NEW MENTOR" : `${tier.toUpperCase()} MENTOR`;

            setMentor({
                id: id, 
                title: data.professional_title || "Senior Interviewer",
                level: levelLabel,
                about: data.experience_description || "No description provided.",
                expertise: data.expertise_profiles || ["Software Engineer"],
                profileIds: data.profile_ids || [], // 2. STORE: Save IDs array
                totalPrice: totalPrice,
                avatarChar: data.profile?.full_name?.charAt(0) || 'M'
            });

            if (data.expertise_profiles?.length > 0) {
                setSelectedProfile(data.expertise_profiles[0]);
            }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    fetchMentorDetails();
  }, [id]);

  const handleSchedule = () => {
    if (!selectedProfile) {
      Alert.alert("Selection Required", "Please select an interview profile to proceed.");
      return;
    }

    // 3. LOGIC: Find the ID corresponding to the selected name
    // We assume expertise_profiles and profile_ids are aligned by index
    const index = mentor.expertise.indexOf(selectedProfile);
    const selectedId = mentor.profileIds[index];

    router.push({
        pathname: '/candidate/schedule',
        params: { 
            mentorId: id,
            profileName: selectedProfile, // Name for display
            profileId: selectedId,        // ID for Database
            price: mentor.totalPrice
        } 
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!mentor) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* BIO SECTION */}
        <View style={styles.card}>
          <View style={styles.bioHeader}>
            <View style={styles.avatarPlaceholder}>
                <AppText style={styles.avatarText}>{mentor.avatarChar}</AppText>
            </View>
            <View style={{ flex: 1 }}>
                <AppText style={styles.headerTitle}>{mentor.title}</AppText>
                <View style={styles.badge}>
                    <Ionicons name="trophy" size={10} color={theme.colors.badge.bronze.text} style={{ marginRight: 4 }} />
                    <AppText style={styles.badgeText}>{mentor.level}</AppText>
                </View>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.sectionHeader}>
             <Ionicons name="information-circle-outline" size={20} color={theme.colors.text.light} style={{ marginRight: 8 }} />
             <AppText style={styles.sectionTitle}>About</AppText>
          </View>
          <AppText style={styles.sectionBody}>{mentor.about}</AppText>
        </View>

        {/* PROFILE SELECTION */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
             <Ionicons name="checkmark-circle-outline" size={20} color={theme.colors.text.light} style={{ marginRight: 8 }} />
             <AppText style={styles.sectionTitle}>Select Interview Focus</AppText>
          </View>
          <AppText style={styles.subLabel}>Choose the specific role you want to practice for:</AppText>
          
          <View style={styles.tagsContainer}>
            {mentor.expertise.map((tag: string, index: number) => {
              const isSelected = selectedProfile === tag;
              return (
                <TouchableOpacity 
                    key={index} 
                    style={[styles.tag, isSelected && styles.tagActive]}
                    onPress={() => setSelectedProfile(tag)}
                    activeOpacity={0.7}
                >
                  {isSelected && <Ionicons name="checkmark" size={14} color="#FFF" style={{marginRight: 6}} />}
                  <AppText style={[styles.tagText, isSelected && styles.tagTextActive]}>{tag}</AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* PRICING */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
             <Ionicons name="pricetag-outline" size={20} color={theme.colors.text.light} style={{ marginRight: 8 }} />
             <AppText style={styles.sectionTitle}>Total Booking Price</AppText>
          </View>
          
          <View style={styles.priceContainer}>
            <View style={styles.priceRow}>
                <View>
                    <AppText style={styles.priceMain}>₹{mentor.totalPrice.toLocaleString()}</AppText>
                    <View style={styles.includesBadge}>
                        <Ionicons name="videocam-outline" size={12} color={theme.colors.primary} style={{ marginRight: 4 }} />
                        <AppText style={styles.includesText}>Includes 2 mock interviews</AppText>
                    </View>
                </View>
            </View>
          </View>
        </View>

      </ScrollView>

      {/* FOOTER */}
      <SafeAreaView style={styles.footerWrapper}>
        <View style={styles.footerContent}>
          <TouchableOpacity 
            style={styles.scheduleButton}
            activeOpacity={0.9}
            onPress={handleSchedule}
          >
            <AppText style={styles.scheduleButtonText}>Schedule & Pay</AppText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f5f0" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContent: { padding: 20, gap: 16, paddingBottom: 120 },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },
  bioHeader: { flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 16 },
  avatarPlaceholder: { width: 56, height: 56, borderRadius: 28, backgroundColor: theme.colors.primary, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 24, fontWeight: "700", color: "#FFF" },
  headerTitle: { fontSize: 20, fontWeight: "800", color: theme.colors.text.main, marginBottom: 6 },
  badge: { flexDirection: "row", alignItems: "center", backgroundColor: theme.colors.badge.bronze.bg, borderWidth: 1, borderColor: theme.colors.badge.bronze.border, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, alignSelf: "flex-start" },
  badgeText: { fontSize: 10, fontWeight: "800", color: theme.colors.badge.bronze.text, letterSpacing: 0.5, textTransform: "uppercase" },
  divider: { height: 1, backgroundColor: theme.colors.border, marginBottom: 16 },
  sectionHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: theme.colors.text.main },
  sectionBody: { fontSize: 15, color: theme.colors.text.body, lineHeight: 24 },
  subLabel: { fontSize: 14, color: theme.colors.text.light, marginBottom: 16 },
  tagsContainer: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  tag: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999 },
  tagActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  tagText: { fontSize: 14, color: theme.colors.text.body, fontWeight: "500" },
  tagTextActive: { color: "#FFF", fontWeight: "600" },
  priceContainer: { marginTop: 4 },
  priceRow: { flexDirection: "row", alignItems: "center" },
  priceMain: { fontSize: 32, fontWeight: "800", color: theme.colors.text.main, marginBottom: 8 },
  includesBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.pricing.greenBg, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, alignSelf: 'flex-start' },
  includesText: { fontSize: 13, fontWeight: "600", color: theme.colors.primary },
  footerWrapper: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#f8f5f0", borderTopWidth: 1, borderTopColor: theme.colors.border },
  footerContent: { paddingHorizontal: 24, paddingVertical: 16 },
  scheduleButton: { backgroundColor: theme.colors.primary, paddingVertical: 16, borderRadius: 12, alignItems: "center", justifyContent: "center", shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  scheduleButtonText: { fontSize: 16, fontWeight: "700", color: "#FFF" },
});