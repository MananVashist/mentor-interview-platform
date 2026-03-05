// app/index.tsx
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
import { Header } from '@/components/Header';

const LazySections = lazy(() => import('../components/LazySections'));

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

const HowItWorks = memo(() => {
  const STEPS = [
    { emoji: '📝', title: 'Paste Your Target JD', desc: 'Pick your track (PM, Data, HR) and paste the exact Job Description you want. We tailor the interview to match.' },
    { emoji: '👨‍💼', title: 'Practice with an Insider', desc: 'Simulate a live interview with a vetted human expert. No AI bots. Just real industry insiders.' },
    { emoji: '🎯', title: 'Get Actionable Feedback', desc: 'Receive a detailed scorecard, review the recording, fix your mistakes, and walk into the real interview ready.' },
  ];

  return (
    <View style={styles.sectionContainer} nativeID="how-it-works">
      <Text style={styles.sectionKicker}>YOUR PATH TO THE OFFER</Text>
      <Text style={styles.sectionTitle} nativeID="section-title">
        How realistic practice builds unshakeable confidence
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

export default function LandingPage() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (Platform.OS === 'android') return <Redirect href="/auth/sign-in" />;

  // Enhanced JSON-LD Structured Data with Navigation & Breadcrumbs
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://crackjobs.com/#website",
        "url": "https://crackjobs.com/",
        "name": "CrackJobs - Realistic Mock Interviews with Human Experts",
        "alternateName": "CrackJobs Mock Interview Platform",
        "description": "Practice interviews with real, vetted human experts—not AI. Prepare for PM, Data, and HR roles using your target Job Description.",
        "publisher": {
          "@id": "https://crackjobs.com/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://crackjobs.com/search?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        },
        "inLanguage": "en-US"
      },
      {
        "@type": "Organization",
        "@id": "https://crackjobs.com/#organization",
        "name": "CrackJobs",
        "alternateName": "CrackJobs Mock Interview Platform",
        "url": "https://crackjobs.com",
        "logo": {
          "@type": "ImageObject",
          "@id": "https://crackjobs.com/#logo",
          "url": "https://crackjobs.com/logo.png",
          "contentUrl": "https://crackjobs.com/logo.png",
          "width": 250,
          "height": 60,
          "caption": "CrackJobs Logo"
        },
        "image": {
          "@id": "https://crackjobs.com/#logo"
        },
        "description": "Mock interview platform connecting job seekers with human experts from top tech companies for targeted PM, Data, and HR preparation.",
        "foundingDate": "2024",
        "sameAs": [
          "https://www.linkedin.com/company/crackjobs",
          "https://twitter.com/crackjobs"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "Customer Support",
          "url": "https://crackjobs.com/contact",
          "email": "support@crackjobs.com",
          "availableLanguage": ["English", "Hindi"]
        }
      },
      {
        "@type": "WebPage",
        "@id": "https://crackjobs.com/#webpage",
        "url": "https://crackjobs.com/",
        "name": "CrackJobs | Land Your Dream Job",
        "isPartOf": {
          "@id": "https://crackjobs.com/#website"
        },
        "about": {
          "@id": "https://crackjobs.com/#organization"
        },
        "description": "Mock interviews with real human experts. Get actionable feedback and practice with your target JD.",
        "inLanguage": "en-US",
        "primaryImageOfPage": {
          "@id": "https://crackjobs.com/#logo"
        }
      }
    ]
  };

  return (
    <>
      <Head>
        <title>CrackJobs | Land Your Dream Job with Realistic Interview Practice</title>
        <meta name="title" content="CrackJobs | Mock Interviews with Real Experts" />
        <meta name="description" content="Practice interviews with real human experts, not AI. Prepare for Product Management, Data Analytics, Data Science, and HR interviews using your exact Job Description." />
        <meta name="keywords" content="mock interviews, interview preparation, product management interview, data analytics interview, data science interview, human feedback, JD interview practice" />
        
        <link rel="canonical" href="https://crackjobs.com/" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://crackjobs.com/" />
        <meta property="og:title" content="CrackJobs | Realistic Mock Interviews with Human Experts" />
        <meta property="og:description" content="Practice interviews with real human experts. Paste your JD, get actionable feedback, and ace your next interview." />
        <meta property="og:image" content="https://crackjobs.com/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <style type="text/css">{`
          * { box-sizing: border-box; }
          html, body { margin: 0; padding: 0; height: 100%; }
          body { font-family: ${SYSTEM_FONT}; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
          a { color: inherit; text-decoration: none; }
          @media (max-width: 768px) {
            #hero-title { font-size: 36px !important; line-height: 44px !important; }
            #hero-subtitle { font-size: 16px !important; line-height: 24px !important; }
            #hero-buttons { flex-direction: column !important; width: 100% !important; padding-left: 20px !important; padding-right: 20px !important; }
            #steps-grid { flex-direction: column !important; }
          }
        `}</style>
      </Head>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />

      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.scrollContent}
      >
        <Header showGetStarted={true} />

        {/* Hero Section */}
        <View style={styles.sectionContainer} nativeID="section-container-hero">
          <View style={styles.heroCentered} nativeID="hero-centered">
            <View style={styles.heroTextContainer}>
              <View style={styles.pillBadge}>
                <Text style={styles.pillText}>🎯 Practice with your target JD</Text>
              </View>
              <Text style={styles.heroTitle} nativeID="hero-title">
                <Text style={{ color: TEXT_DARK }}>Land your dream job with </Text>
                <Text style={{ color: CTA_TEAL }}>realistic practice</Text>
              </Text>
              <Text style={styles.heroSubtitle} nativeID="hero-subtitle">
                Book a live mock interview based on your actual job description. Get structured feedback from real human hiring managers, eliminate your blind spots, and ace the real thing.
              </Text>
            </View>
            <View style={styles.heroCTAContainer} nativeID="hero-buttons">
              <Button
                title="Book Your Interview"
                onPress={() => router.push('/auth/sign-up')}
                variant="primary"
                style={styles.primaryCTA}
              />
              <Button
                title="View Our Experts"
                onPress={() => router.push('/mentors')}
                variant="outline"
                style={styles.secondaryCTA}
              />
            </View>
          </View>
        </View>

        {/* How It Works Section */}
        <HowItWorks />

        {/* Lazy Loaded Sections */}
        {isReady && (
          <Suspense fallback={<ActivityIndicator size="large" color={BRAND_ORANGE} />}>
            <LazySections />
          </Suspense>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_CREAM,
  },
  scrollContent: {
    flexGrow: 1,
  },
  buttonBase: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: CTA_TEAL,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: TEXT_DARK,
  },
  buttonText: {
    fontFamily: SYSTEM_FONT,
    fontSize: 15,
    fontWeight: '700',
  },
  sectionContainer: {
    paddingTop: 20,
    paddingBottom: 80,
    paddingLeft: 32,
    paddingRight: 32,
  },
  heroCentered: {
    maxWidth: 900,
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 40,
  },
  heroTextContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  pillBadge: {
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 100,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  pillText: {
    fontFamily: SYSTEM_FONT,
    fontSize: 13,
    fontWeight: '700',
    color: BRAND_ORANGE,
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontFamily: SYSTEM_FONT,
    fontSize: 52,
    fontWeight: '900',
    color: TEXT_DARK,
    textAlign: 'center',
    lineHeight: 64,
    marginBottom: 24,
    maxWidth: 800,
  },
  heroSubtitle: {
    fontFamily: SYSTEM_FONT,
    fontSize: 20,
    color: TEXT_GRAY,
    textAlign: 'center',
    lineHeight: 32,
    maxWidth: 700,
  },
  heroCTAContainer: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  primaryCTA: {
    paddingVertical: 18,
    paddingHorizontal: 36,
  },
  secondaryCTA: {
    paddingVertical: 18,
    paddingHorizontal: 36,
  },
  sectionKicker: {
    fontFamily: SYSTEM_FONT,
    fontSize: 12,
    fontWeight: '800',
    color: BRAND_ORANGE,
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontFamily: SYSTEM_FONT,
    fontSize: 40,
    fontWeight: '800',
    color: TEXT_DARK,
    textAlign: 'center',
    lineHeight: 52,
    marginBottom: 60,
    maxWidth: 800,
    alignSelf: 'center',
  },
  stepsGrid: {
    flexDirection: 'row',
    gap: 32,
    maxWidth: 1100,
    alignSelf: 'center',
  },
  stepCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  stepEmoji: {
    fontSize: 48,
    marginBottom: 20,
  },
  stepTitle: {
    fontFamily: SYSTEM_FONT,
    fontSize: 20,
    fontWeight: '700',
    color: TEXT_DARK,
    textAlign: 'center',
    marginBottom: 12,
  },
  stepDesc: {
    fontFamily: SYSTEM_FONT,
    fontSize: 15,
    color: TEXT_GRAY,
    textAlign: 'center',
    lineHeight: 24,
  },
});