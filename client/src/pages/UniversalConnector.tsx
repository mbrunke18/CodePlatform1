import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Link } from "wouter";
import { VaughnMartinLogo } from "@/components/VaughnMartinLogo";
import {
  Zap, Shield, Bell, CheckCircle2, Copy, ChevronDown, ChevronUp,
  ArrowRight, Globe, Key, Radio, Database, Users, Lock,
  Code, Webhook, Server, Mail, MessageSquare, ExternalLink,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const IVORY = "#F0EDE4";
const BORDER = "#E2DDD4";
const MUTED = "#6B7280";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
const BC: React.CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };

type ConnectorStatus = "live" | "beta" | "roadmap";

interface Connector {
  name: string;
  logo?: string;
  status: ConnectorStatus;
  setupTime: string;
  method: "oauth" | "api-key" | "saml" | "webhook" | "smtp";
}

interface ConnectorCategory {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  connectors: Connector[];
}

const CATEGORIES: ConnectorCategory[] = [
  {
    id: "identity",
    label: "Identity & SSO",
    icon: Key,
    color: NAVY,
    connectors: [
      { name: "Microsoft Entra (Azure AD)", status: "live", setupTime: "1 hr", method: "saml" },
      { name: "Okta", status: "live", setupTime: "30 min", method: "saml" },
      { name: "Google Workspace", status: "live", setupTime: "30 min", method: "saml" },
      { name: "PingFederate / PingOne", status: "live", setupTime: "1 hr", method: "saml" },
      { name: "Auth0", status: "live", setupTime: "30 min", method: "saml" },
      { name: "OneLogin", status: "live", setupTime: "30 min", method: "saml" },
      { name: "Duo Security", status: "live", setupTime: "30 min", method: "saml" },
      { name: "Active Directory (ADFS)", status: "live", setupTime: "1 hr", method: "saml" },
    ],
  },
  {
    id: "communication",
    label: "Communication",
    icon: MessageSquare,
    color: TEAL,
    connectors: [
      { name: "Microsoft Teams", status: "live", setupTime: "30 min", method: "webhook" },
      { name: "Slack", status: "live", setupTime: "30 min", method: "oauth" },
      { name: "Google Chat", status: "live", setupTime: "30 min", method: "webhook" },
      { name: "Zoom", status: "beta", setupTime: "30 min", method: "webhook" },
      { name: "Webex", status: "beta", setupTime: "30 min", method: "webhook" },
      { name: "RingCentral", status: "roadmap", setupTime: "30 min", method: "webhook" },
      { name: "Email (any SMTP)", status: "live", setupTime: "15 min", method: "smtp" },
    ],
  },
  {
    id: "project",
    label: "Project Management",
    icon: CheckCircle2,
    color: GOLD,
    connectors: [
      { name: "Jira", status: "live", setupTime: "1 hr", method: "oauth" },
      { name: "Asana", status: "live", setupTime: "1 hr", method: "oauth" },
      { name: "Smartsheet", status: "live", setupTime: "1 hr", method: "api-key" },
      { name: "Monday.com", status: "live", setupTime: "1 hr", method: "api-key" },
      { name: "Linear", status: "beta", setupTime: "30 min", method: "api-key" },
      { name: "ClickUp", status: "beta", setupTime: "1 hr", method: "api-key" },
      { name: "Notion", status: "beta", setupTime: "30 min", method: "api-key" },
      { name: "Trello", status: "roadmap", setupTime: "30 min", method: "oauth" },
      { name: "Microsoft Project / Planner", status: "live", setupTime: "1 hr", method: "oauth" },
    ],
  },
  {
    id: "itsm",
    label: "ITSM & Incident",
    icon: Bell,
    color: TEAL,
    connectors: [
      { name: "ServiceNow", status: "live", setupTime: "2 hr", method: "api-key" },
      { name: "PagerDuty", status: "live", setupTime: "30 min", method: "api-key" },
      { name: "Zendesk", status: "live", setupTime: "30 min", method: "api-key" },
      { name: "Freshservice", status: "beta", setupTime: "30 min", method: "api-key" },
      { name: "BMC Remedy / Helix", status: "roadmap", setupTime: "2 hr", method: "webhook" },
      { name: "Opsgenie", status: "live", setupTime: "30 min", method: "api-key" },
    ],
  },
  {
    id: "security",
    label: "Security & SIEM",
    icon: Shield,
    color: NAVY,
    connectors: [
      { name: "Splunk", status: "live", setupTime: "2 hr", method: "webhook" },
      { name: "Microsoft Sentinel", status: "roadmap", setupTime: "1 hr", method: "webhook" },
      { name: "CrowdStrike", status: "live", setupTime: "1 hr", method: "api-key" },
      { name: "Palo Alto Cortex", status: "beta", setupTime: "1 hr", method: "api-key" },
      { name: "Rapid7 InsightIDR", status: "beta", setupTime: "1 hr", method: "webhook" },
      { name: "Qualys", status: "roadmap", setupTime: "1 hr", method: "api-key" },
      { name: "IBM QRadar", status: "roadmap", setupTime: "2 hr", method: "webhook" },
    ],
  },
  {
    id: "erp",
    label: "ERP & Finance",
    icon: Database,
    color: GOLD,
    connectors: [
      { name: "SAP S/4HANA", status: "live", setupTime: "½ day", method: "webhook" },
      { name: "Oracle Fusion", status: "live", setupTime: "½ day", method: "webhook" },
      { name: "NetSuite", status: "live", setupTime: "2 hr", method: "api-key" },
      { name: "Workday", status: "live", setupTime: "2 hr", method: "webhook" },
      { name: "ADP Workforce Now", status: "beta", setupTime: "2 hr", method: "webhook" },
      { name: "Coupa", status: "roadmap", setupTime: "2 hr", method: "api-key" },
      { name: "QuickBooks / Intuit", status: "beta", setupTime: "1 hr", method: "oauth" },
    ],
  },
  {
    id: "crm",
    label: "CRM & Revenue",
    icon: Users,
    color: TEAL,
    connectors: [
      { name: "Salesforce", status: "live", setupTime: "1 hr", method: "oauth" },
      { name: "HubSpot", status: "live", setupTime: "30 min", method: "oauth" },
      { name: "Microsoft Dynamics 365", status: "live", setupTime: "1 hr", method: "oauth" },
      { name: "Gainsight", status: "beta", setupTime: "1 hr", method: "api-key" },
      { name: "Marketo", status: "roadmap", setupTime: "1 hr", method: "api-key" },
    ],
  },
  {
    id: "cloud",
    label: "Cloud & Monitoring",
    icon: Server,
    color: NAVY,
    connectors: [
      { name: "AWS CloudWatch / SNS", status: "live", setupTime: "1 hr", method: "webhook" },
      { name: "Google Cloud Pub/Sub", status: "live", setupTime: "1 hr", method: "webhook" },
      { name: "Microsoft Azure Monitor", status: "live", setupTime: "1 hr", method: "webhook" },
      { name: "Datadog", status: "live", setupTime: "30 min", method: "webhook" },
      { name: "New Relic", status: "beta", setupTime: "30 min", method: "webhook" },
      { name: "PagerDuty AIOps", status: "live", setupTime: "30 min", method: "api-key" },
    ],
  },
];

function StatusPill({ status }: { status: ConnectorStatus }) {
  const map = {
    live: { label: "Live", bg: `${TEAL}18`, color: TEAL, border: `${TEAL}40` },
    beta: { label: "Beta", bg: `${GOLD}18`, color: "#A07830", border: `${GOLD}50` },
    roadmap: { label: "Q3 2026", bg: "#f3f4f6", color: MUTED, border: "#E5E7EB" },
  };
  const s = map[status];
  return (
    <span style={{
      fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
      padding: "2px 6px", borderRadius: "0.15rem",
      background: s.bg, color: s.color, border: `1px solid ${s.border}`, ...BC,
    }}>
      {s.label}
    </span>
  );
}

function MethodPill({ method }: { method: Connector["method"] }) {
  const labels: Record<Connector["method"], string> = {
    oauth: "OAuth 2.0", "api-key": "API Key", saml: "SAML 2.0", webhook: "Webhook", smtp: "SMTP",
  };
  return (
    <span style={{
      fontSize: 9, fontWeight: 600, color: MUTED,
      background: "#F9FAFB", border: "1px solid #E5E7EB",
      padding: "1px 6px", borderRadius: "0.15rem", ...BC,
      letterSpacing: "0.06em", textTransform: "uppercase",
    }}>
      {labels[method]}
    </span>
  );
}

function CategorySection({ cat }: { cat: ConnectorCategory }) {
  const [open, setOpen] = useState(cat.id === "identity");
  const Icon = cat.icon;
  const liveCount = cat.connectors.filter(c => c.status === "live").length;

  return (
    <div style={{ marginBottom: 12, border: `1px solid ${BORDER}`, borderRadius: "0.15rem", overflow: "hidden" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: 14,
          padding: "16px 20px", background: open ? NAVY : "#fff",
          border: "none", cursor: "pointer", textAlign: "left",
        }}
      >
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: open ? `${GOLD}20` : `${cat.color}12`,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Icon size={16} color={open ? GOLD : cat.color} />
        </div>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: open ? "#fff" : NAVY }}>{cat.label}</span>
          <span style={{ fontSize: 11, color: open ? "rgba(255,255,255,0.5)" : MUTED, marginLeft: 10 }}>
            {liveCount} live · {cat.connectors.length - liveCount} coming
          </span>
        </div>
        {open ? <ChevronUp size={16} color={GOLD} /> : <ChevronDown size={16} color={MUTED} />}
      </button>

      {open && (
        <div style={{ background: IVORY, borderTop: `1px solid ${BORDER}` }}>
          {cat.connectors.map((conn, i) => (
            <div key={conn.name} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "11px 20px",
              borderBottom: i < cat.connectors.length - 1 ? `1px solid ${BORDER}` : "none",
              background: "#fff",
              opacity: conn.status === "roadmap" ? 0.7 : 1,
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                background: conn.status === "live" ? TEAL : conn.status === "beta" ? GOLD : "#D1D5DB",
              }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: NAVY, flex: 1 }}>{conn.name}</span>
              <MethodPill method={conn.method} />
              <span style={{ fontSize: 11, color: MUTED, minWidth: 50, textAlign: "right" }}>{conn.setupTime}</span>
              <StatusPill status={conn.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CodeBlock({ code, label }: { code: string; label: string }) {
  const { toast } = useToast();
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase", ...BC }}>{label}</span>
        <button
          onClick={() => { navigator.clipboard.writeText(code); toast({ title: "Copied", description: "Payload copied to clipboard" }); }}
          style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: TEAL, background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}
        >
          <Copy size={12} /> Copy
        </button>
      </div>
      <pre style={{
        background: "#0D1117", color: "#E6EDF3", padding: "16px 20px",
        borderRadius: "0.15rem", fontSize: 12, lineHeight: 1.7,
        overflowX: "auto", margin: 0, fontFamily: "monospace",
      }}>
        {code}
      </pre>
    </div>
  );
}

const WEBHOOK_SAMPLE = `POST https://app.readinessos.com/api/webhooks/signal
Content-Type: application/json
X-HMAC-Signature: sha256=<your-signature>

{
  "event_type": "financial_alert",
  "source": "SAP",
  "severity": "high",
  "title": "Q3 revenue variance exceeds threshold",
  "details": "Actual vs forecast gap: -$14.2M",
  "timestamp": "2026-05-24T09:12:00Z",
  "metadata": {
    "department": "Finance",
    "region": "North America"
  }
}`;

const CURL_SAMPLE = `curl -X POST https://app.readinessos.com/api/webhooks/signal \\
  -H "Content-Type: application/json" \\
  -H "X-HMAC-Signature: sha256=$(echo -n '{...}' | openssl dgst -sha256 -hmac YOUR_SECRET)" \\
  -d '{"event_type":"security_alert","severity":"critical","title":"Unauthorized access detected"}'`;

export default function UniversalConnector() {
  const totalLive = CATEGORIES.flatMap(c => c.connectors).filter(c => c.status === "live").length;
  const totalConnectors = CATEGORIES.flatMap(c => c.connectors).length;

  return (
    <PageLayout>
      <h1 className="sr-only">Universal Integration Connector — Readiness OS</h1>

      {/* Header */}
      <div style={{ background: NAVY, padding: "56px 0 48px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 32px" }}>
          <VaughnMartinLogo size={40} color="light" />
          <div style={{ marginTop: 32 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12, ...BC }}>
              Stack-Agnostic Integration
            </p>
            <h2 style={{ fontSize: 40, fontWeight: 700, color: "#fff", margin: 0, lineHeight: 1.15, ...CG }}>
              Connects to any stack.<br />Live in 15 minutes.
            </h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", marginTop: 14, maxWidth: 600, lineHeight: 1.7 }}>
              Readiness OS is stack-agnostic by design. Three universal layers — identity, signals, and
              execution — connect to any enterprise platform. Pre-built connectors handle the most common
              systems. Everything else connects via REST in minutes.
            </p>
          </div>

          <div style={{ display: "flex", gap: 36, marginTop: 36, flexWrap: "wrap" }}>
            {[
              { label: "Pre-Built Connectors", value: String(totalConnectors) + "+" },
              { label: "Live Today", value: String(totalLive) },
              { label: "Universal Webhook", value: "Any system" },
              { label: "Minimum Setup", value: "15 min" },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: 28, fontWeight: 700, color: GOLD, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 4, letterSpacing: "0.08em", textTransform: "uppercase", ...BC }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ height: 3, background: GOLD }} />

      {/* Universal 3-layer approach */}
      <div style={{ background: "#fff", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 32px" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 24, ...BC }}>
            The Universal Integration Stack — Works With Everything
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {[
              {
                icon: Key,
                color: NAVY,
                title: "SAML 2.0 / OIDC Identity",
                sub: "15–60 min",
                body: "Any enterprise identity provider — Okta, Microsoft Entra, Google Workspace, PingFederate, Auth0, ADFS — connects via standard SAML 2.0 or OIDC. No custom development required.",
                badge: "Any IdP",
              },
              {
                icon: Webhook,
                color: TEAL,
                title: "HMAC REST Webhook",
                sub: "15 min",
                body: "Any system that can make an HTTP POST sends signals into Readiness OS. SAP, Oracle, Splunk, Workday, custom internal tools — one endpoint, HMAC-signed, receives from all of them simultaneously.",
                badge: "Any Source",
              },
              {
                icon: Bell,
                color: GOLD,
                title: "Outbound Notification",
                sub: "15 min",
                body: "Email (any SMTP), webhook (any endpoint), or pre-built channel (Teams, Slack, Google Chat). When a protocol activates, work lands wherever your teams already operate — no new tools to adopt.",
                badge: "Any Channel",
              },
            ].map(card => {
              const Icon = card.icon;
              return (
                <div key={card.title} style={{
                  padding: "24px 20px", border: `1px solid ${BORDER}`,
                  borderRadius: "0.15rem", background: IVORY,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: "50%",
                      background: `${card.color}15`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Icon size={18} color={card.color} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>{card.title}</div>
                      <div style={{ fontSize: 11, color: MUTED }}>Setup: {card.sub}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.7, margin: "0 0 12px" }}>{card.body}</p>
                  <span style={{
                    fontSize: 10, fontWeight: 700, color: card.color,
                    background: `${card.color}12`, border: `1px solid ${card.color}30`,
                    padding: "2px 8px", borderRadius: "0.15rem", letterSpacing: "0.08em", ...BC,
                    textTransform: "uppercase",
                  }}>
                    {card.badge}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Microsoft Stack — featured section */}
      <div style={{ background: `${NAVY}F5`, borderBottom: `1px solid ${NAVY}` }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 24, marginBottom: 28 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 10, ...BC }}>
                Microsoft Ecosystem — First-Class Stack
              </p>
              <h3 style={{ fontSize: 26, fontWeight: 700, color: "#fff", margin: "0 0 10px", ...CG }}>
                Every enterprise has Microsoft's AI stack.<br />None have the operating model to use it.
              </h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", maxWidth: 520, lineHeight: 1.7, margin: 0 }}>
                Readiness OS is the operating model layer above your existing Microsoft investment —
                not a replacement, an orchestrator. If your organization runs on Microsoft,
                every component of the stack plugs in directly.
              </p>
            </div>
            <Link href="/ecosystem" style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              fontSize: 12, fontWeight: 700, color: GOLD,
              border: `1px solid ${GOLD}50`, padding: "9px 16px",
              borderRadius: "0.15rem", textDecoration: "none", whiteSpace: "nowrap",
              alignSelf: "flex-start",
            }}>
              <Globe size={13} />
              View Ecosystem Diagram
              <ArrowRight size={12} />
            </Link>
          </div>

          {/* Live now */}
          <p style={{ fontSize: 10, fontWeight: 700, color: TEAL, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10, ...BC }}>Live Now</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 24 }}>
            {[
              { name: "Microsoft Teams", desc: "Executive alerts, authorization requests, stakeholder notifications via Incoming Webhook or Graph API.", time: "30 min" },
              { name: "Outlook / Exchange", desc: "Magic link delivery, stakeholder email cascades, activation summaries. Works with any Exchange or M365 tenant.", time: "15 min" },
              { name: "SharePoint", desc: "Signal document monitoring. Strategy docs and board materials scanned for trigger-correlated patterns.", time: "1 hr" },
              { name: "Microsoft Entra", desc: "SSO via SAML 2.0 or OIDC. Users authenticate with existing Microsoft credentials — no separate login.", time: "1 hr" },
            ].map(item => (
              <div key={item.name} style={{
                background: "rgba(255,255,255,0.06)", border: `1px solid rgba(255,255,255,0.12)`,
                borderRadius: "0.15rem", padding: "16px 16px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: TEAL, flexShrink: 0, display: "inline-block" }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{item.name}</span>
                </div>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, margin: "0 0 10px" }}>{item.desc}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <Zap size={10} color={TEAL} />
                  <span style={{ fontSize: 10, color: TEAL, fontWeight: 700 }}>Setup: {item.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Roadmap */}
          <p style={{ fontSize: 10, fontWeight: 700, color: GOLD, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10, ...BC }}>Founding Partner — Month 1 Delivery</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
            {[
              { name: "Copilot Studio", desc: "Query protocol status and authorize activations via natural language inside Teams or Outlook." },
              { name: "Power Automate", desc: "Trigger protocol activations from Power Platform events. Map Power BI data alerts to financial triggers." },
              { name: "Microsoft Sentinel", desc: "Ransomware, breach, and unauthorized access incidents auto-stage the relevant Readiness Protocol." },
              { name: "Microsoft Fabric", desc: "Revenue variance and supply chain disruption signals from Fabric data flows map directly to protocols." },
            ].map(item => (
              <div key={item.name} style={{
                background: "rgba(201,168,76,0.06)", border: `1px solid rgba(201,168,76,0.2)`,
                borderRadius: "0.15rem", padding: "16px 16px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: GOLD, flexShrink: 0, display: "inline-block" }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: GOLD }}>{item.name}</span>
                </div>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 32px" }}>

        {/* Quickstart */}
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 20, ...BC }}>
            Universal Quickstart — Any System Connected in 3 Steps
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
            {[
              {
                num: "1",
                title: "Configure SSO",
                body: "Register Readiness OS in your identity provider (Okta, Entra, Google, or any SAML 2.0 / OIDC provider). Users log in with existing credentials. Setup: 15–60 min.",
                time: "15–60 min",
              },
              {
                num: "2",
                title: "Send your first signal",
                body: "Paste your HMAC webhook endpoint into any source system. POST a test payload. Signal appears in your Mission Control feed within seconds. Setup: 15 min.",
                time: "15 min",
              },
              {
                num: "3",
                title: "Connect your execution channel",
                body: "Add a webhook URL from Teams, Slack, Google Chat, or any endpoint. Alternatively, add email addresses. When a protocol activates, work lands there instantly.",
                time: "15 min",
              },
            ].map(step => (
              <div key={step.num} style={{
                padding: "20px", border: `1px solid ${BORDER}`,
                borderRadius: "0.15rem", background: "#fff", position: "relative",
              }}>
                <div style={{
                  fontSize: 40, fontWeight: 700, color: `${GOLD}30`,
                  lineHeight: 1, marginBottom: 10, ...CG,
                }}>
                  {step.num}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 8 }}>{step.title}</div>
                <p style={{ fontSize: 13, color: "#4B5563", lineHeight: 1.7, margin: "0 0 12px" }}>{step.body}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Zap size={12} color={TEAL} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: TEAL }}>{step.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Webhook code samples */}
          <div style={{ background: "#F8F9FA", border: `1px solid ${BORDER}`, borderRadius: "0.15rem", padding: "24px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <Code size={16} color={NAVY} />
              <span style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>Webhook Reference</span>
              <span style={{ fontSize: 11, color: MUTED }}>— drop into any system that supports HTTP POST</span>
            </div>
            <CodeBlock label="Sample Payload (SAP financial alert)" code={WEBHOOK_SAMPLE} />
            <CodeBlock label="cURL quicktest" code={CURL_SAMPLE} />
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 8 }}>
              {[
                "event_type — maps to 1 of 221 trigger patterns",
                "severity — low / medium / high / critical",
                "Any JSON body accepted — unknown fields ignored",
                "HMAC secret generated per org in Integration Hub",
              ].map(note => (
                <div key={note} style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                  <CheckCircle2 size={12} color={TEAL} style={{ marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: "#4B5563" }}>{note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Connector catalog */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 6, ...BC }}>
                Pre-Built Connector Catalog
              </p>
              <p style={{ fontSize: 14, color: "#4B5563", margin: 0 }}>
                Click any category to see available connectors. Not on the list? Use the universal webhook — it connects anything.
              </p>
            </div>
            <div style={{ display: "flex", gap: 16, fontSize: 12, color: MUTED }}>
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: TEAL, display: "inline-block" }} /> Live</span>
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: GOLD, display: "inline-block" }} /> Beta</span>
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#D1D5DB", display: "inline-block" }} /> Q3 2026</span>
            </div>
          </div>

          {CATEGORIES.map(cat => (
            <CategorySection key={cat.id} cat={cat} />
          ))}
        </div>

        {/* Not on the list */}
        <div style={{
          marginTop: 32, padding: "28px 28px",
          background: `${TEAL}0D`, border: `1px solid ${TEAL}30`,
          borderRadius: "0.15rem", borderLeft: `4px solid ${TEAL}`,
        }}>
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <Globe size={20} color={TEAL} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: NAVY, marginBottom: 6 }}>Platform not on the list?</div>
              <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.7, margin: "0 0 12px" }}>
                The universal webhook connects any system that supports HTTP POST — regardless of vendor, age, or stack.
                Legacy ERP systems, custom internal tools, proprietary industry platforms — if it can make a network call, it connects.
                Your onboarding engineer will configure the payload mapping in the first session.
              </p>
              <Link href="/technical-onboarding" style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                fontSize: 12, fontWeight: 700, color: TEAL, textDecoration: "none",
              }}>
                View full setup guide <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div style={{
          marginTop: 40, padding: "36px 32px",
          background: NAVY, borderRadius: "0.15rem",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8, ...BC }}>
                Ready to Connect
              </p>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: "0 0 10px", ...CG }}>
                Your stack. Your tools. Readiness OS on top.
              </h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", maxWidth: 440, lineHeight: 1.7, margin: 0 }}>
                Your onboarding engineer connects your first three integration points in the first session.
                Most Founding Partners are fully integrated within 8 business days.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Link href="/technical-onboarding" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: GOLD, color: NAVY, fontWeight: 700, fontSize: 13,
                padding: "12px 22px", borderRadius: "0.15rem", textDecoration: "none",
                letterSpacing: "0.04em", ...BC,
              }}>
                <CheckCircle2 size={15} />
                View Integration Setup Plan
                <ArrowRight size={14} />
              </Link>
              <Link href="/founding-partner-program" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "transparent", color: "rgba(255,255,255,0.8)", fontWeight: 600, fontSize: 13,
                padding: "12px 22px", borderRadius: "0.15rem", textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.2)",
                letterSpacing: "0.04em", ...BC,
              }}>
                Apply for Founding Partner Access
              </Link>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 20, padding: "16px 20px", background: IVORY, border: `1px solid ${BORDER}`, borderRadius: "0.15rem", display: "flex", gap: 24, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Mail size={13} color={TEAL} />
            <span style={{ fontSize: 12, color: NAVY, fontWeight: 600 }}>Integration support:</span>
            <a href="mailto:integrations@vaughnmartin.com" style={{ fontSize: 12, color: TEAL, textDecoration: "none" }}>integrations@vaughnmartin.com</a>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Lock size={13} color={MUTED} />
            <span style={{ fontSize: 12, color: MUTED }}>All webhook traffic is HMAC-signed and TLS 1.3 encrypted end-to-end</span>
          </div>
        </div>

      </div>
    </PageLayout>
  );
}
