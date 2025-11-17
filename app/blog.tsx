// app/blog.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';

const CTA_TEAL = '#18a7a7';

export default function Blog() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isSmall = width < 900;

  const blogPosts = [
    {
      title: 'Top 10 Coding Interview Mistakes to Avoid',
      excerpt: 'Learn from common pitfalls that candidates make during technical interviews...',
      date: 'Coming Soon',
    },
    {
      title: 'How to Answer "Tell Me About Yourself" Perfectly',
      excerpt: 'Master the most common interview question with this proven framework...',
      date: 'Coming Soon',
    },
    {
      title: 'System Design Interview Preparation Guide',
      excerpt: 'Everything you need to know to ace system design interviews at FAANG companies...',
      date: 'Coming Soon',
    },
    {
      title: 'Behavioral Interview Questions: The STAR Method',
      excerpt: 'Use this simple framework to structure your behavioral interview answers...',
      date: 'Coming Soon',
    },
    {
      title: 'From Rejection to Offer: A Success Story',
      excerpt: 'How Sarah used mock interviews to land her dream job at Google...',
      date: 'Coming Soon',
    },
    {
      title: 'Negotiating Your Tech Salary: A Complete Guide',
      excerpt: 'Get the compensation you deserve with these proven negotiation strategies...',
      date: 'Coming Soon',
    },
  ];

  return (<ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.headerInner, isSmall && styles.headerInnerMobile]}>
            <TouchableOpacity onPress={() => router.push('/')}>
              <View>
                <Text style={[styles.logoMain, isSmall && styles.logoMainMobile]}>
                  CrackJobs
                </Text>
                <Text style={[styles.logoTagline, isSmall && styles.logoTaglineMobile]}>
                  Mad skills. Dream job.
                </Text>
              </View>
            </TouchableOpacity>

            <View style={[styles.navRight, isSmall && styles.navRightMobile]}>
              <TouchableOpacity
                style={[styles.btn, styles.btnSecondary, isSmall && styles.btnMobile]}
                onPress={() => router.push('/(auth)/sign-in')}
              >
                <Text style={[styles.btnText, isSmall && styles.btnTextMobile]}>
                  LOGIN
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.btnPrimary, isSmall && styles.btnMobile]}
                onPress={() => router.push('/(auth)/sign-up')}
              >
                <Text style={[styles.btnText, isSmall && styles.btnTextMobile]}>
                  SIGN UP
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={[styles.pageTitle, isSmall && styles.pageTitleMobile]}>
            Blog
          </Text>
          <Text style={[styles.pageSubtitle, isSmall && styles.pageSubtitleMobile]}>
            Interview tips, career advice, and success stories
          </Text>

          <View style={[styles.blogGrid, isSmall && styles.blogGridMobile]}>
            {blogPosts.map((post, index) => (
              <View key={index} style={[styles.blogCard, isSmall && styles.blogCardMobile]}>
                <Text style={styles.blogDate}>{post.date}</Text>
                <Text style={styles.blogTitle}>{post.title}</Text>
                <Text style={styles.blogExcerpt}>{post.excerpt}</Text>
                <TouchableOpacity style={styles.readMore}>
                  <Text style={styles.readMoreText}>Read More →</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={styles.comingSoonBanner}>
            <Text style={styles.comingSoonText}>
              📝 Our blog is launching soon! Subscribe to get notified.
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={[styles.footerContent, isSmall && styles.footerContentMobile]}>
            <TouchableOpacity onPress={() => router.push('/')}>
              <Text style={styles.footerLink}>Home</Text>
            </TouchableOpacity>
            {!isSmall && <Text style={styles.footerDivider}>•</Text>}
            <TouchableOpacity onPress={() => router.push('/how-it-works')}>
              <Text style={styles.footerLink}>How It Works</Text>
            </TouchableOpacity>
            {!isSmall && <Text style={styles.footerDivider}>•</Text>}
            <TouchableOpacity onPress={() => router.push('/about')}>
              <Text style={styles.footerLink}>About</Text>
            </TouchableOpacity>
            {!isSmall && <Text style={styles.footerDivider}>•</Text>}
            <TouchableOpacity onPress={() => router.push('/contact')}>
              <Text style={styles.footerLink}>Contact</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f5f0' },
  
  // Header (same as other pages)
  header: { backgroundColor: '#f8f5f0', paddingVertical: 16 },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 1400,
    width: '100%',
    marginHorizontal: 'auto',
    paddingHorizontal: 40,
  },
  headerInnerMobile: { paddingHorizontal: 20 },
  logoMain: {
    fontFamily: 'DancingScript',
    fontSize: 36,
    fontWeight: '900',
    color: '#333',
  },
  logoMainMobile: { fontSize: 28 },
  logoTagline: {
    fontFamily: 'DancingScript',
    fontSize: 22,
    fontWeight: '900',
    color: '#f58742',
    marginTop: -8,
  },
  logoTaglineMobile: { fontSize: 16 },
  navRight: { flexDirection: 'row', gap: 12 },
  navRightMobile: { gap: 8 },
  btn: {
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 30,
    borderWidth: 2,
  },
  btnPrimary: {
    backgroundColor: CTA_TEAL,
    borderColor: CTA_TEAL,
  },
  btnSecondary: {
    backgroundColor: 'transparent',
    borderColor: '#333',
  },
  btnMobile: { paddingHorizontal: 20, paddingVertical: 8 },
  btnText: {
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 1,
  },
  btnTextMobile: { fontSize: 12 },
  
  // Content
  content: {
    maxWidth: 1200,
    width: '100%',
    marginHorizontal: 'auto',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  pageTitle: {
    fontFamily: 'DancingScript',
    fontSize: 56,
    fontWeight: '900',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  pageTitleMobile: { fontSize: 42 },
  pageSubtitle: {
    fontSize: 20,
    color: '#666',
    textAlign: 'center',
    marginBottom: 48,
  },
  pageSubtitleMobile: { fontSize: 18, paddingHorizontal: 20 },
  
  // Blog Grid
  blogGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 32,
    marginBottom: 48,
  },
  blogGridMobile: {
    flexDirection: 'column',
    gap: 24,
  },
  blogCard: {
    flex: 1,
    minWidth: 320,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  blogCardMobile: {
    minWidth: '100%',
    padding: 24,
  },
  blogDate: {
    fontSize: 14,
    color: CTA_TEAL,
    fontWeight: '600',
    marginBottom: 12,
  },
  blogTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
    lineHeight: 30,
  },
  blogExcerpt: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 16,
  },
  readMore: {
    marginTop: 8,
  },
  readMoreText: {
    color: CTA_TEAL,
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Coming Soon Banner
  comingSoonBanner: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: CTA_TEAL,
  },
  comingSoonText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
  
  // Footer
  footer: {
    backgroundColor: '#333',
    paddingVertical: 32,
    paddingHorizontal: 40,
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },
  footerContentMobile: {
    flexDirection: 'column',
    gap: 12,
  },
  footerLink: {
    color: '#fff',
    fontSize: 14,
  },
  footerDivider: {
    color: '#666',
    fontSize: 14,
  },
});