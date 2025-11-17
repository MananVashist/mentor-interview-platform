// app/candidate/index.tsx
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/lib/store";
import {
  colors,
  spacing,
  borderRadius,
  typography,
  shadows,
} from "@/lib/theme";
import {
  Heading,
  AppText,
  Card,
  Section,
  Button,
  ScreenBackground,
} from "@/lib/ui";

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

  // Fetch admin profiles
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

  // Fetch mentors for selected profile
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
        console.log(
          "[candidate/index] mentors fetch failed",
          res.status,
          text
        );
        setMentors([]);
      }
    } catch (err) {
      console.log("[candidate/index] mentors fetch error", err);
      setMentors([]);
    } finally {
      setMentorsLoading(false);
    }
  }, []);

  // Refresh mentors when selection changes
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
    router.push({
      pathname: "/candidate/[id]",
      params: { id },
    });
  };

  const getLevelBadgeStyle = (level?: string | null) => {
    const l = (level || "bronze").toLowerCase();
    switch (l) {
      case "gold":
        return { bg: "#FEF9C3", fg: "#854D0E", icon: "star" as const };
      case "silver":
        return { bg: "#F3F4F6", fg: "#6b7280", icon: "star-half" as const };
      default:
        return { bg: "#FDF2E9", fg: "#CD7F32", icon: "medal" as const };
    }
  };

  return (
    <ScreenBackground>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        contentContainerStyle={{ paddingBottom: spacing.xl }}
      >
        {/* Header */}
        <Section style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons name="search" size={32} color={colors.primary} />
          </View>
          <Heading level={1}>Find Your Mentor</Heading>
          <AppText style={styles.headerSub}>
            Select a profile below and connect with experienced professionals
          </AppText>
        </Section>

        {/* Profile Selector */}
        <Section>
          <AppText style={styles.sectionLabel}>Select Interview Profile</AppText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.profilesScroll}
          >
            {profilesLoading ? (
              <ActivityIndicator color={colors.primary} />
            ) : adminProfiles.length === 0 ? (
              <AppText style={styles.noProfilesText}>
                No interview profiles configured yet.
              </AppText>
            ) : (
              adminProfiles.map((p) => {
                const active = selectedProfile === p.name;
                return (
                  <TouchableOpacity
                    key={p.id}
                    onPress={() => setSelectedProfile(p.name)}
                    style={[
                      styles.profilePill,
                      active && styles.profilePillActive,
                      shadows.card as any,
                    ]}
                  >
                    <Ionicons
                      name={active ? "checkmark-circle" : "ellipse-outline"}
                      size={18}
                      color={active ? colors.primary : colors.textSecondary}
                    />
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

        {/* Mentors Grid */}
        <Section>
          {mentorsLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <AppText style={styles.loadingText}>Finding mentors...</AppText>
            </View>
          ) : mentors.length === 0 ? (
            <Card style={[styles.emptyCard, shadows.card as any]}>
              <View style={styles.emptyIcon}>
                <Ionicons
                  name="search-outline"
                  size={48}
                  color={colors.textTertiary}
                />
              </View>
              <Heading level={2} style={styles.emptyTitle}>
                No mentors found
              </Heading>
              <AppText style={styles.emptyText}>
                Try another interview profile, or check back soon as we add more
                mentors to this track.
              </AppText>
            </Card>
          ) : (
            <>
              <View style={styles.resultsHeader}>
                <AppText style={styles.resultsCount}>
                  {mentors.length}{" "}
                  {mentors.length === 1 ? "mentor" : "mentors"} available
                </AppText>
              </View>
              <View style={styles.mentorGrid}>
                {mentors.map((m) => {
                  const basePrice =
                    m.session_price_inr ?? m.session_price ?? 0;
                  const candidatePrice = basePrice
                    ? Math.round(basePrice * 1.2)
                    : 0;
                  const levelConfig = getLevelBadgeStyle(m.mentor_level);

                  const profileLabel = selectedProfile
                    ? `${selectedProfile} mentor`
                    : "Interview mentor";

                  return (
                    <Card
                      key={m.id}
                      style={[styles.mentorCard, shadows.card as any]}
                    >
                      {/* Header with anonymous avatar and level */}
                      <View style={styles.mentorHeader}>
                        <View style={styles.mentorAvatar}>
                          <Ionicons
                            name="person-outline"
                            size={22}
                            color="#FFFFFF"
                          />
                        </View>
                        <View style={styles.mentorInfo}>
                          {/* Anonymised primary label */}
                          <AppText style={styles.mentorName}>
                            {profileLabel}
                          </AppText>
                          <AppText
                            style={styles.mentorTitle}
                            numberOfLines={1}
                          >
                            {m.professional_title || "CrackJobs mentor"}
                          </AppText>
                        </View>
                        <View
                          style={[
                            styles.levelBadge,
                            { backgroundColor: levelConfig.bg },
                          ]}
                        >
                          <Ionicons
                            name={levelConfig.icon}
                            size={12}
                            color={levelConfig.fg}
                          />
                          <AppText
                            style={[
                              styles.levelBadgeText,
                              { color: levelConfig.fg },
                            ]}
                          >
                            {(m.mentor_level || "bronze").toUpperCase()}
                          </AppText>
                        </View>
                      </View>

                      {/* Stats */}
                      {m.total_sessions != null && m.total_sessions > 0 && (
                        <View style={styles.mentorStats}>
                          <View style={styles.statItem}>
                            <Ionicons
                              name="checkmark-done"
                              size={14}
                              color={colors.success}
                            />
                            <AppText style={styles.statText}>
                              {m.total_sessions} sessions completed
                            </AppText>
                          </View>
                        </View>
                      )}

                      {/* Description */}
                      {m.experience_description ? (
                        <AppText numberOfLines={3} style={styles.mentorDesc}>
                          {m.experience_description}
                        </AppText>
                      ) : (
                        <AppText style={styles.mentorDescPlaceholder}>
                          Experienced professional ready to help you crack your
                          interviews.
                        </AppText>
                      )}

                      {/* Expertise tags */}
                      {m.expertise_profiles &&
                        m.expertise_profiles.length > 0 && (
                          <View style={styles.expertiseTags}>
                            {m.expertise_profiles.slice(0, 3).map((tag, idx) => (
                              <View key={idx} style={styles.expertiseTag}>
                                <AppText style={styles.expertiseTagText}>
                                  {tag}
                                </AppText>
                              </View>
                            ))}
                            {m.expertise_profiles.length > 3 && (
                              <View style={styles.expertiseTag}>
                                <AppText style={styles.expertiseTagText}>
                                  +{m.expertise_profiles.length - 3}
                                </AppText>
                              </View>
                            )}
                          </View>
                        )}

                      {/* Footer with price and action */}
                      <View style={styles.mentorFooter}>
                        <View style={styles.priceSection}>
                          <AppText style={styles.priceLabel}>
                            Per booking (2 sessions)
                          </AppText>
                          <AppText style={styles.priceValue}>
                            ₹{candidatePrice.toLocaleString("en-IN")}
                          </AppText>
                          <AppText style={styles.priceSub}>
                            Mentor payout + 20% platform fee
                          </AppText>
                        </View>
                        <Button
                          title="View details"
                          onPress={() => handleViewMentor(m.id)}
                          size="sm"
                          style={styles.viewButton}
                        />
                      </View>
                    </Card>
                  );
                })}
              </View>
            </>
          )}
        </Section>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    alignItems: "center",
  },
  headerIcon: {
    marginBottom: spacing.sm,
  },
  headerSub: {
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: "center",
  },

  sectionLabel: {
    fontSize: typography.size.sm,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },

  profilesScroll: {
    gap: spacing.sm,
    paddingRight: spacing.md,
  },
  profilePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
  },
  profilePillActive: {
    backgroundColor: "rgba(14,147,132,0.08)",
    borderColor: colors.primary,
  },
  profilePillText: {
    fontWeight: "600",
    color: colors.textSecondary,
    fontSize: typography.size.sm,
  },
  profilePillTextActive: {
    color: colors.primary,
  },
  noProfilesText: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
  },

  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xl * 2,
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.textSecondary,
  },

  emptyCard: {
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: "center",
  },
  emptyIcon: {
    marginBottom: spacing.md,
    opacity: 0.6,
  },
  emptyTitle: {
    marginBottom: spacing.xs,
  },
  emptyText: {
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },

  resultsHeader: {
    marginBottom: spacing.md,
  },
  resultsCount: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
  },

  mentorGrid: {
    gap: spacing.md,
  },
  mentorCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    backgroundColor: colors.surface,
  },
  mentorHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  mentorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
  mentorInfo: {
    flex: 1,
  },
  mentorName: {
    fontSize: typography.size.md,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  mentorTitle: {
    fontSize: typography.size.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  levelBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  levelBadgeText: {
    fontSize: typography.size.xxs,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  mentorStats: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  statText: {
    fontSize: typography.size.xs,
    color: colors.textSecondary,
  },

  mentorDesc: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  mentorDescPlaceholder: {
    fontSize: typography.size.sm,
    color: colors.textTertiary,
    marginBottom: spacing.sm,
  },

  expertiseTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  expertiseTag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: colors.backgroundSecondary,
  },
  expertiseTagText: {
    fontSize: typography.size.xs,
    color: colors.textSecondary,
  },

  mentorFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  priceSection: {
    flexShrink: 1,
  },
  priceLabel: {
    fontSize: typography.size.xs,
    color: colors.textTertiary,
  },
  priceValue: {
    fontSize: typography.size.md,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  priceSub: {
    fontSize: typography.size.xxs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  viewButton: {
    alignSelf: "flex-end",
  },
});
