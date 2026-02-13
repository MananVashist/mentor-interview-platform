// app/lp/[role].tsx
import React, { memo, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Head from "expo-router/head";

import { Header } from "@/components/Header";
import { trackEvent } from "@/lib/analytics";
import { BronzeBadge, SilverBadge, GoldBadge } from "@/components/AppIcons";

// --- Constants ---
const BRAND_ORANGE = "#f58742";
const CTA_TEAL = "#18a7a7";
const BG_CREAM = "#f8f5f0";
const TEXT_DARK = "#222";
const TEXT_GRAY = "#555";
const BORDER_LIGHT = "rgba(0,0,0,0.05)";

// Metal Colors
const COLOR_BRONZE = "#A67C52";
const BG_BRONZE = "#FCF8F5";

const COLOR_SILVER = "#71797E";
const BG_SILVER = "#F4F6F8";

const COLOR_GOLD = "#D4AF37";
const BG_GOLD = "#FFFEF5";

const SYSTEM_FONT = Platform.select({
  web: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
  ios: "System",
  android: "Roboto",
  default: "System",
}) as string;

// Testimonials Data
const TESTIMONIALS = [
  {
    name: "Priya S.",
    role: "Product Manager",
    company: "TATA",
    avatar: "👩‍💼",
    rating: 5,
    quote:
      "The mock interview was incredibly realistic. My mentor's feedback on my product sense helped me identify exact gaps.",
  },
  {
    name: "Rahul V.",
    role: "Data Analyst",
    company: "Bigbasket",
    avatar: "👨‍💻",
    rating: 5,
    quote:
      "I practiced SQL and case studies with a senior analyst. The detailed scorecard showed me exactly what to improve. Worth every rupee!",
  },
  {
    name: "Sneha P.",
    role: "Data Scientist",
    company: "Musigma",
    avatar: "👩‍🔬",
    rating: 5,
    quote:
      "Anonymous format removed all pressure. My mentor's ML system design feedback was gold. Recording helped me review and improve 2x faster.",
  },
  {
    name: "Amit K.",
    role: "HR Manager",
    company: "Flipkart",
    avatar: "👨‍💼",
    rating: 5,
    quote:
      "Practiced behavioral questions with an actual HRBP from ABFRL. The structured feedback on my STAR responses made all the difference in my interviews.",
  },
];

// Guarantee Data
const GUARANTEES = [
  {
    icon: "💰",
    title: "100% Money-Back Guarantee",
    description: "If your mentor doesn't show up, you get a full refund. No questions asked.",
  },
  {
    icon: "🔄",
    title: "Free Rescheduling",
    description: "Life happens, we get it. Reschedule for free before your session. ",
  },
  {
    icon: "📹",
    title: "Recording Guaranteed",
    description: "Every session is recorded and shared within 24 hours. Review unlimited times.",
  },
  {
    icon: "📝",
    title: "Detailed Feedback Promise",
    description: "Structured scorecard with actionable tips delivered within 48 hours of your session.",
  },
];

// --- Valid Roles Config ---
// NOTE: PM route removed - now handled by Next.js at /lp/pm
const VALID_ROLES = ["hr", "ds", "da"];

// Role-Specific Content
// NOTE: PM content removed - now handled by Next.js
const ROLE_CONTENT: Record<string, { title: string; highlight: string; sub: string }> = {
  default: {
    title: "Mock Interviews",
    highlight: "with expert mentors",
    sub: "Get realistic feedback from industry experts. Anonymous & Unbiased.",
  },
  hr: {
    title: "HR mock interviews with ",
    highlight: "real HR leaders",
    sub: "Talent Acquisition, HRBP, COE, Generalist and Operations. Practice with veterans from the industry.",
  },
  ds: {
    title: "Data Science mock interviews",
    highlight: "with real experts",
    sub: "ML Theory/Practical, Coding, Statistics and System Design. Practice with veterans from the industry",
  },
  da: {
    title: "Data Analytics mock interviews",
    highlight: "with domain experts",
    sub: "Case studies, SQL, Excel, Product Metrics and Behavioral. Practice with vetted mentors.",
  },
};

// How It Works Data
const STEPS = [
  {
    emoji: "📝",
    title: "1. Browse mentors",
    desc: "Choose from a list of expert mentors in your domain and the topic you want to practice ",
  },
  {
    emoji: "🎥",
    title: "2. The Session",
    desc: "1:1 Video Call. Completely anonymous. Recording will be provided.",
  },
  {
    emoji: "📊",
    title: "3. The Feedback",
    desc: "Detailed written scorecard & actionable tips.",
  },
];

// FAQ Data
const FAQS = [
  {
    q: "How is the process anonymous?",
    a: "No personal details are revealed to any party. Only professional title you set during onboarding will be shown. During the meeting, the video can be kept off",
  },
  {
    q: "What will the detailed feedback be like?",
    a: "You don't just get a 'pass/fail'. You will get a feedback form with your strengths and areas of improvements highlighted by the interviewer",
  },
  {
    q: "What happens when the mentor does not show up for the session?",
    a: "You will be refunded the full amount. ",
  },
  {
    q: "What topic will the interview be on?",
    a: "You can choose the topic of your interview from a list of the commonly seen interview types in your domain",
  },
];

// ===== Button Component =====
const Button = ({
  title,
  onPress,
  variant = "primary",
  color = CTA_TEAL,
  style,
  textStyle,
  nativeID,
}: {
  title: string;
  onPress: () => void;
  variant?: "primary" | "outline";
  color?: string;
  style?: any;
  textStyle?: any;
  nativeID?: string;
}) => {
  return (
    <TouchableOpacity
      nativeID={nativeID}
      style={[
        styles.buttonBase,
        variant === "primary" && { backgroundColor: color, shadowColor: color },
        variant === "primary" && styles.buttonShadow,
        variant === "outline" && styles.buttonOutline,
        variant === "outline" && { borderColor: color },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.75}
      accessibilityRole="button"
    >
      <Text
        style={[
          styles.buttonText,
          variant === "primary" && { color: "#fff" },
          variant === "outline" && { color: TEXT_DARK },
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

// ===== Trust Footer Component (UPDATED) =====
const TrustFooter = memo(({ isSmall }: { isSmall: boolean }) => {
  return (
    <View
      style={[
        styles.trustRow,
        isSmall && { flexDirection: "column", gap: 8, alignItems: "center" },
      ]}
    >
      <Text style={styles.trustItem}>✓ Starts at ₹3,500</Text>
      <Text style={styles.trustItem}>✓ 1:1 call</Text>
      <Text style={styles.trustItem}>✓ Recording + scorecard</Text>
    </View>
  );
});

// ===== Pricing Section =====
const CandidateTiers = memo(({ onPricingLayout }: { onPricingLayout?: (y: number) => void }) => {
  const { width } = useWindowDimensions();
  const isSmall = width < 900;

  const TIERS = [
    {
      badge: <BronzeBadge />,
      title: "Bronze Tier",
      sessions: "0-5 Sessions",
      price: "₹3,500 - ₹6,000",
      color: "#cd7f32",
      bgColor: "#fff5e6",
      borderColor: "#cd7f32",
      benefits: ["Top performing mid-Level Managers", "5 - 10 yrs experienced", "Best for: Strengthening basics"],
      ariaLabel: "Bronze tier pricing",
    },
    {
      badge: <SilverBadge />,
      title: "Silver Tier",
      sessions: "5-15 Sessions",
      price: "₹6,000 - ₹10,000",
      color: "#706F6D",
      bgColor: "#f5f5f5",
      borderColor: "#c0c0c0",
      benefits: ["Senior Management from top companies", "10-15 yrs experienced", "Best for: Senior level interviews"],
      ariaLabel: "Silver tier pricing",
    },
    {
      badge: <GoldBadge />,
      title: "Gold Tier",
      sessions: "15+ Sessions",
      price: "₹10,000 - ₹15,000",
      color: "#B8860B",
      bgColor: "#fffbeb",
      borderColor: "#fbbf24",
      benefits: ["Leadership / Directors", "15-20 yrs experienced", "Best for: Hiring manager or CXO rounds"],
      ariaLabel: "Gold tier pricing",
    },
  ];

  return (
    <View
      style={styles.section}
      nativeID="pricing"
      accessibilityRole="region"
      accessibilityLabel="Pricing tiers"
      onLayout={(e) => onPricingLayout?.(e.nativeEvent.layout.y)}
    >
      <Text style={styles.kicker} accessibilityRole="header">
        PRICING
      </Text>
      <Text style={[styles.h2, isSmall && styles.h2Mobile]} accessibilityRole="header" accessibilityLevel={2}>
        Choose Your Mentor Tier
      </Text>
      <View style={[styles.tiersGrid, isSmall && styles.tiersGridMobile]}>
        {TIERS.map((tier, i) => (
          <View
            key={i}
            style={[styles.tierCard, { backgroundColor: tier.bgColor, borderColor: tier.borderColor }]}
            accessibilityRole="article"
            accessibilityLabel={tier.ariaLabel}
          >
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

// ===== How It Works Section =====
const HowItWorks = memo(({ isSmall }: { isSmall: boolean }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.kicker}>THE PROCESS</Text>
      <Text style={[styles.h2, isSmall && styles.h2Mobile]}>Simple.</Text>

      {/* Steps Grid */}
      <View style={[styles.stepsGrid, isSmall && styles.stepsGridMobile]}>
        {STEPS.map((s, i) => (
          <View key={i} style={styles.stepCard}>
            <Text style={styles.stepEmoji}>{s.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.stepTitle}>{s.title}</Text>
              <Text style={styles.stepDesc}>{s.desc}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
});

// ===== FAQ Section =====
const FAQ = memo(({ isSmall }: { isSmall: boolean }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.kicker}>FAQ</Text>
      <Text style={[styles.h2, isSmall && styles.h2Mobile]}>Common Questions</Text>

      {/* FAQ Items */}
      <View style={styles.faqWrap}>
        {FAQS.map((f) => (
          <View key={f.q} style={styles.faqItem}>
            <Text style={styles.faqQ}>{f.q}</Text>
            <Text style={styles.faqA}>{f.a}</Text>
          </View>
        ))}
      </View>
    </View>
  );
});

// ===== Testimonials Section =====
const TestimonialsSection = memo(() => {
  return (
    <View style={styles.testimonialsContainer} nativeID="testimonials">
      <Text style={styles.kicker}>SUCCESS STORIES</Text>

      {/* Testimonial Cards */}
      <View style={styles.testimonialsGrid}>
        {TESTIMONIALS.map((testimonial, index) => (
          <View key={index} style={styles.testimonialCard}>
            <View style={styles.testimonialHeader}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatar}>{testimonial.avatar}</Text>
              </View>
              <View style={styles.testimonialMeta}>
                <Text style={styles.testimonialName}>{testimonial.name}</Text>
                <Text style={styles.testimonialRole}>
                  {testimonial.role} at {testimonial.company}
                </Text>
              </View>
            </View>

            <View style={styles.ratingContainer}>
              {[...Array(testimonial.rating)].map((_, i) => (
                <Text key={i} style={styles.star}>
                  ⭐
                </Text>
              ))}
            </View>

            <Text style={styles.testimonialQuote}>"{testimonial.quote}"</Text>
          </View>
        ))}
      </View>

      {/* Trust Indicators */}
      <View style={styles.trustIndicators}>
        <Text style={styles.trustText}>✓ Verified testimonials</Text>
        <Text style={styles.trustText}>✓ Real candidate outcomes</Text>
        <Text style={styles.trustText}>✓ Proven results</Text>
      </View>
    </View>
  );
});

// ===== Guarantee Section =====
const GuaranteeSection = memo(() => {
  return (
    <View style={styles.guaranteeContainer} nativeID="guarantee">
      <View style={styles.guaranteeBox}>
        {/* Badge */}
        <View style={styles.guaranteeBadgeContainer}>
          <View style={styles.guaranteeBadge}>
            <Text style={styles.guaranteeBadgeEmoji}>🛡️</Text>
            <Text style={styles.guaranteeBadgeText}>RISK-FREE GUARANTEE</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.guaranteeTitle}>
          Practice with complete <Text style={{ color: CTA_TEAL }}>confidence</Text>
        </Text>

        <Text style={styles.guaranteeSubtitle}>
          Your investment is protected. We've got your back every step of the way.
        </Text>

        {/* Guarantee Cards */}
        <View style={styles.guaranteesGrid}>
          {GUARANTEES.map((guarantee, index) => (
            <View key={index} style={styles.guaranteeCard}>
              <Text style={styles.guaranteeIcon}>{guarantee.icon}</Text>
              <Text style={styles.guaranteeCardTitle}>{guarantee.title}</Text>
              <Text style={styles.guaranteeDescription}>{guarantee.description}</Text>
            </View>
          ))}
        </View>

        {/* Trust Seal */}
        <View style={styles.trustSeal}>
          <View style={styles.sealBadge}>
            <Text style={styles.sealText}>✓ SECURE PAYMENTS</Text>
          </View>
          <View style={styles.sealBadge}>
            <Text style={styles.sealText}>✓ VERIFIED MENTORS</Text>
          </View>
          <View style={styles.sealBadge}>
            <Text style={styles.sealText}>✓ INSTANT REFUNDS</Text>
          </View>
        </View>

        {/* Assurance Box */}
        <View style={styles.assuranceBox}>
          <Text style={styles.assuranceText}>
            <Text style={{ fontWeight: "800", color: TEXT_DARK }}>Still unsure?</Text> Our support team is available
            24/7 to answer any questions. Email us at crackjobshelpdesk@gmail.com
          </Text>
        </View>
      </View>
    </View>
  );
});

// --- Main Page ---
export default function CampaignLanding() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isSmall = width < 900;

  const scrollRef = useRef<ScrollView>(null);
  const [pricingY, setPricingY] = useState<number>(0);

  // 1. GET PARAMS
  const params = useLocalSearchParams();
  const { role } = params;

  // 2. DETERMINE ROLE
  const activeRole = typeof role === "string" && VALID_ROLES.includes(role) ? role : "default";

  // Track analytics for valid roles only
  React.useEffect(() => {
    if (activeRole !== "default" && role !== "pm") {
      trackEvent("lp_visit", {
        role: activeRole,
        page_title: ROLE_CONTENT[activeRole].title,
      });
    }
  }, [activeRole, role]);

  // Capture UTM
  const utm = useMemo(() => {
    return {
      source: typeof params.utm_source === "string" ? params.utm_source : "",
      campaign: typeof params.utm_campaign === "string" ? params.utm_campaign : "",
      content: typeof params.utm_content === "string" ? params.utm_content : "",
    };
  }, [params]);

  // 3. DYNAMIC CONTENT RESOLUTION
  const content = ROLE_CONTENT[activeRole];

  const CTA_LABEL: Record<string, string> = {
    da: "Book a Data Analytics Mock Interview",
    ds: "Book a Data Science Mock Interview",
    hr: "Book an HR Mock Interview",
    default: "Book Your Mock Interview",
  };

  const handleBookClick = (tier: string = "general") => {
    console.log("[Analytics] Interest Captured:", {
      role: activeRole,
      tier_intent: tier,
      source: utm.source,
    });

    router.push("/auth/sign-up");
  };

  const handlePricingClick = () => {
    if (Platform.OS === "web") {
      const el = document.getElementById("pricing");
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    scrollRef.current?.scrollTo({ y: pricingY, animated: true });
  };

  // Handle PM route - show development message
  if (role === "pm") {
    return (
      <View style={styles.container}>
        <Header />
        <View style={{ padding: 40, alignItems: "center" }}>
          <Text style={{ fontSize: 24, fontWeight: "800", color: TEXT_DARK, marginBottom: 20 }}>
            PM Route Now Handled by Next.js
          </Text>
          <Text style={{ fontSize: 16, color: TEXT_GRAY, textAlign: "center", marginBottom: 20 }}>
            In development: Run Next.js dev server
          </Text>
          <Text style={{ fontSize: 14, color: TEXT_GRAY, fontFamily: "monospace", marginBottom: 10 }}>
            cd landing && npm run dev
          </Text>
          <Text style={{ fontSize: 14, color: TEXT_GRAY, marginBottom: 20 }}>
            Then visit: http://localhost:3000/pm
          </Text>
          <Text style={{ fontSize: 14, color: TEXT_GRAY, textAlign: "center" }}>
            In production, static Next.js files will serve /lp/pm automatically.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <>
      <Head>
        <title>{`CrackJobs | ${content.title} Interview Prep`}</title>
        <meta name="description" content={`Practice ${content.title} interviews with real experts. ${content.sub}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, sans-serif; background-color: ${BG_CREAM}; } * { box-sizing: border-box; }`}</style>
      </Head>

      <ScrollView ref={scrollRef} style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <Header />

        {/* HERO SECTION */}
        <View style={styles.heroSection}>
          <View style={[styles.heroInner, isSmall && styles.heroInnerMobile]}>

            {/* Dynamic Headline */}
            <Text style={[styles.h1, isSmall && styles.h1Mobile]}>
              {content.title}
              {"\n"}
              <Text style={{ color: CTA_TEAL }}>{content.highlight}</Text>
            </Text>

            {/* Dynamic Subtext */}
            <Text style={[styles.sub, isSmall && styles.subMobile]}>{content.sub}</Text>

            {/* CTAs */}
            <View style={[styles.ctaRow, isSmall && { flexDirection: "column" }]}>
              <Button
                nativeID="btn-lp-hero-cta"
                title={CTA_LABEL[activeRole] ?? CTA_LABEL.default}
                onPress={() => handleBookClick("hero_cta")}
                style={[styles.ctaBig, isSmall && { width: "100%" }]}
                textStyle={{ fontSize: 16 }}
              />

              <Button
                nativeID="btn-lp-hero-pricing"
                title="View pricing"
                variant="outline"
                color={CTA_TEAL}
                onPress={handlePricingClick}
                style={[styles.ctaBig, isSmall && { width: "100%" }]}
              />
            </View>

            <TrustFooter isSmall={isSmall} />
          </View>
        </View>

        <HowItWorks isSmall={isSmall} />
        <TestimonialsSection />
        <CandidateTiers onPricingLayout={setPricingY} />
        <GuaranteeSection />
        <FAQ isSmall={isSmall} />

        <View style={[styles.section, { paddingBottom: 60 }]}>
          <Text style={styles.footerText}>© {new Date().getFullYear()} CrackJobs</Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  // ===== Base Styles =====
  container: {
    flex: 1,
    backgroundColor: BG_CREAM,

  },
  scrollContent: {
    minHeight: "100%",
  },

  // ===== Button Styles =====
  buttonBase: {
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 28,
  },
  buttonShadow: {
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  buttonOutline: {
    backgroundColor: "transparent",
    borderWidth: 2,
  },
  buttonText: {
    fontFamily: SYSTEM_FONT,
    fontSize: 15,
    fontWeight: "700",
  },

  // ===== Hero Section =====
  heroSection: {
    maxWidth: 1000,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 30,
  },
  heroInner: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 40,
    paddingBottom: 48,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    borderWidth: 1,
    borderColor: BORDER_LIGHT,
    alignItems: "center",
  },
  heroInnerMobile: {
    padding: 24,
    paddingBottom: 32,
  },
  badge: {
    backgroundColor: "#f0fdfd",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 20,
  },
  badgeText: {
    color: CTA_TEAL,
    fontWeight: "800",
    fontSize: 11,
    fontFamily: SYSTEM_FONT,
    letterSpacing: 0.5,
  },
  h1: {
    fontFamily: SYSTEM_FONT,
    fontWeight: "800",
    fontSize: 42,
    color: BRAND_ORANGE,
    lineHeight: 48,
    marginBottom: 12,
    textAlign: "center",
  },
  h1Mobile: {
    fontSize: 32,
    lineHeight: 38,
  },
  sub: {
    fontFamily: SYSTEM_FONT,
    fontSize: 17,
    color: TEXT_GRAY,
    lineHeight: 26,
    textAlign: "center",
    maxWidth: 600,
    marginBottom: 30,
  },
  subMobile: {
    fontSize: 16,
  },
  ctaRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    justifyContent: "center",
    marginBottom: 24,
    marginTop: 12,
  },
  ctaBig: {
    minWidth: 160,
  },
  trustRow: {
    flexDirection: "row",
    gap: 24,
    opacity: 0.8,
  },
  trustItem: {
    fontFamily: SYSTEM_FONT,
    fontSize: 13,
    fontWeight: "500",
    color: TEXT_GRAY,
  },

  // ===== Section Styles =====
  section: {
    maxWidth: 900,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  kicker: {
    fontFamily: SYSTEM_FONT,
    fontWeight: "800",
    fontSize: 12,
    color: CTA_TEAL,
    marginBottom: 10,
    textAlign: "center",
    letterSpacing: 1,
  },
  h2: {
    fontFamily: SYSTEM_FONT,
    fontWeight: "800",
    fontSize: 28,
    color: TEXT_DARK,
    marginBottom: 20,
    textAlign: "center",
  },
  h2Mobile: {
    fontSize: 24,
  },

  // ===== How It Works Section =====
  stepsGrid: {
    gap: 16,
  },
  stepsGridMobile: {
    gap: 16,
  },
  stepCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER_LIGHT,
    gap: 16,
  },
  stepEmoji: {
    fontSize: 28,
  },
  stepTitle: {
    fontFamily: SYSTEM_FONT,
    fontWeight: "700",
    fontSize: 16,
    color: TEXT_DARK,
    marginBottom: 2,
  },
  stepDesc: {
    fontFamily: SYSTEM_FONT,
    fontWeight: "500",
    fontSize: 14,
    color: TEXT_GRAY,
  },

  // ===== Pricing Section =====
  tiersGrid: {
    flexDirection: "row",
    gap: 24,
    justifyContent: "center",
    alignItems: "stretch",
    maxWidth: 1200,
    alignSelf: "center",
  },
  tiersGridMobile: {
    flexDirection: "column",
    maxWidth: 800,
    gap: 20,
  },
  tierCard: {
    flex: 1,
    maxWidth: 360,
    padding: 28,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 2,
  },
  tierBadgeContainer: {
    marginBottom: 16,
  },
  tierTitle: {
    fontFamily: SYSTEM_FONT,
    fontWeight: "700",
    fontSize: 20,
    marginBottom: 4,
    textAlign: "center",
  },
  tierSessions: {
    fontFamily: SYSTEM_FONT,
    fontSize: 14,
    marginBottom: 16,
    textAlign: "center",
  },
  tierBenefits: {
    gap: 8,
    alignSelf: "stretch",
  },
  tierBenefitRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  tierBenefitBullet: {
    fontFamily: SYSTEM_FONT,
    fontSize: 15,
    lineHeight: 24,
    fontWeight: "700",
  },
  tierBenefitText: {
    fontFamily: SYSTEM_FONT,
    fontSize: 15,
    lineHeight: 24,
    flex: 1,
  },

  // ===== FAQ Section =====
  faqWrap: {
    gap: 12,
  },
  faqItem: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_LIGHT,
  },
  faqQ: {
    fontFamily: SYSTEM_FONT,
    fontWeight: "700",
    fontSize: 16,
    color: TEXT_DARK,
    marginBottom: 6,
  },
  faqA: {
    fontFamily: SYSTEM_FONT,
    fontWeight: "400",
    fontSize: 14,
    color: TEXT_GRAY,
    lineHeight: 22,
  },

  footerText: {
    textAlign: "center",
    fontFamily: SYSTEM_FONT,
    color: "#999",
    fontSize: 13,
  },

  // ===== Testimonials Section =====
  testimonialsContainer: {
    paddingTop: 60,
    paddingBottom: 80,
    paddingLeft: 24,
    paddingRight: 24,
    backgroundColor: BG_CREAM,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 80,
    marginBottom: 60,
    flexWrap: "wrap",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontFamily: SYSTEM_FONT,
    fontSize: 44,
    fontWeight: "900",
    color: CTA_TEAL,
    marginBottom: 10,
    letterSpacing: -1,
  },
  statLabel: {
    fontFamily: SYSTEM_FONT,
    fontSize: 15,
    fontWeight: "600",
    color: TEXT_GRAY,
    letterSpacing: 0.3,
  },
  testimonialsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 24,
    maxWidth: 1200,
    alignSelf: "center",
    justifyContent: "center",
  },
  testimonialCard: {
    backgroundColor: "#ffffff",
    padding: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    width: "calc(50% - 12px)",
    minWidth: 280,
    maxWidth: 550,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
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
    borderColor: "rgba(0,0,0,0.05)",
  },
  avatar: {
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
  ratingContainer: {
    flexDirection: "row",
    gap: 3,
    marginBottom: 18,
  },
  star: {
    fontSize: 15,
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

  // ===== Guarantee Section =====
  guaranteeContainer: {
    paddingTop: 40,
    paddingBottom: 80,
    paddingLeft: 24,
    paddingRight: 24,
    backgroundColor: BG_CREAM,
  },
  guaranteeBox: {
    backgroundColor: "#ffffff",
    padding: 56,
    borderRadius: 20,
    maxWidth: 1100,
    alignSelf: "center",
    width: "100%",
    borderWidth: 2,
    borderColor: "rgba(24, 167, 167, 0.3)",
    shadowColor: CTA_TEAL,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  guaranteeBadgeContainer: {
    alignItems: "center",
    marginBottom: 28,
  },
  guaranteeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e8f9f9",
    paddingVertical: 11,
    paddingHorizontal: 22,
    borderRadius: 100,
    gap: 10,
    borderWidth: 1,
    borderColor: "rgba(24, 167, 167, 0.2)",
  },
  guaranteeBadgeEmoji: {
    fontSize: 18,
  },
  guaranteeBadgeText: {
    fontFamily: SYSTEM_FONT,
    fontSize: 13,
    fontWeight: "800",
    color: CTA_TEAL,
    letterSpacing: 1.2,
  },
  guaranteeTitle: {
    fontFamily: SYSTEM_FONT,
    fontSize: 38,
    fontWeight: "800",
    color: TEXT_DARK,
    textAlign: "center",
    lineHeight: 50,
    marginBottom: 18,
  },
  guaranteeSubtitle: {
    fontFamily: SYSTEM_FONT,
    fontSize: 18,
    fontWeight: "500",
    color: TEXT_GRAY,
    textAlign: "center",
    lineHeight: 30,
    marginBottom: 52,
    maxWidth: 600,
    alignSelf: "center",
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
    width: "calc(50% - 12px)",
    minWidth: 240,
    maxWidth: 500,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  guaranteeIcon: {
    fontSize: 36,
    marginBottom: 14,
  },
  guaranteeCardTitle: {
    fontFamily: SYSTEM_FONT,
    fontSize: 17,
    fontWeight: "700",
    color: TEXT_DARK,
    marginBottom: 10,
    lineHeight: 24,
  },
  guaranteeDescription: {
    fontFamily: SYSTEM_FONT,
    fontSize: 15,
    fontWeight: "500",
    color: TEXT_GRAY,
    lineHeight: 24,
  },
  trustSeal: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 18,
    paddingVertical: 26,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.08)",
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
  sealText: {
    fontFamily: SYSTEM_FONT,
    fontSize: 12,
    fontWeight: "700",
    color: CTA_TEAL,
    letterSpacing: 0.6,
  },
  assuranceBox: {
    backgroundColor: "#fff9f5",
    padding: 22,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(245, 135, 66, 0.25)",
    marginTop: 28,
  },
  assuranceText: {
    fontFamily: SYSTEM_FONT,
    fontSize: 15,
    fontWeight: "500",
    color: TEXT_GRAY,
    textAlign: "center",
    lineHeight: 24,
  },
});