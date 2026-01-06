// app/interviews/data-science.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, useWindowDimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Head from 'expo-router/head';
import Svg, { Path, Circle, Rect, Line, Polyline, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { BrandHeader } from '@/lib/BrandHeader';
import { Footer } from '@/components/Footer';

// --- THEME CONSTANTS ---
const BRAND_ORANGE = '#f58742';
const CTA_TEAL = '#18a7a7';
const BG_CREAM = '#f8f5f0';
const DARK_BG = '#1a1f2e'; // Darker theme for "Deep Learning/Code" vibe
const TEXT_DARK = '#222';
const TEXT_GRAY = '#555';
const CODE_BG = '#282c34';
const ACCENT_PURPLE = '#8e44ad'; // Unique accent for DS (Neural Nets)

const SYSTEM_FONT = Platform.select({
  web: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
  ios: "System",
  android: "Roboto",
  default: "System"
}) as string;

// --- SVG ICONS (DS SPECIFIC) ---

const BrainIcon = ({ size = 48, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Machine Learning">
    <Path d="M9.5 20c-2.5-1.5-3.5-5-2-7.5s5-3.5 7.5-2 3.5 5 2 7.5-5 3.5-7.5 2z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M2 12h3M19 12h3M12 2v3M12 19v3" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" />
    <Path d="M6 6l2 2M16 16l2 2M6 18l2-2M16 6l2-2" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const ServerGraphIcon = ({ size = 48, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="System Design">
    <Rect x="2" y="2" width="20" height="8" rx="2" stroke={color} strokeWidth="2" />
    <Rect x="2" y="14" width="20" height="8" rx="2" stroke={color} strokeWidth="2" />
    <Line x1="6" y1="6" x2="6.01" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Line x1="6" y1="18" x2="6.01" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M12 10v4" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Circle cx="12" cy="12" r="2" fill={color} />
  </Svg>
);

const ExperimentIcon = ({ size = 48, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Experimentation">
    <Path d="M6 19h12M12 19v-9" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M5 6v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="2" />
  </Svg>
);

const CodeBracketsIcon = ({ size = 48, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Coding">
    <Polyline points="16 18 22 12 16 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Polyline points="8 6 2 12 8 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Line x1="12" y1="20" x2="12" y2="4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" />
  </Svg>
);

const CheckCircleIcon = ({ size = 18, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Check">
    <Circle cx="12" cy="12" r="10" fill={color} />
    <Path d="M7 12l3.5 3.5 6.5-7" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
  </Svg>
);

const AlertTriangleIcon = ({ size = 28, color = BRAND_ORANGE }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Warning">
    <Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Line x1="12" y1="9" x2="12" y2="13" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Circle cx="12" cy="17" r="1" fill={color} />
  </Svg>
);

const StarIcon = ({ size = 16, color = "#FFD700" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} accessibilityLabel="Star">
    <Path d="M12 2l2.4 7.4h7.8l-6.3 4.6 2.4 7.4L12 16.8l-6.3 4.6 2.4-7.4L1.8 9.4h7.8z" />
  </Svg>
);

export default function DataScienceInterviews() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isSmall = width < 900;

  // --- CONTENT DATA (Derived from evaluation-templates.ts ID: 9) ---

  const coreSkillsets = [
    {
      title: "ML Theory & Algorithms",
      icon: <BrainIcon size={40} color="white" />,
      desc: "Deep intuition of how models work, from Logistic Regression to Transformers.",
      topics: [
        "Bias-Variance Tradeoff & Overfitting",
        "Loss functions (LogLoss, Hinge, MSE)",
        "Tree-based models (XGBoost, Random Forest)",
        "Deep Learning basics (Backprop, vanishing gradients)",
        "Evaluation metrics (AUC-ROC, F1, Precision/Recall)"
      ],
      difficulty: "Foundational"
    },
    {
      title: "ML System Design",
      icon: <ServerGraphIcon size={40} color="white" />,
      desc: "Architecting scalable ML pipelines: training, serving, and monitoring.",
      topics: [
        "Training-Serving skew & Data leakage",
        "Real-time vs Batch inference architectures",
        "Feature stores & Data pipelines",
        "Handling Cold Start & Feedback Loops",
        "Model monitoring (Drift detection)"
      ],
      difficulty: "Advanced"
    },
    {
      title: "Statistics & A/B Testing",
      icon: <ExperimentIcon size={40} color="white" />,
      desc: "Rigorous experimentation design and result interpretation.",
      topics: [
        "Hypothesis testing & p-values",
        "Power analysis & Sample size calculation",
        "Network effects & Switchback testing",
        "Handling Sample Ratio Mismatch (SRM)",
        "Novelty effects & Seasonality"
      ],
      difficulty: "Critical"
    },
    {
      title: "Coding & Data Manipulation",
      icon: <CodeBracketsIcon size={40} color="white" />,
      desc: "Writing efficient, production-ready Python/SQL code.",
      topics: [
        "Pandas/NumPy vectorization (No for-loops!)",
        "Algorithmic complexity (Big O)",
        "Data cleaning & imputation strategies",
        "SQL complex joins & window functions",
        "Writing modular, testable ML code"
      ],
      difficulty: "Standard"
    }
  ];

  const systemDesignBlueprint = [
    {
      step: "1. Requirements",
      question: "What are we optimizing?",
      details: ["Business Goal (Revenue vs Engagement)", "Constraints (Latency < 100ms)", "Scale (1M QPS)"]
    },
    {
      step: "2. Data Engineering",
      question: "What data do we need?",
      details: ["Labels (Explicit vs Implicit)", "Feature Sources (Logs, User Profile)", "Sampling Strategy"]
    },
    {
      step: "3. Feature Engineering",
      question: "How do we represent it?",
      details: ["Embeddings (User/Item)", "Contextual Features (Time, Device)", "Handling Missing Data"]
    },
    {
      step: "4. Modeling",
      question: "Which algorithm fits?",
      details: ["Baseline vs Advanced", "Ranking vs Retrieval", "Loss Function Selection"]
    },
    {
      step: "5. Evaluation",
      question: "Offline vs Online?",
      details: ["Offline (AUC, RMSE)", "Online (A/B Test, CTR)", "Slice Analysis"]
    },
    {
      step: "6. Deployment",
      question: "How to serve?",
      details: ["Batch Pre-compute vs Real-time", "Monitoring (Drift)", "Retraining Cadence"]
    }
  ];

  const debuggingScenarios = [
    {
      symptom: "📉 Training Loss ↓ | Validation Loss ↑",
      diagnosis: "Overfitting",
      fix: "Regularization (L1/L2), Dropout, Early Stopping, or Get More Data."
    },
    {
      symptom: "📉 Training Loss (Flat) | Validation Loss (Flat)",
      diagnosis: "Underfitting",
      fix: "Increase model complexity, add features, remove regularization."
    },
    {
      symptom: "🚀 Offline Accuracy High | Online Performance Low",
      diagnosis: "Training-Serving Skew / Leakage",
      fix: "Check for time-travel in data, inconsistent feature pipelines, or target leakage."
    },
    {
      symptom: "⚠️ Validation metric oscillates wildly",
      diagnosis: "Learning Rate too high",
      fix: "Lower learning rate, use LR scheduler, check batch size."
    }
  ];

  const commonMistakes = [
    {
      mistake: "Optimizing for Accuracy but ignoring Latency",
      context: "System Design",
      fix: "Always ask: 'What is the latency budget?' A Transformer model is useless if it takes 2s to infer for a real-time ads system requiring 50ms."
    },
    {
      mistake: "Confusing Correlation with Causation",
      context: "Product/Stats",
      fix: "Just because users who use feature X retain better, doesn't mean feature X causes retention. Propose an A/B test to prove causality."
    },
    {
      mistake: "Ignoring Data Leakage in Time-Series",
      context: "Coding/ML",
      fix: "Never do a random K-Fold split on time-series data. Use time-based splitting (train on past, validate on future) to prevent 'time travel'."
    },
    {
      mistake: "Jumping to Deep Learning immediately",
      context: "Modeling",
      fix: "Start with a baseline (Logistic Regression, Random Forest). It's interpretable, faster, and sets a benchmark. Only go complex if the lift justifies the cost."
    }
  ];

  const successStories = [
    {
      name: "Vikram R.",
      role: "Applied Scientist @ Amazon",
      bg: "Transitioned from SDE",
      quote: "I struggled with the 'ML System Design' round. CrackJobs mentors taught me the 'Retrieval -> Ranking -> Re-ranking' funnel architecture. I used that exact structure for Amazon's search problem and got the offer.",
      package: "₹65L"
    },
    {
      name: "Sneha M.",
      role: "Data Scientist @ Uber",
      bg: "Fresh Grad (Masters)",
      quote: "The mock interviews were brutal but necessary. My mentor grilled me on A/B testing pitfalls like SRM and Novelty Effects. Real interviews felt easy after that.",
      package: "₹45L"
    },
    {
      name: "Arun K.",
      role: "Senior DS @ Myntra",
      bg: "3 YOE Analyst",
      quote: "I was good at modeling but bad at coding. The Pandas/Python practice sessions helped me unlearn 'for-loops' and write vectorized, production-grade code.",
      package: "₹38L"
    }
  ];

  return (
    <>
      <Head>
        <title>Data Science Interview Prep | ML System Design & Statistics</title>
        <meta name="description" content="Master Data Science and ML interviews. Practice ML System Design, A/B Testing, Modeling Theory, and Python Coding with experts from Uber, Amazon, and Google." />
        <meta name="keywords" content="data science interview, machine learning interview, ML system design, data scientist mock interview, amazon applied scientist, uber data scientist, statistics interview questions, deep learning questions" />
        <link rel="canonical" href="https://crackjobs.com/interviews/data-science" />
      </Head>

      <View style={styles.container}>
        <ScrollView style={styles.scrollContent} accessibilityRole="main">
          
          {/* HEADER */}
          <View style={styles.header}>
            <View style={[styles.headerInner, isSmall && styles.headerInnerMobile]}>
              <BrandHeader style={{ marginBottom: 0 }} small={isSmall} />
              <View style={[styles.navRight, isSmall && styles.navRightMobile]}>
                <TouchableOpacity onPress={() => router.push('/auth/sign-in')}><Text style={styles.navLinkText}>Log in</Text></TouchableOpacity>
                <TouchableOpacity style={styles.btnSmall} onPress={() => router.push('/auth/sign-up')}>
                  <Text style={styles.btnSmallText}>Get Started</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* HERO SECTION - DARK THEMED for DS VIBE */}
          <View style={[styles.hero, isSmall && styles.heroMobile]}>
            <View style={styles.badge}><Text style={styles.badgeText}>🤖 DATA SCIENCE & ML TRACK</Text></View>
            <Text style={[styles.heroTitle, isSmall && styles.heroTitleMobile]}>
              Build Models That <Text style={{ color: CTA_TEAL }}>Scale</Text>
            </Text>
            <Text style={[styles.heroSubtitle, isSmall && styles.heroSubtitleMobile]}>
              Move beyond `model.fit()`. Master ML System Design, A/B Testing, and Production Engineering with mentors from Netflix, Uber, and Amazon.
            </Text>
            
            <View style={styles.heroStats}>
              <View style={styles.statItem}>
                <Text style={styles.statVal}>₹25-80L</Text>
                <Text style={styles.statLabel}>Salary Potential</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statVal}>System</Text>
                <Text style={styles.statLabel}>Highest Failure Rate</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statVal}>60m</Text>
                <Text style={styles.statLabel}>Avg Interview</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.ctaBtn} onPress={() => router.push('/auth/sign-up')}>
              <Text style={styles.ctaBtnText}>Find an ML Mentor →</Text>
            </TouchableOpacity>
          </View>

          {/* CORE COMPETENCIES GRID */}
          <View style={[styles.section, { backgroundColor: DARK_BG }]}>
            <Text style={[styles.sectionLabel, { color: CTA_TEAL }]}>THE 4 PILLARS OF DS INTERVIEWS</Text>
            <Text style={[styles.sectionTitle, { color: 'white' }, isSmall && styles.sectionTitleMobile]}>
              What Top Companies Actually Test
            </Text>
            <Text style={[styles.sectionDesc, { color: '#ccc' }]}>
              It's not just about accuracy metrics. You need to demonstrate engineering maturity and statistical rigour.
            </Text>

            <View style={[styles.grid, isSmall && styles.gridMobile]}>
              {coreSkillsets.map((skill, i) => (
                <View key={i} style={styles.skillCard}>
                  <View style={styles.skillIconBox}>
                    {skill.icon}
                  </View>
                  <Text style={styles.skillTitle}>{skill.title}</Text>
                  <Text style={styles.skillDesc}>{skill.desc}</Text>
                  <View style={styles.topicList}>
                    {skill.topics.map((t, j) => (
                      <View key={j} style={styles.topicItem}>
                        <CheckCircleIcon size={14} color={CTA_TEAL} />
                        <Text style={styles.topicText}>{t}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* SPECIAL FEATURE: ML SYSTEM DESIGN BLUEPRINT */}
          <View style={[styles.section, { backgroundColor: BG_CREAM }]}>
            <Text style={styles.sectionLabel}>THE SECRET WEAPON</Text>
            <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}>
              The ML System Design Blueprint
            </Text>
            <Text style={styles.sectionDesc}>
              This is where 70% of senior candidates fail. Use this structured approach to answer questions like "Design Netflix Recommendations".
            </Text>

            <View style={styles.blueprintContainer}>
              {systemDesignBlueprint.map((stage, i) => (
                <View key={i} style={styles.blueprintRow}>
                  <View style={styles.blueprintLeft}>
                    <View style={styles.blueprintDot} />
                    {i !== systemDesignBlueprint.length - 1 && <View style={styles.blueprintLine} />}
                  </View>
                  <View style={styles.blueprintRight}>
                    <Text style={styles.bpStep}>{stage.step}</Text>
                    <Text style={styles.bpQuestion}>{stage.question}</Text>
                    <View style={styles.bpTags}>
                      {stage.details.map((d, j) => (
                        <View key={j} style={styles.bpTag}>
                          <Text style={styles.bpTagText}>{d}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* DEBUGGING CLINIC */}
          <View style={[styles.section, { backgroundColor: 'white' }]}>
            <Text style={styles.sectionLabel}>INTERVIEW SIMULATION</Text>
            <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}>
              The "Model Debugging" Clinic
            </Text>
            <Text style={styles.sectionDesc}>
              Interviewers love giving you broken models. Can you diagnose these common issues?
            </Text>
            
            <View style={[styles.debugGrid, isSmall && styles.gridMobile]}>
              {debuggingScenarios.map((scen, i) => (
                <View key={i} style={styles.debugCard}>
                  <Text style={styles.debugSymptom}>{scen.symptom}</Text>
                  <View style={styles.debugDivider} />
                  <Text style={styles.debugLabel}>DIAGNOSIS:</Text>
                  <Text style={styles.debugDiagnosis}>{scen.diagnosis}</Text>
                  <Text style={styles.debugLabel}>POTENTIAL FIX:</Text>
                  <Text style={styles.debugFix}>{scen.fix}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* COMMON MISTAKES */}
          <View style={[styles.section, { backgroundColor: '#fff8f0' }]}>
            <Text style={[styles.sectionLabel, { color: BRAND_ORANGE }]}>WARNING ZONE</Text>
            <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}>
              Why Candidates Get Rejected
            </Text>
            
            <View style={styles.mistakesList}>
              {commonMistakes.map((m, i) => (
                <View key={i} style={styles.mistakeItem}>
                  <View style={styles.mistakeHeader}>
                    <AlertTriangleIcon size={24} color={BRAND_ORANGE} />
                    <Text style={styles.mistakeContext}>{m.context}</Text>
                  </View>
                  <Text style={styles.mistakeTitle}>❌ {m.mistake}</Text>
                  <Text style={styles.mistakeFix}>✅ <Text style={{fontWeight: '700'}}>Fix:</Text> {m.fix}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* SUCCESS STORIES */}
          <View style={[styles.section, { backgroundColor: DARK_BG }]}>
             <Text style={[styles.sectionLabel, { color: CTA_TEAL }]}>HALL OF FAME</Text>
             <Text style={[styles.sectionTitle, { color: 'white' }, isSmall && styles.sectionTitleMobile]}>
               From Rejection to Offer
             </Text>
             
             <View style={[styles.storiesGrid, isSmall && styles.gridMobile]}>
               {successStories.map((story, i) => (
                 <View key={i} style={styles.storyCard}>
                   <View style={styles.storyHeader}>
                     <View>
                       <Text style={styles.storyName}>{story.name}</Text>
                       <Text style={styles.storyRole}>{story.role}</Text>
                     </View>
                     <View style={styles.storyPackageBox}>
                        <Text style={styles.storyPackage}>{story.package}</Text>
                     </View>
                   </View>
                   <Text style={styles.storyBg}>{story.bg}</Text>
                   <Text style={styles.storyQuote}>"{story.quote}"</Text>
                   <View style={styles.stars}>
                      {[1,2,3,4,5].map(s => <StarIcon key={s} size={14} color="#FFD700" />)}
                   </View>
                 </View>
               ))}
             </View>
          </View>

          {/* FINAL CTA */}
          <View style={styles.finalCta}>
            <Text style={[styles.finalCtaTitle, isSmall && { fontSize: 32 }]}>
              Don't Overfit to the Wrong Material.
            </Text>
            <Text style={styles.finalCtaSubtitle}>
              Get personalized feedback on your System Design, Coding, and Stats skills from mentors who interview at FAANG.
            </Text>
            <TouchableOpacity style={styles.finalCtaBtn} onPress={() => router.push('/auth/sign-up')}>
              <Text style={styles.finalCtaBtnText}>Start Practicing Now →</Text>
            </TouchableOpacity>
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
  
  // Header
  header: { backgroundColor: BG_CREAM, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  headerInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1200, width: '100%', alignSelf: 'center', paddingHorizontal: 24 },
  headerInnerMobile: { paddingHorizontal: 16 },
  navRight: { flexDirection: 'row', gap: 24, alignItems: 'center' },
  navRightMobile: { gap: 12 },
  navLinkText: { fontFamily: SYSTEM_FONT, fontWeight: '600', color: TEXT_DARK },
  btnSmall: { backgroundColor: CTA_TEAL, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 100 },
  btnSmallText: { fontFamily: SYSTEM_FONT, fontSize: 13, fontWeight: '700', color: '#fff' },

  // Hero - Modified for DS Dark Theme
  hero: { maxWidth: 1000, width: '100%', alignSelf: 'center', paddingHorizontal: 24, paddingVertical: 80, alignItems: 'center', backgroundColor: DARK_BG, borderRadius: 30, marginTop: 20, marginBottom: 20 },
  heroMobile: { paddingVertical: 40, borderRadius: 0, marginTop: 0 },
  badge: { backgroundColor: 'rgba(24, 167, 167, 0.15)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginBottom: 24, borderWidth: 1, borderColor: CTA_TEAL },
  badgeText: { color: CTA_TEAL, fontWeight: '700', fontSize: 12, letterSpacing: 1 },
  heroTitle: { fontFamily: SYSTEM_FONT, fontWeight: '900', fontSize: 56, color: 'white', lineHeight: 62, textAlign: 'center', marginBottom: 24 },
  heroTitleMobile: { fontSize: 36, lineHeight: 42 },
  heroSubtitle: { fontFamily: SYSTEM_FONT, fontSize: 18, color: '#a0a0a0', lineHeight: 28, textAlign: 'center', marginBottom: 40, maxWidth: 700 },
  heroSubtitleMobile: { fontSize: 16 },
  heroStats: { flexDirection: 'row', gap: 40, marginBottom: 40, flexWrap: 'wrap', justifyContent: 'center' },
  statItem: { alignItems: 'center' },
  statVal: { fontSize: 32, fontWeight: '800', color: 'white', marginBottom: 4 },
  statLabel: { fontSize: 13, color: '#888', fontFamily: SYSTEM_FONT },
  ctaBtn: { backgroundColor: CTA_TEAL, paddingHorizontal: 40, paddingVertical: 18, borderRadius: 100 },
  ctaBtnText: { fontFamily: SYSTEM_FONT, fontSize: 16, fontWeight: '700', color: 'white' },

  // Sections
  section: { paddingVertical: 80, paddingHorizontal: 24 },
  sectionLabel: { fontFamily: SYSTEM_FONT, fontSize: 12, fontWeight: '700', color: CTA_TEAL, letterSpacing: 1.5, textAlign: 'center', marginBottom: 12, textTransform: 'uppercase' },
  sectionTitle: { fontFamily: SYSTEM_FONT, fontSize: 40, fontWeight: '800', color: TEXT_DARK, textAlign: 'center', marginBottom: 16, maxWidth: 800, alignSelf: 'center' },
  sectionTitleMobile: { fontSize: 30 },
  sectionDesc: { fontFamily: SYSTEM_FONT, fontSize: 18, color: TEXT_GRAY, textAlign: 'center', marginBottom: 50, maxWidth: 700, alignSelf: 'center', lineHeight: 28 },

  // Grid
  grid: { flexDirection: 'row', gap: 24, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 1200, alignSelf: 'center' },
  gridMobile: { flexDirection: 'column' },
  
  // Skill Cards (Dark Theme)
  skillCard: { flex: 1, minWidth: 260, maxWidth: 300, backgroundColor: 'rgba(255,255,255,0.05)', padding: 28, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  skillIconBox: { width: 64, height: 64, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  skillTitle: { fontFamily: SYSTEM_FONT, fontSize: 20, fontWeight: '700', color: 'white', marginBottom: 10 },
  skillDesc: { fontFamily: SYSTEM_FONT, fontSize: 14, color: '#aaa', lineHeight: 22, marginBottom: 20 },
  topicList: { gap: 10 },
  topicItem: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  topicText: { color: '#ddd', fontSize: 14, fontFamily: SYSTEM_FONT },

  // Blueprint
  blueprintContainer: { maxWidth: 800, alignSelf: 'center', width: '100%' },
  blueprintRow: { flexDirection: 'row', gap: 24, minHeight: 100 },
  blueprintLeft: { alignItems: 'center', width: 40 },
  blueprintDot: { width: 24, height: 24, borderRadius: 12, backgroundColor: CTA_TEAL, borderWidth: 4, borderColor: '#e0f2f2' },
  blueprintLine: { width: 2, flex: 1, backgroundColor: '#d0d0d0', marginTop: 4, marginBottom: 4 },
  blueprintRight: { flex: 1, paddingBottom: 40 },
  bpStep: { fontSize: 14, fontWeight: '700', color: CTA_TEAL, marginBottom: 4, textTransform: 'uppercase' },
  bpQuestion: { fontSize: 22, fontWeight: '700', color: TEXT_DARK, marginBottom: 12 },
  bpTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  bpTag: { backgroundColor: 'white', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
  bpTagText: { fontSize: 13, color: TEXT_GRAY, fontWeight: '500' },

  // Debug Cards
  debugGrid: { flexDirection: 'row', gap: 24, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 1100, alignSelf: 'center' },
  debugCard: { flex: 1, minWidth: 280, maxWidth: 500, backgroundColor: BG_CREAM, padding: 24, borderRadius: 16, borderWidth: 1, borderColor: '#e0e0e0' },
  debugSymptom: { fontSize: 18, fontWeight: '700', color: TEXT_DARK, marginBottom: 16 },
  debugDivider: { height: 1, backgroundColor: '#ddd', marginBottom: 16 },
  debugLabel: { fontSize: 12, fontWeight: '700', color: '#999', marginBottom: 4 },
  debugDiagnosis: { fontSize: 16, fontWeight: '600', color: ACCENT_PURPLE, marginBottom: 12 },
  debugFix: { fontSize: 15, color: TEXT_GRAY, lineHeight: 22 },

  // Mistakes
  mistakesList: { maxWidth: 800, alignSelf: 'center', width: '100%', gap: 20 },
  mistakeItem: { backgroundColor: 'white', padding: 24, borderRadius: 12, borderLeftWidth: 4, borderLeftColor: BRAND_ORANGE, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: {width: 0, height: 2} },
  mistakeHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  mistakeContext: { fontSize: 12, fontWeight: '700', color: BRAND_ORANGE, textTransform: 'uppercase' },
  mistakeTitle: { fontSize: 18, fontWeight: '700', color: TEXT_DARK, marginBottom: 12 },
  mistakeFix: { fontSize: 15, color: TEXT_GRAY, lineHeight: 24, backgroundColor: '#f9f9f9', padding: 12, borderRadius: 8 },

  // Stories
  storiesGrid: { flexDirection: 'row', gap: 24, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 1200, alignSelf: 'center' },
  storyCard: { flex: 1, minWidth: 300, maxWidth: 350, backgroundColor: 'rgba(255,255,255,0.05)', padding: 28, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  storyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  storyName: { fontSize: 18, fontWeight: '700', color: 'white' },
  storyRole: { fontSize: 14, color: '#aaa' },
  storyPackageBox: { backgroundColor: CTA_TEAL, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  storyPackage: { fontSize: 13, fontWeight: '700', color: 'white' },
  storyBg: { fontSize: 13, color: '#888', fontStyle: 'italic', marginBottom: 16 },
  storyQuote: { fontSize: 15, color: '#ddd', lineHeight: 24, marginBottom: 16 },
  stars: { flexDirection: 'row', gap: 4 },

  // Final CTA
  finalCta: { backgroundColor: 'white', paddingVertical: 80, paddingHorizontal: 24, alignItems: 'center' },
  finalCtaTitle: { fontSize: 42, fontWeight: '900', color: TEXT_DARK, marginBottom: 16, textAlign: 'center', maxWidth: 700 },
  finalCtaSubtitle: { fontSize: 18, color: TEXT_GRAY, textAlign: 'center', marginBottom: 32, maxWidth: 600, lineHeight: 28 },
  finalCtaBtn: { backgroundColor: DARK_BG, paddingHorizontal: 40, paddingVertical: 20, borderRadius: 100 },
  finalCtaBtnText: { color: 'white', fontSize: 17, fontWeight: '700' },
});
