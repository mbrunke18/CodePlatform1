import { useEffect } from "react";
import { Link } from "wouter";
import { VaughnMartinLogo } from "@/components/VaughnMartinLogo";
import { updatePageMetadata } from "@/lib/seo";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const IVORY = "#F0EDE4";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
const BC: React.CSSProperties = { fontFamily: "'Barlow Condensed', 'Barlow', sans-serif" };
const DM: React.CSSProperties = { fontFamily: "'Barlow', sans-serif" };

const COMMITMENTS = [
  {
    num: "01",
    title: "Protocol Deployment Milestone — Day 30",
    body: "Your organization completes structured onboarding with 5 Readiness Protocols fully configured to your specific scenarios, stakeholders, and decision authorities within the first 30 days.",
  },
  {
    num: "02",
    title: "Progress Conversation — Day 60",
    body: "A structured check-in at 60 days to review your first activation, measure your Readiness Score delta from baseline, and identify any protocol gaps before the final validation.",
  },
  {
    num: "03",
    title: "Conversion Conversation + Reference — Day 90",
    body: "At 90 days you participate in a direct conversation about continuing as a paying subscriber — and you provide a reference regardless of whether you convert. The proof package is yours either way.",
  },
];

const OFFER_ITEMS = [
  "Full Readiness OS platform access — all 180 Readiness Protocols",
  "Up to 25 users for the full 90-day period",
  "Live signal monitoring across 3 intelligence categories",
  "War room, activation console, and debrief engine",
  "3 facilitated tabletop exercises with your leadership team",
  "Dedicated configuration support for the first 30 days",
  "Board-ready Readiness Report generated at day 90",
];

export default function FoundingPartnerBrief() {
  useEffect(() => {
    updatePageMetadata({
      title: "Founding Partner Validation — Readiness OS by VaughnMartin",
      description: "90-day structured validation partnership. No subscription fee. Three mutual commitments. One proof package that belongs to you at day 90.",
    });
  }, []);

  return (
    <div style={{ background: "#fff", minHeight: "100vh", ...DM }}>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-page { page-break-inside: avoid; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          a { text-decoration: none !important; }
        }
      `}</style>

      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div className="no-print" style={{ background: NAVY, padding: "16px 40px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <VaughnMartinLogo variant="full" height={40} color="light" animated={false} noLink />
          </Link>
          <button
            onClick={() => window.print()}
            style={{
              ...BC, background: "transparent", border: "1px solid rgba(201,168,76,0.5)",
              color: GOLD, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
              textTransform: "uppercase", padding: "8px 18px", cursor: "pointer",
              borderRadius: "0.15rem",
            }}
          >
            Print / Save as PDF
          </button>
        </div>
      </div>

      {/* ── DOCUMENT HEADER (prints) ─────────────────────────────────────── */}
      <div className="print-page" style={{ background: NAVY, padding: "40px 0 36px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
            <VaughnMartinLogo variant="full" height={64} color="light" animated={false} noLink />
            <div style={{ textAlign: "right" }}>
              <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: GOLD, marginBottom: 6 }}>
                Founding Partner Program
              </div>
              <div style={{ ...CG, fontSize: 26, fontWeight: 600, color: "#fff", lineHeight: 1.2 }}>
                90-Day Validation Partnership
              </div>
              <div style={{
                marginTop: 10, display: "inline-block",
                background: "rgba(43,138,110,0.25)", border: "1px solid rgba(43,138,110,0.5)",
                ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.16em",
                textTransform: "uppercase", color: "#4EC99A", padding: "4px 12px",
                borderRadius: "0.15rem",
              }}>
                No Subscription Fee During Validation
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── GOLD RULE ───────────────────────────────────────────────────── */}
      <div style={{ background: GOLD, height: 3 }} />

      {/* ── SCARCITY SIGNAL ─────────────────────────────────────────────── */}
      <div style={{ background: IVORY, padding: "14px 40px", textAlign: "center", borderBottom: "1px solid rgba(201,168,76,0.2)" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
          <span style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: NAVY }}>
            Founding Partner Program — 2 organizations · 90 days · no subscription fee
          </span>
          <span style={{
            ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
            background: GOLD, color: NAVY, padding: "3px 10px", borderRadius: "0.15rem",
          }}>
            Founding Partner #1 of 2
          </span>
        </div>
      </div>

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 40px" }}>

        {/* ── SECTION 1: THE OFFER ────────────────────────────────────────── */}
        <div className="print-page" style={{ padding: "48px 0 40px", borderBottom: `1px solid rgba(10,15,46,0.1)` }}>
          <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: GOLD, marginBottom: 12 }}>
            01 — The Offer
          </div>
          <h2 style={{ ...CG, fontSize: 30, fontWeight: 700, color: NAVY, margin: "0 0 10px", lineHeight: 1.2 }}>
            What your organization gets.
          </h2>
          <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7, margin: "0 0 28px", maxWidth: 560 }}>
            Full platform access. No subscription fee during the 90-day validation period. Everything below is included from Day 1.
          </p>

          <div style={{ background: IVORY, border: `1px solid rgba(201,168,76,0.25)`, borderLeft: `4px solid ${GOLD}`, padding: "28px 32px", borderRadius: "0.15rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
              {OFFER_ITEMS.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "9px 16px 9px 0", borderBottom: i < OFFER_ITEMS.length - 2 ? "1px solid rgba(10,15,46,0.07)" : "none" }}>
                  <span style={{ color: GOLD, fontWeight: 700, fontSize: 14, lineHeight: 1.5, flexShrink: 0 }}>→</span>
                  <span style={{ fontSize: 13.5, color: "#374151", lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(10,15,46,0.1)", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
                background: TEAL, color: "white", padding: "4px 12px", borderRadius: "0.15rem", flexShrink: 0,
              }}>
                No Subscription Fee During Validation
              </div>
              <span style={{ fontSize: 12, color: "#6B7280" }}>
                The 90-day validation period carries no subscription cost. What you invest is time and organizational commitment — defined below.
              </span>
            </div>
          </div>
        </div>

        {/* ── SECTION 2: THREE COMMITMENTS ────────────────────────────────── */}
        <div className="print-page" style={{ padding: "48px 0 40px", borderBottom: `1px solid rgba(10,15,46,0.1)` }}>
          <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: GOLD, marginBottom: 12 }}>
            02 — Three Commitments
          </div>
          <h2 style={{ ...CG, fontSize: 30, fontWeight: 700, color: NAVY, margin: "0 0 10px", lineHeight: 1.2 }}>
            What your organization commits to.
          </h2>
          <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7, margin: "0 0 32px", maxWidth: 560 }}>
            Free without structure is a gift. Free with defined obligations on both sides is a partnership. These three commitments make this a structured commercial validation.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {COMMITMENTS.map((c, i) => (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "56px 1fr",
                borderLeft: `3px solid ${GOLD}`, marginBottom: i < COMMITMENTS.length - 1 ? 16 : 0,
                borderRadius: "0.15rem",
              }}>
                <div style={{ background: GOLD, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 0" }}>
                  <span style={{ ...BC, fontSize: 16, fontWeight: 800, color: NAVY }}>{c.num}</span>
                </div>
                <div style={{ background: "#FAFAF8", border: "1px solid rgba(201,168,76,0.18)", borderLeft: "none", padding: "22px 28px" }}>
                  <div style={{ ...BC, fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: NAVY, marginBottom: 8 }}>
                    {c.title}
                  </div>
                  <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.65, margin: 0 }}>{c.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SECTION 3: WHAT DAY 90 PROVES ───────────────────────────────── */}
        <div className="print-page" style={{ padding: "48px 0 40px", borderBottom: `1px solid rgba(10,15,46,0.1)` }}>
          <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: GOLD, marginBottom: 12 }}>
            03 — What Day 90 Proves
          </div>
          <h2 style={{ ...CG, fontSize: 30, fontWeight: 700, color: NAVY, margin: "0 0 28px", lineHeight: 1.2 }}>
            Success defined in one sentence.
          </h2>

          <div style={{ background: NAVY, padding: "40px 44px", borderRadius: "0.15rem", marginBottom: 20 }}>
            <div style={{ width: 40, height: 2, background: GOLD, marginBottom: 24 }} />
            <p style={{ ...CG, fontSize: 26, fontWeight: 600, color: "#fff", lineHeight: 1.45, margin: "0 0 20px" }}>
              "At day 90, your organization has completed three protocol activations, documented your mobilization time reduction, and produced a board-ready Readiness Report."
            </p>
            <div style={{ width: 40, height: 2, background: GOLD, marginTop: 24 }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            {[
              { metric: "3", label: "Protocol activations completed" },
              { metric: "12 min", label: "Documented mobilization time" },
              { metric: "3,600×", label: "Execution head start demonstrated" },
              { metric: "100%", label: "Investment credited to contract" },
            ].map((s, i) => (
              <div key={i} style={{ background: IVORY, border: "1px solid rgba(10,15,46,0.08)", padding: "20px 24px" }}>
                <div style={{ ...CG, fontSize: 32, fontWeight: 700, color: NAVY, lineHeight: 1 }}>{s.metric}</div>
                <div style={{ fontSize: 12, color: "#6B7280", marginTop: 8, lineHeight: 1.4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 13, color: "#9CA3AF", lineHeight: 1.7, marginTop: 20, fontStyle: "italic" }}>
            Whether you convert to a paid subscription or not, the proof package — activation report, Readiness Score trendline, ROI summary — belongs to your organization to keep.
          </p>
        </div>

        {/* ── SECTION 4: CTA ──────────────────────────────────────────────── */}
        <div className="print-page no-print" style={{ padding: "48px 0 64px" }}>
          <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: GOLD, marginBottom: 12 }}>
            04 — Apply
          </div>
          <h2 style={{ ...CG, fontSize: 30, fontWeight: 700, color: NAVY, margin: "0 0 10px", lineHeight: 1.2 }}>
            Two slots. First come, first validated.
          </h2>
          <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7, margin: "0 0 32px", maxWidth: 520 }}>
            The Founding Partner Program closes when both slots are filled. Selection is based on strategic complexity, organizational readiness, and executive sponsorship — not first-in-line.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 400 }}>
            <Link href="/request-access">
              <button style={{
                width: "100%", padding: "18px 32px",
                background: GOLD, border: "none", cursor: "pointer", borderRadius: "0.15rem",
                ...BC, fontSize: 13, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase",
                color: NAVY,
              }}>
                Apply for Founding Partner Access →
              </button>
            </Link>
            <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0, textAlign: "center" }}>
              Program closes when both slots are filled.
            </p>
          </div>
        </div>

        {/* ── PRINT-ONLY CTA ──────────────────────────────────────────────── */}
        <div style={{ padding: "40px 0 56px", display: "none" }} className="print-cta">
          <style>{`@media print { .print-cta { display: block !important; } }`}</style>
          <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#374151", marginBottom: 12 }}>
            04 — Apply
          </div>
          <p style={{ ...CG, fontSize: 22, fontWeight: 700, color: NAVY, margin: "0 0 16px" }}>
            Apply for Founding Partner Access
          </p>
          <p style={{ fontSize: 13, color: "#374151", margin: "0 0 8px" }}>
            vaughnmartin.com/request-access
          </p>
          <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>
            Program closes when both Founding Partner slots are filled.
          </p>
        </div>

      </div>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <div className="no-print" style={{ background: NAVY, padding: "28px 40px", marginTop: 0 }}>
        <div style={{ maxWidth: 820, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <VaughnMartinLogo variant="full" height={36} color="light" animated={false} noLink />
          <div style={{ display: "flex", gap: 24 }}>
            <Link href="/12-minute-experience" style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>
              12-Minute Test Drive
            </Link>
            <Link href="/request-access" style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: GOLD, textDecoration: "none" }}>
              Apply Now →
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
