import PageLayout from '@/components/layout/PageLayout';
import { useEffect } from 'react';
import { updatePageMetadata } from '@/lib/seo';
import { useLocation } from 'wouter';
import {
  Radio, Tag, Shield, Users, DollarSign, PhoneCall,
  List, Plug, MessageSquare, FileCheck, BookMarked, RefreshCw,
  CheckCircle, XCircle, Minus, ArrowRight
} from 'lucide-react';

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const IVORY = "#F0EDE4";
const BORDER = "#E8E4DC";
const MUTED = "#6B7280";

const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
const BC: React.CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };

const gaps = [
  { n: "01", icon: Radio,       name: "Detection"    },
  { n: "02", icon: Tag,         name: "Recognition"  },
  { n: "03", icon: Shield,      name: "Authority"    },
  { n: "04", icon: Users,       name: "Team Assembly"},
  { n: "05", icon: DollarSign,  name: "Budget Auth." },
  { n: "06", icon: PhoneCall,   name: "Ext. Resources"},
  { n: "07", icon: List,        name: "Sequencing"   },
  { n: "08", icon: Plug,        name: "Systems Coord."},
  { n: "09", icon: MessageSquare, name: "Comms"      },
  { n: "10", icon: FileCheck,   name: "Compliance"   },
  { n: "11", icon: BookMarked,  name: "Gov. Record"  },
  { n: "12", icon: RefreshCw,   name: "Learning"     },
];

type Coverage = 'no' | 'partial' | 'yes';
interface Competitor { label: string; sub: string; gaps: Coverage[]; }

const competitors: Competitor[] = [
  { label: "Strategy Consultants",          sub: "McKinsey · Bain · BCG · Kroll · FTI",          gaps: ['no','partial','partial','partial','no','yes','partial','no','partial','partial','partial','no']  },
  { label: "Crisis Communications",         sub: "Edelman · Hill+Knowlton · Teneo · Brunswick",   gaps: ['no','partial','no','partial','no','yes','partial','no','yes','no','partial','no']                },
  { label: "IBP / Planning Frameworks",     sub: "S&OP · IBP · Governance · Scenario Planning",   gaps: ['partial','partial','partial','no','no','no','partial','partial','no','partial','partial','partial']},
  { label: "Workflow & Orchestration",      sub: "ServiceNow · Power Automate · Monday · Asana",  gaps: ['no','no','partial','partial','no','no','yes','yes','partial','no','partial','partial']            },
  { label: "AI Agent Platforms",            sub: "Salesforce Agentforce · Copilot · Agentic tools",gaps: ['partial','partial','partial','partial','no','no','partial','partial','partial','no','partial','partial']},
  { label: "GRC / Risk Platforms",          sub: "Archer · OneTrust · Riskonnect · ServiceNow GRC",gaps: ['partial','partial','partial','no','partial','no','no','partial','no','yes','yes','partial']       },
  { label: "BCP / Incident Response",       sub: "Everbridge · Fusion · Castellan",               gaps: ['partial','partial','partial','partial','partial','partial','partial','partial','partial','partial','partial','partial']},
  { label: "Tabletop Facilitators",         sub: "Mandiant · CrowdStrike · Booz Allen",           gaps: ['no','partial','partial','no','no','no','partial','no','partial','no','partial','partial']         },
  { label: "Internal PMO / Transformation", sub: "Chief of Staff · PMO · Enterprise Transformation",gaps: ['no','no','partial','partial','partial','partial','partial','no','partial','partial','partial','partial']},
];

function Cell({ v }: { v: Coverage }) {
  if (v === 'yes')     return <CheckCircle className="w-4 h-4 mx-auto" style={{ color: TEAL }} />;
  if (v === 'partial') return <Minus       className="w-4 h-4 mx-auto" style={{ color: GOLD }} />;
  return                      <XCircle     className="w-4 h-4 mx-auto" style={{ color: "#D1D5DB" }} />;
}

export default function MobilizationGap() {
  const [, nav] = useLocation();

  useEffect(() => {
    updatePageMetadata(
      'The 12-Gap Matrix | VaughnMartin Readiness OS',
      'Nine categories, twelve mobilization gaps, zero alternatives that close all 12. Readiness OS closes every gap before the trigger fires.'
    );
  }, []);

  return (
    <PageLayout>
      {/* ── BACK NAV ── */}
      <div style={{ background: NAVY, borderBottom: '1px solid rgba(201,168,76,0.15)', padding: '10px 48px' }}>
        <button onClick={() => window.history.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', padding: 0 }}>
          ← Back
        </button>
      </div>

      {/* ── HERO ── */}
      <section style={{ background: NAVY, padding: '60px 0 56px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px' }}>
          <p style={{ ...BC, color: GOLD, fontSize: 11, letterSpacing: '0.24em', textTransform: 'uppercase', marginBottom: 14 }}>
            The Mobilization Gap Matrix
          </p>
          <h1 style={{ ...CG, color: '#FFFFFF', fontSize: 'clamp(36px,4.5vw,58px)', fontWeight: 600, lineHeight: 1.1, marginBottom: 18, maxWidth: 820 }}>
            Nine categories. Twelve mobilization gaps.<br />
            <span style={{ color: GOLD }}>Zero alternatives close all 12.</span>
          </h1>
          <p style={{ color: '#94A3B8', fontSize: 16, lineHeight: 1.7, maxWidth: 620, marginBottom: 36 }}>
            Every alternative is reactive by design. Readiness OS closes all 12 gaps before the trigger fires — 
            the only platform built that way from the ground up.
          </p>
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
            {[['12', 'Gaps Closed'], ['9', 'Alternatives Compared'], ['0', 'Others Close All 12'], ['12 min', 'To Full Execution']].map(([n, l]) => (
              <div key={n}>
                <div style={{ ...BC, color: GOLD, fontSize: 32, fontWeight: 700, lineHeight: 1 }}>{n}</div>
                <div style={{ ...BC, color: '#64748B', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE MATRIX ── */}
      <section style={{ background: '#FFFFFF', padding: '0 0 72px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px' }}>

          {/* Legend strip */}
          <div style={{ background: IVORY, borderBottom: `1px solid ${BORDER}`, padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 32, marginBottom: 0 }}>
            <span style={{ ...BC, color: NAVY, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, marginRight: 8 }}>Legend</span>
            {[
              { el: <CheckCircle className="w-4 h-4" style={{ color: TEAL }} />, label: 'Closes this gap' },
              { el: <Minus       className="w-4 h-4" style={{ color: GOLD }} />, label: 'Partial / narrow' },
              { el: <XCircle     className="w-4 h-4" style={{ color: '#D1D5DB' }} />, label: 'Does not close' },
            ].map(({ el, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {el}
                <span style={{ color: MUTED, fontSize: 12 }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Matrix table */}
          <div style={{ overflowX: 'auto', border: `1px solid ${BORDER}`, borderTop: 'none' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1040 }}>

              {/* Column headers — gap numbers + icons */}
              <thead>
                <tr style={{ background: NAVY }}>
                  {/* row label column */}
                  <th style={{ ...BC, color: '#64748B', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', padding: '18px 24px', textAlign: 'left', width: 210, fontWeight: 600, verticalAlign: 'bottom', borderRight: `1px solid rgba(255,255,255,0.08)` }}>
                    Category
                  </th>
                  {gaps.map((g) => {
                    const Icon = g.icon;
                    return (
                      <th key={g.n} style={{ padding: '14px 6px', textAlign: 'center', minWidth: 72, verticalAlign: 'bottom', borderRight: `1px solid rgba(255,255,255,0.06)` }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                          <span style={{ ...BC, color: GOLD, fontSize: 8, letterSpacing: '0.16em', fontWeight: 700 }}>{g.n}</span>
                          <Icon className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.5)' }} />
                          <span style={{ ...BC, color: 'rgba(255,255,255,0.7)', fontSize: 8.5, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, lineHeight: 1.2, maxWidth: 60, display: 'block' }}>
                            {g.name}
                          </span>
                        </div>
                      </th>
                    );
                  })}
                  {/* score column */}
                  <th style={{ ...BC, color: '#64748B', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '14px 12px', textAlign: 'center', fontWeight: 600, minWidth: 60, borderLeft: `1px solid rgba(255,255,255,0.08)`, verticalAlign: 'bottom' }}>
                    Score
                  </th>
                </tr>
              </thead>

              <tbody>
                {competitors.map((c, ci) => {
                  const score = c.gaps.filter(v => v === 'yes').length;
                  const partial = c.gaps.filter(v => v === 'partial').length;
                  return (
                    <tr key={c.label} style={{
                      borderBottom: `1px solid ${BORDER}`,
                      background: ci % 2 === 0 ? '#FAFAF9' : '#FFFFFF',
                    }}>
                      <td style={{ padding: '13px 24px', verticalAlign: 'middle', borderRight: `1px solid ${BORDER}` }}>
                        <div style={{ ...BC, color: NAVY, fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', marginBottom: 2 }}>{c.label}</div>
                        <div style={{ color: MUTED, fontSize: 10, lineHeight: 1.4 }}>{c.sub}</div>
                      </td>
                      {c.gaps.map((v, gi) => (
                        <td key={gi} style={{ padding: '10px 4px', textAlign: 'center', verticalAlign: 'middle', borderRight: `1px solid ${BORDER}` }}>
                          <Cell v={v} />
                        </td>
                      ))}
                      {/* score */}
                      <td style={{ padding: '10px 12px', textAlign: 'center', verticalAlign: 'middle', borderLeft: `1px solid ${BORDER}` }}>
                        <div style={{ ...BC, fontSize: 13, fontWeight: 700, color: score >= 4 ? TEAL : MUTED }}>
                          {score}<span style={{ color: MUTED, fontWeight: 400 }}>/{gaps.length}</span>
                        </div>
                        {partial > 0 && <div style={{ ...BC, fontSize: 9, color: GOLD, marginTop: 2 }}>{partial} partial</div>}
                      </td>
                    </tr>
                  );
                })}

                {/* ── READINESS OS ROW ── */}
                <tr style={{ borderTop: `2px solid ${GOLD}` }}>
                  <td style={{ padding: '16px 24px', verticalAlign: 'middle', background: NAVY, borderRight: `1px solid rgba(255,255,255,0.1)` }}>
                    <div style={{ ...BC, color: GOLD, fontSize: 13, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 2 }}>Readiness OS</div>
                    <div style={{ color: '#64748B', fontSize: 10 }}>VaughnMartin · Readiness Infrastructure</div>
                  </td>
                  {gaps.map((_, gi) => (
                    <td key={gi} style={{ padding: '12px 4px', textAlign: 'center', verticalAlign: 'middle', background: NAVY, borderRight: `1px solid rgba(255,255,255,0.07)` }}>
                      <CheckCircle className="w-4 h-4 mx-auto" style={{ color: TEAL }} />
                    </td>
                  ))}
                  <td style={{ padding: '12px', textAlign: 'center', background: NAVY, borderLeft: `1px solid rgba(255,255,255,0.1)` }}>
                    <div style={{ ...BC, fontSize: 16, fontWeight: 800, color: GOLD }}>12<span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>/{gaps.length}</span></div>
                    <div style={{ ...BC, fontSize: 8, color: TEAL, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 2 }}>All closed</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Gap name key — full labels below the matrix */}
          <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px 24px' }}>
            {gaps.map((g) => {
              const Icon = g.icon;
              return (
                <div key={g.n} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ ...BC, color: GOLD, fontSize: 10, fontWeight: 700, flexShrink: 0, paddingTop: 1 }}>{g.n}</span>
                  <Icon className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: NAVY }} />
                  <span style={{ color: MUTED, fontSize: 12, lineHeight: 1.4 }}>
                    <strong style={{ color: NAVY, fontSize: 12 }}>{g.name.replace('.', '')}</strong>
                    {g.n === '01' && ' — continuous monitoring, 231 thresholds'}
                    {g.n === '02' && ' — 180 protocols pre-matched to situation types'}
                    {g.n === '03' && ' — decision rights defined cold, before the trigger'}
                    {g.n === '04' && ' — stakeholders pre-assigned, assembly automatic'}
                    {g.n === '05' && ' — budget pre-authorized per protocol'}
                    {g.n === '06' && ' — retainers on standby, briefed before arrival'}
                    {g.n === '07' && ' — 22+ tasks in correct sequence, automatic'}
                    {g.n === '08' && ' — 55+ connectors, systems coordinate automatically'}
                    {g.n === '09' && ' — approved messaging frameworks pre-staged'}
                    {g.n === '10' && ' — disclosure requirements mapped per situation'}
                    {g.n === '11' && ' — complete governance record auto-generated'}
                    {g.n === '12' && ' — ADVANCE loop: knowledge compounds every activation'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SUMMARY STATEMENT ── */}
      <section style={{ background: NAVY, padding: '52px 48px', textAlign: 'center' }}>
        <div style={{ maxWidth: 840, margin: '0 auto' }}>
          <p style={{ ...CG, color: '#FFFFFF', fontSize: 'clamp(20px,2.5vw,30px)', fontWeight: 600, lineHeight: 1.5 }}>
            Every alternative is either reactive by design, narrow in scope, or governance-only with no execution layer.{' '}
            <span style={{ color: GOLD }}>None pre-stage the complete response before the situation presents itself.</span>
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: IVORY, padding: '56px 48px', borderTop: `1px solid ${BORDER}`, textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <p style={{ ...BC, color: NAVY, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 14, fontWeight: 700 }}>Founding Partner Program</p>
          <h3 style={{ ...CG, color: NAVY, fontSize: 'clamp(24px,3vw,36px)', fontWeight: 600, lineHeight: 1.3, marginBottom: 16 }}>
            Close all 12 gaps before your next situation fires.
          </h3>
          <p style={{ color: MUTED, fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
            90-day validated partnership. Direct founder involvement. 12 total seats.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => nav('/founding-partner-program')}
              style={{ ...BC, background: NAVY, color: '#FFFFFF', border: 'none', padding: '14px 32px', fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '0.15rem', display: 'flex', alignItems: 'center', gap: 8 }}
            >
              Apply for Founding Partner Access <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => nav('/executive-brief')}
              style={{ ...BC, background: 'transparent', color: NAVY, border: `1px solid ${BORDER}`, padding: '14px 32px', fontSize: 13, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '0.15rem' }}
            >
              Executive Brief
            </button>
          </div>
        </div>
      </section>

    </PageLayout>
  );
}
