import React, { memo, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform, Image, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Svg, Path, Circle } from "react-native-svg";
import { availabilityService } from "@/services/availability.service";

// --- Constants & Config ---
const SUPABASE_URL = "https://rcbaaiiawrglvyzmawvr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjYmFhaWlhd3JnbHZ5em1hd3ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNTA1NjAsImV4cCI6MjA3NjcyNjU2MH0.V3qRHGXBMlspRS7XFJlXdo4qIcCms60Nepp7dYMEjLA";

const CTA_TEAL = "#18a7a7";
const BRAND_ORANGE = "#f58742";
const BG_CREAM = "#f8f5f0";
const TEXT_DARK = "#111827";
const TEXT_GRAY = "#4B5563";
const BORDER_LIGHT = "rgba(0,0,0,0.05)";
const SYSTEM_FONT = Platform.select({
  web: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
  ios: "System",
  android: "Roboto",
  default: "System",
}) as string;

// --- Data ---
const TESTIMONIALS = [
  { name: "Priya S.", role: "Product Manager", company: "TATA", avatar: "👩‍💼", rating: 5, quote: "The mock interview was incredibly realistic. My mentor's feedback on my product sense helped me identify exact gaps." },
  { name: "Rahul V.", role: "Data Analyst", company: "Bigbasket", avatar: "👨‍💻", rating: 5, quote: "I practiced SQL and case studies with a senior analyst. The detailed scorecard showed me exactly what to improve. Worth every rupee!" },
  { name: "Sneha P.", role: "Data Scientist", company: "Musigma", avatar: "👩‍🔬", rating: 5, quote: "Anonymous format removed all pressure. My mentor's ML system design feedback was gold. Recording helped me review and improve 2x faster." },
  { name: "Amit K.", role: "HR Manager", company: "Flipkart", avatar: "👨‍💼", rating: 5, quote: "Practiced behavioral questions with an actual HRBP from ABFRL. The structured feedback on my STAR responses made all the difference in my interviews." },
];

const GUARANTEES = [
  { icon: "💰", title: "100% Money-Back Guarantee", description: "If your mentor doesn't show up, you get a full refund. No questions asked." },
  { icon: "🔄", title: "Free Rescheduling", description: "Life happens, we get it. Reschedule for free before your session. " },
  { icon: "📹", title: "Recording Guaranteed", description: "Every session is recorded and shared within 24 hours. Review unlimited times." },
  { icon: "📝", title: "Detailed Feedback Promise", description: "Structured scorecard with actionable tips delivered within 48 hours of your session." },
];

const FAQS = [
  { q: "How is the process anonymous?", a: "No personal details are revealed to any party. Only professional title you set during onboarding will be shown. During the meeting, the video can be kept off" },
  { q: "What will the detailed feedback be like?", a: "You don't just get a 'pass/fail'. You will get a feedback form with your strengths and areas of improvements highlighted by the interviewer" },
  { q: "What happens when the mentor does not show up for the session?", a: "You will be refunded the full amount. " },
  { q: "What topic will the interview be on?", a: "You can choose the topic of your interview from a list of the commonly seen interview types in your domain" },
];

// ============================================
// SVG ICONS
// ============================================
const CheckmarkCircleIcon = ({ size = 16, color = "#3B82F6" }) => (<Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none" /><Path d="M8 12.5L10.5 15L16 9.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></Svg>);
const BriefcaseIcon = ({ size = 12, color = "#111827" }) => (<Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><Path d="M16 7V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></Svg>);
const SparklesIcon = ({ size = 14, color = "#1E40AF" }) => (<Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 14.5L2 12L9.5 9.5L12 2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><Path d="M6 3L6.5 5.5L9 6L6.5 6.5L6 9L5.5 6.5L3 6L5.5 5.5L6 3Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></Svg>);
const CheckmarkDoneIcon = ({ size = 14, color = "#6B7280" }) => (<Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M5 12L10 17L20 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><Path d="M2 12L7 17" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></Svg>);
const MedalIcon = ({ size = 14, color = "#CD7F32" }) => (<Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Circle cx="12" cy="15" r="6" fill={color} stroke={color} strokeWidth="1.5" /><Path d="M9 9L7 3L12 6L17 3L15 9" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" /></Svg>);

// ============================================
// SHARED COMPONENTS
// ============================================
const Button = memo(({ title, onPress, variant = "primary", nativeID, style, textStyle }: any) => (
  <TouchableOpacity nativeID={nativeID} style={[styles.buttonBase, variant === "primary" && styles.buttonPrimary, variant === "outline" && styles.buttonOutline, style]} onPress={onPress} activeOpacity={0.8}>
    <Text style={[styles.buttonText, variant === "primary" && { color: "#fff" }, variant === "outline" && { color: CTA_TEAL }, textStyle]}>{title}</Text>
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
// EXACT MENTOR CARD FROM MENTORS.TSX
// ============================================
const MentorCard = ({ m, displayPrice, totalSessions, isNewMentor, averageRating, showRating, hasSlots, displaySlot, customPriceLabel, onView, isFullWidth }: any) => {
  const seed = m.id || m.profiles?.full_name || 'Mentor';
  const fallbackAvatar = `https://api.dicebear.com/9.x/micah/png?seed=${encodeURIComponent(seed)}&backgroundColor=e5e7eb,f3f4f6`;
  const introPrice = Math.round(displayPrice * 0.20);

  return (
    <View style={[styles.card, isFullWidth && styles.cardFullWidth]}>
      <View style={styles.cardContent}>
        <View style={styles.headerRow}>
          <Image source={{ uri: m.avatar_url || fallbackAvatar }} style={styles.avatarImage} />
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
          <Text style={styles.bioText} numberOfLines={isFullWidth ? 3 : 2}>{m.experience_description}</Text>
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

// ============================================
// DYNAMIC DOMAIN MENTORS COMPONENT
// ============================================
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

        // Extract Founder
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
      <View style={styles.section}>
        <ActivityIndicator size="large" color={CTA_TEAL} style={{ marginVertical: 40 }} />
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
              isFullWidth={true}
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
                />
              );
            })}
          </View>

          <View style={{ alignItems: "center", marginTop: 32 }}>
            <Button
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


// ============================================
// STATIC SECTIONS
// ============================================
const StarRatingSimple = memo(({ count }: { count: number }) => (
  <View style={{ flexDirection: "row", gap: 3, marginBottom: 18 }}>
    {Array.from({ length: count }, (_, i) => (
      <Text key={i} style={{ fontFamily: SYSTEM_FONT, fontSize: 15 }}>⭐</Text>
    ))}
  </View>
));

const TestimonialCard = memo(({ testimonial }: { testimonial: typeof TESTIMONIALS[0] }) => (
  <View style={styles.testimonialCard}>
    <View style={styles.testimonialHeader}>
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>{testimonial.avatar}</Text>
      </View>
      <View style={styles.testimonialMeta}>
        <Text style={styles.testimonialName}>{testimonial.name}</Text>
        <Text style={styles.testimonialRole}>{testimonial.role} at {testimonial.company}</Text>
      </View>
    </View>
    <StarRatingSimple count={testimonial.rating} />
    <Text style={styles.testimonialQuote}>"{testimonial.quote}"</Text>
  </View>
));

const TestimonialsSection = memo(({ onViewMentors, isSmall }: { onViewMentors: (source: string) => void, isSmall: boolean }) => (
  <View style={styles.testimonialsContainer} nativeID="testimonials">
    <Text style={styles.kicker}>SUCCESS STORIES</Text>
    <Text style={[styles.h2, isSmall && styles.h2Mobile]}>Hear from successful candidates</Text>
    <View style={styles.testimonialsGrid}>
      {TESTIMONIALS.map((t, i) => (
        <TestimonialCard key={i} testimonial={t} />
      ))}
    </View>
    <View style={styles.trustIndicators}>
      <Text style={styles.trustText}>✓ Verified testimonials</Text>
      <Text style={styles.trustText}>✓ Real candidate outcomes</Text>
      <Text style={styles.trustText}>✓ Proven results</Text>
    </View>
  </View>
));

const NotSureYet = memo(({ onViewMentors, isSmall }: { onViewMentors: (source: string) => void, isSmall: boolean }) => (
  <View style={styles.notSureContainer}>
    <View style={styles.notSureBox}>
      <View style={styles.notSureIconRow}>
        <Text style={styles.notSureIcon}>🤔</Text>
      </View>
      <Text style={styles.kicker}>NOT READY TO COMMIT?</Text>
      <Text style={[styles.h2, isSmall && styles.h2Mobile, { marginBottom: 16 }]}>
        Book an <Text style={{ color: BRAND_ORANGE }}>intro call</Text> first
      </Text>
      <Text style={styles.subtext}>
        Not sure which mentor is right for you, or what topic to focus on? Start with a short 30-minute intro call — no pressure, no mock interview. Just a conversation.
      </Text>

      <View style={styles.notSurePerks}>
        {[
          { icon: "🎯", text: "Understand your preparation gaps before committing" },
          { icon: "🤝", text: "Get a feel for your mentor's style and approach" },
          { icon: "📋", text: "Get a personalised prep plan for your target role" },
        ].map((perk, i) => (
          <View key={i} style={styles.notSurePerk}>
            <Text style={styles.notSurePerkIcon}>{perk.icon}</Text>
            <Text style={styles.notSurePerkText}>{perk.text}</Text>
          </View>
        ))}
      </View>

      <Button
        nativeID="btn-lp-not-sure-intro-call"
        title="Browse Mentors & Book an Intro Call"
        onPress={() => onViewMentors("not_sure_intro_call")}
        style={styles.notSureButton}
        textStyle={{ fontSize: 15 }}
      />
      <Text style={styles.notSureNote}>Intro calls are available directly on the mentor's profile page</Text>
    </View>
  </View>
));

const GuaranteeCard = memo(({ guarantee }: { guarantee: typeof GUARANTEES[0] }) => (
  <View style={styles.guaranteeCard}>
    <Text style={{ fontFamily: SYSTEM_FONT, fontSize: 36, marginBottom: 14 }}>{guarantee.icon}</Text>
    <Text style={{ fontFamily: SYSTEM_FONT, fontSize: 17, fontWeight: "700", color: TEXT_DARK, marginBottom: 10 }}>
      {guarantee.title}
    </Text>
    <Text style={{ fontFamily: SYSTEM_FONT, fontSize: 15, color: TEXT_GRAY }}>{guarantee.description}</Text>
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
          <GuaranteeCard key={i} guarantee={g} />
        ))}
      </View>
      <View style={styles.trustSeal}>
        {["SECURE PAYMENTS", "VERIFIED MENTORS", "INSTANT REFUNDS"].map((t, i) => (
          <View key={i} style={styles.sealBadge}>
            <Text style={{ fontFamily: SYSTEM_FONT, fontSize: 12, fontWeight: "700", color: CTA_TEAL }}>✓ {t}</Text>
          </View>
        ))}
      </View>
    </View>
  </View>
));

const FAQItem = memo(({ faq }: { faq: typeof FAQS[0] }) => (
  <View style={styles.faqItem}>
    <Text style={{ fontFamily: SYSTEM_FONT, fontWeight: "700", fontSize: 16, color: TEXT_DARK, marginBottom: 6 }}>
      {faq.q}
    </Text>
    <Text style={{ fontFamily: SYSTEM_FONT, fontSize: 14, color: TEXT_GRAY, lineHeight: 22 }}>
      {faq.a}
    </Text>
  </View>
));

const FAQ = memo(({ isSmall }: { isSmall: boolean }) => (
  <View style={styles.section}>
    <Text style={styles.kicker}>FAQ</Text>
    <Text style={[styles.h2, isSmall && styles.h2Mobile]}>Common Questions</Text>
    <View style={{ gap: 12 }}>
      {FAQS.map((f, i) => (
        <FAQItem key={i} faq={f} />
      ))}
    </View>
  </View>
));

const FinalCTABanner = memo(({ onViewMentors, isSmall }: { onViewMentors: (source: string) => void, isSmall: boolean }) => (
  <View style={styles.finalCtaContainer}>
    <View style={styles.finalCtaBox}>
      <Text style={[styles.h2, isSmall && styles.h2Mobile, { color: '#fff', marginBottom: 16 }]}>
        Your next interview is closer than you think
      </Text>
      <Text style={[styles.subtext, { color: 'rgba(255,255,255,0.85)' }]}>
        Browse mentors, pick a topic, and book your session in minutes.
      </Text>
      <Button
        nativeID="btn-lp-final-view-mentors"
        title="View Our Mentors →"
        onPress={() => onViewMentors("final_cta")}
        style={styles.finalCtaButton}
        textStyle={{color: '#000000', fontSize: 17 }}
      />
      <View style={styles.finalCtaTrust}>
        <Text style={styles.finalCtaTrustItem}>✓ Anonymous</Text>
        <Text style={styles.finalCtaTrustItem}>✓ Money-back guarantee</Text>
        <Text style={styles.finalCtaTrustItem}>✓ Recording included</Text>
      </View>
    </View>
  </View>
));

// --- SINGLE DEFAULT EXPORT ---
export default function LazySectionsLP({
  role,
  onPricingLayout,
  isSmall,
  onViewMentors,
}: {
  role: string;
  onPricingLayout?: (y: number) => void;
  isSmall: boolean;
  onViewMentors: (source: string) => void;
}) {
  return (
    <>
      <DynamicDomainMentors role={role} isSmall={isSmall} onViewMentors={() => onViewMentors("domain_mentors_cta")} />
      <TestimonialsSection onViewMentors={onViewMentors} isSmall={isSmall} />
      <NotSureYet onViewMentors={onViewMentors} isSmall={isSmall} />
      <GuaranteeSection isSmall={isSmall} />
      <FAQ isSmall={isSmall} />
      <FinalCTABanner onViewMentors={onViewMentors} isSmall={isSmall} />
    </>
  );
}

const styles = StyleSheet.create({
  // ===== Unified Section & Text Styles =====
  section: {
    maxWidth: 900,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingVertical: 60,
  },
  kicker: {
    fontFamily: SYSTEM_FONT,
    fontWeight: "800",
    fontSize: 13,
    color: CTA_TEAL,
    marginBottom: 12,
    textAlign: "center",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  h2: {
    fontFamily: SYSTEM_FONT,
    fontWeight: "800",
    fontSize: 36,
    color: TEXT_DARK,
    marginBottom: 32,
    textAlign: "center",
    lineHeight: 44,
  },
  h2Mobile: {
    fontSize: 28,
    lineHeight: 36,
    marginBottom: 24,
  },
  subtext: {
    fontFamily: SYSTEM_FONT,
    fontSize: 17,
    color: TEXT_GRAY,
    textAlign: "center",
    lineHeight: 26,
    maxWidth: 600,
    alignSelf: "center",
    marginBottom: 32,
  },

  // ===== Button Styles =====
  buttonBase: {
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 28,
  },
  buttonPrimary: {
    backgroundColor: CTA_TEAL,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  buttonOutline: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: CTA_TEAL,
  },
  buttonText: {
    fontFamily: SYSTEM_FONT,
    fontSize: 15,
    fontWeight: "700",
  },

  // ===== Dynamic Mentors List =====
  listContainerWrapper: {
    paddingVertical: 60,
    maxWidth: 1200,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 24,
  },
  listContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "center",
  },
  
  // Founder Block
  founderSection: {
    marginBottom: 64,
    alignItems: 'center',
    width: '100%',
    maxWidth: 900,
    alignSelf: 'center',
  },
  founderCardWrapper: {
    width: '100%',
    marginTop: 16,
  },

  // Card Styles from mentors.tsx
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 20, borderWidth: 0.5, borderColor: "#F3F4F6", width: Platform.OS === "web" ? "calc(50% - 8px)" : "100%", minWidth: 300, maxWidth: 500, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 }, android: { elevation: 2 } }) },
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

  // ===== Testimonials =====
  testimonialsContainer: {
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 24,
    backgroundColor: BG_CREAM,
  },
  testimonialsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 24,
    justifyContent: "center",
    maxWidth: 1200,
    alignSelf: "center",
  },
  testimonialCard: {
    backgroundColor: "#fff",
    padding: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    width: Platform.OS === "web" ? "calc(50% - 12px)" : "100%",
    minWidth: 280,
    maxWidth: 550,
  },
  testimonialHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    gap: 14,
  },
  avatarContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: BG_CREAM,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: BORDER_LIGHT,
  },
  avatarText: {
    fontFamily: SYSTEM_FONT,
    fontSize: 26,
  },
  testimonialMeta: {
    flex: 1,
  },
  testimonialName: {
    fontFamily: SYSTEM_FONT,
    fontSize: 17,
    fontWeight: "700",
    color: TEXT_DARK,
    marginBottom: 3,
  },
  testimonialRole: {
    fontFamily: SYSTEM_FONT,
    fontSize: 14,
    fontWeight: "600",
    color: TEXT_GRAY,
  },
  testimonialQuote: {
    fontFamily: SYSTEM_FONT,
    fontSize: 15,
    lineHeight: 25,
    color: TEXT_DARK,
    marginBottom: 18,
  },
  trustIndicators: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 32,
    marginTop: 48,
    flexWrap: "wrap",
  },
  trustText: {
    fontFamily: SYSTEM_FONT,
    fontSize: 13,
    fontWeight: "600",
    color: TEXT_GRAY,
    opacity: 0.8,
  },

  // ===== Not Sure Yet =====
  notSureContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: BG_CREAM,
  },
  notSureBox: {
    backgroundColor: "#fff9f5",
    borderRadius: 20,
    paddingVertical: 48,
    paddingHorizontal: 40,
    maxWidth: 900,
    alignSelf: "center",
    width: "100%",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(245, 135, 66, 0.25)",
  },
  notSureIconRow: {
    marginBottom: 16,
  },
  notSureIcon: {
    fontFamily: SYSTEM_FONT,
    fontSize: 40,
  },
  notSurePerks: {
    gap: 14,
    alignSelf: "stretch",
    maxWidth: 480,
    marginBottom: 36,
  },
  notSurePerk: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(245, 135, 66, 0.15)",
  },
  notSurePerkIcon: {
    fontFamily: SYSTEM_FONT,
    fontSize: 20,
  },
  notSurePerkText: {
    fontFamily: SYSTEM_FONT,
    fontSize: 14,
    color: TEXT_DARK,
    flex: 1,
    lineHeight: 22,
    fontWeight: "500",
  },
  notSureButton: {
    backgroundColor: BRAND_ORANGE,
    minWidth: 280,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  notSureNote: {
    fontFamily: SYSTEM_FONT,
    fontSize: 12,
    color: TEXT_GRAY,
    marginTop: 14,
    textAlign: "center",
    opacity: 0.7,
  },

  // ===== Guarantee =====
  guaranteeContainer: {
    paddingTop: 40,
    paddingBottom: 80,
    paddingHorizontal: 24,
    backgroundColor: BG_CREAM,
  },
  guaranteeBox: {
    backgroundColor: "#fff",
    padding: 56,
    borderRadius: 20,
    maxWidth: 1100,
    alignSelf: "center",
    width: "100%",
    borderWidth: 2,
    borderColor: "rgba(24, 167, 167, 0.3)",
  },
  guaranteesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 24,
    marginBottom: 44,
    justifyContent: "center",
  },
  guaranteeCard: {
    backgroundColor: BG_CREAM,
    padding: 28,
    borderRadius: 16,
    width: Platform.OS === "web" ? "calc(50% - 12px)" : "100%",
    minWidth: 240,
    maxWidth: 500,
    borderWidth: 1,
    borderColor: BORDER_LIGHT,
  },
  trustSeal: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 18,
    paddingVertical: 26,
    borderTopWidth: 1,
    borderTopColor: BORDER_LIGHT,
    flexWrap: "wrap",
  },
  sealBadge: {
    backgroundColor: "#e8f9f9",
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(24, 167, 167, 0.15)",
  },

  // ===== FAQ =====
  faqItem: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_LIGHT,
  },

  // ===== Final CTA Banner =====
  finalCtaContainer: {
    paddingHorizontal: 24,
    paddingVertical: 60,
    backgroundColor: BG_CREAM,
  },
  finalCtaBox: {
    backgroundColor: CTA_TEAL,
    borderRadius: 24,
    paddingVertical: 56,
    paddingHorizontal: 40,
    maxWidth: 900,
    alignSelf: "center",
    width: "100%",
    alignItems: "center",
  },
  finalCtaButton: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 36,
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    minWidth: 240,
  },
  finalCtaTrust: {
    flexDirection: "row",
    gap: 20,
    marginTop: 24,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  finalCtaTrustItem: {
    fontFamily: SYSTEM_FONT,
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(255,255,255,0.9)",
  },
});