import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Head from 'expo-router/head';
import { PageLayout } from '@/components/PageLayout';
import { theme } from '@/lib/theme';
import { createBreadcrumbSchema, injectMultipleSchemas } from '@/lib/structured-data';

export default function HowItWorks() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isSmall = width < 900;

  const steps = [
    { number: '1', title: 'Sign Up & Profile Creation', description: 'Create your candidate account. Submit your resume to help mentors tailor the session to your background.' },
    { number: '2', title: 'Browse Mentors & Book', description: 'Filter vetted mentors by expertise (Data Analyst, Product Manager etc.). Choose a time slot and securely complete the payment' },
    { number: '3', title: 'Confirmation & Invite', description: 'Once the mentor accepts, a secure Google Meet/Zoom link is automatically generated in your bookings' },
    { number: '4', title: 'Mock Interview Session', description: 'Join the video session. Engage in a realistic, structured interview with real-time problem solving and role-play.' },
    { number: '5', title: 'Get Actionable Feedback', description: 'Receive a detailed evaluation report within 48 hours covering technical skills, communication, and specific areas for improvement.' },
  ];

  // SEO: HowTo Schema
  useEffect(() => {
    if (Platform.OS === 'web') {
      const howToSchema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Book a Mock Interview on CrackJobs",
        "step": steps.map(step => ({
          "@type": "HowToStep",
          "name": step.title,
          "text": step.description,
          "position": step.number
        }))
      };
      const breadcrumb = createBreadcrumbSchema([{ name: 'Home', url: 'https://crackjobs.com' }, { name: 'How It Works', url: 'https://crackjobs.com/how-it-works' }]);
      const cleanup = injectMultipleSchemas([howToSchema, breadcrumb]);
      return () => cleanup && cleanup();
    }
  }, []);

  return (
    <PageLayout>
      <Head>
        <title>How It Works - 5 Steps to Ace Your Interview | CrackJobs</title>
        <meta name="description" content="Master the CrackJobs process: 1. Sign Up, 2. Book a FAANG Mentor, 3. Practice, 4. Get Feedback. The simplest way to prepare for tech interviews." />
      </Head>

      <View style={[styles.content, isSmall && styles.contentMobile]}>
        <Text style={[styles.pageTitle, isSmall && styles.pageTitleMobile]} accessibilityRole="header" aria-level={1}>
          How It Works
        </Text>
        <Text style={styles.pageSubtitle}>From sign-up to actionable insights in 5 simple steps</Text>

        <View style={styles.stepsContainer}>
          {steps.map((step, index) => (
            <View key={index} style={[styles.stepCard, isSmall && styles.stepCardMobile]}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{step.number}</Text>
              </View>
              <View style={styles.stepTextContent}>
                <Text style={styles.stepTitle} accessibilityRole="header" aria-level={3}>{step.title}</Text>
                <Text style={styles.stepDescription}>{step.description}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.ctaSection}>
          <TouchableOpacity
            style={[styles.ctaButton, isSmall && styles.ctaButtonMobile]}
            onPress={() => router.push('/auth/sign-up')}
          >
            <Text style={styles.ctaButtonText}>GET STARTED NOW</Text>
          </TouchableOpacity>
        </View>
      </View>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  content: { maxWidth: 1000, width: '100%', marginHorizontal: 'auto', paddingHorizontal: 40, paddingVertical: 60 },
  contentMobile: { paddingHorizontal: 20, paddingVertical: 40 },
  pageTitle: { fontFamily: theme.typography.fontFamily.extrabold, fontSize: 48, color: theme.colors.text.main, textAlign: 'center', marginBottom: 16 },
  pageTitleMobile: { fontSize: 32 },
  pageSubtitle: { fontFamily: theme.typography.fontFamily.regular, fontSize: 20, color: theme.colors.text.body, textAlign: 'center', marginBottom: 60 },
  
  stepsContainer: { gap: 24, marginBottom: 40 },
  stepCard: { 
    flexDirection: 'row', backgroundColor: theme.colors.surface, borderRadius: 16, padding: 32, 
    alignItems: 'flex-start', gap: 24, ...theme.shadows.card 
  },
  stepCardMobile: { flexDirection: 'column', padding: 24, gap: 16 },
  stepNumber: { width: 48, height: 48, borderRadius: 24, backgroundColor: theme.colors.primary, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  stepNumberText: { fontSize: 24, fontFamily: theme.typography.fontFamily.bold, color: theme.colors.surface },
  stepTextContent: { flex: 1 },
  stepTitle: { fontSize: 22, fontFamily: theme.typography.fontFamily.bold, color: theme.colors.text.main, marginBottom: 8 },
  stepDescription: { fontSize: 16, fontFamily: theme.typography.fontFamily.regular, color: theme.colors.text.body, lineHeight: 24 },
  
  ctaSection: { alignItems: 'center', marginTop: 20 },
  ctaButton: { backgroundColor: theme.colors.primary, paddingHorizontal: 48, paddingVertical: 18, borderRadius: 12, ...theme.shadows.card },
  ctaButtonMobile: { paddingHorizontal: 32, paddingVertical: 14 },
  ctaButtonText: { color: theme.colors.surface, fontSize: 16, fontFamily: theme.typography.fontFamily.extrabold, letterSpacing: 0.5 },
});