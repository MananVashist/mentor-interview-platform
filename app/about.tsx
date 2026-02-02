// app/about.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import Head from 'expo-router/head';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';


const BRAND_ORANGE = '#f58742';
const CTA_TEAL = '#18a7a7';
const BG_CREAM = '#f8f5f0';
const TEXT_DARK = '#222';
const TEXT_GRAY = '#555';

const SYSTEM_FONT = Platform.select({
  web: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
  ios: "System",
  android: "Roboto",
  default: "System"
}) as string;

const Button = ({ title, onPress, variant = "primary", style }: {
  title: string;
  onPress: () => void;
  variant?: "primary" | "outline";
  style?: any;
}) => (
  <TouchableOpacity
    style={[
      styles.buttonBase,
      variant === "primary" && styles.buttonPrimary,
      variant === "outline" && styles.buttonOutline,
      style,
    ]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={[
      styles.buttonText,
      variant === "primary" && { color: '#fff' },
      variant === "outline" && { color: TEXT_DARK },
    ]}>
      {title}
    </Text>
  </TouchableOpacity>
);

export default function About() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>About CrackJobs - Anonymous Mock Interviews with Expert Mentors</title>
        <meta name="description" content="Learn about CrackJobs mission to democratize interview preparation. Connect with verified hiring managers from top companies for domain-specific mock interviews." />
        <meta name="keywords" content="about crackjobs, mock interview platform, interview coaching, career mentorship, anonymous interviews" />
        <link rel="canonical" href="https://crackjobs.com/about" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://crackjobs.com/about" />
        <meta property="og:title" content="About CrackJobs - Anonymous Mock Interviews with Expert Mentors" />
        <meta property="og:description" content="Learn about CrackJobs mission to democratize interview preparation with expert mentors from top companies." />
        <meta property="og:image" content="https://crackjobs.com/og-image.png" />
        
        <style type="text/css">{`
          * { box-sizing: border-box; }
          html, body { margin: 0; padding: 0; height: 100%; }
          body { font-family: ${SYSTEM_FONT}; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        `}</style>
      </Head>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <Header />

        {/* Hero Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.heroCentered}>
            <View style={styles.heroTextContainer}>
              <View style={styles.pillBadge}>
                <Text style={styles.pillText}>🎯 OUR MISSION</Text>
              </View>
              <Text style={styles.heroTitle}>
                <Text style={{ color: BRAND_ORANGE }}>Bridging the gap between </Text>
                <Text style={{ color: CTA_TEAL }}>preparation and success</Text>
              </Text>
              <Text style={styles.heroSubtitle}>
                Every year, thousands of talented professionals fail interviews—not because they lack skills, but because they lack realistic practice. We're changing that.
              </Text>
            </View>
          </View>
        </View>

      

        {/* What Makes Us Different */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionKicker}>WHAT SETS US APART</Text>
          <Text style={styles.sectionTitle}>
            Built by interviewers, for candidates
          </Text>
          
          <View style={styles.differenceGrid}>
            <View style={styles.differenceCard}>
              <Text style={styles.diffEmoji}>🎯</Text>
              <Text style={styles.diffTitle}>Round-Specific Practice</Text>
              <Text style={styles.diffDesc}>
                Not generic consulting. Practice real rounds: Product Sense, SQL, ML Theory, HRBP—just like real interviews.
              </Text>
            </View>

            <View style={styles.differenceCard}>
              <Text style={styles.diffEmoji}>🔍</Text>
              <Text style={styles.diffTitle}>Rigorous Mentor Vetting</Text>
              <Text style={styles.diffDesc}>
                Every mentor undergoes LinkedIn verification, screening calls, and mock audits. Only 5-10% make it through.
              </Text>
            </View>

            <View style={styles.differenceCard}>
              <Text style={styles.diffEmoji}>🔒</Text>
              <Text style={styles.diffTitle}>Privacy First</Text>
              <Text style={styles.diffDesc}>
                Your current employer never knows. Practice without fear of exposure through complete anonymity.
              </Text>
            </View>

            <View style={styles.differenceCard}>
              <Text style={styles.diffEmoji}>📊</Text>
              <Text style={styles.diffTitle}>Structured Feedback</Text>
              <Text style={styles.diffDesc}>
                Not vague advice. Detailed evaluations on specific frameworks, communication, and domain expertise within 48 hours.
              </Text>
            </View>

            <View style={styles.differenceCard}>
              <Text style={styles.diffEmoji}>⚡</Text>
              <Text style={styles.diffTitle}>Real Interview Conditions</Text>
              <Text style={styles.diffDesc}>
                55-minute sessions that simulate actual pressure, timing, and evaluation criteria used by hiring managers.
              </Text>
            </View>

            <View style={styles.differenceCard}>
              <Text style={styles.diffEmoji}>🎥</Text>
              <Text style={styles.diffTitle}>Session Recordings</Text>
              <Text style={styles.diffDesc}>
                Review your performance, spot patterns, and track improvement across multiple sessions.
              </Text>
            </View>
          </View>
        </View>

        {/* Three-Tier System */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionKicker}>EXPERTISE LEVELS</Text>
          <Text style={styles.sectionTitle}>
            Match your career stage
          </Text>
          <Text style={styles.sectionSubtitle}>
            From mid-level professionals to executives, our three-tier system ensures you practice with the right level of mentor
          </Text>

          <View style={styles.tierContainer}>
            <View style={styles.tierCard}>
              <View style={styles.tierHeader}>
                <Text style={styles.tierEmoji}>🥉</Text>
                <Text style={styles.tierName}>Bronze Mentors</Text>
              </View>
              <Text style={styles.tierExp}>5-10 Years Experience</Text>
              <Text style={styles.tierPrice}>₹3,571 - ₹5,952</Text>
              <Text style={styles.tierDesc}>
                Senior ICs and managers who conduct 10-20 interviews annually. Ideal for candidates targeting mid-level roles.
              </Text>
            </View>

            <View style={[styles.tierCard, styles.tierCardHighlight]}>
              <View style={styles.popularBadge}>
                <Text style={styles.popularText}>MOST POPULAR</Text>
              </View>
              <View style={styles.tierHeader}>
                <Text style={styles.tierEmoji}>🥈</Text>
                <Text style={styles.tierName}>Silver Mentors</Text>
              </View>
              <Text style={styles.tierExp}>10-15 Years Experience</Text>
              <Text style={styles.tierPrice}>₹6,000 - ₹10,000</Text>
              <Text style={styles.tierDesc}>
                Senior managers and directors from top tech companies. Perfect for career switchers and senior role candidates.
              </Text>
            </View>

            <View style={styles.tierCard}>
              <View style={styles.tierHeader}>
                <Text style={styles.tierEmoji}>🥇</Text>
                <Text style={styles.tierName}>Gold Mentors</Text>
              </View>
              <Text style={styles.tierExp}>15+ Years Experience</Text>
              <Text style={styles.tierPrice}>₹10,000 - ₹15,000</Text>
              <Text style={styles.tierDesc}>
                VPs and directors who design interview processes. For candidates targeting leadership and executive positions.
              </Text>
            </View>
          </View>
        </View>

        {/* Four Domains */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionKicker}>COVERAGE AREAS</Text>
          <Text style={styles.sectionTitle}>
            Four specialized tracks, five rounds each
          </Text>
          
          <View style={styles.domainsList}>
            <View style={styles.domainRow}>
              <View style={styles.domainIcon}>
                <Text style={styles.domainIconText}>🎯</Text>
              </View>
              <View style={styles.domainInfo}>
                <Text style={styles.domainName}>Product Management</Text>
                <Text style={styles.domainRounds}>
                  Product Sense • Execution & Analytics • Strategy • Technical Basics • Behavioral
                </Text>
              </View>
            </View>

            <View style={styles.domainRow}>
              <View style={styles.domainIcon}>
                <Text style={styles.domainIconText}>📊</Text>
              </View>
              <View style={styles.domainInfo}>
                <Text style={styles.domainName}>Data Analytics</Text>
                <Text style={styles.domainRounds}>
                  Case Studies • SQL & Querying • Excel/Viz • Product Metrics • Communication
                </Text>
              </View>
            </View>

            <View style={styles.domainRow}>
              <View style={styles.domainIcon}>
                <Text style={styles.domainIconText}>🤖</Text>
              </View>
              <View style={styles.domainInfo}>
                <Text style={styles.domainName}>Data Science</Text>
                <Text style={styles.domainRounds}>
                  Python/Algo • ML Theory • Practical ML • Statistics • ML System Design
                </Text>
              </View>
            </View>

            <View style={styles.domainRow}>
              <View style={styles.domainIcon}>
                <Text style={styles.domainIconText}>👥</Text>
              </View>
              <View style={styles.domainInfo}>
                <Text style={styles.domainName}>Human Resources</Text>
                <Text style={styles.domainRounds}>
                  Talent Acquisition • HR Ops • Generalist • HRBP • COE Functions
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quality Standards */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionKicker}>OUR STANDARDS</Text>
          <Text style={styles.sectionTitle}>
            Quality over quantity, always
          </Text>

          <View style={styles.standardsGrid}>
            <View style={styles.standardCard}>
              <Text style={styles.standardStat}>100%</Text>
              <Text style={styles.standardLabel}>Mentors Manually Verified</Text>
              <Text style={styles.standardDesc}>
                LinkedIn checks, screening calls, and sample evaluations before onboarding
              </Text>
            </View>

            <View style={styles.standardCard}>
              <Text style={styles.standardStat}>48 hrs</Text>
              <Text style={styles.standardLabel}>Feedback Turnaround</Text>
              <Text style={styles.standardDesc}>
                Detailed written evaluations delivered within two business days
              </Text>
            </View>

            <View style={styles.standardCard}>
              <Text style={styles.standardStat}>4.5/5</Text>
              <Text style={styles.standardLabel}>Average Rating</Text>
              <Text style={styles.standardDesc}>
                Continuous quality monitoring through candidate ratings and audits
              </Text>
            </View>
          </View>
        </View>

        {/* Why We Exist */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionKicker}>WHY WE EXIST</Text>
          <Text style={styles.sectionTitle}>
            Interview success shouldn't depend on your network
          </Text>
          
          <View style={styles.whyCard}>
            <Text style={styles.whyText}>
              Traditional interview prep forces you to choose: practice with peers who don't know what they're doing, use AI that can't replicate real pressure, or risk exposing your job search by asking colleagues.
            </Text>
            <Text style={styles.whyText}>
              We believe every professional deserves access to expert feedback from real hiring managers—without compromising privacy or breaking the bank.
            </Text>
            <Text style={styles.whyText}>
              CrackJobs exists to level the playing field. Whether you're at a startup or switching careers, you deserve the same quality prep that insiders get through their networks.
            </Text>
          </View>
        </View>

        {/* CTA */}
        <View style={styles.sectionContainer}>
          <View style={styles.ctaBox}>
            <Text style={styles.ctaTitle}>Ready to interview with confidence?</Text>
            <Text style={styles.ctaSubtitle}>
              Join hundreds of professionals who've transformed their interview performance through expert practice
            </Text>
            <View style={styles.ctaButtons}>
              <Button
                title="Browse Mentors"
                onPress={() => router.push('/auth/sign-up')}
                variant="primary"
                style={styles.ctaButton}
              />
              <Button
                title="Learn How It Works"
                onPress={() => router.push('/how-it-works')}
                variant="outline"
                style={styles.ctaButton}
              />
            </View>
          </View>
        </View>
        <Footer />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_CREAM,
  },
  scrollContent: {
    flexGrow: 1,
  },
  buttonBase: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: CTA_TEAL,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: TEXT_DARK,
  },
  buttonText: {
    fontFamily: SYSTEM_FONT,
    fontSize: 15,
    fontWeight: '700',
  },
  sectionContainer: {
    paddingTop: 20,
    paddingBottom: 80,
    paddingLeft: 32,
    paddingRight: 32,
  },
  heroCentered: {
    maxWidth: 900,
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 40,
  },
  heroTextContainer: {
    alignItems: 'center',
  },
  pillBadge: {
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 100,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  pillText: {
    fontFamily: SYSTEM_FONT,
    fontSize: 13,
    fontWeight: '700',
    color: BRAND_ORANGE,
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontFamily: SYSTEM_FONT,
    fontSize: 52,
    fontWeight: '900',
    color: TEXT_DARK,
    textAlign: 'center',
    lineHeight: 64,
    marginBottom: 24,
    maxWidth: 800,
  },
  heroSubtitle: {
    fontFamily: SYSTEM_FONT,
    fontSize: 20,
    color: TEXT_GRAY,
    textAlign: 'center',
    lineHeight: 32,
    maxWidth: 700,
  },
  sectionKicker: {
    fontFamily: SYSTEM_FONT,
    fontSize: 12,
    fontWeight: '800',
    color: BRAND_ORANGE,
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontFamily: SYSTEM_FONT,
    fontSize: 40,
    fontWeight: '800',
    color: TEXT_DARK,
    textAlign: 'center',
    lineHeight: 52,
    marginBottom: 16,
    maxWidth: 800,
    alignSelf: 'center',
  },
  sectionSubtitle: {
    fontFamily: SYSTEM_FONT,
    fontSize: 18,
    color: TEXT_GRAY,
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 60,
    maxWidth: 700,
    alignSelf: 'center',
  },
  gapContainer: {
    flexDirection: 'row',
    gap: 32,
    maxWidth: 1100,
    alignSelf: 'center',
    marginTop: 40,
  },
  gapCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  gapNumber: {
    fontFamily: SYSTEM_FONT,
    fontSize: 48,
    fontWeight: '900',
    color: CTA_TEAL,
    marginBottom: 12,
  },
  gapLabel: {
    fontFamily: SYSTEM_FONT,
    fontSize: 16,
    color: TEXT_GRAY,
    textAlign: 'center',
    lineHeight: 24,
  },
  differenceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    maxWidth: 1200,
    alignSelf: 'center',
    marginTop: 40,
  },
  differenceCard: {
    width: 'calc(33.333% - 16px)',
    minWidth: 300,
    backgroundColor: '#ffffff',
    padding: 32,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  diffEmoji: {
    fontSize: 40,
    marginBottom: 16,
  },
  diffTitle: {
    fontFamily: SYSTEM_FONT,
    fontSize: 20,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 12,
  },
  diffDesc: {
    fontFamily: SYSTEM_FONT,
    fontSize: 15,
    color: TEXT_GRAY,
    lineHeight: 24,
  },
  tierContainer: {
    flexDirection: 'row',
    gap: 24,
    maxWidth: 1200,
    alignSelf: 'center',
    marginTop: 40,
  },
  tierCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 32,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    position: 'relative',
  },
  tierCardHighlight: {
    borderWidth: 2,
    borderColor: CTA_TEAL,
    transform: [{ scale: 1.05 }],
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    left: '50%',
    transform: [{ translateX: -60 }],
    backgroundColor: BRAND_ORANGE,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 100,
  },
  popularText: {
    fontFamily: SYSTEM_FONT,
    fontSize: 11,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 1,
  },
  tierHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  tierEmoji: {
    fontSize: 32,
  },
  tierName: {
    fontFamily: SYSTEM_FONT,
    fontSize: 22,
    fontWeight: '700',
    color: TEXT_DARK,
  },
  tierExp: {
    fontFamily: SYSTEM_FONT,
    fontSize: 14,
    color: TEXT_GRAY,
    marginBottom: 8,
  },
  tierPrice: {
    fontFamily: SYSTEM_FONT,
    fontSize: 24,
    fontWeight: '800',
    color: CTA_TEAL,
    marginBottom: 16,
  },
  tierDesc: {
    fontFamily: SYSTEM_FONT,
    fontSize: 15,
    color: TEXT_GRAY,
    lineHeight: 24,
  },
  domainsList: {
    maxWidth: 900,
    alignSelf: 'center',
    marginTop: 40,
  },
  domainRow: {
    flexDirection: 'row',
    gap: 24,
    backgroundColor: '#ffffff',
    padding: 32,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    alignItems: 'center',
  },
  domainIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: BG_CREAM,
    alignItems: 'center',
    justifyContent: 'center',
  },
  domainIconText: {
    fontSize: 32,
  },
  domainInfo: {
    flex: 1,
  },
  domainName: {
    fontFamily: SYSTEM_FONT,
    fontSize: 22,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 8,
  },
  domainRounds: {
    fontFamily: SYSTEM_FONT,
    fontSize: 14,
    color: TEXT_GRAY,
    lineHeight: 22,
  },
  standardsGrid: {
    flexDirection: 'row',
    gap: 32,
    maxWidth: 1100,
    alignSelf: 'center',
    marginTop: 40,
  },
  standardCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  standardStat: {
    fontFamily: SYSTEM_FONT,
    fontSize: 48,
    fontWeight: '900',
    color: BRAND_ORANGE,
    marginBottom: 8,
  },
  standardLabel: {
    fontFamily: SYSTEM_FONT,
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_DARK,
    textAlign: 'center',
    marginBottom: 12,
  },
  standardDesc: {
    fontFamily: SYSTEM_FONT,
    fontSize: 14,
    color: TEXT_GRAY,
    textAlign: 'center',
    lineHeight: 22,
  },
  whyCard: {
    maxWidth: 800,
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    padding: 48,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    marginTop: 40,
  },
  whyText: {
    fontFamily: SYSTEM_FONT,
    fontSize: 18,
    color: TEXT_GRAY,
    lineHeight: 32,
    marginBottom: 24,
  },
  ctaBox: {
    maxWidth: 800,
    alignSelf: 'center',
    backgroundColor: CTA_TEAL,
    padding: 60,
    borderRadius: 24,
    alignItems: 'center',
  },
  ctaTitle: {
    fontFamily: SYSTEM_FONT,
    fontSize: 36,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
  },
  ctaSubtitle: {
    fontFamily: SYSTEM_FONT,
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 32,
    opacity: 0.95,
  },
  ctaButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  ctaButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
});