// components/LazySections.tsx
import React, { memo, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
  Image as RNImage,
  Linking,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { Asset } from 'expo-asset';
import { Footer } from './Footer';
import { Svg, Path, Circle } from "react-native-svg";
import { availabilityService } from "@/services/availability.service";

// ─── GTM DataLayer Helper ─────────────────────────────────────────────────────
const pushToDataLayer = (eventName: string, data: Record<string, any>) => {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    const win = window as any;
    win.dataLayer = win.dataLayer || [];
    win.dataLayer.push({
      event: eventName,
      ...data
    });
  }
};

// 🟢 Lazy Loaded Images
import GoogleImg from '../assets/companies/Google.png';
import MetaImg from '../assets/companies/Meta.png';
import AmazonImg from '../assets/companies/Amazon.webp';
import MicrosoftImg from '../assets/companies/Microsoft.webp';
import CapgeminiImg from '../assets/companies/Capgemini.png';
import AdobeImg from '../assets/companies/Adobe.png';

// --- CONSTANTS ---
const SUPABASE_URL = "https://rcbaaiiawrglvyzmawvr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjYmFhaWlhd3JnbHZ5em1hd3ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNTA1NjAsImV4cCI6MjA3NjcyNjU2MH0.V3qRHGXBMlspRS7XFJlXdo4qIcCms60Nepp7dYMEjLA";

const BRAND_ORANGE = '#f58742';
const CTA_TEAL = '#18a7a7';
const BG_CREAM = '#f8f5f0';
const TEXT_DARK = '#222';
const TEXT_GRAY = '#555';
const BORDER_LIGHT = "rgba(0,0,0,0.05)";

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
  { id: 'pm', emoji: '📊', title: 'Product Management', desc: 'Product sense, strategy, execution, technical, leadership', path: '/interviews/pm' },
  { id: 'data-analytics', emoji: '📈', title: 'Data Analytics', desc: 'SQL, Case studies, Excel, business intelligence', path: '/interviews/da' },
  { id: 'data-science', emoji: '🤖', title: 'Data Science', desc: 'ML theory, Practical ML, statistics, modeling, coding', path: '/interviews/ds' },
  { id: 'hr', emoji: '👥', title: 'HR Interviews', desc: 'Talent acquisition, HR generalist, HRBP, COE, HR operations', path: '/interviews/hr' },
];

const TESTIMONIALS = [
  { name: "Priya S.", role: "Product Manager", company: "TATA", avatar: "👩‍💼", rating: 5, quote: "The mock interview was incredibly realistic. My mentor's feedback on my product sense helped me identify exact gaps." },
  { name: "Rahul V.", role: "Data Analyst", company: "Bigbasket", avatar: "👨‍💻", rating: 5, quote: "I practiced SQL and case studies with a senior analyst. The detailed scorecard showed me exactly what to improve. Worth every rupee!" },
  { name: "Sneha P.", role: "Data Scientist", company: "Musigma", avatar: "👩‍🔬", rating: 5, quote: "The safe practice environment removed all pressure. My mentor's ML system design feedback was gold. Recording helped me review and improve 2x faster." },
  { name: "Amit K.", role: "HR Manager", company: "Flipkart", avatar: "👨‍💼", rating: 5, quote: "Practiced behavioral questions with an actual HRBP. The structured feedback on my STAR responses made all the difference in my interviews." },
];

const GUARANTEES = [
  { icon: "💰", title: "100% Money-Back Guarantee", description: "If your mentor doesn't show up, you get a full refund. No questions asked." },
  { icon: "🔄", title: "Free Rescheduling", description: "Life happens, we get it. Reschedule for free before your session. " },
  { icon: "📹", title: "Recording Guaranteed", description: "Every session is recorded and shared within 24 hours. Review unlimited times." },
  { icon: "📝", title: "Detailed Feedback Promise", description: "Structured scorecard with actionable tips delivered within 48 hours of your session." },
];

const FAQS = [
  { q: "Is this a safe space to practice?", a: "Absolutely. We provide a low-pressure environment where you can make mistakes and learn from them before your real interview. You can even keep your camera off if you prefer." },
  { q: "What will the detailed feedback be like?", a: "You don't just get a 'pass/fail'. You will get a feedback form with your strengths and areas of improvements highlighted by the interviewer." },
  { q: "What happens when the mentor does not show up for the session?", a: "You will be refunded the full amount." },
  { q: "Can I practice for a specific job?", a: "Yes! You can choose the topic of your interview, and paste the exact Job Description you are applying for so the mentor can tailor the questions." },
];

// ============================================
// SVG ICONS & SHARED
// ============================================
const CheckmarkCircleIcon = ({ size = 16, color = "#3B82F6" }) => (<Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none" /><Path d="M8 12.5L10.5 15L16 9.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></Svg>);
const BriefcaseIcon = ({ size = 12, color = "#111827" }) => (<Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><Path d="M16 7V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></Svg>);
const SparklesIcon = ({ size = 14, color = "#1E40AF" }) => (<Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><Path d="M6 3L6.5 5.5L9 6L6.5 6.5L6 9L5.5 6.5L3 6L5.5 5.5L6 3Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></Svg>);
const CheckmarkDoneIcon = ({ size = 14, color = "#6B7280" }) => (<Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M5 12L10 17L20 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><Path d="M2 12L7 17" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></Svg>);
const MedalIcon = ({ size = 14, color = "#CD7F32" }) => (<Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Circle cx="12" cy="15" r="6" fill={color} stroke={color} strokeWidth="1.5" /><Path d="M9 9L7 3L12 6L17 3L15 9" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" /></Svg>);

const SharedButton = memo(({ title, onPress, variant = "primary", nativeID, style, textStyle }: any) => (
  <TouchableOpacity nativeID={nativeID} style={[styles.sharedButtonBase, variant === "primary" && styles.sharedButtonPrimary, variant === "outline" && styles.sharedButtonOutline, style]} onPress={onPress} activeOpacity={0.8}>
    <Text style={[styles.sharedButtonText, variant === "primary" && { color: "#fff" }, variant === "outline" && { color: CTA_TEAL }, textStyle]}>{title}</Text>
  </TouchableOpacity>
));

const StarRatingBlock = memo(({ rating }: { rating: number }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) stars.push(<Text key={i} style={styles.starFilled}>★</Text>);
    else if (i === fullStars && hasHalfStar) stars.push(<View key={i} style={{ position: 'relative' }}><Text style={styles.starEmpty}>★</Text><Text style={[styles.starFilled, { position: 'absolute', width: '50%', overflow: 'hidden' }]}>★</Text></View>);
    else stars.push(<Text key={i} style={styles.starEmpty}>★</Text>);
  }
  return <View style={styles.ratingSection}><View style={styles.starsContainer}>{stars}</View><Text style={styles.ratingText}>{rating.toFixed(1)}</Text></View>;
});

const TierBadgeBlock = ({ tier }: { tier?: string | null }) => {
  let tierName = 'Bronze', tierColor = '#8B4513', bgColor = '#FFF8F0', borderColor = '#CD7F32', medalColor = '#CD7F32';
  const t = tier?.toLowerCase();
  if (t === 'gold') { tierName = 'Gold'; tierColor = '#B8860B'; bgColor = '#FFFEF5'; borderColor = '#FFD700'; medalColor = '#FFD700'; } 
  else if (t === 'silver') { tierName = 'Silver'; tierColor = '#505050'; bgColor = '#F8F9FA'; borderColor = '#A8A8A8'; medalColor = '#C0C0C0'; }
  return (
    <View style={[styles.tierBadge, { backgroundColor: bgColor, borderColor: borderColor }]}>
      <MedalIcon size={14} color={medalColor} />
      <Text style={[styles.tierText, { color: tierColor }]}>{tierName.toUpperCase()}</Text>
    </View>
  );
};

// ============================================
// SECTIONS
// ============================================
const SimpleImage = ({ source, style, alt }: any) => {
  const isWeb = Platform.OS === 'web';
  if (isWeb) {
    let src = typeof source === 'string' ? source : (source?.uri || Asset.fromModule(source)?.uri || '');
    if (src) return <img src={src} alt={alt} style={{ ...style, objectFit: 'contain' }} loading="lazy" decoding="async" />;
  }
  return <RNImage source={source} style={style} resizeMode="contain" accessible={true} accessibilityLabel={alt} />;
};

const LogoWall = memo(() => {
  const [isSmall, setIsSmall] = useState(false);
  useEffect(() => {
    const update = () => setIsSmall(Dimensions.get('window').width < 900);
    update();
    const sub = Dimensions.addEventListener('change', ({ window }) => setIsSmall(window.width < 900));
    return () => sub.remove();
  }, []);
  return (
    <View style={styles.logoSection} nativeID="our-mentors" accessibilityRole="region" accessibilityLabel="Companies where our mentors work">
      <Text style={styles.logoTitle} accessibilityRole="header" accessibilityLevel={2}>
        OUR EXPERTS HAVE WORKED IN
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

const TheProblemSection = memo(({ isSmall }: { isSmall: boolean }) => (
  <View style={[styles.sectionContainer, { paddingTop: 40, paddingBottom: 20 }]}>
    <Text style={styles.kicker}>THE HARDEST PART</Text>
    <Text style={[styles.h2, isSmall && styles.h2Mobile]}>Most candidates freeze when it counts</Text>
    <View style={styles.problemGrid}>
      <View style={styles.problemBox}>
        <Text style={styles.problemIcon}>😰</Text>
        <Text style={styles.problemTitle}>Interview Anxiety</Text>
        <Text style={styles.problemText}>The pressure of the real interview causes you to blank on answers you already know.</Text>
      </View>
      <View style={styles.problemBox}>
        <Text style={styles.problemIcon}>🤖</Text>
        <Text style={styles.problemTitle}>AI & Videos Fall Short</Text>
        <Text style={styles.problemText}>AI bots and YouTube videos cannot evaluate your communication nuance or tell you why a human would reject you.</Text>
      </View>
      <View style={styles.problemBox}>
        <Text style={styles.problemIcon}>❌</Text>
        <Text style={styles.problemTitle}>Silent Rejections</Text>
        <Text style={styles.problemText}>You get rejected but never find out exactly why or how the hiring manager evaluated your answers.</Text>
      </View>
    </View>
  </View>
));

const HowItWorksSection = memo(({ isSmall }: { isSmall: boolean }) => (
  <View style={[styles.sectionContainer, { backgroundColor: '#fff', borderRadius: 24, paddingVertical: 48, marginBottom: 40, shadowColor: "#000", shadowOpacity: 0.03, shadowRadius: 15, borderWidth: 1, borderColor: BORDER_LIGHT }]}>
    <Text style={styles.kicker}>YOUR PATH TO THE OFFER</Text>
    <Text style={[styles.h2, isSmall && styles.h2Mobile]}>How realistic practice builds unshakeable confidence</Text>
    <View style={styles.stepsContainer}>
      <View style={styles.stepBox}>
        <View style={styles.stepNumber}><Text style={styles.stepNumberText}>1</Text></View>
        <Text style={styles.stepTitle}>Paste a JD or Pick a Skill</Text>
        <Text style={styles.stepText}>Use a specific Job Description to simulate the real thing, or select a targeted interview round to focus exactly on your weak spots.</Text>
      </View>
      <View style={styles.stepBox}>
        <View style={styles.stepNumber}><Text style={styles.stepNumberText}>2</Text></View>
        <Text style={styles.stepTitle}>Practice with an Insider</Text>
        <Text style={styles.stepText}>Simulate a live interview with a vetted industry expert. Answer real questions in a safe, low-pressure environment.</Text>
      </View>
      <View style={styles.stepBox}>
        <View style={styles.stepNumber}><Text style={styles.stepNumberText}>3</Text></View>
        <Text style={styles.stepTitle}>Get Actionable Feedback</Text>
        <Text style={styles.stepText}>Receive a detailed scorecard, review the session recording, fix your mistakes, and walk into the real interview ready.</Text>
      </View>
    </View>
  </View>
));

const InterviewTracks = memo(() => {
  const [isSmall, setIsSmall] = useState(false);
  useEffect(() => {
    const update = () => setIsSmall(Dimensions.get('window').width < 900);
    update();
    const sub = Dimensions.addEventListener('change', ({ window }) => setIsSmall(window.width < 900));
    return () => sub.remove();
  }, []);
  const router = useRouter();

  return (
    <View style={[styles.sectionContainer, { paddingTop: 20 }]} nativeID="interview-tracks">
      <Text style={styles.kicker} accessibilityRole="header">INTERVIEW TRACKS</Text>
      <Text style={[styles.h2, isSmall && styles.h2Mobile]} accessibilityRole="header" accessibilityLevel={2}>
        Choose Your Specialization
      </Text>
      <View style={[styles.tracksGrid, isSmall && styles.tracksGridMobile]}>
        {INTERVIEW_TRACKS.map((track) => (
          <TouchableOpacity
            key={track.id}
            style={styles.trackCard}
            onPress={() => {
              pushToDataLayer("lp_track_card_click", { role_viewed: "homepage", target_track: track.id });
              router.push(track.path as any);
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.trackEmoji}>{track.emoji}</Text>
            <Text style={styles.trackTitle}>{track.title}</Text>
            <Text style={styles.trackDesc}>{track.desc}</Text>
            <View style={styles.trackArrow}>
              <Text style={styles.trackArrowText}>Explore →</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
});

const TargetedSkillsSection = memo(({ isSmall }: { isSmall: boolean }) => {
  const activeSkills = [
    "Product Sense / Design", "SQL & Querying", "System Design (ML)", "Talent Acquisition", "Case Studies (Data → Insight)", "Behavioral & Leadership"
  ];

  return (
    <View style={[styles.sectionContainer, { paddingTop: 20, paddingBottom: 60 }]}>
      <Text style={styles.kicker}>LASER-FOCUSED PRACTICE</Text>
      <Text style={[styles.h2, isSmall && styles.h2Mobile, { marginBottom: 16 }]}>Already know your weak spots?</Text>
      <Text style={styles.subtext}>Skip the general prep. Select from our pre-decided skills and book mock interviews strictly focused on the specific rounds that hold you back.</Text>
      
      <View style={styles.skillsPillContainer}>
        {activeSkills.map((skill, idx) => (
          <View key={idx} style={styles.skillPill}>
            <Text style={styles.skillPillText}>{skill}</Text>
          </View>
        ))}
      </View>
    </View>
  );
});

const MentorCard = ({ m, displayPrice, totalSessions, isNewMentor, averageRating, showRating, hasSlots, displaySlot, onView, isSmall, isFounderCard }: any) => {
  const seed = m.id || m.profiles?.full_name || 'Mentor';
  const fallbackAvatar = `https://api.dicebear.com/9.x/micah/png?seed=${encodeURIComponent(seed)}&backgroundColor=e5e7eb,f3f4f6`;
  const introIsFree = m.intro_call_price == null || m.intro_call_price === 0;
  const introDisplay = introIsFree ? 'Free' : `₹${m.intro_call_price.toLocaleString()}`;

  const cardWidthStyle = isFounderCard 
    ? { width: '100%' as const } 
    : (isSmall ? { width: '100%' as const } : { width: Platform.OS === 'web' ? 'calc(50% - 8px)' as any : '100%' as const });

  return (
    <View style={[styles.card, cardWidthStyle]}>
      <View style={styles.cardContent}>
        <View style={styles.headerRow}>
          <RNImage source={{ uri: m.avatar_url || fallbackAvatar }} style={styles.avatarImage} />
          <View style={styles.headerInfo}>
            <View style={styles.identityGroup}>
              <Text style={styles.mentorName} numberOfLines={1}>{m.professional_title || 'Industry Expert'}</Text>
              <View style={styles.verifiedBadge}><CheckmarkCircleIcon size={14} color="#3B82F6" /></View>
            </View>
            {m.years_of_experience && (
              <View style={{ alignSelf: 'flex-start', marginTop: 4 }}>
                <View style={styles.expBadge}>
                  <BriefcaseIcon size={12} color="#111827" />
                  <Text style={styles.expText}>{m.years_of_experience} yrs</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {m.experience_description && (
          <Text style={styles.bioText} numberOfLines={2}>{m.experience_description}</Text>
        )}

        <View style={styles.statsRow}>
          <TierBadgeBlock tier={m.tier} />
          {isNewMentor ? (
            <View style={styles.statItem}><SparklesIcon size={14} color="#1E40AF" /><View style={styles.newBadge}><Text style={styles.newBadgeText}>New</Text></View></View>
          ) : (
            <View style={styles.statItem}><CheckmarkDoneIcon size={14} color="#6B7280" /><Text style={styles.statText}><Text style={styles.statValue}>{totalSessions}</Text> sessions</Text></View>
          )}
          {showRating && <StarRatingBlock rating={averageRating} />}
          <View style={[styles.availabilityBadge, !hasSlots && styles.availabilityBadgeUnavailable]}>
            <Text style={styles.availabilityIcon}>{hasSlots ? '🟢' : '⏰'}</Text>
            <Text style={[styles.availabilityText, !hasSlots && styles.availabilityTextUnavailable]}>{hasSlots ? `Next slot: ${displaySlot}` : displaySlot}</Text>
          </View>
        </View>

        <View style={styles.dividerLine} />

        <View style={styles.actionRow}>
          <View style={styles.priceContainer}>
             <Text style={styles.startingAt}>Intro calls from</Text>
             <Text style={styles.basePrice}>{introDisplay}</Text>
          </View>
          <TouchableOpacity style={styles.bookBtn} onPress={onView} activeOpacity={0.8}>
            <Text style={styles.bookBtnText}>View Profile & Book</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const DynamicDomainMentors = ({ isSmall, onViewMentors }: { isSmall: boolean, onViewMentors: () => void }) => {
  const router = useRouter();
  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tierMap, setTierMap] = useState<Record<string, number>>({});
  const [mentorAvailability, setMentorAvailability] = useState<Record<string, string>>({});

  useEffect(() => {
    let isMounted = true;
    (async () => {
      setLoading(true);
      try {
        const tiersRes = await fetch(`${SUPABASE_URL}/rest/v1/mentor_tiers?select=tier,percentage_cut`, { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } });
        const tiersData = await tiersRes.json();
        const tMap: Record<string, number> = {};
        tiersData?.forEach((t: any) => (tMap[t.tier] = t.percentage_cut));
        if (isMounted) setTierMap(tMap);

        const mentorsRes = await fetch(`${SUPABASE_URL}/rest/v1/mentors?select=*,tier,profiles(full_name)&status=eq.approved`, { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } });
        const allMentors = await mentorsRes.json();

        let filtered = (allMentors || []).slice(0, 6);
        if (isMounted) setMentors(filtered);

        const availabilityResults = await Promise.all(
          filtered.map(async (m: any) => ({ id: m.id, slot: await availabilityService.findNextAvailableSlot(m.id) }))
        );
        const availabilityMap: Record<string, string> = {};
        availabilityResults.forEach(({ id, slot }) => { availabilityMap[id] = slot; });
        if (isMounted) setMentorAvailability(availabilityMap);

      } catch (e) {
        console.error(e);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return (
      <View style={{ paddingVertical: 60, alignItems: 'center' }}>
        <ActivityIndicator size="large" color={CTA_TEAL} />
      </View>
    );
  }

  if (mentors.length === 0) return null;

  return (
    <View style={styles.listContainerWrapper}>
      {/* GENERAL MENTORS BLOCK */}
      {mentors.length > 0 && (
        <>
          <Text style={styles.kicker}>YOUR INDUSTRY INSIDERS</Text>
          <Text style={[styles.h2, isSmall && styles.h2Mobile]}>Practice with the people who actually hire</Text>
          <Text style={[styles.subtext, { marginBottom: 40 }]}>Stop guessing what hiring managers want. Get realistic practice and actionable human feedback.</Text>
          <View style={styles.listContainer}>
            {mentors.map((m) => {
              const basePrice = m.session_price_inr ?? m.session_price ?? 0;
              const cut = tierMap[m.tier || 'bronze'] || 50;
              const displayPrice = basePrice ? Math.round(basePrice / (1 - cut / 100)) : 0;
              const totalSessions = m.total_sessions || 0;
              const isNewMentor = totalSessions < 5;
              const averageRating = m.average_rating || 0;
              const showRating = averageRating > 0;
              const nextSlot = mentorAvailability[m.id] || "Loading...";
              const hasSlots = nextSlot !== "No slots available" && nextSlot !== "Loading...";
              const displaySlot = hasSlots ? nextSlot : "No slots available";

              return (
                <MentorCard
                  key={m.id}
                  m={m}
                  displayPrice={displayPrice}
                  totalSessions={totalSessions}
                  isNewMentor={isNewMentor}
                  averageRating={averageRating}
                  showRating={showRating}
                  hasSlots={hasSlots}
                  displaySlot={displaySlot}
                  onView={() => {
                    pushToDataLayer("lp_mentor_card_click", { mentor_id: m.id, mentor_tier: m.tier || 'bronze', is_founder: false, role_viewed: 'homepage' });
                    router.push(`/mentors/${m.id}`);
                  }}
                  isSmall={isSmall}
                  isFounderCard={false}
                />
              );
            })}
          </View>

          <View style={{ alignItems: "center", marginTop: 32 }}>
            <SharedButton
              title="View All Experts"
              variant="outline"
              onPress={onViewMentors}
              style={{ minWidth: 200 }}
            />
          </View>
        </>
      )}
    </View>
  );
};

const TestimonialsSection = memo(({ isSmall }: { isSmall: boolean }) => (
  <View style={styles.testimonialsContainer} nativeID="testimonials">
    <Text style={styles.kicker}>SUCCESS STORIES</Text>
    <Text style={[styles.h2, isSmall && styles.h2Mobile]}>Hear from successful candidates</Text>
    <View style={styles.testimonialsGrid}>
      {TESTIMONIALS.map((testimonial, i) => (
        <View key={i} style={styles.testimonialCard}>
          <View style={styles.testimonialHeader}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>{testimonial.avatar}</Text>
            </View>
            <View style={styles.testimonialMeta}>
              <Text style={styles.testimonialName}>{testimonial.name}</Text>
              <Text style={styles.testimonialRole}>{testimonial.role} at {testimonial.company}</Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", gap: 3, marginBottom: 18 }}>
            {Array.from({ length: testimonial.rating }, (_, j) => (
              <Text key={j} style={{ fontFamily: SYSTEM_FONT, fontSize: 15 }}>⭐</Text>
            ))}
          </View>
          <Text style={styles.testimonialQuote}>"{testimonial.quote}"</Text>
        </View>
      ))}
    </View>
    <View style={styles.trustIndicators}>
      <Text style={styles.trustText}>✓ Verified testimonials</Text>
      <Text style={styles.trustText}>✓ Real candidate outcomes</Text>
      <Text style={styles.trustText}>✓ Proven results</Text>
    </View>
  </View>
));

const SystematicPrepSection = memo(({ onViewMentors, isSmall }: { onViewMentors: () => void, isSmall: boolean }) => (
  <View style={styles.notSureContainer}>
    <View style={styles.notSureBox}>
      <View style={styles.notSureIconRow}>
        <Text style={styles.notSureIcon}>📈</Text>
      </View>
      <Text style={styles.kicker}>THE SYSTEMATIC APPROACH</Text>
      <Text style={[styles.h2, isSmall && styles.h2Mobile, { marginBottom: 16 }]}>
        Diagnose your gaps. <Text style={{ color: BRAND_ORANGE }}>Systematically</Text> fix them.
      </Text>
      <Text style={styles.subtext}>
        Not sure which skill round to focus on? Book an initial diagnostic call to map out your specific blind spots, then get a custom bundle of mock interviews tailored to turn those weaknesses into strengths.
      </Text>

      <View style={styles.notSurePerks}>
        {[
          { icon: "1️⃣", text: "Book an intro call to diagnose your gaps and build a prep strategy." },
          { icon: "2️⃣", text: "Book a tailored bundle of interviews focusing exactly on your weak areas." },
          { icon: "3️⃣", text: "Track your progress systematically until you are completely interview-ready." },
        ].map((perk, i) => (
          <View key={i} style={styles.notSurePerk}>
            <Text style={styles.notSurePerkIcon}>{perk.icon}</Text>
            <Text style={styles.notSurePerkText}>{perk.text}</Text>
          </View>
        ))}
      </View>

      <SharedButton
        nativeID="btn-home-bundle-intro-call"
        title="Book Your Diagnostic Call"
        onPress={onViewMentors}
        style={styles.notSureButton}
        textStyle={{ fontSize: 16 }}
      />
      <Text style={styles.notSureNote}>Diagnostic calls are available directly on the expert's profile page</Text>
    </View>
  </View>
));

const GuaranteeSection = memo(({ isSmall }: { isSmall: boolean }) => (
  <View style={styles.guaranteeContainer} nativeID="guarantee">
    <View style={styles.guaranteeBox}>
      <Text style={styles.kicker}>RISK-FREE GUARANTEE</Text>
      <Text style={[styles.h2, isSmall && styles.h2Mobile]}>
        Practice with complete <Text style={{ color: CTA_TEAL }}>confidence</Text>
      </Text>
      <Text style={styles.subtext}>
        Your investment is protected. We've got your back every step of the way.
      </Text>
      
      <View style={styles.guaranteesGrid}>
        {GUARANTEES.map((g, i) => (
          <View key={i} style={styles.guaranteeCard}>
            <Text style={{ fontFamily: SYSTEM_FONT, fontSize: 36, marginBottom: 14 }}>{g.icon}</Text>
            <Text style={{ fontFamily: SYSTEM_FONT, fontSize: 17, fontWeight: "700", color: TEXT_DARK, marginBottom: 10 }}>{g.title}</Text>
            <Text style={{ fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_GRAY }}>{g.description}</Text>
          </View>
        ))}
      </View>
      <View style={styles.trustSeal}>
        {["SECURE PAYMENTS", "VERIFIED EXPERTS", "INSTANT REFUNDS"].map((t, i) => (
          <View key={i} style={styles.sealBadge}>
            <Text style={{ fontFamily: SYSTEM_FONT, fontSize: 12, fontWeight: "700", color: CTA_TEAL }}>✓ {t}</Text>
          </View>
        ))}
      </View>
    </View>
  </View>
));

const FAQSection = memo(({ isSmall }: { isSmall: boolean }) => (
  <View style={styles.sectionContainer}>
    <Text style={styles.kicker}>FAQ</Text>
    <Text style={[styles.h2, isSmall && styles.h2Mobile]}>Common Questions</Text>
    <View style={{ gap: 12, maxWidth: 800, alignSelf: 'center', width: '100%' }}>
      {FAQS.map((faq, i) => (
        <View key={i} style={styles.faqItem}>
          <Text style={{ fontFamily: SYSTEM_FONT, fontWeight: "700", fontSize: 16, color: TEXT_DARK, marginBottom: 6 }}>{faq.q}</Text>
          <Text style={{ fontFamily: SYSTEM_FONT, fontSize: 14, color: TEXT_GRAY, lineHeight: 22 }}>{faq.a}</Text>
        </View>
      ))}
    </View>
  </View>
));

const FinalCTABanner = memo(({ onViewMentors, isSmall }: { onViewMentors: () => void, isSmall: boolean }) => (
  <View style={styles.finalCtaContainer}>
    <View style={styles.finalCtaBox}>
      <Text style={[styles.h2, isSmall && styles.h2Mobile, { color: '#fff', marginBottom: 16 }]}>
        Your next interview is closer than you think
      </Text>
      <Text style={[styles.subtext, { color: 'rgba(255,255,255,0.85)' }]}>
        Browse industry insiders, pick a topic, and book your session in minutes.
      </Text>
      <SharedButton
        nativeID="btn-home-final-view-mentors"
        title="Book Your Session Now →"
        onPress={onViewMentors}
        style={styles.finalCtaButton}
        textStyle={{color: '#000000', fontSize: 17 }}
      />
      <View style={styles.finalCtaTrust}>
        <Text style={styles.finalCtaTrustItem}>✓ Safe practice space</Text>
        <Text style={styles.finalCtaTrustItem}>✓ Money-back guarantee</Text>
        <Text style={styles.finalCtaTrustItem}>✓ Recording included</Text>
      </View>
    </View>
  </View>
));

export default function LazySections() {
  const [isSmall, setIsSmall] = useState(false);
  useEffect(() => {
    const update = () => setIsSmall(Dimensions.get('window').width < 900);
    update();
    const sub = Dimensions.addEventListener('change', ({ window }) => setIsSmall(window.width < 900));
    return () => sub.remove();
  }, []);
  const router = useRouter();

  const handleViewMentors = (source: string) => {
    pushToDataLayer("lp_view_experts_click", { role_viewed: "homepage" });
    router.push('/mentors');
  };

  return (
    <>
      <LogoWall />
      <TheProblemSection isSmall={isSmall} />
      <HowItWorksSection isSmall={isSmall} />
      <InterviewTracks />
      <TargetedSkillsSection isSmall={isSmall} />
      <DynamicDomainMentors isSmall={isSmall} onViewMentors={() => handleViewMentors("domain_mentors_cta")} />
      <TestimonialsSection isSmall={isSmall} />
      <SystematicPrepSection isSmall={isSmall} onViewMentors={() => handleViewMentors("bundle_intro_call")} />
      <GuaranteeSection isSmall={isSmall} />
      <FAQSection isSmall={isSmall} />
      <FinalCTABanner isSmall={isSmall} onViewMentors={() => handleViewMentors("final_cta")} />
      <Footer />
    </>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  // ===== Unified Section & Text Styles =====
  sectionContainer: { maxWidth: 900, width: "100%", alignSelf: "center", paddingHorizontal: 24, paddingVertical: 60 },
  kicker: { fontFamily: SYSTEM_FONT, fontWeight: "800", fontSize: 13, color: CTA_TEAL, marginBottom: 12, textAlign: "center", letterSpacing: 1.5, textTransform: "uppercase" },
  h2: { fontFamily: SYSTEM_FONT, fontWeight: "800", fontSize: 36, color: TEXT_DARK, marginBottom: 32, textAlign: "center", lineHeight: 44 },
  h2Mobile: { fontSize: 28, lineHeight: 36, marginBottom: 24 },
  subtext: { fontFamily: SYSTEM_FONT, fontSize: 17, color: TEXT_GRAY, textAlign: "center", lineHeight: 26, maxWidth: 600, alignSelf: "center", marginBottom: 32 },

  // ===== Shared Button =====
  sharedButtonBase: { borderRadius: 8, alignItems: "center", justifyContent: "center", paddingVertical: 14, paddingHorizontal: 28 },
  sharedButtonPrimary: { backgroundColor: CTA_TEAL, shadowOpacity: 0.2, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
  sharedButtonOutline: { backgroundColor: "transparent", borderWidth: 2, borderColor: CTA_TEAL },
  sharedButtonText: { fontFamily: SYSTEM_FONT, fontSize: 15, fontWeight: "700" },

  // ===== Logo Wall =====
  logoSection: { backgroundColor: '#fff', paddingVertical: 50, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#f0f0f0' },
  logoTitle: { textAlign: 'center', fontSize: 15, fontWeight: '500', color: '#bbb', marginBottom: 30, letterSpacing: 1.5, textTransform: 'uppercase' },
  logoWall: { flexDirection: 'row', justifyContent: 'center', gap: 60, flexWrap: 'wrap', alignItems: 'center' },
  logoWallMobile: { gap: 30, paddingHorizontal: 20 },
  logoWrapper: { height: 50, justifyContent: 'center', alignItems: 'center' },

  // ===== New Problem & Solution Styles =====
  problemGrid: { flexDirection: "row", flexWrap: "wrap", gap: 24, justifyContent: "center", marginTop: 20 },
  problemBox: { backgroundColor: "#fff", padding: 24, borderRadius: 16, borderWidth: 1, borderColor: BORDER_LIGHT, width: Platform.OS === "web" ? "calc(33.333% - 16px)" : "100%", minWidth: 250 },
  problemIcon: { fontSize: 32, marginBottom: 12 },
  problemTitle: { fontFamily: SYSTEM_FONT, fontSize: 18, fontWeight: "700", color: TEXT_DARK, marginBottom: 8 },
  problemText: { fontFamily: SYSTEM_FONT, fontSize: 14, color: TEXT_GRAY, lineHeight: 22 },
  
  stepsContainer: { flexDirection: "row", flexWrap: "wrap", gap: 24, justifyContent: "center", paddingHorizontal: 24 },
  stepBox: { alignItems: "center", width: Platform.OS === "web" ? "calc(33.333% - 16px)" : "100%", minWidth: 250 },
  stepNumber: { width: 48, height: 48, borderRadius: 24, backgroundColor: "#E6F6F6", alignItems: "center", justifyContent: "center", marginBottom: 16 },
  stepNumberText: { fontFamily: SYSTEM_FONT, fontSize: 20, fontWeight: "800", color: CTA_TEAL },
  stepTitle: { fontFamily: SYSTEM_FONT, fontSize: 18, fontWeight: "700", color: TEXT_DARK, marginBottom: 8, textAlign: "center" },
  stepText: { fontFamily: SYSTEM_FONT, fontSize: 14, color: TEXT_GRAY, lineHeight: 22, textAlign: "center" },

  // ===== Interview Tracks =====
  tracksGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 20, justifyContent: 'center' },
  tracksGridMobile: { flexDirection: 'column', alignItems: 'stretch', width: '100%' },
  trackCard: { flex: 1, minWidth: 260, maxWidth: 280, backgroundColor: '#fff', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#f0f0f0' },
  trackEmoji: { fontSize: 32, marginBottom: 12 },
  trackTitle: { fontFamily: SYSTEM_FONT, fontWeight: '700', fontSize: 18, color: TEXT_DARK, marginBottom: 8 },
  trackDesc: { fontFamily: SYSTEM_FONT, fontSize: 14, color: TEXT_GRAY, lineHeight: 20, marginBottom: 16 },
  trackArrow: { alignSelf: 'flex-start', backgroundColor: CTA_TEAL, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  trackArrowText: { color: '#fff', fontWeight: '700' },

  // ===== Targeted Skills Styles =====
  skillsPillContainer: { flexDirection: "row", flexWrap: "wrap", gap: 12, justifyContent: "center", maxWidth: 800, alignSelf: "center" },
  skillPill: { backgroundColor: "#fff", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 100, borderWidth: 1, borderColor: "rgba(24, 167, 167, 0.3)", shadowColor: CTA_TEAL, shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  skillPillText: { fontFamily: SYSTEM_FONT, fontSize: 15, fontWeight: "600", color: TEXT_DARK },

  // ===== Dynamic Mentors List =====
  listContainerWrapper: { paddingVertical: 60, maxWidth: 1200, width: "100%", alignSelf: "center", paddingHorizontal: 24 },
  listContainer: { flexDirection: "row", flexWrap: "wrap", gap: 16, justifyContent: "center" },
  founderSection: { marginBottom: 64, alignItems: 'center', width: '100%', maxWidth: 900, alignSelf: 'center' },
  founderCardWrapper: { width: '100%', maxWidth: 500, marginTop: 16 },

  // Mentor Card
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 20, borderWidth: 0.5, borderColor: "#F3F4F6", minWidth: 300, maxWidth: 500, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 }, android: { elevation: 2 } }) },
  cardContent: { gap: 12 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatarImage: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#F3F4F6' },
  headerInfo: { flex: 1, justifyContent: 'center' },
  identityGroup: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  mentorName: { fontFamily: SYSTEM_FONT, fontSize: 18, fontWeight: "700", color: "#111827", flexShrink: 1 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  expBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: "#F3F4F6", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, gap: 4 },
  expText: { fontFamily: SYSTEM_FONT, fontSize: 12, fontWeight: "600", color: "#374151" },
  bioText: { fontFamily: SYSTEM_FONT, fontSize: 14, color: '#4B5563', lineHeight: 20, marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: 16, alignItems: 'center', flexWrap: 'wrap', marginTop: 4 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statText: { fontFamily: SYSTEM_FONT, fontSize: 13, color: '#4B5563' },
  statValue: { fontWeight: '600', color: '#111827' },
  newBadge: { backgroundColor: '#DBEAFE', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  newBadgeText: { fontFamily: SYSTEM_FONT, fontSize: 12, fontWeight: "600", color: '#1E40AF' },
  tierBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, borderWidth: 1 },
  tierText: { fontFamily: SYSTEM_FONT, fontSize: 12, fontWeight: "600" },
  ratingSection: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  starsContainer: { flexDirection: 'row', gap: 2 },
  starFilled: { fontFamily: SYSTEM_FONT, fontSize: 14, color: '#FBBF24' },
  starEmpty: { fontFamily: SYSTEM_FONT, fontSize: 14, color: '#D1D5DB' },
  ratingText: { fontFamily: SYSTEM_FONT, fontSize: 13, fontWeight: "600", color: '#111827' },
  availabilityBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#ECFDF5', borderWidth: 1, borderColor: '#D1FAE5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  availabilityBadgeUnavailable: { backgroundColor: '#FEF2F2', borderColor: '#FECACA' },
  availabilityIcon: { fontFamily: SYSTEM_FONT, fontSize: 12 },
  availabilityText: { fontFamily: SYSTEM_FONT, fontSize: 12, fontWeight: '500', color: '#047857' },
  availabilityTextUnavailable: { color: '#DC2626' },
  dividerLine: { height: 1, backgroundColor: '#F3F4F6', width: '100%', marginVertical: 4 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  priceContainer: { flexDirection: 'column' },
  startingAt: { fontFamily: SYSTEM_FONT, fontSize: 12, color: '#6B7280', marginBottom: 2 },
  basePrice: { fontFamily: SYSTEM_FONT, fontSize: 16, fontWeight: "600", color: '#111827' },
  bookBtn: { backgroundColor: CTA_TEAL, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, alignItems: 'center' },
  bookBtnText: { fontFamily: SYSTEM_FONT, color: '#FFF', fontSize: 13, fontWeight: '700', letterSpacing: 0.2 },

  // ===== Testimonials =====
  testimonialsContainer: { paddingTop: 40, paddingBottom: 60, paddingHorizontal: 24, backgroundColor: BG_CREAM },
  testimonialsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 24, justifyContent: "center", maxWidth: 1200, alignSelf: "center" },
  testimonialCard: { backgroundColor: "#fff", padding: 32, borderRadius: 16, borderWidth: 1, borderColor: "rgba(0,0,0,0.08)", width: Platform.OS === "web" ? "calc(50% - 12px)" : "100%", minWidth: 280, maxWidth: 550 },
  testimonialHeader: { flexDirection: "row", alignItems: "center", marginBottom: 18, gap: 14 },
  avatarContainer: { width: 52, height: 52, borderRadius: 26, backgroundColor: BG_CREAM, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: BORDER_LIGHT },
  avatarText: { fontFamily: SYSTEM_FONT, fontSize: 26 },
  testimonialMeta: { flex: 1 },
  testimonialName: { fontFamily: SYSTEM_FONT, fontSize: 17, fontWeight: "700", color: TEXT_DARK, marginBottom: 3 },
  testimonialRole: { fontFamily: SYSTEM_FONT, fontSize: 14, fontWeight: "600", color: TEXT_GRAY },
  testimonialQuote: { fontFamily: SYSTEM_FONT, fontSize: 15, lineHeight: 25, color: TEXT_DARK, marginBottom: 18 },
  trustIndicators: { flexDirection: "row", justifyContent: "center", gap: 32, marginTop: 48, flexWrap: "wrap" },
  trustText: { fontFamily: SYSTEM_FONT, fontSize: 13, fontWeight: "600", color: TEXT_GRAY, opacity: 0.8 },

  // ===== Systematic Bundle Strategy =====
  notSureContainer: { paddingHorizontal: 24, paddingVertical: 16, backgroundColor: BG_CREAM },
  notSureBox: { backgroundColor: "#fff9f5", borderRadius: 20, paddingVertical: 48, paddingHorizontal: 40, maxWidth: 900, alignSelf: "center", width: "100%", alignItems: "center", borderWidth: 2, borderColor: "rgba(245, 135, 66, 0.25)" },
  notSureIconRow: { marginBottom: 16 },
  notSureIcon: { fontFamily: SYSTEM_FONT, fontSize: 40 },
  notSurePerks: { gap: 14, alignSelf: "center", maxWidth: 480, marginBottom: 36 },
  notSurePerk: { flexDirection: "row", alignItems: "flex-start", gap: 12, backgroundColor: "#fff", padding: 16, borderRadius: 12, borderWidth: 1, borderColor: "rgba(245, 135, 66, 0.15)" },
  notSurePerkIcon: { fontFamily: SYSTEM_FONT, fontSize: 20 },
  notSurePerkText: { fontFamily: SYSTEM_FONT, fontSize: 14, color: TEXT_DARK, flex: 1, lineHeight: 22, fontWeight: "500" },
  notSureButton: { backgroundColor: BRAND_ORANGE, shadowOpacity: 0.2, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, minWidth: 280 },
  notSureNote: { fontFamily: SYSTEM_FONT, fontSize: 12, color: TEXT_GRAY, marginTop: 14, textAlign: "center", opacity: 0.7 },

  // ===== Guarantee =====
  guaranteeContainer: { paddingTop: 40, paddingBottom: 80, paddingHorizontal: 24, backgroundColor: BG_CREAM },
  guaranteeBox: { backgroundColor: "#fff", padding: 56, borderRadius: 20, maxWidth: 1100, alignSelf: "center", width: "100%", borderWidth: 2, borderColor: "rgba(24, 167, 167, 0.3)" },
  guaranteesGrid: { flexDirection: "row", flexWrap: "wrap", gap: 24, marginBottom: 44, justifyContent: "center" },
  guaranteeCard: { backgroundColor: BG_CREAM, padding: 28, borderRadius: 16, width: Platform.OS === "web" ? "calc(50% - 12px)" : "100%", minWidth: 240, maxWidth: 500, borderWidth: 1, borderColor: BORDER_LIGHT },
  trustSeal: { flexDirection: "row", justifyContent: "center", gap: 18, paddingVertical: 26, borderTopWidth: 1, borderTopColor: BORDER_LIGHT, flexWrap: "wrap" },
  sealBadge: { backgroundColor: "#e8f9f9", paddingVertical: 9, paddingHorizontal: 18, borderRadius: 8, borderWidth: 1, borderColor: "rgba(24, 167, 167, 0.15)" },

  // ===== FAQ & Final CTA =====
  faqItem: { backgroundColor: "#fff", padding: 20, borderRadius: 12, borderWidth: 1, borderColor: BORDER_LIGHT },
  finalCtaContainer: { paddingHorizontal: 24, paddingVertical: 60, backgroundColor: BG_CREAM },
  finalCtaBox: { backgroundColor: CTA_TEAL, borderRadius: 24, paddingVertical: 56, paddingHorizontal: 40, maxWidth: 900, alignSelf: "center", width: "100%", alignItems: "center" },
  finalCtaButton: { backgroundColor: "#fff", borderRadius: 8, paddingVertical: 16, paddingHorizontal: 36, shadowOpacity: 0.15, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, minWidth: 240 },
  finalCtaTrust: { flexDirection: "row", gap: 20, marginTop: 24, flexWrap: "wrap", justifyContent: "center" },
  finalCtaTrustItem: { fontFamily: SYSTEM_FONT, fontSize: 13, fontWeight: "600", color: "rgba(255,255,255,0.9)" },
});