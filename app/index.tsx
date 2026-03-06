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
  useWindowDimensions,
} from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import Head from 'expo-router/head';
import { Header } from '@/components/Header';

// ─── GTM DataLayer Helper ─────────────────────────────────────────────────────
const pushToDataLayer = (eventName: string, data: Record<string, any>) => {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    const win = window as any;
    win.dataLayer = win.dataLayer || [];
    win.dataLayer.push({
      event: eventName,
      ...data
    });
  }
};

const LazySections = lazy(() => import('../components/LazySections'));

const BRAND_ORANGE = '#f58742';
const CTA_TEAL = '#18a7a7';
const BG_CREAM = '#f8f5f0';     
const TEXT_DARK = '#222';
const TEXT_GRAY = '#555';
const BORDER_LIGHT = "rgba(0,0,0,0.05)";

const SYSTEM_FONT = Platform.select({
  web: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
  ios: "System",
  android: "Roboto",
  default: "System"
}) as string;

const Button = memo(({ title, onPress, variant = "primary", color = CTA_TEAL, style, textStyle, nativeID }: any) => (
  <TouchableOpacity
    nativeID={nativeID}
    style={[
      styles.buttonBase,
      variant === "primary" && { backgroundColor: color },
      variant === "primary" && styles.buttonShadow,
      style,
    ]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Text style={[styles.buttonText, variant === "primary" && { color: "#fff" }, textStyle]}>
      {title}
    </Text>
  </TouchableOpacity>
));

const TrustFooter = memo(({ isSmall }: { isSmall: boolean }) => (
  <View style={[styles.trustRow, isSmall && styles.trustRowMobile]}>
    <View style={styles.trustPill}>
      <Text style={styles.trustPillText}>🧑‍💻 Real industry experts, not AI</Text>
    </View>
    <View style={styles.trustPill}>
      <Text style={styles.trustPillText}>🎯 Practice with your target JD</Text>
    </View>
    <View style={styles.trustPill}>
      <Text style={styles.trustPillText}>📝 Actionable human feedback</Text>
    </View>
  </View>
));

export default function LandingPage() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isSmall = width < 900;
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
    pushToDataLayer("lp_visit", { role: "homepage", page_title: "CrackJobs Homepage" });
  }, []);

  if (Platform.OS === 'android') return <Redirect href="/auth/sign-in" />;

  // Enhanced JSON-LD Structured Data - Explicitly highlighting the 4 profiles
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://crackjobs.com/#website",
        "url": "https://crackjobs.com/",
        "name": "CrackJobs - Product Management, Data & HR Mock Interviews",
        "alternateName": "CrackJobs Mock Interview Platform",
        "description": "Practice interviews with real human experts. Prepare for Product Management, Data Science, Data Analytics, and HR roles using your target Job Description.",
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
        "description": "Mock interview platform connecting job seekers with human experts from top tech companies for targeted PM, Data Science, Data Analytics, and HR preparation.",
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
        "description": "Mock interviews with real human experts. Get actionable feedback and practice with your target JD for PM, DS, DA, and HR roles.",
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
        <title>CrackJobs | Product Management, Data & HR Mock Interviews</title>
        <meta name="title" content="CrackJobs | Product Management, Data & HR Mock Interviews" />
        <meta name="description" content="Land your dream job with realistic mock interviews. Practice with real industry experts in Product Management, Data Science, Data Analytics, and HR. Get actionable feedback and eliminate interview anxiety." />
        <meta name="keywords" content="mock interviews, product management interview, data analytics interview, data science interview, human resources interview, HR interview, human feedback, JD interview practice" />
        
        <link rel="canonical" href="https://crackjobs.com/" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://crackjobs.com/" />
        <meta property="og:title" content="CrackJobs | Realistic Mock Interviews with Human Experts" />
        <meta property="og:description" content="Practice interviews with real human experts. Paste your JD, get actionable feedback, and ace your next PM, Data, or HR interview." />
        <meta property="og:image" content="https://crackjobs.com/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <style type="text/css">{`
          * { box-sizing: border-box; }
          html, body { margin: 0; padding: 0; height: 100%; }
          body { font-family: ${SYSTEM_FONT}; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; background-color: ${BG_CREAM}; }
          a { color: inherit; text-decoration: none; }
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

        {/* ===== HERO (Matched to Landing Page) ===== */}
        <View style={styles.heroSection}>
          <View style={[styles.heroInner, isSmall && styles.heroInnerMobile]}>
            <Text style={[styles.h1, isSmall && styles.h1Mobile]}>
              Land your dream job{"\n"}
              <Text style={{ color: CTA_TEAL }}>with realistic interview practice</Text>
            </Text>
            
            <Text style={[styles.subheadline, isSmall && styles.subheadlineMobile]}>
              Book a live mock interview based on your actual job description or target specific weaknesses. Get structured feedback from real human hiring managers, eliminate your blind spots, and ace the real thing.
            </Text>

            <View style={[styles.ctaRow, isSmall && { flexDirection: "column" }]}>
              <Button
                nativeID="btn-home-hero-cta"
                title="Book Your Mock Interview"
                onPress={() => {
                  pushToDataLayer("lp_hero_cta_click", { role_viewed: "homepage" });
                  router.push('/mentors');
                }}
                style={[styles.ctaBig, isSmall && { width: "100%" }]}
                textStyle={{ fontSize: 18 }}
              />
            </View>

            <TrustFooter isSmall={isSmall} />
          </View>
        </View>

        {/* Lazy Loaded Sections */}
        {isReady && (
          <Suspense fallback={<ActivityIndicator size="large" color={BRAND_ORANGE} style={{ marginTop: 100 }} />}>
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
  buttonBase: { borderRadius: 12, alignItems: "center", justifyContent: "center", paddingVertical: 18, paddingHorizontal: 36 },
  buttonShadow: { shadowOpacity: 0.3, shadowRadius: 10, shadowColor: CTA_TEAL, shadowOffset: { width: 0, height: 4 } },
  buttonText: { fontFamily: SYSTEM_FONT, fontSize: 16, fontWeight: "800", letterSpacing: 0.5, textAlign: "center" },
  heroSection: { maxWidth: 1000, width: "100%", alignSelf: "center", paddingHorizontal: 24, paddingTop: 40, paddingBottom: 30 },
  heroInner: { backgroundColor: "#fff", borderRadius: 24, padding: 48, paddingBottom: 48, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, borderWidth: 1, borderColor: BORDER_LIGHT, alignItems: "center" },
  heroInnerMobile: { padding: 24, paddingBottom: 32 },
  h1: { fontFamily: SYSTEM_FONT, fontWeight: "800", fontSize: 46, color: BRAND_ORANGE, lineHeight: 54, marginBottom: 16, textAlign: "center" },
  h1Mobile: { fontSize: 34, lineHeight: 42, marginBottom: 12 },
  subheadline: { fontFamily: SYSTEM_FONT, fontSize: 18, color: TEXT_GRAY, textAlign: "center", maxWidth: 700, lineHeight: 28, marginBottom: 32 },
  subheadlineMobile: { fontSize: 16, lineHeight: 24, marginBottom: 24 },
  ctaRow: { flexDirection: "row", gap: 12, width: "100%", justifyContent: "center", marginBottom: 32 },
  ctaBig: { minWidth: 280 },
  trustRow: { flexDirection: "row", gap: 16, justifyContent: "center", flexWrap: "wrap" },
  trustRowMobile: { flexDirection: "column", gap: 10, alignItems: "stretch", width: "100%" },
  trustPill: { backgroundColor: "#F0FDFA", paddingVertical: 10, paddingHorizontal: 16, borderRadius: 100, borderWidth: 1, borderColor: "#CCFBF1", alignItems: "center" },
  trustPillText: { fontFamily: SYSTEM_FONT, fontSize: 14, fontWeight: "700", color: "#0F766E" },
});