import { StyleSheet } from 'react-native';
// 🟢 Import your existing theme
import { theme } from '@/lib/theme'; 

export const LegalPageStyles = StyleSheet.create({
  // --- Layout Containers ---
  content: {
    maxWidth: 1000,
    width: '100%',
    marginHorizontal: 'auto',
    paddingHorizontal: theme.spacing.xl, // 32
    paddingVertical: 60,
  },
  contentMobile: { 
    paddingHorizontal: theme.spacing.md, // 16
    paddingVertical: theme.spacing.xl, 
  },

  // --- Typography ---
  pageTitle: {
    fontFamily: theme.typography.fontFamily.extrabold, // Inter_800
    fontSize: 42,
    color: theme.colors.text.main,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  pageTitleMobile: { fontSize: 32 },

  lastUpdated: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.size.sm,
    color: theme.colors.text.light,
    textAlign: 'center',
    marginBottom: 48,
  },

  sectionTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 24,
    color: theme.colors.text.main,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  sectionTitleMobile: { fontSize: 20 },

  paragraph: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.size.md,
    color: theme.colors.text.body,
    lineHeight: 26,
    marginBottom: theme.spacing.md,
  },

  // --- Components ---
  section: {
    marginBottom: theme.spacing.xl,
  },

  // Bullet Lists
  bulletList: {
    marginTop: theme.spacing.sm,
    marginLeft: theme.spacing.sm,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
  },
  bullet: {
    fontSize: theme.typography.size.md,
    color: theme.colors.primary, // #11998e
    marginRight: theme.spacing.sm,
    fontWeight: '700',
  },
  bulletText: {
    flex: 1,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.size.md,
    color: theme.colors.text.body,
    lineHeight: 24,
  },

  // Interactive Elements
  bold: {
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.main,
  },
  link: {
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamily.semibold,
    textDecorationLine: 'underline',
  },
  contactEmail: {
    fontSize: theme.typography.size.lg,
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamily.semibold,
    marginTop: theme.spacing.sm,
  },

  // Related Pages Grid (Bottom)
  relatedSection: {
    marginTop: 60,
    marginBottom: 40,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: 40,
  },
  relatedTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 28,
    color: theme.colors.text.main,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  relatedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    justifyContent: 'center',
  },
  relatedCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    width: 280,
    alignItems: 'center',
    // Shadow from theme
    ...theme.shadows.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  relatedCardMobile: {
    width: '100%',
  },
  relatedCardIcon: {
    fontSize: 32,
    marginBottom: theme.spacing.sm,
  },
  relatedCardTitle: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.size.lg,
    color: theme.colors.text.main,
    marginBottom: 4,
    textAlign: 'center',
  },
  relatedCardDesc: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.size.sm,
    color: theme.colors.text.light,
    textAlign: 'center',
  },
});