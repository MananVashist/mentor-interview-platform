import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/lib/store";
import { colors, spacing, borderRadius, typography } from "@/lib/theme";
import { Heading, AppText, Card, Section, Button } from "@/lib/ui";

const SUPABASE_URL = "https://rcbaaiiawrglvyzmawvr.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjYmFhaWlhd3JnbHZ5em1hd3ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNTA1NjAsImV4cCI6MjA3NjcyNjU2MH0.V3qRHGXBMlspRS7XFJlXdo4qIcCms60Nepp7dYMEjLA";

type AdminProfile = {
  id: number;
  name: string;
  description: string | null;
  is_active: boolean;
};

type Mentor = {
  id: string;
  email?: string;
  professional_title?: string | null;
  experience_description?: string | null;
  expertise_profiles?: string[];
  profile?: {
    full_name?: string | null;
    avatar_url?: string | null;
  };
  session_price_inr?: number | null;
  session_price?: number | null;
  total_sessions?: number | null;
  mentor_level?: string | null;
};

export default function CandidateDashboard() {
  const { profile: authProfile } = useAuthStore();
  const router = useRouter();

  const [adminProfiles, setAdminProfiles] = useState<AdminProfile[]>([]);
  const [profilesLoading, setProfilesLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);

  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [mentorsLoading, setMentorsLoading] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  // fetch admin profiles
  useEffect(() => {
    (async () => {
      setProfilesLoading(true);
      try {
        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/interview_profiles_admin?select=*`,
          {
            headers: {
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            },
          }
        );
        const text = await res.text();
        if (res.ok) {
          const data = JSON.parse(text) as AdminProfile[];
          const actives = (data || []).filter((p) => p.is_active !== false);
          setAdminProfiles(actives);
          if (actives.length > 0) {
            setSelectedProfile((prev) => prev || actives[0].name);
          }
        } else {
          console.log(
            "[candidate/index] admin profiles fetch failed",
            res.status,
            text
          );
          setAdminProfiles([]);
        }
      } catch (err) {
        console.log("[candidate/index] admin profiles error", err);
        setAdminProfiles([]);
      } finally {
        setProfilesLoading(false);
      }
    })();
  }, []);

  // fetch mentors for selected profile
  const fetchMentorsForProfile = useCallback(async (profileName: string | null) => {
    if (!profileName) return;
    setMentorsLoading(true);
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/mentors?select=*,profile:profiles(*)`,
        {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
        }
      );
      const text = await res.text();
      if (res.ok) {
        const data = JSON.parse(text) as Mentor[];
        const filtered = (data || []).filter((m) =>
          Array.isArray(m.expertise_profiles)
            ? m.expertise_profiles.includes(profileName)
            : false
        );
        setMentors(filtered);
      } else {
        console.log("[candidate/index] mentors fetch failed", res.status, text);
        setMentors([]);
      }
    } catch (err) {
      console.log("[candidate/index] mentors fetch error", err);
      setMentors([]);
    } finally {
      setMentorsLoading(false);
    }
  }, []);

  // refresh mentors when selection changes
  useEffect(() => {
    if (selectedProfile) {
      fetchMentorsForProfile(selectedProfile);
    }
  }, [selectedProfile, fetchMentorsForProfile]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMentorsForProfile(selectedProfile);
    setRefreshing(false);
  };

  const handleViewMentor = (id: string) => {
    console.log("[NAV DBG] Navigating to candidate mentor detail:", id);
    router.push({
      pathname: "/(candidate)/[id]",
      params: { id },
    });
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Section style={styles.header}>
        <Heading>Find Your Mentor</Heading>
        <AppText style={styles.headerSub}>
          Select a profile and see mentors who interview for that role.
        </AppText>
      </Section>

      {/* Profile Selector */}
      <Section>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: spacing.sm }}
        >
          {profilesLoading ? (
            <ActivityIndicator color={colors.accent} />
          ) : adminProfiles.length === 0 ? (
            <AppText style={{ color: colors.textSecondary }}>
              No interview profiles configured yet.
            </AppText>
          ) : (
            adminProfiles.map((p) => {
              const active = selectedProfile === p.name;
              return (
                <TouchableOpacity
                  key={p.id}
                  onPress={() => setSelectedProfile(p.name)}
                  style={[styles.profilePill, active && styles.profilePillActive]}
                >
                  <AppText
                    style={[
                      styles.profilePillText,
                      active && styles.profilePillTextActive,
                    ]}
                  >
                    {p.name}
                  </AppText>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      </Section>

      {/* Mentor Cards */}
      <Section>
        {mentorsLoading ? (
          <View style={[styles.center, { paddingVertical: spacing.lg }]}>
            <ActivityIndicator size="large" color={colors.accent} />
          </View>
        ) : mentors.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Ionicons name="search-outline" size={26} color={colors.textSecondary} />
            <AppText style={styles.emptyTitle}>0 mentors found</AppText>
            <AppText style={styles.emptyText}>
              Try another interview profile, or ask admin to add mentors for this track.
            </AppText>
          </Card>
        ) : (
          <View style={styles.mentorGrid}>
            {mentors.map((m) => {
              const price = m.session_price_inr || m.session_price || 0;
              const level = m.mentor_level || "bronze";
              return (
                <Card key={m.id} style={styles.mentorCard}>
                  <View style={styles.mentorHeader}>
                    {m.profile?.avatar_url ? (
                      <Image
                        source={{ uri: m.profile.avatar_url }}
                        style={styles.avatar}
                      />
                    ) : (
                      <View style={styles.avatarPlaceholder}>
                        <AppText style={styles.avatarInitial}>
                          {m.profile?.full_name?.charAt(0) || "M"}
                        </AppText>
                      </View>
                    )}
                    <View style={{ flex: 1 }}>
                      <AppText style={styles.mentorName}>
                        {m.profile?.full_name || "Mentor"}
                      </AppText>
                      <AppText style={styles.mentorTitle}>
                        {m.professional_title ||
                          (m.expertise_profiles || []).join(", ") ||
                          "Interview Mentor"}
                      </AppText>
                    </View>
                    <View style={styles.levelBadge}>
                      <AppText style={styles.levelBadgeText}>
                        {level.toUpperCase()}
                      </AppText>
                    </View>
                  </View>

                  {m.experience_description ? (
                    <AppText numberOfLines={3} style={styles.mentorDesc}>
                      {m.experience_description}
                    </AppText>
                  ) : null}

                  <View style={styles.mentorFooter}>
                    <View>
                      <AppText style={styles.priceLabel}>Per session</AppText>
                      <AppText style={styles.priceValue}>₹{price}</AppText>
                    </View>
                    <Button
                      title="View & Book"
                      onPress={() => handleViewMentor(m.id)}
                      size="sm"
                    />
                  </View>
                </Card>
              );
            })}
          </View>
        )}
      </Section>
      <View style={{ height: spacing.xl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingTop: spacing.lg, paddingBottom: spacing.sm },
  headerSub: { color: colors.textSecondary, marginTop: spacing.xs },
  profilePill: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    backgroundColor: colors.background,
  },
  profilePillActive: {
    backgroundColor: colors.CTA,
    borderColor: colors.CTA,
  },
  profilePillText: { fontWeight: "600", color: colors.text },
  profilePillTextActive: { color: colors.CTA_TEXT },
  center: { justifyContent: "center", alignItems: "center" },
  mentorGrid: { gap: spacing.md },
  mentorCard: { padding: spacing.md, borderRadius: borderRadius.lg },
  mentorHeader: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  avatar: { width: 46, height: 46, borderRadius: 46 },
  avatarPlaceholder: {
    width: 46,
    height: 46,
    borderRadius: 46,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitial: { fontWeight: "700", color: colors.text },
  mentorName: { fontWeight: "700", fontSize: typography.size.md },
  mentorTitle: { color: colors.textSecondary, fontSize: typography.size.sm },
  levelBadge: {
    backgroundColor: "#FDF2E9",
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  levelBadgeText: { fontSize: 10, fontWeight: "700", color: "#BB5A00" },
  mentorDesc: { color: colors.textSecondary, marginBottom: spacing.md },
  mentorFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.md,
  },
  priceLabel: { color: colors.textTertiary, fontSize: typography.size.xs },
  priceValue: { fontWeight: "700", fontSize: typography.size.md },
  emptyCard: { alignItems: "center", gap: spacing.sm, padding: spacing.lg },
  emptyTitle: { fontWeight: "700" },
  emptyText: { color: colors.textSecondary, textAlign: "center" },
});
