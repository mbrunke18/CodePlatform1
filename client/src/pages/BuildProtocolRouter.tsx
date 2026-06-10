import { useLocation } from 'wouter';
import PageLayout from '@/components/layout/PageLayout';
import { Grid3X3, Layers, GitBranch, ChevronRight, ArrowLeft, Target, Users, Shield } from 'lucide-react';

const NAVY = '#0A0F2E';
const GOLD = '#C9A84C';
const TEAL = '#2B8A6E';
const IVORY = '#F0EDE4';

const OPTIONS = [
  {
    id: 'matrix',
    icon: Grid3X3,
    label: 'Situation Matrix Builder',
    badge: 'RECOMMENDED',
    badgeColor: TEAL,
    href: '/situation-matrix-builder',
    tagline: 'Build a call sheet — every role, every situation variant, every responsibility pre-staged.',
    description: 'Start here. Choose a trigger scenario from the library — Regulatory Investigation, Activist Investor, Cybersecurity, and more. The system pre-populates the right executive roles and situation variants. You define (or accept) what each role does in each variant. The result is a complete, executable call sheet ready before the trigger fires.',
    bestFor: 'Single-trigger scenarios · First protocol · Founding Partner onboarding',
    steps: ['Select trigger scenario', 'Confirm roles', 'Define situation variants', 'Build the role × situation matrix', 'Set authorization chain', 'Publish call sheet'],
    time: '5–30 minutes depending on depth',
    icon2: [Target, Users, Shield],
  },
  {
    id: 'builder',
    icon: Layers,
    label: 'Protocol Builder',
    badge: 'STANDARD',
    badgeColor: NAVY,
    href: '/protocol-builder',
    tagline: 'Build a full Readiness Protocol — tasks, communications, signals, governance, and budget.',
    description: 'A 7-step wizard that stages a complete protocol end to end. Covers execution phases, pre-drafted communications, signal coverage, budget pre-authorization, and governance thresholds. Best for organizations that have already defined their role structure and want to build protocol depth across all dimensions.',
    bestFor: 'Organizations past initial onboarding · Full protocol depth · Named domain owners already configured',
    steps: ['Name and classify the protocol', 'Define execution phases and tasks', 'Pre-draft stakeholder communications', 'Set signal coverage and readiness triggers', 'Budget and authorization thresholds', 'Governance and escalation', 'Signal readiness score'],
    time: '20–45 minutes',
    icon2: [],
  },
  {
    id: 'compound',
    icon: GitBranch,
    label: 'Compound Protocol Builder',
    badge: 'ADVANCED',
    badgeColor: GOLD,
    href: '/compound-protocol-builder',
    tagline: 'Build a simultaneous multi-protocol response for triggers that arrive compounded.',
    description: 'For scenarios where two or more triggers activate at the same time — Activist Investor + Regulatory Investigation, Cybersecurity Incident + Media Crisis. Builds two parallel call tracks with coordinated authorization and a shared command center. Requires at least two single-domain protocols already published.',
    bestFor: 'Compound threat scenarios · Organizations with existing single-domain protocols · War Room coordination',
    steps: ['Select two trigger domains', 'Load existing protocol call sheets', 'Define compound interaction points', 'Set unified authorization chain', 'Publish compound war room'],
    time: '15–25 minutes (protocols must exist first)',
    icon2: [],
  },
];

export default function BuildProtocolRouter() {
  const [, nav] = useLocation();

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto px-8 py-12">

        {/* Back */}
        <button
          onClick={() => nav('/getting-started')}
          className="flex items-center gap-2 text-xs font-bold tracking-wide mb-8 transition-colors hover:opacity-70"
          style={{ color: NAVY }}
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Getting Started
        </button>

        {/* Header */}
        <div className="mb-10">
          <div className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: GOLD }}>— Build a Protocol</div>
          <h1 className="text-4xl font-bold mb-3" style={{ color: NAVY, fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>
            Which builder do you need?
          </h1>
          <p className="text-sm text-gray-500 max-w-xl">
            Each path produces a different kind of protocol. Start with the Situation Matrix Builder if you're onboarding — it's the fastest path to a complete, staged call sheet.
          </p>
        </div>

        {/* Options */}
        <div className="space-y-4">
          {OPTIONS.map((opt) => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.id}
                onClick={() => nav(opt.href)}
                className="w-full text-left border rounded-sm p-7 transition-all hover:shadow-md group"
                style={{
                  borderColor: opt.id === 'matrix' ? TEAL + '40' : '#E5E7EB',
                  background: opt.id === 'matrix' ? TEAL + '04' : '#fff',
                }}
              >
                <div className="flex items-start gap-5">
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-sm flex items-center justify-center flex-shrink-0"
                    style={{ background: opt.id === 'matrix' ? NAVY : '#F3F4F6' }}
                  >
                    <Icon className="h-5 w-5" style={{ color: opt.id === 'matrix' ? GOLD : '#9CA3AF' }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-base font-bold" style={{ color: NAVY }}>{opt.label}</span>
                      <span
                        className="text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-sm"
                        style={{ background: opt.badgeColor + '15', color: opt.badgeColor }}
                      >
                        {opt.badge}
                      </span>
                    </div>
                    <p className="text-sm font-semibold mb-2" style={{ color: NAVY + 'CC' }}>{opt.tagline}</p>
                    <p className="text-xs text-gray-500 leading-relaxed mb-4 max-w-2xl">{opt.description}</p>

                    <div className="flex items-start gap-8">
                      <div>
                        <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1.5">Best For</div>
                        <div className="text-xs text-gray-600">{opt.bestFor}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1.5">Estimated Time</div>
                        <div className="text-xs text-gray-600">{opt.time}</div>
                      </div>
                      <div className="flex-1">
                        <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1.5">Steps</div>
                        <div className="flex flex-wrap gap-1.5">
                          {opt.steps.map((s, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded-sm" style={{ background: '#F3F4F6', color: '#6B7280' }}>
                              {i + 1}. {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Arrow */}
                  <ChevronRight
                    className="h-5 w-5 flex-shrink-0 mt-1 transition-transform group-hover:translate-x-0.5"
                    style={{ color: opt.id === 'matrix' ? TEAL : '#D1D5DB' }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="mt-8 p-4 rounded-sm" style={{ background: IVORY, border: `1px solid ${GOLD}20` }}>
          <p className="text-xs text-gray-500">
            <strong style={{ color: NAVY }}>Not sure?</strong> Start with the Situation Matrix Builder. It produces a complete, role-by-role call sheet for the trigger your organization is most likely to face. You can always add Protocol Builder depth and Compound scenarios later as your preparation deepens.
          </p>
        </div>

      </div>
    </PageLayout>
  );
}
