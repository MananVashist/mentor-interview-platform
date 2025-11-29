import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
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

  const getBadgeStyle = (tier: string) => {
    switch (tier) {
      case 'Gold': return { bg: theme.colors.pricing.goldBg, text: theme.colors.pricing.goldText, border: theme.colors.pricing.goldBorder };
      case 'Silver': return { bg: theme.colors.pricing.silverBg, text: theme.colors.pricing.silverText, border: theme.colors.pricing.silverBorder };
      case 'Bronze': return { bg: theme.colors.badge.bronze.bg, text: theme.colors.badge.bronze.text, border: theme.colors.badge.bronze.border };
      default: return { bg: theme.colors.pricing.blueBg, text: theme.colors.pricing.blueText, border: theme.colors.pricing.blueBorder };
    }
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
          
          {/* 🟢 REMOVED: Search Bar completely */}
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
                        
                        <View style={[styles.badge, { backgroundColor: badgeStyle.bg, borderColor: badgeStyle.border }]}>
                          <Ionicons 
                            name={isNew ? "sparkles" : "trophy"} 
                            size={10} 
                            color={badgeStyle.text} 
                            style={{ marginRight: 4 }} 
                          />
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
                            <AppText style={styles.perSessionText}> / booking</AppText>
                         </View>
                         {/* 🟢 IMPROVED TYPOGRAPHY */}
                         <View style={styles.includesBadge}>
                           <Ionicons name="videocam-outline" size={12} color={theme.colors.primary} style={{ marginRight: 4 }} />
                           <AppText style={styles.feeText}>Includes 2 × 1-hour sessions</AppText>
                         </View>
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
  container: { flex: 1, backgroundColor: "#f8f5f0" },
  scrollContent: { paddingBottom: 0 },
  
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
  card: { backgroundColor: theme.white, borderRadius: 16, padding: 24, borderWidth: 1, borderColor: "#E5E7EB" },
  
  cardRow: { flexDirection: "row", gap: 32 },
  cardCol: { flexDirection: "column", gap: 16 },

  cardLeft: { flex: 1 },
  mentorName: { fontSize: 18, fontWeight: "bold", color: theme.colors.text.main, marginBottom: 10 },
  tagsRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  expPill: { backgroundColor: theme.colors.gray[100], paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  expText: { fontSize: 13, fontWeight: "500", color: theme.colors.text.body },
  badge: { flexDirection: "row", alignItems: "center", borderWidth: 1, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 11, fontWeight: "800", letterSpacing: 0.5 },
  description: { fontSize: 14, color: "#4B5563", lineHeight: 24 },

  cardRight: {
    minWidth: 200, borderLeftWidth: 1, borderLeftColor: "#F3F4F6", paddingLeft: 24,
    justifyContent: "space-between",
  },
  cardRightMobile: { minWidth: "100%", borderLeftWidth: 0, paddingLeft: 0, flexDirection: 'column' },
  mobileDivider: { height: 1, backgroundColor: '#F3F4F6', width: '100%', marginVertical: 16 },
  
  priceBlock: { marginBottom: 16 },
  priceText: { fontSize: 24, fontWeight: "800", color: theme.colors.text.main },
  perSessionText: { fontSize: 12, color: "#9CA3AF" },
  
  // 🟢 IMPROVED TYPOGRAPHY STYLES
  includesBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5', // Very light green bg
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  feeText: { 
    fontSize: 12, 
    color: theme.colors.primary, 
    fontWeight: '600',
    letterSpacing: 0.2
  },

  buttonStack: { gap: 10 },
  solidBtn: { width: "100%", paddingVertical: 12, borderRadius: 8, backgroundColor: theme.colors.primary, alignItems: "center", justifyContent: "center" },
  solidBtnText: { fontSize: 14, fontWeight: "600", color: "#FFF" },
  outlineBtn: { width: "100%", paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: "#E5E7EB", backgroundColor: "#FFF", alignItems: "center", justifyContent: "center" },
  outlineBtnText: { fontSize: 14, fontWeight: "600", color: theme.colors.text.main },

  emptyState: { alignItems: 'center', padding: 40 },
  emptyText: { marginTop: 10, color: theme.colors.text.light },
});