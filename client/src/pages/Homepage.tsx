import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { ExecuteIQLogo } from "@/components/ExecuteIQLogo";

// ─── Brand Tokens (Spec v2.0 §0) ─────────────────────────────────────────────
const NAVY        = "#0A0F2E";
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
  backgroundImage: `linear-gradient(rgba(201,168,76,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.06) 1px, transparent 1px)`,
  backgroundSize: "80px 80px",
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
        background: NAVY,
        borderBottom: "1px solid rgba(201,168,76,0.15)",
        height: 64,
        display: "flex", alignItems: "center",
      }}>
        <div style={{ ...CONTAINER, width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <ExecuteIQLogo size={36} />
            <span style={{ ...DM, fontWeight: 700, letterSpacing: "0.12em", color: GOLD, fontSize: 14 }}>
              VAUGHNMARTIN
            </span>
          </Link>

          {/* Desktop nav — hidden below 768px via CSS */}
          <div className="hp-desktop-nav" style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <button
              onClick={() => scrollTo("how-it-works")}
              style={{ ...DM, background: "none", border: "none", cursor: "pointer", color: MUTED_DARK, fontSize: 14, padding: 0, transition: "color 0.2s" }}
            >
              How It Works
            </button>
            <Link href="/playbook-library" style={{ ...DM, color: MUTED_DARK, fontSize: 14, textDecoration: "none" }}>Playbooks</Link>
            <Link href="/pricing" style={{ ...DM, color: MUTED_DARK, fontSize: 14, textDecoration: "none" }}>Pricing</Link>
            <Link href="/founder-story" style={{ ...DM, color: MUTED_DARK, fontSize: 14, textDecoration: "none" }}>About</Link>
            <Link
              href="/pilot-program"
              onClick={() => trackCTA("nav")}
              style={{
                ...DM, background: GOLD, color: NAVY, fontWeight: 700, fontSize: 14,
                padding: "10px 20px", borderRadius: 4, textDecoration: "none", letterSpacing: "0.04em",
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
            <span style={{ display: "block", width: 22, height: 2, background: MUTED_DARK, borderRadius: 2 }} />
            <span style={{ display: "block", width: 22, height: 2, background: MUTED_DARK, borderRadius: 2 }} />
            <span style={{ display: "block", width: 22, height: 2, background: MUTED_DARK, borderRadius: 2 }} />
          </button>
        </div>
      </nav>

      {/* Mobile full-screen overlay */}
      {menuOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: NAVY,
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
            { label: "How It Works", onPress: () => scrollTo("how-it-works") },
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
          .hp-desktop-nav { display: none !important; }
          .hp-hamburger   { display: flex !important; }
          .hp-stat-row    { flex-direction: column !important; gap: 24px !important; }
          .hp-stat-div    { display: none !important; }
          .hp-prob-grid   { flex-direction: column !important; }
          .hp-idea-grid   { grid-template-columns: 1fr !important; }
          .hp-footer-cols { flex-direction: column !important; gap: 40px !important; text-align: center; }
          .hp-hero-h1     { font-size: 36px !important; }
          .hp-missing-h2  { font-size: 30px !important; }
          .hp-cta-h2      { font-size: 30px !important; }
          .hp-cta-btn     { display: block !important; width: calc(100% - 48px) !important; text-align: center; }
          .hp-sec         { padding: 64px 0 !important; }
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
      ...GOLD_GRID_BG,
      background: NAVY,
      minHeight: "100vh",
      display: "flex", alignItems: "center",
      paddingTop: 80, paddingBottom: 80,
    }}>
      <div style={{ ...CONTAINER, width: "100%", textAlign: "center" }}>
        <Reveal>
          <div style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: GOLD, marginBottom: 28 }}>
            EXECUTION INFRASTRUCTURE · FORTUNE 1000
          </div>

          <h1 className="hp-hero-h1" style={{
            ...GEO, fontSize: 52, fontWeight: 700, color: "#fff",
            lineHeight: 1.15, maxWidth: 800, margin: "0 auto 28px",
          }}>
            At <span style={{ color: TEAL_LIGHT }}>12 minutes</span>,
            {" "}you're executing.
            <br />
            At <span style={{ color: RED_CRISIS }}>72 hours</span>,
            {" "}they're still getting in the room.
          </h1>

          <p style={{ ...DM, fontSize: 18, color: MUTED_DARK, maxWidth: 640, margin: "0 auto 40px", lineHeight: 1.65 }}>
            170 pre-staged playbooks. 216+ signals monitored. One trigger fires — every stakeholder is deployed and executing in under 12 minutes. While your competitors are still on their first emergency call, you're three days into response.
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
            <button
              onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
              style={{ ...DM, background: "none", border: "none", cursor: "pointer", color: MUTED_DARK, fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}
            >
              See How It Works <span>→</span>
            </button>
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
              { num: "170",    label: "Pre-Staged Playbooks" },
              { num: "216+",   label: "Signals Monitored" },
              { num: "12 min", label: "Full Org Deployment" },
            ].map((s, i) => (
              <div key={s.num} style={{ display: "contents" }}>
                {i > 0 && <div className="hp-stat-div" style={{ width: 1, height: 40, background: "rgba(201,168,76,0.3)", flexShrink: 0 }} />}
                <div style={{ textAlign: "center" }}>
                  <div style={{ ...GEO, fontSize: 32, fontWeight: 700, color: GOLD, lineHeight: 1 }}>{s.num}</div>
                  <div style={{ ...DM, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em", color: MUTED_DARK, marginTop: 6 }}>{s.label}</div>
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
  return (
    <section className="hp-sec" style={{ background: IVORY, padding: "100px 0" }}>
      <div style={{ ...CONTAINER }}>
        <div className="hp-prob-grid" style={{ display: "flex", gap: 60, alignItems: "flex-start" }}>

          {/* Left */}
          <Reveal style={{ flex: "0 0 calc(50% - 30px)", maxWidth: "50%" }}>
            <SectionLabel>THE PROBLEM</SectionLabel>
            <h2 style={{ ...GEO, fontSize: 38, fontWeight: 700, color: "#0A0F2E", lineHeight: 1.2, marginBottom: 32 }}>
              The trigger fires in minutes.
              <br />
              72 hours later, they're finally in the room.
            </h2>
            <p style={{ ...DM, fontSize: 17, color: "#333", lineHeight: 1.7, marginBottom: 20 }}>
              A competitor cuts prices. A regulator issues a mandate. A key executive resigns. The strategic moment is NOW.
            </p>
            <p style={{ ...DM, fontSize: 17, color: "#333", lineHeight: 1.7, marginBottom: 20 }}>
              Your organization spends 72 hours in emergency calls, improvised documents, and unclear ownership before a single coordinated action is taken.
            </p>
            <p style={{ ...DM, fontSize: 17, color: "#333", lineHeight: 1.7 }}>
              By the time you're aligned, the window has moved.
            </p>
          </Reveal>

          {/* Right — failure cards */}
          <div style={{ flex: "0 0 calc(50% - 30px)", maxWidth: "50%", display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { num: "01", title: "The Trigger Fires",  body: "A competitor announcement. A market shift. A leadership departure. The strategic moment arrives." },
              { num: "02", title: "72 Hours Just to Assemble",  body: "Emergency calls. Competing priorities. No clear ownership. After three days of coordination, they finally have everyone in a room — and haven't executed a single thing." },
              { num: "03", title: "The Window Closes",  body: "By the time your org aligns, competitors have responded. The advantage is gone." },
            ].map((c, i) => (
              <Reveal key={c.num} delay={i * 0.1}>
                <div style={{
                  background: "#fff", border: `1px solid ${BORDER}`, borderLeft: `3px solid ${GOLD}`,
                  padding: 24, borderRadius: 2, position: "relative", overflow: "hidden",
                }}>
                  <div style={{ ...GEO, fontSize: 48, fontWeight: 700, color: "rgba(192,57,43,0.12)", position: "absolute", bottom: 8, right: 16, lineHeight: 1, pointerEvents: "none", userSelect: "none" }}>
                    {c.num}
                  </div>
                  <div style={{ ...DM, fontSize: 14, fontWeight: 700, color: "#1A1A2E", marginBottom: 8 }}>{c.title}</div>
                  <div style={{ ...DM, fontSize: 14, color: "#555", lineHeight: 1.6 }}>{c.body}</div>
                  {i < 2 && <div style={{ ...DM, color: GOLD, fontSize: 14, marginTop: 12, textAlign: "center" }}>↓</div>}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
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
    <section className="hp-sec" style={{ ...GOLD_GRID_BG, background: NAVY, padding: "120px 0" }}>
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
    { letter: "D", title: "Detect",   subtitle: "216+ Signals, Every 15 Minutes",  body: "AI monitors competitive, regulatory, financial, and operational signals continuously. The system surfaces the trigger before it becomes a crisis.", accent: GOLD, wm: "rgba(201,168,76,0.06)" },
    { letter: "E", title: "Execute",  subtitle: "12-Minute Full Deployment",        body: "One human approval. The system distributes roles, tasks, documents, and budgets to every stakeholder simultaneously. No coordination calls.", accent: TEAL, wm: "rgba(43,138,110,0.06)" },
    { letter: "A", title: "Advance",  subtitle: "Institutional Memory, Built In",   body: "Every activation closes the loop. What worked, what didn't, and what to pre-stage better next time — automatically fed back into your playbook library.", accent: GOLD, wm: "rgba(201,168,76,0.06)" },
  ];

  return (
    <section id="how-it-works" className="hp-sec" style={{ background: "#F8F7F4", padding: "100px 0" }}>
      <div style={{ ...CONTAINER }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 8 }}>
            <SectionLabel>HOW IT WORKS</SectionLabel>
            <h2 style={{ ...GEO, fontSize: 38, fontWeight: 700, color: "#0A0F2E", lineHeight: 1.2 }}>
              Trigger fires. Organization deploys.
              <br />
              In 12 minutes.
            </h2>
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
      </div>
    </section>
  );
}

// ─── SECTION 6: Credibility ───────────────────────────────────────────────────
function CredibilitySection() {
  return (
    <section style={{ background: MID_NAVY, padding: "60px 0" }}>
      <div style={{ ...CONTAINER, textAlign: "center" }}>
        <Reveal>
          <p style={{ ...DM, fontSize: 13, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: MUTED_DARK, marginBottom: 32 }}>
            Built by someone who ran execution at Ford · Lockheed Martin · Eli Lilly · Charles Schwab · Vantiv/Worldpay · Boyd Gaming
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
        </Reveal>
      </div>
    </section>
  );
}

// ─── SECTION 7: Primary CTA ───────────────────────────────────────────────────
function CTASection() {
  return (
    <section className="hp-sec" style={{ ...GOLD_GRID_BG, background: NAVY, padding: "120px 0" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
        <Reveal>
          <h2 className="hp-cta-h2" style={{ ...GEO, fontSize: 44, fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: 24 }}>
            At <span style={{ color: RED_CRISIS }}>72 hours</span>, they're
            {" "}finally in the room.
            <br />
            You've been executing for{" "}
            <span style={{ color: GOLD }}>71 hours</span>.
          </h2>
          <p style={{ ...DM, fontSize: 17, color: MUTED_DARK, maxWidth: 600, margin: "0 auto 40px", lineHeight: 1.65 }}>
            We're opening 3–5 pilot partnerships. If your organization takes more than 24 hours to fully mobilize after a strategic decision, this conversation is worth 30 minutes.
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
          <p style={{ ...DM, fontSize: 13, color: MUTED_LIGHT, marginTop: 16 }}>
            No commitment required. Pilot pricing available.
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
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <ExecuteIQLogo size={32} />
              <span style={{ ...DM, fontWeight: 700, letterSpacing: "0.12em", color: GOLD, fontSize: 13 }}>VAUGHNMARTIN</span>
            </div>
            <p style={{ ...GEO, fontStyle: "italic", fontSize: 16, color: GOLD_LIGHT, marginBottom: 16 }}>We Make Enterprises Fearless.</p>
            <p style={{ ...DM, fontSize: 12, color: MUTED_LIGHT }}>© 2026 VaughnMartin. All rights reserved.</p>
          </div>

          {/* Product */}
          <div style={{ flex: 1 }}>
            <div style={{ ...DM, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: GOLD, marginBottom: 20 }}>PRODUCT</div>
            {[
              { label: "How It Works", scroll: true },
              { label: "Playbooks",    href: "/playbook-library" },
              { label: "Pricing",      href: "/pricing" },
              { label: "Request a Pilot", href: "/pilot-program" },
            ].map(l => (
              l.scroll
                ? <button key={l.label} onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })} style={{ ...DM, display: "block", background: "none", border: "none", cursor: "pointer", color: MUTED_DARK, fontSize: 14, padding: "4px 0", textAlign: "left", transition: "color 0.2s" }}>{l.label}</button>
                : <Link key={l.label} href={l.href!} style={{ ...DM, display: "block", color: MUTED_DARK, fontSize: 14, padding: "4px 0", textDecoration: "none" }}>{l.label}</Link>
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

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Homepage() {
  useScrollDepth();
  return (
    <div style={{ background: NAVY, margin: 0, padding: 0 }}>
      <HomepageNav />
      <HeroSection />
      <ProblemSection />
      <MissingLayerSection />
      <IDEASection />
      <CredibilitySection />
      <CTASection />
      <HomepageFooter />
    </div>
  );
}
