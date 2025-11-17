// app/how-it-works.tsx
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

export default function HowItWorks() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isSmall = width < 900;

  const steps = [
    {
      number: '1',
      title: 'Sign Up',
      description: 'Create your account as a candidate looking to practice interviews.',
    },
    {
      number: '2',
      title: 'Browse Mentors',
      description: 'Explore profiles of experienced professionals from your target industry.',
    },
    {
      number: '3',
      title: 'Book a Session',
      description: 'Choose a time slot that works for you and book your mock interview.',
    },
    {
      number: '4',
      title: 'Practice Interview',
      description: 'Join your video call and practice with real industry professionals.',
    },
    {
      number: '5',
      title: 'Get Feedback',
      description: 'Receive detailed feedback and actionable tips to improve your skills.',
    },
  ];

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
            How It Works
          </Text>
          <Text style={[styles.pageSubtitle, isSmall && styles.pageSubtitleMobile]}>
            Get started in 5 simple steps
          </Text>

          <View style={[styles.stepsContainer, isSmall && styles.stepsContainerMobile]}>
            {steps.map((step, index) => (
              <View key={index} style={[styles.stepCard, isSmall && styles.stepCardMobile]}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{step.number}</Text>
                </View>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDescription}>{step.description}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.ctaButton, isSmall && styles.ctaButtonMobile]}
            onPress={() => router.push('/(auth)/sign-up')}
          >
            <Text style={styles.ctaButtonText}>GET STARTED NOW</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={[styles.footerContent, isSmall && styles.footerContentMobile]}>
            <TouchableOpacity onPress={() => router.push('/')}>
              <Text style={styles.footerLink}>Home</Text>
            </TouchableOpacity>
            {!isSmall && <Text style={styles.footerDivider}>•</Text>}
            <TouchableOpacity onPress={() => router.push('/about')}>
              <Text style={styles.footerLink}>About</Text>
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
  
  // Header
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
    maxWidth: 1000,
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
    marginBottom: 16,
  },
  pageTitleMobile: { fontSize: 42 },
  pageSubtitle: {
    fontSize: 20,
    color: '#666',
    textAlign: 'center',
    marginBottom: 48,
  },
  pageSubtitleMobile: { fontSize: 18, paddingHorizontal: 20 },
  
  // Steps
  stepsContainer: {
    gap: 32,
    marginBottom: 48,
  },
  stepsContainerMobile: { gap: 24 },
  stepCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  stepCardMobile: { padding: 24 },
  stepNumber: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: CTA_TEAL,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  stepDescription: {
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