import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Platform, Linking } from 'react-native';
import { Link } from 'expo-router';
import Head from 'expo-router/head';
import { PageLayout } from '@/components/PageLayout';
import { theme } from '@/lib/theme';
import { injectMultipleSchemas } from '@/lib/structured-data';

export default function Contact() {
  const { width } = useWindowDimensions();
  const isSmall = width < 900;

  useEffect(() => {
    if (Platform.OS === 'web') {
      const contactSchema = { 
        "@context": "https://schema.org", "@type": "ContactPage", 
        "mainEntity": { "@type": "Organization", "email": "crackjobshelpdesk@gmail.com" } 
      };
      const cleanup = injectMultipleSchemas([contactSchema]);
      return () => cleanup && cleanup();
    }
  }, []);

  const handleEmail = (email: string) => Linking.openURL(`mailto:${email}`);

  return (
    <PageLayout>
      <Head>
        <title>Contact Us | CrackJobs Support</title>
        <meta name="description" content="Get in touch with the CrackJobs team for support, partnerships, or mentor applications." />
      </Head>

      <View style={[styles.content, isSmall && styles.contentMobile]}>
        <Text style={[styles.pageTitle, isSmall && styles.pageTitleMobile]} accessibilityRole="header" aria-level={1}>
          Get in Touch
        </Text>
        <Text style={styles.subtitle}>We'd love to hear from you!</Text>

        <View style={[styles.grid, isSmall && styles.gridMobile]}>
          <View style={styles.card}>
            <Text style={styles.icon}>🛟</Text>
            <Text style={styles.cardTitle}>Support</Text>
            <TouchableOpacity onPress={() => handleEmail('crackjobshelpdesk@gmail.com')}>
              <Text style={styles.email}>crackjobshelpdesk@gmail.com</Text>
            </TouchableOpacity>
            
            <Text style={styles.faqLink}>
              Have a quick question? Check our <Link href="/faq" style={{textDecorationLine: 'underline'}}>FAQ</Link>
            </Text>
          </View>
        </View>
      </View>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  content: { maxWidth: 1000, width: '100%', marginHorizontal: 'auto', paddingHorizontal: 40, paddingVertical: 60 },
  contentMobile: { paddingHorizontal: 20 },
  pageTitle: { fontFamily: theme.typography.fontFamily.extrabold, fontSize: 48, color: theme.colors.text.main, textAlign: 'center' },
  pageTitleMobile: { fontSize: 32 },
  subtitle: { fontFamily: theme.typography.fontFamily.regular, fontSize: 18, color: theme.colors.text.light, textAlign: 'center', marginBottom: 48 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 24, justifyContent: 'center' },
  gridMobile: { flexDirection: 'column' },
  card: { flex: 1, minWidth: 250, backgroundColor: theme.colors.surface, borderRadius: 16, padding: 32, alignItems: 'center', ...theme.shadows.card },
  icon: { fontSize: 40, marginBottom: 16 },
  cardTitle: { fontFamily: theme.typography.fontFamily.bold, fontSize: 20, color: theme.colors.text.main, marginBottom: 8 },
  email: { color: theme.colors.primary, fontFamily: theme.typography.fontFamily.semibold, fontSize: 16, textDecorationLine: 'underline', marginBottom: 12 },
  faqLink: { color: theme.colors.text.body, fontSize: 14, fontFamily: theme.typography.fontFamily.regular },
});