import { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import PageLayout from '@/components/layout/PageLayout';
import { useAuth } from '@/hooks/useAuth';
import {
  AlertTriangle, CheckCircle2, ArrowRight, ChevronRight,
  Clock, Shield, Zap, Users, TrendingUp, FileText,
  Building2, Activity, Lock, Radio, Wifi, BarChart3
} from 'lucide-react';

/* ── Brand ─────────────────────────────────────────── */
const NAVY    = '#0A0F2E';
const GOLD    = '#C9A84C';
const TEAL    = '#2B8A6E';
const IVORY   = '#F0EDE4';
const RED     = '#C0392B';

/* ── Types ─────────────────────────────────────────── */
type ScenarioId = 'tech' | 'finance' | 'manufacturing' | 'healthcare';
type Stage = 'trigger' | 'detection' | 'playbook' | 'execution' | 'outcome';
const STAGES: Stage[] = ['trigger', 'detection', 'playbook', 'execution', 'outcome'];
const STAGE_LABELS: Record<Stage, string> = {
  trigger:   '1. The Trigger',
  detection: '2. Signal Detection',
  playbook:  '3. Playbook Matched',
  execution: '4. Execution Cascade',
  outcome:   '5. Outcome',
};

/* ── Scenario Data ─────────────────────────────────── */
interface Scenario {
  id: ScenarioId;
  industry: string;
  role: string;
  roleShort: string;
  title: string;
  synopsis: string;
  exposure: string;
  clock: string;
  icon: typeof Shield;
  color: string;
  trigger: {
    timestamp: string;
    event: string;
    detail: string;
    chaos: string[];
  };
  detection: {
    signals: { label: string; detail: string }[];
    confidence: number;
    domains: string[];
    leadTime: string;
  };
  playbook: {
    name: string;
    domain: string;
    phases: { phase: string; actions: string[] }[];
    preStaged: string[];
  };
  execution: {
    stakeholders: { role: string; action: string; time: string }[];
    tasks: { owner: string; task: string; due: string }[];
  };
  outcome: {
    rows: { metric: string; without: string; with: string }[];
    roi: { label: string; value: string }[];
    headline: string;
  };
}

const SCENARIOS: Record<ScenarioId, Scenario> = {
  tech: {
    id: 'tech',
    industry: 'Technology / SaaS',
    role: 'CEO + CISO',
    roleShort: 'CEO · CISO',
    title: 'Zero-Day Breach. SEC 4-Day Clock.',
    synopsis: 'Critical vulnerability in production. Customer PII exposed. SEC mandatory cyber disclosure window opens now.',
    exposure: '$47M avg breach cost',
    clock: '4-day SEC window',
    icon: Shield,
    color: '#3B5BDB',
    trigger: {
      timestamp: 'TUESDAY · 11:47 PM',
      event: 'Zero-day vulnerability confirmed in production. Customer data exposed.',
      detail: 'Your CISO just confirmed a critical zero-day in your authentication infrastructure. Forensics estimates 340,000 customer records were accessible for 14 days. The SEC\'s mandatory 4-day cyber incident disclosure rule starts now. Your insurance carrier needs notification within 72 hours. The board chair will expect a briefing before markets open.',
      chaos: [
        'CISO, Legal, and PR have no pre-staged response framework — starting from zero at midnight',
        'SEC 8-K filing language being drafted for the first time under pressure',
        'Insurance carrier requires specific documentation — no one knows what to gather',
        'Board notification call scheduled for tomorrow — 8+ hours of coordination delay',
        'Customer notification timing debated in ad-hoc meetings — every hour of delay increases exposure',
      ],
    },
    detection: {
      signals: [
        { label: 'Anomalous API traffic pattern', detail: '3 days prior — 340% spike in auth endpoint queries from 7 IP ranges' },
        { label: 'Credential stuffing escalation', detail: '5 days prior — failed login rate crossed Tier-2 threshold across 3 regions' },
        { label: 'Dark web credential mention', detail: '8 days prior — company domain credentials appearing in breach database' },
        { label: 'Privilege escalation attempt', detail: '2 days prior — non-standard admin access pattern in production environment' },
      ],
      confidence: 96,
      domains: ['Technology', 'Regulatory', 'Reputation'],
      leadTime: '8 days of early signal — playbook pre-staged before the breach confirmed',
    },
    playbook: {
      name: 'Cybersecurity Breach — Critical Data Exposure',
      domain: 'Technology Risk',
      phases: [
        { phase: 'IDENTIFY', actions: ['Breach scope defined', 'Affected records quantified', 'Regulatory obligations mapped'] },
        { phase: 'DETECT',   actions: ['Forensics firm pre-approved', 'Evidence preservation protocol active', 'Insurance carrier pre-notified'] },
        { phase: 'EXECUTE',  actions: ['SEC 8-K draft pre-staged', 'Board brief template loaded', 'Customer notification sequence ready'] },
        { phase: 'ADVANCE',  actions: ['Post-incident review scheduled', 'Insurance claim initiated', 'Remediation roadmap deployed'] },
      ],
      preStaged: [
        'SEC 8-K cybersecurity incident language — pre-drafted, legal-reviewed',
        'Forensics firm retainer pre-signed — activated in minutes not days',
        'Customer notification template — pre-approved by Legal and PR',
        'Board crisis brief template — CISO + CEO narrative ready',
        'Insurance notification package — documentation checklist complete',
      ],
    },
    execution: {
      stakeholders: [
        { role: 'Board Chair',           action: 'Crisis brief transmitted — do not trade advisory issued',  time: '11:52 PM' },
        { role: 'General Counsel',       action: 'Litigation hold activated — evidence preservation in progress', time: '11:53 PM' },
        { role: 'Chief Comms Officer',   action: 'Customer notification draft delivered for review',          time: '11:55 PM' },
        { role: 'Insurance Carrier',     action: '72-hour breach notification package transmitted',           time: '11:57 PM' },
        { role: 'Forensics Firm',        action: 'Incident response team activated under pre-signed retainer', time: '11:59 PM' },
        { role: 'VP Engineering',        action: 'Patch deployment authorized — affected systems isolated',    time: '12:01 AM' },
      ],
      tasks: [
        { owner: 'CISO',            task: 'Contain breach — isolate affected authentication services',   due: 'Immediate'  },
        { owner: 'General Counsel', task: 'Activate litigation hold on all relevant communications',     due: '30 minutes' },
        { owner: 'CEO',             task: 'Board chair briefing call — SEC disclosure advisory',         due: '1 hour'     },
        { owner: 'Legal + IR',      task: 'SEC 8-K cybersecurity disclosure — file within 4 days',      due: '96 hours'   },
        { owner: 'Comms',           task: 'Customer notification — 340K affected users',                 due: '24 hours'   },
        { owner: 'Finance',         task: 'Insurance claim initiation — cyber policy documentation',     due: 'Same day'   },
        { owner: 'VP Engineering',  task: 'Patch zero-day — emergency change control authorized',        due: '6 hours'    },
      ],
    },
    outcome: {
      headline: '12 minutes after detection — board briefed, breach contained, SEC clock managed.',
      rows: [
        { metric: 'Time to board notification',       without: '8–14 hours',     with: '12 minutes'   },
        { metric: 'Forensics firm engaged',           without: '3–5 days',       with: 'Immediate'    },
        { metric: 'SEC 8-K language prepared',        without: 'From scratch',   with: 'Pre-staged'   },
        { metric: 'Insurance notification filed',     without: '48–72 hours',    with: '12 minutes'   },
        { metric: 'Customer notification authorized', without: '72–96 hours',    with: '24 hours'     },
        { metric: 'Coordination meetings required',   without: '12–18',          with: '0'            },
      ],
      roi: [
        { label: 'Average Fortune 1000 breach cost',    value: '$47M' },
        { label: 'Cost reduction — coordinated response', value: '$12–19M' },
        { label: 'Regulatory fine avoidance (GDPR/SEC)', value: 'Up to 4% revenue' },
      ],
    },
  },

  finance: {
    id: 'finance',
    industry: 'Financial Services',
    role: 'CFO + CEO',
    roleShort: 'CFO · CEO',
    title: 'Activist Investor. Market Opens in 2h 48min.',
    synopsis: 'Elliott Management files a Schedule 13D. 9.8% stake. Your stock moves the moment the market opens.',
    exposure: '$8–25M proxy fight cost',
    clock: '2h 48min to market open',
    icon: TrendingUp,
    color: '#C9A84C',
    trigger: {
      timestamp: 'MONDAY · 6:42 AM',
      event: 'Elliott Management files Schedule 13D. 9.8% stake. SEC filing public.',
      detail: 'Elliott Management has taken a 9.8% stake in your company and filed a Schedule 13D disclosing activist intent. The SEC filing is public. Bloomberg is already running the headline. Market opens in 2 hours and 48 minutes. Your stock will open down or up significantly depending on how the street reads your response. Every minute without a coordinated board and investor relations stance amplifies the movement.',
      chaos: [
        'Board chair is calling on personal cell — no pre-staged governance response',
        'IR team has no activist defense talking points — drafting from scratch',
        'Investment banker relationship not pre-activated — retainer negotiation in a crisis window',
        'Independent directors have not been briefed — corporate governance exposure',
        'Press statement being written for the first time under market-open deadline pressure',
      ],
    },
    detection: {
      signals: [
        { label: 'Elliott research activity detected', detail: '3 weeks prior — analyst team making targeted information requests on company' },
        { label: 'Unusual options activity', detail: '10 days prior — above-average call volume in 30-day expirations at 15% premium' },
        { label: 'Proxy advisory firm contact', detail: '6 days prior — ISS and Glass Lewis both receiving preliminary governance inquiries' },
        { label: 'Institutional accumulation pattern', detail: '14 days prior — 13F amendment filings showing coordinated accumulation below 5% disclosure threshold' },
      ],
      confidence: 91,
      domains: ['Finance', 'Board Governance', 'Market'],
      leadTime: '3 weeks of early signal — activist defense playbook pre-staged before filing',
    },
    playbook: {
      name: 'Activist Investor Response — Hostile Shareholder Campaign',
      domain: 'Corporate Governance',
      phases: [
        { phase: 'IDENTIFY', actions: ['Activist defense posture defined', 'Investment banker pre-qualified', 'Board governance review complete'] },
        { phase: 'DETECT',   actions: ['SEC filing monitoring active', 'Options anomaly alerts configured', 'IR talking points pre-drafted'] },
        { phase: 'EXECUTE',  actions: ['Banker retained in minutes', 'Board emergency call convened', 'Press statement authorized'] },
        { phase: 'ADVANCE',  actions: ['Investor outreach campaign launched', 'Board refreshment signaling', 'Strategic review announcement'] },
      ],
      preStaged: [
        'Investment banker retainer agreement — pre-negotiated, activates on trigger',
        'Activist defense IR talking points — pre-approved board narrative ready',
        'Independent director briefing pack — governance stance pre-documented',
        'Press statement template — legal-reviewed, customizable in minutes',
        'Anti-takeover provision review — bylaws and poison pill analysis complete',
      ],
    },
    execution: {
      stakeholders: [
        { role: 'Board Chair',          action: 'Emergency board call convened — governance stance briefed',    time: '6:47 AM' },
        { role: 'Investment Bank (GS)', action: 'Retained under pre-negotiated agreement — on a call by 7 AM', time: '6:49 AM' },
        { role: 'IR Director',          action: 'Activist defense talking points transmitted for analyst calls', time: '6:51 AM' },
        { role: 'General Counsel',      action: 'Anti-takeover provision review delivered — 382 analysis',      time: '6:53 AM' },
        { role: 'Independent Directors',action: 'Governance briefing transmitted — fiduciary response framed',  time: '6:55 AM' },
        { role: 'Corporate Secretary',  action: 'Rights plan documentation staged — board authorization ready', time: '6:57 AM' },
      ],
      tasks: [
        { owner: 'CEO + CFO',       task: 'Joint statement — strategic review and shareholder value commitment', due: 'Before open'  },
        { owner: 'IR Director',     task: 'Analyst outreach — proactive calls to top 20 institutional holders', due: 'Before open'  },
        { owner: 'Investment Bank', task: 'Fairness opinion engagement letter — defense advisory retained',      due: '7:30 AM'     },
        { owner: 'General Counsel', task: 'Board independent legal counsel engaged',                             due: 'Before open'  },
        { owner: 'Board Chair',     task: 'Emergency in-person board meeting — shareholder response vote',       due: '48 hours'    },
        { owner: 'CFO',             task: 'Accelerated share buyback authorization — signal commitment',        due: '24 hours'    },
        { owner: 'Comms',           task: 'Press release — constructive engagement statement published',         due: 'Before open'  },
      ],
    },
    outcome: {
      headline: '12 minutes after filing — board briefed, banker retained, statement ready before market open.',
      rows: [
        { metric: 'Time to board notification',          without: '4–8 hours',       with: '12 minutes'  },
        { metric: 'Investment banker retained',          without: '1–3 days',        with: 'Same morning' },
        { metric: 'IR talking points ready',             without: 'After open',      with: 'Before open'  },
        { metric: 'Press statement authorized',          without: 'Mid-morning',     with: 'Before open'  },
        { metric: 'Independent director briefing',       without: '24–48 hours',     with: '15 minutes'   },
        { metric: 'Coordination meetings required',      without: '8–14',            with: '0'            },
      ],
      roi: [
        { label: 'Proxy fight cost avoided',           value: '$8–25M' },
        { label: 'Stock price defense — narrative control', value: '±8–15% open' },
        { label: 'Board credibility — governance premium', value: 'Measurable long-term' },
      ],
    },
  },

  manufacturing: {
    id: 'manufacturing',
    industry: 'Manufacturing / Industrial',
    role: 'COO + CFO',
    roleShort: 'COO · CFO',
    title: 'Tier-1 Supplier Files Chapter 11. 48 Hours to Shutdown.',
    synopsis: 'Sole-source semiconductor supplier bankrupt. Production stops in 48 hours. $2.3M/day at risk.',
    exposure: '$2.3M/day production loss',
    clock: '48h to production halt',
    icon: Building2,
    color: '#2B8A6E',
    trigger: {
      timestamp: 'MONDAY · 7:15 AM',
      event: 'Your sole-source Tier-1 semiconductor supplier files Chapter 11.',
      detail: 'Your sole-source supplier for the microcontroller unit in your top-selling product line has filed Chapter 11 bankruptcy. They supply 94% of your MCU needs. On-hand inventory will sustain production for 48 hours. After that, your two assembly plants go dark. The quarterly revenue impact: $340M. Your three largest customers have contractual delivery commitments with penalty clauses. The board expects a recovery plan by end of day.',
      chaos: [
        'Supply chain team running emergency supplier searches — no pre-qualified alternates',
        'Legal reviewing force majeure clauses for the first time — outcome uncertain',
        'Customer relationship managers improvising communication with no approved script',
        'CFO modeling financial exposure in real-time — no pre-built scenario framework',
        'Board expects EOD briefing — no governance framework for supply chain crises',
      ],
    },
    detection: {
      signals: [
        { label: 'Supplier financial distress signal', detail: '6 weeks prior — credit rating downgrade + Days Sales Outstanding deterioration above threshold' },
        { label: 'Delayed shipment pattern',           detail: '3 weeks prior — 3 consecutive deliveries arriving 2–4 days late with no advance notice' },
        { label: 'Key account manager departure',      detail: '2 weeks prior — supplier\'s primary account contact resigned, followed by 2 engineers' },
        { label: 'Trade media signal',                 detail: '9 days prior — industry publication noted "restructuring discussions" in brief mention' },
      ],
      confidence: 88,
      domains: ['Operations', 'Supply Chain', 'Finance'],
      leadTime: '6 weeks of early signal — alternate suppliers pre-evaluated before bankruptcy',
    },
    playbook: {
      name: 'Critical Supplier Failure — Tier-1 Production Risk',
      domain: 'Supply Chain Continuity',
      phases: [
        { phase: 'IDENTIFY', actions: ['Tier-1 supplier risk registry complete', 'Alternate suppliers pre-qualified', 'Force majeure clauses pre-reviewed'] },
        { phase: 'DETECT',   actions: ['Supplier financial health monitoring active', 'Inventory buffer triggers configured', 'Customer SLA exposure mapped'] },
        { phase: 'EXECUTE',  actions: ['Alternate supplier POs issued', 'Customer communication transmitted', 'Board continuity brief delivered'] },
        { phase: 'ADVANCE',  actions: ['Dual-source strategy implemented', 'Inventory policy revised', 'Supplier risk scorecard updated'] },
      ],
      preStaged: [
        '3 alternate MCU suppliers pre-qualified — pricing, lead times, and samples already evaluated',
        'Emergency purchase order templates — legal terms pre-approved, activatable in minutes',
        'Customer communication script — force majeure declaration pre-reviewed by Legal',
        'Board supply chain crisis brief — financial exposure model pre-built',
        'Insurance claim checklist — business interruption policy documentation ready',
      ],
    },
    execution: {
      stakeholders: [
        { role: 'CEO',               action: 'Board recovery plan briefing transmitted',                         time: '7:22 AM' },
        { role: 'VP Supply Chain',   action: 'Emergency POs issued to 3 pre-qualified alternate suppliers',      time: '7:24 AM' },
        { role: 'General Counsel',   action: 'Force majeure review delivered — customer contracts analyzed',     time: '7:26 AM' },
        { role: 'VP Customer Success',action: 'Customer communication transmitted — pre-approved script',        time: '7:28 AM' },
        { role: 'CFO',               action: 'Financial exposure model delivered — insurance claim initiated',   time: '7:30 AM' },
        { role: 'VP Manufacturing',  action: 'Production triage plan — priority products identified',            time: '7:32 AM' },
      ],
      tasks: [
        { owner: 'VP Supply Chain',  task: 'Emergency PO — Alternate supplier A (pre-qualified, 3-week lead)',  due: 'Immediate'  },
        { owner: 'VP Supply Chain',  task: 'Air freight authorization — existing inventory extended 7 days',    due: '2 hours'    },
        { owner: 'General Counsel',  task: 'Force majeure notice — customer contracts with penalty clauses',    due: '4 hours'    },
        { owner: 'CFO',              task: 'Business interruption claim — insurance policy notification',        due: 'Same day'   },
        { owner: 'CEO',              task: 'Board EOD briefing — production recovery timeline',                  due: 'EOD'        },
        { owner: 'VP Manufacturing', task: 'Production triage — prioritize highest-margin/customer products',   due: '6 hours'    },
        { owner: 'Customer Success', task: 'Proactive outreach — top 10 accounts with delivery risk',           due: '3 hours'    },
      ],
    },
    outcome: {
      headline: '12 minutes after bankruptcy — alternate suppliers engaged, customers notified, board briefed.',
      rows: [
        { metric: 'Alternate supplier engaged',         without: '5–10 business days', with: 'Same morning'  },
        { metric: 'Customer communication sent',        without: '24–48 hours',        with: '12 minutes'    },
        { metric: 'Board recovery plan delivered',      without: '2–4 days',           with: 'Same morning'  },
        { metric: 'Force majeure review complete',      without: '3–5 days',           with: '12 minutes'    },
        { metric: 'Production halt averted',            without: 'High probability',   with: 'Pre-staged'    },
        { metric: 'Coordination meetings required',     without: '10–16',              with: '0'             },
      ],
      roi: [
        { label: 'Production loss per day avoided',     value: '$2.3M/day' },
        { label: 'Quarterly revenue protected',         value: '$340M at risk' },
        { label: 'Customer penalty clauses avoided',    value: 'Up to $42M' },
      ],
    },
  },

  healthcare: {
    id: 'healthcare',
    industry: 'Healthcare / Life Sciences',
    role: 'CEO + General Counsel',
    roleShort: 'CEO · GC',
    title: 'FDA Warning Letter. 15 Business Days.',
    synopsis: 'Unexpected Warning Letter on your top product line. Criminal exposure for named executives. Response must be perfect.',
    exposure: '$890M product line at risk',
    clock: '15 business days to respond',
    icon: FileText,
    color: '#9B2335',
    trigger: {
      timestamp: 'FRIDAY · 4:47 PM',
      event: 'FDA delivers Warning Letter. Top product line cited. 15 business days to respond.',
      detail: 'The FDA has delivered a Warning Letter citing GMP violations and marketing claim deficiencies on your top-selling product line — responsible for $890M in annual revenue. A Warning Letter is the last step before mandatory recall, import alert, or injunction. The 15-business-day response window is non-negotiable. Named executives face personal criminal liability if the response is inadequate. Your board\'s audit committee needs briefing. The clock starts now.',
      chaos: [
        'Regulatory affairs team assessing violations — no pre-staged CAPA framework',
        'FDA regulatory counsel being identified and retained for the first time',
        'Marketing suspension decision being debated without clear executive authority',
        'Board audit committee chair learning of this via email Monday morning',
        'Response strategy being developed in real-time — quality, legal, medical, communications all misaligned',
      ],
    },
    detection: {
      signals: [
        { label: 'FDA inspector activity escalation', detail: '8 weeks prior — 2 unannounced facility inspections in 6 weeks (Tier-2 monitoring threshold)' },
        { label: 'Competitor Warning Letter pattern',  detail: '4 weeks prior — competitor in same product category received Warning Letter for similar claims' },
        { label: 'Internal quality deviation trend',  detail: '6 weeks prior — 3 consecutive batch deviation reports above historical baseline' },
        { label: 'FDA import alert monitoring',       detail: '2 weeks prior — FDA OASIS system showing increased scrutiny on product category' },
      ],
      confidence: 85,
      domains: ['Regulatory', 'Legal', 'Reputation'],
      leadTime: '8 weeks of signal — response framework pre-staged before Warning Letter arrived',
    },
    playbook: {
      name: 'FDA Enforcement Action — Warning Letter Response',
      domain: 'Regulatory Compliance',
      phases: [
        { phase: 'IDENTIFY', actions: ['FDA response protocol defined', 'Regulatory counsel pre-retained', 'CAPA framework pre-built'] },
        { phase: 'DETECT',   actions: ['FDA enforcement monitoring active', 'Competitor regulatory tracking', 'Quality deviation alerts configured'] },
        { phase: 'EXECUTE',  actions: ['Litigation hold activated', 'Marketing suspension executed', 'FDA regulatory team mobilized'] },
        { phase: 'ADVANCE',  actions: ['CAPA submitted on time', 'Board audit committee briefed', 'Remediation monitoring active'] },
      ],
      preStaged: [
        'FDA regulatory counsel pre-retained — specialized firm on standby retainer',
        'Litigation hold protocol — pre-documented, legal-approved, activatable in minutes',
        'Marketing suspension procedure — pre-approved executive authority chain',
        'CAPA framework template — FDA-format Corrective and Preventive Action plan pre-structured',
        'Board audit committee brief — regulatory enforcement response template ready',
      ],
    },
    execution: {
      stakeholders: [
        { role: 'General Counsel',     action: 'Litigation hold activated — document preservation in progress', time: '4:52 PM' },
        { role: 'FDA Regulatory Counsel', action: 'Retained under pre-signed agreement — response lead assigned', time: '4:54 PM' },
        { role: 'Chief Medical Officer', action: 'Marketing suspension authority exercised — claims pulled',     time: '4:56 PM' },
        { role: 'Board Audit Chair',   action: 'Enforcement brief transmitted — fiduciary posture confirmed',    time: '4:58 PM' },
        { role: 'VP Regulatory Affairs', action: 'Violation analysis initiated — CAPA framework activated',     time: '5:00 PM' },
        { role: 'CEO',                 action: 'Executive response posture confirmed — no public comment policy', time: '5:02 PM' },
      ],
      tasks: [
        { owner: 'General Counsel',     task: 'Litigation hold — all communications, records, batch documentation', due: 'Immediate'     },
        { owner: 'FDA Counsel',         task: 'Warning Letter analysis — violation scope and response strategy',   due: '48 hours'     },
        { owner: 'VP Regulatory',       task: 'CAPA plan development — corrective actions with timelines',         due: '10 business days' },
        { owner: 'CMO',                 task: 'Marketing claim suspension — all channels, all markets',            due: 'Same day'     },
        { owner: 'Board Audit Chair',   task: 'Emergency audit committee session — enforcement posture review',    due: '48 hours'     },
        { owner: 'Comms',               task: 'No comment statement prepared — press inquiry routing protocol',    due: 'Same day'     },
        { owner: 'CEO + GC',            task: 'FDA response letter — submitted within 15 business days',           due: '15 biz days'  },
      ],
    },
    outcome: {
      headline: '12 minutes after Warning Letter — litigation hold active, counsel retained, board briefed.',
      rows: [
        { metric: 'Litigation hold activated',          without: '2–5 days',          with: '12 minutes'    },
        { metric: 'FDA regulatory counsel retained',    without: '3–7 days',          with: 'Same afternoon' },
        { metric: 'Marketing suspension executed',      without: '24–72 hours',       with: '12 minutes'    },
        { metric: 'Board audit committee briefed',      without: 'Monday morning',    with: '12 minutes'    },
        { metric: 'CAPA framework initiated',           without: 'Week 2',            with: 'Day 1'         },
        { metric: 'Response submitted on time',         without: 'High miss risk',    with: 'Pre-staged'    },
      ],
      roi: [
        { label: 'Product line revenue at risk',        value: '$890M/yr' },
        { label: 'Mandatory recall cost if delayed',    value: '$120–400M' },
        { label: 'Criminal liability mitigation',       value: 'Named executives protected' },
      ],
    },
  },
};

/* ── Scenario → Live Template Mapping ──────────────── */
const SCENARIO_TEMPLATE_MAP: Record<string, { id: string; name: string }> = {
  'Cybersecurity Breach — Critical Data Exposure': {
    id: '54f9a8e0-9fd9-40a0-90e6-173765e346e7',
    name: 'Vulnerability Disclosure (Zero-Day)',
  },
  'Activist Investor Response — Hostile Shareholder Campaign': {
    id: '3998652e-169e-407f-91f1-cbade5394659',
    name: 'Activist Investor Campaign',
  },
  'Critical Supplier Failure — Tier-1 Production Risk': {
    id: 'd57efcea-d6a4-46f5-8622-75170a7d3151',
    name: 'Primary Supplier Failure',
  },
  'FDA Enforcement Action — Warning Letter Response': {
    id: 'e9565223-ce5d-42f1-a296-fae2dcbf35ff',
    name: 'Product Recall (Safety)',
  },
};

/* ── Live Platform Data Hook ───────────────────────── */
interface LiveData {
  signalCount: number;
  detectionCount: number;
  lastScan: string;
  stakeholderCount: number;
  prepScore: number | null;
  matchedPlaybook: { id: string; name: string } | null;
  activationsTotal: number;
}

function useLivePlatformData(playbookName: string): LiveData {
  const { data: liveStatus }   = useQuery<any>({ queryKey: ['/api/signals/live/status'],           retry: false });
  const { data: detections }   = useQuery<any>({ queryKey: ['/api/detections'],                    retry: false });
  const { data: stakeholders } = useQuery<any>({ queryKey: ['/api/stakeholder-contacts'],          retry: false });
  const { data: templates }    = useQuery<any>({ queryKey: ['/api/playbooks/templates'],           retry: false });
  const { data: prepData }     = useQuery<any>({ queryKey: ['/api/preparedness/score'],            retry: false });
  const { data: activations }  = useQuery<any>({ queryKey: ['/api/playbook-activations/recent'],  retry: false });

  const detectionList   = Array.isArray(detections)   ? detections   : (detections?.data   ?? []);
  const stakeholderList = Array.isArray(stakeholders) ? stakeholders : (stakeholders?.data ?? []);
  const activationList  = Array.isArray(activations)  ? activations  : (activations?.data  ?? []);
  const templateList    = Array.isArray(templates)    ? templates    : (templates?.data     ?? []);

  const hardcoded = SCENARIO_TEMPLATE_MAP[playbookName] ?? null;
  const confirmed = hardcoded && templateList.some((t: any) => t.id === hardcoded.id)
    ? hardcoded
    : hardcoded ?? (() => {
        const keyword = playbookName.split('—')[0].trim().toLowerCase();
        const fuzzy = templateList.find((t: any) =>
          keyword.split(' ').filter((w: string) => w.length > 4).some((w: string) =>
            t.name?.toLowerCase().includes(w)
          )
        );
        return fuzzy ? { id: fuzzy.id, name: fuzzy.name } : null;
      })();

  return {
    signalCount:      liveStatus?.signalsIngested ?? liveStatus?.totalSignals ?? 0,
    detectionCount:   detectionList.length,
    lastScan:         liveStatus?.lastRun ?? liveStatus?.lastScanAt ?? '',
    stakeholderCount: stakeholderList.length,
    prepScore:        prepData?.score ?? prepData?.overallScore ?? null,
    matchedPlaybook:  confirmed,
    activationsTotal: activationList.length,
  };
}

/* ── Walk-Through Component ────────────────────────── */
function WalkThrough({ scenario, onBack }: { scenario: Scenario; onBack: () => void }) {
  const [stageIndex, setStageIndex] = useState(0);
  const stage = STAGES[stageIndex];
  const isFirst = stageIndex === 0;
  const isLast  = stageIndex === STAGES.length - 1;
  const live = useLivePlatformData(scenario.playbook.name);

  return (
    <div>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <button
          onClick={onBack}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', fontSize: 13, fontWeight: 600, padding: 0 }}
        >
          ← All Scenarios
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, background: scenario.color + '18', color: scenario.color, padding: '4px 10px', borderRadius: 3, letterSpacing: '0.06em' }}>
            {scenario.industry}
          </span>
          <span style={{ fontSize: 11, fontWeight: 700, background: '#F1F5F9', color: '#475569', padding: '4px 10px', borderRadius: 3 }}>
            {scenario.roleShort}
          </span>
        </div>
      </div>

      {/* Progress stepper */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 40, overflowX: 'auto', paddingBottom: 4 }}>
        {STAGES.map((s, i) => {
          const done    = i < stageIndex;
          const current = i === stageIndex;
          return (
            <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
              <button
                onClick={() => i <= stageIndex && setStageIndex(i)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: current ? NAVY : done ? '#F8FAFC' : '#F8FAFC',
                  border: `1px solid ${current ? NAVY : done ? '#CBD5E1' : '#E2E8F0'}`,
                  borderRadius: 4, padding: '8px 14px', cursor: i <= stageIndex ? 'pointer' : 'default',
                  whiteSpace: 'nowrap', transition: 'all 0.2s',
                }}
              >
                {done
                  ? <CheckCircle2 size={13} color={TEAL} />
                  : <span style={{ width: 18, height: 18, borderRadius: '50%', background: current ? GOLD : '#CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: current ? NAVY : '#94A3B8', flexShrink: 0 }}>{i + 1}</span>
                }
                <span style={{ fontSize: 12, fontWeight: 700, color: current ? '#F0EDE4' : done ? TEAL : '#94A3B8' }}>
                  {STAGE_LABELS[s].split('. ')[1]}
                </span>
              </button>
              {i < STAGES.length - 1 && (
                <div style={{ width: 24, height: 1, background: i < stageIndex ? TEAL : '#E2E8F0', flexShrink: 0 }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Stage content */}
      <div key={stage} style={{ animation: 'fadeInUp 0.3s ease' }}>
        {stage === 'trigger'    && <TriggerStage    scenario={scenario} />}
        {stage === 'detection'  && <DetectionStage  scenario={scenario} live={live} />}
        {stage === 'playbook'   && <PlaybookStage   scenario={scenario} live={live} />}
        {stage === 'execution'  && <ExecutionStage  scenario={scenario} live={live} />}
        {stage === 'outcome'    && <OutcomeStage    scenario={scenario} live={live} onBack={onBack} />}
      </div>

      {/* Navigation */}
      {!isLast && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 40 }}>
          <button
            onClick={() => setStageIndex(i => i + 1)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: NAVY, color: IVORY, border: 'none',
              borderRadius: 4, padding: '14px 32px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
            }}
          >
            Continue <ArrowRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Stage: Trigger ─────────────────────────────────── */
function TriggerStage({ scenario }: { scenario: Scenario }) {
  return (
    <div>
      <div style={{ background: NAVY, borderRadius: 8, padding: '40px 48px', marginBottom: 28, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(201,168,76,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.04) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <AlertTriangle size={14} color="#EF4444" />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#FF6B6B' }}>Trigger Event</span>
            <span style={{ marginLeft: 'auto', fontSize: 12, color: 'rgba(240,237,228,0.55)', fontWeight: 700, letterSpacing: '0.08em' }}>{scenario.trigger.timestamp}</span>
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(26px, 3vw, 40px)', fontWeight: 600, color: IVORY, lineHeight: 1.2, marginBottom: 20 }}>
            {scenario.trigger.event}
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(240,237,228,0.88)', lineHeight: 1.8, maxWidth: 720, fontWeight: 500 }}>
            {scenario.trigger.detail}
          </p>
        </div>
      </div>

      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: 16 }}>
          What happens in most organizations — without pre-staged execution
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {scenario.trigger.chaos.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, background: '#FFF5F5', border: '1px solid #FECACA', borderLeft: '3px solid #EF4444', borderRadius: 4, padding: '12px 16px' }}>
              <AlertTriangle size={14} color="#EF4444" style={{ marginTop: 2, flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.55, fontWeight: 500 }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: `${scenario.color}10`, border: `1px solid ${scenario.color}30`, borderLeft: `4px solid ${scenario.color}`, borderRadius: 4, padding: '20px 24px', marginTop: 28 }}>
        <p style={{ fontSize: 14, color: '#1E293B', lineHeight: 1.7, margin: 0, fontWeight: 600 }}>
          Without pre-staged execution, every decision is being made for the first time, under pressure, by people who haven't rehearsed this scenario. Command OS changes the constraint.
        </p>
      </div>
    </div>
  );
}

/* ── Stage: Detection ───────────────────────────────── */
function DetectionStage({ scenario, live }: { scenario: Scenario; live: LiveData }) {
  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h3 style={{ fontSize: 22, fontWeight: 700, color: NAVY, marginBottom: 8 }}>Command OS Detected This Coming</h3>
        <p style={{ fontSize: 14, color: '#475569', fontWeight: 500 }}>{scenario.detection.leadTime}</p>
      </div>

      {/* Live platform data strip */}
      <div style={{ background: 'linear-gradient(135deg, #0A0F2E 0%, #1a2456 100%)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 6, padding: '16px 24px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Radio size={12} color={GOLD} />
          <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', color: GOLD }}>Live Platform Activity</span>
        </div>
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'white', lineHeight: 1 }}>{live.signalCount > 0 ? live.signalCount.toLocaleString() : '—'}</div>
            <div style={{ fontSize: 10, color: 'rgba(240,237,228,0.6)', fontWeight: 600, marginTop: 2 }}>Signals Ingested</div>
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: TEAL, lineHeight: 1 }}>{live.detectionCount > 0 ? live.detectionCount : '—'}</div>
            <div style={{ fontSize: 10, color: 'rgba(240,237,228,0.6)', fontWeight: 600, marginTop: 2 }}>Active Detections</div>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'rgba(240,237,228,0.85)', lineHeight: 1 }}>221 Triggers</div>
            <div style={{ fontSize: 10, color: 'rgba(240,237,228,0.6)', fontWeight: 600, marginTop: 2 }}>Monitored Every 15 Min</div>
          </div>
        </div>
        {live.lastScan && (
          <div style={{ marginLeft: 'auto', fontSize: 10, color: 'rgba(240,237,228,0.45)', fontWeight: 500 }}>
            Last scan: {new Date(live.lastScan).toLocaleTimeString()}
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
        {scenario.detection.signals.map(({ label, detail }, i) => (
          <div key={i} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 6, padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: TEAL, flexShrink: 0 }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: NAVY }}>{label}</span>
            </div>
            <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>{detail}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 28 }}>
        <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 6, padding: '18px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: 36, fontWeight: 800, color: TEAL, marginBottom: 4 }}>{scenario.detection.confidence}%</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Trigger Confidence</div>
        </div>
        <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 6, padding: '18px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: 36, fontWeight: 800, color: '#2563EB', marginBottom: 4 }}>{scenario.detection.signals.length}</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Signals Detected</div>
        </div>
        <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 6, padding: '18px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#92400E', marginBottom: 4 }}>{scenario.detection.domains.length}</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Domains Lit</div>
          <div style={{ fontSize: 10, color: '#92400E', marginTop: 4 }}>{scenario.detection.domains.join(' · ')}</div>
        </div>
      </div>

      <div style={{ background: NAVY, borderRadius: 6, padding: '22px 28px' }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: GOLD, marginBottom: 10 }}>The Core Principle</div>
        <p style={{ fontSize: 15, color: 'rgba(240,237,228,0.90)', lineHeight: 1.75, margin: 0, fontWeight: 500 }}>
          AI monitored 221 trigger patterns across 248+ data points. When {scenario.detection.signals.length} signals converged, the {scenario.playbook.name.split('—')[0].trim()} playbook was automatically staged — before this trigger event ever occurred. The preparation happened before the pressure.
        </p>
      </div>
    </div>
  );
}

/* ── Stage: Playbook ────────────────────────────────── */
function PlaybookStage({ scenario, live }: { scenario: Scenario; live: LiveData }) {
  const [, navigate] = useLocation();
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: live.matchedPlaybook ? 16 : 28, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: TEAL, marginBottom: 8 }}>Playbook Activated</div>
          <h3 style={{ fontSize: 24, fontWeight: 700, color: NAVY, marginBottom: 6 }}>{scenario.playbook.name}</h3>
          <span style={{ fontSize: 12, background: '#F1F5F9', color: '#475569', padding: '4px 10px', borderRadius: 3, fontWeight: 600 }}>{scenario.playbook.domain}</span>
        </div>
        <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 6, padding: '14px 20px', textAlign: 'center', flexShrink: 0 }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: TEAL }}>12</div>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Minutes to<br/>Activate</div>
        </div>
      </div>

      {/* Live playbook match */}
      {live.matchedPlaybook ? (
        <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderLeft: `3px solid ${TEAL}`, borderRadius: 6, padding: '14px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Wifi size={14} color={TEAL} />
            <span style={{ fontSize: 12, fontWeight: 700, color: TEAL }}>This playbook exists in your live library —</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{live.matchedPlaybook.name}</span>
          </div>
          <button
            onClick={() => navigate(`/playbooks/${live.matchedPlaybook!.id}`)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: TEAL, color: 'white', border: 'none', borderRadius: 4, padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}
          >
            View Live Playbook <ArrowRight size={11} />
          </button>
        </div>
      ) : (
        <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 6, padding: '12px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
          <FileText size={13} color='#92400E' />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#92400E' }}>170 playbooks pre-staged in your library — this playbook activates the moment the trigger fires.</span>
        </div>
      )}

      {/* IDEA chain */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 28 }}>
        {scenario.playbook.phases.map(({ phase, actions }) => (
          <div key={phase} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 6, padding: '16px' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: GOLD, letterSpacing: '0.15em', marginBottom: 12 }}>{phase}</div>
            {actions.map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 6 }}>
                <CheckCircle2 size={11} color={TEAL} style={{ marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: '#374151', lineHeight: 1.5, fontWeight: 500 }}>{a}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Pre-staged elements */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: 14 }}>
          Pre-Staged Before the Trigger Fired
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {scenario.playbook.preStaged.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, background: '#F0FDF4', border: '1px solid #BBF7D0', borderLeft: '3px solid ' + TEAL, borderRadius: 4, padding: '12px 16px' }}>
              <CheckCircle2 size={14} color={TEAL} style={{ marginTop: 1, flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: '#1E293B', lineHeight: 1.55, fontWeight: 500 }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Stage: Execution ───────────────────────────────── */
function ExecutionStage({ scenario, live }: { scenario: Scenario; live: LiveData }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
        <div>
          <h3 style={{ fontSize: 22, fontWeight: 700, color: NAVY, marginBottom: 4 }}>Execution Cascade — 12 Minutes</h3>
          <p style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>Stakeholders notified and tasks deployed simultaneously. No coordination calls required.</p>
        </div>
        <div style={{ marginLeft: 'auto', background: NAVY, borderRadius: 6, padding: '12px 24px', textAlign: 'center', flexShrink: 0 }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 700, color: GOLD }}>12:00</div>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(240,237,228,0.6)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Execution Clock</div>
        </div>
      </div>

      {/* Live stakeholder data */}
      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderLeft: `3px solid ${NAVY}`, borderRadius: 6, padding: '14px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Users size={13} color={NAVY} />
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: NAVY }}>Your Org's Stakeholder Registry</span>
        </div>
        <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
          <div>
            <span style={{ fontSize: 22, fontWeight: 800, color: NAVY }}>{live.stakeholderCount > 0 ? live.stakeholderCount : scenario.execution.stakeholders.length}</span>
            <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600, marginLeft: 6 }}>
              {live.stakeholderCount > 0 ? 'Stakeholders Configured' : 'Scenario Stakeholders'}
            </span>
          </div>
          <div>
            <span style={{ fontSize: 22, fontWeight: 800, color: TEAL }}>{scenario.execution.tasks.length}</span>
            <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600, marginLeft: 6 }}>Tasks Pre-Staged</span>
          </div>
          {live.activationsTotal > 0 && (
            <div>
              <span style={{ fontSize: 22, fontWeight: 800, color: GOLD }}>{live.activationsTotal}</span>
              <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600, marginLeft: 6 }}>Playbook Activations</span>
            </div>
          )}
        </div>
      </div>

      {/* Stakeholders */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: 12 }}>Stakeholder Notifications</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {scenario.execution.stakeholders.map(({ role, action, time }, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '180px 1fr 80px', gap: 16, alignItems: 'center', background: '#F8FAFC', border: '1px solid #E2E8F0', borderLeft: `3px solid ${TEAL}`, borderRadius: 4, padding: '12px 16px' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: NAVY }}>{role}</span>
              <span style={{ fontSize: 12, color: '#475569', fontWeight: 500 }}>{action}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: TEAL, textAlign: 'right' }}>{time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tasks */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: 12 }}>Task Deployment</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 10 }}>
          {scenario.execution.tasks.map(({ owner, task, due }, i) => (
            <div key={i} style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 4, padding: '14px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: TEAL, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{owner}</span>
                <span style={{ fontSize: 10, color: '#64748B', fontWeight: 600 }}>Due: {due}</span>
              </div>
              <div style={{ fontSize: 13, color: '#1E293B', lineHeight: 1.45, fontWeight: 500 }}>{task}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Stage: Outcome ─────────────────────────────────── */
function OutcomeStage({ scenario, live, onBack }: { scenario: Scenario; live: LiveData; onBack: () => void }) {
  const [, navigate] = useLocation();
  return (
    <div>
      <div style={{ background: NAVY, borderRadius: 8, padding: '32px 40px', marginBottom: 28 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD, marginBottom: 12 }}>12 Minutes After Trigger</div>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: IVORY, lineHeight: 1.5, margin: 0 }}>{scenario.outcome.headline}</p>
      </div>

      {/* Before / After table */}
      <div style={{ borderRadius: 6, overflow: 'hidden', border: '1px solid #E2E8F0', marginBottom: 28 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
          {['Outcome', 'Without Command OS', 'With Command OS'].map((h, i) => (
            <div key={h} style={{ padding: '12px 20px', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: i === 2 ? TEAL : '#64748B' }}>{h}</div>
          ))}
        </div>
        {scenario.outcome.rows.map(({ metric, without, with: withVal }, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', borderBottom: i < scenario.outcome.rows.length - 1 ? '1px solid #F1F5F9' : 'none', background: i % 2 === 0 ? 'white' : '#FAFAFA' }}>
            <div style={{ padding: '13px 20px', fontSize: 13, color: '#374151', fontWeight: 500 }}>{metric}</div>
            <div style={{ padding: '13px 20px', fontSize: 13, color: RED, fontWeight: 700 }}>{without}</div>
            <div style={{ padding: '13px 20px', fontSize: 13, color: TEAL, fontWeight: 700 }}>{withVal}</div>
          </div>
        ))}
      </div>

      {/* ROI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 40 }}>
        {scenario.outcome.roi.map(({ label, value }) => (
          <div key={label} style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 6, padding: '20px' }}>
            <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#92400E', marginBottom: 8, fontWeight: 700 }}>{label}</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, color: '#78350F' }}>{value}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ background: NAVY, borderRadius: 8, padding: '32px 40px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 32, flexWrap: 'wrap', marginBottom: 28 }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: GOLD, marginBottom: 10 }}>This Is Running Now</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: IVORY, marginBottom: 8 }}>The Platform Behind This Scenario Is Live</h3>
            <p style={{ fontSize: 13, color: 'rgba(240,237,228,0.75)', lineHeight: 1.7, margin: 0, fontWeight: 500 }}>
              The playbooks, IDEA chain, and 12-minute clock shown above are the production platform — monitoring 221 triggers across 248+ data points for your organization right now.
            </p>
          </div>
          {live.prepScore !== null && (
            <div style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: 8, padding: '20px 28px', textAlign: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(240,237,228,0.55)', marginBottom: 6 }}>Your Readiness Score</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 700, color: live.prepScore >= 70 ? TEAL : GOLD, lineHeight: 1 }}>{live.prepScore}</div>
              <div style={{ fontSize: 10, color: 'rgba(240,237,228,0.45)', marginTop: 4, fontWeight: 600 }}>out of 100</div>
            </div>
          )}
          {live.detectionCount > 0 && (
            <div style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(43,138,110,0.3)', borderRadius: 8, padding: '20px 28px', textAlign: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(240,237,228,0.55)', marginBottom: 6 }}>Live Detections</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 700, color: TEAL, lineHeight: 1 }}>{live.detectionCount}</div>
              <div style={{ fontSize: 10, color: 'rgba(240,237,228,0.45)', marginTop: 4, fontWeight: 600 }}>active now</div>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/mission-control')}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: GOLD, color: NAVY, border: 'none', borderRadius: 4, padding: '13px 28px', fontSize: 14, fontWeight: 800, cursor: 'pointer' }}
          >
            <BarChart3 size={14} /> Enter Mission Control
          </button>
          <button
            onClick={() => navigate('/playbooks')}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', color: IVORY, border: '1px solid rgba(255,255,255,0.2)', borderRadius: 4, padding: '13px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
          >
            Browse 170 Playbooks <ChevronRight size={14} />
          </button>
          <button
            onClick={onBack}
            style={{ background: 'transparent', color: 'rgba(240,237,228,0.6)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 4, padding: '13px 24px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          >
            View Another Scenario
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ──────────────────────────────────────── */
export default function ExecutiveScenarioSuite() {
  const { user, isAuthenticated } = useAuth() as any;
  const [, navigate] = useLocation();
  const [selected, setSelected] = useState<ScenarioId | null>(null);

  if (!isAuthenticated) {
    return (
      <PageLayout>
        <div style={{ maxWidth: 520, margin: '120px auto', textAlign: 'center', padding: '0 24px' }}>
          <Lock size={32} color="#94A3B8" style={{ marginBottom: 20 }} />
          <h2 style={{ fontSize: 24, fontWeight: 700, color: NAVY, marginBottom: 12 }}>Access Required</h2>
          <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.7, marginBottom: 28 }}>
            The Executive Scenario Suite is available to authorized users. Request access to walk through full industry scenarios with real playbooks and execution data.
          </p>
          <button
            onClick={() => navigate('/request-access')}
            style={{ background: NAVY, color: IVORY, border: 'none', borderRadius: 4, padding: '13px 32px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
          >
            Request Access
          </button>
        </div>
      </PageLayout>
    );
  }

  if (selected) {
    const scenario = SCENARIOS[selected];
    return (
      <PageLayout>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px 80px' }}>
          <WalkThrough scenario={scenario} onBack={() => setSelected(null)} />
        </div>
        <style>{`@keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: 52 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 28, height: 1, background: GOLD }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD }}>
              Executive Scenario Suite · Authenticated
            </span>
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 600, color: NAVY, lineHeight: 1.15, marginBottom: 18 }}>
            Select Your Industry and Role.<br />
            <em style={{ color: TEAL }}>See Your Scenario.</em>
          </h1>
          <p style={{ fontSize: 16, color: '#475569', maxWidth: 620, lineHeight: 1.75, fontWeight: 500 }}>
            Each walk-through uses real Command OS playbooks, the full IDEA chain, and authentic 12-minute execution data — staged for the specific trigger your organization faces.
          </p>
        </div>

        {/* Scenario grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 20 }}>
          {(Object.values(SCENARIOS) as Scenario[]).map(scenario => {
            const Icon = scenario.icon;
            return (
              <div
                key={scenario.id}
                onClick={() => setSelected(scenario.id)}
                style={{
                  background: 'white', border: '1px solid #E2E8F0', borderTop: `4px solid ${scenario.color}`,
                  borderRadius: 8, padding: '28px 32px', cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                }}
                onMouseOver={e => { const el = e.currentTarget; el.style.boxShadow = '0 8px 32px rgba(0,0,0,0.10)'; el.style.transform = 'translateY(-2px)'; }}
                onMouseOut={e => { const el = e.currentTarget; el.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'; el.style.transform = 'translateY(0)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, background: scenario.color + '18', color: scenario.color, padding: '3px 10px', borderRadius: 3, letterSpacing: '0.05em' }}>
                        {scenario.industry}
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 700, background: '#F1F5F9', color: '#475569', padding: '3px 10px', borderRadius: 3 }}>
                        {scenario.roleShort}
                      </span>
                    </div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: NAVY, lineHeight: 1.3, marginBottom: 0 }}>{scenario.title}</h3>
                  </div>
                  <Icon size={22} color={scenario.color} style={{ flexShrink: 0, marginLeft: 12, marginTop: 2 }} />
                </div>

                <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.6, marginBottom: 20, fontWeight: 500 }}>{scenario.synopsis}</p>

                <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                  <div style={{ background: '#FFF5F5', border: '1px solid #FECACA', borderRadius: 4, padding: '8px 12px', flex: 1 }}>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 3 }}>Exposure</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: RED }}>{scenario.exposure}</div>
                  </div>
                  <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 4, padding: '8px 12px', flex: 1 }}>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 3 }}>Clock</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#92400E' }}>{scenario.clock}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: scenario.color }}>
                  Begin Walk-Through <ChevronRight size={14} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <div style={{ marginTop: 52, paddingTop: 28, borderTop: '1px solid #E2E8F0', textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500 }}>
            170 playbooks · 221 triggers · 9 strategic domains · 12-minute execution across all scenarios
          </p>
        </div>

      </div>
    </PageLayout>
  );
}
