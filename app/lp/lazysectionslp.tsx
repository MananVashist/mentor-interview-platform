import React, { memo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { useRouter } from "expo-router";
import { BronzeBadge, SilverBadge, GoldBadge } from "@/components/AppIcons";

// --- Constants & Data ---
const CTA_TEAL = "#18a7a7";
const BRAND_ORANGE = "#f58742";
const BG_CREAM = "#f8f5f0";
const TEXT_DARK = "#222";
const TEXT_GRAY = "#555";
const BORDER_LIGHT = "rgba(0,0,0,0.05)";
const SYSTEM_FONT = Platform.select({
  web: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
  ios: "System",
  android: "Roboto",
  default: "System",
}) as string;

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

const TIERS = [
  {
    badge: BronzeBadge,
    title: "Bronze Tier",
    price: "₹500 - ₹2,000",
    color: "#cd7f32",
    bgColor: "#fff5e6",
    borderColor: "#cd7f32",
    benefits: ["Top performing mid-Level Managers", "5 - 10 yrs experienced", "Best for: Strengthening basics"],
  },
  {
    badge: SilverBadge,
    title: "Silver Tier",
    price: "₹2,000 - ₹4,500",
    color: "#706F6D",
    bgColor: "#f5f5f5",
    borderColor: "#c0c0c0",
    benefits: ["Senior Management from top companies", "10-15 yrs experienced", "Best for: Senior level interviews"],
  },
  {
    badge: GoldBadge,
    title: "Gold Tier",
    price: "₹5,000 - ₹7,500",
    color: "#B8860B",
    bgColor: "#fffbeb",
    borderColor: "#fbbf24",
    benefits: ["Leadership / Directors", "15-20 yrs experienced", "Best for: Hiring manager or CXO rounds"],
  },
];

// --- Shared Button ---
const Button = memo(({ title, onPress, variant = "primary", nativeID, style, textStyle }: any) => (
  <TouchableOpacity
    nativeID={nativeID}
    style={[
      styles.buttonBase,
      variant === "primary" && styles.buttonPrimary,
      variant === "outline" && styles.buttonOutline,
      style,
    ]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Text
      style={[
        styles.buttonText,
        variant === "primary" && { color: "#fff" },
        variant === "outline" && { color: CTA_TEAL },
        textStyle,
      ]}
    >
      {title}
    </Text>
  </TouchableOpacity>
));

// --- Optimized Star Rating Component ---
const StarRating = memo(({ count }: { count: number }) => (
  <View style={{ flexDirection: "row", gap: 3, marginBottom: 18 }}>
    {Array.from({ length: count }, (_, i) => (
      <Text key={i} style={{ fontSize: 15 }}>⭐</Text>
    ))}
  </View>
));

// --- Optimized Testimonial Card ---
const TestimonialCard = memo(({ testimonial }: { testimonial: typeof TESTIMONIALS[0] }) => (
  <View style={styles.testimonialCard}>
    <View style={styles.testimonialHeader}>
      <View style={styles.avatarContainer}>
        <Text style={styles.avatar}>{testimonial.avatar}</Text>
      </View>
      <View style={styles.testimonialMeta}>
        <Text style={styles.testimonialName}>{testimonial.name}</Text>
        <Text style={styles.testimonialRole}>{testimonial.role} at {testimonial.company}</Text>
      </View>
    </View>
    <StarRating count={testimonial.rating} />
    <Text style={styles.testimonialQuote}>"{testimonial.quote}"</Text>
  </View>
));

// --- Testimonials Section ---
const TestimonialsSection = memo(({ onViewMentors }: { onViewMentors: (source: string) => void }) => (
  <View style={styles.testimonialsContainer} nativeID="testimonials">
    <Text style={styles.kicker}>SUCCESS STORIES</Text>
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

    {/* CTA strip after testimonials */}
    <View style={styles.ctaStrip}>  
      <Text style={styles.ctaStripHeading}>Ready to improve your interviewing skills?</Text>
      <Button
        nativeID="btn-lp-testimonials-view-mentors"
        title="View Our Mentors →"
        onPress={() => onViewMentors("after_testimonials")}
        style={styles.ctaStripButton}
        textStyle={{ fontSize: 16 }}
      />
    </View>
  </View>
));

// --- Optimized Tier Card ---
const TierCard = memo(({ tier, index }: { tier: typeof TIERS[0]; index: number }) => {
  const BadgeComponent = tier.badge;
  return (
    <View
      key={index}
      style={[styles.tierCard, { backgroundColor: tier.bgColor, borderColor: tier.borderColor }]}
    >
      <View style={{ marginBottom: 16 }}>
        <BadgeComponent />
      </View>
      <Text style={[styles.tierTitle, { color: tier.color }]}>{tier.title}</Text>
      <Text style={[styles.tierTitle, { fontSize: 24, marginBottom: 24, color: tier.color }]}>
        {tier.price}
      </Text>
      <View style={{ gap: 8, alignSelf: "stretch" }}>
        {tier.benefits.map((b, j) => (
          <View key={j} style={{ flexDirection: "row", gap: 8 }}>
            <Text style={{ fontWeight: "700", color: tier.color }}>✓</Text>
            <Text style={{ fontSize: 15, color: TEXT_DARK, flex: 1 }}>{b}</Text>
          </View>
        ))}
      </View>
    </View>
  );
});

// --- Pricing Section ---
const CandidateTiers = memo(({
  onPricingLayout,
  isSmall,
  onViewMentors,
}: {
  onPricingLayout?: (y: number) => void;
  isSmall: boolean;
  onViewMentors: (source: string) => void;
}) => {
  return (
    <View
      style={styles.section}
      nativeID="pricing"
      onLayout={(e) => onPricingLayout?.(e.nativeEvent.layout.y)}
    >
      <Text style={styles.kicker}>PRICING</Text>
      <Text style={[styles.h2, isSmall && styles.h2Mobile]}>Choose Your Mentor Tier</Text>
      <View style={[styles.tiersGrid, isSmall && styles.tiersGridMobile]}>
        {TIERS.map((tier, i) => (
          <TierCard key={i} tier={tier} index={i} />
        ))}
      </View>

      {/* CTA below pricing tiers */}
      <View style={styles.pricingCta}>
        <Text style={styles.pricingCtaText}>Browse mentors across all tiers and find your perfect match</Text>
        <Button
          nativeID="btn-lp-pricing-view-mentors"
          title="View Our Mentors"
          onPress={() => onViewMentors("after_pricing")}
          style={styles.pricingCtaButton}
          textStyle={{ fontSize: 15 }}
        />
      </View>
    </View>
  );
});

// --- Not Sure Yet Section ---
const NotSureYet = memo(({ onViewMentors }: { onViewMentors: (source: string) => void }) => (
  <View style={styles.notSureContainer}>
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

// --- Optimized Guarantee Card ---
const GuaranteeCard = memo(({ guarantee }: { guarantee: typeof GUARANTEES[0] }) => (
  <View style={styles.guaranteeCard}>
    <Text style={{ fontSize: 36, marginBottom: 14 }}>{guarantee.icon}</Text>
    <Text style={{ fontSize: 17, fontWeight: "700", color: TEXT_DARK, marginBottom: 10 }}>
      {guarantee.title}
    </Text>
    <Text style={{ fontSize: 15, color: TEXT_GRAY }}>{guarantee.description}</Text>
  </View>
));

// --- Guarantee Section ---
const GuaranteeSection = memo(() => (
  <View style={styles.guaranteeContainer} nativeID="guarantee">
    <View style={styles.guaranteeBox}>
      <View style={{ alignItems: "center", marginBottom: 28 }}>
        <View style={styles.guaranteeBadge}>
          <Text style={{ fontSize: 18 }}>🛡️</Text>
          <Text style={{ fontSize: 13, fontWeight: "800", color: CTA_TEAL, letterSpacing: 1.2 }}>
            RISK-FREE GUARANTEE
          </Text>
        </View>
      </View>
      <Text style={styles.guaranteeTitle}>
        Practice with complete <Text style={{ color: CTA_TEAL }}>confidence</Text>
      </Text>
      <Text style={styles.guaranteeSubtitle}>
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
            <Text style={{ fontSize: 12, fontWeight: "700", color: CTA_TEAL }}>✓ {t}</Text>
          </View>
        ))}
      </View>
      <View style={styles.assuranceBox}>
        <Text style={{ fontSize: 15, color: TEXT_GRAY, textAlign: "center" }}>
          <Text style={{ fontWeight: "800", color: TEXT_DARK }}>Still unsure?</Text> Our support team is available 24/7 to answer any questions. Email us at crackjobshelpdesk@gmail.com
        </Text>
      </View>
    </View>
  </View>
));

// --- Optimized FAQ Item ---
const FAQItem = memo(({ faq }: { faq: typeof FAQS[0] }) => (
  <View style={styles.faqItem}>
    <Text style={{ fontWeight: "700", fontSize: 16, color: TEXT_DARK, marginBottom: 6 }}>
      {faq.q}
    </Text>
    <Text style={{ fontSize: 14, color: TEXT_GRAY, lineHeight: 22 }}>
      {faq.a}
    </Text>
  </View>
));

// --- FAQ Section ---
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

// --- Final CTA Banner (closing section before footer) ---
const FinalCTABanner = memo(({ onViewMentors }: { onViewMentors: (source: string) => void }) => (
  <View style={styles.finalCtaContainer}>
    <View style={styles.finalCtaBox}>
      <Text style={styles.finalCtaHeading}>
        Your next interview is closer than you think{"\n"}
      </Text>
      <Text style={styles.finalCtaSub}>
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

// --- SINGLE DEFAULT EXPORT (Wrapper Component for Lazy Loading) ---
export default function LazySectionsLP({
  onPricingLayout,
  isSmall,
  onViewMentors,
}: {
  onPricingLayout?: (y: number) => void;
  isSmall: boolean;
  onViewMentors: (source: string) => void;
}) {
  return (
    <>
      <TestimonialsSection onViewMentors={onViewMentors} />
      <CandidateTiers onPricingLayout={onPricingLayout} isSmall={isSmall} onViewMentors={onViewMentors} />
      <NotSureYet onViewMentors={onViewMentors} />
      <GuaranteeSection />
      <FAQ isSmall={isSmall} />
      <FinalCTABanner onViewMentors={onViewMentors} />
    </>
  );
}

const styles = StyleSheet.create({
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

  // ===== Tiers =====
  tiersGrid: {
    flexDirection: "row",
    gap: 24,
    justifyContent: "center",
  },
  tiersGridMobile: {
    flexDirection: "column",
    alignItems: "center",
    gap: 20,
  },
  tierCard: {
    flex: 1,
    maxWidth: 360,
    padding: 28,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: "center",
  },
  tierTitle: {
    fontFamily: SYSTEM_FONT,
    fontWeight: "700",
    fontSize: 20,
    marginBottom: 4,
    textAlign: "center",
  },

  // ===== Pricing CTA =====
  pricingCta: {
    marginTop: 32,
    alignItems: "center",
    gap: 14,
  },
  pricingCtaText: {
    fontFamily: SYSTEM_FONT,
    fontSize: 15,
    color: TEXT_GRAY,
    textAlign: "center",
    maxWidth: 420,
  },
  pricingCtaButton: {
    minWidth: 200,
  },

  // ===== Testimonials =====
  testimonialsContainer: {
    paddingTop: 60,
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
  avatar: {
    fontSize: 26,
  },
  testimonialMeta: {
    flex: 1,
  },
  testimonialName: {
    fontSize: 17,
    fontWeight: "700",
    color: TEXT_DARK,
    marginBottom: 3,
  },
  testimonialRole: {
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
    fontSize: 13,
    fontWeight: "600",
    color: TEXT_GRAY,
    opacity: 0.8,
  },

  // ===== CTA Strip (after testimonials) =====
  ctaStrip: {
    marginTop: 48,
    alignItems: "center",
    gap: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 32,
    paddingHorizontal: 24,
    maxWidth: 600,
    alignSelf: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(24,167,167,0.2)",
  },
  ctaStripHeading: {
    fontFamily: SYSTEM_FONT,
    fontWeight: "700",
    fontSize: 20,
    color: TEXT_DARK,
    textAlign: "center",
  },
  ctaStripButton: {
    minWidth: 220,
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
    fontSize: 40,
  },
  notSureKicker: {
    fontFamily: SYSTEM_FONT,
    fontWeight: "800",
    fontSize: 12,
    color: BRAND_ORANGE,
    letterSpacing: 1.2,
    marginBottom: 12,
    textAlign: "center",
  },
  notSureHeading: {
    fontFamily: SYSTEM_FONT,
    fontWeight: "800",
    fontSize: 30,
    color: TEXT_DARK,
    textAlign: "center",
    lineHeight: 40,
    marginBottom: 16,
  },
  notSureSub: {
    fontFamily: SYSTEM_FONT,
    fontSize: 16,
    color: TEXT_GRAY,
    textAlign: "center",
    lineHeight: 26,
    maxWidth: 560,
    marginBottom: 32,
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
  guaranteeTitle: {
    fontSize: 38,
    fontWeight: "800",
    color: TEXT_DARK,
    textAlign: "center",
    lineHeight: 50,
    marginBottom: 18,
  },
  guaranteeSubtitle: {
    fontSize: 18,
    fontWeight: "500",
    color: TEXT_GRAY,
    textAlign: "center",
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
  assuranceBox: {
    backgroundColor: "#fff9f5",
    padding: 22,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(245, 135, 66, 0.25)",
    marginTop: 28,
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
  finalCtaHeading: {
    fontFamily: SYSTEM_FONT,
    fontWeight: "800",
    fontSize: 34,
    color: "#fff",
    textAlign: "center",
    lineHeight: 44,
    marginBottom: 16,
  },
  finalCtaSub: {
    fontFamily: SYSTEM_FONT,
    fontSize: 17,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    marginBottom: 32,
    maxWidth: 480,
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