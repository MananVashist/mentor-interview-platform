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
    { emoji: '📝', title: 'Pick Your Track', desc: 'Choose your domain and the specific interview topic you want to practice' },
    { emoji: '👨‍💼', title: 'Book a Mentor', desc: 'Select from verified experts at top companies' },
    { emoji: '🎯', title: 'Practice & Get Feedback', desc: 'Realistic 55-min session with structured evaluation and recording' },
  ];

  return (
    <View style={styles.sectionContainer} nativeID="how-it-works">
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

  // Enhanced JSON-LD Structured Data with Navigation & Breadcrumbs
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://crackjobs.com/#website",
        "url": "https://crackjobs.com/",
        "name": "CrackJobs - Anonymous Mock Interviews with Expert Mentors",
        "alternateName": "CrackJobs Mock Interview Platform",
        "description": "Practice interviews anonymously with vetted expert mentors and crack interviews from Google, Amazon, Meta, Microsoft. Prepare for Product Management, Data Analytics, Data Science, and HR interviews.",
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
        "description": "Anonymous mock interview platform connecting job seekers with expert mentors from top tech companies for Product Management, Data Analytics, Data Science, and HR interview preparation.",
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
        "name": "CrackJobs |Mock Interviews with Real Experts",
        "isPartOf": {
          "@id": "https://crackjobs.com/#website"
        },
        "about": {
          "@id": "https://crackjobs.com/#organization"
        },
        "description": "Mock interviews with fully vetted expert mentors across Product Management, Data Analytics, Data Science and HR. Get detailed feedback and session recordings.",
        "inLanguage": "en-US",
        "primaryImageOfPage": {
          "@id": "https://crackjobs.com/#logo"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://crackjobs.com/#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://crackjobs.com/"
          }
        ]
      },
      {
        "@type": "SiteNavigationElement",
        "@id": "https://crackjobs.com/#navigation",
        "name": "Main Navigation",
        "about": {
          "@id": "https://crackjobs.com/#website"
        },
        "hasPart": [
          {
            "@type": "SiteNavigationElement",
            "name": "How It Works",
            "url": "https://crackjobs.com/#how-it-works",
            "description": "Learn how our anonymous mock interview process works"
          },
          {
            "@type": "SiteNavigationElement",
            "name": "Interview Tracks",
            "url": "https://crackjobs.com/#interview-tracks",
            "description": "Explore interview preparation tracks: PM, Data Analytics, Data Science, HR"
          },
          {
            "@type": "SiteNavigationElement",
            "name": "Product Management Interviews",
            "url": "https://crackjobs.com/interviews/product-management",
            "description": "Practice Product Management interviews with expert mentors"
          },
          {
            "@type": "SiteNavigationElement",
            "name": "Data Analytics Interviews",
            "url": "https://crackjobs.com/interviews/data-analytics",
            "description": "Practice Data Analytics interviews including SQL and case studies"
          },
          {
            "@type": "SiteNavigationElement",
            "name": "Data Science Interviews",
            "url": "https://crackjobs.com/interviews/data-science",
            "description": "Practice Data Science interviews covering ML and statistics"
          },
          {
            "@type": "SiteNavigationElement",
            "name": "HR Interviews",
            "url": "https://crackjobs.com/interviews/hr",
            "description": "Practice HR interviews covering Talent Acquisition to HRBP"
          },
          {
            "@type": "SiteNavigationElement",
            "name": "Why Choose Us",
            "url": "https://crackjobs.com/#why-choose-us",
            "description": "Discover the benefits of CrackJobs mock interviews"
          },
          {
            "@type": "SiteNavigationElement",
            "name": "Reviews",
            "url": "https://crackjobs.com/#reviews",
            "description": "Read testimonials from successful candidates"
          },
          {
            "@type": "SiteNavigationElement",
            "name": "FAQ",
            "url": "https://crackjobs.com/#faq",
            "description": "Frequently asked questions about our service"
          },
          {
            "@type": "SiteNavigationElement",
            "name": "Contact Us",
            "url": "https://crackjobs.com/contact",
            "description": "Get in touch with our support team"
          },
          {
            "@type": "SiteNavigationElement",
            "name": "Sign Up",
            "url": "https://crackjobs.com/auth/sign-up",
            "description": "Create your account and start practicing"
          }
        ]
      },
      {
        "@type": "Service",
        "@id": "https://crackjobs.com/#service",
        "serviceType": "Mock Interview Platform",
        "provider": {
          "@id": "https://crackjobs.com/#organization"
        },
        "name": "Anonymous Mock Interviews",
        "description": "Professional 1:1 mock interview sessions with industry experts. Includes detailed feedback, session recording and anonymous practice environment.",
        "areaServed": {
          "@type": "Country",
          "name": "India"
        },
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
          "lowPrice": "3000",
          "highPrice": "15000",
          "offerCount": "100",
          "availability": "https://schema.org/InStock",
          "url": "https://crackjobs.com/auth/sign-up"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Interview Preparation Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Bronze Tier Mock Interview",
                "description": "Professional mock interview with experienced mentors"
              },
              "price": "3000-6000",
              "priceCurrency": "INR"
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Silver Tier Mock Interview",
                "description": "Mock interview with senior mentors from top companies"
              },
              "price": "6000-9000",
              "priceCurrency": "INR"
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Gold Tier Mock Interview",
                "description": "Premium mock interview with senior leadership mentors from top companies"
              },
              "price": "9000-15000",
              "priceCurrency": "INR"
            }
          ]
        }
      },
      {
        "@type": "ItemList",
        "@id": "https://crackjobs.com/#interviewtracks",
        "name": "Interview Practice Tracks",
        "description": "Comprehensive interview preparation tracks covering different domains",
        "numberOfItems": 4,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "item": {
              "@type": "Course",
              "@id": "https://crackjobs.com/interviews/product-management#course",
              "name": "Product Management Interview Preparation",
              "description": "Master Product Management interviews: product sense, execution, strategy, technical design, leadership, and behavioral questions. Practice with PMs from Google, Meta, Amazon.",
              "url": "https://crackjobs.com/interviews/product-management",
              "provider": {
                "@id": "https://crackjobs.com/#organization"
              },
              "courseCode": "PM",
              "hasCourseInstance": {
                "@type": "CourseInstance",
                "courseMode": "online",
                "courseWorkload": "PT1H"
              }
            }
          },
          {
            "@type": "ListItem",
            "position": 2,
            "item": {
              "@type": "Course",
              "@id": "https://crackjobs.com/interviews/data-analytics#course",
              "name": "Data Analytics Interview Preparation",
              "description": "Excel in Data Analytics interviews: SQL queries, data visualization, statistical analysis, business insights, Excel modeling, and case studies.",
              "url": "https://crackjobs.com/interviews/data-analytics",
              "provider": {
                "@id": "https://crackjobs.com/#organization"
              },
              "courseCode": "DA",
              "hasCourseInstance": {
                "@type": "CourseInstance",
                "courseMode": "online",
                "courseWorkload": "PT1H"
              }
            }
          },
          {
            "@type": "ListItem",
            "position": 3,
            "item": {
              "@type": "Course",
              "@id": "https://crackjobs.com/interviews/data-science#course",
              "name": "Data Science Interview Preparation",
              "description": "Master Data Science interviews: machine learning algorithms, statistics, Python programming, model deployment, and practical ML case studies.",
              "url": "https://crackjobs.com/interviews/data-science",
              "provider": {
                "@id": "https://crackjobs.com/#organization"
              },
              "courseCode": "DS",
              "hasCourseInstance": {
                "@type": "CourseInstance",
                "courseMode": "online",
                "courseWorkload": "PT1H"
              }
            }
          },
          {
            "@type": "ListItem",
            "position": 4,
            "item": {
              "@type": "Course",
              "@id": "https://crackjobs.com/interviews/hr#course",
              "name": "HR Interview Preparation",
              "description": "Ace HR interviews: behavioral questions, situational responses, cultural fit assessment, and professional communication skills.",
              "url": "https://crackjobs.com/interviews/hr",
              "provider": {
                "@id": "https://crackjobs.com/#organization"
              },
              "courseCode": "HR",
              "hasCourseInstance": {
                "@type": "CourseInstance",
                "courseMode": "online",
                "courseWorkload": "PT1H"
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
            "name": "How does anonymous interviewing work at CrackJobs?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Your name, photo, and personal details are completely hidden. You are identified only by your professional title (e.g., 'Data Scientist at Uber'). Mentors see your role and resume (if you choose to upload it), nothing more. You can join the video meeting with your camera off for complete anonymity."
            }
          },
          {
            "@type": "Question",
            "name": "Are CrackJobs mentors verified?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, absolutely. Every mentor is manually vetted by our team. We verify employment history, LinkedIn profiles, and conduct comprehensive background checks to ensure they work at top companies like Google, Amazon, Meta, and Microsoft."
            }
          },
          {
            "@type": "Question",
            "name": "What happens during a CrackJobs mock interview session?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You book a 55-minute time slot with your chosen mentor. They conduct a realistic mock interview focused on your selected topic (Product Sense, SQL, Machine Learning, etc.). After the session, you receive structured evaluation feedback covering your strengths, improvement areas, and specific actionable recommendations. The entire session is recorded for your review."
            }
          },
          {
            "@type": "Question",
            "name": "Can I practice specific interview rounds?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Absolutely! Choose your interview track (PM, Data Analytics, Data Science, or HR) and then select the specific topic you want to practice - such as 'Product Thinking', 'SQL Queries', 'Machine Learning Fundamentals', or 'Behavioral Questions'. You can book multiple sessions for different topics."
            }
          },
          {
            "@type": "Question",
            "name": "What is CrackJobs refund policy?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We offer a full refund if the mentor does not show up for your scheduled session. Since we record all sessions, there's complete transparency. Your satisfaction is our priority."
            }
          },
          {
            "@type": "Question",
            "name": "How much do CrackJobs mock interviews cost?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We have three mentor tiers: Bronze (₹3,000-6,000), Silver (₹6,000-9,000), and Gold (₹9,000-15,000). Pricing varies based on mentor experience and company prestige. All sessions include detailed feedback and recording."
            }
          },
          {
            "@type": "Question",
            "name": "Which companies do CrackJobs mentors work at?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Our mentors work at top tech companies including Google, Amazon, Meta (Facebook), Microsoft, Adobe, Capgemini, and other leading firms. All mentors are verified professionals with proven interview expertise."
            }
          }
        ]
      }
    ]
  };

  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>CrackJobs | Anonymous Mock Interviews with Expert Mentors</title>
        <meta name="title" content="CrackJobs | Anonymous Mock Interviews with Expert Mentors" />
        <meta name="description" content="Practice interviews anonymously with vetted expert mentors. Prepare for Product Management, Data Analytics, Data Science, and HR interviews. Get detailed feedback and session recordings." />
        <meta name="keywords" content="mock interviews, interview preparation, product management interview, data analytics interview, data science interview, HR interview, anonymous interviews, Google interview prep, Amazon interview prep, Meta interview prep, FAANG interviews, tech interview practice" />
        <meta name="author" content="CrackJobs" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://crackjobs.com/" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://crackjobs.com/" />
        <meta property="og:title" content="CrackJobs | Anonymous Mock Interviews with Expert Mentors" />
        <meta property="og:description" content="Practice interviews anonymously with vetted expert mentors. Get detailed feedback and ace your next interview." />
        <meta property="og:image" content="https://crackjobs.com/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="CrackJobs" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://crackjobs.com/" />
        <meta property="twitter:title" content="CrackJobs | Anonymous Mock Interviews with Expert Mentors" />
        <meta property="twitter:description" content="Practice interviews anonymously with vetted expert mentors from top tech companies. Prepare for PM, Data Analytics, Data Science, and HR roles." />
        <meta property="twitter:image" content="https://crackjobs.com/og-image.png" />
        
        {/* Additional SEO Tags */}
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        
        {/* Favicon */}
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Alternate for language/region targeting */}
        <link rel="alternate" hrefLang="en" href="https://crackjobs.com/" />
        <link rel="alternate" hrefLang="en-IN" href="https://crackjobs.com/" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Mobile Optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="CrackJobs" />
        
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

      {/* Structured Data - Placed in body for proper rendering */}
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
        {/* Header with Navigation */}
        <Header showGetStarted={true} />

        {/* Hero Section */}
        <View style={styles.sectionContainer} nativeID="section-container-hero">
          <View style={styles.heroCentered} nativeID="hero-centered">
            <View style={styles.heroTextContainer}>
              <View style={styles.pillBadge}>
                <Text style={styles.pillText}>🚀 NEW: PM Technical Track</Text>
              </View>
              <Text style={styles.heroTitle} nativeID="hero-title">
                <Text style={{ color: BRAND_ORANGE }}>Mock interviews with </Text>
                <Text style={{ color: CTA_TEAL }}>real expert mentors</Text>
              </Text>
              <Text style={styles.heroSubtitle} nativeID="hero-subtitle">
                Anonymous 1:1 mock interviews. Vetted mentors from top companies for Product Management, Data / Business Analytics, Data Science and HR.
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