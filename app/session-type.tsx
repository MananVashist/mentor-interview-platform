// app/candidate/session-type.tsx
// NOTE: If candidate/_layout.tsx has an auth guard, move this file to
// app/session-type.tsx and update all navigation references accordingly.

import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Svg, Path, Circle } from 'react-native-svg';
import { AppText } from '@/lib/ui';
import { theme } from '@/lib/theme';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { supabase } from '@/lib/supabase/client';

export type SessionType = 'intro' | 'mock' | 'bundle';

const SUPABASE_URL = "https://rcbaaiiawrglvyzmawvr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjYmFhaWlhd3JnbHZ5em1hd3ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNTA1NjAsImV4cCI6MjA3NjcyNjU2MH0.V3qRHGXBMlspRS7XFJlXdo4qIcCms60Nepp7dYMEjLA";

// ============================================
// ICONS
// ============================================

const ChatIcon = ({ size = 28, color = '#6B7280' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const TargetIcon = ({ size = 28, color = '#6B7280' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <Circle cx="12" cy="12" r="6" stroke={color} strokeWidth="2" />
    <Circle cx="12" cy="12" r="2" fill={color} />
  </Svg>
);

const LayersIcon = ({ size = 28, color = '#6B7280' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2L2 7l10 5 10-5-10-5z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M2 17l10 5 10-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M2 12l10 5 10-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CheckIcon = ({ size = 15, color = '#059669' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M5 13L9 17L19 7" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ArrowRightIcon = ({ size = 16, color = '#FFF' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M5 12h14M12 5l7 7-7 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const BackIcon = ({ size = 18, color = '#6B7280' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M12 19l-7-7 7-7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const LockIcon = ({ size = 14, color = '#9CA3AF' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z" stroke={color} strokeWidth="2" />
    <Path d="M7 11V7a5 5 0 0110 0v4" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

// ============================================
// MAIN COMPONENT
// ============================================

export default function SessionTypeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const mentorId  = Array.isArray(params.mentorId)  ? params.mentorId[0]  : params.mentorId;
  const profileId = Array.isArray(params.profileId) ? params.profileId[0] : params.profileId;
  const skillId   = Array.isArray(params.skillId)   ? params.skillId[0]   : params.skillId;
  const skillName = Array.isArray(params.skillName)  ? params.skillName[0]  : (params.skillName || '');

  const [loading, setLoading] = useState(true);
  const [mockPrice, setMockPrice] = useState(0);
  const [mentorTitle, setMentorTitle] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [introAlreadyUsed, setIntroAlreadyUsed] = useState(false);

  useEffect(() => {
    const init = async () => {
      // Auth check
      const { data: { session } } = await supabase.auth.getSession();
      const authed = !!session?.user;
      setIsAuthenticated(authed);
      if (session?.user) setUserId(session.user.id);

      if (!mentorId) { setLoading(false); return; }

      try {
        // Fetch mentor price + tier
        const mentorRes = await fetch(
          `${SUPABASE_URL}/rest/v1/mentors?select=session_price_inr,tier,professional_title&id=eq.${mentorId}&status=eq.approved&limit=1`,
          { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
        );
        const mentorData = await mentorRes.json();
        if (!mentorData || mentorData.length === 0) { setLoading(false); return; }

        const m = mentorData[0];
        setMentorTitle(m.professional_title || 'Interview Mentor');

        const basePrice    = m.session_price_inr || 1000;
        const tier         = m.tier || 'bronze';

        const tierRes = await fetch(
          `${SUPABASE_URL}/rest/v1/mentor_tiers?select=percentage_cut&tier=eq.${tier}&limit=1`,
          { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
        );
        const tierData      = await tierRes.json();
        const percentageCut = tierData?.[0]?.percentage_cut || 50;
        const calculatedMockPrice = Math.round(basePrice / (1 - percentageCut / 100));
        setMockPrice(calculatedMockPrice);

        // Check if this candidate already had an intro call with this mentor
        if (authed && session?.user?.id) {
          const { data: existingIntro } = await supabase
            .from('interview_sessions')
            .select('id')
            .eq('candidate_id', session.user.id)
            .eq('mentor_id', mentorId)
            .eq('session_type', 'intro')
            .not('status', 'eq', 'cancelled')
            .maybeSingle();

          if (existingIntro) setIntroAlreadyUsed(true);
        }
      } catch (err) {
        console.error('[SessionType] Error:', err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [mentorId]);

  const introPrice  = Math.round(mockPrice * 0.20);
  const bundlePrice = Math.round(mockPrice * 2.5);
  const bundleSaving = Math.round(mockPrice * 3 - bundlePrice);

  const handleSelect = (sessionType: SessionType) => {
    const scheduleUrl = `/candidate/schedule?mentorId=${mentorId}&profileId=${profileId}&skillId=${skillId}&skillName=${encodeURIComponent(skillName || '')}&sessionType=${sessionType}`;

    if (!isAuthenticated) {
      const signUpUrl = `/auth/sign-up?redirect=${encodeURIComponent(scheduleUrl)}`;
      if (Platform.OS === 'web') {
        window.location.href = signUpUrl;
      } else {
        router.push(signUpUrl as any);
      }
      return;
    }

    if (Platform.OS === 'web') {
      window.location.href = scheduleUrl;
    } else {
      router.push(scheduleUrl as any);
    }
  };

  const handleBack = () => {
    if (Platform.OS === 'web') {
      window.history.back();
    } else {
      router.back();
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

  return (
    <View style={styles.pageContainer}>
      <Header />
      <ScrollView contentContainerStyle={[styles.scrollContent, isMobile && styles.scrollContentMobile]}>

        {/* BACK + HEADING */}
        <View style={[styles.topSection, isMobile && styles.topSectionMobile]}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7}>
            <BackIcon size={18} color="#6B7280" />
            <AppText style={styles.backText}>Back to profile</AppText>
          </TouchableOpacity>
          <AppText style={[styles.heading, isMobile && styles.headingMobile]}>Choose your session type</AppText>
          <AppText style={styles.subheading}>
            {skillName ? `${skillName} · ` : ''}{mentorTitle}
          </AppText>
        </View>

        {/* CARDS */}
        <View style={[styles.cardsContainer, isMobile && styles.cardsContainerMobile]}>

          {/* ── INTRO CALL ── */}
          <View style={[styles.card, isMobile && styles.cardMobile, introAlreadyUsed && styles.cardDisabled]}>
            <View style={[styles.cardHeader, { backgroundColor: '#F5F3FF', borderBottomColor: '#DDD6FE' }]}>
              <View style={[styles.iconWrap, { backgroundColor: 'rgba(255,255,255,0.7)' }]}>
                <ChatIcon size={26} color="#7C3AED" />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.titleRow}>
                  <AppText style={[styles.cardTitle, { color: '#7C3AED' }]}>Intro Call</AppText>
                  <View style={[styles.badge, { backgroundColor: '#EDE9FE' }]}>
                    <AppText style={[styles.badgeText, { color: '#6D28D9' }]}>25 MIN</AppText>
                  </View>
                </View>
                <AppText style={styles.cardSubtitle}>Meet the mentor before you commit</AppText>
              </View>
            </View>

            <View style={styles.cardBody}>
              {introAlreadyUsed ? (
                <View style={styles.usedBanner}>
                  <LockIcon size={14} color="#9CA3AF" />
                  <AppText style={styles.usedBannerText}>
                    You've already had an intro call with this mentor. Book a mock interview or bundle to continue.
                  </AppText>
                </View>
              ) : (
                <>
                  <AppText style={styles.cardTagline}>Not sure if this mentor is right for you?</AppText>
                  <View style={styles.featureList}>
                    {[
                      'Understand your requirements & interview goals',
                      'Assess your current level and fit',
                      'Get a list of topics to practice before your mock',
                      'Understand how a tailored bundle works for you',
                    ].map((f, i) => (
                      <View key={i} style={styles.featureRow}>
                        <CheckIcon size={14} color="#7C3AED" />
                        <AppText style={styles.featureText}>{f}</AppText>
                      </View>
                    ))}
                  </View>
                  <View style={styles.noticeBox}>
                    <AppText style={styles.noticeText}>⚠️ Not a mock interview — this is a discovery and planning call only. One intro call allowed per mentor.</AppText>
                  </View>
                </>
              )}

              <View style={styles.priceRow}>
                <AppText style={[styles.price, { color: introAlreadyUsed ? '#9CA3AF' : '#7C3AED' }]}>
                  ₹{introPrice.toLocaleString()}
                </AppText>
                <AppText style={styles.priceSub}>one-time · full amount goes to mentor</AppText>
              </View>

              <TouchableOpacity
                style={[styles.ctaButton, { backgroundColor: '#7C3AED' }, introAlreadyUsed && styles.ctaButtonDisabled]}
                activeOpacity={0.85}
                onPress={() => !introAlreadyUsed && handleSelect('intro')}
                disabled={introAlreadyUsed}
              >
                <AppText style={[styles.ctaText, introAlreadyUsed && { color: '#9CA3AF' }]}>
                  {introAlreadyUsed ? 'Already Used' : isAuthenticated ? 'Book Intro Call' : 'Sign Up to Book'}
                </AppText>
                {!introAlreadyUsed && <ArrowRightIcon size={15} color="#FFF" />}
              </TouchableOpacity>
            </View>
          </View>

          {/* ── MOCK INTERVIEW ── */}
          <View style={[styles.card, styles.cardHighlight, isMobile && styles.cardMobile]}>
            <View style={[styles.popularBadge]}>
              <AppText style={styles.popularBadgeText}>MOST POPULAR</AppText>
            </View>
            <View style={[styles.cardHeader, { backgroundColor: '#F0FDFA', borderBottomColor: '#99F6E4' }]}>
              <View style={[styles.iconWrap, { backgroundColor: 'rgba(255,255,255,0.7)' }]}>
                <TargetIcon size={26} color={theme.colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.titleRow}>
                  <AppText style={[styles.cardTitle, { color: theme.colors.primary }]}>Mock Interview</AppText>
                  <View style={[styles.badge, { backgroundColor: '#CCFBF1' }]}>
                    <AppText style={[styles.badgeText, { color: '#0F766E' }]}>55 MIN</AppText>
                  </View>
                </View>
                <AppText style={styles.cardSubtitle}>A full, realistic interview simulation</AppText>
              </View>
            </View>

            <View style={styles.cardBody}>
              <AppText style={styles.cardTagline}>Practice one topic and get expert feedback.</AppText>
              <View style={styles.featureList}>
                {[
                  'Choose one skill or upload a JD for a tailored session',
                  'End-to-end interview simulation with realistic questions',
                  'Real-time feedback and evaluation during the session',
                  'Detailed written scorecard sent after',
                ].map((f, i) => (
                  <View key={i} style={styles.featureRow}>
                    <CheckIcon size={14} color={theme.colors.primary} />
                    <AppText style={styles.featureText}>{f}</AppText>
                  </View>
                ))}
              </View>

              <View style={styles.priceRow}>
                <AppText style={[styles.price, { color: theme.colors.primary }]}>
                  ₹{mockPrice.toLocaleString()}
                </AppText>
                <AppText style={styles.priceSub}>per session</AppText>
              </View>

              <TouchableOpacity
                style={[styles.ctaButton, { backgroundColor: theme.colors.primary }]}
                activeOpacity={0.85}
                onPress={() => handleSelect('mock')}
              >
                <AppText style={styles.ctaText}>
                  {isAuthenticated ? 'Book Mock Interview' : 'Sign Up to Book'}
                </AppText>
                <ArrowRightIcon size={15} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* ── BUNDLE OF 3 ── */}
          <View style={[styles.card, isMobile && styles.cardMobile]}>
            <View style={[styles.cardHeader, { backgroundColor: '#FFFBEB', borderBottomColor: '#FDE68A' }]}>
              <View style={[styles.iconWrap, { backgroundColor: 'rgba(255,255,255,0.7)' }]}>
                <LayersIcon size={26} color="#D97706" />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.titleRow}>
                  <AppText style={[styles.cardTitle, { color: '#D97706' }]}>Bundle of 3</AppText>
                  <View style={[styles.badge, { backgroundColor: '#FEF3C7' }]}>
                    <AppText style={[styles.badgeText, { color: '#92400E' }]}>BEST VALUE</AppText>
                  </View>
                </View>
                <AppText style={styles.cardSubtitle}>3 × 55-minute mock interviews</AppText>
              </View>
            </View>

            <View style={styles.cardBody}>
              <AppText style={styles.cardTagline}>Track your improvement across multiple sessions.</AppText>
              <View style={styles.featureList}>
                {[
                  'Three full mock interviews — pick all 3 slots upfront',
                  'Tailored experience: mentor adapts each session to your progress',
                  'See measurable improvement across sessions with scorecards',
                  bundleSaving > 0 ? `Save ₹${bundleSaving.toLocaleString()} vs booking individually` : '2.5× the value of a single session',
                ].map((f, i) => (
                  <View key={i} style={styles.featureRow}>
                    <CheckIcon size={14} color="#D97706" />
                    <AppText style={styles.featureText}>{f}</AppText>
                  </View>
                ))}
              </View>

              {!introAlreadyUsed && (
                <View style={[styles.noticeBox, { backgroundColor: '#EDE9FE', borderColor: '#DDD6FE' }]}>
                  <AppText style={[styles.noticeText, { color: '#5B21B6' }]}>
                    💡 Book an intro call first to get a customised plan from your mentor before your sessions.
                  </AppText>
                </View>
              )}

              <View style={styles.priceRow}>
                <AppText style={[styles.price, { color: '#D97706' }]}>
                  ₹{bundlePrice.toLocaleString()}
                </AppText>
                <AppText style={styles.priceSub}>total for 3 sessions</AppText>
              </View>

              <TouchableOpacity
                style={[styles.ctaButton, { backgroundColor: '#D97706' }]}
                activeOpacity={0.85}
                onPress={() => handleSelect('bundle')}
              >
                <AppText style={styles.ctaText}>
                  {isAuthenticated ? 'Book Bundle of 3' : 'Sign Up to Book'}
                </AppText>
                <ArrowRightIcon size={15} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>

        </View>

        {/* TRUST LINE */}
        <View style={styles.trustRow}>
          <AppText style={styles.trustText}>
            🔒 Anonymous sessions · Verified mentors · Secure payments via Razorpay
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
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: {
    padding: 24,
    paddingBottom: 60,
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center' as any,
  },
  scrollContentMobile: { padding: 16 },

  topSection: { marginBottom: 32 },
  topSectionMobile: { marginBottom: 24 },

  backButton: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 20, alignSelf: 'flex-start' },
  backText: { fontSize: 14, color: '#6B7280', fontWeight: '500' },

  heading: { fontSize: 28, fontWeight: '800', color: '#111827', marginBottom: 6 },
  headingMobile: { fontSize: 22 },
  subheading: { fontSize: 15, color: '#6B7280' },

  cardsContainer: { flexDirection: 'row', gap: 16, marginBottom: 32, alignItems: 'flex-start' },
  cardsContainerMobile: { flexDirection: 'column', gap: 16 },

  card: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },
  cardMobile: { width: '100%', flex: undefined as any },
  cardHighlight: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
    ...Platform.select({
      ios: { shadowOpacity: 0.13, shadowRadius: 12 },
      android: { elevation: 5 },
    }),
  },
  cardDisabled: { opacity: 0.7 },

  popularBadge: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 5,
    alignItems: 'center',
  },
  popularBadgeText: { fontSize: 11, fontWeight: '800', color: '#FFF', letterSpacing: 0.8 },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 18,
    borderBottomWidth: 1,
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 2 },
  cardTitle: { fontSize: 17, fontWeight: '800' },
  cardSubtitle: { fontSize: 12, color: '#6B7280', fontWeight: '500' },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  badgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.4 },

  cardBody: { padding: 18 },
  cardTagline: { fontSize: 14, color: '#374151', marginBottom: 14, fontStyle: 'italic' },

  featureList: { gap: 10, marginBottom: 16 },
  featureRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  featureText: { fontSize: 13, color: '#4B5563', lineHeight: 18, flex: 1 },

  noticeBox: {
    backgroundColor: '#FEF9C3',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
  },
  noticeText: { fontSize: 12, color: '#78350F', lineHeight: 17 },

  usedBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
  },
  usedBannerText: { fontSize: 13, color: '#6B7280', lineHeight: 18, flex: 1 },

  priceRow: { marginBottom: 16 },
  price: { fontSize: 28, fontWeight: '800', marginBottom: 2 },
  priceSub: { fontSize: 12, color: '#9CA3AF', fontWeight: '500' },

  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 10,
  },
  ctaButtonDisabled: { backgroundColor: '#E5E7EB' },
  ctaText: { fontSize: 15, fontWeight: '700', color: '#FFF' },

  trustRow: { alignItems: 'center', marginBottom: 32 },
  trustText: { fontSize: 12, color: '#9CA3AF', textAlign: 'center' },
});