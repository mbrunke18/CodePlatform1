import { useState } from "react";
import StandardNav from "@/components/layout/StandardNav";
import { Link } from "wouter";
import { TrendingUp, Shield, Zap, CheckSquare, Square, Clock, Users, Lock, Mail, ArrowRight, ChevronRight } from "lucide-react";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const BC: React.CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', Georgia, serif" };

interface Task {
  status: "staged" | "pending-auth";
  text: string;
}

interface EmailContent {
  to: string;
  subject: string;
  tasks: Task[];
  stakeholders: string[];
  authRequired: string;
  tasksTotal: number;
  stagedAgo: string;
  responseWindow: string;
  note: string;
}

interface RoleOption {
  id: string;
  label: string;
  title: string;
}

interface ScenarioDef {
  id: string;
  name: string;
  protocol: string;
  domain: string;
  domainColor: string;
  urgency: "CRITICAL" | "HIGH";
  urgencyColor: string;
  situation: string;
  timestamp: string;
  roles: RoleOption[];
  icon: typeof Mail;
}

const SCENARIOS: ScenarioDef[] = [
  {
    id: "activist",
    name: "Activist Investor",
    protocol: "#031",
    domain: "GROWTH & POSITIONING",
    domainColor: TEAL,
    urgency: "CRITICAL",
    urgencyColor: "#B43C32",
    situation: "Activist filed 13D at 2:47 AM — 9.2% stake. Board demands plan by market open.",
    timestamp: "Today, 2:47 AM",
    roles: [
      { id: "ceo",   label: "CEO",         title: "Sarah Chen, Chief Executive Officer" },
      { id: "cfo",   label: "CFO",         title: "James Park, Chief Financial Officer" },
      { id: "board", label: "Board Chair", title: "Richard Alvarez, Board Chair" },
    ],
    icon: TrendingUp,
  },
  {
    id: "ransomware",
    name: "Cyber Event — Ransomware",
    protocol: "#007",
    domain: "RISK & RESILIENCE",
    domainColor: "#B43C32",
    urgency: "CRITICAL",
    urgencyColor: "#B43C32",
    situation: "Trading systems encrypted at 4:23 AM. SWIFT offline. Market open in 4 hours.",
    timestamp: "Today, 4:23 AM",
    roles: [
      { id: "ciso", label: "CISO", title: "Marcus Webb, Chief Information Security Officer" },
      { id: "ceo",  label: "CEO",  title: "Sarah Chen, Chief Executive Officer" },
      { id: "cfo",  label: "CFO",  title: "James Park, Chief Financial Officer" },
    ],
    icon: Shield,
  },
  {
    id: "acquisition",
    name: "M&A Rapid Response",
    protocol: "#058",
    domain: "GROWTH & POSITIONING",
    domainColor: TEAL,
    urgency: "HIGH",
    urgencyColor: "#C9A84C",
    situation: "Waypoint Analytics authorizes a sale. LOI required in 48 hours or Blackstone wins it.",
    timestamp: "Today, 9:14 AM",
    roles: [
      { id: "ceo", label: "CEO",            title: "Sarah Chen, Chief Executive Officer" },
      { id: "cfo", label: "CFO",            title: "James Park, Chief Financial Officer" },
      { id: "gc",  label: "General Counsel",title: "Anita Mehta, General Counsel" },
    ],
    icon: TrendingUp,
  },
  {
    id: "gtm",
    name: "Go-to-Market Sprint",
    protocol: "#089",
    domain: "TRANSFORMATION",
    domainColor: GOLD,
    urgency: "HIGH",
    urgencyColor: "#C9A84C",
    situation: "Competitor announces 30-day launch window. Board authorizes GTM acceleration.",
    timestamp: "Today, 8:02 AM",
    roles: [
      { id: "cmo", label: "CMO", title: "Patricia Osei, Chief Marketing Officer" },
      { id: "cro", label: "CRO", title: "Monica Torres, Chief Revenue Officer" },
      { id: "ceo", label: "CEO", title: "Sarah Chen, Chief Executive Officer" },
    ],
    icon: Zap,
  },
];

const EMAILS: Record<string, Record<string, EmailContent>> = {
  activist: {
    ceo: {
      to: "Sarah Chen, Chief Executive Officer",
      subject: "[PROTOCOL #031 ACTIVATED] Activist Investor — 9.2% Stake — Your Authorization Required",
      tasks: [
        { status: "staged",       text: "Board member notification package prepared and staged for delivery" },
        { status: "staged",       text: "Investor relations statement drafted — 3 tone variants ready" },
        { status: "staged",       text: "Legal hold instruction issued to GC — 14 stakeholders copied" },
        { status: "staged",       text: "Defensive positioning brief prepared for Board Chair" },
        { status: "staged",       text: "Morgan Stanley advisory team put on 30-minute standby" },
        { status: "pending-auth", text: "SEC Form 8-K filing — requires your authorization to file" },
      ],
      stakeholders: ["Board Chair — Richard Alvarez", "CFO — James Park", "GC — Anita Mehta", "Head of IR — Carolyn Wu", "Outside Counsel — Skadden, Arps"],
      authRequired: "CEO authorization required to activate full response",
      tasksTotal: 23,
      stagedAgo: "19 minutes ago",
      responseWindow: "4 hours 13 minutes until market open",
      note: "The Board expects a plan before market open. Every document, stakeholder notification, and advisor contact in Protocol #031 is pre-staged. Your decision activates them simultaneously.",
    },
    cfo: {
      to: "James Park, Chief Financial Officer",
      subject: "[PROTOCOL #031 ACTIVATED] Activist Investor — Financial Response Package Ready",
      tasks: [
        { status: "staged",       text: "Share buyback analysis — 3 scenarios modeled (2%, 5%, 8% float)" },
        { status: "staged",       text: "Capital allocation defense memo ready for Board presentation" },
        { status: "staged",       text: "Earnings guidance review — Q3 acceleration options modeled" },
        { status: "staged",       text: "Debt capacity analysis complete — balance sheet defense packaged" },
        { status: "staged",       text: "Proxy advisor relationship log compiled — ISS & Glass Lewis contacts ready" },
        { status: "pending-auth", text: "Board financial advisory authorization — pending CEO sign-off" },
      ],
      stakeholders: ["CEO — Sarah Chen", "Board Chair — Richard Alvarez", "Outside Counsel — Skadden, Arps", "Investment Banker — Goldman Sachs", "Head of IR — Carolyn Wu"],
      authRequired: "Awaiting CEO authorization — your package activates on approval",
      tasksTotal: 23,
      stagedAgo: "19 minutes ago",
      responseWindow: "4 hours 13 minutes until market open",
      note: "Your financial defense package is complete. Capital structure analysis, buyback modeling, and proxy advisor outreach are pre-staged. Activates when CEO authorizes.",
    },
    board: {
      to: "Richard Alvarez, Board Chair",
      subject: "[PROTOCOL #031 ACTIVATED] Activist Investor — Board Response Package Ready for Review",
      tasks: [
        { status: "staged",       text: "Board meeting agenda pre-built — emergency session materials ready" },
        { status: "staged",       text: "Director briefing document prepared — 13D analysis and activist history" },
        { status: "staged",       text: "Activist history report compiled — prior campaigns, outcomes, demands" },
        { status: "staged",       text: "Governance defense brief — board composition, independence metrics" },
        { status: "staged",       text: "External counsel briefed — Skadden team on standby" },
        { status: "pending-auth", text: "Emergency board session scheduling — awaiting quorum confirmation" },
      ],
      stakeholders: ["CEO — Sarah Chen", "All Board Directors", "Outside Counsel — Skadden, Arps", "Corporate Secretary", "Head of IR — Carolyn Wu"],
      authRequired: "Board Chair confirmation required to convene emergency session",
      tasksTotal: 23,
      stagedAgo: "19 minutes ago",
      responseWindow: "4 hours 13 minutes until market open",
      note: "The full board response is staged and waiting. Emergency session materials, director briefings, and outside counsel are on standby. Your confirmation convenes the session.",
    },
  },
  ransomware: {
    ciso: {
      to: "Marcus Webb, Chief Information Security Officer",
      subject: "[PROTOCOL #007 ACTIVATED] Critical Cyber Event — Trading Systems — Your Authorization Required",
      tasks: [
        { status: "staged",       text: "CrowdStrike and Palo Alto IR teams notified and engaged" },
        { status: "staged",       text: "Network isolation procedures staged — 3-stage containment ready to execute" },
        { status: "staged",       text: "FBI Cyber Division and FS-ISAC notification packages prepared" },
        { status: "staged",       text: "Business continuity switchover staged — manual trading protocols ready" },
        { status: "staged",       text: "Customer notification draft prepared — FDIC/SEC disclosure language ready" },
        { status: "pending-auth", text: "Network isolation execution — requires your authorization" },
      ],
      stakeholders: ["CEO — Sarah Chen", "CTO — David Kim", "CRO — Monica Torres", "FBI Cyber Division", "Federal Reserve contact — pre-identified"],
      authRequired: "CISO authorization required to execute network isolation",
      tasksTotal: 31,
      stagedAgo: "3 minutes ago",
      responseWindow: "3 hours 57 minutes until market open",
      note: "31 tasks are staged. Every IR firm contact, regulatory notification, and containment procedure is documented and ready. SWIFT alternative communication channels are pre-identified.",
    },
    ceo: {
      to: "Sarah Chen, Chief Executive Officer",
      subject: "[PROTOCOL #007 ACTIVATED] Critical Cyber Event — Executive Decision Required — Market Open in 4 Hours",
      tasks: [
        { status: "staged",       text: "Board member emergency notification prepared — all directors copied" },
        { status: "staged",       text: "Public statement drafted — 3 versions (minimal, moderate, full disclosure)" },
        { status: "staged",       text: "Federal Reserve and OCC pre-notification packages staged" },
        { status: "staged",       text: "Crisis communications firm engaged — Edelman team on standby" },
        { status: "staged",       text: "Market halt coordination procedure prepared" },
        { status: "pending-auth", text: "External communications release — requires CEO authorization" },
      ],
      stakeholders: ["CISO — Marcus Webb", "Board Chair", "Federal Reserve contact", "OCC contact", "PR firm — Edelman"],
      authRequired: "CEO authorization required for external communications",
      tasksTotal: 31,
      stagedAgo: "3 minutes ago",
      responseWindow: "3 hours 57 minutes until market open",
      note: "The technical response is executing under CISO authority. Your decisions: external communications, regulatory notification, and market-open position. All packages are pre-staged and waiting.",
    },
    cfo: {
      to: "James Park, Chief Financial Officer",
      subject: "[PROTOCOL #007 ACTIVATED] Cyber Event — Financial Exposure Package Ready",
      tasks: [
        { status: "staged",       text: "Cyber insurance policy activated — $50M coverage claim package prepared" },
        { status: "staged",       text: "Board financial impact briefing prepared — revenue exposure modeled" },
        { status: "staged",       text: "Auditor notification prepared — Ernst & Young partner pre-identified" },
        { status: "staged",       text: "Material event financial disclosure draft ready — SEC Form 8-K language staged" },
        { status: "staged",       text: "Emergency credit facility access procedure documented" },
        { status: "pending-auth", text: "Insurance claim filing — requires CFO sign-off" },
      ],
      stakeholders: ["CEO — Sarah Chen", "CISO — Marcus Webb", "Ernst & Young — Audit Partner", "Insurance Broker — Marsh", "General Counsel"],
      authRequired: "CFO authorization required for insurance claim filing",
      tasksTotal: 31,
      stagedAgo: "3 minutes ago",
      responseWindow: "3 hours 57 minutes until market open",
      note: "Financial exposure is contained in the protocol. Cyber insurance claim, material event disclosure, and board financial briefing are all pre-staged and waiting for your authorization.",
    },
  },
  acquisition: {
    ceo: {
      to: "Sarah Chen, Chief Executive Officer",
      subject: "[PROTOCOL #058 ACTIVATED] M&A Window — Waypoint Analytics — LOI in 48 Hours — Authorization Required",
      tasks: [
        { status: "staged",       text: "Target company profile and valuation analysis — 3 scenarios modeled" },
        { status: "staged",       text: "LOI framework drafted — pre-negotiated terms with legal review complete" },
        { status: "staged",       text: "Due diligence team assembled — 12 specialists pre-assigned and briefed" },
        { status: "staged",       text: "Financing package staged — debt/equity mix analyzed, bank contacts ready" },
        { status: "staged",       text: "Board resolution template prepared for emergency authorization" },
        { status: "pending-auth", text: "LOI submission to Waypoint Analytics — requires your authorization" },
      ],
      stakeholders: ["CFO — James Park", "GC — Anita Mehta", "M&A Advisor — Goldman Sachs", "Due Diligence Lead", "Board Chair — Richard Alvarez"],
      authRequired: "CEO authorization required to submit LOI",
      tasksTotal: 19,
      stagedAgo: "12 minutes ago",
      responseWindow: "47 hours 48 minutes remaining on LOI window",
      note: "The LOI is drafted, the due diligence team is assembled, and Goldman Sachs is briefed. Every hour without authorization is position ceded to Blackstone. Your decision is the only step remaining.",
    },
    cfo: {
      to: "James Park, Chief Financial Officer",
      subject: "[PROTOCOL #058 ACTIVATED] M&A — Waypoint Analytics — Financial Package Staged",
      tasks: [
        { status: "staged",       text: "Acquisition financing model — senior debt + equity bridge analyzed" },
        { status: "staged",       text: "Target EBITDA and leverage ratio analysis complete" },
        { status: "staged",       text: "Synergy modeling — Year 1, Year 3, and Year 5 projections ready" },
        { status: "staged",       text: "Board financial approval package assembled — all supporting schedules ready" },
        { status: "staged",       text: "Debt capacity and covenant analysis complete" },
        { status: "pending-auth", text: "Bank group notification to begin financing — awaiting CEO sign-off" },
      ],
      stakeholders: ["CEO — Sarah Chen", "Goldman Sachs — Banking Team", "Corporate Counsel", "Board Audit Committee Chair", "Rating Agency contacts pre-identified"],
      authRequired: "Awaiting CEO authorization — financial package activates on approval",
      tasksTotal: 19,
      stagedAgo: "12 minutes ago",
      responseWindow: "47 hours 48 minutes remaining on LOI window",
      note: "Financing is modeled, synergies are quantified, and the banking team is briefed. Activates immediately upon CEO authorization of the LOI.",
    },
    gc: {
      to: "Anita Mehta, General Counsel",
      subject: "[PROTOCOL #058 ACTIVATED] M&A — Waypoint Analytics — Legal Package Staged",
      tasks: [
        { status: "staged",       text: "LOI legal review complete — 4 risk items flagged with recommended positions" },
        { status: "staged",       text: "Exclusivity negotiation position prepared — 30-day window strategy ready" },
        { status: "staged",       text: "HSR antitrust pre-filing analysis complete" },
        { status: "staged",       text: "NDAs executed and filed — deal team access protocols ready" },
        { status: "staged",       text: "Board authorization resolution prepared" },
        { status: "pending-auth", text: "Regulatory pre-notification packages — pending CEO LOI sign-off" },
      ],
      stakeholders: ["CEO — Sarah Chen", "M&A Counsel — Kirkland & Ellis", "CFO — James Park", "Investment Banker — Goldman Sachs", "Target's Counsel — identified"],
      authRequired: "Legal package activates on CEO LOI authorization",
      tasksTotal: 19,
      stagedAgo: "12 minutes ago",
      responseWindow: "47 hours 48 minutes remaining on LOI window",
      note: "Legal review is complete. LOI is clean with 4 flagged items and recommended positions. Antitrust pre-screening done. Kirkland & Ellis deal team is briefed and standing by.",
    },
  },
  gtm: {
    cmo: {
      to: "Patricia Osei, Chief Marketing Officer",
      subject: "[PROTOCOL #089 ACTIVATED] GTM Acceleration Sprint — 30-Day Window — Authorization Required",
      tasks: [
        { status: "staged",       text: "Competitive displacement campaign assets prepared — 6 ad variants ready" },
        { status: "staged",       text: "Analyst briefing packages staged — Gartner, Forrester contacts pre-identified" },
        { status: "staged",       text: "PR launch sequence drafted — embargo timeline and journalist contacts ready" },
        { status: "staged",       text: "Sales enablement content complete — 14 competitive battlecards updated" },
        { status: "staged",       text: "Event presence plan staged — 3 upcoming conferences identified for activation" },
        { status: "pending-auth", text: "Campaign budget release — requires CMO + CRO joint authorization" },
      ],
      stakeholders: ["CEO — Sarah Chen", "CRO — Monica Torres", "Head of Sales Engineering", "PR Agency — Weber Shandwick", "Analyst Relations Lead"],
      authRequired: "CMO + CRO joint authorization required to release campaign budget",
      tasksTotal: 18,
      stagedAgo: "28 minutes ago",
      responseWindow: "29 days 23 hours remaining in launch window",
      note: "Every marketing asset is ready. 6 ad variants, analyst briefings, PR embargo calendar, and 14 sales battlecards. One authorization and the full campaign deploys simultaneously.",
    },
    cro: {
      to: "Monica Torres, Chief Revenue Officer",
      subject: "[PROTOCOL #089 ACTIVATED] GTM Sprint — Sales Team Mobilization Package Ready",
      tasks: [
        { status: "staged",       text: "Enterprise pursuit list prepared — 847 target accounts identified and prioritized" },
        { status: "staged",       text: "SDR outreach sequences drafted and loaded — ready to activate" },
        { status: "staged",       text: "Competitive displacement script — direct play on competitor's install base" },
        { status: "staged",       text: "Partner channel alert drafted — reseller network notification ready" },
        { status: "staged",       text: "Sales SPIFF structure designed and modeled — 30-day accelerator plan ready" },
        { status: "pending-auth", text: "SDR activation and partner notification — requires CMO + CRO authorization" },
      ],
      stakeholders: ["CMO — Patricia Osei", "VP of Sales", "Channel Partners Team", "Sales Operations", "CEO — Sarah Chen"],
      authRequired: "CRO + CMO joint authorization required",
      tasksTotal: 18,
      stagedAgo: "28 minutes ago",
      responseWindow: "29 days 23 hours remaining in launch window",
      note: "847 target accounts prioritized. SDR sequences loaded. Partner network briefed. The sales motion is pre-staged end to end — your authorization triggers simultaneous activation.",
    },
    ceo: {
      to: "Sarah Chen, Chief Executive Officer",
      subject: "[PROTOCOL #089 ACTIVATED] GTM Sprint — Board-Authorized — Executive Summary",
      tasks: [
        { status: "staged",       text: "Board authorization memo prepared — budget release and timeline confirmed" },
        { status: "staged",       text: "Competitive intelligence summary — gap analysis and opportunity sizing" },
        { status: "staged",       text: "Executive QBR update prepared — GTM acceleration impact on annual plan" },
        { status: "staged",       text: "Investor update draft prepared — growth catalyst announcement ready" },
        { status: "staged",       text: "Press release drafted — market position announcement ready for approval" },
        { status: "pending-auth", text: "Press release and investor update — requires CEO authorization" },
      ],
      stakeholders: ["CMO — Patricia Osei", "CRO — Monica Torres", "Board Chair — Richard Alvarez", "Head of IR — Carolyn Wu", "PR Agency lead"],
      authRequired: "CEO authorization required for external communications",
      tasksTotal: 18,
      stagedAgo: "28 minutes ago",
      responseWindow: "29 days 23 hours remaining in launch window",
      note: "The GTM motion is executing under CMO/CRO authority. Your decisions: investor update, press release, and board communication. All drafted, reviewed, and staged for your approval.",
    },
  },
};

export default function AlertPreview() {
  const [scenarioId, setScenarioId] = useState("activist");
  const [roleId, setRoleId]         = useState("ceo");

  const scenario = SCENARIOS.find(s => s.id === scenarioId)!;
  const email    = EMAILS[scenarioId]?.[roleId] ?? EMAILS[scenarioId]?.[scenario.roles[0].id];
  const role     = scenario.roles.find(r => r.id === roleId) ?? scenario.roles[0];

  function selectScenario(id: string) {
    setScenarioId(id);
    const sc = SCENARIOS.find(s => s.id === id)!;
    setRoleId(sc.roles[0].id);
  }

  const stagedCount  = email.tasks.filter(t => t.status === "staged").length;
  const pendingCount = email.tasks.filter(t => t.status === "pending-auth").length;

  return (
    <div style={{ background: NAVY, minHeight: "100vh", paddingTop: 70 }}>
      <StandardNav />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section style={{
        borderBottom: `2px solid ${GOLD}`,
        padding: "48px 0 40px",
        background: "linear-gradient(180deg, rgba(201,168,76,0.06) 0%, transparent 100%)",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 28, height: 1.5, background: GOLD }} />
            <span style={{ ...BC, fontSize: 9, fontWeight: 800, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: GOLD }}>
              Executive Alert Preview
            </span>
          </div>
          <h1 style={{ ...CG, fontSize: "clamp(28px, 3.5vw, 46px)", fontWeight: 700, color: "#fff", lineHeight: 1.2, margin: "0 0 14px" }}>
            This Is What Lands in Your Inbox<br />
            <span style={{ color: GOLD, fontStyle: "italic" }}>12 Minutes After the Situation Fires.</span>
          </h1>
          <p style={{ ...BC, fontSize: 16, color: "rgba(255,255,255,0.55)", maxWidth: 560, margin: "0 0 8px", lineHeight: 1.6 }}>
            Every task assigned. Every stakeholder notified. Every document prepared. Before you read the first line of this email — the response was already staged.
          </p>
          <p style={{ ...BC, fontSize: 12, color: "rgba(255,255,255,0.30)", maxWidth: 520, lineHeight: 1.5 }}>
            Select a scenario and a C-suite role to see that executive's exact alert.
          </p>
        </div>
      </section>

      {/* ── SCENARIO SELECTOR ─────────────────────────────────────────────── */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(0,0,0,0.18)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px", display: "flex", gap: 0, overflowX: "auto" as const }}>
          {SCENARIOS.map(sc => {
            const Icon = sc.icon;
            const active = sc.id === scenarioId;
            return (
              <button
                key={sc.id}
                onClick={() => selectScenario(sc.id)}
                style={{
                  ...BC,
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "14px 22px",
                  background: "transparent", border: "none",
                  borderBottom: active ? `2px solid ${sc.domainColor}` : "2px solid transparent",
                  color: active ? "#fff" : "rgba(255,255,255,0.40)",
                  cursor: "pointer",
                  transition: "all 0.13s",
                  whiteSpace: "nowrap" as const,
                  marginBottom: -1,
                  flexShrink: 0,
                }}
              >
                <Icon size={13} style={{ color: active ? sc.domainColor : "rgba(255,255,255,0.30)" }} />
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" as const }}>
                  {sc.name}
                </span>
                <span style={{
                  ...BC, fontSize: 8, fontWeight: 800, letterSpacing: "0.15em",
                  padding: "1px 6px",
                  background: sc.urgency === "CRITICAL" ? "rgba(180,60,50,0.20)" : "rgba(201,168,76,0.15)",
                  border: `1px solid ${sc.urgency === "CRITICAL" ? "rgba(180,60,50,0.40)" : "rgba(201,168,76,0.35)"}`,
                  color: sc.urgencyColor,
                }}>
                  {sc.urgency}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── MAIN CONTENT ──────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 40px 80px", display: "grid", gridTemplateColumns: "340px 1fr", gap: 24 }}>

        {/* ── LEFT: INBOX PANEL ─────────────────────────────────────────── */}
        <div>
          {/* Inbox header */}
          <div style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.09)",
            borderBottom: "none",
            padding: "14px 18px",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <Mail size={14} style={{ color: GOLD }} />
            <span style={{ ...BC, fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", color: GOLD }}>READINESS OS — ALERTS</span>
          </div>

          {/* Situation summary */}
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.09)",
            borderBottom: "none",
            padding: "14px 18px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: scenario.urgencyColor, flexShrink: 0 }} />
              <span style={{ ...BC, fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", color: scenario.urgencyColor, textTransform: "uppercase" as const }}>
                {scenario.urgency} — {scenario.timestamp}
              </span>
            </div>
            <p style={{ ...BC, fontSize: 12, color: "rgba(255,255,255,0.60)", lineHeight: 1.45, margin: 0 }}>
              {scenario.situation}
            </p>
            <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{
                ...BC, fontSize: 8, fontWeight: 800, letterSpacing: "0.14em",
                padding: "2px 7px",
                background: `${scenario.domainColor}18`,
                border: `1px solid ${scenario.domainColor}40`,
                color: scenario.domainColor,
              }}>
                {scenario.domain}
              </span>
              <span style={{ ...BC, fontSize: 9, color: "rgba(255,255,255,0.28)" }}>Protocol {scenario.protocol}</span>
            </div>
          </div>

          {/* Role list */}
          {scenario.roles.map(r => {
            const em      = EMAILS[scenarioId]?.[r.id];
            const active  = r.id === roleId;
            if (!em) return null;
            return (
              <button
                key={r.id}
                onClick={() => setRoleId(r.id)}
                style={{
                  width: "100%", textAlign: "left" as const,
                  background: active ? "rgba(201,168,76,0.08)" : "rgba(255,255,255,0.02)",
                  border: "1px solid",
                  borderColor: active ? "rgba(201,168,76,0.35)" : "rgba(255,255,255,0.07)",
                  borderTop: "none",
                  padding: "14px 18px",
                  cursor: "pointer",
                  transition: "all 0.13s",
                  display: "block",
                  borderLeft: active ? `3px solid ${GOLD}` : "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                  <span style={{ ...BC, fontSize: 10, fontWeight: 800, color: active ? GOLD : "rgba(255,255,255,0.55)", letterSpacing: "0.08em" }}>
                    {r.label}
                  </span>
                  <span style={{ ...BC, fontSize: 9, color: "rgba(255,255,255,0.28)" }}>
                    {scenario.timestamp}
                  </span>
                </div>
                <div style={{ ...BC, fontSize: 11, color: active ? "rgba(255,255,255,0.80)" : "rgba(255,255,255,0.45)", fontWeight: active ? 700 : 400, marginBottom: 4, lineHeight: 1.3 }}>
                  {em.subject.replace("[PROTOCOL", "").split("]")[1]?.trim() ?? em.subject.slice(0, 50)}
                </div>
                <div style={{ ...BC, fontSize: 10, color: "rgba(255,255,255,0.30)", lineHeight: 1.4 }}>
                  {em.tasksTotal} tasks pre-staged · {r.title.split(",")[0]}
                </div>
              </button>
            );
          })}

          {/* Bottom CTA */}
          <div style={{
            marginTop: 20,
            background: `${TEAL}10`,
            border: `1px solid ${TEAL}28`,
            padding: "16px 18px",
          }}>
            <p style={{ ...BC, fontSize: 11, color: "rgba(255,255,255,0.50)", lineHeight: 1.5, margin: "0 0 10px" }}>
              These are 4 of 180 pre-staged situations in the Readiness OS library.
            </p>
            <Link href="/demo-hub" style={{ textDecoration: "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ ...BC, fontSize: 10, fontWeight: 800, color: TEAL, letterSpacing: "0.12em" }}>SEE ALL SCENARIOS</span>
                <ArrowRight size={11} style={{ color: TEAL }} />
              </div>
            </Link>
          </div>
        </div>

        {/* ── RIGHT: EMAIL BODY ─────────────────────────────────────────── */}
        <div style={{
          background: "#FAFAF8",
          border: "1px solid rgba(0,0,0,0.10)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
        }}>
          {/* Email client chrome */}
          <div style={{
            background: "#F0EDE4",
            borderBottom: "1px solid rgba(0,0,0,0.10)",
            padding: "10px 20px",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5F57" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FEBC2E" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28C840" }} />
            <div style={{ flex: 1, height: 22, background: "rgba(0,0,0,0.06)", borderRadius: 4, marginLeft: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ ...BC, fontSize: 9, color: "rgba(0,0,0,0.35)", letterSpacing: "0.06em" }}>
                alerts@readinessos.vaughnmartin.com
              </span>
            </div>
          </div>

          {/* Alert banner */}
          <div style={{
            background: scenario.urgency === "CRITICAL" ? "#B43C32" : "#8B6914",
            padding: "10px 24px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(255,255,255,0.80)" }} />
              <span style={{ ...BC, fontSize: 10, fontWeight: 800, letterSpacing: "0.22em", color: "#fff", textTransform: "uppercase" as const }}>
                PROTOCOL {scenario.protocol} ACTIVATED — RESPONSE STAGED
              </span>
            </div>
            <span style={{ ...BC, fontSize: 9, color: "rgba(255,255,255,0.65)", letterSpacing: "0.08em" }}>
              {scenario.timestamp}
            </span>
          </div>

          <div style={{ padding: "24px 28px" }}>
            {/* Email header */}
            <div style={{ borderBottom: "1px solid rgba(0,0,0,0.08)", paddingBottom: 18, marginBottom: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "56px 1fr", gap: "5px 0" }}>
                {[
                  ["From",    "Readiness OS Monitoring <alerts@readinessos.vaughnmartin.com>"],
                  ["To",      email.to],
                  ["Date",    scenario.timestamp + " — Protocol staged " + email.stagedAgo],
                  ["Subject", email.subject],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: "contents" }}>
                    <span style={{ ...BC, fontSize: 10, fontWeight: 800, color: "rgba(0,0,0,0.35)", letterSpacing: "0.06em", lineHeight: "1.6" }}>
                      {label}:
                    </span>
                    <span style={{
                      ...BC,
                      fontSize: label === "Subject" ? 12 : 11,
                      fontWeight: label === "Subject" ? 800 : 400,
                      color: label === "Subject" ? "#0A0F2E" : "rgba(0,0,0,0.65)",
                      lineHeight: "1.6",
                    }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Staging stats row */}
            <div style={{ display: "flex", gap: 12, marginBottom: 22, flexWrap: "wrap" as const }}>
              {[
                { value: String(email.tasksTotal), label: "Tasks Pre-Staged", color: TEAL,   bg: `${TEAL}12`,   border: `${TEAL}30` },
                { value: String(stagedCount),      label: "Ready to Execute", color: TEAL,   bg: `${TEAL}10`,   border: `${TEAL}25` },
                { value: String(pendingCount),      label: "Awaiting Auth",   color: "#B43C32", bg: "rgba(180,60,50,0.08)", border: "rgba(180,60,50,0.25)" },
                { value: email.responseWindow,     label: "Response Window",  color: NAVY,   bg: "rgba(10,15,46,0.06)", border: "rgba(10,15,46,0.15)" },
              ].map(b => (
                <div key={b.label} style={{
                  flex: "1 1 auto",
                  padding: "10px 14px",
                  background: b.bg,
                  border: `1px solid ${b.border}`,
                  minWidth: 110,
                }}>
                  <div style={{ ...CG, fontSize: 16, fontWeight: 700, color: b.color, lineHeight: 1.1, marginBottom: 2 }}>{b.value}</div>
                  <div style={{ ...BC, fontSize: 9, fontWeight: 700, color: "rgba(0,0,0,0.40)", letterSpacing: "0.1em", textTransform: "uppercase" as const }}>{b.label}</div>
                </div>
              ))}
            </div>

            {/* Situation summary */}
            <div style={{
              background: `${NAVY}08`,
              border: `1px solid ${NAVY}15`,
              borderLeft: `3px solid ${NAVY}`,
              padding: "14px 18px",
              marginBottom: 22,
            }}>
              <div style={{ ...BC, fontSize: 9, fontWeight: 800, letterSpacing: "0.16em", color: "rgba(0,0,0,0.40)", textTransform: "uppercase" as const, marginBottom: 6 }}>
                Situation Summary
              </div>
              <p style={{ ...BC, fontSize: 13, color: NAVY, lineHeight: 1.55, margin: 0, fontWeight: 600 }}>
                {scenario.situation}
              </p>
            </div>

            {/* Tasks */}
            <div style={{ marginBottom: 22 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span style={{ ...BC, fontSize: 9, fontWeight: 800, letterSpacing: "0.16em", color: "rgba(0,0,0,0.40)", textTransform: "uppercase" as const }}>
                  Pre-Staged Tasks
                </span>
                <span style={{ ...BC, fontSize: 8, color: "rgba(0,0,0,0.30)" }}>
                  — showing 6 of {email.tasksTotal}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 6 }}>
                {email.tasks.map((task, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex", alignItems: "flex-start", gap: 10,
                      padding: "9px 12px",
                      background: task.status === "pending-auth" ? "rgba(180,60,50,0.05)" : "rgba(43,138,110,0.04)",
                      border: `1px solid ${task.status === "pending-auth" ? "rgba(180,60,50,0.20)" : "rgba(43,138,110,0.15)"}`,
                    }}
                  >
                    {task.status === "staged" ? (
                      <CheckSquare size={14} style={{ color: TEAL, flexShrink: 0, marginTop: 1 }} />
                    ) : (
                      <Lock size={14} style={{ color: "#B43C32", flexShrink: 0, marginTop: 1 }} />
                    )}
                    <span style={{ ...BC, fontSize: 12, color: task.status === "pending-auth" ? "#B43C32" : "rgba(0,0,0,0.70)", lineHeight: 1.45, fontWeight: task.status === "pending-auth" ? 700 : 400 }}>
                      {task.text}
                    </span>
                    <span style={{ ...BC, fontSize: 8, fontWeight: 800, letterSpacing: "0.1em", color: task.status === "staged" ? TEAL : "#B43C32", flexShrink: 0, marginLeft: "auto", textTransform: "uppercase" as const }}>
                      {task.status === "staged" ? "STAGED" : "AUTH REQUIRED"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stakeholders */}
            <div style={{ marginBottom: 22 }}>
              <div style={{ ...BC, fontSize: 9, fontWeight: 800, letterSpacing: "0.16em", color: "rgba(0,0,0,0.40)", textTransform: "uppercase" as const, marginBottom: 10 }}>
                Stakeholders Already Notified
              </div>
              <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6 }}>
                {email.stakeholders.map((s, i) => (
                  <div key={i} style={{
                    ...BC, fontSize: 10, color: NAVY,
                    background: "rgba(10,15,46,0.05)",
                    border: "1px solid rgba(10,15,46,0.12)",
                    padding: "4px 10px",
                    display: "flex", alignItems: "center", gap: 6,
                  }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: TEAL, flexShrink: 0 }} />
                    {s}
                  </div>
                ))}
              </div>
            </div>

            {/* Authorization required */}
            <div style={{
              background: NAVY,
              padding: "18px 22px",
              display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20,
              marginBottom: 20,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ ...BC, fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", color: GOLD, textTransform: "uppercase" as const, marginBottom: 6 }}>
                  Authorization Required
                </div>
                <p style={{ ...BC, fontSize: 12, color: "rgba(255,255,255,0.75)", lineHeight: 1.5, margin: 0 }}>
                  {email.authRequired}
                </p>
              </div>
              <div style={{
                ...BC, fontSize: 10, fontWeight: 800, letterSpacing: "0.14em",
                textTransform: "uppercase" as const,
                background: GOLD, color: NAVY,
                padding: "10px 18px",
                whiteSpace: "nowrap" as const,
                flexShrink: 0,
                cursor: "default",
              }}>
                Authorize Response →
              </div>
            </div>

            {/* Note */}
            <div style={{
              background: `${TEAL}08`,
              borderLeft: `3px solid ${TEAL}`,
              padding: "12px 16px",
              marginBottom: 24,
            }}>
              <p style={{ ...BC, fontSize: 12, color: "rgba(0,0,0,0.58)", lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>
                {email.note}
              </p>
            </div>

            {/* Footer */}
            <div style={{ borderTop: "1px solid rgba(0,0,0,0.08)", paddingTop: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ ...BC, fontSize: 9, fontWeight: 800, letterSpacing: "0.14em", color: "rgba(0,0,0,0.35)", textTransform: "uppercase" as const, marginBottom: 2 }}>
                    VaughnMartin · Readiness OS
                  </div>
                  <div style={{ ...BC, fontSize: 9, color: "rgba(0,0,0,0.25)" }}>
                    When the situation arrives — the response is ready before the trigger fires.
                  </div>
                </div>
                <div style={{ ...CG, fontSize: 11, color: "rgba(0,0,0,0.30)", fontStyle: "italic" }}>
                  Ante Ignem Paratus
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM CTA ────────────────────────────────────────────────────── */}
      <section style={{
        borderTop: "1px solid rgba(201,168,76,0.18)",
        padding: "48px 0 60px",
        background: "rgba(201,168,76,0.03)",
      }}>
        <div style={{ maxWidth: 660, margin: "0 auto", padding: "0 40px", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 1, background: GOLD }} />
            <span style={{ ...BC, fontSize: 9, fontWeight: 800, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: GOLD }}>
              Founding Partner Program
            </span>
            <div style={{ width: 32, height: 1, background: GOLD }} />
          </div>
          <h2 style={{ ...CG, fontSize: "clamp(22px, 2.8vw, 34px)", fontWeight: 700, color: "#fff", margin: "0 0 12px", lineHeight: 1.25 }}>
            Your organization's alerts would be specific to your situations, your stakeholders, and your protocols.
          </h2>
          <p style={{ ...BC, fontSize: 15, color: "rgba(255,255,255,0.50)", margin: "0 0 28px", lineHeight: 1.6 }}>
            In 90 days, we map your top 15 situations, stage your first 3 Readiness Protocols, and run your first live trigger together.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 12, justifyContent: "center" }}>
            <Link href="/request-access" style={{ textDecoration: "none" }}>
              <div style={{
                ...BC, fontSize: 11, fontWeight: 800, letterSpacing: "0.2em",
                textTransform: "uppercase" as const,
                color: NAVY, background: GOLD, border: `1px solid ${GOLD}`,
                padding: "13px 28px", cursor: "pointer",
              }}>
                Apply for Founding Partner Access
              </div>
            </Link>
            <Link href="/demo-hub" style={{ textDecoration: "none" }}>
              <div style={{
                ...BC, fontSize: 11, fontWeight: 800, letterSpacing: "0.2em",
                textTransform: "uppercase" as const,
                color: GOLD, background: "transparent", border: "1px solid rgba(201,168,76,0.40)",
                padding: "13px 28px", cursor: "pointer",
              }}>
                See All Scenarios →
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
