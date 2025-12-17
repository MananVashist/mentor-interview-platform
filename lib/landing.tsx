// lib/landing.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { getIconComponent } from './ui';
import { LANDING_COLORS, MENTOR_LEVELS } from '@/constants';

const { ctaTeal, brandOrange, textDark, textGray, bgCream } = LANDING_COLORS;

const SYSTEM_FONT = Platform.select({
  web: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
  ios: "System",
  android: "Roboto",
  default: "System"
}) as string;

// Data
const COMPANIES = [
  { name: 'Google', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/368px-Google_2015_logo.svg.png', width: 100 },
  { name: 'Meta', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/640px-Meta_Platforms_Inc._logo.svg.png', width: 110 },
  { name: 'Amazon', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/603px-Amazon_logo.svg.png', width: 90 },
  { name: 'Microsoft', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/640px-Microsoft_logo_%282012%29.svg.png', width: 110 },
  { name: 'Capgemini', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Capgemini_201x_logo.svg/640px-Capgemini_201x_logo.svg.png', width: 120 },
  { name: 'Adobe', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Adobe_Corporate_logo.svg/1200px-Adobe_Corporate_logo.svg.png', width: 120 },
];

const TRACKS = [
  { id: 'pm', title: 'Product Management', description: 'Master product sense, execution, metrics, and strategy interviews.', icon: 'clipboard-flow', iconColor: '#2196F3', skills: ['Product Sense / Design', 'Execution & Analytics', 'Strategy & Market', 'Technical Basics', 'Behavioral & Leadership'] },
  { id: 'data-analytics', title: 'Data & Business Analysis', description: 'Solve business cases with SQL, metrics, and data-driven insights.', icon: 'chart-box', iconColor: '#4CAF50', skills: ['SQL & Querying', 'Case Studies (Data → Insight)', 'Product Metrics', 'Excel / Visualization', 'Stakeholder Comm.'] },
  { id: 'data-science', title: 'Data Science / ML', description: 'Build robust models, scalable ML systems, and debug real-world issues.', icon: 'brain', iconColor: '#FF9800', skills: ['ML Theory & Algos', 'Practical ML Debugging', 'Coding (Python/Pandas)', 'Stats & Experimentation', 'System Design (ML)'] },
  { id: 'hr', title: 'HR & Behavioral', description: 'Ace culture fit, recruitment operations, and situational questions.', icon: 'account-group', iconColor: '#9C27B0', skills: ['Behavioral / Scenarios', 'Recruitment Ops', 'Stakeholder Mgmt', 'Cultural Fit', 'Legal & Compliance'] },
];

const MENTOR_TIERS = [
  { level: 'Bronze', icon: 'medal-outline', color: MENTOR_LEVELS.bronze.color, perks: ['Access to Bronze Badge', 'Community Recognition'] },
  { level: 'Silver', icon: 'medal', color: MENTOR_LEVELS.silver.color, perks: ['LinkedIn Appreciation Post', 'Access to Silver Badge', 'Priority Support'] },
  { level: 'Gold', icon: 'trophy', color: MENTOR_LEVELS.gold.color, perks: ['LinkedIn Appreciation Post', 'Access to Gold Badge', 'Exclusive Community Group'] },
];

// Helper Components
const TrackCard = ({ icon, iconColor, title, description, skills }: any) => (
  <View style={styles.card}>
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 12 }}>
      {getIconComponent(icon, 32, iconColor)}
      <Text style={styles.cardTitle}>{title}</Text>
    </View>
    <Text style={styles.cardBody}>{description}</Text>
    <View style={styles.skillsContainer}>
      {skills.map((skill: string, index: number) => (
        <View key={index} style={styles.skillChip}><Text style={styles.skillText}>{skill}</Text></View>
      ))}
    </View>
  </View>
);

const WorkStep = ({ icon, title, desc }: any) => (
  <View style={styles.workStepCard}>
    <Text style={styles.workStepIcon}>{icon}</Text>
    <Text style={styles.workStepTitle}>{title}</Text>
    <Text style={styles.workStepDesc}>{desc}</Text>
  </View>
);

const ReviewCard = ({ text, title, subtitle }: any) => (
  <View style={styles.reviewCard}>
    <Text style={styles.reviewStars}>⭐⭐⭐⭐⭐</Text>
    <Text style={styles.reviewText}>"{text}"</Text>
    <View style={styles.reviewAuthor}>
      <View style={styles.avatarPlaceholder}><Text style={{fontSize: 12}}>💼</Text></View>
      <View>
        <Text style={styles.authorName}>{title}</Text>
        <Text style={styles.authorRole}>{subtitle}</Text>
      </View>
    </View>
  </View>
);

const StatItem = ({ number, label, icon }: any) => (
  <View style={styles.statItem}>
    <View style={{ marginBottom: 8 }}>
      {getIconComponent(icon, 32, ctaTeal)}
    </View>
    <Text style={styles.statNumber}>{number}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

// ========== SECTIONS ==========

export const LogoWallSection = ({ isSmall }: { isSmall: boolean }) => (
  <View style={styles.logoSection}>
    <Text style={styles.logoTitle}>OUR MENTORS HAVE WORKED IN</Text>
    <View style={[styles.logoWall, isSmall && styles.logoWallMobile]}>
      {COMPANIES.map((company) => (
        <View key={company.name} style={styles.logoWrapper}>
          <Image 
            source={{ uri: company.url }} 
            style={[styles.logoImage, { width: company.width }]} 
            resizeMode="contain"
            width={company.width}
            height={35}
          />
        </View>
      ))}
    </View>
  </View>
);

export const RoleTracksSection = ({ isSmall }: { isSmall: boolean }) => (
  <View style={styles.sectionContainer}>
    <Text style={styles.sectionKicker}>Specialized Tracks</Text>
    <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile, { marginBottom: 16 }]}>
      Choose your domain and interview type
    </Text>
    <View style={[styles.grid, isSmall && styles.gridMobile]}>
      {TRACKS.map((track) => (
        <TrackCard key={track.id} {...track} />
      ))}
    </View>
  </View>
);

export const VettingProcessSection = ({ isSmall }: { isSmall: boolean }) => (
  <View style={styles.sectionContainer}>
    <View style={[styles.infoBox, { backgroundColor: ctaTeal }, isSmall && styles.infoBoxMobile]}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.infoBoxKicker, { color: 'rgba(255,255,255,0.7)' }]}>TOP 3% ONLY</Text>
        <Text style={styles.infoBoxTitle}>Rigorous Quality Control</Text>
        <Text style={styles.infoBoxText}>
          We don't let just anyone on the platform. Every mentor goes through a strict 3-step verification process.
        </Text>
      </View>
      <View style={styles.stepsContainer}>
        {[
          { title: 'Identity Check', desc: 'Work profile verification.' },
          { title: 'Experience', desc: 'Significant interview conduction experience.' },
          { title: 'Test Run', desc: 'We test the interviewing skills of the mentor' },
        ].map((step, i) => (
          <View key={i} style={styles.stepRow}>
            <View style={styles.stepBadge}><Text style={styles.stepBadgeText}>{i + 1}</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepDesc}>{step.desc}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  </View>
);

export const HowItWorksSection = ({ isSmall }: { isSmall: boolean }) => (
  <View style={styles.sectionContainer}>
    <Text style={styles.sectionKicker}>Process</Text>
    <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}>How it works</Text>
    <View style={[styles.howItWorksGrid, isSmall && styles.gridMobile]}>
      <WorkStep icon="🔍" title="1. Select Profile" desc="Filter by skills and choose the exact mentor profile." />
      {!isSmall && <Text style={styles.arrow}>→</Text>}
      <WorkStep icon="🔒" title="2. Secure Payment" desc="Your money is held in escrow until the session is done." />
      {!isSmall && <Text style={styles.arrow}>→</Text>}
      <WorkStep icon="📈" title="3. Get Feedback" desc="Receive a detailed performance scorecard within 24 hours." />
    </View>
  </View>
);

export const ReviewsSection = ({ isSmall }: { isSmall: boolean }) => (
  <View style={[styles.sectionContainer, styles.reviewsBg]}>
    <Text style={styles.sectionKicker}>Testimonials</Text>
    <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}>Success Stories</Text>
    <View style={[styles.grid, isSmall && styles.gridMobile]}>
      <ReviewCard 
        text="I failed my first Google PM interview miserably. After 3 sessions on CrackJobs, I realized my product sense structure was off. Cleared the L4 loop last week!" 
        title="Senior Product Manager"
        subtitle="Recently hired at Google"
      />
      <ReviewCard 
        text="The feedback is brutal but necessary. My mentor pointed out SQL edge cases and business logic flaws I never considered." 
        title="Data Analyst II"
        subtitle="Candidate for FAANG"
      />
      <ReviewCard 
        text="The ML System Design feedback was spot on. My mentor from Amazon helped me structure my model deployment strategy perfectly." 
        title="Machine Learning Engineer"
        subtitle="Transitioning from Research"
      />
    </View>
  </View>
);

export const StatsSection = ({ isSmall }: { isSmall: boolean }) => (
  <View style={styles.statsSection}>
    <View style={[styles.statsContent, isSmall && styles.statsContentMobile]}>
      <StatItem number="500+" label="Interviews Scheduled" icon="calendar-check" />
      {!isSmall && <View style={styles.statDivider} />}
      <StatItem number="15+" label="Expert Mentors" icon="account-tie" />
      {!isSmall && <View style={styles.statDivider} />}
      <StatItem number="4.9" label="Average Rating" icon="star" />
    </View>
  </View>
);

export const MentorGamificationSection = ({ isSmall, router }: any) => (
  <View style={styles.sectionContainer}>
    <View style={[styles.infoBox, { backgroundColor: ctaTeal, flexDirection: 'column', gap: 40, paddingVertical: 60 }]}>
      <View style={{ alignItems: 'center', maxWidth: 600, alignSelf: 'center' }}>
        <Text style={[styles.sectionKicker, { color: '#fff' }]}>Join the Community</Text>
        <Text style={[styles.sectionTitle, { color: '#fff', fontSize: 32 }]}>Why Become a Mentor?</Text>
        <Text style={[styles.sectionDesc, { color: 'rgba(255,255,255,0.7)', marginBottom: 0 }]}>
          Earn recognition, build your personal brand, and access exclusive networks.
        </Text>
      </View>
      <View style={[styles.grid, isSmall && styles.gridMobile, { justifyContent: 'center' }]}>
        {MENTOR_TIERS.map((tier) => (
          <View key={tier.level} style={[styles.tierCard, { borderColor: tier.color }]}>
            <View style={[styles.tierHeader, { backgroundColor: tier.color }]}>
              {getIconComponent(tier.icon, 28, '#fff')}
              <Text style={styles.tierTitle}>{tier.level}</Text>
            </View>
            <View style={styles.tierBody}>
              {tier.perks.map((perk, i) => (
                <View key={i} style={styles.perkRow}>
                  {getIconComponent('check-circle-outline', 18, tier.color)}
                  <Text style={styles.perkText}>{perk}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
      <View style={{ alignItems: 'center', width: '100%' }}>
        <TouchableOpacity style={styles.btnWhite} onPress={() => router.push('/auth/sign-up')}>
          <Text style={styles.btnTextDark}>Apply to be a Mentor</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

export const SafetySection = ({ isSmall }: { isSmall: boolean }) => (
  <View style={[styles.sectionContainer, { marginBottom: 60 }]}>
    <View style={[styles.infoBox, { backgroundColor: brandOrange }, isSmall && styles.infoBoxMobile]}>
      <View style={{ flex: 1, alignItems: isSmall ? 'center' : 'flex-start' }}>
        <Text style={styles.infoBoxTitle}>Safe & Anonymous</Text>
        <Text style={[styles.infoBoxText, isSmall && { textAlign: 'center' }]}>
          We protect your identity. Your camera stays off if you want. Your name is hidden.
        </Text>
      </View>
      <View style={{ flex: 1, gap: 15, alignItems: isSmall ? 'center' : 'flex-start' }}>
        <View style={styles.checkRow}><Text>✅</Text><Text style={styles.checkText}>Identity Blind</Text></View>
        <View style={styles.checkRow}><Text>✅</Text><Text style={styles.checkText}>Money Back Guarantee</Text></View>
      </View>
    </View>
  </View>
);

export const BottomCTASection = ({ isSmall, router }: any) => (
  <View style={styles.bottomCtaSection}>
    <Text style={styles.bottomCtaTitle}>Ready to get hired?</Text>
    <Text style={styles.bottomCtaSubtitle}>Join thousands of candidates preparing today.</Text>
    <TouchableOpacity style={styles.bottomCtaButton} onPress={() => router.push('/auth/sign-up')}>
      <Text style={styles.bottomCtaButtonText}>Get Started</Text>
    </TouchableOpacity>
  </View>
);

// ALL YOUR STYLES FROM LINES 475-592 GO HERE
const styles = StyleSheet.create({
  // Copy all your styles from index.tsx lines 475-592
  // I'll provide just the key ones for brevity:
  
  sectionContainer: { maxWidth: 1200, width: '100%', alignSelf: 'center', paddingHorizontal: 24, paddingVertical: 60 },
  logoSection: { backgroundColor: '#fff', paddingVertical: 50, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#f0f0f0' },
  logoTitle: { textAlign: 'center', fontSize: 15, fontWeight: '500', color: '#bbb', marginBottom: 30, letterSpacing: 1.5, textTransform: 'uppercase', fontFamily: SYSTEM_FONT },
  logoWall: { flexDirection: 'row', justifyContent: 'center', gap: 60, flexWrap: 'wrap', alignItems: 'center' },
  logoWallMobile: { gap: 30, paddingHorizontal: 20 },
  logoWrapper: { height: 50, justifyContent: 'center', alignItems: 'center' },
  logoImage: { height: 35 },
  
  sectionKicker: { fontFamily: SYSTEM_FONT, fontWeight: '700', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1.5, color: ctaTeal, marginBottom: 12, textAlign: 'center' },
  sectionTitle: { fontFamily: SYSTEM_FONT, fontWeight: '800', fontSize: 36, color: textDark, marginBottom: 16, textAlign: 'center' },
  sectionTitleMobile: { fontSize: 28 },
  sectionDesc: { fontFamily: SYSTEM_FONT, fontSize: 16, color: textGray, textAlign: 'center', maxWidth: 700, marginBottom: 40, lineHeight: 24, alignSelf: 'center' },
  
  grid: { flexDirection: 'row', gap: 20, flexWrap: 'wrap' },
  gridMobile: { flexDirection: 'column' },
  
  card: { flex: 1, minWidth: 280, backgroundColor: '#fff', padding: 28, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(0,0,0,0.04)', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
  cardTitle: { fontFamily: SYSTEM_FONT, fontWeight: '700', fontSize: 18, color: textDark },
  cardBody: { fontFamily: SYSTEM_FONT, fontSize: 15, color: textGray, lineHeight: 24, marginBottom: 20 },
  skillsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 'auto' },
  skillChip: { backgroundColor: '#f0f5f5', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  skillText: { fontSize: 12, fontWeight: '600', color: '#444', fontFamily: SYSTEM_FONT },
  
  infoBox: { borderRadius: 24, padding: 50, flexDirection: 'row', gap: 60, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 20, shadowOffset: {width: 0, height: 10} },
  infoBoxMobile: { flexDirection: 'column', padding: 30, gap: 30 },
  infoBoxKicker: { fontSize: 12, fontWeight: '700', letterSpacing: 1.5, marginBottom: 10 },
  infoBoxTitle: { color: '#fff', fontSize: 32, fontWeight: '800', marginBottom: 16 },
  infoBoxText: { color: 'rgba(255,255,255,0.95)', fontSize: 18, lineHeight: 28 },
  stepsContainer: { flex: 1, gap: 24 },
  stepRow: { flexDirection: 'row', gap: 16, alignItems: 'flex-start' },
  stepBadge: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  stepBadgeText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  stepTitle: { color: '#fff', fontWeight: '700', fontSize: 16, marginBottom: 4 },
  stepDesc: { color: 'rgba(255,255,255,0.8)', fontSize: 14, lineHeight: 20 },
  
  howItWorksGrid: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 40 },
  workStepCard: { flex: 1, alignItems: 'center', padding: 20 },
  workStepIcon: { fontSize: 48, marginBottom: 16 },
  workStepTitle: { fontFamily: SYSTEM_FONT, fontWeight: '700', fontSize: 18, color: textDark, marginBottom: 8, textAlign: 'center' },
  workStepDesc: { fontFamily: SYSTEM_FONT, fontSize: 15, color: textGray, textAlign: 'center', lineHeight: 22 },
  arrow: { fontSize: 30, color: '#ddd', marginHorizontal: 10, marginTop: -40 },
  
  reviewsBg: { marginTop: 0, paddingVertical: 60 },
  reviewCard: { flex: 1, minWidth: 280, backgroundColor: '#fff', padding: 32, borderRadius: 12, borderWidth: 1, borderColor: '#eaeaea' },
  reviewStars: { marginBottom: 16, fontSize: 12, letterSpacing: 2 },
  reviewText: { fontFamily: SYSTEM_FONT, fontSize: 16, color: '#333', lineHeight: 26, fontStyle: 'italic', marginBottom: 24 },
  reviewAuthor: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarPlaceholder: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#e0f5f5', alignItems: 'center', justifyContent: 'center' },
  authorName: { fontWeight: '700', fontSize: 14, color: textDark },
  authorRole: { fontSize: 12, color: textGray, marginTop: 2 },
  
  statsSection: { backgroundColor: '#fff', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#eee', paddingVertical: 32, marginTop: 40 },
  statsContent: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', maxWidth: 1000, alignSelf: 'center', width: '100%', gap: 40 },
  statsContentMobile: { flexDirection: 'column', gap: 24 },
  statItem: { alignItems: 'center', flex: 1 },
  statNumber: { fontSize: 32, fontWeight: '800', color: textDark, fontFamily: SYSTEM_FONT },
  statLabel: { fontSize: 14, color: textGray, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 },
  statDivider: { width: 1, height: 40, backgroundColor: '#eee' },
  
  tierCard: { flex: 1, minWidth: 280, backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', borderWidth: 2 },
  tierHeader: { padding: 20, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10 },
  tierTitle: { color: '#fff', fontSize: 20, fontWeight: '800', textTransform: 'uppercase' },
  tierBody: { padding: 24, gap: 12 },
  perkRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  perkText: { fontSize: 15, color: '#444', lineHeight: 22, flex: 1 },
  btnWhite: { backgroundColor: '#fff', paddingHorizontal: 32, paddingVertical: 16, borderRadius: 100, alignItems: 'center', justifyContent: 'center' },
  btnTextDark: { color: '#222', fontWeight: '800', fontSize: 16, textAlign: 'center' },
  
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  
  bottomCtaSection: { paddingVertical: 100, paddingHorizontal: 24, alignItems: 'center', backgroundColor: 'transparent' },
  bottomCtaTitle: { fontFamily: SYSTEM_FONT, fontWeight: '800', fontSize: 40, color: textDark, marginBottom: 16, textAlign: 'center' },
  bottomCtaSubtitle: { fontFamily: SYSTEM_FONT, fontSize: 20, color: textGray, marginBottom: 40, textAlign: 'center' },
  bottomCtaButton: { backgroundColor: ctaTeal, paddingHorizontal: 48, paddingVertical: 18, borderRadius: 100 },
  bottomCtaButtonText: { fontFamily: SYSTEM_FONT, fontWeight: '700', color: '#fff', fontSize: 18 },
});