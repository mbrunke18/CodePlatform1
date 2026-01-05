import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Zap,
  Shield,
  DollarSign,
  TrendingUp,
  ArrowRight,
  X,
  Bot,
  FileText,
  Bell,
  Lock,
  Globe,
  Mail,
  Phone,
  MessageSquare
} from 'lucide-react';
import Confetti from 'react-confetti';
import { useLocation } from 'wouter';
import StandardNav from '@/components/layout/StandardNav';
import Footer from '@/components/layout/Footer';

interface Task {
  id: string;
  time: number;
  title: string;
  stakeholder: string;
  type: 'task' | 'ai' | 'approval' | 'blocker' | 'resolved' | 'complete';
  completed: boolean;
}

interface Stakeholder {
  id: string;
  name: string;
  role: string;
  department: string;
  acknowledged: boolean;
  acknowledgedAt?: number;
  tasksAssigned: number;
  tasksCompleted: number;
}

const DEMO_SCENARIO = {
  name: 'Critical Data Breach Response',
  trigger: 'Unauthorized access detected in customer database',
  severity: 'Critical',
  impactedCustomers: '2.4M',
  potentialFine: '$50M',
  playbook: 'SEC-001: Data Breach Incident Response',
  targetTime: 720, // 12 minutes in seconds for display, but we'll accelerate
  demoSpeed: 15, // Demo runs in 15 seconds for demo purposes
};

const STAKEHOLDERS: Stakeholder[] = [
  { id: 'ceo', name: 'Sarah Chen', role: 'CEO', department: 'Executive', acknowledged: false, tasksAssigned: 3, tasksCompleted: 0 },
  { id: 'ciso', name: 'Marcus Williams', role: 'CISO', department: 'Security', acknowledged: false, tasksAssigned: 8, tasksCompleted: 0 },
  { id: 'cfo', name: 'Jennifer Park', role: 'CFO', department: 'Finance', acknowledged: false, tasksAssigned: 4, tasksCompleted: 0 },
  { id: 'gc', name: 'Robert Chen', role: 'General Counsel', department: 'Legal', acknowledged: false, tasksAssigned: 6, tasksCompleted: 0 },
  { id: 'cmo', name: 'Amanda Foster', role: 'CMO', department: 'Communications', acknowledged: false, tasksAssigned: 5, tasksCompleted: 0 },
  { id: 'chro', name: 'David Kim', role: 'CHRO', department: 'HR', acknowledged: false, tasksAssigned: 3, tasksCompleted: 0 },
  { id: 'coo', name: 'Lisa Thompson', role: 'COO', department: 'Operations', acknowledged: false, tasksAssigned: 4, tasksCompleted: 0 },
  { id: 'ir', name: 'Michael Santos', role: 'VP Investor Relations', department: 'Finance', acknowledged: false, tasksAssigned: 2, tasksCompleted: 0 },
];

const TASKS: Task[] = [
  { id: '1', time: 0, title: 'Breach detected - playbook activated', stakeholder: 'System', type: 'ai', completed: false },
  { id: '2', time: 1, title: 'Notifying 8 stakeholders simultaneously', stakeholder: 'M Platform', type: 'ai', completed: false },
  { id: '3', time: 2, title: 'CISO acknowledged - reviewing threat assessment', stakeholder: 'Marcus Williams', type: 'task', completed: false },
  { id: '4', time: 3, title: 'Legal team activated - compliance review initiated', stakeholder: 'Robert Chen', type: 'task', completed: false },
  { id: '5', time: 4, title: 'CEO briefing package auto-generated', stakeholder: 'M Platform', type: 'ai', completed: false },
  { id: '6', time: 5, title: 'Regulatory notification template populated', stakeholder: 'M Platform', type: 'ai', completed: false },
  { id: '7', time: 6, title: 'CFO approved emergency budget ($500K)', stakeholder: 'Jennifer Park', type: 'approval', completed: false },
  { id: '8', time: 7, title: 'BLOCKER: Missing breach scope data', stakeholder: 'Legal', type: 'blocker', completed: false },
  { id: '9', time: 8, title: 'AI auto-requested data from Security team', stakeholder: 'M Platform', type: 'ai', completed: false },
  { id: '10', time: 9, title: 'Security provided scope - Legal unblocked', stakeholder: 'Marcus Williams', type: 'resolved', completed: false },
  { id: '11', time: 10, title: 'Communications draft ready for CEO review', stakeholder: 'Amanda Foster', type: 'task', completed: false },
  { id: '12', time: 11, title: 'CEO approved public statement', stakeholder: 'Sarah Chen', type: 'approval', completed: false },
  { id: '13', time: 12, title: 'Customer notification initiated (2.4M emails)', stakeholder: 'M Platform', type: 'ai', completed: false },
  { id: '14', time: 13, title: 'Regulatory notification filed (72-hour deadline met)', stakeholder: 'Robert Chen', type: 'complete', completed: false },
  { id: '15', time: 14, title: 'All 47 tasks completed - breach contained', stakeholder: 'M Platform', type: 'complete', completed: false },
];

export default function OneClickDemo() {
  const [, setLocation] = useLocation();
  const [demoState, setDemoState] = useState<'idle' | 'running' | 'paused' | 'complete'>('idle');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [displayTime, setDisplayTime] = useState(0);
  const [tasks, setTasks] = useState<Task[]>(TASKS.map(t => ({ ...t, completed: false })));
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>(STAKEHOLDERS.map(s => ({ ...s, acknowledged: false, tasksCompleted: 0 })));
  const [showConfetti, setShowConfetti] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const progress = (elapsedTime / DEMO_SCENARIO.demoSpeed) * 100;
  const acknowledgedCount = stakeholders.filter(s => s.acknowledged).length;
  const completedTasks = tasks.filter(t => t.completed).length;

  const startDemo = useCallback(() => {
    setDemoState('running');
    setElapsedTime(0);
    setDisplayTime(0);
    setTasks(TASKS.map(t => ({ ...t, completed: false })));
    setStakeholders(STAKEHOLDERS.map(s => ({ ...s, acknowledged: false, tasksCompleted: 0 })));
    setIsFullscreen(true);
  }, []);

  const pauseDemo = useCallback(() => {
    setDemoState('paused');
  }, []);

  const resumeDemo = useCallback(() => {
    setDemoState('running');
  }, []);

  const resetDemo = useCallback(() => {
    setDemoState('idle');
    setElapsedTime(0);
    setDisplayTime(0);
    setTasks(TASKS.map(t => ({ ...t, completed: false })));
    setStakeholders(STAKEHOLDERS.map(s => ({ ...s, acknowledged: false, tasksCompleted: 0 })));
    setShowConfetti(false);
    setIsFullscreen(false);
  }, []);

  useEffect(() => {
    if (demoState !== 'running') return;

    const interval = setInterval(() => {
      setElapsedTime(prev => {
        const newTime = prev + 0.1;
        
        // Update display time (scaled to 12 minutes)
        const scaledTime = (newTime / DEMO_SCENARIO.demoSpeed) * 720;
        setDisplayTime(Math.floor(scaledTime));
        
        // Complete tasks based on elapsed time
        const taskIndex = Math.floor(newTime);
        if (taskIndex < TASKS.length) {
          setTasks(currentTasks => 
            currentTasks.map((t, i) => i <= taskIndex ? { ...t, completed: true } : t)
          );
        }
        
        // Acknowledge stakeholders progressively
        const ackProgress = newTime / DEMO_SCENARIO.demoSpeed;
        const stakeholdersToAck = Math.floor(ackProgress * STAKEHOLDERS.length);
        setStakeholders(current =>
          current.map((s, i) => i < stakeholdersToAck ? { ...s, acknowledged: true, acknowledgedAt: Math.floor(scaledTime) } : s)
        );
        
        // Complete demo
        if (newTime >= DEMO_SCENARIO.demoSpeed) {
          setDemoState('complete');
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 8000);
          return DEMO_SCENARIO.demoSpeed;
        }
        
        return newTime;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [demoState]);

  const formatDisplayTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTaskIcon = (type: Task['type']) => {
    switch (type) {
      case 'ai': return <Bot className="h-4 w-4 text-blue-400" />;
      case 'approval': return <CheckCircle2 className="h-4 w-4 text-green-400" />;
      case 'blocker': return <AlertCircle className="h-4 w-4 text-red-400" />;
      case 'resolved': return <Zap className="h-4 w-4 text-amber-400" />;
      case 'complete': return <Shield className="h-4 w-4 text-emerald-400" />;
      default: return <FileText className="h-4 w-4 text-slate-400" />;
    }
  };

  const getTaskBorderColor = (type: Task['type']) => {
    switch (type) {
      case 'ai': return 'border-l-blue-500';
      case 'approval': return 'border-l-green-500';
      case 'blocker': return 'border-l-red-500';
      case 'resolved': return 'border-l-amber-500';
      case 'complete': return 'border-l-emerald-500';
      default: return 'border-l-slate-500';
    }
  };

  // Idle state - show the start button
  if (demoState === 'idle' && !isFullscreen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
        <StandardNav />
        
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-red-500/20 text-red-400 border-red-500/30 text-sm px-4 py-1">
              <AlertCircle className="h-4 w-4 mr-2" />
              Live Interactive Demo
            </Badge>
            
            <h1 className="text-5xl font-bold text-white mb-6">
              See M in Action
            </h1>
            
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Watch a critical data breach get detected, coordinated across 8 executives, 
              and fully contained in 12 minutes instead of 17 days.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-red-400 mb-2">2.4M</div>
                  <div className="text-sm text-slate-400">Customers Impacted</div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-amber-400 mb-2">$50M</div>
                  <div className="text-sm text-slate-400">Potential Fine</div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-green-400 mb-2">12 min</div>
                  <div className="text-sm text-slate-400">Target Response Time</div>
                </CardContent>
              </Card>
            </div>

            <Button 
              size="lg" 
              onClick={startDemo}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-12 py-6 text-xl rounded-xl shadow-2xl shadow-blue-500/30 transition-all hover:scale-105"
              data-testid="button-start-demo"
            >
              <Play className="h-6 w-6 mr-3" />
              Start Live Demo
            </Button>
            
            <p className="text-sm text-slate-500 mt-4">
              15-second accelerated simulation of 12-minute response
            </p>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  // Running/Paused/Complete state - fullscreen demo view
  return (
    <div className="fixed inset-0 bg-slate-950 z-50 overflow-auto">
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}
      
      {/* Header */}
      <div className="bg-slate-900/90 border-b border-slate-800 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge className={`${demoState === 'complete' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30 animate-pulse'}`}>
                {demoState === 'complete' ? 'CONTAINED' : 'ACTIVE INCIDENT'}
              </Badge>
              <span className="text-white font-semibold">{DEMO_SCENARIO.name}</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-3xl font-mono font-bold text-white">{formatDisplayTime(displayTime)}</div>
                <div className="text-xs text-slate-400">Elapsed Time</div>
              </div>
              
              <div className="flex gap-2">
                {demoState === 'running' && (
                  <Button variant="outline" size="sm" onClick={pauseDemo} data-testid="button-pause-demo">
                    <Pause className="h-4 w-4" />
                  </Button>
                )}
                {demoState === 'paused' && (
                  <Button variant="outline" size="sm" onClick={resumeDemo} data-testid="button-resume-demo">
                    <Play className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={resetDemo} data-testid="button-reset-demo">
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={resetDemo} data-testid="button-close-demo">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-3">
            <Progress value={Math.min(progress, 100)} className="h-2" />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>0:00</span>
              <span>Target: 12:00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Left Column - Task Feed */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Zap className="h-5 w-5 text-amber-400" />
                    Live Execution Feed
                  </h3>
                  <Badge variant="outline" className="text-slate-400">
                    {completedTasks}/{tasks.length} Tasks
                  </Badge>
                </div>
                
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {tasks.map((task, index) => (
                    <div 
                      key={task.id}
                      className={`border-l-4 ${getTaskBorderColor(task.type)} pl-4 py-2 rounded-r transition-all duration-300 ${
                        task.completed 
                          ? 'bg-slate-800/50 opacity-100' 
                          : 'bg-slate-900/30 opacity-40'
                      }`}
                      data-testid={`task-${task.id}`}
                    >
                      <div className="flex items-start gap-3">
                        {getTaskIcon(task.type)}
                        <div className="flex-1">
                          <div className="text-sm text-white">{task.title}</div>
                          <div className="text-xs text-slate-500">{task.stakeholder}</div>
                        </div>
                        {task.completed && (
                          <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stakeholders & Stats */}
          <div className="space-y-4">
            {/* Stakeholder Status */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-400" />
                    Stakeholder Status
                  </h3>
                  <Badge variant="outline" className="text-green-400">
                    {acknowledgedCount}/{stakeholders.length} Acknowledged
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  {stakeholders.map((stakeholder) => (
                    <div 
                      key={stakeholder.id}
                      className={`flex items-center justify-between p-2 rounded transition-all duration-300 ${
                        stakeholder.acknowledged 
                          ? 'bg-green-500/10 border border-green-500/30' 
                          : 'bg-slate-800/30'
                      }`}
                      data-testid={`stakeholder-${stakeholder.id}`}
                    >
                      <div className="flex items-center gap-2">
                        {stakeholder.acknowledged ? (
                          <CheckCircle2 className="h-4 w-4 text-green-400" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border-2 border-slate-600" />
                        )}
                        <div>
                          <div className="text-sm text-white">{stakeholder.name}</div>
                          <div className="text-xs text-slate-500">{stakeholder.role}</div>
                        </div>
                      </div>
                      {stakeholder.acknowledged && (
                        <Badge variant="outline" className="text-xs text-green-400">
                          {formatDisplayTime(stakeholder.acknowledgedAt || 0)}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Live Metrics */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-4 space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-400" />
                  Live Metrics
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-blue-400">{completedTasks}</div>
                    <div className="text-xs text-slate-500">Tasks Complete</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-green-400">{acknowledgedCount}</div>
                    <div className="text-xs text-slate-500">Stakeholders Active</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-amber-400">$500K</div>
                    <div className="text-xs text-slate-500">Budget Released</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-purple-400">2.4M</div>
                    <div className="text-xs text-slate-500">Customers Notified</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Completion Card */}
        {demoState === 'complete' && (
          <Card className="mt-6 bg-gradient-to-r from-green-950/50 to-emerald-950/50 border-green-500/30">
            <CardContent className="p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Shield className="h-10 w-10 text-green-400" />
                </div>
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-2">Breach Contained in 12 Minutes</h2>
              <p className="text-slate-300 mb-6">
                Traditional response time: 17 days. M Platform response: 12 minutes.
              </p>
              
              <div className="grid md:grid-cols-4 gap-4 mb-8">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="text-3xl font-bold text-green-400">340X</div>
                  <div className="text-sm text-slate-400">Faster Response</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="text-3xl font-bold text-blue-400">$47M</div>
                  <div className="text-sm text-slate-400">Fine Avoided</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="text-3xl font-bold text-amber-400">47</div>
                  <div className="text-sm text-slate-400">Tasks Coordinated</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="text-3xl font-bold text-purple-400">8</div>
                  <div className="text-sm text-slate-400">Executives Aligned</div>
                </div>
              </div>
              
              <div className="flex justify-center gap-4">
                <Button 
                  onClick={resetDemo}
                  variant="outline"
                  size="lg"
                  data-testid="button-run-again"
                >
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Run Demo Again
                </Button>
                <Button 
                  onClick={() => { resetDemo(); setLocation('/contact'); }}
                  size="lg"
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  data-testid="button-schedule-demo"
                >
                  Schedule Live Demo
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
