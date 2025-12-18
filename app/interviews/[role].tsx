import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter, Redirect } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font'; 

// --- IMPORTS ---
import { Footer } from '@/components/Footer';
import { BrandHeader } from '@/lib/ui';
import { ROLE_DATA } from '@/data/roles';
import { SEO } from '@/components/SEO';
import { SEO_CONFIG } from '@/config/seo';

// --- CONFIG ---
const BASE_URL = 'https://crackjobs.com';

// --- COLORS (Matched to Home Page) ---
const BRAND_ORANGE = '#f58742';
const CTA_TEAL = '#18a7a7';
const BG_CREAM = '#f8f5f0';
const TEXT_DARK = '#222';
const TEXT_GRAY = '#555';

// System font stack
const SYSTEM_FONT = Platform.select({
  web: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
  ios: "System",
  android: "Roboto",
  default: "System"
}) as string;

export default function RoleLandingPage() {
  const { role } = useLocalSearchParams<{ role: string }>();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isSmall = width < 900;

  // 1. Get Data
  const roleKey = typeof role === 'string' ? role : '';
  const data = ROLE_DATA[roleKey];
  const seoData = SEO_CONFIG.interviews[roleKey as keyof typeof SEO_CONFIG.interviews];

  const [fontsLoaded] = useFonts({
    ...MaterialCommunityIcons.font,
  });

  // 2. Redirect if invalid role
  if (!data || !seoData) {
    return <Redirect href="/" />;
  }

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: BG_CREAM }} />;
  }

  // 3. Construct Canonical URL
  // This tells Google: "The official version of this page is https://crackjobs.com/interviews/[role]"
  const canonicalUrl = `${BASE_URL}/interviews/${roleKey}`;

  return (
    <>
      <SEO 
        {...seoData} 
        canonical={canonicalUrl} 
      />

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        
        {/* --- HEADER --- */}
        <View style={styles.header}>
          <View style={[styles.headerInner, isSmall && styles.headerInnerMobile]}>
            <BrandHeader style={{ marginBottom: 0 }} small={isSmall} />
            <View style={[styles.navRight, isSmall && styles.navRightMobile]}>
              <TouchableOpacity style={styles.navLink} onPress={() => router.push('/auth/sign-in')}>
                <Text style={styles.navLinkText}>Log in</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnSmall} onPress={() => router.push('/auth/sign-up')}>
                <Text style={styles.btnSmallText}>Get Started</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* --- HERO SECTION --- */}
        <View style={styles.sectionContainer}>
          <View style={[styles.heroCentered, isSmall && styles.heroCenteredMobile]}>
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{data.tag} INTERVIEW TRACK</Text>
            </View>
            <Text style={[styles.heroTitle, isSmall && styles.heroTitleMobile]}>
              {data.heroTitle}
            </Text>
            <Text style={[styles.heroSubtitle, isSmall && styles.heroSubtitleMobile]}>
              {data.heroSubtitle}
            </Text>
            
            {/* Stats Row (Salary/Verification) */}
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 40, flexWrap: 'wrap', justifyContent: 'center' }}>
                {data.salary && (
                    <View style={styles.pill}>
                        <MaterialCommunityIcons name="cash" size={16} color={CTA_TEAL} />
                        <Text style={styles.pillText}>Avg Salary: {data.salary}</Text>
                    </View>
                )}
                <View style={styles.pill}>
                    <MaterialCommunityIcons name="check-decagram" size={16} color={CTA_TEAL} />
                    <Text style={styles.pillText}>Verified {data.tag} Mentors</Text>
                </View>
            </View>

            <View style={[styles.heroButtons, isSmall && styles.heroButtonsMobile]}>
              <TouchableOpacity 
                style={[styles.btnBig, styles.btnPrimary, isSmall && { width: '100%' }]} 
                onPress={() => router.push('/auth/sign-up')}
              >
                <Text style={[styles.btnTextBig, styles.btnTextWhite]}>Start Practicing</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* --- SYLLABUS SECTION --- */}
        <View style={[styles.sectionContainer, { paddingTop: 0 }]}>
           <Text style={styles.sectionKicker}>Curriculum</Text>
           <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile, { marginBottom: 40 }]}>
             What you will cover
           </Text>

           <View style={{ gap: 24 }}>
              {data.syllabus.map((phase, index) => (
                <View key={index} style={styles.syllabusCard}>
                   <View style={styles.syllabusHeader}>
                      <View style={styles.stepBadge}><Text style={styles.stepBadgeText}>{index + 1}</Text></View>
                      <View style={{ flex: 1 }}>
                         <Text style={styles.syllabusTitle}>{phase.title}</Text>
                         <Text style={styles.syllabusDesc}>{phase.description}</Text>
                      </View>
                   </View>
                   <View style={styles.topicList}>
                      {phase.topics.map((t, i) => (
                          <View key={i} style={styles.checkRow}>
                             <MaterialCommunityIcons name="check-circle" size={18} color={CTA_TEAL} /> 
                             <Text style={styles.topicText}>{t}</Text>
                          </View>
                      ))}
                   </View>
                </View>
              ))}
           </View>
        </View>

        {/* --- FAQ SECTION --- */}
        <View style={[styles.sectionContainer, styles.reviewsBg]}>
          <Text style={styles.sectionKicker}>Common Questions</Text>
          <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}>FAQ</Text>
          
          <View style={{ maxWidth: 800, alignSelf: 'center', width: '100%', gap: 16 }}>
             {data.faqs.map((faq, i) => (
                 <View key={i} style={styles.faqCard}>
                     <Text style={styles.faqQuestion}>{faq.question}</Text>
                     <Text style={styles.faqAnswer}>{faq.answer}</Text>
                 </View>
             ))}
          </View>
        </View>

        {/* --- CTA FOOTER --- */}
        <View style={styles.bottomCtaSection}>
          <Text style={styles.bottomCtaTitle}>Ready to ace the {data.title} loop?</Text>
          <Text style={styles.bottomCtaSubtitle}>Join candidates landing offers at top tech companies.</Text>
          <TouchableOpacity style={styles.bottomCtaButton} onPress={() => router.push('/auth/sign-up')}>
            <Text style={styles.bottomCtaButtonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
        
        <Footer />
      </ScrollView>
    </>
  );
}

// --- STYLES (Copied & Adapted from Home Page) ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG_CREAM },
  scrollContent: { minHeight: '100%' },

  // Header
  header: { backgroundColor: BG_CREAM, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  headerInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1200, width: '100%', alignSelf: 'center', paddingHorizontal: 24 },
  headerInnerMobile: { paddingHorizontal: 16 },
  navRight: { flexDirection: 'row', gap: 24, alignItems: 'center' },
  navRightMobile: { gap: 12 },
  navLink: {},
  navLinkText: { fontFamily: SYSTEM_FONT, fontWeight: '600', color: TEXT_DARK },
  btnSmall: { backgroundColor: CTA_TEAL, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 100 },
  btnSmallText: { fontFamily: SYSTEM_FONT, fontSize: 13, fontWeight: '700', color: '#fff' },

  // Hero
  sectionContainer: { maxWidth: 1200, width: '100%', alignSelf: 'center', paddingHorizontal: 24, paddingVertical: 60 },
  heroCentered: { alignItems: 'center', paddingVertical: 40, maxWidth: 800, alignSelf: 'center' },
  heroCenteredMobile: { paddingVertical: 20 },
  heroTitle: { fontFamily: SYSTEM_FONT, fontWeight: '800', fontSize: 52, color: BRAND_ORANGE, lineHeight: 60, marginBottom: 24, textAlign: 'center' },
  heroTitleMobile: { fontSize: 36, lineHeight: 44 },
  heroSubtitle: { fontFamily: SYSTEM_FONT, fontSize: 20, color: TEXT_GRAY, lineHeight: 30, marginBottom: 40, textAlign: 'center', maxWidth: 600 },
  heroSubtitleMobile: { fontSize: 16, textAlign: 'center', lineHeight: 24 },
  badgeContainer: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e0f5f5', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 100, marginBottom: 24 },
  badgeText: { color: CTA_TEAL, fontWeight: '700', fontSize: 12, fontFamily: SYSTEM_FONT, letterSpacing: 0.5, textTransform: 'uppercase' },

  heroButtons: { flexDirection: 'row', gap: 16 },
  heroButtonsMobile: { flexDirection: 'column', width: '100%', paddingHorizontal: 20 },
  btnBig: { paddingHorizontal: 32, paddingVertical: 16, borderRadius: 100, borderWidth: 1, minWidth: 160, alignItems: 'center', justifyContent: 'center' },
  btnPrimary: { backgroundColor: CTA_TEAL, borderColor: CTA_TEAL },
  btnTextBig: { fontFamily: SYSTEM_FONT, fontWeight: '700', fontSize: 16, color: TEXT_DARK, textAlign: 'center' },
  btnTextWhite: { color: '#FFFFFF' },

  // New Pill Styles (Matches Home Vibe)
  pill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 100, borderWidth: 1, borderColor: '#e0e0e0' },
  pillText: { fontSize: 13, fontWeight: '600', color: TEXT_GRAY, fontFamily: SYSTEM_FONT },

  // Syllabus Cards (New, but matching Home Card style)
  syllabusCard: { backgroundColor: '#fff', borderRadius: 16, padding: 32, borderWidth: 1, borderColor: 'rgba(0,0,0,0.04)', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
  syllabusHeader: { flexDirection: 'row', gap: 16, marginBottom: 24 },
  syllabusTitle: { fontFamily: SYSTEM_FONT, fontSize: 20, fontWeight: '700', color: TEXT_DARK, marginBottom: 4 },
  syllabusDesc: { fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_GRAY, lineHeight: 22 },
  stepBadge: { width: 32, height: 32, borderRadius: 16, backgroundColor: CTA_TEAL, alignItems: 'center', justifyContent: 'center' },
  stepBadgeText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  
  topicList: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, paddingLeft: 48 },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: BG_CREAM, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  topicText: { fontSize: 14, fontWeight: '500', color: '#444' },

  // FAQ Styles
  reviewsBg: { marginTop: 0, paddingVertical: 60 },
  faqCard: { backgroundColor: '#fff', padding: 24, borderRadius: 12, marginBottom: 0, borderWidth: 1, borderColor: '#eaeaea' },
  faqQuestion: { fontSize: 18, fontWeight: '700', color: TEXT_DARK, marginBottom: 8, fontFamily: SYSTEM_FONT },
  faqAnswer: { fontSize: 16, color: TEXT_GRAY, lineHeight: 24, fontFamily: SYSTEM_FONT },

  // Shared Section Headers
  sectionKicker: { fontFamily: SYSTEM_FONT, fontWeight: '700', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1.5, color: CTA_TEAL, marginBottom: 12, textAlign: 'center' },
  sectionTitle: { fontFamily: SYSTEM_FONT, fontWeight: '800', fontSize: 36, color: TEXT_DARK, marginBottom: 16, textAlign: 'center' },
  sectionTitleMobile: { fontSize: 28 },

  // Bottom CTA
  bottomCtaSection: { paddingVertical: 100, paddingHorizontal: 24, alignItems: 'center', backgroundColor: 'transparent' },
  bottomCtaTitle: { fontFamily: SYSTEM_FONT, fontWeight: '800', fontSize: 40, color: TEXT_DARK, marginBottom: 16, textAlign: 'center' },
  bottomCtaSubtitle: { fontFamily: SYSTEM_FONT, fontSize: 20, color: TEXT_GRAY, marginBottom: 40, textAlign: 'center' },
  bottomCtaButton: { backgroundColor: CTA_TEAL, paddingHorizontal: 48, paddingVertical: 18, borderRadius: 100 },
  bottomCtaButtonText: { fontFamily: SYSTEM_FONT, fontWeight: '700', color: '#fff', fontSize: 18 },
});