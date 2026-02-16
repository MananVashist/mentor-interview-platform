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

const SUPABASE_URL = "https://rcbaaiiawrglvyzmawvr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjYmFhaWlhd3JnbHZ5em1hd3ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNTA1NjAsImV4cCI6MjA3NjcyNjU2MH0.V3qRHGXBMlspRS7XFJlXdo4qIcCms60Nepp7dYMEjLA";

// --- TYPOGRAPHY SYSTEM ---
const FONTS = {
  heading: { fontSize: 20, fontWeight: "700" as const, lineHeight: 28 },
  body: { fontSize: 14, fontWeight: "400" as const, lineHeight: 20 },
  bodyBold: { fontSize: 14, fontWeight: "600" as const, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: "400" as const, lineHeight: 16 },
  captionBold: { fontSize: 12, fontWeight: "600" as const, lineHeight: 16 },
};

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

const InfoCircleIcon = ({ size = 20, color = "#6B7280" }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <Path d="M12 16v-4" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M12 8h.01" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const TargetIcon = ({ size = 20, color = "#6B7280" }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <Circle cx="12" cy="12" r="6" stroke={color} strokeWidth="2" />
    <Circle cx="12" cy="12" r="2" fill={color} />
  </Svg>
);

const PricetagIcon = ({ size = 20, color = "#6B7280" }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="7" cy="7" r="1.5" fill={color} />
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
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    fetchMentorDetails();
  }, [id]);

  useEffect(() => {
    if (selectedProfileId) {
      fetchSkills();
    } else {
      setSkills([]);
      setSelectedSkill(null);
    }
  }, [selectedProfileId]);

  const fetchMentorDetails = async () => {
    if (!id) return;

    setLoading(true);
    try {
      // Fetch Mentor
      const mentorRes = await fetch(
        `${SUPABASE_URL}/rest/v1/mentors?select=*&id=eq.${id}&status=eq.approved&limit=1`,
        { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
      );
      const mentorData = await mentorRes.json();

      if (mentorData && mentorData.length > 0) {
        const m = mentorData[0];
        setMentor(m);

        // Calculate price
        const basePrice = m.session_price_inr || 1000;
        const tier = m.tier || 'bronze';

        const tierRes = await fetch(
          `${SUPABASE_URL}/rest/v1/mentor_tiers?select=percentage_cut&tier=eq.${tier}&limit=1`,
          { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
        );
        const tierData = await tierRes.json();
        const percentageCut = tierData?.[0]?.percentage_cut || 50;
        const calculatedPrice = Math.round(basePrice / (1 - percentageCut / 100));
        setTotalPrice(calculatedPrice);

        // Fetch Profiles
        if (m.profile_ids && m.profile_ids.length > 0) {
          const profilesRes = await fetch(
            `${SUPABASE_URL}/rest/v1/interview_profiles_admin?select=id,name,description&id=in.(${m.profile_ids.join(',')})&order=name`,
            { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
          );
          const profilesData = await profilesRes.json();
          setProfiles(profilesData || []);
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
      const skillsRes = await fetch(
        `${SUPABASE_URL}/rest/v1/interview_skills_admin?select=id,name,description&interview_profile_id=eq.${selectedProfileId}&order=name`,
        { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
      );
      const skillsData = await skillsRes.json();
      setSkills(skillsData || []);
    } catch (err) {
      console.error('[PublicMentorDetail] Skills Error:', err);
    } finally {
      setLoadingSkills(false);
    }
  };

  const handleSchedule = () => {
    // Redirect to sign-up with return URL
    const returnUrl = `/candidate/schedule?mentorId=${id}&profileId=${selectedProfileId}&skillId=${selectedSkill?.id}&totalPrice=${totalPrice}`;

    if (Platform.OS === 'web') {
      window.location.href = `/auth/sign-up?redirect=${encodeURIComponent(returnUrl)}`;
    } else {
      router.push(`/auth/sign-up?redirect=${encodeURIComponent(returnUrl)}` as any);
    }
  };

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
        {/* BIO CARD */}
        <Card style={[styles.card, isMobile && styles.cardMobile]}>
          <View style={[styles.bioHeader, isMobile && styles.bioHeaderMobile]}>
            <View style={styles.avatarPlaceholder}>
              <AppText style={styles.avatarText}>{avatarChar}</AppText>
            </View>
            <View style={{ flex: 1, flexShrink: 1, width: isMobile ? '70%' : 'auto' }}>
              <Heading style={[styles.headerTitle, isMobile && styles.headerTitleMobile]} numberOfLines={isMobile ? 2 : 3}>
                {mentor.professional_title || 'Interview Mentor'}
              </Heading>
              <View style={styles.badge}>
                <AppText style={styles.badgeText}>VERIFIED MENTOR</AppText>
              </View>
            </View>
          </View>

          <View style={styles.statsRow}>
            <TierBadge tier={mentor.tier} />
            {mentor.years_of_experience && (
              <View style={styles.statItem}>
                <AppText style={styles.statText}>{isMobile ? `${mentor.years_of_experience}y exp` : `${mentor.years_of_experience} years experience`}</AppText>
              </View>
            )}
            {mentor.total_sessions && (
              <View style={styles.statItem}>
                <AppText style={styles.statText}>{mentor.total_sessions} sessions</AppText>
              </View>
            )}
            {mentor.average_rating && (
              <View style={styles.statItem}>
                <AppText style={styles.statText}>★ {mentor.average_rating.toFixed(1)}</AppText>
              </View>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.sectionHeader}>
            <InfoCircleIcon size={20} color="#6B7280" />
            <AppText style={styles.sectionTitle}>About This Mentor</AppText>
          </View>
          <AppText style={styles.sectionBody}>
            {mentor.experience_description || 'Experienced interview mentor ready to help you crack your next interview with personalized feedback and insider tips from top companies.'}
          </AppText>
        </Card>

        {/* INTERVIEW PROFILE SELECTION */}
        <Card style={[styles.card, isMobile && styles.cardMobile]}>
          <View style={styles.sectionHeader}>
            <TargetIcon size={20} color="#6B7280" />
            <AppText style={styles.sectionTitle}>Select Interview Type</AppText>
          </View>

          <AppText style={styles.subLabel}>Choose the interview profile you want to practice:</AppText>
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

          {/* SKILL PILLS */}
          {selectedProfileId && (
            <View style={{ marginTop: 20, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#f0f0f0', minHeight: 100 }}>
              <AppText style={styles.subLabel}>Select the specific skill you want to practice:</AppText>

              {loadingSkills ? (
                <View style={{ padding: 20, alignItems: 'center' }}>
                  <ActivityIndicator size="small" color={theme.colors.primary} />
                  <AppText style={{ fontSize: 12, color: theme.colors.text.light, marginTop: 8 }}>
                    Loading skills...
                  </AppText>
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
                <View style={{ padding: 16, backgroundColor: '#FEF2F2', borderRadius: 8, marginTop: 8 }}>
                  <AppText style={{ color: '#DC2626', fontSize: 14, textAlign: 'center' }}>
                    No skills available for this profile. Please contact support.
                  </AppText>
                </View>
              )}
            </View>
          )}
        </Card>

        {/* PRICING */}
        <Card style={[styles.card, isMobile && styles.cardMobile]}>
          <View style={styles.sectionHeader}>
            <PricetagIcon size={20} color="#6B7280" />
            <AppText style={styles.sectionTitle}>Session Price</AppText>
          </View>

          <View style={styles.priceContainer}>
            <View style={styles.priceRow}>
              <View style={{ flex: 1, width: '100%' }}>
                <AppText style={styles.priceMain}>₹{totalPrice.toLocaleString()}</AppText>
                <View style={styles.includesBadge}>
                  <AppText style={styles.includesText} numberOfLines={2}>
                    📹 Includes 1 focused 55-minute session
                  </AppText>
                </View>
                <AppText style={[styles.priceNote, isMobile && styles.priceNoteMobile]} numberOfLines={3}>
                  Get personalized feedback and actionable insights to improve your interview skills
                </AppText>
              </View>
            </View>
          </View>
        </Card>

        {/* CTA SECTION - MOVED ABOVE SEO CONTENT */}
        <View style={[styles.ctaSection, isMobile && styles.ctaSectionMobile]}>
          <TouchableOpacity
            style={[
              styles.scheduleButton,
              (!selectedProfileId || !selectedSkill) && styles.scheduleButtonDisabled
            ]}
            activeOpacity={0.9}
            onPress={handleSchedule}
            disabled={!selectedProfileId || !selectedSkill}
          >
            <AppText
              style={[
                styles.scheduleButtonText,
                (!selectedProfileId || !selectedSkill) && styles.scheduleButtonTextDisabled,
                isMobile && { fontSize: 15 }
              ]}
            >
              {!selectedProfileId || !selectedSkill ? 'Select Profile & Skill Above' : 'Sign Up to Book Session'}
            </AppText>
          </TouchableOpacity>
        </View>

        {/* SEO CONTENT */}
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

        {/* FOOTER */}
        <Footer />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: { flex: 1, backgroundColor: "#f8f5f0" },
  container: { flex: 1 },
  scrollContent: { padding: 20, gap: 16, paddingBottom: 40 },
  scrollContentMobile: { padding: 12, gap: 12 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 40 },

  // Cards
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3 },
      android: { elevation: 2 }
    }),
  },
  cardMobile: { padding: 16, borderRadius: 12 },

  bioHeader: { flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 16 },
  bioHeaderMobile: { alignItems: "flex-start", gap: 12 },
  avatarPlaceholder: { width: 56, height: 56, borderRadius: 28, backgroundColor: theme.colors.primary, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  avatarText: { fontSize: 24, fontWeight: "700", color: "#FFF" },
  headerTitle: { fontSize: 20, fontWeight: "800", color: theme.colors.text.main, flexShrink: 1 },
  headerTitleMobile: { fontSize: 17, lineHeight: 22, flexShrink: 1, flexWrap: 'wrap' },
  badge: { flexDirection: "row", alignItems: "center", backgroundColor: theme.colors.gray[100], borderWidth: 0, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, alignSelf: "flex-start", marginTop: 4 },
  badgeText: { fontSize: 11, fontWeight: "700", color: theme.colors.text.body, letterSpacing: 0.5 },

  statsRow: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 12, marginBottom: 16 },
  tierBadge: { flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, borderWidth: 1.5, gap: 4 },
  tierText: { fontSize: 12, fontWeight: "700", letterSpacing: 0.3 },
  statItem: { flexDirection: "row", alignItems: "center", backgroundColor: theme.colors.gray[50], paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  statText: { fontSize: 12, fontWeight: "600", color: theme.colors.text.body },

  divider: { height: 1, backgroundColor: theme.colors.border, marginBottom: 16 },

  sectionHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12, gap: 8 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: theme.colors.text.main },
  sectionBody: { fontSize: 15, color: theme.colors.text.body, lineHeight: 24 },

  subLabel: { fontSize: 14, color: theme.colors.text.light, marginBottom: 8 },
  tagsContainer: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  tag: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999, gap: 6 },
  tagActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  skillTagActive: { backgroundColor: '#059669', borderColor: '#059669' },
  tagText: { fontSize: 14, color: theme.colors.text.body, fontWeight: "500" },
  tagTextActive: { color: "#FFF", fontWeight: "600" },
  skillDesc: { fontSize: 14, color: '#666', marginTop: 8, fontStyle: 'italic' },
  emptyText: { fontSize: 14, color: theme.colors.text.light, fontStyle: 'italic' },

  priceContainer: { marginTop: 4 },
  priceRow: { flexDirection: "row", alignItems: "center" },
  priceMain: { fontSize: 32, fontWeight: "800", color: theme.colors.text.main, marginBottom: 8 },
  includesBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: theme.colors.pricing.greenBg, 
    paddingHorizontal: 10, 
    paddingVertical: 6, 
    borderRadius: 6, 
    alignSelf: 'flex-start', 
    marginBottom: 8,
    flexShrink: 1,
    maxWidth: '100%'
  },
  includesText: { fontSize: 13, fontWeight: "600", color: theme.colors.primary, flexShrink: 1, flexWrap: 'wrap' },
  priceNote: { fontSize: 13, color: theme.colors.text.light, lineHeight: 20, flexShrink: 1, flexWrap: 'wrap' },
  priceNoteMobile: { maxWidth: '100%', width: '100%' },

  // SEO Section
  seoSection: { paddingVertical: 24, paddingHorizontal: 0 },
  seoTitle: { fontSize: 20, fontWeight: '700', color: theme.colors.text.main, marginBottom: 12 },
  seoSubtitle: { fontSize: 16, fontWeight: '600', color: theme.colors.text.main, marginTop: 20, marginBottom: 8 },
  seoText: { fontSize: 15, color: theme.colors.text.body, lineHeight: 24, marginBottom: 12 },

  // CTA Section (inside ScrollView)
  ctaSection: { paddingVertical: 24, paddingHorizontal: 20, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: theme.colors.border, borderRadius: 12, marginTop: 16 },
  ctaSectionMobile: { paddingHorizontal: 16, paddingVertical: 20 },
  scheduleButton: { backgroundColor: theme.colors.primary, paddingVertical: 16, borderRadius: 12, alignItems: "center", justifyContent: "center", shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  scheduleButtonDisabled: { backgroundColor: '#D1D5DB', shadowOpacity: 0, elevation: 0 },
  scheduleButtonText: { fontSize: 16, fontWeight: "700", color: "#FFF" },
  scheduleButtonTextDisabled: { color: '#9CA3AF' },
});