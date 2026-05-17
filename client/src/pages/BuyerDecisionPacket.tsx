import { useEffect } from "react";
import { Link } from "wouter";
import PageLayout from "@/components/layout/PageLayout";
import { updatePageMetadata } from "@/lib/seo";
import {
  CheckCircle2, ArrowRight, Shield, Clock, Users, Zap,
  BarChart3, Settings, Activity, FileCheck, Lock, Database
} from "lucide-react";

const NAVY   = "#0A0F2E";
const GOLD   = "#C9A84C";
const TEAL   = "#2B8A6E";
const IVORY  = "#F0EDE4";
const BORDER = "#E2DDD5";
const MUTED  = "#6B7280";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
const BC: React.CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };

const PHASES = [
  {
    range: "DAY 0–14",
    title: "Executive Alignment",
    items: [
      "Executive sponsor alignment",
      "Scenario prioritization — risk + opportunity",
      "Decision-rights and authority mapping",
    ],
    color: GOLD,
  },
  {
    range: "DAY 15–45",
    title: "Protocol Configuration",
    items: [
      "Protocol configuration in guided builder",
      "Trigger and data coverage setup",
      "Governance and version controls enabled",
    ],
    color: TEAL,
  },
  {
    range: "DAY 46–75",
    title: "Simulation & Readiness",
    items: [
      "Simulations and readiness scoring",
      "Role-based rehearsals",
      "Gap closure and protocol tuning",
    ],
    color: "#2563EB",
  },
  {
    range: "DAY 76–90",
    title: "Live Activation Readiness",
    items: [
      "Live activation readiness verified",
      "Executive close-out review",
      "Expansion roadmap defined",
    ],
    color: NAVY,
  },
];

const METRICS = [
  {
    icon: <Clock size={20} color={GOLD} />,
    label: "Decision Velocity",
    definition: "Signal → executive decision time",
  },
  {
    icon: <Zap size={20} color={TEAL} />,
    label: "Mobilization Speed",
    definition: "Trigger → coordinated execution time",
  },
  {
    icon: <BarChart3 size={20} color={NAVY} />,
    label: "Execution Confidence",
    definition: "Readiness score + simulation pass rate",
  },
];

const GOVERNANCE = [
  "Configurable approval policy — single, dual, or board-level",
  "Versioning with change summary and reviewer accountability",
  "Rollback plan required for all controlled protocol updates",
  "Validation scenarios logged before production activation",
  "No protocol activates without defined executive authority",
];

const EXTERNAL_SIGNALS = [
  "Regulatory & compliance",
  "Threat & cyber intelligence",
  "Market & competitor signals",
  "Sentiment & public signals",
  "Supply-chain disruption",
];

const INTERNAL_SIGNALS = [
  "ERP & procurement systems",
  "CRM & customer data",
  "ITSM & incident management",
  "SIEM & security events",
  "HRIS, legal & BI platforms",
];

const DECISION_ITEMS = [
  { icon: <Users size={16} color={GOLD} />, label: "Executive Sponsor", detail: "Named executive accountable for the engagement" },
  { icon: <Users size={16} color={GOLD} />, label: "Cross-Functional Working Team", detail: "Core team assigned before Day 1" },
  { icon: <Settings size={16} color={GOLD} />, label: "Three Priority Scenarios", detail: "One risk, one opportunity, one compound — agreed at kickoff" },
];

export default function BuyerDecisionPacket() {
  useEffect(() => {
    updatePageMetadata({
      title: "Buyer Decision Packet — VaughnMartin Readiness OS",
      description: "From 30 days to 12 minutes — with executive control intact. The complete buyer decision packet for enterprise leaders evaluating Readiness OS: 90-day plan, success criteria, governance controls, and commercial structure.",
      ogTitle: "Buyer Decision Packet — VaughnMartin Readiness OS",
      ogDescription: "Everything procurement, legal, and the CFO need. 90-day outcomes. Governance model. Success criteria defined before kickoff. Low-risk Founding Partner start.",
    });
  }, []);

  return (
    <PageLayout>
      <div style={{ background: "#F8F7F4", minHeight: "100vh" }}>

        {/* Hero */}
        <section style={{ background: NAVY, color: "#fff", padding: "5rem 1.5rem 4rem" }}>
          <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
            <div style={{ ...BC, fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.18em", color: GOLD, marginBottom: "1.25rem", textTransform: "uppercase" }}>
              ENTERPRISE BUYER DECISION PACKET
            </div>
            <h1 style={{ ...CG, fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: 700, lineHeight: 1.15, marginBottom: "1.25rem" }}>
              From 30 Days to 12 Minutes —<br />
              <span style={{ color: GOLD }}>With Executive Control Intact.</span>
            </h1>
            <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.75)", maxWidth: 640, margin: "0 auto 2rem", lineHeight: 1.7 }}>
              Readiness OS gives your leadership team a governed way to move from trigger detection to coordinated execution in minutes, not weeks. This packet covers everything procurement, legal, and the board need to make the decision.
            </p>
            <div style={{ display: "flex", gap: "0.875rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: GOLD, color: NAVY, padding: "0.75rem 1.75rem", borderRadius: "0.15rem", fontWeight: 700, fontSize: "0.875rem", textDecoration: "none", ...BC, letterSpacing: "0.05em" }}>
                Apply for Founding Partner Access <ArrowRight size={15} />
              </Link>
              <Link href="/12-minute-experience" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "transparent", color: "#fff", padding: "0.75rem 1.75rem", borderRadius: "0.15rem", fontWeight: 600, fontSize: "0.875rem", textDecoration: "none", border: "1px solid rgba(255,255,255,0.25)", ...BC, letterSpacing: "0.05em" }}>
                Book Executive Scenario Session
              </Link>
            </div>
          </div>
        </section>

        {/* Section divider label */}
        <div style={{ background: GOLD, padding: "0.5rem 1.5rem", textAlign: "center" }}>
          <span style={{ ...BC, fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.2em", color: NAVY, textTransform: "uppercase" }}>
            Nine sections · Everything required to make the decision
          </span>
        </div>

        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 1.5rem" }}>

          {/* 1 — Why Act Now */}
          <section style={{ padding: "4rem 0 3rem" }}>
            <SectionLabel number="01" label="Why Act Now" />
            <h2 style={{ ...CG, fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 700, color: NAVY, marginBottom: "1.25rem", lineHeight: 1.2 }}>
              Most organizations don't fail because they lack intelligence.
            </h2>
            <p style={{ fontSize: "1rem", color: "#374151", lineHeight: 1.8, marginBottom: "1rem", maxWidth: 720 }}>
              They fail because coordination starts too late. When a trigger fires — a competitor move, a regulatory demand, a cyber incident, a leadership crisis — teams still spend weeks deciding who owns the response, who has authority, what gets funded, and what happens first.
            </p>
            <p style={{ fontSize: "1rem", color: "#374151", lineHeight: 1.8, maxWidth: 720 }}>
              Readiness OS pre-stages this architecture before the trigger fires. The response is ready. The authority is mapped. The execution begins in 12 minutes.
            </p>
            <div style={{ marginTop: "2rem", padding: "1.25rem 1.5rem", background: "#fff", border: `1px solid ${BORDER}`, borderLeft: `4px solid ${GOLD}`, borderRadius: "0.15rem" }}>
              <p style={{ ...CG, fontSize: "1.2rem", color: NAVY, margin: 0, fontStyle: "italic" }}>
                "The response is ready before the trigger fires."
              </p>
            </div>
          </section>

          <Divider />

          {/* 2 — What it is */}
          <section style={{ padding: "3rem 0" }}>
            <SectionLabel number="02" label="What Readiness OS Is (and Is Not)" />
            <h2 style={{ ...CG, fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 700, color: NAVY, marginBottom: "1.5rem", lineHeight: 1.2 }}>
              Enterprise coordination infrastructure — not another AI assistant.
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ padding: "1.5rem", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: "0.15rem" }}>
                <div style={{ ...BC, fontSize: "0.65rem", fontWeight: 700, color: TEAL, letterSpacing: "0.15em", marginBottom: "1rem", textTransform: "uppercase" }}>What It Is</div>
                {["Pre-staged execution infrastructure", "170 cross-industry Readiness Protocols", "Executive authorization at every stage", "Auditable governance with rollback", "12-minute mobilization from trigger detection"].map(item => (
                  <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", marginBottom: "0.6rem" }}>
                    <CheckCircle2 size={14} color={TEAL} style={{ marginTop: 3, flexShrink: 0 }} />
                    <span style={{ fontSize: "0.875rem", color: "#374151" }}>{item}</span>
                  </div>
                ))}
              </div>
              <div style={{ padding: "1.5rem", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: "0.15rem" }}>
                <div style={{ ...BC, fontSize: "0.65rem", fontWeight: 700, color: MUTED, letterSpacing: "0.15em", marginBottom: "1rem", textTransform: "uppercase" }}>What It Is Not</div>
                {["An AI chatbot or note-taking tool", "A project management add-on", "Another dashboard or reporting layer", "A replacement for executive judgment", "Copilot, workflow automation, or BI"].map(item => (
                  <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", marginBottom: "0.6rem" }}>
                    <span style={{ color: "#9CA3AF", fontSize: "0.875rem", flexShrink: 0 }}>✕</span>
                    <span style={{ fontSize: "0.875rem", color: MUTED }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem" }}>
              {[
                { step: "01", label: "AI Monitors", sub: "Signals detected continuously" },
                { step: "02", label: "System Stages", sub: "Response pre-built to protocol" },
                { step: "03", label: "Executives Authorize", sub: "Authority preserved at every step" },
                { step: "04", label: "Teams Execute", sub: "12-minute coordinated start" },
              ].map(({ step, label, sub }) => (
                <div key={step} style={{ textAlign: "center", padding: "1rem 0.75rem", background: NAVY, borderRadius: "0.15rem" }}>
                  <div style={{ ...BC, fontSize: "0.6rem", color: GOLD, letterSpacing: "0.1em", marginBottom: "0.35rem" }}>{step}</div>
                  <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#fff", marginBottom: "0.3rem" }}>{label}</div>
                  <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.55)" }}>{sub}</div>
                </div>
              ))}
            </div>
          </section>

          <Divider />

          {/* 3 — 90 Days */}
          <section style={{ padding: "3rem 0" }}>
            <SectionLabel number="03" label="What You Get in 90 Days" />
            <h2 style={{ ...CG, fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 700, color: NAVY, marginBottom: "2rem", lineHeight: 1.2 }}>
              Every phase defined. Every deliverable specified. No surprises.
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
              {PHASES.map(phase => (
                <div key={phase.range} style={{ padding: "1.5rem", background: "#fff", border: `1px solid ${BORDER}`, borderTop: `3px solid ${phase.color}`, borderRadius: "0.15rem" }}>
                  <div style={{ ...BC, fontSize: "0.62rem", fontWeight: 700, color: phase.color, letterSpacing: "0.15em", marginBottom: "0.4rem", textTransform: "uppercase" }}>{phase.range}</div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 700, color: NAVY, marginBottom: "1rem" }}>{phase.title}</div>
                  {phase.items.map(item => (
                    <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", marginBottom: "0.5rem" }}>
                      <CheckCircle2 size={13} color={phase.color} style={{ marginTop: 3, flexShrink: 0 }} />
                      <span style={{ fontSize: "0.825rem", color: "#374151", lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>

          <Divider />

          {/* 4 — Success Criteria */}
          <section style={{ padding: "3rem 0" }}>
            <SectionLabel number="04" label="Success Criteria — Agreed Before Kickoff" />
            <h2 style={{ ...CG, fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 700, color: NAVY, marginBottom: "0.75rem", lineHeight: 1.2 }}>
              Three measurable outcomes defined at Day 0.
            </h2>
            <p style={{ fontSize: "0.95rem", color: MUTED, lineHeight: 1.7, marginBottom: "2rem", maxWidth: 680 }}>
              Success is not subjective. We agree on baseline measurements before engagement begins and validate progress at Day 30, 60, and 90.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
              {METRICS.map(m => (
                <div key={m.label} style={{ padding: "1.75rem 1.25rem", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: "0.15rem", textAlign: "center" }}>
                  <div style={{ marginBottom: "0.75rem" }}>{m.icon}</div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 700, color: NAVY, marginBottom: "0.4rem" }}>{m.label}</div>
                  <div style={{ fontSize: "0.8rem", color: MUTED, lineHeight: 1.5 }}>{m.definition}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "1.25rem", padding: "1rem 1.25rem", background: IVORY, border: `1px solid ${BORDER}`, borderRadius: "0.15rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <Activity size={16} color={TEAL} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: "0.85rem", color: "#374151" }}>
                Checkpoint reviews at Day 30 / 60 / 90 with documented outcomes against agreed baseline.
              </span>
            </div>
          </section>

          <Divider />

          {/* 5 — Governance */}
          <section style={{ padding: "3rem 0" }}>
            <SectionLabel number="05" label="Governance & Control" />
            <h2 style={{ ...CG, fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 700, color: NAVY, marginBottom: "0.75rem", lineHeight: 1.2 }}>
              Authority stays human. Every step.
            </h2>
            <p style={{ fontSize: "0.95rem", color: MUTED, lineHeight: 1.7, marginBottom: "1.75rem", maxWidth: 680 }}>
              No protocol activates without defined executive authorization. The governance model is configurable, auditable, and designed for board-level accountability.
            </p>
            <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: "0.15rem", overflow: "hidden" }}>
              {GOVERNANCE.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.25rem", borderBottom: i < GOVERNANCE.length - 1 ? `1px solid ${BORDER}` : "none" }}>
                  <Lock size={14} color={TEAL} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: "0.875rem", color: "#374151" }}>{item}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "1rem", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
              {["Single-Authority Approval", "Dual-Executive Approval", "Board-Level Approval"].map(mode => (
                <div key={mode} style={{ padding: "0.875rem 1rem", background: NAVY, borderRadius: "0.15rem", textAlign: "center" }}>
                  <Shield size={14} color={GOLD} style={{ marginBottom: "0.4rem" }} />
                  <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#fff" }}>{mode}</div>
                  <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.5)", marginTop: "0.2rem" }}>Configurable per protocol</div>
                </div>
              ))}
            </div>
          </section>

          <Divider />

          {/* 6 — Data & Integration */}
          <section style={{ padding: "3rem 0" }}>
            <SectionLabel number="06" label="Data & Integration Coverage" />
            <h2 style={{ ...CG, fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 700, color: NAVY, marginBottom: "0.75rem", lineHeight: 1.2 }}>
              Signals from outside and inside your enterprise.
            </h2>
            <p style={{ fontSize: "0.95rem", color: MUTED, lineHeight: 1.7, marginBottom: "1.75rem", maxWidth: 680 }}>
              Readiness OS monitors both external and internal data sources. Monitoring cadence is configurable by protocol criticality — critical situations can run continuous; standard cadence is every 15 minutes.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: "0.15rem", padding: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                  <Activity size={15} color={TEAL} />
                  <span style={{ ...BC, fontSize: "0.65rem", fontWeight: 700, color: TEAL, letterSpacing: "0.15em", textTransform: "uppercase" }}>External Signals</span>
                </div>
                {EXTERNAL_SIGNALS.map(s => (
                  <div key={s} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", alignItems: "center" }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: TEAL, flexShrink: 0 }} />
                    <span style={{ fontSize: "0.85rem", color: "#374151" }}>{s}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: "0.15rem", padding: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                  <Database size={15} color={GOLD} />
                  <span style={{ ...BC, fontSize: "0.65rem", fontWeight: 700, color: GOLD, letterSpacing: "0.15em", textTransform: "uppercase" }}>Internal Systems</span>
                </div>
                {INTERNAL_SIGNALS.map(s => (
                  <div key={s} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", alignItems: "center" }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: GOLD, flexShrink: 0 }} />
                    <span style={{ fontSize: "0.85rem", color: "#374151" }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ marginTop: "1rem", padding: "0.875rem 1.25rem", background: IVORY, border: `1px solid ${BORDER}`, borderRadius: "0.15rem", display: "flex", gap: "0.75rem", alignItems: "center" }}>
              <Settings size={15} color={NAVY} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: "0.85rem", color: "#374151" }}>
                Monitoring cadence configurable by scenario criticality. Microsoft Azure, Teams, Copilot Studio, Entra, and M365 natively supported.
              </span>
            </div>
          </section>

          <Divider />

          {/* 7 — Commercial Structure */}
          <section style={{ padding: "3rem 0" }}>
            <SectionLabel number="07" label="Commercial Structure" />
            <h2 style={{ ...CG, fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 700, color: NAVY, marginBottom: "0.75rem", lineHeight: 1.2 }}>
              A low-risk start with a clear path to full engagement.
            </h2>
            <p style={{ fontSize: "0.95rem", color: MUTED, lineHeight: 1.7, marginBottom: "1.75rem", maxWidth: 680 }}>
              The Founding Partner Program is a 90-day validation engagement — not an open-ended commitment. If agreed success criteria are met at Day 90, conversion to an annual contract is a straightforward decision.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.25rem" }}>
              {[
                { icon: <Clock size={18} color={GOLD} />, label: "Day 60 Extension", detail: "If outcomes need more time, the engagement extends at no additional cost." },
                { icon: <FileCheck size={18} color={TEAL} />, label: "Full Fee Credit", detail: "Founding Partner fee credited in full against the first annual contract." },
                { icon: <Shield size={18} color={NAVY} />, label: "Partial Refund Option", detail: "If we don't deliver agreed criteria, a 50% partial refund is available." },
              ].map(item => (
                <div key={item.label} style={{ padding: "1.5rem 1.25rem", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: "0.15rem" }}>
                  <div style={{ marginBottom: "0.75rem" }}>{item.icon}</div>
                  <div style={{ fontSize: "0.875rem", fontWeight: 700, color: NAVY, marginBottom: "0.4rem" }}>{item.label}</div>
                  <div style={{ fontSize: "0.8rem", color: MUTED, lineHeight: 1.55 }}>{item.detail}</div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", padding: "1.5rem", background: NAVY, borderRadius: "0.15rem" }}>
              <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: GOLD, color: NAVY, padding: "0.75rem 2rem", borderRadius: "0.15rem", fontWeight: 700, fontSize: "0.875rem", textDecoration: "none", ...BC, letterSpacing: "0.05em" }}>
                Apply for Founding Partner Access <ArrowRight size={15} />
              </Link>
              <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.45)", marginTop: "0.75rem" }}>
                12 organizations maximum · Cohort 1 · Response within 48 hours
              </div>
            </div>
          </section>

          <Divider />

          {/* 8 — Decision Required */}
          <section style={{ padding: "3rem 0" }}>
            <SectionLabel number="08" label="Decision Required" />
            <h2 style={{ ...CG, fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 700, color: NAVY, marginBottom: "0.75rem", lineHeight: 1.2 }}>
              Three approvals to begin.
            </h2>
            <p style={{ fontSize: "0.95rem", color: MUTED, lineHeight: 1.7, marginBottom: "1.75rem", maxWidth: 680 }}>
              Readiness OS requires minimal organizational commitment to start. The following three items are needed before Day 1 can begin.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "2rem" }}>
              {DECISION_ITEMS.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "1rem", padding: "1.25rem", background: "#fff", border: `1px solid ${BORDER}`, borderLeft: `3px solid ${GOLD}`, borderRadius: "0.15rem" }}>
                  <div style={{ marginTop: 2 }}>{item.icon}</div>
                  <div>
                    <div style={{ fontSize: "0.875rem", fontWeight: 700, color: NAVY, marginBottom: "0.25rem" }}>{item.label}</div>
                    <div style={{ fontSize: "0.8rem", color: MUTED }}>{item.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <Divider />

          {/* 9 — What leadership expects */}
          <section style={{ padding: "3rem 0 4rem" }}>
            <SectionLabel number="09" label="What Your Leadership Team Can Expect" />
            <h2 style={{ ...CG, fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 700, color: NAVY, marginBottom: "0.75rem", lineHeight: 1.2 }}>
              By Day 90, your team can run key scenarios with confidence.
            </h2>
            <p style={{ fontSize: "0.95rem", color: MUTED, lineHeight: 1.7, marginBottom: "1.75rem", maxWidth: 680 }}>
              This is not a system you're handed. This is a capability your organization owns — built with your scenarios, your authority model, your stakeholders.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem", marginBottom: "2.5rem" }}>
              {[
                { label: "Clearer authority", detail: "Every response starts with a defined decision-rights structure, not a scramble to find the right person." },
                { label: "Faster mobilization", detail: "From trigger detection to coordinated team activation in 12 minutes, not 30 days." },
                { label: "Repeatable execution", detail: "170 Readiness Protocols — pre-staged, versioned, and validated before any trigger fires." },
                { label: "Auditable governance", detail: "Every activation logged, every decision tracked, board-ready reporting available at any point." },
              ].map(item => (
                <div key={item.label} style={{ padding: "1.5rem", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: "0.15rem" }}>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                    <CheckCircle2 size={15} color={TEAL} style={{ marginTop: 2, flexShrink: 0 }} />
                    <span style={{ fontSize: "0.9rem", fontWeight: 700, color: NAVY }}>{item.label}</span>
                  </div>
                  <p style={{ fontSize: "0.825rem", color: MUTED, margin: 0, lineHeight: 1.6, paddingLeft: "1.5rem" }}>{item.detail}</p>
                </div>
              ))}
            </div>

            {/* Final CTA */}
            <div style={{ background: NAVY, borderRadius: "0.15rem", padding: "2.5rem", textAlign: "center" }}>
              <div style={{ ...BC, fontSize: "0.65rem", fontWeight: 700, color: GOLD, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1rem" }}>
                FOUNDING PARTNER PROGRAM · COHORT 1 · 12 ORGANIZATIONS MAXIMUM
              </div>
              <h3 style={{ ...CG, fontSize: "1.75rem", color: "#fff", fontWeight: 700, marginBottom: "0.75rem", lineHeight: 1.3 }}>
                The response is ready before the trigger fires.
              </h3>
              <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.65)", marginBottom: "1.75rem", maxWidth: 500, margin: "0 auto 1.75rem" }}>
                Apply now and your organization can begin its 90-day Founding Partner engagement this quarter.
              </p>
              <div style={{ display: "flex", gap: "0.875rem", justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: GOLD, color: NAVY, padding: "0.75rem 1.75rem", borderRadius: "0.15rem", fontWeight: 700, fontSize: "0.875rem", textDecoration: "none", ...BC, letterSpacing: "0.05em" }}>
                  Apply for Founding Partner Access <ArrowRight size={15} />
                </Link>
                <Link href="/first-90-days" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "transparent", color: "#fff", padding: "0.75rem 1.75rem", borderRadius: "0.15rem", fontWeight: 600, fontSize: "0.875rem", textDecoration: "none", border: "1px solid rgba(255,255,255,0.25)", ...BC, letterSpacing: "0.05em" }}>
                  See the Full 90-Day Timeline
                </Link>
              </div>
              <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "center", gap: "2rem", flexWrap: "wrap" }}>
                {["/cost-of-inaction", "/board-memo", "/founding-partner"].map((href, i) => {
                  const labels = ["Calculate Cost of Inaction", "Generate Board Memo", "Review Partner Terms"];
                  return (
                    <Link key={href} href={href} style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.45)", textDecoration: "underline", textUnderlineOffset: 3 }}>
                      {labels[i]}
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>

        </div>
      </div>
    </PageLayout>
  );
}

function SectionLabel({ number, label }: { number: string; label: string }) {
  const BC: React.CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
      <span style={{ ...BC, fontSize: "0.65rem", fontWeight: 700, color: "#C9A84C", letterSpacing: "0.1em" }}>{number}</span>
      <div style={{ height: 1, width: 32, background: "#C9A84C" }} />
      <span style={{ ...BC, fontSize: "0.65rem", fontWeight: 700, color: "#6B7280", letterSpacing: "0.15em", textTransform: "uppercase" }}>{label}</span>
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "#E2DDD5" }} />;
}
