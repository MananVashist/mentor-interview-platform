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

type SessionType = "mock" | "bundle";
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

// ============================================
// FORMAT NAME HELPER
// ============================================
const formatDisplayName = (fullName?: string | null): string => {
  if (!fullName) return "";
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1][0].toUpperCase()}.`;
};

// ============================================
// DYNAMIC REVIEWS & RATING
// ============================================
type DisplayReview = { id: string; name: string; rating: number; review_text: string | null; created_at: string; };

const SEED_REVIEWS: Record<string, DisplayReview[]> = {
  "9de1e577-d232-4ba9-906f-bd241bbc74c1": [
    { id: "s1a", name: "Ashish Verma",    rating: 5, review_text: "Gave me insight of how to actually prepare for product roles and where to focus on, short comings.", created_at: "2026-03-10T00:00:00Z" },
    { id: "s1b", name: "Sneha E.",        rating: 5, review_text: "Very clear on what was missing. Helped me rethink how I structure metrics questions.", created_at: "2026-03-04T00:00:00Z" },
    { id: "s1c", name: "P K",             rating: 5, review_text: "Nice session. Very helpful.", created_at: "2026-02-25T00:00:00Z" },
    { id: "s1d", name: "Mansi G.",        rating: 5, review_text: null, created_at: "2026-02-18T00:00:00Z" },
    { id: "s1e", name: "S M",             rating: 5, review_text: null, created_at: "2026-02-12T00:00:00Z" },
    { id: "s1f", name: "Abhinav T.",      rating: 5, review_text: null, created_at: "2026-02-05T00:00:00Z" },
    { id: "s1g", name: "Ranveer",         rating: 5, review_text: null, created_at: "2026-01-28T00:00:00Z" },
  ],
  "891f048d-b23d-49a4-b2f7-24b8b027a71a": [
    { id: "s2a", name: "Srinivas Labhala", rating: 5, review_text: "Helped understand what interviewers actually look for. Not just how to answer but how to think.", created_at: "2026-03-12T00:00:00Z" },
    { id: "s2b", name: "A N",             rating: 5, review_text: "Good session. Will book future also.", created_at: "2026-03-05T00:00:00Z" },
    { id: "s2c", name: "Gaurav",          rating: 5, review_text: "Straightforward feedback. No time waste.", created_at: "2026-02-26T00:00:00Z" },
    { id: "s2d", name: "Deepa S.",        rating: 5, review_text: null, created_at: "2026-02-19T00:00:00Z" },
    { id: "s2e", name: "Lalit Panwar",    rating: 5, review_text: null, created_at: "2026-02-11T00:00:00Z" },
    { id: "s2f", name: "R S",             rating: 5, review_text: null, created_at: "2026-02-03T00:00:00Z" },
  ],
  "50381fda-9f95-4075-bad0-d74f101ea5c9": [
    { id: "s3a", name: "Sampath Marrey",  rating: 5, review_text: "She asked things I wasnt prepared for at all. The debrief after made it worth it.", created_at: "2026-03-14T00:00:00Z" },
    { id: "s3b", name: "Rohit Singh",     rating: 5, review_text: "Very senior level session. She point out I am jumping to solution very fast which was my main problem.", created_at: "2026-03-07T00:00:00Z" },
    { id: "s3c", name: "S J B",           rating: 5, review_text: "Good mock interview. Recommend.", created_at: "2026-02-28T00:00:00Z" },
    { id: "s3d", name: "Chinmayi M.",     rating: 5, review_text: null, created_at: "2026-02-20T00:00:00Z" },
    { id: "s3e", name: "Vipin Sharma",    rating: 5, review_text: null, created_at: "2026-02-13T00:00:00Z" },
    { id: "s3f", name: "K T",             rating: 5, review_text: null, created_at: "2026-02-06T00:00:00Z" },
    { id: "s3g", name: "Pranav J.",       rating: 5, review_text: null, created_at: "2026-01-29T00:00:00Z" },
  ],
  "7e78c766-ce02-4baa-a861-d3f690584755": [
    { id: "s4a", name: "Arti",            rating: 5, review_text: "Good mock. He kept the pace realistic and gave clear feedback at the end.", created_at: "2026-03-11T00:00:00Z" },
    { id: "s4b", name: "Pogula Srikar",   rating: 5, review_text: "Blanked on few questions but that showed exactly where my gaps are. Session was eye opening.", created_at: "2026-03-03T00:00:00Z" },
    { id: "s4c", name: "D R",             rating: 5, review_text: "Nice session will book again.", created_at: "2026-02-24T00:00:00Z" },
    { id: "s4d", name: "Kalyani K.",      rating: 5, review_text: null, created_at: "2026-02-16T00:00:00Z" },
    { id: "s4e", name: "Mohammed Nawaz",  rating: 5, review_text: null, created_at: "2026-02-08T00:00:00Z" },
    { id: "s4f", name: "N S",             rating: 5, review_text: null, created_at: "2026-01-31T00:00:00Z" },
  ],
  "939ab8b8-88d2-455b-aad5-dd908c47f705": [
    { id: "s5a", name: "Sireesha R.",     rating: 5, review_text: "He covers both data science and analytics which was exactly what I needed for the kind of role I'm targeting.", created_at: "2026-03-15T00:00:00Z" },
    { id: "s5b", name: "Gopireddy Venkat", rating: 5, review_text: "Very good session. Tushar explain ML design in way that is easy to tell in interview.", created_at: "2026-03-08T00:00:00Z" },
    { id: "s5c", name: "RAVI",            rating: 5, review_text: "Tough questions. Did not go easy. Good.", created_at: "2026-02-28T00:00:00Z" },
    { id: "s5d", name: "S V",             rating: 5, review_text: null, created_at: "2026-02-21T00:00:00Z" },
    { id: "s5e", name: "Naveenkumar D.",  rating: 5, review_text: null, created_at: "2026-02-14T00:00:00Z" },
    { id: "s5f", name: "Sudha S",         rating: 5, review_text: null, created_at: "2026-02-07T00:00:00Z" },
    { id: "s5g", name: "A K",             rating: 5, review_text: null, created_at: "2026-01-30T00:00:00Z" },
  ],
  "e93bbac0-b00c-4866-9b5e-00b2bd0dc474": [
    { id: "s6a", name: "Rai Guchait",     rating: 5, review_text: "If you are going for BA or PO roles this is right person. Very domain specific knowledge.", created_at: "2026-03-13T00:00:00Z" },
    { id: "s6b", name: "lin chenoufi",    rating: 5, review_text: "Dense session. Covered agile, backlog, stakeholders. A lot to process but useful.", created_at: "2026-03-06T00:00:00Z" },
    { id: "s6c", name: "Saurabh M.",      rating: 5, review_text: "Good. Learned new things about backlog management questions.", created_at: "2026-02-27T00:00:00Z" },
    { id: "s6d", name: "P",               rating: 5, review_text: null, created_at: "2026-02-19T00:00:00Z" },
    { id: "s6e", name: "V K",             rating: 5, review_text: null, created_at: "2026-02-12T00:00:00Z" },
    { id: "s6f", name: "Ritika S.",       rating: 5, review_text: null, created_at: "2026-02-04T00:00:00Z" },
  ],
  "1669214f-e7dc-4ea6-8dee-ca60150fe97a": [
    { id: "s7a", name: "G Naga Supriya",  rating: 5, review_text: "She caught things in my answers I didn't know I was doing. Very observant and specific feedback.", created_at: "2026-03-16T00:00:00Z" },
    { id: "s7b", name: "Sagar Talele",    rating: 5, review_text: "For HR interviews she know exactly what panel is looking for. Changed how I approach behavioral questions.", created_at: "2026-03-09T00:00:00Z" },
    { id: "s7c", name: "P Mahendra Babu", rating: 5, review_text: "Felt like talking to someone who has actually hired people. Not just coaching, real experience.", created_at: "2026-03-01T00:00:00Z" },
    { id: "s7d", name: "jd",              rating: 5, review_text: "Good session. Will recommend to friends.", created_at: "2026-02-22T00:00:00Z" },
    { id: "s7e", name: "T B",             rating: 5, review_text: null, created_at: "2026-02-15T00:00:00Z" },
    { id: "s7f", name: "prakash",         rating: 5, review_text: null, created_at: "2026-02-08T00:00:00Z" },
  ],
  "3362c7aa-5b4f-47bb-9c47-44204f747bfd": [
    { id: "s8a", name: "Yogasandhiyamahalingam", rating: 5, review_text: "Helped me see my experience from strategic lens. That is what HRBP roles need, not just operational knowledge.", created_at: "2026-03-10T00:00:00Z" },
    { id: "s8b", name: "Dhruv",           rating: 5, review_text: "Session was well structured. Started slow then got harder. Good way to build.", created_at: "2026-03-02T00:00:00Z" },
    { id: "s8c", name: "I K",             rating: 5, review_text: "Nice session. Very calm mentor.", created_at: "2026-02-23T00:00:00Z" },
    { id: "s8d", name: "Deepa Pandey",    rating: 5, review_text: null, created_at: "2026-02-15T00:00:00Z" },
    { id: "s8e", name: "G S",             rating: 5, review_text: null, created_at: "2026-02-08T00:00:00Z" },
    { id: "s8f", name: "Harish V.",       rating: 5, review_text: null, created_at: "2026-01-31T00:00:00Z" },
  ],
  "cd6b9265-970a-4efd-a799-9de9ec0d46db": [
    { id: "s9a", name: "Abhinav Thakur",  rating: 5, review_text: "Very honest about where my answers were weak. Didn't dance around it.", created_at: "2026-03-14T00:00:00Z" },
    { id: "s9b", name: "Sanath Shenoy",   rating: 5, review_text: "Good consumer product mock. His background in gaming and subscriptions was relevant to what I was preparing.", created_at: "2026-03-07T00:00:00Z" },
    { id: "s9c", name: "M G",             rating: 5, review_text: "Practical feedback. No filler.", created_at: "2026-02-28T00:00:00Z" },
    { id: "s9d", name: "Dominic Rosario", rating: 5, review_text: null, created_at: "2026-02-20T00:00:00Z" },
    { id: "s9e", name: "Diya S.",         rating: 5, review_text: null, created_at: "2026-02-13T00:00:00Z" },
    { id: "s9f", name: "Varun D.",        rating: 5, review_text: null, created_at: "2026-02-06T00:00:00Z" },
    { id: "s9g", name: "R T",             rating: 5, review_text: null, created_at: "2026-01-29T00:00:00Z" },
  ],
  "5337ced9-9466-4f79-b0f5-a7c552865528": [
    { id: "s10a", name: "Sanath Kumar",   rating: 5, review_text: "Most challenging mock I have had here. He holds you to very high bar. That is the point.", created_at: "2026-03-15T00:00:00Z" },
    { id: "s10b", name: "Aiswarya N.",    rating: 5, review_text: "Came out with clearer way to structure my thinking under pressure. That was main takeaway.", created_at: "2026-03-08T00:00:00Z" },
    { id: "s10c", name: "Shreya M.",      rating: 5, review_text: "He push back on almost everything I said. Uncomfortable but needed.", created_at: "2026-03-01T00:00:00Z" },
    { id: "s10d", name: "V R",            rating: 5, review_text: null, created_at: "2026-02-22T00:00:00Z" },
    { id: "s10e", name: "MANSI GAUR",     rating: 5, review_text: null, created_at: "2026-02-15T00:00:00Z" },
    { id: "s10f", name: "Kanika T.",      rating: 5, review_text: null, created_at: "2026-02-08T00:00:00Z" },
    { id: "s10g", name: "Akash P.",       rating: 5, review_text: null, created_at: "2026-02-01T00:00:00Z" },
  ],
  "e251486e-c21a-49f4-8ab7-ce808785638a": [
    { id: "s11a", name: "Ashish Kumar",   rating: 5, review_text: "Gave me insight of how to actually prepare for product roles and where to focus on, short comings.", created_at: "2026-03-16T00:00:00Z" },
    { id: "s11b", name: "Sireesha Ravulapalli", rating: 5, review_text: "Feedback was very specific. Not just what was wrong but why and how to fix it.", created_at: "2026-03-10T00:00:00Z" },
    { id: "s11c", name: "S K S",          rating: 5, review_text: "He identify weakness fast. Session very productive.", created_at: "2026-03-03T00:00:00Z" },
    { id: "s11d", name: "Gaurav Saxena",  rating: 5, review_text: "Good mock. Doesn't let vague answers pass.", created_at: "2026-02-24T00:00:00Z" },
    { id: "s11e", name: "Naga S.",        rating: 5, review_text: null, created_at: "2026-02-17T00:00:00Z" },
    { id: "s11f", name: "Mohammed Ali",   rating: 5, review_text: null, created_at: "2026-02-10T00:00:00Z" },
    { id: "s11g", name: "P B",            rating: 5, review_text: null, created_at: "2026-02-03T00:00:00Z" },
  ],
  "7627f54c-aa6a-4bb9-aa4a-43da3fe45397": [
    { id: "s12a", name: "Rai G.",         rating: 5, review_text: "Good at making you explain your thinking out loud, not just give answers. That is a different skill.", created_at: "2026-03-12T00:00:00Z" },
    { id: "s12b", name: "lin C.",         rating: 5, review_text: "Helped with how to present analytics work in interviews. Was sounding too technical before this.", created_at: "2026-03-05T00:00:00Z" },
    { id: "s12c", name: "Saurabh Mulik",  rating: 5, review_text: "Nice session. Learn many things.", created_at: "2026-02-26T00:00:00Z" },
    { id: "s12d", name: "RAVI K",         rating: 5, review_text: null, created_at: "2026-02-18T00:00:00Z" },
    { id: "s12e", name: "Pooja M.",       rating: 5, review_text: null, created_at: "2026-02-11T00:00:00Z" },
    { id: "s12f", name: "Sampath M.",     rating: 5, review_text: null, created_at: "2026-02-04T00:00:00Z" },
  ],
  "ee41e117-31df-4548-b8d2-5b5eaa1a869b": [
    { id: "s13a", name: "Chinmayi Manjunath", rating: 5, review_text: "He asks questions that expose gaps fast. Stats, experiment design, all of it gets tested.", created_at: "2026-03-14T00:00:00Z" },
    { id: "s13b", name: "Kalyani Katyarmal", rating: 5, review_text: "VP level experience come through in session. Bar he set is higher than other mocks I did.", created_at: "2026-03-07T00:00:00Z" },
    { id: "s13c", name: "SJ Basak",       rating: 5, review_text: "Good for DS roles in BFSI. Knows the domain.", created_at: "2026-02-28T00:00:00Z" },
    { id: "s13d", name: "Naveenkumar D.", rating: 5, review_text: null, created_at: "2026-02-20T00:00:00Z" },
    { id: "s13e", name: "Trishna K.",     rating: 5, review_text: null, created_at: "2026-02-13T00:00:00Z" },
    { id: "s13f", name: "A V",            rating: 5, review_text: null, created_at: "2026-02-06T00:00:00Z" },
    { id: "s13g", name: "Rohit K.",       rating: 5, review_text: null, created_at: "2026-01-29T00:00:00Z" },
  ],
};

const StarRating = ({ rating }: { rating: number }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) stars.push(<Text key={i} style={g.starFilled}>★</Text>);
    else if (i === fullStars && hasHalfStar) stars.push(<View key={i} style={{ position: 'relative' }}><Text style={g.starEmpty}>★</Text><Text style={[g.starFilled, { position: 'absolute', width: '50%', overflow: 'hidden' }]}>★</Text></View>);
    else stars.push(<Text key={i} style={g.starEmpty}>★</Text>);
  }
  return <View style={{ flexDirection: 'row', gap: 2 }}>{stars}</View>;
};

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

function BookNowPanel({ sType, price, bundleSave, s1ok, s2ok, s3ok, allOk, tried, onBook, paying }: any) {
  const accentColor = !sType ? MUTED : sType === "mock" ? TEAL : "#D97706";
  return (
    <View style={g.bnCard}>
      <View style={[g.bnTypeTag, { backgroundColor: `${accentColor}12`, borderColor: `${accentColor}30` }]}>
        <View style={[g.bnTypeDot, { backgroundColor: accentColor }]} />
        <Text style={[g.bnTypeLabel, { color: accentColor, fontFamily: F }]}>
          {!sType ? "No Session Selected" : sType === "mock" ? "Mock Interview · 55 min" : "Prep Course · 3 × 55 min"}
        </Text>
      </View>
      <View style={g.bnPriceRow}>
        <Text style={[g.bnPrice, { fontFamily: F }]}>{!sType ? "Rs -" : `₹${price.toLocaleString()}`}</Text>
        {sType === "bundle" && bundleSave > 0 && (
          <View style={g.bnSavePill}><Text style={[g.bnSaveTxt, { fontFamily: F }]}>Save ₹{bundleSave.toLocaleString()}</Text></View>
        )}
      </View>
      <Text style={[g.bnPriceSub, { fontFamily: F }]}>
        {!sType ? "Select a session type to view price" : sType === "mock" ? "Single skill session · 55 min" : "3 full mock interviews · 3 × 55 min"}
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
              {allOk ? `Pay ₹${price.toLocaleString()} →` : "Book Now"}
            </Text>}
      </TouchableOpacity>

      {tried && !allOk && (
        <View style={g.bnWarn}>
          <IcoAlert s={14} c="#D97706" />
          <Text style={[g.bnWarnTxt, { fontFamily: F }]}>Complete all steps above to continue</Text>
        </View>
      )}
      {true && (
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
  const introUsed = false; // intro call removed

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

  // intro call removed
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

  const bundlePrice = Math.round(mockPrice * 2.5);
  const bundleSave = Math.round(mockPrice * 3 - bundlePrice);

  const price = !sType ? 0 : sType === "mock" ? mockPrice : bundlePrice;

  const isJD = sType === "mock"
    ? !!skill?.name.toLowerCase().includes("jd-based")
    : sType === "bundle" && bundleMode === "custom"
      ? bundleSkills.some(sk => sk.name.toLowerCase().includes("jd-based"))
      : false;

  const effPID = profId || (profiles.length > 0 ? profiles[0].id : null);
  const s1ok = !!sType;
  const s2ok = !sType ? false : sType === "mock" ? !!(profId && skill && (!isJD || jdText.trim().length >= 50)) : sType === "bundle" ? (bundleMode === "intro" || (bundleSkills.length === 3 && (!isJD || jdText.trim().length >= 50))) : false;
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
  
  // Use local image based on first name if missing
  let avatarUrl = mentor.avatar_url;
  if (!avatarUrl && mentor.profiles?.full_name) {
    const firstName = mentor.profiles.full_name.trim().split(/\s+/)[0];
    if (firstName) avatarUrl = `/mentor-pics/${firstName}.jpeg`;
  }
  const avatarSource = avatarUrl || fallbackAvatar;

  const tabSubs = [
    !sType ? "Select session type" : sType === "mock" ? "Mock Interview — 55 min" : "Prep Course — 3 × 55 min",
    !sType ? "Not required" : sType === "mock" ? (skill ? skill.name : profId ? (profiles.find(p => p.id === profId)?.name || "") : "") : (bundleMode === "intro" ? "Select topics" : `${bundleSkills.length}/3 topics selected`),
    sType === "bundle" ? (selSlots.length === 3 ? selSlots.map(sl => sl.time).join(" · ") : `${selSlots.length}/3 slots chosen`) : (selSlot ? `${selSlot.time} · ${selSlot.displayDate}` : ""),
  ];

  const bnProps = { sType, price, bundleSave, s1ok, s2ok, s3ok, allOk, tried, onBook: handleBookNow, paying };
  
  const mentorReviews = SEED_REVIEWS[id as string] || [];

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
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 2 }}>
                  {mentor.profiles?.full_name ? (
                    <Text style={[g.mentorName, { fontFamily: F }]} numberOfLines={1}>
                      {formatDisplayName(mentor.profiles.full_name)}
                    </Text>
                  ) : null}
                  <IcoCircleCheck s={16} c="#3B82F6" />
                </View>
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
                  <SessionRow selected={sType === "bundle"} onPress={() => setSType("bundle")} accentColor="#D97706" icon={<IcoLayers s={20} c={sType === "bundle" ? "#D97706" : "#9CA3AF"} />} label="Prep Course" duration="3 × 55 minutes" description="A full 3-session package. 3 full mock interviews tailored to your target role — based on a JD you're prepping for or a topic you want to master." price={`₹${bundlePrice.toLocaleString()}`} badge={bundleSave > 0 ? `SAVE ₹${bundleSave.toLocaleString()}` : undefined} />
                  <TouchableOpacity style={[g.nextBtn, !sType && g.nextBtnOff]} onPress={() => sType && setOpenStep(1)}>
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

                    <>
                      {sType === "bundle" && (
                        <View style={{ marginBottom: 20 }}>
                          <Text style={[g.hint, { fontFamily: F, color: DARK, fontWeight: "700", marginBottom: 12 }]}>Prep Course Curriculum</Text>
                          <View style={{ flexDirection: "row", gap: 10 }}>
                            <TouchableOpacity style={[g.tag, bundleMode === "custom" && g.tagOn]} onPress={() => setBundleMode("custom")}>
                              {bundleMode === "custom" && <IcoCheck s={13} />}
                              <Text style={[g.tagTxt, bundleMode === "custom" && g.tagTxtOn, { fontFamily: F }]}>Custom Topics</Text>
                            </TouchableOpacity>
                          </View>
                          {bundleMode === "intro" && (
                            <Text style={{ fontFamily: F, color: MUTED, fontSize: 13, marginTop: 12, lineHeight: 20 }}>
                              Your mentor will plan the curriculum for your 3 sessions based on your target topics and weak areas.
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

          {/* DYNAMIC REVIEWS SECTION */}
          {mentorReviews.length > 0 && (
            <View style={[g.mentorCard, { marginTop: 24 }]}>
              <View style={[g.reviewsWrap, { borderTopWidth: 0 }]}>
                <Text style={[g.bioLabel, { fontFamily: F, marginBottom: 16 }]}>CANDIDATE REVIEWS</Text>
                <View style={{ gap: 16 }}>
                  {mentorReviews.map(r => (
                    <View key={r.id} style={g.reviewCard}>
                      <View style={g.reviewHeader}>
                        <StarRating rating={r.rating} />
                        <Text style={g.reviewDate}>{DateTime.fromISO(r.created_at).toRelative()}</Text>
                      </View>
                      {r.review_text ? <Text style={g.reviewText}>{r.review_text}</Text> : null}
                      <Text style={g.reviewAuthor}>— {r.name}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}

          {!isDesktop && <View style={{ marginTop: 20 }}><BookNowPanel {...bnProps} /></View>}
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
  mentorName: { fontSize: 22, fontWeight: "800", color: DARK },
  mentorTitle: { fontSize: 14, fontWeight: "600", color: MUTED, marginBottom: 8 },
  statsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  stat: { flexDirection: "row", alignItems: "center", backgroundColor: "#F9FAFB", paddingHorizontal: 8, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: BORDER },
  statTxt: { fontSize: 11, fontWeight: "600", color: "#374151" },
  
  bioWrap: { borderTopWidth: 1, borderTopColor: "#F3F4F6", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 },
  bioLabel: { fontSize: 11, fontWeight: "800", color: MUTED, letterSpacing: 0.5, marginBottom: 8 },
  bioTxt: { fontSize: 14, color: "#4B5563", lineHeight: 22 },
  readMore: { fontSize: 13, fontWeight: "700", color: TEAL },

  reviewsWrap: { borderTopWidth: 1, borderTopColor: "#F3F4F6", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 },
  reviewCard: { backgroundColor: "#F9FAFB", padding: 16, borderRadius: 12, borderWidth: 1, borderColor: BORDER },
  reviewHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  reviewDate: { fontSize: 12, color: MUTED, fontFamily: F },
  reviewText: { fontSize: 14, color: "#4B5563", lineHeight: 22, fontFamily: F, marginBottom: 8 },
  reviewAuthor: { fontSize: 12, fontWeight: "700", color: DARK, fontFamily: F },
  starFilled: { fontSize: 14, color: "#FBBF24" },
  starEmpty: { fontSize: 14, color: "#D1D5DB" },

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