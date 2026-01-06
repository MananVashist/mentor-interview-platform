// app/interviews/data-analytics.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, useWindowDimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Head from 'expo-router/head';
import Svg, { Path, Circle, Rect, Line, Polyline } from 'react-native-svg';
import { BrandHeader } from '@/lib/BrandHeader';
import { Footer } from '@/components/Footer';

const BRAND_ORANGE = '#f58742';
const CTA_TEAL = '#18a7a7';
const BG_CREAM = '#f8f5f0';
const TEXT_DARK = '#222';
const TEXT_GRAY = '#555';
const SQL_BG = '#f4f7fa';
const CODE_TEXT = '#2c3e50';

const SYSTEM_FONT = Platform.select({
  web: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
  ios: "System",
  android: "Roboto",
  default: "System"
}) as string;

// SVG Icons - Analytics Focused
const DatabaseIcon = ({ size = 48, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Database">
    <Path d="M12 2c4.97 0 9 1.79 9 4v12c0 2.21-4.03 4-9 4s-9-1.79-9-4V6c0-2.21 4.03-4 9-4z" stroke={color} strokeWidth="2" />
    <Path d="M21 12c0 2.21-4.03 4-9 4s-9-1.79-9-4M21 6v12" stroke={color} strokeWidth="2" />
  </Svg>
);

const BarChartIcon = ({ size = 48, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Bar Chart">
    <Line x1="12" y1="20" x2="12" y2="10" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Line x1="18" y1="20" x2="18" y2="4" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Line x1="6" y1="20" x2="6" y2="16" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const TrendUpIcon = ({ size = 48, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Trend">
    <Polyline points="23 6 13.5 15.5 8.5 10.5 1 18" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <Polyline points="17 6 23 6 23 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const MessageIcon = ({ size = 48, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Communication">
    <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CheckCircleIcon = ({ size = 18, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Check">
    <Circle cx="12" cy="12" r="10" fill={color} />
    <Path d="M7 12l3.5 3.5 6.5-7" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
  </Svg>
);

const StarIcon = ({ size = 16, color = "#FFD700" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} accessibilityLabel="Star">
    <Path d="M12 2l2.4 7.4h7.8l-6.3 4.6 2.4 7.4L12 16.8l-6.3 4.6 2.4-7.4L1.8 9.4h7.8z" />
  </Svg>
);

const AlertTriangleIcon = ({ size = 28, color = BRAND_ORANGE }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Warning">
    <Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Line x1="12" y1="9" x2="12" y2="13" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Circle cx="12" cy="17" r="1" fill={color} />
  </Svg>
);

const BookOpenIcon = ({ size = 28, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Book">
    <Path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const LayersIcon = ({ size = 32, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Layers">
    <Path d="M12 2L2 7l10 5 10-5-10-5z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const PieChartIcon = ({ size = 32, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Pie Chart">
    <Path d="M21.21 15.89A10 10 0 1 1 8 2.83" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M22 12A10 10 0 0 0 12 2v10z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default function DataAnalyticsInterviews() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isSmall = width < 900;

  // Core DA Skills from Evaluation Templates
  const coreSkills = [
    {
      name: "SQL & Data Manipulation",
      icon: <DatabaseIcon size={44} color={CTA_TEAL} />,
      description: "Master complex queries, joins, window functions, and CTEs",
      topics: [
        "Complex JOINs (INNER, LEFT, FULL, CROSS, SELF)",
        "Window functions (ROW_NUMBER, RANK, LAG/LEAD)",
        "CTEs and subqueries for readability",
        "Query optimization and performance tuning",
        "Handling NULLs, duplicates, and edge cases"
      ],
      difficulty: "Foundation - 40% of interviews"
    },
    {
      name: "Business Analysis & Metrics",
      icon: <TrendUpIcon size={44} color={CTA_TEAL} />,
      description: "Translate business questions into data insights",
      topics: [
        "Root cause analysis for metric changes",
        "A/B test design and statistical significance",
        "Funnel analysis and conversion optimization",
        "Cohort analysis and retention metrics",
        "ROI calculation and cost-benefit analysis"
      ],
      difficulty: "Critical - 30% of interviews"
    },
    {
      name: "Visualization & Dashboards",
      icon: <BarChartIcon size={44} color={CTA_TEAL} />,
      description: "Design impactful dashboards that drive decisions",
      topics: [
        "Chart type selection (bar, line, scatter, heatmap)",
        "Dashboard layout and information hierarchy",
        "Avoiding misleading visualizations",
        "Tableau, Power BI, Looker proficiency",
        "Executive summary design"
      ],
      difficulty: "Important - 20% of interviews"
    },
    {
      name: "Communication & Stakeholders",
      icon: <MessageIcon size={44} color={CTA_TEAL} />,
      description: "Present complex findings to non-technical audiences",
      topics: [
        "BLUF (Bottom Line Up Front) structure",
        "Translating jargon into business language",
        "Handling questions and pushback",
        "Managing stakeholder expectations",
        "Storytelling with data"
      ],
      difficulty: "Essential - 10% of interviews"
    }
  ];

  // SQL Challenge Examples
  const sqlChallenges = [
    {
      difficulty: "Medium",
      question: "Find the second highest salary from an Employees table",
      concept: "Subqueries, LIMIT/OFFSET",
      sql: `SELECT MAX(salary) as second_highest
FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);`,
      explanation: "Use subquery to exclude the max, then find the next max"
    },
    {
      difficulty: "Hard",
      question: "Calculate 7-day rolling average of daily active users",
      concept: "Window functions, DATE functions",
      sql: `SELECT 
  date,
  COUNT(DISTINCT user_id) as dau,
  AVG(COUNT(DISTINCT user_id)) OVER (
    ORDER BY date 
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) as rolling_7day_avg
FROM user_events
GROUP BY date;`,
      explanation: "Window function with ROWS BETWEEN for rolling calculations"
    },
    {
      difficulty: "Hard",
      question: "Find users who made purchases in consecutive months",
      concept: "Self-joins, LAG/LEAD, date arithmetic",
      sql: `WITH monthly_purchases AS (
  SELECT DISTINCT
    user_id,
    DATE_TRUNC('month', purchase_date) as month
  FROM purchases
)
SELECT DISTINCT a.user_id
FROM monthly_purchases a
JOIN monthly_purchases b 
  ON a.user_id = b.user_id
  AND b.month = a.month + INTERVAL '1 month';`,
      explanation: "Self-join to compare consecutive months for each user"
    }
  ];

  // Interview Question Types
  const questionTypes = [
    {
      type: "SQL Technical",
      weight: "40%",
      icon: <DatabaseIcon size={28} color={CTA_TEAL} />,
      examples: [
        "Write a query to find top 10 products by revenue",
        "Calculate month-over-month growth rate",
        "Identify duplicate records and keep most recent",
        "Find users who haven't logged in for 30 days"
      ]
    },
    {
      type: "Business Case",
      weight: "30%",
      icon: <TrendUpIcon size={28} color={CTA_TEAL} />,
      examples: [
        "Revenue dropped 15% last week. Investigate.",
        "Design metrics for a new product launch",
        "Recommend features to improve retention",
        "Analyze A/B test results and make recommendation"
      ]
    },
    {
      type: "Dashboard Design",
      weight: "20%",
      icon: <PieChartIcon size={28} color={CTA_TEAL} />,
      examples: [
        "Design executive dashboard for e-commerce",
        "Create real-time operations dashboard",
        "Build customer health scorecard",
        "Design funnel visualization for conversion"
      ]
    },
    {
      type: "Communication",
      weight: "10%",
      icon: <MessageIcon size={28} color={CTA_TEAL} />,
      examples: [
        "Explain p-value to non-technical VP",
        "Present findings where deadline was missed",
        "Convince PM their feature idea is failing",
        "Handle conflicting data between reports"
      ]
    }
  ];

  // Success Stories with Business Impact
  const successStories = [
    {
      name: "Priya D.",
      company: "Amazon",
      role: "Data Analyst",
      outcome: "₹28L Package",
      impact: "Saved $2M annually",
      quote: "Amazon asked: 'How would you reduce shipping costs?' I wrote SQL to segment orders by route, distance, and carrier. Found 18% of orders were mis-routed. Showed the query, explained the business impact. They loved the practical approach.",
      rating: 5,
      sessions: 5
    },
    {
      name: "Aditya S.",
      company: "Flipkart",
      role: "Business Analyst",
      outcome: "₹22L Package",
      impact: "15% conversion increase",
      quote: "CrackJobs taught me to think business-first, not query-first. When Flipkart asked about cart abandonment, I structured my answer: hypothesis → SQL to test → visualization → recommendation. Got 'Strong Hire' from interviewer.",
      rating: 5,
      sessions: 7
    },
    {
      name: "Kavya R.",
      company: "Swiggy",
      role: "Data Analyst",
      outcome: "₹25L Package",
      impact: "22% delivery time reduction",
      quote: "The case study was brutal—optimize delivery zones. I sketched a dashboard on paper, wrote SQL for distance+demand segmentation, quantified impact. Interviewer said it was the most complete answer they'd seen.",
      rating: 5,
      sessions: 6
    }
  ];

  // Common SQL Mistakes
  const commonMistakes = [
    {
      mistake: "Writing queries without clarifying data assumptions first",
      why: "Shows lack of real-world data awareness",
      fix: "Always ask: Are there duplicates? How are NULLs handled? Date range? Data quality issues? Example: 'Before writing SQL, I'd confirm if user_id is unique or if one user can have multiple rows.'",
      sqlBad: "-- Assumes user_id is unique\nSELECT user_id, COUNT(*) FROM orders;",
      sqlGood: "-- Handles potential duplicates\nSELECT user_id, COUNT(DISTINCT order_id) \nFROM orders\nGROUP BY user_id;"
    },
    {
      mistake: "Not explaining SQL logic while writing queries",
      why: "Interviewers want to see your thought process",
      fix: "Think out loud: 'I'm using LEFT JOIN here because we want all users, even those without orders. I'll use COALESCE to handle NULLs as zeros.' This shows reasoning, not just syntax.",
      sqlBad: null,
      sqlGood: null
    },
    {
      mistake: "Jumping to analysis without exploring data distribution",
      why: "Leads to wrong conclusions from outliers or skewed data",
      fix: "Start with: 'Let me first check data distribution, look for outliers, and segment by key dimensions.' Show methodical thinking: median vs mean, percentiles, date ranges.",
      sqlBad: null,
      sqlGood: "-- Always check distribution first\nSELECT \n  MIN(revenue), MAX(revenue),\n  AVG(revenue), MEDIAN(revenue),\n  PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY revenue)\nFROM orders;"
    },
    {
      mistake: "Presenting insights without making them actionable",
      why: "Data analysis must drive decisions, not just describe data",
      fix: "Always end with 'So what?' Example: 'Based on 15% retention drop in Week 1, I recommend we focus on onboarding by implementing email reminders and tutorial improvements. Expected impact: 8-10% retention recovery.'",
      sqlBad: null,
      sqlGood: null
    },
    {
      mistake: "Using technical jargon without translating to business impact",
      why: "Stakeholders care about outcomes, not statistics",
      fix: "Don't say: 'p-value is 0.03.' Say: 'We're 97% confident this increase is real, not random. This means we should roll out the feature to all users immediately because it will likely increase revenue by 12%.'",
      sqlBad: null,
      sqlGood: null
    }
  ];

  // Tools & Technologies
  const tools = [
    { category: "SQL Databases", items: ["PostgreSQL", "MySQL", "Snowflake", "BigQuery", "Redshift"] },
    { category: "Visualization", items: ["Tableau", "Power BI", "Looker", "Metabase", "Google Data Studio"] },
    { category: "Languages", items: ["SQL (primary)", "Python (pandas, numpy)", "R (optional)", "Excel (advanced)"] },
    { category: "Other Skills", items: ["Git version control", "Statistical testing", "Data modeling", "ETL concepts"] }
  ];

  // Preparation Timeline
  const prepTimeline = [
    {
      week: "Week 1-2",
      focus: "SQL Fundamentals",
      icon: <DatabaseIcon size={26} color={CTA_TEAL} />,
      goals: [
        "Master JOINs: practice 20+ join problems",
        "Learn window functions (ROW_NUMBER, RANK, LAG/LEAD)",
        "Practice CTEs for query readability",
        "Solve 30+ LeetCode SQL problems (Easy → Medium)"
      ]
    },
    {
      week: "Week 3-4",
      focus: "Advanced SQL & Stats",
      icon: <LayersIcon size={26} color={CTA_TEAL} />,
      goals: [
        "Master complex window functions and partitioning",
        "Learn query optimization (indexes, execution plans)",
        "Understand statistical significance and p-values",
        "Practice A/B test analysis with SQL"
      ]
    },
    {
      week: "Week 5-6",
      focus: "Business Cases",
      icon: <TrendUpIcon size={26} color={CTA_TEAL} />,
      goals: [
        "Practice translating business questions to SQL",
        "Master root cause analysis frameworks",
        "Learn to define and track KPIs",
        "Practice funnel and cohort analysis"
      ]
    },
    {
      week: "Week 7-8",
      focus: "Dashboards & Communication",
      icon: <BarChartIcon size={26} color={CTA_TEAL} />,
      goals: [
        "Design 5+ dashboards for different stakeholders",
        "Practice presenting to non-technical audiences",
        "Learn to handle questions and pushback",
        "Build portfolio of analysis case studies"
      ]
    }
  ];

  return (
    <>
      <Head>
        <title>Data Analyst Interview Prep | Master SQL, Business Analytics & Dashboards</title>
        <meta name="description" content="Ace Data Analyst interviews at Amazon, Flipkart, Swiggy with expert mentors. Master SQL queries, business case analysis, dashboard design, and stakeholder communication. Practice real interview questions." />
        <meta name="keywords" content="data analyst interview, SQL interview questions, business analytics, data analysis, dashboard design, Tableau, Power BI, SQL joins, window functions, A/B testing, data visualization, business intelligence" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://crackjobs.com/interviews/data-analytics" />
        <meta property="og:title" content="Data Analyst Interview Preparation | CrackJobs" />
        <meta property="og:description" content="Master SQL, business analytics, and dashboard design with expert data analysts from top companies." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://crackjobs.com/interviews/data-analytics" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Data Analyst Interview Preparation | CrackJobs" />
        <meta name="twitter:description" content="Master SQL, business analytics, and dashboard design." />
      </Head>

      <View style={styles.container}>
        <ScrollView style={styles.scrollContent} accessibilityRole="main">
          
          {/* Header */}
          <View style={styles.header} accessibilityRole="navigation" accessibilityLabel="Main navigation">
            <View style={[styles.headerInner, isSmall && styles.headerInnerMobile]}>
              <BrandHeader style={{ marginBottom: 0 }} small={isSmall} />
              <View style={[styles.navRight, isSmall && styles.navRightMobile]}>
                <TouchableOpacity onPress={() => router.push('/auth/sign-in')} accessibilityRole="link" accessibilityLabel="Log in">
                  <Text style={styles.navLinkText}>Log in</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnSmall} onPress={() => router.push('/auth/sign-up')} accessibilityRole="button" accessibilityLabel="Get Started">
                  <Text style={styles.btnSmallText}>Get Started</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Hero */}
          <View style={[styles.hero, isSmall && styles.heroMobile]} accessibilityRole="region" accessibilityLabel="Hero section">
            <View style={styles.badge}><Text style={styles.badgeText}>📊 DATA ANALYTICS INTERVIEWS</Text></View>
            <Text style={[styles.heroTitle, isSmall && styles.heroTitleMobile]} accessibilityRole="header" accessibilityLevel={1}>
              Turn Data Into Business Decisions
            </Text>
            <Text style={[styles.heroSubtitle, isSmall && styles.heroSubtitleMobile]}>
              Master SQL, business case analysis, dashboard design, and data storytelling with analysts from Amazon, Flipkart, Swiggy. Practice real interview questions with structured feedback.
            </Text>
            <View style={styles.heroStats}>
              <View style={styles.stat}><Text style={styles.statValue}>₹12-35L</Text><Text style={styles.statLabel}>Salary Range</Text></View>
              <View style={styles.stat}><Text style={styles.statValue}>SQL</Text><Text style={styles.statLabel}>Primary Skill</Text></View>
              <View style={styles.stat}><Text style={styles.statValue}>3-5</Text><Text style={styles.statLabel}>Interview Rounds</Text></View>
              <View style={styles.stat}><Text style={styles.statValue}>6-8 weeks</Text><Text style={styles.statLabel}>Prep Timeline</Text></View>
            </View>
            <TouchableOpacity style={styles.ctaBtn} onPress={() => router.push('/auth/sign-up')} accessibilityRole="button" accessibilityLabel="Browse Analyst Mentors">
              <Text style={styles.ctaBtnText}>Browse Analyst Mentors →</Text>
            </TouchableOpacity>
          </View>

          {/* Core Skills */}
          <View style={[styles.section, { backgroundColor: 'white' }]} accessibilityRole="region">
            <Text style={styles.sectionLabel} accessibilityRole="header" accessibilityLevel={2}>4 CORE SKILL AREAS</Text>
            <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}>What Companies Test in Data Analyst Interviews</Text>
            <Text style={styles.sectionDesc}>Based on 500+ analyst interview evaluations. Master these 4 areas to pass any DA interview.</Text>
            {coreSkills.map((skill, i) => (
              <View key={i} style={styles.skillCard}>
                <View style={styles.skillHeader}>
                  {skill.icon}
                  <View style={styles.skillHeaderText}>
                    <Text style={styles.skillName}>{skill.name}</Text>
                    <Text style={styles.skillDesc}>{skill.description}</Text>
                    <Text style={styles.skillDifficulty}>{skill.difficulty}</Text>
                  </View>
                </View>
                <View style={styles.skillTopics}>
                  {skill.topics.map((topic, j) => (
                    <View key={j} style={styles.topicItem}>
                      <CheckCircleIcon size={16} color={CTA_TEAL} />
                      <Text style={styles.topicText}>{topic}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>

          {/* SQL Challenges */}
          <View style={[styles.section, { backgroundColor: BG_CREAM }]} accessibilityRole="region">
            <Text style={styles.sectionLabel}>SQL CHALLENGE LIBRARY</Text>
            <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}>Common SQL Patterns in Analyst Interviews</Text>
            <Text style={styles.sectionDesc}>These SQL patterns appear in 80% of analyst interviews. Master them to ace the technical round.</Text>
            {sqlChallenges.map((challenge, i) => (
              <View key={i} style={styles.sqlCard}>
                <View style={styles.sqlHeader}>
                  <Text style={styles.sqlDifficulty}>{challenge.difficulty}</Text>
                  <Text style={styles.sqlConcept}>Concept: {challenge.concept}</Text>
                </View>
                <Text style={styles.sqlQuestion}>{challenge.question}</Text>
                <View style={styles.sqlCodeBlock}>
                  <Text style={styles.sqlCodeLabel}>Solution:</Text>
                  <View style={styles.sqlCode}>
                    <Text style={styles.sqlCodeText}>{challenge.sql}</Text>
                  </View>
                </View>
                <View style={styles.sqlExplanation}>
                  <Text style={styles.sqlExplanationLabel}>💡 Explanation:</Text>
                  <Text style={styles.sqlExplanationText}>{challenge.explanation}</Text>
                </View>
              </View>
            ))}
            <View style={styles.sqlTip}>
              <Text style={styles.sqlTipText}>
                💡 <Text style={styles.bold}>Interview Tip:</Text> Always explain your SQL logic out loud. Say: "I'm using LEFT JOIN because we want all users, even those without orders. I'll use COALESCE to handle NULLs as zeros."
              </Text>
            </View>
          </View>

          {/* Question Types */}
          <View style={[styles.section, { backgroundColor: 'white' }]} accessibilityRole="region">
            <Text style={styles.sectionLabel}>INTERVIEW BREAKDOWN</Text>
            <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}>4 Types of Questions You'll Face</Text>
            <Text style={styles.sectionDesc}>Understanding the question mix helps you prepare strategically. Each type requires different skills.</Text>
            <View style={[styles.questionTypesGrid, isSmall && styles.questionTypesGridMobile]}>
              {questionTypes.map((type, i) => (
                <View key={i} style={styles.questionTypeCard}>
                  {type.icon}
                  <Text style={styles.questionTypeWeight}>{type.weight}</Text>
                  <Text style={styles.questionTypeName}>{type.type}</Text>
                  <View style={styles.questionExamples}>
                    {type.examples.map((ex, j) => (
                      <Text key={j} style={styles.questionExample}>• {ex}</Text>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Timeline */}
          <View style={[styles.section, { backgroundColor: '#f0f8ff' }]} accessibilityRole="region">
            <Text style={styles.sectionLabel}>8-WEEK PREP ROADMAP</Text>
            <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}>Your Complete Data Analyst Interview Prep Plan</Text>
            <Text style={styles.sectionDesc}>A structured, week-by-week plan to master SQL, business analysis, and communication.</Text>
            <View style={styles.timeline}>
              {prepTimeline.map((phase, i) => (
                <View key={i} style={styles.timelineItem}>
                  <View style={styles.timelineMarker}>
                    <View style={styles.timelineDot} />
                    {i < prepTimeline.length - 1 && <View style={styles.timelineLine} />}
                  </View>
                  <View style={styles.timelineContent}>
                    <View style={styles.timelineHeader}>
                      {phase.icon}
                      <View>
                        <Text style={styles.timelineWeek}>{phase.week}</Text>
                        <Text style={styles.timelineFocus}>{phase.focus}</Text>
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

          {/* Tools */}
          <View style={[styles.section, { backgroundColor: 'white' }]} accessibilityRole="region">
            <Text style={styles.sectionLabel}>TOOLS & TECH STACK</Text>
            <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}>Technologies Data Analysts Must Know</Text>
            <Text style={styles.sectionDesc}>Not every role requires all tools, but SQL proficiency is universal. Focus on tools relevant to your target company.</Text>
            <View style={[styles.toolsGrid, isSmall && styles.toolsGridMobile]}>
              {tools.map((tool, i) => (
                <View key={i} style={styles.toolCategory}>
                  <Text style={styles.toolCategoryName}>{tool.category}</Text>
                  <View style={styles.toolItems}>
                    {tool.items.map((item, j) => (
                      <View key={j} style={styles.toolItem}>
                        <Text style={styles.toolItemText}>{item}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Success Stories */}
          <View style={[styles.section, { backgroundColor: BG_CREAM }]} accessibilityRole="region">
            <Text style={styles.sectionLabel}>SUCCESS STORIES</Text>
            <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}>From SQL Practice to Business Impact</Text>
            <Text style={styles.sectionDesc}>These analysts practiced with CrackJobs and landed roles at top companies with measurable impact.</Text>
            <View style={[styles.storiesGrid, isSmall && styles.storiesGridMobile]}>
              {successStories.map((story, i) => (
                <View key={i} style={styles.storyCard}>
                  <View style={styles.storyHeader}>
                    <View>
                      <Text style={styles.storyName}>{story.name}</Text>
                      <Text style={styles.storyRole}>{story.role} at {story.company}</Text>
                    </View>
                    <View style={styles.storyRating}>
                      {[...Array(story.rating)].map((_, j) => <StarIcon key={j} size={14} />)}
                    </View>
                  </View>
                  <View style={styles.storyOutcomeBox}>
                    <Text style={styles.storyOutcome}>{story.outcome}</Text>
                    <Text style={styles.storyImpact}>Impact: {story.impact}</Text>
                  </View>
                  <Text style={styles.storyQuote}>"{story.quote}"</Text>
                  <View style={styles.storyFooter}>
                    <Text style={styles.storySessions}>{story.sessions} practice sessions</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Mistakes */}
          <View style={[styles.section, { backgroundColor: 'white' }]} accessibilityRole="region">
            <Text style={styles.sectionLabel}>AVOID THESE MISTAKES</Text>
            <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}>5 SQL & Analysis Mistakes That Fail Interviews</Text>
            <Text style={styles.sectionDesc}>Based on 800+ analyst interview evaluations. These mistakes appear in 75% of failed interviews.</Text>
            {commonMistakes.map((item, i) => (
              <View key={i} style={styles.mistakeCard}>
                <View style={styles.mistakeHeader}>
                  <AlertTriangleIcon size={26} color={BRAND_ORANGE} />
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
                {item.sqlBad && item.sqlGood && (
                  <View style={styles.sqlComparison}>
                    <View style={styles.sqlCompareBlock}>
                      <Text style={styles.sqlCompareLabel}>❌ Common Approach:</Text>
                      <View style={styles.sqlCompareCode}>
                        <Text style={styles.sqlCodeText}>{item.sqlBad}</Text>
                      </View>
                    </View>
                    <View style={styles.sqlCompareBlock}>
                      <Text style={styles.sqlCompareLabel}>✅ Better Approach:</Text>
                      <View style={styles.sqlCompareCode}>
                        <Text style={styles.sqlCodeText}>{item.sqlGood}</Text>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* Related Articles */}
          <View style={[styles.section, { backgroundColor: '#fff8f0' }]} accessibilityRole="region">
            <Text style={styles.sectionLabel}>DEEP DIVE GUIDES</Text>
            <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}>Master Specific Analyst Topics</Text>
            <View style={[styles.articlesGrid, isSmall && styles.articlesGridMobile]}>
              <TouchableOpacity style={styles.articleCard} onPress={() => router.push('/blog/sql-interview-mistakes-data-analysts')} accessibilityRole="link">
                <BookOpenIcon size={32} color={CTA_TEAL} />
                <Text style={styles.articleTitle}>Common SQL Interview Mistakes Data Analysts Make</Text>
                <Text style={styles.articleDesc}>Learn the most common SQL pitfalls—from query optimization to handling edge cases and NULLs properly.</Text>
                <Text style={styles.articleCta}>Read Complete Guide →</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* How It Works */}
          <View style={[styles.section, { backgroundColor: 'white' }]} accessibilityRole="region">
            <Text style={styles.sectionLabel}>HOW IT WORKS</Text>
            <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}>Practice SQL & Analysis in 3 Steps</Text>
            <View style={[styles.stepsGrid, isSmall && styles.stepsGridMobile]}>
              <View style={styles.stepCard}>
                <View style={styles.stepNum}><Text style={styles.stepNumText}>1</Text></View>
                <Text style={styles.stepTitle}>Pick Your Focus</Text>
                <Text style={styles.stepDesc}>Choose SQL technical, business case, dashboard design, or communication practice. Browse analysts from Amazon, Flipkart, Swiggy.</Text>
              </View>
              <View style={styles.stepCard}>
                <View style={styles.stepNum}><Text style={styles.stepNumText}>2</Text></View>
                <Text style={styles.stepTitle}>Book 55-Min Session</Text>
                <Text style={styles.stepDesc}>Practice real SQL problems, business cases, or dashboard reviews. Get live feedback on queries, logic, and communication.</Text>
              </View>
              <View style={styles.stepCard}>
                <View style={styles.stepNum}><Text style={styles.stepNumText}>3</Text></View>
                <Text style={styles.stepTitle}>Get Actionable Feedback</Text>
                <Text style={styles.stepDesc}>Detailed evaluation on SQL skills, business thinking, visualization design, and stakeholder communication.</Text>
              </View>
            </View>
          </View>

          {/* Final CTA */}
          <View style={styles.finalCta} accessibilityRole="region">
            <Text style={[styles.finalCtaTitle, isSmall && { fontSize: 34 }]}>Ready to Master Data Analyst Interviews?</Text>
            <Text style={[styles.finalCtaSubtitle, isSmall && { fontSize: 17 }]}>Join 400+ analysts who mastered SQL, business cases, and dashboard design with expert mentors. Start practicing today.</Text>
            <TouchableOpacity style={styles.finalCtaBtn} onPress={() => router.push('/auth/sign-up')} accessibilityRole="button">
              <Text style={styles.finalCtaBtnText}>Start SQL Practice Today →</Text>
            </TouchableOpacity>
            <View style={styles.finalCtaFeatures}>
              <Text style={styles.finalCtaFeature}>⚡ Real SQL challenges</Text>
              <Text style={styles.finalCtaFeature}>📊 Business case practice</Text>
              <Text style={styles.finalCtaFeature}>💳 Pay per session (₹999-2499)</Text>
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
  hero: { maxWidth: 950, width: '100%', alignSelf: 'center', paddingHorizontal: 24, paddingVertical: 70, alignItems: 'center' },
  heroMobile: { paddingVertical: 45 },
  badge: { backgroundColor: 'white', borderWidth: 1, borderColor: '#d8eded', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 24, marginBottom: 28 },
  badgeText: { color: CTA_TEAL, fontWeight: '700', fontSize: 12, letterSpacing: 0.6 },
  heroTitle: { fontFamily: SYSTEM_FONT, fontWeight: '900', fontSize: 56, color: BRAND_ORANGE, lineHeight: 64, textAlign: 'center', marginBottom: 24 },
  heroTitleMobile: { fontSize: 38, lineHeight: 46 },
  heroSubtitle: { fontFamily: SYSTEM_FONT, fontSize: 20, color: TEXT_GRAY, lineHeight: 32, textAlign: 'center', marginBottom: 42, maxWidth: 780 },
  heroSubtitleMobile: { fontSize: 18, lineHeight: 28 },
  heroStats: { flexDirection: 'row', gap: 36, marginBottom: 42, flexWrap: 'wrap', justifyContent: 'center' },
  stat: { alignItems: 'center', minWidth: 85 },
  statValue: { fontFamily: SYSTEM_FONT, fontSize: 32, fontWeight: '800', color: CTA_TEAL, marginBottom: 6 },
  statLabel: { fontFamily: SYSTEM_FONT, fontSize: 13, color: TEXT_GRAY, textAlign: 'center' },
  ctaBtn: { backgroundColor: CTA_TEAL, paddingHorizontal: 44, paddingVertical: 20, borderRadius: 100 },
  ctaBtnText: { fontFamily: SYSTEM_FONT, fontSize: 17, fontWeight: '700', color: 'white' },
  section: { paddingVertical: 80, paddingHorizontal: 24 },
  sectionLabel: { fontFamily: SYSTEM_FONT, fontSize: 12, fontWeight: '700', color: CTA_TEAL, letterSpacing: 1.8, textAlign: 'center', marginBottom: 14, textTransform: 'uppercase' },
  sectionTitle: { fontFamily: SYSTEM_FONT, fontSize: 42, fontWeight: '800', color: TEXT_DARK, textAlign: 'center', marginBottom: 18, maxWidth: 850, alignSelf: 'center' },
  sectionTitleMobile: { fontSize: 32 },
  sectionDesc: { fontFamily: SYSTEM_FONT, fontSize: 18, color: TEXT_GRAY, textAlign: 'center', marginBottom: 52, maxWidth: 750, alignSelf: 'center', lineHeight: 29 },
  skillCard: { maxWidth: 950, width: '100%', alignSelf: 'center', backgroundColor: BG_CREAM, borderRadius: 18, padding: 32, marginBottom: 24, borderWidth: 1, borderColor: '#e5e5e5' },
  skillHeader: { flexDirection: 'row', gap: 20, marginBottom: 24, alignItems: 'flex-start' },
  skillHeaderText: { flex: 1 },
  skillName: { fontFamily: SYSTEM_FONT, fontSize: 24, fontWeight: '700', color: TEXT_DARK, marginBottom: 8 },
  skillDesc: { fontFamily: SYSTEM_FONT, fontSize: 16, color: TEXT_GRAY, lineHeight: 25, marginBottom: 8 },
  skillDifficulty: { fontFamily: SYSTEM_FONT, fontSize: 13, fontWeight: '600', color: BRAND_ORANGE },
  skillTopics: { gap: 10 },
  topicItem: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  topicText: { fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_DARK, flex: 1, lineHeight: 23 },
  sqlCard: { maxWidth: 950, width: '100%', alignSelf: 'center', backgroundColor: 'white', borderRadius: 18, padding: 32, marginBottom: 28, borderLeftWidth: 4, borderLeftColor: CTA_TEAL },
  sqlHeader: { flexDirection: 'row', gap: 16, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' },
  sqlDifficulty: { fontFamily: SYSTEM_FONT, fontSize: 12, fontWeight: '700', color: 'white', backgroundColor: BRAND_ORANGE, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  sqlConcept: { fontFamily: SYSTEM_FONT, fontSize: 13, color: TEXT_GRAY, fontStyle: 'italic' },
  sqlQuestion: { fontFamily: SYSTEM_FONT, fontSize: 17, fontWeight: '600', color: TEXT_DARK, marginBottom: 20, lineHeight: 26 },
  sqlCodeBlock: { marginBottom: 16 },
  sqlCodeLabel: { fontFamily: SYSTEM_FONT, fontSize: 13, fontWeight: '700', color: CTA_TEAL, marginBottom: 10 },
  sqlCode: { backgroundColor: SQL_BG, padding: 20, borderRadius: 12, borderWidth: 1, borderColor: '#d5e3f0' },
  sqlCodeText: { fontFamily: Platform.OS === 'web' ? 'Menlo, Monaco, monospace' : 'monospace', fontSize: 13, color: CODE_TEXT, lineHeight: 22 },
  sqlExplanation: { backgroundColor: '#e8f5f5', padding: 16, borderRadius: 12 },
  sqlExplanationLabel: { fontFamily: SYSTEM_FONT, fontSize: 13, fontWeight: '700', color: CTA_TEAL, marginBottom: 8 },
  sqlExplanationText: { fontFamily: SYSTEM_FONT, fontSize: 14, color: TEXT_DARK, lineHeight: 22 },
  sqlTip: { maxWidth: 950, width: '100%', alignSelf: 'center', backgroundColor: '#fff8f0', padding: 24, borderRadius: 16, marginTop: 20, borderLeftWidth: 4, borderLeftColor: BRAND_ORANGE },
  sqlTipText: { fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_DARK, lineHeight: 24 },
  bold: { fontWeight: '700' },
  questionTypesGrid: { flexDirection: 'row', gap: 24, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 1100, alignSelf: 'center' },
  questionTypesGridMobile: { flexDirection: 'column' },
  questionTypeCard: { flex: 1, minWidth: 240, maxWidth: 260, backgroundColor: BG_CREAM, padding: 28, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#e8e8e8' },
  questionTypeWeight: { fontFamily: SYSTEM_FONT, fontSize: 28, fontWeight: '800', color: CTA_TEAL, marginTop: 16, marginBottom: 8 },
  questionTypeName: { fontFamily: SYSTEM_FONT, fontSize: 18, fontWeight: '700', color: TEXT_DARK, marginBottom: 16, textAlign: 'center' },
  questionExamples: { gap: 8 },
  questionExample: { fontFamily: SYSTEM_FONT, fontSize: 13, color: TEXT_GRAY, lineHeight: 20 },
  timeline: { maxWidth: 950, alignSelf: 'center', width: '100%' },
  timelineItem: { flexDirection: 'row', gap: 24, marginBottom: 36 },
  timelineMarker: { width: 40, alignItems: 'center' },
  timelineDot: { width: 22, height: 22, borderRadius: 11, backgroundColor: CTA_TEAL, borderWidth: 4, borderColor: 'white', shadowColor: CTA_TEAL, shadowOpacity: 0.3, shadowRadius: 6 },
  timelineLine: { width: 2, flex: 1, backgroundColor: '#d0d0d0', marginTop: 8 },
  timelineContent: { flex: 1 },
  timelineHeader: { flexDirection: 'row', gap: 14, marginBottom: 16, alignItems: 'center' },
  timelineWeek: { fontFamily: SYSTEM_FONT, fontSize: 13, fontWeight: '700', color: CTA_TEAL, marginBottom: 4 },
  timelineFocus: { fontFamily: SYSTEM_FONT, fontSize: 22, fontWeight: '700', color: TEXT_DARK },
  timelineGoals: { gap: 10 },
  goalItem: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  goalText: { fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_DARK, flex: 1, lineHeight: 23 },
  toolsGrid: { flexDirection: 'row', gap: 24, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 1100, alignSelf: 'center' },
  toolsGridMobile: { flexDirection: 'column' },
  toolCategory: { flex: 1, minWidth: 240, backgroundColor: BG_CREAM, padding: 28, borderRadius: 16, borderWidth: 1, borderColor: '#e8e8e8' },
  toolCategoryName: { fontFamily: SYSTEM_FONT, fontSize: 18, fontWeight: '700', color: TEXT_DARK, marginBottom: 16 },
  toolItems: { gap: 8 },
  toolItem: { backgroundColor: 'white', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8 },
  toolItemText: { fontFamily: SYSTEM_FONT, fontSize: 14, color: TEXT_DARK },
  storiesGrid: { flexDirection: 'row', gap: 26, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 1150, alignSelf: 'center' },
  storiesGridMobile: { flexDirection: 'column' },
  storyCard: { flex: 1, minWidth: 320, maxWidth: 360, backgroundColor: 'white', padding: 32, borderRadius: 18, borderWidth: 1, borderColor: '#e5e5e5' },
  storyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 },
  storyName: { fontFamily: SYSTEM_FONT, fontSize: 18, fontWeight: '700', color: TEXT_DARK, marginBottom: 4 },
  storyRole: { fontFamily: SYSTEM_FONT, fontSize: 14, color: TEXT_GRAY },
  storyRating: { flexDirection: 'row', gap: 3 },
  storyOutcomeBox: { backgroundColor: BG_CREAM, padding: 16, borderRadius: 12, marginBottom: 18 },
  storyOutcome: { fontFamily: SYSTEM_FONT, fontSize: 20, fontWeight: '700', color: CTA_TEAL, marginBottom: 4 },
  storyImpact: { fontFamily: SYSTEM_FONT, fontSize: 13, color: BRAND_ORANGE, fontWeight: '600' },
  storyQuote: { fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_DARK, lineHeight: 25, marginBottom: 18, fontStyle: 'italic' },
  storyFooter: { borderTopWidth: 1, borderTopColor: '#e0e0e0', paddingTop: 14 },
  storySessions: { fontFamily: SYSTEM_FONT, fontSize: 13, fontWeight: '600', color: TEXT_GRAY },
  mistakeCard: { maxWidth: 900, alignSelf: 'center', width: '100%', backgroundColor: BG_CREAM, padding: 30, borderRadius: 18, marginBottom: 24, borderLeftWidth: 5, borderLeftColor: BRAND_ORANGE },
  mistakeHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
  mistakeNum: { fontFamily: SYSTEM_FONT, fontSize: 18, fontWeight: '800', color: BRAND_ORANGE },
  mistakeText: { fontFamily: SYSTEM_FONT, fontSize: 18, fontWeight: '700', color: TEXT_DARK, lineHeight: 28, marginBottom: 16 },
  mistakeWhy: { backgroundColor: '#fff5f0', padding: 16, borderRadius: 12, marginBottom: 14 },
  mistakeWhyLabel: { fontFamily: SYSTEM_FONT, fontSize: 13, fontWeight: '700', color: BRAND_ORANGE, marginBottom: 6 },
  mistakeWhyText: { fontFamily: SYSTEM_FONT, fontSize: 14, color: TEXT_DARK, lineHeight: 22 },
  mistakeFix: { backgroundColor: '#f0f8f0', padding: 16, borderRadius: 12, marginBottom: 14 },
  mistakeFixLabel: { fontFamily: SYSTEM_FONT, fontSize: 13, fontWeight: '700', color: CTA_TEAL, marginBottom: 6 },
  mistakeFixText: { fontFamily: SYSTEM_FONT, fontSize: 14, color: TEXT_DARK, lineHeight: 22 },
  sqlComparison: { marginTop: 14, gap: 14 },
  sqlCompareBlock: {},
  sqlCompareLabel: { fontFamily: SYSTEM_FONT, fontSize: 13, fontWeight: '700', color: TEXT_DARK, marginBottom: 8 },
  sqlCompareCode: { backgroundColor: SQL_BG, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#d5e3f0' },
  articlesGrid: { maxWidth: 900, alignSelf: 'center', width: '100%' },
  articlesGridMobile: { flexDirection: 'column' },
  articleCard: { backgroundColor: 'white', padding: 34, borderRadius: 18, borderWidth: 1, borderColor: '#e5e5e5' },
  articleTitle: { fontFamily: SYSTEM_FONT, fontSize: 21, fontWeight: '700', color: TEXT_DARK, marginTop: 18, marginBottom: 14, lineHeight: 30 },
  articleDesc: { fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_GRAY, lineHeight: 25, marginBottom: 18 },
  articleCta: { fontFamily: SYSTEM_FONT, fontSize: 15, fontWeight: '600', color: CTA_TEAL },
  stepsGrid: { flexDirection: 'row', gap: 32, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 1100, alignSelf: 'center' },
  stepsGridMobile: { flexDirection: 'column' },
  stepCard: { flex: 1, minWidth: 290, maxWidth: 330, alignItems: 'center', backgroundColor: 'white', padding: 32, borderRadius: 18, borderWidth: 1, borderColor: '#e8e8e8' },
  stepNum: { width: 64, height: 64, borderRadius: 32, backgroundColor: CTA_TEAL, alignItems: 'center', justifyContent: 'center', marginBottom: 22 },
  stepNumText: { fontFamily: SYSTEM_FONT, fontSize: 30, fontWeight: '800', color: 'white' },
  stepTitle: { fontFamily: SYSTEM_FONT, fontSize: 20, fontWeight: '700', color: TEXT_DARK, marginBottom: 14, textAlign: 'center' },
  stepDesc: { fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_GRAY, textAlign: 'center', lineHeight: 25 },
  finalCta: { backgroundColor: '#0f0f0f', paddingVertical: 80, paddingHorizontal: 24, alignItems: 'center' },
  finalCtaTitle: { fontFamily: SYSTEM_FONT, fontSize: 46, fontWeight: '900', color: 'white', marginBottom: 22, textAlign: 'center', maxWidth: 750 },
  finalCtaSubtitle: { fontFamily: SYSTEM_FONT, fontSize: 18, color: 'rgba(255,255,255,0.85)', marginBottom: 42, textAlign: 'center', maxWidth: 650, lineHeight: 29 },
  finalCtaBtn: { backgroundColor: CTA_TEAL, paddingHorizontal: 50, paddingVertical: 22, borderRadius: 100, marginBottom: 28 },
  finalCtaBtnText: { fontFamily: SYSTEM_FONT, fontSize: 17, fontWeight: '700', color: 'white' },
  finalCtaFeatures: { flexDirection: 'row', gap: 28, flexWrap: 'wrap', justifyContent: 'center' },
  finalCtaFeature: { fontFamily: SYSTEM_FONT, fontSize: 14, color: 'rgba(255,255,255,0.75)' },
});