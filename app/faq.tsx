import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Platform, Linking } from 'react-native';
import Head from 'expo-router/head';
import { PageLayout } from '@/components/PageLayout';
import { theme } from '@/lib/theme';
import { createBreadcrumbSchema, injectMultipleSchemas } from '@/lib/structured-data';

export default function FAQ() {
  const { width } = useWindowDimensions();
  const isSmall = width < 900;
  
  const faqCategories = [
    {
      category: 'Getting Started',
      questions: [
        { 
          q: 'What is CrackJobs?', 
          a: 'CrackJobs is a mock interview platform connecting job seekers with FAANG professionals (PMs, Data Scientists, etc.) for realistic practice and feedback.' 
        },
        { 
          q: 'Is it free?', 
          a: 'Browsing mentors is free. You only pay when you successfully book a mock interview. Pricing varies by mentor, typically starting from affordable rates.' 
        },
      ],
    },
    {
      category: 'Booking & Refunds',
      questions: [
        { 
          q: 'Can I reschedule?', 
          a: 'Yes. If you reschedule with 48+ hours notice, it is free. Cancellations within 24-48 hours receive an 80% refund. Less than 24 hours receive a 50% refund.' 
        },
        { 
          q: 'What if a mentor cancels?', 
          a: 'You receive an immediate 100% refund automatically if the mentor cancels or does not show up.' 
        },
      ],
    },
  ];

  // SEO: FAQPage Schema
  useEffect(() => {
    if (Platform.OS === 'web') {
      const allQuestions = faqCategories.flatMap(cat => cat.questions);
      const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": allQuestions.map(item => ({
          "@type": "Question",
          "name": item.q,
          "acceptedAnswer": { "@type": "Answer", "text": item.a }
        }))
      };
      const breadcrumb = createBreadcrumbSchema([{ name: 'Home', url: 'https://crackjobs.com' }, { name: 'FAQ', url: 'https://crackjobs.com/faq' }]);
      const cleanup = injectMultipleSchemas([faqSchema, breadcrumb]);
      return () => cleanup && cleanup();
    }
  }, []);

  return (
    <PageLayout>
      <Head>
        <title>FAQ - Common Questions | CrackJobs</title>
        <meta name="description" content="Find answers about booking interviews, pricing, refunds, and mentor selection on CrackJobs." />
      </Head>

      <View style={[styles.content, isSmall && styles.contentMobile]}>
        <Text style={[styles.pageTitle, isSmall && styles.pageTitleMobile]} accessibilityRole="header" aria-level={1}>
          Frequently Asked Questions
        </Text>

        {faqCategories.map((category, idx) => (
          <View key={idx} style={styles.categorySection}>
            <Text style={styles.categoryTitle} accessibilityRole="header" aria-level={2}>{category.category}</Text>
            {category.questions.map((item, qIdx) => (
              <View key={qIdx} style={styles.faqCard}>
                <Text style={styles.question} accessibilityRole="header" aria-level={3}>{item.q}</Text>
                <Text style={styles.answer}>{item.a}</Text>
              </View>
            ))}
          </View>
        ))}

        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Still have questions?</Text>
          <TouchableOpacity style={styles.contactButton} onPress={() => Linking.openURL('mailto:crackjobshelpdesk@gmail.com')}>
            <Text style={styles.contactButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>
      </View>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  content: { maxWidth: 800, width: '100%', marginHorizontal: 'auto', paddingHorizontal: 40, paddingVertical: 60 },
  contentMobile: { paddingHorizontal: 20 },
  pageTitle: { fontFamily: theme.typography.fontFamily.extrabold, fontSize: 48, color: theme.colors.text.main, textAlign: 'center', marginBottom: 48 },
  pageTitleMobile: { fontSize: 32 },
  categorySection: { marginBottom: 40 },
  categoryTitle: { fontFamily: theme.typography.fontFamily.bold, fontSize: 24, color: theme.colors.primary, marginBottom: 16 },
  faqCard: { backgroundColor: theme.colors.surface, borderRadius: 12, padding: 24, marginBottom: 16, ...theme.shadows.card },
  question: { fontFamily: theme.typography.fontFamily.bold, fontSize: 18, color: theme.colors.text.main, marginBottom: 8 },
  answer: { fontFamily: theme.typography.fontFamily.regular, fontSize: 16, color: theme.colors.text.body, lineHeight: 24 },
  contactSection: { alignItems: 'center', marginTop: 40, padding: 32, backgroundColor: theme.colors.surface, borderRadius: 16 },
  contactTitle: { fontFamily: theme.typography.fontFamily.bold, fontSize: 20, marginBottom: 16 },
  contactButton: { backgroundColor: theme.colors.primary, paddingHorizontal: 32, paddingVertical: 12, borderRadius: 8 },
  contactButtonText: { color: theme.colors.surface, fontFamily: theme.typography.fontFamily.bold },
});