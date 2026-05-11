import { SCENARIO_GROUPS, SCENARIOS } from "./demos/scenarioData";

const NAVY  = "#080d24";
const DARK  = "#030612";
const DARK2 = "#040a18";
const GOLD  = "#C9A84C";
const TEAL  = "#4dc4a0";
const RED   = "#e05252";
const W     = "#ffffff";
const W70   = "rgba(255,255,255,0.70)";
const W50   = "rgba(255,255,255,0.50)";
const W25   = "rgba(255,255,255,0.25)";
const BD    = "rgba(201,168,76,0.22)";
const GBG   = "rgba(201,168,76,0.06)";
const BC    = { fontFamily: "'Barlow Condensed','Arial Narrow',sans-serif" } as const;
const CG    = { fontFamily: "'Cormorant Garamond',Georgia,serif" } as const;
const BAR   = { fontFamily: "'Barlow',sans-serif" } as const;

function SeverityBadge({ score }: { score: number }) {
  const color = score >= 90 ? RED : score >= 75 ? "#e09040" : GOLD;
  const label = score >= 90 ? "CRITICAL" : score >= 75 ? "HIGH" : "ELEVATED";
  return (
    <span style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.2em", color, background: `${color}15`, border: `1px solid ${color}40`, padding: "2px 8px" }}>
      {label} · {score}
    </span>
  );
}

interface ScenarioCardProps {
  id: string;
  label: string;
  icon: string;
  tagline: string;
  featured?: boolean;
}

function ScenarioCard({ id, label, icon, tagline, featured = false }: ScenarioCardProps) {
  const sc = SCENARIOS[id];
  if (!sc) return null;
  const route = id === "activist" ? "/master-demo" : `/demo/${id}`;

  return (
    <a
      href={route}
      style={{
        display: "block", textDecoration: "none",
        background: featured ? `linear-gradient(135deg, rgba(201,168,76,0.10) 0%, rgba(201,168,76,0.03) 100%)` : GBG,
        border: `1px solid ${featured ? GOLD + "50" : BD}`,
        padding: featured ? "32px 28px" : "24px 22px",
        transition: "border-color 0.2s, background 0.2s",
        position: "relative", overflow: "hidden",
      }}
    >
      {featured && (
        <div style={{ position: "absolute", top: 14, right: 14 }}>
          <span style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.3em", color: GOLD, background: `${GOLD}18`, border: `1px solid ${GOLD}40`, padding: "3px 10px" }}>
            MASTER DEMO
          </span>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 14 }}>
        <div style={{ fontSize: featured ? 32 : 24, flexShrink: 0, lineHeight: 1 }}>{icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", color: GOLD, textTransform: "uppercase", marginBottom: 4 }}>
            {label} · {sc.category}
          </div>
          <div style={{ ...BC, fontSize: featured ? 22 : 18, fontWeight: 900, color: W, lineHeight: 1.15, letterSpacing: "-0.01em", marginBottom: 4 }}>
            {sc.name}
          </div>
          <div style={{ ...BC, fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", color: W50 }}>
            Protocol #{sc.protocolNumber} · {sc.audience}
          </div>
        </div>
      </div>

      <div style={{ ...BAR, fontSize: 13, color: W70, lineHeight: 1.6, marginBottom: 14 }}>
        {tagline}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 14, borderTop: `1px solid rgba(255,255,255,0.07)` }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <SeverityBadge score={sc.riskScore}/>
          <span style={{ ...BC, fontSize: 9, fontWeight: 600, letterSpacing: "0.15em", color: W25 }}>
            {sc.tasks.length} tasks · {sc.stakeholders.length} stakeholders · 12 min
          </span>
        </div>
        <span style={{ ...BC, fontSize: 12, fontWeight: 800, color: GOLD, letterSpacing: "0.1em" }}>
          Launch →
        </span>
      </div>
    </a>
  );
}

export default function DemoHub() {
  return (
    <div style={{ background: DARK, minHeight: "100vh", color: W }}>

      {/* Header */}
      <div style={{ background: NAVY, borderBottom: `1px solid ${BD}`, padding: "13px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", border: `1.5px solid ${GOLD}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ ...BC, fontSize: 10, fontWeight: 800, color: GOLD }}>VM</span>
          </div>
          <div>
            <div style={{ ...BC, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", color: W }}>VaughnMartin · Readiness OS™</div>
            <div style={{ ...BC, fontSize: 8, fontWeight: 600, letterSpacing: "0.2em", color: W50, textTransform: "uppercase" }}>Full Platform Experience Center</div>
          </div>
        </div>
        <a href="/" style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: GOLD, textDecoration: "none", border: `1px solid ${GOLD}40`, padding: "6px 14px" }}>
          Back to Platform
        </a>
      </div>

      {/* Hero */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "64px 28px 48px", borderBottom: `1px solid ${BD}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <span style={{ display: "inline-block", width: 28, height: 1.5, background: GOLD, flexShrink: 0 }}/>
          <span style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.4em", color: GOLD, textTransform: "uppercase" }}>Experience Center · 8 Full Scenario Simulations</span>
        </div>
        <h1 style={{ ...BC, fontSize: 54, fontWeight: 900, color: W, lineHeight: 1.0, letterSpacing: "-0.02em", marginBottom: 10 }}>
          The most realistic platform<br/>demo in enterprise SaaS.
        </h1>
        <div style={{ ...CG, fontSize: 26, fontStyle: "italic", color: GOLD, lineHeight: 1.3, marginBottom: 20 }}>
          Real scenario. Real data. Real product delivery.
        </div>
        <p style={{ ...BAR, fontSize: 15, color: W70, lineHeight: 1.7, maxWidth: 620 }}>
          Each simulation walks you through a live Fortune 500 strategic trigger — from signal detection to executive authorization to 12-minute activation. Select your industry or role to see the platform respond to the situation you face most.
        </p>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "48px 28px 80px" }}>

        {/* Master Demo — featured */}
        <div style={{ marginBottom: 52 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <span style={{ display: "inline-block", width: 22, height: 1.5, background: GOLD, flexShrink: 0 }}/>
            <span style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.35em", color: GOLD, textTransform: "uppercase" }}>Featured — Master Scenario</span>
          </div>
          <ScenarioCard
            id="activist"
            label="CEO · Board · Investor Relations"
            icon="📋"
            tagline="Elliott Management files a 13D at 2:47 AM demanding 3 board seats. In the old model: 30 days to mobilize. With Readiness OS: full activation in 12 minutes. The definitive platform experience."
            featured
          />
        </div>

        {/* Industry scenarios */}
        <div style={{ marginBottom: 52 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{ display: "inline-block", width: 22, height: 1.5, background: TEAL, flexShrink: 0 }}/>
            <span style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.35em", color: TEAL, textTransform: "uppercase" }}>By Industry — 6 Scenarios</span>
          </div>
          <p style={{ ...BAR, fontSize: 13, color: W50, lineHeight: 1.6, maxWidth: 560, marginBottom: 24 }}>
            Each scenario uses a real Fortune 500 company archetype, real regulatory timelines, and the exact protocols your industry would need pre-staged and ready.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {SCENARIO_GROUPS.industries.map(({ id, label, icon, tagline }) => (
              <ScenarioCard key={id} id={id} label={label} icon={icon} tagline={tagline}/>
            ))}
          </div>
        </div>

        {/* Role scenarios */}
        <div style={{ marginBottom: 52 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{ display: "inline-block", width: 22, height: 1.5, background: "#a070f0", flexShrink: 0 }}/>
            <span style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.35em", color: "#a070f0", textTransform: "uppercase" }}>By Role — 2 Scenarios</span>
          </div>
          <p style={{ ...BAR, fontSize: 13, color: W50, lineHeight: 1.6, maxWidth: 560, marginBottom: 24 }}>
            Role-specific simulations show exactly what each executive experiences during an activation — their brief, their tasks, their decision moment.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {SCENARIO_GROUPS.roles.map(({ id, label, icon, tagline }) => (
              <ScenarioCard key={id} id={id} label={label} icon={icon} tagline={tagline}/>
            ))}
          </div>
        </div>

        {/* What every demo shows */}
        <div style={{ background: GBG, border: `1px solid ${BD}`, padding: "36px 32px", marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <span style={{ display: "inline-block", width: 22, height: 1.5, background: GOLD, flexShrink: 0 }}/>
            <span style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.35em", color: GOLD, textTransform: "uppercase" }}>What Every Simulation Shows</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
            {[
              { step: "01", title: "The Trigger Fires", body: "Real scenario, real company, real time of night. The situation unfolds with full context and stakes." },
              { step: "02", title: "Signal Detection", body: "4 corroborating signals detected and scored live. Composite risk score computed in seconds." },
              { step: "03", title: "Protocol Matched", body: "The right Readiness Protocol pulled from 170 pre-staged options. Already written. Already waiting." },
              { step: "04", title: "War Room Activated", body: "14 tasks pre-assigned. 6 stakeholders notified with real-time status progression." },
              { step: "05", title: "CEO Authorizes", body: "Executive brief delivered. One decision. Full authority. No committee required." },
              { step: "06", title: "12 Minutes Complete", body: "Live animated timeline. Full comparison with the 30-day old model. The 3,600× head start." },
              { step: "07", title: "The Outcome", body: "Deliverables generated. Post-activation intelligence. The fearless result of total preparation." },
            ].map(({ step, title, body }) => (
              <div key={step} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ ...BC, fontSize: 11, fontWeight: 900, color: GOLD, opacity: 0.5, flexShrink: 0, lineHeight: 1, marginTop: 3 }}>{step}</div>
                <div>
                  <div style={{ ...BC, fontSize: 13, fontWeight: 800, color: W, letterSpacing: "0.04em", marginBottom: 4 }}>{title}</div>
                  <div style={{ ...BAR, fontSize: 12, color: W50, lineHeight: 1.5 }}>{body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <div style={{ ...CG, fontSize: 28, fontStyle: "italic", color: GOLD, lineHeight: 1.4, marginBottom: 10 }}>
            "The response is ready before the trigger fires."
          </div>
          <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: W50, marginBottom: 32 }}>
            Preparation &nbsp;→&nbsp; Readiness &nbsp;→&nbsp; Fearless
          </div>
          <a
            href="/contact"
            style={{ ...BC, background: GOLD, border: "none", color: DARK, fontSize: 16, fontWeight: 900, letterSpacing: "0.14em", padding: "18px 48px", textDecoration: "none", textTransform: "uppercase", display: "inline-block" }}
          >
            Apply for Founding Partner Access →
          </a>
          <div style={{ ...BC, fontSize: 9, color: W25, letterSpacing: "0.2em", marginTop: 14, textTransform: "uppercase" }}>
            Founding Partner Program · 90-day validation · Fortune 1000 only
          </div>
        </div>

      </div>
    </div>
  );
}
