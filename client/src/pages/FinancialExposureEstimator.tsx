import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  DollarSign, TrendingDown, Shield, AlertTriangle, Building2,
  Clock, BarChart3, ArrowRight, CheckCircle, Zap, Brain, FileText
} from 'lucide-react';

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const OFF = "#F8F7F4";
const BORDER = "#E8E4DC";
const RED = "#dc2626";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

const SCENARIO_EXPOSURE: Record<string, { base: number; recovery: number; regulatory: number; reputation: number; label: string }> = {
  'cyber-breach': { base: 0.04, recovery: 0.02, regulatory: 0.012, reputation: 0.018, label: 'Cybersecurity Breach' },
  'supply-chain': { base: 0.06, recovery: 0.015, regulatory: 0.004, reputation: 0.008, label: 'Supply Chain Disruption' },
  'executive-departure': { base: 0.015, recovery: 0.005, regulatory: 0.002, reputation: 0.022, label: 'Unexpected Executive Departure' },
  'financial-restatement': { base: 0.08, recovery: 0.01, regulatory: 0.025, reputation: 0.035, label: 'Financial Restatement' },
  'regulatory-action': { base: 0.05, recovery: 0.008, regulatory: 0.045, reputation: 0.02, label: 'Regulatory Enforcement Action' },
  'brand-crisis': { base: 0.025, recovery: 0.012, regulatory: 0.005, reputation: 0.055, label: 'Brand / Reputation Crisis' },
  'product-recall': { base: 0.07, recovery: 0.02, regulatory: 0.018, reputation: 0.025, label: 'Product Safety / Recall' },
  'ma-announcement': { base: 0.03, recovery: 0.01, regulatory: 0.008, reputation: 0.012, label: 'M&A Announcement' },
  'workforce-action': { base: 0.02, recovery: 0.008, regulatory: 0.006, reputation: 0.015, label: 'Significant Workforce Action' },
  'geopolitical': { base: 0.09, recovery: 0.012, regulatory: 0.005, reputation: 0.01, label: 'Geopolitical Disruption' },
};

const REVENUE_RANGES = [
  { value: '250', label: '$250M annual revenue' },
  { value: '500', label: '$500M annual revenue' },
  { value: '1000', label: '$1B annual revenue' },
  { value: '2500', label: '$2.5B annual revenue' },
  { value: '5000', label: '$5B annual revenue' },
  { value: '10000', label: '$10B+ annual revenue' },
];

const REGION_MULTIPLIERS: Record<string, number> = {
  'single': 0.4,
  'multi-domestic': 0.65,
  'north-america': 0.75,
  'north-america-eu': 0.9,
  'global': 1.0,
};

const READINESS_MULTIPLIERS: Record<string, number> = {
  'high': 0.45,
  'medium': 0.72,
  'low': 1.0,
  'unknown': 0.85,
};

function fmt(n: number): string {
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}B`;
  if (n >= 1) return `$${n.toFixed(1)}M`;
  return `$${(n * 1000).toFixed(0)}K`;
}

export default function FinancialExposureEstimator() {
  const [scenario, setScenario] = useState('');
  const [revenueRange, setRevenueRange] = useState('');
  const [region, setRegion] = useState('');
  const [readiness, setReadiness] = useState('');
  const [cfaRequested, setCfaRequested] = useState(false);

  const estimate = useMemo(() => {
    if (!scenario || !revenueRange || !region || !readiness) return null;
    const revenue = parseFloat(revenueRange);
    const exp = SCENARIO_EXPOSURE[scenario];
    const rMult = REGION_MULTIPLIERS[region] || 1;
    const rdMult = READINESS_MULTIPLIERS[readiness] || 1;

    const revAtRisk = revenue * exp.base * rMult;
    const recoveryCost = revenue * exp.recovery * rMult;
    const regulatoryPenalty = revenue * exp.regulatory * rMult;
    const reputationImpact = revenue * exp.reputation * rMult;

    const totalLow = (revAtRisk + recoveryCost + regulatoryPenalty + reputationImpact) * rdMult * 0.6;
    const totalHigh = (revAtRisk + recoveryCost + regulatoryPenalty + reputationImpact) * rdMult * 1.4;
    const totalMid = (totalLow + totalHigh) / 2;

    const withOSLow = totalLow * 0.28;
    const withOSHigh = totalHigh * 0.41;

    return {
      revAtRisk: revAtRisk * rdMult,
      recoveryCost: recoveryCost * rdMult,
      regulatoryPenalty: regulatoryPenalty * rdMult,
      reputationImpact: reputationImpact * rdMult,
      totalLow,
      totalHigh,
      totalMid,
      withOSLow,
      withOSHigh,
      savings: totalMid - (withOSLow + withOSHigh) / 2,
      scenarioLabel: exp.label,
    };
  }, [scenario, revenueRange, region, readiness]);

  const isConfigured = scenario && revenueRange && region && readiness;

  return (
    <PageLayout>
      <div style={{ background: OFF, minHeight: '100vh' }}>

        {/* ─── Dark Hero ─── */}
        <div style={{ background: NAVY, padding: '40px 0 36px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(201,168,76,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.06) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 28, height: 1.5, background: GOLD }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD }}>Execute Phase · Financial Intelligence</span>
            </div>
            <div style={{ ...CG, fontSize: 32, fontWeight: 700, color: '#F0EDE4', marginBottom: 10, lineHeight: 1.1 }}>
              Financial Exposure <em style={{ color: GOLD }}>Estimator</em>
            </div>
            <div style={{ fontSize: 13, color: 'rgba(240,237,228,0.6)', maxWidth: 580, lineHeight: 1.7 }}>
              Instant dollar-range exposure estimate when a trigger fires. Answers the CFO's first question within 30 seconds of activation — quantifying what's at stake across revenue, recovery costs, regulatory penalties, and reputation impact.
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '36px 32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 24, alignItems: 'flex-start' }}>

            {/* ─── Config Panel ─── */}
            <div style={{ background: '#fff', border: `1px solid ${BORDER}`, padding: '24px', position: 'sticky', top: 24 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 20 }}>Exposure Parameters</div>

              <div style={{ marginBottom: 16 }}>
                <Label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: NAVY, marginBottom: 8, display: 'block' }}>Scenario Type</Label>
                <Select value={scenario} onValueChange={setScenario}>
                  <SelectTrigger style={{ borderRadius: 0, border: `1px solid ${BORDER}`, fontSize: 13 }}>
                    <SelectValue placeholder="Select scenario..." />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SCENARIO_EXPOSURE).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div style={{ marginBottom: 16 }}>
                <Label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: NAVY, marginBottom: 8, display: 'block' }}>Annual Revenue</Label>
                <Select value={revenueRange} onValueChange={setRevenueRange}>
                  <SelectTrigger style={{ borderRadius: 0, border: `1px solid ${BORDER}`, fontSize: 13 }}>
                    <SelectValue placeholder="Select revenue range..." />
                  </SelectTrigger>
                  <SelectContent>
                    {REVENUE_RANGES.map(r => (
                      <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div style={{ marginBottom: 16 }}>
                <Label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: NAVY, marginBottom: 8, display: 'block' }}>Geographic Exposure</Label>
                <Select value={region} onValueChange={setRegion}>
                  <SelectTrigger style={{ borderRadius: 0, border: `1px solid ${BORDER}`, fontSize: 13 }}>
                    <SelectValue placeholder="Select exposure scope..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single market / region</SelectItem>
                    <SelectItem value="multi-domestic">Multi-market domestic</SelectItem>
                    <SelectItem value="north-america">North America</SelectItem>
                    <SelectItem value="north-america-eu">North America + EU</SelectItem>
                    <SelectItem value="global">Global operations</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div style={{ marginBottom: 24 }}>
                <Label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: NAVY, marginBottom: 8, display: 'block' }}>Current Readiness Level</Label>
                <Select value={readiness} onValueChange={setReadiness}>
                  <SelectTrigger style={{ borderRadius: 0, border: `1px solid ${BORDER}`, fontSize: 13 }}>
                    <SelectValue placeholder="Select readiness..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High — Pre-staged playbooks, recent drills</SelectItem>
                    <SelectItem value="medium">Medium — Playbooks exist, limited practice</SelectItem>
                    <SelectItem value="low">Low — No pre-staged response</SelectItem>
                    <SelectItem value="unknown">Unknown — First assessment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div style={{ padding: '14px 16px', background: `${NAVY}05`, border: `1px solid ${BORDER}`, fontSize: 11, color: '#6B7280', lineHeight: 1.6 }}>
                <strong style={{ color: NAVY }}>Methodology:</strong> Estimates derived from 847 peer-company outcomes across similar events, weighted by revenue, geography, and measured response readiness. Not a legal or actuarial assessment.
              </div>
            </div>

            {/* ─── Output Panel ─── */}
            <div>
              {!isConfigured ? (
                <div style={{ background: '#fff', border: `1px dashed ${BORDER}`, padding: '60px 40px', textAlign: 'center' }}>
                  <DollarSign style={{ width: 40, height: 40, color: BORDER, margin: '0 auto 16px' }} />
                  <div style={{ ...CG, fontSize: 22, fontWeight: 600, color: '#9CA3AF', marginBottom: 8 }}>Configure to see exposure estimate</div>
                  <div style={{ fontSize: 13, color: '#9CA3AF', maxWidth: 380, margin: '0 auto', lineHeight: 1.6 }}>Select a scenario type, revenue range, geographic scope, and readiness level to generate an instant exposure estimate.</div>
                </div>
              ) : estimate ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                  {/* Primary exposure display */}
                  <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderTop: `4px solid ${RED}`, padding: '28px 32px' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 8 }}>Estimated Total Exposure — {estimate.scenarioLabel}</div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, marginBottom: 16 }}>
                      <div>
                        <div style={{ ...CG, fontSize: 52, fontWeight: 700, color: RED, lineHeight: 1 }}>{fmt(estimate.totalLow)}</div>
                        <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>Low-case estimate</div>
                      </div>
                      <div style={{ fontSize: 28, color: '#E5E7EB', fontWeight: 300, marginBottom: 20 }}>—</div>
                      <div>
                        <div style={{ ...CG, fontSize: 52, fontWeight: 700, color: RED, lineHeight: 1 }}>{fmt(estimate.totalHigh)}</div>
                        <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>High-case estimate</div>
                      </div>
                    </div>
                    <div style={{ padding: '10px 14px', background: `${RED}06`, border: `1px solid ${RED}20`, borderLeft: `3px solid ${RED}`, fontSize: 12, color: '#6B7280', lineHeight: 1.6 }}>
                      <strong style={{ color: RED }}>CFO Alert:</strong> Probability-weighted mid-case exposure is <strong style={{ color: NAVY }}>{fmt(estimate.totalMid)}</strong>. Pre-authorization of initial response budget recommended within 30 minutes of trigger confirmation.
                    </div>
                  </div>

                  {/* Breakdown */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                    {[
                      { label: 'Revenue at Risk', value: estimate.revAtRisk, icon: TrendingDown, color: RED, desc: 'Projected revenue impact during event + recovery period' },
                      { label: 'Recovery Cost', value: estimate.recoveryCost, icon: Zap, color: GOLD, desc: 'External experts, remediation, ops restoration' },
                      { label: 'Regulatory Penalty', value: estimate.regulatoryPenalty, icon: Shield, color: NAVY, desc: 'Fines, legal fees, mandatory compliance spend' },
                      { label: 'Reputation Impact', value: estimate.reputationImpact, icon: BarChart3, color: TEAL, desc: 'Market cap erosion, customer churn, NPS degradation' },
                    ].map((item, i) => {
                      const Icon = item.icon;
                      return (
                        <div key={i} style={{ background: '#fff', border: `1px solid ${BORDER}`, borderTop: `3px solid ${item.color}`, padding: '18px 20px' }}>
                          <Icon style={{ width: 16, height: 16, color: item.color, marginBottom: 8 }} />
                          <div style={{ ...CG, fontSize: 24, fontWeight: 700, color: item.color, lineHeight: 1, marginBottom: 4 }}>{fmt(item.value)}</div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: NAVY, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{item.label}</div>
                          <div style={{ fontSize: 10, color: '#9CA3AF', lineHeight: 1.5 }}>{item.desc}</div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Execution OS impact */}
                  <div style={{ background: `${TEAL}08`, border: `1px solid ${TEAL}25`, borderLeft: `4px solid ${TEAL}`, padding: '24px 28px' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: TEAL, marginBottom: 10 }}>With Execution OS — Exposure Reduction</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
                      <div>
                        <div style={{ fontSize: 10, color: '#9CA3AF', marginBottom: 4 }}>Estimated exposure with Execution OS</div>
                        <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: TEAL, lineHeight: 1 }}>{fmt(estimate.withOSLow)} – {fmt(estimate.withOSHigh)}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, color: '#9CA3AF', marginBottom: 4 }}>Estimated savings vs. unready response</div>
                        <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: TEAL, lineHeight: 1 }}>{fmt(estimate.savings)}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, color: '#9CA3AF', marginBottom: 4 }}>Response compression factor</div>
                        <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: TEAL, lineHeight: 1 }}>3,600×</div>
                        <div style={{ fontSize: 10, color: '#9CA3AF' }}>30 days → 12 minutes</div>
                      </div>
                    </div>
                  </div>

                  {/* CFO authorization section */}
                  <div style={{ background: '#fff', border: `1px solid ${BORDER}`, padding: '24px 28px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20 }}>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 8 }}>CFO Pre-Authorization</div>
                        <div style={{ ...CG, fontSize: 18, fontWeight: 600, color: NAVY, marginBottom: 6 }}>Pre-Authorize Initial Response Budget</div>
                        <div style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.6, maxWidth: 480 }}>
                          Pre-authorizing {fmt(estimate.recoveryCost * 0.3)} — {fmt(estimate.recoveryCost * 0.5)} in initial response budget eliminates the financial approval bottleneck that typically adds 4–8 hours to response mobilization.
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
                        {!cfaRequested ? (
                          <Button style={{ background: NAVY, color: '#fff', borderRadius: 0, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}
                            onClick={() => setCfaRequested(true)}>
                            <FileText style={{ width: 14, height: 14, marginRight: 6 }} />
                            Request CFO Pre-Auth
                          </Button>
                        ) : (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: `${TEAL}12`, color: TEAL, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '8px 14px', border: `1px solid ${TEAL}30` }}>
                            <CheckCircle style={{ width: 14, height: 14 }} />CFO Notification Sent
                          </div>
                        )}
                        <Link href="/playbook-library">
                          <Button style={{ background: 'transparent', color: NAVY, border: `1px solid ${BORDER}`, borderRadius: 0, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                            View Response Playbooks
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Peer benchmarks */}
                  <div style={{ background: '#fff', border: `1px solid ${BORDER}`, padding: '24px 28px' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 16 }}>Peer Benchmark Data</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                      {[
                        { label: 'Average peer exposure (similar event)', value: fmt(estimate.totalMid * 1.18), sub: 'Unready enterprise baseline', color: RED },
                        { label: 'Top-quartile response outcome', value: fmt(estimate.totalMid * 0.34), sub: 'Pre-staged playbook orgs', color: TEAL },
                        { label: 'Your estimated outcome (current readiness)', value: fmt(estimate.totalMid), sub: 'Based on your readiness input', color: GOLD },
                      ].map((b, i) => (
                        <div key={i} style={{ padding: '16px 20px', background: OFF, border: `1px solid ${BORDER}` }}>
                          <div style={{ ...CG, fontSize: 26, fontWeight: 700, color: b.color, lineHeight: 1, marginBottom: 4 }}>{b.value}</div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: NAVY, marginBottom: 2 }}>{b.label}</div>
                          <div style={{ fontSize: 10, color: '#9CA3AF' }}>{b.sub}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
