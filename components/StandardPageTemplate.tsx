// components/StandardPageTemplate.tsx
import React, { useEffect, ReactNode } from 'react';
import { View, Text, useWindowDimensions, Platform, TouchableOpacity } from 'react-native';
import Head from 'expo-router/head';
import { useRouter } from 'expo-router';
import { PageLayout } from '@/components/PageLayout';
import { LegalPageStyles } from '@/styles/LegalPageStyles';
import { createBreadcrumbSchema, injectMultipleSchemas } from '@/lib/structured-data';

interface RelatedPage {
  title: string;
  description: string;
  icon: string;
  route: string;
}

interface StandardPageTemplateProps {
  // SEO & Meta
  title: string;
  metaDescription: string;
  pageUrl: string; // e.g., 'https://crackjobs.com/privacy'
  
  // Page Content
  pageTitle: string;
  lastUpdated?: string; // Optional, defaults to "November 25, 2024"
  
  // Content (sections)
  children: ReactNode;
  
  // Optional: Additional schema (e.g., ContactPage schema)
  additionalSchema?: any;
  
  // Optional: Related pages to show at bottom
  relatedPages?: RelatedPage[];
}

export const StandardPageTemplate = ({
  title,
  metaDescription,
  pageUrl,
  pageTitle,
  lastUpdated = "November 25, 2024",
  children,
  additionalSchema,
  relatedPages,
}: StandardPageTemplateProps) => {
  const { width } = useWindowDimensions();
  const isSmall = width < 900;
  const router = useRouter();

  // SEO: Inject breadcrumb schema + any additional schema
  useEffect(() => {
    if (Platform.OS === 'web') {
      const breadcrumb = createBreadcrumbSchema([
        { name: 'Home', url: 'https://crackjobs.com' },
        { name: pageTitle, url: pageUrl }
      ]);
      
      const schemas = additionalSchema 
        ? [breadcrumb, additionalSchema] 
        : [breadcrumb];
      
      const cleanup = injectMultipleSchemas(schemas);
      return () => cleanup && cleanup();
    }
  }, [pageTitle, pageUrl, additionalSchema]);

  return (
    <PageLayout>
      <Head>
        <title>{title}</title>
        <meta name="description" content={metaDescription} />
      </Head>

      <View style={[LegalPageStyles.content, isSmall && LegalPageStyles.contentMobile]}>
        {/* Page Title */}
        <Text 
          style={[LegalPageStyles.pageTitle, isSmall && LegalPageStyles.pageTitleMobile]} 
          accessibilityRole="header" 
          aria-level={1}
        >
          {pageTitle}
        </Text>

        {/* Last Updated */}
        <Text style={LegalPageStyles.lastUpdated}>Last Updated: {lastUpdated}</Text>

        {/* Content Sections (passed as children) */}
        {children}

        {/* Related Pages Section (Optional) */}
        {relatedPages && relatedPages.length > 0 && (
          <View style={LegalPageStyles.relatedSection}>
            <Text style={LegalPageStyles.relatedTitle}>Related Pages</Text>
            <View style={LegalPageStyles.relatedGrid}>
              {relatedPages.map((page, index) => (
                <TouchableOpacity
                  key={index}
                  style={[LegalPageStyles.relatedCard, isSmall && LegalPageStyles.relatedCardMobile]}
                  onPress={() => router.push(page.route as any)}
                  accessibilityRole="link"
                >
                  <Text style={LegalPageStyles.relatedCardIcon}>{page.icon}</Text>
                  <Text style={LegalPageStyles.relatedCardTitle}>{page.title}</Text>
                  <Text style={LegalPageStyles.relatedCardDesc}>{page.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>
    </PageLayout>
  );
};

// ========================================
// REUSABLE COMPONENTS
// ========================================

// Reusable Section Component
export const StandardSection = ({ 
  title, 
  children 
}: { 
  title?: string; 
  children: ReactNode 
}) => (
  <View style={LegalPageStyles.section}>
    {title && (
      <Text style={LegalPageStyles.sectionTitle} accessibilityRole="header" aria-level={2}>
        {title}
      </Text>
    )}
    {children}
  </View>
);

// Reusable Paragraph Component
export const StandardParagraph = ({ 
  children 
}: { 
  children: ReactNode 
}) => (
  <Text style={LegalPageStyles.paragraph}>{children}</Text>
);

// Reusable Bullet List Component
export const StandardBulletList = ({ 
  items 
}: { 
  items: ReactNode[] 
}) => (
  <View style={LegalPageStyles.bulletList}>
    {items.map((item, index) => (
      <View key={index} style={LegalPageStyles.bulletItem}>
        <Text style={LegalPageStyles.bullet}>•</Text>
        <Text style={LegalPageStyles.bulletText}>{item}</Text>
      </View>
    ))}
  </View>
);

// Reusable Bold Text Component
export const StandardBold = ({ 
  children 
}: { 
  children: ReactNode 
}) => (
  <Text style={LegalPageStyles.bold}>{children}</Text>
);

// Reusable Link Component
export const StandardLink = ({ 
  children, 
  onPress 
}: { 
  children: ReactNode;
  onPress?: () => void;
}) => (
  <Text style={LegalPageStyles.link} onPress={onPress}>{children}</Text>
);

// Reusable Contact Email Component
export const StandardContactEmail = ({ 
  children, 
  onPress 
}: { 
  children: ReactNode;
  onPress?: () => void;
}) => (
  <Text style={LegalPageStyles.contactEmail} onPress={onPress}>{children}</Text>
);