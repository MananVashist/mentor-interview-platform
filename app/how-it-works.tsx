// app/how-it-works.tsx
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
const SearchIcon = ({ size = 48, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Search">
    <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth="2" />
    <Path d="M21 21l-4.35-4.35" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const CalendarIcon = ({ size = 48, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Calendar">
    <Path d="M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M16 2v4M8 2v4M3 10h18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const VideoIcon = ({ size = 48, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Video">
    <Path d="M23 7l-7 5 7 5V7z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M14 5H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const FileIcon = ({ size = 48, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Feedback">
    <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CheckIcon = ({ size = 18, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Check">
    <Circle cx="12" cy="12" r="10" fill={color} />
    <Path d="M7 12l3.5 3.5 6.5-7" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
  </Svg>
);

const ClockIcon = ({ size = 32, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Clock">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <Path d="M12 6v6l4 2" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const MessageIcon = ({ size = 32, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Message">
    <Path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const TrendIcon = ({ size = 32, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Growth">
    <Path d="M23 6l-9.5 9.5-5-5L1 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M17 6h6v6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default function HowItWorks() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isSmall = width < 900;

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
        "text": "Filter mentors by role (PM, Data, HR), company, and expertise.",
        "url": "https://crackjobs.com/auth/sign-up",
        "position": 1
      },
      {
        "@type": "HowToStep",
        "name": "Book Your Session",
        "text": "Choose a convenient time slot and pay securely via Razorpay.",
        "url": "https://crackjobs.com/auth/sign-up",
        "position": 2
      },
      {
        "@type": "HowToStep",
        "name": "Practice Interview",
        "text": "Join the 55-minute video call for a realistic interview simulation.",
        "position": 3
      },
      {
        "@type": "HowToStep",
        "name": "Get Detailed Evaluation",
        "text": "Receive comprehensive written feedback within 48 hours.",
        "position": 4
      }
    ]
  };

  return (
    <>
      <Head>
        <title>How It Works | Book Mock Interviews in 4 Simple Steps - CrackJobs</title>
        <meta name="description" content="Learn how CrackJobs works: Browse expert mentors from Google, Amazon, Meta → Book a session → Practice 55-min interview → Get detailed feedback. Start preparing for your dream job in 4 simple steps." />
        <meta name="keywords" content="how it works, mock interview process, interview booking, book mock interview, interview feedback, anonymous interview, practice interview" />
        <link rel="canonical" href="https://crackjobs.com/how-it-works" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://crackjobs.com/how-it-works" />
        <meta property="og:title" content="How It Works | Book Mock Interviews in 4 Simple Steps - CrackJobs" />
        <meta property="og:description" content="Learn how CrackJobs works: Browse expert mentors → Book a session → Practice interview → Get feedback. Start in 4 simple steps." />
        <meta property="og:image" content="https://crackjobs.com/og-image.png" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://crackjobs.com/how-it-works" />
        <meta property="twitter:title" content="How It Works | Book Mock Interviews in 4 Simple Steps - CrackJobs" />
        <meta property="twitter:description" content="Browse mentors → Book session → Practice interview → Get feedback. Start preparing in 4 simple steps." />
        <meta property="twitter:image" content="https://crackjobs.com/og-image.png" />

        {/* JSON-LD Schema */}
        <script type="application/ld+json">
          {JSON.stringify(howToSchema)}
        </script>
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
            <View style={styles.badge}><Text style={styles.badgeText}>HOW IT WORKS</Text></View>
            <Text style={[styles.heroTitle, isSmall && styles.heroTitleMobile]}>
              From Sign-Up to Success in 4 Simple Steps
            </Text>
            <Text style={[styles.heroSubtitle, isSmall && styles.heroSubtitleMobile]}>
              CrackJobs makes interview preparation effortless. Browse expert mentors, book a session, practice with real-world simulations, and get actionable feedback—all in a completely anonymous environment.
            </Text>
          </View>

          {/* 4 Main Steps */}
          <View style={[styles.section, { backgroundColor: 'white' }]}>
            <Text style={styles.sectionLabel}>THE PROCESS</Text>
            <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}>Your Journey to Interview Success</Text>
            <View style={styles.stepsGrid}>
              <View style={styles.stepCard}>
                <View style={styles.stepNum}><Text style={styles.stepNumText}>1</Text></View>
                <View style={styles.stepIcon}>
                  <SearchIcon size={40} color={CTA_TEAL} />
                </View>
                <Text style={styles.stepTitle}>Browse Expert Mentors</Text>
                <Text style={styles.stepDesc}>Filter by role (Product Management, Data Analytics, Data Science, HR), company (Google, Amazon, Meta, Flipkart), and specific topics you want to practice. View detailed mentor profiles including their current role, years of experience, interview expertise, and ratings from past candidates.</Text>
                <View style={styles.stepDetails}>
                  <View style={styles.detailItem}>
                    <CheckIcon size={14} color={CTA_TEAL} />
                    <Text style={styles.detailText}>50+ verified mentors from top companies</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <CheckIcon size={14} color={CTA_TEAL} />
                    <Text style={styles.detailText}>Filter by expertise, company, and topic</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <CheckIcon size={14} color={CTA_TEAL} />
                    <Text style={styles.detailText}>View ratings and success stories</Text>
                  </View>
                </View>
              </View>

              <View style={styles.stepCard}>
                <View style={styles.stepNum}><Text style={styles.stepNumText}>2</Text></View>
                <View style={styles.stepIcon}>
                  <CalendarIcon size={40} color={CTA_TEAL} />
                </View>
                <Text style={styles.stepTitle}>Book Your Session</Text>
                <Text style={styles.stepDesc}>Choose a convenient time slot from the mentor's calendar. Sessions are available 24/7 to fit your schedule. Pay securely using Razorpay (UPI, cards, net banking). Pricing ranges from ₹999-₹2,499 per session depending on mentor tier and topic complexity.</Text>
                <View style={styles.stepDetails}>
                  <View style={styles.detailItem}>
                    <CheckIcon size={14} color={CTA_TEAL} />
                    <Text style={styles.detailText}>Instant confirmation after booking</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <CheckIcon size={14} color={CTA_TEAL} />
                    <Text style={styles.detailText}>Secure payment (UPI, cards, wallets)</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <CheckIcon size={14} color={CTA_TEAL} />
                    <Text style={styles.detailText}>Free reschedule up to 24 hours before</Text>
                  </View>
                </View>
              </View>

              <View style={styles.stepCard}>
                <View style={styles.stepNum}><Text style={styles.stepNumText}>3</Text></View>
                <View style={styles.stepIcon}>
                  <VideoIcon size={40} color={CTA_TEAL} />
                </View>
                <Text style={styles.stepTitle}>Practice 55-Min Interview</Text>
                <Text style={styles.stepDesc}>Join the video call 5 minutes before your scheduled time. Your mentor conducts a realistic interview simulation tailored to your target role and company. Practice under real interview conditions with problem-solving, case studies, or behavioral questions. Completely anonymous—no names or personal details visible.</Text>
                <View style={styles.stepDetails}>
                  <View style={styles.detailItem}>
                    <CheckIcon size={14} color={CTA_TEAL} />
                    <Text style={styles.detailText}>45 mins interview + 10 mins live feedback</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <CheckIcon size={14} color={CTA_TEAL} />
                    <Text style={styles.detailText}>100% anonymous (no personal info shared)</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <CheckIcon size={14} color={CTA_TEAL} />
                    <Text style={styles.detailText}>Real interview conditions and pressure</Text>
                  </View>
                </View>
              </View>

              <View style={styles.stepCard}>
                <View style={styles.stepNum}><Text style={styles.stepNumText}>4</Text></View>
                <View style={styles.stepIcon}>
                  <FileIcon size={40} color={CTA_TEAL} />
                </View>
                <Text style={styles.stepTitle}>Get Detailed Evaluation</Text>
                <Text style={styles.stepDesc}>Receive comprehensive written feedback within 48 hours. Your evaluation covers technical skills, communication clarity, problem-solving approach, and culture fit. Get specific recommendations on what to improve, resources to study, and common mistakes to avoid in your next interview.</Text>
                <View style={styles.stepDetails}>
                  <View style={styles.detailItem}>
                    <CheckIcon size={14} color={CTA_TEAL} />
                    <Text style={styles.detailText}>Structured feedback across 5-8 criteria</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <CheckIcon size={14} color={CTA_TEAL} />
                    <Text style={styles.detailText}>Actionable improvement recommendations</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <CheckIcon size={14} color={CTA_TEAL} />
                    <Text style={styles.detailText}>Track progress over multiple sessions</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* What to Expect */}
          <View style={[styles.section, { backgroundColor: BG_CREAM }]}>
            <Text style={styles.sectionLabel}>SESSION BREAKDOWN</Text>
            <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}>What Happens During Your 55-Minute Session</Text>
            <View style={styles.timelineGrid}>
              <View style={styles.timelineCard}>
                <View style={styles.timelineIcon}>
                  <ClockIcon size={28} color={CTA_TEAL} />
                </View>
                <Text style={styles.timelineTime}>Minutes 1-5: Introduction & Setup</Text>
                <Text style={styles.timelineDesc}>Brief introduction (still anonymous). Mentor confirms the role you're interviewing for and the specific topics to cover. Technical check to ensure video/audio quality.</Text>
              </View>
              <View style={styles.timelineCard}>
                <View style={styles.timelineIcon}>
                  <MessageIcon size={28} color={CTA_TEAL} />
                </View>
                <Text style={styles.timelineTime}>Minutes 6-45: Interview Simulation</Text>
                <Text style={styles.timelineDesc}>Realistic interview based on your target role. Product Management: product sense cases, prioritization, strategy. Data Analytics: SQL problems, dashboard design, business metrics. Data Science: ML algorithms, case studies, coding. HR: behavioral questions, STAR method, conflict resolution.</Text>
              </View>
              <View style={styles.timelineCard}>
                <View style={styles.timelineIcon}>
                  <TrendIcon size={28} color={CTA_TEAL} />
                </View>
                <Text style={styles.timelineTime}>Minutes 46-55: Live Feedback & Q&A</Text>
                <Text style={styles.timelineDesc}>Mentor shares immediate observations on your performance. Discusses specific areas where you excelled and where you can improve. Open Q&A—ask about interview strategies, company culture, or clarifications on your approach.</Text>
              </View>
            </View>
          </View>

          {/* Why This Works */}
          <View style={[styles.section, { backgroundColor: 'white' }]}>
            <Text style={styles.sectionLabel}>WHY THIS WORKS</Text>
            <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}>The Science Behind Effective Interview Prep</Text>
            <View style={styles.whyWorksGrid}>
              <View style={styles.whyCard}>
                <Text style={styles.whyTitle}>🎯 Real Interview Conditions</Text>
                <Text style={styles.whyDesc}>Our mentors simulate actual company interview environments, not theoretical scenarios. You experience the same pressure, time constraints, and evaluation criteria used at Google, Amazon, and Meta. This builds authentic confidence that transfers directly to your real interviews.</Text>
              </View>
              <View style={styles.whyCard}>
                <Text style={styles.whyTitle}>💬 Immediate, Specific Feedback</Text>
                <Text style={styles.whyDesc}>Unlike watching YouTube videos or reading books, you get personalized feedback on YOUR performance, YOUR answers, and YOUR approach. Mentors identify blind spots you'd never notice on your own—like unclear communication, jumping to solutions too quickly, or missing key frameworks.</Text>
              </View>
              <View style={styles.whyCard}>
                <Text style={styles.whyTitle}>🔄 Iterative Improvement</Text>
                <Text style={styles.whyDesc}>Each session builds on the last. Track your progress across multiple practice sessions. Address weak areas systematically. Build muscle memory for common question types. Most candidates see significant improvement after just 2-3 sessions.</Text>
              </View>
              <View style={styles.whyCard}>
                <Text style={styles.whyTitle}>🔒 Safe Learning Environment</Text>
                <Text style={styles.whyDesc}>Complete anonymity means you can fail safely. Make mistakes, ask "dumb" questions, and practice unconventional approaches without risking your professional reputation. This psychological safety accelerates learning faster than high-stakes practice.</Text>
              </View>
            </View>
          </View>

          {/* Success Tips */}
          <View style={[styles.section, { backgroundColor: '#f0f8ff' }]}>
            <Text style={styles.sectionLabel}>PRO TIPS</Text>
            <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}>How to Get Maximum Value From Your Sessions</Text>
            <View style={styles.tipsContent}>
              <View style={styles.tipCard}>
                <Text style={styles.tipEmoji}>🎯</Text>
                <Text style={styles.tipTitle}>Treat it like a real interview</Text>
                <Text style={styles.tipDesc}>Dress professionally (even though it's online). Prepare your environment—quiet room, good lighting, stable internet. Research the company and role you're targeting. This mental preparation makes the practice more effective.</Text>
              </View>
              <View style={styles.tipCard}>
                <Text style={styles.tipEmoji}>💬</Text>
                <Text style={styles.tipTitle}>Think out loud</Text>
                <Text style={styles.tipDesc}>Verbalize your thought process during problem-solving. Say "I'm thinking about X approach because Y" rather than working silently. This helps mentors understand your reasoning and give better feedback on your approach, not just your final answer.</Text>
              </View>
              <View style={styles.tipCard}>
                <Text style={styles.tipEmoji}>📝</Text>
                <Text style={styles.tipTitle}>Take notes immediately</Text>
                <Text style={styles.tipDesc}>Keep a notebook handy during the session. Write down key feedback points while they're fresh. Capture specific phrases or frameworks the mentor recommends. Review these notes before your next practice session or real interview.</Text>
              </View>
              <View style={styles.tipCard}>
                <Text style={styles.tipEmoji}>🔄</Text>
                <Text style={styles.tipTitle}>Book multiple sessions</Text>
                <Text style={styles.tipDesc}>One session identifies problems. Multiple sessions build skills. Space them 3-5 days apart to allow time for focused practice in between. Track improvement by practicing the same question type with different mentors.</Text>
              </View>
              <View style={styles.tipCard}>
                <Text style={styles.tipEmoji}>❓</Text>
                <Text style={styles.tipTitle}>Ask strategic questions</Text>
                <Text style={styles.tipDesc}>Use the Q&A time wisely. Ask about company-specific interview processes, how to recover from mistakes, or red flags they've seen in other candidates. These insider insights are invaluable and not available in books or courses.</Text>
              </View>
              <View style={styles.tipCard}>
                <Text style={styles.tipEmoji}>📊</Text>
                <Text style={styles.tipTitle}>Focus on patterns, not memorization</Text>
                <Text style={styles.tipDesc}>Don't try to memorize answers to specific questions. Instead, learn the frameworks and patterns that apply to many questions. Mentors can spot memorized answers—focus on building genuine problem-solving skills.</Text>
              </View>
            </View>
          </View>

          {/* Pricing & Booking */}
          <View style={[styles.section, { backgroundColor: 'white' }]}>
            <Text style={styles.sectionLabel}>PRICING & BOOKING</Text>
            <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}>Transparent, Affordable Pricing</Text>
            <View style={styles.pricingContent}>
              <Text style={styles.bodyText}>
                Sessions are priced based on mentor tier and topic complexity. No hidden fees, no subscription required—pay only for the sessions you need.
              </Text>
              <View style={styles.pricingGrid}>
                <View style={styles.pricingCard}>
                  <Text style={styles.pricingTier}>Bronze Tier</Text>
                  <Text style={styles.pricingPrice}>₹999-₹1,499</Text>
                  <Text style={styles.pricingDesc}>New mentors (1-10 sessions completed)</Text>
                  <View style={styles.pricingFeatures}>
                    <View style={styles.featureItem}>
                      <CheckIcon size={14} color={CTA_TEAL} />
                      <Text style={styles.featureText}>Verified professionals</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <CheckIcon size={14} color={CTA_TEAL} />
                      <Text style={styles.featureText}>55-min session</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <CheckIcon size={14} color={CTA_TEAL} />
                      <Text style={styles.featureText}>Detailed feedback</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.pricingCard}>
                  <Text style={styles.pricingTier}>Silver Tier</Text>
                  <Text style={styles.pricingPrice}>₹1,499-₹1,999</Text>
                  <Text style={styles.pricingDesc}>Experienced mentors (11-30 sessions)</Text>
                  <View style={styles.pricingFeatures}>
                    <View style={styles.featureItem}>
                      <CheckIcon size={14} color={CTA_TEAL} />
                      <Text style={styles.featureText}>Proven track record</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <CheckIcon size={14} color={CTA_TEAL} />
                      <Text style={styles.featureText}>High ratings (4.5+)</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <CheckIcon size={14} color={CTA_TEAL} />
                      <Text style={styles.featureText}>Advanced topics</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.pricingCard}>
                  <Text style={styles.pricingTier}>Gold Tier</Text>
                  <Text style={styles.pricingPrice}>₹1,999-₹2,499</Text>
                  <Text style={styles.pricingDesc}>Top mentors (31+ sessions)</Text>
                  <View style={styles.pricingFeatures}>
                    <View style={styles.featureItem}>
                      <CheckIcon size={14} color={CTA_TEAL} />
                      <Text style={styles.featureText}>Elite professionals</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <CheckIcon size={14} color={CTA_TEAL} />
                      <Text style={styles.featureText}>4.8+ rating</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <CheckIcon size={14} color={CTA_TEAL} />
                      <Text style={styles.featureText}>Specialized expertise</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Common Questions */}
          <View style={[styles.section, { backgroundColor: BG_CREAM }]}>
            <Text style={styles.sectionLabel}>COMMON QUESTIONS</Text>
            <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}>Everything You Need to Know</Text>
            <View style={styles.faqContainer}>
              <View style={styles.faqCard}>
                <Text style={styles.faqQuestion}>How long are the sessions?</Text>
                <Text style={styles.faqAnswer}>All sessions are 55 minutes long. This includes 45 minutes of interview simulation and 10 minutes of live verbal feedback and Q&A. Written feedback is provided separately within 48 hours.</Text>
              </View>
              <View style={styles.faqCard}>
                <Text style={styles.faqQuestion}>Who are the mentors?</Text>
                <Text style={styles.faqAnswer}>Our mentors are verified professionals currently working at top companies (Google, Amazon, Meta, Flipkart, Microsoft). We verify their identity, current employment, and interview expertise. They're not professional coaches—they're active professionals who conduct real interviews at their companies.</Text>
              </View>
              <View style={styles.faqCard}>
                <Text style={styles.faqQuestion}>Is it really anonymous?</Text>
                <Text style={styles.faqAnswer}>Yes, 100% anonymous. No names, emails, or personal details are visible between you and your mentor. You see their professional title and company, they see your target role. This creates a safe environment to practice without fear of judgment affecting your real job search.</Text>
              </View>
              <View style={styles.faqCard}>
                <Text style={styles.faqQuestion}>Can I reschedule or cancel?</Text>
                <Text style={styles.faqAnswer}>Yes. Free reschedule up to 24 hours before your session (requires mentor acceptance). Cancellations within 24 hours or no-shows forfeit the session fee. This policy ensures mentors' time is respected while giving you flexibility.</Text>
              </View>
              <View style={styles.faqCard}>
                <Text style={styles.faqQuestion}>How many sessions do I need?</Text>
                <Text style={styles.faqAnswer}>Most candidates see significant improvement after 2-3 sessions. First session identifies major gaps, second session addresses those issues, third session builds confidence. More sessions help if you're targeting multiple roles or want deep expertise in specific areas.</Text>
              </View>
              <View style={styles.faqCard}>
                <Text style={styles.faqQuestion}>What if I'm not satisfied?</Text>
                <Text style={styles.faqAnswer}>We vet all mentors rigorously to ensure quality. If you're unsatisfied with your session, contact us within 24 hours at crackjobshelpdesk@gmail.com. We'll review the case and may offer a partial refund or credit for another session.</Text>
              </View>
            </View>
          </View>

          {/* Final CTA */}
          <View style={styles.finalCta}>
            <Text style={[styles.finalCtaTitle, isSmall && { fontSize: 34 }]}>Ready to Start Practicing?</Text>
            <Text style={[styles.finalCtaSubtitle, isSmall && { fontSize: 17 }]}>Join 300+ candidates who've improved their interview skills and landed offers at top companies through structured practice with industry experts.</Text>
            <TouchableOpacity style={styles.finalCtaBtn} onPress={() => router.push('/auth/sign-up')}>
              <Text style={styles.finalCtaBtnText}>Browse Mentors & Book Now →</Text>
            </TouchableOpacity>
            <View style={styles.finalCtaFeatures}>
              <Text style={styles.finalCtaFeature}>🔒 100% Anonymous</Text>
              <Text style={styles.finalCtaFeature}>⚡ Start in 24 hours</Text>
              <Text style={styles.finalCtaFeature}>💳 No subscription</Text>
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
  stepsGrid: { maxWidth: 1200, alignSelf: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: 32, justifyContent: 'center' },
  stepCard: { flex: 1, minWidth: 280, maxWidth: 550, backgroundColor: BG_CREAM, padding: 36, borderRadius: 18, borderWidth: 1, borderColor: '#e8e8e8' },
  stepNum: { width: 56, height: 56, borderRadius: 28, backgroundColor: CTA_TEAL, alignItems: 'center', justifyContent: 'center', marginBottom: 20, alignSelf: 'center' },
  stepNumText: { fontFamily: SYSTEM_FONT, fontSize: 26, fontWeight: '800', color: 'white' },
  stepIcon: { alignSelf: 'center', marginBottom: 16 },
  stepTitle: { fontFamily: SYSTEM_FONT, fontSize: 22, fontWeight: '700', color: TEXT_DARK, marginBottom: 14, textAlign: 'center' },
  stepDesc: { fontFamily: SYSTEM_FONT, fontSize: 16, color: TEXT_GRAY, lineHeight: 26, marginBottom: 20, textAlign: 'center' },
  stepDetails: { gap: 10 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  detailText: { fontFamily: SYSTEM_FONT, fontSize: 14, color: TEXT_DARK, flex: 1 },
  timelineGrid: { maxWidth: 1000, alignSelf: 'center', gap: 24 },
  timelineCard: { backgroundColor: 'white', padding: 32, borderRadius: 16, borderWidth: 1, borderColor: '#e8e8e8' },
  timelineIcon: { marginBottom: 14 },
  timelineTime: { fontFamily: SYSTEM_FONT, fontSize: 20, fontWeight: '700', color: TEXT_DARK, marginBottom: 12 },
  timelineDesc: { fontFamily: SYSTEM_FONT, fontSize: 16, color: TEXT_GRAY, lineHeight: 26 },
  whyWorksGrid: { maxWidth: 1100, alignSelf: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: 28, justifyContent: 'center' },
  whyCard: { flex: 1, minWidth: 280, maxWidth: 500, backgroundColor: BG_CREAM, padding: 32, borderRadius: 16, borderWidth: 1, borderColor: '#e8e8e8' },
  whyTitle: { fontFamily: SYSTEM_FONT, fontSize: 22, fontWeight: '700', color: TEXT_DARK, marginBottom: 14 },
  whyDesc: { fontFamily: SYSTEM_FONT, fontSize: 16, color: TEXT_GRAY, lineHeight: 26 },
  tipsContent: { maxWidth: 1100, alignSelf: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: 24, justifyContent: 'center' },
  tipCard: { flex: 1, minWidth: 280, maxWidth: 340, backgroundColor: 'white', padding: 28, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#e8e8e8' },
  tipEmoji: { fontSize: 40, marginBottom: 14 },
  tipTitle: { fontFamily: SYSTEM_FONT, fontSize: 18, fontWeight: '700', color: TEXT_DARK, marginBottom: 12, textAlign: 'center' },
  tipDesc: { fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_GRAY, lineHeight: 24, textAlign: 'center' },
  pricingContent: { maxWidth: 1100, alignSelf: 'center' },
  bodyText: { fontFamily: SYSTEM_FONT, fontSize: 17, color: TEXT_DARK, lineHeight: 29, marginBottom: 32, textAlign: 'center' },
  pricingGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 24, justifyContent: 'center' },
  pricingCard: { flex: 1, minWidth: 280, maxWidth: 340, backgroundColor: BG_CREAM, padding: 32, borderRadius: 16, borderWidth: 1, borderColor: '#e8e8e8' },
  pricingTier: { fontFamily: SYSTEM_FONT, fontSize: 14, fontWeight: '700', color: CTA_TEAL, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
  pricingPrice: { fontFamily: SYSTEM_FONT, fontSize: 32, fontWeight: '800', color: TEXT_DARK, marginBottom: 8 },
  pricingDesc: { fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_GRAY, marginBottom: 20, lineHeight: 22 },
  pricingFeatures: { gap: 10 },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  featureText: { fontFamily: SYSTEM_FONT, fontSize: 14, color: TEXT_DARK, flex: 1 },
  faqContainer: { maxWidth: 900, alignSelf: 'center', gap: 20 },
  faqCard: { backgroundColor: 'white', padding: 28, borderRadius: 16, borderWidth: 1, borderColor: '#e8e8e8' },
  faqQuestion: { fontFamily: SYSTEM_FONT, fontSize: 20, fontWeight: '700', color: TEXT_DARK, marginBottom: 12 },
  faqAnswer: { fontFamily: SYSTEM_FONT, fontSize: 16, color: TEXT_GRAY, lineHeight: 26 },
  finalCta: { backgroundColor: '#0f0f0f', paddingVertical: 80, paddingHorizontal: 24, alignItems: 'center' },
  finalCtaTitle: { fontFamily: SYSTEM_FONT, fontSize: 46, fontWeight: '900', color: 'white', marginBottom: 22, textAlign: 'center', maxWidth: 750 },
  finalCtaSubtitle: { fontFamily: SYSTEM_FONT, fontSize: 18, color: 'rgba(255,255,255,0.85)', marginBottom: 42, textAlign: 'center', maxWidth: 650, lineHeight: 29 },
  finalCtaBtn: { backgroundColor: CTA_TEAL, paddingHorizontal: 50, paddingVertical: 22, borderRadius: 100, marginBottom: 28 },
  finalCtaBtnText: { fontFamily: SYSTEM_FONT, fontSize: 17, fontWeight: '700', color: 'white' },
  finalCtaFeatures: { flexDirection: 'row', gap: 28, flexWrap: 'wrap', justifyContent: 'center' },
  finalCtaFeature: { fontFamily: SYSTEM_FONT, fontSize: 14, color: 'rgba(255,255,255,0.75)' },
});