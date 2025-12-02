// app/blog/[slug].tsx
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Head from 'expo-router/head';
import { PageLayout } from '@/components/PageLayout';
import { BlogRenderer } from '@/components/BlogRenderer';
import { theme } from '@/lib/theme';
import { getPostBySlug } from '@/data/blog-posts';
import { createBreadcrumbSchema, createArticleSchema, injectMultipleSchemas } from '@/lib/structured-data';
import { Ionicons } from '@expo/vector-icons';

export default function BlogPost() {
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { width } = useWindowDimensions();
  const isSmall = width < 900;

  // Get the blog post
  const post = getPostBySlug(slug as string);

  // If post not found, show 404
  if (!post) {
    return (
      <PageLayout>
        <View style={styles.notFound}>
          <Text style={styles.notFoundTitle}>404 - Post Not Found</Text>
          <Text style={styles.notFoundText}>
            The blog post you're looking for doesn't exist.
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push('/blog')}
          >
            <Text style={styles.backButtonText}>← Back to Blog</Text>
          </TouchableOpacity>
        </View>
      </PageLayout>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  useEffect(() => {
    if (Platform.OS === 'web' && post) {
      const articleSchema = createArticleSchema(
        post.title,
        post.excerpt,
        post.publishedAt,
        post.publishedAt,
        post.thumbnailUrl || 'https://crackjobs.com/assets/default-blog.png',
        post.author
      );
      const breadcrumb = createBreadcrumbSchema([
        { name: 'Home', url: 'https://crackjobs.com' },
        { name: 'Blog', url: 'https://crackjobs.com/blog' },
        { name: post.title, url: `https://crackjobs.com/blog/${post.slug}` }
      ]);
      const cleanup = injectMultipleSchemas([articleSchema, breadcrumb]);
      return () => cleanup && cleanup();
    }
  }, [post]);

  const contentWidth = isSmall ? width - 40 : 800;

  return (
    <PageLayout>
      <Head>
        <title>{post.title} | CrackJobs Blog</title>
        <meta name="description" content={post.excerpt} />
        {post.thumbnailUrl && <meta property="og:image" content={post.thumbnailUrl} />}
      </Head>

      <ScrollView>
        <View style={[styles.container, isSmall && styles.containerMobile]}>
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backLink}
            onPress={() => router.push('/blog')}
          >
            <Ionicons name="arrow-back" size={20} color={theme.colors.primary} />
            <Text style={styles.backLinkText}>Back to Blog</Text>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <View style={styles.tags}>
                {post.tags.map((tag) => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Title */}
            <Text style={[styles.title, isSmall && styles.titleMobile]} accessibilityRole="header" aria-level={1}>
              {post.title}
            </Text>

            {/* Meta */}
            <View style={styles.meta}>
              <Text style={styles.metaText}>{post.author}</Text>
              <Text style={styles.metaDot}>•</Text>
              <Text style={styles.metaText}>{formatDate(post.publishedAt)}</Text>
            </View>
          </View>

          {/* Thumbnail */}
          {post.thumbnailUrl && (
            <Image
              source={{ uri: post.thumbnailUrl }}
              style={[styles.thumbnail, isSmall && styles.thumbnailMobile]}
              resizeMode="cover"
            />
          )}

          {/* Content */}
          <View style={styles.content}>
            <BlogRenderer
              htmlContent={post.content}
              contentWidth={contentWidth}
            />
          </View>

          {/* CTA Section */}
          <View style={styles.ctaSection}>
            <Text style={styles.ctaTitle}>Ready to Practice Your Interview Skills?</Text>
            <Text style={styles.ctaText}>
              Book a mock interview with experienced professionals from top companies and get personalized feedback to ace your next interview.
            </Text>
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => router.push('/auth/sign-up')}
            >
              <Text style={styles.ctaButtonText}>GET STARTED</Text>
            </TouchableOpacity>
          </View>

          {/* Share Section */}
          <View style={styles.shareSection}>
            <Text style={styles.shareTitle}>Share this article</Text>
            <View style={styles.shareButtons}>
              <TouchableOpacity style={styles.shareButton}>
                <Ionicons name="logo-twitter" size={20} color="#1DA1F2" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareButton}>
                <Ionicons name="logo-linkedin" size={20} color="#0A66C2" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareButton}>
                <Ionicons name="link-outline" size={20} color={theme.colors.text.main} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: 800,
    width: '100%',
    marginHorizontal: 'auto',
    paddingHorizontal: 40,
    paddingVertical: 40,
  },
  containerMobile: {
    paddingHorizontal: 20,
  },

  // Back Link
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 32,
  },
  backLinkText: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 16,
    color: theme.colors.primary,
  },

  // Header
  header: {
    marginBottom: 32,
  },

  tags: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: theme.colors.gray[100],
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },
  tagText: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 12,
    color: theme.colors.primary,
    textTransform: 'uppercase',
  },

  title: {
    fontFamily: theme.typography.fontFamily.extrabold,
    fontSize: 48,
    color: theme.colors.text.main,
    lineHeight: 56,
    marginBottom: 16,
  },
  titleMobile: {
    fontSize: 32,
    lineHeight: 40,
  },

  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: 16,
    color: theme.colors.text.light,
  },
  metaDot: {
    color: theme.colors.text.light,
  },

  // Thumbnail
  thumbnail: {
    width: '100%',
    height: 400,
    borderRadius: 16,
    marginBottom: 40,
    backgroundColor: theme.colors.gray[100],
  },
  thumbnailMobile: {
    height: 250,
  },

  // Content
  content: {
    marginBottom: 60,
  },

  // CTA Section
  ctaSection: {
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    padding: 48,
    alignItems: 'center',
    marginBottom: 40,
  },
  ctaTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 24,
    color: theme.colors.surface,
    marginBottom: 12,
    textAlign: 'center',
  },
  ctaText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: 16,
    color: theme.colors.surface,
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.9,
  },
  ctaButton: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  ctaButtonText: {
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamily.extrabold,
    fontSize: 14,
    letterSpacing: 0.5,
  },

  // Share Section
  shareSection: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: 32,
    alignItems: 'center',
  },
  shareTitle: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 16,
    color: theme.colors.text.main,
    marginBottom: 16,
  },
  shareButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  shareButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 404 Not Found
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    minHeight: 400,
  },
  notFoundTitle: {
    fontFamily: theme.typography.fontFamily.extrabold,
    fontSize: 36,
    color: theme.colors.text.main,
    marginBottom: 16,
  },
  notFoundText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: 18,
    color: theme.colors.text.body,
    textAlign: 'center',
    marginBottom: 32,
  },
  backButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: theme.colors.surface,
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: 16,
  },
});