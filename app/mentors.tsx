// app/mentors.tsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
  Modal,
  Pressable,
  Text,
} from "react-native";
import { useRouter } from "expo-router";
import { Svg, Path, Circle } from "react-native-svg";
import { AppText, Card, Heading, Button } from "@/lib/ui";
import { theme } from "@/lib/theme";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";


const SUPABASE_URL = "https://rcbaaiiawrglvyzmawvr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjYmFhaWlhd3JnbHZ5em1hd3ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNTA1NjAsImV4cCI6MjA3NjcyNjU2MH0.V3qRHGXBMlspRS7XFJlXdo4qIcCms60Nepp7dYMEjLA";

// Brand Colors
const BRAND_ORANGE = '#f58742';
const CTA_TEAL = '#18a7a7';
const BG_CREAM = '#f8f5f0';
const SYSTEM_FONT = Platform.select({
  web: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
  ios: "System",
  android: "Roboto",
  default: "System"
}) as string;
// ============================================
// FOOTER COMPONENT (Inline)
// ============================================

const PublicFooter = () => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    if (Platform.OS === 'web') {
      window.location.href = path;
    } else {
      router.push(path as any);
    }
  };

  return (
    <View style={footerStyles.container}>
      <View style={footerStyles.content}>
        {/* Column 1: Brand */}
        <View style={footerStyles.column}>
          <AppText style={footerStyles.brandTitle}>CrackJobs</AppText>
          <AppText style={footerStyles.brandDesc}>
            Anonymous mock interviews with verified experts from top companies.
          </AppText>
          <TouchableOpacity onPress={() => handleNavigation('https://linkedin.com')} style={footerStyles.socialIcon}>
            <AppText style={footerStyles.linkedInIcon}>in</AppText>
          </TouchableOpacity>
        </View>

        {/* Column 2: Interview Tracks */}
        <View style={footerStyles.column}>
          <AppText style={footerStyles.columnTitle}>INTERVIEW TRACKS</AppText>
          <TouchableOpacity onPress={() => handleNavigation('/interviews/product-management')}>
            <AppText style={footerStyles.link}>Product Management</AppText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleNavigation('/interviews/data-analytics')}>
            <AppText style={footerStyles.link}>Data Analytics</AppText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleNavigation('/interviews/data-science')}>
            <AppText style={footerStyles.link}>Data Science / ML</AppText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleNavigation('/interviews/hr')}>
            <AppText style={footerStyles.link}>HR & Behavioral</AppText>
          </TouchableOpacity>
        </View>

        {/* Column 3: Company */}
        <View style={footerStyles.column}>
          <AppText style={footerStyles.columnTitle}>COMPANY</AppText>
          <TouchableOpacity onPress={() => handleNavigation('/')}>
            <AppText style={footerStyles.link}>Home</AppText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleNavigation('/about')}>
            <AppText style={footerStyles.link}>About Us</AppText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleNavigation('/how-it-works')}>
            <AppText style={footerStyles.link}>How It Works</AppText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleNavigation('/blog')}>
            <AppText style={footerStyles.link}>Blog & Guides</AppText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleNavigation('/contact')}>
            <AppText style={footerStyles.link}>Contact Support</AppText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleNavigation('/auth/sign-up')}>
            <AppText style={[footerStyles.link, footerStyles.mentorLink]}>Become a Mentor</AppText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Bar */}
      <View style={footerStyles.divider} />
      <View style={footerStyles.bottom}>
        <AppText style={footerStyles.copyright}>© 2025 CrackJobs. All rights reserved.</AppText>
        <View style={footerStyles.bottomLinks}>
          <TouchableOpacity onPress={() => handleNavigation('/faq')}>
            <AppText style={footerStyles.bottomLink}>FAQ</AppText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleNavigation('/privacy')}>
            <AppText style={footerStyles.bottomLink}>Privacy</AppText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleNavigation('/terms')}>
            <AppText style={footerStyles.bottomLink}>Terms</AppText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleNavigation('/cancellation-policy')}>
            <AppText style={footerStyles.bottomLink}>Cancellation Policy</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const footerStyles = StyleSheet.create({
  container: { backgroundColor: '#333', paddingVertical: 48, paddingHorizontal: 32 },
  content: { flexDirection: 'row', justifyContent: 'space-between', maxWidth: 1200, marginHorizontal: 'auto', width: '100%', flexWrap: 'wrap', gap: 40 },
  column: { flex: 1, minWidth: 200 },
  brandTitle: { fontSize: 20, fontWeight: '700', color: '#FFF', marginBottom: 12 },
  brandDesc: { fontSize: 14, color: '#9CA3AF', lineHeight: 20, marginBottom: 16 },
  socialIcon: { width: 36, height: 36, borderRadius: 4, backgroundColor: '#18A7A7', alignItems: 'center', justifyContent: 'center' },
  linkedInIcon: { fontSize: 18, fontWeight: '700', color: '#FFF' },
  columnTitle: { fontSize: 12, fontWeight: '700', color: '#9CA3AF', marginBottom: 16, letterSpacing: 0.5 },
  link: { fontSize: 15, color: '#D1D5DB', marginBottom: 12 },
  mentorLink: { color: '#18A7A7', fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#555', maxWidth: 1200, marginHorizontal: 'auto', width: '100%', marginTop: 32, marginBottom: 24 },
  bottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', maxWidth: 1200, marginHorizontal: 'auto', width: '100%', flexWrap: 'wrap', gap: 16 },
  copyright: { fontSize: 13, color: '#9CA3AF' },
  bottomLinks: { flexDirection: 'row', gap: 20, flexWrap: 'wrap' },
  bottomLink: { fontSize: 13, color: '#9CA3AF' },
});

// --- TYPOGRAPHY SYSTEM ---
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

type SortOption = 'price_low' | 'sessions' | 'rating' | 'experience';

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

const MedalIcon = ({ size = 14, color = "#CD7F32" }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="15" r="6" fill={color} stroke={color} strokeWidth="1.5" />
    <Path d="M9 9L7 3L12 6L17 3L15 9" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </Svg>
);

const SearchIcon = ({ size = 48, color = "#9CA3AF" }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth="2" />
    <Path d="M21 21L16.65 16.65" stroke={color} strokeWidth="2" strokeLinecap="round" />
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
    tierColor = '#D97706';
    bgColor = '#FFFBEB';
    borderColor = '#F59E0B';
    medalColor = '#F59E0B';
  } else if (normalizedTier === 'silver') {
    tierName = 'Silver';
    tierColor = '#6B7280';
    bgColor = '#F3F4F6';
    borderColor = '#9CA3AF';
    medalColor = '#9CA3AF';
  }

  return (
    <View style={[styles.tierBadge, { backgroundColor: bgColor, borderColor }]}>
      <MedalIcon size={14} color={medalColor} />
      <AppText style={[styles.tierText, { color: tierColor }]}>{tierName.toUpperCase()}</AppText>
    </View>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function PublicBrowseMentors() {
  const { width } = useWindowDimensions();
  const isMobile = width <= 768;
  const router = useRouter();

  const [adminProfiles, setAdminProfiles] = useState<AdminProfile[]>([]);
  const [profilesLoading, setProfilesLoading] = useState(true);
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(null);

  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [mentorsLoading, setMentorsLoading] = useState(false);

  const [sortBy, setSortBy] = useState<SortOption>('price_low');
  const [showTierInfo, setShowTierInfo] = useState(false);

  const [tierMap, setTierMap] = useState<Record<string, number>>({});

  // --- 1. Fetch Profiles ---
  useEffect(() => {
    (async () => {
      setProfilesLoading(true);
      try {
        // Fetch Tiers First
        const tiersRes = await fetch(
          `${SUPABASE_URL}/rest/v1/mentor_tiers?select=tier,percentage_cut`,
          { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
        );
        const tiersData = await tiersRes.json();
        const tMap: Record<string, number> = {};
        tiersData?.forEach((t: any) => (tMap[t.tier] = t.percentage_cut));
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

  // --- 2. Fetch Mentors ---
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

    const getPrice = (m: Mentor) => {
      const base = m.session_price_inr ?? m.session_price ?? 0;
      const cut = tierMap[m.tier || 'bronze'] || 50;
      return Math.round(base / (1 - cut / 100));
    };

    switch (sortBy) {
      case 'price_low':
        sorted.sort((a, b) => getPrice(a) - getPrice(b));
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

  const handleViewMentor = (id: string) => {
    if (Platform.OS === 'web') {
      window.location.href = `/mentors/${id}`;
    } else {
      router.push(`/mentors/${id}` as any);
    }
  };

  const SortButton = ({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) => (
    <TouchableOpacity style={[styles.sortBtn, active && styles.sortBtnActive]} onPress={onPress}>
      <AppText style={[styles.sortBtnText, active && styles.sortBtnTextActive]}>{label}</AppText>
    </TouchableOpacity>
  );

  return (
    <View style={styles.pageContainer}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* Header with Navigation */}
        <Header showGetStarted={true} />
        
        {/* Hero Section */}
        <View style={[styles.sectionContainer, isMobile && styles.sectionContainerMobile]}>
          <View style={styles.heroCentered}>
            <View style={styles.heroTextContainer}>
              <View style={styles.pillBadge}>
                <Text style={styles.pillText}>🎯 Find Your Perfect Mentor</Text>
              </View>
              <Text style={[styles.heroTitle, isMobile && styles.heroTitleMobile]}>
                <Text style={{ color: BRAND_ORANGE }}>Choose from a list of </Text>
                <Text style={{ color: CTA_TEAL }}>verified expert mentors</Text>
              </Text>
              <Text style={[styles.heroSubtitle, isMobile && styles.heroSubtitleMobile]}>
                Anonymous 1:1 mock interviews. Vetted mentors from top companies for Product Management, Data / Business Analytics, Data Science and HR.
              </Text>
            </View>
            
          </View>
        </View>

        {/* FILTERS */}
        <View style={styles.filtersContainer}>
          <AppText style={styles.filterLabel}>Select Interview Type:</AppText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsScroll}>
            {adminProfiles.map((profile) => {
              const isActive = selectedProfileId === profile.id;
              return (
                <TouchableOpacity
                  key={profile.id}
                  style={[styles.pill, isActive ? styles.pillActive : styles.pillInactive]}
                  onPress={() => setSelectedProfileId(profile.id)}
                >
                  <AppText style={[styles.pillText, isActive ? styles.pillTextActive : styles.pillTextInactive]}>
                    {profile.name}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* SORTING */}
          <View style={styles.sortContainer}>
            <AppText style={styles.sortLabel}>Sort by:</AppText>
            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
              <SortButton label="Price (Low)" active={sortBy === 'price_low'} onPress={() => setSortBy('price_low')} />
              <SortButton label="Most Sessions" active={sortBy === 'sessions'} onPress={() => setSortBy('sessions')} />
              <SortButton label="Highest Rated" active={sortBy === 'rating'} onPress={() => setSortBy('rating')} />
              <SortButton label="Experience" active={sortBy === 'experience'} onPress={() => setSortBy('experience')} />
            </View>
            
            <TouchableOpacity style={styles.infoBtn} onPress={() => setShowTierInfo(true)}>
              <InfoIcon size={14} color="#3B82F6" />
              <AppText style={styles.infoBtnText}>About Mentor Tiers</AppText>
            </TouchableOpacity>
          </View>

          <AppText style={styles.resultsCount}>
            {sortedMentors.length} {sortedMentors.length === 1 ? 'mentor' : 'mentors'} available
          </AppText>
        </View>

        {/* MENTOR LIST */}
        <View style={styles.listContainer}>
          {profilesLoading || mentorsLoading ? (
            <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 40 }} />
          ) : sortedMentors.length === 0 ? (
            <View style={styles.emptyState}>
              <SearchIcon size={48} color="#9CA3AF" />
              <AppText style={styles.emptyText}>No mentors found for this profile</AppText>
            </View>
          ) : (
            sortedMentors.map((m) => {
              const basePrice = m.session_price_inr ?? m.session_price ?? 0;
              const cut = tierMap[m.tier || 'bronze'] || 50;
              const displayPrice = basePrice ? Math.round(basePrice / (1 - cut / 100)) : 0;

              const totalSessions = m.total_sessions || 0;
              const isNewMentor = totalSessions < 5;
              const averageRating = m.average_rating || 0;
              const showRating = averageRating > 0;

              return (
                <Card key={m.id} style={styles.card}>
                  <View style={styles.cardContent}>
                    <View style={styles.topRow}>
                      <View style={styles.identityGroup}>
                        <AppText style={styles.mentorName}>
                          {m.professional_title || 'Interview Mentor'}
                        </AppText>
                        <View style={styles.verifiedBadge}>
                          <CheckmarkCircleIcon size={16} color="#3B82F6" />
                          <AppText style={styles.verifiedText}>Verified</AppText>
                        </View>
                      </View>
                      {m.years_of_experience && (
                        <View style={styles.expBadge}>
                          <BriefcaseIcon size={12} color="#111827" />
                          <AppText style={styles.expText}>{m.years_of_experience} yrs</AppText>
                        </View>
                      )}
                    </View>

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

                      <View style={styles.availabilityBadge}>
                        <AppText style={styles.availabilityIcon}>🟢</AppText>
                        <AppText style={styles.availabilityText}>Available</AppText>
                      </View>
                    </View>

                    <View style={styles.dividerLine} />

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

        {/* SEO CONTENT */}
        <View style={styles.seoSection}>
          <Heading level={2} style={styles.seoTitle}>Why Practice Mock Interviews?</Heading>
          <AppText style={styles.seoText}>
            Mock interviews simulate real world interviews and help you identify weaknesses apparent to the interviewer. Our platform connects you with experienced interviewers from top companies who provide realistic interview practice and actionable feedback.
          </AppText>
          
          <Heading level={3} style={styles.seoSubtitle}>What You Get</Heading>
          {/* UPDATED: Added color: '#fff' to the bold text spans */}
          <AppText style={styles.seoText}>
            • <AppText style={{ fontWeight: '600', color: '#fff' }}>Real Interview Experience:</AppText> Practice with mentors who conduct actual interviews everyday{'\n'}
            • <AppText style={{ fontWeight: '600', color: '#fff' }}>Personalized Feedback:</AppText> Get detailed evaluation on your answers, communication style, and areas for improvement{'\n'}
            • <AppText style={{ fontWeight: '600', color: '#fff' }}>Anonymous & Safe:</AppText> Practice without fear of judgment in a confidential environment{'\n'}
            • <AppText style={{ fontWeight: '600', color: '#fff' }}>Flexible Scheduling:</AppText> Book sessions at times that work for you, with mentors across different time zones
          </AppText>

          <Heading level={3} style={styles.seoSubtitle}>Interview Types We Cover</Heading>
          <AppText style={styles.seoText}>
            Our mentors specialize in Product Management, Data Science, Data Analytics, and HR interviews. Whether you're preparing for FAANG companies or startups, we have experts who can help you succeed.
          </AppText>
          
          {/* Button remains here, style updated below */}
           <TouchableOpacity 
            style={styles.ctaButton}
            onPress={() => router.push('/auth/sign-up')}
            activeOpacity={0.9}
            accessibilityRole="button"
            accessibilityLabel="Get Started"
          >
            <Text style={styles.ctaButtonText}>GET STARTED</Text>
          </TouchableOpacity>
        </View>

        {/* FOOTER */}
        <Footer />
      </ScrollView>

      {/* TIER INFO MODAL */}
      <Modal
        visible={showTierInfo}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTierInfo(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowTierInfo(false)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <AppText style={styles.modalTitle}>Mentor Tiers</AppText>
              <TouchableOpacity onPress={() => setShowTierInfo(false)}>
                <AppText style={styles.modalClose}>×</AppText>
              </TouchableOpacity>
            </View>

            <View style={styles.tierInfoRow}>
              <MedalIcon size={18} color="#CD7F32" />
              <View style={{ flex: 1 }}>
                <AppText style={styles.tierInfoTitle}>Bronze</AppText>
                <AppText style={styles.tierInfoDesc}>New mentors building their profile</AppText>
              </View>
            </View>
                
            <View style={styles.tierInfoRow}>
              <MedalIcon size={18} color="#9CA3AF" />
              <View style={{ flex: 1 }}>
                <AppText style={styles.tierInfoTitle}>Silver</AppText>
                <AppText style={styles.tierInfoDesc}>Experienced mentors with proven track record</AppText>
              </View>
            </View>

            <View style={styles.tierInfoRow}>
              <MedalIcon size={18} color="#F59E0B" />
              <View style={{ flex: 1 }}>
                <AppText style={styles.tierInfoTitle}>Gold</AppText>
                <AppText style={styles.tierInfoDesc}>Top-rated mentors from leading companies</AppText>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: { flex: 1, backgroundColor: "#f8f5f0" },
  container: { flex: 1 },
  scrollContent: { paddingBottom: 40 },

  // Hero Section
  sectionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 60,
    maxWidth: 1200,
    width: '100%',
    marginHorizontal: 'auto',
  },
  sectionContainerMobile: {
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  heroCentered: {
    alignItems: 'center',
    gap: 32,
  },
  heroTextContainer: {
    alignItems: 'center',
    gap: 16,
    maxWidth: 800,
  },
  pillBadge: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  pillText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 56,
    ...Platform.select({
      web: {
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
      },
    }),
  },
  heroTitleMobile: {
    fontSize: 32,
    lineHeight: 40,
  },
  heroSubtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#555',
    lineHeight: 28,
    maxWidth: 700,
    ...Platform.select({
      web: {
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
      },
    }),
  },
  heroSubtitleMobile: {
    fontSize: 16,
    lineHeight: 24,
  },
  heroCTAContainer: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  heroCTAContainerMobile: {
    width: '100%',
    gap: 12,
  },
  primaryCTA: {
    minWidth: 180,
  },
  secondaryCTA: {
    minWidth: 180,
  },

  // Filters
  filtersContainer: { paddingHorizontal: 32, paddingTop: 24, marginBottom: 24 },
  filterLabel: { ...FONTS.bodyBold, color: theme.colors.text.main, marginBottom: 16 },
  pillsScroll: { gap: 12, paddingRight: 20 },

  pill: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 999, borderWidth: 1 },
  pillActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  pillInactive: { backgroundColor: "#FFF", borderColor: "#E5E7EB" },
  pillText: { ...FONTS.bodyBold },
  pillTextActive: { color: "#FFF" },
  pillTextInactive: { color: "#4B5563" },

  // Sorting
  sortContainer: { marginTop: 16, flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  sortLabel: { ...FONTS.caption, color: '#6B7280', fontWeight: '500' },
  sortBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB' },
  sortBtnActive: { backgroundColor: '#EEF2FF', borderColor: theme.colors.primary },
  sortBtnText: { ...FONTS.caption, color: '#4B5563', fontWeight: '500' },
  sortBtnTextActive: { color: theme.colors.primary, fontWeight: '600' },

  infoBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginLeft: 12 },
  infoBtnText: { ...FONTS.captionBold, color: '#3B82F6', textDecorationLine: 'underline' },

  resultsCount: { ...FONTS.body, color: theme.colors.text.light, marginTop: 16 },

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
  availabilityIcon: { fontSize: 12 },
  availabilityText: { ...FONTS.caption, fontWeight: '500', color: '#047857' },

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

  // SEO Section
  seoSection: { paddingHorizontal: 32, paddingVertical: 40, backgroundColor: '#f58742', marginTop: 24, borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  seoTitle: { fontSize: 24, fontWeight: '700', color: '#fff', marginBottom: 16 },
  seoSubtitle: { fontSize: 18, fontWeight: '600', color: '#fff', marginTop: 24, marginBottom: 12 },
  seoText: { fontSize: 15, color: '#fff', lineHeight: 24, marginBottom: 12 },


  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: 'white', borderRadius: 12, padding: 20, width: '100%', maxWidth: 400 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  modalTitle: { ...FONTS.heading, fontSize: 18 },
  modalClose: { fontSize: 20, color: '#6B7280' },
  tierInfoRow: { flexDirection: 'row', gap: 12, marginBottom: 16, alignItems: 'center' },
  tierInfoTitle: { ...FONTS.bodyBold },
  tierInfoDesc: { ...FONTS.caption, color: '#4B5563' },

  ctaSection: { backgroundColor: BRAND_ORANGE, paddingVertical: 80 },
  ctaInner: { maxWidth: 700, alignSelf: 'center', alignItems: 'center', paddingHorizontal: 24 },
  ctaInnerMobile: { paddingHorizontal: 32 },
  ctaTitle: { fontFamily: SYSTEM_FONT, fontWeight: '800', fontSize: 40, color: '#fff', marginBottom: 16, textAlign: 'center' },
  ctaTitleMobile: { fontSize: 28 },
  ctaSubtitle: { fontFamily: SYSTEM_FONT, fontSize: 18, color: '#fff', marginBottom: 32, textAlign: 'center', opacity: 0.95 },
  ctaSubtitleMobile: { fontSize: 16 },
  // ... existing styles ...

  ctaButton: { 
    backgroundColor: '#fff', 
    paddingHorizontal: 24, // Reduced from 40
    paddingVertical: 10,   // Reduced from 16
    borderRadius: 100, 
    alignSelf: 'center',   // Centers the button
    marginTop: 32          // Adds spacing from the text above
  },
  ctaButtonText: { 
    alignItems: "center",
    fontFamily: SYSTEM_FONT, 
    fontWeight: '700', 
    fontSize: 14,          // Reduced from 16
    color: BRAND_ORANGE 
  },
  
  // ... rest of styles
});