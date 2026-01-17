// app/lp/index.tsx
import React, { memo, useMemo, useState } from "react";
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

import { BrandHeader } from "@/lib/BrandHeader";

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

// --- Dynamic Content ---
const ROLE_CONTENT = {
  default: { 
    title: "Mock Interviews", 
    sub: "Get realistic feedback from industry experts. Anonymous & Unbiased." 
  },
  pm: { 
    title: "Product Management", 
    sub: "System Design, Product Sense & Execution. Practice with veteran PMs." 
  },
  hr: { 
    title: "HR", 
    sub: "From Talent Acquisition to HRBP, nail your HR technical and generalist rounds." 
  },
  ds: { 
    title: "Data Science", 
    sub: "ML Theory and Practical, Coding (Python, algo), stats and System design. Get interviewed by experts." 
  },
  da: { 
    title: "Data Analyst", 
    sub: "Case studies, SQL, Excel, Product metrics and behavioral. Vetted mentors from top tech companies." 
  },
};

const STEPS = [
  { emoji: "📝", title: "1. Pick a Role", desc: "PM, Data Science, Analyst or HR." },
  { emoji: "🎥", title: "2. The Session", desc: "1:1 Video Call. We provide the full recording." },
  { emoji: "📊", title: "3. The Feedback", desc: "Detailed written scorecard & actionable tips." },
];

const FAQS = [
  {
    q: "Do I get a recording?",
    a: "Yes. Every session is recorded so you can re-watch your performance and catch mistakes.",
  },
  {
    q: "What is the detailed feedback?",
    a: "You don't just get a 'pass/fail'. You get a structured scorecard breaking down your weak spots.",
  },
];

// --- Sub-Components ---

const Button = ({
  title,
  onPress,
  variant = "primary",
  color = CTA_TEAL,
  style,
  textStyle,
}: {
  title: string;
  onPress: () => void;
  variant?: "primary" | "outline";
  color?: string;
  style?: any;
  textStyle?: any;
}) => (
  <TouchableOpacity
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

const TrustFooter = memo(({ isSmall }: { isSmall: boolean }) => (
  <View style={[styles.trustRow, isSmall && { flexDirection: "column", gap: 8 }]}>
    <Text style={styles.trustItem}>✅ Verified Experts</Text>
    <Text style={styles.trustItem}>📹 Session Recording</Text>
    <Text style={styles.trustItem}>📝 Detailed Scorecard</Text>
  </View>
));

// --- Pricing Component (Bronze / Silver / Gold) ---
const PricingCards = memo(({ isSmall, onBook }: { isSmall: boolean, onBook: (tier: string) => void }) => (
  <View style={styles.section}>
    <Text style={styles.kicker}>MARKETPLACE RATES</Text>
    <Text style={[styles.h2, { marginBottom: 8 }]}>Find Your Range</Text>
    <Text style={[styles.sub, { marginBottom: 32, fontSize: 15, maxWidth: 500 }]}>
      Mentors set their own prices based on experience.
    </Text>
    
    <View style={[styles.pricingGrid, isSmall && styles.pricingGridMobile]}>
      {/* BRONZE */}
      <View style={[styles.priceCard, { backgroundColor: BG_BRONZE, borderColor: COLOR_BRONZE }]}>
        <Text style={[styles.priceTier, { color: COLOR_BRONZE }]}>BRONZE</Text>
        <Text style={styles.priceAmount}>₹3k - ₹6k</Text>
        <Text style={styles.perSession}>per session</Text>
        <View style={[styles.divider, { backgroundColor: COLOR_BRONZE, opacity: 0.2 }]} />
        <Text style={styles.priceDesc}>• Mid-Level Managers</Text>
        <Text style={styles.priceDesc}>• less than 10 yrs experienced</Text>
        <Text style={styles.priceDesc}>• Best for: Entry level experience</Text>
        <Button 
          title="Browse Bronze" 
          onPress={() => onBook('bronze')} 
          variant="outline" 
          color={COLOR_BRONZE}
          style={{ marginTop: 24, width: '100%' }} 
        />
      </View>

      {/* SILVER */}
      <View style={[styles.priceCard, { backgroundColor: BG_SILVER, borderColor: COLOR_SILVER }]}>
        <Text style={[styles.priceTier, { color: COLOR_SILVER }]}>SILVER</Text>
        <Text style={styles.priceAmount}>₹6k - 9k</Text>
        <Text style={styles.perSession}>per session</Text>
        <View style={[styles.divider, { backgroundColor: COLOR_SILVER, opacity: 0.2 }]} />
        <Text style={styles.priceDesc}>• Senior Management</Text>
        <Text style={styles.priceDesc}>• 10-15 yrs experience</Text>
        <Text style={styles.priceDesc}>• Best for: Mid level experience </Text>
        <Button 
          title="Browse Silver" 
          onPress={() => onBook('silver')} 
          variant="outline"
          color={COLOR_SILVER} 
          style={{ marginTop: 24, width: '100%' }} 
        />
      </View>

      {/* GOLD */}
      <View style={[styles.priceCard, { backgroundColor: BG_GOLD, borderColor: COLOR_GOLD }]}>
        <Text style={[styles.priceTier, { color: COLOR_GOLD }]}>GOLD</Text>
        <Text style={styles.priceAmount}>₹9k - ₹15k</Text>
        <Text style={styles.perSession}>per session</Text>
        <View style={[styles.divider, { backgroundColor: COLOR_GOLD, opacity: 0.2 }]} />
        <Text style={styles.priceDesc}>• Leadership / Directors</Text>
        <Text style={styles.priceDesc}>• Hiring Managers</Text>
        <Text style={styles.priceDesc}>• Best for: Senior level experience</Text>
        <Button 
          title="Browse Gold" 
          onPress={() => onBook('gold')} 
          variant="outline" 
          color={COLOR_GOLD}
          style={{ marginTop: 24, width: '100%' }} 
        />
      </View>
    </View>
  </View>
));

const HowItWorks = memo(({ isSmall }: { isSmall: boolean }) => (
  <View style={styles.section}>
    <Text style={styles.kicker}>THE PROCESS</Text>
    <Text style={[styles.h2, isSmall && styles.h2Mobile]}>Simple.</Text>

    <View style={[styles.stepsGrid, isSmall && styles.stepsGridMobile]}>
      {STEPS.map((s, i) => (
        <View key={i} style={styles.stepCard}>
          <Text style={styles.stepEmoji}>{s.emoji}</Text>
          <View>
            <Text style={styles.stepTitle}>{s.title}</Text>
            <Text style={styles.stepDesc}>{s.desc}</Text>
          </View>
        </View>
      ))}
    </View>
  </View>
));

const FAQ = memo(({ isSmall }: { isSmall: boolean }) => (
  <View style={styles.section}>
    <Text style={styles.kicker}>FAQ</Text>
    <Text style={[styles.h2, isSmall && styles.h2Mobile]}>Common Questions</Text>
    <View style={styles.faqWrap}>
      {FAQS.map((f) => (
        <View key={f.q} style={styles.faqItem}>
          <Text style={styles.faqQ}>{f.q}</Text>
          <Text style={styles.faqA}>{f.a}</Text>
        </View>
      ))}
    </View>
  </View>
));

// --- Main Page ---

export default function CampaignLanding() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isSmall = width < 900;
  const params = useLocalSearchParams();

  // Capture UTM
  const utm = useMemo(() => {
    return {
      source: typeof params.utm_source === "string" ? params.utm_source : "",
      campaign: typeof params.utm_campaign === "string" ? params.utm_campaign : "",
      content: typeof params.utm_content === "string" ? params.utm_content : "",
    };
  }, [params]);

  const [selectedRole, setSelectedRole] = useState<"pm" | "da" | "hr" | "ds" | null>(null);

  // Dynamic Content Logic
  const content = selectedRole ? ROLE_CONTENT[selectedRole] : ROLE_CONTENT.default;

  const handleBookClick = (tier: string = "general") => {
    // 1. TRACK EVENT (Validation Metric)
    console.log("[Analytics] Interest Captured:", {
      role: selectedRole || "general",
      tier_intent: tier,
      source: utm.source
    });

    // 2. ROUTE
    router.push("/auth/sign-up");
  };

  const renderChip = (id: "pm" | "hr" | "ds" | "da", label: string) => (
    <TouchableOpacity
      onPress={() => setSelectedRole(id)}
      style={[styles.chip, selectedRole === id && styles.chipActive]}
      activeOpacity={0.8}
    >
      <Text style={[styles.chipText, selectedRole === id && styles.chipTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <>
      <Head>
        <title>CrackJobs | Anonymous Mock Interviews</title>
        <meta name="description" content="Anonymous mock interviews with vetted mentors." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, sans-serif; background-color: ${BG_CREAM}; } * { box-sizing: border-box; }`}</style>
      </Head>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerInner}>
            <BrandHeader style={{ marginBottom: 0 }} small={isSmall} />
            <TouchableOpacity onPress={() => router.push("/auth/sign-in")}>
              <Text style={styles.navLinkText}>Log in</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* HERO SECTION */}
        <View style={styles.heroSection}>
          <View style={[styles.heroInner, isSmall && styles.heroInnerMobile]}>
            
            <View style={styles.badge}>
              <Text style={styles.badgeText}>PRACTICE → PERFECT</Text>
            </View>

            <Text style={[styles.h1, isSmall && styles.h1Mobile]}>
              {content.title}{"\n"}
              <Text style={{ color: CTA_TEAL }}>Without the Fear</Text>
            </Text>

            <Text style={[styles.sub, isSmall && styles.subMobile]}>
              {content.sub}
            </Text>

            {/* Chip Selector */}
            <View style={styles.chipContainer}>
              <Text style={styles.labelTiny}>I AM PRACTICING FOR:</Text>
              <View style={styles.chipRow}>
                {renderChip("pm", "Product Management")}
                {renderChip("da", "Data Analyst")}
                {renderChip("ds", "Data Science")}
                {renderChip("hr", "HR / Recruiter")}
              </View>
            </View>

            {/* CTAs */}
            <View style={[styles.ctaRow, isSmall && { flexDirection: "column" }]}>
              <Button
                title="View Mentor Rates"
                onPress={() => handleBookClick("hero_cta")}
                style={[styles.ctaBig, isSmall && { width: "100%" }]}
                textStyle={{ fontSize: 16 }}
              />
              <Button
                title="How it Works"
                variant="outline"
                onPress={() => {}}
                style={[styles.ctaBig, isSmall && { width: "100%" }]}
                textStyle={{ fontSize: 16 }}
              />
            </View>

            <TrustFooter isSmall={isSmall} />
          </View>
        </View>

        {/* PRICING (The Category Test) */}
        <PricingCards isSmall={isSmall} onBook={handleBookClick} />

        <HowItWorks isSmall={isSmall} />
        <FAQ isSmall={isSmall} />

        <View style={[styles.section, { paddingBottom: 60 }]}>
          <Text style={styles.footerText}>© {new Date().getFullYear()} CrackJobs</Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG_CREAM },
  scrollContent: { minHeight: "100%" },

  // --- Buttons ---
  buttonBase: {
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 28,
  },
  buttonShadow: { shadowOpacity: 0.2, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
  buttonOutline: { backgroundColor: "transparent", borderWidth: 2 },
  buttonText: { fontFamily: SYSTEM_FONT, fontSize: 15, fontWeight: "700" },

  // --- Header ---
  header: { backgroundColor: BG_CREAM, paddingVertical: 16 },
  headerInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    maxWidth: 1000,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 24,
  },
  navLinkText: { fontFamily: SYSTEM_FONT, fontWeight: "600", color: TEXT_DARK },

  // --- Hero ---
  heroSection: { maxWidth: 1000, width: "100%", alignSelf: "center", paddingHorizontal: 24, paddingTop: 20, paddingBottom: 30 },
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
  heroInnerMobile: { padding: 24, paddingBottom: 32 },

  badge: {
    backgroundColor: "#f0fdfd",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 20,
  },
  badgeText: { color: CTA_TEAL, fontWeight: "800", fontSize: 11, fontFamily: SYSTEM_FONT, letterSpacing: 0.5 },

  h1: { fontFamily: SYSTEM_FONT, fontWeight: "800", fontSize: 42, color: BRAND_ORANGE, lineHeight: 48, marginBottom: 12, textAlign: "center" },
  h1Mobile: { fontSize: 32, lineHeight: 38 },

  sub: { fontFamily: SYSTEM_FONT, fontSize: 17, color: TEXT_GRAY, lineHeight: 26, textAlign: "center", maxWidth: 600, marginBottom: 30 },
  subMobile: { fontSize: 16 },

  // --- Chip Selector ---
  chipContainer: { width: "100%", alignItems: "center", marginBottom: 32 },
  labelTiny: { fontFamily: SYSTEM_FONT, fontSize: 11, fontWeight: "700", color: "#999", marginBottom: 12, letterSpacing: 1 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, justifyContent: "center" },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 100,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "rgba(0,0,0,0.1)",
  },
  chipActive: {
    backgroundColor: "#e6fffa",
    borderColor: CTA_TEAL,
  },
  chipText: { fontFamily: SYSTEM_FONT, fontSize: 14, fontWeight: "600", color: TEXT_GRAY },
  chipTextActive: { color: CTA_TEAL, fontWeight: "700" },

  ctaRow: { flexDirection: "row", gap: 12, width: "100%", justifyContent: "center", marginBottom: 24 },
  ctaBig: { minWidth: 160 },

  // --- Pricing Grid ---
  pricingGrid: { flexDirection: 'row', gap: 16, justifyContent: 'center', width: '100%' },
  pricingGridMobile: { flexDirection: 'column' },
  priceCard: { 
    flex: 1, 
    padding: 24, 
    borderRadius: 16, 
    borderWidth: 1, 
    alignItems: 'center',
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  priceTier: { fontFamily: SYSTEM_FONT, fontSize: 12, fontWeight: '800', letterSpacing: 1, marginBottom: 8 },
  priceAmount: { fontFamily: SYSTEM_FONT, fontSize: 24, fontWeight: '800', color: TEXT_DARK },
  perSession: { fontSize: 13, color: '#999', fontWeight: '500', marginBottom: 16 },
  divider: { height: 1, width: '100%', marginBottom: 16 },
  priceDesc: { fontFamily: SYSTEM_FONT, fontSize: 14, color: TEXT_GRAY, marginVertical: 4, width: '100%' },

  // --- Trust Footer ---
  trustRow: { flexDirection: "row", gap: 24, opacity: 0.8 },
  trustItem: { fontFamily: SYSTEM_FONT, fontSize: 13, fontWeight: "500", color: TEXT_GRAY },

  // --- Sections ---
  section: { maxWidth: 900, width: "100%", alignSelf: "center", paddingHorizontal: 24, paddingVertical: 40 },
  kicker: { fontFamily: SYSTEM_FONT, fontWeight: "800", fontSize: 12, color: CTA_TEAL, marginBottom: 10, textAlign: "center", letterSpacing: 1 },
  h2: { fontFamily: SYSTEM_FONT, fontWeight: "800", fontSize: 28, color: TEXT_DARK, marginBottom: 20, textAlign: "center" },
  h2Mobile: { fontSize: 24 },

  stepsGrid: { gap: 16 },
  stepsGridMobile: { gap: 16 },
  stepCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER_LIGHT,
    gap: 16,
  },
  stepEmoji: { fontSize: 28 },
  stepTitle: { fontFamily: SYSTEM_FONT, fontWeight: "700", fontSize: 16, color: TEXT_DARK, marginBottom: 2 },
  stepDesc: { fontFamily: SYSTEM_FONT, fontWeight: "500", fontSize: 14, color: TEXT_GRAY },

  faqWrap: { gap: 12 },
  faqItem: { backgroundColor: "#fff", padding: 20, borderRadius: 12, borderWidth: 1, borderColor: BORDER_LIGHT },
  faqQ: { fontFamily: SYSTEM_FONT, fontWeight: "700", fontSize: 16, color: TEXT_DARK, marginBottom: 6 },
  faqA: { fontFamily: SYSTEM_FONT, fontWeight: "400", fontSize: 14, color: TEXT_GRAY, lineHeight: 22 },

  footerText: { textAlign: "center", fontFamily: SYSTEM_FONT, color: "#999", fontSize: 13 },
});