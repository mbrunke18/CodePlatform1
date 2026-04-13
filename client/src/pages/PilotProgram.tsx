import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import PageLayout from '@/components/layout/PageLayout';
import { useEffect } from 'react';
import { updatePageMetadata } from '@/lib/seo';
import { VaughnMartinLogo } from "@/components/VaughnMartinLogo";

const pilotPhases = [
  {
    phase: 'Phase 0',
    name: 'Readiness & Setup',
    duration: 'Weeks 1-2',
    color: 'bg-[#6B7280]',
    activities: [
      'Executive sponsor alignment session',
      'Integration setup (Jira, Slack/Teams)',
      'Select 3-5 pilot playbooks from 170 library',
      'Configure signal monitoring for pilot triggers',
      'Baseline current response metrics'
    ],
    deliverables: ['Integration complete', 'Playbooks configured', 'Baseline metrics documented'],
    successMetrics: 'All integrations tested and operational'
  },
  {
    phase: 'Phase 1',
    name: 'Dry Runs & Training',
    duration: 'Weeks 3-6',
    color: 'bg-[#0A0F2E]',
    activities: [
      'Conduct 2-3 tabletop exercises with Readiness OS',
      'Measure activation time (target: <12 min)',
      'Train response team leads on Readiness OS workflow',
      'Refine playbooks based on dry run feedback',
      'Establish KPI tracking dashboard'
    ],
    deliverables: ['Dry run reports', 'Training completion', 'Refined playbooks'],
    successMetrics: 'Activation time under 15 minutes in dry runs'
  },
  {
    phase: 'Phase 2',
    name: 'Live Activation',
    duration: 'Weeks 7-10',
    color: 'bg-[#2B8A6E]',
    activities: [
      'Enable live signal monitoring',
      'First live playbook activation',
      'Track all coordination metrics',
      'Document lessons learned',
      'Capture stakeholder feedback'
    ],
    deliverables: ['Live activation data', 'ROI evidence', 'User testimonials'],
    successMetrics: 'At least 1 live activation with measured 12-minute response'
  },
  {
    phase: 'Phase 3',
    name: 'Executive Readout',
    duration: 'Weeks 11-12',
    color: 'bg-[#C9A84C]',
    activities: [
      'Compile ROI scorecard',
      'Present results to executive sponsor',
      'Define production rollout plan',
      'Negotiate enterprise agreement',
      'Plan Phase 2 expansion'
    ],
    deliverables: ['Executive presentation', 'ROI scorecard', 'Expansion proposal'],
    successMetrics: 'Clear go/no-go decision with quantified value'
  }
];

const pilotInclusions = [
  {
    category: 'Platform Access',
    items: [
      'Full Readiness OS platform access for pilot team (up to 25 users)',
      '5 customizable playbooks from 170 library',
      'Signal monitoring for 3 intelligence categories',
      'Command Center with real-time coordination'
    ]
  },
  {
    category: 'Integrations',
    items: [
      'Bi-directional Jira or Asana sync',
      'Slack or Microsoft Teams notifications',
      'Email notification integration',
      'SSO configuration (if needed)'
    ]
  },
  {
    category: 'Support',
    items: [
      'Dedicated Customer Success Manager',
      'Weekly check-in calls',
      'Priority support response (4hr SLA)',
      'Executive sponsor alignment sessions'
    ]
  },
  {
    category: 'Training',
    items: [
      '2-hour platform training session',
      'Playbook customization workshop',
      'Tabletop exercise facilitation (2-3 sessions)',
      'Documentation and quick-start guides'
    ]
  }
];

const idealCandidates = [
  {
    criteria: 'Organization Size',
    description: 'Fortune 1000 or equivalent ($1B+ revenue)',
    importance: 'Required'
  },
  {
    criteria: 'Executive Sponsor',
    description: 'C-level or SVP champion with budget authority',
    importance: 'Required'
  },
  {
    criteria: 'PM Tool',
    description: 'Active Jira, Asana, or Monday.com deployment',
    importance: 'Required'
  },
  {
    criteria: 'Recent Pain Point',
    description: 'Experienced slow response to strategic event in past 12 months',
    importance: 'Preferred'
  },
  {
    criteria: 'Multi-Department',
    description: 'Strategic events require 4+ departments to coordinate',
    importance: 'Preferred'
  },
  {
    criteria: 'Growth Intent',
    description: 'Committed to enterprise rollout if pilot succeeds',
    importance: 'Preferred'
  }
];

const roiCalculator = [
  {
    metric: 'Hours Saved per Event',
    baseline: '20-50 hours',
    withExecutionOS: '0 hours (pre-planned)',
    calculation: '20-50 × $500/hr executive time',
    value: '$10,000-$25,000'
  },
  {
    metric: 'Response Time',
    baseline: '30 days to full coordination',
    withExecutionOS: '12 minutes to full coordination',
    calculation: 'Revenue protected by faster response',
    value: '$500K-$2M per major event'
  },
  {
    metric: 'C-Suite Time Recovery',
    baseline: '50+ hours per event',
    withExecutionOS: '5 hours oversight only',
    calculation: '45 hours × $1,000/hr',
    value: '$45,000+ per event'
  },
  {
    metric: 'Tool Consolidation',
    baseline: 'Multiple point solutions',
    withExecutionOS: 'Single execution platform',
    calculation: 'Reduced platform licensing',
    value: '$50-100K annually'
  }
];

const conversionTerms = [
  {
    term: '100% Pilot Credit',
    description: 'Full pilot investment applies to enterprise contract',
  },
  {
    term: 'Preferred Pricing',
    description: 'Founding partner rates locked for 3 years',
  },
  {
    term: 'Priority Roadmap',
    description: 'Input on feature development priorities',
  },
  {
    term: 'Enterprise SLA',
    description: '99.9% uptime, 2-hour priority support',
  }
];

export default function PilotProgram() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    updatePageMetadata({
      title: "90-Day Pilot Program - Readiness OS | Strategic Readiness Platform",
      description: "Validate Readiness OS' 12-minute coordination claim with a structured 90-day pilot. Includes 5 playbooks, Jira integration, and dedicated success manager. 100% credit applies to enterprise contract.",
      ogTitle: "Readiness OS Pilot Program | 90 Days to Transform Strategic Readiness",
      ogDescription: "Fortune 1000 pilot program with ROI measurement, live activation, and clear conversion path.",
    });
  }, []);

  return (
    <PageLayout>
      <div className="bg-[#F8F7F4] dark:bg-[#0A0F2E]">
        
        {/* Hero Section */}
        <section style={{ background: '#0A0F2E', padding: '96px 32px 80px' }}>
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            <div style={{ marginBottom: 20 }}>
              <VaughnMartinLogo color="light" height={40} variant="full" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
              <div style={{ width: 32, height: 1, background: 'rgba(201,168,76,0.5)' }} />
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: '#C9A84C' }}>
                Fortune 1000 Design Partner Program
              </span>
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(36px,5vw,56px)', fontWeight: 700, color: '#fff', lineHeight: 1.15, marginBottom: 8, maxWidth: 740 }} data-testid="heading-pilot-program">
              90-Day Pilot Program
            </h1>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(22px,3vw,32px)', fontWeight: 400, fontStyle: 'italic', color: '#C9A84C', marginBottom: 28 }}>
              Validate before you commit.
            </p>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 17, color: 'rgba(240,237,228,0.7)', maxWidth: 620, marginBottom: 52, lineHeight: 1.7, fontWeight: 400 }}>
              Prove the 12-minute coordination claim with real activations in your environment. Structured phases, measurable outcomes, and a clear path to enterprise deployment.
            </p>
            
            {/* Key Stats — editorial horizontal strip */}
            <div style={{ display: 'flex', gap: 0, marginBottom: 52, borderTop: '1px solid rgba(201,168,76,0.2)', paddingTop: 32 }}>
              {[
                { val: '$75K', label: 'Pilot Investment' },
                { val: '90', label: 'Days' },
                { val: '5', label: 'Playbooks Configured' },
                { val: '25', label: 'Users' },
                { val: '100%', label: 'Credit to Enterprise Year 1' },
              ].map((s, i) => (
                <div key={s.label} style={{ flex: 1, paddingRight: 24, borderRight: i < 4 ? '1px solid rgba(255,255,255,0.08)' : 'none', paddingLeft: i > 0 ? 24 : 0 }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, color: '#C9A84C', lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: 'rgba(240,237,228,0.45)', marginTop: 6 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' as const }}>
              <button
                style={{ fontFamily: "'Barlow Condensed', sans-serif", background: '#C9A84C', color: '#0A0F2E', fontWeight: 800, fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase' as const, padding: '16px 40px', border: 'none', cursor: 'pointer' }}
                onClick={() => setLocation('/request-access')}
                data-testid="button-apply-pilot"
              >
                Apply for Pilot Program
              </button>
              <button
                style={{ fontFamily: "'Barlow Condensed', sans-serif", background: 'transparent', color: '#C9A84C', fontWeight: 700, fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase' as const, padding: '16px 32px', border: '1px solid rgba(201,168,76,0.35)', cursor: 'pointer' }}
                onClick={() => setLocation('/request-access')}
                data-testid="button-request-access"
              >
                Request Executive Access
              </button>
            </div>
          </div>
        </section>

        {/* Differentiation Strip */}
        <section className="py-8 px-6 bg-[#0A0F2E] border-t border-white/5">
          <div className="max-w-5xl mx-auto grid grid-cols-3 gap-px bg-white/5" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
            {[
              { label: "Agentic, not a Copilot", body: "Our IDEA agents execute tasks. They don't suggest them. This is the difference between an AI tool and an execution engine." },
              { label: "Coordination, not capability", body: "Every enterprise already has AI capability. What they're missing is the coordination layer that makes AI execute — not just recommend." },
              { label: "Pre-staged, not inferred", body: "170 playbooks are ready before the trigger fires. No real-time inference loops. That's how you compress 30 days into 12 minutes." },
            ].map((item) => (
              <div key={item.label} style={{ padding: '20px 24px', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 8 }}>{item.label}</div>
                <div style={{ fontSize: 12, color: 'rgba(240,237,228,0.55)', lineHeight: 1.6 }}>{item.body}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 4-Phase Timeline */}
        <section style={{ padding: '80px 32px', background: '#F8F7F4' }}>
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            <div style={{ marginBottom: 52 }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: '#C9A84C', marginBottom: 16 }}>
                Structured 90-Day Journey
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px,4vw,40px)', fontWeight: 700, color: '#0A0F2E', lineHeight: 1.2, marginBottom: 0 }} data-testid="heading-phases">
                Crawl, walk, run — with clear milestones at every phase.
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, borderTop: '2px solid #0A0F2E' }} data-testid="phases-grid">
              {pilotPhases.map((phase, i) => {
                const phaseColors = ['#6B7280', '#0A0F2E', '#2B8A6E', '#C9A84C'];
                const color = phaseColors[i];
                return (
                  <div key={i} style={{ padding: '28px 24px 28px', borderRight: i < 3 ? '1px solid #E8E4DC' : 'none', borderTop: `3px solid ${color}`, marginTop: -2 }} data-testid={`phase-${i}`}>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color, marginBottom: 4 }}>{phase.duration}</div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: '#0A0F2E', marginBottom: 4 }}>{phase.phase}</div>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 700, color: '#0A0F2E', marginBottom: 16, letterSpacing: '0.04em' }}>{phase.name}</div>
                    <div style={{ marginBottom: 20 }}>
                      {phase.activities.slice(0, 3).map((activity, j) => (
                        <div key={j} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
                          <div style={{ width: 3, height: 3, background: color, marginTop: 6, flexShrink: 0 }} />
                          <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: '#555', lineHeight: 1.5 }}>{activity}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ borderTop: '1px solid #E8E4DC', paddingTop: 16 }}>
                      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: '#6B7280', marginBottom: 4 }}>Success Metric</div>
                      <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: '#555', lineHeight: 1.5 }}>{phase.successMetrics}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section style={{ padding: '80px 32px', background: '#fff' }}>
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            <div style={{ marginBottom: 52 }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: '#C9A84C', marginBottom: 16 }}>
                What's Included
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px,4vw,40px)', fontWeight: 700, color: '#0A0F2E', lineHeight: 1.2 }} data-testid="heading-inclusions">
                Everything needed to validate Readiness OS in your environment.
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, border: '1px solid #E8E4DC' }}>
              {pilotInclusions.map((inclusion, i) => (
                <div key={i} style={{ padding: '28px 24px', borderRight: i < pilotInclusions.length - 1 ? '1px solid #E8E4DC' : 'none' }} data-testid={`card-inclusion-${i}`}>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: '#0A0F2E', marginBottom: 20, borderBottom: '1px solid #E8E4DC', paddingBottom: 12 }}>{inclusion.category}</div>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                    {inclusion.items.map((item, j) => (
                      <li key={j} style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'flex-start' }}>
                        <div style={{ width: 3, height: 3, background: '#2B8A6E', marginTop: 6, flexShrink: 0 }} />
                        <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: '#555', lineHeight: 1.5 }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ideal Candidates */}
        <section style={{ padding: '80px 32px', background: '#F8F7F4' }}>
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            <div style={{ marginBottom: 52 }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: '#C9A84C', marginBottom: 16 }}>
                Ideal Pilot Candidates
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px,4vw,40px)', fontWeight: 700, color: '#0A0F2E', lineHeight: 1.2 }} data-testid="heading-candidates">
                Organizations positioned to maximize pilot value.
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>
              {idealCandidates.map((candidate, i) => {
                const isRequired = candidate.importance === 'Required';
                return (
                  <div key={i} style={{ padding: '28px 24px', borderLeft: i > 0 ? '1px solid #E8E4DC' : 'none', borderTop: i >= 3 ? '1px solid #E8E4DC' : 'none' }} data-testid={`card-candidate-${i}`}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 700, color: '#0A0F2E', letterSpacing: '0.04em', lineHeight: 1.3 }}>{candidate.criteria}</div>
                      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: isRequired ? '#fff' : '#6B7280', background: isRequired ? '#0A0F2E' : 'transparent', padding: isRequired ? '2px 6px' : '2px 0', whiteSpace: 'nowrap' as const, marginLeft: 8, flexShrink: 0 }}>
                        {candidate.importance}
                      </div>
                    </div>
                    <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: '#555', lineHeight: 1.6 }}>{candidate.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ROI Measurement Framework */}
        <section className="py-16 px-6 bg-[#0A0F2E]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 14 }}>
                <div style={{ width: 20, height: 1.5, background: '#C9A84C' }} />
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: 'rgba(201,168,76,0.7)' }}>
                  Quantified Value Capture
                </span>
                <div style={{ width: 20, height: 1.5, background: '#C9A84C' }} />
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px,4vw,42px)', fontWeight: 700, color: '#fff', lineHeight: 1.15, margin: 0 }} data-testid="heading-roi">
                ROI Measurement Framework
              </h2>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 16, color: 'rgba(255,255,255,0.5)', marginTop: 12, lineHeight: 1.6 }}>
                Every milestone produces evidence. Every activation is measured.
              </p>
            </div>

            <div style={{ border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }} data-testid="card-roi-framework">
              <div style={{ padding: 0, overflowX: 'auto' }}>
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-4 font-semibold text-white">Value Metric</th>
                      <th className="text-left p-4 font-semibold text-red-400">Before Readiness OS</th>
                      <th className="text-left p-4 font-semibold text-[#3BAF8A]">With Readiness OS</th>
                      <th className="text-left p-4 font-semibold text-white/70">Calculation</th>
                      <th className="text-right p-4 font-semibold text-[#C9A84C]">Value Captured</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roiCalculator.map((row, i) => (
                      <tr key={i} className="border-b border-white/5 last:border-0">
                        <td className="p-4 text-white font-medium">{row.metric}</td>
                        <td className="p-4 text-red-400/80">{row.baseline}</td>
                        <td className="p-4 text-[#3BAF8A]">{row.withExecutionOS}</td>
                        <td className="p-4 text-white/60 text-sm">{row.calculation}</td>
                        <td className="p-4 text-[#C9A84C] font-bold text-right">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-white/5">
                      <td colSpan={4} className="p-4 text-white font-bold text-right">Total Value per Major Event:</td>
                      <td className="p-4 text-2xl font-bold text-[#C9A84C] text-right">$60K - $2M+</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Conversion Terms */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div style={{ borderBottom: '1px solid #E8E4DC', paddingBottom: 28, marginBottom: 48 }}>
              <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#2B8A6E', marginBottom: 12 }}>Founding Partner Benefits</p>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px,4vw,40px)', fontWeight: 700, color: '#0A0F2E', lineHeight: 1.2 }} data-testid="heading-conversion">
                Pilot to Production Path
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
              {conversionTerms.map((term, i) => (
                <div key={i} style={{ borderLeft: i === 0 ? '1px solid #E8E4DC' : 'none', borderRight: '1px solid #E8E4DC', borderTop: '3px solid #2B8A6E', borderBottom: '1px solid #E8E4DC', padding: '28px 24px' }} data-testid={`card-term-${i}`}>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2B8A6E', marginBottom: 14 }}>Benefit {String(i + 1).padStart(2, '0')}</div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: '#0A0F2E', marginBottom: 10, lineHeight: 1.2 }}>{term.term}</h3>
                  <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: '#4B5563', lineHeight: 1.6 }}>{term.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories Preview */}
        <section className="py-16 px-6 bg-[#F8F7F4]">
          <div className="max-w-4xl mx-auto">
            <div style={{ background: '#fff', borderTop: '3px solid #0A0F2E', borderLeft: '1px solid #E8E4DC', borderRight: '1px solid #E8E4DC', borderBottom: '1px solid #E8E4DC', padding: '40px 48px' }} data-testid="card-success-preview">
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#0A0F2E', marginBottom: 8, opacity: 0.45 }}>Pilot Success Target</div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(24px,3vw,32px)', fontWeight: 700, color: '#0A0F2E', marginBottom: 28 }}>
                What Success Looks Like
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                {[
                  "At least 1 live activation under 15 minutes",
                  "5+ playbooks customized and operational",
                  "Quantified ROI with executive sign-off",
                  "Clear expansion plan for enterprise rollout"
                ].map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ width: 6, height: 6, background: '#2B8A6E', flexShrink: 0, marginTop: 7 }} />
                    <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: '#374151', lineHeight: 1.6 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Independent Peer Assessment */}
        <section className="py-16 px-6 bg-[#F8F7F4]">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 14 }}>
                <div style={{ width: 20, height: 1.5, background: '#C9A84C' }} />
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: '#C9A84C' }}>Part of the Pilot Structure</span>
                <div style={{ width: 20, height: 1.5, background: '#C9A84C' }} />
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px,4vw,40px)', fontWeight: 700, color: '#0A0F2E', lineHeight: 1.2, margin: '0 0 16px' }}>Independent Peer Assessment</h2>
              <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed">
                Every pilot participant completes a structured 28-question independent assessment. Your unfiltered perspective — credibility gaps, competitive concerns, pricing instincts — is captured and used to improve the product and sharpen the go-to-market approach.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {[
                { label: "Before the Pilot", description: "Section A (The Problem Space) establishes your baseline — what the execution gap looks like in your organization before you have experienced the platform.", color: "#6B7280" },
                { label: "After the Pilot", description: "Sections B–F capture your full verdict: product clarity, market viability, gaps, competitive landscape, and whether you would buy or refer.", color: "#0A0F2E" },
                { label: "Becomes Product Intelligence", description: "Responses feed directly into a private analytics dashboard. Patterns across reviewers drive the product roadmap and sharpen messaging.", color: "#2B8A6E" },
              ].map(item => (
                <div key={item.label} className="bg-white border border-[#E8E4DC] p-6" style={{ borderTop: `3px solid ${item.color}` }}>
                  <h3 className="font-bold text-[#0A0F2E] mb-2 text-sm uppercase tracking-wide">{item.label}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
            <div className="bg-white border border-[#E8E4DC] p-8 flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <div className="text-xs font-bold tracking-[0.2em] uppercase text-[#C9A84C] mb-2">Independent Assessment</div>
                <h3 className="text-xl font-bold text-[#0A0F2E] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Ready to Share Your Assessment?</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Critical and skeptical feedback is more valuable than a positive review. 28 questions across 6 sections. Estimated 25–35 minutes.</p>
              </div>
              <div className="flex-shrink-0">
                <button
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", background: '#0A0F2E', color: '#C9A84C', fontWeight: 800, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '14px 28px', border: 'none', cursor: 'pointer' }}
                  onClick={() => { setLocation('/peer-review'); window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }); }}
                >
                  Begin Peer Assessment
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Pilot Onboarding Preview */}
        <section className="py-14 px-6 bg-[#0A0F2E]">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 14 }}>
                <div style={{ width: 20, height: 1.5, background: '#C9A84C' }} />
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: 'rgba(201,168,76,0.7)' }}>What Happens After You Sign</span>
                <div style={{ width: 20, height: 1.5, background: '#C9A84C' }} />
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(24px,3.5vw,36px)', fontWeight: 700, color: '#fff', lineHeight: 1.2, margin: '0 0 12px' }}>Your first 90 days, by role.</h2>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xl mx-auto">
                Every pilot comes with a structured onboarding guide built around the five roles present in every Fortune 1000 pilot — so each person on your team knows exactly what they see, what they own, and what success looks like at day 90.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { phase: 'Days 1–30', label: 'Foundation', color: '#2B8A6E', desc: 'All 10 users onboarded. Integration live. First playbook activation completed.' },
                { phase: 'Days 31–60', label: 'Velocity', color: '#C9A84C', desc: 'Multiple activations with documented outcomes. ROI data capture begins.' },
                { phase: 'Days 61–90', label: 'Proof', color: '#2B8A6E', desc: 'Full activation history. Board brief generated. Renewal case quantified.' },
              ].map((t) => (
                <div key={t.label} style={{ borderTop: `3px solid ${t.color}` }} className="bg-white/5 p-5">
                  <p style={{ color: t.color }} className="text-xs font-bold tracking-widest uppercase mb-1">{t.phase}</p>
                  <p className="text-white font-semibold text-sm mb-2">{t.label}</p>
                  <p className="text-slate-400 text-xs leading-relaxed">{t.desc}</p>
                </div>
              ))}
            </div>
            <div className="text-center">
              <button
                onClick={() => setLocation('/pilot-onboarding')}
                className="inline-flex items-center gap-2 text-[#C9A84C] text-sm font-semibold hover:text-white transition-colors"
              >
                See the full role-by-role onboarding guide
                <svg width={14} height={14} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* Microsoft / Existing Stack Objection Section */}
        <section className="py-16 px-6 bg-[#F8F7F4]">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 14 }}>
                <div style={{ width: 20, height: 1.5, background: '#C9A84C' }} />
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: '#C9A84C' }}>A Question Every Pilot Candidate Asks</span>
                <div style={{ width: 20, height: 1.5, background: '#C9A84C' }} />
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(26px,4vw,42px)', fontWeight: 700, color: '#0A0F2E', lineHeight: 1.2, margin: '0 0 16px' }}>
                "We already have Microsoft Copilot. Why Readiness OS?"
              </h2>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
                Every Fortune 1000 has Microsoft's AI stack. None have the operating model to execute with it. Readiness OS is not a replacement — it is the coordination layer that makes your existing investment actionable.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-10">
              {/* What Microsoft does */}
              <div className="bg-white border border-[#E8E4DC] p-6">
                <div className="text-xs font-bold tracking-[0.18em] uppercase text-gray-400 mb-4">Your Microsoft Investment Does</div>
                <div className="space-y-3">
                  {[
                    "Copilot summarizes meetings and drafts documents",
                    "Azure OpenAI powers intelligent search and analysis",
                    "Teams connects your people for communication",
                    "Purview manages data governance and compliance",
                    "Defender monitors for security threats",
                  ].map(item => (
                    <div key={item} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-gray-300 flex-shrink-0 mt-2" />
                      <span className="text-sm text-gray-600 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-3 bg-[#F0EDE4] border border-[#E8E4DC]">
                  <p className="text-xs font-semibold text-[#0A0F2E]">What it doesn't do</p>
                  <p className="text-xs text-[#4B5563] mt-1 leading-relaxed">None of these tools coordinate your organization when a strategic trigger fires. They surface information — but someone still has to mobilize the people, assign the tasks, and execute the playbook. That coordination takes 30 days. That's the gap.</p>
                </div>
              </div>

              {/* What Readiness OS adds */}
              <div className="bg-[#0A0F2E] border border-[#0A0F2E] p-6">
                <div className="text-xs font-bold tracking-[0.18em] uppercase text-[#C9A84C] mb-4">Readiness OS Adds</div>
                <div className="space-y-3">
                  {[
                    "Pre-staged playbooks — 170 across 9 domains, ready before any trigger fires",
                    "Automated stakeholder cascade — every role notified and assigned in 12 minutes",
                    "Trigger-to-coordination engine — detection becomes execution, not a meeting",
                    "Decision authority preserved — AI orchestrates, your executives decide",
                    "Continuous improvement — every activation makes your playbooks smarter",
                  ].map(item => (
                    <div key={item} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-[#C9A84C] flex-shrink-0 mt-2" />
                      <span className="text-sm text-white/80 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-3 border border-[#C9A84C]/30 bg-[#C9A84C]/5">
                  <p className="text-xs font-semibold text-[#C9A84C]">The operating model layer</p>
                  <p className="text-xs text-white/70 mt-1 leading-relaxed">Readiness OS sits above your Microsoft investment — not beside it, not replacing it. Copilot detects and summarizes. Readiness OS deploys your people at the speed of detection.</p>
                </div>
              </div>
            </div>

            {/* Stack diagram */}
            <div className="bg-white border border-[#E8E4DC] p-6">
              <div className="text-xs font-bold tracking-[0.18em] uppercase text-[#C9A84C] mb-5 text-center">Enterprise Stack — Where Readiness OS Fits</div>
              <div className="space-y-2 max-w-2xl mx-auto">
                {[
                  { layer: "Readiness OS", role: "Operating Model — coordinates humans at the speed of AI detection", highlight: true },
                  { layer: "Microsoft Copilot & Azure OpenAI", role: "Signal Intelligence — detects, summarizes, analyzes", highlight: false },
                  { layer: "Microsoft Teams & Outlook", role: "Communication Infrastructure — how people connect", highlight: false },
                  { layer: "Jira / Asana / ServiceNow", role: "Work Management — where tasks are tracked", highlight: false },
                  { layer: "Defender / Purview / Sentinel", role: "Security & Compliance — what is monitored", highlight: false },
                ].map(({ layer, role, highlight }, i) => (
                  <div key={layer} className={`flex items-center gap-4 p-3 border ${highlight ? "border-[#C9A84C] bg-[#0A0F2E]" : "border-[#E8E4DC] bg-[#F8F7F4]"}`}>
                    <div className={`w-2 h-2 flex-shrink-0 ${highlight ? "bg-[#C9A84C]" : "bg-gray-300"}`} />
                    <div className={`text-sm font-semibold min-w-[240px] ${highlight ? "text-[#C9A84C]" : "text-[#0A0F2E]"}`}>{layer}</div>
                    <div className={`text-xs ${highlight ? "text-white/70" : "text-gray-500"}`}>{role}</div>
                    {highlight && <span className="ml-auto text-[10px] font-bold tracking-wider uppercase text-[#C9A84C] whitespace-nowrap">← Readiness OS</span>}
                    {!highlight && <span className="ml-auto text-[10px] text-gray-400 whitespace-nowrap">Already invested</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section style={{ background: '#0A0F2E', padding: '80px 32px' }}>
          <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
            <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 16 }}>We Make Enterprises Fearless</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(30px,4vw,44px)', fontWeight: 700, color: '#fff', lineHeight: 1.2, marginBottom: 16 }} data-testid="heading-cta">
              Ready to Validate Strategic Readiness?
            </h2>
            <div style={{ width: 48, height: 1, background: 'rgba(201,168,76,0.4)', margin: '0 auto 24px' }} />
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 15, color: 'rgba(255,255,255,0.6)', marginBottom: 40, lineHeight: 1.7 }}>
              Limited to 5 design partners. Priority given to Fortune 1000 organizations with recent strategic event pain.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16, marginBottom: 32 }}>
              <button
                style={{ fontFamily: "'Barlow Condensed', sans-serif", background: '#C9A84C', color: '#0A0F2E', fontWeight: 800, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '16px 40px', border: 'none', cursor: 'pointer' }}
                onClick={() => setLocation('/request-access')}
                data-testid="button-cta-apply"
              >
                Apply for Pilot Program
              </button>
              <button
                style={{ fontFamily: "'Barlow Condensed', sans-serif", background: 'transparent', color: 'rgba(255,255,255,0.75)', fontWeight: 700, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '16px 40px', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' }}
                onClick={() => setLocation('/investors')}
                data-testid="button-cta-positioning"
              >
                View Investor Overview
              </button>
            </div>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 32 }}>
              Questions? <span style={{ color: '#C9A84C' }}>pilot@vaughnmartin.com</span>
            </p>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 28 }}>
              <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 16 }}>Preparing for a leadership meeting?</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 20 }}>
                <button
                  onClick={() => setLocation('/prospect-demo')}
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", padding: '10px 24px', border: '1px solid rgba(201,168,76,0.4)', color: '#C9A84C', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', background: 'transparent', cursor: 'pointer' }}
                >
                  Run Personalized Demo →
                </button>
                <button
                  onClick={() => setLocation('/prospect-brief')}
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", padding: '10px 24px', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', background: 'transparent', cursor: 'pointer' }}
                >
                  Generate Executive Brief →
                </button>
              </div>
              <button
                onClick={() => setLocation('/request-access')}
                style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.35)', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                Want access without a pilot commitment? Request executive access →
              </button>
            </div>
          </div>
        </section>

      </div>
    </PageLayout>
  );
}
