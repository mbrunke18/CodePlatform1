import { useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import {
  CheckCircle2, ChevronRight, Plus, X, Shield, Users, ListChecks,
  MessageSquare, Wallet, Key, ArrowLeft, BookOpen, Zap, AlertTriangle
} from 'lucide-react';

const NAVY   = '#0A0F2E';
const GOLD   = '#C9A84C';
const TEAL   = '#2B8A6E';
const IVORY  = '#F0EDE4';
const BORDER = '#E2DDD5';
const MUTED  = '#6B7280';

const DOMAINS = [
  'Growth & Positioning',
  'Risk & Resilience',
  'Transformation',
  'Regulatory & Compliance',
  'Crisis Management',
  'Technology & AI Governance',
  'Financial Response',
  'Talent & Organization',
  'Operational Excellence',
];

const INDUSTRIES = [
  'Financial Services',
  'Healthcare',
  'Energy & Utilities',
  'Manufacturing',
  'Pharmaceutical',
  'Technology',
  'Retail & Consumer',
  'Government & Public Sector',
];

const RISK_LEVELS = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

const RISK_COLORS: Record<string, string> = {
  LOW: TEAL,
  MEDIUM: '#D97706',
  HIGH: '#DC2626',
  CRITICAL: NAVY,
};

const SIGNAL_SOURCE_OPTIONS = [
  'Market News',
  'Regulatory Alerts',
  'Threat Intelligence',
  'Customer Sentiment',
  'Supply Chain Feeds',
  'Macroeconomic Signals',
];

const INTERNAL_SYSTEM_OPTIONS = [
  'ERP',
  'CRM',
  'ITSM',
  'SIEM',
  'HRIS',
  'Procurement',
];

const MONITORING_CADENCE_OPTIONS = [
  { label: '5 minutes', value: '5' },
  { label: '15 minutes', value: '15' },
  { label: '30 minutes', value: '30' },
  { label: '60 minutes', value: '60' },
];

type StarterTemplate = {
  id: string;
  label: string;
  description: string;
  defaults: {
    name: string;
    triggerDomain: string;
    triggerCondition: string;
    industry: string;
    riskThreshold: string;
    immediatePrimary: { title: string; name: string };
    secondaryPrimary: { title: string; name: string };
    followUpPrimary: { title: string; name: string };
    immediateTasks: { description: string; assignedTo: string }[];
    secondaryTasks: { description: string; assignedTo: string }[];
    followUpTasks: { description: string; assignedTo: string }[];
    signalSources: string[];
    internalSystems: string[];
  };
};

const STARTER_TEMPLATES: StarterTemplate[] = [
  {
    id: 'ransomware-critical',
    label: 'Critical Cyber Event',
    description: 'Ransomware or destructive cyber incident',
    defaults: {
      name: 'Ransomware Response — Enterprise Systems',
      triggerDomain: 'Technology & AI Governance',
      triggerCondition: 'SIEM detects encryption activity across two or more production systems with lateral movement indicators.',
      industry: 'Technology',
      riskThreshold: 'CRITICAL',
      immediatePrimary: { title: 'CISO', name: '' },
      secondaryPrimary: { title: 'General Counsel', name: '' },
      followUpPrimary: { title: 'CFO', name: '' },
      immediateTasks: [
        { description: 'Isolate affected systems and disable privileged non-essential accounts', assignedTo: 'Security Operations' },
        { description: 'Activate incident command bridge and legal hold', assignedTo: 'General Counsel' },
        { description: 'Prepare executive brief with confirmed scope', assignedTo: 'CISO' },
      ],
      secondaryTasks: [
        { description: 'Engage digital forensics partner', assignedTo: 'Legal + Security' },
        { description: 'Assess regulatory and customer notification obligations', assignedTo: 'Compliance' },
        { description: 'Stage customer and board communication paths', assignedTo: 'Communications Lead' },
      ],
      followUpTasks: [
        { description: 'Close-out report with root cause and control remediation', assignedTo: 'CISO' },
        { description: 'Board review and policy updates', assignedTo: 'CFO' },
        { description: 'Tabletop drill updates using observed gaps', assignedTo: 'PMO' },
      ],
      signalSources: ['Threat Intelligence', 'Regulatory Alerts'],
      internalSystems: ['SIEM', 'ITSM'],
    },
  },
  {
    id: 'regulatory-inquiry',
    label: 'Regulatory Inquiry',
    description: 'Formal regulator notice requiring coordinated response',
    defaults: {
      name: 'Regulatory Inquiry Response',
      triggerDomain: 'Regulatory & Compliance',
      triggerCondition: 'Regulatory inquiry or subpoena received that requires cross-functional response in under 24 hours.',
      industry: 'Financial Services',
      riskThreshold: 'HIGH',
      immediatePrimary: { title: 'Chief Compliance Officer', name: '' },
      secondaryPrimary: { title: 'General Counsel', name: '' },
      followUpPrimary: { title: 'COO', name: '' },
      immediateTasks: [
        { description: 'Open inquiry command channel and assign matter owner', assignedTo: 'Compliance' },
        { description: 'Issue legal hold and data preservation notice', assignedTo: 'Legal' },
        { description: 'Assemble initial fact package for executives', assignedTo: 'Risk Office' },
      ],
      secondaryTasks: [
        { description: 'Map impacted business units and control owners', assignedTo: 'Operations' },
        { description: 'Draft regulator response strategy and timeline', assignedTo: 'General Counsel' },
        { description: 'Stage board audit committee briefing', assignedTo: 'Corporate Secretary' },
      ],
      followUpTasks: [
        { description: 'Submit response package and evidence trail', assignedTo: 'Compliance' },
        { description: 'Document remediation commitments', assignedTo: 'COO' },
        { description: 'Update protocol based on regulator feedback', assignedTo: 'PMO' },
      ],
      signalSources: ['Regulatory Alerts', 'Market News'],
      internalSystems: ['ERP', 'Procurement'],
    },
  },
  {
    id: 'supply-chain-shock',
    label: 'Supply Chain Shock',
    description: 'Critical supplier disruption or route failure',
    defaults: {
      name: 'Supplier Disruption Response',
      triggerDomain: 'Operational Excellence',
      triggerCondition: 'Tier-1 supplier outage or logistics block creates immediate fulfillment risk within 72 hours.',
      industry: 'Manufacturing',
      riskThreshold: 'HIGH',
      immediatePrimary: { title: 'COO', name: '' },
      secondaryPrimary: { title: 'Chief Procurement Officer', name: '' },
      followUpPrimary: { title: 'Chief Revenue Officer', name: '' },
      immediateTasks: [
        { description: 'Confirm impacted SKUs and customers', assignedTo: 'Supply Chain Operations' },
        { description: 'Activate alternate supplier shortlist', assignedTo: 'Procurement' },
        { description: 'Stage customer communication cadence', assignedTo: 'Customer Success Lead' },
      ],
      secondaryTasks: [
        { description: 'Rebalance production and fulfillment priorities', assignedTo: 'Operations Planning' },
        { description: 'Authorize expedited logistics budget', assignedTo: 'Finance' },
        { description: 'Align sales commitments with revised delivery windows', assignedTo: 'Revenue Operations' },
      ],
      followUpTasks: [
        { description: 'Post-event resilience review with supplier score updates', assignedTo: 'Procurement' },
        { description: 'Capture margin impact and recovery actions', assignedTo: 'Finance' },
        { description: 'Update protocol decision thresholds', assignedTo: 'PMO' },
      ],
      signalSources: ['Supply Chain Feeds', 'Macroeconomic Signals'],
      internalSystems: ['ERP', 'CRM', 'Procurement'],
    },
  },
];

const STEPS = [
  {
    num: 1, id: 'identity', Icon: Shield,
    title: 'Protocol Identity',
    subtitle: 'Name the trigger. Define the context.',
    guidance: 'Every protocol in the 170 begins with a precisely-defined trigger. Vague triggers create hesitation; clear triggers create 12-minute execution.',
    example: { label: 'From the 170', name: 'Ransomware Response — Enterprise Systems', meta: 'Tech & AI Governance · CRITICAL', detail: 'SIEM detects unauthorized file-system encryption across production servers.' },
  },
  {
    num: 2, id: 'owners', Icon: Users,
    title: 'Executive Owners',
    subtitle: 'Pre-assign ownership before the trigger fires.',
    guidance: 'In the 170 protocols, ownership is decided before pressure — not during it. Each phase has a named owner attached before any trigger fires.',
    example: { label: 'From the 170', name: 'Ransomware Response', meta: 'IMMEDIATE: CISO (primary), General Counsel (secondary)', detail: 'SECONDARY: CFO · FOLLOW-UP: Board Chair' },
  },
  {
    num: 3, id: 'tasks', Icon: ListChecks,
    title: 'Task Sequence',
    subtitle: 'Pre-stage execution across three phases.',
    guidance: 'IMMEDIATE (0–12 min), SECONDARY (1–4 hrs), FOLLOW-UP (1–5 days). Tasks are pre-written and pre-assigned. Activation means execution — not planning.',
    example: { label: 'From the 170', name: 'IMMEDIATE: Isolate affected systems — CISO', meta: 'SECONDARY: Engage incident response firm — General Counsel', detail: 'FOLLOW-UP: Regulatory disclosure and board brief — CFO' },
  },
  {
    num: 4, id: 'comms', Icon: MessageSquare,
    title: 'Communication Chain',
    subtitle: 'Pre-draft every message before the pressure hits.',
    guidance: 'In a real trigger event, drafting communications under pressure introduces errors and delays. The 170 protocols pre-stage every message — the only variable is the date.',
    example: { label: 'From the 170', name: 'Board brief pre-drafted and updated quarterly', meta: 'Stakeholder alert fires at trigger detection — no drafting under pressure', detail: 'Public statement template reviewed by Legal & PR annually' },
  },
  {
    num: 5, id: 'budget', Icon: Wallet,
    title: 'Budget Envelope',
    subtitle: 'Pre-authorize spending before the trigger fires.',
    guidance: 'Budget approval under pressure adds hours. The 170 protocols pre-approve spending thresholds by severity — so execution starts immediately with full financial authority.',
    example: { label: 'From the 170', name: 'LOW: $250K pre-authorized', meta: 'MEDIUM: $1M pre-authorized  ·  HIGH: $5M + CFO co-sign', detail: 'CRITICAL: $15M emergency provision + Board authorization' },
  },
  {
    num: 6, id: 'authority', Icon: Key,
    title: 'Decision Authority',
    subtitle: 'Map who authorizes, executes, and observes.',
    guidance: 'In the 170 protocols, authority is never ambiguous. The authorization chain is set before the trigger — so no one asks "who needs to approve this?" during execution.',
    example: { label: 'From the 170', name: 'Authorizes: CISO', meta: 'Executes: Security Operations Team', detail: 'Observes: CFO, General Counsel, Board Chair · Override: CEO' },
  },
];

const mkTasks = (n: number) => Array.from({ length: n }, () => ({ description: '', assignedTo: '' }));

const INIT = {
  starterTemplateId: '',
  name: '', triggerDomain: '', triggerCondition: '', industry: '', riskThreshold: 'HIGH',
  signalSources: [] as string[],
  internalSystems: [] as string[],
  monitoringCadenceMinutes: '15',
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
  budgetLow: '', budgetMedium: '',
  budgetHigh: '', budgetHighApprover: '',
  budgetCritical: '', budgetCriticalApprover: '',
  authorizerTitle: '', authorizerName: '',
  executorTitle: '', executorName: '',
  observers: [{ title: '', name: '' }],
  overrideTitle: '', overrideName: '',
  protocolVersion: 'v1.0',
  changeSummary: '',
  approvalPolicy: 'single',
  reviewCadence: 'quarterly',
  rollbackPlan: '',
  lastReviewedByTitle: '',
  lastReviewedByName: '',
  testScenarioSummary: '',
  customFields: {
    identity:  [] as CustomField[],
    owners:    [] as CustomField[],
    tasks:     [] as CustomField[],
    comms:     [] as CustomField[],
    budget:    [] as CustomField[],
    authority: [] as CustomField[],
  },
};

type Data = typeof INIT;

type StepValidation = {
  isComplete: boolean;
  missing: string[];
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', border: `1px solid ${BORDER}`,
  borderRadius: '0.15rem', fontSize: 14, fontWeight: 500,
  outline: 'none', background: '#fff', color: NAVY,
  fontFamily: 'inherit',
};

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
  textTransform: 'uppercase', color: MUTED, marginBottom: 6,
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function CoveragePillGroup({
  options,
  selected,
  onToggle,
}: {
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {options.map((option) => {
        const isSelected = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => onToggle(option)}
            style={{
              borderRadius: '999px',
              border: `1px solid ${isSelected ? TEAL : BORDER}`,
              background: isSelected ? 'rgba(43,138,110,0.12)' : '#fff',
              color: isSelected ? TEAL : NAVY,
              fontSize: 12,
              fontWeight: 600,
              padding: '6px 12px',
              cursor: 'pointer',
            }}
          >
            {option}
          </button>
        );
      })}
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

function Step1({
  data,
  update,
  onApplyTemplate,
  onToggleCoverage,
}: {
  data: Data;
  update: (f: string, v: any) => void;
  onApplyTemplate: (templateId: string) => void;
  onToggleCoverage: (field: 'signalSources' | 'internalSystems', value: string) => void;
}) {
  return (
    <>
      <Field label="Quick Start Template">
        <select
          style={inputStyle}
          value={data.starterTemplateId}
          onChange={(e) => onApplyTemplate(e.target.value)}
        >
          <option value="">Start from scratch</option>
          {STARTER_TEMPLATES.map((template) => (
            <option key={template.id} value={template.id}>
              {template.label} — {template.description}
            </option>
          ))}
        </select>
        <div style={{ fontSize: 11, color: MUTED, marginTop: 6 }}>
          Templates preload ownership, tasks, and signal coverage. You can edit every field.
        </div>
      </Field>
      <Field label="Protocol Name">
        <input style={inputStyle} placeholder="e.g., Ransomware Response — Enterprise Systems" value={data.name} onChange={e => update('name', e.target.value)} />
      </Field>
      <Field label="Strategic Domain">
        <select style={inputStyle} value={data.triggerDomain} onChange={e => update('triggerDomain', e.target.value)}>
          <option value="">Select domain</option>
          {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </Field>
      <Field label="Trigger Condition">
        <textarea style={{ ...inputStyle, minHeight: 90, resize: 'vertical' }} placeholder="Describe exactly what fires this protocol — be specific. e.g., SIEM detects unauthorized file-system encryption across two or more production servers." value={data.triggerCondition} onChange={e => update('triggerCondition', e.target.value)} />
      </Field>
      <Field label="Industry Vertical">
        <select style={inputStyle} value={data.industry} onChange={e => update('industry', e.target.value)}>
          <option value="">Select industry</option>
          {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
        </select>
      </Field>
      <Field label="Risk Threshold">
        <div style={{ display: 'flex', gap: 8 }}>
          {RISK_LEVELS.map(r => (
            <button key={r} onClick={() => update('riskThreshold', r)} style={{
              flex: 1, padding: '9px 0', borderRadius: '0.15rem', border: `1.5px solid`,
              borderColor: data.riskThreshold === r ? RISK_COLORS[r] : BORDER,
              background: data.riskThreshold === r ? RISK_COLORS[r] : '#fff',
              color: data.riskThreshold === r ? '#fff' : MUTED,
              fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
              cursor: 'pointer', transition: 'all 0.15s',
            }}>{r}</button>
          ))}
        </div>
      </Field>
      <Field label="External Signal Coverage">
        <CoveragePillGroup
          options={SIGNAL_SOURCE_OPTIONS}
          selected={data.signalSources}
          onToggle={(value) => onToggleCoverage('signalSources', value)}
        />
        <div style={{ fontSize: 11, color: MUTED, marginTop: 6 }}>
          Select the outside intelligence feeds this protocol should monitor.
        </div>
      </Field>
      <Field label="Internal System Coverage">
        <CoveragePillGroup
          options={INTERNAL_SYSTEM_OPTIONS}
          selected={data.internalSystems}
          onToggle={(value) => onToggleCoverage('internalSystems', value)}
        />
        <div style={{ fontSize: 11, color: MUTED, marginTop: 6 }}>
          Select systems used for evidence collection, action orchestration, and tracking.
        </div>
      </Field>
      <Field label="Monitoring Cadence">
        <select
          style={inputStyle}
          value={data.monitoringCadenceMinutes}
          onChange={(e) => update('monitoringCadenceMinutes', e.target.value)}
        >
          {MONITORING_CADENCE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </Field>
    </>
  );
}

function Step2({ data, updateNested }: { data: Data; updateNested: (f: string, k: string, v: string) => void }) {
  return (
    <>
      <PhaseHeader label="Immediate Phase" timing="Minutes 0 – 12" color={GOLD} />
      <OwnerRow label="Primary Owner" value={data.immediatePrimary} onChange={(k, v) => updateNested('immediatePrimary', k, v)} />
      <OwnerRow label="Secondary Owner (optional)" value={data.immediateSecondary} onChange={(k, v) => updateNested('immediateSecondary', k, v)} />
      <PhaseHeader label="Secondary Phase" timing="Hours 1 – 4" color={TEAL} />
      <OwnerRow label="Primary Owner" value={data.secondaryPrimary} onChange={(k, v) => updateNested('secondaryPrimary', k, v)} />
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
      <TaskEditor tasks={data.immediateTasks} updateTask={(i, k, v) => updateTask('immediateTasks', i, k, v)} addTask={() => addTask('immediateTasks')} phaseLabel="Immediate Phase" timing="Minutes 0 – 12" color={GOLD} />
      <TaskEditor tasks={data.secondaryTasks} updateTask={(i, k, v) => updateTask('secondaryTasks', i, k, v)} addTask={() => addTask('secondaryTasks')} phaseLabel="Secondary Phase" timing="Hours 1 – 4" color={TEAL} />
      <TaskEditor tasks={data.followUpTasks} updateTask={(i, k, v) => updateTask('followUpTasks', i, k, v)} addTask={() => addTask('followUpTasks')} phaseLabel="Follow-Up Phase" timing="Days 1 – 5" color={MUTED} />
    </>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)} style={{ width: 40, height: 22, borderRadius: 11, background: checked ? TEAL : BORDER, border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
      <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: checked ? 21 : 3, transition: 'left 0.2s' }} />
    </button>
  );
}

// ── Custom Fields ─────────────────────────────────────────────────────────────

type CustomField = {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'yesno' | 'dropdown';
  options: string;
  required: boolean;
};

const FIELD_TYPES = [
  { value: 'text',     label: 'Text' },
  { value: 'number',   label: 'Number' },
  { value: 'date',     label: 'Date' },
  { value: 'yesno',   label: 'Yes / No' },
  { value: 'dropdown', label: 'Dropdown' },
];

const TYPE_LABELS: Record<string, string> = {
  text: 'Text', number: 'Number', date: 'Date', yesno: 'Yes / No', dropdown: 'Dropdown',
};

function CustomFieldsSection({ fields, onAdd, onRemove }: {
  fields: CustomField[];
  onAdd: (field: CustomField) => void;
  onRemove: (id: string) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ label: '', type: 'text', options: '', required: false });

  const handleSave = () => {
    if (!draft.label.trim()) return;
    onAdd({
      id: Math.random().toString(36).slice(2),
      label: draft.label.trim(),
      type: draft.type as CustomField['type'],
      options: draft.options,
      required: draft.required,
    });
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

      {/* Existing fields */}
      {fields.map(f => (
        <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, padding: '10px 14px', background: 'rgba(43,138,110,0.06)', border: `1px solid rgba(43,138,110,0.18)`, borderRadius: '0.15rem' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>{f.label}</span>
            <span style={{ fontSize: 11, color: MUTED, background: '#F3F4F6', padding: '2px 8px', borderRadius: '0.15rem' }}>{TYPE_LABELS[f.type]}</span>
            {f.type === 'dropdown' && f.options && (
              <span style={{ fontSize: 11, color: MUTED }}>Options: {f.options}</span>
            )}
          </div>
          {f.required && (
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#D97706', background: '#FEF3C7', padding: '2px 7px', borderRadius: '0.15rem', flexShrink: 0 }}>Required</span>
          )}
          <button onClick={() => onRemove(f.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: MUTED, padding: 2, flexShrink: 0 }}>
            <X size={13} />
          </button>
        </div>
      ))}

      {/* Add field form */}
      {adding && (
        <div style={{ padding: '18px', background: '#F8F6F0', border: `1px solid ${BORDER}`, borderRadius: '0.15rem', marginTop: fields.length > 0 ? 8 : 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: MUTED, marginBottom: 12 }}>New Custom Field</div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
            <input
              style={{ ...inputStyle, flex: '1 1 220px' }}
              placeholder="Field label (e.g., Regulatory Filing Reference)"
              value={draft.label}
              onChange={e => setDraft(d => ({ ...d, label: e.target.value }))}
              autoFocus
              onKeyDown={e => e.key === 'Enter' && handleSave()}
            />
            <select
              style={{ ...inputStyle, flex: '0 0 140px' }}
              value={draft.type}
              onChange={e => setDraft(d => ({ ...d, type: e.target.value }))}
            >
              {FIELD_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          {draft.type === 'dropdown' && (
            <input
              style={{ ...inputStyle, marginBottom: 12 }}
              placeholder="Options (comma-separated, e.g., Option A, Option B, Option C)"
              value={draft.options}
              onChange={e => setDraft(d => ({ ...d, options: e.target.value }))}
            />
          )}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Toggle checked={draft.required} onChange={v => setDraft(d => ({ ...d, required: v }))} />
              <span style={{ fontSize: 13, color: NAVY }}>Required field</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => { setAdding(false); setDraft({ label: '', type: 'text', options: '', required: false }); }}
                style={{ padding: '8px 16px', borderRadius: '0.15rem', border: `1px solid ${BORDER}`, background: 'none', color: MUTED, fontSize: 13, cursor: 'pointer', fontWeight: 500 }}
              >Cancel</button>
              <button
                onClick={handleSave}
                disabled={!draft.label.trim()}
                style={{ padding: '8px 16px', borderRadius: '0.15rem', border: 'none', background: !draft.label.trim() ? '#E5E7EB' : NAVY, color: !draft.label.trim() ? MUTED : '#fff', fontWeight: 700, fontSize: 13, cursor: !draft.label.trim() ? 'not-allowed' : 'pointer' }}
              >Save Field</button>
            </div>
          </div>
        </div>
      )}

      {fields.length === 0 && !adding && (
        <div style={{ fontSize: 12, color: MUTED, fontStyle: 'italic', marginTop: 8 }}>
          Add fields specific to your organization — regulatory references, tracking IDs, approvals, contacts, or any data your team needs captured at activation.
        </div>
      )}
    </div>
  );
}

const STEP_KEYS = ['identity', 'owners', 'tasks', 'comms', 'budget', 'authority'] as const;
type StepKey = typeof STEP_KEYS[number];

function Step4({ data, update }: { data: Data; update: (f: string, v: any) => void }) {
  const boardTemplate = `Board of Directors — Confidential Briefing\n\nAs of [DATE], [PROTOCOL NAME] has been activated.\n\nStatus: [CURRENT STATUS]\nEstimated resolution: [TIMELINE]\nFinancial exposure: [AMOUNT]\n\nImmediate actions taken:\n— [ACTION 1]\n— [ACTION 2]\n\nNext board update: [SCHEDULED TIME]\n\n[AUTHORIZING EXECUTIVE]`;
  const alertTemplate = `PRIORITY ALERT — [PROTOCOL NAME] ACTIVATED\n\nTo: [STAKEHOLDER GROUP]\nTime: [HH:MM]\n\n[BRIEF SITUATION DESCRIPTION]\n\nYour role: [SPECIFIC ACTION REQUIRED]\nDeadline: [TIME]\n\nProtocol Commander: [NAME, TITLE]`;
  return (
    <>
      <Field label="Board Notification">
        <textarea style={{ ...inputStyle, minHeight: 160, resize: 'vertical', fontSize: 13, lineHeight: 1.6 }}
          placeholder={boardTemplate}
          value={data.boardNotification}
          onChange={e => update('boardNotification', e.target.value)} />
        <div style={{ fontSize: 11, color: MUTED, marginTop: 6 }}>Customize this template with your organization's structure. Brackets indicate variables you'll fill at activation.</div>
      </Field>
      <Field label="Stakeholder Alert">
        <textarea style={{ ...inputStyle, minHeight: 130, resize: 'vertical', fontSize: 13, lineHeight: 1.6 }}
          placeholder={alertTemplate}
          value={data.stakeholderAlert}
          onChange={e => update('stakeholderAlert', e.target.value)} />
      </Field>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
          <label style={{ ...labelStyle, margin: 0, flex: 1 }}>External Partner Communication</label>
          <Toggle checked={data.hasExternalPartners} onChange={v => update('hasExternalPartners', v)} />
        </div>
        {data.hasExternalPartners && (
          <textarea style={{ ...inputStyle, minHeight: 100, resize: 'vertical', fontSize: 13, lineHeight: 1.6 }}
            placeholder="Pre-draft your external partner briefing (vendors, suppliers, law firms, PR agencies)..."
            value={data.externalPartnersText}
            onChange={e => update('externalPartnersText', e.target.value)} />
        )}
      </div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
          <label style={{ ...labelStyle, margin: 0, flex: 1 }}>Public Statement</label>
          <Toggle checked={data.hasPublicStatement} onChange={v => update('hasPublicStatement', v)} />
        </div>
        {data.hasPublicStatement && (
          <textarea style={{ ...inputStyle, minHeight: 100, resize: 'vertical', fontSize: 13, lineHeight: 1.6 }}
            placeholder="Pre-draft your public statement template. Reviewed by Legal & PR before activation."
            value={data.publicStatementText}
            onChange={e => update('publicStatementText', e.target.value)} />
        )}
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

function Step6({ data, update }: { data: Data; update: (f: string, v: any) => void }) {
  const addObserver = () => update('observers', [...data.observers, { title: '', name: '' }]);
  const removeObserver = (i: number) => update('observers', data.observers.filter((_, idx) => idx !== i));
  const updateObserver = (i: number, k: string, v: string) =>
    update('observers', data.observers.map((o, idx) => idx === i ? { ...o, [k]: v } : o));

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: GOLD, marginBottom: 12 }}>Authorizes Activation</div>
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
      <div style={{ marginBottom: 24, borderTop: `1px solid ${BORDER}`, paddingTop: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: NAVY, marginBottom: 12 }}>Versioning & Governance</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
          <input style={inputStyle} placeholder="Version tag (e.g., v1.2)" value={data.protocolVersion} onChange={e => update('protocolVersion', e.target.value)} />
          <select style={inputStyle} value={data.approvalPolicy} onChange={e => update('approvalPolicy', e.target.value)}>
            <option value="single">Single executive approval</option>
            <option value="dual">Dual executive approval</option>
            <option value="board">Board-level approval required</option>
          </select>
        </div>
        <Field label="Change Summary">
          <textarea
            style={{ ...inputStyle, minHeight: 90, resize: 'vertical', fontSize: 13, lineHeight: 1.6 }}
            placeholder="Document what changed in this version and why."
            value={data.changeSummary}
            onChange={(e) => update('changeSummary', e.target.value)}
          />
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
          <select style={inputStyle} value={data.reviewCadence} onChange={e => update('reviewCadence', e.target.value)}>
            <option value="monthly">Monthly review</option>
            <option value="quarterly">Quarterly review</option>
            <option value="semi-annual">Semi-annual review</option>
            <option value="annual">Annual review</option>
          </select>
          <input style={inputStyle} placeholder="Reviewer title" value={data.lastReviewedByTitle} onChange={e => update('lastReviewedByTitle', e.target.value)} />
        </div>
        <input style={{ ...inputStyle, marginBottom: 12 }} placeholder="Reviewer name" value={data.lastReviewedByName} onChange={e => update('lastReviewedByName', e.target.value)} />
        <Field label="Rollback Plan">
          <textarea
            style={{ ...inputStyle, minHeight: 80, resize: 'vertical', fontSize: 13, lineHeight: 1.6 }}
            placeholder="Define how to revert this protocol version if execution quality degrades."
            value={data.rollbackPlan}
            onChange={(e) => update('rollbackPlan', e.target.value)}
          />
        </Field>
        <Field label="Validation Scenario">
          <textarea
            style={{ ...inputStyle, minHeight: 80, resize: 'vertical', fontSize: 13, lineHeight: 1.6 }}
            placeholder="Describe the simulation or live drill scenario used to validate this version."
            value={data.testScenarioSummary}
            onChange={(e) => update('testScenarioSummary', e.target.value)}
          />
        </Field>
      </div>
    </>
  );
}

function getStepValidation(data: Data): StepValidation[] {
  const hasImmediateTask = data.immediateTasks.some((task) => task.description.trim() && task.assignedTo.trim());
  const hasSecondaryTask = data.secondaryTasks.some((task) => task.description.trim() && task.assignedTo.trim());
  const hasFollowUpTask = data.followUpTasks.some((task) => task.description.trim() && task.assignedTo.trim());

  return [
    {
      isComplete: Boolean(data.name.trim() && data.triggerDomain && data.triggerCondition.trim() && data.signalSources.length > 0),
      missing: [
        !data.name.trim() ? 'Protocol name' : '',
        !data.triggerDomain ? 'Strategic domain' : '',
        !data.triggerCondition.trim() ? 'Trigger condition' : '',
        data.signalSources.length === 0 ? 'At least one external signal source' : '',
      ].filter(Boolean),
    },
    {
      isComplete: Boolean(
        data.immediatePrimary.title.trim() &&
        data.immediatePrimary.name.trim() &&
        data.secondaryPrimary.title.trim() &&
        data.secondaryPrimary.name.trim() &&
        data.followUpPrimary.title.trim() &&
        data.followUpPrimary.name.trim()
      ),
      missing: [
        !data.immediatePrimary.title.trim() || !data.immediatePrimary.name.trim() ? 'Immediate phase owner' : '',
        !data.secondaryPrimary.title.trim() || !data.secondaryPrimary.name.trim() ? 'Secondary phase owner' : '',
        !data.followUpPrimary.title.trim() || !data.followUpPrimary.name.trim() ? 'Follow-up phase owner' : '',
      ].filter(Boolean),
    },
    {
      isComplete: hasImmediateTask && hasSecondaryTask && hasFollowUpTask,
      missing: [
        !hasImmediateTask ? 'At least one immediate task with assignee' : '',
        !hasSecondaryTask ? 'At least one secondary task with assignee' : '',
        !hasFollowUpTask ? 'At least one follow-up task with assignee' : '',
      ].filter(Boolean),
    },
    {
      isComplete: Boolean(data.boardNotification.trim() && data.stakeholderAlert.trim()),
      missing: [
        !data.boardNotification.trim() ? 'Board notification template' : '',
        !data.stakeholderAlert.trim() ? 'Stakeholder alert template' : '',
      ].filter(Boolean),
    },
    {
      isComplete: Boolean(data.budgetLow && data.budgetMedium && data.budgetHigh && data.budgetCritical),
      missing: [
        !data.budgetLow ? 'Low severity budget' : '',
        !data.budgetMedium ? 'Medium severity budget' : '',
        !data.budgetHigh ? 'High severity budget' : '',
        !data.budgetCritical ? 'Critical severity budget' : '',
      ].filter(Boolean),
    },
    {
      isComplete: Boolean(
        data.authorizerTitle.trim() &&
        data.authorizerName.trim() &&
        data.executorTitle.trim() &&
        data.executorName.trim() &&
        data.protocolVersion.trim() &&
        data.changeSummary.trim() &&
        data.rollbackPlan.trim()
      ),
      missing: [
        !data.authorizerTitle.trim() || !data.authorizerName.trim() ? 'Authorizer assignment' : '',
        !data.executorTitle.trim() || !data.executorName.trim() ? 'Executor assignment' : '',
        !data.protocolVersion.trim() ? 'Protocol version tag' : '',
        !data.changeSummary.trim() ? 'Version change summary' : '',
        !data.rollbackPlan.trim() ? 'Rollback plan' : '',
      ].filter(Boolean),
    },
  ];
}

function scoreBand(score: number) {
  if (score >= 85) return { label: 'Strong', color: TEAL };
  if (score >= 70) return { label: 'Needs tuning', color: '#D97706' };
  return { label: 'Gap', color: '#DC2626' };
}

function SummaryView({ data, onSave, isPending, savedId }: { data: Data; onSave: () => void; isPending: boolean; savedId?: string }) {
  const riskColor = RISK_COLORS[data.riskThreshold] ?? NAVY;
  const allImmediate = data.immediateTasks.filter(t => t.description);
  const allSecondary = data.secondaryTasks.filter(t => t.description);
  const allFollowUp = data.followUpTasks.filter(t => t.description);
  const [sandbox, setSandbox] = useState({
    signalStrength: 72,
    impactedSystems: 2,
    budgetRequested: '750000',
    confidenceModifier: 0,
  });

  const readinessModel = useMemo(() => {
    const totalTaskCount = allImmediate.length + allSecondary.length + allFollowUp.length;
    const completeOwnerCount = [
      data.immediatePrimary,
      data.secondaryPrimary,
      data.followUpPrimary,
    ].filter((owner) => owner.title && owner.name).length;
    const completeBudgetCount = [data.budgetLow, data.budgetMedium, data.budgetHigh, data.budgetCritical].filter(Boolean).length;
    const hasGovernance = Boolean(data.protocolVersion && data.changeSummary && data.rollbackPlan);
    const observerCount = data.observers.filter((observer) => observer.name).length;

    const depth = Math.min(100, 25 + (totalTaskCount * 6) + (completeOwnerCount * 10) + (completeBudgetCount * 6) + (data.customFields.authority.length * 2));
    const breadth = Math.min(100, 30 + (data.signalSources.length * 8) + (data.internalSystems.length * 7) + (data.industry ? 8 : 0) + (data.triggerDomain ? 8 : 0));
    const intuitiveness = Math.min(100, 45 + (data.starterTemplateId ? 15 : 0) + (data.customFields.identity.length * 3) + (data.monitoringCadenceMinutes === '15' ? 8 : 4) + (data.signalSources.length > 0 ? 8 : 0));
    const enterpriseReadiness = Math.min(100, 30 + (hasGovernance ? 20 : 0) + (observerCount * 6) + (data.approvalPolicy === 'dual' ? 14 : data.approvalPolicy === 'board' ? 18 : 8) + (data.testScenarioSummary ? 12 : 0));

    const dimensions = [
      { id: 'depth', label: 'Depth', score: depth, note: 'Protocol architecture completeness' },
      { id: 'breadth', label: 'Breadth', score: breadth, note: 'Signal and system coverage' },
      { id: 'intuitiveness', label: 'Intuitiveness', score: intuitiveness, note: 'Builder usability and clarity' },
      { id: 'enterprise', label: 'Enterprise Readiness', score: enterpriseReadiness, note: 'Governance, approvals, and rollback control' },
    ];
    const overall = Math.round(dimensions.reduce((sum, dimension) => sum + dimension.score, 0) / dimensions.length);
    return { dimensions, overall };
  }, [
    allFollowUp.length,
    allImmediate.length,
    allSecondary.length,
    data.approvalPolicy,
    data.budgetCritical,
    data.budgetHigh,
    data.budgetLow,
    data.budgetMedium,
    data.changeSummary,
    data.customFields.authority.length,
    data.customFields.identity.length,
    data.immediatePrimary,
    data.industry,
    data.internalSystems.length,
    data.monitoringCadenceMinutes,
    data.observers,
    data.protocolVersion,
    data.rollbackPlan,
    data.secondaryPrimary,
    data.signalSources.length,
    data.starterTemplateId,
    data.testScenarioSummary,
    data.triggerDomain,
    data.followUpPrimary,
  ]);

  const sandboxResult = useMemo(() => {
    const sourceFactor = data.signalSources.length * 3;
    const systemFactor = data.internalSystems.length * 2;
    const governanceFactor = data.protocolVersion && data.changeSummary ? 6 : -4;
    const confidence = Math.max(
      0,
      Math.min(
        99,
        Math.round(sandbox.signalStrength + sourceFactor + systemFactor + governanceFactor + sandbox.confidenceModifier)
      )
    );
    const blockers = [
      !data.authorizerName ? 'No executive authorizer assigned' : '',
      allImmediate.length === 0 ? 'No immediate tasks staged' : '',
      !data.boardNotification ? 'Board communication template missing' : '',
      !data.rollbackPlan ? 'Rollback plan not defined' : '',
    ].filter(Boolean);

    const mobilizationMinutes = confidence >= 80 && blockers.length === 0 ? 12 : confidence >= 65 ? 20 : 35;
    const readinessState = blockers.length === 0 ? 'Activation-ready' : 'Needs setup before activation';

    return {
      confidence,
      mobilizationMinutes,
      blockers,
      readinessState,
    };
  }, [
    allImmediate.length,
    data.authorizerName,
    data.boardNotification,
    data.changeSummary,
    data.internalSystems.length,
    data.protocolVersion,
    data.rollbackPlan,
    data.signalSources.length,
    sandbox.confidenceModifier,
    sandbox.signalStrength,
  ]);

  if (savedId) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <CheckCircle2 size={56} color={TEAL} style={{ marginBottom: 20 }} />
        <div style={{ fontSize: 28, fontWeight: 700, color: NAVY, marginBottom: 8 }}>Protocol Saved</div>
        <div style={{ fontSize: 16, color: MUTED, marginBottom: 32 }}>{data.name} is ready for activation.</div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/protocol-builder">
            <button onClick={() => window.location.reload()} style={{ padding: '12px 24px', borderRadius: '0.15rem', border: `1.5px solid ${NAVY}`, background: 'none', color: NAVY, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
              Build Another Protocol
            </button>
          </Link>
          <Link href="/founding-partner-program">
            <button style={{ padding: '12px 24px', borderRadius: '0.15rem', border: 'none', background: GOLD, color: NAVY, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
              Apply for Founding Partner Access →
            </button>
          </Link>
        </div>
      </div>
    );
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
            {data.protocolVersion && <span style={{ fontSize: 11, fontWeight: 700, background: '#F3F4F6', color: NAVY, padding: '3px 10px', borderRadius: '0.15rem' }}>Version {data.protocolVersion}</span>}
          </div>
        </div>
      </div>

      {data.triggerCondition && (
        <div style={{ padding: '14px 18px', background: '#F8F6F0', border: `1px solid ${BORDER}`, borderRadius: '0.15rem', marginBottom: 20, fontSize: 14, color: NAVY, lineHeight: 1.6 }}>
          <span style={{ fontWeight: 700 }}>Trigger: </span>{data.triggerCondition}
        </div>
      )}

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
          {data.budgetHigh && <div style={{ fontSize: 13, marginBottom: 4 }}><span style={{ color: MUTED }}>HIGH: </span>${data.budgetHigh} {data.budgetHighApprover && `+ ${data.budgetHighApprover}`}</div>}
          {data.budgetCritical && <div style={{ fontSize: 13 }}><span style={{ color: MUTED }}>CRITICAL: </span>${data.budgetCritical}</div>}
        </div>

        <div style={{ padding: '16px 18px', border: `1px solid ${BORDER}`, borderRadius: '0.15rem' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: NAVY, marginBottom: 12 }}>Data Coverage</div>
          <div style={{ fontSize: 13, color: NAVY, marginBottom: 4 }}>
            <span style={{ color: MUTED }}>External sources: </span>{data.signalSources.length || 0}
          </div>
          <div style={{ fontSize: 13, color: NAVY, marginBottom: 4 }}>
            <span style={{ color: MUTED }}>Internal systems: </span>{data.internalSystems.length || 0}
          </div>
          <div style={{ fontSize: 13, color: NAVY }}>
            <span style={{ color: MUTED }}>Monitoring cadence: </span>every {data.monitoringCadenceMinutes} minutes
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 28, border: `1px solid ${BORDER}`, borderRadius: '0.15rem', padding: '18px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: NAVY, marginBottom: 12 }}>
          Product Readiness Scorecard
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 10, marginBottom: 12 }}>
          {readinessModel.dimensions.map((dimension) => {
            const band = scoreBand(dimension.score);
            return (
              <div key={dimension.id} style={{ border: `1px solid ${BORDER}`, borderRadius: '0.15rem', padding: '10px 12px', background: '#fff' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{dimension.label}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: NAVY }}>{dimension.score}</div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: band.color }}>{band.label}</span>
                </div>
                <div style={{ fontSize: 11, color: MUTED }}>{dimension.note}</div>
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ fontSize: 13, color: NAVY }}>
            <span style={{ color: MUTED }}>Overall readiness: </span><strong>{readinessModel.overall}/100</strong>
          </div>
          {readinessModel.overall < 75 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#B45309' }}>
              <AlertTriangle size={14} />
              Complete missing fields and run a validation scenario before production activation.
            </div>
          )}
        </div>
      </div>

      <div style={{ marginBottom: 24, border: `1px solid ${BORDER}`, borderRadius: '0.15rem', padding: '18px', background: '#fff' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: TEAL, marginBottom: 12 }}>
          Trigger Sandbox
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginBottom: 14 }}>
          <div>
            <label style={labelStyle}>Signal strength</label>
            <input type="range" min={30} max={95} value={sandbox.signalStrength} onChange={(e) => setSandbox((prev) => ({ ...prev, signalStrength: Number(e.target.value) }))} />
            <div style={{ fontSize: 12, color: MUTED }}>{sandbox.signalStrength}%</div>
          </div>
          <div>
            <label style={labelStyle}>Impacted systems</label>
            <input style={inputStyle} type="number" min={1} value={sandbox.impactedSystems} onChange={(e) => setSandbox((prev) => ({ ...prev, impactedSystems: Number(e.target.value || 1) }))} />
          </div>
          <div>
            <label style={labelStyle}>Budget requested ($)</label>
            <input style={inputStyle} value={sandbox.budgetRequested} onChange={(e) => setSandbox((prev) => ({ ...prev, budgetRequested: e.target.value }))} />
          </div>
          <div>
            <label style={labelStyle}>Confidence modifier</label>
            <input style={inputStyle} type="number" min={-20} max={20} value={sandbox.confidenceModifier} onChange={(e) => setSandbox((prev) => ({ ...prev, confidenceModifier: Number(e.target.value || 0) }))} />
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 12 }}>
          <div style={{ fontSize: 13, color: NAVY, marginBottom: 4 }}>
            Predicted trigger confidence: <strong>{sandboxResult.confidence}%</strong>
          </div>
          <div style={{ fontSize: 13, color: NAVY, marginBottom: 4 }}>
            Estimated mobilization: <strong>{sandboxResult.mobilizationMinutes} minutes</strong>
          </div>
          <div style={{ fontSize: 13, color: NAVY, marginBottom: sandboxResult.blockers.length ? 6 : 0 }}>
            Status: <strong>{sandboxResult.readinessState}</strong>
          </div>
          {sandboxResult.blockers.length > 0 && (
            <ul style={{ margin: 0, paddingLeft: 18, color: '#B45309', fontSize: 12, lineHeight: 1.6 }}>
              {sandboxResult.blockers.map((blocker) => <li key={blocker}>{blocker}</li>)}
            </ul>
          )}
        </div>
      </div>

      {(() => {
        const allCustom = Object.entries(data.customFields).flatMap(([stepKey, fields]) =>
          (fields as CustomField[]).map(f => ({ ...f, stepKey }))
        );
        if (allCustom.length === 0) return null;
        const stepLabels: Record<string, string> = {
          identity: 'Protocol Identity', owners: 'Executive Owners', tasks: 'Task Sequence',
          comms: 'Communication Chain', budget: 'Budget Envelope', authority: 'Decision Authority',
        };
        const byStep = Object.entries(data.customFields).filter(([, fields]) => (fields as CustomField[]).length > 0);
        return (
          <div style={{ marginBottom: 24, padding: '16px 18px', border: `1px solid rgba(43,138,110,0.2)`, borderRadius: '0.15rem', background: 'rgba(43,138,110,0.04)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: TEAL, marginBottom: 12 }}>
              Custom Fields — {allCustom.length} field{allCustom.length !== 1 ? 's' : ''} added
            </div>
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

  const toggleCoverageValue = (field: 'signalSources' | 'internalSystems', value: string) =>
    setData(prev => {
      const list = prev[field];
      const exists = list.includes(value);
      return {
        ...prev,
        [field]: exists ? list.filter(item => item !== value) : [...list, value],
      };
    });

  const applyStarterTemplate = (templateId: string) => {
    update('starterTemplateId', templateId);
    if (!templateId) return;
    const template = STARTER_TEMPLATES.find(entry => entry.id === templateId);
    if (!template) return;
    setData(prev => ({
      ...prev,
      starterTemplateId: template.id,
      ...template.defaults,
      immediateTasks: [...template.defaults.immediateTasks],
      secondaryTasks: [...template.defaults.secondaryTasks],
      followUpTasks: [...template.defaults.followUpTasks],
      signalSources: [...template.defaults.signalSources],
      internalSystems: [...template.defaults.internalSystems],
    }));
  };

  const addCustomField = (stepKey: StepKey, field: CustomField) =>
    setData(prev => ({
      ...prev,
      customFields: { ...prev.customFields, [stepKey]: [...prev.customFields[stepKey], field] },
    }));

  const removeCustomField = (stepKey: StepKey, id: string) =>
    setData(prev => ({
      ...prev,
      customFields: { ...prev.customFields, [stepKey]: prev.customFields[stepKey].filter(f => f.id !== id) },
    }));

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: data.name,
        description: data.changeSummary || null,
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
            signalSources: data.signalSources,
            internalSystems: data.internalSystems,
            cadenceMinutes: Number(data.monitoringCadenceMinutes || 15),
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
            changeSummary: data.changeSummary,
            approvalPolicy: data.approvalPolicy,
            reviewCadence: data.reviewCadence,
            rollbackPlan: data.rollbackPlan,
            lastReviewedBy: {
              title: data.lastReviewedByTitle,
              name: data.lastReviewedByName,
            },
            validationScenario: data.testScenarioSummary,
          },
        },
        status: 'ready',
        completedSteps: 6,
        customFields: data.customFields,
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

  const totalSteps = STEPS.length;
  const isSummary = step === totalSteps;
  const currentStep = STEPS[step];
  const stepValidation = useMemo(() => getStepValidation(data), [data]);
  const currentValidation = stepValidation[step];
  const canAdvance = Boolean(currentValidation?.isComplete);

  const renderStepContent = () => {
    const key = STEP_KEYS[step];
    const cfProps = {
      fields: data.customFields[key] ?? [],
      onAdd: (f: CustomField) => addCustomField(key, f),
      onRemove: (id: string) => removeCustomField(key, id),
    };
    switch (step) {
      case 0: return <><Step1 data={data} update={update} onApplyTemplate={applyStarterTemplate} onToggleCoverage={toggleCoverageValue} /><CustomFieldsSection {...cfProps} /></>;
      case 1: return <><Step2 data={data} updateNested={updateNested} /><CustomFieldsSection {...cfProps} /></>;
      case 2: return <><Step3 data={data} updateTask={updateTask} addTask={addTask} /><CustomFieldsSection {...cfProps} /></>;
      case 3: return <><Step4 data={data} update={update} /><CustomFieldsSection {...cfProps} /></>;
      case 4: return <><Step5 data={data} update={update} /><CustomFieldsSection {...cfProps} /></>;
      case 5: return <><Step6 data={data} update={update} /><CustomFieldsSection {...cfProps} /></>;
      default: return null;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: '"Barlow", sans-serif' }}>

      {/* ── Sidebar ── */}
      <div style={{ width: 272, background: NAVY, flexShrink: 0, display: 'flex', flexDirection: 'column', padding: '32px 24px', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
        {/* Logo / Header */}
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

        <div style={{ fontSize: 10, letterSpacing: '0.12em', fontWeight: 700, textTransform: 'uppercase', color: GOLD, marginBottom: 6 }}>Protocol Builder</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 32, lineHeight: 1.5 }}>
          The structure of all 170 protocols. Your organization's specifics.
        </div>

        {/* Steps */}
        <div style={{ flex: 1 }}>
          {STEPS.map((s, i) => {
            const isActive = step === i;
            const isDone = step > i || isSummary;
            const StepIcon = s.Icon;
            return (
              <div key={s.id} style={{ display: 'flex', gap: 12, marginBottom: 8, alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isDone ? TEAL : isActive ? GOLD : 'rgba(255,255,255,0.1)',
                    border: `1.5px solid ${isDone ? TEAL : isActive ? GOLD : 'rgba(255,255,255,0.2)'}`,
                    transition: 'all 0.2s',
                  }}>
                    {isDone ? <CheckCircle2 size={14} color="#fff" /> : <StepIcon size={12} color={isActive ? NAVY : 'rgba(255,255,255,0.4)'} />}
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

          {/* Summary step indicator */}
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

        {/* Guidance box */}
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
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: GOLD }}>Step {step + 1} of {totalSteps}</div>
              <div style={{ flex: 1, height: 3, background: BORDER, borderRadius: 2 }}>
                <div style={{ height: '100%', background: GOLD, borderRadius: 2, width: `${((step + 1) / totalSteps) * 100}%`, transition: 'width 0.4s ease' }} />
              </div>
              <div style={{ fontSize: 11, color: currentValidation?.isComplete ? TEAL : '#B45309', fontWeight: 700 }}>
                {currentValidation?.isComplete ? 'Step complete' : 'Required items pending'}
              </div>
            </>
          ) : (
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: TEAL }}>Review & Save</div>
          )}
        </div>

        {/* Main content */}
        <div style={{ flex: 1, padding: '40px', maxWidth: 680, width: '100%' }}>
          {!isSummary && currentStep && (
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: NAVY, marginBottom: 6 }}>{currentStep.title}</div>
              <div style={{ fontSize: 15, color: MUTED }}>{currentStep.subtitle}</div>
              {!currentValidation?.isComplete && currentValidation?.missing.length ? (
                <div style={{ marginTop: 14, padding: '10px 12px', border: `1px solid rgba(180,83,9,0.25)`, background: 'rgba(245,158,11,0.08)', borderRadius: '0.15rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#92400E', marginBottom: 6 }}>
                    <AlertTriangle size={13} /> Complete to continue
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 18, color: '#92400E', fontSize: 12, lineHeight: 1.55 }}>
                    {currentValidation.missing.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              ) : null}
            </div>
          )}

          {isSummary ? (
            <SummaryView data={data} onSave={() => mutation.mutate()} isPending={mutation.isPending} savedId={savedId} />
          ) : (
            renderStepContent()
          )}
        </div>

        {/* Navigation */}
        {!isSummary && (
          <div style={{ borderTop: `1px solid ${BORDER}`, padding: '20px 40px', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px',
              borderRadius: '0.15rem', border: `1.5px solid ${step === 0 ? '#E5E7EB' : BORDER}`,
              background: 'none', color: step === 0 ? '#E5E7EB' : NAVY,
              fontWeight: 600, fontSize: 14, cursor: step === 0 ? 'not-allowed' : 'pointer',
            }}>
              <ArrowLeft size={16} /> Back
            </button>
            <div style={{ display: 'flex', gap: 6 }}>
              {STEPS.map((_, i) => (
                <div key={i} style={{ width: i === step ? 20 : 6, height: 6, borderRadius: 3, background: i === step ? GOLD : i < step ? TEAL : BORDER, transition: 'all 0.2s' }} />
              ))}
            </div>
            <button onClick={() => canAdvance && setStep(s => s + 1)} disabled={!canAdvance} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '10px 24px',
              borderRadius: '0.15rem', border: 'none', background: canAdvance ? GOLD : '#E5E7EB', color: canAdvance ? NAVY : MUTED,
              fontWeight: 700, fontSize: 14, cursor: canAdvance ? 'pointer' : 'not-allowed',
            }}>
              {step === totalSteps - 1 ? 'Review Protocol' : 'Continue'} <ChevronRight size={16} />
            </button>
          </div>
        )}
        {isSummary && !savedId && (
          <div style={{ borderTop: `1px solid ${BORDER}`, padding: '20px 40px', background: '#fff' }}>
            <button onClick={() => setStep(totalSteps - 1)} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px',
              borderRadius: '0.15rem', border: `1.5px solid ${BORDER}`,
              background: 'none', color: NAVY, fontWeight: 600, fontSize: 14, cursor: 'pointer',
            }}>
              <ArrowLeft size={16} /> Edit Protocol
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
