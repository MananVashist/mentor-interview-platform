import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  useWindowDimensions,
  Platform,
  Modal,
  Pressable
} from "react-native";
import { useRouter } from "expo-router";
import { Svg, Path, Circle } from "react-native-svg";
import {
  Heading,
  AppText,
  Card,
  ScreenBackground,
} from "@/lib/ui";
import { theme } from "@/lib/theme";
import { availabilityService } from "@/services/availability.service";
import { supabase } from "@/lib/supabase/client";

const SUPABASE_URL = "https://rcbaaiiawrglvyzmawvr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjYmFhaWlhd3JnbHZ5em1hd3ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNTA1NjAsImV4cCI6MjA3NjcyNjU2MH0.V3qRHGXBMlspRS7XFJlXdo4qIcCms60Nepp7dYMEjLA";

// --- STRICT TYPOGRAPHY SYSTEM ---
const FONTS = {
  heading: { fontSize: 20, fontWeight: "700" as const, lineHeight: 28 },
  body: { fontSize: 14, fontWeight: "400" as const, lineHeight: 20 },
  bodyBold: { fontSize: 14, fontWeight: "600" as const, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: "400" as const, lineHeight: 16 },
  captionBold: { fontSize: 12, fontWeight: "600" as const, lineHeight: 16 },
};

const TIER_RANK: Record<string, number> = {
  bronze: 1,
  silver: 2,
  gold: 3,
};

type SortOption = 'tier' | 'price_low' | 'price_high' | 'sessions' | 'rating' | 'experience';

type AdminProfile = { 
  id: number; 
  name: string; 
  description: string | null; 
  is_active: boolean; 
  mentorCount?: number;
};

type Mentor = { 
  id: string; 
  professional_title?: string | null; 
  experience_description?: string | null; 
  profile_ids?: number[];
  session_price_inr?: number | null; 
  session_price?: number | null;
  total_sessions?: number;
  years_of_experience?: number | null;
  average_rating?: number | null;
  tier?: string | null;
};

// ============================================
// SVG ICONS
// ============================================

const CheckmarkCircleIcon = ({ size = 16, color = "#3B82F6" }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none" />
    <Path d="M8 12.5L10.5 15L16 9.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const BriefcaseIcon = ({ size = 12, color = "#111827" }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M16 7V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const SparklesIcon = ({ size = 14, color = "#1E40AF" }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 14.5L2 12L9.5 9.5L12 2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M6 3L6.5 5.5L9 6L6.5 6.5L6 9L5.5 6.5L3 6L5.5 5.5L6 3Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CheckmarkDoneIcon = ({ size = 14, color = "#6B7280" }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M5 12L10 17L20 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M2 12L7 17" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CheckmarkIcon = ({ size = 16, color = "#FFF" }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M5 13L9 17L19 7" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const SearchIcon = ({ size = 48, color = "#9CA3AF" }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth="2" />
    <Path d="M21 21L16.65 16.65" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const MedalIcon = ({ size = 14, color = "#CD7F32" }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="15" r="6" fill={color} stroke={color} strokeWidth="1.5" />
    <Path d="M9 9L7 3L12 6L17 3L15 9" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </Svg>
);

const InfoIcon = ({ size = 16, color = "#6B7280" }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Path d="M12 16v-4" />
    <Path d="M12 8h.01" />
  </Svg>
);

// ============================================
// STAR RATING COMPONENT
// ============================================

const StarRating = ({ rating }: { rating: number }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<AppText key={i} style={styles.starFilled}>★</AppText>);
    } else if (i === fullStars && hasHalfStar) {
      stars.push(
        <View key={i} style={{ position: 'relative' }}>
          <AppText style={styles.starEmpty}>★</AppText>
          <AppText style={[styles.starFilled, { position: 'absolute', width: '50%', overflow: 'hidden' }]}>★</AppText>
        </View>
      );
    } else {
      stars.push(<AppText key={i} style={styles.starEmpty}>★</AppText>);
    }
  }

  return (
    <View style={styles.ratingSection}>
      <View style={styles.starsContainer}>{stars}</View>
      <AppText style={styles.ratingText}>{rating.toFixed(1)}</AppText>
    </View>
  );
};

// ============================================
// TIER BADGE COMPONENT
// ============================================

const TierBadge = ({ tier }: { tier?: string | null }) => {
  let tierName = 'Bronze';
  let tierColor = '#8B4513';
  let bgColor = '#FFF8F0';
  let borderColor = '#CD7F32';
  let medalColor = '#CD7F32';

  const normalizedTier = tier?.toLowerCase();
  
  if (normalizedTier === 'gold') {
    tierName = 'Gold';
    tierColor = '#B8860B';        
    bgColor = '#FFFEF5';          
    borderColor = '#FFD700';      
    medalColor = '#FFD700';       
  } else if (normalizedTier === 'silver') {
    tierName = 'Silver';
    tierColor = '#505050';        
    bgColor = '#F8F9FA';          
    borderColor = '#A8A8A8';      
    medalColor = '#C0C0C0';       
  }

  return (
    <View style={[styles.tierBadge, { backgroundColor: bgColor, borderColor: borderColor }]}>
      <MedalIcon size={14} color={medalColor} />
      <AppText style={[styles.tierText, { color: tierColor }]}>{tierName} Mentor</AppText>
    </View>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function CandidateDashboard() {
  const { width } = useWindowDimensions();
  const isMobile = width <= 768;
  const router = useRouter();

  const [adminProfiles, setAdminProfiles] = useState<AdminProfile[]>([]);
  const [profilesLoading, setProfilesLoading] = useState(true);
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(null);
  
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [mentorsLoading, setMentorsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [mentorAvailability, setMentorAvailability] = useState<Record<string, string>>({});
  
  const [sortBy, setSortBy] = useState<SortOption>('tier');
  const [showTierInfo, setShowTierInfo] = useState(false);
  
  // ✅ NEW: Store tier cut percentages
  const [tierMap, setTierMap] = useState<Record<string, number>>({});

  // --- 1. Fetch Profiles ---
  useEffect(() => {
    (async () => {
      setProfilesLoading(true);
      try {
        // Fetch Tiers First
        const { data: tiersData } = await supabase.from('mentor_tiers').select('tier, percentage_cut');
        const tMap: Record<string, number> = {};
        tiersData?.forEach((t: any) => tMap[t.tier] = t.percentage_cut);
        setTierMap(tMap);

        const profilesRes = await fetch(
          `${SUPABASE_URL}/rest/v1/interview_profiles_admin?select=*`, 
          { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
        );
        const profilesData = await profilesRes.json();
        
        const mentorsRes = await fetch(
          `${SUPABASE_URL}/rest/v1/mentors?select=*,tier&status=eq.approved`, 
          { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
        );
        const allMentors = await mentorsRes.json();
        
        if (profilesRes.ok && mentorsRes.ok) {
          const actives = (profilesData || []).filter((p: AdminProfile) => p.is_active !== false);
          
          const profileMentorCounts = actives.map((profile: AdminProfile) => {
            const mentorCount = (allMentors || []).filter((m: Mentor) => 
              Array.isArray(m.profile_ids) && m.profile_ids.includes(profile.id)
            ).length;
            return { ...profile, mentorCount };
          });
          
          const sortedProfiles = profileMentorCounts.sort((a, b) => b.mentorCount - a.mentorCount);
          setAdminProfiles(sortedProfiles);
          if (sortedProfiles.length > 0) setSelectedProfileId(sortedProfiles[0].id);
        }
      } catch (err) { 
        console.log("Error fetching profiles", err); 
      } finally { 
        setProfilesLoading(false); 
      }
    })();
  }, []);

  // --- 2. Fetch Mentors & Availability ---
  const fetchMentorsForProfile = useCallback(async (profileId: number | null) => {
    if (!profileId) return;
    setMentorsLoading(true);
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/mentors?select=*,tier&status=eq.approved`, 
        { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
      );
      const data = await res.json();
      
      if (res.ok) {
        const filtered = (data || []).filter((m: Mentor) => 
          Array.isArray(m.profile_ids) ? m.profile_ids.includes(profileId) : false
        );
        
        setMentors(filtered);

        // Fetch Actual Availability
        const availabilityPromises = filtered.map(async (m: Mentor) => {
          const slot = await availabilityService.findNextAvailableSlot(m.id);
          return { id: m.id, slot };
        });

        const availabilityResults = await Promise.all(availabilityPromises);
        const availabilityMap: Record<string, string> = {};
        availabilityResults.forEach(({ id, slot }) => {
          availabilityMap[id] = slot;
        });
        setMentorAvailability(availabilityMap);
      }
    } catch (err) { 
      console.log("Error fetching mentors", err); 
    } finally { 
      setMentorsLoading(false); 
    }
  }, []);

  useEffect(() => { 
    if (selectedProfileId) fetchMentorsForProfile(selectedProfileId); 
  }, [selectedProfileId, fetchMentorsForProfile]);

  // --- 3. Sorting Logic ---
  const sortedMentors = useMemo(() => {
    let sorted = [...mentors];
    
    // Helper to get display price
    const getPrice = (m: Mentor) => {
        const base = m.session_price_inr ?? m.session_price ?? 0;
        const cut = tierMap[m.tier || 'bronze'] || 50; 
        return Math.round(base / (1 - (cut/100)));
    };

    switch (sortBy) {
      case 'tier':
        sorted.sort((a, b) => {
          const rankA = TIER_RANK[a.tier?.toLowerCase() || 'bronze'] || 1;
          const rankB = TIER_RANK[b.tier?.toLowerCase() || 'bronze'] || 1;
          if (rankA !== rankB) return rankA - rankB; 
          return (b.total_sessions || 0) - (a.total_sessions || 0);
        });
        break;
      case 'price_low':
        sorted.sort((a, b) => getPrice(a) - getPrice(b));
        break;
      case 'price_high':
        sorted.sort((a, b) => getPrice(b) - getPrice(a));
        break;
      case 'sessions':
        sorted.sort((a, b) => (b.total_sessions || 0) - (a.total_sessions || 0));
        break;
      case 'rating':
        sorted.sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0));
        break;
      case 'experience':
        sorted.sort((a, b) => (b.years_of_experience || 0) - (a.years_of_experience || 0));
        break;
    }
    return sorted;
  }, [mentors, sortBy, tierMap]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMentorsForProfile(selectedProfileId);
    setRefreshing(false);
  };

  const handleViewMentor = (id: string) => {
    router.push({ pathname: "/candidate/[id]", params: { id } });
  };

  // Reusing SortButton for simplicity in UI
  const SortButton = ({ label, active, onPress }: { label: string, active: boolean, onPress: () => void }) => (
    <TouchableOpacity 
      style={[styles.sortBtn, active && styles.sortBtnActive]} 
      onPress={onPress}
    >
      <AppText style={[styles.sortBtnText, active && styles.sortBtnTextActive]}>{label}</AppText>
    </TouchableOpacity>
  );

  return (
    <ScreenBackground style={styles.container}>
       {/* --- TIER INFO MODAL --- */}
      <Modal
        visible={showTierInfo}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTierInfo(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowTierInfo(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <AppText style={styles.modalTitle}>Mentor Tiers</AppText>
              <TouchableOpacity onPress={() => setShowTierInfo(false)}>
                <AppText style={styles.modalClose}>✕</AppText>
              </TouchableOpacity>
            </View>
            <View style={styles.tierInfoRow}>
              <MedalIcon size={16} color="#FFD700" />
              <View>
                <AppText style={styles.tierInfoTitle}>Gold Mentor</AppText>
                <AppText style={styles.tierInfoDesc}>VPs, Directors, CXOs</AppText>
              </View>
            </View>
            <View style={styles.tierInfoRow}>
              <MedalIcon size={16} color="#C0C0C0" />
              <View>
                <AppText style={styles.tierInfoTitle}>Silver Mentor</AppText>
                <AppText style={styles.tierInfoDesc}>Senior Management & Leads</AppText>
              </View>
            </View>
            <View style={styles.tierInfoRow}>
              <MedalIcon size={16} color="#CD7F32" />
              <View>
                <AppText style={styles.tierInfoTitle}>Bronze Mentor</AppText>
                <AppText style={styles.tierInfoDesc}>Mid-level Professionals</AppText>
              </View>
            </View>
          </View>
        </Pressable>
      </Modal>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
        }
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* --- HEADER --- */}
        <View style={[styles.headerContainer, isMobile && styles.headerContainerMobile]}>
          <Heading level={1} style={styles.headerTitle}>Find Your Mentor</Heading>
          <AppText style={styles.headerSubtitle}>
            Select from a range of top industry professionals
          </AppText>
        </View>

        <View style={styles.headerDivider} />

        {/* --- FILTERS & RESULTS --- */}
        <View style={[styles.filtersContainer, isMobile && { paddingHorizontal: 20 }]}>
          <AppText style={styles.filterLabel}>Select Interview Profile</AppText>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.pillsScroll}
            style={{ marginBottom: 16 }}
          >
            {profilesLoading ? (
              <ActivityIndicator color={theme.colors.primary} />
            ) : (
              adminProfiles.map((p) => {
                const isActive = selectedProfileId === p.id;
                return (
                  <TouchableOpacity
                    key={p.id}
                    onPress={() => setSelectedProfileId(p.id)}
                    style={[styles.pill, isActive ? styles.pillActive : styles.pillInactive]}
                  >
                    {isActive && <View style={{ marginRight: 6 }}><CheckmarkIcon size={14} color="#FFF" /></View>}
                    <AppText style={[styles.pillText, isActive ? styles.pillTextActive : styles.pillTextInactive]}>
                      {p.name}
                    </AppText>
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>

          {/* --- SORT CONTROLS --- */}
          <View style={styles.sortContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 8 }}>
              {/* Using a simple text icon or existing SVG */}
               <AppText style={{ fontSize: 16, marginRight: 4 }}>⇅</AppText>
              <AppText style={styles.sortLabel}>Sort by:</AppText>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              <SortButton label="Tier" active={sortBy === 'tier'} onPress={() => setSortBy('tier')} />
              <SortButton label="Sessions" active={sortBy === 'sessions'} onPress={() => setSortBy('sessions')} />
              <SortButton label="Price: Low" active={sortBy === 'price_low'} onPress={() => setSortBy('price_low')} />
              <SortButton label="Price: High" active={sortBy === 'price_high'} onPress={() => setSortBy('price_high')} />
              <SortButton label="Rating" active={sortBy === 'rating'} onPress={() => setSortBy('rating')} />
              <SortButton label="Experience" active={sortBy === 'experience'} onPress={() => setSortBy('experience')} />
            </ScrollView>
          </View>

          {/* --- RESULTS BAR WITH TIER INFO --- */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
            <AppText style={styles.resultsCount}>
              {sortedMentors.length} {sortedMentors.length === 1 ? "mentor" : "mentors"} available
            </AppText>
            
            <TouchableOpacity onPress={() => setShowTierInfo(true)} style={styles.infoBtn}>
              <InfoIcon size={14} color="#3B82F6" />
              <AppText style={styles.infoBtnText}>About Tiers</AppText>
            </TouchableOpacity>
          </View>
        </View>

        {/* --- MENTORS LIST (ORIGINAL CARD DESIGN) --- */}
        <View style={[styles.listContainer, isMobile && { paddingHorizontal: 20 }]}>
          {mentorsLoading ? (
            <ActivityIndicator size="large" color={theme.colors.primary} />
          ) : sortedMentors.length === 0 ? (
            <View style={styles.emptyState}>
              <SearchIcon size={48} color={theme.colors.text.light} />
              <AppText style={styles.emptyText}>No mentors found for this profile.</AppText>
            </View>
          ) : (
            sortedMentors.map((m) => {
              const basePrice = m.session_price_inr ?? m.session_price ?? 0;
              const cut = tierMap[m.tier || 'bronze'] || 50; 
              // Final Price = Base / (1 - Cut%)
              const displayPrice = basePrice ? Math.round(basePrice / (1 - (cut/100))) : 0;
              
              const totalSessions = m.total_sessions ?? 0;
              const isNewMentor = totalSessions === 0;
              const averageRating = m.average_rating ?? 0;
              const showRating = totalSessions >= 3 && averageRating > 0;
              
              const nextSlot = mentorAvailability[m.id] || "Loading...";
              const hasSlots = nextSlot !== "No slots available" && nextSlot !== "Loading...";
              // Use real slot if available, else standard message
              const displaySlot = hasSlots ? nextSlot : "No slots available";

              return (
                <Card key={m.id} style={styles.card}>
                  <View style={styles.cardContent}>
                    
                    {/* ORIGINAL TOP ROW */}
                    <View style={styles.topRow}>
                      <View style={styles.identityGroup}>
                        <AppText style={styles.mentorName}>
                          {m.professional_title || "Senior Mentor"}
                        </AppText>
                        <View style={styles.verifiedBadge}>
                          <CheckmarkCircleIcon size={16} color="#3B82F6" />
                          <AppText style={styles.verifiedText}>Verified</AppText>
                        </View>
                      </View>
                      {m.years_of_experience != null && (
                        <View style={styles.expBadge}>
                          <BriefcaseIcon size={12} color={theme.colors.text.main} />
                          <AppText style={styles.expText}>{m.years_of_experience} yrs exp</AppText>
                        </View>
                      )}
                    </View>

                    {/* ORIGINAL STATS ROW */}
                    <View style={styles.statsRow}>
                      <TierBadge tier={m.tier} />
                      
                      {isNewMentor ? (
                        <View style={styles.statItem}>
                          <SparklesIcon size={14} color="#1E40AF" />
                          <View style={styles.newBadge}>
                            <AppText style={styles.newBadgeText}>New</AppText>
                          </View>
                        </View>
                      ) : (
                        <View style={styles.statItem}>
                          <CheckmarkDoneIcon size={14} color="#6B7280" />
                          <AppText style={styles.statText}>
                            <AppText style={styles.statValue}>{totalSessions}</AppText> sessions
                          </AppText>
                        </View>
                      )}
                      
                      {showRating && <StarRating rating={averageRating} />}
                      
                      <View style={[styles.availabilityBadge, !hasSlots && styles.availabilityBadgeUnavailable]}>
                        <AppText style={styles.availabilityIcon}>{hasSlots ? '🟢' : '⏰'}</AppText>
                        {/* REPLACED "Check Calendar" with REAL DATA */}
                        <AppText style={[styles.availabilityText, !hasSlots && styles.availabilityTextUnavailable]}>
                          Next slot: {displaySlot}
                        </AppText>
                      </View>
                    </View>

                    <View style={styles.dividerLine} />

                    {/* ORIGINAL DETAILS ROW */}
                    <View style={styles.detailsRow}>
                      <View>
                        <AppText style={styles.priceText}>₹{displayPrice.toLocaleString()}</AppText>
                        <AppText style={styles.perBookingText}>per session</AppText>
                        <View style={styles.includesRow}>
                          <AppText style={styles.includesIcon}>✓</AppText>
                          <AppText style={styles.includesText}>1 focused mock interview</AppText>
                        </View>
                      </View>
                      
                      <TouchableOpacity 
                        style={styles.bookBtn} 
                        onPress={() => handleViewMentor(m.id)}
                        activeOpacity={0.8}
                      >
                        <AppText style={styles.bookBtnText}>View Profile</AppText>
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
  container: { flex: 1 },
  scrollContent: { paddingBottom: 40 },

  // Header
  headerContainer: { paddingHorizontal: 32, paddingTop: 32, paddingBottom: 24, backgroundColor: "#f8f5f0" },
  headerContainerMobile: { paddingHorizontal: 20 },
  headerLeft: { maxWidth: 800 },
  headerTitle: { ...FONTS.heading, fontSize: 32, color: theme.colors.text.main, marginBottom: 8 },
  headerSubtitle: { ...FONTS.body, color: theme.colors.text.light, maxWidth: 600 },
  headerDivider: { height: 1, backgroundColor: theme.colors.border, width: "100%" },

  // Filters & Sort
  filtersContainer: { paddingHorizontal: 32, paddingTop: 24, marginBottom: 24 },
  filterLabel: { ...FONTS.bodyBold, fontSize: 16, color: theme.colors.text.main, marginBottom: 16 },
  pillsScroll: { gap: 12, paddingRight: 20 },
  
  pill: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 999, borderWidth: 1 },
  pillActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  pillInactive: { backgroundColor: "#FFF", borderColor: "#E5E7EB" },
  pillText: { ...FONTS.body, fontWeight: "500" },
  pillTextActive: { color: "#FFF" },
  pillTextInactive: { color: "#4B5563" },
  
  // Sorting Styles
  sortContainer: { marginTop: 16, flexDirection: 'row', alignItems: 'center' },
  sortLabel: { ...FONTS.caption, fontSize: 13, color: '#6B7280', fontWeight: '500', marginLeft: 6 },
  sortBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB' },
  sortBtnActive: { backgroundColor: '#EEF2FF', borderColor: theme.colors.primary },
  sortBtnText: { ...FONTS.caption, color: '#4B5563', fontWeight: '500' },
  sortBtnTextActive: { color: theme.colors.primary, fontWeight: '600' },

  resultsCount: { ...FONTS.body, fontSize: 14, color: theme.colors.text.light },
  
  // Info Btn
  infoBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  infoBtnText: { ...FONTS.captionBold, color: '#3B82F6', textDecorationLine: 'underline' },

  // List
  listContainer: { paddingHorizontal: 32, gap: 16, paddingBottom: 24 },
  
  // Card
  card: { backgroundColor: theme.white, borderRadius: 12, padding: 20, borderWidth: 0.5, borderColor: "#F3F4F6", ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 }, android: { elevation: 2, backgroundColor: '#FFF' } }) },
  cardContent: { gap: 12 },
  
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 },
  identityGroup: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  mentorName: { ...FONTS.heading, fontSize: 18, color: theme.colors.text.main, flexShrink: 1 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  verifiedText: { ...FONTS.captionBold, color: '#3B82F6' },
  expBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.gray[100], paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, gap: 4 },
  expText: { ...FONTS.captionBold, color: theme.colors.text.body },

  statsRow: { flexDirection: 'row', gap: 16, alignItems: 'center', flexWrap: 'wrap' },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statText: { ...FONTS.caption, fontSize: 13, color: '#4B5563' },
  statValue: { fontWeight: '600', color: '#111827' },
  newBadge: { backgroundColor: '#DBEAFE', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  newBadgeText: { ...FONTS.captionBold, color: '#1E40AF' },

  // Tier Badge
  tierBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, borderWidth: 1 },
  tierText: { ...FONTS.captionBold },
  
  // Rating
  ratingSection: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  starsContainer: { flexDirection: 'row', gap: 2 },
  starFilled: { fontSize: 14, color: '#FBBF24' },
  starEmpty: { fontSize: 14, color: '#D1D5DB' },
  ratingText: { ...FONTS.captionBold, fontSize: 13, color: '#111827' },
  
  // Availability
  availabilityBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#ECFDF5', borderWidth: 1, borderColor: '#D1FAE5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  availabilityBadgeUnavailable: { backgroundColor: '#F3F4F6', borderColor: '#E5E7EB' },
  availabilityIcon: { fontSize: 12 },
  availabilityText: { ...FONTS.caption, fontWeight: '500', color: '#047857' },
  availabilityTextUnavailable: { color: '#6B7280' },

  dividerLine: { height: 1, backgroundColor: '#F3F4F6', width: '100%' },

  detailsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 },
  priceText: { ...FONTS.heading, fontSize: 20, color: theme.colors.text.main },
  perBookingText: { ...FONTS.caption, color: "#9CA3AF" },
  includesRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 },
  includesIcon: { fontSize: 14, color: theme.colors.primary },
  includesText: { ...FONTS.caption, color: theme.colors.text.light, fontWeight: '500' },

  bookBtn: { backgroundColor: theme.colors.primary, paddingVertical: 10, paddingHorizontal: 24, borderRadius: 8 },
  bookBtnText: { ...FONTS.bodyBold, color: '#FFF' },

  // Empty
  emptyState: { alignItems: 'center', padding: 40 },
  emptyText: { ...FONTS.body, marginTop: 10, color: theme.colors.text.light },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: 'white', borderRadius: 12, padding: 20, width: '100%', maxWidth: 400 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  modalTitle: { ...FONTS.heading, fontSize: 18 },
  modalClose: { fontSize: 20, color: '#6B7280' },
  tierInfoRow: { flexDirection: 'row', gap: 12, marginBottom: 16, alignItems: 'center' },
  tierInfoTitle: { ...FONTS.bodyBold },
  tierInfoDesc: { ...FONTS.caption, color: '#4B5563' },
});