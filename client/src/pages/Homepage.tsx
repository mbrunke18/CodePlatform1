import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { ExecuteIQLogo } from "@/components/ExecuteIQLogo";
import { ExecutionGapDiagram } from "@/components/ExecutionGapDiagram";

// ─── Brand Tokens (Spec v2.0 §0) ─────────────────────────────────────────────
const NAVY        = "#0A0F2E";
const NAVY_BG     = "#132558";
const GOLD        = "#C9A84C";
const GOLD_LIGHT  = "#DFC178";
const TEAL_LIGHT  = "#3BAF8A";
const IVORY       = "#F0EDE4";
const MID_NAVY    = "#141B45";
const FOOTER_NAVY = "#060B1E";
const RED_CRISIS  = "#C0392B";
const MUTED_STACK = "#3D4A6B";
const MUTED_DARK  = "#C8D4E8";
const MUTED_LIGHT = "#6B7280";
const BORDER      = "#E8E4DC";
const TEAL        = "#2B8A6E";

const GOLD_GRID_BG: React.CSSProperties = {
  backgroundImage: `linear-gradient(rgba(201,168,76,0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.09) 1px, transparent 1px)`,
  backgroundSize: "48px 48px",
};

const SECTION_DARK_BG: React.CSSProperties = {
  backgroundColor: NAVY_BG,
  backgroundImage: [
    `radial-gradient(ellipse 900px 700px at -5% 0%, rgba(43,138,110,0.15) 0%, transparent 55%)`,
    `radial-gradient(ellipse 1000px 800px at 105% 100%, rgba(201,168,76,0.11) 0%, transparent 55%)`,
    `linear-gradient(rgba(201,168,76,0.09) 1px, transparent 1px)`,
    `linear-gradient(90deg, rgba(201,168,76,0.09) 1px, transparent 1px)`,
  ].join(", "),
  backgroundSize: "100% 100%, 100% 100%, 48px 48px, 48px 48px",
};

const GEO: React.CSSProperties = { fontFamily: "Georgia, 'Times New Roman', serif" };
const DM: React.CSSProperties  = { fontFamily: "'DM Sans', 'Inter', sans-serif" };
const CONTAINER: React.CSSProperties = { maxWidth: 1100, margin: "0 auto", padding: "0 24px" };

function trackCTA(loc: string) {
  try {
    if (typeof window !== "undefined" && (window as any).dataLayer) {
      (window as any).dataLayer.push({ event: "pilot_cta_click", location: loc });
    }
  } catch (_) {}
}

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(20px)",
      transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: GOLD, marginBottom: 20 }}>
      {children}
    </div>
  );
}

function SectionMarker({ n }: { n: string }) {
  return (
    <div className="hp-section-marker" style={{
      position: "absolute", left: 24, top: 40,
      ...DM, fontSize: 12, fontWeight: 700, letterSpacing: "0.10em",
      color: GOLD, opacity: 0.75, userSelect: "none", pointerEvents: "none",
    }}>
      [{n}]
    </div>
  );
}

// ─── SECTION 1: Navigation ────────────────────────────────────────────────────
function HomepageNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <>
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "#fff",
        borderBottom: "1px solid rgba(10,15,46,0.10)",
        boxShadow: "0 1px 12px rgba(10,15,46,0.07)",
        height: 130,
        display: "flex", alignItems: "center",
      }}>
        <div style={{ ...CONTAINER, width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <ExecuteIQLogo variant="full" height={130} color="navy" />
          </Link>

          {/* Desktop nav — hidden below 768px via CSS */}
          <div className="hp-desktop-nav" style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <Link href="/how-it-works" style={{ ...DM, color: NAVY, fontSize: 14, fontWeight: 600, textDecoration: "none", opacity: 0.75 }}>How It Works</Link>
            <Link href="/platform-overview" style={{ ...DM, color: NAVY, fontSize: 14, fontWeight: 600, textDecoration: "none", opacity: 0.75 }}>Execution OS</Link>
            <Link href="/pricing" style={{ ...DM, color: NAVY, fontSize: 14, fontWeight: 600, textDecoration: "none", opacity: 0.75 }}>Pricing</Link>
            <Link href="/founder-story" style={{ ...DM, color: NAVY, fontSize: 14, fontWeight: 600, textDecoration: "none", opacity: 0.75 }}>About</Link>
            <Link
              href="/pilot-program"
              onClick={() => trackCTA("nav")}
              style={{
                ...DM, background: NAVY, color: "#fff", fontWeight: 700, fontSize: 14,
                padding: "10px 22px", borderRadius: 4, textDecoration: "none", letterSpacing: "0.04em",
                border: `2px solid ${GOLD}`,
              }}
            >
              Request a Pilot
            </Link>
          </div>

          {/* Hamburger — shown below 768px via CSS */}
          <button
            className="hp-hamburger"
            onClick={() => setMenuOpen(v => !v)}
            style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: 8, flexDirection: "column", gap: 5 }}
            aria-label="Open menu"
          >
            <span style={{ display: "block", width: 24, height: 2, background: NAVY, borderRadius: 2 }} />
            <span style={{ display: "block", width: 24, height: 2, background: NAVY, borderRadius: 2 }} />
            <span style={{ display: "block", width: 24, height: 2, background: NAVY, borderRadius: 2 }} />
          </button>
        </div>
      </nav>

      {/* Mobile full-screen overlay */}
      {menuOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: NAVY_BG,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 0,
        }}>
          <button
            onClick={() => setMenuOpen(false)}
            style={{ position: "absolute", top: 20, right: 24, background: "none", border: "none", cursor: "pointer", color: MUTED_DARK, fontSize: 28, lineHeight: 1 }}
            aria-label="Close menu"
          >
            ✕
          </button>
          {[
            { label: "How It Works", href: "/how-it-works" },
            { label: "Playbooks",    href: "/playbook-library" },
            { label: "Pricing",      href: "/pricing" },
            { label: "About",        href: "/founder-story" },
          ].map(item =>
            item.onPress
              ? <button key={item.label} onClick={item.onPress} style={{ ...DM, background: "none", border: "none", cursor: "pointer", color: "#fff", fontSize: 22, fontWeight: 500, padding: "16px 0", letterSpacing: "0.02em" }}>{item.label}</button>
              : <Link key={item.label} href={item.href!} onClick={() => setMenuOpen(false)} style={{ ...DM, color: "#fff", fontSize: 22, fontWeight: 500, padding: "16px 0", textDecoration: "none", letterSpacing: "0.02em" }}>{item.label}</Link>
          )}
          <Link
            href="/pilot-program"
            onClick={() => { setMenuOpen(false); trackCTA("nav_mobile"); }}
            style={{
              ...DM, background: GOLD, color: NAVY, fontWeight: 700, fontSize: 16,
              padding: "18px 24px", borderRadius: 4, textDecoration: "none",
              textAlign: "center", marginTop: 32, width: "calc(100% - 48px)", display: "block",
            }}
          >
            Request a Pilot
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hp-desktop-nav    { display: none !important; }
          .hp-hamburger      { display: flex !important; }
          .hp-stat-row       { flex-direction: column !important; gap: 24px !important; }
          .hp-stat-div       { display: none !important; }
          .hp-prob-grid      { flex-direction: column !important; }
          .hp-idea-grid      { grid-template-columns: 1fr !important; }
          .hp-footer-cols    { flex-direction: column !important; gap: 40px !important; text-align: center; }
          .hp-hero-h1        { font-size: 36px !important; }
          .hp-missing-h2     { font-size: 30px !important; }
          .hp-cta-h2         { font-size: 30px !important; }
          .hp-cta-btn        { display: block !important; width: calc(100% - 48px) !important; text-align: center; }
          .hp-sec            { padding: 64px 0 !important; }
          .hp-section-marker { display: none !important; }
          #contrast-moment   { height: 80vh !important; min-height: 480px !important; }
          .hp-ba-grid        { grid-template-columns: 1fr !important; }
          .hp-console-body   { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 375px) {
          .hp-hero-h1 { font-size: 28px !important; }
        }
      `}</style>
    </>
  );
}

// ─── SECTION 2: Hero ─────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section style={{
      ...SECTION_DARK_BG,
      position: "relative",
      minHeight: "100vh",
      display: "flex", alignItems: "center",
      paddingTop: 80, paddingBottom: 80,
    }}>
      <SectionMarker n="01" />
      <div style={{ ...CONTAINER, width: "100%", textAlign: "center" }}>
        <Reveal>
          <div style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: GOLD, marginBottom: 20 }}>
            EXECUTION INFRASTRUCTURE · FORTUNE 1000
          </div>

          {/* Built for — audience badges */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, marginBottom: 36 }}>
            {["CEOs & Boards", "C-Suite Executives", "Division Presidents", "Executive Leadership"].map(label => (
              <span key={label} style={{
                ...DM, fontSize: 11, fontWeight: 600, letterSpacing: "0.06em",
                padding: "5px 14px", borderRadius: 20,
                background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.28)",
                color: GOLD,
              }}>
                {label}
              </span>
            ))}
          </div>

          <h1 className="hp-hero-h1" style={{
            ...GEO, fontSize: 44, fontWeight: 700, color: "#fff",
            lineHeight: 1.3, maxWidth: 780, margin: "0 auto 20px",
          }}>
            <span style={{ color: GOLD_LIGHT, fontWeight: 900 }}>Days</span> just to reach a decision.
            <br />
            <span style={{ color: GOLD_LIGHT, fontWeight: 900 }}>More days</span> just to align the right people.
            <br />
            <span style={{ color: GOLD_LIGHT, fontWeight: 900 }}>Weeks</span> just to begin executing.
          </h1>

          <p style={{ ...GEO, fontSize: 22, fontStyle: "italic", color: "rgba(255,255,255,0.55)", maxWidth: 600, margin: "0 auto 16px", lineHeight: 1.4 }}>
            We collapse all three into 12 minutes.
          </p>

          <p style={{ ...DM, fontSize: 17, color: MUTED_DARK, maxWidth: 620, margin: "0 auto 40px", lineHeight: 1.7 }}>
            Execution OS is the coordination infrastructure Fortune 1000 enterprises use to deploy a full organizational response in under 12 minutes — pre-staged, pre-assigned, zero improvisation.
          </p>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
            <Link
              href="/pilot-program"
              onClick={() => trackCTA("hero")}
              style={{
                ...DM, background: GOLD, color: NAVY, fontWeight: 700, fontSize: 16,
                padding: "16px 40px", borderRadius: 4, textDecoration: "none",
                letterSpacing: "0.04em", transition: "all 0.2s ease", display: "inline-block",
              }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = GOLD_LIGHT; el.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = GOLD; el.style.transform = "translateY(0)"; }}
            >
              Request a Pilot
            </Link>
            <Link
              href="/12-minute-experience"
              onClick={() => trackCTA("hero_testdrive")}
              style={{
                ...DM, background: "none", border: `1.5px solid rgba(201,168,76,0.45)`, color: GOLD, fontWeight: 600, fontSize: 14,
                padding: "12px 32px", borderRadius: 4, textDecoration: "none",
                letterSpacing: "0.05em", transition: "all 0.2s ease", display: "inline-block",
              }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = GOLD; el.style.background = "rgba(201,168,76,0.07)"; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(201,168,76,0.45)"; el.style.background = "none"; }}
            >
              Take the 12-Minute Test Drive →
            </Link>
          </div>
        </Reveal>

        {/* Stat strip */}
        <Reveal delay={0.2}>
          <div className="hp-stat-row" style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 48,
            marginTop: 64, paddingTop: 40,
            borderTop: "1px solid rgba(201,168,76,0.15)",
          }}>
            {[
              { num: "170",    label: "Zero improvisation when the trigger fires",   sub: "Pre-staged playbooks across 9 strategic domains" },
              { num: "248+",   label: "Threats detected before they become crises",  sub: "Signals monitored every 15 minutes" },
              { num: "12 min", label: "Full organizational deployment",              sub: "Before the first emergency call ends" },
            ].map((s, i) => (
              <div key={s.num} style={{ display: "contents" }}>
                {i > 0 && <div className="hp-stat-div" style={{ width: 1, height: 40, background: "rgba(201,168,76,0.3)", flexShrink: 0 }} />}
                <div style={{ textAlign: "center", maxWidth: 200 }}>
                  <div style={{ ...GEO, fontSize: 32, fontWeight: 700, color: GOLD, lineHeight: 1 }}>{s.num}</div>
                  <div style={{ ...DM, fontSize: 13, fontWeight: 600, color: "#fff", marginTop: 8, lineHeight: 1.3 }}>{s.label}</div>
                  <div style={{ ...DM, fontSize: 11, color: MUTED_DARK, marginTop: 4, lineHeight: 1.4, opacity: 0.8 }}>{s.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── SECTION 3: The Problem ───────────────────────────────────────────────────
function ProblemSection() {
  const RED_BORDER = "#C0392B";
  const cards = [
    {
      num: "01", title: "The Trigger Fires", time: "T+0",
      timeLabel: "Seconds",
      body: "A competitor cuts prices. A regulator issues a mandate. A key executive resigns. The strategic moment is NOW — and it won't wait.",
      accent: GOLD, terminal: false,
    },
    {
      num: "02", title: "72 Hours Just to Assemble", time: "T+72hrs",
      timeLabel: "Days Lost",
      body: "Emergency calls. Competing priorities. No clear ownership. Three days of coordination pass before everyone is finally in the room — and nothing has been executed.",
      accent: GOLD, terminal: false,
    },
    {
      num: "03", title: "Execution Takes Weeks to Begin", time: "T+3 weeks",
      timeLabel: "Weeks Lost",
      body: "Now that everyone is aligned, the real delay starts. Roles assigned manually. Documents drafted from scratch. Budgets negotiated. Tasks staged one by one. Weeks pass before a single coordinated action lands.",
      accent: RED_BORDER, terminal: false,
    },
    {
      num: "04", title: "The Window Has Already Closed", time: "T+∞",
      timeLabel: "Advantage Gone",
      body: "Competitors responded weeks ago. The market moved. The board is asking questions. The opportunity — or the crisis — has already been decided. Without you.",
      accent: RED_BORDER, terminal: true,
    },
  ];

  return (
    <section className="hp-sec" style={{ background: IVORY, padding: "100px 0", position: "relative" }}>
      <SectionMarker n="02" />
      <div style={{ ...CONTAINER }}>
        <div className="hp-prob-grid" style={{ display: "flex", gap: 60, alignItems: "flex-start" }}>

          {/* Left */}
          <Reveal style={{ flex: "0 0 calc(50% - 30px)", maxWidth: "50%" }}>
            <SectionLabel>THE PROBLEM</SectionLabel>
            <h2 style={{ ...GEO, fontSize: 38, fontWeight: 700, color: "#0A0F2E", lineHeight: 1.2, marginBottom: 32 }}>
              The trigger fires in seconds.
              <br />
              Execution begins weeks later.
            </h2>
            <p style={{ ...DM, fontSize: 17, color: "#333", lineHeight: 1.7, marginBottom: 20 }}>
              It doesn't matter what kind of trigger it is. A cybersecurity breach. A competitor acquisition. A regulatory mandate. A supply chain failure. A leadership departure. A market shift. The strategic moment arrives instantly — and it demands an immediate, coordinated response.
            </p>

            {/* Trigger category tags */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: GOLD, marginBottom: 10 }}>
                Every situation. Every trigger. Same problem.
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {[
                  "Cybersecurity Breach", "Competitor Acquisition", "Regulatory Mandate",
                  "Supply Chain Failure", "Executive Departure", "Market Shift",
                  "ESG Crisis", "Financial Shock", "Geopolitical Risk",
                  "Talent Crisis", "Product Recall", "Reputational Threat",
                  "Technology Disruption", "M&A Pressure", "Customer Crisis",
                ].map((tag) => (
                  <span key={tag} style={{
                    ...DM, fontSize: 11, fontWeight: 600, color: "#444",
                    background: "#F0EDE8", border: `1px solid ${BORDER}`,
                    padding: "3px 10px", borderRadius: 2,
                  }}>{tag}</span>
                ))}
                <span style={{
                  ...DM, fontSize: 11, fontWeight: 700, color: GOLD,
                  background: "rgba(201,168,76,0.1)", border: `1px solid rgba(201,168,76,0.3)`,
                  padding: "3px 10px", borderRadius: 2,
                }}>170 playbooks · 20 categories · 248 data points</span>
              </div>
            </div>

            <p style={{ ...DM, fontSize: 17, color: "#333", lineHeight: 1.7, marginBottom: 20 }}>
              Yet every time, your organization spends 72 hours in emergency calls before anyone is aligned — then weeks more manually staging roles, documents, tasks, and budgets before a single coordinated action is taken.
            </p>
            <p style={{ ...DM, fontSize: 17, color: "#333", lineHeight: 1.7, marginBottom: 40 }}>
              By the time execution begins, the window has already moved.
            </p>

            {/* Timeline contrast callout */}
            <div style={{ borderTop: `2px solid ${GOLD}`, paddingTop: 24 }}>
              <div style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: GOLD, marginBottom: 16 }}>
                Without Execution OS
              </div>
              {[
                { label: "Trigger detected",    val: "Instantly" },
                { label: "Room assembled",       val: "72 hours" },
                { label: "Execution begins",     val: "3–4 weeks" },
                { label: "Competitive window",   val: "Closed" },
              ].map((row) => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 10, marginBottom: 10, borderBottom: `1px solid ${BORDER}` }}>
                  <span style={{ ...DM, fontSize: 14, color: "#555" }}>{row.label}</span>
                  <span style={{ ...DM, fontSize: 14, fontWeight: 700, color: row.val === "Closed" ? RED_BORDER : "#1A1A2E" }}>{row.val}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4, padding: "12px 16px", background: "#0A0F2E", borderRadius: 4 }}>
                <span style={{ ...DM, fontSize: 14, fontWeight: 700, color: GOLD }}>With Execution OS</span>
                <span style={{ ...GEO, fontSize: 20, fontWeight: 700, color: "#fff" }}>12 minutes</span>
              </div>
            </div>
          </Reveal>

          {/* Right — failure cards */}
          <div style={{ flex: "0 0 calc(50% - 30px)", maxWidth: "50%", display: "flex", flexDirection: "column", gap: 12 }}>
            {cards.map((c, i) => (
              <Reveal key={c.num} delay={i * 0.1}>
                <div style={{
                  background: c.terminal ? "rgba(192,57,43,0.04)" : "#fff",
                  border: `1px solid ${c.terminal ? "rgba(192,57,43,0.25)" : BORDER}`,
                  borderLeft: `3px solid ${c.accent}`,
                  padding: "20px 24px", borderRadius: 2, position: "relative", overflow: "hidden",
                }}>
                  <div style={{ ...GEO, fontSize: 42, fontWeight: 700, color: c.terminal ? "rgba(192,57,43,0.1)" : "rgba(192,57,43,0.09)", position: "absolute", bottom: 6, right: 14, lineHeight: 1, pointerEvents: "none", userSelect: "none" }}>
                    {c.num}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ ...DM, fontSize: 13, fontWeight: 700, color: c.terminal ? RED_BORDER : "#1A1A2E" }}>{c.title}</span>
                    <span style={{ ...DM, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: c.terminal ? RED_BORDER : GOLD, background: c.terminal ? "rgba(192,57,43,0.08)" : "rgba(201,168,76,0.12)", padding: "2px 8px", borderRadius: 2 }}>{c.timeLabel}</span>
                  </div>
                  <div style={{ ...DM, fontSize: 13, color: "#555", lineHeight: 1.6 }}>{c.body}</div>
                  {i < cards.length - 1 && (
                    <div style={{ ...DM, color: i >= 1 ? RED_BORDER : GOLD, fontSize: 14, marginTop: 10, textAlign: "center", opacity: 0.6 }}>↓</div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Natural transition → demo */}
        <div style={{ textAlign: "center", paddingTop: 52, paddingBottom: 8 }}>
          <Link href="/12-minute-experience" style={{ display: "inline-flex", alignItems: "center", gap: 10, color: NAVY, fontSize: 13, fontWeight: 700, borderBottom: `2px solid ${GOLD}`, paddingBottom: 3, textDecoration: "none" }}>
            There is a better way — experience the 12-minute alternative live →
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 3b: Execution Gap Diagram ───────────────────────────────────────
function ExecutionGapSection() {
  return (
    <section style={{ background: "#F0EDE4", padding: "80px 0 60px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#C9A84C", marginBottom: 12, fontFamily: "'DM Sans', Arial, sans-serif" }}>
            THE ARCHITECTURE BEHIND THE SPEED
          </div>
          <div style={{ fontSize: 36, fontWeight: 700, color: "#0A0F2E", fontFamily: "'Cormorant Garamond', Georgia, serif", lineHeight: 1.15 }}>
            72 Hours to Still Be Planning. 12 Minutes to Live Execution.
          </div>
          <div style={{ fontSize: 15, color: "#6B7280", marginTop: 14, maxWidth: 620, margin: "14px auto 0", fontFamily: "'DM Sans', Arial, sans-serif", lineHeight: 1.6 }}>
            The traditional enterprise spends 72 hours just getting the right people in the room. Execution OS delivers roles assigned, tasks staged, communications drafted, and execution already underway — in 12 minutes.
          </div>
        </div>
        <ExecutionGapDiagram />
      </div>
    </section>
  );
}

// ─── SECTION 4: The Missing Layer ────────────────────────────────────────────
function MissingLayerSection() {
  const rows = [
    { label: "STRATEGY",         sub: "Board Decisions · Planning · Vision",  hi: false },
    { label: "ERP / CRM / ITSM", sub: "SAP · Salesforce · ServiceNow",        hi: false },
    { label: "EXECUTION OS",     sub: "The Coordination Layer",                hi: true  },
    { label: "TASK MANAGEMENT",  sub: "Jira · Monday · Asana",                 hi: false },
    { label: "PEOPLE",           sub: "Your Organization",                     hi: false },
  ];

  return (
    <section className="hp-sec" style={{ ...SECTION_DARK_BG, padding: "120px 0", position: "relative" }}>
      <SectionMarker n="03" />
      <div style={{ ...CONTAINER, textAlign: "center" }}>
        <Reveal>
          <SectionLabel>THE MISSING LAYER</SectionLabel>
          <h2 className="hp-missing-h2" style={{ ...GEO, fontSize: 44, fontWeight: 700, color: "#fff", lineHeight: 1.2, maxWidth: 860, margin: "0 auto 32px" }}>
            ERP. CRM. ITSM. Strategy decks.
            <br />
            <span style={{ color: GOLD }}>Nobody built the coordination layer.</span>
          </h2>
          <p style={{ ...DM, fontSize: 17, color: MUTED_DARK, maxWidth: 700, margin: "0 auto 16px", lineHeight: 1.7 }}>
            The tools that manage tasks, relationships, and IT workflows all exist. What nobody built is the infrastructure that deploys your entire organization — with roles, tasks, documents, and budget — the moment a strategic trigger fires.
          </p>
          <p style={{ ...GEO, fontSize: 28, fontWeight: 700, color: GOLD, marginBottom: 64 }}>Until now.</p>
        </Reveal>

        <Reveal delay={0.2}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, maxWidth: 480, margin: "0 auto" }}>
            {rows.map((row, i) => (
              <div key={row.label} style={{ width: "100%" }}>
                <div style={{
                  width: "100%", padding: "14px 24px", borderRadius: 4, textAlign: "center",
                  background: row.hi ? GOLD : "rgba(61,74,107,0.4)",
                  border: row.hi ? "none" : `1px solid rgba(61,74,107,0.6)`,
                  boxShadow: row.hi ? "0 0 32px rgba(201,168,76,0.25)" : "none",
                }}>
                  <div style={{ ...DM, fontSize: 13, fontWeight: row.hi ? 700 : 500, letterSpacing: "0.08em", textTransform: "uppercase", color: row.hi ? NAVY : MUTED_DARK }}>
                    {row.label}
                  </div>
                  <div style={{ ...DM, fontSize: 11, color: row.hi ? "rgba(10,15,46,0.65)" : "rgba(200,212,232,0.55)", marginTop: 3 }}>
                    {row.sub}
                  </div>
                </div>
                {i < rows.length - 1 && (
                  <div style={{ display: "flex", justifyContent: "center", height: 8 }}>
                    <div style={{ width: 1, height: "100%", background: MUTED_STACK }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── SECTION 5: IDEA Framework ───────────────────────────────────────────────
function IDEASection() {
  const cards = [
    { letter: "I", title: "Identify", subtitle: "170 Pre-Staged Playbooks",        body: "Every scenario is mapped before the trigger fires. Roles, tasks, documents, and budget pre-assigned across 9 strategic domains.", accent: TEAL, wm: "rgba(43,138,110,0.06)" },
    { letter: "D", title: "Detect",   subtitle: "248+ Signals, Every 15 Minutes",  body: "AI monitors competitive, regulatory, financial, and operational signals continuously. The system surfaces the trigger before it becomes a crisis.", accent: GOLD, wm: "rgba(201,168,76,0.06)" },
    { letter: "E", title: "Execute",  subtitle: "12-Minute Full Deployment",        body: "One human approval. The system distributes roles, tasks, documents, and budgets to every stakeholder simultaneously. No coordination calls.", accent: TEAL, wm: "rgba(43,138,110,0.06)" },
    { letter: "A", title: "Advance",  subtitle: "Institutional Memory, Built In",   body: "Every activation closes the loop. What worked, what didn't, and what to pre-stage better next time — automatically fed back into your playbook library.", accent: GOLD, wm: "rgba(201,168,76,0.06)" },
  ];

  return (
    <section id="how-it-works" className="hp-sec" style={{ background: "#F8F7F4", padding: "100px 0", position: "relative" }}>
      <SectionMarker n="05" />

      <div style={{ ...CONTAINER }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <SectionLabel>HOW IT WORKS</SectionLabel>
            <h2 style={{ ...GEO, fontSize: 38, fontWeight: 700, color: "#0A0F2E", lineHeight: 1.2, marginBottom: 48 }}>
              Trigger fires. Organization deploys.
              <br />
              In 12 minutes.
            </h2>

            {/* Before / After comparison strip */}
            <div className="hp-ba-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, maxWidth: 820, margin: "0 auto", borderRadius: 6, overflow: "hidden", border: `1px solid ${BORDER}`, boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}>
              {/* Before */}
              <div style={{ background: "#fff", padding: "28px 32px", borderRight: `1px solid ${BORDER}` }}>
                <div style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: RED_CRISIS, marginBottom: 18 }}>Before</div>
                {[
                  "Emergency Slack threads and back-to-back calls",
                  "Improvised docs, unclear ownership, missed steps",
                  "72 hours just to get everyone in the room — zero execution taken",
                  "No memory — same crisis, same mistakes, next time",
                ].map(item => (
                  <div key={item} style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "flex-start" }}>
                    <span style={{ color: RED_CRISIS, fontSize: 14, marginTop: 2, flexShrink: 0 }}>✕</span>
                    <span style={{ ...DM, fontSize: 13, color: "#555", lineHeight: 1.55 }}>{item}</span>
                  </div>
                ))}
              </div>
              {/* After */}
              <div style={{ background: "#F4FBF8", padding: "28px 32px" }}>
                <div style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: TEAL, marginBottom: 18 }}>With Execution OS</div>
                {[
                  "Trigger detected — playbook activated automatically",
                  "Roles, tasks, and budget pre-assigned and deployed",
                  "Full org executing in under 12 minutes",
                  "Every activation feeds institutional memory forward",
                ].map(item => (
                  <div key={item} style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "flex-start" }}>
                    <span style={{ color: TEAL, fontSize: 14, marginTop: 2, flexShrink: 0 }}>✓</span>
                    <span style={{ ...DM, fontSize: 13, color: "#333", lineHeight: 1.55 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <div className="hp-idea-grid" style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24,
          maxWidth: 960, margin: "60px auto 0",
        }}>
          {cards.map((c, i) => (
            <Reveal key={c.letter} delay={i * 0.1}>
              <div
                style={{
                  background: "#fff", border: `1px solid ${BORDER}`, borderTop: `3px solid ${c.accent}`,
                  padding: 32, borderRadius: 2, boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                  position: "relative", overflow: "hidden", transition: "all 0.2s ease", cursor: "default",
                }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)"; }}
              >
                <div style={{ ...GEO, fontSize: 96, fontWeight: 700, color: c.wm, position: "absolute", bottom: 16, right: 24, lineHeight: 1, pointerEvents: "none", userSelect: "none" }}>
                  {c.letter}
                </div>
                <div style={{ ...GEO, fontSize: 28, fontWeight: 700, color: c.accent, marginBottom: 4 }}>{c.letter}</div>
                <div style={{ ...GEO, fontSize: 20, fontWeight: 700, color: "#1A1A2E", marginBottom: 6 }}>{c.title}</div>
                <div style={{ ...DM, fontSize: 12, fontWeight: 600, color: c.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>{c.subtitle}</div>
                <p style={{ ...DM, fontSize: 15, color: "#555", lineHeight: 1.65 }}>{c.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Natural transition → demo */}
        <div style={{ textAlign: "center", paddingTop: 48, paddingBottom: 0 }}>
          <Link href="/12-minute-experience" style={{ display: "inline-flex", alignItems: "center", gap: 10, color: TEAL, fontSize: 13, fontWeight: 700, borderBottom: `2px solid ${TEAL}`, paddingBottom: 3, textDecoration: "none" }}>
            Experience the IDEA Framework in real time — guided, live, no login required →
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 6: Platform Preview ─────────────────────────────────────────────
function PlatformPreviewSection() {
  const phases = ["IDENTIFY", "DETECT", "EXECUTE", "ADVANCE"];
  const tasks = [
    { role: "CFO", action: "Approve contingency budget release", done: true },
    { role: "COO", action: "Activate Tier-1 supplier protocol", done: true },
    { role: "General Counsel", action: "Review force majeure exposure", done: false },
    { role: "CMO", action: "Stage customer communication", done: false },
  ];
  return (
    <section style={{ background: "#F0EEE9", padding: "100px 0", position: "relative" }}>
      <SectionMarker n="06" />
      <div style={{ ...CONTAINER }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <SectionLabel>THE PLATFORM IN ACTION</SectionLabel>
            <h2 style={{ ...GEO, fontSize: 36, fontWeight: 700, color: NAVY, lineHeight: 1.25, marginBottom: 16 }}>
              What an executive sees at minute one.
            </h2>
            <p style={{ ...DM, fontSize: 16, color: "#4A5568", maxWidth: 600, margin: "0 auto" }}>
              If the playbook calls for a war room, it's already booked. If it calls for an all-hands, it's pre-distributed. Every role, task, approval, and escalation path is pre-staged — so when the trigger fires, the organization executes instead of improvises.
            </p>
          </div>
        </Reveal>

        {/* Console mockup */}
        <Reveal>
          <div style={{ maxWidth: 860, margin: "0 auto", borderRadius: 12, overflow: "hidden", boxShadow: "0 32px 80px rgba(10,15,46,0.22)", border: "1px solid rgba(10,15,46,0.1)" }}>
            {/* Console header */}
            <div style={{ background: NAVY, padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: TEAL_LIGHT, boxShadow: `0 0 8px ${TEAL_LIGHT}` }} />
                <span style={{ ...DM, fontSize: 13, color: GOLD, fontWeight: 700, letterSpacing: "0.08em" }}>LIVE ACTIVATION — PLAYBOOK #047</span>
              </div>
              <span style={{ ...DM, fontSize: 12, color: MUTED_DARK }}>Supply Chain Disruption · Tier-1 Supplier Failure</span>
            </div>

            {/* Phase bar */}
            <div style={{ background: "#0D1A3A", padding: "0 24px", display: "flex", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {phases.map((p, i) => (
                <div key={p} style={{
                  flex: 1, padding: "12px 0", textAlign: "center",
                  borderBottom: i < 2 ? `2px solid ${TEAL_LIGHT}` : i === 2 ? `2px solid ${GOLD}` : "2px solid rgba(255,255,255,0.1)",
                }}>
                  <span style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
                    color: i < 2 ? TEAL_LIGHT : i === 2 ? GOLD : MUTED_DARK }}>
                    {p}
                  </span>
                </div>
              ))}
            </div>

            {/* Body */}
            <div className="hp-console-body" style={{ background: "#0A1228", padding: "28px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {/* Left — task assignments */}
              <div>
                <div style={{ ...DM, fontSize: 11, color: MUTED_DARK, letterSpacing: "0.08em", marginBottom: 14, textTransform: "uppercase" }}>
                  Role Assignments — Auto-staged
                </div>
                {tasks.map((t) => (
                  <div key={t.role} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14, padding: "12px 14px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: `1px solid ${t.done ? "rgba(43,138,110,0.3)" : "rgba(255,255,255,0.06)"}` }}>
                    <div style={{ width: 18, height: 18, borderRadius: "50%", flexShrink: 0, marginTop: 1, background: t.done ? TEAL_LIGHT : "transparent", border: t.done ? "none" : `2px solid ${GOLD}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {t.done && <span style={{ color: "#fff", fontSize: 10, lineHeight: 1 }}>✓</span>}
                    </div>
                    <div>
                      <div style={{ ...DM, fontSize: 11, color: GOLD, fontWeight: 700, marginBottom: 3 }}>{t.role}</div>
                      <div style={{ ...DM, fontSize: 12, color: "#C8D4E8" }}>{t.action}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right — status panel */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ padding: "16px 18px", borderRadius: 8, background: "rgba(43,138,110,0.12)", border: "1px solid rgba(43,138,110,0.3)" }}>
                  <div style={{ ...DM, fontSize: 11, color: TEAL_LIGHT, letterSpacing: "0.08em", marginBottom: 6, textTransform: "uppercase" }}>Time to Full Deployment</div>
                  <div style={{ ...GEO, fontSize: 38, fontWeight: 700, color: "#fff", lineHeight: 1 }}>9:47</div>
                  <div style={{ ...DM, fontSize: 11, color: MUTED_DARK, marginTop: 4 }}>minutes elapsed · target: 12:00</div>
                </div>
                <div style={{ padding: "16px 18px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ ...DM, fontSize: 11, color: MUTED_DARK, letterSpacing: "0.08em", marginBottom: 10, textTransform: "uppercase" }}>Stakeholder Coverage</div>
                  {[{ label: "Notified", pct: 100, color: TEAL_LIGHT }, { label: "Briefed", pct: 82, color: GOLD }, { label: "Actioned", pct: 50, color: "#fff" }].map(r => (
                    <div key={r.label} style={{ marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ ...DM, fontSize: 11, color: MUTED_DARK }}>{r.label}</span>
                        <span style={{ ...DM, fontSize: 11, color: r.color, fontWeight: 700 }}>{r.pct}%</span>
                      </div>
                      <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                        <div style={{ width: `${r.pct}%`, height: "100%", background: r.color, borderRadius: 2, transition: "width 0.6s ease" }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ padding: "12px 18px", borderRadius: 8, background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", textAlign: "center" }}>
                  <div style={{ ...DM, fontSize: 11, color: GOLD, fontWeight: 700, letterSpacing: "0.06em" }}>EXECUTIVE ACTION REQUIRED</div>
                  <div style={{ ...DM, fontSize: 12, color: MUTED_DARK, marginTop: 4 }}>1 decision · estimated 90 seconds</div>
                </div>
              </div>
            </div>

            {/* Console footer */}
            <div style={{ background: "#060F1F", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ ...DM, fontSize: 11, color: MUTED_DARK }}>AI Execution Brief generated · 4 roles deployed · 0 manual coordination</span>
              <span style={{ ...DM, fontSize: 11, color: TEAL_LIGHT, fontWeight: 700 }}>● ON TRACK</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── SECTION 6b: Anonymous Executive Quote ────────────────────────────────────
function AnonymousQuoteSection() {
  return (
    <section style={{ background: NAVY, padding: "80px 0", position: "relative", overflow: "hidden" }}>
      {/* Subtle gold orb */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ ...CONTAINER, textAlign: "center", position: "relative", zIndex: 1 }}>
        <Reveal>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <div style={{ ...GEO, fontSize: 64, color: GOLD, opacity: 0.3, lineHeight: 0.8, marginBottom: 8, userSelect: "none" }}>"</div>
            <blockquote style={{ margin: 0, padding: 0 }}>
              <p style={{ ...GEO, fontSize: "clamp(18px, 2.2vw, 24px)", fontStyle: "italic", color: "#fff", lineHeight: 1.7, marginBottom: 32 }}>
                A major supplier filed for bankruptcy on a Wednesday morning. By Wednesday afternoon, we had alternative suppliers engaged, procurement re-routed, and operations continuity confirmed. Two years ago, that would have been a week of crisis meetings before we took a single coordinated action.
              </p>
              <footer>
                <div style={{ ...DM, fontSize: 14, fontWeight: 700, color: GOLD, letterSpacing: "0.04em" }}>
                  Chief Operating Officer
                </div>
                <div style={{ ...DM, fontSize: 12, color: MUTED_DARK, marginTop: 4 }}>
                  Fortune 200 Manufacturing Company &nbsp;·&nbsp; Name withheld at their request
                </div>
              </footer>
            </blockquote>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── SECTION 7: Credibility ───────────────────────────────────────────────────
const RESEARCH_FIRMS = [
  { firm: "McKinsey & Company", finding: "Organizations without execution infrastructure capture only 30% of expected strategy value — regardless of planning quality." },
  { firm: "IBM Institute for Business Value", finding: "60% of AI transformation failures trace to execution infrastructure gaps. The technology works. The coordination doesn't." },
  { firm: "World Economic Forum", finding: "Coordination lag — not capital constraints — is the #1 barrier to strategic agility in large enterprises globally." },
  { firm: "BCG Henderson Institute", finding: "Companies that can activate strategic responses within hours vs. days sustain 3× the competitive advantage over a 5-year horizon." },
  { firm: "Deloitte Insights", finding: "72% of C-suite leaders cite organizational responsiveness — not strategy quality — as their primary execution gap." },
  { firm: "Accenture Research", finding: "The difference between market leaders and laggards is execution velocity. Leaders respond to competitive triggers 8× faster." },
  { firm: "Gartner", finding: "By 2026, 75% of organizations that can't respond to strategic triggers within 4 hours will lose measurable market share." },
  { firm: "Google Cloud / Alphabet", finding: "Enterprise AI adoption stalls not at the model layer but at the coordination layer — the infrastructure to act on AI insight is absent." },
];

// ─── Microsoft Ecosystem Banner ───────────────────────────────────────────────
function MicrosoftEcosystemBanner() {
  const MONO: React.CSSProperties = { fontFamily: "'DM Mono','Geist Mono','Fira Code',monospace" };
  const msStack = [
    { name: 'Azure AI', icon: '◈', color: '#0078D4' },
    { name: 'Microsoft Teams', icon: '⬡', color: '#6264A7' },
    { name: 'Copilot Studio', icon: '◉', color: '#5BA3E8' },
    { name: 'Microsoft Entra', icon: '◎', color: '#107C10' },
    { name: 'Microsoft 365', icon: '◆', color: '#D83B01' },
    { name: 'Power Platform', icon: '◈', color: '#742774' },
  ];
  return (
    <section style={{ background: '#060B1E', padding: '56px 0', borderTop: '1px solid rgba(240,237,228,0.06)', borderBottom: '1px solid rgba(240,237,228,0.06)' }}>
      <div style={{ ...CONTAINER, maxWidth: 1100 }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{ ...MONO, fontSize: 9, letterSpacing: 4, color: GOLD, textTransform: 'uppercase', marginBottom: 14 }}>
              Enterprise Ecosystem Compatibility
            </div>
            <h3 style={{ ...GEO, fontSize: 26, fontWeight: 600, color: IVORY, lineHeight: 1.3, marginBottom: 12 }}>
              Built for the Microsoft enterprise stack.
            </h3>
            <p style={{ ...DM, fontSize: 15, color: 'rgba(240,237,228,0.5)', maxWidth: 560, margin: '0 auto' }}>
              When the trigger fires, Execution OS deploys inside the tools your executives already use — not alongside them.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 32 }}>
            {msStack.map(({ name, icon, color }) => (
              <div key={name} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '9px 16px', borderRadius: 6,
                background: 'rgba(240,237,228,0.04)',
                border: '1px solid rgba(240,237,228,0.1)',
                transition: 'all 0.2s ease',
              }}>
                <span style={{ color, fontSize: 12 }}>{icon}</span>
                <span style={{ ...MONO, fontSize: 10, color: 'rgba(240,237,228,0.65)', letterSpacing: 0.5 }}>{name}</span>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
            {[
              { label: 'Azure AI Ready', sublabel: 'Enterprise data residency + SOC 2', icon: '🔒' },
              { label: 'Teams War Room', sublabel: 'Notifications on activation', icon: '⚡' },
              { label: '4-Agent IDEA Framework', sublabel: 'Parallel AI — 340× faster', icon: '◈' },
              { label: 'Copilot Studio Connector', sublabel: 'Query playbooks from M365', icon: '◉' },
            ].map(({ label, sublabel, icon }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 18, marginBottom: 6 }}>{icon}</div>
                <div style={{ ...MONO, fontSize: 10, color: GOLD, letterSpacing: 1, marginBottom: 3 }}>{label}</div>
                <div style={{ ...DM, fontSize: 12, color: 'rgba(240,237,228,0.35)' }}>{sublabel}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function CredibilitySection() {
  const outcomes = [
    { stat: "12 min", label: "Median time from trigger to full org deployment" },
    { stat: "0 hrs",  label: "Executive coordination overhead required" },
    { stat: "94%",    label: "Playbook phases completed within target window" },
  ];
  return (
    <section style={{ background: MID_NAVY, padding: "96px 0 80px", position: "relative", overflow: "hidden" }}>
      <SectionMarker n="07" />
      {/* Subtle grid overlay */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.04) 1px,transparent 1px)", backgroundSize: "48px 48px", pointerEvents: "none" }} />
      <div style={{ ...CONTAINER }}>
        <Reveal>
          {/* Label */}
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 32, height: 1, background: "rgba(201,168,76,0.4)" }} />
              <span style={{ ...DM, fontSize: 9, fontWeight: 700, letterSpacing: "0.35em", textTransform: "uppercase" as const, color: "rgba(201,168,76,0.6)" }}>External Validation</span>
              <div style={{ width: 32, height: 1, background: "rgba(201,168,76,0.4)" }} />
            </div>
            <h2 style={{ ...GEO, fontSize: "clamp(26px,3.5vw,38px)", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: 12 }}>
              15 independent research organizations.<br />
              <em style={{ color: GOLD, fontStyle: "italic" }}>All reached the same conclusion.</em>
            </h2>
            <p style={{ ...DM, fontSize: 15, color: MUTED_DARK, maxWidth: 560, margin: "0 auto" }}>
              The missing layer isn't better strategy. It isn't more AI. It's the infrastructure to execute — fast, coordinated, without improvisation.
            </p>
          </div>

          {/* Research firm cards — 4-column grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: 64 }}>
            {RESEARCH_FIRMS.map((r) => (
              <div key={r.firm} style={{ padding: "24px 20px", background: "rgba(10,15,46,0.6)", transition: "background 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.07)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(10,15,46,0.6)"; }}>
                <div style={{ ...DM, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 10 }}>{r.firm}</div>
                <p style={{ ...DM, fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.65, fontStyle: "italic" }}>"{r.finding}"</p>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{ width: 48, height: 1, background: "rgba(255,255,255,0.08)", margin: "0 auto 56px" }} />

          {/* Outcome metrics */}
          <div style={{ display: "flex", justifyContent: "center", gap: 0, marginBottom: 56, flexWrap: "wrap" }}>
            {outcomes.map((o, i) => (
              <div key={o.stat} style={{
                flex: "1 1 200px", padding: "32px 40px",
                borderRight: i < outcomes.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
                textAlign: "center",
              }}>
                <div style={{ ...GEO, fontSize: 44, fontWeight: 700, color: GOLD, lineHeight: 1, marginBottom: 10 }}>{o.stat}</div>
                <div style={{ ...DM, fontSize: 13, color: MUTED_DARK, lineHeight: 1.5, maxWidth: 180, margin: "0 auto" }}>{o.label}</div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{ width: 48, height: 1, background: "rgba(255,255,255,0.08)", margin: "0 auto 48px" }} />

          {/* Founder story */}
          <div style={{ textAlign: "center" }}>
            <p style={{ ...DM, fontSize: 12, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.35)", marginBottom: 24 }}>
              Built by someone who ran execution at Ford · Lockheed Martin · Toyota · Charles Schwab · Vantiv/Worldpay · Boyd Gaming
            </p>
            <blockquote style={{ maxWidth: 680, margin: "0 auto", padding: 0 }}>
              <p style={{ ...GEO, fontSize: 20, fontStyle: "italic", color: "#fff", lineHeight: 1.65, marginBottom: 16 }}>
                "After the fifth company I stopped being patient.
                <br />
                I built the infrastructure nobody else would."
              </p>
              <footer style={{ ...DM, fontSize: 13, color: GOLD, fontWeight: 600 }}>
                — Martin Brunke, Founder
              </footer>
            </blockquote>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── SECTION 8: Primary CTA ───────────────────────────────────────────────────
function CTASection() {
  return (
    <section className="hp-sec" style={{ ...SECTION_DARK_BG, padding: "120px 0", position: "relative" }}>
      <SectionMarker n="08" />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
        <Reveal>
          <h2 className="hp-cta-h2" style={{ ...GEO, fontSize: 44, fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: 24 }}>
            At <span style={{ color: RED_CRISIS }}>72 hours</span>, they're
            {" "}finally in the room.
            <br />
            You've been executing for{" "}
            <span style={{ color: GOLD }}>71 hours</span>.
          </h2>
          <p style={{ ...DM, fontSize: 17, color: MUTED_DARK, maxWidth: 580, margin: "0 auto 16px", lineHeight: 1.7 }}>
            We're selecting 3–5 pilot partners this quarter. The organizations that move first build an execution advantage their competitors will spend years trying to close.
          </p>
          <p style={{ ...DM, fontSize: 15, color: MUTED_DARK, maxWidth: 480, margin: "0 auto 40px", lineHeight: 1.6, opacity: 0.75 }}>
            The conversation is 30 minutes.
          </p>
          <div>
            <Link
              href="/pilot-program"
              onClick={() => trackCTA("cta_section")}
              className="hp-cta-btn"
              style={{
                ...DM, background: GOLD, color: NAVY, fontWeight: 700, fontSize: 18,
                padding: "20px 56px", borderRadius: 4, textDecoration: "none",
                letterSpacing: "0.04em", display: "inline-block", transition: "all 0.2s ease",
              }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = GOLD_LIGHT; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 8px 32px rgba(201,168,76,0.3)"; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = GOLD; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}
            >
              Request a Pilot
            </Link>
          </div>
          <p style={{ ...DM, fontSize: 13, color: MUTED_LIGHT, marginTop: 20, opacity: 0.6 }}>
            Pilot pricing available · No long-term commitment required
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ─── SECTION 8: Footer ───────────────────────────────────────────────────────
function HomepageFooter() {
  return (
    <footer style={{ background: FOOTER_NAVY, borderTop: "1px solid rgba(201,168,76,0.2)", padding: "60px 0 40px" }}>
      <div style={{ ...CONTAINER }}>
        <div className="hp-footer-cols" style={{ display: "flex", gap: 48, marginBottom: 40 }}>

          {/* Brand */}
          <div style={{ flex: "0 0 280px" }}>
            <div style={{ marginBottom: 16 }}>
              <ExecuteIQLogo variant="full" height={80} color="white" />
            </div>
            <p style={{ ...GEO, fontStyle: "italic", fontSize: 16, color: GOLD_LIGHT, marginBottom: 16 }}>We Make Enterprises Fearless.</p>
            <p style={{ ...DM, fontSize: 12, color: MUTED_LIGHT }}>© 2026 VaughnMartin. All rights reserved.</p>
          </div>

          {/* Product */}
          <div style={{ flex: 1 }}>
            <div style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: GOLD, marginBottom: 20 }}>PRODUCT</div>
            {[
              { label: "How It Works",   href: "/how-it-works" },
              { label: "Playbooks",      href: "/playbook-library" },
              { label: "Pricing",        href: "/pricing" },
              { label: "Request a Pilot", href: "/pilot-program" },
            ].map(l => (
              <Link key={l.label} href={l.href} style={{ ...DM, display: "block", color: MUTED_DARK, fontSize: 14, padding: "4px 0", textDecoration: "none" }}>{l.label}</Link>
            ))}
          </div>

          {/* Company */}
          <div style={{ flex: 1 }}>
            <div style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: GOLD, marginBottom: 20 }}>COMPANY</div>
            {[
              { label: "About",              href: "/founder-story" },
              { label: "vaughnmartin.com",   href: "/" },
              { label: "LinkedIn",           href: "https://linkedin.com/company/vaughnmartin", external: true },
            ].map(l => (
              l.external
                ? <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" style={{ ...DM, display: "block", color: MUTED_DARK, fontSize: 14, padding: "4px 0", textDecoration: "none" }}>{l.label}</a>
                : <Link key={l.label} href={l.href!} style={{ ...DM, display: "block", color: MUTED_DARK, fontSize: 14, padding: "4px 0", textDecoration: "none" }}>{l.label}</Link>
            ))}
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24, textAlign: "center" }}>
          <p style={{ ...DM, fontSize: 11, color: MUTED_LIGHT }}>
            VaughnMartin · Execution OS · Built for Fortune 1000 · Confidential
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Scroll depth analytics (Spec §11) ───────────────────────────────────────
function useScrollDepth() {
  useEffect(() => {
    const fired = new Set<number>();
    const handler = () => {
      const total = document.body.scrollHeight - window.innerHeight;
      if (total <= 0) return;
      const pct = Math.round((window.scrollY / total) * 100);
      [25, 50, 75, 100].forEach(t => {
        if (pct >= t && !fired.has(t)) {
          fired.add(t);
          try { if ((window as any).dataLayer) (window as any).dataLayer.push({ event: "scroll_depth", percent: t }); } catch (_) {}
        }
      });
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
}

// ─── SECTION 3: Cinematic Contrast Moment ────────────────────────────────────
function ContrastMomentSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setAnimated(true); obs.disconnect(); }
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const t = (delay: number, dur = 0.6): React.CSSProperties => ({
    transition: `opacity ${dur}s ease ${delay}s, transform ${dur}s ease ${delay}s`,
  });

  return (
    <section
      id="contrast-moment"
      ref={ref}
      style={{
        ...SECTION_DARK_BG,
        position: "relative",
        height: "100vh",
        minHeight: 520,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <SectionMarker n="04" />
      <div style={{ textAlign: "center", position: "relative", zIndex: 1, padding: "0 24px" }}>

        {/* 72 — fades out */}
        <div
          className="cm-stat-72"
          style={{
            ...GEO,
            fontSize: "clamp(80px, 20vw, 180px)",
            fontWeight: 700,
            color: RED_CRISIS,
            lineHeight: 1,
            opacity: animated ? 0.15 : 1,
            transform: animated ? "scale(0.4)" : "scale(1)",
            ...t(1.6),
          }}
        >
          72 hrs
        </div>

        {/* Label for 72 */}
        <div
          style={{
            ...DM, fontSize: 14, color: MUTED_DARK, marginTop: 12, letterSpacing: "0.06em",
            textTransform: "uppercase",
            opacity: animated ? 0 : 1,
            ...t(0.8, 0.5),
          }}
        >
          Just to assemble. Execution hasn't started.
        </div>

        {/* 12 min — builds in */}
        <div
          className="cm-stat-12"
          style={{
            ...GEO,
            fontSize: "clamp(80px, 20vw, 180px)",
            fontWeight: 700,
            color: TEAL_LIGHT,
            lineHeight: 1,
            marginTop: 8,
            opacity: animated ? 1 : 0,
            transform: animated ? "scale(1)" : "scale(0.6)",
            ...t(2.0),
          }}
        >
          12 min
        </div>

        {/* Label for 12 */}
        <div
          style={{
            ...DM, fontSize: 14, color: MUTED_DARK, marginTop: 12, letterSpacing: "0.06em",
            textTransform: "uppercase",
            opacity: animated ? 1 : 0,
            ...t(2.4, 0.5),
          }}
        >
          Full organizational execution underway
        </div>

        {/* Tagline */}
        <div
          style={{
            ...GEO,
            fontStyle: "italic",
            fontSize: "clamp(16px, 2vw, 22px)",
            color: "#fff",
            marginTop: 48,
            opacity: animated ? 1 : 0,
            ...t(2.8, 0.5),
          }}
        >
          The difference is infrastructure.
        </div>

        {/* Scroll chevron */}
        <div
          style={{
            marginTop: 56,
            opacity: animated ? 1 : 0,
            ...t(3.4, 0.5),
          }}
        >
          <div
            className="cm-chevron"
            style={{
              display: "inline-block",
              color: GOLD,
              fontSize: 22,
              animation: animated ? "cm-pulse 1.4s ease-in-out infinite" : "none",
            }}
          >
            ↓
          </div>
        </div>
      </div>

      <style>{`
        @keyframes cm-pulse {
          0%, 100% { opacity: 0.5; transform: translateY(0); }
          50%       { opacity: 1;   transform: translateY(6px); }
        }
        @media (max-width: 768px) {
          #contrast-moment .cm-stat-72 { opacity: 0.15 !important; transform: scale(0.4) !important; transition: none !important; }
          #contrast-moment .cm-stat-12 { opacity: 1   !important; transform: scale(1)   !important; transition: none !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          #contrast-moment * { transition: none !important; animation: none !important; }
          #contrast-moment .cm-stat-72 { opacity: 0.15 !important; transform: scale(0.4) !important; }
          #contrast-moment .cm-stat-12 { opacity: 1   !important; transform: scale(1)   !important; }
        }
      `}</style>
    </section>
  );
}

// ─── Personalized ROI Calculator Section ──────────────────────────────────────
const REV_BRACKETS = [
  { label: '$1B – $5B', execRate: 650, revenueRiskPct: 0.003, label2: '$1B–5B' },
  { label: '$5B – $25B', execRate: 900, revenueRiskPct: 0.0035, label2: '$5B–25B' },
  { label: '$25B – $100B', execRate: 1200, revenueRiskPct: 0.004, label2: '$25B–100B' },
  { label: '$100B+', execRate: 1800, revenueRiskPct: 0.005, label2: '$100B+' },
];
const INDUSTRIES = ['Financial Services', 'Healthcare / Pharma', 'Technology', 'Manufacturing', 'Retail / Consumer', 'Energy & Utilities', 'Industrials', 'Aerospace & Defense'];
const EXEC_COUNTS = [{ label: '50–200 executives', val: 125 }, { label: '200–500 executives', val: 350 }, { label: '500–1,000 executives', val: 750 }, { label: '1,000+ executives', val: 1200 }];
const SCENARIO_COUNTS = [{ label: '2–5 / year', val: 3.5 }, { label: '5–12 / year', val: 8.5 }, { label: '12–25 / year', val: 18 }, { label: '25+ / year', val: 32 }];

function fmt(n: number) { if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`; if (n >= 1e6) return `$${Math.round(n / 1e6)}M`; return `$${Math.round(n / 1e3)}K`; }

function PersonalizedROISection() {
  const ref = useRef<HTMLElement>(null);
  const [animated, setAnimated] = useState(false);
  const [revIdx, setRevIdx] = useState(1);
  const [industry, setIndustry] = useState(INDUSTRIES[0]);
  const [execIdx, setExecIdx] = useState(1);
  const [scenIdx, setScenIdx] = useState(1);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setAnimated(true); }, { threshold: 0.1 });
    obs.observe(el); return () => obs.disconnect();
  }, []);

  const rb = REV_BRACKETS[revIdx];
  const execCount = EXEC_COUNTS[execIdx].val;
  const scenYear = SCENARIO_COUNTS[scenIdx].val;
  const execsPerCrisis = Math.min(12, Math.round(execCount * 0.025));
  const hoursWithout = execsPerCrisis * 18;
  const hoursWith = execsPerCrisis * 0.25;
  const hoursSaved = hoursWithout - hoursWith;
  const execTimeSavedPerScen = hoursSaved * rb.execRate;
  const revAtRisk = (revIdx === 0 ? 2e9 : revIdx === 1 ? 12e9 : revIdx === 2 ? 50e9 : 200e9) * rb.revenueRiskPct;
  const revProtected = revAtRisk * 0.68;
  const valPerScen = execTimeSavedPerScen + revProtected;
  const annualVal = valPerScen * scenYear;
  const speed = '340x';

  const selStyle = (active: boolean): React.CSSProperties => ({
    fontSize: 12, fontWeight: active ? 700 : 500, padding: "8px 16px", cursor: "pointer",
    background: active ? GOLD : "rgba(255,255,255,0.06)",
    color: active ? NAVY : MUTED_DARK,
    border: `1px solid ${active ? GOLD : "rgba(255,255,255,0.12)"}`,
    transition: "all 0.18s ease",
  });

  return (
    <section ref={ref} style={{ background: MID_NAVY, padding: "88px 0", borderTop: `1px solid rgba(201,168,76,0.15)` }}>
      <div style={CONTAINER}>
        <div style={{ textAlign: "center", marginBottom: 52, opacity: animated ? 1 : 0, transition: "opacity 0.7s ease" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 24, height: 1, background: GOLD }} />
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: GOLD }}>Execution ROI Calculator</span>
            <div style={{ width: 24, height: 1, background: GOLD }} />
          </div>
          <h2 style={{ ...GEO, fontSize: "clamp(26px,3.5vw,40px)", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: 12 }}>
            What Is Slow Execution<br />
            <em style={{ fontStyle: "italic", color: GOLD }}>Costing Your Organization?</em>
          </h2>
          <p style={{ ...DM, fontSize: 15, color: MUTED_DARK, maxWidth: 500, margin: "0 auto" }}>
            Configure your organization profile and see your personalized annual value from 12-minute execution.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, opacity: animated ? 1 : 0, transition: "opacity 0.7s ease 0.2s" }}>
          {/* Inputs */}
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 28 }}>
            {/* Revenue */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 10 }}>Annual Revenue</div>
              <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6 }}>
                {REV_BRACKETS.map((r, i) => (
                  <button key={r.label} onClick={() => setRevIdx(i)} style={selStyle(revIdx === i)}>{r.label}</button>
                ))}
              </div>
            </div>
            {/* Industry */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 10 }}>Industry</div>
              <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6 }}>
                {INDUSTRIES.map(ind => (
                  <button key={ind} onClick={() => setIndustry(ind)} style={selStyle(industry === ind)}>{ind}</button>
                ))}
              </div>
            </div>
            {/* Exec count */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 10 }}>Executive Population</div>
              <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6 }}>
                {EXEC_COUNTS.map((e, i) => (
                  <button key={e.label} onClick={() => setExecIdx(i)} style={selStyle(execIdx === i)}>{e.label}</button>
                ))}
              </div>
            </div>
            {/* Scenarios/year */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 10 }}>Critical Scenarios / Year</div>
              <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6 }}>
                {SCENARIO_COUNTS.map((s, i) => (
                  <button key={s.label} onClick={() => setScenIdx(i)} style={selStyle(scenIdx === i)}>{s.label}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Output */}
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 16 }}>
            <div style={{ padding: "24px 28px", background: "rgba(201,168,76,0.08)", border: `1px solid ${GOLD}`, borderTop: `3px solid ${GOLD}` }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 8 }}>Annual Value — {industry}</div>
              <div style={{ fontSize: "clamp(40px,6vw,64px)", fontWeight: 700, color: "#fff", lineHeight: 1, marginBottom: 4 }}>{fmt(annualVal)}</div>
              <div style={{ fontSize: 12, color: MUTED_DARK }}>estimated annual value from 12-minute execution across {Math.round(scenYear)} scenarios</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ padding: "16px 18px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: TEAL, marginBottom: 6 }}>Executive Time Saved</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: "#fff" }}>{fmt(execTimeSavedPerScen * scenYear)}</div>
                <div style={{ fontSize: 11, color: MUTED_DARK, marginTop: 4 }}>{Math.round(hoursSaved * scenYear).toLocaleString()} exec-hours/yr</div>
              </div>
              <div style={{ padding: "16px 18px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: TEAL, marginBottom: 6 }}>Revenue Protected</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: "#fff" }}>{fmt(revProtected * scenYear)}</div>
                <div style={{ fontSize: 11, color: MUTED_DARK, marginTop: 4 }}>68% faster containment</div>
              </div>
              <div style={{ padding: "16px 18px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 6 }}>Speed Advantage</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: "#fff" }}>{speed}</div>
                <div style={{ fontSize: 11, color: MUTED_DARK, marginTop: 4 }}>vs. reactive organizations</div>
              </div>
              <div style={{ padding: "16px 18px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 6 }}>Value Per Scenario</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: "#fff" }}>{fmt(valPerScen)}</div>
                <div style={{ fontSize: 11, color: MUTED_DARK, marginTop: 4 }}>per critical event response</div>
              </div>
            </div>
            <div style={{ textAlign: "center", paddingTop: 8 }}>
              <a href="/pilot-program" onClick={() => trackCTA('roi-calculator')} style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, padding: "11px 28px", background: GOLD, color: NAVY, textDecoration: "none" }}>
                Build My Custom ROI Case →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Shadow Strategy Simulator Section ───────────────────────────────────────
function ShadowSimulatorSection() {
  const ref = useRef<HTMLElement>(null);
  const [animated, setAnimated] = useState(false);
  const [scenario, setScenario] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setAnimated(true); }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const SCENARIOS = [
    'A key competitor just announced they are acquiring our largest distributor.',
    'Activist investor has acquired 9.8% stake — board seat demanded by Friday.',
    'Our primary cloud vendor had a breach; customer data may be compromised.',
    'Top regulator opened a formal inquiry into our pricing practices.',
  ];

  async function analyze() {
    if (!scenario.trim() || loading) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch('/api/simulation/public-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenarioText: scenario }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analysis failed');
      setResult(data);
    } catch (e: any) {
      setError(e.message || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const urgencyColor = (u: string) => u === 'critical' ? '#C0392B' : u === 'high' ? GOLD : TEAL;

  return (
    <section ref={ref} id="shadow-simulator" style={{ ...SECTION_DARK_BG, padding: "96px 0" }}>
      <div style={CONTAINER}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 56, opacity: animated ? 1 : 0, transition: "opacity 0.8s ease" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 28, height: 1, background: GOLD }} />
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: GOLD }}>Shadow Strategy Simulator · GPT-4o</span>
            <div style={{ width: 28, height: 1, background: GOLD }} />
          </div>
          <h2 style={{ ...GEO, fontSize: "clamp(28px,4vw,44px)", fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: 16 }}>
            Test Your Organization Against<br />
            <em style={{ fontStyle: "italic", color: GOLD }}>Any Threat — Right Now</em>
          </h2>
          <p style={{ ...DM, fontSize: 16, color: MUTED_DARK, maxWidth: 560, margin: "0 auto" }}>
            Describe a real scenario your company is facing. Our AI scores your Survive and Thrive probability in seconds — and maps the exact playbooks you'd need.
          </p>
        </div>

        {/* Quick-select scenario chips */}
        <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8, justifyContent: "center", marginBottom: 24, opacity: animated ? 1 : 0, transition: "opacity 0.8s ease 0.2s" }}>
          {SCENARIOS.map((s) => (
            <button
              key={s}
              onClick={() => { setScenario(s); setResult(null); setError(''); }}
              style={{
                fontSize: 11, fontWeight: 600, padding: "6px 14px",
                background: scenario === s ? GOLD : "rgba(255,255,255,0.06)",
                color: scenario === s ? NAVY : MUTED_DARK,
                border: `1px solid ${scenario === s ? GOLD : "rgba(255,255,255,0.12)"}`,
                cursor: "pointer", transition: "all 0.2s ease",
              }}
            >
              {s.length > 52 ? s.slice(0, 52) + '…' : s}
            </button>
          ))}
        </div>

        {/* Input box */}
        <div style={{ maxWidth: 680, margin: "0 auto 32px", opacity: animated ? 1 : 0, transition: "opacity 0.8s ease 0.3s" }}>
          <textarea
            value={scenario}
            onChange={(e) => { setScenario(e.target.value); setResult(null); setError(''); }}
            placeholder="Describe the threat or strategic scenario your organization is facing…"
            rows={3}
            style={{
              width: "100%", padding: "14px 18px", fontSize: 14, color: "#fff",
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.18)",
              resize: "none" as const, outline: "none", lineHeight: 1.6,
              fontFamily: "'Inter', sans-serif",
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, gap: 12 }}>
            {!scenario.trim() && !loading ? (
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontStyle: "italic" }}>
                ↑ Select a scenario above or type your own to unlock analysis
              </span>
            ) : (
              <span />
            )}
            <button
              onClick={analyze}
              disabled={loading || !scenario.trim()}
              style={{
                fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const,
                padding: "10px 28px", background: loading || !scenario.trim() ? "rgba(201,168,76,0.4)" : GOLD,
                color: NAVY, border: "none", cursor: loading || !scenario.trim() ? "not-allowed" : "pointer",
                transition: "background 0.2s ease", display: "flex", alignItems: "center", gap: 8, flexShrink: 0,
              }}
            >
              {loading ? (
                <>
                  <span style={{ display: "inline-block", width: 12, height: 12, border: `2px solid ${NAVY}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                  Analyzing with GPT-4o…
                </>
              ) : 'Analyze My Scenario →'}
            </button>
          </div>
          {error && <div style={{ marginTop: 10, fontSize: 12, color: "#f87171", textAlign: "center" }}>{error}</div>}
        </div>

        {/* Results */}
        {result && (
          <div style={{ maxWidth: 780, margin: "0 auto", animation: "fadeInUp 0.5s ease" }}>
            {/* Score cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
              <div style={{ padding: "24px 20px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderTop: `3px solid ${TEAL}`, textAlign: "center" }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: TEAL, marginBottom: 8 }}>Survive Score</div>
                <div style={{ fontSize: 52, fontWeight: 700, color: "#fff", lineHeight: 1 }}>{result.surviveScore}</div>
                <div style={{ fontSize: 11, color: MUTED_DARK, marginTop: 4 }}>/ 100</div>
              </div>
              <div style={{ padding: "24px 20px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderTop: `3px solid ${GOLD}`, textAlign: "center" }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 8 }}>Thrive Score</div>
                <div style={{ fontSize: 52, fontWeight: 700, color: "#fff", lineHeight: 1 }}>{result.thriveScore}</div>
                <div style={{ fontSize: 11, color: MUTED_DARK, marginTop: 4 }}>/ 100</div>
              </div>
              <div style={{ padding: "24px 20px", background: "rgba(255,255,255,0.05)", border: `1px solid ${urgencyColor(result.urgencyLevel)}`, borderTop: `3px solid ${urgencyColor(result.urgencyLevel)}`, textAlign: "center" }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: urgencyColor(result.urgencyLevel), marginBottom: 8 }}>Urgency</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: "#fff", lineHeight: 1, textTransform: "capitalize" as const, marginTop: 8 }}>{result.urgencyLevel}</div>
                <div style={{ fontSize: 10, color: MUTED_DARK, marginTop: 8 }}>{result.timeToRespond}</div>
              </div>
            </div>

            {/* AI Analysis */}
            <div style={{ padding: "20px 24px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderLeft: `3px solid ${GOLD}`, marginBottom: 16 }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 10 }}>GPT-4o Executive Assessment</div>
              <p style={{ fontSize: 13, color: MUTED_DARK, lineHeight: 1.7 }}>{result.aiAnalysis}</p>
            </div>

            {/* Recommended Playbooks */}
            {result.activatedPlaybooks?.length > 0 && (
              <div style={{ padding: "16px 20px", background: "rgba(43,138,110,0.07)", border: "1px solid rgba(43,138,110,0.25)", marginBottom: 28 }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: TEAL, marginBottom: 10 }}>Playbooks That Would Activate</div>
                <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
                  {result.activatedPlaybooks.map((p: string, i: number) => (
                    <span key={i} style={{ fontSize: 11, fontWeight: 600, padding: "4px 12px", background: "rgba(43,138,110,0.12)", color: "#3BAF8A", border: "1px solid rgba(43,138,110,0.25)" }}>{p}</span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 13, color: MUTED_DARK, marginBottom: 16 }}>
                See how Execution OS would mobilize your entire organization in 12 minutes.
              </p>
              <a href="/pilot-program" style={{ display: "inline-block", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, padding: "12px 32px", background: GOLD, color: NAVY, textDecoration: "none" }}>
                Request a Pilot →
              </a>
            </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </section>
  );
}

// ─── Command Center Showcase Section ─────────────────────────────────────────
function MiniRadar() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = 140, H = 140, cx = 70, cy = 70, r = 58;
    const dots: { angle: number; dist: number; age: number; size: number }[] = [];
    for (let i = 0; i < 7; i++) dots.push({ angle: Math.random() * Math.PI * 2, dist: 0.3 + Math.random() * 0.65, age: Math.random() * 120, size: 1.5 + Math.random() * 2 });
    let sweep = 0;
    function draw() {
      ctx!.clearRect(0, 0, W, H);
      [0.33, 0.66, 1].forEach(f => {
        ctx!.beginPath(); ctx!.arc(cx, cy, r * f, 0, Math.PI * 2);
        ctx!.strokeStyle = "rgba(43,138,110,0.18)"; ctx!.lineWidth = 1; ctx!.stroke();
      });
      ctx!.strokeStyle = "rgba(43,138,110,0.12)"; ctx!.lineWidth = 0.5;
      [[cx, cy - r, cx, cy + r], [cx - r, cy, cx + r, cy]].forEach(([x1, y1, x2, y2]) => {
        ctx!.beginPath(); ctx!.moveTo(x1, y1); ctx!.lineTo(x2, y2); ctx!.stroke();
      });
      ctx!.save(); ctx!.translate(cx, cy); ctx!.rotate(sweep);
      const sg = ctx!.createLinearGradient(0, 0, r, 0);
      sg.addColorStop(0, "rgba(43,138,110,0.5)"); sg.addColorStop(1, "rgba(43,138,110,0)");
      ctx!.beginPath(); ctx!.moveTo(0, 0); ctx!.arc(0, 0, r, -Math.PI * 0.35, 0); ctx!.closePath();
      ctx!.fillStyle = sg; ctx!.fill(); ctx!.restore();
      ctx!.beginPath(); ctx!.moveTo(cx, cy); ctx!.lineTo(cx + Math.cos(sweep) * r, cy + Math.sin(sweep) * r);
      ctx!.strokeStyle = "rgba(43,138,110,0.9)"; ctx!.lineWidth = 1.5; ctx!.stroke();
      dots.forEach(dot => {
        const diff = (sweep - dot.angle + Math.PI * 2) % (Math.PI * 2);
        const op = diff < 0.6 ? (1 - diff / 0.6) * 0.9 : Math.max(0, 0.4 - dot.age / 200);
        if (op <= 0) return;
        ctx!.beginPath(); ctx!.arc(cx + Math.cos(dot.angle) * r * dot.dist, cy + Math.sin(dot.angle) * r * dot.dist, dot.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(43,138,110,${op})`; ctx!.fill();
        dot.age++;
        if (dot.age > 160) { dot.age = 0; dot.angle = Math.random() * Math.PI * 2; dot.dist = 0.3 + Math.random() * 0.65; }
      });
      sweep = (sweep + 0.018) % (Math.PI * 2);
      frameRef.current = requestAnimationFrame(draw);
    }
    frameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);
  return <canvas ref={canvasRef} width={140} height={140} style={{ width: 140, height: 140 }} />;
}

function CommandCenterShowcaseSection() {
  const [hovered, setHovered] = useState<string | null>(null);
  const MONO: React.CSSProperties = { fontFamily: "'DM Mono','Geist Mono','Fira Code',monospace" };
  const BEBAS: React.CSSProperties = { fontFamily: "'Bebas Neue','Barlow Condensed','Oxanium',sans-serif" };
  const SERIF: React.CSSProperties = { fontFamily: "Georgia,'Times New Roman',serif" };

  const tileBase: React.CSSProperties = {
    background: "#111830", borderRadius: 10, padding: 22, position: "relative", overflow: "hidden",
    border: "1px solid rgba(240,237,228,0.08)", transition: "all 0.25s ease", cursor: "pointer",
  };

  return (
    <section style={{ ...SECTION_DARK_BG, padding: "100px 0 80px", position: "relative", overflow: "hidden" }}>
      <SectionMarker n="07" />
      <div style={{ ...CONTAINER, maxWidth: 1160 }}>

        {/* Header */}
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <SectionLabel>INSIDE THE PLATFORM</SectionLabel>
            <h2 style={{ ...GEO, fontSize: 38, fontWeight: 700, color: IVORY, lineHeight: 1.2, marginBottom: 16 }}>
              Your command center — ready at the trigger.
            </h2>
            <p style={{ ...DM, fontSize: 16, color: "rgba(240,237,228,0.6)", maxWidth: 580, margin: "0 auto" }}>
              When a strategic event fires, executives don't improvise. They open this. Every response pre-staged, every role pre-assigned, execution in motion within 12 minutes.
            </p>
          </div>
        </Reveal>

        {/* Browser frame */}
        <Reveal>
          <div style={{ borderRadius: 14, overflow: "hidden", boxShadow: "0 48px 120px rgba(0,0,0,0.55), 0 0 0 1px rgba(240,237,228,0.1)", border: "1px solid rgba(240,237,228,0.12)" }}>

            {/* Browser chrome */}
            <div style={{ background: "#06091A", padding: "10px 16px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid rgba(240,237,228,0.08)" }}>
              <div style={{ display: "flex", gap: 6 }}>
                {["#FF5F57","#FFBC2E","#28C840"].map((c, i) => <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.7 }} />)}
              </div>
              <div style={{ flex: 1, background: "rgba(240,237,228,0.06)", borderRadius: 4, padding: "4px 12px", display: "flex", alignItems: "center", gap: 8, maxWidth: 320, margin: "0 auto" }}>
                <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="rgba(240,237,228,0.3)" strokeWidth={2}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <span style={{ ...MONO, fontSize: 10, color: "rgba(240,237,228,0.35)", letterSpacing: 0.3 }}>app.vaughnmartin.com/command-center</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                {[{ dot: TEAL, label: "SIGNALS ACTIVE" }, { dot: GOLD, label: "248 MONITORING" }].map(({ dot, label }) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 5, ...MONO, fontSize: 9, color: "rgba(240,237,228,0.4)" }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: dot, display: "inline-block" }} />
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* Side nav strip */}
            <div style={{ display: "flex" }}>
              <div style={{ width: 44, background: "rgba(10,15,46,0.85)", borderRight: "1px solid rgba(240,237,228,0.06)", display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 0", gap: 8, minHeight: 460 }}>
                {[
                  <path key="a" strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />,
                  <path key="b" strokeLinecap="round" strokeLinejoin="round" d="M9.348 14.651a3.75 3.75 0 010-5.303m5.304 0a3.75 3.75 0 010 5.303m-7.425 2.122a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M12 12h.008v.007H12V12z" />,
                  <path key="c" strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />,
                ].map((iconPath, i) => (
                  <div key={i} style={{ width: 32, height: 32, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", background: i === 0 ? "rgba(201,168,76,0.12)" : "transparent" }}>
                    <svg width={15} height={15} fill="none" viewBox="0 0 24 24" stroke={i === 0 ? GOLD : "rgba(240,237,228,0.3)"} strokeWidth={1.5}>{iconPath}</svg>
                  </div>
                ))}
              </div>

              {/* Tile grid */}
              <div style={{ flex: 1, background: NAVY, padding: "20px 20px 16px", display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 12, minHeight: 460 }}>

                {/* ACTIVATE tile — spans 2 rows */}
                <div
                  style={{ ...tileBase, gridColumn: 1, gridRow: "1 / 3", background: "linear-gradient(135deg, #1A1200 0%, #0A0F2E 60%)", borderColor: hovered === "activate" ? "rgba(201,168,76,0.4)" : "rgba(201,168,76,0.2)" }}
                  onMouseEnter={() => setHovered("activate")} onMouseLeave={() => setHovered(null)}
                >
                  <div style={{ ...MONO, fontSize: 9, letterSpacing: 3, color: GOLD, textTransform: "uppercase", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: GOLD, display: "inline-block" }} />Primary Action
                  </div>
                  <div style={{ ...BEBAS, fontSize: 40, lineHeight: 0.95, color: GOLD, letterSpacing: 2, marginBottom: 14 }}>ACTIVATE<br />PLAYBOOK</div>
                  <div style={{ ...SERIF, fontSize: 13, fontWeight: 300, color: "rgba(240,237,228,0.6)", lineHeight: 1.5, marginBottom: 24, maxWidth: 240 }}>
                    A strategic event just fired. Deploy a pre-staged response in under 12 minutes.
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 22 }}>
                    <div style={{ ...MONO, fontSize: 40, fontWeight: 300, color: GOLD, lineHeight: 1 }}>12</div>
                    <div style={{ ...MONO, fontSize: 9, color: "rgba(240,237,228,0.4)", letterSpacing: 2 }}>MIN TO<br />EXECUTION</div>
                  </div>
                  <div style={{ background: GOLD, color: NAVY, ...MONO, fontSize: 10, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", padding: "11px 18px", borderRadius: 5, textAlign: "center", marginBottom: 8 }}>
                    SELECT PLAYBOOK & ACTIVATE →
                  </div>
                  <div style={{ border: "1px solid rgba(240,237,228,0.1)", color: "rgba(240,237,228,0.4)", ...MONO, fontSize: 9, letterSpacing: 1.5, padding: "8px 14px", borderRadius: 5, textAlign: "center" }}>
                    RUN SIMULATION FIRST
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 18 }}>
                    {["Competitive","Crisis","M&A","Cyber","Regulatory"].map(t => (
                      <div key={t} style={{ ...MONO, fontSize: 8, letterSpacing: 1.5, padding: "3px 8px", borderRadius: 3, border: "1px solid rgba(201,168,76,0.2)", color: "rgba(201,168,76,0.7)" }}>{t}</div>
                    ))}
                  </div>
                </div>

                {/* Signal Radar tile */}
                <div
                  style={{ ...tileBase, gridColumn: 2, gridRow: 1, background: "linear-gradient(135deg, #001A12 0%, #0A0F2E 60%)", borderColor: hovered === "radar" ? "rgba(43,138,110,0.5)" : "rgba(43,138,110,0.2)" }}
                  onMouseEnter={() => setHovered("radar")} onMouseLeave={() => setHovered(null)}
                >
                  <div style={{ ...MONO, fontSize: 9, letterSpacing: 3, color: TEAL, textTransform: "uppercase", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: TEAL, display: "inline-block" }} />Signal Intelligence
                  </div>
                  <div style={{ display: "flex", justifyContent: "center", margin: "6px 0 8px" }}>
                    <div style={{ position: "relative" }}>
                      <MiniRadar />
                      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center", pointerEvents: "none" }}>
                        <div style={{ ...BEBAS, fontSize: 22, color: TEAL, lineHeight: 1 }}>248</div>
                        <div style={{ ...MONO, fontSize: 8, color: "rgba(240,237,228,0.3)", letterSpacing: 1 }}>SIGNALS</div>
                      </div>
                    </div>
                  </div>
                  {[{ name: "Market Dynamics", level: "Elevated" }, { name: "Competitive Intel", level: "Nominal" }, { name: "Regulatory", level: "Stable" }].map(({ name, level }) => (
                    <div key={name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 8px", background: "rgba(43,138,110,0.05)", border: "1px solid rgba(43,138,110,0.1)", borderRadius: 3, marginBottom: 4 }}>
                      <span style={{ ...MONO, fontSize: 9, color: IVORY, letterSpacing: 0.3 }}>{name}</span>
                      <span style={{ ...MONO, fontSize: 8, padding: "1px 5px", borderRadius: 2, letterSpacing: 1, textTransform: "uppercase" as const, background: level === "Elevated" ? "rgba(201,168,76,0.15)" : level === "Nominal" ? "rgba(43,138,110,0.15)" : "rgba(240,237,228,0.06)", color: level === "Elevated" ? GOLD : level === "Nominal" ? TEAL : "rgba(240,237,228,0.4)", border: `1px solid ${level === "Elevated" ? "rgba(201,168,76,0.25)" : level === "Nominal" ? "rgba(43,138,110,0.25)" : "rgba(240,237,228,0.1)"}` }}>{level}</span>
                    </div>
                  ))}
                </div>

                {/* Playbooks tile */}
                <div
                  style={{ ...tileBase, gridColumn: 3, gridRow: 1 }}
                  onMouseEnter={() => setHovered("playbooks")} onMouseLeave={() => setHovered(null)}
                >
                  <div style={{ ...MONO, fontSize: 9, letterSpacing: 3, color: "rgba(240,237,228,0.35)", textTransform: "uppercase", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(240,237,228,0.3)", display: "inline-block" }} />Playbook Library
                  </div>
                  <div style={{ ...SERIF, fontSize: 18, fontWeight: 600, color: IVORY, lineHeight: 1.2, marginBottom: 6 }}>170 Response<br />Architectures</div>
                  <div style={{ ...DM, fontSize: 12, color: "rgba(240,237,228,0.4)", lineHeight: 1.5, marginBottom: 14 }}>Pre-built across 9 strategic domains.</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                    {[{ label: "Offense", count: 58, color: TEAL }, { label: "Defense", count: 58, color: GOLD }, { label: "Sp. Teams", count: 54, color: "rgba(180,150,255,0.8)" }].map(({ label, count, color }) => (
                      <div key={label} style={{ padding: "10px 6px", borderRadius: 5, textAlign: "center", border: `1px solid ${color}28` }}>
                        <div style={{ ...MONO, fontSize: 8, letterSpacing: 2, textTransform: "uppercase" as const, marginBottom: 3, color }}>{label}</div>
                        <div style={{ ...BEBAS, fontSize: 24, lineHeight: 1, color: IVORY }}>{count}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mission Control — locked overlay */}
                <div style={{ ...tileBase, gridColumn: 2, gridRow: 2, position: "relative" }}>
                  <div style={{ ...MONO, fontSize: 9, letterSpacing: 3, color: "rgba(240,237,228,0.2)", textTransform: "uppercase", marginBottom: 10 }}>Mission Control</div>
                  <div style={{ ...DM, fontSize: 12, color: "rgba(240,237,228,0.2)", lineHeight: 1.5, marginBottom: 10 }}>Real-time war room coordination. Live task feeds, stakeholder tracking, escalation chains.</div>
                  <div style={{ height: 8, background: "rgba(43,138,110,0.08)", borderRadius: 4, marginBottom: 8 }} />
                  <div style={{ height: 8, background: "rgba(240,237,228,0.04)", borderRadius: 4, width: "60%" }} />
                  {/* Lock overlay */}
                  <div style={{ position: "absolute", inset: 0, borderRadius: 10, background: "rgba(10,15,46,0.72)", backdropFilter: "blur(3px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="rgba(240,237,228,0.3)" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                    <div style={{ ...MONO, fontSize: 9, color: "rgba(240,237,228,0.3)", letterSpacing: 1.5, textAlign: "center" }}>EXECUTIVE ACCESS<br />REQUIRED</div>
                  </div>
                </div>

                {/* Performance — locked overlay */}
                <div style={{ ...tileBase, gridColumn: 3, gridRow: 2, position: "relative" }}>
                  <div style={{ ...MONO, fontSize: 9, letterSpacing: 3, color: "rgba(240,237,228,0.2)", textTransform: "uppercase", marginBottom: 10 }}>Performance & ROI</div>
                  <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                    {["Activations","Avg Score","ROI Tracked"].map(l => <div key={l} style={{ flex: 1, padding: "8px 4px", background: "rgba(240,237,228,0.02)", border: "1px solid rgba(240,237,228,0.05)", borderRadius: 5, textAlign: "center" }}><div style={{ height: 16, background: "rgba(240,237,228,0.05)", borderRadius: 3 }} /></div>)}
                  </div>
                  {["Maturity Score","Decision Velocity","Readiness"].map((l, i) => (
                    <div key={l} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <div style={{ ...MONO, fontSize: 9, color: "rgba(240,237,228,0.15)", width: 90 }}>{l}</div>
                      <div style={{ flex: 1, height: 3, background: "rgba(240,237,228,0.04)", borderRadius: 2 }} />
                    </div>
                  ))}
                  {/* Lock overlay */}
                  <div style={{ position: "absolute", inset: 0, borderRadius: 10, background: "rgba(10,15,46,0.72)", backdropFilter: "blur(3px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="rgba(240,237,228,0.3)" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                    <div style={{ ...MONO, fontSize: 9, color: "rgba(240,237,228,0.3)", letterSpacing: 1.5, textAlign: "center" }}>EXECUTIVE ACCESS<br />REQUIRED</div>
                  </div>
                </div>

              </div>
            </div>

            {/* Status bar */}
            <div style={{ background: "#06091A", borderTop: "1px solid rgba(240,237,228,0.06)", padding: "8px 24px 8px 68px", display: "flex", alignItems: "center", gap: 28 }}>
              {[{ dot: TEAL, label: "248 signals monitored" }, { dot: GOLD, label: "221 triggers configured" }, { dot: "rgba(240,237,228,0.3)", label: "170 playbooks ready" }].map(({ dot, label }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, ...MONO, fontSize: 9, color: "rgba(240,237,228,0.3)", letterSpacing: 0.5 }}>
                  <span style={{ width: 4, height: 4, borderRadius: "50%", background: dot, display: "inline-block" }} />{label}
                </div>
              ))}
            </div>

          </div>
        </Reveal>

        {/* CTA */}
        <Reveal delay={0.15}>
          <div style={{ textAlign: "center", marginTop: 48 }}>
            <p style={{ ...DM, fontSize: 14, color: "rgba(240,237,228,0.45)", marginBottom: 24 }}>
              Full command center access — including live war room, performance analytics, and ROI tracking — is provisioned for executive pilot teams.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", alignItems: "center" }}>
              <Link href="/pilot-program" onClick={() => trackCTA("showcase-pilot")} style={{ background: GOLD, color: NAVY, ...DM, fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "14px 32px", borderRadius: 6, textDecoration: "none", display: "inline-block", transition: "all 0.2s" }}>
                Request Executive Access →
              </Link>
              <Link href="/12-minute-experience" style={{ border: "1px solid rgba(240,237,228,0.2)", color: "rgba(240,237,228,0.65)", ...DM, fontSize: 13, padding: "14px 28px", borderRadius: 6, textDecoration: "none", display: "inline-block", transition: "all 0.2s" }}>
                Run the 12-Minute Test Drive
              </Link>
            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Homepage() {
  useScrollDepth();
  return (
    <div style={{ background: NAVY, margin: 0, padding: 0 }}>
      <HomepageNav />
      <HeroSection />
      <ProblemSection />
      <ExecutionGapSection />
      <MissingLayerSection />
      <ContrastMomentSection />
      <IDEASection />
      <PlatformPreviewSection />
      <CommandCenterShowcaseSection />
      <CredibilitySection />
      <MicrosoftEcosystemBanner />
      <PersonalizedROISection />
      <ShadowSimulatorSection />
      <CTASection />
      <HomepageFooter />
    </div>
  );
}
