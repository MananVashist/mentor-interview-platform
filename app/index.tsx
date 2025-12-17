// app/index.tsx
import React, { useEffect, useState, Suspense } from 'react'; 
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
  ScrollView,
  Image as RNImage,
} from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import Head from 'expo-router/head';
// 🟢 FIX 1: Import Asset helper (run "npx expo install expo-asset" if needed)
import { Asset } from 'expo-asset';

// Static Imports
import GoogleImg from '../assets/companies/Google.png';
import MetaImg from '../assets/companies/Meta.png';
import AmazonImg from '../assets/companies/Amazon.webp';
import MicrosoftImg from '../assets/companies/Microsoft.webp';
import CapgeminiImg from '../assets/companies/Capgemini.png';
import AdobeImg from '../assets/companies/Adobe.png';   

// ---------------------------------------------------------------------------
// 🟢 LAZY LOAD
// ---------------------------------------------------------------------------

const BrandHeader = React.lazy(() => 
  import('@/lib/ui').then(module => ({ default: module.BrandHeader }))
);

const Button = React.lazy(() => 
  import('@/lib/ui').then(module => ({ default: module.Button }))
);

const LazySections = React.lazy(() => import('../components/LazySections'));


// --- GHOST COMPONENTS ---
const HeaderFallback = () => (
  <View style={{ height: 40, justifyContent: 'center' }}>
    <Text style={{ fontSize: 32, fontWeight: '900', color: '#222', fontFamily: Platform.OS === 'web' ? 'System' : undefined, lineHeight: 38 }}>
      Crack<Text style={{ color: '#18a7a7' }}>Jobs</Text>
    </Text>
  </View>
);

const ButtonFallback = ({ variant }: { variant: 'primary' | 'outline' }) => (
  <View style={{ 
    height: 50, 
    minWidth: 160, 
    borderRadius: 100, 
    backgroundColor: variant === 'primary' ? '#f58742' : 'transparent',
    borderWidth: variant === 'outline' ? 2 : 0,
    borderColor: '#f58742',
    opacity: 0.3
  }} />
);

// --- CONSTANTS ---
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

const COMPANIES = [ 
  { name: 'Google', image: GoogleImg, width: 100 },
  { name: 'Meta', image: MetaImg, width: 110 },
  { name: 'Amazon', image: AmazonImg, width: 90 },
  { name: 'Microsoft', image: MicrosoftImg, width: 110 },
  { name: 'Capgemini', image: CapgeminiImg, width: 120 },
  { name: 'Adobe', image: AdobeImg, width: 120 },   
];          

const SITE_URL = 'https://crackjobs.com';
const SITE_TITLE = 'CrackJobs | Anonymous mock interviews with real experts'; 
const SITE_DESCRIPTION = 'Practice interview topics anonymously with fully vetted expert mentors.';

// 🟢 FIX 2: Production-Ready Image Resolver
const OptimizedImage = ({ source, style, alt }: any) => {
  const isWeb = Platform.OS === 'web';
  
  if (isWeb) {
    let src = '';

    // A. Check if it's already a string URL (e.g. "https://...")
    if (typeof source === 'string') {
      src = source;
    } 
    // B. Check if it's an object with a URI (some bundlers do this)
    else if (source?.uri) {
      src = source.uri;
    }
    // C. The Critical Fix: Handle Numeric Asset IDs (Production Build)
    else {
      // Asset.fromModule handles the lookup in the production asset registry
      // and returns the correct hashed path (e.g., "/assets/google.a8f2....png")
      const asset = Asset.fromModule(source);
      src = asset?.uri || '';
    }
    
    // Render standard HTML img tag for SEO & Performance
    if (src) {
      return (
        <img 
          src={src} 
          alt={alt}
          style={{ width: style.width, height: style.height, objectFit: 'contain' }}
          loading="lazy" 
          decoding="async"
        />
      );
    }
  }

  // Fallback for Mobile or failed resolution
  return <RNImage source={source} style={style} resizeMode="contain" alt={alt} />;
};

export default function LandingPage() {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isSmall = width < 900;

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100); 
    return () => clearTimeout(timer);
  }, []);

  if (Platform.OS === 'android') return <Redirect href="/auth/sign-in" />;

  return (
    <>
      <Head>
        <title>{SITE_TITLE}</title>
        <meta name="description" content={SITE_DESCRIPTION} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, sans-serif; background-color: #f8f5f0; }
          * { box-sizing: border-box; }
        `}</style>
      </Head>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        
        {/* --- HEADER --- */}
        <View style={styles.header}>
          <View style={[styles.headerInner, isSmall && styles.headerInnerMobile]}>
            <Suspense fallback={<HeaderFallback />}>
               {isReady ? (
                 <BrandHeader style={{ marginBottom: 0 }} small={isSmall} />
               ) : (
                 <HeaderFallback />
               )}
            </Suspense>

            <View style={[styles.navRight, isSmall && styles.navRightMobile]}>
              <TouchableOpacity onPress={() => router.push('/auth/sign-in')}>
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
              <Suspense fallback={
                <>
                  <ButtonFallback variant="primary" />
                  <ButtonFallback variant="outline" />
                </>
              }>
                {isReady ? (
                  <>
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
                  </>
                ) : (
                  <>
                    <ButtonFallback variant="primary" />
                    <ButtonFallback variant="outline" />
                  </>
                )}
              </Suspense>
            </View>
          </View>
        </View>

        {/* --- LOGO WALL --- */}
        <View style={styles.logoSection}>
          <Text style={styles.logoTitle}>OUR MENTORS HAVE WORKED IN</Text>
          <View style={[styles.logoWall, isSmall && styles.logoWallMobile]}>
            {COMPANIES.map((company) => (
              <View key={company.name} style={styles.logoWrapper}>
                <OptimizedImage 
                  source={company.image} 
                  style={{ width: company.width, height: 35 }} 
                  alt={`${company.name} logo`}
                />
              </View>
            ))}
          </View>
        </View>

        {/* --- LAZY SECTIONS --- */}
        {isReady && (
          <Suspense fallback={<View style={{ height: 600 }} />}>
            <LazySections />
          </Suspense>
        )}

      </ScrollView>
    </>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG_CREAM },
  scrollContent: { minHeight: '100%' },
  header: { backgroundColor: BG_CREAM, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  headerInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1200, width: '100%', alignSelf: 'center', paddingHorizontal: 24 },
  headerInnerMobile: { paddingHorizontal: 16 },
  navRight: { flexDirection: 'row', gap: 24, alignItems: 'center' },
  navRightMobile: { gap: 12 },
  navLinkText: { fontFamily: SYSTEM_FONT, fontWeight: '600', color: TEXT_DARK },
  btnSmall: { backgroundColor: CTA_TEAL, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 100 },
  btnSmallText: { fontFamily: SYSTEM_FONT, fontSize: 13, fontWeight: '700', color: '#fff' },
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
  btnBig: { borderRadius: 100, minWidth: 160 },
  logoSection: { backgroundColor: '#fff', paddingVertical: 50, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#f0f0f0' },
  logoTitle: { textAlign: 'center', fontSize: 15, fontWeight: '500', color: '#bbb', marginBottom: 30, letterSpacing: 1.5, textTransform: 'uppercase' },
  logoWall: { flexDirection: 'row', justifyContent: 'center', gap: 60, flexWrap: 'wrap', alignItems: 'center' },
  logoWallMobile: { gap: 30, paddingHorizontal: 20 },
  logoWrapper: { height: 50, justifyContent: 'center', alignItems: 'center' },
});