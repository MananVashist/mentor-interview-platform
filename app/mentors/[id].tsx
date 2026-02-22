// app/mentors/[id].tsx
import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Svg, Path, Circle } from "react-native-svg";
import { AppText, Card, Heading } from "@/lib/ui";
import { theme } from "@/lib/theme";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const SUPABASE_URL = "https://rcbaaiiawrglvyzmawvr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjYmFhaWlhd3JnbHZ5em1hd3ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNTA1NjAsImV4cCI6MjA3NjcyNjU2MH0.V3qRHGXBMlspRS7XFJlXdo4qIcCms60Nepp7dYMEjLA";

type SessionType = 'intro' | 'mock' | 'bundle';

type MentorDetail = {
  id: string;
  professional_title?: string | null;
  experience_description?: string | null;
  profile_ids?: number[];
  session_price_inr?: number | null;
  tier?: string | null;
  years_of_experience?: number | null;
  average_rating?: number | null;
  total_sessions?: number;
};

type Profile = {
  id: number;
  name: string;
  description: string | null;
};

type Skill = {
  id: string;
  name: string;
  description: string | null;
};

// ============================================
// SVG ICONS
// ============================================


const TargetIcon = ({ size = 20, color = "#6B7280" }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <Circle cx="12" cy="12" r="6" stroke={color} strokeWidth="2" />
    <Circle cx="12" cy="12" r="2" fill={color} />
  </Svg>
);


const MedalIcon = ({ size = 14, color = "#CD7F32" }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="15" r="6" fill={color} stroke={color} strokeWidth="1.5" />
    <Path d="M9 9L7 3L12 6L17 3L15 9" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </Svg>
);

const CheckmarkIcon = ({ size = 14, color = "#FFF" }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M5 13L9 17L19 7" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const XIcon = ({ size = 12, color = "#6B7280" }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
  </Svg>
);

const ChatIcon = ({ size = 16, color = "#7C3AED" }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const LayersIcon = ({ size = 16, color = "#D97706" }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2L2 7l10 5 10-5-10-5z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M2 17l10 5 10-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M2 12l10 5 10-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// ============================================
// TIER BADGE
// ============================================

const TierBadge = ({ tier }: { tier?: string | null }) => {
  let tierName = 'Bronze';
  let tierColor = '#8B4513';
  let bgColor = '#FFF8F0';
  let borderColor = '#CD7F32';
  let medalColor = '#CD7F32';

  const t = tier?.toLowerCase();
  if (t === 'gold') {
    tierName = 'Gold'; tierColor = '#D97706'; bgColor = '#FFFBEB'; borderColor = '#F59E0B'; medalColor = '#F59E0B';
  } else if (t === 'silver') {
    tierName = 'Silver'; tierColor = '#6B7280'; bgColor = '#F3F4F6'; borderColor = '#9CA3AF'; medalColor = '#9CA3AF';
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

export default function PublicMentorDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [loading, setLoading] = useState(true);
  const [mentor, setMentor] = useState<MentorDetail | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [mockPrice, setMockPrice] = useState(0);

  // Session type state
  const [sessionType, setSessionType] = useState<SessionType>('mock');

  // Mock: single skill
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  // Bundle: up to 3 skills (repeats allowed)
  const [bundleSkills, setBundleSkills] = useState<Skill[]>([]);

  // Bio expand/collapse
  const [bioExpanded, setBioExpanded] = useState(false);
  const BIO_COLLAPSE_LINES = 3;

  useEffect(() => { fetchMentorDetails(); }, [id]);

  useEffect(() => {
    if (selectedProfileId) {
      fetchSkills();
    } else {
      setSkills([]);
      setSelectedSkill(null);
      setBundleSkills([]);
    }
  }, [selectedProfileId]);

  // Reset skill selections when session type changes
  useEffect(() => {
    setSelectedSkill(null);
    setBundleSkills([]);
  }, [sessionType]);

  const fetchMentorDetails = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const mentorRes = await fetch(
        `${SUPABASE_URL}/rest/v1/mentors?select=*&id=eq.${id}&status=eq.approved&limit=1`,
        { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
      );
      const mentorData = await mentorRes.json();

      if (mentorData && mentorData.length > 0) {
        const m = mentorData[0];
        setMentor(m);

        const basePrice = m.session_price_inr || 1000;
        const tier = m.tier || 'bronze';

        const tierRes = await fetch(
          `${SUPABASE_URL}/rest/v1/mentor_tiers?select=percentage_cut&tier=eq.${tier}&limit=1`,
          { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
        );
        const tierData = await tierRes.json();
        const percentageCut = tierData?.[0]?.percentage_cut || 50;
        setMockPrice(Math.round(basePrice / (1 - percentageCut / 100)));

        if (m.profile_ids && m.profile_ids.length > 0) {
          const profilesRes = await fetch(
            `${SUPABASE_URL}/rest/v1/interview_profiles_admin?select=id,name,description&id=in.(${m.profile_ids.join(',')})&order=name`,
            { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
          );
          setProfiles(await profilesRes.json() || []);
        }
      }
    } catch (err) {
      console.error('[PublicMentorDetail] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSkills = async () => {
    if (!selectedProfileId) return;
    setLoadingSkills(true);
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/interview_skills_admin?select=id,name,description&interview_profile_id=eq.${selectedProfileId}&order=name`,
        { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
      );
      setSkills(await res.json() || []);
    } catch (err) {
      console.error('[PublicMentorDetail] Skills Error:', err);
    } finally {
      setLoadingSkills(false);
    }
  };

  // Bundle skill handlers
  const handleBundleSkillPress = (skill: Skill) => {
    if (bundleSkills.length >= 3) {
      // Replace the last one if already at 3 — or just block
      return;
    }
    setBundleSkills(prev => [...prev, skill]);
  };

  const handleBundleSkillRemove = (index: number) => {
    setBundleSkills(prev => prev.filter((_, i) => i !== index));
  };

  // CTA enabled logic
  const ctaEnabled = (() => {
    if (!selectedProfileId) return false;
    if (sessionType === 'intro') return true;
    if (sessionType === 'mock') return !!selectedSkill;
    if (sessionType === 'bundle') return bundleSkills.length === 3;
    return false;
  })();

  const handleSchedule = () => {
    let url = '';

    if (sessionType === 'intro') {
      url = `/candidate/schedule?mentorId=${id}&profileId=${selectedProfileId}&sessionType=intro`;
    } else if (sessionType === 'mock') {
      url = `/candidate/schedule?mentorId=${id}&profileId=${selectedProfileId}&skillId=${selectedSkill?.id}&skillName=${encodeURIComponent(selectedSkill?.name || '')}&sessionType=mock`;
    } else if (sessionType === 'bundle') {
      const skillIds   = bundleSkills.map(s => s.id).join(',');
      // Use | as separator for names since names might contain commas
      const skillNames = bundleSkills.map(s => encodeURIComponent(s.name)).join('|');
      url = `/candidate/schedule?mentorId=${id}&profileId=${selectedProfileId}&skillIds=${skillIds}&skillNames=${skillNames}&sessionType=bundle`;
    }

    if (Platform.OS === 'web') {
      window.location.href = url;
    } else {
      router.push(url as any);
    }
  };

  // ── Derived prices ──────────────────────────────────────────────────────────
  const introPrice  = Math.round(mockPrice * 0.20);
  const bundlePrice = Math.round(mockPrice * 2.5);
  const bundleSaving = Math.round(mockPrice * 3 - bundlePrice);

  // ── Loading / not found states ──────────────────────────────────────────────
  if (loading) {
    return (
      <View style={styles.pageContainer}>
        <Header />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </View>
    );
  }

  if (!mentor) {
    return (
      <View style={styles.pageContainer}>
        <Header />
        <View style={styles.loadingContainer}>
          <AppText style={styles.emptyText}>Mentor not found</AppText>
        </View>
      </View>
    );
  }

  const avatarChar = mentor.professional_title?.charAt(0) || 'M';

  return (
    <View style={styles.pageContainer}>
      <Header />
      <ScrollView style={styles.container} contentContainerStyle={[styles.scrollContent, isMobile && styles.scrollContentMobile]}>

        {/* ── BIO CARD ─────────────────────────────────────────────────── */}
        <Card style={[styles.card, styles.bioCard, isMobile && styles.cardMobile]}>

          {/* AVATAR + TITLE ROW */}
          <View style={styles.bioTop}>
            <View style={styles.avatarWrap}>
              <View style={styles.avatarPlaceholder}>
                <AppText style={styles.avatarText}>{avatarChar}</AppText>
              </View>
              <View style={styles.verifiedDot}>
                <CheckmarkIcon size={8} color="#FFF" />
              </View>
            </View>

            <View style={styles.bioTitleBlock}>
              <Heading
                style={[styles.headerTitle, isMobile && styles.headerTitleMobile]}
                numberOfLines={3}
              >
                {mentor.professional_title || 'Interview Mentor'}
              </Heading>
              <View style={styles.verifiedBadge}>
                <AppText style={styles.verifiedBadgeText}>✓ VERIFIED MENTOR</AppText>
              </View>
            </View>
          </View>

          {/* STATS ROW */}
          <View style={styles.statsRow}>
            <TierBadge tier={mentor.tier} />
            {!!mentor.years_of_experience && (
              <View style={styles.statItem}>
                <AppText style={styles.statText}>🕐 {mentor.years_of_experience}y exp</AppText>
              </View>
            )}
            {!!mentor.total_sessions && (
              <View style={styles.statItem}>
                <AppText style={styles.statText}>🎯 {mentor.total_sessions} sessions</AppText>
              </View>
            )}
            {!!mentor.average_rating && (
              <View style={styles.statItem}>
                <AppText style={styles.statText}>⭐ {mentor.average_rating.toFixed(1)}</AppText>
              </View>
            )}
          </View>

          {/* BIO */}
          <View style={styles.bioSection}>
            <AppText
              style={styles.sectionBody}
              numberOfLines={bioExpanded ? undefined : BIO_COLLAPSE_LINES}
            >
              {mentor.experience_description || 'Experienced interview mentor ready to help you crack your next interview with personalized feedback and insider tips from top companies.'}
            </AppText>

            {/* Only show toggle if there's enough text to warrant it */}
            {(mentor.experience_description || '').length > 160 && (
              <TouchableOpacity
                onPress={() => setBioExpanded(e => !e)}
                activeOpacity={0.7}
                style={styles.readMoreBtn}
              >
                <AppText style={styles.readMoreText}>
                  {bioExpanded ? 'Read less ↑' : 'Read more ↓'}
                </AppText>
              </TouchableOpacity>
            )}
          </View>
        </Card>

        {/* ── BOOKING CARD ─────────────────────────────────────────────── */}
        <Card style={[styles.card, isMobile && styles.cardMobile]}>
          <View style={styles.sectionHeader}>
            <TargetIcon size={20} color="#6B7280" />
            <AppText style={styles.sectionTitle}>Book a Session</AppText>
          </View>

          {/* ── SESSION TYPE + PRICING SELECTOR ── */}
          <AppText style={styles.subLabel}>Choose a session type:</AppText>
          <View style={styles.sessionTypeGrid}>

            {/* INTRO */}
            {(() => {
              const isActive = sessionType === 'intro';
              return (
                <TouchableOpacity
                  style={[styles.stCard, isActive && styles.stCardActive, isActive && { borderColor: '#7C3AED', backgroundColor: '#F5F3FF' }]}
                  onPress={() => setSessionType('intro')}
                  activeOpacity={0.75}
                >
                  {isActive && (
                    <View style={[styles.stCheckDot, { backgroundColor: '#7C3AED' }]}>
                      <CheckmarkIcon size={8} color="#FFF" />
                    </View>
                  )}
                  <View style={[styles.stIconWrap, { backgroundColor: isActive ? '#EDE9FE' : '#F3F4F6' }]}>
                    <ChatIcon size={18} color={isActive ? '#7C3AED' : '#9CA3AF'} />
                  </View>
                  <AppText style={[styles.stLabel, isActive && { color: '#7C3AED' }]}>Intro Call</AppText>
                  <AppText style={[styles.stPrice, isActive && { color: '#7C3AED' }]}>₹{introPrice.toLocaleString()}</AppText>
                  <AppText style={styles.stDuration}>25 min</AppText>
                </TouchableOpacity>
              );
            })()}

            {/* MOCK */}
            {(() => {
              const isActive = sessionType === 'mock';
              return (
                <TouchableOpacity
                  style={[styles.stCard, isActive && styles.stCardActive, isActive && { borderColor: theme.colors.primary, backgroundColor: '#F0FDFA' }]}
                  onPress={() => setSessionType('mock')}
                  activeOpacity={0.75}
                >
                  {isActive && (
                    <View style={[styles.stCheckDot, { backgroundColor: theme.colors.primary }]}>
                      <CheckmarkIcon size={8} color="#FFF" />
                    </View>
                  )}
                  <View style={styles.stPopularBadge}>
                    <AppText style={styles.stPopularText}>POPULAR</AppText>
                  </View>
                  <View style={[styles.stIconWrap, { backgroundColor: isActive ? '#CCFBF1' : '#F3F4F6' }]}>
                    <TargetIcon size={18} color={isActive ? theme.colors.primary : '#9CA3AF'} />
                  </View>
                  <AppText style={[styles.stLabel, isActive && { color: theme.colors.primary }]}>Mock</AppText>
                  <AppText style={[styles.stPrice, isActive && { color: theme.colors.primary }]}>₹{mockPrice.toLocaleString()}</AppText>
                  <AppText style={styles.stDuration}>55 min</AppText>
                </TouchableOpacity>
              );
            })()}

            {/* BUNDLE */}
            {(() => {
              const isActive = sessionType === 'bundle';
              return (
                <TouchableOpacity
                  style={[styles.stCard, isActive && styles.stCardActive, isActive && { borderColor: '#D97706', backgroundColor: '#FFFBEB' }]}
                  onPress={() => setSessionType('bundle')}
                  activeOpacity={0.75}
                >
                  {isActive && (
                    <View style={[styles.stCheckDot, { backgroundColor: '#D97706' }]}>
                      <CheckmarkIcon size={8} color="#FFF" />
                    </View>
                  )}
                  <View style={[styles.stIconWrap, { backgroundColor: isActive ? '#FEF3C7' : '#F3F4F6' }]}>
                    <LayersIcon size={18} color={isActive ? '#D97706' : '#9CA3AF'} />
                  </View>
                  <AppText style={[styles.stLabel, isActive && { color: '#D97706' }]}>Bundle ×3</AppText>
                  <AppText style={[styles.stPrice, isActive && { color: '#D97706' }]}>₹{bundlePrice.toLocaleString()}</AppText>
                  <AppText style={styles.stDuration}>3 × 55 min</AppText>
                  {bundleSaving > 0 ? (
                    <View style={styles.stSavingBadge}>
                      <AppText style={styles.stSavingText}>save ₹{bundleSaving.toLocaleString()}</AppText>
                    </View>
                  ) : (
                    <AppText style={styles.stDesc}>Best{'\n'}value</AppText>
                  )}
                </TouchableOpacity>
              );
            })()}

          </View>

          {/* ── INTRO CALL NOTICE ── */}
          {sessionType === 'intro' && (
            <View style={styles.introNotice}>
              <AppText style={styles.introNoticeLabel}>Intro Call</AppText>
              <AppText style={styles.introNoticeText}>
                A 25-minute discovery call. Your mentor will understand your goals, assess your level, and recommend topics to practise. <AppText style={{ fontWeight: '700' }}>Not a mock interview.</AppText> One intro call allowed per mentor.
              </AppText>
            </View>
          )}

          {/* ── MOCK NOTICE ── */}
          {sessionType === 'mock' && (
            <View style={styles.mockNotice}>
              <AppText style={styles.mockNoticeLabel}>Mock Interview</AppText>
              <AppText style={styles.mockNoticeText}>
                A full 55-minute simulation. Your mentor conducts a realistic interview, evaluates your responses, and gives a detailed scorecard with actionable feedback.
              </AppText>
            </View>
          )}

          {/* ── BUNDLE NOTICE ── */}
          {sessionType === 'bundle' && (
            <View style={styles.bundleNotice}>
              <AppText style={styles.bundleNoticeLabel}>Bundle ×3</AppText>
              <AppText style={styles.bundleNoticeText}>
                Three 55-minute mock interviews at a discounted rate. Best for structured prep — pick 3 skills and track your improvement across sessions. You can repeat the same skill.
              </AppText>
            </View>
          )}

          <View style={styles.profileDivider} />

          {/* ── PROFILE PICKER (all session types) ── */}
          <AppText style={styles.subLabel}>
            {sessionType === 'intro' ? 'Which interview track are you preparing for?' : 'Choose an interview profile:'}
          </AppText>
          {profiles.length === 0 ? (
            <AppText style={styles.emptyText}>No profiles available</AppText>
          ) : (
            <View style={styles.tagsContainer}>
              {profiles.map((profile) => {
                const isSelected = selectedProfileId === profile.id;
                return (
                  <TouchableOpacity
                    key={profile.id}
                    style={[styles.tag, isSelected && styles.tagActive]}
                    onPress={() => {
                      setLoadingSkills(true);
                      setSkills([]);
                      setSelectedProfileId(profile.id);
                      setSelectedSkill(null);
                      setBundleSkills([]);
                    }}
                    activeOpacity={0.7}
                  >
                    {isSelected && <CheckmarkIcon size={14} color="#FFF" />}
                    <AppText style={[styles.tagText, isSelected && styles.tagTextActive]}>
                      {profile.name}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* ── SKILL SECTION (mock and bundle only) ── */}
          {sessionType !== 'intro' && selectedProfileId && (
            <View style={styles.skillSection}>

              {/* MOCK — single skill picker */}
              {sessionType === 'mock' && (
                <>
                  <AppText style={styles.subLabel}>Select the skill you want to practise:</AppText>
                  {loadingSkills ? (
                    <View style={styles.loadingSkills}>
                      <ActivityIndicator size="small" color={theme.colors.primary} />
                      <AppText style={styles.loadingSkillsText}>Loading skills...</AppText>
                    </View>
                  ) : skills.length > 0 ? (
                    <>
                      <View style={styles.tagsContainer}>
                        {skills.map((skill) => {
                          const isSelected = selectedSkill?.id === skill.id;
                          const isJD = skill.name.toLowerCase().includes('jd-based');
                          return (
                            <TouchableOpacity
                              key={skill.id}
                              style={[
                                styles.tag,
                                isSelected && styles.skillTagActive,
                                isJD && !isSelected && styles.skillTagJD,
                                isJD && isSelected && styles.skillTagJDActive,
                              ]}
                              onPress={() => setSelectedSkill(skill)}
                            >
                              {isJD && <AppText style={{ fontSize: 13 }}>📄</AppText>}
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
                      {selectedSkill?.name.toLowerCase().includes('jd-based') && (
                        <View style={styles.jdNotice}>
                          <AppText style={styles.jdNoticeText}>
                            📄 You'll paste your job description on the next screen.
                          </AppText>
                        </View>
                      )}
                    </>
                  ) : (
                    <View style={styles.noSkills}>
                      <AppText style={styles.noSkillsText}>No skills available. Please contact support.</AppText>
                    </View>
                  )}
                </>
              )}

              {/* BUNDLE — 3-skill tracker */}
              {sessionType === 'bundle' && (
                <>
                  {/* Tracker */}
                  <AppText style={styles.subLabel}>
                    Choose 3 skills to practise ({bundleSkills.length}/3):
                  </AppText>
                  <View style={styles.bundleTracker}>
                    {[0, 1, 2].map((i) => {
                      const skill = bundleSkills[i];
                      return (
                        <View
                          key={i}
                          style={[
                            styles.bundleSlot,
                            skill ? styles.bundleSlotFilled : styles.bundleSlotEmpty,
                          ]}
                        >
                          <AppText style={styles.bundleSlotLabel}>Session {i + 1}</AppText>
                          {skill ? (
                            <View style={styles.bundleSlotContent}>
                              <AppText style={styles.bundleSlotName} numberOfLines={1}>
                                {skill.name}
                              </AppText>
                              <TouchableOpacity
                                onPress={() => handleBundleSkillRemove(i)}
                                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                              >
                                <XIcon size={12} color={theme.colors.primary} />
                              </TouchableOpacity>
                            </View>
                          ) : (
                            <AppText style={styles.bundleSlotPlaceholder}>Tap a skill below</AppText>
                          )}
                        </View>
                      );
                    })}
                  </View>

                  {/* Skill picker */}
                  {loadingSkills ? (
                    <View style={styles.loadingSkills}>
                      <ActivityIndicator size="small" color={theme.colors.primary} />
                      <AppText style={styles.loadingSkillsText}>Loading skills...</AppText>
                    </View>
                  ) : skills.length > 0 ? (
                    <View style={styles.tagsContainer}>
                      {skills.map((skill) => {
                        const countInBundle = bundleSkills.filter(s => s.id === skill.id).length;
                        const isJD = skill.name.toLowerCase().includes('jd-based');
                        const isFull = bundleSkills.length >= 3;
                        return (
                          <TouchableOpacity
                            key={skill.id}
                            style={[
                              styles.tag,
                              countInBundle > 0 && styles.skillTagActive,
                              isJD && countInBundle === 0 && styles.skillTagJD,
                              isJD && countInBundle > 0 && styles.skillTagJDActive,
                              isFull && countInBundle === 0 && styles.tagDisabled,
                            ]}
                            onPress={() => !isFull && handleBundleSkillPress(skill)}
                            disabled={isFull && countInBundle === 0}
                            activeOpacity={0.7}
                          >
                            {isJD && <AppText style={{ fontSize: 13 }}>📄</AppText>}
                            <AppText style={[styles.tagText, countInBundle > 0 && styles.tagTextActive]}>
                              {skill.name}
                            </AppText>
                            {countInBundle > 0 && (
                              <View style={styles.skillCountBadge}>
                                <AppText style={styles.skillCountText}>×{countInBundle}</AppText>
                              </View>
                            )}
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  ) : (
                    <View style={styles.noSkills}>
                      <AppText style={styles.noSkillsText}>No skills available. Please contact support.</AppText>
                    </View>
                  )}
                </>
              )}
            </View>
          )}
        </Card>


        {/* ── CTA ──────────────────────────────────────────────────────── */}
        <View style={[styles.ctaSection, isMobile && styles.ctaSectionMobile]}>
          <TouchableOpacity
            style={[styles.scheduleButton, !ctaEnabled && styles.scheduleButtonDisabled]}
            activeOpacity={0.9}
            onPress={handleSchedule}
            disabled={!ctaEnabled}
          >
            <AppText style={[styles.scheduleButtonText, !ctaEnabled && styles.scheduleButtonTextDisabled, isMobile && { fontSize: 15 }]}>
              {!ctaEnabled
                ? sessionType === 'intro'
                  ? 'Select a Profile Above'
                  : sessionType === 'bundle'
                    ? bundleSkills.length < 3
                      ? `Choose ${3 - bundleSkills.length} more skill${3 - bundleSkills.length > 1 ? 's' : ''}`
                      : 'Select a Profile Above'
                    : !selectedProfileId
                      ? 'Select a Profile Above'
                      : 'Select a Skill Above'
                : 'Choose Date & Time →'
              }
            </AppText>
          </TouchableOpacity>
          {ctaEnabled && (
            <AppText style={styles.ctaSubtext}>
              Next: pick your time slot{sessionType === 'bundle' ? 's (3 required)' : ''}
            </AppText>
          )}
        </View>

        {/* ── SEO ──────────────────────────────────────────────────────── */}
        <View style={styles.seoSection}>
          <Heading level={2} style={styles.seoTitle}>What to Expect</Heading>
          <AppText style={styles.seoText}>
            Your mock interview session will be conducted just like a real interview. The mentor will ask relevant questions based on the skill you selected, evaluate your responses, and provide detailed feedback on areas of strength and improvement.
          </AppText>
          <Heading level={3} style={styles.seoSubtitle}>After the Session</Heading>
          <AppText style={styles.seoText}>
            You'll receive comprehensive feedback covering your communication skills, technical knowledge, problem-solving approach, and overall interview readiness. This feedback will help you identify specific areas to focus on before your actual interviews.
          </AppText>
        </View>

        <Footer />
      </ScrollView>
    </View>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  pageContainer: { flex: 1, backgroundColor: '#f8f5f0' },
  container: { flex: 1 },
  scrollContent: { padding: 20, gap: 16, paddingBottom: 40 },
  scrollContentMobile: { padding: 12, gap: 12 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },

  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3 },
      android: { elevation: 2 },
    }),
  },
  cardMobile: { padding: 16, borderRadius: 12 },

  // Bio card
  bioCard: { padding: 0, overflow: 'hidden' },
  bioTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 16, padding: 24, paddingBottom: 16 },
  avatarWrap: { position: 'relative', flexShrink: 0 },
  avatarPlaceholder: { width: 64, height: 64, borderRadius: 32, backgroundColor: theme.colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 26, fontWeight: '800', color: '#FFF' },
  verifiedDot: { position: 'absolute', bottom: 0, right: 0, width: 20, height: 20, borderRadius: 10, backgroundColor: '#10B981', borderWidth: 2, borderColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
  bioTitleBlock: { flex: 1, flexShrink: 1, paddingTop: 2 },
  headerTitle: { fontSize: 19, fontWeight: '800', color: theme.colors.text.main, lineHeight: 26, flexShrink: 1, marginBottom: 6 },
  headerTitleMobile: { fontSize: 16, lineHeight: 22 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ECFDF5', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, alignSelf: 'flex-start', borderWidth: 1, borderColor: '#A7F3D0' },
  verifiedBadgeText: { fontSize: 10, fontWeight: '700', color: '#065F46', letterSpacing: 0.3 },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 24, paddingBottom: 16 },
  tierBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, borderWidth: 1.5, gap: 4 },
  tierText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },
  statItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB' },
  statText: { fontSize: 12, fontWeight: '600', color: '#374151' },
  bioSection: { borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingHorizontal: 24, paddingTop: 16, paddingBottom: 20 },
  sectionBody: { fontSize: 14, color: '#4B5563', lineHeight: 22 },
  readMoreBtn: { marginTop: 10, alignSelf: 'flex-start' },
  readMoreText: { fontSize: 13, fontWeight: '700', color: theme.colors.primary },

  // Session type + pricing selector — 3 vertical cards
  subLabel: { fontSize: 14, color: theme.colors.text.light, marginBottom: 10 },
  sessionTypeGrid: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  stCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#FAFAFA',
    padding: 14,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4 },
      android: { elevation: 1 },
    }),
  },
  stCardActive: { borderWidth: 2 },
  stCheckDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stPopularBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.primary,
    paddingVertical: 3,
    alignItems: 'center',
  },
  stPopularText: { fontSize: 8, fontWeight: '800', color: '#FFF', letterSpacing: 0.5 },
  stIconWrap: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 10, marginTop: 4 },
  stLabel: { fontSize: 18, fontWeight: '700', color: '#374151', marginBottom: 6, textAlign: 'center' },
  stPrice: { fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 4, textAlign: 'center' },
  stDuration: { fontSize: 12, color: '#9CA3AF', fontWeight: '500', marginBottom: 6, textAlign: 'center' },
  stDesc: { fontSize: 11, color: '#9CA3AF', textAlign: 'center', lineHeight: 15 },
  stSavingBadge: { backgroundColor: '#FEF3C7', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 20 },
  stSavingText: { fontSize: 10, fontWeight: '700', color: '#92400E' },
  sessionTypeCheck: { width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  bestValueBadge: { backgroundColor: '#FEF3C7', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4 },
  bestValueBadgeText: { fontSize: 9, fontWeight: '800', color: '#92400E', letterSpacing: 0.3 },

  // Notices
  introNotice: { borderRadius: 10, padding: 14, marginBottom: 12, borderWidth: 1, backgroundColor: '#F5F3FF', borderColor: '#DDD6FE' },
  introNoticeLabel: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase' as const, letterSpacing: 0.5, color: '#7C3AED', marginBottom: 5 },
  introNoticeText: { fontSize: 13, color: '#5B21B6', lineHeight: 20 },
  bundleNotice: { borderRadius: 10, padding: 14, marginBottom: 12, borderWidth: 1, backgroundColor: '#FFFBEB', borderColor: '#FDE68A' },
  bundleNoticeLabel: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase' as const, letterSpacing: 0.5, color: '#D97706', marginBottom: 5 },
  bundleNoticeText: { fontSize: 13, color: '#92400E', lineHeight: 20 },
  mockNotice: { borderRadius: 10, padding: 14, marginBottom: 12, borderWidth: 1, backgroundColor: '#F0FDFA', borderColor: '#5EEAD4' },
  mockNoticeLabel: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase' as const, letterSpacing: 0.5, color: '#0E9384', marginBottom: 5 },
  mockNoticeText: { fontSize: 13, color: '#0F766E', lineHeight: 20 },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: theme.colors.text.main },

  profileDivider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 16 },

  // Tags
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tag: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999, gap: 6 },
  tagActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  tagDisabled: { opacity: 0.4 },
  skillTagActive: { backgroundColor: '#059669', borderColor: '#059669' },
  skillTagJD: { borderColor: '#7C3AED', borderStyle: 'dashed' as any },
  skillTagJDActive: { backgroundColor: '#7C3AED', borderColor: '#7C3AED', borderStyle: 'solid' as any },
  tagText: { fontSize: 14, color: theme.colors.text.body, fontWeight: '500' },
  tagTextActive: { color: '#FFF', fontWeight: '600' },
  skillCountBadge: { backgroundColor: 'rgba(255,255,255,0.3)', paddingHorizontal: 5, paddingVertical: 1, borderRadius: 8 },
  skillCountText: { fontSize: 11, color: '#FFF', fontWeight: '700' },

  skillSection: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  skillDesc: { fontSize: 13, color: '#666', marginTop: 8, fontStyle: 'italic' },
  jdNotice: { marginTop: 10, backgroundColor: '#F5F3FF', borderRadius: 8, padding: 10, borderWidth: 1, borderColor: '#DDD6FE' },
  jdNoticeText: { fontSize: 13, color: '#5B21B6', lineHeight: 18 },
  loadingSkills: { padding: 20, alignItems: 'center', flexDirection: 'row', gap: 8 },
  loadingSkillsText: { fontSize: 12, color: theme.colors.text.light },
  noSkills: { padding: 16, backgroundColor: '#FEF2F2', borderRadius: 8, marginTop: 8 },
  noSkillsText: { color: '#DC2626', fontSize: 14, textAlign: 'center' },

  // Bundle tracker
  bundleTracker: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  bundleSlot: { flex: 1, borderRadius: 10, padding: 10, minHeight: 72 },
  bundleSlotFilled: { backgroundColor: '#F0FDFA', borderWidth: 1.5, borderColor: theme.colors.primary },
  bundleSlotEmpty: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderStyle: 'dashed' as any },
  bundleSlotLabel: { fontSize: 10, fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', marginBottom: 6 },
  bundleSlotContent: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  bundleSlotName: { fontSize: 12, fontWeight: '600', color: theme.colors.primary, flex: 1 },
  bundleSlotPlaceholder: { fontSize: 11, color: '#D1D5DB', fontStyle: 'italic' },


  // CTA
  ctaSection: { paddingVertical: 24, paddingHorizontal: 20, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: theme.colors.border, borderRadius: 12, marginTop: 4 },
  ctaSectionMobile: { paddingHorizontal: 16, paddingVertical: 20 },
  scheduleButton: { backgroundColor: theme.colors.primary, paddingVertical: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center', shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  scheduleButtonDisabled: { backgroundColor: '#D1D5DB', shadowOpacity: 0, elevation: 0 },
  scheduleButtonText: { fontSize: 16, fontWeight: '700', color: '#FFF' },
  scheduleButtonTextDisabled: { color: '#9CA3AF' },
  ctaSubtext: { fontSize: 13, color: '#9CA3AF', textAlign: 'center', marginTop: 10 },

  // SEO
  seoSection: { paddingVertical: 24 },
  seoTitle: { fontSize: 20, fontWeight: '700', color: theme.colors.text.main, marginBottom: 12 },
  seoSubtitle: { fontSize: 16, fontWeight: '600', color: theme.colors.text.main, marginTop: 20, marginBottom: 8 },
  seoText: { fontSize: 15, color: theme.colors.text.body, lineHeight: 24, marginBottom: 12 },

  emptyText: { fontSize: 14, color: theme.colors.text.light, fontStyle: 'italic' },
});