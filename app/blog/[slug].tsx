// app/blog/[slug].tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
  Linking,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Head from 'expo-router/head';
// Removed: import { PageLayout } from '@/components/PageLayout';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BlogRenderer } from '@/components/BlogRenderer';
import { theme } from '@/lib/theme';
import { getPostBySlug, getAllPosts } from '@/data/blog-posts';
import { Ionicons } from '@expo/vector-icons';

// 1. Static Paths Generation
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

// Calculate reading time from HTML content
const calculateReadingTime = (htmlContent: string) => {
  const text = htmlContent.replace(/<[^>]*>/g, ''); // Strip HTML tags
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200); // Average reading speed: 200 words/min
  return minutes;
};

export default function BlogPost() {
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const dimensions = useWindowDimensions();
  
  // Safe width fallback for Mobile Renderer
  const safeWidth = dimensions?.width || 800;
  const isMobile = safeWidth < 600;

  // Handle array or string slug safely
  const slugString = Array.isArray(slug) ? slug[0] : slug;
  const post = getPostBySlug(slugString as string);

  // Handle 404s - If post is missing, render a simple "Not Found" state
  if (!post) {
    return (
       <View style={{ flex: 1, backgroundColor: '#fff' }}>
         <Header />
         <View style={styles.notFoundContainer}>
           <Text style={styles.title}>Post Not Found</Text>
           <TouchableOpacity onPress={() => router.push('/blog')}>
             <Text style={styles.backButtonText}>Go Back to Blog</Text>
           </TouchableOpacity>
         </View>
       </View>
    );
  }

  const pageUrl = `https://crackjobs.com/blog/${post.slug}`;
  const imageUrl = post.thumbnailUrl || 'https://crackjobs.com/og-image.png';
  const readingTime = calculateReadingTime(post.content);
  
  // Get related posts (same tags, exclude current post)
  const relatedPosts = getAllPosts()
    .filter(p => p.slug !== post.slug)
    .filter(p => p.tags?.some(tag => post.tags?.includes(tag)))
    .slice(0, 3);

  // Social share handlers
  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(pageUrl)}`;
    if (Platform.OS === 'web') {
      (window as any).open(url, '_blank');
    } else {
      Linking.openURL(url);
    }
  };

  const handleLinkedInShare = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`;
    if (Platform.OS === 'web') {
      (window as any).open(url, '_blank');
    } else {
      Linking.openURL(url);
    }
  };

  const handleCopyLink = () => {
    if (Platform.OS === 'web' && navigator.clipboard) {
      navigator.clipboard.writeText(pageUrl);
      // Could add a toast notification here
      alert('Link copied to clipboard!');
    }
  };

  // Structured Data (JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
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
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": post.title,
            "item": pageUrl
          }
        ]
      },
      {
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.excerpt,
        "image": [imageUrl],
        "datePublished": post.publishedAt,
        "dateModified": post.publishedAt,
        "author": {
          "@type": "Person",
          "name": post.author || "CrackJobs Team",
          "url": "https://crackjobs.com/about"
        },
        "publisher": {
          "@type": "Organization",
          "name": "CrackJobs",
          "logo": {
            "@type": "ImageObject",
            "url": "https://crackjobs.com/logo.png"
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": pageUrl
        }
      },
      {
        "@type": "Person",
        "@id": `https://crackjobs.com/author/${post.author?.toLowerCase().replace(/\s+/g, '-')}`,
        "name": post.author || "CrackJobs Team",
        "url": "https://crackjobs.com/about",
        "worksFor": {
          "@type": "Organization",
          "name": "CrackJobs",
          "url": "https://crackjobs.com"
        }
      }
    ]
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Head>
        <title>{`${post.title} | CrackJobs Blog`}</title>
        <meta name="description" content={post.excerpt} />
        <meta name="keywords" content={`interview preparation, mock interviews, ${post.tags?.join(', ') || 'career advice'}`} />
        <link rel="canonical" href={pageUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={imageUrl} />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={pageUrl} />
        <meta property="twitter:title" content={post.title} />
        <meta property="twitter:description" content={post.excerpt} />
        <meta property="twitter:image" content={imageUrl} />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Head>

      <Header />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.articleContainer}>
          
          {/* Back Button */}
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.push('/blog')}
            accessibilityRole="button"
            accessibilityLabel="Go back to blog"
          >
            <Ionicons name="arrow-back" size={20} color={theme.colors.primary} />
            <Text style={styles.backButtonText}>Back to Blog</Text>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title} accessibilityRole="header" aria-level={1}>
              {post.title}
            </Text>
            <Text style={styles.meta}>
              {post.author} • {new Date(post.publishedAt).toLocaleDateString()} • {readingTime} min read
            </Text>
          </View>

          {/* Social Share Buttons */}
          <View style={styles.shareButtons}>
            <Text style={styles.shareLabel}>Share:</Text>
            
            <TouchableOpacity 
              style={styles.shareButton}
              onPress={handleTwitterShare}
              accessibilityRole="button"
              accessibilityLabel="Share on Twitter"
            >
              <Ionicons name="logo-twitter" size={20} color="#1DA1F2" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.shareButton}
              onPress={handleLinkedInShare}
              accessibilityRole="button"
              accessibilityLabel="Share on LinkedIn"
            >
              <Ionicons name="logo-linkedin" size={20} color="#0077B5" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.shareButton}
              onPress={handleCopyLink}
              accessibilityRole="button"
              accessibilityLabel="Copy link to clipboard"
            >
              <Ionicons name="link" size={20} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Thumbnail */}
          {post.thumbnailUrl && (
            <Image
              source={{ uri: post.thumbnailUrl }}
              style={styles.thumbnail}
              resizeMode="cover"
            />
          )}

          {/* Content */}
          <View style={styles.content}>
            <BlogRenderer
              htmlContent={post.content}
              contentWidth={safeWidth} 
            />
          </View>

          {/* Related Posts Section */}
          {relatedPosts.length > 0 && (
            <View style={styles.relatedSection}>
              <Text style={styles.relatedTitle}>Related Articles</Text>
              
              <View style={[styles.relatedGrid, isMobile && styles.relatedGridMobile]}>
                {relatedPosts.map(relatedPost => (
                  <TouchableOpacity
                    key={relatedPost.slug}
                    style={styles.relatedCard}
                    onPress={() => router.push(`/blog/${relatedPost.slug}`)}
                    accessibilityRole="link"
                    accessibilityLabel={`Read article: ${relatedPost.title}`}
                  >
                    {relatedPost.thumbnailUrl && (
                      <Image 
                        source={{ uri: relatedPost.thumbnailUrl }}
                        style={styles.relatedThumbnail}
                        resizeMode="cover"
                      />
                    )}
                    <View style={styles.relatedCardContent}>
                      <Text style={styles.relatedPostTitle} numberOfLines={2}>
                        {relatedPost.title}
                      </Text>
                      <Text style={styles.relatedPostExcerpt} numberOfLines={2}>
                        {relatedPost.excerpt}
                      </Text>
                      <Text style={styles.relatedPostMeta}>
                        {calculateReadingTime(relatedPost.content)} min read
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* CTA Banner - Book Mock Interview */}
          <View style={styles.ctaBanner}>
            <Text style={[styles.ctaBannerTitle, isMobile && styles.ctaBannerTitleMobile]}>
              Ready to Put This Into Practice?
            </Text>
            <Text style={styles.ctaBannerDesc}>
              Book a 1:1 mock interview with expert mentors from Google, Meta, Amazon and get personalized feedback to ace your next interview
            </Text>
            
            {/* Interview Type Quick Links */}
            <View style={[styles.ctaQuickLinks, isMobile && styles.ctaQuickLinksMobile]}>
              <TouchableOpacity 
                style={styles.ctaQuickLink}
                onPress={() => router.push('/interviews/product-management')}
                accessibilityRole="button"
              >
                <Text style={styles.ctaQuickLinkText}>📊 PM</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.ctaQuickLink}
                onPress={() => router.push('/interviews/data-analytics')}
                accessibilityRole="button"
              >
                <Text style={styles.ctaQuickLinkText}>📈 Analytics</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.ctaQuickLink}
                onPress={() => router.push('/interviews/data-science')}
                accessibilityRole="button"
              >
                <Text style={styles.ctaQuickLinkText}>🤖 Data Science</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.ctaQuickLink}
                onPress={() => router.push('/interviews/hr')}
                accessibilityRole="button"
              >
                <Text style={styles.ctaQuickLinkText}>👥 HR</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.ctaBannerButton}
              onPress={() => router.push('/auth/sign-up')}
              accessibilityRole="button"
              accessibilityLabel="Browse mentors and book interview"
            >
              <Text style={styles.ctaBannerButtonText}>Browse All Mentors →</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Footer added inside ScrollView so it sits at the bottom */}
        <View style={{ width: '100%' }}>
          <Footer />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 40,
    alignItems: 'center',
  },
  articleContainer: {
    width: '100%',
    maxWidth: 800,
    paddingHorizontal: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    gap: 8,
  },
  backButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: theme.colors.text.main,
    marginBottom: 16,
    lineHeight: 46,
  },
  meta: {
    fontSize: 16,
    color: theme.colors.text.light,
  },
  
  // Social Share Buttons
  shareButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 32,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  shareLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.light,
    marginRight: 8,
  },
  shareButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  
  thumbnail: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 32,
    backgroundColor: theme.colors.cream,
  },
  content: {
    width: '100%',
    marginBottom: 60,
  },
  
  // Related Posts Section
  relatedSection: {
    marginTop: 60,
    paddingTop: 60,
    borderTopWidth: 2,
    borderTopColor: theme.colors.border,
  },
  relatedTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: theme.colors.text.main,
    marginBottom: 32,
  },
  relatedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    marginBottom: 40,
  },
  relatedGridMobile: {
    flexDirection: 'column',
  },
  relatedCard: {
    flex: 1,
    minWidth: 230,
    maxWidth: 250,
    backgroundColor: theme.colors.cream,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  relatedThumbnail: {
    width: '100%',
    height: 140,
    backgroundColor: '#e0e0e0',
  },
  relatedCardContent: {
    padding: 16,
  },
  relatedPostTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.colors.text.main,
    marginBottom: 8,
    lineHeight: 24,
  },
  relatedPostExcerpt: {
    fontSize: 14,
    color: theme.colors.text.light,
    lineHeight: 20,
    marginBottom: 8,
  },
  relatedPostMeta: {
    fontSize: 12,
    color: theme.colors.text.light,
    fontWeight: '600',
  },
  
  // CTA Banner
  ctaBanner: {
    backgroundColor: theme.colors.primary,
    padding: 48,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  ctaBannerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
    maxWidth: 600,
  },
  ctaBannerTitleMobile: {
    fontSize: 26,
  },
  ctaBannerDesc: {
    fontSize: 17,
    color: 'rgba(255,255,255,0.95)',
    textAlign: 'center',
    marginBottom: 28,
    maxWidth: 550,
    lineHeight: 26,
  },
  ctaQuickLinks: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  ctaQuickLinksMobile: {
    flexDirection: 'column',
    width: '100%',
  },
  ctaQuickLink: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  ctaQuickLinkText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  ctaBannerButton: {
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 36,
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaBannerButtonText: {
    color: theme.colors.primary,
    fontSize: 17,
    fontWeight: '700',
  },
  
  // Not Found
  notFoundContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  }
});