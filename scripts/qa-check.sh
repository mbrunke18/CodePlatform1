#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# VaughnMartin Execution OS — Quality Assurance Check
# Run: bash scripts/qa-check.sh
# Checks: (1) stale messaging  (2) broken routes  (3) null-unsafe queries
# ─────────────────────────────────────────────────────────────────────────────

RED='\033[0;31m'; YELLOW='\033[0;33m'; GREEN='\033[0;32m'; CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'
ERRORS=0; WARNINGS=0

pass()    { echo -e "  ${GREEN}✓${NC} $1"; }
warn()    { echo -e "  ${YELLOW}⚠${NC}  $1"; ((WARNINGS++)); }
fail()    { echo -e "  ${RED}✗${NC} $1"; ((ERRORS++)); }
section() { echo -e "\n${BOLD}${CYAN}══ $1 ══${NC}"; }

# ─── 1. CANONICAL MESSAGING ───────────────────────────────────────────────────
section "1 · Canonical Messaging"

# Retired baseline framing — "72 hours" as a mobilization/response baseline
# Exclude: code comments, problem-description context, demo-specific content (GDPR deadlines etc.)
STALE_72=$(grep -rn "respond.*72 hour\|72 hour.*respond\|72-hour.*baseline\|in 72 hours\." \
  client/src/ client/index.html --include="*.tsx" --include="*.ts" --include="*.html" 2>/dev/null \
  | grep -v "node_modules" | grep -v "//.*72" \
  | grep -v "Problem\.tsx\|video/\|GDPR\|prep.*window\|preparation window")

STALE_72_META=$(grep -n "72 hour" client/index.html 2>/dev/null)

if [ -n "$STALE_72_META" ]; then
  fail "Retired '72 hours' framing found in meta tags (index.html):"
  echo "$STALE_72_META" | sed 's/^/      /'
elif [ -n "$STALE_72" ]; then
  warn "Possible retired '72 hours' baseline framing in content:"
  echo "$STALE_72" | head -5 | sed 's/^/      /'
else
  pass "No retired '72 hours' baseline in meta tags or key content"
fi

# Wrong signal/data point count
WRONG_SIGNALS=$(grep -rn "216+\|216 signal\|216+ signal" client/src/ client/index.html \
  --include="*.tsx" --include="*.ts" --include="*.html" 2>/dev/null | grep -v "node_modules")
if [ -n "$WRONG_SIGNALS" ]; then
  fail "Wrong signal count '216+' found (canonical: 248+):"
  echo "$WRONG_SIGNALS" | sed 's/^/      /'
else
  pass "Signal count is correct (248+)"
fi

# Retired speed framing — exclude code comments and commit messages
WRONG_SPEED=$(grep -rn "3,600× faster\|3600× faster\|3600x faster\|3,600x faster\|340×\|340x" \
  client/src/ --include="*.tsx" --include="*.ts" 2>/dev/null \
  | grep -v "node_modules" | grep -v "^\s*//" | grep -v "{/\*")
if [ -n "$WRONG_SPEED" ]; then
  warn "Retired speed framing found in visible content (use '3,600× Execution Head Start'):"
  echo "$WRONG_SPEED" | head -5 | sed 's/^/      /'
else
  pass "Speed framing is correct (3,600× Execution Head Start)"
fi

# Wrong playbook count — only flag non-170 values
WRONG_PB=$(grep -rn "[^0-9]169 playbook\|[^0-9]171 playbook\|[^0-9]168 playbook\|[^0-9]172 playbook" \
  client/src/ --include="*.tsx" --include="*.ts" 2>/dev/null | grep -v "node_modules")
if [ -n "$WRONG_PB" ]; then
  warn "Non-canonical playbook count found (canonical: 170):"
  echo "$WRONG_PB" | head -3 | sed 's/^/      /'
else
  pass "Playbook count references look correct (170)"
fi

# Check meta description exists and has correct content
META_DESC=$(grep -c "30 days to mobilize\|30-day" client/index.html 2>/dev/null || echo 0)
if [ "$META_DESC" -ge 1 ]; then
  pass "Meta description uses correct '30 days' framing"
else
  fail "Meta description may still have retired framing — check client/index.html"
fi

# ─── 2. ROUTE INTEGRITY ───────────────────────────────────────────────────────
section "2 · Route Integrity"

# Extract all registered paths from App.tsx (all quoted strings starting with /)
grep -oE '"(/[^"?#]*)"' client/src/App.tsx 2>/dev/null | tr -d '"' \
  | grep -v ':id\|:triggerId\|:playbookId\|:drillId\|:activationId\|:roleId\|:industryId' \
  | sort -u > /tmp/qa_routes.txt

# Extract all href links used in the app
grep -roh 'href="/[^"?#]*"' client/src/ --include="*.tsx" 2>/dev/null \
  | sed 's/href="//;s/"//' | sort -u > /tmp/qa_links.txt

# Find broken links (linked but not registered)
BROKEN=$(comm -23 /tmp/qa_links.txt /tmp/qa_routes.txt \
  | grep -v '^/$\|^/[0-9]' )  # exclude / and paths starting with digit (regex limitation)

BROKEN_COUNT=$(echo "$BROKEN" | grep -c "[a-z]" 2>/dev/null || echo 0)

if [ "$BROKEN_COUNT" -eq 0 ] || [ -z "$BROKEN" ]; then
  pass "All href links have registered routes ($( wc -l < /tmp/qa_links.txt | tr -d ' ') links checked)"
else
  fail "$BROKEN_COUNT link(s) point to unregistered routes:"
  echo "$BROKEN" | sed 's/^/      /'
fi

# ─── 3. NULL-UNSAFE QUERY PATTERNS ───────────────────────────────────────────
section "3 · Null-Unsafe API Patterns"

# Pattern A: default array destructuring with no custom queryFn on same line
# (high risk: if API returns null, default [] is bypassed)
UNSAFE_DEFAULT=$(grep -rn "const { data" client/src/ --include="*.tsx" \
  | grep "= \[\]" \
  | grep -v "queryFn:\|Array\.isArray\|r\.ok\|response\.ok\|rawData\|Raw\b" \
  | grep -v "node_modules")

if [ -n "$UNSAFE_DEFAULT" ]; then
  UNSAFE_COUNT=$(echo "$UNSAFE_DEFAULT" | grep -c .)
  warn "$UNSAFE_COUNT potential null-unsafe array destructure(s) — verify custom queryFn exists:"
  echo "$UNSAFE_DEFAULT" | head -8 | sed 's/^/      /'
else
  pass "No null-unsafe default array destructures found"
fi

# Pattern B: r.json() without r.ok check (returns error object on 401, not array)
UNSAFE_JSON=$(grep -rn "\.then(r => r\.json())" client/src/ --include="*.tsx" \
  | grep -v "r\.ok\|response\.ok\|node_modules")

if [ -n "$UNSAFE_JSON" ]; then
  UNSAFE_JSON_COUNT=$(echo "$UNSAFE_JSON" | grep -c .)
  warn "$UNSAFE_JSON_COUNT queryFn(s) call r.json() without r.ok check — verify data is null-guarded:"
  echo "$UNSAFE_JSON" | head -8 | sed 's/^/      /'
else
  pass "All custom queryFn calls check r.ok before r.json()"
fi

# ─── 4. BUILD HEALTH ──────────────────────────────────────────────────────────
section "4 · TypeScript Build"

BUILD_OUTPUT=$(npm run build 2>&1)
TS_ERRORS=$(echo "$BUILD_OUTPUT" | grep -c "error TS" || echo 0)

if echo "$BUILD_OUTPUT" | grep -q "✓ built"; then
  pass "TypeScript build successful — zero compile errors"
else
  fail "Build failed or has TypeScript errors ($TS_ERRORS error(s))"
  echo "$BUILD_OUTPUT" | grep "error TS" | head -5 | sed 's/^/      /'
fi

# ─── SUMMARY ──────────────────────────────────────────────────────────────────
echo -e "\n${BOLD}══ Summary ══${NC}"
echo -e "  Errors:   ${RED}${ERRORS}${NC}"
echo -e "  Warnings: ${YELLOW}${WARNINGS}${NC}"

if [ "$ERRORS" -eq 0 ] && [ "$WARNINGS" -eq 0 ]; then
  echo -e "\n  ${GREEN}${BOLD}All checks passed — platform is clean.${NC}"
elif [ "$ERRORS" -eq 0 ]; then
  echo -e "\n  ${YELLOW}${BOLD}No errors, but review warnings above.${NC}"
else
  echo -e "\n  ${RED}${BOLD}Fix errors before publishing.${NC}"
  exit 1
fi
