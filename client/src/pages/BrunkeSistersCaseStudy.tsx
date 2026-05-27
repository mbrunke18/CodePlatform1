import { type CSSProperties } from "react";
import { Link } from "wouter";
import { VaughnMartinLogo } from "@/components/VaughnMartinLogo";
import { updatePageMetadata } from "@/lib/seo";
import { useEffect } from "react";
import { CheckCircle2, Clock, Shield, TrendingUp, ArrowRight, BookOpen, Zap, Users, AlertTriangle } from "lucide-react";

const NAVY    = "#0A0F2E";
const NAVY_BG = "#132558";
const GOLD    = "#C9A84C";
const TEAL    = "#2B8A6E";
const IVORY   = "#F0EDE4";
const GEO: CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
const BC: CSSProperties  = { fontFamily: "'Barlow Condensed', sans-serif" };

const activations = [
  {
    protocol: "#52",
    name: "State AG / DOJ Investigation",
    domain: "RISK & RESILIENCE",
    domainColor: TEAL,
    trigger: "DOJ Civil Division issued subpoenas referencing Brunke Sisters billing methodology on federal advisory contracts. Pattern consistent with industry-wide enforcement sweep.",
    detectedAt: "Signal detected — 8:47 AM",
    activatedAt: "Protocol activated — 8:55 AM",
    minutes: 11,
    score: 91,
    targetMet: true,
    outcome: "contained",
    whatHeld: "Pre-staged outside counsel contact list and document hold protocol reduced mobilization from an estimated 3 days to 11 minutes. All stakeholders notified before DOJ follow-up call. Document hold executed before any regulatory deadline.",
    whatChanged: "Billing documentation path corrected in protocol — location assumption had caused 18-minute retrieval delay. Now validated quarterly.",
    icon: Shield,
    comparison: { without: "3–5 days to mobilize outside counsel and execute document hold", with: "11 minutes — outside counsel engaged, hold executed, stakeholders notified" },
  },
  {
    protocol: "#65",
    name: "Ransomware Containment",
    domain: "RISK & RESILIENCE",
    domainColor: TEAL,
    trigger: "Anomalous lateral movement detected on firm network at 2:14 AM. CISA advisory had flagged LockBit 3.0 targeting professional services firms 17 days prior — protocol already elevated to HIGH watch.",
    detectedAt: "System detected — 2:14 AM",
    activatedAt: "Protocol activated — 2:21 AM",
    minutes: 9,
    score: 94,
    targetMet: true,
    outcome: "contained",
    whatHeld: "Pre-staged client communication templates eliminated 4 hours of drafting under pressure. Cyber insurer pre-authorization removed 2-hour approval bottleneck. Incident contained in 9 minutes vs. industry average of 34 days to full recovery.",
    whatChanged: "Quarterly backup validation checkpoint added — backup was available but 90-day staleness added friction at a critical moment.",
    icon: AlertTriangle,
    comparison: { without: "Industry average: 34 days to full recovery", with: "9 minutes to containment — client comms sent, insurer engaged, network isolated" },
  },
  {
    protocol: "#8",
    name: "Competitor Talent Raid",
    domain: "GROWTH & POSITIONING",
    domainColor: GOLD,
    trigger: "AI-native boutique backed by $80M Series B making targeted outreach to Brunke Sisters senior managers in overlapping markets. Two senior managers reported unsolicited offers on the same day.",
    detectedAt: "Signal detected — 9:03 AM",
    activatedAt: "Protocol activated — 9:11 AM",
    minutes: 12,
    score: 87,
    targetMet: true,
    outcome: "contained",
    whatHeld: "Pre-approved retention package ranges allowed immediate counter-offer without a CFO approval cycle. Both targeted managers retained. Competitor hired externally. Readiness eliminated a projected 2-week negotiation delay.",
    whatChanged: "Equity acceleration pre-authorization track added — standard retention template didn't cover unvested equity holders. Now pre-approved by Compensation Committee.",
    icon: Users,
    comparison: { without: "2–3 weeks to get retention packages approved and delivered — likely too late", with: "12 minutes — counter-offer delivered same morning, both managers confirmed retained" },
  },
  {
    protocol: "#62",
    name: "Employment Litigation Response",
    domain: "RISK & RESILIENCE",
    domainColor: TEAL,
    trigger: "Former associate filed employment discrimination claim citing performance review irregularities. EEOC industry enforcement sweep in progress — elevated litigation risk across peer firms.",
    detectedAt: "Claim filed — 11:22 AM",
    activatedAt: "Protocol activated — 11:31 AM",
    minutes: 11,
    score: 89,
    targetMet: true,
    outcome: "contained",
    whatHeld: "Pre-staged legal hold procedures and pre-authorized outside employment counsel retainer eliminated 5 days of mobilization. HR documentation was complete and consistent. Claim dismissed in mediation.",
    whatChanged: "Structured peer communication guidance added — team members had no script during active dispute, creating informal channels. Pre-approved communication protocol now included.",
    icon: BookOpen,
    comparison: { without: "5–7 days to retain outside counsel, execute legal hold, compile HR records", with: "11 minutes — hold executed, counsel engaged, HR package transmitted. Claim dismissed." },
  },
];

const advanceUpdates = [
  { protocol: "#52", update: "Billing document repository path corrected and quarterly validation added", impact: "Estimated −4 min on next regulatory activation", status: "Applied" },
  { protocol: "#65", update: "Quarterly backup system validation checkpoint added to maintenance schedule", impact: "Estimated −2 min on next cyber activation", status: "Applied" },
  { protocol: "#8",  update: "Equity acceleration pre-authorization track added for unvested equity holders", impact: "Estimated −3 min on next talent activation", status: "Applied" },
  { protocol: "#62", update: "Structured peer communication script added to employment dispute protocol", impact: "Estimated −2 hrs management overhead", status: "Applied" },
];

const stats = [
  { value: "10.8 min", label: "Average execution time across 4 activations" },
  { value: "4 / 4", label: "Protocols met 12-minute target" },
  { value: "90.3", label: "Average activation score (0–100)" },
  { value: "100%", label: "Outcomes: contained — zero regulatory penalties" },
];

export default function BrunkeSistersCaseStudy() {
  useEffect(() => {
    updatePageMetadata(
      "Brunke Sisters — Readiness OS Founding Partner Case Study",
      "60-day activation record: 4 completed Readiness Protocols averaging 10.8 minutes. DOJ investigation, ransomware containment, talent raid, employment litigation — all contained."
    );
  }, []);

  return (
    <div style={{ background: "#fff", minHeight: "100vh", color: NAVY }}>

      {/* Top bar */}
      <div style={{ background: NAVY, padding: "16px 48px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <VaughnMartinLogo size={36} />
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <Link href="/proof-story">
            <span style={{ color: IVORY, fontSize: 13, ...BC, letterSpacing: "0.06em", cursor: "pointer", opacity: 0.8 }}>MORE PROOF STORIES</span>
          </Link>
          <Link href="/request-access">
            <span style={{ background: GOLD, color: NAVY, padding: "8px 20px", fontSize: 12, fontWeight: 700, ...BC, letterSpacing: "0.1em", borderRadius: "0.15rem", cursor: "pointer" }}>
              REQUEST FOUNDING PARTNER ACCESS
            </span>
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div style={{ background: NAVY, padding: "64px 48px 72px", borderBottom: `3px solid ${GOLD}` }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <span style={{ background: GOLD, color: NAVY, padding: "4px 12px", fontSize: 10, fontWeight: 800, ...BC, letterSpacing: "0.16em", borderRadius: "0.15rem" }}>FOUNDING PARTNER</span>
            <span style={{ background: "rgba(43,138,110,0.2)", color: TEAL, padding: "4px 12px", fontSize: 10, fontWeight: 700, ...BC, letterSpacing: "0.14em", borderRadius: "0.15rem", border: `1px solid ${TEAL}` }}>PROFESSIONAL SERVICES</span>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, ...BC }}>60-DAY ACTIVATION RECORD</span>
          </div>

          <h1 style={{ ...GEO, fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 600, color: "#fff", lineHeight: 1.1, marginBottom: 12 }}>
            Brunke Sisters
          </h1>
          <div style={{ width: 60, height: 2, background: GOLD, marginBottom: 24 }} />
          <p style={{ color: IVORY, fontSize: 18, lineHeight: 1.6, maxWidth: 680, opacity: 0.9, marginBottom: 0 }}>
            500-person professional services firm. Founding Partner on Readiness OS since March 2026.
            Four strategic triggers fired in 60 days. Four Readiness Protocols executed.
            Average time from trigger detection to full response: <strong style={{ color: GOLD }}>10.8 minutes.</strong>
          </p>
        </div>
      </div>

      {/* Stat bar */}
      <div style={{ background: IVORY, borderBottom: `1px solid #E0DDD5`, padding: "32px 48px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ textAlign: "center", borderRight: i < 3 ? `1px solid #D0CCC0` : "none", padding: "0 24px" }}>
              <div style={{ ...GEO, fontSize: 36, fontWeight: 700, color: NAVY, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#6B7280", marginTop: 6, lineHeight: 1.4, ...BC, letterSpacing: "0.04em" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Context */}
      <div style={{ padding: "64px 48px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 16 }}>
          <div style={{ width: 3, background: GOLD, alignSelf: "stretch", borderRadius: 2, minHeight: 60 }} />
          <div>
            <div style={{ fontSize: 11, ...BC, letterSpacing: "0.16em", color: GOLD, fontWeight: 700, marginBottom: 8 }}>THE SITUATION</div>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: "#374151", margin: 0 }}>
              Professional services is among the highest-exposure sectors for strategic triggers: regulatory sweeps,
              cybersecurity incidents, talent raids, and employment litigation all fire without warning and demand
              immediate, coordinated response. For most firms, mobilization alone — reaching counsel, aligning leadership,
              executing holds — takes days. Brunke Sisters compressed that mobilization to minutes by staging
              180 Readiness Protocols before any trigger fired.
            </p>
          </div>
        </div>

        <div style={{ background: "#F9F8F6", border: `1px solid #E8E4DC`, borderRadius: "0.15rem", padding: "24px 28px", marginTop: 32, display: "flex", gap: 32 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, ...BC, letterSpacing: "0.14em", color: "#9CA3AF", fontWeight: 700, marginBottom: 8 }}>WITHOUT READINESS OS</div>
            <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7, margin: 0 }}>
              When a trigger fires, the organization spends the first hours — often days — just determining who needs to be
              in the room, what authority exists to act, and who has the right external contacts. By the time the response
              mobilizes, the window has often closed.
            </p>
          </div>
          <div style={{ width: 1, background: "#E0DDD5" }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, ...BC, letterSpacing: "0.14em", color: TEAL, fontWeight: 700, marginBottom: 8 }}>WITH READINESS OS</div>
            <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, margin: 0 }}>
              The response was staged before the trigger fired. At detection, the system matches the protocol, stages the
              execution brief, notifies stakeholders simultaneously, and awaits one executive authorization.
              The mobilization cycle that used to take 30 days takes 12 minutes.
            </p>
          </div>
        </div>
      </div>

      {/* Activations */}
      <div style={{ padding: "0 48px 80px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ fontSize: 11, ...BC, letterSpacing: "0.18em", color: GOLD, fontWeight: 700, marginBottom: 8 }}>60-DAY ACTIVATION RECORD</div>
        <h2 style={{ ...GEO, fontSize: 32, fontWeight: 600, color: NAVY, marginBottom: 48 }}>Four Triggers. Four Protocols. All Contained.</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          {activations.map((a, i) => {
            const Icon = a.icon;
            return (
              <div key={i} style={{ border: `1px solid #E8E4DC`, borderRadius: "0.15rem", overflow: "hidden" }}>

                {/* Activation header */}
                <div style={{ background: NAVY, padding: "20px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "0.15rem", padding: "8px 10px" }}>
                      <Icon size={18} color={GOLD} />
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ color: GOLD, fontSize: 13, fontWeight: 800, ...BC, letterSpacing: "0.1em" }}>PROTOCOL {a.protocol}</span>
                        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>·</span>
                        <span style={{ color: a.domainColor, fontSize: 11, fontWeight: 700, ...BC, letterSpacing: "0.1em" }}>{a.domain}</span>
                      </div>
                      <div style={{ color: "#fff", fontSize: 16, fontWeight: 600, marginTop: 2 }}>{a.name}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ ...GEO, fontSize: 28, fontWeight: 700, color: GOLD, lineHeight: 1 }}>{a.minutes} min</div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", ...BC, letterSpacing: "0.1em", marginTop: 2 }}>EXECUTION TIME</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ ...GEO, fontSize: 28, fontWeight: 700, color: "#fff", lineHeight: 1 }}>{a.score}</div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", ...BC, letterSpacing: "0.1em", marginTop: 2 }}>SCORE / 100</div>
                    </div>
                    <div style={{ background: TEAL, color: "#fff", padding: "6px 12px", borderRadius: "0.15rem", fontSize: 10, fontWeight: 800, ...BC, letterSpacing: "0.12em", display: "flex", alignItems: "center", gap: 6 }}>
                      <CheckCircle2 size={12} />
                      CONTAINED
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div style={{ padding: "24px 28px", background: "#fff" }}>

                  {/* Trigger */}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 10, ...BC, letterSpacing: "0.14em", color: "#9CA3AF", fontWeight: 700, marginBottom: 6 }}>TRIGGER</div>
                    <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, margin: 0 }}>{a.trigger}</p>
                  </div>

                  {/* Timeline markers */}
                  <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                    {[
                      { label: a.detectedAt, color: "#6B7280" },
                      { label: "→ Executive brief staged", color: "#6B7280" },
                      { label: a.activatedAt, color: TEAL },
                      { label: `→ Contained in ${a.minutes} min`, color: GOLD },
                    ].map((t, j) => (
                      <span key={j} style={{ fontSize: 11, color: t.color, fontWeight: j > 1 ? 700 : 400, ...BC }}>
                        {t.label}{j < 3 ? "" : ""}
                      </span>
                    ))}
                  </div>

                  {/* Before / After */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                    <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "0.15rem", padding: "16px 18px" }}>
                      <div style={{ fontSize: 10, ...BC, letterSpacing: "0.14em", color: "#DC2626", fontWeight: 700, marginBottom: 8 }}>WITHOUT READINESS OS</div>
                      <p style={{ fontSize: 13, color: "#7F1D1D", lineHeight: 1.6, margin: 0 }}>{a.comparison.without}</p>
                    </div>
                    <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: "0.15rem", padding: "16px 18px" }}>
                      <div style={{ fontSize: 10, ...BC, letterSpacing: "0.14em", color: "#15803D", fontWeight: 700, marginBottom: 8 }}>WITH READINESS OS</div>
                      <p style={{ fontSize: 13, color: "#14532D", lineHeight: 1.6, margin: 0 }}>{a.comparison.with}</p>
                    </div>
                  </div>

                  {/* What held */}
                  <div style={{ background: IVORY, borderLeft: `3px solid ${GOLD}`, padding: "14px 18px", marginBottom: 16 }}>
                    <div style={{ fontSize: 10, ...BC, letterSpacing: "0.14em", color: GOLD, fontWeight: 700, marginBottom: 6 }}>WHAT HELD — CLOSE-OUT DEBRIEF</div>
                    <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, margin: 0 }}>{a.whatHeld}</p>
                  </div>

                  {/* ADVANCE update */}
                  <div style={{ background: "#F0F9FF", border: "1px solid #BAE6FD", borderRadius: "0.15rem", padding: "12px 18px", display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <Zap size={14} color="#0284C7" style={{ marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <span style={{ fontSize: 10, ...BC, letterSpacing: "0.12em", color: "#0284C7", fontWeight: 800 }}>ADVANCE 2.0 UPDATE APPLIED — </span>
                      <span style={{ fontSize: 13, color: "#0C4A6E" }}>{a.whatChanged}</span>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ADVANCE 2.0 summary */}
      <div style={{ background: NAVY, padding: "64px 48px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ fontSize: 11, ...BC, letterSpacing: "0.18em", color: GOLD, fontWeight: 700, marginBottom: 8 }}>ADVANCE 2.0 — CLOSED-LOOP LEARNING</div>
          <h2 style={{ ...GEO, fontSize: 32, fontWeight: 600, color: "#fff", marginBottom: 12 }}>Every Activation Made the Next One Faster</h2>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, lineHeight: 1.7, maxWidth: 640, marginBottom: 40 }}>
            Each close-out debrief automatically generates preparation updates. The protocol library improves
            with each activation. This learning is encoded — not institutional memory that leaves when someone does.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {advanceUpdates.map((u, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.15rem", padding: "18px 24px", display: "flex", alignItems: "center", gap: 20 }}>
                <span style={{ color: GOLD, fontSize: 13, fontWeight: 800, ...BC, letterSpacing: "0.1em", minWidth: 48 }}>{u.protocol}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#fff", fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{u.update}</div>
                  <div style={{ color: TEAL, fontSize: 12, ...BC, letterSpacing: "0.04em" }}>{u.impact}</div>
                </div>
                <span style={{ background: TEAL, color: "#fff", padding: "4px 10px", borderRadius: "0.15rem", fontSize: 10, fontWeight: 700, ...BC, letterSpacing: "0.1em", flexShrink: 0 }}>
                  {u.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 32, padding: "20px 24px", background: "rgba(201,168,76,0.1)", border: `1px solid rgba(201,168,76,0.3)`, borderRadius: "0.15rem" }}>
            <p style={{ color: IVORY, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
              <strong style={{ color: GOLD }}>The moat:</strong> Brunke Sisters' protocol library now reflects 4 live activations that no competitor can replicate
              from a standing start. Each future activation will be faster than the last. The preparation advantage compounds.
            </p>
          </div>
        </div>
      </div>

      {/* The thesis */}
      <div style={{ padding: "64px 48px", background: IVORY }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
            <div>
              <div style={{ fontSize: 11, ...BC, letterSpacing: "0.16em", color: GOLD, fontWeight: 700, marginBottom: 16 }}>THE OUTCOME</div>
              <div style={{ ...GEO, fontSize: 28, fontWeight: 600, color: NAVY, lineHeight: 1.3, marginBottom: 20 }}>
                "The response was ready<br />before the trigger fired."
              </div>
              <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.8, marginBottom: 0 }}>
                Four strategic triggers across cybersecurity, regulatory, competitive, and legal domains —
                all contained, all under 12 minutes, all with zero regulatory penalty.
                Not because the team reacted faster. Because the preparation was already done.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { icon: Clock, label: "30 days compressed to 12 minutes", sub: "Across all 4 activations" },
                { icon: Shield, label: "Zero regulatory penalties", sub: "DOJ, EEOC — both contained in mediation" },
                { icon: Users, label: "Both targeted managers retained", sub: "Counter-offer delivered same morning" },
                { icon: TrendingUp, label: "4 protocol improvements encoded", sub: "Each activation made the library smarter" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{ background: NAVY, borderRadius: "0.15rem", padding: "8px", flexShrink: 0 }}>
                      <Icon size={16} color={GOLD} />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: NAVY }}>{item.label}</div>
                      <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>{item.sub}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: NAVY, padding: "72px 48px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ width: 48, height: 2, background: GOLD, margin: "0 auto 24px" }} />
          <h2 style={{ ...GEO, fontSize: 36, fontWeight: 600, color: "#fff", marginBottom: 16 }}>
            Ready to Stage Your Response<br />Before the Trigger Fires?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 15, lineHeight: 1.7, marginBottom: 36 }}>
            The Founding Partner Program is a 90-day validation partnership.
            Your Readiness Protocols staged. Your stakeholders mapped. Your first trigger detected.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/request-access">
              <span style={{ background: GOLD, color: NAVY, padding: "14px 32px", fontWeight: 800, fontSize: 13, ...BC, letterSpacing: "0.12em", borderRadius: "0.15rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}>
                APPLY FOR FOUNDING PARTNER ACCESS <ArrowRight size={14} />
              </span>
            </Link>
            <Link href="/12-minute-experience">
              <span style={{ border: `1px solid rgba(255,255,255,0.3)`, color: "#fff", padding: "14px 32px", fontWeight: 700, fontSize: 13, ...BC, letterSpacing: "0.1em", borderRadius: "0.15rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}>
                SEE IT EXECUTE IN 12 MINUTES <ArrowRight size={14} />
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: "#060A1F", padding: "24px 48px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <VaughnMartinLogo size={28} />
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, ...BC }}>© 2026 VaughnMartin. All rights reserved.</span>
        </div>
        <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 11, ...BC, letterSpacing: "0.08em" }}>ANTE IGNEM PARATUS</span>
      </div>
    </div>
  );
}
