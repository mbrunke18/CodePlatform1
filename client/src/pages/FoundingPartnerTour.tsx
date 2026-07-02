import { useEffect, useRef, useState } from "react";
import { updatePageMetadata } from "@/lib/seo";
import { VaughnMartinLogo } from "@/components/VaughnMartinLogo";
import {
  ArrowRight, CheckCircle, Shield, Zap, Target, BarChart3,
  Calendar, Users, FileText, Play, Star, Lock, ChevronRight,
  TrendingUp, Building2
} from "lucide-react";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const IVORY = "#F0EDE4";
const BC = { fontFamily: "'Barlow Condensed', sans-serif" } as const;
const CG = { fontFamily: "'Cormorant Garamond', Georgia, serif" } as const;

const CHAPTERS = [
  { n: 1, label: "The Moment" },
  { n: 2, label: "The Answer" },
  { n: 3, label: "What You Get" },
  { n: 4, label: "The Journey" },
  { n: 5, label: "Apply" },
];

function GoldRule() {
  return <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${GOLD}55, transparent)` }} />;
}

function ChapterLabel({ n, text, light = false }: { n: number; text: string; light?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
      <div style={{ width: 32, height: 32, borderRadius: "50%", border: `1px solid ${GOLD}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <span style={{ ...BC, color: GOLD, fontSize: 11, fontWeight: 800, letterSpacing: "0.06em" }}>{String(n).padStart(2, "0")}</span>
      </div>
      <span style={{ ...BC, color: GOLD, fontSize: 10, fontWeight: 800, letterSpacing: "0.24em", textTransform: "uppercase" }}>{text}</span>
      <div style={{ flex: 1, height: 1, background: light ? "rgba(255,255,255,0.12)" : `${NAVY}15` }} />
    </div>
  );
}

function NextBtn({ label, onClick, variant = "gold" }: { label: string; onClick: () => void; variant?: "gold" | "outline" | "navy" }) {
  const [hover, setHover] = useState(false);
  const base: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", gap: 10, cursor: "pointer",
    ...BC, fontSize: 12, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase",
    padding: "13px 28px", border: "none", transition: "all 0.2s",
  };
  const styles: Record<string, React.CSSProperties> = {
    gold: { ...base, background: hover ? "#b8962e" : GOLD, color: NAVY },
    navy: { ...base, background: hover ? "#0d1238" : NAVY, color: "#fff" },
    outline: { ...base, background: "transparent", color: GOLD, border: `1px solid ${GOLD}50`, opacity: hover ? 0.8 : 1 },
  };
  return (
    <button style={styles[variant]} onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      {label} <ArrowRight className="w-4 h-4" />
    </button>
  );
}

function BackBtn({ onClick, light = false }: { onClick: () => void; light?: boolean }) {
  return (
    <button onClick={onClick} style={{ ...BC, background: "transparent", border: "none", color: light ? "rgba(255,255,255,0.35)" : "#9CA3AF", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer" }}>
      ← Back
    </button>
  );
}

export default function FoundingPartnerTour() {
  const [activeChapter, setActiveChapter] = useState(1);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    updatePageMetadata({
      title: "Founding Partner Program | VaughnMartin Readiness OS",
      description: "A 90-day validation partnership for organizations ready to be first. Full platform. Real situations. Proof that belongs to you at day 90.",
      ogTitle: "Founding Partner Program — VaughnMartin Readiness OS",
      ogDescription: "What does it feel like when the trigger fires and you're not ready? Readiness OS changes that. Apply for Founding Partner Access.",
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
      { threshold: 0.3 }
    );
    sectionRefs.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  function scrollTo(n: number) {
    sectionRefs.current[n - 1]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>

      {/* ── BRAND BAR ──────────────────────────────────────────── */}
      <div style={{ background: NAVY, padding: "16px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${GOLD}30` }}>
        <VaughnMartinLogo color="light" height={36} variant="full" />
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL }} />
            <span style={{ ...BC, color: "rgba(255,255,255,0.55)", fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" }}>Founding Partner Cohort Open</span>
          </div>
          <a href="/contact" style={{ ...BC, background: GOLD, color: NAVY, fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", padding: "8px 18px", textDecoration: "none" }}>
            Apply Now
          </a>
        </div>
      </div>

      {/* ── STICKY CHAPTER NAV ─────────────────────────────────── */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: NAVY, borderBottom: `1px solid ${GOLD}25`, padding: "0 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex" }}>
          {CHAPTERS.map((ch) => {
            const active = activeChapter === ch.n;
            const done = activeChapter > ch.n;
            return (
              <button key={ch.n} onClick={() => scrollTo(ch.n)} style={{
                flex: 1, padding: "14px 8px", background: "transparent", border: "none",
                borderBottom: active ? `2px solid ${GOLD}` : "2px solid transparent",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}>
                <span style={{
                  ...BC, width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                  background: done ? TEAL : active ? GOLD : "rgba(255,255,255,0.1)",
                  color: done || active ? NAVY : "rgba(255,255,255,0.35)",
                  fontSize: 9, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {done ? "✓" : ch.n}
                </span>
                <span style={{ ...BC, color: active ? GOLD : done ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.35)", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                  {ch.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          CHAPTER 1 — THE MOMENT
      ══════════════════════════════════════════════════════════ */}
      <section ref={(el) => { sectionRefs.current[0] = el; }}
        style={{ background: NAVY, padding: "80px 40px 72px", position: "relative", overflow: "hidden" }}>

        {/* subtle grid texture */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 59px, rgba(201,168,76,0.5) 60px), repeating-linear-gradient(90deg, transparent, transparent 59px, rgba(201,168,76,0.5) 60px)" }} />

        <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative" }}>
          <ChapterLabel n={1} text="The Moment" />

          <h1 style={{ ...CG, fontSize: "clamp(36px,5vw,70px)", fontWeight: 700, color: "#fff", lineHeight: 1.08, marginBottom: 32, maxWidth: 820 }}>
            Think back to the last time<br />
            a situation caught your<br />
            organization <span style={{ color: GOLD }}>mid-stride.</span>
          </h1>

          <p style={{ color: "rgba(255,255,255,0.72)", fontSize: 18, lineHeight: 1.8, maxWidth: 720, marginBottom: 52 }}>
            How long before your team had a coordinated response?
            How many emails before the right people were in the room?
            How many days before anyone agreed on a plan?
          </p>

          {/* The emotional scenarios */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 52 }}>
            {[
              { icon: Shield, label: "Ransomware hits at 2AM", desc: "IT is scrambling. Legal hasn't been called. The board doesn't know. Who authorizes the response? What's the containment sequence?" },
              { icon: TrendingUp, label: "Activist investor files 13D", desc: "IR is fielding calls with no approved messaging. The proxy fight window is open. The response team hasn't been assembled." },
              { icon: Building2, label: "Primary supplier goes dark", desc: "Production stops in 72 hours. Alternate sourcing takes weeks to negotiate. Customer commitments are now at risk." },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} style={{ padding: "24px 20px", border: `1px solid rgba(255,255,255,0.1)`, background: "rgba(255,255,255,0.03)", borderTop: `3px solid rgba(255,255,255,0.15)` }}>
                <Icon className="w-5 h-5" style={{ color: "rgba(255,255,255,0.4)", marginBottom: 12 }} />
                <div style={{ ...BC, color: "#fff", fontSize: 13, fontWeight: 700, letterSpacing: "0.04em", marginBottom: 10 }}>{label}</div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, lineHeight: 1.65 }}>{desc}</div>
              </div>
            ))}
          </div>

          <div style={{ background: `${GOLD}12`, border: `1px solid ${GOLD}35`, borderLeft: `4px solid ${GOLD}`, padding: "28px 32px", maxWidth: 780 }}>
            <p style={{ ...CG, color: "#fff", fontSize: "clamp(17px,2vw,22px)", fontWeight: 600, lineHeight: 1.6, margin: 0 }}>
              Every organization — startup to Fortune 500 — faces <span style={{ color: GOLD }}>15 to 20 strategic situations every year</span> that demand a coordinated response.
              Most mobilize for 30 days. The mobilization itself is the failure.
            </p>
          </div>

          <div style={{ marginTop: 52, display: "flex", justifyContent: "flex-end" }}>
            <NextBtn label="What Changes" onClick={() => scrollTo(2)} variant="outline" />
          </div>
        </div>
      </section>

      <GoldRule />

      {/* ══════════════════════════════════════════════════════════
          CHAPTER 2 — THE ANSWER
      ══════════════════════════════════════════════════════════ */}
      <section ref={(el) => { sectionRefs.current[1] = el; }}
        style={{ background: "#fff", padding: "80px 40px 72px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <ChapterLabel n={2} text="The Answer" />

          <h2 style={{ ...CG, fontSize: "clamp(30px,4vw,56px)", fontWeight: 700, color: NAVY, lineHeight: 1.1, marginBottom: 16, maxWidth: 760 }}>
            The response is ready
          </h2>
          <h2 style={{ ...CG, fontSize: "clamp(30px,4vw,56px)", fontWeight: 700, color: GOLD, lineHeight: 1.1, fontStyle: "italic", marginBottom: 40 }}>
            before the trigger fires.
          </h2>

          <p style={{ color: "#374151", fontSize: 17, lineHeight: 1.8, maxWidth: 760, marginBottom: 52 }}>
            Readiness OS doesn't speed up your reaction. It eliminates the need to react from zero.
            Every protocol, stakeholder, budget authorization, task sequence, and communication framework
            is staged before the situation presents itself — so when the trigger fires, your team
            executes from a fully prepared position.
          </p>

          {/* Before / After */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, marginBottom: 52 }}>
            <div style={{ background: "#F9FAFB", border: `1px solid #E5E7EB`, padding: "32px 28px" }}>
              <div style={{ ...BC, color: "#9CA3AF", fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 20 }}>Without Readiness OS</div>
              {[
                "30 days to assemble a response team",
                "Improvised plans under pressure",
                "Budget approvals delayed for weeks",
                "Messaging drafted mid-crisis",
                "Governance records reconstructed after",
                "Every situation starts from zero",
              ].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#D1D5DB", flexShrink: 0, marginTop: 6 }} />
                  <span style={{ color: "#6B7280", fontSize: 13, lineHeight: 1.6 }}>{item}</span>
                </div>
              ))}
            </div>
            <div style={{ background: NAVY, padding: "32px 28px" }}>
              <div style={{ ...BC, color: TEAL, fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 20 }}>With Readiness OS</div>
              {[
                "12 minutes to full team mobilization",
                "180 protocols pre-matched to your situations",
                "Budget pre-authorized per protocol",
                "Approved messaging frameworks pre-staged",
                "Complete audit trail — auto-generated",
                "Every activation makes the next one faster",
              ].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
                  <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: TEAL }} />
                  <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, lineHeight: 1.6 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* The 3,600× stat */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, marginBottom: 52 }}>
            {[
              { value: "30 days", label: "Traditional mobilization", note: "Conservative baseline" },
              { value: "12 min", label: "Readiness OS response", note: "After signal detection" },
              { value: "3,600×", label: "Execution head start", note: "30 days compressed to 12 minutes" },
            ].map(({ value, label, note }) => (
              <div key={label} style={{ textAlign: "center", padding: "32px 20px", background: IVORY, border: `1px solid ${NAVY}15`, borderTop: `3px solid ${NAVY}` }}>
                <div style={{ ...CG, fontSize: "clamp(28px,3.5vw,48px)", fontWeight: 700, color: GOLD, lineHeight: 1 }}>{value}</div>
                <div style={{ ...BC, color: NAVY, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 8 }}>{label}</div>
                <div style={{ color: "#9CA3AF", fontSize: 11, marginTop: 4 }}>{note}</div>
              </div>
            ))}
          </div>

          {/* The emotional close */}
          <div style={{ background: NAVY, padding: "36px 40px", borderLeft: `4px solid ${GOLD}` }}>
            <p style={{ ...CG, color: "#fff", fontSize: "clamp(18px,2.2vw,26px)", fontWeight: 600, lineHeight: 1.6, marginBottom: 12 }}>
              Any organization that prepares for every situation it will face is no longer afraid
              of strategic triggers.
            </p>
            <p style={{ ...CG, color: GOLD, fontSize: "clamp(18px,2.2vw,26px)", fontWeight: 700, fontStyle: "italic", lineHeight: 1.4, margin: 0 }}>
              It's fearless.
            </p>
          </div>

          <div style={{ marginTop: 52, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <BackBtn onClick={() => scrollTo(1)} />
            <NextBtn label="What You Get" onClick={() => scrollTo(3)} variant="navy" />
          </div>
        </div>
      </section>

      <GoldRule />

      {/* ══════════════════════════════════════════════════════════
          CHAPTER 3 — WHAT YOU GET
      ══════════════════════════════════════════════════════════ */}
      <section ref={(el) => { sectionRefs.current[2] = el; }}
        style={{ background: IVORY, padding: "80px 40px 72px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <ChapterLabel n={3} text="What You Get" />

          <h2 style={{ ...CG, fontSize: "clamp(30px,4vw,56px)", fontWeight: 700, color: NAVY, lineHeight: 1.1, marginBottom: 16, maxWidth: 760 }}>
            The Founding Partner Program
          </h2>
          <p style={{ ...CG, color: GOLD, fontSize: "clamp(16px,2vw,22px)", fontWeight: 600, fontStyle: "italic", marginBottom: 40 }}>
            90-day validation partnership. No subscription fee. Proof that belongs to you.
          </p>

          <p style={{ color: "#374151", fontSize: 16, lineHeight: 1.8, maxWidth: 720, marginBottom: 52 }}>
            Founding Partners are not beta testers. They are the organizations that shape the platform's evolution —
            getting full access, dedicated support, and a proof package that quantifies exactly what Readiness OS
            did for their organization before the first invoice arrives.
          </p>

          {/* What's included */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ ...BC, color: NAVY, fontSize: 10, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 20 }}>What's Included — Full Access</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { icon: Shield, text: "Full Readiness OS platform — all 180 Readiness Protocols" },
                { icon: Users, text: "Up to 25 users for the full 90-day period" },
                { icon: Zap, text: "Live signal monitoring across 3 intelligence categories" },
                { icon: Target, text: "War room, activation console, and debrief engine" },
                { icon: Play, text: "3 facilitated tabletop exercises with your leadership team" },
                { icon: Star, text: "Dedicated configuration support for the first 30 days" },
                { icon: FileText, text: "Board-ready Readiness Report generated at day 90" },
                { icon: Lock, text: "Direct input into protocol roadmap and platform evolution" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "16px 20px", background: "#fff", border: `1px solid ${NAVY}12` }}>
                  <Icon className="w-4 h-4 shrink-0 mt-0.5" style={{ color: TEAL }} />
                  <span style={{ color: "#374151", fontSize: 13, lineHeight: 1.6 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Three mutual commitments */}
          <div style={{ marginBottom: 52 }}>
            <div style={{ ...BC, color: NAVY, fontSize: 10, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 20 }}>Three Mutual Commitments</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {[
                {
                  num: "Day 30", icon: Target,
                  title: "Protocol Deployment Milestone",
                  body: "5 Readiness Protocols fully configured to your specific situations, stakeholders, and decision authorities. Dedicated support through every step."
                },
                {
                  num: "Day 60", icon: BarChart3Icon,
                  title: "Progress Conversation",
                  body: "A structured check-in to review your first activation, measure your Readiness Score delta from baseline, and close any protocol gaps before final validation."
                },
                {
                  num: "Day 90", icon: CheckCircle,
                  title: "Conversion Conversation + Reference",
                  body: "At 90 days you participate in a direct conversation about continuing as a paying subscriber — and you provide a reference regardless of outcome. The proof package is yours either way."
                },
              ].map(({ num, icon: Icon, title, body }) => (
                <div key={num} style={{ display: "flex", gap: 24, padding: "24px 28px", background: "#fff", border: `1px solid ${NAVY}12`, borderLeft: `3px solid ${GOLD}` }}>
                  <div style={{ flexShrink: 0, textAlign: "center", minWidth: 60 }}>
                    <div style={{ ...BC, color: GOLD, fontSize: 18, fontWeight: 800, lineHeight: 1 }}>{num}</div>
                    <Icon className="w-4 h-4 mx-auto mt-2" style={{ color: NAVY }} />
                  </div>
                  <div>
                    <div style={{ ...BC, color: NAVY, fontSize: 13, fontWeight: 700, letterSpacing: "0.04em", marginBottom: 6 }}>{title}</div>
                    <div style={{ color: "#6B7280", fontSize: 13, lineHeight: 1.65 }}>{body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Exclusivity note */}
          <div style={{ background: NAVY, padding: "24px 28px", display: "flex", alignItems: "center", gap: 16 }}>
            <Lock className="w-5 h-5 shrink-0" style={{ color: GOLD }} />
            <div>
              <div style={{ ...BC, color: GOLD, fontSize: 11, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 4 }}>Limited Cohort</div>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, lineHeight: 1.6 }}>
                Founding Partner access is not open enrollment. Each cohort is limited to a small number of organizations
                to ensure dedicated support and focused protocol configuration. Once the cohort is filled, applications move to the waitlist.
              </div>
            </div>
          </div>

          <div style={{ marginTop: 52, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <BackBtn onClick={() => scrollTo(2)} />
            <NextBtn label="The Journey" onClick={() => scrollTo(4)} variant="navy" />
          </div>
        </div>
      </section>

      <GoldRule />

      {/* ══════════════════════════════════════════════════════════
          CHAPTER 4 — THE JOURNEY
      ══════════════════════════════════════════════════════════ */}
      <section ref={(el) => { sectionRefs.current[3] = el; }}
        style={{ background: "#fff", padding: "80px 40px 72px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <ChapterLabel n={4} text="The Journey" />

          <h2 style={{ ...CG, fontSize: "clamp(30px,4vw,56px)", fontWeight: 700, color: NAVY, lineHeight: 1.1, marginBottom: 16, maxWidth: 740 }}>
            What the 90 days look like
          </h2>
          <p style={{ color: "#6B7280", fontSize: 16, lineHeight: 1.8, maxWidth: 680, marginBottom: 52 }}>
            Four structured phases. Clear milestones. No guesswork on your end — we've done this before
            and we manage the process with you.
          </p>

          {/* 4 phases */}
          <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 56 }}>
            {[
              {
                phase: "Phase 0", duration: "Weeks 1–2", name: "Readiness & Setup", color: NAVY,
                activities: [
                  "Executive sponsor alignment session",
                  "Integration setup — Teams, Jira, Slack",
                  "Select 3–5 Readiness Protocols from your priority domains",
                  "Configure signal monitoring for priority situations",
                  "Baseline your current response metrics",
                ],
                outcome: "All integrations tested and operational. Protocols configured.",
              },
              {
                phase: "Phase 1", duration: "Weeks 3–6", name: "Dry Runs & Training", color: TEAL,
                activities: [
                  "2–3 tabletop exercises with your leadership team",
                  "Measure activation time — target under 12 minutes",
                  "Train response team leads on the platform",
                  "Refine protocols based on dry run findings",
                  "Establish your KPI tracking dashboard",
                ],
                outcome: "Activation time under 15 minutes in dry runs.",
              },
              {
                phase: "Phase 2", duration: "Weeks 7–10", name: "Live Activation", color: GOLD,
                activities: [
                  "Live signal monitoring enabled",
                  "First real protocol activation",
                  "All coordination metrics tracked",
                  "Lessons learned documented",
                  "Stakeholder feedback captured",
                ],
                outcome: "At least 1 live activation with measured 12-minute response.",
              },
              {
                phase: "Phase 3", duration: "Weeks 11–12", name: "Executive Readout", color: NAVY,
                activities: [
                  "ROI scorecard compiled",
                  "Results presented to your executive sponsor",
                  "Production rollout plan defined",
                  "Conversion conversation held",
                  "Board-ready Readiness Report delivered",
                ],
                outcome: "Clear go/no-go decision with quantified value. Proof package yours to keep.",
              },
            ].map(({ phase, duration, name, color, activities, outcome }) => (
              <div key={phase} style={{ display: "grid", gridTemplateColumns: "160px 1fr", border: `1px solid ${NAVY}12`, overflow: "hidden" }}>
                <div style={{ background: color, padding: "28px 20px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
                  <div style={{ ...BC, color: color === GOLD ? NAVY : GOLD, fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 6 }}>{phase}</div>
                  <div style={{ ...BC, color: "#fff", fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{name}</div>
                  <div style={{ ...BC, color: color === NAVY ? "rgba(255,255,255,0.5)" : color === GOLD ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.6)", fontSize: 10, letterSpacing: "0.1em" }}>{duration}</div>
                </div>
                <div style={{ padding: "24px 28px", background: "#FAFAFA" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 20px", marginBottom: 14 }}>
                    {activities.map((a) => (
                      <div key={a} style={{ display: "flex", alignItems: "flex-start", gap: 6, width: "calc(50% - 10px)" }}>
                        <ChevronRight className="w-3 h-3 shrink-0 mt-1" style={{ color: TEAL }} />
                        <span style={{ color: "#374151", fontSize: 12, lineHeight: 1.55 }}>{a}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ borderTop: `1px solid ${NAVY}10`, paddingTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
                    <CheckCircle className="w-3.5 h-3.5 shrink-0" style={{ color: TEAL }} />
                    <span style={{ ...BC, color: TEAL, fontSize: 11, fontWeight: 700, letterSpacing: "0.06em" }}>{outcome}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Explore the platform */}
          <div style={{ background: IVORY, border: `1px solid ${NAVY}15`, padding: "28px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ ...BC, color: NAVY, fontSize: 11, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 6 }}>See It Before You Commit</div>
              <div style={{ color: "#6B7280", fontSize: 13 }}>Run a live scenario — no login required. Choose your situation and watch the full activation sequence.</div>
            </div>
            <a href="/demo-experience" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: NAVY, color: "#fff", padding: "12px 22px", textDecoration: "none", ...BC, fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", flexShrink: 0 }}>
              <Play className="w-3.5 h-3.5" /> Run a Live Demo
            </a>
          </div>

          <div style={{ marginTop: 52, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <BackBtn onClick={() => scrollTo(3)} />
            <NextBtn label="Apply Now" onClick={() => scrollTo(5)} variant="gold" />
          </div>
        </div>
      </section>

      <GoldRule />

      {/* ══════════════════════════════════════════════════════════
          CHAPTER 5 — APPLY
      ══════════════════════════════════════════════════════════ */}
      <section ref={(el) => { sectionRefs.current[4] = el; }}
        style={{ background: NAVY, padding: "80px 40px 96px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <ChapterLabel n={5} text="Apply" light />

          <h2 style={{ ...CG, fontSize: "clamp(30px,4vw,64px)", fontWeight: 700, color: "#fff", lineHeight: 1.08, marginBottom: 16 }}>
            The next situation
          </h2>
          <h2 style={{ ...CG, fontSize: "clamp(30px,4vw,64px)", fontWeight: 700, color: "#fff", lineHeight: 1.08, marginBottom: 16 }}>
            is already on its way.
          </h2>
          <h2 style={{ ...CG, fontSize: "clamp(30px,4vw,64px)", fontWeight: 700, color: GOLD, fontStyle: "italic", lineHeight: 1.08, marginBottom: 48 }}>
            Will you be ready for it?
          </h2>

          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 17, lineHeight: 1.8, maxWidth: 700, marginBottom: 56 }}>
            Founding Partners are the organizations that chose to prepare before the situation arrived —
            not the ones that added Readiness OS to the budget after a 30-day response cycle reminded them why it mattered.
            The cohort is limited. Applications are reviewed within 48 hours.
          </p>

          {/* Two paths */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, maxWidth: 820, marginBottom: 60 }}>
            <div style={{ padding: "36px 32px", border: `2px solid ${GOLD}`, background: `${GOLD}08` }}>
              <Calendar className="w-6 h-6" style={{ color: GOLD, marginBottom: 16 }} />
              <div style={{ ...BC, color: GOLD, fontSize: 12, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 10 }}>Apply for Founding Partner Access</div>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, lineHeight: 1.7, marginBottom: 24 }}>
                Submit your application and a member of our team will reach out within 48 hours to discuss fit, timeline, and your priority situations.
              </p>
              <a href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: GOLD, color: NAVY, padding: "13px 26px", textDecoration: "none", ...BC, fontSize: 12, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Apply Now <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div style={{ padding: "36px 32px", border: `1px solid rgba(255,255,255,0.12)`, background: "rgba(255,255,255,0.03)" }}>
              <Play className="w-6 h-6" style={{ color: "rgba(255,255,255,0.5)", marginBottom: 16 }} />
              <div style={{ ...BC, color: "#fff", fontSize: 12, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 10 }}>Not Ready to Apply Yet?</div>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, lineHeight: 1.7, marginBottom: 20 }}>
                Run a live scenario first. Pick a situation your organization actually faces and watch the full 12-minute activation — no login, no commitment.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <a href="/demo-experience" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.75)", textDecoration: "none", ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", borderBottom: `1px solid rgba(255,255,255,0.12)`, paddingBottom: 8 }}>
                  <Play className="w-3.5 h-3.5" /> Run a Live Demo
                </a>
                <a href="/proof-story" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.75)", textDecoration: "none", ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", borderBottom: `1px solid rgba(255,255,255,0.12)`, paddingBottom: 8 }}>
                  <FileText className="w-3.5 h-3.5" /> Read the Proof Stories
                </a>
                <a href="/executive-brief" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.75)", textDecoration: "none", ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  <FileText className="w-3.5 h-3.5" /> Download the Executive Brief
                </a>
              </div>
            </div>
          </div>

          {/* Closing brand mark */}
          <div style={{ borderTop: `1px solid ${GOLD}25`, paddingTop: 40, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
            <VaughnMartinLogo color="light" height={32} variant="full" />
            <div style={{ textAlign: "right" }}>
              <div style={{ ...BC, color: GOLD, fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 4 }}>Readiness Infrastructure · Startup to Fortune 500</div>
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>Founding Partner cohort — limited availability</div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

function BarChart3Icon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <BarChart3 className={className} style={style} />;
}
