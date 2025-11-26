import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Platform } from 'react-native';
import { Link } from 'expo-router';
import Head from 'expo-router/head';
import { PageLayout } from '@/components/PageLayout';
import { theme } from '@/lib/theme';
import { createBreadcrumbSchema, injectMultipleSchemas } from '@/lib/structured-data';

export default function Blog() {
  const { width } = useWindowDimensions();
  const isSmall = width < 900;
  
  const posts = [
    { title: 'Top 10 Coding Interview Mistakes', date: 'Coming Soon', excerpt: 'Common pitfalls candidates make in DSA rounds.' },
    { title: 'System Design: Scalability 101', date: 'Coming Soon', excerpt: 'How to approach large scale system design problems.' },
    { title: 'Negotiating Your FAANG Offer', date: 'Coming Soon', excerpt: 'Strategies to get the compensation you deserve.' },
    { title: 'The STAR Method Explained', date: 'Coming Soon', excerpt: 'Mastering behavioral questions with structured answers.' },
  ];

  useEffect(() => {
    if (Platform.OS === 'web') {
      const blogSchema = { "@context": "https://schema.org", "@type": "Blog", "name": "CrackJobs Blog" };
      const cleanup = injectMultipleSchemas([blogSchema]);
      return () => cleanup && cleanup();
    }
  }, []);

  return (
    <PageLayout>
      <Head>
        <title>Interview Prep Blog | CrackJobs</title>
        <meta name="description" content="Read expert advice on coding interviews, system design, and career growth." />
      </Head>

      <View style={[styles.content, isSmall && styles.contentMobile]}>
        <Text style={[styles.pageTitle, isSmall && styles.pageTitleMobile]} accessibilityRole="header" aria-level={1}>
          CrackJobs Blog
        </Text>
        <Text style={styles.subtitle}>Insights from industry insiders</Text>

        <View style={[styles.grid, isSmall && styles.gridMobile]}>
          {posts.map((post, index) => (
            <View key={index} style={[styles.card, isSmall && styles.cardMobile]}>
              <Text style={styles.cardDate}>{post.date}</Text>
              <Text style={styles.cardTitle} accessibilityRole="header" aria-level={2}>{post.title}</Text>
              <Text style={styles.cardExcerpt}>{post.excerpt}</Text>
              <TouchableOpacity><Text style={styles.readMore}>Read More →</Text></TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.banner}>
          <Text style={styles.bannerText}>📝 Blog launching soon! Stay tuned.</Text>
        </View>

        {/* 🟢 SEO: Category Links to prevent dead-ends */}
        <View style={styles.categories}>
          <Text style={styles.catHeader}>Browse by Role</Text>
          <View style={styles.catLinks}>
            <Link href="/interviews/product-management" style={styles.catLink}>Product Management</Link>
            <Link href="/interviews/data-analyst" style={styles.catLink}>Data Analytics</Link>
            <Link href="/interviews/data-scientist" style={styles.catLink}>Data Science</Link>
            <Link href="/interviews/hr" style={styles.catLink}>HR & Behavioral</Link>
          </View>
        </View>
      </View>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  content: { maxWidth: 1200, width: '100%', marginHorizontal: 'auto', paddingHorizontal: 40, paddingVertical: 60 },
  contentMobile: { paddingHorizontal: 20 },
  pageTitle: { fontFamily: theme.typography.fontFamily.extrabold, fontSize: 48, color: theme.colors.text.main, textAlign: 'center' },
  pageTitleMobile: { fontSize: 32 },
  subtitle: { fontFamily: theme.typography.fontFamily.regular, fontSize: 18, color: theme.colors.text.light, textAlign: 'center', marginBottom: 48 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 24 },
  gridMobile: { flexDirection: 'column' },
  card: { flex: 1, minWidth: 300, backgroundColor: theme.colors.surface, borderRadius: 16, padding: 24, ...theme.shadows.card },
  cardMobile: { minWidth: '100%' },
  cardDate: { color: theme.colors.primary, fontFamily: theme.typography.fontFamily.bold, fontSize: 12, marginBottom: 8 },
  cardTitle: { fontFamily: theme.typography.fontFamily.bold, fontSize: 20, color: theme.colors.text.main, marginBottom: 8 },
  cardExcerpt: { fontFamily: theme.typography.fontFamily.regular, fontSize: 14, color: theme.colors.text.body, lineHeight: 22, marginBottom: 16 },
  readMore: { color: theme.colors.primary, fontFamily: theme.typography.fontFamily.semibold },
  banner: { marginTop: 40, padding: 24, backgroundColor: theme.colors.pricing.blueBg, borderRadius: 12, alignItems: 'center' },
  bannerText: { fontFamily: theme.typography.fontFamily.medium, color: theme.colors.pricing.blueIcon },
  // 🟢 New Category Styles
  categories: { marginTop: 60, alignItems: 'center' },
  catHeader: { fontSize: 20, fontFamily: theme.typography.fontFamily.bold, marginBottom: 16, color: theme.colors.text.main },
  catLinks: { flexDirection: 'row', gap: 20, flexWrap: 'wrap', justifyContent: 'center' },
  catLink: { color: theme.colors.primary, fontFamily: theme.typography.fontFamily.medium, fontSize: 16 },
});