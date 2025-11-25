import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Platform, Linking } from 'react-native';
import Head from 'expo-router/head';
import { PageLayout } from '@/components/PageLayout';
import { theme } from '@/lib/theme';
import { createBreadcrumbSchema, injectMultipleSchemas } from '@/lib/structured-data';

export default function PrivacyPolicy() {
  const { width } = useWindowDimensions();
  const isSmall = width < 900;

  useEffect(() => {
    if (Platform.OS === 'web') {
      const breadcrumb = createBreadcrumbSchema([{ name: 'Home', url: 'https://crackjobs.com' }, { name: 'Privacy Policy', url: 'https://crackjobs.com/privacy' }]);
      const cleanup = injectMultipleSchemas([breadcrumb]);
      return () => cleanup && cleanup();
    }
  }, []);

  return (
    <PageLayout>
      <Head>
        <title>Privacy Policy | CrackJobs</title>
        <meta name="description" content="We value your privacy. Learn how CrackJobs handles your data, resumes, and interview recordings." />
      </Head>

      <View style={[styles.content, isSmall && styles.contentMobile]}>
        <Text style={[styles.pageTitle, isSmall && styles.pageTitleMobile]} accessibilityRole="header" aria-level={1}>
          Privacy Policy
        </Text>
        <Text style={styles.lastUpdated}>Last Updated: November 25, 2024</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle} accessibilityRole="header" aria-level={2}>Introduction</Text>
          <Text style={styles.paragraph}>At CrackJobs, we take your privacy seriously. This Privacy Policy explains how we collect, use, and safeguard your information.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Information We Collect</Text>
          <Text style={styles.paragraph}>We collect information provided directly by you, including:</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}><Text style={styles.bullet}>•</Text><Text style={styles.bulletText}>Personal Identifiers: Name, email, phone number.</Text></View>
            <View style={styles.bulletItem}><Text style={styles.bullet}>•</Text><Text style={styles.bulletText}>Professional Info: Resume, job role, experience.</Text></View>
            <View style={styles.bulletItem}><Text style={styles.bullet}>•</Text><Text style={styles.bulletText}>Session Content: Interview recordings and written feedback.</Text></View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Security</Text>
          <Text style={styles.paragraph}>We utilize Supabase RLS and encrypted storage to protect your data. Payment data is handled securely via Razorpay.</Text>
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