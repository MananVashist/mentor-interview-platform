import React, { memo, useState, useEffect, Suspense, lazy } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
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

const SITE_TITLE = 'CrackJobs | Mock interviews with real experts'; 
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
  const STEPS = [
    { emoji: '📝', title: 'Pick Your Track', desc: 'Choose your domain and the specific interview topic you want to practice' },
    { emoji: '👨‍💼', title: 'Book a Mentor', desc: 'Select from verified experts at top companies' },
    { emoji: '🎯', title: 'Practice & Get Feedback', desc: 'Realistic 55-min session with structured evaluation and recording' },
  ];

  return (
    <View style={styles.sectionContainer} accessibilityRole="region" aria-label="How it works">
      <Text style={styles.sectionKicker} accessibilityRole="header" aria-level={2}>HOW IT WORKS</Text>
      <Text style={styles.sectionTitle} accessibilityRole="header" aria-level={3} nativeID="section-title">
        Three simple steps to better interviews
      </Text>
      <View style={styles.stepsGrid} nativeID="steps-grid">
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

  // 🟢 STATE: Control client-side rendering
  const [isReady, setIsReady] = useState(false);

  // 🟢 EFFECT: Trigger load only after mounting (avoids hydration errors)
  useEffect(() => {
    setIsReady(true);
  }, []);

  // Android Redirect
  if (Platform.OS === 'android') return <Redirect href="/auth/sign-in" />;

  // 🔥 COMPREHENSIVE STRUCTURED DATA
  const websiteSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "name": "CrackJobs",
        "url": "https://crackjobs.com/",
        "description": "Anonymous mock interviews with expert mentors from top companies",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://crackjobs.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Organization",
        "name": "CrackJobs",
        "url": "https://crackjobs.com",
        "logo": "https://crackjobs.com/favicon.png",
        "description": "Anonymous mock interview platform connecting job seekers with expert mentors",
        "foundingDate": "2024",
        "sameAs": [
          "https://www.linkedin.com/company/crackjobs",
          "https://twitter.com/crackjobs"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "Customer Support",
          "url": "https://crackjobs.com/contact"
        }
      },
      {
        "@type": "Product",
        "name": "Mock Interview Session",
        "description": "Professional 1:1 mock interview with industry experts including detailed feedback and session recording",
        "brand": { 
          "@type": "Brand", 
          "name": "CrackJobs" 
        },
        "aggregateRating": { 
          "@type": "AggregateRating", 
          "ratingValue": "4.8", 
          "reviewCount": "500",
          "bestRating": "5",
          "worstRating": "1"
        },
        "offers": {
          "@type": "AggregateOffer",
          "priceCurrency": "INR",
          "lowPrice": "1500",
          "highPrice": "3000",
          "offerCount": "100",
          "availability": "https://schema.org/InStock",
          "url": "https://crackjobs.com/auth/sign-up"
        }
      },
      {
        "@type": "ItemList",
        "name": "Interview Practice Tracks",
        "description": "Available interview preparation tracks",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "item": {
              "@type": "Course",
              "name": "Product Management Interview Prep",
              "description": "Product sense, execution, strategy, technical design and leadership",
              "url": "https://crackjobs.com/interviews/product-management",
              "provider": {
                "@type": "Organization",
                "name": "CrackJobs"
              }
            }
          },
          {
            "@type": "ListItem",
            "position": 2,
            "item": {
              "@type": "Course",
              "name": "Data Analytics Interview Prep",
              "description": "SQL, data visualization, statistical analysis, and business insights",
              "url": "https://crackjobs.com/interviews/data-analytics",
              "provider": {
                "@type": "Organization",
                "name": "CrackJobs"
              }
            }
          },
          {
            "@type": "ListItem",
            "position": 3,
            "item": {
              "@type": "Course",
              "name": "Data Science Interview Prep",
              "description": "Machine learning, statistics, Python, and model deployment",
              "url": "https://crackjobs.com/interviews/data-science",
              "provider": {
                "@type": "Organization",
                "name": "CrackJobs"
              }
            }
          },
          {
            "@type": "ListItem",
            "position": 4,
            "item": {
              "@type": "Course",
              "name": "HR Interview Prep",
              "description": "Behavioral questions, situational responses, and cultural fit",
              "url": "https://crackjobs.com/interviews/hr",
              "provider": {
                "@type": "Organization",
                "name": "CrackJobs"
              }
            }
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is CrackJobs?",
            "acceptedAnswer": { 
              "@type": "Answer", 
              "text": "CrackJobs is an anonymous mock interview platform that connects job seekers with expert mentors from top companies like Google, Amazon, and Meta across Product Management, Data Analytics, Data Science, and HR domains." 
            }
          },
          {
            "@type": "Question",
            "name": "How does anonymity work?",
            "acceptedAnswer": { 
              "@type": "Answer", 
              "text": "Both mentors and candidates interact using only professional titles (e.g., 'Senior PM at Meta' or 'Candidate'). No personal information, names, or contact details are shared during sessions." 
            }
          },
          {
            "@type": "Question",
            "name": "Do I get feedback after the interview?",
            "acceptedAnswer": { 
              "@type": "Answer", 
              "text": "Yes! Every session includes structured evaluation with detailed feedback on your performance, specific improvement areas, strengths, and actionable recommendations. You also receive a recording of your session for review." 
            }
          }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://crackjobs.com"
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
  body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, sans-serif; background-color: #f8f5f0; }
  
  /* ⚡️ RESPONSIVE BRAND HEADER STYLES */
  /* Desktop: Show eyes, full size text */
  #brand-eyes { display: flex !important; }
  #brand-text-container { font-size: 32px; }
  
  /* Mobile (≤768px): Hide eyes, smaller text */
  @media (max-width: 768px) {
    #brand-eyes { display: none !important; }
    #brand-header { margin-bottom: 8px !important; }
    #brand-text-container { transform: scale(0.7); transform-origin: left center; }
  }
  
  /* ⚡️ RESPONSIVE SECTION STYLES */
  @media (max-width: 768px) {
    /* Section titles */
    #section-title { font-size: 28px !important; }
    
    /* Header - reduce vertical padding */
    #main-header { padding-top: 12px !important; padding-bottom: 12px !important; }
    
    /* Header inner */
    #header-inner { padding-left: 16px !important; padding-right: 16px !important; }
    
    /* Nav right */
    #nav-right { gap: 12px !important; }
    
    /* Hero section container - reduce top padding */
    #section-container-hero { padding-top: 24px !important; padding-bottom: 40px !important; }
    
    /* Hero section - reduce internal padding */
    #hero-centered { padding-top: 0px !important; padding-bottom: 20px !important; }
    #hero-title { font-size: 36px !important; line-height: 44px !important; }
    #hero-subtitle { font-size: 16px !important; line-height: 24px !important; }
    #hero-buttons { flex-direction: column !important; width: 100% !important; padding-left: 20px !important; padding-right: 20px !important; }
    
    /* Steps grid */
    #steps-grid { flex-direction: column !important; }
  }
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
        <View style={styles.header} nativeID="main-header" accessibilityRole="navigation">
          <View style={styles.headerInner} nativeID="header-inner">
            <BrandHeader style={{ marginBottom: 0 }} small={false} />
            <View style={styles.navRight} nativeID="nav-right">
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
        <View style={styles.sectionContainer} nativeID="section-container-hero" accessibilityRole="banner">
          <View style={styles.heroCentered} nativeID="hero-centered">
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>🚀 NEW: PM Technical Track</Text>
            </View>
            <Text style={styles.heroTitle} nativeID="hero-title" accessibilityRole="header" aria-level={1}>
              Mock interviews with{'\n'}<Text style={{ color: CTA_TEAL }}>real expert mentors</Text>
            </Text>
            <Text style={styles.heroSubtitle} nativeID="hero-subtitle">
              Anonymous 1:1 mock interviews. Practice with vetted mentors from top companies.
            </Text>
            <View style={styles.heroButtons} nativeID="hero-buttons">
              <Button 
                title="Start Practicing" 
                variant="primary" 
                onPress={() => router.push('/auth/sign-up')}
                style={[styles.btnBig, { width: 'auto' }]}
                textStyle={{ fontSize: 16 }}
              />
              <Button 
                title="Browse Mentors" 
                variant="outline" 
                onPress={() => router.push('/auth/sign-in')}
                style={[styles.btnBig, { width: 'auto' }]}
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
  
  // Nav
  navRight: { flexDirection: 'row', gap: 24, alignItems: 'center' },
  navLinkText: { fontFamily: SYSTEM_FONT, fontWeight: '600', color: TEXT_DARK },
  btnSmall: { backgroundColor: CTA_TEAL, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 100 },
  btnSmallText: { fontFamily: SYSTEM_FONT, fontSize: 13, fontWeight: '700', color: '#fff' },
  
  // Sections
  sectionContainer: { maxWidth: 1200, width: '100%', alignSelf: 'center', paddingHorizontal: 24, paddingVertical: 60 },
  sectionKicker: { fontFamily: SYSTEM_FONT, fontWeight: '700', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1.5, color: CTA_TEAL, marginBottom: 12, textAlign: 'center' },
  sectionTitle: { fontFamily: SYSTEM_FONT, fontWeight: '800', fontSize: 36, color: TEXT_DARK, marginBottom: 48, textAlign: 'center' },
  
  // Hero
  heroCentered: { alignItems: 'center', paddingVertical: 40, maxWidth: 800, alignSelf: 'center' },
  heroTitle: { fontFamily: SYSTEM_FONT, fontWeight: '800', fontSize: 52, color: BRAND_ORANGE, lineHeight: 60, marginBottom: 24, textAlign: 'center' },
  heroSubtitle: { fontFamily: SYSTEM_FONT, fontSize: 20, color: TEXT_GRAY, lineHeight: 30, marginBottom: 40, textAlign: 'center', maxWidth: 600 },
  
  // Badge
  badgeContainer: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e0f5f5', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 100, marginBottom: 24 },
  badgeText: { color: CTA_TEAL, fontWeight: '700', fontSize: 12, fontFamily: SYSTEM_FONT, letterSpacing: 0.5, textTransform: 'uppercase' },
  
  // Buttons
  heroButtons: { flexDirection: 'row', gap: 16 },
  btnBig: { minWidth: 160 },
  buttonBase: { borderRadius: 100, alignItems: 'center', justifyContent: 'center', paddingVertical: 16, paddingHorizontal: 32 },
  buttonPrimary: { backgroundColor: CTA_TEAL },
  buttonOutline: { backgroundColor: 'transparent', borderWidth: 2, borderColor: TEXT_DARK },
  buttonText: { fontFamily: SYSTEM_FONT, fontSize: 14, fontWeight: '700' },

  // Steps
  stepsGrid: { flexDirection: 'row', gap: 32, justifyContent: 'center', alignItems: 'center' },
  stepCard: { flex: 1, maxWidth: 320, backgroundColor: '#fff', padding: 32, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#f0f0f0' },
  stepEmoji: { fontSize: 48, marginBottom: 16 },
  stepTitle: { fontFamily: SYSTEM_FONT, fontWeight: '700', fontSize: 20, color: TEXT_DARK, marginBottom: 8, textAlign: 'center' },
  stepDesc: { fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_GRAY, lineHeight: 22, textAlign: 'center' },
});