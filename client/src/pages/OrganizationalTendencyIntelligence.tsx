import { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertTriangle, ArrowRight, BarChart3, CheckCircle2,
  Clock, TrendingDown, TrendingUp, Users, Zap,
  Target, Shield, Activity, ChevronRight, Lightbulb, Brain
} from 'lucide-react';

const NAVY = '#0A0F2E';
const GOLD = '#C9A84C';
const TEAL = '#2B8A6E';
const RED = '#DC2626';

interface Bottleneck {
  taskName: string;
  domain: string;
  avgDelayMinutes: number;
  occurrenceRate: number;
  activationsAffected: number;
  rootCause: string;
  recommendation: string;
  severity: 'high' | 'medium' | 'low';
}

interface StakeholderPattern {
  role: string;
  avgResponseMinutes: number;
  benchmarkMinutes: number;
  variance: number;
  activationsObserved: number;
  trend: 'improving' | 'stable' | 'degrading';
}

interface DayPattern {
  day: string;
  avgMinutes: number;
  activationCount: number;
  index: number;
}

interface TendencyInsight {
  id: string;
  type: 'optimization' | 'risk' | 'opportunity';
  title: string;
  finding: string;
  evidence: string;
  recommendation: string;
  estimatedSaving: string;
}

const BOTTLENECKS: Bottleneck[] = [
  {
    taskName: 'Legal Review & Approval',
    domain: 'RISK & RESILIENCE',
    avgDelayMinutes: 47,
    occurrenceRate: 73,
    activationsAffected: 11,
    rootCause: 'Sequential approval dependency — Legal review cannot begin until Executive Brief is finalized.',
    recommendation: 'Pre-authorize standard Legal Review for Protocols #14, #22, #67. Parallel track eliminates 47-minute average delay.',
    severity: 'high'
  },
  {
    taskName: 'Board Notification Confirmation',
    domain: 'RISK & RESILIENCE',
    avgDelayMinutes: 28,
    occurrenceRate: 61,
    activationsAffected: 9,
    rootCause: 'Board Chair availability constraint. Notifications sent sequentially rather than simultaneously.',
    recommendation: 'Configure simultaneous board notification with 4-hour acknowledgment window. Auto-escalate at threshold.',
    severity: 'high'
  },
  {
    taskName: 'Communications Draft Clearance',
    domain: 'GROWTH & POSITIONING',
    avgDelayMinutes: 19,
    occurrenceRate: 44,
    activationsAffected: 7,
    rootCause: 'Brand review required before external communications. No pre-approved template library for common scenarios.',
    recommendation: 'Pre-stage communications templates for top 20 trigger scenarios. Clearance becomes template selection.',
    severity: 'medium'
  },
  {
    taskName: 'Finance Authorization',
    domain: 'TRANSFORMATION',
    avgDelayMinutes: 14,
    occurrenceRate: 38,
    activationsAffected: 6,
    rootCause: 'Budget authority threshold requiring CFO signature not pre-delegated for protocol activations.',
    recommendation: 'Pre-delegate budget authority up to $500K for activated protocols. Reduces Finance Authorization to acknowledgment.',
    severity: 'medium'
  }
];

const STAKEHOLDER_PATTERNS: StakeholderPattern[] = [
  { role: 'Chief Legal Officer', avgResponseMinutes: 23, benchmarkMinutes: 12, variance: +92, activationsObserved: 14, trend: 'stable' },
  { role: 'Chief Financial Officer', avgResponseMinutes: 8, benchmarkMinutes: 12, variance: -33, activationsObserved: 14, trend: 'improving' },
  { role: 'VP Communications', avgResponseMinutes: 11, benchmarkMinutes: 12, variance: -8, activationsObserved: 11, trend: 'improving' },
  { role: 'CISO', avgResponseMinutes: 6, benchmarkMinutes: 12, variance: -50, activationsObserved: 9, trend: 'stable' },
  { role: 'Chief People Officer', avgResponseMinutes: 31, benchmarkMinutes: 12, variance: +158, activationsObserved: 7, trend: 'degrading' }
];

const DAY_PATTERNS: DayPattern[] = [
  { day: 'Mon', avgMinutes: 13, activationCount: 4, index: 108 },
  { day: 'Tue', avgMinutes: 11, activationCount: 5, index: 92 },
  { day: 'Wed', avgMinutes: 10, activationCount: 6, index: 83 },
  { day: 'Thu', avgMinutes: 12, activationCount: 4, index: 100 },
  { day: 'Fri', avgMinutes: 23, activationCount: 3, index: 192 },
  { day: 'Sat', avgMinutes: 31, activationCount: 1, index: 258 },
  { day: 'Sun', avgMinutes: 28, activationCount: 1, index: 233 }
];

const INSIGHTS: TendencyInsight[] = [
  {
    id: 'I001',
    type: 'risk',
    title: 'Friday Execution Vulnerability',
    finding: 'Protocol execution takes 2.3× longer when activated on Fridays.',
    evidence: 'Legal Review and Board Notification tasks show consistent delay pattern on Fridays across 3 of 4 Friday activations. Reduced Legal team availability confirmed.',
    recommendation: 'Add Friday-specific task adjustment to Protocols #14, #22, #67: pre-authorization of Legal Review, alternate board contact sequence.',
    estimatedSaving: '47 min average per Friday activation'
  },
  {
    id: 'I002',
    type: 'optimization',
    title: 'Co-location Advantage Documented',
    finding: 'Your fastest activation occurred when CFO and Legal were physically co-located.',
    evidence: 'Protocol #31 activation (September) completed in 9 minutes vs. 14-minute average. Only differentiating variable was CFO/Legal co-location during quarterly off-site.',
    recommendation: 'Flag high-probability signal clusters when key stakeholders are geographically dispersed. Consider co-location protocol for compound activations.',
    estimatedSaving: '5 min average on compound activations'
  },
  {
    id: 'I003',
    type: 'opportunity',
    title: 'Pre-Authorization Gap — 4 Protocols',
    finding: 'Legal Review remains a sequential bottleneck across 73% of activations.',
    evidence: 'In 11 of 15 activations where Legal Review was required, it was the critical path task — not because of review complexity, but because of authorization sequencing.',
    recommendation: 'Pre-authorize standard Legal Review checkpoints for top 5 protocols. Convert from active bottleneck to passive confirmation step.',
    estimatedSaving: '47 min per activation on 73% of activations'
  },
  {
    id: 'I004',
    type: 'risk',
    title: 'Chief People Officer Response Degrading',
    finding: 'CPO response time has increased 158% above benchmark over the last 4 activations.',
    evidence: 'Trend line shows consistent degradation over 7 activations. Current average: 31 minutes. Platform benchmark: 12 minutes.',
    recommendation: 'Review CPO task assignment and notification method. Consider alternate stakeholder path or delegate pre-authorization.',
    estimatedSaving: '19 min recovery if addressed'
  }
];

function SeverityBadge({ severity }: { severity: Bottleneck['severity'] }) {
  const config = {
    high: { label: 'HIGH IMPACT', color: RED },
    medium: { label: 'MEDIUM', color: GOLD },
    low: { label: 'LOW', color: TEAL }
  }[severity];
  return (
    <span className="text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-sm" style={{ color: config.color, background: config.color + '15' }}>
      {config.label}
    </span>
  );
}

function InsightTypeBadge({ type }: { type: TendencyInsight['type'] }) {
  const config = {
    risk: { label: 'EXECUTION RISK', color: RED, Icon: AlertTriangle },
    optimization: { label: 'OPTIMIZATION', color: TEAL, Icon: TrendingUp },
    opportunity: { label: 'OPPORTUNITY', color: GOLD, Icon: Lightbulb }
  }[type];
  return (
    <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-sm" style={{ color: config.color, background: config.color + '15' }}>
      <config.Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}

export default function OrganizationalTendencyIntelligence() {
  const [activeInsight, setActiveInsight] = useState<string | null>(null);
  const maxDay = Math.max(...DAY_PATTERNS.map(d => d.avgMinutes));

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Preview Banner */}
        <div className="mb-8 px-4 py-3 rounded-sm flex items-center gap-3" style={{ background: TEAL + '12', border: `1px solid ${TEAL}30` }}>
          <Brain className="h-4 w-4 flex-shrink-0" style={{ color: TEAL }} />
          <span className="text-xs font-bold tracking-wide text-gray-700">
            REPRESENTATIVE PREVIEW — Organizational patterns populate from your activation history. Data shown reflects 15 representative activations across 12 months.
          </span>
        </div>

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: GOLD }}>— Organizational Tendency Intelligence</span>
          </div>
          <h1 className="text-4xl font-bold mb-3" style={{ color: NAVY }}>Your organization,</h1>
          <h2 className="text-4xl font-bold mb-4" style={{ color: TEAL, fontStyle: 'italic', fontFamily: 'Cormorant Garamond, serif' }}>
            measured against itself.
          </h2>
          <p className="text-base text-gray-600 max-w-2xl leading-relaxed">
            Every activation is a data point. Across your activation history, patterns emerge: where execution slows, 
            which stakeholders are critical path, when your organization is most and least responsive. 
            These patterns cannot be purchased. They can only be earned through documented execution.
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Activations Analyzed', value: '15', sub: 'Across 12 months', icon: Activity, color: NAVY },
            { label: 'Critical Path Savings', value: '127 min', sub: 'If top 3 bottlenecks resolved', icon: Zap, color: GOLD },
            { label: 'Execution Patterns', value: '4', sub: 'Identified this quarter', icon: Target, color: RED },
            { label: 'Stakeholders Profiled', value: '12', sub: 'Response times documented', icon: Users, color: TEAL }
          ].map(({ label, value, sub, icon: Icon, color }) => (
            <div key={label} className="bg-white border border-gray-100 rounded-sm p-5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-bold tracking-widest uppercase text-gray-400">{label}</span>
                <Icon className="h-4 w-4" style={{ color }} />
              </div>
              <div className="text-3xl font-bold" style={{ color: NAVY }}>{value}</div>
              <div className="text-xs text-gray-500 mt-1">{sub}</div>
            </div>
          ))}
        </div>

        {/* Insights */}
        <div className="mb-10">
          <div className="mb-5">
            <div className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: GOLD }}>Pattern-Detected Findings</div>
            <h2 className="text-xl font-bold" style={{ color: NAVY }}>Organizational Execution Insights</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {INSIGHTS.map(insight => (
              <div
                key={insight.id}
                className="bg-white border border-gray-100 rounded-sm shadow-sm p-5 cursor-pointer hover:border-gray-200 transition-colors"
                onClick={() => setActiveInsight(activeInsight === insight.id ? null : insight.id)}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <InsightTypeBadge type={insight.type} />
                  <ChevronRight
                    className={`h-4 w-4 text-gray-400 transition-transform flex-shrink-0 ${activeInsight === insight.id ? 'rotate-90' : ''}`}
                  />
                </div>
                <h3 className="text-sm font-bold mb-1" style={{ color: NAVY }}>{insight.title}</h3>
                <p className="text-xs text-gray-600">{insight.finding}</p>

                {activeInsight === insight.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                    <div>
                      <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">Evidence</div>
                      <p className="text-xs text-gray-700">{insight.evidence}</p>
                    </div>
                    <div className="p-3 rounded-sm" style={{ background: NAVY + '08', border: `1px solid ${NAVY}15` }}>
                      <div className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: NAVY }}>Recommended Action</div>
                      <p className="text-xs text-gray-700 mb-2">{insight.recommendation}</p>
                      <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: TEAL }}>
                        <Zap className="h-3.5 w-3.5" />
                        Estimated saving: {insight.estimatedSaving}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottleneck Analysis */}
        <div className="mb-10">
          <div className="mb-5">
            <div className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: GOLD }}>Critical Path Analysis</div>
            <h2 className="text-xl font-bold" style={{ color: NAVY }}>Execution Bottleneck Registry</h2>
            <p className="text-sm text-gray-500 mt-1">Tasks that consistently appear on the critical path across activations.</p>
          </div>
          <div className="space-y-3">
            {BOTTLENECKS.map((b, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-sm shadow-sm p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <SeverityBadge severity={b.severity} />
                      <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">{b.domain}</span>
                    </div>
                    <h3 className="text-sm font-bold mb-1" style={{ color: NAVY }}>{b.taskName}</h3>
                    <p className="text-xs text-gray-600 mb-3">{b.rootCause}</p>
                    <div className="p-3 rounded-sm" style={{ background: GOLD + '10', border: `1px solid ${GOLD}25` }}>
                      <div className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: GOLD }}>Recommendation</div>
                      <p className="text-xs text-gray-700">{b.recommendation}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-3xl font-bold" style={{ color: b.severity === 'high' ? RED : GOLD }}>
                      +{b.avgDelayMinutes}m
                    </div>
                    <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Avg delay</div>
                    <div className="text-xs text-gray-500 mt-2">{b.occurrenceRate}% of activations</div>
                    <div className="text-xs text-gray-500">{b.activationsAffected} events affected</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Day-of-Week Pattern */}
        <div className="mb-10">
          <div className="mb-5">
            <div className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: GOLD }}>Temporal Pattern Analysis</div>
            <h2 className="text-xl font-bold" style={{ color: NAVY }}>Execution Speed by Day</h2>
            <p className="text-sm text-gray-500 mt-1">Average time to full coordination by day of trigger detection.</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-sm shadow-sm p-6">
            <div className="flex items-end gap-3 h-40">
              {DAY_PATTERNS.map(day => {
                const height = (day.avgMinutes / maxDay) * 100;
                const isHigh = day.avgMinutes > 18;
                return (
                  <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                    <div className="text-xs font-bold" style={{ color: isHigh ? RED : TEAL }}>{day.avgMinutes}m</div>
                    <div className="w-full rounded-sm" style={{
                      height: `${height}%`,
                      background: isHigh ? RED + '80' : TEAL + '80',
                      minHeight: 4
                    }} />
                    <div className="text-xs font-bold tracking-wide text-gray-500">{day.day}</div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-6">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-3 h-3 rounded-sm" style={{ background: TEAL + '80' }} />
                Within benchmark (≤18 min)
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-3 h-3 rounded-sm" style={{ background: RED + '80' }} />
                Above benchmark — Friday/Weekend adjustment recommended
              </div>
            </div>
          </div>
        </div>

        {/* Stakeholder Response Profiles */}
        <div>
          <div className="mb-5">
            <div className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: GOLD }}>Stakeholder Intelligence</div>
            <h2 className="text-xl font-bold" style={{ color: NAVY }}>Response Time Profiles</h2>
            <p className="text-sm text-gray-500 mt-1">Individual stakeholder response velocity vs. platform benchmark of 12 minutes.</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
            <div className="grid grid-cols-5 gap-4 px-5 py-3 border-b border-gray-100 bg-gray-50">
              {['Role', 'Avg Response', 'Benchmark', 'Variance', 'Trend'].map(h => (
                <div key={h} className="text-[10px] font-bold tracking-widest uppercase text-gray-400">{h}</div>
              ))}
            </div>
            {STAKEHOLDER_PATTERNS.map((s, i) => {
              const isAbove = s.variance > 0;
              const TrendIcon = s.trend === 'improving' ? TrendingDown : s.trend === 'degrading' ? TrendingUp : Activity;
              const trendColor = s.trend === 'improving' ? TEAL : s.trend === 'degrading' ? RED : GOLD;
              return (
                <div key={i} className="grid grid-cols-5 gap-4 px-5 py-4 border-b border-gray-50 items-center">
                  <div className="text-sm font-bold" style={{ color: NAVY }}>{s.role}</div>
                  <div className="text-sm font-bold" style={{ color: isAbove ? RED : TEAL }}>{s.avgResponseMinutes} min</div>
                  <div className="text-sm text-gray-500">12 min</div>
                  <div className="text-sm font-bold" style={{ color: isAbove ? RED : TEAL }}>
                    {isAbove ? '+' : ''}{s.variance}%
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold capitalize" style={{ color: trendColor }}>
                    <TrendIcon className="h-3.5 w-3.5" />
                    {s.trend}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-gray-400">
            Response profiles update with each activation close-out. Stakeholder data visible to platform admin only.
          </p>
        </div>

      </div>
    </PageLayout>
  );
}
