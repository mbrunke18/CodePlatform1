import { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'wouter';
import {
  Layers, Brain, Target, TrendingUp, Users, DollarSign, Globe,
  Lightbulb, Eye, BarChart3, ArrowRight, CheckCircle, AlertTriangle,
  Clock, Zap, Shield, Download, Filter, Star
} from 'lucide-react';

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const OFF = "#F8F7F4";
const BORDER = "#E8E4DC";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

const strategicInsights = [
  {
    id: 'market-positioning',
    title: 'Market Positioning Analysis',
    dimension: 'strategic',
    confidence: 94,
    impact: 'high',
    timeframe: 'Q3–Q4 2026',
    urgency: 'medium',
    description: 'Multi-dimensional analysis reveals a 14-month window for premium market positioning before competitive saturation in emerging segments.',
    insights: [
      'Premium positioning in APAC emerging markets shows 3.4× ROI potential vs domestic expansion',
      'Customer acquisition cost declining 23% in enterprise segments due to category maturation',
      'Brand perception alignment with decision-maker priorities currently at 89% — peak window open',
    ],
    recommendations: [
      'Accelerate premium product line expansion to capture the 14-month positioning window',
      'Reallocate 30% of domestic marketing spend to APAC with localized executive messaging',
      'Develop 3 strategic alliance partnerships to entrench market position before Q1 2027',
    ],
    icon: Target,
    color: TEAL,
    aiNarrative: 'Cross-referencing 18 months of competitive signal data with customer sentiment, Prism detects a favorable window that historically closes within 6–14 months of initial opening. Your current brand perception score of 89% represents the highest alignment this organization has achieved in 4 years.',
  },
  {
    id: 'operational-efficiency',
    title: 'Operational Efficiency Matrix',
    dimension: 'operational',
    confidence: 87,
    impact: 'high',
    timeframe: 'Q1–Q2 2026',
    urgency: 'high',
    description: 'Cross-functional analysis identifies $6.8M in inefficiencies concentrated in 4 workflow clusters — addressable within 90 days.',
    insights: [
      'Process automation potential exists in 67% of current high-touch workflows — $4.2M impact',
      'Resource allocation misalignment between stated priorities and actual spend: $2.3M annually',
      'Team productivity variance of 34% across departments signals structural coordination gaps',
    ],
    recommendations: [
      'Implement systematic process automation in 3 highest-impact workflow clusters in Q1',
      'Restructure resource allocation to match board-stated strategic priorities — requires CFO alignment',
      'Deploy standardized coordination protocols across 4 underperforming departments within 60 days',
    ],
    icon: BarChart3,
    color: NAVY,
    aiNarrative: 'Prism identifies this as an execution drag pattern — a compounding inefficiency where coordination friction multiplies opportunity cost. Left unaddressed, this represents a $6.8M annual drag that will grow at ~12% annually as organizational complexity increases.',
  },
  {
    id: 'financial-modeling',
    title: 'Financial Performance Modeling',
    dimension: 'financial',
    confidence: 91,
    impact: 'critical',
    timeframe: 'Ongoing · Next review Q2 2026',
    urgency: 'high',
    description: 'Multi-variable financial modeling reveals 28% YoY growth potential dependent on 3 strategic allocation decisions in the next 45 days.',
    insights: [
      'Revenue growth trajectory supports 28% YoY increase — contingent on two resource reallocation decisions',
      'Cost optimization opportunities: $4.7M identified across G&A, vendor contracts, and tech stack redundancy',
      'Investment portfolio running 15% above market benchmark — rebalancing window open through Q1 close',
    ],
    recommendations: [
      'Diversify revenue streams across 2 adjacent segments to reduce concentration risk below 40%',
      'Initiate vendor contract renegotiation cycle — $1.9M in near-term savings achievable within 30 days',
      'Expand top-performing investment allocations before Q1 close; rebalancing window closes April 15',
    ],
    icon: DollarSign,
    color: GOLD,
    aiNarrative: 'Prism\'s financial modeling engine cross-references your internal performance data with 847 peer companies. Your cost structure is running 11% above your competitive set in 3 categories that typically compress during growth phases — this is an early indicator of structural inefficiency forming.',
  },
  {
    id: 'talent-dynamics',
    title: 'Talent & Organizational Dynamics',
    dimension: 'human',
    confidence: 83,
    impact: 'medium',
    timeframe: 'Q2–Q3 2026',
    urgency: 'medium',
    description: 'Engagement-performance correlation analysis reveals 3 talent risk clusters with a combined attrition probability of 34% in the next 6 months.',
    insights: [
      'Employee engagement-performance correlation sitting at 0.78 — above industry benchmark of 0.61',
      'Critical skills gaps identified in 3 domains: AI implementation, regulatory compliance, and global market operations',
      'Leadership effectiveness scores increased 12% this quarter — strategic communication driving the gain',
    ],
    recommendations: [
      'Launch targeted upskilling programs in the 3 critical gap domains within 45 days',
      'Implement proactive retention protocols for the top 12% of performers flagged as at-risk',
      'Expand the leadership development program — effectiveness gains directly correlate to team execution speed',
    ],
    icon: Users,
    color: GOLD,
    aiNarrative: 'Talent analytics surfaces a paradox: overall engagement is strong, but 3 specific talent clusters show elevated departure signals. The departure of these groups would reduce organizational execution capacity by an estimated 22% — disproportionate to their headcount percentage.',
  },
  {
    id: 'risk-landscape',
    title: 'Enterprise Risk Landscape',
    dimension: 'risk',
    confidence: 89,
    impact: 'critical',
    timeframe: 'Rolling 90-day horizon',
    urgency: 'critical',
    description: 'Compound risk scoring across geopolitical, regulatory, and operational domains reveals 4 risk clusters requiring active management.',
    insights: [
      'Geopolitical exposure in 2 supply corridors elevated to HIGH — estimated 68% probability of disruption within 60 days',
      'Regulatory examination cycle approaching across 3 jurisdictions — concurrent compliance demands will strain capacity',
      'Operational concentration in single-region data infrastructure creates 14% continuity exposure',
    ],
    recommendations: [
      'Pre-stage Supply Chain Disruption Response playbook for immediate activation if corridor signals confirm',
      'Launch parallel regulatory sprint across all 3 jurisdictions — delay creates compounding penalty risk',
      'Initiate infrastructure diversification plan — 6-month implementation timeline, delay increases exposure',
    ],
    icon: Shield,
    color: '#dc2626',
    aiNarrative: 'Compound risk analysis shows these 4 clusters are not independent — they share upstream cause variables. If geopolitical disruption materializes, it will simultaneously stress operational continuity and regulatory compliance capacity. The concurrent demand on executive attention is the primary risk Prism is flagging.',
  },
];

const crossDimensionalSummary = [
  { title: 'Strategic Convergence', color: GOLD, desc: 'Market positioning and financial modeling show 87% strategic alignment — coordinated execution will multiply impact rather than dilute it.' },
  { title: 'Operational Unlock', color: TEAL, desc: 'The $6.8M operational efficiency improvement would fund 73% of the market expansion investment with neutral net cash flow impact.' },
  { title: 'Risk-Adjusted Priority', color: '#dc2626', desc: 'Talent attrition risk and enterprise risk clusters share a 0.62 correlation — degrading talent capacity reduces crisis response effectiveness.' },
  { title: 'Execution Timeline', color: NAVY, desc: '3 decisions in the next 45 days determine whether the Q3 growth trajectory is achievable. Delay converts opportunity into cost.' },
];

const dimensionFilters = [
  { id: 'all', label: 'All Dimensions' },
  { id: 'strategic', label: 'Strategic' },
  { id: 'operational', label: 'Operational' },
  { id: 'financial', label: 'Financial' },
  { id: 'human', label: 'Human Capital' },
  { id: 'risk', label: 'Risk' },
];

const impactColor = (impact: string) => {
  if (impact === 'critical') return '#dc2626';
  if (impact === 'high') return GOLD;
  return TEAL;
};

const urgencyColor = (u: string) => {
  if (u === 'critical') return '#dc2626';
  if (u === 'high') return GOLD;
  return TEAL;
};

export default function PrismInsights() {
  const [selectedDimension, setSelectedDimension] = useState('all');

  const filteredInsights = strategicInsights.filter(i =>
    selectedDimension === 'all' || i.dimension === selectedDimension
  );

  return (
    <PageLayout>
      <div className="bg-[#F8F7F4] min-h-screen">

        {/* ─── Dark Hero ─── */}
        <div style={{ background: NAVY, padding: '36px 0 32px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(201,168,76,0.08) 1px, transparent 0)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 28, height: 1.5, background: GOLD }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD }}>Strategic Intelligence · Multi-Dimensional Analysis</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}>
                <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: '#F0EDE4', marginBottom: 8, lineHeight: 1.1 }}>
                  Prism <em style={{ color: GOLD }}>Insights</em>
                </div>
                <div style={{ fontSize: 13, color: 'rgba(240,237,228,0.55)', maxWidth: 560, lineHeight: 1.6, marginBottom: 20 }}>
                  Multi-dimensional strategic analysis engine. Prism synthesizes signals across 5 domains — strategic, operational, financial, human capital, and risk — to surface decisions that matter before they become urgent.
                </div>
                {/* Stats row */}
                <div style={{ display: 'flex', gap: 32 }}>
                  {[
                    { value: `${filteredInsights.length}`, label: 'Active Insights', color: GOLD },
                    { value: '87%', label: 'Cross-Dimensional Alignment', color: TEAL },
                    { value: '45 days', label: 'Decision Window', color: '#F0EDE4' },
                  ].map((s, i) => (
                    <div key={i}>
                      <div style={{ ...CG, fontSize: 24, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(240,237,228,0.45)', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: 3 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(43,138,110,0.12)', color: '#3BAF8A', fontSize: 10, fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', padding: '4px 12px', border: '1px solid rgba(43,138,110,0.3)' }}>
                  <span style={{ width: 6, height: 6, background: '#3BAF8A', borderRadius: 0, display: 'inline-block' }} />
                  Signal Analysis · Updated 2 min ago
                </div>
                <Button style={{ background: GOLD, color: NAVY, borderRadius: 0, fontWeight: 700, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  <Download style={{ width: 14, height: 14, marginRight: 8 }} />
                  Export Full Report
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Content ─── */}
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 32px' }}>

          {/* Cross-Dimensional Summary Banner */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 40 }}>
            {crossDimensionalSummary.map((s, i) => (
              <div key={i} style={{ background: '#fff', border: `1px solid ${BORDER}`, borderTop: `3px solid ${s.color}`, padding: '16px 18px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: s.color, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>

          {/* Dimension Filter */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 28, flexWrap: 'wrap' }}>
            {dimensionFilters.map(f => (
              <button key={f.id} onClick={() => setSelectedDimension(f.id)}
                style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                  padding: '7px 16px', border: 'none', cursor: 'pointer',
                  background: selectedDimension === f.id ? NAVY : '#fff',
                  color: selectedDimension === f.id ? '#fff' : '#6B7280',
                  outline: selectedDimension === f.id ? 'none' : `1px solid ${BORDER}`,
                  transition: 'all 0.15s',
                }}>
                {f.label}
              </button>
            ))}
          </div>

          {/* Insights */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {filteredInsights.map(insight => {
              const Icon = insight.icon;
              return (
                <div key={insight.id} style={{ background: '#fff', border: `1px solid ${BORDER}`, borderLeft: `4px solid ${insight.color}` }}>
                  {/* Header */}
                  <div style={{ padding: '20px 24px 16px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                    <div style={{ width: 40, height: 40, background: `${insight.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon style={{ width: 20, height: 20, color: insight.color }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                        <div style={{ ...CG, fontSize: 20, fontWeight: 700, color: NAVY }}>{insight.title}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 10, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700 }}>{insight.dimension} · {insight.timeframe}</span>
                        <span style={{ fontSize: 10, fontWeight: 700, color: impactColor(insight.impact), background: `${impactColor(insight.impact)}12`, padding: '2px 8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{insight.impact} impact</span>
                        <span style={{ fontSize: 10, fontWeight: 700, color: urgencyColor(insight.urgency), background: `${urgencyColor(insight.urgency)}12`, padding: '2px 8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{insight.urgency} urgency</span>
                        <span style={{ fontSize: 10, color: '#9CA3AF' }}>AI confidence: <strong style={{ color: NAVY }}>{insight.confidence}%</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div style={{ padding: '20px 24px' }}>
                    <p style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.7, marginBottom: 20, borderLeft: `3px solid ${insight.color}`, paddingLeft: 14 }}>{insight.description}</p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 20 }}>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Lightbulb style={{ width: 12, height: 12, color: GOLD }} /> Key Findings
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {insight.insights.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                              <div style={{ width: 5, height: 5, borderRadius: 0, background: insight.color, flexShrink: 0, marginTop: 6 }} />
                              <span style={{ fontSize: 12, color: '#4B5563', lineHeight: 1.5 }}>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Target style={{ width: 12, height: 12, color: TEAL }} /> Recommended Actions
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {insight.recommendations.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                              <CheckCircle style={{ width: 13, height: 13, color: TEAL, flexShrink: 0, marginTop: 2 }} />
                              <span style={{ fontSize: 12, color: '#4B5563', lineHeight: 1.5 }}>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* AI Narrative */}
                    <div style={{ background: `${NAVY}04`, border: `1px solid ${BORDER}`, borderLeft: `3px solid ${GOLD}`, padding: '12px 16px', marginBottom: 16 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: GOLD, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Brain style={{ width: 11, height: 11 }} /> Prism AI Narrative
                      </div>
                      <p style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.6 }}>{insight.aiNarrative}</p>
                    </div>

                    {/* Confidence bar + CTA */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontWeight: 700, color: '#9CA3AF', marginBottom: 4 }}>
                          <span>AI Confidence</span><span>{insight.confidence}%</span>
                        </div>
                        <Progress value={insight.confidence} className="h-1.5" />
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Button size="sm" style={{ background: 'transparent', color: NAVY, border: `1px solid ${BORDER}`, borderRadius: 0, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                          Deep Dive
                        </Button>
                        <Link href="/playbook-library">
                          <Button size="sm" style={{ background: NAVY, color: '#fff', borderRadius: 0, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                            Activate Response <ArrowRight style={{ width: 12, height: 12, marginLeft: 6 }} />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div style={{ background: NAVY, padding: '32px 36px', marginTop: 40, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(201,168,76,0.09) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD, marginBottom: 8 }}>Prism Insight Engine</div>
                <div style={{ ...CG, fontSize: 22, fontWeight: 700, color: '#F0EDE4', marginBottom: 6 }}>Every dimension, connected.</div>
                <div style={{ fontSize: 13, color: 'rgba(240,237,228,0.55)', maxWidth: 520, lineHeight: 1.6 }}>
                  Prism doesn't analyze dimensions in isolation. The cross-dimensional narrative is where the real strategic intelligence lives — where operational costs fund strategic expansion, and where talent risks undermine execution capability.
                </div>
              </div>
              <Link href="/command-center">
                <Button style={{ background: GOLD, color: NAVY, borderRadius: 0, fontWeight: 700, fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '12px 24px' }}>
                  Go to Command Center <ArrowRight style={{ width: 16, height: 16, marginLeft: 8 }} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
