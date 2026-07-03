import type { DemoScenario } from "@/pages/demos/scenarioData";
import { GOLD, TEAL, TEAL_LT, W, W70, W50, W25, BD, GBG, BC, CG, BAR } from "../shared";

const PLATFORM_MAP = [
  { label: "Command Tower", href: "/command-tower", sub: "Live signal detections & system-wide readiness score, in real time." },
  { label: "180 Readiness Protocols", href: "/protocol-zero-launch".replace("/protocol-zero-launch", "/protocol-browser"), sub: "The full pre-staged protocol library across all three strategic domains." },
  { label: "Practice Drills", href: "/practice-drills", sub: "Rehearse a protocol before it's ever needed — structured debrief included." },
  { label: "ROI Dashboard", href: "/roi-calculator", sub: "Actual cost avoided, logged per activation — not estimated." },
  { label: "ADVANCE 2.0", href: "/advance-intelligence", sub: "The closed-loop learning engine you just saw in Chapter 8." },
  { label: "How It Executes", href: "/how-it-executes", sub: "The full signal → protocol → authorization → 12-minute chain, visualized." },
];

export default function Ch9Recap({ sc, onRestart }: { sc: DemoScenario; onRestart: () => void }) {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "52px 28px 64px" }}>
      <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.4em", color: TEAL, textTransform: "uppercase", marginBottom: 16 }}>
        Chapter 9 — Recap: The Full Platform
      </div>
      <h2 style={{ ...CG, fontSize: 42, fontWeight: 600, color: W, lineHeight: 1.12, letterSpacing: "-0.01em", marginBottom: 16 }}>
        You just walked the whole loop —<br/><em style={{ color: GOLD }}>preparation, authorization, mobilization, compounding.</em>
      </h2>
      <p style={{ ...BAR, fontSize: 14, color: W70, lineHeight: 1.7, maxWidth: 680, marginBottom: 30 }}>
        Pre-staged before the trigger. Authorized in real time. {sc.stakeholders.length} stakeholders mobilized in 12 minutes — and executing from a fully-staged position. Every activation makes the next response faster. This is what Readiness Infrastructure means: not a faster meeting, a different operating model.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 32 }}>
        {PLATFORM_MAP.map(({ label, href, sub }, i) => (
          <a key={i} href={href} style={{ textDecoration: "none", background: GBG, border: `1px solid ${BD}`, padding: "18px 20px", display: "block" }}>
            <div style={{ ...BC, fontSize: 14, fontWeight: 800, color: TEAL_LT, letterSpacing: "0.02em", marginBottom: 5 }}>{label} →</div>
            <div style={{ ...BAR, fontSize: 12, color: W50, lineHeight: 1.5 }}>{sub}</div>
          </a>
        ))}
      </div>

      <div style={{ textAlign: "center", padding: "26px 0", borderTop: `1px solid ${BD}`, borderBottom: `1px solid ${BD}`, marginBottom: 32 }}>
        <div style={{ ...CG, fontSize: 15, fontStyle: "italic", color: W70, lineHeight: 1.5, marginBottom: 4 }}>When the situation arrives —</div>
        <div style={{ ...CG, fontSize: 26, color: W, lineHeight: 1.3, marginBottom: 4 }}>The Response Is Ready</div>
        <div style={{ ...CG, fontSize: 26, color: GOLD, lineHeight: 1.3, marginBottom: 14 }}>Before the Trigger Fires.</div>
        <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: W50 }}>Preparation &nbsp;→&nbsp; Readiness &nbsp;→&nbsp; Fearless</div>
      </div>

      <div style={{ background: GBG, border: `1px solid ${GOLD}50`, padding: "34px 30px" }}>
        <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.4em", color: GOLD, textTransform: "uppercase", marginBottom: 14 }}>Founding Partner Program — Now Forming</div>
        <h2 style={{ ...CG, fontSize: 30, fontWeight: 600, color: W, lineHeight: 1.25, marginBottom: 10 }}>
          Every organization prepared for every situation it'll face<br/>is no longer afraid of strategic triggers. <em style={{ color: GOLD }}>It's fearless.</em>
        </h2>
        <p style={{ ...BAR, fontSize: 14, color: W70, lineHeight: 1.65, maxWidth: 560, marginBottom: 22 }}>
          The Founding Partner Program is a 90-day validation partnership with large enterprises. The only difference between this experience and a live deployment: the protocols carry your organization's name, your stakeholders, and your pre-approved advisors.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
          <a href="/founding-partner-program" data-testid="link-founding-partner-cta" style={{ ...BC, background: GOLD, border: "none", color: "#0A0F2E", fontSize: 15, fontWeight: 800, letterSpacing: "0.12em", padding: "16px 34px", textDecoration: "none", textTransform: "uppercase", display: "inline-block" }}>
            Apply for Founding Partner Access →
          </a>
          <button onClick={onRestart} data-testid="button-run-again" style={{ ...BC, background: "transparent", border: `1px solid ${W25}`, color: W70, fontSize: 13, fontWeight: 600, letterSpacing: "0.1em", padding: "16px 24px", cursor: "pointer", textTransform: "uppercase" }}>
            ↺ Run a Different Situation
          </button>
        </div>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
          <a href="/demo-hub" style={{ ...BC, fontSize: 11, fontWeight: 700, color: GOLD, textDecoration: "none", letterSpacing: "0.12em" }}>← Try a Focused Scenario Instead</a>
          <span style={{ color: W25, fontSize: 11 }}>·</span>
          <a href="/master-demo" style={{ ...BC, fontSize: 11, fontWeight: 700, color: TEAL_LT, textDecoration: "none", letterSpacing: "0.12em" }}>See the 7-Step Activist Investor Walkthrough →</a>
        </div>
      </div>
    </div>
  );
}
