import React, { memo, useMemo, useRef, useState, useEffect, lazy, Suspense } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform, Dimensions, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Head from "expo-router/head";
import { Header } from "@/components/Header";
import { trackEvent } from "@/lib/analytics";

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

const ROLE_META: Record<string, { title: string; description: string; canonical: string }> = {
  pm: {
    title: "PM Mock Interview Prep | Practice with Real Product Managers | CrackJobs",
    description: "Practice product sense, execution, and strategy questions with real PMs. Get feedback that shows exactly why you'd get rejected — before the real interview.",
    canonical: "https://crackjobs.com/lp/pm",
  },
  da: {
    title: "Data Analyst Mock Interview Prep | Practice with Real Analysts | CrackJobs",
    description: "Practice SQL, business cases, and stakeholder communication with experienced data analysts. Get feedback that shows exactly where your analysis story breaks down.",
    canonical: "https://crackjobs.com/lp/da",
  },
  ds: {
    title: "Data Science Mock Interview Prep | Practice with Real Data Scientists | CrackJobs",
    description: "Practice ML theory, stats, and system design with real data scientists. Find out which round is actually costing you — before it happens again.",
    canonical: "https://crackjobs.com/lp/ds",
  },
  hr: {
    title: "HR Mock Interview Prep | Practice with Real HR Professionals | CrackJobs",
    description: "Practice behavioral, HRBP, and strategic HR questions with real HR professionals. Get feedback that shows exactly how you come across to a senior interviewer.",
    canonical: "https://crackjobs.com/lp/hr",
  },
  default: {
    title: "CrackJobs | Mock Interview Platform for PM, Data & HR Roles",
    description: "Book a live mock interview based on your actual job description. Get structured feedback from real interviewers, eliminate blind spots, and ace the real thing.",
    canonical: "https://crackjobs.com/lp",
  },
};

const HERO_SUB: Record<string, string> = {
  pm: "Practice product sense, execution, and strategy questions with real PMs. Get feedback that tells you exactly why you'd get rejected — before the real interview.",
  da: "Practice SQL, business cases, and stakeholder communication with real data analysts. Get feedback that tells you exactly where your analysis story breaks down.",
  ds: "Practice ML theory, stats, and system design with real data scientists. Find out which round is actually costing you — before it happens again.",
  hr: "Practice behavioral, HRBP, and strategic HR questions with real HR professionals. Get feedback that shows you exactly how you come across to a senior interviewer.",
  default: "Book a live mock interview based on your actual job description or target specific weaknesses. Get structured feedback from real interviewers, eliminate your blind spots, and ace the real thing.",
};

// --- Valid Roles Config ---
const VALID_ROLES = ["hr", "ds", "da", "pm"];

// Role-Specific Content - Shifted to Outcomes
const ROLE_CONTENT: Record<string, { title: string; highlight: string; roleName: string }> = {
  default: {
    title: "Land your dream job",
    highlight: "with realistic interview practice",
    roleName: "role"
  },
  hr: {
    title: "Land your dream HR job",
    highlight: "with realistic interview practice",
    roleName: "HR"
  },
  ds: {
    title: "Land your dream Data Science job",
    highlight: "with realistic interview practice",
    roleName: "Data Science"
  },
  da: {
    title: "Land your dream Data Analytics job",
    highlight: "with realistic interview practice",
    roleName: "Data Analytics"
  },
  pm: {
    title: "Land your dream Product Management job",
    highlight: "with realistic interview practice",
    roleName: "PM"
  },
};

const CTA_LABEL: Record<string, string> = {
  pm: "Book Your PM Mock Interview",
  da: "Book Your Analytics Interview",
  ds: "Book Your Data Science Interview",
  hr: "Book Your HR Mock Interview",
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
      <Text style={styles.trustPillText}>🧑‍💻 Real industry experts, not AI</Text>
    </View>
    <View style={styles.trustPill}>
      <Text style={styles.trustPillText}>🎯 Practice with your target JD</Text>
    </View>
    <View style={styles.trustPill}>
      <Text style={styles.trustPillText}>📝 Actionable human feedback</Text>
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
  const [isSmall, setIsSmall] = useState(false);
  useEffect(() => {
    const update = () => setIsSmall(Dimensions.get('window').width < 900);
    update();
    const sub = Dimensions.addEventListener('change', ({ window }) => setIsSmall(window.width < 900));
    return () => sub.remove();
  }, []);
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

  const utm = useMemo(() => ({
    source: typeof params.utm_source === "string" ? params.utm_source : "",
    campaign: typeof params.utm_campaign === "string" ? params.utm_campaign : "",
    content: typeof params.utm_content === "string" ? params.utm_content : "",
  }), [params]);

  const content = ROLE_CONTENT[activeRole];

  // ─── Engagement tracking ────────────────────────────────────────────────────
  const hasInteracted = useRef(false);
  const pageLoadTime  = useRef(Date.now());
  const exitFired     = useRef(false);

  React.useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    const fireExitIfNoInteraction = () => {
      if (!hasInteracted.current && !exitFired.current) {
        exitFired.current = true;
        pushToDataLayer("lp_exit_no_interaction", { role_viewed: activeRole });
      }
    };

    // Fires when tab is closed, refreshed, or navigated away in browser
    const handlePageHide = () => fireExitIfNoInteraction();

    // Fires when tab is hidden (switch tabs, minimize, lock screen)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') fireExitIfNoInteraction();
    };

    window.addEventListener('pagehide', handlePageHide);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Also fires on SPA navigation (component unmount)
    return () => {
      fireExitIfNoInteraction();
      window.removeEventListener('pagehide', handlePageHide);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleBookClick = (tier: string = "general") => {
    hasInteracted.current = true;
    const secondsBeforeClick = Math.round((Date.now() - pageLoadTime.current) / 1000);
    pushToDataLayer("lp_hero_cta_click", { role_viewed: activeRole, seconds_before_click: secondsBeforeClick });
    router.push(activeRole !== "default" ? `/mentors?role=${activeRole}` : "/mentors");
  };

  const handleViewMentors = (source: string = "hero_secondary") => {
    hasInteracted.current = true;
    const secondsBeforeClick = Math.round((Date.now() - pageLoadTime.current) / 1000);
    if (source === "domain_mentors_cta") {
      pushToDataLayer("lp_view_experts_click", { role_viewed: activeRole, seconds_before_click: secondsBeforeClick });
    } else if (source === "bundle_intro_call") {
      pushToDataLayer("lp_diagnostic_call_click", { role_viewed: activeRole, seconds_before_click: secondsBeforeClick });
    } else if (source === "final_cta") {
      pushToDataLayer("lp_final_cta_click", { role_viewed: activeRole, seconds_before_click: secondsBeforeClick });
    } else {
      pushToDataLayer("lp_cta_click", { source, role_viewed: activeRole, seconds_before_click: secondsBeforeClick });
    }
    router.push(activeRole !== "default" ? `/mentors?role=${activeRole}` : "/mentors");
  };

  return (
    <>
      <Head>
        <title>{(ROLE_META[activeRole] || ROLE_META.default).title}</title>
        <meta name="description" content={(ROLE_META[activeRole] || ROLE_META.default).description} />
        <link rel="canonical" href={(ROLE_META[activeRole] || ROLE_META.default).canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="CrackJobs" />
        <meta property="og:url" content={(ROLE_META[activeRole] || ROLE_META.default).canonical} />
        <meta property="og:title" content={(ROLE_META[activeRole] || ROLE_META.default).title} />
        <meta property="og:description" content={(ROLE_META[activeRole] || ROLE_META.default).description} />
        <meta property="og:image" content="https://crackjobs.com/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={(ROLE_META[activeRole] || ROLE_META.default).title} />
        <meta name="twitter:description" content={(ROLE_META[activeRole] || ROLE_META.default).description} />
        <meta name="twitter:image" content="https://crackjobs.com/og-image.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
            
            <Text style={[styles.subheadline, isSmall && styles.subheadlineMobile]}>
              {HERO_SUB[activeRole] ?? HERO_SUB.default}
            </Text>

            <View style={[styles.ctaRow, isSmall && { flexDirection: "column" }]}>
              <Button
                nativeID="btn-lp-hero-cta"
                title={CTA_LABEL[activeRole] ?? CTA_LABEL.default}
                onPress={() => handleBookClick("hero_cta")}
                style={[styles.ctaBig, isSmall && { width: "100%" }]}
                textStyle={{ fontSize: 18 }}
              />
            </View>

            <TouchableOpacity
              onPress={() => handleViewMentors("hero_secondary")}
              activeOpacity={0.7}
              style={{ marginBottom: 8 }}
            >
              <Text style={styles.secondaryCta}>
                See who's available →
              </Text>
            </TouchableOpacity>

            <TrustFooter isSmall={isSmall} />
          </View>
        </View>

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
  container: { flex: 1, backgroundColor: BG_CREAM },
  buttonBase: { borderRadius: 12, alignItems: "center", justifyContent: "center", paddingVertical: 18, paddingHorizontal: 36 },
  buttonShadow: { shadowOpacity: 0.3, shadowRadius: 10, shadowColor: CTA_TEAL, shadowOffset: { width: 0, height: 4 } },
  buttonText: { fontFamily: SYSTEM_FONT, fontSize: 16, fontWeight: "800", letterSpacing: 0.5, textAlign: "center" },
  heroSection: { maxWidth: 1000, width: "100%", alignSelf: "center", paddingHorizontal: 24, paddingTop: 40, paddingBottom: 30 },
  heroInner: { backgroundColor: "#fff", borderRadius: 24, padding: 48, paddingBottom: 48, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, borderWidth: 1, borderColor: BORDER_LIGHT, alignItems: "center" },
  heroInnerMobile: { padding: 24, paddingBottom: 32 },
  h1: { fontFamily: SYSTEM_FONT, fontWeight: "800", fontSize: 46, color: BRAND_ORANGE, lineHeight: 54, marginBottom: 16, textAlign: "center" },
  h1Mobile: { fontSize: 34, lineHeight: 42, marginBottom: 12 },
  subheadline: { fontFamily: SYSTEM_FONT, fontSize: 18, color: TEXT_GRAY, textAlign: "center", maxWidth: 700, lineHeight: 28, marginBottom: 32 },
  subheadlineMobile: { fontSize: 16, lineHeight: 24, marginBottom: 24 },
  ctaRow: { flexDirection: "row", gap: 12, width: "100%", justifyContent: "center", marginBottom: 32 },
  ctaBig: { minWidth: 280 },
  trustRow: { flexDirection: "row", gap: 16, justifyContent: "center", flexWrap: "wrap" },
  trustRowMobile: { flexDirection: "column", gap: 10, alignItems: "stretch", width: "100%" },
  trustPill: { backgroundColor: "#F0FDFA", paddingVertical: 10, paddingHorizontal: 16, borderRadius: 100, borderWidth: 1, borderColor: "#CCFBF1", alignItems: "center" },
  trustPillText: { fontFamily: SYSTEM_FONT, fontSize: 14, fontWeight: "700", color: "#0F766E" },
  section: { maxWidth: 900, width: "100%", alignSelf: "center", paddingHorizontal: 24, paddingVertical: 40 },
  footerText: { textAlign: "center", fontFamily: SYSTEM_FONT, color: "#9CA3AF", fontSize: 13 },
  secondaryCta: { fontFamily: SYSTEM_FONT, fontSize: 15, fontWeight: "600", color: CTA_TEAL, textAlign: "center", textDecorationLine: "underline" },
});