// app/about.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, useWindowDimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Head from 'expo-router/head';
import Svg, { Path, Circle } from 'react-native-svg';
import { BrandHeader } from '@/lib/ui';
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

// SVG Icons
const TargetIcon = ({ size = 48, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Mission">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <Circle cx="12" cy="12" r="6" stroke={color} strokeWidth="2" />
    <Circle cx="12" cy="12" r="2" fill={color} />
  </Svg>
);

const ShieldIcon = ({ size = 48, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Privacy">
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M9 12l2 2 4-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const HeartIcon = ({ size = 48, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Empathy">
    <Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const TrendIcon = ({ size = 48, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Growth">
    <Path d="M23 6l-9.5 9.5-5-5L1 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M17 6h6v6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const UsersIcon = ({ size = 48, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Community">
    <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Circle cx="9" cy="7" r="4" stroke={color} strokeWidth="2" />
    <Path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const CheckIcon = ({ size = 18, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Check">
    <Circle cx="12" cy="12" r="10" fill={color} />
    <Path d="M7 12l3.5 3.5 6.5-7" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
  </Svg>
);

export default function About() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isSmall = width < 900;

  return (
    <>
      <Head>
        <title>About CrackJobs | Mission to Democratize Interview Preparation</title>
        <meta name="description" content="CrackJobs connects job seekers with expert mentors from Google, Amazon, Meta for anonymous mock interviews. Learn our mission to make quality interview preparation accessible through real practice with industry professionals." />
        <meta name="keywords" content="about crackjobs, interview platform, mission, mock interview platform, anonymous interviews, interview preparation, FAANG interview prep" />
        <link rel="canonical" href="https://crackjobs.com/about" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://crackjobs.com/about" />
        <meta property="og:title" content="About CrackJobs | Mission to Democratize Interview Preparation" />
        <meta property="og:description" content="CrackJobs connects job seekers with expert mentors from Google, Amazon, Meta for anonymous mock interviews." />
        <meta property="og:image" content="https://crackjobs.com/og-image.png" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://crackjobs.com/about" />
        <meta property="twitter:title" content="About CrackJobs | Mission to Democratize Interview Preparation" />
        <meta property="twitter:description" content="CrackJobs connects job seekers with expert mentors from Google, Amazon, Meta for anonymous mock interviews." />
        <meta property="twitter:image" content="https://crackjobs.com/og-image.png" />
      </Head>

      <View style={styles.container}>
        <ScrollView style={styles.scrollContent}>
          
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.headerInner, isSmall && styles.headerInnerMobile]}>
              <BrandHeader style={{ marginBottom: 0 }} small={isSmall} />
              <View style={[styles.navRight, isSmall && styles.navRightMobile]}>
                <TouchableOpacity onPress={() => router.push('/auth/sign-in')}>
                  <Text style={styles.navLinkText}>Log in</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnSmall} onPress={() => router.push('/auth/sign-up')}>
                  <Text style={styles.btnSmallText}>Get Started</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Hero */}
          <View style={[styles.hero, isSmall && styles.heroMobile]}>
            <View style={styles.badge}><Text style={styles.badgeText}>ABOUT CRACKJOBS</Text></View>
            <Text style={[styles.heroTitle, isSmall && styles.heroTitleMobile]}>
              Practice Makes Perfect
            </Text>
            <Text style={[styles.heroSubtitle, isSmall && styles.heroSubtitleMobile]}>
              We're democratizing interview preparation by connecting ambitious job seekers with experienced professionals from Google, Amazon, Meta, and other top companies.
            </Text>
          </View>

          {/* Mission */}
          <View style={[styles.section, { backgroundColor: 'white' }]}>
            <Text style={styles.sectionLabel}>OUR MISSION</Text>
            <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}>Why CrackJobs Exists</Text>
            <View style={styles.missionContent}>
              <Text style={styles.bodyText}>
                Landing your dream job shouldn't be a matter of luck—it should be the result of thorough preparation and confidence built through real practice with industry professionals.
              </Text>
              <Text style={styles.bodyText}>
                We believe that quality interview preparation should be accessible to everyone, not just those who can afford expensive coaching programs or have insider connections at top companies.
              </Text>
              <Text style={styles.bodyText}>
                CrackJobs bridges the gap between theory and practice by providing affordable, on-demand access to professionals who conduct real interviews at their companies. They know exactly what hiring managers look for because they are the hiring managers.
              </Text>
            </View>
          </View>

          {/* The Problem */}
          <View style={[styles.section, { backgroundColor: BG_CREAM }]}>
            <Text style={styles.sectionLabel}>THE PROBLEM WE SOLVE</Text>
            <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}>Traditional Interview Prep Falls Short</Text>
            <View style={styles.problemsGrid}>
              <View style={styles.problemCard}>
                <Text style={styles.problemTitle}>📚 Books & Online Courses</Text>
                <Text style={styles.problemDesc}>Teach theory but lack real-world practice. You can memorize frameworks, but can you apply them under pressure with someone evaluating you?</Text>
              </View>
              <View style={styles.problemCard}>
                <Text style={styles.problemTitle}>👥 Friends & Peers</Text>
                <Text style={styles.problemDesc}>May not have the expertise or time. Well-meaning but often lack experience conducting interviews at your target companies.</Text>
              </View>
              <View style={styles.problemCard}>
                <Text style={styles.problemTitle}>💰 Expensive Coaching</Text>
                <Text style={styles.problemDesc}>Costs ₹50,000-₹2,00,000+ for comprehensive programs. Inaccessible to most candidates, especially students and early-career professionals.</Text>
              </View>
              <View style={styles.problemCard}>
                <Text style={styles.problemTitle}>🔁 No Feedback Loop</Text>
                <Text style={styles.problemDesc}>Without structured feedback, you repeat the same mistakes. You don't know what you don't know.</Text>
              </View>
            </View>
          </View>

          {/* What Makes Us Different */}
          <View style={[styles.section, { backgroundColor: 'white' }]}>
            <Text style={styles.sectionLabel}>WHAT MAKES US DIFFERENT</Text>
            <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}>The CrackJobs Advantage</Text>
            <View style={styles.advantagesGrid}>
              <View style={styles.advantageCard}>
                <View style={styles.advantageIcon}>
                  <TargetIcon size={40} color={CTA_TEAL} />
                </View>
                <Text style={styles.advantageTitle}>Real Industry Experience</Text>
                <Text style={styles.advantageDesc}>Our mentors aren't professional coaches—they're active Product Managers, Data Scientists, HR Leaders, and Analysts who interview candidates regularly at Google, Amazon, Meta, Flipkart, and other top companies. They know the exact evaluation criteria because they use it daily.</Text>
              </View>
              <View style={styles.advantageCard}>
                <View style={styles.advantageIcon}>
                  <ShieldIcon size={40} color={CTA_TEAL} />
                </View>
                <Text style={styles.advantageTitle}>100% Anonymous & Safe</Text>
                <Text style={styles.advantageDesc}>No names, no emails, no judgments visible between you and your mentor. Practice in a completely safe environment where you can make mistakes, ask "stupid" questions, and learn without fear of real-world consequences to your professional reputation.</Text>
              </View>
              <View style={styles.advantageCard}>
                <View style={styles.advantageIcon}>
                  <TrendIcon size={40} color={CTA_TEAL} />
                </View>
                <Text style={styles.advantageTitle}>Structured Feedback System</Text>
                <Text style={styles.advantageDesc}>Every session includes detailed, actionable feedback across multiple dimensions—technical skills, communication, problem-solving approach, and culture fit. You get a clear roadmap of what to improve, not vague advice like "practice more."</Text>
              </View>
              <View style={styles.advantageCard}>
                <View style={styles.advantageIcon}>
                  <UsersIcon size={40} color={CTA_TEAL} />
                </View>
                <Text style={styles.advantageTitle}>Affordable & Flexible</Text>
                <Text style={styles.advantageDesc}>Pay ₹999-₹2,499 per session—not ₹50,000+ for a full program. Book sessions on your schedule, practice exactly what you need, and get started within 24 hours. No long-term commitments, no packages you don't need.</Text>
              </View>
            </View>
          </View>

          {/* Who We Serve */}
          <View style={[styles.section, { backgroundColor: '#f0f8ff' }]}>
            <Text style={styles.sectionLabel}>WHO WE SERVE</Text>
            <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}>Interview Prep for Every Stage</Text>
            <View style={styles.audienceGrid}>
              <View style={styles.audienceCard}>
                <Text style={styles.audienceEmoji}>🎓</Text>
                <Text style={styles.audienceTitle}>Fresh Graduates</Text>
                <Text style={styles.audienceDesc}>Landing your first job at a top company. Master the fundamentals and build confidence through structured practice.</Text>
              </View>
              <View style={styles.audienceCard}>
                <Text style={styles.audienceEmoji}>💼</Text>
                <Text style={styles.audienceTitle}>Experienced Professionals</Text>
                <Text style={styles.audienceDesc}>Leveling up to senior roles or switching companies. Prepare for leadership interviews and strategic case studies.</Text>
              </View>
              <View style={styles.audienceCard}>
                <Text style={styles.audienceEmoji}>🔄</Text>
                <Text style={styles.audienceTitle}>Career Switchers</Text>
                <Text style={styles.audienceDesc}>Transitioning to Product Management, Data Analytics, or HR. Build domain expertise and interview skills simultaneously.</Text>
              </View>
            </View>
          </View>

          {/* Our Values */}
          <View style={[styles.section, { backgroundColor: 'white' }]}>
            <Text style={styles.sectionLabel}>OUR VALUES</Text>
            <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}>What Drives Everything We Do</Text>
            <View style={styles.valuesGrid}>
              <View style={styles.valueCard}>
                <Text style={styles.valueEmoji}>🎯</Text>
                <Text style={styles.valueTitle}>Excellence</Text>
                <Text style={styles.valueDesc}>We vet every mentor rigorously—verifying their employment at top companies and conducting trial sessions to ensure they meet our quality standards. Only 15% of mentor applicants are accepted.</Text>
              </View>
              <View style={styles.valueCard}>
                <Text style={styles.valueEmoji}>🤝</Text>
                <Text style={styles.valueTitle}>Empathy</Text>
                <Text style={styles.valueDesc}>We understand the anxiety and stress of job hunting. Every feature we build—from anonymous profiles to structured feedback—is designed to create a supportive, judgment-free environment.</Text>
              </View>
              <View style={styles.valueCard}>
                <Text style={styles.valueEmoji}>🔒</Text>
                <Text style={styles.valueTitle}>Privacy & Safety</Text>
                <Text style={styles.valueDesc}>Your practice sessions are completely anonymous. No personal details are shared between candidates and mentors. What happens in your mock interview stays in your mock interview.</Text>
              </View>
              <View style={styles.valueCard}>
                <Text style={styles.valueEmoji}>💡</Text>
                <Text style={styles.valueTitle}>Continuous Improvement</Text>
                <Text style={styles.valueDesc}>We constantly evolve our platform based on user feedback. Every week, we analyze session data and feedback to improve mentor quality, booking experience, and evaluation frameworks.</Text>
              </View>
            </View>
          </View>

          {/* Our Impact */}
          <View style={[styles.section, { backgroundColor: BG_CREAM }]}>
            <Text style={styles.sectionLabel}>OUR IMPACT</Text>
            <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}>Real Results From Real Practice</Text>
            <View style={styles.impactContent}>
              <Text style={styles.bodyText}>
                Since our launch in 2024, we've facilitated over 1,500+ mock interview sessions connecting ambitious candidates with expert mentors from India's top companies.
              </Text>
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>300+</Text>
                  <Text style={styles.statLabel}>Successful Candidates</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>50+</Text>
                  <Text style={styles.statLabel}>Verified Mentors</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>4.8/5</Text>
                  <Text style={styles.statLabel}>Average Rating</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>85%</Text>
                  <Text style={styles.statLabel}>See Improvement</Text>
                </View>
              </View>
              <Text style={styles.bodyText}>
                Our average candidate reports significant improvement in confidence, communication clarity, and technical performance after just 2-3 practice sessions. Many have gone on to land offers at Google, Amazon, Meta, Flipkart, Microsoft, and other dream companies.
              </Text>
            </View>
          </View>

          {/* How It Works */}
          <View style={[styles.section, { backgroundColor: 'white' }]}>
            <Text style={styles.sectionLabel}>HOW IT WORKS</Text>
            <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}>From Sign-Up to Success in 4 Steps</Text>
            <View style={styles.stepsGrid}>
              <View style={styles.stepCard}>
                <View style={styles.stepNum}><Text style={styles.stepNumText}>1</Text></View>
                <Text style={styles.stepTitle}>Browse Expert Mentors</Text>
                <Text style={styles.stepDesc}>Filter by role (PM, HR, Data Analytics, Data Science), company (Google, Amazon, Meta), and topic. View mentor profiles, ratings, and availability.</Text>
              </View>
              <View style={styles.stepCard}>
                <View style={styles.stepNum}><Text style={styles.stepNumText}>2</Text></View>
                <Text style={styles.stepTitle}>Book Your Session</Text>
                <Text style={styles.stepDesc}>Choose a time slot that works for you, pay securely (₹999-₹2,499), and receive instant confirmation. Sessions are available 24/7.</Text>
              </View>
              <View style={styles.stepCard}>
                <View style={styles.stepNum}><Text style={styles.stepNumText}>3</Text></View>
                <Text style={styles.stepTitle}>Practice 55-Min Interview</Text>
                <Text style={styles.stepDesc}>Join the video call, go through a realistic interview simulation, and get live feedback. Completely anonymous—no names, no emails visible.</Text>
              </View>
              <View style={styles.stepCard}>
                <View style={styles.stepNum}><Text style={styles.stepNumText}>4</Text></View>
                <Text style={styles.stepTitle}>Get Detailed Evaluation</Text>
                <Text style={styles.stepDesc}>Receive structured feedback within 48 hours covering technical skills, communication, problem-solving, and specific areas to improve. Track your progress over multiple sessions.</Text>
              </View>
            </View>
          </View>

          {/* Join Community */}
          <View style={[styles.section, { backgroundColor: '#f0f8ff' }]}>
            <Text style={styles.sectionLabel}>JOIN OUR COMMUNITY</Text>
            <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}>Start Your Interview Prep Journey</Text>
            <View style={styles.communityContent}>
              <Text style={styles.bodyText}>
                Whether you're preparing for your next big interview or looking to give back by mentoring others, we'd love to have you on board.
              </Text>
              <View style={styles.communityOptions}>
                <View style={styles.communityCard}>
                  <Text style={styles.communityCardTitle}>For Candidates</Text>
                  <Text style={styles.communityCardDesc}>Practice interviews with experts from Google, Amazon, Meta, and Flipkart. Build confidence through real feedback.</Text>
                  <View style={styles.communityFeatures}>
                    <View style={styles.featureItem}>
                      <CheckIcon size={16} color={CTA_TEAL} />
                      <Text style={styles.featureText}>Anonymous practice sessions</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <CheckIcon size={16} color={CTA_TEAL} />
                      <Text style={styles.featureText}>Structured feedback</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <CheckIcon size={16} color={CTA_TEAL} />
                      <Text style={styles.featureText}>Affordable pricing (₹999-₹2,499)</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <CheckIcon size={16} color={CTA_TEAL} />
                      <Text style={styles.featureText}>Book instantly, start in 24 hours</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.communityBtn} onPress={() => router.push('/auth/sign-up')}>
                    <Text style={styles.communityBtnText}>Get Started as Candidate →</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.communityCard}>
                  <Text style={styles.communityCardTitle}>For Mentors</Text>
                  <Text style={styles.communityCardDesc}>Share your expertise, help candidates succeed, and earn ₹800-₹2,000 per session on your own schedule.</Text>
                  <View style={styles.communityFeatures}>
                    <View style={styles.featureItem}>
                      <CheckIcon size={16} color={CTA_TEAL} />
                      <Text style={styles.featureText}>Set your own availability</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <CheckIcon size={16} color={CTA_TEAL} />
                      <Text style={styles.featureText}>Choose topics you're expert in</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <CheckIcon size={16} color={CTA_TEAL} />
                      <Text style={styles.featureText}>Give back to community</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <CheckIcon size={16} color={CTA_TEAL} />
                      <Text style={styles.featureText}>Flexible commitment</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.communityBtn} onPress={() => router.push('/auth/sign-up')}>
                    <Text style={styles.communityBtnText}>Become a Mentor →</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* Final CTA */}
          <View style={styles.finalCta}>
            <Text style={[styles.finalCtaTitle, isSmall && { fontSize: 34 }]}>Ready to Ace Your Next Interview?</Text>
            <Text style={[styles.finalCtaSubtitle, isSmall && { fontSize: 17 }]}>Join 300+ candidates who've improved their interview skills and landed offers at top companies through CrackJobs.</Text>
            <TouchableOpacity style={styles.finalCtaBtn} onPress={() => router.push('/auth/sign-up')}>
              <Text style={styles.finalCtaBtnText}>Start Practicing Today →</Text>
            </TouchableOpacity>
            <View style={styles.finalCtaFeatures}>
              <Text style={styles.finalCtaFeature}>🔒 100% Anonymous</Text>
              <Text style={styles.finalCtaFeature}>⭐ Expert Mentors</Text>
              <Text style={styles.finalCtaFeature}>💳 Pay per session</Text>
            </View>
          </View>

          <Footer />
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG_CREAM },
  scrollContent: { minHeight: '100%' },
  header: { backgroundColor: BG_CREAM, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  headerInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1200, width: '100%', alignSelf: 'center', paddingHorizontal: 24 },
  headerInnerMobile: { paddingHorizontal: 16 },
  navRight: { flexDirection: 'row', gap: 24, alignItems: 'center' },
  navRightMobile: { gap: 12 },
  navLinkText: { fontFamily: SYSTEM_FONT, fontWeight: '600', color: TEXT_DARK },
  btnSmall: { backgroundColor: CTA_TEAL, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 100 },
  btnSmallText: { fontFamily: SYSTEM_FONT, fontSize: 13, fontWeight: '700', color: '#fff' },
  hero: { maxWidth: 900, width: '100%', alignSelf: 'center', paddingHorizontal: 24, paddingVertical: 70, alignItems: 'center' },
  heroMobile: { paddingVertical: 45 },
  badge: { backgroundColor: 'white', borderWidth: 1, borderColor: '#d8eded', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 24, marginBottom: 28 },
  badgeText: { color: CTA_TEAL, fontWeight: '700', fontSize: 12, letterSpacing: 0.6 },
  heroTitle: { fontFamily: SYSTEM_FONT, fontWeight: '900', fontSize: 56, color: BRAND_ORANGE, lineHeight: 64, textAlign: 'center', marginBottom: 24 },
  heroTitleMobile: { fontSize: 38, lineHeight: 46 },
  heroSubtitle: { fontFamily: SYSTEM_FONT, fontSize: 20, color: TEXT_GRAY, lineHeight: 32, textAlign: 'center', maxWidth: 750 },
  heroSubtitleMobile: { fontSize: 18, lineHeight: 28 },
  section: { paddingVertical: 80, paddingHorizontal: 24 },
  sectionLabel: { fontFamily: SYSTEM_FONT, fontSize: 12, fontWeight: '700', color: CTA_TEAL, letterSpacing: 1.8, textAlign: 'center', marginBottom: 14, textTransform: 'uppercase' },
  sectionTitle: { fontFamily: SYSTEM_FONT, fontSize: 42, fontWeight: '800', color: TEXT_DARK, textAlign: 'center', marginBottom: 48, maxWidth: 850, alignSelf: 'center' },
  sectionTitleMobile: { fontSize: 32 },
  missionContent: { maxWidth: 850, alignSelf: 'center' },
  bodyText: { fontFamily: SYSTEM_FONT, fontSize: 17, color: TEXT_DARK, lineHeight: 29, marginBottom: 20 },
  problemsGrid: { maxWidth: 1100, alignSelf: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: 24, justifyContent: 'center' },
  problemCard: { flex: 1, minWidth: 280, maxWidth: 320, backgroundColor: 'white', padding: 28, borderRadius: 16, borderWidth: 1, borderColor: '#e8e8e8' },
  problemTitle: { fontFamily: SYSTEM_FONT, fontSize: 18, fontWeight: '700', color: TEXT_DARK, marginBottom: 12 },
  problemDesc: { fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_GRAY, lineHeight: 24 },
  advantagesGrid: { maxWidth: 1100, alignSelf: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: 28, justifyContent: 'center' },
  advantageCard: { flex: 1, minWidth: 280, maxWidth: 500, backgroundColor: BG_CREAM, padding: 32, borderRadius: 16, borderWidth: 1, borderColor: '#e8e8e8' },
  advantageIcon: { marginBottom: 16 },
  advantageTitle: { fontFamily: SYSTEM_FONT, fontSize: 22, fontWeight: '700', color: TEXT_DARK, marginBottom: 14 },
  advantageDesc: { fontFamily: SYSTEM_FONT, fontSize: 16, color: TEXT_GRAY, lineHeight: 26 },
  audienceGrid: { maxWidth: 1000, alignSelf: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: 24, justifyContent: 'center' },
  audienceCard: { flex: 1, minWidth: 260, maxWidth: 300, backgroundColor: 'white', padding: 32, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#e8e8e8' },
  audienceEmoji: { fontSize: 48, marginBottom: 16 },
  audienceTitle: { fontFamily: SYSTEM_FONT, fontSize: 20, fontWeight: '700', color: TEXT_DARK, marginBottom: 12, textAlign: 'center' },
  audienceDesc: { fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_GRAY, lineHeight: 24, textAlign: 'center' },
  valuesGrid: { maxWidth: 1100, alignSelf: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: 24, justifyContent: 'center' },
  valueCard: { flex: 1, minWidth: 280, maxWidth: 500, backgroundColor: BG_CREAM, padding: 32, borderRadius: 16, borderWidth: 1, borderColor: '#e8e8e8' },
  valueEmoji: { fontSize: 40, marginBottom: 12 },
  valueTitle: { fontFamily: SYSTEM_FONT, fontSize: 22, fontWeight: '700', color: TEXT_DARK, marginBottom: 12 },
  valueDesc: { fontFamily: SYSTEM_FONT, fontSize: 16, color: TEXT_GRAY, lineHeight: 26 },
  impactContent: { maxWidth: 900, alignSelf: 'center' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 24, justifyContent: 'center', marginVertical: 40 },
  statCard: { minWidth: 140, alignItems: 'center', backgroundColor: 'white', padding: 24, borderRadius: 12 },
  statValue: { fontFamily: SYSTEM_FONT, fontSize: 36, fontWeight: '800', color: CTA_TEAL, marginBottom: 8 },
  statLabel: { fontFamily: SYSTEM_FONT, fontSize: 14, color: TEXT_GRAY, textAlign: 'center' },
  stepsGrid: { maxWidth: 1100, alignSelf: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: 28, justifyContent: 'center' },
  stepCard: { flex: 1, minWidth: 260, maxWidth: 280, backgroundColor: BG_CREAM, padding: 28, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#e8e8e8' },
  stepNum: { width: 56, height: 56, borderRadius: 28, backgroundColor: CTA_TEAL, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  stepNumText: { fontFamily: SYSTEM_FONT, fontSize: 26, fontWeight: '800', color: 'white' },
  stepTitle: { fontFamily: SYSTEM_FONT, fontSize: 18, fontWeight: '700', color: TEXT_DARK, marginBottom: 12, textAlign: 'center' },
  stepDesc: { fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_GRAY, lineHeight: 24, textAlign: 'center' },
  communityContent: { maxWidth: 1100, alignSelf: 'center' },
  communityOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: 28, justifyContent: 'center', marginTop: 40 },
  communityCard: { flex: 1, minWidth: 320, maxWidth: 500, backgroundColor: 'white', padding: 36, borderRadius: 16, borderWidth: 1, borderColor: '#e8e8e8' },
  communityCardTitle: { fontFamily: SYSTEM_FONT, fontSize: 24, fontWeight: '700', color: TEXT_DARK, marginBottom: 14 },
  communityCardDesc: { fontFamily: SYSTEM_FONT, fontSize: 16, color: TEXT_GRAY, lineHeight: 26, marginBottom: 24 },
  communityFeatures: { marginBottom: 28, gap: 12 },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  featureText: { fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_DARK, flex: 1 },
  communityBtn: { backgroundColor: CTA_TEAL, paddingVertical: 14, paddingHorizontal: 28, borderRadius: 100, alignItems: 'center' },
  communityBtnText: { fontFamily: SYSTEM_FONT, fontSize: 15, fontWeight: '700', color: 'white' },
  finalCta: { backgroundColor: '#0f0f0f', paddingVertical: 80, paddingHorizontal: 24, alignItems: 'center' },
  finalCtaTitle: { fontFamily: SYSTEM_FONT, fontSize: 46, fontWeight: '900', color: 'white', marginBottom: 22, textAlign: 'center', maxWidth: 750 },
  finalCtaSubtitle: { fontFamily: SYSTEM_FONT, fontSize: 18, color: 'rgba(255,255,255,0.85)', marginBottom: 42, textAlign: 'center', maxWidth: 650, lineHeight: 29 },
  finalCtaBtn: { backgroundColor: CTA_TEAL, paddingHorizontal: 50, paddingVertical: 22, borderRadius: 100, marginBottom: 28 },
  finalCtaBtnText: { fontFamily: SYSTEM_FONT, fontSize: 17, fontWeight: '700', color: 'white' },
  finalCtaFeatures: { flexDirection: 'row', gap: 28, flexWrap: 'wrap', justifyContent: 'center' },
  finalCtaFeature: { fontFamily: SYSTEM_FONT, fontSize: 14, color: 'rgba(255,255,255,0.75)' },
});