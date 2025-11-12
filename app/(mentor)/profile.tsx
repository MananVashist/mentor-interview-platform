// app/(mentor)/profile.tsx
import { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/lib/store';
import { supabase } from '@/lib/supabase/client';

import { colors, spacing, borderRadius, typography, shadows } from '@/lib/theme';
import { Heading, AppText, Section, Card, Button, Input, ScreenBackground, Label } from '@/lib/ui';

export default function MentorProfileScreen() {
  const { profile, session } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mentorId, setMentorId] = useState<string | null>(null);

  // PUBLIC (shown to candidates)
  const [professionalTitle, setProfessionalTitle] = useState('');
  const [experienceDescription, setExperienceDescription] = useState('');

  // PRIVATE / INTERNAL
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [designation, setDesignation] = useState('');
  const [company, setCompany] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [bio, setBio] = useState('');

  // Interview profiles selection
  const [availableProfiles, setAvailableProfiles] = useState<{ id: number; name: string }[]>([]);
  const [selectedProfiles, setSelectedProfiles] = useState<number[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);

        // 1) Load mentor row (schema-dependent; assuming mentors.profile_id = profiles.id)
        const mentorRes = await fetch(
          `https://rcbaaiiawrglvyzmawvr.supabase.co/rest/v1/mentors?profile_id=eq.${profile?.id}&select=*`,
          {
            headers: {
              apikey: session?.access_token || '',
              Authorization: `Bearer ${session?.access_token || ''}`,
            },
          }
        );
        const mentorText = await mentorRes.text();
        const mentorRows = mentorRes.ok && mentorText ? JSON.parse(mentorText) : [];
        const currentMentor = mentorRows?.[0] ?? null;
        if (mounted) setMentorId(currentMentor?.id ?? null);

        // Hydrate fields if present
        if (currentMentor) {
          setProfessionalTitle(currentMentor.title || '');
          setExperienceDescription(currentMentor.description || '');
          setLinkedInUrl(currentMentor.linkedin_url || '');
          if (currentMentor.designation) setDesignation(currentMentor.designation);
          if (currentMentor.company) setCompany(currentMentor.company);
          if (currentMentor.years_of_experience) setYearsOfExperience(String(currentMentor.years_of_experience));
          if (currentMentor.bio) setBio(currentMentor.bio);
          if (currentMentor.profile_ids) setSelectedProfiles(currentMentor.profile_ids as number[]);
        }

        // 2) Admin-configured interview profiles
        const profRes = await fetch(
          `https://rcbaaiiawrglvyzmawvr.supabase.co/rest/v1/interview_profiles_admin?is_active=eq.true&select=id,name`,
          {
            headers: {
              apikey: session?.access_token || '',
              Authorization: `Bearer ${session?.access_token || ''}`,
            },
          }
        );
        const profText = await profRes.text();
        const list = profRes.ok && profText ? JSON.parse(profText) : [];
        if (mounted) setAvailableProfiles(list || []);
      } catch {
        /* ignore */
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [profile?.id, session?.access_token]);

  const toggleProfile = (id: number) => {
    setSelectedProfiles((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    if (!mentorId) return;
    try {
      setSaving(true);
      // Upsert mentor public/private details
      const { error } = await supabase
        .from('mentors')
        .update({
          title: professionalTitle,
          description: experienceDescription,
          linkedin_url: linkedInUrl,
          designation,
          company,
          years_of_experience: yearsOfExperience ? Number(yearsOfExperience) : null,
          bio,
          profile_ids: selectedProfiles,
        })
        .eq('id', mentorId);

      if (!error) {
        // noop: show a small success UI
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ScreenBackground>
        <Section style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
          <AppText style={{ marginTop: spacing.sm, color: colors.textSecondary }}>
            Loading your profile…
          </AppText>
        </Section>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }}>
        <Section style={{ paddingTop: spacing.lg }}>
          <Heading level={1}>My Profile</Heading>
          <AppText style={{ color: colors.textSecondary, marginTop: spacing.xs }}>
            Public details are visible to candidates. Private details are for internal use.
          </AppText>
        </Section>

        {/* Public profile */}
        <Section>
          <Card style={shadows.card as any}>
            <Heading level={2} style={{ marginBottom: spacing.md }}>Public Profile</Heading>

            <Label>Professional title</Label>
            <Input
              value={professionalTitle}
              onChangeText={setProfessionalTitle}
              placeholder='e.g., "Senior Product Manager at Loco"'
              style={{ marginBottom: spacing.md }}
            />

            <Label>Description</Label>
            <Input
              value={experienceDescription}
              onChangeText={setExperienceDescription}
              placeholder='e.g., "11 yrs of experience. Skilled in Product Management & HR interviews."'
              style={{ marginBottom: spacing.md, height: 100 }}
              multiline
            />

            <Label>LinkedIn URL</Label>
            <Input
              value={linkedInUrl}
              onChangeText={setLinkedInUrl}
              placeholder="https://www.linkedin.com/in/…"
              autoCapitalize="none"
            />
          </Card>
        </Section>

        {/* Private details */}
        <Section>
          <Card style={shadows.card as any}>
            <Heading level={2} style={{ marginBottom: spacing.md }}>Private Details</Heading>

            <Label>Designation</Label>
            <Input value={designation} onChangeText={setDesignation} placeholder="e.g., Senior PM" style={{ marginBottom: spacing.md }} />

            <Label>Company</Label>
            <Input value={company} onChangeText={setCompany} placeholder="e.g., Loco" style={{ marginBottom: spacing.md }} />

            <Label>Years of experience</Label>
            <Input
              value={yearsOfExperience}
              onChangeText={setYearsOfExperience}
              keyboardType="number-pad"
              placeholder="e.g., 11"
              style={{ marginBottom: spacing.md }}
            />

            <Label>Bio (internal)</Label>
            <Input
              value={bio}
              onChangeText={setBio}
              placeholder="Short internal bio"
              style={{ height: 90 }}
              multiline
            />
          </Card>
        </Section>

        {/* Interview profiles (choose from admin list) */}
        <Section>
          <Card style={shadows.card as any}>
            <Heading level={2} style={{ marginBottom: spacing.md }}>Interview Profiles</Heading>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
              {availableProfiles.map((p) => {
                const selected = selectedProfiles.includes(p.id);
                return (
                  <View
                    key={p.id}
                    style={[
                      styles.profileChip,
                      selected && styles.profileChipSelected,
                      shadows.card as any,
                    ]}
                  >
                    <Ionicons
                      name={selected ? 'checkbox-outline' : 'square-outline'}
                      size={18}
                      color={selected ? colors.primary : colors.textSecondary}
                    />
                    <AppText
                      style={[
                        styles.profileChipText,
                        selected && styles.profileChipTextSelected,
                      ]}
                      onPress={() => toggleProfile(p.id)}
                    >
                      {p.name}
                    </AppText>
                  </View>
                );
              })}
            </View>
          </Card>
        </Section>

        {/* Save Bar */}
        <Section>
          <Card style={[styles.saveBar, shadows.card as any]}>
            <AppText style={{ color: colors.textSecondary }}>
              Update your details and profiles, then save.
            </AppText>
            <Button title={saving ? 'Saving…' : 'Save Changes'} onPress={handleSave} />
          </Card>
        </Section>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  profileChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.pill,
  },
  profileChipSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  profileChipText: {
    fontSize: typography.size.md,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  profileChipTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  saveBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
});
