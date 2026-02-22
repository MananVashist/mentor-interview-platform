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

type SessionType = 'intro' | 'mock' | 'bundle';

export default function MentorDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [mentor, setMentor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // State for Selection
  const [profiles, setProfiles] = useState<any[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(null);
  
  // Session Type State
  const [sessionType, setSessionType] = useState<SessionType>('mock');

  // Skills State
  const [skills, setSkills] = useState<any[]>([]);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<any>(null); // For mock
  const [bundleSkills, setBundleSkills] = useState<any[]>([]); // For bundle

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
            
            // Fetch Tier Cut from DB
            const { data: tierData } = await supabase
                .from('mentor_tiers')
                .select('percentage_cut')
                .eq('tier', tier)
                .single();

            const percentageCut = tierData?.percentage_cut || 50;
            // Formula: Final = Base / (1 - Cut%)
            const totalPrice = Math.round(basePrice / (1 - (percentageCut / 100)));
            
            const profileIds = data.profile_ids || [];

            // Fetch profile details from interview_profiles_admin
            if (profileIds.length > 0) {
              const { data: profilesData, error: profilesError } = await supabase
                .from('interview_profiles_admin')
                .select('id, name, description')
                .in('id', profileIds)
                .order('name');

              if (!profilesError && profilesData) {
                setProfiles(profilesData);
              } else {
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

        try {
            const { data, error } = await supabase
                .from('interview_skills_admin')
                .select('id, name, description')
                .eq('interview_profile_id', selectedProfileId)
                .order('name');

            if (error) {
                setSkills([]);
            } else {
                setSkills(data || []);
            }
        } finally {
            setLoadingSkills(false);
        }
    }

    fetchSkills();
  }, [selectedProfileId]);

  // Reset skill selections when session type changes
  useEffect(() => {
    setSelectedSkill(null);
    setBundleSkills([]);
  }, [sessionType]);

  // Bundle skill handlers
  const handleBundleSkillPress = (skill: any) => {
    if (bundleSkills.length >= 3) return;
    setBundleSkills(prev => [...prev, skill]);
  };

  const handleBundleSkillRemove = (index: number) => {
    setBundleSkills(prev => prev.filter((_, i) => i !== index));
  };

  // Pricing Derivations
  const mockPrice = mentor?.totalPrice || 0;
  const introPrice = Math.round(mockPrice * 0.20);
  const bundlePrice = Math.round(mockPrice * 2.5);

  // CTA logic
  const ctaEnabled = (() => {
    if (!selectedProfileId) return false;
    if (sessionType === 'intro') return true;
    if (sessionType === 'mock') return !!selectedSkill;
    if (sessionType === 'bundle') return bundleSkills.length === 3;
    return false;
  })();

  const handleSchedule = () => {
    if (!ctaEnabled) return;

    let finalPrice = mockPrice;

    if (sessionType === 'intro') {
      finalPrice = introPrice;
      router.push({
        pathname: "/candidate/schedule",
        params: {
          mentorId: id,
          profileId: selectedProfileId,
          sessionType: 'intro',
          totalPrice: finalPrice,
        }
      });
    } else if (sessionType === 'mock') {
      finalPrice = mockPrice;
      router.push({
        pathname: "/candidate/schedule",
        params: {
          mentorId: id,
          profileId: selectedProfileId,
          skillId: selectedSkill?.id || '',
          skillName: selectedSkill?.name || '',
          sessionType: 'mock',
          totalPrice: finalPrice,
        }
      });
    } else if (sessionType === 'bundle') {
      finalPrice = bundlePrice;
      // Use plural param names (skillIds / skillNames) so schedule.tsx can parse them
      router.push({
        pathname: "/candidate/schedule",
        params: {
          mentorId: id,
          profileId: selectedProfileId,
          skillIds: bundleSkills.map(s => s.id).join(','),
          skillNames: bundleSkills.map(s => encodeURIComponent(s.name)).join('|'),
          sessionType: 'bundle',
          totalPrice: finalPrice,
        }
      });
    }
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
            <Ionicons name="calendar-outline" size={20} color={theme.colors.text.light} style={{ marginRight: 8 }} />
            <AppText style={styles.sectionTitle}>Book a Session</AppText>
          </View>

          {/* ── SESSION TYPE + PRICING SELECTOR ── */}
          <AppText style={styles.subLabel}>Choose a session type:</AppText>
          
          <View style={styles.pricingRow}>
            {/* INTRO */}
            <TouchableOpacity
              style={[styles.priceCell, sessionType === 'intro' && styles.priceCellActive]}
              onPress={() => setSessionType('intro')}
              activeOpacity={0.8}
            >
              <AppText style={[styles.priceCellLabel, sessionType === 'intro' && { color: '#7C3AED' }]}>Intro</AppText>
              <AppText style={[styles.priceCellAmount, sessionType === 'intro' && { color: '#7C3AED' }]}>₹{introPrice.toLocaleString()}</AppText>
              <AppText style={styles.priceCellSub}>25 min</AppText>
            </TouchableOpacity>

            {/* MOCK */}
            <TouchableOpacity
              style={[styles.priceCell, styles.priceCellMock, sessionType === 'mock' && styles.priceCellMockActive]}
              onPress={() => setSessionType('mock')}
              activeOpacity={0.8}
            >
              <View style={styles.popularBadge}>
                <AppText style={styles.popularBadgeText}>POPULAR</AppText>
              </View>
              <AppText style={[styles.priceCellLabel, { color: theme.colors.primary }]}>Mock</AppText>
              <AppText style={[styles.priceCellAmount, styles.priceCellAmountMock]}>₹{mockPrice.toLocaleString()}</AppText>
              <AppText style={styles.priceCellSub}>55 min</AppText>
            </TouchableOpacity>

            {/* BUNDLE */}
            <TouchableOpacity
              style={[styles.priceCell, sessionType === 'bundle' && styles.priceCellActive]}
              onPress={() => setSessionType('bundle')}
              activeOpacity={0.8}
            >
              <AppText style={[styles.priceCellLabel, sessionType === 'bundle' && { color: '#D97706' }]}>Bundle ×3</AppText>
              <AppText style={[styles.priceCellAmount, sessionType === 'bundle' && { color: '#D97706' }]}>₹{bundlePrice.toLocaleString()}</AppText>
              <AppText style={styles.priceCellSub}>3 × 55 min</AppText>
            </TouchableOpacity>
          </View>

          {/* ── EXPLANATION NOTICES ── */}
          {sessionType === 'intro' && (
            <View style={[styles.infoNotice, { backgroundColor: '#F5F3FF', borderColor: '#DDD6FE' }]}>
              <AppText style={[styles.infoNoticeLabel, { color: '#7C3AED' }]}>Intro Call</AppText>
              <AppText style={[styles.infoNoticeText, { color: '#5B21B6' }]}>
                A 25-minute discovery call. Your mentor will understand your goals, assess your level, and recommend topics to practise. <AppText style={{ fontWeight: '700' }}>Not a mock interview.</AppText>
              </AppText>
            </View>
          )}

          {sessionType === 'mock' && (
            <View style={[styles.infoNotice, { backgroundColor: '#F0FDFA', borderColor: '#5EEAD4' }]}>
              <AppText style={[styles.infoNoticeLabel, { color: '#0E9384' }]}>Mock Interview</AppText>
              <AppText style={[styles.infoNoticeText, { color: '#0F766E' }]}>
                A full 55-minute simulation. Your mentor conducts a realistic interview, evaluates your responses, and gives a detailed scorecard with actionable feedback.
              </AppText>
            </View>
          )}

          {sessionType === 'bundle' && (
            <View style={[styles.infoNotice, { backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }]}>
              <AppText style={[styles.infoNoticeLabel, { color: '#D97706' }]}>Bundle ×3</AppText>
              <AppText style={[styles.infoNoticeText, { color: '#92400E' }]}>
                Three 55-minute mock interviews at a discounted rate. Best for structured prep — pick 3 skills and track your improvement across sessions.
              </AppText>
            </View>
          )}

          <View style={styles.profileDivider} />
          
          {/* 1. Profile Pills */}
          <AppText style={styles.subLabel}>
            {sessionType === 'intro' ? 'Which track are you preparing for?' : 'Role Profile:'}
          </AppText>
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
                        setLoadingSkills(true);
                        setSkills([]); 
                        setSelectedProfileId(profile.id);
                        setSelectedSkill(null); 
                        setBundleSkills([]);
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

          {/* 2. Skill Pills (Dynamic based on Profile and Session Type) */}
          {sessionType !== 'intro' && selectedProfileId && (
             <View style={{ marginTop: 20, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#f0f0f0', minHeight: 100 }}>
                
                {/* MOCK — single skill picker */}
                {sessionType === 'mock' && (
                  <>
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
                                        onPress={() => setSelectedSkill(skill)}
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
                        <View style={styles.noSkills}>
                            <AppText style={styles.noSkillsText}>No skills available. Please contact support.</AppText>
                        </View>
                    )}
                  </>
                )}

                {/* BUNDLE — 3-skill tracker */}
                {sessionType === 'bundle' && (
                  <>
                    <AppText style={styles.subLabel}>Choose 3 skills to practise ({bundleSkills.length}/3):</AppText>
                    
                    {/* Tracker */}
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
                                  <Ionicons name="close" size={14} color={theme.colors.primary} />
                                </TouchableOpacity>
                              </View>
                            ) : (
                              <AppText style={styles.bundleSlotPlaceholder}>Tap below</AppText>
                            )}
                          </View>
                        );
                      })}
                    </View>

                    {/* Skill Picker */}
                    {loadingSkills ? (
                      <View style={{ padding: 20, alignItems: 'center' }}>
                          <ActivityIndicator size="small" color={theme.colors.primary} />
                          <AppText style={{ fontSize: 12, color: theme.colors.text.light, marginTop: 8 }}>Loading skills...</AppText>
                      </View>
                    ) : skills.length > 0 ? (
                      <View style={styles.tagsContainer}>
                        {skills.map((skill) => {
                          const countInBundle = bundleSkills.filter(s => s.id === skill.id).length;
                          const isFull = bundleSkills.length >= 3;
                          return (
                            <TouchableOpacity
                              key={skill.id}
                              style={[
                                styles.tag,
                                countInBundle > 0 && styles.skillTagActive,
                                isFull && countInBundle === 0 && styles.tagDisabled,
                              ]}
                              onPress={() => !isFull && handleBundleSkillPress(skill)}
                              disabled={isFull && countInBundle === 0}
                              activeOpacity={0.7}
                            >
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

        </View>

      </ScrollView>

      {/* FOOTER */}
      <SafeAreaView style={styles.footerWrapper}>
        <View style={styles.footerContent}>
          <TouchableOpacity 
          nativeID="btn-proceed-to-schedule" 
            style={[
              styles.scheduleButton,
              !ctaEnabled && styles.scheduleButtonDisabled
            ]}
            activeOpacity={0.9}
            onPress={handleSchedule}
            disabled={!ctaEnabled}
          >
            <AppText style={[styles.scheduleButtonText, !ctaEnabled && styles.scheduleButtonTextDisabled]}>
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
                : 'Select Time Slot'
              }
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
  
  // Session type + pricing selector
  subLabel: { fontSize: 14, color: theme.colors.text.light, marginBottom: 10 },
  pricingRow: { flexDirection: 'row', alignItems: 'stretch', gap: 6, marginTop: 4, marginBottom: 16 },
  priceCell: { flex: 1, alignItems: 'center', paddingVertical: 12, paddingHorizontal: 4, borderRadius: 10, borderWidth: 1, borderColor: '#F3F4F6', backgroundColor: '#F9FAFB' },
  priceCellActive: { borderColor: '#D1D5DB', borderWidth: 1.5 },
  priceCellMock: { backgroundColor: '#F0FDFA', borderRadius: 10, paddingHorizontal: 4, paddingVertical: 12, borderWidth: 1.5, borderColor: '#5EEAD4', position: 'relative', flex: 1, alignItems: 'center' },
  priceCellMockActive: { borderColor: theme.colors.primary, borderWidth: 2, backgroundColor: '#CCFBF1' },
  popularBadge: { position: 'absolute', top: -10, alignSelf: 'center', backgroundColor: theme.colors.primary, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20 },
  popularBadgeText: { fontSize: 8, fontWeight: '800', color: '#FFF', letterSpacing: 0.6 },
  priceCellLabel: { fontSize: 11, fontWeight: '700', color: '#6B7280', marginBottom: 6, textAlign: 'center', textTransform: 'uppercase' as const, letterSpacing: 0.4 },
  priceCellAmount: { fontSize: 18, fontWeight: '800', color: '#111827', textAlign: 'center' },
  priceCellAmountMock: { fontSize: 22, color: theme.colors.primary },
  priceCellSub: { fontSize: 11, color: '#9CA3AF', marginTop: 3, textAlign: 'center', fontWeight: '500' },
  priceDivider: { width: 0 },

  // Unified Notices
  infoNotice: { borderRadius: 10, padding: 14, marginBottom: 12, borderWidth: 1 },
  infoNoticeLabel: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase' as const, letterSpacing: 0.5, marginBottom: 5 },
  infoNoticeText: { fontSize: 13, lineHeight: 20, fontWeight: '400' },
  profileDivider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 16 },

  // Tags
  tagsContainer: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  tag: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999 },
  tagActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  skillTagActive: { backgroundColor: '#059669', borderColor: '#059669' },
  tagDisabled: { opacity: 0.4 },
  tagText: { fontSize: 14, color: theme.colors.text.body, fontWeight: "500" },
  tagTextActive: { color: "#FFF", fontWeight: "600" },
  skillCountBadge: { backgroundColor: 'rgba(255,255,255,0.3)', paddingHorizontal: 5, paddingVertical: 1, borderRadius: 8, marginLeft: 6 },
  skillCountText: { fontSize: 11, color: '#FFF', fontWeight: '700' },
  
  skillDesc: { fontSize: 14, color: '#666', marginTop: 8, fontStyle: 'italic' },
  emptyText: { fontSize: 14, color: theme.colors.text.light, fontStyle: 'italic' },
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

  footerWrapper: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#f8f5f0", borderTopWidth: 1, borderTopColor: theme.colors.border },
  footerContent: { paddingHorizontal: 24, paddingVertical: 16 },
  scheduleButton: { backgroundColor: theme.colors.primary, paddingVertical: 16, borderRadius: 12, alignItems: "center", justifyContent: "center", shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  scheduleButtonDisabled: { backgroundColor: '#D1D5DB', shadowOpacity: 0, elevation: 0 },
  scheduleButtonText: { fontSize: 16, fontWeight: "700", color: "#FFF" },
  scheduleButtonTextDisabled: { color: '#9CA3AF' },
});