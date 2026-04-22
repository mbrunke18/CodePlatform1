import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  DollarSign,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Building2,
  FileText,
  Zap,
  Shield,
  Target,
  ArrowRight,
  Brain,
  Activity,
  BarChart3,
  ChevronRight,
  Star,
  AlertCircle
} from 'lucide-react';

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const RED = "#dc2626";
const OFF = "#F8F7F4";
const BORDER = "#E8E4DC";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

const seededRandom = (seed: string): number => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs((Math.sin(hash) * 10000) % 1);
};

interface ResourceConflict {
  resourceType: string;
  resourceName: string;
  conflictingPlaybook: string;
  severity: 'high' | 'medium' | 'low';
  resolution: string;
}

interface ImpactPreview {
  estimatedCost: number;
  estimatedDuration: number;
  departmentsInvolved: string[];
  stakeholdersToNotify: number;
  documentsToStage: number;
  budgetToUnlock: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  successProbability: number;
  resourceConflicts: ResourceConflict[];
  readinessScore: number;
  blockers: string[];
}

interface PlaybookInput {
  id?: string;
  name?: string;
  description?: string;
  averageExecutionTime?: number;
}

export interface ExecutionParams {
  scope: 'full' | 'pilot';
  timeline: 'accelerated' | 'standard' | 'extended';
  notifyDepartments: string[];
}

interface PreActivationImpactPreviewProps {
  playbook: PlaybookInput;
  onConfirmActivation: (params: ExecutionParams) => void;
  onCancel: () => void;
}

const RISK_FACTORS_BY_LEVEL: Record<string, string[]> = {
  low: ['All key stakeholders available', 'No competing activations', 'Recent drill completed'],
  medium: ['1–2 resource constraints identified', 'CFO bandwidth limited', 'No recent practice drill'],
  high: ['3+ resource conflicts', 'Legal team engaged on parallel matter', 'No pre-staged communications ready'],
  critical: ['Critical personnel unavailable', 'Budget authorization not pre-cleared', 'Regulatory filing due within 24h'],
};

const OUTCOME_SCENARIOS = (successProbability: number, cost: number, duration: number) => [
  {
    label: 'Optimistic',
    probability: Math.min(successProbability + 12, 99),
    outcome: `Full task completion in ${Math.round(duration * 0.8)} min. Costs below estimate.`,
    color: TEAL,
    icon: '↑',
  },
  {
    label: 'Expected',
    probability: successProbability,
    outcome: `${Math.round(duration)} min execution. 90–95% task completion rate. On-budget.`,
    color: GOLD,
    icon: '→',
  },
  {
    label: 'Adverse',
    probability: Math.max(successProbability - 18, 40),
    outcome: `Extended timeline due to resource conflict. Cost overrun of 15–25% possible.`,
    color: RED,
    icon: '↓',
  },
];

export default function PreActivationImpactPreview({ 
  playbook, 
  onConfirmActivation, 
  onCancel 
}: PreActivationImpactPreviewProps) {
  const [acknowledged, setAcknowledged] = useState(false);
  const [activeTab, setActiveTab] = useState<'prediction' | 'resources' | 'impact' | 'parameters'>('prediction');
  const [execScope, setExecScope] = useState<'full' | 'pilot'>('full');
  const [execTimeline, setExecTimeline] = useState<'accelerated' | 'standard' | 'extended'>('standard');
  const [notifyDepts, setNotifyDepts] = useState<string[]>([]);

  const preview = useMemo((): ImpactPreview => {
    const seed = playbook?.id || playbook?.name || 'default';
    const rand1 = seededRandom(seed + '1');
    const rand2 = seededRandom(seed + '2');
    const rand3 = seededRandom(seed + '3');
    const rand4 = seededRandom(seed + '4');
    const rand5 = seededRandom(seed + '5');
    const rand6 = seededRandom(seed + '6');
    
    const hasConflicts = rand1 > 0.6;
    
    const conflicts: ResourceConflict[] = hasConflicts ? ([
      {
        resourceType: 'Personnel',
        resourceName: 'Crisis Communications Lead',
        conflictingPlaybook: 'Regulatory Response Prepared Response',
        severity: 'medium' as const,
        resolution: 'Assign backup: VP Communications'
      },
      {
        resourceType: 'Budget',
        resourceName: 'Emergency Response Fund',
        conflictingPlaybook: 'Cyber Incident Prepared Response',
        severity: 'low' as const,
        resolution: '60% allocation available'
      }
    ] as ResourceConflict[]).slice(0, rand2 > 0.5 ? 2 : 1) : [];

    const blockers = rand3 > 0.7 ? [
      'Legal approval pending for external communications template'
    ] : [];

    const allDepartments = ['Legal', 'Communications', 'Operations', 'Finance', 'HR', 'IT'];
    const deptCount = Math.floor(3 + rand4 * 4);

    return {
      estimatedCost: Math.round((50000 + rand1 * 200000) / 1000) * 1000,
      estimatedDuration: playbook?.averageExecutionTime || Math.round(8 + rand2 * 20),
      departmentsInvolved: allDepartments.slice(0, deptCount),
      stakeholdersToNotify: Math.round(15 + rand3 * 40),
      documentsToStage: Math.round(5 + rand4 * 15),
      budgetToUnlock: Math.round((20000 + rand5 * 100000) / 1000) * 1000,
      riskLevel: rand6 > 0.7 ? 'high' : rand6 > 0.4 ? 'medium' : 'low',
      successProbability: Math.round(75 + rand1 * 20),
      resourceConflicts: conflicts,
      readinessScore: Math.round(70 + rand2 * 25),
      blockers
    };
  }, [playbook]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);

  const hasBlockers = preview.blockers.length > 0;
  const hasConflicts = preview.resourceConflicts.length > 0;
  const riskFactors = RISK_FACTORS_BY_LEVEL[preview.riskLevel] || RISK_FACTORS_BY_LEVEL.medium;
  const outcomes = OUTCOME_SCENARIOS(preview.successProbability, preview.estimatedCost, preview.estimatedDuration);

  const probabilityColor = preview.successProbability >= 85 ? TEAL : preview.successProbability >= 70 ? GOLD : RED;
  const riskBadgeColor = preview.riskLevel === 'critical' ? RED : preview.riskLevel === 'high' ? '#F59E0B' : preview.riskLevel === 'medium' ? GOLD : TEAL;

  return (
    <div style={{ border: `2px solid ${GOLD}`, background: '#fff' }} data-testid="card-pre-activation-preview">
      {/* ─── Header ─── */}
      <div style={{ background: NAVY, padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <div style={{ width: 20, height: 1.5, background: GOLD }} />
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD }}>Pre-Activation Outcome Prediction</span>
            </div>
            <div style={{ ...CG, fontSize: 20, fontWeight: 700, color: '#F0EDE4', lineHeight: 1.1, marginBottom: 4 }}>
              "{playbook?.name || 'Prepared Response'}"
            </div>
            <div style={{ fontSize: 11, color: 'rgba(240,237,228,0.55)' }}>Projected impact and risk assessment — review before activation</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            <div style={{ background: `${riskBadgeColor}20`, color: riskBadgeColor, border: `1px solid ${riskBadgeColor}40`, fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '3px 10px' }}>
              {preview.riskLevel.toUpperCase()} RISK
            </div>
            {hasBlockers && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: `${RED}20`, color: '#F87171', fontSize: 9, fontWeight: 700, padding: '3px 8px', border: `1px solid ${RED}30` }}>
                <AlertTriangle style={{ width: 10, height: 10 }} />{preview.blockers.length} Blocker{preview.blockers.length > 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Tab Nav ─── */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${BORDER}`, background: OFF }}>
        {[
          { id: 'prediction', label: 'Outcome Prediction', icon: Brain },
          { id: 'resources', label: 'Resources & Conflicts', icon: Users },
          { id: 'impact', label: 'Impact Estimate', icon: DollarSign },
          { id: 'parameters', label: 'Deployment Parameters', icon: Target },
        ].map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px 12px', border: 'none', background: active ? '#fff' : 'transparent', borderBottom: active ? `2px solid ${GOLD}` : '2px solid transparent', cursor: 'pointer', fontSize: 11, fontWeight: 700, color: active ? NAVY : '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', transition: 'all 0.15s' }}>
              <Icon style={{ width: 13, height: 13 }} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ─── Tab Content ─── */}
      <div style={{ padding: '20px 24px' }}>

        {/* Prediction Tab */}
        {activeTab === 'prediction' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Success probability gauge */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: '16px 18px', background: OFF, border: `1px solid ${BORDER}`, borderTop: `3px solid ${probabilityColor}` }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 6 }}>Predicted Success Rate</div>
                <div style={{ ...CG, fontSize: 42, fontWeight: 700, color: probabilityColor, lineHeight: 1, marginBottom: 6 }}>{preview.successProbability}%</div>
                <Progress value={preview.successProbability} className="h-1.5" />
                <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 4 }}>Based on 847 peer-company executions</div>
              </div>
              <div style={{ padding: '16px 18px', background: OFF, border: `1px solid ${BORDER}`, borderTop: `3px solid ${NAVY}` }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 6 }}>Readiness Score</div>
                <div style={{ ...CG, fontSize: 42, fontWeight: 700, color: NAVY, lineHeight: 1, marginBottom: 6 }}>{preview.readinessScore}</div>
                <Progress value={preview.readinessScore} className="h-1.5" />
                <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 4 }}>Org preparedness for this prepared response</div>
              </div>
            </div>

            {/* 3 Outcome Scenarios */}
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 10 }}>Predicted Outcome Scenarios</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {outcomes.map((o, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 14px', border: `1px solid ${BORDER}`, background: '#fff', borderLeft: `3px solid ${o.color}` }}>
                    <div style={{ width: 28, height: 28, background: `${o.color}15`, color: o.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, flexShrink: 0, border: `1px solid ${o.color}30` }}>
                      {o.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: NAVY }}>{o.label} Case</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: o.color }}>{o.probability}% success probability</span>
                      </div>
                      <div style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.5 }}>{o.outcome}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk factors */}
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 8 }}>Key Risk Factors</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {riskFactors.map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#6B7280' }}>
                    <div style={{ width: 5, height: 5, borderRadius: 0, background: riskBadgeColor, flexShrink: 0 }} />
                    {f}
                  </div>
                ))}
              </div>
            </div>

            {/* Peer benchmark */}
            <div style={{ padding: '12px 14px', background: `${TEAL}06`, border: `1px solid ${TEAL}20`, borderLeft: `3px solid ${TEAL}` }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: TEAL, marginBottom: 6 }}>Peer Benchmark</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {[
                  { label: 'Avg completion (peers)', value: '82%' },
                  { label: 'Median execution time', value: '14 min' },
                  { label: 'Your best prior outcome', value: `${Math.min(preview.successProbability + 5, 99)}%` },
                ].map((b, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: TEAL }}>{b.value}</div>
                    <div style={{ fontSize: 9, color: '#9CA3AF' }}>{b.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Blockers */}
            {hasBlockers && (
              <div>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 8 }}>Pre-Activation Blockers</div>
                {preview.blockers.map((b, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px', background: `${RED}06`, border: `1px solid ${RED}20`, borderLeft: `3px solid ${RED}` }}>
                    <AlertTriangle style={{ width: 14, height: 14, color: RED, flexShrink: 0, marginTop: 1 }} />
                    <span style={{ fontSize: 12, color: '#6B7280' }}>{b}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Resource conflicts */}
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 8 }}>
                Resource Conflicts {hasConflicts ? `(${preview.resourceConflicts.length} detected)` : '(none)'}
              </div>
              {!hasConflicts ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: `${TEAL}06`, border: `1px solid ${TEAL}20` }}>
                  <CheckCircle2 style={{ width: 14, height: 14, color: TEAL }} />
                  <span style={{ fontSize: 12, color: TEAL }}>No resource conflicts detected. Clear to activate.</span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {preview.resourceConflicts.map((c, i) => {
                    const sc = c.severity === 'high' ? RED : c.severity === 'medium' ? GOLD : '#9CA3AF';
                    return (
                      <div key={i} style={{ padding: '12px 14px', border: `1px solid ${BORDER}`, borderLeft: `3px solid ${sc}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: NAVY }}>{c.resourceName}</span>
                          <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', color: sc }}>{c.severity} conflict</span>
                        </div>
                        <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 4 }}>Conflict: {c.conflictingPlaybook}</div>
                        <div style={{ fontSize: 11, color: TEAL, fontWeight: 600 }}>Resolution: {c.resolution}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Departments */}
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 8 }}>Departments Activated</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {preview.departmentsInvolved.map(dept => (
                  <span key={dept} style={{ fontSize: 10, fontWeight: 700, color: NAVY, background: `${NAVY}08`, border: `1px solid ${BORDER}`, padding: '3px 10px' }}>{dept}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Impact Tab */}
        {activeTab === 'impact' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              {[
                { label: 'Estimated Cost', value: formatCurrency(preview.estimatedCost), icon: DollarSign, color: NAVY },
                { label: 'Est. Duration', value: `${preview.estimatedDuration} min`, icon: Clock, color: TEAL },
                { label: 'Stakeholders', value: preview.stakeholdersToNotify, icon: Users, color: GOLD },
                { label: 'Documents Staged', value: preview.documentsToStage, icon: FileText, color: NAVY },
                { label: 'Budget to Unlock', value: formatCurrency(preview.budgetToUnlock), icon: Zap, color: TEAL },
                { label: 'Departments', value: preview.departmentsInvolved.length, icon: Building2, color: GOLD },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} style={{ padding: '14px 16px', background: OFF, border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 32, height: 32, background: `${item.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon style={{ width: 16, height: 16, color: item.color }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: NAVY, lineHeight: 1 }}>{item.value}</div>
                      <div style={{ fontSize: 9, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 2 }}>{item.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {/* Deployment Parameters Tab */}
        {activeTab === 'parameters' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Execution Scope */}
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 10 }}>Execution Scope</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {([
                  { value: 'full', label: 'Full Deployment', desc: 'All teams and stakeholders activated simultaneously', icon: '⚡' },
                  { value: 'pilot', label: 'Pilot Deployment', desc: 'Core team only — expand after initial validation', icon: '🔬' },
                ] as const).map(opt => (
                  <button key={opt.value} onClick={() => setExecScope(opt.value)}
                    style={{ textAlign: 'left', padding: '14px 16px', border: `2px solid ${execScope === opt.value ? GOLD : BORDER}`, background: execScope === opt.value ? `${GOLD}08` : '#fff', cursor: 'pointer', transition: 'all 0.15s' }}>
                    <div style={{ fontSize: 16, marginBottom: 4 }}>{opt.icon}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: NAVY, marginBottom: 4 }}>{opt.label}</div>
                    <div style={{ fontSize: 10, color: '#6B7280', lineHeight: 1.5 }}>{opt.desc}</div>
                    {execScope === opt.value && (
                      <div style={{ marginTop: 8, fontSize: 9, fontWeight: 700, color: GOLD, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Selected</div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 10 }}>Execution Timeline</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {([
                  { value: 'accelerated', label: 'Accelerated', mins: '8 min', desc: 'Maximum compression — all parallel tracks active', color: RED, recommended: false },
                  { value: 'standard', label: 'Standard', mins: '12 min', desc: 'Default — AI-recommended pacing for this prepared response', color: TEAL, recommended: true },
                  { value: 'extended', label: 'Extended', mins: '20 min', desc: 'Deliberate pacing — additional stakeholder review cycles', color: '#9CA3AF', recommended: false },
                ] as const).map(opt => (
                  <button key={opt.value} onClick={() => setExecTimeline(opt.value)}
                    style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', border: `2px solid ${execTimeline === opt.value ? opt.color : BORDER}`, background: execTimeline === opt.value ? `${opt.color}08` : '#fff', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                    <div style={{ width: 36, height: 36, background: `${opt.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1px solid ${opt.color}30` }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: opt.color }}>{opt.mins}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: NAVY }}>{opt.label}</span>
                        {opt.recommended && <span style={{ fontSize: 9, fontWeight: 700, color: TEAL, background: `${TEAL}15`, padding: '1px 6px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Recommended</span>}
                      </div>
                      <div style={{ fontSize: 10, color: '#6B7280' }}>{opt.desc}</div>
                    </div>
                    {execTimeline === opt.value && <CheckCircle2 style={{ width: 16, height: 16, color: opt.color, flexShrink: 0 }} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Stakeholder Notification Scope */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9CA3AF' }}>Departments to Notify</div>
                <button onClick={() => setNotifyDepts(notifyDepts.length === preview.departmentsInvolved.length ? [] : [...preview.departmentsInvolved])}
                  style={{ fontSize: 10, fontWeight: 700, color: TEAL, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                  {notifyDepts.length === preview.departmentsInvolved.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {preview.departmentsInvolved.map(dept => {
                  const selected = notifyDepts.length === 0 || notifyDepts.includes(dept);
                  const isExplicitlySelected = notifyDepts.includes(dept);
                  const defaultAll = notifyDepts.length === 0;
                  const active = defaultAll || isExplicitlySelected;
                  return (
                    <button key={dept} onClick={() => {
                      if (notifyDepts.length === 0) {
                        setNotifyDepts(preview.departmentsInvolved.filter(d => d !== dept));
                      } else {
                        setNotifyDepts(prev => prev.includes(dept) ? prev.filter(d => d !== dept) : [...prev, dept]);
                      }
                    }}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', border: `1px solid ${active ? TEAL : BORDER}`, background: active ? `${TEAL}10` : '#fff', cursor: 'pointer', fontSize: 11, fontWeight: 700, color: active ? TEAL : '#9CA3AF', transition: 'all 0.15s' }}>
                      {active ? <CheckCircle2 style={{ width: 12, height: 12 }} /> : <XCircle style={{ width: 12, height: 12 }} />}
                      {dept}
                    </button>
                  );
                })}
              </div>
              <div style={{ marginTop: 8, fontSize: 10, color: '#9CA3AF' }}>
                {notifyDepts.length === 0 ? `All ${preview.departmentsInvolved.length} departments selected (default)` : `${notifyDepts.length} of ${preview.departmentsInvolved.length} departments selected`}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ─── Footer Actions ─── */}
      <div style={{ padding: '16px 24px', borderTop: `1px solid ${BORDER}`, background: OFF }}>
        {hasBlockers && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '10px 14px', background: `${RED}06`, border: `1px solid ${RED}20`, marginBottom: 12 }}>
            <AlertCircle style={{ width: 14, height: 14, color: RED, flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontSize: 11, color: '#6B7280' }}>
              <strong style={{ color: RED }}>Blockers detected.</strong> You can still activate, but resolve the blocker items first for optimal outcome probability.
            </span>
          </div>
        )}

        {!acknowledged ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <button onClick={() => setAcknowledged(true)}
              style={{ width: 18, height: 18, border: `2px solid ${BORDER}`, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.5 }}>
              I have reviewed the outcome prediction, risk factors, and resource conflicts above.
            </span>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <CheckCircle2 style={{ width: 14, height: 14, color: TEAL }} />
            <span style={{ fontSize: 11, color: TEAL, fontWeight: 600 }}>Review acknowledged — ready to activate.</span>
          </div>
        )}

        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="outline" onClick={onCancel}
            style={{ borderRadius: 0, border: `1px solid ${BORDER}`, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', flex: 1 }}>
            Cancel
          </Button>
          <Button onClick={() => onConfirmActivation({
              scope: execScope,
              timeline: execTimeline,
              notifyDepartments: notifyDepts.length > 0 ? notifyDepts : preview.departmentsInvolved,
            })} disabled={!acknowledged}
            style={{ background: acknowledged ? TEAL : '#9CA3AF', color: '#fff', borderRadius: 0, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', flex: 2, transition: 'background 0.2s' }}>
            <Zap style={{ width: 14, height: 14, marginRight: 6 }} />
            Confirm Activation — {preview.successProbability}% Predicted Success
          </Button>
        </div>
      </div>
    </div>
  );
}
