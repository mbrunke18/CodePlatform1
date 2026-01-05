import { useState, useEffect, useCallback, useMemo } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { useDynamicStrategy } from '@/contexts/DynamicStrategyContext';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import OnboardingTrigger from '@/components/onboarding/OnboardingTrigger';
import ReactConfetti from 'react-confetti';
import { 
  Activity, 
  Zap, 
  Users, 
  Target, 
  TrendingUp, 
  AlertTriangle,
  PlayCircle,
  Pause,
  Radio,
  DollarSign,
  Clock,
  CheckCircle2,
  ArrowRight,
  Bell,
  Shield,
  Radar,
  Rocket,
  Timer,
  Sparkles,
  FastForward,
  Trophy,
  FileCheck,
  Send,
  Wallet,
  Calendar
} from 'lucide-react';

interface CoordinationEvent {
  id: string;
  time: string;
  team: string;
  action: string;
  status: 'completed' | 'in-progress' | 'pending';
}

interface SignalAlert {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  source: string;
  time: string;
}

const EXECUTION_PHASES = [
  { id: 'immediate', name: 'Immediate Response', duration: 180, icon: '⚡' },
  { id: 'coordinate', name: 'Team Coordination', duration: 240, icon: '👥' },
  { id: 'resolve', name: 'Issue Resolution', duration: 240, icon: '🎯' },
  { id: 'close', name: 'Closure & Learning', duration: 60, icon: '✅' },
];

interface DemoTask {
  id: string;
  time: number;
  team: string;
  action: string;
  type: 'task' | 'document' | 'communication' | 'budget' | 'integration';
  value: number;
}

const DEMO_TASKS: DemoTask[] = [
  { id: 't1', time: 15, team: 'Executive', action: 'Crisis team activated', type: 'task', value: 5000 },
  { id: 't2', time: 30, team: 'Legal', action: 'NDA template staged', type: 'document', value: 2500 },
  { id: 't3', time: 45, team: 'Communications', action: 'Press statement drafted', type: 'communication', value: 8000 },
  { id: 't4', time: 60, team: 'Finance', action: '$500K emergency budget unlocked', type: 'budget', value: 12000 },
  { id: 't5', time: 90, team: 'IT Security', action: 'System isolation protocol started', type: 'task', value: 3500 },
  { id: 't6', time: 120, team: 'Operations', action: 'Backup suppliers notified', type: 'communication', value: 4200 },
  { id: 't7', time: 150, team: 'HR', action: 'Employee communication ready', type: 'document', value: 2800 },
  { id: 't8', time: 180, team: 'Jira', action: 'Project synced - 24 tasks created', type: 'integration', value: 6500 },
  { id: 't9', time: 210, team: 'Legal', action: 'Contract review initiated', type: 'task', value: 5500 },
  { id: 't10', time: 240, team: 'Board', action: 'Emergency meeting scheduled', type: 'task', value: 15000 },
  { id: 't11', time: 280, team: 'ServiceNow', action: 'Incident ticket auto-created', type: 'integration', value: 3200 },
  { id: 't12', time: 320, team: 'Investors', action: 'IR statement approved', type: 'communication', value: 25000 },
  { id: 't13', time: 360, team: 'Risk', action: 'Impact assessment complete', type: 'document', value: 8500 },
  { id: 't14', time: 400, team: 'Operations', action: 'Contingency plan activated', type: 'task', value: 11000 },
  { id: 't15', time: 450, team: 'Slack', action: 'War room channel created', type: 'integration', value: 1500 },
  { id: 't16', time: 500, team: 'Procurement', action: 'Emergency vendor contracts staged', type: 'document', value: 7200 },
  { id: 't17', time: 540, team: 'Strategy', action: 'Competitive response brief ready', type: 'document', value: 9000 },
  { id: 't18', time: 600, team: 'CEO', action: 'Executive briefing delivered', type: 'communication', value: 15000 },
  { id: 't19', time: 660, team: 'Finance', action: 'Financial impact model completed', type: 'document', value: 20000 },
  { id: 't20', time: 700, team: 'All Teams', action: 'Execution complete - Learning captured', type: 'task', value: 8600 },
];

const DEMO_SPEEDS = [
  { label: '1x', value: 1, icon: '▶' },
  { label: '2x', value: 2, icon: '⏩' },
  { label: '5x', value: 5, icon: '⏭' },
  { label: '10x', value: 10, icon: '🚀' },
];

export default function CommandCenter() {
  const { 
    readiness, 
    activeScenarios, 
    weakSignals, 
    oraclePatterns,
    continuousMode,
    teamsCoordinating,
    percentOnTrack,
    isLoading
  } = useDynamicStrategy();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [demoSpeed, setDemoSpeed] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);
  const [lastTickTime, setLastTickTime] = useState<number>(0);
  const [demoExecution, setDemoExecution] = useState<{
    active: boolean;
    startTime: number;
    elapsedSeconds: number;
    phase: number;
    scenario: string;
    completedTasks: string[];
    accumulatedValue: number;
  } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (demoExecution?.active) {
      const interval = setInterval(() => {
        const now = Date.now();
        const deltaRealMs = now - lastTickTime;
        const deltaScaledSeconds = (deltaRealMs / 1000) * demoSpeed;
        setLastTickTime(now);
        
        setDemoExecution(prev => {
          if (!prev) return null;
          const newElapsed = Math.min(720, prev.elapsedSeconds + deltaScaledSeconds);
          
          let currentPhase = 0;
          let accumulated = 0;
          for (let i = 0; i < EXECUTION_PHASES.length; i++) {
            accumulated += EXECUTION_PHASES[i].duration;
            if (newElapsed < accumulated) {
              currentPhase = i;
              break;
            }
            if (i === EXECUTION_PHASES.length - 1) currentPhase = i;
          }
          
          const newCompletedTasks = DEMO_TASKS
            .filter(t => t.time <= newElapsed)
            .map(t => t.id);
          
          const newValue = DEMO_TASKS
            .filter(t => t.time <= newElapsed)
            .reduce((sum, t) => sum + t.value, 0);
          
          if (newElapsed >= 720) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 8000);
            return { ...prev, active: false, elapsedSeconds: 720, phase: 4, completedTasks: newCompletedTasks, accumulatedValue: newValue };
          }
          
          return { ...prev, elapsedSeconds: newElapsed, phase: currentPhase, completedTasks: newCompletedTasks, accumulatedValue: newValue };
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [demoExecution?.active, demoSpeed, lastTickTime]);

  const launchDemoExecution = useCallback(() => {
    setShowConfetti(false);
    setLastTickTime(Date.now());
    setDemoExecution({
      active: true,
      startTime: Date.now(),
      elapsedSeconds: 0,
      phase: 0,
      scenario: 'Competitor Acquisition Response',
      completedTasks: [],
      accumulatedValue: 0,
    });
  }, []);

  const recentTasks = useMemo(() => {
    if (!demoExecution) return [];
    return DEMO_TASKS
      .filter(t => demoExecution.completedTasks.includes(t.id))
      .slice(-5)
      .reverse();
  }, [demoExecution?.completedTasks]);

  const getTaskIcon = (type: DemoTask['type']) => {
    switch (type) {
      case 'task': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'document': return <FileCheck className="w-4 h-4 text-blue-500" />;
      case 'communication': return <Send className="w-4 h-4 text-violet-500" />;
      case 'budget': return <Wallet className="w-4 h-4 text-amber-500" />;
      case 'integration': return <Zap className="w-4 h-4 text-cyan-500" />;
    }
  };

  const formatTime = (seconds: number, countdown: boolean = false) => {
    const displaySeconds = countdown ? Math.max(0, 720 - seconds) : seconds;
    const mins = Math.floor(displaySeconds / 60);
    const secs = displaySeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const coordinationTimeline: CoordinationEvent[] = [
    { id: '1', time: '2 min ago', team: 'Legal', action: 'Approved crisis communication draft', status: 'completed' },
    { id: '2', time: '5 min ago', team: 'Communications', action: 'Drafting stakeholder message', status: 'in-progress' },
    { id: '3', time: '8 min ago', team: 'Operations', action: 'Activated supply chain backup', status: 'completed' },
    { id: '4', time: '10 min ago', team: 'Executive', action: 'CEO briefing scheduled', status: 'pending' },
    { id: '5', time: '12 min ago', team: 'IT Security', action: 'System isolation complete', status: 'completed' },
  ];

  const signalAlerts: SignalAlert[] = [
    { id: '1', severity: 'critical', title: 'Competitor acquisition announced', source: 'Market Intel', time: '1 min ago' },
    { id: '2', severity: 'high', title: 'Supply chain disruption - Region APAC', source: 'Operations Monitor', time: '15 min ago' },
    { id: '3', severity: 'medium', title: 'Social sentiment shift detected', source: 'Echo Analytics', time: '32 min ago' },
    { id: '4', severity: 'low', title: 'Regulatory update - GDPR amendment', source: 'Compliance Watch', time: '1 hr ago' },
  ];

  const severityColors = {
    critical: 'bg-red-500 text-white',
    high: 'bg-orange-500 text-white',
    medium: 'bg-amber-500 text-white',
    low: 'bg-blue-500 text-white'
  };

  // Fetch ROI metrics
  const { data: roiReport } = useQuery<any>({
    queryKey: ['/api/roi/report'],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PageLayout>
      {/* Confetti Celebration */}
      {showConfetti && (
        <ReactConfetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={500}
          gravity={0.2}
          colors={['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EC4899']}
        />
      )}

      {/* Header with Key Metrics */}
      <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
                  Command Center
                </h1>
                <OnboardingTrigger pageId="command-center" autoStart={true} />
              </div>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 flex flex-wrap items-center gap-2">
                <span className="hidden sm:inline">Real-time strategic execution coordination and control</span>
                <span className="sm:hidden">Live execution control</span>
                <Badge variant="outline" className="text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {currentTime.toLocaleTimeString()}
                </Badge>
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 sm:flex sm:items-center sm:gap-6">
              <div className="text-center">
                <div className="text-xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {activeScenarios.length}
                </div>
                <div className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                  Active
                </div>
              </div>
              <div className="hidden sm:block h-12 w-px bg-slate-300 dark:bg-slate-700"></div>
              <div className="text-center">
                <div className="text-xl sm:text-3xl font-bold text-violet-600 dark:text-violet-400">
                  {teamsCoordinating}
                </div>
                <div className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                  Teams
                </div>
              </div>
              <div className="hidden sm:block h-12 w-px bg-slate-300 dark:bg-slate-700"></div>
              <div className="text-center">
                <div className="text-xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {percentOnTrack}%
                </div>
                <div className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                  On Track
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Execution Velocity Display - Hero Section */}
      {demoExecution && (
        <div className="bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 dark:from-blue-800 dark:via-violet-800 dark:to-purple-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="relative shrink-0">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-white/10 flex items-center justify-center border-2 sm:border-4 border-white/30">
                    <div className="text-center">
                      <div className="text-xl sm:text-3xl font-bold text-white" data-testid="text-countdown-time">
                        {formatTime(demoExecution.elapsedSeconds, true)}
                      </div>
                      <div className="text-[10px] sm:text-xs text-white/70">remaining</div>
                    </div>
                  </div>
                  {demoExecution.active && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full animate-pulse border-2 border-white"></div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <Rocket className="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0" />
                    <h2 className="text-base sm:text-xl font-bold text-white truncate">
                      {demoExecution.scenario}
                    </h2>
                    {demoExecution.active ? (
                      <Badge className="bg-green-500 text-white animate-pulse text-xs">LIVE</Badge>
                    ) : (
                      <Badge className="bg-emerald-500 text-white text-xs">COMPLETED</Badge>
                    )}
                  </div>
                  <p className="text-white/80 text-xs sm:text-sm truncate">
                    {demoExecution.active 
                      ? `Executing: ${EXECUTION_PHASES[demoExecution.phase]?.name}`
                      : 'Complete - All phases finished'}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 lg:gap-6">
                <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center sm:gap-4 flex-1 sm:flex-initial">
                  <div className="text-center px-2 sm:px-3 py-1.5 sm:py-2 bg-white/10 rounded-lg">
                    <div className="text-base sm:text-xl font-bold text-white">{demoExecution.completedTasks.length}</div>
                    <div className="text-[10px] sm:text-xs text-white/70">Tasks</div>
                  </div>
                  <div className="text-center px-2 sm:px-3 py-1.5 sm:py-2 bg-white/10 rounded-lg">
                    <div className="text-base sm:text-xl font-bold text-emerald-300" data-testid="text-roi-value">
                      ${(demoExecution.accumulatedValue / 1000).toFixed(0)}K
                    </div>
                    <div className="text-[10px] sm:text-xs text-white/70">Value</div>
                  </div>
                  <div className="text-center px-2 sm:px-3 py-1.5 sm:py-2 bg-white/10 rounded-lg">
                    <div className="text-base sm:text-xl font-bold text-white">8</div>
                    <div className="text-[10px] sm:text-xs text-white/70">Teams</div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {DEMO_SPEEDS.map((speed) => (
                    <Button
                      key={speed.value}
                      size="sm"
                      variant={demoSpeed === speed.value ? "secondary" : "ghost"}
                      className={`h-7 sm:h-8 px-2 sm:px-3 text-xs ${demoSpeed === speed.value ? "bg-white text-violet-600" : "text-white hover:bg-white/20"}`}
                      onClick={() => setDemoSpeed(speed.value)}
                      data-testid={`button-speed-${speed.value}x`}
                    >
                      {speed.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Phase Progress Bar */}
            <div className="mt-4 sm:mt-6 grid grid-cols-2 sm:flex gap-2">
              {EXECUTION_PHASES.map((phase, idx) => {
                const phaseStart = EXECUTION_PHASES.slice(0, idx).reduce((a, p) => a + p.duration, 0);
                const phaseProgress = demoExecution.elapsedSeconds >= phaseStart + phase.duration 
                  ? 100 
                  : demoExecution.elapsedSeconds <= phaseStart 
                    ? 0 
                    : ((demoExecution.elapsedSeconds - phaseStart) / phase.duration) * 100;
                const isActive = demoExecution.phase === idx && demoExecution.active;
                const isComplete = demoExecution.elapsedSeconds >= phaseStart + phase.duration;
                
                return (
                  <div key={phase.id} className="flex-1" data-testid={`phase-progress-${phase.id}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] sm:text-xs font-medium ${isActive ? 'text-white' : 'text-white/60'}`}>
                        {phase.icon} <span className="hidden sm:inline">{phase.name}</span>
                        <span className="sm:hidden">{phase.name.split(' ')[0]}</span>
                      </span>
                      {isComplete && <CheckCircle2 className="w-3 h-3 text-emerald-300" />}
                    </div>
                    <div className="h-1.5 sm:h-2 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          isComplete ? 'bg-emerald-400' : isActive ? 'bg-white animate-pulse' : 'bg-white/40'
                        }`}
                        style={{ width: `${phaseProgress}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live Activity Feed */}
            {demoExecution.completedTasks.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-white/70" />
                    <span className="text-xs font-medium text-white/70 uppercase tracking-wide">Live Activity</span>
                  </div>
                  <span className="text-xs text-white/60">{demoExecution.completedTasks.length} of 20 tasks</span>
                </div>
                <div className="max-h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20">
                  <div className="flex flex-wrap gap-2">
                    {DEMO_TASKS
                      .filter(t => demoExecution.completedTasks.includes(t.id))
                      .reverse()
                      .map((task, idx) => (
                      <div 
                        key={task.id}
                        className={`flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full text-xs text-white whitespace-nowrap ${
                          idx === 0 ? 'animate-pulse ring-2 ring-white/30' : ''
                        }`}
                        data-testid={`live-task-${task.id}`}
                      >
                        {getTaskIcon(task.type)}
                        <span className="font-medium">{task.team}:</span>
                        <span className="opacity-90 max-w-[150px] truncate">{task.action}</span>
                        <span className="opacity-60">+${(task.value/1000).toFixed(0)}K</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Completion Celebration Modal */}
      {demoExecution && !demoExecution.active && demoExecution.elapsedSeconds >= 720 && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-800 dark:to-teal-800">
          <div className="max-w-7xl mx-auto px-8 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    Execution Complete!
                  </h2>
                  <p className="text-white/80">
                    {demoExecution.scenario} - Full coordinated response in under 12 minutes
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-center px-4 py-2 bg-white/10 rounded-lg">
                  <div className="text-3xl font-bold text-white">{demoExecution.completedTasks.length}</div>
                  <div className="text-xs text-white/70">Tasks Completed</div>
                </div>
                <div className="text-center px-4 py-2 bg-white/10 rounded-lg">
                  <div className="text-3xl font-bold text-emerald-200">${(demoExecution.accumulatedValue / 1000).toFixed(0)}K</div>
                  <div className="text-xs text-white/70">Value Delivered</div>
                </div>
                <div className="text-center px-4 py-2 bg-white/10 rounded-lg">
                  <div className="text-3xl font-bold text-white">8</div>
                  <div className="text-xs text-white/70">Teams Coordinated</div>
                </div>
                <Button
                  size="lg"
                  onClick={launchDemoExecution}
                  className="bg-white text-emerald-600 hover:bg-white/90"
                  data-testid="button-restart-demo"
                >
                  <Rocket className="w-4 h-4 mr-2" />
                  Run Again
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        {/* Active Scenarios - or Demo Launch */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Active Scenarios</h2>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={launchDemoExecution}
                disabled={demoExecution?.active}
                data-testid="button-demo-execution"
              >
                <Timer className="w-4 h-4 mr-2" />
                Demo 12-Min Execution
              </Button>
              <Button data-testid="button-launch-scenario">
                <PlayCircle className="w-4 h-4 mr-2" />
                Launch New Scenario
              </Button>
            </div>
          </div>
          {activeScenarios.length === 0 && !demoExecution ? (
            <Card className="border-2 border-dashed border-slate-300 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950" data-testid="card-no-scenarios">
              <CardContent className="py-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
                  <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  Ready for Strategic Execution
                </h3>
                <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6">
                  M monitors 12 intelligence signals continuously. When a trigger fires, 
                  your coordinated response activates in under 12 minutes.
                </p>
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="text-center px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">166</div>
                    <div className="text-xs text-slate-500">Playbooks Ready</div>
                  </div>
                  <div className="text-center px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">12</div>
                    <div className="text-xs text-slate-500">Signal Sources</div>
                  </div>
                  <div className="text-center px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">&lt;12m</div>
                    <div className="text-xs text-slate-500">Activation Time</div>
                  </div>
                </div>
                <Button 
                  size="lg" 
                  onClick={launchDemoExecution}
                  className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700"
                  data-testid="button-launch-demo"
                >
                  <Rocket className="w-4 h-4 mr-2" />
                  Watch 12-Minute Execution Demo
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeScenarios.map((scenario) => (
                <Card key={scenario.id} className="border-l-4 border-l-blue-500" data-testid={`card-scenario-${scenario.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{scenario.name}</CardTitle>
                        <CardDescription>
                          {scenario.teamsInvolved} teams coordinating
                        </CardDescription>
                      </div>
                      <Badge variant={scenario.status === 'active' ? 'default' : 'secondary'}>
                        {scenario.status === 'active' && <Radio className="w-3 h-3 mr-1 animate-pulse" />}
                        {scenario.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Progress</span>
                        <span className="font-semibold">{scenario.progress}%</span>
                      </div>
                      <Progress value={scenario.progress} />
                      <Button variant="outline" size="sm" className="w-full mt-2" data-testid={`button-view-${scenario.id}`}>
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* ROI & Value Demonstration */}
        {roiReport && (
          <Card className="border-2 border-emerald-500 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                Enterprise Value Realized
              </CardTitle>
              <CardDescription>
                Cumulative impact from strategic executions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-emerald-200 dark:border-emerald-900">
                  <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Total Value</div>
                  <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    ${(roiReport.cumulativeValue / 1000000).toFixed(1)}M
                  </div>
                </div>
                <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-emerald-200 dark:border-emerald-900">
                  <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Executions</div>
                  <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {roiReport.totalExecutions}
                  </div>
                </div>
                <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-emerald-200 dark:border-emerald-900">
                  <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Avg Velocity</div>
                  <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {roiReport.avgTimeToActivate}m
                  </div>
                </div>
                <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-emerald-200 dark:border-emerald-900">
                  <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Efficiency</div>
                  <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {roiReport.efficiency}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Real-time Coordination & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Coordination Timeline */}
          <Card data-testid="card-coordination-timeline">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-violet-600" />
                Coordination Timeline
              </CardTitle>
              <CardDescription>
                Live team coordination across active scenarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {coordinationTimeline.map((event) => (
                  <div 
                    key={event.id} 
                    className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
                    data-testid={`timeline-event-${event.id}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      event.status === 'completed' ? 'bg-emerald-100 dark:bg-emerald-900' :
                      event.status === 'in-progress' ? 'bg-blue-100 dark:bg-blue-900' :
                      'bg-slate-200 dark:bg-slate-700'
                    }`}>
                      {event.status === 'completed' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      ) : event.status === 'in-progress' ? (
                        <Radio className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-pulse" />
                      ) : (
                        <Clock className="w-4 h-4 text-slate-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm text-slate-900 dark:text-white">
                          {event.team}
                        </span>
                        <span className="text-xs text-slate-500">{event.time}</span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                        {event.action}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Signal Alerts */}
          <Card data-testid="card-signal-alerts">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-600" />
                Signal Alerts
              </CardTitle>
              <CardDescription>
                Real-time intelligence from 12 monitoring sources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {signalAlerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                    data-testid={`signal-alert-${alert.id}`}
                  >
                    <Badge className={`${severityColors[alert.severity]} text-xs px-2`}>
                      {alert.severity.toUpperCase()}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-slate-900 dark:text-white">
                        {alert.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-500">{alert.source}</span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500">{alert.time}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="flex-shrink-0">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Grid: Readiness + Weak Signals + Oracle */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Future Readiness */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Future Readiness Index™
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {readiness.overall.toFixed(1)}%
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Overall Readiness Score
                </p>
              </div>
              <div className="space-y-3">
                {Object.entries(readiness).filter(([key]) => key !== 'overall').map(([key, value]) => (
                  <div key={key}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="capitalize text-slate-700 dark:text-slate-300">{key}</span>
                      <span className="font-semibold">{value}%</span>
                    </div>
                    <Progress value={value} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weak Signals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                Weak Signals Detected
              </CardTitle>
              <CardDescription>
                {weakSignals.length} signals detected
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {weakSignals.slice(0, 5).map((signal) => (
                  <div 
                    key={signal.id} 
                    className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-900"
                    data-testid={`weak-signal-${signal.id}`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-semibold text-sm text-slate-900 dark:text-white">
                        {signal.title}
                      </h4>
                      <Badge variant="outline" className="text-xs">
                        {signal.confidence}%
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {signal.source} • {signal.category}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Oracle Patterns */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-violet-600" />
                Oracle Intelligence
              </CardTitle>
              <CardDescription>
                {oraclePatterns.length} patterns recognized
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {oraclePatterns.map((pattern) => (
                  <div 
                    key={pattern.id} 
                    className="p-3 bg-violet-50 dark:bg-violet-950/30 rounded-lg border border-violet-200 dark:border-violet-900"
                    data-testid={`oracle-pattern-${pattern.id}`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-semibold text-sm text-slate-900 dark:text-white">
                        {pattern.name}
                      </h4>
                      <Badge variant="outline" className="text-xs">
                        {pattern.accuracy}%
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {pattern.signals} signals • {pattern.trend}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Continuous Mode Status */}
        <Card className="border-2 border-blue-500 dark:border-blue-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  Continuous Operations Mode
                </CardTitle>
                <CardDescription>
                  Always-on strategic monitoring and coordination
                </CardDescription>
              </div>
              <Button 
                variant={continuousMode.enabled ? "destructive" : "default"}
                data-testid="button-toggle-continuous-mode"
              >
                {continuousMode.enabled ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <PlayCircle className="w-4 h-4 mr-2" />
                    Activate
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  {continuousMode.enabled ? 'ON' : 'OFF'}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Status</div>
              </div>
              <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="text-3xl font-bold text-violet-600 dark:text-violet-400 mb-1">
                  {continuousMode.tasksScheduled}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Tasks Scheduled</div>
              </div>
              <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                  {continuousMode.nextRun ? new Date(continuousMode.nextRun).toLocaleTimeString() : '--'}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Next Run</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
