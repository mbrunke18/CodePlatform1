import PageLayout from "@/components/layout/PageLayout";
import { Link } from "wouter";
import {
  Shield, Users, Layers, ChevronRight, CheckCircle2,
  Building2, Target, ArrowRight, Zap, BookOpen, BarChart3,
} from "lucide-react";

const NAVY    = "#0A0F2E";
const NAVY_BG = "#132558";
const GOLD    = "#C9A84C";
const TEAL    = "#2B8A6E";
const IVORY   = "#F0EDE4";
const MUTED   = "#6B7280";
const BORDER  = "#E8E4DC";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
const BC: React.CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };

const TIERS = [
  {
    level: "01",
    title: "C-Suite",
    role: "Authorization Authority",
    color: GOLD,
    icon: Shield,
    description:
      "The C-suite owns final authorization. No Readiness Protocol activates without executive sign-off. The platform surfaces the decision in 12 minutes — the executive makes it.",
    responsibilities: [
      "Authorize protocol activation at the trigger moment",
      "Review authorization precedent record before each decision",
      "Receive board-ready debrief after every activation",
      "Set pre-approved budget thresholds per protocol domain",
    ],
    you: false,
  },
  {
    level: "02",
    title: "Preparation Architect",
    role: "Preparation Architect",
    color: TEAL,
    icon: Layers,
    description:
      "This role goes by many titles — COO, Chief of Staff, VP Operations, PMO Director. The title varies by organization; the function does not. You design the readiness infrastructure — not run it. You configure the protocols, map the stakeholders, and build the response architecture that makes 12-minute execution possible. When a trigger fires, the system responds. You've already done the work that makes that possible. Your role is architect, not operator.",
    responsibilities: [
      "Configure all 180 protocols with accurate role assignments and task owners",
      "Run quarterly drills to verify response readiness across domains",
      "Monitor the Readiness Score dashboard and own every gap below threshold",
      "Translate organizational changes (new hires, reorgs) into protocol updates",
      "Manage the Founding Partner onboarding through all 4 setup phases",
      "Own the ADVANCE loop — review protocol updates, approve or defer improvements",
    ],
    you: true,
  },
  {
    level: "03",
    title: "Functional Leaders",
    role: "Execution Owners",
    color: "#6B7280",
    icon: Users,
    description:
      "Functional leaders execute. When a protocol activates, their tasks are pre-assigned and their briefs are pre-staged. They don't coordinate — they execute the role they've already been given.",
    responsibilities: [
      "Review and accept task assignments during protocol customization",
      "Confirm availability and delegation chains for their domain",
      "Participate in quarterly drills to verify response readiness",
      "Provide close-out feedback to improve protocols over time",
    ],
    you: false,
  },
];

const SETUP_PHASES = [
  {
    num: "Phase 1",
    title: "Organization Configuration",
    timing: "Week 1",
    icon: Building2,
    tasks: [
      "Import your organizational structure — departments, roles, reporting lines",
      "Map your C-suite executives to authorization domains",
      "Connect your communication stack (Teams, Slack, email) for stakeholder notifications",
      "Set your organizational risk profile — which triggers apply to your industry and size",
    ],
    href: "/getting-started",
    ctaLabel: "Start Configuration →",
  },
  {
    num: "Phase 2",
    title: "Protocol Ownership Assignment",
    timing: "Week 1–2",
    icon: Target,
    tasks: [
      "Review the 180 Readiness Protocol library — filter by domain, urgency, and industry",
      "For each protocol, assign a named functional leader as execution owner",
      "Verify pre-approved budget thresholds with your CFO for each domain",
      "Confirm the authorization chain for each domain — who holds final approval rights",
    ],
    href: "/playbook-library",
    ctaLabel: "Open Protocol Library →",
  },
  {
    num: "Phase 3",
    title: "First Drill — Governance Validated",
    timing: "Week 2–3",
    icon: Zap,
    tasks: [
      "Select one high-priority protocol for your first practice drill",
      "Run the drill — simulate the trigger, walk through the authorization flow",
      "Complete the post-drill debrief — classify outcome, log lessons learned",
      "Review the ADVANCE loop — accept or defer the system-generated protocol improvement",
    ],
    href: "/practice-drills",
    ctaLabel: "Schedule First Drill →",
  },
  {
    num: "Phase 4",
    title: "Live Signal Detection — Go Live",
    timing: "Week 3–4",
    icon: BarChart3,
    tasks: [
      "Activate live signal monitoring across your 231 trigger categories",
      "Review your Readiness Score — resolve any protocols below threshold",
      "Brief your C-suite executives on authorization flow and mobile access",
      "Confirm the preparation governance rhythm — monthly protocol audit, quarterly drill",
    ],
    href: "/command-tower",
    ctaLabel: "Activate Signal Detection →",
  },
];

const PMO_PROOF_POINTS = [
  {
    stat: "180",
    label: "Readiness Protocols",
    detail: "You own the configuration of all 180 — that's the preparation architecture.",
  },
  {
    stat: "231",
    label: "Trigger Categories",
    detail: "Live signal monitoring runs continuously — your job is to ensure the responses are staged before any of them fire.",
  },
  {
    stat: "12 min",
    label: "Mobilization Target",
    detail: "When a trigger fires, the C-suite should authorize in 12 minutes. Your preparation makes that possible.",
  },
  {
    stat: "90 days",
    label: "Founding Partner Window",
    detail: "Your 90-day co-build partnership — from first protocol configured to first live activation.",
  },
];

export default function PMOOnboarding() {
  return (
    <PageLayout>
      <div style={{ background: "#fff", fontFamily: "'Barlow', sans-serif" }}>

        {/* Hero */}
        <div style={{ background: NAVY, padding: "72px 48px 56px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 28, height: 1, background: GOLD }} />
              <span style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>
                Preparation Architect
              </span>
            </div>
            <h1 style={{ ...CG, fontSize: "clamp(36px,5vw,56px)", fontWeight: 700, color: "#fff", lineHeight: 1.1, marginBottom: 20 }}>
              You design the readiness.<br />
              <em style={{ color: GOLD }}>The system executes. The C-suite authorizes.</em>
            </h1>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", maxWidth: 680, lineHeight: 1.7, marginBottom: 36 }}>
              Right now, when a trigger fires, the 30-day mobilization begins — and you are at the center of it. Mapping stakeholders, assigning tasks, drafting briefs, aligning functional leads. All from scratch, under pressure, while the window closes. Readiness OS changes the sequence. You do that work once, in advance, in a calm room. When the trigger fires, the preparation is already done — the executive authorizes in real time, but that is 12 minutes of confirmation, not 30 days of coordination. Your role shifts from reactive mobilizer to preparation architect — and that is a different job entirely.
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <Link href="/preparation-diagnostic" style={{ ...BC, display: "inline-flex", alignItems: "center", gap: 8, background: GOLD, color: NAVY, fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", padding: "13px 28px", textDecoration: "none", borderRadius: "0.15rem" }}>
                Map Your Architecture <ArrowRight size={14} />
              </Link>
              <Link href="/getting-started" style={{ ...BC, display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", padding: "13px 28px", textDecoration: "none", border: "1px solid rgba(255,255,255,0.25)", borderRadius: "0.15rem" }}>
                Start Configuration <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* The 3-Tier Ownership Architecture */}
        <div style={{ background: IVORY, padding: "72px 48px", borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 28, height: 1, background: GOLD }} />
                <span style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>Ownership Architecture</span>
                <div style={{ width: 28, height: 1, background: GOLD }} />
              </div>
              <h2 style={{ ...CG, fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 700, color: NAVY, marginBottom: 14, lineHeight: 1.1 }}>
                Three tiers. One platform.<br /><em style={{ color: GOLD }}>Every role explicit from day one.</em>
              </h2>
              <p style={{ fontSize: 15, color: MUTED, maxWidth: 620, margin: "0 auto", lineHeight: 1.7 }}>
                The platform is designed around a three-tier ownership model. Every person in your organization has a defined role — not a generic "user" — from the first login.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
              {TIERS.map((tier) => {
                const Icon = tier.icon;
                return (
                  <div key={tier.level} style={{
                    background: tier.you ? NAVY : "#fff",
                    border: `2px solid ${tier.you ? TEAL : BORDER}`,
                    padding: "32px 28px",
                    position: "relative",
                  }}>
                    {tier.you && (
                      <div style={{ ...BC, position: "absolute", top: -1, left: 28, fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", background: TEAL, color: "#fff", padding: "4px 12px" }}>
                        Your Role
                      </div>
                    )}
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, marginTop: tier.you ? 12 : 0 }}>
                      <div style={{
                        width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center",
                        background: tier.you ? "rgba(201,168,76,0.15)" : `${tier.color}12`,
                      }}>
                        <Icon size={20} color={tier.you ? GOLD : tier.color} />
                      </div>
                      <div>
                        <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: tier.color, marginBottom: 2 }}>
                          {tier.level} · {tier.role}
                        </div>
                        <div style={{ ...CG, fontSize: 22, fontWeight: 700, color: tier.you ? "#fff" : NAVY, lineHeight: 1.1 }}>
                          {tier.title}
                        </div>
                      </div>
                    </div>
                    <p style={{ fontSize: 13, color: tier.you ? "rgba(255,255,255,0.72)" : MUTED, lineHeight: 1.7, marginBottom: 20 }}>
                      {tier.description}
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {tier.responsibilities.map((r, i) => (
                        <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                          <CheckCircle2 size={13} color={tier.you ? TEAL : tier.color} style={{ flexShrink: 0, marginTop: 1 }} />
                          <span style={{ fontSize: 12, color: tier.you ? "rgba(255,255,255,0.65)" : "#374151", lineHeight: 1.5 }}>{r}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* PMO Proof Points */}
        <div style={{ background: NAVY_BG, padding: "52px 48px", borderBottom: `1px solid rgba(255,255,255,0.07)` }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32 }}>
            {PMO_PROOF_POINTS.map((p) => (
              <div key={p.stat}>
                <div style={{ ...CG, fontSize: "clamp(36px,4vw,52px)", fontWeight: 700, color: GOLD, lineHeight: 1, marginBottom: 4 }}>{p.stat}</div>
                <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>{p.label}</div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, margin: 0 }}>{p.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 4-Phase Setup Path */}
        <div style={{ background: "#fff", padding: "72px 48px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 28, height: 1, background: GOLD }} />
                <span style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>Preparation Architect Go-Live Path</span>
                <div style={{ width: 28, height: 1, background: GOLD }} />
              </div>
              <h2 style={{ ...CG, fontSize: "clamp(28px,3.5vw,42px)", fontWeight: 700, color: NAVY, marginBottom: 14, lineHeight: 1.1 }}>
                Your 4-phase path to live.
              </h2>
              <p style={{ fontSize: 15, color: MUTED, maxWidth: 580, margin: "0 auto", lineHeight: 1.7 }}>
                From first login to live signal detection in 30 days. Each phase has explicit Preparation Architect tasks — not generic setup steps.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {SETUP_PHASES.map((phase, i) => {
                const Icon = phase.icon;
                const isLast = i === SETUP_PHASES.length - 1;
                return (
                  <div key={phase.num} style={{ display: "flex", gap: 0 }}>
                    {/* Timeline spine */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 48, flexShrink: 0 }}>
                      <div style={{
                        width: 36, height: 36, background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}>
                        <Icon size={16} color={GOLD} />
                      </div>
                      {!isLast && <div style={{ width: 2, flex: 1, background: BORDER, minHeight: 32, marginTop: 4 }} />}
                    </div>
                    {/* Content */}
                    <div style={{ flex: 1, paddingLeft: 24, paddingBottom: isLast ? 0 : 40 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4, marginTop: 6 }}>
                        <span style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: GOLD }}>{phase.num}</span>
                        <span style={{ ...BC, fontSize: 9, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED }}>{phase.timing}</span>
                      </div>
                      <h3 style={{ ...CG, fontSize: 22, fontWeight: 700, color: NAVY, marginBottom: 16, lineHeight: 1.2 }}>{phase.title}</h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                        {phase.tasks.map((task, j) => (
                          <div key={j} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 14px", background: "#F8F7F4", border: `1px solid ${BORDER}` }}>
                            <CheckCircle2 size={13} color={TEAL} style={{ flexShrink: 0, marginTop: 1 }} />
                            <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>{task}</span>
                          </div>
                        ))}
                      </div>
                      <Link href={phase.href} style={{ ...BC, display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: TEAL, textDecoration: "none" }}>
                        {phase.ctaLabel}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Governance Rhythm */}
        <div style={{ background: IVORY, padding: "72px 48px", borderTop: `1px solid ${BORDER}` }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{ marginBottom: 40 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 28, height: 1, background: GOLD }} />
                <span style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>Governance Rhythm</span>
              </div>
              <h2 style={{ ...CG, fontSize: "clamp(26px,3vw,38px)", fontWeight: 700, color: NAVY, marginBottom: 12, lineHeight: 1.1 }}>
                Ongoing preparation calibration rhythm.
              </h2>
              <p style={{ fontSize: 15, color: MUTED, maxWidth: 620, lineHeight: 1.7 }}>
                Readiness is not a one-time setup — but it is not a full-time job either. This is the cadence that keeps the preparation architecture current as your organization evolves, without becoming a full-time job for whoever holds the architect role.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
              {[
                { cadence: "Weekly", task: "Review live signal dashboard — any new triggers above threshold? Are the relevant protocols green?", icon: BookOpen },
                { cadence: "Monthly", task: "Protocol audit — review all protocols for ownership currency. Any role changes, reorgs, or departures that affect assignments?", icon: Target },
                { cadence: "Quarterly", task: "Full drill cycle — run one drill per strategic domain. Review ADVANCE loop improvements. Submit executive readiness report.", icon: Zap },
                { cadence: "On Change", task: "Any organizational trigger (M&A, leadership change, market entry) — review the relevant protocol cluster and update before the trigger fires.", icon: Shield },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.cadence} style={{ background: "#fff", border: `1px solid ${BORDER}`, borderTop: `3px solid ${GOLD}`, padding: "24px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                      <Icon size={14} color={GOLD} />
                      <span style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: GOLD }}>{item.cadence}</span>
                    </div>
                    <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, margin: 0 }}>{item.task}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: NAVY, padding: "72px 48px", textAlign: "center" }}>
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <div style={{ width: 44, height: 1, background: GOLD, margin: "0 auto 20px" }} />
            <h2 style={{ ...CG, fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 700, color: "#fff", marginBottom: 16, lineHeight: 1.1 }}>
              The response is ready<br /><em style={{ color: GOLD }}>before the trigger fires.</em>
            </h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", maxWidth: 520, margin: "0 auto 36px", lineHeight: 1.7 }}>
              Your role as Preparation Architect is to ensure that sentence is true — across every domain, every trigger category, every protocol in the library. Begin the configuration now.
            </p>
            <Link href="/getting-started" style={{ ...BC, display: "inline-flex", alignItems: "center", gap: 8, background: GOLD, color: NAVY, fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", padding: "14px 32px", textDecoration: "none", borderRadius: "0.15rem" }}>
              Begin Configuration <ArrowRight size={14} />
            </Link>
          </div>
        </div>

      </div>
    </PageLayout>
  );
}
