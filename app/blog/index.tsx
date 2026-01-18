import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import Head from 'expo-router/head';
import { PageLayout } from '@/components/PageLayout';
import { theme } from '@/lib/theme';
import { getAllPosts } from '@/data/blog-posts';

export default function BlogListing() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isSmall = width < 900;
  const isMobile = width < 600;

  const posts = getAllPosts();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <PageLayout>
      {/* 🔥 COMPREHENSIVE SEO - HARDCODED FOR BLOG INDEX */}
      <Head>
        {/* Essential Meta Tags */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        
        {/* Primary SEO Tags */}
        <title>Interview Preparation Blog | Tips & Insights - CrackJobs</title>
        <meta name="description" content="Expert advice on interview preparation, mock interview tips, career guidance, and success stories from candidates who landed their dream jobs at Google, Amazon, Meta." />
        <meta name="keywords" content="interview tips, career advice, interview preparation blog, mock interview insights, interview success stories, FAANG interview tips, product management tips, data analytics tips" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://crackjobs.com/blog" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://crackjobs.com/blog" />
        <meta property="og:site_name" content="CrackJobs" />
        <meta property="og:title" content="Interview Preparation Blog | Tips & Insights - CrackJobs" />
        <meta property="og:description" content="Expert advice on interview preparation, mock interview tips, and career guidance. Success stories from candidates who landed FAANG jobs." />
        <meta property="og:image" content="https://crackjobs.com/og-images/blog.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="CrackJobs Interview Preparation Blog" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@crackjobs" />
        <meta name="twitter:creator" content="@crackjobs" />
        <meta name="twitter:title" content="Interview Preparation Blog - CrackJobs" />
        <meta name="twitter:description" content="Expert interview tips, career advice, and success stories from FAANG candidates." />
        <meta name="twitter:image" content="https://crackjobs.com/og-images/blog.png" />
        <meta name="twitter:image:alt" content="CrackJobs Blog" />
        
        {/* Additional SEO Tags */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="3 days" />
        <meta name="author" content="CrackJobs" />
        
        {/* Geo Tags */}
        <meta name="geo.region" content="IN" />
        <meta name="geo.placename" content="India" />
        
        {/* 🔥 COMPREHENSIVE STRUCTURED DATA */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Blog",
                  "@id": "https://crackjobs.com/blog#blog",
                  "url": "https://crackjobs.com/blog",
                  "name": "CrackJobs Interview Preparation Blog",
                  "description": "Interview preparation tips, career advice, and industry insights for aspiring professionals",
                  "publisher": {
                    "@id": "https://crackjobs.com/#organization"
                  },
                  "inLanguage": "en-US",
                  "blogPost": posts.slice(0, 5).map((post, index) => ({
                    "@type": "BlogPosting",
                    "@id": `https://crackjobs.com/blog/${post.slug}#article`,
                    "headline": post.title,
                    "description": post.excerpt,
                    "image": post.thumbnailUrl || "https://crackjobs.com/og-image.png",
                    "datePublished": post.publishedAt,
                    "dateModified": post.publishedAt,
                    "author": {
                      "@type": "Person",
                      "name": post.author
                    },
                    "publisher": {
                      "@id": "https://crackjobs.com/#organization"
                    },
                    "url": `https://crackjobs.com/blog/${post.slug}`,
                    "mainEntityOfPage": {
                      "@type": "WebPage",
                      "@id": `https://crackjobs.com/blog/${post.slug}`
                    }
                  }))
                },
                {
                  "@type": "WebPage",
                  "@id": "https://crackjobs.com/blog#webpage",
                  "url": "https://crackjobs.com/blog",
                  "name": "Interview Preparation Blog | Tips & Insights - CrackJobs",
                  "description": "Expert advice on interview preparation, mock interview tips, career guidance, and success stories",
                  "isPartOf": {
                    "@id": "https://crackjobs.com/#website"
                  },
                  "about": {
                    "@id": "https://crackjobs.com/#organization"
                  },
                  "breadcrumb": {
                    "@id": "https://crackjobs.com/blog#breadcrumb"
                  },
                  "inLanguage": "en-US",
                  "potentialAction": [{
                    "@type": "ReadAction",
                    "target": ["https://crackjobs.com/blog"]
                  }]
                },
                {
                  "@type": "BreadcrumbList",
                  "@id": "https://crackjobs.com/blog#breadcrumb",
                  "itemListElement": [
                    {
                      "@type": "ListItem",
                      "position": 1,
                      "name": "Home",
                      "item": "https://crackjobs.com"
                    },
                    {
                      "@type": "ListItem",
                      "position": 2,
                      "name": "Blog",
                      "item": "https://crackjobs.com/blog"
                    }
                  ]
                },
                {
                  "@type": "Organization",
                  "@id": "https://crackjobs.com/#organization",
                  "name": "CrackJobs",
                  "url": "https://crackjobs.com",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://crackjobs.com/logo.png",
                    "contentUrl": "https://crackjobs.com/logo.png",
                    "caption": "CrackJobs"
                  },
                  "description": "Anonymous mock interview platform connecting job seekers with expert mentors",
                  "sameAs": [
                    "https://www.linkedin.com/company/crackjobs",
                    "https://twitter.com/crackjobs"
                  ]
                },
                {
                  "@type": "WebSite",
                  "@id": "https://crackjobs.com/#website",
                  "url": "https://crackjobs.com/",
                  "name": "CrackJobs",
                  "description": "Anonymous mock interviews with expert mentors from top companies",
                  "publisher": {
                    "@id": "https://crackjobs.com/#organization"
                  },
                  "inLanguage": "en-US"
                }
              ]
            })
          }}
        />
      </Head>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={[styles.container, isSmall && styles.containerMobile]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, isMobile && styles.titleMobile]} accessibilityRole="header" aria-level={1}>
              Blog
            </Text>
            <Text style={styles.subtitle}>
              Interview tips, career advice, and industry insights
            </Text>
          </View>

          {/* Blog Posts Grid */}
          <View style={[styles.grid, isSmall && styles.gridMobile]}>
            {posts.map((post) => (
              <TouchableOpacity
                key={post.slug}
                style={[styles.card, isSmall && styles.cardMobile]}
                onPress={() => router.push(`/blog/${post.slug}` as any)}
                accessibilityRole="link"
                activeOpacity={0.9}
              >
                {/* Thumbnail */}
                {post.thumbnailUrl && (
                  <Image
                    source={{ uri: post.thumbnailUrl }}
                    style={styles.thumbnail}
                    resizeMode="cover"
                  />
                )}

                {/* Content */}
                <View style={styles.cardContent}>
                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <View style={styles.tags}>
                      {post.tags.slice(0, 2).map((tag) => (
                        <View key={tag} style={styles.tag}>
                          <Text style={styles.tagText}>{tag}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Title */}
                  <Text style={styles.cardTitle} accessibilityRole="header" aria-level={2}>
                    {post.title}
                  </Text>

                  {/* Excerpt */}
                  <Text style={styles.excerpt} numberOfLines={3}>
                    {post.excerpt}
                  </Text>

                  {/* Meta */}
                  <View style={styles.meta}>
                    <Text style={styles.metaText}>{post.author}</Text>
                    <Text style={styles.metaDot}>•</Text>
                    <Text style={styles.metaText}>{formatDate(post.publishedAt)}</Text>
                  </View>

                  {/* Read More Link */}
                  <Text style={styles.readMore}>Read More →</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* CTA Section */}
          <View style={styles.ctaSection}>
            <Text style={styles.ctaTitle}>Ready to Practice?</Text>
            <Text style={styles.ctaText}>
              Book a mock interview with industry experts and get personalized feedback
            </Text>
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => router.push('/auth/sign-up')}
            >
              <Text style={styles.ctaButtonText}>GET STARTED</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    maxWidth: 1200,
    width: '100%',
    marginHorizontal: 'auto',
    paddingHorizontal: 40,
    paddingVertical: 60,
    alignSelf: 'center',
  } as any,
  containerMobile: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },

  // Header
  header: {
    marginBottom: 48,
    alignItems: 'center',
  },
  title: {
    fontFamily: theme.typography.fontFamily.extrabold,
    fontSize: 48,
    color: theme.colors.text.main,
    textAlign: 'center',
    marginBottom: 12,
  },
  titleMobile: {
    fontSize: 32,
  },
  subtitle: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: 18,
    color: theme.colors.text.body,
    textAlign: 'center',
    maxWidth: 600,
  },

  // Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    marginBottom: 60,
  },
  gridMobile: {
    flexDirection: 'column',
  },

  // Card
  card: {
    width: '48%',
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    ...theme.shadows.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    cursor: 'pointer',
  } as any,
  cardMobile: {
    width: '100%',
  },

  thumbnail: {
    width: '100%',
    height: 220,
    backgroundColor: theme.colors.gray[100],
  },

  cardContent: {
    padding: 24,
  },

  tags: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: theme.colors.gray[100],
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 12,
    color: theme.colors.primary,
    textTransform: 'uppercase',
  },

  cardTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 22,
    color: theme.colors.text.main,
    marginBottom: 12,
    lineHeight: 30,
  },

  excerpt: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: 16,
    color: theme.colors.text.body,
    lineHeight: 24,
    marginBottom: 16,
  },

  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  metaText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: 14,
    color: theme.colors.text.light,
  },
  metaDot: {
    color: theme.colors.text.light,
  },

  readMore: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 14,
    color: theme.colors.primary,
  },

  // CTA Section
  ctaSection: {
    backgroundColor: theme.colors.gray[50],
    borderRadius: 16,
    padding: 48,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  ctaTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 28,
    color: theme.colors.text.main,
    marginBottom: 12,
    textAlign: 'center',
  },
  ctaText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: 16,
    color: theme.colors.text.body,
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: 500,
  },
  ctaButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    ...theme.shadows.card,
    cursor: 'pointer',
  } as any,
  ctaButtonText: {
    color: theme.colors.surface,
    fontFamily: theme.typography.fontFamily.extrabold,
    fontSize: 14,
    letterSpacing: 0.5,
  },
});