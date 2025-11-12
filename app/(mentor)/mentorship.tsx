// app/(mentor)/mentorship.tsx
import { useState } from 'react';
import { View, ScrollView, StyleSheet, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography, shadows } from '@/lib/theme';
import { Heading, AppText, Section, Card, Button, Input, ScreenBackground } from '@/lib/ui';

type MentorLevel = 'bronze' | 'silver' | 'gold';

interface AvailabilitySlot {
  day: string;      // Monday..Sunday
  enabled: boolean; // on/off
  startTime: string; // "HH:MM"
  endTime: string;   // "HH:MM"
}

export default function MentorMentorshipScreen() {
  // MOCK/LOCAL UI STATE (logic untouched)
  const [totalInterviews] = useState(5);
  const [currentLevel] = useState<MentorLevel>('bronze');
  const [sessionPrice, setSessionPrice] = useState('1000');

  // Defaults per PRD
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([
    { day: 'Monday', enabled: true, startTime: '20:00', endTime: '22:00' },
    { day: 'Tuesday', enabled: true, startTime: '20:00', endTime: '22:00' },
    { day: 'Wednesday', enabled: true, startTime: '20:00', endTime: '22:00' },
    { day: 'Thursday', enabled: true, startTime: '20:00', endTime: '22:00' },
    { day: 'Friday', enabled: true, startTime: '20:00', endTime: '22:00' },
    { day: 'Saturday', enabled: true, startTime: '12:00', endTime: '17:00' },
    { day: 'Sunday', enabled: true, startTime: '12:00', endTime: '17:00' },
  ]);

  const tier = (lvl: MentorLevel) => {
    switch (lvl) {
      case 'gold': return { name: 'Gold', color: colors.badgeGold, icon: 'trophy-outline' as const };
      case 'silver': return { name: 'Silver', color: colors.badgeSilver, icon: 'medal-outline' as const };
      default: return { name: 'Bronze', color: colors.badgeBronze, icon: 'ribbon-outline' as const };
    }
  };

  const t = tier(currentLevel);

  const onToggleDay = (i: number, enabled: boolean) =>
    setAvailability((prev) => prev.map((d, idx) => (idx === i ? { ...d, enabled } : d)));
  const onTimeChange = (i: number, which: 'startTime' | 'endTime', val: string) =>
    setAvailability((prev) => prev.map((d, idx) => (idx === i ? { ...d, [which]: val } : d)));

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }}>
        <Section style={{ paddingTop: spacing.lg, gap: spacing.md }}>
          <Heading level={1}>My Mentorship</Heading>
          <AppText style={{ color: colors.textSecondary }}>
            Manage your tier, add LinkedIn badges (admin-managed), set pricing & availability.
          </AppText>
        </Section>

        {/* Tier Card */}
        <Section>
          <Card style={[styles.tierCard, shadows.card as any]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
              <Ionicons name={t.icon} size={28} color={t.color} />
              <View style={{ flex: 1 }}>
                <Heading level={2}>Current Level: {t.name}</Heading>
                <AppText style={{ color: colors.textSecondary }}>
                  {totalInterviews} successful interviews so far
                </AppText>
              </View>
            </View>

            <View style={styles.badgeRow}>
              <Button title="Add LinkedIn Badge" variant="outline" />
              <Button title="Post Appreciation" variant="outline" />
            </View>
          </Card>
        </Section>

        {/* Pricing */}
        <Section>
          <Card style={shadows.card as any}>
            <Heading level={2} style={{ marginBottom: spacing.sm }}>Pricing</Heading>
            <AppText style={{ color: colors.textSecondary, marginBottom: spacing.md }}>
              Set your per-session fee (₹).
            </AppText>

            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <Input
                keyboardType="number-pad"
                value={sessionPrice}
                onChangeText={setSessionPrice}
                style={{ flex: 1 }}
                placeholder="e.g. 1500"
              />
              <Button title="Save" onPress={() => { /* keep your logic */ }} />
            </View>
          </Card>
        </Section>

        {/* Availability */}
        <Section>
          <Card style={shadows.card as any}>
            <Heading level={2} style={{ marginBottom: spacing.sm }}>Availability</Heading>
            <AppText style={{ color: colors.textSecondary, marginBottom: spacing.md }}>
              Defaults: Weekdays 8–10 PM, Weekends 12–5 PM. Toggle or adjust time ranges.
            </AppText>

            <View style={{ gap: spacing.sm }}>
              {availability.map((d, i) => (
                <View key={d.day} style={styles.availRow}>
                  <View style={{ flex: 1 }}>
                    <AppText style={[styles.dayName, !d.enabled && styles.dayNameDisabled]}>
                      {d.day}
                    </AppText>
                    <View style={styles.timeRow}>
                      <Input
                        value={d.startTime}
                        onChangeText={(v) => onTimeChange(i, 'startTime', v)}
                        style={styles.timeInput}
                        placeholder="HH:MM"
                      />
                      <AppText style={{ color: colors.textSecondary }}>to</AppText>
                      <Input
                        value={d.endTime}
                        onChangeText={(v) => onTimeChange(i, 'endTime', v)}
                        style={styles.timeInput}
                        placeholder="HH:MM"
                      />
                    </View>
                  </View>

                  <Switch
                    value={d.enabled}
                    onValueChange={(v) => onToggleDay(i, v)}
                    trackColor={{ true: colors.primary, false: colors.disabled }}
                    thumbColor={d.enabled ? colors.onPrimary : '#ffffff'}
                  />
                </View>
              ))}
            </View>

            <View style={{ marginTop: spacing.md, alignItems: 'flex-end' }}>
              <Button title="Save Availability" onPress={() => { /* keep your logic */ }} />
            </View>
          </Card>
        </Section>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  tierCard: { gap: spacing.md },
  badgeRow: { marginTop: spacing.md, flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  availRow: {
    flexDirection: 'row',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    gap: spacing.md,
  },
  dayName: { fontSize: typography.size.lg, fontWeight: '600', color: colors.text },
  dayNameDisabled: { color: colors.textMuted },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xs },
  timeInput: { width: 90, textAlign: 'center' },
});
