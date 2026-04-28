"""
CrackJobs Growth Timeline Stitcher v3
======================================
Pulls GitHub commits + GA4 + Supabase, reads Ads CSVs,
stitches everything on a date axis, outputs timeline.md.

SETUP:
  pip install requests google-analytics-data google-auth

FOLDER STRUCTURE:
  scripts/
    stitch_timeline.py
    tactical-crow-478109-s2-da02c30f932b.json   (GA4 service account key)
    GoogleAdsreports/
      Campaign report.csv
      Change history report.csv
      Search keyword report.csv
      Search terms report.csv
"""

import requests
import csv
from datetime import datetime, timedelta
from collections import defaultdict

# ── CONFIG ────────────────────────────────────────────────────────────────────
REPO              = "MananVashist/mentor-interview-platform"
GITHUB_TOKEN      = "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"        # Required — add personal access token
N_COMMITS         = 300
GA4_PROPERTY_ID   = "521057825"
GA4_KEY_FILE      = "tactical-crow-478109-s2-da02c30f932b.json"
GA4_DAYS_BACK     = 90
SUPABASE_URL      = "https://rcbaaiiawrglvyzmawvr.supabase.co"
SUPABASE_KEY      = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjYmFhaWlhd3JnbHZ5em1hd3ZyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTE1MDU2MCwiZXhwIjoyMDc2NzI2NTYwfQ.sFfP04Rd5eee6VCADE-T0ia4IvVmw0IkTFXY6bZnEwA"        # Fill in your NEW service role key after rotating
OUTPUT_FILE       = "timeline.md"
ADS_LAUNCH_DATE   = "2026-01-25"
LOW_SIGNAL_THRESHOLD = 8
FOUNDER_MENTOR_ID = "e251486e-c21a-49f4-8ab7-ce808785638a"
TEST_CANDIDATE_ID = "da6ca1aa-2e55-41d1-826a-b06894a2d8b8"
# ─────────────────────────────────────────────────────────────────────────────

IGNORE_PATTERNS = [
    "package-lock.json", "yarn.lock", "bun.lockb",
    "dist/", ".next/", "build/", "__pycache__/",
    "android/", "ios/", ".expo/",
    ".vs/", ".vscode/", ".idea/",
    "assets/", ".DS_Store", "backup/", ".github/", "styles/",
    "apply-fix.ps1", "setup-android.ps1", "fix-ui.js", "diagnose-ui.js",
    "build_log.txt", "babel.config.js", "eas.json",
    ".vsidx", ".suo", ".sqlite", "slnx.sqlite",
    "node_modules/",
]

BACKEND_FILES = [
    "services/email.templates",
    "services/availability.service",
    "lib/evaluation-templates",
    "lib/booking-logic",
    "supabase/",
]

MEANINGFUL_PATHS = [
    "app/", "components/",
    "services/payment.service", "services/auth.service",
    "lib/analytics", "lib/theme", "lib/store",
    "constants/", "public/",
    "app.json", "package.json",
]

IGNORE_SOURCES = ["tagassistant.google.com", "localhost", "localhost:8081"]

ADS_KEEP_KEYWORDS = [
    "keyword", "bid strategy", "target cpa", "headline",
    "description was", "description is",
    "status changed", "purchases", "sign-ups", "sign ups",
    "budget amount", "final url", "negative", "standard goals",
    "responsive search ad", "match type", "1 campaign", "2 campaign",
]

PLATFORM_SNAPSHOT = """## Platform State at Ads Launch (Jan 25, 2026)
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
"""


def should_ignore(filename):
    if any(p in filename for p in IGNORE_PATTERNS):
        return True
    if any(filename.startswith(p) or p in filename for p in BACKEND_FILES):
        return True
    if "/" in filename:
        if not any(filename.startswith(p) or filename == p for p in MEANINGFUL_PATHS):
            return True
    return False

def get_all_commits():
    gh_headers = {"Accept": "application/vnd.github+json"}
    if GITHUB_TOKEN:
        gh_headers["Authorization"] = f"Bearer {GITHUB_TOKEN}"
    commits = []
    page = 1
    print("Pulling commits from GitHub...")
    while True:
        url = f"https://api.github.com/repos/{REPO}/commits?per_page=100&page={page}"
        r = requests.get(url, headers=gh_headers)
        r.raise_for_status()
        batch = r.json()
        if not batch:
            break
        commits.extend(batch)
        print(f"  Fetched {len(commits)} commits...")
        if len(batch) < 100:
            break
        page += 1
    if len(commits) >= N_COMMITS:
        print(f"  WARNING: Capped at {N_COMMITS}. Increase N_COMMITS if repo has more.")
    return commits[:N_COMMITS]

def get_commit_diff(sha):
    gh_headers = {"Accept": "application/vnd.github+json"}
    if GITHUB_TOKEN:
        gh_headers["Authorization"] = f"Bearer {GITHUB_TOKEN}"
    r = requests.get(f"https://api.github.com/repos/{REPO}/commits/{sha}", headers=gh_headers)
    r.raise_for_status()
    return r.json()

def pull_commits():
    commits = get_all_commits()
    rows = []
    for i, commit in enumerate(commits):
        sha     = commit["sha"]
        short   = sha[:7]
        message = commit["commit"]["message"].strip()
        date    = commit["commit"]["author"]["date"]

        if message.startswith("Merge pull request") or message.startswith("Merge branch"):
            print(f"  [{i+1}/{len(commits)}] {short} - SKIPPED (merge)")
            continue

        dt       = datetime.fromisoformat(date.replace("Z", "+00:00"))
        date_str = dt.strftime("%Y-%m-%d")
        detail   = get_commit_diff(sha)
        files    = detail.get("files", [])
        meaningful = [f for f in files if not should_ignore(f["filename"])]

        if not meaningful:
            rows.append({"date": date_str, "sha": short, "message": message,
                         "file": "(no meaningful changes)", "status": "",
                         "additions": 0, "deletions": 0, "diff": ""})
        else:
            for f in meaningful:
                rows.append({"date": date_str, "sha": short, "message": message,
                             "file": f["filename"], "status": f["status"],
                             "additions": f.get("additions", 0),
                             "deletions": f.get("deletions", 0),
                             "diff": f.get("patch", "")})

        print(f"  [{i+1}/{len(commits)}] {short} - {message[:60]}")

    with open("commits.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["date","sha","message","file","status","additions","deletions","diff"])
        writer.writeheader()
        writer.writerows(rows)
    print(f"  Saved {len(rows)} rows to commits.csv\n")
    return rows


def pull_ga4():
    from google.analytics.data_v1beta import BetaAnalyticsDataClient
    from google.analytics.data_v1beta.types import RunReportRequest, DateRange, Dimension, Metric
    from google.oauth2 import service_account

    end_date   = datetime.today().strftime("%Y-%m-%d")
    start_date = (datetime.today() - timedelta(days=GA4_DAYS_BACK)).strftime("%Y-%m-%d")

    creds  = service_account.Credentials.from_service_account_file(
        GA4_KEY_FILE, scopes=["https://www.googleapis.com/auth/analytics.readonly"])
    client = BetaAnalyticsDataClient(credentials=creds)
    prop   = f"properties/{GA4_PROPERTY_ID}"

    def report(dims, metrics):
        return client.run_report(RunReportRequest(
            property=prop,
            date_ranges=[DateRange(start_date=start_date, end_date=end_date)],
            dimensions=[Dimension(name=d) for d in dims],
            metrics=[Metric(name=m) for m in metrics],
        ))

    rows = []
    print("Pulling GA4 data...")

    r = report(["date","sessionSource","sessionMedium"],
               ["sessions","totalUsers","newUsers","bounceRate","averageSessionDuration"])
    for row in r.rows:
        source = row.dimension_values[1].value
        medium = row.dimension_values[2].value
        if source in IGNORE_SOURCES:
            continue
        rows.append({"report":"sessions","date":row.dimension_values[0].value,
                     "dim1":source,"dim2":medium,
                     "m1":row.metric_values[0].value,"m2":row.metric_values[1].value,
                     "m3":row.metric_values[2].value,"m4":row.metric_values[3].value,
                     "m5":row.metric_values[4].value})

    r = report(["date","eventName"], ["eventCount","totalUsers"])
    for row in r.rows:
        rows.append({"report":"events","date":row.dimension_values[0].value,
                     "dim1":row.dimension_values[1].value,"dim2":"",
                     "m1":row.metric_values[0].value,"m2":row.metric_values[1].value,
                     "m3":"","m4":"","m5":""})

    r = report(["date","landingPage"], ["sessions","bounceRate","averageSessionDuration"])
    for row in r.rows:
        rows.append({"report":"landing","date":row.dimension_values[0].value,
                     "dim1":row.dimension_values[1].value,"dim2":"",
                     "m1":row.metric_values[0].value,"m2":row.metric_values[1].value,
                     "m3":row.metric_values[2].value,"m4":"","m5":""})

    with open("ga4_data.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["report","date","dim1","dim2","m1","m2","m3","m4","m5"])
        writer.writeheader()
        writer.writerows(rows)
    print(f"  Saved {len(rows)} rows to ga4_data.csv\n")
    return rows


def pull_supabase():
    if not SUPABASE_KEY:
        print("  WARNING: SUPABASE_KEY not set - skipping Supabase pull\n")
        return [], []

    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json"
    }
    print("Pulling Supabase data...")

    r = requests.get(f"{SUPABASE_URL}/rest/v1/interview_packages",
                     headers=headers,
                     params={"select": "created_at,total_amount_inr,payment_status,booking_metadata,candidate_id,mentor_id,razorpay_payment_id",
                             "order": "created_at.asc"})
    r.raise_for_status()
    packages = r.json()

    r = requests.get(f"{SUPABASE_URL}/rest/v1/candidates",
                     headers=headers,
                     params={"select": "id,created_at", "order": "created_at.asc"})
    r.raise_for_status()
    candidates = r.json()

    print(f"  Packages: {len(packages)}, Candidates (signups): {len(candidates)}\n")
    return packages, candidates

def format_supabase_section(packages, candidates):
    if not packages and not candidates:
        return ""

    lines = []
    lines.append("## Funnel Data (Supabase - Ground Truth)\n")
    lines.append("> Use this section for all conversion analysis. GA4 payment events are unreliable. This is the authoritative source.\n")

    real_paid, free_intros, test_txns = [], [], []
    for p in packages:
        amount = p.get("total_amount_inr", 0)
        status = p.get("payment_status", "")
        meta   = p.get("booking_metadata") or {}
        stype  = meta.get("session_type", "unknown")
        date   = p["created_at"][:10]
        mentor = "Founder" if p["mentor_id"] == FOUNDER_MENTOR_ID else f"Other ({p['mentor_id'][:8]})"

        if p["candidate_id"] == TEST_CANDIDATE_ID and amount < 50:
            test_txns.append(p)
        elif amount == 0 and status == "completed":
            free_intros.append({"date": date, "session_type": stype, "mentor": mentor})
        elif amount > 50 and p.get("razorpay_payment_id"):
            real_paid.append({"date": date, "amount": amount, "session_type": stype,
                              "mentor": mentor, "status": status})

    total_revenue = sum(p["amount"] for p in real_paid)
    lines.append("### Summary")
    lines.append(f"- Total candidate accounts (signups): {len(candidates)}")
    lines.append(f"- Real paid bookings: {len(real_paid)}")
    lines.append(f"- Free intro calls completed: {len(free_intros)}")
    lines.append(f"- Test transactions excluded: {len(test_txns)}")
    lines.append(f"- Total real revenue: Rs {total_revenue:,}")
    lines.append("")

    if candidates:
        lines.append("### Signups by Date")
        lines.append("| Date | New Signups | Cumulative |")
        lines.append("|---|---|---|")
        by_date = defaultdict(int)
        for c in candidates:
            by_date[c["created_at"][:10]] += 1
        cumulative = 0
        for date in sorted(by_date.keys()):
            cumulative += by_date[date]
            lines.append(f"| {date} | +{by_date[date]} | {cumulative} |")
        lines.append("")

    if real_paid:
        lines.append("### Real Paid Bookings (Source of Truth)")
        lines.append("| Date | Amount (INR) | Session Type | Mentor | Status |")
        lines.append("|---|---|---|---|---|")
        for p in real_paid:
            lines.append(f"| {p['date']} | Rs {p['amount']:,} | {p['session_type']} | {p['mentor']} | {p['status']} |")
        lines.append("")

    if free_intros:
        lines.append("### Free Intro Calls (Rs 0 - manually arranged)")
        lines.append("| Date | Session Type | Mentor |")
        lines.append("|---|---|---|")
        for p in free_intros:
            lines.append(f"| {p['date']} | {p['session_type']} | {p['mentor']} |")
        lines.append("")

    lines.append("---\n")
    return "\n".join(lines)


def parse_csv(filename, skip_rows=2):
    with open(filename, encoding="utf-8-sig", errors="replace") as f:
        content = f.readlines()
    return list(csv.DictReader(content[skip_rows:]))

def filter_ads_change(change_text):
    segments = change_text.split(" | ")
    kept = []
    for seg in segments:
        seg_clean = seg.strip()
        if not seg_clean:
            continue
        if any(kw in seg_clean.lower() for kw in ADS_KEEP_KEYWORDS):
            kept.append(seg_clean)
    return " | ".join(kept)[:400] if kept else change_text[:200]

def parse_change_history():
    rows = parse_csv("GoogleAdsreports/Change history report.csv")
    by_date = defaultdict(list)
    for row in rows:
        raw = row.get("Date & time", "")
        parsed = False
        for fmt in [
            lambda r: datetime.strptime(r.split(",")[0].strip() + r[-9:].strip(), "%b %d %Y%I:%M:%S %p"),
            lambda r: datetime.strptime(" ".join(r.replace(",","").split()[:3]), "%b %d %Y"),
        ]:
            try:
                date_str = fmt(raw).strftime("%Y-%m-%d")
                parsed = True
                break
            except:
                continue
        if not parsed:
            raise ValueError(f"FATAL: Cannot parse date: {repr(raw)}\nFix CSV or date parsing before continuing.")

        change_raw      = row.get("Changes", "").strip().replace("\n", " | ")
        change_filtered = filter_ads_change(change_raw)
        if not change_filtered.strip():
            continue

        by_date[date_str].append({
            "campaign": row.get("Campaign", "").strip(),
            "adgroup":  row.get("Ad group", "").strip(),
            "change":   change_filtered,
        })
    return by_date

def parse_keywords():
    rows = parse_csv("GoogleAdsreports/Search keyword report.csv")
    summary = []
    for row in rows:
        try:
            clicks      = int(str(row.get("Clicks","0")).replace(",",""))
            impressions = int(str(row.get("Impr.","0")).replace(",",""))
            cost        = float(str(row.get("Cost","0")).replace(",",""))
            convs       = float(str(row.get("Conversions","0")).replace(",",""))
            kw          = row.get("Keyword","").strip()
            if (clicks > 0 or impressions > 0) and kw and "Total:" not in kw:
                summary.append({"keyword": kw, "match": row.get("Match type",""),
                                 "campaign": row.get("Campaign",""), "clicks": clicks,
                                 "impressions": impressions, "cost": cost,
                                 "conversions": convs, "ctr": row.get("CTR",""),
                                 "status": row.get("Status","")})
        except:
            pass
    return sorted(summary, key=lambda x: x["cost"], reverse=True)

def parse_search_terms():
    rows = parse_csv("GoogleAdsreports/Search terms report.csv")
    summary = []
    for row in rows:
        try:
            clicks = int(str(row.get("Clicks","0")).replace(",",""))
            cost   = float(str(row.get("Cost","0")).replace(",",""))
            convs  = float(str(row.get("Conversions","0")).replace(",",""))
            term   = row.get("Search term","").strip()
            if clicks > 0 and "Total:" not in term and term:
                summary.append({"term": term, "match": row.get("Match type",""),
                                 "campaign": row.get("Campaign",""), "clicks": clicks,
                                 "cost": cost, "conversions": convs})
        except:
            pass
    return sorted(summary, key=lambda x: x["clicks"], reverse=True)

def parse_campaigns():
    rows = parse_csv("GoogleAdsreports/Campaign report.csv")
    summary = []
    for row in rows:
        name = row.get("Campaign","").strip()
        if not name or name.startswith("--"):
            continue
        try:
            clicks = int(str(row.get("Clicks","0")).replace(",",""))
            cost   = float(str(row.get("Cost","0")).replace(",",""))
            convs  = float(str(row.get("Conversions","0")).replace(",",""))
            summary.append({"campaign": name, "status": row.get("Status",""),
                             "clicks": clicks, "cost": cost, "conversions": convs,
                             "bid_strategy": row.get("Bid strategy type","")})
        except:
            pass
    return summary


def build_ga4_by_date(ga4_rows):
    by_date = defaultdict(lambda: {
        "cpc_sessions": 0, "organic_sessions": 0, "direct_sessions": 0,
        "other_sessions": 0, "cpc_bounce": [], "cpc_duration": [],
        "events": defaultdict(int), "landing_pages": defaultdict(int),
    })
    for row in ga4_rows:
        date = row["date"]
        if len(date) == 8:
            date = f"{date[:4]}-{date[4:6]}-{date[6:]}"
        report = row["report"]
        if report == "sessions":
            sessions = int(row["m1"]) if row["m1"] else 0
            medium   = row["dim2"]
            if medium == "cpc":
                by_date[date]["cpc_sessions"] += sessions
                try:
                    by_date[date]["cpc_bounce"].append(float(row["m4"]))
                    by_date[date]["cpc_duration"].append(float(row["m5"]))
                except:
                    pass
            elif medium == "organic":
                by_date[date]["organic_sessions"] += sessions
            elif medium == "none" and row["dim1"] == "(direct)":
                by_date[date]["direct_sessions"] += sessions
            else:
                by_date[date]["other_sessions"] += sessions
        elif report == "events":
            event = row["dim1"]
            count = int(row["m1"]) if row["m1"] else 0
            if any(k in event.lower() for k in ["signup","booking","payment","purchase","schedule","intro","conversion","success"]):
                by_date[date]["events"][event] += count
        elif report == "landing":
            page     = row["dim1"]
            sessions = int(row["m1"]) if row["m1"] else 0
            by_date[date]["landing_pages"][page] += sessions
    return by_date

def build_commits_by_date(commit_rows):
    by_date   = defaultdict(list)
    seen_shas = set()
    for row in commit_rows:
        date = row["date"][:10]
        sha  = row["sha"]
        if sha not in seen_shas:
            seen_shas.add(sha)
            by_date[date].append({"sha": sha, "message": row["message"][:60], "date": date, "files": []})
        for entry in by_date[date]:
            if entry["sha"] == sha and row["file"] != "(no meaningful changes)":
                entry["files"].append({
                    "file": row["file"], "status": row["status"],
                    "additions": row["additions"], "deletions": row["deletions"],
                    "diff": row["diff"],
                })
    return by_date

def format_diff_summary(files, commit_date=None):
    if not files:
        return "  (no meaningful file changes)"

    is_pre_launch = commit_date and commit_date < ADS_LAUNCH_DATE
    lines = []
    status_map = {"added": "NEW", "modified": "CHANGED", "removed": "DELETED", "renamed": "RENAMED"}

    for f in files:
        status    = status_map.get(f["status"], f["status"].upper())
        additions = int(f["additions"]) if f["additions"] else 0
        deletions = int(f["deletions"]) if f["deletions"] else 0

        # C: pre-launch = filename + counts only
        if is_pre_launch:
            lines.append(f"  [{status}] {f['file']} (+{additions}/-{deletions})")
            continue

        diff_preview = ""
        # B: only show diff if change is substantial
        if (additions + deletions) > 5 and f.get("diff"):
            diff_lines = f["diff"].split("\n")
            filtered = []
            for l in diff_lines:
                if not (l.startswith("+") or l.startswith("-")):
                    continue
                if l.startswith("+++") or l.startswith("---"):
                    continue
                content = l.lstrip("+-").strip()
                # D: strip import lines
                if content.startswith("import ") or content.startswith("from "):
                    continue
                if not content:
                    continue
                filtered.append(l)
            if filtered:
                preview = " / ".join(l[:100] for l in filtered[:2])
                diff_preview = f" | {preview}"

        lines.append(f"  [{status}] {f['file']} (+{additions}/-{deletions}){diff_preview}")

    return "\n".join(lines)



def compute_rolling_averages(ga4_by_date, window=7):
    """Pre-compute 7-day rolling averages for key CPC metrics per date."""
    sorted_dates = sorted(ga4_by_date.keys())
    rolling = {}
    for i, date in enumerate(sorted_dates):
        window_dates = sorted_dates[max(0, i - window):i]  # exclude current day
        if not window_dates:
            rolling[date] = {"sessions": None, "bounce": None, "duration": None}
            continue
        sess_vals    = [ga4_by_date[d]["cpc_sessions"] for d in window_dates if ga4_by_date[d]["cpc_sessions"] > 0]
        bounce_vals  = [sum(ga4_by_date[d]["cpc_bounce"]) / len(ga4_by_date[d]["cpc_bounce"])
                        for d in window_dates if ga4_by_date[d]["cpc_bounce"]]
        dur_vals     = [sum(ga4_by_date[d]["cpc_duration"]) / len(ga4_by_date[d]["cpc_duration"])
                        for d in window_dates if ga4_by_date[d]["cpc_duration"]]
        rolling[date] = {
            "sessions": sum(sess_vals) / len(sess_vals) if sess_vals else None,
            "bounce":   sum(bounce_vals) / len(bounce_vals) if bounce_vals else None,
            "duration": sum(dur_vals) / len(dur_vals) if dur_vals else None,
        }
    return rolling

def fmt_delta(current, average, is_percent=False, lower_is_better=False):
    """Format a delta vs rolling average with direction signal."""
    if average is None or average == 0:
        return ""
    delta = current - average
    pct   = (delta / average) * 100
    if is_percent:
        # bounce rate — show pp change
        direction = ("↓ better" if delta < 0 else "↑ worse") if lower_is_better else ("↑" if delta > 0 else "↓")
        return f" ({delta:+.1f}pp vs 7d avg, {direction})"
    else:
        direction = ("↓ worse" if delta < 0 else "↑ better") if not lower_is_better else ("↑ worse" if delta > 0 else "↓ better")
        return f" ({pct:+.0f}% vs 7d avg, {direction})"


def build_event_registry(commits_by_date, changes_by_date):
    """
    Build a registry of significant events (code changes + ads changes).
    Returns dict: date -> short label for use in 7-day window annotations.
    """
    registry = {}
    for date, commits in commits_by_date.items():
        for commit in commits:
            if commit["files"]:  # only commits with meaningful file changes
                msg = commit["message"][:60].strip()
                registry[date] = registry.get(date, [])
                registry[date].append(f"code: {msg}")
    for date, changes in changes_by_date.items():
        for change in changes:
            label = change["change"][:80].strip()
            registry[date] = registry.get(date, [])
            registry[date].append(f"ads: {label}")
    return registry

def get_active_windows(date, event_registry, window_days=7):
    """
    For a given date, return list of (days_since, label) for events
    that occurred in the prior window_days.
    """
    active = []
    dt = datetime.strptime(date, "%Y-%m-%d")
    for event_date, labels in event_registry.items():
        edt  = datetime.strptime(event_date, "%Y-%m-%d")
        diff = (dt - edt).days
        if 1 <= diff <= window_days:
            for label in labels:
                active.append((diff, event_date, label))
    return sorted(active, key=lambda x: x[0])

def generate_timeline_md(commits_by_date, ga4_by_date, changes_by_date,
                         keywords, search_terms, campaigns, supabase_section="",
                         rolling=None, event_registry=None):
    lines = []

    lines.append("""# CrackJobs Growth Timeline
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
""")

    lines.append(PLATFORM_SNAPSHOT)

    if supabase_section:
        lines.append(supabase_section)

    lines.append("## Campaign Summary (Full Period)\n")
    lines.append("*Conversions = mix of sign-ups and purchases. See instruction 6. Use Supabase section for real booking counts.*\n")
    lines.append("| Campaign | Status | Clicks | Cost (INR) | Conv* | Bid Strategy |")
    lines.append("|---|---|---|---|---|---|")
    for c in campaigns:
        lines.append(f"| {c['campaign']} | {c['status']} | {c['clicks']} | Rs {c['cost']:,.0f} | {c['conversions']:.0f} | {c['bid_strategy']} |")
    lines.append("")

    lines.append("## Keyword Performance (Full Period - Top 25 by Spend)\n")
    lines.append("| Keyword | Match | Campaign | Clicks | Cost (INR) | Conv | CTR |")
    lines.append("|---|---|---|---|---|---|---|")
    for k in keywords[:25]:
        lines.append(f"| {k['keyword']} | {k['match']} | {k['campaign']} | {k['clicks']} | Rs {k['cost']:,.0f} | {k['conversions']:.0f} | {k['ctr']} |")
    lines.append("")

    lines.append("## Search Terms That Got Clicks (Top 30)\n")
    lines.append("| Search Term | Match | Campaign | Clicks | Cost (INR) | Conv |")
    lines.append("|---|---|---|---|---|---|")
    for t in search_terms[:30]:
        lines.append(f"| {t['term']} | {t['match']} | {t['campaign']} | {t['clicks']} | Rs {t['cost']:,.0f} | {t['conversions']:.0f} |")
    lines.append("")

    lines.append("## Daily Timeline\n")
    lines.append("Read sequences across consecutive days, not individual days in isolation.\n")

    all_dates = set()
    all_dates.update(commits_by_date.keys())
    all_dates.update(ga4_by_date.keys())
    all_dates.update(changes_by_date.keys())

    for date in sorted(all_dates, reverse=True):
        has_commits = date in commits_by_date
        has_ads     = date in changes_by_date
        has_ga4     = date in ga4_by_date

        if not (has_commits or has_ads or has_ga4):
            continue

        d              = ga4_by_date[date] if has_ga4 else None
        total_sessions = (d["cpc_sessions"] + d["organic_sessions"] + d["direct_sessions"] + d["other_sessions"]) if d else 0
        cpc_sessions   = d["cpc_sessions"] if d else 0
        signal_flag    = " LOW SIGNAL" if 0 < cpc_sessions < LOW_SIGNAL_THRESHOLD else ""

        lines.append(f"### {date}{signal_flag}")
        lines.append("")

        if has_commits:
            lines.append("**CODE CHANGES**")
            for commit in commits_by_date[date]:
                lines.append(f"- `{commit['sha']}`: {commit['message']}")
                if commit["files"]:
                    lines.append(format_diff_summary(commit["files"], commit_date=date))
            lines.append("")

        if has_ads:
            lines.append("**ADS CHANGES**")
            for change in changes_by_date[date]:
                camp = f"[{change['campaign']}]" if change['campaign'] else "[Account level]"
                ag   = f" > {change['adgroup']}" if change['adgroup'] else ""
                lines.append(f"- {camp}{ag}: {change['change']}")
            lines.append("")

        # Gap 2 — annotate if within 7-day window of a significant event
        if event_registry:
            active = get_active_windows(date, event_registry)
            if active:
                for days_since, event_date, label in active[:3]:  # cap at 3 to avoid noise
                    lines.append(f"*[Day +{days_since} after {event_date}: {label[:80]}]*")
                lines.append("")

        if d:
            lines.append("**GA4 METRICS**")
            # Gap 3 — delta vs 7-day rolling average
            r = (rolling or {}).get(date, {})
            sess_delta = fmt_delta(d["cpc_sessions"], r.get("sessions")) if r.get("sessions") else ""
            lines.append(f"- Sessions: {total_sessions} total (CPC: {d['cpc_sessions']}{sess_delta}, Organic: {d['organic_sessions']}, Direct: {d['direct_sessions']})")
            if d["cpc_bounce"]:
                avg_bounce = sum(d["cpc_bounce"]) / len(d["cpc_bounce"])
                avg_dur    = sum(d["cpc_duration"]) / len(d["cpc_duration"]) if d["cpc_duration"] else 0
                bounce_delta = fmt_delta(avg_bounce, r.get("bounce"), is_percent=True, lower_is_better=True) if r.get("bounce") else ""
                dur_delta    = fmt_delta(avg_dur, r.get("duration")) if r.get("duration") else ""
                lines.append(f"- CPC bounce rate: {avg_bounce:.0%}{bounce_delta} | Avg session duration: {avg_dur:.0f}s{dur_delta}")
            if d["events"]:
                lines.append(f"- Key events: {', '.join(f'{k}: {v}' for k,v in sorted(d['events'].items()))}")
            if d["landing_pages"]:
                top_pages = sorted(d["landing_pages"].items(), key=lambda x: -x[1])[:6]
                lines.append(f"- Landing pages: {', '.join(f'{k}: {v}' for k,v in top_pages)}")

        lines.append("")
        lines.append("---")
        lines.append("")

    return "\n".join(lines)


def main():
    print("=" * 60)
    print("CrackJobs Timeline Stitcher v3")
    print("=" * 60)

    commit_rows              = pull_commits()
    ga4_rows                 = pull_ga4()
    packages, candidates     = pull_supabase()

    print("Parsing Ads CSVs...")
    changes_by_date = parse_change_history()
    keywords        = parse_keywords()
    search_terms    = parse_search_terms()
    campaigns       = parse_campaigns()
    print(f"  Change history: {sum(len(v) for v in changes_by_date.values())} entries")
    print(f"  Keywords: {len(keywords)} | Search terms: {len(search_terms)} | Campaigns: {len(campaigns)}\n")

    commits_by_date  = build_commits_by_date(commit_rows)
    ga4_by_date      = build_ga4_by_date(ga4_rows)
    supabase_section = format_supabase_section(packages, candidates)

    print("Computing rolling averages and event registry...")
    rolling        = compute_rolling_averages(ga4_by_date)
    event_registry = build_event_registry(commits_by_date, changes_by_date)
    print(f"  Rolling averages: {len(rolling)} dates | Event registry: {sum(len(v) for v in event_registry.values())} events")

    print("Stitching timeline...")
    md = generate_timeline_md(commits_by_date, ga4_by_date, changes_by_date,
                               keywords, search_terms, campaigns, supabase_section,
                               rolling=rolling, event_registry=event_registry)

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write(md)

    all_dates = set(list(commits_by_date.keys()) + list(ga4_by_date.keys()) + list(changes_by_date.keys()))
    print(f"\nDone. Written to {OUTPUT_FILE}")
    print(f"Date range: {min(all_dates)} -> {max(all_dates)}")

if __name__ == "__main__":
    main()