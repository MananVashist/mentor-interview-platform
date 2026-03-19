// app/candidate/[id].tsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity,
  Platform, useWindowDimensions, TextInput, Alert, Text, Image
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Svg, Path, Circle, Rect } from "react-native-svg";
import { theme } from "@/lib/theme";
import { supabase } from "@/lib/supabase/client";
import { useAuthStore } from "@/lib/store";
import { availabilityService, type DayAvailability } from "@/services/availability.service";
import { paymentService } from "@/services/payment.service";
import { DateTime } from "luxon";

const F = Platform.select({
  web: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  ios: "System", android: "Roboto", default: "System",
}) as string;

const TEAL = "#18a7a7";
const TEAL_LT = "#F0FDFA";
const BG_CREAM = "#f8f5f0";
const DARK = "#111827";
const MUTED = "#6B7280";
const BORDER = "#E5E7EB";
const WHITE = "#FFFFFF";

const SUPABASE_URL = "https://rcbaaiiawrglvyzmawvr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjYmFhaWlhd3JnbHZ5em1hd3ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNTA1NjAsImV4cCI6MjA3NjcyNjU2MH0.V3qRHGXBMlspRS7XFJlXdo4qIcCms60Nepp7dYMEjLA";

type SessionType = "intro" | "mock" | "bundle";
type SelectedSession = { dateStr: string; time: string; displayDate: string; iso: string };
type Profile = { id: number; name: string; description: string | null };
type Skill = { id: string; name: string; description: string | null };

const IcoCheck = ({ s = 13, c = WHITE }) => (<Svg width={s} height={s} viewBox="0 0 24 24" fill="none"><Path d="M5 13L9 17L19 7" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></Svg>);
const IcoAlert = ({ s = 15, c = "#EF4444" }) => (<Svg width={s} height={s} viewBox="0 0 24 24" fill="none"><Circle cx="12" cy="12" r="10" stroke={c} strokeWidth="2" /><Path d="M12 8v4M12 16h.01" stroke={c} strokeWidth="2" strokeLinecap="round" /></Svg>);
const IcoArrowLeft = ({ s = 16, c = MUTED }) => (<Svg width={s} height={s} viewBox="0 0 24 24" fill="none"><Path d="M19 12H5M5 12l7 7M5 12l7-7" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></Svg>);
const IcoTarget = ({ s = 20, c = TEAL }) => (<Svg width={s} height={s} viewBox="0 0 24 24" fill="none"><Circle cx="12" cy="12" r="10" stroke={c} strokeWidth="2" /><Circle cx="12" cy="12" r="6" stroke={c} strokeWidth="2" /><Circle cx="12" cy="12" r="2" fill={c} /></Svg>);
const IcoChat = ({ s = 20, c = "#7C3AED" }) => (<Svg width={s} height={s} viewBox="0 0 24 24" fill="none"><Path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></Svg>);
const IcoLayers = ({ s = 20, c = "#D97706" }) => (<Svg width={s} height={s} viewBox="0 0 24 24" fill="none"><Path d="M12 2L2 7l10 5 10-5-10-5z" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><Path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></Svg>);
const IcoChevron = ({ s = 17, c = MUTED, up = false }: any) => (<Svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={up ? ({ transform: [{ rotate: "180deg" }] } as any) : undefined}><Path d="M6 9l6 6 6-6" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></Svg>);
const IcoInfo = ({ s = 16, c = TEAL }: any) => (<Svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><Circle cx="12" cy="12" r="10" /><Path d="M12 16v-4" /><Path d="M12 8h.01" /></Svg>);
const IcoLock = ({ s = 13, c = "#9CA3AF" }: any) => (<Svg width={s} height={s} viewBox="0 0 24 24" fill="none"><Rect x="3" y="11" width="18" height="11" rx="2" stroke={c} strokeWidth="2" /><Path d="M7 11V7a5 5 0 0110 0v4" stroke={c} strokeWidth="2" strokeLinecap="round" /></Svg>);
const IcoCircleCheck = ({ s = 20, c = "#10B981" }: any) => (<Svg width={s} height={s} viewBox="0 0 24 24" fill="none"><Circle cx="12" cy="12" r="10" fill={c} /><Path d="M7 12.5l3.5 3.5 6.5-7" stroke={WHITE} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></Svg>);

function DayCard({ day, isSel, onPress }: { day: DayAvailability; isSel: boolean; onPress: () => void }) {
  const avail = day.slots.filter(sl => sl.isAvailable).length;
  const off = day.isFullDayOff;
  return (
    <TouchableOpacity style={[g.dayCard, isSel && g.dayCardSel, off && g.dayCardOff, !off && avail === 0 && g.dayCardFull]} onPress={onPress} activeOpacity={0.7}>
      <Text style={[g.dayWk, isSel && g.daySelTxt]}>{day.weekdayName}</Text>
      <Text style={[g.dayDt, isSel && g.daySelTxt]}>{day.monthDay}</Text>
      <View style={[g.dot, { backgroundColor: off ? "#EF4444" : avail > 0 ? "#10B981" : "#9CA3AF" }]} />
      <Text style={[g.dayStatus, isSel && g.daySelTxt]}>{off ? "Off" : avail > 0 ? `${avail} open` : "Full"}</Text>
    </TouchableOpacity>
  );
}

function SessionRow({ selected, disabled, onPress, accentColor, icon, label, tag, duration, description, price, badge, showUsed }: any) {
  return (
    <TouchableOpacity
      style={[g.sessionRow, { borderColor: selected ? accentColor : BORDER, backgroundColor: selected ? `${accentColor}08` : WHITE }, disabled && g.sessionRowDim]}
      onPress={onPress} activeOpacity={disabled ? 1 : 0.72}>
      <View style={[g.sessionStripe, { backgroundColor: selected ? accentColor : "transparent" }]} />
      <View style={[g.sessionIcon, { backgroundColor: selected ? `${accentColor}15` : "#F3F4F6" }]}>{icon}</View>
      <View style={g.sessionMid}>
        <View style={g.sessionTopRow}>
          <Text style={[g.sessionLabel, { color: selected ? accentColor : DARK, fontFamily: F }]}>{label}</Text>
          {badge && <View style={[g.sessionPill, { backgroundColor: accentColor }]}><Text style={[g.sessionPillTxt, { fontFamily: F }]}>{badge}</Text></View>}
          {showUsed && <View style={[g.sessionPill, { backgroundColor: "#EF4444" }]}><Text style={[g.sessionPillTxt, { fontFamily: F }]}>USED</Text></View>}
        </View>
        {tag && <Text style={[g.sessionTag, { color: accentColor, fontFamily: F }]}>{tag}</Text>}
        <Text style={[g.sessionDur, { fontFamily: F }]}>{duration}</Text>
        <Text style={[g.sessionDesc, { fontFamily: F }]}>{description}</Text>
      </View>
      <View style={g.sessionRight}>
        <Text style={[g.sessionPrice, { color: selected ? accentColor : DARK, fontFamily: F }]}>{price}</Text>
        <View style={[g.radio, { borderColor: selected ? accentColor : BORDER }]}>
          {selected && <View style={[g.radioDot, { backgroundColor: accentColor }]} />}
        </View>
      </View>
    </TouchableOpacity>
  );
}

function StepHeader({ index, label, subtitle, isOpen, isDone, hasError, onPress }: any) {
  const leftBorder = hasError ? "#EF4444" : isDone ? "#10B981" : isOpen ? TEAL : "transparent";
  const stepNoColor = hasError ? "#EF4444" : isDone ? "#10B981" : isOpen ? TEAL : MUTED;
  const titleColor = hasError ? "#DC2626" : isDone ? "#065F46" : isOpen ? DARK : "#374151";

  return (
    <TouchableOpacity
      style={[g.stepHeaderBtn, { borderLeftColor: leftBorder, backgroundColor: isOpen ? "#FAFFFE" : WHITE }]}
      onPress={onPress} activeOpacity={0.7}>
      <View style={g.stepBtnLeft}>
        <Text style={[g.stepBtnStepNo, { color: stepNoColor, fontFamily: F }]}>STEP {index + 1}</Text>
        <Text style={[g.stepBtnTitle, { color: titleColor, fontFamily: F }]}>{label}</Text>
        {!isOpen && subtitle ? <Text style={[g.stepBtnSub, { fontFamily: F }]} numberOfLines={1}>{subtitle}</Text> : null}
      </View>
      {isDone && !isOpen
        ? <IcoCircleCheck s={22} c="#10B981" />
        : <View style={[g.chevronBox, isOpen && { backgroundColor: TEAL_LT }]}>
            <IcoChevron s={16} c={isOpen ? TEAL : MUTED} up={isOpen} />
          </View>}
    </TouchableOpacity>
  );
}

function BookNowPanel({ sType, price, bundleSave, s1ok, s2ok, s3ok, allOk, tried, onBook, isFreeFounderIntro, paying }: any) {
  const accentColor = !sType ? MUTED : sType === "intro" ? "#7C3AED" : sType === "mock" ? TEAL : "#D97706";
  return (
    <View style={g.bnCard}>
      <View style={[g.bnTypeTag, { backgroundColor: `${accentColor}12`, borderColor: `${accentColor}30` }]}>
        <View style={[g.bnTypeDot, { backgroundColor: accentColor }]} />
        <Text style={[g.bnTypeLabel, { color: accentColor, fontFamily: F }]}>
          {!sType ? "No Session Selected" : sType === "intro" ? "Intro Call · 25 min" : sType === "mock" ? "Mock Interview · 55 min" : "Prep Course · 3 × 55 min"}
        </Text>
      </View>
      <View style={g.bnPriceRow}>
        <Text style={[g.bnPrice, { fontFamily: F }]}>{!sType ? "Rs -" : isFreeFounderIntro ? "FREE" : `₹${price.toLocaleString()}`}</Text>
        {sType === "bundle" && bundleSave > 0 && (
          <View style={g.bnSavePill}><Text style={[g.bnSaveTxt, { fontFamily: F }]}>Save ₹{bundleSave.toLocaleString()}</Text></View>
        )}
      </View>
      <Text style={[g.bnPriceSub, { fontFamily: F }]}>
        {!sType ? "Select a session type to view price" : sType === "intro" ? "One-time only · per mentor" : sType === "mock" ? "Single skill session" : "3 full mock interviews"}
      </Text>
      <View style={g.bnDivider} />
      <View style={g.bnChecklist}>
        {[
          { label: "Session type", done: s1ok },
          { label: "Topic & skill", done: s2ok },
          { label: "Date & time", done: s3ok },
        ].map((item, i) => (
          <View key={i} style={g.bnCheckRow}>
            <View style={[g.bnCheckDot, { backgroundColor: item.done ? "#10B981" : "#E5E7EB" }]}>
              {item.done && <IcoCheck s={9} c={WHITE} />}
            </View>
            <Text style={[g.bnCheckTxt, { color: item.done ? "#065F46" : MUTED, fontFamily: F }]}>{item.label}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[g.bnBtn, { backgroundColor: paying ? "#9CA3AF" : allOk ? TEAL : "#9CA3AF" }]}
        onPress={onBook} activeOpacity={0.82}
        disabled={paying}
      >
        {paying
          ? <ActivityIndicator color={WHITE} />
          : <Text style={[g.bnBtnTxt, { fontFamily: F }]}>
              {allOk ? (isFreeFounderIntro ? "Book Free Session →" : `Pay ₹${price.toLocaleString()} →`) : "Book Now"}
            </Text>}
      </TouchableOpacity>

      {tried && !allOk && (
        <View style={g.bnWarn}>
          <IcoAlert s={14} c="#D97706" />
          <Text style={[g.bnWarnTxt, { fontFamily: F }]}>Complete all steps above to continue</Text>
        </View>
      )}
      {!isFreeFounderIntro && (
        <View style={g.trustRow}>
          <IcoLock s={12} c="#9CA3AF" />
          <Text style={[g.trustTxt, { fontFamily: F }]}>Payments secured by Razorpay</Text>
        </View>
      )}
      {allOk && (
        <View style={{ marginTop: 12, backgroundColor: "#F0FDFA", borderRadius: 10, padding: 12, borderWidth: 1, borderColor: "#CCFBF1" }}>
          <Text style={{ fontFamily: F, fontSize: 12, color: "#0F766E", lineHeight: 18, fontWeight: "600" }}>
            ✅ What happens next
          </Text>
          <Text style={{ fontFamily: F, fontSize: 12, color: "#0F766E", lineHeight: 18, marginTop: 4 }}>
            After payment, you'll receive a confirmation email with your session link and details. Your mentor will join at the scheduled time.
          </Text>
        </View>
      )}
    </View>
  );
}

export default function CandidateMentorDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 960;
  const scrollRef = useRef<ScrollView>(null);

  const [loading, setLoading] = useState(true);
  const [mentor, setMentor] = useState<any>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loadingSk, setLSk] = useState(false);
  const [mockPrice, setMockP] = useState(0);
  const [bioExp, setBioExp] = useState(false);

  const [sType, setSType] = useState<SessionType | null>(null);
  const [profId, setProfId] = useState<number | null>(null);
  const [skill, setSkill] = useState<Skill | null>(null);
  const [bundleMode, setBundleMode] = useState<"intro" | "custom">("intro");
  const [bundleSkills, setBundleSkills] = useState<Skill[]>([]);
  const [jdText, setJdText] = useState("");
  const [jdErr, setJdErr] = useState("");
  const [introUsed, setIUsed] = useState(false);

  const [avail, setAvail] = useState<DayAvailability[]>([]);
  const [availL, setAvailL] = useState(false);
  const [selDay, setSelDay] = useState<DayAvailability | null>(null);
  const [selSlot, setSelSlot] = useState<SelectedSession | null>(null);
  const [selSlots, setSelSlots] = useState<SelectedSession[]>([]);

  const authStore = useAuthStore();
  const [uid, setUid] = useState<string | null>(authStore.user?.id || null);
  const [openStep, setOpenStep] = useState<number>(0);
  const [tried, setTried] = useState(false);
  const [paying, setPaying] = useState(false);
  const isProcessingRef = useRef(false);

  useEffect(() => { fetchMentor(); initAuth(); }, [id]);
  useEffect(() => { if (profId && (sType === "mock" || sType === "bundle")) fetchSkills(); else { setSkills([]); setSkill(null); } }, [profId, sType]);
  useEffect(() => { setSelSlot(null); setSelSlots([]); setSelDay(null); setSkill(null); setBundleMode("intro"); setBundleSkills([]); }, [sType]);
  useEffect(() => { if (profiles.length === 1 && !profId) setProfId(profiles[0].id); }, [profiles]);
  useEffect(() => { if (openStep === 2 && avail.length === 0) availabilityService.cleanupExpiredSessions().then(() => fetchAvail()); }, [openStep]);

  const initAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) setUid(session.user.id);
  };

  const fetchMentor = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const r1 = await fetch(`${SUPABASE_URL}/rest/v1/mentors?select=*,tier,profiles(full_name)&id=eq.${id}&status=eq.approved&limit=1`, { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } });
      const d1 = await r1.json();
      if (d1?.length) {
        const m = d1[0];
        setMentor(m);
        const base = m.session_price_inr || 1000;
        const r2 = await fetch(`${SUPABASE_URL}/rest/v1/mentor_tiers?select=percentage_cut&tier=eq.${m.tier || "bronze"}&limit=1`, { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } });
        const d2 = await r2.json();
        const cut = d2?.[0]?.percentage_cut || 50;
        setMockP(Math.round(base / (1 - cut / 100)));
        if (m.profile_ids?.length) {
          const r3 = await fetch(`${SUPABASE_URL}/rest/v1/interview_profiles_admin?select=id,name,description&id=in.(${m.profile_ids.join(",")})&order=name`, { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } });
          setProfiles((await r3.json()) || []);
        }
      }
    } catch (e) {} finally { setLoading(false); }
  };

  const checkIntro = useCallback(async () => {
    if (!uid || !id) return;
    try {
      const { data } = await supabase.from("interview_sessions").select("id").eq("candidate_id", uid).eq("mentor_id", id).eq("session_type", "intro").in("status", ["pending", "confirmed", "completed"]).limit(1);
      const used = !!(data?.length);
      setIUsed(used);
      if (used) setSType(prev => prev === "intro" ? "mock" : prev);
    } catch {}
  }, [uid, id]);
  useEffect(() => { checkIntro(); }, [checkIntro]);

  const fetchSkills = async () => {
    if (!profId) return;
    setLSk(true);
    try {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/interview_skills_admin?select=id,name,description&interview_profile_id=eq.${profId}&order=name`, { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } });
      setSkills((await r.json()) || []);
    } catch (e) {} finally { setLSk(false); }
  };

  const fetchAvail = useCallback(async () => {
    if (!id) return;
    setAvailL(true);
    try {
      const days = await availabilityService.generateAvailability(id as string);
      setAvail(days);
      if (selDay) { const s = days.find(d => d.dateStr === selDay.dateStr); if (s) setSelDay(s); }
      else { const f = days.find(d => !d.isFullDayOff && d.slots.some(sl => sl.isAvailable)); if (f) setSelDay(f); }
    } catch (e) {} finally { setAvailL(false); }
  }, [id, selDay]);

  const introPrice = Math.round(mockPrice * 0.20);
  const bundlePrice = Math.round(mockPrice * 2.5);
  const bundleSave = Math.round(mockPrice * 3 - bundlePrice);

  const FOUNDER_MENTOR_ID = "e251486e-c21a-49f4-8ab7-ce808785638a";
  const isFreeFounderIntro = id === FOUNDER_MENTOR_ID && sType === "intro";
  const price = !sType ? 0 : isFreeFounderIntro ? 0 : sType === "intro" ? introPrice : sType === "mock" ? mockPrice : bundlePrice;

  const isJD = sType === "mock"
    ? !!skill?.name.toLowerCase().includes("jd-based")
    : sType === "bundle" && bundleMode === "custom"
      ? bundleSkills.some(sk => sk.name.toLowerCase().includes("jd-based"))
      : false;

  const effPID = profId || (profiles.length > 0 ? profiles[0].id : null);
  const s1ok = !!sType && !(sType === "intro" && introUsed);
  const s2ok = !sType ? false : sType === "intro" ? true : sType === "mock" ? !!(profId && skill && (!isJD || jdText.trim().length >= 50)) : sType === "bundle" ? (bundleMode === "intro" || (bundleSkills.length === 3 && (!isJD || jdText.trim().length >= 50))) : false;
  const s3ok = !sType ? false : sType === "bundle" ? selSlots.length === 3 : !!selSlot;
  const allOk = s1ok && s2ok && s3ok;
  const firstBad = !s1ok ? 0 : !s2ok ? 1 : !s3ok ? 2 : -1;

  const handleSlot = (time: string) => {
    if (!selDay) return;
    const sl = selDay.slots.find(sl => sl.time === time);
    if (!sl?.isAvailable) return;
    const iso = sl.dateTime.toISO()!;
    if (sType === "bundle") {
      const idx = selSlots.findIndex(s => s.iso === iso);
      if (idx >= 0) { setSelSlots(p => p.filter((_, i) => i !== idx)); return; }
      if (selSlots.length >= 3) { Alert.alert("3 slots max", "Remove a slot first."); return; }
      setSelSlots(p => [...p, { dateStr: selDay.dateStr, time, displayDate: selDay.monthDay, iso }]);
    } else {
      setSelSlot({ dateStr: selDay.dateStr, time, displayDate: selDay.monthDay, iso });
    }
  };

  const triggerPayment = async (candidateId: string) => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;
    setPaying(true);
    try {
      if (!sType) throw new Error("Please select a session type.");
      const finalSlotsIso = sType === "bundle" ? selSlots.map(s => s.iso) : [selSlot!.iso];
      const skIds = sType === "bundle"
        ? (bundleMode === "intro" ? ["", "", ""] : bundleSkills.map(sk => sk.id))
        : (sType === "mock" && skill?.id ? [skill.id] : []);

      const { package: pkg, amount, orderId, keyId, error } = await paymentService.createPackage(
        candidateId, id as string, effPID as number,
        skIds, finalSlotsIso, sType,
        isJD && jdText ? jdText.trim() : undefined,
      );

      if (error || !pkg) throw new Error(error?.message || "Failed to initialise payment.");

      if (pkg.payment_status === "pending") {
        router.replace({
          pathname: "/candidate/pgscreen",
          params: {
            packageId: pkg.id, amount: amount?.toString(), orderId, keyId,
            mentorId: id, profileId: effPID?.toString() || "",
            skillId: skill?.id || "", skillName: skill?.name || "",
            sessionType: sType, isNewGuest: "false",
          },
        });
      } else {
        router.replace("/candidate/bookings");
      }
    } catch (err: any) {
      Alert.alert("Booking Error", err.message || "Something went wrong. Please try again.");
      setPaying(false);
      isProcessingRef.current = false;
    }
  };

  const handleBookNow = () => {
    setTried(true);
    if (!allOk && firstBad !== -1) {
      setOpenStep(firstBad);
      setTimeout(() => scrollRef.current?.scrollTo({ y: 500, animated: true }), 120);
      return;
    }
    if (!uid) return;
    triggerPayment(uid);
  };

  if (loading) return <View style={g.page}><ActivityIndicator size="large" color={TEAL} style={{marginTop: 50}} /></View>;
  if (!mentor) return <View style={g.page}><Text style={{ fontFamily: F, textAlign: 'center', marginTop: 50 }}>Mentor not found</Text></View>;

  const seed = mentor.id || mentor.profiles?.full_name || 'Mentor';
  const fallbackAvatar = `https://api.dicebear.com/9.x/micah/png?seed=${encodeURIComponent(seed)}&backgroundColor=e5e7eb,f3f4f6`;
  const avatarSource = mentor.avatar_url || fallbackAvatar;

  const tabSubs = [
    !sType ? "Select session type" : sType === "intro" ? "Intro Call — 25 min" : sType === "mock" ? "Mock Interview — 55 min" : "Prep Course — 3 × 55 min",
    !sType || sType === "intro" ? "Not required" : sType === "mock" ? (skill ? skill.name : profId ? (profiles.find(p => p.id === profId)?.name || "") : "") : (bundleMode === "intro" ? "Based on Intro Call" : `${bundleSkills.length}/3 topics selected`),
    sType === "bundle" ? (selSlots.length === 3 ? selSlots.map(sl => sl.time).join(" · ") : `${selSlots.length}/3 slots chosen`) : (selSlot ? `${selSlot.time} · ${selSlot.displayDate}` : ""),
  ];

  const bnProps = { sType, price, bundleSave, s1ok, s2ok, s3ok, allOk, tried, onBook: handleBookNow, isFreeFounderIntro, paying };

  return (
    <View style={g.page}>
      <View style={[g.outerRow, isDesktop ? g.outerRowDesktop : g.outerRowMobile]}>
        <ScrollView ref={scrollRef} style={g.leftScroll} contentContainerStyle={g.leftContent} showsVerticalScrollIndicator={false}>
          
          <TouchableOpacity style={g.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <IcoArrowLeft s={15} c={MUTED} /><Text style={[g.backTxt, { fontFamily: F }]}>Back</Text>
          </TouchableOpacity>

          <View style={g.mentorCard}>
            <View style={g.mentorTop}>
              <View>
                <Image source={{ uri: avatarSource }} style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: "#F3F4F6" }} />
                <View style={g.verDot}><IcoCheck s={8} /></View>
              </View>
              <View style={g.mentorInfo}>
                <Text style={[g.mentorTitle, { fontFamily: F }]} numberOfLines={2}>{mentor.professional_title || "Interview Mentor"}</Text>
                <View style={g.statsRow}>
                  {!!mentor.years_of_experience && <View style={g.stat}><Text style={[g.statTxt, { fontFamily: F }]}>🕐 {mentor.years_of_experience}y exp</Text></View>}
                  {!!mentor.total_sessions && <View style={g.stat}><Text style={[g.statTxt, { fontFamily: F }]}>🎯 {mentor.total_sessions} sessions</Text></View>}
                </View>
              </View>
            </View>
            {mentor.experience_description ? (
              <View style={g.bioWrap}>
                <Text style={[g.bioLabel, { fontFamily: F }]}>ABOUT ME</Text>
                <Text style={[g.bioTxt, { fontFamily: F }]} numberOfLines={bioExp ? undefined : 4}>{mentor.experience_description}</Text>
                {mentor.experience_description.length > 180 && (
                  <TouchableOpacity onPress={() => setBioExp(e => !e)} style={{ marginTop: 8 }}>
                    <Text style={[g.readMore, { fontFamily: F }]}>{bioExp ? "Read less ↑" : "Read more ↓"}</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : null}
          </View>

          <View style={g.stepsHeaderRow}>
            <Text style={[g.sectionHeader, { fontFamily: F }]}>Book your session</Text>
            <Text style={[g.sectionSub, { fontFamily: F }]}>Review and confirm your selected slots below.</Text>
          </View>

          <View style={g.stepsContainer}>
            {/* STEP 1 */}
            <View style={[g.stepCard, openStep === 0 && g.stepCardOpen]}>
              <StepHeader index={0} label="Session Type" subtitle={tabSubs[0]} isOpen={openStep === 0} isDone={s1ok && openStep !== 0} hasError={tried && !s1ok} onPress={() => setOpenStep(p => p === 0 ? -1 : 0)} />
              {openStep === 0 && (
                <View style={g.stepPanel}>
                  <SessionRow selected={sType === "mock"} onPress={() => setSType("mock")} accentColor={TEAL} icon={<IcoTarget s={20} c={sType === "mock" ? TEAL : "#9CA3AF"} />} label="Mock Interview" duration="55 minutes" badge="POPULAR" description="The real deal. A full mock interview on the topic of your choice or based on a JD you're prepping for — going in-depth, guiding through solutions and giving real-time feedback." price={`₹${mockPrice.toLocaleString()}`} />
                  <SessionRow selected={sType === "intro"} disabled={introUsed} onPress={() => !introUsed && setSType("intro")} accentColor="#7C3AED" icon={<IcoChat s={20} c={sType === "intro" ? "#7C3AED" : "#9CA3AF"} />} label="Intro Call" duration="25 minutes" tag="One per mentor · Recommended before Prep Course" description="A mini mock interview to test your strengths and weaknesses and recommend a personalised plan for improvement." price={id === FOUNDER_MENTOR_ID ? "FREE" : `₹${introPrice.toLocaleString()}`} showUsed={introUsed} />
                  <SessionRow selected={sType === "bundle"} onPress={() => setSType("bundle")} accentColor="#D97706" icon={<IcoLayers s={20} c={sType === "bundle" ? "#D97706" : "#9CA3AF"} />} label="Prep Course" duration="3 × 55 minutes" description="A full 3-session package tailored to your strengths and weaknesses — based on your Intro Call, a JD you're targeting, or a chosen topic." price={`₹${bundlePrice.toLocaleString()}`} badge={bundleSave > 0 ? `SAVE ₹${bundleSave.toLocaleString()}` : undefined} />
                  <TouchableOpacity style={[g.nextBtn, (!sType || (sType === "intro" && introUsed)) && g.nextBtnOff]} onPress={() => sType && !(sType === "intro" && introUsed) && setOpenStep(1)}>
                    <Text style={[g.nextBtnTxt, { fontFamily: F }]}>Continue →</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* STEP 2 */}
            <View style={[g.stepCard, openStep === 1 && g.stepCardOpen, tried && !s2ok && (sType === "mock" || sType === "bundle") && g.stepCardErr]}>
              <StepHeader index={1} label="Topic & Skill" subtitle={tabSubs[1]} isOpen={openStep === 1} isDone={s2ok && openStep !== 1} hasError={tried && !s2ok && (sType === "mock" || sType === "bundle")} onPress={() => setOpenStep(p => p === 1 ? -1 : 1)} />
              {openStep === 1 && (
                <View style={g.stepPanel}>
                  {sType === "intro" ? (
                    <View style={g.naWrap}>
                      <Text style={g.naEmoji}>💬</Text>
                      <Text style={[g.naTitle, { fontFamily: F }]}>Your mentor sets the agenda</Text>
                      <TouchableOpacity style={[g.nextBtn, { marginTop: 16 }]} onPress={() => setOpenStep(2)}><Text style={[g.nextBtnTxt, { fontFamily: F }]}>Continue →</Text></TouchableOpacity>
                    </View>
                  ) : (
                    <>
                      {sType === "bundle" && (
                        <View style={{ marginBottom: 20 }}>
                          <Text style={[g.hint, { fontFamily: F, color: DARK, fontWeight: "700", marginBottom: 12 }]}>Prep Course Curriculum</Text>
                          <View style={{ flexDirection: "row", gap: 10 }}>
                            <TouchableOpacity style={[g.tag, bundleMode === "intro" && g.tagOn]} onPress={() => setBundleMode("intro")}>
                              {bundleMode === "intro" && <IcoCheck s={13} />}
                              <Text style={[g.tagTxt, bundleMode === "intro" && g.tagTxtOn, { fontFamily: F }]}>Based on Intro Call</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[g.tag, bundleMode === "custom" && g.tagOn]} onPress={() => setBundleMode("custom")}>
                              {bundleMode === "custom" && <IcoCheck s={13} />}
                              <Text style={[g.tagTxt, bundleMode === "custom" && g.tagTxtOn, { fontFamily: F }]}>Custom Topics</Text>
                            </TouchableOpacity>
                          </View>
                          {bundleMode === "intro" && (
                            <Text style={{ fontFamily: F, color: MUTED, fontSize: 13, marginTop: 12, lineHeight: 20 }}>
                              Your mentor will plan the curriculum for your 3 sessions based on the areas identified in your Intro Call.
                            </Text>
                          )}
                        </View>
                      )}

                      {(sType === "mock" || (sType === "bundle" && bundleMode === "custom")) && (
                        <>
                          <View style={g.tags}>
                            {profiles.map(p => {
                              const on = profId === p.id;
                              return (<TouchableOpacity key={p.id} style={[g.tag, on && g.tagOn]} onPress={() => { setLSk(true); setSkills([]); setProfId(p.id); setSkill(null); setBundleSkills([]); }}>{on && <IcoCheck s={13} />}<Text style={[g.tagTxt, on && g.tagTxtOn, { fontFamily: F }]}>{p.name}</Text></TouchableOpacity>);
                            })}
                          </View>
                          {profId && (
                            <View style={g.skillSec}>
                              {loadingSk ? <ActivityIndicator size="small" color={TEAL} /> : skills.length > 0 ? (
                                <>
                                  <Text style={[g.hint, { fontFamily: F }]}>
                                    {sType === "bundle" ? "Select 3 topics (you can select the same topic multiple times)" : "Select a skill to practice"}
                                  </Text>

                                  {sType === "bundle" && bundleSkills.length > 0 && (
                                    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16, padding: 12, backgroundColor: TEAL_LT, borderRadius: 12, borderWidth: 1, borderColor: "#CCFBF1" }}>
                                      {bundleSkills.map((sk, i) => (
                                        <TouchableOpacity key={i} style={[g.tag, g.tagOn, { paddingVertical: 6, paddingHorizontal: 12 }]} onPress={() => setBundleSkills(p => p.filter((_, idx) => idx !== i))}>
                                          <Text style={[g.tagTxt, g.tagTxtOn, { fontSize: 12, fontFamily: F }]}>{i+1}. {sk.name} ✕</Text>
                                        </TouchableOpacity>
                                      ))}
                                      {bundleSkills.length < 3 && (
                                        <Text style={{ fontFamily: F, color: "#0F766E", fontSize: 13, alignSelf: "center", marginLeft: 4, fontWeight: "600" }}>Select {3 - bundleSkills.length} more...</Text>
                                      )}
                                    </View>
                                  )}

                                  <View style={g.tags}>
                                    {skills.map(sk => {
                                      const on = sType === "mock" && skill?.id === sk.id;
                                      const jd = sk.name.toLowerCase().includes("jd-based");
                                      return (
                                        <TouchableOpacity key={sk.id}
                                          style={[g.tag, on && (jd ? g.tagJDOn : g.tagSkOn), jd && !on && g.tagJD, (sType === "bundle" && bundleSkills.length >= 3) && { opacity: 0.5 }]}
                                          disabled={sType === "bundle" && bundleSkills.length >= 3}
                                          onPress={() => {
                                            if (sType === "mock") setSkill(sk);
                                            else if (sType === "bundle" && bundleSkills.length < 3) setBundleSkills(p => [...p, sk]);
                                          }}>
                                          {jd && <Text style={{ fontSize: 12 }}>📄</Text>}
                                          <Text style={[g.tagTxt, on && g.tagTxtOn, { fontFamily: F }]}>{sk.name}</Text>
                                        </TouchableOpacity>
                                      );
                                    })}
                                  </View>

                                  {(skill || (sType === "bundle" && bundleSkills.length > 0)) && (
                                    <View style={[g.skillDescBox, isJD && g.jdBox]}>
                                      <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 8 }}>
                                        <IcoInfo s={18} c={isJD ? "#4C1D95" : TEAL} />
                                        <Text style={[g.skillDescTxt, isJD && { color: "#4C1D95" }, { fontFamily: F, flex: 1 }]}>
                                          {sType === "mock" ? skill?.description : "You have selected custom topics for your 3 sessions."}
                                        </Text>
                                      </View>
                                      {isJD && (
                                        <View style={{ marginTop: 16 }}>
                                          <Text style={[g.jdLabel, { fontFamily: F }]}>Paste the Job Description</Text>
                                          <TextInput
                                            style={[g.jdInput, jdErr && g.jdInputErr]} multiline numberOfLines={4}
                                            placeholder="Paste the full job description here (min 50 chars)..."
                                            value={jdText} onChangeText={t => { setJdText(t); if (jdErr) setJdErr(""); }}
                                            textAlignVertical="top" />
                                          {jdErr ? <Text style={[g.jdErr, { fontFamily: F }]}>{jdErr}</Text> : null}
                                        </View>
                                      )}
                                    </View>
                                  )}
                                </>
                              ) : <Text style={{ fontFamily: F, color: MUTED }}>No skills found.</Text>}
                            </View>
                          )}
                        </>
                      )}
                      {s2ok && <TouchableOpacity style={[g.nextBtn, { marginTop: 16 }]} onPress={() => setOpenStep(2)}><Text style={[g.nextBtnTxt, { fontFamily: F }]}>Continue →</Text></TouchableOpacity>}
                    </>
                  )}
                </View>
              )}
            </View>

            {/* STEP 3 */}
            <View style={[g.stepCard, openStep === 2 && g.stepCardOpen, tried && !s3ok && g.stepCardErr]}>
              <StepHeader index={2} label="Date & Time" subtitle={tabSubs[2]} isOpen={openStep === 2} isDone={s3ok && openStep !== 2} hasError={tried && !s3ok} onPress={() => { if (openStep !== 2 && avail.length === 0) availabilityService.cleanupExpiredSessions().then(() => fetchAvail()); setOpenStep(p => p === 2 ? -1 : 2); }} />
              {openStep === 2 && (
                <View style={[g.stepPanel, { paddingBottom: 24 }]}>
                  {availL ? <ActivityIndicator size="small" color={TEAL} /> : (
                    <>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 4, marginBottom: 16 }}>
                        {avail.map(day => (<DayCard key={day.dateStr} day={day} isSel={selDay?.dateStr === day.dateStr} onPress={() => { setSelDay(day); if (sType !== "bundle") setSelSlot(null); }} />))}
                      </ScrollView>
                      {!selDay || selDay.isFullDayOff ? (
                        <View style={g.emptyState}><Text style={{ color: selDay?.isFullDayOff ? "#EF4444" : "#999", fontFamily: F }}>{selDay?.isFullDayOff ? "Mentor unavailable this day." : "No slots for this day."}</Text></View>
                      ) : avail.length > 0 && avail.every(d => d.isFullDayOff || d.slots.every(sl => !sl.isAvailable)) ? (
                        <View style={[g.emptyState, { gap: 12 }]}>
                          <Text style={{ fontSize: 32 }}>😔</Text>
                          <Text style={{ fontFamily: F, fontSize: 15, fontWeight: "700", color: "#374151", textAlign: "center" }}>No available slots right now</Text>
                          <Text style={{ fontFamily: F, fontSize: 13, color: MUTED, textAlign: "center", lineHeight: 20 }}>This mentor hasn't opened any slots yet. Try another mentor — they may have immediate availability.</Text>
                          <TouchableOpacity
                            style={{ backgroundColor: TEAL, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 24, marginTop: 4 }}
                            onPress={() => router.back()}
                            activeOpacity={0.8}
                          >
                            <Text style={{ fontFamily: F, color: "#fff", fontWeight: "700", fontSize: 14 }}>Browse Other Mentors</Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View style={g.slotGrid}>
                          {selDay.slots.map(sl => {
                            const iso = sl.dateTime.toISO()!;
                            const bIdx = sType === "bundle" ? selSlots.findIndex(x => x.iso === iso) : -1;
                            const on = sType === "bundle" ? bIdx >= 0 : selSlot?.time === sl.time && selSlot?.dateStr === selDay.dateStr;
                            return (
                              <TouchableOpacity key={`${selDay.dateStr}-${sl.time}`} style={[g.slot, !sl.isAvailable && g.slotOff, on && g.slotOn]} disabled={!sl.isAvailable} onPress={() => handleSlot(sl.time)}>
                                <Text style={[g.slotTxt, { fontFamily: F }, !sl.isAvailable && g.slotTxtOff, on && g.slotTxtOn]}>{sl.time}</Text>
                                {sType === "bundle" && bIdx >= 0 && <Text style={[g.slotIdx, { fontFamily: F }]}>{bIdx + 1}</Text>}
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      )}
                    </>
                  )}
                </View>
              )}
            </View>

          </View>
          {!isDesktop && <BookNowPanel {...bnProps} />}
        </ScrollView>
        {isDesktop && <View style={g.rightCol}><View style={Platform.OS === "web" ? ({ position: "sticky", top: 24 } as any) : undefined}><BookNowPanel {...bnProps} /></View></View>}
      </View>
    </View>
  );
}

const g = StyleSheet.create({
  page: { flex: 1, backgroundColor: BG_CREAM },
  outerRow: { flex: 1, flexDirection: "row", maxWidth: 1200, alignSelf: "center", width: "100%" },
  outerRowDesktop: { paddingHorizontal: 20 },
  outerRowMobile: { paddingHorizontal: 0 },
  leftScroll: { flex: 1 },
  leftContent: { padding: 20, gap: 16, paddingBottom: 60 },
  rightCol: { width: 380, paddingTop: 20, paddingRight: 20 },

  backBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 7, paddingHorizontal: 13, borderRadius: 100, backgroundColor: WHITE, borderWidth: 1, borderColor: BORDER, alignSelf: "flex-start" },
  backTxt: { fontSize: 13, fontWeight: "600", color: MUTED },

  mentorCard: { backgroundColor: WHITE, borderRadius: 18, borderWidth: 1, borderColor: BORDER, overflow: "hidden" },
  mentorTop: { flexDirection: "row", alignItems: "center", gap: 16, padding: 20 },
  verDot: { position: "absolute", bottom: 0, right: 0, width: 20, height: 20, borderRadius: 10, backgroundColor: "#10B981", borderWidth: 2.5, borderColor: WHITE, alignItems: "center", justifyContent: "center" },
  mentorInfo: { flex: 1 },
  mentorTitle: { fontSize: 18, fontWeight: "800", color: DARK, marginBottom: 8 },
  statsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  stat: { flexDirection: "row", alignItems: "center", backgroundColor: "#F9FAFB", paddingHorizontal: 8, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: BORDER },
  statTxt: { fontSize: 11, fontWeight: "600", color: "#374151" },
  bioWrap: { borderTopWidth: 1, borderTopColor: "#F3F4F6", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 },
  bioLabel: { fontSize: 11, fontWeight: "800", color: MUTED, letterSpacing: 0.5, marginBottom: 8 },
  bioTxt: { fontSize: 14, color: "#4B5563", lineHeight: 22 },
  readMore: { fontSize: 13, fontWeight: "700", color: TEAL },

  stepsHeaderRow: { marginTop: 4 },
  sectionHeader: { fontSize: 22, fontWeight: "800", color: DARK },
  sectionSub: { fontSize: 13, color: MUTED, marginTop: 4, lineHeight: 20 },
  stepsContainer: { gap: 10 },

  stepCard: { backgroundColor: WHITE, borderRadius: 16, borderWidth: 1, borderColor: BORDER, overflow: "hidden" },
  stepCardOpen: { borderColor: TEAL, borderWidth: 1.5 },
  stepCardErr: { borderColor: "#EF4444" },

  stepHeaderBtn: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 20, paddingVertical: 18, gap: 12,
    borderLeftWidth: 4, borderLeftColor: "transparent",
  },
  stepBtnLeft: { flex: 1 },
  stepBtnStepNo: { fontSize: 10, fontWeight: "700", letterSpacing: 1.4, marginBottom: 3, textTransform: "uppercase" },
  stepBtnTitle: { fontSize: 16, fontWeight: "700", lineHeight: 22 },
  stepBtnSub: { fontSize: 13, color: MUTED, marginTop: 3, fontWeight: "500" },
  chevronBox: { width: 32, height: 32, borderRadius: 8, backgroundColor: "#F3F4F6", alignItems: "center", justifyContent: "center" },

  stepPanel: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 20, backgroundColor: "#FAFAFA", borderTopWidth: 1, borderTopColor: BORDER },

  sessionRow: { flexDirection: "row", alignItems: "center", borderRadius: 12, borderWidth: 1.5, marginBottom: 10, overflow: "hidden" },
  sessionRowDim: { opacity: 0.4 },
  sessionStripe: { width: 5, alignSelf: "stretch" },
  sessionIcon: { width: 44, height: 44, borderRadius: 10, alignItems: "center", justifyContent: "center", margin: 12 },
  sessionMid: { flex: 1, paddingVertical: 14, paddingRight: 4 },
  sessionTopRow: { flexDirection: "row", alignItems: "center", gap: 7, flexWrap: "wrap", marginBottom: 2 },
  sessionLabel: { fontSize: 15, fontWeight: "700" },
  sessionTag: { fontSize: 11, fontWeight: "600", marginBottom: 4, marginTop: 1 },
  sessionPill: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 20 },
  sessionPillTxt: { fontSize: 9, fontWeight: "800", color: WHITE, letterSpacing: 0.3 },
  sessionDur: { fontSize: 12, color: MUTED, fontWeight: "600", marginBottom: 4 },
  sessionDesc: { fontSize: 13, color: "#4B5563", lineHeight: 19 },
  sessionRight: { alignItems: "center", gap: 8, paddingHorizontal: 16, paddingVertical: 14 },
  sessionPrice: { fontSize: 17, fontWeight: "800" },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  radioDot: { width: 10, height: 10, borderRadius: 5 },

  nextBtn: { backgroundColor: TEAL, borderRadius: 10, paddingVertical: 14, alignItems: "center", marginTop: 10 },
  nextBtnOff: { backgroundColor: "#D1D5DB" },
  nextBtnTxt: { fontSize: 15, fontWeight: "700", color: WHITE, letterSpacing: 0.3 },

  naWrap: { alignItems: "center", gap: 8, paddingVertical: 20, backgroundColor: WHITE, borderRadius: 12, borderWidth: 1, borderColor: BORDER },
  naEmoji: { fontSize: 40 },
  naTitle: { fontSize: 16, fontWeight: "700", color: "#374151" },

  tags: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
  tag: { flexDirection: "row", alignItems: "center", backgroundColor: WHITE, borderWidth: 1.5, borderColor: BORDER, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 100, gap: 6 },
  tagOn: { backgroundColor: TEAL, borderColor: TEAL },
  tagSkOn: { backgroundColor: "#059669", borderColor: "#059669" },
  tagJD: { borderColor: "#7C3AED", borderStyle: "dashed" as any },
  tagJDOn: { backgroundColor: "#7C3AED", borderColor: "#7C3AED", borderStyle: "solid" as any },
  tagTxt: { fontSize: 14, color: "#374151", fontWeight: "600" },
  tagTxtOn: { color: WHITE, fontWeight: "700" },

  skillSec: { paddingTop: 16, borderTopWidth: 1, borderTopColor: BORDER, marginTop: 12 },
  hint: { fontSize: 13, color: MUTED, marginBottom: 8, fontWeight: "600" },
  skillDescBox: { backgroundColor: "#F0FDFA", borderRadius: 12, padding: 16, borderWidth: 1, borderColor: "#CCFBF1", marginTop: 16 },
  skillDescTxt: { fontSize: 14, color: "#0F766E", lineHeight: 22, fontWeight: "500" },
  jdBox: { backgroundColor: "#F5F3FF", borderColor: "#DDD6FE" },
  jdLabel: { fontSize: 14, fontWeight: "800", color: "#4C1D95", marginBottom: 8 },
  jdInput: { backgroundColor: WHITE, borderWidth: 1, borderColor: "#DDD6FE", borderRadius: 8, padding: 14, fontSize: 14, color: DARK, minHeight: 120 },
  jdInputErr: { borderColor: "#EF4444" },
  jdErr: { fontSize: 13, color: "#EF4444", marginTop: 6 },

  dayCard: { width: 68, height: 86, backgroundColor: WHITE, borderRadius: 12, borderWidth: 1, borderColor: BORDER, alignItems: "center", justifyContent: "center", padding: 4 },
  dayCardSel: { borderColor: TEAL, backgroundColor: TEAL_LT, borderWidth: 2 },
  dayCardOff: { backgroundColor: "#FEF2F2", borderColor: "#FECACA" },
  dayCardFull: { opacity: 0.6, backgroundColor: "#F3F4F6" },
  dayWk: { fontSize: 11, color: MUTED, marginBottom: 2, fontWeight: "500" },
  dayDt: { fontSize: 14, fontWeight: "800", color: DARK, marginBottom: 5 },
  dayStatus: { fontSize: 10, color: "#666", marginTop: 3, fontWeight: "600" },
  daySelTxt: { color: TEAL, fontWeight: "800" },
  dot: { width: 6, height: 6, borderRadius: 3 },

  slotGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  slot: { width: "30%", paddingVertical: 12, borderRadius: 8, borderWidth: 1.5, borderColor: TEAL, backgroundColor: WHITE, alignItems: "center", marginBottom: 4 },
  slotOff: { borderColor: BORDER, backgroundColor: "#F9FAFB", opacity: 0.5 },
  slotOn: { backgroundColor: TEAL, borderColor: TEAL },
  slotTxt: { color: TEAL, fontWeight: "700", fontSize: 14 },
  slotTxtOff: { color: "#CCC" },
  slotTxtOn: { color: WHITE, fontWeight: "800" },
  slotIdx: { position: "absolute", top: 4, right: 6, fontSize: 10, fontWeight: "800", color: "rgba(255,255,255,0.9)" },
  emptyState: { padding: 24, alignItems: "center", borderWidth: 1, borderColor: "#DDD", borderRadius: 12, borderStyle: "dashed" as any, backgroundColor: WHITE },

  bnCard: { backgroundColor: WHITE, borderRadius: 24, borderWidth: 1, borderColor: BORDER, padding: 28 },
  bnTypeTag: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 100, borderWidth: 1, alignSelf: "flex-start", marginBottom: 20 },
  bnTypeDot: { width: 8, height: 8, borderRadius: 4 },
  bnTypeLabel: { fontSize: 12, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.8 },
  bnPriceRow: { flexDirection: "row", alignItems: "flex-end", gap: 12, marginBottom: 6 },
  bnPrice: { fontSize: 48, fontWeight: "800", color: DARK, lineHeight: 52, letterSpacing: -1 },
  bnSavePill: { backgroundColor: "#FEF3C7", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginBottom: 8 },
  bnSaveTxt: { fontSize: 13, fontWeight: "800", color: "#92400E" },
  bnPriceSub: { fontSize: 14, color: MUTED, fontWeight: "600", marginBottom: 24 },
  bnDivider: { height: 1, backgroundColor: BORDER, marginBottom: 20 },
  bnChecklist: { gap: 12, marginBottom: 24 },
  bnCheckRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  bnCheckDot: { width: 24, height: 24, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  bnCheckTxt: { fontSize: 15, fontWeight: "600" },

  bnBtn: { borderRadius: 12, paddingVertical: 18, alignItems: "center", marginBottom: 16 },
  bnBtnTxt: { fontSize: 17, fontWeight: "800", color: WHITE, letterSpacing: 0.4 },
  bnWarn: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#FFFBEB", borderRadius: 10, padding: 12, borderWidth: 1, borderColor: "#FDE68A", marginBottom: 12 },
  bnWarnTxt: { fontSize: 13, color: "#92400E", fontWeight: "600", flex: 1 },
  trustRow: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 6 },
  trustTxt: { fontSize: 12, color: "#9CA3AF", fontWeight: "500" },
});