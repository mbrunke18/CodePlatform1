import PageLayout from "@/components/layout/PageLayout";
import ProductShowcase from "@/components/marketing/ProductShowcase";
import { SCENARIO_GROUPS, SCENARIOS } from "./demos/scenarioData";
import aerialCityImg from "@/assets/images/aerial-city-grid.png";

const NAVY    = "#0A0F2E";
const NAVY_BG = "#132558";
const GOLD    = "#C9A84C";
const GOLD_LT = "#DFC178";
const TEAL    = "#2B8A6E";
const TEAL_LT = "#3BAF8A";
const W       = "#ffffff";
const W70     = "rgba(255,255,255,0.70)";
const W50     = "rgba(255,255,255,0.50)";
const W25     = "rgba(255,255,255,0.25)";
const BD      = "rgba(201,168,76,0.22)";
const GBG     = "rgba(201,168,76,0.06)";
const BC      = { fontFamily: "'Barlow Condensed','Arial Narrow',sans-serif" } as const;
const CG      = { fontFamily: "'Cormorant Garamond',Georgia,serif" } as const;
const BAR     = { fontFamily: "'Barlow',sans-serif" } as const;

const DOMAIN_CONFIG = {
  growth: {
    label: "GROWTH & POSITIONING",
    color: GOLD_LT,
    bg: "rgba(201,168,76,0.07)",
    border: "rgba(201,168,76,0.25)",
    description: "A market window opens. A competitor stumbles. An acquisition target surfaces. Every growth opportunity requires the same capability: mobilize your full organization before the window closes.",
  },
  resilience: {
    label: "RISK & RESILIENCE",
    color: "#e05252",
    bg: "rgba(224,82,82,0.07)",
    border: "rgba(224,82,82,0.22)",
    description: "A breach at 4 AM. A recall at 7 PM. A filing at 2:47 AM. Every disruption demands the same response: every stakeholder notified, every task assigned, every decision ready — in 12 minutes.",
  },
  transformation: {
    label: "TRANSFORMATION",
    color: TEAL_LT,
    bg: "rgba(59,175,138,0.07)",
    border: "rgba(59,175,138,0.22)",
    description: "A board mandate lands at midnight. A competitor announces acceleration. A workforce realignment must begin in 48 hours. Transformation is not slow by nature — only by preparation.",
  },
};

function UrgencyBadge({ score, category }: { score: number; category: string }) {
  let color = score >= 90 ? "#e05252" : score >= 80 ? "#e09040" : GOLD;
  let label: string;
  if (category === "GROWTH & POSITIONING") {
    label = score >= 90 ? "WINDOW: CRITICAL" : score >= 80 ? "WINDOW: NARROWING" : "WINDOW: OPEN";
    color = score >= 90 ? GOLD_LT : score >= 80 ? GOLD : "rgba(201,168,76,0.7)";
  } else if (category === "TRANSFORMATION") {
    label = score >= 90 ? "URGENCY: CRITICAL" : score >= 80 ? "URGENCY: HIGH" : "URGENCY: ELEVATED";
    color = score >= 90 ? TEAL_LT : score >= 80 ? TEAL_LT : TEAL_LT;
  } else {
    label = score >= 90 ? "RISK: CRITICAL" : score >= 80 ? "RISK: HIGH" : "RISK: ELEVATED";
  }
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
  accentColor?: string;
}

function ScenarioCard({ id, label, icon, tagline, featured = false, accentColor }: ScenarioCardProps) {
  const sc = SCENARIOS[id];
  if (!sc) return null;
  const route = id === "activist" ? "/master-demo" : `/demo/${id}`;
  const accent = accentColor ?? GOLD;

  return (
    <a
      href={route}
      style={{
        display: "block", textDecoration: "none",
        background: featured
          ? `linear-gradient(135deg, ${accent}12 0%, ${accent}04 100%)`
          : GBG,
        border: `1px solid ${featured ? accent + "50" : BD}`,
        padding: featured ? "32px 28px" : "24px 22px",
        transition: "border-color 0.2s, background 0.2s",
        position: "relative", overflow: "hidden",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLAnchorElement).style.borderColor = accent + "70";
        (e.currentTarget as HTMLAnchorElement).style.background = `${accent}10`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLAnchorElement).style.borderColor = featured ? accent + "50" : "rgba(201,168,76,0.22)";
        (e.currentTarget as HTMLAnchorElement).style.background = featured
          ? `linear-gradient(135deg, ${accent}12 0%, ${accent}04 100%)`
          : GBG;
      }}
    >
      {featured && (
        <div style={{ position: "absolute", top: 14, right: 14 }}>
          <span style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.3em", color: accent, background: `${accent}18`, border: `1px solid ${accent}40`, padding: "3px 10px" }}>
            MASTER DEMO
          </span>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 14 }}>
        <div style={{ fontSize: featured ? 32 : 24, flexShrink: 0, lineHeight: 1 }}>{icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", color: accent, textTransform: "uppercase", marginBottom: 4 }}>
            {label} · {sc.category}
          </div>
          <div style={{ ...CG, fontSize: featured ? 24 : 20, fontWeight: 600, color: W, lineHeight: 1.2, marginBottom: 4 }}>
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
          <UrgencyBadge score={sc.riskScore} category={sc.category} />
          <span style={{ ...BC, fontSize: 9, fontWeight: 600, letterSpacing: "0.15em", color: W25 }}>
            {sc.tasks.length} tasks · {sc.stakeholders.length} stakeholders · 12 min
          </span>
        </div>
        <span style={{ ...BC, fontSize: 12, fontWeight: 700, color: accent, letterSpacing: "0.1em" }}>
          Launch →
        </span>
      </div>
    </a>
  );
}

interface DomainSectionProps {
  domainKey: "growth" | "resilience" | "transformation";
  scenarios: { id: string; label: string; icon: string; tagline: string }[];
}

function DomainSection({ domainKey, scenarios }: DomainSectionProps) {
  const cfg = DOMAIN_CONFIG[domainKey];
  return (
    <div style={{ marginBottom: 56 }}>
      <div style={{ borderLeft: `3px solid ${cfg.color}`, paddingLeft: 16, marginBottom: 20 }}>
        <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.4em", color: cfg.color, textTransform: "uppercase", marginBottom: 6 }}>
          Strategic Domain
        </div>
        <div style={{ ...CG, fontSize: 32, fontWeight: 600, color: W, lineHeight: 1.1, marginBottom: 10 }}>
          {cfg.label}
        </div>
        <p style={{ ...BAR, fontSize: 13, color: W50, lineHeight: 1.7, maxWidth: 580, margin: 0 }}>
          {cfg.description}
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {scenarios.map(({ id, label, icon, tagline }) => (
          <ScenarioCard key={id} id={id} label={label} icon={icon} tagline={tagline} accentColor={cfg.color} />
        ))}
      </div>
    </div>
  );
}

export default function DemoHub() {
  const totalScenarios = Object.keys(SCENARIOS).length;

  return (
    <PageLayout>
      <div style={{ background: NAVY_BG, minHeight: "100vh", color: W }}>

        {/* Hero */}
        <div style={{ background: NAVY_BG, borderBottom: `1px solid ${BD}`, position: "relative", overflow: "hidden" }}>
          <img src={aerialCityImg} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", opacity: 0.09, pointerEvents: "none" }} />
          <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(201,168,76,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.06) 1px, transparent 1px)`, backgroundSize: "48px 48px", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: "-20%", right: "-5%", width: 600, height: 600, background: `radial-gradient(circle, rgba(43,138,110,0.12) 0%, transparent 65%)`, pointerEvents: "none" }} />
          <div style={{ maxWidth: 960, margin: "0 auto", padding: "72px 28px 56px", position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <span style={{ display: "inline-block", width: 28, height: 1.5, background: GOLD, flexShrink: 0 }}/>
              <span style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.4em", color: GOLD, textTransform: "uppercase" }}>
                Experience Center · {totalScenarios} Full Scenario Simulations · 3 Strategic Domains
              </span>
            </div>
            <h1 style={{ ...CG, fontSize: "clamp(42px,5vw,68px)", fontWeight: 600, color: W, lineHeight: 1.05, letterSpacing: "-0.01em", marginBottom: 14 }}>
              Any situation.<br/>Any trigger.<br/><em style={{ color: GOLD }}>12 minutes.</em>
            </h1>
            <div style={{ ...CG, fontSize: 22, fontStyle: "italic", color: GOLD_LT, lineHeight: 1.4, marginBottom: 24 }}>
              Growth. Resilience. Transformation. The response is always ready.
            </div>
            <p style={{ ...BAR, fontSize: 15, color: W70, lineHeight: 1.75, maxWidth: 560, marginBottom: 28 }}>
              Every situation demands the same capability: your full organization mobilized in 12 minutes. Select a domain and see exactly how Readiness OS responds.
            </p>

            {/* Primary CTA — Full Platform Demo */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 32 }}>
              <a
                href="/demo-experience"
                style={{
                  ...BC, textDecoration: "none",
                  display: "inline-flex", alignItems: "center", gap: 10,
                  background: TEAL_LT, color: NAVY,
                  fontSize: 13, fontWeight: 700, letterSpacing: "0.14em",
                  padding: "16px 36px", textTransform: "uppercase",
                  whiteSpace: "nowrap",
                  boxShadow: `0 0 24px rgba(43,138,110,0.35)`,
                }}
              >
                Begin Full Platform Demo →
              </a>
              <div style={{ ...BAR, fontSize: 12, color: W50, lineHeight: 1.5 }}>
                9 steps · No login required<br/>
                <span style={{ color: TEAL_LT, fontWeight: 600 }}>3 Phases: Preparation · Response · Advance</span>
              </div>
            </div>

            {/* Domain pills */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {(["growth", "resilience", "transformation"] as const).map(key => {
                const cfg = DOMAIN_CONFIG[key];
                const count = key === "growth" ? SCENARIO_GROUPS.growth.length
                            : key === "resilience" ? SCENARIO_GROUPS.resilience.length
                            : SCENARIO_GROUPS.transformation.length;
                return (
                  <a
                    key={key}
                    href={`#domain-${key}`}
                    style={{
                      ...BC, textDecoration: "none",
                      fontSize: 10, fontWeight: 700, letterSpacing: "0.2em",
                      color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`,
                      padding: "8px 16px", textTransform: "uppercase",
                    }}
                  >
                    {cfg.label} — {count} scenarios
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 960, margin: "0 auto", padding: "56px 28px 80px" }}>

          {/* Recommended Path navigator */}
          <div style={{ marginBottom: 48, background: "rgba(201,168,76,0.06)", border: `1px solid rgba(201,168,76,0.18)`, padding: "20px 28px" }}>
            <div style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.4em", color: GOLD, textTransform: "uppercase", marginBottom: 14 }}>Recommended Path — New Here? Start in Order</div>
            <div style={{ display: "flex", alignItems: "center", gap: 0, flexWrap: "wrap" }}>
              {[
                { step: "01", label: "Why It Exists", sub: "Full Platform Demo", q: "What does this replace?", href: "/demo-experience" },
                { step: "02", label: "The Full Scope", sub: "Complete Operating Model", q: "Does it cover planned work too?", href: "/demo/planned-unplanned" },
                { step: "03", label: "How It Executes", sub: "Master Demo — Activist Investor", q: "What does it look like in practice?", href: "/master-demo" },
                { step: "04", label: "Your ROI", sub: "ROI Calculator", q: "What is the value to my organization?", href: "/roi-calculator" },
              ].map(({ step, label, sub, q, href }, i, arr) => (
                <div key={step} style={{ display: "flex", alignItems: "center", flex: 1, minWidth: 180 }}>
                  <a href={href} style={{ textDecoration: "none", flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 12px" }}>
                      <div style={{ ...BC, fontSize: 18, fontWeight: 700, color: GOLD, opacity: 0.5, lineHeight: 1, flexShrink: 0, marginTop: 2 }}>{step}</div>
                      <div>
                        <div style={{ ...BC, fontSize: 11, fontWeight: 700, color: W, letterSpacing: "0.06em", lineHeight: 1.2 }}>{label}</div>
                        <div style={{ ...BC, fontSize: 8, fontWeight: 600, color: GOLD, letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 2 }}>{sub}</div>
                        <div style={{ ...BAR, fontSize: 11, color: W50, marginTop: 4, fontStyle: "italic" }}>{q}</div>
                      </div>
                    </div>
                  </a>
                  {i < arr.length - 1 && (
                    <div style={{ ...BC, fontSize: 14, color: "rgba(255,255,255,0.2)", flexShrink: 0, padding: "0 4px" }}>→</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Full Platform Demo — start here banner */}
          <a
            href="/demo-experience"
            style={{
              display: "block", textDecoration: "none", marginBottom: 48,
              background: `linear-gradient(135deg, rgba(43,138,110,0.18) 0%, rgba(10,15,46,0.6) 60%, rgba(201,168,76,0.10) 100%)`,
              border: `1px solid rgba(43,138,110,0.45)`,
              padding: "36px 36px 32px",
              position: "relative", overflow: "hidden",
              transition: "border-color 0.2s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(43,138,110,0.75)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(43,138,110,0.45)"; }}
          >
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: `linear-gradient(rgba(43,138,110,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(43,138,110,0.04) 1px, transparent 1px)`, backgroundSize: "32px 32px", pointerEvents: "none" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                <div style={{ flex: 1, minWidth: 280 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <span style={{ display: "inline-block", width: 22, height: 1.5, background: TEAL_LT, flexShrink: 0 }}/>
                    <span style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.4em", color: TEAL_LT, textTransform: "uppercase" }}>
                      Step 01 · What Does This Replace? · 9 Steps · No Login Required
                    </span>
                  </div>
                  <div style={{ ...CG, fontSize: "clamp(26px,3vw,38px)", fontWeight: 600, color: W, lineHeight: 1.15, marginBottom: 6 }}>
                    Full Platform Demo
                  </div>
                  <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", color: GOLD, textTransform: "uppercase", marginBottom: 14, opacity: 0.8 }}>
                    Best for: First conversation · C-suite · Category introduction
                  </div>
                  <p style={{ ...BAR, fontSize: 14, color: W70, lineHeight: 1.7, maxWidth: 560, margin: "0 0 20px" }}>
                    Answers the foundational question: why does the old operating model fail, and what does Readiness OS replace? Walks through the full platform — PREPARATION (how it works day-to-day) → RESPONSE (live 12-minute activation vs. 30-day old model) → ADVANCE (continuous learning). Every capability. One walkthrough.
                  </p>
                  <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                    {[
                      { v: "3 Phases", l: "PREPARATION · RESPONSE · ADVANCE" },
                      { v: "9 Steps", l: "Full capability walkthrough" },
                      { v: "3,600×", l: "Contrast shown live" },
                    ].map(({ v, l }) => (
                      <div key={v}>
                        <div style={{ ...BC, fontSize: 18, fontWeight: 700, color: TEAL_LT, letterSpacing: "0.04em", lineHeight: 1 }}>{v}</div>
                        <div style={{ ...BC, fontSize: 8, fontWeight: 600, letterSpacing: "0.2em", color: W50, textTransform: "uppercase", marginTop: 3 }}>{l}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ flexShrink: 0 }}>
                  <div style={{ ...BC, fontSize: 13, fontWeight: 700, letterSpacing: "0.14em", color: NAVY, background: TEAL_LT, padding: "14px 32px", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                    Begin Full Demo →
                  </div>
                </div>
              </div>
            </div>
          </a>

          {/* Complete Operating Model — Planned + Unplanned */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <span style={{ display: "inline-block", width: 22, height: 1.5, background: TEAL_LT, flexShrink: 0 }}/>
              <span style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.35em", color: TEAL_LT, textTransform: "uppercase" }}>Step 02 · Does It Cover Planned Work Too? · The Scope of the Platform</span>
            </div>
            <a
              href="/demo/planned-unplanned"
              style={{
                display: "block", textDecoration: "none",
                background: `linear-gradient(135deg, rgba(43,138,110,0.14) 0%, rgba(10,15,46,0.65) 50%, rgba(201,168,76,0.10) 100%)`,
                border: `1px solid rgba(43,138,110,0.4)`,
                borderLeft: `4px solid ${TEAL_LT}`,
                padding: "32px 36px",
                position: "relative", overflow: "hidden",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(43,138,110,0.7)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(43,138,110,0.4)"; }}
            >
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: `linear-gradient(rgba(43,138,110,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(43,138,110,0.03) 1px, transparent 1px)`, backgroundSize: "32px 32px", pointerEvents: "none" }} />
              <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
                <div style={{ flex: 1, minWidth: 280 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <span style={{ ...BC, fontSize: 8, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: TEAL_LT, background: "rgba(59,175,138,0.12)", border: "1px solid rgba(59,175,138,0.3)", padding: "3px 10px" }}>PLANNED</span>
                    <span style={{ ...BC, fontSize: 11, color: "rgba(255,255,255,0.4)" }}>+</span>
                    <span style={{ ...BC, fontSize: 8, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: "#f87171", background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)", padding: "3px 10px" }}>UNPLANNED</span>
                    <span style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>· 4 Protocols Active · 1 System</span>
                  </div>
                  <div style={{ ...CG, fontSize: "clamp(22px,2.8vw,34px)", fontWeight: 600, color: W, lineHeight: 1.15, marginBottom: 6 }}>
                    The Complete Operating Model
                  </div>
                  <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", color: GOLD, textTransform: "uppercase", marginBottom: 14, opacity: 0.8 }}>
                    Best for: Prospects who already use quarterly planning tools · Dissolves the "we already plan" objection
                  </div>
                  <p style={{ ...BAR, fontSize: 14, color: W70, lineHeight: 1.7, maxWidth: 560, margin: "0 0 20px" }}>
                    The same pre-staged infrastructure that responds to unplanned triggers also runs your planned quarterly initiatives — no mode-switching, no second tool. Q3 roadmap running. Ransomware fires at 4:23 AM. CEO makes one authorization. Both tracks execute. Neither stalls. The only demo in the industry that shows planned and unplanned work running simultaneously in one system.
                  </p>
                  <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                    {[
                      { v: "3", l: "Planned initiatives running" },
                      { v: "12 min", l: "Unplanned response activated" },
                      { v: "0", l: "Q3 initiatives disrupted" },
                    ].map(({ v, l }) => (
                      <div key={v}>
                        <div style={{ ...BC, fontSize: 20, fontWeight: 700, color: TEAL_LT, letterSpacing: "0.04em", lineHeight: 1 }}>{v}</div>
                        <div style={{ ...BC, fontSize: 8, fontWeight: 600, letterSpacing: "0.2em", color: W50, textTransform: "uppercase", marginTop: 3 }}>{l}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ flexShrink: 0, alignSelf: "center" }}>
                  <div style={{ ...BC, fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", color: NAVY, background: TEAL_LT, padding: "13px 28px", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                    See the Complete Model →
                  </div>
                </div>
              </div>
            </a>
          </div>

          {/* Master Demo — featured */}
          <div style={{ marginBottom: 64 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span style={{ display: "inline-block", width: 22, height: 1.5, background: GOLD, flexShrink: 0 }}/>
              <span style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.35em", color: GOLD, textTransform: "uppercase" }}>Step 03 · How Does It Execute? · Single Scenario · Every Phase · Full Depth</span>
            </div>
            <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", color: "rgba(201,168,76,0.65)", textTransform: "uppercase", marginBottom: 20, paddingLeft: 32 }}>
              Best for: Evaluation stage · PMO directors · COOs · Anyone who needs to see every step before deciding
            </div>
            <ScenarioCard
              id="activist"
              label="CEO · Board · Investor Relations"
              icon="📋"
              tagline="Elliott Management files a 13D at 2:47 AM demanding 3 board seats. In the old model: 30 days to mobilize. With Readiness OS: full activation in 12 minutes. Every phase — signals detected, protocol matched, war room opened, stakeholders notified, CEO authorizes, execution complete. The definitive proof of how the platform works."
              featured
            />
          </div>

          {/* ── Platform Showcase — bridge between featured demo and domain grids ── */}
          <ProductShowcase
            eyebrow="Platform in Action"
            headline="Watch 12-minute execution across all 3 strategic domains."
            image="/screenshots/deck_activation.jpg"
            imageAlt="Readiness OS Activation Console — Live Execution"
            urlPath="/demo-hub"
            urlTag="LIVE DEMO"
            tagColor="#2B8A6E"
            features={[
              { color: "#2B8A6E", label: "Growth & Positioning", description: "Competitor displacement, activist investor response, M&A — staged before the trigger fires." },
              { color: "#C9A84C", label: "Risk & Resilience", description: "Ransomware, FDA recall, supply chain, data breach — 12-minute execution chains, pre-built." },
              { color: "#4A90C4", label: "Transformation", description: "Go-to-market acceleration, workforce transformation — coordinated rollout across all stakeholders." },
            ]}
          />

          {/* Fix #1 — What is a Readiness Protocol? */}
          <div style={{ marginBottom: 56, padding: "28px 32px", background: "rgba(201,168,76,0.05)", border: `1px solid rgba(201,168,76,0.18)`, borderLeft: `3px solid ${GOLD}` }}>
            <div style={{ ...BC, fontSize: 8, fontWeight: 700, letterSpacing: "0.4em", color: GOLD, textTransform: "uppercase", marginBottom: 12 }}>What is a Readiness Protocol?</div>
            <p style={{ ...BAR, fontSize: 14, color: W70, lineHeight: 1.7, maxWidth: 720, margin: "0 0 16px" }}>
              A Readiness Protocol is a pre-built execution package. Before any trigger fires, every protocol already contains: <strong style={{ color: W }}>tasks defined and assigned</strong> to named owners, <strong style={{ color: W }}>budget pre-allocated</strong>, <strong style={{ color: W }}>stakeholders mapped</strong>, and an <strong style={{ color: W }}>execution brief written</strong>. When a trigger fires — or an executive decides to launch a planned initiative — the protocol activates in 12 minutes, not 30 days.
            </p>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              {[
                { v: "Tasks", l: "Pre-assigned to named owners" },
                { v: "Budget", l: "Pre-allocated, unlocks at authorization" },
                { v: "Stakeholders", l: "Mapped and notified automatically" },
                { v: "Brief", l: "Written before the trigger fires" },
              ].map(({ v, l }) => (
                <div key={v} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ ...BC, fontSize: 9, fontWeight: 800, color: GOLD, background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.25)", padding: "2px 8px", letterSpacing: "0.12em" }}>{v}</span>
                  <span style={{ ...BAR, fontSize: 11, color: W50 }}>{l}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14 }}>
              <a href="/how-it-executes" style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", color: GOLD, textDecoration: "none", textTransform: "uppercase", opacity: 0.8 }}>See the full execution chain →</a>
            </div>
          </div>

          {/* Growth & Positioning */}
          <div id="domain-growth">
            <DomainSection domainKey="growth" scenarios={SCENARIO_GROUPS.growth} />
          </div>

          {/* Risk & Resilience */}
          <div id="domain-resilience">
            <DomainSection domainKey="resilience" scenarios={SCENARIO_GROUPS.resilience} />
          </div>

          {/* Transformation */}
          <div id="domain-transformation">
            <DomainSection domainKey="transformation" scenarios={SCENARIO_GROUPS.transformation} />
          </div>

          {/* By Role */}
          <div style={{ marginBottom: 56 }}>
            <div style={{ borderLeft: `3px solid ${TEAL_LT}`, paddingLeft: 16, marginBottom: 20 }}>
              <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.4em", color: TEAL_LT, textTransform: "uppercase", marginBottom: 6 }}>
                By Executive Role
              </div>
              <div style={{ ...CG, fontSize: 32, fontWeight: 600, color: W, lineHeight: 1.1, marginBottom: 10 }}>
                Your Seat at the Table
              </div>
              <p style={{ ...BAR, fontSize: 13, color: W50, lineHeight: 1.7, maxWidth: 580, margin: 0 }}>
                Role-specific simulations show exactly what each executive experiences during an activation — their brief, their tasks, their decision moment, their authority.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {SCENARIO_GROUPS.roles.map(({ id, label, icon, tagline }) => (
                <ScenarioCard key={id} id={id} label={label} icon={icon} tagline={tagline} accentColor={TEAL_LT} />
              ))}
            </div>
          </div>

          {/* What every simulation shows */}
          <div style={{ background: GBG, border: `1px solid ${BD}`, padding: "36px 32px", marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <span style={{ display: "inline-block", width: 22, height: 1.5, background: GOLD, flexShrink: 0 }}/>
              <span style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.35em", color: GOLD, textTransform: "uppercase" }}>What Every Simulation Shows</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
              {[
                { step: "01", title: "The Situation Arrives", body: "Real scenario, real company, real time of day. Growth opportunity or disruption — the situation unfolds with full context and stakes." },
                { step: "02", title: "Signal Detection", body: "4 corroborating signals detected and scored live. Composite urgency score computed in seconds. Domain context applied." },
                { step: "03", title: "Protocol Matched", body: "The right Readiness Protocol pulled from 180 pre-staged options. Already written. Already waiting. Growth, resilience, or transformation." },
                { step: "04", title: "War Room Activated", body: "14 tasks pre-assigned. 6 stakeholders notified. Real-time status: STANDBY → ACKNOWLEDGED → EXECUTING." },
                { step: "05", title: "CEO Authorizes", body: "Executive brief delivered. One decision. Full authority. No committee required. The window stays open." },
                { step: "06", title: "12 Minutes Complete", body: "Live animated timeline. Full comparison with the 30-day old model. The 3,600× execution head start." },
                { step: "07", title: "The Outcome", body: "Deliverables generated. Post-activation intelligence. The fearless result of total preparation across every domain." },
              ].map(({ step, title, body }) => (
                <div key={step} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ ...BC, fontSize: 11, fontWeight: 700, color: GOLD, opacity: 0.55, flexShrink: 0, lineHeight: 1, marginTop: 3 }}>{step}</div>
                  <div>
                    <div style={{ ...BAR, fontSize: 13, fontWeight: 700, color: W, marginBottom: 4 }}>{title}</div>
                    <div style={{ ...BAR, fontSize: 12, color: W50, lineHeight: 1.5 }}>{body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{ textAlign: "center", padding: "56px 0 24px" }}>
            <div style={{ ...CG, fontSize: 32, fontStyle: "italic", color: GOLD, lineHeight: 1.4, marginBottom: 10 }}>
              "The response is ready before the trigger fires."
            </div>
            <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: W50, marginBottom: 36 }}>
              Preparation &nbsp;→&nbsp; Readiness &nbsp;→&nbsp; Fearless
            </div>
            <a
              href="/request-access"
              style={{ ...BC, background: GOLD, border: "none", color: NAVY, fontSize: 13, fontWeight: 700, letterSpacing: "0.14em", padding: "16px 48px", textDecoration: "none", textTransform: "uppercase", display: "inline-block" }}
            >
              Apply for Founding Partner Access →
            </a>
            <div style={{ ...BC, fontSize: 9, color: W25, letterSpacing: "0.2em", marginTop: 14, textTransform: "uppercase" }}>
              Founding Partner Program · 90-day validation · Startup to Fortune 500
            </div>
          </div>

        </div>
      </div>
    </PageLayout>
  );
}
