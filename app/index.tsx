// app/index.tsx
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
} from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import Head from 'expo-router/head';
import { SplashScreen } from '../components/SplashScreen';
import { injectMultipleSchemas } from '@/lib/structured-data';
import { Footer } from '@/components/Footer';
// ✅ IMPORT FROM LIB/UI (The source of truth)
import { BrandHeader } from '@/lib/ui';

const CTA_TEAL = '#18a7a7';
const FONT_WEIGHT_BOLD = '600'; 

// Custom Hook for SEO
const useStructuredData = () => {
    useEffect(() => {
        if (Platform.OS === 'web') {
            const orgSchema = {
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: 'CrackJobs',
                url: 'https://crackjobs.com',
                logo: 'https://crackjobs.com/logo.png',
                sameAs: ['https://twitter.com/crackjobs', 'https://linkedin.com/company/crackjobs'],
            };
            const cleanup = injectMultipleSchemas([orgSchema]);
            return () => cleanup && cleanup();
        }
    }, []);
}

export default function LandingPage() {
  const [showSplash, setShowSplash] = useState(Platform.OS !== 'web');
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isSmall = width < 900;
  
  useStructuredData(); 

  // 🔁 Splash logic
  useEffect(() => {
    if (Platform.OS !== 'web') {
      const timer = setTimeout(() => setShowSplash(false), 2000); 
      return () => clearTimeout(timer);
    }
  }, []);

  if (Platform.OS !== 'web' && showSplash) return <SplashScreen />;
  if (Platform.OS !== 'web') return <Redirect href="/auth/sign-in" />;

  return (
    <>
      <Head>
        <title>CrackJobs | Mock Interviews for Product Manager, Data Analyst, Data Scientist & HR</title>
        <meta name="description" content="CrackJobs offers anonymous, role-aligned mock interviews..." />
      </Head>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header} accessibilityRole="banner">
          <View style={[styles.headerInner, isSmall && styles.headerInnerMobile]}>
            
            {/* ✅ Using Shared BrandHeader from lib/ui */}
            {/* We override marginBottom because ui.tsx has default spacing for Sign In page */}
            <BrandHeader style={{ marginBottom: 0 }} small={isSmall} />

            {/* Navigation Buttons */}
            <View style={[styles.navRight, isSmall && styles.navRightMobile]} accessibilityRole="navigation">
              <TouchableOpacity
                style={[styles.btn, styles.btnSecondary, isSmall && styles.btnMobile]}
                onPress={() => router.push('/auth/sign-in')}
              >
                <Text style={[styles.btnText, isSmall && styles.btnTextMobile]}>LOGIN</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.btnPrimary, isSmall && styles.btnMobile]}
                onPress={() => router.push('/auth/sign-up')}
              >
                <Text style={[styles.btnText, isSmall && styles.btnTextMobile, styles.btnTextWhite]}>SIGN UP</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Hero */}
        <View style={styles.heroSection} accessibilityRole="main">
          <View style={[styles.heroCard, isSmall && styles.heroCardMobile]}>
            <View style={styles.heroContent}>
              <Text style={[styles.heroTitle, isSmall && styles.heroTitleMobile]}>
                Practice makes perfect!
              </Text>
              <Text style={[styles.heroSubtitle, isSmall && styles.heroSubtitleMobile]}>
                1:1 anonymous mock interviews with vetted professionals
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

        {/* --- Features & Roles Sections --- */}
        {/* Role Cards */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionKicker}>Choose your track</Text>
          <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}>
            Role-based interviews
          </Text>
          <View style={[styles.featuresGrid, isSmall && styles.featuresGridMobile]}>
            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>🚀</Text>
              <Text style={styles.featureTitle}>Product Manager</Text>
              <Text style={styles.featureBody}>Product sense, execution, metrics, and strategy.</Text>
            </View>
            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>📊</Text>
              <Text style={styles.featureTitle}>Data Analyst/ Business Analyst</Text>
              <Text style={styles.featureBody}>SQL, case studies, and business problem-solving.</Text>
            </View>
            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>🤖</Text>
              <Text style={styles.featureTitle}>Data scientist/ ML engineer</Text>
              <Text style={styles.featureBody}>Modeling, experimentation, and ML system design.</Text>
            </View>
            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>👥</Text>
              <Text style={styles.featureTitle}>HR/ Talent acquisition</Text>
              <Text style={styles.featureBody}>Behavioral, culture, and hiring alignment.</Text>
            </View>
          </View>
        </View>

        {/* Why use CrackJobs */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionKicker}>Why candidates use CrackJobs</Text>
          <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}>
            Stay protected
          </Text>
          <View style={[styles.featuresGrid, isSmall && styles.featuresGridMobile]}>
            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>🛡️</Text>
              <Text style={styles.featureTitle}>Anonymous Process</Text>
              <Text style={styles.featureBody}>Nobody can see your identity or company information. **No awkward pings.**</Text>
            </View>
            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>💸</Text>
              <Text style={styles.featureTitle}>Protected Payments</Text>
              <Text style={styles.featureBody}>Pay once, and your payment is held securely. Full refund protection.</Text>
            </View>
            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>👤</Text>
              <Text style={styles.featureTitle}>Real People. Real Interviewers</Text>
              <Text style={styles.featureBody}>Mentors are vetted. No AI, No BS.</Text>
            </View>
          </View>
        </View>

        {/* Bottom CTA */}
        <View style={styles.bottomCtaSection}>
          <Text style={styles.bottomCtaTitle}>Ready to dive in?</Text>
          <TouchableOpacity style={styles.bottomCtaButton} onPress={() => router.push('/auth/sign-up')}>
            <Text style={styles.bottomCtaButtonText}>Get started</Text>
          </TouchableOpacity>
        </View>

        {/* How it works */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionKicker}>Easy as 1-2-3</Text>
          <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}>
            How it works
          </Text>
          <View style={[styles.featuresGrid, isSmall && styles.featuresGridMobile]}>
            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>1️⃣</Text>
              <Text style={styles.featureTitle}>Browse and Book</Text>
              <Text style={styles.featureBody}>Browse mentors and find an interviewer aligned with your needs.</Text>
            </View>
            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>2️⃣</Text>
              <Text style={styles.featureTitle}>Attend mock interview</Text>
              <Text style={styles.featureBody}>Schedule and attend the mock interview through the platform.</Text>
            </View>
            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>3️⃣</Text>
              <Text style={styles.featureTitle}>Get detailed feedback</Text>
              <Text style={styles.featureBody}>Mentors provide detailed feedback based on standard templates.</Text>
            </View>
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
  headerInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1400, width: '100%', marginHorizontal: 'auto', paddingHorizontal: 40 },
  headerInnerMobile: { paddingHorizontal: 12, justifyContent: 'space-between' },

  navRight: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  navRightMobile: { gap: 8 },

  btn: { paddingHorizontal: 28, paddingVertical: 10, borderRadius: 30, borderWidth: 1 },
  btnPrimary: { backgroundColor: CTA_TEAL, borderColor: CTA_TEAL },
  btnSecondary: { backgroundColor: 'transparent', borderColor: '#333' },
  btnMobile: { paddingHorizontal: 18, paddingVertical: 8 },
  btnText: { fontWeight: '700', fontSize: 14, letterSpacing: 1 },
  btnTextMobile: { fontSize: 11, letterSpacing: 0.5 },
  btnTextWhite: { color: '#FFFFFF' },

  heroSection: { paddingHorizontal: 40, paddingVertical: 0, maxWidth: 1400, width: '100%', marginHorizontal: 'auto' },
  heroCard: { backgroundColor: '#d3d3d3', borderRadius: 24, borderWidth: 3, borderColor: '#000', padding: 48, paddingRight: 100, position: 'relative', overflow: 'hidden', flexDirection: 'row', alignItems: 'flex-end', gap: 24 },
  heroCardMobile: { padding: 8, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingRight: 2 },
  heroContent: { flex: 1, maxWidth: 650, zIndex: 1 },

  heroTitle: { fontSize: 40, fontWeight: FONT_WEIGHT_BOLD, color: '#f58742', marginBottom: 12, textShadowColor: 'rgba(0,0,0,0.1)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4, ...(Platform.OS === 'web' && { WebkitTextStroke: '0.5px #f58742' }) },
  heroTitleMobile: { marginTop: 10, fontSize: 30, textAlign: 'center' },
  heroSubtitle: { fontSize: 16, color: '#333', lineHeight: 26 },
  heroSubtitleMobile: { fontSize: 14, lineHeight: 22, textAlign: 'center' },

  mascot: { width: 200, height: 200, position: 'absolute', bottom: -10, right: 200, zIndex: 0 },
  mascotMobile: { width: 210, height: 210, position: 'relative', marginTop: 24, right: -10, bottom: 20 },

  sectionKicker: { fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, color: '#888', marginBottom: 6 },
  sectionTitle: { fontSize: 24, fontWeight: FONT_WEIGHT_BOLD, color: '#f58742', marginBottom: 18 },
  sectionTitleMobile: { fontSize: 20, textAlign: 'left' },

  featuresSection: { maxWidth: 1400, width: '100%', marginHorizontal: 'auto', paddingHorizontal: 40, paddingVertical: 30 },
  featuresGrid: { flexDirection: 'row', gap: 20 },
  featuresGridMobile: { flexDirection: 'column', paddingHorizontal: 0 },
  featureCard: { flex: 1, backgroundColor: '#fff', borderRadius: 18, padding: 20, borderWidth: 1, borderColor: '#eee' },
  featureIcon: { fontSize: 60, marginBottom: 8 },
  featureTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6, color: '#222' },
  featureBody: { fontSize: 13, color: '#555', lineHeight: 20 },

  bottomCtaSection: { paddingVertical: 60, paddingHorizontal: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f58742', width: '100%' },
  bottomCtaTitle: { fontSize: 32, fontWeight: '500', color: '#fff', marginBottom: 24, textAlign: 'center' },
  bottomCtaButton: { backgroundColor: CTA_TEAL, paddingHorizontal: 36, paddingVertical: 16, borderRadius: 999 },
  bottomCtaButtonText: { color: '#fff', fontWeight: '700', fontSize: 16, letterSpacing: 0.5 },
});