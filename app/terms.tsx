import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Platform, Linking } from 'react-native';
import Head from 'expo-router/head';
import { PageLayout } from '@/components/PageLayout';
import { theme } from '@/lib/theme';
import { createBreadcrumbSchema, injectMultipleSchemas } from '@/lib/structured-data';

export default function TermsAndConditions() {
  const { width } = useWindowDimensions();
  const isSmall = width < 900;

  useEffect(() => {
    if (Platform.OS === 'web') {
      const breadcrumb = createBreadcrumbSchema([{ name: 'Home', url: 'https://crackjobs.com' }, { name: 'Terms', url: 'https://crackjobs.com/terms' }]);
      const cleanup = injectMultipleSchemas([breadcrumb]);
      return () => cleanup && cleanup();
    }
  }, []);

  return (
    <PageLayout>
      <Head>
        <title>Terms & Conditions | CrackJobs</title>
        <meta name="description" content="Read the user agreement for CrackJobs. Guidelines for candidates and mentors using our mock interview platform." />
      </Head>

      <View style={[styles.content, isSmall && styles.contentMobile]}>
        <Text style={[styles.pageTitle, isSmall && styles.pageTitleMobile]} accessibilityRole="header" aria-level={1}>
          Terms & Conditions
        </Text>
        <Text style={styles.lastUpdated}>Last Updated: November 25, 2024</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle} accessibilityRole="header" aria-level={2}>Acceptance of Terms</Text>
          <Text style={styles.paragraph}>By accessing and using CrackJobs, you accept and agree to be bound by these terms. If you do not agree, please do not use our services.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Use of Service</Text>
          <Text style={styles.paragraph}>Users agree to:</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}><Text style={styles.bullet}>•</Text><Text style={styles.bulletText}>Provide accurate personal and professional information.</Text></View>
            <View style={styles.bulletItem}><Text style={styles.bullet}>•</Text><Text style={styles.bulletText}>Use the service for lawful educational purposes only.</Text></View>
            <View style={styles.bulletItem}><Text style={styles.bullet}>•</Text><Text style={styles.bulletText}>Treat mentors and staff with respect.</Text></View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking & Payments</Text>
          <Text style={styles.paragraph}>
            All session payments are held in escrow. Funds are released to the mentor only upon successful completion of the session and submission of feedback.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Liability</Text>
          <Text style={styles.paragraph}>
            CrackJobs connects users with independent mentors. We are not liable for the advice given by mentors or employment outcomes.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <TouchableOpacity onPress={() => Linking.openURL('mailto:crackjobshelpdesk@gmail.com')}>
            <Text style={styles.link}>crackjobshelpdesk@gmail.com</Text>
          </TouchableOpacity>
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
  link: { color: theme.colors.primary, fontFamily: theme.typography.fontFamily.semibold, fontSize: 16 },
});