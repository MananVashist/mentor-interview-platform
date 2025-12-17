// app/index.tsx
import React, { useEffect, useState, Suspense } from 'react'; // 🟢 Import Suspense
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
  ScrollView,
  Image,
  ActivityIndicator, // 🟢 For fallback
} from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import Head from 'expo-router/head';
import { SplashScreen } from '../components/SplashScreen';
import { BrandHeader, Button } from '@/lib/ui';

// 🟢 Lazy Import
const LazySections = React.lazy(() => import('../components/LazySections'));

// --- COLORS ---
const BRAND_ORANGE = '#f58742';
const CTA_TEAL = '#18a7a7';
const BG_CREAM = '#f8f5f0';
const TEXT_DARK = '#222';
const TEXT_GRAY = '#555';

const SYSTEM_FONT = Platform.select({
  web: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
  ios: "System",
  android: "Roboto",
  default: "System"
}) as string;

// --- Only Keep Logos and Hero Data Here ---
const COMPANIES = [
  { name: 'Google', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/368px-Google_2015_logo.svg.png', width: 100 },
  { name: 'Meta', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/640px-Meta_Platforms_Inc._logo.svg.png', width: 110 },
  { name: 'Amazon', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/603px-Amazon_logo.svg.png', width: 90 },
  { name: 'Microsoft', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/640px-Microsoft_logo_%282012%29.svg.png', width: 110 },
  { name: 'Capgemini', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Capgemini_201x_logo.svg/640px-Capgemini_201x_logo.svg.png', width: 120 },
  { name: 'Adobe', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Adobe_Corporate_logo.svg/1200px-Adobe_Corporate_logo.svg.png', width: 120 },
];

const SITE_URL = 'https://crackjobs.com';
const SITE_TITLE = 'CrackJobs | Anonymous mock interviews with real experts'; 
const SITE_DESCRIPTION = 'Practice interview topics anonymously with fully vetted expert mentors across Product Management, Data Analytics, Data Science and HR. Get structured feedback and ace your next interview.';

export default function LandingPage() {
  const [showSplash, setShowSplash] = useState(Platform.OS === 'android');
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isSmall = width < 900;

  useEffect(() => {
    if (showSplash && Platform.OS === 'android') {
      const timer = setTimeout(() => setShowSplash(false), 4000); 
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  if (showSplash && Platform.OS === 'android') return <SplashScreen />;
  if (Platform.OS === 'android') return <Redirect href="/auth/sign-in" />;

  return (
    <>
      <Head>
        <title>{SITE_TITLE}</title>
        <meta name="description" content={SITE_DESCRIPTION} />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <meta property="og:title" content={SITE_TITLE} />
          <meta property="og:description" content={SITE_DESCRIPTION} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={SITE_URL} />
          <style>{`
            body { 
              margin: 0; 
              padding: 0; 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;
              background-color: #f8f5f0;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
            * { box-sizing: border-box; }
            img { max-width: 100%; height: auto; }
          `}</style>
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>

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
              <Text style={styles.badgeText}>🚀 NEW: ML System Design Track</Text>
            </View>
            <Text style={[styles.heroTitle, isSmall && styles.heroTitleMobile]}>
              Practice interviews with{'\n'}<Text style={{ color: CTA_TEAL }}>Real expert mentors</Text>
            </Text>
            <Text style={[styles.heroSubtitle, isSmall && styles.heroSubtitleMobile]}>
              Anonymous 1:1 mock interviews. Practice with vetted mentors from top companies.
            </Text>
            
            <View style={[styles.heroButtons, isSmall && styles.heroButtonsMobile]}>
              <Button 
                title="Start Practicing" 
                variant="primary" 
                size="lg" 
                onPress={() => router.push('/auth/sign-up')}
                style={[styles.btnBig, isSmall && { width: '100%' }]}
                textStyle={{ fontSize: 16 }}
              />
              <Button 
                title="Browse Mentors" 
                variant="outline" 
                size="lg" 
                onPress={() => router.push('/auth/sign-in')}
                style={[styles.btnBig, isSmall && { width: '100%' }]}
                textStyle={{ fontSize: 16 }}
              />
            </View>
          </View>
        </View>

        {/* --- LOGO WALL --- */}
        <View style={styles.logoSection}>
          <Text style={styles.logoTitle}>OUR MENTORS HAVE WORKED IN</Text>
          <View style={[styles.logoWall, isSmall && styles.logoWallMobile]}>
            {COMPANIES.map((company) => (
              <View key={company.name} style={styles.logoWrapper}>
                <Image 
                  source={{ uri: company.url }} 
                  style={[styles.logoImage, { width: company.width }]} 
                  resizeMode="contain"
                  alt={`${company.name} logo`}
                />
              </View>
            ))}
          </View>
        </View>

        {/* 🟢 SUSPENSE WRAPPER FOR LAZY CONTENT */}
        <Suspense fallback={
          <View style={{ padding: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={CTA_TEAL} />
          </View>
        }>
          <LazySections />
        </Suspense>

      </ScrollView>
    </>
  );
}

// --- Reduced Styles (Only those needed above the fold) ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG_CREAM },
  scrollContent: { minHeight: '100%' },

  // Header & Nav
  header: { backgroundColor: BG_CREAM, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  headerInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1200, width: '100%', alignSelf: 'center', paddingHorizontal: 24 },
  headerInnerMobile: { paddingHorizontal: 16 },
  navRight: { flexDirection: 'row', gap: 24, alignItems: 'center' },
  navRightMobile: { gap: 12 },
  navLink: {},
  navLinkText: { fontFamily: SYSTEM_FONT, fontWeight: '600', color: TEXT_DARK },
  btnSmall: { backgroundColor: CTA_TEAL, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 100 },
  btnSmallText: { fontFamily: SYSTEM_FONT, fontSize: 13, fontWeight: '700', color: '#fff' },

  // Buttons & Badges
  btnBig: { borderRadius: 100, minWidth: 160 },
  badgeContainer: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e0f5f5', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 100, marginBottom: 24 },
  badgeText: { color: CTA_TEAL, fontWeight: '700', fontSize: 12, fontFamily: SYSTEM_FONT, letterSpacing: 0.5, textTransform: 'uppercase' },

  // Hero
  heroCentered: { alignItems: 'center', paddingVertical: 40, maxWidth: 800, alignSelf: 'center' },
  heroCenteredMobile: { paddingVertical: 20 },
  heroTitle: { fontFamily: SYSTEM_FONT, fontWeight: '800', fontSize: 52, color: BRAND_ORANGE, lineHeight: 60, marginBottom: 24, textAlign: 'center' },
  heroTitleMobile: { fontSize: 36, lineHeight: 44 },
  heroSubtitle: { fontFamily: SYSTEM_FONT, fontSize: 20, color: TEXT_GRAY, lineHeight: 30, marginBottom: 40, textAlign: 'center', maxWidth: 600 },
  heroSubtitleMobile: { fontSize: 16, textAlign: 'center', lineHeight: 24 },
  
  heroButtons: { flexDirection: 'row', gap: 16 },
  heroButtonsMobile: { flexDirection: 'column', width: '100%', paddingHorizontal: 20 },

  // Logo Wall
  logoSection: { backgroundColor: '#fff', paddingVertical: 50, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#f0f0f0' },
  logoTitle: { textAlign: 'center', fontSize: 15, fontWeight: '500', color: '#bbb', marginBottom: 30, letterSpacing: 1.5, textTransform: 'uppercase' },
  logoWall: { flexDirection: 'row', justifyContent: 'center', gap: 60, flexWrap: 'wrap', alignItems: 'center' },
  logoWallMobile: { gap: 30, paddingHorizontal: 20 },
  logoWrapper: { height: 50, justifyContent: 'center', alignItems: 'center' },
  logoImage: { height: 35 }, 

  // Container for Hero (needed for padding)
  sectionContainer: { maxWidth: 1200, width: '100%', alignSelf: 'center', paddingHorizontal: 24, paddingVertical: 60 },
});