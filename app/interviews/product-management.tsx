// app/interviews/product-management.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Head from 'expo-router/head';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';
import { BrandHeader } from '@/lib/BrandHeader';
import { Footer } from '@/components/Footer';
import { createBreadcrumbSchema, injectMultipleSchemas } from '@/lib/structured-data';

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

// SVG Icons - Comprehensive Set
const LightbulbIcon = ({ size = 48, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Product Sense">
    <Path d="M9 18h6M10 22h4M15 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M12 3v1M18.36 5.64l-.7.7M21 12h-1M18.36 18.36l-.7-.7M5.64 5.64l.7.7M3 12h1M5.64 18.36l.7-.7" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const RocketIcon = ({ size = 48, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Execution">
    <Path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CodeIcon = ({ size = 48, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Technical">
    <Path d="M16 18l6-6-6-6M8 6l-6 6 6 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CompassIcon = ({ size = 48, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Strategy">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <Path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CheckCircleIcon = ({ size = 20, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Check">
    <Circle cx="12" cy="12" r="10" fill={color} />
    <Path d="M7 12l3.5 3.5 6.5-7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const StarIcon = ({ size = 16, color = "#FFD700" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} accessibilityLabel="Star">
    <Path d="M12 2l2.4 7.4h7.8l-6.3 4.6 2.4 7.4L12 16.8l-6.3 4.6 2.4-7.4L1.8 9.4h7.8z" />
  </Svg>
);

const AlertIcon = ({ size = 28, color = BRAND_ORANGE }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Warning">
    <Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M12 8v4M12 16h.01" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const BookOpenIcon = ({ size = 28, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Book">
    <Path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const TargetIcon = ({ size = 32, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Target">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <Circle cx="12" cy="12" r="6" stroke={color} strokeWidth="2" />
    <Circle cx="12" cy="12" r="2" fill={color} />
  </Svg>
);

const TrendUpIcon = ({ size = 32, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Growth">
    <Path d="M23 6l-9.5 9.5-5-5L1 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M17 6h6v6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const UsersIcon = ({ size = 32, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Users">
    <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Circle cx="9" cy="7" r="4" stroke={color} strokeWidth="2" />
    <Path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const MapIcon = ({ size = 32, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Roadmap">
    <Path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M8 2v16M16 6v16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default function ProductManagementInterviews() {
  const router = useRouter();

  // 🔥 Structured Data for SEO
  useEffect(() => {
    if (Platform.OS === 'web') {
      const breadcrumbSchema = createBreadcrumbSchema([
        { name: 'Home', url: 'https://crackjobs.com' },
        { name: 'Interview Tracks', url: 'https://crackjobs.com/#interview-tracks' },
        { name: 'Product Management', url: 'https://crackjobs.com/interviews/product-management' }
      ]);

      const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is the CIRCLES framework for PM interviews?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "CIRCLES is a structured method for product design questions: Comprehend the situation, Identify the customer, Report customer needs, Cut through prioritization, List solutions, Evaluate tradeoffs, and Summarize recommendations."
            }
          },
          {
            "@type": "Question",
            "name": "How long should I prepare for a FAANG PM interview?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Most candidates need 6-8 weeks of focused preparation covering product sense, execution, technical understanding, and strategy. Practice with mock interviews is essential."
            }
          },
          {
            "@type": "Question",
            "name": "What frameworks do Google PMs use?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Google PMs commonly use CIRCLES for product design, AARM for metrics, RICE for prioritization, and structured approaches for execution and strategy questions."
            }
          }
        ]
      };

      const cleanup = injectMultipleSchemas([breadcrumbSchema, faqSchema]);
      return () => cleanup && cleanup();
    }
  }, []);

  // PM Skills from Evaluation Templates
  const coreSkills = [
    {
      name: "Product Sense & Design",
      icon: <LightbulbIcon size={44} color={CTA_TEAL} />,
      description: "Master user empathy, problem definition, and solution design",
      topics: [
        "User segmentation and persona development",
        "CIRCLES framework for product design",
        "Feature prioritization with RICE scoring",
        "Trade-off analysis and constraint handling",
        "Success metrics and guardrail definition"
      ],
      examples: [
        "Design a better alarm clock for the blind",
        "Improve WhatsApp groups for large communities",
        "Design a travel kiosk for train stations",
        "Design an ATM for children aged 8-12"
      ]
    },
    {
      name: "Execution & Analytics",
      icon: <RocketIcon size={44} color={CTA_TEAL} />,
      description: "Drive products from concept to launch with data-driven decisions",
      topics: [
        "Root cause analysis for metric drops",
        "AARM framework (Acquire, Activate, Retain, Monetize)",
        "A/B test design and interpretation",
        "Go-to-market strategy and rollout planning",
        "Funnel optimization and conversion tactics"
      ],
      examples: [
        "DAU dropped 20% in the last week. Diagnose.",
        "Launch a new feature from 0 to 1",
        "Define success metrics for a product",
        "Diagnose a sudden spike in churn rate"
      ]
    },
    {
      name: "Technical Acumen",
      icon: <CodeIcon size={44} color={CTA_TEAL} />,
      description: "Collaborate effectively with engineering teams on system design",
      topics: [
        "System architecture and scalability",
        "API design and microservices",
        "Database choices and data modeling",
        "Technical trade-offs and cost analysis",
        "Engineering resource estimation"
      ],
      examples: [
        "Design a notification system at scale",
        "Explain how Google Search works",
        "Discuss database choices for real-time chat",
        "Design a rate limiting system"
      ]
    },
    {
      name: "Strategy & Leadership",
      icon: <CompassIcon size={44} color={CTA_TEAL} />,
      description: "Build roadmaps, influence stakeholders, lead cross-functional teams",
      topics: [
        "3-year product vision and roadmap",
        "Stakeholder management and influence",
        "Cross-functional team leadership",
        "Conflict resolution and negotiation",
        "Strategic decision-making frameworks"
      ],
      examples: [
        "Build a 3-year roadmap for a SaaS product",
        "Resolve conflict between design and engineering",
        "Influence executives without authority",
        "Prioritize competing team requests"
      ]
    }
  ];

  // PM Frameworks Section
  const frameworks = [
    {
      name: "CIRCLES Method",
      purpose: "Product Design Questions",
      icon: <TargetIcon size={32} color={CTA_TEAL} />,
      steps: [
        { letter: "C", step: "Comprehend", desc: "Clarify the problem and constraints" },
        { letter: "I", step: "Identify", desc: "Identify the customer and their needs" },
        { letter: "R", step: "Report", desc: "Report the customer's needs" },
        { letter: "C", step: "Cut", desc: "Cut through prioritization" },
        { letter: "L", step: "List", desc: "List solutions" },
        { letter: "E", step: "Evaluate", desc: "Evaluate trade-offs" },
        { letter: "S", step: "Summarize", desc: "Summarize your recommendation" }
      ]
    },
    {
      name: "AARM Framework",
      purpose: "Metrics & Growth Questions",
      icon: <TrendUpIcon size={32} color={CTA_TEAL} />,
      steps: [
        { letter: "A", step: "Acquire", desc: "How do users discover the product?" },
        { letter: "A", step: "Activate", desc: "What makes a user engaged?" },
        { letter: "R", step: "Retain", desc: "Why do users come back?" },
        { letter: "M", step: "Monetize", desc: "How does the product make money?" }
      ]
    },
    {
      name: "RICE Scoring",
      purpose: "Feature Prioritization",
      icon: <MapIcon size={32} color={CTA_TEAL} />,
      steps: [
        { letter: "R", step: "Reach", desc: "How many users will this impact?" },
        { letter: "I", step: "Impact", desc: "How much will it impact each user?" },
        { letter: "C", step: "Confidence", desc: "How confident are we in our estimates?" },
        { letter: "E", step: "Effort", desc: "How much time will it take?" }
      ],
      formula: "Score = (Reach × Impact × Confidence) ÷ Effort"
    }
  ];

  // Interview Timeline
  const interviewPhases = [
    {
      phase: "Week 1-2",
      title: "Master Frameworks",
      icon: <TargetIcon size={28} color={CTA_TEAL} />,
      goals: [
        "Learn CIRCLES, AARM, RICE frameworks inside out",
        "Practice 10+ product design questions",
        "Develop structured thinking muscle memory",
        "Record yourself explaining frameworks clearly"
      ]
    },
    {
      phase: "Week 3-4",
      title: "Product Sense Deep Dive",
      icon: <LightbulbIcon size={28} color={CTA_TEAL} />,
      goals: [
        "Master user empathy and problem definition",
        "Practice prioritization with real constraints",
        "Learn to quantify impact with metrics",
        "Build portfolio of practice case studies"
      ]
    },
    {
      phase: "Week 5-6",
      title: "Execution & Metrics",
      icon: <RocketIcon size={28} color={CTA_TEAL} />,
      goals: [
        "Practice root cause analysis systematically",
        "Master A/B test design and interpretation",
        "Learn to define success metrics and guardrails",
        "Understand funnel optimization tactics"
      ]
    },
    {
      phase: "Week 7-8",
      title: "Technical & Leadership",
      icon: <UsersIcon size={28} color={CTA_TEAL} />,
      goals: [
        "Design systems end-to-end with trade-offs",
        "Practice influencing without authority",
        "Master behavioral STAR storytelling",
        "Build 3-year roadmaps with strategic rationale"
      ]
    }
  ];

  // Success Stories
  const successStories = [
    {
      name: "Arjun M.",
      company: "Google",
      role: "Product Manager",
      outcome: "₹42L Package",
      detail: "7 offers from FAANG",
      quote: "My mentor taught me the CIRCLES framework inside-out. When Google asked 'Design YouTube for kids', I structured my answer perfectly. The interviewer literally said 'This is textbook—exactly what we're looking for.' Offer came 2 days later.",
      rating: 5,
      sessions: 6
    },
    {
      name: "Priya K.",
      company: "Meta",
      role: "Product Manager",
      outcome: "3x Salary Jump",
      detail: "From ₹15L to ₹45L",
      quote: "I was failing execution rounds until CrackJobs. My mentor showed me how to segment metrics systematically. When Meta asked about DAU drops, I used their exact playbook—segment by platform, cohort, channel. Crushed all 5 rounds.",
      rating: 5,
      sessions: 8
    },
    {
      name: "Rohan S.",
      company: "Amazon",
      role: "Senior PM (L5)",
      outcome: "₹38L Package",
      detail: "Promoted from APM",
      quote: "Amazon's technical PM bar is brutal. My mentor made me design systems every session—notifications, recommendations, search. When they asked about notification architecture, I was over-prepared. Cleared the loop with 'Strong Hire' from all interviewers.",
      rating: 5,
      sessions: 10
    }
  ];

  // Common Mistakes - Comprehensive
  const commonMistakes = [
    {
      mistake: "Jumping to solutions before deeply understanding the problem",
      why: "Shows lack of structured thinking and user empathy",
      fix: "Spend first 5 minutes clarifying: Who are the users? What's their pain? What constraints exist? What does success look like? Interviewers test your process, not speed.",
      framework: "CIRCLES starts with Comprehend for a reason"
    },
    {
      mistake: "Not quantifying impact with specific metrics and reasoning",
      why: "Makes your answers feel generic and ungrounded",
      fix: "Never say 'improve engagement.' Say: 'Based on similar features at Company X driving 15% DAU lift in comparable markets, I estimate 12% WAU increase. Here's my logic...' Always back claims with data.",
      framework: "Every solution needs metrics from AARM"
    },
    {
      mistake: "Ignoring technical feasibility and engineering constraints",
      why: "Shows you can't work with engineering teams",
      fix: "Always mention: 'This requires API changes, ~2 sprints. Trade-off: complexity vs time-to-market. Alternative: simpler v1 in 1 sprint with 70% impact.' Show you speak engineering.",
      framework: "Technical Acumen is 25% of evaluation"
    },
    {
      mistake: "Providing weak behavioral examples without STAR structure",
      why: "Fails to demonstrate actual PM experience credibly",
      fix: "Use STAR religiously: 'When NPS dropped 45→38 (Situation), I led 5 engineers (Task) to rebuild onboarding in 6 weeks (Action), recovering NPS to 52 and reducing churn 18% (Result).' Specifics matter.",
      framework: "Behavioral questions test past performance"
    },
    {
      mistake: "Not proactively discussing risks, edge cases, and guardrails",
      why: "Junior PMs miss failure modes; senior PMs anticipate them",
      fix: "Always mention: 'Bad actors could spam this—we'd add rate limiting. Guardrail: ensure comments/post <10. Edge case: what if user has no friends? Fallback: show trending content.' Shows maturity.",
      framework: "Risk mitigation separates L4 from L5+"
    }
  ];

  // Case Study Walkthrough
  const caseStudySteps = [
    {
      step: 1,
      title: "Clarify & Scope",
      time: "3-5 minutes",
      actions: [
        "Ask clarifying questions about users, constraints, success",
        "Restate the problem in your own words",
        "Align on what's in scope vs out of scope"
      ]
    },
    {
      step: 2,
      title: "Define Users & Problems",
      time: "5-7 minutes",
      actions: [
        "Identify 3-4 distinct user segments",
        "Map pain points for each segment",
        "Choose primary segment with clear reasoning"
      ]
    },
    {
      step: 3,
      title: "Ideate Solutions",
      time: "8-10 minutes",
      actions: [
        "Brainstorm 5-7 potential solutions",
        "Prioritize using RICE or similar framework",
        "Explain trade-offs for top 2-3 ideas"
      ]
    },
    {
      step: 4,
      title: "Define Success",
      time: "5-7 minutes",
      actions: [
        "Set north star metric and supporting metrics",
        "Define guardrail metrics to monitor risks",
        "Estimate impact with reasoning"
      ]
    },
    {
      step: 5,
      title: "Plan Execution",
      time: "5-8 minutes",
      actions: [
        "Outline MVP vs future iterations",
        "Mention technical considerations",
        "Discuss rollout strategy and learnings"
      ]
    }
  ];

  return (
    <>
      <Head>
        <title>Product Manager Interview Preparation | Master PM Frameworks & Land FAANG Offers</title>
        <meta name="description" content="Ace Product Manager interviews at Google, Amazon, Meta with expert PM mentors. Master CIRCLES, AARM, RICE frameworks. Practice product sense, execution, technical design, and strategy. Get structured feedback from real FAANG PMs." />
        <meta name="keywords" content="product manager interview, PM interview prep, CIRCLES framework, AARM framework, RICE scoring, product sense, execution interview, Google PM, Amazon PM, Meta PM, FAANG PM interview, product strategy, PM frameworks" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://crackjobs.com/interviews/product-management" />
        <meta property="og:title" content="Product Manager Interview Preparation | CrackJobs" />
        <meta property="og:description" content="Master PM interviews with expert mentors from Google, Amazon, Meta. Learn frameworks, get feedback, land offers." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://crackjobs.com/interviews/product-management" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Product Manager Interview Preparation | CrackJobs" />
        <meta name="twitter:description" content="Master PM interviews with expert mentors from Google, Amazon, Meta." />
      </Head>

      <View style={styles.container}>
        <ScrollView style={styles.scrollContent} accessibilityRole="main">
          
          {/* Header - Same as Homepage */}
          <View style={styles.header} accessibilityRole="navigation" accessibilityLabel="Main navigation">
            <View style={[styles.headerInner]}>
              <BrandHeader style={{ marginBottom: 0 }} small={false} />
              <View style={[styles.navRight]}>
                <TouchableOpacity 
                  onPress={() => router.push('/auth/sign-in')} 
                  accessibilityRole="link" 
                  accessibilityLabel="Log in to your account"
                  accessibilityHint="Navigate to sign in page"
                >
                  <Text style={styles.navLinkText}>Log in</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.btnSmall} 
                  onPress={() => router.push('/auth/sign-up')} 
                  accessibilityRole="button" 
                  accessibilityLabel="Get Started"
                  accessibilityHint="Navigate to sign up page"
                >
                  <Text style={styles.btnSmallText}>Get Started</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Hero Section */}
          <View style={[styles.hero]} accessibilityRole="region" accessibilityLabel="Hero section">
            <View style={styles.badge} accessibilityRole="text">
              <Text style={styles.badgeText}>🎯 PRODUCT MANAGEMENT INTERVIEWS</Text>
            </View>
            <Text 
              style={[styles.heroTitle]} 
              accessibilityRole="header" 
              accessibilityLevel={1}
            >
              Master PM Frameworks That Win FAANG Offers
            </Text>
            <Text style={[styles.heroSubtitle]}>
              Practice Product Sense, Execution, Technical Design, and Strategy with experienced PMs. Get structured feedback on every answer.
            </Text>
            <View style={styles.heroStats}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>₹20-45L</Text>
                <Text style={styles.statLabel}>Average Salary</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statValue}>4-6</Text>
                <Text style={styles.statLabel}>Interview Rounds</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statValue}>6-8 weeks</Text>
                <Text style={styles.statLabel}>Prep Timeline</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.ctaBtn} 
              onPress={() => router.push('/auth/sign-up')} 
              accessibilityRole="button" 
              accessibilityLabel="Find Your PM Mentor"
              accessibilityHint="Browse available PM mentors and book a session"
            >
              <Text style={styles.ctaBtnText}>Find Your PM Mentor →</Text>
            </TouchableOpacity>
          </View>

          {/* 4 Core Skills - Detailed */}
          <View style={[styles.section, { backgroundColor: 'white' }]} accessibilityRole="region" accessibilityLabel="Core PM skills">
            <Text style={styles.sectionLabel} accessibilityRole="header" accessibilityLevel={2}>4 CORE EVALUATION AREAS</Text>
            <Text style={[styles.sectionTitle]}>
              What FAANG Companies Test in PM Interviews
            </Text>
            <Text style={styles.sectionDesc}>
              Based on actual evaluation frameworks used at Google, Amazon, Meta. These 4 areas cover 100% of PM interview questions.
            </Text>
            
            {coreSkills.map((skill, i) => (
              <View key={i} style={styles.skillDetailCard} accessibilityRole="article">
                <View style={styles.skillDetailHeader}>
                  {skill.icon}
                  <View style={styles.skillDetailInfo}>
                    <Text style={styles.skillDetailName} accessibilityRole="header" accessibilityLevel={3}>
                      {skill.name}
                    </Text>
                    <Text style={styles.skillDetailDesc}>{skill.description}</Text>
                  </View>
                </View>
                
                <View style={styles.skillTopics}>
                  <Text style={styles.skillTopicsLabel}>Topics Covered:</Text>
                  {skill.topics.map((topic, j) => (
                    <View key={j} style={styles.topicItem}>
                      <CheckCircleIcon size={16} color={CTA_TEAL} />
                      <Text style={styles.topicText}>{topic}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.skillExamples}>
                  <Text style={styles.skillExamplesLabel}>Example Questions:</Text>
                  {skill.examples.map((ex, j) => (
                    <Text key={j} style={styles.exampleBullet}>• {ex}</Text>
                  ))}
                </View>
              </View>
            ))}
          </View>

          {/* PM Frameworks - Deep Dive */}
          <View style={[styles.section, { backgroundColor: BG_CREAM }]} accessibilityRole="region" accessibilityLabel="PM Frameworks">
            <Text style={styles.sectionLabel} accessibilityRole="header" accessibilityLevel={2}>ESSENTIAL PM FRAMEWORKS</Text>
            <Text style={[styles.sectionTitle]}>
              3 Frameworks Every PM Must Master
            </Text>
            <Text style={styles.sectionDesc}>
              Top companies expect structured thinking. Interviewers explicitly look for framework usage in your answers.
            </Text>

            {frameworks.map((fw, i) => (
              <View key={i} style={styles.frameworkDetailCard} accessibilityRole="article">
                <View style={styles.frameworkHeader}>
                  {fw.icon}
                  <View style={styles.frameworkInfo}>
                    <Text style={styles.frameworkName}>{fw.name}</Text>
                    <Text style={styles.frameworkPurpose}>Use for: {fw.purpose}</Text>
                  </View>
                </View>

                <View style={styles.frameworkSteps}>
                  {fw.steps.map((step, j) => (
                    <View key={j} style={styles.frameworkStep}>
                      <View style={styles.frameworkStepNumber}>
                        <Text style={styles.frameworkStepLetter}>{step.letter}</Text>
                      </View>
                      <View style={styles.frameworkStepContent}>
                        <Text style={styles.frameworkStepTitle}>{step.step}</Text>
                        <Text style={styles.frameworkStepDesc}>{step.desc}</Text>
                      </View>
                    </View>
                  ))}
                </View>

                {fw.formula && (
                  <View style={styles.formulaBox}>
                    <Text style={styles.formulaLabel}>Formula:</Text>
                    <Text style={styles.formulaText}>{fw.formula}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* Interview Timeline */}
          <View style={[styles.section, { backgroundColor: 'white' }]} accessibilityRole="region" accessibilityLabel="Interview preparation timeline">
            <Text style={styles.sectionLabel} accessibilityRole="header" accessibilityLevel={2}>8-WEEK PREPARATION ROADMAP</Text>
            <Text style={[styles.sectionTitle]}>
              Your Complete PM Interview Prep Plan
            </Text>
            <Text style={styles.sectionDesc}>
              A structured, week-by-week plan to master all 4 PM skill areas. Most candidates need 6-8 weeks.
            </Text>

            <View style={styles.timeline}>
              {interviewPhases.map((phase, i) => (
                <View key={i} style={styles.timelineItem} accessibilityRole="article">
                  <View style={styles.timelineMarker}>
                    <View style={styles.timelineDot} />
                    {i < interviewPhases.length - 1 && <View style={styles.timelineLine} />}
                  </View>
                  <View style={styles.timelineContent}>
                    <View style={styles.timelineHeader}>
                      {phase.icon}
                      <View style={styles.timelineHeaderText}>
                        <Text style={styles.timelinePhase}>{phase.phase}</Text>
                        <Text style={styles.timelineTitle}>{phase.title}</Text>
                      </View>
                    </View>
                    <View style={styles.timelineGoals}>
                      {phase.goals.map((goal, j) => (
                        <View key={j} style={styles.goalItem}>
                          <CheckCircleIcon size={14} color={CTA_TEAL} />
                          <Text style={styles.goalText}>{goal}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Case Study Walkthrough */}
          <View style={[styles.section, { backgroundColor: '#f0f8ff' }]} accessibilityRole="region" accessibilityLabel="Case study walkthrough">
            <Text style={styles.sectionLabel} accessibilityRole="header" accessibilityLevel={2}>CASE STUDY WALKTHROUGH</Text>
            <Text style={[styles.sectionTitle]}>
              How to Structure a 45-Minute PM Case
            </Text>
            <Text style={styles.sectionDesc}>
              Time management is critical. Here's the exact structure top PMs use to ace product design questions.
            </Text>

            <View style={styles.caseStudyContainer}>
              {caseStudySteps.map((item, i) => (
                <View key={i} style={styles.caseStudyStep} accessibilityRole="article">
                  <View style={styles.caseStudyStepHeader}>
                    <View style={styles.caseStudyStepNum}>
                      <Text style={styles.caseStudyStepNumText}>{item.step}</Text>
                    </View>
                    <View style={styles.caseStudyStepInfo}>
                      <Text style={styles.caseStudyStepTitle}>{item.title}</Text>
                      <Text style={styles.caseStudyStepTime}>{item.time}</Text>
                    </View>
                  </View>
                  <View style={styles.caseStudyActions}>
                    {item.actions.map((action, j) => (
                      <Text key={j} style={styles.caseStudyAction}>→ {action}</Text>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Success Stories */}
          <View style={[styles.section, { backgroundColor: 'white' }]} accessibilityRole="region" accessibilityLabel="Success stories">
            <Text style={styles.sectionLabel} accessibilityRole="header" accessibilityLevel={2}>SUCCESS STORIES</Text>
            <Text style={[styles.sectionTitle]}>
              Real PM Offers from Real Practice
            </Text>
            <Text style={styles.sectionDesc}>
              These candidates used CrackJobs to practice frameworks, get feedback, and land FAANG PM roles.
            </Text>

            <View style={[styles.storiesGrid]}>
              {successStories.map((story, i) => (
                <View 
                  key={i} 
                  style={styles.storyCard} 
                  accessibilityRole="article" 
                  accessibilityLabel={`Success story from ${story.name}, ${story.company}`}
                >
                  <View style={styles.storyHeader}>
                    <View>
                      <Text style={styles.storyName}>{story.name}</Text>
                      <Text style={styles.storyRole}>{story.role} at {story.company}</Text>
                    </View>
                    <View style={styles.storyRating}>
                      {[...Array(story.rating)].map((_, j) => (
                        <StarIcon key={j} size={14} />
                      ))}
                    </View>
                  </View>

                  <View style={styles.storyOutcomeBox}>
                    <Text style={styles.storyOutcome}>{story.outcome}</Text>
                    <Text style={styles.storyDetail}>{story.detail}</Text>
                  </View>

                  <Text style={styles.storyQuote}>"{story.quote}"</Text>

                  <View style={styles.storyFooter}>
                    <Text style={styles.storySessions}>{story.sessions} practice sessions</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Common Mistakes - Comprehensive */}
          <View style={[styles.section, { backgroundColor: '#fff8f0' }]} accessibilityRole="region" accessibilityLabel="Common mistakes">
            <Text style={styles.sectionLabel} accessibilityRole="header" accessibilityLevel={2}>AVOID THESE MISTAKES</Text>
            <Text style={[styles.sectionTitle]}>
              5 Mistakes That Cost PM Offers
            </Text>
            <Text style={styles.sectionDesc}>
              Based on 1000+ PM interview evaluations. These mistakes appear in 80% of failed interviews.
            </Text>

            {commonMistakes.map((item, i) => (
              <View key={i} style={styles.mistakeCard} accessibilityRole="article">
                <View style={styles.mistakeHeader}>
                  <AlertIcon size={26} color={BRAND_ORANGE} />
                  <Text style={styles.mistakeNum}>Mistake #{i + 1}</Text>
                </View>

                <Text style={styles.mistakeText}>{item.mistake}</Text>

                <View style={styles.mistakeWhy}>
                  <Text style={styles.mistakeWhyLabel}>Why it fails:</Text>
                  <Text style={styles.mistakeWhyText}>{item.why}</Text>
                </View>

                <View style={styles.mistakeFix}>
                  <Text style={styles.mistakeFixLabel}>✅ How to fix it:</Text>
                  <Text style={styles.mistakeFixText}>{item.fix}</Text>
                </View>

                <View style={styles.mistakeFramework}>
                  <Text style={styles.mistakeFrameworkText}>💡 {item.framework}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Related Articles */}
          <View style={[styles.section, { backgroundColor: 'white' }]} accessibilityRole="region" accessibilityLabel="Related reading">
            <Text style={styles.sectionLabel} accessibilityRole="header" accessibilityLevel={2}>DEEP DIVE GUIDES</Text>
            <Text style={[styles.sectionTitle]}>
              Master Specific PM Interview Topics
            </Text>

            <View style={[styles.articlesGrid]}>
              <TouchableOpacity 
                style={styles.articleCard} 
                onPress={() => router.push('/blog/product-manager-interview-execution-mistakes')} 
                accessibilityRole="link" 
                accessibilityLabel="Read guide about execution mistakes"
              >
                <BookOpenIcon size={32} color={CTA_TEAL} />
                <Text style={styles.articleTitle}>5 Execution Mistakes PMs Make in Interviews</Text>
                <Text style={styles.articleDesc}>
                  Learn how to avoid common execution interview pitfalls. Master root cause analysis, metric selection, and go-to-market planning.
                </Text>
                <Text style={styles.articleCta}>Read Complete Guide →</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.articleCard} 
                onPress={() => router.push('/blog/product-manager-interview-product-sense-mistakes')} 
                accessibilityRole="link" 
                accessibilityLabel="Read guide about product sense"
              >
                <BookOpenIcon size={32} color={CTA_TEAL} />
                <Text style={styles.articleTitle}>Product Sense: Complete Framework Guide</Text>
                <Text style={styles.articleDesc}>
                  Master "design a product" questions with the CIRCLES method. Includes real examples and evaluation rubrics.
                </Text>
                <Text style={styles.articleCta}>Read Complete Guide →</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* How It Works */}
          <View style={[styles.section, { backgroundColor: BG_CREAM }]} accessibilityRole="region" accessibilityLabel="How it works">
            <Text style={styles.sectionLabel} accessibilityRole="header" accessibilityLevel={2}>HOW IT WORKS</Text>
            <Text style={[styles.sectionTitle]}>
              Practice with Real PMs in 3 Steps
            </Text>

            <View style={[styles.stepsGrid]}>
              <View style={styles.stepCard} accessibilityRole="article">
                <View style={styles.stepNum}>
                  <Text style={styles.stepNumText}>1</Text>
                </View>
                <Text style={styles.stepTitle}>Choose Your Focus Area</Text>
                <Text style={styles.stepDesc}>
                  Select Product Sense, Execution, Technical, or Strategy. Browse PMs from Google, Amazon, Meta, and 50+ top companies.
                </Text>
              </View>

              <View style={styles.stepCard} accessibilityRole="article">
                <View style={styles.stepNum}>
                  <Text style={styles.stepNumText}>2</Text>
                </View>
                <Text style={styles.stepTitle}>Book Anonymous 55-Min Session</Text>
                <Text style={styles.stepDesc}>
                  Practice real PM interview questions. Get live feedback on frameworks, metrics, and communication. No personal info shared.
                </Text>
              </View>

              <View style={styles.stepCard} accessibilityRole="article">
                <View style={styles.stepNum}>
                  <Text style={styles.stepNumText}>3</Text>
                </View>
                <Text style={styles.stepTitle}>Receive Detailed Evaluation</Text>
                <Text style={styles.stepDesc}>
                  Get structured feedback on all 4 skill areas: Product Sense, Execution, Technical, Strategy. Know exactly what to improve.
                </Text>
              </View>
            </View>
          </View>

         
          {/* Footer */}
          <Footer />

        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG_CREAM },
  scrollContent: { minHeight: '100%' },

  // Header (same as homepage)
  header: { backgroundColor: BG_CREAM, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  headerInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1200, width: '100%', alignSelf: 'center', paddingHorizontal: 24 },
  headerInnerMobile: { paddingHorizontal: 16 },
  navRight: { flexDirection: 'row', gap: 24, alignItems: 'center' },
  navRightMobile: { gap: 12 },
  navLinkText: { fontFamily: SYSTEM_FONT, fontWeight: '600', color: TEXT_DARK },
  btnSmall: { backgroundColor: CTA_TEAL, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 100 },
  btnSmallText: { fontFamily: SYSTEM_FONT, fontSize: 13, fontWeight: '700', color: '#fff' },

  // Hero
  hero: { maxWidth: 950, width: '100%', alignSelf: 'center', paddingHorizontal: 24, paddingVertical: 70, alignItems: 'center' },
  heroMobile: { paddingVertical: 45 },
  badge: { backgroundColor: 'white', borderWidth: 1, borderColor: '#d0f0f0', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 24, marginBottom: 28 },
  badgeText: { color: CTA_TEAL, fontWeight: '700', fontSize: 12, letterSpacing: 0.6 },
  heroTitle: { fontFamily: SYSTEM_FONT, fontWeight: '900', fontSize: 46, color: BRAND_ORANGE, lineHeight: 66, textAlign: 'center', marginBottom: 24 },
  heroTitleMobile: { fontSize: 38, lineHeight: 46 },
  heroSubtitle: { fontFamily: SYSTEM_FONT, fontSize: 20, color: TEXT_GRAY, lineHeight: 32, textAlign: 'center', marginBottom: 42, maxWidth: 780 },
  heroSubtitleMobile: { fontSize: 18, lineHeight: 28 },
  heroStats: { flexDirection: 'row', gap: 36, marginBottom: 42, flexWrap: 'wrap', justifyContent: 'center' },
  stat: { alignItems: 'center', minWidth: 90 },
  statValue: { fontFamily: SYSTEM_FONT, fontSize: 32, fontWeight: '800', color: CTA_TEAL, marginBottom: 6 },
  statLabel: { fontFamily: SYSTEM_FONT, fontSize: 13, color: TEXT_GRAY, textAlign: 'center' },
  ctaBtn: { backgroundColor: CTA_TEAL, paddingHorizontal: 44, paddingVertical: 20, borderRadius: 100 },
  ctaBtnText: { fontFamily: SYSTEM_FONT, fontSize: 17, fontWeight: '700', color: 'white' },

  // Sections
  section: { paddingVertical: 80, paddingHorizontal: 24 },
  sectionLabel: { fontFamily: SYSTEM_FONT, fontSize: 12, fontWeight: '700', color: CTA_TEAL, letterSpacing: 1.8, textAlign: 'center', marginBottom: 14, textTransform: 'uppercase' },
  sectionTitle: { fontFamily: SYSTEM_FONT, fontSize: 42, fontWeight: '800', color: TEXT_DARK, textAlign: 'center', marginBottom: 18, maxWidth: 850, alignSelf: 'center' },
  sectionTitleMobile: { fontSize: 32 },
  sectionDesc: { fontFamily: SYSTEM_FONT, fontSize: 18, color: TEXT_GRAY, textAlign: 'center', marginBottom: 52, maxWidth: 750, alignSelf: 'center', lineHeight: 29 },

  // Skill Detail Cards
  skillDetailCard: { maxWidth: 950, width: '100%', alignSelf: 'center', backgroundColor: BG_CREAM, borderRadius: 20, padding: 36, marginBottom: 28, borderWidth: 1, borderColor: '#e5e5e5' },
  skillDetailHeader: { flexDirection: 'row', gap: 20, marginBottom: 24, alignItems: 'flex-start' },
  skillDetailInfo: { flex: 1 },
  skillDetailName: { fontFamily: SYSTEM_FONT, fontSize: 24, fontWeight: '700', color: TEXT_DARK, marginBottom: 10 },
  skillDetailDesc: { fontFamily: SYSTEM_FONT, fontSize: 16, color: TEXT_GRAY, lineHeight: 25 },
  skillTopics: { backgroundColor: 'white', padding: 24, borderRadius: 14, marginBottom: 20 },
  skillTopicsLabel: { fontFamily: SYSTEM_FONT, fontSize: 14, fontWeight: '700', color: CTA_TEAL, marginBottom: 14 },
  topicItem: { flexDirection: 'row', gap: 12, marginBottom: 10, alignItems: 'flex-start' },
  topicText: { fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_DARK, flex: 1, lineHeight: 23 },
  skillExamples: { borderTopWidth: 1, borderTopColor: '#e0e0e0', paddingTop: 20 },
  skillExamplesLabel: { fontFamily: SYSTEM_FONT, fontSize: 14, fontWeight: '600', color: TEXT_GRAY, marginBottom: 12 },
  exampleBullet: { fontFamily: SYSTEM_FONT, fontSize: 14, color: TEXT_GRAY, lineHeight: 24, marginBottom: 6 },

  // Framework Detail Cards
  frameworkDetailCard: { maxWidth: 950, width: '100%', alignSelf: 'center', backgroundColor: 'white', borderRadius: 20, padding: 36, marginBottom: 28, borderLeftWidth: 5, borderLeftColor: CTA_TEAL },
  frameworkHeader: { flexDirection: 'row', gap: 18, marginBottom: 28, alignItems: 'center' },
  frameworkInfo: { flex: 1 },
  frameworkName: { fontFamily: SYSTEM_FONT, fontSize: 26, fontWeight: '700', color: TEXT_DARK, marginBottom: 8 },
  frameworkPurpose: { fontFamily: SYSTEM_FONT, fontSize: 15, color: CTA_TEAL, fontWeight: '600' },
  frameworkSteps: { gap: 16, marginBottom: 20 },
  frameworkStep: { flexDirection: 'row', gap: 16, alignItems: 'flex-start' },
  frameworkStepNumber: { width: 48, height: 48, borderRadius: 24, backgroundColor: BG_CREAM, alignItems: 'center', justifyContent: 'center' },
  frameworkStepLetter: { fontFamily: SYSTEM_FONT, fontSize: 22, fontWeight: '800', color: CTA_TEAL },
  frameworkStepContent: { flex: 1 },
  frameworkStepTitle: { fontFamily: SYSTEM_FONT, fontSize: 17, fontWeight: '700', color: TEXT_DARK, marginBottom: 5 },
  frameworkStepDesc: { fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_GRAY, lineHeight: 23 },
  formulaBox: { backgroundColor: '#e8f5f5', padding: 18, borderRadius: 12, marginTop: 10 },
  formulaLabel: { fontFamily: SYSTEM_FONT, fontSize: 13, fontWeight: '700', color: CTA_TEAL, marginBottom: 8 },
  formulaText: { fontFamily: SYSTEM_FONT, fontSize: 16, color: TEXT_DARK, fontWeight: '600' },

  // Timeline
  timeline: { maxWidth: 950, alignSelf: 'center', width: '100%' },
  timelineItem: { flexDirection: 'row', gap: 24, marginBottom: 36 },
  timelineMarker: { width: 40, alignItems: 'center' },
  timelineDot: { width: 22, height: 22, borderRadius: 11, backgroundColor: CTA_TEAL, borderWidth: 4, borderColor: 'white', shadowColor: CTA_TEAL, shadowOpacity: 0.3, shadowRadius: 6 },
  timelineLine: { width: 2, flex: 1, backgroundColor: '#d0d0d0', marginTop: 8 },
  timelineContent: { flex: 1 },
  timelineHeader: { flexDirection: 'row', gap: 14, marginBottom: 16, alignItems: 'center' },
  timelineHeaderText: { flex: 1 },
  timelinePhase: { fontFamily: SYSTEM_FONT, fontSize: 13, fontWeight: '700', color: CTA_TEAL, marginBottom: 6 },
  timelineTitle: { fontFamily: SYSTEM_FONT, fontSize: 22, fontWeight: '700', color: TEXT_DARK },
  timelineGoals: { gap: 10 },
  goalItem: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  goalText: { fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_DARK, flex: 1, lineHeight: 23 },

  // Case Study
  caseStudyContainer: { maxWidth: 900, alignSelf: 'center', width: '100%', gap: 20 },
  caseStudyStep: { backgroundColor: 'white', padding: 28, borderRadius: 16, borderLeftWidth: 4, borderLeftColor: CTA_TEAL },
  caseStudyStepHeader: { flexDirection: 'row', gap: 18, marginBottom: 18, alignItems: 'center' },
  caseStudyStepNum: { width: 52, height: 52, borderRadius: 26, backgroundColor: BG_CREAM, alignItems: 'center', justifyContent: 'center' },
  caseStudyStepNumText: { fontFamily: SYSTEM_FONT, fontSize: 26, fontWeight: '800', color: CTA_TEAL },
  caseStudyStepInfo: { flex: 1 },
  caseStudyStepTitle: { fontFamily: SYSTEM_FONT, fontSize: 20, fontWeight: '700', color: TEXT_DARK, marginBottom: 4 },
  caseStudyStepTime: { fontFamily: SYSTEM_FONT, fontSize: 14, color: BRAND_ORANGE, fontWeight: '600' },
  caseStudyActions: { gap: 8 },
  caseStudyAction: { fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_DARK, lineHeight: 24 },

  // Success Stories
  storiesGrid: { flexDirection: 'row', gap: 26, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 1150, alignSelf: 'center' },
  storiesGridMobile: { flexDirection: 'column' },
  storyCard: { flex: 1, minWidth: 320, maxWidth: 360, backgroundColor: BG_CREAM, padding: 32, borderRadius: 18, borderWidth: 1, borderColor: '#e5e5e5' },
  storyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 },
  storyName: { fontFamily: SYSTEM_FONT, fontSize: 18, fontWeight: '700', color: TEXT_DARK, marginBottom: 4 },
  storyRole: { fontFamily: SYSTEM_FONT, fontSize: 14, color: TEXT_GRAY },
  storyRating: { flexDirection: 'row', gap: 3 },
  storyOutcomeBox: { backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 18 },
  storyOutcome: { fontFamily: SYSTEM_FONT, fontSize: 20, fontWeight: '700', color: CTA_TEAL, marginBottom: 4 },
  storyDetail: { fontFamily: SYSTEM_FONT, fontSize: 13, color: TEXT_GRAY },
  storyQuote: { fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_DARK, lineHeight: 25, marginBottom: 18, fontStyle: 'italic' },
  storyFooter: { borderTopWidth: 1, borderTopColor: '#e0e0e0', paddingTop: 14 },
  storySessions: { fontFamily: SYSTEM_FONT, fontSize: 13, fontWeight: '600', color: BRAND_ORANGE },

  // Mistakes
  mistakeCard: { maxWidth: 900, alignSelf: 'center', width: '100%', backgroundColor: 'white', padding: 30, borderRadius: 18, marginBottom: 24, borderLeftWidth: 5, borderLeftColor: BRAND_ORANGE },
  mistakeHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
  mistakeNum: { fontFamily: SYSTEM_FONT, fontSize: 18, fontWeight: '800', color: BRAND_ORANGE },
  mistakeText: { fontFamily: SYSTEM_FONT, fontSize: 18, fontWeight: '700', color: TEXT_DARK, lineHeight: 28, marginBottom: 16 },
  mistakeWhy: { backgroundColor: '#fff5f0', padding: 16, borderRadius: 12, marginBottom: 14 },
  mistakeWhyLabel: { fontFamily: SYSTEM_FONT, fontSize: 13, fontWeight: '700', color: BRAND_ORANGE, marginBottom: 6 },
  mistakeWhyText: { fontFamily: SYSTEM_FONT, fontSize: 14, color: TEXT_DARK, lineHeight: 22 },
  mistakeFix: { backgroundColor: '#f0f8f0', padding: 16, borderRadius: 12, marginBottom: 14 },
  mistakeFixLabel: { fontFamily: SYSTEM_FONT, fontSize: 13, fontWeight: '700', color: CTA_TEAL, marginBottom: 6 },
  mistakeFixText: { fontFamily: SYSTEM_FONT, fontSize: 14, color: TEXT_DARK, lineHeight: 22 },
  mistakeFramework: { paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  mistakeFrameworkText: { fontFamily: SYSTEM_FONT, fontSize: 13, color: TEXT_GRAY, fontStyle: 'italic' },

  // Articles
  articlesGrid: { flexDirection: 'row', gap: 26, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 1050, alignSelf: 'center' },
  articlesGridMobile: { flexDirection: 'column' },
  articleCard: { flex: 1, minWidth: 320, maxWidth: 480, backgroundColor: BG_CREAM, padding: 34, borderRadius: 18, borderWidth: 1, borderColor: '#e5e5e5' },
  articleTitle: { fontFamily: SYSTEM_FONT, fontSize: 21, fontWeight: '700', color: TEXT_DARK, marginTop: 18, marginBottom: 14, lineHeight: 30 },
  articleDesc: { fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_GRAY, lineHeight: 25, marginBottom: 18 },
  articleCta: { fontFamily: SYSTEM_FONT, fontSize: 15, fontWeight: '600', color: CTA_TEAL },

  // Steps
  stepsGrid: { flexDirection: 'row', gap: 32, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 1100, alignSelf: 'center' },
  stepsGridMobile: { flexDirection: 'column' },
  stepCard: { flex: 1, minWidth: 290, maxWidth: 330, alignItems: 'center', backgroundColor: 'white', padding: 32, borderRadius: 18, borderWidth: 1, borderColor: '#e8e8e8' },
  stepNum: { width: 64, height: 64, borderRadius: 32, backgroundColor: CTA_TEAL, alignItems: 'center', justifyContent: 'center', marginBottom: 22 },
  stepNumText: { fontFamily: SYSTEM_FONT, fontSize: 30, fontWeight: '800', color: 'white' },
  stepTitle: { fontFamily: SYSTEM_FONT, fontSize: 20, fontWeight: '700', color: TEXT_DARK, marginBottom: 14, textAlign: 'center' },
  stepDesc: { fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_GRAY, textAlign: 'center', lineHeight: 25 },

  // Final CTA
  finalCta: { backgroundColor: '#0f0f0f', paddingVertical: 80, paddingHorizontal: 24, alignItems: 'center' },
  finalCtaTitle: { fontFamily: SYSTEM_FONT, fontSize: 46, fontWeight: '900', color: 'white', marginBottom: 22, textAlign: 'center', maxWidth: 750 },
  finalCtaSubtitle: { fontFamily: SYSTEM_FONT, fontSize: 18, color: 'rgba(255,255,255,0.85)', marginBottom: 42, textAlign: 'center', maxWidth: 650, lineHeight: 29 },
  finalCtaBtn: { backgroundColor: CTA_TEAL, paddingHorizontal: 50, paddingVertical: 22, borderRadius: 100, marginBottom: 28 },
  finalCtaBtnText: { fontFamily: SYSTEM_FONT, fontSize: 17, fontWeight: '700', color: 'white' },
  finalCtaFeatures: { flexDirection: 'row', gap: 28, flexWrap: 'wrap', justifyContent: 'center' },
  finalCtaFeature: { fontFamily: SYSTEM_FONT, fontSize: 14, color: 'rgba(255,255,255,0.75)' },
});