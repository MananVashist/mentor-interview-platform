// app/how-it-works.tsx
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

export default function HowItWorks() {
  const router = useRouter();

  // Schema.org Structured Data
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Book a Mock Interview on CrackJobs",
    "description": "Book a 1:1 mock interview with expert mentors from top tech companies in 4 simple steps.",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Browse Expert Mentors",
        "text": "Filter mentors by role, company, and expertise level.",
        "position": 1
      },
      {
        "@type": "HowToStep",
        "name": "Book Your Session",
        "text": "Choose a time slot and pay securely.",
        "position": 2
      },
      {
        "@type": "HowToStep",
        "name": "Practice Interview",
        "text": "Join the 55-minute video session.",
        "position": 3
      },
      {
        "@type": "HowToStep",
        "name": "Get Feedback",
        "text": "Receive detailed evaluation within 48 hours.",
        "position": 4
      }
    ]
  };

  return (
    <>
      <Head>
        <title>How It Works - CrackJobs Mock Interview Process</title>
        <meta name="description" content="Learn how CrackJobs works: Browse expert mentors, book sessions, practice realistic interviews, and receive detailed feedback within 48 hours." />
        <meta name="keywords" content="how it works, mock interview process, booking process, interview preparation steps" />
        <link rel="canonical" href="https://crackjobs.com/how-it-works" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://crackjobs.com/how-it-works" />
        <meta property="og:title" content="How It Works - CrackJobs Mock Interview Process" />
        <meta property="og:description" content="Learn how CrackJobs works: Browse expert mentors, book sessions, practice realistic interviews, and receive detailed feedback." />
        <meta property="og:image" content="https://crackjobs.com/og-image.png" />
        
        <script type="application/ld+json">
          {JSON.stringify(howToSchema)}
        </script>

        <style type="text/css">{`
          * { box-sizing: border-box; }
          html, body { margin: 0; padding: 0; height: 100%; }
          body { font-family: ${SYSTEM_FONT}; -webkit-font-smoothing: antialiased; }
        `}</style>
      </Head>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <Header />

        {/* Hero */}
        <View style={styles.sectionContainer}>
          <View style={styles.heroCentered}>
            <View style={styles.heroTextContainer}>
              <View style={styles.pillBadge}>
                <Text style={styles.pillText}>📚 THE PROCESS</Text>
              </View>
              <Text style={styles.heroTitle}>
                <Text style={{ color: BRAND_ORANGE }}>Simulate real world interviews </Text>
                <Text style={{ color: CTA_TEAL }}>with expert interviewers</Text>
              </Text>
              <Text style={styles.heroSubtitle}>
                Four simple steps to realistic interview practice. Book a domain specific session (PM, DS, DA or HR) today
              </Text>
            </View>
          </View>
        </View>

        {/* 4 Main Steps */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionKicker}>THE JOURNEY</Text>
          <Text style={styles.sectionTitle}>
            Your path to interview confidence
          </Text>

          <View style={styles.stepsContainer}>
            {/* Step 1 */}
            <View style={styles.stepRow}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Sign Up & Filter Mentors</Text>
                <Text style={styles.stepDesc}>
                  Create your profile and browse our vetted mentor list filtered by domain (PM, DA, DS, HR), expertise level (Bronze/Silver/Gold), and specific interview round. See mentor backgrounds from top companies—all without revealing your identity.
                </Text>
                <View style={styles.stepFeatures}>
                  <Text style={styles.stepFeature}>• 100% anonymous interviews- No personal info shared</Text>
                  <Text style={styles.stepFeature}>• Filter by 4 domains, choose a round to practice from a list of 5 rounds under each domain. Eg. Execution and analytics under product management </Text>
                  <Text style={styles.stepFeature}>• See mentor yrs of experience, ratings, no of sessions, about me section and assigned tier</Text>
                </View>
              </View>
            </View>

            {/* Step 2 */}
            <View style={styles.stepRow}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Book Your Session</Text>
                <Text style={styles.stepDesc}>
                  Select a convenient time slot from your chosen mentor's calendar. Pay securely via Razorpay (credit/debit cards, UPI, net banking). Funds are held in escrow until session completion to ensure quality. Receive instant confirmation with calendar invite and meeting link.
                </Text>
                <View style={styles.stepFeatures}>
                  <Text style={styles.stepFeature}>• Flexible scheduling</Text>
                  <Text style={styles.stepFeature}>• Secure payment with escrow protection</Text>
                </View>
              </View>
            </View>

            {/* Step 3 */}
            <View style={styles.stepRow}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Practice Realistic Interview</Text>
                <Text style={styles.stepDesc}>
                  Join a 55-minute video session. Your mentor conducts a real interview simulation: 45 minutes of actual interviewing (case study, SQL queries, product questions—whatever round you chose) plus 10 minutes of live verbal feedback. Experience authentic pressure, timing, and evaluation criteria.
                </Text>
                <View style={styles.stepFeatures}>
                  <Text style={styles.stepFeature}>• 55-min structured session</Text>
                  <Text style={styles.stepFeature}>• Real interview conditions & pressure</Text>
                  <Text style={styles.stepFeature}>• Camera can be turned off if required</Text>
                  <Text style={styles.stepFeature}>• Recording shared with both parties</Text>
                </View>
              </View>
            </View>

            {/* Step 4 */}
            <View style={styles.stepRow}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>4</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Receive Detailed Feedback</Text>
                <Text style={styles.stepDesc}>
                  Within 48 hours, get comprehensive written evaluation covering: specific strengths, concrete improvement areas, framework usage, communication style, domain knowledge gaps, and actionable next steps. Access your session recording to review your performance and track progress across multiple sessions.
                </Text>
                <View style={styles.stepFeatures}>
                  <Text style={styles.stepFeature}>• Detailed written evaluation (48 hrs)</Text>
                  <Text style={styles.stepFeature}>• Specific, actionable improvement areas</Text>
                  <Text style={styles.stepFeature}>• Session recording access</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Session Timeline */}
        <View style={[styles.sectionContainer, { backgroundColor: '#fff' }]}>
          <Text style={styles.sectionKicker}>INSIDE A SESSION</Text>
          <Text style={styles.sectionTitle}>
            What happens in your 55 minutes
          </Text>

          <View style={styles.timelineContainer}>
            <View style={styles.timelineItem}>
              <View style={styles.timelineDot} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTime}>Minutes 0-5</Text>
                <Text style={styles.timelineTitle}>Warm-Up & Context</Text>
                <Text style={styles.timelineDesc}>
                  Brief intro, confirm the interview round, and set expectations. No small talk—straight to business like a real interview.
                </Text>
              </View>
            </View>

            <View style={styles.timelineItem}>
              <View style={styles.timelineDot} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTime}>Minutes 5-50</Text>
                <Text style={styles.timelineTitle}>Actual Interview Simulation</Text>
                <Text style={styles.timelineDesc}>
                  Full interview round—product case, SQL problem, ML system design, or whatever you booked. Mentor evaluates like a real hiring manager: asks followups, pushes on weak points, times your responses.
                </Text>
              </View>
            </View>

            <View style={styles.timelineItem}>
              <View style={styles.timelineDot} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTime}>Minutes 50-55</Text>
                <Text style={styles.timelineTitle}>Live Feedback & Q&A</Text>
                <Text style={styles.timelineDesc}>
                  Immediate verbal feedback on what went well and what didn't. Ask questions about the interview process, clarify doubts, get advice on your approach.
                </Text>
              </View>
            </View>

            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, { backgroundColor: BRAND_ORANGE }]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTime}>Next 48 Hours</Text>
                <Text style={styles.timelineTitle}>Written Evaluation Delivery</Text>
                <Text style={styles.timelineDesc}>
                  Comprehensive document detailing your performance across multiple dimensions, specific improvement actions, and framework recommendations.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* What Makes It Effective */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionKicker}>WHY IT WORKS</Text>
          <Text style={styles.sectionTitle}>
            Practice designed by interviewers
          </Text>

          <View style={styles.effectiveGrid}>
            <View style={styles.effectiveCard}>
              <Text style={styles.effectiveEmoji}>🎯</Text>
              <Text style={styles.effectiveTitle}>Real Interview Pressure</Text>
              <Text style={styles.effectiveDesc}>
                Not a friendly chat. Mentors evaluate you exactly like they would a real candidate—timing you, pushing back on answers, and scoring your responses.
              </Text>
            </View>

            <View style={styles.effectiveCard}>
              <Text style={styles.effectiveEmoji}>✅</Text>
              <Text style={styles.effectiveTitle}>Expert Evaluators</Text>
              <Text style={styles.effectiveDesc}>
                Your mentor actively conducts 10-20 real interviews per year at their company. They know what works and what doesn't—not theoretical advice.
              </Text>
            </View>

            <View style={styles.effectiveCard}>
              <Text style={styles.effectiveEmoji}>📊</Text>
              <Text style={styles.effectiveTitle}>Structured Feedback</Text>
              <Text style={styles.effectiveDesc}>
                Not "you did good." Specific scores, framework gaps, communication patterns, and concrete next steps based on standardized evaluation criteria.
              </Text>
            </View>

            <View style={styles.effectiveCard}>
              <Text style={styles.effectiveEmoji}>🔁</Text>
              <Text style={styles.effectiveTitle}>Iterative Improvement</Text>
              <Text style={styles.effectiveDesc}>
                Session recordings let you spot patterns. Compare session 1 vs session 3 to see tangible improvement in your approach and delivery.
              </Text>
            </View>
          </View>
        </View>

        {/* Pricing Quick Reference */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionKicker}>INVESTMENT</Text>
          <Text style={styles.sectionTitle}>
            Transparent pricing, no subscriptions
          </Text>
          <Text style={styles.pricingSubtitle}>
            Pay per session. No monthly fees, no contracts. Choose your mentor tier based on your career stage.
          </Text>

          <View style={styles.pricingGrid}>
            <View style={styles.pricingCard}>
              <Text style={styles.pricingTier}>🥉 BRONZE</Text>
              <Text style={styles.pricingRange}>₹3,571 - ₹5,952</Text>
              <Text style={styles.pricingExp}>5-10 years experience</Text>
              <Text style={styles.pricingIdeal}>Ideal for: Mid-level role prep</Text>
            </View>

            <View style={[styles.pricingCard, styles.pricingCardPopular]}>
              <View style={styles.popularTag}>
                <Text style={styles.popularTagText}>MOST POPULAR</Text>
              </View>
              <Text style={styles.pricingTier}>🥈 SILVER</Text>
              <Text style={styles.pricingRange}>₹6,000 - ₹10,000</Text>
              <Text style={styles.pricingExp}>10-15 years experience</Text>
              <Text style={styles.pricingIdeal}>Ideal for: Senior roles, career switches</Text>
            </View>

            <View style={styles.pricingCard}>
              <Text style={styles.pricingTier}>🥇 GOLD</Text>
              <Text style={styles.pricingRange}>₹10,000 - ₹15,000</Text>
              <Text style={styles.pricingExp}>15+ years experience</Text>
              <Text style={styles.pricingIdeal}>Ideal for: Leadership positions</Text>
            </View>
          </View>

         
        </View>

        {/* Tips for Success */}
        <View style={[styles.sectionContainer, { backgroundColor: '#fff' }]}>
          <Text style={styles.sectionKicker}>MAXIMIZE YOUR PREP</Text>
          <Text style={styles.sectionTitle}>
            Get the most from each session
          </Text>

          <View style={styles.tipsGrid}>
            <View style={styles.tipCard}>
              <Text style={styles.tipEmoji}>📝</Text>
              <Text style={styles.tipTitle}>Come Prepared</Text>
              <Text style={styles.tipDesc}>
                Treat it like a real interview. Review frameworks, have your resume ready, test your setup beforehand.
              </Text>
            </View>

            <View style={styles.tipCard}>
              <Text style={styles.tipEmoji}>🎥</Text>
              <Text style={styles.tipTitle}>Save the Recording</Text>
              <Text style={styles.tipDesc}>
                The recording will be shared on the platform. Review your delivery, spot filler words, analyze your thinking process.
              </Text>
            </View>

            <View style={styles.tipCard}>
              <Text style={styles.tipEmoji}>📊</Text>
              <Text style={styles.tipTitle}>Act on Feedback</Text>
              <Text style={styles.tipDesc}>
                Don't just read it. Create an action plan from the written evaluation and work on specific gaps.
              </Text>
            </View>
          </View>
        </View>

        {/* Quick FAQ */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionKicker}>COMMON QUESTIONS</Text>
          <Text style={styles.sectionTitle}>
            Quick answers
          </Text>

          <View style={styles.faqList}>
            <View style={styles.faqItem}>
              <Text style={styles.faqQ}>How long until my first session?</Text>
              <Text style={styles.faqA}>
                Most mentors have availability within 24-72 hours. Book early for weekend slots.
              </Text>
            </View>

            <View style={styles.faqItem}>
              <Text style={styles.faqQ}>Can I cancel or reschedule?</Text>
              <Text style={styles.faqA}>
                Reschedule is allowed till you and the mentor agree on a time. No cancellation except for no-shows.
              </Text>
            </View>

            <View style={styles.faqItem}>
              <Text style={styles.faqQ}>Is it really anonymous?</Text>
              <Text style={styles.faqA}>
                Yes. No names, emails, or personal identifiers. You both see only each other's professional title of your choosing. Other details (video on/off, resume) are optional.
              </Text>
            </View>

            <View style={styles.faqItem}>
              <Text style={styles.faqQ}>What if I'm not satisfied?</Text>
              <Text style={styles.faqA}>
                Contact us within 24 hours at crackjobshelpdesk@gmail.com. We review each case and may offer partial refunds or session credits.
              </Text>
            </View>
          </View>
        </View>

        {/* CTA */}
        <View style={styles.sectionContainer}>
          <View style={styles.ctaBox}>
            <Text style={styles.ctaTitle}>Ready to start practicing?</Text>
            <Text style={styles.ctaSubtitle}>
              Browse expert mentors, book your session, and get interview-ready in days, not months.
            </Text>
            <View style={styles.ctaButtons}>
              <Button
                title="Browse Mentors"
                onPress={() => router.push('/auth/sign-up')}
                variant="primary"
                style={styles.ctaButton}
              />
              <Button
                title="Learn More About Us"
                onPress={() => router.push('/about')}
                variant="outline"
                style={styles.ctaButton}
              />
            </View>
            <View style={styles.ctaFeatures}>
              <Text style={styles.ctaFeature}>🔒 100% Anonymous</Text>
              <Text style={styles.ctaFeature}>⚡ Book within 24 hours</Text>
              <Text style={styles.ctaFeature}>💳 No subscription needed</Text>
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
    marginBottom: 60,
    maxWidth: 800,
    alignSelf: 'center',
  },
  stepsContainer: {
    maxWidth: 900,
    alignSelf: 'center',
    gap: 48,
  },
  stepRow: {
    flexDirection: 'row',
    gap: 32,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: CTA_TEAL,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepNumberText: {
    fontFamily: SYSTEM_FONT,
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontFamily: SYSTEM_FONT,
    fontSize: 26,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 12,
  },
  stepDesc: {
    fontFamily: SYSTEM_FONT,
    fontSize: 17,
    color: TEXT_GRAY,
    lineHeight: 28,
    marginBottom: 16,
  },
  stepFeatures: {
    gap: 8,
  },
  stepFeature: {
    fontFamily: SYSTEM_FONT,
    fontSize: 15,
    color: TEXT_DARK,
    lineHeight: 22,
  },
  timelineContainer: {
    maxWidth: 800,
    alignSelf: 'center',
    marginTop: 40,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 40,
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: CTA_TEAL,
    marginTop: 6,
    flexShrink: 0,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTime: {
    fontFamily: SYSTEM_FONT,
    fontSize: 14,
    fontWeight: '700',
    color: CTA_TEAL,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timelineTitle: {
    fontFamily: SYSTEM_FONT,
    fontSize: 20,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 8,
  },
  timelineDesc: {
    fontFamily: SYSTEM_FONT,
    fontSize: 16,
    color: TEXT_GRAY,
    lineHeight: 26,
  },
  effectiveGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    maxWidth: 1100,
    alignSelf: 'center',
    marginTop: 40,
  },
  effectiveCard: {
    width: 'calc(50% - 12px)',
    minWidth: 300,
    backgroundColor: '#ffffff',
    padding: 32,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  effectiveEmoji: {
    fontSize: 40,
    marginBottom: 16,
  },
  effectiveTitle: {
    fontFamily: SYSTEM_FONT,
    fontSize: 20,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 12,
  },
  effectiveDesc: {
    fontFamily: SYSTEM_FONT,
    fontSize: 15,
    color: TEXT_GRAY,
    lineHeight: 24,
  },
  pricingSubtitle: {
    fontFamily: SYSTEM_FONT,
    fontSize: 18,
    color: TEXT_GRAY,
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 40,
    maxWidth: 700,
    alignSelf: 'center',
  },
  pricingGrid: {
    flexDirection: 'row',
    gap: 24,
    maxWidth: 1100,
    alignSelf: 'center',
    marginTop: 40,
  },
  pricingCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 32,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    position: 'relative',
  },
  pricingCardPopular: {
    borderWidth: 2,
    borderColor: BRAND_ORANGE,
    transform: [{ scale: 1.05 }],
  },
  popularTag: {
    position: 'absolute',
    top: -12,
    left: '50%',
    transform: [{ translateX: -50 }],
    backgroundColor: BRAND_ORANGE,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 100,
  },
  popularTagText: {
    fontFamily: SYSTEM_FONT,
    fontSize: 10,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
  },
  pricingTier: {
    fontFamily: SYSTEM_FONT,
    fontSize: 14,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 8,
  },
  pricingRange: {
    fontFamily: SYSTEM_FONT,
    fontSize: 24,
    fontWeight: '800',
    color: CTA_TEAL,
    marginBottom: 8,
  },
  pricingExp: {
    fontFamily: SYSTEM_FONT,
    fontSize: 14,
    color: TEXT_GRAY,
    marginBottom: 4,
  },
  pricingIdeal: {
    fontFamily: SYSTEM_FONT,
    fontSize: 14,
    color: TEXT_GRAY,
  },
  pricingNote: {
    maxWidth: 800,
    alignSelf: 'center',
    backgroundColor: '#FEF3C7',
    padding: 24,
    borderRadius: 12,
    marginTop: 40,
  },
  pricingNoteText: {
    fontFamily: SYSTEM_FONT,
    fontSize: 16,
    color: '#92400E',
    lineHeight: 26,
    textAlign: 'center',
  },
  tipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    maxWidth: 1100,
    alignSelf: 'center',
    marginTop: 40,
  },
  tipCard: {
    width: 'calc(50% - 12px)',
    minWidth: 300,
    backgroundColor: BG_CREAM,
    padding: 28,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  tipEmoji: {
    fontSize: 40,
    marginBottom: 16,
  },
  tipTitle: {
    fontFamily: SYSTEM_FONT,
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 12,
    textAlign: 'center',
  },
  tipDesc: {
    fontFamily: SYSTEM_FONT,
    fontSize: 15,
    color: TEXT_GRAY,
    lineHeight: 24,
    textAlign: 'center',
  },
  faqList: {
    maxWidth: 800,
    alignSelf: 'center',
    gap: 20,
    marginTop: 40,
  },
  faqItem: {
    backgroundColor: '#ffffff',
    padding: 28,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  faqQ: {
    fontFamily: SYSTEM_FONT,
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 10,
  },
  faqA: {
    fontFamily: SYSTEM_FONT,
    fontSize: 16,
    color: TEXT_GRAY,
    lineHeight: 26,
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
    marginBottom: 24,
  },
  ctaButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  ctaFeatures: {
    flexDirection: 'row',
    gap: 24,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  ctaFeature: {
    fontFamily: SYSTEM_FONT,
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
  },
});