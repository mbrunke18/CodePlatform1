import { useState, useEffect, useLayoutEffect, useRef, createContext, useContext } from "react";
import { Link } from "wouter";
import {
  ArrowRight, ChevronLeft, Shield, Zap, Clock, Users, Database,
  CheckCircle, Lock, Circle, Loader2, TrendingUp, Search,
  BarChart2, Bell, BookOpen, Activity, ChevronRight, Settings,
  RefreshCw, Star, AlertTriangle, Target, PlusCircle, DollarSign,
} from "lucide-react";
import { VaughnMartinLogo } from "@/components/VaughnMartinLogo";

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const NAVY = "#0A0F2E";
const NAVY_CARD = "#0f1840";
const NAVY_MID = "#132558";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const BORDER = "rgba(255,255,255,0.12)";
const MUTED = "rgba(255,255,255,0.62)";
const BC: React.CSSProperties = { fontFamily: "'Barlow Condensed', 'Barlow', sans-serif" };
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', Georgia, serif" };

// ─── Step definitions ─────────────────────────────────────────────────────────
const PHASES = [
  { label: "PREPARATION", color: TEAL, steps: [0, 1, 2], desc: "Normal operations" },
  { label: "RESPONSE", color: GOLD, steps: [3, 4, 5, 6], desc: "Trigger fires" },
  { label: "ADVANCE", color: TEAL, steps: [7, 8], desc: "After the activation" },
];

const STEP_DEFS = [
  { label: "Command Center", tag: "Monday, 6:47 AM", phase: 0 },
  { label: "Trigger Portfolio", tag: "47 active · 231 available", phase: 0 },
  { label: "Protocol Library", tag: "180 pre-staged responses", phase: 0 },
  { label: "Signal Detected", tag: "Signal threshold crossed", phase: 1 },
  { label: "Protocol Staged", tag: "Pre-built before this moment", phase: 1 },
  { label: "War Room Active", tag: "Execution in progress", phase: 1 },
  { label: "Executive Authorizes", tag: "1 decision · Protocol deploys", phase: 1 },
  { label: "Response Complete", tag: "12 minutes. Done.", phase: 2 },
  { label: "System Learns", tag: "Protocol updated", phase: 2 },
];

function getStepTag(i: number, sc: ScenarioData): string {
  const overrides: Partial<Record<number, string>> = {
    3: sc.signalTag,
    5: sc.warRoomTag,
    6: sc.execTag,
    7: sc.completeTag,
    8: sc.advanceTag,
  };
  return overrides[i] ?? STEP_DEFS[i].tag;
}

// ─── Step context banners ─────────────────────────────────────────────────────
const STEP_CONTEXT = [
  {
    headline: "Your competitors are hoping for a quiet week. You already know what to do if it isn't.",
    plain: "This is the Command Center — your organization's readiness state right now. Three signals detected overnight. Scored automatically. Flagged low-risk. Nobody had to check. No meeting was called. The difference between this and a traditional Monday morning: your peers are reactive. You are already positioned. That gap compounds every single week.",
  },
  {
    headline: "Every unmonitored trigger is a 30-day surprise waiting to happen.",
    plain: "You've activated 47 of 231 available trigger patterns. Each one is already mapped to a complete response plan. When a threshold is crossed, the right response is already connected — no scrambling, no 'who owns this?' emergency call. The triggers you're NOT watching are the ones that become 30-day mobilization events. This is how you stop that from happening.",
  },
  {
    headline: "Your competitors build their response after the crisis fires. You built yours before.",
    plain: "Every card on this shelf is a complete response plan — tasks written, people assigned, decision gates mapped — before any trigger fired. Building one of these during an active event costs 3–4 weeks and $800K–$2M in reactive consulting fees. You've built 180 of them, pre-staged, ready to activate in seconds. That is not a feature. That is a categorically different operating model.",
  },
  {
    headline: "The clock started. Your competitors don't know it yet.",
    plain: "The platform detected the signal and surfaced the right response before a single human was aware. A traditional organization won't notice this for hours — sometimes days. By then, the exposure window has widened. Decisions are made under pressure with incomplete information. The system eliminated detection lag entirely. The response was already waiting.",
  },
  {
    headline: "Right now, a peer organization is building from scratch what this shelf already has.",
    plain: "This protocol was created during a preparedness session before any trigger fired. Every task written. Every person assigned. Nothing is being invented right now — it's being pulled off the shelf. Your competitor hit the same trigger this week. They assembled an emergency call. Negotiated consulting scope. Figured out who owns the response. That takes 3–4 weeks minimum. You're already executing.",
  },
  {
    headline: "Day 2 for them. Minutes for you. The exposure window is the cost.",
    plain: "Executives notified in under 90 seconds. Tasks live across departments. Immediate actions already in motion. In a traditional response at this exact moment, you would still be on the first bridge call — figuring out who owns the problem, which consultants to engage, what the response scope looks like. Every hour of that is exposure. The platform eliminated it.",
  },
  {
    headline: "Weeks of alignment compressed to one decision. Authority stays human.",
    plain: "The preparation eliminates the mobilization delay — but the final decision remains with the executive who owns it. See how peer executives decided in identical situations. Review three pre-flight questions confirming authority and readiness. Then authorize. One click. Everything deploys. Without this: 14-person alignment call, 3 days, $50K+ in emergency consulting before a single task starts. Click 'Authorize and Deploy' below.",
  },
  {
    headline: "12 minutes closed what would have been a 30-day exposure window.",
    plain: "Traditional response: 30 days just to mobilize — before execution even begins. This activation: under 12 minutes from first signal to full response. The table below shows exactly where those 30 days used to go — and why each one is now eliminated. 3,600× is not a speed metric. It is the difference between reacting to a crisis and having already solved it.",
  },
  {
    headline: "The platform just got harder to compete with.",
    plain: "Three things improved automatically: a task reordered, a new standard step added, the detection threshold lowered. The protocol is now faster. The institutional knowledge from this activation is permanently embedded. A competitor starting Readiness OS today would need 18 months of live activations to reach this point. Every close-out adds to a moat they cannot buy or copy.",
  },
];

// ─── Narration ────────────────────────────────────────────────────────────────
const NARRATION = [
  {
    headline: "Your competitors' Monday morning: zero protocols staged.",
    body: "This is what YOURS looks like with Readiness OS. Three signals caught overnight — automatically. 180 responses standing by. No meetings required. Your competitors are hoping nothing fires today. You already know your answer if it does.",
    callout: "Every day without this is a day you're hoping, not preparing.",
  },
  {
    headline: "Every trigger you're not watching is an open exposure window.",
    body: "231 trigger patterns exist. The average unprepared enterprise monitors 0 of them systematically. Each one that fires undetected adds 2–3 weeks of reactive scrambling and $800K–$2M in emergency spend. You've chosen 47 to watch. The system watches them 24/7 — so you don't have to hope you notice.",
    callout: "Unmonitored triggers don't disappear. They just cost more when they fire.",
  },
  {
    headline: "Building this during a crisis costs $2M+ and 30 days you don't have.",
    body: "Every response plan on this shelf was built before any trigger fired. Without this library, your team builds each response from scratch — under pressure, with incomplete context, at emergency consulting rates. The difference between browsing a shelf and building a response under fire is measured in weeks and millions of dollars.",
    callout: "The preparation cost is fixed. The reactive cost is unlimited.",
  },
  {
    headline: "Without this, nobody woke up yet. And the clock is running.",
    body: "The monitoring matched the pattern before a single human was aware. In a traditional response, this signal wouldn't surface until someone noticed — hours later, after the exposure window had widened. Every minute of detection delay is compounding cost. The system eliminated detection lag entirely.",
    callout: "Detection delay is the most expensive part of every crisis.",
  },
  {
    headline: "Right now, a traditional response team is building what this shelf already has.",
    body: "Somewhere in your industry, a peer organization hit the same trigger today. They're assembling a call. Negotiating scope with consultants. Figuring out who owns what. That takes 3–4 weeks minimum. This protocol was built in a preparedness session. It's been on the shelf since October. Nothing is being invented right now — only activated.",
    callout: "They're on Day 1. You're already executing.",
  },
  {
    headline: "Traditional response: Day 2, still assembling the call.",
    body: "Executives notified in under 90 seconds. Tasks live across departments. The first actions already in motion. In a traditional response at this exact moment — Day 2 — you'd still be figuring out who owns the problem, scheduling a bridge call, and negotiating which consultants to engage. The platform skipped all of that.",
    callout: "Every hour of mobilization delay is exposure. This eliminated it.",
  },
  {
    headline: "The alternative: 14 people, 3 with context, 3 days to alignment.",
    body: "The preparation compressed the mobilization cycle — but the final decision stays human. You see how peer executives decided in identical situations. Three pre-flight questions confirm authority and readiness. Then one authorization deploys everything. Without this: 14-person call, 3 days of alignment, $50K+ in emergency consulting before a single task starts.",
    callout: "Executive authority preserved. Mobilization cost eliminated.",
  },
  {
    headline: "12 minutes. Your competitor just started Day 14.",
    body: "The exposure window is closed. The outcome classified. Every stakeholder has a close-out summary. Your competitor hit the same trigger today. They mobilized for 30 days. You responded in 12 minutes. That gap — 3,600× — is not a speed advantage. It is a categorically different operating model. One that compounds with every activation.",
    callout: "3,600× Execution Head Start. The gap widens every quarter.",
  },
  {
    headline: "Competitors can copy a feature. They cannot copy 18 months of activation intelligence.",
    body: "The ADVANCE loop just closed. The protocol is updated. The next activation will be faster — automatically. No lessons-learned meeting. No follow-up consulting engagement. This institutional knowledge belongs to your organization, permanently. A competitor starting today needs 18 months of live activations to reach this point. That gap is the moat.",
    callout: "The moat grows with every activation. It is now permanently yours.",
  },
];

// ─── Shared static data ───────────────────────────────────────────────────────
const STAKEHOLDERS = [
  { role: "CISO", initials: "AC", name: "A. Chen", status: "acknowledged" as const, time: "< 2 min" },
  { role: "CTO", initials: "MT", name: "M. Torres", status: "acknowledged" as const, time: "< 2 min" },
  { role: "General Counsel", initials: "RP", name: "R. Patel", status: "notified" as const, time: "< 2 min" },
  { role: "CEO", initials: "KW", name: "K. Williams", status: "pending" as const, time: "—" },
];

const PRECEDENTS = [
  { exec: "CRO", date: "Nov 2024", choice: "Authorized — Run as Built", outcome: "Proven" as const },
  { exec: "CLO", date: "Jan 2025", choice: "Authorized — Run as Built", outcome: "Proven" as const },
];

const PREFLIGHT = [
  "Do you have decision authority for this response?",
  "Is executive sponsorship confirmed?",
  "Are you prepared to own outcomes through close-out?",
];

const TRIGGER_PORTFOLIO = [
  {
    priority: "HIGH" as const, color: "#EF4444",
    items: [
      { name: "Financial Infrastructure Compromise", domain: "Risk & Resilience", protocol: "#14", active: true },
      { name: "Activist Investor 13D Filing", domain: "Risk & Resilience", protocol: "#7" },
      { name: "Regulatory Investigation Opened", domain: "Risk & Resilience", protocol: "#29" },
      { name: "Competitor Pricing Displacement", domain: "Growth & Positioning", protocol: "#31" },
    ],
  },
  {
    priority: "MEDIUM" as const, color: GOLD,
    items: [
      { name: "Major Account Churn Signal", domain: "Growth & Positioning", protocol: "#47" },
      { name: "Key Executive Departure", domain: "Transformation", protocol: "#88" },
      { name: "Data Breach Notification", domain: "Risk & Resilience", protocol: "#63" },
      { name: "Acquisition Target Surfaces", domain: "Growth & Positioning", protocol: "#58" },
    ],
  },
  {
    priority: "MONITORING" as const, color: TEAL,
    items: [
      { name: "Analyst Rating Downgrade", domain: "Growth & Positioning", protocol: "#121" },
      { name: "Media Crisis Signal", domain: "Risk & Resilience", protocol: "#137" },
      { name: "Regulatory Comment Period Opens", domain: "Risk & Resilience", protocol: "#44" },
    ],
  },
];

const PROTOCOL_DOMAINS = [
  {
    name: "GROWTH & POSITIONING", color: GOLD, count: 58,
    protocols: [
      { id: "#31", name: "Competitor Displacement Sprint", tag: "72-hour window" },
      { id: "#47", name: "Account Retention Response", tag: "Churn defense" },
      { id: "#58", name: "M&A Rapid Response", tag: "LOI in 48 hrs" },
      { id: "#89", name: "Go-to-Market Acceleration", tag: "Launch sprint" },
    ],
  },
  {
    name: "RISK & RESILIENCE", color: "#EF4444", count: 82,
    protocols: [
      { id: "#7", name: "Activist Investor Response", tag: "Board defense" },
      { id: "#14", name: "Financial Services Ransomware", tag: "Cyber response" },
      { id: "#29", name: "DOJ/Regulatory Investigation", tag: "Day-1 response" },
      { id: "#52", name: "Supply Chain Collapse", tag: "Tier-1 failure" },
    ],
  },
  {
    name: "TRANSFORMATION", color: TEAL, count: 40,
    protocols: [
      { id: "#112", name: "Workforce Transformation", tag: "6,720 roles" },
      { id: "#127", name: "Digital Infrastructure Migration", tag: "Zero-downtime" },
      { id: "#88", name: "Leadership Transition Protocol", tag: "Succession" },
      { id: "#156", name: "Post-Merger Integration", tag: "Day-100 plan" },
    ],
  },
];

// ─── Scenario definitions ─────────────────────────────────────────────────────
interface ScenarioData {
  id: number;
  domain: string;
  domainColor: string;
  label: string;
  moment: string;
  crisisColor: string;
  crisisIsRed: boolean;
  riskScore: number;
  riskLabel: string;
  patternName: string;
  detectedAt: string;
  showLiveCounter: boolean;
  exposureLabel: string;
  exposureDisplay: string;
  exposureUnit: string;
  feed: Array<{ t: string; msg: string; hi: boolean }>;
  protocolId: string;
  protocolName: string;
  protocolDomain: string;
  tasks: number;
  phases: number;
  stakeholders: number;
  priorActivations: number;
  phaseNames: string[];
  phaseTasks: number[];
  builtDesc: string;
  builtDate: string;
  lastPracticed: string;
  avgTime: string;
  phase1Tasks: Array<{ name: string; owner: string; status: "complete" | "active" | "staged" }>;
  signalTag: string;
  warRoomTag: string;
  execTag: string;
  completeTag: string;
  advanceTag: string;
  elapsed: string[];
  completionTime: string;
  compRows: Array<{ metric: string; readiness: string; traditional: string; highlight: boolean }>;
  strip: Partial<Record<number, { elapsed: string; readiness: string; trad: string }>>;
  advanceUpdates: Array<{ type: string; change: string; impact: string }>;
  improvements: number;
  fearlessLine: string;
  timelineWithout: Array<{ time: string; event: string }>;
  timelineWith: Array<{ time: string; event: string }>;
  verdictWithout: string;
  verdictWith: string;
  signalHeadline: string;
  signalPlain: string;
  protocolPlain: string;
}

const DEMO_SCENARIOS: ScenarioData[] = [
  // ── 0: Competitor Cuts Price 20% ──────────────────────────────────────────
  {
    id: 0, domain: "GROWTH & POSITIONING", domainColor: GOLD,
    label: "Competitor Cuts Price 20%", moment: "11 min ago — deals going silent",
    crisisColor: GOLD, crisisIsRed: false,
    riskScore: 82, riskLabel: "HIGH — COMPETITIVE DISPLACEMENT RISK",
    patternName: "Competitive Pricing Displacement", detectedAt: "9:11 AM",
    showLiveCounter: false, exposureLabel: "Pipeline at Risk — 3 Deals in Final Negotiation",
    exposureDisplay: "$2.4M", exposureUnit: "PIPELINE AT RISK",
    feed: [
      { t: "9:09 AM", msg: "Competitor price cut confirmed across 4 industry publications", hi: false },
      { t: "9:10 AM", msg: "Account team flagged — 3 enterprise deals in final stage going silent", hi: false },
      { t: "9:11 AM", msg: "Threshold exceeded · Displacement pattern confirmed · Activating Protocol #31", hi: true },
    ],
    protocolId: "#31", protocolName: "Competitor Displacement Sprint",
    protocolDomain: "Growth & Positioning · Competitive Response",
    tasks: 18, phases: 4, stakeholders: 5, priorActivations: 2,
    phaseNames: ["IMMEDIATE", "RELATIONSHIP", "POSITIONING", "CLOSE-OUT"],
    phaseTasks: [4, 5, 6, 3],
    builtDesc: "This protocol was designed during a competitive preparedness session 6 months ago. Four complete response paths pre-staged: pricing defense, relationship retention, competitive displacement counter, value reframe.",
    builtDate: "Nov 12, 2025", lastPracticed: "Mar 8, 2026", avgTime: "9m 24s",
    phase1Tasks: [
      { name: "Pull affected account list and current deal stage", owner: "Sales Ops", status: "complete" },
      { name: "Activate account executive outreach — 3 key deals", owner: "Sales", status: "active" },
      { name: "Stage pricing authority for executive approval", owner: "Finance", status: "active" },
      { name: "Prepare competitive displacement brief", owner: "Marketing", status: "staged" },
      { name: "Executive sponsor outreach — top 2 accounts", owner: "CEO Office", status: "staged" },
    ],
    signalTag: "9:11 AM — 3 deals at risk", warRoomTag: "4:12 elapsed · 18 tasks",
    execTag: "5:38 elapsed · 1 decision", completeTag: "9:24 · OPTIMIZATION", advanceTag: "Protocol #31 updated",
    elapsed: ["—", "—", "—", "—", "—", "4:12", "5:38", "9:24", "9:24"],
    completionTime: "9:24",
    compRows: [
      { metric: "Time to Full Response", readiness: "9 min 24 sec", traditional: "3+ days (avg)", highlight: true },
      { metric: "Mobilization", readiness: "Pre-staged — no meetings", traditional: "Emergency calls, committee alignment", highlight: false },
      { metric: "Stakeholder Notification", readiness: "Automatic — 90 seconds", traditional: "Manual cascade (hours)", highlight: false },
      { metric: "Executive Decision", readiness: "1 authorization · 5:38", traditional: "After 2–3 day review cycle", highlight: false },
      { metric: "Deals Protected", readiness: "All 3 re-engaged in minutes", traditional: "2 of 3 lost before response ready", highlight: true },
    ],
    strip: {
      3: { elapsed: "0:22", readiness: "Signal detected — Competitor Displacement Pattern matched", trad: "Day 1 · Price cut discovered by sales rep, no org-wide response" },
      4: { elapsed: "1:14", readiness: "Protocol #31 staged — 18 tasks ready across 5 teams", trad: "Day 1 · Emergency sales call — still figuring out who owns this" },
      5: { elapsed: "4:12", readiness: "5 stakeholders executing — deal outreach underway", trad: "Day 2 · Pricing strategy still in committee review" },
      6: { elapsed: "5:38", readiness: "Executive authorization in progress", trad: "Day 3 · Proposal circulating — deals have already moved" },
    },
    advanceUpdates: [
      { type: "Sequence", change: "Account executive outreach moved to Task 1 (was Task 3)", impact: "−2 min avg" },
      { type: "New Task", change: "Executive sponsor call added as IMMEDIATE standard for Tier-1 accounts", impact: "Retention" },
      { type: "Threshold", change: "Competitive signal confidence lowered from 82% to 74%", impact: "Earlier detection" },
    ],
    improvements: 8,
    fearlessLine: "The competitor's move didn't catch them off guard. It never will.",
    timelineWithout: [
      { time: "9:09 AM", event: "Competitor announces 20% price cut. No one is watching." },
      { time: "11:00 AM", event: "Sales rep sees the news. Calls their manager." },
      { time: "2:00 PM", event: "Emergency call. 8 people, 2 with deal context." },
      { time: "Day 2", event: "Finance modeling margins. Legal reviewing contract terms." },
      { time: "Day 3", event: "Messaging approved. Two deals have already moved." },
      { time: "Day 7+", event: "Two of three deals lost. The third is now defensive." },
    ],
    timelineWith: [
      { time: "9:11 AM", event: "Signal detected. Protocol #31 staged. 4 response paths ready." },
      { time: "9:12:30", event: "5 stakeholders notified with full context and assignments." },
      { time: "9:14 AM", event: "Account team executing — approved messaging deployed." },
      { time: "Minute 4:12", event: "18 tasks live. Pricing authority under executive review." },
      { time: "Minute 5:38", event: "CEO reviews precedents. One decision. Authorized." },
      { time: "9:24", event: "Full response deployed. All 3 deals re-engaged." },
    ],
    verdictWithout: "7 days of scramble. Two deals lost.",
    verdictWith: "9 minutes 24 seconds. Three deals protected.",
    signalHeadline: "A competitor just moved. Your response was already waiting.",
    signalPlain: "It's 9:11 AM. A competitor cut prices 20% and it hit the news 11 minutes ago. Your sales team is getting calls. Three enterprise deals in final negotiation have gone silent. The platform detected the pattern automatically, matched it to Protocol #31, and staged four complete response paths — before a single executive saw the news.",
    protocolPlain: "Protocol #31 was designed during a competitive preparedness session 6 months ago. Pricing defense. Relationship retention. Competitive displacement counter. Value reframe. All four paths pre-built, pre-authorized, ready to deploy the moment the signal crossed the threshold.",
  },

  // ── 1: Systems Down at 3am / Ransomware ───────────────────────────────────
  {
    id: 1, domain: "RISK & RESILIENCE", domainColor: "#EF4444",
    label: "Systems Down at 3am", moment: "4:23 AM — encryption spreading",
    crisisColor: "#EF4444", crisisIsRed: true,
    riskScore: 94, riskLabel: "HIGH RISK — SIGNAL THRESHOLD EXCEEDED",
    patternName: "Financial Infrastructure Compromise", detectedAt: "4:23:07 AM",
    showLiveCounter: true, exposureLabel: "Financial Exposure Window — Live",
    exposureDisplay: "", exposureUnit: "AND CLIMBING",
    feed: [
      { t: "4:22:51 AM", msg: "Encryption signature detected — trading node 7A", hi: false },
      { t: "4:23:01 AM", msg: "Pattern confirmed — nodes 7B and 7C affected", hi: false },
      { t: "4:23:07 AM", msg: "Threshold exceeded · Protocol matched · Activating", hi: true },
    ],
    protocolId: "#14", protocolName: "Financial Services Ransomware Response",
    protocolDomain: "Risk & Resilience · Cyber · Regulatory",
    tasks: 22, phases: 5, stakeholders: 4, priorActivations: 3,
    phaseNames: ["IMMEDIATE", "SECONDARY", "CONTAINMENT", "RECOVERY", "CLOSE-OUT"],
    phaseTasks: [5, 5, 4, 5, 3],
    builtDesc: "This protocol was designed during a preparedness review — not during this crisis. Every task written. Every stakeholder identified. The preparation was the response.",
    builtDate: "Oct 14, 2025", lastPracticed: "May 3, 2026", avgTime: "11m 12s",
    phase1Tasks: [
      { name: "Isolate affected trading nodes", owner: "CISO", status: "complete" },
      { name: "Authenticate SWIFT alternate routing", owner: "CTO", status: "active" },
      { name: "Initiate forensic chain-of-custody", owner: "Legal", status: "active" },
      { name: "Prepare SEC regulatory notification", owner: "Legal", status: "staged" },
      { name: "Board crisis notification draft", owner: "CEO Office", status: "staged" },
    ],
    signalTag: "4:23 AM — escalating", warRoomTag: "8:22 elapsed · 22 tasks",
    execTag: "9:47 elapsed · 1 decision", completeTag: "11:43 · OPTIMIZATION", advanceTag: "Protocol #14 updated",
    elapsed: ["—", "—", "—", "—", "—", "8:22", "9:47", "11:43", "11:43"],
    completionTime: "11:43",
    compRows: [
      { metric: "Time to Full Response", readiness: "11 min 43 sec", traditional: "4.2 days (avg)", highlight: true },
      { metric: "Mobilization", readiness: "Pre-staged — no meetings", traditional: "Committee alignment required", highlight: false },
      { metric: "Stakeholder Notification", readiness: "Automatic — 90 seconds", traditional: "Manual cascade (hours)", highlight: false },
      { metric: "Executive Decision", readiness: "1 authorization · 9:47", traditional: "After 2–3 day alignment cycle", highlight: false },
      { metric: "Financial Exposure Window", readiness: "11:43", traditional: "4+ days @ $180K/hr", highlight: true },
    ],
    strip: {
      3: { elapsed: "0:16", readiness: "Signal auto-detected — protocol identifying", trad: "Day 1 · Signal undetected — no human awareness yet" },
      4: { elapsed: "1:04", readiness: "Protocol staged — 22 tasks pre-assigned", trad: "Day 1 · Emergency calls beginning — who owns this?" },
      5: { elapsed: "8:22", readiness: "War room active — 4 executives notified", trad: "Day 2 · Response team still assembling" },
      6: { elapsed: "9:47", readiness: "Executive authorization in progress", trad: "Day 3 · Consultants engaged — scope being negotiated" },
    },
    advanceUpdates: [
      { type: "Sequence", change: "SWIFT alternate routing moved to Task 2 (was Task 6)", impact: "−3 min avg" },
      { type: "New Task", change: "Forensic chain-of-custody added as IMMEDIATE standard", impact: "Compliance" },
      { type: "Threshold", change: "Escalation confidence lowered from 94% to 88%", impact: "Earlier detection" },
    ],
    improvements: 14,
    fearlessLine: "Meridian Financial is no longer afraid of this scenario.",
    timelineWithout: [
      { time: "4:23 AM", event: "Ransomware spreading. No one is watching." },
      { time: "6:00 AM", event: "Admin discovers the issue. Calls begin." },
      { time: "9:00 AM", event: "Emergency call assembled. 14 people, 3 with context." },
      { time: "Day 1", event: "Who owns this response? Still being determined." },
      { time: "Day 3", event: "Consultants engaged. Scope being negotiated." },
      { time: "Day 30+", event: "Exposure window finally closed. Enormous cost." },
    ],
    timelineWith: [
      { time: "4:23 AM", event: "Signal detected. Protocol #14 staged. Brief ready." },
      { time: "4:24:30", event: "4 executives notified with full context and assignments." },
      { time: "4:26 AM", event: "CISO and CTO begin immediate actions." },
      { time: "Minute 8", event: "22 tasks executing across 5 departments." },
      { time: "Minute 9:47", event: "CEO reviews precedents. One decision. Authorized." },
      { time: "11:43", event: "Full response complete. Exposure window closed." },
    ],
    verdictWithout: "30 days of exposure and confusion.",
    verdictWith: "11 minutes, 43 seconds. Same trigger. Different outcome.",
    signalHeadline: "A crisis just started. Nobody woke up yet.",
    signalPlain: "It's 4:23 AM. Ransomware is spreading across trading infrastructure. The platform detected it automatically, matched it to a pattern, and surfaced the right response plan — all before a single human was aware. Watch the exposure counter. Every second of delay has a real dollar cost.",
    protocolPlain: "Protocol #14 was created during a routine preparedness session last October. Every task written. Every person assigned. Nothing is being invented right now — it's being pulled off the shelf. This is the entire point: the work happens before the crisis, not during it.",
  },

  // ── 2: Federal Agency Opens Inquiry ───────────────────────────────────────
  {
    id: 2, domain: "RISK & RESILIENCE", domainColor: "#EF4444",
    label: "Federal Agency Opens Inquiry", moment: "48-hour mandatory response window",
    crisisColor: "#EF4444", crisisIsRed: true,
    riskScore: 88, riskLabel: "HIGH RISK — REGULATORY RESPONSE REQUIRED",
    patternName: "Federal Regulatory Investigation", detectedAt: "8:14 AM",
    showLiveCounter: false, exposureLabel: "Response Deadline — Mandatory Window",
    exposureDisplay: "48 hrs", exposureUnit: "TO RESPOND",
    feed: [
      { t: "8:12 AM", msg: "Federal agency formal inquiry notification received — pricing practices", hi: false },
      { t: "8:13 AM", msg: "General counsel notified — document preservation protocol required", hi: false },
      { t: "8:14 AM", msg: "Threshold exceeded · Regulatory Investigation Pattern matched · Activating Protocol #29", hi: true },
    ],
    protocolId: "#29", protocolName: "DOJ/Regulatory Investigation Response",
    protocolDomain: "Risk & Resilience · Regulatory · Legal",
    tasks: 24, phases: 5, stakeholders: 6, priorActivations: 1,
    phaseNames: ["IMMEDIATE", "PRESERVATION", "COUNSEL", "DISCLOSURE", "CLOSE-OUT"],
    phaseTasks: [5, 4, 5, 6, 4],
    builtDesc: "This protocol was designed during a regulatory preparedness session — not in response to today's inquiry. Outside counsel pre-identified. Document preservation protocol ready. Disclosure decision tree mapped. Everything built before the inquiry arrived.",
    builtDate: "Sep 8, 2025", lastPracticed: "Feb 11, 2026", avgTime: "10m 51s",
    phase1Tasks: [
      { name: "Activate document preservation hold — pricing files", owner: "Legal", status: "complete" },
      { name: "Engage pre-identified outside counsel", owner: "General Counsel", status: "active" },
      { name: "Initiate communications blackout — external statements", owner: "Comms", status: "active" },
      { name: "Prepare board notification — regulatory inquiry", owner: "CEO Office", status: "staged" },
      { name: "Insurance carrier notification — regulatory coverage", owner: "Finance", status: "staged" },
    ],
    signalTag: "8:14 AM — 48-hr window open", warRoomTag: "6:40 elapsed · 24 tasks",
    execTag: "8:12 elapsed · 1 decision", completeTag: "10:51 · OPTIMIZATION", advanceTag: "Protocol #29 updated",
    elapsed: ["—", "—", "—", "—", "—", "6:40", "8:12", "10:51", "10:51"],
    completionTime: "10:51",
    compRows: [
      { metric: "Time to Coordinated Position", readiness: "10 min 51 sec", traditional: "4+ days (avg)", highlight: true },
      { metric: "Document Preservation", readiness: "Pre-staged — activated at trigger", traditional: "Manual scramble — gaps likely", highlight: false },
      { metric: "Outside Counsel Engagement", readiness: "Pre-identified — activated in 90 sec", traditional: "Emergency search, emergency rates", highlight: false },
      { metric: "Executive Decision", readiness: "1 authorization · 8:12", traditional: "After multi-day task force alignment", highlight: false },
      { metric: "Regulator Perception", readiness: "Prepared organization", traditional: "Reactive — signals weakness", highlight: true },
    ],
    strip: {
      3: { elapsed: "0:19", readiness: "Signal detected — Regulatory Investigation Pattern matched", trad: "Day 1 · Inquiry discovered — unclear who owns the response" },
      4: { elapsed: "1:08", readiness: "Protocol #29 staged — 24 tasks pre-assigned", trad: "Day 1 · Emergency call — task force being assembled" },
      5: { elapsed: "6:40", readiness: "6 stakeholders executing — document hold active", trad: "Day 3 · Outside counsel just engaged at emergency rates" },
      6: { elapsed: "8:12", readiness: "Executive authorization in progress", trad: "Day 4 · Position still not aligned — window closes today" },
    },
    advanceUpdates: [
      { type: "Sequence", change: "Outside counsel engagement moved to Task 1 (was Task 4)", impact: "−2 min avg" },
      { type: "New Task", change: "Insurance carrier notification added as IMMEDIATE standard", impact: "Coverage" },
      { type: "Threshold", change: "Regulatory signal pattern expanded to 9 agency types", impact: "Broader coverage" },
    ],
    improvements: 6,
    fearlessLine: "The regulator doesn't see chaos. They see a prepared organization.",
    timelineWithout: [
      { time: "8:12 AM", event: "Federal inquiry arrives. Nobody has a response plan." },
      { time: "10:00 AM", event: "General counsel assembles a task force. Outside counsel search begins." },
      { time: "Day 2", event: "Document hold still being defined. Gaps already exist." },
      { time: "Day 3", event: "Outside counsel engaged at emergency hourly rates." },
      { time: "Day 4", event: "Still no aligned position. 48-hour window closing." },
      { time: "Day 30+", event: "What should have been contained becomes a 30-day mobilization." },
    ],
    timelineWith: [
      { time: "8:14 AM", event: "Signal detected. Protocol #29 staged. Outside counsel pre-identified." },
      { time: "8:15:30", event: "6 stakeholders notified. Document preservation hold activated." },
      { time: "8:17 AM", event: "Outside counsel engaged — pre-negotiated, no emergency rate." },
      { time: "Minute 6:40", event: "24 tasks executing. Disclosure decision tree ready." },
      { time: "Minute 8:12", event: "General counsel reviews precedents. One decision. Authorized." },
      { time: "10:51", event: "Coordinated position complete. Regulator response ready." },
    ],
    verdictWithout: "30 days of reactive confusion. Regulator notices.",
    verdictWith: "10 minutes 51 seconds. Coordinated response ready.",
    signalHeadline: "A federal agency just opened a formal inquiry.",
    signalPlain: "A federal agency has opened a formal inquiry into your pricing practices. You have 48 hours to respond. Finance, Legal, Operations, and Communications all need to be aligned before anyone says anything publicly. The platform detected the signal, matched it to Protocol #29, and staged the complete response — before a single meeting was called.",
    protocolPlain: "Protocol #29 was designed during a regulatory preparedness session before any inquiry arrived. Outside counsel pre-identified. Document preservation protocol ready. Disclosure decision tree mapped. Board notification drafted. All of it pre-built so that when today happened, the organization was already ready.",
  },

  // ── 3: Activist Investor 13D Filing ───────────────────────────────────────
  {
    id: 3, domain: "RISK & RESILIENCE", domainColor: GOLD,
    label: "Activist Investor 13D Filing", moment: "20 min ago — board call tonight",
    crisisColor: GOLD, crisisIsRed: false,
    riskScore: 86, riskLabel: "HIGH — ACTIVIST ENGAGEMENT PROTOCOL TRIGGERED",
    patternName: "Activist Investor 13D Disclosure", detectedAt: "7:24 AM",
    showLiveCounter: false, exposureLabel: "Response Window — Board Call Tonight",
    exposureDisplay: "4 hrs", exposureUnit: "TO BOARD CALL",
    feed: [
      { t: "7:22 AM", msg: "SEC 13D filing detected — 8.7% stake disclosed, two board seats demanded", hi: false },
      { t: "7:23 AM", msg: "Strategic review demand confirmed — institutional investors already calling IR", hi: false },
      { t: "7:24 AM", msg: "Threshold exceeded · Activist Investor Pattern matched · Activating Protocol #7", hi: true },
    ],
    protocolId: "#7", protocolName: "Activist Investor Response",
    protocolDomain: "Risk & Resilience · Board Defense · Governance",
    tasks: 19, phases: 4, stakeholders: 5, priorActivations: 1,
    phaseNames: ["IMMEDIATE", "BOARD DEFENSE", "INSTITUTIONAL IR", "CLOSE-OUT"],
    phaseTasks: [4, 6, 6, 3],
    builtDesc: "This protocol was designed before any activist ever filed. Shareholder communication approved. Poison pill analysis ready. Board presentation built. Key institutional investor outreach pre-staged. Defensive positioning pre-authorized.",
    builtDate: "Dec 3, 2025", lastPracticed: "Apr 17, 2026", avgTime: "10m 18s",
    phase1Tasks: [
      { name: "Activate shareholder communication hold — no unauthorized statements", owner: "Comms", status: "complete" },
      { name: "Brief board on 13D filing and pre-staged response", owner: "CEO Office", status: "active" },
      { name: "Engage pre-identified investment banker", owner: "CFO", status: "active" },
      { name: "Pull top 20 institutional investor contact list", owner: "IR", status: "staged" },
      { name: "Prepare board call materials — pre-staged response presentation", owner: "Strategy", status: "staged" },
    ],
    signalTag: "7:24 AM — board call tonight", warRoomTag: "5:30 elapsed · 19 tasks",
    execTag: "7:44 elapsed · 1 decision", completeTag: "10:18 · OPTIMIZATION", advanceTag: "Protocol #7 updated",
    elapsed: ["—", "—", "—", "—", "—", "5:30", "7:44", "10:18", "10:18"],
    completionTime: "10:18",
    compRows: [
      { metric: "Board Call Readiness", readiness: "10 min 18 sec", traditional: "3+ days of prep (avg)", highlight: true },
      { metric: "Mobilization", readiness: "Pre-staged — no scramble", traditional: "Investment banker search begins", highlight: false },
      { metric: "IR Stakeholder Notification", readiness: "Automatic — 90 seconds", traditional: "Manual — calls starting hours later", highlight: false },
      { metric: "Executive Decision", readiness: "1 authorization · 7:44", traditional: "After 2–3 day executive alignment", highlight: false },
      { metric: "Activist Advantage of Surprise", readiness: "Eliminated — response pre-built", traditional: "Activist looks more prepared than management", highlight: true },
    ],
    strip: {
      3: { elapsed: "0:20", readiness: "Signal detected — Activist 13D Pattern matched", trad: "Day 1 · Filing discovered by IR team, unclear who leads response" },
      4: { elapsed: "1:10", readiness: "Protocol #7 staged — 19 tasks pre-assigned", trad: "Day 1 · Investment bankers being called at emergency rates" },
      5: { elapsed: "5:30", readiness: "5 stakeholders executing — board materials ready", trad: "Day 2 · Board presentation being built from scratch" },
      6: { elapsed: "7:44", readiness: "Executive authorization in progress", trad: "Day 3 · IR fielding calls with no approved messaging" },
    },
    advanceUpdates: [
      { type: "Sequence", change: "Investment banker briefing moved to Task 2 (was Task 5)", impact: "−2 min avg" },
      { type: "New Task", change: "Proxy advisory firm pre-engagement added as IMMEDIATE standard", impact: "Vote defense" },
      { type: "Threshold", change: "Stake disclosure threshold lowered from 5% to 4.9%", impact: "Earlier detection" },
    ],
    improvements: 7,
    fearlessLine: "The activist thought they had the advantage of surprise. They didn't.",
    timelineWithout: [
      { time: "7:22 AM", event: "13D hits the wire. No response plan exists." },
      { time: "8:00 AM", event: "IR team sees the filing. Who calls the board?" },
      { time: "10:00 AM", event: "Investment bankers engaged at emergency rates. Board scrambling." },
      { time: "Day 2", event: "Board presentation being built. IR fielding calls with no messaging." },
      { time: "Day 3", event: "CEO making statements before Legal has signed off." },
      { time: "Day 7+", event: "Narrative inconsistent. Activist looks more prepared than management." },
    ],
    timelineWith: [
      { time: "7:24 AM", event: "Signal detected. Protocol #7 staged. Board defense pre-built." },
      { time: "7:25:30", event: "5 stakeholders notified. Pre-identified banker engaged." },
      { time: "7:27 AM", event: "Shareholder communication hold active. Approved messaging ready." },
      { time: "Minute 5:30", event: "19 tasks live. Board call materials ready for authorization." },
      { time: "Minute 7:44", event: "CEO reviews precedents. One decision. Authorized." },
      { time: "10:18", event: "Board walks into the call with a fully staged response." },
    ],
    verdictWithout: "7 days of scramble. Activist controls the narrative.",
    verdictWith: "10 minutes 18 seconds. Board walks in prepared.",
    signalHeadline: "An activist just filed. Your board response was already built.",
    signalPlain: "An activist investor just disclosed an 8.7% stake. They're demanding two board seats and a strategic review. It hit the wire 20 minutes ago. Your stock is moving. Institutional investors are calling your IR team. The board wants a call tonight. The platform detected the 13D, matched it to Protocol #7, and staged the complete board defense — before a single banker was called.",
    protocolPlain: "Protocol #7 was designed before any activist ever filed. Shareholder communication approved. Poison pill analysis ready. Board presentation built. Key institutional investor outreach pre-staged. All of it pre-built so that when today happened, the organization walked into the board call prepared — not scrambling.",
  },

  // ── 4: Second Largest Customer ─────────────────────────────────────────────
  {
    id: 4, domain: "GROWTH & POSITIONING", domainColor: GOLD,
    label: "Your Second Largest Customer", moment: "Meeting request — no agenda",
    crisisColor: GOLD, crisisIsRed: false,
    riskScore: 76, riskLabel: "HIGH — ACCOUNT RETENTION RISK THRESHOLD",
    patternName: "Major Account Churn Signal", detectedAt: "2:17 PM",
    showLiveCounter: false, exposureLabel: "Annual Revenue at Risk",
    exposureDisplay: "$3.8M", exposureUnit: "ARR AT RISK",
    feed: [
      { t: "2:14 PM", msg: "Account health score crossed threshold — 3-month usage decline confirmed", hi: false },
      { t: "2:16 PM", msg: "Competitor engagement signal detected — active evaluation in progress", hi: false },
      { t: "2:17 PM", msg: "Threshold exceeded · Account Churn Pattern matched · Activating Protocol #47", hi: true },
    ],
    protocolId: "#47", protocolName: "Account Retention Response",
    protocolDomain: "Growth & Positioning · Customer Success · Revenue",
    tasks: 16, phases: 4, stakeholders: 5, priorActivations: 3,
    phaseNames: ["IMMEDIATE", "INTELLIGENCE", "ENGAGEMENT", "RETENTION"],
    phaseTasks: [4, 4, 5, 3],
    builtDesc: "This protocol was designed long before this meeting request. Four complete retention paths pre-staged: relationship recovery, competitive displacement counter, executive sponsorship activation, commercial restructuring options. All pre-built, ready to deploy.",
    builtDate: "Aug 20, 2025", lastPracticed: "Jan 14, 2026", avgTime: "8m 42s",
    phase1Tasks: [
      { name: "Pull full account health and usage data — last 90 days", owner: "CS Ops", status: "complete" },
      { name: "Identify competitive displacement signals — internal intelligence", owner: "Sales", status: "active" },
      { name: "Stage executive sponsorship activation — VP and above", owner: "CEO Office", status: "active" },
      { name: "Prepare commercial restructuring options for authorization", owner: "Finance", status: "staged" },
      { name: "Brief account executive on approved retention strategy", owner: "Sales", status: "staged" },
    ],
    signalTag: "2:17 PM — meeting w/o agenda", warRoomTag: "3:58 elapsed · 16 tasks",
    execTag: "5:14 elapsed · 1 decision", completeTag: "8:42 · OPTIMIZATION", advanceTag: "Protocol #47 updated",
    elapsed: ["—", "—", "—", "—", "—", "3:58", "5:14", "8:42", "8:42"],
    completionTime: "8:42",
    compRows: [
      { metric: "Time to Retention Strategy Ready", readiness: "8 min 42 sec", traditional: "5+ days to alignment", highlight: true },
      { metric: "Intelligence Gathering", readiness: "Pre-staged — signal triggered", traditional: "Reactive — account team scrambling", highlight: false },
      { metric: "Executive Sponsorship", readiness: "Pre-authorized — activated in 90 sec", traditional: "Debated for days before agreement", highlight: false },
      { metric: "Executive Decision", readiness: "1 authorization · 5:14", traditional: "Multiple approval layers, discount debate", highlight: false },
      { metric: "Meeting Dynamic", readiness: "Walk in prepared — customer sees readiness", traditional: "Customer feels the scramble — confirms their doubts", highlight: true },
    ],
    strip: {
      3: { elapsed: "0:17", readiness: "Signal detected — Major Account Churn Pattern matched", trad: "Day 1 · Account team learning about meeting — no strategy yet" },
      4: { elapsed: "1:02", readiness: "Protocol #47 staged — 16 tasks pre-assigned", trad: "Day 2 · Deck being built, finance modeling discount impact" },
      5: { elapsed: "3:58", readiness: "5 stakeholders executing — retention paths staged", trad: "Day 3 · Leadership still debating whether to offer a discount" },
      6: { elapsed: "5:14", readiness: "Executive authorization in progress", trad: "Day 5 · Meeting happens before strategy is agreed on" },
    },
    advanceUpdates: [
      { type: "Sequence", change: "Competitive intelligence gathering moved to Task 1 (was Task 3)", impact: "−1 min avg" },
      { type: "New Task", change: "Executive sponsorship outreach added as IMMEDIATE for Tier-1 accounts", impact: "Retention" },
      { type: "Threshold", change: "Account health alert threshold lowered — earlier signal detection", impact: "More lead time" },
    ],
    improvements: 9,
    fearlessLine: "The customer doesn't see a vendor fighting to keep them. They see an organization that was already prepared for this conversation.",
    timelineWithout: [
      { time: "2:14 PM", event: "Account health declining for 3 months. No signal detected." },
      { time: "2:17 PM", event: "Meeting request arrives. Account team scrambling." },
      { time: "Day 2", event: "Finance modeling what losing this customer means to the quarter." },
      { time: "Day 3", event: "Leadership debating whether to offer a discount." },
      { time: "Day 5", event: "Meeting happens. No agreed retention strategy. Customer feels it." },
      { time: "Day 30+", event: "Customer churns. It confirmed what they already suspected." },
    ],
    timelineWith: [
      { time: "2:17 PM", event: "Signal detected. Protocol #47 staged. 4 retention paths ready." },
      { time: "2:18:30", event: "5 stakeholders notified with full account context and assignments." },
      { time: "2:20 PM", event: "Account team briefed — approved strategy, no improvisation." },
      { time: "Minute 3:58", event: "16 tasks live. Commercial options ready for executive review." },
      { time: "Minute 5:14", event: "VP reviews precedents. One decision. Authorized." },
      { time: "8:42", event: "Retention strategy deployed. Walk into the meeting prepared." },
    ],
    verdictWithout: "30 days of scramble. Customer churns.",
    verdictWith: "8 minutes 42 seconds. Walk into the meeting prepared.",
    signalHeadline: "Your second largest customer asked for a meeting with no agenda.",
    signalPlain: "Usage has been declining for 3 months. Contract renews in 60 days. Your account team just told you they've been talking to your primary competitor. The meeting request with no agenda is the warning shot. The platform detected the signal, matched it to Protocol #47, and staged four complete retention paths — before the account team finished reading the email.",
    protocolPlain: "Protocol #47 was designed long before this meeting request. Relationship recovery. Competitive displacement counter. Executive sponsorship activation. Commercial restructuring options. All four paths pre-built, pre-authorized, ready to deploy the moment the signal crossed the threshold. Not assembled the week of the meeting.",
  },
];

const ScenarioCtx = createContext<ScenarioData>(DEMO_SCENARIOS[1]);

// ─── Shared UI helpers ────────────────────────────────────────────────────────
function StatusDot({ color, pulse }: { color: string; pulse?: boolean }) {
  return (
    <span style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", width: 10, height: 10, flexShrink: 0 }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, display: "block" }} />
      {pulse && <span style={{ position: "absolute", width: 16, height: 16, borderRadius: "50%", border: `1px solid ${color}`, opacity: 0.4, animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite" }} />}
    </span>
  );
}
function Pill({ children, color, bg }: { children: React.ReactNode; color: string; bg: string }) {
  return <span style={{ ...BC, display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", background: bg, border: `1px solid ${color}33`, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color, borderRadius: "0.15rem", whiteSpace: "nowrap" as const }}>{children}</span>;
}
function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ background: NAVY_CARD, border: `1px solid ${BORDER}`, padding: "18px 22px", borderRadius: "0.15rem", ...style }}>{children}</div>;
}
function Label({ children, color }: { children: React.ReactNode; color?: string }) {
  return <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: color || GOLD, marginBottom: 8 }}>{children}</div>;
}

function ContextBanner({ step, phaseColor }: { step: number; phaseColor: string }) {
  const sc = useContext(ScenarioCtx);
  const ctx = STEP_CONTEXT[step];
  if (!ctx) return null;
  const isResponsePhase = [3, 4, 5, 6].includes(step);
  const isComplete = step === 7;
  const headline = step === 3 ? sc.signalHeadline : ctx.headline;
  const plain = step === 3 ? sc.signalPlain : step === 4 ? sc.protocolPlain : ctx.plain;
  const cc = sc.crisisColor;

  if (isResponsePhase) {
    return (
      <div style={{ background: `${cc}15`, border: `1px solid ${cc}45`, borderLeft: `5px solid ${cc}`, borderRadius: "0.15rem", padding: "22px 26px", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <StatusDot color={cc} pulse />
          <span style={{ ...BC, fontSize: 9, fontWeight: 700, color: cc, letterSpacing: "0.16em", textTransform: "uppercase" as const }}>
            {sc.crisisIsRed ? "Crisis In Progress" : "Protocol Active"} · Protocol {sc.protocolId} · {sc.patternName}
          </span>
        </div>
        <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: "#fff", lineHeight: 1.25, marginBottom: 12 }}>{headline}</div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.88)", lineHeight: 1.8 }}>{plain}</div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div style={{ background: `${GOLD}0e`, border: `1px solid ${GOLD}45`, borderLeft: `5px solid ${GOLD}`, borderRadius: "0.15rem", padding: "22px 26px", marginBottom: 20 }}>
        <div style={{ ...BC, fontSize: 9, fontWeight: 700, color: GOLD, letterSpacing: "0.16em", textTransform: "uppercase" as const, marginBottom: 14 }}>Response Complete · Exposure Window Closed</div>
        <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: "#fff", lineHeight: 1.25, marginBottom: 12 }}>{ctx.headline}</div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.88)", lineHeight: 1.8 }}>{ctx.plain}</div>
      </div>
    );
  }

  return (
    <div style={{ background: `${phaseColor}0c`, border: `1px solid ${phaseColor}35`, borderLeft: `5px solid ${phaseColor}`, borderRadius: "0.15rem", padding: "22px 26px", marginBottom: 20 }}>
      <div style={{ ...CG, fontSize: 26, fontWeight: 700, color: "#fff", lineHeight: 1.3, marginBottom: 12 }}>{ctx.headline}</div>
      <div style={{ fontSize: 14, color: "rgba(255,255,255,0.88)", lineHeight: 1.8 }}>{ctx.plain}</div>
    </div>
  );
}

// ─── Step panels ──────────────────────────────────────────────────────────────

function PanelCommandCenter() {
  const kpis = [
    { val: "87", unit: "%", label: "Readiness Score", color: TEAL, sub: "+2.4% vs last week" },
    { val: "3", unit: "", label: "Signals Today", color: GOLD, sub: "All LOW risk" },
    { val: "180", unit: "", label: "Protocols Ready", color: "#A78BFA", sub: "Pre-staged" },
    { val: "11:47", unit: "", label: "Avg Response", color: "#fff", sub: "Below 12-min target" },
  ];
  const domains = [
    { name: "Growth & Positioning", status: "MONITORING", color: TEAL, signals: 1 },
    { name: "Risk & Resilience", status: "MONITORING", color: TEAL, signals: 2 },
    { name: "Transformation", status: "QUIET", color: MUTED, signals: 0 },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ background: `${TEAL}10`, border: `1px solid ${TEAL}30`, padding: "10px 18px", borderRadius: "0.15rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <StatusDot color={TEAL} pulse />
          <span style={{ ...BC, fontSize: 11, fontWeight: 700, color: TEAL, letterSpacing: "0.1em", textTransform: "uppercase" as const }}>System Active · Continuous Monitoring</span>
        </div>
        <span style={{ ...BC, fontSize: 11, color: MUTED }}>Monday · 6:47 AM</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
        {kpis.map(k => (
          <Card key={k.label} style={{ padding: "14px 16px", textAlign: "center" as const }}>
            <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: k.color, lineHeight: 1 }}>{k.val}<span style={{ fontSize: 16 }}>{k.unit}</span></div>
            <div style={{ ...BC, fontSize: 9, fontWeight: 700, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase" as const, margin: "6px 0 4px" }}>{k.label}</div>
            <div style={{ fontSize: 10, color: MUTED }}>{k.sub}</div>
          </Card>
        ))}
      </div>

      <Card>
        <Label>Domain Status</Label>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {domains.map(d => (
            <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "rgba(255,255,255,0.02)", border: `1px solid ${BORDER}`, borderRadius: "0.15rem" }}>
              <StatusDot color={d.color} pulse={d.status === "MONITORING"} />
              <span style={{ fontSize: 12, color: "#fff", flex: 1 }}>{d.name}</span>
              <Pill color={d.color} bg={`${d.color}12`}>{d.status}</Pill>
              <span style={{ ...BC, fontSize: 10, color: MUTED }}>{d.signals} signal{d.signals !== 1 ? "s" : ""}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card style={{ padding: "14px 22px" }}>
        <Label>Live Signal Feed</Label>
        {[
          { t: "6:31 AM", msg: "Market Dynamics · ArXiv research velocity — new AI publications surge", risk: "LOW" },
          { t: "4:52 AM", msg: "Regulatory · SEC comment period extended for fintech rule 17a-4", risk: "LOW" },
          { t: "2:14 AM", msg: "Competitive · Salesforce pricing adjustment announced — mid-market", risk: "LOW" },
        ].map((e, i) => (
          <div key={i} style={{ display: "flex", gap: 12, padding: "8px 0", borderBottom: i < 2 ? `1px solid ${BORDER}` : "none", alignItems: "flex-start" }}>
            <span style={{ ...BC, fontSize: 10, color: MUTED, flexShrink: 0, width: 60, paddingTop: 1 }}>{e.t}</span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.82)", flex: 1, lineHeight: 1.5 }}>{e.msg}</span>
            <Pill color={TEAL} bg={`${TEAL}10`}>{e.risk}</Pill>
          </div>
        ))}
      </Card>
    </div>
  );
}

function PanelTriggerPortfolio() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div>
            <Label>Your Trigger Portfolio</Label>
            <div style={{ fontSize: 12, color: MUTED }}>47 active monitors · 231 available trigger patterns</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: "rgba(255,255,255,0.04)", border: `1px solid ${BORDER}`, borderRadius: "0.15rem" }}>
              <Search size={11} color={MUTED.toString()} />
              <span style={{ ...BC, fontSize: 10, color: MUTED }}>Search 231 patterns…</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: `${TEAL}18`, border: `1px solid ${TEAL}40`, borderRadius: "0.15rem", cursor: "pointer" }}>
              <PlusCircle size={11} color={TEAL} />
              <span style={{ ...BC, fontSize: 10, fontWeight: 700, color: TEAL }}>Add Trigger</span>
            </div>
          </div>
        </div>

        {TRIGGER_PORTFOLIO.map(group => (
          <div key={group.priority} style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <StatusDot color={group.color} />
              <span style={{ ...BC, fontSize: 10, fontWeight: 700, color: group.color, letterSpacing: "0.12em", textTransform: "uppercase" as const }}>{group.priority} PRIORITY</span>
              <span style={{ ...BC, fontSize: 10, color: MUTED }}>· {group.items.length} triggers</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {group.items.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 14px", background: item.active ? `${group.color}08` : "rgba(255,255,255,0.02)", border: `1px solid ${item.active ? group.color + "40" : BORDER}`, borderRadius: "0.15rem" }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: group.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: item.active ? "#fff" : "rgba(255,255,255,0.7)", flex: 1, fontWeight: item.active ? 500 : 400 }}>{item.name}</span>
                  <span style={{ fontSize: 10, color: MUTED, flexShrink: 0 }}>{item.domain}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 8px", background: NAVY_MID, border: `1px solid ${BORDER}`, borderRadius: "0.15rem" }}>
                    <ArrowRight size={10} color={MUTED.toString()} />
                    <span style={{ ...BC, fontSize: 10, fontWeight: 700, color: item.active ? group.color : MUTED }}>Protocol {item.protocol}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Card>

      <div style={{ background: `${GOLD}0d`, border: `1px solid ${GOLD}30`, padding: "12px 18px", borderRadius: "0.15rem", display: "flex", gap: 12, alignItems: "flex-start" }}>
        <Settings size={16} color={GOLD} style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <div style={{ ...BC, fontSize: 10, fontWeight: 700, color: GOLD, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 4 }}>How Triggers Are Configured</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", lineHeight: 1.6 }}>Each trigger has a <strong style={{ color: "#fff" }}>threshold</strong> (how many signal confirmations before escalating), a <strong style={{ color: "#fff" }}>mapped protocol</strong> (which response deploys), and a <strong style={{ color: "#fff" }}>priority tier</strong> (how urgently the executive is notified). You configure once. The system monitors continuously.</div>
        </div>
      </div>
    </div>
  );
}

function PanelProtocolLibrary() {
  const sc = useContext(ScenarioCtx);
  const defaultDomain = PROTOCOL_DOMAINS.findIndex(d => d.protocols.some(p => p.id === sc.protocolId));
  const [activeDomain, setActiveDomain] = useState(defaultDomain >= 0 ? defaultDomain : 0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {PROTOCOL_DOMAINS.map((d, idx) => (
          <Card key={d.name} style={{ padding: "14px 16px", cursor: "pointer", border: `1px solid ${idx === activeDomain ? d.color + "60" : BORDER}`, background: idx === activeDomain ? `${d.color}08` : NAVY_CARD }} onClick={() => setActiveDomain(idx)}>
            <div style={{ ...BC, fontSize: 9, fontWeight: 700, color: d.color, letterSpacing: "0.12em", textTransform: "uppercase" as const, marginBottom: 8 }}>{d.name}</div>
            <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: "#fff" }}>{d.count}</div>
            <div style={{ ...BC, fontSize: 9, color: MUTED, marginTop: 2 }}>Protocols ready</div>
          </Card>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0" }}>
        <Search size={13} color={MUTED.toString()} />
        <span style={{ fontSize: 12, color: MUTED }}>Search 180 protocols… try "supply chain," "activist," "ransomware," "IPO"</span>
      </div>

      <Card>
        <Label color={PROTOCOL_DOMAINS[activeDomain].color}>{PROTOCOL_DOMAINS[activeDomain].name} — Protocols</Label>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {PROTOCOL_DOMAINS[activeDomain].protocols.map((p, i) => {
            const isActive = p.id === sc.protocolId;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", background: isActive ? `${GOLD}0c` : "rgba(255,255,255,0.02)", border: `1px solid ${isActive ? GOLD + "50" : BORDER}`, borderRadius: "0.15rem" }}>
                <span style={{ ...BC, fontSize: 11, fontWeight: 700, color: isActive ? GOLD : MUTED, flexShrink: 0, width: 36 }}>{p.id}</span>
                <span style={{ fontSize: 12, color: isActive ? "#fff" : "rgba(255,255,255,0.75)", flex: 1, fontWeight: isActive ? 500 : 400 }}>{p.name}</span>
                <Pill color={isActive ? GOLD : TEAL} bg={isActive ? `${GOLD}15` : `${TEAL}12`}>{isActive ? "← Active in demo" : p.tag}</Pill>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: MUTED }}>Showing 4 of {PROTOCOL_DOMAINS[activeDomain].count} protocols in this domain</span>
          <ChevronRight size={12} color={MUTED.toString()} />
          <span style={{ ...BC, fontSize: 10, fontWeight: 600, color: TEAL, cursor: "pointer" }}>View all →</span>
        </div>
      </Card>

      <div style={{ background: `${TEAL}10`, border: `1px solid ${TEAL}30`, padding: "12px 18px", borderRadius: "0.15rem", display: "flex", gap: 10, alignItems: "center" }}>
        <BookOpen size={15} color={TEAL} style={{ flexShrink: 0 }} />
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.88)", lineHeight: 1.5 }}>Every protocol is <strong style={{ color: "#fff" }}>complete before it's needed</strong> — tasks, owners, decision gates, and stakeholder lists. When a trigger fires, you activate, not build.</span>
      </div>
    </div>
  );
}

function PanelSignal() {
  const sc = useContext(ScenarioCtx);
  const [liveExposure, setLiveExposure] = useState(0);
  useEffect(() => {
    if (!sc.showLiveCounter) return;
    const t = setInterval(() => setLiveExposure(prev => prev + 50), 1000);
    return () => clearInterval(t);
  }, [sc.showLiveCounter]);
  const cc = sc.crisisColor;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ background: `${cc}10`, border: `1px solid ${cc}40`, padding: "14px 20px", borderRadius: "0.15rem", display: "flex", alignItems: "center", gap: 12 }}>
        <StatusDot color={cc} pulse />
        <div style={{ flex: 1 }}>
          <div style={{ ...BC, fontSize: 11, fontWeight: 700, color: cc, letterSpacing: "0.1em", textTransform: "uppercase" as const }}>{sc.riskLabel}</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.82)", marginTop: 2 }}>3 of 3 confirmation patterns matched · Trigger portfolio match: {sc.patternName}</div>
        </div>
        <div style={{ ...BC, fontSize: 22, fontWeight: 700, color: cc }}>{sc.riskScore}</div>
      </div>

      <div style={{ background: `${cc}08`, border: `1px solid ${cc}30`, padding: "16px 20px", borderRadius: "0.15rem", display: "flex", alignItems: "center", gap: 16 }}>
        <DollarSign size={22} color={cc} style={{ flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ ...BC, fontSize: 9, fontWeight: 700, color: cc, letterSpacing: "0.14em", textTransform: "uppercase" as const, marginBottom: 4 }}>{sc.exposureLabel}</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ ...CG, fontSize: 32, fontWeight: 700, color: cc, lineHeight: 1 }}>
              {sc.showLiveCounter ? `$${liveExposure.toLocaleString()}` : sc.exposureDisplay}
            </span>
            <span style={{ ...BC, fontSize: 10, color: cc, fontWeight: 600, opacity: 0.8 }}>{sc.exposureUnit}</span>
          </div>
        </div>
        {sc.showLiveCounter && (
          <div style={{ textAlign: "right" as const, flexShrink: 0 }}>
            <div style={{ ...BC, fontSize: 10, color: MUTED, letterSpacing: "0.06em" }}>$180,000 / hour</div>
            <div style={{ ...BC, fontSize: 10, color: MUTED }}>industry benchmark</div>
            <div style={{ ...BC, fontSize: 11, fontWeight: 700, color: TEAL, marginTop: 4 }}>Readiness OS: closes in 12 min</div>
          </div>
        )}
      </div>

      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <Label>Trigger Pattern Matched</Label>
            <div style={{ ...CG, fontSize: 20, fontWeight: 600, color: "#fff", marginBottom: 4 }}>{sc.patternName}</div>
            <div style={{ fontSize: 12, color: MUTED }}>Detected: {sc.detectedAt}</div>
          </div>
          <Pill color={cc} bg={`${cc}18`}>High Risk</Pill>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16, paddingTop: 16, borderTop: `1px solid ${BORDER}` }}>
          {[
            { label: "Detected At", val: sc.detectedAt },
            { label: "Signal Confidence", val: `${sc.riskScore}%` },
            { label: "Patterns Matched", val: "3 / 3" },
          ].map(s => (
            <div key={s.label}>
              <div style={{ ...BC, fontSize: 9, fontWeight: 700, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 4 }}>{s.label}</div>
              <div style={{ ...BC, fontSize: 16, fontWeight: 700, color: "#fff" }}>{s.val}</div>
            </div>
          ))}
        </div>
        <div style={{ background: `${TEAL}08`, border: `1px solid ${TEAL}33`, padding: "12px 16px", borderRadius: "0.15rem", display: "flex", alignItems: "center", gap: 10 }}>
          <CheckCircle size={14} color={TEAL} />
          <div>
            <span style={{ ...BC, fontSize: 10, fontWeight: 700, color: TEAL, letterSpacing: "0.08em" }}>PROTOCOL MATCH</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", marginLeft: 10 }}>Protocol {sc.protocolId} — {sc.protocolName} · Pre-staged</span>
          </div>
        </div>
      </Card>

      <Card style={{ padding: "14px 20px" }}>
        <Label>Signal Feed — Escalation Sequence</Label>
        {sc.feed.map((e, i) => (
          <div key={i} style={{ display: "flex", gap: 12, padding: "7px 0", borderBottom: i < sc.feed.length - 1 ? `1px solid ${BORDER}` : "none", alignItems: "flex-start" }}>
            <span style={{ ...BC, fontSize: 10, color: MUTED, flexShrink: 0, paddingTop: 2, width: 80 }}>{e.t}</span>
            <span style={{ fontSize: 12, color: e.hi ? GOLD : "rgba(255,255,255,0.82)", fontWeight: e.hi ? 600 : 400 }}>{e.msg}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

function PanelProtocol() {
  const sc = useContext(ScenarioCtx);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <Pill color={TEAL} bg={`${TEAL}18`}>Pre-Staged</Pill>
              <Pill color={GOLD} bg={`${GOLD}15`}>Protocol {sc.protocolId}</Pill>
            </div>
            <div style={{ ...CG, fontSize: 22, fontWeight: 600, color: "#fff", marginBottom: 4 }}>{sc.protocolName}</div>
            <div style={{ fontSize: 12, color: MUTED }}>{sc.protocolDomain}</div>
          </div>
          <Shield size={26} color={TEAL} style={{ opacity: 0.7, flexShrink: 0 }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, paddingTop: 16, borderTop: `1px solid ${BORDER}` }}>
          {[
            { label: "Tasks", val: String(sc.tasks) },
            { label: "Phases", val: String(sc.phases) },
            { label: "Stakeholders", val: String(sc.stakeholders) },
            { label: "Prior Activations", val: String(sc.priorActivations) },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ ...CG, fontSize: 24, fontWeight: 700, color: GOLD }}>{s.val}</div>
              <div style={{ ...BC, fontSize: 9, fontWeight: 700, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </Card>

      <div style={{ background: `${TEAL}10`, border: `1px solid ${TEAL}40`, padding: "14px 20px", borderRadius: "0.15rem" }}>
        <div style={{ ...BC, fontSize: 10, fontWeight: 700, color: TEAL, letterSpacing: "0.12em", textTransform: "uppercase" as const, marginBottom: 6 }}>Built Before This Moment · {sc.builtDate}</div>
        <div style={{ ...CG, fontSize: 16, color: "#fff", lineHeight: 1.5 }}>{sc.builtDesc}</div>
      </div>

      <Card>
        <Label>Execution Phases</Label>
        <div style={{ display: "flex", gap: 0 }}>
          {sc.phaseNames.map((ph, i) => (
            <div key={ph} style={{ flex: 1, textAlign: "center", padding: "10px 4px", background: i === 0 ? `${TEAL}18` : "transparent", border: `1px solid ${i === 0 ? TEAL + "40" : BORDER}`, marginLeft: i > 0 ? -1 : 0 }}>
              <div style={{ ...BC, fontSize: 9, fontWeight: 700, color: i === 0 ? TEAL : MUTED, letterSpacing: "0.08em", textTransform: "uppercase" as const }}>{ph}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.65)", marginTop: 3 }}>{sc.phaseTasks[i]} tasks</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
          <span style={{ ...BC, fontSize: 10, color: MUTED }}>Created: {sc.builtDate}</span>
          <span style={{ ...BC, fontSize: 10, color: MUTED }}>Last practiced: {sc.lastPracticed}</span>
          <span style={{ ...BC, fontSize: 10, color: TEAL, fontWeight: 600 }}>Avg: {sc.avgTime}</span>
        </div>
      </Card>
    </div>
  );
}

function PanelWarRoom() {
  const sc = useContext(ScenarioCtx);
  const statusCfg = { acknowledged: { color: TEAL, label: "Acknowledged" }, notified: { color: GOLD, label: "Notified" }, pending: { color: MUTED, label: "Pending" } };
  const taskCfg = { complete: { color: TEAL, icon: <CheckCircle size={13} /> }, active: { color: GOLD, icon: <Loader2 size={13} /> }, staged: { color: MUTED as unknown as string, icon: <Circle size={13} /> } };
  const doneCount = sc.phase1Tasks.filter(t => t.status === "complete").length;
  const activeCount = sc.phase1Tasks.filter(t => t.status === "active").length;
  const stagedCount = sc.phase1Tasks.filter(t => t.status === "staged").length;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ background: `${TEAL}12`, border: `1px solid ${TEAL}35`, padding: "12px 20px", borderRadius: "0.15rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <StatusDot color={TEAL} pulse />
          <span style={{ ...BC, fontSize: 11, fontWeight: 700, color: TEAL, letterSpacing: "0.1em", textTransform: "uppercase" as const }}>Execution In Progress</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Clock size={13} color={GOLD} />
          <span style={{ ...CG, fontSize: 22, fontWeight: 700, color: GOLD }}>{sc.elapsed[5]}</span>
          <span style={{ ...BC, fontSize: 10, color: MUTED }}>ELAPSED</span>
        </div>
      </div>
      <Card style={{ padding: "14px 18px" }}>
        <Label>Stakeholder Status</Label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {STAKEHOLDERS.map(s => {
            const cfg = statusCfg[s.status];
            return (
              <div key={s.role} style={{ padding: "10px 8px", background: "rgba(255,255,255,0.02)", border: `1px solid ${BORDER}`, borderRadius: "0.15rem", textAlign: "center" }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: NAVY_MID, border: `2px solid ${cfg.color}50`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 6px" }}>
                  <span style={{ ...BC, fontSize: 10, fontWeight: 700, color: "#fff" }}>{s.initials}</span>
                </div>
                <div style={{ ...BC, fontSize: 9, fontWeight: 700, color: "#fff", letterSpacing: "0.04em", marginBottom: 3 }}>{s.role}</div>
                <div style={{ ...BC, fontSize: 9, color: cfg.color, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const }}>{cfg.label}</div>
                <div style={{ fontSize: 10, color: MUTED, marginTop: 2 }}>{s.time}</div>
              </div>
            );
          })}
        </div>
      </Card>
      <Card style={{ padding: "14px 18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <Label>Phase 1 — Immediate Actions</Label>
          <span style={{ ...BC, fontSize: 10, color: MUTED }}>{doneCount} done · {activeCount} active · {stagedCount} staged</span>
        </div>
        {sc.phase1Tasks.map((t, i) => {
          const cfg = taskCfg[t.status];
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: i < sc.phase1Tasks.length - 1 ? `1px solid ${BORDER}` : "none" }}>
              <span style={{ color: cfg.color, flexShrink: 0, width: 14 }}>{cfg.icon}</span>
              <span style={{ fontSize: 12, color: t.status === "staged" ? MUTED : "#fff", flex: 1, textDecoration: t.status === "complete" ? "line-through" : "none" }}>{t.name}</span>
              <span style={{ ...BC, fontSize: 10, color: MUTED, flexShrink: 0, width: 76, textAlign: "right" as const }}>{t.owner}</span>
            </div>
          );
        })}
      </Card>
    </div>
  );
}

function PanelAuthorize({ onAuthorize, authorizing }: { onAuthorize: () => void; authorizing: boolean }) {
  const sc = useContext(ScenarioCtx);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ ...BC, fontSize: 10, fontWeight: 700, color: GOLD, letterSpacing: "0.14em", textTransform: "uppercase" as const, marginBottom: 2 }}>Executive Authorization Required</div>
          <div style={{ fontSize: 12, color: MUTED }}>Elapsed: <strong style={{ color: GOLD }}>{sc.elapsed[6]}</strong> · Protocol {sc.protocolId} — Meridian Financial Group</div>
        </div>
      </div>
      <Card>
        <Label>Authorization Precedents — Same Protocol</Label>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {PRECEDENTS.map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "rgba(255,255,255,0.02)", border: `1px solid ${BORDER}`, borderRadius: "0.15rem" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: NAVY_MID, border: `1px solid ${TEAL}40`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ ...BC, fontSize: 10, fontWeight: 700, color: TEAL }}>{p.exec}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: "#fff", fontWeight: 500 }}>{p.choice}</div>
                <div style={{ fontSize: 11, color: MUTED, marginTop: 1 }}>{p.date}</div>
              </div>
              <Pill color={TEAL} bg={`${TEAL}15`}>{p.outcome}</Pill>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <Label>Pre-Flight Checks</Label>
        {PREFLIGHT.map((q, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: `${TEAL}08`, border: `1px solid ${TEAL}25`, borderRadius: "0.15rem", marginBottom: i < PREFLIGHT.length - 1 ? 6 : 0 }}>
            <CheckCircle size={15} color={TEAL} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", flex: 1 }}>{q}</span>
            <span style={{ ...BC, fontSize: 10, fontWeight: 700, color: TEAL, marginLeft: "auto", flexShrink: 0 }}>CONFIRMED</span>
          </div>
        ))}
      </Card>
      <button onClick={onAuthorize} disabled={authorizing} style={{ width: "100%", padding: "18px 32px", background: authorizing ? TEAL + "88" : TEAL, border: "none", cursor: authorizing ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, borderRadius: "0.15rem" }}>
        {authorizing ? (
          <><Loader2 size={17} color="#fff" style={{ animation: "spin 1s linear infinite" }} /><span style={{ ...BC, fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: "0.12em", textTransform: "uppercase" as const }}>Recording Authorization…</span></>
        ) : (
          <><Lock size={17} color="#fff" /><span style={{ ...BC, fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: "0.12em", textTransform: "uppercase" as const }}>Authorize and Deploy</span><ArrowRight size={17} color="#fff" /></>
        )}
      </button>
      <div style={{ fontSize: 11, color: MUTED, textAlign: "center" as const, marginTop: -4 }}>Authorization recorded in the decision audit trail.</div>
    </div>
  );
}

function PanelComplete() {
  const sc = useContext(ScenarioCtx);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ background: `${GOLD}0a`, border: `1px solid ${GOLD}40`, borderRadius: "0.15rem", padding: "32px 24px", textAlign: "center" as const }}>
        <div style={{ ...BC, fontSize: 9, fontWeight: 700, color: GOLD, letterSpacing: "0.2em", textTransform: "uppercase" as const, marginBottom: 10 }}>Response Complete · Exposure Window Closed</div>
        <div style={{ ...CG, fontSize: 80, fontWeight: 700, color: GOLD, lineHeight: 1, marginBottom: 4 }}>{sc.completionTime}</div>
        <div style={{ ...BC, fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: "0.12em", textTransform: "uppercase" as const, marginBottom: 24 }}>Minutes and seconds. Full activation complete.</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 0, borderTop: `1px solid ${BORDER}`, paddingTop: 20 }}>
          {[
            { val: "30 days", label: "Traditional mobilization", color: "#EF4444" },
            { val: "→", label: "", color: MUTED },
            { val: sc.completionTime, label: "Readiness OS response", color: TEAL },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center" as const, flex: s.val === "→" ? 0 : 1, padding: s.val === "→" ? "0 16px" : "0" }}>
              {s.val !== "→" && <div style={{ ...CG, fontSize: 32, fontWeight: 700, color: s.color }}>{s.val}</div>}
              {s.val === "→" && <div style={{ fontSize: 28, color: MUTED, paddingTop: 2 }}>→</div>}
              {s.label && <div style={{ ...BC, fontSize: 9, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginTop: 4 }}>{s.label}</div>}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
        {[
          { val: String(sc.tasks), label: "Tasks Closed" },
          { val: String(sc.stakeholders), label: "Executives Coordinated" },
          { val: "3,600×", label: "Execution Head Start" },
        ].map(s => (
          <div key={s.label} style={{ textAlign: "center" as const, padding: "16px 12px", background: "rgba(255,255,255,0.03)", border: `1px solid ${BORDER}`, borderRadius: "0.15rem" }}>
            <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: "#fff" }}>{s.val}</div>
            <div style={{ ...BC, fontSize: 9, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <Card style={{ padding: "16px 20px" }}>
        <Label>This Activation vs. Traditional Response</Label>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {sc.compRows.map((r, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: "0 16px", borderTop: `1px solid ${BORDER}`, padding: "9px 0" }}>
              <div style={{ fontSize: 12, color: r.highlight ? "rgba(255,255,255,0.9)" : MUTED }}>{r.metric}</div>
              <div style={{ fontSize: 12, color: TEAL, fontWeight: 700, textAlign: "right" as const, whiteSpace: "nowrap" as const }}>{r.readiness}</div>
              <div style={{ fontSize: 12, color: "#EF4444", textAlign: "right" as const, whiteSpace: "nowrap" as const, minWidth: 160 }}>{r.traditional}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function PanelAdvance() {
  const sc = useContext(ScenarioCtx);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.3)", padding: "12px 18px", borderRadius: "0.15rem", display: "flex", alignItems: "center", gap: 10 }}>
        <RefreshCw size={14} color="#A78BFA" />
        <span style={{ ...BC, fontSize: 11, fontWeight: 700, color: "#A78BFA", letterSpacing: "0.1em", textTransform: "uppercase" as const }}>ADVANCE Loop — Closing Automatically</span>
        <span style={{ ...BC, fontSize: 11, color: MUTED, marginLeft: "auto" }}>This Activation · Protocol {sc.protocolId}</span>
      </div>

      <Card>
        <Label color="#A78BFA">3 Updates Generated from This Activation</Label>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {sc.advanceUpdates.map((u, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 14px", background: "rgba(167,139,250,0.05)", border: "1px solid rgba(167,139,250,0.2)", borderRadius: "0.15rem" }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(167,139,250,0.15)", border: "1px solid rgba(167,139,250,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                <span style={{ ...BC, fontSize: 9, fontWeight: 700, color: "#A78BFA" }}>{i + 1}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ ...BC, fontSize: 9, fontWeight: 700, color: "#A78BFA", letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 3 }}>{u.type}</div>
                <div style={{ fontSize: 12, color: "#fff" }}>{u.change}</div>
              </div>
              <Pill color="#A78BFA" bg="rgba(167,139,250,0.1)">{u.impact}</Pill>
            </div>
          ))}
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Card style={{ padding: "14px 16px" }}>
          <Label color="#A78BFA">Protocol {sc.protocolId} History</Label>
          {[
            { act: `Activation #${845 + sc.id}`, date: "Apr 2026", time: sc.avgTime.replace("m ", ":").replace("s", "") },
            { act: `Activation #${831 + sc.id}`, date: "Jan 2026", time: "13:22" },
            { act: `Activation #${847 + sc.id}`, date: "Jun 2026", time: sc.completionTime, current: true },
          ].map((a, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < 2 ? `1px solid ${BORDER}` : "none" }}>
              <span style={{ fontSize: 11, color: a.current ? GOLD : MUTED }}>{a.act}</span>
              <span style={{ fontSize: 11, color: MUTED }}>{a.date}</span>
              <span style={{ ...BC, fontSize: 11, fontWeight: 700, color: a.current ? TEAL : MUTED }}>{a.time}</span>
            </div>
          ))}
          <div style={{ marginTop: 10, fontSize: 11, color: TEAL, fontWeight: 500 }}>↓ improving across activations</div>
        </Card>

        <Card style={{ padding: "14px 16px" }}>
          <Label color="#A78BFA">Institutional Memory</Label>
          <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: "#A78BFA", lineHeight: 1, marginBottom: 4 }}>{sc.improvements}</div>
          <div style={{ ...BC, fontSize: 9, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 10 }}>Proven improvements · Protocol {sc.protocolId}</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", lineHeight: 1.6 }}>This knowledge lives in the platform — not in a person. When your executive leaves, the protocol doesn't.</div>
        </Card>
      </div>

      <div style={{ background: `${TEAL}10`, border: `1px solid ${TEAL}30`, padding: "14px 18px", borderRadius: "0.15rem" }}>
        <div style={{ ...BC, fontSize: 10, fontWeight: 700, color: TEAL, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 4 }}>The Compounding Moat</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.88)", lineHeight: 1.6 }}>Protocol {sc.protocolId} has been refined {sc.improvements} times from real activations. Rebuilding this depth on any competing platform would take years. <strong style={{ color: "#fff" }}>The platform gets harder to replace with every activation.</strong></div>
      </div>

      <div style={{ marginTop: 8, background: `linear-gradient(135deg, ${NAVY_MID} 0%, #0d1c4a 100%)`, border: `1px solid ${GOLD}35`, borderRadius: "0.15rem", padding: "28px 28px 24px", textAlign: "center" as const }}>
        <div style={{ ...BC, fontSize: 10, fontWeight: 700, color: GOLD, letterSpacing: "0.2em", textTransform: "uppercase" as const, marginBottom: 12 }}>The Outcome</div>
        <div style={{ ...CG, fontSize: 34, fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: 10 }}>{sc.fearlessLine}</div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", lineHeight: 1.7, maxWidth: 540, margin: "0 auto 20px" }}>
          Every executive knows their role. Every task is pre-assigned. The response improves automatically. There's nothing left to fear — because there's nothing left unprepared.
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 16, padding: "14px 28px", background: `${GOLD}12`, border: `1px solid ${GOLD}40`, borderRadius: "0.15rem" }}>
          <div style={{ width: 2, height: 32, background: GOLD, borderRadius: 1 }} />
          <div style={{ textAlign: "left" as const }}>
            <div style={{ ...CG, fontSize: 22, fontWeight: 700, color: GOLD, lineHeight: 1 }}>Fearless.</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 3 }}>The emotional endpoint of every prepared organization.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Cold open intro ──────────────────────────────────────────────────────────
function ColdOpen({ selectedId, onBegin }: { selectedId: number; onBegin: (id: number) => void }) {
  const sc = DEMO_SCENARIOS[selectedId];
  const DOMAINS = [
    {
      name: "Growth & Positioning", color: TEAL,
      desc: "Seize windows before competitors can react.",
      protocols: [
        { id: "#31", name: "Competitor Displacement Sprint", tag: "72-hr window" },
        { id: "#47", name: "Account Retention Response", tag: "Churn defense" },
        { id: "#58", name: "M&A Rapid Response", tag: "LOI in 48 hrs" },
        { id: "#89", name: "Go-to-Market Acceleration", tag: "Launch sprint" },
      ],
    },
    {
      name: "Risk & Resilience", color: "#EF4444",
      desc: "Navigate every threat before it becomes a crisis.",
      protocols: [
        { id: "#7", name: "Activist Investor Response", tag: "Board defense" },
        { id: "#14", name: "Financial Services Ransomware", tag: "Cyber response" },
        { id: "#29", name: "DOJ/Regulatory Investigation", tag: "Day-1 response" },
        { id: "#52", name: "Supply Chain Collapse", tag: "Tier-1 failure" },
      ],
    },
    {
      name: "Transformation", color: TEAL,
      desc: "Execute organizational change without the drag.",
      protocols: [
        { id: "#112", name: "Workforce Transformation", tag: "6,720 roles" },
        { id: "#127", name: "Digital Infrastructure Migration", tag: "Zero-downtime" },
        { id: "#88", name: "Leadership Transition Protocol", tag: "Succession" },
        { id: "#156", name: "Post-Merger Integration", tag: "Day-100 plan" },
      ],
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: NAVY, display: "flex", flexDirection: "column" }}>
      <style>{`
        @keyframes ping { 0% { transform: scale(1); opacity: 0.4; } 75%, 100% { transform: scale(2); opacity: 0; } }
        .de-hero-h { font-size: 54px; }
        .de-hero-body { font-size: 17px; }
        .de-domain-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .de-compare-grid { display: grid; grid-template-columns: 1fr 1fr; }
        .de-page-pad { padding: 52px 32px 48px; }
        .de-stat-row { display: flex; justify-content: center; gap: 52px; }
        .de-scenario-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; }
        @media (max-width: 900px) {
          .de-scenario-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .de-hero-h { font-size: 32px !important; line-height: 1.18 !important; }
          .de-hero-body { font-size: 14px !important; }
          .de-domain-grid { grid-template-columns: 1fr !important; gap: 8px !important; }
          .de-compare-grid { grid-template-columns: 1fr !important; }
          .de-page-pad { padding: 32px 16px 40px !important; }
          .de-stat-row { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 24px 16px !important; }
          .de-scenario-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Nav */}
      <div style={{ background: "#06091e", borderBottom: `1px solid ${BORDER}`, padding: "0 28px", height: 50, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <VaughnMartinLogo size={26} variant="icon-only" />
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ ...BC, fontSize: 10, color: GOLD, fontWeight: 700 }}>Founding Partner cohort open</span>
          <Link href="/founding-partner-program" style={{ ...BC, background: GOLD, color: NAVY, fontSize: 11, fontWeight: 700, padding: "7px 16px", textDecoration: "none", letterSpacing: "0.1em", textTransform: "uppercase" as const, borderRadius: "0.15rem" }}>Apply for Founding Partner Access</Link>
        </div>
      </div>

      <div className="de-page-pad" style={{ flex: 1, maxWidth: 1040, margin: "0 auto", width: "100%" }}>

        {/* Hero */}
        <div style={{ textAlign: "center" as const, marginBottom: 44 }}>
          <div style={{ ...BC, fontSize: 10, fontWeight: 700, color: GOLD, letterSpacing: "0.22em", textTransform: "uppercase" as const, marginBottom: 16 }}>Readiness OS · Readiness Infrastructure</div>
          <div className="de-hero-h" style={{ ...CG, fontWeight: 700, color: "#fff", lineHeight: 1.12, marginBottom: 20 }}>
            Right now, your organization is one trigger away<br />
            from a <span style={{ color: "#EF4444" }}>30-day mobilization</span> — or a <span style={{ color: GOLD }}>12-minute response.</span>
          </div>
          <div className="de-hero-body" style={{ color: "rgba(255,255,255,0.78)", lineHeight: 1.75, maxWidth: 640, margin: "0 auto 28px" }}>
            Every enterprise will face a ransomware attack, a regulatory inquiry, an activist investor, or a supply chain collapse. The difference between organizations that absorb these in 12 minutes and those that spend 30 days recovering is not resources. It is <strong style={{ color: "#fff" }}>preparation architecture</strong> — and whether it existed before the trigger fired.
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 32, padding: "16px 32px", background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.22)", borderRadius: "0.15rem", marginBottom: 8 }}>
            <div style={{ textAlign: "center" as const }}>
              <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: "#EF4444", lineHeight: 1 }}>30 days</div>
              <div style={{ ...BC, fontSize: 9, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", textTransform: "uppercase" as const, marginTop: 4 }}>Traditional mobilization</div>
            </div>
            <div style={{ ...CG, fontSize: 22, color: MUTED }}>vs.</div>
            <div style={{ textAlign: "center" as const }}>
              <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: GOLD, lineHeight: 1 }}>12 minutes</div>
              <div style={{ ...BC, fontSize: 9, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", textTransform: "uppercase" as const, marginTop: 4 }}>Readiness OS response</div>
            </div>
            <div style={{ width: 1, height: 40, background: BORDER }} />
            <div style={{ textAlign: "center" as const }}>
              <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: TEAL, lineHeight: 1 }}>3,600×</div>
              <div style={{ ...BC, fontSize: 9, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", textTransform: "uppercase" as const, marginTop: 4 }}>Execution head start</div>
            </div>
          </div>
          <div style={{ ...BC, fontSize: 11, color: MUTED, marginTop: 8 }}>Choose a scenario below — watch the complete platform activation, step by step.</div>
        </div>

        {/* 5 scenario cards */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ ...BC, fontSize: 9, fontWeight: 700, color: MUTED, letterSpacing: "0.18em", textTransform: "uppercase" as const, marginBottom: 16, textAlign: "center" as const }}>
            5 situations · click any to watch the full platform activation
          </div>
          <div className="de-scenario-grid">
            {DEMO_SCENARIOS.map((s) => {
              const isSelected = s.id === selectedId;
              return (
                <div
                  key={s.id}
                  onClick={() => onBegin(s.id)}
                  style={{
                    background: isSelected ? `${s.domainColor}14` : "rgba(255,255,255,0.025)",
                    border: `1px solid ${isSelected ? s.domainColor + "60" : BORDER}`,
                    borderTop: `3px solid ${isSelected ? s.domainColor : "rgba(255,255,255,0.1)"}`,
                    padding: "16px 16px",
                    cursor: "pointer",
                    position: "relative" as const,
                    transition: "border-color 0.2s",
                    borderRadius: "0.15rem",
                  }}
                >
                  {isSelected && (
                    <div style={{ position: "absolute" as const, top: 8, right: 10, ...BC, fontSize: 7, fontWeight: 700, color: s.domainColor, letterSpacing: "0.14em", textTransform: "uppercase" as const, background: `${s.domainColor}1a`, padding: "2px 6px", borderRadius: "0.1rem" }}>
                      Selected
                    </div>
                  )}
                  <div style={{ ...BC, fontSize: 9, fontWeight: 700, color: isSelected ? s.domainColor : "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 6 }}>
                    Protocol {s.protocolId}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: isSelected ? "#fff" : "rgba(255,255,255,0.72)", marginBottom: 5, lineHeight: 1.3 }}>{s.label}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", lineHeight: 1.4, marginBottom: 10 }}>{s.moment}</div>
                  <div style={{ ...BC, fontSize: 10, color: isSelected ? s.domainColor : "rgba(255,255,255,0.38)", fontWeight: 700 }}>
                    Watch activation →
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Three domain showcase */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ ...BC, fontSize: 9, fontWeight: 700, color: MUTED, letterSpacing: "0.16em", textTransform: "uppercase" as const, marginBottom: 14, textAlign: "center" as const }}>180 protocols across 3 strategic domains — every one pre-staged and ready</div>
          <div className="de-domain-grid">
            {DOMAINS.map((domain) => (
              <div key={domain.name} style={{ background: `${domain.color}07`, border: `1px solid ${domain.color}30`, borderTop: `3px solid ${domain.color}`, borderRadius: "0.15rem", padding: "20px 20px" }}>
                <div style={{ ...BC, fontSize: 10, fontWeight: 700, color: domain.color, letterSpacing: "0.14em", textTransform: "uppercase" as const, marginBottom: 6 }}>{domain.name}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.62)", marginBottom: 16, lineHeight: 1.5 }}>{domain.desc}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {domain.protocols.map((p) => {
                    const isActiveProtocol = p.id === sc.protocolId;
                    return (
                      <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: isActiveProtocol ? `${domain.color}14` : "rgba(255,255,255,0.02)", border: `1px solid ${isActiveProtocol ? domain.color + "40" : BORDER}`, borderRadius: "0.15rem" }}>
                        <span style={{ ...BC, fontSize: 9, fontWeight: 700, color: domain.color, flexShrink: 0 }}>{p.id}</span>
                        <span style={{ fontSize: 11, color: isActiveProtocol ? "#fff" : "rgba(255,255,255,0.72)", flex: 1, fontWeight: isActiveProtocol ? 600 : 400 }}>{p.name}</span>
                        <span style={{ ...BC, fontSize: 9, color: isActiveProtocol ? domain.color : MUTED, letterSpacing: "0.06em", flexShrink: 0 }}>{isActiveProtocol ? "← this demo" : p.tag}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Demo scenario divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "32px 0 20px" }}>
          <div style={{ flex: 1, height: 1, background: BORDER }} />
          <div style={{ ...BC, fontSize: 9, fontWeight: 700, color: MUTED, letterSpacing: "0.16em", textTransform: "uppercase" as const, whiteSpace: "nowrap" as const }}>
            In this walkthrough — Protocol {sc.protocolId} · {sc.protocolName}
          </div>
          <div style={{ flex: 1, height: 1, background: BORDER }} />
        </div>

        {/* Side-by-side — scenario-specific */}
        <div className="de-compare-grid" style={{ gap: 0, marginBottom: 44, borderRadius: "0.15rem", overflow: "hidden", border: `1px solid ${BORDER}` }}>
          <div style={{ background: "rgba(220,38,38,0.06)", borderRight: `1px solid rgba(220,38,38,0.18)`, padding: "24px 26px" }}>
            <div style={{ ...BC, fontSize: 10, fontWeight: 700, color: "#EF4444", letterSpacing: "0.16em", textTransform: "uppercase" as const, marginBottom: 18, display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#EF4444" }} /> Without Readiness OS
            </div>
            {sc.timelineWithout.map((r, i) => (
              <div key={i} style={{ display: "flex", gap: 16, padding: "9px 0", borderBottom: i < sc.timelineWithout.length - 1 ? `1px solid rgba(220,38,38,0.1)` : "none" }}>
                <span style={{ ...BC, fontSize: 11, fontWeight: 700, color: "#EF4444", width: 64, flexShrink: 0 }}>{r.time}</span>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>{r.event}</span>
              </div>
            ))}
            <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px solid rgba(220,38,38,0.2)", ...BC, fontSize: 12, fontWeight: 700, color: "#EF4444" }}>{sc.verdictWithout}</div>
          </div>
          <div style={{ background: `${TEAL}07`, padding: "24px 26px" }}>
            <div style={{ ...BC, fontSize: 10, fontWeight: 700, color: TEAL, letterSpacing: "0.16em", textTransform: "uppercase" as const, marginBottom: 18, display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: TEAL }} /> With Readiness OS
            </div>
            {sc.timelineWith.map((r, i) => (
              <div key={i} style={{ display: "flex", gap: 16, padding: "9px 0", borderBottom: i < sc.timelineWith.length - 1 ? `1px solid ${TEAL}16` : "none" }}>
                <span style={{ ...BC, fontSize: 11, fontWeight: 700, color: TEAL, width: 64, flexShrink: 0 }}>{r.time}</span>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.88)", lineHeight: 1.5 }}>{r.event}</span>
              </div>
            ))}
            <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1px solid ${TEAL}25`, ...BC, fontSize: 12, fontWeight: 700, color: TEAL }}>{sc.verdictWith}</div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center" as const }}>
          <div style={{ ...BC, fontSize: 10, fontWeight: 700, color: MUTED, letterSpacing: "0.18em", textTransform: "uppercase" as const, marginBottom: 20 }}>
            You just saw the summary. Now watch Protocol {sc.protocolId} activate — step by step.
          </div>
          <button onClick={() => onBegin(selectedId)} style={{ display: "inline-flex", alignItems: "center", gap: 14, background: GOLD, border: "none", padding: "20px 48px", cursor: "pointer", borderRadius: "0.15rem" }}>
            <span style={{ ...BC, fontSize: 15, fontWeight: 700, color: NAVY, letterSpacing: "0.1em", textTransform: "uppercase" as const }}>Watch Protocol {sc.protocolId} · {sc.protocolName}</span>
            <ArrowRight size={20} color={NAVY} />
          </button>
          <div style={{ ...BC, fontSize: 11, color: MUTED, marginTop: 12 }}>
            9 steps · Protocol {sc.protocolId} of 180 · No login required · ~5 minutes
          </div>
          <div className="de-stat-row" style={{ marginTop: 40 }}>
            {[
              { val: "180", label: "Pre-staged protocols" },
              { val: "231", label: "Trigger patterns" },
              { val: "12 min", label: "Response target" },
              { val: "3,600×", label: "Execution head start" },
            ].map(s => (
              <div key={s.label} style={{ textAlign: "center" as const }}>
                <div style={{ ...CG, fontSize: 30, fontWeight: 700, color: GOLD }}>{s.val}</div>
                <div style={{ ...BC, fontSize: 9, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── Preparation cost bar (steps 0-2 only) ────────────────────────────────────
const PREP_COST_BARS = [
  {
    label: "Right now, across the industry:",
    items: [
      { icon: "⚠", color: "#EF4444", text: "Competitors monitoring 0 of 231 trigger patterns systematically" },
      { icon: "💸", color: "#EF4444", text: "$1.3M average emergency consulting cost when a trigger fires undetected" },
      { icon: "⏱", color: "#EF4444", text: "30 days average mobilization before execution even begins" },
    ],
    contrast: "Your organization: 47 triggers monitored. 180 responses staged. Cost of the next trigger: 12 minutes.",
  },
  {
    label: "The cost of an unmonitored trigger:",
    items: [
      { icon: "📉", color: "#EF4444", text: "$4.5M average cost of a ransomware event (IBM Security, 2024)" },
      { icon: "📋", color: "#EF4444", text: "$3.2M average activist investor defense — reactive (Lazard/ISS)" },
      { icon: "⚖", color: "#EF4444", text: "$5.8M average regulatory response cost — uncoordinated (PwC 2024)" },
    ],
    contrast: "Each of these is a protocol on the shelf. Pre-staged. Waiting. Zero scrambling required.",
  },
  {
    label: "Building a response during a crisis vs. before one:",
    items: [
      { icon: "🔥", color: "#EF4444", text: "3–4 weeks to write a response plan from scratch under pressure" },
      { icon: "💰", color: "#EF4444", text: "$800–$1,200/hr emergency consulting rates for reactive work" },
      { icon: "🎲", color: "#EF4444", text: "Decisions made with incomplete context, under pressure, in real time" },
    ],
    contrast: "Every card on this shelf was built before any trigger fired. The pressure is already gone.",
  },
];

function PreparationCostBar({ step }: { step: number }) {
  const bar = PREP_COST_BARS[step];
  if (!bar) return null;
  return (
    <div style={{ marginBottom: 20, background: "rgba(220,38,38,0.05)", border: "1px solid rgba(220,38,38,0.18)", borderRadius: "0.15rem", padding: "16px 20px" }}>
      <div style={{ ...BC, fontSize: 9, fontWeight: 700, color: "#EF4444", letterSpacing: "0.14em", textTransform: "uppercase" as const, marginBottom: 12 }}>{bar.label}</div>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" as const, marginBottom: 12 }}>
        {bar.items.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, flex: "1 1 200px" }}>
            <span style={{ fontSize: 14 }}>{item.icon}</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.72)", lineHeight: 1.4 }}>{item.text}</span>
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid rgba(43,138,110,0.25)", paddingTop: 10, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 3, height: 24, background: TEAL, borderRadius: 2, flexShrink: 0 }} />
        <span style={{ fontSize: 12, color: TEAL, fontWeight: 600, lineHeight: 1.5 }}>{bar.contrast}</span>
      </div>
    </div>
  );
}

// ─── Comparison strip (Response phase only) ───────────────────────────────────
function ComparisonStrip({ step }: { step: number }) {
  const sc = useContext(ScenarioCtx);
  const c = sc.strip[step];
  if (!c) return null;
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ ...BC, fontSize: 9, fontWeight: 700, color: MUTED, letterSpacing: "0.14em", textTransform: "uppercase" as const, textAlign: "center" as const, marginBottom: 8 }}>Same moment in time · Two completely different realities</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, borderRadius: "0.15rem", overflow: "hidden", border: `1px solid ${BORDER}` }}>
        <div style={{ background: `${TEAL}14`, padding: "18px 22px", borderRight: `1px solid ${BORDER}` }}>
          <div style={{ ...BC, fontSize: 9, fontWeight: 700, color: TEAL, letterSpacing: "0.14em", textTransform: "uppercase" as const, marginBottom: 8 }}>Readiness OS · {c.elapsed} elapsed</div>
          <div style={{ fontSize: 16, color: "#fff", fontWeight: 600, lineHeight: 1.4 }}>{c.readiness}</div>
        </div>
        <div style={{ background: "rgba(220,38,38,0.08)", padding: "18px 22px" }}>
          <div style={{ ...BC, fontSize: 9, fontWeight: 700, color: "#EF4444", letterSpacing: "0.14em", textTransform: "uppercase" as const, marginBottom: 8 }}>Traditional response · Same moment</div>
          <div style={{ fontSize: 16, color: "rgba(255,255,255,0.78)", fontWeight: 500, lineHeight: 1.4 }}>{c.trad}</div>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function DemoExperience() {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  const [scenarioId, setScenarioId] = useState(() => {
    const sp = new URLSearchParams(window.location.search);
    const s = parseInt(sp.get("s") ?? "1", 10);
    return isNaN(s) || s < 0 || s > 4 ? 1 : s;
  });
  const [intro, setIntro] = useState(true);
  const [step, setStep] = useState(0);
  const [authorizing, setAuthorizing] = useState(false);
  const contentPanelRef = useRef<HTMLDivElement>(null);
  const scrollPanelToTop = () => { if (contentPanelRef.current) contentPanelRef.current.scrollTop = 0; };

  const sc = DEMO_SCENARIOS[scenarioId];

  const handleBegin = (id: number) => {
    setScenarioId(id);
    setStep(0);
    setIntro(false);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    scrollPanelToTop();
  };

  const handleAuthorize = () => {
    setAuthorizing(true);
    setTimeout(() => { setStep(7); setAuthorizing(false); scrollPanelToTop(); }, 1400);
  };

  const panels = [
    <PanelCommandCenter />,
    <PanelTriggerPortfolio />,
    <PanelProtocolLibrary />,
    <PanelSignal />,
    <PanelProtocol />,
    <PanelWarRoom />,
    <PanelAuthorize onAuthorize={handleAuthorize} authorizing={authorizing} />,
    <PanelComplete />,
    <PanelAdvance />,
  ];

  const phaseColor = PHASES.find(p => p.steps.includes(step))?.color || GOLD;
  const isResponsePhase = [3, 4, 5, 6].includes(step);
  const isCompleteStep = step === 7;
  const responseBg = sc.crisisIsRed ? "#07040f" : "#08070a";
  const responseBorder = sc.crisisIsRed ? "rgba(220,38,38,0.3)" : `${sc.crisisColor}28`;

  if (intro) {
    return (
      <ScenarioCtx.Provider value={sc}>
        <ColdOpen selectedId={scenarioId} onBegin={handleBegin} />
      </ScenarioCtx.Provider>
    );
  }

  return (
    <ScenarioCtx.Provider value={sc}>
      <div style={{ minHeight: "100vh", background: isResponsePhase ? responseBg : NAVY, display: "flex", flexDirection: "column", transition: "background 0.6s ease" }}>
        <style>{`
          @keyframes ping { 0% { transform: scale(1); opacity: 0.4; } 75%, 100% { transform: scale(2); opacity: 0; } }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes crisis-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.45; } }
        `}</style>

        {/* Top bar */}
        <div style={{ background: isResponsePhase ? "#090410" : "#06091e", borderBottom: `1px solid ${isResponsePhase ? responseBorder : BORDER}`, padding: "0 28px", height: 50, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, transition: "background 0.4s ease" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <VaughnMartinLogo size={26} variant="icon-only" />
            <div style={{ width: 1, height: 22, background: BORDER }} />
            {isResponsePhase ? (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <StatusDot color={sc.crisisColor} pulse />
                <span style={{ ...BC, fontSize: 10, fontWeight: 700, color: sc.crisisColor, letterSpacing: "0.14em", textTransform: "uppercase" as const, animation: "crisis-blink 2s ease-in-out infinite" }}>
                  {sc.crisisIsRed ? "Crisis In Progress" : "Protocol Active"} — Protocol {sc.protocolId}
                </span>
              </div>
            ) : isCompleteStep ? (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <StatusDot color={GOLD} />
                <span style={{ ...BC, fontSize: 10, fontWeight: 700, color: GOLD, letterSpacing: "0.14em", textTransform: "uppercase" as const }}>Response Complete — Exposure Window Closed</span>
              </div>
            ) : (
              <div>
                <span style={{ ...BC, fontSize: 10, fontWeight: 700, color: phaseColor, letterSpacing: "0.14em", textTransform: "uppercase" as const }}>Platform Demo</span>
                <span style={{ ...BC, fontSize: 11, color: "rgba(255,255,255,0.4)", marginLeft: 10 }}>Meridian Financial Group · Full Customer Journey</span>
              </div>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {sc.elapsed[step] !== "—" && (
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <Clock size={12} color={isResponsePhase ? sc.crisisColor : GOLD} />
                <span style={{ ...BC, fontSize: 12, fontWeight: 700, color: isResponsePhase ? sc.crisisColor : GOLD }}>{sc.elapsed[step]}</span>
                <span style={{ ...BC, fontSize: 9, color: MUTED }}>ELAPSED</span>
              </div>
            )}
            <Link href="/founding-partner-program" style={{ ...BC, background: GOLD, color: NAVY, fontSize: 11, fontWeight: 700, padding: "7px 16px", textDecoration: "none", letterSpacing: "0.1em", textTransform: "uppercase" as const, borderRadius: "0.15rem", whiteSpace: "nowrap" as const }}>
              Apply for Founding Partner Access
            </Link>
          </div>
        </div>

        {/* Crisis alert bar */}
        {isResponsePhase && (
          <div style={{ background: `${sc.crisisColor}12`, borderBottom: `1px solid ${sc.crisisColor}28`, padding: "8px 28px", display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
            <span style={{ ...BC, fontSize: 10, fontWeight: 700, color: sc.crisisColor, letterSpacing: "0.1em", textTransform: "uppercase" as const }}>{sc.patternName} · Meridian Financial Group</span>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                <span style={{ ...BC, fontSize: 9, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase" as const }}>Traditional response right now</span>
                <span style={{ ...BC, fontSize: 11, fontWeight: 700, color: "#EF4444" }}>Day 2 — still assembling who owns this</span>
              </div>
              <div style={{ width: 1, height: 28, background: `${sc.crisisColor}30` }} />
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                <span style={{ ...BC, fontSize: 9, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase" as const }}>Readiness OS right now</span>
                <span style={{ ...BC, fontSize: 11, fontWeight: 700, color: TEAL }}>Execution already underway</span>
              </div>
            </div>
          </div>
        )}

        {/* Main layout */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* Sidebar */}
          <div style={{ width: 272, background: "#060b20", borderRight: `1px solid ${BORDER}`, padding: "20px 0", display: "flex", flexDirection: "column", flexShrink: 0, overflowY: "auto" as const }}>
            {PHASES.map((phase) => (
              <div key={phase.label} style={{ marginBottom: 6 }}>
                <div style={{ padding: "6px 20px 6px", display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 4, height: 14, background: phase.color, borderRadius: 2, flexShrink: 0 }} />
                  <span style={{ ...BC, fontSize: 9, fontWeight: 700, color: phase.color, letterSpacing: "0.16em", textTransform: "uppercase" as const }}>{phase.label}</span>
                  <span style={{ ...BC, fontSize: 9, color: MUTED, marginLeft: 2 }}>· {phase.desc}</span>
                </div>
                {phase.steps.map(i => {
                  const sd = STEP_DEFS[i];
                  const isActive = i === step;
                  const isDone = i < step;
                  return (
                    <div key={i} onClick={() => { if (isDone) { setStep(i); scrollPanelToTop(); } }} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 20px", cursor: isDone ? "pointer" : "default", background: isActive ? `${phase.color}0c` : "transparent", borderLeft: `2px solid ${isActive ? phase.color : isDone ? phase.color + "50" : "transparent"}`, marginBottom: 1 }}>
                      <div style={{ width: 18, height: 18, borderRadius: "50%", background: isActive ? phase.color : isDone ? phase.color + "30" : "transparent", border: `1px solid ${isActive ? phase.color : isDone ? phase.color + "60" : BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                        {isDone ? <CheckCircle size={10} color={phase.color} /> : <span style={{ ...BC, fontSize: 8, fontWeight: 700, color: isActive ? NAVY : MUTED }}>{i + 1}</span>}
                      </div>
                      <div>
                        <div style={{ ...BC, fontSize: 11, fontWeight: 700, color: isActive ? "#fff" : isDone ? "rgba(255,255,255,0.6)" : MUTED, letterSpacing: "0.03em" }}>{sd.label}</div>
                        <div style={{ fontSize: 10, color: MUTED + "80", marginTop: 1 }}>{getStepTag(i, sc)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Narration */}
            <div style={{ margin: "16px 0 0", padding: "16px 20px 20px", borderTop: `1px solid ${BORDER}`, flex: 1 }}>
              <div style={{ ...BC, fontSize: 9, fontWeight: 700, color: phaseColor, letterSpacing: "0.14em", textTransform: "uppercase" as const, marginBottom: 10 }}>What's Happening Here</div>
              <div style={{ ...CG, fontSize: 17, fontWeight: 700, color: "#fff", lineHeight: 1.4, marginBottom: 12 }}>{NARRATION[step].headline}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.82)", lineHeight: 1.75, marginBottom: 14 }}>{NARRATION[step].body}</div>
              <div style={{ background: `${phaseColor}15`, border: `1px solid ${phaseColor}45`, padding: "11px 14px", borderRadius: "0.15rem" }}>
                <div style={{ fontSize: 12, color: phaseColor, fontStyle: "italic", lineHeight: 1.6, fontWeight: 500 }}>"{NARRATION[step].callout}"</div>
              </div>
            </div>
          </div>

          {/* Content panel */}
          <div ref={contentPanelRef} style={{ flex: 1, padding: "24px 28px", overflowY: "auto" as const }}>
            {/* Step header */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <Pill color={phaseColor} bg={`${phaseColor}12`}>{PHASES.find(p => p.steps.includes(step))?.label}</Pill>
              <ChevronRight size={13} color={MUTED.toString()} />
              <span style={{ ...BC, fontSize: 13, fontWeight: 700, color: "#fff" }}>{STEP_DEFS[step].label}</span>
              <div style={{ flex: 1 }} />
              <span style={{ ...BC, fontSize: 10, color: MUTED }}>Step {step + 1} of {STEP_DEFS.length}</span>
              <div style={{ width: 100, height: 3, background: BORDER, borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${((step + 1) / STEP_DEFS.length) * 100}%`, background: phaseColor, borderRadius: 2, transition: "width 0.4s ease" }} />
              </div>
            </div>

            <ContextBanner step={step} phaseColor={phaseColor} />
            <PreparationCostBar step={step} />
            <ComparisonStrip step={step} />
            {panels[step]}

            {/* Bottom nav */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 24, paddingTop: 18, borderTop: `1px solid ${BORDER}` }}>
              <button onClick={() => { setStep(s => Math.max(0, s - 1)); scrollPanelToTop(); }} disabled={step === 0} style={{ display: "flex", alignItems: "center", gap: 7, background: "transparent", border: `1px solid ${BORDER}`, padding: "10px 18px", color: step === 0 ? MUTED : "#fff", cursor: step === 0 ? "default" : "pointer", ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, borderRadius: "0.15rem" }}>
                <ChevronLeft size={13} /> Back
              </button>

              {step === STEP_DEFS.length - 1 ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                  <Link href="/founding-partner-program" style={{ display: "flex", alignItems: "center", gap: 10, background: GOLD, color: NAVY, padding: "14px 32px", textDecoration: "none", ...BC, fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, borderRadius: "0.15rem" }}>
                    Apply for Founding Partner Access <ArrowRight size={16} />
                  </Link>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <span style={{ ...BC, fontSize: 10, color: GOLD }}>Founding Partner cohort · 90-day validation partnership</span>
                  </div>
                </div>
              ) : step === 6 ? (
                <div style={{ fontSize: 12, color: MUTED, fontStyle: "italic" }}>Click "Authorize and Deploy" above to continue</div>
              ) : (
                <button onClick={() => { setStep(s => Math.min(STEP_DEFS.length - 1, s + 1)); scrollPanelToTop(); }} style={{ display: "flex", alignItems: "center", gap: 9, background: phaseColor, border: "none", padding: "12px 24px", color: "#fff", cursor: "pointer", ...BC, fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, borderRadius: "0.15rem" }}>
                  Continue <ArrowRight size={15} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </ScenarioCtx.Provider>
  );
}
