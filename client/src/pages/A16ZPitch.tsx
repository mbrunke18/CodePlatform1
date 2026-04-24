import { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const NAVY = "#0A0F2E";
const NAVY_BG = "#132558";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const OFF = "#F8F7F4";
const BORDER = "#E8E4DC";

const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
const BC: React.CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };

const GRID_BG: React.CSSProperties = {
  backgroundImage: `linear-gradient(rgba(201,168,76,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.08) 1px, transparent 1px)`,
  backgroundSize: "48px 48px",
};

function SlideLabel({ children, light = false }: { children: string; light?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
      <div style={{ width: 18, height: 1.5, background: GOLD, opacity: 0.7 }} />
      <span style={{ ...BC, fontSize: 10, fontWeight: 800, letterSpacing: "0.26em", textTransform: "uppercase" as const, color: light ? "rgba(255,255,255,0.5)" : GOLD }}>{children}</span>
      <div style={{ width: 18, height: 1.5, background: GOLD, opacity: 0.7 }} />
    </div>
  );
}

function GoldRule() {
  return <div style={{ width: 40, height: 2, background: GOLD, margin: "20px 0" }} />;
}

// ─── Slide 1: Cover ──────────────────────────────────────────────────────────
function CoverSlide() {
  return (
    <div style={{ ...GRID_BG, background: NAVY_BG, width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
      {/* orb top-right */}
      <div style={{ position: "absolute", top: -200, right: -200, width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, rgba(43,138,110,0.18) 0%, transparent 70%)`, pointerEvents: "none" }} />
      {/* orb bottom-left */}
      <div style={{ position: "absolute", bottom: -150, left: -150, width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, rgba(201,168,76,0.13) 0%, transparent 70%)`, pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 820, padding: "0 48px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 36 }}>
          <div style={{ width: 24, height: 1, background: GOLD, opacity: 0.5 }} />
          <span style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.4)" }}>a16z SpeedRun 007 · April 2026</span>
          <div style={{ width: 24, height: 1, background: GOLD, opacity: 0.5 }} />
        </div>

        <h1 style={{ ...CG, fontSize: "clamp(42px,5.5vw,80px)", fontWeight: 600, color: "#FFFFFF", lineHeight: 1.1, marginBottom: 28, letterSpacing: "-0.01em" }}>
          The strategic response is ready<br />before the trigger fires.
        </h1>

        <div style={{ width: 56, height: 2, background: GOLD, margin: "0 auto 28px" }} />

        <p style={{ fontSize: 18, color: "rgba(255,255,255,0.65)", fontWeight: 400, marginBottom: 52, lineHeight: 1.6 }}>
          Coordination infrastructure for the Fortune 1000.
        </p>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ ...BC, fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.9)", textTransform: "uppercase" as const }}>Martin Brunke</span>
            <div style={{ width: 1, height: 12, background: "rgba(255,255,255,0.2)" }} />
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>Founder & CEO</span>
            <div style={{ width: 1, height: 12, background: "rgba(255,255,255,0.2)" }} />
            <span style={{ fontSize: 13, color: GOLD, opacity: 0.8 }}>vaughnmartin.com</span>
          </div>
        </div>
      </div>

      {/* bottom wordmark */}
      <div style={{ position: "absolute", bottom: 32, left: 48 }}>
        <span style={{ ...BC, fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase" as const }}>VaughnMartin</span>
      </div>
      <div style={{ position: "absolute", bottom: 32, right: 48 }}>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.18)" }}>Readiness OS</span>
      </div>
    </div>
  );
}

// ─── Slide 2: The Problem ─────────────────────────────────────────────────────
function ProblemSlide() {
  const triggers = ["Cyber incidents", "M&A integrations", "Regulatory actions", "Activist campaigns", "Leadership transitions", "Competitive disruptions", "Market opportunity windows", "Supply chain disruptions"];
  return (
    <div style={{ background: "#FFFFFF", width: "100%", height: "100%", display: "flex", position: "relative" }}>
      {/* Left — dark panel with 30-day stat */}
      <div style={{ ...GRID_BG, background: NAVY_BG, width: "38%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 48px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", bottom: -100, left: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)" }} />
        <SlideLabel light>The Problem</SlideLabel>
        <div style={{ ...CG, fontSize: "clamp(72px,9vw,120px)", fontWeight: 700, color: "#FFFFFF", lineHeight: 0.9, marginBottom: 12 }}>30</div>
        <div style={{ ...BC, fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 20 }}>days</div>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.75, marginBottom: 28 }}>
          to mobilize a response inside the average Fortune 1000 enterprise when a strategic trigger fires.
        </p>
        <GoldRule />
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>
          By the time they move, the competitor has acted, the regulator has moved, or the window has closed.
        </p>
        <div style={{ marginTop: 32, padding: "16px 20px", border: `1px solid rgba(201,168,76,0.3)`, background: "rgba(201,168,76,0.06)" }}>
          <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 6 }}>Cost per trigger</div>
          <div style={{ ...CG, fontSize: 28, fontWeight: 600, color: "#FFFFFF" }}>$50M – $500M</div>
        </div>
      </div>

      {/* Right — trigger types */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 56px" }}>
        <p style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 20 }}>The Problem</p>
        <h2 style={{ ...CG, fontSize: "clamp(28px,3.2vw,44px)", fontWeight: 600, color: NAVY, lineHeight: 1.15, marginBottom: 16, maxWidth: 540 }}>
          Enterprise work was designed for a world without AI.<br />Nobody redesigned it.
        </h2>
        <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.75, marginBottom: 36, maxWidth: 480 }}>
          The 30-day mobilization cycle is not a bug. It is the operating model Fortune 1000 enterprises built before AI existed.
        </p>

        <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "#9CA3AF", marginBottom: 16 }}>Every Fortune 1000 faces multiple triggers per year</div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 24px" }}>
          {triggers.map(t => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 4, height: 4, background: TEAL, borderRadius: "50%", flexShrink: 0 }} />
              <span style={{ fontSize: 14, color: NAVY, fontWeight: 500 }}>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Slide 3: The Insight ─────────────────────────────────────────────────────
function InsightSlide() {
  return (
    <div style={{ background: OFF, width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "52px 64px" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <SlideLabel>The Insight</SlideLabel>
        <h2 style={{ ...CG, fontSize: "clamp(28px,3.5vw,48px)", fontWeight: 600, color: NAVY, lineHeight: 1.15, maxWidth: 740, margin: "0 auto 12px" }}>
          Championship football programs close the same gap every Saturday in 40 seconds.
        </h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, flex: 1, maxWidth: 1100, margin: "0 auto", width: "100%" }}>
        {/* Fortune 1000 column */}
        <div style={{ border: `1px solid ${BORDER}`, borderRight: "none", background: "#FFFFFF", padding: "40px 44px" }}>
          <div style={{ ...BC, fontSize: 10, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "#9CA3AF", marginBottom: 24 }}>Fortune 1000</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {[
              { label: "Trigger fires.", body: "The organization spends 30 days figuring out who should be in the room." },
              { label: "Zero preparation.", body: "Building a response from scratch. Every time. For every trigger. Across every domain." },
              { label: "Response begins.", body: "At week four, they're finally in the room. You've been executing for 29 days, 23 hours." },
              { label: "Result:", body: "The window closes before the response begins." },
            ].map((r, i) => (
              <div key={i}>
                <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 4 }}>{r.label}</div>
                <div style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.65 }}>{r.body}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Championship Football column */}
        <div style={{ ...GRID_BG, background: NAVY, border: `2px solid ${GOLD}`, padding: "40px 44px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(43,138,110,0.2) 0%, transparent 70%)" }} />
          <div style={{ ...BC, fontSize: 10, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 24 }}>Championship Football</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {[
              { label: "Trigger fires.", body: "The response is already built. Every situation owned. Every role rehearsed at full speed by Thursday." },
              { label: "Pre-staged execution.", body: "40 seconds from signal to coordinated execution across 11 roles." },
              { label: "Immediate deployment.", body: "The response was built during the preparation phase — it deploys in the first seconds." },
              { label: "Result:", body: "The preparation decided Saturday on Tuesday. The window opens and closes on your timeline." },
            ].map((r, i) => (
              <div key={i}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#FFFFFF", marginBottom: 4 }}>{r.label}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.65 }}>{r.body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 28 }}>
        <div style={{ display: "inline-block", padding: "12px 32px", background: GOLD, color: NAVY }}>
          <span style={{ ...BC, fontSize: 11, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase" as const }}>At week four, they're finally in the room. You've been executing for 29 days, 23 hours.</span>
        </div>
      </div>
    </div>
  );
}

// ─── Slide 4: The Product ─────────────────────────────────────────────────────
function ProductSlide() {
  const phases = [
    { key: "I", name: "IDENTIFY", stat: "248", statLabel: "data points", body: "Monitored every 15 minutes across 9 strategic domains. Nothing is improvised. Everything is pre-staged." },
    { key: "D", name: "DETECT", stat: "221", statLabel: "triggers", body: "Pattern recognition surfaces classified signals before peak pressure. Pre-wired to every strategic domain." },
    { key: "E", name: "EXECUTE", stat: "170", statLabel: "Readiness Protocols", body: "Pre-staged protocols deploy in 12 minutes — team, tasks, communications, decision rights." },
    { key: "A", name: "ADVANCE", stat: "100%+", statLabel: "net retention", body: "Close-out gate encodes learning. By activation 12, the Readiness Protocol is organization-authored — the mechanism behind net retention above 100%." },
  ];
  return (
    <div style={{ ...GRID_BG, background: NAVY_BG, width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "52px 64px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -200, right: -200, width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(43,138,110,0.15) 0%, transparent 70%)" }} />
      <div style={{ position: "absolute", bottom: -200, left: -200, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 70%)" }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <SlideLabel light>The Product</SlideLabel>
          <h2 style={{ ...CG, fontSize: "clamp(28px,3.2vw,46px)", fontWeight: 600, color: "#FFFFFF", lineHeight: 1.15, marginBottom: 10 }}>
            We didn't add AI to the old model.<br />We redesigned how strategic work flows.
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", maxWidth: 600, margin: "0 auto" }}>
            Readiness OS is the operating model above the AI stack every enterprise already owns.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2, marginBottom: 28 }}>
          {phases.map((p, i) => (
            <div key={i} style={{ background: i === 0 ? "rgba(255,255,255,0.06)" : i === 3 ? "rgba(43,138,110,0.15)" : "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderTop: `2px solid ${i === 3 ? TEAL : GOLD}`, padding: "28px 24px" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 16 }}>
                <span style={{ ...BC, fontSize: 32, fontWeight: 900, color: GOLD, lineHeight: 1 }}>{p.key}</span>
                <span style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.4)" }}>{p.name}</span>
              </div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ ...CG, fontSize: 36, fontWeight: 700, color: "#FFFFFF", lineHeight: 1 }}>{p.stat}</div>
                <div style={{ ...BC, fontSize: 9, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: GOLD, marginTop: 2 }}>{p.statLabel}</div>
              </div>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>{p.body}</p>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <div style={{ padding: "16px 24px", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.25)", textAlign: "center" }}>
            <span style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: GOLD }}>30 DAYS COMPRESSED TO 12 MINUTES</span>
          </div>
          <div style={{ padding: "16px 24px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", textAlign: "center" }}>
            <span style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: "rgba(255,255,255,0.7)" }}>3,600× EXECUTION HEAD START</span>
          </div>
        </div>

        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", textAlign: "center", marginTop: 16, lineHeight: 1.6 }}>
          The ADVANCE phase is where the platform becomes irreplaceable. Every activation encodes decision logic specific to this organization's failure modes — by activation 12, a competitor who buys the software starts at zero.
        </p>
      </div>
    </div>
  );
}

// ─── Slide 5: Independent Validation ─────────────────────────────────────────
function ValidationSlide() {
  const researchers = [
    {
      initials: "KH",
      name: "Dr. Kerry Huang",
      credentials: "Fortune 50 AVP · ESI Top 1% Researcher · Forbes Business Council · 408-firm governance study",
      color: TEAL,
      quote: "\"Martin is building the architecture that makes clarity possible before pressure arrives. The boundary Martin named — between what architecture can supply and what only human capacity can carry — is where the next decade of governance work sits.\"",
      source: "Public LinkedIn repost, April 2026",
    },
    {
      initials: "SD",
      name: "Scott DeJarnette, PhD",
      credentials: "Cybersecurity Strategist · CIO Advisor · Triple CCIE · Incident Response · M&A Integration",
      color: NAVY,
      quote: "\"Coordination speed is a precommitment problem, not a communication problem. The organization did not execute a plan. It assembled one under stress.\"",
      source: "Independent assessment",
    },
    {
      initials: "JH",
      name: "Jim Highsmith",
      credentials: "Co-author, Agile Manifesto · 40+ years of management thinking",
      color: GOLD,
      quote: "\"Process ran the last era. Judgment runs the next. The cycle reinforces itself until the organization needs judgment that is no longer there.\"",
      source: "Independent assessment",
    },
    {
      initials: "KS",
      name: "Dr. Kulneet Suri",
      credentials: "Harvard Alumna · Oxford Research Reviewer · Applied Behavioral Scientist",
      color: "#6B7280",
      quote: "\"Control produces compliance. Capability produces ownership. Performative governance is more dangerous than no governance at all.\"",
      source: "Independent assessment",
    },
  ];
  return (
    <div style={{ background: OFF, width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "48px 64px" }}>
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <SlideLabel>Independent Validation · April 2026</SlideLabel>
        <h2 style={{ ...CG, fontSize: "clamp(28px,3.2vw,46px)", fontWeight: 600, color: NAVY, lineHeight: 1.15, marginBottom: 8 }}>
          Four researchers. Four disciplines. One conclusion.
        </h2>
        <p style={{ fontSize: 14, color: "#6B7280" }}>That does not happen with a weak thesis.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, flex: 1 }}>
        {researchers.map((r, i) => (
          <div key={i} style={{ background: "#FFFFFF", border: `1px solid ${BORDER}`, borderTop: `3px solid ${r.color}`, padding: "24px 28px", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: r.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ ...BC, fontSize: 14, fontWeight: 800, color: r.color === GOLD ? NAVY : "#FFFFFF", letterSpacing: "0.06em" }}>{r.initials}</span>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 2 }}>{r.name}</div>
                <div style={{ fontSize: 11, color: "#9CA3AF", lineHeight: 1.5 }}>{r.credentials}</div>
              </div>
            </div>
            <p style={{ ...CG, fontSize: 16, fontStyle: "italic", color: "#374151", lineHeight: 1.65, flex: 1 }}>{r.quote}</p>
            <div style={{ ...BC, fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#9CA3AF", marginTop: 12 }}>{r.source}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Slide 6: Why Now ─────────────────────────────────────────────────────────
function WhyNowSlide() {
  const reasons = [
    {
      label: "Decision Density",
      headline: "The bottleneck shifted from speed to calibration.",
      body: "AI has simultaneously increased decision density and arrival speed for every Fortune 1000. Executives face more consequential decisions, faster, with less preparation time than any prior era. The bottleneck is no longer speed. It is calibration.",
      stat: "+47%", statLabel: "task scope increase with AI (HBR 2026)",
      color: TEAL,
    },
    {
      label: "The Microsoft Gap",
      headline: "Every enterprise has the AI stack. None have the operating model.",
      body: "Every Fortune 1000 has the Microsoft AI stack live. Copilot, Azure, Teams, M365. None have the operating model to use it at the speed it now operates. Readiness OS is the layer above your Microsoft investment — the architecture that turns AI capability into AI action.",
      stat: "0%", statLabel: "of enterprises have the coordination layer",
      color: GOLD,
    },
    {
      label: "Category Window",
      headline: "No category leader exists. The window is 18 months.",
      body: "No category leader exists for strategic coordination infrastructure. The window for category ownership is 18 months. We are already in it.",
      stat: "18mo", statLabel: "to define the category",
      color: NAVY,
    },
  ];
  return (
    <div style={{ ...GRID_BG, background: NAVY_BG, width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "52px 64px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -200, left: "30%", width: 800, height: 400, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(43,138,110,0.12) 0%, transparent 70%)" }} />

      <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <SlideLabel light>Why Now</SlideLabel>
          <h2 style={{ ...CG, fontSize: "clamp(26px,3.2vw,44px)", fontWeight: 600, color: "#FFFFFF", lineHeight: 1.15 }}>
            AI did not create our product.<br />AI created the market for our product.
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 2, flex: 1 }}>
          {reasons.map((r, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderTop: `3px solid ${r.color}`, padding: "32px 28px", display: "flex", flexDirection: "column" }}>
              <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: r.color, marginBottom: 16 }}>{r.label}</div>
              <h3 style={{ ...CG, fontSize: "clamp(18px,1.8vw,24px)", fontWeight: 600, color: "#FFFFFF", lineHeight: 1.2, marginBottom: 16 }}>{r.headline}</h3>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.75, flex: 1 }}>{r.body}</p>
              <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ ...CG, fontSize: 32, fontWeight: 700, color: r.color, lineHeight: 1 }}>{r.stat}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>{r.statLabel}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 24, padding: "14px 24px", background: "rgba(255,255,255,0.04)", borderLeft: `3px solid rgba(201,168,76,0.5)` }}>
          <p style={{ ...CG, fontSize: 15, fontStyle: "italic", color: "rgba(255,255,255,0.55)" }}>
            Jim Highsmith, co-author of the Agile Manifesto: "Process ran the last era. Judgment runs the next."
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Slide 7: The Moat ────────────────────────────────────────────────────────
function MoatSlide() {
  const moats = [
    {
      num: "01",
      title: "20 years of Fortune 1000 decision logic",
      body: "170 Readiness Protocols encoding operational decision architecture from Ford, Toyota, Lockheed Martin, Charles Schwab, Vantiv/Worldpay, Boyd Gaming, and Churchill Downs Incorporated. A competitor cannot buy the twenty years.",
      note: "Cannot be replicated with capital or compute",
    },
    {
      num: "02",
      title: "Compounding organizational intelligence",
      body: "Every activation makes the platform more specific to that organization's failure modes, decision preferences, and stakeholder dynamics. This is the mechanism behind net retention above 100%: the platform becomes more valuable with each use.",
      note: "Ownership Close-Out Gate + Recovery vs. Optimization debrief shipped April 2026 — built directly from Dr. Kerry Huang's 408-firm governance research",
    },
    {
      num: "03",
      title: "Embeddedness in the preparation rhythm",
      body: "When Readiness OS becomes the organizational rhythm of Fortune 1000 strategic preparation, it is not a vendor relationship. It is infrastructure. Infrastructure does not get replaced.",
      note: "Not a tool. An operating model.",
    },
  ];
  return (
    <div style={{ background: "#FFFFFF", width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "52px 64px" }}>
      <div style={{ marginBottom: 40 }}>
        <SlideLabel>The Moat</SlideLabel>
        <h2 style={{ ...CG, fontSize: "clamp(28px,3.2vw,48px)", fontWeight: 600, color: NAVY, lineHeight: 1.15, maxWidth: 720 }}>
          A competitor can rebuild the software in 12 months.<br />They cannot rebuild any of these.
        </h2>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
        {moats.map((m, i) => (
          <div key={i} style={{ display: "flex", gap: 32, padding: "28px 32px", border: `1px solid ${BORDER}`, borderLeft: `3px solid ${i === 0 ? GOLD : i === 1 ? TEAL : NAVY}`, background: "#FAFAF9", flex: 1 }}>
            <div style={{ flexShrink: 0 }}>
              <div style={{ ...BC, fontSize: 36, fontWeight: 900, color: i === 0 ? GOLD : i === 1 ? TEAL : NAVY, lineHeight: 1, opacity: 0.3 }}>{m.num}</div>
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: NAVY, marginBottom: 10 }}>{m.title}</h3>
              <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.75, marginBottom: 10 }}>{m.body}</p>
              <div style={{ ...BC, fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#9CA3AF" }}>{m.note}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Slide 8: The Model ───────────────────────────────────────────────────────
function ModelSlide() {
  const growthTiers = [
    { name: "READY", price: "$75K/yr", scope: "3 domains · 60 Readiness Protocols" },
    { name: "RESPONSIVE", price: "$150K/yr", scope: "6 domains · 120 Readiness Protocols" },
    { name: "ORCHESTRATED", price: "$250K/yr", scope: "Full platform · 170 Readiness Protocols" },
  ];
  return (
    <div style={{ background: OFF, width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "52px 64px" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <SlideLabel>The Model</SlideLabel>
        <h2 style={{ ...CG, fontSize: "clamp(28px,3.2vw,46px)", fontWeight: 600, color: NAVY, lineHeight: 1.15 }}>
          One platform. Two deployment paths.<br />No per-seat pricing.
        </h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, flex: 1 }}>
        {/* Enterprise Pilot */}
        <div style={{ ...GRID_BG, background: NAVY, padding: "40px 44px", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -100, right: -100, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)" }} />
          <div style={{ position: "relative", zIndex: 1, flex: 1 }}>
            <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>Enterprise Pilot · Fortune 1000</div>
            <div style={{ ...CG, fontSize: 52, fontWeight: 700, color: GOLD, lineHeight: 1, marginBottom: 4 }}>$75K</div>
            <div style={{ ...BC, fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", color: "rgba(255,255,255,0.5)", marginBottom: 28 }}>FLAT FEE · 90-DAY DEPLOYMENT</div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 12 }}>Delivers</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {["Full platform across selected domains", "Signal pipeline live — 248 data points", "Readiness Protocol library activated", "Executive team trained"].map(d => (
                  <div key={d} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 4, height: 4, background: TEAL, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{d}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 8 }}>Converts to</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>Annual license at $150K–$250K/yr based on scope</div>
              <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.25)" }}>
                <div style={{ fontSize: 12, color: GOLD, fontWeight: 600 }}>3 Founding Partner pilots in active conversation</div>
              </div>
            </div>
          </div>
        </div>

        {/* Growth Deployment */}
        <div style={{ background: "#FFFFFF", border: `1px solid ${BORDER}`, padding: "40px 44px", display: "flex", flexDirection: "column" }}>
          <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "#9CA3AF", marginBottom: 20 }}>Growth Deployment · PE-Backed & Mid-Market</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
            {growthTiers.map((t, i) => (
              <div key={i} style={{ padding: "20px 24px", border: `1px solid ${BORDER}`, borderLeft: `3px solid ${i === 2 ? TEAL : i === 1 ? GOLD : NAVY}`, background: i === 2 ? `rgba(43,138,110,0.03)` : "#FAFAF9" }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 6 }}>
                  <div style={{ ...BC, fontSize: 14, fontWeight: 800, letterSpacing: "0.1em", color: NAVY }}>{t.name}</div>
                  <div style={{ ...CG, fontSize: 22, fontWeight: 700, color: i === 2 ? TEAL : NAVY }}>{t.price}</div>
                </div>
                <div style={{ fontSize: 13, color: "#6B7280" }}>{t.scope}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24, padding: "16px 20px", background: OFF, border: `1px solid ${BORDER}` }}>
            <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.65 }}>
              Priced on deployment scope. The platform covers the organization or it doesn't. No per-seat pricing at any tier.
            </p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16, textAlign: "center", padding: "14px", background: `rgba(201,168,76,0.08)`, border: `1px solid rgba(201,168,76,0.2)` }}>
        <span style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: GOLD }}>ONE FORTUNE 1000 ANNUAL LICENSE = ONE GROWTH READY DEPLOYMENT. SAME PLATFORM, TWO MARKETS.</span>
      </div>
    </div>
  );
}

// ─── Slide 9: Traction / Why SpeedRun ────────────────────────────────────────
function TractionSlide() {
  const productMetrics = [
    "Live in production at vaughnmartin.com",
    "151 page components · 170 Readiness Protocols · 221 triggers",
    "Live signal pipeline · 248 data points · 15-minute cycles",
    "7 ecosystem integrations · 5 AI surfaces",
    "$75K pilot priced below procurement threshold · 90-day ROI",
  ];
  const validation = [
    "4 independent researchers publicly validated thesis",
    "Kerry Huang reposted to Fortune 50 network",
    "5 Fortune 500 advisors reviewing platform",
    "3 Founding Partner pilots in active conversation",
  ];
  const unlocks = [
    "Fortune 1000 executive network access",
    "Battle-tested operators covering commercial gaps",
    "Demo Day to 1,000+ early-stage investors",
    "Forcing function for full-time transition",
  ];
  return (
    <div style={{ background: "#FFFFFF", width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "52px 64px" }}>
      <div style={{ marginBottom: 36 }}>
        <SlideLabel>Traction · Why SpeedRun</SlideLabel>
        <h2 style={{ ...CG, fontSize: "clamp(28px,3.2vw,46px)", fontWeight: 600, color: NAVY, lineHeight: 1.15 }}>
          Shipped. Validated. Ready to scale.
        </h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, flex: 1 }}>
        {/* Left: Product + Validation */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ flex: 1, border: `1px solid ${BORDER}`, padding: "28px 32px" }}>
            <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: TEAL, marginBottom: 16 }}>Product</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {productMetrics.map(m => (
                <div key={m} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ width: 4, height: 4, background: TEAL, flexShrink: 0, marginTop: 6 }} />
                  <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>{m}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, border: `1px solid ${BORDER}`, padding: "28px 32px" }}>
            <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 16 }}>Validation</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {validation.map(v => (
                <div key={v} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ width: 4, height: 4, background: GOLD, flexShrink: 0, marginTop: 6 }} />
                  <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: SpeedRun */}
        <div style={{ ...GRID_BG, background: NAVY_BG, padding: "36px 40px", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -100, right: -100, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)" }} />
          <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 12 }}>What SpeedRun Unlocks</div>
            <div style={{ ...CG, fontSize: 48, fontWeight: 700, color: "#FFFFFF", lineHeight: 1, marginBottom: 6 }}>12</div>
            <div style={{ ...BC, fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", color: "rgba(255,255,255,0.5)", marginBottom: 24 }}>WEEKS IN SAN FRANCISCO</div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: 28 }}>
              to close 3 Founding Partners, hire commercial cofounder, and reach $1M ARR.
            </p>

            <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 14 }}>Why SR007</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
              {unlocks.map(u => (
                <div key={u} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ width: 4, height: 4, background: GOLD, flexShrink: 0, marginTop: 5 }} />
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>{u}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 24, padding: "14px 18px", border: `1px solid rgba(201,168,76,0.3)`, background: "rgba(201,168,76,0.08)" }}>
              <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 4 }}>Target ARR</div>
              <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: "#FFFFFF" }}>$1M</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Slide 10: The Founder ────────────────────────────────────────────────────
function FounderSlide() {
  const fortune1000 = ["Ford Motor Company", "Toyota", "Lockheed Martin", "Charles Schwab", "Vantiv / Worldpay", "Boyd Gaming", "Churchill Downs Incorporated"];
  return (
    <div style={{ background: "#FFFFFF", width: "100%", height: "100%", display: "flex", position: "relative" }}>
      {/* Left — dark panel */}
      <div style={{ ...GRID_BG, background: NAVY, width: "42%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 52px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", bottom: -100, right: -80, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(43,138,110,0.2) 0%, transparent 70%)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <SlideLabel light>The Founder</SlideLabel>
          <div style={{ ...CG, fontSize: "clamp(36px,4vw,60px)", fontWeight: 600, color: "#FFFFFF", lineHeight: 1.1, marginBottom: 6 }}>Martin Brunke</div>
          <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 28 }}>Founder & CEO · VaughnMartin</div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.35)", marginBottom: 12 }}>Fortune 1000 · 20 Years</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {fortune1000.map(c => (
                <div key={c} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 3, height: 3, background: TEAL, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{c}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.35)", marginBottom: 10 }}>Major College Football · 5 Years</div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
              Coaching at Stanford. The practice field where preparation architecture compressed 30-day organizational decisions into 40 seconds.
            </p>
          </div>
        </div>
      </div>

      {/* Right — the pattern */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 56px" }}>
        <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 20 }}>The Pattern</div>
        <h3 style={{ ...CG, fontSize: "clamp(24px,2.8vw,38px)", fontWeight: 600, color: NAVY, lineHeight: 1.2, marginBottom: 24 }}>
          Same coordination failure across 7 industries. Same solution already proven on the practice field.
        </h3>
        <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.8, marginBottom: 28 }}>
          The infrastructure nobody built for the boardroom.
        </p>

        <div style={{ padding: "24px 28px", background: OFF, border: `1px solid ${BORDER}`, borderLeft: `3px solid ${GOLD}`, marginBottom: 28 }}>
          <p style={{ ...CG, fontSize: 18, fontStyle: "italic", color: NAVY, lineHeight: 1.6 }}>
            "VaughnMartin is named for my father, Vaughn. The product carries his standard."
          </p>
          <div style={{ ...BC, fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#9CA3AF", marginTop: 10 }}>Martin Brunke</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { label: "Fortune 1000 experience", value: "20 yrs" },
            { label: "Industries spanned", value: "7" },
            { label: "Stanford football", value: "5 yrs" },
            { label: "Protocols encoded", value: "170" },
          ].map(s => (
            <div key={s.label} style={{ padding: "16px 20px", border: `1px solid ${BORDER}`, background: "#FFFFFF" }}>
              <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: NAVY }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Slide 11: Close ──────────────────────────────────────────────────────────
function CloseSlide() {
  return (
    <div style={{ ...GRID_BG, background: NAVY_BG, width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 900, height: 900, borderRadius: "50%", background: "radial-gradient(circle, rgba(43,138,110,0.1) 0%, transparent 60%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: -200, right: -200, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 860, padding: "0 48px" }}>
        <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.3)", marginBottom: 28 }}>Preparation · Readiness · Fearless</div>

        <h1 style={{ ...CG, fontSize: "clamp(48px,7vw,100px)", fontWeight: 600, color: "#FFFFFF", lineHeight: 1.05, marginBottom: 28, letterSpacing: "-0.01em" }}>
          We make enterprises<br />
          <span style={{ color: GOLD }}>fearless.</span>
        </h1>

        <div style={{ width: 56, height: 2, background: GOLD, margin: "0 auto 32px" }} />

        <p style={{ ...CG, fontSize: "clamp(18px,2vw,26px)", fontStyle: "italic", color: "rgba(255,255,255,0.65)", marginBottom: 52, lineHeight: 1.5 }}>
          The strategic response is ready before the trigger fires.
        </p>

        <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ ...BC, fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.9)", textTransform: "uppercase" as const }}>Martin Brunke</span>
            <div style={{ width: 1, height: 12, background: "rgba(255,255,255,0.2)" }} />
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>Founder & CEO</span>
          </div>
          <a href="mailto:pilot@vaughnmartin.com" style={{ fontSize: 14, color: GOLD, textDecoration: "none", opacity: 0.9 }}>pilot@vaughnmartin.com</a>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>vaughnmartin.com · April 2026</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Deck ────────────────────────────────────────────────────────────────
const SLIDES = [
  { component: CoverSlide, label: "Cover" },
  { component: ProblemSlide, label: "The Problem" },
  { component: InsightSlide, label: "The Insight" },
  { component: ProductSlide, label: "The Product" },
  { component: ValidationSlide, label: "Validation" },
  { component: WhyNowSlide, label: "Why Now" },
  { component: MoatSlide, label: "The Moat" },
  { component: ModelSlide, label: "The Model" },
  { component: TractionSlide, label: "Traction" },
  { component: FounderSlide, label: "The Founder" },
  { component: CloseSlide, label: "Close" },
];

const SLIDE_W = 960;
const SLIDE_H = 540;
const NAV_H = 44;

export default function A16ZPitch() {
  const [current, setCurrent] = useState(0);
  const [scale, setScale] = useState(1);
  const total = SLIDES.length;

  const prev = useCallback(() => setCurrent(p => Math.max(0, p - 1)), []);
  const next = useCallback(() => setCurrent(p => Math.min(total - 1, p + 1)), [total]);

  useEffect(() => {
    const updateScale = () => {
      const availW = window.innerWidth;
      const availH = window.innerHeight - NAV_H;
      setScale(Math.min(availW / SLIDE_W, availH / SLIDE_H));
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); next(); }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); prev(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  const SlideComponent = SLIDES[current].component;

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", background: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start" }}>
      {/* Slide stage — centers the scaled 16:9 canvas */}
      <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <div style={{
          width: SLIDE_W,
          height: SLIDE_H,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          position: "relative",
          flexShrink: 0,
          overflow: "hidden",
        }}>
          <SlideComponent />
        </div>
      </div>

      {/* Prev / Next — positioned relative to full viewport */}
      <button
        onClick={prev}
        disabled={current === 0}
        style={{ position: "fixed", left: 20, top: `calc(50% - ${NAV_H / 2}px)`, transform: "translateY(-50%)", zIndex: 100, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "50%", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", cursor: current === 0 ? "default" : "pointer", opacity: current === 0 ? 0.2 : 0.8, backdropFilter: "blur(8px)", transition: "opacity 0.2s" }}
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} color="#fff" />
      </button>
      <button
        onClick={next}
        disabled={current === total - 1}
        style={{ position: "fixed", right: 20, top: `calc(50% - ${NAV_H / 2}px)`, transform: "translateY(-50%)", zIndex: 100, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "50%", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", cursor: current === total - 1 ? "default" : "pointer", opacity: current === total - 1 ? 0.2 : 0.8, backdropFilter: "blur(8px)", transition: "opacity 0.2s" }}
        aria-label="Next slide"
      >
        <ChevronRight size={20} color="#fff" />
      </button>

      {/* Bottom bar — fixed height, always at bottom */}
      <div style={{ width: "100%", height: NAV_H, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", background: "rgba(10,15,46,0.92)", backdropFilter: "blur(12px)", borderTop: "1px solid rgba(255,255,255,0.08)", zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.3)" }}>VaughnMartin</span>
          <div style={{ width: 1, height: 10, background: "rgba(255,255,255,0.15)" }} />
          <span style={{ ...BC, fontSize: 9, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: GOLD }}>{SLIDES[current].label}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{ width: i === current ? 20 : 6, height: 6, borderRadius: 3, background: i === current ? GOLD : "rgba(255,255,255,0.2)", border: "none", cursor: "pointer", padding: 0, transition: "all 0.2s" }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <div style={{ ...BC, fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em" }}>
          {current + 1} / {total}
        </div>
      </div>
    </div>
  );
}
