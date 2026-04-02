# M Strategic Execution Operating System - Demo Checklist

**Version:** 1.0 | **Last Updated:** December 2024

---

## Pre-Demo Preparation (15 minutes before)

### Environment Check
- [ ] Application is running (`npm run dev`)
- [ ] Open browser console (F12) - verify no red errors
- [ ] WebSocket shows "Live" or "Demo Mode" badge (top right of Foresight Radar)
- [ ] Run quick smoke test: `npx playwright test e2e/comprehensive-platform-tests.spec.ts --project=chromium --reporter=line`

### Browser Setup
- [ ] Use Chrome or Edge (best compatibility)
- [ ] Set zoom to 100%
- [ ] Clear cache if experiencing issues (Ctrl+Shift+Delete)
- [ ] Close unnecessary tabs
- [ ] Disable extensions that might interfere

### Network Check
- [ ] Stable internet connection
- [ ] API responses are fast (check Network tab)

---

## Critical Demo Pages - Golden Path

### 1. Homepage (/)
**Purpose:** First impression, brand messaging

| # | Element | Expected Behavior | Fallback if Broken |
|---|---------|------------------|---------------------|
| 1 | Page load | No blank screen | Refresh, check console |
| 2 | Hero headline | "Success Favors the Prepared" visible | Skip to Demo Hub |
| 3 | Get Started button | Click → navigates to /new-user-journey | Use /demos instead |
| 4 | Navigation bar | All links respond to hover/click | Use direct URLs |
| 5 | Stats bar | Shows "148 playbooks", "16 signals", etc. | Mention verbally |
| 6 | 4-Phase grid | PREPARE, MONITOR, EXECUTE, LEARN cards | Click each to verify |
| 7 | Footer links | All navigate correctly | |

**Recovery:** If homepage is broken, start at /demos or /executive-dashboard

---

### 2. Executive Dashboard (/executive-dashboard)
**Purpose:** Main operational hub for executives

| # | Element | Expected Behavior | Fallback if Broken |
|---|---------|------------------|---------------------|
| 1 | Page load | Dashboard visible within 3 seconds | Refresh once |
| 2 | Overview tab | Selected by default, metrics displayed | |
| 3 | Click Readiness tab | Content switches, shows FRI metrics | |
| 4 | Click Velocity tab | Content switches, shows response times | |
| 5 | Click Preparedness tab | Content switches, shows readiness data | |
| 6 | Click Intelligence tab | Content switches, shows signals | |
| 7 | Metric numbers | Display real numbers (not "undefined") | |
| 8 | Charts/graphs | Render correctly | |

**Recovery:** If tabs don't switch, use Intelligence Control Center (/intelligence) for similar data

---

### 3. Playbook Library (/playbook-library)
**Purpose:** Browse 148 strategic playbooks

| # | Element | Expected Behavior | Fallback if Broken |
|---|---------|------------------|---------------------|
| 1 | Page load | Categories and playbooks visible | |
| 2 | Search box | Type "competitive" → filters results | |
| 3 | Clear search | All playbooks return | |
| 4 | Category tabs/filters | Click each → filters playbooks | |
| 5 | Playbook card click | Opens detail view/modal | |
| 6 | Featured section | Highlighted playbooks visible | |
| 7 | 148 count | Visible somewhere on page | Mention verbally |

**Recovery:** If search broken, use category filters. If cards broken, describe capabilities verbally.

---

### 4. Foresight Radar (/foresight-radar)
**Purpose:** AI monitoring and weak signal detection

| # | Element | Expected Behavior | Fallback if Broken |
|---|---------|------------------|---------------------|
| 1 | Page load | Radar visualization animates | Refresh once |
| 2 | "Foresight Radar" title | Visible at top | |
| 3 | Demo mode badge | Shows "Live" or "Demo Mode" | |
| 4 | Radar View tab (default) | Rotating scan line visible | |
| 5 | Weak signal blips | Colored dots on radar (4 minimum) | |
| 6 | Hover on blip | Tooltip appears with signal details | |
| 7 | Click blip | Opens investigation modal | |
| 8 | "Investigate Signal" button | Opens modal with signal details | |
| 9 | Modal close (Dismiss) | Modal closes cleanly | Press Escape |
| 10 | Oracle Pattern cards | Show accuracy % and trend | |
| 11 | "View Pattern Details" button | Opens pattern modal | |
| 12 | Click Signal Center tab | Shows 16 signal categories grid | |
| 13 | Click on category card | Shows category detail view | |
| 14 | "Back to Categories" button | Returns to grid | |
| 15 | Click Configure tab | Shows configuration options | |
| 16 | Configuration cards | Link to /triggers, /integrations | |

**Recovery:** If radar broken, use Intelligence Demo (/intelligence-demo) instead. If modals broken, press Escape and describe features verbally.

---

### 5. Command Center (/command-center)
**Purpose:** Real-time execution coordination

| # | Element | Expected Behavior | Fallback if Broken |
|---|---------|------------------|---------------------|
| 1 | Page load | War room interface visible | Refresh once |
| 2 | Timer/countdown | Shows execution timing (12-min cycle) | Mention verbally |
| 3 | Stakeholder panels | Display team assignments (CEO, CFO, Legal, etc.) | |
| 4 | Action items | Listed with status indicators (complete/pending) | |
| 5 | Phase indicators | Show current execution phase | |
| 6 | Progress bars | Visual progress for each stakeholder | |
| 7 | Completion status | Shows % complete | |

**Recovery - Detailed Steps:**
1. If page blank: Refresh browser (Ctrl+R)
2. If timer stuck: Explain "12-minute coordinated response" verbally
3. If stakeholder panels missing:
   - Navigate to /executive-dashboard → Intelligence tab
   - Say: "Here you'd see all stakeholders coordinating in real-time"
4. If actions not loading:
   - Show /new-user-journey step 7 (Command Center Preview)
   - This shows the same coordination flow as a preview
5. Alternative demo flow:
   - Use Executive Simulation (/executive-simulation) to show decision-making
   - Explain: "Once decisions are made, Command Center coordinates execution"

---

### 6. Demo Hub (/demos)
**Purpose:** Entry point for all demo experiences

| # | Element | Expected Behavior | Fallback if Broken |
|---|---------|------------------|---------------------|
| 1 | Page load | All demo options visible | Refresh once |
| 2 | Intelligence Demo card | Click → /intelligence-demo | Use direct URL |
| 3 | Executive Simulation card | Click → /executive-simulation | Use direct URL |
| 4 | Product Tour card | Click → /product-tour | Use direct URL |
| 5 | Industry filters | Filter demos by vertical | Skip filters |
| 6 | Live Activation option | Available for guided demo | Use Intelligence Demo |
| 7 | Industry demo cards | Luxury, Financial, Pharma, etc. | Use direct URLs |

**Recovery - Detailed Steps:**
1. If page blank: Refresh, check console for errors
2. If demo cards not clickable:
   - Open a new tab
   - Navigate directly to the desired demo:
     - /intelligence-demo (primary recommended)
     - /executive-simulation
     - /product-tour
     - /luxury-demo, /financial-demo, /pharma-demo, etc.
3. If filters broken: Browse demos without filtering
4. If links navigate to 404:
   - Use Foresight Radar (/foresight-radar) as main demo
   - Use Playbook Library (/playbook-library) to show capabilities
5. Alternative entry points for demo content:
   - Homepage → Get Started Free → New User Journey
   - Navigation bar → MONITOR → Foresight Radar
   - Direct to /intelligence-demo (most reliable demo)

**Direct URL Quick Reference:**
| Demo Type | Direct URL |
|-----------|-----------|
| Intelligence Demo | /intelligence-demo |
| Executive Simulation | /executive-simulation |
| Product Tour | /product-tour |
| Luxury Industry | /luxury-demo |
| Financial Industry | /financial-demo |
| Pharma Industry | /pharma-demo |
| Manufacturing | /manufacturing-demo |
| Retail Industry | /retail-demo |
| Energy Industry | /energy-demo |

---

### 7. Intelligence Demo (/intelligence-demo)
**Purpose:** Guided signal detection experience

| # | Element | Expected Behavior | Fallback if Broken |
|---|---------|------------------|---------------------|
| 1 | Page load | Demo interface ready | Refresh once |
| 2 | Scenario selector | Multiple scenarios available | |
| 3 | Start/trigger button | Initiates demo sequence | |
| 4 | Signal detection animation | Shows detection happening | |
| 5 | Playbook recommendation | Displays after signal detected | |
| 6 | Activation option | Shows ability to activate playbook | |

**Recovery:** Use Foresight Radar with manual narration of detection flow

---

### 8. Executive Simulation (/executive-simulation)
**Purpose:** Interactive role-play demo

| # | Element | Expected Behavior | Fallback if Broken |
|---|---------|------------------|---------------------|
| 1 | Page load | Simulation interface ready | |
| 2 | Role selection | Choose executive perspective | |
| 3 | Scenario presentation | Crisis/opportunity presented | |
| 4 | Decision points | Interactive choices available | |
| 5 | Outcome display | Shows results of decisions | |

**Recovery:** Describe scenario verbally, show Command Center for coordination view

---

### 9. Investor Presentation (/investor-presentation)
**Purpose:** Full pitch deck for investors

| # | Element | Expected Behavior | Fallback if Broken |
|---|---------|------------------|---------------------|
| 1 | Page load | First slide visible | |
| 2 | Right arrow key | Advances to next slide | Click arrow if present |
| 3 | Left arrow key | Goes to previous slide | |
| 4 | All 5 acts load | Hook → Problem → Product → Proof → Ask | |
| 5 | Act navigation | Quick jump to sections | |
| 6 | Speaker notes toggle | Shows/hides presenter notes | |
| 7 | Live demo transitions | Links to actual platform pages | |

**Recovery:** Use PDF deck backup. Always have PDF exported as backup!

---

### 10. New User Journey (/new-user-journey)
**Purpose:** Onboarding wizard demonstration

| # | Element | Expected Behavior | Fallback if Broken |
|---|---------|------------------|---------------------|
| 1 | Welcome step | "Success Favors the Prepared" visible | |
| 2 | Progress indicator | Shows step 1 of 7 | |
| 3 | Continue button | Advances to Organization step | |
| 4 | Organization Profile | Company name, industry dropdown work | |
| 5 | Industry dropdown | Opens with 8 industries | |
| 6 | Strategic Priorities step | Checkboxes work | |
| 7 | Playbook Selection | Recommended playbooks shown | |
| 8 | Signal Configuration | Toggle switches work | |
| 9 | Success Metrics | Input fields work | |
| 10 | Command Center Preview | Live simulation displays | |

**Recovery:** Skip broken steps, focus on working portions. Show Command Center directly.

---

### 11. Intelligence Control Center (/intelligence)
**Purpose:** Unified entry point for intelligence features

| # | Element | Expected Behavior | Fallback if Broken |
|---|---------|------------------|---------------------|
| 1 | Page load | Quick stats visible | |
| 2 | Data points count | Shows 92+ data points | |
| 3 | Signal categories | Shows 16 categories | |
| 4 | Quick links | Navigate to specific features | |
| 5 | AI Hub link | Works | |
| 6 | Foresight Radar link | Works | |

**Recovery:** Use individual pages directly

---

### 12. Our Story (/our-story)
**Purpose:** Origin story and brand narrative

| # | Element | Expected Behavior | Fallback if Broken |
|---|---------|------------------|---------------------|
| 1 | Hero section | "40-Second Decisions" headline | |
| 2 | Scroll indicator | Animated arrow | |
| 3 | Timeline sections | Load as you scroll | |
| 4 | Stats cards | Animate on scroll | |
| 5 | CTA at end | "Success Favors the Prepared. Are You?" | |

**Recovery:** Tell the story verbally - the football coach origin story

---

## Quick Troubleshooting Guide

### Page Shows Blank
1. Check console for errors (F12)
2. Refresh the page (Ctrl+R)
3. Clear cache (Ctrl+Shift+Delete)
4. Restart application if needed

### Buttons Not Responding
1. Wait for page to fully load (watch network tab)
2. Check for JavaScript errors
3. Ensure no modal is blocking
4. Try clicking elsewhere first, then button

### Data Not Loading / Showing "undefined"
1. Refresh the page
2. Demo mode should show fallback data automatically
3. Check API health in console Network tab
4. If persistent, restart workflow

### Modal Won't Close
1. Press Escape key
2. Click outside the modal
3. Look for X button in corner
4. Refresh page as last resort

### WebSocket Disconnected
1. Page should show "Demo Mode" automatically
2. If stuck on "Connecting", refresh
3. Demo features work in offline mode

---

## Demo Scripts by Audience

### Investor Pitch (10 minutes)
1. **Homepage** (30 sec) - Brand messaging, stats bar
2. **Our Story** (90 sec) - Football coach origin, emotional hook
3. **Intelligence Demo** (3 min) - Run through signal detection → playbook activation
4. **Command Center** (2 min) - 12-minute response coordination
5. **Executive Dashboard** (2 min) - Metrics, FRI score
6. **Investor Presentation** (1 min) - Flip to Traction/Ask slides

### Enterprise Executive (15 minutes)
1. **Our Story** (2 min) - Build rapport
2. **How It Works** (2 min) - 4-phase methodology
3. **Playbook Library** (3 min) - Browse 148 playbooks, search
4. **Foresight Radar** (4 min) - Signal detection, investigation modals
5. **Executive Simulation** (4 min) - Let them drive decision-making

### Technical Evaluation (20 minutes)
1. **Intelligence Control Center** - 16 signal categories, 92 data points
2. **Triggers Page** - Threshold configuration demo
3. **Integrations Page** - Enterprise connector catalog
4. **Command Center** - Real-time coordination capabilities
5. **API discussion** - Architecture overview if requested

### Quick Product Overview (5 minutes)
1. **Homepage** - Value prop
2. **Playbook Library** - Quick scroll
3. **Foresight Radar** - Click one signal
4. **Command Center** - Brief view
5. **CTA** - "Success Favors the Prepared"

---

## Emergency Fallbacks by Page

| If This Breaks... | Use This Instead |
|-------------------|------------------|
| Homepage | /demos or /executive-dashboard |
| Foresight Radar | /intelligence-demo |
| Command Center | /executive-dashboard |
| Intelligence Demo | /foresight-radar with narration |
| Investor Presentation | PDF deck backup |
| New User Journey | Skip, show /executive-dashboard |
| Playbook Library | Mention 148 playbooks verbally |
| Any modal | Press Escape, continue flow |

---

## Running Automated Tests

```bash
# Quick smoke test (recommended before demos)
npx playwright test e2e/comprehensive-platform-tests.spec.ts --project=chromium --reporter=line

# Full test with visual browser
npx playwright test --headed --project=chromium

# Test specific page
npx playwright test -g "Foresight Radar" --project=chromium

# Generate HTML report after tests
npx playwright show-report
```

---

## Pre-Roadshow Checklist

### 24 Hours Before
- [ ] Run full test suite, fix any failures
- [ ] Clear test data, use fresh demo data
- [ ] Test on presentation machine/browser
- [ ] Export PDF backup of Investor Presentation
- [ ] Prepare backup internet connection (mobile hotspot)

### 1 Hour Before
- [ ] Restart application fresh
- [ ] Run quick smoke test
- [ ] Clear browser cache
- [ ] Close unnecessary applications
- [ ] Set Do Not Disturb on all devices

### Just Before Demo
- [ ] Navigate to starting page
- [ ] Position browser windows
- [ ] Have fallback URLs ready in notes
- [ ] Deep breath - you've prepared well

---

## Support Contacts

If you encounter issues during a live demo:
- Stay calm, acknowledge briefly: "Let me show you this another way"
- Use fallback pages
- Focus on storytelling while navigating issues
- Never apologize excessively - pivot smoothly

---

*Remember: Success Favors the Prepared. You've done the work. Trust the process.*
