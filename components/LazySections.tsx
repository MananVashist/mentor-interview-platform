// components/LazySections.tsx
import React, { memo, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
  Image as RNImage,
  Linking,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { Asset } from 'expo-asset';
import { Footer } from './Footer';
import { Svg, Path, Circle } from "react-native-svg";
import { availabilityService } from "@/services/availability.service";

// 🟢 Optimized Icons
import {
  FeedbackIcon, VideoIcon, StarIcon,
  BronzeBadge, SilverBadge, GoldBadge
} from './AppIcons';

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

// ============================================
// DYNAMIC MENTORS ICONS & COMPONENTS
// ============================================
const CheckmarkCircleIcon = ({ size = 16, color = "#3B82F6" }) => (<Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none" /><Path d="M8 12.5L10.5 15L16 9.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></Svg>);
const BriefcaseIcon = ({ size = 12, color = "#111827" }) => (<Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><Path d="M16 7V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></Svg>);
const SparklesIcon = ({ size = 14, color = "#1E40AF" }) => (<Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 14.5L2 12L9.5 9.5L12 2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><Path d="M6 3L6.5 5.5L9 6L6.5 6.5L6 9L5.5 6.5L3 6L5.5 5.5L6 3Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></Svg>);
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

const MentorCard = ({ m, displayPrice, totalSessions, isNewMentor, averageRating, showRating, hasSlots, displaySlot, customPriceLabel, onView, isSmall, isFounderCard }: any) => {
  const seed = m.id || m.profiles?.full_name || 'Mentor';
  const fallbackAvatar = `https://api.dicebear.com/9.x/micah/png?seed=${encodeURIComponent(seed)}&backgroundColor=e5e7eb,f3f4f6`;
  const introPrice = Math.round(displayPrice * 0.20);

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
              <Text style={styles.mentorName} numberOfLines={1}>{m.professional_title || 'Interview Mentor'}</Text>
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
             <Text style={styles.startingAt}>{customPriceLabel ? 'Intro call' : 'Intro calls from'}</Text>
             <Text style={styles.basePrice}>{customPriceLabel || `₹${introPrice.toLocaleString()}`}</Text>
          </View>
          <TouchableOpacity style={styles.bookBtn} onPress={onView} activeOpacity={0.8}>
            <Text style={styles.bookBtnText}>View Profile & Book</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const DynamicDomainMentors = ({ role, isSmall, onViewMentors }: { role: string, isSmall: boolean, onViewMentors: () => void }) => {
  const router = useRouter();
  const [mentors, setMentors] = useState<any[]>([]);
  const [founderMentor, setFounderMentor] = useState<any>(null);
  const [founderSlot, setFounderSlot] = useState<string>("Loading...");
  const [loading, setLoading] = useState(true);
  const [tierMap, setTierMap] = useState<Record<string, number>>({});
  const [mentorAvailability, setMentorAvailability] = useState<Record<string, string>>({});

  const FOUNDER_ID = 'e251486e-c21a-49f4-8ab7-ce808785638a';

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

        const profilesRes = await fetch(`${SUPABASE_URL}/rest/v1/interview_profiles_admin?select=*`, { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } });
        const profilesData = await profilesRes.json();

        const r = role.toLowerCase();
        let matchedProfileId = null;
        if (r !== 'default') {
           const matched = profilesData.find((p: any) => {
              const n = p.name.toLowerCase();
              if (r === 'pm' && n.includes('product')) return true;
              if (r === 'da' && n.includes('analytics')) return true;
              if (r === 'ds' && n.includes('science')) return true;
              if (r === 'hr' && (n.includes('hr') || n.includes('human'))) return true;
              return false;
           });
           matchedProfileId = matched?.id;
        }

        const mentorsRes = await fetch(`${SUPABASE_URL}/rest/v1/mentors?select=*,tier,profiles(full_name)&status=eq.approved`, { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } });
        const allMentors = await mentorsRes.json();

        const fMentor = allMentors.find((m: any) => m.id === FOUNDER_ID);
        if (fMentor) {
          if (isMounted) setFounderMentor(fMentor);
          const fSlot = await availabilityService.findNextAvailableSlot(fMentor.id);
          if (isMounted) setFounderSlot(fSlot);
        }

        let filtered = allMentors.filter((m: any) => m.id !== FOUNDER_ID) || [];
        if (matchedProfileId) {
           filtered = filtered.filter((m: any) => Array.isArray(m.profile_ids) && m.profile_ids.includes(matchedProfileId));
        }

        filtered = filtered.slice(0, 6);
        if (isMounted) setMentors(filtered);

        const availabilityPromises = filtered.map(async (m: any) => {
          const slot = await availabilityService.findNextAvailableSlot(m.id);
          return { id: m.id, slot };
        });
        const availabilityResults = await Promise.all(availabilityPromises);
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
  }, [role]);

  if (loading) {
    return (
      <View style={{ paddingVertical: 60, alignItems: 'center' }}>
        <ActivityIndicator size="large" color={CTA_TEAL} />
      </View>
    );
  }

  if (mentors.length === 0 && !founderMentor) return null;

  return (
    <View style={styles.listContainerWrapper}>
      {/* FOUNDER BLOCK */}
      {founderMentor && (
        <View style={styles.founderSection}>
          <Text style={styles.kicker}>MEET THE FOUNDER</Text>
          <Text style={[styles.h2, isSmall && styles.h2Mobile]}>Free session with the founder</Text>
          <Text style={styles.subtext}>Book a complimentary discovery call to discuss your career goals and preparation strategy.</Text>
          <View style={styles.founderCardWrapper}>
            <MentorCard
              m={founderMentor}
              displayPrice={0}
              totalSessions={founderMentor.total_sessions || 0}
              isNewMentor={false}
              averageRating={founderMentor.average_rating || 5.0}
              showRating={true}
              hasSlots={founderSlot !== "No slots available" && founderSlot !== "Loading..."}
              displaySlot={founderSlot}
              customPriceLabel="Free"
              onView={() => router.push(`/mentors/${founderMentor.id}`)}
              isSmall={isSmall}
              isFounderCard={true}
            />
          </View>
        </View>
      )}

      {/* GENERAL MENTORS BLOCK */}
      {mentors.length > 0 && (
        <>
          <Text style={styles.kicker}>YOUR INTERVIEWERS</Text>
          <Text style={[styles.h2, isSmall && styles.h2Mobile]}>Practice with top industry experts</Text>
          
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
                  onView={() => router.push(`/mentors/${m.id}`)}
                  isSmall={isSmall}
                  isFounderCard={false}
                />
              );
            })}
          </View>

          <View style={{ alignItems: "center", marginTop: 32 }}>
            <SharedButton
              title="View All Mentors"
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


// --- EXISTING LAZY COMPONENTS ---

// Simple Image for Lazy Loading
const SimpleImage = ({ source, style, alt }: any) => {
  const isWeb = Platform.OS === 'web';
  if (isWeb) {
    let src = typeof source === 'string' ? source : (source?.uri || Asset.fromModule(source)?.uri || '');
    if (src) return <img src={src} alt={alt} style={{ ...style, objectFit: 'contain' }} loading="lazy" decoding="async" />;
  }
  return <RNImage source={source} style={style} resizeMode="contain" accessible={true} accessibilityLabel={alt} />;
};

const LogoWall = memo(() => {
  const { width } = useWindowDimensions();
  const isSmall = width < 900;
  return (
    <View style={styles.logoSection} nativeID="our-mentors" accessibilityRole="region" accessibilityLabel="Companies where our mentors work">
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
  const router = useRouter();

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

      <View style={styles.reviewsCtaStrip}>
        <Text style={styles.reviewsCtaHeading}>Ready to get feedback like this?</Text>
        <TouchableOpacity
          nativeID="btn-home-reviews-view-mentors"
          style={styles.reviewsCtaButton}
          onPress={() => router.push('/mentors')}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="View our mentors"
        >
          <Text style={styles.reviewsCtaButtonText}>View Our Mentors →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

const WhyChooseUs = memo(() => {
  const { width } = useWindowDimensions();
  const isSmall = width < 900;

  const BENEFITS = [
    { icon: <FeedbackIcon />, title: 'Structured Feedback', desc: 'Detailed evaluation covering strengths, gaps, and actionable improvement areas', ariaLabel: 'Structured feedback benefit' },
    { icon: <VideoIcon />, title: 'Session Recording', desc: 'Review your performance anytime with full session recordings', ariaLabel: 'Session recording benefit' },
    { icon: <StarIcon />, title: 'Verified Mentors', desc: 'All mentors manually vetted and verified from top companies', ariaLabel: 'Verified mentors benefit' },
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
  const router = useRouter();

  const TIERS = [
    { badge: <BronzeBadge />, title: 'Bronze Tier', sessions: '0-5 Sessions', color: '#cd7f32', bgColor: '#fff5e6', borderColor: '#cd7f32', benefits: ['Top performing mid-Level Managers', '5 - 10 yrs experienced', 'Best for: Strengthening basics'], ariaLabel: 'Bronze tier pricing' },
    { badge: <SilverBadge />, title: 'Silver Tier', sessions: '5-15 Sessions',  color: '#c0c0c0', bgColor: '#f5f5f5', borderColor: '#c0c0c0', benefits: ['Senior Management from top companies', '10-15 yrs experienced', 'Best for: Senior level interviews'], ariaLabel: 'Silver tier pricing' },
    { badge: <GoldBadge />, title: 'Gold Tier', sessions: '15+ Sessions', color: '#fbbf24', bgColor: '#fffbeb', borderColor: '#fbbf24', benefits: ['Leadership / Directors', '15-20 yrs experienced', 'Best for: Hiring manager or CXO rounds'], ariaLabel: 'Gold tier pricing' },
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

      <View style={styles.pricingCta}>
        <Text style={styles.pricingCtaText}>Browse mentors across all tiers and find your perfect match</Text>
        <TouchableOpacity
          nativeID="btn-home-pricing-view-mentors"
          style={styles.pricingCtaButton}
          onPress={() => router.push('/mentors')}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="View our mentors"
        >
          <Text style={styles.pricingCtaButtonText}>View Our Mentors</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

const NotSureYet = memo(() => {
  const router = useRouter();

  return (
    <View style={styles.notSureContainer} nativeID="intro-call" accessibilityRole="region" accessibilityLabel="Book an intro call">
      <View style={styles.notSureBox}>
        <View style={styles.notSureIconRow}>
          <Text style={styles.notSureIcon}>🤔</Text>
        </View>
        <Text style={styles.notSureKicker}>NOT READY TO COMMIT?</Text>
        <Text style={styles.notSureHeading}>
          Book an <Text style={{ color: BRAND_ORANGE }}>intro call</Text> with your mentor first
        </Text>
        <Text style={styles.notSureSub}>
          Not sure which mentor is right for you, or what topic to focus on? Start with a short 30-minute intro call — no pressure, no mock interview. Just a conversation.
        </Text>

        <View style={styles.notSurePerks}>
          {[
            { icon: '🎯', text: 'Understand your preparation gaps before committing' },
            { icon: '🤝', text: "Get a feel for your mentor's style and approach" },
            { icon: '📋', text: 'Get a personalised prep plan for your target role' },
          ].map((perk, i) => (
            <View key={i} style={styles.notSurePerk}>
              <Text style={styles.notSurePerkIcon}>{perk.icon}</Text>
              <Text style={styles.notSurePerkText}>{perk.text}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          nativeID="btn-home-not-sure-intro-call"
          style={styles.notSureButton}
          onPress={() => router.push('/mentors')}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Browse mentors and book an intro call"
        >
          <Text style={styles.notSureButtonText}>Browse Mentors & Book an Intro Call</Text>
        </TouchableOpacity>
        <Text style={styles.notSureNote}>Intro calls are available directly on the mentor's profile page</Text>
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
        <View style={[styles.ctaButtonRow, isSmall && styles.ctaButtonRowMobile]}>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => router.push('/auth/sign-up')}
            activeOpacity={0.9}
            accessibilityRole="button"
            accessibilityLabel="Get Started"
          >
            <Text style={styles.ctaButtonText}>GET STARTED</Text>
          </TouchableOpacity>
          <TouchableOpacity
            nativeID="btn-home-bottom-view-mentors"
            style={[styles.ctaButton, styles.ctaButtonOutline]}
            onPress={() => router.push('/mentors')}
            activeOpacity={0.9}
            accessibilityRole="button"
            accessibilityLabel="View our mentors"
          >
            <Text style={[styles.ctaButtonText, { color: '#fff' }]}>VIEW OUR MENTORS</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

export default function LazySections() {
  const { width } = useWindowDimensions();
  const isSmall = width < 900;
  const router = useRouter();

  return (
    <>
      <DynamicDomainMentors role="default" isSmall={isSmall} onViewMentors={() => router.push('/mentors')} />
      <LogoWall />
      <InterviewTracks />
      <SocialProof />
      <Reviews />
      <WhyChooseUs />
      <CandidateTiers />
      <NotSureYet />
      <FAQSection />
      <BottomCTA />
      <Footer />
    </>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  // ===== New Standardized Headings =====
  kicker: { fontFamily: SYSTEM_FONT, fontWeight: "800", fontSize: 13, color: CTA_TEAL, marginBottom: 12, textAlign: "center", letterSpacing: 1.5, textTransform: "uppercase" },
  h2: { fontFamily: SYSTEM_FONT, fontWeight: "800", fontSize: 36, color: TEXT_DARK, marginBottom: 32, textAlign: "center", lineHeight: 44 },
  h2Mobile: { fontSize: 28, lineHeight: 36, marginBottom: 24 },
  subtext: { fontFamily: SYSTEM_FONT, fontSize: 17, color: TEXT_GRAY, textAlign: "center", lineHeight: 26, maxWidth: 600, alignSelf: "center", marginBottom: 32 },

  // ===== Shared Button =====
  sharedButtonBase: { borderRadius: 8, alignItems: "center", justifyContent: "center", paddingVertical: 14, paddingHorizontal: 28 },
  sharedButtonPrimary: { backgroundColor: CTA_TEAL, shadowOpacity: 0.2, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
  sharedButtonOutline: { backgroundColor: "transparent", borderWidth: 2, borderColor: CTA_TEAL },
  sharedButtonText: { fontFamily: SYSTEM_FONT, fontSize: 15, fontWeight: "700" },

  // ===== Dynamic Mentors List =====
  listContainerWrapper: { paddingTop: 60, paddingBottom: 20, maxWidth: 1200, width: "100%", alignSelf: "center", paddingHorizontal: 24 },
  listContainer: { flexDirection: "row", flexWrap: "wrap", gap: 16, justifyContent: "center" },
  
  // Founder Block
  founderSection: { marginBottom: 64, alignItems: 'center', width: '100%', maxWidth: 900, alignSelf: 'center' },
  founderCardWrapper: { width: '100%', maxWidth: 500, marginTop: 16 },

  // Mentor Card
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 20, borderWidth: 0.5, borderColor: "#F3F4F6", minWidth: 300, maxWidth: 500, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 }, android: { elevation: 2 } }) },
  cardFullWidth: { width: '100%', maxWidth: '100%' },
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

  // Existing Sections
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
  tracksGridMobile: { flexDirection: 'column', alignItems: 'center' },
  trackCard: { flex: 1, minWidth: 260, maxWidth: 280, backgroundColor: '#fff', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#f0f0f0' },
  trackEmoji: { fontSize: 32, marginBottom: 12 },
  trackTitle: { fontFamily: SYSTEM_FONT, fontWeight: '700', fontSize: 18, color: TEXT_DARK, marginBottom: 8 },
  trackDesc: { fontFamily: SYSTEM_FONT, fontSize: 14, color: TEXT_GRAY, lineHeight: 20, marginBottom: 16 },
  trackArrow: { alignSelf: 'flex-start', backgroundColor: CTA_TEAL, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  trackArrowText: { color: '#fff', fontWeight: '700' },
  reviewsSection: { backgroundColor: '#fff', paddingVertical: 80 },
  reviewsGrid: { flexDirection: 'row', gap: 24, justifyContent: 'center', flexWrap: 'wrap' },
  reviewsGridMobile: { flexDirection: 'column', alignItems: 'center' },
  reviewCard: { flex: 1, minWidth: 280, maxWidth: 360, backgroundColor: BG_CREAM, padding: 24, borderRadius: 16, borderWidth: 1, borderColor: '#f0f0f0' },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, gap: 12 },
  reviewHeaderLeft: { flex: 1, flexShrink: 1, minWidth: 0 },
  reviewStarsContainer: { flexShrink: 0, paddingLeft: 8 },
  reviewName: { fontFamily: SYSTEM_FONT, fontWeight: '700', fontSize: 16, color: TEXT_DARK },
  reviewRole: { fontFamily: SYSTEM_FONT, fontSize: 13, color: TEXT_GRAY, marginTop: 2 },
  reviewStars: { fontSize: 16 },
  reviewText: { fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_DARK, lineHeight: 22, fontStyle: 'italic' },

  reviewsCtaStrip: { marginTop: 48, alignItems: 'center', gap: 16, backgroundColor: BG_CREAM, borderRadius: 16, paddingVertical: 32, paddingHorizontal: 24, maxWidth: 600, alignSelf: 'center', width: '100%', borderWidth: 1, borderColor: 'rgba(24,167,167,0.2)' },
  reviewsCtaHeading: { fontFamily: SYSTEM_FONT, fontWeight: '700', fontSize: 20, color: TEXT_DARK, textAlign: 'center' },
  reviewsCtaButton: { backgroundColor: CTA_TEAL, paddingVertical: 14, paddingHorizontal: 28, borderRadius: 8, minWidth: 220, alignItems: 'center', shadowOpacity: 0.2, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
  reviewsCtaButtonText: { fontFamily: SYSTEM_FONT, fontWeight: '700', fontSize: 16, color: '#fff' },

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

  pricingCta: { marginTop: 40, alignItems: 'center', gap: 14 },
  pricingCtaText: { fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_GRAY, textAlign: 'center', maxWidth: 420 },
  pricingCtaButton: { backgroundColor: CTA_TEAL, paddingVertical: 14, paddingHorizontal: 28, borderRadius: 8, minWidth: 200, alignItems: 'center', shadowOpacity: 0.2, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
  pricingCtaButtonText: { fontFamily: SYSTEM_FONT, fontWeight: '700', fontSize: 15, color: '#fff' },

  notSureContainer: { paddingHorizontal: 24, paddingVertical: 16, backgroundColor: BG_CREAM },
  notSureBox: { backgroundColor: '#fff9f5', borderRadius: 20, paddingVertical: 48, paddingHorizontal: 40, maxWidth: 900, alignSelf: 'center', width: '100%', alignItems: 'center', borderWidth: 2, borderColor: 'rgba(245, 135, 66, 0.25)' },
  notSureIconRow: { marginBottom: 16 },
  notSureIcon: { fontSize: 40 },
  notSureKicker: { fontFamily: SYSTEM_FONT, fontWeight: '800', fontSize: 12, color: BRAND_ORANGE, letterSpacing: 1.2, marginBottom: 12, textAlign: 'center' },
  notSureHeading: { fontFamily: SYSTEM_FONT, fontWeight: '800', fontSize: 30, color: TEXT_DARK, textAlign: 'center', lineHeight: 40, marginBottom: 16 },
  notSureSub: { fontFamily: SYSTEM_FONT, fontSize: 16, color: TEXT_GRAY, textAlign: 'center', lineHeight: 26, maxWidth: 560, marginBottom: 32 },
  notSurePerks: { gap: 14, alignSelf: 'stretch', maxWidth: 480, marginBottom: 36 },
  notSurePerk: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, backgroundColor: '#fff', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(245, 135, 66, 0.15)' },
  notSurePerkIcon: { fontSize: 20 },
  notSurePerkText: { fontFamily: SYSTEM_FONT, fontSize: 14, color: TEXT_DARK, flex: 1, lineHeight: 22, fontWeight: '500' },
  notSureButton: { backgroundColor: BRAND_ORANGE, paddingVertical: 14, paddingHorizontal: 28, borderRadius: 8, minWidth: 280, alignItems: 'center', shadowOpacity: 0.2, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
  notSureButtonText: { fontFamily: SYSTEM_FONT, fontWeight: '700', fontSize: 15, color: '#fff' },
  notSureNote: { fontFamily: SYSTEM_FONT, fontSize: 12, color: TEXT_GRAY, marginTop: 14, textAlign: 'center', opacity: 0.7 },

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
  ctaButtonRow: { flexDirection: 'row', gap: 16, flexWrap: 'wrap', justifyContent: 'center' },
  ctaButtonRowMobile: { flexDirection: 'column', alignItems: 'center' },
  ctaButton: { backgroundColor: '#fff', paddingHorizontal: 40, paddingVertical: 16, borderRadius: 100 },
  ctaButtonOutline: { backgroundColor: 'transparent', borderWidth: 2, borderColor: '#fff' },
  ctaButtonText: { fontFamily: SYSTEM_FONT, fontWeight: '700', fontSize: 16, color: BRAND_ORANGE },
});