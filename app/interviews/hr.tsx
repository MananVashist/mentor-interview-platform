// app/interviews/hr.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, useWindowDimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Head from 'expo-router/head';
import Svg, { Path, Circle, Rect, Line, Polyline, G } from 'react-native-svg';
import { BrandHeader } from '@/lib/BrandHeader';
import { Footer } from '@/components/Footer';

// --- THEME CONSTANTS ---
const BRAND_ORANGE = '#f58742';
const CTA_TEAL = '#18a7a7';
const BG_CREAM = '#f8f5f0';
const TEXT_DARK = '#222';
const TEXT_GRAY = '#555';
const ACCENT_INDIGO = '#4a69bd'; // Trust/Professionalism accent
const BG_SOFT_BLUE = '#f0f4f8';

const SYSTEM_FONT = Platform.select({
  web: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
  ios: "System",
  android: "Roboto",
  default: "System"
}) as string;

// --- SVG ICONS (HR SPECIFIC) ---

const PeopleIcon = ({ size = 48, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="People">
    <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="9" cy="7" r="4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M16 3.13a4 4 0 0 1 0 7.75" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const HandshakeIcon = ({ size = 48, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Partnership">
    <Path d="M20.354 5.646a2 2 0 0 0-2.708 0L9 14.293l-3.646-3.647a2 2 0 1 0-2.828 2.828l5 5a2 2 0 0 0 2.828 0l10-10a2 2 0 0 0 0-2.828z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M3.4 17.5l5.1 5.1" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const ShieldIcon = ({ size = 48, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Compliance">
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ScaleIcon = ({ size = 48, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Fairness">
    <Path d="M6 9h12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M12 3v18" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M6 9l-4 8h8l-4-8z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    <Path d="M18 9l-4 8h8l-4-8z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
  </Svg>
);

const ChartUpIcon = ({ size = 48, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Strategy">
    <Polyline points="23 6 13.5 15.5 8.5 10.5 1 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Polyline points="17 6 23 6 23 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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

export default function HRInterviews() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isSmall = width < 900;

  // --- CONTENT DATA (Derived from evaluation-templates.ts ID: 10) ---

  const hrDomains = [
    {
      title: "Talent Acquisition",
      icon: <PeopleIcon size={40} color={ACCENT_INDIGO} />,
      desc: "Funnel design, sourcing strategy, and closing candidates in a competitive market.",
      topics: [
        "Designing hiring funnels (Conversion rates)",
        "Closing strategies & counter-offers",
        "Pipeline diversity initiatives",
        "Candidate experience optimization",
        "Capacity planning & metrics (Time-to-Hire)"
      ],
      role: "Recruiters & TA Leads"
    },
    {
      title: "HR Business Partner (HRBP)",
      icon: <HandshakeIcon size={40} color={ACCENT_INDIGO} />,
      desc: "Strategic alignment, org design, and influencing leadership without authority.",
      topics: [
        "Org design & restructuring",
        "Change management (Layoffs/Mergers)",
        "Succession planning",
        "Coaching toxic high-performers",
        "Stakeholder influence mapping"
      ],
      role: "HRBPs & People Partners"
    },
    {
      title: "HR Operations & Compliance",
      icon: <ShieldIcon size={40} color={ACCENT_INDIGO} />,
      desc: "The backbone of HR: Payroll, policies, legal compliance, and HRIS systems.",
      topics: [
        "Payroll accuracy & audits",
        "Statutory compliance (Labor laws)",
        "HRIS implementation & data integrity",
        "Policy governance (POSH, Remote work)",
        "Scaling ops (0 to 1 vs 1 to 100)"
      ],
      role: "HR Ops & Generalists"
    },
    {
      title: "Centers of Excellence (COE)",
      icon: <ScaleIcon size={40} color={ACCENT_INDIGO} />,
      desc: "Deep specialization in Comp & Ben, L&D, or DEI strategies.",
      topics: [
        "Designing comp bands & equity",
        "Performance management frameworks",
        "L&D program ROI measurement",
        "DEI strategy rollout",
        "Employee engagement surveys"
      ],
      role: "Specialists"
    }
  ];

  // Situational Judgment Scenarios (SJT)
  const scenarios = [
    {
      title: "The Toxic High Performer",
      situation: "A VP of Sales hits 150% of quota but creates a toxic culture. Several team members have threatened to quit.",
      dilemma: "Do you fire the revenue generator or risk attrition?",
      keyCompetency: "Values vs. Performance",
      approach: "Separate behavior from results. Document incidents. Prioritize long-term culture over short-term revenue. Create a PIP for behavior."
    },
    {
      title: "The Counter-Offer War",
      situation: "Your top engineering candidate has a competing offer 30% higher than your budget cap.",
      dilemma: "Do you break the comp band or lose the candidate?",
      keyCompetency: "Closing & Internal Equity",
      approach: "Sell the 'Total Value' (Equity, Growth, Culture). Analyze internal equity risk. Only escalate if the ROI justifies breaking the band."
    },
    {
      title: "The Layoff leak",
      situation: "Rumors of a layoff have leaked. Morale is tanking, and top talent is interviewing elsewhere. The official announcement is 2 weeks away.",
      dilemma: "Do you deny it, confirm it, or stay silent?",
      keyCompetency: "Crisis Communication",
      approach: "Acknowledge the uncertainty without confirming specifics. Accelerate the timeline if possible. Equip managers with talking points."
    }
  ];

  const commonMistakes = [
    {
      mistake: "Being the 'Employee Union' or 'Management Puppet'",
      fix: "Great HR balances business goals with employee advocacy. You are a strategic partner, not just a confidant or an enforcer. Always tie decisions back to business impact."
    },
    {
      mistake: "Failing to use Data",
      fix: "Don't say 'morale is low'. Say 'Attrition spiked 15% and eNPS dropped 20 points'. Quantify the problem to get leadership buy-in."
    },
    {
      mistake: "Being too 'Policy-Driven' in Grey Areas",
      fix: "Policies are guardrails, not walls. Show judgment. 'While the policy says X, in this specific context, Y is the fairer outcome because...'"
    },
    {
      mistake: "Weakness in Conflict Resolution",
      fix: "Avoid saying 'I would escalate to their manager'. Show how YOU mediated the dialogue, removed bias, and reached a resolution independently."
    }
  ];

  const successStories = [
    {
      name: "Anjali P.",
      role: "HRBP @ Flipkart",
      bg: "Ex-Recruiter",
      quote: "The transition from TA to HRBP is tough. The mock interviews helped me master 'Org Design' and 'Change Management' questions. I learned to speak the language of business, not just hiring.",
      impact: "Managed 400+ org"
    },
    {
      name: "David L.",
      role: "Head of People @ Series B Startup",
      bg: "HR Generalist",
      quote: "I had to build the HR function from scratch. Practicing the 'HR Ops' track helped me design a scalable compliance and payroll roadmap that impressed the Founders.",
      impact: "Scaled 20 -> 150"
    },
    {
      name: "Meera K.",
      role: "Talent Acquisition Lead @ Swiggy",
      bg: "Agency Recruiter",
      quote: "My mentor drilled me on 'Funnel Metrics' and 'Capacity Planning'. I stopped answering with feelings and started answering with conversion rates. That got me the job.",
      impact: "Hired 50 Eng/Qtr"
    }
  ];

  return (
    <>
      <Head>
        <title>HR & People Ops Interview Prep | HRBP, TA & Generalist</title>
        <meta name="description" content="Master Human Resources interviews. Practice situational judgment, org design, talent acquisition strategies, and behavioral questions with HR leaders from top tech companies." />
        <meta name="keywords" content="HR interview questions, HRBP interview, talent acquisition strategy, people ops interview, behavioral interview prep, situational judgment test, SHRM" />
        <link rel="canonical" href="https://crackjobs.com/interviews/hr" />
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

          {/* HERO SECTION */}
          <View style={[styles.hero, isSmall && styles.heroMobile]}>
            <View style={styles.badge}><Text style={styles.badgeText}>🤝 HR & PEOPLE OPERATIONS</Text></View>
            <Text style={[styles.heroTitle, isSmall && styles.heroTitleMobile]}>
              Be the <Text style={{ color: ACCENT_INDIGO }}>Strategic Partner</Text> Companies Need
            </Text>
            <Text style={[styles.heroSubtitle, isSmall && styles.heroSubtitleMobile]}>
              Move beyond "personnel management". Master Org Design, Talent Strategy, Crisis Management, and Data-Driven HR with expert mentors.
            </Text>
            
            <View style={styles.heroStats}>
              <View style={styles.statItem}>
                <Text style={styles.statVal}>₹15-50L</Text>
                <Text style={styles.statLabel}>Salary Range</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statVal}>Situational</Text>
                <Text style={styles.statLabel}>Key Interview Type</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statVal}>4-5</Text>
                <Text style={styles.statLabel}>Rounds</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.ctaBtn} onPress={() => router.push('/auth/sign-up')}>
              <Text style={styles.ctaBtnText}>Find an HR Mentor →</Text>
            </TouchableOpacity>
          </View>

          {/* 4 DOMAINS GRID */}
          <View style={[styles.section, { backgroundColor: 'white' }]}>
            <Text style={[styles.sectionLabel, { color: ACCENT_INDIGO }]}>CAREER TRACKS</Text>
            <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}>
              Choose Your Specialization
            </Text>
            <Text style={styles.sectionDesc}>
              HR is not one-size-fits-all. Our mock interviews are tailored to your specific career path.
            </Text>

            <View style={[styles.grid, isSmall && styles.gridMobile]}>
              {hrDomains.map((domain, i) => (
                <View key={i} style={styles.domainCard}>
                  <View style={styles.domainHeader}>
                    {domain.icon}
                    <Text style={styles.domainRole}>{domain.role}</Text>
                  </View>
                  <Text style={styles.domainTitle}>{domain.title}</Text>
                  <Text style={styles.domainDesc}>{domain.desc}</Text>
                  <View style={styles.topicList}>
                    {domain.topics.map((t, j) => (
                      <View key={j} style={styles.topicItem}>
                        <CheckCircleIcon size={14} color={ACCENT_INDIGO} />
                        <Text style={styles.topicText}>{t}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* SITUATIONAL JUDGMENT LIBRARY */}
          <View style={[styles.section, { backgroundColor: BG_SOFT_BLUE }]}>
            <Text style={styles.sectionLabel}>SITUATIONAL JUDGMENT</Text>
            <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}>
              What Would You Do?
            </Text>
            <Text style={styles.sectionDesc}>
              Behavioral questions are 60% of the HR interview. Test your judgment against these real-world scenarios.
            </Text>

            <View style={styles.scenarioContainer}>
              {scenarios.map((scen, i) => (
                <View key={i} style={styles.scenarioCard}>
                  <View style={styles.scenarioHeader}>
                    <Text style={styles.scenarioTitle}>{scen.title}</Text>
                    <View style={styles.competencyBadge}>
                      <Text style={styles.competencyText}>{scen.keyCompetency}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.scenarioBody}>
                    <Text style={styles.scenarioLabel}>THE SITUATION:</Text>
                    <Text style={styles.scenarioText}>{scen.situation}</Text>
                    
                    <Text style={styles.scenarioLabel}>THE DILEMMA:</Text>
                    <Text style={styles.scenarioText}>{scen.dilemma}</Text>
                  </View>

                  <View style={styles.scenarioFooter}>
                    <Text style={styles.scenarioApproachLabel}>RECOMMENDED APPROACH:</Text>
                    <Text style={styles.scenarioApproach}>{scen.approach}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* COMMON MISTAKES */}
          <View style={[styles.section, { backgroundColor: 'white' }]}>
            <Text style={[styles.sectionLabel, { color: BRAND_ORANGE }]}>RED FLAGS</Text>
            <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}>
              Why HR Candidates Get Rejected
            </Text>
            
            <View style={styles.mistakesList}>
              {commonMistakes.map((m, i) => (
                <View key={i} style={styles.mistakeItem}>
                  <View style={styles.mistakeHeader}>
                    <AlertTriangleIcon size={24} color={BRAND_ORANGE} />
                    <Text style={styles.mistakeTitle}>Mistake #{i+1}: {m.mistake}</Text>
                  </View>
                  <Text style={styles.mistakeFix}>✅ <Text style={{fontWeight: '700'}}>The Fix:</Text> {m.fix}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* SUCCESS STORIES */}
          <View style={[styles.section, { backgroundColor: BG_CREAM }]}>
             <Text style={[styles.sectionLabel, { color: ACCENT_INDIGO }]}>COMMUNITY WINS</Text>
             <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}>
               Landed Offers at Top Companies
             </Text>
             
             <View style={[styles.storiesGrid, isSmall && styles.gridMobile]}>
               {successStories.map((story, i) => (
                 <View key={i} style={styles.storyCard}>
                   <View style={styles.storyHeader}>
                     <View>
                       <Text style={styles.storyName}>{story.name}</Text>
                       <Text style={styles.storyRole}>{story.role}</Text>
                     </View>
                     <View style={styles.stars}>
                        {[1,2,3,4,5].map(s => <StarIcon key={s} size={14} color="#FFD700" />)}
                     </View>
                   </View>
                   <Text style={styles.storyBg}>{story.bg} • {story.impact}</Text>
                   <Text style={styles.storyQuote}>"{story.quote}"</Text>
                 </View>
               ))}
             </View>
          </View>

          {/* METRICS DASHBOARD (Visual Element) */}
          <View style={styles.metricsBanner}>
             <View style={styles.metricsContent}>
                <ChartUpIcon size={40} color="white" />
                <View style={{flex: 1}}>
                  <Text style={styles.metricsTitle}>Speak the Language of Data</Text>
                  <Text style={styles.metricsText}>
                    Top HR leaders don't just use empathy; they use metrics. Learn to define and track:
                    {"\n"}• <Text style={{fontWeight: '700'}}>Time-to-Hire & Cost-per-Hire</Text>
                    {"\n"}• <Text style={{fontWeight: '700'}}>Attrition Rate (Regrettable vs Non-regrettable)</Text>
                    {"\n"}• <Text style={{fontWeight: '700'}}>eNPS & Engagement Scores</Text>
                  </Text>
                </View>
             </View>
          </View>

          {/* FINAL CTA */}
          <View style={styles.finalCta}>
            <Text style={[styles.finalCtaTitle, isSmall && { fontSize: 32 }]}>
              Ready to Ace Your HR Interview?
            </Text>
            <Text style={styles.finalCtaSubtitle}>
              Practice with HR leaders who have hired for Google, Flipkart, and Swiggy.
            </Text>
            <TouchableOpacity style={styles.finalCtaBtn} onPress={() => router.push('/auth/sign-up')}>
              <Text style={styles.finalCtaBtnText}>Book a Mock Interview →</Text>
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

  // Hero
  hero: { maxWidth: 1000, width: '100%', alignSelf: 'center', paddingHorizontal: 24, paddingVertical: 80, alignItems: 'center', backgroundColor: 'white', borderRadius: 30, marginTop: 20, marginBottom: 20, borderWidth: 1, borderColor: '#eee' },
  heroMobile: { paddingVertical: 40, borderRadius: 0, marginTop: 0, borderWidth: 0 },
  badge: { backgroundColor: '#eef2ff', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginBottom: 24, borderWidth: 1, borderColor: ACCENT_INDIGO },
  badgeText: { color: ACCENT_INDIGO, fontWeight: '700', fontSize: 12, letterSpacing: 1 },
  heroTitle: { fontFamily: SYSTEM_FONT, fontWeight: '900', fontSize: 56, color: TEXT_DARK, lineHeight: 62, textAlign: 'center', marginBottom: 24 },
  heroTitleMobile: { fontSize: 36, lineHeight: 42 },
  heroSubtitle: { fontFamily: SYSTEM_FONT, fontSize: 18, color: TEXT_GRAY, lineHeight: 28, textAlign: 'center', marginBottom: 40, maxWidth: 700 },
  heroSubtitleMobile: { fontSize: 16 },
  heroStats: { flexDirection: 'row', gap: 40, marginBottom: 40, flexWrap: 'wrap', justifyContent: 'center' },
  statItem: { alignItems: 'center' },
  statVal: { fontSize: 32, fontWeight: '800', color: ACCENT_INDIGO, marginBottom: 4 },
  statLabel: { fontSize: 13, color: TEXT_GRAY, fontFamily: SYSTEM_FONT },
  ctaBtn: { backgroundColor: ACCENT_INDIGO, paddingHorizontal: 40, paddingVertical: 18, borderRadius: 100 },
  ctaBtnText: { fontFamily: SYSTEM_FONT, fontSize: 16, fontWeight: '700', color: 'white' },

  // Section Common
  section: { paddingVertical: 80, paddingHorizontal: 24 },
  sectionLabel: { fontFamily: SYSTEM_FONT, fontSize: 12, fontWeight: '700', color: ACCENT_INDIGO, letterSpacing: 1.5, textAlign: 'center', marginBottom: 12, textTransform: 'uppercase' },
  sectionTitle: { fontFamily: SYSTEM_FONT, fontSize: 40, fontWeight: '800', color: TEXT_DARK, textAlign: 'center', marginBottom: 16, maxWidth: 800, alignSelf: 'center' },
  sectionTitleMobile: { fontSize: 30 },
  sectionDesc: { fontFamily: SYSTEM_FONT, fontSize: 18, color: TEXT_GRAY, textAlign: 'center', marginBottom: 50, maxWidth: 700, alignSelf: 'center', lineHeight: 28 },

  // Domain Grid
  grid: { flexDirection: 'row', gap: 24, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 1200, alignSelf: 'center' },
  gridMobile: { flexDirection: 'column' },
  domainCard: { flex: 1, minWidth: 280, maxWidth: 500, backgroundColor: BG_CREAM, padding: 32, borderRadius: 20, borderWidth: 1, borderColor: '#e5e5e5' },
  domainHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  domainRole: { fontSize: 12, fontWeight: '700', color: ACCENT_INDIGO, textTransform: 'uppercase', backgroundColor: '#eef2ff', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  domainTitle: { fontFamily: SYSTEM_FONT, fontSize: 22, fontWeight: '700', color: TEXT_DARK, marginBottom: 10 },
  domainDesc: { fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_GRAY, lineHeight: 24, marginBottom: 24 },
  topicList: { gap: 10 },
  topicItem: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  topicText: { color: TEXT_DARK, fontSize: 14, fontFamily: SYSTEM_FONT },

  // Scenario Cards
  scenarioContainer: { maxWidth: 900, alignSelf: 'center', width: '100%', gap: 24 },
  scenarioCard: { backgroundColor: 'white', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#ddd', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: {width: 0, height: 4} },
  scenarioHeader: { backgroundColor: TEXT_DARK, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  scenarioTitle: { color: 'white', fontSize: 18, fontWeight: '700' },
  competencyBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
  competencyText: { color: 'white', fontSize: 12, fontWeight: '600' },
  scenarioBody: { padding: 24 },
  scenarioLabel: { fontSize: 12, fontWeight: '700', color: '#999', marginBottom: 6 },
  scenarioText: { fontSize: 16, color: TEXT_DARK, lineHeight: 24, marginBottom: 20 },
  scenarioFooter: { backgroundColor: '#f9f9f9', padding: 24, borderTopWidth: 1, borderTopColor: '#eee' },
  scenarioApproachLabel: { fontSize: 12, fontWeight: '700', color: ACCENT_INDIGO, marginBottom: 6 },
  scenarioApproach: { fontSize: 15, color: TEXT_GRAY, fontStyle: 'italic', lineHeight: 22 },

  // Mistakes
  mistakesList: { maxWidth: 800, alignSelf: 'center', width: '100%', gap: 20 },
  mistakeItem: { backgroundColor: BG_CREAM, padding: 24, borderRadius: 12, borderLeftWidth: 4, borderLeftColor: BRAND_ORANGE },
  mistakeHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  mistakeTitle: { fontSize: 18, fontWeight: '700', color: TEXT_DARK },
  mistakeFix: { fontSize: 15, color: TEXT_GRAY, lineHeight: 24, marginTop: 8 },

  // Success Stories
  storiesGrid: { flexDirection: 'row', gap: 24, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 1200, alignSelf: 'center' },
  storyCard: { flex: 1, minWidth: 300, maxWidth: 350, backgroundColor: 'white', padding: 28, borderRadius: 20, borderWidth: 1, borderColor: '#e5e5e5' },
  storyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  storyName: { fontSize: 18, fontWeight: '700', color: TEXT_DARK },
  storyRole: { fontSize: 14, color: TEXT_GRAY },
  storyBg: { fontSize: 13, color: ACCENT_INDIGO, fontWeight: '600', marginBottom: 16 },
  storyQuote: { fontSize: 15, color: TEXT_DARK, lineHeight: 24, fontStyle: 'italic' },
  stars: { flexDirection: 'row', gap: 4 },

  // Metrics Banner
  metricsBanner: { maxWidth: 1000, alignSelf: 'center', width: '90%', backgroundColor: ACCENT_INDIGO, borderRadius: 20, padding: 32, marginVertical: 40 },
  metricsContent: { flexDirection: 'row', gap: 24, alignItems: 'flex-start' },
  metricsTitle: { fontSize: 24, fontWeight: '700', color: 'white', marginBottom: 12 },
  metricsText: { fontSize: 16, color: 'white', lineHeight: 26, opacity: 0.9 },

  // Final CTA
  finalCta: { backgroundColor: TEXT_DARK, paddingVertical: 80, paddingHorizontal: 24, alignItems: 'center' },
  finalCtaTitle: { fontSize: 42, fontWeight: '900', color: 'white', marginBottom: 16, textAlign: 'center', maxWidth: 700 },
  finalCtaSubtitle: { fontSize: 18, color: '#ccc', textAlign: 'center', marginBottom: 32, maxWidth: 600, lineHeight: 28 },
  finalCtaBtn: { backgroundColor: ACCENT_INDIGO, paddingHorizontal: 40, paddingVertical: 20, borderRadius: 100 },
  finalCtaBtnText: { color: 'white', fontSize: 17, fontWeight: '700' },
});
