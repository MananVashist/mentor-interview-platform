import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Platform, ScrollView } from 'react-native';
import { useRouter, Link } from 'expo-router'; // 🟢 Added Link
import Head from 'expo-router/head';
import { PageLayout } from '@/components/PageLayout';
import { theme } from '@/lib/theme';
import { injectMultipleSchemas } from '@/lib/structured-data';

export default function About() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isSmall = width < 900;

  useEffect(() => {
    if (Platform.OS === 'web') {
      const orgSchema = { "@context": "https://schema.org", "@type": "Organization", "name": "CrackJobs", "description": "Democratizing interview prep." };
      const cleanup = injectMultipleSchemas([orgSchema]);
      return () => cleanup && cleanup();
    }
  }, []);

  return (
    <PageLayout>
      <Head>
        <title>About Us | CrackJobs Mission</title>
        <meta name="description" content="We connect job seekers with experienced mentors from top companies to democratize interview preparation." />
      </Head>

      <View style={[styles.content, isSmall && styles.contentMobile]}>
        <Text style={[styles.pageTitle, isSmall && styles.pageTitleMobile]} accessibilityRole="header" aria-level={1}>
          About CrackJobs
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle} accessibilityRole="header" aria-level={2}>Our Mission</Text>
          <Text style={styles.paragraph}>
            At CrackJobs, we believe that <Text style={styles.bold}>practice makes perfect</Text>. 
            Whether you are preparing for a <Link href="/interviews/product-management" style={styles.linkText}>Product Management</Link> round 
            or a <Link href="/interviews/data-scientist" style={styles.linkText}>Data Science</Link> deep dive, 
            landing your dream job shouldn't be a matter of luck. It should be a result of preparation and confidence built through real practice with industry professionals.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why CrackJobs?</Text>
          <View style={styles.features}>
            <View style={styles.featureItem}><Text style={styles.icon}>✅</Text><Text style={styles.featureText}>Practice with FAANG engineers & PMs</Text></View>
            <View style={styles.featureItem}><Text style={styles.icon}>✅</Text><Text style={styles.featureText}>Get honest, actionable feedback</Text></View>
            <View style={styles.featureItem}><Text style={styles.icon}>✅</Text><Text style={styles.featureText}>Flexible scheduling on your terms</Text></View>
          </View>
        </View>

        <View style={styles.ctaWrapper}>
           <TouchableOpacity style={styles.ctaButton} onPress={() => router.push('/auth/sign-up')}>
             <Text style={styles.ctaText}>START PRACTICING</Text>
           </TouchableOpacity>
        </View>
      </View>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  content: { maxWidth: 900, width: '100%', marginHorizontal: 'auto', paddingHorizontal: 40, paddingVertical: 60 },
  contentMobile: { paddingHorizontal: 20 },
  pageTitle: { fontFamily: theme.typography.fontFamily.extrabold, fontSize: 48, color: theme.colors.text.main, textAlign: 'center', marginBottom: 40 },
  pageTitleMobile: { fontSize: 36 },
  section: { marginBottom: 40 },
  sectionTitle: { fontFamily: theme.typography.fontFamily.bold, fontSize: 24, color: theme.colors.primary, marginBottom: 16 },
  paragraph: { fontFamily: theme.typography.fontFamily.regular, fontSize: 18, color: theme.colors.text.body, lineHeight: 28 },
  bold: { fontFamily: theme.typography.fontFamily.bold, color: theme.colors.text.main },
  // 🟢 New link style
  linkText: { fontFamily: theme.typography.fontFamily.bold, color: theme.colors.primary, textDecorationLine: 'underline' },
  features: { gap: 16 },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: { fontSize: 20 },
  featureText: { fontFamily: theme.typography.fontFamily.medium, fontSize: 18, color: theme.colors.text.main },
  ctaWrapper: { alignItems: 'center', marginTop: 20 },
  ctaButton: { backgroundColor: theme.colors.primary, paddingHorizontal: 40, paddingVertical: 16, borderRadius: 30 },
  ctaText: { color: theme.colors.surface, fontFamily: theme.typography.fontFamily.extrabold, fontSize: 16 },
});