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
import Head from 'expo-router/head'; // 🟢 SEO: Declarative Head
import { SplashScreen } from '../components/SplashScreen';
// 🟢 SEO: Import schema injector (assuming this path based on other files)
import { injectMultipleSchemas } from '@/lib/structured-data';

const CTA_TEAL = '#18a7a7';

export default function LandingPage() {
  const [showSplash, setShowSplash] = useState(Platform.OS !== 'web');

  // 🟢 SEO: JSON-LD for Organization and WebSite
  useEffect(() => {
    if (Platform.OS === 'web') {
      const orgSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "CrackJobs",
        "url": "https://crackjobs.com",
        "logo": "https://crackjobs.com/logo.png",
        "sameAs": [
          "https://twitter.com/crackjobs",
          "https://linkedin.com/company/crackjobs"
        ]
      };
      
      const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "CrackJobs",
        "url": "https://crackjobs.com",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://crackjobs.com/mentors?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      };

      const cleanup = injectMultipleSchemas([orgSchema, websiteSchema]);
      return () => cleanup && cleanup();
    }
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      const timer = setTimeout(() => setShowSplash(false), 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (Platform.OS !== 'web' && showSplash) return <SplashScreen />;
  if (Platform.OS !== 'web') return <Redirect href="/auth/sign-in" />;

  const router = useRouter();
  const { width } = useWindowDimensions();
  const isSmall = width < 900;

  // ... [Keep Animation Logic (Eyes) Unchanged] ...
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
            Animated.timing(xVal, { toValue: toX, duration: 70, useNativeDriver: true }),
            Animated.timing(yVal, { toValue: toY, duration: 70, useNativeDriver: true }),
          ];
        };
        Animated.parallel([...makeTwitch(leftEyeX, leftEyeY), ...makeTwitch(rightEyeX, rightEyeY)]).start();
      };
      randomMove();
      const interval = setInterval(randomMove, 120);
      return () => clearInterval(interval);
    };
    return animateEyes();
  }, [leftEyeX, leftEyeY, rightEyeX, rightEyeY]);

  const roles = [
    { icon: '💻', title: 'SDE / Software Engineer', desc: 'Coding, DSA, System Design' },
    { icon: '⚙️', title: 'Backend Engineer', desc: 'Node, Java, Python, Go' },
    { icon: '🎨', title: 'Frontend Engineer', desc: 'React, Vue, Performance' },
    { icon: '📊', title: 'Data Analyst', desc: 'SQL, Excel, Tableau' },
    { icon: '🚀', title: 'Product Manager', desc: 'Strategy, Execution, Metrics' },
    { icon: '🤖', title: 'AI/ML Engineer', desc: 'Deep Learning, NLP, Python' },
    { icon: '👥', title: 'HR Manager', desc: 'Behavioral, Culture Fit' },
  ];

  return (
    <>
      <Head>
        <title>CrackJobs | Mock Interviews with FAANG Mentors</title>
        <meta name="description" content="Land your dream job with CrackJobs. Book 1:1 mock interviews with engineers and PMs from Google, Amazon, and Microsoft. Get actionable feedback today." />
        <meta name="keywords" content="mock interview, system design interview, coding interview practice, product manager interview prep, FAANG mentors" />
        <meta property="og:title" content="CrackJobs - Ace Your Next Tech Interview" />
        <meta property="og:image" content="https://crackjobs.com/og-home.jpg" />
      </Head>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header} accessibilityRole="banner">
          <View style={[styles.headerInner, isSmall && styles.headerInnerMobile]}>
            <View style={[styles.brand, isSmall && styles.brandMobile]}>
              {!isSmall && (
                <View style={styles.eyesWrapper}>
                  {/* ... [Keep Eye Views Unchanged] ... */}
                   <View style={styles.eye}><Animated.View style={[styles.pupil, { transform: [{ translateX: leftEyeX }, { translateY: leftEyeY }] }]} /></View>
                   <View style={styles.eye}><Animated.View style={[styles.pupil, { transform: [{ translateX: rightEyeX }, { translateY: rightEyeY }] }]} /></View>
                </View>
              )}
              <View>
                {/* 🟢 SEO: H1 tag for main brand */}
                <Text style={[styles.logoMain, isSmall && styles.logoMainMobile]} accessibilityRole="header" aria-level={1}>
                  <Text style={styles.logoMainCrack}>Crack</Text>
                  <Text style={styles.logoMainJobs}>Jobs</Text>
                </Text>
                <Text style={[styles.logoTagline, isSmall && styles.logoTaglineMobile]}>Mad skills. Dream job.</Text>
              </View>
            </View>

            <View style={[styles.navRight, isSmall && styles.navRightMobile]} accessibilityRole="navigation">
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
        <View style={styles.heroSection} accessibilityRole="main">
          <View style={[styles.heroCard, isSmall && styles.heroCardMobile]}>
            <View style={styles.heroContent}>
              {/* 🟢 SEO: H2 for main value prop */}
              <Text style={[styles.heroTitle, isSmall && styles.heroTitleMobile]} accessibilityRole="header" aria-level={2}>
                Practice makes perfect!
              </Text>
              <Text style={[styles.heroSubtitle, isSmall && styles.heroSubtitleMobile]}>
                Mock interviews with real professionals from your industry
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

        {/* Role Cards */}
        <View style={[styles.rolesGrid, isSmall && styles.rolesGridMobile]}>
          {roles.map((role, idx) => (
            <View key={idx} style={[styles.roleCard, isSmall && styles.roleCardMobile]}>
              <Text style={styles.roleIcon} accessibilityLabel={role.title}>{role.icon}</Text>
              {/* 🟢 SEO: H3 for roles */}
              <Text style={styles.roleTitle} accessibilityRole="header" aria-level={3}>{role.title}</Text>
              <Text style={styles.roleDesc}>{role.desc}</Text>
            </View>
          ))}
        </View>

        {/* CTA */}
        <View style={styles.ctaSection}>
          <Text style={[styles.ctaTitle, isSmall && styles.ctaTitleMobile]} accessibilityRole="header" aria-level={2}>
            Ready to dive in?
          </Text>
          <TouchableOpacity
            style={[styles.ctaButton, isSmall && styles.ctaButtonMobile]}
            onPress={() => router.push('/auth/sign-up')}
            accessibilityRole="button"
            accessibilityLabel="Get Started with CrackJobs"
          >
            <Text style={[styles.ctaButtonText, isSmall && styles.ctaButtonTextMobile]}>GET STARTED</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer} accessibilityRole="contentinfo">
          <View style={[styles.footerContent, isSmall && styles.footerContentMobile]}>
            <TouchableOpacity onPress={() => router.push('/how-it-works')} accessibilityRole="link"><Text style={styles.footerLink}>How It Works</Text></TouchableOpacity>
            {!isSmall && <Text style={styles.footerDivider}>•</Text>}
            <TouchableOpacity onPress={() => router.push('/about')} accessibilityRole="link"><Text style={styles.footerLink}>About</Text></TouchableOpacity>
            {!isSmall && <Text style={styles.footerDivider}>•</Text>}
            <TouchableOpacity onPress={() => router.push('/blog')} accessibilityRole="link"><Text style={styles.footerLink}>Blog</Text></TouchableOpacity>
            {!isSmall && <Text style={styles.footerDivider}>•</Text>}
            <TouchableOpacity onPress={() => router.push('/contact')} accessibilityRole="link"><Text style={styles.footerLink}>Contact</Text></TouchableOpacity>
            {!isSmall && <Text style={styles.footerDivider}>•</Text>}
            <TouchableOpacity onPress={() => router.push('/privacy')} accessibilityRole="link"><Text style={styles.footerLink}>Privacy Policy</Text></TouchableOpacity>
            {!isSmall && <Text style={styles.footerDivider}>•</Text>}
            <TouchableOpacity onPress={() => router.push('/terms')} accessibilityRole="link"><Text style={styles.footerLink}>Terms & Conditions</Text></TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

// ... [Keep Styles Unchanged] ...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f5f0' },
  scrollContent: { minHeight: '100%' },
  header: { backgroundColor: '#f8f5f0', paddingVertical: 16 },
  headerInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1400, width: '100%', marginHorizontal: 'auto', paddingHorizontal: 40 },
  headerInnerMobile: { paddingHorizontal: 12, justifyContent: 'space-between' },
  eyesWrapper: { flexDirection: 'row', gap: 8, marginRight: 12 },
  eye: { width: 40, height: 40, backgroundColor: '#fff', borderRadius: 20, borderWidth: 3, borderColor: '#333', justifyContent: 'center', alignItems: 'center' },
  pupil: { width: 16, height: 16, backgroundColor: '#333', borderRadius: 8 },
  brand: { flexDirection: 'row', alignItems: 'center' },
  brandMobile: {},
  logoMain: { fontFamily: 'DancingScript', fontSize: 44, fontWeight: '900', textShadowColor: 'rgba(0,0,0,0.1)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 },
  logoMainCrack: { color: '#333', ...(Platform.OS === 'web' && { WebkitTextStroke: '0.5px #333' }) },
  logoMainJobs: { color: CTA_TEAL, ...(Platform.OS === 'web' && { WebkitTextStroke: `0.5px ${CTA_TEAL}` }) },
  logoMainMobile: { fontSize: 24 },
  logoTagline: { fontFamily: 'DancingScript', fontSize: 28, fontWeight: '900', color: CTA_TEAL, marginTop: -8, textShadowColor: 'rgba(0,0,0,0.1)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2, ...(Platform.OS === 'web' && { WebkitTextStroke: `0.5px ${CTA_TEAL}` }) },
  logoTaglineMobile: { fontSize: 14 },
  navRight: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  navRightMobile: { gap: 8 },
  btn: { paddingHorizontal: 28, paddingVertical: 10, borderRadius: 30, borderWidth: 2 },
  btnPrimary: { backgroundColor: CTA_TEAL, borderColor: CTA_TEAL },
  btnSecondary: { backgroundColor: 'transparent', borderColor: '#333' },
  btnMobile: { paddingHorizontal: 18, paddingVertical: 8 },
  btnText: { fontWeight: '700', fontSize: 14, letterSpacing: 1 },
  btnTextMobile: { fontSize: 11, letterSpacing: 0.5 },
  heroSection: { paddingHorizontal: 40, paddingVertical: 10, maxWidth: 1400, width: '100%', marginHorizontal: 'auto' },
  heroCard: { backgroundColor: '#d3d3d3', borderRadius: 24, borderWidth: 3, borderColor: '#000', padding: 78, position: 'relative', overflow: 'visible' },
  heroCardMobile: { padding: 32, flexDirection: 'column', alignItems: 'center' },
  heroContent: { maxWidth: 600, zIndex: 1 },
  heroTitle: { fontFamily: 'DancingScript', fontSize: 50, fontWeight: '900', color: '#f58742', marginBottom: 16, textShadowColor: 'rgba(0,0,0,0.1)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4, ...(Platform.OS === 'web' && { WebkitTextStroke: '0.5px #f58742' }) },
  heroTitleMobile: { fontSize: 36, textAlign: 'center' },
  heroSubtitle: { fontSize: 20, color: '#333', lineHeight: 32 },
  heroSubtitleMobile: { fontSize: 16, lineHeight: 24, textAlign: 'center' },
  mascot: { width: 280, height: 280, position: 'absolute', right: 40, bottom: -15 },
  mascotMobile: { width: 200, height: 200, position: 'relative', right: 'auto', bottom: 'auto', marginTop: 24 },
  rolesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 24, paddingHorizontal: 40, paddingVertical: 10, maxWidth: 1400, width: '100%', marginHorizontal: 'auto' },
  rolesGridMobile: { flexDirection: 'column', gap: 16, paddingHorizontal: 20 },
  roleCard: { flex: 1, minWidth: 280, backgroundColor: '#fff', borderRadius: 16, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  roleCardMobile: { minWidth: '100%', padding: 20 },
  roleIcon: { fontSize: 48, marginBottom: 12 },
  roleTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 8 },
  roleDesc: { fontSize: 14, color: '#666', lineHeight: 20 },
  ctaSection: { paddingHorizontal: 40, paddingVertical: 60, alignItems: 'center', backgroundColor: '#f8f5f0' },
  ctaTitle: { fontFamily: 'DancingScript', fontSize: 50, fontWeight: '900', color: '#333', marginBottom: 32, textAlign: 'center', textShadowColor: 'rgba(0,0,0,0.1)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4, ...(Platform.OS === 'web' && { WebkitTextStroke: '0.5px #333' }) },
  ctaTitleMobile: { fontSize: 36, marginBottom: 24 },
  ctaButton: { backgroundColor: CTA_TEAL, paddingHorizontal: 48, paddingVertical: 16, borderRadius: 30, shadowColor: CTA_TEAL, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
  ctaButtonMobile: { paddingHorizontal: 36, paddingVertical: 14 },
  ctaButtonText: { color: '#fff', fontSize: 18, fontWeight: '700', letterSpacing: 1.5 },
  ctaButtonTextMobile: { fontSize: 16 },
  footer: { backgroundColor: '#333', paddingVertical: 32, paddingHorizontal: 40 },
  footerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16, maxWidth: 1400, marginHorizontal: 'auto', flexWrap: 'wrap' },
  footerContentMobile: { flexDirection: 'column', gap: 12 },
  footerLink: { color: '#fff', fontSize: 14, textDecorationLine: 'none' },
  footerDivider: { color: '#666', fontSize: 14 },
});