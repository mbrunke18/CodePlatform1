import { useState, useEffect } from "react";
import { Link } from "wouter";
import { VaughnMartinLogo } from "@/components/VaughnMartinLogo";
import { updatePageMetadata } from "@/lib/seo";
import StandardNav from "@/components/layout/StandardNav";

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
  withoutConsequence: string;
  withReadiness: string;
  timelineLabel: string;
  financialExposure: string;
  outcomeAnchor: string;
  industries: string[];
  triggerCount: number;
  compoundRisk?: string;
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
      { role: "Chief Strategy Officer", action: "Pull full competitor announcement — exact specs, pricing, target segment, and distribution partners. Map to your top 50 shared accounts.", minute: "1:30" },
      { role: "Chief Revenue Officer", action: "Deploy sales battle card to all AEs — specific objection handlers for every competitor claim, win/loss data by segment, and pricing counter-strategy", minute: "3:00" },
      { role: "CEO + CRO", action: "Personal calls to top 20 enterprise accounts before competitor follow-up — secure the relationship first with executive presence, not a sales pitch", minute: "4:00" },
      { role: "Chief Product Officer", action: "Run competitive feature gap analysis — where we win, where we lose, actual switching cost and integration dependency for shared accounts", minute: "5:00" },
      { role: "CMO", action: "Counter-positioning campaign assets staged — hold for release unless competitor gains traction; narrative ready for activation within 30 minutes", minute: "7:00" },
      { role: "CEO + CPO", action: "Roadmap acceleration evaluation — pull forward features closing the gap; board briefed same day on competitive exposure and response", minute: "12:00" },
    ],
    stakeholders: [
      { name: "Chief Revenue Officer", role: "Sales activation and battle card" },
      { name: "Chief Strategy Officer", role: "Competitive intelligence" },
      { name: "Chief Product Officer", role: "Roadmap acceleration" },
    ],
    withoutDelay: "3–5 days to align sales, product, and leadership on a unified response",
    withoutConsequence: "Competitors contact your top accounts before you do. Average 18% enterprise churn in first 30 days without a pre-staged response. By the time your team aligns, the narrative is already set.",
    withReadiness: "Battle card deployed to all AEs in 3 minutes. Top 20 accounts reached with executive presence before competitor's first outreach window.",
    timelineLabel: "Sales battle card deployed. Top 20 accounts contacted. Executive narrative ready.",
    financialExposure: "First 72 hours determine 60% of at-risk account outcomes — delay is market share, not time",
    outcomeAnchor: "Battle card to 47 AEs in 3 minutes. Top 20 accounts contacted before competitor's first outreach.",
    industries: ["SaaS", "Enterprise Tech", "Healthcare IT", "Financial Services"],
    triggerCount: 14,
  },
  {
    id: "market-entry",
    domain: "GROWTH & POSITIONING",
    name: "Market Entry Window",
    description: "Regulatory change opens new segment — 90-day first-mover window closing",
    protocol: "Market Entry Response",
    protocolNum: 22,
    tasks: [
      { role: "General Counsel", action: "Pull final rule text — confirm effective date, eligibility criteria, compliance requirements, and jurisdictional scope", minute: "1:30" },
      { role: "Chief Strategy Officer", action: "Run market sizing: TAM of newly opened segment, first-mover window duration, competitive landscape entering, and customer acquisition model", minute: "2:00" },
      { role: "CFO", action: "Pre-approved entry budget released — investment bank engagement authorized, capital staged and accessible without additional approval cycle", minute: "3:00" },
      { role: "CEO", action: "Board briefed on entry opportunity with pre-built investment case — full authorization for accelerated investment secured same day", minute: "4:00" },
      { role: "CHRO + CEO", action: "Identify and assign market entry lead — internal talent or emergency retained search with headhunter on standby per pre-negotiated agreement", minute: "6:00" },
      { role: "Chief Revenue Officer", action: "Priority outreach to 20 existing customers operating in the new segment — Day 1 expansion conversations, not discovery calls", minute: "12:00" },
    ],
    stakeholders: [
      { name: "General Counsel", role: "Regulatory confirmation" },
      { name: "CFO", role: "Capital authorization" },
      { name: "Chief Strategy Officer", role: "Market sizing and entry plan" },
    ],
    withoutDelay: "30-day committee cycle to authorize capital deployment and board alignment",
    withoutConsequence: "Competitors enter the segment while you're still in alignment meetings. The 90-day first-mover window doesn't pause for committee cycles — it closes with or without you.",
    withReadiness: "Entry capital staged and board authorized in 4 minutes. Market entry lead assigned before competitors finished reading the regulation.",
    timelineLabel: "Capital staged, board authorized, entry lead assigned. Outreach active.",
    financialExposure: "First-mover advantage compounds 3–5× vs. 90-day-late entry — the window is the asset",
    outcomeAnchor: "Capital staged and board authorized in 4 minutes. Market entry lead assigned before competitors read the regulation.",
    industries: ["Financial Services", "Healthcare", "Energy", "Insurance", "Manufacturing"],
    triggerCount: 11,
  },
  {
    id: "ma-response",
    domain: "GROWTH & POSITIONING",
    name: "M&A Rapid Response",
    description: "Acquisition opportunity surfaces — LOI window is 48 hours",
    protocol: "M&A Rapid Response",
    protocolNum: 58,
    tasks: [
      { role: "CFO", action: "Structure LOI terms — price range, exclusivity period, key conditions, and walkaway provisions pre-defined in pre-built deal framework", minute: "1:30" },
      { role: "General Counsel", action: "Engage M&A counsel — due diligence workstreams activated, NDA executed via pre-approved template, data room access protocol live", minute: "2:00" },
      { role: "CEO", action: "Board authorization obtained for exploratory LOI — pre-approved parameters eliminate the full approval cycle, just the specific deal decision", minute: "3:00" },
      { role: "Chief Strategy Officer", action: "Competitive rationale validated — strategic fit scored, revenue synergies modeled, and integration risk assessed against pre-built framework", minute: "5:00" },
      { role: "Chief IR Officer", action: "Shareholder communication strategy prepared — disclosure timing, messaging, analyst briefing sequence, and regulatory notification mapped", minute: "8:00" },
      { role: "COO", action: "Integration readiness assessment — Day 1 operational plan, key dependencies, critical system integration risks, and 90-day milestones staged", minute: "12:00" },
    ],
    stakeholders: [
      { name: "CFO", role: "Deal structure and terms" },
      { name: "General Counsel", role: "Legal and due diligence" },
      { name: "Chief Strategy Officer", role: "Strategic rationale scoring" },
    ],
    withoutDelay: "4–6 weeks to mobilize M&A team and obtain board authorization",
    withoutConsequence: "Competitors with pre-staged deal infrastructure close opportunities you're still convening advisors to evaluate. The 48-hour window closes while you're scheduling the first alignment meeting.",
    withReadiness: "LOI structured, board authorized, outside counsel engaged — all before target's banker took another call.",
    timelineLabel: "LOI structured. Board authorized. M&A counsel engaged. Integration plan staged.",
    financialExposure: "Missed 48-hr LOI windows average $340M in foregone synergies at mid-market scale",
    outcomeAnchor: "LOI structured and board authorization secured in 3 minutes. Outside counsel engaged before target's banker took another call.",
    industries: ["Private Equity", "Healthcare", "Manufacturing", "Technology", "Financial Services"],
    triggerCount: 9,
  },
  {
    id: "activist-investor",
    domain: "GROWTH & POSITIONING",
    name: "Activist Investor Stake",
    description: "9.8% stake disclosed — board seat demanded via 13D filing",
    protocol: "Activist Investor Defense",
    protocolNum: 47,
    tasks: [
      { role: "General Counsel", action: "Pull Schedule 13D from SEC EDGAR — confirm stake %, stated intent, all associated entities, and prior 13D history for this activist", minute: "1:30" },
      { role: "CFO", action: "Run activist profile — past campaigns, win rate, typical demands (board seat, spin-off, cost cuts, dividend), and likely 90-day playbook", minute: "2:00" },
      { role: "Board Chair", action: "Convene emergency board session — brief all directors before activist makes any public statement or contacts institutional holders", minute: "3:00" },
      { role: "CEO", action: "Retain M&A defense counsel, proxy solicitor, and IR advisor simultaneously — all three retained before activist makes first contact", minute: "4:00" },
      { role: "Chief IR Officer", action: "Schedule calls with top 10 institutional holders within 24 hours — lead with value creation plan, not a defensive posture", minute: "6:00" },
      { role: "CMO + Legal", action: "Draft company response: confident, forward-looking, data-driven — pre-approved legal review complete and ready for rapid release", minute: "12:00" },
    ],
    stakeholders: [
      { name: "General Counsel", role: "Regulatory and legal response" },
      { name: "Board Chair", role: "Board mobilization and alignment" },
      { name: "Chief IR Officer", role: "Institutional investor outreach" },
    ],
    withoutDelay: "2–3 weeks to retain advisors and align the full board",
    withoutConsequence: "Activist speaks to your top 10 institutional holders before you do. The narrative is set before your defense team is even assembled — and narrative in activist campaigns is a decisive advantage.",
    withReadiness: "Defense counsel retained, board convened, and institutional narrative deployed before activist's first investor call.",
    timelineLabel: "Defense counsel retained. Board convened. Institutional narrative deployed.",
    financialExposure: "Every day without a coordinated narrative costs $2–8M in market cap erosion for mid-cap companies",
    outcomeAnchor: "Defense counsel retained and board convened in 3 minutes. Institutional narrative deployed before activist's first investor call.",
    industries: ["All Public Companies", "Healthcare", "Manufacturing", "Technology", "Financial Services"],
    triggerCount: 17,
    compoundRisk: "Frequently escalates to Activist + DOJ Compound Crisis if regulatory exposure surfaces during campaign",
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
      { role: "CISO", action: "Confirm ransomware variant — classify: locker / crypto / double-extortion. Determine data exfiltration status and initial blast radius", minute: "1:00" },
      { role: "CTO", action: "IMMEDIATE: Physically isolate affected network segments. Do NOT reboot — preserves memory artifacts for forensic recovery", minute: "1:30" },
      { role: "General Counsel", action: "Engage FBI Cyber Division and notify cyber insurer simultaneously. Do NOT authorize payment without insurer sign-off and OFAC check", minute: "2:00" },
      { role: "COO", action: "Activate Business Continuity Plan — manual workarounds for all revenue-critical systems initiated; customer SLA impact mapped", minute: "3:00" },
      { role: "CTO", action: "Validate backup integrity — confirm offline/immutable backup status and establish Recovery Time Objective for each affected system", minute: "4:00" },
      { role: "CEO + CFO + Legal", action: "Payment decision with all required parties: backup viability, OFAC sanctions check, insurance guidance, and regulatory disclosure obligation", minute: "6:00" },
    ],
    stakeholders: [
      { name: "CISO", role: "Incident command and forensics" },
      { name: "General Counsel", role: "FBI liaison and cyber insurer" },
      { name: "COO", role: "Business continuity activation" },
    ],
    withoutDelay: "3–5 days to assemble incident response team and align on containment strategy",
    withoutConsequence: "Every uncontained hour increases the blast radius. Average $4.6M per day in downtime. At 23 days — the average unprepped recovery timeline — total breach cost reaches $108M for enterprise.",
    withReadiness: "Network isolated in 90 seconds. FBI engaged, insurer notified, and BCP active before the third minute.",
    timelineLabel: "Network isolated. FBI engaged. Insurer notified. BCP live. All in 3 minutes.",
    financialExposure: "$4.6M average cost per day of downtime · 23-day avg recovery without preparation · $108M total breach cost",
    outcomeAnchor: "Network isolated in 90 sec. FBI engaged, insurer notified, and BCP active before minute 3.",
    industries: ["Healthcare", "Manufacturing", "Financial Services", "Energy", "Retail", "Government"],
    triggerCount: 22,
    compoundRisk: "Frequently escalates to data breach disclosure + regulatory inquiry (HIPAA / SEC 4-day rule)",
  },
  {
    id: "supply-chain",
    domain: "RISK & RESILIENCE",
    name: "Supply Chain Collapse",
    description: "Primary supplier bankrupt — 14-day production risk across 6 facilities",
    protocol: "Supply Chain Disruption Response",
    protocolNum: 12,
    tasks: [
      { role: "COO", action: "Pull disruption data: affected supplier tier, % supply at risk, lead time impact, geographic scope, and buffer stock coverage by facility", minute: "1:30" },
      { role: "CFO", action: "Run revenue-at-risk model: production days affected × daily revenue × SLA penalty exposure. Apply remaining buffer stock coverage", minute: "2:00" },
      { role: "Chief Procurement Officer", action: "Issue emergency POs to top 3 alternate suppliers simultaneously — pre-negotiated emergency pricing and priority allocation activated", minute: "4:00" },
      { role: "Head of Logistics", action: "Reroute inbound freight. Expedite air freight for critical components where margin impact is below SLA penalty exposure", minute: "5:00" },
      { role: "CEO + CRO", action: "Personal calls to top 10 affected enterprise customers — provide concrete recovery date and executive contact before SLA breach window opens", minute: "7:00" },
      { role: "CFO", action: "File business interruption insurance claim. Document all incremental costs for recovery, customer concessions, and potential litigation exposure", minute: "12:00" },
    ],
    stakeholders: [
      { name: "COO", role: "Operations and continuity" },
      { name: "Chief Procurement Officer", role: "Alternate supplier activation" },
      { name: "CFO", role: "Financial exposure and insurance" },
    ],
    withoutDelay: "5–7 days to assess full impact and qualify alternate suppliers",
    withoutConsequence: "Enterprise customers trigger SLA breach penalties while you're still mapping the scope. Competitors contact your customers before your alternate suppliers are even qualified. Average $2.1M in penalties per major disruption.",
    withReadiness: "3 alternate suppliers contacted simultaneously. Emergency POs issued before customer SLA windows opened.",
    timelineLabel: "Alternates activated. Emergency POs issued. Customer calls made. Insurance filed.",
    financialExposure: "14-day production risk = $9.2M average revenue exposure at mid-market scale + SLA breach penalties",
    outcomeAnchor: "3 alternate suppliers contacted simultaneously. Emergency POs issued before customer SLA windows opened.",
    industries: ["Manufacturing", "Consumer Goods", "Automotive", "Aerospace", "Retail", "Food & Beverage"],
    triggerCount: 19,
  },
  {
    id: "regulatory",
    domain: "RISK & RESILIENCE",
    name: "DOJ Investigation Opened",
    description: "Civil Investigative Demand received — 30-day response window, disclosure obligations",
    protocol: "DOJ Investigation Response",
    protocolNum: 78,
    tasks: [
      { role: "General Counsel", action: "Pull full CID text — extract: effective date, requirements, enforcement mechanism, disclosure obligations, and jurisdictional scope", minute: "1:30" },
      { role: "Chief Compliance Officer", action: "Run gap assessment: what is compliant today vs. what requires change. Prioritize by penalty exposure and regulatory timeline", minute: "2:00" },
      { role: "General Counsel", action: "Issue litigation hold — preserve all relevant documents, communications, and data across all affected systems. Spoliation risk begins now.", minute: "3:00" },
      { role: "CISO + CTO", action: "Technology compliance assessment: data residency, encryption standards, access controls, audit logging — map gaps against CID requirements", minute: "4:00" },
      { role: "CEO", action: "Brief board on investigation scope, compliance timeline, and budget requirements. Obtain board endorsement of response framework", minute: "7:00" },
      { role: "Chief Compliance Officer", action: "File acknowledgment with DOJ within 30-day window. Establish ongoing dialogue channel with regulatory counsel designated as liaison", minute: "11:00" },
    ],
    stakeholders: [
      { name: "General Counsel", role: "Legal response and privilege protection" },
      { name: "Chief Compliance Officer", role: "Gap assessment and roadmap" },
      { name: "CEO", role: "Board and regulator liaison" },
    ],
    withoutDelay: "2–4 weeks to mobilize legal, compliance, and executive teams",
    withoutConsequence: "Documents that should be preserved are deleted. Spoliation risk compounds daily. The 30-day response window closes before your defense is coordinated — and the regulatory body notices the silence.",
    withReadiness: "Litigation hold issued, board briefed, and DOJ acknowledgment filed — all within the first 11 minutes.",
    timelineLabel: "Litigation hold live. Board briefed. DOJ acknowledgment filed. 11 minutes.",
    financialExposure: "Litigation hold failure creates spoliation risk — potential $50M+ penalty exposure in the 30-day window",
    outcomeAnchor: "Litigation hold issued, board briefed, and DOJ acknowledgment filed — all in the first 11 minutes.",
    industries: ["Financial Services", "Healthcare", "Technology", "Energy", "Manufacturing", "Defense"],
    triggerCount: 13,
    compoundRisk: "Frequently co-occurs with activist investor stake or SEC disclosure obligation",
  },
  {
    id: "brand-crisis",
    domain: "RISK & RESILIENCE",
    name: "Brand Crisis",
    description: "Viral social media incident — sentiment collapsing, media pickup accelerating",
    protocol: "Brand Crisis Response",
    protocolNum: 44,
    tasks: [
      { role: "CMO", action: "Pull crisis monitoring data: source, velocity (shares/hour), sentiment trajectory, geographic spread, and media pickup rate by outlet tier", minute: "1:30" },
      { role: "CEO", action: "Hold-or-respond decision with CMO and Legal — every 30-min delay in a viral crisis costs 40% more amplification. Decision must be made now.", minute: "2:00" },
      { role: "CMO + Legal", action: "Draft 3-sentence holding statement: what we know, what we are doing, when we will update. No speculation. Legal pre-cleared in this draft.", minute: "3:00" },
      { role: "Head of Communications", action: "Simultaneous release across all channels — social, web, press wire, and direct media — all live at the same moment. No sequencing.", minute: "5:00" },
      { role: "CHRO", action: "Employee briefing: what happened, what the company is saying, how to respond if asked. Every employee is a spokesperson — prepare them.", minute: "6:00" },
      { role: "Chief Revenue Officer", action: "Brief top 20 enterprise customers before their boards ask — executive-level communication, not a PR statement forwarded", minute: "7:00" },
    ],
    stakeholders: [
      { name: "CMO", role: "Crisis messaging and monitoring" },
      { name: "General Counsel", role: "Legal review and disclosure" },
      { name: "Head of Communications", role: "Multi-channel simultaneous release" },
    ],
    withoutDelay: "48–72 hours to align messaging across legal, communications, and leadership",
    withoutConsequence: "By hour 6, the narrative is owned by the media. By hour 48, your silence is the story — and the story writes itself. Average $24M brand impact for mid-market when response exceeds 4 hours.",
    withReadiness: "Holding statement approved and distributed across all channels in 5 minutes. Employee briefing deployed before first media inquiry reached a journalist.",
    timelineLabel: "Statement approved. All channels live simultaneously. Employees briefed. 5 minutes.",
    financialExposure: "Every 30-min delay in viral crisis response costs 40% more amplification — average $24M brand impact",
    outcomeAnchor: "Holding statement approved across all channels in 5 minutes. Employee briefing deployed before first media inquiry.",
    industries: ["Consumer", "Retail", "Healthcare", "Financial Services", "Technology", "Hospitality"],
    triggerCount: 16,
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
      { role: "CHRO", action: "Pull flight risk model — all employees with >70% departure probability, engagement score, comp percentile vs. market, and tenure with current manager", minute: "1:30" },
      { role: "CEO", action: "Identify 25 mission-critical roles where departure causes immediate operational or customer-facing impact. Tier by replaceability and institutional knowledge.", minute: "2:00" },
      { role: "CEO", action: "Personal calls to all Priority 1 retention risks within 48 hours — listen to the real reason first, then vision, then compensation. Sequence matters.", minute: "3:00" },
      { role: "CHRO", action: "Design 18-month retention package for top 25: equity acceleration, role expansion, flexibility, and manager quality interventions staged for immediate implementation", minute: "4:00" },
      { role: "CEO", action: "Make one visible, immediate structural change addressing the top stated departure driver — decisions and action, not promises about future decisions", minute: "7:00" },
      { role: "CFO + CHRO", action: "Establish talent health scorecard with board-level quarterly reporting — talent retention becomes a governance metric, not an HR metric", minute: "12:00" },
    ],
    stakeholders: [
      { name: "CHRO", role: "Flight risk analysis and retention design" },
      { name: "CEO", role: "Priority executive retention calls" },
      { name: "CFO", role: "Retention package funding and board reporting" },
    ],
    withoutDelay: "2–3 weeks to assess impact and begin retention conversations",
    withoutConsequence: "Competitors recruit your remaining leadership while you're still figuring out the org structure. Flight risk is contagious — each departure increases peer departure probability by 30%. $3.4M average replacement cost per critical executive.",
    withReadiness: "Flight risk model pulled and 25 critical retention calls initiated in 3 minutes — before competitors made contact.",
    timelineLabel: "Flight risk mapped. 25 retention calls initiated. Package designed. All in 3 minutes.",
    financialExposure: "Executive departure triggers avg 12% team attrition in 90 days — $3.4M replacement cost per critical departure",
    outcomeAnchor: "Flight risk model pulled and 25 critical retention calls initiated in 3 minutes — before competitors made contact.",
    industries: ["Technology", "Financial Services", "Healthcare", "Consulting", "Manufacturing", "Media"],
    triggerCount: 11,
  },
  {
    id: "workforce-restructuring",
    domain: "TRANSFORMATION",
    name: "Workforce Restructuring",
    description: "Board mandates 15% reduction — 6,700 roles across 12 countries to be addressed",
    protocol: "Workforce Transformation Protocol",
    protocolNum: 112,
    tasks: [
      { role: "CHRO", action: "Impact mapping complete: roles by business unit, geography, legal classification, and severance exposure by jurisdiction — all 12 countries mapped", minute: "1:30" },
      { role: "General Counsel", action: "Severance structure confirmed — WARN Act compliance, jurisdiction-specific labor law requirements, and litigation exposure by geography mapped", minute: "2:00" },
      { role: "CEO", action: "Board authorization for program design and budget — pre-approved parameters eliminate the revision cycle. Decision made with full information, not partial data.", minute: "3:00" },
      { role: "CMO + CHRO", action: "Communication plan staged: internal announcement, external messaging, customer and partner impact statements — all ready for simultaneous release", minute: "5:00" },
      { role: "CHRO", action: "Manager briefings complete across all geographies — every manager knows what to say, when to say it, and who to call for escalations and exceptions", minute: "8:00" },
      { role: "CEO", action: "All-hands with specific changes, rationale, and support programs — direct executive presence, no filtered Q&A, no information asymmetry across geographies", minute: "12:00" },
    ],
    stakeholders: [
      { name: "CHRO", role: "Program design and communications" },
      { name: "General Counsel", role: "Legal compliance across 12 jurisdictions" },
      { name: "COO", role: "Operational continuity and transition" },
    ],
    withoutDelay: "3–4 weeks to design program, secure board approval, and prepare communications",
    withoutConsequence: "Leaked information travels faster than your communication plan. Manager uncertainty causes the attrition you're trying to prevent. Class action exposure compounds when communications are uncoordinated across jurisdictions.",
    withReadiness: "Impact mapping complete, board authorized, and manager briefings staged — released simultaneously across all 12 countries in 12 minutes.",
    timelineLabel: "Mapping complete. Board authorized. Manager briefings live across all 12 countries.",
    financialExposure: "Poorly executed restructuring costs 3–5× in attrition, litigation, and productivity loss vs. a prepared response",
    outcomeAnchor: "Impact mapping complete, board authorized, manager briefings staged — released simultaneously across all 12 countries.",
    industries: ["All Industries", "Financial Services", "Technology", "Manufacturing", "Healthcare"],
    triggerCount: 8,
  },
  {
    id: "infrastructure-failure",
    domain: "TRANSFORMATION",
    name: "Infrastructure Failure",
    description: "Legacy ERP system failure — revenue-critical operations at risk, modernization forced",
    protocol: "Technology Infrastructure Response",
    protocolNum: 134,
    tasks: [
      { role: "CTO", action: "Assess failure scope: systems affected, estimated downtime, revenue operations at risk, customer-facing impact, and recovery pathway options with RTOs", minute: "1:30" },
      { role: "CISO", action: "Security impact assessment — determine if failure involves breach exposure, data integrity risk, or privilege escalation. Contain if breach indicators present.", minute: "2:00" },
      { role: "COO", action: "Business continuity activated — manual workarounds for revenue-critical operations, customer SLA impact mapped and communicated, exception process live", minute: "3:00" },
      { role: "CFO", action: "Emergency recovery investment authorized — pre-approved threshold eliminates the budget approval cycle. Vendor engagement authorized within defined parameters.", minute: "4:00" },
      { role: "CTO", action: "Vendor emergency engagement — pre-negotiated SLA acceleration invoked, dedicated support resources and incident command team activated", minute: "5:00" },
      { role: "CEO", action: "Board briefed on scope, recovery timeline, and modernization roadmap triggered by this event — decision framework and investment case pre-staged", minute: "12:00" },
    ],
    stakeholders: [
      { name: "CTO", role: "Technical recovery and modernization" },
      { name: "CISO", role: "Security and data integrity" },
      { name: "COO", role: "Business continuity and customer SLA" },
    ],
    withoutDelay: "1–2 weeks to mobilize technology teams and obtain recovery investment",
    withoutConsequence: "Customers discover the outage before your team has a containment plan. SLA breach penalties accumulate by the hour. $540K average cost per hour. By week 2, the modernization conversation is happening reactively, not strategically.",
    withReadiness: "BCP activated and vendor emergency support engaged before minute 5. Revenue-critical workarounds live before SLA windows opened.",
    timelineLabel: "BCP live. Vendor emergency SLA invoked. Revenue operations restored. Board briefed.",
    financialExposure: "$540K average cost per hour of critical system downtime at enterprise scale",
    outcomeAnchor: "BCP activated and vendor emergency support engaged before minute 5. Revenue-critical workarounds live before SLA windows opened.",
    industries: ["All Industries", "Retail", "Financial Services", "Healthcare", "Manufacturing", "Logistics"],
    triggerCount: 15,
  },
  {
    id: "strategic-pivot",
    domain: "TRANSFORMATION",
    name: "Strategic Pivot",
    description: "Board mandates business model shift — go-to-market acceleration required in 90 days",
    protocol: "Go-to-Market Acceleration Sprint",
    protocolNum: 89,
    tasks: [
      { role: "Chief Strategy Officer", action: "Market analysis complete: new segment sizing, competitive landscape entering, customer acquisition model, and 12-month revenue timeline — pre-built, not rebuilt", minute: "1:30" },
      { role: "CFO", action: "Resource reallocation model staged — investment shift from legacy model to growth model with board-approved thresholds and accountability framework", minute: "2:00" },
      { role: "CEO", action: "Board alignment on pivot rationale, 90-day milestones, and success metrics — pre-framed decision package enables rapid authorization without a preparation cycle", minute: "3:00" },
      { role: "CHRO", action: "Capability gap analysis complete — skills needed vs. skills available, reskilling roadmap, and hiring plan for critical gaps with retained search on standby", minute: "5:00" },
      { role: "Chief Revenue Officer", action: "Customer impact assessment — which customers follow to the new model, which need migration support, which represent churn risk. Outreach sequenced.", minute: "7:00" },
      { role: "CMO", action: "Positioning pivot staged — new messaging architecture, competitive repositioning, and market announcement sequence ready for execution", minute: "12:00" },
    ],
    stakeholders: [
      { name: "Chief Strategy Officer", role: "Market analysis and direction" },
      { name: "CFO", role: "Resource reallocation authorization" },
      { name: "CEO", role: "Board alignment and execution authority" },
    ],
    withoutDelay: "30-day alignment cycle before any execution begins on the new model",
    withoutConsequence: "The market window moves while you're still aligning the board. Competitors with faster operating models capture the opportunity while you're running a committee process. The 30-day delay is the competitive disadvantage.",
    withReadiness: "Market analysis complete and board authorization secured in 3 minutes. Resource reallocation staged before first competitive announcement.",
    timelineLabel: "Market analyzed. Board authorized. Resources reallocated. GTM staged. 12 minutes.",
    financialExposure: "30-day alignment cycle = $2–12M in foregone revenue for time-sensitive market shifts at scale",
    outcomeAnchor: "Market analysis complete and board authorization secured in 3 minutes. Resource reallocation staged before first competitive announcement.",
    industries: ["Technology", "Financial Services", "Healthcare", "Manufacturing", "Consumer", "Retail"],
    triggerCount: 12,
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

      <StandardNav />

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <div style={{ background: NAVY, padding: "56px 40px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, marginBottom: 16 }}>
            Situation Scanner — Self-Serve Proof Point
          </div>
          <h1 style={{ ...CG, fontSize: 52, fontWeight: 700, color: "#fff", lineHeight: 1.1, margin: "0 0 16px", maxWidth: 720 }}>
            Pick the situation.<br />
            <em style={{ color: GOLD }}>See your 12-minute response.</em>
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, maxWidth: 580, margin: "0 0 40px" }}>
            Every situation below has a pre-staged Readiness Protocol waiting. Select one and see exactly which tasks would fire, which stakeholders would be notified, and what the 12-minute execution window looks like. No login. No sales call. Just the response.
          </p>

          {/* Hero breadth stats */}
          <div style={{ display: "flex", gap: 0, flexWrap: "wrap" as const, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 28 }}>
            {[
              { val: "180", label: "Readiness Protocols" },
              { val: "231", label: "Strategic Situations Monitored" },
              { val: "3,600×", label: "Execution Head Start" },
              { val: "Startup → Fortune 500", label: "Full coverage range" },
            ].map((s, i) => (
              <div key={i} style={{
                paddingRight: 40, marginRight: 40,
                borderRight: i < 3 ? "1px solid rgba(255,255,255,0.1)" : "none",
              }}>
                <div style={{ ...CG, fontSize: 26, fontWeight: 700, color: GOLD, lineHeight: 1 }}>{s.val}</div>
                <div style={{ ...BC, fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 6 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── GOLD RULE ─────────────────────────────────────────────────────── */}
      <div style={{ background: GOLD, height: 3 }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px" }}>

        {/* ── STEP 1: SITUATION PICKER ──────────────────────────────────────── */}
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

            {/* 3,600× Banner */}
            <div style={{
              marginBottom: 32, padding: "16px 22px",
              background: NAVY,
              borderRadius: "0.15rem",
              display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" as const, gap: 12,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: GOLD, lineHeight: 1 }}>3,600×</div>
                <div>
                  <div style={{ ...BC, fontSize: 12, fontWeight: 700, color: "#fff", letterSpacing: "0.08em" }}>EXECUTION HEAD START</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 2 }}>30 days compressed to 12 minutes — the response is ready before the trigger fires</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 20 }}>
                <div style={{ textAlign: "center" as const }}>
                  <div style={{ ...BC, fontSize: 11, fontWeight: 700, color: GOLD }}>WITHOUT</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>{selected.withoutDelay.split(" ")[0]} {selected.withoutDelay.split(" ")[1]}</div>
                </div>
                <div style={{ ...BC, fontSize: 18, fontWeight: 300, color: "rgba(255,255,255,0.3)", alignSelf: "center" }}>→</div>
                <div style={{ textAlign: "center" as const }}>
                  <div style={{ ...BC, fontSize: 11, fontWeight: 700, color: TEAL }}>WITH READINESS OS</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>12 minutes</div>
                </div>
              </div>
            </div>

            {/* Protocol header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap" as const, gap: 20, marginBottom: 24 }}>
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
                  { val: `${selected.tasks.length}`, unit: "tasks", label: "Pre-staged" },
                  { val: `${selected.stakeholders.length}`, unit: "leads", label: "Auto-notified" },
                  { val: `${selected.triggerCount}`, unit: "triggers", label: "Protocol covers" },
                ].map((m, i) => (
                  <div key={i} style={{ textAlign: "center" as const, background: "#fff", border: "1px solid rgba(10,15,46,0.1)", padding: "12px 16px", borderRadius: "0.15rem" }}>
                    <div style={{ ...CG, fontSize: 22, fontWeight: 700, color: NAVY, lineHeight: 1 }}>{m.val}<span style={{ fontSize: 12 }}> {m.unit}</span></div>
                    <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 4 }}>{m.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial exposure callout */}
            <div style={{
              marginBottom: 28, padding: "14px 18px",
              background: "rgba(201,168,76,0.06)",
              borderLeft: `3px solid ${GOLD}`,
              borderRadius: "0.15rem",
              display: "flex", alignItems: "flex-start", gap: 12,
            }}>
              <div style={{ ...BC, fontSize: 9, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: GOLD, paddingTop: 2, flexShrink: 0 }}>Financial Exposure</div>
              <div style={{ fontSize: 13, color: "#374151", fontWeight: 600, lineHeight: 1.5 }}>{selected.financialExposure}</div>
            </div>

            {/* 12-minute timeline bar */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#6B7280", marginBottom: 12 }}>
                12-Minute Execution Window
              </div>
              <div style={{ position: "relative" as const, height: 6, background: "rgba(10,15,46,0.08)", borderRadius: 3, marginBottom: 28 }}>
                <div style={{ position: "absolute" as const, left: 0, top: 0, height: "100%", width: "100%", background: `linear-gradient(90deg, ${DOMAIN_COLOR[selected.domain]}, ${DOMAIN_COLOR[selected.domain]}80)`, borderRadius: 3 }} />
                {TIMELINE_STEPS.map((step, i) => {
                  const pct = i === 0 ? 0 : i === 1 ? 8 : i === 2 ? 25 : i === 3 ? 55 : 100;
                  return (
                    <div key={i} style={{ position: "absolute" as const, top: -4, left: `${pct}%`, transform: "translateX(-50%)" }}>
                      <div style={{ width: 14, height: 14, borderRadius: "50%", background: DOMAIN_COLOR[selected.domain], border: "2px solid white", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                      <div style={{ position: "absolute" as const, top: 20, left: "50%", transform: "translateX(-50%)", width: 90, textAlign: "center" as const, ...BC, fontSize: 9, fontWeight: 700, color: "#374151", letterSpacing: "0.04em", lineHeight: 1.3 }}>
                        {step}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Before / After comparison block */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, marginBottom: 32, borderRadius: "0.15rem", overflow: "hidden", border: "1px solid rgba(10,15,46,0.1)" }}>
              <div style={{ padding: "18px 22px", background: "rgba(192,57,43,0.04)", borderRight: "1px solid rgba(10,15,46,0.08)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#C0392B", flexShrink: 0 }} />
                  <span style={{ ...BC, fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#C0392B" }}>Without Readiness OS</span>
                </div>
                <div style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.65 }}>{selected.withoutConsequence}</div>
              </div>
              <div style={{ padding: "18px 22px", background: "rgba(43,138,110,0.04)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: TEAL, flexShrink: 0 }} />
                  <span style={{ ...BC, fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: TEAL }}>With Readiness OS</span>
                </div>
                <div style={{ fontSize: 13, color: "#374151", fontWeight: 600, lineHeight: 1.65 }}>{selected.withReadiness}</div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 28 }}>
              {/* Pre-staged tasks */}
              <div>
                <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#6B7280", marginBottom: 14 }}>
                  Pre-Staged Tasks — Activate in Sequence
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {selected.tasks.map((task, i) => (
                    <div key={i} style={{
                      display: "grid", gridTemplateColumns: "48px 1fr",
                      borderBottom: i < selected.tasks.length - 1 ? "1px solid rgba(10,15,46,0.07)" : "none",
                      padding: "13px 0",
                    }}>
                      <div style={{ paddingTop: 2 }}>
                        <div style={{ ...BC, fontSize: 12, fontWeight: 800, color: DOMAIN_COLOR[selected.domain] }}>{task.minute}</div>
                      </div>
                      <div>
                        <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#94A3B8", marginBottom: 3 }}>
                          {task.role}
                        </div>
                        <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>{task.action}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

                {/* Auto-notified stakeholders */}
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

                {/* Protocol outcome anchor (navy) */}
                <div style={{ background: NAVY, padding: "20px 22px", borderRadius: "0.15rem" }}>
                  <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: GOLD, marginBottom: 8 }}>
                    In Activation
                  </div>
                  <div style={{ ...CG, fontSize: 15, fontWeight: 600, color: "#fff", lineHeight: 1.5, marginBottom: 10 }}>
                    "{selected.outcomeAnchor}"
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", lineHeight: 1.55 }}>
                    Protocol #{selected.protocolNum} — staged and tested before this trigger fired.
                  </div>
                </div>

                {/* Industry reach */}
                <div style={{ background: "#fff", border: "1px solid rgba(10,15,46,0.1)", padding: "16px 22px", borderRadius: "0.15rem" }}>
                  <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#6B7280", marginBottom: 12 }}>
                    Industry Coverage
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6 }}>
                    {selected.industries.map((ind, i) => (
                      <span key={i} style={{
                        ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
                        padding: "4px 10px", borderRadius: "0.15rem",
                        background: DOMAIN_BG[selected.domain],
                        color: DOMAIN_COLOR[selected.domain] === NAVY ? "#374151" : DOMAIN_COLOR[selected.domain],
                        border: `1px solid ${DOMAIN_COLOR[selected.domain]}30`,
                      }}>
                        {ind}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Compound risk warning (conditional) */}
                {selected.compoundRisk && (
                  <div style={{
                    padding: "14px 16px", borderRadius: "0.15rem",
                    background: "rgba(201,168,76,0.06)",
                    border: `1px solid ${GOLD}40`,
                    borderLeft: `3px solid ${GOLD}`,
                  }}>
                    <div style={{ ...BC, fontSize: 9, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: GOLD, marginBottom: 6 }}>
                      ⚠ Compound Risk
                    </div>
                    <div style={{ fontSize: 11, color: "#6B7280", lineHeight: 1.55 }}>{selected.compoundRisk}</div>
                  </div>
                )}
              </div>
            </div>

            {/* ── EMAIL CAPTURE ─────────────────────────────────────────────────── */}
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

        {/* ── STEP 3: CTA FOOTER ──────────────────────────────────────────────── */}
        <div style={{
          margin: "48px 0 0", padding: "48px 44px",
          background: IVORY, border: "1px solid rgba(201,168,76,0.2)",
          borderTop: `3px solid ${GOLD}`, borderRadius: "0.15rem",
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 40, alignItems: "center", flexWrap: "wrap" as const }}>
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
              <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0, textAlign: "center" as const }}>
                2 slots · 90 days · no subscription fee
              </p>
            </div>
          </div>
        </div>

        <div style={{ height: 64 }} />
      </div>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <div style={{ background: NAVY, padding: "24px 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <VaughnMartinLogo variant="full" height={36} color="light" animated={false} noLink />
          <div style={{ ...BC, fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Readiness OS · 180 Protocols · 231 detection thresholds · 12-Minute Execution
          </div>
        </div>
      </div>

    </div>
  );
}
