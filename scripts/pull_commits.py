from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import (
    RunReportRequest, DateRange, Dimension, Metric, OrderBy
)
from google.oauth2 import service_account
import csv
from datetime import datetime, timedelta

# ── CONFIG ──────────────────────────────────────────────────────────────────
KEY_FILE    = "tactical-crow-478109-s2-da02c30f932b.json"  # must be in same folder
PROPERTY_ID = "521057825"
DAYS_BACK   = 90        # how far back to pull
OUTPUT_FILE = "ga4_data.csv"
# ────────────────────────────────────────────────────────────────────────────

END_DATE   = datetime.today().strftime("%Y-%m-%d")
START_DATE = (datetime.today() - timedelta(days=DAYS_BACK)).strftime("%Y-%m-%d")

credentials = service_account.Credentials.from_service_account_file(
    KEY_FILE,
    scopes=["https://www.googleapis.com/auth/analytics.readonly"]
)
client = BetaAnalyticsDataClient(credentials=credentials)
property_path = f"properties/{PROPERTY_ID}"

def run_report(dimensions, metrics, order_by=None):
    req = RunReportRequest(
        property=property_path,
        date_ranges=[DateRange(start_date=START_DATE, end_date=END_DATE)],
        dimensions=[Dimension(name=d) for d in dimensions],
        metrics=[Metric(name=m) for m in metrics],
    )
    if order_by:
        req.order_bys = order_by
    return client.run_report(req)

rows = []

# ── 1. DAILY SESSIONS + USERS BY SOURCE ─────────────────────────────────────
print("Pulling daily sessions by source...")
r = run_report(
    dimensions=["date", "sessionSource", "sessionMedium"],
    metrics=["sessions", "totalUsers", "newUsers", "bounceRate", "averageSessionDuration"]
)
for row in r.rows:
    rows.append({
        "report": "daily_sessions_by_source",
        "date": row.dimension_values[0].value,
        "dim1": row.dimension_values[1].value,  # source
        "dim2": row.dimension_values[2].value,  # medium
        "dim3": "",
        "metric1": row.metric_values[0].value,  # sessions
        "metric2": row.metric_values[1].value,  # totalUsers
        "metric3": row.metric_values[2].value,  # newUsers
        "metric4": row.metric_values[3].value,  # bounceRate
        "metric5": row.metric_values[4].value,  # avgSessionDuration
        "metric6": "",
    })

# ── 2. DAILY PAGE VIEWS BY PAGE ──────────────────────────────────────────────
print("Pulling daily page views...")
r = run_report(
    dimensions=["date", "pagePath"],
    metrics=["screenPageViews", "sessions"]
)
for row in r.rows:
    rows.append({
        "report": "daily_page_views",
        "date": row.dimension_values[0].value,
        "dim1": row.dimension_values[1].value,  # page path
        "dim2": "",
        "dim3": "",
        "metric1": row.metric_values[0].value,  # page views
        "metric2": row.metric_values[1].value,  # sessions
        "metric3": "",
        "metric4": "",
        "metric5": "",
        "metric6": "",
    })

# ── 3. KEY EVENTS (GTM CUSTOM EVENTS) ───────────────────────────────────────
print("Pulling key events...")
r = run_report(
    dimensions=["date", "eventName"],
    metrics=["eventCount", "totalUsers"]
)
for row in r.rows:
    rows.append({
        "report": "events",
        "date": row.dimension_values[0].value,
        "dim1": row.dimension_values[1].value,  # event name
        "dim2": "",
        "dim3": "",
        "metric1": row.metric_values[0].value,  # event count
        "metric2": row.metric_values[1].value,  # total users
        "metric3": "",
        "metric4": "",
        "metric5": "",
        "metric6": "",
    })

# ── 4. LANDING PAGE PERFORMANCE ──────────────────────────────────────────────
print("Pulling landing page performance...")
r = run_report(
    dimensions=["date", "landingPage"],
    metrics=["sessions", "totalUsers", "bounceRate", "averageSessionDuration"]
)
for row in r.rows:
    rows.append({
        "report": "landing_pages",
        "date": row.dimension_values[0].value,
        "dim1": row.dimension_values[1].value,  # landing page
        "dim2": "",
        "dim3": "",
        "metric1": row.metric_values[0].value,  # sessions
        "metric2": row.metric_values[1].value,  # users
        "metric3": row.metric_values[2].value,  # bounce rate
        "metric4": row.metric_values[3].value,  # avg session duration
        "metric5": "",
        "metric6": "",
    })

# ── 5. DEVICE BREAKDOWN ──────────────────────────────────────────────────────
print("Pulling device breakdown...")
r = run_report(
    dimensions=["date", "deviceCategory"],
    metrics=["sessions", "totalUsers"]
)
for row in r.rows:
    rows.append({
        "report": "device_breakdown",
        "date": row.dimension_values[0].value,
        "dim1": row.dimension_values[1].value,  # device
        "dim2": "",
        "dim3": "",
        "metric1": row.metric_values[0].value,  # sessions
        "metric2": row.metric_values[1].value,  # users
        "metric3": "",
        "metric4": "",
        "metric5": "",
        "metric6": "",
    })

# ── WRITE CSV ────────────────────────────────────────────────────────────────
fieldnames = ["report", "date", "dim1", "dim2", "dim3",
              "metric1", "metric2", "metric3", "metric4", "metric5", "metric6"]

with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(rows)

print(f"\nDone. {len(rows)} rows written to {OUTPUT_FILE}")
print(f"Date range: {START_DATE} to {END_DATE}")