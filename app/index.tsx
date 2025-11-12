// app/index.tsx
// Web landing page – image-driven, concise, RN-web safe

import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function LandingPage() {
  const { width, height } = useWindowDimensions();
  const router = useRouter();
  const isMobile = width < 768;

  // hero image, roles images are all stock / interview-ish
  const roleCards = [
    {
      id: 'pm',
      title: 'Product Manager',
      uri: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1400&auto=format&fit=crop',
    },
    {
      id: 'fe',
      title: 'Frontend Engineer',
      uri: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1400&auto=format&fit=crop',
    },
    {
      id: 'be',
      title: 'Backend Engineer',
      uri: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1400&auto=format&fit=crop',
    },
    {
      id: 'ds',
      title: 'Data Scientist',
      uri: 'https://images.unsplash.com/photo-1534759846116-57968a6b8c52?q=80&w=1400&auto=format&fit=crop',
    },
    {
      id: 'ba',
      title: 'Business Analyst',
      uri: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1400&auto=format&fit=crop',
    },
    {
      id: 'hr',
      title: 'HR / Talent',
      uri: 'https://images.unsplash.com/photo-1554260570-9140fd3b7612?q=80&w=1400&auto=format&fit=crop',
    },
  ];

  const goSignIn = () => {
    router.push('/(auth)/sign-in');
  };
  const goSignUp = () => {
    router.push('/(auth)/sign-up');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      {/* TOP BAR */}
      <View style={styles.topbar}>
        <View style={styles.brandWrap}>
          <View style={styles.brandDot} />
          <Text style={styles.brandTitle}>MentorInterviews</Text>
        </View>

        {!isMobile && (
          <View style={styles.navLinks}>
            <TouchableOpacity>
              <Text style={styles.navText}>Tracks</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.navText}>How it works</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.navText}>Pricing</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.navActions}>
          <TouchableOpacity onPress={goSignIn} style={styles.ghostBtn}>
            <Text style={styles.ghostBtnText}>Sign in</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={goSignUp} style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* BODY */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* HERO */}
        <View
          style={[
            styles.hero,
            {
              flexDirection: isMobile ? 'column' : 'row',
              minHeight: Math.max(520, height * 0.7),
            },
          ]}
        >
          {/* left text */}
          <View style={styles.heroTextBlock}>
            <Text style={styles.heroEyebrow}>INTERVIEW COACHING, ROLE-FIRST</Text>
            <Text style={styles.heroTitle}>Prepare for interviews.</Text>
            <Text style={styles.heroSubtitle}>The right way.</Text>
            <Text style={styles.heroBody}>
              Real mentors, real interview flows, tailored to Product, Engineering and Data roles.
              Minimal fluff, maximum signal.
            </Text>

            <View style={[styles.heroActions, { flexDirection: isMobile ? 'column' : 'row' }]}>
              <TouchableOpacity onPress={goSignUp} style={styles.primaryBtnHero}>
                <Text style={styles.primaryBtnHeroText}>Start with a track</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {}}
                style={[
                  styles.ghostBtnHero,
                  { marginTop: isMobile ? 10 : 0, marginLeft: isMobile ? 0 : 10 },
                ]}
              >
                <Text style={styles.ghostBtnHeroText}>View how it works</Text>
              </TouchableOpacity>
            </View>

            {/* little info strip */}
            <View style={styles.infoStrip}>
              <View style={styles.infoPill}>
                <Text style={styles.infoPillTitle}>Role-specific sessions</Text>
                <Text style={styles.infoPillDesc}>Tech + HR loops</Text>
              </View>
              <View style={styles.infoPill}>
                <Text style={styles.infoPillTitle}>Mentor-led</Text>
                <Text style={styles.infoPillDesc}>Real interviewers</Text>
              </View>
            </View>
          </View>

          {/* right image */}
          <View style={styles.heroImageWrap}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1573496782646-e8d943a4bdd1?q=80&w=1600&auto=format&fit=crop',
              }}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <View style={styles.heroImageOverlay} />
          </View>
        </View>

        {/* TRACKS SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose your interview path</Text>
          <Text style={styles.sectionSubtitle}>
            Pick the track you’re actually applying for — we’ll match the expectations.
          </Text>

          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 16,
              marginTop: 20,
            }}
          >
            {roleCards.map((role) => (
              <View
                key={role.id}
                style={[
                  styles.roleCard,
                  { width: isMobile ? '100%' : '31%' },
                ]}
              >
                <Image source={{ uri: role.uri }} style={styles.roleImage} resizeMode="cover" />
                <View style={styles.roleBody}>
                  <Text style={styles.roleTitle}>{role.title}</Text>
                  <Text style={styles.roleDesc}>Mock rounds, structured feedback, interview prep.</Text>
                  <TouchableOpacity
                    onPress={goSignUp}
                    style={{ marginTop: 10, alignSelf: 'flex-start' }}
                  >
                    <Text style={styles.roleLink}>View sessions →</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* HOW IT WORKS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How it works</Text>
          <Text style={styles.sectionSubtitle}>3 steps, no confusion.</Text>

          <View
            style={{
              flexDirection: isMobile ? 'column' : 'row',
              gap: 16,
              marginTop: 20,
            }}
          >
            <View style={styles.stepCard}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>1</Text>
              </View>
              <Text style={styles.stepTitle}>Pick your role</Text>
              <Text style={styles.stepDesc}>
                PM, FE, BE, Data, BA — we keep interviews role-aligned.
              </Text>
            </View>
            <View style={styles.stepCard}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>2</Text>
              </View>
              <Text style={styles.stepTitle}>Book a mentor session</Text>
              <Text style={styles.stepDesc}>
                Real interviewers walk you through realistic rounds.
              </Text>
            </View>
            <View style={styles.stepCard}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>3</Text>
              </View>
              <Text style={styles.stepTitle}>Get the feedback</Text>
              <Text style={styles.stepDesc}>
                Specific notes on structure, clarity and role-fit.
              </Text>
            </View>
          </View>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© {new Date().getFullYear()} MentorInterviews</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  topbar: {
    width: '100%',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(15,23,42,0.05)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    gap: 12,
  },
  brandWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: '#0E9384',
  },
  brandTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  navLinks: { flexDirection: 'row', gap: 18 },
  navText: { color: '#64748b', fontSize: 13 },
  navActions: { flexDirection: 'row', gap: 10 },
  ghostBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.35)',
    backgroundColor: '#fff',
  },
  ghostBtnText: { color: '#0f172a', fontWeight: '500', fontSize: 13 },
  primaryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#0E9384',
  },
  primaryBtnText: { color: '#fff', fontWeight: '600', fontSize: 13 },

  hero: {
    width: '100%',
    paddingHorizontal: 28,
    paddingTop: 26,
    gap: 28,
  },
  heroTextBlock: {
    flex: 1,
    justifyContent: 'center',
    gap: 10,
  },
  heroEyebrow: {
    color: '#0E9384',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.1,
  },
  heroTitle: { fontSize: 46, fontWeight: '800', color: '#0f172a' },
  heroSubtitle: { fontSize: 46, fontWeight: '800', color: '#0f172a', marginTop: -6 },
  heroBody: { color: '#64748b', fontSize: 14, maxWidth: 500, marginTop: 6, lineHeight: 20 },
  heroActions: { gap: 10, marginTop: 16 },
  primaryBtnHero: {
    backgroundColor: '#0E9384',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  primaryBtnHeroText: { color: '#fff', fontWeight: '600' },
  ghostBtnHero: {
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.14)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#fff',
  },
  ghostBtnHeroText: { color: '#0f172a', fontWeight: '500' },
  infoStrip: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
    flexWrap: 'wrap',
  },
  infoPill: {
    backgroundColor: 'rgba(14,147,132,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(14,147,132,0.12)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  infoPillTitle: { fontWeight: '600', color: '#0f172a' },
  infoPillDesc: { color: '#64748b', fontSize: 12, marginTop: 2 },

  heroImageWrap: {
    flex: 0.9,
    minHeight: 320,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#0f172a',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.12)',
  },

  section: {
    width: '100%',
    paddingHorizontal: 28,
    paddingTop: 34,
  },
  sectionTitle: { fontSize: 22, fontWeight: '700', color: '#0f172a' },
  sectionSubtitle: { color: '#64748b', marginTop: 3 },
  roleCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.25)',
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  roleImage: { width: '100%', height: 110 },
  roleBody: { padding: 14 },
  roleTitle: { fontWeight: '600', color: '#0f172a' },
  roleDesc: { color: '#64748b', fontSize: 12, marginTop: 3 },
  roleLink: { color: '#0E9384', fontWeight: '500', fontSize: 12 },

  stepCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.25)',
    backgroundColor: '#fff',
    padding: 16,
  },
  stepBadge: {
    width: 34,
    height: 34,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(14,147,132,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  stepBadgeText: { fontWeight: '700', color: '#0E9384' },
  stepTitle: { fontWeight: '600', color: '#0f172a', marginBottom: 4 },
  stepDesc: { color: '#64748b', fontSize: 12 },

  footer: {
    width: '100%',
    paddingHorizontal: 28,
    paddingTop: 30,
  },
  footerText: { color: '#94a3b8', fontSize: 12 },
});
