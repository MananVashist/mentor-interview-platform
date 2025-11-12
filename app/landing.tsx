// app/landing.tsx

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/lib/theme_provider';

const ROLES = [
  {
    key: 'pm',
    title: 'Product Manager',
    subtitle: 'Craft narratives, roadmaps, and crisp trade-offs.',
    image:
      'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1600&auto=format&fit=crop',
  },
  {
    key: 'fe',
    title: 'Frontend Engineer',
    subtitle: 'Systems, patterns, and pixels that feel effortless.',
    image:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1600&auto=format&fit=crop',
  },
  {
    key: 'be',
    title: 'Backend Engineer',
    subtitle: 'APIs, scale, and debugging under pressure.',
    image:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop',
  },
  {
    key: 'ds',
    title: 'Data Scientist',
    subtitle: 'Signal, storytelling, and sharp hypothesis thinking.',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop',
  },
  {
    key: 'de',
    title: 'Data / Analytics Engineer',
    subtitle: 'Pipelines, quality, and metrics that actually matter.',
    image:
      'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=1600&auto=format&fit=crop',
  },
  {
    key: 'hr',
    title: 'HR / Talent',
    subtitle: 'Structured conversations and calibrated evaluations.',
    image:
      'https://images.unsplash.com/photo-1554260351-84eeec05f3dd?q=80&w=1600&auto=format&fit=crop',
  },
];

export default function LandingScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { height, width } = useWindowDimensions();

  const isSmall = width < 768;

  // Animations
  const heroOpacity = useRef(new Animated.Value(0)).current;
  const heroTranslate = useRef(new Animated.Value(24)).current;
  const rolesOpacity = useRef(new Animated.Value(0)).current;
  const rolesTranslate = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(heroOpacity, {
          toValue: 1,
          duration: 650,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(heroTranslate, {
          toValue: 0,
          duration: 650,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(120),
      Animated.parallel([
        Animated.timing(rolesOpacity, {
          toValue: 1,
          duration: 550,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(rolesTranslate, {
          toValue: 0,
          duration: 550,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [heroOpacity, heroTranslate, rolesOpacity, rolesTranslate]);

  const handleSignIn = () => {
    router.push('/(auth)/sign-in');
  };

  const handleSignUp = () => {
    router.push('/(auth)/sign-up');
  };

  const handleViewMentors = () => {
    // you can change this later to a public mentors gallery route
    router.push('/(auth)/sign-up');
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      {/* Top nav */}
      <View
        style={[
          styles.nav,
          {
            borderBottomColor: theme.colors.border,
            backgroundColor:
              Platform.OS === 'web'
                ? 'rgba(255,255,255,0.9)'
                : theme.colors.surface,
          },
        ]}
      >
        <View style={styles.navLeft}>
          <View
            style={[
              styles.logoDot,
              { backgroundColor: theme.colors.primary },
            ]}
          />
          <Text
            style={[
              styles.brand,
              { color: theme.colors.text, fontFamily: theme.fonts.heading },
            ]}
          >
            Mentor<span style={{ color: theme.colors.primary } as any}>
              Interviews
            </span>
          </Text>
        </View>

        {!isSmall && (
          <View style={styles.navCenter}>
            <Text
              style={[
                styles.navLink,
                { color: theme.colors.textMuted, fontFamily: theme.fonts.body },
              ]}
            >
              Tracks
            </Text>
            <Text
              style={[
                styles.navLink,
                { color: theme.colors.textMuted, fontFamily: theme.fonts.body },
              ]}
            >
              How it works
            </Text>
            <Text
              style={[
                styles.navLink,
                { color: theme.colors.textMuted, fontFamily: theme.fonts.body },
              ]}
            >
              Mentors
            </Text>
          </View>
        )}

        <View style={styles.navRight}>
          <TouchableOpacity
            onPress={handleSignIn}
            style={[
              styles.navGhostButton,
              { borderColor: theme.colors.border },
            ]}
          >
            <Text
              style={[
                styles.navGhostText,
                { color: theme.colors.text, fontFamily: theme.fonts.body },
              ]}
            >
              Sign in
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSignUp}
            style={[
              styles.navSolidButton,
              { backgroundColor: theme.colors.primary },
            ]}
          >
            <Text
              style={[
                styles.navSolidText,
                { color: theme.colors.onPrimary, fontFamily: theme.fonts.body },
              ]}
            >
              Sign up
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main content */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 48 }}
      >
        {/* HERO – full height */}
        <View style={{ minHeight: height }}>
          <Image
            source={{
              uri:
                'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2000&auto=format&fit=crop',
            }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay} />

          <Animated.View
            style={[
              styles.heroContent,
              {
                opacity: heroOpacity,
                transform: [{ translateY: heroTranslate }],
              },
            ]}
          >
            <Text
              style={[
                styles.heroKicker,
                { fontFamily: theme.fonts.body, color: theme.colors.onPrimary },
              ]}
            >
              Prepare for interviews
            </Text>
            <Text
              style={[
                styles.heroTitle,
                { fontFamily: theme.fonts.heading, color: theme.colors.onPrimary },
              ]}
            >
              The right way.
            </Text>
            <Text
              style={[
                styles.heroSubtitle,
                { fontFamily: theme.fonts.body, color: theme.colors.onPrimary },
              ]}
            >
              Role-aligned mock interviews with mentors from top product,
              engineering and data teams.
            </Text>

            <View
              style={[
                styles.heroCtas,
                { flexDirection: isSmall ? 'column' : 'row' },
              ]}
            >
              <TouchableOpacity
                onPress={handleViewMentors}
                style={[
                  styles.heroPrimaryButton,
                  { backgroundColor: theme.colors.surface },
                ]}
              >
                <Text
                  style={[
                    styles.heroPrimaryText,
                    { color: theme.colors.text, fontFamily: theme.fonts.body },
                  ]}
                >
                  View mentors & book
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSignUp}
                style={[
                  styles.heroSecondaryButton,
                  { borderColor: theme.colors.surface },
                ]}
              >
                <Text
                  style={[
                    styles.heroSecondaryText,
                    { color: theme.colors.onPrimary, fontFamily: theme.fonts.body },
                  ]}
                >
                  Start with free profile review
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.heroMetaRow}>
              <Text
                style={[
                  styles.heroMetaText,
                  { color: theme.colors.onPrimary, fontFamily: theme.fonts.body },
                ]}
              >
                Inspired by interview loops at{' '}
                <Text style={{ fontWeight: '700' }}>LinkedIn</Text> &{' '}
                <Text style={{ fontWeight: '700' }}>Coursera</Text>.
              </Text>
            </View>
          </Animated.View>
        </View>

        {/* ROLE STRIP – image-driven */}
        <Animated.View
          style={[
            styles.rolesSection,
            {
              opacity: rolesOpacity,
              transform: [{ translateY: rolesTranslate }],
              backgroundColor: theme.colors.background,
            },
          ]}
        >
          <View style={styles.rolesHeader}>
            <Text
              style={[
                styles.rolesTitle,
                { color: theme.colors.text, fontFamily: theme.fonts.heading },
              ]}
            >
              Built for how you interview.
            </Text>
            <Text
              style={[
                styles.rolesSubtitle,
                { color: theme.colors.textMuted, fontFamily: theme.fonts.body },
              ]}
            >
              Product, engineering, data, talent — each track has its own loop,
              questions and bar.
            </Text>
          </View>

          <View style={styles.rolesList}>
            {ROLES.map((role, index) => {
              const isReversed = !isSmall && index % 2 === 1;

              return (
                <View
                  key={role.key}
                  style={[
                    styles.roleRow,
                    isReversed && styles.roleRowReversed,
                  ]}
                >
                  <View style={styles.roleImageWrap}>
                    <Image
                      source={{ uri: role.image }}
                      style={styles.roleImage}
                      resizeMode="cover"
                    />
                  </View>

                  <View style={styles.roleTextWrap}>
                    <Text
                      style={[
                        styles.roleTitle,
                        { color: theme.colors.text, fontFamily: theme.fonts.heading },
                      ]}
                    >
                      {role.title}
                    </Text>
                    <Text
                      style={[
                        styles.roleSubtitle,
                        {
                          color: theme.colors.textMuted,
                          fontFamily: theme.fonts.body,
                        },
                      ]}
                    >
                      {role.subtitle}
                    </Text>
                    <View style={styles.rolePillRow}>
                      <View
                        style={[
                          styles.rolePill,
                          { backgroundColor: theme.colors.surface },
                        ]}
                      >
                        <Text
                          style={[
                            styles.rolePillText,
                            {
                              color: theme.colors.textMuted,
                              fontFamily: theme.fonts.body,
                            },
                          ]}
                        >
                          2 technical + 1 HR loop
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.rolePill,
                          { backgroundColor: theme.colors.surface },
                        ]}
                      >
                        <Text
                          style={[
                            styles.rolePillText,
                            {
                              color: theme.colors.textMuted,
                              fontFamily: theme.fonts.body,
                            },
                          ]}
                        >
                          Structured feedback & scorecards
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  nav: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  navLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
  },
  logoDot: {
    width: 12,
    height: 12,
    borderRadius: 12,
  },
  brand: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.2,
  } as any,
  navCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 18,
  },
  navLink: {
    fontSize: 13,
  },
  navRight: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },
  navGhostButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
  },
  navGhostText: {
    fontSize: 13,
    fontWeight: '600',
  },
  navSolidButton: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 999,
  },
  navSolidText: {
    fontSize: 13,
    fontWeight: '700',
  },

  scroll: {
    flex: 1,
  },

  heroImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15,23,42,0.45)',
  },
  heroContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 64,
    paddingTop: 96,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroKicker: {
    fontSize: 14,
    letterSpacing: 1.3,
    textTransform: 'uppercase',
    opacity: 0.9,
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: 44,
    lineHeight: 50,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 15,
    maxWidth: 560,
    textAlign: 'center',
    opacity: 0.95,
    marginBottom: 24,
  },
  heroCtas: {
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 12,
    rowGap: 10,
    marginBottom: 18,
  },
  heroPrimaryButton: {
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 999,
  },
  heroPrimaryText: {
    fontSize: 14,
    fontWeight: '700',
  },
  heroSecondaryButton: {
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 1,
  },
  heroSecondaryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  heroMetaRow: {
    marginTop: 4,
  },
  heroMetaText: {
    fontSize: 12,
    opacity: 0.9,
  },

  rolesSection: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  rolesHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  rolesTitle: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 6,
  },
  rolesSubtitle: {
    fontSize: 13,
    textAlign: 'center',
    maxWidth: 520,
  },
  rolesList: {
    rowGap: 24,
  },
  roleRow: {
    flexDirection: 'row',
    columnGap: 18,
    alignItems: 'stretch',
  },
  roleRowReversed: {
    flexDirection: 'row-reverse',
  },
  roleImageWrap: {
    flex: 1,
    borderRadius: 18,
    overflow: 'hidden',
  },
  roleImage: {
    width: '100%',
    height: 200,
  },
  roleTextWrap: {
    flex: 1,
    justifyContent: 'center',
    rowGap: 8,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  roleSubtitle: {
    fontSize: 13,
  },
  rolePillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 8,
    columnGap: 8,
    marginTop: 4,
  },
  rolePill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  rolePillText: {
    fontSize: 11,
    fontWeight: '500',
  },
});
