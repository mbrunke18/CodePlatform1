import { useEffect } from "react";
import { Link } from "wouter";
import PageLayout from "@/components/layout/PageLayout";
import { updatePageMetadata } from "@/lib/seo";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const IVORY = "#F0EDE4";
const RED = "#C0392B";

const DM: React.CSSProperties = { fontFamily: "'DM Sans', 'Inter', sans-serif" };
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
const CONTAINER: React.CSSProperties = { maxWidth: 1160, margin: "0 auto", padding: "0 40px" };

const DOMAINS = [
  {
    label: "RISK & RESILIENCE",
    color: RED,
    description: "Situations where delay compounds exposure — regulatory clocks, breach notifications, operational shutdowns. Every hour without a coordinated response is measurable cost.",
    situations: [
      { id: "ransomware",         label: "Ransomware Attack",       protocol: "#027", cost: "$247K per hour of uncoordinated response. 21-day average attacker dwell time before encryption triggers.",         urgent: true },
      { id: "data-breach",        label: "Data Breach",             protocol: "#033", cost: "GDPR 72-hour notification clock. SEC 4-day disclosure. The regulatory window runs whether you are ready or not.",  urgent: true },
      { id: "supply-chain",       label: "Supply Chain Collapse",   protocol: "#067", cost: "$180K per day in production stoppage. Pre-qualified backup suppliers activated in minutes, not weeks.",           urgent: false },
      { id: "regulatory-inquiry", label: "Regulatory Inquiry",      protocol: "#044", cost: "Agency preparation began months ago. Every day without a coordinated legal response advances their position.",     urgent: false },
    ],
  },
  {
    label: "GROWTH & POSITIONING",
    color: GOLD,
    description: "Situations where the window to respond is measured in hours. A competitor, activist investor, or acquirer is already prepared. The only question is whether you are.",
    situations: [
      { id: "activist-investor",       label: "Activist Investor",          protocol: "#031", cost: "$3.2M in avoidable concessions. Activist files because they have already built their case. Have you built yours?",  urgent: true },
      { id: "competitor-displacement", label: "Competitor Displacement",    protocol: "#052", cost: "When a competitor takes your anchor customer, they have a reference. You have 72 hours to respond before the narrative sets.",  urgent: false },
      { id: "ma-approach",             label: "Unsolicited M&A Approach",   protocol: "#058", cost: "$18M+ in avoidable valuation discount when you negotiate from surprise. They have been preparing for months.",             urgent: true },
    ],
  },
  {
    label: "TRANSFORMATION",
    color: TEAL,
    description: "Situations that require simultaneous coordination across board, investors, employees, and customers — with a single unified voice from the first hour.",
    situations: [
      { id: "executive-departure", label: "Executive Departure", protocol: "#019", cost: "Board, investors, employees, and customers all need a response — simultaneously. Improvised coordination creates the crisis.", urgent: false },
    ],
  },
];

export default function SituationsIndex() {
  useEffect(() => {
    window.scrollTo(0, 0);
    updatePageMetadata({
      title: "Every Situation — Pre-Staged | VaughnMartin Readiness OS",
      description: "Your organization will face 15–20 strategic situations this year. Readiness OS pre-stages a coordinated response for each one — 180 Readiness Protocols, 8 situation categories, all three strategic domains.",
    });
  }, []);

  return (
    <PageLayout>
      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <section style={{ background: NAVY, borderBottom: `3px solid ${GOLD}`, padding: "88px 0 72px" }}>
        <div style={{ ...CONTAINER }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 28, height: 1.5, background: GOLD }} />
            <span style={{ ...DM, fontSize: 10, fontWeight: 800, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: GOLD }}>180 Readiness Protocols · 3 Strategic Domains</span>
          </div>

          <h1 style={{ ...CG, fontSize: "clamp(36px,4.5vw,64px)", fontWeight: 700, color: "#fff", lineHeight: 1.05, margin: "0 0 24px", maxWidth: 820 }}>
            Every situation your organization will face.<br />
            <span style={{ color: GOLD }}>The response is already staged.</span>
          </h1>

          <p style={{ ...DM, fontSize: "clamp(15px,1.2vw,18px)", color: "rgba(255,255,255,0.7)", lineHeight: 1.75, maxWidth: 620, margin: "0 0 40px" }}>
            Your organization will encounter 15–20 strategic situations this year — competitive events, regulatory actions, security incidents, operational disruptions, executive changes. For each one, Readiness OS has a pre-staged protocol: owners named, budget pre-authorized, templates built, execution sequence staged. Before the situation arrives.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, auto)", gap: "0 48px", width: "fit-content" }}>
            {[
              { n: "180", label: "Readiness Protocols" },
              { n: "8",   label: "Situation categories" },
              { n: "12",  label: "Minutes to full execution" },
            ].map(s => (
              <div key={s.label}>
                <div style={{ ...CG, fontSize: "clamp(32px,3vw,48px)", fontWeight: 700, color: GOLD, lineHeight: 1, marginBottom: 4 }}>{s.n}</div>
                <div style={{ ...DM, fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: "0.08em" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COST OF INACTION STRIP ─────────────────────────────────────────── */}
      <section style={{ background: "#1A0A0A", padding: "28px 0" }}>
        <div style={{ ...CONTAINER }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" as const }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: RED, flexShrink: 0 }} />
            <span style={{ ...DM, fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
              <strong style={{ color: "rgba(255,255,255,0.88)", fontWeight: 700 }}>The cost of one unplanned situation:</strong>{" "}
              $47M regulatory exposure (ransomware, unprepared) · $3.2M activist concessions · 30 days average mobilization lag ·{" "}
              <span style={{ color: RED }}>You will pay for each of these whether you buy Readiness OS or not. The only question is when.</span>
            </span>
          </div>
        </div>
      </section>

      {/* ── SITUATIONS BY DOMAIN ───────────────────────────────────────────── */}
      {DOMAINS.map((domain, di) => (
        <section key={domain.label} style={{ background: di % 2 === 0 ? "#fff" : IVORY, padding: "72px 0" }}>
          <div style={{ ...CONTAINER }}>
            {/* Domain header */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start", marginBottom: 40 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 24, height: 1.5, background: domain.color }} />
                  <span style={{ ...DM, fontSize: 10, fontWeight: 800, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: domain.color }}>{domain.label}</span>
                </div>
                <h2 style={{ ...CG, fontSize: "clamp(26px,2.4vw,36px)", fontWeight: 700, color: NAVY, lineHeight: 1.15, margin: 0 }}>
                  {domain.situations.length} pre-staged protocol{domain.situations.length > 1 ? "s" : ""} in this domain.
                </h2>
              </div>
              <p style={{ ...DM, fontSize: 14, color: "#4B5563", lineHeight: 1.75, margin: 0, paddingTop: 8 }}>
                {domain.description}
              </p>
            </div>

            {/* Situation cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 2 }}>
              {domain.situations.map(s => (
                <Link
                  key={s.id}
                  href={`/situation/${s.id}`}
                  style={{ display: "block", textDecoration: "none", background: "#fff", border: `1px solid #E5E7EB`, borderTop: `3px solid ${domain.color}`, padding: "28px 28px 24px", transition: "box-shadow 0.15s" }}
                >
                  {s.urgent && (
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 8px", background: `${domain.color}12`, border: `1px solid ${domain.color}33`, marginBottom: 14 }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: domain.color }} />
                      <span style={{ ...DM, fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: domain.color }}>Time-Critical</span>
                    </div>
                  )}
                  <div style={{ ...DM, fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: domain.color, marginBottom: 8 }}>
                    Protocol {s.protocol}
                  </div>
                  <h3 style={{ ...CG, fontSize: 22, fontWeight: 700, color: NAVY, lineHeight: 1.2, margin: "0 0 12px" }}>{s.label}</h3>
                  <p style={{ ...DM, fontSize: 12, color: "#6B7280", lineHeight: 1.65, margin: "0 0 20px" }}>{s.cost}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ ...DM, fontSize: 12, fontWeight: 700, color: domain.color, letterSpacing: "0.04em" }}>See the protocol →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* ── THE COST OF NOT BEING READY ────────────────────────────────────── */}
      <section style={{ background: NAVY, padding: "72px 0" }}>
        <div style={{ ...CONTAINER }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
            <div>
              <div style={{ ...DM, fontSize: 9, fontWeight: 800, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 16 }}>The Real Cost</div>
              <h2 style={{ ...CG, fontSize: "clamp(28px,2.8vw,42px)", fontWeight: 700, color: "#fff", lineHeight: 1.15, margin: "0 0 20px" }}>
                You are paying for every situation on this page<br />
                <span style={{ color: GOLD }}>whether you buy Readiness OS or not.</span>
              </h2>
              <p style={{ ...DM, fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.75, margin: "0 0 32px" }}>
                Every unplanned situation costs your organization in mobilization lag, reactive advisory spend, and avoidable exposure. The question is not whether you will pay — it is whether you pay before the crisis or after it. Organizations with pre-staged protocols pay before. Organizations without them pay after, and pay more.
              </p>
              <Link
                href="/request-access"
                style={{ ...DM, display: "inline-block", background: GOLD, color: NAVY, fontWeight: 700, fontSize: 13, padding: "16px 36px", textDecoration: "none", letterSpacing: "0.07em", textTransform: "uppercase" as const }}
              >
                Apply for Founding Partner Access →
              </Link>
            </div>

            <div style={{ display: "flex", flexDirection: "column" as const, gap: 2 }}>
              {[
                { situation: "Ransomware — unprepared",         cost: "$47M+",  label: "regulatory exposure for late notification" },
                { situation: "Activist Investor — no pre-staging", cost: "$3.2M", label: "in avoidable concessions during mobilization lag" },
                { situation: "Supply Chain Collapse",           cost: "$12M",   label: "median event cost (industry average)" },
                { situation: "Data Breach — late notification", cost: "$9.4M",  label: "average GDPR fine for delayed reporting" },
                { situation: "All of the above — pre-staged",   cost: "$0",     label: "penalty exposure with Readiness OS deployed", zero: true },
              ].map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "16px 20px", background: r.zero ? `${TEAL}15` : "rgba(255,255,255,0.03)", border: `1px solid ${r.zero ? TEAL + "44" : "rgba(255,255,255,0.06)"}` }}>
                  <span style={{ ...DM, fontSize: 12, color: r.zero ? "rgba(255,255,255,0.78)" : "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{r.situation}</span>
                  <div style={{ textAlign: "right" as const, flexShrink: 0 }}>
                    <div style={{ ...CG, fontSize: 22, fontWeight: 700, color: r.zero ? TEAL : RED, lineHeight: 1 }}>{r.cost}</div>
                    <div style={{ ...DM, fontSize: 10, color: "rgba(255,255,255,0.35)", lineHeight: 1.4, maxWidth: 180 }}>{r.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOUNDING PARTNER CTA ───────────────────────────────────────────── */}
      <section style={{ background: IVORY, borderTop: `3px solid ${GOLD}`, padding: "64px 0" }}>
        <div style={{ ...CONTAINER }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" as const, gap: 32 }}>
            <div style={{ maxWidth: 560 }}>
              <div style={{ ...DM, fontSize: 9, fontWeight: 800, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 12 }}>The Founding Partner Program</div>
              <h2 style={{ ...CG, fontSize: "clamp(26px,2.4vw,38px)", fontWeight: 700, color: NAVY, lineHeight: 1.15, margin: "0 0 16px" }}>
                All 180 protocols. Your situations.<br />Staged before the next one arrives.
              </h2>
              <p style={{ ...DM, fontSize: 14, color: "#4B5563", lineHeight: 1.7, margin: 0 }}>
                A 90-day validated partnership. VaughnMartin configures every protocol on this page against your actual organization — then operates it live. When the next situation arrives, your response is already waiting.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 12, flexShrink: 0 }}>
              <Link
                href="/request-access"
                style={{ ...DM, display: "inline-block", background: GOLD, color: NAVY, fontWeight: 700, fontSize: 13, padding: "16px 36px", textDecoration: "none", letterSpacing: "0.07em", textTransform: "uppercase" as const, textAlign: "center" as const }}
              >
                Apply for Founding Partner Access →
              </Link>
              <Link
                href="/12-minute-experience"
                style={{ ...DM, display: "inline-block", background: "transparent", color: NAVY, fontWeight: 600, fontSize: 13, padding: "12px 22px", textDecoration: "none", border: `1px solid ${NAVY}30`, textAlign: "center" as const }}
              >
                Run the 12-Minute Test Drive First
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
