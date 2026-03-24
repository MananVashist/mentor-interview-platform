import React, { memo, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform, Image, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Svg, Path, Circle } from "react-native-svg";
import { availabilityService } from "@/services/availability.service";

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
  { name: "Sneha P.", role: "Data Scientist", company: "Musigma", avatar: "👩‍🔬", rating: 5, quote: "The safe practice environment removed all pressure. My mentor's ML system design feedback was gold. Recording helped me review and improve 2x faster." },
  { name: "Amit K.", role: "HR Manager", company: "Flipkart", avatar: "👨‍💼", rating: 5, quote: "Practiced behavioral questions with an actual HRBP. The structured feedback on my STAR responses made all the difference in my interviews." },
];

const GUARANTEES = [
  { icon: "💰", title: "100% Money-Back Guarantee", description: "If your mentor doesn't show up, you get a full refund. No questions asked." },
  { icon: "🔄", title: "Free Rescheduling", description: "Life happens, we get it. Reschedule for free before your session. " },
  { icon: "📹", title: "Recording Guaranteed", description: "Every session is recorded and shared within 24 hours. Review unlimited times." },
  { icon: "📝", title: "Detailed Feedback Promise", description: "Structured scorecard with actionable tips delivered within 48 hours of your session." },
];

const FAQS = [
  { q: "Is this a safe space to practice?", a: "Absolutely. We provide a low-pressure environment where you can make mistakes and learn from them before your real interview. You can even keep your camera off if you prefer." },
  { q: "How long is a session?", a: "Intro calls are 25 minutes — designed to assess your current level and build a prep plan together. Full mock interviews are 55 minutes, matching the length of a real interview round so you can practice time management under actual conditions." },
  { q: "How do I know my mentor is actually experienced?", a: "Every mentor on CrackJobs is manually verified. We check their LinkedIn profile, confirm their current role, and review their background before they can take sessions. You can see their professional title and years of experience on their profile before booking." },
  { q: "What if I'm a fresher or just starting out?", a: "Many candidates on CrackJobs are making their first move into PM, analytics, or data science. Your mentor will calibrate the difficulty to your level. You don't need prior interview experience to benefit — in fact, starting early is exactly the right call." },
  { q: "What will the detailed feedback be like?", a: "You don't just get a 'pass/fail'. You get a structured scorecard with your strengths and specific areas of improvement, plus a recording of the session you can review as many times as you want." },
  { q: "What happens when the mentor does not show up for the session?", a: "You will be refunded the full amount. No questions asked." },
  { q: "Can I practice for a specific job?", a: "Yes! You can choose the topic of your interview, and paste the exact Job Description you are applying for so the mentor can tailor the questions to match the real thing." },
];

// --- Role-specific problems (shown in a separate section after How It Works) ---
const ROLE_PROBLEMS: Record<string, { icon: string; title: string; text: string }[]> = {
  da: [
    { icon: "🧩", title: "You can write the query. You blank on what it means for the business.", text: "SQL rounds are usually fine. The case study round is where most DA candidates lose the offer. You're handed a business problem, raw data, and silence. No one teaches you how to structure that." },
    { icon: "📊", title: "Your dashboard looks good. Your walkthrough doesn't.", text: "Walking an interviewer through a dashboard live is a completely different skill from building one. Most candidates ramble, lead with the wrong insight, and lose the room in the first 90 seconds." },
    { icon: "🗣️", title: "Stakeholder questions aren't about data. They're about judgment.", text: "When an interviewer asks how you'd handle a stakeholder who rejects your analysis — they're not testing your data skills. They're testing whether you can operate without hand-holding. Most candidates have never practised this part at all." },
  ],
  pm: [
    { icon: "🎯", title: "You know the framework. You apply it wrong when someone's watching.", text: "Product sense questions feel different in a real interview. You jump to solutions too fast, forget to define the user, lose the thread halfway through. Knowing CIRCLES doesn't help when your brain goes offline under pressure." },
    { icon: "📉", title: "Execution rounds are where PM interviews are won or lost. Almost nobody prepares for them properly.", text: "DAU dropped 20%. North Star for a new feature. Root cause a funnel drop. These questions have a specific structure interviewers expect — and most candidates freestyle their way through and don't realize it went badly." },
    { icon: "🏗️", title: "Your strategy answers sound like consulting, not product thinking.", text: "Market entry, competitive response, build-vs-buy — PM strategy questions test whether you think like an owner, not an MBA. If your answer reads like a Porter's Five Forces slide, you're signalling the wrong thing." },
  ],
  ds: [
    { icon: "🧠", title: "You understand the theory. You can't explain it to someone evaluating you in real time.", text: "Bias-variance tradeoff, regularization, why XGBoost over a random forest — you know this cold. But explaining it clearly, concisely, without trailing off? That's a live performance skill, not a knowledge test. Nobody practises it." },
    { icon: "💻", title: "LeetCode doesn't prepare you for real DS coding rounds.", text: "DS coding interviews aren't competitive programming. They're Pandas transforms, feature engineering, debugging a broken pipeline. LeetCode grind gives you false confidence in the wrong skill set." },
    { icon: "🏗️", title: "System design is the round most DS candidates skip preparing for entirely.", text: "Design a recommendation engine. Deploy a fraud model at scale. Handle drift. These questions come up for mid-senior roles and most candidates wing it. The ones who prep specifically for ML system design stand out immediately." },
  ],
  hr: [
    { icon: "📋", title: "Your answers are technically correct. They don't signal strategic thinking.", text: "Senior HR interviews aren't testing your HR knowledge — they're testing how you think about the business. Textbook answers about policies and processes get you screened out for roles that need an operator, not a handbook." },
    { icon: "🏆", title: "Your examples are real but they don't land as impactful.", text: "You've done meaningful work. But there's a gap between what you did and what an interviewer hears. Most HR candidates undersell their impact, bury the insight, or give examples that sound operational when the role needs strategic." },
    { icon: "🔄", title: "TA interviews and HRBP interviews test completely different things. Most candidates prep for the wrong one.", text: "If you're interviewing for an HRBP role but practising TA scenarios — or vice versa — you'll give a competent performance for a job you're not interviewing for. Wrong prep is almost worse than no prep." },
  ],
};

const ROLE_PROBLEM_HEADLINES: Record<string, string> = {
  da: "Sound familiar? These are the exact gaps that cost DA candidates offers.",
  pm: "Sound familiar? These are the exact gaps that cost PM candidates offers.",
  ds: "Sound familiar? These are the exact gaps that cost DS candidates offers.",
  hr: "Sound familiar? These are the exact gaps that cost HR candidates offers.",
};

// --- Role-specific testimonials ---
const ROLE_TESTIMONIALS: Record<string, { name: string; role: string; company: string; avatar: string; rating: number; quote: string }[]> = {
  pm: [
    { name: "Priya S.", role: "Product Manager", company: "TATA", avatar: "👩‍💼", rating: 5, quote: "I was designing features when I should have been solving problems. My mentor made me restart the same question three times. Felt brutal in the moment but that was exactly the gap I had." },
    { name: "Arjun T.", role: "APM", company: "Razorpay", avatar: "👨‍💼", rating: 5, quote: "The mock was harder than my actual interview. He kept pushing back on every assumption I made. Had to rethink my entire framework. Got the offer eight days later." },
  ],
  da: [
    { name: "Rahul V.", role: "Data Analyst", company: "Bigbasket", avatar: "👨‍💻", rating: 5, quote: "I thought I was decent at SQL until the case study completely threw me. The mentor gave me a messy real-world scenario and I had no idea how to structure it. Two sessions later I finally understood what interviewers actually want to hear." },
    { name: "Nisha R.", role: "Data Analyst", company: "Swiggy", avatar: "👩‍💻", rating: 5, quote: "I kept failing the walk-me-through-your-analysis part. My mentor pointed out I was jumping straight to the answer without building the story. Small fix. Exact reason I was getting rejected." },
  ],
  ds: [
    { name: "Sneha P.", role: "Data Scientist", company: "Musigma", avatar: "👩‍🔬", rating: 5, quote: "I could solve the ML problems on paper but completely fell apart explaining my reasoning out loud. My mentor made me talk through every single step. Felt embarrassing in the session. Felt confident in the real interview." },
    { name: "Rohit A.", role: "Data Scientist", company: "Ola", avatar: "👨‍🔬", rating: 5, quote: "Stats has always been my weak spot. One focused session on hypothesis testing and A/B test design. My mentor caught three conceptual gaps I didn't even know I had. Worth more than a month of self-study." },
  ],
  hr: [
    { name: "Amit K.", role: "HR Manager", company: "Flipkart", avatar: "👨‍💼", rating: 5, quote: "I was giving textbook answers and going nowhere. My mentor told me straight up my examples were too vague. We spent an hour sharpening my STAR responses to be actually specific. First real feedback I've gotten in years." },
    { name: "Riya P.", role: "HRBP", company: "Zomato", avatar: "👩‍💼", rating: 5, quote: "I was nervous about the strategic questions for senior roles. My mentor has sat on the other side of those exact interviews and knew precisely what they test for. That context completely changed how I answered everything." },
  ],
};

// --- Role-specific systematic prep copy ---
const ROLE_SYSTEMATIC: Record<string, { question: string; body: string }> = {
  da: { question: "Not sure if you need more SQL practice or case study practice?", body: "Book a diagnostic call to map out exactly which rounds — SQL, business cases, metrics, or stakeholder communication — are costing you offers. Then get a targeted bundle of mocks to fix them." },
  pm: { question: "Not sure whether product sense or execution questions are holding you back?", body: "Book a diagnostic call to find your exact weak spots across product sense, execution, strategy, and behavioral rounds. Then get a focused bundle of mocks built around your specific gaps." },
  ds: { question: "Not sure if it's ML theory, stats, or system design that's costing you?", body: "Book a diagnostic call to identify which DS interview rounds you're actually weak on. Then get a bundle of targeted mocks — no time wasted on rounds you're already good at." },
  hr: { question: "Not sure whether it's your TA skills or your HRBP framing that's getting you rejected?", body: "Book a diagnostic call to figure out exactly which HR interview areas need work. Then get a tailored bundle of mocks focused on the specific rounds that are standing between you and the offer." },
  default: { question: "Not sure which skill round to focus on?", body: "Book an initial diagnostic call to map out your specific blind spots, then get a custom bundle of mock interviews tailored to turn those weaknesses into strengths." },
};

// --- Role-specific final CTA copy ---
const ROLE_FINAL_CTA: Record<string, { headline: string; sub: string; btn: string }> = {
  da: { headline: "Your next DA offer is one realistic mock away.", sub: "Browse data analytics experts, pick your weak round — SQL, cases, metrics — and book in minutes.", btn: "Book Your DA Mock →" },
  pm: { headline: "Your next PM offer is one realistic mock away.", sub: "Browse product managers, pick the round you keep failing, and book in minutes.", btn: "Book Your PM Mock →" },
  ds: { headline: "One session with the right DS interviewer changes everything.", sub: "Browse data scientists, pick the round that's costing you — ML, stats, or system design — and book in minutes.", btn: "Book Your DS Mock →" },
  hr: { headline: "Your next senior HR role is closer than you think.", sub: "Browse HR professionals, pick your interview focus, and book in minutes.", btn: "Book Your HR Mock →" },
  default: { headline: "Your next interview is closer than you think.", sub: "Browse industry insiders, pick a topic, and book your session in minutes.", btn: "Book Your Session Now →" },
};

// ============================================
// SVG ICONS
// ============================================
const CheckmarkCircleIcon = ({ size = 16, color = "#3B82F6" }) => (<Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none" /><Path d="M8 12.5L10.5 15L16 9.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></Svg>);
const BriefcaseIcon = ({ size = 12, color = "#111827" }) => (<Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><Path d="M16 7V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></Svg>);
const SparklesIcon = ({ size = 14, color = "#1E40AF" }) => (<Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><Path d="M6 3L6.5 5.5L9 6L6.5 6.5L6 9L5.5 6.5L3 6L5.5 5.5L6 3Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></Svg>);
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
// PROBLEM & SOLUTION FLOW
// ============================================
const TheProblemSection = memo(({ isSmall }: { isSmall: boolean }) => (
  <View nativeID="section-problem" style={[styles.section, { paddingTop: 20 }]}>
    <Text style={styles.kicker}>THE HARDEST PART</Text>
    <Text style={[styles.h2, isSmall && styles.h2Mobile]}>Most candidates freeze when it counts</Text>
    <View style={styles.problemGrid}>
      <View style={styles.problemBox}>
        <Text style={styles.problemIcon}>😰</Text>
        <Text style={styles.problemTitle}>Interview Anxiety</Text>
        <Text style={styles.problemText}>The pressure of the real interview causes you to blank on answers you already know.</Text>
      </View>
      <View style={styles.problemBox}>
        <Text style={styles.problemIcon}>🤖</Text>
        <Text style={styles.problemTitle}>AI & Videos Fall Short</Text>
        <Text style={styles.problemText}>AI bots and YouTube videos cannot evaluate your communication nuance or tell you why a human would reject you.</Text>
      </View>
      <View style={styles.problemBox}>
        <Text style={styles.problemIcon}>❌</Text>
        <Text style={styles.problemTitle}>Silent Rejections</Text>
        <Text style={styles.problemText}>You get rejected but never find out exactly why or how the hiring manager evaluated your answers.</Text>
      </View>
    </View>
  </View>
));

const HowItWorksSection = memo(({ isSmall }: { isSmall: boolean }) => (
  <View nativeID="section-howitworks" style={[styles.section, { backgroundColor: '#fff', borderRadius: 24, paddingVertical: 48, marginBottom: 40, shadowColor: "#000", shadowOpacity: 0.03, shadowRadius: 15, borderWidth: 1, borderColor: BORDER_LIGHT }]}>
    <Text style={styles.kicker}>YOUR PATH TO THE OFFER</Text>
    <Text style={[styles.h2, isSmall && styles.h2Mobile]}>How realistic practice builds unshakeable confidence</Text>
    <View style={styles.stepsContainer}>
      <View style={styles.stepBox}>
        <View style={styles.stepNumber}><Text style={styles.stepNumberText}>1</Text></View>
        <Text style={styles.stepTitle}>Paste a JD or Pick a Skill</Text>
        <Text style={styles.stepText}>Use a specific Job Description to simulate the real thing, or select a targeted interview round to focus exactly on your weak spots.</Text>
      </View>
      <View style={styles.stepBox}>
        <View style={styles.stepNumber}><Text style={styles.stepNumberText}>2</Text></View>
        <Text style={styles.stepTitle}>Practice with an Insider</Text>
        <Text style={styles.stepText}>Simulate a live interview with a vetted industry expert. Answer real questions in a safe, low-pressure environment.</Text>
      </View>
      <View style={styles.stepBox}>
        <View style={styles.stepNumber}><Text style={styles.stepNumberText}>3</Text></View>
        <Text style={styles.stepTitle}>Get Actionable Feedback</Text>
        <Text style={styles.stepText}>Receive a detailed scorecard, review the session recording, fix your mistakes, and walk into the real interview ready.</Text>
      </View>
    </View>
  </View>
));

// ============================================
// ROLE-SPECIFIC PROBLEMS SECTION
// ============================================
const ROLE_KICKERS: Record<string, string> = {
  da: 'FOR DATA ANALYSTS', pm: 'FOR PRODUCT MANAGERS',
  ds: 'FOR DATA SCIENTISTS', hr: 'FOR HR PROFESSIONALS',
};

const RoleSpecificProblemsSection = memo(({ isSmall, role }: { isSmall: boolean; role: string }) => {
  const r = role.toLowerCase();
  const problems = ROLE_PROBLEMS[r];
  if (!problems) return null;
  return (
    <View nativeID="section-role-problems" style={[styles.section, { paddingTop: 0, paddingBottom: 48 }]}>
      <Text style={styles.kicker}>{ROLE_KICKERS[r] || 'FOR YOU'}</Text>
      <Text style={[styles.h2, isSmall && styles.h2Mobile]}>
        {ROLE_PROBLEM_HEADLINES[r]}
      </Text>
      <View style={styles.problemGrid}>
        {problems.map((p, i) => (
          <View key={i} style={styles.problemBox}>
            <Text style={styles.problemIcon}>{p.icon}</Text>
            <Text style={styles.problemTitle}>{p.title}</Text>
            <Text style={styles.problemText}>{p.text}</Text>
          </View>
        ))}
      </View>
    </View>
  );
});

// ============================================
// NEW: DYNAMIC TARGETED SKILLS SECTION
// ============================================
const TargetedSkillsSection = memo(({ role, isSmall, onViewMentors }: { role: string, isSmall: boolean, onViewMentors: (source: string) => void }) => {
  // Mapping skills explicitly derived from user DB JSON
  const SKILLS: Record<string, string[]> = {
    pm: ["Product Sense / Product Design", "Execution & Analytics", "Strategy & Market Understanding", "Technical & Architecture Basics", "Behavioral & Leadership"],
    da: ["SQL & Querying", "Case Studies (Data → Insight)", "Product Metrics & Experimentation", "Excel / Visualization", "Behavioral / Communication"],
    ds: ["ML Theory & Algorithms", "Practical ML / Model Debugging", "Coding (Python / Pandas / Algo)", "Statistics & Experimentation", "System Design (ML Systems)"],
    hr: ["Talent Acquisition", "HR Generalist", "HR Operations", "HR Business Partner", "COE – HR Functions"],
    default: ["Product Sense / Design", "SQL & Querying", "System Design (ML)", "Talent Acquisition", "Case Studies (Data → Insight)", "Behavioral & Leadership"]
  };

  const activeSkills = SKILLS[role.toLowerCase()] || SKILLS.default;

  return (
    <View nativeID="section-skills" style={[styles.section, { paddingTop: 20, paddingBottom: 60 }]}>
      <Text style={styles.kicker}>LASER-FOCUSED PRACTICE</Text>
      <Text style={[styles.h2, isSmall && styles.h2Mobile, { marginBottom: 16 }]}>Already know your weak spots?</Text>
      <Text style={styles.subtext}>Skip the general prep. Select from our pre-decided skills and book mock interviews strictly focused on the specific rounds that hold you back.</Text>
      
      <View style={styles.skillsPillContainer}>
        {activeSkills.map((skill, idx) => (
          <View key={idx} style={styles.skillPill}>
            <Text style={styles.skillPillText}>{skill}</Text>
          </View>
        ))}
      </View>

      <View style={{ alignItems: "center", marginTop: 32 }}>
        <Button
          nativeID="btn-lp-skills-cta"
          title="Book a Targeted Mock →"
          onPress={() => onViewMentors("targeted_skills_cta")}
          style={{ minWidth: 240 }}
        />
      </View>
    </View>
  );
});

const SystematicPrepSection = memo(({ onViewMentors, isSmall, role }: { onViewMentors: (source: string) => void, isSmall: boolean, role: string }) => {
  const copy = ROLE_SYSTEMATIC[role.toLowerCase()] || ROLE_SYSTEMATIC.default;
  return (
  <View nativeID="section-systematic" style={styles.notSureContainer}>
    <View style={styles.notSureBox}>
      <View style={styles.notSureIconRow}>
        <Text style={styles.notSureIcon}>📈</Text>
      </View>
      <Text style={styles.kicker}>THE SYSTEMATIC APPROACH</Text>
      <Text style={[styles.h2, isSmall && styles.h2Mobile, { marginBottom: 16 }]}>
        Diagnose your gaps. <Text style={{ color: BRAND_ORANGE }}>Systematically</Text> fix them.
      </Text>
      <Text style={styles.subtext}>{copy.question} {copy.body}</Text>

      <View style={styles.notSurePerks}>
        {[
          { icon: "1️⃣", text: "Book an intro call to diagnose your gaps and build a prep strategy." },
          { icon: "2️⃣", text: "Book a tailored bundle of interviews focusing exactly on your weak areas." },
          { icon: "3️⃣", text: "Track your progress systematically until you are completely interview-ready." },
        ].map((perk, i) => (
          <View key={i} style={styles.notSurePerk}>
            <Text style={styles.notSurePerkIcon}>{perk.icon}</Text>
            <Text style={styles.notSurePerkText}>{perk.text}</Text>
          </View>
        ))}
      </View>

      <Button
        nativeID="btn-lp-bundle-intro-call"
        title="Book Your Diagnostic Call"
        onPress={() => onViewMentors("bundle_intro_call")}
        style={styles.notSureButton}
        textStyle={{ fontSize: 16 }}
      />
      <Text style={styles.notSureNote}>Diagnostic calls are available directly on the expert's profile page</Text>
    </View>
  </View>
  );
});

// ============================================
// RESPONSIVE MENTOR CARD
// ============================================
const MentorCard = ({ m, displayPrice, totalSessions, isNewMentor, averageRating, showRating, hasSlots, displaySlot, customPriceLabel, onView, isSmall, isFounderCard }: any) => {
  const seed = m.id || m.profiles?.full_name || 'Mentor';
  const fallbackAvatar = `https://api.dicebear.com/9.x/micah/png?seed=${encodeURIComponent(m.id || "Mentor")}&backgroundColor=e5e7eb,f3f4f6`;
  const introPrice = Math.round(displayPrice * 0.20);

  const cardWidthStyle = isFounderCard 
    ? { width: '100%' as const } 
    : (isSmall ? { width: '100%' as const } : { width: Platform.OS === 'web' ? 'calc(50% - 8px)' as any : '100%' as const });

  return (
    <View style={[styles.card, cardWidthStyle]}>
      <View style={styles.cardContent}>
        <View style={styles.headerRow}>
          <Image source={{ uri: m.avatar_url || fallbackAvatar }} style={styles.avatarImage} />
          <View style={styles.headerInfo}>
            <View style={styles.identityGroup}>
              <Text style={styles.mentorName} numberOfLines={1}>{m.professional_title || 'Industry Expert'}</Text>
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
        // ── Parallel: fetch tiers, profiles, mentors simultaneously ──
        const [tiersRes, profilesRes, mentorsRes] = await Promise.all([
          fetch(`${SUPABASE_URL}/rest/v1/mentor_tiers?select=tier,percentage_cut`, { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }),
          fetch(`${SUPABASE_URL}/rest/v1/interview_profiles_admin?select=*`, { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }),
          fetch(`${SUPABASE_URL}/rest/v1/mentors?select=*,tier,profiles(full_name)&status=eq.approved`, { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }),
        ]);
        const [tiersData, profilesData, allMentors] = await Promise.all([tiersRes.json(), profilesRes.json(), mentorsRes.json()]);

        const tMap: Record<string, number> = {};
        tiersData?.forEach((t: any) => (tMap[t.tier] = t.percentage_cut));
        if (isMounted) setTierMap(tMap);

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

        const fMentor = allMentors.find((m: any) => m.id === FOUNDER_ID);

        let filtered = allMentors.filter((m: any) => m.id !== FOUNDER_ID) || [];
        if (matchedProfileId) {
           filtered = filtered.filter((m: any) => Array.isArray(m.profile_ids) && m.profile_ids.includes(matchedProfileId));
        }
        filtered = filtered.slice(0, 6);

        // ── Parallel: founder slot + all mentor slots simultaneously ──
        const allSlotPromises: Promise<{ id: string; slot: string }>[] = [
          ...(fMentor ? [availabilityService.findNextAvailableSlot(fMentor.id).then(slot => ({ id: fMentor.id, slot }))] : []),
          ...filtered.map(async (m: any) => ({ id: m.id, slot: await availabilityService.findNextAvailableSlot(m.id) })),
        ];
        const allSlotResults = await Promise.all(allSlotPromises);

        const availabilityMap: Record<string, string> = {};
        allSlotResults.forEach(({ id, slot }) => { availabilityMap[id] = slot; });

        // ── Sort mentors: available slots first ──
        const sortedFiltered = [...filtered].sort((a: any, b: any) => {
          const aHas = availabilityMap[a.id] && availabilityMap[a.id] !== "No slots available";
          const bHas = availabilityMap[b.id] && availabilityMap[b.id] !== "No slots available";
          return (aHas === bHas) ? 0 : aHas ? -1 : 1;
        });

        if (fMentor) {
          if (isMounted) setFounderMentor(fMentor);
          if (isMounted) setFounderSlot(availabilityMap[fMentor.id] || "No slots available");
        }
        if (isMounted) setMentors(sortedFiltered);
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
    <View nativeID="section-mentors" style={styles.listContainerWrapper}>
      
      {/* FOUNDER BLOCK */}
      {founderMentor && (
        <View style={styles.founderSection}>
          <Text style={styles.kicker}>START WITH STRATEGY</Text>
          <Text style={[styles.h2, isSmall && styles.h2Mobile]}>Free prep strategy session with the founder</Text>
          <Text style={styles.subtext}>Anxious about your upcoming interview? Book a complimentary discovery call to discuss your goals and build a prep plan.</Text>
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
              onView={() => {
                // 🟢 GTM: Track Mentor Card Click
                pushToDataLayer("lp_mentor_card_click", { mentor_id: founderMentor.id, mentor_tier: founderMentor.tier || 'founder', is_founder: true, role_viewed: role });
                router.push(`/mentors/${founderMentor.id}?role=${role}`);
              }}
              isSmall={isSmall}
              isFounderCard={true}
            />
          </View>
        </View>
      )}

      {/* GENERAL MENTORS BLOCK */}
      {mentors.length > 0 && (
        <>
          <Text style={styles.kicker}>YOUR INDUSTRY INSIDERS</Text>
          <Text style={[styles.h2, isSmall && styles.h2Mobile]}>Practice with the people who actually hire</Text>
          <Text style={[styles.subtext, { marginBottom: 40 }]}>Stop guessing what hiring managers want. Get realistic practice and insider feedback.</Text>
          
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
                  onView={() => {
                    // 🟢 GTM: Track Mentor Card Click
                    pushToDataLayer("lp_mentor_card_click", { mentor_id: m.id, mentor_tier: m.tier || 'bronze', is_founder: false, role_viewed: role });
                    router.push(`/mentors/${m.id}?role=${role}`);
                  }}
                  isSmall={isSmall}
                  isFounderCard={false}
                />
              );
            })}
          </View>

          <View style={{ alignItems: "center", marginTop: 32 }}>
            <Button
              title="View Experts & Book"
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

const TestimonialsSection = memo(({ onViewMentors, isSmall, role }: { onViewMentors: (source: string) => void, isSmall: boolean, role: string }) => {
  const shown = ROLE_TESTIMONIALS[role.toLowerCase()] || TESTIMONIALS.slice(0, 2);
  return (
  <View nativeID="section-testimonials" style={styles.testimonialsContainer}>
    <Text style={styles.kicker}>SUCCESS STORIES</Text>
    <Text style={[styles.h2, isSmall && styles.h2Mobile]}>Hear from successful candidates</Text>
    <View style={styles.testimonialsGrid}>
      {shown.map((t, i) => (
        <TestimonialCard key={i} testimonial={t} />
      ))}
    </View>
    <View style={styles.trustIndicators}>
      <Text style={styles.trustText}>✓ Verified testimonials</Text>
      <Text style={styles.trustText}>✓ Real candidate outcomes</Text>
      <Text style={styles.trustText}>✓ Proven results</Text>
    </View>
    <View style={{ alignItems: "center", marginTop: 40 }}>
      <Button
        nativeID="btn-lp-testimonials-cta"
        title="Get the same results →"
        onPress={() => onViewMentors("testimonials_cta")}
        style={{ minWidth: 260 }}
      />
    </View>
  </View>
  );
});

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
  <View nativeID="section-guarantees" style={styles.guaranteeContainer}>
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
        {["SECURE PAYMENTS", "VERIFIED EXPERTS", "INSTANT REFUNDS"].map((t, i) => (
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
  <View nativeID="section-faq" style={styles.section}>
    <Text style={styles.kicker}>FAQ</Text>
    <Text style={[styles.h2, isSmall && styles.h2Mobile]}>Common Questions</Text>
    <View style={{ gap: 12 }}>
      {FAQS.map((f, i) => (
        <FAQItem key={i} faq={f} />
      ))}
    </View>
  </View>
));

const FinalCTABanner = memo(({ onViewMentors, isSmall, role }: { onViewMentors: (source: string) => void, isSmall: boolean, role: string }) => {
  const copy = ROLE_FINAL_CTA[role.toLowerCase()] || ROLE_FINAL_CTA.default;
  return (
  <View nativeID="section-finalcta" style={styles.finalCtaContainer}>
    <View style={styles.finalCtaBox}>
      <Text style={[styles.h2, isSmall && styles.h2Mobile, { color: '#fff', marginBottom: 16 }]}>
        {copy.headline}
      </Text>
      <Text style={[styles.subtext, { color: 'rgba(255,255,255,0.85)' }]}>
        {copy.sub}
      </Text>
      <Button
        nativeID="btn-lp-final-view-mentors"
        title={copy.btn}
        onPress={() => onViewMentors("final_cta")}
        style={styles.finalCtaButton}
        textStyle={{color: '#000000', fontSize: 17 }}
      />
      <View style={styles.finalCtaTrust}>
        <Text style={styles.finalCtaTrustItem}>✓ Safe practice space</Text>
        <Text style={styles.finalCtaTrustItem}>✓ Money-back guarantee</Text>
        <Text style={styles.finalCtaTrustItem}>✓ Recording included</Text>
      </View>
    </View>
  </View>
  );
});

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
  // ─── Section visibility tracking via IntersectionObserver (web only) ─────────
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    const SECTIONS = [
      { id: 'section-problem',       name: 'the_problem' },
      { id: 'section-howitworks',    name: 'how_it_works' },
      { id: 'section-role-problems', name: 'role_specific_problems' },
      { id: 'section-skills',        name: 'targeted_skills' },
      { id: 'section-mentors',       name: 'domain_mentors' },
      { id: 'section-testimonials',  name: 'testimonials' },
      { id: 'section-systematic',    name: 'systematic_prep' },
      { id: 'section-guarantees',    name: 'guarantees' },
      { id: 'section-faq',           name: 'faq' },
      { id: 'section-finalcta',      name: 'final_cta_banner' },
    ];

    const observed = new Set<string>();

    const intersectionObserver = new (window as any).IntersectionObserver(
      (entries: any[]) => {
        entries.forEach((entry: any) => {
          if (entry.isIntersecting) {
            const section = SECTIONS.find(s => s.id === entry.target.id);
            if (section) {
              pushToDataLayer('lp_section_viewed', { section_name: section.name, role_viewed: role });
              intersectionObserver.unobserve(entry.target);
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    const tryObserve = (id: string) => {
      if (observed.has(id)) return;
      const el = document.getElementById(id);
      if (el) { intersectionObserver.observe(el); observed.add(id); }
    };

    SECTIONS.forEach(s => tryObserve(s.id));

    const mutationObserver = new MutationObserver(() => {
      SECTIONS.forEach(s => tryObserve(s.id));
      if (observed.size === SECTIONS.length) mutationObserver.disconnect();
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => { intersectionObserver.disconnect(); mutationObserver.disconnect(); };
  }, [role]);

  return (
    <>
      <TheProblemSection isSmall={isSmall} />
      <HowItWorksSection isSmall={isSmall} />
      <RoleSpecificProblemsSection isSmall={isSmall} role={role} />
      <TargetedSkillsSection role={role} isSmall={isSmall} onViewMentors={onViewMentors} />
      <DynamicDomainMentors role={role} isSmall={isSmall} onViewMentors={() => onViewMentors("domain_mentors_cta")} />
      <TestimonialsSection onViewMentors={onViewMentors} isSmall={isSmall} role={role} />
      <SystematicPrepSection onViewMentors={onViewMentors} isSmall={isSmall} role={role} />
      <GuaranteeSection isSmall={isSmall} />
      <FAQ isSmall={isSmall} />
      <FinalCTABanner onViewMentors={onViewMentors} isSmall={isSmall} role={role} />
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

  // ===== New Problem & Solution Styles =====
  problemGrid: { flexDirection: "row", flexWrap: "wrap", gap: 24, justifyContent: "center", marginTop: 20 },
  problemBox: { backgroundColor: "#fff", padding: 24, borderRadius: 16, borderWidth: 1, borderColor: BORDER_LIGHT, width: Platform.OS === "web" ? "calc(33.333% - 16px)" : "100%", minWidth: 250 },
  problemIcon: { fontSize: 32, marginBottom: 12 },
  problemTitle: { fontFamily: SYSTEM_FONT, fontSize: 18, fontWeight: "700", color: TEXT_DARK, marginBottom: 8 },
  problemText: { fontFamily: SYSTEM_FONT, fontSize: 14, color: TEXT_GRAY, lineHeight: 22 },
  stepsContainer: { flexDirection: "row", flexWrap: "wrap", gap: 24, justifyContent: "center", paddingHorizontal: 24 },
  stepBox: { alignItems: "center", width: Platform.OS === "web" ? "calc(33.333% - 16px)" : "100%", minWidth: 250 },
  stepNumber: { width: 48, height: 48, borderRadius: 24, backgroundColor: "#E6F6F6", alignItems: "center", justifyContent: "center", marginBottom: 16 },
  stepNumberText: { fontFamily: SYSTEM_FONT, fontSize: 20, fontWeight: "800", color: CTA_TEAL },
  stepTitle: { fontFamily: SYSTEM_FONT, fontSize: 18, fontWeight: "700", color: TEXT_DARK, marginBottom: 8, textAlign: "center" },
  stepText: { fontFamily: SYSTEM_FONT, fontSize: 14, color: TEXT_GRAY, lineHeight: 22, textAlign: "center" },

  // ===== New Targeted Skills Styles =====
  skillsPillContainer: { flexDirection: "row", flexWrap: "wrap", gap: 12, justifyContent: "center", maxWidth: 800, alignSelf: "center" },
  skillPill: { backgroundColor: "#fff", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 100, borderWidth: 1, borderColor: "rgba(24, 167, 167, 0.3)", shadowColor: CTA_TEAL, shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  skillPillText: { fontFamily: SYSTEM_FONT, fontSize: 15, fontWeight: "600", color: TEXT_DARK },

  // ===== Button Styles =====
  buttonBase: { borderRadius: 8, alignItems: "center", justifyContent: "center", paddingVertical: 14, paddingHorizontal: 28 },
  buttonPrimary: { backgroundColor: CTA_TEAL, shadowOpacity: 0.2, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
  buttonOutline: { backgroundColor: "transparent", borderWidth: 2, borderColor: CTA_TEAL },
  buttonText: { fontFamily: SYSTEM_FONT, fontSize: 15, fontWeight: "700" },

  // ===== Dynamic Mentors List =====
  listContainerWrapper: { paddingVertical: 60, maxWidth: 1200, width: "100%", alignSelf: "center", paddingHorizontal: 24 },
  listContainer: { flexDirection: "row", flexWrap: "wrap", gap: 16, justifyContent: "center" },
  founderSection: { marginBottom: 64, alignItems: 'center', width: '100%', maxWidth: 900, alignSelf: 'center' },
  founderCardWrapper: { width: '100%', maxWidth: 500, marginTop: 16 },

  // Card Styles
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 20, borderWidth: 0.5, borderColor: "#F3F4F6", minWidth: 300, maxWidth: 500, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 }, android: { elevation: 2 } }) },
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
  testimonialsContainer: { paddingTop: 40, paddingBottom: 60, paddingHorizontal: 24, backgroundColor: BG_CREAM },
  testimonialsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 24, justifyContent: "center", maxWidth: 1200, alignSelf: "center" },
  testimonialCard: { backgroundColor: "#fff", padding: 32, borderRadius: 16, borderWidth: 1, borderColor: "rgba(0,0,0,0.08)", width: Platform.OS === "web" ? "calc(50% - 12px)" : "100%", minWidth: 280, maxWidth: 550 },
  testimonialHeader: { flexDirection: "row", alignItems: "center", marginBottom: 18, gap: 14 },
  avatarContainer: { width: 52, height: 52, borderRadius: 26, backgroundColor: BG_CREAM, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: BORDER_LIGHT },
  avatarText: { fontFamily: SYSTEM_FONT, fontSize: 26 },
  testimonialMeta: { flex: 1 },
  testimonialName: { fontFamily: SYSTEM_FONT, fontSize: 17, fontWeight: "700", color: TEXT_DARK, marginBottom: 3 },
  testimonialRole: { fontFamily: SYSTEM_FONT, fontSize: 14, fontWeight: "600", color: TEXT_GRAY },
  testimonialQuote: { fontFamily: SYSTEM_FONT, fontSize: 15, lineHeight: 25, color: TEXT_DARK, marginBottom: 18 },
  trustIndicators: { flexDirection: "row", justifyContent: "center", gap: 32, marginTop: 48, flexWrap: "wrap" },
  trustText: { fontFamily: SYSTEM_FONT, fontSize: 13, fontWeight: "600", color: TEXT_GRAY, opacity: 0.8 },

  // ===== Systematic Bundle Strategy =====
  notSureContainer: { paddingHorizontal: 24, paddingVertical: 16, backgroundColor: BG_CREAM },
  notSureBox: { backgroundColor: "#fff9f5", borderRadius: 20, paddingVertical: 48, paddingHorizontal: 40, maxWidth: 900, alignSelf: "center", width: "100%", alignItems: "center", borderWidth: 2, borderColor: "rgba(245, 135, 66, 0.25)" },
  notSureIconRow: { marginBottom: 16 },
  notSureIcon: { fontFamily: SYSTEM_FONT, fontSize: 40 },
  notSurePerks: { gap: 14, alignSelf: "center", maxWidth: 480, marginBottom: 36 },
  notSurePerk: { flexDirection: "row", alignItems: "flex-start", gap: 12, backgroundColor: "#fff", padding: 16, borderRadius: 12, borderWidth: 1, borderColor: "rgba(245, 135, 66, 0.15)" },
  notSurePerkIcon: { fontFamily: SYSTEM_FONT, fontSize: 20 },
  notSurePerkText: { fontFamily: SYSTEM_FONT, fontSize: 14, color: TEXT_DARK, flex: 1, lineHeight: 22, fontWeight: "500" },
  notSureButton: { backgroundColor: BRAND_ORANGE, minWidth: 280, shadowOpacity: 0.2, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
  notSureNote: { fontFamily: SYSTEM_FONT, fontSize: 12, color: TEXT_GRAY, marginTop: 14, textAlign: "center", opacity: 0.7 },

  // ===== Guarantee =====
  guaranteeContainer: { paddingTop: 40, paddingBottom: 80, paddingHorizontal: 24, backgroundColor: BG_CREAM },
  guaranteeBox: { backgroundColor: "#fff", padding: 56, borderRadius: 20, maxWidth: 1100, alignSelf: "center", width: "100%", borderWidth: 2, borderColor: "rgba(24, 167, 167, 0.3)" },
  guaranteesGrid: { flexDirection: "row", flexWrap: "wrap", gap: 24, marginBottom: 44, justifyContent: "center" },
  guaranteeCard: { backgroundColor: BG_CREAM, padding: 28, borderRadius: 16, width: Platform.OS === "web" ? "calc(50% - 12px)" : "100%", minWidth: 240, maxWidth: 500, borderWidth: 1, borderColor: BORDER_LIGHT },
  trustSeal: { flexDirection: "row", justifyContent: "center", gap: 18, paddingVertical: 26, borderTopWidth: 1, borderTopColor: BORDER_LIGHT, flexWrap: "wrap" },
  sealBadge: { backgroundColor: "#e8f9f9", paddingVertical: 9, paddingHorizontal: 18, borderRadius: 8, borderWidth: 1, borderColor: "rgba(24, 167, 167, 0.15)" },

  // ===== FAQ & Final CTA =====
  faqItem: { backgroundColor: "#fff", padding: 20, borderRadius: 12, borderWidth: 1, borderColor: BORDER_LIGHT },
  finalCtaContainer: { paddingHorizontal: 24, paddingVertical: 60, backgroundColor: BG_CREAM },
  finalCtaBox: { backgroundColor: CTA_TEAL, borderRadius: 24, paddingVertical: 56, paddingHorizontal: 40, maxWidth: 900, alignSelf: "center", width: "100%", alignItems: "center" },
  finalCtaButton: { backgroundColor: "#fff", borderRadius: 8, paddingVertical: 16, paddingHorizontal: 36, shadowOpacity: 0.15, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, minWidth: 240 },
  finalCtaTrust: { flexDirection: "row", gap: 20, marginTop: 24, flexWrap: "wrap", justifyContent: "center" },
  finalCtaTrustItem: { fontFamily: SYSTEM_FONT, fontSize: 13, fontWeight: "600", color: "rgba(255,255,255,0.9)" },
});