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
} from 'react-native';
import { useRouter } from 'expo-router';
import { Asset } from 'expo-asset';
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

// --- COMPONENTS ---

// Simple Image for Lazy Loading
const SimpleImage = ({ source, style, alt }: any) => {
  const isWeb = Platform.OS === 'web';
  if (isWeb) {
    let src = typeof source === 'string' ? source : (source?.uri || Asset.fromModule(source)?.uri || '');
    if (src) return <img src={src} alt={alt} style={{...style, objectFit: 'contain'}} loading="lazy" decoding="async" />;
  }
  return <RNImage source={source} style={style} resizeMode="contain" alt={alt} />;
};

const LogoWall = memo(() => {
  const { width } = useWindowDimensions();
  const isSmall = width < 900;
  return (
    <View style={styles.logoSection}>
      <Text style={styles.logoTitle}>OUR MENTORS HAVE WORKED IN</Text>
      <View style={[styles.logoWall, isSmall && styles.logoWallMobile]}>
        {COMPANIES.map((company) => (
           <View key={company.name} style={styles.logoWrapper}>
             <SimpleImage source={company.image} style={{ width: company.width, height: 35 }} alt={company.name} />
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
    <View style={[styles.sectionContainer, styles.tracksSection]}>
      <Text style={styles.sectionKicker}>INTERVIEW TRACKS</Text>
      <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}>
        Choose your focus area
      </Text>
      <View style={[styles.tracksGrid, isSmall && styles.tracksGridMobile]}>
        {INTERVIEW_TRACKS.map((track) => (
          <TouchableOpacity
            key={track.id}
            style={styles.trackCard}
            onPress={() => router.push(track.path as any)}
            activeOpacity={0.8}
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

const Reviews = memo(() => {
  const { width } = useWindowDimensions();
  const isSmall = width < 900;

  return (
    <View style={[styles.sectionContainer, styles.reviewsSection]}>
      <Text style={styles.sectionKicker}>SUCCESS STORIES</Text>
      <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}>
        Real results from real candidates
      </Text>
      <View style={[styles.reviewsGrid, isSmall && styles.reviewsGridMobile]}>
        {REVIEWS.map((review) => (
          <View key={review.id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <View>
                <Text style={styles.reviewName}>{review.name}</Text>
                <Text style={styles.reviewRole}>{review.role}, {review.company}</Text>
              </View>
              <Text style={styles.reviewStars}>{'⭐'.repeat(review.rating)}</Text>
            </View>
            <Text style={styles.reviewText}>{review.text}</Text>
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
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionKicker}>FAQ</Text>
      <Text style={[styles.sectionTitle, isSmall && styles.sectionTitleMobile]}>
        Common questions answered
      </Text>
      <View style={styles.faqContainer}>
        {FAQ.map((item, i) => (
          <View key={i} style={styles.faqItem}>
            <Text style={styles.faqQ}>{item.q}</Text>
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
    <View style={styles.ctaSection}>
      <View style={[styles.ctaInner, isSmall && styles.ctaInnerMobile]}>
        <Text style={[styles.ctaTitle, isSmall && styles.ctaTitleMobile]}>
          Ready to ace your next interview?
        </Text>
        <Text style={[styles.ctaSubtitle, isSmall && styles.ctaSubtitleMobile]}>
          Join hundreds of candidates landing offers at top companies
        </Text>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => router.push('/auth/sign-up')}
          activeOpacity={0.9}
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
      <Reviews />
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

  // Reviews
  reviewsSection: { backgroundColor: '#fff', paddingVertical: 80 },
  reviewsGrid: { flexDirection: 'row', gap: 24, justifyContent: 'center', flexWrap: 'wrap' },
  reviewsGridMobile: { flexDirection: 'column',alignItems: 'center' },
  reviewCard: { flex: 1, minWidth: 280, maxWidth: 360, backgroundColor: BG_CREAM, padding: 24, borderRadius: 16, borderWidth: 1, borderColor: '#f0f0f0' },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  reviewName: { fontFamily: SYSTEM_FONT, fontWeight: '700', fontSize: 16, color: TEXT_DARK },
  reviewRole: { fontFamily: SYSTEM_FONT, fontSize: 13, color: TEXT_GRAY, marginTop: 2 },
  reviewStars: { fontSize: 16 },
  reviewText: { fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_DARK, lineHeight: 22, fontStyle: 'italic' },

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