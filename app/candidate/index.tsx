// app/candidate/index.tsx
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Platform,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Heading,
  AppText,
  Card,
  ScreenBackground,
} from "@/lib/ui";
import { calculateMentorTier } from "@/lib/logic";

// --- EXACT theme MATCHING YOUR HTML ---
const theme = {
  primary: "#0F766E", 
  primaryBtn: "#0d9488",
  bg: "#F9FAFB",
  white: "#FFFFFF",
  textMain: "#111827",
  textSub: "#6B7280", 
  border: "#E5E7EB",
  // Bronze
  bronzeBg: "#FFFBEB",
  bronzeText: "#B45309",
  bronzeBorder: "#FEF3C7",
  // Silver
  silverBg: "#F3F4F6",
  silverText: "#4B5563",
  silverBorder: "#E5E7EB",
  // Gold
  goldBg: "#FEFCE8",
  goldText: "#854D0E",
  goldBorder: "#FEF9C3",
  // NEW - Blue (FIX #3)
  newBg: "#DBEAFE",
  newText: "#2563EB",
  newBorder: "#BFDBFE",
  // Experience Pill
  expBg: "#F3F4F6",
  expText: "#374151",
};

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
      // ✅ FIX #2: Changed from is_approved=eq.true to status=eq.approved
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

  // Helper for dynamic badge styles
  const getBadgeStyle = (tier: string) => {
    switch (tier) {
      case 'Gold': return { bg: theme.goldBg, text: theme.goldText, border: theme.goldBorder };
      case 'Silver': return { bg: theme.silverBg, text: theme.silverText, border: theme.silverBorder };
      case 'Bronze': return { bg: theme.bronzeBg, text: theme.bronzeText, border: theme.bronzeBorder };
      // ✅ FIX #3: New mentors get BLUE styling
      default: return { bg: theme.newBg, text: theme.newText, border: theme.newBorder };
    }
  };

  return (
    <ScreenBackground style={styles.container}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* --- HEADER SECTION --- */}
        <View style={[styles.headerContainer, isMobile && styles.headerContainerMobile]}>
          <View style={[styles.headerLeft, isMobile && { marginBottom: 16 }]}>
            <Heading level={1} style={styles.headerTitle}>Find Your Mentor</Heading>
            <AppText style={styles.headerSubtitle}>
              Select a profile below and connect with experienced professionals
            </AppText>
          </View>
          
          {/* Search Bar */}
          <View style={[styles.searchWrapper, isMobile && styles.searchWrapperMobile]}>
            <Ionicons name="search" size={20} color="#9CA3AF" style={{ marginRight: 8 }} />
            <TextInput 
              placeholder="Search skills..." 
              placeholderTextColor="#9CA3AF"
              style={styles.searchInput} 
            />
          </View>
        </View>

        <View style={styles.headerDivider} />

        {/* --- FILTERS SECTION --- */}
        <View style={[styles.filtersContainer, isMobile && { paddingHorizontal: 20 }]}>
          <AppText style={styles.filterLabel}>Select Interview Profile</AppText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsScroll}>
            {profilesLoading ? (
              <ActivityIndicator color={theme.primary} />
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
            <ActivityIndicator size="large" color={theme.primary} />
          ) : mentors.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={48} color={theme.textSub} />
              <AppText style={styles.emptyText}>No mentors found for this profile.</AppText>
            </View>
          ) : (
            mentors.map((m) => {
              const price = m.session_price_inr ?? m.session_price ?? 0;
              const displayPrice = price ? Math.round(price * 1.2) : 0;
              
              // ✅ DYNAMIC TIER CALCULATION
              const tier = calculateMentorTier(m.total_sessions);
              const badgeStyle = getBadgeStyle(tier);
              const isNew = tier === 'New';

              return (
                <Card key={m.id} style={styles.card}>
                  <View style={isDesktop ? styles.cardRow : styles.cardCol}>
                    
                    {/* LEFT: Info */}
                    <View style={styles.cardLeft}>
                      <AppText style={styles.mentorName}>
                        {m.professional_title || "Backend Engineer (Node/Java)"}
                      </AppText>
                      
                      <View style={styles.tagsRow}>
                        <View style={styles.expPill}>
                          <AppText style={styles.expText}>5 years exp</AppText>
                        </View>
                        
                        {/* ✅ FIX #3: Dynamic Badge with BLUE for New mentors */}
                        <View style={[styles.badge, { backgroundColor: badgeStyle.bg, borderColor: badgeStyle.border }]}>
                          {isNew ? (
                            // Blue sparkles icon for NEW
                            <Ionicons name="sparkles" size={10} color={badgeStyle.text} style={{ marginRight: 4 }} />
                          ) : (
                            // Trophy icon for Bronze/Silver/Gold
                            <Ionicons name="trophy" size={10} color={badgeStyle.text} style={{ marginRight: 4 }} />
                          )}
                          <AppText style={[styles.badgeText, { color: badgeStyle.text }]}>
                            {isNew ? 'NEW' : tier.toUpperCase()}
                          </AppText>
                        </View>
                      </View>

                      <AppText style={styles.description} numberOfLines={3}>
                        {m.experience_description || "Covers API design, REST fundamentals, auth, SQL/NoSQL choices, caching and debugging."}
                      </AppText>
                    </View>

                    {/* RIGHT: Price + Actions */}
                    <View style={[styles.cardRight, isMobile && styles.cardRightMobile]}>
                      {isMobile && <View style={styles.mobileDivider} />}
                      
                      <View style={styles.priceBlock}>
                         <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                            <AppText style={styles.priceText}>
                              ₹{displayPrice.toLocaleString("en-IN")}
                            </AppText>
                            <AppText style={styles.perSessionText}> / session</AppText>
                         </View>
                         <AppText style={styles.feeText}>+ 20% platform fee</AppText>
                      </View>

                      <View style={[styles.buttonStack, isMobile && { flexDirection: 'row' }]}>
                        <TouchableOpacity style={[styles.solidBtn, isMobile && {flex: 1}]} onPress={() => handleViewMentor(m.id)}>
                          <AppText style={styles.solidBtnText}>Book</AppText>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.outlineBtn, isMobile && {flex: 1}]} onPress={() => handleViewMentor(m.id)}>
                          <AppText style={styles.outlineBtnText}>Details</AppText>
                        </TouchableOpacity>
                      </View>
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
  container: { flex: 1, backgroundColor: "#FFF" },
  scrollContent: { paddingBottom: 40 },
  
  // --- Header ---
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 32,
    backgroundColor: "#FFFFFF",
  },
  headerContainerMobile: {
    flexDirection: "column",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerLeft: { flex: 1 },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: theme.textMain, marginBottom: 4 },
  headerSubtitle: { fontSize: 15, color: theme.textSub, maxWidth: 500 },
  
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: 240,
    marginLeft: 20,
    marginTop: 4, 
  },
  searchWrapperMobile: {
    width: "100%", 
    marginLeft: 0,
    marginTop: 12,
  },
  searchInput: { flex: 1, fontSize: 14, color: theme.textMain },
  headerDivider: { height: 1, backgroundColor: theme.border, width: "100%" },

  // --- Filters ---
  filtersContainer: { paddingHorizontal: 32, paddingTop: 24, marginBottom: 24 },
  filterLabel: { fontSize: 14, fontWeight: "600", color: theme.textMain, marginBottom: 16 },
  pillsScroll: { gap: 12, paddingRight: 20 },
  pill: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 999, borderWidth: 1 },
  pillActive: { backgroundColor: theme.primaryBtn, borderColor: theme.primaryBtn },
  pillInactive: { backgroundColor: "#FFF", borderColor: "#E5E7EB" },
  pillText: { fontSize: 14, fontWeight: "500" },
  pillTextActive: { color: "#FFF" },
  pillTextInactive: { color: "#4B5563" },
  resultsCount: { marginTop: 16, fontSize: 14, color: theme.textSub },

  // --- List ---
  listContainer: { paddingHorizontal: 32, gap: 16 },
  card: { backgroundColor: "#FFF", borderRadius: 16, padding: 24, borderWidth: 1, borderColor: "#E5E7EB" },
  
  cardRow: { flexDirection: "row", gap: 32 },
  cardCol: { flexDirection: "column", gap: 16 },

  // Left Col
  cardLeft: { flex: 1 },
  mentorName: { fontSize: 18, fontWeight: "bold", color: theme.textMain, marginBottom: 10 },
  tagsRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  expPill: { backgroundColor: theme.expBg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  expText: { fontSize: 13, fontWeight: "500", color: theme.expText },
  badge: { flexDirection: "row", alignItems: "center", borderWidth: 1, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 11, fontWeight: "800", letterSpacing: 0.5 },
  description: { fontSize: 14, color: "#4B5563", lineHeight: 24 },

  // Right Col
  cardRight: {
    minWidth: 200,
    borderLeftWidth: 1,
    borderLeftColor: "#F3F4F6",
    paddingLeft: 24,
    justifyContent: "space-between",
  },
  cardRightMobile: {
    minWidth: "100%",
    borderLeftWidth: 0,
    paddingLeft: 0,
    flexDirection: 'column', 
  },
  mobileDivider: {
      height: 1,
      backgroundColor: '#F3F4F6',
      width: '100%',
      marginVertical: 16,
  },
  priceBlock: { marginBottom: 16 },
  priceText: { fontSize: 24, fontWeight: "800", color: theme.textMain },
  perSessionText: { fontSize: 12, color: "#9CA3AF" },
  feeText: { fontSize: 12, color: "#9CA3AF", marginTop: 4 },

  buttonStack: { gap: 10 },
  solidBtn: { width: "100%", paddingVertical: 12, borderRadius: 8, backgroundColor: theme.primaryBtn, alignItems: "center", justifyContent: "center" },
  solidBtnText: { fontSize: 14, fontWeight: "600", color: "#FFF" },
  outlineBtn: { width: "100%", paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: "#E5E7EB", backgroundColor: "#FFF", alignItems: "center", justifyContent: "center" },
  outlineBtnText: { fontSize: 14, fontWeight: "600", color: theme.textMain },

  emptyState: { alignItems: 'center', padding: 40 },
  emptyText: { marginTop: 10, color: theme.textSub },
});