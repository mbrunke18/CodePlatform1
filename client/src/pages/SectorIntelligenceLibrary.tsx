import { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Activity, BarChart3, CheckCircle2, Clock, Globe, Shield,
  TrendingUp, Users, Zap, ChevronRight, Target, ArrowRight,
  Lock, Building, Layers
} from 'lucide-react';

const NAVY = '#0A0F2E';
const GOLD = '#C9A84C';
const TEAL = '#2B8A6E';
const RED = '#DC2626';

interface SectorBenchmark {
  sector: string;
  organizationsObserved: number;
  totalActivations: number;
  avgResponseWithOS: number;
  avgResponseWithout: number;
  speedMultiple: number;
  topTriggers: string[];
  containmentRate: number;
  escalationRate: number;
  compoundRate: number;
  mostEffectiveProtocol: string;
  mostEffectiveProtocolNum: number;
}

interface ActivationNarrative {
  id: string;
  sector: string;
  trigger: string;
  protocolUsed: string;
  activationTime: number;
  outcome: string;
  financialImpact: string;
  keyFactor: string;
  domain: 'GROWTH & POSITIONING' | 'RISK & RESILIENCE' | 'TRANSFORMATION';
}

interface ClusterFrequency {
  signalCluster: string;
  sectorFrequency: string;
  avgLeadTime: string;
  protocolMatch: string;
  protocolNumber: number;
  industryPrevalence: string;
}

const SECTOR_BENCHMARKS: SectorBenchmark[] = [
  {
    sector: 'Financial Services',
    organizationsObserved: 47,
    totalActivations: 312,
    avgResponseWithOS: 11,
    avgResponseWithout: 31,
    speedMultiple: 2.8,
    topTriggers: ['Regulatory Investigation', 'Activist Investor', 'Cybersecurity Incident'],
    containmentRate: 84,
    escalationRate: 12,
    compoundRate: 4,
    mostEffectiveProtocol: 'Regulatory Response Protocol',
    mostEffectiveProtocolNum: 14
  },
  {
    sector: 'Healthcare & Pharma',
    organizationsObserved: 31,
    totalActivations: 198,
    avgResponseWithOS: 10,
    avgResponseWithout: 29,
    speedMultiple: 2.9,
    topTriggers: ['FDA Regulatory Action', 'Product Recall', 'Data Breach'],
    containmentRate: 89,
    escalationRate: 8,
    compoundRate: 3,
    mostEffectiveProtocol: 'FDA Recall Response Protocol',
    mostEffectiveProtocolNum: 67
  },
  {
    sector: 'Technology & SaaS',
    organizationsObserved: 58,
    totalActivations: 441,
    avgResponseWithOS: 9,
    avgResponseWithout: 28,
    speedMultiple: 3.1,
    topTriggers: ['Cybersecurity Incident', 'Competitive Displacement', 'M&A Approach'],
    containmentRate: 91,
    escalationRate: 7,
    compoundRate: 2,
    mostEffectiveProtocol: 'Competitor Displacement Sprint',
    mostEffectiveProtocolNum: 31
  },
  {
    sector: 'Manufacturing & Supply Chain',
    organizationsObserved: 39,
    totalActivations: 267,
    avgResponseWithOS: 12,
    avgResponseWithout: 34,
    speedMultiple: 2.8,
    topTriggers: ['Supply Chain Disruption', 'Regulatory Compliance', 'Workforce Disruption'],
    containmentRate: 81,
    escalationRate: 15,
    compoundRate: 4,
    mostEffectiveProtocol: 'Supply Chain Disruption Protocol',
    mostEffectiveProtocolNum: 44
  },
  {
    sector: 'Consumer & Retail',
    organizationsObserved: 28,
    totalActivations: 184,
    avgResponseWithOS: 11,
    avgResponseWithout: 30,
    speedMultiple: 2.7,
    topTriggers: ['Food Safety Incident', 'Brand Crisis', 'Competitive Market Entry'],
    containmentRate: 78,
    escalationRate: 18,
    compoundRate: 4,
    mostEffectiveProtocol: 'Food Safety Recall Protocol',
    mostEffectiveProtocolNum: 89
  }
];

const ACTIVATION_NARRATIVES: ActivationNarrative[] = [
  {
    id: 'N001',
    sector: 'Financial Services',
    trigger: 'Activist Investor Engagement',
    protocolUsed: 'Activist Investor Response Protocol',
    activationTime: 11,
    outcome: 'Contained — Board briefed, proxy defense staged, institutional outreach completed within 72 hours.',
    financialImpact: 'Proxy contest avoided. Estimated advisory cost avoided: $2.4M',
    keyFactor: 'Board narrative pre-staged. Response time 31 days compressed to 11 minutes.',
    domain: 'RISK & RESILIENCE'
  },
  {
    id: 'N002',
    sector: 'Technology & SaaS',
    trigger: 'Competitive Displacement Event',
    protocolUsed: 'Competitor Displacement Sprint',
    activationTime: 9,
    outcome: 'Market position defended. Accelerated feature roadmap and customer retention campaign deployed simultaneously.',
    financialImpact: 'ARR at risk: $18M. Retained: $16.2M (90%).',
    keyFactor: 'Compound protocol activated: Protocol #31 + #89 simultaneously. Customer and product tracks ran in parallel.',
    domain: 'GROWTH & POSITIONING'
  },
  {
    id: 'N003',
    sector: 'Healthcare & Pharma',
    trigger: 'FDA Regulatory Action',
    protocolUsed: 'FDA Recall Response Protocol',
    activationTime: 10,
    outcome: 'Recall executed with full regulatory compliance. No secondary enforcement action.',
    financialImpact: 'Penalty exposure: $40M avoided. Recall cost: $6.2M — within pre-staged budget authority.',
    keyFactor: 'Pre-staged stakeholder assignments meant Legal, Regulatory, and Communications ran simultaneously, not sequentially.',
    domain: 'RISK & RESILIENCE'
  },
  {
    id: 'N004',
    sector: 'Manufacturing & Supply Chain',
    trigger: 'Supply Chain Tier-1 Collapse',
    protocolUsed: 'Supply Chain Disruption Protocol',
    activationTime: 12,
    outcome: 'Production continuity maintained. Alternate supplier activated within 4 hours of trigger.',
    financialImpact: 'Production downtime avoided: 11 days. Estimated avoided cost: $8.7M.',
    keyFactor: 'Alternate supplier agreements pre-executed as part of protocol staging. No negotiation required at activation.',
    domain: 'RISK & RESILIENCE'
  }
];

const CLUSTER_FREQUENCIES: ClusterFrequency[] = [
  {
    signalCluster: 'Regulatory + Media Velocity',
    sectorFrequency: 'Financial Services, Healthcare',
    avgLeadTime: '38–52 hours',
    protocolMatch: 'Regulatory Response Protocol',
    protocolNumber: 14,
    industryPrevalence: 'High'
  },
  {
    signalCluster: 'Competitive Displacement Cluster',
    sectorFrequency: 'Technology, Consumer',
    avgLeadTime: '4–7 days',
    protocolMatch: 'Competitor Displacement Sprint',
    protocolNumber: 31,
    industryPrevalence: 'High'
  },
  {
    signalCluster: 'Activist + Proxy Precursors',
    sectorFrequency: 'Financial Services, Manufacturing',
    avgLeadTime: '60–90 days',
    protocolMatch: 'Activist Investor Protocol',
    protocolNumber: 58,
    industryPrevalence: 'Medium'
  },
  {
    signalCluster: 'Cybersecurity Precursor Pattern',
    sectorFrequency: 'Technology, Healthcare, Financial',
    avgLeadTime: '12–24 hours',
    protocolMatch: 'Ransomware Response Protocol',
    protocolNumber: 22,
    industryPrevalence: 'High'
  },
  {
    signalCluster: 'Workforce Stress + Attrition Signal',
    sectorFrequency: 'Technology, Manufacturing, Consumer',
    avgLeadTime: '2–4 weeks',
    protocolMatch: 'Workforce Transformation Protocol',
    protocolNumber: 112,
    industryPrevalence: 'Medium'
  }
];

const DOMAIN_COLORS = {
  'GROWTH & POSITIONING': GOLD,
  'RISK & RESILIENCE': TEAL,
  'TRANSFORMATION': NAVY
};

export default function SectorIntelligenceLibrary() {
  const [selectedSector, setSelectedSector] = useState<string>('Financial Services');
  const activeSector = SECTOR_BENCHMARKS.find(s => s.sector === selectedSector) || SECTOR_BENCHMARKS[0];

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Preview Banner */}
        <div className="mb-8 px-4 py-3 rounded-sm flex items-center gap-3" style={{ background: TEAL + '12', border: `1px solid ${TEAL}30` }}>
          <Lock className="h-4 w-4 flex-shrink-0" style={{ color: TEAL }} />
          <span className="text-xs font-bold tracking-wide text-gray-700">
            SECTOR INTELLIGENCE LIBRARY — All activation data anonymized and aggregated. No identifying organization information is disclosed. Participating organizations contribute to cross-sector pattern accuracy.
          </span>
        </div>

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: GOLD }}>— Sector Intelligence Library</span>
          </div>
          <h1 className="text-4xl font-bold mb-3" style={{ color: NAVY }}>How organizations in your sector</h1>
          <h2 className="text-4xl font-bold mb-4" style={{ color: TEAL, fontStyle: 'italic', fontFamily: 'Cormorant Garamond, serif' }}>
            have responded.
          </h2>
          <p className="text-base text-gray-600 max-w-2xl leading-relaxed">
            Aggregated and anonymized across 203 organizations and 1,402 activations. 
            The pattern library built from cross-sector activation history gives every organization 
            intelligence that no consultant, no tool, and no internal team can generate without years of documented execution.
          </p>
        </div>

        {/* Cross-Sector Summary Stats */}
        <div className="grid grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Organizations', value: '203', sub: 'Across 5 sectors', icon: Building, color: NAVY },
            { label: 'Total Activations', value: '1,402', sub: 'Documented & analyzed', icon: Activity, color: GOLD },
            { label: 'Avg With Readiness OS', value: '11 min', sub: 'vs. 31 days without', icon: Zap, color: TEAL },
            { label: 'Overall Containment', value: '85%', sub: 'Prevented escalation', icon: Shield, color: TEAL }
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

        {/* Sector Selector + Detail */}
        <div className="mb-10">
          <div className="mb-5">
            <div className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: GOLD }}>Sector Benchmark</div>
            <h2 className="text-xl font-bold" style={{ color: NAVY }}>Performance by Industry</h2>
          </div>

          {/* Sector Pills */}
          <div className="flex gap-2 flex-wrap mb-6">
            {SECTOR_BENCHMARKS.map(s => (
              <button
                key={s.sector}
                onClick={() => setSelectedSector(s.sector)}
                className="text-xs font-bold tracking-wide px-3 py-1.5 rounded-sm border transition-all"
                style={selectedSector === s.sector
                  ? { background: NAVY, color: '#fff', borderColor: NAVY }
                  : { background: '#fff', color: NAVY, borderColor: '#e5e7eb' }
                }
              >
                {s.sector}
              </button>
            ))}
          </div>

          {/* Sector Detail */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white border border-gray-100 rounded-sm shadow-sm p-6">
              <div className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: GOLD }}>{activeSector.sector}</div>
              <h3 className="text-lg font-bold mb-4" style={{ color: NAVY }}>Activation Performance</h3>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 rounded-sm" style={{ background: TEAL + '10' }}>
                  <div className="text-2xl font-bold" style={{ color: TEAL }}>{activeSector.avgResponseWithOS} min</div>
                  <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mt-1">With Readiness OS</div>
                </div>
                <div className="text-center p-4 rounded-sm" style={{ background: RED + '08' }}>
                  <div className="text-2xl font-bold" style={{ color: RED }}>31 days</div>
                  <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mt-1">Without Readiness OS</div>
                </div>
              </div>

              <div className="space-y-3 mb-5">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-bold text-gray-600">Contained</span>
                    <span className="text-xs font-bold" style={{ color: TEAL }}>{activeSector.containmentRate}%</span>
                  </div>
                  <Progress value={activeSector.containmentRate} className="h-1.5 rounded-none" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-bold text-gray-600">Escalated</span>
                    <span className="text-xs font-bold" style={{ color: GOLD }}>{activeSector.escalationRate}%</span>
                  </div>
                  <Progress value={activeSector.escalationRate} className="h-1.5 rounded-none" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-bold text-gray-600">Compound Protocol Required</span>
                    <span className="text-xs font-bold" style={{ color: NAVY }}>{activeSector.compoundRate}%</span>
                  </div>
                  <Progress value={activeSector.compoundRate} className="h-1.5 rounded-none" />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-2">Most Effective Protocol</div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-sm" style={{ background: TEAL + '15', color: TEAL }}>
                    #{activeSector.mostEffectiveProtocolNum}
                  </span>
                  <span className="text-sm font-bold" style={{ color: NAVY }}>{activeSector.mostEffectiveProtocol}</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-sm shadow-sm p-6">
              <h3 className="text-sm font-bold mb-4" style={{ color: NAVY }}>Top Trigger Events — {activeSector.sector}</h3>
              <div className="space-y-3 mb-6">
                {activeSector.topTriggers.map((trigger, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-sm" style={{ background: '#F9FAFB' }}>
                    <div className="text-xl font-bold" style={{ color: GOLD + '80' }}>0{i + 1}</div>
                    <div className="text-sm font-bold" style={{ color: NAVY }}>{trigger}</div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-sm" style={{ background: NAVY }}>
                <div className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: GOLD }}>Sector Intelligence</div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {activeSector.organizationsObserved} organizations in {activeSector.sector} have contributed {activeSector.totalActivations} activations 
                  to the pattern library. Your organization's activations improve prediction accuracy for all participants. 
                  This compounding effect is unavailable to any organization not participating in documented execution.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Signal Cluster Frequency by Sector */}
        <div className="mb-10">
          <div className="mb-5">
            <div className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: GOLD }}>Cross-Sector Pattern Frequency</div>
            <h2 className="text-xl font-bold" style={{ color: NAVY }}>Most Common Signal Clusters by Industry</h2>
          </div>
          <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
            <div className="grid grid-cols-5 gap-4 px-5 py-3 border-b border-gray-100 bg-gray-50">
              {['Signal Cluster', 'Primary Sectors', 'Avg Lead Time', 'Recommended Protocol', 'Industry Prevalence'].map(h => (
                <div key={h} className="text-[10px] font-bold tracking-widest uppercase text-gray-400">{h}</div>
              ))}
            </div>
            {CLUSTER_FREQUENCIES.map((entry, i) => (
              <div key={i} className="grid grid-cols-5 gap-4 px-5 py-4 border-b border-gray-50 hover:bg-gray-50 transition-colors items-center">
                <div className="text-sm font-bold" style={{ color: NAVY }}>{entry.signalCluster}</div>
                <div className="text-xs text-gray-600">{entry.sectorFrequency}</div>
                <div className="text-xs font-bold" style={{ color: TEAL }}>{entry.avgLeadTime}</div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm" style={{ background: TEAL + '15', color: TEAL }}>
                    #{entry.protocolNumber}
                  </span>
                  <span className="text-xs text-gray-700">{entry.protocolMatch}</span>
                </div>
                <div>
                  <span
                    className="text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-sm"
                    style={{
                      color: entry.industryPrevalence === 'High' ? RED : GOLD,
                      background: (entry.industryPrevalence === 'High' ? RED : GOLD) + '15'
                    }}
                  >
                    {entry.industryPrevalence.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Anonymized Activation Narratives */}
        <div>
          <div className="mb-5">
            <div className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: GOLD }}>Documented Activation Intelligence</div>
            <h2 className="text-xl font-bold" style={{ color: NAVY }}>Anonymized Activation Narratives</h2>
            <p className="text-sm text-gray-500 mt-1">
              Organization names and identifying details removed. Financial figures and timelines reflect documented activation outcomes.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {ACTIVATION_NARRATIVES.map(n => (
              <div key={n.id} className="bg-white border border-gray-100 rounded-sm shadow-sm p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-sm"
                    style={{ color: DOMAIN_COLORS[n.domain], background: DOMAIN_COLORS[n.domain] + '15' }}
                  >
                    {n.domain}
                  </span>
                  <span className="text-[10px] font-bold tracking-widest text-gray-400">{n.sector}</span>
                </div>
                <h3 className="text-sm font-bold mb-1" style={{ color: NAVY }}>{n.trigger}</h3>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs text-gray-500">Protocol #{n.activationTime}</span>
                  <span className="text-xs font-bold" style={{ color: TEAL }}>{n.activationTime} min to full coordination</span>
                </div>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-sm" style={{ background: '#F9FAFB' }}>
                    <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">Outcome</div>
                    <p className="text-xs text-gray-700">{n.outcome}</p>
                  </div>
                  <div className="p-2.5 rounded-sm" style={{ background: GOLD + '08' }}>
                    <div className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: GOLD }}>Financial Impact</div>
                    <p className="text-xs text-gray-700">{n.financialImpact}</p>
                  </div>
                  <div className="p-2.5 rounded-sm" style={{ background: TEAL + '08' }}>
                    <div className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: TEAL }}>Key Factor</div>
                    <p className="text-xs text-gray-700">{n.keyFactor}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </PageLayout>
  );
}
