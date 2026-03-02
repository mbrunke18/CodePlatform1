import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import StandardNav from "@/components/layout/StandardNav";
import Footer from "@/components/layout/Footer";
import { VaughnMartinLogo } from "@/components/VaughnMartinLogo";

const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const GOLD_LIGHT = "#DFC178";
const TEAL = "#2B8A6E";
const TEAL_LIGHT = "#3BAF8A";
const OFF_WHITE = "#F8F7F4";
const BORDER = "#E8E4DC";
const TEXT_MUTED = "#6B7280";

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({ children, delay = 0, style = {} }: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}) {
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

function Eyebrow({ color, center = false, children }: {
  color: "gold" | "teal" | "white";
  center?: boolean;
  children: string;
}) {
  const colors = {
    gold: GOLD,
    teal: TEAL,
    white: "rgba(255,255,255,0.4)",
  };
  const c = colors[color];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20, justifyContent: center ? "center" : "flex-start" }}>
      <div style={{ width: 36, height: 2, background: c, flexShrink: 0 }} />
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: c }}>
        {children}
      </span>
    </div>
  );
}

const DOMAINS = [
  { num: "01", title: "Financial Response", count: "24 Playbooks", desc: "Earnings misses, budget overruns, cash flow events, and board-level financial response protocols.", accent: false },
  { num: "02", title: "Competitive Intelligence", count: "22 Playbooks", desc: "Competitor launches, pricing moves, market entry, M&A activity, and talent poaching responses.", accent: false },
  { num: "03", title: "Regulatory & Compliance", count: "19 Playbooks", desc: "New regulation response, audit preparation, compliance breach containment, and government relations.", accent: false },
  { num: "04", title: "Go-to-Market", count: "21 Playbooks", desc: "Product launches, market entry, sales force activation, pricing changes, and channel expansion.", accent: false },
  { num: "05", title: "M&A Integration", count: "18 Playbooks", desc: "Acquisition announcement, due diligence, integration planning, talent retention, and culture merger.", accent: false },
  { num: "06", title: "Crisis Management", count: "20 Playbooks", desc: "PR crisis, supply chain disruption, cybersecurity incident, and reputational risk containment.", accent: false },
  { num: "07", title: "Talent & Organization", count: "16 Playbooks", desc: "Executive succession, workforce restructuring, culture change programs, and key talent retention.", accent: false },
  { num: "08", title: "Technology & Digital", count: "17 Playbooks", desc: "Digital transformation, system outage response, tech vendor failure, and AI adoption acceleration.", accent: false },
  { num: "09", title: "Strategic Opportunity", count: "13 Playbooks", desc: "Emerging market entry, strategic partnership activation, innovation pivot, and breakout growth plays.", accent: true },
];

const INTEGRATIONS = [
  "Salesforce", "HubSpot", "ServiceNow", "Jira", "Slack", "Microsoft Teams",
  "Google Workspace", "Outlook / Exchange", "AWS CloudWatch", "Workday", "Okta", "Microsoft Active Directory",
];

export default function Homepage() {
  const [, setLocation] = useLocation();
  const [cardProgress, setCardProgress] = useState(52);

  useEffect(() => {
    const id = setInterval(() => {
      setCardProgress(p => { const n = p + 0.22; return n > 78 ? 42 : n; });
    }, 80);
    return () => clearInterval(id);
  }, []);

  const go = (path: string) => setLocation(path);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, background: "#fff", color: NAVY, overflowX: "hidden", lineHeight: 1.6 }}>

      <style>{`
        @keyframes hpBlink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes hpFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        @keyframes hpSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>

      <StandardNav />

      {/* ══ HERO ══ */}
      <section style={{ minHeight: "100vh", background: NAVY, display: "flex", alignItems: "center", position: "relative", overflow: "hidden", padding: "120px 56px 80px" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(201,168,76,0.055) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.055) 1px,transparent 1px)`, backgroundSize: "48px 48px" }} />
        <div style={{ position: "absolute", top: -120, right: -80, width: 650, height: 650, background: "radial-gradient(ellipse,rgba(43,138,110,0.13) 0%,transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -100, left: "35%", width: 480, height: 480, background: "radial-gradient(ellipse,rgba(201,168,76,0.08) 0%,transparent 65%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 2, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center", maxWidth: 1200, width: "100%", margin: "0 auto" }}>

          {/* Left */}
          <div>
            {/* VaughnMartin logo */}
            <div style={{ marginBottom: 28 }}>
              <VaughnMartinLogo height={44} variant="full" color="dark" />
            </div>

            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.22)", padding: "6px 18px", marginBottom: 36 }}>
              <span style={{ width: 6, height: 6, background: GOLD, borderRadius: "50%", display: "inline-block", animation: "hpBlink 2.5s ease infinite" }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: GOLD }}>Execution OS · Now in Pilot</span>
            </div>

            <h1 style={{ ...CG, fontWeight: 600, fontSize: "clamp(42px, 5.2vw, 70px)", lineHeight: 1.05, color: "#fff", marginBottom: 12 }}>
              They spend 72 hours<br />getting the right people<br />
              <em style={{ fontStyle: "italic", color: GOLD_LIGHT }}>in a room.</em>
            </h1>

            <div style={{ width: 60, height: 2, background: `linear-gradient(90deg,${TEAL},transparent)`, margin: "28px 0" }} />

            <p style={{ fontSize: 15, fontWeight: 400, lineHeight: 1.9, color: "rgba(255,255,255,0.58)", maxWidth: 500, marginBottom: 48 }}>
              <strong style={{ color: "rgba(255,255,255,0.88)", fontWeight: 600 }}>You spend 12 minutes already in execution.</strong>{" "}
              Execution OS doesn't accelerate coordination. It replaces it. When a signal fires, you're not scheduling a meeting — you're running a playbook.
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <a
                href="/api/login"
                target="_top"
                style={{ display: "inline-block", background: GOLD, color: NAVY, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "16px 36px", textDecoration: "none", transition: "all 0.25s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = GOLD_LIGHT; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = GOLD; }}
              >
                Request Pilot Access
              </a>
              <button
                onClick={() => document.getElementById("platform")?.scrollIntoView({ behavior: "smooth" })}
                style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = GOLD_LIGHT; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)"; }}
              >
                See How It Works
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right — execution cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Card 1 */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", padding: "22px 26px", animation: "hpFloat 6s ease-in-out infinite" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>Strategic Trigger Detected</span>
                <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", padding: "3px 10px", background: "rgba(43,138,110,0.2)", color: TEAL_LIGHT }}>● Live</span>
              </div>
              <div style={{ ...CG, fontSize: 17, fontWeight: 500, color: "#fff", marginBottom: 6, lineHeight: 1.2 }}>Q4 Revenue Miss — Board Response Required</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 14 }}>Playbook #47 · Financial Response · Auto-matched by AI</div>
              <div style={{ height: 2, background: "rgba(255,255,255,0.08)", position: "relative" }}>
                <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg,${TEAL},${TEAL_LIGHT})` }} />
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: TEAL_LIGHT }}>Triggered 0:42 ago</span>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>Executing now</span>
              </div>
            </div>

            {/* Card 2 — live progress */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", padding: "22px 26px", animation: "hpFloat 6s ease-in-out infinite", animationDelay: "-2s" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: TEAL_LIGHT }}>Executing</span>
                <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", padding: "3px 10px", background: "rgba(201,168,76,0.15)", color: GOLD }}>⟳ Running</span>
              </div>
              <div style={{ ...CG, fontSize: 17, fontWeight: 500, color: "#fff", marginBottom: 6, lineHeight: 1.2 }}>Cross-Functional Response Deployed</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 14 }}>14 tasks assigned · 6 stakeholders notified · Budget allocated</div>
              <div style={{ height: 2, background: "rgba(255,255,255,0.08)", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${cardProgress}%`, background: `linear-gradient(90deg,${TEAL},${TEAL_LIGHT})`, transition: "width 0.3s linear" }} />
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: TEAL_LIGHT }}>8 min 14 sec</span>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>9 of 14 tasks complete</span>
              </div>
            </div>

            {/* Card 3 — complete */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", padding: "22px 26px", opacity: 0.5, animation: "hpFloat 6s ease-in-out infinite", animationDelay: "-4s" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>Previous</span>
                <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", padding: "3px 10px", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.3)" }}>✓ Complete</span>
              </div>
              <div style={{ ...CG, fontSize: 17, fontWeight: 500, color: "#fff", marginBottom: 6, lineHeight: 1.2 }}>Competitor Launch — Market Response</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 14 }}>Playbook #112 · Completed in 11m 03s</div>
              <div style={{ height: 2, background: "rgba(255,255,255,0.15)" }} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}>3 hours ago</span>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>14 / 14 ✓</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ STATS BAR ══ */}
      <div style={{ background: OFF_WHITE, borderBottom: `1px solid ${BORDER}`, padding: "36px 56px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", maxWidth: 1200, margin: "0 auto" }}>
          {([
            { num: "12m", label: "Trigger-to-Execution", gold: true },
            { num: "170", label: "Strategic Playbooks", gold: false },
            { num: "9", label: "Execution Domains", gold: false },
            { num: "72h", label: "Avg Lag Eliminated", gold: false },
            { num: "F1000", label: "Target Enterprise", gold: false },
          ] as { num: string; label: string; gold: boolean }[]).map((s, i) => (
            <div key={i} style={{ padding: "0 32px", borderRight: i < 4 ? `1px solid ${BORDER}` : "none", ...(i === 0 && { paddingLeft: 0 }) }}>
              <div style={{ ...CG, fontWeight: 600, fontSize: 44, color: s.gold ? GOLD : NAVY, lineHeight: 1, marginBottom: 4 }}>{s.num}</div>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: TEXT_MUTED }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ PROBLEM / THE GAP ══ */}
      <section id="platform" style={{ padding: "100px 56px", background: OFF_WHITE }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start", maxWidth: 1200, margin: "0 auto" }}>
          <div>
            <Reveal><Eyebrow color="teal">The Real Cost of Alignment</Eyebrow></Reveal>
            <Reveal delay={0.1}>
              <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(32px, 4vw, 52px)", lineHeight: 1.1, color: NAVY, marginBottom: 20 }}>
                After 72 Hours,<br />They're Ready to Start<br />
                <em style={{ fontStyle: "italic", color: TEAL }}>Planning.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p style={{ fontSize: 15, fontWeight: 400, lineHeight: 1.9, color: "#374151", maxWidth: 480 }}>
                Most enterprises have systematized finance (ERP), customers (CRM), and tickets (ITSM). But strategic coordination — the moments that determine competitive outcomes — still runs on <strong style={{ color: NAVY, fontWeight: 700 }}>email chains, ad hoc war rooms, and 72-hour alignment cycles.</strong>
              </p>
              <p style={{ fontSize: 15, fontWeight: 400, lineHeight: 1.9, color: "#374151", maxWidth: 480, marginTop: 16 }}>
                After 12 minutes with Execution OS, you're already in motion — roles clear, tasks assigned, decisions made. That's not an incremental improvement. That's a structural advantage.
              </p>
            </Reveal>
          </div>

          <div>
            <Reveal delay={0.15}>
              <div style={{ marginBottom: 20 }}>
                {([
                  { label: "Without Execution OS", pct: 85, color: "#EF4444" },
                  { label: "Industry Average", pct: 55, color: "#F59E0B" },
                  { label: "With Execution OS", pct: 12, color: TEAL },
                ] as { label: string; pct: number; color: string }[]).map((b, i) => (
                  <div key={i} style={{ marginBottom: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>{b.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: b.color }}>{b.pct}h avg lag</span>
                    </div>
                    <div style={{ height: 8, background: "#E5E7EB", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${b.pct}%`, background: b.color, borderRadius: 4, transition: "width 1s ease" }} />
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.25}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {([
                  { title: "Who Should Own This?", desc: "Decision rights undefined until a meeting can be scheduled" },
                  { title: "Who Needs to Be Involved?", desc: "Roles negotiated in real time while the moment passes" },
                  { title: "What's Our Plan?", desc: "Playbook built from scratch after the trigger fires" },
                  { title: "Ready to Start Figuring It Out", desc: "72 hours later — they haven't executed. They've aligned." },
                ] as { title: string; desc: string }[]).map((c, i) => (
                  <div key={i} style={{ background: "#fff", border: `1px solid ${BORDER}`, padding: "20px 22px" }}>
                    <div style={{ width: 32, height: 2, background: GOLD, marginBottom: 12 }} />
                    <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 6 }}>{c.title}</div>
                    <div style={{ fontSize: 12, fontWeight: 400, color: "#6B7280", lineHeight: 1.6 }}>{c.desc}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ IDEA FRAMEWORK ══ */}
      <section style={{ padding: "100px 56px", background: NAVY, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(201,168,76,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.04) 1px,transparent 1px)`, backgroundSize: "48px 48px" }} />
        <div style={{ position: "relative", zIndex: 2, maxWidth: 1200, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center" }}>
            <Eyebrow color="gold" center>The IDEA Framework™</Eyebrow>
            <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(32px,4vw,52px)", lineHeight: 1.1, color: "#fff", marginBottom: 16 }}>
              Four Phases. One Operating Rhythm.
            </h2>
            <p style={{ fontSize: 15, fontWeight: 400, lineHeight: 1.85, color: "rgba(255,255,255,0.5)", maxWidth: 580, margin: "0 auto 56px" }}>
              Execution OS structures every strategic response through the IDEA Framework — a repeatable execution infrastructure built for Fortune 1000 speed.
            </p>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, background: "rgba(255,255,255,0.06)" }}>
            {([
              { phase: "I", word: "IDENTIFY", color: GOLD, desc: "Monitor 170+ strategic trigger categories across financial, competitive, regulatory, and operational domains. AI pattern-matching surfaces the right playbook in seconds." },
              { phase: "D", word: "DETECT", color: TEAL_LIGHT, desc: "Real-time signal ingestion from 12 enterprise systems. Weak signals become strong alerts before the market reacts. No lag between event and awareness." },
              { phase: "E", word: "EXECUTE", color: "#C9A84C", desc: "12-minute trigger-to-execution. Projects created, tasks assigned, documents staged, budgets allocated — all before your first committee email is sent." },
              { phase: "A", word: "ADVANCE", color: "#2B8A6E", desc: "Capture institutional memory. Every execution becomes training data for future responses. The organization gets smarter with each event." },
            ] as { phase: string; word: string; color: string; desc: string }[]).map((f, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div style={{ background: "rgba(255,255,255,0.03)", padding: "40px 32px", minHeight: 280, transition: "background 0.3s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
                >
                  <div style={{ ...CG, fontSize: 52, fontWeight: 300, color: f.color, lineHeight: 1, marginBottom: 8 }}>{f.phase}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", color: f.color, marginBottom: 20 }}>{f.word}</div>
                  <div style={{ width: 32, height: 1, background: "rgba(255,255,255,0.15)", marginBottom: 20 }} />
                  <p style={{ fontSize: 13, fontWeight: 400, lineHeight: 1.8, color: "rgba(255,255,255,0.5)" }}>{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PLAYBOOK DOMAINS ══ */}
      <section style={{ padding: "100px 56px", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center" }}>
            <Eyebrow color="teal" center>170 Strategic Playbooks</Eyebrow>
            <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(32px,4vw,52px)", lineHeight: 1.1, color: NAVY, marginBottom: 16 }}>
              Execution-Ready Plans.<br />
              <em style={{ fontStyle: "italic", color: TEAL }}>Not Templates to Discuss.</em>
            </h2>
            <p style={{ fontSize: 15, fontWeight: 400, lineHeight: 1.85, color: "#6B7280", maxWidth: 560, margin: "0 auto 64px" }}>
              Each playbook includes decision rights mapped before the moment, roles defined with precision, tasks assigned automatically, and escalation paths built in — with a timeline running from activation, not from your first alignment meeting.
            </p>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
            {DOMAINS.map((d, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <div
                  style={{ border: `1px solid ${d.accent ? TEAL : BORDER}`, padding: "32px 28px", cursor: "pointer", transition: "all 0.3s", position: "relative", background: d.accent ? `linear-gradient(135deg,rgba(43,138,110,0.04),rgba(43,138,110,0.08))` : "#fff" }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = d.accent ? TEAL_LIGHT : TEAL;
                    el.style.transform = "translateY(-3px)";
                    el.style.boxShadow = "0 8px 32px rgba(43,138,110,0.12)";
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = d.accent ? TEAL : BORDER;
                    el.style.transform = "translateY(0)";
                    el.style.boxShadow = "none";
                  }}
                  onClick={() => go("/playbook-library")}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "#D1D5DB" }}>{d.num}</span>
                    <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", padding: "3px 10px", background: d.accent ? "rgba(43,138,110,0.12)" : "rgba(10,15,46,0.06)", color: d.accent ? TEAL : "#6B7280" }}>{d.count}</span>
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: NAVY, marginBottom: 12, lineHeight: 1.2 }}>{d.title}</h3>
                  <p style={{ fontSize: 13, fontWeight: 400, lineHeight: 1.75, color: "#6B7280" }}>{d.desc}</p>
                  {d.accent && (
                    <div style={{ position: "absolute", top: 0, right: 0, width: 3, height: "100%", background: TEAL }} />
                  )}
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3} style={{ textAlign: "center", marginTop: 48 }}>
            <button
              onClick={() => go("/playbook-library")}
              style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: TEAL, background: "none", border: `1px solid ${TEAL}`, padding: "14px 32px", cursor: "pointer", transition: "all 0.3s" }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = TEAL; el.style.color = "#fff"; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "none"; el.style.color = TEAL; }}
            >
              Browse Full Playbook Library
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </Reveal>
        </div>
      </section>

      {/* ══ AI + HUMAN PARTNERSHIP ══ */}
      <section style={{ padding: "100px 56px", background: NAVY, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -80, left: -80, width: 500, height: 500, background: "radial-gradient(ellipse,rgba(43,138,110,0.1) 0%,transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -80, right: -80, width: 400, height: 400, background: "radial-gradient(ellipse,rgba(201,168,76,0.08) 0%,transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 2, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center", maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <Eyebrow color="gold">Human-AI Partnership</Eyebrow>
            <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(32px,4vw,52px)", lineHeight: 1.1, color: "#fff", marginBottom: 20 }}>
              AI Does the Work.<br />
              <em style={{ fontStyle: "italic", color: GOLD_LIGHT }}>Humans Make the Call.</em>
            </h2>
            <p style={{ fontSize: 15, fontWeight: 400, lineHeight: 1.9, color: "rgba(255,255,255,0.55)", marginBottom: 32 }}>
              Execution OS is built on a clear philosophy: AI handles monitoring, pattern detection, playbook selection, and orchestration. Human executives retain ultimate decision authority.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {([
                { label: "AI", role: "Monitors 1,000+ signals in real-time, matches triggers to playbooks, auto-assigns tasks, stages documents" },
                { label: "Human", role: "Approves activation, modifies assignments, makes final escalation decisions, captures strategic insight" },
              ] as { label: string; role: string }[]).map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 16, padding: "18px 20px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", padding: "3px 10px", background: i === 0 ? "rgba(43,138,110,0.2)" : "rgba(201,168,76,0.15)", color: i === 0 ? TEAL_LIGHT : GOLD, flexShrink: 0 }}>{r.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 400, color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>{r.role}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", padding: "40px 36px" }}>
              <div style={{ ...CG, fontSize: 11, fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", color: GOLD, marginBottom: 24 }}>Live Execution Pulse</div>
              {([
                { label: "Signal Monitoring", val: "Active", color: TEAL_LIGHT },
                { label: "Pattern Detection", val: "Real-time", color: TEAL_LIGHT },
                { label: "Playbook Matching", val: "AI Assisted", color: GOLD },
                { label: "Task Orchestration", val: "Automated", color: GOLD },
                { label: "Approval Gate", val: "Human Required", color: "#2B8A6E" },
                { label: "Budget Release", val: "Human Required", color: "#2B8A6E" },
              ] as { label: string; val: string; color: string }[]).map((row, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.6)" }}>{row.label}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: row.color }}>{row.val}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section style={{ padding: "100px 56px", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center" }}>
            <Eyebrow color="teal" center>How It Works</Eyebrow>
            <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(32px,4vw,52px)", lineHeight: 1.1, color: NAVY, marginBottom: 16 }}>
              From Signal to Execution<br />
              <em style={{ fontStyle: "italic", color: TEAL }}>in 12 Minutes</em>
            </h2>
            <p style={{ fontSize: 15, fontWeight: 400, color: "#6B7280", maxWidth: 500, margin: "0 auto 64px", lineHeight: 1.85 }}>
              Four steps that replace the 72-hour alignment cycle. No meetings to schedule. No coordination to negotiate.
            </p>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0, position: "relative" }}>
            <div style={{ position: "absolute", top: 40, left: "12.5%", right: "12.5%", height: 1, background: `linear-gradient(90deg,${TEAL},${GOLD})`, zIndex: 0 }} />
            {([
              { step: "01", time: "0:00", title: "Signal Detected", desc: "Execution OS integrates with Jira, Slack, Teams, Salesforce, and ServiceNow — detecting the signals that matter before your next committee email is drafted." },
              { step: "02", time: "0:45", title: "Playbook Activated", desc: "The right playbook fires automatically. No meetings to schedule. No alignment to negotiate. One click deploys the entire coordinated response." },
              { step: "03", time: "3:00", title: "Roles Assigned", desc: "Everyone knows their part. Decision rights are mapped. Tasks are distributed to the right people with deadlines and pre-approved budgets." },
              { step: "04", time: "12:00", title: "Execution Underway", desc: "You're not planning a response. You're already executing one. Status visible in real-time. The market doesn't wait — now neither do you." },
            ] as { step: string; time: string; title: string; desc: string }[]).map((s, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div style={{ padding: "0 32px", textAlign: "center", position: "relative", zIndex: 1 }}>
                  <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#fff", border: `2px solid ${i === 0 || i === 3 ? TEAL : GOLD}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
                    <span style={{ ...CG, fontSize: 22, fontWeight: 600, color: i === 0 || i === 3 ? TEAL : GOLD }}>{s.step}</span>
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: GOLD, marginBottom: 8 }}>{s.time} min</div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: NAVY, marginBottom: 12 }}>{s.title}</h3>
                  <p style={{ fontSize: 13, fontWeight: 400, color: "#6B7280", lineHeight: 1.75 }}>{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ INTEGRATIONS ══ */}
      <section style={{ padding: "80px 56px", background: OFF_WHITE, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: TEXT_MUTED, marginBottom: 32 }}>
              Connects With Your Enterprise Stack
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
              {INTEGRATIONS.map((name, i) => (
                <span key={i} style={{ fontSize: 12, fontWeight: 600, padding: "8px 18px", background: "#fff", border: `1px solid ${BORDER}`, color: "#374151", letterSpacing: "0.02em" }}>
                  {name}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ QUOTE ══ */}
      <section style={{ padding: "100px 56px", background: "#fff" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <div style={{ width: 48, height: 1, background: GOLD, margin: "0 auto 40px" }} />
            <blockquote style={{ ...CG, fontSize: "clamp(26px,3.5vw,44px)", fontWeight: 400, fontStyle: "italic", lineHeight: 1.35, color: NAVY, marginBottom: 32 }}>
              "This isn't the same thing done faster. It's a different outcome. Traditional coordination ends with a meeting scheduled. Execution OS ends with execution underway."
            </blockquote>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: TEXT_MUTED }}>
              Built from 20+ years of Fortune 500 transformation · VaughnMartin
            </div>
            <div style={{ width: 48, height: 1, background: GOLD, margin: "40px auto 0" }} />
          </Reveal>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section style={{ padding: "100px 56px", background: NAVY, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(201,168,76,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.04) 1px,transparent 1px)`, backgroundSize: "48px 48px" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, background: "radial-gradient(ellipse,rgba(43,138,110,0.08) 0%,transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 2, maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <Eyebrow color="gold" center>The Gap Isn't Talent. It's Infrastructure.</Eyebrow>
            <h2 style={{ ...CG, fontWeight: 600, fontSize: "clamp(34px,4.5vw,60px)", lineHeight: 1.1, color: "#fff", marginBottom: 20 }}>
              The Coordination Infrastructure<br />
              <em style={{ fontStyle: "italic", color: GOLD_LIGHT }}>Enterprises Are Missing. Built.</em>
            </h2>
            <p style={{ fontSize: 15, fontWeight: 400, lineHeight: 1.9, color: "rgba(255,255,255,0.5)", maxWidth: 520, margin: "0 auto 48px" }}>
              See Execution OS in action. When a signal fires, you're not scheduling a meeting — you're already executing. Join the pilot and run your first playbook.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 20, justifyContent: "center" }}>
              <a
                href="/api/login"
                target="_top"
                style={{ display: "inline-block", background: GOLD, color: NAVY, fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "18px 44px", textDecoration: "none", transition: "all 0.25s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = GOLD_LIGHT; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = GOLD; }}
              >
                Request Pilot Access
              </a>
              <button
                onClick={() => go("/try-demo")}
                style={{ display: "inline-block", fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "18px 44px", background: "none", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)", cursor: "pointer", transition: "all 0.25s" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = GOLD; el.style.color = GOLD; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(255,255,255,0.2)"; el.style.color = "rgba(255,255,255,0.7)"; }}
              >
                Watch Live Demo
              </button>
            </div>
            <div style={{ marginTop: 40, display: "flex", alignItems: "center", justifyContent: "center", gap: 32 }}>
              {(["No contract required", "12-minute onboarding", "Full playbook access"] as string[]).map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: TEAL_LIGHT }} />
                  <span style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.4)" }}>{t}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
