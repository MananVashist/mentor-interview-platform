// app/index.tsx
import React, { Suspense, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import Head from 'expo-router/head';

// 🟢 FIX 1: Import ONLY BrandHeader (minimal critical component)
import { BrandHeader } from '@/lib/BrandHeader';

// 🟢 FIX 2: Lazy Load the Heavy Sections (Logos, Reviews, etc.)
const LazySections = React.lazy(() => import('../components/LazySections'));

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

const SITE_TITLE = 'CrackJobs | Anonymous mock interviews with real experts'; 
const SITE_DESCRIPTION = 'Practice interview topics anonymously with fully vetted expert mentors.';

// 🟢 INLINE BUTTON (Hardcoded for minimal bundle size)
const Button = ({ title, onPress, variant = "primary", size = "lg", style, textStyle }: {
  title: string;
  onPress: () => void;
  variant?: "primary" | "outline";
  size?: "lg";
  style?: any;
  textStyle?: any;
}) => (
  <TouchableOpacity
    style={[
      { borderRadius: 100, alignItems: 'center', justifyContent: 'center', paddingVertical: 16, paddingHorizontal: 32 },
      variant === "primary" && { backgroundColor: CTA_TEAL },
      variant === "outline" && { backgroundColor: 'transparent', borderWidth: 2, borderColor: TEXT_DARK },
      style,
    ]}
    onPress={onPress}
    activeOpacity={0.7}
    accessibilityRole="button"
    accessibilityLabel={title}
    accessibilityHint={`Navigate to ${title === "Start Practicing" ? "sign up page" : title === "Browse Mentors" ? "sign in page" : "relevant page"}`}
  >
    <Text style={[
      { fontFamily: SYSTEM_FONT, fontSize: 14, fontWeight: '700' },
      variant === "primary" && { color: '#fff' },
      variant === "outline" && { color: TEXT_DARK },
      textStyle,
    ]}>
      {title}
    </Text>
  </TouchableOpacity>
);

// 🟢 MOVED "HOW IT WORKS" HERE (Eager Load)
const HowItWorks = memo(() => {
  const { width } = useWindowDimensions();
  const isSmall = width < 900;

  const STEPS = [
    { emoji: '📝', title: 'Pick Your Track', desc: 'Choose interview type and specific topic you want to practice' },
    { emoji: '👨‍💼', title: 'Book a Mentor', desc: 'Select from verified experts at top companies' },
    { emoji: '🎯', title: 'Practice & Get Feedback', desc: 'Realistic 55-min session with structured evaluation' },
  ];

  return (
    <View 
      style={styles.sectionContainer}
      accessibilityRole="region"
      accessibilityLabel="How it works section"
    >
      <Text 
        style={styles.sectionKicker}
        accessibilityRole="header"
        accessibilityLevel={2}
      >
        HOW IT WORKS
      </Text>
      <Text 
        style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}
        accessibilityRole="header"
        accessibilityLevel={3}
      >
        Three simple steps to better interviews
      </Text>
      <View style={[styles.stepsGrid, isSmall && styles.stepsGridMobile]}>
        {STEPS.map((step, i) => (
          <View 
            key={i} 
            style={styles.stepCard}
            accessibilityRole="summary"
            accessibilityLabel={`Step ${i + 1}: ${step.title}. ${step.desc}`}
          >
            <Text style={styles.stepEmoji} accessibilityLabel={step.emoji}>{step.emoji}</Text>
            <Text 
              style={styles.stepTitle}
              accessibilityRole="header"
              accessibilityLevel={4}
            >
              {step.title}
            </Text>
            <Text style={styles.stepDesc}>{step.desc}</Text>
          </View>
        ))}
      </View>
    </View>
  );
});

export default function LandingPage() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isSmall = width < 900;

  if (Platform.OS === 'android') return <Redirect href="/auth/sign-in" />;

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <title>{SITE_TITLE}</title>
        <meta name="description" content={SITE_DESCRIPTION} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={SITE_TITLE} />
        <meta property="og:description" content={SITE_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={SITE_TITLE} />
        <meta name="twitter:description" content={SITE_DESCRIPTION} />
        <style>{`body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, sans-serif; background-color: #f8f5f0; } * { box-sizing: border-box; }`}</style>
      </Head>

      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.scrollContent}
        accessibilityRole="main"
      >
        
        {/* --- HEADER --- */}
        <View 
          style={styles.header}
          accessibilityRole="navigation"
          accessibilityLabel="Main navigation"
        >
          <View style={[styles.headerInner, isSmall && styles.headerInnerMobile]}>
            <BrandHeader style={{ marginBottom: 0 }} small={isSmall} />
            <View style={[styles.navRight, isSmall && styles.navRightMobile]}>
              <TouchableOpacity 
                onPress={() => router.push('/auth/sign-in')}
                accessibilityRole="link"
                accessibilityLabel="Log in to your account"
                accessibilityHint="Navigate to sign in page"
              >
                <Text style={styles.navLinkText}>Log in</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.btnSmall} 
                onPress={() => router.push('/auth/sign-up')}
                accessibilityRole="button"
                accessibilityLabel="Get Started"
                accessibilityHint="Navigate to sign up page"
              >
                <Text style={styles.btnSmallText}>Get Started</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* --- HERO SECTION --- */}
        <View 
          style={styles.sectionContainer}
          accessibilityRole="region"
          accessibilityLabel="Hero section"
        >
          <View style={[styles.heroCentered, isSmall && styles.heroCenteredMobile]}>
            <View 
              style={styles.badgeContainer}
              accessibilityRole="text"
              accessibilityLabel="New: ML System Design Track"
            >
              <Text style={styles.badgeText}>🚀 NEW: ML System Design Track</Text>
            </View>
            <Text 
              style={[styles.heroTitle, isSmall && styles.heroTitleMobile]}
              accessibilityRole="header"
              accessibilityLevel={1}
            >
              Practice interviews with{'\n'}<Text style={{ color: CTA_TEAL }}>Real expert mentors</Text>
            </Text>
            <Text 
              style={[styles.heroSubtitle, isSmall && styles.heroSubtitleMobile]}
              accessibilityRole="text"
            >
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

        {/* --- HOW IT WORKS (Eager Loaded) --- */}
        <HowItWorks />

        {/* --- LAZY SECTIONS (Logos + Rest) --- */}
        <Suspense fallback={<View style={{ height: 600 }} accessibilityLabel="Loading content" />}>
          <LazySections />
        </Suspense>

      </ScrollView>
    </>
  );
}

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
  sectionKicker: { fontFamily: SYSTEM_FONT, fontWeight: '700', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1.5, color: CTA_TEAL, marginBottom: 12, textAlign: 'center' },
  sectionTitle: { fontFamily: SYSTEM_FONT, fontWeight: '800', fontSize: 36, color: TEXT_DARK, marginBottom: 48, textAlign: 'center' },
  sectionTitleMobile: { fontSize: 28},
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
  stepsGrid: { flexDirection: 'row', gap: 32, justifyContent: 'center', alignItems: 'center' },
  stepsGridMobile: { flexDirection: 'column'    },
  stepCard: { flex: 1, maxWidth: 320, backgroundColor: '#fff', padding: 32, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#f0f0f0' },
  stepEmoji: { fontSize: 48, marginBottom: 16 },
  stepTitle: { fontFamily: SYSTEM_FONT, fontWeight: '700', fontSize: 20, color: TEXT_DARK, marginBottom: 8, textAlign: 'center' },
  stepDesc: { fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_GRAY, lineHeight: 22, textAlign: 'center' },
});