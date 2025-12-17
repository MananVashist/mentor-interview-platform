// components/landing/LazySections.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Image, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Footer } from '@/components/Footer';
import { 
  Icon, 
  StatItem, 
  TrackCard, 
  WorkStep, 
  ReviewCard, 
  Button 
} from '@/lib/ui';

// --- Re-declare necessary constants/data needed for this section ---
const CTA_TEAL = '#18a7a7';
const BRAND_ORANGE = '#f58742';
const TEXT_DARK = '#222';
const TEXT_GRAY = '#555';

const SYSTEM_FONT = Platform.select({
  web: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
  ios: "System",
  android: "Roboto",
  default: "System"
}) as string;

const MENTOR_TIERS = [
  { level: 'Bronze', icon: 'medal-outline', color: '#CD7F32', perks: ['Access to Bronze Badge', 'Community Recognition'] },
  { level: 'Silver', icon: 'medal', color: '#C0C0C0', perks: ['LinkedIn Appreciation Post', 'Access to Silver Badge', 'Priority Support'] },
  { level: 'Gold', icon: 'trophy', color: '#FFD700', perks: ['LinkedIn Appreciation Post', 'Access to Gold Badge', 'Exclusive Community Group'] },
];

const TRACKS = [
  { id: 'pm', title: 'Product Management', description: 'Master product sense, execution, metrics, and strategy interviews.', icon: 'clipboard-flow', iconColor: '#2196F3', skills: ['Product Sense / Design', 'Execution & Analytics', 'Strategy & Market', 'Technical Basics', 'Behavioral & Leadership'] },
  { id: 'data-analytics', title: 'Data & Business Analysis', description: 'Solve business cases with SQL, metrics, and data-driven insights.', icon: 'chart-box', iconColor: '#4CAF50', skills: ['SQL & Querying', 'Case Studies (Data → Insight)', 'Product Metrics', 'Excel / Visualization', 'Stakeholder Comm.'] },
  { id: 'data-science', title: 'Data Science / ML', description: 'Build robust models, scalable ML systems, and debug real-world issues.', icon: 'brain', iconColor: '#FF9800', skills: ['ML Theory & Algos', 'Practical ML Debugging', 'Coding (Python/Pandas)', 'Stats & Experimentation', 'System Design (ML)'] },
  { id: 'hr', title: 'HR & Behavioral', description: 'Ace culture fit, recruitment operations, and situational questions.', icon: 'account-group', iconColor: '#9C27B0', skills: ['Behavioral / Scenarios', 'Recruitment Ops', 'Stakeholder Mgmt', 'Cultural Fit', 'Legal & Compliance'] },
];

// 🟢 Default Export is required for React.lazy
export default function LazySections() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isSmall = width < 900;

  return (
    <View>
      {/* --- ROLE TRACKS --- */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionKicker}>Specialized Tracks</Text>
        <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile, { marginBottom: 16 }]}>
          Choose your domain and interview type
        </Text>
        <View style={[styles.grid, isSmall && styles.gridMobile]}>
          {TRACKS.map((track) => (
            <TrackCard 
              key={track.id}
              icon={track.icon}
              iconColor={track.iconColor}
              title={track.title} 
              description={track.description}
              skills={track.skills}
            />
          ))}
        </View>
      </View>

      {/* --- VETTING PROCESS --- */}
      <View style={styles.sectionContainer}>
        <View style={[styles.infoBox, { backgroundColor: CTA_TEAL }, isSmall && styles.infoBoxMobile]}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.infoBoxKicker, { color: 'rgba(255,255,255,0.7)' }]}>TOP 3% ONLY</Text>
            <Text style={styles.infoBoxTitle}>Rigorous Quality Control</Text>
            <Text style={styles.infoBoxText}>
              We don't let just anyone on the platform. Every mentor goes through a strict 3-step verification process.
            </Text>
          </View>
          <View style={styles.stepsContainer}>
            <View style={styles.stepRow}>
              <View style={styles.stepBadge}><Text style={styles.stepBadgeText}>1</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.stepTitle}>Identity Check</Text>
                <Text style={styles.stepDesc}>Work profile verification.</Text>
              </View>
            </View>
            <View style={styles.stepRow}>
              <View style={styles.stepBadge}><Text style={styles.stepBadgeText}>2</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.stepTitle}>Experience</Text>
                <Text style={styles.stepDesc}>Significant interview conduction experience.</Text>
              </View>
            </View>
            <View style={styles.stepRow}>
              <View style={styles.stepBadge}><Text style={styles.stepBadgeText}>3</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.stepTitle}>Test Run</Text>
                <Text style={styles.stepDesc}>We test the interviewing skills of the mentor</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* --- HOW IT WORKS --- */}
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

      {/* --- REVIEWS --- */}
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

      {/* --- STATS SECTION --- */}
      <View style={styles.statsSection}>
        <View style={[styles.statsContent, isSmall && styles.statsContentMobile]}>
          <StatItem number="500+" label="Interviews Scheduled" icon="calendar-check" />
          {!isSmall && <View style={styles.statDivider} />}
          <StatItem number="15+" label="Expert Mentors" icon="account-tie" />
          {!isSmall && <View style={styles.statDivider} />}
          <StatItem number="4.9" label="Average Rating" icon="star" />
        </View>
      </View>

      {/* --- MENTOR GAMIFICATION --- */}
      <View style={styles.sectionContainer}>
        <View style={[styles.infoBox, { backgroundColor: CTA_TEAL, flexDirection: 'column', gap: 40, paddingVertical: 60 }]}>
          
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
                  <Icon name={tier.icon} size={28} color="#fff" />
                  <Text style={styles.tierTitle}>{tier.level}</Text>
                </View>
                <View style={styles.tierBody}>
                  {tier.perks.map((perk, i) => (
                    <View key={i} style={styles.perkRow}>
                      <Icon name="check-circle-outline" size={18} color={tier.color} />
                      <Text style={styles.perkText}>{perk}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
          
          <View style={{ alignItems: 'center', width: '100%' }}>
             <Button 
              title="Apply to be a Mentor" 
              onPress={() => router.push('/auth/sign-up')} 
              variant="white"
              style={styles.btnWhite} 
              textStyle={styles.btnTextDark}
            />
          </View>
        </View>
      </View>

      {/* --- SAFETY --- */}
      <View style={[styles.sectionContainer, { marginBottom: 60 }]}>
        <View style={[styles.infoBox, { backgroundColor: BRAND_ORANGE }, isSmall && styles.infoBoxMobile]}>
          <View style={{ flex: 1, alignItems: isSmall ? 'center' : 'flex-start' }}>
            <Text style={styles.infoBoxTitle}>Safe & Anonymous</Text>
            <Text style={[styles.infoBoxText, isSmall && { textAlign: 'center' }]}>We protect your identity. Your camera stays off if you want. Your name is hidden.</Text>
          </View>
          <View style={{ flex: 1, gap: 15, alignItems: isSmall ? 'center' : 'flex-start' }}>
            <View style={styles.checkRow}><Text>✅</Text><Text style={styles.checkText}>Identity Blind</Text></View>
            <View style={styles.checkRow}><Text>✅</Text><Text style={styles.checkText}>Money Back Guarantee</Text></View>
          </View>
        </View>
      </View>

      {/* --- CTA FOOTER --- */}
      <View style={styles.bottomCtaSection}>
        <Text style={styles.bottomCtaTitle}>Ready to get hired?</Text>
        <Text style={styles.bottomCtaSubtitle}>Join thousands of candidates preparing today.</Text>
        <Button 
          title="Get Started" 
          onPress={() => router.push('/auth/sign-up')}
          style={styles.bottomCtaButton}
          textStyle={styles.bottomCtaButtonText}
        />
      </View>
      
      <Footer />
    </View>
  );
}

// Styles specific to these sections (Copied from original index)
const styles = StyleSheet.create({
  sectionContainer: { maxWidth: 1200, width: '100%', alignSelf: 'center', paddingHorizontal: 24, paddingVertical: 60 },
  grid: { flexDirection: 'row', gap: 20, flexWrap: 'wrap' },
  gridMobile: { flexDirection: 'column' },
  reviewsBg: { marginTop: 0, paddingVertical: 60 },
  sectionKicker: { fontFamily: SYSTEM_FONT, fontWeight: '700', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1.5, color: CTA_TEAL, marginBottom: 12, textAlign: 'center' },
  sectionTitle: { fontFamily: SYSTEM_FONT, fontWeight: '800', fontSize: 36, color: TEXT_DARK, marginBottom: 16, textAlign: 'center' },
  sectionTitleMobile: { fontSize: 28 },
  sectionDesc: { fontFamily: SYSTEM_FONT, fontSize: 16, color: TEXT_GRAY, textAlign: 'center', maxWidth: 700, marginBottom: 40, lineHeight: 24, alignSelf: 'center' },
  
  // Stats
  statsSection: { backgroundColor: '#fff', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#eee', paddingVertical: 32, marginTop: 40 },
  statsContent: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', maxWidth: 1000, alignSelf: 'center', width: '100%', gap: 40 },
  statsContentMobile: { flexDirection: 'column', gap: 24 },
  statDivider: { width: 1, height: 40, backgroundColor: '#eee' },

  // Mentor Cards
  tierCard: { flex: 1, minWidth: 280, backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', borderWidth: 2 },
  tierHeader: { padding: 20, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10 },
  tierTitle: { color: '#fff', fontSize: 20, fontWeight: '800', textTransform: 'uppercase' },
  tierBody: { padding: 24, gap: 12 },
  perkRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  perkText: { fontSize: 15, color: '#444', lineHeight: 22, flex: 1 },
  
  btnWhite: { backgroundColor: '#fff', paddingHorizontal: 32, paddingVertical: 16, borderRadius: 100 },
  btnTextDark: { color: '#222', fontWeight: '800', fontSize: 16 },

  howItWorksGrid: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 40 },
  arrow: { fontSize: 30, color: '#ddd', marginHorizontal: 10, marginTop: -40 },
  
  // Info Box
  infoBox: { borderRadius: 24, padding: 50, flexDirection: 'row', gap: 60, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 20, shadowOffset: {width: 0, height: 10} },
  infoBoxMobile: { flexDirection: 'column', padding: 30, gap: 30 },
  infoBoxKicker: { fontSize: 12, fontWeight: '700', letterSpacing: 1.5, marginBottom: 10 },
  infoBoxTitle: { color: '#fff', fontSize: 32, fontWeight: '800', marginBottom: 16 },
  infoBoxText: { color: 'rgba(255,255,255,0.95)', fontSize: 18, lineHeight: 28 },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  stepsContainer: { flex: 1, gap: 24 },
  stepRow: { flexDirection: 'row', gap: 16, alignItems: 'flex-start' },
  stepBadge: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  stepBadgeText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  stepTitle: { color: '#fff', fontWeight: '700', fontSize: 16, marginBottom: 4 },
  stepDesc: { color: 'rgba(255,255,255,0.8)', fontSize: 14, lineHeight: 20 },

  bottomCtaSection: { paddingVertical: 100, paddingHorizontal: 24, alignItems: 'center', backgroundColor: 'transparent' },
  bottomCtaTitle: { fontFamily: SYSTEM_FONT, fontWeight: '800', fontSize: 40, color: TEXT_DARK, marginBottom: 16, textAlign: 'center' },
  bottomCtaSubtitle: { fontFamily: SYSTEM_FONT, fontSize: 20, color: TEXT_GRAY, marginBottom: 40, textAlign: 'center' },
  bottomCtaButton: { backgroundColor: CTA_TEAL, paddingHorizontal: 48, paddingVertical: 18, borderRadius: 100 },
  bottomCtaButtonText: { fontFamily: SYSTEM_FONT, fontWeight: '700', color: '#fff', fontSize: 18 },
});