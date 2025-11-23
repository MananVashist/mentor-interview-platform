// lib/theme.ts
import { Platform } from 'react-native';

const webFont =
  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Roboto, "Helvetica Neue", Arial';

export const THEME = {
  colors: {
    // surfaces
    background: '#F9FAFB',
    surface: '#FFFFFF',
    backgroundSecondary: '#F3F4F6',

    // brand / CTA
    primary: '#F97316',
    primarySoft: 'rgba(249,115,22,0.1)',
    onPrimary: '#FFFFFF',
    CTA: '#F97316',
    CTA_TEXT: '#FFFFFF',

    // text
    text: '#0f172a',
    textSecondary: '#6b7280',
    textMuted: '#6b7280',
    textTertiary: '#94a3b8',

    // links / accents
    accent: '#2563eb',

    // borders & states
    border: 'rgba(15,23,42,0.08)',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    error: '#EF4444',
    disabled: 'rgba(15,23,42,0.12)',

    // badges (you had these)
    badgeBronze: '#CD7F32',
    badgeSilver: '#C0C0C0',
    badgeGold: '#FFD700',
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 14,
    lg: 20,
    xl: 28,
  },

  radius: {
    sm: 6,
    md: 10,
    lg: 16,
    pill: 999,
  },

  typography: {
    // auth screens
    heading1: 28,
    heading2: 22,
    body: 14,
    small: 12,
    button: 14,

    // candidate screens were doing typography.size.md
    size: {
      xs: 10,
      sm: 12,
      md: 14,
      lg: 16,
      xl: 20,
    },
  },

  // some candidate screens were doing ...shadows.card
  shadows: {
    card:
      Platform.OS === 'web'
        ? {
            boxShadow: '0 10px 30px rgba(15,23,42,0.04)',
          }
        : {
            shadowColor: '#0f172a',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 10,
            elevation: 3,
          },
  },

  fonts: {
    heading: Platform.OS === 'web' ? (webFont as any) : undefined,
    body: Platform.OS === 'web' ? (webFont as any) : undefined,
  },
} as const;

export const colors = THEME.colors;
export const spacing = THEME.spacing;
export const borderRadius = THEME.radius;
export const typography = THEME.typography;
export const shadows = THEME.shadows;

export type AppTheme = typeof THEME;
