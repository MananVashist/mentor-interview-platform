import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
  ScrollView,
  Animated,
} from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import Head from 'expo-router/head';
import { SplashScreen } from '../components/SplashScreen';
import { injectMultipleSchemas } from '@/lib/structured-data';
import { Footer } from '@/components/Footer'; // Ensure this import is correct

const CTA_TEAL = '#18a7a7';
const FONT_WEIGHT_BOLD = '600'; 

// ---- Types & small presentational component (no change) ----
type Role = {
  icon: string;
  title: string;
  desc: string;
};

function RoleCard({ role, isSmall }: { role: Role; isSmall: boolean }) {
  const [hovered, setHovered] = React.useState(false);

  const webHoverProps =
    Platform.OS === 'web'
      ? {
          onMouseEnter: () => setHovered(true),
          onMouseLeave: () => setHovered(false),
        }
      : {};

  return (
    <View
      {...(webHoverProps as any)}
      style={[
        styles.roleCard,
        isSmall && styles.roleCardMobile,
        hovered && styles.roleCardHover,
      ]}
    >
      <Text style={styles.roleIcon} accessibilityLabel={role.title}>
        {role.icon}
      </Text>
      <Text style={styles.roleTitle}>{role.title}</Text>
      <Text style={styles.roleDesc}>{role.desc}</Text>
    </View>
  );
}

// Custom Hook to manage SEO/Structured Data (Cleaner Abstraction)
const useStructuredData = () => {
    useEffect(() => {
        if (Platform.OS === 'web') {
            const orgSchema = {
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: 'CrackJobs',
                url: 'https://crackjobs.com',
                logo: 'https://crackjobs.com/logo.png',
                sameAs: [
                    'https://twitter.com/crackjobs',
                    'https://linkedin.com/company/crackjobs',
                ],
            };
            // ... (Other schemas remain the same)
            const websiteSchema = { /* ... */ };
            const serviceSchema = { /* ... */ };
            const faqSchema = { /* ... */ };

            const cleanup = injectMultipleSchemas([orgSchema, websiteSchema, serviceSchema, faqSchema]);
            return () => cleanup && cleanup();
        }
    }, []);
}


export default function LandingPage() {
  const [showSplash, setShowSplash] = useState(Platform.OS !== 'web');
  
  useStructuredData(); 

  // --- EYE ANIMATION LOGIC (RE-INTRODUCED) ---
  const leftEyeX = React.useRef(new Animated.Value(0)).current;
  const leftEyeY = React.useRef(new Animated.Value(0)).current;
  const rightEyeX = React.useRef(new Animated.Value(0)).current;
  const rightEyeY = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateEyes = () => {
      const randomMove = () => {
        const maxMove = 10;
        const makeTwitch = (xVal: Animated.Value, yVal: Animated.Value) => {
          const toX = (Math.random() - 0.5) * maxMove;
          const toY = (Math.random() - 0.5) * maxMove;
          return [
            Animated.timing(xVal, {
              toValue: toX,
              duration: 70,
              useNativeDriver: true,
            }),
            Animated.timing(yVal, {
              toValue: toY,
              duration: 70,
              useNativeDriver: true,
            }),
          ];
        };
        Animated.parallel([
          ...makeTwitch(leftEyeX, leftEyeY),
          ...makeTwitch(rightEyeX, rightEyeY),
        ]).start();
      };
      randomMove();
      const interval = setInterval(randomMove, 120);
      return () => clearInterval(interval);
    };
    return animateEyes();
  }, [leftEyeX, leftEyeY, rightEyeX, rightEyeY]);
  // --- END EYE ANIMATION LOGIC ---


  // 🔁 Native app: show splash then redirect to sign-in (no landing on app)
  useEffect(() => {
    if (Platform.OS !== 'web') {
      const timer = setTimeout(() => setShowSplash(false), 2000); 
      return () => clearTimeout(timer);
    }
  }, []);

  if (Platform.OS !== 'web' && showSplash) return <SplashScreen />;
  if (Platform.OS !== 'web') return <Redirect href="/auth/sign-in" />;

  const router = useRouter();
  const { width } = useWindowDimensions();
  const isSmall = width < 900;

  // 🎯 Launch roles (4 categories only)
  const roles: Role[] = [
    {
      icon: '🚀',
      title: 'Product Manager',
      desc:
        'Product sense, execution, metrics, and strategy.',
    },
    {
      icon: '📊',
      title: 'Data Analyst / Business Analyst',
      desc: 'SQL, case studies, and business problem-solving.',
    },
    {
      icon: '🤖',
      title: 'Data Scientist / ML Engineer',
      desc: 'Modeling, experimentation, and ML system design.',
    },
    {
      icon: '👥',
      title: 'HR / Talent Acquisition',
      desc: 'Behavioral, culture, and hiring alignment.',
    },
  ];

  return (
    <>
      <Head>
        <title>
          Mock Interviews for Product Manager, Data Analyst, Data Scientist &
          HR | CrackJobs
        </title>
        <meta
          name="description"
          content="CrackJobs offers anonymous, role-aligned mock interviews with industry mentors for Product Managers, Data Analysts, Data Scientists / ML Engineers, and HR / Talent Acquisition. Book 2 sessions, practice real interview rounds, and get detailed feedback with safe payments and refund protection."
        />
        {/* ... other meta tags remain ... */}
      </Head>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header} accessibilityRole="banner">
          <View
            style={[styles.headerInner, isSmall && styles.headerInnerMobile]}
          >
            <View style={[styles.brand, isSmall && styles.brandMobile]}>
              {!isSmall && ( // Re-integrated eyes wrapper
                <View style={styles.eyesWrapper}>
                  <View style={styles.eye}>
                    <Animated.View
                      style={[
                        styles.pupil,
                        {
                          transform: [
                            { translateX: leftEyeX },
                            { translateY: leftEyeY },
                          ],
                        },
                      ]}
                    />
                  </View>
                  <View style={styles.eye}>
                    <Animated.View
                      style={[
                        styles.pupil,
                        {
                          transform: [
                            { translateX: rightEyeX },
                            { translateY: rightEyeY },
                          ],
                        },
                      ]}
                    />
                  </View>
                </View>
              )}
              <View>
                {/* Brand wordmark */}
                <Text
                  style={[
                    styles.logoMain,
                    isSmall && styles.logoMainMobile,
                  ]}
                >
                  <Text style={styles.logoMainCrack}>Crack</Text>
                  <Text style={styles.logoMainJobs}>Jobs</Text>
                </Text>
                <Text
                  style={[
                    styles.logoTagline,
                    isSmall && styles.logoTaglineMobile,
                  ]}
                >
                  Mad skills! Dream job!
                </Text>
              </View>
            </View>

            {/* Navigation and CTA Buttons */}
            <View
              style={[
                styles.navRight,
                isSmall && styles.navRightMobile,
              ]}
              accessibilityRole="navigation"
            >
              <TouchableOpacity
                style={[
                  styles.btn,
                  styles.btnSecondary,
                  isSmall && styles.btnMobile,
                ]}
                onPress={() => router.push('/auth/sign-in')}
              >
                <Text
                  style={[styles.btnText, isSmall && styles.btnTextMobile]}
                >
                  LOGIN
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.btn,
                  styles.btnPrimary,
                  isSmall && styles.btnMobile,
                ]}
                onPress={() => router.push('/auth/sign-up')}
              >
                <Text
                  style={[styles.btnText, isSmall && styles.btnTextMobile]}
                >
                  SIGN UP
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Hero */}
        <View style={styles.heroSection} accessibilityRole="main">
          <View style={[styles.heroCard, isSmall && styles.heroCardMobile]}>
            <View style={styles.heroContent}>
              <Text
                style={[
                  styles.heroKicker,
                  isSmall && styles.heroKickerMobile,
                ]}
              >
                Anonymous mock interviews.
              </Text>
              <Text
                style={[
                  styles.heroTitle,
                  isSmall && styles.heroTitleMobile,
                ]}
              >
                Practice makes perfect!
              </Text>
              <Text
                style={[
                  styles.heroSubtitle,
                  isSmall && styles.heroSubtitleMobile,
                ]}
              >
                1:1 interview practice with real professionals
              </Text>

             
            </View>
            <Image
              source={require('../assets/crackjobs-hero.png')}
              style={[styles.mascot, isSmall && styles.mascotMobile]}
              resizeMode="contain"
              accessibilityLabel="CrackJobs mascot celebrating a job offer"
            />
          </View>
        </View>

        {/* --- REDESIGNED SECTIONS --- */}

        {/* Role Cards (More visual, condensed text) */}
        <View
          style={[styles.rolesSection, isSmall && styles.rolesSectionMobile]}
        >
          <Text style={styles.sectionKicker}>Choose your track</Text>
          <Text
            style={[
              styles.sectionTitle,
              isSmall && styles.sectionTitleMobile,
            ]}
          >
            Role-based interviews
          </Text>
          <View style={[styles.rolesGrid, isSmall && styles.rolesGridMobile]}>
            {roles.map((role) => (
              <RoleCard key={role.title} role={role} isSmall={isSmall} />
            ))}
          </View>
        </View>

        {/* Features (Icon-driven, less verbose) */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionKicker}>Why candidates use CrackJobs</Text>
          <Text
            style={[
              styles.sectionTitle,
              isSmall && styles.sectionTitleMobile,
            ]}
          >
            Stay protected
          </Text>
          <View
            style={[
              styles.featuresGrid,
              isSmall && styles.featuresGridMobile,
            ]}
          >
            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>🛡️</Text> {/* Simplified icon */}
              <Text style={styles.featureTitle}>Anonymous Process</Text>
              <Text style={styles.featureBody}>
                Nobody can see your identity or company information. **No awkward pings.**
              </Text>
            </View>
            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>💸</Text> {/* Simplified icon */}
              <Text style={styles.featureTitle}>Protected Payments</Text>
              <Text style={styles.featureBody}>
                Pay once, and your payment is held securely. You&apos;re protected with a full refund if the mentor cancels or doesn&apos;t show.
              </Text>
            </View>
            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>👤</Text> {/* Simplified icon */}
              <Text style={styles.featureTitle}>Real People. Real Interviewers</Text>
              <Text style={styles.featureBody}>
                Mentors are vetted by the platform before being shown to candidates. No AI, No BS. 
              </Text>
            </View>
          </View>
        </View>

        {/* How it works (Punchy, less body text) */}
        <View style={styles.howSection}>
          <Text
            style={[
              styles.sectionTitle,
              isSmall && styles.sectionTitleMobile,
            ]}
          >
            How it works
          </Text>
          <View
            style={[
              styles.stepsGrid,
              isSmall && styles.stepsGridMobile,
            ]}
          >
            <View style={styles.stepCard}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>1</Text>
              </View>
              <Text style={styles.stepTitle}>
                Book Your Mentor
              </Text>
              <Text style={styles.stepBody}>
                Choose a mentor, select 2 time slots, and complete payment in a single flow.
              </Text>
            </View>
            <View style={styles.stepCard}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>2</Text>
              </View>
              <Text style={styles.stepTitle}>
                Attend 2 Rounds
              </Text>
              <Text style={styles.stepBody}>
                Join a video meeting and experience a real interview environment.
              </Text>
            </View>
            <View style={styles.stepCard}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>3</Text>
              </View>
              <Text style={styles.stepTitle}>Get Detailed Feedback</Text>
              <Text style={styles.stepBody}>
                Receive written scores and actionable next steps.
              </Text>
            </View>
          </View>

          <View style={styles.howCtaWrapper}>
            <TouchableOpacity
              style={styles.howCta}
              onPress={() => router.push('/auth-sign-up')}
            >
              <Text style={styles.howCtaText}>Get started</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <Footer />
      </ScrollView>
    </>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f5f0' },
  scrollContent: { minHeight: '100%' },

  header: { backgroundColor: '#f8f5f0', paddingVertical: 16 },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 1400,
    width: '100%',
    marginHorizontal: 'auto',
    paddingHorizontal: 40,
  },
  headerInnerMobile: { paddingHorizontal: 12, justifyContent: 'space-between' },

  eyesWrapper: { flexDirection: 'row', gap: 8, marginRight: 12 },
  eye: {
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pupil: { width: 16, height: 16, backgroundColor: '#333', borderRadius: 8 },

  brand: { flexDirection: 'row', alignItems: 'center' },
  brandMobile: {},

  logoMain: {
    fontSize: 44,
    fontWeight: FONT_WEIGHT_BOLD,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  logoMainCrack: {
    color: '#333',
    ...(Platform.OS === 'web' && { WebkitTextStroke: '0.5px #333' }),
  },
  logoMainJobs: {
    color: CTA_TEAL,
    ...(Platform.OS === 'web' && { WebkitTextStroke: `0.5px ${CTA_TEAL}` }),
  },
  logoMainMobile: { fontSize: 24 },

  // lighter tagline
  logoTagline: {
    fontSize: 18,
    fontWeight: '700',
    color: CTA_TEAL,
    marginTop: -2,
    opacity: 0.7,
    textShadowColor: 'rgba(0,0,0,0.05)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
    ...(Platform.OS === 'web' && { WebkitTextStroke: `0.3px ${CTA_TEAL}` }),
  },
  logoTaglineMobile: { fontSize: 13 },

  navRight: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  navRightMobile: { gap: 8 },

  btn: {
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 30,
    borderWidth: 1, // Reduced border weight
  },
  btnPrimary: { backgroundColor: CTA_TEAL, borderColor: CTA_TEAL },
  btnSecondary: { backgroundColor: 'transparent', borderColor: '#333' }, // Cleaner border
  btnMobile: { paddingHorizontal: 18, paddingVertical: 8 },
  btnText: { fontWeight: '700', fontSize: 14, letterSpacing: 1 },
  btnTextMobile: { fontSize: 11, letterSpacing: 0.5 },

  // Hero
  heroSection: {
    paddingHorizontal: 40,
    paddingVertical: 10,
    maxWidth: 1400,
    width: '100%',
    marginHorizontal: 'auto',
  },
  heroCard: {
    backgroundColor: '#d3d3d3',
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#000',
    padding: 38,
    paddingRight: 100, // Adjusted padding to give space for mascot
    position: 'relative',
    overflow: 'hidden', // Crucial for cropping the mascot
    flexDirection: 'row',
    alignItems: 'flex-end', // Aligns content to the bottom
    gap: 24,
  },
  heroCardMobile: {
    padding: 28,
    flexDirection: 'column',
    alignItems: 'center',
    paddingRight: 28, // Reset padding for mobile
  },
  heroContent: { flex: 1, maxWidth: 650, zIndex: 1 },

  heroKicker: {
    fontSize: 14,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#333',
    marginBottom: 10,
  },
  heroKickerMobile: { textAlign: 'center' },

  heroTitle: {
    fontSize: 40,
    fontWeight: FONT_WEIGHT_BOLD,
    color: '#f58742',
    marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    ...(Platform.OS === 'web' && { WebkitTextStroke: '0.5px #f58742' }),
  },
  heroTitleMobile: { fontSize: 30, textAlign: 'center' },

  heroSubtitle: { fontSize: 16, color: '#333', lineHeight: 26 },
  heroSubtitleMobile: { fontSize: 14, lineHeight: 22, textAlign: 'center' },

  heroCtas: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  primaryCta: {
    backgroundColor: CTA_TEAL,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
    shadowColor: CTA_TEAL,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryCtaMobile: { width: '100%', alignItems: 'center' },
  primaryCtaText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  primaryCtaTextMobile: { fontSize: 13 },

  mascot: {
    width: 200, // Adjusted width
    height: 200, // Adjusted height
    position: 'absolute', // Position absolutely
    bottom: -10, // Align to bottom
    right: 200, // Align to right
    zIndex: 0, // Ensure it's behind text if needed, but in this layout it shouldn't overlap
  },
  mascotMobile: {
    width: 210,
    height: 210,
    position: 'relative', // Mobile keeps relative positioning
    marginTop: 24,
        right: 0, // Align to right
        bottom: -40, // Align to bottom
  },

  // Section headings
  sectionKicker: {
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#888',
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: FONT_WEIGHT_BOLD,
    color: '#f58742',
    marginBottom: 18,
  },
  sectionTitleMobile: { fontSize: 20, textAlign: 'left' },

  // Roles
  rolesSection: {
    maxWidth: 1400,
    width: '100%',
    marginHorizontal: 'auto',
    paddingHorizontal: 40,
    paddingVertical: 24,
  },
  rolesSectionMobile: { paddingHorizontal: 20 },
  rolesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  rolesGridMobile: {
    flexDirection: 'column',
  },
  roleCard: {
    flex: 1,
    minWidth: 240,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f1f1',
    transitionDuration: Platform.OS === 'web' ? '150ms' : undefined,
  } as any,
  roleCardHover: {
    transform: [{ translateY: -4 }, { scale: 1.02 }],
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 5,
  },
  roleCardMobile: {
    minWidth: '100%',
  },
  roleIcon: { fontSize: 60, marginBottom: 6 },
  roleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  roleDesc: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },

  // Features
  featuresSection: {
    maxWidth: 1400,
    width: '100%',
    marginHorizontal: 'auto',
    paddingHorizontal: 40,
    paddingVertical: 30,
  },
  featuresGrid: {
    flexDirection: 'row',
    gap: 20,
  },
  featuresGridMobile: {
    flexDirection: 'column',
    paddingHorizontal: 0,
  },
  featureCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#eee',
  },
  featureIcon: {
    fontSize: 60,
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
    color: '#222',
  },
  featureBody: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
  },

  // How it works
  howSection: {
    maxWidth: 1400,
    width: '100%',
    marginHorizontal: 'auto',
    paddingHorizontal: 40,
    paddingVertical: 34,
    borderTopWidth: 1,
    borderTopColor: '#e4ded5',
    borderBottomWidth: 1,
    borderBottomColor: '#e4ded5',
    backgroundColor: '#fdfaf5',
  },
  stepsGrid: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 8,
  },
  stepsGridMobile: {
    flexDirection: 'column',
  },
  stepCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#eee',
  },
  stepBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: CTA_TEAL,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  stepBadgeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
    color: '#222',
  },
  stepBody: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
  },
  howCtaWrapper: {
    marginTop: 24,
    alignItems: 'flex-start',
  },
  howCta: {
    backgroundColor: '#111',
    paddingHorizontal: 26,
    paddingVertical: 12,
    borderRadius: 999,
  },
  howCtaText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 1,
  },
});