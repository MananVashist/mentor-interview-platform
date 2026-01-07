import React, { memo, useState, useEffect, Suspense, lazy } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import Head from 'expo-router/head';

// ---------------------------------------------------------------------------
// ⚡️ CRITICAL IMPORTS
// ---------------------------------------------------------------------------
import { BrandHeader } from '@/lib/BrandHeader';

// 🟢 PERFORMANCE FIX: Lazy load the heavy sections
// This splits the JS bundle so the initial load is tiny.
const LazySections = lazy(() => import('../components/LazySections'));

// ---------------------------------------------------------------------------
// 🎨 CONSTANTS & STYLES
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// 🧩 COMPONENT: BUTTON
// ---------------------------------------------------------------------------
const Button = ({ title, onPress, variant = "primary", style, textStyle }: {
  title: string;
  onPress: () => void;
  variant?: "primary" | "outline";
  style?: any;
  textStyle?: any;
}) => (
  <TouchableOpacity
    style={[
      styles.buttonBase,
      variant === "primary" && styles.buttonPrimary,
      variant === "outline" && styles.buttonOutline,
      style,
    ]}
    onPress={onPress}
    activeOpacity={0.7}
    accessibilityRole="button"
    accessibilityLabel={title}
  >
    <Text style={[
      styles.buttonText,
      variant === "primary" && { color: '#fff' },
      variant === "outline" && { color: TEXT_DARK },
      textStyle,
    ]}>
      {title}
    </Text>
  </TouchableOpacity>
);

// ---------------------------------------------------------------------------
// 🧩 COMPONENT: HOW IT WORKS
// ---------------------------------------------------------------------------
const HowItWorks = memo(() => {
  const { width } = useWindowDimensions();
  const isSmall = width < 900;

  const STEPS = [
    { emoji: '📝', title: 'Pick Your Track', desc: 'Choose interview type and specific topic you want to practice' },
    { emoji: '👨‍💼', title: 'Book a Mentor', desc: 'Select from verified experts at top companies' },
    { emoji: '🎯', title: 'Practice & Get Feedback', desc: 'Realistic 55-min session with structured evaluation' },
  ];

  return (
    <View style={styles.sectionContainer} accessibilityRole="region" aria-label="How it works">
      <Text style={styles.sectionKicker} accessibilityRole="header" aria-level={2}>HOW IT WORKS</Text>
      <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]} accessibilityRole="header" aria-level={3}>
        Three simple steps to better interviews
      </Text>
      <View style={[styles.stepsGrid, isSmall && styles.stepsGridMobile]}>
        {STEPS.map((step, i) => (
          <View key={i} style={styles.stepCard}>
            <Text style={styles.stepEmoji}>{step.emoji}</Text>
            <Text style={styles.stepTitle}>{step.title}</Text>
            <Text style={styles.stepDesc}>{step.desc}</Text>
          </View>
        ))}
      </View>
    </View>
  );
});

// ---------------------------------------------------------------------------
// 🚀 MAIN PAGE COMPONENT
// ---------------------------------------------------------------------------
export default function LandingPage() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isSmall = width < 900;

  // 🟢 STATE: Control client-side rendering
  const [isReady, setIsReady] = useState(false);

  // 🟢 EFFECT: Trigger load only after mounting (avoids hydration errors)
  useEffect(() => {
    setIsReady(true);
  }, []);

  // Android Redirect
  if (Platform.OS === 'android') return <Redirect href="/auth/sign-in" />;

  const websiteSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "name": "CrackJobs",
        "url": "https://crackjobs.com/"
      },
      {
        "@type": "Organization",
        "name": "CrackJobs",
        "url": "https://crackjobs.com",
        "logo": "https://crackjobs.com/favicon.png",
        "sameAs": ["https://www.linkedin.com/company/crackjobs", "https://twitter.com/crackjobs"]
      },
      {
        "@type": "Product",
        "name": "Mock Interview Session",
        "description": "Anonymous 1:1 mock interviews with vetted experts.",
        "brand": { "@type": "Brand", "name": "CrackJobs" },
        "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "500" },
        "offers": {
          "@type": "Offer",
          "priceCurrency": "USD",
          "price": "30.00",
          "availability": "https://schema.org/InStock",
          "url": "https://crackjobs.com/auth/sign-up"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How does CrackJobs work?",
            "acceptedAnswer": { "@type": "Answer", "text": "Choose your interview track, book a session with a verified expert, attend your anonymous 1:1 mock interview, and receive feedback." }
          },
          {
            "@type": "Question",
            "name": "Who are the mentors?",
            "acceptedAnswer": { "@type": "Answer", "text": "All mentors are verified professionals from top tech companies like Google, Amazon, Meta, and Microsoft." }
          }
        ]
      }
    ]
  };

  return (
    <>
      <Head>
        <title>{SITE_TITLE}</title>
        <meta name="description" content={SITE_DESCRIPTION} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://crackjobs.com/" />
        
        <meta property="og:title" content={SITE_TITLE} />
        <meta property="og:description" content={SITE_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://crackjobs.com/" />
        <meta name="twitter:card" content="summary_large_image" />
        
        <style>{`
          body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, sans-serif; background-color: #f8f5f0; opacity: 1 !important; visibility: visible !important; }
          * { box-sizing: border-box; }
        `}</style>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </Head>

      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.scrollContent}
        accessibilityRole="main"
      >
        
        {/* --- HEADER --- */}
        <View style={styles.header} accessibilityRole="navigation">
          <View style={[styles.headerInner, isSmall && styles.headerInnerMobile]}>
            <BrandHeader style={{ marginBottom: 0 }} small={isSmall} />
            <View style={[styles.navRight, isSmall && styles.navRightMobile]}>
              <TouchableOpacity onPress={() => router.push('/auth/sign-in')} accessibilityRole="link">
                <Text style={styles.navLinkText}>Log in</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.btnSmall} 
                onPress={() => router.push('/auth/sign-up')} 
                accessibilityRole="button"
              >
                <Text style={styles.btnSmallText}>Get Started</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* --- HERO SECTION --- */}
        <View style={styles.sectionContainer} accessibilityRole="banner">
          <View style={[styles.heroCentered, isSmall && styles.heroCenteredMobile]}>
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>🚀 NEW: ML System Design Track</Text>
            </View>
            <Text style={[styles.heroTitle, isSmall && styles.heroTitleMobile]} accessibilityRole="header" aria-level={1}>
              Practice interviews with{'\n'}<Text style={{ color: CTA_TEAL }}>Real expert mentors</Text>
            </Text>
            <Text style={[styles.heroSubtitle, isSmall && styles.heroSubtitleMobile]}>
              Anonymous 1:1 mock interviews. Practice with vetted mentors from top companies.
            </Text>
            <View style={[styles.heroButtons, isSmall && styles.heroButtonsMobile]}>
              <Button 
                title="Start Practicing" 
                variant="primary" 
                onPress={() => router.push('/auth/sign-up')}
                style={[styles.btnBig, isSmall && { width: '100%' }]}
                textStyle={{ fontSize: 16 }}
              />
              <Button 
                title="Browse Mentors" 
                variant="outline" 
                onPress={() => router.push('/auth/sign-in')}
                style={[styles.btnBig, isSmall && { width: '100%' }]}
                textStyle={{ fontSize: 16 }}
              />
            </View>
          </View>
        </View>

        {/* --- HOW IT WORKS (Kept Eager for SEO) --- */}
        <HowItWorks />

        {/* 🟢 LAZY SECTIONS WRAPPER */}
        {/* This effectively defers 70% of your code until after the first paint */}
        {isReady ? (
          <Suspense 
            fallback={
              // 🟢 CRITICAL: MinHeight 2000 prevents Layout Shift (CLS)
              <View style={{ minHeight: 2000, justifyContent: 'flex-start', paddingTop: 100, alignItems: 'center' }}>
                 <ActivityIndicator size="large" color={CTA_TEAL} />
              </View>
            }
          >
            <LazySections />
          </Suspense>
        ) : (
           // Placeholder for SSG build
           <View style={{ minHeight: 2000 }} />
        )}

      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG_CREAM },
  scrollContent: { minHeight: '100%' },
  
  // Header
  header: { backgroundColor: BG_CREAM, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  headerInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1200, width: '100%', alignSelf: 'center', paddingHorizontal: 24 },
  headerInnerMobile: { paddingHorizontal: 16 },
  
  // Nav
  navRight: { flexDirection: 'row', gap: 24, alignItems: 'center' },
  navRightMobile: { gap: 12 },
  navLinkText: { fontFamily: SYSTEM_FONT, fontWeight: '600', color: TEXT_DARK },
  btnSmall: { backgroundColor: CTA_TEAL, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 100 },
  btnSmallText: { fontFamily: SYSTEM_FONT, fontSize: 13, fontWeight: '700', color: '#fff' },
  
  // Sections
  sectionContainer: { maxWidth: 1200, width: '100%', alignSelf: 'center', paddingHorizontal: 24, paddingVertical: 60 },
  sectionKicker: { fontFamily: SYSTEM_FONT, fontWeight: '700', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1.5, color: CTA_TEAL, marginBottom: 12, textAlign: 'center' },
  sectionTitle: { fontFamily: SYSTEM_FONT, fontWeight: '800', fontSize: 36, color: TEXT_DARK, marginBottom: 48, textAlign: 'center' },
  sectionTitleMobile: { fontSize: 28},
  
  // Hero
  heroCentered: { alignItems: 'center', paddingVertical: 40, maxWidth: 800, alignSelf: 'center' },
  heroCenteredMobile: { paddingVertical: 20 },
  heroTitle: { fontFamily: SYSTEM_FONT, fontWeight: '800', fontSize: 52, color: BRAND_ORANGE, lineHeight: 60, marginBottom: 24, textAlign: 'center' },
  heroTitleMobile: { fontSize: 36, lineHeight: 44 },
  heroSubtitle: { fontFamily: SYSTEM_FONT, fontSize: 20, color: TEXT_GRAY, lineHeight: 30, marginBottom: 40, textAlign: 'center', maxWidth: 600 },
  heroSubtitleMobile: { fontSize: 16, textAlign: 'center', lineHeight: 24 },
  
  // Badge
  badgeContainer: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e0f5f5', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 100, marginBottom: 24 },
  badgeText: { color: CTA_TEAL, fontWeight: '700', fontSize: 12, fontFamily: SYSTEM_FONT, letterSpacing: 0.5, textTransform: 'uppercase' },
  
  // Buttons
  heroButtons: { flexDirection: 'row', gap: 16 },
  heroButtonsMobile: { flexDirection: 'column', width: '100%', paddingHorizontal: 20 },
  btnBig: { minWidth: 160 },
  buttonBase: { borderRadius: 100, alignItems: 'center', justifyContent: 'center', paddingVertical: 16, paddingHorizontal: 32 },
  buttonPrimary: { backgroundColor: CTA_TEAL },
  buttonOutline: { backgroundColor: 'transparent', borderWidth: 2, borderColor: TEXT_DARK },
  buttonText: { fontFamily: SYSTEM_FONT, fontSize: 14, fontWeight: '700' },

  // Steps
  stepsGrid: { flexDirection: 'row', gap: 32, justifyContent: 'center', alignItems: 'center' },
  stepsGridMobile: { flexDirection: 'column' },
  stepCard: { flex: 1, maxWidth: 320, backgroundColor: '#fff', padding: 32, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#f0f0f0' },
  stepEmoji: { fontSize: 48, marginBottom: 16 },
  stepTitle: { fontFamily: SYSTEM_FONT, fontWeight: '700', fontSize: 20, color: TEXT_DARK, marginBottom: 8, textAlign: 'center' },
  stepDesc: { fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_GRAY, lineHeight: 22, textAlign: 'center' },
});