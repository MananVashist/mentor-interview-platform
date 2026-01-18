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
import { BrandHeader } from '@/lib/BrandHeader';

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
    { emoji: '📝', title: 'Pick Your Track', desc: 'Choose your domain and the specific interview topic you want to practice' },
    { emoji: '👨‍💼', title: 'Book a Mentor', desc: 'Select from verified experts at top companies' },
    { emoji: '🎯', title: 'Practice & Get Feedback', desc: 'Realistic 55-min session with structured evaluation and recording' },
  ];

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionKicker}>HOW IT WORKS</Text>
      <Text style={styles.sectionTitle} nativeID="section-title">
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

export default function LandingPage() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (Platform.OS === 'android') return <Redirect href="/auth/sign-in" />;

  return (
    <>
      {/* 🔥 COMPREHENSIVE SEO - HARDCODED FOR MAXIMUM INDEXING */}
      <Head>
        {/* Essential Meta Tags */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        
        {/* Primary SEO Tags */}
        <title>CrackJobs | Anonymous Mock Interviews with Real Professionals</title>
        <meta name="description" content="Practice interview topics anonymously with fully vetted expert mentors across Product Management, Data Analytics, Data Science and HR. Get structured feedback and ace your next interview." />
        <meta name="keywords" content="mock interview, interview preparation, interview practice, anonymous interview, product management interview, data analytics interview, data science interview, HR interview, FAANG interview prep, interview mentors" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://crackjobs.com/" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://crackjobs.com/" />
        <meta property="og:site_name" content="CrackJobs" />
        <meta property="og:title" content="CrackJobs | Anonymous Mock Interviews with Real Professionals" />
        <meta property="og:description" content="Practice interview topics anonymously with fully vetted expert mentors. Get structured feedback and ace your next interview at Google, Amazon, Meta." />
        <meta property="og:image" content="https://crackjobs.com/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="CrackJobs - Anonymous Mock Interviews" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@crackjobs" />
        <meta name="twitter:creator" content="@crackjobs" />
        <meta name="twitter:title" content="CrackJobs | Anonymous Mock Interviews" />
        <meta name="twitter:description" content="Practice interviews with expert mentors from Google, Amazon, Meta. Get feedback and land your dream job." />
        <meta name="twitter:image" content="https://crackjobs.com/og-image.png" />
        <meta name="twitter:image:alt" content="CrackJobs Mock Interview Platform" />
        
        {/* Additional SEO Tags */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="3 days" />
        <meta name="author" content="CrackJobs" />
        
        {/* Geo Tags */}
        <meta name="geo.region" content="IN" />
        <meta name="geo.placename" content="India" />
        
        {/* App Links */}
        <meta property="al:android:url" content="crackjobs://home" />
        <meta property="al:android:package" content="com.crackjobs.app" />
        <meta property="al:android:app_name" content="CrackJobs" />
        
        {/* 🔥 COMPREHENSIVE STRUCTURED DATA */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": "https://crackjobs.com/#website",
                  "url": "https://crackjobs.com/",
                  "name": "CrackJobs",
                  "description": "Anonymous mock interviews with expert mentors from top companies",
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
                  "url": "https://crackjobs.com",
                  "logo": {
                    "@type": "ImageObject",
                    "@id": "https://crackjobs.com/#logo",
                    "url": "https://crackjobs.com/logo.png",
                    "contentUrl": "https://crackjobs.com/logo.png",
                    "caption": "CrackJobs"
                  },
                  "image": {
                    "@id": "https://crackjobs.com/#logo"
                  },
                  "description": "Anonymous mock interview platform connecting job seekers with expert mentors",
                  "foundingDate": "2024",
                  "sameAs": [
                    "https://www.linkedin.com/company/crackjobs",
                    "https://twitter.com/crackjobs"
                  ],
                  "contactPoint": {
                    "@type": "ContactPoint",
                    "contactType": "Customer Support",
                    "url": "https://crackjobs.com/contact",
                    "email": "support@crackjobs.com"
                  }
                },
                {
                  "@type": "WebPage",
                  "@id": "https://crackjobs.com/#webpage",
                  "url": "https://crackjobs.com/",
                  "name": "CrackJobs | Anonymous Mock Interviews with Real Professionals",
                  "isPartOf": {
                    "@id": "https://crackjobs.com/#website"
                  },
                  "about": {
                    "@id": "https://crackjobs.com/#organization"
                  },
                  "description": "Practice interview topics anonymously with fully vetted expert mentors across Product Management, Data Analytics, Data Science and HR.",
                  "inLanguage": "en-US"
                },
                {
                  "@type": "Service",
                  "@id": "https://crackjobs.com/#service",
                  "serviceType": "Mock Interview Platform",
                  "provider": {
                    "@id": "https://crackjobs.com/#organization"
                  },
                  "name": "Anonymous Mock Interviews",
                  "description": "Professional 1:1 mock interview sessions with industry experts including detailed feedback and session recording",
                  "areaServed": "IN",
                  "availableChannel": {
                    "@type": "ServiceChannel",
                    "serviceUrl": "https://crackjobs.com/auth/sign-up",
                    "servicePhone": "+91-XXXXXXXXXX"
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
                  "@id": "https://crackjobs.com/#interviewtracks",
                  "name": "Interview Practice Tracks",
                  "description": "Available interview preparation tracks",
                  "itemListElement": [
                    {
                      "@type": "ListItem",
                      "position": 1,
                      "item": {
                        "@type": "Course",
                        "@id": "https://crackjobs.com/interviews/product-management#course",
                        "name": "Product Management Interview Prep",
                        "description": "Product sense, execution, strategy, technical design and leadership",
                        "url": "https://crackjobs.com/interviews/product-management",
                        "provider": {
                          "@id": "https://crackjobs.com/#organization"
                        }
                      }
                    },
                    {
                      "@type": "ListItem",
                      "position": 2,
                      "item": {
                        "@type": "Course",
                        "@id": "https://crackjobs.com/interviews/data-analytics#course",
                        "name": "Data Analytics Interview Prep",
                        "description": "SQL, data visualization, statistical analysis, and business insights",
                        "url": "https://crackjobs.com/interviews/data-analytics",
                        "provider": {
                          "@id": "https://crackjobs.com/#organization"
                        }
                      }
                    },
                    {
                      "@type": "ListItem",
                      "position": 3,
                      "item": {
                        "@type": "Course",
                        "@id": "https://crackjobs.com/interviews/data-science#course",
                        "name": "Data Science Interview Prep",
                        "description": "Machine learning, statistics, Python, and model deployment",
                        "url": "https://crackjobs.com/interviews/data-science",
                        "provider": {
                          "@id": "https://crackjobs.com/#organization"
                        }
                      }
                    },
                    {
                      "@type": "ListItem",
                      "position": 4,
                      "item": {
                        "@type": "Course",
                        "@id": "https://crackjobs.com/interviews/hr#course",
                        "name": "HR Interview Prep",
                        "description": "Behavioral questions, situational responses, and cultural fit",
                        "url": "https://crackjobs.com/interviews/hr",
                        "provider": {
                          "@id": "https://crackjobs.com/#organization"
                        }
                      }
                    }
                  ]
                },
                {
                  "@type": "FAQPage",
                  "@id": "https://crackjobs.com/#faq",
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
                      "name": "How does the anonymous mock interview work?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "You book a 55-minute 1:1 session with a vetted mentor. During the session, you practice real interview questions while the mentor evaluates you. After the session, you receive structured feedback and a recording."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "What interview tracks are available?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "We offer mock interviews for Product Management, Data Analytics, Data Science, and HR roles. Each track covers specific skills and frameworks used in real FAANG interviews."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Who are the mentors?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Our mentors are experienced professionals from top tech companies including Google, Amazon, Meta, Microsoft, and other leading firms. All mentors are vetted and have real hiring experience."
                      }
                    }
                  ]
                }
              ]
            })
          }}
        />
        
        {/* Mobile Responsive Styles */}
        <style>{`
          body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, sans-serif; background-color: #f8f5f0; }
          #brand-eyes { display: flex !important; }
          #brand-text-container { font-size: 32px; }
          @media (max-width: 768px) {
            #brand-eyes { display: none !important; }
            #brand-header { margin-bottom: 8px !important; }
            #brand-text-container { transform: scale(0.7); transform-origin: left center; }
            #section-title { font-size: 28px !important; }
            #main-header { padding-top: 12px !important; padding-bottom: 12px !important; }
            #header-inner { padding-left: 16px !important; padding-right: 16px !important; }
            #nav-right { gap: 12px !important; }
            #section-container-hero { padding-top: 24px !important; padding-bottom: 40px !important; }
            #hero-centered { padding-top: 0px !important; padding-bottom: 20px !important; }
            #hero-title { font-size: 36px !important; line-height: 44px !important; }
            #hero-subtitle { font-size: 16px !important; line-height: 24px !important; }
            #hero-buttons { flex-direction: column !important; width: 100% !important; padding-left: 20px !important; padding-right: 20px !important; }
            #steps-grid { flex-direction: column !important; }
          }
        `}</style>
      </Head>

      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header} nativeID="main-header">
          <View style={styles.headerInner} nativeID="header-inner">
            <BrandHeader />
            <View style={styles.navRight} nativeID="nav-right">
              <TouchableOpacity onPress={() => router.push('/auth/sign-in')}>
                <Text style={styles.navLink}>Log in</Text>
              </TouchableOpacity>
              <Button
                title="Get Started"
                onPress={() => router.push('/auth/sign-up')}
                variant="primary"
                style={{ paddingVertical: 10, paddingHorizontal: 20 }}
              />
            </View>
          </View>
        </View>

        <View style={styles.sectionContainer} nativeID="section-container-hero">
          <View style={styles.heroCentered} nativeID="hero-centered">
            <View style={styles.heroTextContainer}>
              <View style={styles.pillBadge}>
                <Text style={styles.pillText}>🚀 NEW: PM Technical Track</Text>
              </View>
              {/* UPDATED TWO-COLOR TITLE */}
              <Text style={styles.heroTitle} nativeID="hero-title">
                <Text style={{ color: BRAND_ORANGE }}>Mock interviews with </Text>
                <Text style={{ color: CTA_TEAL }}>real expert mentors</Text>
              </Text>
              <Text style={styles.heroSubtitle} nativeID="hero-subtitle">
                Anonymous 1:1 mock interviews. Practice with vetted mentors from top companies.
              </Text>
            </View>
            <View style={styles.heroCTAContainer} nativeID="hero-buttons">
              <Button
                title="Start Practicing"
                onPress={() => router.push('/auth/sign-up')}
                variant="primary"
                style={styles.primaryCTA}
              />
              <Button
                title="Browse Mentors"
                onPress={() => router.push('/auth/sign-up')}
                variant="outline"
                style={styles.secondaryCTA}
              />
            </View>
          </View>
        </View>

        <HowItWorks />

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
  header: {
    backgroundColor: BG_CREAM,
    paddingTop: 30,
    paddingBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
    paddingLeft: 32,
    paddingRight: 32,
  },
  navRight: {
    flexDirection: 'row',
    gap: 24,
    alignItems: 'center',
  },
  navLink: {
    fontFamily: SYSTEM_FONT,
    fontSize: 15,
    fontWeight: '600',
    color: TEXT_DARK,
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