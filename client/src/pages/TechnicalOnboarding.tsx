import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Link } from "wouter";
import { VaughnMartinLogo } from "@/components/VaughnMartinLogo";
import {
  CheckCircle2, Circle, ChevronDown, ChevronUp, ExternalLink,
  Shield, Zap, Users, Bell, Layers, Globe, Settings, Lock,
  Calendar, Clock, ArrowRight, Download, Building2, Database,
  Radio, Mail, MessageSquare, Key, Webhook, Server,
} from "lucide-react";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const IVORY = "#F0EDE4";
const BORDER = "#E2DDD4";
const MUTED = "#6B7280";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
const BC: React.CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };

interface IntegrationItem {
  name: string;
  owner: string;
  effort: "15 min" | "30 min" | "1 hr" | "2 hr" | "½ day";
  status: "live" | "roadmap";
  required: boolean;
  steps: string[];
  notes?: string;
}

interface Phase {
  id: string;
  num: string;
  title: string;
  timing: string;
  icon: React.ElementType;
  color: string;
  summary: string;
  items: IntegrationItem[];
}

const PHASES: Phase[] = [
  {
    id: "identity",
    num: "01",
    title: "Identity & Access",
    timing: "Day 1",
    icon: Key,
    color: NAVY,
    summary: "Provision access, configure SSO, and assign executive roles before any other integration begins.",
    items: [
      {
        name: "Microsoft Entra SSO",
        owner: "IT Admin",
        effort: "1 hr",
        status: "live",
        required: true,
        steps: [
          "Register Readiness OS as an Enterprise Application in Microsoft Entra admin center",
          "Configure SAML 2.0 or OIDC endpoint (provided by VaughnMartin onboarding team)",
          "Map Entra user attributes: email, displayName, jobTitle to Readiness OS user fields",
          "Test SSO login with 2–3 pilot users before full rollout",
        ],
        notes: "Single sign-on is the recommended auth path for all Founding Partners. Users log in with their existing Microsoft credentials — no separate passwords.",
      },
      {
        name: "Email Allowlist & User Provisioning",
        owner: "Platform Admin (VaughnMartin)",
        effort: "15 min",
        status: "live",
        required: true,
        steps: [
          "VaughnMartin adds approved email addresses to the platform allowlist via /admin/users",
          "Customer provides list of initial users (name, email, executive role)",
          "VaughnMartin sets role assignments: CEO, CFO, COO, CIO, CMO, CSO, General Counsel",
          "Users receive magic link email and complete 5-step onboarding wizard",
        ],
        notes: "The allowlist gates login. The platform is open only to listed addresses. Add them before sending invitations.",
      },
      {
        name: "Executive Role Mapping",
        owner: "Customer Executive Sponsor",
        effort: "30 min",
        status: "live",
        required: true,
        steps: [
          "In the onboarding wizard, assign domain ownership to named executives",
          "Map: Financial Response → CFO · Regulatory → General Counsel · Crisis & Comms → COO · Technology → CTO/CIO · Talent → CHRO",
          "Set executive sponsor (primary authorization authority for protocol activations)",
          "Confirm decision escalation path for each of the 9 strategic domains",
        ],
      },
    ],
  },
  {
    id: "communication",
    num: "02",
    title: "Communication Layer",
    timing: "Days 2–3",
    icon: Bell,
    color: TEAL,
    summary: "Connect the channels through which Readiness OS notifies executives when a trigger fires.",
    items: [
      {
        name: "Microsoft Teams",
        owner: "IT Admin",
        effort: "30 min",
        status: "live",
        required: true,
        steps: [
          "Create a dedicated Teams channel: 'Readiness OS — Executive Alerts'",
          "Generate an Incoming Webhook connector URL from the Teams channel settings",
          "Paste the webhook URL into Readiness OS Settings → Notifications → Teams",
          "Send a test activation from /mission-control to confirm delivery",
          "Optional: Create role-specific channels (e.g. 'Finance Alerts', 'Legal Alerts') and map them to domain owners",
        ],
        notes: "When a protocol activates, stakeholders receive a structured Teams card with trigger details, protocol name, and an authorization link. No context-switching required.",
      },
      {
        name: "Email (Outlook / Exchange)",
        owner: "IT Admin",
        effort: "15 min",
        status: "live",
        required: true,
        steps: [
          "Whitelist sending domain: @vaughnmartin.com and @resend.dev in your email gateway",
          "Confirm executive email addresses match Entra/allowlist entries exactly",
          "Test email delivery via Settings → Notifications → Send Test",
        ],
      },
      {
        name: "SMS Executive Alerts",
        owner: "Customer HR / Operations",
        effort: "15 min",
        status: "live",
        required: false,
        steps: [
          "In Settings → Stakeholders, add mobile number for each executive who requires SMS backup alerts",
          "SMS fires only for HIGH-risk triggers (score ≥ 75) as a secondary channel alongside email and Teams",
        ],
        notes: "Optional but strongly recommended for CEOs and CFOs who may not monitor Teams continuously.",
      },
    ],
  },
  {
    id: "execution",
    num: "03",
    title: "Work Execution Layer",
    timing: "Week 1",
    icon: Zap,
    color: GOLD,
    summary: "Connect the project management tools where pre-staged tasks land when a protocol activates.",
    items: [
      {
        name: "Jira",
        owner: "IT Admin / PMO",
        effort: "1 hr",
        status: "live",
        required: false,
        steps: [
          "In Readiness OS → Integration Hub, click 'Connect Jira' and authorize via OAuth",
          "Select the target Jira project where activation tasks should be created",
          "Map Readiness OS role assignments to Jira user accounts (CFO → jira-user@company.com)",
          "Configure task labels: all Readiness OS tasks tagged 'readiness-os' for filtering",
          "Test: activate a practice drill from /practice-drills and confirm tasks appear in Jira",
        ],
        notes: "When a protocol activates, Readiness OS seeds the full pre-staged task tree into Jira instantly — assigned, prioritized, and due-dated. Your team works in Jira; Readiness OS tracks authority and authorization.",
      },
      {
        name: "Asana",
        owner: "IT Admin / PMO",
        effort: "1 hr",
        status: "live",
        required: false,
        steps: [
          "In Integration Hub, connect Asana workspace via API key or OAuth",
          "Select target project/portfolio for activation tasks",
          "Confirm team member email mapping matches Asana workspace emails",
        ],
      },
      {
        name: "Smartsheet",
        owner: "IT Admin / Operations",
        effort: "1 hr",
        status: "live",
        required: false,
        steps: [
          "In Integration Hub, connect Smartsheet via API token",
          "Select destination sheet or workspace for activation task seeding",
          "Map Readiness OS domain owners to Smartsheet user accounts",
        ],
        notes: "Use Smartsheet if your operations team manages execution tracking there. All three tools (Jira, Asana, Smartsheet) can be connected simultaneously — protocols route tasks to whichever tool is configured per domain.",
      },
    ],
  },
  {
    id: "signals",
    num: "04",
    title: "Signal Intelligence",
    timing: "Week 1–2",
    icon: Radio,
    color: TEAL,
    summary: "Connect your internal systems so Readiness OS detects signals from inside your organization, not just external feeds.",
    items: [
      {
        name: "Inbound Webhook (Internal Systems)",
        owner: "IT Admin / Engineering",
        effort: "2 hr",
        status: "live",
        required: false,
        steps: [
          "In Integration Hub → Webhooks, generate an HMAC-signed webhook endpoint for your organization",
          "Copy the endpoint URL and secret key",
          "Configure your source system (ERP, SIEM, HR platform, financial system) to POST events to this endpoint",
          "Readiness OS validates HMAC signature on every inbound payload",
          "Map incoming event types to Readiness OS trigger categories (e.g. 'budget-variance' → Financial Crisis Response)",
          "Test with a sample payload and confirm trigger detection in /mission-control",
        ],
        notes: "Supports 12 enterprise system categories. Each webhook is HMAC-signed — your IT team controls what signals enter the platform. Common sources: SAP/Oracle (financial alerts), Splunk/Sentinel (security events), Workday (org change events), Salesforce (revenue signals).",
      },
      {
        name: "Custom RSS / News Feeds",
        owner: "Strategy / Intelligence Team",
        effort: "30 min",
        status: "live",
        required: false,
        steps: [
          "In Settings → Signal Sources, add custom RSS feed URLs relevant to your industry",
          "Tag each feed with relevant trigger categories for pattern matching",
          "Readiness OS polls all feeds on a 15-minute cycle and scores against 221 trigger patterns",
        ],
        notes: "The platform already monitors 39 public feeds. Custom feeds let you add industry-specific sources (trade publications, regulatory bodies, competitor newsrooms).",
      },
      {
        name: "SharePoint Signal Documents",
        owner: "IT Admin",
        effort: "1 hr",
        status: "live",
        required: false,
        steps: [
          "Connect SharePoint via Microsoft Graph API credentials",
          "Designate a monitored document library for strategy documents and board materials",
          "Readiness OS scans for keyword patterns that correlate with trigger conditions",
        ],
      },
    ],
  },
  {
    id: "microsoft",
    num: "05",
    title: "Advanced Microsoft Stack",
    timing: "Month 1",
    icon: Layers,
    color: NAVY,
    summary: "The full Microsoft agentic stack integration — positioning Readiness OS as the operating model above your existing Microsoft investment.",
    items: [
      {
        name: "Microsoft Copilot Studio",
        owner: "IT Admin / Microsoft Partner",
        effort: "½ day",
        status: "roadmap",
        required: false,
        steps: [
          "Deploy the Readiness OS Copilot Studio connector (provided in Month 1 of Founding Partner program)",
          "Enables executives to query protocol status and authorize activations via natural language in Teams/Outlook",
          "Connect to your existing Copilot Studio environment",
        ],
        notes: "Roadmap — available to Founding Partners in the Month 1 package. Keeps executives in their existing Microsoft workflow.",
      },
      {
        name: "Power Automate",
        owner: "IT Admin / Business Analyst",
        effort: "½ day",
        status: "roadmap",
        required: false,
        steps: [
          "Install the Readiness OS Power Automate connector",
          "Configure flows that trigger protocol activations from Power Platform events",
          "Map Power BI data alerts to Readiness OS financial and operational triggers",
        ],
      },
      {
        name: "Microsoft Sentinel",
        owner: "Security Team",
        effort: "½ day",
        status: "roadmap",
        required: false,
        steps: [
          "Connect Sentinel incident alerts to Readiness OS via the security webhook channel",
          "Map Sentinel severity levels to Readiness OS risk score thresholds",
          "Ransomware, data breach, and unauthorized access alerts automatically stage the relevant Readiness Protocol",
        ],
        notes: "Roadmap — Month 1. Closes the loop between your existing security monitoring and pre-staged cyber-incident response.",
      },
      {
        name: "Microsoft Fabric / Power BI",
        owner: "Data Team",
        effort: "½ day",
        status: "roadmap",
        required: false,
        steps: [
          "Connect Fabric data alerts to Readiness OS financial and operational trigger channels",
          "Map revenue variance thresholds to Financial Crisis Response protocols",
          "Supply chain disruption signals from Fabric data flows map to RISK & RESILIENCE protocols",
        ],
      },
    ],
  },
  {
    id: "validation",
    num: "06",
    title: "Go-Live Validation",
    timing: "End of Week 2",
    icon: CheckCircle2,
    color: TEAL,
    summary: "Confirm every integration is live and the platform responds end-to-end in under 12 minutes before signing off.",
    items: [
      {
        name: "Practice Drill — Full Signal-to-Authorization Chain",
        owner: "Executive Sponsor + IT Admin",
        effort: "30 min",
        status: "live",
        required: true,
        steps: [
          "Navigate to /practice-drills and select a scenario relevant to your industry",
          "Run the drill and confirm: signal detected → protocol staged → tasks seeded in Jira/Asana → Teams notification delivered → executive receives authorization request",
          "Measure time from signal to executive authorization — target: under 12 minutes",
          "Log the drill debrief and confirm outcome classification",
        ],
        notes: "This is the go-live gate. Every integration path above must complete successfully in this drill before the platform is considered live.",
      },
      {
        name: "Readiness Score Baseline",
        owner: "Executive Sponsor",
        effort: "15 min",
        status: "live",
        required: true,
        steps: [
          "Review your Executive Readiness Score in /dashboard after the drill completes",
          "Score reflects: signal coverage, protocol assignment completeness, stakeholder mapping, and integration health",
          "Target baseline: 70+ before end of Week 2",
          "Schedule Week 4 review to measure score improvement after first live activation",
        ],
      },
      {
        name: "Security & Compliance Review",
        owner: "CISO / General Counsel",
        effort: "1 hr",
        status: "live",
        required: false,
        steps: [
          "Review the Security & Compliance one-pager at /security-compliance",
          "Confirm data residency, encryption, and access control requirements are met",
          "Share with procurement/legal for vendor approval if required",
        ],
      },
    ],
  },
];

function StatusBadge({ status }: { status: "live" | "roadmap" }) {
  return (
    <span style={{
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      padding: "2px 8px",
      borderRadius: "0.15rem",
      background: status === "live" ? `${TEAL}18` : `${GOLD}18`,
      color: status === "live" ? TEAL : "#A07830",
      border: `1px solid ${status === "live" ? `${TEAL}40` : `${GOLD}50`}`,
      ...BC,
    }}>
      {status === "live" ? "Live Now" : "Month 1"}
    </span>
  );
}

function RequiredBadge() {
  return (
    <span style={{
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      padding: "2px 8px",
      borderRadius: "0.15rem",
      background: `${NAVY}10`,
      color: NAVY,
      border: `1px solid ${NAVY}25`,
      ...BC,
    }}>
      Required
    </span>
  );
}

function IntegrationCard({ item }: { item: IntegrationItem }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      border: `1px solid ${BORDER}`,
      borderRadius: "0.15rem",
      background: "#fff",
      marginBottom: 8,
      overflow: "hidden",
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "14px 18px",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <Circle size={16} color="#D1D5DB" style={{ flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>{item.name}</span>
            <StatusBadge status={item.status} />
            {item.required && <RequiredBadge />}
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 3 }}>
            <span style={{ fontSize: 11, color: MUTED }}>Owner: {item.owner}</span>
            <span style={{ fontSize: 11, color: MUTED }}>Est. setup: {item.effort}</span>
          </div>
        </div>
        {open ? <ChevronUp size={16} color={MUTED} /> : <ChevronDown size={16} color={MUTED} />}
      </button>

      {open && (
        <div style={{ padding: "0 18px 18px", borderTop: `1px solid ${BORDER}` }}>
          {item.notes && (
            <p style={{ fontSize: 13, color: "#4B5563", marginTop: 14, marginBottom: 12, lineHeight: 1.6, fontStyle: "italic", borderLeft: `3px solid ${GOLD}`, paddingLeft: 12 }}>
              {item.notes}
            </p>
          )}
          <div style={{ marginTop: item.notes ? 0 : 14 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8, ...BC }}>Setup Steps</p>
            <ol style={{ margin: 0, padding: "0 0 0 18px" }}>
              {item.steps.map((step, i) => (
                <li key={i} style={{ fontSize: 13, color: "#374151", lineHeight: 1.7, marginBottom: 4 }}>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}

function PhaseSection({ phase }: { phase: Phase }) {
  const [expanded, setExpanded] = useState(phase.num === "01");
  const Icon = phase.icon;
  const liveCount = phase.items.filter(i => i.status === "live").length;
  const reqCount = phase.items.filter(i => i.required).length;

  return (
    <div style={{ marginBottom: 24 }}>
      <button
        onClick={() => setExpanded(e => !e)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "20px 24px",
          background: expanded ? NAVY : "#fff",
          border: `1px solid ${expanded ? NAVY : BORDER}`,
          borderRadius: "0.15rem",
          cursor: "pointer",
          textAlign: "left",
          transition: "all 0.2s",
        }}
      >
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: expanded ? `${GOLD}25` : `${phase.color}12`,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <Icon size={18} color={expanded ? GOLD : phase.color} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: expanded ? GOLD : MUTED, letterSpacing: "0.12em", ...BC }}>
              PHASE {phase.num}
            </span>
            <span style={{
              fontSize: 10, fontWeight: 700, color: expanded ? `${GOLD}CC` : MUTED,
              background: expanded ? `${GOLD}20` : `${BORDER}`,
              padding: "1px 7px", borderRadius: "0.15rem", letterSpacing: "0.06em", ...BC,
            }}>
              {phase.timing}
            </span>
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, color: expanded ? "#fff" : NAVY, marginTop: 2 }}>
            {phase.title}
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: 11, color: expanded ? `${GOLD}CC` : MUTED }}>
            {liveCount} live · {phase.items.length - liveCount} roadmap
          </div>
          {reqCount > 0 && (
            <div style={{ fontSize: 11, color: expanded ? "#fff" : NAVY, fontWeight: 600 }}>
              {reqCount} required
            </div>
          )}
        </div>
        {expanded ? <ChevronUp size={18} color={GOLD} /> : <ChevronDown size={18} color={MUTED} />}
      </button>

      {expanded && (
        <div style={{ padding: "20px 24px", background: IVORY, border: `1px solid ${BORDER}`, borderTop: "none", borderRadius: "0 0 0.15rem 0.15rem" }}>
          <p style={{ fontSize: 14, color: "#374151", marginBottom: 20, lineHeight: 1.6 }}>{phase.summary}</p>
          {phase.items.map(item => (
            <IntegrationCard key={item.name} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TechnicalOnboarding() {
  const totalLive = PHASES.flatMap(p => p.items).filter(i => i.status === "live").length;
  const totalItems = PHASES.flatMap(p => p.items).length;
  const totalRequired = PHASES.flatMap(p => p.items).filter(i => i.required).length;

  return (
    <PageLayout>
      <h1 className="sr-only">Technical Integration Onboarding — Readiness OS</h1>

      {/* Header */}
      <div style={{ background: NAVY, padding: "56px 0 48px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 32px" }}>
          <VaughnMartinLogo size={40} color="light" />
          <div style={{ marginTop: 32 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12, ...BC }}>
              Founding Partner · Technical Onboarding
            </p>
            <h2 style={{ fontSize: 38, fontWeight: 700, color: "#fff", margin: 0, lineHeight: 1.15, ...CG }}>
              Integration Setup Plan
            </h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", marginTop: 14, maxWidth: 620, lineHeight: 1.7 }}>
              A phased technical guide for connecting Readiness OS into your existing technology environment —
              from identity and communication through work execution and signal intelligence.
            </p>
          </div>

          {/* Stats strip */}
          <div style={{ display: "flex", gap: 32, marginTop: 36, flexWrap: "wrap" }}>
            {[
              { label: "Total Integrations", value: String(totalItems) },
              { label: "Live on Day 1", value: String(totalLive) },
              { label: "Required", value: String(totalRequired) },
              { label: "Target Go-Live", value: "14 Days" },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: 28, fontWeight: 700, color: GOLD, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 4, letterSpacing: "0.08em", textTransform: "uppercase", ...BC }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gold rule */}
      <div style={{ height: 3, background: GOLD }} />

      {/* Timeline overview */}
      <div style={{ background: "#fff", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 32px" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20, ...BC }}>Integration Timeline</p>
          <div style={{ display: "flex", gap: 0, overflowX: "auto" }}>
            {PHASES.map((phase, idx) => {
              const Icon = phase.icon;
              return (
                <div key={phase.id} style={{ display: "flex", alignItems: "center", flex: idx < PHASES.length - 1 ? 1 : "none" }}>
                  <div style={{ textAlign: "center", minWidth: 100 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: "50%",
                      background: `${phase.color}15`,
                      border: `2px solid ${phase.color}40`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      margin: "0 auto 8px",
                    }}>
                      <Icon size={18} color={phase.color} />
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em", ...BC }}>{phase.timing}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: NAVY, marginTop: 2, lineHeight: 1.3 }}>{phase.title}</div>
                  </div>
                  {idx < PHASES.length - 1 && (
                    <div style={{ flex: 1, height: 2, background: `${BORDER}`, margin: "0 4px", position: "relative", top: -12 }}>
                      <ArrowRight size={12} color={BORDER} style={{ position: "absolute", right: -6, top: -5 }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Phases */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 32px" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6, ...BC }}>How to Use This Plan</p>
            <p style={{ fontSize: 14, color: "#4B5563", maxWidth: 560, lineHeight: 1.7 }}>
              Work through each phase in order. Click any integration to expand setup steps.
              <strong style={{ color: NAVY }}> Required</strong> items must be completed before go-live.
              <strong style={{ color: "#A07830" }}> Month 1</strong> items are delivered as part of the Founding Partner program.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href="/universal-connector" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontSize: 12, fontWeight: 700, color: "#fff",
              background: TEAL, border: `1px solid ${TEAL}`, padding: "8px 14px",
              borderRadius: "0.15rem", textDecoration: "none", whiteSpace: "nowrap",
            }}>
              <Globe size={14} />
              All Connectors
            </Link>
            <Link href="/security-compliance" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontSize: 12, fontWeight: 700, color: NAVY,
              border: `1px solid ${BORDER}`, padding: "8px 14px",
              borderRadius: "0.15rem", textDecoration: "none", whiteSpace: "nowrap",
            }}>
              <Shield size={14} />
              Security & Compliance
            </Link>
          </div>
        </div>

        {PHASES.map(phase => (
          <PhaseSection key={phase.id} phase={phase} />
        ))}

        {/* Footer CTA block */}
        <div style={{
          marginTop: 48, padding: "36px 32px",
          background: NAVY, borderRadius: "0.15rem",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8, ...BC }}>
                Your VaughnMartin Onboarding Team
              </p>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: "0 0 10px", ...CG }}>
                We configure alongside your IT team.
              </h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", maxWidth: 440, lineHeight: 1.7, margin: 0 }}>
                Every Founding Partner receives a dedicated onboarding engineer for the first 14 days.
                We handle the webhook configuration, role mapping, and go-live validation alongside your team.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Link href="/getting-started" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: GOLD, color: NAVY, fontWeight: 700, fontSize: 13,
                padding: "12px 22px", borderRadius: "0.15rem", textDecoration: "none",
                letterSpacing: "0.04em", ...BC,
              }}>
                <CheckCircle2 size={15} />
                View Go-Live Dashboard
                <ArrowRight size={14} />
              </Link>
              <Link href="/integration-hub" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "transparent", color: "rgba(255,255,255,0.8)", fontWeight: 600, fontSize: 13,
                padding: "12px 22px", borderRadius: "0.15rem", textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.2)",
                letterSpacing: "0.04em", ...BC,
              }}>
                <Settings size={15} />
                Open Integration Hub
              </Link>
            </div>
          </div>
        </div>

        {/* Contact strip */}
        <div style={{ marginTop: 20, padding: "18px 24px", background: IVORY, border: `1px solid ${BORDER}`, borderRadius: "0.15rem", display: "flex", gap: 32, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Mail size={14} color={TEAL} />
            <span style={{ fontSize: 13, color: NAVY, fontWeight: 600 }}>Technical onboarding:</span>
            <a href="mailto:onboarding@vaughnmartin.com" style={{ fontSize: 13, color: TEAL, textDecoration: "none" }}>onboarding@vaughnmartin.com</a>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Shield size={14} color={TEAL} />
            <span style={{ fontSize: 13, color: NAVY, fontWeight: 600 }}>Security questions:</span>
            <a href="mailto:security@vaughnmartin.com" style={{ fontSize: 13, color: TEAL, textDecoration: "none" }}>security@vaughnmartin.com</a>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Clock size={14} color={MUTED} />
            <span style={{ fontSize: 13, color: MUTED }}>Average go-live: 8 business days</span>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
