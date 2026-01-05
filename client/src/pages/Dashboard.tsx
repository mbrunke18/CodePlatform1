import { useEffect } from "react";
import { useQuery } from '@tanstack/react-query';
import { useWebSocket } from "@/hooks/useWebSocket";
import { updatePageMetadata } from "@/lib/seo";
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Zap, 
  Target, 
  Radio, 
  Brain,
  ChevronRight,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react';
import { Link } from 'wouter';
import { useDynamicStrategy } from '@/contexts/DynamicStrategyContext';

function StatusDot({ status }: { status: 'good' | 'warning' | 'critical' }) {
  const colors = {
    good: 'bg-emerald-500',
    warning: 'bg-amber-500',
    critical: 'bg-red-500'
  };
  return <div className={`w-2.5 h-2.5 rounded-full ${colors[status]} animate-pulse`} />;
}

function KPICard({ 
  label, 
  value, 
  status, 
  trend 
}: { 
  label: string; 
  value: string; 
  status: 'good' | 'warning' | 'critical';
  trend?: string;
}) {
  const statusColors = {
    good: 'text-emerald-600 dark:text-emerald-400',
    warning: 'text-amber-600 dark:text-amber-400',
    critical: 'text-red-600 dark:text-red-400'
  };

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <StatusDot status={status} />
      <div>
        <div className={`text-lg sm:text-2xl font-bold ${statusColors[status]}`}>{value}</div>
        <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">{label}</div>
        {trend && <div className="text-[9px] sm:text-xs text-slate-400 dark:text-slate-500 hidden sm:block">{trend}</div>}
      </div>
    </div>
  );
}

function PhaseCard({
  phase,
  title,
  description,
  icon: Icon,
  metrics,
  link,
  color
}: {
  phase: string;
  title: string;
  description: string;
  icon: any;
  metrics: { label: string; value: string; highlight?: boolean }[];
  link: string;
  color: 'violet' | 'blue' | 'amber' | 'emerald';
}) {
  const colorClasses = {
    violet: {
      border: 'border-violet-200 dark:border-violet-800 hover:border-violet-400 dark:hover:border-violet-600',
      iconBg: 'bg-violet-100 dark:bg-violet-900/50',
      iconColor: 'text-violet-600 dark:text-violet-400',
      badge: 'bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300'
    },
    blue: {
      border: 'border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600',
      iconBg: 'bg-blue-100 dark:bg-blue-900/50',
      iconColor: 'text-blue-600 dark:text-blue-400',
      badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
    },
    emerald: {
      border: 'border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 dark:hover:border-emerald-600',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/50',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
    },
    amber: {
      border: 'border-amber-200 dark:border-amber-800 hover:border-amber-400 dark:hover:border-amber-600',
      iconBg: 'bg-amber-100 dark:bg-amber-900/50',
      iconColor: 'text-amber-600 dark:text-amber-400',
      badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
    }
  };

  const c = colorClasses[color];

  return (
    <Link href={link}>
      <Card className={`card-bg border-2 ${c.border} transition-all cursor-pointer hover:shadow-lg h-full`}>
        <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${c.iconBg} flex items-center justify-center`}>
                <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${c.iconColor}`} />
              </div>
              <div>
                <Badge className={`${c.badge} text-[10px] sm:text-xs font-bold`}>{phase}</Badge>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </div>
          <CardTitle className="text-sm sm:text-lg text-slate-900 dark:text-white">{title}</CardTitle>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{description}</p>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
          <div className="space-y-1 sm:space-y-2">
            {metrics.map((metric, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">{metric.label}</span>
                <span className={`text-xs sm:text-sm font-semibold ${metric.highlight ? c.iconColor : 'text-slate-900 dark:text-white'}`}>
                  {metric.value}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function ActivityItem({
  type,
  title,
  time,
  status
}: {
  type: 'alert' | 'activation' | 'update' | 'success';
  title: string;
  time: string;
  status?: string;
}) {
  const icons = {
    alert: AlertTriangle,
    activation: Zap,
    update: Activity,
    success: CheckCircle
  };
  const colors = {
    alert: 'text-amber-500 bg-amber-100 dark:bg-amber-900/30',
    activation: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30',
    update: 'text-slate-500 bg-slate-100 dark:bg-slate-800',
    success: 'text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30'
  };

  const Icon = icons[type];
  const colorClass = colors[type];

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
      <div className={`w-8 h-8 rounded-lg ${colorClass} flex items-center justify-center flex-shrink-0`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-slate-500 dark:text-slate-400">{time}</span>
          {status && (
            <Badge variant="outline" className="text-xs py-0 h-5">{status}</Badge>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { isConnected } = useWebSocket();
  const { activeScenarios, weakSignals } = useDynamicStrategy();

  const { data: preparednessScore } = useQuery({
    queryKey: ['/api/preparedness-score'],
  });

  const { data: activeTriggers } = useQuery({
    queryKey: ['/api/triggers'],
  });

  const { data: recentActivations } = useQuery({
    queryKey: ['/api/playbook-activations/recent'],
  });

  const scoreValue = (preparednessScore as any)?.overall_score || 84;
  const triggerCount = Array.isArray(activeTriggers) ? activeTriggers.filter((t: any) => t.status === 'active').length : 12;
  const activationCount = Array.isArray(recentActivations) ? recentActivations.length : 0;

  useEffect(() => {
    updatePageMetadata({
      title: "Dashboard | M Strategic Execution OS",
      description: "Your strategic execution command center. Monitor readiness, track triggers, and coordinate responses in real-time.",
      ogTitle: "M Dashboard",
      ogDescription: "Strategic Execution Operating System for Fortune 1000 executives.",
    });
  }, []);

  const overallStatus: 'good' | 'warning' | 'critical' = 
    scoreValue >= 80 && triggerCount >= 10 ? 'good' :
    scoreValue >= 60 ? 'warning' : 'critical';

  return (
    <PageLayout>
      <div className="flex-1 overflow-auto page-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
          
          {/* Hero Banner - Deterministic Strategic Execution */}
          <div className="text-center py-4 sm:py-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 leading-tight">
              From 72 Hours to 12 Minutes.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">
                Deterministic Strategic Execution.
              </span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              No fragmented tools. No experimental AI. Just battle-tested playbooks 
              that transform how Fortune 1000 companies respond to the moments that matter.
            </p>
          </div>

          {/* Zone 1: Executive Summary Strip */}
          <Card className="card-bg">
            <CardContent className="p-3 sm:p-5">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
                {/* Status & Title */}
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${
                    overallStatus === 'good' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                    overallStatus === 'warning' ? 'bg-amber-100 dark:bg-amber-900/30' : 
                    'bg-red-100 dark:bg-red-900/30'
                  }`}>
                    <Shield className={`h-5 w-5 sm:h-6 sm:w-6 ${
                      overallStatus === 'good' ? 'text-emerald-600 dark:text-emerald-400' :
                      overallStatus === 'warning' ? 'text-amber-600 dark:text-amber-400' : 
                      'text-red-600 dark:text-red-400'
                    }`} />
                  </div>
                  <div>
                    <h1 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white">Strategic Command Center</h1>
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-0.5">
                      <StatusDot status={overallStatus} />
                      <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                        {overallStatus === 'good' ? 'All Systems Operational' :
                         overallStatus === 'warning' ? 'Attention Required' : 'Action Needed'}
                      </span>
                      <span className="text-xs text-slate-400 hidden sm:inline">•</span>
                      <span className="text-[10px] sm:text-xs text-slate-400">
                        {isConnected ? 'Live' : 'Reconnecting...'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* KPI Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
                  <KPICard 
                    label="Readiness Score" 
                    value={`${scoreValue}%`}
                    status={scoreValue >= 80 ? 'good' : scoreValue >= 60 ? 'warning' : 'critical'}
                    trend="Target: 84.4%"
                  />
                  <KPICard 
                    label="Active Triggers" 
                    value={`${triggerCount}`}
                    status={triggerCount >= 10 ? 'good' : triggerCount >= 5 ? 'warning' : 'critical'}
                    trend="24/7 monitoring"
                  />
                  <KPICard 
                    label="Response Time" 
                    value="12 min"
                    status="good"
                    trend="vs 72hr industry"
                  />
                  <KPICard 
                    label="Weak Signals" 
                    value={`${weakSignals.length}`}
                    status={weakSignals.length === 0 ? 'good' : weakSignals.length <= 3 ? 'warning' : 'critical'}
                    trend="Detected today"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Zone 2: 4-Phase Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Strategic Workflow</h2>
              <Badge variant="outline" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                IDENTIFY → DETECT → EXECUTE → ADVANCE
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <PhaseCard
                phase="IDENTIFY"
                title="Build Your Depth Chart"
                description="166 templates across 9 strategic domains"
                icon={Target}
                color="violet"
                link="/playbook-library"
                metrics={[
                  { label: 'Playbook Templates', value: '166' },
                  { label: 'Custom Scenarios', value: '12' },
                  { label: 'Coverage', value: '94%', highlight: true }
                ]}
              />
              
              <PhaseCard
                phase="DETECT"
                title="Monitor Signals"
                description="Real-time signal detection and alerts"
                icon={Radio}
                color="blue"
                link="/signal-intelligence"
                metrics={[
                  { label: 'AI Modules', value: '5 Active', highlight: true },
                  { label: 'Signals Tracked', value: '12 types' },
                  { label: 'Weak Signals', value: `${weakSignals.length} detected` }
                ]}
              />
              
              <PhaseCard
                phase="EXECUTE"
                title="Execute Response"
                description="12-minute coordinated response"
                icon={Zap}
                color="emerald"
                link="/command-center"
                metrics={[
                  { label: 'Active Scenarios', value: `${activeScenarios.length}` },
                  { label: 'Avg Execution', value: '11m 47s', highlight: true },
                  { label: 'Success Rate', value: '94%' }
                ]}
              />
              
              <PhaseCard
                phase="ADVANCE"
                title="Review the Film"
                description="AI-powered analysis and refinement"
                icon={Brain}
                color="amber"
                link="/institutional-memory"
                metrics={[
                  { label: 'Scenarios Analyzed', value: '24' },
                  { label: 'Patterns Found', value: '18' },
                  { label: 'Playbook Improvements', value: '+34%', highlight: true }
                ]}
              />
            </div>
          </div>

          {/* Zone 3: Activity Feed + Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Activity Feed */}
            <div className="lg:col-span-2">
              <Card className="card-bg h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Recent Activity</CardTitle>
                    <Badge variant="outline" className="text-xs">
                      <Activity className="h-3 w-3 mr-1" />
                      Live
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-1">
                  <ActivityItem
                    type="alert"
                    title="Weak signal detected: Competitor pricing change"
                    time="2 min ago"
                    status="Monitoring"
                  />
                  <ActivityItem
                    type="activation"
                    title="M&A Integration playbook activated"
                    time="15 min ago"
                    status="In Progress"
                  />
                  <ActivityItem
                    type="success"
                    title="Product Launch scenario completed successfully"
                    time="1 hour ago"
                  />
                  <ActivityItem
                    type="update"
                    title="AI Radar updated with 3 new patterns"
                    time="2 hours ago"
                  />
                  <ActivityItem
                    type="alert"
                    title="Trigger threshold approaching: Supply chain risk"
                    time="3 hours ago"
                    status="Watch"
                  />
                  
                  <div className="pt-3">
                    <Link href="/crisis-response-center">
                      <Button variant="outline" size="sm" className="w-full">
                        View All Activity
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div>
              <Card className="card-bg h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/demo/live-activation">
                    <Button variant="outline" className="w-full justify-start h-auto py-3" data-testid="button-run-demo">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                        <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-sm">Run Live Demo</div>
                        <div className="text-xs text-slate-500">Experience a 12-min activation</div>
                      </div>
                    </Button>
                  </Link>
                  
                  <Link href="/playbook-library">
                    <Button variant="outline" className="w-full justify-start h-auto py-3" data-testid="button-browse-playbooks">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3">
                        <Target className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-sm">Browse Playbooks</div>
                        <div className="text-xs text-slate-500">166 strategic templates</div>
                      </div>
                    </Button>
                  </Link>
                  
                  <Link href="/triggers-management">
                    <Button variant="outline" className="w-full justify-start h-auto py-3" data-testid="button-configure-triggers">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mr-3">
                        <Radio className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-sm">Configure Triggers</div>
                        <div className="text-xs text-slate-500">Set up AI monitoring</div>
                      </div>
                    </Button>
                  </Link>
                  
                  <Link href="/preparedness-report">
                    <Button variant="outline" className="w-full justify-start h-auto py-3" data-testid="button-view-report">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mr-3">
                        <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-sm">Preparedness Report</div>
                        <div className="text-xs text-slate-500">Full readiness analysis</div>
                      </div>
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-slate-400 dark:text-slate-500 pt-2">
            Data refreshes automatically • Last updated just now
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
