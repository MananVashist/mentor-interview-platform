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
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { Footer } from './Footer'; 

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
  { id: 2, number: '4.8★', label: 'Average Mentor Rating' },
];

const INTERVIEW_TRACKS = [
  { id: 'pm', emoji: '📊', title: 'Product Management', desc: 'Product sense, strategy, execution', path: '/interviews/product-management' },
  { id: 'data-analytics', emoji: '📈', title: 'Data Analytics', desc: 'SQL, Python, business intelligence', path: '/interviews/data-analytics' },
  { id: 'data-science', emoji: '🤖', title: 'Data Science', desc: 'ML, statistics, modeling', path: '/interviews/data-science' },
  { id: 'hr', emoji: '👥', title: 'HR Interviews', desc: 'Behavioral, situational questions', path: '/interviews/hr' },
];

const REVIEWS = [
  { id: 1, name: 'P.K.', role: 'Product Manager at Loco', company: 'Funded Startup', text: 'The anonymous format helped me practice without fear. Got honest feedback that directly improved my answers.', rating: 5 },
  { id: 2, name: 'A.M.', role: 'Data Analyst at MuSigma', company: 'Analytics Firm', text: 'My mentor was from Google. The SQL round practice was exactly like my real interview. Landed the offer!', rating: 5 },
  { id: 3, name: 'S.K.', role: 'ML Engineer at Happay   ', company: 'AI Startup', text: 'Worth every rupee. The structured evaluation showed exactly where I was weak. Fixed those gaps and aced my next interview.', rating: 5 },
];

const FAQ = [
  { q: 'How does anonymous interviewing work?', a: 'Your name, photo, and personal details are hidden. You are identified only by your professional title (e.g., "Data Scientist at Uber"). Mentors see your role and resume (if you choose to upload it), nothing more. When you join the meeting, you can join with a fake name and keep your video off' },
  { q: 'Are your mentors verified?', a: 'Yes. Every mentor is vetted manually. We verify employment history, LinkedIn profiles, and conduct background checks to ensure they work at top companies.' },
  { q: 'What happens in a session?', a: 'Book a 55-minute slot. Your mentor conducts a realistic mock interview focused on your chosen topic. After the session, you receive structured evaluation feedback covering strengths, gaps, and specific improvement areas.' },
  { q: 'Can I practice specific rounds?', a: 'Absolutely. Choose your interview profile (PM, Data, HR, etc.) and then select the specific topic you want to practice - like "Product Thinking", "SQL", or "Behavioral Questions".' },
  { q: 'Do you offer refunds?', a: 'Yes. If the mentor does not show up for the session, we provide a full refund. Just make sure you have a recording of the first 15 mins of the session  .' },
];

// 🟢 SVG ICONS FOR MENTOR SECTION
const EarningsIcon = () => (
  <Svg width={48} height={48} viewBox="0 0 48 48" fill="none">
    <Circle cx={24} cy={24} r={20} fill="#10b981" opacity={0.1} />
    <Path d="M24 8C15.163 8 8 15.163 8 24s7.163 16 16 16 16-7.163 16-16S32.837 8 24 8zm0 28c-6.627 0-12-5.373-12-12S17.373 12 24 12s12 5.373 12 12-5.373 12-12 12z" fill="#10b981" />
    <Path d="M26 18h-4v4h-3l5 6 5-6h-3v-4zm-2 14c-1.1 0-2-.9-2-2h4c0 1.1-.9 2-2 2z" fill="#10b981" />
  </Svg>
);

const CalendarIcon = () => (
  <Svg width={48} height={48} viewBox="0 0 48 48" fill="none">
    <Rect x={8} y={10} width={32} height={28} rx={3} fill="#18a7a7" opacity={0.1} />
    <Rect x={8} y={10} width={32} height={6} rx={3} fill="#18a7a7" />
    <Rect x={12} y={20} width={6} height={6} rx={1} fill="#18a7a7" opacity={0.3} />
    <Rect x={21} y={20} width={6} height={6} rx={1} fill="#18a7a7" opacity={0.3} />
    <Rect x={30} y={20} width={6} height={6} rx={1} fill="#18a7a7" />
    <Rect x={12} y={29} width={6} height={6} rx={1} fill="#18a7a7" opacity={0.3} />
    <Rect x={21} y={29} width={6} height={6} rx={1} fill="#18a7a7" opacity={0.3} />
  </Svg>
);

const StarIcon = () => (
  <Svg width={48} height={48} viewBox="0 0 48 48" fill="none">
    <Circle cx={24} cy={24} r={20} fill="#f59e0b" opacity={0.1} />
    <Path d="M24 8l4.5 13.5H42L30 32l4.5 14L24 36l-10.5 10L18 32 6 21.5h13.5L24 8z" fill="#f59e0b" />
  </Svg>
);

const BronzeBadge = () => (
  <Svg width={56} height={56} viewBox="0 0 56 56" fill="none">
    <Circle cx={28} cy={28} r={26} fill="#cd7f32" />
    <Circle cx={28} cy={28} r={22} fill="#b8692d" opacity={0.3} />
    <Path d="M28 12l3 9h9l-7 5 3 9-8-6-8 6 3-9-7-5h9l3-9z" fill="#fff" />
  </Svg>
);

const SilverBadge = () => (
  <Svg width={56} height={56} viewBox="0 0 56 56" fill="none">
    <Path d="M28 4L20 20H4l13 10-5 16 16-12 16 12-5-16 13-10H36L28 4z" fill="#c0c0c0" />
    <Path d="M28 4L20 20H4l13 10-5 16 16-12 16 12-5-16 13-10H36L28 4z" fill="#d4d4d4" opacity={0.5} />
    <Circle cx={28} cy={24} r={8} fill="#fff" />
  </Svg>
);

const GoldBadge = () => (
  <Svg width={56} height={56} viewBox="0 0 56 56" fill="none">
    <Path d="M10 36h36v12c0 2.2-1.8 4-4 4H14c-2.2 0-4-1.8-4-4V36z" fill="#fbbf24" />
    <Path d="M8 28c0-2.2 1.8-4 4-4h32c2.2 0 4 1.8 4 4v8H8v-8z" fill="#f59e0b" />
    <Path d="M28 4l6 12h12l-10 8 4 12-12-9-12 9 4-12-10-8h12l6-12z" fill="#fbbf24" />
    <Circle cx={28} cy={32} r={3} fill="#fff" />
  </Svg>
);

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
      accessibilityRole="region"
      accessibilityLabel="Companies where our mentors work"
    >
      <Text 
        style={styles.logoTitle}
        accessibilityRole="header"
        accessibilityLevel={2}
      >
        OUR MENTORS HAVE WORKED IN
      </Text>
      <View style={[styles.logoWall, isSmall && styles.logoWallMobile]}>
        {COMPANIES.map((company) => (
           <View 
             key={company.name} 
             style={styles.logoWrapper}
             accessibilityRole="image"
             accessibilityLabel={`${company.name} logo`}
           >
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
    <View 
      style={[styles.sectionContainer, styles.tracksSection]}
      accessibilityRole="region"
      accessibilityLabel="Interview tracks section"
    >
      <Text 
        style={styles.sectionKicker}
        accessibilityRole="header"
        accessibilityLevel={2}
      >
        INTERVIEW TRACKS
      </Text>
      <Text 
        style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}
        accessibilityRole="header"
        accessibilityLevel={3}
      >
        Choose your focus area
      </Text>
      <View style={[styles.tracksGrid, isSmall && styles.tracksGridMobile]}>
        {INTERVIEW_TRACKS.map((track) => (
          <TouchableOpacity
            key={track.id}
            style={styles.trackCard}
            onPress={() => router.push(track.path as any)}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={`${track.title}: ${track.desc}`}
            accessibilityHint={`Navigate to ${track.title} interview track`}
          >
            <Text 
              style={styles.trackEmoji}
              accessibilityLabel={track.emoji}
            >
              {track.emoji}
            </Text>
            <Text 
              style={styles.trackTitle}
              accessibilityRole="header"
              accessibilityLevel={4}
            >
              {track.title}
            </Text>
            <Text style={styles.trackDesc}>{track.desc}</Text>
            <View 
              style={styles.trackArrow}
              accessible={false}
            >
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

  const handleLinkedInPress = () => {
    const linkedInUrl = 'https://www.linkedin.com/company/crackjobs';
    Linking.openURL(linkedInUrl).catch(err => console.error('Failed to open LinkedIn:', err));
  };

  return (
    <View 
      style={styles.socialProofSection}
      accessibilityRole="region"
      accessibilityLabel="Platform statistics and social proof"
    >
      <View style={[styles.statsGrid, isSmall && styles.statsGridMobile]}>
        {STATS.map((stat) => (
          <View 
            key={stat.id} 
            style={styles.statCard}
            accessibilityRole="text"
            accessibilityLabel={`${stat.number} ${stat.label}`}
          >
            <Text 
              style={styles.statNumber}
              accessibilityRole="header"
              accessibilityLevel={3}
            >
              {stat.number}
            </Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity 
        style={styles.linkedinButton}
        onPress={handleLinkedInPress}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Follow us on LinkedIn"
        accessibilityHint="Opens LinkedIn company page in browser"
      >
        <Text style={styles.linkedinButtonText}>Follow us on LinkedIn →</Text>
      </TouchableOpacity>
    </View>
  );
});

const Reviews = memo(() => {
  const { width } = useWindowDimensions();
  const isSmall = width < 900;

  return (
    <View 
      style={styles.reviewsSection}
      accessibilityRole="region"
      accessibilityLabel="User reviews section"
    >
      <View style={styles.sectionContainer}>
        <Text 
          style={styles.sectionKicker}
          accessibilityRole="header"
          accessibilityLevel={2}
        >
          SUCCESS STORIES
        </Text>
        <Text 
          style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}
          accessibilityRole="header"
          accessibilityLevel={3}
        >
          What our candidates say
        </Text>
        <View style={[styles.reviewsGrid, isSmall && styles.reviewsGridMobile]}>
          {REVIEWS.map((review) => (
            <View 
              key={review.id} 
              style={styles.reviewCard}
              accessibilityRole="text"
              accessibilityLabel={`Review from ${review.name}, ${review.role}: ${review.text}`}
            >
              <View style={styles.reviewHeader}>
                <View style={styles.reviewHeaderLeft}>
                  <Text 
                    style={styles.reviewName}
                    accessibilityRole="header"
                    accessibilityLevel={4}
                  >
                    {review.name}
                  </Text>
                  <Text style={styles.reviewRole}>{review.role}</Text>
                </View>
                <View style={styles.reviewStarsContainer}>
                  <Text 
                    style={styles.reviewStars}
                    accessibilityLabel={`${review.rating} stars`}
                  >
                    {'★'.repeat(review.rating)}
                  </Text>
                </View>
              </View>
              <Text style={styles.reviewText}>"{review.text}"</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
});

// 🟢 NEW: BECOME A MENTOR SECTION
const BecomeMentor = memo(() => {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isSmall = width < 900;

  const BENEFITS = [
    { Icon: EarningsIcon, title: 'Earn ₹500-2500/session', desc: 'You keep 80%. Set your own rates and schedule.' },
    { Icon: CalendarIcon, title: 'Work on your schedule', desc: 'Fully remote. Choose when and how often you mentor.' },
    { Icon: StarIcon, title: 'Sharpen your skills', desc: 'Stay sharp on frameworks. Valuable for your next interview.' },
  ];

  return (
    <View 
      style={styles.sectionContainer}
      accessibilityRole="region"
      accessibilityLabel="Become a mentor section"
    >
      <Text 
        style={styles.sectionKicker}
        accessibilityRole="header"
        accessibilityLevel={2}
      >
        BECOME A MENTOR
      </Text>
      <Text 
        style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}
        accessibilityRole="header"
        accessibilityLevel={3}
      >
        Share your expertise, earn on your terms
      </Text>
      
      <View style={[styles.benefitsGrid, isSmall && styles.benefitsGridMobile]}>
        {BENEFITS.map((benefit, i) => (
          <View 
            key={i} 
            style={styles.benefitCard}
            accessibilityRole="summary"
            accessibilityLabel={`${benefit.title}. ${benefit.desc}`}
          >
            <View style={styles.benefitIconContainer}>
              <benefit.Icon />
            </View>
            <Text 
              style={styles.benefitTitle}
              accessibilityRole="header"
              accessibilityLevel={4}
            >
              {benefit.title}
            </Text>
            <Text style={styles.benefitDesc}>{benefit.desc}</Text>
          </View>
        ))}
      </View>

      <View style={styles.mentorCtaContainer}>
        <TouchableOpacity
          style={styles.mentorCtaButton}
          onPress={() => router.push('/auth/sign-up')}
          activeOpacity={0.9}
          accessibilityRole="button"
          accessibilityLabel="Start Mentoring"
          accessibilityHint="Navigate to sign up page to become a mentor"
        >
          <Text style={styles.mentorCtaButtonText}>Start Mentoring</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

// 🟢 NEW: MENTOR TIERS SECTION
const MentorTiers = memo(() => {
  const { width } = useWindowDimensions();
  const isSmall = width < 900;

  const TIERS = [
    {
      Badge: BronzeBadge,
      title: 'Bronze Mentor',
      sessions: '1-10 sessions',
      benefits: ['Bronze Badge next to your profile', 'LinkedIn bronze badge'],
      bgGradient: { background: 'linear-gradient(135deg, #fef3e7 0%, #fde8d0 100%)' },
      borderColor: '#f0bb84',
      titleColor: '#8b4513',
      sessionsColor: '#a0522d',
      textColor: '#6b4423',
    },
    {
      Badge: SilverBadge,
      title: 'Silver Mentor',
      sessions: '11-30 sessions',
      benefits: ['Silver Badge next to your profile', 'LinkedIn silver badge', 'LinkedIn appreciation post'],
      bgGradient: { background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' },
      borderColor: '#9ca3af',
      titleColor: '#4b5563',
      sessionsColor: '#6b7280',
      textColor: '#374151',
    },
    {
      Badge: GoldBadge,
      title: 'Gold Mentor',
      sessions: '31+ sessions',
      benefits: ['Gold Badge next to your profile', 'LinkedIn gold badge', 'LinkedIn appreciation post', 'Exclusive gold mentor community'],
      bgGradient: { background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' },
      borderColor: '#d97706',
      titleColor: '#b45309',
      sessionsColor: '#d97706',
      textColor: '#92400e',
    },
  ];

  return (
    <View 
      style={styles.sectionContainer}
      accessibilityRole="region"
      accessibilityLabel="Mentor tiers section"
    >
      <Text 
        style={styles.sectionKicker}
        accessibilityRole="header"
        accessibilityLevel={2}
      >
        LEVEL UP
      </Text>
      <Text 
        style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}
        accessibilityRole="header"
        accessibilityLevel={3}
      >
        Unlock perks as you grow
      </Text>
      
      <View style={[styles.tiersGrid, isSmall && styles.tiersGridMobile]}>
        {TIERS.map((tier, i) => (
          <View 
            key={i} 
            style={[
              styles.tierCard,
              Platform.OS === 'web' && tier.bgGradient,
              Platform.OS !== 'web' && { 
                backgroundColor: i === 0 ? '#fef3e7' : i === 1 ? '#f8f9fa' : '#fef3c7' 
              },
              { borderColor: tier.borderColor }
            ]}
            accessibilityRole="summary"
            accessibilityLabel={`${tier.title}. ${tier.sessions}. Benefits: ${tier.benefits.join(', ')}`}
          >
            <View style={styles.tierBadgeContainer}>
              <tier.Badge />
            </View>
            <Text 
              style={[styles.tierTitle, { color: tier.titleColor }]}
              accessibilityRole="header"
              accessibilityLevel={4}
            >
              {tier.title}
            </Text>
            <Text style={[styles.tierSessions, { color: tier.sessionsColor }]}>
              {tier.sessions}
            </Text>
            <View style={styles.tierBenefits}>
              {tier.benefits.map((benefit, j) => (
                <View key={j} style={styles.tierBenefitRow}>
                  <Text style={[styles.tierBenefitBullet, { color: tier.textColor }]}>•</Text>
                  <Text style={[styles.tierBenefitText, { color: tier.textColor }]}>
                    {benefit}
                  </Text>
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
    <View 
      style={styles.sectionContainer}
      accessibilityRole="region"
      accessibilityLabel="Frequently asked questions section"
    >
      <Text 
        style={styles.sectionKicker}
        accessibilityRole="header"
        accessibilityLevel={2}
      >
        FAQ
      </Text>
      <Text 
        style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}
        accessibilityRole="header"
        accessibilityLevel={3}
      >
        Common questions answered
      </Text>
      <View style={styles.faqContainer}>
        {FAQ.map((item, i) => (
          <View 
            key={i} 
            style={styles.faqItem}
            accessibilityRole="summary"
            accessibilityLabel={`Question: ${item.q}. Answer: ${item.a}`}
          >
            <Text 
              style={styles.faqQ}
              accessibilityRole="header"
              accessibilityLevel={4}
            >
              {item.q}
            </Text>
            <Text style={styles.faqA}>{item.a}</Text>
          </View>
        ))}
      </View>
    </View>
  );
});

const BottomCTA = memo(() => {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isSmall = width < 900;

  return (
    <View 
      style={styles.ctaSection}
      accessibilityRole="region"
      accessibilityLabel="Call to action section"
    >
      <View style={[styles.ctaInner, isSmall && styles.ctaInnerMobile]}>
        <Text 
          style={[styles.ctaTitle, isSmall && styles.ctaTitleMobile]}
          accessibilityRole="header"
          accessibilityLevel={2}
        >
          Ready to ace your next interview?
        </Text>
        <Text 
          style={[styles.ctaSubtitle, isSmall && styles.ctaSubtitleMobile]}
          accessibilityRole="text"
        >
          Join hundreds of candidates landing offers at top companies
        </Text>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => router.push('/auth/sign-up')}
          activeOpacity={0.9}
          accessibilityRole="button"
          accessibilityLabel="Get Started"
          accessibilityHint="Navigate to sign up page to create your account"
        >
          <Text style={styles.ctaButtonText}>GET STARTED</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

// ✅ DEFAULT EXPORT
export default function LazySections() {
  return (
    <>
      <LogoWall />
      <InterviewTracks />
      <SocialProof />
      <Reviews />
      <BecomeMentor />
      <MentorTiers />
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

  // Logo Wall
  logoSection: { backgroundColor: '#fff', paddingVertical: 50, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#f0f0f0' },
  logoTitle: { textAlign: 'center', fontSize: 15, fontWeight: '500', color: '#bbb', marginBottom: 30, letterSpacing: 1.5, textTransform: 'uppercase' },
  logoWall: { flexDirection: 'row', justifyContent: 'center', gap: 60, flexWrap: 'wrap', alignItems: 'center' },
  logoWallMobile: { gap: 30, paddingHorizontal: 20 },
  logoWrapper: { height: 50, justifyContent: 'center', alignItems: 'center' },

  // Social Proof Stats
  socialProofSection: { 
    backgroundColor: BG_CREAM, 
    paddingVertical: 60, 
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  statsGrid: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    gap: 48, 
    flexWrap: 'wrap',
    maxWidth: 900,
    alignSelf: 'center',
    width: '100%',
    marginBottom: 32
  },
  statsGridMobile: { 
    gap: 32,
    paddingHorizontal: 20
  },
  statCard: { 
    alignItems: 'center',
    minWidth: 140
  },
  statNumber: { 
    fontFamily: SYSTEM_FONT, 
    fontWeight: '800', 
    fontSize: 48, 
    color: BRAND_ORANGE,
    marginBottom: 8,
    lineHeight: 52
  },
  statLabel: { 
    fontFamily: SYSTEM_FONT, 
    fontSize: 14, 
    color: TEXT_GRAY,
    textAlign: 'center',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  linkedinButton: {
    alignSelf: 'center',
    backgroundColor: '#0077b5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  linkedinButtonText: {
    fontFamily: SYSTEM_FONT,
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 0.3
  },

  // Tracks
  tracksSection: { backgroundColor: BG_CREAM },
  tracksGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 20, justifyContent: 'center' },
  tracksGridMobile: { flexDirection: 'column',alignItems: 'center' },
  trackCard: { flex: 1, minWidth: 260, maxWidth: 280, backgroundColor: '#fff', padding: 24, borderRadius: 16, borderWidth: 1, borderColor: '#f0f0f0' },
  trackEmoji: { fontSize: 32, marginBottom: 12 },
  trackTitle: { fontFamily: SYSTEM_FONT, fontWeight: '700', fontSize: 18, color: TEXT_DARK, marginBottom: 8 },
  trackDesc: { fontFamily: SYSTEM_FONT, fontSize: 14, color: TEXT_GRAY, lineHeight: 20, marginBottom: 16 },
  trackArrow: { alignSelf: 'flex-start', backgroundColor: CTA_TEAL, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  trackArrowText: { color: '#fff', fontWeight: '700' },

  // Reviews - ✅ FIXED OVERFLOW ISSUE
  reviewsSection: { backgroundColor: '#fff', paddingVertical: 80 },
  reviewsGrid: { flexDirection: 'row', gap: 24, justifyContent: 'center', flexWrap: 'wrap' },
  reviewsGridMobile: { flexDirection: 'column',alignItems: 'center' },
  reviewCard: { flex: 1, minWidth: 280, maxWidth: 360, backgroundColor: BG_CREAM, padding: 24, borderRadius: 16, borderWidth: 1, borderColor: '#f0f0f0' },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, gap: 12 },
  reviewHeaderLeft: { flex: 1, flexShrink: 1, minWidth: 0 }, // ✅ ADDED: Allows text to wrap, prevents overflow
  reviewStarsContainer: { flexShrink: 0, paddingLeft: 8 }, // ✅ ADDED: Prevents stars from shrinking or overflowing
  reviewName: { fontFamily: SYSTEM_FONT, fontWeight: '700', fontSize: 16, color: TEXT_DARK },
  reviewRole: { fontFamily: SYSTEM_FONT, fontSize: 13, color: TEXT_GRAY, marginTop: 2 },
  reviewStars: { fontSize: 16 },
  reviewText: { fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_DARK, lineHeight: 22, fontStyle: 'italic' },

  // 🟢 NEW: Mentor Benefits Styles
  benefitsGrid: { flexDirection: 'row', gap: 32, justifyContent: 'center', alignItems: 'flex-start', maxWidth: 1200, alignSelf: 'center', marginBottom: 48 },
  benefitsGridMobile: { flexDirection: 'column', maxWidth: 600, gap: 16 },
  benefitCard: { flex: 1, maxWidth: 320, backgroundColor: '#fff', padding: 24, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#f0f0f0' },
  benefitIconContainer: { marginBottom: 16 },
  benefitTitle: { fontFamily: SYSTEM_FONT, fontWeight: '700', fontSize: 18, color: TEXT_DARK, marginBottom: 8, textAlign: 'center' },
  benefitDesc: { fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_GRAY, lineHeight: 22, textAlign: 'center' },
  mentorCtaContainer: { alignItems: 'center' },
  mentorCtaButton: { backgroundColor: CTA_TEAL, paddingVertical: 16, paddingHorizontal: 32, borderRadius: 100, minWidth: 200 },
  mentorCtaButtonText: { fontFamily: SYSTEM_FONT, fontSize: 16, fontWeight: '700', color: '#fff', textAlign: 'center' },
  
  // 🟢 NEW: Mentor Tiers Styles
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

  // FAQ
  faqContainer: { maxWidth: 800, alignSelf: 'center', width: '100%', gap: 24 },
  faqItem: { backgroundColor: '#fff', padding: 24, borderRadius: 12, borderWidth: 1, borderColor: '#f0f0f0' },
  faqQ: { fontFamily: SYSTEM_FONT, fontWeight: '700', fontSize: 16, color: TEXT_DARK, marginBottom: 8 },
  faqA: { fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_GRAY, lineHeight: 22 },

  // Bottom CTA
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