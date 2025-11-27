import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
  Animated,
  ScrollView,
} from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import Head from 'expo-router/head'; 
import { SplashScreen } from '../components/SplashScreen';
import { Footer } from '../components/Footer';
import { injectMultipleSchemas } from '@/lib/structured-data';

const CTA_TEAL = '#18a7a7';
const MAX_CONTENT_WIDTH = 1200; 

export default function LandingPage() {
  const [showSplash, setShowSplash] = useState(Platform.OS !== 'web');
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isSmall = width < 900;

  // ?? SEO: JSON-LD 
  useEffect(() => {
    if (Platform.OS === 'web') {
      const orgSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "CrackJobs",
        "url": "https://crackjobs.com",
        "slogan": "Don't leave your dream job to luck.",
        "description": "Democratizing interview prep with anonymous, vetted mock interviews.",
        "logo": "https://crackjobs.com/logo.png"
      };
      const cleanup = injectMultipleSchemas([orgSchema]);
      return () => cleanup && cleanup();
    }
  }, []);

  // Splash Logic
  useEffect(() => {
    if (Platform.OS !== 'web') {
      const timer = setTimeout(() => setShowSplash(false), 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Animation Refs
  const leftEyeX = React.useRef(new Animated.Value(0)).current;
  const leftEyeY = React.useRef(new Animated.Value(0)).current;
  const rightEyeX = React.useRef(new Animated.Value(0)).current;
  const rightEyeY = React.useRef(new Animated.Value(0)).current;

  // Eye Animation
  useEffect(() => {
    const animateEyes = () => {
      const randomMove = () => {
        const maxMove = 10;
        const makeTwitch = (xVal: Animated.Value, yVal: Animated.Value) => {
          const toX = (Math.random() - 0.5) * maxMove;
          const toY = (Math.random() - 0.5) * maxMove;
          return [
            Animated.timing(xVal, { toValue: toX, duration: 70, useNativeDriver: Platform.OS == 'web' }),
            Animated.timing(yVal, { toValue: toY, duration: 70, useNativeDriver: Platform.OS == 'web' }),
          ];
        };
        Animated.parallel([...makeTwitch(leftEyeX, leftEyeY), ...makeTwitch(rightEyeX, rightEyeY)]).start();
      };
      randomMove();
      const interval = setInterval(randomMove, 2); 
      return () => clearInterval(interval);
    };
    return animateEyes();
  }, [leftEyeX, leftEyeY, rightEyeX, rightEyeY]);

  if (Platform.OS !== 'web' && showSplash) return <SplashScreen />;
  // 🟢 MODIFIED: After splash finishes, Native App goes to Sign In.
  if (Platform.OS !== 'web') {
    return <Redirect href="/auth/sign-in" />;
  }
  // Roles Data
  const roles = [
    { icon: '??', title: 'Product Management', desc: 'Master Product Sense, Execution, and Strategy with FAANG PMs.' },
    { icon: '??', title: 'Data Analyst / BA', desc: 'Sharpen your SQL, Tableau, and Business Case skills.' },
    { icon: '??', title: 'Data Scientist / ML', desc: 'Deep dive into Modeling, System Design, and Python.' },
    { icon: '??', title: 'HR & Behavioral', desc: 'Perfect the STAR method and salary negotiation strategies.' },
  ];

  // Features Data
  const features = [
    { 
      icon: '???', 
      title: 'Anonymous & Private', 
      desc: 'Practice without fear of judgment. Our anonymous booking system protects your identity, ensuring unbiased feedback solely on your skills.' 
    },
    { 
      icon: '?', 
      title: 'Fully Integrated', 
      desc: 'No messy email threads or external links. Scheduling, payments, and video calls are handled seamlessly inside our platform.' 
    },
    { 
      icon: '???', 
      title: '100% Refund Guarantee', 
      desc: 'Your time is valuable. If a mentor cancels or doesn\'t show up, you receive an automatic 100% refund immediately.' 
    },
  ];

  return (
    <>
      <Head>
        <title>CrackJobs | Mock Interviews for PM, Data & HR</title>
        <meta name="description" content="Don't leave your job search to luck. Practice with vetted mentors from top tech companies. Anonymous mock interviews for Product Management and Data Science." />
      </Head>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header} accessibilityRole="header">
          <View style={[styles.headerInner, isSmall && styles.headerInnerMobile]}>
            <View style={[styles.brand, isSmall && styles.brandMobile]}>
              {!isSmall && (
                <View style={styles.eyesWrapper}>
                   <View style={styles.eye}><Animated.View style={[styles.pupil, { transform: [{ translateX: leftEyeX }, { translateY: leftEyeY }] }]} /></View>
                   <View style={styles.eye}><Animated.View style={[styles.pupil, { transform: [{ translateX: rightEyeX }, { translateY: rightEyeY }] }]} /></View>
                </View>
              )}
              <View>
                <Text style={[styles.logoMain, isSmall && styles.logoMainMobile]} accessibilityRole="header" aria-level={2}>
                  <Text style={styles.logoMainCrack}>Crack</Text>
                  <Text style={styles.logoMainJobs}>Jobs</Text>
                </Text>
                <Text style={[styles.logoTagline, isSmall && styles.logoTaglineMobile]} accessibilityRole="header" aria-level={1}>
                  Mad Skills. Dream job!
                </Text>
              </View>
            </View>

            <View style={[styles.navRight, isSmall && styles.navRightMobile]} accessibilityRole="header">
              <TouchableOpacity style={[styles.btn, styles.btnSecondary, isSmall && styles.btnMobile]} onPress={() => router.push('/auth/sign-in')}>
                <Text style={[styles.btnText, isSmall && styles.btnTextMobile]}>LOGIN</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.btnPrimary, isSmall && styles.btnMobile]} onPress={() => router.push('/auth/sign-up')}>
                <Text style={[styles.btnText, isSmall && styles.btnTextMobile]}>SIGN UP</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Hero */}
        <View style={styles.heroSection} accessibilityRole="none">
          <View style={[styles.heroCard, isSmall && styles.heroCardMobile]}>
            <View style={styles.heroContent}>
              <Text style={[styles.heroTitle, isSmall && styles.heroTitleMobile]} accessibilityRole="header" aria-level={2}>
                Practice for your interviews
              </Text>
              <Text style={[styles.heroSubtitle, isSmall && styles.heroSubtitleMobile]}>
                Book anonymous, 1:1 sessions with real vetted professionals today.
              </Text>
            </View>
            <Image
              source={require('../assets/crackjobs-hero.png')}
              style={[styles.mascot, isSmall && styles.mascotMobile]}
              resizeMode="contain"
              accessibilityLabel="CrackJobs mascot"
            />
          </View>
        </View>

        {/* Role Cards */}
        <View style={[styles.sectionWrapper, isSmall && styles.sectionWrapperMobile]}>
          <Text style={styles.sectionHeader} accessibilityRole="header" aria-level={2}>Find mentors in our categories</Text>
          <View style={[styles.gridRow, isSmall && styles.gridRowMobile]}>
            {roles.map((role, idx) => (
              <View key={idx} style={[styles.roleCard, isSmall && styles.roleCardMobile]}>
                <Text style={styles.roleIcon}>{role.icon}</Text>
                <Text style={styles.cardTitle} accessibilityRole="header" aria-level={3}>{role.title}</Text>
                <Text style={styles.cardDesc}>{role.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Mission Banner */}
        <View style={styles.missionSection}>
          <View style={styles.missionContent}>
            <Text style={[styles.missionText, isSmall && styles.missionTextMobile]}>
              "We believe that practice makes perfect. Landing your dream job shouldn't be a matter of luck—it should be a result of preparation and confidence."
            </Text>
          </View>
        </View>

        {/* Features Section */}
        <View style={[styles.sectionWrapper, isSmall && styles.sectionWrapperMobile]}>
          <Text style={styles.sectionHeader} accessibilityRole="header" aria-level={2}>Why Candidates Trust Us</Text>
          <View style={[styles.gridRow, isSmall && styles.gridRowMobile]}>
            {features.map((feature, idx) => (
              <View key={idx} style={[styles.featureCard, isSmall && styles.featureCardMobile]}>
                <Text style={styles.featureIcon}>{feature.icon}</Text>
                <Text style={styles.cardTitle} accessibilityRole="header" aria-level={3}>{feature.title}</Text>
                <Text style={styles.cardDesc}>{feature.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* CTA */}
        <View style={styles.ctaSection}>
          <Text style={[styles.ctaTitle, isSmall && styles.ctaTitleMobile]}>
            Start practicing now.
          </Text>
          <TouchableOpacity
            style={[styles.ctaButton, isSmall && styles.ctaButtonMobile]}
            onPress={() => router.push('/auth/sign-up')}
          >
            <Text style={[styles.ctaButtonText, isSmall && styles.ctaButtonTextMobile]}>FIND A MENTOR</Text>
          </TouchableOpacity>
        </View>

        <Footer />
        
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f5f0' },
  scrollContent: { minHeight: '100%' },
  
  // Header & Brand
  header: { backgroundColor: '#f8f5f0', paddingVertical: 16 },
  headerInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', maxWidth: MAX_CONTENT_WIDTH, width: '100%', alignSelf: 'center', paddingHorizontal: 20 },
  headerInnerMobile: { paddingHorizontal: 12 },
  eyesWrapper: { flexDirection: 'row', gap: 8, marginRight: 12 },
  eye: { width: 40, height: 40, backgroundColor: '#fff', borderRadius: 20, borderWidth: 3, borderColor: '#333', justifyContent: 'center', alignItems: 'center' },
  pupil: { width: 16, height: 16, backgroundColor: '#333', borderRadius: 8 },
  brand: { flexDirection: 'row', alignItems: 'center' },
  brandMobile: {},
  
  // ?? UPDATED: System Fonts for Logo
  logoMain: { fontSize: 36, fontWeight: '900', color: '#333', letterSpacing: -1 },
  logoMainCrack: { color: '#333' },
  logoMainJobs: { color: CTA_TEAL },
  logoMainMobile: { fontSize: 24 },
  
  // ?? UPDATED: System Fonts for Tagline
  logoTagline: { fontSize: 16, fontWeight: '700', color: CTA_TEAL, marginTop: 0, letterSpacing: 0.5 },
  logoTaglineMobile: { fontSize: 12 },
  
  // Navigation
  navRight: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  navRightMobile: { gap: 8 },
  btn: { paddingHorizontal: 28, paddingVertical: 10, borderRadius: 30, borderWidth: 2 },
  btnPrimary: { backgroundColor: CTA_TEAL, borderColor: CTA_TEAL },
  btnSecondary: { backgroundColor: 'transparent', borderColor: '#333' },
  btnMobile: { paddingHorizontal: 18, paddingVertical: 8 },
  btnText: { fontWeight: '700', fontSize: 14, letterSpacing: 1 },
  btnTextMobile: { fontSize: 11 },
  
  // Hero
  heroSection: { paddingVertical: 20, width: '100%', alignItems: 'center', paddingHorizontal: 20 },
  heroCard: { 
    width: '100%', 
    maxWidth: MAX_CONTENT_WIDTH, 
    backgroundColor: '#d3d3d3', 
    borderRadius: 24, 
    borderWidth: 3, 
    borderColor: '#000', 
    padding: 60, 
    position: 'relative', 
    overflow: 'visible' 
  },
  heroCardMobile: { padding: 32, flexDirection: 'column', alignItems: 'center' },
  heroContent: { maxWidth: 650, zIndex: 1 },
  
  // ?? UPDATED: System Fonts for Hero Title
  heroTitle: { fontSize: 46, fontWeight: '600', color: '#f58742', marginBottom: 16, lineHeight: 64, letterSpacing: -1.5 },
  heroTitleMobile: { fontSize: 36, textAlign: 'center', lineHeight: 42 },
  
  heroSubtitle: { fontSize: 18, color: '#333', lineHeight: 32, fontWeight: '500' },
  heroSubtitleMobile: { fontSize: 16, textAlign: 'center' },
  mascot: { width: 250, height: 250, position: 'absolute', right: 60, bottom: -14 },
  mascotMobile: { width: 200, height: 200, position: 'relative', right: 'auto', bottom: 'auto', marginTop: 24 },
  
  // Shared Grid Layouts
  sectionWrapper: { 
    width: '100%', 
    maxWidth: MAX_CONTENT_WIDTH, 
    alignSelf: 'center', 
    paddingHorizontal: 20, 
    marginTop: 40,
    marginBottom: 20
  },
  sectionWrapperMobile: { marginTop: 24 },
  
  // ?? UPDATED: System Fonts for Headers
  sectionHeader: { fontSize: 32, fontWeight: '600', color: '#333', marginBottom: 32, textAlign: 'center', letterSpacing: -0.5 },
  
  gridRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '100%',
    gap: 20
  },
  gridRowMobile: { flexDirection: 'column', gap: 16 },
  
  // Role Cards
  roleCard: { 
    width: '23.5%', 
    backgroundColor: '#fff', 
    borderRadius: 16, 
    padding: 24, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 8, 
    elevation: 3,
    borderWidth: 1,
    borderColor: '#eee'
  },
  roleCardMobile: { width: '100%', padding: 20 },
  
  // Features Cards
  featureCard: {
    width: '32%', 
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    borderWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 12,
  },
  featureCardMobile: { width: '100%' },
  
  // Card Typography
  roleIcon: { fontSize: 68, marginBottom: 12 },
  featureIcon: { fontSize: 68, marginBottom: 16 },
  
  // ?? UPDATED: System Fonts for Card Titles
  cardTitle: { fontSize: 20, fontWeight: '800', color: '#333', marginBottom: 8, textAlign: 'center' },
  cardDesc: { fontSize: 15, color: '#555', lineHeight: 24, textAlign: 'center', fontWeight: '400' },

  // Mission Section
  missionSection: {
    width: '100%',
    backgroundColor: '#333', 
    paddingVertical: 80,
    paddingHorizontal: 20,
    marginVertical: 40,
    alignItems: 'center',
  },
  missionContent: { maxWidth: 800 },
  
  // ?? UPDATED: System Fonts for Mission (Added Italic for quote style)
  missionText: {
    fontSize: 28,
    fontWeight: '500',
    fontStyle: 'italic',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 44,
  },
  missionTextMobile: { fontSize: 20, lineHeight: 32 },

  // CTA
  ctaSection: { paddingVertical: 80, alignItems: 'center', backgroundColor: '#f8f5f0', paddingHorizontal: 20 },
  
  // ?? UPDATED: System Fonts for CTA Title
  ctaTitle: { fontSize: 32, fontWeight: '600', color: '#333', marginBottom: 32, textAlign: 'center', letterSpacing: -1 },
  ctaTitleMobile: { fontSize: 32 },
  
  ctaButton: { backgroundColor: CTA_TEAL, paddingHorizontal: 48, paddingVertical: 18, borderRadius: 30 },
  ctaButtonMobile: { paddingHorizontal: 36, paddingVertical: 14 },
  ctaButtonText: { color: '#fff', fontSize: 18, fontWeight: '400', letterSpacing: 1.5 },
  ctaButtonTextMobile: { fontSize: 16 },
});