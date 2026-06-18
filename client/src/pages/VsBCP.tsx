import { useEffect, CSSProperties } from 'react';
import { useLocation } from 'wouter';
import { updatePageMetadata } from '@/lib/seo';
import PageLayout from "@/components/layout/PageLayout";
import { ArrowRight } from "lucide-react";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const IVORY = "#F0EDE4";
const CG: CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
const DM: CSSProperties = { fontFamily: "'Barlow', 'Barlow', sans-serif" };

const COMPARISON_ROWS = [
  {
    dimension: "Scope",
    bcp: "Catastrophic operational failures — systems down, facilities inaccessible, regulatory shutdown.",
    ros: "The full strategic trigger spectrum: competitive disruption, activist campaigns, M&A integration, leadership transitions, AI governance, market opportunity windows — and catastrophic events too.",
  },
  {
    dimension: "Form",
    bcp: "A document. It describes what should happen. It sits on a shelf until someone remembers to find it.",
    ros: "Infrastructure. Pre-staged responses ready to deploy in 12 minutes. The difference between a plan and a platform that executes.",
  },
  {
    dimension: "Cadence",
    bcp: "Reviewed annually. Activated during a once-in-a-decade catastrophe.",
    ros: "Runs continuously. Monitors 231 triggers every 15 minutes. Designed for the everyday strategic triggers that happen multiple times per year.",
  },
  {
    dimension: "Trigger detection",
    bcp: "Manual — someone notices the crisis has already arrived.",
    ros: "Automated signal monitoring across 248+ data points. Pre-staged before the trigger fires.",
  },
  {
    dimension: "Authorization",
    bcp: "Emergency escalation — who has authority is unclear under pressure.",
    ros: "Decision rights mapped and enforced. No Readiness Protocol activates without executive sign-off.",
  },
  {
    dimension: "Coverage gap",
    bcp: "Covers the situations you hope never happen.",
    ros: "Covers the situations that happen every year — competitive, regulatory, reputational, financial, leadership.",
  },
];

export default function VsBCP() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    updatePageMetadata({
      title: "Readiness OS vs. Business Continuity Planning | VaughnMartin",
      description: "Every startup to Fortune 500 has a BCP. None have what fires before the crisis does. See how Readiness OS covers the everyday strategic triggers your BCP doesn't.",
      ogTitle: "Readiness OS vs. BCP — Built for What Happens Every Year",
      ogDescription: "BCP covers catastrophe. Readiness OS covers the competitive triggers, activist campaigns, and M&A events that happen every year — and activate in 12 minutes.",
    });
  }, []);

  return (
    <PageLayout>

      {/* ── HERO ── */}
      <section style={{ background: NAVY, padding: "88px 48px 72px", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(201,168,76,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.07) 1px,transparent 1px)",
          backgroundSize: "48px 48px"
        }} />
        <div style={{ position: "absolute", left: -120, top: -160, width: 600, height: 600, background: "radial-gradient(circle, rgba(43,138,110,0.18) 0%, transparent 65%)" }} />
        <div style={{ position: "absolute", right: -80, bottom: -200, width: 500, height: 500, background: "radial-gradient(circle, rgba(201,168,76,0.14) 0%, transparent 65%)" }} />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 28, height: 2, background: GOLD }} />
            <span style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>
              Readiness OS vs. Business Continuity Planning
            </span>
            <div style={{ width: 28, height: 2, background: GOLD }} />
          </div>

          <h1 style={{ ...CG, fontWeight: 600, fontSize: "clamp(36px,5vw,58px)", color: IVORY, lineHeight: 1.05, marginBottom: 24 }}>
            Every startup to Fortune 500 has a BCP.<br />
            <em style={{ fontStyle: "italic", color: GOLD }}>None have what fires before the crisis does.</em>
          </h1>

          <p style={{ ...DM, fontSize: 18, color: "rgba(240,237,228,0.65)", maxWidth: 660, margin: "0 auto 40px", lineHeight: 1.65 }}>
            Business continuity planning is necessary. It covers the catastrophic failure your organization hopes never happens.
            Readiness OS covers the strategic triggers that happen every year — the ones where 30 days of mobilization paralysis
            causes more damage than the trigger itself.
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => setLocation("/request-access")}
              style={{ ...DM, display: "inline-flex", alignItems: "center", gap: 8, background: GOLD, color: NAVY, fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", padding: "16px 32px", border: "none", cursor: "pointer" }}
            >
              Request Founding Partner Access <ArrowRight style={{ width: 16, height: 16 }} />
            </button>
            <button
              onClick={() => setLocation('/demo-hub')}
              style={{ ...DM, display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: IVORY, fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", padding: "16px 32px", border: "1px solid rgba(240,237,228,0.25)", cursor: "pointer" }}
            >
              See It Execute in 12 Minutes
            </button>
          </div>
        </div>
      </section>

      {/* ── THE KEY DISTINCTION ── */}
      <section style={{ background: "#fff", padding: "72px 48px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 28, height: 2, background: GOLD }} />
            <span style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: GOLD }}>The Core Distinction</span>
          </div>
          <h2 style={{ ...CG, fontSize: "clamp(26px,3.5vw,40px)", fontWeight: 700, color: NAVY, lineHeight: 1.2, marginBottom: 24 }}>
            BCP is designed for survival.<br />Readiness OS is designed for performance under pressure.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div style={{ padding: "28px 28px", background: "#F8F7F4", border: "1px solid rgba(10,15,46,0.08)" }}>
              <p style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#9CA3AF", marginBottom: 12 }}>Business Continuity Planning</p>
              <p style={{ ...DM, fontSize: 15, color: "#374151", lineHeight: 1.7, margin: 0 }}>
                Protects the organization from catastrophic operational failure. Fire. Flood. Cyberattack that takes systems offline. The once-in-a-decade event that threatens existence. Necessary — but not the source of most startup to Fortune 500 competitive damage.
              </p>
            </div>
            <div style={{ padding: "28px 28px", background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)" }}>
              <p style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: GOLD, marginBottom: 12 }}>Readiness OS</p>
              <p style={{ ...DM, fontSize: 15, color: "#374151", lineHeight: 1.7, margin: 0 }}>
                Covers the triggers that happen multiple times per year — competitor moves, activist pressure, regulatory shifts, M&A, leadership transitions. And when a catastrophic event does occur, Readiness OS activates in 12 minutes instead of the 30-day mobilization cycle your BCP assumes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ── */}
      <section style={{ background: NAVY, padding: "80px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 28, height: 2, background: GOLD }} />
            <span style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: GOLD }}>Side by Side</span>
          </div>
          <h2 style={{ ...CG, fontSize: "clamp(24px,3vw,36px)", fontWeight: 700, color: "#fff", marginBottom: 40 }}>
            The comparison your board should see
          </h2>

          {/* Column headers */}
          <div style={{ display: "grid", gridTemplateColumns: "180px 1fr 1fr", gap: 2, marginBottom: 2 }}>
            <div />
            <div style={{ padding: "12px 20px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <span style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#9CA3AF" }}>Business Continuity Planning</span>
            </div>
            <div style={{ padding: "12px 20px", background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)" }}>
              <span style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD }}>Readiness OS</span>
            </div>
          </div>

          {COMPARISON_ROWS.map((row, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "180px 1fr 1fr", gap: 2, marginBottom: 2 }}>
              <div style={{ padding: "22px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center" }}>
                <span style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.68)" }}>{row.dimension}</span>
              </div>
              <div style={{ padding: "22px 20px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <p style={{ ...DM, fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.65, margin: 0 }}>{row.bcp}</p>
              </div>
              <div style={{ padding: "22px 20px", background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.15)" }}>
                <p style={{ ...DM, fontSize: 13, color: "rgba(240,237,228,0.8)", lineHeight: 1.65, margin: 0 }}>{row.ros}</p>
              </div>
            </div>
          ))}

          {/* Pull quote */}
          <div style={{ marginTop: 32, padding: "24px 28px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", gap: 20, alignItems: "center" }}>
            <div style={{ width: 4, height: 56, background: GOLD, flexShrink: 0 }} />
            <p style={{ ...DM, fontSize: 15, color: "rgba(240,237,228,0.75)", margin: 0, lineHeight: 1.7 }}>
              Most enterprise organizations face more damage from 30 days of mobilization paralysis on a competitive trigger than from a BCP event.
              Readiness OS is built for the situations that happen every year — the ones your BCP doesn't cover and your current operating model takes 30 days to handle.
            </p>
          </div>
        </div>
      </section>

      {/* ── THE FREQUENCY ARGUMENT ── */}
      <section style={{ background: "#fff", padding: "72px 48px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 28, height: 2, background: TEAL }} />
            <span style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: TEAL }}>Where the Real Damage Occurs</span>
          </div>
          <h2 style={{ ...CG, fontSize: "clamp(24px,3vw,36px)", fontWeight: 700, color: NAVY, lineHeight: 1.2, marginBottom: 24 }}>
            The triggers that fire every year are the ones your BCP doesn't cover.
          </h2>
          <p style={{ ...DM, fontSize: 16, color: "#374151", lineHeight: 1.7, marginBottom: 32 }}>
            A startup to Fortune 500 company will encounter a BCP-level catastrophe once or twice per decade.
            It will encounter competitive disruptions, regulatory changes, activist investors, M&A events,
            and leadership transitions multiple times per year. Each one triggers a 30-day mobilization cycle.
            Each one costs market position, stakeholder confidence, and execution speed.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            {[
              { label: "231", sub: "Strategic triggers monitored" },
              { label: "15 min", sub: "Signal check cadence" },
              { label: "12 min", sub: "Trigger to full execution" },
            ].map(s => (
              <div key={s.label} style={{ padding: "28px 24px", background: "#F8F7F4", border: "1px solid rgba(10,15,46,0.08)", textAlign: "center" }}>
                <p style={{ ...CG, fontSize: 40, fontWeight: 700, color: NAVY, margin: "0 0 6px", lineHeight: 1 }}>{s.label}</p>
                <p style={{ ...DM, fontSize: 12, color: "#6B7280", margin: 0, letterSpacing: "0.05em" }}>{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ALSO IN THIS SERIES ── */}
      <section style={{ background: "#F8F7F4", padding: "56px 48px", borderTop: "1px solid rgba(10,15,46,0.07)" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "#9CA3AF", marginBottom: 20 }}>Also in This Series</p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {[
              { label: "Why Not Consulting?", sub: "McKinsey charges $300K–$500K for PDFs. We deliver execution.", href: "/vs-consulting" },
              { label: "MS Project EOL → Don't Just Migrate", sub: "ServiceNow moves your lag to a new database. We eliminate the cycle.", href: "/ms-project" },
              { label: "Platform Reality", sub: "Every keynote proves the problem. None of them shipped the solution.", href: "/platform-reality" },
            ].map(l => (
              <button
                key={l.href}
                onClick={() => setLocation(l.href)}
                style={{ ...DM, flex: 1, minWidth: 220, textAlign: "left", padding: "20px 20px", background: "#fff", border: "1px solid rgba(10,15,46,0.09)", cursor: "pointer" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = GOLD; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(10,15,46,0.09)"; }}
              >
                <p style={{ ...DM, fontSize: 13, fontWeight: 700, color: NAVY, margin: "0 0 6px" }}>{l.label}</p>
                <p style={{ ...DM, fontSize: 12, color: "#6B7280", margin: 0, lineHeight: 1.5 }}>{l.sub}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: NAVY, padding: "80px 48px", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2 style={{ ...CG, fontSize: "clamp(26px,3.5vw,40px)", fontWeight: 700, color: "#fff", marginBottom: 16, lineHeight: 1.2 }}>
            The response is ready<br />
            <em style={{ color: GOLD, fontStyle: "italic" }}>before the trigger fires.</em>
          </h2>
          <p style={{ ...DM, fontSize: 16, color: "rgba(240,237,228,0.6)", marginBottom: 36, lineHeight: 1.65 }}>
            See Readiness OS execute a live strategic trigger in 12 minutes — no login required.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => setLocation("/12-minute-experience")}
              style={{ ...DM, display: "inline-flex", alignItems: "center", gap: 8, background: GOLD, color: NAVY, fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", padding: "16px 32px", border: "none", cursor: "pointer" }}
            >
              Run the 12-Minute Test Drive <ArrowRight style={{ width: 16, height: 16 }} />
            </button>
            <button
              onClick={() => setLocation("/request-access")}
              style={{ ...DM, display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: IVORY, fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", padding: "16px 32px", border: "1px solid rgba(240,237,228,0.25)", cursor: "pointer" }}
            >
              Request Founding Partner Access
            </button>
          </div>
        </div>
      </section>

    </PageLayout>
  );
}
