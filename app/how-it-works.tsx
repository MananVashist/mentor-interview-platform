// app/how-it-works.tsx
import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import {
  StandardPageTemplate,
  StandardSection,
  StandardParagraph,
  StandardBold,
} from '@/components/StandardPageTemplate';
import { theme } from '@/lib/theme';
import { SEO } from '@/components/SEO';
import { SEO_CONFIG } from '@/config/seo';

export default function HowItWorks() {
  const router = useRouter();

  const steps = [
    { 
      number: '1', 
      title: 'Sign Up & Profile Creation', 
      description: 'Create your candidate account. Submit your resume and profile details to help mentors tailor the session to your background.' 
    },
    { 
      number: '2', 
      title: 'Browse Mentors & Book', 
      description: 'Filter vetted mentors by expertise (BA/DA, HR, PM, etc.). Choose a time slot, and securely complete the payment.' 
    },
    { 
      number: '3', 
      title: 'Confirmation & Invite', 
      description: 'Once the mentor accepts, a secure meeting link is automatically generated and will be available to join 15 mins before the slot begins.' 
    },
    { 
      number: '4', 
      title: 'Mock Interview Session', 
      description: 'Join the video session. Engage in a realistic, structured interview with real-time problem solving and role-play.' 
    },
    { 
      number: '5', 
      title: 'Get Actionable Feedback', 
      description: 'Receive a detailed evaluation report within 48 hours covering technical skills, communication, and specific areas for improvement.' 
    },
  ];

  // SEO: HowTo Schema
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Book a Mock Interview on CrackJobs",
    "description": "Learn how to prepare for your dream job interview with CrackJobs in 5 simple steps",
    "step": steps.map(step => ({
      "@type": "HowToStep",
      "name": step.title,
      "text": step.description,
      "position": step.number
    }))
  };

  return (
        <>    <SEO {...SEO_CONFIG.howItWorks} />

    <StandardPageTemplate
      title="How It Works - 5 Steps to Ace Your Interview | CrackJobs"
      metaDescription="Master the CrackJobs process: 1. Sign Up, 2. Book a FAANG Mentor, 3. Practice, 4. Get Feedback. The simplest way to prepare for tech interviews."
      pageUrl="https://crackjobs.com/how-it-works"
      pageTitle="How It Works"
      lastUpdated="November 25, 2024"
      additionalSchema={howToSchema}
      relatedPages={[
        {
          title: "Browse Mentors",
          description: "Find your perfect mentor",
          icon: "🔍",
          route: "/auth/sign-in"
        },
        {
          title: "FAQ",
          description: "Common questions answered",
          icon: "❓",
          route: "/faq"
        },
        {
          title: "Pricing",
          description: "Transparent, affordable rates",
          icon: "💰",
          route: "/auth/sign-up"
        }
      ]}
    >
      <StandardSection>
        <StandardParagraph>
          From sign-up to actionable insights in 5 simple steps. CrackJobs makes interview preparation effortless and effective.
        </StandardParagraph>
      </StandardSection>

      {/* Steps */}
      {steps.map((step, index) => (
        <View key={index} style={styles.stepCard}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>{step.number}</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle} accessibilityRole="header" aria-level={3}>
              {step.title}
            </Text>
            <StandardParagraph>{step.description}</StandardParagraph>
          </View>
        </View>
      ))}

      <StandardSection title="Why This Works">
        <StandardParagraph>
          <StandardBold>Real Interview Conditions</StandardBold>{'\n'}
          Our mentors simulate actual company interview environments, giving you the most authentic practice experience possible.
        </StandardParagraph>
        <StandardParagraph>
          <StandardBold>Immediate, Specific Feedback</StandardBold>{'\n'}
          Unlike watching YouTube videos or reading books, you get personalized feedback on YOUR performance, YOUR answers, and YOUR approach.
        </StandardParagraph>
        <StandardParagraph>
          <StandardBold>Iterative Improvement</StandardBold>{'\n'}
          Each session builds on the last. Track your progress, address weak areas, and build confidence with every mock interview.
        </StandardParagraph>
      </StandardSection>

      <StandardSection title="What to Expect">
        <StandardParagraph>
          <StandardBold>Before the Session:</StandardBold>{'\n'}
          • Receive a confirmation on the app with session details{'\n'}
          • Prepare for the interview as if its the real thing
        </StandardParagraph>
        <StandardParagraph>
          <StandardBold>During the Session (60-90 mins):</StandardBold>{'\n'}
          • Brief introductions (5 mins){'\n'}
          • Mock interview questions (45 mins){'\n'}
          • Live feedback and discussion (10-15     mins)
        </StandardParagraph>
        <StandardParagraph>
          <StandardBold>After the Session:</StandardBold>{'\n'}
          • Receive detailed written feedback within 48 hours{'\n'}
          • Review evaluation across multiple criteria{'\n'}
          • Book follow-up sessions if needed
        </StandardParagraph>
      </StandardSection>

      <StandardSection title="Success Tips">
        <StandardParagraph>
          🎯 <StandardBold>Be prepared:</StandardBold> Treat it like a real interview{'\n'}
          💬 <StandardBold>Communicate clearly:</StandardBold> Think out loud during problem-solving{'\n'}
          📝 <StandardBold>Take notes:</StandardBold> Write down feedback immediately{'\n'}
          🔄 <StandardBold>Iterate:</StandardBold> Book multiple sessions to track improvement{'\n'}
          ❓ <StandardBold>Ask questions:</StandardBold> Use the Q&A time wisely
        </StandardParagraph>
      </StandardSection>

      {/* CTA Section */}
      <View style={styles.ctaSection}>
        <Text style={styles.ctaTitle}>Ready to Start?</Text>
        <StandardParagraph style={{ textAlign: 'center', marginBottom: 20 }}>
          Join hundreds of candidates who've improved their interview skills with CrackJobs.
        </StandardParagraph>
        <TouchableOpacity 
          style={styles.ctaButton}
          onPress={() => router.push('/auth/sign-up')}
        >
          <Text style={styles.ctaButtonText}>GET STARTED NOW</Text>
        </TouchableOpacity>
      </View>
    </StandardPageTemplate>
    </>
  );
}

const styles = StyleSheet.create({
  stepCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 32,
    alignItems: 'flex-start',
    gap: 24,
    marginBottom: 24,
    ...theme.shadows.card,
  },
  stepNumber: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontFamily: theme.typography.fontFamily.extrabold,
    fontSize: 24,
    color: '#fff',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 20,
    color: theme.colors.text.main,
    marginBottom: 8,
  },
  ctaSection: {
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    padding: 48,
    alignItems: 'center',
    marginTop: 40,
  },
  ctaTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 28,
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  ctaButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 999,
  },
  ctaButtonText: {
    fontFamily: theme.typography.fontFamily.extrabold,
    fontSize: 14,
    color: theme.colors.primary,
    letterSpacing: 0.5,
  },
});