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

const LAYERS = [
  {
    num: "01",
    name: "Activation Record",
    color: GOLD,
    desc: "Every activation writes structured records across 8 data dimensions — the complete execution history of your organization's strategic responses.",
    items: [
      "Decision authority + authorization timestamp",
      "Elapsed time from trigger to full response",
      "Task completion rate per activation",
      "Stakeholder response tracking by tier",
      "Budget consumed vs. pre-approved allocation",
      "Outcome classification: Optimization · Mixed-Signal · Recovery",
      "Protocol version at time of activation",
      "Post-activation debrief score",
    ],
  },
  {
    num: "02",
    name: "Pattern Retrieval Layer",
    color: GOLD,
    desc: "Prior activation records are indexed and retrieved as context for future protocol recommendations. The system identifies which protocols performed best against which trigger profiles.",
    items: [
      "Prior decisions surfaced as context for new activations",
      "Protocol performance indexed by trigger type and domain",
      "Response time benchmarks updated with each cycle",
      "Stakeholder engagement patterns tracked over time",
    ],
  },
  {
    num: "03",
    name: "Readiness Scoring Engine",
    color: TEAL,
    desc: "A 0–100 Executive Readiness Score derived from live signals, protocol coverage, activation history, and drill completions. The score improves with every cycle.",
    items: [
      "0–100 score updated continuously",
      "Signal density weighting per strategic domain",
      "Protocol coverage gaps surfaced automatically",
      "Drill completion tracked per domain",
      "Score trends visible to executives in real time",
    ],
  },
  {
    num: "04",
    name: "Governance & Audit Layer",
    color: TEAL,
    desc: "Full governance infrastructure ensuring every decision is traceable, every protocol is versioned, and every activation can be presented to a board or regulator on demand.",
    items: [
      "Versioned protocols — every change logged with rationale",
      "Full audit trail per activation — immutable record",
      "Approval controls and authorization records",
      "Board-ready reporting generated automatically",
      "Ownership close-out gate post-activation",
    ],
  },
];

const COMPOUNDING = [
  { cycle: "First activation", outcome: "Response executed. Record created. Baseline established." },
  { cycle: "Drill cycles 1–3", outcome: "Pattern data accumulates. Coverage gaps identified. Score improves." },
  { cycle: "Second live activation", outcome: "Prior context retrieved. Faster recommendation. Better stakeholder targeting." },
  { cycle: "12 months of operation", outcome: "Institutional memory rivals a decade of manual playbook development." },
];

export default function InstitutionalMemoryEngine() {
  useEffect(() => {
    updatePageMetadata({
      title: "Institutional Memory Engine — VaughnMartin Readiness OS",
      description: "How Readiness OS builds compounding organizational intelligence through activation records, pattern retrieval, readiness scoring, and governance — the moat competitors cannot replicate.",
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
            The Institutional Memory Engine
          </h1>
          <p style={{ ...BAR, fontSize: 17, color: 'rgba(240,237,228,0.72)', lineHeight: 1.7, maxWidth: 620, margin: '0 auto 32px' }}>
            Every activation makes the next response faster, more precise, and more defensible. The compounding intelligence layer that competitors cannot copy.
          </p>
          <div style={{ display: 'inline-block', background: 'rgba(43,138,110,0.15)', border: `1px solid rgba(43,138,110,0.35)`, padding: '10px 24px' }}>
            <span style={{ ...BAR, fontSize: 13, fontWeight: 700, color: TEAL, letterSpacing: '0.08em' }}>
              Competitors can copy the interface · They cannot copy 18 months of structured activation history
            </span>
          </div>
        </div>
      </div>

      {/* 4 layers */}
      <div style={{ background: '#fff', padding: '72px 32px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <p style={{ ...BAR, fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD, marginBottom: 8, textAlign: 'center' }}>
            Four-Layer Memory Architecture
          </p>
          <h2 style={{ ...GEO, fontSize: 'clamp(26px, 3vw, 38px)', fontWeight: 600, color: NAVY, textAlign: 'center', marginBottom: 56 }}>
            From raw activation to compounding organizational intelligence
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {LAYERS.map((layer) => (
              <div key={layer.num} style={{
                border: `1px solid ${layer.color === GOLD ? 'rgba(201,168,76,0.25)' : 'rgba(43,138,110,0.25)'}`,
                padding: '32px 36px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span style={{ ...BAR, fontSize: 11, fontWeight: 800, color: layer.color, letterSpacing: '0.12em' }}>LAYER {layer.num}</span>
                  <div style={{ height: 1, flex: 1, background: `${layer.color}33` }} />
                </div>
                <h3 style={{ ...GEO, fontSize: 22, fontWeight: 600, color: NAVY, marginBottom: 10 }}>{layer.name}</h3>
                <p style={{ ...BAR, fontSize: 14, color: 'rgba(10,15,46,0.65)', lineHeight: 1.65, marginBottom: 20 }}>{layer.desc}</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px 32px' }}>
                  {layer.items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <span style={{ color: layer.color, fontSize: 9, marginTop: 5, flexShrink: 0 }}>◆</span>
                      <span style={{ ...BAR, fontSize: 13, color: 'rgba(10,15,46,0.7)', lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Compounding over time */}
      <div style={{ background: NAVY_BG, padding: '64px 32px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <p style={{ ...BAR, fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: TEAL, marginBottom: 8, textAlign: 'center' }}>
            The Compounding Effect
          </p>
          <h2 style={{ ...GEO, fontSize: 'clamp(26px, 3vw, 38px)', fontWeight: 600, color: '#fff', textAlign: 'center', marginBottom: 48 }}>
            Each cycle improves the next
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {COMPOUNDING.map((c, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '220px 1fr', gap: 32, alignItems: 'center',
                padding: '24px 0',
                borderBottom: i < COMPOUNDING.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
              }}>
                <div style={{ ...BAR, fontSize: 13, fontWeight: 700, color: GOLD, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{c.cycle}</div>
                <div style={{ ...BAR, fontSize: 15, color: 'rgba(240,237,228,0.8)', lineHeight: 1.5 }}>{c.outcome}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* The moat */}
      <div style={{ background: IVORY, padding: '64px 32px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
            <div>
              <p style={{ ...BAR, fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD, marginBottom: 12 }}>The Defensible Moat</p>
              <h2 style={{ ...GEO, fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 600, color: NAVY, marginBottom: 20, lineHeight: 1.2 }}>
                What no competitor can replicate in 90 days
              </h2>
              <p style={{ ...BAR, fontSize: 14, color: 'rgba(10,15,46,0.65)', lineHeight: 1.7, marginBottom: 24 }}>
                Model capabilities can be replicated. Interface design can be copied. The structured record of how your organization made decisions, how long each step took, which stakeholders responded fastest, and what outcomes resulted — that cannot be reproduced. It is built through lived execution, not prompts.
              </p>
              <p style={{ ...GEO, fontSize: 19, fontStyle: 'italic', color: NAVY, lineHeight: 1.5 }}>
                "Our moat is the compounding decision-outcome dataset tied to governed execution workflows — not just model prompts."
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { metric: "8", label: "Dimensions recorded per activation" },
                { metric: "0–100", label: "Readiness score updated continuously" },
                { metric: "+18%", label: "Avg execution improvement per protocol iteration" },
                { metric: "Board-ready", label: "Audit trail available at all times" },
              ].map(item => (
                <div key={item.label} style={{ background: '#fff', border: '1px solid rgba(10,15,46,0.08)', padding: '20px 24px', display: 'flex', gap: 20, alignItems: 'center' }}>
                  <div style={{ ...GEO, fontSize: 28, fontWeight: 600, color: NAVY, minWidth: 96 }}>{item.metric}</div>
                  <div style={{ ...BAR, fontSize: 13, color: 'rgba(10,15,46,0.6)', lineHeight: 1.4 }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: NAVY, padding: '56px 32px', textAlign: 'center' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{ height: 1, background: 'rgba(201,168,76,0.25)', marginBottom: 36 }} />
          <h2 style={{ ...GEO, fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 600, color: '#fff', marginBottom: 12 }}>
            See the full technical architecture
          </h2>
          <p style={{ ...BAR, fontSize: 15, color: 'rgba(240,237,228,0.6)', marginBottom: 32 }}>
            The Data Fabric, Institutional Memory, and Integration layer — how they connect.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/execution-data-fabric" style={{ ...BAR, display: 'inline-block', background: 'transparent', color: GOLD, border: `1px solid ${GOLD}`, fontSize: 13, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '12px 28px', textDecoration: 'none' }}>
              ← Execution Data Fabric
            </a>
            <a href="/platform-integrations" style={{ ...BAR, display: 'inline-block', background: GOLD, color: NAVY, fontSize: 13, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '12px 28px', textDecoration: 'none' }}>
              Platform Integrations →
            </a>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
