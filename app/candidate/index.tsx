import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  useWindowDimensions,
  Platform, // Added Platform for shadow logic
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Heading,
  AppText,
  Card,
  ScreenBackground,
} from "@/lib/ui";
import { theme } from "@/lib/theme";

const SUPABASE_URL = "https://rcbaaiiawrglvyzmawvr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjYmFhaWlhd3JnbHZ5em1hd3ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNTA1NjAsImV4cCI6MjA3NjcyNjU2MH0.V3qRHGXBMlspRS7XFJlXdo4qIcCms60Nepp7dYMEjLA";

type AdminProfile = { id: number; name: string; description: string | null; is_active: boolean; };
type Mentor = { 
  id: string; 
  professional_title?: string | null; 
  experience_description?: string | null; 
  expertise_profiles?: string[]; 
  session_price_inr?: number | null; 
  session_price?: number | null;
  total_sessions?: number;
  years_of_experience?: number | null;
};

export default function CandidateDashboard() {
  const { width } = useWindowDimensions();
  const isDesktop = width > 768; 
  const isMobile = width <= 768;

  const router = useRouter();

  const [adminProfiles, setAdminProfiles] = useState<AdminProfile[]>([]);
  const [profilesLoading, setProfilesLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [mentorsLoading, setMentorsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    (async () => {
      setProfilesLoading(true);
      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/interview_profiles_admin?select=*`, { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } });
        const data = await res.json();
        if (res.ok) {
          const actives = (data || []).filter((p: AdminProfile) => p.is_active !== false);
          setAdminProfiles(actives);
          if (actives.length > 0) setSelectedProfile(actives[0].name);
        }
      } catch (err) { console.log("Error fetching profiles", err); } 
      finally { setProfilesLoading(false); }
    })();
  }, []);

  const fetchMentorsForProfile = useCallback(async (profileName: string | null) => {
    if (!profileName) return;
    setMentorsLoading(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/mentors?select=*,profile:profiles(*)&status=eq.approved`, { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } });
      const data = await res.json();
      if (res.ok) {
        const filtered = (data || []).filter((m: Mentor) => Array.isArray(m.expertise_profiles) ? m.expertise_profiles.includes(profileName) : false);
        setMentors(filtered);
      }
    } catch (err) { console.log("Error fetching mentors", err); } 
    finally { setMentorsLoading(false); }
  }, []);

  useEffect(() => { if (selectedProfile) fetchMentorsForProfile(selectedProfile); }, [selectedProfile, fetchMentorsForProfile]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMentorsForProfile(selectedProfile);
    setRefreshing(false);
  };

  const handleViewMentor = (id: string) => {
    router.push({ pathname: "/candidate/[id]", params: { id } });
  };

  return (
    <ScreenBackground style={styles.container}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* --- HEADER SECTION --- */}
        <View style={[styles.headerContainer, isMobile && styles.headerContainerMobile]}>
          <View style={styles.headerLeft}>
            <Heading level={1} style={styles.headerTitle}>Find Your Mentor</Heading>
            <AppText style={styles.headerSubtitle}>
              Select a profile below and connect with experienced professionals
            </AppText>
          </View>
        </View>

        <View style={styles.headerDivider} />

        {/* --- FILTERS SECTION --- */}
        <View style={[styles.filtersContainer, isMobile && { paddingHorizontal: 20 }]}>
          <AppText style={styles.filterLabel}>Select Interview Profile</AppText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsScroll}>
            {profilesLoading ? (
              <ActivityIndicator color={theme.colors.primary} />
            ) : (
              adminProfiles.map((p) => {
                const isActive = selectedProfile === p.name;
                return (
                  <TouchableOpacity
                    key={p.id}
                    onPress={() => setSelectedProfile(p.name)}
                    style={[styles.pill, isActive ? styles.pillActive : styles.pillInactive]}
                  >
                    {isActive && <Ionicons name="checkmark" size={16} color="#FFF" style={{ marginRight: 6 }} />}
                    <AppText style={[styles.pillText, isActive ? styles.pillTextActive : styles.pillTextInactive]}>
                      {p.name}
                    </AppText>
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>
          <AppText style={styles.resultsCount}>
            {mentors.length} {mentors.length === 1 ? "mentor" : "mentors"} available
          </AppText>
        </View>

        {/* --- MENTORS LIST --- */}
        <View style={[styles.listContainer, isMobile && { paddingHorizontal: 20 }]}>
          {mentorsLoading ? (
            <ActivityIndicator size="large" color={theme.colors.primary} />
          ) : mentors.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={48} color={theme.colors.text.light} />
              <AppText style={styles.emptyText}>No mentors found for this profile.</AppText>
            </View>
          ) : (
            mentors.map((m) => {
              const price = m.session_price_inr ?? m.session_price ?? 0;
              const displayPrice = price ? Math.round(price * 1.2) : 0;

              // Fallback Logic: Use 'expertise_profiles' (names) if no description
              const profilesList = m.expertise_profiles?.join(", ") || "Tech";
              const descriptionText = m.experience_description 
                ? m.experience_description 
                : `Specializes in ${profilesList} interviews.`;

              return (
                <Card key={m.id} style={styles.card}>
                  <View style={styles.cardContent}>
                    
                    {/* 1. Professional Title & Badge */}
                    <View style={styles.topRow}>
                        <View style={styles.identityGroup}>
                            <AppText style={styles.mentorName}>
                                {m.professional_title || "Senior Mentor"}
                            </AppText>
                            {/* Verified Badge */}
                            <Ionicons name="checkmark-circle" size={18} color="#3B82F6" />
                        </View>
                        
                        {/* 2. Years of Experience */}
                        {m.years_of_experience != null && (
                            <View style={styles.expBadge}>
                                <Ionicons name="briefcase-outline" size={12} color={theme.colors.text.main} style={{marginRight:4}} />
                                <AppText style={styles.expText}>{m.years_of_experience} yrs exp</AppText>
                            </View>
                        )}
                    </View>

                    <View style={styles.dividerLine} />

                    {/* 3. Price per booking */}
                    <View style={styles.detailsRow}>
                        <View>
                            <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
                                <AppText style={styles.priceText}>₹{displayPrice.toLocaleString("en-IN")}</AppText>
                                <AppText style={styles.perBookingText}> / booking</AppText>
                            </View>
                            
                            {/* 4. Includes Text */}
                            <View style={styles.includesRow}>
                                <Ionicons name="checkmark-circle-outline" size={14} color={theme.colors.primary} style={{marginRight: 4}} />
                                <AppText style={styles.includesText}>Includes 2 x 55 min sessions</AppText>
                            </View>
                        </View>

                        {/* 5. Book Button */}
                        <TouchableOpacity style={styles.bookBtn} onPress={() => handleViewMentor(m.id)}>
                            <AppText style={styles.bookBtnText}>Book</AppText>
                        </TouchableOpacity>
                    </View>

                  </View>
                </Card>
              );
            })
          )}
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f5f0" },
  scrollContent: { paddingBottom: 40 },
  
  // Header
  headerContainer: {
    paddingTop: 40, 
    paddingBottom: 20, 
    paddingHorizontal: 32, 
    backgroundColor: "#f8f5f0",
  },
  headerContainerMobile: { 
    paddingHorizontal: 20, 
    paddingTop: 20 
  },
  headerLeft: { width: '100%' },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: theme.colors.text.main, marginBottom: 4 },
  headerSubtitle: { fontSize: 15, color: theme.colors.text.light, maxWidth: 600 },
  headerDivider: { height: 1, backgroundColor: theme.colors.border, width: "100%" },

  // Filters
  filtersContainer: { paddingHorizontal: 32, paddingTop: 24, marginBottom: 24 },
  filterLabel: { 
    fontSize: 16, 
    fontFamily: theme.typography.fontFamily.bold, 
    color: theme.colors.text.main, 
    marginBottom: 16 
  },
  pillsScroll: { gap: 12, paddingRight: 20 },
  pill: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 999, borderWidth: 1 },
  pillActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  pillInactive: { backgroundColor: "#FFF", borderColor: "#E5E7EB" },
  pillText: { fontSize: 14, fontWeight: "500" },
  pillTextActive: { color: "#FFF" },
  pillTextInactive: { color: "#4B5563" },
  resultsCount: { marginTop: 16, fontSize: 14, color: theme.colors.text.light },

  // List
  listContainer: { paddingHorizontal: 32, gap: 16, paddingBottom: 24 },
  
  // Cleaned Up Card Styles
  card: { 
    backgroundColor: theme.white, 
    borderRadius: 12, 
    padding: 20, 
    borderWidth: 0.5, // <--- Thinner Border
    borderColor: "#F3F4F6", // <--- Much Lighter Gray
    // Add subtle shadow for depth
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
      android: { elevation: 2 }
    })
  },
  cardContent: { gap: 12 },
  
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 },
  
  // New Identity Group container for Name + Badge
  identityGroup: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  mentorName: { fontSize: 18, fontWeight: "bold", color: theme.colors.text.main, flexShrink: 1 },
  
  expBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.gray[100], paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  expText: { fontSize: 12, fontWeight: "600", color: theme.colors.text.body },

  dividerLine: { height: 1, backgroundColor: '#F3F4F6', width: '100%' },

  detailsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 },
  
  priceText: { fontSize: 20, fontWeight: "800", color: theme.colors.text.main },
  perBookingText: { fontSize: 12, color: "#9CA3AF" },
  
  includesRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  includesText: { fontSize: 12, color: theme.colors.text.light, fontWeight: '500' },

  bookBtn: { backgroundColor: theme.colors.primary, paddingVertical: 10, paddingHorizontal: 24, borderRadius: 8 },
  bookBtnText: { color: '#FFF', fontWeight: '600', fontSize: 14 },

  emptyState: { alignItems: 'center', padding: 40 },
  emptyText: { marginTop: 10, color: theme.colors.text.light },
});