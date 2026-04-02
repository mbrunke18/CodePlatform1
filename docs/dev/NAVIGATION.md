# VEXOR Navigation - Focused & Powerful

## Core Philosophy
**Kill scope crawl. Preserve robustness. Deliver clarity.**

64 pages exist → 10 in primary navigation → Everything else accessible but not cluttering the experience.

---

## PRIMARY USER NAVIGATION (The Main Experience)

### 1. HOME `/`
**Landing & Value Proposition**

### 2. THE DEMO `/demo` or `/how-it-works`
**ONE Powerful Interactive Experience**
- Component: `InteractiveMasterDemo.tsx` (912 lines - the definitive VEXOR demo)
- Shows complete PREPARE → MONITOR → EXECUTE → LEARN cycle
- Interactive: Clear labeling of human input vs. AI action
- **This is the demo.** All others are alternate formats preserved for sales flexibility.

### 3. PLAYBOOK LIBRARY `/playbook-library` or `/business-scenarios`
**Browse 110 Strategic Playbooks Across 8 Domains**
- Component: `PlaybookLibrary.tsx`
- Replaces legacy "13 scenarios" structure
- Filter by domain, search, preview details

### 4. DASHBOARD `/dashboard`
**Executive Command Center**
- Strategic preparation overview
- Preparedness scores
- Active playbook status
- Quick access to all modules

### 5. AI RADAR `/ai-radar`
**24/7 Trigger Monitoring (LIVE)**
- Real-time signal monitoring
- Trigger confidence scores
- Recommended playbook activations
- Manual override capability

### 6. COMMAND CENTER `/command-center`
**Playbook Execution (Executive War Room)**
- Component: `ExecutiveWarRoomPage.tsx`
- One-click activation
- 12-minute execution tracking
- Stakeholder coordination
- Live task completion
- Note: Same as `/war-room` (legacy route)

### 7. LEARNING CENTER `/nfl-learning`
**Strategic Learning & Institutional Memory**
- Execution history
- Success patterns
- AI-generated insights
- Playbook refinement

### 8. INTEGRATIONS `/integrations`
**Enterprise Integration Hub**
- 12 pre-built connectors
- Webhook configuration
- Integration health

### 9. SETTINGS `/settings`
**Platform Administration**

### 10. PRICING `/pricing`
**Pricing & Packaging** (if needed in nav)

---

## THE 4-PHASE PRODUCT MODULES (Organized by Methodology)

### PHASE 1: PREPARE
- `/dashboard` - Command center overview
- `/playbook-library` - 110 playbook templates
- `/what-if-analyzer` - Scenario testing
- `/practice-drills` - Strategic rehearsals with timer
- `/drill-tracking` - Performance tracking
- `/preparedness-report` - Readiness scoring

### PHASE 2: MONITOR  
- `/ai` - AI Intelligence Hub (5 modules consolidated)
- `/ai-radar` - Live trigger monitoring
- `/triggers-management` - Trigger configuration

### PHASE 3: EXECUTE
- `/command-center` - Executive War Room (playbook activation)
- `/playbook-activation/:triggerId/:playbookId` - PlaybookActivationConsole (dynamic route)
- `/triggers-management` - Trigger configuration & management
- `/collaboration` - Real-time team coordination

### PHASE 4: LEARN
- `/nfl-learning` - Strategic learning center
- `/institutional-memory` - Decision outcomes
- `/board-briefings` - Executive reports

---

## SUPPORTING MODULES (Accessible, Not in Primary Nav)

### Analytics & Intelligence
- `/analytics` - Advanced analytics
- `/executive-analytics-dashboard` - C-suite dashboard
- `/decision-velocity` - Velocity metrics
- `/audit-logging-center` - Enterprise audit trails
- `/executive-suite` - C-suite command center
- `/executive-scorecard` - Top 5 metrics
- `/business-intelligence` - BI portal
- `/operating-model-health` - McKinsey 12 elements

### Specialized Views
- `/pulse` - Pulse Intelligence (redirects to AI hub)
- `/flux` - Flux Adaptations (redirects to AI hub)
- `/prism` - Prism Insights (redirects to AI hub)
- `/echo` - Echo Cultural Analytics (redirects to AI hub)
- `/nova` - Nova Innovations (redirects to AI hub)

---

## ALTERNATE DEMO FORMATS (Preserved for Sales Flexibility)

**Primary Demo:** `/demo` → `InteractiveMasterDemo` (THIS IS THE ONE)

**Alternate Formats** (accessible via direct link, not in main nav):
- `/demos` - DemoHub (portal to all formats)
- `/watch-demo` - Video walkthrough
- `/trade-show-demo` - Booth-optimized
- `/executive-demo` - C-suite pitch
- `/hybrid-demo` - Mixed live + video
- `/executive-demo-walkthrough` - Step-by-step phases

**Why keep alternates?**
- Sales teams have different customer preferences
- Event-specific needs (trade shows, executive briefings)
- No deletion = no broken links
- Robustness preserved

---

## LEGACY PAGES (Backward Compatibility)

These still work but are being phased out:
- `/crisis` → CrisisResponseCenter
- `/war-room` → ExecutiveWarRoomPage
- `/scenarios` → Legacy scenario management
- `/templates` → ComprehensiveScenarios
- `ScenarioGallery.tsx` → Replaced by PlaybookLibrary

**Migration Path:**
- Old links still work (no breaking changes)
- New links use new structure
- Gradual customer migration

---

## SALES & MARKETING PAGES

- `/` - Public landing page
- `/demo` - THE interactive demo
- `/pricing` - 3-tier pricing model
- `/contact` - Lead capture & pilot application
- `/our-story` - Company narrative & NFL methodology origin
- `/vc-presentations` - Investor materials

---

## ROUTE CONSOLIDATION

### Canonical Routes (Use These)
- `/demo` → InteractiveMasterDemo
- `/playbook-library` → 110 Playbook Library
- `/ai` → AI Intelligence Hub
- `/dashboard` → Executive Dashboard

### Aliases (Also Work)
- `/how-it-works` → Same as `/demo`
- `/business-scenarios` → Same as `/playbook-library`

---

## PAGE COUNT BREAKDOWN

**Total Files:** 64 page components
- **Primary Nav:** 10 core pages (visible in main menu)
- **Product Modules:** 15 pages (organized by 4-phase methodology)
- **Supporting:** 12 analytics/specialized pages
- **Demos:** 7 demo formats (1 primary, 6 alternates)
- **Legacy:** 10 backward-compatibility pages
- **Marketing:** 5 sales/marketing pages
- **Admin:** 5 admin/config pages

**Strategy:**
- ✅ All functionality preserved (no deletion)
- ✅ Clear hierarchy (focused user journey)
- ✅ No nav clutter (smart organization)
- ✅ Single mental model (110 playbooks, 8 domains, 4 phases)

---

## ELIMINATED REDUNDANCIES

### ✅ Demo Consolidation
**Before:** 7 competing demo experiences, unclear which to use
**After:** ONE primary demo (InteractiveMasterDemo), others available as alternates

### ✅ Mental Model Clarity
**Before:** Mixed terminology (scenarios vs. playbooks, NFL vs. executive)
**After:** Single model (110 playbooks across 8 domains)

### ✅ Navigation Simplification
**Before:** 64 pages competing for attention
**After:** 10 primary pages, rest organized by purpose

### ✅ AI Intelligence Consolidation
**Before:** 5 separate AI module pages
**After:** 1 AI Intelligence Hub with 5 modules as tabs/sections

---

## USER JOURNEYS

### New Prospect
1. `/` (landing)
2. `/demo` (interactive experience)
3. `/playbook-library` (browse 110 playbooks)
4. `/contact` (request pilot)

### Pilot Customer  
1. `/dashboard` (command center)
2. `/playbook-library` (select & customize)
3. `/practice-drills` (rehearse)
4. `/ai-radar` (monitor triggers)
5. `/command-center` (activate)
6. `/nfl-learning` (review outcomes)

### Executive
1. `/executive-suite` (C-suite view)
2. `/ai-radar` (check alerts)
3. `/board-briefings` (review reports)
4. Approve activation
5. Monitor execution

---

## IMPLEMENTATION STATUS

✅ **Completed:**
- Single demo consolidation (`/demo` → InteractiveMasterDemo)
- Playbook library terminology (110 playbooks, 8 domains)
- Route organization (all pages preserved, clearly structured)
- Updated replit.md with focused product vision

🎯 **Result:**
- **Same robustness** (all 64 pages functional)
- **Clear focus** (10 primary pages in nav)
- **Zero scope crawl** (everything has a purpose)
- **Single mental model** (no confusion)

---

Last Updated: October 26, 2025 - **Scope crawl eliminated. Robustness preserved.**
