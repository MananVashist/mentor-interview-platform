// app/candidate/index.tsx
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
  Pressable,
  Text,
  Image
} from "react-native";
import { useRouter } from "expo-router";
import { Svg, Path, Circle } from "react-native-svg";
import { Heading, AppText, Card, ScreenBackground } from "@/lib/ui";
import { theme } from "@/lib/theme";
import { availabilityService } from "@/services/availability.service";
import { supabase } from "@/lib/supabase/client";

const SUPABASE_URL = "https://rcbaaiiawrglvyzmawvr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjYmFhaWlhd3JnbHZ5em1hd3ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNTA1NjAsImV4cCI6MjA3NjcyNjU2MH0.V3qRHGXBMlspRS7XFJlXdo4qIcCms60Nepp7dYMEjLA";

// --- STRICT TYPOGRAPHY SYSTEM ---
const SYSTEM_FONT = Platform.select({
  web: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
  ios: "System",
  android: "Roboto",
  default: "System"
}) as string;

const FONTS = {
  heading: { fontFamily: SYSTEM_FONT, fontSize: 20, fontWeight: "700" as const, lineHeight: 28 },
  body: { fontFamily: SYSTEM_FONT, fontSize: 14, fontWeight: "400" as const, lineHeight: 20 },
  bodyBold: { fontFamily: SYSTEM_FONT, fontSize: 14, fontWeight: "600" as const, lineHeight: 20 },
  caption: { fontFamily: SYSTEM_FONT, fontSize: 12, fontWeight: "400" as const, lineHeight: 16 },
  captionBold: { fontFamily: SYSTEM_FONT, fontSize: 12, fontWeight: "600" as const, lineHeight: 16 },
};

type SortOption = 'price_low' | 'sessions' | 'rating' | 'experience';

type AdminProfile = { id: number; name: string; description: string | null; is_active: boolean; mentorCount?: number; };
type Mentor = { id: string; professional_title?: string | null; experience_description?: string | null; profile_ids?: number[]; session_price_inr?: number | null; session_price?: number | null; total_sessions?: number; years_of_experience?: number | null; average_rating?: number | null; tier?: string | null; avatar_url?: string | null; profiles?: { full_name?: string } | null; };

// ============================================
// SVG ICONS
// ============================================
const CheckmarkCircleIcon = ({ size = 16, color = "#3B82F6" }) => (<Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none" /><Path d="M8 12.5L10.5 15L16 9.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></Svg>);
const BriefcaseIcon = ({ size = 12, color = "#111827" }) => (<Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><Path d="M16 7V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></Svg>);
const SparklesIcon = ({ size = 14, color = "#1E40AF" }) => (<Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 14.5L2 12L9.5 9.5L12 2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><Path d="M6 3L6.5 5.5L9 6L6.5 6.5L6 9L5.5 6.5L3 6L5.5 5.5L6 3Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></Svg>);
const CheckmarkDoneIcon = ({ size = 14, color = "#6B7280" }) => (<Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M5 12L10 17L20 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><Path d="M2 12L7 17" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></Svg>);
const SearchIcon = ({ size = 48, color = "#9CA3AF" }) => (<Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Circle cx="11" cy="11" r="8" stroke={color} strokeWidth="2" /><Path d="M21 21L16.65 16.65" stroke={color} strokeWidth="2" strokeLinecap="round" /></Svg>);
const MedalIcon = ({ size = 14, color = "#CD7F32" }) => (<Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Circle cx="12" cy="15" r="6" fill={color} stroke={color} strokeWidth="1.5" /><Path d="M9 9L7 3L12 6L17 3L15 9" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" /></Svg>);
const InfoIcon = ({ size = 16, color = "#6B7280" }) => (<Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><Circle cx="12" cy="12" r="10" /><Path d="M12 16v-4" /><Path d="M12 8h.01" /></Svg>);

const StarRating = ({ rating }: { rating: number }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) stars.push(<Text key={i} style={styles.starFilled}>★</Text>);
    else if (i === fullStars && hasHalfStar) stars.push(<View key={i} style={{ position: 'relative' }}><Text style={styles.starEmpty}>★</Text><Text style={[styles.starFilled, { position: 'absolute', width: '50%', overflow: 'hidden' }]}>★</Text></View>);
    else stars.push(<Text key={i} style={styles.starEmpty}>★</Text>);
  }
  return <View style={styles.ratingSection}><View style={styles.starsContainer}>{stars}</View><Text style={styles.ratingText}>{rating.toFixed(1)}</Text></View>;
};

const TierBadge = ({ tier }: { tier?: string | null }) => {
  let tierName = 'Bronze', tierColor = '#8B4513', bgColor = '#FFF8F0', borderColor = '#CD7F32', medalColor = '#CD7F32';
  const t = tier?.toLowerCase();
  if (t === 'gold') { tierName = 'Gold'; tierColor = '#B8860B'; bgColor = '#FFFEF5'; borderColor = '#FFD700'; medalColor = '#FFD700'; } 
  else if (t === 'silver') { tierName = 'Silver'; tierColor = '#505050'; bgColor = '#F8F9FA'; borderColor = '#A8A8A8'; medalColor = '#C0C0C0'; }
  return (
    <View style={[styles.tierBadge, { backgroundColor: bgColor, borderColor: borderColor }]}>
      <MedalIcon size={14} color={medalColor} />
      <Text style={[styles.tierText, { color: tierColor }]}>{tierName} Mentor</Text>
    </View>
  );
};

// ============================================
// MENTOR CARD
// ============================================
const MentorCard = ({
  m, displayPrice, introPrice, totalSessions, isNewMentor,
  averageRating, showRating, hasSlots, displaySlot, onView,
}: any) => {
  const seed = m.id || m.profiles?.full_name || 'Mentor';
  const fallbackAvatar = `https://api.dicebear.com/9.x/micah/png?seed=${encodeURIComponent(seed)}&backgroundColor=e5e7eb,f3f4f6`;

  return (
    <Card style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.headerRow}>
          <Image source={{ uri: m.avatar_url || fallbackAvatar }} style={styles.avatarImage} />
          <View style={styles.headerInfo}>
            <View style={styles.identityGroup}>
              <Text style={styles.mentorName} numberOfLines={1}>{m.professional_title || 'Interview Mentor'}</Text>
              <View style={styles.verifiedBadge}><CheckmarkCircleIcon size={14} color="#3B82F6" /></View>
            </View>
            {m.years_of_experience != null && (
              <View style={{ alignSelf: 'flex-start', marginTop: 4 }}>
                <View style={styles.expBadge}>
                  <BriefcaseIcon size={12} color="#111827" />
                  <Text style={styles.expText}>{m.years_of_experience} yrs</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {m.experience_description && (
          <Text style={styles.bioText} numberOfLines={2}>{m.experience_description}</Text>
        )}

        <View style={styles.statsRow}>
          <TierBadge tier={m.tier} />
          {isNewMentor ? (
            <View style={styles.statItem}><SparklesIcon size={14} color="#1E40AF" /><View style={styles.newBadge}><Text style={styles.newBadgeText}>New</Text></View></View>
          ) : (
            <View style={styles.statItem}><CheckmarkDoneIcon size={14} color="#6B7280" /><Text style={styles.statText}><Text style={styles.statValue}>{totalSessions}</Text> sessions</Text></View>
          )}
          {showRating && <StarRating rating={averageRating} />}
          <View style={[styles.availabilityBadge, !hasSlots && styles.availabilityBadgeUnavailable]}>
            <Text style={styles.availabilityIcon}>{hasSlots ? '🟢' : '⏰'}</Text>
            <Text style={[styles.availabilityText, !hasSlots && styles.availabilityTextUnavailable]}>{hasSlots ? `Next slot: ${displaySlot}` : displaySlot}</Text>
          </View>
        </View>

        <View style={styles.dividerLine} />

        <View style={styles.actionRow}>
          <View style={styles.priceContainer}>
             <Text style={styles.startingAt}>Intro calls from</Text>
             <Text style={styles.basePrice}>₹{introPrice.toLocaleString()}</Text>
          </View>
          <TouchableOpacity style={styles.bookBtn} onPress={onView} activeOpacity={0.8}>
            <Text style={styles.bookBtnText}>View Profile & Book</Text>
          </TouchableOpacity>
        </View>

      </View>
    </Card>
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
  const [sortBy, setSortBy] = useState<SortOption>('price_low');
  const [showTierInfo, setShowTierInfo] = useState(false);
  const [tierMap, setTierMap] = useState<Record<string, number>>({});

  useEffect(() => {
    (async () => {
      setProfilesLoading(true);
      try {
        const { data: tiersData } = await supabase.from('mentor_tiers').select('tier, percentage_cut');
        const tMap: Record<string, number> = {};
        tiersData?.forEach((t: any) => tMap[t.tier] = t.percentage_cut);
        setTierMap(tMap);

        const profilesRes = await fetch(`${SUPABASE_URL}/rest/v1/interview_profiles_admin?select=*`, { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } });
        const profilesData = await profilesRes.json();
        
        const mentorsRes = await fetch(`${SUPABASE_URL}/rest/v1/mentors?select=*,tier,profiles(full_name)&status=eq.approved`, { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } });
        const allMentors = await mentorsRes.json();
        
        if (profilesRes.ok && mentorsRes.ok) {
          const actives = (profilesData || []).filter((p: AdminProfile) => p.is_active !== false);
          const profileMentorCounts = actives.map((profile: AdminProfile) => {
            const mentorCount = (allMentors || []).filter((m: Mentor) => Array.isArray(m.profile_ids) && m.profile_ids.includes(profile.id)).length;
            return { ...profile, mentorCount };
          });
          const sortedProfiles = profileMentorCounts.sort((a, b) => b.mentorCount - a.mentorCount);
          setAdminProfiles(sortedProfiles);
          if (sortedProfiles.length > 0) setSelectedProfileId(sortedProfiles[0].id);
        }
      } catch (err) { console.log("Error", err); } finally { setProfilesLoading(false); }
    })();
  }, []);

  const fetchMentorsForProfile = useCallback(async (profileId: number | null) => {
    if (!profileId) return;
    setMentorsLoading(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/mentors?select=*,tier,profiles(full_name)&status=eq.approved`, { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } });
      const data = await res.json();
      
      if (res.ok) {
        const filtered = (data || []).filter((m: Mentor) => Array.isArray(m.profile_ids) ? m.profile_ids.includes(profileId) : false);
        setMentors(filtered);

        const availabilityPromises = filtered.map(async (m: Mentor) => {
          const slot = await availabilityService.findNextAvailableSlot(m.id);
          return { id: m.id, slot };
        });
        const availabilityResults = await Promise.all(availabilityPromises);
        const availabilityMap: Record<string, string> = {};
        availabilityResults.forEach(({ id, slot }) => { availabilityMap[id] = slot; });
        setMentorAvailability(availabilityMap);
      }
    } catch (err) { console.log("Error", err); } finally { setMentorsLoading(false); }
  }, []);

  useEffect(() => { if (selectedProfileId) fetchMentorsForProfile(selectedProfileId); }, [selectedProfileId, fetchMentorsForProfile]);

  const sortedMentors = useMemo(() => {
    let sorted = [...mentors];
    const getPrice = (m: Mentor) => {
        const base = m.session_price_inr ?? m.session_price ?? 0;
        const cut = tierMap[m.tier || 'bronze'] || 50; 
        return Math.round(base / (1 - (cut/100)));
    };
    switch (sortBy) {
      case 'price_low': sorted.sort((a, b) => getPrice(a) - getPrice(b)); break;
      case 'sessions': sorted.sort((a, b) => (b.total_sessions || 0) - (a.total_sessions || 0)); break;
      case 'rating': sorted.sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0)); break;
      case 'experience': sorted.sort((a, b) => (b.years_of_experience || 0) - (a.years_of_experience || 0)); break;
    }
    return sorted;
  }, [mentors, sortBy, tierMap]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMentorsForProfile(selectedProfileId);
    setRefreshing(false);
  };

  const handleViewMentor = (id: string) => { router.push({ pathname: "/candidate/[id]", params: { id } }); };

  const ChipBtn = ({ label, active, onPress }: { label: string, active: boolean, onPress: () => void }) => (
    <TouchableOpacity style={[styles.chip, active && styles.chipActive]} onPress={onPress}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <ScreenBackground style={styles.container}>
      <Modal visible={showTierInfo} transparent={true} animationType="fade" onRequestClose={() => setShowTierInfo(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowTierInfo(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Mentor Tiers</Text>
              <TouchableOpacity onPress={() => setShowTierInfo(false)}><Text style={styles.modalClose}>✕</Text></TouchableOpacity>
            </View>
            <View style={styles.tierInfoRow}><MedalIcon size={16} color="#FFD700" /><View><Text style={styles.tierInfoTitle}>Gold Mentor</Text><Text style={styles.tierInfoDesc}>VPs, Directors, CXOs</Text></View></View>
            <View style={styles.tierInfoRow}><MedalIcon size={16} color="#C0C0C0" /><View><Text style={styles.tierInfoTitle}>Silver Mentor</Text><Text style={styles.tierInfoDesc}>Senior Management & Leads</Text></View></View>
            <View style={styles.tierInfoRow}><MedalIcon size={16} color="#CD7F32" /><View><Text style={styles.tierInfoTitle}>Bronze Mentor</Text><Text style={styles.tierInfoDesc}>Mid-level Professionals</Text></View></View>
          </View>
        </Pressable>
      </Modal>

      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={[styles.headerContainer, isMobile && styles.headerContainerMobile]}>
          <Heading level={1} style={styles.headerTitle}>Find Your Mentor</Heading>
          <AppText style={styles.headerSubtitle}>Select from a range of top industry professionals</AppText>
        </View>

        <View style={styles.headerDivider} />

        <View style={styles.controlsWrapper}>
          <View style={styles.controlRow}>
            <Text style={styles.controlLabel}>Role</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
              {profilesLoading ? <ActivityIndicator color={theme.colors.primary} /> : adminProfiles.map((p) => (
                <ChipBtn key={p.id} label={p.name} active={selectedProfileId === p.id} onPress={() => setSelectedProfileId(p.id)} />
              ))}
            </ScrollView>
          </View>
          <View style={styles.controlRow}>
             <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.controlLabel}>Sort</Text>
                <TouchableOpacity onPress={() => setShowTierInfo(true)} style={{ padding: 4 }}><InfoIcon size={14} color="#9CA3AF" /></TouchableOpacity>
             </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
              <ChipBtn label="Price (Low)" active={sortBy === 'price_low'} onPress={() => setSortBy('price_low')} />
              <ChipBtn label="Most Sessions" active={sortBy === 'sessions'} onPress={() => setSortBy('sessions')} />
              <ChipBtn label="Highest Rated" active={sortBy === 'rating'} onPress={() => setSortBy('rating')} />
              <ChipBtn label="Experience" active={sortBy === 'experience'} onPress={() => setSortBy('experience')} />
            </ScrollView>
          </View>
          <View style={styles.resultsCountWrapper}>
             <Text style={styles.resultsCount}>Showing {sortedMentors.length} {sortedMentors.length === 1 ? 'mentor' : 'mentors'}</Text>
          </View>
        </View>

        <View style={[styles.listContainer, isMobile && { paddingHorizontal: 16 }]}>
          {mentorsLoading ? (
            <ActivityIndicator size="large" color={theme.colors.primary} />
          ) : sortedMentors.length === 0 ? (
            <View style={styles.emptyState}>
              <SearchIcon size={48} color={theme.colors.text.light} />
              <Text style={styles.emptyText}>No mentors found for this profile.</Text>
            </View>
          ) : (
            sortedMentors.map((m) => {
              const basePrice = m.session_price_inr ?? m.session_price ?? 0;
              const cut = tierMap[m.tier || 'bronze'] || 50; 
              const displayPrice = basePrice ? Math.round(basePrice / (1 - (cut/100))) : 0;
              const introPrice = Math.round(displayPrice * 0.20);
              const totalSessions = m.total_sessions ?? 0;
              const isNewMentor = totalSessions < 5;
              const averageRating = m.average_rating ?? 0;
              const showRating = averageRating > 0;
              const nextSlot = mentorAvailability[m.id] || "Loading...";
              const hasSlots = nextSlot !== "No slots available" && nextSlot !== "Loading...";
              const displaySlot = hasSlots ? nextSlot : "No slots available";

              return (
                <MentorCard key={m.id} m={m} displayPrice={displayPrice} introPrice={introPrice} totalSessions={totalSessions} isNewMentor={isNewMentor} averageRating={averageRating} showRating={showRating} hasSlots={hasSlots} displaySlot={displaySlot} onView={() => handleViewMentor(m.id)} />
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
  headerContainer: { paddingHorizontal: 32, paddingTop: 32, paddingBottom: 24, backgroundColor: "#f8f5f0" },
  headerContainerMobile: { paddingHorizontal: 20 },
  headerTitle: { ...FONTS.heading, fontSize: 32, color: theme.colors.text.main, marginBottom: 8 },
  headerSubtitle: { ...FONTS.body, color: theme.colors.text.light, maxWidth: 600 },
  headerDivider: { height: 1, backgroundColor: theme.colors.border, width: "100%" },

  controlsWrapper: { marginHorizontal: 32, marginBottom: 24, paddingVertical: 20, borderBottomWidth: 1, borderColor: '#E5E7EB', gap: 16 },
  controlRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  controlLabel: { fontFamily: SYSTEM_FONT, fontSize: 13, fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5, width: 45 },
  chipScroll: { gap: 8, paddingRight: 20 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 100, backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: 'transparent' },
  chipActive: { backgroundColor: '#111827', borderColor: '#111827' },
  chipText: { fontFamily: SYSTEM_FONT, fontSize: 14, fontWeight: '600', color: '#4B5563' },
  chipTextActive: { color: '#FFFFFF' },
  resultsCountWrapper: { marginTop: 4 },
  resultsCount: { fontFamily: SYSTEM_FONT, fontSize: 14, color: '#6B7280' },

  listContainer: { paddingHorizontal: 32, gap: 16, paddingBottom: 24 },
  card: { backgroundColor: theme.white, borderRadius: 12, padding: 20, borderWidth: 0.5, borderColor: "#F3F4F6", ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 }, android: { elevation: 2, backgroundColor: '#FFF' } }) },
  cardContent: { gap: 12 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatarImage: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#F3F4F6' },
  headerInfo: { flex: 1, justifyContent: 'center' },
  identityGroup: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  mentorName: { ...FONTS.heading, fontSize: 18, color: theme.colors.text.main, flexShrink: 1 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  expBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.gray[100], paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, gap: 4 },
  expText: { ...FONTS.captionBold, color: theme.colors.text.body },
  bioText: { ...FONTS.body, color: '#4B5563', lineHeight: 20, marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: 16, alignItems: 'center', flexWrap: 'wrap', marginTop: 4 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statText: { ...FONTS.caption, fontSize: 13, color: '#4B5563' },
  statValue: { fontWeight: '600', color: '#111827' },
  newBadge: { backgroundColor: '#DBEAFE', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  newBadgeText: { ...FONTS.captionBold, color: '#1E40AF' },
  tierBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, borderWidth: 1 },
  tierText: { ...FONTS.captionBold },
  ratingSection: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  starsContainer: { flexDirection: 'row', gap: 2 },
  starFilled: { fontFamily: SYSTEM_FONT, fontSize: 14, color: '#FBBF24' },
  starEmpty: { fontFamily: SYSTEM_FONT, fontSize: 14, color: '#D1D5DB' },
  ratingText: { ...FONTS.captionBold, fontSize: 13, color: '#111827' },
  availabilityBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#ECFDF5', borderWidth: 1, borderColor: '#D1FAE5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  availabilityBadgeUnavailable: { backgroundColor: '#FEF2F2', borderColor: '#FECACA' },
  availabilityIcon: { fontFamily: SYSTEM_FONT, fontSize: 12 },
  availabilityText: { ...FONTS.caption, fontWeight: '500', color: '#047857' },
  availabilityTextUnavailable: { color: '#DC2626' },
  dividerLine: { height: 1, backgroundColor: '#F3F4F6', width: '100%', marginVertical: 4 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  priceContainer: { flexDirection: 'column' },
  startingAt: { ...FONTS.caption, color: '#6B7280', marginBottom: 2 },
  basePrice: { ...FONTS.bodyBold, fontSize: 16, color: '#111827' },
  bookBtn: { backgroundColor: theme.colors.primary, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, alignItems: 'center' },
  bookBtnText: { fontFamily: SYSTEM_FONT, color: '#FFF', fontSize: 13, fontWeight: '700', letterSpacing: 0.2 },
  emptyState: { alignItems: 'center', padding: 40 },
  emptyText: { ...FONTS.body, marginTop: 10, color: theme.colors.text.light },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: 'white', borderRadius: 12, padding: 20, width: '100%', maxWidth: 400 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  modalTitle: { ...FONTS.heading, fontSize: 18 },
  modalClose: { fontFamily: SYSTEM_FONT, fontSize: 20, color: '#6B7280' },
  tierInfoRow: { flexDirection: 'row', gap: 12, marginBottom: 16, alignItems: 'center' },
  tierInfoTitle: { ...FONTS.bodyBold },
  tierInfoDesc: { ...FONTS.caption, color: '#4B5563' },
});