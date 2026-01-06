import React from 'react';
import { View, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';
import { theme } from '@/lib/theme';

type BlogRendererProps = {
  htmlContent: string;
  contentWidth?: number;
};

export function BlogRenderer({ htmlContent, contentWidth }: BlogRendererProps) {
  const { width } = useWindowDimensions();
  const safeWidth = contentWidth || width;

  // ============================================================
  // WEB RENDERER (Static HTML for SEO)
  // ============================================================
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        {/* CSS Block to style the raw HTML */}
        <style dangerouslySetInnerHTML={{ __html: `
          .blog-content { 
            font-family: ${theme.typography.fontFamily.regular}, system-ui, sans-serif; 
            line-height: 1.8; 
            color: ${theme.colors.text.body}; 
            font-size: 1.125rem;
          }
          .blog-content h1 { 
            font-family: ${theme.typography.fontFamily.extrabold}, system-ui, sans-serif; 
            font-size: 2.25rem; 
            margin-top: 2.5rem; 
            margin-bottom: 1rem; 
            color: ${theme.colors.text.main}; 
            line-height: 1.2; 
          }
          .blog-content h2 { 
            font-family: ${theme.typography.fontFamily.bold}, system-ui, sans-serif; 
            font-size: 1.75rem; 
            margin-top: 2.5rem; 
            margin-bottom: 1rem; 
            color: ${theme.colors.text.main}; 
            line-height: 1.3; 
          }
          .blog-content h3 { 
            font-family: ${theme.typography.fontFamily.bold}, system-ui, sans-serif; 
            font-size: 1.4rem; 
            margin-top: 2rem; 
            margin-bottom: 0.75rem; 
            color: ${theme.colors.text.main}; 
          }
          .blog-content p { margin-bottom: 1.5rem; }
          .blog-content ul, .blog-content ol { margin-bottom: 1.5rem; padding-left: 2rem; }
          .blog-content li { margin-bottom: 0.5rem; }
          .blog-content a { color: ${theme.colors.primary}; text-decoration: underline; font-weight: 600; }
          .blog-content blockquote { 
            border-left: 4px solid ${theme.colors.primary}; 
            margin: 1.5rem 0; 
            padding: 1rem 1.5rem; 
            background: ${theme.colors.gray[50] || '#f9fafb'}; 
            border-radius: 0.5rem;
            font-style: italic;
          }
          .blog-content pre { 
            background: #1f2937; 
            color: #fff; 
            padding: 1rem; 
            border-radius: 0.5rem; 
            overflow-x: auto; 
            margin: 1.5rem 0; 
          }
          .blog-content code {
            font-family: monospace;
          }
          .blog-content img { 
            max-width: 100%; 
            height: auto; 
            border-radius: 0.75rem; 
            margin: 2rem 0; 
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }
        `}} />
        
        {/* Inject Raw HTML directly into DOM */}
        <div 
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: htmlContent }} 
        />
      </View>
    );
  }

  // ============================================================
  // MOBILE RENDERER (Native Views)
  // ============================================================
  const tagsStyles = {
    body: {
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: 18,
      lineHeight: 32,
      color: theme.colors.text.body,
    },
    h1: {
      fontFamily: theme.typography.fontFamily.extrabold,
      fontSize: 36,
      color: theme.colors.text.main,
      marginTop: 32,
      marginBottom: 16,
      lineHeight: 44,
    },
    h2: {
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: 28,
      color: theme.colors.text.main,
      marginTop: 40,
      marginBottom: 16,
      lineHeight: 36,
    },
    h3: {
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: 22,
      color: theme.colors.text.main,
      marginTop: 32,
      marginBottom: 12,
      lineHeight: 30,
    },
    h4: {
      fontFamily: theme.typography.fontFamily.semibold,
      fontSize: 18,
      color: theme.colors.text.main,
      marginTop: 24,
      marginBottom: 8,
    },
    p: {
      marginBottom: 20,
    },
    a: {
      color: theme.colors.primary,
      textDecorationLine: 'underline',
    },
    blockquote: {
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.primary,
      backgroundColor: theme.colors.gray[50],
      padding: 20,
      marginTop: 24,
      marginBottom: 24,
      borderRadius: 8,
    },
    pre: {
      backgroundColor: theme.colors.gray[900],
      padding: 16,
      borderRadius: 8,
      marginVertical: 16,
    },
    img: {
      marginVertical: 20,
      borderRadius: 12,
    },
  };

  return (
    <View style={styles.container}>
      <RenderHtml
        contentWidth={safeWidth}
        source={{ html: htmlContent }}
        tagsStyles={tagsStyles as any}
        enableExperimentalMarginCollapsing={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
});