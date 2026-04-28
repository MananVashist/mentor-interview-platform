# CrackJobs Growth Timeline
## PERMANENT INSTRUCTIONS FOR ANY AI READING THIS DOCUMENT

This document is the complete operational history of CrackJobs (crackjobs.com), a paid mock interview platform for the Indian job market. It contains every code change, Google Ads change, GA4 metric, and real transaction data from January 2026 onwards.

### What this platform is
- Paid mock interview platform, India market
- Tracks: Product Manager (PM), Data Analyst/BA, Data Science, Technical HR
- Mentor anonymity: professional titles shown, not names
- Pay-per-session pricing, no subscription
- Stack: React Native/Expo Router, Supabase, Razorpay, 100ms video

### How to use this document
You are acting as both a **senior software engineer** and a **performance marketing specialist** with full knowledge of this codebase and campaign history.

1. **Sequence-based insights carry the highest evidentiary weight.** When a change in CODE CHANGES or ADS CHANGES is followed by a metric shift in GA4 METRICS or Supabase data within 3-7 days, this is the strongest evidence available. Always look for these before-and-after sequences FIRST. Single-source observations are supporting context only.

2. **Ground every claim in this document.** Cite specific dates and numbers. If you cannot point to a specific entry, do not make the claim.

3. **Never infer causality with confidence.** Traffic is 10-40 sessions/day. Use "this sequence is consistent with" or "this could suggest" - never "this caused" or "this proves."

4. **Flag low-signal periods.** Fewer than 8 CPC sessions/day = LOW SIGNAL. Do not draw conclusions from these periods alone.

5. **Structure every insight as:**
   - Observation: What the data shows (date + number references)
   - Possible explanation: What might have caused it
   - Alternative explanation: At least one other explanation
   - Confidence: LOW or MEDIUM only - never HIGH
   - What would confirm this: Specific metric or threshold
   - Suggested action: Only if confidence is MEDIUM

6. **Success = paid bookings only.** CRITICAL: Google Ads optimised for sign-ups for most of the campaign history, not purchases. Ad "conversions" are mostly sign-up events. Use the Supabase Funnel Data section for real conversion numbers.

7. **Known facts - do not re-derive:**
   - Total ad spend: ~Rs 46,619
   - Real paid bookings: 2 (Rs 457 on Mar 12 - non-founder mentor, intro call; Rs 500 on Mar 26 - founder mentor, intro call)
   - Free intro calls completed: 8 (manually arranged, Rs 0)
   - Test transactions excluded: 3 (candidate da6ca1aa, amounts Rs 1/4/11)
   - PM campaign: Feb 11 - Apr 5, 2026
   - DA campaign: Mar 15 - Apr 5, 2026
   - tCPA Rs 400 set Mar 27 - impressions collapsed to near zero
   - Conversion tracking switched between purchases and sign-ups multiple times
   - The Rs 457 booking (Mar 12) was the same day competitor keyword targeting launched
   - Signup wall removed Feb 16 (mentor listing accessible without account)
   - Price dropped Rs 3,500 to Rs 800 on Feb 22
   - Free intro call added as product feature Feb 22; as ad headline Mar 1
   - Intro call pricing made DB-driven Mar 26 (was hardcoded 20% before - caused price inconsistencies)
   - Both campaigns paused Apr 5 - currently inactive

8. **Do not suggest anything already tried.** Check CODE CHANGES and ADS CHANGES before recommending.

9. **Be forward-looking.** Goal is more paid bookings. Use history to avoid repeating mistakes and find untested directions. Frame every answer as: given what has and has not worked, here is what to try next and why.

10. **Weight recent entries most heavily.** Current state: campaigns paused, zero ad spend. Factor this into what next step means practically.

---

## Platform State at Ads Launch (Jan 25, 2026)
*Derived from commits up to Jan 25. This section captures what existed BEFORE changes were made, enabling accurate before/after analysis.*

### User Funnel at Launch
1. Ad -> Landing Page `/lp/pm` (only PM track; DA added Mar 15)
2. LP CTA -> `/auth/sign-up` **[SIGNUP WALL]** — user must register before seeing any mentor
3. After signup -> Mentor listing `/mentors`
4. Mentor profile `/mentors/[id]` -> Booking `/candidate/[id]`
5. Only session type available: **mock interview** (intro call + bundle added Feb 22)

### Pricing at Launch
- Bronze: Rs 3,500-6,000 | Silver: Rs 6,000-10,000 | Gold: Rs 10,000-15,000
- LP trust pill: "Starts at Rs 3,500"
- Intro call price: hardcoded as 20% of session price (not DB-driven — caused price inconsistencies on booking screen)
- Founder mentor had hardcoded "Free" intro call label

### LP Messaging at Launch
- Hero: "Practice with real interviewers from top companies"
- Trust pills: Recording + Scorecard, Anonymous format, Verified mentors
- Pricing section visible on LP before CTA click
- No "free intro call" offer (product feature added Feb 22; ad headline Mar 1)
- No role-specific problem sections (added Mar 15+)

### Ad Account at Launch
- Conversion tracking: "page views" (wrong signal — fixed Jan 26 to sign-ups + purchases)
- Bid strategy: Maximize Clicks
- Ad copy: "Mock interviews with real hiring managers from top companies. Starting from Rs 3.5k"
- All keywords: broad match

### What Did NOT Exist Yet
| Feature | Added |
|---|---|
| Intro call product | Feb 22 |
| Bundle sessions | Feb 22 |
| Free browsing without signup | Feb 16 |
| DA landing page /lp/da | Mar 15 |
| Competitor keyword targeting | Mar 12 |
| Role-specific problem sections on LP | Mar 15+ |
| JD-based interview option | Mar+ |
| DB-driven intro call pricing | Mar 26 |

---

## Funnel Data (Supabase - Ground Truth)

> Use this section for all conversion analysis. GA4 payment events are unreliable. This is the authoritative source.

### Summary
- Total candidate accounts (signups): 44
- Real paid bookings: 1
- Free intro calls completed: 7
- Test transactions excluded: 3
- Total real revenue: Rs 457

### Signups by Date
| Date | New Signups | Cumulative |
|---|---|---|
| 2025-11-29 | +1 | 1 |
| 2025-12-13 | +1 | 2 |
| 2025-12-14 | +1 | 3 |
| 2025-12-22 | +1 | 4 |
| 2025-12-23 | +1 | 5 |
| 2025-12-26 | +1 | 6 |
| 2025-12-28 | +1 | 7 |
| 2025-12-30 | +1 | 8 |
| 2026-01-19 | +1 | 9 |
| 2026-02-02 | +1 | 10 |
| 2026-02-15 | +1 | 11 |
| 2026-02-17 | +1 | 12 |
| 2026-02-22 | +1 | 13 |
| 2026-02-24 | +1 | 14 |
| 2026-02-28 | +1 | 15 |
| 2026-03-01 | +1 | 16 |
| 2026-03-03 | +1 | 17 |
| 2026-03-07 | +1 | 18 |
| 2026-03-10 | +2 | 20 |
| 2026-03-11 | +1 | 21 |
| 2026-03-12 | +4 | 25 |
| 2026-03-13 | +1 | 26 |
| 2026-03-15 | +1 | 27 |
| 2026-03-17 | +2 | 29 |
| 2026-03-18 | +1 | 30 |
| 2026-03-20 | +1 | 31 |
| 2026-03-21 | +1 | 32 |
| 2026-03-22 | +3 | 35 |
| 2026-03-23 | +1 | 36 |
| 2026-03-24 | +2 | 38 |
| 2026-03-25 | +1 | 39 |
| 2026-03-31 | +1 | 40 |
| 2026-04-02 | +1 | 41 |
| 2026-04-03 | +2 | 43 |
| 2026-04-08 | +1 | 44 |

### Real Paid Bookings (Source of Truth)
| Date | Amount (INR) | Session Type | Mentor | Status |
|---|---|---|---|---|
| 2026-03-12 | Rs 457 | intro | Other (939ab8b8) | held_in_escrow |

### Free Intro Calls (Rs 0 - manually arranged)
| Date | Session Type | Mentor |
|---|---|---|
| 2026-03-10 | intro | Founder |
| 2026-03-20 | intro | Founder |
| 2026-03-21 | intro | Founder |
| 2026-03-22 | intro | Founder |
| 2026-03-23 | intro | Founder |
| 2026-03-24 | intro | Founder |
| 2026-03-25 | intro | Founder |

---

## Campaign Summary (Full Period)

*Conversions = mix of sign-ups and purchases. See instruction 6. Use Supabase section for real booking counts.*

| Campaign | Status | Clicks | Cost (INR) | Conv* | Bid Strategy |
|---|---|---|---|---|---|
| DA_Core_buyers | Removed | 0 | Rs 0 | 0 | Maximize clicks |
| Competitors | Removed | 0 | Rs 0 | 0 | Maximize clicks |
| PM Sales | Paused | 507 | Rs 32,930 | 4 | Maximize Conversions |
| DS_Core_buyers | Removed | 0 | Rs 0 | 0 | Maximize clicks |
| Data Analyst Sales | Paused | 258 | Rs 13,690 | 6 | Maximize Conversions |
| PM_Core_buyers | Removed | 0 | Rs 0 | 0 | Maximize clicks |

## Keyword Performance (Full Period - Top 25 by Spend)

| Keyword | Match | Campaign | Clicks | Cost (INR) | Conv | CTR |
|---|---|---|---|---|---|---|
| "pm interview practice" | Phrase match | PM Sales | 143 | Rs 8,570 | 0 | 2.37% |
| "pm mock interview" | Phrase match | PM Sales | 96 | Rs 7,378 | 1 | 4.75% |
| "data analytics interview prep" | Phrase match | Data Analyst Sales | 56 | Rs 3,675 | 2 | 3.19% |
| "product manager interview practice" | Phrase match | PM Sales | 29 | Rs 1,538 | 0 | 1.91% |
| "data analytics interview preparation" | Phrase match | Data Analyst Sales | 21 | Rs 1,536 | 1 | 2.34% |
| "exponent mock interview" | Phrase match | PM Sales | 8 | Rs 1,458 | 1 | 3.40% |
| "mock product manager interview" | Phrase match | PM Sales | 12 | Rs 1,363 | 0 | 6.56% |
| "mock interview data analyst" | Phrase match | Data Analyst Sales | 11 | Rs 1,200 | 1 | 5.79% |
| "interview preparation for data analyst" | Phrase match | Data Analyst Sales | 27 | Rs 1,184 | 0 | 1.29% |
| "data analyst job preparation" | Phrase match | Data Analyst Sales | 20 | Rs 1,028 | 0 | 1.00% |
| "product manager mock interview" | Phrase match | PM Sales | 19 | Rs 803 | 0 | 1.59% |
| [data analytics mock interview] | Exact match | Data Analyst Sales | 12 | Rs 744 | 0 | 7.79% |
| [data analyst mock interview] | Exact match | Data Analyst Sales | 10 | Rs 692 | 0 | 4.15% |
| [product sense mock interview] | Exact match | PM Sales | 3 | Rs 608 | 0 | 1.97% |
| [mock interview data analyst] | Exact match | Data Analyst Sales | 7 | Rs 593 | 1 | 9.59% |
| "product management mock interview" | Phrase match | PM Sales | 12 | Rs 553 | 0 | 1.12% |
| [product manager mentor] | Exact match | PM Sales | 4 | Rs 541 | 0 | 33.33% |
| [product management mentorship] | Exact match | PM Sales | 5 | Rs 489 | 0 | 17.86% |
| [pm interview coach] | Exact match | PM Sales | 3 | Rs 406 | 0 | 42.86% |
| "prepare for data analyst interview" | Phrase match | Data Analyst Sales | 12 | Rs 397 | 0 | 0.87% |
| "mock interview for data analyst" | Phrase match | Data Analyst Sales | 6 | Rs 384 | 0 | 6.82% |
| [business analyst mock interview] | Exact match | Data Analyst Sales | 6 | Rs 332 | 0 | 1.65% |
| "preparing for a data analyst interview" | Phrase match | Data Analyst Sales | 14 | Rs 325 | 0 | 0.96% |
| "data analyst interview preparation" | Phrase match | Data Analyst Sales | 4 | Rs 188 | 0 | 0.68% |
| "data analyst interview prep" | Phrase match | Data Analyst Sales | 11 | Rs 148 | 0 | 0.87% |

## Search Terms That Got Clicks (Top 30)

| Search Term | Match | Campaign | Clicks | Cost (INR) | Conv |
|---|---|---|---|---|---|
| product manager interview | Exact match (close variant) | PM Sales | 23 | Rs 503 | 0 |
| product manager interview questions | Exact match (close variant) | PM Sales | 20 | Rs 1,417 | 0 |
| product management interview questions | Exact match (close variant) | PM Sales | 10 | Rs 867 | 0 |
| data analyst interview | Exact match (close variant) | Data Analyst Sales | 9 | Rs 204 | 0 |
| data analyst mock interview | Exact match | Data Analyst Sales | 8 | Rs 642 | 0 |
| product management interview | Exact match (close variant) | PM Sales | 7 | Rs 170 | 0 |
| sql mock interview | Phrase match (close variant) | Data Analyst Sales | 7 | Rs 549 | 0 |
| mock interview practice | Broad match | PM Sales | 6 | Rs 432 | 0 |
| strategic business analytics | Broad match | Data Analyst Sales | 6 | Rs 54 | 0 |
| power bi mock interview | Phrase match (close variant) | Data Analyst Sales | 5 | Rs 257 | 0 |
| mock interview for data analyst | Exact match | Data Analyst Sales | 5 | Rs 381 | 0 |
| product manager mock interview | Exact match | PM Sales | 4 | Rs 367 | 0 |
| mock interview for product manager | Exact match (close variant) | PM Sales | 4 | Rs 439 | 0 |
| pramp | Phrase match (close variant) | PM Sales | 4 | Rs 414 | 1 |
| interview warmup | Broad match | PM Sales | 4 | Rs 369 | 0 |
| mock interview practice online | Broad match | PM Sales | 4 | Rs 177 | 0 |
| jobzzpk | Broad match | PM Sales | 4 | Rs 280 | 0 |
| pramp mock interview | Broad match | PM Sales | 3 | Rs 137 | 0 |
| google interview warmup | Broad match | PM Sales | 3 | Rs 115 | 0 |
| exponent product management | Phrase match (close variant) | PM Sales | 3 | Rs 52 | 0 |
| pm mock interviews | Exact match (close variant) | PM Sales | 3 | Rs 353 | 0 |
| product manager interview preparation | Exact match (close variant) | PM Sales | 3 | Rs 317 | 0 |
| pramp | Broad match | PM Sales | 3 | Rs 330 | 0 |
| google it courses | Broad match | Data Analyst Sales | 3 | Rs 12 | 0 |
| mock interview practice | Exact match (close variant) | PM Sales | 3 | Rs 158 | 0 |
| mock interview | Exact match (close variant) | PM Sales | 3 | Rs 221 | 0 |
| analytics strategy | Broad match | Data Analyst Sales | 3 | Rs 47 | 0 |
| product management mock interview | Exact match | PM Sales | 3 | Rs 373 | 0 |
| mock interviews for data analyst | Exact match (close variant) | Data Analyst Sales | 3 | Rs 212 | 0 |
| pm interview prep | Exact match (close variant) | PM Sales | 3 | Rs 263 | 0 |

## Daily Timeline

Read sequences across consecutive days, not individual days in isolation.

### 2026-04-25

**GA4 METRICS**
- Sessions: 3 total (CPC: 0, Organic: 1, Direct: 0)
- Landing pages: : 1, /auth/sign-up: 1, /blog/sql-window-functions-interview-guide: 1

---

### 2026-04-24

**GA4 METRICS**
- Sessions: 1 total (CPC: 0, Organic: 0, Direct: 0)
- Landing pages: /: 1, /mentors/7627f54c-aa6a-4bb9-aa4a-43da3fe45397: 1

---

### 2026-04-22

**GA4 METRICS**
- Sessions: 1 total (CPC: 0, Organic: 1, Direct: 0)
- Landing pages: /: 1

---

### 2026-04-21

**GA4 METRICS**
- Sessions: 1 total (CPC: 0 (-100% vs 7d avg, ↓ worse), Organic: 0, Direct: 0)
- Landing pages: /: 1

---

### 2026-04-17

**GA4 METRICS**
- Sessions: 1 total (CPC: 0 (-100% vs 7d avg, ↓ worse), Organic: 1, Direct: 0)
- Landing pages: /: 1

---

### 2026-04-15

**GA4 METRICS**
- Sessions: 2 total (CPC: 0 (-100% vs 7d avg, ↓ worse), Organic: 2, Direct: 0)
- Landing pages: (not set): 1, /: 1

---

### 2026-04-14

**GA4 METRICS**
- Sessions: 1 total (CPC: 0 (-100% vs 7d avg, ↓ worse), Organic: 1, Direct: 0)
- Landing pages: /: 1

---

### 2026-04-13

**GA4 METRICS**
- Sessions: 2 total (CPC: 0 (-100% vs 7d avg, ↓ worse), Organic: 2, Direct: 0)
- Landing pages: (not set): 1, /blog/aarm-framework-product-management-interviews: 1

---

### 2026-04-09

*[Day +4 after 2026-04-05: ads: 1 campaign paused | Status changed from active to paused]*
*[Day +4 after 2026-04-05: ads: 1 campaign paused | Status changed from active to paused]*

**GA4 METRICS**
- Sessions: 2 total (CPC: 0 (-100% vs 7d avg, ↓ worse), Organic: 1, Direct: 0)
- Landing pages: /: 1, /interviews/data-science: 1

---

### 2026-04-07

*[Day +2 after 2026-04-05: ads: 1 campaign paused | Status changed from active to paused]*
*[Day +2 after 2026-04-05: ads: 1 campaign paused | Status changed from active to paused]*
*[Day +7 after 2026-03-31: ads: Standard goals changed | Purchases (Website) removed | Sign-ups (Website) a]*

**GA4 METRICS**
- Sessions: 2 total (CPC: 0 (-100% vs 7d avg, ↓ worse), Organic: 2, Direct: 0)
- Landing pages: (not set): 1, /: 1

---

### 2026-04-06 LOW SIGNAL

*[Day +1 after 2026-04-05: ads: 1 campaign paused | Status changed from active to paused]*
*[Day +1 after 2026-04-05: ads: 1 campaign paused | Status changed from active to paused]*
*[Day +6 after 2026-03-31: ads: Standard goals changed | Purchases (Website) removed | Sign-ups (Website) a]*

**GA4 METRICS**
- Sessions: 2 total (CPC: 2 (-87% vs 7d avg, ↓ worse), Organic: 0, Direct: 0)
- CPC bounce rate: 50% (+0.2pp vs 7d avg, ↑ worse) | Avg session duration: 6s (-92% vs 7d avg, ↓ worse)
- Landing pages: (not set): 1, /lp/da: 1

---

### 2026-04-05

**ADS CHANGES**
- [PM Sales]: 1 campaign paused | Status changed from active to paused
- [Data Analyst Sales]: 1 campaign paused | Status changed from active to paused

*[Day +5 after 2026-03-31: ads: Standard goals changed | Purchases (Website) removed | Sign-ups (Website) a]*
*[Day +5 after 2026-03-31: ads: Standard goals changed | Purchases (Website) removed | Sign-ups (Website) a]*
*[Day +6 after 2026-03-30: ads: Target CPA was ₹400.00]*

**GA4 METRICS**
- Sessions: 17 total (CPC: 16 (+26% vs 7d avg, ↑ better), Organic: 0, Direct: 0)
- CPC bounce rate: 56% (+0.2pp vs 7d avg, ↑ worse) | Avg session duration: 12s (-85% vs 7d avg, ↓ worse)
- Landing pages: /lp/da: 13, /lp/pm: 2, /about: 1, /how-it-works: 1

---

### 2026-04-04

*[Day +4 after 2026-03-31: ads: Standard goals changed | Purchases (Website) removed | Sign-ups (Website) a]*
*[Day +4 after 2026-03-31: ads: Standard goals changed | Purchases (Website) removed | Sign-ups (Website) a]*
*[Day +5 after 2026-03-30: ads: Target CPA was ₹400.00]*

**GA4 METRICS**
- Sessions: 12 total (CPC: 12 (-6% vs 7d avg, ↓ worse), Organic: 0, Direct: 0)
- CPC bounce rate: 8% (-0.4pp vs 7d avg, ↓ better) | Avg session duration: 110s (+60% vs 7d avg, ↑ better)
- Key events: signup_initiate: 1
- Landing pages: /lp/da: 9, /lp/pm: 3

---

### 2026-04-03

*[Day +3 after 2026-03-31: ads: Standard goals changed | Purchases (Website) removed | Sign-ups (Website) a]*
*[Day +3 after 2026-03-31: ads: Standard goals changed | Purchases (Website) removed | Sign-ups (Website) a]*
*[Day +4 after 2026-03-30: ads: Target CPA was ₹400.00]*

**GA4 METRICS**
- Sessions: 21 total (CPC: 20 (+100% vs 7d avg, ↑ better), Organic: 1, Direct: 0)
- CPC bounce rate: 25% (-0.2pp vs 7d avg, ↓ better) | Avg session duration: 92s (+54% vs 7d avg, ↑ better)
- Key events: signup_initiate: 1
- Landing pages: /lp/da: 12, /lp/pm: 8, /mentors: 1

---

### 2026-04-02

*[Day +2 after 2026-03-31: ads: Standard goals changed | Purchases (Website) removed | Sign-ups (Website) a]*
*[Day +2 after 2026-03-31: ads: Standard goals changed | Purchases (Website) removed | Sign-ups (Website) a]*
*[Day +3 after 2026-03-30: ads: Target CPA was ₹400.00]*

**GA4 METRICS**
- Sessions: 17 total (CPC: 14 (+47% vs 7d avg, ↑ better), Organic: 1, Direct: 0)
- CPC bounce rate: 29% (-0.2pp vs 7d avg, ↓ better) | Avg session duration: 58s (+3% vs 7d avg, ↑ better)
- Key events: signup_initiate: 1
- Landing pages: /lp/pm: 7, /lp/da: 6, (not set): 1, /: 1, /auth/sign-up: 1, /mentors: 1

---

### 2026-04-01

*[Day +1 after 2026-03-31: ads: Standard goals changed | Purchases (Website) removed | Sign-ups (Website) a]*
*[Day +1 after 2026-03-31: ads: Standard goals changed | Purchases (Website) removed | Sign-ups (Website) a]*
*[Day +2 after 2026-03-30: ads: Target CPA was ₹400.00]*

**GA4 METRICS**
- Sessions: 19 total (CPC: 15 (+41% vs 7d avg, ↑ better), Organic: 3, Direct: 0)
- CPC bounce rate: 20% (-0.3pp vs 7d avg, ↓ better) | Avg session duration: 108s (+109% vs 7d avg, ↑ better)
- Key events: signup_initiate: 1
- Landing pages: /lp/da: 8, /lp/pm: 7, (not set): 1, /about: 1, /mentors: 1, /mentors/e251486e-c21a-49f4-8ab7-ce808785638a: 1

---

### 2026-03-31

**ADS CHANGES**
- [Data Analyst Sales]: Standard goals changed | Purchases (Website) removed | Sign-ups (Website) added
- [PM Sales]: Standard goals changed | Purchases (Website) removed | Sign-ups (Website) added

*[Day +1 after 2026-03-30: ads: Target CPA was ₹400.00]*
*[Day +1 after 2026-03-30: ads: Target CPA was ₹400.00]*
*[Day +4 after 2026-03-27: ads: Target CPA is ₹400.00]*

**GA4 METRICS**
- Sessions: 27 total (CPC: 24 (+167% vs 7d avg, ↑ better), Organic: 2, Direct: 0)
- CPC bounce rate: 25% (-0.3pp vs 7d avg, ↓ better) | Avg session duration: 135s (+267% vs 7d avg, ↑ better)
- Key events: signup_initiate: 1
- Landing pages: /lp/da: 13, /lp/pm: 9, (not set): 2, /: 2, /mentors/e251486e-c21a-49f4-8ab7-ce808785638a: 1

---

### 2026-03-30 LOW SIGNAL

**ADS CHANGES**
- [Data Analyst Sales]: Target CPA was ₹400.00
- [PM Sales]: Target CPA was ₹400.00

*[Day +3 after 2026-03-27: ads: Target CPA is ₹400.00]*
*[Day +3 after 2026-03-27: ads: Standard goals changed | Purchases (Website) added | Sign-ups (Website) rem]*
*[Day +3 after 2026-03-27: ads: Target CPA is ₹400.00]*

**GA4 METRICS**
- Sessions: 5 total (CPC: 3 (-74% vs 7d avg, ↓ worse), Organic: 2, Direct: 0)
- CPC bounce rate: 67% (+0.2pp vs 7d avg, ↑ worse) | Avg session duration: 16s (-57% vs 7d avg, ↓ worse)
- Key events: signup_initiate: 1
- Landing pages: (not set): 2, /: 1, /lp/pm: 1, /mentors: 1

---

### 2026-03-29 LOW SIGNAL

*[Day +2 after 2026-03-27: ads: Target CPA is ₹400.00]*
*[Day +2 after 2026-03-27: ads: Standard goals changed | Purchases (Website) added | Sign-ups (Website) rem]*
*[Day +2 after 2026-03-27: ads: Target CPA is ₹400.00]*

**GA4 METRICS**
- Sessions: 1 total (CPC: 1 (-93% vs 7d avg, ↓ worse), Organic: 0, Direct: 0)
- CPC bounce rate: 100% (+0.6pp vs 7d avg, ↑ worse) | Avg session duration: 5s (-89% vs 7d avg, ↓ worse)
- Landing pages: /lp/pm: 1

---

### 2026-03-28

*[Day +1 after 2026-03-27: ads: Target CPA is ₹400.00]*
*[Day +1 after 2026-03-27: ads: Standard goals changed | Purchases (Website) added | Sign-ups (Website) rem]*
*[Day +1 after 2026-03-27: ads: Target CPA is ₹400.00]*

**GA4 METRICS**
- Sessions: 1 total (CPC: 0 (-100% vs 7d avg, ↓ worse), Organic: 1, Direct: 0)
- Landing pages: /: 1

---

### 2026-03-27 LOW SIGNAL

**ADS CHANGES**
- [Data Analyst Sales]: Target CPA is ₹400.00
- [Data Analyst Sales]: Standard goals changed | Purchases (Website) added | Sign-ups (Website) removed
- [PM Sales]: Target CPA is ₹400.00

*[Day +1 after 2026-03-26: code: Intro call price fix]*
*[Day +3 after 2026-03-24: code: Aome changes]*
*[Day +3 after 2026-03-24: code: SEO changes]*

**GA4 METRICS**
- Sessions: 3 total (CPC: 3 (-79% vs 7d avg, ↓ worse), Organic: 0, Direct: 0)
- CPC bounce rate: 33% (-0.0pp vs 7d avg, ↓ better) | Avg session duration: 36s (-31% vs 7d avg, ↓ worse)
- Landing pages: (not set): 1, /lp/da: 1, /lp/pm: 1

---

### 2026-03-26

**CODE CHANGES**
- `a9fb222`: Intro call price fix
  [CHANGED] app/candidate/[id].tsx (+5/-5) | -  const introPrice = Math.round(mockPrice * 0.20); / +  const introIsFree = mentor?.intro_call_price == null || mentor?.intro_call_price === 0;
  [CHANGED] app/candidate/index.tsx (+8/-17) | -type Mentor = { id: string; professional_title?: string | null; experience_description?: string | n / +type Mentor = { id: string; professional_title?: string | null; experience_description?: string | n
  [CHANGED] app/candidate/mentors.tsx (+34/-18) | -const FOUNDER_ID = 'e251486e-c21a-49f4-8ab7-ce808785638a'; / -  session_price_inr?: number | null; // mentor’s own price
  [CHANGED] app/lp/lazysectionslp.tsx (+12/-51) | -const MentorCard = ({ m, displayPrice, totalSessions, isNewMentor, averageRating, showRating, hasSl / +const MentorCard = ({ m, displayPrice, totalSessions, isNewMentor, averageRating, showRating, hasSl
  [CHANGED] app/mentors.tsx (+11/-21) | -// Founder mentor ID — shows "Free" intro call, matching landing page logic / -const FOUNDER_ID = 'e251486e-c21a-49f4-8ab7-ce808785638a';
  [CHANGED] app/mentors/[id].tsx (+9/-8) | +  intro_call_price?: number | null; / -  const introPrice  = Math.round(mockPrice * 0.20);
  [CHANGED] components/LazySections.tsx (+10/-51) | -const MentorCard = ({ m, displayPrice, totalSessions, isNewMentor, averageRating, showRating, hasSl / +const MentorCard = ({ m, displayPrice, totalSessions, isNewMentor, averageRating, showRating, hasSl
  [CHANGED] public/sitemap.xml (+20/-20)
  [CHANGED] services/payment.service.ts (+14/-16)

*[Day +2 after 2026-03-24: code: Aome changes]*
*[Day +2 after 2026-03-24: code: SEO changes]*
*[Day +2 after 2026-03-24: ads: 1 negative broad match keyword removed]*

**GA4 METRICS**
- Sessions: 19 total (CPC: 11 (-29% vs 7d avg, ↓ worse), Organic: 7, Direct: 0)
- CPC bounce rate: 27% (-0.1pp vs 7d avg, ↓ better) | Avg session duration: 38s (-22% vs 7d avg, ↓ worse)
- Key events: signup_initiate: 1
- Landing pages: /lp/pm: 6, /lp/da: 4, /: 2, /mentor/bookings: 2, (not set): 1, /auth/sign-in: 1

---

### 2026-03-25

*[Day +1 after 2026-03-24: code: Aome changes]*
*[Day +1 after 2026-03-24: code: SEO changes]*
*[Day +1 after 2026-03-24: ads: 1 negative broad match keyword removed]*

**GA4 METRICS**
- Sessions: 26 total (CPC: 22 (+45% vs 7d avg, ↑ better), Organic: 3, Direct: 0)
- CPC bounce rate: 41% (-0.0pp vs 7d avg, ↓ better) | Avg session duration: 80s (+33% vs 7d avg, ↑ better)
- Key events: signup_initiate: 1
- Landing pages: /lp/da: 12, /lp/pm: 8, (not set): 2, /: 2, /auth/sign-in: 1, /interviews/data-analytics: 1

---

### 2026-03-24

**CODE CHANGES**
- `2c75309`: Aome changes
  [CHANGED] app/auth/sign-up.tsx (+2/-1)
  [CHANGED] app/candidate/index.tsx (+10/-5) | +const FOUNDER_ID = 'e251486e-c21a-49f4-8ab7-ce808785638a'; / +  const isFree = m.id === FOUNDER_ID;
  [CHANGED] app/candidate/mentors.tsx (+5/-3) | +const FOUNDER_ID = 'e251486e-c21a-49f4-8ab7-ce808785638a'; / -                          Per booking (2 sessions)
  [CHANGED] services/auth.service.ts (+6/-4)
  [CHANGED] services/payment.service.ts (+2/-2)
- `c466eb2`: SEO changes
  [CHANGED] app/blog/[slug].tsx (+17/-6) | -  useWindowDimensions, / +  Dimensions,
  [CHANGED] app/blog/index.tsx (+23/-11) | -  useWindowDimensions, / +  Dimensions,
  [CHANGED] app/candidate/bookings.tsx (+92/-21) | +  // Tab state / +  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');
  [CHANGED] app/index.tsx (+12/-4) | -  useWindowDimensions, / +  Dimensions,
  [CHANGED] app/interviews/data-analytics.tsx (+6/-10) | -        <title>Data Analyst Mock interviews | Master SQL, Business Analytics & Case studies</title> / -        <meta name="description" content="Ace Data Analyst interviews at Amazon, Flipkart, Swiggy w
  [CHANGED] app/interviews/data-science.tsx (+8/-9) | -        <title>Data Science Interview Prep | Master ML Algorithms, Model Debugging & Python</title> / -        <meta name="description" content="Ace Data Science interviews at Google, Amazon, Meta with 
  [CHANGED] app/interviews/hr.tsx (+7/-7) | -        <title>HR Interview Preparation | Master HRBP, Conflict Resolution & People Analytics</titl / -        <meta name="description" content="Ace HR interviews at Amazon, Google, Flipkart with expert
  [CHANGED] app/interviews/product-management.tsx (+7/-11) | -        <title>Mock interviews with experienced PMs </title> / -        <meta name="description" content="Practice product sense, execution, technical design, anal
  [CHANGED] app/lp/[role].tsx (+50/-8) | -﻿import React, { memo, useMemo, useRef, useState, lazy, Suspense } from "react"; / +﻿import React, { memo, useMemo, useRef, useState, useEffect, lazy, Suspense } from "react";
  [CHANGED] app/lp/lazysectionslp.tsx (+54/-27) | -  { q: "What will the detailed feedback be like?", a: "You don't just get a 'pass/fail'. You will g / -  { q: "What happens when the mentor does not show up for the session?", a: "You will be refunded t
  [CHANGED] app/mentor/bookings.tsx (+90/-22) | +  // Tab State / +  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');
  [CHANGED] components/LazySections.tsx (+22/-7) | -  useWindowDimensions, / +  Dimensions,
  [CHANGED] package.json (+2/-1)
  [CHANGED] public/robots.txt (+1/-0)
  [CHANGED] public/sitemap.xml (+120/-24)
  [NEW] sitemap.xml (+161/-0)

**ADS CHANGES**
- [Data Analyst Sales]: 1 negative broad match keyword removed

*[Day +5 after 2026-03-19: code: Random fixes]*

**GA4 METRICS**
- Sessions: 22 total (CPC: 14 (-7% vs 7d avg, ↓ worse), Organic: 7, Direct: 0)
- CPC bounce rate: 50% (+0.1pp vs 7d avg, ↑ worse) | Avg session duration: 44s (-32% vs 7d avg, ↓ worse)
- Key events: signup_initiate: 1
- Landing pages: /lp/da: 10, /lp/pm: 4, (not set): 3, /auth/sign-in: 3, /blog/product-manager-interview-product-sense-mistakes: 1, /mentors: 1

---

### 2026-03-23

*[Day +4 after 2026-03-19: code: Random fixes]*
*[Day +7 after 2026-03-16: ads: 1 phrase match keyword added | 1 broad match keyword removed]*
*[Day +7 after 2026-03-16: ads: 1 broad match keyword removed]*

**GA4 METRICS**
- Sessions: 26 total (CPC: 18 (+30% vs 7d avg, ↑ better), Organic: 4, Direct: 0)
- CPC bounce rate: 39% (-0.0pp vs 7d avg, ↓ better) | Avg session duration: 23s (-70% vs 7d avg, ↓ worse)
- Key events: signup_initiate: 1
- Landing pages: /lp/da: 12, /lp/pm: 5, /mentors: 5, /: 3, /mentors/e251486e-c21a-49f4-8ab7-ce808785638a: 1

---

### 2026-03-22

*[Day +3 after 2026-03-19: code: Random fixes]*
*[Day +6 after 2026-03-16: ads: 1 phrase match keyword added | 1 broad match keyword removed]*
*[Day +6 after 2026-03-16: ads: 1 broad match keyword removed]*

**GA4 METRICS**
- Sessions: 21 total (CPC: 13 (-26% vs 7d avg, ↓ worse), Organic: 3, Direct: 0)
- CPC bounce rate: 23% (-0.2pp vs 7d avg, ↓ better) | Avg session duration: 37s (-53% vs 7d avg, ↓ worse)
- Key events: signup_initiate: 1
- Landing pages: /lp/da: 8, /lp/pm: 4, (not set): 3, /candidate: 2, /mentors: 2, /: 1

---

### 2026-03-21

*[Day +2 after 2026-03-19: code: Random fixes]*
*[Day +5 after 2026-03-16: ads: 1 phrase match keyword added | 1 broad match keyword removed]*
*[Day +5 after 2026-03-16: ads: 1 broad match keyword removed]*

**GA4 METRICS**
- Sessions: 21 total (CPC: 11 (-35% vs 7d avg, ↓ worse), Organic: 6, Direct: 0)
- CPC bounce rate: 45% (+0.0pp vs 7d avg, ↑ worse) | Avg session duration: 112s (+70% vs 7d avg, ↑ better)
- Key events: signup_initiate: 1
- Landing pages: /auth/sign-in: 4, /lp/pm: 4, (not set): 3, /lp/da: 3, /candidate/bookings: 2, /: 1

---

### 2026-03-20

*[Day +1 after 2026-03-19: code: Random fixes]*
*[Day +4 after 2026-03-16: ads: 1 phrase match keyword added | 1 broad match keyword removed]*
*[Day +4 after 2026-03-16: ads: 1 broad match keyword removed]*

**GA4 METRICS**
- Sessions: 19 total (CPC: 10 (-46% vs 7d avg, ↓ worse), Organic: 4, Direct: 0)
- CPC bounce rate: 40% (-0.1pp vs 7d avg, ↓ better) | Avg session duration: 32s (-64% vs 7d avg, ↓ worse)
- Landing pages: /lp/pm: 8, /: 3, /mentors: 3, (not set): 2, /auth/sign-in: 1, /lp/da: 1

---

### 2026-03-19

**CODE CHANGES**
- `c6d4b79`: Random fixes
  [CHANGED] app/candidate/[id].tsx (+77/-38) | -function BookNowPanel({ sType, price, bundleSave, s1ok, s2ok, s3ok, allOk, tried, onBook, isFreeFou / +function BookNowPanel({ sType, price, bundleSave, s1ok, s2ok, s3ok, allOk, tried, onBook, isFreeFou
  [CHANGED] app/candidate/pgscreen.tsx (+28/-1) | -    if (document.getElementById('razorpay-sdk')) return resolve(true); / +    // If window.Razorpay is already available, no need to do anything
  [CHANGED] app/lp/[role].tsx (+11/-0) | +            <TouchableOpacity / +              onPress={() => handleViewMentors("hero_secondary")}
  [CHANGED] app/mentors.tsx (+1/-1)
  [CHANGED] app/mentors/[id].tsx (+28/-1) | +      {allOk && ( / +        <View style={{ marginTop: 12, backgroundColor: "#F0FDFA", borderRadius: 10, padding: 12, bo

*[Day +3 after 2026-03-16: ads: 1 phrase match keyword added | 1 broad match keyword removed]*
*[Day +3 after 2026-03-16: ads: 1 broad match keyword removed]*
*[Day +3 after 2026-03-16: ads: 1 phrase match keyword added | 1 broad match keyword removed]*

**GA4 METRICS**
- Sessions: 23 total (CPC: 20 (+10% vs 7d avg, ↑ better), Organic: 2, Direct: 0)
- CPC bounce rate: 55% (+0.1pp vs 7d avg, ↑ worse) | Avg session duration: 15s (-84% vs 7d avg, ↓ worse)
- Key events: signup_initiate: 3
- Landing pages: /lp/da: 10, /lp/pm: 8, (not set): 2, /: 2, /mentors: 1

---

### 2026-03-18

*[Day +2 after 2026-03-16: ads: 1 phrase match keyword added | 1 broad match keyword removed]*
*[Day +2 after 2026-03-16: ads: 1 broad match keyword removed]*
*[Day +2 after 2026-03-16: ads: 1 phrase match keyword added | 1 broad match keyword removed]*

**GA4 METRICS**
- Sessions: 23 total (CPC: 20 (+9% vs 7d avg, ↑ better), Organic: 2, Direct: 0)
- CPC bounce rate: 35% (-0.1pp vs 7d avg, ↓ better) | Avg session duration: 160s (+94% vs 7d avg, ↑ better)
- Key events: signup_initiate: 2
- Landing pages: /lp/da: 13, /lp/pm: 7, (not set): 2, /mentors: 1

---

### 2026-03-17

*[Day +1 after 2026-03-16: ads: 1 phrase match keyword added | 1 broad match keyword removed]*
*[Day +1 after 2026-03-16: ads: 1 broad match keyword removed]*
*[Day +1 after 2026-03-16: ads: 1 phrase match keyword added | 1 broad match keyword removed]*

**GA4 METRICS**
- Sessions: 19 total (CPC: 13 (-29% vs 7d avg, ↓ worse), Organic: 4, Direct: 0)
- CPC bounce rate: 38% (-0.1pp vs 7d avg, ↓ better) | Avg session duration: 73s (-10% vs 7d avg, ↓ worse)
- Key events: signup_initiate: 2
- Landing pages: /lp/da: 10, /mentors: 3, (not set): 2, /lp/pm: 2, /: 1, /auth/sign-in: 1

---

### 2026-03-16

**ADS CHANGES**
- [Data Analyst Sales] > DA mock interview: 1 phrase match keyword added | 1 broad match keyword removed
- [Data Analyst Sales] > DA mock interview: 1 broad match keyword removed
- [Data Analyst Sales] > DA mock interview: 1 phrase match keyword added | 1 broad match keyword removed
- [Data Analyst Sales] > DA mock interview: 1 broad match keyword removed | 1 phrase match keyword added
- [Data Analyst Sales] > DA mock interview: 1 broad match keyword removed
- [Data Analyst Sales] > DA mock interview: 1 phrase match keyword added | 1 exact match keyword removed
- [Data Analyst Sales] > DA mock interview: 1 broad match keyword removed | 1 phrase match keyword added
- [Data Analyst Sales] > DA mock interview: 1 broad match keyword removed | 1 phrase match keyword added
- [Data Analyst Sales] > DA mock interview: 1 broad match keyword removed
- [Data Analyst Sales] > DA mock interview: 1 broad match keyword removed | 1 phrase match keyword added
- [Data Analyst Sales] > DA mock interview: 1 phrase match keyword added | 1 broad match keyword removed
- [Data Analyst Sales] > DA mock interview: 1 phrase match keyword added | 1 broad match keyword removed
- [Data Analyst Sales] > DA mock interview: 1 broad match keyword removed
- [Data Analyst Sales] > DA mock interview: 1 broad match keyword removed
- [Data Analyst Sales] > DA mock interview: 1 broad match keyword added
- [Data Analyst Sales] > DA mock interview: 1 broad match keyword added
- [Data Analyst Sales] > DA mock interview: 1 broad match keyword added
- [Data Analyst Sales] > DA mock interview: 1 broad match keyword added
- [Data Analyst Sales] > DA mock interview: 1 broad match keyword added
- [Data Analyst Sales] > DA mock interview: 1 broad match keyword added
- [Data Analyst Sales] > DA mock interview: 1 broad match keyword added
- [Data Analyst Sales] > DA mock interview: 1 broad match keyword added
- [Data Analyst Sales] > DA mock interview: 1 broad match keyword added
- [Data Analyst Sales] > DA mock interview: 1 broad match keyword added
- [Data Analyst Sales] > DA mock interview: 1 broad match keyword added
- [Data Analyst Sales] > DA mock interview: 1 broad match keyword added
- [Data Analyst Sales] > DA mock interview: 1 broad match keyword added

*[Day +1 after 2026-03-15: code: LP DA changes]*
*[Day +1 after 2026-03-15: code: LP changes]*
*[Day +1 after 2026-03-15: ads: 1 responsive search ad changed | Headline was "Land Your Dream Job" | Headl]*

**GA4 METRICS**
- Sessions: 13 total (CPC: 10 (-44% vs 7d avg, ↓ worse), Organic: 2, Direct: 0)
- CPC bounce rate: 50% (+0.1pp vs 7d avg, ↑ worse) | Avg session duration: 108s (+4% vs 7d avg, ↑ better)
- Landing pages: /lp/da: 8, /: 2, /lp/pm: 2, (not set): 1

---

### 2026-03-15

**CODE CHANGES**
- `465e031`: LP DA changes
  [CHANGED] app/lp/[role].tsx (+33/-4) | +const HERO_SUB: Record<string, string> = { / +  pm: "Practice product sense, execution, and strategy questions with real PMs. Get feedback that t
  [CHANGED] app/lp/lazysectionslp.tsx (+153/-42) | +// --- Role-specific problems (shown in a separate section after How It Works) --- / +const ROLE_PROBLEMS: Record<string, { icon: string; title: string; text: string }[]> = {
- `d280ba7`: LP changes
  [CHANGED] app/lp/[role].tsx (+25/-8) | +  // ─── Engagement tracking ──────────────────────────────────────────────────── / +  const hasInteracted = useRef(false);
  [CHANGED] app/lp/lazysectionslp.tsx (+60/-12) | -  <View style={[styles.section, { paddingTop: 20 }]}> / +  <View nativeID="section-problem" style={[styles.section, { paddingTop: 20 }]}>
  [CHANGED] app/mentors.tsx (+378/-266) | +// Founder mentor ID — shows "Free" intro call, matching landing page logic / +const FOUNDER_ID = 'e251486e-c21a-49f4-8ab7-ce808785638a';
  [CHANGED] app/mentors/[id].tsx (+26/-16) | -  useEffect(() => { fetchMentor(); initAuth(); }, [id, user]); / +  useEffect(() => { fetchMentor(); }, [id]);

**ADS CHANGES**
- [PM Sales] > Competitor: 1 responsive search ad changed | Headline was "Land Your Dream Job" | Headline was "Better Than exponent?" | Headline is "Better than igotanoffer" | Headline is "tryexponent alternative" | Headline is "Better than pramp?" | Headline is "Prepfully alternative" | Headline is "interview kickstart alternate" | Final URL is "https://crackjobs.com/lp/pm"
- [Data Analyst Sales] > BA mock interview: 3 exact match keywords added
- [Data Analyst Sales] > BA mock interview: 4 broad match keywords paused | data analyst about: Status changed from enabled to paused | data analyst job description: Status changed from enabled to paused | tell me about your skills and experience: Status changed from enabled to paused | candidate for job: Status changed from enabled to paused
- [Data Analyst Sales] > BA mock interview: 5 broad match keywords paused | data analytics manager: Status changed from enabled to paused | data analyst career: Status changed from enabled to paused | job interview: Status changed from enabled to paused | data analyst skills: Status changed from enabled to paused | data analyst how to: Status changed from enabled to paused
- [Data Analyst Sales] > BA mock interview: 1 responsive search ad created | Description is "Identify your weak spots before the real interview. Anonymous, pay-per-session." | Description is "Practice user stories, BRDs, stakeholder rounds & SQL with real Business Analyst experts." | Headline is "Practice A/B Tests & Metrics" | Headline is "Train With Experts, Not Peers" | Headline is "Learn What FAANG Companies Ask" | Headline is "Business
- [Data Analyst Sales]: 13 negative broad match keywords added
- [Account level]: 1 responsive search ad changed | Final URL is "https://crackjobs.com/lp/da"
- [Data Analyst Sales]: Bid strategy type is "Maximize conversions" | Standard goals changed | Sign-ups (Website) added
- [Data Analyst Sales] > DA mock interview: 1 responsive search ad created | Description is "Identify your weak spots before the real interview. Anonymous, pay-per-session." | Description is "Get your next role with interview practice with real Data Analysts from top companies." | Headline is "Data Analyst Mock Interview" | Description is "Practice SQL cases, Python, A/B testing & metrics with real Data Analyst interviewers." | Headline is 
- [Account level]: Data Analyst Sales: Budget amount is ₹700.00
- [PM Sales] > Exact match PM: 1 exact match keyword removed | 1 phrase match keyword added
- [PM Sales] > Exact match PM: 1 exact match keyword removed | 1 phrase match keyword added
- [PM Sales] > Exact match PM: 1 exact match keyword removed | 1 phrase match keyword enabled | "product manager mock interview": Status changed from paused to enabled
- [PM Sales] > Exact match PM: 1 phrase match keyword enabled | "product management mock interview": Status changed from paused to enabled | 1 exact match keyword removed
- [PM Sales] > Exact match PM: 1 exact match keyword removed
- [PM Sales] > Exact match PM: 1 exact match keyword removed | 1 phrase match keyword added
- [PM Sales] > Exact match PM: 1 phrase match keyword enabled | "pm interview practice": Status changed from paused to enabled | 1 broad match keyword removed

*[Day +2 after 2026-03-13: ads: 1 broad match keyword paused | interview practice: Status changed from enab]*
*[Day +3 after 2026-03-12: ads: 1 broad match keyword enabled | interview practice: Status changed from pau]*
*[Day +3 after 2026-03-12: ads: 1 broad match keyword added]*

**GA4 METRICS**
- Sessions: 55 total (CPC: 39 (+210% vs 7d avg, ↑ better), Organic: 3, Direct: 0)
- CPC bounce rate: 38% (-0.1pp vs 7d avg, ↓ better) | Avg session duration: 50s (-49% vs 7d avg, ↓ worse)
- Key events: signup_initiate: 6
- Landing pages: /lp/pm: 24, /lp/da: 16, /mentors: 10, /auth/sign-up: 2, (not set): 1, /interviews/data-analytics: 1

---

### 2026-03-14 LOW SIGNAL

*[Day +1 after 2026-03-13: ads: 1 broad match keyword paused | interview practice: Status changed from enab]*
*[Day +2 after 2026-03-12: ads: 1 broad match keyword enabled | interview practice: Status changed from pau]*
*[Day +2 after 2026-03-12: ads: 1 broad match keyword added]*

**GA4 METRICS**
- Sessions: 8 total (CPC: 7 (-43% vs 7d avg, ↓ worse), Organic: 0, Direct: 0)
- CPC bounce rate: 57% (+0.1pp vs 7d avg, ↑ worse) | Avg session duration: 22s (-83% vs 7d avg, ↓ worse)
- Key events: signup_initiate: 1
- Landing pages: /lp/pm: 7, /: 1

---

### 2026-03-13

**ADS CHANGES**
- [PM Sales] > mentorship: 1 broad match keyword paused | interview practice: Status changed from enabled to paused

*[Day +1 after 2026-03-12: ads: 1 broad match keyword enabled | interview practice: Status changed from pau]*
*[Day +1 after 2026-03-12: ads: 1 broad match keyword added]*
*[Day +1 after 2026-03-12: ads: 3 exact match keywords added]*

**GA4 METRICS**
- Sessions: 30 total (CPC: 20 (+103% vs 7d avg, ↑ better), Organic: 7, Direct: 0)
- CPC bounce rate: 45% (-0.1pp vs 7d avg, ↓ better) | Avg session duration: 206s (+112% vs 7d avg, ↑ better)
- Key events: signup_initiate: 4
- Landing pages: /lp/pm: 17, /: 5, (not set): 2, /about: 1, /auth/sign-in: 1, /candidate: 1

---

### 2026-03-12

**ADS CHANGES**
- [PM Sales] > mentorship: 1 broad match keyword enabled | interview practice: Status changed from paused to enabled
- [PM Sales] > Exact match PM: 1 broad match keyword added
- [PM Sales] > mentorship: 3 exact match keywords added
- [PM Sales] > mentorship: 9 broad match keywords paused | interview prep: Status changed from enabled to paused | interview practice: Status changed from enabled to paused | interview assessments: Status changed from enabled to paused | "product manager": Status changed from enabled to paused | "interview tips": Status changed from enabled to paused | mock interview: Status changed from enabled to paused | my interview: St
- [PM Sales] > mentorship: 1 phrase match keyword added | 1 broad match keyword removed
- [PM Sales] > mentorship: 1 phrase match keyword added | 1 broad match keyword removed
- [PM Sales] > Competitor: 1 responsive search ad created | Headline is "No Subscription." | Headline is "Mocks with experts not peers" | Description is "Unlike peer mock platforms, every CrackJobs session is with a vetted expert" | Description is "CrackJobs gives you a real PM interviewer tearing apart your answers 1:1." | Headline is "Honest. Expert PM Mocks" | Headline is "Real 1:1 Mocks Not Just Videos" | Headline is "P
- [PM Sales] > mentorship: 1 responsive search ad created | Headline is "Get Coached by Real PMs" | Headline is "Simulate an Upcoming PM round" | Headline is "Book PM Mentor Pay Per Session" | Description is "CrackJobs connects aspiring PMs with expert mentors for honest, structured coaching." | Headline is "1:1 PM Coaching With Experts" | Headline is "Honest Feedback From Real PMs" | Headline is "PM Coaching. No Subscripti
- [PM Sales] > Exact match PM: Ad group changed |   Ad group name changed from "Ad group 1" to "Exact match PM"
- [PM Sales] > Exact match PM: 6 exact match keywords added
- [PM Sales] > Exact match PM: 4 phrase match keywords paused | "mock interview product manager": Status changed from enabled to paused | "product management mock interview": Status changed from enabled to paused | "pm interview practice": Status changed from enabled to paused | "product manager mock interview": Status changed from enabled to paused
- [PM Sales]: 1 negative broad match keyword added

*[Day +1 after 2026-03-11: ads: 1 broad match keyword removed]*
*[Day +1 after 2026-03-11: ads: 1 broad match keyword removed]*
*[Day +1 after 2026-03-11: ads: 1 broad match keyword removed]*

**GA4 METRICS**
- Sessions: 21 total (CPC: 18 (+133% vs 7d avg, ↑ better), Organic: 1, Direct: 0)
- CPC bounce rate: 39% (-0.2pp vs 7d avg, ↓ better) | Avg session duration: 69s (-50% vs 7d avg, ↓ worse)
- Key events: payment_success: 1, signup_initiate: 4
- Landing pages: /lp/pm: 17, (not set): 2, /: 2, /mentors: 1

---

### 2026-03-11

**ADS CHANGES**
- [PM Sales] > Exact match PM: 1 broad match keyword removed
- [PM Sales] > Exact match PM: 1 broad match keyword removed
- [PM Sales] > Exact match PM: 1 broad match keyword removed
- [PM Sales] > Exact match PM: 1 broad match keyword removed

*[Day +3 after 2026-03-08: ads: 4 broad match keywords added]*
*[Day +5 after 2026-03-06: code: FREE fix]*
*[Day +5 after 2026-03-06: code: One click sign up and payment]*

**GA4 METRICS**
- Sessions: 27 total (CPC: 22 (+367% vs 7d avg, ↑ better), Organic: 2, Direct: 0)
- CPC bounce rate: 41% (-0.1pp vs 7d avg, ↓ better) | Avg session duration: 48s (-69% vs 7d avg, ↓ worse)
- Key events: signup_initiate: 5
- Landing pages: /lp/pm: 21, /auth/sign-in: 6, (not set): 2, /: 1, /mentor/session/60ee8ab2-ea32-4395-b989-d2287a9f1cbc: 1

---

### 2026-03-10

*[Day +2 after 2026-03-08: ads: 4 broad match keywords added]*
*[Day +4 after 2026-03-06: code: FREE fix]*
*[Day +4 after 2026-03-06: code: One click sign up and payment]*

**GA4 METRICS**
- Sessions: 18 total (CPC: 13 (+296% vs 7d avg, ↑ better), Organic: 2, Direct: 0)
- CPC bounce rate: 46% (-0.0pp vs 7d avg, ↓ better) | Avg session duration: 71s (-55% vs 7d avg, ↓ worse)
- Key events: signup_initiate: 2
- Landing pages: /lp/pm: 13, /: 4, /mentor/bookings: 1, /mentors/e251486e-c21a-49f4-8ab7-ce808785638a: 1

---

### 2026-03-09 LOW SIGNAL

*[Day +1 after 2026-03-08: ads: 4 broad match keywords added]*
*[Day +3 after 2026-03-06: code: FREE fix]*
*[Day +3 after 2026-03-06: code: One click sign up and payment]*

**GA4 METRICS**
- Sessions: 9 total (CPC: 7 (+104% vs 7d avg, ↑ better), Organic: 2, Direct: 0)
- CPC bounce rate: 43% (-0.1pp vs 7d avg, ↓ better) | Avg session duration: 261s (+113% vs 7d avg, ↑ better)
- Key events: signup_initiate: 3
- Landing pages: /lp/pm: 6, (not set): 1, /: 1, /auth/sign-in: 1

---

### 2026-03-08 LOW SIGNAL

**ADS CHANGES**
- [PM Sales] > Exact match PM: 4 broad match keywords added

*[Day +2 after 2026-03-06: code: FREE fix]*
*[Day +2 after 2026-03-06: code: One click sign up and payment]*
*[Day +3 after 2026-03-05: code: LP and homepage messaging change]*

**GA4 METRICS**
- Sessions: 4 total (CPC: 1 (-76% vs 7d avg, ↓ worse), Organic: 1, Direct: 0)
- CPC bounce rate: 100% (+0.6pp vs 7d avg, ↑ worse) | Avg session duration: 5s (-96% vs 7d avg, ↓ worse)
- Landing pages: /lp/pm: 3, /: 2, /auth/forgot-password: 1

---

### 2026-03-07 LOW SIGNAL

*[Day +1 after 2026-03-06: code: FREE fix]*
*[Day +1 after 2026-03-06: code: One click sign up and payment]*
*[Day +2 after 2026-03-05: code: LP and homepage messaging change]*

**GA4 METRICS**
- Sessions: 9 total (CPC: 5 (+40% vs 7d avg, ↑ better), Organic: 1, Direct: 0)
- CPC bounce rate: 40% (+0.0pp vs 7d avg, ↑ worse) | Avg session duration: 220s (+115% vs 7d avg, ↑ better)
- Key events: payment_success: 1, signup_initiate: 2
- Landing pages: /lp/pm: 5, /mentors: 2, /about: 1, /auth/sign-in: 1

---

### 2026-03-06 LOW SIGNAL

**CODE CHANGES**
- `2cb7f7c`: FREE fix
  [CHANGED] package.json (+1/-1)
- `3eff30b`: chore: FORCE update dist with FREE UI
- `431b920`: One click sign up and payment
  [CHANGED] app/auth/sign-in.tsx (+173/-149) | +// app/auth/sign-in.tsx / -  View,
  [CHANGED] app/auth/sign-up.tsx (+149/-340) | -﻿import React, { useEffect, useState } from 'react'; / +﻿// app/auth/sign-up.tsx
  [CHANGED] app/candidate/[id].tsx (+264/-104) | -  web: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif", / +  web: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  [CHANGED] app/candidate/_layout.tsx (+62/-26) | -  // 🟢 Destructure setters to update store on refresh / +  const segments = useSegments();
  [CHANGED] app/candidate/booking-confirmed.tsx (+350/-46) | +﻿// app/candidate/booking-confirmed.tsx / +  View, Text, TouchableOpacity, StyleSheet, Platform, ScrollView, ActivityIndicator,
  [NEW] app/candidate/complete-profile.tsx (+122/-0) | +﻿// app/candidate/complete-profile.tsx / +// Mandatory screen: blocks dashboard access until full_name and professional_title are set.
  [CHANGED] app/candidate/pgscreen.tsx (+26/-83) | +    isNewGuest, // 🟢 Guest flag — routes to booking-confirmed instead of bookings after payment / +    isNewGuest?: string;
  [CHANGED] app/candidate/profile.tsx (+219/-192) | -﻿import React, { useEffect, useState } from 'react'; / +﻿// app/candidate/profile.tsx
  [CHANGED] app/candidate/review.tsx (+35/-162) | -const SYSTEM_FONT = Platform.select({ / -  web: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
  [CHANGED] app/index.tsx (+87/-229) | +  useWindowDimensions, / +// ─── GTM DataLayer Helper ─────────────────────────────────────────────────────
  [CHANGED] app/lp/[role].tsx (+22/-0) | +// ─── GTM DataLayer Helper ───────────────────────────────────────────────────── / +const pushToDataLayer = (eventName: string, data: Record<string, any>) => {
  [CHANGED] app/lp/lazysectionslp.tsx (+24/-4) | +// ─── GTM DataLayer Helper ───────────────────────────────────────────────────── / +const pushToDataLayer = (eventName: string, data: Record<string, any>) => {
  [CHANGED] app/mentors/[id].tsx (+754/-394) | -  View, / -  ScrollView,
  [CHANGED] components/LazySections.tsx (+385/-491) | -// 🟢 Optimized Icons / -  FeedbackIcon, VideoIcon, StarIcon,
  [CHANGED] services/auth.service.ts (+22/-1)
  [CHANGED] services/payment.service.ts (+100/-36)

*[Day +1 after 2026-03-05: code: LP and homepage messaging change]*
*[Day +1 after 2026-03-05: ads: 1 responsive search ad changed | Headline was "Browse mentors and book" | D]*
*[Day +1 after 2026-03-05: ads: 1 exact match keyword added | 1 phrase match keyword removed]*

**GA4 METRICS**
- Sessions: 20 total (CPC: 3 (-30% vs 7d avg, ↓ worse), Organic: 2, Direct: 0)
- CPC bounce rate: 67% (+0.3pp vs 7d avg, ↑ worse) | Avg session duration: 7s (-94% vs 7d avg, ↓ worse)
- Key events: payment_success: 11
- Landing pages: /: 8, /lp/pm: 7, /auth/sign-in: 2, /mentors: 2, /mentors/e251486e-c21a-49f4-8ab7-ce808785638a: 2, /auth/sign-up: 1

---

### 2026-03-05 LOW SIGNAL

**CODE CHANGES**
- `cf0383c`: LP and homepage messaging change
  [CHANGED] app/index.tsx (+22/-372) | -    { emoji: '📝', title: 'Pick Your Track', desc: 'Choose your domain and the specific interview to / -    { emoji: '👨‍💼', title: 'Book a Mentor', desc: 'Select from verified experts at top companies' }
  [CHANGED] app/lp/[role].tsx (+49/-159) | -// Role-Specific Content / -const ROLE_CONTENT: Record<string, { title: string; highlight: string }> = {
  [CHANGED] app/lp/lazysectionslp.tsx (+210/-360) | -  { name: "Sneha P.", role: "Data Scientist", company: "Musigma", avatar: "👩‍🔬", rating: 5, quote:  / -  { name: "Amit K.", role: "HR Manager", company: "Flipkart", avatar: "👨‍💼", rating: 5, quote: "Pra
  [CHANGED] components/LazySections.tsx (+79/-65) | -  { id: 1, name: 'P.K.', role: 'Product Manager', company: 'Funded Startup', text: 'The anonymous f / -  { id: 2, name: 'A.M.', role: 'Data Analyst', company: 'Analytics Firm', text: 'The SQL round prac

**ADS CHANGES**
- [PM Sales] > Exact match PM: 1 responsive search ad changed | Headline was "Browse mentors and book" | Description was "Mock interviews with real hirinig managers from top companies. Starting from Rs 800" | Description was "Practice Product Sense, Product Strategy, Execution, Analyitcs or Technical PM skills" | Description was "Anonymous interviews. Tier Pricing- Bronze (800-2k), Silver (2k-4.5k), Gold (5k-7k)" | Description 
- [PM Sales] > Exact match PM: 1 exact match keyword added | 1 phrase match keyword removed

*[Day +2 after 2026-03-03: ads: Campaign bid strategy type changed from "Maximize clicks" to "Maximize conv]*
*[Day +3 after 2026-03-02: code: LP and sign in mobile fix]*
*[Day +3 after 2026-03-02: code: LP changes and flow changes]*

**GA4 METRICS**
- Sessions: 14 total (CPC: 3 (-43% vs 7d avg, ↓ worse), Organic: 2, Direct: 0)
- CPC bounce rate: 67% (+0.3pp vs 7d avg, ↑ worse) | Avg session duration: 367s (+379% vs 7d avg, ↑ better)
- Key events: payment_success: 2, signup_initiate: 1
- Landing pages: /lp/pm: 7, /: 2, /auth/sign-up: 2, /candidate/review: 2, /candidate/bookings: 1, /mentors/e251486e-c21a-49f4-8ab7-ce808785638a: 1

---

### 2026-03-04 LOW SIGNAL

*[Day +1 after 2026-03-03: ads: Campaign bid strategy type changed from "Maximize clicks" to "Maximize conv]*
*[Day +2 after 2026-03-02: code: LP and sign in mobile fix]*
*[Day +2 after 2026-03-02: code: LP changes and flow changes]*

**GA4 METRICS**
- Sessions: 10 total (CPC: 1 (-84% vs 7d avg, ↓ worse), Organic: 4, Direct: 0)
- CPC bounce rate: 0% (-0.4pp vs 7d avg, ↓ better) | Avg session duration: 150s (+155% vs 7d avg, ↑ better)
- Landing pages: /: 3, /lp/pm: 3, /candidate/bookings: 2, /about: 1, /mentor/profile: 1

---

### 2026-03-03 LOW SIGNAL

**ADS CHANGES**
- [PM Sales]: Campaign bid strategy type changed from "Maximize clicks" to "Maximize conversions"

*[Day +1 after 2026-03-02: code: LP and sign in mobile fix]*
*[Day +1 after 2026-03-02: code: LP changes and flow changes]*
*[Day +1 after 2026-03-02: ads: 1 responsive search ad changed | Headline is "Browse mentors and book" | Fi]*

**GA4 METRICS**
- Sessions: 5 total (CPC: 3 (-56% vs 7d avg, ↓ worse), Organic: 0, Direct: 0)
- CPC bounce rate: 33% (-0.1pp vs 7d avg, ↓ better) | Avg session duration: 87s (+84% vs 7d avg, ↑ better)
- Landing pages: /lp/pm: 2, (not set): 1, /: 1, /candidate/bookings: 1, /mentors: 1

---

### 2026-03-02

**CODE CHANGES**
- `99325b9`: LP and sign in mobile fix
  [CHANGED] app/auth/sign-in.tsx (+22/-7) | +  Keyboard / -        // Handle Booking Redirect
  [CHANGED] app/auth/sign-up.tsx (+1/-1)
  [CHANGED] app/candidate/[id].tsx (+1/-1)
  [CHANGED] app/candidate/review.tsx (+70/-19) | -  // Extract Params / -  const parsedSlotsIso = slotsIso ? JSON.parse(slotsIso) : [];
  [CHANGED] app/lp/[role].tsx (+2/-1)
  [CHANGED] app/lp/lazysectionslp.tsx (+15/-7) | -// EXACT MENTOR CARD FROM MENTORS.TSX / +// RESPONSIVE MENTOR CARD
  [CHANGED] app/mentor/bookings.tsx (+142/-296) | -  RefreshControl, StatusBar, Modal, Platform, Alert, Linking / +  RefreshControl, StatusBar, Modal, Platform, Alert, Linking, Text
  [CHANGED] app/mentors.tsx (+2/-2)
  [CHANGED] app/mentors/[id].tsx (+106/-28) | +const IcoInfo      = ({ s = 16, c = TEAL }: { s?: number; c?: string }) => (<Svg width={s} height={ / +const SEO: Record<SessionType, { title: string; expect: string; afterTitle: string; after: string }
  [CHANGED] components/LazySections.tsx (+353/-71) | +  ActivityIndicator / -// 🟢 NEW: Import Optimized Icons
- `2c22c4f`: LP changes and flow changes
  [CHANGED] app/auth/sign-in.tsx (+22/-4) | +  const params = useLocalSearchParams(); / +        // Candidate Flow
  [CHANGED] app/auth/sign-up.tsx (+36/-74) | +  const params = useLocalSearchParams(); / -    // Common validations
  [CHANGED] app/candidate/[id].tsx (+502/-618) | -  View, / -  ScrollView,
  [CHANGED] app/candidate/bookings.tsx (+18/-1) | +    // ── Intro call: use domain-specific INTRO_CALL_TEMPLATES ────────────── / +    if (session.session_type === 'intro') {
  [CHANGED] app/candidate/index.tsx (+151/-573) | +// app/candidate/index.tsx / -  Pressable
  [NEW] app/candidate/review.tsx (+193/-0) | +﻿// app/candidate/review.tsx / +const SYSTEM_FONT = Platform.select({
  [CHANGED] app/candidate/session/[id].tsx (+412/-356) | -﻿// app/candidate/session/[id].tsx / +﻿// app/mentor/session/[id].tsx
  [CHANGED] app/lp/[role].tsx (+62/-166) | -const ROLE_CONTENT: Record<string, { title: string; highlight: string; sub: string }> = { / +const ROLE_CONTENT: Record<string, { title: string; highlight: string }> = {
  [CHANGED] app/lp/lazysectionslp.tsx (+411/-342) | -﻿import React, { memo } from "react"; / +﻿import React, { memo, useEffect, useState } from "react";
  [CHANGED] app/mentor/bookings.tsx (+42/-1) | +    // ── Intro call: use domain-specific INTRO_CALL_TEMPLATES ────────────── / +    if (session.session_type === 'intro') {
  [CHANGED] app/mentor/session/[id].tsx (+31/-20) | -      if (session.package?.interview_profile_id) { / -        const { data: profileData } = await supabase
  [CHANGED] app/mentors.tsx (+189/-458) | +  Image, / -// ============================================
  [CHANGED] app/mentors/[id].tsx (+523/-793) | +  TextInput, / +  Alert,

**ADS CHANGES**
- [PM Sales] > Exact match PM: 1 responsive search ad changed | Headline is "Browse mentors and book" | Final URL is "https://crackjobs.com/lp/pm"

*[Day +1 after 2026-03-01: ads: 1 responsive search ad changed | Headline is "Free session with the founder]*
*[Day +5 after 2026-02-25: ads: 1 negative broad match keyword added]*
*[Day +7 after 2026-02-23: code: LP changes]*

**GA4 METRICS**
- Sessions: 27 total (CPC: 8 (+24% vs 7d avg, ↑ better), Organic: 5, Direct: 0)
- CPC bounce rate: 75% (+0.3pp vs 7d avg, ↑ worse) | Avg session duration: 23s (-56% vs 7d avg, ↓ worse)
- Key events: payment_success: 3, signup_initiate: 8
- Landing pages: /lp/pm: 12, /auth/sign-in: 5, /: 4, /mentors/e251486e-c21a-49f4-8ab7-ce808785638a: 4, (not set): 3, /mentors: 2

---

### 2026-03-01 LOW SIGNAL

**ADS CHANGES**
- [PM Sales] > Exact match PM: 1 responsive search ad changed | Headline is "Free session with the founder" | Final URL is "https://crackjobs.com/lp/pm"

*[Day +4 after 2026-02-25: ads: 1 negative broad match keyword added]*
*[Day +6 after 2026-02-23: code: LP changes]*
*[Day +7 after 2026-02-22: code: Price change]*

**GA4 METRICS**
- Sessions: 13 total (CPC: 6 (-11% vs 7d avg, ↓ worse), Organic: 0, Direct: 0)
- CPC bounce rate: 33% (-0.1pp vs 7d avg, ↓ better) | Avg session duration: 57s (-4% vs 7d avg, ↓ worse)
- Key events: initiate_payment: 2, payment_success: 1, signup_initiate: 2
- Landing pages: /lp/pm: 5, (not set): 2, /mentors: 2, /mentors.: 2, /mentors/e251486e-c21a-49f4-8ab7-ce808785638a: 2, /: 1

---

### 2026-02-28 LOW SIGNAL

*[Day +3 after 2026-02-25: ads: 1 negative broad match keyword added]*
*[Day +5 after 2026-02-23: code: LP changes]*
*[Day +6 after 2026-02-22: code: Price change]*

**GA4 METRICS**
- Sessions: 7 total (CPC: 1 (-86% vs 7d avg, ↓ worse), Organic: 4, Direct: 0)
- CPC bounce rate: 0% (-0.5pp vs 7d avg, ↓ better) | Avg session duration: 26s (-53% vs 7d avg, ↓ worse)
- Key events: schedule_time: 1, signup_initiate: 3
- Landing pages: /: 4, /auth/sign-in: 1, /auth/sign-up: 1, /candidate/bookings: 1, /lp/pm: 1

---

### 2026-02-27

*[Day +2 after 2026-02-25: ads: 1 negative broad match keyword added]*
*[Day +4 after 2026-02-23: code: LP changes]*
*[Day +5 after 2026-02-22: code: Price change]*

**GA4 METRICS**
- Sessions: 11 total (CPC: 8 (+10% vs 7d avg, ↑ better), Organic: 0, Direct: 0)
- CPC bounce rate: 38% (-0.2pp vs 7d avg, ↓ better) | Avg session duration: 173s (+398% vs 7d avg, ↑ better)
- Landing pages: /lp/pm: 8, (not set): 2, /: 1

---

### 2026-02-26

*[Day +1 after 2026-02-25: ads: 1 negative broad match keyword added]*
*[Day +3 after 2026-02-23: code: LP changes]*
*[Day +4 after 2026-02-22: code: Price change]*

**GA4 METRICS**
- Sessions: 20 total (CPC: 10 (+40% vs 7d avg, ↑ better), Organic: 4, Direct: 0)
- CPC bounce rate: 50% (-0.1pp vs 7d avg, ↓ better) | Avg session duration: 21s (-38% vs 7d avg, ↓ worse)
- Landing pages: /lp/pm: 9, /: 8, /mentors: 2, (not set): 1

---

### 2026-02-25

**ADS CHANGES**
- [PM Sales]: 1 negative broad match keyword added

*[Day +2 after 2026-02-23: code: LP changes]*
*[Day +3 after 2026-02-22: code: Price change]*
*[Day +3 after 2026-02-22: code: Intro call and bundle]*

**GA4 METRICS**
- Sessions: 18 total (CPC: 8 (+19% vs 7d avg, ↑ better), Organic: 2, Direct: 0)
- CPC bounce rate: 38% (-0.3pp vs 7d avg, ↓ better) | Avg session duration: 25s (-58% vs 7d avg, ↓ worse)
- Key events: initiate_payment: 1, signup_initiate: 4
- Landing pages: /lp/pm: 10, /about: 4, /: 2, /mentors: 2, (not set): 1

---

### 2026-02-24 LOW SIGNAL

*[Day +1 after 2026-02-23: code: LP changes]*
*[Day +2 after 2026-02-22: code: Price change]*
*[Day +2 after 2026-02-22: code: Intro call and bundle]*

**GA4 METRICS**
- Sessions: 28 total (CPC: 7 (+2% vs 7d avg, ↑ better), Organic: 2, Direct: 0)
- CPC bounce rate: 71% (+0.1pp vs 7d avg, ↑ worse) | Avg session duration: 8s (-89% vs 7d avg, ↓ worse)
- Key events: signup_initiate: 7
- Landing pages: /lp/pm: 12, /mentors: 7, /: 5, (not set): 3, /about: 3, /auth/sign-in: 1

---

### 2026-02-23 LOW SIGNAL

**CODE CHANGES**
- `36d9741`: LP changes
  [CHANGED] app/interviews/data-analytics.tsx (+1/-1)
  [CHANGED] app/interviews/data-science.tsx (+2/-2)
  [CHANGED] app/interviews/hr.tsx (+1/-1)
  [CHANGED] app/interviews/product-management.tsx (+2/-2)
  [CHANGED] app/lp/[role].tsx (+53/-27) | -  <TouchableOpacity  / -    nativeID={nativeID} 
  [CHANGED] app/lp/lazysectionslp.tsx (+622/-270) | +const BRAND_ORANGE = "#f58742"; / -  { 
  [CHANGED] components/LazySections.tsx (+164/-37) | -  FeedbackIcon, VideoIcon, StarIcon,  / -  BronzeBadge, SilverBadge, GoldBadge 

*[Day +1 after 2026-02-22: code: Price change]*
*[Day +1 after 2026-02-22: code: Intro call and bundle]*
*[Day +1 after 2026-02-22: ads: 1 responsive search ad changed | Headline is "Meet your mentor first" | Fin]*

**GA4 METRICS**
- Sessions: 18 total (CPC: 5 (-27% vs 7d avg, ↓ worse), Organic: 6, Direct: 0)
- CPC bounce rate: 60% (+0.0pp vs 7d avg, ↑ worse) | Avg session duration: 56s (-28% vs 7d avg, ↓ worse)
- Key events: signup_initiate: 3
- Landing pages: /lp/pm: 9, /: 4, /mentors: 2, /auth/sign-in: 1, /candidate/bookings: 1, /interviews/product-management: 1

---

### 2026-02-22

**CODE CHANGES**
- `f1ba5c2`: Price change
  [CHANGED] app/lp/lazysectionslp.tsx (+3/-3) | -    price: "₹3,500 - ₹6,000",  / +    price: "₹500 - ₹2,000", 
  [CHANGED] app/mentor/bookings.tsx (+1/-1)
  [CHANGED] components/LazySections.tsx (+3/-3) | -      price: '₹3,500 - ₹6,000', / +      price: '₹500 - ₹2,000',
  [CHANGED] services/payment.service.ts (+10/-6)
- `7665176`: Intro call and bundle
  [CHANGED] app/candidate/[id].tsx (+332/-110) | +type SessionType = 'intro' | 'mock' | 'bundle'; / +  // Session Type State
  [CHANGED] app/candidate/bookings.tsx (+43/-94) | -  const isPaid = session.package?.payment_status === 'paid'; / -  const skillName = session.skill_name || 'Interview Session';
  [CHANGED] app/candidate/index.tsx (+228/-87) | +// ============================================ / +// SESSION DESCRIPTIONS
  [CHANGED] app/candidate/pgscreen.tsx (+74/-118) | -﻿import React, { useState, useEffect, useRef } from 'react'; / +﻿// app/candidate/pgscreen.tsx
  [CHANGED] app/candidate/schedule.tsx (+379/-102) | -  View, StyleSheet, ScrollView, TouchableOpacity,  / -  ActivityIndicator, Alert, StatusBar
  [CHANGED] app/mentor/bookings.tsx (+1/-1)
  [CHANGED] app/mentors.tsx (+219/-80) | +// ============================================ / +// SESSION DESCRIPTIONS
  [CHANGED] app/mentors/[id].tsx (+561/-323) | -// ============================================ / -// FOOTER COMPONENT (Inline)
  [NEW] app/session-type.tsx (+545/-0) | +﻿// app/candidate/session-type.tsx / +// NOTE: If candidate/_layout.tsx has an auth guard, move this file to
  [CHANGED] services/payment.service.ts (+353/-483)

**ADS CHANGES**
- [PM Sales] > Exact match PM: 1 responsive search ad changed | Headline is "Meet your mentor first" | Final URL is "https://crackjobs.com/lp/pm"
- [PM Sales]: Campaign asset created |   Status is Enabled |   Extension type is Callout |   Item id is 332161979147 | Campaign asset created |   Status is Enabled |   Extension type is Callout |   Item id is 33216
- [PM Sales] > Exact match PM: 1 responsive search ad changed | Final URL is "https://crackjobs.com/lp/pm"
- [Account level]: Asset created |   Callout text is "Price drop! Limited offer" |   Status is "Enabled"
- [PM Sales] > Exact match PM: 1 responsive search ad changed | Description was "Mock interviews with real hirinig managers from top companies. Starting from Rs 3.5k" | Description is "Mock interviews with real hirinig managers from top companies. Starting from Rs 800" | Final URL is "https://crackjobs.com/lp/pm"
- [PM Sales] > Exact match PM: 1 responsive search ad changed | Headline was "Price drop for limited time" | Final URL is "https://crackjobs.com/lp/pm"
- [PM Sales] > Exact match PM: 1 responsive search ad changed | Headline is "Price drop for limited time" | Final URL is "https://crackjobs.com/lp/pm"
- [PM Sales] > Exact match PM: 1 responsive search ad changed | Description was "Anonymous interviews. Tier Pricing- Bronze (3.5k-6k), Silver (6k-10k), Gold (10k-15k)" | Description is "Anonymous interviews. Tier Pricing- Bronze (800-2k), Silver (2k-4.5k), Gold (5k-7k)" | Final URL is "https://crackjobs.com/lp/pm"

*[Day +3 after 2026-02-19: code: view pricing flow]*
*[Day +4 after 2026-02-18: ads: Customer asset created |   Status is Enabled |   Extension type is Structur]*
*[Day +4 after 2026-02-18: ads: Asset changed |   Description 1 is "Product Sense, Strategy, Execution" |  ]*

**GA4 METRICS**
- Sessions: 39 total (CPC: 8 (+27% vs 7d avg, ↑ better), Organic: 12, Direct: 0)
- CPC bounce rate: 75% (+0.2pp vs 7d avg, ↑ worse) | Avg session duration: 104s (+50% vs 7d avg, ↑ better)
- Key events: initiate_payment: 5, payment_success: 5, schedule_time: 6, signup_initiate: 21
- Landing pages: /mentors: 19, /lp/pm: 8, /: 6, (not set): 4, /auth/sign-in: 2, /candidate: 1

---

### 2026-02-21 LOW SIGNAL

*[Day +2 after 2026-02-19: code: view pricing flow]*
*[Day +3 after 2026-02-18: ads: Customer asset created |   Status is Enabled |   Extension type is Structur]*
*[Day +3 after 2026-02-18: ads: Asset changed |   Description 1 is "Product Sense, Strategy, Execution" |  ]*

**GA4 METRICS**
- Sessions: 11 total (CPC: 4 (-39% vs 7d avg, ↓ worse), Organic: 1, Direct: 0)
- CPC bounce rate: 50% (-0.1pp vs 7d avg, ↓ better) | Avg session duration: 6s (-91% vs 7d avg, ↓ worse)
- Key events: initiate_payment: 7, payment_success: 6, schedule_time: 9
- Landing pages: /lp/pm: 4, /: 3, /candidate: 2, /mentors: 1, /mentors/cd6b9265-970a-4efd-a799-9de9ec0d46db: 1

---

### 2026-02-20

*[Day +1 after 2026-02-19: code: view pricing flow]*
*[Day +2 after 2026-02-18: ads: Customer asset created |   Status is Enabled |   Extension type is Structur]*
*[Day +2 after 2026-02-18: ads: Asset changed |   Description 1 is "Product Sense, Strategy, Execution" |  ]*

**GA4 METRICS**
- Sessions: 13 total (CPC: 9 (+54% vs 7d avg, ↑ better), Organic: 1, Direct: 0)
- CPC bounce rate: 67% (+0.1pp vs 7d avg, ↑ worse) | Avg session duration: 23s (-68% vs 7d avg, ↓ worse)
- Key events: schedule_time: 1
- Landing pages: /lp/pm: 9, /: 3, /auth/sign-in: 1, /interviews/product-management: 1

---

### 2026-02-19

**CODE CHANGES**
- `1ddcadc`: view pricing flow
  [CHANGED] app/lp/[role].tsx (+3/-10) | -    <Text style={styles.trustItem}>✓ Starts at ₹3,500</Text> / -    router.push("/auth/sign-up");

*[Day +1 after 2026-02-18: ads: Customer asset created |   Status is Enabled |   Extension type is Structur]*
*[Day +1 after 2026-02-18: ads: Asset changed |   Description 1 is "Product Sense, Strategy, Execution" |  ]*
*[Day +1 after 2026-02-18: ads: Asset changed |   Description 1 is "Browse Interviewers" |   Description 2 ]*

**GA4 METRICS**
- Sessions: 16 total (CPC: 9 (+91% vs 7d avg, ↑ better), Organic: 0, Direct: 0)
- CPC bounce rate: 67% (+0.0pp vs 7d avg, ↑ worse) | Avg session duration: 10s (-86% vs 7d avg, ↓ worse)
- Key events: signup_initiate: 3
- Landing pages: /lp/pm: 11, /: 3, (not set): 1, /auth/sign-up: 1

---

### 2026-02-18 LOW SIGNAL

**ADS CHANGES**
- [Account level]: Customer asset created |   Status is Enabled |   Extension type is Structured snippet |   Item id is 332296882494 | Asset created |   Status is "Enabled" |   Header is "Types" |   Values is "Bronze (0
- [Account level]: Asset changed |   Description 1 is "Product Sense, Strategy, Execution" |   Description 2 is "Leadership and Technical"
- [Account level]: Asset changed |   Description 1 is "Browse Interviewers" |   Description 2 is "Book session anonymously"
- [Account level]: Asset created |   Callout text is "Browse and Book" |   Status is "Enabled" | Asset created |   Callout text is "Top Verified Interviewers" |   Status is "Enabled" | Customer asset created |   Status 

*[Day +2 after 2026-02-16: code: Fix mentor view]*
*[Day +2 after 2026-02-16: code: Availability fix]*
*[Day +2 after 2026-02-16: code: Mentors outside signup]*

**GA4 METRICS**
- Sessions: 16 total (CPC: 5 (+7% vs 7d avg, ↑ better), Organic: 4, Direct: 0)
- CPC bounce rate: 80% (+0.2pp vs 7d avg, ↑ worse) | Avg session duration: 207s (+340% vs 7d avg, ↑ better)
- Landing pages: /: 5, /lp/pm: 4, /auth/sign-in: 3, (not set): 2, /auth/forgot-password: 1, /candidate: 1

---

### 2026-02-17

*[Day +1 after 2026-02-16: code: Fix mentor view]*
*[Day +1 after 2026-02-16: code: Availability fix]*
*[Day +1 after 2026-02-16: code: Mentors outside signup]*

**GA4 METRICS**
- Sessions: 11 total (CPC: 8 (+100% vs 7d avg, ↑ better), Organic: 2, Direct: 0)
- CPC bounce rate: 50% (-0.1pp vs 7d avg, ↓ better) | Avg session duration: 92s (+142% vs 7d avg, ↑ better)
- Key events: signup_initiate: 4
- Landing pages: /lp/pm: 7, /: 3, /auth/sign-up: 1

---

### 2026-02-16 LOW SIGNAL

**CODE CHANGES**
- `891afb1`: Fix mentor view
  [CHANGED] app/mentors/[id].tsx (+55/-33) | +  const { width } = useWindowDimensions(); / +  const isMobile = width < 768;
  [NEW] public/_redirects (+16/-0)
- `7944faa`: Availability fix
  [CHANGED] app/mentors.tsx (+31/-7) | +  const [mentorAvailability, setMentorAvailability] = useState<Record<string, string>>({}); / -  // --- 2. Fetch Mentors ---
- `e02264e`: Mentors outside signup
  [CHANGED] app/index.tsx (+1/-1)
  [CHANGED] app/lp/[role].tsx (+7/-7) | -    if (Platform.OS === "web") { / -      const el = document.getElementById("pricing");
  [NEW] app/mentors.tsx (+899/-0) | +﻿// app/mentors.tsx / +  View,
  [NEW] app/mentors/[id].tsx (+633/-0) | +﻿// app/mentors/[id].tsx / +  View,
  [CHANGED] components/Footer.tsx (+2/-2)
  [CHANGED] public/sitemap.xml (+33/-24)

*[Day +2 after 2026-02-14: code: Perf fixes LP]*
*[Day +2 after 2026-02-14: code: Lazy lp fixes]*
*[Day +2 after 2026-02-14: code: Merge main into qabuild2, keeping fresh production build]*

**GA4 METRICS**
- Sessions: 31 total (CPC: 5 (+33% vs 7d avg, ↑ better), Organic: 3, Direct: 0)
- CPC bounce rate: 20% (-0.5pp vs 7d avg, ↓ better) | Avg session duration: 101s (+357% vs 7d avg, ↑ better)
- Key events: signup_initiate: 10
- Landing pages: /: 12, /mentors: 10, /lp/pm: 6, (not set): 2, /mentors/939ab8b8-88d2-455b-aad5-dd908c47f705: 1

---

### 2026-02-15 LOW SIGNAL

*[Day +1 after 2026-02-14: code: Perf fixes LP]*
*[Day +1 after 2026-02-14: code: Lazy lp fixes]*
*[Day +1 after 2026-02-14: code: Merge main into qabuild2, keeping fresh production build]*

**GA4 METRICS**
- Sessions: 11 total (CPC: 4 (+9% vs 7d avg, ↑ better), Organic: 4, Direct: 0)
- CPC bounce rate: 75% (+0.1pp vs 7d avg, ↑ worse) | Avg session duration: 45s (+205% vs 7d avg, ↑ better)
- Key events: signup_initiate: 2
- Landing pages: /lp/pm: 5, /: 4, /auth/forgot-password: 1, /auth/sign-in: 1

---

### 2026-02-14 LOW SIGNAL

**CODE CHANGES**
- `f7230d1`: Perf fixes LP
  [CHANGED] app/lp/[role].tsx (+66/-22) | -﻿import React, { memo, useMemo, useRef, useState, useEffect, lazy, Suspense } from "react"; / +﻿import React, { memo, useMemo, useRef, useState, lazy, Suspense } from "react";
  [CHANGED] app/lp/lazysectionslp.tsx (+401/-67) | -const SYSTEM_FONT = "System"; / +const SYSTEM_FONT = Platform.select({
- `a3be6cd`: Lazy lp fixes
  [CHANGED] app/lp/[role].tsx (+80/-511) | -﻿import React, { memo, useMemo, useRef, useState, lazy, Suspense } from "react"; / +﻿import React, { memo, useMemo, useRef, useState, useEffect, lazy, Suspense } from "react";
  [CHANGED] app/lp/lazysectionslp.tsx (+19/-6) | -// --- Constants & Data (Preserved Exactly) --- / +// --- Constants & Data ---
  [CHANGED] package.json (+2/-3)
- `0283fe3`: Merge main into qabuild2, keeping fresh production build
  [CHANGED] app/lp/[role].tsx (+720/-35) | -const VALID_ROLES = ["pm", "hr", "ds", "da"]; / +// Metal Colors
  [CHANGED] package.json (+3/-1)
- `826057c`: LP fix revert
  [CHANGED] app/lp/[role].tsx (+4/-0)
- `eab2208`: Revert and lazysections
  [CHANGED] app/lp/[role].tsx (+75/-1091) | -﻿// app/lp/[role].tsx / -  View,
  [NEW] app/lp/lazysectionslp.tsx (+132/-0) | +﻿import React, { memo } from "react"; / +// --- Constants & Data (Preserved Exactly) ---

**ADS CHANGES**
- [Account level]: Customer asset created |   Status is Enabled |   Extension type is Business logo |   Item id is 325640022955

*[Day +1 after 2026-02-13: code: Landing page next.js]*
*[Day +1 after 2026-02-13: ads: Campaign bid strategy type changed from "Maximize conversions" to "Maximize]*
*[Day +1 after 2026-02-13: ads: 1 responsive search ad changed | Headline changed from "Test yourself again]*

**GA4 METRICS**
- Sessions: 30 total (CPC: 6 (+140% vs 7d avg, ↑ better), Organic: 1, Direct: 0)
- CPC bounce rate: 33% (-0.5pp vs 7d avg, ↓ better) | Avg session duration: 39s (+1291% vs 7d avg, ↑ better)
- Key events: signup_initiate: 3
- Landing pages: /lp/pm: 20, /: 6, (not set): 3, /auth/sign-in: 1

---

### 2026-02-13 LOW SIGNAL

**CODE CHANGES**
- `78470a4`: Landing page next.js
  [CHANGED] app/lp/[role].tsx (+33/-10) | -const VALID_ROLES = ["pm", "hr", "ds", "da"]; / +// NOTE: PM route removed - now handled by Next.js at /lp/pm
  [CHANGED] package.json (+3/-1)

**ADS CHANGES**
- [PM Sales]: Campaign bid strategy type changed from "Maximize conversions" to "Maximize clicks"
- [PM Sales] > Exact match PM: 1 responsive search ad changed | Headline changed from "Test yourself against the best" to "Test yourself against the best" | Headline changed from "Anonymous mocks with PMs" to "Anonymous mocks with PMs" | Headline changed from "Detailed feedback + recording" to "Detailed feedback + recording" | Headline changed from "Practice with expert not peers" to "Practice with expert not peers" | Headline 

*[Day +1 after 2026-02-12: code: LP fixes]*
*[Day +1 after 2026-02-12: code: Enhanced conversions, LP fixes]*
*[Day +1 after 2026-02-12: ads: 1 negative broad match keyword removed]*

**GA4 METRICS**
- Sessions: 8 total (CPC: 4 (+300% vs 7d avg, ↑ better), Organic: 3, Direct: 0)
- CPC bounce rate: 75% (-0.2pp vs 7d avg, ↓ better) | Avg session duration: 5s (+868% vs 7d avg, ↑ better)
- Landing pages: /lp/pm: 6, /: 1, /auth/sign-in: 1, /auth/sign-up: 1

---

### 2026-02-12 LOW SIGNAL

**CODE CHANGES**
- `4080aab`: LP fixes
  [CHANGED] app/lp/[role].tsx (+254/-237) | -const COLOR_BRONZE = "#A67C52";  / +const COLOR_BRONZE = "#A67C52";
- `7692a1e`: Enhanced conversions, LP fixes
  [CHANGED] app/auth/sign-up.tsx (+6/-1) | +      // ✅ FIXED: Added email parameter for Google Enhanced Conversions / +      console.log('[SignUp] 📊 Tracking sign_up event with email:', email.trim());
  [CHANGED] app/candidate/pgscreen.tsx (+16/-3) | +    // ✅ FIXED: Get email directly from auth session (guaranteed to be available) / +    let userEmail: string | undefined;
  [CHANGED] app/lp/[role].tsx (+107/-99) | -const PricingCards = memo(({ isSmall, onBook }: { isSmall: boolean, onBook: (tier: string) => void  / -  return (
  [CHANGED] components/LazySections.tsx (+3/-3) | -      benefits: [ '5-10 yrs Experienced interviewer', 'Top performers','Good for strengthening basi / +      benefits: [ 'Top performing mid-Level Managers', '5 - 10 yrs experienced','Best for: Strength
  [CHANGED] public/sitemap.xml (+19/-19)

**ADS CHANGES**
- [PM Sales]: 1 negative broad match keyword removed
- [PM Sales]: 1 negative broad match keyword removed
- [PM Sales]: 13 negative broad match keywords removed
- [PM Sales]: 81 negative broad match keywords added

*[Day +1 after 2026-02-11: code: Perf fixes]*
*[Day +1 after 2026-02-11: code: No partytown GTM fixes]*
*[Day +1 after 2026-02-11: code: LP fixes, GTM fixes]*

**GA4 METRICS**
- Sessions: 16 total (CPC: 1, Organic: 6, Direct: 0)
- CPC bounce rate: 100% | Avg session duration: 1s
- Key events: initiate_payment: 7, payment_success: 7, schedule_time: 4, signup_initiate: 7
- Landing pages: /: 11, /lp/pm: 5, (not set): 2, /auth/sign-in: 2, /auth/reset-password: 1, /auth/sign-up: 1

---

### 2026-02-11

**CODE CHANGES**
- `c6c7820`: Perf fixes
  [NEW] components/AppIcons.tsx (+56/-0) | +// components/AppIcons.tsx / +export const FeedbackIcon = () => (
  [CHANGED] components/GoogleTagManager.tsx (+42/-64) | -/** / - * Google Tag Manager - Standard Implementation
  [CHANGED] components/LazySections.tsx (+54/-334) | -﻿import React, { memo } from 'react'; / +﻿// components/LazySections.tsx
- `5ca4a19`: No partytown GTM fixes
  [CHANGED] components/GoogleTagManager.tsx (+43/-101) | -﻿// components/GoogleTagManager.tsx - Conditional Partytown / +﻿// components/GoogleTagManager.tsx
- `065eb53`: LP fixes, GTM fixes
  [CHANGED] app/_layout.tsx (+80/-8) | -  // Init session / +  // CRITICAL FIX: Process recovery token FIRST, before any auth checks
  [CHANGED] app/auth/forgot-password.tsx (+11/-2) | +      console.log('[ForgotPassword] Requesting password reset for:', email); / +        console.error('[ForgotPassword] Error:', error);
  [CHANGED] app/auth/reset-password.tsx (+78/-16) | +        // FIRST: Check if session was already established by parent layout / +        // This prevents race conditions and duplicate processing
  [CHANGED] app/lp/[role].tsx (+834/-233) | +// Testimonials Data / +const TESTIMONIALS = [
  [CHANGED] components/GoogleTagManager.tsx (+122/-58) | -﻿// components/GoogleTagManager.tsx - WITH PARTYTOWN / +﻿// components/GoogleTagManager.tsx - Conditional Partytown

**ADS CHANGES**
- [PM Sales]: Campaign changed |   Start time changed from Feb 12, 2026, 12:00:00 AM IST to Feb 13, 2026, 12:00:00 AM IST
- [PM_Core_buyers]: Budget status changed from active to removed | 1 campaign removed | Status changed from paused to removed
- [Account level]: 1 responsive search ad changed | Final URL is "https://crackjobs.com/lp/pm"
- [PM Sales]: Bid strategy type is "Maximize conversions" | Standard goals changed | Purchases (Website) added
- [PM Sales] > Exact match PM: 1 responsive search ad created | Description is "Mock interviews with real hirinig managers from top companies. Starting from Rs 3.5k" | Description is "Get detailed feedback and session recordings" | Headline is "Test yourself against the best" | Headline is "Anonymous mocks with PMs" | Description is "Anonymous interviews. Tier Pricing- Bronze (3.5k-6k), Silver (6k-10k), Gold (10k-15k)" | Headli
- [Account level]: Final URL is "https://crackjobs.com/faq" | Final URL is "https://crackjobs.com/how-it-works" | Final URL is "https://crackjobs.com/about" | Final URL is "https://crackjobs.com/contact"
- [Account level]: PM Sales: Budget amount is ₹700.00
- [Account level]: Final URL is "https://crackjobs.com/faq"
- [Competitors]: Budget status changed from active to removed | 1 campaign removed | Status changed from paused to removed
- [DA_Core_buyers]: Budget status changed from active to removed | 1 campaign removed | Status changed from paused to removed
- [DS_Core_buyers]: Budget status changed from active to removed | 1 campaign removed | Status changed from paused to removed

*[Day +7 after 2026-02-04: code: Sitemap error and header fix and sort fix]*

**GA4 METRICS**
- Sessions: 10 total (CPC: 0, Organic: 1, Direct: 0)
- Key events: payment_success: 1, signup_initiate: 3
- Landing pages: /: 4, /auth/sign-up: 2, /lp/pm: 2, /auth/reset-password: 1, /contact: 1

---

### 2026-02-10

*[Day +6 after 2026-02-04: code: Sitemap error and header fix and sort fix]*

**GA4 METRICS**
- Sessions: 1 total (CPC: 0, Organic: 0, Direct: 0)
- Landing pages: /auth/reset-password: 1

---

### 2026-02-09

*[Day +5 after 2026-02-04: code: Sitemap error and header fix and sort fix]*
*[Day +7 after 2026-02-02: code: Fix sitemap2]*
*[Day +7 after 2026-02-02: code: Sitemap update]*

**GA4 METRICS**
- Sessions: 2 total (CPC: 0, Organic: 2, Direct: 0)
- Key events: signup_initiate: 1
- Landing pages: /: 2

---

### 2026-02-06

*[Day +2 after 2026-02-04: code: Sitemap error and header fix and sort fix]*
*[Day +4 after 2026-02-02: code: Fix sitemap2]*
*[Day +4 after 2026-02-02: code: Sitemap update]*

**GA4 METRICS**
- Sessions: 1 total (CPC: 0 (-100% vs 7d avg, ↓ worse), Organic: 0, Direct: 0)
- Landing pages: /candidate: 1

---

### 2026-02-05

*[Day +1 after 2026-02-04: code: Sitemap error and header fix and sort fix]*
*[Day +3 after 2026-02-02: code: Fix sitemap2]*
*[Day +3 after 2026-02-02: code: Sitemap update]*

**GA4 METRICS**
- Sessions: 2 total (CPC: 0 (-100% vs 7d avg, ↓ worse), Organic: 0, Direct: 0)
- Landing pages: /: 1, /auth/sign-up: 1

---

### 2026-02-04

**CODE CHANGES**
- `ad539bb`: Sitemap error and header fix and sort fix
  [CHANGED] app/auth/sign-in.tsx (+1/-1)
  [CHANGED] app/candidate/index.tsx (+9/-22) | -type SortOption = 'tier' | 'price_low' | 'price_high' | 'sessions' | 'rating' | 'experience'; / +type SortOption = 'price_low' | 'sessions' | 'rating' | 'experience';
  [CHANGED] public/_headers (+4/-4)
  [CHANGED] public/sitemap.xml (+19/-19)

*[Day +2 after 2026-02-02: code: Fix sitemap2]*
*[Day +2 after 2026-02-02: code: Sitemap update]*
*[Day +2 after 2026-02-02: code: Page review and SEO changes]*

**GA4 METRICS**
- Sessions: 14 total (CPC: 0 (-100% vs 7d avg, ↓ worse), Organic: 1, Direct: 0)
- Landing pages: /: 3, /about: 1, /cancellation-policy: 1, /contact: 1, /faq: 1, /how-it-works: 1

---

### 2026-02-02

**CODE CHANGES**
- `f1e54a3`: Fix sitemap2
  [CHANGED] public/sitemap.xml (+1/-1)
- `947f524`: Sitemap update
  [CHANGED] public/sitemap.xml (+20/-20) | -		<lastmod>2025-01-31</lastmod> / +		<lastmod>2026-02-02</lastmod>
- `4455939`: Page review and SEO changes
  [CHANGED] app/about.tsx (+646/-415) | +  View, / +  Text,
  [CHANGED] app/blog/[slug].tsx (+15/-5) | +// Removed: import { PageLayout } from '@/components/PageLayout'; / -       <PageLayout>
  [CHANGED] app/blog/index.tsx (+13/-4) | -﻿import React, { useEffect, useState } from 'react'; / +﻿// app/blog/index.tsx
  [CHANGED] app/cancellation-policy.tsx (+404/-151) | -  StandardPageTemplate, / -  StandardSection,
  [CHANGED] app/contact.tsx (+3/-13) | -          <View style={styles.header}> / -            <View style={[styles.headerInner, isSmall && styles.headerInnerMobile]}>
  [CHANGED] app/faq.tsx (+235/-115) | -  StandardPageTemplate, / -  StandardBold,
  [CHANGED] app/how-it-works.tsx (+771/-443) | +  View, / +  Text,
  [CHANGED] app/index.tsx (+12/-55) | -        "description": "Practice interviews anonymously with vetted expert mentors from Google, Ama / +        "description": "Practice interviews anonymously with vetted expert mentors and crack interv
  [CHANGED] app/interviews/data-analytics.tsx (+6/-16) | -        <title>Data Analyst Interview Prep | Master SQL, Business Analytics & Dashboards</title> / -        <meta name="description" content="Ace Data Analyst interviews at Amazon, Flipkart, Swiggy w
  [CHANGED] app/interviews/data-science.tsx (+3/-13) | -          <View style={styles.header}> / -            <View style={[styles.headerInner]}>
  [CHANGED] app/interviews/hr.tsx (+5/-16) | -      const cleanup = injectMultipleSchemas([breadcrumbSchema, faqSchema, howtoSchema, courseSchema / -      return () => cleanup && cleanup();
  [CHANGED] app/interviews/product-management.tsx (+6/-26) | -        <title>Product Manager Interview Preparation | Mock interviews with experienced PMs </title / +        <title>Mock interviews with experienced PMs </title>
  [CHANGED] app/privacy.tsx (+336/-139) | -  StandardPageTemplate, / -  StandardSection,
  [CHANGED] app/terms.tsx (+433/-167) | -  StandardPageTemplate, / -  StandardSection,
  [CHANGED] components/Header.tsx (+74/-76) | -// 🟢 CRITICAL: Lazy load named export from main library / -// This ensures Header.tsx doesn't force the whole UI library to load immediately
  [CHANGED] components/LazySections.tsx (+5/-5) | -  { id: 2, number: '4.8★', label: 'Average Mentor Rating' }, / +  { id: 2, number: '4.5★', label: 'Average Mentor Rating' },
  [DELETED] components/PageLayout.tsx (+0/-32) | -type PageLayoutProps = { / -  children: React.ReactNode;
  [DELETED] components/StandardPageTemplate.tsx (+0/-247) | -﻿import React from 'react'; / -// 🔥 System font stack - 0ms load time for SEO pages

*[Day +2 after 2026-01-31: code: Partytown]*
*[Day +2 after 2026-01-31: code: GTM delay2 sec]*
*[Day +2 after 2026-01-31: code: SEO fix and site and blog updates]*

**GA4 METRICS**
- Sessions: 8 total (CPC: 0 (-100% vs 7d avg, ↓ worse), Organic: 3, Direct: 0)
- Key events: schedule_time: 1, signup_initiate: 5
- Landing pages: /: 7, /admin/approvals: 1

---

### 2026-02-01

*[Day +1 after 2026-01-31: code: Partytown]*
*[Day +1 after 2026-01-31: code: GTM delay2 sec]*
*[Day +1 after 2026-01-31: code: SEO fix and site and blog updates]*

**GA4 METRICS**
- Sessions: 12 total (CPC: 0 (-100% vs 7d avg, ↓ worse), Organic: 2, Direct: 0)
- Key events: signup_initiate: 3
- Landing pages: /: 7, /about: 1, /blog: 1, /cancellation-policy: 1, /how-it-works: 1, /interviews/hr: 1

---

### 2026-01-31

**CODE CHANGES**
- `8431e2d`: Partytown
  [CHANGED] components/GoogleTagManager.tsx (+53/-35) | -﻿// components/GoogleTagManager.tsx - OPTIMIZED VERSION / +﻿// components/GoogleTagManager.tsx - WITH PARTYTOWN
  [CHANGED] package.json (+3/-1)
  [NEW] public/~partytown/debug/partytown-atomics.js (+614/-0)
  [NEW] public/~partytown/debug/partytown-media.js (+374/-0)
  [NEW] public/~partytown/debug/partytown-sandbox-sw.js (+600/-0)
  [NEW] public/~partytown/debug/partytown-sw.js (+75/-0)
  [NEW] public/~partytown/debug/partytown-ww-atomics.js (+1935/-0)
  [NEW] public/~partytown/debug/partytown-ww-sw.js (+1927/-0)
  [NEW] public/~partytown/debug/partytown.js (+128/-0)
  [NEW] public/~partytown/partytown-atomics.js (+2/-0)
  [NEW] public/~partytown/partytown-media.js (+2/-0)
  [NEW] public/~partytown/partytown-sw.js (+2/-0)
  [NEW] public/~partytown/partytown.js (+2/-0)
- `5927662`: GTM delay2 sec
  [CHANGED] components/GoogleTagManager.tsx (+37/-22) | -// components/GoogleTagManager.tsx / +﻿// components/GoogleTagManager.tsx - OPTIMIZED VERSION
- `3047eb1`: Prebuilt
- `8cca621`: SEO fix and site and blog updates
  [CHANGED] app/_layout.tsx (+37/-39) | -﻿import { useEffect, useState } from 'react'; / +﻿// app/_layout.tsx
  [CHANGED] app/blog/[slug].tsx (+352/-9) | +  Linking, / +// Calculate reading time from HTML content
  [CHANGED] app/blog/index.tsx (+221/-100) | -﻿import React, { useEffect } from 'react'; / +﻿import React, { useEffect, useState } from 'react';
  [CHANGED] app/index.tsx (+263/-82) | -    <View style={styles.sectionContainer}> / +    <View style={styles.sectionContainer} nativeID="how-it-works">
  [CHANGED] components/GoogleTagManager.tsx (+29/-54) | -const GTM_ID = "GTM-WCMZH59K"; / +const GTM_ID = 'GTM-WCMZH59K';
  [CHANGED] components/LazySections.tsx (+190/-212) | -  { id: 'pm', emoji: '📊', title: 'Product Management', desc: 'Product sense, strategy, execution, t / +  { id: 'pm', emoji: '📊', title: 'Product Management', desc: 'Product sense, strategy, execution, t
  [CHANGED] public/sitemap.xml (+20/-20) | -		<lastmod>2025-01-23</lastmod> / +		<lastmod>2025-01-31</lastmod>

*[Day +5 after 2026-01-26: code: Pgscreen custom event]*
*[Day +5 after 2026-01-26: ads: 1 campaign paused | Status changed from active to paused]*
*[Day +5 after 2026-01-26: ads: 1 responsive search ad changed | Final URL is "https://crackjobs.com"]*

**GA4 METRICS**
- Sessions: 9 total (CPC: 0 (-100% vs 7d avg, ↓ worse), Organic: 1, Direct: 0)
- Key events: initiate_payment: 3, payment_success: 2, schedule_time: 4, signup_initiate: 5
- Landing pages: /: 11, /auth/sign-in: 1, /lp/pm: 1, /mentor/bookings: 1

---

### 2026-01-27

*[Day +1 after 2026-01-26: code: Pgscreen custom event]*
*[Day +1 after 2026-01-26: ads: 1 campaign paused | Status changed from active to paused]*
*[Day +1 after 2026-01-26: ads: 1 responsive search ad changed | Final URL is "https://crackjobs.com"]*

**GA4 METRICS**
- Sessions: 0 total (CPC: 0 (-100% vs 7d avg, ↓ worse), Organic: 0, Direct: 0)
- Landing pages: /: 1

---

### 2026-01-26 LOW SIGNAL

**CODE CHANGES**
- `1adc4b2`: Pgscreen custom event
  [CHANGED] app/auth/sign-up.tsx (+63/-78) | -      // 3. Track Success Event - This will now push to dataLayer for GTM / +      // 3. Success State
  [CHANGED] app/candidate/pgscreen.tsx (+8/-3) | -      // ✅ FIX: Pass orderId as the 4th argument / -      // The Edge Function "verify-razorpay-signature" REQUIRES: packageId, paymentId, signature, A

**ADS CHANGES**
- [Competitors]: 1 campaign paused | Status changed from active to paused
- [Account level]: 1 responsive search ad changed | Final URL is "https://crackjobs.com"
- [Competitors]: Bid strategy type is "Maximize clicks"
- [Competitors] > Ad group 1: 1 responsive search ad created | Headline is "No Peer Bias Mock Interviews" | Headline is "Real Mock Interviews Online" | Headline is "Unbiased Interview Feedback" | Headline is "Recorded Mock Interviews" | Description is "Practice with real interviewers, not random peers. Get recorded sessions and feedback." | Description is "Book mock interviews faster and cheaper than traditional coaching platf
- [Account level]: Competitors: Budget amount is ₹300.00
- [DS_Core_buyers]: 1 budget amount decreased | DS_Core_buyers: Budget amount changed from ₹600.00 to ₹400.00
- [DS_Core_buyers] > DS Mock interviews: 1 responsive search ad changed | Description was "Anonymous 1:1 mock interviews. Practice with vetted DA mentors from top companies" | Headline was "Avoid failing DA interviews" | Headline was "Data Analyst Mock Interview" | Headline was "Practice DA Interviews Online" | Headline is "Avoid failing DS interviews" | Description is "Practice ML theory, coding, and case studies in a real interview for
- [DS_Core_buyers]: Status changed from Enabled to Removed
- [DS_Core_buyers] > DS_ML: 1 responsive search ad changed | Description was "Mock SQL interviews with experienced data analysts." | Headline was "SQL Case Study Interview" | Headline was "SQL Interview Simulation" | Description was "Get unbiased feedback on your SQL interview performance from domain experts." | Headline was "Avoid failing SQL interviews" | Headline was "SQL Mock Interview" | Headline was "Advanced SQL Inter
- [Account level]: Final URL is "https://crackjobs.com/interviews/data-science"
- [DS_Core_buyers] > DS_ML: 4 phrase match keywords added | 1 exact match keyword added
- [DS_Core_buyers] > DS_ML: 1 exact match keyword removed | 5 phrase match keywords removed
- [DS_Core_buyers] > DS Mock interviews: 1 exact match keyword added | 4 phrase match keywords added
- [DS_Core_buyers] > DS Mock interviews: 4 phrase match keywords removed | 1 exact match keyword removed
- [DS_Core_buyers] > DS_ML: Ad group changed |   Ad group name changed from "DA_SQL" to "DS_ML"
- [DS_Core_buyers] > DS Mock interviews: Ad group changed |   Ad group name changed from "DA Mock interviews" to "DS Mock interviews"
- [DS_Core_buyers]: Budget changed |   Budget name changed from "DA_Core_buyers #2" to "DS_Core_buyers" | Campaign changed |   Campaign name changed from "DA_Core_buyers #2" to "DS_Core_buyers"
- [DS_Core_buyers]: Standard goals changed | Sign-ups (Website) added
- [DS_Core_buyers]: Campaign asset created |   Status is Enabled |   Extension type is Sitelink |   Item id is 325697182284 | Campaign asset created |   Status is Enabled |   Extension type is Sitelink |   Item id is 325
- [DS_Core_buyers]: 1 language added |   English | 1 country added |   India
- [DS_Core_buyers]: Negative keyword list "Negative keywords" applied
- [DS_Core_buyers] > DS_ML: Status changed from paused to enabled
- [DS_Core_buyers] > DS Mock interviews: Status changed from paused to enabled
- [DS_Core_buyers] > DS_ML: 1 responsive search ad created | Description is "Mock SQL interviews with experienced data analysts." | Headline is "Anonymous 1:1 Interviews" | Headline is "No Peer Bias Interviews" | Headline is "Unbiased Interview Feedback" | Headline is "Real Hiring Manager Feedback" | Headline is "SQL Case Study Interview" | Headline is "Recorded Mock Interviews" | Headline is "SQL Interview Simulation" | Des
- [DS_Core_buyers] > DS Mock interviews: 1 responsive search ad created | Headline is "Practice before your interview" | Description is "Real Professionals. No AI. No BS" | Headline is "No Peer Bias Interviews" | Description is "Choose your domain and the topic you want to practice for your DA mock interview" | Description is "Choose your mentor from mentors of different experience levels." | Headline is "Anonymous 1:1 Interviews" | Head
- [DS_Core_buyers] > DS_ML: 5 phrase match keywords added | 1 exact match keyword added
- [DS_Core_buyers] > DS Mock interviews: 1 exact match keyword added | 4 phrase match keywords added
- [DS_Core_buyers] > DS_ML: Ad group created |   Ad group targeting setting changed to "Observation" for "Age" |   Ad group targeting setting changed to "Observation" for "Gender" |   Ad group targeting setting changed to "Obser
- [DS_Core_buyers] > DS Mock interviews: Ad group created |   Ad group targeting setting changed to "Observation" for "Age" |   Max CPC is ₹0.01 |   Max CPM is ₹0.01 |   Target CPM is ₹0.01 |   Status is paused |   Name is "DA Mock interview
- [DS_Core_buyers]: DS_Core_buyers: Budget amount is ₹600.00 | Bid strategy type is "Maximize clicks"
- [DA_Core_buyers] > DA_SQL: 1 exact match keyword added | 5 phrase match keywords added
- [DA_Core_buyers] > DA_SQL: 5 phrase match keywords removed | 1 exact match keyword removed
- [DA_Core_buyers]: 1 budget amount decreased | DA_Core_buyers: Budget amount changed from ₹700.00 to ₹600.00
- [DA_Core_buyers] > DA_SQL: 1 responsive search ad changed | Description was "Prepare for product sense interview with expert interviewers. Anonymous 1:1 mock sessions." | Headline was "Practice PM Product Rounds" | Headline was "Avoid failing PM interviews" | Headline was "Product Sense Interview Prep" | Description was "Practice product sense interviews with real PMs. Recorded sessions and structured feedback" | Headline w
- [DA_Core_buyers] > DA Mock interviews: 1 responsive search ad changed | Final URL changed from "https://crackjobs.com/lp/pm" to "https://crackjobs.com/lp/da"
- [DA_Core_buyers]: Status changed from Enabled to Removed
- [DA_Core_buyers] > DA Mock interviews: 1 responsive search ad changed | Description was "Anonymous 1:1 mock interviews. Practice with vetted PM mentors from top companies" | Headline was "Product Manager Mock Interview" | Headline was "Avoid failing PM interviews" | Description was "Choose your domain and the topic you want to practice for your PM mock interview" | Headline was "PM interview coaching" | Headline is "Data Analyst Mock I
- [DA_Core_buyers] > DA Mock interviews: 1 exact match keyword added | 4 phrase match keywords added
- [DA_Core_buyers] > DA Mock interviews: 2 exact match keywords removed | 6 phrase match keywords removed
- [DA_Core_buyers] > DA_SQL: Ad group changed |   Ad group name changed from "PM_Product_Sense" to "DA_SQL"
- [DA_Core_buyers] > DA Mock interviews: Ad group changed |   Ad group name changed from "PM Mock interviews" to "DA Mock interviews"
- [DA_Core_buyers]: Budget changed |   Budget name changed from "PM_Core_buyers #2" to "DA_Core_buyers" | Campaign changed |   Campaign name changed from "PM_Core_buyers #2" to "DA_Core_buyers"
- [DA_Core_buyers]: Standard goals changed | Sign-ups (Website) added
- [DA_Core_buyers]: Campaign asset created |   Status is Enabled |   Extension type is Sitelink |   Item id is 325700451921 | Campaign asset created |   Status is Enabled |   Extension type is Sitelink |   Item id is 325
- [DA_Core_buyers]: 1 language added |   English | 1 country added |   India
- [DA_Core_buyers]: Negative keyword list "Negative keywords" applied
- [DA_Core_buyers] > DA Mock interviews: Status changed from paused to enabled
- [DA_Core_buyers] > DA_SQL: Status changed from paused to enabled
- [DA_Core_buyers] > DA Mock interviews: 1 responsive search ad created | Description is "Anonymous 1:1 mock interviews. Practice with vetted PM mentors from top companies" | Description is "Choose your mentor from mentors of different experience levels." | Headline is "Product Manager Mock Interview" | Headline is "No Peer Bias Interviews" | Headline is "Anonymous 1:1 Interviews" | Headline is "Unbiased Interview Feedback" | Headline is
- [DA_Core_buyers] > DA_SQL: 1 responsive search ad created | Description is "Choose your mentor from mentors of different experience levels." | Description is "Prepare for product sense interview with expert interviewers. Anonymous 1:1 mock sessions." | Headline is "Practice PM Product Rounds" | Headline is "Avoid failing PM interviews" | Headline is "Product Sense Interview Prep" | Description is "Practice product sense int
- [DA_Core_buyers] > DA Mock interviews: 6 phrase match keywords added | 2 exact match keywords added
- [DA_Core_buyers] > DA_SQL: 1 exact match keyword added | 5 phrase match keywords added
- [DA_Core_buyers] > DA Mock interviews: Ad group created |   Ad group targeting setting changed to "Observation" for "Age" |   Ad group targeting setting changed to "Observation" for "Parental status" |   Max CPC is ₹0.01 |   Max CPM is ₹0.
- [DA_Core_buyers] > DA_SQL: Ad group created |   Max CPC is ₹0.01 |   Max CPM is ₹0.01 |   Target CPM is ₹0.01 |   Status is paused |   Name is "PM_Product_Sense" |   Disable Search Term Matching is False |   Ad group targeting 
- [DA_Core_buyers]: DA_Core_buyers: Budget amount is ₹700.00 | Bid strategy type is "Maximize clicks"
- [Account level]: Conversion "Sign Up" removed
- [Account level]: Conversion created |   Conversion is enabled |   Conversion source is "Website" |   Conversion name is "Sign-up-success" |   Conversion value is "No value" |   Conversion category is "Signup" |   Conv
- [Account level]: Conversion "Page view": Action optimization changed to "Secondary action (observe only)" |    | Conversion action "Page view": Include in "Conversions" is changed to "No"
- [Account level]: Account-default goals changed: Page views (Website) added |    | Conversion created |   Conversion is enabled |   Conversion source is "Website" |   Conversion name is "Page view" |   Conversion value
- [PM_Core_buyers]: Standard goals changed | Sign-ups (Website) added
- [PM_Core_buyers]: 1 country added |   India
- [Account level]: Account-default goals changed: Purchases (Website) added
- [PM_Core_buyers]: Campaign bid strategy type changed from "Maximize conversions" to "Maximize clicks"
- [PM_Core_buyers]: Campaign asset created |   Status is Enabled |   Extension type is Business logo |   Item id is 325640022955 | Campaign asset created |   Status is Enabled |   Extension type is Sitelink |   Item id i
- [PM_Core_buyers] > PM_Product_Sense: 1 responsive search ad created | Description is "Choose your mentor from mentors of different experience levels." | Headline is "Product Sense Interview Prep" | Headline is "Product Sense Mock Interview" | Headline is "Unbiased Interview Feedback" | Description is "Practice product sense interviews with real PMs. Recorded sessions and structured feedback" | Headline is "No Peer Bias Interviews" | 
- [Account level]: Final URL is "https://crackjobs.com/interviews/product-management" | Final URL is "https://crackjobs.com/about" | Final URL is "https://crackjobs.com/contact" | Final URL is "https://crackjobs.com/how-it-works"
- [PM_Core_buyers]: Negative keyword list "Negative keywords" applied | Negative keywords: 19 negative broad match keywords added to list
- [PM_Core_buyers] > PM Mock interviews: Ad group changed |   Ad group name changed from "Ad group 1" to "PM Mock interviews"
- [PM_Core_buyers]: Budget changed |   Budget name changed from "PM_Mock_interviews" to "PM_Core_buyers" | Campaign changed |   Campaign name changed from "PM_Mock_interviews" to "PM_Core_buyers"
- [PM_Core_buyers]: 1 campaign paused | Status changed from active to paused
- [Account level]: 1 responsive search ad changed | Final URL is "https://crackjobs.com/lp/pm"
- [PM_Core_buyers]: Bid strategy type is "Maximize conversions"
- [PM_Core_buyers] > PM Mock interviews: 1 responsive search ad created | Description is "Anonymous 1:1 mock interviews. Practice with vetted PM mentors from top companies" | Headline is "Practice before your interview" | Headline is "Anonymous 1:1 Interviews" | Headline is "Product Manager Mock Interview" | Headline is "Unbiased Interview Feedback" | Headline is "Avoid failing PM interviews" | Headline is "Recorded Mock Interviews" | De
- [Account level]: PM_Core_buyers: Budget amount is ₹700.00
- [Account level]: Final URL is "https://crackjobs.com/" | Final URL is "https://www.linkedin.com/company/crackjobs/"
- [Account level]: Final URL is "https://crackjobs.com/interviews/product-management" | Final URL is "https://crackjobs.com/interviews/data-analytics"

*[Day +1 after 2026-01-25: code: Gtm tracking event]*
*[Day +1 after 2026-01-25: code: Tier pricing dynamic and GTM integration]*
*[Day +1 after 2026-01-25: ads: Final URL is "https://crackjobs.com/interviews/data-science"]*

**GA4 METRICS**
- Sessions: 7 total (CPC: 2, Organic: 0, Direct: 0)
- CPC bounce rate: 100% | Avg session duration: 0s
- Key events: initiate_payment: 6, payment_success: 1, schedule_time: 6
- Landing pages: /lp/pm: 7, /: 3, (not set): 1

---

### 2026-01-25

**CODE CHANGES**
- `4febe92`: Gtm tracking event
  [CHANGED] app/auth/sign-up.tsx (+78/-63) | -      // 3. Success State / -      setUser(user);
  [CHANGED] app/candidate/index.tsx (+1/-1)
  [CHANGED] app/lp/[role].tsx (+17/-4) | +// ✅ EDITED: Added nativeID to props / +  nativeID, // <--- Added
  [CHANGED] components/GoogleTagManager.tsx (+22/-8) | -const GTM_ID = "GTM-WCMZH59K"; // Your GTM ID from the screenshot / +const GTM_ID = "GTM-WCMZH59K";
  [CHANGED] lib/analytics.ts (+24/-16)
- `5ab74d7`: tier pricing and gtm with pre build
- `7aa87f8`: Tier pricing dynamic and GTM integration
  [CHANGED] app/_layout.tsx (+2/-3)
  [CHANGED] app/candidate/[id].tsx (+13/-10) | -// Tier multipliers / -const TIER_MULTIPLIERS: Record<string, number> = {
  [CHANGED] app/candidate/booking-confirmed.tsx (+1/-1)
  [CHANGED] app/candidate/index.tsx (+24/-21) | -// Tier multipliers / -const TIER_MULTIPLIERS: Record<string, number> = {
  [CHANGED] app/candidate/mentors.tsx (+20/-3) | +  tier?: string | null; / +  const [tierMap, setTierMap] = useState<Record<string, number>>({});
  [CHANGED] app/candidate/schedule.tsx (+1/-1)
  [CHANGED] app/mentor/profile.tsx (+62/-55) | -// Tier configuration / -const TIER_CONFIG = {
  [DELETED] components/GoogleAnalytics.tsx (+0/-53) | -const GA_MEASUREMENT_ID = "G-KCF1V5MJK5"; / -export const GoogleAnalytics = () => {
  [NEW] components/GoogleTagManager.tsx (+52/-0) | +// components/GoogleTagManager.tsx / +const GTM_ID = "GTM-WCMZH59K"; // Your GTM ID from the screenshot
  [CHANGED] services/payment.service.ts (+21/-13) | -// Tier multiplier mapping / -const TIER_MULTIPLIERS: Record<string, number> = {

**ADS CHANGES**
- [Account level]: Final URL is "https://crackjobs.com/interviews/data-science"
- [Account level]: Customer identity created
- [Account level]: Customer identity created
- [Account level]: Terms and conditions accepted |    | Customer identity created
- [Account level]: Final URL is "https://crackjobs.com/contact" | Final URL is "https://crackjobs.com/about" | Final URL is "https://crackjobs.com/interviews/product-management"
- [Account level]: Final URL is "https://crackjobs.com/how-it-works"

*[Day +3 after 2026-01-22: code: LP and other fixes]*
*[Day +5 after 2026-01-20: code: Remove routes]*
*[Day +5 after 2026-01-20: code: Fix routes]*


---

### 2026-01-22

**CODE CHANGES**
- `106c122`: LP and other fixes
  [CHANGED] app/_layout.tsx (+11/-39)
  [CHANGED] app/auth/sign-up.tsx (+5/-0)
  [CHANGED] app/candidate/[id].tsx (+66/-49)
  [CHANGED] app/candidate/index.tsx (+139/-116)
  [CHANGED] app/candidate/pgscreen.tsx (+8/-0)
  [CHANGED] app/candidate/schedule.tsx (+17/-1)
  [CHANGED] app/index.tsx (+3/-3)
  [CHANGED] app/interviews/data-analytics.tsx (+22/-14)
  [CHANGED] app/interviews/data-science.tsx (+27/-15)
  [CHANGED] app/interviews/hr.tsx (+36/-15)
  [CHANGED] app/interviews/product-management.tsx (+18/-6)
  [RENAMED] app/lp/[role].tsx (+89/-84)
  [NEW] components/GoogleAnalytics.tsx (+53/-0)

*[Day +2 after 2026-01-20: code: Remove routes]*
*[Day +2 after 2026-01-20: code: Fix routes]*
*[Day +2 after 2026-01-20: code: Remove wrangler again]*


---

### 2026-01-20

**CODE CHANGES**
- `4cc465d`: Removed middleware
- `b258bca`: Remove routes
  [DELETED] public/_routes.json (+0/-5)
- `aab61b3`: Fix routes
  [CHANGED] public/_routes.json (+2/-8)
- `80b6dd6`: Remove wrangler again
  [DELETED] wrangler.jsonc (+0/-13)
- `84337aa`: Add wrangler back again
  [NEW] wrangler.jsonc (+13/-0)
- `7da36a2`: Removed wrangler.jsonc
  [DELETED] wrangler.jsonc (+0/-9)
- `7514fd6`: Prerenderer
- `3bcbbfb`: SEO checks and video call
  [CHANGED] .gitignore (+0/-1)
  [CHANGED] package.json (+1/-0)
- `b4dea91`: SEO fixes and meeting link fix
  [CHANGED] app/candidate/bookings.tsx (+2/-0)
  [CHANGED] package.json (+6/-37)
  [CHANGED] public/_headers (+77/-10)
  [CHANGED] public/sitemap.xml (+15/-15)
  [CHANGED] services/payment.service.ts (+18/-0)

*[Day +1 after 2026-01-19: code: Bookinf flow fix]*
*[Day +1 after 2026-01-19: code: Fix auto confirm]*
*[Day +2 after 2026-01-18: code: package json fix 2]*


---

### 2026-01-19

**CODE CHANGES**
- `8b0d280`: Bookinf flow fix
  [CHANGED] app/candidate/schedule.tsx (+78/-195)
  [CHANGED] app/mentor/bookings.tsx (+5/-1)
  [CHANGED] services/payment.service.ts (+8/-7)
- `1a1406e`: Fix auto confirm
  [CHANGED] app/candidate/bookings.tsx (+38/-11)
  [CHANGED] app/candidate/pgscreen.tsx (+11/-14)
  [CHANGED] app/index.tsx (+213/-211)
  [CHANGED] services/payment.service.ts (+213/-134)

*[Day +1 after 2026-01-18: code: package json fix 2]*
*[Day +1 after 2026-01-18: code: package json fix]*
*[Day +1 after 2026-01-18: code: SEO fix:remove generate-static-seo]*


---

### 2026-01-18

**CODE CHANGES**
- `d9beb75`: package json fix 2
  [CHANGED] package.json (+103/-102)
- `21ec5cb`: package json fix
  [CHANGED] package.json (+1/-1)
- `4eac662`: SEO fix:remove generate-static-seo
  [CHANGED] package.json (+1/-2)
- `4ca47ca`: SEO fixes
  [CHANGED] app/about.tsx (+31/-0)
  [CHANGED] app/blog/[slug].tsx (+85/-30)
  [CHANGED] app/blog/index.tsx (+165/-26)
  [CHANGED] app/cancellation-policy.tsx (+21/-9)
  [CHANGED] app/candidate/bookings.tsx (+1/-0)
  [CHANGED] app/candidate/pgscreen.tsx (+76/-7)
  [CHANGED] app/candidate/schedule.tsx (+83/-11)
  [CHANGED] app/faq.tsx (+83/-59)
  [CHANGED] app/how-it-works.tsx (+42/-1)
  [CHANGED] app/index.tsx (+486/-336)
  [DELETED] app/landing.tsx (+0/-663)
  [CHANGED] app/privacy.tsx (+121/-103)
  [CHANGED] app/terms.tsx (+158/-139)
  [DELETED] components/SEO.tsx (+0/-48)
  [CHANGED] services/payment.service.ts (+179/-82)

*[Day +1 after 2026-01-17: code: Fix responsive and interviews loading]*
*[Day +1 after 2026-01-17: code: 100ms and LP]*
*[Day +4 after 2026-01-14: code: 100ms, margin update]*


---

### 2026-01-17

**CODE CHANGES**
- `9b5a898`: Fix responsive and interviews loading
  [CHANGED] app/index.tsx (+59/-53)
  [CHANGED] app/interviews/data-analytics.tsx (+111/-17)
  [CHANGED] app/interviews/data-science.tsx (+113/-19)
  [CHANGED] app/interviews/hr.tsx (+113/-19)
  [CHANGED] app/interviews/product-management.tsx (+43/-24)
- `5dc787c`: 100ms and LP
  [CHANGED] app/admin/approvals.tsx (+94/-17)
  [CHANGED] app/candidate/[id].tsx (+142/-211)
  [DELETED] app/candidate/booking-confirmed.tsx.backup (+0/-61)
  [CHANGED] app/candidate/bookings.tsx (+141/-277)
  [CHANGED] app/candidate/index.tsx (+267/-643)
  [DELETED] app/candidate/index.tsx.backup (+0/-297)
  [DELETED] app/candidate/mentors.tsx.backup (+0/-357)
  [DELETED] app/candidate/profile.tsx.backup (+0/-553)
  [CHANGED] app/candidate/schedule.tsx (+7/-145)
  [CHANGED] app/index.tsx (+167/-33)
  [CHANGED] app/interviews/data-analytics.tsx (+68/-24)
  [CHANGED] app/interviews/data-science.tsx (+69/-25)
  [CHANGED] app/interviews/hr.tsx (+69/-25)
  [CHANGED] app/interviews/product-management.tsx (+65/-21)
  [CHANGED] app/lp/index.tsx (+170/-60)
  [DELETED] app/mentor/availability.tsx.backup (+0/-552)
  [CHANGED] app/mentor/bookings.tsx (+8/-99)
  [DELETED] app/mentor/bookings.tsx.backup (+0/-1190)
  [DELETED] app/mentor/mentorship.tsx.backup (+0/-823)
  [CHANGED] app/mentor/profile.tsx (+176/-99)
  [DELETED] app/mentor/profile.tsx.backup (+0/-570)
  [CHANGED] app/mentor/session/[id].tsx (+136/-88)
  [DELETED] app/mentor/under-review.tsx.backup (+0/-61)
  [CHANGED] components/LazySections.tsx (+72/-64)
  [CHANGED] public/sitemap.xml (+52/-38)
  [CHANGED] services/payment.service.ts (+21/-3)

*[Day +3 after 2026-01-14: code: 100ms, margin update]*


---

### 2026-01-14

**CODE CHANGES**
- `d52ca7f`: 100ms, margin update
  [CHANGED] app/candidate/[id].tsx (+142/-34)
  [CHANGED] app/candidate/bookings.tsx (+248/-236)
  [DELETED] app/candidate/bookings.tsx.backup (+0/-388)
  [CHANGED] app/candidate/index.tsx (+36/-49)
  [CHANGED] app/candidate/mentors.tsx (+1/-1)
  [CHANGED] app/candidate/schedule.tsx (+24/-40)
  [CHANGED] app/mentor/_layout.tsx (+1/-2)
  [CHANGED] app/mentor/bookings.tsx (+299/-288)
  [NEW] app/mentor/bookings.tsx.backup (+1190/-0)
  [CHANGED] app/mentor/profile.tsx (+102/-76)
  [NEW] app/video-call.tsx (+278/-0)
  [NEW] components/VideoCall.tsx (+181/-0)
  [CHANGED] package.json (+102/-98)
  [NEW] package.json.backup-tldraw (+103/-0)
  [CHANGED] services/payment.service.ts (+37/-23)

*[Day +7 after 2026-01-07: code: Fix separate pages, Day wise availability, performance score]*


---

### 2026-01-07

**CODE CHANGES**
- `8c2682e`: Fix separate pages, Day wise availability, performance score
  [CHANGED] app/_layout.tsx (+6/-26)
  [CHANGED] app/about.tsx (+456/-149)
  [CHANGED] app/candidate/bookings.tsx (+21/-6)
  [CHANGED] app/candidate/index.tsx (+25/-11)
  [CHANGED] app/candidate/schedule.tsx (+121/-111)
  [CHANGED] app/contact.tsx (+495/-114)
  [CHANGED] app/how-it-works.tsx (+498/-233)
  [CHANGED] app/index.tsx (+32/-15)
  [DELETED] app/interviews/[role].tsx (+0/-753)
  [CHANGED] app/interviews/data-analytics.tsx (+1/-1)
  [CHANGED] app/interviews/data-science.tsx (+680/-371)
  [CHANGED] app/interviews/hr.tsx (+856/-336)
  [CHANGED] app/interviews/product-management.tsx (+1/-1)
  [CHANGED] app/mentor/availability.tsx (+142/-90)
  [CHANGED] app/mentor/bookings.tsx (+58/-40)
  [CHANGED] app/mentor/profile.tsx (+106/-15)
  [CHANGED] components/MentorAvailabilityEditor.tsx (+60/-70)

*[Day +1 after 2026-01-06: code: Major SEO fixes, booking floww fix]*
*[Day +3 after 2026-01-04: code: Forgot pswd, bookings changes, Linkedin LP]*


---

### 2026-01-06

**CODE CHANGES**
- `4b1330c`: Major SEO fixes, booking floww fix
  [CHANGED] app.json (+2/-1)
  [CHANGED] app/_layout.tsx (+19/-5)
  [CHANGED] app/auth/sign-up.tsx (+1/-1)
  [CHANGED] app/blog/[slug].tsx (+60/-283)
  [CHANGED] app/blog/index.tsx (+93/-82)
  [CHANGED] app/candidate/[id].tsx (+93/-12)
  [CHANGED] app/candidate/bookings.tsx (+839/-231)
  [CHANGED] app/candidate/index.tsx (+1/-1)
  [CHANGED] app/candidate/profile.tsx (+94/-17)
  [CHANGED] app/candidate/session/[id].tsx (+59/-47)
  [CHANGED] app/index.tsx (+125/-94)
  [NEW] app/interviews/data-analytics.tsx (+823/-0)
  [NEW] app/interviews/data-science.tsx (+562/-0)
  [NEW] app/interviews/hr.tsx (+515/-0)
  [NEW] app/interviews/product-management.tsx (+960/-0)
  [CHANGED] app/mentor/bookings.tsx (+688/-125)
  [CHANGED] app/mentor/profile.tsx (+2/-2)
  [CHANGED] app/mentor/session/[id].tsx (+157/-64)
  [CHANGED] components/BlogRenderer.tsx (+92/-60)
  [CHANGED] components/StandardPageTemplate.tsx (+174/-234)
  [DELETED] public/index.html (+0/-157)

*[Day +2 after 2026-01-04: code: Forgot pswd, bookings changes, Linkedin LP]*
*[Day +7 after 2025-12-30: code: Interviews fix4]*
*[Day +7 after 2025-12-30: code: Interviews fix3]*


---

### 2026-01-04

**CODE CHANGES**
- `0602a89`: Forgot pswd, bookings changes, Linkedin LP
  [NEW] app/auth/forgot-password.tsx (+356/-0)
  [NEW] app/auth/reset-password.tsx (+467/-0)
  [CHANGED] app/auth/sign-in.tsx (+23/-4)
  [CHANGED] app/auth/sign-up.tsx (+128/-82)
  [CHANGED] app/candidate/index.tsx (+114/-10)
  [NEW] app/lp/index.tsx (+389/-0)
  [CHANGED] app/mentor/mentorship.tsx (+550/-81)
  [CHANGED] components/LazySections.tsx (+4/-4)
  [CHANGED] services/auth.service.ts (+66/-0)

*[Day +5 after 2025-12-30: code: Interviews fix4]*
*[Day +5 after 2025-12-30: code: Interviews fix3]*
*[Day +5 after 2025-12-30: code: Fixes interviews page]*


---

### 2025-12-30

**CODE CHANGES**
- `cfe458e`: Interviews fix4
  [CHANGED] app/interviews/[role].tsx (+622/-201)
- `140287a`: Interviews fix3
  [DELETED] _redirects (+0/-8)
  [CHANGED] app/interviews/[role].tsx (+82/-15)
- `98a2839`: Fixes interviews page
  [NEW] _redirects (+8/-0)
- `6110302`: Loading fixes and blogs and homepage changes
  [CHANGED] app/blog/[slug].tsx (+54/-21)
  [CHANGED] app/interviews/[role].tsx (+18/-10)
  [CHANGED] components/LazySections.tsx (+295/-36)
  [CHANGED] components/StandardPageTemplate.tsx (+33/-39)
  [CHANGED] public/sitemap.xml (+23/-7)

*[Day +3 after 2025-12-27: code: Slot cleanup, notifbanner,emails]*
*[Day +3 after 2025-12-27: code: Ionicon mweb fix2]*
*[Day +3 after 2025-12-27: code: Ionicon mweb fix]*


---

### 2025-12-27

**CODE CHANGES**
- `0fe67de`: Slot cleanup, notifbanner,emails
  [CHANGED] app/auth/sign-up.tsx (+1/-1)
  [CHANGED] app/candidate/bookings.tsx (+29/-41)
  [CHANGED] app/candidate/schedule.tsx (+1/-1)
  [CHANGED] app/candidate/session/[id].tsx (+0/-1)
  [CHANGED] app/mentor/bookings.tsx (+10/-3)
  [CHANGED] app/mentor/session/[id].tsx (+6/-6)
  [CHANGED] components/LazySections.tsx (+119/-0)
  [CHANGED] services/auth.service.ts (+60/-0)
  [CHANGED] services/payment.service.ts (+64/-33)
- `0cf8871`: Ionicon mweb fix2
  [CHANGED] components/layout/DashboardLayout.tsx (+15/-1)
- `ef96b80`: Ionicon mweb fix
  [CHANGED] app.json (+9/-52)
  [CHANGED] app/_layout.tsx (+14/-32)
  [CHANGED] metro.config.js (+3/-0)
  [CHANGED] package.json (+27/-28)

*[Day +1 after 2025-12-26: code: SEO fixes2]*
*[Day +2 after 2025-12-25: code: SEO fixes]*
*[Day +4 after 2025-12-23: code: Stop ignoring package-lock]*


---

### 2025-12-26

**CODE CHANGES**
- `9e76bfa`: SEO fixes2
  [CHANGED] app/index.tsx (+1/-1)

*[Day +1 after 2025-12-25: code: SEO fixes]*
*[Day +3 after 2025-12-23: code: Stop ignoring package-lock]*
*[Day +3 after 2025-12-23: code: Auto update testing]*


---

### 2025-12-25

**CODE CHANGES**
- `e45b934`: SEO fixes
  [CHANGED] app.json (+7/-3)
  [CHANGED] app/index.tsx (+6/-1)
  [CHANGED] app/mentor/bookings.tsx (+2/-2)
  [CHANGED] components/SplashScreen.tsx (+1/-1)
  [CHANGED] components/StandardPageTemplate.tsx (+19/-27)
  [CHANGED] public/index.html (+39/-6)

*[Day +2 after 2025-12-23: code: Stop ignoring package-lock]*
*[Day +2 after 2025-12-23: code: Auto update testing]*
*[Day +3 after 2025-12-22: code: Analyitcs fix]*


---

### 2025-12-23

**CODE CHANGES**
- `5c5a785`: Stop ignoring package-lock
  [CHANGED] .gitignore (+0/-1)
- `c5981a7`: Auto update testing
  [CHANGED] app.json (+6/-0)
  [CHANGED] app/auth/sign-up.tsx (+28/-3)
  [CHANGED] app/mentor/profile.tsx (+4/-2)

*[Day +1 after 2025-12-22: code: Analyitcs fix]*
*[Day +1 after 2025-12-22: code: Analytics]*
*[Day +1 after 2025-12-22: code: Web GA and blog post]*


---

### 2025-12-22

**CODE CHANGES**
- `cf4a365`: Analyitcs fix
  [CHANGED] lib/analytics.ts (+1/-1)
- `6e61b88`: Analytics
  [CHANGED] app/_layout.tsx (+10/-1)
- `183bbdc`: Web GA and blog post
  [CHANGED] app/_layout.tsx (+19/-1)
  [NEW] lib/analytics.ts (+56/-0)
  [CHANGED] public/sitemap.xml (+13/-1)

*[Day +1 after 2025-12-21: code: ratings, layout, rzp and splash]*
*[Day +3 after 2025-12-19: code: Browse mentors fix]*
*[Day +4 after 2025-12-18: code: Search console report changes]*


---

### 2025-12-21

**CODE CHANGES**
- `0fa2920`: ratings, layout, rzp and splash
  [CHANGED] app.json (+2/-13)
  [CHANGED] app/_layout.tsx (+87/-64)
  [CHANGED] app/auth/sign-in.tsx (+4/-15)
  [CHANGED] app/candidate/bookings.tsx (+210/-62)
  [CHANGED] app/mentor/_layout.tsx (+4/-5)
  [CHANGED] app/mentor/mentorship.tsx (+203/-584)
  [CHANGED] components/Footer.tsx (+1/-3)
  [NEW] components/RatingModal.tsx (+242/-0)
  [CHANGED] components/SplashScreen.tsx (+1/-1)
  [CHANGED] components/layout/DashboardLayout.tsx (+67/-70)
  [CHANGED] package.json (+3/-3)
  [CHANGED] services/payment.service.ts (+134/-57)

*[Day +2 after 2025-12-19: code: Browse mentors fix]*
*[Day +3 after 2025-12-18: code: Search console report changes]*
*[Day +4 after 2025-12-17: code: Fix SEO 8]*


---

### 2025-12-19

**CODE CHANGES**
- `b46b6fd`: Browse mentors fix
  [CHANGED] app/auth/sign-in.tsx (+44/-62)
  [CHANGED] app/cancellation-policy.tsx (+4/-5)
  [CHANGED] app/candidate/bookings.tsx (+22/-6)
  [CHANGED] app/candidate/index.tsx (+729/-83)
  [CHANGED] app/how-it-works.tsx (+6/-12)
  [CHANGED] app/index.tsx (+84/-16)
  [CHANGED] components/LazySections.tsx (+147/-28)
  [CHANGED] package.json (+1/-0)
  [CHANGED] services/auth.service.ts (+2/-52)

*[Day +1 after 2025-12-18: code: Search console report changes]*
*[Day +2 after 2025-12-17: code: Fix SEO 8]*
*[Day +2 after 2025-12-17: code: Fix seo  8]*


---

### 2025-12-18

**CODE CHANGES**
- `7ecb20e`: Search console report changes
  [CHANGED] app/cancellation-policy.tsx (+120/-113)
  [CHANGED] app/how-it-works.tsx (+128/-104)
  [CHANGED] app/interviews/[role].tsx (+11/-1)
  [CHANGED] public/robots.txt (+6/-0)

*[Day +1 after 2025-12-17: code: Fix SEO 8]*
*[Day +1 after 2025-12-17: code: Fix seo  8]*
*[Day +1 after 2025-12-17: code: SEO fixes 7]*


---

### 2025-12-17

**CODE CHANGES**
- `5bcad0f`: Fix SEO 8
  [CHANGED] app/index.tsx (+95/-173)
  [CHANGED] components/LazySections.tsx (+48/-38)
- `2b5f10c`: Fix seo  8
  [CHANGED] app/index.tsx (+23/-20)
  [CHANGED] components/LazySections.tsx (+1/-1)
- `47f0f3c`: SEO fixes 7
  [CHANGED] app/index.tsx (+53/-34)
  [CHANGED] components/LazySections.tsx (+8/-9)
- `72b8795`: Fix SEO7
  [CHANGED] app/index.tsx (+140/-90)
  [CHANGED] components/Header.tsx (+49/-6)
  [CHANGED] components/LazySections.tsx (+214/-228)
  [CHANGED] metro.config.js (+8/-0)
  [CHANGED] public/_headers (+59/-7)
- `20c6827`: Fix SEO6
  [NEW] app/admin/_layout.tsx.backup (+81/-0)
  [NEW] app/admin/approvals.tsx.backup (+146/-0)
  [NEW] app/admin/index.tsx.backup (+86/-0)
  [NEW] app/admin/payouts.tsx.backup (+459/-0)
  [NEW] app/admin/profiles.tsx.backup (+170/-0)
  [NEW] app/admin/templates.tsx.backup (+250/-0)
  [NEW] app/auth/sign-up.tsx.backup (+614/-0)
  [NEW] app/candidate/booking-confirmed.tsx.backup (+61/-0)
  [NEW] app/candidate/bookings.tsx.backup (+388/-0)
  [NEW] app/candidate/index.tsx.backup (+297/-0)
  [NEW] app/candidate/mentors.tsx.backup (+357/-0)
  [NEW] app/candidate/profile.tsx.backup (+553/-0)
  [CHANGED] app/index.tsx (+49/-454)
  [NEW] app/mentor/availability.tsx.backup (+552/-0)
  [NEW] app/mentor/mentorship.tsx.backup (+823/-0)
  [NEW] app/mentor/profile.tsx.backup (+570/-0)
  [NEW] app/mentor/under-review.tsx.backup (+61/-0)
  [NEW] components/LazySections.tsx (+277/-0)
  [CHANGED] package.json (+2/-3)
- `a5fbe1d`: SEO Fixes6
  [CHANGED] app/candidate/payment.tsx (+10/-6)
  [CHANGED] app/candidate/sessions.tsx (+22/-9)

*[Day +1 after 2025-12-16: code: Fix SEO5]*
*[Day +1 after 2025-12-16: code: SEO fix4]*
*[Day +1 after 2025-12-16: code: SEO fix3]*


---

### 2025-12-16

**CODE CHANGES**
- `9cf3472`: Fix SEO5
  [CHANGED] app/index.tsx (+34/-5)
- `9114aac`: SEO fix4
  [CHANGED] package.json (+37/-26)
- `00aeea6`: SEO fix3
  [CHANGED] package.json (+28/-6)
- `4f04c85`: SEO Fixes 2
  [CHANGED] package.json (+30/-1)
- `03d7114`: SEO changes1
  [CHANGED] app/about.tsx (+6/-0)
  [CHANGED] app/blog/[slug].tsx (+7/-6)
  [CHANGED] app/blog/index.tsx (+3/-8)
  [CHANGED] app/cancellation-policy.tsx (+5/-0)
  [CHANGED] app/contact.tsx (+5/-0)
  [CHANGED] app/faq.tsx (+5/-0)
  [CHANGED] app/how-it-works.tsx (+5/-0)
  [CHANGED] app/index.tsx (+109/-117)
  [CHANGED] app/interviews/[role].tsx (+8/-11)
  [CHANGED] app/landing.tsx (+8/-0)
  [CHANGED] app/privacy.tsx (+6/-0)
  [CHANGED] app/terms.tsx (+5/-0)
  [CHANGED] components/Footer.tsx (+25/-6)
  [NEW] components/SEO.tsx (+48/-0)
  [CHANGED] package.json (+36/-100)
  [CHANGED] public/index.html (+82/-8)

*[Day +2 after 2025-12-14: code: Fix splash on web]*
*[Day +2 after 2025-12-14: code: SEO fixes]*
*[Day +3 after 2025-12-13: code: Emails and schedule fix]*


---

### 2025-12-14

**CODE CHANGES**
- `c53c4db`: Fix splash on web
  [CHANGED] app.json (+1/-1)
  [CHANGED] app/index.tsx (+1/-1)
- `d30e5df`: SEO fixes
  [CHANGED] app.json (+1/-1)
  [CHANGED] app/auth/sign-in.tsx (+83/-132)
  [CHANGED] app/auth/sign-up.tsx (+18/-82)
  [CHANGED] app/index.tsx (+127/-128)
  [NEW] app/interviews/[role].tsx (+250/-0)
  [CHANGED] app/mentor/profile.tsx (+1/-1)
  [CHANGED] components/Footer.tsx (+109/-61)
  [NEW] public/favicon.png (+0/-0)
  [CHANGED] public/index.html (+17/-5)
  [CHANGED] public/robots.txt (+6/-8)
  [CHANGED] public/sitemap.xml (+53/-21)

*[Day +1 after 2025-12-13: code: Emails and schedule fix]*
*[Day +2 after 2025-12-12: code: Approvals and emails]*
*[Day +3 after 2025-12-11: code: RZP manual escrow setup v1]*


---

### 2025-12-13

**CODE CHANGES**
- `523874f`: Emails and schedule fix
  [CHANGED] app/candidate/bookings.tsx (+1/-1)
  [CHANGED] app/candidate/schedule.tsx (+12/-1)
  [CHANGED] services/payment.service.ts (+101/-179)

*[Day +1 after 2025-12-12: code: Approvals and emails]*
*[Day +2 after 2025-12-11: code: RZP manual escrow setup v1]*
*[Day +2 after 2025-12-11: code: Robots fix 5]*


---

### 2025-12-12

**CODE CHANGES**
- `564bde7`: Approvals and emails
  [CHANGED] app/admin/approvals.tsx (+12/-0)
  [CHANGED] app/admin/payouts.tsx (+376/-376)
  [CHANGED] services/payment.service.ts (+150/-243)

*[Day +1 after 2025-12-11: code: RZP manual escrow setup v1]*
*[Day +1 after 2025-12-11: code: Robots fix 5]*
*[Day +1 after 2025-12-11: code: Headers fix4]*


---

### 2025-12-11

**CODE CHANGES**
- `9a54e34`: RZP manual escrow setup v1
  [CHANGED] app/admin/_layout.tsx (+1/-1)
  [NEW] app/admin/payouts.tsx (+459/-0)
  [CHANGED] app/candidate/pgscreen.tsx (+116/-29)
  [CHANGED] app/mentor/bookings.tsx (+95/-17)
  [CHANGED] app/mentor/profile.tsx (+110/-12)
  [NEW] components/mentor/BankDetailsModal.tsx (+126/-0)
  [CHANGED] services/payment.service.ts (+325/-36)
- `c4cf3cf`: Robots fix 5
  [CHANGED] app/_layout.tsx (+11/-0)
  [NEW] public/_routes.json (+11/-0)
- `1c00405`: Headers fix4
  [CHANGED] public/_headers (+2/-3)
- `90b9738`: Headers fix3
  [CHANGED] public/_headers (+8/-19)
- `b553dc4`: Headers fix2
  [CHANGED] public/_headers (+3/-7)
- `c63fbac`: Headers fix
  [CHANGED] public/_headers (+4/-9)
- `275f79b`: Robots fix and Ionicons
  [CHANGED] app.json (+2/-1)
  [CHANGED] app/_layout.tsx (+32/-37)
  [CHANGED] app/index.tsx (+67/-26)
  [CHANGED] package.json (+2/-1)
  [NEW] public/_headers (+31/-0)
  [CHANGED] wrangler.jsonc (+3/-1)

*[Day +1 after 2025-12-10: code: Remove broken redirects file]*
*[Day +1 after 2025-12-10: code: Right amount and LP pagespeed fixes]*
*[Day +1 after 2025-12-10: code: New LP and ionicons fix]*


---

### 2025-12-10

**CODE CHANGES**
- `07cf003`: Remove broken redirects file
  [DELETED] public/_redirects (+0/-9)
- `539647e`: Right amount and LP pagespeed fixes
  [CHANGED] app/candidate/pgscreen.tsx (+34/-59)
  [CHANGED] app/index.tsx (+11/-3)
  [CHANGED] services/payment.service.ts (+7/-4)
- `560a9b2`: New LP and ionicons fix
  [CHANGED] app/_layout.tsx (+65/-24)
  [CHANGED] app/candidate/index.tsx (+1/-1)
  [CHANGED] app/index.tsx (+457/-329)
  [CHANGED] public/robots.txt (+0/-24)
- `24374ff`: Fix: Resolve white screen and font loading issues for web de
  [CHANGED] app/_layout.tsx (+52/-24)

*[Day +1 after 2025-12-09: code: White screen fix5]*
*[Day +1 after 2025-12-09: code: White screen fix4]*
*[Day +1 after 2025-12-09: code: White screen fix3]*


---

### 2025-12-09

**CODE CHANGES**
- `1eb7ea5`: White screen fix5
  [CHANGED] public/_redirects (+9/-1)
- `8babfc6`: White screen fix4
  [CHANGED] app/_layout.tsx (+16/-11)
- `7f4616e`: White screen fix3
  [CHANGED] app/_layout.tsx (+5/-9)
- `40e8853`: White screen fix2
  [CHANGED] app/_layout.tsx (+11/-12)
- `9ca2a92`: White screen fix
  [CHANGED] app/_layout.tsx (+3/-5)
- `2a64640`: pgscreen and profile fixes
  [CHANGED] app/candidate/pgscreen.tsx (+1/-2)
  [CHANGED] app/mentor/profile.tsx (+28/-18)
  [CHANGED] public/index.html (+27/-1)
  [CHANGED] services/payment.service.ts (+73/-55)
- `bf21a6d`: Test font fix on preview
  [CHANGED] app/_layout.tsx (+1/-2)
- `f395d86`: Ionicon fix
  [CHANGED] app/_layout.tsx (+15/-14)
- `b54786f`: Fixed evaluations
  [CHANGED] app/candidate/pgscreen.tsx (+132/-128)
  [CHANGED] app/candidate/schedule.tsx (+38/-4)
  [CHANGED] app/candidate/session/[id].tsx (+339/-300)
  [CHANGED] app/mentor/session/[id].tsx (+356/-197)
  [CHANGED] package.json (+2/-1)
  [CHANGED] services/payment.service.ts (+46/-20)

*[Day +2 after 2025-12-07: code: Pre razorpay changes]*
*[Day +4 after 2025-12-05: code: Update candidate index and app index]*
*[Day +5 after 2025-12-04: code: Sitemap, robots, ionicons, default availability,eval templat]*


---

### 2025-12-07

**CODE CHANGES**
- `0258045`: Pre razorpay changes
  [CHANGED] app/candidate/[id].tsx (+80/-19)
  [CHANGED] app/candidate/bookings.tsx (+45/-9)
  [CHANGED] app/candidate/pgscreen.tsx (+55/-83)
  [CHANGED] app/candidate/schedule.tsx (+78/-91)
  [CHANGED] app/mentor/bookings.tsx (+180/-161)
  [CHANGED] services/payment.service.ts (+22/-25)

*[Day +2 after 2025-12-05: code: Update candidate index and app index]*
*[Day +3 after 2025-12-04: code: Sitemap, robots, ionicons, default availability,eval templat]*
*[Day +3 after 2025-12-04: code: Pagespeed changes- Smaller hero and no razp]*


---

### 2025-12-05

**CODE CHANGES**
- `1bfca87`: Update candidate index and app index
  [CHANGED] app/candidate/index.tsx (+1/-1)
  [CHANGED] app/index.tsx (+1/-1)

*[Day +1 after 2025-12-04: code: Sitemap, robots, ionicons, default availability,eval templat]*
*[Day +1 after 2025-12-04: code: Pagespeed changes- Smaller hero and no razp]*
*[Day +1 after 2025-12-04: code: Refresh fix and resume on join state]*


---

### 2025-12-04

**CODE CHANGES**
- `b2d7e8a`: Sitemap, robots, ionicons, default availability,eval templat
  [CHANGED] app/_layout.tsx (+4/-0)
  [CHANGED] app/candidate/schedule.tsx (+8/-3)
  [CHANGED] app/index.tsx (+2/-1)
  [CHANGED] app/mentor/availability.tsx (+4/-2)
  [CHANGED] components/MentorAvailabilityEditor.tsx (+88/-62)
  [NEW] public/hero.webp (+0/-0)
  [CHANGED] public/robots.txt (+27/-120)
  [CHANGED] public/sitemap.xml (+24/-158)
- `0041b54`: Pagespeed changes- Smaller hero and no razp
  [CHANGED] app/candidate/pgscreen.tsx (+15/-2)
  [CHANGED] app/index.tsx (+1/-1)
  [CHANGED] public/index.html (+0/-2)
- `cb73283`: Refresh fix and resume on join state
  [CHANGED] app/_layout.tsx (+27/-19)
  [CHANGED] app/candidate/_layout.tsx (+59/-1)
  [CHANGED] app/mentor/_layout.tsx (+72/-38)
  [CHANGED] app/mentor/bookings.tsx (+10/-0)
  [NEW] public/_redirects (+1/-0)
- `3beefdd`: Deleted redirects
  [DELETED] public/_redirects (+0/-1)
- `5dedf62`: redirects
  [CHANGED] public/_redirects (+1/-1)
- `6886cf8`: Font recovery
  [CHANGED] app/mentor/bookings.tsx (+1/-1)
  [CHANGED] app/mentor/profile.tsx (+25/-64)
  [CHANGED] components/SplashScreen.tsx (+25/-17)
  [CHANGED] components/ui.tsx (+22/-33)
  [CHANGED] lib/theme.ts (+24/-5)

*[Day +1 after 2025-12-03: code: wrangler push]*
*[Day +1 after 2025-12-03: code: One more layout fix]*
*[Day +1 after 2025-12-03: code: Footer Inter fix]*


---

### 2025-12-03

**CODE CHANGES**
- `2e3ea35`: wrangler push
  [NEW] wrangler.jsonc (+7/-0)
- `70f9f85`: One more layout fix
  [CHANGED] app/_layout.tsx (+19/-7)
- `27ae645`: Footer Inter fix
  [CHANGED] components/Footer.tsx (+34/-42)
  [CHANGED] components/ui.tsx (+408/-411)
- `c3f1699`: Layout fix 2
  [CHANGED] app/_layout.tsx (+12/-11)
- `6add48b`: App layout seo fix
  [CHANGED] app/_layout.tsx (+12/-5)
- `f9a1792`: Layout fix
  [CHANGED] app/_layout.tsx (+5/-5)
- `0ff50f3`: index file defer
  [CHANGED] public/index.html (+1/-1)
- `b44d865`: Inter removal
  [CHANGED] app/index.tsx (+124/-17)
  [CHANGED] components/StandardPageTemplate.tsx (+264/-135)
- `bfbd662`: SEO fixes
  [CHANGED] app.json (+2/-2)
  [CHANGED] app/about.tsx (+143/-64)
  [CHANGED] app/cancellation-policy.tsx (+126/-63)
  [CHANGED] app/contact.tsx (+110/-56)
  [CHANGED] app/faq.tsx (+232/-75)
  [CHANGED] app/how-it-works.tsx (+207/-83)
  [CHANGED] app/privacy.tsx (+113/-69)
  [CHANGED] app/terms.tsx (+139/-76)
  [CHANGED] components/Footer.tsx (+6/-0)
  [CHANGED] components/Header.tsx (+93/-79)
  [NEW] components/StandardPageTemplate.tsx (+192/-0)
  [CHANGED] public/index.html (+1/-1)
- `ce51245`: View eval fix and index seo readded
  [CHANGED] app/candidate/bookings.tsx (+1/-1)
  [CHANGED] app/index.tsx (+79/-22)
  [CHANGED] app/mentor/bookings.tsx (+86/-44)
- `fe56735`: Add candidate evaluation viewing page
  [NEW] app/candidate/session/[id].tsx (+458/-0)
  [CHANGED] app/mentor/session/[id].tsx (+14/-2)
- `d339209`: Reschedule and Evaluation fix
  [CHANGED] app/candidate/bookings.tsx (+39/-135)
  [CHANGED] app/mentor/bookings.tsx (+142/-256)
  [CHANGED] app/mentor/session/[id].tsx (+59/-32)
  [CHANGED] services/payment.service.ts (+27/-122)
- `a331d4c`: Booking revert
  [CHANGED] app/candidate/bookings.tsx (+35/-8)
  [CHANGED] app/mentor/bookings.tsx (+1/-1)
- `b5794a7`: Bookings fix partial
  [CHANGED] app/auth/sign-in.tsx (+1/-1)
  [CHANGED] app/auth/sign-up.tsx (+1/-1)
  [CHANGED] app/mentor/bookings.tsx (+1/-1)
  [CHANGED] app/mentor/profile.tsx (+2/-1)
  [CHANGED] package.json (+1/-0)

*[Day +1 after 2025-12-02: code: Revert bookings.tsx to commit bf2918b]*
*[Day +1 after 2025-12-02: code: Refresh issue fixed]*
*[Day +1 after 2025-12-02: code: Blog launch and fix attempts]*


---

### 2025-12-02

**CODE CHANGES**
- `6167a3b`: Revert bookings.tsx to commit bf2918b
  [CHANGED] app/mentor/bookings.tsx (+177/-252)
- `73a9c7d`: Refresh issue fixed
  [NEW] public/_redirects (+1/-0)
- `ccbc5ed`: Blog launch and fix attempts
  [DELETED] app/blog.tsx (+0/-75)
  [NEW] app/blog/[slug].tsx (+365/-0)
  [NEW] app/blog/index.tsx (+308/-0)
  [CHANGED] app/candidate/bookings.tsx (+8/-35)
  [CHANGED] app/contact.tsx (+2/-18)
  [CHANGED] app/index.tsx (+1/-2)
  [CHANGED] app/mentor/bookings.tsx (+252/-177)
  [NEW] components/BlogRenderer.tsx (+147/-0)
  [CHANGED] components/Footer.tsx (+4/-4)
  [CHANGED] package.json (+1/-0)
- `bf2918b`: LP changes, icon changes and eyes change
  [CHANGED] app/_layout.tsx (+1/-1)
  [CHANGED] app/index.tsx (+90/-694)
  [CHANGED] components/SplashScreen.tsx (+1/-2)

*[Day +1 after 2025-12-01: code: Fix: Finalize Razorpay integration and booking full name fix]*
*[Day +1 after 2025-12-01: code: LP fixes and post live 

LP fixes and schedule redesign]*
*[Day +1 after 2025-12-01: code: LP fixes and schedule redesign]*


---

### 2025-12-01

**CODE CHANGES**
- `24e49fa`: Fix: Finalize Razorpay integration and booking full name fix
  [CHANGED] app/candidate/bookings.tsx (+3/-3)
  [CHANGED] app/candidate/pgscreen.tsx (+55/-46)
  [CHANGED] app/candidate/schedule.tsx (+49/-199)
  [CHANGED] services/payment.service.ts (+122/-157)
- `dbe7b8d`: LP fixes and post live 

LP fixes and schedule redesign
  [CHANGED] app/auth/sign-up.tsx (+21/-1)
  [CHANGED] app/index.tsx (+85/-14)
- `86e5fdf`: LP fixes and schedule redesign
  [CHANGED] app/auth/sign-up.tsx (+21/-1)
  [CHANGED] app/index.tsx (+85/-14)

*[Day +1 after 2025-11-30: code: Landing page improvement]*
*[Day +1 after 2025-11-30: code: feat: setup razorpay edge function & update scheduling logic]*
*[Day +1 after 2025-11-30: code: Fix package.json and update index entry point]*


---

### 2025-11-30

**CODE CHANGES**
- `7ad7890`: Landing page improvement
  [CHANGED] app/index.tsx (+19/-38)
- `687554b`: feat: setup razorpay edge function & update scheduling logic
  [CHANGED] app/candidate/pgscreen.tsx (+30/-5)
  [CHANGED] app/candidate/schedule.tsx (+496/-261)
  [CHANGED] app/index.tsx (+4/-4)
  [CHANGED] services/payment.service.ts (+55/-8)
- `0c2c6e5`: Fix package.json and update index entry point
  [CHANGED] app/index.tsx (+1/-1)
- `97b81a8`: Fix package.json JSON syntax and add web build script
  [CHANGED] package.json (+4/-0)
- `c748e4b`: Update web index entry point
  [CHANGED] app/index.tsx (+2/-2)
- `79ef4d3`: qa-build-web

Final alignment tweaks for Landing Page aesthe
  [CHANGED] app/auth/sign-in.tsx (+152/-74)
  [CHANGED] app/candidate/index.tsx (+1/-1)
  [CHANGED] app/index.tsx (+693/-155)
  [CHANGED] components/Footer.tsx (+9/-2)
  [CHANGED] components/layout/DashboardLayout.tsx (+212/-74)
- `978516b`: fix crop issue
  [CHANGED] app.json (+18/-4)
  [CHANGED] app/_layout.tsx (+17/-15)
  [CHANGED] app/candidate/index.tsx (+20/-1)
  [CHANGED] components/layout/DashboardLayout.tsx (+77/-192)
  [CHANGED] package.json (+1/-0)
- `355d5bd`: finalbuild2

Major functional and UI updates:
- Payments: Re
  [CHANGED] app/candidate/[id].tsx (+22/-18)
  [CHANGED] app/mentor/profile.tsx (+37/-17)
  [CHANGED] services/payment.service.ts (+27/-9)
  [NEW] setup-and-build.bat (+152/-0)

*[Day +1 after 2025-11-29: code: finalbuild1

Comprehensive UI/UX overhaul and logic synchron]*
*[Day +1 after 2025-11-29: code: feat: resume upload and view

Candidate Profile:
- Removed P]*
*[Day +1 after 2025-11-29: code: mentor-fixes-final

Refactor mentor availability to use rule]*


---

### 2025-11-29

**CODE CHANGES**
- `e9ba6ab`: finalbuild1

Comprehensive UI/UX overhaul and logic synchron
  [CHANGED] app/candidate/bookings.tsx (+376/-139)
  [CHANGED] app/candidate/index.tsx (+57/-110)
  [CHANGED] app/candidate/profile.tsx (+125/-73)
  [CHANGED] components/layout/DashboardLayout.tsx (+67/-19)
- `5c1cd05`: feat: resume upload and view

Candidate Profile:
- Removed P
  [CHANGED] app/candidate/profile.tsx (+215/-124)
  [CHANGED] app/mentor/bookings.tsx (+65/-105)
- `2a26f6b`: Merge remote main into local main
- `3ef750c`: mentor-fixes-final

Refactor mentor availability to use rule
  [CHANGED] app/mentor/_layout.tsx (+0/-1)
  [CHANGED] app/mentor/availability.tsx (+536/-8)
  [CHANGED] app/mentor/bookings.tsx (+0/-1)
  [CHANGED] app/mentor/profile.tsx (+193/-308)
- `eddcdea`: Booking enhancements: mentor dashboard, stats & profile deta
  [CHANGED] app/mentor/bookings.tsx (+246/-151)
- `b23759a`: Updated mentor bookings screen with profile fetch + earnings
  [CHANGED] app/mentor/bookings.tsx (+84/-18)
- `32e2c62`: Merge origin/main into post-recovery; drop .vs from tracking
  [CHANGED] .gitignore (+1/-0)
- `0e16908`: Ignore VS Code settings folder
  [CHANGED] .gitignore (+1/-0)
- `ec83974`: Stop tracking IDE cache folders (.vs, .vscode)
  [CHANGED] .gitignore (+1/-8)
- `0163c77`: chore: Permanently ignore .vs folder to fix conflicts
  [CHANGED] .gitignore (+2/-0)
- `1de1876`: chore: Permanently ignore .vs folder to fix conflicts
  [CHANGED] .gitignore (+4/-0)
- `197f4d9`: chore: Ignore Visual Studio cache files
  [CHANGED] .gitignore (+2/-0)
- `3f7f8e8`: chore: Remove Visual Studio binary cache files to resolve co
- `17210e2`: Resolved merge conflicts
  [CHANGED] app.json (+76/-11)
  [CHANGED] app/_layout.tsx (+19/-2)
  [CHANGED] app/about.tsx (+57/-311)
  [CHANGED] app/admin/_layout.tsx (+2/-1)
  [CHANGED] app/admin/approvals.tsx (+16/-2)
  [NEW] app/admin/templates.tsx (+250/-0)
  [CHANGED] app/auth/sign-in.tsx (+165/-231)
  [CHANGED] app/auth/sign-up.tsx (+515/-355)
  [CHANGED] app/blog.tsx (+59/-301)
  [NEW] app/build.gradle (+0/-0)
  [NEW] app/cancellation-policy.tsx (+72/-0)
  [CHANGED] app/candidate/[id].tsx (+124/-141)
  [CHANGED] app/candidate/_layout.tsx (+16/-300)
  [CHANGED] app/candidate/bookings.tsx (+2/-5)
  [CHANGED] app/candidate/index.tsx (+148/-348)
  [CHANGED] app/candidate/pgscreen.tsx (+72/-41)
  [CHANGED] app/candidate/profile.tsx (+232/-355)
  [NEW] app/candidate/razorpayModule.ts (+17/-0)
  [CHANGED] app/candidate/schedule.tsx (+202/-48)
  [CHANGED] app/contact.tsx (+63/-359)
  [NEW] app/faq.tsx (+98/-0)
  [CHANGED] app/how-it-works.tsx (+77/-275)
  [CHANGED] app/index.tsx (+188/-417)
  [CHANGED] app/mentor/_layout.tsx (+77/-289)
  [NEW] app/mentor/availability.tsx (+22/-0)
  [CHANGED] app/mentor/bookings.tsx (+329/-173)
  [CHANGED] app/mentor/mentorship.tsx (+192/-56)
  [CHANGED] app/mentor/profile.tsx (+4/-4)
  [CHANGED] app/mentor/session/[id].tsx (+173/-34)
  [CHANGED] app/mentor/under-review.tsx (+1/-1)
  [NEW] app/privacy.tsx (+78/-0)
  [NEW] app/terms.tsx (+87/-0)
  [NEW] components/Footer.tsx (+96/-0)
  [NEW] components/Header.tsx (+124/-0)
  [CHANGED] components/MentorAvailabilityEditor.tsx (+277/-361)
  [NEW] components/PageLayout.tsx (+32/-0)
  [NEW] components/SplashScreen.tsx (+119/-0)
  [NEW] components/layout/DashboardLayout.tsx (+288/-0)
  [CHANGED] constants/index.ts (+1/-1)
  [NEW] index.js (+2/-0)
  [CHANGED] lib/store.ts (+30/-9)
  [CHANGED] lib/theme.ts (+9/-2)
  [CHANGED] metro.config.js (+4/-3)
  [CHANGED] package.json (+66/-29)
  [CHANGED] public/robots.txt (+140/-11)
  [CHANGED] public/sitemap.xml (+162/-12)
  [CHANGED] services/auth.service.ts (+103/-130)
  [CHANGED] services/payment.service.ts (+159/-56)
- `bff3431`: feat: Pre-QA Build - Auth, DB Normalization & Booking Flow F
  [CHANGED] app/_layout.tsx (+6/-3)
  [CHANGED] app/admin/approvals.tsx (+16/-2)
  [CHANGED] app/auth/sign-in.tsx (+19/-11)
  [CHANGED] app/auth/sign-up.tsx (+94/-140)
  [CHANGED] app/candidate/[id].tsx (+26/-84)
  [CHANGED] app/candidate/_layout.tsx (+15/-268)
  [CHANGED] app/candidate/schedule.tsx (+49/-289)
  [CHANGED] app/mentor/_layout.tsx (+34/-326)
  [CHANGED] app/mentor/session/[id].tsx (+3/-224)
  [CHANGED] app/mentor/under-review.tsx (+1/-1)
  [NEW] components/layout/DashboardLayout.tsx (+288/-0)
  [CHANGED] services/auth.service.ts (+9/-1)
  [CHANGED] services/payment.service.ts (+27/-44)

*[Day +1 after 2025-11-28: code: Pre-QA build2]*
*[Day +3 after 2025-11-26: code: fix: white box removal, sticky sidebar and new profile heade]*
*[Day +4 after 2025-11-25: code: fix: UI polish and Layout standardization

Auth: Aligned Sig]*


---

### 2025-11-28

**CODE CHANGES**
- `40a3d33`: Pre-QA build2
  [CHANGED] app/admin/templates.tsx (+101/-63)
  [CHANGED] app/auth/sign-up.tsx (+5/-3)
  [CHANGED] app/candidate/bookings.tsx (+0/-3)
  [CHANGED] app/candidate/schedule.tsx (+279/-15)
  [CHANGED] app/mentor/bookings.tsx (+324/-201)
  [CHANGED] app/mentor/mentorship.tsx (+1/-1)
  [CHANGED] app/mentor/profile.tsx (+4/-4)
  [CHANGED] app/mentor/session/[id].tsx (+323/-110)
  [CHANGED] components/MentorAvailabilityEditor.tsx (+1/-1)
  [CHANGED] lib/store.ts (+30/-9)
  [CHANGED] package.json (+1/-0)
  [CHANGED] services/auth.service.ts (+29/-0)

*[Day +2 after 2025-11-26: code: fix: white box removal, sticky sidebar and new profile heade]*
*[Day +3 after 2025-11-25: code: fix: UI polish and Layout standardization

Auth: Aligned Sig]*
*[Day +3 after 2025-11-25: code: feat: SEO overhaul, Layout Refactor, and Social Login Fix

S]*


---

### 2025-11-26

**CODE CHANGES**
- `e047f22`: fix: white box removal, sticky sidebar and new profile heade
  [CHANGED] app/candidate/_layout.tsx (+115/-62)

*[Day +1 after 2025-11-25: code: fix: UI polish and Layout standardization

Auth: Aligned Sig]*
*[Day +1 after 2025-11-25: code: feat: SEO overhaul, Layout Refactor, and Social Login Fix

S]*
*[Day +2 after 2025-11-24: code: Pre-QA: Razorpay enabled build - Android & Web working

- Fi]*


---

### 2025-11-25

**CODE CHANGES**
- `2705d9e`: fix: UI polish and Layout standardization

Auth: Aligned Sig
  [CHANGED] app/auth/sign-in.tsx (+95/-60)
  [CHANGED] app/auth/sign-up.tsx (+587/-146)
  [CHANGED] app/candidate/[id].tsx (+177/-143)
  [CHANGED] app/candidate/_layout.tsx (+159/-33)
  [CHANGED] app/candidate/bookings.tsx (+2/-2)
  [CHANGED] app/candidate/index.tsx (+78/-134)
  [CHANGED] app/candidate/profile.tsx (+232/-355)
  [CHANGED] app/candidate/schedule.tsx (+1/-1)
  [CHANGED] lib/theme.ts (+9/-2)
  [CHANGED] package.json (+1/-0)
- `4987f0b`: feat: SEO overhaul, Layout Refactor, and Social Login Fix

S
  [CHANGED] app.json (+56/-10)
  [CHANGED] app/_layout.tsx (+16/-2)
  [CHANGED] app/about.tsx (+57/-311)
  [CHANGED] app/blog.tsx (+59/-301)
  [NEW] app/build.gradle (+0/-0)
  [NEW] app/cancellation-policy.tsx (+72/-0)
  [CHANGED] app/contact.tsx (+63/-359)
  [NEW] app/faq.tsx (+98/-0)
  [CHANGED] app/how-it-works.tsx (+77/-275)
  [CHANGED] app/index.tsx (+176/-432)
  [NEW] app/privacy.tsx (+78/-0)
  [NEW] app/terms.tsx (+87/-0)
  [NEW] components/Footer.tsx (+96/-0)
  [NEW] components/Header.tsx (+124/-0)
  [NEW] components/PageLayout.tsx (+32/-0)
  [NEW] index.js (+2/-0)
  [CHANGED] package.json (+29/-1)
  [CHANGED] public/robots.txt (+140/-11)
  [CHANGED] public/sitemap.xml (+162/-12)
  [CHANGED] services/auth.service.ts (+46/-53)

*[Day +1 after 2025-11-24: code: Pre-QA: Razorpay enabled build - Android & Web working

- Fi]*
*[Day +1 after 2025-11-24: code: Fix Razorpay constant and prepare for native build]*
*[Day +1 after 2025-11-24: code: Fix: Razorpay config using single module strategy to resolve]*


---

### 2025-11-24

**CODE CHANGES**
- `00394fe`: Pre-QA: Razorpay enabled build - Android & Web working

- Fi
  [CHANGED] package.json (+2/-2)
- `7fe3454`: Fix Razorpay constant and prepare for native build
  [CHANGED] app/candidate/pgscreen.tsx (+1/-1)
  [CHANGED] constants/index.ts (+1/-1)
  [CHANGED] package.json (+0/-1)
- `8f342a9`: Fix: Razorpay config using single module strategy to resolve
  [CHANGED] app.json (+1/-1)
  [CHANGED] app/auth/sign-in.tsx (+2/-2)
  [CHANGED] app/auth/sign-up.tsx (+2/-2)
  [CHANGED] app/candidate/pgscreen.tsx (+72/-41)
  [NEW] app/candidate/razorpayModule.ts (+17/-0)
  [CHANGED] app/candidate/schedule.tsx (+161/-50)
  [CHANGED] components/SplashScreen.tsx (+63/-66)
  [CHANGED] package.json (+1/-0)
  [CHANGED] services/auth.service.ts (+37/-116)
  [CHANGED] services/payment.service.ts (+113/-52)


---
