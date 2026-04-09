import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import {
  AlertTriangle, Users, DollarSign, Clock, Activity, Zap,
  Shield, ArrowRight, CheckCircle, BarChart3, TrendingUp,
  Brain, AlertCircle, Target, ChevronRight, Globe,
  MessageSquare, FileText, TrendingDown, RefreshCw, Lock, Unlock
} from 'lucide-react';

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const RED = "#dc2626";
const OFF = "#F8F7F4";
const BORDER = "#E8E4DC";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

interface Situation {
  id: string;
  name: string;
  type: string;
  severity: 'critical' | 'high' | 'medium';
  status: 'active' | 'monitoring' | 'escalated';
  owner: string;
  ownerRole: string;
  startedAt: string;
  elapsedMinutes: number;
  exposure: string;
  exposureValue: number;
  tasksTotal: number;
  tasksComplete: number;
  resourcesCommitted: string[];
  conflictsWith: string[];
  timeToMilestone: string;
  playbook: string;
  mobilizedAt: string;
}

const situations: Situation[] = [
  {
    id: 'sit-1',
    name: 'Ransomware Containment — APAC Infrastructure',
    type: 'Cyber Incident',
    severity: 'critical',
    status: 'active',
    owner: 'Sarah Chen',
    ownerRole: 'CISO',
    startedAt: '2h 14m ago',
    elapsedMinutes: 134,
    exposure: '$4.2M–$8.7M',
    exposureValue: 6450000,
    tasksTotal: 18,
    tasksComplete: 11,
    resourcesCommitted: ['CISO', 'CTO', 'CLO', 'CFO'],
    conflictsWith: ['sit-3'],
    timeToMilestone: '48 min to Phase 3 gate',
    playbook: 'Cyber Incident Response',
    mobilizedAt: '12 minutes after trigger',
  },
  {
    id: 'sit-2',
    name: 'Tier-1 Supplier Financial Distress — Q3 Risk',
    type: 'Supply Chain',
    severity: 'high',
    status: 'monitoring',
    owner: 'Marcus Reid',
    ownerRole: 'COO',
    startedAt: '6h 03m ago',
    elapsedMinutes: 363,
    exposure: '$1.8M–$3.2M',
    exposureValue: 2500000,
    tasksTotal: 12,
    tasksComplete: 5,
    resourcesCommitted: ['COO', 'CPO', 'CFO'],
    conflictsWith: [],
    timeToMilestone: '2h 20m to supplier decision gate',
    playbook: 'Supply Chain Disruption Response',
    mobilizedAt: '12 minutes after trigger',
  },
  {
    id: 'sit-3',
    name: 'SEC Informal Inquiry — Revenue Recognition',
    type: 'Regulatory',
    severity: 'critical',
    status: 'escalated',
    owner: 'Elena Vasquez',
    ownerRole: 'CLO',
    startedAt: '1h 42m ago',
    elapsedMinutes: 102,
    exposure: '$12M–$28M',
    exposureValue: 20000000,
    tasksTotal: 9,
    tasksComplete: 3,
    resourcesCommitted: ['CLO', 'CFO', 'CEO', 'IR'],
    conflictsWith: ['sit-1'],
    timeToMilestone: '3h 10m to regulatory response deadline',
    playbook: 'Regulatory Enforcement Response',
    mobilizedAt: '12 minutes after trigger',
  },
];

const leaderCapacity: Record<string, { name: string; role: string; situations: number; capacity: number; criticalConflict: boolean }> = {
  'CFO': { name: 'James Kovach', role: 'CFO', situations: 3, capacity: 15, criticalConflict: true },
  'CLO': { name: 'Elena Vasquez', role: 'CLO', situations: 2, capacity: 42, criticalConflict: true },
  'CEO': { name: 'David Park', role: 'CEO', situations: 2, capacity: 38, criticalConflict: false },
  'CISO': { name: 'Sarah Chen', role: 'CISO', situations: 1, capacity: 76, criticalConflict: false },
  'COO': { name: 'Marcus Reid', role: 'COO', situations: 1, capacity: 61, criticalConflict: false },
  'CTO': { name: 'Priya Nair', role: 'CTO', situations: 1, capacity: 68, criticalConflict: false },
};

const CONFLICTS = [
  { a: 'Ransomware Containment', b: 'SEC Inquiry', resource: 'CFO', description: 'CFO is listed as critical owner in both situations. At 15% available capacity — risk of delayed financial exposure authorization in both.', riskLevel: 'critical' },
  { a: 'SEC Inquiry', b: 'All situations', resource: 'CLO / Legal', description: 'Legal team bandwidth is fully committed. New regulatory demand from SEC inquiry limits CLO availability for cyber legal review.', riskLevel: 'high' },
];

const REALLOCATION_RECOMMENDATIONS = [
  { from: 'CFO', action: 'Delegate ransomware financial tracking to Deputy CFO', frees: '45% capacity', situation: 'Cyber Incident', approved: false },
  { from: 'CLO', action: 'Assign Associate General Counsel to Supply Chain legal review', frees: '28% capacity', situation: 'Supply Chain', approved: false },
];

const severityColor = (s: string) => s === 'critical' ? RED : s === 'high' ? GOLD : TEAL;
const statusColor = (s: string) => s === 'active' ? TEAL : s === 'escalated' ? RED : GOLD;
const capacityColor = (c: number) => c < 25 ? RED : c < 50 ? GOLD : TEAL;

const INDUSTRY_RATE_PER_MIN = 40;

export default function ConcurrentSituationBoard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [priorityOverride, setPriorityOverride] = useState<string | null>(null);
  const [approvedReallocations, setApprovedReallocations] = useState<Set<number>>(new Set());

  const totalExposure = situations.reduce((s, sit) => s + sit.exposureValue, 0);
  const criticalCount = situations.filter(s => s.severity === 'critical').length;
  const conflictCount = CONFLICTS.length;

  const totalMinutes = situations.reduce((s, sit) => s + sit.elapsedMinutes, 0);
  const valuePreserved = totalMinutes * INDUSTRY_RATE_PER_MIN;
  const traditionalMobilizationCost = 30 * 24 * 60 * INDUSTRY_RATE_PER_MIN;
  const headStart = (traditionalMobilizationCost - valuePreserved).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

  const handlePrioritize = (id: string, name: string) => {
    setPriorityOverride(id);
    toast({
      title: `Priority set: ${name}`,
      description: 'Stakeholders have been notified of updated priority order. Resource allocation guidance updated.',
    });
  };

  const handleApproveReallocation = (idx: number, rec: typeof REALLOCATION_RECOMMENDATIONS[0]) => {
    setApprovedReallocations(prev => new Set([...Array.from(prev), idx]));
    toast({
      title: `Reallocation approved`,
      description: `${rec.from} delegation confirmed. Stakeholders notified automatically.`,
    });
  };

  return (
    <PageLayout>
      <div style={{ background: OFF, minHeight: '100vh' }}>

        {/* ─── Dark Hero ─── */}
        <div style={{ background: NAVY, padding: '40px 0 36px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(201,168,76,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.06) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 28, height: 1.5, background: GOLD }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD }}>Execute Phase · Multi-Situation Command</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 32 }}>
              <div>
                <div style={{ ...CG, fontSize: 32, fontWeight: 700, color: '#F0EDE4', marginBottom: 10, lineHeight: 1.1 }}>
                  Concurrent Situation <em style={{ color: GOLD }}>Board</em>
                </div>
                <div style={{ fontSize: 13, color: 'rgba(240,237,228,0.6)', maxWidth: 580, lineHeight: 1.7 }}>
                  Active command view when multiple situations compete for C-suite bandwidth simultaneously. Surface resource conflicts, leadership capacity constraints, and AI-recommended reallocation before they create bottlenecks.
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(220,38,38,0.15)', color: '#f87171', fontSize: 10, fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', padding: '5px 12px', border: '1px solid rgba(220,38,38,0.3)' }}>
                  <AlertTriangle style={{ width: 12, height: 12 }} />
                  {conflictCount} Resource Conflicts Detected
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(43,138,110,0.15)', color: '#6ee7b7', fontSize: 10, fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', padding: '5px 12px', border: '1px solid rgba(43,138,110,0.3)' }}>
                  <Shield style={{ width: 12, height: 12 }} />
                  All 3 Situations Mobilized in 12 Min
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Live Financial Intelligence Strip ─── */}
        <div style={{ background: `${NAVY}F5`, borderBottom: `1px solid ${NAVY}` }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
              {[
                {
                  label: 'Total Exposure Across Situations',
                  value: `$${(totalExposure / 1000000).toFixed(1)}M`,
                  sub: 'Combined financial risk active now',
                  color: RED,
                  icon: TrendingDown,
                },
                {
                  label: 'Readiness OS Response',
                  value: '12 min',
                  sub: 'Each situation mobilized at trigger',
                  color: TEAL,
                  icon: Zap,
                },
                {
                  label: 'Traditional Enterprise Mobilization',
                  value: '30 days',
                  sub: 'Avg. time without pre-staged response',
                  color: GOLD,
                  icon: Clock,
                },
                {
                  label: 'Value Preserved (Execution Head Start)',
                  value: `$${(valuePreserved / 1000).toFixed(0)}K`,
                  sub: 'vs. 30-day mobilization at $40/min',
                  color: TEAL,
                  icon: Shield,
                },
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} style={{ padding: '16px 24px', borderRight: i < 3 ? `1px solid rgba(255,255,255,0.08)` : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <Icon style={{ width: 12, height: 12, color: s.color }} />
                      <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>{s.label}</span>
                    </div>
                    <div style={{ ...CG, fontSize: 26, fontWeight: 700, color: s.color, lineHeight: 1, marginBottom: 3 }}>{s.value}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>{s.sub}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 32px' }}>

          {/* KPI Strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
            {[
              { label: 'Active Situations', value: situations.length, color: NAVY, icon: Activity },
              { label: 'Critical Severity', value: criticalCount, color: RED, icon: AlertTriangle },
              { label: 'Executives Over-Committed', value: Object.values(leaderCapacity).filter(l => l.capacity < 25).length, color: RED, icon: Users },
              { label: 'Resource Conflicts', value: conflictCount, color: GOLD, icon: AlertCircle },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} style={{ background: '#fff', border: `1px solid ${BORDER}`, borderTop: `3px solid ${s.color}`, padding: '18px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9CA3AF' }}>{s.label}</div>
                    <Icon style={{ width: 16, height: 16, color: s.color, opacity: 0.7 }} />
                  </div>
                  <div style={{ ...CG, fontSize: 36, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
                </div>
              );
            })}
          </div>

          {/* Conflict Alert Banner */}
          {conflictCount > 0 && (
            <div style={{ background: `${RED}08`, border: `1px solid ${RED}25`, borderLeft: `4px solid ${RED}`, padding: '16px 20px', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <AlertTriangle style={{ width: 16, height: 16, color: RED, flexShrink: 0 }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: RED, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Concurrent Resource Conflicts Detected — Executive Action Required</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {CONFLICTS.map((c, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 12, color: '#6B7280' }}>
                    <div style={{ width: 5, height: 5, borderRadius: 0, background: c.riskLevel === 'critical' ? RED : GOLD, flexShrink: 0, marginTop: 6 }} />
                    <span><strong style={{ color: NAVY }}>{c.resource}:</strong> {c.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'flex-start' }}>

            {/* ─── Situation Cards ─── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 4 }}>
                {priorityOverride ? 'Active Situations — Priority #1 First, then by Financial Exposure' : 'Active Situations — Sorted by Financial Exposure'}
              </div>
              {[...situations].sort((a, b) => {
                if (priorityOverride) {
                  if (a.id === priorityOverride) return -1;
                  if (b.id === priorityOverride) return 1;
                }
                return b.exposureValue - a.exposureValue;
              }).map((sit, idx) => {
                const isPriority = priorityOverride === sit.id || (!priorityOverride && idx === 0);
                const sc = severityColor(sit.severity);
                const hasConflict = sit.conflictsWith.length > 0;
                const completionPct = Math.round((sit.tasksComplete / sit.tasksTotal) * 100);
                const valuePreservedSit = sit.elapsedMinutes * INDUSTRY_RATE_PER_MIN;
                return (
                  <div key={sit.id} style={{ background: '#fff', border: `1px solid ${isPriority ? GOLD : BORDER}`, borderLeft: `4px solid ${sc}`, boxShadow: isPriority ? `0 0 0 1px ${GOLD}30` : 'none' }}>
                    <div style={{ padding: '20px 24px', borderBottom: `1px solid ${BORDER}` }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                            {isPriority && <span style={{ fontSize: 9, fontWeight: 700, background: GOLD, color: NAVY, padding: '2px 8px', textTransform: 'uppercase', letterSpacing: '0.12em' }}>PRIORITY #1</span>}
                            <span style={{ fontSize: 10, fontWeight: 700, color: sc, background: `${sc}12`, padding: '2px 8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{sit.severity}</span>
                            <span style={{ fontSize: 10, fontWeight: 700, color: statusColor(sit.status), background: `${statusColor(sit.status)}12`, padding: '2px 8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{sit.status}</span>
                            <span style={{ fontSize: 10, color: '#9CA3AF' }}>{sit.type}</span>
                            {hasConflict && <span style={{ fontSize: 10, fontWeight: 700, color: RED, display: 'flex', alignItems: 'center', gap: 4 }}><AlertCircle style={{ width: 11, height: 11 }} />Resource Conflict</span>}
                          </div>
                          <div style={{ ...CG, fontSize: 20, fontWeight: 700, color: NAVY, marginBottom: 4 }}>{sit.name}</div>
                          <div style={{ fontSize: 11, color: '#6B7280' }}>Owner: <strong style={{ color: NAVY }}>{sit.owner}</strong> ({sit.ownerRole}) · Started {sit.startedAt} · <strong>{sit.timeToMilestone}</strong></div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontSize: 10, color: '#9CA3AF', marginBottom: 2 }}>Estimated Exposure</div>
                          <div style={{ ...CG, fontSize: 22, fontWeight: 700, color: RED, lineHeight: 1 }}>{sit.exposure}</div>
                          <div style={{ fontSize: 10, color: TEAL, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                            <Shield style={{ width: 10, height: 10 }} />
                            ${valuePreservedSit.toLocaleString()} preserved
                          </div>
                        </div>
                      </div>
                    </div>
                    <div style={{ padding: '14px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 20, alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 10, color: '#9CA3AF', marginBottom: 4 }}>Task Progress</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 6 }}>{sit.tasksComplete}/{sit.tasksTotal} complete ({completionPct}%)</div>
                        <Progress value={completionPct} className="h-1.5" />
                      </div>
                      <div>
                        <div style={{ fontSize: 10, color: '#9CA3AF', marginBottom: 4 }}>C-Suite Resources Committed</div>
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                          {sit.resourcesCommitted.map(r => {
                            const lc = leaderCapacity[r];
                            const isOverCommitted = lc && lc.capacity < 25;
                            return (
                              <span key={r} style={{ fontSize: 10, fontWeight: 700, color: isOverCommitted ? RED : NAVY, background: isOverCommitted ? `${RED}10` : `${NAVY}08`, border: `1px solid ${isOverCommitted ? RED + '40' : BORDER}`, padding: '2px 6px', display: 'flex', alignItems: 'center', gap: 3 }}>
                                {isOverCommitted && <AlertCircle style={{ width: 9, height: 9 }} />}
                                {r}
                              </span>
                            );
                          })}
                        </div>
                        <div style={{ fontSize: 9, color: TEAL, marginTop: 4 }}>Mobilized {sit.mobilizedAt}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {!isPriority && (
                          <Button size="sm" style={{ background: 'transparent', color: GOLD, border: `1px solid ${GOLD}40`, borderRadius: 0, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}
                            onClick={() => handlePrioritize(sit.id, sit.name)}>
                            Set Priority #1
                          </Button>
                        )}
                        <Link href="/execute/war-room">
                          <Button size="sm" style={{ background: NAVY, color: '#fff', border: 'none', borderRadius: 0, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                            War Room <ArrowRight style={{ width: 12, height: 12, marginLeft: 4 }} />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* ─── Shadow Baseline Comparison ─── */}
              <div style={{ background: `${NAVY}04`, border: `1px solid ${BORDER}`, borderTop: `3px solid ${TEAL}`, padding: '20px 24px', marginTop: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <BarChart3 style={{ width: 15, height: 15, color: TEAL }} />
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: TEAL }}>Shadow Baseline — What Traditional Mobilization Would Have Cost</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                  {[
                    { label: 'Time to mobilize all 3 situations (traditional)', value: '~90 days', sub: '30 days per situation minimum', color: RED },
                    { label: 'Time to mobilize with Readiness OS', value: '36 min', sub: '12 minutes per situation, all three', color: TEAL },
                    { label: 'Execution head start across all three', value: '3,600×', sub: 'The response was ready before the trigger fired', color: GOLD },
                  ].map((s, i) => (
                    <div key={i} style={{ padding: '14px 16px', background: '#fff', border: `1px solid ${BORDER}` }}>
                      <div style={{ fontSize: 9, color: '#9CA3AF', marginBottom: 6, lineHeight: 1.4 }}>{s.label}</div>
                      <div style={{ ...CG, fontSize: 22, fontWeight: 700, color: s.color, lineHeight: 1, marginBottom: 3 }}>{s.value}</div>
                      <div style={{ fontSize: 9, color: '#6B7280' }}>{s.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ─── Right Panel ─── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Leadership Capacity */}
              <div style={{ background: '#fff', border: `1px solid ${BORDER}` }}>
                <div style={{ padding: '14px 20px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9CA3AF' }}>Leadership Capacity</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 9, fontWeight: 700, color: RED }}>
                    <AlertTriangle style={{ width: 10, height: 10 }} />
                    1 Executive Critical
                  </div>
                </div>
                <div style={{ padding: '12px 20px' }}>
                  {Object.values(leaderCapacity).sort((a, b) => a.capacity - b.capacity).map(leader => {
                    const cc = capacityColor(leader.capacity);
                    const isCritical = leader.capacity < 25;
                    return (
                      <div key={leader.role} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: `1px solid ${BORDER}`, background: isCritical ? `${RED}04` : 'transparent' }}>
                        <div style={{ minWidth: 44 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: isCritical ? RED : NAVY, background: isCritical ? `${RED}12` : `${NAVY}08`, padding: '2px 6px', display: 'flex', alignItems: 'center', gap: 3 }}>
                            {isCritical && <AlertCircle style={{ width: 9, height: 9 }} />}
                            {leader.role}
                          </span>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span style={{ fontSize: 10, color: '#6B7280' }}>{leader.situations} situation{leader.situations !== 1 ? 's' : ''}</span>
                            <span style={{ fontSize: 11, fontWeight: 700, color: cc }}>{leader.capacity}% avail.</span>
                          </div>
                          <Progress value={leader.capacity} className="h-1.5" />
                          {isCritical && <div style={{ fontSize: 9, color: RED, marginTop: 3, fontWeight: 600 }}>⚠ Reallocation recommended below</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* AI Reallocation Recommendations */}
              <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderTop: `3px solid ${RED}` }}>
                <div style={{ padding: '14px 20px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Brain style={{ width: 14, height: 14, color: GOLD }} />
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: NAVY }}>AI Reallocation Actions</span>
                </div>
                <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {REALLOCATION_RECOMMENDATIONS.map((rec, idx) => {
                    const isApproved = approvedReallocations.has(idx);
                    return (
                      <div key={idx} style={{ padding: '12px 14px', background: isApproved ? `${TEAL}06` : `${GOLD}06`, border: `1px solid ${isApproved ? TEAL : GOLD}25` }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: isApproved ? TEAL : GOLD, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{rec.from} · {rec.situation}</div>
                        <div style={{ fontSize: 11, color: NAVY, lineHeight: 1.5, marginBottom: 8 }}>{rec.action}</div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: 9, color: TEAL, fontWeight: 700 }}>+{rec.frees} capacity freed</span>
                          {isApproved ? (
                            <span style={{ fontSize: 9, fontWeight: 700, color: TEAL, display: 'flex', alignItems: 'center', gap: 4 }}>
                              <CheckCircle style={{ width: 11, height: 11 }} /> Approved
                            </span>
                          ) : (
                            <button
                              onClick={() => handleApproveReallocation(idx, rec)}
                              style={{ fontSize: 9, fontWeight: 700, background: NAVY, color: '#fff', border: 'none', padding: '4px 10px', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 4 }}>
                              <Unlock style={{ width: 9, height: 9 }} /> Authorize
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* AI Priority Recommendation */}
              <div style={{ background: `${NAVY}04`, border: `1px solid ${BORDER}`, borderTop: `3px solid ${GOLD}` }}>
                <div style={{ padding: '14px 20px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Brain style={{ width: 14, height: 14, color: GOLD }} />
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: GOLD }}>AI Priority Ranking</span>
                </div>
                <div style={{ padding: '14px 16px' }}>
                  <div style={{ fontSize: 12, color: NAVY, lineHeight: 1.6, marginBottom: 12 }}>
                    SEC Inquiry has the highest financial exposure ($20M mid-case) with an active regulatory deadline. Prioritize CLO bandwidth for Situation 3. Delegate Ransomware CISO lead to Deputy CISO.
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {[
                      { rank: '1', name: 'SEC Inquiry', reason: 'Regulatory deadline + highest exposure', color: RED },
                      { rank: '2', name: 'Ransomware', reason: 'Active containment, 61% task complete', color: GOLD },
                      { rank: '3', name: 'Supply Chain', reason: 'Monitoring phase, lower urgency', color: TEAL },
                    ].map(r => (
                      <div key={r.rank} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 10px', background: '#fff', border: `1px solid ${BORDER}` }}>
                        <div style={{ width: 20, height: 20, background: r.color, color: r.color === GOLD ? NAVY : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{r.rank}</div>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: NAVY }}>{r.name}</div>
                          <div style={{ fontSize: 10, color: '#9CA3AF' }}>{r.reason}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick actions */}
              <div style={{ background: '#fff', border: `1px solid ${BORDER}`, padding: '16px' }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 12 }}>Quick Actions</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Link href="/crisis-communications">
                    <Button className="w-full justify-start" size="sm" style={{ background: `${NAVY}06`, color: NAVY, border: `1px solid ${BORDER}`, borderRadius: 0, fontSize: 11, fontWeight: 700 }}>
                      <MessageSquare style={{ width: 13, height: 13, marginRight: 8 }} />Generate Crisis Comms
                    </Button>
                  </Link>
                  <Link href="/roi-dashboard">
                    <Button className="w-full justify-start" size="sm" style={{ background: `${NAVY}06`, color: NAVY, border: `1px solid ${BORDER}`, borderRadius: 0, fontSize: 11, fontWeight: 700 }}>
                      <DollarSign style={{ width: 13, height: 13, marginRight: 8 }} />Value Preserved Dashboard
                    </Button>
                  </Link>
                  <Link href="/board-briefings">
                    <Button className="w-full justify-start" size="sm" style={{ background: `${NAVY}06`, color: NAVY, border: `1px solid ${BORDER}`, borderRadius: 0, fontSize: 11, fontWeight: 700 }}>
                      <FileText style={{ width: 13, height: 13, marginRight: 8 }} />Generate Board Brief
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
