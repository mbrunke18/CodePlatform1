import { useState, useCallback } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft, ArrowRight, CheckCircle2, ChevronDown, ChevronRight,
  Plus, X, Users, Target, Layers, Shield, Zap, Eye,
  FileText, AlertTriangle, Clock, Lock, Star, Search,
  Grid3X3, BarChart3, BookOpen, Activity
} from 'lucide-react';

const NAVY = '#0A0F2E';
const GOLD = '#C9A84C';
const TEAL = '#2B8A6E';
const RED  = '#DC2626';
const IVORY = '#F0EDE4';

// ─── Data Types ──────────────────────────────────────────────────────────────

interface TriggerTemplate {
  id: string;
  name: string;
  domain: 'GROWTH & POSITIONING' | 'RISK & RESILIENCE' | 'TRANSFORMATION';
  protocolNumber: number;
  protocolName: string;
  description: string;
  defaultRoles: SuggestedRole[];
  defaultVariants: SuggestedVariant[];
}

interface SuggestedRole {
  id: string;
  title: string;
  level: 'C-Suite' | 'VP' | 'Director' | 'Manager' | 'Board';
  domain: string;
  notifyMethod: 'Immediate' | 'Standard' | 'Escalation Only';
  isRequired: boolean;
}

interface SuggestedVariant {
  id: string;
  name: string;
  description: string;
  detectionSignal: string;
}

interface RoleRow {
  id: string;
  title: string;
  level: string;
  domain: string;
  notifyMethod: string;
  isRequired: boolean;
  isCustom?: boolean;
}

interface SituationVariant {
  id: string;
  name: string;
  description: string;
  detectionSignal: string;
  isBase?: boolean;
  isCustom?: boolean;
}

interface MatrixCell {
  roleId: string;
  variantId: string;
  primaryResponsibility: string;
  watchSignal: string;
  authorizationCriteria: string;
  suggestion?: { primary: string; signal: string; auth: string };
  isAccepted?: boolean;
}

// ─── Static Data ─────────────────────────────────────────────────────────────

const TRIGGER_TEMPLATES: TriggerTemplate[] = [
  {
    id: 'regulatory-investigation',
    name: 'Regulatory Investigation',
    domain: 'RISK & RESILIENCE',
    protocolNumber: 14,
    protocolName: 'Regulatory Response Protocol',
    description: 'Government or regulatory body initiates formal inquiry, subpoena, or investigation into organizational practices.',
    defaultRoles: [
      { id: 'gc', title: 'General Counsel', level: 'C-Suite', domain: 'Legal', notifyMethod: 'Immediate', isRequired: true },
      { id: 'ceo', title: 'Chief Executive Officer', level: 'C-Suite', domain: 'Executive', notifyMethod: 'Immediate', isRequired: true },
      { id: 'cfo', title: 'Chief Financial Officer', level: 'C-Suite', domain: 'Finance', notifyMethod: 'Immediate', isRequired: true },
      { id: 'cco', title: 'Chief Communications Officer', level: 'C-Suite', domain: 'Communications', notifyMethod: 'Standard', isRequired: true },
      { id: 'board', title: 'Board Chair', level: 'Board', domain: 'Governance', notifyMethod: 'Immediate', isRequired: true },
      { id: 'ciso', title: 'CISO', level: 'C-Suite', domain: 'Technology', notifyMethod: 'Standard', isRequired: false },
      { id: 'ir', title: 'VP Investor Relations', level: 'VP', domain: 'Finance', notifyMethod: 'Escalation Only', isRequired: false },
    ],
    defaultVariants: [
      { id: 'media', name: '+ Public / Media Visibility', description: 'Investigation becomes public knowledge or media coverage begins', detectionSignal: 'Media mention volume exceeds threshold or regulatory filing becomes public record' },
      { id: 'deadline', name: '+ Regulatory Deadline Active', description: 'Response deadline issued — less than 30 days to comply', detectionSignal: 'Formal deadline letter received; response window < 30 days' },
      { id: 'board-esc', name: '+ Board Escalation Required', description: 'Severity reaches threshold requiring full board notification', detectionSignal: 'Legal counsel determines material disclosure risk or penalties exceed $10M threshold' },
      { id: 'compound', name: '+ Activist / Investor Pressure', description: 'Activist investor or institutional shareholder applies concurrent pressure', detectionSignal: 'Schedule 13D filing, activist letter, or board access demand within same 30-day window' },
    ]
  },
  {
    id: 'activist-investor',
    name: 'Activist Investor Engagement',
    domain: 'RISK & RESILIENCE',
    protocolNumber: 58,
    protocolName: 'Activist Investor Response Protocol',
    description: 'Activist investor acquires significant stake and initiates engagement, proxy campaign, or board access demand.',
    defaultRoles: [
      { id: 'ceo', title: 'Chief Executive Officer', level: 'C-Suite', domain: 'Executive', notifyMethod: 'Immediate', isRequired: true },
      { id: 'board', title: 'Board Chair', level: 'Board', domain: 'Governance', notifyMethod: 'Immediate', isRequired: true },
      { id: 'cfo', title: 'Chief Financial Officer', level: 'C-Suite', domain: 'Finance', notifyMethod: 'Immediate', isRequired: true },
      { id: 'gc', title: 'General Counsel', level: 'C-Suite', domain: 'Legal', notifyMethod: 'Immediate', isRequired: true },
      { id: 'ir', title: 'VP Investor Relations', level: 'VP', domain: 'Finance', notifyMethod: 'Immediate', isRequired: true },
      { id: 'cco', title: 'Chief Communications Officer', level: 'C-Suite', domain: 'Communications', notifyMethod: 'Standard', isRequired: true },
      { id: 'strategy', title: 'Chief Strategy Officer', level: 'C-Suite', domain: 'Strategy', notifyMethod: 'Standard', isRequired: false },
    ],
    defaultVariants: [
      { id: 'proxy', name: '+ Proxy Campaign Launched', description: 'Activist files proxy materials and solicits shareholder votes', detectionSignal: 'SEC proxy filing (DEFC14A) detected or activist announces campaign publicly' },
      { id: 'media', name: '+ Media Campaign Active', description: 'Activist employs media strategy to pressure board', detectionSignal: 'Op-ed, press release, or interview from activist published in major financial media' },
      { id: 'board-esc', name: '+ Board Seat Demand', description: 'Formal request for board representation submitted', detectionSignal: 'Written demand for board seat received by Corporate Secretary' },
    ]
  },
  {
    id: 'cybersecurity-incident',
    name: 'Cybersecurity / Ransomware Incident',
    domain: 'RISK & RESILIENCE',
    protocolNumber: 22,
    protocolName: 'Ransomware Response Protocol',
    description: 'Ransomware deployment, data breach, or critical system compromise detected or confirmed.',
    defaultRoles: [
      { id: 'ciso', title: 'CISO', level: 'C-Suite', domain: 'Technology', notifyMethod: 'Immediate', isRequired: true },
      { id: 'ceo', title: 'Chief Executive Officer', level: 'C-Suite', domain: 'Executive', notifyMethod: 'Immediate', isRequired: true },
      { id: 'cto', title: 'Chief Technology Officer', level: 'C-Suite', domain: 'Technology', notifyMethod: 'Immediate', isRequired: true },
      { id: 'gc', title: 'General Counsel', level: 'C-Suite', domain: 'Legal', notifyMethod: 'Immediate', isRequired: true },
      { id: 'cfo', title: 'Chief Financial Officer', level: 'C-Suite', domain: 'Finance', notifyMethod: 'Standard', isRequired: true },
      { id: 'cco', title: 'Chief Communications Officer', level: 'C-Suite', domain: 'Communications', notifyMethod: 'Standard', isRequired: true },
      { id: 'board', title: 'Board Chair', level: 'Board', domain: 'Governance', notifyMethod: 'Escalation Only', isRequired: false },
    ],
    defaultVariants: [
      { id: 'data-breach', name: '+ Customer Data Confirmed Exfiltrated', description: 'Personal or sensitive customer data confirmed compromised', detectionSignal: 'Forensic confirmation of data exfiltration affecting >500 customer records' },
      { id: 'regulatory', name: '+ Regulatory Notification Required', description: 'Breach meets threshold requiring mandatory regulatory disclosure', detectionSignal: 'Legal confirms SEC, GDPR, HIPAA, or state breach notification obligation triggered' },
      { id: 'ops-down', name: '+ Critical Operations Offline', description: 'Core business systems offline impacting revenue operations', detectionSignal: 'ERP, POS, or core platform systems offline > 2 hours' },
    ]
  },
  {
    id: 'competitor-displacement',
    name: 'Competitive Displacement Event',
    domain: 'GROWTH & POSITIONING',
    protocolNumber: 31,
    protocolName: 'Competitor Displacement Sprint',
    description: 'Competitor announces major move — pricing shift, new product, acquisition, or key account poach — threatening market position.',
    defaultRoles: [
      { id: 'ceo', title: 'Chief Executive Officer', level: 'C-Suite', domain: 'Executive', notifyMethod: 'Immediate', isRequired: true },
      { id: 'cro', title: 'Chief Revenue Officer', level: 'C-Suite', domain: 'Sales', notifyMethod: 'Immediate', isRequired: true },
      { id: 'cmo', title: 'Chief Marketing Officer', level: 'C-Suite', domain: 'Marketing', notifyMethod: 'Immediate', isRequired: true },
      { id: 'cto', title: 'Chief Product Officer', level: 'C-Suite', domain: 'Product', notifyMethod: 'Standard', isRequired: true },
      { id: 'cfo', title: 'Chief Financial Officer', level: 'C-Suite', domain: 'Finance', notifyMethod: 'Standard', isRequired: false },
      { id: 'strategy', title: 'Chief Strategy Officer', level: 'C-Suite', domain: 'Strategy', notifyMethod: 'Standard', isRequired: false },
    ],
    defaultVariants: [
      { id: 'pricing', name: '+ Pricing Attack', description: 'Competitor announces significant price reduction targeting your segment', detectionSignal: 'Competitor pricing page update detected or customer reports competitive pricing conversation' },
      { id: 'account', name: '+ Key Account at Risk', description: 'Named strategic account in active competitive evaluation', detectionSignal: 'Account signals RFP, exec relationship change, or competitor access confirmed' },
      { id: 'press', name: '+ Competitor Announcement / Press', description: 'Competitor publishes major announcement attracting significant media coverage', detectionSignal: 'Competitor press release generates > 50 earned media mentions within 24 hours' },
    ]
  },
  {
    id: 'supply-chain',
    name: 'Supply Chain Disruption',
    domain: 'RISK & RESILIENCE',
    protocolNumber: 44,
    protocolName: 'Supply Chain Disruption Protocol',
    description: 'Critical supplier failure, logistics disruption, or raw material shortage threatens production or service delivery.',
    defaultRoles: [
      { id: 'coo', title: 'Chief Operating Officer', level: 'C-Suite', domain: 'Operations', notifyMethod: 'Immediate', isRequired: true },
      { id: 'ceo', title: 'Chief Executive Officer', level: 'C-Suite', domain: 'Executive', notifyMethod: 'Immediate', isRequired: true },
      { id: 'cfo', title: 'Chief Financial Officer', level: 'C-Suite', domain: 'Finance', notifyMethod: 'Standard', isRequired: true },
      { id: 'procurement', title: 'VP Procurement', level: 'VP', domain: 'Operations', notifyMethod: 'Immediate', isRequired: true },
      { id: 'cco', title: 'Chief Communications Officer', level: 'C-Suite', domain: 'Communications', notifyMethod: 'Escalation Only', isRequired: false },
      { id: 'cro', title: 'Chief Revenue Officer', level: 'C-Suite', domain: 'Sales', notifyMethod: 'Standard', isRequired: false },
    ],
    defaultVariants: [
      { id: 'production', name: '+ Production Halt Imminent', description: 'Disruption will halt production within 72 hours without intervention', detectionSignal: 'Current inventory < 72-hour production requirement and no alternate confirmed' },
      { id: 'customer', name: '+ Customer Delivery Impact', description: 'Confirmed customer shipments will be delayed or missed', detectionSignal: 'ERP flags > 3 customer orders at risk of SLA miss within 14 days' },
      { id: 'media', name: '+ Public / Media Visibility', description: 'Disruption becomes visible to market or media', detectionSignal: 'Supplier files for bankruptcy, logistics outage covered by trade press, or customer escalates publicly' },
    ]
  },
  {
    id: 'ma-approach',
    name: 'M&A Approach / LOI',
    domain: 'GROWTH & POSITIONING',
    protocolNumber: 58,
    protocolName: 'M&A Rapid Response Protocol',
    description: 'Inbound acquisition approach, LOI receipt, or strategic partnership proposal requiring rapid assessment and response.',
    defaultRoles: [
      { id: 'ceo', title: 'Chief Executive Officer', level: 'C-Suite', domain: 'Executive', notifyMethod: 'Immediate', isRequired: true },
      { id: 'board', title: 'Board Chair', level: 'Board', domain: 'Governance', notifyMethod: 'Immediate', isRequired: true },
      { id: 'cfo', title: 'Chief Financial Officer', level: 'C-Suite', domain: 'Finance', notifyMethod: 'Immediate', isRequired: true },
      { id: 'gc', title: 'General Counsel', level: 'C-Suite', domain: 'Legal', notifyMethod: 'Immediate', isRequired: true },
      { id: 'strategy', title: 'Chief Strategy Officer', level: 'C-Suite', domain: 'Strategy', notifyMethod: 'Immediate', isRequired: true },
      { id: 'ir', title: 'VP Investor Relations', level: 'VP', domain: 'Finance', notifyMethod: 'Standard', isRequired: false },
    ],
    defaultVariants: [
      { id: 'hostile', name: '+ Unsolicited / Hostile Signal', description: 'Approach signals potential hostile or unsolicited intent', detectionSignal: 'Acquirer communicates directly to board bypassing management or files Schedule TO' },
      { id: 'public', name: '+ Public Market Pressure', description: 'M&A interest becomes publicly known through leak or filing', detectionSignal: 'Media report or SEC filing reveals acquirer interest before board decision reached' },
      { id: 'deadline', name: '+ Hard Deadline Imposed', description: 'Acquirer imposes response deadline creating time pressure', detectionSignal: 'Written offer sets response window < 14 days' },
    ]
  },
  {
    id: 'product-launch',
    name: 'Go-to-Market Acceleration Sprint',
    domain: 'GROWTH & POSITIONING',
    protocolNumber: 89,
    protocolName: 'Go-to-Market Acceleration Protocol',
    description: 'Market window opens requiring accelerated product launch or market entry ahead of original timeline.',
    defaultRoles: [
      { id: 'ceo', title: 'Chief Executive Officer', level: 'C-Suite', domain: 'Executive', notifyMethod: 'Immediate', isRequired: true },
      { id: 'cmo', title: 'Chief Marketing Officer', level: 'C-Suite', domain: 'Marketing', notifyMethod: 'Immediate', isRequired: true },
      { id: 'cro', title: 'Chief Revenue Officer', level: 'C-Suite', domain: 'Sales', notifyMethod: 'Immediate', isRequired: true },
      { id: 'cto', title: 'Chief Product Officer', level: 'C-Suite', domain: 'Product', notifyMethod: 'Immediate', isRequired: true },
      { id: 'coo', title: 'Chief Operating Officer', level: 'C-Suite', domain: 'Operations', notifyMethod: 'Standard', isRequired: false },
      { id: 'cfo', title: 'Chief Financial Officer', level: 'C-Suite', domain: 'Finance', notifyMethod: 'Standard', isRequired: false },
    ],
    defaultVariants: [
      { id: 'competitor', name: '+ Competitor About to Launch', description: 'Intelligence indicates competitor launch within same window', detectionSignal: 'Competitor job postings, event schedule, or partner announcement suggests < 30-day launch window' },
      { id: 'budget', name: '+ Emergency Budget Required', description: 'Acceleration requires unplanned budget authorization', detectionSignal: 'Plan-to-execute cost delta exceeds CFO standing pre-approval threshold' },
      { id: 'channel', name: '+ Channel Partner Constraint', description: 'Key distribution partner availability limits execution speed', detectionSignal: 'Channel partner confirms capacity constraint or competing launch scheduled in window' },
    ]
  },
  {
    id: 'workforce-transformation',
    name: 'Workforce Transformation',
    domain: 'TRANSFORMATION',
    protocolNumber: 112,
    protocolName: 'Workforce Transformation Protocol',
    description: 'Significant workforce restructuring, reduction in force, or capability transformation program requiring coordinated execution.',
    defaultRoles: [
      { id: 'ceo', title: 'Chief Executive Officer', level: 'C-Suite', domain: 'Executive', notifyMethod: 'Immediate', isRequired: true },
      { id: 'chro', title: 'Chief People Officer', level: 'C-Suite', domain: 'HR', notifyMethod: 'Immediate', isRequired: true },
      { id: 'cfo', title: 'Chief Financial Officer', level: 'C-Suite', domain: 'Finance', notifyMethod: 'Immediate', isRequired: true },
      { id: 'gc', title: 'General Counsel', level: 'C-Suite', domain: 'Legal', notifyMethod: 'Immediate', isRequired: true },
      { id: 'cco', title: 'Chief Communications Officer', level: 'C-Suite', domain: 'Communications', notifyMethod: 'Immediate', isRequired: true },
      { id: 'board', title: 'Board Chair', level: 'Board', domain: 'Governance', notifyMethod: 'Standard', isRequired: false },
      { id: 'coo', title: 'Chief Operating Officer', level: 'C-Suite', domain: 'Operations', notifyMethod: 'Standard', isRequired: false },
    ],
    defaultVariants: [
      { id: 'union', name: '+ Union / Collective Bargaining', description: 'Affected workforce includes union-represented employees', detectionSignal: 'Legal confirms WARN Act or CBA notification obligations triggered' },
      { id: 'media', name: '+ Media / Public Visibility', description: 'Workforce action becomes public before communication plan executes', detectionSignal: 'Leak to media or employee social post precedes official announcement' },
      { id: 'regulatory', name: '+ Regulatory Compliance Required', description: 'Jurisdiction-specific regulatory obligations activated', detectionSignal: 'Legal identifies WARN Act, TUPE, or local equivalents applicable to affected population' },
    ]
  },
];

const CELL_SUGGESTIONS: Record<string, Record<string, { primary: string; signal: string; auth: string }>> = {
  'gc': {
    'base': { primary: 'Issue litigation hold immediately. Brief outside counsel. Assess disclosure obligations and privilege boundaries.', signal: 'Formal government communication received — subpoena, CID, or formal notice.', auth: 'Execute independently up to retaining outside counsel. Board notification required before any voluntary disclosure.' },
    'media': { primary: 'Prepare no-comment holding statement. Brief CEO on media protocol. No substantive comment without board clearance.', signal: 'PR team flags media inquiry or regulatory filing becomes public.', auth: 'No-comment policy executes automatically. Any deviation from no-comment requires CEO approval.' },
    'deadline': { primary: 'Activate response timeline. Assign document review team. Prepare draft response for CEO/board review 72 hours before deadline.', signal: 'Deadline letter received or calendar alert fires at T-30 days.', auth: 'Response submission requires CEO and board chair co-authorization.' },
    'board-esc': { primary: 'Prepare board briefing memo. Quantify exposure range. Brief board counsel independently.', signal: 'Exposure assessment exceeds material threshold or outside counsel recommends board notification.', auth: 'Board meeting scheduling requires CEO authorization. Briefing materials pre-cleared by GC.' },
  },
  'ceo': {
    'base': { primary: 'Declare internal crisis protocol activated. Brief board chair. Restrict public statements to authorized spokespersons only.', signal: 'GC or CISO confirms trigger activation threshold reached.', auth: 'Activates protocol independently. Board chair notification required within 2 hours.' },
    'media': { primary: 'Approve holding statement. Brief executive team on media protocol. Consider CEO statement timeline with GC.', signal: 'CCO confirms media inquiry received or story imminent.', auth: 'All external statements require GC clearance. Board chair informed before any CEO public appearance.' },
    'board-esc': { primary: 'Convene emergency board session within 24 hours. Prepare executive summary and recommended action plan.', signal: 'GC recommends board escalation or CFO confirms material financial exposure.', auth: 'Emergency board session convened on CEO authority. Full board quorum required for material decisions.' },
  },
  'cfo': {
    'base': { primary: 'Assess financial exposure range. Activate reserve review. Brief audit committee chair. Suspend share repurchase if material.', signal: 'GC confirms materiality threshold analysis underway.', auth: 'Reserves activated up to pre-approved threshold. Above threshold requires board authorization.' },
    'media': { primary: 'Prepare investor communication hold. Brief IR team on trading window status. Coordinate with outside counsel on disclosure timing.', signal: 'CCO or GC confirms public disclosure is imminent or has occurred.', auth: 'Trading window suspension executes automatically on CFO authority. Material disclosure requires board.' },
    'board-esc': { primary: 'Prepare financial exposure presentation for board. Quantify scenarios: base, adverse, severe. Include insurance coverage analysis.', signal: 'CEO confirms board escalation decision.', auth: 'Board presentation prepared on CFO authority. All figures reviewed by outside counsel before board submission.' },
  },
  'cco': {
    'base': { primary: 'Activate communications hold. Brief media relations team. Prepare internal employee communication draft for GC review.', signal: 'Protocol activation confirmed by CEO or GC.', auth: 'Internal communications require CEO and GC clearance. External communications require GC and CEO approval.' },
    'media': { primary: 'Execute media protocol. Deploy designated spokesperson. Issue holding statement. Monitor media coverage in real time.', signal: 'Media inquiry received or story published.', auth: 'Holding statement releases on CCO authority. Substantive response requires CEO and GC co-authorization.' },
    'board-esc': { primary: 'Prepare board communication brief. Develop stakeholder map: employees, investors, customers, regulators.', signal: 'CEO confirms board escalation and communication sequencing.', auth: 'Stakeholder communication sequence approved by CEO and GC before any outreach.' },
  },
  'ciso': {
    'base': { primary: 'Initiate forensic investigation. Isolate affected systems. Preserve evidence chain. Engage incident response retainer.', signal: 'SIEM alert or endpoint detection confirms anomaly crossing threshold.', auth: 'System isolation executes immediately on CISO authority. Retainer engagement requires CTO co-authorization.' },
    'data-breach': { primary: 'Confirm scope of exfiltration. Quantify records affected. Brief GC on notification obligations immediately.', signal: 'Forensic firm confirms data movement outside organizational perimeter.', auth: 'Forensic engagement authorized. Regulatory notification decision requires GC and CEO authorization.' },
    'regulatory': { primary: 'Prepare technical incident report for regulatory submission. Document timeline, scope, and containment actions.', signal: 'GC confirms regulatory notification obligation has been triggered.', auth: 'Technical report submitted to GC for legal review before any regulatory filing.' },
  },
  'board': {
    'base': { primary: 'Receive CEO briefing. Confirm board quorum availability for emergency session. Activate board crisis committee if constituted.', signal: 'CEO notification received per protocol.', auth: 'Board chair convenes emergency session on own authority within 24 hours of CEO notification.' },
    'board-esc': { primary: 'Convene full board session. Review GC exposure analysis. Authorize response strategy. Engage independent board counsel if warranted.', signal: 'CEO requests emergency board session.', auth: 'Full board vote required for any settlement authority, material disclosure, or strategic response beyond pre-approved thresholds.' },
    'hostile': { primary: 'Activate fiduciary duty protocol. Engage independent financial advisor. Constitute special committee if required by governance.', signal: 'CEO and GC confirm hostile approach indicators.', auth: 'Special committee formation requires full board vote. All M&A decisions require board authorization.' },
  },
};

const BASE_VARIANT: SituationVariant = {
  id: 'base',
  name: 'Base Situation',
  description: 'The trigger fires in its standard form — no additional complications present.',
  detectionSignal: 'Primary trigger threshold crossed.',
  isBase: true,
};

const LEVEL_COLORS: Record<string, string> = {
  'Board': '#7C3AED',
  'C-Suite': NAVY,
  'VP': TEAL,
  'Director': GOLD,
  'Manager': '#6B7280',
};

const DOMAIN_COLORS: Record<string, string> = {
  'GROWTH & POSITIONING': GOLD,
  'RISK & RESILIENCE': TEAL,
  'TRANSFORMATION': NAVY,
};

// ─── Step Components ──────────────────────────────────────────────────────────

function StepIndicator({ step, current }: { step: number; current: number }) {
  const done = current > step;
  const active = current === step;
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
      done ? 'text-white' : active ? 'text-white' : 'text-gray-400 bg-gray-100'
    }`} style={done ? { background: TEAL } : active ? { background: NAVY } : {}}>
      {done ? <CheckCircle2 className="h-4 w-4" /> : step}
    </div>
  );
}

// ─── Step 1: Trigger Selection ────────────────────────────────────────────────

function Step1TriggerSelection({
  selected, onSelect
}: { selected: TriggerTemplate | null; onSelect: (t: TriggerTemplate) => void }) {
  const [search, setSearch] = useState('');
  const [domain, setDomain] = useState<string>('all');

  const filtered = TRIGGER_TEMPLATES.filter(t =>
    (domain === 'all' || t.domain === domain) &&
    (t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div className="mb-6">
        <div className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: GOLD }}>Step 1 of 6</div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: NAVY }}>Select the trigger scenario</h2>
        <p className="text-sm text-gray-600">Choose the situation your organization needs to be ready for. The system will pre-populate your roles and protocol template.</p>
      </div>

      <div className="flex gap-3 mb-5">
        <div className="flex-1 relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-gray-400"
            placeholder="Search triggers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {['all', 'GROWTH & POSITIONING', 'RISK & RESILIENCE', 'TRANSFORMATION'].map(d => (
            <button
              key={d}
              onClick={() => setDomain(d)}
              className="px-3 py-2 text-xs font-bold tracking-wide rounded-sm border transition-all"
              style={domain === d
                ? { background: NAVY, color: '#fff', borderColor: NAVY }
                : { background: '#fff', color: '#6B7280', borderColor: '#E5E7EB' }}
            >
              {d === 'all' ? 'All Domains' : d === 'GROWTH & POSITIONING' ? 'Growth' : d === 'RISK & RESILIENCE' ? 'Risk' : 'Transformation'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {filtered.map(t => (
          <button
            key={t.id}
            onClick={() => onSelect(t)}
            className="text-left p-5 border rounded-sm transition-all hover:shadow-sm"
            style={selected?.id === t.id
              ? { borderColor: NAVY, background: NAVY + '06', boxShadow: `0 0 0 2px ${NAVY}20` }
              : { borderColor: '#E5E7EB', background: '#fff' }}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <span
                className="text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-sm"
                style={{ color: DOMAIN_COLORS[t.domain], background: DOMAIN_COLORS[t.domain] + '15' }}
              >
                {t.domain}
              </span>
              {selected?.id === t.id && <CheckCircle2 className="h-4 w-4 flex-shrink-0" style={{ color: TEAL }} />}
            </div>
            <div className="text-sm font-bold mb-1" style={{ color: NAVY }}>{t.name}</div>
            <div className="text-xs text-gray-500 mb-3 leading-relaxed">{t.description}</div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-sm" style={{ background: TEAL + '15', color: TEAL }}>
                Protocol #{t.protocolNumber}
              </span>
              <span className="text-[10px] text-gray-500">{t.protocolName}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Step 2: Role Configuration ───────────────────────────────────────────────

function Step2Roles({
  roles, onAddRole, onRemoveRole, onToggleRequired
}: {
  roles: RoleRow[];
  onAddRole: (r: RoleRow) => void;
  onRemoveRole: (id: string) => void;
  onToggleRequired: (id: string) => void;
}) {
  const [newTitle, setNewTitle] = useState('');
  const [newLevel, setNewLevel] = useState('VP');
  const [newDomain, setNewDomain] = useState('');

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    onAddRole({
      id: `custom-${Date.now()}`,
      title: newTitle.trim(),
      level: newLevel,
      domain: newDomain || 'Custom',
      notifyMethod: 'Standard',
      isRequired: false,
      isCustom: true
    });
    setNewTitle('');
    setNewDomain('');
  };

  return (
    <div>
      <div className="mb-6">
        <div className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: GOLD }}>Step 2 of 6</div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: NAVY }}>Configure your organizational roles</h2>
        <p className="text-sm text-gray-600">Pre-populated from your protocol template. Confirm, remove, or add roles specific to your organization.</p>
      </div>

      <div className="space-y-2 mb-6">
        {roles.map(role => (
          <div
            key={role.id}
            className="flex items-center justify-between p-4 border rounded-sm bg-white"
            style={{ borderColor: role.isRequired ? NAVY + '30' : '#E5E7EB' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                style={{ background: LEVEL_COLORS[role.level] || NAVY }}
              >
                {role.title.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold" style={{ color: NAVY }}>{role.title}</span>
                  {role.isRequired && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm" style={{ background: NAVY + '10', color: NAVY }}>REQUIRED</span>
                  )}
                  {role.isCustom && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm" style={{ background: GOLD + '20', color: GOLD }}>CUSTOM</span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-bold" style={{ color: LEVEL_COLORS[role.level] }}>{role.level}</span>
                  <span className="text-[10px] text-gray-400">·</span>
                  <span className="text-[10px] text-gray-500">{role.domain}</span>
                  <span className="text-[10px] text-gray-400">·</span>
                  <span className="text-[10px] text-gray-500">Notify: {role.notifyMethod}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleRequired(role.id)}
                className="text-[10px] font-bold px-2 py-1 rounded-sm border transition-all"
                style={role.isRequired
                  ? { borderColor: NAVY, color: NAVY, background: NAVY + '08' }
                  : { borderColor: '#E5E7EB', color: '#9CA3AF' }}
              >
                {role.isRequired ? '✓ Required' : 'Mark Required'}
              </button>
              <button
                onClick={() => onRemoveRole(role.id)}
                className="p-1 text-gray-300 hover:text-gray-500 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border border-dashed border-gray-300 rounded-sm">
        <div className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-3">Add Custom Role</div>
        <div className="flex gap-2">
          <input
            className="flex-1 px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none"
            placeholder="Role title (e.g., VP Legal Operations)"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
          <select
            className="px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none"
            value={newLevel}
            onChange={e => setNewLevel(e.target.value)}
          >
            {['Board', 'C-Suite', 'VP', 'Director', 'Manager'].map(l => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
          <input
            className="w-32 px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none"
            placeholder="Domain"
            value={newDomain}
            onChange={e => setNewDomain(e.target.value)}
          />
          <Button onClick={handleAdd} size="sm" className="rounded-sm" style={{ background: NAVY, color: '#fff' }}>
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Step 3: Situation Variants ───────────────────────────────────────────────

function Step3Variants({
  variants, onAdd, onRemove, onUpdate
}: {
  variants: SituationVariant[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof SituationVariant, value: string) => void;
}) {
  return (
    <div>
      <div className="mb-6">
        <div className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: GOLD }}>Step 3 of 6</div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: NAVY }}>Define your situation variants</h2>
        <p className="text-sm text-gray-600">These are the columns of your call sheet — the different forms this trigger can take. Every role will have a specific responsibility for each variant.</p>
      </div>

      <div className="space-y-3 mb-5">
        {variants.map((v, i) => (
          <div key={v.id} className="border rounded-sm p-4 bg-white" style={{ borderColor: v.isBase ? NAVY + '40' : '#E5E7EB' }}>
            <div className="flex items-start gap-3">
              <div
                className="w-7 h-7 rounded-sm flex items-center justify-center text-xs font-bold text-white mt-0.5 flex-shrink-0"
                style={{ background: v.isBase ? NAVY : TEAL }}
              >
                {v.isBase ? '★' : i}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  {v.isBase ? (
                    <span className="text-sm font-bold" style={{ color: NAVY }}>{v.name}</span>
                  ) : (
                    <input
                      className="flex-1 text-sm font-bold bg-transparent border-b border-dashed border-gray-300 focus:outline-none pb-0.5"
                      style={{ color: NAVY }}
                      value={v.name}
                      onChange={e => onUpdate(v.id, 'name', e.target.value)}
                    />
                  )}
                  {v.isBase && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm" style={{ background: NAVY + '10', color: NAVY }}>ALWAYS PRESENT</span>}
                </div>
                {!v.isBase && (
                  <>
                    <input
                      className="w-full text-xs text-gray-600 bg-transparent border-b border-dashed border-gray-200 focus:outline-none pb-0.5"
                      placeholder="When does this variant apply?"
                      value={v.description}
                      onChange={e => onUpdate(v.id, 'description', e.target.value)}
                    />
                    <input
                      className="w-full text-xs text-gray-500 bg-transparent border-b border-dashed border-gray-200 focus:outline-none pb-0.5"
                      placeholder="Detection signal — what tells the system this variant is active?"
                      value={v.detectionSignal}
                      onChange={e => onUpdate(v.id, 'detectionSignal', e.target.value)}
                    />
                  </>
                )}
                {v.isBase && (
                  <p className="text-xs text-gray-500">{v.description}</p>
                )}
              </div>
              {!v.isBase && (
                <button onClick={() => onRemove(v.id)} className="text-gray-300 hover:text-gray-500 transition-colors">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {variants.length < 6 && (
        <button
          onClick={onAdd}
          className="w-full p-3 border border-dashed border-gray-300 rounded-sm text-sm font-bold text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Situation Variant (max 5)
        </button>
      )}

      <div className="mt-4 p-3 rounded-sm" style={{ background: GOLD + '10', border: `1px solid ${GOLD}25` }}>
        <p className="text-xs text-gray-600">
          <strong style={{ color: NAVY }}>Good variants are detection-driven.</strong> Each variant should have a specific, observable signal that confirms it's active — not a judgment call. The system uses these signals to surface the right execution track when the trigger fires.
        </p>
      </div>
    </div>
  );
}

// ─── Step 4: The Matrix ───────────────────────────────────────────────────────

interface CellEditorProps {
  cell: MatrixCell;
  role: RoleRow;
  variant: SituationVariant;
  onChange: (updates: Partial<MatrixCell>) => void;
  onAcceptSuggestion: () => void;
}

function CellEditor({ cell, role, variant, onChange, onAcceptSuggestion }: CellEditorProps) {
  const [open, setOpen] = useState(false);
  const isComplete = cell.primaryResponsibility && cell.watchSignal && cell.authorizationCriteria;
  const hasSuggestion = !!cell.suggestion;

  return (
    <div
      className="border rounded-sm cursor-pointer transition-all"
      style={{
        borderColor: isComplete ? TEAL + '50' : open ? NAVY + '40' : '#E5E7EB',
        background: isComplete ? TEAL + '05' : '#fff',
        minHeight: 72
      }}
    >
      <div className="p-3 flex items-start justify-between gap-2" onClick={() => setOpen(!open)}>
        <div className="flex-1 min-w-0">
          {cell.primaryResponsibility ? (
            <p className="text-xs text-gray-700 leading-relaxed line-clamp-2">{cell.primaryResponsibility}</p>
          ) : (
            <p className="text-xs text-gray-300 italic">Click to define responsibility</p>
          )}
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {isComplete && <CheckCircle2 className="h-3.5 w-3.5" style={{ color: TEAL }} />}
          {hasSuggestion && !cell.isAccepted && (
            <span className="text-[9px] font-bold px-1 py-0.5 rounded-sm" style={{ background: GOLD + '20', color: GOLD }}>SUGGESTED</span>
          )}
          <ChevronDown className={`h-3.5 w-3.5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {open && (
        <div className="px-3 pb-3 border-t border-gray-100 pt-3" onClick={e => e.stopPropagation()}>
          {hasSuggestion && !cell.isAccepted && (
            <div className="mb-3 p-2.5 rounded-sm" style={{ background: GOLD + '10', border: `1px solid ${GOLD}25` }}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: GOLD }}>System Suggestion</span>
                <button
                  onClick={onAcceptSuggestion}
                  className="text-[10px] font-bold px-2 py-0.5 rounded-sm"
                  style={{ background: GOLD, color: '#fff' }}
                >
                  Accept All
                </button>
              </div>
              <p className="text-xs text-gray-700 line-clamp-2">{cell.suggestion!.primary}</p>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400 block mb-1">
                Primary Responsibility
              </label>
              <textarea
                className="w-full text-xs p-2 border border-gray-200 rounded-sm focus:outline-none resize-none"
                rows={3}
                placeholder="What does this role do when this situation activates?"
                value={cell.primaryResponsibility}
                onChange={e => onChange({ primaryResponsibility: e.target.value })}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400 block mb-1">
                Watch Signal
              </label>
              <textarea
                className="w-full text-xs p-2 border border-gray-200 rounded-sm focus:outline-none resize-none"
                rows={2}
                placeholder="What does this role watch for to know their situation variant has changed?"
                value={cell.watchSignal}
                onChange={e => onChange({ watchSignal: e.target.value })}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400 block mb-1">
                Authorization Criteria
              </label>
              <textarea
                className="w-full text-xs p-2 border border-gray-200 rounded-sm focus:outline-none resize-none"
                rows={2}
                placeholder="When does this role execute independently vs. escalate for authorization?"
                value={cell.authorizationCriteria}
                onChange={e => onChange({ authorizationCriteria: e.target.value })}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Step4Matrix({
  roles, variants, cells, onCellChange, onAcceptSuggestion, onAcceptAll
}: {
  roles: RoleRow[];
  variants: SituationVariant[];
  cells: MatrixCell[];
  onCellChange: (roleId: string, variantId: string, updates: Partial<MatrixCell>) => void;
  onAcceptSuggestion: (roleId: string, variantId: string) => void;
  onAcceptAll: () => void;
}) {
  const [acceptedAll, setAcceptedAll] = useState(false);

  const getCell = (roleId: string, variantId: string) =>
    cells.find(c => c.roleId === roleId && c.variantId === variantId) ||
    { roleId, variantId, primaryResponsibility: '', watchSignal: '', authorizationCriteria: '' };

  const completedCells = cells.filter(c => c.primaryResponsibility && c.watchSignal && c.authorizationCriteria).length;
  const suggestedCells = cells.filter(c => c.suggestion).length;
  const totalCells = roles.length * variants.length;
  const completionPct = Math.round((completedCells / totalCells) * 100);

  const handleAcceptAll = () => {
    onAcceptAll();
    setAcceptedAll(true);
  };

  return (
    <div>
      <div className="mb-5 flex items-start justify-between">
        <div>
          <div className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: GOLD }}>Step 4 of 6</div>
          <h2 className="text-2xl font-bold mb-1" style={{ color: NAVY }}>Build the call sheet</h2>
          <p className="text-sm text-gray-600">Every role. Every situation. Every responsibility defined before the trigger fires.</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold" style={{ color: completionPct === 100 ? TEAL : NAVY }}>{completionPct}%</div>
          <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Complete</div>
          <div className="text-xs text-gray-500">{completedCells}/{totalCells} cells</div>
        </div>
      </div>

      <div className="mb-3 bg-gray-100 rounded-none h-1.5">
        <div className="h-1.5 rounded-none transition-all" style={{ width: `${completionPct}%`, background: completionPct === 100 ? TEAL : GOLD }} />
      </div>

      {/* Fast Path Banner */}
      {!acceptedAll && suggestedCells > 0 && completionPct < 100 && (
        <div
          className="p-4 rounded-sm mb-4 flex items-center justify-between gap-4"
          style={{ background: NAVY, border: `1px solid ${NAVY}` }}
        >
          <div className="flex items-start gap-3">
            <Zap className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: GOLD }} />
            <div>
              <div className="text-sm font-bold text-white mb-0.5">Need to move fast?</div>
              <div className="text-xs text-white/60">
                Accept all {suggestedCells} system suggestions instantly — publish a complete call sheet now, refine the detail on your own schedule.
              </div>
            </div>
          </div>
          <button
            onClick={handleAcceptAll}
            className="flex-shrink-0 px-5 py-2 rounded-sm text-xs font-bold tracking-wide transition-all hover:opacity-90"
            style={{ background: GOLD, color: NAVY }}
          >
            Accept All Suggestions
          </button>
        </div>
      )}

      {acceptedAll && (
        <div
          className="p-3 rounded-sm mb-4 flex items-center gap-3"
          style={{ background: TEAL + '10', border: `1px solid ${TEAL}30` }}
        >
          <CheckCircle2 className="h-4 w-4 flex-shrink-0" style={{ color: TEAL }} />
          <span className="text-xs font-bold text-gray-700">
            All suggestions accepted — call sheet is complete. Open any cell to customize for your organization.
          </span>
        </div>
      )}

      {!acceptedAll && suggestedCells === 0 && (
        <div className="p-3 rounded-sm mb-4 flex items-center gap-2" style={{ background: TEAL + '10', border: `1px solid ${TEAL}20` }}>
          <Star className="h-4 w-4 flex-shrink-0" style={{ color: TEAL }} />
          <span className="text-xs font-bold text-gray-700">
            Click any cell to define the responsibility, watch signal, and authorization criteria for that role and situation.
          </span>
        </div>
      )}

      {/* Matrix Grid */}
      <div className="overflow-x-auto">
        <div style={{ minWidth: variants.length * 240 + 180 }}>
          {/* Header Row */}
          <div className="flex gap-2 mb-2">
            <div style={{ width: 180, flexShrink: 0 }} />
            {variants.map(v => (
              <div key={v.id} style={{ width: 240, flexShrink: 0 }}>
                <div
                  className="px-3 py-2 rounded-sm"
                  style={{ background: v.isBase ? NAVY : NAVY + 'DD' }}
                >
                  <div className="text-[10px] font-bold tracking-widest uppercase text-white/60 mb-0.5">
                    {v.isBase ? 'BASE' : 'VARIANT'}
                  </div>
                  <div className="text-xs font-bold text-white">{v.name}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Role Rows */}
          {roles.map(role => (
            <div key={role.id} className="flex gap-2 mb-2">
              {/* Role Label */}
              <div style={{ width: 180, flexShrink: 0 }} className="flex items-start pt-1">
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                      style={{ background: LEVEL_COLORS[role.level] || NAVY }}
                    >
                      {role.title.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                    </div>
                    <span className="text-xs font-bold" style={{ color: NAVY }}>{role.title}</span>
                  </div>
                  <span className="text-[10px]" style={{ color: LEVEL_COLORS[role.level] }}>{role.level}</span>
                  {role.isRequired && (
                    <span className="ml-1.5 text-[9px] font-bold px-1 py-0.5 rounded-sm" style={{ background: NAVY + '10', color: NAVY }}>REQ</span>
                  )}
                </div>
              </div>

              {/* Cells */}
              {variants.map(v => {
                const cell = getCell(role.id, v.id);
                return (
                  <div key={v.id} style={{ width: 240, flexShrink: 0 }}>
                    <CellEditor
                      cell={cell as MatrixCell}
                      role={role}
                      variant={v}
                      onChange={updates => onCellChange(role.id, v.id, updates)}
                      onAcceptSuggestion={() => onAcceptSuggestion(role.id, v.id)}
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Step 5: Authorization Chain ──────────────────────────────────────────────

interface AuthChainConfig {
  primaryAuthorizer: string;
  delegateAuthorizer: string;
  escalationTimeHours: number;
  authMode: 'sequential' | 'parallel' | 'first-available';
  boardThreshold: string;
  preAuthorizedTasks: string[];
}

function Step5AuthChain({
  roles, config, onChange
}: { roles: RoleRow[]; config: AuthChainConfig; onChange: (c: Partial<AuthChainConfig>) => void }) {
  const executives = roles.filter(r => r.level === 'C-Suite' || r.level === 'Board');

  return (
    <div>
      <div className="mb-6">
        <div className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: GOLD }}>Step 5 of 6</div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: NAVY }}>Define the authorization chain</h2>
        <p className="text-sm text-gray-600">No Readiness Protocol executes without executive authorization. Define who approves, in what order, and under what conditions.</p>
      </div>

      <div className="space-y-5">
        <div className="p-5 bg-white border border-gray-100 rounded-sm shadow-sm">
          <div className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: NAVY }}>Authorization Mode</div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'sequential', label: 'Sequential', desc: 'Authorizers approve in order. Each waits for prior.' },
              { id: 'parallel', label: 'Parallel', desc: 'All authorizers notified simultaneously. All must approve.' },
              { id: 'first-available', label: 'First Available', desc: 'First authorizer to respond activates the protocol.' }
            ].map(mode => (
              <button
                key={mode.id}
                onClick={() => onChange({ authMode: mode.id as any })}
                className="p-4 border rounded-sm text-left transition-all"
                style={config.authMode === mode.id
                  ? { borderColor: NAVY, background: NAVY + '06' }
                  : { borderColor: '#E5E7EB' }}
              >
                <div className="text-sm font-bold mb-1" style={{ color: NAVY }}>{mode.label}</div>
                <div className="text-xs text-gray-500">{mode.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 bg-white border border-gray-100 rounded-sm shadow-sm">
            <div className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: NAVY }}>Primary Authorizer</div>
            <select
              className="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none"
              value={config.primaryAuthorizer}
              onChange={e => onChange({ primaryAuthorizer: e.target.value })}
            >
              <option value="">Select role...</option>
              {executives.map(r => <option key={r.id} value={r.title}>{r.title}</option>)}
            </select>
          </div>
          <div className="p-5 bg-white border border-gray-100 rounded-sm shadow-sm">
            <div className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: NAVY }}>Delegate (if unavailable)</div>
            <select
              className="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none"
              value={config.delegateAuthorizer}
              onChange={e => onChange({ delegateAuthorizer: e.target.value })}
            >
              <option value="">Select delegate...</option>
              {executives.map(r => <option key={r.id} value={r.title}>{r.title}</option>)}
            </select>
          </div>
        </div>

        <div className="p-5 bg-white border border-gray-100 rounded-sm shadow-sm">
          <div className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: NAVY }}>Escalation Timeout</div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={1} max={24} step={1}
              value={config.escalationTimeHours}
              onChange={e => onChange({ escalationTimeHours: Number(e.target.value) })}
              className="flex-1"
            />
            <div className="text-right w-24">
              <div className="text-xl font-bold" style={{ color: NAVY }}>{config.escalationTimeHours}h</div>
              <div className="text-[10px] text-gray-400">then auto-escalate</div>
            </div>
          </div>
        </div>

        <div className="p-5 bg-white border border-gray-100 rounded-sm shadow-sm">
          <div className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: NAVY }}>Board Escalation Threshold</div>
          <input
            className="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none"
            placeholder="e.g., Financial exposure > $10M, or legal materiality threshold reached"
            value={config.boardThreshold}
            onChange={e => onChange({ boardThreshold: e.target.value })}
          />
          <p className="text-xs text-gray-400 mt-2">When this threshold is met, the system automatically adds Board Chair to the authorization chain.</p>
        </div>
      </div>
    </div>
  );
}

// ─── Step 6: Call Sheet Review ────────────────────────────────────────────────

function Step6CallSheet({
  trigger, roles, variants, cells, authConfig, onPublish
}: {
  trigger: TriggerTemplate;
  roles: RoleRow[];
  variants: SituationVariant[];
  cells: MatrixCell[];
  authConfig: AuthChainConfig;
  onPublish: () => void;
}) {
  const getCell = (roleId: string, variantId: string) =>
    cells.find(c => c.roleId === roleId && c.variantId === variantId);

  const completedCells = cells.filter(c => c.primaryResponsibility).length;
  const totalCells = roles.length * variants.length;
  const readinessPct = Math.round((completedCells / totalCells) * 100);

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: GOLD }}>Step 6 of 6</div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: NAVY }}>Your call sheet</h2>
          <p className="text-sm text-gray-600">Review the complete protocol before publishing. This document is your organization's pre-staged response.</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold" style={{ color: readinessPct >= 80 ? TEAL : GOLD }}>{readinessPct}%</div>
          <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Readiness Score</div>
        </div>
      </div>

      {/* Protocol Header */}
      <div className="p-6 rounded-sm mb-6" style={{ background: NAVY }}>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: GOLD }}>
              Protocol #{trigger.protocolNumber} — {trigger.domain}
            </div>
            <h3 className="text-xl font-bold text-white mb-1">{trigger.protocolName}</h3>
            <p className="text-xs text-white/60">Trigger: {trigger.name}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold" style={{ color: TEAL }}>{roles.length}</div>
            <div className="text-[10px] text-white/50">Roles Configured</div>
            <div className="text-2xl font-bold mt-2" style={{ color: GOLD }}>{variants.length}</div>
            <div className="text-[10px] text-white/50">Situation Variants</div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-4 text-xs text-white/60">
          <span>Authorizer: <strong className="text-white">{authConfig.primaryAuthorizer || 'Not set'}</strong></span>
          <span>Mode: <strong className="text-white capitalize">{authConfig.authMode.replace('-', ' ')}</strong></span>
          <span>Escalation: <strong className="text-white">{authConfig.escalationTimeHours}h timeout</strong></span>
        </div>
      </div>

      {/* The Call Sheet Matrix */}
      <div className="overflow-x-auto mb-6">
        <div style={{ minWidth: variants.length * 200 + 160 }}>
          {/* Header */}
          <div className="flex gap-2 mb-1">
            <div style={{ width: 160, flexShrink: 0 }} />
            {variants.map(v => (
              <div key={v.id} style={{ width: 200, flexShrink: 0 }}
                className="px-3 py-2 text-[10px] font-bold tracking-widest uppercase text-white rounded-sm"
                style={{ background: v.isBase ? NAVY : TEAL }}
              >
                {v.name}
              </div>
            ))}
          </div>

          {roles.map((role, ri) => (
            <div key={role.id} className="flex gap-2 mb-1">
              <div style={{ width: 160, flexShrink: 0 }}
                className="px-3 py-3 rounded-sm flex items-center"
                style={{ background: ri % 2 === 0 ? '#F9FAFB' : '#F3F4F6' }}
              >
                <div>
                  <div className="text-xs font-bold" style={{ color: NAVY }}>{role.title}</div>
                  <div className="text-[10px]" style={{ color: LEVEL_COLORS[role.level] }}>{role.level}</div>
                </div>
              </div>
              {variants.map(v => {
                const cell = getCell(role.id, v.id);
                return (
                  <div key={v.id} style={{ width: 200, flexShrink: 0 }}
                    className="px-3 py-3 rounded-sm"
                    style={{ background: cell?.primaryResponsibility ? '#F0FDF4' : '#FAFAFA', border: `1px solid ${cell?.primaryResponsibility ? TEAL + '30' : '#E5E7EB'}` }}
                  >
                    {cell?.primaryResponsibility ? (
                      <p className="text-[11px] text-gray-700 leading-relaxed">{cell.primaryResponsibility}</p>
                    ) : (
                      <p className="text-[11px] text-gray-300 italic">Not defined</p>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Publish */}
      <div className="flex items-center justify-between p-5 rounded-sm" style={{ background: IVORY, border: `1px solid ${GOLD}30` }}>
        <div>
          <div className="text-sm font-bold" style={{ color: NAVY }}>Ready to publish this protocol</div>
          <div className="text-xs text-gray-500 mt-0.5">
            This becomes a live Readiness Protocol. The response is staged and ready before the trigger fires.
          </div>
        </div>
        <Button
          onClick={onPublish}
          className="rounded-sm font-bold tracking-wide px-8"
          style={{ background: NAVY, color: '#fff' }}
        >
          Publish Protocol <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

// ─── Published State ──────────────────────────────────────────────────────────

function PublishedState({ trigger, roles, variants }: { trigger: TriggerTemplate; roles: RoleRow[]; variants: SituationVariant[] }) {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: TEAL + '15' }}>
        <CheckCircle2 className="h-10 w-10" style={{ color: TEAL }} />
      </div>
      <div className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: TEAL }}>Protocol Live</div>
      <h2 className="text-3xl font-bold mb-3" style={{ color: NAVY }}>Call sheet published.</h2>
      <p className="text-base text-gray-600 mb-2 max-w-lg mx-auto">
        <strong style={{ color: NAVY }}>Protocol #{trigger.protocolNumber}</strong> is staged and ready.
        {roles.length} roles pre-assigned. {variants.length} situation variants pre-defined.
      </p>
      <p className="text-sm text-gray-500 mb-10 max-w-md mx-auto">
        The trigger doesn't create the response. It releases it.
      </p>
      <div className="flex items-center justify-center gap-4">
        <a href="/playbooks" className="px-6 py-2.5 rounded-sm text-sm font-bold border" style={{ borderColor: NAVY, color: NAVY }}>
          View Protocol Library
        </a>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 rounded-sm text-sm font-bold text-white"
          style={{ background: NAVY }}
        >
          Build Another Protocol
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const STEPS = [
  { num: 1, label: 'Trigger', icon: Target },
  { num: 2, label: 'Roles', icon: Users },
  { num: 3, label: 'Variants', icon: Layers },
  { num: 4, label: 'Call Sheet', icon: Grid3X3 },
  { num: 5, label: 'Authorization', icon: Lock },
  { num: 6, label: 'Publish', icon: Eye },
];

export default function ProtocolSituationMatrixBuilder() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [published, setPublished] = useState(false);

  const [selectedTrigger, setSelectedTrigger] = useState<TriggerTemplate | null>(null);
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [variants, setVariants] = useState<SituationVariant[]>([BASE_VARIANT]);
  const [cells, setCells] = useState<MatrixCell[]>([]);
  const [authConfig, setAuthConfig] = useState<AuthChainConfig>({
    primaryAuthorizer: '',
    delegateAuthorizer: '',
    escalationTimeHours: 4,
    authMode: 'sequential',
    boardThreshold: '',
    preAuthorizedTasks: [],
  });

  const selectTrigger = (t: TriggerTemplate) => {
    setSelectedTrigger(t);
    setRoles(t.defaultRoles.map(r => ({ ...r })));
    setVariants([BASE_VARIANT, ...t.defaultVariants.map(v => ({ ...v }))]);
  };

  const seedCells = useCallback(() => {
    if (!selectedTrigger) return;
    const newCells: MatrixCell[] = [];
    roles.forEach(role => {
      variants.forEach(v => {
        const suggestion = CELL_SUGGESTIONS[role.id]?.[v.id];
        newCells.push({
          roleId: role.id,
          variantId: v.id,
          primaryResponsibility: suggestion?.primary || '',
          watchSignal: suggestion?.signal || '',
          authorizationCriteria: suggestion?.auth || '',
          suggestion: suggestion ? { primary: suggestion.primary, signal: suggestion.signal, auth: suggestion.auth } : undefined,
          isAccepted: !!suggestion,
        });
      });
    });
    setCells(newCells);
  }, [roles, variants, selectedTrigger]);

  const goToStep = (step: number) => {
    if (step === 4 && cells.length === 0) seedCells();
    setCurrentStep(step);
  };

  const next = () => {
    if (currentStep === 1 && !selectedTrigger) {
      toast({ title: 'Select a trigger first', description: 'Choose the situation your organization needs to be ready for.' });
      return;
    }
    if (currentStep === 2 && roles.length === 0) {
      toast({ title: 'Add at least one role', description: 'Your call sheet needs organizational roles.' });
      return;
    }
    goToStep(currentStep + 1);
  };

  const handleCellChange = (roleId: string, variantId: string, updates: Partial<MatrixCell>) => {
    setCells(prev => {
      const existing = prev.find(c => c.roleId === roleId && c.variantId === variantId);
      if (existing) return prev.map(c => c.roleId === roleId && c.variantId === variantId ? { ...c, ...updates } : c);
      return [...prev, { roleId, variantId, primaryResponsibility: '', watchSignal: '', authorizationCriteria: '', ...updates }];
    });
  };

  const handleAcceptAll = () => {
    setCells(prev => prev.map(c => {
      if (c.suggestion) {
        return {
          ...c,
          primaryResponsibility: c.suggestion.primary,
          watchSignal: c.suggestion.signal,
          authorizationCriteria: c.suggestion.auth,
          isAccepted: true,
        };
      }
      return c;
    }));
  };

  const handleAcceptSuggestion = (roleId: string, variantId: string) => {
    setCells(prev => prev.map(c => {
      if (c.roleId === roleId && c.variantId === variantId && c.suggestion) {
        return {
          ...c,
          primaryResponsibility: c.suggestion.primary,
          watchSignal: c.suggestion.signal,
          authorizationCriteria: c.suggestion.auth,
          isAccepted: true,
        };
      }
      return c;
    }));
  };

  const addRole = (r: RoleRow) => setRoles(prev => [...prev, r]);
  const removeRole = (id: string) => setRoles(prev => prev.filter(r => r.id !== id));
  const toggleRequired = (id: string) => setRoles(prev => prev.map(r => r.id === id ? { ...r, isRequired: !r.isRequired } : r));

  const addVariant = () => {
    const id = `custom-${Date.now()}`;
    setVariants(prev => [...prev, {
      id, name: 'New Variant — name this situation',
      description: '', detectionSignal: '', isCustom: true
    }]);
  };
  const removeVariant = (id: string) => setVariants(prev => prev.filter(v => v.id !== id));
  const updateVariant = (id: string, field: keyof SituationVariant, value: string) =>
    setVariants(prev => prev.map(v => v.id === id ? { ...v, [field]: value } : v));

  if (published && selectedTrigger) {
    return (
      <PageLayout>
        <div className="max-w-3xl mx-auto px-6 py-16">
          <PublishedState trigger={selectedTrigger} roles={roles} variants={variants} />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Page Header */}
        <div className="mb-8">
          <div className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: GOLD }}>— Protocol Situation Matrix Builder</div>
          <h1 className="text-3xl font-bold mb-1" style={{ color: NAVY }}>Build your call sheet.</h1>
          <p className="text-sm text-gray-500">Every role. Every situation. Every responsibility defined before the trigger fires.</p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Steps */}
          <div className="w-52 flex-shrink-0">
            <div className="sticky top-8">
              <div className="space-y-1">
                {STEPS.map((step, i) => {
                  const Icon = step.icon;
                  const done = currentStep > step.num;
                  const active = currentStep === step.num;
                  const available = selectedTrigger || step.num === 1;
                  return (
                    <button
                      key={step.num}
                      onClick={() => available && goToStep(step.num)}
                      disabled={!available}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm transition-all text-left"
                      style={active
                        ? { background: NAVY, color: '#fff' }
                        : done
                          ? { background: TEAL + '10', color: TEAL }
                          : { color: '#9CA3AF' }}
                    >
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                        style={active ? { background: GOLD, color: NAVY } : done ? { background: TEAL, color: '#fff' } : { background: '#E5E7EB', color: '#9CA3AF' }}
                      >
                        {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : step.num}
                      </div>
                      <div>
                        <div className="text-xs font-bold">{step.label}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {selectedTrigger && (
                <div className="mt-6 p-3 rounded-sm" style={{ background: NAVY + '08', border: `1px solid ${NAVY}15` }}>
                  <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">Building For</div>
                  <div className="text-xs font-bold" style={{ color: NAVY }}>{selectedTrigger.name}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">Protocol #{selectedTrigger.protocolNumber}</div>
                  <div className="mt-2 text-[10px] text-gray-400">
                    {roles.length} roles · {variants.length} variants
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="bg-white border border-gray-100 rounded-sm shadow-sm p-8">
              {currentStep === 1 && (
                <Step1TriggerSelection selected={selectedTrigger} onSelect={selectTrigger} />
              )}
              {currentStep === 2 && (
                <Step2Roles roles={roles} onAddRole={addRole} onRemoveRole={removeRole} onToggleRequired={toggleRequired} />
              )}
              {currentStep === 3 && (
                <Step3Variants variants={variants} onAdd={addVariant} onRemove={removeVariant} onUpdate={updateVariant} />
              )}
              {currentStep === 4 && (
                <Step4Matrix
                  roles={roles}
                  variants={variants}
                  cells={cells}
                  onCellChange={handleCellChange}
                  onAcceptSuggestion={handleAcceptSuggestion}
                  onAcceptAll={handleAcceptAll}
                />
              )}
              {currentStep === 5 && (
                <Step5AuthChain roles={roles} config={authConfig} onChange={u => setAuthConfig(p => ({ ...p, ...u }))} />
              )}
              {currentStep === 6 && selectedTrigger && (
                <Step6CallSheet
                  trigger={selectedTrigger}
                  roles={roles}
                  variants={variants}
                  cells={cells}
                  authConfig={authConfig}
                  onPublish={() => setPublished(true)}
                />
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(s => Math.max(1, s - 1))}
                  disabled={currentStep === 1}
                  className="rounded-sm text-xs font-bold tracking-wide"
                >
                  <ArrowLeft className="h-3.5 w-3.5 mr-1.5" /> Back
                </Button>
                {currentStep < 6 && (
                  <Button onClick={next} className="rounded-sm text-xs font-bold tracking-wide px-6" style={{ background: NAVY, color: '#fff' }}>
                    Continue <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
