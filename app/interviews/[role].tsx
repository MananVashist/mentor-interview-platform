import React, { useEffect, useState, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter, Redirect } from 'expo-router';
import Svg, { Path, Circle, Rect, Polyline } from 'react-native-svg';

// --- IMPORTS ---
import { Footer } from '@/components/Footer';
import { BrandHeader } from '@/lib/ui';
import { ROLE_DATA } from '@/data/roles';
import { SEO } from '@/components/SEO';
import { SEO_CONFIG } from '@/config/seo';

// --- CONFIG ---
const BASE_URL = 'https://crackjobs.com';

// --- COLORS ---
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

// ============================================
// SVG ICONS
// ============================================

const CheckCircleIcon = ({ size = 20, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" fill={color} />
    <Path d="M7 12l3.5 3.5 6.5-7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ClockIcon = ({ size = 20, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <Path d="M12 6v6l4 2" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const UsersIcon = ({ size = 20, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Circle cx="9" cy="7" r="4" stroke={color} strokeWidth="2" />
    <Path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const CashIcon = ({ size = 20, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <Path d="M12 6v12M8.5 9.5h4.5c1.1 0 2 .9 2 2s-.9 2-2 2h-3c-1.1 0-2 .9-2 2s.9 2 2 2h5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const TargetIcon = ({ size = 48, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <Circle cx="12" cy="12" r="6" stroke={color} strokeWidth="2" />
    <Circle cx="12" cy="12" r="2" fill={color} />
  </Svg>
);

const ChartIcon = ({ size = 48, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 3v18h18" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Polyline points="7,15 12,9 16,12 21,7" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="7" cy="15" r="2" fill={color} />
    <Circle cx="12" cy="9" r="2" fill={color} />
  </Svg>
);

const LockIcon = ({ size = 48, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="5" y="11" width="14" height="11" rx="2" stroke={color} strokeWidth="2" />
    <Path d="M8 11V7a4 4 0 0 1 8 0v4" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Circle cx="12" cy="16" r="1.5" fill={color} />
  </Svg>
);

const LightningIcon = ({ size = 48, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" stroke={color} strokeWidth="2" strokeLinejoin="round" fill={color} fillOpacity="0.2" />
  </Svg>
);

const TrophyIcon = ({ size = 48, color = CTA_TEAL }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M4 22h16" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M18 2H6v7a6 6 0 0 0 12 0V2z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
  </Svg>
);

const AlertIcon = ({ size = 48, color = BRAND_ORANGE }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <Path d="M12 8v4" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Circle cx="12" cy="16" r="1" fill={color} />
  </Svg>
);

const StarIcon = ({ size = 20, color = "#FFD700" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2l2.4 7.4h7.8l-6.3 4.6 2.4 7.4L12 16.8l-6.3 4.6 2.4-7.4L1.8 9.4h7.8z" />
  </Svg>
);

// ============================================
// ROLE-SPECIFIC COMMON MISTAKES
// ============================================

const getCommonMistakes = (roleId: string) => {
  const mistakes: { [key: string]: Array<{ mistake: string; fix: string }> } = {
    'product-management': [
      {
        mistake: 'Jumping straight to solutions without understanding the problem first',
        fix: 'Always start with clarifying questions. Ask about users, constraints, goals, and success metrics. Use frameworks like CIRCLES to structure your thinking before proposing solutions.'
      },
      {
        mistake: 'Not structuring answers with a clear framework',
        fix: 'Use proven frameworks: CIRCLES for product design, AARM for metrics questions, STAR for behavioral. Frameworks show structured thinking and make your answers easier to follow.'
      },
      {
        mistake: 'Forgetting to quantify impact and prioritize based on data',
        fix: 'Always tie features back to business metrics. Say "This could increase DAU by X% because..." or "I\'d prioritize this over that based on effort-vs-impact." PMs need to think in numbers.'
      },
      {
        mistake: 'Not considering technical feasibility and constraints',
        fix: 'Show awareness of engineering trade-offs. Mention things like "This might require changes to the API" or "We\'d need to consider database performance." Collaborate with engineers, do not ignore them.'
      },
      {
        mistake: 'Weak stakeholder management examples in behavioral questions',
        fix: 'Prepare specific STAR stories showing how you influenced without authority, managed conflict, and aligned cross-functional teams. Be ready to discuss failures and what you learned.'
      },
    ],
    
    'data-analytics': [
      {
        mistake: 'Writing SQL queries without first clarifying data assumptions',
        fix: 'Always ask about the data: "Are there duplicates? How are NULLs handled? What\'s the date range?" This shows you think about data quality before jumping into code.'
      },
      {
        mistake: 'Not explaining your thought process while solving SQL problems',
        fix: 'Think out loud: "I\'m using a window function here because..." or "I\'ll join these tables on...because..." Interviewers want to see how you approach problems, not just the final query.'
      },
      {
        mistake: 'Jumping to conclusions without exploring the data first',
        fix: 'In case studies, start with "Let me first look at..." Break problems down: check for outliers, segment by key dimensions, look at time trends. Show methodical thinking.'
      },
      {
        mistake: 'Using jargon without explaining insights clearly to non-technical stakeholders',
        fix: 'Translate technical findings into business language. Instead of "p-value is 0.03," say "We\'re 97% confident this is not due to chance." Make insights actionable.'
      },
      {
        mistake: 'Forgetting to tie analysis back to business decisions',
        fix: 'Every analysis should end with "So what?" Recommend clear actions: "Based on this, we should..." or "This suggests we need to investigate..." Data without recommendations is incomplete.'
      },
    ],
    
    'data-science': [
      {
        mistake: 'Over-engineering solutions when simpler models would work',
        fix: 'Start with baseline models (logistic regression, simple decision trees) before jumping to deep learning. Explain trade-offs: "I\'d start simple for interpretability, then iterate to complex models if needed."'
      },
      {
        mistake: 'Not explaining why you chose a specific algorithm or approach',
        fix: 'Always justify your choices: "I chose XGBoost over Random Forest because..." or "Linear regression makes sense here given the interpretability requirement." Show you understand trade-offs.'
      },
      {
        mistake: 'Ignoring model bias, fairness, and ethical considerations',
        fix: 'Proactively mention: "We should check for bias across demographics" or "This model could have fairness issues if..." Show awareness of ML ethics and responsible AI.'
      },
      {
        mistake: 'Writing code that works but is inefficient or hard to maintain',
        fix: 'Write clean, vectorized code. Comment your logic. Mention: "I\'d refactor this for production" or "This needs unit tests." Show you think about code quality, not just accuracy.'
      },
      {
        mistake: 'Not thinking about production, monitoring, and model drift',
        fix: 'Discuss deployment: "We\'d need to monitor precision/recall weekly" or "I\'d set up alerts for data drift." ML isn\'t just training models—it\'s maintaining them in production.'
      },
    ],
    
    'hr': [
      {
        mistake: 'Being too "people-pleasing" and not showing backbone in difficult decisions',
        fix: 'HR requires balancing empathy with tough calls. Show examples where you made unpopular but necessary decisions. Use phrases like "I had to balance employee needs with business requirements..."'
      },
      {
        mistake: 'Not demonstrating data-driven decision making in HR',
        fix: 'Back up recommendations with data: "I analyzed our attrition data and found..." or "Looking at our hiring funnel metrics..." Modern HR is analytical, not just administrative.'
      },
      {
        mistake: 'Providing theoretical answers instead of real, specific examples',
        fix: 'Use concrete stories with names of tools, specific numbers, and real outcomes: "When we had 23% attrition in Q2, I implemented..." Generic answers don\'t demonstrate real experience.'
      },
      {
        mistake: 'Not showing how HR work drives business outcomes',
        fix: 'Connect HR initiatives to business metrics: "This reduced time-to-hire by 15 days, saving ₹2L in contractor costs" or "Improved retention by 12%, protecting ₹50L in hiring investment."'
      },
      {
        mistake: 'Weak conflict resolution examples or avoiding difficult conversations',
        fix: 'Prepare stories showing you handled: terminations, performance issues, toxic behavior, and organizational change. Explain your approach: investigation, documentation, fair process, clear communication.'
      },
    ],
  };

  return mistakes[roleId] || mistakes['product-management'];
};

// ============================================
// COMPONENTS
// ============================================

const StatsBar = memo(({ data }: { data: any }) => (
  <View style={styles.statsBar}>
    <View style={styles.statsInner}>
      <View style={styles.statItem}>
        <ClockIcon size={20} color={CTA_TEAL} />
        <Text style={styles.statText}>55-min sessions</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <UsersIcon size={20} color={CTA_TEAL} />
        <Text style={styles.statText}>Expert mentors</Text>
      </View>
      {data.salary && (
        <>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <CashIcon size={20} color={CTA_TEAL} />
            <Text style={styles.statText}>{data.salary} avg salary</Text>
          </View>
        </>
      )}
    </View>
  </View>
));

const SuccessStoriesSection = memo(({ roleTitle, isSmall }: { roleTitle: string; isSmall: boolean }) => {
  const stories = [
    {
      name: "Priya S.",
      role: `${roleTitle} at Google`,
      quote: "I did 6 mock interviews on CrackJobs before my Google onsite. The feedback was incredibly detailed and helped me identify gaps I didn't even know I had. Landed the offer!",
      rating: 5
    },
    {
      name: "Rahul K.",
      role: `${roleTitle} at Amazon`,
      quote: "The anonymous format removed all the pressure. I could focus purely on improving my skills. My mentor had actually worked at Amazon and knew exactly what they look for.",
      rating: 5
    },
    {
      name: "Ananya M.",
      role: `${roleTitle} at Microsoft`,
      quote: "After 3 failed interviews, I used CrackJobs for prep. Did 8 sessions over 3 weeks. Finally cracked Microsoft. The structured feedback was a game-changer.",
      rating: 5
    },
  ];

  return (
    <View style={[styles.sectionContainer, styles.successBg]}>
      <Text style={styles.sectionKicker}>SUCCESS STORIES</Text>
      <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}>
        Candidates who landed {roleTitle} offers
      </Text>
      <View style={[styles.storiesGrid, isSmall && styles.storiesGridMobile]}>
        {stories.map((story, i) => (
          <View key={i} style={styles.storyCard}>
            <View style={[styles.storyRating, isSmall && { justifyContent: 'center' }]}>
              {[...Array(story.rating)].map((_, j) => (
                <StarIcon key={j} size={16} color="#FFD700" />
              ))}
            </View>
            <Text style={[styles.storyQuote, isSmall && { textAlign: 'center' }]}>"{story.quote}"</Text>
            <View style={[styles.storyAuthor, isSmall && { alignItems: 'center' }]}>
              <Text style={[styles.storyName, isSmall && { textAlign: 'center' }]}>{story.name}</Text>
              <Text style={[styles.storyRole, isSmall && { textAlign: 'center' }]}>{story.role}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
});

const WhatYoullMasterSection = memo(({ roleTitle, isSmall }: { roleTitle: string; isSmall: boolean }) => {
  const outcomes = [
    {
      icon: TargetIcon,
      title: 'Interview Frameworks',
      description: `Master proven frameworks like STAR (behavioral), CIRCLES (product design), and structured problem-solving approaches that top ${roleTitle} candidates use.`
    },
    {
      icon: ChartIcon,
      title: 'Real-Time Feedback',
      description: 'Get immediate, actionable feedback on your communication style, thought process, answer structure, and areas for improvement from experienced interviewers.'
    },
    {
      icon: TrophyIcon,
      title: 'Confidence Building',
      description: 'Practice in a safe, anonymous environment until you feel completely confident. Most successful candidates do 5-10 sessions before their real interviews.'
    },
    {
      icon: LockIcon,
      title: 'Company-Specific Prep',
      description: 'Filter mentors by their current/past companies. If interviewing at Google, practice with Google mentors who know the exact format and expectations.'
    },
  ];

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionKicker}>LEARNING OUTCOMES</Text>
      <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}>
        What you'll master
      </Text>
      <View style={[styles.outcomesGrid, isSmall && styles.outcomesGridMobile]}>
        {outcomes.map((outcome, i) => {
          const IconComponent = outcome.icon;
          return (
            <View key={i} style={styles.outcomeCard}>
              <View style={styles.outcomeIconContainer}>
                <IconComponent size={48} color={CTA_TEAL} />
              </View>
              <Text style={styles.outcomeTitle}>{outcome.title}</Text>
              <Text style={styles.outcomeDesc}>{outcome.description}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
});

const TimelineSection = memo(({ isSmall }: { isSmall: boolean }) => {
  const timeline = [
    {
      week: 'Week 1-2',
      title: 'Foundation Building',
      description: 'Do 2-3 mock interviews covering different topics. Identify your weak areas. Study fundamentals and frameworks.',
    },
    {
      week: 'Week 3-4',
      title: 'Deep Practice',
      description: 'Focus heavily on your weak areas. Do 3-4 targeted sessions. Start timing yourself. Practice explaining your thought process clearly.',
    },
    {
      week: 'Week 5-6',
      title: 'Polish & Confidence',
      description: 'Do full-length mock interviews. Practice company-specific formats. Refine your communication. Build confidence through repetition.',
    },
    {
      week: 'Week 7+',
      title: 'Final Prep',
      description: '1-2 mocks per week to stay sharp. Review feedback from all previous sessions. Go into real interviews confident and prepared.',
    },
  ];

  return (
    <View style={[styles.sectionContainer, styles.timelineBg]}>
      <Text style={styles.sectionKicker}>PREPARATION ROADMAP</Text>
      <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}>
        Your 6-8 week interview prep timeline
      </Text>
      <View style={styles.timelineContainer}>
        {timeline.map((phase, i) => (
          <View key={i} style={[styles.timelineItem, isSmall && styles.timelineItemMobile]}>
            <View style={styles.timelineMarker}>
              <View style={styles.timelineDot} />
              {i < timeline.length - 1 && <View style={styles.timelineLine} />}
            </View>
            <View style={styles.timelineContent}>
              <Text style={[styles.timelineWeek, isSmall && { textAlign: 'center' }]}>{phase.week}</Text>
              <Text style={[styles.timelineTitle, isSmall && { textAlign: 'center' }]}>{phase.title}</Text>
              <Text style={[styles.timelineDesc, isSmall && { textAlign: 'center' }]}>{phase.description}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
});

const CommonMistakesSection = memo(({ roleId, roleTitle, isSmall }: { roleId: string; roleTitle: string; isSmall: boolean }) => {
  const mistakes = getCommonMistakes(roleId);

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionKicker}>AVOID THESE PITFALLS</Text>
      <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}>
        5 common mistakes in {roleTitle} interviews
      </Text>
      <View style={styles.mistakesContainer}>
        {mistakes.map((item, i) => (
          <View key={i} style={styles.mistakeCard}>
            <View style={[styles.mistakeHeader, isSmall && { flexDirection: 'column', alignItems: 'center', gap: 12 }]}>
              <AlertIcon size={32} color={BRAND_ORANGE} />
              <Text style={[styles.mistakeText, isSmall && { textAlign: 'center' }]}>
                ❌ {item.mistake}
              </Text>
            </View>
            <Text style={[styles.mistakeFix, isSmall && { textAlign: 'center', paddingLeft: 0 }]}>
              ✅ <Text style={{ fontWeight: '700' }}>Fix:</Text> {item.fix}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
});

const MentorCredentialsSection = memo(({ isSmall }: { isSmall: boolean }) => {
  const credentials = [
    {
      title: 'Top Company Experience',
      description: 'Our mentors currently work or have worked at Google, Amazon, Meta, Microsoft, Apple, Netflix, and other leading tech companies.'
    },
    {
      title: 'Interview Panel Veterans',
      description: 'Most mentors have conducted 100+ real interviews in their careers. They know exactly what hiring managers look for.'
    },
    {
      title: 'Verified Background',
      description: 'Every mentor is verified through LinkedIn, employment verification, and reference checks before accepting bookings.'
    },
    {
      title: 'Highly Rated',
      description: 'Only mentors with 4.5+ ratings continue on the platform. Quality feedback is our top priority.'
    },
  ];

  return (
    <View style={[styles.sectionContainer, styles.mentorBg]}>
      <Text style={styles.sectionKicker}>OUR MENTORS</Text>
      <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}>
        Learn from the best in the industry
      </Text>
      <View style={[styles.credentialsGrid, isSmall && styles.credentialsGridMobile]}>
        {credentials.map((cred, i) => (
          <View key={i} style={styles.credentialCard}>
            <CheckCircleIcon size={32} color={CTA_TEAL} />
            <Text style={styles.credentialTitle}>{cred.title}</Text>
            <Text style={styles.credentialDesc}>{cred.description}</Text>
          </View>
        ))}
      </View>
    </View>
  );
});

export default function RoleLandingPage() {
  const params = useLocalSearchParams<{ role: string }>();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isSmall = width < 900;
  
  const [isReady, setIsReady] = useState(false);

  const role = Array.isArray(params.role) ? params.role[0] : params.role;
  const roleKey = typeof role === 'string' ? role : '';
  
  const data = roleKey ? ROLE_DATA[roleKey] : null;
  const seoData = roleKey ? SEO_CONFIG.interviews[roleKey as keyof typeof SEO_CONFIG.interviews] : null;

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 50);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={CTA_TEAL} />
      </View>
    );
  }

  if (!data || !seoData) {
    return <Redirect href="/" />;
  }

  const canonicalUrl = `${BASE_URL}/interviews/${roleKey}`;

  return (
    <>
      <SEO {...seoData} canonical={canonicalUrl} />

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        
        {/* HEADER */}
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

        {/* HERO */}
        <View style={styles.sectionContainer}>
          <View style={[styles.heroCentered, isSmall && styles.heroCenteredMobile]}>
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{data.tag.toUpperCase()} INTERVIEW TRACK</Text>
            </View>
            <Text style={[styles.heroTitle, isSmall && styles.heroTitleMobile]}>
              {data.heroTitle}
            </Text>
            <Text style={[styles.heroSubtitle, isSmall && styles.heroSubtitleMobile]}>
              {data.heroSubtitle}
            </Text>
            <TouchableOpacity 
              style={[styles.btnPrimary, isSmall && { width: '90%' }]} 
              onPress={() => router.push('/auth/sign-up')}
            >
              <Text style={styles.btnPrimaryText}>Start Practicing →</Text>
            </TouchableOpacity>
          </View>
        </View>

        <StatsBar data={data} />
        <SuccessStoriesSection roleTitle={data.title} isSmall={isSmall} />
        <WhatYoullMasterSection roleTitle={data.title} isSmall={isSmall} />

        {/* CURRICULUM */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionKicker}>COMPLETE CURRICULUM</Text>
          <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}>
            Everything covered in {data.title} interviews
          </Text>
          <Text style={[styles.sectionDesc, isSmall && { textAlign: 'center' }]}>
            Our curriculum is built from analyzing 500+ real {data.title} interviews at top companies. 
            Every topic includes example questions, frameworks, and evaluation criteria.
          </Text>

          <View style={styles.curriculumGrid}>
            {data.syllabus.map((phase, index) => (
              <View key={index} style={styles.curriculumCard}>
                <View style={[styles.cardHeader, isSmall && styles.cardHeaderMobile]}>
                  <View style={styles.stepBadge}>
                    <Text style={styles.stepBadgeText}>{index + 1}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.cardTitle, isSmall && { textAlign: 'center' }]}>{phase.title}</Text>
                    <Text style={[styles.cardDesc, isSmall && { textAlign: 'center' }]}>{phase.description}</Text>
                  </View>
                </View>

                <View style={styles.topicList}>
                  {phase.topics.map((topic, i) => (
                    <View key={i} style={styles.topicItem}>
                      <View style={[styles.topicHeader, isSmall && { flexDirection: 'column', alignItems: 'center', gap: 8 }]}>
                        <CheckCircleIcon size={20} color={CTA_TEAL} />
                        <Text style={[styles.topicText, isSmall && { textAlign: 'center', flex: undefined }]}>{topic}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>

        <TimelineSection isSmall={isSmall} />
        <CommonMistakesSection roleId={roleKey} roleTitle={data.title} isSmall={isSmall} />
        <MentorCredentialsSection isSmall={isSmall} />

        {/* FAQ */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionKicker}>FREQUENTLY ASKED QUESTIONS</Text>
          <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}>
            Everything you need to know
          </Text>
          
          <View style={styles.faqContainer}>
            {data.faqs.map((faq, i) => (
              <View key={i} style={styles.faqCard}>
                <Text style={[styles.faqQuestion, isSmall && { textAlign: 'center' }]}>{faq.question}</Text>
                <Text style={[styles.faqAnswer, isSmall && { textAlign: 'center' }]}>{faq.answer}</Text>
              </View>
            ))}
            
            <View style={styles.faqCard}>
              <Text style={[styles.faqQuestion, isSmall && { textAlign: 'center' }]}>How long is each session?</Text>
              <Text style={[styles.faqAnswer, isSmall && { textAlign: 'center' }]}>Each session is 55 minutes - designed to mirror real interview lengths. This includes the interview simulation and detailed feedback discussion.</Text>
            </View>
            
            <View style={styles.faqCard}>
              <Text style={[styles.faqQuestion, isSmall && { textAlign: 'center' }]}>Can I choose which topics to practice?</Text>
              <Text style={[styles.faqAnswer, isSmall && { textAlign: 'center' }]}>Yes! When booking, you can specify which topics you want to focus on. Mentors will tailor the session to your needs.</Text>
            </View>
            
            <View style={styles.faqCard}>
              <Text style={[styles.faqQuestion, isSmall && { textAlign: 'center' }]}>What if I'm not satisfied with a session?</Text>
              <Text style={[styles.faqAnswer, isSmall && { textAlign: 'center' }]}>We have a satisfaction guarantee. If you're not happy with a session, contact us within 24 hours for a full refund or free rescheduling with a different mentor.</Text>
            </View>
          </View>
        </View>

        {/* FINAL CTA */}
        <View style={styles.finalCta}>
          <Text style={[styles.finalCtaTitle, isSmall && { fontSize: 32 }]}>
            Ready to land your dream {data.title} role?
          </Text>
          <Text style={[styles.finalCtaSubtitle, isSmall && { fontSize: 16 }]}>
            Join hundreds of successful candidates who've used CrackJobs to prepare for interviews at Google, Amazon, Meta, and other top companies.
          </Text>
          <TouchableOpacity 
            style={styles.finalCtaButton} 
            onPress={() => router.push('/auth/sign-up')}
          >
            <Text style={styles.finalCtaButtonText}>Browse Mentors & Get Started</Text>
          </TouchableOpacity>
          <Text style={styles.finalCtaNote}>
            💳 No credit card required • 🔒 100% anonymous • ⚡ Book in 2 minutes
          </Text>
        </View>
        
        <Footer />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG_CREAM },
  scrollContent: { minHeight: '100%' },
  loadingContainer: { flex: 1, backgroundColor: BG_CREAM, alignItems: 'center', justifyContent: 'center', minHeight: 400 },

  header: { backgroundColor: BG_CREAM, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  headerInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1200, width: '100%', alignSelf: 'center', paddingHorizontal: 24 },
  headerInnerMobile: { paddingHorizontal: 16 },
  navRight: { flexDirection: 'row', gap: 24, alignItems: 'center' },
  navRightMobile: { gap: 12 },
  navLinkText: { fontFamily: SYSTEM_FONT, fontWeight: '600', color: TEXT_DARK },
  btnSmall: { backgroundColor: CTA_TEAL, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 100 },
  btnSmallText: { fontFamily: SYSTEM_FONT, fontSize: 13, fontWeight: '700', color: '#fff' },

  sectionContainer: { maxWidth: 1200, width: '100%', alignSelf: 'center', paddingHorizontal: 24, paddingVertical: 60 },
  sectionKicker: { fontFamily: SYSTEM_FONT, fontWeight: '700', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1.5, color: CTA_TEAL, marginBottom: 12, textAlign: 'center' },
  sectionTitle: { fontFamily: SYSTEM_FONT, fontWeight: '800', fontSize: 36, color: TEXT_DARK, marginBottom: 16, textAlign: 'center' },
  sectionTitleMobile: { fontSize: 28 },
  sectionDesc: { fontFamily: SYSTEM_FONT, fontSize: 18, color: TEXT_GRAY, textAlign: 'center', maxWidth: 800, alignSelf: 'center', marginBottom: 48, lineHeight: 28 },

  heroCentered: { alignItems: 'center', paddingVertical: 40, maxWidth: 800, alignSelf: 'center' },
  heroCenteredMobile: { paddingVertical: 20 },
  heroTitle: { fontFamily: SYSTEM_FONT, fontWeight: '800', fontSize: 52, color: BRAND_ORANGE, lineHeight: 60, marginBottom: 24, textAlign: 'center' },
  heroTitleMobile: { fontSize: 36, lineHeight: 44 },
  heroSubtitle: { fontFamily: SYSTEM_FONT, fontSize: 20, color: TEXT_GRAY, lineHeight: 30, marginBottom: 40, textAlign: 'center', maxWidth: 600 },
  heroSubtitleMobile: { fontSize: 16, lineHeight: 24 },
  badgeContainer: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e0f5f5', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 100, marginBottom: 24 },
  badgeText: { color: CTA_TEAL, fontWeight: '700', fontSize: 12, fontFamily: SYSTEM_FONT, letterSpacing: 0.5 },
  btnPrimary: { backgroundColor: CTA_TEAL, paddingHorizontal: 32, paddingVertical: 16, borderRadius: 100, minWidth: 180, alignItems: 'center' },
  btnPrimaryText: { fontFamily: SYSTEM_FONT, fontWeight: '700', fontSize: 16, color: '#fff' },

  statsBar: { backgroundColor: 'white', paddingVertical: 24, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#f0f0f0' },
  statsInner: { maxWidth: 1200, width: '100%', alignSelf: 'center', paddingHorizontal: 24, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: 24 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statText: { fontFamily: SYSTEM_FONT, fontSize: 15, fontWeight: '600', color: TEXT_DARK },
  statDivider: { width: 1, height: 24, backgroundColor: '#e0e0e0' },

  successBg: { backgroundColor: 'white', marginHorizontal: 0, paddingHorizontal: 24, width: '100%', maxWidth: '100%' },
  storiesGrid: { flexDirection: 'row', gap: 24, flexWrap: 'wrap', justifyContent: 'center' },
  storiesGridMobile: { flexDirection: 'column' },
  storyCard: { flex: 1, minWidth: 300, maxWidth: 380, backgroundColor: BG_CREAM, padding: 28, borderRadius: 16, borderWidth: 1, borderColor: '#e8e8e8' },
  storyRating: { flexDirection: 'row', gap: 4, marginBottom: 16 },
  storyQuote: { fontFamily: SYSTEM_FONT, fontSize: 16, color: TEXT_DARK, lineHeight: 26, marginBottom: 20, fontStyle: 'italic' },
  storyAuthor: { borderTopWidth: 1, borderTopColor: '#e0e0e0', paddingTop: 16 },
  storyName: { fontFamily: SYSTEM_FONT, fontSize: 16, fontWeight: '700', color: TEXT_DARK, marginBottom: 4 },
  storyRole: { fontFamily: SYSTEM_FONT, fontSize: 14, color: TEXT_GRAY },

  outcomesGrid: { flexDirection: 'row', gap: 24, flexWrap: 'wrap', justifyContent: 'center' },
  outcomesGridMobile: { flexDirection: 'column', alignItems: 'center' },
  outcomeCard: { flex: 1, minWidth: 250, maxWidth: 280, backgroundColor: '#fff', padding: 28, borderRadius: 16, borderWidth: 1, borderColor: '#f0f0f0', alignItems: 'center' },
  outcomeIconContainer: { marginBottom: 16 },
  outcomeTitle: { fontFamily: SYSTEM_FONT, fontWeight: '700', fontSize: 18, color: TEXT_DARK, marginBottom: 10, textAlign: 'center' },
  outcomeDesc: { fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_GRAY, lineHeight: 24, textAlign: 'center' },

  curriculumGrid: { gap: 32 },
  curriculumCard: { backgroundColor: '#fff', borderRadius: 16, padding: 32, borderWidth: 1, borderColor: '#f0f0f0' },
  cardHeader: { flexDirection: 'row', gap: 20, marginBottom: 24 },
  cardHeaderMobile: { flexDirection: 'column', alignItems: 'center', gap: 16 },
  stepBadge: { width: 48, height: 48, borderRadius: 12, backgroundColor: CTA_TEAL, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  stepBadgeText: { color: '#fff', fontWeight: '800', fontSize: 20 },
  cardTitle: { fontFamily: SYSTEM_FONT, fontSize: 22, fontWeight: '700', color: TEXT_DARK, marginBottom: 6 },
  cardDesc: { fontFamily: SYSTEM_FONT, fontSize: 16, color: TEXT_GRAY, lineHeight: 24 },
  topicList: { gap: 12 },
  topicItem: { backgroundColor: BG_CREAM, padding: 16, borderRadius: 10, borderWidth: 1, borderColor: '#e8e8e8' },
  topicHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  topicText: { fontSize: 15, fontWeight: '600', color: TEXT_DARK, flex: 1, lineHeight: 22 },

  timelineBg: { backgroundColor: '#f5f9ff', marginHorizontal: 0, paddingHorizontal: 24, width: '100%', maxWidth: '100%' },
  timelineContainer: { maxWidth: 800, alignSelf: 'center', width: '100%' },
  timelineItem: { flexDirection: 'row', gap: 24, marginBottom: 40 },
  timelineItemMobile: { flexDirection: 'column', alignItems: 'center', gap: 12 },
  timelineMarker: { alignItems: 'center', width: 40 },
  timelineDot: { width: 20, height: 20, borderRadius: 10, backgroundColor: CTA_TEAL, borderWidth: 4, borderColor: 'white', shadowColor: CTA_TEAL, shadowOpacity: 0.3, shadowRadius: 8 },
  timelineLine: { width: 2, flex: 1, backgroundColor: '#d0d0d0', marginTop: 8 },
  timelineContent: { flex: 1, paddingBottom: 20 },
  timelineWeek: { fontFamily: SYSTEM_FONT, fontSize: 14, fontWeight: '700', color: CTA_TEAL, marginBottom: 8, textTransform: 'uppercase' },
  timelineTitle: { fontFamily: SYSTEM_FONT, fontSize: 20, fontWeight: '700', color: TEXT_DARK, marginBottom: 8 },
  timelineDesc: { fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_GRAY, lineHeight: 24 },

  mistakesContainer: { gap: 20 },
  mistakeCard: { backgroundColor: '#fff', padding: 24, borderRadius: 12, borderWidth: 1, borderColor: '#f0f0f0', borderLeftWidth: 4, borderLeftColor: BRAND_ORANGE },
  mistakeHeader: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 12 },
  mistakeText: { fontFamily: SYSTEM_FONT, fontSize: 16, fontWeight: '600', color: TEXT_DARK, flex: 1, lineHeight: 24 },
  mistakeFix: { fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_GRAY, lineHeight: 24, paddingLeft: 48 },

  mentorBg: { backgroundColor: 'white', marginHorizontal: 0, paddingHorizontal: 24, width: '100%', maxWidth: '100%' },
  credentialsGrid: { flexDirection: 'row', gap: 24, flexWrap: 'wrap', justifyContent: 'center' },
  credentialsGridMobile: { flexDirection: 'column' },
  credentialCard: { flex: 1, minWidth: 250, maxWidth: 280, backgroundColor: BG_CREAM, padding: 24, borderRadius: 16, borderWidth: 1, borderColor: '#e8e8e8', alignItems: 'center' },
  credentialTitle: { fontFamily: SYSTEM_FONT, fontSize: 17, fontWeight: '700', color: TEXT_DARK, marginTop: 16, marginBottom: 8, textAlign: 'center' },
  credentialDesc: { fontFamily: SYSTEM_FONT, fontSize: 14, color: TEXT_GRAY, lineHeight: 22, textAlign: 'center' },

  faqContainer: { maxWidth: 800, alignSelf: 'center', width: '100%' },
  faqCard: { backgroundColor: '#fff', padding: 28, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#f0f0f0' },
  faqQuestion: { fontSize: 18, fontWeight: '700', color: TEXT_DARK, marginBottom: 12, fontFamily: SYSTEM_FONT },
  faqAnswer: { fontSize: 16, color: TEXT_GRAY, lineHeight: 26, fontFamily: SYSTEM_FONT },

  finalCta: { backgroundColor: '#222', paddingVertical: 80, paddingHorizontal: 24, alignItems: 'center' },
  finalCtaTitle: { fontFamily: SYSTEM_FONT, fontSize: 40, fontWeight: '900', color: '#fff', marginBottom: 16, textAlign: 'center', maxWidth: 700 },
  finalCtaSubtitle: { fontFamily: SYSTEM_FONT, fontSize: 18, color: 'rgba(255,255,255,0.8)', marginBottom: 40, textAlign: 'center', maxWidth: 600, lineHeight: 28 },
  finalCtaButton: { backgroundColor: CTA_TEAL, paddingHorizontal: 48, paddingVertical: 18, borderRadius: 100, marginBottom: 16 },
  finalCtaButtonText: { fontFamily: SYSTEM_FONT, fontWeight: '700', color: '#fff', fontSize: 18 },
  finalCtaNote: { fontSize: 14, color: 'rgba(255,255,255,0.7)', textAlign: 'center' },
}); 