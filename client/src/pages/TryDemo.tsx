import { useState, useEffect, useRef, CSSProperties } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import PageLayout from '@/components/layout/PageLayout';
import { PageHero } from '@/components/layout/PageHero';
import { useLocation, Link } from 'wouter';
import {
  BookOpen,
  Radar,
  Radio,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  AlertTriangle,
  DollarSign,
  Users,
  Zap,
  RefreshCw,
  Play,
  ChevronRight,
  Lightbulb,
  Target,
  TrendingUp,
  Brain,
  Shield,
  Clock,
  ArrowUpRight,
  Sparkles,
  Building2,
  Rocket,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  TrendingDown,
  XCircle,
  Volume2,
  VolumeX,
  ChevronDown,
  FileText,
  Briefcase,
  Scale,
  Crown,
  Factory,
  Pill,
  ShoppingCart,
  ExternalLink
} from 'lucide-react';
import { BrandStamp } from "@/components/BrandStamp";
import { SiSlack, SiJira, SiSalesforce, SiNotion } from 'react-icons/si';

const NAVY = "#0A0F2E";
const NAVY_MID = "#141B45";
const GOLD = "#C9A84C";
const GOLD_LT = "#DFC178";
const TEAL = "#2B8A6E";
const TEAL_LT = "#3BAF8A";
const OFF = "#F8F7F4";
const BORDER = "#E8E4DC";
const MUTED = "#6B7280";
const CG: CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

type Phase = 'select' | 'chaos' | 'identify' | 'detect' | 'execute' | 'advance' | 'complete';

interface Scenario {
  id: string;
  name: string;
  industry: string;
  domain: string;
  domainCount: number;
  icon: any;
  color: string;
  borderColor: string;
  trigger: string;
  playbook: string;
  dealValue: number;
  stakeholders: number;
  revenuePerMinute: number;
  chaosMessages: ChaosMessage[];
  demoType: 'offensive' | 'defensive';
}

interface ChaosMessage {
  id: string;
  type: 'slack' | 'email' | 'text' | 'calendar' | 'call';
  sender: string;
  content: string;
  urgency: 'critical' | 'high' | 'medium';
}

interface IndustryDemo {
  id: string;
  title: string;
  industry: string;
  icon: any;
  iconColor: string;
  bgColor: string;
  organization: string;
  impact: string;
  route: string;
  type: 'offensive' | 'defensive';
}

const INDUSTRY_DEMOS: IndustryDemo[] = [
  { id: 'lvmh', title: 'Strategic Market Entry', industry: 'Luxury', icon: Crown, iconColor: 'text-[#C9A84C]', bgColor: 'bg-white/5', organization: 'LVMH', impact: '€1.68B value', route: '/lvmh-demo', type: 'offensive' },
  { id: 'shein', title: 'Viral Trend Response', industry: 'Fashion', icon: TrendingUp, iconColor: 'text-[#C9A84C]', bgColor: 'bg-white/5', organization: 'SHEIN', impact: '$108M revenue', route: '/shein-demo', type: 'offensive' },
  { id: 'spacex', title: 'Launch Acceleration', industry: 'Aerospace', icon: Rocket, iconColor: 'text-[#2B8A6E]', bgColor: 'bg-white/5', organization: 'SpaceX', impact: '$47M value', route: '/spacex-demo', type: 'offensive' },
  { id: 'financial', title: 'Ransomware Response', industry: 'Finance', icon: Shield, iconColor: 'text-[#C9A84C]', bgColor: 'bg-white/5', organization: 'LoanDepot', impact: '$22M saved', route: '/financial-demo', type: 'defensive' },
  { id: 'pharma', title: 'Class I Recall', industry: 'Pharma', icon: Pill, iconColor: 'text-[#C9A84C]', bgColor: 'bg-white/5', organization: 'Glenmark', impact: 'Lives saved', route: '/pharma-demo', type: 'defensive' },
  { id: 'manufacturing', title: 'Supplier Crisis', industry: 'Automotive', icon: Factory, iconColor: 'text-[#C9A84C]', bgColor: 'bg-white/5', organization: 'Toyota', impact: '$450M saved', route: '/manufacturing-demo', type: 'defensive' },
  { id: 'retail', title: 'Food Contamination', industry: 'Retail', icon: ShoppingCart, iconColor: 'text-[#2B8A6E]', bgColor: 'bg-white/5', organization: 'Walmart', impact: '$245M + lives', route: '/retail-demo', type: 'defensive' },
  { id: 'energy', title: 'Grid Failure', industry: 'Energy', icon: Zap, iconColor: 'text-[#C9A84C]', bgColor: 'bg-white/5', organization: 'Pacific Grid', impact: '$2.5B saved', route: '/energy-demo', type: 'defensive' },
  { id: 'luxury-crisis', title: 'Revenue Collapse', industry: 'Luxury', icon: Building2, iconColor: 'text-[#C9A84C]', bgColor: 'bg-white/5', organization: 'LVMH', impact: '€280M preserved', route: '/luxury-demo', type: 'defensive' },
];

const SCENARIOS: Scenario[] = [
  {
    id: 'ransomware',
    name: 'Ransomware Attack',
    industry: 'Cybersecurity',
    domain: 'Technology & Innovation',
    domainCount: 20,
    icon: Shield,
    color: 'bg-[#0A0F2E]',
    borderColor: 'border-[#E8E4DC]',
    trigger: 'Unusual network activity detected at 2:47 AM',
    playbook: 'Cyber Incident Response',
    dealValue: 4880000,
    stakeholders: 12,
    revenuePerMinute: 8500,
    chaosMessages: [
      { id: '1', type: 'slack', sender: 'IT Security', content: '🚨 CRITICAL: File encryption detected on production servers. Spreading rapidly.', urgency: 'critical' },
      { id: '2', type: 'email', sender: 'Legal Team', content: 'RE: Breach notification requirements - We have 72 hours under GDPR. Need incident details ASAP.', urgency: 'critical' },
      { id: '3', type: 'slack', sender: 'CFO Office', content: 'Board is asking for immediate update. What do we tell them?', urgency: 'critical' },
      { id: '4', type: 'calendar', sender: 'Emergency Meeting', content: 'Crisis Response - War Room A - In 15 minutes', urgency: 'critical' },
      { id: '5', type: 'text', sender: 'Board Chair', content: 'Just saw the news alert. Call me immediately.', urgency: 'critical' },
      { id: '6', type: 'slack', sender: 'Customer Success', content: '47 enterprise customers reporting system access issues. What do we tell them?', urgency: 'high' },
      { id: '7', type: 'email', sender: 'PR Team', content: 'TechCrunch is calling. They have sources saying we\'ve been breached. Response needed in 30 min.', urgency: 'critical' },
      { id: '8', type: 'slack', sender: 'HR Director', content: 'Employees are panicking. Social media posts appearing. Need comms guidance NOW.', urgency: 'high' },
      { id: '9', type: 'call', sender: 'FBI Cyber Division', content: 'Incoming call regarding potential ransomware investigation', urgency: 'critical' },
      { id: '10', type: 'slack', sender: 'SOC Team', content: 'Ransom demand received: $15M in Bitcoin. 48-hour deadline.', urgency: 'critical' },
    ],
    demoType: 'defensive'
  },
  {
    id: 'competitor',
    name: 'Competitor Launch',
    industry: 'Competitive Response',
    domain: 'Market Dynamics',
    domainCount: 22,
    icon: Target,
    color: 'bg-[#2B8A6E]',
    borderColor: 'border-[#2B8A6E]/50',
    trigger: 'Major competitor announces product in your category',
    playbook: 'Competitive Response',
    dealValue: 47000000,
    stakeholders: 8,
    revenuePerMinute: 12000,
    chaosMessages: [
      { id: '1', type: 'slack', sender: 'Enterprise Sales', content: '🔴 Acme Corp just put our $2.4M renewal on hold. Citing competitor pricing.', urgency: 'critical' },
      { id: '2', type: 'email', sender: 'Sales Ops', content: 'Pipeline at risk: $47M in deals now reconsidering. Competitor offering 40% discounts.', urgency: 'critical' },
      { id: '3', type: 'slack', sender: 'Channel Partners', content: 'Three major partners asking about our response. Threatening to switch.', urgency: 'high' },
      { id: '4', type: 'text', sender: 'Board Member', content: 'Seeing the news. We need a response strategy today. Not tomorrow.', urgency: 'critical' },
      { id: '5', type: 'email', sender: 'CFO', content: 'If we match pricing, margin impact is $180M annually. Options?', urgency: 'critical' },
      { id: '6', type: 'slack', sender: 'Marketing', content: 'Should we counter with our own campaign? Need budget approval and messaging.', urgency: 'high' },
      { id: '7', type: 'calendar', sender: 'Emergency Pricing Committee', content: 'War Room - Competitive Response - NOW', urgency: 'critical' },
      { id: '8', type: 'text', sender: 'CEO', content: 'Wall Street Journal wants a statement. What\'s our position?', urgency: 'critical' },
      { id: '9', type: 'slack', sender: 'Field Sales', content: '6 demos cancelled today. Prospects saying "why bother when competitor is cheaper"', urgency: 'high' },
      { id: '10', type: 'email', sender: 'Analyst Relations', content: 'Gartner calling for comment. They\'re updating their MQ assessment.', urgency: 'high' },
    ],
    demoType: 'offensive'
  },
  {
    id: 'regulatory',
    name: 'SEC Investigation',
    industry: 'Compliance',
    domain: 'Regulatory & Compliance',
    domainCount: 15,
    icon: Scale,
    color: 'bg-[#C9A84C]',
    borderColor: 'border-[#C9A84C]/50',
    trigger: 'SEC enforcement notice received',
    playbook: 'Regulatory Response',
    dealValue: 120000000,
    stakeholders: 10,
    revenuePerMinute: 5000,
    chaosMessages: [
      { id: '1', type: 'email', sender: 'SEC Enforcement', content: 'Formal Document Preservation Notice - All employees must retain communications.', urgency: 'critical' },
      { id: '2', type: 'slack', sender: 'Audit Committee Chair', content: 'Need emergency meeting with external auditors. Today.', urgency: 'critical' },
      { id: '3', type: 'email', sender: 'External Counsel', content: 'Initiating investigation response protocol. $500K retainer required immediately.', urgency: 'critical' },
      { id: '4', type: 'text', sender: 'CFO', content: 'Auditors want to review ALL Q3 deal documentation. Full freeze on document deletion.', urgency: 'critical' },
      { id: '5', type: 'slack', sender: 'Investor Relations', content: 'Filing 8-K required within 4 business days. Draft needed.', urgency: 'high' },
      { id: '6', type: 'calendar', sender: 'Legal Hold Meeting', content: 'All executives - Document preservation briefing - MANDATORY', urgency: 'critical' },
      { id: '7', type: 'slack', sender: 'Finance Team', content: 'Restatement scenarios being modeled. Potential impact: $45M-$120M.', urgency: 'critical' },
      { id: '8', type: 'text', sender: 'Board Chair', content: 'WSJ has the story. Running tomorrow morning. We need to get ahead of this.', urgency: 'critical' },
      { id: '9', type: 'email', sender: 'HR Legal', content: 'Executive compensation clawback provisions activated. Review required.', urgency: 'high' },
      { id: '10', type: 'slack', sender: 'Communications', content: 'Employee town hall needed. Rumors spreading. Morale tanking.', urgency: 'high' },
    ],
    demoType: 'defensive'
  },
  {
    id: 'deal-risk',
    name: 'Deal at Risk',
    industry: 'Sales & Revenue',
    domain: 'Financial Strategy',
    domainCount: 24,
    icon: DollarSign,
    color: 'bg-[#2B8A6E]',
    borderColor: 'border-[#2B8A6E]/50',
    trigger: 'Customer requests accelerated timeline on $5M deal',
    playbook: 'Deal Risk Response',
    dealValue: 5000000,
    stakeholders: 6,
    revenuePerMinute: 3500,
    chaosMessages: [
      { id: '1', type: 'slack', sender: 'Account Executive', content: '🚨 GlobalTech just called - they need delivery 6 weeks early or deal is dead.', urgency: 'critical' },
      { id: '2', type: 'email', sender: 'VP Sales', content: 'This is our largest Q4 deal. Losing it puts us under forecast. Need options NOW.', urgency: 'critical' },
      { id: '3', type: 'slack', sender: 'Product Team', content: 'Accelerated timeline means cutting testing phase. Risk assessment needed.', urgency: 'high' },
      { id: '4', type: 'text', sender: 'CEO', content: 'I just heard about GlobalTech. What\'s our plan? Board meeting in 2 hours.', urgency: 'critical' },
      { id: '5', type: 'calendar', sender: 'Deal Review', content: 'Emergency Deal Strategy - All Hands - NOW', urgency: 'critical' },
      { id: '6', type: 'slack', sender: 'Finance', content: 'If we expedite, overtime costs are $340K. Need approval for budget exception.', urgency: 'high' },
      { id: '7', type: 'email', sender: 'Legal', content: 'Contract modification needed for new timeline. SLA penalties at risk.', urgency: 'high' },
      { id: '8', type: 'slack', sender: 'Customer Success', content: 'Customer asking why we can\'t match competitor\'s timeline. Losing confidence.', urgency: 'critical' },
      { id: '9', type: 'text', sender: 'CFO', content: 'Margin on expedited deal is 12% vs normal 28%. Is this worth it?', urgency: 'high' },
      { id: '10', type: 'slack', sender: 'Operations', content: 'Engineering says impossible. Sales says must happen. Need exec decision.', urgency: 'critical' },
    ],
    demoType: 'offensive'
  },
];

const SCENARIO_SIGNALS: Record<string, { label: string; source: string; strength: number }[]> = {
  ransomware: [
    { label: 'File encryption patterns across 3 production servers', source: 'EDR Console', strength: 34 },
    { label: 'Lateral movement detected — 14 hosts affected', source: 'SIEM Alert', strength: 68 },
    { label: 'Ransom executable confirmed — $15M demand received', source: 'Endpoint Agent', strength: 96 },
  ],
  competitor: [
    { label: 'Competitor pricing page updated — 40% reduction', source: 'Web Monitor', strength: 29 },
    { label: '3 enterprise accounts citing competitor in CRM notes', source: 'Salesforce Signal', strength: 63 },
    { label: 'Analyst firm labels competitor "emerging category leader"', source: 'News Intelligence', strength: 91 },
  ],
  regulatory: [
    { label: 'SEC EDGAR filing detected — subpoena language', source: 'Regulatory Feed', strength: 42 },
    { label: 'Legal hold keywords spike in email monitoring', source: 'Compliance Engine', strength: 74 },
    { label: 'External counsel retention initiated — document freeze', source: 'Legal System', strength: 95 },
  ],
  'deal-risk': [
    { label: 'Deal stalled 18 days past expected stage advance', source: 'CRM Intelligence', strength: 31 },
    { label: 'Customer engagement frequency dropped 80%', source: 'Engagement Tracker', strength: 62 },
    { label: 'Competitor mentioned in 3 recent call transcripts', source: 'Conversation AI', strength: 88 },
  ],
};

const SCENARIO_ADVANCE: Record<string, { patterns: string[]; improvements: string[]; stat: string }> = {
  ransomware: {
    patterns: ['Containment within 4 hours — below 6-hour industry median', 'Board notified before media inquiry — 47 min ahead', 'Ransomware strain matched to known actor — threat intel active'],
    improvements: ['Add automated backup verification trigger at Phase 1', 'Include cyber insurer notification in Phase 2 stakeholder list', 'Pre-stage FBI Cyber Division contact in war room template'],
    stat: '$4.9M ransom avoided through rapid containment',
  },
  competitor: {
    patterns: ['91% of at-risk pipeline contacted within 12 hours', 'Battle card deployed to 47 AEs before first customer call', 'Pricing committee decision made in 38 minutes vs. 30-day norm'],
    improvements: ['Add competitive intelligence trigger at 20% price delta (current: 30%)', 'Include channel partners in Phase 1 stakeholder notification', 'Stage CEO quote approval in Phase 2 communication assets'],
    stat: '$42M at-risk pipeline retained through rapid response',
  },
  regulatory: {
    patterns: ['Legal hold activated 2 hours before SEC timeline requirement', 'All 14 named executives briefed within 90 minutes', '8-K draft staged for board approval — 19 hours ahead of filing deadline'],
    improvements: ['Pre-load outside counsel engagement letter in playbook templates', 'Add IR firm to Phase 1 notifications (currently Phase 2)', 'Stage restatement scenario models as Phase 1 Finance task'],
    stat: 'Regulatory filing timeline met — zero compliance penalties',
  },
  'deal-risk': {
    patterns: ['CFO engaged within 22 minutes of deal risk flag', 'Accelerated timeline scope negotiated — delivery in 5 weeks vs. 6', 'Contract amendment executed same-day — deal preserved'],
    improvements: ['Set deal velocity trigger at 14 days stalled (current: 18)', 'Add procurement stakeholder mapping to Phase 1 task list', 'Include margin exception approval workflow in Phase 2'],
    stat: '$5M deal preserved — 28% margin maintained',
  },
};

const SCENARIO_PLAYBOOK_MAP: Record<string, { id: string; name: string; badge: string }> = {
  ransomware: {
    id: '65',
    name: 'Ransomware Attack',
    badge: 'Cyber & Technology',
  },
  competitor: {
    id: '5',
    name: 'Aggressive Pricing Disruption',
    badge: 'Market Dynamics — Free Sample',
  },
  regulatory: {
    id: '49',
    name: 'SEC Investigation Notice',
    badge: 'Regulatory & Compliance',
  },
  'deal-risk': {
    id: '12',
    name: 'Customer Consolidation to Competitor',
    badge: 'Market Dynamics',
  },
};

const PHASES = [
  { id: 'chaos' as Phase, name: 'THE CHAOS', icon: AlertTriangle, color: 'red', description: 'Without Execution OS' },
  { id: 'identify' as Phase, name: 'IDENTIFY', icon: BookOpen, color: 'teal', description: 'Playbook ready' },
  { id: 'detect' as Phase, name: 'DETECT', icon: Radar, color: 'navy', description: 'Signal detected' },
  { id: 'execute' as Phase, name: 'EXECUTE', icon: Radio, color: 'gold', description: 'Coordinate response' },
  { id: 'advance' as Phase, name: 'ADVANCE', icon: BarChart3, color: 'teal', description: 'Capture learnings' },
];

const MESSAGE_ICONS: Record<string, any> = {
  slack: SiSlack,
  email: Mail,
  text: MessageSquare,
  calendar: Calendar,
  call: Phone,
};

const PHASE_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  teal: { bg: 'bg-[#2B8A6E]/20', border: 'border-[#2B8A6E]', text: 'text-[#2B8A6E]' },
  navy: { bg: 'bg-[#0A0F2E]/20', border: 'border-[#0A0F2E]', text: 'text-[#0A0F2E]' },
  gold: { bg: 'bg-[#C9A84C]/20', border: 'border-[#C9A84C]', text: 'text-[#C9A84C]' },
  red: { bg: 'bg-red-600/20', border: 'border-red-600', text: 'text-red-600' },
};

const URGENCY_COLORS: Record<string, string> = {
  critical: 'bg-red-500/20 border-red-500 text-red-600',
  high: 'bg-[#C9A84C]/20 border-[#C9A84C] text-[#C9A84C]',
  medium: 'bg-[#C9A84C]/10 border-[#C9A84C]/50 text-[#C9A84C]',
};

export default function TryDemo() {
  const [, setLocation] = useLocation();
  const [currentPhase, setCurrentPhase] = useState<Phase>('select');
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [completedPhases, setCompletedPhases] = useState<Phase[]>([]);
  const [executionSteps, setExecutionSteps] = useState<any[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [learnings, setLearnings] = useState<any>(null);
  
  const [chaosMessages, setChaosMessages] = useState<ChaosMessage[]>([]);
  const [revenueLost, setRevenueLost] = useState(0);
  const [stressLevel, setStressLevel] = useState(0);
  const [chaosSeconds, setChaosSeconds] = useState(0);
  const [showChaosComplete, setShowChaosComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const [executionTimer, setExecutionTimer] = useState(0);
  const [savedValue, setSavedValue] = useState(0);
  const [detectStep, setDetectStep] = useState(0);

  const startDemo = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setCurrentPhase('chaos');
    setCompletedPhases([]);
    setExecutionSteps([]);
    setLearnings(null);
    setChaosMessages([]);
    setRevenueLost(0);
    setStressLevel(0);
    setChaosSeconds(0);
    setShowChaosComplete(false);
    setExecutionTimer(0);
    setSavedValue(0);
  };

  const resetDemo = () => {
    setCurrentPhase('select');
    setSelectedScenario(null);
    setCompletedPhases([]);
    setExecutionSteps([]);
    setLearnings(null);
    setChaosMessages([]);
    setRevenueLost(0);
    setStressLevel(0);
    setChaosSeconds(0);
    setShowChaosComplete(false);
    setExecutionTimer(0);
    setSavedValue(0);
    setDetectStep(0);
  };

  useEffect(() => {
    if (currentPhase === 'chaos' && selectedScenario && !showChaosComplete) {
      const messageInterval = setInterval(() => {
        setChaosMessages(prev => {
          if (prev.length >= selectedScenario.chaosMessages.length) {
            clearInterval(messageInterval);
            setTimeout(() => setShowChaosComplete(true), 2500);
            return prev;
          }
          return [...prev, selectedScenario.chaosMessages[prev.length]];
        });
      }, 2000);

      const timerInterval = setInterval(() => {
        setChaosSeconds(prev => prev + 1);
        setRevenueLost(prev => prev + (selectedScenario.revenuePerMinute / 60));
        setStressLevel(prev => Math.min(100, prev + 3));
      }, 1000);

      return () => {
        clearInterval(messageInterval);
        clearInterval(timerInterval);
      };
    }
  }, [currentPhase, selectedScenario, showChaosComplete]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [chaosMessages]);

  useEffect(() => {
    if (currentPhase !== 'select') {
      contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentPhase]);

  useEffect(() => {
    if (currentPhase === 'detect') {
      setDetectStep(0);
      const t1 = setTimeout(() => setDetectStep(1), 1500);
      const t2 = setTimeout(() => setDetectStep(2), 3500);
      const t3 = setTimeout(() => setDetectStep(3), 6000);
      const t4 = setTimeout(() => completeDetect(), 9000);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
    }
  }, [currentPhase]);

  const skipChaos = () => {
    if (selectedScenario) {
      setChaosMessages(selectedScenario.chaosMessages);
      setStressLevel(100);
      setRevenueLost(selectedScenario.revenuePerMinute * 3);
      setTimeout(() => setShowChaosComplete(true), 500);
    }
  };

  const moveToPrepared = () => {
    setCompletedPhases(prev => [...prev, 'chaos']);
    setCurrentPhase('identify');
  };

  const completeIdentify = () => {
    setCompletedPhases(prev => [...prev, 'identify']);
    setCurrentPhase('detect');
  };

  const completeDetect = () => {
    setCompletedPhases(prev => [...prev, 'detect']);
    setCurrentPhase('execute');
    simulateExecution();
  };

  const simulateExecution = () => {
    setIsExecuting(true);
    setExecutionTimer(0);
    
    const timerInterval = setInterval(() => {
      setExecutionTimer(prev => {
        if (prev >= 720) {
          clearInterval(timerInterval);
          return 720;
        }
        return prev + 12;
      });
      setSavedValue(prev => prev + ((selectedScenario?.dealValue || 5000000) / 60));
    }, 200);

    const steps = [
      { id: 1, title: 'Playbook Activated', description: `${selectedScenario?.playbook} triggered`, icon: Zap, integration: 'execution-os', delay: 0 },
      { id: 2, title: 'Stakeholders Notified', description: `${selectedScenario?.stakeholders} team members alerted`, icon: Users, integration: 'slack', delay: 1500 },
      { id: 3, title: 'Tasks Auto-Created', description: '12 tasks created with owners assigned', icon: CheckCircle2, integration: 'jira', delay: 3000 },
      { id: 4, title: 'War Room Launched', description: 'Collaboration channel created', icon: MessageSquare, integration: 'teams', delay: 4500 },
      { id: 5, title: 'Documents Staged', description: 'Response templates ready for review', icon: FileText, integration: 'notion', delay: 6000 },
      { id: 6, title: 'Executive Briefed', description: 'CEO notified with situation summary', icon: Briefcase, integration: 'salesforce', delay: 7500 },
      { id: 7, title: 'Budget Released', description: '$50K pre-approved budget unlocked', icon: DollarSign, integration: 'execution-os', delay: 9000 },
      { id: 8, title: 'Execution Complete', description: 'Coordinated response in 12 minutes', icon: CheckCircle2, integration: 'execution-os', delay: 11000 },
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setExecutionSteps(prev => [...prev, step]);
        if (index === steps.length - 1) {
          setIsExecuting(false);
          setCompletedPhases(prev => [...prev, 'execute']);
          setCurrentPhase('advance');
          clearInterval(timerInterval);
          setExecutionTimer(720);
        }
      }, step.delay);
    });
  };

  const completeAdvance = () => {
    const scenario = selectedScenario;
    setLearnings({
      dealContext: {
        dealName: scenario?.name || 'Strategic Event',
        dealAmount: scenario?.dealValue || 5000000,
      },
      successPatterns: [
        { category: 'Early Detection', insight: 'Signal detected 3 weeks before traditional discovery', impact: 'Proactive vs reactive response', icon: 'radar' },
        { category: 'Stakeholder Alignment', insight: `${scenario?.stakeholders || 6} stakeholders aligned in 12 minutes`, impact: 'Prevented conflicting communications', icon: 'users' },
        { category: 'Decision Velocity', insight: 'Executive sponsor briefed before escalation', impact: 'Maintained trust and momentum', icon: 'zap' },
      ],
      playbookImprovements: [
        { type: 'trigger', title: 'Add Competitive Intelligence Trigger', description: 'For deals over $3M, add competitor mention trigger', priority: 'high', estimatedImpact: 'Detect threats 2 weeks earlier' },
        { type: 'stakeholder', title: 'Include CFO in Budget Delays', description: 'Auto-loop CFO when approval >7 days', priority: 'medium', estimatedImpact: 'Reduce cycle by 4 days' },
      ],
      institutionalKnowledge: [
        { pattern: 'Timeline Compression Pattern', frequency: 'Occurs in 34% of enterprise deals', bestResponse: 'Proactive scope negotiation within 24 hours' },
      ],
      metrics: {
        dealValueProtected: scenario?.dealValue || 5000000,
        hoursRecovered: 98,
        costOfDelay: Math.round((scenario?.dealValue || 5000000) * 0.15),
        traditionalTime: 'days to weeks',
        responseTime: '12 minutes',
      },
      nextExecutionRecommendations: [
        'Apply improved playbook to similar scenarios in pipeline',
        'Schedule quarterly playbook review with leadership',
        'Train team on early signal recognition',
      ],
    });
    setCompletedPhases(prev => [...prev, 'advance']);
    setCurrentPhase('complete');
  };

  const getPhaseProgress = () => {
    const activePhases = PHASES.filter(p => p.id !== 'chaos');
    const phaseIndex = activePhases.findIndex(p => p.id === currentPhase);
    if (currentPhase === 'select' || currentPhase === 'chaos') return 0;
    if (currentPhase === 'complete') return 100;
    return ((phaseIndex + 1) / activePhases.length) * 100;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
  };

  const getIntegrationIcon = (integration: string) => {
    switch (integration) {
      case 'slack': return <SiSlack className="h-4 w-4 text-[#0A0F2E]" />;
      case 'jira': return <SiJira className="h-4 w-4 text-[#0A0F2E]" />;
      case 'teams': return <Users className="h-4 w-4 text-[#0A0F2E]" />;
      case 'salesforce': return <SiSalesforce className="h-4 w-4 text-[#0A0F2E]" />;
      case 'notion': return <SiNotion className="h-4 w-4 text-[#0A0F2E]" />;
      default: return <Zap className="h-4 w-4 text-[#2B8A6E]" />;
    }
  };

  return (
    <PageLayout>
      <PageHero
        eyebrow="Interactive Demo"
        title="Experience Execution OS"
        subtitle="Select a strategic scenario and see how Execution OS responds — from signal detection to full playbook execution in 12 minutes."
        size="md"
      />
      <main className="flex-1 py-8 md:py-12">
        <div ref={contentRef} className="max-w-6xl mx-auto px-4 md:px-6">
          {/* Header injected at top level — see PageHero above main */}

          {/* Scenario Selection */}
          {currentPhase === 'select' && (
            <div className="space-y-12">

              {/* Playbook Examples Callout */}
              <div style={{ background: 'rgba(201,168,76,0.07)', border: '1px solid rgba(201,168,76,0.35)', borderRadius: 8, padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <BookOpen style={{ width: 16, height: 16, color: GOLD, flexShrink: 0 }} />
                  <p style={{ fontSize: 13, color: NAVY, fontWeight: 600, margin: 0 }}>
                    Prefer to read first?{' '}
                    <span style={{ fontWeight: 400, color: MUTED }}>Explore 3 fully enriched playbooks — 4-phase plans, comms assets, and risk grids included. No login required.</span>
                  </p>
                </div>
                <button
                  onClick={() => { setLocation('/playbook-library'); window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }); }}
                  style={{ fontSize: 12, fontWeight: 700, color: GOLD, background: 'transparent', border: '1px solid rgba(201,168,76,0.4)', borderRadius: 6, padding: '6px 14px', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}
                >
                  View Playbook Examples →
                </button>
              </div>

              {/* Before / After — educational explainer */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, border: `1px solid ${BORDER}`, borderRadius: 10, overflow: 'hidden', marginBottom: 8 }}>
                {/* LEFT — Current State (the pain) */}
                <div style={{ background: '#F3F2EF', padding: '24px 22px', borderRight: `1px solid ${BORDER}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#DC2626' }} />
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#DC2626' }}>The Current State</span>
                  </div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e', marginBottom: 6, lineHeight: 1.35, fontFamily: "'Cormorant Garamond', serif" }}>A crisis hits. What happens next?</p>
                  <p style={{ fontSize: 12, color: '#4B5563', marginBottom: 16, lineHeight: 1.6 }}>Your executives spend the next 30 days doing the same thing they always do — scheduling meetings, aligning stakeholders, improvising.</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      ['4–8 hrs', 'Assembling the right people in a room'],
                      ['6–12 hrs', 'Locating documents, templates, precedents'],
                      ['12–24 hrs', 'Drafting a response plan from scratch'],
                      ['1–3 days', 'Chasing budget approvals and sign-offs'],
                      ['Throughout', 'Manual email chains, missed stakeholders'],
                    ].map(([time, desc]) => (
                      <div key={time} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#DC2626', background: 'rgba(220,38,38,0.08)', padding: '2px 6px', borderRadius: 3, flexShrink: 0, lineHeight: 1.6 }}>{time}</span>
                        <span style={{ fontSize: 12, color: '#374151', lineHeight: 1.5 }}>{desc}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid #D1D5DB' }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: '#4B5563' }}>The cost isn't just time.</p>
                    <p style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.55 }}>Every hour of coordination lag is revenue at risk, brand exposure, or competitive ground lost — permanently.</p>
                  </div>
                </div>

                {/* RIGHT — Execution OS way */}
                <div style={{ background: NAVY, padding: '24px 22px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: GOLD }} />
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD }}>With Execution OS</span>
                  </div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: '#FFFFFF', marginBottom: 6, lineHeight: 1.35, fontFamily: "'Cormorant Garamond', serif" }}>The same crisis. A completely different result.</p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 16, lineHeight: 1.6 }}>Your playbook was already built. The system was already watching.</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      { min: '0 min', text: 'AI detects the trigger across 248+ signal sources', color: GOLD },
                      { min: '2 min', text: 'Matched playbook activates — tasks assigned to named owners', color: '#3BAF8A' },
                      { min: '5 min', text: 'War room channel open, board communication staged', color: '#3BAF8A' },
                      { min: '8 min', text: 'Budget exception routed for approval automatically', color: '#3BAF8A' },
                      { min: '12 min', text: 'Full coordinated response underway — nothing improvised', color: GOLD },
                    ].map(({ min, text, color }) => (
                      <div key={min} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color, background: 'rgba(255,255,255,0.07)', padding: '2px 6px', borderRadius: 3, flexShrink: 0, lineHeight: 1.6 }}>{min}</span>
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>{text}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: 20 }}>
                    {[['170', 'Playbooks ready'], ['248+', 'Signals watched'], ['12 min', 'To execution']].map(([val, label]) => (
                      <div key={label}>
                        <p style={{ fontSize: 17, fontWeight: 700, color: GOLD, margin: 0, lineHeight: 1 }}>{val}</p>
                        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', margin: '2px 0 0', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <p style={{ fontSize: 12, fontWeight: 600, color: MUTED, textAlign: 'center', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Choose a scenario to watch this play out live</p>

              <div className="grid md:grid-cols-2 gap-6">
                {SCENARIOS.map((scenario) => (
                  <div
                    key={scenario.id}
                    onClick={() => startDemo(scenario)}
                    className="group relative border border-[#E8E4DC] bg-white p-8 hover:border-[#0A0F2E] transition-all cursor-pointer overflow-hidden"
                  >
                    <div className="flex items-start gap-6 relative z-10">
                      <div style={{ width: 48, height: 48, background: "#0A0F2E", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <scenario.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                          <div style={{ width: 20, height: 1.5, background: scenario.demoType === 'offensive' ? TEAL : GOLD, flexShrink: 0 }} />
                          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: scenario.demoType === 'offensive' ? TEAL : GOLD }}>{scenario.industry}</span>
                          <span style={{ fontSize: 10, color: MUTED, fontWeight: 600 }}>· 1 of {scenario.domainCount} {scenario.domain} playbooks</span>
                        </div>
                        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 600, color: "#0A0F2E", marginBottom: 8 }}>{scenario.name}</h3>
                        <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                          {scenario.trigger}
                        </p>
                        <div className="flex items-center gap-4 text-xs font-bold tracking-widest text-[#0A0F2E] uppercase">
                          <span>{formatCurrency(scenario.dealValue)} at risk</span>
                          <div className="w-1 h-1 bg-slate-300 rounded-full" />
                          <span>{scenario.stakeholders} stakeholders</span>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-[#0A0F2E] transition-colors" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Industry Demos Section */}
              <div className="pt-12 border-t border-[#E8E4DC]">
                <div className="text-center mb-10">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
                    <div style={{ width: 28, height: 2, background: "#C9A84C", flexShrink: 0 }} />
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "#C9A84C" }}>Industry Deep Dives</span>
                    <div style={{ width: 28, height: 2, background: "#C9A84C", flexShrink: 0 }} />
                  </div>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: "clamp(28px,4vw,40px)", lineHeight: 1.1, color: "#0A0F2E" }}>
                    Explore Role-Specific Environments
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {INDUSTRY_DEMOS.map((demo) => (
                    <Link key={demo.id} href={demo.route}>
                      <div className="group border border-[#E8E4DC] bg-white p-6 hover:border-[#0A0F2E] transition-all cursor-pointer">
                        <div className="flex items-center justify-between mb-4">
                          <div style={{ width: 32, height: 32, background: "#0A0F2E", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <demo.icon className="h-4 w-4 text-white" />
                          </div>
                          <div style={{ display:"inline-flex", alignItems:"center", gap:5, background: demo.type === 'offensive' ? "rgba(43,138,110,0.12)" : "rgba(201,168,76,0.12)", color: demo.type === 'offensive' ? "#2B8A6E" : "#C9A84C", fontSize:9, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase" as const, padding:"3px 10px" }}>
                            {demo.type}
                          </div>
                        </div>
                        <h4 className="font-bold text-slate-900 mb-1">{demo.title}</h4>
                        <div className="text-xs text-slate-500 mb-3">{demo.organization} · {demo.industry}</div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#0A0F2E]">{demo.impact}</span>
                          <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-[#0A0F2E] transition-colors" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CHAOS PHASE */}
          {currentPhase === 'chaos' && selectedScenario && (
            <div className="max-w-5xl mx-auto">

              {/* Context banner — must be immediately clear this is the pain state */}
              <div style={{ background: '#1a0a0a', border: '1px solid rgba(220,38,38,0.4)', borderRadius: 10, padding: '18px 24px', marginBottom: 24, display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ width: 40, height: 40, background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <AlertTriangle style={{ width: 20, height: 20, color: '#f87171' }} />
                </div>
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#f87171', marginBottom: 4 }}>This Is Your Current Reality — Without Execution OS</p>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.85)', lineHeight: 1.5, margin: 0 }}>
                    Watch what happens right now across your organization. Every message below is real — it's what your team experiences when a crisis hits and no playbook exists.
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={resetDemo} style={{ color: 'rgba(255,255,255,0.4)', marginLeft: 'auto', flexShrink: 0 }}>
                  <XCircle className="h-4 w-4 mr-1" />
                  Exit
                </Button>
              </div>

              <div className="mb-4 flex items-center justify-between">
                <Badge className="bg-red-500/20 text-red-300 border-red-500/30 animate-pulse">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  CRISIS IN PROGRESS — NO PLAYBOOK ACTIVE
                </Badge>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Left: Stats */}
                <div className="space-y-4">
                  <Card className="bg-red-950/50 border-red-500/50">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-xs text-red-400 uppercase tracking-wide mb-1">Revenue Bleeding</p>
                        <p className="text-3xl font-bold text-red-300 font-mono">
                          -{formatCurrency(revenueLost)}
                        </p>
                        <p className="text-xs text-red-400/70 mt-1">
                          ${(selectedScenario.revenuePerMinute / 1000).toFixed(1)}K per minute
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border-gray-200">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-xs text-gray-800 uppercase tracking-wide mb-1">Time Elapsed</p>
                        <p className="text-3xl font-bold text-gray-900 font-mono">
                          {formatTime(chaosSeconds)}
                        </p>
                        <p className="text-xs text-gray-800 mt-1">
                          Still no coordinated response
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border-gray-200">
                    <CardContent className="p-4">
                      <p className="text-xs text-gray-800 uppercase tracking-wide mb-2">Stress Level</p>
                      <Progress value={stressLevel} className="h-3 bg-gray-50" />
                      <p className="text-xs text-orange-400 mt-2 text-center">
                        {stressLevel < 50 ? 'Escalating' : stressLevel < 80 ? 'Critical' : 'Overwhelming'}
                      </p>
                    </CardContent>
                  </Card>

                  <div className="text-center text-xs text-gray-800 pt-2">
                    <p>Industry average mobilization time:</p>
                    <p className="text-lg font-bold text-red-400">30 days</p>
                  </div>
                </div>

                {/* Center: Message Flood */}
                <div className="lg:col-span-2">
                  <Card className="bg-white border-gray-200 h-[450px] overflow-hidden">
                    <CardHeader className="border-b border-gray-200 py-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                          <MessageSquare className="h-5 w-5 text-red-400" />
                          Incoming Messages
                        </CardTitle>
                        <Badge variant="outline" className="text-red-400 border-red-500/50">
                          {chaosMessages.length} urgent
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0 h-[calc(100%-60px)] overflow-y-auto">
                      <div className="space-y-2 p-4">
                        {chaosMessages.map((msg, index) => {
                          const IconComponent = MESSAGE_ICONS[msg.type] || MessageSquare;
                          return (
                            <div
                              key={msg.id}
                              className={`p-3 rounded-lg border ${URGENCY_COLORS[msg.urgency]} animate-in slide-in-from-right duration-300`}
                              style={{ animationDelay: `${index * 50}ms` }}
                            >
                              <div className="flex items-start gap-3">
                                <div className="p-2 bg-gray-50 rounded-lg">
                                  <IconComponent className="h-4 w-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-medium text-gray-900">{msg.sender}</span>
                                    <Badge variant="outline" className="text-xs py-0 h-4 bg-transparent text-gray-800 border-slate-600">
                                      {msg.type}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-gray-800 leading-snug">{msg.content}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        <div ref={messagesEndRef} />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Action buttons */}
                  <div className="mt-4 flex gap-3">
                    {!showChaosComplete && (
                      <Button variant="outline" onClick={skipChaos} className="flex-1 bg-transparent text-[#0A0F2E] border-[#E8E4DC] hover:bg-[#141B45] hover:text-white hover:border-[#141B45]">
                        Skip to Solution
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                    {showChaosComplete && (
                      <div className="flex-1 space-y-3">
                        <div className="p-4 bg-gray-50 border border-slate-600 rounded-lg text-center">
                          <p className="text-gray-800 text-sm mb-1">This is what happens WITHOUT Execution OS</p>
                          <p className="text-gray-900 font-medium">Chaos. Confusion. Costly delays.</p>
                        </div>
                        <Button 
                          className="w-full bg-[#2B8A6E] hover:bg-[#3BAF8A] text-white font-semibold py-6"
                          onClick={moveToPrepared}
                        >
                          <Sparkles className="mr-2 h-5 w-5" />
                          Now See Execution OS in Action
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* IDEA FRAMEWORK PHASES */}
          {currentPhase !== 'select' && currentPhase !== 'chaos' && selectedScenario && (
            <>
              {/* Phase Navigation */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Badge className={`bg-gradient-to-r ${selectedScenario.color} text-white`}>
                    {selectedScenario.name}
                  </Badge>
                  <span className="text-sm text-gray-800">
                    {formatCurrency(selectedScenario.dealValue)} at stake
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={resetDemo} className="text-gray-800 hover:text-white">
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Try Another Scenario
                </Button>
              </div>

              {/* Phase Indicators */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {PHASES.filter(p => p.id !== 'chaos').map((phase) => {
                  const isCompleted = completedPhases.includes(phase.id);
                  const isCurrent = currentPhase === phase.id;
                  const IconComponent = phase.icon;
                  const colors = PHASE_COLORS[phase.color] || PHASE_COLORS.teal;
                  
                  return (
                    <div 
                      key={phase.id}
                      className={`p-3 rounded-lg border transition-all ${
                        isCurrent 
                          ? `${colors.bg} ${colors.border}` 
                          : isCompleted 
                            ? 'bg-gray-50 border-[#2B8A6E]/50' 
                            : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isCompleted ? (
                          <CheckCircle2 className="h-4 w-4 text-[#2B8A6E]" />
                        ) : (
                          <IconComponent className={`h-4 w-4 ${isCurrent ? colors.text : 'text-gray-800'}`} />
                        )}
                        <span className={`text-xs font-medium ${isCurrent ? 'text-gray-900' : isCompleted ? 'text-gray-800' : 'text-gray-800'}`}>
                          {phase.name}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Progress value={getPhaseProgress()} className="mb-8 h-2" />

              {/* Phase Content */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Main Phase Card */}
                <div>
                  {currentPhase === 'identify' && (
                    <Card className="bg-white border-gray-200">
                      <CardHeader>
                        <CardTitle className="text-gray-900 flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-[#C9A84C]" />
                          IDENTIFY: Playbook Ready
                        </CardTitle>
                        <CardDescription>
                          Your {selectedScenario.playbook} playbook was already configured
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="p-4 bg-[#C9A84C]/10 border border-[#C9A84C]/30 rounded-lg">
                          <h4 className="text-gray-900 font-medium mb-3">Playbook: {selectedScenario.playbook}</h4>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2 text-gray-800">
                              <CheckCircle2 className="h-4 w-4 text-[#2B8A6E]" />
                              12 pre-configured tasks
                            </div>
                            <div className="flex items-center gap-2 text-gray-800">
                              <CheckCircle2 className="h-4 w-4 text-[#2B8A6E]" />
                              {selectedScenario.stakeholders} stakeholders mapped
                            </div>
                            <div className="flex items-center gap-2 text-gray-800">
                              <CheckCircle2 className="h-4 w-4 text-[#2B8A6E]" />
                              Response templates staged
                            </div>
                            <div className="flex items-center gap-2 text-gray-800">
                              <CheckCircle2 className="h-4 w-4 text-[#2B8A6E]" />
                              Budget pre-approved
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-[#2B8A6E]/10 border border-[#2B8A6E]/30 rounded-lg">
                          <div className="flex items-center gap-2 text-[#2B8A6E] mb-2">
                            <Clock className="h-4 w-4" />
                            <span className="font-medium">Time to Ready: 0 minutes</span>
                          </div>
                          <p className="text-sm text-gray-800">
                            Everything was prepared BEFORE the crisis hit
                          </p>
                        </div>

                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-800">
                            <span className="text-red-400 font-medium">Without Execution OS:</span> 20-50 hours to coordinate a response team, find documents, and get budget approval.
                          </p>
                        </div>

                        <Button 
                          className="w-full bg-[#0A0F2E] hover:bg-[#141B45] text-white"
                          onClick={completeIdentify}
                        >
                          Playbook Ready - Continue to Detection
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {currentPhase === 'detect' && (
                    <div style={{ background: NAVY, borderRadius: 12, overflow: 'hidden' }}>
                      {/* Terminal header */}
                      <div style={{ background: NAVY_MID, padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                        <div style={{ display: 'flex', gap: 5 }}>
                          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
                          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
                          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
                        </div>
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginLeft: 8, fontFamily: 'monospace' }}>execution-os — signal-monitor — live</span>
                        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', animation: 'pulse 1.5s infinite' }} />
                          <span style={{ fontSize: 10, color: '#22c55e', fontWeight: 700 }}>SCANNING 248+ SOURCES</span>
                        </div>
                      </div>

                      {/* Demo timeline note */}
                      <div style={{ background: 'rgba(201,168,76,0.07)', borderBottom: '1px solid rgba(201,168,76,0.15)', padding: '7px 18px', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 10, color: GOLD, fontWeight: 700, letterSpacing: '0.1em' }}>DEMO MODE</span>
                        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>—</span>
                        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>Timeline compressed for demonstration. In production, signal monitoring runs continuously every 15 minutes across all 248+ sources.</span>
                      </div>

                      <div style={{ padding: '20px 20px 24px' }}>
                        {/* Signal confidence meter */}
                        <div style={{ marginBottom: 20 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Trigger Confidence</span>
                            <span style={{ fontSize: 18, fontWeight: 700, color: detectStep >= 3 ? '#22c55e' : GOLD, fontFamily: 'monospace' }}>
                              {detectStep === 0 ? '0%' : detectStep === 1 ? `${(SCENARIO_SIGNALS[selectedScenario.id]?.[0]?.strength || 34)}%` : detectStep === 2 ? `${(SCENARIO_SIGNALS[selectedScenario.id]?.[1]?.strength || 68)}%` : `${(SCENARIO_SIGNALS[selectedScenario.id]?.[2]?.strength || 96)}%`}
                            </span>
                          </div>
                          <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ height: '100%', borderRadius: 3, transition: 'width 0.6s ease, background 0.4s ease', background: detectStep >= 3 ? '#22c55e' : GOLD, width: detectStep === 0 ? '2%' : detectStep === 1 ? `${SCENARIO_SIGNALS[selectedScenario.id]?.[0]?.strength || 34}%` : detectStep === 2 ? `${SCENARIO_SIGNALS[selectedScenario.id]?.[1]?.strength || 68}%` : `${SCENARIO_SIGNALS[selectedScenario.id]?.[2]?.strength || 96}%` }} />
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>Monitoring</span>
                            <span style={{ fontSize: 10, color: GOLD }}>Threshold: 80%</span>
                            <span style={{ fontSize: 10, color: '#22c55e' }}>Trigger</span>
                          </div>
                        </div>

                        {/* Live signals appearing */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                          {(SCENARIO_SIGNALS[selectedScenario.id] || []).map((signal, idx) => (
                            detectStep > idx ? (
                              <div key={idx} style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${idx === 2 && detectStep >= 3 ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.1)'}`, borderRadius: 8, padding: '10px 14px', display: 'flex', alignItems: 'flex-start', gap: 10, animation: 'slideIn 0.3s ease' }}>
                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: signal.strength >= 80 ? '#ef4444' : signal.strength >= 60 ? GOLD : '#94a3b8', marginTop: 5, flexShrink: 0 }} />
                                <div style={{ flex: 1 }}>
                                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', fontWeight: 500, marginBottom: 3 }}>{signal.label}</p>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace' }}>src: {signal.source}</span>
                                    <span style={{ fontSize: 10, fontWeight: 700, color: signal.strength >= 80 ? '#ef4444' : signal.strength >= 60 ? GOLD : '#94a3b8' }}>strength {signal.strength}%</span>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 8, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ display: 'flex', gap: 3 }}>
                                  {[0,1,2].map(d => <div key={d} style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', animation: `pulse ${0.6 + d * 0.2}s infinite` }} />)}
                                </div>
                                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', fontFamily: 'monospace' }}>scanning...</span>
                              </div>
                            )
                          ))}
                        </div>

                        {/* Trigger fired + Playbook match */}
                        {detectStep >= 3 && (
                          <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 8, padding: '14px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }} />
                              <span style={{ fontSize: 12, fontWeight: 700, color: '#22c55e', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Trigger Threshold Crossed — Playbook Matched</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <BookOpen style={{ width: 16, height: 16, color: GOLD, flexShrink: 0 }} />
                              <div>
                                <p style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF', margin: 0 }}>{selectedScenario.playbook}</p>
                                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', margin: 0 }}>AI match confidence: <span style={{ color: '#22c55e', fontWeight: 700 }}>94%</span> · Activating now</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {detectStep < 3 && (
                          <div style={{ textAlign: 'center', paddingTop: 8 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'rgba(255,255,255,0.4)' }}>
                              <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: GOLD, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                              <span style={{ fontSize: 12, fontFamily: 'monospace' }}>Correlating signals across {248 - detectStep * 30}+ sources...</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {currentPhase === 'execute' && (
                    <Card className="bg-white border-gray-200">
                      <CardHeader>
                        <CardTitle className="text-gray-900 flex items-center gap-2">
                          <Radio className="h-5 w-5 text-[#2B8A6E]" />
                          EXECUTE: Coordinating Response
                        </CardTitle>
                        <CardDescription>
                          Watch Execution OS orchestrate your response in real-time
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {/* Timer */}
                        <div className="mb-4 p-4 bg-gradient-to-r from-[#2B8A6E]/20 to-[#3BAF8A]/20 border border-[#2B8A6E]/30 rounded-lg text-center">
                          <p className="text-xs text-[#2B8A6E] uppercase tracking-wide mb-1">Execution Time</p>
                          <p className="text-4xl font-bold text-gray-900 font-mono">
                            {formatTime(executionTimer)}
                          </p>
                          <p className="text-xs text-[#3BAF8A] mt-1">Target: 12:00</p>
                        </div>

                        <div className="space-y-3">
                          {executionSteps.map((step) => {
                            const IconComponent = step.icon;
                            return (
                              <div 
                                key={step.id}
                                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border-l-4 border-[#2B8A6E] animate-in slide-in-from-left"
                              >
                                <div className="p-2 bg-[#2B8A6E]/20 rounded-lg">
                                  <IconComponent className="h-4 w-4 text-[#2B8A6E]" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <p className="text-gray-900 font-medium text-sm">{step.title}</p>
                                    <div className="p-1 bg-gray-50 rounded">
                                      {getIntegrationIcon(step.integration)}
                                    </div>
                                  </div>
                                  <p className="text-gray-800 text-xs">{step.description}</p>
                                </div>
                                <CheckCircle2 className="h-4 w-4 text-[#2B8A6E]" />
                              </div>
                            );
                          })}
                          
                          {isExecuting && (
                            <div className="flex items-center justify-center p-4 text-gray-800">
                              <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#2B8A6E] border-t-transparent mr-2" />
                              Orchestrating response...
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {currentPhase === 'advance' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {/* Outcome headline */}
                      <div style={{ background: 'rgba(43,138,110,0.08)', border: '1px solid rgba(43,138,110,0.3)', borderRadius: 10, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(43,138,110,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <CheckCircle2 style={{ width: 18, height: 18, color: TEAL }} />
                        </div>
                        <div>
                          <p style={{ fontSize: 15, fontWeight: 700, color: NAVY, fontFamily: "'Cormorant Garamond', serif", marginBottom: 2 }}>
                            {selectedScenario && SCENARIO_ADVANCE[selectedScenario.id]?.stat}
                          </p>
                          <p style={{ fontSize: 11, color: MUTED, fontWeight: 500 }}>Execution complete — {formatCurrency(selectedScenario?.dealValue || 0)} protected · Response time: 12 minutes</p>
                        </div>
                      </div>

                      {/* What worked */}
                      <div style={{ background: 'white', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '16px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                          <TrendingUp style={{ width: 14, height: 14, color: TEAL }} />
                          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: TEAL }}>What Worked — AI Analysis</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {(selectedScenario && SCENARIO_ADVANCE[selectedScenario.id]?.patterns || []).map((pattern, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 10px', background: OFF, borderRadius: 6 }}>
                              <CheckCircle2 style={{ width: 12, height: 12, color: TEAL, marginTop: 2, flexShrink: 0 }} />
                              <p style={{ fontSize: 12, color: NAVY, fontWeight: 500, lineHeight: 1.4 }}>{pattern}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Playbook improvements */}
                      <div style={{ background: 'white', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '16px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                          <Lightbulb style={{ width: 14, height: 14, color: GOLD }} />
                          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: GOLD }}>AI Playbook Improvements Suggested</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {(selectedScenario && SCENARIO_ADVANCE[selectedScenario.id]?.improvements || []).map((improvement, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 10px', background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 6 }}>
                              <ArrowUpRight style={{ width: 12, height: 12, color: GOLD, marginTop: 2, flexShrink: 0 }} />
                              <p style={{ fontSize: 12, color: NAVY, fontWeight: 500, lineHeight: 1.4 }}>{improvement}</p>
                            </div>
                          ))}
                        </div>
                        <p style={{ fontSize: 10, color: MUTED, marginTop: 10, fontStyle: 'italic' }}>These improvements are automatically staged for your next playbook review cycle.</p>
                      </div>

                      <Button
                        className="w-full bg-[#0A0F2E] hover:bg-[#141B45] text-white font-semibold py-5"
                        onClick={completeAdvance}
                      >
                        See the Full Playbook That Powered This Response
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>

                      </div>
                  )}

                  {currentPhase === 'complete' && (
                    <div className="space-y-6">
                      {/* Playbook reveal — primary WOW moment */}
                      {(() => {
                        const mapped = selectedScenario ? SCENARIO_PLAYBOOK_MAP[selectedScenario.id] : null;
                        return mapped ? (
                          <div style={{ background: NAVY, borderRadius: 12, overflow: 'hidden' }}>
                            {/* Header bar */}
                            <div style={{ background: NAVY_MID, padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid rgba(201,168,76,0.2)' }}>
                              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e' }} />
                              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>Execution OS — Playbook Activated</span>
                            </div>

                            <div style={{ padding: '32px 28px' }}>
                              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
                                <div style={{ width: 56, height: 56, borderRadius: 10, background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                  <BookOpen style={{ width: 24, height: 24, color: GOLD }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: GOLD, marginBottom: 6 }}>{mapped.badge}</div>
                                  <h2 style={{ fontSize: 24, fontWeight: 700, color: '#FFFFFF', fontFamily: "'Cormorant Garamond', serif", marginBottom: 6, lineHeight: 1.2 }}>{mapped.name}</h2>
                                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', margin: 0 }}>The playbook that just coordinated your response — 4 execution phases, pre-staged communications, risk indicators, and outcome benchmarks. Ready to activate for real.</p>
                                </div>
                              </div>

                              {/* Phase preview strip */}
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, margin: '24px 0' }}>
                                {['IDENTIFY', 'DETECT', 'EXECUTE', 'ADVANCE'].map((phase, i) => (
                                  <div key={phase} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: '10px 12px', textAlign: 'center' }}>
                                    <div style={{ fontSize: 16, fontWeight: 700, color: GOLD, marginBottom: 2 }}>0{i + 1}</div>
                                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)' }}>{phase}</div>
                                  </div>
                                ))}
                              </div>

                              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                                {['Role-Specific Tasks', 'Board Notification Draft', 'Risk Grid', '30-Day Outcomes'].map(tag => (
                                  <span key={tag} style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.45)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, padding: '3px 8px' }}>{tag}</span>
                                ))}
                              </div>

                              <button
                                onClick={() => {
                                  setLocation(`/playbook-library/${mapped.id}`);
                                  window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
                                }}
                                style={{ marginTop: 20, width: '100%', padding: '14px 20px', background: GOLD, color: NAVY, border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, letterSpacing: '0.02em' }}
                              >
                                <BookOpen style={{ width: 18, height: 18 }} />
                                Open Your Activated Playbook
                                <ArrowRight style={{ width: 16, height: 16 }} />
                              </button>
                              <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 10 }}>No login required — this is the full playbook, not a preview.</p>
                            </div>
                          </div>
                        ) : null;
                      })()}

                      <Card className="bg-white border-[#2B8A6E]/50 shadow-lg">
                        <CardContent className="p-8 text-center">
                          <div className="mb-6">
                            <div className="inline-flex p-4 bg-[#2B8A6E]/10 rounded-full mb-4">
                              <Rocket className="h-10 w-10 text-[#2B8A6E]" />
                            </div>
                            <h2 className="text-2xl font-bold text-[#0A0F2E] mb-2" style={CG}>IDEA Framework Complete</h2>
                            <p className="text-[#C9A84C] text-xs font-bold tracking-[0.2em] uppercase mb-1">We Make Enterprises Fearless.</p>
                            <p className="text-slate-600">Identify · Detect · Execute · Advance — in 12 minutes</p>
                          </div>

                          <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="p-4 bg-[#F8F7F4] rounded-lg border border-[#E8E4DC]">
                              <p className="text-2xl font-bold text-[#2B8A6E]">12 min</p>
                              <p className="text-xs text-slate-500 font-medium">Response Time</p>
                            </div>
                            <div className="p-4 bg-[#F8F7F4] rounded-lg border border-[#E8E4DC]">
                              <p className="text-2xl font-bold text-[#2B8A6E]">{formatCurrency(selectedScenario?.dealValue || 0)}</p>
                              <p className="text-xs text-slate-500 font-medium">Value Protected</p>
                            </div>
                            <div className="p-4 bg-[#F8F7F4] rounded-lg border border-[#E8E4DC]">
                              <p className="text-2xl font-bold text-[#2B8A6E]">98 days</p>
                              <p className="text-xs text-slate-500 font-medium">Saved (IBM 2024)</p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <Button 
                              className="w-full bg-[#0A0F2E] hover:bg-[#141B45] text-[#C9A84C] py-6 text-lg font-bold"
                              onClick={() => {
                                setLocation('/pilot-demo');
                                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                              }}
                            >
                              <Rocket className="mr-2 h-5 w-5" />
                              Start Your Pilot
                            </Button>
                            <Button 
                              variant="outline"
                              className="w-full text-[#0A0F2E] border-[#E8E4DC] hover:bg-[#F8F7F4]"
                              onClick={resetDemo}
                            >
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Try Another Scenario
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Industry Deep-Dive Demos */}
                      <Card className="bg-white border-gray-200">
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-lg text-[#0A0F2E] flex items-center gap-2" style={CG}>
                                <Building2 className="h-5 w-5 text-[#C9A84C]" />
                                Explore Industry Deep-Dives
                              </CardTitle>
                              <CardDescription className="text-slate-600">
                                See Execution OS in action across 9 industries with real company scenarios
                              </CardDescription>
                            </div>
                            <Badge className="bg-[#C9A84C] text-[#0A0F2E] border-[#C9A84C] hover:bg-[#DFC178]">
                              9 Demos
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-4">
                            <div className="flex gap-2 mb-3">
                              <Badge variant="outline" className="text-[#2B8A6E] border-[#2B8A6E] bg-[#2B8A6E]/10">
                                <Target className="h-3 w-3 mr-1" />
                                Offensive (3)
                              </Badge>
                              <Badge variant="outline" className="text-[#C9A84C] border-[#C9A84C] bg-[#C9A84C]/10">
                                <Shield className="h-3 w-3 mr-1" />
                                Defensive (6)
                              </Badge>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                            {INDUSTRY_DEMOS.map((demo) => {
                              const IconComponent = demo.icon;
                              return (
                                <button
                                  key={demo.id}
                                  onClick={() => {
                                    setLocation(demo.route);
                                    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                                  }}
                                  className={`p-3 rounded-lg border transition-all hover:scale-[1.02] text-left group ${demo.bgColor} ${
                                    demo.type === 'offensive' 
                                      ? 'border-[#2B8A6E]/30 hover:border-[#2B8A6E]' 
                                      : 'border-[#0A0F2E]/30 hover:border-[#0A0F2E]'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 mb-1">
                                    <IconComponent className={`h-4 w-4 ${demo.iconColor}`} />
                                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{demo.industry}</span>
                                  </div>
                                  <p className="text-xs font-semibold text-[#0A0F2E] truncate">{demo.title}</p>
                                  <div className="flex items-center justify-between mt-1">
                                    <span className="text-[10px] text-slate-600 font-medium">{demo.organization}</span>
                                    <span className={`text-[10px] font-bold ${demo.type === 'offensive' ? 'text-[#2B8A6E]' : 'text-[#0A0F2E]'}`}>
                                      {demo.impact}
                                    </span>
                                  </div>
                                  <div className="mt-2 flex items-center gap-1 text-[#2B8A6E] opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-[10px] font-bold">Explore</span>
                                    <ExternalLink className="h-2.5 w-2.5" />
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                          <div className="mt-4 pt-4 border-t border-[#E8E4DC] text-center">
                            <p className="text-xs text-slate-500 font-medium">Click any scenario above to explore the full demo</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-4">

                  {/* Phase-specific context card */}
                  {currentPhase === 'identify' && (
                    <div style={{ background: NAVY, borderRadius: 10, padding: '20px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: GOLD }} />
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD }}>Why This Was Ready</span>
                      </div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF', marginBottom: 8, lineHeight: 1.4 }}>Your organization built this playbook before today.</p>
                      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, marginBottom: 14 }}>Every task assignment, stakeholder notification, and communication template was configured in advance — not improvised under pressure. This is the entire point: the work happens before the crisis, not during it.</p>
                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 12 }}>
                        <p style={{ fontSize: 11, color: GOLD, fontWeight: 700, marginBottom: 6 }}>Without Execution OS:</p>
                        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.55 }}>Spend 4–8 hours assembling a response team, locating the right people, finding documents, and getting budget approval — while the situation compounds.</p>
                      </div>
                    </div>
                  )}

                  {currentPhase === 'detect' && (
                    <div style={{ background: NAVY, borderRadius: 10, padding: '20px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e' }} />
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#22c55e' }}>What AI Just Replaced</span>
                      </div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF', marginBottom: 8, lineHeight: 1.4 }}>A team of analysts manually scanning 248+ sources — replaced by continuous AI monitoring.</p>
                      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, marginBottom: 14 }}>Execution OS watches all signal categories simultaneously, every 15 minutes, 24/7. It cross-references data points, identifies patterns, and fires when a threshold is crossed — before your team would have even noticed.</p>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        {[['248+', 'Signal sources'], ['15 min', 'Scan cycle'], ['24/7', 'Monitoring'], ['<1 sec', 'Alert time']].map(([val, label]) => (
                          <div key={label} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: '8px 10px', textAlign: 'center' }}>
                            <p style={{ fontSize: 16, fontWeight: 700, color: GOLD, margin: 0 }}>{val}</p>
                            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', margin: 0, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentPhase === 'execute' && selectedScenario && (
                    <div style={{ background: NAVY, borderRadius: 10, padding: '20px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: TEAL, animation: 'pulse 1.5s infinite' }} />
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: TEAL }}>What's Happening Right Now</span>
                      </div>
                      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, marginBottom: 14 }}>Execution OS is firing all of the following simultaneously — not sequentially. No one had to email anyone to start this.</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {[
                          `${selectedScenario.stakeholders} role-specific task assignments`,
                          'War room channel opened in Slack',
                          'Jira incident tickets auto-created',
                          'Board communication draft staged',
                          'Budget exception flagged for approval',
                          'External counsel pre-alert sent',
                        ].map((item, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 5, height: 5, borderRadius: '50%', background: TEAL, flexShrink: 0 }} />
                            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', margin: 0, fontWeight: 500 }}>{item}</p>
                          </div>
                        ))}
                      </div>
                      <div style={{ marginTop: 14, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 12 }}>
                        <p style={{ fontSize: 11, color: GOLD, fontWeight: 700, marginBottom: 4 }}>Without Execution OS:</p>
                        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Each of those 6 actions requires a human email, a meeting invite, and at least one follow-up chase. Collectively: 20–50 hours.</p>
                      </div>
                    </div>
                  )}

                  {currentPhase === 'advance' && (
                    <div style={{ background: NAVY, borderRadius: 10, padding: '20px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: GOLD }} />
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD }}>How The System Gets Smarter</span>
                      </div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF', marginBottom: 8, lineHeight: 1.4 }}>Every execution teaches the system.</p>
                      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, marginBottom: 14 }}>Pattern analysis identifies what worked, what slowed response, and where pre-staging gaps exist. Improvements are automatically staged for your next playbook review — not buried in a post-mortem slide deck that no one reads.</p>
                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 12 }}>
                        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.55 }}>Over time, your organization builds an institutional memory that new hires inherit from day one — not after years of experience.</p>
                      </div>
                    </div>
                  )}

                  {/* Value Comparison */}
                  <Card className="bg-white border-[#E8E4DC]">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-bold text-[#0A0F2E]" style={CG}>Response Comparison</CardTitle>
                    </CardHeader>
                    <CardContent>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
                              <p className="text-[10px] text-red-600 font-bold uppercase mb-1">Traditional</p>
                              <p className="text-xl font-bold text-red-600">30 days</p>
                              <p className="text-[10px] text-slate-500 font-medium">Traditional mobilization</p>
                            </div>
                            <div className="p-3 bg-[#2B8A6E]/10 border border-[#2B8A6E]/30 rounded-lg text-center">
                              <p className="text-[10px] text-[#2B8A6E] font-bold uppercase mb-1">Execution OS</p>
                              <p className="text-xl font-bold text-[#2B8A6E]">12 min</p>
                              <p className="text-[10px] text-slate-500 font-medium">Guaranteed</p>
                            </div>
                          </div>
                    </CardContent>
                  </Card>

                  {/* Enterprise Integrations */}
                  <Card className="bg-white border-[#E8E4DC]">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-bold text-[#0A0F2E]" style={CG}>Integrated With Your Stack</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { icon: SiSlack, name: 'Slack', color: '#0A0F2E' },
                          { icon: SiJira, name: 'Jira', color: '#0A0F2E' },
                          { icon: Users, name: 'Teams', color: '#0A0F2E' },
                          { icon: SiSalesforce, name: 'Salesforce', color: '#0A0F2E' },
                          { icon: SiNotion, name: 'Notion', color: '#0A0F2E' },
                        ].map(({ icon: Icon, name, color }) => (
                          <div key={name} className="flex items-center gap-1.5 px-2 py-1 bg-[#F8F7F4] border border-[#E8E4DC] rounded text-[10px] font-bold">
                            <Icon className="h-3 w-3" style={{ color }} />
                            <span className="text-[#0A0F2E]">{name}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Research Citations */}
                  <Card className="bg-white border-[#E8E4DC]">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-bold text-[#0A0F2E]" style={CG}>Research-Backed Claims</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-start gap-2 text-xs">
                        <Badge variant="outline" className="text-[10px] shrink-0 bg-transparent text-[#0A0F2E] border-[#0A0F2E] font-bold">IBM 2024</Badge>
                        <span className="text-slate-600 font-medium text-[11px]">98 days saved with AI/automation</span>
                      </div>
                      <div className="flex items-start gap-2 text-xs">
                        <Badge variant="outline" className="text-[10px] shrink-0 bg-transparent text-[#0A0F2E] border-[#0A0F2E] font-bold">McKinsey</Badge>
                        <span className="text-slate-600 font-medium text-[11px]">5-10x faster execution</span>
                      </div>
                      <div className="flex items-start gap-2 text-xs">
                        <Badge variant="outline" className="text-[10px] shrink-0 bg-transparent text-[#0A0F2E] border-[#0A0F2E] font-bold">PagerDuty</Badge>
                        <span className="text-slate-600 font-medium text-[11px]">3.5x faster crisis response</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 170 Playbooks */}
                  <Card className="bg-white border-[#C9A84C]">
                    <CardContent className="p-4 text-center">
                      <p className="text-4xl font-bold text-[#C9A84C] mb-1">170</p>
                      <p className="text-sm font-bold text-[#0A0F2E]" style={CG}>Pre-Built Playbooks</p>
                      <p className="text-[10px] text-slate-500 font-medium mt-1 uppercase tracking-wider">Across 9 Strategic Domains</p>
                      <button
                        onClick={() => { setLocation('/playbook-library'); window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }); }}
                        className="mt-3 w-full text-[10px] font-bold text-[#0A0F2E] border border-[#C9A84C] rounded px-3 py-1.5 hover:bg-[#C9A84C]/10 transition-colors flex items-center justify-center gap-1"
                      >
                        <BookOpen className="h-3 w-3" />
                        View 3 Free Playbook Examples
                      </button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* See It In Your Industry Section */}
      <section className="bg-[#F8F7F4] border-t border-[#E8E4DC] py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-[#0A0F2E] mb-3" style={CG}>See It In Your Industry</h2>
            <p className="text-slate-600 max-w-2xl mx-auto font-medium">
              Explore how Execution OS handles real-world scenarios across offense and defense — each demo shows the full trigger-to-execution loop.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {INDUSTRY_DEMOS.map((demo) => {
              const IconComponent = demo.icon;
              return (
                <button
                  key={demo.id}
                  onClick={() => {
                    setLocation(demo.route);
                    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                  }}
                  className={`p-5 rounded-xl border transition-all hover:scale-[1.02] text-left group bg-white ${
                    demo.type === 'offensive' 
                      ? 'border-[#2B8A6E]/30 hover:border-[#2B8A6E]' 
                      : 'border-[#0A0F2E]/30 hover:border-[#0A0F2E]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <IconComponent className={`h-5 w-5 ${demo.iconColor}`} />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{demo.industry}</span>
                    </div>
                    <Badge variant="outline" className={`text-[10px] font-bold uppercase ${
                      demo.type === 'offensive' 
                        ? 'text-[#2B8A6E] border-[#2B8A6E] bg-[#2B8A6E]/10' 
                        : 'text-[#0A0F2E] border-[#0A0F2E] bg-[#0A0F2E]/10'
                    }`}>
                      {demo.type === 'offensive' ? 'Offense' : 'Defense'}
                    </Badge>
                  </div>
                  <p className="text-sm font-bold text-[#0A0F2E] mb-1" style={CG}>{demo.title}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-600 font-medium">{demo.organization}</span>
                    <span className={`text-[11px] font-bold ${demo.type === 'offensive' ? 'text-[#2B8A6E]' : 'text-[#0A0F2E]'}`}>
                      {demo.impact}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-[#2B8A6E] opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[11px] font-bold">Run this scenario</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Natural transition → full experience */}
      <div style={{ background: "#F0EEE9", borderTop: "1px solid #E8E4DC", padding: "36px 24px", textAlign: "center" }}>
        <p style={{ fontSize: 13, color: "#6B7280", fontWeight: 500, marginBottom: 12 }}>
          These simulations show the shape of the response. The guided experience shows you the full 12-minute execution.
        </p>
        <Link href="/12-minute-experience" style={{ display: "inline-flex", alignItems: "center", gap: 10, color: "#0A0F2E", fontSize: 13, fontWeight: 700, borderBottom: "2px solid #C9A84C", paddingBottom: 3, textDecoration: "none" }}>
          Experience the full 12-minute execution — live, guided, no login →
        </Link>
      </div>

      {/* Live Playbook Examples Section */}
      <section style={{ background: NAVY, padding: '72px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 20, padding: '4px 14px', marginBottom: 16 }}>
              <BookOpen style={{ width: 12, height: 12, color: GOLD }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: GOLD }}>Open Access</span>
            </div>
            <h2 style={{ fontSize: 30, fontWeight: 700, color: '#FFFFFF', fontFamily: "'Cormorant Garamond', serif", marginBottom: 12 }}>
              Explore Live Playbook Examples
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', maxWidth: 580, margin: '0 auto', lineHeight: 1.6, fontWeight: 500 }}>
              Three fully enriched playbooks — open to everyone. Each includes a 4-phase execution plan, pre-staged communications, risk indicators, and outcome benchmarks.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 40 }}>
            {[
              {
                id: '5',
                name: 'Aggressive Pricing Disruption',
                description: 'Competitor cuts prices 30%+ or introduces a disruptive pricing model threatening your pipeline.',
                type: 'Offensive',
                typeColor: TEAL,
                source: 'Bain Competitive Analysis',
                stat: '91% pipeline retained',
                context: 'when response is within 12 hours',
                icon: TrendingDown,
              },
              {
                id: '180',
                name: 'AI Competitive Disruption',
                description: 'A competitor deploys AI capability that fundamentally changes market dynamics in your category.',
                type: 'Defensive',
                typeColor: GOLD,
                source: 'McKinsey Technology Adoption',
                stat: 'Under 21 days',
                context: 'vs. 94-day industry average',
                icon: Brain,
              },
              {
                id: '182',
                name: 'Compound: Geopolitical + Supply Chain',
                description: 'Tariff escalations or sanctions that simultaneously disrupt supply chains and require financial restructuring.',
                type: 'Compound',
                typeColor: GOLD,
                source: 'Deloitte Supply Chain Resilience',
                stat: '$4.2M avoided',
                context: 'per major disruption event',
                icon: Building2,
              },
            ].map((pb) => {
              const Icon = pb.icon;
              return (
                <div
                  key={pb.id}
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 28, display: 'flex', flexDirection: 'column', gap: 16 }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon style={{ width: 18, height: 18, color: GOLD }} />
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: pb.typeColor, background: `${pb.typeColor}1A`, border: `1px solid ${pb.typeColor}40`, borderRadius: 4, padding: '2px 8px', whiteSpace: 'nowrap' }}>
                      {pb.type}
                    </span>
                  </div>

                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF', fontFamily: "'Cormorant Garamond', serif", marginBottom: 8, lineHeight: 1.3 }}>{pb.name}</h3>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, fontWeight: 400 }}>{pb.description}</p>
                  </div>

                  <div style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 8, padding: '12px 14px' }}>
                    <p style={{ fontSize: 18, fontWeight: 700, color: GOLD, marginBottom: 2 }}>{pb.stat}</p>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>{pb.context}</p>
                    <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 4, fontWeight: 600, letterSpacing: '0.05em' }}>Based on: {pb.source}</p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 'auto' }}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {['4-Phase Plan', 'Comms Assets', 'Risk Grid', 'Outcome KPIs'].map(tag => (
                        <span key={tag} style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, padding: '2px 7px' }}>{tag}</span>
                      ))}
                    </div>
                    <button
                      onClick={() => { setLocation(`/playbook-library/${pb.id}`); window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }); }}
                      style={{ width: '100%', padding: '10px 16px', background: GOLD, color: NAVY, border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                    >
                      View Full Playbook
                      <ArrowRight style={{ width: 14, height: 14 }} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => { setLocation('/playbook-library'); window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }); }}
              style={{ padding: '12px 28px', background: 'transparent', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <BookOpen style={{ width: 14, height: 14 }} />
              Browse All 170 Playbooks
            </button>
          </div>
        </div>
      </section>

    </PageLayout>
  );
}
