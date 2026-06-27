---
name: Situations vs Triggers — Messaging Rule
description: The exact product architecture distinction between "situation" (the strategic event organizations face) and "trigger" (the customer-defined detection threshold that fires when a situation arrives).
---

# Situations vs Triggers — Locked Messaging Rule

## Precise Product Architecture Definition

**"Situation"** = the strategic event itself — what organizations face, what Readiness Protocols are named for, what leaders experience. Examples: "Ransomware Attack," "Activist Investor," "Supply Chain Collapse." The protocol library covers 180 situations across 9 domains.

**"Trigger"** = the customer-defined detection threshold. Customers configure specific data points to be continuously monitored; when those data points cross the defined threshold, the system fires an alert that a situation has arrived. The 231 trigger patterns are 231 pre-built configurable detection thresholds. The customer owns the definition of when their trigger fires.

**The architecture flow:** Customer defines a trigger (data points + threshold) → system monitors continuously → threshold is crossed → trigger fires → situation is detected → Readiness Protocol activates → 12-minute execution begins.

**Why this distinction matters in copy:** When choosing a scenario on a product page, users are choosing a *situation* (the event type) — not configuring a *trigger* (the detection threshold). "Choose your trigger" is architecturally wrong — they're choosing a situation. "231 trigger patterns monitored" is architecturally correct — those are the 231 configurable thresholds.

## The Locked Tagline

**"When the Situation Arrives — The Response Is Ready Before the Trigger Fires."** — LOCKED.

Three-line visual display on Homepage hero:
1. *"When the Situation Arrives —"* — italic, muted white (rgba 0.72), ~26px. Sets customer context.
2. **"The Response Is Ready"** — white, bold, ~66px.
3. **"Before the Trigger Fires."** — gold (#C9A84C), bold, ~66px.

**Why this structure:** "Situation" = what the customer experiences. "Trigger fires" = the product's detection mechanism at work. "Before the trigger fires" means the response is staged before the customer's own detection threshold is even crossed — the ultimate readiness claim.

## Usage Rules

### Always "situation":
- What organizations *face* — "every situation your organization will face"
- What protocols are built *for* — "Readiness Protocol for this situation"
- What leaders *experience* — "when a situation presents itself"
- Cost of unpreparedness — "what one unprepared situation costs"
- Choosing scenarios in product demos — "choose your situation"
- Breadth of coverage — "180 situations across 9 domains"

### Always "trigger":
- The 231 monitored patterns — "231 trigger patterns continuously monitored"
- The detection mechanism firing — "before the trigger fires," "when the trigger fires"
- Customer configuration context — "customers define their own trigger thresholds"
- The three-column preparation breakdown — "Before the Trigger" column (tagline echo)
- Technical/product documentation

### Never mix:
- "Choose your trigger" — WRONG (they're choosing a situation)
- "Trigger Detected" — WRONG (what was detected is a situation)
- "Every trigger your org will face" — WRONG (orgs face situations)

## The Frequency Reframe

Most organizations face **15–20 situations annually** that demand a coordinated response — not just rare catastrophes. This frames Readiness OS as a subscription (compounding value across 15–20 activations/year), not insurance (one-time catastrophe hedge). Always include frequency when introducing scenarios to prospects.
