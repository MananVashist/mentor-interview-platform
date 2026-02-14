import React, { memo, useMemo, useRef, useState, lazy, Suspense } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform, useWindowDimensions, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Head from "expo-router/head";
import { Header } from "@/components/Header";
import { trackEvent } from "@/lib/analytics";

// Lazy Load Heavy Sections
const LazyTestimonials = lazy(() => import("./lazysectionslp").then(m => ({ default: m.TestimonialsSection })));
const LazyPricing = lazy(() => import("./lazysectionslp").then(m => ({ default: m.CandidateTiers })));
const LazyGuarantee = lazy(() => import("./lazysectionslp").then(m => ({ default: m.GuaranteeSection })));
const LazyFAQ = lazy(() => import("./lazysectionslp").then(m => ({ default: m.FAQ })));

const BRAND_ORANGE = "#f58742";
const CTA_TEAL = "#18a7a7";
const BG_CREAM = "#f8f5f0";
const TEXT_DARK = "#222";
const TEXT_GRAY = "#555";
const BORDER_LIGHT = "rgba(0,0,0,0.05)";
const SYSTEM_FONT = Platform.select({ web: "system-ui", ios: "System", android: "Roboto", default: "System" }) as string;

const VALID_ROLES = ["pm", "hr", "ds", "da"];
const ROLE_CONTENT: Record<string, { title: string; highlight: string; sub: string }> = {
  default: { title: "Mock Interviews", highlight: "with expert mentors", sub: "Get realistic feedback from industry experts. Anonymous & Unbiased." },
  pm: { title: "Product Management mock interviews", highlight: "with expert PMs", sub: "Test yourself on Product Strategy, Product Sense, Leadership, Execution or Technical PM skills against top hiring managers" },
  hr: { title: "HR mock interviews with ", highlight: "real HR leaders", sub: "Talent Acquisition, HRBP, COE, Generalist and Operations. Practice with veterans from the industry." },
  ds: { title: "Data Science mock interviews", highlight: "with real experts", sub: "ML Theory/Practical, Coding, Statistics and System Design. Practice with veterans from the industry" },
  da: { title: "Data Analytics mock interviews", highlight: "with domain experts", sub: "Case studies, SQL, Excel, Product Metrics and Behavioral. Practice with vetted mentors." },
};

const STEPS = [
  { emoji: "📝", title: "1. Browse mentors", desc: "Choose from a list of expert mentors in your domain and the topic you want to practice " },
  { emoji: "🎥", title: "2. The Session", desc: "1:1 Video Call. Completely anonymous. Recording will be provided." },
  { emoji: "📊", title: "3. The Feedback", desc: "Detailed written scorecard & actionable tips." },
];

const Button = ({ title, onPress, variant = "primary", color = CTA_TEAL, style, textStyle, nativeID }: any) => (
  <TouchableOpacity nativeID={nativeID} style={[styles.buttonBase, variant === "primary" && { backgroundColor: color }, variant === "primary" && styles.buttonShadow, variant === "outline" && styles.buttonOutline, variant === "outline" && { borderColor: color }, style]} onPress={onPress}>
    <Text style={[styles.buttonText, variant === "primary" && { color: "#fff" }, variant === "outline" && { color: TEXT_DARK }, textStyle]}>{title}</Text>
  </TouchableOpacity>
);

const TrustFooter = memo(({ isSmall }: { isSmall: boolean }) => (
  <View style={[styles.trustRow, isSmall && { flexDirection: "column", gap: 8, alignItems: "center" }]}>
    <Text style={styles.trustItem}>✓ Starts at ₹3,500</Text><Text style={styles.trustItem}>✓ 1:1 call</Text><Text style={styles.trustItem}>✓ Recording + scorecard</Text>
  </View>
));

const HowItWorks = memo(({ isSmall }: { isSmall: boolean }) => (
  <View style={styles.section}>
    <Text style={styles.kicker}>THE PROCESS</Text>
    <Text style={[styles.h2, isSmall && styles.h2Mobile]}>Simple.</Text>
    <View style={[styles.stepsGrid, isSmall && { gap: 16 }]}>{STEPS.map((s, i) => (<View key={i} style={styles.stepCard}><Text style={styles.stepEmoji}>{s.emoji}</Text><View style={{ flex: 1 }}><Text style={styles.stepTitle}>{s.title}</Text><Text style={styles.stepDesc}>{s.desc}</Text></View></View>))}</View>
  </View>
));

export default function CampaignLanding() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isSmall = width < 900;
  const scrollRef = useRef<ScrollView>(null);
  const [pricingY, setPricingY] = useState<number>(0);
  const params = useLocalSearchParams();
  const { role } = params;
  const activeRole = typeof role === "string" && VALID_ROLES.includes(role) ? role : "default";

  React.useEffect(() => { if (activeRole !== "default") trackEvent("lp_visit", { role: activeRole, page_title: ROLE_CONTENT[activeRole].title }); }, [activeRole]);

  const utm = useMemo(() => ({ source: typeof params.utm_source === "string" ? params.utm_source : "", campaign: typeof params.utm_campaign === "string" ? params.utm_campaign : "", content: typeof params.utm_content === "string" ? params.utm_content : "" }), [params]);
  const content = ROLE_CONTENT[activeRole];
  const CTA_LABEL: Record<string, string> = { pm: "Book a PM Mock Interview", da: "Book a Data Analytics Mock Interview", ds: "Book a Data Science Mock Interview", hr: "Book an HR Mock Interview", default: "Book Your Mock Interview" };

  const handleBookClick = (tier: string = "general") => { console.log("[Analytics] Interest Captured:", { role: activeRole, tier_intent: tier, source: utm.source }); router.push("/auth/sign-up"); };
  const handlePricingClick = () => { if (Platform.OS === "web") { document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth", block: "start" }); return; } scrollRef.current?.scrollTo({ y: pricingY, animated: true }); };

  return (
    <>
      <Head><title>{`CrackJobs | ${content.title} Interview Prep`}</title><meta name="description" content={`Practice ${content.title} interviews with real experts. ${content.sub}`} /><meta name="viewport" content="width=device-width, initial-scale=1" /><style>{`body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, sans-serif; background-color: ${BG_CREAM}; } * { box-sizing: border-box; }`}</style></Head>
      <ScrollView ref={scrollRef} style={styles.container} contentContainerStyle={{ minHeight: "100%" }}>
        <Header />
        <View style={styles.heroSection}>
          <View style={[styles.heroInner, isSmall && styles.heroInnerMobile]}>
            <Text style={[styles.h1, isSmall && styles.h1Mobile]}>{content.title}{"\n"}<Text style={{ color: CTA_TEAL }}>{content.highlight}</Text></Text>
            <Text style={[styles.sub, isSmall && styles.subMobile]}>{content.sub}</Text>
            <View style={[styles.ctaRow, isSmall && { flexDirection: "column" }]}>
              <Button nativeID="btn-lp-hero-cta" title={CTA_LABEL[activeRole] ?? CTA_LABEL.default} onPress={() => handleBookClick("hero_cta")} style={[styles.ctaBig, isSmall && { width: "100%" }]} textStyle={{ fontSize: 16 }} />
              <Button nativeID="btn-lp-hero-pricing" title="View pricing" variant="outline" color={CTA_TEAL} onPress={handlePricingClick} style={[styles.ctaBig, isSmall && { width: "100%" }]} />
            </View>
            <TrustFooter isSmall={isSmall} />
          </View>
        </View>
        <HowItWorks isSmall={isSmall} />
        <Suspense fallback={<View style={{ height: 200 }} />}><LazyTestimonials /><LazyPricing onPricingLayout={setPricingY} /><LazyGuarantee /><LazyFAQ isSmall={isSmall} /></Suspense>
        <View style={[styles.section, { paddingBottom: 60 }]}><Text style={styles.footerText}>© {new Date().getFullYear()} CrackJobs</Text></View>
      </ScrollView>
    </>
  );
}

export function generateStaticParams() {
  return VALID_ROLES.map((role) => ({ role }));
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG_CREAM },
  buttonBase: { borderRadius: 8, alignItems: "center", justifyContent: "center", paddingVertical: 14, paddingHorizontal: 28 },
  buttonShadow: { shadowOpacity: 0.2, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
  buttonOutline: { backgroundColor: "transparent", borderWidth: 2 },
  buttonText: { fontFamily: SYSTEM_FONT, fontSize: 15, fontWeight: "700" },
  heroSection: { maxWidth: 1000, width: "100%", alignSelf: "center", paddingHorizontal: 24, paddingTop: 20, paddingBottom: 30 },
  heroInner: { backgroundColor: "#fff", borderRadius: 24, padding: 40, paddingBottom: 48, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, borderWidth: 1, borderColor: BORDER_LIGHT, alignItems: "center" },
  heroInnerMobile: { padding: 24, paddingBottom: 32 },
  h1: { fontFamily: SYSTEM_FONT, fontWeight: "800", fontSize: 42, color: BRAND_ORANGE, lineHeight: 48, marginBottom: 12, textAlign: "center" },
  h1Mobile: { fontSize: 32, lineHeight: 38 },
  sub: { fontFamily: SYSTEM_FONT, fontSize: 17, color: TEXT_GRAY, lineHeight: 26, textAlign: "center", maxWidth: 600, marginBottom: 30 },
  subMobile: { fontSize: 16 },
  ctaRow: { flexDirection: "row", gap: 12, width: "100%", justifyContent: "center", marginBottom: 24, marginTop: 12 },
  ctaBig: { minWidth: 160 },
  trustRow: { flexDirection: "row", gap: 24, opacity: 0.8 },
  trustItem: { fontFamily: SYSTEM_FONT, fontSize: 13, fontWeight: "500", color: TEXT_GRAY },
  section: { maxWidth: 900, width: "100%", alignSelf: "center", paddingHorizontal: 24, paddingVertical: 40 },
  kicker: { fontFamily: SYSTEM_FONT, fontWeight: "800", fontSize: 12, color: CTA_TEAL, marginBottom: 10, textAlign: "center", letterSpacing: 1 },
  h2: { fontFamily: SYSTEM_FONT, fontWeight: "800", fontSize: 28, color: TEXT_DARK, marginBottom: 20, textAlign: "center" },
  h2Mobile: { fontSize: 24 },
  stepsGrid: { gap: 16 },
  stepCard: { flexDirection: "row", alignItems: "flex-start", backgroundColor: "#fff", padding: 20, borderRadius: 16, borderWidth: 1, borderColor: BORDER_LIGHT, gap: 16 },
  stepEmoji: { fontSize: 28 },
  stepTitle: { fontFamily: SYSTEM_FONT, fontWeight: "700", fontSize: 16, color: TEXT_DARK, marginBottom: 2 },
  stepDesc: { fontFamily: SYSTEM_FONT, fontWeight: "500", fontSize: 14, color: TEXT_GRAY },
  footerText: { textAlign: "center", fontFamily: SYSTEM_FONT, color: "#999", fontSize: 13 },
});