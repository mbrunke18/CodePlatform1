import { useEffect, type CSSProperties } from "react";
import { updatePageMetadata } from "@/lib/seo";
import { Link } from "wouter";
import PageLayout from "@/components/layout/PageLayout";

const NAVY    = "#0A0F2E";
const NAVY_BG = "#132558";
const GOLD    = "#C9A84C";
const TEAL    = "#2B8A6E";
const IVORY   = "#F0EDE4";
const GEO: CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
const BAR: CSSProperties = { fontFamily: "'Barlow Condensed', system-ui, sans-serif" };

const NODES = [
  {
    step: "01",
    label: "External Signal Ingestion",
    color: GOLD,
    details: [
      "RSS feeds, SEC EDGAR filings, market intelligence",
      "News & media intelligence, financial signal sources",
      "39 real-time data sources · 248+ data points",
      "15-minute ingestion cycles · continuous",
    ],
  },
  {
    step: "02",
    label: "Normalization Layer",
    color: GOLD,
    details: [
      "Canonical event model: trigger type · entity · confidence score",
      "Urgency tier · strategic domain — every signal, same structure",
      "Internal + external signals unified into one data model",
      "Source-agnostic — format differences resolved automatically",
    ],
  },
  {
    step: "03",
    label: "Trigger Evaluation Engine",
    color: TEAL,
    details: [
      "231 trigger patterns scored against signal density",
      "Keyword alignment + confidence threshold evaluation",
      "Square-root scaling model for risk classification",
      "LOW (<35) · MEDIUM (35–74) · HIGH (75+) outputs",
    ],
  },
  {
    step: "04",
    label: "Protocol Matching",
    color: TEAL,
    details: [
      "Matched against 180 pre-staged Readiness Protocols",
      "Tasks, stakeholders, budget, documents already staged",
      "Compound protocol matching for multi-domain threats",
      "Recommendation surfaced with confidence score",
    ],
  },
  {
    step: "05",
    label: "Executive Authorization Gate",
    color: GOLD,
    details: [
      "No activation without executive sign-off — always",
      "Human decision on system-prepared execution",
      "Authorization timestamped and logged to institutional record",
      "One-click activation after executive authorization",
    ],
  },
];

const TECH_SPECS = [
  { label: "Signal Sources", value: "8 real-time feeds" },
  { label: "Data Points Monitored", value: "248+" },
  { label: "Trigger Patterns", value: "231" },
  { label: "Ingestion Cycle", value: "Every 15 minutes" },
  { label: "Risk Classification", value: "LOW · MEDIUM · HIGH" },
  { label: "Protocol Library", value: "180 pre-staged" },
  { label: "Compound Protocols", value: "12 cross-domain" },
  { label: "Execution Window", value: "12 minutes" },
];

export default function ExecutionDataFabric() {
  useEffect(() => {
    updatePageMetadata({
      title: "Execution Data Fabric — VaughnMartin Readiness OS",
      description: "How Readiness OS ingests, normalizes, and evaluates signals to match pre-staged protocols — the AI and data architecture behind 12-minute execution.",
    });
  }, []);

  return (
    <PageLayout>
      {/* Hero */}
      <div style={{ background: NAVY, padding: '80px 32px 72px', textAlign: 'center' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <p style={{ ...BAR, fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD, marginBottom: 16 }}>
            Technical Architecture
          </p>
          <h1 style={{ ...GEO, fontSize: 'clamp(36px, 5vw, 58px)', fontWeight: 600, color: '#fff', lineHeight: 1.1, marginBottom: 20 }}>
            The Execution Data Fabric
          </h1>
          <p style={{ ...BAR, fontSize: 17, color: 'rgba(240,237,228,0.72)', lineHeight: 1.7, marginBottom: 32, maxWidth: 620, margin: '0 auto 32px' }}>
            How signals become staged responses in under 12 minutes — the AI and data architecture behind every Readiness Protocol activation.
          </p>
          <div style={{ display: 'inline-block', background: 'rgba(201,168,76,0.12)', border: `1px solid rgba(201,168,76,0.3)`, padding: '10px 24px' }}>
            <span style={{ ...BAR, fontSize: 13, fontWeight: 700, color: GOLD, letterSpacing: '0.08em' }}>
              Signal detected → Protocol matched → Executive authorized → Response live · All within 12 minutes
            </span>
          </div>
        </div>
      </div>

      {/* Flow chain */}
      <div style={{ background: '#fff', padding: '72px 32px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <p style={{ ...BAR, fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD, marginBottom: 8, textAlign: 'center' }}>
            Five-Stage Execution Chain
          </p>
          <h2 style={{ ...GEO, fontSize: 'clamp(26px, 3vw, 38px)', fontWeight: 600, color: NAVY, textAlign: 'center', marginBottom: 56 }}>
            From raw signal to authorized response
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {NODES.map((node, i) => (
              <div key={node.step}>
                <div style={{ display: 'grid', gridTemplateColumns: '64px 1fr', gap: 24, alignItems: 'start', padding: '28px 0' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: '50%',
                      background: node.color === GOLD ? 'rgba(201,168,76,0.12)' : 'rgba(43,138,110,0.1)',
                      border: `1.5px solid ${node.color}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <span style={{ ...BAR, fontSize: 13, fontWeight: 800, color: node.color }}>{node.step}</span>
                    </div>
                    {i < NODES.length - 1 && (
                      <div style={{ width: 1, flex: 1, minHeight: 24, background: `rgba(201,168,76,0.25)`, marginTop: 4 }} />
                    )}
                  </div>
                  <div style={{ paddingTop: 8, paddingBottom: i < NODES.length - 1 ? 24 : 0 }}>
                    <h3 style={{ ...BAR, fontSize: 16, fontWeight: 700, color: NAVY, marginBottom: 12, letterSpacing: '0.02em' }}>
                      {node.label}
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 24px' }}>
                      {node.details.map((d, j) => (
                        <div key={j} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                          <span style={{ color: node.color, fontSize: 10, marginTop: 4, flexShrink: 0 }}>◆</span>
                          <span style={{ ...BAR, fontSize: 13, color: 'rgba(10,15,46,0.72)', lineHeight: 1.5 }}>{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {i < NODES.length - 1 && (
                  <div style={{ height: 1, background: 'rgba(10,15,46,0.07)', margin: '0 0 0 88px' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI authority framing */}
      <div style={{ background: NAVY_BG, padding: '64px 32px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ ...BAR, fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: TEAL, marginBottom: 16 }}>
            The Authority Model
          </p>
          <h2 style={{ ...GEO, fontSize: 'clamp(26px, 3vw, 40px)', fontWeight: 600, color: '#fff', marginBottom: 20 }}>
            The system interprets. Executives decide. Always.
          </h2>
          <p style={{ ...BAR, fontSize: 16, color: 'rgba(240,237,228,0.68)', lineHeight: 1.75, marginBottom: 48, maxWidth: 640, margin: '0 auto 48px' }}>
            Signal interpretation and protocol recommendation are handled by the system. No Readiness Protocol activates without executive authorization. The preparation compresses the mobilization cycle — the decision remains human.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              { label: "System-Detected", desc: "Signals identified, scored, and matched to protocols automatically" },
              { label: "Executive-Authorized", desc: "No activation without explicit executive sign-off — timestamped and logged" },
              { label: "Pre-Staged Execution", desc: "Tasks, stakeholders, budget, and documents ready before the trigger fires" },
            ].map(item => (
              <div key={item.label} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,168,76,0.2)', padding: '28px 24px', textAlign: 'left' }}>
                <div style={{ height: 2, width: 32, background: GOLD, marginBottom: 16 }} />
                <h3 style={{ ...BAR, fontSize: 14, fontWeight: 700, color: GOLD, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>{item.label}</h3>
                <p style={{ ...BAR, fontSize: 13, color: 'rgba(240,237,228,0.65)', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tech specs */}
      <div style={{ background: IVORY, padding: '64px 32px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <p style={{ ...BAR, fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD, marginBottom: 8, textAlign: 'center' }}>
            Platform Specifications
          </p>
          <h2 style={{ ...GEO, fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 600, color: NAVY, textAlign: 'center', marginBottom: 40 }}>
            The numbers behind the architecture
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
            {TECH_SPECS.map(spec => (
              <div key={spec.label} style={{ background: '#fff', padding: '24px 20px', textAlign: 'center', border: '1px solid rgba(10,15,46,0.07)' }}>
                <div style={{ ...GEO, fontSize: 26, fontWeight: 600, color: NAVY, marginBottom: 6 }}>{spec.value}</div>
                <div style={{ ...BAR, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(10,15,46,0.45)' }}>{spec.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Investor moat line */}
      <div style={{ background: NAVY, padding: '56px 32px', textAlign: 'center' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ height: 1, background: `rgba(201,168,76,0.25)`, marginBottom: 36 }} />
          <p style={{ ...GEO, fontSize: 'clamp(20px, 2.5vw, 28px)', fontStyle: 'italic', color: '#fff', lineHeight: 1.5, marginBottom: 32 }}>
            "Our moat is the compounding decision-outcome dataset tied to governed execution workflows — not just model prompts."
          </p>
          <div style={{ height: 1, background: `rgba(201,168,76,0.25)`, marginBottom: 36 }} />
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/institutional-memory-engine" style={{ ...BAR, display: 'inline-block', background: GOLD, color: NAVY, fontSize: 13, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '12px 28px', textDecoration: 'none' }}>
              Institutional Memory Engine →
            </a>
            <a href="/platform-integrations" style={{ ...BAR, display: 'inline-block', background: 'transparent', color: GOLD, border: `1px solid ${GOLD}`, fontSize: 13, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '12px 28px', textDecoration: 'none' }}>
              Platform Integrations →
            </a>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
