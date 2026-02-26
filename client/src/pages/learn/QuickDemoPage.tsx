import { useState, useEffect, useRef } from 'react';
import IDEALayout from '@/components/layout/IDEALayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useLocation } from 'wouter';
import {
  BookOpen, Radar, Radio, BarChart3, CheckCircle2, ArrowRight,
  AlertTriangle, DollarSign, Users, Zap, RefreshCw, Play,
  ChevronRight, Target, TrendingUp, Brain, Shield, Clock,
  Sparkles, Rocket, Mail, Phone, Calendar, MessageSquare,
  TrendingDown, XCircle, Scale, Briefcase, FileText
} from 'lucide-react';
import { SiSlack, SiJira, SiSalesforce, SiNotion } from 'react-icons/si';

type Phase = 'select' | 'chaos' | 'identify' | 'detect' | 'execute' | 'advance' | 'complete';

interface ChaosMessage {
  id: string;
  type: 'slack' | 'email' | 'text' | 'calendar' | 'call';
  sender: string;
  content: string;
  urgency: 'critical' | 'high' | 'medium';
}

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
      { id: '1', type: 'slack', sender: 'IT Security', content: 'CRITICAL: File encryption detected on production servers. Spreading rapidly.', urgency: 'critical' },
      { id: '2', type: 'email', sender: 'Legal Team', content: 'RE: Breach notification requirements - We have 72 hours under GDPR. Need incident details ASAP.', urgency: 'critical' },
      { id: '3', type: 'slack', sender: 'CFO Office', content: 'Board is asking for immediate update. What do we tell them?', urgency: 'critical' },
      { id: '4', type: 'calendar', sender: 'Emergency Meeting', content: 'Crisis Response - War Room A - In 15 minutes', urgency: 'critical' },
      { id: '5', type: 'text', sender: 'Board Chair', content: 'Just saw the news alert. Call me immediately.', urgency: 'critical' },
      { id: '6', type: 'slack', sender: 'Customer Success', content: '47 enterprise customers reporting system access issues. What do we tell them?', urgency: 'high' },
      { id: '7', type: 'email', sender: 'PR Team', content: 'TechCrunch is calling. They have sources saying we\'ve been breached. Response needed in 30 min.', urgency: 'critical' },
      { id: '8', type: 'slack', sender: 'HR Director', content: 'Employees are panicking. Social media posts appearing. Need comms guidance NOW.', urgency: 'high' },
    ]
  },
  {
    id: 'competitor',
    name: 'Competitor Launch',
    industry: 'Competitive Response',
    icon: Target,
    color: 'from-[#0A0F2E] to-[#141B45]',
    borderColor: 'border-[#C9A84C]/50',
    trigger: 'Major competitor announces product in your category',
    playbook: 'Competitive Response',
    dealValue: 47000000,
    stakeholders: 8,
    revenuePerMinute: 12000,
    chaosMessages: [
      { id: '1', type: 'slack', sender: 'Enterprise Sales', content: 'Acme Corp just put our $2.4M renewal on hold. Citing competitor pricing.', urgency: 'critical' },
      { id: '2', type: 'email', sender: 'Sales Ops', content: 'Pipeline at risk: $47M in deals now reconsidering. Competitor offering 40% discounts.', urgency: 'critical' },
      { id: '3', type: 'slack', sender: 'Channel Partners', content: 'Three major partners asking about our response. Threatening to switch.', urgency: 'high' },
      { id: '4', type: 'text', sender: 'Board Member', content: 'Seeing the news. We need a response strategy today. Not tomorrow.', urgency: 'critical' },
      { id: '5', type: 'email', sender: 'CFO', content: 'If we match pricing, margin impact is $180M annually. Options?', urgency: 'critical' },
      { id: '6', type: 'slack', sender: 'Marketing', content: 'Should we counter with our own campaign? Need budget approval and messaging.', urgency: 'high' },
      { id: '7', type: 'calendar', sender: 'Emergency Pricing Committee', content: 'War Room - Competitive Response - NOW', urgency: 'critical' },
      { id: '8', type: 'text', sender: 'CEO', content: 'Wall Street Journal wants a statement. What\'s our position?', urgency: 'critical' },
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
    ]
  },
  {
    id: 'deal-risk',
    name: 'Deal at Risk',
    industry: 'Sales & Revenue',
    icon: DollarSign,
    color: 'from-[#2B8A6E] to-[#3BAF8A]',
    borderColor: 'border-[#2B8A6E]/50',
    trigger: 'Customer requests accelerated timeline on $5M deal',
    playbook: 'Deal Risk Response',
    dealValue: 5000000,
    stakeholders: 6,
    revenuePerMinute: 3500,
    chaosMessages: [
      { id: '1', type: 'slack', sender: 'Account Executive', content: 'GlobalTech just called - they need delivery 6 weeks early or deal is dead.', urgency: 'critical' },
      { id: '2', type: 'email', sender: 'VP Sales', content: 'This is our largest Q4 deal. Losing it puts us under forecast. Need options NOW.', urgency: 'critical' },
      { id: '3', type: 'slack', sender: 'Product Team', content: 'Accelerated timeline means cutting testing phase. Risk assessment needed.', urgency: 'high' },
      { id: '4', type: 'text', sender: 'CEO', content: 'I just heard about GlobalTech. What\'s our plan? Board meeting in 2 hours.', urgency: 'critical' },
      { id: '5', type: 'calendar', sender: 'Deal Review', content: 'Emergency Deal Strategy - All Hands - NOW', urgency: 'critical' },
      { id: '6', type: 'slack', sender: 'Finance', content: 'If we expedite, overtime costs are $340K. Need approval for budget exception.', urgency: 'high' },
      { id: '7', type: 'email', sender: 'Legal', content: 'Contract modification needed for new timeline. SLA penalties at risk.', urgency: 'high' },
      { id: '8', type: 'slack', sender: 'Customer Success', content: 'Customer asking why we can\'t match competitor\'s timeline. Losing confidence.', urgency: 'critical' },
    ]
  },
];

const PHASES = [
  { id: 'chaos' as Phase, name: 'THE CHAOS', icon: AlertTriangle, color: 'red' },
  { id: 'identify' as Phase, name: 'IDENTIFY', icon: BookOpen, color: 'violet' },
  { id: 'detect' as Phase, name: 'DETECT', icon: Radar, color: 'blue' },
  { id: 'execute' as Phase, name: 'EXECUTE', icon: Radio, color: 'emerald' },
  { id: 'advance' as Phase, name: 'ADVANCE', icon: BarChart3, color: 'amber' },
];

const MESSAGE_ICONS: Record<string, any> = {
  slack: SiSlack,
  email: Mail,
  text: MessageSquare,
  calendar: Calendar,
  call: Phone,
};

const PHASE_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  violet: { bg: 'bg-[#C9A84C]/20', border: 'border-[#C9A84C]', text: 'text-[#C9A84C]' },
  blue: { bg: 'bg-[#0A0F2E]/20', border: 'border-[#0A0F2E]', text: 'text-[#0A0F2E]' },
  emerald: { bg: 'bg-[#2B8A6E]/20', border: 'border-[#2B8A6E]', text: 'text-[#2B8A6E]' },
  amber: { bg: 'bg-amber-500/20', border: 'border-amber-500', text: 'text-amber-400' },
  red: { bg: 'bg-red-500/20', border: 'border-red-500', text: 'text-red-400' },
};

const URGENCY_COLORS: Record<string, string> = {
  critical: 'bg-red-500/20 border-red-500 text-red-300',
  high: 'bg-orange-500/20 border-orange-500 text-orange-300',
  medium: 'bg-yellow-500/20 border-yellow-500 text-yellow-300',
};

export default function QuickDemoPage() {
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
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [chaosMessages]);

  useEffect(() => {
    if (currentPhase !== 'select') {
      contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentPhase]);

  useEffect(() => {
    if (showChaosComplete) {
      const timer = setTimeout(() => moveToPrepared(), 2500);
      return () => clearTimeout(timer);
    }
  }, [showChaosComplete]);

  useEffect(() => {
    if (currentPhase === 'identify') {
      const timer = setTimeout(() => completeIdentify(), 3500);
      return () => clearTimeout(timer);
    }
    if (currentPhase === 'detect') {
      const timer = setTimeout(() => completeDetect(), 3500);
      return () => clearTimeout(timer);
    }
    if (currentPhase === 'advance' && !learnings) {
      const timer = setTimeout(() => completeAdvance(), 3000);
      return () => clearTimeout(timer);
    }
  }, [currentPhase, learnings]);

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
    setLearnings({
      successPatterns: [
        { category: 'Early Detection', insight: 'Signal detected 3 weeks before traditional discovery' },
        { category: 'Stakeholder Alignment', insight: `${selectedScenario?.stakeholders || 6} stakeholders aligned in 12 minutes` },
        { category: 'Decision Velocity', insight: 'Executive sponsor briefed before escalation' },
      ],
      metrics: {
        dealValueProtected: selectedScenario?.dealValue || 5000000,
        hoursRecovered: 98,
      },
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
      case 'notion': return <SiNotion className="h-4 w-4 text-gray-900" />;
      default: return <Zap className="h-4 w-4 text-[#2B8A6E]" />;
    }
  };

  return (
    <IDEALayout>
      <div ref={contentRef} className="container max-w-5xl mx-auto py-8 px-4">
        {currentPhase === 'select' && (
          <>
            <div className="text-center mb-8">
              <Badge className="mb-4 bg-gradient-to-r from-amber-500/20 to-emerald-500/20 text-amber-300 border-amber-500/30">
                5-Minute Interactive Demo
              </Badge>
              <h1 className="text-3xl font-bold mb-2">Experience Execution OS</h1>
              <p className="text-muted-foreground text-lg">
                Choose a crisis scenario and watch Execution OS transform chaos into coordinated execution
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {SCENARIOS.map((scenario) => {
                const IconComponent = scenario.icon;
                return (
                  <Card
                    key={scenario.id}
                    className={`cursor-pointer transition-all hover:shadow-xl hover:scale-[1.02] group border-2 ${scenario.borderColor}`}
                    onClick={() => startDemo(scenario)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${scenario.color}`}>
                          <IconComponent className="h-6 w-6 text-gray-900" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold group-hover:text-[#2B8A6E] dark:group-hover:text-[#2B8A6E] transition-colors mb-1">
                            {scenario.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">{scenario.industry}</p>
                          <p className="text-sm text-muted-foreground mb-3">{scenario.trigger}</p>
                          <div className="flex items-center gap-4 text-xs">
                            <span className="flex items-center gap-1 text-red-500 dark:text-red-400">
                              <TrendingDown className="h-3 w-3" />
                              ${(scenario.revenuePerMinute / 1000).toFixed(1)}K/min at risk
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-all" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="mt-8 pt-6 border-t text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Want to see the full demo experience with industry deep-dives?
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setLocation('/try-demo');
                  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                }}
              >
                Open Full Demo Experience
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </>
        )}

        {currentPhase === 'chaos' && selectedScenario && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <Badge className="bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30 animate-pulse">
                <AlertTriangle className="h-3 w-3 mr-1" />
                CRISIS IN PROGRESS
              </Badge>
              <Button variant="ghost" size="sm" onClick={resetDemo}>
                <XCircle className="h-4 w-4 mr-1" />
                Exit Demo
              </Button>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <Card className="border-red-500/50 bg-red-50 dark:bg-red-950/50">
                  <CardContent className="p-4 text-center">
                    <p className="text-xs text-red-700 dark:text-red-400 uppercase tracking-wide mb-1">Revenue Bleeding</p>
                    <p className="text-3xl font-bold text-red-700 dark:text-red-300 font-mono">
                      -{formatCurrency(revenueLost)}
                    </p>
                    <p className="text-xs text-red-500 dark:text-red-400/70 mt-1">
                      ${(selectedScenario.revenuePerMinute / 1000).toFixed(1)}K per minute
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Time Elapsed</p>
                    <p className="text-3xl font-bold font-mono">
                      {formatTime(chaosSeconds)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Still no coordinated response</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Stress Level</p>
                    <Progress value={stressLevel} className="h-3" />
                    <p className="text-xs text-orange-500 dark:text-orange-400 mt-2 text-center">
                      {stressLevel < 50 ? 'Escalating' : stressLevel < 80 ? 'Critical' : 'Overwhelming'}
                    </p>
                  </CardContent>
                </Card>

                <div className="text-center text-xs text-muted-foreground pt-2">
                  <p>Industry average response time:</p>
                  <p className="text-lg font-bold text-red-500 dark:text-red-400">20-72 hours</p>
                </div>
              </div>

              <div className="lg:col-span-2">
                <Card className="h-[420px] overflow-hidden">
                  <CardHeader className="border-b py-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-red-500 dark:text-red-400" />
                        Incoming Messages
                      </CardTitle>
                      <Badge variant="outline" className="text-red-500 dark:text-red-400 border-red-500/50">
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
                              <div className="p-2 bg-background/50 rounded-lg">
                                <IconComponent className="h-4 w-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-medium">{msg.sender}</span>
                                  <Badge variant="outline" className="text-xs py-0 h-4 bg-transparent">
                                    {msg.type}
                                  </Badge>
                                </div>
                                <p className="text-sm leading-snug">{msg.content}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  </CardContent>
                </Card>

                <div className="mt-4 flex gap-3">
                  {!showChaosComplete && (
                    <Button variant="outline" onClick={skipChaos} className="flex-1">
                      Skip to Solution
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                  {showChaosComplete && (
                    <div className="flex-1 space-y-3">
                      <div className="p-4 border rounded-lg text-center">
                        <p className="text-muted-foreground text-sm mb-1">This is what happens WITHOUT Execution OS</p>
                        <p className="font-medium">Chaos. Confusion. Costly delays.</p>
                      </div>
                      <Button
                        className="w-full bg-gradient-to-r from-[#2B8A6E] to-[#3BAF8A] hover:from-[#256B56] hover:to-[#3BAF8A] text-gray-900 font-semibold py-6"
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

        {currentPhase !== 'select' && currentPhase !== 'chaos' && selectedScenario && (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Badge className={`bg-gradient-to-r ${selectedScenario.color} text-gray-900`}>
                  {selectedScenario.name}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {formatCurrency(selectedScenario.dealValue)} at stake
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={resetDemo}>
                <RefreshCw className="h-4 w-4 mr-1" />
                Try Another
              </Button>
            </div>

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
                          ? 'bg-[#F0F9F6] dark:bg-slate-800/50 border-[#2B8A6E]/50'
                          : 'bg-muted/30 border-border/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isCompleted ? (
                        <CheckCircle2 className="h-4 w-4 text-[#2B8A6E] dark:text-[#2B8A6E]" />
                      ) : (
                        <IconComponent className={`h-4 w-4 ${isCurrent ? colors.text : 'text-muted-foreground'}`} />
                      )}
                      <span className={`text-xs font-medium ${isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {phase.name}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <Progress value={getPhaseProgress()} className="mb-8 h-2" />

            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                {currentPhase === 'identify' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-[#C9A84C]" />
                        IDENTIFY: Playbook Ready
                      </CardTitle>
                      <CardDescription>
                        Your {selectedScenario.playbook} playbook was already configured
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-[#0A0F2E] dark:bg-[#C9A84C]/10 border border-[#C9A84C] dark:border-[#C9A84C]/30 rounded-lg">
                        <h4 className="font-medium mb-3">Playbook: {selectedScenario.playbook}</h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <CheckCircle2 className="h-4 w-4 text-[#2B8A6E]" />
                            12 pre-configured tasks
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <CheckCircle2 className="h-4 w-4 text-[#2B8A6E]" />
                            {selectedScenario.stakeholders} stakeholders mapped
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <CheckCircle2 className="h-4 w-4 text-[#2B8A6E]" />
                            Response templates staged
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <CheckCircle2 className="h-4 w-4 text-[#2B8A6E]" />
                            Budget pre-approved
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-[#F0F9F6] dark:bg-[#2B8A6E]/10 border border-[#2B8A6E] dark:border-[#2B8A6E]/30 rounded-lg">
                        <div className="flex items-center gap-2 text-[#2B8A6E] dark:text-[#2B8A6E] mb-2">
                          <Clock className="h-4 w-4" />
                          <span className="font-medium">Time to Ready: 0 minutes</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Everything was prepared BEFORE the crisis hit
                        </p>
                      </div>

                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          <span className="text-red-500 dark:text-red-400 font-medium">Without Execution OS:</span> 20-50 hours to coordinate a response team, find documents, and get budget approval.
                        </p>
                      </div>

                      <Button className="w-full bg-[#0A0F2E] hover:bg-[#0A0F2E] text-gray-900" onClick={completeIdentify}>
                        Playbook Ready - Continue to Detection
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {currentPhase === 'detect' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Radar className="h-5 w-5 text-[#0A0F2E]" />
                        DETECT: Signal Received
                      </CardTitle>
                      <CardDescription>
                        AI identified a trigger matching your playbook
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-lg animate-pulse">
                        <div className="flex items-center gap-2 text-red-700 dark:text-red-400 mb-2">
                          <AlertTriangle className="h-5 w-5" />
                          <span className="font-medium">Trigger Detected</span>
                        </div>
                        <p className="font-medium">{selectedScenario.trigger}</p>
                        <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
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

                      <div className="p-4 bg-[#0A0F2E] dark:bg-[#0A0F2E]/10 border border-[#0A0F2E] dark:border-[#0A0F2E]/30 rounded-lg">
                        <div className="flex items-center gap-2 text-[#0A0F2E] dark:text-[#0A0F2E] mb-2">
                          <Brain className="h-5 w-5" />
                          <span className="font-medium">AI Recommendation</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Activate <span className="font-medium text-foreground">{selectedScenario.playbook}</span> playbook.
                          Match confidence: <span className="text-[#2B8A6E] dark:text-[#2B8A6E] font-bold">94%</span>
                        </p>
                      </div>

                      <Button className="w-full bg-[#0A0F2E] hover:bg-[#0A0F2E] text-gray-900 py-6 text-lg font-semibold" onClick={completeDetect}>
                        <Play className="mr-2 h-5 w-5" />
                        Activate Playbook
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {currentPhase === 'execute' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Radio className="h-5 w-5 text-[#2B8A6E]" />
                        EXECUTE: Coordinating Response
                      </CardTitle>
                      <CardDescription>
                        Watch Execution OS orchestrate your response in real-time
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4 p-4 bg-[#F0F9F6] dark:bg-gradient-to-r dark:from-[#2B8A6E]/15 dark:to-[#3BAF8A]/20 border border-[#2B8A6E] dark:border-[#2B8A6E]/30 rounded-lg text-center">
                        <p className="text-xs text-[#2B8A6E] dark:text-[#2B8A6E] uppercase tracking-wide mb-1">Execution Time</p>
                        <p className="text-4xl font-bold font-mono">
                          {formatTime(executionTimer)}
                        </p>
                        <p className="text-xs text-[#2B8A6E] dark:text-[#2B8A6E] mt-1">Target: 12:00</p>
                      </div>

                      <div className="space-y-3">
                        {executionSteps.map((step) => {
                          const IconComponent = step.icon;
                          return (
                            <div
                              key={step.id}
                              className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg border-l-4 border-[#2B8A6E] animate-in slide-in-from-left"
                            >
                              <div className="p-2 bg-[#F0F9F6] dark:bg-[#2B8A6E]/20 rounded-lg">
                                <IconComponent className="h-4 w-4 text-[#2B8A6E] dark:text-[#2B8A6E]" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-sm">{step.title}</p>
                                  <div className="p-1 bg-muted rounded">
                                    {getIntegrationIcon(step.integration)}
                                  </div>
                                </div>
                                <p className="text-muted-foreground text-xs">{step.description}</p>
                              </div>
                              <CheckCircle2 className="h-4 w-4 text-[#2B8A6E] dark:text-[#2B8A6E]" />
                            </div>
                          );
                        })}

                        {isExecuting && (
                          <div className="flex items-center justify-center p-4 text-muted-foreground">
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#2B8A6E] border-t-transparent mr-2" />
                            Orchestrating response...
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {currentPhase === 'advance' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-amber-500" />
                        ADVANCE: Capture Learnings
                      </CardTitle>
                      <CardDescription>
                        Turn this execution into institutional knowledge
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {!learnings ? (
                        <div className="space-y-4">
                          <p className="text-muted-foreground">
                            Execution OS captures what worked and suggests playbook improvements for next time.
                          </p>
                          <Button className="w-full bg-amber-600 hover:bg-amber-700 text-gray-900" onClick={completeAdvance}>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Generate Insights
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="p-3 bg-[#F0F9F6] dark:bg-[#2B8A6E]/10 border border-[#2B8A6E] dark:border-[#2B8A6E]/30 rounded-lg">
                            <div className="flex items-center gap-2 text-[#2B8A6E] dark:text-[#2B8A6E] mb-1">
                              <CheckCircle2 className="h-4 w-4" />
                              <span className="font-medium text-sm">Execution Complete</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {formatCurrency(learnings.metrics?.dealValueProtected || 0)} protected
                            </p>
                          </div>

                          <div>
                            <h4 className="text-xs font-medium text-[#2B8A6E] dark:text-[#2B8A6E] mb-2 flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              Success Patterns Captured
                            </h4>
                            <div className="space-y-2">
                              {learnings.successPatterns?.map((pattern: any, i: number) => (
                                <div key={i} className="p-2 bg-muted/50 rounded text-xs">
                                  <span className="font-medium">{pattern.category}:</span>
                                  <span className="text-muted-foreground ml-1">{pattern.insight}</span>
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
                  <Card className="border-[#2B8A6E]/50 bg-[#F0F9F6] dark:bg-gradient-to-br dark:from-[#2B8A6E]/15 dark:to-[#3BAF8A]/50">
                    <CardContent className="p-8 text-center">
                      <div className="mb-6">
                        <div className="inline-flex p-4 bg-[#F0F9F6] dark:bg-[#2B8A6E]/20 rounded-full mb-4">
                          <Rocket className="h-10 w-10 text-[#2B8A6E] dark:text-[#2B8A6E]" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Demo Complete</h2>
                        <p className="text-muted-foreground">You just experienced the IDEA Framework in action</p>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="p-4 bg-background/50 rounded-lg">
                          <p className="text-2xl font-bold text-[#2B8A6E] dark:text-[#2B8A6E]">12 min</p>
                          <p className="text-xs text-muted-foreground">Response Time</p>
                        </div>
                        <div className="p-4 bg-background/50 rounded-lg">
                          <p className="text-2xl font-bold text-[#2B8A6E] dark:text-[#2B8A6E]">{formatCurrency(selectedScenario?.dealValue || 0)}</p>
                          <p className="text-xs text-muted-foreground">Value Protected</p>
                        </div>
                        <div className="p-4 bg-background/50 rounded-lg">
                          <p className="text-2xl font-bold text-[#2B8A6E] dark:text-[#2B8A6E]">98 days</p>
                          <p className="text-xs text-muted-foreground">Saved (IBM 2024)</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Button
                          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-gray-900 py-6 text-lg font-semibold"
                          onClick={() => {
                            setLocation('/try-demo');
                            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                          }}
                        >
                          <Rocket className="mr-2 h-5 w-5" />
                          Start Your Pilot
                        </Button>
                        <Button variant="outline" className="w-full" onClick={resetDemo}>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Try Another Scenario
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="space-y-4">
                <Card className="bg-[#F0F9F6] dark:bg-[#2B8A6E]/5 border-[#2B8A6E] dark:border-[#2B8A6E]/20">
                  <CardContent className="p-4">
                    <h4 className="text-sm font-medium text-[#2B8A6E] dark:text-[#2B8A6E] mb-3 flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      What Execution OS Is Doing
                    </h4>
                    <div className="space-y-3 text-sm">
                      {currentPhase === 'identify' && (
                        <>
                          <p className="text-muted-foreground">Pre-configured playbooks mean zero setup time when a crisis hits. Tasks, stakeholders, documents, and budgets are already defined.</p>
                          <div className="p-3 bg-background rounded-lg">
                            <p className="text-xs font-medium mb-1">Key Differentiator</p>
                            <p className="text-xs text-muted-foreground">170 playbooks across 9 strategic domains. Customize any or build your own.</p>
                          </div>
                        </>
                      )}
                      {currentPhase === 'detect' && (
                        <>
                          <p className="text-muted-foreground">AI pattern matching identifies triggers and recommends the right playbook. Human executives make the final call.</p>
                          <div className="p-3 bg-background rounded-lg">
                            <p className="text-xs font-medium mb-1">Human-AI Partnership</p>
                            <p className="text-xs text-muted-foreground">AI recommends. Humans decide. Clear decision rights at every step.</p>
                          </div>
                        </>
                      )}
                      {currentPhase === 'execute' && (
                        <>
                          <p className="text-muted-foreground">Execution OS orchestrates across Jira, Slack, Teams, Salesforce, and more. Tasks assigned, war rooms launched, budgets released automatically.</p>
                          <div className="p-3 bg-background rounded-lg">
                            <p className="text-xs font-medium mb-1">12-Minute Execution</p>
                            <p className="text-xs text-muted-foreground">From trigger to coordinated execution across 50-200+ stakeholders.</p>
                          </div>
                        </>
                      )}
                      {currentPhase === 'advance' && (
                        <>
                          <p className="text-muted-foreground">Every execution captures learnings that improve future responses. Your institutional knowledge compounds over time.</p>
                          <div className="p-3 bg-background rounded-lg">
                            <p className="text-xs font-medium mb-1">Compounding Moat</p>
                            <p className="text-xs text-muted-foreground">Cross-domain pattern detection and outcome benchmarking create a proprietary intelligence layer.</p>
                          </div>
                        </>
                      )}
                      {currentPhase === 'complete' && (
                        <>
                          <p className="text-muted-foreground">The full IDEA Framework loop is complete. This same process works across all 9 strategic domains.</p>
                          <div className="p-3 bg-background rounded-lg">
                            <p className="text-xs font-medium mb-1">Ready for Your Organization</p>
                            <p className="text-xs text-muted-foreground">Start a pilot to see Execution OS with your real playbooks and integrations.</p>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {(currentPhase === 'execute' || currentPhase === 'advance' || currentPhase === 'complete') && (
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-[#2B8A6E]" />
                        Value Protected
                      </h4>
                      <p className="text-3xl font-bold text-[#2B8A6E] dark:text-[#2B8A6E] mb-1">
                        {formatCurrency(currentPhase === 'complete' ? (selectedScenario?.dealValue || 0) : savedValue)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        vs. {formatCurrency(revenueLost)} lost during chaos phase
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </IDEALayout>
  );
}
