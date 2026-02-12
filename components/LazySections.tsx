// components/LazySections.tsx
import React, { memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
  Image as RNImage,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Asset } from 'expo-asset';
import { Footer } from './Footer'; 

// 🟢 NEW: Import Optimized Icons
import { 
  FeedbackIcon, VideoIcon, StarIcon, 
  BronzeBadge, SilverBadge, GoldBadge 
} from './AppIcons';

// 🟢 MOVED IMAGES HERE (Lazy Loaded)
import GoogleImg from '../assets/companies/Google.png';
import MetaImg from '../assets/companies/Meta.png';
import AmazonImg from '../assets/companies/Amazon.webp';
import MicrosoftImg from '../assets/companies/Microsoft.webp';
import CapgeminiImg from '../assets/companies/Capgemini.png';
import AdobeImg from '../assets/companies/Adobe.png';   

// --- CONSTANTS ---
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

// --- DATA ---
const COMPANIES = [ 
  { name: 'Google', image: GoogleImg, width: 100 },
  { name: 'Meta', image: MetaImg, width: 110 },
  { name: 'Amazon', image: AmazonImg, width: 90 },
  { name: 'Microsoft', image: MicrosoftImg, width: 110 },
  { name: 'Capgemini', image: CapgeminiImg, width: 120 },
  { name: 'Adobe', image: AdobeImg, width: 120 },   
];

const STATS = [
  { id: 1, number: '500+', label: 'Interviews Conducted' },
  { id: 2, number: '4.5★', label: 'Average Mentor Rating' },
];

const INTERVIEW_TRACKS = [
  { id: 'pm', emoji: '📊', title: 'Product Management', desc: 'Product sense, strategy, execution, technical, leadership', path: '/interviews/product-management' },
  { id: 'data-analytics', emoji: '📈', title: 'Data Analytics', desc: 'SQL, Case studies, Excel, business intelligence', path: '/interviews/data-analytics' },
  { id: 'data-science', emoji: '🤖', title: 'Data Science', desc: 'ML theory, Practical ML, statistics, modeling, coding', path: '/interviews/data-science' },
  { id: 'hr', emoji: '👥', title: 'HR Interviews', desc: 'Talent acquisition, HR generalist, HRBP, COE, HR operations', path: '/interviews/hr' },
];

const REVIEWS = [
  { id: 1, name: 'P.K.', role: 'Product Manager', company: 'Funded Startup', text: 'The anonymous format helped me practice without fear. Got honest feedback that directly improved my answers.', rating: 5 },
  { id: 2, name: 'A.M.', role: 'Data Analyst', company: 'Analytics Firm', text: 'The SQL round practice was exactly like my real interview. Landed the offer!', rating: 5 },
  { id: 3, name: 'S.K.', role: 'ML Engineer', company: 'AI Startup', text: 'Worth every rupee. The structured evaluation showed exactly where I was weak. Fixed those gaps and aced my next interview.', rating: 5 },
];

const FAQ = [
  { q: 'How does anonymous interviewing work?', a: 'Your name, photo, and personal details are hidden. You are identified only by your professional title (e.g., "Data Scientist at Uber"). Mentors see your role and resume (if you choose to upload it), nothing more. When you join the meeting, you can join and keep your video off' },
  { q: 'Are your mentors verified?', a: 'Yes. Every mentor is vetted manually. We verify employment history, LinkedIn profiles, and conduct background checks to ensure they work at top companies.' },
  { q: 'What happens in a session?', a: 'Book a 55-minute slot. Your mentor conducts a realistic mock interview focused on your chosen topic. After the session, you receive structured evaluation feedback covering strengths, gaps, and specific improvement areas.' },
  { q: 'Can I practice specific rounds?', a: 'Absolutely. Choose your interview profile (PM, Data, HR, etc.) and then select the specific topic you want to practice - like "Product Thinking", "SQL", or "Behavioral Questions".' },
  { q: 'Do you offer refunds?', a: 'Yes. If the mentor does not show up for the session, we provide a full refund. We record the session so its no problem' },
];

// 🗑️ DELETED INLINE SVGs (Now imported from AppIcons.tsx)

// --- COMPONENTS ---

// Simple Image for Lazy Loading
const SimpleImage = ({ source, style, alt }: any) => {
  const isWeb = Platform.OS === 'web';
  if (isWeb) {
    let src = typeof source === 'string' ? source : (source?.uri || Asset.fromModule(source)?.uri || '');
    if (src) return <img src={src} alt={alt} style={{...style, objectFit: 'contain'}} loading="lazy" decoding="async" />;
  }
  return <RNImage source={source} style={style} resizeMode="contain" accessible={true} accessibilityLabel={alt} />;
};

const LogoWall = memo(() => {
  const { width } = useWindowDimensions();
  const isSmall = width < 900;
  return (
    <View 
      style={styles.logoSection}
      nativeID="our-mentors"
      accessibilityRole="region"
      accessibilityLabel="Companies where our mentors work"
    >
      <Text style={styles.logoTitle} accessibilityRole="header" accessibilityLevel={2}>
        OUR MENTORS HAVE WORKED IN
      </Text>
      <View style={[styles.logoWall, isSmall && styles.logoWallMobile]}>
        {COMPANIES.map((company) => (
           <View key={company.name} style={styles.logoWrapper} accessibilityRole="image" accessibilityLabel={`${company.name} logo`}>
             <SimpleImage source={company.image} style={{ width: company.width, height: 35 }} alt={`${company.name} company logo`} />
           </View>
        ))}
      </View>
    </View>
  );
});

const InterviewTracks = memo(() => {
  const { width } = useWindowDimensions();
  const isSmall = width < 900;
  const router = useRouter();

  return (
    <View style={[styles.sectionContainer, styles.tracksSection]} nativeID="interview-tracks" accessibilityRole="region" accessibilityLabel="Interview practice tracks">
      <Text style={styles.sectionKicker} accessibilityRole="header">INTERVIEW TRACKS</Text>
      <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]} accessibilityRole="header" accessibilityLevel={2}>
        Choose Your Interview Track
      </Text>
      <View style={[styles.tracksGrid, isSmall && styles.tracksGridMobile]}>
        {INTERVIEW_TRACKS.map((track) => (
          <TouchableOpacity
            key={track.id}
            style={styles.trackCard}
            onPress={() => router.push(track.path as any)}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={`Practice ${track.title} interviews`}
          >
            <Text style={styles.trackEmoji}>{track.emoji}</Text>
            <Text style={styles.trackTitle}>{track.title}</Text>
            <Text style={styles.trackDesc}>{track.desc}</Text>
            <View style={styles.trackArrow}>
              <Text style={styles.trackArrowText}>→</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
});

const SocialProof = memo(() => {
  const { width } = useWindowDimensions();
  const isSmall = width < 900;

  return (
    <View style={styles.socialProofSection} nativeID="social-proof" accessibilityRole="region" accessibilityLabel="Our impact in numbers">
      <View style={[styles.statsGrid, isSmall && styles.statsGridMobile]}>
        {STATS.map((stat) => (
          <View key={stat.id} style={styles.statCard} accessibilityRole="text" accessibilityLabel={`${stat.number} ${stat.label}`}>
            <Text style={styles.statNumber}>{stat.number}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity 
        style={styles.linkedinButton}
        onPress={() => Linking.openURL('https://www.linkedin.com/company/crackjobs')}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Follow us on LinkedIn"
      >
        <Text style={styles.linkedinButtonText}>🔗 Follow on LinkedIn</Text>
      </TouchableOpacity>
    </View>
  );
});

const Reviews = memo(() => {
  const { width } = useWindowDimensions();
  const isSmall = width < 900;

  return (
    <View style={[styles.sectionContainer, styles.reviewsSection]} nativeID="reviews" accessibilityRole="region" accessibilityLabel="Customer testimonials">
      <Text style={styles.sectionKicker} accessibilityRole="header">TESTIMONIALS</Text>
      <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]} accessibilityRole="header" accessibilityLevel={2}>
        What Our Users Say
      </Text>
      <View style={[styles.reviewsGrid, isSmall && styles.reviewsGridMobile]}>
        {REVIEWS.map((review) => (
          <View key={review.id} style={styles.reviewCard} accessibilityRole="article" accessibilityLabel={`Review from ${review.name}`}>
            <View style={styles.reviewHeader}>
              <View style={styles.reviewHeaderLeft}>
                <Text style={styles.reviewName}>{review.name}</Text>
                <Text style={styles.reviewRole}>{review.role} • {review.company}</Text>
              </View>
              <View style={styles.reviewStarsContainer}>
                <Text style={styles.reviewStars} accessibilityLabel={`Rating: ${review.rating} stars`}>
                  {'⭐'.repeat(review.rating)}
                </Text>
              </View>
            </View>
            <Text style={styles.reviewText}>"{review.text}"</Text>
          </View>
        ))}
      </View>
    </View>
  );
});

const WhyChooseUs = memo(() => {
  const { width } = useWindowDimensions();
  const isSmall = width < 900;

  const BENEFITS = [
    { 
      icon: <FeedbackIcon />, 
      title: 'Structured Feedback', 
      desc: 'Detailed evaluation covering strengths, gaps, and actionable improvement areas',
      ariaLabel: 'Structured feedback benefit'
    },
    { 
      icon: <VideoIcon />, 
      title: 'Session Recording', 
      desc: 'Review your performance anytime with full session recordings',
      ariaLabel: 'Session recording benefit'
    },
    { 
      icon: <StarIcon />, 
      title: 'Verified Mentors', 
      desc: 'All mentors manually vetted and verified from top companies',
      ariaLabel: 'Verified mentors benefit'
    },
  ];

  return (
    <View style={styles.sectionContainer} nativeID="why-choose-us" accessibilityRole="region" accessibilityLabel="Why choose CrackJobs">
      <Text style={styles.sectionKicker} accessibilityRole="header">WHY CHOOSE US</Text>
      <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]} accessibilityRole="header" accessibilityLevel={2}>
        Practice with confidence
      </Text>
      <View style={[styles.benefitsGrid, isSmall && styles.benefitsGridMobile]}>
        {BENEFITS.map((benefit, i) => (
          <View key={i} style={styles.benefitCard} accessibilityRole="article" accessibilityLabel={benefit.ariaLabel}>
            <View style={styles.benefitIconContainer}>{benefit.icon}</View>
            <Text style={styles.benefitTitle}>{benefit.title}</Text>
            <Text style={styles.benefitDesc}>{benefit.desc}</Text>
          </View>
        ))}
      </View>

      <View style={styles.mentorCtaContainer}>
        <Text style={[styles.sectionTitle, { fontSize: 28, marginTop: 40, marginBottom: 24 }]} accessibilityRole="header">
          Want to become a mentor?
        </Text>
        <TouchableOpacity 
          style={styles.mentorCtaButton}
          onPress={() => Linking.openURL('https://crackjobs.com/auth/sign-up')}
          activeOpacity={0.9}
          accessibilityRole="button"
          accessibilityLabel="Apply to become a mentor"
        >
          <Text style={styles.mentorCtaButtonText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

const CandidateTiers = memo(() => {
  const { width } = useWindowDimensions();
  const isSmall = width < 900;

  const TIERS = [
    {
      badge: <BronzeBadge />,
      title: 'Bronze Tier',
      sessions: '0-5 Sessions',
      price: '₹3,500 - ₹6,000',
      color: '#cd7f32',
      bgColor: '#fff5e6',
      borderColor: '#cd7f32',
      benefits: [ 'Top performing mid-Level Managers', '5 - 10 yrs experienced','Best for: Strengthening basics' ],
      ariaLabel: 'Bronze tier pricing'
    },
    {
      badge: <SilverBadge />,
      title: 'Silver Tier',
      sessions: '5-15 Sessions',
      price: '₹6,000 - ₹10,000',
      color: '#c0c0c0',
      bgColor: '#f5f5f5',
      borderColor: '#c0c0c0',
      benefits: ['Senior Management from top companies', '10-15 yrs experienced', 'Best for: Senior level interviews'],
      ariaLabel: 'Silver tier pricing'
    },
    {
      badge: <GoldBadge />,
      title: 'Gold Tier',
      sessions: '15+ Sessions',
      price: '₹10,000 - ₹15,000',
      color: '#fbbf24',
      bgColor: '#fffbeb',
      borderColor: '#fbbf24',
      benefits: ['Leadership / Directors', '15-20 yrs experienced', 'Best for: Hiring manager or CXO rounds'],
      ariaLabel: 'Gold tier pricing'
    },
  ];

  return (
    <View style={styles.sectionContainer} nativeID="pricing" accessibilityRole="region" accessibilityLabel="Pricing tiers">
      <Text style={styles.sectionKicker} accessibilityRole="header">PRICING</Text>
      <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]} accessibilityRole="header" accessibilityLevel={2}>
        Choose Your Mentor Tier
      </Text>
      <View style={[styles.tiersGrid, isSmall && styles.tiersGridMobile]}>
        {TIERS.map((tier, i) => (
          <View key={i} style={[styles.tierCard, { backgroundColor: tier.bgColor, borderColor: tier.borderColor }]} accessibilityRole="article" accessibilityLabel={tier.ariaLabel}>
            <View style={styles.tierBadgeContainer}>{tier.badge}</View>
            <Text style={[styles.tierTitle, { color: tier.color }]}>{tier.title}</Text>
            <Text style={[styles.tierTitle, { fontSize: 24, marginBottom: 24, color: tier.color }]}>{tier.price}</Text>
            <View style={styles.tierBenefits}>
              {tier.benefits.map((benefit, j) => (
                <View key={j} style={styles.tierBenefitRow}>
                  <Text style={[styles.tierBenefitBullet, { color: tier.color }]}>✓</Text>
                  <Text style={[styles.tierBenefitText, { color: TEXT_DARK }]}>{benefit}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
});

const FAQSection = memo(() => {
  const { width } = useWindowDimensions();
  const isSmall = width < 900;

  return (
    <View style={styles.sectionContainer} nativeID="faq" accessibilityRole="region" accessibilityLabel="Frequently asked questions">
      <Text style={styles.sectionKicker} accessibilityRole="header">FAQ</Text>
      <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]} accessibilityRole="header" accessibilityLevel={2}>
        Common Questions
      </Text>
      <View style={styles.faqContainer}>
        {FAQ.map((item, i) => (
          <View key={i} style={styles.faqItem} accessibilityRole="article" accessibilityLabel={`Question: ${item.q}`}>
            <Text style={styles.faqQ} accessibilityRole="header">{item.q}</Text>
            <Text style={styles.faqA}>{item.a}</Text>
          </View>
        ))}
      </View>
    </View>
  );
});

const BottomCTA = memo(() => {
  const { width } = useWindowDimensions();
  const isSmall = width < 900;
  const router = useRouter();

  return (
    <View style={styles.ctaSection} nativeID="get-started" accessibilityRole="region" accessibilityLabel="Call to action">
      <View style={[styles.ctaInner, isSmall && styles.ctaInnerMobile]}>
        <Text style={[styles.ctaTitle, isSmall && styles.ctaTitleMobile]} accessibilityRole="header" accessibilityLevel={2}>
          Ready to ace your next interview?
        </Text>
        <Text style={[styles.ctaSubtitle, isSmall && styles.ctaSubtitleMobile]}>
          Join hundreds of successful candidates who practiced with us
        </Text>
        <TouchableOpacity 
          style={styles.ctaButton}
          onPress={() => router.push('/auth/sign-up')}
          activeOpacity={0.9}
          accessibilityRole="button"
          accessibilityLabel="Get Started"
        >
          <Text style={styles.ctaButtonText}>GET STARTED</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

export default function LazySections() {
  return (
    <>
      <LogoWall />
      <InterviewTracks />
      <SocialProof />
      <Reviews />
      <WhyChooseUs />
      <CandidateTiers />
      <FAQSection />
      <BottomCTA />
      <Footer />
    </>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  sectionContainer: { maxWidth: 1200, width: '100%', alignSelf: 'center', paddingHorizontal: 24, paddingVertical: 60 },
  sectionKicker: { fontFamily: SYSTEM_FONT, fontWeight: '700', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1.5, color: CTA_TEAL, marginBottom: 12, textAlign: 'center' },
  sectionTitle: { fontFamily: SYSTEM_FONT, fontWeight: '800', fontSize: 36, color: TEXT_DARK, marginBottom: 48, textAlign: 'center' },
  sectionTitleMobile: { fontSize: 28 },
  logoSection: { backgroundColor: '#fff', paddingVertical: 50, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#f0f0f0' },
  logoTitle: { textAlign: 'center', fontSize: 15, fontWeight: '500', color: '#bbb', marginBottom: 30, letterSpacing: 1.5, textTransform: 'uppercase' },
  logoWall: { flexDirection: 'row', justifyContent: 'center', gap: 60, flexWrap: 'wrap', alignItems: 'center' },
  logoWallMobile: { gap: 30, paddingHorizontal: 20 },
  logoWrapper: { height: 50, justifyContent: 'center', alignItems: 'center' },
  socialProofSection: { backgroundColor: BG_CREAM, paddingVertical: 60, paddingHorizontal: 24, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  statsGrid: { flexDirection: 'row', justifyContent: 'center', gap: 48, flexWrap: 'wrap', maxWidth: 900, alignSelf: 'center', width: '100%', marginBottom: 32 },
  statsGridMobile: { gap: 32, paddingHorizontal: 20 },
  statCard: { alignItems: 'center', minWidth: 140 },
  statNumber: { fontFamily: SYSTEM_FONT, fontWeight: '800', fontSize: 48, color: BRAND_ORANGE, marginBottom: 8, lineHeight: 52 },
  statLabel: { fontFamily: SYSTEM_FONT, fontSize: 14, color: TEXT_GRAY, textAlign: 'center', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  linkedinButton: { alignSelf: 'center', backgroundColor: '#0077b5', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  linkedinButtonText: { fontFamily: SYSTEM_FONT, fontSize: 15, fontWeight: '600', color: '#fff', letterSpacing: 0.3 },
  tracksSection: { backgroundColor: BG_CREAM },
  tracksGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 20, justifyContent: 'center' },
  tracksGridMobile: { flexDirection: 'column',alignItems: 'center' },
  trackCard: { flex: 1, minWidth: 260, maxWidth: 280, backgroundColor: '#fff', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#f0f0f0' },
  trackEmoji: { fontSize: 32, marginBottom: 12 },
  trackTitle: { fontFamily: SYSTEM_FONT, fontWeight: '700', fontSize: 18, color: TEXT_DARK, marginBottom: 8 },
  trackDesc: { fontFamily: SYSTEM_FONT, fontSize: 14, color: TEXT_GRAY, lineHeight: 20, marginBottom: 16 },
  trackArrow: { alignSelf: 'flex-start', backgroundColor: CTA_TEAL, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  trackArrowText: { color: '#fff', fontWeight: '700' },
  reviewsSection: { backgroundColor: '#fff', paddingVertical: 80 },
  reviewsGrid: { flexDirection: 'row', gap: 24, justifyContent: 'center', flexWrap: 'wrap' },
  reviewsGridMobile: { flexDirection: 'column',alignItems: 'center' },
  reviewCard: { flex: 1, minWidth: 280, maxWidth: 360, backgroundColor: BG_CREAM, padding: 24, borderRadius: 16, borderWidth: 1, borderColor: '#f0f0f0' },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, gap: 12 },
  reviewHeaderLeft: { flex: 1, flexShrink: 1, minWidth: 0 },
  reviewStarsContainer: { flexShrink: 0, paddingLeft: 8 },
  reviewName: { fontFamily: SYSTEM_FONT, fontWeight: '700', fontSize: 16, color: TEXT_DARK },
  reviewRole: { fontFamily: SYSTEM_FONT, fontSize: 13, color: TEXT_GRAY, marginTop: 2 },
  reviewStars: { fontSize: 16 },
  reviewText: { fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_DARK, lineHeight: 22, fontStyle: 'italic' },
  benefitsGrid: { flexDirection: 'row', gap: 32, justifyContent: 'center', alignItems: 'flex-start', maxWidth: 1200, alignSelf: 'center', marginBottom: 48 },
  benefitsGridMobile: { flexDirection: 'column', maxWidth: 600, gap: 16 },
  benefitCard: { flex: 1, maxWidth: 320, backgroundColor: '#fff', padding: 24, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#f0f0f0' },
  benefitIconContainer: { marginBottom: 16 },
  benefitTitle: { fontFamily: SYSTEM_FONT, fontWeight: '700', fontSize: 18, color: TEXT_DARK, marginBottom: 8, textAlign: 'center' },
  benefitDesc: { fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_GRAY, lineHeight: 22, textAlign: 'center' },
  mentorCtaContainer: { alignItems: 'center' },
  mentorCtaButton: { backgroundColor: CTA_TEAL, paddingVertical: 16, paddingHorizontal: 32, borderRadius: 100, minWidth: 200 },
  mentorCtaButtonText: { fontFamily: SYSTEM_FONT, fontSize: 16, fontWeight: '700', color: '#fff', textAlign: 'center' },
  tiersGrid: { flexDirection: 'row', gap: 24, justifyContent: 'center', alignItems: 'stretch', maxWidth: 1200, alignSelf: 'center' },
  tiersGridMobile: { flexDirection: 'column', maxWidth: 800, gap: 20 },
  tierCard: { flex: 1, maxWidth: 360, padding: 28, borderRadius: 16, alignItems: 'center', borderWidth: 2 },
  tierBadgeContainer: { marginBottom: 16 },
  tierTitle: { fontFamily: SYSTEM_FONT, fontWeight: '700', fontSize: 20, marginBottom: 4, textAlign: 'center' },
  tierSessions: { fontFamily: SYSTEM_FONT, fontSize: 14, marginBottom: 16, textAlign: 'center' },
  tierBenefits: { gap: 8, alignSelf: 'stretch' },
  tierBenefitRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  tierBenefitBullet: { fontFamily: SYSTEM_FONT, fontSize: 15, lineHeight: 24, fontWeight: '700' },
  tierBenefitText: { fontFamily: SYSTEM_FONT, fontSize: 15, lineHeight: 24, flex: 1 },
  faqContainer: { maxWidth: 800, alignSelf: 'center', width: '100%', gap: 24 },
  faqItem: { backgroundColor: '#fff', padding: 24, borderRadius: 12, borderWidth: 1, borderColor: '#f0f0f0' },
  faqQ: { fontFamily: SYSTEM_FONT, fontWeight: '700', fontSize: 16, color: TEXT_DARK, marginBottom: 8 },
  faqA: { fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_GRAY, lineHeight: 22 },
  ctaSection: { backgroundColor: BRAND_ORANGE, paddingVertical: 80 },
  ctaInner: { maxWidth: 700, alignSelf: 'center', alignItems: 'center', paddingHorizontal: 24 },
  ctaInnerMobile: { paddingHorizontal: 32 },
  ctaTitle: { fontFamily: SYSTEM_FONT, fontWeight: '800', fontSize: 40, color: '#fff', marginBottom: 16, textAlign: 'center' },
  ctaTitleMobile: { fontSize: 28 },
  ctaSubtitle: { fontFamily: SYSTEM_FONT, fontSize: 18, color: '#fff', marginBottom: 32, textAlign: 'center', opacity: 0.95 },
  ctaSubtitleMobile: { fontSize: 16 },
  ctaButton: { backgroundColor: '#fff', paddingHorizontal: 40, paddingVertical: 16, borderRadius: 100 },
  ctaButtonText: { fontFamily: SYSTEM_FONT, fontWeight: '700', fontSize: 16, color: BRAND_ORANGE },
});