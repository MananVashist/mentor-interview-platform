// app/about.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';

const CTA_TEAL = '#18a7a7';

export default function About() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isSmall = width < 900;

  return (<ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.headerInner, isSmall && styles.headerInnerMobile]}>
            <TouchableOpacity onPress={() => router.push('/')}>
              <View>
                <Text style={[styles.logoMain, isSmall && styles.logoMainMobile]}>
                  CrackJobs
                </Text>
                <Text style={[styles.logoTagline, isSmall && styles.logoTaglineMobile]}>
                  Mad skills. Dream job.
                </Text>
              </View>
            </TouchableOpacity>

            <View style={[styles.navRight, isSmall && styles.navRightMobile]}>
              <TouchableOpacity
                style={[styles.btn, styles.btnSecondary, isSmall && styles.btnMobile]}
                onPress={() => router.push('/(auth)/sign-in')}
              >
                <Text style={[styles.btnText, isSmall && styles.btnTextMobile]}>
                  LOGIN
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.btnPrimary, isSmall && styles.btnMobile]}
                onPress={() => router.push('/(auth)/sign-up')}
              >
                <Text style={[styles.btnText, isSmall && styles.btnTextMobile]}>
                  SIGN UP
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={[styles.pageTitle, isSmall && styles.pageTitleMobile]}>
            About CrackJobs
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Our Mission</Text>
            <Text style={styles.paragraph}>
              At CrackJobs, we believe that <Text style={styles.bold}>practice makes perfect</Text>. 
              Landing your dream job shouldn't be a matter of luck—it should be a result of preparation 
              and confidence built through real practice with industry professionals.
            </Text>
            <Text style={styles.paragraph}>
              We connect job seekers with experienced mentors from top companies who provide 
              realistic mock interviews, actionable feedback, and insider insights to help you 
              ace your next interview.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Why CrackJobs?</Text>
            <View style={styles.featureList}>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>✅</Text>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>Real Professionals</Text>
                  <Text style={styles.featureDesc}>
                    Practice with engineers, PMs, and hiring managers from FAANG and top tech companies
                  </Text>
                </View>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>✅</Text>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>Honest Feedback</Text>
                  <Text style={styles.featureDesc}>
                    Get detailed, constructive feedback on your technical and behavioral performance
                  </Text>
                </View>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>✅</Text>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>Flexible Scheduling</Text>
                  <Text style={styles.featureDesc}>
                    Book sessions that fit your schedule, on your terms
                  </Text>
                </View>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>✅</Text>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>Role-Specific Practice</Text>
                  <Text style={styles.featureDesc}>
                    Choose mentors who specialize in your target role and industry
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Our Story</Text>
            <Text style={styles.paragraph}>
              CrackJobs was founded by professionals who've been on both sides of the interview 
              table. We know how nerve-wracking interviews can be, and we've seen firsthand how 
              practice transforms candidates from anxious to confident.
            </Text>
            <Text style={styles.paragraph}>
              We built this platform to democratize access to high-quality interview preparation, 
              making it easy for anyone to connect with industry experts and get the practice they 
              need to succeed.
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.ctaButton, isSmall && styles.ctaButtonMobile]}
            onPress={() => router.push('/(auth)/sign-up')}
          >
            <Text style={styles.ctaButtonText}>START PRACTICING TODAY</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={[styles.footerContent, isSmall && styles.footerContentMobile]}>
            <TouchableOpacity onPress={() => router.push('/')}>
              <Text style={styles.footerLink}>Home</Text>
            </TouchableOpacity>
            {!isSmall && <Text style={styles.footerDivider}>•</Text>}
            <TouchableOpacity onPress={() => router.push('/how-it-works')}>
              <Text style={styles.footerLink}>How It Works</Text>
            </TouchableOpacity>
            {!isSmall && <Text style={styles.footerDivider}>•</Text>}
            <TouchableOpacity onPress={() => router.push('/blog')}>
              <Text style={styles.footerLink}>Blog</Text>
            </TouchableOpacity>
            {!isSmall && <Text style={styles.footerDivider}>•</Text>}
            <TouchableOpacity onPress={() => router.push('/contact')}>
              <Text style={styles.footerLink}>Contact</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f5f0' },
  
  // Header (same as other pages)
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
  headerInnerMobile: { paddingHorizontal: 20 },
  logoMain: {
    fontFamily: 'DancingScript',
    fontSize: 36,
    fontWeight: '900',
    color: '#333',
  },
  logoMainMobile: { fontSize: 28 },
  logoTagline: {
    fontFamily: 'DancingScript',
    fontSize: 22,
    fontWeight: '900',
    color: '#f58742',
    marginTop: -8,
  },
  logoTaglineMobile: { fontSize: 16 },
  navRight: { flexDirection: 'row', gap: 12 },
  navRightMobile: { gap: 8 },
  btn: {
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 30,
    borderWidth: 2,
  },
  btnPrimary: {
    backgroundColor: CTA_TEAL,
    borderColor: CTA_TEAL,
  },
  btnSecondary: {
    backgroundColor: 'transparent',
    borderColor: '#333',
  },
  btnMobile: { paddingHorizontal: 20, paddingVertical: 8 },
  btnText: {
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 1,
  },
  btnTextMobile: { fontSize: 12 },
  
  // Content
  content: {
    maxWidth: 900,
    width: '100%',
    marginHorizontal: 'auto',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  pageTitle: {
    fontFamily: 'DancingScript',
    fontSize: 56,
    fontWeight: '900',
    color: '#333',
    textAlign: 'center',
    marginBottom: 48,
  },
  pageTitleMobile: { fontSize: 42 },
  
  // Sections
  section: {
    marginBottom: 48,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: CTA_TEAL,
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 18,
    color: '#333',
    lineHeight: 30,
    marginBottom: 16,
  },
  bold: {
    fontWeight: '700',
    color: CTA_TEAL,
  },
  
  // Features
  featureList: {
    gap: 24,
  },
  featureItem: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
  },
  featureIcon: {
    fontSize: 24,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  featureDesc: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  
  // CTA
  ctaButton: {
    backgroundColor: CTA_TEAL,
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 30,
    alignSelf: 'center',
    marginTop: 24,
  },
  ctaButtonMobile: {
    paddingHorizontal: 36,
    paddingVertical: 14,
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  
  // Footer
  footer: {
    backgroundColor: '#333',
    paddingVertical: 32,
    paddingHorizontal: 40,
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },
  footerContentMobile: {
    flexDirection: 'column',
    gap: 12,
  },
  footerLink: {
    color: '#fff',
    fontSize: 14,
  },
  footerDivider: {
    color: '#666',
    fontSize: 14,
  },
});