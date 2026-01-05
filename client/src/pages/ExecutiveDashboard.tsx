import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { updatePageMetadata } from '@/lib/seo';
import PageLayout from '@/components/layout/PageLayout';
import OnboardingTrigger from '@/components/onboarding/OnboardingTrigger';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import DecisionVelocityDashboard from '@/components/DecisionVelocityDashboard';
import { 
  Shield, 
  Zap, 
  Target, 
  AlertTriangle,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Brain,
  TrendingUp,
  Eye,
  Clock,
  BarChart3,
  RefreshCw,
  Sparkles,
  CheckCircle,
  Radio,
  ChevronRight,
  Layers
} from 'lucide-react';
import { Link } from 'wouter';
import { format } from 'date-fns';
import { queryClient } from '@/lib/queryClient';

function StatusIndicator({ status }: { status: 'good' | 'warning' | 'critical' }) {
  const config = {
    good: { bg: 'bg-emerald-500', className: 'text-emerald-600 dark:text-emerald-400', label: 'Healthy' },
    warning: { bg: 'bg-amber-500', className: 'text-amber-600 dark:text-amber-400', label: 'Attention' },
    critical: { bg: 'bg-red-500', className: 'text-red-600 dark:text-red-400', label: 'Critical' }
  };
  const c = config[status];
  
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2.5 h-2.5 rounded-full ${c.bg}`} />
      <span className={`text-sm font-medium ${c.className}`}>{c.label}</span>
    </div>
  );
}

function MetricCard({ 
  title, 
  value, 
  unit,
  trend,
  trendDirection,
  status,
  icon: Icon,
  description
}: {
  title: string;
  value: string | number;
  unit?: string;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  status: 'good' | 'warning' | 'critical';
  icon: any;
  description?: string;
}) {
  const statusBorders = {
    good: 'border-l-emerald-500',
    warning: 'border-l-amber-500',
    critical: 'border-l-red-500'
  };

  const trendIcons = {
    up: ArrowUpRight,
    down: ArrowDownRight,
    neutral: Minus
  };
  const TrendIcon = trendDirection ? trendIcons[trendDirection] : null;

  const trendClasses = {
    up: 'text-emerald-600 dark:text-emerald-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-slate-500 dark:text-slate-400'
  };

  return (
    <Card className={`border-l-4 ${statusBorders[status]} hover:shadow-md transition-shadow`}>
      <CardContent className="pt-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30">
            <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <StatusIndicator status={status} />
        </div>
        <div>
          <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">{value}</span>
            {unit && <span className="text-lg text-slate-400 dark:text-slate-500">{unit}</span>}
          </div>
        </div>
        {trend && trendDirection && TrendIcon && (
          <div className={`flex items-center gap-1 text-sm ${trendClasses[trendDirection]}`}>
            <TrendIcon className="h-4 w-4" />
            <span>{trend}</span>
          </div>
        )}
        {description && (
          <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

interface ReadinessMetric {
  id: string;
  organizationId: string;
  overallScore: string;
  playbookMaturity: string;
  executionVelocity: string;
  learningRate: string;
  signalDetection: string;
  insights: Record<string, any>;
  calculatedAt: string;
}

interface WeakSignal {
  id: string;
  title: string;
  urgency: string;
  confidence: string;
  description: string;
  detectedAt: string;
}

interface OraclePattern {
  id: string;
  title: string;
  impact: string;
  confidence: string;
  description: string;
}

export default function ExecutiveDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    updatePageMetadata({
      title: "Executive Dashboard | M Strategic Execution OS",
      description: "Your unified strategic command center. Monitor Future Readiness Index, decision velocity, and organizational preparedness in real-time.",
      ogTitle: "Executive Dashboard | M",
      ogDescription: "Real-time executive metrics for strategic execution performance.",
    });
  }, []);

  // Core metrics queries
  const { data: dynamicStatus } = useQuery<any>({
    queryKey: ['/api/dynamic-strategy/status'],
  });

  const { data: readiness } = useQuery<ReadinessMetric>({
    queryKey: ['/api/dynamic-strategy/readiness'],
  });

  const { data: weakSignalsData } = useQuery<WeakSignal[]>({
    queryKey: ['/api/dynamic-strategy/weak-signals'],
  });

  const { data: oraclePatternsData } = useQuery<OraclePattern[]>({
    queryKey: ['/api/dynamic-strategy/oracle-patterns'],
  });

  const { data: organizationsData } = useQuery<any[]>({ 
    queryKey: ['/api/organizations'] 
  });

  const weakSignals = weakSignalsData ?? [];
  const oraclePatterns = oraclePatternsData ?? [];
  const organizations = organizationsData ?? [];

  const { data: preparednessScore } = useQuery({
    queryKey: ['/api/preparedness-score'],
  });

  const { data: activeTriggers } = useQuery({
    queryKey: ['/api/triggers'],
  });

  const organizationId = organizations[0]?.id || 'demo-org-1';

  // Calculate metrics
  const friScore = parseFloat(readiness?.overallScore || '0') || dynamicStatus?.readinessScore || 0;
  const playbookMaturity = parseFloat(readiness?.playbookMaturity || '0');
  const executionVelocity = parseFloat(readiness?.executionVelocity || '0');
  const learningRate = parseFloat(readiness?.learningRate || '0');
  const signalDetection = parseFloat(readiness?.signalDetection || '0');
  
  const scoreValue = (preparednessScore as any)?.overall_score || 0;
  const triggerCount = Array.isArray(activeTriggers) ? activeTriggers.length : 0;
  const activeCount = Array.isArray(activeTriggers) ? activeTriggers.filter((t: any) => t.status === 'active').length : 0;

  const overallStatus: 'good' | 'warning' | 'critical' = 
    friScore >= 80 ? 'good' :
    friScore >= 60 ? 'warning' : 'critical';

  const handleRecalculate = async () => {
    try {
      await fetch('/api/dynamic-strategy/readiness/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      queryClient.invalidateQueries({ queryKey: ['/api/dynamic-strategy/readiness'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dynamic-strategy/status'] });
    } catch (error) {
      console.error('Failed to recalculate readiness:', error);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      default: return 'secondary';
    }
  };

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto space-y-6 p-6" data-testid="executive-dashboard">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Executive Dashboard</h1>
              <OnboardingTrigger 
                pageId="executive-dashboard" 
                autoStart={true} 
                className="bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50" 
              />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Unified strategic command center for M
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
              <Activity className="h-3 w-3 mr-1.5" />
              Live
            </Badge>
            <Button 
              onClick={handleRecalculate}
              variant="outline"
              size="sm"
              className="gap-2"
              data-testid="button-recalculate"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview" data-testid="tab-overview" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="readiness" data-testid="tab-readiness" className="gap-2">
              <Brain className="h-4 w-4" />
              Readiness
            </TabsTrigger>
            <TabsTrigger value="velocity" data-testid="tab-velocity" className="gap-2">
              <Zap className="h-4 w-4" />
              Velocity
            </TabsTrigger>
            <TabsTrigger value="preparedness" data-testid="tab-preparedness" className="gap-2">
              <Shield className="h-4 w-4" />
              Preparedness
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Hero FRI Score */}
            <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-slate-900">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className={`text-6xl font-bold ${getScoreColor(friScore)}`} data-testid="text-fri-score">
                        {friScore.toFixed(1)}%
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">Future Readiness Index™</div>
                    </div>
                    <div className="h-20 w-px bg-slate-200 dark:bg-slate-700" />
                    <div className="space-y-2">
                      <StatusIndicator status={overallStatus} />
                      <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md">
                        Your organization's strategic preparedness across playbooks, execution velocity, learning rate, and signal detection.
                      </p>
                    </div>
                  </div>
                  <Link href="/intelligence">
                    <Button variant="outline" className="gap-2" data-testid="link-intelligence">
                      <Radio className="h-4 w-4" />
                      View Signals
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Playbook Maturity"
                value={playbookMaturity.toFixed(0)}
                unit="%"
                trend="+2.3% this month"
                trendDirection="up"
                status={playbookMaturity >= 80 ? 'good' : playbookMaturity >= 60 ? 'warning' : 'critical'}
                icon={Target}
                description="Depth & completeness of playbooks"
              />
              <MetricCard
                title="Execution Velocity"
                value={executionVelocity.toFixed(0)}
                unit="%"
                trend="12 min avg response"
                trendDirection="up"
                status={executionVelocity >= 80 ? 'good' : executionVelocity >= 60 ? 'warning' : 'critical'}
                icon={Zap}
                description="Speed of coordinated response"
              />
              <MetricCard
                title="Active Triggers"
                value={activeCount}
                trend={`${triggerCount} configured`}
                trendDirection="neutral"
                status={activeCount >= 5 ? 'good' : activeCount >= 2 ? 'warning' : 'critical'}
                icon={AlertTriangle}
                description="Monitoring for opportunities & threats"
              />
              <MetricCard
                title="Signal Detection"
                value={signalDetection.toFixed(0)}
                unit="%"
                trend="24/7 AI monitoring"
                trendDirection="up"
                status={signalDetection >= 80 ? 'good' : signalDetection >= 60 ? 'warning' : 'critical'}
                icon={Eye}
                description="Pattern recognition accuracy"
              />
            </div>

            {/* Weak Signals & Patterns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    Weak Signals Detected
                  </CardTitle>
                  <CardDescription>Early indicators requiring attention</CardDescription>
                </CardHeader>
                <CardContent>
                  {weakSignals.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                      <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No weak signals detected</p>
                      <p className="text-sm">AI is continuously monitoring</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {weakSignals.slice(0, 4).map((signal) => (
                        <div key={signal.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                          <Badge variant={getUrgencyBadge(signal.urgency) as any} className="mt-0.5">
                            {signal.urgency}
                          </Badge>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-slate-900 dark:text-white">{signal.title}</div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{signal.description}</p>
                          </div>
                          <div className="text-xs text-slate-400">{signal.confidence}% conf</div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    Oracle Patterns
                  </CardTitle>
                  <CardDescription>AI-detected strategic opportunities</CardDescription>
                </CardHeader>
                <CardContent>
                  {oraclePatterns.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                      <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No patterns detected yet</p>
                      <p className="text-sm">Oracle is learning from your data</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {oraclePatterns.slice(0, 4).map((pattern) => (
                        <div key={pattern.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                          <TrendingUp className="h-4 w-4 text-purple-500 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-slate-900 dark:text-white">{pattern.title}</div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{pattern.description}</p>
                          </div>
                          <Badge variant="outline">{pattern.impact} impact</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Link href="/playbook-library">
                    <Button variant="outline" className="w-full justify-start gap-2" data-testid="link-playbooks">
                      <Target className="h-4 w-4" />
                      Playbook Library
                    </Button>
                  </Link>
                  <Link href="/command-center">
                    <Button variant="outline" className="w-full justify-start gap-2" data-testid="link-command-center">
                      <Shield className="h-4 w-4" />
                      Command Center
                    </Button>
                  </Link>
                  <Link href="/intelligence">
                    <Button variant="outline" className="w-full justify-start gap-2" data-testid="link-intelligence-hub">
                      <Radio className="h-4 w-4" />
                      Intelligence Hub
                    </Button>
                  </Link>
                  <Link href="/settings">
                    <Button variant="outline" className="w-full justify-start gap-2" data-testid="link-settings">
                      <Activity className="h-4 w-4" />
                      Configuration
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Readiness Tab */}
          <TabsContent value="readiness" className="space-y-6">
            <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-slate-900">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Brain className="h-6 w-6 text-blue-600" />
                      Future Readiness Index™
                    </CardTitle>
                    <CardDescription>
                      {readiness?.calculatedAt 
                        ? `Last updated ${format(new Date(readiness.calculatedAt), 'PPp')}`
                        : 'Calculating...'}
                    </CardDescription>
                  </div>
                  <div className={`text-5xl font-bold ${getScoreColor(friScore)}`}>
                    {friScore.toFixed(1)}%
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Playbook Maturity</span>
                      <span className={`font-medium ${getScoreColor(playbookMaturity)}`}>{playbookMaturity.toFixed(0)}%</span>
                    </div>
                    <Progress value={playbookMaturity} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Execution Velocity</span>
                      <span className={`font-medium ${getScoreColor(executionVelocity)}`}>{executionVelocity.toFixed(0)}%</span>
                    </div>
                    <Progress value={executionVelocity} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Learning Rate</span>
                      <span className={`font-medium ${getScoreColor(learningRate)}`}>{learningRate.toFixed(0)}%</span>
                    </div>
                    <Progress value={learningRate} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Signal Detection</span>
                      <span className={`font-medium ${getScoreColor(signalDetection)}`}>{signalDetection.toFixed(0)}%</span>
                    </div>
                    <Progress value={signalDetection} className="h-2" />
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 dark:text-white mb-2">What is the Future Readiness Index?</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    The FRI™ is M's proprietary metric measuring your organization's strategic preparedness. 
                    It combines playbook completeness, response speed, AI learning effectiveness, and signal detection accuracy 
                    to give you a single score reflecting your ability to respond to opportunities and threats.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Improvement Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Improve Your Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">Add more playbooks</div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Each configured playbook adds to your maturity score</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">Run practice drills</div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Regular drills improve execution velocity</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">Configure more triggers</div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">More signal sources improve detection accuracy</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">Review past activations</div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Learning from history improves the learning rate</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Velocity Tab */}
          <TabsContent value="velocity" className="space-y-6">
            <Card className="bg-gradient-to-br from-yellow-50 to-white dark:from-yellow-950/10 dark:to-slate-900 border-2 border-yellow-200 dark:border-yellow-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-6 w-6 text-yellow-500" />
                  Decision Velocity
                </CardTitle>
                <CardDescription>
                  The competitive advantage metric that Fortune 1000 leaders track
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white dark:bg-slate-900 rounded-lg border">
                    <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">12 min</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">Your Response Time</div>
                  </div>
                  <div className="text-center p-4 bg-white dark:bg-slate-900 rounded-lg border">
                    <div className="text-3xl font-bold text-slate-400">72 hrs</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">Industry Average</div>
                  </div>
                  <div className="text-center p-4 bg-white dark:bg-slate-900 rounded-lg border">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">360x</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">Faster Than Competitors</div>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  <strong>Decision Velocity</strong> measures how fast your organization moves from strategic signal 
                  to execution completion. While competitors coordinate through email chains and meetings, you execute instantly.
                </p>
              </CardContent>
            </Card>

            <DecisionVelocityDashboard organizationId={organizationId} />
          </TabsContent>

          {/* Preparedness Tab */}
          <TabsContent value="preparedness" className="space-y-6">
            <Card className="border-2 border-emerald-200 dark:border-emerald-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-emerald-600" />
                  Preparedness Score
                </CardTitle>
                <CardDescription>Your overall strategic readiness rating</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-emerald-600 dark:text-emerald-400" data-testid="score-preparedness">
                      {scoreValue || 0}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 mt-2">out of 100</div>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium">Playbooks Configured</span>
                        <span>{dynamicStatus?.playbooksReady || 0}</span>
                      </div>
                      <Progress value={(dynamicStatus?.playbooksReady || 0) / 10 * 100} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium">Triggers Active</span>
                        <span>{activeCount}</span>
                      </div>
                      <Progress value={activeCount / 10 * 100} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium">Drills Completed (30d)</span>
                        <span>{dynamicStatus?.drillsCompleted || 0}</span>
                      </div>
                      <Progress value={(dynamicStatus?.drillsCompleted || 0) / 5 * 100} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Boost Your Preparedness</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Link href="/playbook-library">
                    <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                      <div className="flex items-center gap-3">
                        <Target className="h-5 w-5 text-blue-600" />
                        <div>
                          <div className="font-medium">Configure More Playbooks</div>
                          <p className="text-sm text-slate-500">Add playbooks from our 166-template library</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-slate-400" />
                    </div>
                  </Link>
                  <Link href="/practice-drills">
                    <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                      <div className="flex items-center gap-3">
                        <Activity className="h-5 w-5 text-purple-600" />
                        <div>
                          <div className="font-medium">Run Practice Drills</div>
                          <p className="text-sm text-slate-500">Test your team's response capabilities</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-slate-400" />
                    </div>
                  </Link>
                  <Link href="/intelligence">
                    <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                      <div className="flex items-center gap-3">
                        <Radio className="h-5 w-5 text-amber-600" />
                        <div>
                          <div className="font-medium">Configure Triggers</div>
                          <p className="text-sm text-slate-500">Set up monitoring across 16 signal categories</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-slate-400" />
                    </div>
                  </Link>
                  <Link href="/operating-model">
                    <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors" data-testid="link-operating-model">
                      <div className="flex items-center gap-3">
                        <Layers className="h-5 w-5 text-indigo-600" />
                        <div>
                          <div className="font-medium">Operating Model Alignment</div>
                          <p className="text-sm text-slate-500">Map your structure to M's 166 playbooks using McKinsey's framework</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-slate-400" />
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
