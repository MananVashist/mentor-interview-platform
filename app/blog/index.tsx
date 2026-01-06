import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  Platform,
  ScrollView, // Changed to ScrollView for better web scrolling behavior
} from 'react-native';
import { useRouter } from 'expo-router';
import { PageLayout } from '@/components/PageLayout';
import { theme } from '@/lib/theme';
import { getAllPosts } from '@/data/blog-posts';
import { createBreadcrumbSchema, injectMultipleSchemas } from '@/lib/structured-data';
import { SEO } from '@/components/SEO';
import { SEO_CONFIG } from '@/config/seo';

export default function BlogListing() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isSmall = width < 900;
  const isMobile = width < 600;

  const posts = getAllPosts();

  useEffect(() => {
    if (Platform.OS === 'web') {
      const blogSchema = {
        "@context": "https://schema.org",
        "@type": "Blog",
        "name": "CrackJobs Blog",
        "description": "Interview preparation tips, career advice, and industry insights"
      };
      const breadcrumb = createBreadcrumbSchema([
        { name: 'Home', url: 'https://crackjobs.com' },
        { name: 'Blog', url: 'https://crackjobs.com/blog' }
      ]);
      const cleanup = injectMultipleSchemas([blogSchema, breadcrumb]);
      return () => cleanup && cleanup();
    }
  }, []);

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
      <SEO {...SEO_CONFIG.blog.index} />

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
    marginHorizontal: 'auto', // Centers container on web
    paddingHorizontal: 40,
    paddingVertical: 60,
    alignSelf: 'center', // Helps center in RN views
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
    width: '48%', // Approx 2 columns
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    ...theme.shadows.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    cursor: 'pointer', // Web pointer
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