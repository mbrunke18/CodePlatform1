import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  AlertTriangle, 
  TrendingDown, 
  Shield, 
  Clock, 
  CheckCircle2, 
  Target,
  Radio,
  Activity,
  ArrowRight,
  Bell,
  Users,
  Building2,
  DollarSign,
  FileText,
  ChevronRight,
  Timer,
  Rocket,
  BarChart3,
  Briefcase,
  Globe,
  TrendingUp,
  AlertCircle,
  MessageSquare,
  Mail,
  Phone,
  Video,
  Zap,
  Eye,
  MapPin,
  Calendar,
  Star,
  Award,
  CircleDot,
  Send,
  Inbox,
  CheckCheck,
  XCircle
} from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { useTimelineState, useTimelineOrchestrator } from '@/contexts/DemoTimelineContext';

type LucideIconType = typeof TrendingDown;

interface CompanyProfile {
  name: string;
  industry: string;
  revenue: string;
  employees: string;
  headquarters: string;
  role: string;
  persona: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar: string;
  status: 'available' | 'busy' | 'offline';
}

interface IntelligenceSignal {
  id: string;
  type: 'competitor' | 'market' | 'regulatory' | 'supply_chain' | 'customer';
  title: string;
  description: string;
  source: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  timestamp: Date;
  icon: LucideIconType;
  actionRequired: boolean;
}

interface PlaybookAction {
  id: string;
  name: string;
  assignee: string;
  department: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  duration: string;
  notes?: string;
}

interface Notification {
  id: string;
  type: 'signal' | 'task' | 'message' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

const COMPANY_PROFILE: CompanyProfile = {
  name: 'Meridian Industries',
  industry: 'Advanced Manufacturing',
  revenue: '$4.2B',
  employees: '12,500',
  headquarters: 'Chicago, IL',
  role: 'Chief Strategy Officer',
  persona: 'Sarah Chen'
};

const TEAM_MEMBERS: TeamMember[] = [
  { id: '1', name: 'Michael Torres', role: 'CFO', department: 'Finance', avatar: 'MT', status: 'available' },
  { id: '2', name: 'Jennifer Walsh', role: 'CMO', department: 'Marketing', avatar: 'JW', status: 'available' },
  { id: '3', name: 'David Kim', role: 'VP Operations', department: 'Operations', avatar: 'DK', status: 'busy' },
  { id: '4', name: 'Amanda Foster', role: 'General Counsel', department: 'Legal', avatar: 'AF', status: 'available' },
  { id: '5', name: 'Robert Chen', role: 'VP Sales', department: 'Sales', avatar: 'RC', status: 'available' },
  { id: '6', name: 'Lisa Park', role: 'CHRO', department: 'HR', avatar: 'LP', status: 'offline' },
];

const INITIAL_SIGNALS: IntelligenceSignal[] = [
  {
    id: 'sig-1',
    type: 'market',
    title: 'Q4 demand forecast revised upward',
    description: 'Industry analysts project 15% higher demand in Q4 due to infrastructure bill passage',
    source: 'Bloomberg Terminal',
    severity: 'medium',
    timestamp: new Date(Date.now() - 3600000),
    icon: TrendingUp,
    actionRequired: false
  },
  {
    id: 'sig-2',
    type: 'customer',
    title: 'Enterprise client expansion opportunity',
    description: 'Caterpillar reviewing $45M multi-year contract renewal with potential 30% expansion',
    source: 'Salesforce CRM',
    timestamp: new Date(Date.now() - 7200000),
    severity: 'high',
    icon: Building2,
    actionRequired: true
  }
];

type SimulationPhase = 'intro' | 'dashboard' | 'signal_detected' | 'analyzing' | 'playbook_selection' | 'team_coordination' | 'execution' | 'monitoring' | 'complete';

export default function ExecutiveSimulationDemo() {
  const [, setLocation] = useLocation();
  const timelineState = useTimelineState();
  const orchestrator = useTimelineOrchestrator();
  const [phase, setPhase] = useState<SimulationPhase>('intro');
  const [isRunning, setIsRunning] = useState(false);
  const [signals, setSignals] = useState<IntelligenceSignal[]>(INITIAL_SIGNALS);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedPlaybook, setSelectedPlaybook] = useState<string | null>(null);
  const [playbookActions, setPlaybookActions] = useState<PlaybookAction[]>([]);
  const [activeTab, setActiveTab] = useState('radar');
  const [showCriticalAlert, setShowCriticalAlert] = useState(false);
  const [criticalSignal, setCriticalSignal] = useState<IntelligenceSignal | null>(null);
  
  const executionTimersRef = useRef<NodeJS.Timeout[]>([]);
  
  const elapsedTime = timelineState.elapsedMs;

  const clearAllTimers = useCallback(() => {
    executionTimersRef.current.forEach(timer => clearTimeout(timer));
    executionTimersRef.current = [];
  }, []);

  const startSimulation = useCallback(() => {
    clearAllTimers();
    setPhase('dashboard');
    setIsRunning(true);
    setSignals(INITIAL_SIGNALS);
    setNotifications([]);
    setSelectedPlaybook(null);
    setPlaybookActions([]);
    setShowCriticalAlert(false);
    setCriticalSignal(null);
    
    orchestrator.startOnce({ duration: 720000, speedMultiplier: 20 });
  }, [clearAllTimers, orchestrator]);

  const resetSimulation = useCallback(() => {
    clearAllTimers();
    setPhase('intro');
    setIsRunning(false);
    setSignals(INITIAL_SIGNALS);
    setNotifications([]);
    setSelectedPlaybook(null);
    setPlaybookActions([]);
    setShowCriticalAlert(false);
    setCriticalSignal(null);
    setActiveTab('radar');
    
    orchestrator.resetAll();
  }, [clearAllTimers, orchestrator]);

  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  useEffect(() => {
    if (phase !== 'dashboard' || !isRunning) return;

    const criticalAlertTimer = setTimeout(() => {
      const newSignal: IntelligenceSignal = {
        id: 'sig-critical',
        type: 'competitor',
        title: 'URGENT: Competitor Acquisition Announced',
        description: 'TitanTech Industries announces acquisition of Precision Components Inc. for $890M - directly impacts our supply chain and market position',
        source: 'Reuters + SEC Filing',
        severity: 'critical',
        timestamp: new Date(),
        icon: AlertTriangle,
        actionRequired: true
      };

      setCriticalSignal(newSignal);
      setSignals(prev => [newSignal, ...prev]);
      setShowCriticalAlert(true);
      setPhase('signal_detected');

      const notification: Notification = {
        id: 'notif-1',
        type: 'signal',
        title: 'Critical Signal Detected',
        message: 'Competitor acquisition impacts your market position. Immediate response recommended.',
        timestamp: new Date(),
        read: false
      };
      setNotifications(prev => [notification, ...prev]);
    }, 5000);

    return () => clearTimeout(criticalAlertTimer);
  }, [phase, isRunning]);

  const handleAcknowledgeAlert = useCallback(() => {
    setShowCriticalAlert(false);
    setPhase('analyzing');
    setActiveTab('signals');

    const timer = setTimeout(() => {
      setPhase('playbook_selection');
    }, 2000);
    executionTimersRef.current.push(timer);
  }, []);

  const handleSelectPlaybook = useCallback((playbookId: string) => {
    setSelectedPlaybook(playbookId);
    setPhase('team_coordination');

    const actions: PlaybookAction[] = [
      { id: 'a1', name: 'Convene executive response team', assignee: 'Sarah Chen', department: 'Strategy', status: 'pending', duration: '5 min' },
      { id: 'a2', name: 'Assess supply chain exposure', assignee: 'David Kim', department: 'Operations', status: 'pending', duration: '15 min' },
      { id: 'a3', name: 'Analyze competitive positioning impact', assignee: 'Jennifer Walsh', department: 'Marketing', status: 'pending', duration: '20 min' },
      { id: 'a4', name: 'Review existing contracts and exclusivity clauses', assignee: 'Amanda Foster', department: 'Legal', status: 'pending', duration: '30 min' },
      { id: 'a5', name: 'Prepare customer retention messaging', assignee: 'Robert Chen', department: 'Sales', status: 'pending', duration: '25 min' },
      { id: 'a6', name: 'Model financial scenarios (best/worst case)', assignee: 'Michael Torres', department: 'Finance', status: 'pending', duration: '45 min' },
    ];
    setPlaybookActions(actions);
  }, []);

  const handleLaunchExecution = useCallback(() => {
    setPhase('execution');
    setActiveTab('command');
    
    playbookActions.forEach((action, index) => {
      const startDelay = index * 1500;
      const completeDelay = startDelay + 2000 + Math.random() * 1500;

      const startTimer = setTimeout(() => {
        setPlaybookActions(prev => prev.map(a => 
          a.id === action.id ? { ...a, status: 'in_progress' } : a
        ));
      }, startDelay);
      executionTimersRef.current.push(startTimer);

      const completeTimer = setTimeout(() => {
        setPlaybookActions(prev => prev.map(a => 
          a.id === action.id ? { ...a, status: 'completed' } : a
        ));
      }, completeDelay);
      executionTimersRef.current.push(completeTimer);
    });

    const monitoringTimer = setTimeout(() => {
      setPhase('monitoring');
    }, playbookActions.length * 1500 + 4000);
    executionTimersRef.current.push(monitoringTimer);

    const completeTimer = setTimeout(() => {
      setPhase('complete');
      setIsRunning(false);
    }, playbookActions.length * 1500 + 7000);
    executionTimersRef.current.push(completeTimer);
  }, [playbookActions]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const completedActions = playbookActions.filter(a => a.status === 'completed').length;
  const progressPercent = playbookActions.length > 0 ? (completedActions / playbookActions.length) * 100 : 0;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-[#0A0F2E] text-white';
      case 'high': return 'bg-[#C9A84C]/20 text-[#C9A84C]';
      case 'medium': return 'bg-[#C9A84C]/10 text-[#C9A84C]';
      case 'low': return 'bg-[#0A0F2E]/10 text-[#C9A84C]';
      default: return 'bg-[#6B7280]/10 text-[#6B7280]';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-[#2B8A6E]';
      case 'in_progress': return 'text-[#C9A84C]';
      case 'blocked': return 'text-[#C9A84C]';
      default: return 'text-[#C9A84C]/60';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-5 h-5" />;
      case 'in_progress': return <Activity className="w-5 h-5 animate-pulse text-[#C9A84C]" />;
      case 'blocked': return <XCircle className="w-5 h-5 text-[#C9A84C]" />;
      default: return <CircleDot className="w-5 h-5 text-[#C9A84C]" />;
    }
  };

  if (phase === 'intro') {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center p-6">
          <Card className="max-w-3xl w-full border-[#E8E4DC] dark:border-[#C9A84C]/10 bg-white dark:bg-white/5" data-testid="card-simulation-intro">
            <CardHeader className="text-center pb-2">
              <div className="w-20 h-20 mx-auto mb-6 bg-[#0A0F2E] rounded-2xl flex items-center justify-center">
                <Briefcase className="w-10 h-10 text-white" />
              </div>
              <Badge className="mx-auto mb-4 bg-[#0A0F2E] text-white border-none font-bold">
                Executive Simulation
              </Badge>
              <CardTitle className="text-3xl font-bold text-[#0A0F2E] dark:text-white mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Welcome to Your Day as CSO
              </CardTitle>
              <CardDescription className="text-lg text-[#6B7280] dark:text-[#C9A84C]/60">
                Experience Execution OS from the perspective of a Fortune 500 executive
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="bg-[#F8F7F4] dark:bg-white/5 rounded-xl p-6 border border-[#E8E4DC] dark:border-[#C9A84C]/10">
                <h3 className="text-lg font-semibold text-[#0A0F2E] dark:text-white mb-4 flex items-center gap-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  <Building2 className="w-5 h-5 text-[#C9A84C]" />
                  Your Company Profile
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-[#6B7280] dark:text-[#C9A84C]/60">Company:</span>
                    <span className="text-[#0A0F2E] dark:text-[#C9A84C] ml-2 font-medium">{COMPANY_PROFILE.name}</span>
                  </div>
                  <div>
                    <span className="text-[#6B7280] dark:text-[#C9A84C]/60">Industry:</span>
                    <span className="text-[#0A0F2E] dark:text-[#C9A84C] ml-2 font-medium">{COMPANY_PROFILE.industry}</span>
                  </div>
                  <div>
                    <span className="text-[#6B7280] dark:text-[#C9A84C]/60">Revenue:</span>
                    <span className="text-[#0A0F2E] dark:text-[#C9A84C] ml-2 font-medium">{COMPANY_PROFILE.revenue}</span>
                  </div>
                  <div>
                    <span className="text-[#6B7280] dark:text-[#C9A84C]/60">Employees:</span>
                    <span className="text-[#0A0F2E] dark:text-[#C9A84C] ml-2 font-medium">{COMPANY_PROFILE.employees}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#0A0F2E] rounded-xl p-6 border border-[#C9A84C]/10">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  <Users className="w-5 h-5 text-[#C9A84C]" />
                  Your Role
                </h3>
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16 border-2 border-[#C9A84C]">
                    <AvatarFallback className="bg-[#C9A84C] text-[#0A0F2E] text-lg font-bold">SC</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xl font-bold text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{COMPANY_PROFILE.persona}</p>
                    <p className="text-[#C9A84C]">{COMPANY_PROFILE.role}</p>
                    <p className="text-[#C9A84C]/60 text-sm mt-1">{COMPANY_PROFILE.headquarters}</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#F8F7F4] dark:bg-white/5 rounded-xl p-6 border border-[#E8E4DC] dark:border-[#C9A84C]/10">
                <h3 className="text-lg font-semibold text-[#0A0F2E] dark:text-white mb-4 flex items-center gap-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  <Target className="w-5 h-5 text-[#C9A84C]" />
                  What You'll Experience
                </h3>
                <ul className="space-y-3 text-[#0A0F2E] dark:text-white/80">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#2B8A6E] mt-0.5 flex-shrink-0" />
                    <span>Monitor real-time intelligence signals from multiple sources</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#2B8A6E] mt-0.5 flex-shrink-0" />
                    <span>Respond to a critical strategic event as it unfolds</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#2B8A6E] mt-0.5 flex-shrink-0" />
                    <span>Activate a pre-built playbook and coordinate your team</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#2B8A6E] mt-0.5 flex-shrink-0" />
                    <span>See how Execution OS compresses 72-hour responses to 12 minutes</span>
                  </li>
                </ul>
              </div>
            </CardContent>

            <CardFooter className="flex justify-center pt-4">
              <Button 
                size="lg" 
                onClick={startSimulation}
                className="bg-[#C9A84C] hover:bg-[#DFC178] text-[#0A0F2E] font-bold px-12 py-6 text-lg"
                data-testid="button-start-simulation"
                style={{ background: "#C9A84C", color: "#0A0F2E" }}
              >
                <Play className="w-5 h-5 mr-2" />
                Begin Simulation
              </Button>
            </CardFooter>
          </Card>
        </div>
      </PageLayout>
    );
  }

  if (phase === 'complete') {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center p-6">
          <Card className="max-w-3xl w-full border-[#E8E4DC] dark:border-[#C9A84C]/10 bg-white dark:bg-white/5" data-testid="card-simulation-complete">
            <CardHeader className="text-center pb-2">
              <div className="w-20 h-20 mx-auto mb-6 bg-[#2B8A6E] rounded-2xl flex items-center justify-center">
                <Award className="w-10 h-10 text-white" />
              </div>
              <Badge className="mx-auto mb-4 bg-[#2B8A6E]/10 text-[#2B8A6E] border-none">
                COMPLETE
              </Badge>
              <CardTitle className="text-3xl font-bold text-[#0A0F2E] dark:text-white mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Response Successfully Coordinated
              </CardTitle>
              <CardDescription className="text-lg text-[#6B7280] dark:text-[#C9A84C]/60">
                You just experienced the power of Execution OS
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-[#F8F7F4] dark:bg-white/5 rounded-xl p-6 text-center border border-[#E8E4DC] dark:border-[#C9A84C]/10">
                  <Clock className="w-8 h-8 text-[#0A0F2E] dark:text-[#C9A84C] mx-auto mb-2" />
                  <p className="text-3xl font-bold text-[#C9A84C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{formatTime(elapsedTime)}</p>
                  <p className="text-[#6B7280] dark:text-[#C9A84C]/60 text-sm">Total Response Time</p>
                </div>
                <div className="bg-[#F8F7F4] dark:bg-white/5 rounded-xl p-6 text-center border border-[#E8E4DC] dark:border-[#C9A84C]/10">
                  <Users className="w-8 h-8 text-[#0A0F2E] dark:text-[#C9A84C] mx-auto mb-2" />
                  <p className="text-3xl font-bold text-[#C9A84C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>6</p>
                  <p className="text-[#6B7280] dark:text-[#C9A84C]/60 text-sm">Stakeholders Aligned</p>
                </div>
                <div className="bg-[#F8F7F4] dark:bg-white/5 rounded-xl p-6 text-center border border-[#E8E4DC] dark:border-[#C9A84C]/10">
                  <CheckCircle2 className="w-8 h-8 text-[#2B8A6E] mx-auto mb-2" />
                  <p className="text-3xl font-bold text-[#C9A84C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{playbookActions.length}</p>
                  <p className="text-[#6B7280] dark:text-[#C9A84C]/60 text-sm">Actions Completed</p>
                </div>
              </div>

              <div className="bg-[#0A0F2E] rounded-xl p-6 border border-[#C9A84C]/10">
                <h3 className="text-lg font-semibold text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Traditional vs Execution OS Response</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/80">Traditional Approach</span>
                      <span className="text-[#C9A84C]">48-72 hours</span>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-[#141B45] rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/80">With Execution OS</span>
                      <span className="text-[#2B8A6E]">{formatTime(elapsedTime)}</span>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-[#2B8A6E] rounded-full" style={{ width: '3%' }}></div>
                    </div>
                  </div>
                </div>
                <p className="text-[#C9A84C] text-center mt-4 font-semibold">
                  You responded {Math.round((72 * 60) / (elapsedTime / 60000))}x faster than traditional methods
                </p>
              </div>

              <div className="bg-[#F8F7F4] dark:bg-white/5 rounded-xl p-6 border border-[#E8E4DC] dark:border-[#C9A84C]/10">
                <h3 className="text-lg font-semibold text-[#0A0F2E] dark:text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>What Happened</h3>
                <ul className="space-y-3 text-[#0A0F2E] dark:text-white/80 text-sm">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#C9A84C]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#C9A84C] text-xs font-bold">1</span>
                    </div>
                    <span>Execution OS detected competitor acquisition via Reuters and SEC filing monitoring</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#C9A84C]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#C9A84C] text-xs font-bold">2</span>
                    </div>
                    <span>AI assessed impact and recommended "Competitor M&A Response" playbook</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#C9A84C]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#C9A84C] text-xs font-bold">3</span>
                    </div>
                    <span>You activated the playbook, triggering automatic stakeholder notification</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#C9A84C]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#C9A84C] text-xs font-bold">4</span>
                    </div>
                    <span>All 6 response workstreams were coordinated in parallel, not sequentially</span>
                  </li>
                </ul>
              </div>
            </CardContent>

            <CardFooter className="flex justify-center gap-4 pt-4">
              <Button 
                variant="outline"
                onClick={resetSimulation}
                className="border-[#E8E4DC] dark:border-white/10 text-[#0A0F2E] dark:text-white hover:bg-[#F8F7F4] dark:hover:bg-white/5"
                data-testid="button-restart-simulation"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button 
                onClick={() => setLocation('/foresight-radar')}
                className="bg-[#C9A84C] hover:bg-[#DFC178] text-[#0A0F2E] font-bold"
                data-testid="button-explore-platform"
              >
                Explore Full Platform
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-white dark:bg-[#0A0F2E]">
        {/* Critical Alert Overlay */}
        {showCriticalAlert && criticalSignal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" data-testid="overlay-critical-alert">
            <Card className="max-w-2xl w-full border-2 border-[#0A0F2E] bg-white animate-pulse">
              <CardHeader className="bg-[#141B45] border-b border-[#0A0F2E]/30">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#0A0F2E] rounded-xl flex items-center justify-center animate-pulse">
                    <AlertTriangle className="w-7 h-7 text-[#C9A84C]" />
                  </div>
                  <div>
                    <Badge className="bg-[#C9A84C] text-[#0A0F2E] mb-1">CRITICAL SIGNAL DETECTED</Badge>
                    <CardTitle className="text-xl text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{criticalSignal.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <p className="text-[#0A0F2E] leading-relaxed font-medium">{criticalSignal.description}</p>
                <div className="flex items-center gap-4 text-sm text-[#6B7280]">
                  <span className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    {criticalSignal.source}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Just now
                  </span>
                </div>
                <div className="bg-[#2B8A6E]/10 rounded-lg p-4 border border-[#2B8A6E]/20">
                  <p className="text-[#2B8A6E] font-medium flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#C9A84C]" />
                    Execution OS Recommendation: Activate "Competitor M&A Response" playbook immediately
                  </p>
                </div>
              </CardContent>
              <CardFooter className="border-t border-[#E8E4DC] dark:border-white/10 bg-[#F8F7F4] dark:bg-white/5">
                <Button 
                  className="w-full bg-[#0A0F2E] hover:bg-[#141B45] text-white"
                  onClick={handleAcknowledgeAlert}
                  data-testid="button-acknowledge-alert"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Acknowledge & Respond
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {/* Top Bar */}
        <div className="border-b border-[#E8E4DC] dark:border-white/10 bg-white dark:bg-[#0A0F2E] sticky top-0 z-40">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Avatar className="w-10 h-10 border-2 border-[#2B8A6E]">
                    <AvatarFallback className="bg-[#2B8A6E] text-white font-bold">SC</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-[#0A0F2E] dark:text-white text-sm">{COMPANY_PROFILE.persona}</p>
                    <p className="text-xs text-[#6B7280] dark:text-[#C9A84C]/60">{COMPANY_PROFILE.role} • {COMPANY_PROFILE.name}</p>
                  </div>
                </div>
                <Separator orientation="vertical" className="h-8 bg-[#E8E4DC] dark:bg-white/10" />
                <Badge variant="outline" className="text-[#0A0F2E] dark:text-white border-[#E8E4DC] dark:border-white/10">
                  <CircleDot className="w-3 h-3 mr-1 text-[#2B8A6E]" />
                  Simulation Active
                </Badge>
              </div>

              <div className="flex items-center gap-4">
                {/* Timer */}
                <div className="flex items-center gap-2 bg-[#F8F7F4] dark:bg-[#141B45] px-4 py-2 rounded-lg border border-[#E8E4DC] dark:border-white/10">
                  <Timer className="w-4 h-4 text-[#0A0F2E] dark:text-[#C9A84C]" />
                  <span className="font-mono font-bold text-[#0A0F2E] dark:text-white" data-testid="text-elapsed-time">
                    {formatTime(elapsedTime)}
                  </span>
                </div>

                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative text-[#0A0F2E] dark:text-[#C9A84C]" data-testid="button-notifications">
                  <Bell className="w-5 h-5" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </Button>

                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={resetSimulation}
                  className="text-[#0A0F2E] dark:text-white border-[#0A0F2E]/20 dark:border-white/20 hover:bg-[#0A0F2E]/5 dark:hover:bg-white/5"
                  data-testid="button-reset-simulation"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Phase Indicator */}
        <div className="bg-[#0A0F2E] text-white py-2">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  <span>Current Phase: <strong>{phase.replace('_', ' ').toUpperCase()}</strong></span>
                </div>
                <div className="flex items-center gap-4">
                  {phase === 'execution' && (
                    <span className="flex items-center gap-2">
                      <Progress value={progressPercent} className="w-32 h-2" />
                      <span>{completedActions}/{playbookActions.length} tasks</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto bg-[#0A0F2E]/5 border border-[#E8E4DC] dark:bg-white/5 dark:border-white/10" data-testid="tabs-main-navigation">
              <TabsTrigger value="radar" className="flex items-center gap-2 data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-white dark:data-[state=active]:bg-[#C9A84C] dark:data-[state=active]:text-[#0A0F2E]" data-testid="tab-radar">
                <Radio className="w-4 h-4" />
                Radar
              </TabsTrigger>
              <TabsTrigger value="signals" className="flex items-center gap-2 data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-white dark:data-[state=active]:bg-[#C9A84C] dark:data-[state=active]:text-[#0A0F2E]" data-testid="tab-signals">
                <AlertTriangle className="w-4 h-4" />
                Signals
                {signals.filter(s => s.actionRequired).length > 0 && (
                  <Badge className="ml-1 bg-red-600 text-white h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {signals.filter(s => s.actionRequired).length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="playbooks" className="flex items-center gap-2 data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-white dark:data-[state=active]:bg-[#C9A84C] dark:data-[state=active]:text-[#0A0F2E]" data-testid="tab-playbooks">
                <FileText className="w-4 h-4" />
                Playbooks
              </TabsTrigger>
              <TabsTrigger value="command" className="flex items-center gap-2 data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-white dark:data-[state=active]:bg-[#C9A84C] dark:data-[state=active]:text-[#0A0F2E]" data-testid="tab-command">
                <Radio className="w-4 h-4" />
                Command
              </TabsTrigger>
            </TabsList>

            {/* Radar Tab */}
            <TabsContent value="radar" className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Radar Display */}
                <div className="lg:col-span-2">
                  <Card className="border-[#E8E4DC] dark:border-white/10 bg-white dark:bg-white/5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        <Radio className="w-5 h-5 text-[#0A0F2E] dark:text-[#C9A84C]" />
                        Foresight Radar
                      </CardTitle>
                      <CardDescription className="text-[#6B7280] dark:text-white/60">Real-time intelligence monitoring across 12 signal sources</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-square max-w-md mx-auto relative bg-[#F8F7F4] dark:bg-[#141B45] rounded-full flex items-center justify-center">
                        <div className="absolute inset-4 border-2 border-dashed border-[#E8E4DC] dark:border-white/10 rounded-full"></div>
                        <div className="absolute inset-12 border-2 border-dashed border-[#E8E4DC] dark:border-white/10 rounded-full"></div>
                        <div className="absolute inset-20 border-2 border-dashed border-[#E8E4DC] dark:border-white/10 rounded-full"></div>
                        
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-4 h-4 bg-[#0A0F2E] dark:bg-[#C9A84C] rounded-full animate-ping"></div>
                        </div>
                        
                        {signals.map((signal, index) => {
                          const angle = (index * 72) * (Math.PI / 180);
                          const radius = signal.severity === 'critical' ? 60 : signal.severity === 'high' ? 100 : 140;
                          const x = Math.cos(angle) * radius;
                          const y = Math.sin(angle) * radius;
                          
                          return (
                            <div 
                              key={signal.id}
                              className={`absolute w-4 h-4 rounded-full ${
                                signal.severity === 'critical' ? 'bg-red-600 animate-pulse' :
                                signal.severity === 'high' ? 'bg-[#C9A84C]' :
                                signal.severity === 'medium' ? 'bg-[#C9A84C]/60' : 'bg-[#0A0F2E]'
                              }`}
                              style={{ 
                                transform: `translate(${x}px, ${y}px)`,
                                left: '50%',
                                top: '50%'
                              }}
                              title={signal.title}
                            ></div>
                          );
                        })}

                        <div className="text-center z-10">
                          <p className="text-2xl font-bold text-[#0A0F2E] dark:text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{signals.length}</p>
                          <p className="text-xs text-[#6B7280] dark:text-white/60">Active Signals</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Team Status */}
                <Card className="border-[#E8E4DC] dark:border-white/10 bg-white dark:bg-white/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      <Users className="w-5 h-5 text-[#C9A84C]" />
                      Executive Team
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-80">
                      <div className="space-y-3">
                        {TEAM_MEMBERS.map(member => (
                          <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#F8F7F4] dark:hover:bg-[#141B45] transition-colors">
                            <Avatar className="w-10 h-10 border border-[#E8E4DC] dark:border-white/10">
                              <AvatarFallback className={`text-sm font-bold ${
                                member.status === 'available' ? 'bg-[#2B8A6E]/10 text-[#2B8A6E]' :
                                member.status === 'busy' ? 'bg-[#C9A84C]/10 text-[#C9A84C]' :
                                'bg-[#6B7280]/10 text-[#6B7280]'
                              }`}>
                                {member.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-[#0A0F2E] dark:text-white truncate">{member.name}</p>
                              <p className="text-xs text-[#6B7280] dark:text-white/60 truncate">{member.role}</p>
                            </div>
                            <div className={`w-2 h-2 rounded-full ${
                              member.status === 'available' ? 'bg-[#2B8A6E]' :
                              member.status === 'busy' ? 'bg-[#C9A84C]' :
                              'bg-[#6B7280]'
                            }`}></div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Signals Tab */}
            <TabsContent value="signals" className="space-y-6">
              <div className="grid gap-4">
                {signals.map(signal => (
                  <Card 
                    key={signal.id} 
                    className={`border-l-4 bg-white dark:bg-white/5 ${
                      signal.severity === 'critical' ? 'border-l-red-600 bg-red-50/50 dark:bg-red-950/20' :
                      signal.severity === 'high' ? 'border-l-[#C9A84C]' :
                      signal.severity === 'medium' ? 'border-l-[#C9A84C]/60' : 'border-l-[#0A0F2E]'
                    }`}
                    data-testid={`card-signal-${signal.id}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            signal.severity === 'critical' ? 'bg-red-100/50 dark:bg-red-900/30' :
                            signal.severity === 'high' ? 'bg-[#C9A84C]/10 dark:bg-[#C9A84C]/10' :
                            'bg-[#F8F7F4] dark:bg-[#0A0F2E]/30'
                          }`}>
                            <signal.icon className={`w-5 h-5 ${
                              signal.severity === 'critical' ? 'text-red-600' :
                              signal.severity === 'high' ? 'text-[#C9A84C]' :
                              'text-[#0A0F2E] dark:text-[#C9A84C]'
                            }`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className={getSeverityColor(signal.severity)}>
                                {signal.severity.toUpperCase()}
                              </Badge>
                              <span className="text-xs text-[#6B7280] dark:text-white/60">{signal.source}</span>
                            </div>
                            <h3 className="font-semibold text-[#0A0F2E] dark:text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{signal.title}</h3>
                            <p className="text-sm text-[#6B7280] dark:text-white/60 mt-1">{signal.description}</p>
                          </div>
                        </div>
                        {signal.actionRequired && phase === 'playbook_selection' && (
                          <Button 
                            size="sm" 
                            className="bg-[#0A0F2E] hover:bg-[#0A0F2E]/90 dark:bg-[#C9A84C] dark:hover:bg-[#C9A84C]/90 text-white dark:text-[#0A0F2E]"
                            onClick={() => handleSelectPlaybook('competitor-ma-response')}
                            data-testid="button-respond-signal"
                          >
                            Respond
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Playbooks Tab */}
            <TabsContent value="playbooks" className="space-y-6">
              {phase === 'playbook_selection' ? (
                <div className="space-y-4">
                  <div className="bg-[#C9A84C]/10 dark:bg-[#C9A84C]/10 border border-[#C9A84C]/20 dark:border-[#C9A84C]/20 rounded-lg p-4">
                    <p className="text-[#0A0F2E] dark:text-[#C9A84C] flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      <strong>Execution OS Recommendation:</strong> Based on the detected signal, the following playbook is recommended
                    </p>
                  </div>
                  
                  <Card 
                    className="border-2 border-[#C9A84C] bg-[#0A0F2E] dark:bg-[#0A0F2E]/20 cursor-pointer hover:shadow-lg transition-all"
                    onClick={() => handleSelectPlaybook('competitor-ma-response')}
                    data-testid="card-recommended-playbook"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <Badge className="mb-2 bg-[#C9A84C] text-[#0A0F2E] border-none font-bold">RECOMMENDED</Badge>
                          <CardTitle className="text-xl text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Competitor M&A Response Protocol</CardTitle>
                          <CardDescription className="text-white/60">Comprehensive response framework for competitor acquisition events</CardDescription>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-white/60">Est. Coordination Time</p>
                          <p className="text-2xl font-bold text-[#C9A84C]">12 min</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-sm text-[#C9A84C] mb-2">Key Actions</h4>
                          <ul className="space-y-1 text-sm text-white/80">
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-[#2B8A6E]" />
                              Executive team mobilization
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-[#2B8A6E]" />
                              Supply chain impact assessment
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-[#2B8A6E]" />
                              Competitive positioning analysis
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-[#2B8A6E]" />
                              Customer retention activation
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-[#C9A84C] mb-2">Stakeholders</h4>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="text-white border-white/20">CFO</Badge>
                            <Badge variant="outline" className="text-white border-white/20">CMO</Badge>
                            <Badge variant="outline" className="text-white border-white/20">VP Ops</Badge>
                            <Badge variant="outline" className="text-white border-white/20">Legal</Badge>
                            <Badge variant="outline" className="text-white border-white/20">VP Sales</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-white/5 dark:bg-[#0A0F2E]/30">
                      <Button className="w-full bg-[#C9A84C] hover:bg-[#C9A84C]/90 text-[#0A0F2E] font-bold" data-testid="button-activate-playbook">
                        <Rocket className="w-4 h-4 mr-2" />
                        Activate This Playbook
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              ) : phase === 'team_coordination' ? (
                <div className="space-y-6">
                  <Card className="border-[#2B8A6E]/20 dark:border-[#2B8A6E]/20 bg-[#2B8A6E]/10 dark:bg-[#2B8A6E]/10">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-8 h-8 text-[#2B8A6E]" />
                        <div>
                          <CardTitle className="text-[#0A0F2E] dark:text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Playbook Activated: Competitor M&A Response</CardTitle>
                          <CardDescription className="text-[#6B7280] dark:text-white/60">Team notifications sent. Review actions below and launch execution.</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>

                  <Card className="border-[#E8E4DC] dark:border-white/10 bg-white dark:bg-white/5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        <Target className="w-5 h-5 text-[#C9A84C]" />
                        Coordinated Action Plan
                      </CardTitle>
                      <CardDescription className="text-[#6B7280] dark:text-white/60">{playbookActions.length} actions across {new Set(playbookActions.map(a => a.department)).size} departments</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {playbookActions.map((action, index) => (
                          <div 
                            key={action.id} 
                            className="flex items-center gap-4 p-3 bg-[#F8F7F4] dark:bg-[#141B45] rounded-lg border border-[#E8E4DC] dark:border-white/5"
                            data-testid={`action-${action.id}`}
                          >
                            <div className="w-8 h-8 bg-[#0A0F2E] dark:bg-[#C9A84C] rounded-full flex items-center justify-center text-sm font-bold text-white dark:text-[#0A0F2E]">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-[#0A0F2E] dark:text-white">{action.name}</p>
                              <p className="text-sm text-[#6B7280] dark:text-white/60">{action.assignee} • {action.department}</p>
                            </div>
                            <Badge variant="outline" className="text-[#6B7280] dark:text-white/60 border-[#E8E4DC] dark:border-white/20">{action.duration}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full bg-[#0A0F2E] hover:bg-[#0A0F2E]/90 dark:bg-[#C9A84C] dark:hover:bg-[#C9A84C]/90 text-white dark:text-[#0A0F2E] font-bold"
                        onClick={handleLaunchExecution}
                        data-testid="button-launch-execution"
                      >
                        <Rocket className="w-4 h-4 mr-2" />
                        Launch Coordinated Response
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-[#6B7280] dark:text-[#C9A84C]/60 mx-auto mb-4" />
                  <p className="text-[#6B7280] dark:text-[#C9A84C]/60">Playbooks will be recommended when a signal requires response</p>
                </div>
              )}
            </TabsContent>

            {/* Command Tab */}
            <TabsContent value="command" className="space-y-6">
              {(phase === 'execution' || phase === 'monitoring') ? (
                <div className="space-y-6">
                  <Card className="border-[#0A0F2E] dark:border-[#C9A84C]">
                    <CardHeader className="bg-[#0A0F2E] dark:bg-[#C9A84C] text-white dark:text-[#0A0F2E] rounded-t-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Radio className="w-6 h-6" />
                          <div>
                            <CardTitle className="text-white dark:text-[#0A0F2E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Command Center Active</CardTitle>
                            <CardDescription className="text-white/60 dark:text-[#0A0F2E]/60">Coordinating response in real-time</CardDescription>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white/60 dark:text-[#0A0F2E]/60 text-sm">Elapsed Time</p>
                          <p className="text-2xl font-mono font-bold">{formatTime(elapsedTime)}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 bg-white dark:bg-white/5">
                      <div className="mb-6">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-[#6B7280] dark:text-white/60">Overall Progress</span>
                          <span className="font-medium text-[#0A0F2E] dark:text-white">{completedActions}/{playbookActions.length} Actions Complete</span>
                        </div>
                        <Progress value={progressPercent} className="h-3 bg-[#E8E4DC] dark:bg-white/5 [&>div]:bg-[#C9A84C]" />
                      </div>

                      <div className="space-y-3">
                        {playbookActions.map((action) => (
                          <div 
                            key={action.id} 
                            className={`flex items-center gap-4 p-4 rounded-lg border ${
                              action.status === 'completed' ? 'bg-[#2B8A6E]/5 dark:bg-[#2B8A6E]/10 border-[#2B8A6E]/20' :
                              action.status === 'in_progress' ? 'bg-[#0A0F2E]/5 dark:bg-[#C9A84C]/5 border-[#0A0F2E]/20 dark:border-[#C9A84C]/20' :
                              'bg-[#F8F7F4] dark:bg-[#141B45] border-[#E8E4DC] dark:border-white/5'
                            }`}
                            data-testid={`execution-action-${action.id}`}
                          >
                            <div className={getStatusColor(action.status)}>
                              {getStatusIcon(action.status)}
                            </div>
                            <div className="flex-1">
                              <p className={`font-medium ${
                                action.status === 'completed' ? 'text-[#2B8A6E]' :
                                action.status === 'in_progress' ? 'text-[#0A0F2E] dark:text-[#C9A84C]' :
                                'text-[#0A0F2E] dark:text-white'
                              }`}>
                                {action.name}
                              </p>
                              <p className="text-sm text-[#6B7280] dark:text-white/60">{action.assignee} • {action.department}</p>
                            </div>
                            <Badge variant="outline" className={
                              action.status === 'completed' ? 'border-[#2B8A6E] text-[#2B8A6E]' :
                              action.status === 'in_progress' ? 'border-[#0A0F2E] text-[#0A0F2E] dark:border-[#C9A84C] dark:text-[#C9A84C]' :
                              'text-[#6B7280] dark:text-white/60 border-[#E8E4DC] dark:border-white/20'
                            }>
                              {action.status === 'completed' ? 'Done' : 
                               action.status === 'in_progress' ? 'Running' : 
                               action.duration}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Radio className="w-12 h-12 text-[#6B7280] dark:text-white/60 mx-auto mb-4" />
                  <p className="text-[#6B7280] dark:text-white/60">Command Center activates when a playbook is launched</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageLayout>
  );
}
