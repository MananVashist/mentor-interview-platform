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
import { useAuthStore } from "@/lib/store";
import {
  colors,
  spacing,
  borderRadius,
  typography,
  shadows,
} from "@/lib/theme";
import {
  Heading,
  AppText,
  Card,
  Section,
  ScreenBackground,
} from "@/lib/ui";

// --- EXACT theme MATCHING YOUR HTML ---
const theme = {
  primary: "#0F766E", // Teal-700/600 mix to match the dark teal in image
  primaryBtn: "#0d9488", // Teal-600 for buttons
  bg: "#F9FAFB", // Gray-50
  white: "#FFFFFF",
  textMain: "#111827", // Gray-900
  textSub: "#6B7280", // Gray-500
  border: "#E5E7EB", // Gray-200
  
  // Badge Colors
  bronzeBg: "#FFFBEB", // Amber-50
  bronzeText: "#B45309", // Amber-700
  bronzeBorder: "#FEF3C7", // Amber-100
  
  expBg: "#F3F4F6", // Gray-100
  expText: "#374151", // Gray-700
};

const SUPABASE_URL = "https://rcbaaiiawrglvyzmawvr.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjYmFhaWlhd3JnbHZ5em1hd3ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNTA1NjAsImV4cCI6MjA3NjcyNjU2MH0.V3qRHGXBMlspRS7XFJlXdo4qIcCms60Nepp7dYMEjLA";

type AdminProfile = {
  id: number;
  name: string;
  description: string | null;
  is_active: boolean;
};

type Mentor = {
  id: string;
  email?: string;
  professional_title?: string | null;
  experience_description?: string | null;
  expertise_profiles?: string[];
  profile?: {
    full_name?: string | null;
    avatar_url?: string | null;
  };
  session_price_inr?: number | null;
  session_price?: number | null;
  total_sessions?: number | null;
  mentor_level?: string | null;
};

export default function CandidateDashboard() {
  const { width } = useWindowDimensions();
  const isDesktop = width > 768; // Simple responsive check
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
        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/interview_profiles_admin?select=*`,
          { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
        );
        const data = await res.json();
        if (res.ok) {
          const actives = (data || []).filter((p: AdminProfile) => p.is_active !== false);
          setAdminProfiles(actives);
          if (actives.length > 0) setSelectedProfile(actives[0].name);
        }
      } catch (err) {
        console.log("Error fetching profiles", err);
      } finally {
        setProfilesLoading(false);
      }
    })();
  }, []);

  const fetchMentorsForProfile = useCallback(async (profileName: string | null) => {
    if (!profileName) return;
    setMentorsLoading(true);
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/mentors?select=*,profile:profiles(*)`,
        { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
      );
      const data = await res.json();
      if (res.ok) {
        const filtered = (data || []).filter((m: Mentor) =>
          Array.isArray(m.expertise_profiles) ? m.expertise_profiles.includes(profileName) : false
        );
        setMentors(filtered);
      }
    } catch (err) {
      console.log("Error fetching mentors", err);
    } finally {
      setMentorsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedProfile) fetchMentorsForProfile(selectedProfile);
  }, [selectedProfile, fetchMentorsForProfile]);

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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* --- HEADER SECTION (Left Aligned with Search on Right) --- */}
        <View style={styles.headerContainer}>
          <View style={styles.headerLeft}>
            <Heading level={1} style={styles.headerTitle}>Find Your Mentor</Heading>
            <AppText style={styles.headerSubtitle}>
              Select a profile below and connect with experienced professionals
            </AppText>
          </View>
          
          {/* Search Bar (Visible on Web/Tablet) */}
          <View style={styles.searchWrapper}>
            <Ionicons name="search" size={20} color="#9CA3AF" style={{ marginRight: 8 }} />
            <TextInput 
              placeholder="Search skills..." 
              placeholderTextColor="#9CA3AF"
              style={styles.searchInput} 
            />
          </View>
        </View>

        {/* --- SEPARATOR LINE --- */}
        <View style={styles.headerDivider} />

        {/* --- FILTERS SECTION --- */}
        <View style={styles.filtersContainer}>
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
        <View style={styles.listContainer}>
          {mentorsLoading ? (
            <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 40 }} />
          ) : mentors.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={48} color={theme.textSub} />
              <AppText style={styles.emptyText}>No mentors found for this profile.</AppText>
            </View>
          ) : (
            mentors.map((m) => {
              const price = m.session_price_inr ?? m.session_price ?? 0;
              const displayPrice = price ? Math.round(price * 1.2) : 0;

              return (
                <Card key={m.id} style={styles.card}>
                  
                  {/* --- CARD CONTENT (Flex Row on Desktop) --- */}
                  <View style={isDesktop ? styles.cardRow : styles.cardCol}>
                    
                    {/* LEFT COLUMN: Info */}
                    <View style={styles.cardLeft}>
                      {/* Title */}
                      <AppText style={styles.mentorName}>
                        {m.professional_title || "Backend Engineer (Node/Java)"}
                      </AppText>
                      
                      {/* Tags Row: Experience + Badge */}
                      <View style={styles.tagsRow}>
                        <View style={styles.expPill}>
                          <AppText style={styles.expText}>5 years exp</AppText>
                        </View>
                        <View style={styles.badge}>
                          <Ionicons name="star" size={10} color={theme.bronzeText} style={{ marginRight: 4 }} />
                          <AppText style={styles.badgeText}>BRONZE</AppText>
                        </View>
                      </View>

                      {/* Description */}
                      <AppText style={styles.description} numberOfLines={3}>
                        {m.experience_description || "Covers API design, REST fundamentals, auth, SQL/NoSQL choices, caching and debugging. Will also do a quick behavioral/on-call scenario."}
                      </AppText>
                    </View>

                    {/* RIGHT COLUMN: Price + Actions */}
                    <View style={styles.cardRight}>
                      {/* Price Block */}
                      <View style={styles.priceBlock}>
                         <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: isDesktop ? 'flex-start' : 'flex-start' }}>
                            <AppText style={styles.priceText}>
                              ₹{displayPrice.toLocaleString("en-IN")}
                            </AppText>
                            <AppText style={styles.perSessionText}> / session</AppText>
                         </View>
                         <AppText style={styles.feeText}>+ 20% platform fee</AppText>
                      </View>

                      {/* Buttons Stacked Vertically */}
                      <View style={styles.buttonStack}>
                        <TouchableOpacity style={styles.solidBtn} onPress={() => handleViewMentor(m.id)}>
                          <AppText style={styles.solidBtnText}>Book now →</AppText>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.outlineBtn} onPress={() => handleViewMentor(m.id)}>
                          <AppText style={styles.outlineBtnText}>View details</AppText>
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
  container: {
    flex: 1,
    backgroundColor: "#FFF", // White background for the whole screen often looks cleaner, or matches header
  },
  scrollContent: {
    paddingBottom: 40,
  },
  
  // --- Header ---
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start", // Align top
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 32,
    backgroundColor: "#FFFFFF",
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.textMain,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    color: theme.textSub,
    maxWidth: 500,
  },
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
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: theme.textMain,
    outlineStyle: "none", // For web
  },
  headerDivider: {
    height: 1,
    backgroundColor: theme.border,
    width: "100%",
  },

  // --- Filters ---
  filtersContainer: {
    paddingHorizontal: 32,
    paddingTop: 24,
    marginBottom: 24,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.textMain,
    marginBottom: 16,
  },
  pillsScroll: {
    gap: 12,
    paddingRight: 20,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  pillActive: {
    backgroundColor: theme.primaryBtn, // Solid Teal
    borderColor: theme.primaryBtn,
  },
  pillInactive: {
    backgroundColor: "#FFF",
    borderColor: "#E5E7EB",
  },
  pillText: {
    fontSize: 14,
    fontWeight: "500",
  },
  pillTextActive: {
    color: "#FFF",
  },
  pillTextInactive: {
    color: "#4B5563", // Gray-600
  },
  resultsCount: {
    marginTop: 16,
    fontSize: 14,
    color: theme.textSub,
  },

  // --- List ---
  listContainer: {
    paddingHorizontal: 32,
    gap: 16,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "transparent", // Remove heavy shadow to match clean HTML look
  },
  
  // Layout logic
  cardRow: {
    flexDirection: "row",
    gap: 32,
  },
  cardCol: {
    flexDirection: "column",
    gap: 24,
  },

  // Left Col
  cardLeft: {
    flex: 1,
  },
  mentorName: {
    fontSize: 18,
    fontWeight: "bold", // Bold title
    color: theme.textMain,
    marginBottom: 10,
  },
  tagsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  expPill: {
    backgroundColor: theme.expBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  expText: {
    fontSize: 13,
    fontWeight: "500",
    color: theme.expText,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.bronzeBg,
    borderWidth: 1,
    borderColor: theme.bronzeBorder,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: theme.bronzeText,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 14,
    color: "#4B5563", // Gray-600
    lineHeight: 24,
  },

  // Right Col
  cardRight: {
    minWidth: 200,
    borderLeftWidth: Platform.OS === 'web' ? 1 : 0, // Vertical divider on web
    borderLeftColor: "#F3F4F6",
    paddingLeft: Platform.OS === 'web' ? 24 : 0,
    justifyContent: "space-between",
  },
  priceBlock: {
    marginBottom: 16,
  },
  priceText: {
    fontSize: 24,
    fontWeight: "800", // Very bold price
    color: theme.textMain,
  },
  perSessionText: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  feeText: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 4,
  },

  // Buttons
  buttonStack: {
    gap: 10,
  },
  solidBtn: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: theme.primaryBtn,
    alignItems: "center",
    justifyContent: "center",
  },
  solidBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
  },
  outlineBtn: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
  },
  outlineBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.textMain,
  },

  // Empty
  emptyState: {
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    marginTop: 10,
    color: theme.textSub,
  },
});