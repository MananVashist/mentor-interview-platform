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
  const [profiles, setProfiles] = useState<any[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(null);
  
  // Skills State
  const [skills, setSkills] = useState<any[]>([]);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<any>(null);

  // 1. Fetch Mentor Details & Profiles
  useEffect(() => {
    async function fetchMentorDetails() {
      if (!id || id === 'schedule') return; 

      try {
        const { data, error } = await supabase
          .from('mentors')
          .select('session_price_inr, tier, professional_title, experience_description, profile_ids, years_of_experience, average_rating, total_sessions, status, profile:profiles(*)')
          .eq('id', id)
          .single();
          
        if (error) throw error;
          
        if (data) {
            const basePrice = data.session_price_inr || 1000;
            const tier = data.tier || 'bronze';
            
            // ✅ NEW: Fetch Tier Cut from DB
            const { data: tierData } = await supabase
                .from('mentor_tiers')
                .select('percentage_cut')
                .eq('tier', tier)
                .single();

            const percentageCut = tierData?.percentage_cut || 50;
            // Formula: Final = Base / (1 - Cut%)
            const totalPrice = Math.round(basePrice / (1 - (percentageCut / 100)));
            
            console.log('💰 Pricing Details:', { tier, basePrice, percentageCut, totalPrice });
            
            const profileIds = data.profile_ids || [];
            console.log('📊 Mentor Profile IDs:', profileIds);

            // Fetch profile details from interview_profiles_admin
            if (profileIds.length > 0) {
              const { data: profilesData, error: profilesError } = await supabase
                .from('interview_profiles_admin')
                .select('id, name, description')
                .in('id', profileIds)
                .order('name');

              if (!profilesError && profilesData) {
                console.log('✅ Fetched profiles:', profilesData);
                setProfiles(profilesData);
              } else {
                console.error('❌ Error fetching profiles:', profilesError);
                setProfiles([]);
              }
            }

            const aboutText = data.experience_description || "Experienced interview mentor.";

            setMentor({
                id: id, 
                title: data.professional_title || "Senior Interviewer",
                exp: data.years_of_experience, 
                about: aboutText,
                totalPrice: totalPrice,
                avatarChar: data.profile?.full_name?.charAt(0) || 'M',
                rating: data.average_rating || 0,
                sessionCount: data.total_sessions || 0,
                tier: tier,
                isVerified: data.status === 'approved'
            });
        }
      } catch (e) {
        console.error('❌ Error fetching mentor details:', e);
      } finally {
        setLoading(false);
      }
    }

    fetchMentorDetails();
  }, [id]);

  // 2. Fetch Skills when Profile is Selected
  useEffect(() => {
    async function fetchSkills() {
        if (!selectedProfileId) {
          setSkills([]);
          return;
        }

        // NOTE: We don't set loading(true) here because we did it in the onPress.
        // Doing it here causes the "flicker" because useEffect runs after the render.
        console.log('🔍 Fetching skills for profile_id:', selectedProfileId);

        try {
            const { data, error } = await supabase
                .from('interview_skills_admin')
                .select('id, name, description')
                .eq('interview_profile_id', selectedProfileId)
                .order('name');

            if (error) {
                console.error('❌ Error fetching skills:', error);
                setSkills([]);
            } else {
                console.log(`✅ Fetched ${data?.length || 0} skills`);
                setSkills(data || []);
            }
        } finally {
            setLoadingSkills(false); // Stop loading when done
        }
    }

    fetchSkills();
  }, [selectedProfileId]);

  const handleSchedule = () => {
    if (!selectedProfileId || !selectedSkill) {
      Alert.alert("Selection Required", "Please select both a profile and a skill.");
      return;
    }

    console.log('🎯 Navigating to schedule with:', {
      mentorId: id,
      profileId: selectedProfileId,
      skillId: selectedSkill.id,
      totalPrice: mentor.totalPrice
    });
    
    router.push({
      pathname: "/candidate/schedule",
      params: { 
        mentorId: id, 
        profileId: selectedProfileId,
        skillId: selectedSkill.id,
        totalPrice: mentor.totalPrice 
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

  if (!mentor) {
    return (
      <View style={styles.loadingContainer}>
        <AppText>Mentor not found</AppText>
      </View>
    );
  }

  // Tier display configuration
  const getTierStyle = (tier: string) => {
    switch (tier) {
      case 'gold':
        return { badge: styles.tierGold, text: styles.tierTextGold };
      case 'silver':
        return { badge: styles.tierSilver, text: styles.tierTextSilver };
      case 'bronze':
      default:
        return { badge: styles.tierBronze, text: styles.tierTextBronze };
    }
  };

  const tierStyle = getTierStyle(mentor.tier);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* BIO CARD */}
        <View style={styles.card}>
          <View style={styles.bioHeader}>
            <View style={styles.avatarPlaceholder}>
              <AppText style={styles.avatarText}>{mentor.avatarChar}</AppText>
            </View>
            <View style={{ flex: 1 }}>
              <AppText style={styles.headerTitle}>{mentor.title}</AppText>
              {mentor.isVerified && (
                <View style={styles.badge}>
                  <Ionicons name="shield-checkmark" size={12} color={theme.colors.primary} style={{ marginRight: 4 }} />
                  <AppText style={styles.badgeText}>VERIFIED</AppText>
                </View>
              )}
            </View>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            {/* Tier Badge */}
            <View style={[styles.tierBadge, tierStyle.badge]}>
              <Ionicons name="ribbon" size={14} color={tierStyle.text.color} />
              <AppText style={[styles.tierText, tierStyle.text]}>{mentor.tier.toUpperCase()}</AppText>
            </View>
            
            {mentor.rating > 0 && (
              <View style={styles.statItem}>
                <Ionicons name="star" size={14} color="#F59E0B" style={{ marginRight: 4 }} />
                <AppText style={styles.statText}>{mentor.rating.toFixed(1)}</AppText>
              </View>
            )}
            <View style={styles.statItem}>
              <Ionicons name="briefcase" size={14} color={theme.colors.primary} style={{ marginRight: 4 }} />
              <AppText style={styles.statText}>{mentor.exp} yrs</AppText>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="people" size={14} color={theme.colors.primary} style={{ marginRight: 4 }} />
              <AppText style={styles.statText}>{mentor.sessionCount} sessions</AppText>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle-outline" size={20} color={theme.colors.text.light} style={{ marginRight: 8 }} />
            <AppText style={styles.sectionTitle}>About</AppText>
          </View>
          <AppText style={styles.sectionBody}>{mentor.about}</AppText>
        </View>

        {/* SELECTION CARD */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="create-outline" size={20} color={theme.colors.text.light} style={{ marginRight: 8 }} />
            <AppText style={styles.sectionTitle}>Please select the domain and topic you want to practice</AppText>
          </View>
          
          {/* 1. Profile Pills */}
          <AppText style={styles.subLabel}>Role Profile:</AppText>
          <View style={styles.tagsContainer}>
            {profiles.length === 0 ? (
              <AppText style={styles.emptyText}>No profiles available</AppText>
            ) : (
              profiles.map((profile) => {
                const isSelected = selectedProfileId === profile.id;
                return (
                  <TouchableOpacity 
                      key={profile.id} 
                      style={[styles.tag, isSelected && styles.tagActive]}
                      onPress={() => {
                        console.log('🎯 Selected profile:', profile.name, 'ID:', profile.id);
                        
                        // FIX: Set loading state immediately to prevent flicker
                        setLoadingSkills(true);
                        setSkills([]); // Clear old skills instantly
                        setSelectedProfileId(profile.id);
                        setSelectedSkill(null); 
                      }}
                      activeOpacity={0.7}
                  >
                    {isSelected && <Ionicons name="checkmark" size={14} color="#FFF" style={{marginRight: 6}} />}
                    <AppText style={[styles.tagText, isSelected && styles.tagTextActive]}>{profile.name}</AppText>
                  </TouchableOpacity>
                );
              })
            )}
          </View>

          {/* 2. Skill Pills (Dynamic based on Profile) */}
          {selectedProfileId && (
             <View style={{ marginTop: 20, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#f0f0f0', minHeight: 100 }}>
                <AppText style={styles.subLabel}>Specific Skill to Evaluate:</AppText>
                
                {loadingSkills ? (
                    <View style={{ padding: 20, alignItems: 'center' }}>
                        <ActivityIndicator size="small" color={theme.colors.primary} />
                        <AppText style={{ fontSize: 12, color: theme.colors.text.light, marginTop: 8 }}>Loading skills...</AppText>
                    </View>
                ) : skills.length > 0 ? (
                    <>
                        <View style={styles.tagsContainer}>
                            {skills.map((skill) => {
                                const isSelected = selectedSkill?.id === skill.id;
                                return (
                                <TouchableOpacity 
                                    key={skill.id} 
                                    style={[styles.tag, isSelected && styles.skillTagActive]}
                                    onPress={() => {
                                      console.log('🎯 Selected skill:', skill.name, 'ID:', skill.id);
                                      setSelectedSkill(skill);
                                    }}
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
                    </>
                ) : (
                    <View style={{ padding: 16, backgroundColor: '#FEF2F2', borderRadius: 8, marginTop: 8 }}>
                        <AppText style={{ color: '#DC2626', fontSize: 14, textAlign: 'center' }}>
                          No skills available for this profile. Please contact support.
                        </AppText>
                    </View>
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
          nativeID="btn-proceed-to-schedule" 
            style={[
              styles.scheduleButton,
              (!selectedProfileId || !selectedSkill) && styles.scheduleButtonDisabled
            ]}
            activeOpacity={0.9}
            onPress={handleSchedule}
            disabled={!selectedProfileId || !selectedSkill}
          >
            <AppText style={[
              styles.scheduleButtonText,
              (!selectedProfileId || !selectedSkill) && styles.scheduleButtonTextDisabled
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
  tierText: { fontSize: 12, fontWeight: "700", letterSpacing: 0.3, marginLeft: 4 },
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
  skillTagActive: { backgroundColor: '#059669', borderColor: '#059669' },
  tagText: { fontSize: 14, color: theme.colors.text.body, fontWeight: "500" },
  tagTextActive: { color: "#FFF", fontWeight: "600" },
  skillDesc: { fontSize: 14, color: '#666', marginTop: 8, fontStyle: 'italic' },
  emptyText: { fontSize: 14, color: theme.colors.text.light, fontStyle: 'italic' },
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