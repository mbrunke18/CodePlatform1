import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { updatePageMetadata } from "@/lib/seo";
import { VaughnMartinLogo } from "@/components/VaughnMartinLogo";
import {
  ArrowRight, CheckCircle, ChevronRight, Clock, Shield,
  TrendingUp, Zap, Target, Building2, BarChart3, Calendar,
  Play, FileText, Lock, Globe
} from "lucide-react";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const IVORY = "#F0EDE4";
const BC = { fontFamily: "'Barlow Condensed', sans-serif" } as const;
const CG = { fontFamily: "'Cormorant Garamond', Georgia, serif" } as const;

const CHAPTERS = [
  { n: 1, label: "The Problem" },
  { n: 2, label: "The Platform" },
  { n: 3, label: "The Proof" },
  { n: 4, label: "The Opportunity" },
  { n: 5, label: "The Ask" },
];

function GoldRule() {
  return <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${GOLD}55, transparent)`, margin: "0 auto", maxWidth: 600 }} />;
}

function ChapterLabel({ n, text }: { n: number; text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
      <div style={{ width: 32, height: 32, borderRadius: "50%", border: `1px solid ${GOLD}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <span style={{ ...BC, color: GOLD, fontSize: 11, fontWeight: 800, letterSpacing: "0.06em" }}>{String(n).padStart(2, "0")}</span>
      </div>
      <span style={{ ...BC, color: GOLD, fontSize: 10, fontWeight: 800, letterSpacing: "0.24em", textTransform: "uppercase" }}>{text}</span>
      <div style={{ flex: 1, height: 1, background: `${GOLD}30` }} />
    </div>
  );
}

function StatBlock({ value, label, sub }: { value: string; label: string; sub?: string }) {
  return (
    <div style={{ textAlign: "center", padding: "28px 24px", border: `1px solid ${GOLD}30`, background: `${GOLD}06` }}>
      <div style={{ ...CG, fontSize: "clamp(32px,4vw,52px)", fontWeight: 700, color: GOLD, lineHeight: 1 }}>{value}</div>
      <div style={{ ...BC, color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginTop: 8 }}>{label}</div>
      {sub && <div style={{ ...BC, color: "rgba(255,255,255,0.5)", fontSize: 10, letterSpacing: "0.08em", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function ProofRow({ gap, traditional, readiness }: { gap: string; traditional: string; readiness: string }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: `1px solid rgba(255,255,255,0.07)` }}>
      <div style={{ padding: "14px 20px", ...BC, color: "rgba(255,255,255,0.85)", fontSize: 13, fontWeight: 600, borderRight: `1px solid rgba(255,255,255,0.07)` }}>{gap}</div>
      <div style={{ padding: "14px 20px", ...BC, color: "rgba(255,255,255,0.45)", fontSize: 12, borderRight: `1px solid rgba(255,255,255,0.07)` }}>{traditional}</div>
      <div style={{ padding: "14px 20px", ...BC, color: TEAL, fontSize: 12, fontWeight: 700 }}>{readiness}</div>
    </div>
  );
}

export default function InvestorTour() {
  const [activeChapter, setActiveChapter] = useState(1);
  const [, setLocation] = useLocation();
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    updatePageMetadata({
      title: "Investor Tour | VaughnMartin Readiness OS",
      description: "A guided walkthrough of the VaughnMartin Readiness OS investment thesis — the operating model layer enterprises are missing.",
      ogTitle: "Investor Tour — VaughnMartin Readiness OS",
      ogDescription: "The Problem. The Platform. The Proof. The Opportunity. The Ask. A complete investor journey in one place.",
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sectionRefs.current.indexOf(entry.target as HTMLElement);
            if (idx !== -1) setActiveChapter(idx + 1);
          }
        });
      },
      { threshold: 0.35 }
    );
    sectionRefs.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  function scrollTo(n: number) {
    const el = sectionRefs.current[n - 1];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>

      {/* ── TOP BRAND BAR ─────────────────────────────────────── */}
      <div style={{ background: NAVY, padding: "16px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${GOLD}30` }}>
        <VaughnMartinLogo color="light" height={36} variant="full" />
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL, animation: "pulse 2s infinite" }} />
          <span style={{ ...BC, color: "rgba(255,255,255,0.6)", fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" }}>Investor Overview · Confidential</span>
        </div>
      </div>

      {/* ── STICKY CHAPTER NAV ────────────────────────────────── */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: NAVY, borderBottom: `1px solid ${GOLD}25`, padding: "0 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "stretch", gap: 0 }}>
          {CHAPTERS.map((ch, i) => {
            const active = activeChapter === ch.n;
            const done = activeChapter > ch.n;
            return (
              <button
                key={ch.n}
                onClick={() => scrollTo(ch.n)}
                style={{
                  flex: 1, padding: "14px 8px", background: "transparent", border: "none",
                  borderBottom: active ? `2px solid ${GOLD}` : "2px solid transparent",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  transition: "all 0.2s",
                }}
              >
                <span style={{
                  ...BC, width: 20, height: 20, borderRadius: "50%",
                  background: done ? TEAL : active ? GOLD : "rgba(255,255,255,0.12)",
                  color: done || active ? NAVY : "rgba(255,255,255,0.4)",
                  fontSize: 9, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  {done ? "✓" : ch.n}
                </span>
                <span style={{ ...BC, color: active ? GOLD : done ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                  {ch.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          CHAPTER 1 — THE PROBLEM
      ══════════════════════════════════════════════════════════ */}
      <section
        id="chapter-1"
        ref={(el) => { sectionRefs.current[0] = el; }}
        style={{ background: NAVY, padding: "80px 40px 72px" }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <ChapterLabel n={1} text="The Problem" />

          <h1 style={{ ...CG, fontSize: "clamp(36px,5vw,68px)", fontWeight: 700, color: "#fff", lineHeight: 1.1, marginBottom: 28, maxWidth: 820 }}>
            Enterprise work was designed for a world{" "}
            <span style={{ color: GOLD }}>without AI.</span>
          </h1>

          <p style={{ color: "rgba(255,255,255,0.72)", fontSize: 18, lineHeight: 1.75, maxWidth: 760, marginBottom: 48 }}>
            Committees, alignment cycles, and coordination delays exist because humans couldn't process information fast enough to act decisively.
            Every vendor bolted AI onto that old model — faster spreadsheets, smarter summaries, better notes from the same slow meetings.
            <strong style={{ color: "#fff" }}> The operating model itself was never rebuilt.</strong>
          </p>

          <div style={{ background: `${GOLD}12`, border: `1px solid ${GOLD}35`, borderLeft: `4px solid ${GOLD}`, padding: "28px 32px", marginBottom: 48, maxWidth: 780 }}>
            <div style={{ ...BC, color: GOLD, fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>The Mobilization Tax</div>
            <p style={{ ...CG, color: "#fff", fontSize: "clamp(18px,2.2vw,24px)", fontWeight: 600, lineHeight: 1.5, margin: 0 }}>
              When a strategic trigger fires, the enterprise spends weeks just to <em>mobilize</em> —
              figuring out who needs to be in the room, agreeing on a plan, aligning stakeholders —
              before execution even begins.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, marginBottom: 56 }}>
            <StatBlock value="30 days" label="Traditional mobilization" sub="Conservative baseline" />
            <StatBlock value="12 min" label="Readiness OS response" sub="After trigger detection" />
            <StatBlock value="3,600×" label="Execution head start" sub="Not faster — pre-staged" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 56 }}>
            {[
              { icon: TrendingUp, label: "Growth & Positioning", ex: "M&A, market entry, competitor displacement" },
              { icon: Shield, label: "Risk & Resilience", ex: "Ransomware, regulatory inquiry, supply chain" },
              { icon: Zap, label: "Transformation", ex: "Workforce restructuring, go-to-market acceleration" },
            ].map(({ icon: Icon, label, ex }) => (
              <div key={label} style={{ padding: "24px", border: `1px solid rgba(255,255,255,0.1)`, background: "rgba(255,255,255,0.03)" }}>
                <Icon className="w-5 h-5" style={{ color: GOLD, marginBottom: 12 }} />
                <div style={{ ...BC, color: "#fff", fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", marginBottom: 6 }}>{label}</div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, lineHeight: 1.5 }}>{ex}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "20px 28px", background: "rgba(255,255,255,0.04)", border: `1px solid rgba(255,255,255,0.1)`, maxWidth: 680 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${GOLD}20`, border: `1px solid ${GOLD}40`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ ...CG, color: GOLD, fontSize: 13, fontWeight: 700 }}>"</span>
            </div>
            <div>
              <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                "Martin is building the architecture that makes clarity possible before pressure arrives."
              </p>
              <p style={{ ...BC, color: GOLD, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", marginTop: 6, marginBottom: 0, textTransform: "uppercase" }}>
                Dr. Kerry Huang · Fortune 50 AVP · ESI Top 1% Researcher · 408-firm study
              </p>
            </div>
          </div>

          <div style={{ marginTop: 52, display: "flex", justifyContent: "flex-end" }}>
            <button onClick={() => scrollTo(2)} style={{ display: "flex", alignItems: "center", gap: 10, background: "transparent", border: `1px solid ${GOLD}50`, color: GOLD, padding: "12px 28px", cursor: "pointer", ...BC, fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", transition: "all 0.2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = `${GOLD}15`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
            >
              Next: The Platform <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      <GoldRule />

      {/* ══════════════════════════════════════════════════════════
          CHAPTER 2 — THE PLATFORM
      ══════════════════════════════════════════════════════════ */}
      <section
        id="chapter-2"
        ref={(el) => { sectionRefs.current[1] = el; }}
        style={{ background: "#fff", padding: "80px 40px 72px" }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <ChapterLabel n={2} text="The Platform" />

          <h2 style={{ ...CG, fontSize: "clamp(30px,4vw,56px)", fontWeight: 700, color: NAVY, lineHeight: 1.12, marginBottom: 16, maxWidth: 780 }}>
            Readiness OS — the operating model layer
          </h2>
          <p style={{ ...CG, fontSize: "clamp(18px,2vw,24px)", color: GOLD, fontWeight: 600, fontStyle: "italic", marginBottom: 36 }}>
            Pre-staged before the trigger. Authorized in real time. 12 minutes.
          </p>

          <p style={{ color: "#374151", fontSize: 16, lineHeight: 1.8, maxWidth: 760, marginBottom: 52 }}>
            Readiness OS is not a project management tool, a notification system, or an AI copilot.
            It is <strong>Readiness Infrastructure</strong> — the preparation architecture that ensures
            every response is staged before the trigger fires, so the 12-minute mobilization
            is already complete when the situation presents itself.
          </p>

          {/* How it works — 4 steps */}
          <div style={{ marginBottom: 56 }}>
            <div style={{ ...BC, color: NAVY, fontSize: 10, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 24 }}>How It Executes</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: `${NAVY}15` }}>
              {[
                { n: "01", label: "Signal Detected", desc: "231 continuous monitoring thresholds fire when crossed" },
                { n: "02", label: "Protocol Matched", desc: "180 pre-built Readiness Protocols match to situation type" },
                { n: "03", label: "Executive Authorizes", desc: "One decision — everything pre-staged, no coordination needed" },
                { n: "04", label: "12-Minute Execution", desc: "Teams mobilized, tasks staged, stakeholders notified simultaneously" },
              ].map(({ n, label, desc }) => (
                <div key={n} style={{ background: "#fff", padding: "28px 24px", borderTop: `3px solid ${GOLD}` }}>
                  <div style={{ ...BC, color: GOLD, fontSize: 22, fontWeight: 800, marginBottom: 10 }}>{n}</div>
                  <div style={{ ...BC, color: NAVY, fontSize: 13, fontWeight: 700, letterSpacing: "0.04em", marginBottom: 8 }}>{label}</div>
                  <div style={{ color: "#6B7280", fontSize: 12, lineHeight: 1.6 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Three core numbers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 52 }}>
            {[
              { value: "180", label: "Readiness Protocols", sub: "Pre-built across 3 strategic domains", color: NAVY },
              { value: "231", label: "Trigger Patterns", sub: "Continuously monitored, system-detected", color: NAVY },
              { value: "15–20", label: "Situations per year", sub: "Average enterprise facing strategic events", color: NAVY },
            ].map(({ value, label, sub, color }) => (
              <div key={label} style={{ padding: "28px 24px", border: `1px solid ${NAVY}20`, background: IVORY, borderTop: `3px solid ${NAVY}` }}>
                <div style={{ ...CG, fontSize: 44, fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
                <div style={{ ...BC, color: NAVY, fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 8 }}>{label}</div>
                <div style={{ color: "#6B7280", fontSize: 11, marginTop: 4 }}>{sub}</div>
              </div>
            ))}
          </div>

          {/* Microsoft framing */}
          <div style={{ background: NAVY, padding: "32px 36px", marginBottom: 52, borderLeft: `4px solid ${TEAL}` }}>
            <div style={{ ...BC, color: TEAL, fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>Microsoft Framing</div>
            <p style={{ ...CG, color: "#fff", fontSize: "clamp(16px,2vw,22px)", fontWeight: 600, lineHeight: 1.55, margin: 0 }}>
              "Every enterprise has Microsoft's AI stack. None have the operating model to use it."
              <span style={{ color: "rgba(255,255,255,0.6)", fontWeight: 400 }}> Readiness OS is the operating model layer above the Microsoft investment — not a replacement, an orchestrator.</span>
            </p>
          </div>

          {/* ADVANCE 2.0 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 52 }}>
            <div style={{ padding: "28px 28px", border: `1px solid ${GOLD}30`, background: `${GOLD}06` }}>
              <div style={{ ...BC, color: GOLD, fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>ADVANCE 2.0 — The Moat</div>
              <p style={{ color: "#374151", fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                Every activation close-out generates preparation updates. The system measures what was expected vs. what actually happened,
                classifying each improvement as proven or disproven. <strong>Knowledge compounds with every activation.</strong> The longer a customer uses Readiness OS, the wider the moat grows — and the harder it is to replace.
              </p>
            </div>
            <div style={{ padding: "28px 28px", border: `1px solid ${NAVY}20`, background: IVORY }}>
              <div style={{ ...BC, color: NAVY, fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>Authorization Model</div>
              <p style={{ color: "#374151", fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                No Readiness Protocol activates without executive sign-off. The system pre-stages everything — the decision remains human.
                <strong> AI monitors. Executives authorize.</strong> This is not automation replacing judgment. It is preparation compressing delay.
              </p>
            </div>
          </div>

          <div style={{ marginTop: 52, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button onClick={() => scrollTo(1)} style={{ ...BC, background: "transparent", border: "none", color: "#9CA3AF", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer" }}>
              ← Back
            </button>
            <button onClick={() => scrollTo(3)} style={{ display: "flex", alignItems: "center", gap: 10, background: NAVY, border: "none", color: "#fff", padding: "12px 28px", cursor: "pointer", ...BC, fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.88"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
            >
              Next: The Proof <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      <GoldRule />

      {/* ══════════════════════════════════════════════════════════
          CHAPTER 3 — THE PROOF
      ══════════════════════════════════════════════════════════ */}
      <section
        id="chapter-3"
        ref={(el) => { sectionRefs.current[2] = el; }}
        style={{ background: NAVY, padding: "80px 40px 72px" }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <ChapterLabel n={3} text="The Proof" />

          <h2 style={{ ...CG, fontSize: "clamp(30px,4vw,56px)", fontWeight: 700, color: "#fff", lineHeight: 1.12, marginBottom: 28, maxWidth: 740 }}>
            No alternative closes all 12 gaps.
            <span style={{ color: GOLD }}> Readiness OS closes every one.</span>
          </h2>

          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 16, lineHeight: 1.8, maxWidth: 720, marginBottom: 52 }}>
            ServiceNow reacts. Everbridge notifies. McKinsey documents. Every alternative responds after the trigger fires.
            Readiness OS is the first platform built to make the response ready before the trigger fires.
          </p>

          {/* Comparison table */}
          <div style={{ marginBottom: 56, border: `1px solid rgba(255,255,255,0.1)` }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", background: `rgba(255,255,255,0.05)`, borderBottom: `1px solid rgba(255,255,255,0.1)` }}>
              <div style={{ padding: "14px 20px", ...BC, color: "rgba(255,255,255,0.5)", fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase" }}>Mobilization Gap</div>
              <div style={{ padding: "14px 20px", ...BC, color: "rgba(255,255,255,0.5)", fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", borderLeft: `1px solid rgba(255,255,255,0.07)` }}>Traditional / Competitors</div>
              <div style={{ padding: "14px 20px", ...BC, color: TEAL, fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", borderLeft: `1px solid rgba(255,255,255,0.07)` }}>Readiness OS</div>
            </div>
            <ProofRow gap="Signal Detection" traditional="Ad-hoc, reactive monitoring" readiness="Automatic — 231 thresholds, continuous" />
            <ProofRow gap="Protocol Match" traditional="Committees decide which plan" readiness="Pre-staged — 180 Protocols ready before trigger" />
            <ProofRow gap="Decision Authority" traditional="Weeks of alignment meetings" readiness="Pre-defined cold — one executive authorization" />
            <ProofRow gap="Team Assembly" traditional="Email chains, manual scheduling" readiness="Pre-assigned stakeholders — automated at trigger" />
            <ProofRow gap="Budget Authorization" traditional="Emergency approval cycle" readiness="Pre-authorized per protocol, auto-released" />
            <ProofRow gap="External Counsel" traditional="Sourcing mid-crisis" readiness="Retainers on standby, briefed before arrival" />
            <ProofRow gap="Task Sequencing" traditional="Improvised in real time" readiness="22+ tasks in correct order — automatic" />
            <ProofRow gap="System Coordination" traditional="Manual hand-offs between tools" readiness="55+ connectors, systems coordinate automatically" />
            <ProofRow gap="Communications" traditional="Drafted under pressure" readiness="Approved messaging frameworks — pre-staged" />
            <ProofRow gap="Legal & Compliance" traditional="Researched post-trigger" readiness="Disclosure requirements mapped per situation" />
            <ProofRow gap="Governance Record" traditional="Reconstructed after the fact" readiness="Complete audit trail — auto-generated" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", background: `${GOLD}12`, borderTop: `2px solid ${GOLD}` }}>
              <div style={{ padding: "16px 20px", ...BC, color: GOLD, fontSize: 13, fontWeight: 800 }}>Readiness OS Score</div>
              <div style={{ padding: "16px 20px", ...BC, color: "rgba(255,255,255,0.35)", fontSize: 13, borderLeft: `1px solid rgba(255,255,255,0.07)` }}>0 / 12 — all reactive</div>
              <div style={{ padding: "16px 20px", ...BC, color: TEAL, fontSize: 16, fontWeight: 800, borderLeft: `1px solid rgba(255,255,255,0.07)` }}>12 / 12 — All closed</div>
            </div>
          </div>

          {/* Three scenario proof points */}
          <div style={{ ...BC, color: GOLD, fontSize: 10, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 20 }}>Real Scenario Outcomes</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 52 }}>
            {[
              { situation: "Ransomware Attack", without: "$36.7M impact · 30-day mobilization", with: "Contained in 12 min · $36M+ protected", domain: "Risk & Resilience" },
              { situation: "Activist Investor", without: "Position unclear · IR improvising", with: "Full board brief pre-staged · messaging authorized", domain: "Risk & Resilience" },
              { situation: "Supply Chain Collapse", without: "$96M+ production impact · 4-5 days to respond", with: "Alternates activated · customers notified in 12 min", domain: "Risk & Resilience" },
            ].map(({ situation, without, with: withROS, domain }) => (
              <div key={situation} style={{ border: `1px solid rgba(255,255,255,0.1)`, background: "rgba(255,255,255,0.03)", padding: "24px 20px" }}>
                <div style={{ ...BC, color: TEAL, fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 8 }}>{domain}</div>
                <div style={{ ...BC, color: "#fff", fontSize: 14, fontWeight: 700, marginBottom: 16 }}>{situation}</div>
                <div style={{ borderTop: `1px solid rgba(255,255,255,0.08)`, paddingTop: 12 }}>
                  <div style={{ ...BC, color: "rgba(255,255,255,0.4)", fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", marginBottom: 4 }}>WITHOUT</div>
                  <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, lineHeight: 1.5, marginBottom: 12 }}>{without}</div>
                  <div style={{ ...BC, color: TEAL, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", marginBottom: 4 }}>WITH READINESS OS</div>
                  <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, lineHeight: 1.5 }}>{withROS}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <a href="/proof-story" style={{ ...BC, color: GOLD, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, borderBottom: `1px solid ${GOLD}40`, paddingBottom: 2 }}>
              View full activation narratives with financial outcomes <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div style={{ marginTop: 52, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button onClick={() => scrollTo(2)} style={{ ...BC, background: "transparent", border: "none", color: "rgba(255,255,255,0.35)", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer" }}>
              ← Back
            </button>
            <button onClick={() => scrollTo(4)} style={{ display: "flex", alignItems: "center", gap: 10, background: GOLD, border: "none", color: NAVY, padding: "12px 28px", cursor: "pointer", ...BC, fontSize: 12, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.88"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
            >
              Next: The Opportunity <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      <GoldRule />

      {/* ══════════════════════════════════════════════════════════
          CHAPTER 4 — THE OPPORTUNITY
      ══════════════════════════════════════════════════════════ */}
      <section
        id="chapter-4"
        ref={(el) => { sectionRefs.current[3] = el; }}
        style={{ background: "#fff", padding: "80px 40px 72px" }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <ChapterLabel n={4} text="The Opportunity" />

          <h2 style={{ ...CG, fontSize: "clamp(30px,4vw,56px)", fontWeight: 700, color: NAVY, lineHeight: 1.12, marginBottom: 16, maxWidth: 760 }}>
            A category that didn't exist.
            <span style={{ color: GOLD }}> We built it.</span>
          </h2>
          <p style={{ color: "#6B7280", fontSize: 16, lineHeight: 1.8, maxWidth: 720, marginBottom: 52 }}>
            Every enterprise software category that exists today serves the <em>reaction</em> loop — faster alerts, better visibility, smarter reporting.
            No one built the preparation layer. VaughnMartin is first.
          </p>

          {/* Market framing */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 52 }}>
            <div style={{ padding: "32px 28px", background: NAVY, borderTop: `3px solid ${GOLD}` }}>
              <div style={{ ...BC, color: GOLD, fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>The Market</div>
              <div style={{ ...CG, color: "#fff", fontSize: "clamp(14px,1.8vw,18px)", fontWeight: 600, lineHeight: 1.6, marginBottom: 16 }}>
                Every organization from startup to Fortune 500 faces 15–20 strategic situations annually that demand a coordinated response.
              </div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, lineHeight: 1.7 }}>
                That's not insurance for rare catastrophes — it's a subscription compounding across 15–20 activations per year.
                The more activations, the wider the knowledge moat. The stickier the product.
              </div>
            </div>
            <div style={{ padding: "32px 28px", background: IVORY, borderTop: `3px solid ${NAVY}` }}>
              <div style={{ ...BC, color: NAVY, fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>The Model</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { label: "Readiness OS Core", value: "$120K–$240K/yr", note: "180 cross-industry protocols" },
                  { label: "Industry Protocol Packs", value: "+$40K–$80K/yr", note: "6 vertical packs: Health, Finance, Energy, Retail, Manufacturing, Tech" },
                  { label: "Founding Partner Program", value: "90-day validation", note: "Currently open — limited cohort" },
                ].map(({ label, value, note }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: 14, borderBottom: `1px solid ${NAVY}15` }}>
                    <div>
                      <div style={{ ...BC, color: NAVY, fontSize: 12, fontWeight: 700 }}>{label}</div>
                      <div style={{ color: "#6B7280", fontSize: 11, marginTop: 2 }}>{note}</div>
                    </div>
                    <div style={{ ...BC, color: GOLD, fontSize: 13, fontWeight: 800, flexShrink: 0, marginLeft: 12 }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Why now */}
          <div style={{ marginBottom: 52 }}>
            <div style={{ ...BC, color: NAVY, fontSize: 10, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 20 }}>Why Now</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {[
                { icon: Globe, title: "AI changed the constraint", body: "Information processing is no longer the bottleneck. Coordination architecture is. The 40-year-old meeting model is now the constraint AI can eliminate." },
                { icon: Building2, title: "Microsoft created demand", body: "Enterprise Microsoft AI investment is at all-time highs — Teams, Copilot Studio, Entra. None of it comes with an operating model. Readiness OS is that model." },
                { icon: BarChart3, title: "No incumbent owns this", body: "ServiceNow, Everbridge, McKinsey — all serve the reaction loop. No vendor has claimed the preparation layer. The category window is open." },
              ].map(({ icon: Icon, title, body }) => (
                <div key={title} style={{ padding: "24px 20px", border: `1px solid ${NAVY}15` }}>
                  <Icon className="w-5 h-5" style={{ color: NAVY, marginBottom: 12 }} />
                  <div style={{ ...BC, color: NAVY, fontSize: 13, fontWeight: 700, marginBottom: 8 }}>{title}</div>
                  <div style={{ color: "#6B7280", fontSize: 12, lineHeight: 1.65 }}>{body}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ADVANCE moat metric */}
          <div style={{ background: NAVY, padding: "32px 36px", display: "flex", alignItems: "center", gap: 40, flexWrap: "wrap" }}>
            <div>
              <div style={{ ...BC, color: GOLD, fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6 }}>The Moat Metric</div>
              <div style={{ ...CG, color: "#fff", fontSize: "clamp(14px,1.8vw,20px)", fontWeight: 600, lineHeight: 1.5 }}>
                Every activation makes the next response faster.<br />
                <span style={{ color: "rgba(255,255,255,0.6)", fontWeight: 400, fontSize: "0.85em" }}>
                  ADVANCE 2.0 calculates the months it would take a competitor to rebuild the same evidence-backed protocol library.
                  That number grows with every activation.
                </span>
              </div>
            </div>
            <div style={{ textAlign: "center", flexShrink: 0 }}>
              <div style={{ ...CG, color: TEAL, fontSize: 52, fontWeight: 700, lineHeight: 1 }}>∞</div>
              <div style={{ ...BC, color: "rgba(255,255,255,0.5)", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase" }}>compounding advantage</div>
            </div>
          </div>

          <div style={{ marginTop: 52, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button onClick={() => scrollTo(3)} style={{ ...BC, background: "transparent", border: "none", color: "#9CA3AF", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer" }}>
              ← Back
            </button>
            <button onClick={() => scrollTo(5)} style={{ display: "flex", alignItems: "center", gap: 10, background: GOLD, border: "none", color: NAVY, padding: "12px 28px", cursor: "pointer", ...BC, fontSize: 12, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.88"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
            >
              Next: The Ask <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      <GoldRule />

      {/* ══════════════════════════════════════════════════════════
          CHAPTER 5 — THE ASK
      ══════════════════════════════════════════════════════════ */}
      <section
        id="chapter-5"
        ref={(el) => { sectionRefs.current[4] = el; }}
        style={{ background: NAVY, padding: "80px 40px 96px" }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <ChapterLabel n={5} text="The Ask" />

          <h2 style={{ ...CG, fontSize: "clamp(30px,4vw,60px)", fontWeight: 700, color: "#fff", lineHeight: 1.1, marginBottom: 16, maxWidth: 760 }}>
            When the situation arrives —
          </h2>
          <h2 style={{ ...CG, fontSize: "clamp(30px,4vw,60px)", fontWeight: 700, color: "#fff", lineHeight: 1.1, marginBottom: 8 }}>
            The response is ready.
          </h2>
          <h2 style={{ ...CG, fontSize: "clamp(30px,4vw,60px)", fontWeight: 700, color: GOLD, lineHeight: 1.1, fontStyle: "italic", marginBottom: 48 }}>
            Before the trigger fires.
          </h2>

          <p style={{ color: "rgba(255,255,255,0.72)", fontSize: 16, lineHeight: 1.8, maxWidth: 700, marginBottom: 56 }}>
            We are in active conversations with a select cohort of Founding Partners —
            organizations willing to validate the model and shape the platform's evolution.
            The cohort is limited. The window is open now.
          </p>

          {/* Two CTAs */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 760, marginBottom: 64 }}>
            <div style={{ padding: "36px 32px", border: `1px solid ${GOLD}40`, background: `${GOLD}08` }}>
              <Calendar className="w-6 h-6" style={{ color: GOLD, marginBottom: 16 }} />
              <div style={{ ...BC, color: GOLD, fontSize: 11, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 8 }}>Schedule a Conversation</div>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, lineHeight: 1.65, marginBottom: 20 }}>
                A direct conversation about the investment thesis, the Founding Partner model, and current traction.
              </p>
              <a
                href="/contact"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, background: GOLD, color: NAVY, padding: "11px 22px", textDecoration: "none", ...BC, fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}
              >
                Request a Meeting <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div style={{ padding: "36px 32px", border: `1px solid rgba(255,255,255,0.12)`, background: "rgba(255,255,255,0.03)" }}>
              <FileText className="w-6 h-6" style={{ color: "rgba(255,255,255,0.6)", marginBottom: 16 }} />
              <div style={{ ...BC, color: "#fff", fontSize: 11, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 8 }}>Explore the Platform</div>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, lineHeight: 1.65, marginBottom: 20 }}>
                Run a live demo, read the full proof narratives, or download the executive brief.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <a href="/demo-experience" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.8)", textDecoration: "none", ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", borderBottom: `1px solid rgba(255,255,255,0.15)`, paddingBottom: 8 }}>
                  <Play className="w-3.5 h-3.5" /> Run a Live Demo
                </a>
                <a href="/executive-brief" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.8)", textDecoration: "none", ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", borderBottom: `1px solid rgba(255,255,255,0.15)`, paddingBottom: 8 }}>
                  <FileText className="w-3.5 h-3.5" /> Executive Brief
                </a>
                <a href="/investors" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.8)", textDecoration: "none", ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  <BarChart3 className="w-3.5 h-3.5" /> Full Investor Overview
                </a>
              </div>
            </div>
          </div>

          {/* Bottom brand close */}
          <div style={{ borderTop: `1px solid ${GOLD}25`, paddingTop: 40, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
            <VaughnMartinLogo color="light" height={32} variant="full" />
            <div style={{ textAlign: "right" }}>
              <div style={{ ...BC, color: GOLD, fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 4 }}>Readiness Infrastructure · Startup to Fortune 500</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>vaughnmartin.com · Confidential — For Investor Review</div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
