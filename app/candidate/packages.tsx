// app/candidate/packages.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography } from '@/lib/theme';
import { Heading, AppText, Card, Button, Section } from '@/lib/ui';

export default function PackagesScreen() {
  return (
    <View style={styles.container}>
      <Section style={styles.centerWrap}>
        <Card style={styles.card}>
          <Heading>Packages</Heading>
          <AppText style={styles.sub}>Coming soon</AppText>

          <View style={{ height: spacing.lg }} />
          <Button
            title="Back to Dashboard"
            variant="outline"
            onPress={() => {
              /* no-op for now */
            }}
          />
        </Card>
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  card: {
    width: '100%',
    maxWidth: 560,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  sub: {
    marginTop: spacing.sm,
    color: colors.textSecondary,
    fontSize: typography.body,
  },
});
