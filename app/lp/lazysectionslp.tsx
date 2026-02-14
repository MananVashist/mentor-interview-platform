import React, { memo } from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { BronzeBadge, SilverBadge, GoldBadge } from "@/components/AppIcons";

// --- Constants & Data (Preserved Exactly) ---
const CTA_TEAL = "#18a7a7";
const BG_CREAM = "#f8f5f0";
const TEXT_DARK = "#222";
const TEXT_GRAY = "#555";
const BORDER_LIGHT = "rgba(0,0,0,0.05)";
const SYSTEM_FONT = "System"; // Simplified for brevity, matches logic

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

export const TestimonialsSection = memo(() => (
  <View style={styles.testimonialsContainer} nativeID="testimonials">
    <Text style={styles.kicker}>SUCCESS STORIES</Text>
    <View style={styles.testimonialsGrid}>
      {TESTIMONIALS.map((t, i) => (
        <View key={i} style={styles.testimonialCard}>
          <View style={styles.testimonialHeader}>
            <View style={styles.avatarContainer}><Text style={styles.avatar}>{t.avatar}</Text></View>
            <View style={styles.testimonialMeta}><Text style={styles.testimonialName}>{t.name}</Text><Text style={styles.testimonialRole}>{t.role} at {t.company}</Text></View>
          </View>
          <View style={{ flexDirection: "row", gap: 3, marginBottom: 18 }}>{[...Array(t.rating)].map((_, j) => <Text key={j} style={{ fontSize: 15 }}>⭐</Text>)}</View>
          <Text style={styles.testimonialQuote}>"{t.quote}"</Text>
        </View>
      ))}
    </View>
    <View style={styles.trustIndicators}><Text style={styles.trustText}>✓ Verified testimonials</Text><Text style={styles.trustText}>✓ Real candidate outcomes</Text><Text style={styles.trustText}>✓ Proven results</Text></View>
  </View>
));

export const CandidateTiers = memo(({ onPricingLayout }: { onPricingLayout?: (y: number) => void }) => {
  const { width } = useWindowDimensions();
  const isSmall = width < 900;
  const TIERS = [
    { badge: <BronzeBadge />, title: "Bronze Tier", price: "₹3,500 - ₹6,000", color: "#cd7f32", bgColor: "#fff5e6", borderColor: "#cd7f32", benefits: ["Top performing mid-Level Managers", "5 - 10 yrs experienced", "Best for: Strengthening basics"] },
    { badge: <SilverBadge />, title: "Silver Tier", price: "₹6,000 - ₹10,000", color: "#706F6D", bgColor: "#f5f5f5", borderColor: "#c0c0c0", benefits: ["Senior Management from top companies", "10-15 yrs experienced", "Best for: Senior level interviews"] },
    { badge: <GoldBadge />, title: "Gold Tier", price: "₹10,000 - ₹15,000", color: "#B8860B", bgColor: "#fffbeb", borderColor: "#fbbf24", benefits: ["Leadership / Directors", "15-20 yrs experienced", "Best for: Hiring manager or CXO rounds"] },
  ];
  return (
    <View style={styles.section} nativeID="pricing" onLayout={(e) => onPricingLayout?.(e.nativeEvent.layout.y)}>
      <Text style={styles.kicker}>PRICING</Text>
      <Text style={[styles.h2, isSmall && styles.h2Mobile]}>Choose Your Mentor Tier</Text>
      <View style={[styles.tiersGrid, isSmall && styles.tiersGridMobile]}>
        {TIERS.map((tier, i) => (
          <View key={i} style={[styles.tierCard, { backgroundColor: tier.bgColor, borderColor: tier.borderColor }]}>
            <View style={{ marginBottom: 16 }}>{tier.badge}</View>
            <Text style={[styles.tierTitle, { color: tier.color }]}>{tier.title}</Text>
            <Text style={[styles.tierTitle, { fontSize: 24, marginBottom: 24, color: tier.color }]}>{tier.price}</Text>
            <View style={{ gap: 8, alignSelf: "stretch" }}>{tier.benefits.map((b, j) => <View key={j} style={{ flexDirection: "row", gap: 8 }}><Text style={{ fontWeight: "700", color: tier.color }}>✓</Text><Text style={{ fontSize: 15, color: TEXT_DARK, flex: 1 }}>{b}</Text></View>)}</View>
          </View>
        ))}
      </View>
    </View>
  );
});

export const GuaranteeSection = memo(() => (
  <View style={styles.guaranteeContainer} nativeID="guarantee">
    <View style={styles.guaranteeBox}>
      <View style={{ alignItems: "center", marginBottom: 28 }}><View style={styles.guaranteeBadge}><Text style={{ fontSize: 18 }}>🛡️</Text><Text style={{ fontSize: 13, fontWeight: "800", color: CTA_TEAL, letterSpacing: 1.2 }}>RISK-FREE GUARANTEE</Text></View></View>
      <Text style={styles.guaranteeTitle}>Practice with complete <Text style={{ color: CTA_TEAL }}>confidence</Text></Text>
      <Text style={styles.guaranteeSubtitle}>Your investment is protected. We've got your back every step of the way.</Text>
      <View style={styles.guaranteesGrid}>{GUARANTEES.map((g, i) => (<View key={i} style={styles.guaranteeCard}><Text style={{ fontSize: 36, marginBottom: 14 }}>{g.icon}</Text><Text style={{ fontSize: 17, fontWeight: "700", color: TEXT_DARK, marginBottom: 10 }}>{g.title}</Text><Text style={{ fontSize: 15, color: TEXT_GRAY }}>{g.description}</Text></View>))}</View>
      <View style={styles.trustSeal}>{["SECURE PAYMENTS", "VERIFIED MENTORS", "INSTANT REFUNDS"].map((t, i) => <View key={i} style={styles.sealBadge}><Text style={{ fontSize: 12, fontWeight: "700", color: CTA_TEAL }}>✓ {t}</Text></View>)}</View>
      <View style={styles.assuranceBox}><Text style={{ fontSize: 15, color: TEXT_GRAY, textAlign: "center" }}><Text style={{ fontWeight: "800", color: TEXT_DARK }}>Still unsure?</Text> Our support team is available 24/7 to answer any questions. Email us at crackjobshelpdesk@gmail.com</Text></View>
    </View>
  </View>
));

export const FAQ = memo(({ isSmall }: { isSmall: boolean }) => (
  <View style={styles.section}>
    <Text style={styles.kicker}>FAQ</Text>
    <Text style={[styles.h2, isSmall && styles.h2Mobile]}>Common Questions</Text>
    <View style={{ gap: 12 }}>{FAQS.map((f, i) => <View key={i} style={styles.faqItem}><Text style={{ fontWeight: "700", fontSize: 16, color: TEXT_DARK, marginBottom: 6 }}>{f.q}</Text><Text style={{ fontSize: 14, color: TEXT_GRAY, lineHeight: 22 }}>{f.a}</Text></View>)}</View>
  </View>
));

const styles = StyleSheet.create({
  section: { maxWidth: 900, width: "100%", alignSelf: "center", paddingHorizontal: 24, paddingVertical: 40 },
  kicker: { fontFamily: SYSTEM_FONT, fontWeight: "800", fontSize: 12, color: CTA_TEAL, marginBottom: 10, textAlign: "center", letterSpacing: 1 },
  h2: { fontFamily: SYSTEM_FONT, fontWeight: "800", fontSize: 28, color: TEXT_DARK, marginBottom: 20, textAlign: "center" },
  h2Mobile: { fontSize: 24 },
  tiersGrid: { flexDirection: "row", gap: 24, justifyContent: "center" },
  tiersGridMobile: { flexDirection: "column", alignItems: "center", gap: 20 },
  tierCard: { flex: 1, maxWidth: 360, padding: 28, borderRadius: 16, borderWidth: 2, alignItems: "center" },
  tierTitle: { fontFamily: SYSTEM_FONT, fontWeight: "700", fontSize: 20, marginBottom: 4, textAlign: "center" },
  testimonialsContainer: { paddingTop: 60, paddingBottom: 80, paddingHorizontal: 24, backgroundColor: BG_CREAM },
  testimonialsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 24, justifyContent: "center", maxWidth: 1200, alignSelf: "center" },
  testimonialCard: { backgroundColor: "#fff", padding: 32, borderRadius: 16, borderWidth: 1, borderColor: "rgba(0,0,0,0.08)", width: "calc(50% - 12px)", minWidth: 280, maxWidth: 550 },
  testimonialHeader: { flexDirection: "row", alignItems: "center", marginBottom: 18, gap: 14 },
  avatarContainer: { width: 52, height: 52, borderRadius: 26, backgroundColor: BG_CREAM, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: BORDER_LIGHT },
  avatar: { fontSize: 26 },
  testimonialMeta: { flex: 1 },
  testimonialName: { fontSize: 17, fontWeight: "700", color: TEXT_DARK, marginBottom: 3 },
  testimonialRole: { fontSize: 14, fontWeight: "600", color: TEXT_GRAY },
  testimonialQuote: { fontFamily: SYSTEM_FONT, fontSize: 15, lineHeight: 25, color: TEXT_DARK, marginBottom: 18 },
  trustIndicators: { flexDirection: "row", justifyContent: "center", gap: 32, marginTop: 48, flexWrap: "wrap" },
  trustText: { fontSize: 13, fontWeight: "600", color: TEXT_GRAY, opacity: 0.8 },
  guaranteeContainer: { paddingTop: 40, paddingBottom: 80, paddingHorizontal: 24, backgroundColor: BG_CREAM },
  guaranteeBox: { backgroundColor: "#fff", padding: 56, borderRadius: 20, maxWidth: 1100, alignSelf: "center", width: "100%", borderWidth: 2, borderColor: "rgba(24, 167, 167, 0.3)" },
  guaranteeBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "#e8f9f9", paddingVertical: 11, paddingHorizontal: 22, borderRadius: 100, gap: 10, borderWidth: 1, borderColor: "rgba(24, 167, 167, 0.2)" },
  guaranteeTitle: { fontSize: 38, fontWeight: "800", color: TEXT_DARK, textAlign: "center", lineHeight: 50, marginBottom: 18 },
  guaranteeSubtitle: { fontSize: 18, fontWeight: "500", color: TEXT_GRAY, textAlign: "center", marginBottom: 52, maxWidth: 600, alignSelf: "center" },
  guaranteesGrid: { flexDirection: "row", flexWrap: "wrap", gap: 24, marginBottom: 44, justifyContent: "center" },
  guaranteeCard: { backgroundColor: BG_CREAM, padding: 28, borderRadius: 16, width: "calc(50% - 12px)", minWidth: 240, maxWidth: 500, borderWidth: 1, borderColor: BORDER_LIGHT },
  trustSeal: { flexDirection: "row", justifyContent: "center", gap: 18, paddingVertical: 26, borderTopWidth: 1, borderTopColor: BORDER_LIGHT, flexWrap: "wrap" },
  sealBadge: { backgroundColor: "#e8f9f9", paddingVertical: 9, paddingHorizontal: 18, borderRadius: 8, borderWidth: 1, borderColor: "rgba(24, 167, 167, 0.15)" },
  assuranceBox: { backgroundColor: "#fff9f5", padding: 22, borderRadius: 12, borderWidth: 1, borderColor: "rgba(245, 135, 66, 0.25)", marginTop: 28 },
  faqItem: { backgroundColor: "#fff", padding: 20, borderRadius: 12, borderWidth: 1, borderColor: BORDER_LIGHT },
});