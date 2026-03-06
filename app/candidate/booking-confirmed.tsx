// app/candidate/booking-confirmed.tsx
import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Svg, Path, Circle, Rect } from 'react-native-svg';
import { supabase } from '@/lib/supabase/client';

const F = Platform.select({
  web: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  default: 'System',
}) as string;

const TEAL = '#0E9384';
const DARK = '#111827';
const MID = '#374151';
const MUTED = '#6B7280';
const BORDER = '#E5E7EB';
const WHITE = '#FFFFFF';
const BG = '#F8F5F0';

const IcoCheck = ({ s = 32, c = TEAL }: { s?: number; c?: string }) => (
  <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={c} strokeWidth="1.8" />
    <Path d="M7 12.5l3.5 3.5 6.5-7" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const IcoMail = ({ s = 22, c = TEAL }: { s?: number; c?: string }) => (
  <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="4" width="20" height="16" rx="3" stroke={c} strokeWidth="2" />
    <Path d="M2 8l10 6 10-6" stroke={c} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const IcoUser = ({ s = 22, c = '#7C3AED' }: { s?: number; c?: string }) => (
  <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
    <Path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="7" r="4" stroke={c} strokeWidth="2" />
  </Svg>
);

const IcoCalendar = ({ s = 22, c = '#D97706' }: { s?: number; c?: string }) => (
  <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="4" width="18" height="18" rx="3" stroke={c} strokeWidth="2" />
    <Path d="M16 2v4M8 2v4M3 10h18" stroke={c} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export default function BookingConfirmedScreen() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get the signed-in email to show in the "check inbox" message.
    // _id_.tsx already signed the guest in with the dummy password before
    // navigating here, so getUser() will return the guest session.
    supabase.auth.getUser()
      .then(({ data }) => setEmail(data?.user?.email ?? null))
      .catch(() => setEmail(null))
      .finally(() => setLoading(false));
  }, []);

  const maskedEmail = email
    ? (() => {
        const [local, domain] = email.split('@');
        const visible = local.slice(0, 2);
        const masked = '*'.repeat(Math.max(local.length - 2, 3));
        return `${visible}${masked}@${domain}`;
      })()
    : 'your email';

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: BG }}>
        <ActivityIndicator size="large" color={TEAL} />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={s.scroll}
      showsVerticalScrollIndicator={false}
    >
      {/* ── HERO BANNER ───────────────────────────────────────── */}
      <View style={s.hero}>
        <View style={s.heroCheckWrap}>
          <IcoCheck s={36} c={WHITE} />
        </View>
        <Text style={s.heroTitle}>Booking Confirmed!</Text>
        <Text style={s.heroSub}>
          Payment received. Your mentor will confirm the session shortly.
        </Text>
      </View>

      <View style={s.body}>

        {/* ── EMAIL PASSWORD CARD — PRIMARY ACTION ──────────────── */}
        <View style={s.emailCard}>
          <View style={s.emailCardTop}>
            <View style={s.emailIconWrap}>
              <IcoMail s={24} c={TEAL} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.emailCardLabel}>CHECK YOUR INBOX</Text>
              <Text style={s.emailCardTitle}>Your account password has been sent</Text>
            </View>
          </View>
          <Text style={s.emailCardDesc}>
            We've sent your temporary password to{' '}
            <Text style={s.emailHighlight}>{maskedEmail}</Text>
            {'. '}
            Use it to sign in next time, then change it via Forgot Password.
          </Text>
          <View style={s.emailCardHint}>
            <Text style={s.emailCardHintTxt}>
              Can't find it? Check spam or contact{' '}
              <Text style={s.helpdeskLink}>crackjobshelpdesk@gmail.com</Text>
            </Text>
          </View>
        </View>

        {/* ── NEXT STEPS ────────────────────────────────────────── */}
        <Text style={s.sectionTitle}>Two more things to do</Text>

        <View style={s.stepCard}>
          <View style={[s.stepIcon, { backgroundColor: '#EDE9FE' }]}>
            <IcoUser s={20} c="#7C3AED" />
          </View>
          <View style={s.stepBody}>
            <Text style={s.stepNo}>Step 1</Text>
            <Text style={s.stepTitle}>Complete your profile</Text>
            <Text style={s.stepDesc}>
              Add your current title and role so your mentor knows who they're speaking with. Takes 30 seconds.
            </Text>
          </View>
        </View>

        <View style={s.stepCard}>
          <View style={[s.stepIcon, { backgroundColor: '#FEF3C7' }]}>
            <IcoCalendar s={20} c="#D97706" />
          </View>
          <View style={s.stepBody}>
            <Text style={s.stepNo}>Step 2</Text>
            <Text style={s.stepTitle}>Watch for the confirmation</Text>
            <Text style={s.stepDesc}>
              Your mentor will accept the booking first. Once they do, you'll get a calendar invite with the session details.
            </Text>
          </View>
        </View>

        {/* ── CTA ───────────────────────────────────────────────── */}
        <TouchableOpacity
          style={s.cta}
          onPress={() => router.replace('/candidate/profile')}
          activeOpacity={0.85}
        >
          <Text style={s.ctaTxt}>Complete My Profile →</Text>
        </TouchableOpacity>

        <Text style={s.lockNote}>
          🔒 Browse Mentors and My Bookings are locked until your profile is complete.
        </Text>

      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  scroll: { flexGrow: 1, backgroundColor: BG },

  // Hero
  hero: {
    backgroundColor: TEAL,
    paddingTop: 56,
    paddingBottom: 40,
    paddingHorizontal: 28,
    alignItems: 'center',
  },
  heroCheckWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  heroTitle: {
    fontFamily: F,
    fontSize: 28,
    fontWeight: '800',
    color: WHITE,
    textAlign: 'center',
    marginBottom: 10,
  },
  heroSub: {
    fontFamily: F,
    fontSize: 15,
    color: 'rgba(255,255,255,0.82)',
    textAlign: 'center',
    lineHeight: 22,
  },

  // Body
  body: {
    padding: 24,
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },

  // Email card
  emailCard: {
    backgroundColor: WHITE,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#CCFBF1',
    padding: 20,
    marginBottom: 28,
    marginTop: -20, // pulls card up to overlap hero slightly
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  emailCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 14,
  },
  emailIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  emailCardLabel: {
    fontFamily: F,
    fontSize: 10,
    fontWeight: '800',
    color: TEAL,
    letterSpacing: 1,
    marginBottom: 4,
  },
  emailCardTitle: {
    fontFamily: F,
    fontSize: 16,
    fontWeight: '700',
    color: DARK,
  },
  emailCardDesc: {
    fontFamily: F,
    fontSize: 14,
    color: MID,
    lineHeight: 21,
    marginBottom: 14,
  },
  emailHighlight: {
    fontWeight: '700',
    color: DARK,
  },
  emailCardHint: {
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  emailCardHintTxt: {
    fontFamily: F,
    fontSize: 12,
    color: '#065F46',
    lineHeight: 18,
  },
  helpdeskLink: {
    fontWeight: '700',
    color: TEAL,
  },

  // Steps
  sectionTitle: {
    fontFamily: F,
    fontSize: 15,
    fontWeight: '700',
    color: DARK,
    marginBottom: 14,
  },
  stepCard: {
    backgroundColor: WHITE,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    marginBottom: 12,
  },
  stepIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepBody: { flex: 1 },
  stepNo: {
    fontFamily: F,
    fontSize: 10,
    fontWeight: '700',
    color: MUTED,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  stepTitle: {
    fontFamily: F,
    fontSize: 14,
    fontWeight: '700',
    color: DARK,
    marginBottom: 4,
  },
  stepDesc: {
    fontFamily: F,
    fontSize: 13,
    color: MUTED,
    lineHeight: 19,
  },

  // CTA
  cta: {
    backgroundColor: TEAL,
    borderRadius: 12,
    paddingVertical: 17,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  ctaTxt: {
    fontFamily: F,
    fontSize: 16,
    fontWeight: '800',
    color: WHITE,
    letterSpacing: 0.3,
  },
  lockNote: {
    fontFamily: F,
    fontSize: 12,
    color: MUTED,
    textAlign: 'center',
    lineHeight: 18,
  },
});