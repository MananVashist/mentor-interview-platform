import React, { useEffect } from 'react';
import { View, Text, StyleSheet, useWindowDimensions, Platform } from 'react-native';
import Head from 'expo-router/head';
import { PageLayout } from '@/components/PageLayout';
import { theme } from '@/lib/theme';
import { createBreadcrumbSchema, injectMultipleSchemas } from '@/lib/structured-data';

export default function CancellationPolicy() {
  const { width } = useWindowDimensions();
  const isSmall = width < 900;

  useEffect(() => {
    if (Platform.OS === 'web') {
      const breadcrumb = createBreadcrumbSchema([{ name: 'Home', url: 'https://crackjobs.com' }, { name: 'Refund Policy', url: 'https://crackjobs.com/cancellation-policy' }]);
      const cleanup = injectMultipleSchemas([breadcrumb]);
      return () => cleanup && cleanup();
    }
  }, []);

  return (
    <PageLayout>
      <Head>
        <title>Cancellation & Refund Policy | CrackJobs</title>
        <meta name="description" content="Understand our refund terms. 48+ hours notice gives a 100% refund. Fair policies for candidates and mentors." />
      </Head>

      <View style={[styles.content, isSmall && styles.contentMobile]}>
        <Text style={[styles.pageTitle, isSmall && styles.pageTitleMobile]} accessibilityRole="header" aria-level={1}>
          Cancellation & Refunds
        </Text>
        <Text style={styles.lastUpdated}>Last Updated: November 25, 2024</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Candidate Initiated Cancellation</Text>
          <Text style={styles.paragraph}>Refunds are determined based on the notice provided before the session start time:</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}><Text style={styles.bullet}>•</Text><Text style={styles.bulletText}><Text style={styles.bold}>48+ Hours:</Text> 100% Refund.</Text></View>
            <View style={styles.bulletItem}><Text style={styles.bullet}>•</Text><Text style={styles.bulletText}><Text style={styles.bold}>24-48 Hours:</Text> 80% Refund.</Text></View>
            <View style={styles.bulletItem}><Text style={styles.bullet}>•</Text><Text style={styles.bulletText}><Text style={styles.bold}>Less than 24 Hours:</Text> 50% Refund.</Text></View>
            <View style={styles.bulletItem}><Text style={styles.bullet}>•</Text><Text style={styles.bulletText}><Text style={styles.bold}>No-Show:</Text> 0% Refund.</Text></View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Mentor Cancellation</Text>
          <Text style={styles.paragraph}>If a mentor declines or cancels a session, the candidate receives a <Text style={styles.bold}>100% automatic refund</Text>.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Processing Timeline</Text>
          <Text style={styles.paragraph}>Approved refunds are processed to the original payment method within 5-7 business days.</Text>
        </View>
      </View>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  content: { maxWidth: 1000, width: '100%', marginHorizontal: 'auto', paddingHorizontal: 40, paddingVertical: 60 },
  contentMobile: { paddingHorizontal: 20 },
  pageTitle: { fontFamily: theme.typography.fontFamily.extrabold, fontSize: 42, color: theme.colors.text.main, textAlign: 'center', marginBottom: 16 },
  pageTitleMobile: { fontSize: 32 },
  lastUpdated: { fontFamily: theme.typography.fontFamily.regular, color: theme.colors.text.light, textAlign: 'center', marginBottom: 40 },
  section: { marginBottom: 32 },
  sectionTitle: { fontFamily: theme.typography.fontFamily.bold, fontSize: 24, color: theme.colors.text.main, marginBottom: 12 },
  paragraph: { fontFamily: theme.typography.fontFamily.regular, fontSize: 16, color: theme.colors.text.body, lineHeight: 26 },
  bulletList: { paddingLeft: 12, marginTop: 8 },
  bulletItem: { flexDirection: 'row', marginBottom: 8 },
  bullet: { color: theme.colors.primary, marginRight: 8, fontSize: 16 },
  bulletText: { fontFamily: theme.typography.fontFamily.regular, fontSize: 16, color: theme.colors.text.body, flex: 1 },
  bold: { fontFamily: theme.typography.fontFamily.bold, color: theme.colors.text.main },
});