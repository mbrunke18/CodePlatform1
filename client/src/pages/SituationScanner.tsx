import { useState, useEffect } from "react";
import { Link } from "wouter";
import { VaughnMartinLogo } from "@/components/VaughnMartinLogo";
import { updatePageMetadata } from "@/lib/seo";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const IVORY = "#F0EDE4";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
const BC: React.CSSProperties = { fontFamily: "'Barlow Condensed', 'Barlow', sans-serif" };
const DM: React.CSSProperties = { fontFamily: "'Barlow', sans-serif" };

type Domain = "GROWTH & POSITIONING" | "RISK & RESILIENCE" | "TRANSFORMATION";

interface Task { role: string; action: string; minute: string; }
interface Stakeholder { name: string; role: string; }
interface Situation {
  id: string;
  domain: Domain;
  name: string;
  description: string;
  protocol: string;
  protocolNum: number;
  tasks: Task[];
  stakeholders: Stakeholder[];
  withoutDelay: string;
  timelineLabel: string;
}

const SITUATIONS: Situation[] = [
  // ── GROWTH & POSITIONING ─────────────────────────────────────────────────
  {
    id: "competitor-launch",
    domain: "GROWTH & POSITIONING",
    name: "Competitor Product Launch",
    description: "Competitor announces flagship product targeting your core accounts",
    protocol: "Competitor Displacement Sprint",
    protocolNum: 31,
    tasks: [
      { role: "Chief Strategy Officer", action: "Pull full competitor announcement — exact specs, pricing, target segment, and distribution partners", minute: "1:30" },
      { role: "Chief Revenue Officer", action: "Deploy sales battle card to all AEs — specific objection handlers for every competitor claim, ready now", minute: "3:00" },
      { role: "CEO + CRO", action: "Personal calls to top 20 enterprise accounts before competitor follow-up — secure the relationship first", minute: "4:00" },
      { role: "Chief Product Officer", action: "Run competitive feature gap analysis — where we win, where we lose, actual switching cost for shared accounts", minute: "5:00" },
      { role: "CMO", action: "Counter-positioning campaign on standby — hold unless competitor gains meaningful traction in key accounts", minute: "7:00" },
      { role: "CEO + CPO", action: "Roadmap acceleration evaluation — pull forward any features that close the competitive gap, board briefed same day", minute: "12:00" },
    ],
    stakeholders: [
      { name: "Chief Revenue Officer", role: "Sales activation lead" },
      { name: "Chief Strategy Officer", role: "Competitive intelligence" },
      { name: "Chief Product Officer", role: "Roadmap response" },
    ],
    withoutDelay: "3–5 days to align sales, product, and leadership on a response",
    timelineLabel: "Sales battle card deployed in 3 minutes",
  },
  {
    id: "market-entry",
    domain: "GROWTH & POSITIONING",
    name: "Market Entry Window",
    description: "Regulatory change opens new segment — 90-day first-mover window closing",
    protocol: "Market Entry Response",
    protocolNum: 22,
    tasks: [
      { role: "General Counsel", action: "Pull final rule text — confirm effective date, eligibility criteria, compliance requirements, and timeline", minute: "1:30" },
      { role: "Chief Strategy Officer", action: "Run market sizing: TAM of newly opened segment, first-mover window, competitive landscape entering", minute: "2:00" },
      { role: "CFO", action: "Pre-approved entry budget released — investment bank engagement authorized, capital staged and accessible", minute: "3:00" },
      { role: "CEO", action: "Board briefed on entry opportunity — full authorization for accelerated investment secured same day", minute: "4:00" },
      { role: "CHRO + CEO", action: "Identify and assign market entry lead — internal talent or emergency external search with retained firm on standby", minute: "6:00" },
      { role: "Chief Revenue Officer", action: "Priority outreach to 20 existing customers already operating in the new segment — Day 1 expansion conversations", minute: "12:00" },
    ],
    stakeholders: [
      { name: "General Counsel", role: "Regulatory confirmation" },
      { name: "CFO", role: "Capital authorization" },
      { name: "Chief Strategy Officer", role: "Market sizing and entry" },
    ],
    withoutDelay: "30-day committee cycle to authorize capital deployment",
    timelineLabel: "Entry budget authorized and capital staged in 3 minutes",
  },
  {
    id: "ma-response",
    domain: "GROWTH & POSITIONING",
    name: "M&A Rapid Response",
    description: "Acquisition opportunity surfaces — LOI window is 48 hours",
    protocol: "M&A Rapid Response",
    protocolNum: 58,
    tasks: [
      { role: "CFO", action: "Structure LOI terms — price range, exclusivity period, key conditions, and walkaway provisions pre-defined", minute: "1:30" },
      { role: "General Counsel", action: "Engage M&A counsel — due diligence workstreams activated, NDA executed, data room access protocol ready", minute: "2:00" },
      { role: "CEO", action: "Board authorization obtained for exploratory LOI — pre-approved parameters eliminate the approval cycle", minute: "3:00" },
      { role: "Chief Strategy Officer", action: "Competitive rationale validated — strategic fit, revenue synergies, and integration risk scored against pre-built model", minute: "5:00" },
      { role: "Chief IR Officer", action: "Shareholder communication strategy prepared — disclosure timing, messaging, and analyst briefing sequence mapped", minute: "8:00" },
      { role: "COO", action: "Integration readiness assessment — Day 1 operational plan, key dependencies, and 90-day integration milestones staged", minute: "12:00" },
    ],
    stakeholders: [
      { name: "CFO", role: "Deal structure and terms" },
      { name: "General Counsel", role: "Legal and due diligence" },
      { name: "Chief Strategy Officer", role: "Strategic rationale" },
    ],
    withoutDelay: "4–6 weeks to mobilize M&A team and obtain board authorization",
    timelineLabel: "LOI structure and board authorization in 3 minutes",
  },
  {
    id: "activist-investor",
    domain: "GROWTH & POSITIONING",
    name: "Activist Investor Stake",
    description: "9.8% stake disclosed — board seat demanded via 13D filing",
    protocol: "Activist Investor Defense",
    protocolNum: 47,
    tasks: [
      { role: "General Counsel", action: "Pull Schedule 13D from SEC EDGAR — confirm stake %, stated intent, and all associated entities", minute: "1:30" },
      { role: "CFO", action: "Run activist profile — past campaigns, win rate, typical demands (board seat, spin-off, cost cuts, dividend)", minute: "2:00" },
      { role: "Board Chair", action: "Convene emergency board session — brief all directors before activist makes any public statement", minute: "3:00" },
      { role: "CEO", action: "Retain M&A defense counsel, proxy solicitor, and IR advisor — all three before activist makes first contact", minute: "4:00" },
      { role: "Chief IR Officer", action: "Schedule calls with top 10 institutional holders within 24 hours — lead with value creation plan", minute: "6:00" },
      { role: "CMO + Legal", action: "Draft company response: confident, forward-looking, data-driven — pre-approved for rapid release", minute: "12:00" },
    ],
    stakeholders: [
      { name: "General Counsel", role: "Regulatory and legal response" },
      { name: "Board Chair", role: "Board mobilization" },
      { name: "Chief IR Officer", role: "Institutional investor outreach" },
    ],
    withoutDelay: "2–3 weeks to retain advisors and align the full board",
    timelineLabel: "Defense counsel retained and board convened in 4 minutes",
  },

  // ── RISK & RESILIENCE ────────────────────────────────────────────────────
  {
    id: "ransomware",
    domain: "RISK & RESILIENCE",
    name: "Ransomware Attack",
    description: "Critical systems encrypted — operations at risk, ransom demand active",
    protocol: "Ransomware Response",
    protocolNum: 23,
    tasks: [
      { role: "CISO", action: "Confirm ransomware variant — classify: locker / crypto / double-extortion. Determine data exfiltration status", minute: "1:00" },
      { role: "CTO", action: "IMMEDIATE: Physically isolate affected network segments. Do NOT reboot — preserves memory for forensics", minute: "1:30" },
      { role: "General Counsel", action: "Engage FBI Cyber Division and notify cyber insurer. Do NOT authorize payment without insurer sign-off", minute: "2:00" },
      { role: "COO", action: "Activate Business Continuity Plan — manual workarounds for all revenue-critical systems initiated", minute: "3:00" },
      { role: "CTO", action: "Validate backup integrity — confirm offline/immutable backups exist and establish Recovery Time Objective", minute: "4:00" },
      { role: "CEO + CFO + Legal", action: "Payment decision with all required parties: backup status, OFAC sanctions check, insurance guidance", minute: "6:00" },
    ],
    stakeholders: [
      { name: "CISO", role: "Incident command" },
      { name: "General Counsel", role: "FBI liaison and insurer" },
      { name: "COO", role: "Business continuity" },
    ],
    withoutDelay: "3–5 days to assemble incident response team and align on strategy",
    timelineLabel: "Network isolated, FBI engaged, BCP activated in 3 minutes",
  },
  {
    id: "supply-chain",
    domain: "RISK & RESILIENCE",
    name: "Supply Chain Collapse",
    description: "Primary supplier bankrupt — 14-day production risk across 6 facilities",
    protocol: "Supply Chain Disruption Response",
    protocolNum: 12,
    tasks: [
      { role: "COO", action: "Pull disruption data: affected supplier tier, % supply at risk, lead time impact, geographic scope of disruption", minute: "1:30" },
      { role: "CFO", action: "Run revenue-at-risk model: production days affected × daily revenue. Apply buffer stock coverage remaining", minute: "2:00" },
      { role: "Chief Procurement Officer", action: "Issue emergency POs to top 3 alternate suppliers simultaneously — pre-negotiated emergency rates activated", minute: "4:00" },
      { role: "Head of Logistics", action: "Reroute inbound freight. Expedite air freight for critical components where margin supports", minute: "5:00" },
      { role: "CEO + CRO", action: "Personally call top 10 affected enterprise customers — offer concrete recovery date and executive contact", minute: "7:00" },
      { role: "CFO", action: "File business interruption insurance claim. Document all incremental costs for recovery and potential litigation", minute: "12:00" },
    ],
    stakeholders: [
      { name: "COO", role: "Operations and continuity" },
      { name: "Chief Procurement Officer", role: "Alternate supplier activation" },
      { name: "CFO", role: "Financial exposure and claims" },
    ],
    withoutDelay: "5–7 days to assess full impact and qualify alternate suppliers",
    timelineLabel: "Alternate suppliers activated and customers contacted in 7 minutes",
  },
  {
    id: "regulatory",
    domain: "RISK & RESILIENCE",
    name: "DOJ Investigation Opened",
    description: "Civil Investigative Demand received — 30-day response window, disclosure obligations",
    protocol: "DOJ Investigation Response",
    protocolNum: 78,
    tasks: [
      { role: "General Counsel", action: "Pull full CID text — extract: effective date, requirements, enforcement mechanism, and disclosure obligations", minute: "1:30" },
      { role: "Chief Compliance Officer", action: "Run gap assessment: what is compliant today vs. what requires change. Prioritize by penalty exposure", minute: "2:00" },
      { role: "General Counsel", action: "Issue litigation hold — preserve all relevant documents, communications, and data across all affected systems", minute: "3:00" },
      { role: "CISO + CTO", action: "Assess technology compliance: data residency, encryption standards, access controls, audit logging requirements", minute: "4:00" },
      { role: "CEO", action: "Brief board on investigation, compliance timeline, and budget. Obtain board endorsement of response approach", minute: "7:00" },
      { role: "Chief Compliance Officer", action: "File acknowledgment with DOJ. Establish ongoing dialogue channel with regulatory body", minute: "11:00" },
    ],
    stakeholders: [
      { name: "General Counsel", role: "Legal response and privilege" },
      { name: "Chief Compliance Officer", role: "Gap assessment and roadmap" },
      { name: "CEO", role: "Board and regulator liaison" },
    ],
    withoutDelay: "2–4 weeks to mobilize legal, compliance, and executive teams",
    timelineLabel: "Litigation hold issued and board briefed in 7 minutes",
  },
  {
    id: "brand-crisis",
    domain: "RISK & RESILIENCE",
    name: "Brand Crisis",
    description: "Viral social media incident — sentiment collapsing, media pickup accelerating",
    protocol: "Brand Crisis Response",
    protocolNum: 44,
    tasks: [
      { role: "CMO", action: "Pull crisis monitoring data: source, velocity (shares/hour), sentiment trajectory, and media pickup rate", minute: "1:30" },
      { role: "CEO", action: "Hold-or-respond decision with CMO and Legal. Every 30-min delay in viral crisis costs 40% more amplification", minute: "2:00" },
      { role: "CMO + Legal", action: "Draft 3-sentence holding statement: what you know, what you are doing, when you will say more. No speculation", minute: "3:00" },
      { role: "Head of Communications", action: "Simultaneous release across social, web, email, and media — all channels live at the same moment", minute: "5:00" },
      { role: "CHRO", action: "Employee briefing: what happened, what the company is saying, how to respond if asked by customers", minute: "6:00" },
      { role: "Chief Revenue Officer", action: "Brief top 20 enterprise customers before their boards ask them about the incident", minute: "7:00" },
    ],
    stakeholders: [
      { name: "CMO", role: "Crisis messaging and monitoring" },
      { name: "General Counsel", role: "Legal review and disclosure" },
      { name: "Head of Communications", role: "Multi-channel distribution" },
    ],
    withoutDelay: "48–72 hours to align messaging across legal, comms, and leadership",
    timelineLabel: "Holding statement approved and distributed in 5 minutes",
  },

  // ── TRANSFORMATION ───────────────────────────────────────────────────────
  {
    id: "executive-departure",
    domain: "TRANSFORMATION",
    name: "Key Executive Departure",
    description: "CTO + 2 VPs resign — competitors actively recruiting your remaining leadership",
    protocol: "Executive Departure Response",
    protocolNum: 67,
    tasks: [
      { role: "CHRO", action: "Pull flight risk model — all employees >70% departure probability, engagement score, comp percentile, manager quality", minute: "1:30" },
      { role: "CEO", action: "Identify 25 mission-critical roles where departure causes immediate operational or customer impact", minute: "2:00" },
      { role: "CEO", action: "Personal calls to all Priority 1 retention risks within 48 hours — listen first, then vision, then compensation", minute: "3:00" },
      { role: "CHRO", action: "Design 18-month retention package for top 25: equity acceleration, role expansion, flexibility agreements", minute: "4:00" },
      { role: "CEO", action: "Make one visible, immediate structural change addressing the top departure driver — decisions, not promises", minute: "7:00" },
      { role: "CFO + CHRO", action: "Establish talent health scorecard with board-level quarterly reporting — make retention a governance issue", minute: "12:00" },
    ],
    stakeholders: [
      { name: "CHRO", role: "Flight risk analysis and retention" },
      { name: "CEO", role: "Executive retention calls" },
      { name: "CFO", role: "Retention package funding" },
    ],
    withoutDelay: "2–3 weeks to assess impact and begin retention conversations",
    timelineLabel: "Flight risk model pulled and retention calls begun in 3 minutes",
  },
  {
    id: "workforce-restructuring",
    domain: "TRANSFORMATION",
    name: "Workforce Restructuring",
    description: "Board mandates 15% reduction — 6,700 roles across 12 countries to be addressed",
    protocol: "Workforce Transformation Protocol",
    protocolNum: 112,
    tasks: [
      { role: "CHRO", action: "Impact mapping complete: roles by business unit, geography, legal classification, severance exposure by jurisdiction", minute: "1:30" },
      { role: "General Counsel", action: "Severance structure confirmed — WARN Act compliance, jurisdiction-specific requirements, and risk exposure mapped", minute: "2:00" },
      { role: "CEO", action: "Board authorization for program design and budget — pre-approved parameters eliminate revision cycles", minute: "3:00" },
      { role: "CMO + CHRO", action: "Communication plan staged: internal announcement, external messaging, customer and partner impact statements", minute: "5:00" },
      { role: "CHRO", action: "Manager briefings complete — every manager knows what to say, when to say it, and who to call for escalations", minute: "8:00" },
      { role: "CEO", action: "All-hands with specific changes, rationale, and support programs — no filtered Q&A, direct executive presence", minute: "12:00" },
    ],
    stakeholders: [
      { name: "CHRO", role: "Program design and communications" },
      { name: "General Counsel", role: "Legal compliance across jurisdictions" },
      { name: "COO", role: "Operational continuity" },
    ],
    withoutDelay: "3–4 weeks to design program, secure board approval, and prepare communications",
    timelineLabel: "Impact mapping complete and board authorization in 3 minutes",
  },
  {
    id: "infrastructure-failure",
    domain: "TRANSFORMATION",
    name: "Infrastructure Failure",
    description: "Legacy ERP system failure — revenue-critical operations at risk, modernization forced",
    protocol: "Technology Infrastructure Response",
    protocolNum: 134,
    tasks: [
      { role: "CTO", action: "Assess failure scope: systems affected, estimated downtime, revenue operations at risk, and recovery options", minute: "1:30" },
      { role: "CISO", action: "Security impact assessment — determine if failure involves breach exposure or data integrity risk", minute: "2:00" },
      { role: "COO", action: "Business continuity activated — manual workarounds for revenue-critical operations, customer SLA impact mapped", minute: "3:00" },
      { role: "CFO", action: "Emergency recovery investment authorized — pre-approved threshold eliminates budget approval cycle", minute: "4:00" },
      { role: "CTO", action: "Vendor emergency engagement — pre-negotiated SLA acceleration and dedicated support resources activated", minute: "5:00" },
      { role: "CEO", action: "Board briefed on scope, recovery timeline, and modernization roadmap — decision framework pre-staged", minute: "12:00" },
    ],
    stakeholders: [
      { name: "CTO", role: "Technical recovery and modernization" },
      { name: "CISO", role: "Security and data integrity" },
      { name: "COO", role: "Business continuity" },
    ],
    withoutDelay: "1–2 weeks to mobilize technology teams and obtain recovery investment",
    timelineLabel: "BCP activated and vendor emergency support in 5 minutes",
  },
  {
    id: "strategic-pivot",
    domain: "TRANSFORMATION",
    name: "Strategic Pivot",
    description: "Board mandates business model shift — go-to-market acceleration required in 90 days",
    protocol: "Go-to-Market Acceleration Sprint",
    protocolNum: 89,
    tasks: [
      { role: "Chief Strategy Officer", action: "Market analysis complete: new segment sizing, competitive landscape, customer acquisition model, and revenue timeline", minute: "1:30" },
      { role: "CFO", action: "Resource reallocation model staged — investment shift from legacy model to growth model with board-approved thresholds", minute: "2:00" },
      { role: "CEO", action: "Board alignment on pivot rationale, 90-day milestones, and success metrics — pre-framed for rapid authorization", minute: "3:00" },
      { role: "CHRO", action: "Capability gap analysis — skills needed vs. skills available, reskilling roadmap, and hiring plan for critical gaps", minute: "5:00" },
      { role: "Chief Revenue Officer", action: "Customer impact assessment — which customers follow us to the new model, which need migration support", minute: "7:00" },
      { role: "CMO", action: "Positioning pivot staged — new messaging, competitive positioning, and market announcement sequence ready", minute: "12:00" },
    ],
    stakeholders: [
      { name: "Chief Strategy Officer", role: "Market analysis and direction" },
      { name: "CFO", role: "Resource reallocation" },
      { name: "CEO", role: "Board alignment and authorization" },
    ],
    withoutDelay: "30-day alignment cycle before any execution begins on the new model",
    timelineLabel: "Board authorized and resource reallocation staged in 3 minutes",
  },
];

const DOMAIN_ORDER: Domain[] = ["GROWTH & POSITIONING", "RISK & RESILIENCE", "TRANSFORMATION"];

const DOMAIN_COLOR: Record<Domain, string> = {
  "GROWTH & POSITIONING": GOLD,
  "RISK & RESILIENCE": TEAL,
  "TRANSFORMATION": NAVY,
};

const DOMAIN_BG: Record<Domain, string> = {
  "GROWTH & POSITIONING": "rgba(201,168,76,0.08)",
  "RISK & RESILIENCE": "rgba(43,138,110,0.08)",
  "TRANSFORMATION": "rgba(10,15,46,0.07)",
};

const TIMELINE_STEPS = ["Signal detected", "Protocol matched", "Tasks staged", "Stakeholders notified", "Executive authorizes"];

export default function SituationScanner() {
  const [selected, setSelected] = useState<Situation | null>(null);
  const [visible, setVisible] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");

  useEffect(() => {
    updatePageMetadata({
      title: "Situation Scanner — Readiness OS by VaughnMartin",
      description: "Pick a strategic situation. See your 12-minute pre-staged response — instantly, no login required. The response was ready before you clicked.",
    });
  }, []);

  useEffect(() => {
    if (selected) {
      setVisible(false);
      setEmailStatus("idle");
      setEmailInput("");
      const t = setTimeout(() => setVisible(true), 60);
      return () => clearTimeout(t);
    }
  }, [selected]);

  const situationsByDomain = DOMAIN_ORDER.map(domain => ({
    domain,
    situations: SITUATIONS.filter(s => s.domain === domain),
  }));

  return (
    <div style={{ background: "#fff", minHeight: "100vh", ...DM }}>

      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <div style={{ background: NAVY, padding: "16px 40px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <VaughnMartinLogo variant="full" height={40} color="light" animated={false} />
          <Link href="/request-access">
            <button style={{
              ...BC, background: GOLD, border: "none", color: NAVY, fontSize: 11,
              fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase",
              padding: "9px 20px", cursor: "pointer", borderRadius: "0.15rem",
            }}>
              Apply for Founding Partner Access →
            </button>
          </Link>
        </div>
      </div>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <div style={{ background: NAVY, padding: "56px 40px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, marginBottom: 16 }}>
            Situation Scanner — Self-Serve Proof Point
          </div>
          <h1 style={{ ...CG, fontSize: 52, fontWeight: 700, color: "#fff", lineHeight: 1.1, margin: "0 0 16px", maxWidth: 720 }}>
            Pick the situation.<br />
            <em style={{ color: GOLD }}>See your 12-minute response.</em>
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, maxWidth: 580, margin: 0 }}>
            Every situation below has a pre-staged Readiness Protocol waiting. Select one and see exactly which tasks would fire, which stakeholders would be notified, and what the 12-minute execution window looks like. No login. No sales call. Just the response.
          </p>
        </div>
      </div>

      {/* ── GOLD RULE ─────────────────────────────────────────────────────── */}
      <div style={{ background: GOLD, height: 3 }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px" }}>

        {/* ── STEP 1: SITUATION PICKER ─────────────────────────────────────── */}
        <div style={{ padding: "48px 0 0" }}>
          <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: GOLD, marginBottom: 8 }}>
            Step 1 — Select a Strategic Situation
          </div>
          <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 32 }}>
            12 situations across three strategic domains. Click one to see the pre-staged response.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
            {situationsByDomain.map(({ domain, situations }) => {
              const color = DOMAIN_COLOR[domain];
              const bg = DOMAIN_BG[domain];
              return (
                <div key={domain}>
                  <div style={{
                    ...BC, fontSize: 10, fontWeight: 800, letterSpacing: "0.18em",
                    textTransform: "uppercase", color, marginBottom: 12,
                    paddingBottom: 10, borderBottom: `2px solid ${color}`,
                  }}>
                    {domain}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {situations.map(s => {
                      const isActive = selected?.id === s.id;
                      return (
                        <button
                          key={s.id}
                          onClick={() => setSelected(s)}
                          style={{
                            textAlign: "left", padding: "14px 16px",
                            border: `1px solid ${isActive ? color : "rgba(10,15,46,0.12)"}`,
                            borderLeft: `3px solid ${isActive ? color : "transparent"}`,
                            background: isActive ? bg : "#FAFAF8",
                            cursor: "pointer", borderRadius: "0.15rem",
                            transition: "all 0.15s",
                          }}
                        >
                          <div style={{ ...BC, fontSize: 13, fontWeight: 700, color: isActive ? color : NAVY, marginBottom: 4, letterSpacing: "0.02em" }}>
                            {s.name}
                          </div>
                          <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.5 }}>{s.description}</div>
                          {isActive && (
                            <div style={{ marginTop: 8, ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color }}>
                              Protocol #{s.protocolNum} — {s.protocol} →
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── STEP 2: RESULTS PANEL ─────────────────────────────────────────── */}
        {selected && (
          <div style={{
            marginTop: 40, padding: "40px 44px",
            border: `1px solid ${DOMAIN_COLOR[selected.domain]}40`,
            borderTop: `3px solid ${DOMAIN_COLOR[selected.domain]}`,
            background: "#FAFAF8", borderRadius: "0.15rem",
            opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.35s ease, transform 0.35s ease",
          }}>

            {/* Protocol header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 20, marginBottom: 32 }}>
              <div>
                <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: DOMAIN_COLOR[selected.domain], marginBottom: 8 }}>
                  Step 2 — Pre-Staged Response
                </div>
                <h2 style={{ ...CG, fontSize: 32, fontWeight: 700, color: NAVY, margin: "0 0 6px", lineHeight: 1.2 }}>
                  Protocol #{selected.protocolNum} — {selected.protocol}
                </h2>
                <p style={{ fontSize: 14, color: "#6B7280", margin: 0 }}>
                  This protocol was built, staged, and tested before this situation arose. The tasks below activate the moment you authorize.
                </p>
              </div>
              <div style={{ display: "flex", gap: 12, flexShrink: 0 }}>
                {[
                  { val: "12", unit: "min", label: "Execution window" },
                  { val: "6", unit: "tasks", label: "Pre-staged" },
                  { val: "3", unit: "leads", label: "Pre-notified" },
                ].map((m, i) => (
                  <div key={i} style={{ textAlign: "center", background: "#fff", border: "1px solid rgba(10,15,46,0.1)", padding: "14px 18px", borderRadius: "0.15rem" }}>
                    <div style={{ ...CG, fontSize: 26, fontWeight: 700, color: NAVY, lineHeight: 1 }}>{m.val}<span style={{ fontSize: 14 }}> {m.unit}</span></div>
                    <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>{m.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 12-minute timeline bar */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#6B7280", marginBottom: 12 }}>
                12-Minute Execution Window
              </div>
              <div style={{ position: "relative", height: 6, background: "rgba(10,15,46,0.08)", borderRadius: 3, marginBottom: 28 }}>
                <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: "100%", background: `linear-gradient(90deg, ${DOMAIN_COLOR[selected.domain]}, ${DOMAIN_COLOR[selected.domain]}80)`, borderRadius: 3 }} />
                {TIMELINE_STEPS.map((step, i) => {
                  const pct = i === 0 ? 0 : i === 1 ? 8 : i === 2 ? 25 : i === 3 ? 55 : 100;
                  return (
                    <div key={i} style={{ position: "absolute", top: -4, left: `${pct}%`, transform: "translateX(-50%)" }}>
                      <div style={{ width: 14, height: 14, borderRadius: "50%", background: DOMAIN_COLOR[selected.domain], border: "2px solid white", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                      <div style={{ position: "absolute", top: 20, left: "50%", transform: "translateX(-50%)", width: 90, textAlign: "center", ...BC, fontSize: 9, fontWeight: 700, color: "#374151", letterSpacing: "0.04em", lineHeight: 1.3 }}>
                        {step}
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Without OS contrast */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "rgba(192,57,43,0.05)", border: "1px solid rgba(192,57,43,0.15)", borderRadius: "0.15rem" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#C0392B", flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: "#C0392B", fontWeight: 600 }}>Without Readiness OS:</span>
                <span style={{ fontSize: 12, color: "#9CA3AF" }}>{selected.withoutDelay}</span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 28 }}>
              {/* 6 pre-staged tasks */}
              <div>
                <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#6B7280", marginBottom: 14 }}>
                  Pre-Staged Tasks — Activate in Sequence
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {selected.tasks.map((task, i) => (
                    <div key={i} style={{
                      display: "grid", gridTemplateColumns: "48px 1fr",
                      borderBottom: i < selected.tasks.length - 1 ? "1px solid rgba(10,15,46,0.07)" : "none",
                      padding: "12px 0",
                    }}>
                      <div style={{ paddingTop: 2 }}>
                        <div style={{ ...BC, fontSize: 12, fontWeight: 800, color: DOMAIN_COLOR[selected.domain] }}>{task.minute}</div>
                      </div>
                      <div>
                        <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#94A3B8", marginBottom: 3 }}>
                          {task.role}
                        </div>
                        <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.55 }}>{task.action}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stakeholders + protocol badge */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ background: "#fff", border: "1px solid rgba(10,15,46,0.1)", padding: "20px 22px", borderRadius: "0.15rem" }}>
                  <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#6B7280", marginBottom: 14 }}>
                    Auto-Notified Stakeholders
                  </div>
                  {selected.stakeholders.map((s, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: i < selected.stakeholders.length - 1 ? "1px solid #F1F5F9" : "none" }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: DOMAIN_BG[selected.domain], border: `1px solid ${DOMAIN_COLOR[selected.domain]}40`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ ...BC, fontSize: 10, fontWeight: 800, color: DOMAIN_COLOR[selected.domain] }}>
                          {s.name.split(" ").pop()?.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: NAVY }}>{s.name}</div>
                        <div style={{ fontSize: 11, color: "#9CA3AF" }}>{s.role}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ background: NAVY, padding: "20px 22px", borderRadius: "0.15rem" }}>
                  <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: GOLD, marginBottom: 8 }}>
                    Pre-Staged Before This Moment
                  </div>
                  <div style={{ ...CG, fontSize: 16, fontWeight: 600, color: "#fff", lineHeight: 1.4, marginBottom: 10 }}>
                    "{selected.timelineLabel}"
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.55 }}>
                    No mobilization. No alignment cycle. Protocol #{selected.protocolNum} was tested in Q3 drills and waiting for this trigger.
                  </div>
                </div>
              </div>
            </div>

            {/* ── EMAIL CAPTURE ──────────────────────────────────────────── */}
            <div style={{ marginTop: 32, paddingTop: 28, borderTop: "1px solid rgba(10,15,46,0.1)" }}>
              {emailStatus === "sent" ? (
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: TEAL, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>✓</span>
                  </div>
                  <div>
                    <div style={{ ...BC, fontSize: 12, fontWeight: 700, color: TEAL, letterSpacing: "0.08em" }}>Summary sent — check your inbox</div>
                    <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>We'll follow up about the Founding Partner Program within 24 hours.</div>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#6B7280", marginBottom: 6 }}>
                    Send me this response brief
                  </div>
                  <p style={{ fontSize: 13, color: "#9CA3AF", margin: "0 0 14px" }}>
                    Get Protocol #{selected.protocolNum} — {selected.protocol} — in your inbox with the full task sequence and Founding Partner details.
                  </p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
                    <input
                      type="email"
                      value={emailInput}
                      onChange={e => setEmailInput(e.target.value)}
                      placeholder="Your work email"
                      style={{
                        flex: 1, minWidth: 220, padding: "10px 14px",
                        border: "1px solid rgba(10,15,46,0.2)", background: "#fff",
                        fontSize: 13, color: NAVY, outline: "none", fontFamily: "inherit",
                        borderRadius: "0.15rem",
                      }}
                    />
                    <button
                      disabled={emailStatus === "loading" || !emailInput.includes("@")}
                      onClick={async () => {
                        if (!emailInput.includes("@") || !selected) return;
                        setEmailStatus("loading");
                        try {
                          const r = await fetch("/api/situation-scanner/lead", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              email: emailInput,
                              situationId: selected.id,
                              situationName: selected.name,
                              domain: selected.domain,
                              protocolNum: selected.protocolNum,
                              protocol: selected.protocol,
                            }),
                          });
                          const d = await r.json();
                          setEmailStatus(d.success ? "sent" : "error");
                        } catch { setEmailStatus("error"); }
                      }}
                      style={{
                        padding: "10px 22px", background: emailInput.includes("@") ? NAVY : "rgba(10,15,46,0.25)",
                        color: "#fff", border: "none", fontSize: 12, fontWeight: 700,
                        letterSpacing: "0.08em", textTransform: "uppercase" as const,
                        cursor: emailInput.includes("@") ? "pointer" : "not-allowed",
                        whiteSpace: "nowrap" as const, borderRadius: "0.15rem",
                      }}
                    >
                      {emailStatus === "loading" ? "Sending…" : "Send Brief →"}
                    </button>
                  </div>
                  {emailStatus === "error" && (
                    <p style={{ fontSize: 12, color: "#C0392B", marginTop: 8, marginBottom: 0 }}>
                      Something went wrong — email pilot@vaughnmartin.com directly.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── STEP 3: CTA FOOTER ────────────────────────────────────────────── */}
        <div style={{
          margin: "48px 0 0", padding: "48px 44px",
          background: IVORY, border: "1px solid rgba(201,168,76,0.2)",
          borderTop: `3px solid ${GOLD}`, borderRadius: "0.15rem",
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 40, alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: GOLD, marginBottom: 12 }}>
                Step 3 — Apply for Founding Partner Access
              </div>
              <p style={{ ...CG, fontSize: 32, fontWeight: 700, color: NAVY, margin: "0 0 12px", lineHeight: 1.2 }}>
                The response was ready before you clicked.
              </p>
              <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7, margin: "0 0 8px", maxWidth: 540 }}>
                What you just saw isn't a simulation of what Readiness OS might do. It's exactly what it does — before the trigger fires. Two Founding Partner slots remain. No subscription fee for 90 days.
              </p>
              <Link href="/demo-hub" style={{ fontSize: 13, color: TEAL, fontWeight: 700, textDecoration: "none" }}>
                See all 12 scenarios in the Demo Hub →
              </Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 240 }}>
              <Link href="/request-access">
                <button style={{
                  width: "100%", padding: "18px 32px",
                  background: GOLD, border: "none", cursor: "pointer", borderRadius: "0.15rem",
                  ...BC, fontSize: 13, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase",
                  color: NAVY,
                }}>
                  Apply for Founding Partner Access →
                </button>
              </Link>
              <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0, textAlign: "center" }}>
                2 slots · 90 days · no subscription fee
              </p>
            </div>
          </div>
        </div>

        <div style={{ height: 64 }} />
      </div>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <div style={{ background: NAVY, padding: "24px 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <VaughnMartinLogo variant="full" height={36} color="light" animated={false} noLink />
          <div style={{ ...BC, fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Readiness OS · 180 Protocols · 12-Minute Execution
          </div>
        </div>
      </div>

    </div>
  );
}
