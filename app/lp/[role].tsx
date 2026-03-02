import React, { memo, useMemo, useRef, useState, lazy, Suspense } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform, useWindowDimensions, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Head from "expo-router/head";
import { Header } from "@/components/Header";
import { trackEvent } from "@/lib/analytics";

// Lazy Load Heavy Sections - Load immediately, no delay
const LazySectionsLP = lazy(() => import("./lazysectionslp"));

const BRAND_ORANGE = "#f58742";
const CTA_TEAL = "#18a7a7";
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

// --- Valid Roles Config ---
const VALID_ROLES = ["hr", "ds", "da", "pm"];

// Role-Specific Content
const ROLE_CONTENT: Record<string, { title: string; highlight: string }> = {
  default: {
    title: "Mock Interviews",
    highlight: "with expert mentors",
  },
  hr: {
    title: "HR mock interviews with ",
    highlight: "real HR leaders",
  },
  ds: {
    title: "Data Science mock interviews",
    highlight: "with real experts",
  },
  da: {
    title: "Data Analytics mock interviews",
    highlight: "with domain experts",
  },
  pm: {
    title: "Product Management mock interviews",
    highlight: "with expert PMs",
  },
};

const CTA_LABEL: Record<string, string> = {
  pm: "Book a PM Mock Interview",
  da: "Book a Data Analytics Mock Interview",
  ds: "Book a Data Science Mock Interview",
  hr: "Book an HR Mock Interview",
  default: "Book Your Mock Interview",
};

const Button = memo(({ title, onPress, variant = "primary", color = CTA_TEAL, style, textStyle, nativeID }: any) => (
  <TouchableOpacity
    nativeID={nativeID}
    style={[
      styles.buttonBase,
      variant === "primary" && { backgroundColor: color },
      variant === "primary" && styles.buttonShadow,
      style,
    ]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Text style={[styles.buttonText, variant === "primary" && { color: "#fff" }, textStyle]}>
      {title}
    </Text>
  </TouchableOpacity>
));

const TrustFooter = memo(({ isSmall }: { isSmall: boolean }) => (
  <View style={[styles.trustRow, isSmall && styles.trustRowMobile]}>
    <View style={styles.trustPill}>
      <Text style={styles.trustPillText}>🎥 1:1 Video Call</Text>
    </View>
    <View style={styles.trustPill}>
      <Text style={styles.trustPillText}>📝 Recording + Scorecard</Text>
    </View>
    <View style={styles.trustPill}>
      <Text style={styles.trustPillText}>🕵️ 100% Anonymous</Text>
    </View>
  </View>
));

// Lightweight fallback to prevent layout shift
const SectionsFallback = memo(() => (
  <View style={{ minHeight: 400, justifyContent: "center", alignItems: "center" }}>
    <View style={{ width: 40, height: 40, borderRadius: 20, borderWidth: 3, borderColor: BRAND_ORANGE, borderTopColor: "transparent" }} />
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

  // Track analytics for valid roles only
  React.useEffect(() => {
    if (activeRole !== "default") {
      trackEvent("lp_visit", {
        role: activeRole,
        page_title: ROLE_CONTENT[activeRole].title,
      });
    }
  }, [activeRole]);

  // Capture UTM
  const utm = useMemo(() => ({
    source: typeof params.utm_source === "string" ? params.utm_source : "",
    campaign: typeof params.utm_campaign === "string" ? params.utm_campaign : "",
    content: typeof params.utm_content === "string" ? params.utm_content : "",
  }), [params]);

  const content = ROLE_CONTENT[activeRole];

  const handleBookClick = (tier: string = "general") => {
    console.log("[Analytics] Interest Captured:", {
      role: activeRole,
      tier_intent: tier,
      source: utm.source,
    });
    router.push("/mentors");
  };

  const handleViewMentors = (source: string = "hero_secondary") => {
    console.log("[Analytics] View Mentors Clicked:", {
      role: activeRole,
      source,
      utm: utm.source,
    });
    router.push("/mentors");
  };

  return (
    <>
      <Head>
        <title>{`CrackJobs | ${content.title} Interview Prep`}</title>
        <meta name="description" content={`Practice ${content.title} interviews with real experts.`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Resource Hints for Performance */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />

        {/* Inline Critical CSS */}
        <style>{`
          body { 
            margin: 0; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif; 
            background-color: ${BG_CREAM}; 
          } 
          * { box-sizing: border-box; }
          #root { min-height: 100vh; }
        `}</style>
      </Head>
      <ScrollView
        ref={scrollRef}
        style={styles.container}
        contentContainerStyle={{ minHeight: "100%" }}
        removeClippedSubviews={Platform.OS === "android"}
        maxToRenderPerBatch={10}
        windowSize={10}
      >
        <Header />

        {/* ===== HERO ===== */}
        <View style={styles.heroSection}>
          <View style={[styles.heroInner, isSmall && styles.heroInnerMobile]}>
            <Text style={[styles.h1, isSmall && styles.h1Mobile]}>
              {content.title}{"\n"}
              <Text style={{ color: CTA_TEAL }}>{content.highlight}</Text>
            </Text>

            {/* Single CTA */}
            <View style={[styles.ctaRow, isSmall && { flexDirection: "column" }]}>
              <Button
                nativeID="btn-lp-hero-cta"
                title={CTA_LABEL[activeRole] ?? CTA_LABEL.default}
                onPress={() => handleBookClick("hero_cta")}
                style={[styles.ctaBig, isSmall && { width: "100%" }]}
                textStyle={{ fontSize: 18 }}
              />
            </View>

            <TrustFooter isSmall={isSmall} />
          </View>
        </View>

        {/* Lazy Loaded Sections - Passes role to fetch real mentors */}
        <Suspense fallback={<SectionsFallback />}>
          <LazySectionsLP
            role={activeRole}
            onPricingLayout={setPricingY}
            isSmall={isSmall}
            onViewMentors={handleViewMentors}
          />
        </Suspense>

        <View style={[styles.section, { paddingBottom: 60 }]}>
          <Text style={styles.footerText}>© {new Date().getFullYear()} CrackJobs</Text>
        </View>
      </ScrollView>
    </>
  );
}

export function generateStaticParams() {
  return VALID_ROLES.map((role) => ({ role }));
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_CREAM,
  },

  // ===== Button Styles =====
  buttonBase: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 36,
  },
  buttonShadow: {
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowColor: CTA_TEAL,
    shadowOffset: { width: 0, height: 4 },
  },
  buttonText: {
    fontFamily: SYSTEM_FONT,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  // ===== Hero Section =====
  heroSection: {
    maxWidth: 1000,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 30,
  },
  heroInner: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 48,
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
  h1: {
    fontFamily: SYSTEM_FONT,
    fontWeight: "800",
    fontSize: 46,
    color: BRAND_ORANGE,
    lineHeight: 54,
    marginBottom: 32,
    textAlign: "center",
  },
  h1Mobile: {
    fontSize: 34,
    lineHeight: 42,
    marginBottom: 24,
  },
  ctaRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    justifyContent: "center",
    marginBottom: 32,
  },
  ctaBig: {
    minWidth: 280,
  },
  
  // Trust Highlight Footer
  trustRow: {
    flexDirection: "row",
    gap: 16,
    justifyContent: "center",
    flexWrap: "wrap",
  },
  trustRowMobile: {
    flexDirection: "column",
    gap: 10,
    alignItems: "stretch",
    width: "100%",
  },
  trustPill: {
    backgroundColor: "#F0FDFA",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#CCFBF1",
    alignItems: "center",
  },
  trustPillText: {
    fontFamily: SYSTEM_FONT,
    fontSize: 14,
    fontWeight: "700",
    color: "#0F766E",
  },

  // ===== Section Styles =====
  section: {
    maxWidth: 900,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  footerText: {
    textAlign: "center",
    fontFamily: SYSTEM_FONT,
    color: "#9CA3AF",
    fontSize: 13,
  },
});