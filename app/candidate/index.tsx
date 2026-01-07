import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  useWindowDimensions,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Svg, Path, Circle } from "react-native-svg";
import { DateTime, Interval } from 'luxon';
import {
  Heading,
  AppText,
  Card,
  ScreenBackground,
} from "@/lib/ui";
import { theme } from "@/lib/theme";

const SUPABASE_URL = "https://rcbaaiiawrglvyzmawvr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjYmFhaWlhd3JnbHZ5em1hd3ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNTA1NjAsImV4cCI6MjA3NjcyNjU2MH0.V3qRHGXBMlspRS7XFJlXdo4qIcCms60Nepp7dYMEjLA";

// Constants
const SLOT_DURATION_MINUTES = 60;
const BOOKING_WINDOW_DAYS = 30;
const IST_ZONE = 'Asia/Kolkata';

type AdminProfile = { 
  id: number; 
  name: string; 
  description: string | null; 
  is_active: boolean; 
};

type Mentor = { 
  id: string; 
  professional_title?: string | null; 
  experience_description?: string | null; 
  expertise_profiles?: string[]; 
  session_price_inr?: number | null; 
  session_price?: number | null;
  total_sessions?: number;
  years_of_experience?: number | null;
  average_rating?: number | null;
};

type AvailabilityRule = {
  start: string;
  end: string;
  isActive?: boolean | string | 't';
  slot_duration?: number;
  slot_duration_minutes?: number;
};

type Unavailability = {
  start_at: string;
  end_at: string;
};

// ============================================
// SVG ICONS
// ============================================

const CheckmarkCircleIcon = ({ size = 16, color = "#3B82F6" }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none" />
    <Path
      d="M8 12.5L10.5 15L16 9.5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const BriefcaseIcon = ({ size = 12, color = "#111827" }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16 7V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V7"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const SparklesIcon = ({ size = 14, color = "#1E40AF" }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M6 3L6.5 5.5L9 6L6.5 6.5L6 9L5.5 6.5L3 6L5.5 5.5L6 3Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const CheckmarkDoneIcon = ({ size = 14, color = "#6B7280" }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 12L10 17L20 7"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M2 12L7 17"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const CheckmarkIcon = ({ size = 16, color = "#FFF" }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 13L9 17L19 7"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const SearchIcon = ({ size = 48, color = "#9CA3AF" }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth="2" />
    <Path
      d="M21 21L16.65 16.65"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

// Medal/Badge Icon for tiers
const MedalIcon = ({ size = 14, color = "#CD7F32" }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="15" r="6" fill={color} stroke={color} strokeWidth="1.5" />
    <Path
      d="M9 9L7 3L12 6L17 3L15 9"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
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

const TierBadge = ({ totalSessions }: { totalSessions: number }) => {
  let tierName = '';
  let tierColor = '';
  let bgColor = '';
  let borderColor = '';
  let medalColor = '';

  if (totalSessions >= 31) {
    tierName = 'Gold';
    tierColor = '#B8860B';
    bgColor = '#FFF9E6';
    borderColor = '#FFE999';
    medalColor = '#FFD700';
  } else if (totalSessions >= 11) {
    tierName = 'Silver';
    tierColor = '#6B7280';
    bgColor = '#F3F4F6';
    borderColor = '#D1D5DB';
    medalColor = '#9CA3AF';
  } else if (totalSessions >= 1) {
    tierName = 'Bronze';
    tierColor = '#92400E';
    bgColor = '#FEF3C7';
    borderColor = '#FDE68A';
    medalColor = '#CD7F32';
  }

  if (!tierName) return null;

  return (
    <View style={[styles.tierBadge, { backgroundColor: bgColor, borderColor: borderColor }]}>
      <MedalIcon size={14} color={medalColor} />
      <AppText style={[styles.tierText, { color: tierColor }]}>{tierName}</AppText>
    </View>
  );
};

// ============================================
// AVAILABILITY CALCULATION
// (Matches schedule.tsx logic exactly)
// ============================================

const DAY_KEY_MAP = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

const findNextAvailableSlot = async (mentorId: string): Promise<string> => {
  try {
    const now = DateTime.now().setZone(IST_ZONE);
    const startDate = now.plus({ days: 1 }).startOf('day');
    const endDate = startDate.plus({ days: BOOKING_WINDOW_DAYS }).endOf('day');

    // Fetch availability rules
    const rulesRes = await fetch(
      `${SUPABASE_URL}/rest/v1/mentor_availability_rules?mentor_id=eq.${mentorId}&select=weekdays,weekends`,
      { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
    );
    const rulesData = await rulesRes.json();
    
    console.log('🔍 Mentor:', mentorId.slice(0, 8), 'Rules from DB:', rulesData);
    
    // Default rules matching schedule.tsx - NEW FORMAT with individual days
    const finalRulesData = (rulesData && rulesData[0]) || {
      weekdays: {
        monday: { start: '20:00', end: '22:00', isActive: true },
        tuesday: { start: '20:00', end: '22:00', isActive: true },
        wednesday: { start: '20:00', end: '22:00', isActive: true },
        thursday: { start: '20:00', end: '22:00', isActive: true },
        friday: { start: '20:00', end: '22:00', isActive: true }
      },
      weekends: {
        saturday: { start: '12:00', end: '17:00', isActive: true },
        sunday: { start: '12:00', end: '17:00', isActive: true }
      }
    };

    
    console.log('✅ Final rules used:', finalRulesData);

    // Fetch unavailability - Simplified query
    const unavailRes = await fetch(
      `${SUPABASE_URL}/rest/v1/mentor_unavailability?mentor_id=eq.${mentorId}&select=start_at,end_at`,
      { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
    );
    const unavailData = await unavailRes.json();
    
    console.log('📅 Unavailability:', unavailData);
    
    // Filter unavailability to only include periods that overlap with our booking window
    const unavailabilityIntervals = (Array.isArray(unavailData) ? unavailData : [])
      .filter((row: Unavailability) => {
        const s = DateTime.fromISO(row.start_at, { zone: IST_ZONE });
        const e = DateTime.fromISO(row.end_at, { zone: IST_ZONE });
        // Only include if it overlaps with our search period
        return e >= startDate && s <= endDate;
      })
      .map((row: Unavailability) => {
        const s = DateTime.fromISO(row.start_at, { zone: IST_ZONE });
        const e = DateTime.fromISO(row.end_at, { zone: IST_ZONE });
        return Interval.fromDateTimes(s, e);
      });

    // Fetch existing bookings - Fixed query
    const bookingsRes = await fetch(
      `${SUPABASE_URL}/rest/v1/interview_sessions?mentor_id=eq.${mentorId}&scheduled_at=gte.${startDate.toISO()}&scheduled_at=lte.${endDate.toISO()}&status=in.(pending,confirmed)&select=scheduled_at`,
      { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
    );
    const bookingsData = await bookingsRes.json();

    const bookedTimesSet = new Set(
      (Array.isArray(bookingsData) ? bookingsData : []).map((b: any) => 
        DateTime.fromISO(b.scheduled_at, { zone: IST_ZONE }).toFormat('yyyy-MM-dd HH:mm')
      )
    );

    let slotsChecked = 0;
    let availableFound = false;

    // Generate slots day by day until we find an available one
    for (let i = 0; i < BOOKING_WINDOW_DAYS; i++) {
      const currentDay = startDate.plus({ days: i });
      const dateStr = currentDay.toISODate();
      
      // Check if full day off
      const dayInterval = Interval.fromDateTimes(currentDay.startOf('day'), currentDay.endOf('day'));
      const isFullDayOff = unavailabilityIntervals.some(u => 
        u.engulfs(dayInterval) || (u.contains(currentDay.startOf('day')) && u.contains(currentDay.endOf('day')))
      );

      if (isFullDayOff) continue;

      // Get rules for this specific day
      const dayOfWeek = currentDay.weekday % 7; // 0=Sunday, 1=Monday, ..., 6=Saturday
      const dayKey = DAY_KEY_MAP[dayOfWeek];
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      const source = isWeekend ? finalRulesData?.weekends : finalRulesData?.weekdays;
      const dayRule = source?.[dayKey];
      
      let dayRules: AvailabilityRule[] = [];
      if (dayRule && typeof dayRule === 'object') {
        dayRules = [dayRule as AvailabilityRule];
      }

      if (i === 0) {
        console.log('📋 First day rules:', { dateStr, dayOfWeek, dayKey, isWeekend, dayRule, dayRules });
      }

      // Generate slots for this day
      for (const rule of dayRules) {
        const isActive = rule.isActive === true || rule.isActive === 'true' || rule.isActive === 't' || rule.isActive === undefined;
        
        if (i === 0 && !isActive) {
          console.log('❌ Rule is inactive:', rule);
        }
        
        if (!isActive) continue;

        const startStr = String(rule.start);
        const endStr = String(rule.end);
        const ruleStartDT = DateTime.fromFormat(`${dateStr} ${startStr}`, "yyyy-MM-dd HH:mm", { zone: IST_ZONE });
        const ruleEndDT = DateTime.fromFormat(`${dateStr} ${endStr}`, "yyyy-MM-dd HH:mm", { zone: IST_ZONE });
        const duration = rule.slot_duration || rule.slot_duration_minutes || SLOT_DURATION_MINUTES;

        if (!ruleStartDT.isValid || !ruleEndDT.isValid) {
          if (i === 0) console.log('❌ Invalid date format:', { startStr, endStr });
          continue;
        }

        let cursor = ruleStartDT;
        while (cursor < ruleEndDT) {
          const slotStart = cursor;
          const slotEnd = cursor.plus({ minutes: duration });
          if (slotEnd > ruleEndDT) break;

          slotsChecked++;
          const slotKey = slotStart.toFormat('yyyy-MM-dd HH:mm');
          
          const isBooked = bookedTimesSet.has(slotKey);
          const slotInterval = Interval.fromDateTimes(slotStart, slotEnd);
          const isTimeOffSlot = unavailabilityIntervals.some(u => u.overlaps(slotInterval));

          // Found an available slot!
          if (!isBooked && !isTimeOffSlot) {
            const month = slotStart.toFormat('MMM');
            const day = slotStart.toFormat('d');
            console.log('✅ Found available slot:', `${month} ${day}`, 'after checking', slotsChecked, 'slots');
            return `${month} ${day}`;
          }

          cursor = slotEnd;
        }
      }
    }

    console.log('❌ No slots found after checking', slotsChecked, 'slots');
    return "No slots available";
  } catch (err) {
    console.log("Error calculating availability:", err);
    return "No slots available";
  }
};

// ============================================
// MAIN COMPONENT
// ============================================

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
  const [mentorAvailability, setMentorAvailability] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      setProfilesLoading(true);
      try {
        // Fetch profiles
        const profilesRes = await fetch(
          `${SUPABASE_URL}/rest/v1/interview_profiles_admin?select=*`, 
          { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
        );
        const profilesData = await profilesRes.json();
        
        // Fetch all mentors to count per profile
        const mentorsRes = await fetch(
          `${SUPABASE_URL}/rest/v1/mentors?select=*&status=eq.approved`, 
          { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
        );
        const allMentors = await mentorsRes.json();
        
        if (profilesRes.ok && mentorsRes.ok) {
          const actives = (profilesData || []).filter((p: AdminProfile) => p.is_active !== false);
          
          // Count mentors per profile
          const profileMentorCounts = actives.map((profile: AdminProfile) => {
            const mentorCount = (allMentors || []).filter((m: Mentor) => 
              Array.isArray(m.expertise_profiles) && m.expertise_profiles.includes(profile.name)
            ).length;
            return { ...profile, mentorCount };
          });
          
          // Sort profiles by mentor count (descending - most mentors first)
          const sortedProfiles = profileMentorCounts.sort((a, b) => b.mentorCount - a.mentorCount);
          
          setAdminProfiles(sortedProfiles);
          if (sortedProfiles.length > 0) setSelectedProfile(sortedProfiles[0].name);
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
      // Fetch mentors - using average_rating from mentors table
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/mentors?select=*&status=eq.approved`, 
        { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
      );
      const data = await res.json();
      
      if (res.ok) {
        const filtered = (data || []).filter((m: Mentor) => 
          Array.isArray(m.expertise_profiles) ? m.expertise_profiles.includes(profileName) : false
        );
        
        // Sort mentors by total_sessions (number of bookings) in descending order
        const sortedMentors = filtered.sort((a: Mentor, b: Mentor) => {
          const aBookings = a.total_sessions ?? 0;
          const bBookings = b.total_sessions ?? 0;
          return bBookings - aBookings;
        });
        
        setMentors(sortedMentors);

        // Fetch availability for each mentor using the new logic
        const availabilityPromises = sortedMentors.map(async (m: Mentor) => {
          const slot = await findNextAvailableSlot(m.id);
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
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor={theme.colors.primary} 
          />
        }
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
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.pillsScroll}
          >
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
                    {isActive && (
                      <View style={{ marginRight: 6 }}>
                        <CheckmarkIcon size={16} color="#FFF" />
                      </View>
                    )}
                    <AppText 
                      style={[
                        styles.pillText, 
                        isActive ? styles.pillTextActive : styles.pillTextInactive
                      ]}
                    >
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
              <SearchIcon size={48} color={theme.colors.text.light} />
              <AppText style={styles.emptyText}>No mentors found for this profile.</AppText>
            </View>
          ) : (
            mentors.map((m) => {
              const price = m.session_price_inr ?? m.session_price ?? 0;
              const displayPrice = price ? Math.round(price * 1.2) : 0;
              
              const totalSessions = m.total_sessions ?? 0;
              const isNewMentor = totalSessions === 0;
              
              // Get rating from mentors.average_rating
              const averageRating = m.average_rating ?? 0;
              // Show rating when mentor has completed at least 3 sessions
              const showRating = totalSessions >= 3 && averageRating > 0;
              
              const nextSlot = mentorAvailability[m.id] || "Loading...";
              const hasSlots = nextSlot !== "No slots available" && nextSlot !== "Loading...";

              return (
                <Card key={m.id} style={styles.card}>
                  <View style={styles.cardContent}>
                    
                    {/* 1. Professional Title, Verified Badge & Experience */}
                    <View style={styles.topRow}>
                      <View style={styles.identityGroup}>
                        <AppText style={styles.mentorName}>
                          {m.professional_title || "Senior Mentor"}
                        </AppText>
                        
                        {/* Verified Badge with Text */}
                        <View style={styles.verifiedBadge}>
                          <CheckmarkCircleIcon size={16} color="#3B82F6" />
                          <AppText style={styles.verifiedText}>Verified</AppText>
                        </View>
                      </View>
                      
                      {/* Years of Experience */}
                      {m.years_of_experience != null && (
                        <View style={styles.expBadge}>
                          <BriefcaseIcon size={12} color={theme.colors.text.main} />
                          <AppText style={styles.expText}>
                            {m.years_of_experience} yrs exp
                          </AppText>
                        </View>
                      )}
                    </View>

                    {/* 2. Stats Row (Tier Badge + Sessions/New Badge + Rating + Availability) */}
                    <View style={styles.statsRow}>
                      {/* Tier Badge (Bronze/Silver/Gold) */}
                      <TierBadge totalSessions={totalSessions} />
                      
                      {/* Sessions or New Badge */}
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
                      
                      {/* Rating (only if >= 3 sessions) */}
                      {showRating && (
                        <StarRating rating={averageRating} />
                      )}
                      
                      {/* Availability */}
                      <View style={[
                        styles.availabilityBadge,
                        !hasSlots && styles.availabilityBadgeUnavailable
                      ]}>
                        <AppText style={styles.availabilityIcon}>
                          {hasSlots ? '🟢' : '⏰'}
                        </AppText>
                        <AppText style={[
                          styles.availabilityText,
                          !hasSlots && styles.availabilityTextUnavailable
                        ]}>
                          {hasSlots ? `Next slot: ${nextSlot}` : nextSlot}
                        </AppText>
                      </View>
                    </View>

                    <View style={styles.dividerLine} />

                    {/* 3. Price & Book Button */}
                    <View style={styles.detailsRow}>
                      <View>
                        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                          <AppText style={styles.priceText}>
                            ₹{displayPrice.toLocaleString("en-IN")}
                          </AppText>
                          <AppText style={styles.perBookingText}> / booking</AppText>
                        </View>
                        
                        <View style={styles.includesRow}>
                          <AppText style={styles.includesIcon}>✓</AppText>
                          <AppText style={styles.includesText}>
                            Includes 1 x 55 min session
                          </AppText>
                        </View>
                      </View>

                      <TouchableOpacity 
                        style={styles.bookBtn} 
                        onPress={() => handleViewMentor(m.id)}
                      >
                        <AppText style={styles.bookBtnText}>View and Book</AppText>
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
  headerTitle: { 
    fontSize: 24, 
    fontWeight: "bold", 
    color: theme.colors.text.main, 
    marginBottom: 4 
  },
  headerSubtitle: { 
    fontSize: 15, 
    color: theme.colors.text.light, 
    maxWidth: 600 
  },
  headerDivider: { 
    height: 1, 
    backgroundColor: theme.colors.border, 
    width: "100%" 
  },

  // Filters
  filtersContainer: { 
    paddingHorizontal: 32, 
    paddingTop: 24, 
    marginBottom: 24 
  },
  filterLabel: { 
    fontSize: 16, 
    fontFamily: theme.typography.fontFamily.bold, 
    color: theme.colors.text.main, 
    marginBottom: 16 
  },
  pillsScroll: { gap: 12, paddingRight: 20 },
  pill: { 
    flexDirection: "row", 
    alignItems: "center", 
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    borderRadius: 999, 
    borderWidth: 1 
  },
  pillActive: { 
    backgroundColor: theme.colors.primary, 
    borderColor: theme.colors.primary 
  },
  pillInactive: { 
    backgroundColor: "#FFF", 
    borderColor: "#E5E7EB" 
  },
  pillText: { fontSize: 14, fontWeight: "500" },
  pillTextActive: { color: "#FFF" },
  pillTextInactive: { color: "#4B5563" },
  resultsCount: { 
    marginTop: 16, 
    fontSize: 14, 
    color: theme.colors.text.light 
  },

  // List
  listContainer: { 
    paddingHorizontal: 32, 
    gap: 16, 
    paddingBottom: 24 
  },
  
  // Card Styles
  card: { 
    backgroundColor: theme.white, 
    borderRadius: 12, 
    padding: 20, 
    borderWidth: 0.5,
    borderColor: "#F3F4F6",
    ...Platform.select({
      ios: { 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.05, 
        shadowRadius: 4 
      },
      android: { elevation: 2, backgroundColor: '#FFF' }
    })
  },
  cardContent: { gap: 12 },
  
  topRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start', 
    flexWrap: 'wrap', 
    gap: 8 
  },
  
  identityGroup: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6,
    flexWrap: 'wrap'
  },
  mentorName: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: theme.colors.text.main, 
    flexShrink: 1 
  },
  
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B82F6',
  },
  
  expBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: theme.colors.gray[100], 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 6,
    gap: 4,
  },
  expText: { 
    fontSize: 12, 
    fontWeight: "600", 
    color: theme.colors.text.body 
  },

  // Stats Row
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  
  statText: {
    fontSize: 13,
    color: '#4B5563',
  },
  
  statValue: {
    fontWeight: '600',
    color: '#111827',
  },
  
  newBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  
  newBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E40AF',
  },

  // Tier Badge
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  
  tierText: {
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Rating Section
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  
  starFilled: {
    fontSize: 14,
    color: '#FBBF24',
  },
  
  starEmpty: {
    fontSize: 14,
    color: '#D1D5DB',
  },
  
  starHalf: {
    fontSize: 14,
    color: '#FBBF24',
  },
  
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  
  // Availability Badge
  availabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  
  availabilityBadgeUnavailable: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },
  
  availabilityIcon: {
    fontSize: 12,
  },
  
  availabilityText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#047857',
  },
  
  availabilityTextUnavailable: {
    color: '#6B7280',
  },

  dividerLine: { 
    height: 1, 
    backgroundColor: '#F3F4F6', 
    width: '100%' 
  },

  detailsRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    flexWrap: 'wrap', 
    gap: 16 
  },
  
  priceText: { 
    fontSize: 20, 
    fontWeight: "800", 
    color: theme.colors.text.main 
  },
  perBookingText: { 
    fontSize: 12, 
    color: "#9CA3AF" 
  },
  
  includesRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 4,
    gap: 4,
  },
  includesIcon: {
    fontSize: 14,
    color: theme.colors.primary,
  },
  includesText: { 
    fontSize: 12, 
    color: theme.colors.text.light, 
    fontWeight: '500' 
  },

  bookBtn: { 
    backgroundColor: theme.colors.primary, 
    paddingVertical: 10, 
    paddingHorizontal: 24, 
    borderRadius: 8 
  },
  bookBtnText: { 
    color: '#FFF', 
    fontWeight: '600', 
    fontSize: 14 
  },

  emptyState: { 
    alignItems: 'center', 
    padding: 40 
  },
  emptyText: { 
    marginTop: 10, 
    color: theme.colors.text.light 
  },
});