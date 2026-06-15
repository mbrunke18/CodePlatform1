import { Link } from "wouter";
import { ArrowRight, Zap, Radio, Brain, BarChart3, TrendingUp, Activity, Eye, Layers, Shield, Play, RefreshCw } from "lucide-react";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const IVORY = "#F0EDE4";
const MUTED = "#6B7280";
const DM: React.CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };
const SERIF: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

function SectionLabel({ text, light = false }: { text: string; light?: boolean }) {
  return <p style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: light ? "rgba(255,255,255,0.55)" : GOLD, marginBottom: 10 }}>{text}</p>;
}
function GoldRule() { return <div style={{ width: 40, height: 2, background: GOLD, marginBottom: 20 }} />; }

const LOOP = [
  {
    phase: "DETECT",
    color: TEAL,
    icon: Zap,
    headline: "Monitors continuously",
    desc: "248+ data points. 231 trigger conditions. Scored every 15 minutes against 16 trigger patterns.",
    links: [
      { label: "Signal Intelligence", href: "/signal-intelligence" },
      { label: "Trigger Monitoring", href: "/triggers-management" },
      { label: "Command Tower (Live Feed)", href: "/command-tower" },
    ],
  },
  {
    phase: "ANALYZE",
    color: GOLD,
    icon: Brain,
    headline: "Patterns — not noise",
    desc: "Square-root scaling scores signals LOW / MEDIUM / HIGH. Pattern detection replaces standing crisis committees.",
    links: [
      { label: "Intelligence Control Center", href: "/intelligence-control-center" },
      { label: "Compound Threat Detection", href: "/situations-hub" },
      { label: "AI Radar Dashboard", href: "/ai-radar" },
    ],
  },
  {
    phase: "ALERT",
    color: "#E05C3A",
    icon: Radio,
    headline: "Triggers with context",
    desc: "Alert includes the protocol already staged, stakeholders pre-assigned, and authorization chain ready. No scramble.",
    links: [
      { label: "Mission Control", href: "/mission-control" },
      { label: "9-Domain Situations Board", href: "/situations-hub" },
      { label: "Coordination Intelligence", href: "/coordination-intelligence" },
    ],
  },
  {
    phase: "EXECUTE",
    color: NAVY,
    icon: Activity,
    headline: "12 minutes to authorized",
    desc: "Protocol activates. Tasks stage. Stakeholders notified. Executive authorizes. Execution begins — all pre-staged.",
    links: [
      { label: "Live Activation Center", href: "/live-activation-center" },
      { label: "War Room", href: "/war-room" },
      { label: "How It Executes", href: "/how-it-executes" },
    ],
  },
  {
    phase: "LEARN",
    color: "#7B61FF",
    icon: TrendingUp,
    headline: "Every close-out teaches",
    desc: "ADVANCE 2.0 closes the loop. Causal hypotheses created. Expected vs actual measured. Protocols self-improve.",
    links: [
      { label: "ADVANCE 2.0", href: "/advance-intelligence" },
      { label: "Advanced Analytics", href: "/advanced-analytics" },
      { label: "Proof Story", href: "/proof-story" },
    ],
  },
];

const CAPABILITIES = [
  {
    group: "Signal Layer",
    color: TEAL,
    items: [
      { icon: Zap, label: "Signal Intelligence", sub: "231 trigger conditions · 15-min detection cycle", href: "/signal-intelligence" },
      { icon: Radio, label: "Trigger Monitoring", sub: "248+ data points across 8 RSS sources", href: "/triggers-management" },
      { icon: Eye, label: "Command Tower", sub: "Live executive wall display — auto-refreshing", href: "/command-tower" },
    ],
  },
  {
    group: "Analysis Layer",
    color: GOLD,
    items: [
      { icon: Brain, label: "Intelligence Control Center", sub: "Real-time detection feed with pattern scoring", href: "/intelligence-control-center" },
      { icon: Shield, label: "9-Domain Situations Board", sub: "Compound threat detection across all domains", href: "/situations-hub" },
      { icon: Activity, label: "Coordination Intelligence", sub: "Your real speed vs. the 12-min benchmark", href: "/coordination-intelligence" },
    ],
  },
  {
    group: "Learning Layer",
    color: "#7B61FF",
    items: [
      { icon: TrendingUp, label: "ADVANCE 2.0", sub: "Closed-loop causal learning after every activation", href: "/advance-intelligence" },
      { icon: BarChart3, label: "Advanced Analytics", sub: "Execution history · ROI · outcome classification", href: "/advanced-analytics" },
      { icon: Layers, label: "AI Radar Dashboard", sub: "Real-time response times vs. benchmarks", href: "/ai-radar" },
    ],
  },
];

const DIFFERENTIATORS = [
  {
    old: "Committee deliberation",
    now: "Pattern detection",
    color: TEAL,
  },
  {
    old: "30-day mobilization cycle",
    now: "12-minute execution",
    color: GOLD,
  },
  {
    old: "Reactive monitoring",
    now: "Continuous pre-staging",
    color: "#7B61FF",
  },
  {
    old: "Post-incident review",
    now: "Causal learning loop",
    color: "#E05C3A",
  },
];

export default function IntelligenceLayerHub() {
  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>

      {/* HERO */}
      <section style={{ background: NAVY, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 75% 30%, rgba(43,138,110,0.08) 0%, transparent 55%), radial-gradient(ellipse at 15% 75%, rgba(201,168,76,0.05) 0%, transparent 55%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 48px 72px" }}>
          <SectionLabel text="Intelligence Layer · Complete Map" light />
          <h1 style={{ ...SERIF, fontSize: 52, fontWeight: 700, color: "#fff", lineHeight: 1.1, margin: "0 0 8px", maxWidth: 680 }}>
            What the system monitors.
          </h1>
          <h1 style={{ ...SERIF, fontSize: 52, fontWeight: 400, fontStyle: "italic", color: GOLD, lineHeight: 1.1, margin: "0 0 24px" }}>
            What it learns.
          </h1>
          <p style={{ ...DM, fontSize: 16, color: "rgba(255,255,255,0.6)", maxWidth: 560, lineHeight: 1.65, marginBottom: 40 }}>
            Every layer of the intelligence loop — from continuous signal detection to closed-loop causal learning — mapped in one place.
          </p>
          <div style={{ display: "flex", gap: 0, flexWrap: "wrap", marginBottom: 40 }}>
            {[
              { n: "231", label: "Trigger Conditions" },
              { n: "248+", label: "Data Points" },
              { n: "15 min", label: "Detection Cycle" },
              { n: "9", label: "Strategic Domains" },
              { n: "180", label: "Pre-Staged Protocols" },
            ].map((s, i) => (
              <div key={s.n} style={{ padding: "16px 32px 16px 0", marginRight: 32, borderRight: i < 4 ? "1px solid rgba(255,255,255,0.1)" : "none", paddingRight: i < 4 ? 32 : 0 }}>
                <div style={{ ...DM, fontSize: 26, fontWeight: 800, color: GOLD, lineHeight: 1 }}>{s.n}</div>
                <div style={{ ...DM, fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <Link href="/command-tower" style={{ ...DM, display: "inline-flex", alignItems: "center", gap: 8, background: TEAL, color: "#fff", fontWeight: 800, fontSize: 13, padding: "14px 28px", textDecoration: "none", letterSpacing: "0.07em", textTransform: "uppercase" }}>
              <Radio size={13} /> View Live Feed
            </Link>
            <Link href="/signal-intelligence" style={{ ...DM, display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: "rgba(255,255,255,0.65)", fontWeight: 600, fontSize: 13, padding: "13px 20px", textDecoration: "none", border: "1px solid rgba(255,255,255,0.2)" }}>
              Signal Intelligence <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* THE LOOP */}
      <section style={{ background: IVORY, padding: "72px 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionLabel text="The Intelligence Loop" />
          <GoldRule />
          <h2 style={{ ...DM, fontSize: 30, fontWeight: 700, color: NAVY, marginBottom: 8 }}>Detect → Analyze → Alert → Execute → Learn.</h2>
          <p style={{ ...DM, fontSize: 14, color: MUTED, marginBottom: 40, maxWidth: 520 }}>
            Five continuous phases. No standing committees. No manual coordination. No 30-day delay.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
            {LOOP.map((phase, i) => (
              <div key={phase.phase} style={{ position: "relative", background: "#fff", border: "1px solid rgba(10,15,46,0.08)", borderTop: `3px solid ${phase.color}`, padding: "20px 18px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                  <phase.icon size={13} color={phase.color} />
                  <span style={{ ...DM, fontSize: 10, fontWeight: 800, letterSpacing: "0.16em", color: phase.color }}>{phase.phase}</span>
                </div>
                <h3 style={{ ...DM, fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 8, lineHeight: 1.2 }}>{phase.headline}</h3>
                <p style={{ ...DM, fontSize: 11, color: MUTED, lineHeight: 1.5, marginBottom: 14 }}>{phase.desc}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {phase.links.map(l => (
                    <Link key={l.label} href={l.href} style={{ ...DM, fontSize: 10, fontWeight: 600, color: phase.color, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                      <ArrowRight size={9} />{l.label}
                    </Link>
                  ))}
                </div>
                {i < LOOP.length - 1 && (
                  <div style={{ position: "absolute", top: "50%", right: -8, width: 16, height: 16, background: IVORY, border: "1px solid rgba(10,15,46,0.12)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>
                    <ArrowRight size={8} color={MUTED} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CAPABILITY MAP */}
      <section style={{ background: "#fff", padding: "72px 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionLabel text="Capability Map" />
          <GoldRule />
          <h2 style={{ ...DM, fontSize: 30, fontWeight: 700, color: NAVY, marginBottom: 40 }}>Three intelligence layers. Nine capabilities.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {CAPABILITIES.map(group => (
              <div key={group.group}>
                <div style={{ ...DM, fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", color: group.color, marginBottom: 14, borderBottom: `2px solid ${group.color}`, paddingBottom: 8 }}>
                  {group.group}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {group.items.map(item => (
                    <Link key={item.label} href={item.href} style={{ textDecoration: "none", display: "block", border: "1px solid rgba(10,15,46,0.08)", padding: "14px 16px", transition: "border-color 0.15s" }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = group.color}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(10,15,46,0.08)"}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                        <item.icon size={12} color={group.color} />
                        <span style={{ ...DM, fontSize: 13, fontWeight: 700, color: NAVY }}>{item.label}</span>
                      </div>
                      <p style={{ ...DM, fontSize: 11, color: MUTED, lineHeight: 1.4, margin: 0 }}>{item.sub}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT CHANGED */}
      <section style={{ background: NAVY, padding: "72px 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionLabel text="What Changed" light />
          <GoldRule />
          <h2 style={{ ...DM, fontSize: 30, fontWeight: 700, color: "#fff", marginBottom: 8 }}>The old model. The new model.</h2>
          <p style={{ ...DM, fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 40, maxWidth: 480 }}>
            Every enterprise has the old model baked in. Readiness OS replaces the bottlenecks — not the tools.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {DIFFERENTIATORS.map(d => (
              <div key={d.old} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderTop: `2px solid ${d.color}`, padding: "20px 18px" }}>
                <div style={{ ...DM, fontSize: 12, color: "#EF4444", fontWeight: 600, marginBottom: 8, textDecoration: "line-through", opacity: 0.7 }}>{d.old}</div>
                <div style={{ width: 20, height: 1, background: "rgba(255,255,255,0.15)", margin: "8px 0" }} />
                <div style={{ ...DM, fontSize: 13, fontWeight: 700, color: d.color }}>{d.now}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: IVORY, padding: "64px 48px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <SectionLabel text="See It Live" />
          <h2 style={{ ...SERIF, fontSize: 36, fontWeight: 700, color: NAVY, marginBottom: 8 }}>Watch a trigger fire in real time.</h2>
          <p style={{ ...DM, fontSize: 15, color: MUTED, marginBottom: 32, maxWidth: 440, margin: "0 auto 32px" }}>
            The 12-Minute Test Drive runs the full loop — detection to authorized execution — with no login required.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/12-minute-experience" style={{ ...DM, display: "inline-flex", alignItems: "center", gap: 8, background: NAVY, color: "#fff", fontWeight: 800, fontSize: 13, padding: "14px 28px", textDecoration: "none", letterSpacing: "0.07em", textTransform: "uppercase" }}>
              <Play size={13} /> Run the 12-Minute Test Drive
            </Link>
            <Link href="/command-tower" style={{ ...DM, display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: NAVY, fontWeight: 600, fontSize: 13, padding: "13px 20px", textDecoration: "none", border: "1px solid rgba(10,15,46,0.2)" }}>
              <RefreshCw size={12} /> Live Signal Feed
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
