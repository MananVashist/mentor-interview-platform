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
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "@/lib/ui"; 
import { supabase } from "@/lib/supabase/client";
import { theme } from "@/lib/theme";

export default function MentorDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [mentor, setMentor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // State for Selection
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<any>(null);

  // 1. Fetch Mentor Details
  useEffect(() => {
    async function fetchMentorDetails() {
      if (!id || id === 'schedule') return; 

      try {
        const { data, error } = await supabase
          .from('mentors')
          .select('session_price_inr, professional_title, experience_description, expertise_profiles, profile_ids, years_of_experience, average_rating, total_sessions, status, profile:profiles(*)')
          .eq('id', id)
          .single();
          
        if (error) throw error;
          
        if (data) {
            const basePrice = data.session_price_inr || 1000;
            const totalPrice = Math.round(basePrice * 1.2);
            
            // Calculate tier based on session count
            const sessionCount = data.total_sessions || 0;
            let tier = 'Bronze';
            if (sessionCount > 30) tier = 'Gold';
            else if (sessionCount > 10) tier = 'Silver';
            
            const profilesList = data.expertise_profiles?.join(", ") || "Tech";
            const aboutText = data.experience_description 
              ? data.experience_description 
              : `Specializes in ${profilesList} interviews.`;

            setMentor({
                id: id, 
                title: data.professional_title || "Senior Interviewer",
                exp: data.years_of_experience, 
                about: aboutText,
                expertise: data.expertise_profiles || ["Software Engineer"],
                profileIds: data.profile_ids || [], 
                totalPrice: totalPrice,
                avatarChar: data.profile?.full_name?.charAt(0) || 'M',
                rating: data.average_rating || 0,
                sessionCount: sessionCount,
                tier: tier,
                isVerified: data.status === 'approved'
            });

            // No default selection - user must choose explicitly
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    fetchMentorDetails();
  }, [id]);

  // 2. Fetch Skills when Profile Changes
  useEffect(() => {
    async function fetchSkills() {
        if (!selectedProfile || !mentor) return;

        // Find the ID of the selected profile string
        const index = mentor.expertise.indexOf(selectedProfile);
        const profileId = mentor.profileIds[index];

        if (!profileId) {
            setSkills([]);
            return;
        }

        const { data, error } = await supabase
            .from('interview_skills_admin')
            .select('*')
            .eq('interview_profile_id', profileId);

        if (!error && data) {
            setSkills(data);
            // No default selection - user must choose explicitly
            setSelectedSkill(null);
        }
    }
    fetchSkills();
  }, [selectedProfile, mentor]);

  const handleSchedule = () => {
    if (!selectedProfile || !selectedSkill) {
      Alert.alert("Selection Required", "Please select both a profile and a specific skill.");
      return;
    }

    const index = mentor.expertise.indexOf(selectedProfile);
    const selectedProfileId = mentor.profileIds[index];

    router.push({
        pathname: '/candidate/schedule',
        params: { 
            mentorId: id,
            profileName: selectedProfile, 
            profileId: selectedProfileId, // Passed for package creation
            price: mentor.totalPrice,
            // 🟢 Passing Skill Data Forward
            skillId: selectedSkill.id,
            skillName: selectedSkill.name
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
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <AppText style={styles.headerTitle}>{mentor.title}</AppText>
                  {mentor.isVerified && (
                    <Ionicons name="checkmark-circle" size={18} color="#0E9384" />
                  )}
                </View>
                {mentor.exp != null && (
                  <View style={styles.badge}>
                      <Ionicons name="briefcase" size={10} color={theme.colors.text.body} style={{ marginRight: 4 }} />
                      <AppText style={styles.badgeText}>{mentor.exp} Years Exp</AppText>
                  </View>
                )}
            </View>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            {/* Tier Badge */}
            <View style={[
              styles.tierBadge, 
              mentor.tier === 'Gold' && styles.tierGold,
              mentor.tier === 'Silver' && styles.tierSilver,
              mentor.tier === 'Bronze' && styles.tierBronze
            ]}>
              <Ionicons 
                name="trophy" 
                size={12} 
                color={
                  mentor.tier === 'Gold' ? '#D97706' :
                  mentor.tier === 'Silver' ? '#6B7280' :
                  '#CD7F32'
                } 
                style={{ marginRight: 4 }} 
              />
              <AppText style={[
                styles.tierText,
                mentor.tier === 'Gold' && styles.tierTextGold,
                mentor.tier === 'Silver' && styles.tierTextSilver,
                mentor.tier === 'Bronze' && styles.tierTextBronze
              ]}>
                {mentor.tier}
              </AppText>
            </View>

            {/* Rating */}
            <View style={styles.statItem}>
              <Ionicons name="star" size={14} color="#F59E0B" style={{ marginRight: 4 }} />
              <AppText style={styles.statText}>
                {mentor.rating > 0 ? mentor.rating.toFixed(1) : 'New'}
              </AppText>
            </View>

            {/* Sessions */}
            <View style={styles.statItem}>
              <Ionicons name="people" size={14} color="#6B7280" style={{ marginRight: 4 }} />
              <AppText style={styles.statText}>
                {mentor.sessionCount} {mentor.sessionCount === 1 ? 'session' : 'sessions'}
              </AppText>
            </View>
          </View>

          <View style={styles.divider} />
          <View style={styles.sectionHeader}>
             <Ionicons name="information-circle-outline" size={20} color={theme.colors.text.light} style={{ marginRight: 8 }} />
             <AppText style={styles.sectionTitle}>About</AppText>
          </View>
          <AppText style={styles.sectionBody}>{mentor.about}</AppText>
        </View>

        {/* PROFILE & SKILL SELECTION */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
             <Ionicons name="checkmark-circle-outline" size={20} color={theme.colors.text.light} style={{ marginRight: 8 }} />
             <AppText style={styles.sectionTitle}>Select Focus Area</AppText>
          </View>
          
          {/* 1. Profile Tags */}
          <AppText style={styles.subLabel}>Role Profile:</AppText>
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

          {/* 2. Skill Tags (Dynamic based on Profile) */}
          {selectedProfile && skills.length > 0 && (
             <View style={{ marginTop: 20, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#f0f0f0' }}>
                <AppText style={styles.subLabel}>Specific Skill to Evaluate:</AppText>
                <View style={styles.tagsContainer}>
                    {skills.map((skill) => {
                        const isSelected = selectedSkill?.id === skill.id;
                        return (
                        <TouchableOpacity 
                            key={skill.id} 
                            style={[styles.tag, isSelected && styles.skillTagActive]} // Different color style potentially
                            onPress={() => setSelectedSkill(skill)}
                        >
                            <AppText style={[styles.tagText, isSelected && styles.tagTextActive]}>
                                {skill.name}
                            </AppText>
                        </TouchableOpacity>
                        );
                    })}
                </View>
                {selectedSkill?.description && (
                    <AppText style={styles.skillDesc}>{selectedSkill.description}</AppText>
                )}
             </View>
          )}
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
                        <AppText style={styles.includesText}>Includes 1 focused session</AppText>
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
            style={[
              styles.scheduleButton,
              (!selectedProfile || !selectedSkill) && styles.scheduleButtonDisabled
            ]}
            activeOpacity={0.9}
            onPress={handleSchedule}
            disabled={!selectedProfile || !selectedSkill}
          >
            <AppText style={[
              styles.scheduleButtonText,
              (!selectedProfile || !selectedSkill) && styles.scheduleButtonTextDisabled
            ]}>
              Select Time Slot
            </AppText>
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
  headerTitle: { fontSize: 20, fontWeight: "800", color: theme.colors.text.main },
  badge: { flexDirection: "row", alignItems: "center", backgroundColor: theme.colors.gray[100], borderWidth: 0, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, alignSelf: "flex-start" },
  badgeText: { fontSize: 11, fontWeight: "700", color: theme.colors.text.body, letterSpacing: 0.5 },
  statsRow: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 12, marginBottom: 16 },
  tierBadge: { flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, borderWidth: 1.5 },
  tierGold: { backgroundColor: '#FFFBEB', borderColor: '#F59E0B' },
  tierSilver: { backgroundColor: '#F3F4F6', borderColor: '#9CA3AF' },
  tierBronze: { backgroundColor: '#FEF2F2', borderColor: '#CD7F32' },
  tierText: { fontSize: 12, fontWeight: "700", letterSpacing: 0.3 },
  tierTextGold: { color: '#D97706' },
  tierTextSilver: { color: '#6B7280' },
  tierTextBronze: { color: '#CD7F32' },
  statItem: { flexDirection: "row", alignItems: "center", backgroundColor: theme.colors.gray[50], paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  statText: { fontSize: 12, fontWeight: "600", color: theme.colors.text.body },
  divider: { height: 1, backgroundColor: theme.colors.border, marginBottom: 16 },
  sectionHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: theme.colors.text.main },
  sectionBody: { fontSize: 15, color: theme.colors.text.body, lineHeight: 24 },
  subLabel: { fontSize: 14, color: theme.colors.text.light, marginBottom: 8 },
  tagsContainer: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  tag: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999 },
  tagActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  skillTagActive: { backgroundColor: '#059669', borderColor: '#059669' }, // Slightly different shade for skills
  tagText: { fontSize: 14, color: theme.colors.text.body, fontWeight: "500" },
  tagTextActive: { color: "#FFF", fontWeight: "600" },
  skillDesc: { fontSize: 12, color: '#666', marginTop: 8, fontStyle: 'italic' },
  priceContainer: { marginTop: 4 },
  priceRow: { flexDirection: "row", alignItems: "center" },
  priceMain: { fontSize: 32, fontWeight: "800", color: theme.colors.text.main, marginBottom: 8 },
  includesBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.pricing.greenBg, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, alignSelf: 'flex-start' },
  includesText: { fontSize: 13, fontWeight: "600", color: theme.colors.primary },
  footerWrapper: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#f8f5f0", borderTopWidth: 1, borderTopColor: theme.colors.border },
  footerContent: { paddingHorizontal: 24, paddingVertical: 16 },
  scheduleButton: { backgroundColor: theme.colors.primary, paddingVertical: 16, borderRadius: 12, alignItems: "center", justifyContent: "center", shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  scheduleButtonDisabled: { backgroundColor: '#D1D5DB', shadowOpacity: 0, elevation: 0 },
  scheduleButtonText: { fontSize: 16, fontWeight: "700", color: "#FFF" },
  scheduleButtonTextDisabled: { color: '#9CA3AF' },
});