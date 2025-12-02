// components/BlogRenderer.tsx
import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import RenderHtml from 'react-native-render-html';
import { theme } from '@/lib/theme';

type BlogRendererProps = {
  htmlContent: string;
  contentWidth: number;
};

export function BlogRenderer({ htmlContent, contentWidth }: BlogRendererProps) {
  // Custom tag styles for consistent branding
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
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: 18,
      lineHeight: 32,
      color: theme.colors.text.body,
      marginBottom: 20,
    },
    strong: {
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text.main,
    },
    em: {
      fontFamily: theme.typography.fontFamily.regular,
      fontStyle: 'italic',
    },
    ul: {
      marginBottom: 24,
      marginLeft: 0,
      paddingLeft: 24,
    },
    ol: {
      marginBottom: 24,
      marginLeft: 0,
      paddingLeft: 24,
    },
    li: {
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: 18,
      lineHeight: 32,
      color: theme.colors.text.body,
      marginBottom: 8,
    },
    a: {
      color: theme.colors.primary,
      textDecorationLine: 'underline',
    },
    blockquote: {
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.primary,
      paddingLeft: 20,
      marginLeft: 0,
      marginRight: 0,
      marginTop: 24,
      marginBottom: 24,
      backgroundColor: theme.colors.gray[50],
      padding: 20,
      borderRadius: 8,
    },
    code: {
      fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
      fontSize: 16,
      backgroundColor: theme.colors.gray[100],
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
    },
    pre: {
      backgroundColor: theme.colors.gray[900],
      padding: 16,
      borderRadius: 8,
      marginVertical: 16,
      overflow: 'scroll' as any,
    },
    img: {
      marginVertical: 20,
      borderRadius: 8,
    },
  };

  // Custom classesStyles for specific elements
  const classesStyles = {
    'emoji': {
      fontSize: 24,
    },
  };

  return (
    <View style={styles.container}>
      <RenderHtml
        contentWidth={contentWidth}
        source={{ html: htmlContent }}
        tagsStyles={tagsStyles}
        classesStyles={classesStyles}
        enableExperimentalMarginCollapsing={true}
        enableExperimentalBRCollapsing={true}
        enableExperimentalGhostLinesPrevention={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});