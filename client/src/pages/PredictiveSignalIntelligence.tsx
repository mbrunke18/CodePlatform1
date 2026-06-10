import { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Activity, AlertTriangle, ArrowRight, CheckCircle2, Clock,
  Eye, Shield, Target, TrendingUp, Zap, Radio, Layers,
  ChevronRight, BarChart3, Bell, Lock
} from 'lucide-react';

const NAVY = '#0A0F2E';
const GOLD = '#C9A84C';
const TEAL = '#2B8A6E';
const RED = '#DC2626';

interface SignalCluster {
  id: string;
  name: string;
  signals: string[];
  signalCount: number;
  historicalTrigger: string;
  triggerNumber: number;
  correlationRate: number;
  historicalInstances: number;
  matchedInstances: number;
  projectedWindow: string;
  probability: number;
  recommendedProtocol: string;
  protocolNumber: number;
  urgency: 'forming' | 'elevated' | 'critical';
  detectedAt: string;
  domain: string;
}

interface PatternLibraryEntry {
  clusterId: string;
  clusterName: string;
  totalObservations: number;
  avgLeadTime: string;
  mostCommonTrigger: string;
  protocolSuccessRate: number;
  lastObserved: string;
}

const CLUSTERS: SignalCluster[] = [
  {
    id: 'C001',
    name: 'Regulatory Pressure + Media Velocity',
    signals: [
      'Regulatory filing volume elevated (+340%)',
      'Earned media mentions accelerating',
      'Industry peer citations increasing',
      'Congressional hearing scheduled'
    ],
    signalCount: 4,
    historicalTrigger: 'Regulatory Investigation',
    triggerNumber: 14,
    correlationRate: 87,
    historicalInstances: 9,
    matchedInstances: 7,
    projectedWindow: '48–72 hours',
    probability: 87,
    recommendedProtocol: 'Regulatory Response Protocol',
    protocolNumber: 14,
    urgency: 'critical',
    detectedAt: '6 minutes ago',
    domain: 'RISK & RESILIENCE'
  },
  {
    id: 'C002',
    name: 'Market Displacement Signal Cluster',
    signals: [
      'Competitor pricing movement detected',
      'Key account engagement cooling',
      'Win/loss ratio shifting',
      'Analyst coverage downgrade signals'
    ],
    signalCount: 4,
    historicalTrigger: 'Competitive Displacement Event',
    triggerNumber: 31,
    correlationRate: 73,
    historicalInstances: 11,
    matchedInstances: 8,
    projectedWindow: '5–7 days',
    probability: 73,
    recommendedProtocol: 'Competitor Displacement Sprint',
    protocolNumber: 31,
    urgency: 'elevated',
    detectedAt: '2 hours ago',
    domain: 'GROWTH & POSITIONING'
  },
  {
    id: 'C003',
    name: 'Operational Stress + Talent Signal',
    signals: [
      'Executive departure signals',
      'Workforce sentiment shift',
      'Operational KPI deterioration'
    ],
    signalCount: 3,
    historicalTrigger: 'Workforce Transformation Trigger',
    triggerNumber: 112,
    correlationRate: 61,
    historicalInstances: 7,
    matchedInstances: 4,
    projectedWindow: '10–14 days',
    probability: 61,
    recommendedProtocol: 'Workforce Transformation Protocol',
    protocolNumber: 112,
    urgency: 'forming',
    detectedAt: '4 hours ago',
    domain: 'TRANSFORMATION'
  }
];

const PATTERN_LIBRARY: PatternLibraryEntry[] = [
  {
    clusterId: 'P001',
    clusterName: 'Activist + Regulatory Compound',
    totalObservations: 23,
    avgLeadTime: '38 hours before trigger',
    mostCommonTrigger: 'Activist Investor Engagement',
    protocolSuccessRate: 91,
    lastObserved: '14 days ago'
  },
  {
    clusterId: 'P002',
    clusterName: 'Supply Chain Stress Cluster',
    totalObservations: 18,
    avgLeadTime: '72 hours before trigger',
    mostCommonTrigger: 'Supply Chain Disruption',
    protocolSuccessRate: 84,
    lastObserved: '31 days ago'
  },
  {
    clusterId: 'P003',
    clusterName: 'M&A Interest Signal Pattern',
    totalObservations: 12,
    avgLeadTime: '6 days before trigger',
    mostCommonTrigger: 'Acquisition Approach',
    protocolSuccessRate: 88,
    lastObserved: '47 days ago'
  },
  {
    clusterId: 'P004',
    clusterName: 'Cybersecurity Precursor Pattern',
    totalObservations: 31,
    avgLeadTime: '18 hours before trigger',
    mostCommonTrigger: 'Security Incident',
    protocolSuccessRate: 79,
    lastObserved: '8 days ago'
  },
  {
    clusterId: 'P005',
    clusterName: 'Market Entry Window Cluster',
    totalObservations: 9,
    avgLeadTime: '4 days before trigger',
    mostCommonTrigger: 'Market Displacement Event',
    protocolSuccessRate: 93,
    lastObserved: '22 days ago'
  }
];

function UrgencyBadge({ urgency }: { urgency: SignalCluster['urgency'] }) {
  const config = {
    critical: { label: 'CRITICAL — ACT NOW', color: RED, bg: '#FEF2F2' },
    elevated: { label: 'ELEVATED — MONITOR', color: GOLD, bg: '#FFFBEB' },
    forming: { label: 'FORMING — WATCH', color: TEAL, bg: '#F0FDF4' }
  }[urgency];
  return (
    <span
      className="text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-sm"
      style={{ color: config.color, background: config.bg, border: `1px solid ${config.color}30` }}
    >
      {config.label}
    </span>
  );
}

function ClusterCard({ cluster, onPreStage }: { cluster: SignalCluster; onPreStage: (c: SignalCluster) => void }) {
  const [expanded, setExpanded] = useState(false);
  const probColor = cluster.probability >= 80 ? RED : cluster.probability >= 65 ? GOLD : TEAL;

  return (
    <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <UrgencyBadge urgency={cluster.urgency} />
              <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">{cluster.domain}</span>
            </div>
            <h3 className="text-base font-bold" style={{ color: NAVY }}>{cluster.name}</h3>
            <p className="text-xs text-gray-500 mt-0.5">Detected {cluster.detectedAt} · {cluster.signalCount} signals matching pattern</p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-3xl font-bold" style={{ color: probColor }}>{cluster.probability}%</div>
            <div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Correlation</div>
          </div>
        </div>

        <div className="mb-4">
          <Progress value={cluster.probability} className="h-1.5 rounded-none" />
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4 text-center">
          <div className="bg-gray-50 rounded-sm p-2.5">
            <div className="text-sm font-bold" style={{ color: NAVY }}>{cluster.matchedInstances}/{cluster.historicalInstances}</div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mt-0.5">Historical Match</div>
          </div>
          <div className="bg-gray-50 rounded-sm p-2.5">
            <div className="text-sm font-bold" style={{ color: NAVY }}>{cluster.projectedWindow}</div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mt-0.5">Projected Window</div>
          </div>
          <div className="bg-gray-50 rounded-sm p-2.5">
            <div className="text-sm font-bold" style={{ color: TEAL }}>#{cluster.protocolNumber}</div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mt-0.5">Recommended</div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-xs font-bold tracking-wide"
            style={{ color: NAVY }}
          >
            <ChevronRight className={`h-3.5 w-3.5 transition-transform ${expanded ? 'rotate-90' : ''}`} />
            {expanded ? 'Hide' : 'View'} signal breakdown
          </button>
          <Button
            size="sm"
            onClick={() => onPreStage(cluster)}
            className="text-xs font-bold tracking-wide rounded-sm"
            style={{ background: NAVY, color: '#fff' }}
          >
            Pre-Stage Protocol #{cluster.protocolNumber}
            <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
          </Button>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-2">Active Signals in Cluster</div>
            <div className="space-y-1.5">
              {cluster.signals.map((sig, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-gray-700">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: TEAL }} />
                  {sig}
                </div>
              ))}
            </div>
            <div className="mt-3 p-3 rounded-sm" style={{ background: GOLD + '10', border: `1px solid ${GOLD}30` }}>
              <div className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: GOLD }}>Pattern Assessment</div>
              <div className="text-xs text-gray-700">
                This signal cluster has preceded <strong style={{ color: NAVY }}>Trigger #{cluster.triggerNumber} — {cluster.historicalTrigger}</strong> in{' '}
                {cluster.matchedInstances} of {cluster.historicalInstances} historical observations.
                Pre-staging {cluster.recommendedProtocol} now eliminates mobilization delay if the trigger confirms.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PreStageModal({ cluster, onClose }: { cluster: SignalCluster; onClose: () => void }) {
  const [staged, setStaged] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(10,15,46,0.7)' }}>
      <div className="bg-white rounded-sm shadow-2xl max-w-lg w-full p-8">
        {!staged ? (
          <>
            <div className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: TEAL }}>Pre-Stage Authorization</div>
            <h2 className="text-xl font-bold mb-2" style={{ color: NAVY }}>Stage Protocol #{cluster.protocolNumber}</h2>
            <p className="text-sm text-gray-600 mb-6">
              Pre-staging arms all tasks, stakeholder assignments, and authorization chains for <strong>{cluster.recommendedProtocol}</strong>. 
              No execution occurs until you authorize. If the trigger does not fire, the staging is released automatically.
            </p>
            <div className="space-y-3 mb-6">
              {[
                `All tasks pre-assigned by role`,
                `Stakeholder notification queue ready`,
                `Authorization chain mapped`,
                `Executive sign-off required before execution`,
                `Auto-releases if trigger does not confirm within ${cluster.projectedWindow}`
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm text-gray-700">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0" style={{ color: TEAL }} />
                  {item}
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <Button onClick={onClose} variant="outline" className="flex-1 rounded-sm text-xs font-bold tracking-wide">
                Cancel
              </Button>
              <Button
                onClick={() => setStaged(true)}
                className="flex-1 rounded-sm text-xs font-bold tracking-wide"
                style={{ background: NAVY, color: '#fff' }}
              >
                Pre-Stage Protocol — Authorize
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: TEAL + '15' }}>
              <CheckCircle2 className="h-8 w-8" style={{ color: TEAL }} />
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: NAVY }}>Protocol #{cluster.protocolNumber} Pre-Staged</h2>
            <p className="text-sm text-gray-600 mb-2">
              The response is ready. If Trigger #{cluster.triggerNumber} confirms, full execution deploys in under 12 minutes.
            </p>
            <p className="text-xs text-gray-400 mb-6">No action occurs without your executive authorization.</p>
            <Button onClick={onClose} className="rounded-sm text-xs font-bold tracking-wide" style={{ background: NAVY, color: '#fff' }}>
              Return to Intelligence Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PredictiveSignalIntelligence() {
  const [selectedCluster, setSelectedCluster] = useState<SignalCluster | null>(null);

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Preview Banner */}
        <div className="mb-8 px-4 py-3 rounded-sm flex items-center gap-3" style={{ background: TEAL + '12', border: `1px solid ${TEAL}30` }}>
          <Radio className="h-4 w-4 flex-shrink-0" style={{ color: TEAL }} />
          <span className="text-xs font-bold tracking-wide text-gray-700">
            REPRESENTATIVE PREVIEW — Pattern correlations populate from your activation history. Accuracy compounds with each closed activation.
          </span>
        </div>

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: GOLD }}>— Predictive Signal Intelligence</span>
          </div>
          <h1 className="text-4xl font-bold mb-3" style={{ color: NAVY }}>
            The trigger doesn't create the response.
          </h1>
          <h2 className="text-4xl font-bold mb-4" style={{ color: TEAL, fontStyle: 'italic', fontFamily: 'Cormorant Garamond, serif' }}>
            It releases it.
          </h2>
          <p className="text-base text-gray-600 max-w-2xl leading-relaxed">
            Signal clusters are monitored continuously. When incoming patterns match historical trigger signatures, 
            the system identifies the forming condition and recommends pre-staging the appropriate Readiness Protocol — 
            before the trigger fires.
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Clusters Forming', value: '3', sub: 'Active pattern matches', icon: Activity, color: RED },
            { label: 'Pattern Library', value: '221', sub: 'Historical trigger signatures', icon: Layers, color: NAVY },
            { label: 'Avg Lead Time', value: '51 hrs', sub: 'Before trigger confirmation', icon: Clock, color: TEAL },
            { label: 'Pre-Stage Rate', value: '89%', sub: 'Of pre-staged protocols execute ≤12 min', icon: Zap, color: GOLD }
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

        {/* Active Forming Clusters */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: GOLD }}>Live Pattern Detection</div>
              <h2 className="text-xl font-bold" style={{ color: NAVY }}>Active Signal Clusters</h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold tracking-wide" style={{ color: TEAL }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: TEAL }} />
              Monitoring active
            </div>
          </div>
          <div className="space-y-4">
            {CLUSTERS.map(cluster => (
              <ClusterCard key={cluster.id} cluster={cluster} onPreStage={setSelectedCluster} />
            ))}
          </div>
        </div>

        {/* How Pattern Recognition Works */}
        <div className="mb-10 p-8 rounded-sm" style={{ background: NAVY }}>
          <div className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: GOLD }}>How Pattern Recognition Works</div>
          <h2 className="text-2xl font-bold mb-6 text-white">Signal → Cluster → Pattern → Pre-Stage</h2>
          <div className="grid grid-cols-4 gap-6">
            {[
              {
                num: '01',
                label: 'Signal Ingestion',
                desc: '221 triggers monitored continuously across geopolitical, regulatory, financial, and operational domains.'
              },
              {
                num: '02',
                label: 'Cluster Recognition',
                desc: 'When multiple signals appear together in a sequence, the system recognizes the forming cluster and matches it against historical patterns.'
              },
              {
                num: '03',
                label: 'Correlation Scoring',
                desc: 'Each cluster receives a correlation score: how frequently this exact pattern has preceded a known trigger in historical activations.'
              },
              {
                num: '04',
                label: 'Pre-Stage Recommendation',
                desc: 'When correlation exceeds threshold, the system recommends pre-staging the matching Readiness Protocol — ready before the trigger fires.'
              }
            ].map(step => (
              <div key={step.num}>
                <div className="text-3xl font-bold mb-3" style={{ color: GOLD }}>{step.num}</div>
                <div className="text-sm font-bold text-white mb-2">{step.label}</div>
                <div className="text-xs text-gray-400 leading-relaxed">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Historical Pattern Library */}
        <div>
          <div className="mb-5">
            <div className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: GOLD }}>Historical Pattern Library</div>
            <h2 className="text-xl font-bold" style={{ color: NAVY }}>Documented Signal Cluster Signatures</h2>
            <p className="text-sm text-gray-500 mt-1">Every closed activation adds to the pattern library. Accuracy compounds with organizational history.</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
            <div className="grid grid-cols-5 gap-4 px-5 py-3 border-b border-gray-100 bg-gray-50">
              {['Pattern Name', 'Observations', 'Avg Lead Time', 'Primary Trigger', 'Protocol Success'].map(h => (
                <div key={h} className="text-[10px] font-bold tracking-widest uppercase text-gray-400">{h}</div>
              ))}
            </div>
            {PATTERN_LIBRARY.map((entry, i) => (
              <div
                key={entry.clusterId}
                className="grid grid-cols-5 gap-4 px-5 py-4 border-b border-gray-50 hover:bg-gray-50 transition-colors"
              >
                <div className="text-sm font-bold" style={{ color: NAVY }}>{entry.clusterName}</div>
                <div className="text-sm text-gray-700">{entry.totalObservations} events</div>
                <div className="text-sm text-gray-700">{entry.avgLeadTime}</div>
                <div className="text-sm text-gray-700">{entry.mostCommonTrigger}</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-100 rounded-none h-1.5">
                    <div
                      className="h-1.5 rounded-none"
                      style={{ width: `${entry.protocolSuccessRate}%`, background: entry.protocolSuccessRate >= 85 ? TEAL : GOLD }}
                    />
                  </div>
                  <span className="text-sm font-bold" style={{ color: NAVY }}>{entry.protocolSuccessRate}%</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
            <Lock className="h-3.5 w-3.5" />
            Pattern library expands with each activation close-out. Your history cannot be replicated by any competitor.
          </div>
        </div>

      </div>

      {selectedCluster && (
        <PreStageModal cluster={selectedCluster} onClose={() => setSelectedCluster(null)} />
      )}
    </PageLayout>
  );
}
