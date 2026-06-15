import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { updatePageMetadata } from '@/lib/seo';
import {
  CheckCircle2, ChevronRight, Plus, X, Shield, Users, ListChecks,
  MessageSquare, Wallet, Key, ArrowLeft, BookOpen, Zap, Radio,
  GitBranch, Activity, AlertTriangle, BarChart2, Play, Lock,
} from 'lucide-react';
import MicroHelp from '@/components/onboarding/MicroHelp';

const NAVY   = '#0A0F2E';
const GOLD   = '#C9A84C';
const TEAL   = '#2B8A6E';
const IVORY  = '#F0EDE4';
const BORDER = '#E2DDD5';
const MUTED  = '#6B7280';

// ── Domains / Industries / Risk ───────────────────────────────────────────────

const DOMAINS = [
  'Growth & Positioning', 'Risk & Resilience', 'Transformation',
  'Regulatory & Compliance', 'Crisis Management', 'Technology & AI Governance',
  'Financial Response', 'Talent & Organization', 'Operational Excellence',
];

const INDUSTRIES = [
  'Financial Services', 'Healthcare', 'Energy & Utilities', 'Manufacturing',
  'Pharmaceutical', 'Technology', 'Retail & Consumer', 'Government & Public Sector',
];

const RISK_LEVELS = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

const TRIGGER_COMMON_MISTAKES = [
  'Vague triggers ("significant market change") create hesitation — be specific about the data point that fires the protocol.',
  'Skipping the industry field — the system uses it to pre-match signal sources.',
  'Setting riskThreshold too low — MEDIUM on a mission-critical protocol means it activates on noise.',
  'Not referencing a specific system signal — pair every trigger condition with a named source (e.g., SIEM, ERP alert).',
];

const RISK_COLORS: Record<string, string> = {
  LOW: TEAL, MEDIUM: '#D97706', HIGH: '#DC2626', CRITICAL: NAVY,
};

// ── Signal / System coverage options ─────────────────────────────────────────

const EXTERNAL_SIGNALS = [
  'Market News & Financial Press',
  'Regulatory Alert Feeds (SEC, FTC, OSHA, FDA)',
  'Threat Intelligence & Dark Web',
  'SIEM / Endpoint Detection',
  'Social Media & Sentiment Monitoring',
  'Competitive Intelligence',
  'Supply Chain Risk Feeds',
  'Geopolitical & Weather Events',
];

const INTERNAL_SYSTEMS = [
  'ERP (SAP, Oracle, etc.)',
  'CRM (Salesforce, HubSpot, etc.)',
  'ITSM / Ticketing (ServiceNow, Jira)',
  'SIEM (Splunk, Microsoft Sentinel)',
  'HRIS (Workday, SuccessFactors)',
  'Procurement / Sourcing Platform',
  'Legal Workflow / Contract System',
  'Financial Reporting / BI Tools',
];

const MONITORING_CADENCES = [
  { value: '5', label: 'Every 5 minutes — Critical' },
  { value: '15', label: 'Every 15 minutes — Standard' },
  { value: '30', label: 'Every 30 minutes — Routine' },
  { value: '60', label: 'Every 60 minutes — Background' },
];

const APPROVAL_POLICIES = [
  { value: 'single', label: 'Single authorizer' },
  { value: 'dual', label: 'Dual sign-off required' },
  { value: 'board', label: 'Board approval required' },
];

const REVIEW_CADENCES = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'biannual', label: 'Bi-annual' },
  { value: 'annual', label: 'Annual' },
];

// ── Quick-start templates ─────────────────────────────────────────────────────

const TEMPLATES = [
  {
    id: 'cyber',
    icon: Shield,
    name: 'Critical Cyber Event',
    domain: 'Technology & AI Governance',
    industry: 'Technology',
    risk: 'CRITICAL',
    desc: 'Ransomware · SIEM alert · enterprise systems',
    triggerCondition: 'SIEM detects unauthorized file-system encryption across two or more production servers, or endpoint detection confirms ransomware payload execution on critical infrastructure.',
    immediatePrimary: { title: 'CISO', name: '' },
    immediateSecondary: { title: 'General Counsel', name: '' },
    secondaryPrimary: { title: 'CFO', name: '' },
    followUpPrimary: { title: 'Board Chair', name: '' },
    immediateTasks: [
      { description: 'Isolate affected systems from network immediately', assignedTo: 'CISO' },
      { description: 'Activate incident response retainer', assignedTo: 'General Counsel' },
      { description: 'Preserve forensic evidence and system logs', assignedTo: 'CISO' },
    ],
    secondaryTasks: [
      { description: 'Assess scope and financial exposure', assignedTo: 'CFO' },
      { description: 'Engage external incident response firm', assignedTo: 'General Counsel' },
      { description: 'Draft board and regulatory notification', assignedTo: 'General Counsel' },
    ],
    followUpTasks: [
      { description: 'File regulatory disclosure within required window', assignedTo: 'General Counsel' },
      { description: 'Board briefing and post-incident review', assignedTo: 'CFO' },
      { description: 'System restoration and security hardening plan', assignedTo: 'CISO' },
    ],
    externalSignals: ['SIEM / Endpoint Detection', 'Threat Intelligence & Dark Web', 'Regulatory Alert Feeds (SEC, FTC, OSHA, FDA)'],
    internalSystems: ['SIEM (Splunk, Microsoft Sentinel)', 'ITSM / Ticketing (ServiceNow, Jira)', 'Legal Workflow / Contract System'],
    monitoringCadence: '5',
    authorizerTitle: 'CISO', authorizerName: '', executorTitle: 'Security Operations Team', executorName: '',
    overrideTitle: 'CEO', overrideName: '',
    budgetHigh: '5,000,000', budgetHighApprover: 'CFO', budgetCritical: '15,000,000', budgetCriticalApprover: 'Board Authorization',
    approvalPolicy: 'dual', reviewCadence: 'quarterly',
  },
  {
    id: 'regulatory',
    icon: Lock,
    name: 'Regulatory Inquiry',
    domain: 'Regulatory & Compliance',
    industry: 'Financial Services',
    risk: 'HIGH',
    desc: 'SEC · FTC · DOJ · civil investigative demand',
    triggerCondition: 'Regulatory body (SEC, FTC, DOJ, or equivalent) issues formal inquiry, investigation notice, or civil investigative demand to the organization or a named executive.',
    immediatePrimary: { title: 'General Counsel', name: '' },
    immediateSecondary: { title: 'CEO', name: '' },
    secondaryPrimary: { title: 'CFO', name: '' },
    followUpPrimary: { title: 'Board Audit Chair', name: '' },
    immediateTasks: [
      { description: 'Activate litigation hold across all relevant systems', assignedTo: 'General Counsel' },
      { description: 'Brief CEO and Board Audit Committee', assignedTo: 'General Counsel' },
      { description: 'Retain outside regulatory counsel', assignedTo: 'General Counsel' },
    ],
    secondaryTasks: [
      { description: 'Assemble cross-functional response team', assignedTo: 'CEO' },
      { description: 'Draft initial regulatory response timeline', assignedTo: 'General Counsel' },
      { description: 'Assess financial reserve requirements', assignedTo: 'CFO' },
    ],
    followUpTasks: [
      { description: 'File formal response within regulatory deadline', assignedTo: 'General Counsel' },
      { description: 'Board disclosure and investor communications', assignedTo: 'CFO' },
      { description: 'Remediation plan and compliance review', assignedTo: 'General Counsel' },
    ],
    externalSignals: ['Regulatory Alert Feeds (SEC, FTC, OSHA, FDA)', 'Market News & Financial Press', 'Social Media & Sentiment Monitoring'],
    internalSystems: ['Legal Workflow / Contract System', 'Financial Reporting / BI Tools', 'ERP (SAP, Oracle, etc.)'],
    monitoringCadence: '15',
    authorizerTitle: 'General Counsel', authorizerName: '', executorTitle: 'Legal & Compliance Team', executorName: '',
    overrideTitle: 'CEO', overrideName: '',
    budgetMedium: '500,000', budgetHigh: '2,500,000', budgetHighApprover: 'Board Audit Chair', budgetCritical: '10,000,000', budgetCriticalApprover: 'Full Board',
    approvalPolicy: 'dual', reviewCadence: 'biannual',
  },
  {
    id: 'supply',
    icon: Activity,
    name: 'Supply Chain Shock',
    domain: 'Risk & Resilience',
    industry: 'Manufacturing',
    risk: 'HIGH',
    desc: 'Critical supplier failure · production stoppage',
    triggerCondition: 'Tier-1 or Tier-2 supplier announces force majeure, insolvency, production stoppage, or geopolitical disruption that threatens more than 20% of production capacity within 30 days.',
    immediatePrimary: { title: 'Chief Operations Officer', name: '' },
    immediateSecondary: { title: 'Chief Procurement Officer', name: '' },
    secondaryPrimary: { title: 'CFO', name: '' },
    followUpPrimary: { title: 'CEO', name: '' },
    immediateTasks: [
      { description: 'Assess current inventory runway by product line', assignedTo: 'Chief Procurement Officer' },
      { description: 'Activate approved alternate supplier list', assignedTo: 'Chief Operations Officer' },
      { description: 'Notify key customers of potential lead-time impact', assignedTo: 'Chief Operations Officer' },
    ],
    secondaryTasks: [
      { description: 'Expedite purchase orders from alternate suppliers', assignedTo: 'Chief Procurement Officer' },
      { description: 'Model financial exposure and cash flow impact', assignedTo: 'CFO' },
      { description: 'Review contractual force majeure and insurance coverage', assignedTo: 'General Counsel' },
    ],
    followUpTasks: [
      { description: 'Dual-source affected categories permanently', assignedTo: 'Chief Procurement Officer' },
      { description: 'Board update on supply chain resilience investments', assignedTo: 'CEO' },
      { description: 'Revise supplier concentration risk policy', assignedTo: 'Chief Operations Officer' },
    ],
    externalSignals: ['Supply Chain Risk Feeds', 'Geopolitical & Weather Events', 'Market News & Financial Press'],
    internalSystems: ['ERP (SAP, Oracle, etc.)', 'Procurement / Sourcing Platform', 'Financial Reporting / BI Tools'],
    monitoringCadence: '15',
    authorizerTitle: 'Chief Operations Officer', authorizerName: '', executorTitle: 'Supply Chain Team', executorName: '',
    overrideTitle: 'CEO', overrideName: '',
    budgetMedium: '1,000,000', budgetHigh: '5,000,000', budgetHighApprover: 'CFO', budgetCritical: '20,000,000', budgetCriticalApprover: 'Board Authorization',
    approvalPolicy: 'single', reviewCadence: 'quarterly',
  },
];

// ── Steps config ──────────────────────────────────────────────────────────────

const STEPS = [
  {
    num: 1, id: 'identity', Icon: Shield,
    title: 'Protocol Identity',
    subtitle: 'Name the trigger. Define the context.',
    guidance: 'Every protocol in the 180 begins with a precisely-defined trigger. Vague triggers create hesitation; clear triggers create 12-minute execution.',
    example: { label: 'From the 180', name: 'Ransomware Response — Enterprise Systems', meta: 'Tech & AI Governance · CRITICAL', detail: 'SIEM detects unauthorized file-system encryption across production servers.' },
  },
  {
    num: 2, id: 'owners', Icon: Users,
    title: 'Executive Owners',
    subtitle: 'Pre-assign ownership before the trigger fires.',
    guidance: 'In the 180 protocols, ownership is decided before pressure — not during it. Each phase has a named owner attached before any trigger fires.',
    example: { label: 'From the 180', name: 'Ransomware Response', meta: 'IMMEDIATE: CISO (primary), General Counsel (secondary)', detail: 'SECONDARY: CFO · FOLLOW-UP: Board Chair' },
  },
  {
    num: 3, id: 'tasks', Icon: ListChecks,
    title: 'Task Sequence',
    subtitle: 'Pre-stage execution across three phases.',
    guidance: 'IMMEDIATE (0–12 min), SECONDARY (1–4 hrs), FOLLOW-UP (1–5 days). Tasks are pre-written and pre-assigned. Activation means execution — not planning.',
    example: { label: 'From the 180', name: 'IMMEDIATE: Isolate affected systems — CISO', meta: 'SECONDARY: Engage incident response firm — General Counsel', detail: 'FOLLOW-UP: Regulatory disclosure and board brief — CFO' },
  },
  {
    num: 4, id: 'comms', Icon: MessageSquare,
    title: 'Communication Chain',
    subtitle: 'Pre-draft every message before the pressure hits.',
    guidance: 'In a real trigger event, drafting communications under pressure introduces errors and delays. The 180 protocols pre-stage every message — the only variable is the date.',
    example: { label: 'From the 180', name: 'Board brief pre-drafted and updated quarterly', meta: 'Stakeholder alert fires at trigger detection — no drafting under pressure', detail: 'Public statement template reviewed by Legal & PR annually' },
  },
  {
    num: 5, id: 'budget', Icon: Wallet,
    title: 'Budget Envelope',
    subtitle: 'Pre-authorize spending before the trigger fires.',
    guidance: 'Budget approval under pressure adds hours. The 180 protocols pre-approve spending thresholds by severity — so execution starts immediately with full financial authority.',
    example: { label: 'From the 180', name: 'LOW: $250K pre-authorized', meta: 'MEDIUM: $1M pre-authorized  ·  HIGH: $5M + CFO co-sign', detail: 'CRITICAL: $15M emergency provision + Board authorization' },
  },
  {
    num: 6, id: 'authority', Icon: Key,
    title: 'Decision Authority',
    subtitle: 'Map who authorizes, executes, and observes.',
    guidance: 'In the 180 protocols, authority is never ambiguous. The authorization chain is set before the trigger — so no one asks "who needs to approve this?" during execution.',
    example: { label: 'From the 180', name: 'Authorizes: CISO', meta: 'Executes: Security Operations Team', detail: 'Observes: CFO, General Counsel, Board Chair · Override: CEO' },
  },
  {
    num: 7, id: 'signals', Icon: Activity,
    title: 'Signal Coverage & Readiness',
    subtitle: 'Choose which signals feed this protocol and when it fires.',
    guidance: 'Protocols that monitor specific signals are staged and ready before the trigger fires. Choose which of your live signal categories feed this protocol, mark the must-have ones, and define when it escalates.',
    example: { label: 'From the 180', name: 'Ransomware: SIEM + Endpoint Detection (mandatory)', meta: 'Readiness fires when both mandatory signals hit — regardless of overall %', detail: 'Custom data point: "Threat intelligence feed confirms payload hash match"' },
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const mkTasks = (n: number) => Array.from({ length: n }, () => ({ description: '', assignedTo: '' }));

// IDs match shared/intelligence-signals.ts SIGNAL_CATEGORIES exactly
const SIGNAL_CATEGORIES = [
  // GROWTH & POSITIONING
  { id: 'competitive',    label: 'Competitive Movement',       domain: 'GROWTH & POSITIONING' },
  { id: 'market',         label: 'Market Dynamics',            domain: 'GROWTH & POSITIONING' },
  { id: 'financial',      label: 'Financial & Investment',     domain: 'GROWTH & POSITIONING' },
  { id: 'partnership',    label: 'Partnership & Ecosystem',    domain: 'GROWTH & POSITIONING' },
  { id: 'innovation',     label: 'Innovation Pipeline',        domain: 'GROWTH & POSITIONING' },
  { id: 'technology',     label: 'Technology Disruption',      domain: 'GROWTH & POSITIONING' },
  // RISK & RESILIENCE
  { id: 'regulatory',     label: 'Regulatory & Policy',        domain: 'RISK & RESILIENCE' },
  { id: 'supplychain',    label: 'Supply Chain & Operational', domain: 'RISK & RESILIENCE' },
  { id: 'cyber',          label: 'Cybersecurity & Threats',    domain: 'RISK & RESILIENCE' },
  { id: 'media',          label: 'Media & Reputation',         domain: 'RISK & RESILIENCE' },
  { id: 'geopolitical',   label: 'Geopolitical & Macro',       domain: 'RISK & RESILIENCE' },
  { id: 'economic',       label: 'Economic Indicators',        domain: 'RISK & RESILIENCE' },
  { id: 'brand_reputation', label: 'Brand & Reputation',      domain: 'RISK & RESILIENCE' },
  { id: 'ai_governance',  label: 'AI Governance',              domain: 'RISK & RESILIENCE' },
  // TRANSFORMATION
  { id: 'customer',       label: 'Customer Sentiment',         domain: 'TRANSFORMATION' },
  { id: 'talent',         label: 'Talent & Workforce',         domain: 'TRANSFORMATION' },
  { id: 'esg',            label: 'ESG & Sustainability',       domain: 'TRANSFORMATION' },
  { id: 'behavior',       label: 'Customer Behavior',          domain: 'TRANSFORMATION' },
  { id: 'execution',      label: 'Internal Execution',         domain: 'TRANSFORMATION' },
  { id: 'operational',    label: 'Operational Excellence',     domain: 'TRANSFORMATION' },
];

const METRIC_TYPES = [
  { value: 'percentage', label: 'Percentage (%)' },
  { value: 'count',      label: 'Count / Volume' },
  { value: 'currency',   label: 'Currency ($)' },
  { value: 'score',      label: 'Score (0–100)' },
  { value: 'boolean',    label: 'Yes / No' },
  { value: 'trend',      label: 'Trend (rising / falling)' },
];

type CustomDataPointDef = {
  id: string;
  name: string;
  description: string;
  metricType: string;
  condition: string;
};

const INIT = {
  name: '', triggerDomain: '', triggerCondition: '', industry: '', riskThreshold: 'HIGH',
  immediatePrimary: { title: '', name: '' },
  immediateSecondary: { title: '', name: '' },
  secondaryPrimary: { title: '', name: '' },
  followUpPrimary: { title: '', name: '' },
  immediateTasks: mkTasks(3),
  secondaryTasks: mkTasks(3),
  followUpTasks: mkTasks(3),
  boardNotification: '',
  stakeholderAlert: '',
  hasExternalPartners: false,
  externalPartnersText: '',
  hasPublicStatement: false,
  publicStatementText: '',
  externalSignals: [] as string[],
  internalSystems: [] as string[],
  monitoringCadence: '15',
  budgetLow: '', budgetMedium: '',
  budgetHigh: '', budgetHighApprover: '',
  budgetCritical: '', budgetCriticalApprover: '',
  authorizerTitle: '', authorizerName: '',
  executorTitle: '', executorName: '',
  observers: [{ title: '', name: '' }],
  overrideTitle: '', overrideName: '',
  protocolVersion: '1.0',
  approvalPolicy: 'single',
  reviewCadence: 'quarterly',
  changeSummary: '',
  rollbackPlan: '',
  // Step 7: Signal Coverage & Readiness
  linkedSignalIds:     [] as string[],
  mandatorySignalIds:  [] as string[],
  readinessMode:       'both' as 'percentage' | 'mandatory' | 'both',
  readinessPct:        80,
  customDataPointDefs: [] as CustomDataPointDef[],
  customFields: {
    identity:  [] as CustomField[],
    owners:    [] as CustomField[],
    tasks:     [] as CustomField[],
    comms:     [] as CustomField[],
    budget:    [] as CustomField[],
    authority: [] as CustomField[],
    signals:   [] as CustomField[],
  },
};

type Data = typeof INIT;

// ── Per-step validation ───────────────────────────────────────────────────────

function getStepErrors(step: number, data: Data): string[] {
  switch (step) {
    case 0:
      return [
        !data.name && 'Protocol name is required',
        !data.triggerDomain && 'Strategic domain is required',
        !data.triggerCondition && 'Trigger condition is required (be specific — vague triggers create hesitation)',
      ].filter(Boolean) as string[];
    case 1:
      return [
        !data.immediatePrimary.title && 'Immediate phase: primary owner title is required',
        !data.secondaryPrimary.title && 'Secondary phase: primary owner is required',
      ].filter(Boolean) as string[];
    case 2: {
      const immediateCount = data.immediateTasks.filter(t => t.description).length;
      return [
        immediateCount === 0 && 'At least one IMMEDIATE task is required (0–12 minutes)',
      ].filter(Boolean) as string[];
    }
    case 3:
      return [];
    case 4:
      return [];
    case 5:
      return [
        !data.authorizerTitle && 'Authorizer title is required',
      ].filter(Boolean) as string[];
    case 6:
      return [];
    default:
      return [];
  }
}

// ── Scorecard computation ─────────────────────────────────────────────────────

function computeScorecard(data: Data) {
  const taskCount =
    data.immediateTasks.filter(t => t.description).length +
    data.secondaryTasks.filter(t => t.description).length +
    data.followUpTasks.filter(t => t.description).length;
  const ownerCount = [data.immediatePrimary, data.secondaryPrimary, data.followUpPrimary].filter(o => o.title).length;
  const budgetCount = [data.budgetLow, data.budgetMedium, data.budgetHigh, data.budgetCritical].filter(Boolean).length;
  const depth = Math.min(100, Math.round(
    taskCount * 7 + ownerCount * 8 + budgetCount * 5 +
    (data.authorizerTitle ? 10 : 0) + (data.overrideTitle ? 5 : 0) +
    (data.triggerCondition.length > 80 ? 10 : 0)
  ));

  const extCount = data.externalSignals.length;
  const intCount = data.internalSystems.length;
  const cadenceBonus = data.monitoringCadence === '5' ? 15 : data.monitoringCadence === '15' ? 10 : 5;
  const linkedBonus = data.linkedSignalIds.length * 4;
  const mandatoryBonus = data.mandatorySignalIds.length * 3;
  const customDpBonus = data.customDataPointDefs.length * 5;
  const breadth = Math.min(100, Math.round(extCount * 6 + intCount * 6 + cadenceBonus + linkedBonus + mandatoryBonus + customDpBonus + (data.triggerCondition.length > 50 ? 10 : 0)));

  const hasBoard = data.boardNotification.length > 50 ? 25 : 0;
  const hasAlert = data.stakeholderAlert.length > 50 ? 25 : 0;
  const hasExt = data.hasExternalPartners ? 15 : 0;
  const hasPublic = data.hasPublicStatement ? 15 : 0;
  const customCount = Object.values(data.customFields).flat().length;
  const intuitiveness = Math.min(100, hasBoard + hasAlert + hasExt + hasPublic + customCount * 5 + (data.industry ? 10 : 0));

  const appPolicyScore = data.approvalPolicy === 'board' ? 30 : data.approvalPolicy === 'dual' ? 20 : 10;
  const reviewScore = data.reviewCadence === 'monthly' ? 25 : data.reviewCadence === 'quarterly' ? 20 : 15;
  const observerCount = data.observers.filter(o => o.name).length;
  const enterprise = Math.min(100, Math.round(
    appPolicyScore + reviewScore + observerCount * 8 +
    (data.protocolVersion ? 10 : 0) + (data.changeSummary ? 10 : 0) + (data.rollbackPlan ? 10 : 0)
  ));

  return { depth, breadth, intuitiveness, enterprise };
}

function getScoreLabel(score: number): { label: string; color: string } {
  if (score >= 80) return { label: 'Strong', color: TEAL };
  if (score >= 55) return { label: 'Progressing', color: '#D97706' };
  return { label: 'Needs work', color: '#DC2626' };
}

// ── Styles ────────────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', border: `1px solid ${BORDER}`,
  borderRadius: '0.15rem', fontSize: 14, fontWeight: 500,
  outline: 'none', background: '#fff', color: NAVY, fontFamily: 'inherit',
};

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
  textTransform: 'uppercase', color: MUTED, marginBottom: 6,
};

// ── Shared UI components ──────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function OwnerRow({ label, value, onChange }: { label: string; value: { title: string; name: string }; onChange: (k: 'title' | 'name', v: string) => void }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={labelStyle}>{label}</label>
      <div style={{ display: 'flex', gap: 10 }}>
        <input style={{ ...inputStyle, flex: '0 0 200px' }} placeholder="Title (e.g., CISO)" value={value.title} onChange={e => onChange('title', e.target.value)} />
        <input style={{ ...inputStyle, flex: 1 }} placeholder="Full Name" value={value.name} onChange={e => onChange('name', e.target.value)} />
      </div>
    </div>
  );
}

function PhaseHeader({ label, timing, color }: { label: string; timing: string; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, marginTop: 28 }}>
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color }}>{label}</div>
        <div style={{ fontSize: 11, color: MUTED }}>{timing}</div>
      </div>
      <div style={{ flex: 1, height: 1, background: BORDER }} />
    </div>
  );
}

function ExampleCard({ step }: { step: typeof STEPS[0] }) {
  return (
    <div style={{ background: 'rgba(201,168,76,0.08)', border: `1px solid rgba(201,168,76,0.25)`, borderRadius: '0.15rem', padding: '14px 16px', marginTop: 24 }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: GOLD, marginBottom: 8 }}>{step.example.label}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 4 }}>{step.example.name}</div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 3 }}>{step.example.meta}</div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>{step.example.detail}</div>
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)} style={{ width: 40, height: 22, borderRadius: 11, background: checked ? TEAL : BORDER, border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
      <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: checked ? 21 : 3, transition: 'left 0.2s' }} />
    </button>
  );
}

// ── Validation banner ─────────────────────────────────────────────────────────

function ValidationBanner({ errors }: { errors: string[] }) {
  if (errors.length === 0) return null;
  return (
    <div style={{ background: '#FFF8F0', border: `1px solid rgba(217,119,6,0.3)`, borderRadius: '0.15rem', padding: '12px 16px', marginBottom: 24 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#D97706', marginBottom: 8 }}>
        Complete before continuing
      </div>
      {errors.map((e, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
          <AlertTriangle size={12} color="#D97706" style={{ marginTop: 2, flexShrink: 0 }} />
          <span style={{ fontSize: 13, color: '#92400E' }}>{e}</span>
        </div>
      ))}
    </div>
  );
}

// ── Quick-start templates ─────────────────────────────────────────────────────

function TemplateSelector({ onSelect }: { onSelect: (t: typeof TEMPLATES[0]) => void }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: MUTED }}>
          Quick-start templates
        </div>
        <div style={{ flex: 1, height: 1, background: BORDER }} />
        <div style={{ fontSize: 11, color: MUTED, fontStyle: 'italic' }}>or build from scratch below</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
        {TEMPLATES.map(t => {
          const TIcon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => onSelect(t)}
              style={{
                padding: '14px 16px', borderRadius: '0.15rem', border: `1.5px solid ${BORDER}`,
                background: '#fff', cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.15s', display: 'flex', flexDirection: 'column', gap: 6,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = GOLD; (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.04)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = BORDER; (e.currentTarget as HTMLElement).style.background = '#fff'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <TIcon size={14} color={GOLD} />
                <span style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>{t.name}</span>
              </div>
              <div style={{ fontSize: 11, color: MUTED }}>{t.desc}</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 2 }}>
                <span style={{ fontSize: 10, fontWeight: 700, background: RISK_COLORS[t.risk], color: '#fff', padding: '1px 7px', borderRadius: '0.15rem' }}>{t.risk}</span>
                <span style={{ fontSize: 10, color: MUTED, background: '#F3F4F6', padding: '1px 7px', borderRadius: '0.15rem' }}>{t.domain.split(' ')[0]}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Custom fields ─────────────────────────────────────────────────────────────

type CustomField = {
  id: string; label: string;
  type: 'text' | 'number' | 'date' | 'yesno' | 'dropdown';
  options: string; required: boolean;
};

const FIELD_TYPES = [
  { value: 'text', label: 'Text' }, { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' }, { value: 'yesno', label: 'Yes / No' },
  { value: 'dropdown', label: 'Dropdown' },
];
const TYPE_LABELS: Record<string, string> = { text: 'Text', number: 'Number', date: 'Date', yesno: 'Yes / No', dropdown: 'Dropdown' };

function CustomFieldsSection({ fields, onAdd, onRemove }: { fields: CustomField[]; onAdd: (f: CustomField) => void; onRemove: (id: string) => void }) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ label: '', type: 'text', options: '', required: false });
  const handleSave = () => {
    if (!draft.label.trim()) return;
    onAdd({ id: Math.random().toString(36).slice(2), label: draft.label.trim(), type: draft.type as CustomField['type'], options: draft.options, required: draft.required });
    setDraft({ label: '', type: 'text', options: '', required: false });
    setAdding(false);
  };
  return (
    <div style={{ marginTop: 36, borderTop: `1px dashed ${BORDER}`, paddingTop: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: fields.length > 0 ? 14 : 0 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: MUTED }}>Custom Fields</div>
        <div style={{ flex: 1, height: 1, background: BORDER }} />
        {!adding && (
          <button onClick={() => setAdding(true)} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: TEAL, background: 'none', border: `1px solid ${TEAL}`, borderRadius: '0.15rem', padding: '5px 12px', cursor: 'pointer', fontWeight: 600 }}>
            <Plus size={12} /> Add field
          </button>
        )}
      </div>
      {fields.map(f => (
        <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, padding: '10px 14px', background: 'rgba(43,138,110,0.06)', border: `1px solid rgba(43,138,110,0.18)`, borderRadius: '0.15rem' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>{f.label}</span>
            <span style={{ fontSize: 11, color: MUTED, background: '#F3F4F6', padding: '2px 8px', borderRadius: '0.15rem' }}>{TYPE_LABELS[f.type]}</span>
            {f.type === 'dropdown' && f.options && <span style={{ fontSize: 11, color: MUTED }}>Options: {f.options}</span>}
          </div>
          {f.required && <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#D97706', background: '#FEF3C7', padding: '2px 7px', borderRadius: '0.15rem', flexShrink: 0 }}>Required</span>}
          <button onClick={() => onRemove(f.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: MUTED, padding: 2, flexShrink: 0 }}><X size={13} /></button>
        </div>
      ))}
      {adding && (
        <div style={{ padding: '18px', background: '#F8F6F0', border: `1px solid ${BORDER}`, borderRadius: '0.15rem', marginTop: fields.length > 0 ? 8 : 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: MUTED, marginBottom: 12 }}>New Custom Field</div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
            <input style={{ ...inputStyle, flex: '1 1 220px' }} placeholder="Field label (e.g., Regulatory Filing Reference)" value={draft.label} onChange={e => setDraft(d => ({ ...d, label: e.target.value }))} autoFocus onKeyDown={e => e.key === 'Enter' && handleSave()} />
            <select style={{ ...inputStyle, flex: '0 0 140px' }} value={draft.type} onChange={e => setDraft(d => ({ ...d, type: e.target.value }))}>
              {FIELD_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          {draft.type === 'dropdown' && <input style={{ ...inputStyle, marginBottom: 12 }} placeholder="Options (comma-separated)" value={draft.options} onChange={e => setDraft(d => ({ ...d, options: e.target.value }))} />}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Toggle checked={draft.required} onChange={v => setDraft(d => ({ ...d, required: v }))} />
              <span style={{ fontSize: 13, color: NAVY }}>Required field</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => { setAdding(false); setDraft({ label: '', type: 'text', options: '', required: false }); }} style={{ padding: '8px 16px', borderRadius: '0.15rem', border: `1px solid ${BORDER}`, background: 'none', color: MUTED, fontSize: 13, cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
              <button onClick={handleSave} disabled={!draft.label.trim()} style={{ padding: '8px 16px', borderRadius: '0.15rem', border: 'none', background: !draft.label.trim() ? '#E5E7EB' : NAVY, color: !draft.label.trim() ? MUTED : '#fff', fontWeight: 700, fontSize: 13, cursor: !draft.label.trim() ? 'not-allowed' : 'pointer' }}>Save Field</button>
            </div>
          </div>
        </div>
      )}
      {fields.length === 0 && !adding && (
        <div style={{ fontSize: 12, color: MUTED, fontStyle: 'italic', marginTop: 8 }}>Add fields specific to your organization — regulatory references, tracking IDs, approvals, contacts, or any data your team needs captured at activation.</div>
      )}
    </div>
  );
}

// ── Step components ───────────────────────────────────────────────────────────

const STEP_KEYS = ['identity', 'owners', 'tasks', 'comms', 'budget', 'authority', 'signals'] as const;
type StepKey = typeof STEP_KEYS[number];

function Step1({ data, update, onTemplate }: { data: Data; update: (f: string, v: any) => void; onTemplate: (t: typeof TEMPLATES[0]) => void }) {
  return (
    <>
      <TemplateSelector onSelect={onTemplate} />
      <Field label="Protocol Name *">
        <input style={inputStyle} placeholder="e.g., Ransomware Response — Enterprise Systems" value={data.name} onChange={e => update('name', e.target.value)} />
      </Field>
      <Field label="Strategic Domain *">
        <select style={inputStyle} value={data.triggerDomain} onChange={e => update('triggerDomain', e.target.value)}>
          <option value="">Select domain</option>
          {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </Field>
      <Field label="Trigger Condition *">
        <textarea style={{ ...inputStyle, minHeight: 90, resize: 'vertical' }} placeholder="Describe exactly what fires this protocol — be specific. e.g., SIEM detects unauthorized file-system encryption across two or more production servers." value={data.triggerCondition} onChange={e => update('triggerCondition', e.target.value)} />
        <div style={{ fontSize: 11, color: MUTED, marginTop: 5 }}>More specific = faster, less ambiguous execution. Vague triggers create hesitation at the moment of pressure.</div>
      </Field>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Field label="Industry Vertical">
          <select style={inputStyle} value={data.industry} onChange={e => update('industry', e.target.value)}>
            <option value="">Select industry</option>
            {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </Field>
        <Field label="Risk Threshold">
          <div style={{ display: 'flex', gap: 6 }}>
            {RISK_LEVELS.map(r => (
              <button key={r} onClick={() => update('riskThreshold', r)} style={{
                flex: 1, padding: '9px 0', borderRadius: '0.15rem', border: `1.5px solid`,
                borderColor: data.riskThreshold === r ? RISK_COLORS[r] : BORDER,
                background: data.riskThreshold === r ? RISK_COLORS[r] : '#fff',
                color: data.riskThreshold === r ? '#fff' : MUTED,
                fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', cursor: 'pointer', transition: 'all 0.15s',
              }}>{r}</button>
            ))}
          </div>
        </Field>
      </div>
      <SignalCoverageSection data={data} update={update} />
    </>
  );
}

function Step2({ data, updateNested }: { data: Data; updateNested: (f: string, k: string, v: string) => void }) {
  return (
    <>
      <PhaseHeader label="Immediate Phase" timing="Minutes 0 – 12" color={GOLD} />
      <OwnerRow label="Primary Owner *" value={data.immediatePrimary} onChange={(k, v) => updateNested('immediatePrimary', k, v)} />
      <OwnerRow label="Secondary Owner (optional)" value={data.immediateSecondary} onChange={(k, v) => updateNested('immediateSecondary', k, v)} />
      <PhaseHeader label="Secondary Phase" timing="Hours 1 – 4" color={TEAL} />
      <OwnerRow label="Primary Owner *" value={data.secondaryPrimary} onChange={(k, v) => updateNested('secondaryPrimary', k, v)} />
      <PhaseHeader label="Follow-Up Phase" timing="Days 1 – 5" color={MUTED} />
      <OwnerRow label="Primary Owner" value={data.followUpPrimary} onChange={(k, v) => updateNested('followUpPrimary', k, v)} />
    </>
  );
}

function TaskEditor({ tasks, updateTask, addTask, phaseLabel, timing, color }: {
  tasks: { description: string; assignedTo: string }[];
  updateTask: (idx: number, k: string, v: string) => void;
  addTask: () => void;
  phaseLabel: string; timing: string; color: string;
}) {
  return (
    <div style={{ marginBottom: 8 }}>
      <PhaseHeader label={phaseLabel} timing={timing} color={color} />
      {tasks.map((t, i) => (
        <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
          <div style={{ paddingTop: 10, fontSize: 11, fontWeight: 700, color: MUTED, width: 20, textAlign: 'right', flexShrink: 0 }}>{i + 1}</div>
          <input style={{ ...inputStyle, flex: 2 }} placeholder="Task description" value={t.description} onChange={e => updateTask(i, 'description', e.target.value)} />
          <input style={{ ...inputStyle, flex: 1 }} placeholder="Assigned to" value={t.assignedTo} onChange={e => updateTask(i, 'assignedTo', e.target.value)} />
        </div>
      ))}
      {tasks.length < 5 && (
        <button onClick={addTask} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: TEAL, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, padding: '4px 0' }}>
          <Plus size={14} /> Add task
        </button>
      )}
    </div>
  );
}

function Step3({ data, updateTask, addTask }: { data: Data; updateTask: (phase: string, idx: number, k: string, v: string) => void; addTask: (phase: string) => void }) {
  return (
    <>
      <TaskEditor tasks={data.immediateTasks} updateTask={(i, k, v) => updateTask('immediateTasks', i, k, v)} addTask={() => addTask('immediateTasks')} phaseLabel="Immediate Phase" timing="Minutes 0 – 12 *" color={GOLD} />
      <TaskEditor tasks={data.secondaryTasks} updateTask={(i, k, v) => updateTask('secondaryTasks', i, k, v)} addTask={() => addTask('secondaryTasks')} phaseLabel="Secondary Phase" timing="Hours 1 – 4" color={TEAL} />
      <TaskEditor tasks={data.followUpTasks} updateTask={(i, k, v) => updateTask('followUpTasks', i, k, v)} addTask={() => addTask('followUpTasks')} phaseLabel="Follow-Up Phase" timing="Days 1 – 5" color={MUTED} />
    </>
  );
}

// Signal coverage section (used in Step 4)
function SignalCoverageSection({ data, update }: { data: Data; update: (f: string, v: any) => void }) {
  const toggleSignal = (sig: string) => {
    const current = data.externalSignals;
    update('externalSignals', current.includes(sig) ? current.filter(s => s !== sig) : [...current, sig]);
  };
  const toggleSystem = (sys: string) => {
    const current = data.internalSystems;
    update('internalSystems', current.includes(sys) ? current.filter(s => s !== sys) : [...current, sys]);
  };
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <Radio size={14} color={TEAL} />
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: MUTED }}>Signal & Data Coverage</div>
        <div style={{ flex: 1, height: 1, background: BORDER }} />
      </div>
      <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.6, marginBottom: 20 }}>
        Select the data sources that should feed this protocol's trigger detection. This defines your breadth coverage — the more sources, the earlier and more accurately the trigger fires.
      </p>

      <Field label="External Signal Sources">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {EXTERNAL_SIGNALS.map(sig => {
            const active = data.externalSignals.includes(sig);
            return (
              <button key={sig} onClick={() => toggleSignal(sig)} style={{
                padding: '7px 12px', borderRadius: '0.15rem', fontSize: 12, fontWeight: 500, cursor: 'pointer',
                border: `1.5px solid ${active ? TEAL : BORDER}`,
                background: active ? 'rgba(43,138,110,0.08)' : '#fff',
                color: active ? TEAL : MUTED, transition: 'all 0.15s',
              }}>
                {active && '✓ '}{sig}
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="Internal System Connections">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {INTERNAL_SYSTEMS.map(sys => {
            const active = data.internalSystems.includes(sys);
            return (
              <button key={sys} onClick={() => toggleSystem(sys)} style={{
                padding: '7px 12px', borderRadius: '0.15rem', fontSize: 12, fontWeight: 500, cursor: 'pointer',
                border: `1.5px solid ${active ? GOLD : BORDER}`,
                background: active ? 'rgba(201,168,76,0.08)' : '#fff',
                color: active ? '#92700A' : MUTED, transition: 'all 0.15s',
              }}>
                {active && '✓ '}{sys}
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="Monitoring Cadence">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {MONITORING_CADENCES.map(c => (
            <button key={c.value} onClick={() => update('monitoringCadence', c.value)} style={{
              flex: '1 1 auto', padding: '9px 12px', borderRadius: '0.15rem', fontSize: 12, fontWeight: 600, cursor: 'pointer',
              border: `1.5px solid ${data.monitoringCadence === c.value ? NAVY : BORDER}`,
              background: data.monitoringCadence === c.value ? NAVY : '#fff',
              color: data.monitoringCadence === c.value ? '#fff' : MUTED,
              transition: 'all 0.15s', whiteSpace: 'nowrap',
            }}>{c.label}</button>
          ))}
        </div>
      </Field>
    </div>
  );
}

function Step4({ data, update }: { data: Data; update: (f: string, v: any) => void }) {
  const boardTemplate = `Board of Directors — Confidential Briefing\n\nAs of [DATE], [PROTOCOL NAME] has been activated.\n\nStatus: [CURRENT STATUS]\nEstimated resolution: [TIMELINE]\nFinancial exposure: [AMOUNT]\n\nImmediate actions taken:\n— [ACTION 1]\n— [ACTION 2]\n\nNext board update: [SCHEDULED TIME]\n\n[AUTHORIZING EXECUTIVE]`;
  const alertTemplate = `PRIORITY ALERT — [PROTOCOL NAME] ACTIVATED\n\nTo: [STAKEHOLDER GROUP]\nTime: [HH:MM]\n\n[BRIEF SITUATION DESCRIPTION]\n\nYour role: [SPECIFIC ACTION REQUIRED]\nDeadline: [TIME]\n\nProtocol Commander: [NAME, TITLE]`;
  return (
    <>
      <div>
        <Field label="Board Notification">
          <textarea style={{ ...inputStyle, minHeight: 160, resize: 'vertical', fontSize: 13, lineHeight: 1.6 }} placeholder={boardTemplate} value={data.boardNotification} onChange={e => update('boardNotification', e.target.value)} />
          <div style={{ fontSize: 11, color: MUTED, marginTop: 6 }}>Brackets indicate variables you'll fill at activation. Pre-drafting removes communication delay under pressure.</div>
        </Field>
        <Field label="Stakeholder Alert">
          <textarea style={{ ...inputStyle, minHeight: 130, resize: 'vertical', fontSize: 13, lineHeight: 1.6 }} placeholder={alertTemplate} value={data.stakeholderAlert} onChange={e => update('stakeholderAlert', e.target.value)} />
        </Field>
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <label style={{ ...labelStyle, margin: 0, flex: 1 }}>External Partner Communication</label>
            <Toggle checked={data.hasExternalPartners} onChange={v => update('hasExternalPartners', v)} />
          </div>
          {data.hasExternalPartners && (
            <textarea style={{ ...inputStyle, minHeight: 100, resize: 'vertical', fontSize: 13, lineHeight: 1.6 }} placeholder="Pre-draft your external partner briefing (vendors, suppliers, law firms, PR agencies)..." value={data.externalPartnersText} onChange={e => update('externalPartnersText', e.target.value)} />
          )}
        </div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <label style={{ ...labelStyle, margin: 0, flex: 1 }}>Public Statement</label>
            <Toggle checked={data.hasPublicStatement} onChange={v => update('hasPublicStatement', v)} />
          </div>
          {data.hasPublicStatement && (
            <textarea style={{ ...inputStyle, minHeight: 100, resize: 'vertical', fontSize: 13, lineHeight: 1.6 }} placeholder="Pre-draft your public statement template. Reviewed by Legal & PR before activation." value={data.publicStatementText} onChange={e => update('publicStatementText', e.target.value)} />
          )}
        </div>
      </div>
    </>
  );
}

function BudgetRow({ label, amount, onAmount, approver, onApprover, showApprover }: {
  label: string; amount: string; onAmount: (v: string) => void;
  approver?: string; onApprover?: (v: string) => void; showApprover?: boolean;
}) {
  return (
    <div style={{ marginBottom: 16, padding: '14px 16px', border: `1px solid ${BORDER}`, borderRadius: '0.15rem', background: '#FAFAF8' }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: MUTED, marginBottom: 10 }}>{label} Severity</div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: '0 0 auto' }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: MUTED }}>$</span>
          <input style={{ ...inputStyle, width: 140 }} placeholder="0" value={amount} onChange={e => onAmount(e.target.value)} />
          <span style={{ fontSize: 13, color: MUTED, whiteSpace: 'nowrap' }}>pre-authorized</span>
        </div>
        {showApprover && (
          <input style={{ ...inputStyle, flex: 1, minWidth: 180 }} placeholder="Approval required from (Title)" value={approver} onChange={e => onApprover && onApprover(e.target.value)} />
        )}
      </div>
    </div>
  );
}

function Step5({ data, update }: { data: Data; update: (f: string, v: any) => void }) {
  return (
    <>
      <BudgetRow label="LOW" amount={data.budgetLow} onAmount={v => update('budgetLow', v)} />
      <BudgetRow label="MEDIUM" amount={data.budgetMedium} onAmount={v => update('budgetMedium', v)} />
      <BudgetRow label="HIGH" amount={data.budgetHigh} onAmount={v => update('budgetHigh', v)} showApprover approver={data.budgetHighApprover} onApprover={v => update('budgetHighApprover', v)} />
      <BudgetRow label="CRITICAL" amount={data.budgetCritical} onAmount={v => update('budgetCritical', v)} showApprover approver={data.budgetCriticalApprover} onApprover={v => update('budgetCriticalApprover', v)} />
    </>
  );
}

// Governance section (used in Step 6)
function GovernanceSection({ data, update }: { data: Data; update: (f: string, v: any) => void }) {
  return (
    <div style={{ marginTop: 36, borderTop: `1px dashed ${BORDER}`, paddingTop: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <GitBranch size={14} color={GOLD} />
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: MUTED }}>Protocol Governance & Versioning</div>
        <div style={{ flex: 1, height: 1, background: BORDER }} />
      </div>
      <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.6, marginBottom: 24 }}>
        Enterprise readiness requires version control, approval policy, and a defined review cadence. These settings determine how the protocol is maintained and promoted to production.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <Field label="Protocol Version">
          <input style={inputStyle} placeholder="e.g., 1.0" value={data.protocolVersion} onChange={e => update('protocolVersion', e.target.value)} />
        </Field>
        <Field label="Review Cadence">
          <select style={inputStyle} value={data.reviewCadence} onChange={e => update('reviewCadence', e.target.value)}>
            {REVIEW_CADENCES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </Field>
      </div>

      <Field label="Activation Approval Policy">
        <div style={{ display: 'flex', gap: 8 }}>
          {APPROVAL_POLICIES.map(p => (
            <button key={p.value} onClick={() => update('approvalPolicy', p.value)} style={{
              flex: 1, padding: '10px 8px', borderRadius: '0.15rem', fontSize: 12, fontWeight: 600, cursor: 'pointer', textAlign: 'center',
              border: `1.5px solid ${data.approvalPolicy === p.value ? NAVY : BORDER}`,
              background: data.approvalPolicy === p.value ? NAVY : '#fff',
              color: data.approvalPolicy === p.value ? '#fff' : MUTED,
              transition: 'all 0.15s',
            }}>{p.label}</button>
          ))}
        </div>
      </Field>

      <Field label="Change Summary (what changed in this version)">
        <textarea style={{ ...inputStyle, minHeight: 80, resize: 'vertical', fontSize: 13, lineHeight: 1.5 }} placeholder="e.g., Updated IMMEDIATE task sequence to reflect new IR retainer. Added SEC notification timeline." value={data.changeSummary} onChange={e => update('changeSummary', e.target.value)} />
      </Field>

      <Field label="Rollback Plan (if activation is aborted mid-execution)">
        <textarea style={{ ...inputStyle, minHeight: 80, resize: 'vertical', fontSize: 13, lineHeight: 1.5 }} placeholder="e.g., Notify protocol commander immediately. Reverse isolated systems in sequence. Escalate to CEO for override decision." value={data.rollbackPlan} onChange={e => update('rollbackPlan', e.target.value)} />
      </Field>
    </div>
  );
}

function Step6({ data, update, updateNested }: { data: Data; update: (f: string, v: any) => void; updateNested: (f: string, k: string, v: string) => void }) {
  const addObserver = () => update('observers', [...data.observers, { title: '', name: '' }]);
  const removeObserver = (i: number) => update('observers', data.observers.filter((_, idx) => idx !== i));
  const updateObserver = (i: number, k: string, v: string) =>
    update('observers', data.observers.map((o, idx) => idx === i ? { ...o, [k]: v } : o));
  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: GOLD, marginBottom: 12 }}>Authorizes Activation *</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <input style={{ ...inputStyle, flex: '0 0 200px' }} placeholder="Title (e.g., CISO)" value={data.authorizerTitle} onChange={e => update('authorizerTitle', e.target.value)} />
          <input style={{ ...inputStyle, flex: 1 }} placeholder="Full Name" value={data.authorizerName} onChange={e => update('authorizerName', e.target.value)} />
        </div>
      </div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: TEAL, marginBottom: 12 }}>Executes Response</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <input style={{ ...inputStyle, flex: '0 0 200px' }} placeholder="Title (e.g., Security Operations)" value={data.executorTitle} onChange={e => update('executorTitle', e.target.value)} />
          <input style={{ ...inputStyle, flex: 1 }} placeholder="Full Name or Team" value={data.executorName} onChange={e => update('executorName', e.target.value)} />
        </div>
      </div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: MUTED }}>Observers / Reviewers</div>
          <button onClick={addObserver} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: TEAL, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>
            <Plus size={12} /> Add
          </button>
        </div>
        {data.observers.map((o, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'center' }}>
            <input style={{ ...inputStyle, flex: '0 0 200px' }} placeholder="Title" value={o.title} onChange={e => updateObserver(i, 'title', e.target.value)} />
            <input style={{ ...inputStyle, flex: 1 }} placeholder="Full Name" value={o.name} onChange={e => updateObserver(i, 'name', e.target.value)} />
            {data.observers.length > 1 && (
              <button onClick={() => removeObserver(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: MUTED, padding: 4 }}><X size={14} /></button>
            )}
          </div>
        ))}
      </div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#DC2626', marginBottom: 12 }}>Emergency Override</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <input style={{ ...inputStyle, flex: '0 0 200px' }} placeholder="Title (e.g., CEO)" value={data.overrideTitle} onChange={e => update('overrideTitle', e.target.value)} />
          <input style={{ ...inputStyle, flex: 1 }} placeholder="Full Name" value={data.overrideName} onChange={e => update('overrideName', e.target.value)} />
        </div>
      </div>
      <GovernanceSection data={data} update={update} />
    </>
  );
}

// ── Step 7: Signal Coverage & Readiness ──────────────────────────────────────

const DOMAIN_COLORS: Record<string, string> = {
  'GROWTH & POSITIONING': '#2B8A6E',
  'RISK & RESILIENCE':    '#D97706',
  'TRANSFORMATION':       '#0A0F2E',
};

function Step7({ data, update }: { data: Data; update: (f: string, v: any) => void }) {
  const [newDp, setNewDp] = useState<Omit<CustomDataPointDef, 'id'>>({ name: '', description: '', metricType: 'percentage', condition: '' });
  const [showDpForm, setShowDpForm] = useState(false);

  const toggleSignal = (id: string) => {
    const linked = data.linkedSignalIds.includes(id)
      ? data.linkedSignalIds.filter(s => s !== id)
      : [...data.linkedSignalIds, id];
    const mandatory = data.mandatorySignalIds.filter(s => linked.includes(s));
    update('linkedSignalIds', linked);
    update('mandatorySignalIds', mandatory);
  };

  const toggleMandatory = (id: string) => {
    const mandatory = data.mandatorySignalIds.includes(id)
      ? data.mandatorySignalIds.filter(s => s !== id)
      : [...data.mandatorySignalIds, id];
    update('mandatorySignalIds', mandatory);
  };

  const addCustomDp = () => {
    if (!newDp.name) return;
    update('customDataPointDefs', [...data.customDataPointDefs, { ...newDp, id: crypto.randomUUID() }]);
    setNewDp({ name: '', description: '', metricType: 'percentage', condition: '' });
    setShowDpForm(false);
  };

  const removeDp = (id: string) => update('customDataPointDefs', data.customDataPointDefs.filter(d => d.id !== id));

  const domains = [...new Set(SIGNAL_CATEGORIES.map(c => c.domain))];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      {/* ── 1. Signal category selection ────────────────────────────────── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: MUTED }}>Signal Categories</div>
            <div style={{ fontSize: 12, color: MUTED, marginTop: 3 }}>Choose which live signal categories feed this protocol's readiness determination.</div>
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: TEAL }}>{data.linkedSignalIds.length} selected</div>
        </div>

        {domains.map(domain => (
          <div key={domain} style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: DOMAIN_COLORS[domain] ?? MUTED, marginBottom: 8 }}>
              {domain}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 8 }}>
              {SIGNAL_CATEGORIES.filter(c => c.domain === domain).map(cat => {
                const isLinked    = data.linkedSignalIds.includes(cat.id);
                const isMandatory = data.mandatorySignalIds.includes(cat.id);
                return (
                  <div
                    key={cat.id}
                    style={{
                      border: `1.5px solid ${isLinked ? (isMandatory ? '#DC2626' : TEAL) : BORDER}`,
                      borderRadius: '0.15rem',
                      padding: '10px 12px',
                      background: isLinked ? (isMandatory ? '#FFF5F5' : 'rgba(43,138,110,0.05)') : '#fff',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isLinked ? 8 : 0 }}>
                      <button
                        onClick={() => toggleSignal(cat.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', padding: 0, flex: 1, textAlign: 'left' }}
                      >
                        <div style={{
                          width: 16, height: 16, borderRadius: '0.15rem', flexShrink: 0,
                          background: isLinked ? TEAL : '#fff',
                          border: `1.5px solid ${isLinked ? TEAL : BORDER}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {isLinked && <CheckCircle2 size={10} color="#fff" />}
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: NAVY }}>{cat.label}</span>
                      </button>
                    </div>
                    {isLinked && (
                      <button
                        onClick={() => toggleMandatory(cat.id)}
                        style={{
                          fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                          padding: '2px 8px', borderRadius: '0.15rem', border: 'none', cursor: 'pointer',
                          background: isMandatory ? '#DC2626' : '#F0EDE4',
                          color: isMandatory ? '#fff' : MUTED,
                          transition: 'all 0.15s',
                        }}
                      >
                        {isMandatory ? '★ MUST-HAVE' : '☆ Mark as must-have'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ── 2. Readiness mode ────────────────────────────────────────────── */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: MUTED, marginBottom: 6 }}>When should this protocol show as ready?</div>
        <div style={{ fontSize: 12, color: MUTED, marginBottom: 14 }}>
          This determines when the system marks the protocol staged and ready to execute.
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {([
            { id: 'percentage' as const, label: 'Meets a Percentage', desc: 'Ready when X% of linked signal categories match.' },
            { id: 'mandatory' as const,  label: 'All Must-Have Fire', desc: 'Ready only when every must-have signal fires.' },
            { id: 'both' as const,       label: 'Either (Recommended)', desc: 'Ready on percentage OR when all must-haves fire.' },
          ]).map(mode => (
            <button
              key={mode.id}
              onClick={() => update('readinessMode', mode.id)}
              style={{
                textAlign: 'left', padding: '14px 16px',
                border: `2px solid ${data.readinessMode === mode.id ? NAVY : BORDER}`,
                borderRadius: '0.15rem',
                background: data.readinessMode === mode.id ? NAVY : '#fff',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4, color: data.readinessMode === mode.id ? GOLD : NAVY }}>{mode.label}</div>
              <div style={{ fontSize: 11, color: data.readinessMode === mode.id ? 'rgba(255,255,255,0.6)' : MUTED }}>{mode.desc}</div>
            </button>
          ))}
        </div>

        {(data.readinessMode === 'percentage' || data.readinessMode === 'both') && (
          <div style={{ marginTop: 16, padding: '16px 20px', background: '#F8F7F4', border: `1px solid ${BORDER}`, borderRadius: '0.15rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: MUTED, whiteSpace: 'nowrap' }}>Readiness Threshold</span>
              <input
                type="range" min={10} max={100}
                value={data.readinessPct}
                onChange={e => update('readinessPct', parseInt(e.target.value))}
                style={{ flex: 1, accentColor: TEAL }}
              />
              <span style={{ fontSize: 22, fontWeight: 900, color: TEAL, width: 52, textAlign: 'right' }}>{data.readinessPct}%</span>
            </div>
            <div style={{ fontSize: 11, color: MUTED, marginTop: 6 }}>
              Protocol is staged and ready when ≥ {data.readinessPct}% of its linked signal categories are active.
            </div>
          </div>
        )}
      </div>

      {/* ── 3. Custom data points ─────────────────────────────────────────── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: MUTED }}>Custom Data Points</div>
            <div style={{ fontSize: 12, color: MUTED, marginTop: 3 }}>
              Define your own signals that aren't in the 20 standard categories — industry-specific metrics, internal KPIs, or proprietary triggers.
            </div>
          </div>
          <button
            onClick={() => setShowDpForm(v => !v)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: TEAL, background: 'rgba(43,138,110,0.08)', border: `1px solid ${TEAL}`, borderRadius: '0.15rem', padding: '6px 12px', cursor: 'pointer' }}
          >
            <Plus size={12} /> Add Custom Data Point
          </button>
        </div>

        {showDpForm && (
          <div style={{ padding: '16px 18px', background: '#F8F7F4', border: `1.5px solid ${TEAL}`, borderRadius: '0.15rem', marginBottom: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
              <div>
                <label style={labelStyle}>Data Point Name *</label>
                <input style={inputStyle} placeholder='e.g. "NPS drops below 30"' value={newDp.name} onChange={e => setNewDp(d => ({ ...d, name: e.target.value }))} />
              </div>
              <div>
                <label style={labelStyle}>Metric Type</label>
                <select style={inputStyle} value={newDp.metricType} onChange={e => setNewDp(d => ({ ...d, metricType: e.target.value }))}>
                  {METRIC_TYPES.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={labelStyle}>Description</label>
              <input style={inputStyle} placeholder='What does this data point measure? Where does the data come from?' value={newDp.description} onChange={e => setNewDp(d => ({ ...d, description: e.target.value }))} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle}>Trigger Condition</label>
              <input style={inputStyle} placeholder='e.g. "Value drops below 30 for 2 consecutive readings"' value={newDp.condition} onChange={e => setNewDp(d => ({ ...d, condition: e.target.value }))} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={addCustomDp} disabled={!newDp.name} style={{ fontSize: 12, fontWeight: 700, padding: '8px 20px', background: newDp.name ? NAVY : '#ccc', color: '#fff', border: 'none', borderRadius: '0.15rem', cursor: newDp.name ? 'pointer' : 'not-allowed' }}>
                Add Data Point
              </button>
              <button onClick={() => setShowDpForm(false)} style={{ fontSize: 12, color: MUTED, background: 'none', border: 'none', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {data.customDataPointDefs.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {data.customDataPointDefs.map(dp => (
              <div key={dp.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 14px', border: `1px solid ${BORDER}`, borderRadius: '0.15rem', background: '#fff' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: NAVY }}>{dp.name}</span>
                    <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: TEAL, background: 'rgba(43,138,110,0.1)', padding: '1px 6px', borderRadius: '0.15rem' }}>{dp.metricType}</span>
                  </div>
                  {dp.description && <div style={{ fontSize: 12, color: MUTED }}>{dp.description}</div>}
                  {dp.condition && <div style={{ fontSize: 11, color: '#D97706', marginTop: 4 }}>Fires when: {dp.condition}</div>}
                </div>
                <button onClick={() => removeDp(dp.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: MUTED, padding: 4, flexShrink: 0 }}>
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {data.customDataPointDefs.length === 0 && !showDpForm && (
          <div style={{ padding: '16px 18px', border: `1px dashed ${BORDER}`, borderRadius: '0.15rem', fontSize: 12, color: MUTED, textAlign: 'center' }}>
            No custom data points yet. Add your own industry-specific signals.
          </div>
        )}
      </div>

      {/* ── Summary ──────────────────────────────────────────────────────── */}
      {(data.linkedSignalIds.length > 0 || data.customDataPointDefs.length > 0) && (
        <div style={{ padding: '14px 18px', borderLeft: `4px solid ${NAVY}`, background: '#F8F7F4' }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: NAVY, marginBottom: 6 }}>
            This protocol will be ready when:
          </div>
          {data.readinessMode === 'percentage' && (
            <div style={{ fontSize: 13, color: NAVY }}>≥ {data.readinessPct}% of {data.linkedSignalIds.length} linked signal categories are active</div>
          )}
          {data.readinessMode === 'mandatory' && (
            <div style={{ fontSize: 13, color: NAVY }}>All {data.mandatorySignalIds.length} must-have signal{data.mandatorySignalIds.length !== 1 ? 's' : ''} fire simultaneously</div>
          )}
          {data.readinessMode === 'both' && (
            <div style={{ fontSize: 13, color: NAVY }}>
              ≥ {data.readinessPct}% of linked signals active <strong>OR</strong> all {data.mandatorySignalIds.length} must-haves fire — whichever comes first
            </div>
          )}
          {data.customDataPointDefs.length > 0 && (
            <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>+ {data.customDataPointDefs.length} custom data point{data.customDataPointDefs.length !== 1 ? 's' : ''} monitored</div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Readiness Scorecard ───────────────────────────────────────────────────────

function ScoreBar({ label, score, icon: Icon }: { label: string; score: number; icon: any }) {
  const { label: scoreLabel, color } = getScoreLabel(score);
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon size={13} color={color} />
          <span style={{ fontSize: 12, fontWeight: 700, color: NAVY }}>{label}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color, background: `${color}18`, padding: '1px 8px', borderRadius: '0.15rem' }}>{scoreLabel}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: NAVY, width: 36, textAlign: 'right' }}>{score}</span>
        </div>
      </div>
      <div style={{ height: 6, background: '#F0EDE4', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: 3, transition: 'width 0.6s ease' }} />
      </div>
    </div>
  );
}

function ReadinessScorecard({ data }: { data: Data }) {
  const scores = computeScorecard(data);
  const overall = Math.round((scores.depth + scores.breadth + scores.intuitiveness + scores.enterprise) / 4);
  const { label: overallLabel, color: overallColor } = getScoreLabel(overall);

  return (
    <div style={{ marginBottom: 28, padding: '22px 24px', border: `1.5px solid ${BORDER}`, borderRadius: '0.15rem', background: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <BarChart2 size={16} color={GOLD} />
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTED }}>Protocol Readiness Scorecard</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: overallColor, lineHeight: 1 }}>{overall}</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: overallColor }}>{overallLabel}</div>
        </div>
      </div>
      <ScoreBar label="Depth — execution structure" score={scores.depth} icon={Shield} />
      <ScoreBar label="Breadth — signal & data coverage" score={scores.breadth} icon={Radio} />
      <ScoreBar label="Intuitiveness — comms & clarity" score={scores.intuitiveness} icon={MessageSquare} />
      <ScoreBar label="Enterprise Readiness — governance" score={scores.enterprise} icon={Lock} />
      <div style={{ marginTop: 16, padding: '10px 14px', background: '#F8F6F0', borderRadius: '0.15rem', fontSize: 12, color: MUTED, lineHeight: 1.6 }}>
        {overall >= 80
          ? 'This protocol meets enterprise readiness standards. It is ready to be submitted for approval and promoted to production.'
          : overall >= 55
          ? 'Good progress. Strengthen the lower-scoring dimensions before submitting for production approval.'
          : 'Continue building out each dimension. Use the quick-start templates or review the From the 180 examples in the sidebar for guidance.'}
      </div>
    </div>
  );
}

// ── Trigger Sandbox ───────────────────────────────────────────────────────────

function TriggerSandbox({ data }: { data: Data }) {
  const [signalStrength, setSignalStrength] = useState<'low' | 'medium' | 'high' | 'critical'>('high');
  const [showResult, setShowResult] = useState(false);

  const taskCount = data.immediateTasks.filter(t => t.description).length +
    data.secondaryTasks.filter(t => t.description).length +
    data.followUpTasks.filter(t => t.description).length;

  const ownerCount = [data.immediatePrimary, data.secondaryPrimary, data.followUpPrimary].filter(o => o.title).length;
  const hasAuth = !!data.authorizerTitle;
  const hasBudget = !!(data.budgetHigh || data.budgetCritical);
  const hasComms = !!(data.boardNotification || data.stakeholderAlert);

  const strengthMultiplier = { low: 1.8, medium: 1.3, high: 1.0, critical: 0.85 }[signalStrength];
  const baseMinutes = Math.max(12, Math.round((taskCount > 0 ? 12 : 30) * strengthMultiplier));
  const completionPenalty = (!hasAuth ? 8 : 0) + (!hasBudget ? 5 : 0) + (!hasComms ? 5 : 0) + (ownerCount < 2 ? 4 : 0);
  const estimatedMinutes = baseMinutes + completionPenalty;

  const blockers = [
    !hasAuth && 'No authorizer defined — execution cannot start without executive authorization',
    !hasBudget && 'No budget pre-authorized — financial decisions will block execution under pressure',
    !hasComms && 'No communications pre-drafted — stakeholder notification will be delayed',
    ownerCount < 2 && 'Less than 2 phase owners assigned — coverage gaps create coordination delays',
    taskCount === 0 && 'No tasks defined — nothing will execute when trigger fires',
  ].filter(Boolean) as string[];

  const isReady = blockers.length === 0;

  return (
    <div style={{ marginBottom: 28, padding: '22px 24px', border: `1.5px solid rgba(43,138,110,0.3)`, borderRadius: '0.15rem', background: 'rgba(43,138,110,0.03)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        <Play size={16} color={TEAL} />
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTED }}>Trigger Sandbox — Simulate Before Going Live</div>
      </div>
      <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.6, marginBottom: 20 }}>
        Simulate how this protocol responds under different signal conditions. Identifies blockers before you activate in production.
      </p>

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: MUTED, marginBottom: 10 }}>Signal Strength</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['low', 'medium', 'high', 'critical'] as const).map(s => (
            <button key={s} onClick={() => { setSignalStrength(s); setShowResult(false); }} style={{
              flex: 1, padding: '8px 0', borderRadius: '0.15rem', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', cursor: 'pointer',
              border: `1.5px solid ${signalStrength === s ? RISK_COLORS[s.toUpperCase()] : BORDER}`,
              background: signalStrength === s ? RISK_COLORS[s.toUpperCase()] : '#fff',
              color: signalStrength === s ? '#fff' : MUTED, transition: 'all 0.15s',
            }}>{s}</button>
          ))}
        </div>
      </div>

      <button onClick={() => setShowResult(true)} style={{ width: '100%', padding: '11px 0', borderRadius: '0.15rem', border: 'none', background: NAVY, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <Zap size={14} /> Run Simulation
      </button>

      {showResult && (
        <div style={{ marginTop: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div style={{ padding: '14px 16px', background: '#fff', border: `1px solid ${BORDER}`, borderRadius: '0.15rem', textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: isReady ? TEAL : '#D97706' }}>{estimatedMinutes}</div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTED, marginTop: 2 }}>Est. Minutes</div>
            </div>
            <div style={{ padding: '14px 16px', background: '#fff', border: `1px solid ${BORDER}`, borderRadius: '0.15rem', textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: NAVY }}>{taskCount}</div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTED, marginTop: 2 }}>Tasks Staged</div>
            </div>
            <div style={{ padding: '14px 16px', background: '#fff', border: `1px solid ${BORDER}`, borderRadius: '0.15rem', textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: blockers.length === 0 ? TEAL : '#DC2626' }}>{blockers.length}</div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTED, marginTop: 2 }}>Blockers</div>
            </div>
          </div>

          {blockers.length > 0 ? (
            <div style={{ padding: '14px 16px', background: '#FFF8F0', border: `1px solid rgba(217,119,6,0.3)`, borderRadius: '0.15rem' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#D97706', marginBottom: 10 }}>Blockers to resolve before production</div>
              {blockers.map((b, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                  <AlertTriangle size={12} color="#D97706" style={{ marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: '#92400E' }}>{b}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '14px 16px', background: 'rgba(43,138,110,0.08)', border: `1px solid rgba(43,138,110,0.25)`, borderRadius: '0.15rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={16} color={TEAL} />
                <span style={{ fontSize: 13, fontWeight: 600, color: TEAL }}>Protocol is sandbox-clear. No blockers detected. Ready to submit for approval.</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Protocol Saved — rich success screen ──────────────────────────────────────

interface SavedCategoryStatus { categoryId: string; categoryName: string; status: string; }

function ProtocolSavedScreen({ data, savedId }: { data: Data; savedId: string }) {
  const [, navigate] = useLocation();
  const { data: dashRaw } = useQuery<{ success: boolean; data: { categories: SavedCategoryStatus[] } }>({
    queryKey: ['/api/intelligence/dashboard'],
  });
  const categories: SavedCategoryStatus[] = dashRaw?.data?.categories ?? [];

  const linkedIds: string[] = data.linkedSignalIds ?? [];
  const mandatoryIds: string[] = data.mandatorySignalIds ?? [];
  const threshold = data.readinessPct ?? 60;
  const mode = (data.readinessMode ?? 'both') as 'percentage' | 'mandatory' | 'both';

  const linked = categories.filter(c => linkedIds.includes(c.categoryId));
  const activeLinked = linked.filter(c => c.status !== 'inactive');
  const pctActive = linked.length > 0 ? Math.round((activeLinked.length / linked.length) * 100) : 0;
  const pctMet = pctActive >= threshold;
  const mandatory = linked.filter(c => mandatoryIds.includes(c.categoryId));
  const mandatoryAllFiring = mandatory.length > 0 && mandatory.every(c => c.status !== 'inactive');
  const readinessMet =
    mode === 'percentage' ? pctMet :
    mode === 'mandatory'  ? mandatoryAllFiring :
    pctMet || mandatoryAllFiring;

  const isReady   = linkedIds.length > 0 && readinessMet;
  const isPartial = linkedIds.length > 0 && !readinessMet && activeLinked.length > 0;
  const verdictLabel = isReady ? 'READY' : isPartial ? 'PARTIAL SIGNAL' : linkedIds.length === 0 ? 'NOT CONFIGURED' : 'NOT READY';
  const verdictColor = isReady ? TEAL : isPartial ? '#D97706' : '#9CA3AF';

  const CATEGORY_LABELS: Record<string, string> = {
    competitive:'Competitive', market:'Market', financial:'Financial', partnership:'Partnership',
    innovation:'Innovation', technology:'Technology', regulatory:'Regulatory', supplychain:'Supply Chain',
    cyber:'Cybersecurity', media:'Media', geopolitical:'Geopolitical', economic:'Economic',
    brand_reputation:'Brand & Reputation', ai_governance:'AI Governance', talent:'Talent',
    legal:'Legal', customer:'Customer', behavior:'Behavior', execution:'Execution', operational:'Operational',
  };

  return (
    <div style={{ maxWidth: 620, margin: '0 auto', padding: '48px 0' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <CheckCircle2 size={52} color={TEAL} style={{ marginBottom: 16 }} />
        <div style={{ fontSize: 26, fontWeight: 800, color: NAVY, marginBottom: 6 }}>Protocol Saved</div>
        <div style={{ fontSize: 14, color: '#6B7280' }}>{data.name} has been staged and is live in My Protocols.</div>
      </div>

      {/* Signal readiness preview */}
      <div style={{ border: `1.5px solid ${verdictColor}40`, borderRadius: '0.15rem', background: '#fff', marginBottom: 20, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid #F0EDE4`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 4 }}>
              Signal Readiness
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>
              {linkedIds.length === 0
                ? 'No signal categories configured'
                : `${activeLinked.length} of ${linked.length} signal categories currently active`}
            </div>
          </div>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
            color: verdictColor, background: `${verdictColor}14`, border: `1px solid ${verdictColor}40`,
            padding: '4px 12px', borderRadius: '0.15rem',
          }}>
            {verdictLabel}
          </div>
        </div>

        {linked.length > 0 && (
          <div style={{ padding: '14px 20px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {linked.map(cat => {
                const active = cat.status !== 'inactive';
                const isMandatory = mandatoryIds.includes(cat.categoryId);
                return (
                  <span key={cat.categoryId} style={{
                    fontSize: 10, fontWeight: 700, padding: '3px 10px',
                    borderRadius: '0.15rem',
                    background: active ? (isMandatory ? 'rgba(43,138,110,0.12)' : 'rgba(43,138,110,0.07)') : '#F3F4F6',
                    color: active ? (isMandatory ? TEAL : '#374151') : '#9CA3AF',
                    border: `1px solid ${active ? (isMandatory ? TEAL + '60' : '#E5E7EB') : '#E5E7EB'}`,
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: active ? TEAL : '#D1D5DB', flexShrink: 0, display: 'inline-block' }} />
                    {CATEGORY_LABELS[cat.categoryId] ?? cat.categoryName}
                    {isMandatory && <span style={{ color: '#D97706', fontWeight: 900, marginLeft: 2 }}>★</span>}
                  </span>
                );
              })}
            </div>
            {linked.length > 0 && (
              <div style={{ marginTop: 10, height: 3, background: '#F0EDE4', borderRadius: 2 }}>
                <div style={{ height: '100%', width: `${pctActive}%`, background: isReady ? TEAL : isPartial ? '#D97706' : '#E5E2D9', borderRadius: 2, transition: 'width 0.5s ease' }} />
              </div>
            )}
          </div>
        )}

        {linkedIds.length === 0 && (
          <div style={{ padding: '14px 20px', fontSize: 12, color: '#9CA3AF' }}>
            Add signal coverage in the Protocol Builder → Step 7 to enable live readiness monitoring.
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={() => window.location.reload()}
          style={{ padding: '11px 22px', borderRadius: '0.15rem', border: `1.5px solid ${NAVY}`, background: 'none', color: NAVY, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
        >
          Build Another Protocol
        </button>
        <button
          onClick={() => navigate('/my-protocols')}
          style={{ padding: '11px 22px', borderRadius: '0.15rem', border: `1.5px solid ${TEAL}`, background: 'none', color: TEAL, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
        >
          View in My Protocols →
        </button>
        {isReady && (
          <button
            onClick={() => navigate('/live-activation-center')}
            style={{ padding: '11px 22px', borderRadius: '0.15rem', border: 'none', background: TEAL, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Play size={12} fill="#fff" /> Activate Now
          </button>
        )}
        <Link href="/request-access">
          <button style={{ padding: '11px 22px', borderRadius: '0.15rem', border: 'none', background: GOLD, color: NAVY, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
            Apply for Founding Partner Access →
          </button>
        </Link>
      </div>
    </div>
  );
}

// ── Summary / Review ──────────────────────────────────────────────────────────

function SummaryView({ data, onSave, isPending, savedId }: { data: Data; onSave: () => void; isPending: boolean; savedId?: string }) {
  const riskColor = RISK_COLORS[data.riskThreshold] ?? NAVY;
  const allImmediate = data.immediateTasks.filter(t => t.description);
  const allSecondary = data.secondaryTasks.filter(t => t.description);
  const allFollowUp = data.followUpTasks.filter(t => t.description);

  if (savedId) {
    return <ProtocolSavedScreen data={data} savedId={savedId} />;
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 700, color: NAVY, marginBottom: 4 }}>{data.name || 'Untitled Protocol'}</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {data.triggerDomain && <span style={{ fontSize: 11, fontWeight: 700, background: '#EEF2FF', color: NAVY, padding: '3px 10px', borderRadius: '0.15rem' }}>{data.triggerDomain}</span>}
            {data.industry && <span style={{ fontSize: 11, fontWeight: 700, background: '#F0FDF4', color: TEAL, padding: '3px 10px', borderRadius: '0.15rem' }}>{data.industry}</span>}
            <span style={{ fontSize: 11, fontWeight: 700, background: riskColor, color: '#fff', padding: '3px 10px', borderRadius: '0.15rem' }}>{data.riskThreshold}</span>
            {data.protocolVersion && <span style={{ fontSize: 11, fontWeight: 700, background: '#F3F4F6', color: MUTED, padding: '3px 10px', borderRadius: '0.15rem' }}>v{data.protocolVersion}</span>}
          </div>
        </div>
      </div>

      {data.triggerCondition && (
        <div style={{ padding: '14px 18px', background: '#F8F6F0', border: `1px solid ${BORDER}`, borderRadius: '0.15rem', marginBottom: 20, fontSize: 14, color: NAVY, lineHeight: 1.6 }}>
          <span style={{ fontWeight: 700 }}>Trigger: </span>{data.triggerCondition}
        </div>
      )}

      {/* Scorecard + Sandbox */}
      <ReadinessScorecard data={data} />
      <TriggerSandbox data={data} />

      {/* Detail cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginBottom: 28 }}>
        <div style={{ padding: '16px 18px', border: `1px solid ${BORDER}`, borderRadius: '0.15rem' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: GOLD, marginBottom: 12 }}>Executive Owners</div>
          {data.immediatePrimary.name && <div style={{ fontSize: 13, marginBottom: 4 }}><span style={{ color: MUTED }}>Immediate: </span>{data.immediatePrimary.title} {data.immediatePrimary.name}</div>}
          {data.secondaryPrimary.name && <div style={{ fontSize: 13, marginBottom: 4 }}><span style={{ color: MUTED }}>Secondary: </span>{data.secondaryPrimary.title} {data.secondaryPrimary.name}</div>}
          {data.followUpPrimary.name && <div style={{ fontSize: 13 }}><span style={{ color: MUTED }}>Follow-Up: </span>{data.followUpPrimary.title} {data.followUpPrimary.name}</div>}
        </div>
        <div style={{ padding: '16px 18px', border: `1px solid ${BORDER}`, borderRadius: '0.15rem' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: TEAL, marginBottom: 12 }}>Task Sequence</div>
          <div style={{ fontSize: 13, color: MUTED, marginBottom: 4 }}>{allImmediate.length} IMMEDIATE · {allSecondary.length} SECONDARY · {allFollowUp.length} FOLLOW-UP</div>
          {allImmediate.slice(0, 2).map((t, i) => <div key={i} style={{ fontSize: 12, color: NAVY, marginBottom: 3 }}>↳ {t.description}</div>)}
          {allImmediate.length > 2 && <div style={{ fontSize: 12, color: MUTED }}>+{allImmediate.length - 2} more immediate tasks</div>}
        </div>
        <div style={{ padding: '16px 18px', border: `1px solid ${BORDER}`, borderRadius: '0.15rem' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#D97706', marginBottom: 12 }}>Budget Envelope</div>
          {data.budgetLow && <div style={{ fontSize: 13, marginBottom: 4 }}><span style={{ color: MUTED }}>LOW: </span>${data.budgetLow}</div>}
          {data.budgetMedium && <div style={{ fontSize: 13, marginBottom: 4 }}><span style={{ color: MUTED }}>MEDIUM: </span>${data.budgetMedium}</div>}
          {data.budgetHigh && <div style={{ fontSize: 13, marginBottom: 4 }}><span style={{ color: MUTED }}>HIGH: </span>${data.budgetHigh}{data.budgetHighApprover && ` + ${data.budgetHighApprover}`}</div>}
          {data.budgetCritical && <div style={{ fontSize: 13 }}><span style={{ color: MUTED }}>CRITICAL: </span>${data.budgetCritical}</div>}
        </div>
        <div style={{ padding: '16px 18px', border: `1px solid ${BORDER}`, borderRadius: '0.15rem' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: NAVY, marginBottom: 12 }}>Decision Authority</div>
          {data.authorizerName && <div style={{ fontSize: 13, marginBottom: 4 }}><span style={{ color: MUTED }}>Authorizes: </span>{data.authorizerTitle} {data.authorizerName}</div>}
          {data.executorName && <div style={{ fontSize: 13, marginBottom: 4 }}><span style={{ color: MUTED }}>Executes: </span>{data.executorTitle} {data.executorName}</div>}
          {data.observers.filter(o => o.name).length > 0 && <div style={{ fontSize: 13 }}><span style={{ color: MUTED }}>Observers: </span>{data.observers.filter(o => o.name).map(o => o.name).join(', ')}</div>}
        </div>
        {(data.externalSignals.length > 0 || data.internalSystems.length > 0) && (
          <div style={{ padding: '16px 18px', border: `1px solid ${BORDER}`, borderRadius: '0.15rem' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: TEAL, marginBottom: 12 }}>Signal Coverage</div>
            <div style={{ fontSize: 13, color: MUTED, marginBottom: 6 }}>{data.externalSignals.length} external · {data.internalSystems.length} internal · every {data.monitoringCadence} min</div>
            {data.externalSignals.slice(0, 2).map((s, i) => <div key={i} style={{ fontSize: 12, color: NAVY, marginBottom: 2 }}>↳ {s}</div>)}
            {data.externalSignals.length > 2 && <div style={{ fontSize: 12, color: MUTED }}>+{data.externalSignals.length - 2} more</div>}
          </div>
        )}
        {data.approvalPolicy && (
          <div style={{ padding: '16px 18px', border: `1px solid ${BORDER}`, borderRadius: '0.15rem' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: GOLD, marginBottom: 12 }}>Governance</div>
            <div style={{ fontSize: 13, marginBottom: 4 }}><span style={{ color: MUTED }}>Version: </span>{data.protocolVersion}</div>
            <div style={{ fontSize: 13, marginBottom: 4 }}><span style={{ color: MUTED }}>Approval: </span>{APPROVAL_POLICIES.find(p => p.value === data.approvalPolicy)?.label}</div>
            <div style={{ fontSize: 13 }}><span style={{ color: MUTED }}>Review: </span>{REVIEW_CADENCES.find(r => r.value === data.reviewCadence)?.label}</div>
          </div>
        )}
      </div>

      {/* Custom fields summary */}
      {(() => {
        const allCustom = Object.entries(data.customFields).flatMap(([stepKey, fields]) => (fields as CustomField[]).map(f => ({ ...f, stepKey })));
        if (allCustom.length === 0) return null;
        const stepLabels: Record<string, string> = { identity: 'Protocol Identity', owners: 'Executive Owners', tasks: 'Task Sequence', comms: 'Communication Chain', budget: 'Budget Envelope', authority: 'Decision Authority' };
        const byStep = Object.entries(data.customFields).filter(([, fields]) => (fields as CustomField[]).length > 0);
        return (
          <div style={{ marginBottom: 24, padding: '16px 18px', border: `1px solid rgba(43,138,110,0.2)`, borderRadius: '0.15rem', background: 'rgba(43,138,110,0.04)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: TEAL, marginBottom: 12 }}>Custom Fields — {allCustom.length} field{allCustom.length !== 1 ? 's' : ''} added</div>
            {byStep.map(([stepKey, fields]) => (
              <div key={stepKey} style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 11, color: MUTED, marginBottom: 4 }}>{stepLabels[stepKey]}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {(fields as CustomField[]).map(f => (
                    <span key={f.id} style={{ fontSize: 12, background: '#fff', border: `1px solid ${BORDER}`, borderRadius: '0.15rem', padding: '3px 10px', color: NAVY, fontWeight: 500 }}>
                      {f.label}
                      <span style={{ color: MUTED, marginLeft: 6 }}>{TYPE_LABELS[f.type]}</span>
                      {f.required && <span style={{ color: '#D97706', marginLeft: 4 }}>*</span>}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      })()}

      <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 24, display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <button onClick={onSave} disabled={isPending || !data.name || !data.triggerDomain} style={{
          padding: '14px 36px', borderRadius: '0.15rem', border: 'none',
          background: (!data.name || !data.triggerDomain) ? '#E5E7EB' : GOLD,
          color: (!data.name || !data.triggerDomain) ? MUTED : NAVY,
          fontWeight: 700, fontSize: 15, cursor: (!data.name || !data.triggerDomain) ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          {isPending ? 'Saving...' : 'Save Protocol →'}
        </button>
      </div>
      {(!data.name || !data.triggerDomain) && (
        <div style={{ textAlign: 'right', fontSize: 12, color: MUTED, marginTop: 8 }}>Protocol name and domain are required to save.</div>
      )}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function ProtocolBuilder() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Data>(INIT);
  const [savedId, setSavedId] = useState<string | undefined>(undefined);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const update = (field: string, value: any) =>
    setData(prev => ({ ...prev, [field]: value }));

  const updateNested = (field: string, key: string, value: string) =>
    setData(prev => ({ ...prev, [field]: { ...(prev as any)[field], [key]: value } }));

  const updateTask = (phase: string, idx: number, key: string, val: string) =>
    setData(prev => ({
      ...prev,
      [phase]: (prev as any)[phase].map((t: any, i: number) => i === idx ? { ...t, [key]: val } : t),
    }));

  const addTask = (phase: string) =>
    setData(prev => ({ ...prev, [phase]: [...(prev as any)[phase], { description: '', assignedTo: '' }] }));

  const addCustomField = (stepKey: StepKey, field: CustomField) =>
    setData(prev => ({ ...prev, customFields: { ...prev.customFields, [stepKey]: [...prev.customFields[stepKey], field] } }));

  const removeCustomField = (stepKey: StepKey, id: string) =>
    setData(prev => ({ ...prev, customFields: { ...prev.customFields, [stepKey]: prev.customFields[stepKey].filter(f => f.id !== id) } }));

  const applyTemplate = (t: typeof TEMPLATES[0]) => {
    setData(prev => ({
      ...prev,
      name: t.name,
      triggerDomain: t.domain,
      industry: t.industry,
      riskThreshold: t.risk,
      triggerCondition: t.triggerCondition,
      immediatePrimary: t.immediatePrimary,
      immediateSecondary: t.immediateSecondary,
      secondaryPrimary: t.secondaryPrimary,
      followUpPrimary: t.followUpPrimary,
      immediateTasks: t.immediateTasks,
      secondaryTasks: t.secondaryTasks,
      followUpTasks: t.followUpTasks,
      externalSignals: t.externalSignals,
      internalSystems: t.internalSystems,
      monitoringCadence: t.monitoringCadence,
      authorizerTitle: t.authorizerTitle,
      authorizerName: t.authorizerName,
      executorTitle: t.executorTitle,
      executorName: t.executorName,
      overrideTitle: t.overrideTitle,
      overrideName: t.overrideName,
      budgetMedium: (t as any).budgetMedium ?? '',
      budgetHigh: t.budgetHigh ?? '',
      budgetHighApprover: t.budgetHighApprover ?? '',
      budgetCritical: t.budgetCritical ?? '',
      budgetCriticalApprover: t.budgetCriticalApprover ?? '',
      approvalPolicy: t.approvalPolicy,
      reviewCadence: t.reviewCadence,
    }));
    toast({ title: `Template loaded: ${t.name}`, description: 'All fields pre-filled. Customize for your organization.' });
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: data.name,
        triggerDomain: data.triggerDomain,
        triggerCondition: data.triggerCondition,
        industry: data.industry,
        riskThreshold: data.riskThreshold.toLowerCase(),
        executiveOwners: {
          immediatePrimary: data.immediatePrimary,
          immediateSecondary: data.immediateSecondary,
          secondaryPrimary: data.secondaryPrimary,
          followUpPrimary: data.followUpPrimary,
        },
        immediateTasks: data.immediateTasks.filter(t => t.description),
        secondaryTasks: data.secondaryTasks.filter(t => t.description),
        followUpTasks: data.followUpTasks.filter(t => t.description),
        communicationChain: {
          boardNotification: data.boardNotification,
          stakeholderAlert: data.stakeholderAlert,
          externalPartners: data.hasExternalPartners ? data.externalPartnersText : null,
          publicStatement: data.hasPublicStatement ? data.publicStatementText : null,
          monitoringCoverage: {
            externalSignals: data.externalSignals,
            internalSystems: data.internalSystems,
            cadenceMinutes: data.monitoringCadence,
          },
        },
        budgetEnvelope: {
          low: data.budgetLow, medium: data.budgetMedium,
          high: { amount: data.budgetHigh, approver: data.budgetHighApprover },
          critical: { amount: data.budgetCritical, approver: data.budgetCriticalApprover },
        },
        decisionAuthority: {
          authorizer: { title: data.authorizerTitle, name: data.authorizerName },
          executor: { title: data.executorTitle, name: data.executorName },
          observers: data.observers.filter(o => o.name),
          override: { title: data.overrideTitle, name: data.overrideName },
          governance: {
            version: data.protocolVersion,
            approvalPolicy: data.approvalPolicy,
            reviewCadence: data.reviewCadence,
            changeSummary: data.changeSummary,
            rollbackPlan: data.rollbackPlan,
          },
        },
        status: 'ready',
        completedSteps: 7,
        customFields: data.customFields,
        linkedSignalIds:     data.linkedSignalIds,
        mandatorySignalIds:  data.mandatorySignalIds,
        readinessMode:       data.readinessMode,
        readinessPct:        data.readinessPct,
        customDataPointDefs: data.customDataPointDefs,
      };
      const res = await apiRequest('POST', '/api/custom-protocols', payload);
      return res;
    },
    onSuccess: (result: any) => {
      setSavedId(result?.id ?? 'saved');
      toast({ title: 'Protocol saved', description: `${data.name} is ready for activation.` });
    },
    onError: () => {
      toast({ title: 'Save failed', description: 'Please try again.', variant: 'destructive' });
    },
  });

  useEffect(() => {
    updatePageMetadata({
      title: "Protocol Builder — VaughnMartin Readiness OS",
      description: "Build a custom Readiness Protocol in 6 guided steps. Pre-stage your organization's response for any strategic situation before it presents itself.",
    });
  }, []);

  const totalSteps = STEPS.length;
  const isSummary = step === totalSteps;
  const currentStep = STEPS[step];
  const stepErrors = isSummary ? [] : getStepErrors(step, data);
  const canContinue = stepErrors.length === 0;

  const renderStepContent = () => {
    const key = STEP_KEYS[step];
    const cfProps = {
      fields: data.customFields[key] ?? [],
      onAdd: (f: CustomField) => addCustomField(key, f),
      onRemove: (id: string) => removeCustomField(key, id),
    };
    switch (step) {
      case 0: return <><Step1 data={data} update={update} onTemplate={applyTemplate} /><MicroHelp trigger="Common mistakes when defining a trigger" items={TRIGGER_COMMON_MISTAKES} /><CustomFieldsSection {...cfProps} /></>;
      case 1: return <><Step2 data={data} updateNested={updateNested} /><CustomFieldsSection {...cfProps} /></>;
      case 2: return <><Step3 data={data} updateTask={updateTask} addTask={addTask} /><CustomFieldsSection {...cfProps} /></>;
      case 3: return <><Step4 data={data} update={update} /><CustomFieldsSection {...cfProps} /></>;
      case 4: return <><Step5 data={data} update={update} /><CustomFieldsSection {...cfProps} /></>;
      case 5: return <><Step6 data={data} update={update} updateNested={updateNested} /><CustomFieldsSection {...cfProps} /></>;
      case 6: return <><Step7 data={data} update={update} /><CustomFieldsSection {...cfProps} /></>;
      default: return null;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: '"Barlow", sans-serif' }}>

      {/* ── Sidebar ── */}
      <div style={{ width: 272, background: NAVY, flexShrink: 0, display: 'flex', flexDirection: 'column', padding: '32px 24px', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
        <Link href="/">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40, cursor: 'pointer', textDecoration: 'none' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', border: `1.5px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: GOLD }}>VM</span>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.04em', color: '#fff' }}>VaughnMartin</div>
              <div style={{ fontSize: 9, letterSpacing: '0.12em', color: GOLD, textTransform: 'uppercase' }}>Readiness OS</div>
            </div>
          </div>
        </Link>

        <h1 style={{ fontSize: 10, letterSpacing: '0.12em', fontWeight: 700, textTransform: 'uppercase', color: GOLD, marginBottom: 6, margin: '0 0 6px' }}>Protocol Builder</h1>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 32, lineHeight: 1.5 }}>
          The structure of all 180 protocols. Your organization's specifics.
        </div>

        <div style={{ flex: 1 }}>
          {STEPS.map((s, i) => {
            const isActive = step === i;
            const isDone = step > i || isSummary;
            const StepIcon = s.Icon;
            const hasErrors = getStepErrors(i, data).length > 0 && step > i;
            return (
              <div key={s.id} style={{ display: 'flex', gap: 12, marginBottom: 8, alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: hasErrors ? '#DC2626' : isDone ? TEAL : isActive ? GOLD : 'rgba(255,255,255,0.1)',
                    border: `1.5px solid ${hasErrors ? '#DC2626' : isDone ? TEAL : isActive ? GOLD : 'rgba(255,255,255,0.2)'}`,
                    transition: 'all 0.2s',
                  }}>
                    {isDone && !hasErrors ? <CheckCircle2 size={14} color="#fff" /> : <StepIcon size={12} color={isActive ? NAVY : 'rgba(255,255,255,0.4)'} />}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div style={{ width: 1, height: 28, background: isDone ? TEAL : 'rgba(255,255,255,0.1)', transition: 'background 0.3s' }} />
                  )}
                </div>
                <div style={{ paddingTop: 4, paddingBottom: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: isActive ? 700 : 500, color: isActive ? '#fff' : isDone ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.35)' }}>{s.title}</div>
                  {isActive && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{s.subtitle}</div>}
                </div>
              </div>
            );
          })}

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: isSummary ? GOLD : 'rgba(255,255,255,0.1)',
              border: `1.5px solid ${isSummary ? GOLD : 'rgba(255,255,255,0.2)'}`,
            }}>
              <BookOpen size={12} color={isSummary ? NAVY : 'rgba(255,255,255,0.4)'} />
            </div>
            <div style={{ fontSize: 12, fontWeight: isSummary ? 700 : 400, color: isSummary ? '#fff' : 'rgba(255,255,255,0.35)' }}>Review & Save</div>
          </div>
        </div>

        {!isSummary && currentStep && (
          <div style={{ marginTop: 32 }}>
            <div style={{ borderTop: `1px solid rgba(255,255,255,0.08)`, paddingTop: 20 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: GOLD, marginBottom: 8 }}>Why this matters</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>{currentStep.guidance}</div>
            </div>
            <ExampleCard step={currentStep} />
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div style={{ flex: 1, background: '#FAFAF8', display: 'flex', flexDirection: 'column' }}>

        {/* Top bar */}
        <div style={{ borderBottom: `1px solid ${BORDER}`, padding: '16px 40px', display: 'flex', alignItems: 'center', gap: 16, background: '#fff' }}>
          {!isSummary ? (
            <>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: NAVY }}>{currentStep.title}</div>
                <div style={{ fontSize: 13, color: MUTED, marginTop: 2 }}>{currentStep.subtitle}</div>
              </div>
              <div style={{ fontSize: 11, color: MUTED }}>Step {step + 1} of {totalSteps}</div>
            </>
          ) : (
            <>
              <button onClick={() => setStep(totalSteps - 1)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: MUTED, fontSize: 13, fontWeight: 600 }}>
                <ArrowLeft size={14} /> Back
              </button>
              <div style={{ fontSize: 20, fontWeight: 700, color: NAVY, flex: 1 }}>Review & Save</div>
            </>
          )}
        </div>

        {/* Step content */}
        <div style={{ flex: 1, padding: '36px 40px', maxWidth: 800, width: '100%', margin: '0 auto' }}>
          {!isSummary ? (
            <>
              <ValidationBanner errors={stepErrors} />
              {renderStepContent()}

              {/* Nav buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40, paddingTop: 24, borderTop: `1px solid ${BORDER}` }}>
                <button
                  onClick={() => setStep(s => Math.max(0, s - 1))}
                  disabled={step === 0}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: '0.15rem', border: `1px solid ${BORDER}`, background: 'none', color: step === 0 ? BORDER : MUTED, fontSize: 13, fontWeight: 600, cursor: step === 0 ? 'not-allowed' : 'pointer' }}
                >
                  <ArrowLeft size={14} /> Back
                </button>
                <button
                  onClick={() => setStep(s => Math.min(totalSteps, s + 1))}
                  disabled={!canContinue}
                  title={!canContinue ? stepErrors[0] : undefined}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '10px 28px', borderRadius: '0.15rem', border: 'none',
                    background: canContinue ? NAVY : '#E5E7EB',
                    color: canContinue ? '#fff' : MUTED,
                    fontSize: 13, fontWeight: 700,
                    cursor: canContinue ? 'pointer' : 'not-allowed',
                    transition: 'all 0.15s',
                  }}
                >
                  {step === totalSteps - 1 ? 'Review Protocol' : 'Continue'} <ChevronRight size={14} />
                </button>
              </div>
            </>
          ) : (
            <SummaryView data={data} onSave={() => mutation.mutate()} isPending={mutation.isPending} savedId={savedId} />
          )}
        </div>
      </div>
    </div>
  );
}
