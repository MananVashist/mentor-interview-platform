import React, { useEffect, useState } from 'react';
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
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter posts by category
  const filteredPosts = selectedCategory === 'All' 
    ? posts 
    : posts.filter(post => post.tags?.includes(selectedCategory));

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const categories = ['All', 'Product Management', 'Data Analytics', 'Data Science', 'HR'];

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
        <meta name="keywords" content="interview tips, career advice, interview preparation blog, mock interview insights, interview success stories, FAANG interview tips, product management tips, data analytics tips, SQL interview tips, machine learning interviews, behavioral interview guide, technical interview prep, mock interview benefits, Amazon interview, Google interview, Meta interview" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://crackjobs.com/blog" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://crackjobs.com/blog" />
        <meta property="og:site_name" content="CrackJobs" />
        <meta property="og:title" content="Interview Preparation Blog | Tips & Insights - CrackJobs" />
        <meta property="og:description" content="Expert advice on interview preparation, mock interview tips, and career guidance. Success stories from candidates who landed FAANG jobs." />
        <meta property="og:image" content="https://crackjobs.com/og-image.png" />
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
        <meta name="twitter:image" content="https://crackjobs.com/og-image.png" />
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
              {posts.length} articles • Interview tips, career advice, and industry insights
            </Text>
          </View>

          {/* Category Filter */}
          <View style={styles.categories}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryPill,
                  selectedCategory === category && styles.categoryPillActive
                ]}
                onPress={() => setSelectedCategory(category)}
                accessibilityRole="button"
                accessibilityLabel={`Filter by ${category}`}
              >
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextActive
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Blog Posts Grid */}
          <View style={[styles.grid, isSmall && styles.gridMobile]}>
            {filteredPosts.map((post) => (
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
                  <View style={styles.cardMeta}>
                    <Text style={styles.author}>{post.author}</Text>
                    <Text style={styles.date}>{formatDate(post.publishedAt)}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Internal Links Section - Practice Your Interview Skills */}
          <View style={styles.ctaSection}>
            <Text style={[styles.ctaTitle, isMobile && styles.ctaTitleMobile]}>
              Ready to Practice Your Interview Skills?
            </Text>
            <Text style={styles.ctaDesc}>
              Book a 1:1 mock interview with expert mentors from Google, Meta, Amazon
            </Text>
            
            <View style={[styles.ctaLinks, isMobile && styles.ctaLinksMobile]}>
              <TouchableOpacity 
                style={styles.ctaButton}
                onPress={() => router.push('/interviews/product-management')}
                accessibilityRole="button"
                accessibilityLabel="Practice Product Management interviews"
              >
                <Text style={styles.ctaButtonText}>📊 PM Interviews</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.ctaButton}
                onPress={() => router.push('/interviews/data-analytics')}
                accessibilityRole="button"
                accessibilityLabel="Practice Data Analytics interviews"
              >
                <Text style={styles.ctaButtonText}>📈 Data Analytics</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.ctaButton}
                onPress={() => router.push('/interviews/data-science')}
                accessibilityRole="button"
                accessibilityLabel="Practice Data Science interviews"
              >
                <Text style={styles.ctaButtonText}>🤖 Data Science</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.ctaButton}
                onPress={() => router.push('/interviews/hr')}
                accessibilityRole="button"
                accessibilityLabel="Practice HR interviews"
              >
                <Text style={styles.ctaButtonText}>👥 HR Interviews</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.ctaPrimary}
              onPress={() => router.push('/auth/sign-up')}
              accessibilityRole="button"
              accessibilityLabel="Browse all mentors and book interview"
            >
              <Text style={styles.ctaPrimaryText}>Browse All Mentors →</Text>
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
    paddingVertical: 60,
  },
  container: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 24,
  },
  containerMobile: {
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 56,
    fontWeight: '900',
    color: theme.colors.text.main,
    marginBottom: 16,
    textAlign: 'center',
  },
  titleMobile: {
    fontSize: 40,
  },
  subtitle: {
    fontSize: 18,
    color: theme.colors.text.light,
    textAlign: 'center',
    maxWidth: 600,
  },
  
  // Category Filter
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 48,
    justifyContent: 'center',
  },
  categoryPill: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 100,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  categoryPillActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.main,
  },
  categoryTextActive: {
    color: 'white',
  },
  
  // Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 32,
    marginBottom: 80,
  },
  gridMobile: {
    gap: 24,
  },
  card: {
    flex: 1,
    minWidth: 320,
    maxWidth: 380,
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardMobile: {
    minWidth: '100%',
  },
  thumbnail: {
    width: '100%',
    height: 220,
    backgroundColor: theme.colors.cream,
  },
  cardContent: {
    padding: 24,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: theme.colors.cream,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.text.main,
    marginBottom: 12,
    lineHeight: 30,
  },
  excerpt: {
    fontSize: 15,
    color: theme.colors.text.light,
    lineHeight: 24,
    marginBottom: 16,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  author: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.main,
  },
  date: {
    fontSize: 14,
    color: theme.colors.text.light,
  },
  
  // CTA Section
  ctaSection: {
    backgroundColor: theme.colors.cream,
    padding: 60,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  ctaTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: theme.colors.text.main,
    textAlign: 'center',
    marginBottom: 16,
    maxWidth: 700,
  },
  ctaTitleMobile: {
    fontSize: 28,
  },
  ctaDesc: {
    fontSize: 18,
    color: theme.colors.text.light,
    textAlign: 'center',
    marginBottom: 36,
    maxWidth: 600,
    lineHeight: 28,
  },
  ctaLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    marginBottom: 28,
  },
  ctaLinksMobile: {
    flexDirection: 'column',
    width: '100%',
  },
  ctaButton: {
    backgroundColor: 'white',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    minWidth: 160,
  },
  ctaButtonText: {
    color: theme.colors.primary,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  ctaPrimary: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 100,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  ctaPrimaryText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '700',
  },
});