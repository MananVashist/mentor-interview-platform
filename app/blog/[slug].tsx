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
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Head from 'expo-router/head'; // Import Head
import { PageLayout } from '@/components/PageLayout';
import { BlogRenderer } from '@/components/BlogRenderer';
import { theme } from '@/lib/theme';
import { getPostBySlug, getAllPosts } from '@/data/blog-posts';
import { Ionicons } from '@expo/vector-icons';

// 1. Static Paths Generation
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default function BlogPost() {
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const dimensions = useWindowDimensions();
  
  // Safe width fallback for Mobile Renderer
  const safeWidth = dimensions?.width || 800;

  // Handle array or string slug safely
  const slugString = Array.isArray(slug) ? slug[0] : slug;
  const post = getPostBySlug(slugString as string);

  // Handle 404s - If post is missing, render a simple "Not Found" state
  if (!post) {
    return (
       <PageLayout>
         <View style={styles.notFoundContainer}>
           <Text style={styles.title}>Post Not Found</Text>
           <TouchableOpacity onPress={() => router.push('/blog')}>
             <Text style={styles.backButtonText}>Go Back to Blog</Text>
           </TouchableOpacity>
         </View>
       </PageLayout>
    );
  }

  const pageUrl = `https://crackjobs.com/blog/${post.slug}`;
  const imageUrl = post.thumbnailUrl || 'https://crackjobs.com/og-image.png';

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
          "name": post.author || "CrackJobs Team"
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
      }
    ]
  };

  return (
    <PageLayout>
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

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.articleContainer}>
          
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={() => router.push('/blog')}>
            <Ionicons name="arrow-back" size={20} color={theme.colors.primary} />
            <Text style={styles.backButtonText}>Back to Blog</Text>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title} accessibilityRole="header" aria-level={1}>
              {post.title}
            </Text>
            <Text style={styles.meta}>
              {post.author} • {new Date(post.publishedAt).toLocaleDateString()}
            </Text>
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
        </View>
      </ScrollView>
    </PageLayout>
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
    cursor: 'pointer', // Adds pointer cursor on web
  } as any,
  backButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: theme.colors.text.main,
    marginBottom: 16,
    lineHeight: 40,
  },
  meta: {
    fontSize: 16,
    color: theme.colors.text.light,
  },
  thumbnail: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 32,
    backgroundColor: '#f0f0f0',
  },
  content: {
    width: '100%',
  },
  notFoundContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  }
});