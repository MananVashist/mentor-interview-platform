// components/StandardPageTemplate.tsx - FIXED VERSION (No duplicate meta tags)
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useWindowDimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { PageLayout } from './PageLayout';
import { injectMultipleSchemas, createBreadcrumbSchema } from '@/lib/structured-data';

// 🔥 System font stack - 0ms load time for SEO pages
const SYSTEM_FONT = Platform.select({
  web: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
  ios: "System",
  android: "Roboto",
  default: "System"
}) as string;

interface RelatedPage {
  title: string;
  description: string;
  icon: string;
  route: string;
}

interface StandardPageTemplateProps {
  title: string;
  metaDescription: string;
  pageUrl: string;
  pageTitle: string;
  lastUpdated?: string;
  children: React.ReactNode;
  additionalSchema?: Record<string, any>;
  relatedPages?: RelatedPage[];
}

export const StandardPageTemplate = ({
  pageTitle,
  lastUpdated,
  children,
  additionalSchema,
  relatedPages,
  pageUrl,
}: StandardPageTemplateProps) => {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isSmall = width < 900;

  // Create breadcrumb schema
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Home', url: 'https://crackjobs.com' },
    { name: pageTitle, url: pageUrl },
  ]);

  // Combine schemas and inject them
  React.useEffect(() => {
    if (Platform.OS === 'web') {
      const schemas = additionalSchema 
        ? [breadcrumbSchema, additionalSchema]
        : [breadcrumbSchema];
      
      const cleanup = injectMultipleSchemas(schemas);
      return () => cleanup && cleanup();
    }
  }, [additionalSchema, breadcrumbSchema]);

  return (
    <PageLayout>
      {/* ✅ REMOVED: Duplicate <Head> section - SEO component handles all meta tags */}
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.content, isSmall && styles.contentMobile]}>
          <Text style={[styles.pageTitle, isSmall && styles.pageTitleMobile]} accessibilityRole="header" aria-level={1}>
            {pageTitle}
          </Text>
          
          {lastUpdated && (
            <Text style={styles.lastUpdated}>
              Last Updated: {lastUpdated}
            </Text>
          )}

          {children}

          {relatedPages && relatedPages.length > 0 && (
            <View style={styles.relatedSection}>
              <Text style={styles.relatedTitle}>Related Pages</Text>
              <View style={[styles.relatedGrid, isSmall && styles.relatedGridMobile]}>
                {relatedPages.map((page, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.relatedCard, isSmall && styles.relatedCardMobile]}
                    onPress={() => router.push(page.route as any)}
                    accessibilityRole="link"
                  >
                    <Text style={styles.relatedCardIcon}>{page.icon}</Text>
                    <Text style={styles.relatedCardTitle}>{page.title}</Text>
                    <Text style={styles.relatedCardDesc}>{page.description}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </PageLayout>
  );
};

// Reusable components with system fonts
export const StandardSection = ({ title, children }: { title?: string; children: React.ReactNode }) => (
  <View style={styles.section}>
    {title && <Text style={styles.sectionTitle}>{title}</Text>}
    {children}
  </View>
);

export const StandardParagraph = ({ children, style }: { children: React.ReactNode; style?: any }) => (
  <Text style={[styles.paragraph, style]}>{children}</Text>
);

export const StandardBulletList = ({ items }: { items: React.ReactNode[] }) => (
  <View style={styles.bulletList}>
    {items.map((item, index) => (
      <View key={index} style={styles.bulletItem}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.bulletText}>{item}</Text>
      </View>
    ))}
  </View>
);

export const StandardBold = ({ children, style }: { children: React.ReactNode; style?: any }) => (
  <Text style={[styles.bold, style]}>{children}</Text>
);

export const StandardLink = ({ children, onPress }: { children: React.ReactNode; onPress?: () => void }) => (
  <Text style={styles.link} onPress={onPress}>
    {children}
  </Text>
);

export const StandardContactEmail = ({ children, onPress }: { children: React.ReactNode; onPress?: () => void }) => (
  <Text style={styles.contactEmail} onPress={onPress}>
    {children}
  </Text>
);

const styles = StyleSheet.create({
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  
  // Layout
  content: {
    maxWidth: 1000,
    width: '100%',
    marginHorizontal: 'auto',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  contentMobile: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },

  // Typography with system fonts
  pageTitle: {
    fontFamily: SYSTEM_FONT,
    fontWeight: '800', // Extra bold for page titles
    fontSize: 42,
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  pageTitleMobile: {
    fontSize: 32,
  },

  lastUpdated: {
    fontFamily: SYSTEM_FONT,
    fontWeight: '400', // Regular weight
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 48,
  },

  section: {
    marginBottom: 32,
  },

  sectionTitle: {
    fontFamily: SYSTEM_FONT,
    fontWeight: '700', // Bold for section titles
    fontSize: 24,
    color: '#111827',
    marginBottom: 12,
    marginTop: 24,
  },

  paragraph: {
    fontFamily: SYSTEM_FONT,
    fontWeight: '400', // Regular for body text
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 26,
    marginBottom: 16,
  },

  // Bullets
  bulletList: {
    marginTop: 8,
    marginLeft: 8,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bullet: {
    fontFamily: SYSTEM_FONT,
    fontWeight: '700', // Bold bullet
    fontSize: 16,
    color: '#11998e',
    marginRight: 8,
  },
  bulletText: {
    fontFamily: SYSTEM_FONT,
    fontWeight: '400', // Regular text
    flex: 1,
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },

  // Interactive elements
  bold: {
    fontFamily: SYSTEM_FONT,
    fontWeight: '700', // Bold emphasis
    color: '#111827',
  },
  link: {
    fontFamily: SYSTEM_FONT,
    fontWeight: '600', // Semibold for links
    color: '#11998e',
    textDecorationLine: 'underline',
  },
  contactEmail: {
    fontFamily: SYSTEM_FONT,
    fontWeight: '600', // Semibold for email
    fontSize: 18,
    color: '#11998e',
    marginTop: 8,
  },

  // Related pages section
  relatedSection: {
    marginTop: 60,
    marginBottom: 40,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 40,
  },
  relatedTitle: {
    fontFamily: SYSTEM_FONT,
    fontWeight: '700', // Bold title
    fontSize: 28,
    color: '#111827',
    marginBottom: 24,
    textAlign: 'center',
  },
  relatedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  relatedGridMobile: {
    flexDirection: 'column',
  },
  relatedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    width: 280,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  relatedCardMobile: {
    width: '100%',
  },
  relatedCardIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  relatedCardTitle: {
    fontFamily: SYSTEM_FONT,
    fontWeight: '600', // Semibold for card titles
    fontSize: 18,
    color: '#111827',
    marginBottom: 4,
    textAlign: 'center',
  },
  relatedCardDesc: {
    fontFamily: SYSTEM_FONT,
    fontWeight: '400', // Regular for descriptions
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});