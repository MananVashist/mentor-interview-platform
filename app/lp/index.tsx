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

const SYSTEM_FONT = Platform.select({
  web: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
  ios: "System",
  android: "Roboto",
  default: "System",
}) as string;

// --- Static Data ---
const STEPS = [
  { emoji: "📝", title: "1. Pick a role", desc: "Select your target role and practice topic." },
  { emoji: "👨‍💼", title: "2. Book Expert", desc: "Schedule a time with a verified mentor." },
  { emoji: "🎯", title: "3. Get Feedback", desc: "Realistic mock interview + scorecard." },
];

const FAQS = [
  {
    q: "What does “anonymous” mean here?",
    a: "Your personal details are not shown to mentors. You control what you share.",
  },
  {
    q: "What if the mentor doesn’t show up?",
    a: "We keep it safe: you get a full refund instantly.",
  },
];

// --- Sub-Components ---

const Button = ({
  title,
  onPress,
  variant = "primary",
  style,
  textStyle,
}: {
  title: string;
  onPress: () => void;
  variant?: "primary" | "outline";
  style?: any;
  textStyle?: any;
}) => (
  <TouchableOpacity
    style={[
      styles.buttonBase,
      variant === "primary" && styles.buttonPrimary,
      variant === "outline" && styles.buttonOutline,
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
    <Text style={styles.trustItem}>✅ Verified Mentors</Text>
    <Text style={styles.trustItem}>🕵️ 100% Anonymous</Text>
    <Text style={styles.trustItem}>🛡️ Money-back Guarantee</Text>
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

  const onPrimaryCta = () => {
    // 1. CAPTURE ANALYTICS (Internal Tracking)
    // ----------------------------------------------------
    // This logs what the user clicked before they leave the page.
    // Connect this to Mixpanel/GA/PostHog.
    const eventData = {
      event: "click_book_interview",
      role_intent: selectedRole || "not_selected",
      utm_source: utm.source,
    };
    console.log("[Analytics] CTA Clicked:", eventData);
    
    // 2. ROUTING (Clean URL)
    // ----------------------------------------------------
    const qs = new URLSearchParams();
    // Only pass UTM tags for attribution, NOT the role.
    if (utm.source) qs.set("utm_source", utm.source);
    if (utm.campaign) qs.set("utm_campaign", utm.campaign);
    if (utm.content) qs.set("utm_content", utm.content);

    const query = qs.toString();
    router.push(query ? `/auth/sign-up?${query}` : "/auth/sign-up");
  };

  // Helper for rendering chips
  const renderChip = (id: "pm" | "da" | "hr" | "ds", label: string) => (
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
        <meta property="og:image" content="https://crackjobs.com/images/og-linkedin-preview.png" />
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

        {/* HERO SECTION - CLEANED UP */}
        <View style={styles.heroSection}>
          <View style={[styles.heroInner, isSmall && styles.heroInnerMobile]}>
            
            <View style={styles.badge}>
              <Text style={styles.badgeText}>FROM LINKEDIN → QUICK MOCK</Text>
            </View>

            <Text style={[styles.h1, isSmall && styles.h1Mobile]}>
              Practice Interviews{"\n"}
              <Text style={{ color: CTA_TEAL }}>Without the Fear</Text>
            </Text>

            <Text style={[styles.sub, isSmall && styles.subMobile]}>
              Stop practicing with friends. Get realistic feedback from experts anonymously.
            </Text>

            {/* Chip Selector - Captures intent locally */}
            <View style={styles.chipContainer}>
              <Text style={styles.labelTiny}>I AM PRACTICING FOR:</Text>
              <View style={styles.chipRow}>
                {renderChip("pm", "Product Manager")}
                {renderChip("da", "Data Analyst")}
                {renderChip("ds", "Data Science")}
                {renderChip("hr", "HR / Recruiter")}
              </View>
            </View>

            {/* CTAs */}
            <View style={[styles.ctaRow, isSmall && { flexDirection: "column" }]}>
              <Button
                title="Book Mock Interview"
                onPress={onPrimaryCta}
                style={[styles.ctaBig, isSmall && { width: "100%" }]}
                textStyle={{ fontSize: 16 }}
              />
              <Button
                title="Browse Mentors"
                variant="outline"
                // Secondary CTA also captures the analytics event if you wish, 
                // or just links directly. Currently set to sign-in.
                onPress={() => {
                   console.log("[Analytics] Browse Mentors Clicked", { role_intent: selectedRole });
                   router.push("/auth/sign-in");
                }}
                style={[styles.ctaBig, isSmall && { width: "100%" }]}
                textStyle={{ fontSize: 16 }}
              />
            </View>

            {/* Trust signals */}
            <TrustFooter isSmall={isSmall} />
            
          </View>
        </View>

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
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 28,
  },
  buttonPrimary: { backgroundColor: CTA_TEAL, shadowColor: CTA_TEAL, shadowOpacity: 0.2, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
  buttonOutline: { backgroundColor: "transparent", borderWidth: 2, borderColor: "rgba(0,0,0,0.1)" },
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
    borderColor: "rgba(0,0,0,0.03)",
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
    borderColor: "rgba(0,0,0,0.04)",
    gap: 16,
  },
  stepEmoji: { fontSize: 28 },
  stepTitle: { fontFamily: SYSTEM_FONT, fontWeight: "700", fontSize: 16, color: TEXT_DARK, marginBottom: 2 },
  stepDesc: { fontFamily: SYSTEM_FONT, fontWeight: "500", fontSize: 14, color: TEXT_GRAY },

  faqWrap: { gap: 12 },
  faqItem: { backgroundColor: "#fff", padding: 20, borderRadius: 12, borderWidth: 1, borderColor: "rgba(0,0,0,0.04)" },
  faqQ: { fontFamily: SYSTEM_FONT, fontWeight: "700", fontSize: 16, color: TEXT_DARK, marginBottom: 6 },
  faqA: { fontFamily: SYSTEM_FONT, fontWeight: "400", fontSize: 14, color: TEXT_GRAY, lineHeight: 22 },

  footerText: { textAlign: "center", fontFamily: SYSTEM_FONT, color: "#999", fontSize: 13 },
});