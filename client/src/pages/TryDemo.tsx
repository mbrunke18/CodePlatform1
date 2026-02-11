import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import StandardNav from '@/components/layout/StandardNav';
import Footer from '@/components/layout/Footer';
import { useLocation } from 'wouter';
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
import { SiSlack, SiJira, SiSalesforce, SiNotion } from 'react-icons/si';

type Phase = 'select' | 'chaos' | 'identify' | 'detect' | 'execute' | 'advance' | 'complete';

interface Scenario {
  id: string;
  name: string;
  industry: string;
  icon: any;
  color: string;
  borderColor: string;
  trigger: string;
  playbook: string;
  dealValue: number;
  stakeholders: number;
  revenuePerMinute: number;
  chaosMessages: ChaosMessage[];
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
  { id: 'lvmh', title: 'Strategic Market Entry', industry: 'Luxury', icon: Crown, iconColor: 'text-purple-400', bgColor: 'bg-purple-900/30', organization: 'LVMH', impact: '€1.68B value', route: '/lvmh-demo', type: 'offensive' },
  { id: 'shein', title: 'Viral Trend Response', industry: 'Fashion', icon: TrendingUp, iconColor: 'text-pink-400', bgColor: 'bg-pink-900/30', organization: 'SHEIN', impact: '$108M revenue', route: '/shein-demo', type: 'offensive' },
  { id: 'spacex', title: 'Launch Acceleration', industry: 'Aerospace', icon: Rocket, iconColor: 'text-blue-400', bgColor: 'bg-blue-900/30', organization: 'SpaceX', impact: '$47M value', route: '/spacex-demo', type: 'offensive' },
  { id: 'financial', title: 'Ransomware Response', industry: 'Finance', icon: Shield, iconColor: 'text-blue-400', bgColor: 'bg-slate-800/50', organization: 'LoanDepot', impact: '$22M saved', route: '/financial-demo', type: 'defensive' },
  { id: 'pharma', title: 'Class I Recall', industry: 'Pharma', icon: Pill, iconColor: 'text-red-400', bgColor: 'bg-red-900/30', organization: 'Glenmark', impact: 'Lives saved', route: '/pharma-demo', type: 'defensive' },
  { id: 'manufacturing', title: 'Supplier Crisis', industry: 'Automotive', icon: Factory, iconColor: 'text-orange-400', bgColor: 'bg-orange-900/30', organization: 'Toyota', impact: '$450M saved', route: '/manufacturing-demo', type: 'defensive' },
  { id: 'retail', title: 'Food Contamination', industry: 'Retail', icon: ShoppingCart, iconColor: 'text-green-400', bgColor: 'bg-green-900/30', organization: 'Walmart', impact: '$245M + lives', route: '/retail-demo', type: 'defensive' },
  { id: 'energy', title: 'Grid Failure', industry: 'Energy', icon: Zap, iconColor: 'text-yellow-400', bgColor: 'bg-yellow-900/30', organization: 'Pacific Grid', impact: '$2.5B saved', route: '/energy-demo', type: 'defensive' },
  { id: 'luxury-crisis', title: 'Revenue Collapse', industry: 'Luxury', icon: Building2, iconColor: 'text-purple-400', bgColor: 'bg-purple-900/30', organization: 'LVMH', impact: '€280M preserved', route: '/luxury-demo', type: 'defensive' },
];

const SCENARIOS: Scenario[] = [
  {
    id: 'ransomware',
    name: 'Ransomware Attack',
    industry: 'Cybersecurity',
    icon: Shield,
    color: 'from-red-500 to-orange-500',
    borderColor: 'border-red-500/50',
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
    ]
  },
  {
    id: 'competitor',
    name: 'Competitor Launch',
    industry: 'Competitive Response',
    icon: Target,
    color: 'from-purple-500 to-violet-500',
    borderColor: 'border-purple-500/50',
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
    ]
  },
  {
    id: 'regulatory',
    name: 'SEC Investigation',
    industry: 'Compliance',
    icon: Scale,
    color: 'from-amber-500 to-yellow-500',
    borderColor: 'border-amber-500/50',
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
    ]
  },
  {
    id: 'deal-risk',
    name: 'Deal at Risk',
    industry: 'Sales & Revenue',
    icon: DollarSign,
    color: 'from-emerald-500 to-teal-500',
    borderColor: 'border-emerald-500/50',
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
    ]
  },
];

const PHASES = [
  { id: 'chaos' as Phase, name: 'THE CHAOS', icon: AlertTriangle, color: 'red', description: 'Without ExecuteIQ' },
  { id: 'identify' as Phase, name: 'IDENTIFY', icon: BookOpen, color: 'violet', description: 'Playbook ready' },
  { id: 'detect' as Phase, name: 'DETECT', icon: Radar, color: 'blue', description: 'Signal detected' },
  { id: 'execute' as Phase, name: 'EXECUTE', icon: Radio, color: 'emerald', description: 'Coordinate response' },
  { id: 'advance' as Phase, name: 'ADVANCE', icon: BarChart3, color: 'amber', description: 'Capture learnings' },
];

const MESSAGE_ICONS: Record<string, any> = {
  slack: SiSlack,
  email: Mail,
  text: MessageSquare,
  calendar: Calendar,
  call: Phone,
};

const PHASE_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  violet: { bg: 'bg-violet-500/20', border: 'border-violet-500', text: 'text-violet-400' },
  blue: { bg: 'bg-blue-500/20', border: 'border-blue-500', text: 'text-blue-400' },
  emerald: { bg: 'bg-emerald-500/20', border: 'border-emerald-500', text: 'text-emerald-400' },
  amber: { bg: 'bg-amber-500/20', border: 'border-amber-500', text: 'text-amber-400' },
  red: { bg: 'bg-red-500/20', border: 'border-red-500', text: 'text-red-400' },
};

const URGENCY_COLORS: Record<string, string> = {
  critical: 'bg-red-500/20 border-red-500 text-red-300',
  high: 'bg-orange-500/20 border-orange-500 text-orange-300',
  medium: 'bg-yellow-500/20 border-yellow-500 text-yellow-300',
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
  
  const [executionTimer, setExecutionTimer] = useState(0);
  const [savedValue, setSavedValue] = useState(0);

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
  };

  useEffect(() => {
    if (currentPhase === 'chaos' && selectedScenario && !showChaosComplete) {
      const messageInterval = setInterval(() => {
        setChaosMessages(prev => {
          if (prev.length >= selectedScenario.chaosMessages.length) {
            clearInterval(messageInterval);
            setTimeout(() => setShowChaosComplete(true), 1500);
            return prev;
          }
          return [...prev, selectedScenario.chaosMessages[prev.length]];
        });
      }, 800);

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
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chaosMessages]);

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
      { id: 1, title: 'Playbook Activated', description: `${selectedScenario?.playbook} triggered`, icon: Zap, integration: 'executeiq', delay: 0 },
      { id: 2, title: 'Stakeholders Notified', description: `${selectedScenario?.stakeholders} team members alerted`, icon: Users, integration: 'slack', delay: 1500 },
      { id: 3, title: 'Tasks Auto-Created', description: '12 tasks created with owners assigned', icon: CheckCircle2, integration: 'jira', delay: 3000 },
      { id: 4, title: 'War Room Launched', description: 'Collaboration channel created', icon: MessageSquare, integration: 'teams', delay: 4500 },
      { id: 5, title: 'Documents Staged', description: 'Response templates ready for review', icon: FileText, integration: 'notion', delay: 6000 },
      { id: 6, title: 'Executive Briefed', description: 'CEO notified with situation summary', icon: Briefcase, integration: 'salesforce', delay: 7500 },
      { id: 7, title: 'Budget Released', description: '$50K pre-approved budget unlocked', icon: DollarSign, integration: 'executeiq', delay: 9000 },
      { id: 8, title: 'Execution Complete', description: 'Coordinated response in 12 minutes', icon: CheckCircle2, integration: 'executeiq', delay: 11000 },
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
        traditionalTime: '20-72 hours',
        executeiqTime: '12 minutes',
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
      case 'slack': return <SiSlack className="h-4 w-4 text-[#4A154B]" />;
      case 'jira': return <SiJira className="h-4 w-4 text-[#0052CC]" />;
      case 'teams': return <Users className="h-4 w-4 text-[#6264A7]" />;
      case 'salesforce': return <SiSalesforce className="h-4 w-4 text-[#00A1E0]" />;
      case 'notion': return <SiNotion className="h-4 w-4 text-white" />;
      default: return <Zap className="h-4 w-4 text-emerald-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <StandardNav />
      
      <main className="flex-1 py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-gradient-to-r from-amber-500/20 to-emerald-500/20 text-amber-300 border-amber-500/30">
              Y Combinator Demo
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Experience ExecuteIQ
            </h1>
            <p className="text-lg text-slate-400">
              See why Fortune 1000 leaders need the Strategic Execution OS
            </p>
          </div>

          {/* Scenario Selection */}
          {currentPhase === 'select' && (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Choose Your Crisis</h2>
                <p className="text-slate-400">
                  Experience the chaos of strategic events—then see how ExecuteIQ transforms response
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {SCENARIOS.map((scenario) => {
                  const IconComponent = scenario.icon;
                  return (
                    <Card 
                      key={scenario.id}
                      className={`bg-slate-900/50 border-2 ${scenario.borderColor} cursor-pointer transition-all hover:shadow-xl hover:scale-[1.02] group`}
                      onClick={() => startDemo(scenario)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${scenario.color}`}>
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors mb-1">
                              {scenario.name}
                            </h3>
                            <p className="text-sm text-slate-400 mb-2">{scenario.industry}</p>
                            <p className="text-sm text-slate-400 mb-3">{scenario.trigger}</p>
                            <div className="flex items-center gap-4 text-xs">
                              <span className="flex items-center gap-1 text-red-400">
                                <TrendingDown className="h-3 w-3" />
                                ${(scenario.revenuePerMinute / 1000).toFixed(1)}K/min at risk
                              </span>
                            </div>
                          </div>
                          <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Industry Demos Teaser */}
              <div className="mt-8 pt-6 border-t border-slate-800">
                <div className="text-center">
                  <p className="text-sm text-slate-400 mb-3">
                    Want to see real company scenarios? Explore our industry deep-dives:
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {INDUSTRY_DEMOS.slice(0, 5).map((demo) => {
                      const IconComponent = demo.icon;
                      return (
                        <button
                          key={demo.id}
                          onClick={() => {
                            setLocation(demo.route);
                            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                          }}
                          className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-poise-teal/50 transition-colors text-sm"
                        >
                          <IconComponent className={`h-4 w-4 ${demo.iconColor}`} />
                          <span className="text-slate-300">{demo.organization}</span>
                          <span className="text-xs text-slate-400">{demo.industry}</span>
                        </button>
                      );
                    })}
                  </div>
                  <Button 
                    variant="link" 
                    size="sm" 
                    onClick={() => {
                      setLocation('/industry-demos');
                      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                    }}
                    className="text-poise-teal"
                  >
                    View All 9 Industry Demos
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* CHAOS PHASE */}
          {currentPhase === 'chaos' && selectedScenario && (
            <div className="max-w-5xl mx-auto">
              <div className="mb-6 flex items-center justify-between">
                <Badge className="bg-red-500/20 text-red-300 border-red-500/30 animate-pulse">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  CRISIS IN PROGRESS
                </Badge>
                <Button variant="ghost" size="sm" onClick={resetDemo} className="text-slate-400 hover:text-white">
                  <XCircle className="h-4 w-4 mr-1" />
                  Exit Demo
                </Button>
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

                  <Card className="bg-slate-900/50 border-slate-700">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Time Elapsed</p>
                        <p className="text-3xl font-bold text-white font-mono">
                          {formatTime(chaosSeconds)}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          Still no coordinated response
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/50 border-slate-700">
                    <CardContent className="p-4">
                      <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">Stress Level</p>
                      <Progress value={stressLevel} className="h-3 bg-slate-800" />
                      <p className="text-xs text-orange-400 mt-2 text-center">
                        {stressLevel < 50 ? 'Escalating' : stressLevel < 80 ? 'Critical' : 'Overwhelming'}
                      </p>
                    </CardContent>
                  </Card>

                  <div className="text-center text-xs text-slate-400 pt-2">
                    <p>Industry average response time:</p>
                    <p className="text-lg font-bold text-red-400">20-72 hours</p>
                  </div>
                </div>

                {/* Center: Message Flood */}
                <div className="lg:col-span-2">
                  <Card className="bg-slate-900/50 border-slate-700 h-[450px] overflow-hidden">
                    <CardHeader className="border-b border-slate-700 py-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-white flex items-center gap-2">
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
                                <div className="p-2 bg-slate-800/50 rounded-lg">
                                  <IconComponent className="h-4 w-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-medium text-white">{msg.sender}</span>
                                    <Badge variant="outline" className="text-xs py-0 h-4 bg-transparent text-slate-300 border-slate-600">
                                      {msg.type}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-slate-300 leading-snug">{msg.content}</p>
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
                      <Button variant="outline" onClick={skipChaos} className="flex-1 bg-transparent text-white border-slate-600 hover:bg-slate-800">
                        Skip to Solution
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                    {showChaosComplete && (
                      <div className="flex-1 space-y-3">
                        <div className="p-4 bg-slate-800/50 border border-slate-600 rounded-lg text-center">
                          <p className="text-slate-400 text-sm mb-1">This is what happens WITHOUT ExecuteIQ</p>
                          <p className="text-white font-medium">Chaos. Confusion. Costly delays.</p>
                        </div>
                        <Button 
                          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-6"
                          onClick={moveToPrepared}
                        >
                          <Sparkles className="mr-2 h-5 w-5" />
                          Now See ExecuteIQ in Action
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
                  <span className="text-sm text-slate-400">
                    {formatCurrency(selectedScenario.dealValue)} at stake
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={resetDemo} className="text-slate-400 hover:text-white">
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
                  const colors = PHASE_COLORS[phase.color] || PHASE_COLORS.emerald;
                  
                  return (
                    <div 
                      key={phase.id}
                      className={`p-3 rounded-lg border transition-all ${
                        isCurrent 
                          ? `${colors.bg} ${colors.border}` 
                          : isCompleted 
                            ? 'bg-slate-800/50 border-emerald-500/50' 
                            : 'bg-slate-900/30 border-slate-700/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isCompleted ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <IconComponent className={`h-4 w-4 ${isCurrent ? colors.text : 'text-slate-400'}`} />
                        )}
                        <span className={`text-xs font-medium ${isCurrent ? 'text-white' : isCompleted ? 'text-slate-300' : 'text-slate-400'}`}>
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
                    <Card className="bg-slate-900 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-violet-400" />
                          IDENTIFY: Playbook Ready
                        </CardTitle>
                        <CardDescription>
                          Your {selectedScenario.playbook} playbook was already configured
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="p-4 bg-violet-500/10 border border-violet-500/30 rounded-lg">
                          <h4 className="text-white font-medium mb-3">Playbook: {selectedScenario.playbook}</h4>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2 text-slate-300">
                              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                              12 pre-configured tasks
                            </div>
                            <div className="flex items-center gap-2 text-slate-300">
                              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                              {selectedScenario.stakeholders} stakeholders mapped
                            </div>
                            <div className="flex items-center gap-2 text-slate-300">
                              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                              Response templates staged
                            </div>
                            <div className="flex items-center gap-2 text-slate-300">
                              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                              Budget pre-approved
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                          <div className="flex items-center gap-2 text-emerald-400 mb-2">
                            <Clock className="h-4 w-4" />
                            <span className="font-medium">Time to Ready: 0 minutes</span>
                          </div>
                          <p className="text-sm text-slate-400">
                            Everything was prepared BEFORE the crisis hit
                          </p>
                        </div>

                        <div className="p-3 bg-slate-800/50 rounded-lg">
                          <p className="text-sm text-slate-400">
                            <span className="text-red-400 font-medium">Without ExecuteIQ:</span> 20-50 hours to coordinate a response team, find documents, and get budget approval.
                          </p>
                        </div>

                        <Button 
                          className="w-full bg-violet-600 hover:bg-violet-700"
                          onClick={completeIdentify}
                        >
                          Playbook Ready - Continue to Detection
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {currentPhase === 'detect' && (
                    <Card className="bg-slate-900 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <Radar className="h-5 w-5 text-blue-400" />
                          DETECT: Signal Received
                        </CardTitle>
                        <CardDescription>
                          AI identified a trigger matching your playbook
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg animate-pulse">
                          <div className="flex items-center gap-2 text-red-400 mb-2">
                            <AlertTriangle className="h-5 w-5" />
                            <span className="font-medium">Trigger Detected</span>
                          </div>
                          <p className="text-white">{selectedScenario.trigger}</p>
                          <div className="mt-3 flex items-center gap-4 text-sm text-slate-400">
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              {formatCurrency(selectedScenario.dealValue)} at risk
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              Detected just now
                            </span>
                          </div>
                        </div>

                        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                          <div className="flex items-center gap-2 text-blue-400 mb-2">
                            <Brain className="h-5 w-5" />
                            <span className="font-medium">AI Recommendation</span>
                          </div>
                          <p className="text-sm text-slate-300">
                            Activate <span className="text-white font-medium">{selectedScenario.playbook}</span> playbook. 
                            Match confidence: <span className="text-emerald-400 font-bold">94%</span>
                          </p>
                        </div>

                        <Button 
                          className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-lg font-semibold"
                          onClick={completeDetect}
                        >
                          <Play className="mr-2 h-5 w-5" />
                          Activate Playbook
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {currentPhase === 'execute' && (
                    <Card className="bg-slate-900 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <Radio className="h-5 w-5 text-emerald-400" />
                          EXECUTE: Coordinating Response
                        </CardTitle>
                        <CardDescription>
                          Watch ExecuteIQ orchestrate your response in real-time
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {/* Timer */}
                        <div className="mb-4 p-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-lg text-center">
                          <p className="text-xs text-emerald-400 uppercase tracking-wide mb-1">Execution Time</p>
                          <p className="text-4xl font-bold text-white font-mono">
                            {formatTime(executionTimer)}
                          </p>
                          <p className="text-xs text-emerald-300 mt-1">Target: 12:00</p>
                        </div>

                        <div className="space-y-3">
                          {executionSteps.map((step) => {
                            const IconComponent = step.icon;
                            return (
                              <div 
                                key={step.id}
                                className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg border-l-4 border-emerald-500 animate-in slide-in-from-left"
                              >
                                <div className="p-2 bg-emerald-500/20 rounded-lg">
                                  <IconComponent className="h-4 w-4 text-emerald-400" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <p className="text-white font-medium text-sm">{step.title}</p>
                                    <div className="p-1 bg-slate-700 rounded">
                                      {getIntegrationIcon(step.integration)}
                                    </div>
                                  </div>
                                  <p className="text-slate-400 text-xs">{step.description}</p>
                                </div>
                                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                              </div>
                            );
                          })}
                          
                          {isExecuting && (
                            <div className="flex items-center justify-center p-4 text-slate-400">
                              <div className="animate-spin rounded-full h-5 w-5 border-2 border-emerald-500 border-t-transparent mr-2" />
                              Orchestrating response...
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {currentPhase === 'advance' && (
                    <Card className="bg-slate-900 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <BarChart3 className="h-5 w-5 text-amber-400" />
                          ADVANCE: Capture Learnings
                        </CardTitle>
                        <CardDescription>
                          Turn this execution into institutional knowledge
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {!learnings ? (
                          <div className="space-y-4">
                            <p className="text-slate-400">
                              ExecuteIQ captures what worked and suggests playbook improvements for next time.
                            </p>
                            <Button 
                              className="w-full bg-amber-600 hover:bg-amber-700"
                              onClick={completeAdvance}
                            >
                              <Sparkles className="mr-2 h-4 w-4" />
                              Generate Insights
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                              <div className="flex items-center gap-2 text-emerald-400 mb-1">
                                <CheckCircle2 className="h-4 w-4" />
                                <span className="font-medium text-sm">Execution Complete</span>
                              </div>
                              <p className="text-xs text-slate-400">
                                {formatCurrency(learnings.metrics?.dealValueProtected || 0)} protected
                              </p>
                            </div>

                            <div>
                              <h4 className="text-xs font-medium text-emerald-400 mb-2 flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" />
                                Success Patterns Captured
                              </h4>
                              <div className="space-y-2">
                                {learnings.successPatterns?.map((pattern: any, i: number) => (
                                  <div key={i} className="p-2 bg-slate-800/50 rounded text-xs">
                                    <span className="text-white font-medium">{pattern.category}:</span>
                                    <span className="text-slate-400 ml-1">{pattern.insight}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {currentPhase === 'complete' && (
                    <div className="space-y-6">
                      <Card className="bg-gradient-to-br from-emerald-900/50 to-teal-900/50 border-emerald-500/50">
                        <CardContent className="p-8 text-center">
                          <div className="mb-6">
                            <div className="inline-flex p-4 bg-emerald-500/20 rounded-full mb-4">
                              <Rocket className="h-10 w-10 text-emerald-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Demo Complete</h2>
                            <p className="text-slate-400">You just experienced the IDEA Framework in action</p>
                          </div>

                          <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="p-4 bg-slate-800/50 rounded-lg">
                              <p className="text-2xl font-bold text-emerald-400">12 min</p>
                              <p className="text-xs text-slate-400">Response Time</p>
                            </div>
                            <div className="p-4 bg-slate-800/50 rounded-lg">
                              <p className="text-2xl font-bold text-emerald-400">{formatCurrency(selectedScenario?.dealValue || 0)}</p>
                              <p className="text-xs text-slate-400">Value Protected</p>
                            </div>
                            <div className="p-4 bg-slate-800/50 rounded-lg">
                              <p className="text-2xl font-bold text-emerald-400">98 days</p>
                              <p className="text-xs text-slate-400">Saved (IBM 2024)</p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <Button 
                              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 py-6 text-lg font-semibold"
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
                              className="w-full"
                              onClick={resetDemo}
                            >
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Try Another Scenario
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Industry Deep-Dive Demos */}
                      <Card className="bg-slate-900/80 border-slate-700">
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-lg text-white flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-poise-gold" />
                                Explore Industry Deep-Dives
                              </CardTitle>
                              <CardDescription className="text-slate-400">
                                See ExecuteIQ in action across 9 industries with real company scenarios
                              </CardDescription>
                            </div>
                            <Badge className="bg-poise-gold/20 text-poise-gold border-poise-gold/30">
                              9 Demos
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-4">
                            <div className="flex gap-2 mb-3">
                              <Badge variant="outline" className="text-green-400 border-green-500/30 bg-green-500/10">
                                <Target className="h-3 w-3 mr-1" />
                                Offensive (3)
                              </Badge>
                              <Badge variant="outline" className="text-red-400 border-red-500/30 bg-red-500/10">
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
                                      ? 'border-green-500/30 hover:border-green-400/50' 
                                      : 'border-slate-600/50 hover:border-slate-500/70'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 mb-1">
                                    <IconComponent className={`h-4 w-4 ${demo.iconColor}`} />
                                    <span className="text-xs text-slate-400 uppercase">{demo.industry}</span>
                                  </div>
                                  <p className="text-xs font-medium text-white truncate">{demo.title}</p>
                                  <div className="flex items-center justify-between mt-1">
                                    <span className="text-xs text-slate-400">{demo.organization}</span>
                                    <span className={`text-xs font-semibold ${demo.type === 'offensive' ? 'text-green-400' : 'text-emerald-400'}`}>
                                      {demo.impact}
                                    </span>
                                  </div>
                                  <div className="mt-2 flex items-center gap-1 text-xs text-poise-teal opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span>Explore</span>
                                    <ExternalLink className="h-2.5 w-2.5" />
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                          <div className="mt-4 pt-4 border-t border-slate-700 text-center">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setLocation('/industry-demos');
                                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                              }}
                              className="text-poise-teal border-poise-teal/30 hover:bg-poise-teal/10"
                            >
                              View All Industry Demos
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                  {/* Value Comparison */}
                  <Card className="bg-slate-900/50 border-slate-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-white">Response Comparison</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
                          <p className="text-xs text-red-400 mb-1">Traditional</p>
                          <p className="text-xl font-bold text-red-300">20-72 hrs</p>
                          <p className="text-xs text-slate-400">Industry average</p>
                        </div>
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-center">
                          <p className="text-xs text-emerald-400 mb-1">ExecuteIQ</p>
                          <p className="text-xl font-bold text-emerald-300">12 min</p>
                          <p className="text-xs text-slate-400">Guaranteed</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Enterprise Integrations */}
                  <Card className="bg-slate-900/50 border-slate-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-white">Integrated With Your Stack</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { icon: SiSlack, name: 'Slack', color: '#4A154B' },
                          { icon: SiJira, name: 'Jira', color: '#0052CC' },
                          { icon: Users, name: 'Teams', color: '#6264A7' },
                          { icon: SiSalesforce, name: 'Salesforce', color: '#00A1E0' },
                          { icon: SiNotion, name: 'Notion', color: '#FFFFFF' },
                        ].map(({ icon: Icon, name, color }) => (
                          <div key={name} className="flex items-center gap-1.5 px-2 py-1 bg-slate-800 rounded text-xs">
                            <Icon className="h-3.5 w-3.5" style={{ color }} />
                            <span className="text-slate-300">{name}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Research Citations */}
                  <Card className="bg-slate-900/50 border-slate-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-white">Research-Backed Claims</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-start gap-2 text-xs">
                        <Badge variant="outline" className="text-xs shrink-0 bg-transparent text-slate-300 border-slate-600">IBM 2024</Badge>
                        <span className="text-slate-300">98 days saved with AI/automation</span>
                      </div>
                      <div className="flex items-start gap-2 text-xs">
                        <Badge variant="outline" className="text-xs shrink-0 bg-transparent text-slate-300 border-slate-600">McKinsey</Badge>
                        <span className="text-slate-300">5-10x faster execution</span>
                      </div>
                      <div className="flex items-start gap-2 text-xs">
                        <Badge variant="outline" className="text-xs shrink-0 bg-transparent text-slate-300 border-slate-600">PagerDuty</Badge>
                        <span className="text-slate-300">3.5x faster crisis response</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 166 Playbooks */}
                  <Card className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 border-amber-500/30">
                    <CardContent className="p-4 text-center">
                      <p className="text-4xl font-bold text-amber-400 mb-1">166</p>
                      <p className="text-sm text-amber-200">Pre-Built Playbooks</p>
                      <p className="text-xs text-slate-400 mt-1">Across 9 Strategic Domains</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
