import { useState, useEffect, CSSProperties } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { updatePageMetadata } from '@/lib/seo';
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, Clock, AlertTriangle } from 'lucide-react';

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const BORDER = "#E8E4DC";
const MUTED = "#6B7280";
const OFF = "#F8F7F4";
const CG: CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
const BC: CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };

const SECTORS = [
  {
    id: "financial",
    label: "Financial Services",
    icon: "🏦",
    domains: ["Market Dynamics", "Regulatory & Compliance"],
    triggers: [
      { pattern: "Activist Investor Filing", protocol: "#31", severity: "CRITICAL", window: "48–72 hours to respond before proxy window closes" },
      { pattern: "SEC Enforcement Inquiry", protocol: "#44", severity: "HIGH", window: "5 business days before mandatory disclosure" },
      { pattern: "M&A Counter-Bid Detection", protocol: "#58", severity: "CRITICAL", window: "72 hours — LOI windows are non-negotiable" },
      { pattern: "Regulatory Examination Notice", protocol: "#67", severity: "HIGH", window: "10–15 days before examiner arrival" },
      { pattern: "Earnings Miss Exposure", protocol: "#22", severity: "MEDIUM", window: "Pre-market window before trading opens" },
    ],
    stat: "$847B",
    statLabel: "annual mobilization cost across financial sector alone",
    example: "A major activist filing arrives Friday at 4:45 PM. Without a pre-staged protocol, your team spends the weekend figuring out who's on the response team. With Protocol #31: stakeholders notified, legal brief pre-drafted, board materials staged — in 12 minutes.",
  },
  {
    id: "healthcare",
    label: "Healthcare & Life Sciences",
    icon: "⚕️",
    domains: ["Regulatory & Compliance", "Operational Disruption"],
    triggers: [
      { pattern: "FDA Warning Letter Detection", protocol: "#89", severity: "CRITICAL", window: "15 business days before mandatory response" },
      { pattern: "Product Recall Trigger", protocol: "#94", severity: "CRITICAL", window: "24 hours — CPSC clock starts at detection" },
      { pattern: "CMS Audit Notification", protocol: "#102", severity: "HIGH", window: "30 days to prepare audit documentation" },
      { pattern: "Clinical Trial Safety Signal", protocol: "#110", severity: "CRITICAL", window: "72 hours — IRB notification required" },
      { pattern: "Formulary Exclusion Alert", protocol: "#118", severity: "HIGH", window: "60-day window before coverage lapses" },
    ],
    stat: "$29B",
    statLabel: "annual cost of delayed regulatory response in US healthcare",
    example: "An FDA signal surfaces at 6 AM on a Monday. Without Protocol #94: legal, regulatory affairs, PR, and supply chain spend 3 days aligning before one action is taken. With Readiness OS: the response team is assembled, the recall framework is staged, the board is briefed — in 12 minutes.",
  },
  {
    id: "energy",
    label: "Energy & Utilities",
    icon: "⚡",
    domains: ["Operational Disruption", "Regulatory & Compliance"],
    triggers: [
      { pattern: "Grid Disruption Event", protocol: "#134", severity: "CRITICAL", window: "Real-time — every minute of delay is a compliance exposure" },
      { pattern: "FERC Filing Deadline", protocol: "#141", severity: "HIGH", window: "5-day window — no extensions granted" },
      { pattern: "Environmental Incident Signal", protocol: "#148", severity: "CRITICAL", window: "24 hours — EPA notification required" },
      { pattern: "Pipeline Integrity Alert", protocol: "#155", severity: "CRITICAL", window: "2 hours before PHMSA reporting threshold" },
      { pattern: "Rate Case Opposition Filing", protocol: "#162", severity: "MEDIUM", window: "30 days to file rebuttal testimony" },
    ],
    stat: "$180B",
    statLabel: "annual cost of unplanned outages and regulatory penalties in US energy sector",
    example: "A grid disruption triggers NERC CIP reporting requirements at 2:14 AM. Without Protocol #134: the on-call engineer can't reach the compliance team. With Readiness OS: the incident chain fires automatically — operations, legal, regulatory, and comms are all staged within 12 minutes.",
  },
  {
    id: "manufacturing",
    label: "Manufacturing & Supply Chain",
    icon: "🏭",
    domains: ["Supply Chain", "Operational Disruption"],
    triggers: [
      { pattern: "Tier-1 Supplier Force Majeure", protocol: "#171", severity: "CRITICAL", window: "48 hours before production line impact" },
      { pattern: "Product Recall Notification", protocol: "#178", severity: "CRITICAL", window: "24 hours — CPSC reporting mandatory" },
      { pattern: "Labor Action Signal", protocol: "#54", severity: "HIGH", window: "72 hours before production disruption" },
      { pattern: "Tariff Change Detection", protocol: "#61", severity: "HIGH", window: "30–60 days before effective date" },
      { pattern: "Port Congestion Alert", protocol: "#68", severity: "MEDIUM", window: "5–7 days before inventory shortfall" },
    ],
    stat: "$4.4T",
    statLabel: "annual global supply chain disruption costs (McKinsey Global Institute)",
    example: "A Tier-1 supplier in Southeast Asia declares force majeure at 11 PM EST. Without Protocol #171: procurement, operations, logistics, and finance spend 2 weeks aligning on alternatives. With Readiness OS: alternative sourcing maps, customer notification templates, and CFO briefing are pre-staged — mobilized in 12 minutes.",
  },
  {
    id: "technology",
    label: "Technology & SaaS",
    icon: "💻",
    domains: ["Market Dynamics", "Cybersecurity"],
    triggers: [
      { pattern: "Data Breach Detection", protocol: "#12", severity: "CRITICAL", window: "72 hours — GDPR/CCPA mandatory notification" },
      { pattern: "Major Outage Signal", protocol: "#19", severity: "CRITICAL", window: "Real-time — SLA breach clock starts at detection" },
      { pattern: "Competitor Product Launch", protocol: "#31", severity: "HIGH", window: "7–14 days before market positioning hardens" },
      { pattern: "Ransomware Pattern Detected", protocol: "#7", severity: "CRITICAL", window: "Minutes — containment window is perishable" },
      { pattern: "Hostile M&A Approach Signal", protocol: "#58", severity: "HIGH", window: "72 hours before board communication required" },
    ],
    stat: "$4.45M",
    statLabel: "average cost of a data breach — IBM Security 2023 (US average)",
    example: "Ransomware indicators appear in log monitoring at 3:17 AM. Without Protocol #7: the on-call engineer escalates to the CISO at 6 AM, legal isn't looped in until Day 2, and the board learns from a reporter. With Readiness OS: the IR playbook fires in 12 minutes — containment, legal notification, PR standby, and board brief all staged.",
  },
  {
    id: "retail",
    label: "Consumer & Retail",
    icon: "🛒",
    domains: ["Market Dynamics", "Operational Disruption"],
    triggers: [
      { pattern: "Product Safety Recall Signal", protocol: "#94", severity: "CRITICAL", window: "24 hours — CPSC clock starts at detection" },
      { pattern: "Social Media Crisis Escalation", protocol: "#38", severity: "HIGH", window: "2–4 hours before viral threshold" },
      { pattern: "Competitor Pricing Move", protocol: "#45", severity: "MEDIUM", window: "48 hours before market share impact" },
      { pattern: "Supply Disruption — Peak Season", protocol: "#52", severity: "HIGH", window: "14–21 days before stockout" },
      { pattern: "Executive Misconduct Signal", protocol: "#15", severity: "CRITICAL", window: "12 hours before media inquiry" },
    ],
    stat: "$5.9B",
    statLabel: "annual cost of product recalls in US consumer goods sector",
    example: "A social media signal reaches 50,000 shares at 8 AM before your brand team is in the office. Without Protocol #38: PR briefs marketing briefs legal briefs the CEO — 6 hours later you issue a statement. With Readiness OS: response brief is staged, approvals pre-defined, statement framework ready — in 12 minutes.",
  },
];

interface LiveContext {
  success: boolean;
  totalToday: number;
  domainsActive: string[];
  recentDetections: Array<{
    id: number;
    triggerName: string;
    triggerDomain: string;
    signalDescription: string;
    signalSource: string;
    confidenceScore: number;
    recommendedPlaybook: string;
    detectedAt: string;
  }>;
  latestSignal: { triggerName: string; triggerDomain: string; signalDescription: string; detectedAt: string; confidenceScore: number; } | null;
  lastUpdated: string;
}

function SeverityBadge({ level }: { level: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    CRITICAL: { bg: "#FEE2E2", text: "#991B1B" },
    HIGH: { bg: "#FEF3C7", text: "#92400E" },
    MEDIUM: { bg: "#D1FAE5", text: "#065F46" },
  };
  const c = colors[level] || colors.MEDIUM;
  return (
    <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.15em", padding: "3px 8px", background: c.bg, color: c.text, ...BC }}>
      {level}
    </span>
  );
}

export default function SectorBriefing() {
  const [, setLocation] = useLocation();
  const [selected, setSelected] = useState(SECTORS[0]);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    updatePageMetadata({
      title: "Sector Threat Briefing — Readiness OS | Live Signal Intelligence",
      description: "See what Readiness OS is detecting in your sector right now. Live signal intelligence mapped to pre-staged Readiness Protocols — before the trigger fires.",
      ogTitle: "Live Sector Threat Briefing — Readiness OS",
      ogDescription: "Select your sector. See what's active. Know your response is already staged.",
    });
  }, []);

  const { data: live } = useQuery<LiveContext>({
    queryKey: ['/api/public/live-context'],
    refetchInterval: 60000,
  });

  const relevantSignals = (live?.recentDetections || []).filter(d =>
    selected.domains.some(domain =>
      d.triggerDomain?.toLowerCase().includes(domain.toLowerCase().split(' ')[0]) ||
      domain.toLowerCase().includes((d.triggerDomain || '').toLowerCase().split(' ')[0])
    )
  );

  return (
    <PageLayout>
      {/* Hero */}
      <section style={{ background: NAVY, padding: "72px 48px 60px", textAlign: "center" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 18 }}>
            <div style={{ width: 28, height: 2, background: TEAL }} />
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.35em", textTransform: "uppercase" as const, color: TEAL, ...BC }}>Live Sector Intelligence</span>
            <div style={{ width: 28, height: 2, background: TEAL }} />
          </div>
          <h1 style={{ ...CG, fontWeight: 600, fontSize: "clamp(34px,5vw,54px)", color: "#fff", lineHeight: 1.08, marginBottom: 18 }}>
            Your sector. Right now.<br />
            <em style={{ color: GOLD }}>What Readiness OS is detecting.</em>
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", maxWidth: 600, margin: "0 auto 12px", lineHeight: 1.7 }}>
            Select your sector below. See which trigger patterns are active today — and which Readiness Protocols are already staged for your response.
          </p>
          {live?.totalToday != null && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(43,138,110,0.15)", border: "1px solid rgba(43,138,110,0.3)", padding: "8px 16px", marginTop: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: TEAL, display: "inline-block", animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: 12, color: TEAL, fontWeight: 700, ...BC, letterSpacing: "0.08em" }}>
                {live.totalToday} signals detected across {live.domainsActive?.length || 0} domains today — monitoring active
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Sector Selector */}
      <section style={{ background: "#fff", borderBottom: `1px solid ${BORDER}`, padding: "0" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(6, 1fr)" }}>
          {SECTORS.map((s) => (
            <button
              key={s.id}
              onClick={() => { setSelected(s); setRevealed(false); }}
              style={{
                padding: "20px 12px",
                border: "none",
                borderBottom: selected.id === s.id ? `3px solid ${GOLD}` : "3px solid transparent",
                background: selected.id === s.id ? OFF : "#fff",
                cursor: "pointer",
                textAlign: "center" as const,
                transition: "all 0.15s",
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: selected.id === s.id ? NAVY : MUTED, letterSpacing: "0.05em", lineHeight: 1.3, ...BC }}>{s.label}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <section style={{ background: OFF, padding: "56px 48px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 380px", gap: 32, alignItems: "start" }}>

          {/* Left: Active Trigger Patterns */}
          <div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.25em", textTransform: "uppercase" as const, color: GOLD, ...BC, marginBottom: 8 }}>
                {selected.icon} {selected.label} — Active Trigger Patterns
              </div>
              <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(22px,2.5vw,32px)", color: NAVY, marginBottom: 6 }}>
                Readiness Protocols staged for your sector
              </h2>
              <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.6 }}>
                These trigger patterns are actively monitored across your domain. Each has a pre-staged Readiness Protocol — response ready before the signal fires.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column" as const, gap: 12, marginBottom: 28 }}>
              {selected.triggers.map((t, i) => (
                <div key={i} style={{ background: "#fff", border: `1px solid ${BORDER}`, padding: "18px 20px", display: "grid", gridTemplateColumns: "1fr auto", gap: 12, alignItems: "start" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <SeverityBadge level={t.severity} />
                      <span style={{ fontSize: 10, fontWeight: 700, color: TEAL, ...BC, letterSpacing: "0.1em" }}>Protocol {t.protocol}</span>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 4 }}>{t.pattern}</div>
                    <div style={{ fontSize: 11, color: MUTED, display: "flex", alignItems: "center", gap: 6 }}>
                      <Clock style={{ width: 10, height: 10 }} />
                      {t.window}
                    </div>
                  </div>
                  <div style={{ background: TEAL, color: "#fff", fontSize: 9, fontWeight: 800, letterSpacing: "0.12em", padding: "4px 8px", textAlign: "center" as const, ...BC, whiteSpace: "nowrap" as const }}>
                    PRE-STAGED
                  </div>
                </div>
              ))}
            </div>

            {/* Live signals if any match */}
            {relevantSignals.length > 0 && (
              <div style={{ background: NAVY, padding: "20px 24px", marginBottom: 28 }}>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", color: TEAL, ...BC, marginBottom: 12 }}>
                  LIVE DETECTIONS TODAY — {selected.label.toUpperCase()}
                </div>
                {relevantSignals.slice(0, 2).map((d, i) => (
                  <div key={i} style={{ borderBottom: i < relevantSignals.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none", paddingBottom: i < relevantSignals.length - 1 ? 12 : 0, marginBottom: i < relevantSignals.length - 1 ? 12 : 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: GOLD, marginBottom: 3 }}>{d.triggerName}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>{d.signalDescription}</div>
                    <div style={{ fontSize: 10, color: TEAL, marginTop: 4, ...BC }}>Signal confidence: {Math.round((d.confidenceScore || 0) * 100)}% · Source: {d.signalSource}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Scenario example */}
            <div style={{ background: "#fff", border: `2px solid ${GOLD}`, padding: "24px 24px" }}>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", color: GOLD, ...BC, marginBottom: 10 }}>SCENARIO: HOW THIS PLAYS OUT</div>
              <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.7, margin: 0 }}>{selected.example}</p>
            </div>
          </div>

          {/* Right: Stats + CTA panel */}
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 16 }}>

            {/* Sector stat */}
            <div style={{ background: NAVY, padding: "28px 24px", textAlign: "center" as const }}>
              <div style={{ ...CG, fontSize: 42, fontWeight: 700, color: GOLD, lineHeight: 1, marginBottom: 6 }}>{selected.stat}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>{selected.statLabel}</div>
            </div>

            {/* Before / After */}
            <div style={{ background: "#fff", border: `1px solid ${BORDER}`, padding: "20px" }}>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", color: NAVY, ...BC, marginBottom: 16 }}>MOBILIZATION COMPARISON</div>
              {[
                { label: "Without Readiness OS", time: "30 days", color: "#EF4444", note: "Committees. Alignment meetings. Delayed execution." },
                { label: "With Readiness OS", time: "12 min", color: TEAL, note: "Stakeholders staged. Executive authorizes. Done." },
              ].map((row, i) => (
                <div key={i} style={{ marginBottom: i === 0 ? 14 : 0, paddingBottom: i === 0 ? 14 : 0, borderBottom: i === 0 ? `1px solid ${BORDER}` : "none" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: MUTED, letterSpacing: "0.1em", ...BC, marginBottom: 4 }}>{row.label}</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: row.color, fontFamily: "monospace", marginBottom: 4 }}>{row.time}</div>
                  <div style={{ fontSize: 11, color: MUTED, lineHeight: 1.4 }}>{row.note}</div>
                </div>
              ))}
              <div style={{ marginTop: 14, padding: "10px 12px", background: OFF, borderLeft: `3px solid ${GOLD}` }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>3,600×</div>
                <div style={{ fontSize: 10, color: MUTED }}>execution head start vs. the current model</div>
              </div>
            </div>

            {/* Protocol count */}
            <div style={{ background: OFF, border: `1px solid ${BORDER}`, padding: "16px 20px" }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: TEAL, letterSpacing: "0.15em", ...BC, marginBottom: 8 }}>YOUR SECTOR COVERAGE</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: NAVY }}>{selected.triggers.length} patterns</div>
                  <div style={{ fontSize: 11, color: MUTED }}>actively monitored in {selected.label}</div>
                </div>
                <div style={{ textAlign: "right" as const }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: NAVY }}>180</div>
                  <div style={{ fontSize: 11, color: MUTED }}>total protocols staged</div>
                </div>
              </div>
            </div>

            {/* The ask */}
            {!revealed ? (
              <div style={{ background: GOLD, padding: "24px 20px", textAlign: "center" as const }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 8, lineHeight: 1.4 }}>
                  Want to see your organization's full threat briefing?
                </div>
                <p style={{ fontSize: 12, color: "rgba(10,15,46,0.65)", marginBottom: 16, lineHeight: 1.5 }}>
                  A live sector scan against your actual domain, mapped to pre-staged protocols — delivered to your executive team.
                </p>
                <Button
                  onClick={() => setRevealed(true)}
                  style={{ background: NAVY, color: "#fff", fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase" as const, width: "100%", padding: "14px", ...BC }}
                >
                  Request Executive Briefing <ArrowRight style={{ marginLeft: 6, width: 13, height: 13 }} />
                </Button>
              </div>
            ) : (
              <div style={{ background: NAVY, padding: "24px 20px" }}>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", color: TEAL, ...BC, marginBottom: 12 }}>THE NEXT STEP</div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.6, marginBottom: 16 }}>
                  A Founding Partner engagement includes a full sector scan delivered to your executive team within 5 business days — mapped to your actual strategic exposure, not a generic demo.
                </p>
                <Button
                  onClick={() => setLocation("/request-access")}
                  style={{ background: GOLD, color: NAVY, fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase" as const, width: "100%", padding: "14px", ...BC }}
                >
                  Apply for Founding Partner Access <ArrowRight style={{ marginLeft: 6, width: 13, height: 13 }} />
                </Button>
                <div style={{ marginTop: 12, textAlign: "center" as const }}>
                  <button
                    onClick={() => setLocation("/12-minute-experience")}
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: TEAL, fontWeight: 700, letterSpacing: "0.08em", ...BC, textDecoration: "underline" }}
                  >
                    Or experience 12 minutes first →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Bottom CTA strip */}
      <section style={{ background: NAVY, padding: "48px 48px", textAlign: "center" as const }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 12 }}>
            <Shield style={{ width: 16, height: 16, color: TEAL }} />
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: TEAL, ...BC }}>AI monitors · Executives authorize</span>
          </div>
          <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(22px,3vw,34px)", color: "#fff", marginBottom: 12, lineHeight: 1.2 }}>
            The response is already staged.<br />
            <em style={{ color: GOLD }}>The only question is whether your team is.</em>
          </h2>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" as const, marginTop: 24 }}>
            <Button
              onClick={() => setLocation("/request-access")}
              style={{ background: GOLD, color: NAVY, fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase" as const, padding: "14px 28px", ...BC }}
            >
              Apply for Founding Partner Access <ArrowRight style={{ marginLeft: 6, width: 13, height: 13 }} />
            </Button>
            <Button
              onClick={() => setLocation("/cost-of-delay")}
              variant="outline"
              style={{ border: "1.5px solid rgba(255,255,255,0.25)", color: "#fff", background: "transparent", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, padding: "14px 28px", ...BC }}
            >
              Calculate Your Delay Cost
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
