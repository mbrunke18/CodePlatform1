import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { updatePageMetadata } from '@/lib/seo';
import { IDEA_PHASES, STRATEGIC_DOMAINS } from '@shared/constants/framework';
import { SIGNAL_CATEGORIES } from '@shared/intelligence-signals';
import {
  ClipboardList,
  Radar,
  Play,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Target,
  Shield,
  Users,
  Activity,
  ChevronRight,
  Sparkles,
  Bell,
  Rocket,
  Globe,
  Scale,
  GitMerge,
  Brain,
  Swords,
  Eye,
  Radio,
  BarChart3,
  ArrowRight,
  Timer,
  PlayCircle,
  BookOpen,
  Lightbulb,
  RefreshCw,
  Settings,
  ExternalLink,
  Layers
} from 'lucide-react';

const phaseIcons: Record<string, any> = {
  ClipboardList,
  Radar,
  Play,
  TrendingUp
};

const domainIcons: Record<string, any> = {
  Globe,
  GitMerge,
  Rocket,
  AlertTriangle,
  Shield,
  Scale,
  Brain,
  Swords,
  Sparkles
};

interface SignalStatus {
  category: string;
  name: string;
  activeCount: number;
  warningCount: number;
  criticalCount: number;
  status: 'healthy' | 'warning' | 'critical';
}

interface PlaybookSummary {
  domain: string;
  name: string;
  category: 'offense' | 'defense' | 'special-teams';
  count: number;
  readyCount: number;
  icon: string;
  color: string;
}

interface ActiveExecution {
  id: string;
  name: string;
  playbook: string;
  startedAt: string;
  progress: number;
  status: 'active' | 'paused' | 'completed';
  stakeholdersEngaged: number;
  tasksCompleted: number;
  totalTasks: number;
}

export default function MissionControl() {
  const [, setLocation] = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activePhase, setActivePhase] = useState<string | null>(null);

  useEffect(() => {
    updatePageMetadata({
      title: 'Mission Control | M Platform',
      description: 'Your strategic command center for the IDEA Framework - Monitor signals, manage playbooks, and execute with precision.'
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const { data: playbooks = [] } = useQuery<any[]>({
    queryKey: ['/api/playbooks'],
  });

  const { data: triggers = [] } = useQuery<any[]>({
    queryKey: ['/api/triggers'],
  });

  const { data: readinessData } = useQuery<any>({
    queryKey: ['/api/readiness-metrics'],
  });

  const signalSummary: SignalStatus[] = SIGNAL_CATEGORIES.map(cat => ({
    category: cat.id,
    name: cat.shortName,
    activeCount: Math.floor(Math.random() * 5) + 1,
    warningCount: Math.floor(Math.random() * 3),
    criticalCount: cat.id === 'competitive' || cat.id === 'regulatory' ? 1 : 0,
    status: cat.id === 'competitive' ? 'critical' : cat.id === 'regulatory' ? 'warning' : 'healthy'
  }));

  const playbookSummary: PlaybookSummary[] = Object.values(STRATEGIC_DOMAINS).map(domain => ({
    domain: domain.id,
    name: domain.name,
    category: domain.category as 'offense' | 'defense' | 'special-teams',
    count: domain.playbookCount,
    readyCount: Math.floor(domain.playbookCount * 0.85),
    icon: domain.icon,
    color: domain.color
  }));

  const activeExecutions: ActiveExecution[] = [
    {
      id: '1',
      name: 'Competitor Response - TechCorp Product Launch',
      playbook: 'Competitive Counter-Positioning',
      startedAt: new Date(Date.now() - 45 * 60000).toISOString(),
      progress: 65,
      status: 'active',
      stakeholdersEngaged: 8,
      tasksCompleted: 7,
      totalTasks: 12
    }
  ];

  const totalPlaybooks = 166;
  const totalSignals = SIGNAL_CATEGORIES.reduce((sum, cat) => sum + cat.dataPoints.length, 0);
  const activeTriggers = triggers.filter((t: any) => t.status === 'active').length || 41;
  const criticalAlerts = signalSummary.filter(s => s.status === 'critical').length;

  const getStatusColor = (status: 'healthy' | 'warning' | 'critical') => {
    switch (status) {
      case 'critical': return 'bg-red-500';
      case 'warning': return 'bg-amber-500';
      default: return 'bg-emerald-500';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'offense': return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30';
      case 'defense': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30';
      case 'special-teams': return 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30';
      default: return 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/30';
    }
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600">
                  <Radio className="h-7 w-7 text-white" />
                </div>
                Mission Control
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Strategic Execution Operating System • IDEA Framework Command Center
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-slate-500 dark:text-slate-400">System Status</div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">All Systems Operational</span>
                </div>
              </div>
              <div className="text-right hidden sm:block">
                <div className="text-sm text-slate-500 dark:text-slate-400">Last Updated</div>
                <div className="font-mono text-lg font-semibold text-slate-900 dark:text-white">
                  {currentTime.toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-blue-100 dark:bg-blue-900/40">
                  <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{totalPlaybooks}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Playbooks Ready</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/40">
                  <Activity className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{activeTriggers}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Active Triggers</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-purple-100 dark:bg-purple-900/40">
                  <Radar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{totalSignals}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Signal Points</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`bg-white dark:bg-slate-800 rounded-xl p-4 border shadow-sm ${
                criticalAlerts > 0 
                  ? 'border-red-300 dark:border-red-700' 
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-lg ${
                  criticalAlerts > 0 
                    ? 'bg-red-100 dark:bg-red-900/40' 
                    : 'bg-slate-100 dark:bg-slate-700'
                }`}>
                  <AlertTriangle className={`h-5 w-5 ${
                    criticalAlerts > 0 
                      ? 'text-red-600 dark:text-red-400' 
                      : 'text-slate-500 dark:text-slate-400'
                  }`} />
                </div>
                <div>
                  <div className={`text-2xl font-bold ${
                    criticalAlerts > 0 
                      ? 'text-red-600 dark:text-red-400' 
                      : 'text-slate-900 dark:text-white'
                  }`}>{criticalAlerts}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Critical Alerts</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* IDEA Runway - Operational Journey */}
          <Card className="border-2 border-slate-200 dark:border-slate-700 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 via-purple-50 to-emerald-50 dark:from-slate-800/80 dark:via-slate-800/60 dark:to-slate-800/80 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
                      IDEA Runway
                    </span>
                    <span className="text-slate-600 dark:text-slate-300">— Your Operational Journey</span>
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Follow this path to achieve 12-minute coordinated response to any strategic event
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI-Assisted
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Phase 1: IDENTIFY - Build Playbooks */}
                <motion.div
                  whileHover={{ y: -4 }}
                  className="relative rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/30 dark:to-slate-900"
                >
                  <div className="hidden lg:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="h-7 w-7 text-slate-300 dark:text-slate-600" />
                  </div>
                  
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/50">
                        <ClipboardList className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <Badge variant="outline" className="text-xs font-mono text-blue-600 border-blue-300">Step 1</Badge>
                        <h3 className="text-lg font-bold text-blue-700 dark:text-blue-400">IDENTIFY</h3>
                      </div>
                    </div>
                    
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-2">
                      Build or Choose Playbooks
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                      Pre-stage stakeholders, tasks, budgets, and communication templates for instant activation.
                    </p>
                    
                    <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600 dark:text-slate-400">Playbooks Ready</span>
                        <span className="font-bold text-blue-700 dark:text-blue-300">{playbooks.length || 166}</span>
                      </div>
                      <Progress value={85} className="h-1.5 bg-blue-100 dark:bg-blue-900" />
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">85% with full stakeholder assignments</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Link href="/playbook-library">
                        <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                          <BookOpen className="h-4 w-4 mr-2" />
                          Browse 166 Playbooks
                        </Button>
                      </Link>
                      <Link href="/playbooks/create">
                        <Button variant="outline" size="sm" className="w-full border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/30">
                          Build Custom Playbook
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>

                {/* Phase 2: DETECT - Configure Triggers */}
                <motion.div
                  whileHover={{ y: -4 }}
                  className="relative rounded-xl border-2 border-emerald-200 dark:border-emerald-800 bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/30 dark:to-slate-900"
                >
                  <div className="hidden lg:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="h-7 w-7 text-slate-300 dark:text-slate-600" />
                  </div>
                  
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/50">
                        <Radar className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <Badge variant="outline" className="text-xs font-mono text-emerald-600 border-emerald-300">Step 2</Badge>
                        <h3 className="text-lg font-bold text-emerald-700 dark:text-emerald-400">DETECT</h3>
                      </div>
                    </div>
                    
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-2">
                      Configure Activation Triggers
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                      Define which signals auto-activate your playbooks so you never miss a critical event.
                    </p>
                    
                    <div className="bg-emerald-50 dark:bg-emerald-900/30 rounded-lg p-3 mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600 dark:text-slate-400">Active Triggers</span>
                        <span className="font-bold text-emerald-700 dark:text-emerald-300">{activeTriggers}</span>
                      </div>
                      <Progress value={75} className="h-1.5 bg-emerald-100 dark:bg-emerald-900" />
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Monitoring {totalSignals}+ data points</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Link href="/triggers-management">
                        <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                          <Bell className="h-4 w-4 mr-2" />
                          Manage Triggers
                        </Button>
                      </Link>
                      <Link href="/signal-intelligence">
                        <Button variant="outline" size="sm" className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-900/30">
                          View Signal Categories
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>

                {/* Phase 3: EXECUTE - Coordinate Response */}
                <motion.div
                  whileHover={{ y: -4 }}
                  className="relative rounded-xl border-2 border-amber-200 dark:border-amber-800 bg-gradient-to-b from-amber-50 to-white dark:from-amber-950/30 dark:to-slate-900"
                >
                  <div className="hidden lg:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="h-7 w-7 text-slate-300 dark:text-slate-600" />
                  </div>
                  
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/50">
                        <Play className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <Badge variant="outline" className="text-xs font-mono text-amber-600 border-amber-300">Step 3</Badge>
                        <h3 className="text-lg font-bold text-amber-700 dark:text-amber-400">EXECUTE</h3>
                      </div>
                    </div>
                    
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-2">
                      Coordinate Response
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                      When triggered, everyone knows their role. Tasks assigned, budgets unlocked, comms staged.
                    </p>
                    
                    <div className="bg-amber-50 dark:bg-amber-900/30 rounded-lg p-3 mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600 dark:text-slate-400">Response Time</span>
                        <span className="font-bold text-amber-700 dark:text-amber-300">12 minutes</span>
                      </div>
                      <Progress value={100} className="h-1.5 bg-amber-100 dark:bg-amber-900" />
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">vs. 72-hour industry average</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Link href="/command-center">
                        <Button size="sm" className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                          <PlayCircle className="h-4 w-4 mr-2" />
                          Open Command Center
                        </Button>
                      </Link>
                      <Link href="/stakeholder-management">
                        <Button variant="outline" size="sm" className="w-full border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-400 dark:hover:bg-amber-900/30">
                          View Stakeholder Roles
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>

                {/* Phase 4: ADVANCE - Learn & Improve */}
                <motion.div
                  whileHover={{ y: -4 }}
                  className="relative rounded-xl border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-b from-purple-50 to-white dark:from-purple-950/30 dark:to-slate-900"
                >
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-900/50">
                        <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <Badge variant="outline" className="text-xs font-mono text-purple-600 border-purple-300">Step 4</Badge>
                        <h3 className="text-lg font-bold text-purple-700 dark:text-purple-400">ADVANCE</h3>
                      </div>
                    </div>
                    
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-2">
                      Review & Improve
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                      Capture lessons learned. AI analyzes patterns and suggests playbook refinements.
                    </p>
                    
                    <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-3 mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600 dark:text-slate-400">Improvement Rate</span>
                        <span className="font-bold text-purple-700 dark:text-purple-300">94%</span>
                      </div>
                      <Progress value={94} className="h-1.5 bg-purple-100 dark:bg-purple-900" />
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Playbooks refined from learnings</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Link href="/institutional-memory">
                        <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                          <Lightbulb className="h-4 w-4 mr-2" />
                          View Lessons Learned
                        </Button>
                      </Link>
                      <Link href="/playbook-readiness-audit">
                        <Button variant="outline" size="sm" className="w-full border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-400 dark:hover:bg-purple-900/30">
                          Run Readiness Audit
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              {/* Quick Start CTA */}
              <div className="mt-6 p-4 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                      <Zap className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Ready to see it in action?</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Experience a live trigger→execution flow in 3 minutes</p>
                    </div>
                  </div>
                  <Link href="/pilot-demo">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                      <Play className="h-4 w-4 mr-2" />
                      Try Live Demo
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Playbook Library - First (aligns with IDENTIFY phase) */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg">Playbook Library</CardTitle>
                  </div>
                  <Link href="/playbook-library">
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <CardDescription>166 pre-staged playbooks across 9 strategic domains</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="offense" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="offense" className="text-emerald-600 data-[state=active]:bg-emerald-50 dark:data-[state=active]:bg-emerald-900/30">
                      OFFENSE (58)
                    </TabsTrigger>
                    <TabsTrigger value="defense" className="text-red-600 data-[state=active]:bg-red-50 dark:data-[state=active]:bg-red-900/30">
                      DEFENSE (56)
                    </TabsTrigger>
                    <TabsTrigger value="special_teams" className="text-purple-600 data-[state=active]:bg-purple-50 dark:data-[state=active]:bg-purple-900/30">
                      SPECIAL TEAMS (52)
                    </TabsTrigger>
                  </TabsList>
                  
                  {['offense', 'defense', 'special_teams'].map(category => (
                    <TabsContent key={category} value={category} className="mt-0">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {playbookSummary
                          .filter(p => p.category === category)
                          .map(domain => {
                            const DomainIcon = domainIcons[domain.icon] || Target;
                            return (
                              <motion.div
                                key={domain.domain}
                                whileHover={{ scale: 1.02 }}
                                onClick={() => setLocation(`/playbooks?domain=${domain.domain}`)}
                                className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all cursor-pointer group"
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-3">
                                    <div 
                                      className="p-2 rounded-lg"
                                      style={{ backgroundColor: `${domain.color}15` }}
                                    >
                                      <DomainIcon 
                                        className="h-5 w-5"
                                        style={{ color: domain.color }}
                                      />
                                    </div>
                                    <div>
                                      <div className="font-semibold text-slate-900 dark:text-white text-sm">
                                        {domain.name}
                                      </div>
                                      <div className="text-xs text-slate-500">
                                        {domain.count} playbooks
                                      </div>
                                    </div>
                                  </div>
                                  <ChevronRight className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="space-y-1.5">
                                  <div className="flex justify-between text-xs">
                                    <span className="text-slate-500">Readiness</span>
                                    <span className="font-medium text-emerald-600">
                                      {Math.round((domain.readyCount / domain.count) * 100)}%
                                    </span>
                                  </div>
                                  <Progress 
                                    value={(domain.readyCount / domain.count) * 100} 
                                    className="h-1.5"
                                  />
                                </div>
                              </motion.div>
                            );
                          })}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>

            {/* Signal Intelligence Panel - Second (aligns with DETECT phase) */}
            <Card className="lg:col-span-1">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Radar className="h-5 w-5 text-emerald-600" />
                    <CardTitle className="text-lg">Signal Intelligence</CardTitle>
                  </div>
                  <Link href="/signal-intelligence">
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <CardDescription>16 categories • {totalSignals} data points monitored</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2 pr-2">
                    {signalSummary.map((signal) => (
                      <div 
                        key={signal.category}
                        className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(signal.status)}`} />
                          <span className="font-medium text-slate-900 dark:text-white">{signal.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {signal.criticalCount > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {signal.criticalCount} critical
                            </Badge>
                          )}
                          {signal.warningCount > 0 && signal.criticalCount === 0 && (
                            <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
                              {signal.warningCount} warning
                            </Badge>
                          )}
                          <span className="text-sm text-slate-500">{signal.activeCount} active</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <Link href="/triggers-management">
                    <Button variant="outline" className="w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure Triggers
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Executions & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Command Center Preview */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Play className="h-5 w-5 text-amber-600" />
                    <CardTitle className="text-lg">Command Center</CardTitle>
                  </div>
                  <Link href="/command-center">
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <CardDescription>Active playbook executions and coordination status</CardDescription>
              </CardHeader>
              <CardContent>
                {activeExecutions.length > 0 ? (
                  <div className="space-y-4">
                    {activeExecutions.map(execution => (
                      <div 
                        key={execution.id}
                        className="p-4 rounded-xl border-2 border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/20"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                              <span className="font-semibold text-slate-900 dark:text-white">
                                {execution.name}
                              </span>
                            </div>
                            <div className="text-sm text-slate-500 mt-1">
                              Playbook: {execution.playbook}
                            </div>
                          </div>
                          <Badge className="bg-amber-500 text-white">
                            <Timer className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="text-center p-3 rounded-lg bg-white dark:bg-slate-800">
                            <div className="text-2xl font-bold text-slate-900 dark:text-white">
                              {execution.stakeholdersEngaged}
                            </div>
                            <div className="text-xs text-slate-500">Stakeholders</div>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-white dark:bg-slate-800">
                            <div className="text-2xl font-bold text-slate-900 dark:text-white">
                              {execution.tasksCompleted}/{execution.totalTasks}
                            </div>
                            <div className="text-xs text-slate-500">Tasks Done</div>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-white dark:bg-slate-800">
                            <div className="text-2xl font-bold text-amber-600">
                              {Math.floor((Date.now() - new Date(execution.startedAt).getTime()) / 60000)}m
                            </div>
                            <div className="text-xs text-slate-500">Elapsed</div>
                          </div>
                        </div>
                        
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Execution Progress</span>
                            <span className="font-medium">{execution.progress}%</span>
                          </div>
                          <Progress value={execution.progress} className="h-2" />
                        </div>
                        
                        <div className="mt-4 flex gap-2">
                          <Link href="/command-center" className="flex-1">
                            <Button className="w-full bg-amber-600 hover:bg-amber-700">
                              <Eye className="h-4 w-4 mr-2" />
                              View Command Center
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-500">
                    <Play className="h-12 w-12 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                    <p className="font-medium">No Active Executions</p>
                    <p className="text-sm mt-1">Playbooks will appear here when triggered</p>
                    <Link href="/pilot-demo">
                      <Button variant="outline" className="mt-4">
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Try Pilot Demo
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-purple-600" />
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </div>
                <CardDescription>Common tasks and navigation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Link href="/pilot-demo">
                    <Button variant="outline" className="w-full justify-start h-auto py-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/40">
                          <PlayCircle className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium">Try Pilot Demo</div>
                          <div className="text-xs text-slate-500">Experience full execution</div>
                        </div>
                      </div>
                    </Button>
                  </Link>
                  
                  <Link href="/playbook-library">
                    <Button variant="outline" className="w-full justify-start h-auto py-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/40">
                          <BookOpen className="h-4 w-4 text-emerald-600" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium">Browse Playbooks</div>
                          <div className="text-xs text-slate-500">166 pre-built templates</div>
                        </div>
                      </div>
                    </Button>
                  </Link>
                  
                  <Link href="/signal-intelligence">
                    <Button variant="outline" className="w-full justify-start h-auto py-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/40">
                          <Radar className="h-4 w-4 text-purple-600" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium">Signal Intelligence</div>
                          <div className="text-xs text-slate-500">Configure monitoring</div>
                        </div>
                      </div>
                    </Button>
                  </Link>
                  
                  <Link href="/triggers-management">
                    <Button variant="outline" className="w-full justify-start h-auto py-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/40">
                          <Bell className="h-4 w-4 text-amber-600" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium">Manage Triggers</div>
                          <div className="text-xs text-slate-500">41 active triggers</div>
                        </div>
                      </div>
                    </Button>
                  </Link>

                  <Link href="/operating-model-alignment">
                    <Button variant="outline" className="w-full justify-start h-auto py-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700">
                          <Layers className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium">Operating Model</div>
                          <div className="text-xs text-slate-500">Align org structure</div>
                        </div>
                      </div>
                    </Button>
                  </Link>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-3">Institutional Memory</div>
                  <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="h-4 w-4 text-purple-600" />
                      <span className="font-medium text-purple-900 dark:text-purple-100">Latest Insight</span>
                    </div>
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      "Competitor response playbooks reduced reaction time by 340x vs. industry average."
                    </p>
                    <Link href="/institutional-memory">
                      <Button variant="link" size="sm" className="p-0 h-auto mt-2 text-purple-600">
                        View all learnings →
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Value Proposition Footer */}
          <Card className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 text-white border-0">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-white/10">
                    <Timer className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">12 Minutes vs. 72 Hours</h3>
                    <p className="text-slate-300">M Platform delivers 340x faster coordinated response</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Link href="/how-it-works">
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      Learn More
                    </Button>
                  </Link>
                  <Link href="/pilot-demo">
                    <Button className="bg-white text-slate-900 hover:bg-slate-100">
                      <Rocket className="h-4 w-4 mr-2" />
                      Start Demo
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
