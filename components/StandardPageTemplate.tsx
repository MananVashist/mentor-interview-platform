import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Platform } from 'react-native';
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

// ============================================================================
// 1. WEB-ONLY COMPONENT (Renders Real HTML Tags for SEO)
// ============================================================================
const WebStandardPage = ({ 
  pageTitle, 
  lastUpdated, 
  children, 
  relatedPages, 
  router 
}: any) => {
  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '60px 20px',
      fontFamily: SYSTEM_FONT,
      color: '#4B5563',
      lineHeight: '1.6'
    }}>
      <h1 style={{
        fontSize: '42px',
        fontWeight: '800',
        color: '#111827',
        textAlign: 'center',
        marginBottom: '16px'
      }}>
        {pageTitle}
      </h1>
      
      {lastUpdated && (
        <p style={{ textAlign: 'center', color: '#6B7280', marginBottom: '48px' }}>
          Last Updated: {lastUpdated}
        </p>
      )}

      {/* Children here are usually StandardSection/Paragraph components.
         We need those components to ALSO render HTML on web.
         See the updated export definitions below.
      */}
      {children}

      {relatedPages && relatedPages.length > 0 && (
        <div style={{
          marginTop: '60px',
          borderTop: '1px solid #E5E7EB',
          paddingTop: '40px'
        }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#111827',
            textAlign: 'center',
            marginBottom: '24px'
          }}>
            Related Pages
          </h2>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            justifyContent: 'center'
          }}>
            {relatedPages.map((page: any, index: number) => (
              <a 
                key={index}
                href={page.route}
                onClick={(e) => {
                  e.preventDefault();
                  router.push(page.route);
                }}
                style={{
                  textDecoration: 'none',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '12px',
                  padding: '24px',
                  width: '280px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  color: 'inherit'
                }}
              >
                <span style={{ fontSize: '32px', marginBottom: '8px' }}>{page.icon}</span>
                <strong style={{ fontSize: '18px', color: '#111827', marginBottom: '4px' }}>{page.title}</strong>
                <span style={{ fontSize: '14px', color: '#6B7280', textAlign: 'center' }}>{page.description}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 2. MAIN TEMPLATE WRAPPER
// ============================================================================

interface StandardPageTemplateProps {
  title: string;
  metaDescription: string;
  pageUrl: string;
  pageTitle: string;
  lastUpdated?: string;
  children: React.ReactNode;
  additionalSchema?: Record<string, any>;
  relatedPages?: any[];
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

  // Schema Injection (Same as before)
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Home', url: 'https://crackjobs.com' },
    { name: pageTitle, url: pageUrl },
  ]);

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
      {Platform.OS === 'web' ? (
        <WebStandardPage 
          pageTitle={pageTitle}
          lastUpdated={lastUpdated}
          children={children}
          relatedPages={relatedPages}
          router={router}
        />
      ) : (
        // MOBILE / NATIVE LAYOUT (Unchanged)
        <View style={[styles.content, isSmall && styles.contentMobile]}>
          <Text style={[styles.pageTitle, isSmall && styles.pageTitleMobile]} accessibilityRole="header">
            {pageTitle}
          </Text>
          {lastUpdated && <Text style={styles.lastUpdated}>Last Updated: {lastUpdated}</Text>}
          {children}
          {/* ... (Keep existing native related pages logic here if needed for mobile app) ... */}
        </View>
      )}
    </PageLayout>
  );
};

// ============================================================================
// 3. UPDATED SUB-COMPONENTS (Polymorphic: View on Native, Div/P on Web)
// ============================================================================

export const StandardSection = ({ title, children }: { title?: string; children: React.ReactNode }) => {
  if (Platform.OS === 'web') {
    return (
      <section style={{ marginBottom: '32px' }}>
        {title && <h2 style={{ fontFamily: SYSTEM_FONT, fontWeight: '700', fontSize: '24px', color: '#111827', marginBottom: '12px', marginTop: '24px' }}>{title}</h2>}
        {children}
      </section>
    );
  }
  return (
    <View style={styles.section}>
      {title && <Text style={styles.sectionTitle}>{title}</Text>}
      {children}
    </View>
  );
};

export const StandardParagraph = ({ children, style }: { children: React.ReactNode; style?: any }) => {
  if (Platform.OS === 'web') {
    return <p style={{ fontFamily: SYSTEM_FONT, fontSize: '16px', color: '#4B5563', lineHeight: '1.6', marginBottom: '16px', ...style }}>{children}</p>;
  }
  return <Text style={[styles.paragraph, style]}>{children}</Text>;
};

export const StandardBold = ({ children, style }: { children: React.ReactNode; style?: any }) => {
  if (Platform.OS === 'web') {
    return <strong style={{ fontFamily: SYSTEM_FONT, fontWeight: '700', color: '#111827', ...style }}>{children}</strong>;
  }
  return <Text style={[styles.bold, style]}>{children}</Text>;
};

export const StandardLink = ({ children, onPress }: { children: React.ReactNode; onPress?: () => void }) => {
  // Note: On web, onPress usually needs an anchor tag, but for simplicity we keep span with cursor
  if (Platform.OS === 'web') {
    return <span onClick={onPress} style={{ color: '#11998e', textDecoration: 'underline', fontWeight: '600', cursor: 'pointer' }}>{children}</span>;
  }
  return <Text style={styles.link} onPress={onPress}>{children}</Text>;
};

export const StandardContactEmail = ({ children, onPress }: { children: React.ReactNode; onPress?: () => void }) => {
  if (Platform.OS === 'web') {
    return <a href={`mailto:${children}`} style={{ display:'block', fontSize: '18px', color: '#11998e', fontWeight: '600', marginTop: '8px', textDecoration:'none' }}>{children}</a>;
  }
  return <Text style={styles.contactEmail} onPress={onPress}>{children}</Text>;
};

// Native Styles (Keep these exactly as they were for iOS/Android)
const styles = StyleSheet.create({
  content: {
    maxWidth: 1000,
    width: '100%',
    marginHorizontal: 'auto',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  contentMobile: { paddingHorizontal: 20, paddingVertical: 40 },
  pageTitle: { fontFamily: SYSTEM_FONT, fontWeight: '800', fontSize: 42, color: '#111827', textAlign: 'center', marginBottom: 16 },
  pageTitleMobile: { fontSize: 32 },
  lastUpdated: { fontFamily: SYSTEM_FONT, fontWeight: '400', fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 48 },
  section: { marginBottom: 32 },
  sectionTitle: { fontFamily: SYSTEM_FONT, fontWeight: '700', fontSize: 24, color: '#111827', marginBottom: 12, marginTop: 24 },
  paragraph: { fontFamily: SYSTEM_FONT, fontWeight: '400', fontSize: 16, color: '#4B5563', lineHeight: 26, marginBottom: 16 },
  bold: { fontFamily: SYSTEM_FONT, fontWeight: '700', color: '#111827' },
  link: { fontFamily: SYSTEM_FONT, fontWeight: '600', color: '#11998e', textDecorationLine: 'underline' },
  contactEmail: { fontFamily: SYSTEM_FONT, fontWeight: '600', fontSize: 18, color: '#11998e', marginTop: 8 },
});