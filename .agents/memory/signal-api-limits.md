---
name: External signal API limits in Replit
description: GDELT and CFPB complaint search API are incompatible with Replit's shared cloud IP environment — use RSS-based alternatives instead.
---

## GDELT (gdeltproject.org)
- **Problem**: Enforces 1 req/5s per IP. Replit's shared IP pool is constantly rate-limited by other tenants → persistent HTTP 429 regardless of delay.
- **GDELT query syntax trap**: Space-separated terms = AND operator. `boycott scandal controversy` means articles containing ALL THREE words → zero results. Must use explicit `" OR "` syntax.
- **Replacement**: `GDELTService.ts` now implements RSS News Velocity Monitor — fetches AP Business, PR Newswire, Courthouse News, State Dept RSS and counts keyword-cluster matches in a 72h window. Same `fetchGDELTSignals()` export, no import changes needed.

**Why:** GDELT's per-IP rate limit has no workaround from a shared cloud environment. RSS feeds we already ingest are the reliable alternative.

**How to apply:** If GDELT is ever reconsidered, it requires a dedicated egress IP (not Replit's shared pool). For now, always use RSS velocity counting.

## CFPB Complaint Search API
- **Problem**: `https://www.consumerfinance.gov/data-research/consumer-complaints/search/api/v1/` streams 95MB+ even with `size=0` — the `size` and `no_aggs` parameters are not reliably respected. Causes 20-35s timeouts.
- **Replacement**: `CFPBComplaintService.ts` now uses the CFPB newsroom RSS feed (`https://www.consumerfinance.gov/about-us/newsroom/feed/`) to count enforcement-related press releases in the last 30 days. More actionable signal (enforcement action = confirmed regulatory event, not just complaint volume).

**Why:** The search API downloads the full Elasticsearch index regardless of pagination params. The newsroom RSS is small (<50KB), fast (<5s), and contains higher-signal enforcement actions.

**How to apply:** If complaint volume data is ever needed (not enforcement velocity), consider the CFPB's pre-computed CSV data files on their website — never the live search API from cloud.

## Verified Working Quantitative Sources (as of this session)
- CISA KEV: 5 signals/cycle ✅
- SEC EDGAR (9 query types): 5 signals/cycle ✅
- OFAC/BIS: 3 signals/cycle ✅
- Federal Register: 3 signals/cycle ✅
- arXiv Velocity (CS.AI, CS.LG, CS.CR): 3 signals/cycle ✅
- RSS News Velocity (replaces GDELT): 0-3 signals/cycle depending on events ✅
- CFPB Newsroom RSS (replaces complaint API): 0-1 signals/cycle depending on actions ✅
- Total baseline: 19-20 quantitative signals per 15-minute cycle
