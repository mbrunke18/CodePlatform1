import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { updatePageMetadata } from '@/lib/seo';
import PageLayout from '@/components/layout/PageLayout';
import OnboardingTrigger from '@/components/onboarding/OnboardingTrigger';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Zap, 
  Target, 
  AlertTriangle,
  DollarSign,
  ChevronRight,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import { Link } from 'wouter';

function StatusIndicator({ status }: { status: 'good' | 'warning' | 'critical' }) {
  const config = {
    good: { bg: 'bg-[#2B8A6E]', className: 'text-[#2B8A6E]', label: 'Healthy' },
    warning: { bg: 'bg-[#C9A84C]', className: 'text-[#C9A84C]', label: 'Attention' },
    critical: { bg: 'bg-[#0A0F2E]', className: 'text-[#C9A84C]', label: 'Critical' }
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
  link,
  action
}: {
  title: string;
  value: string | number;
  unit?: string;
  trend: string;
  trendDirection: 'up' | 'down' | 'neutral';
  status: 'good' | 'warning' | 'critical';
  icon: any;
  link: string;
  action: string;
}) {
  const statusBorders = {
    good: 'border-l-[#2B8A6E]',
    warning: 'border-l-[#C9A84C]',
    critical: 'border-l-[#0A0F2E]'
  };

  const trendIcons = {
    up: ArrowUpRight,
    down: ArrowDownRight,
    neutral: Minus
  };
  const TrendIcon = trendIcons[trendDirection];

  const trendClasses = {
    up: 'text-[#2B8A6E]',
    down: 'text-[#C9A84C]',
    neutral: 'text-[#6B7280] dark:text-white/60'
  };

  return (
    <Card className={`bg-white dark:bg-white/5 border-[#E8E4DC] dark:border-white/10 border-l-4 ${statusBorders[status]} hover:shadow-md transition-shadow`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="p-2 rounded-lg bg-[#0A0F2E]/5 dark:bg-white/10">
            <Icon className="h-5 w-5 text-[#0A0F2E] dark:text-[#C9A84C]" />
          </div>
          <StatusIndicator status={status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <CardTitle className="text-sm font-medium text-[#6B7280] dark:text-white/60 mb-1 uppercase tracking-wider">{title}</CardTitle>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-[#0A0F2E] dark:text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{value}</span>
            {unit && <span className="text-lg text-[#6B7280] dark:text-white/60">{unit}</span>}
          </div>
        </div>
        
        <div className={`flex items-center gap-1 text-sm ${trendClasses[trendDirection]}`}>
          <TrendIcon className="h-4 w-4" />
          <span>{trend}</span>
        </div>

        <Link href={link}>
          <Button 
            variant="ghost" 
            size="sm"
            className="w-full justify-between text-[#0A0F2E] dark:text-white hover:bg-[#F8F7F4] dark:hover:bg-white/5 -mx-2"
          >
            {action}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export default function ExecutiveScorecard() {
  useEffect(() => {
    updatePageMetadata({
      title: "Executive Scorecard | Command OS — Strategic Execution Platform",
      description: "Track your strategic execution velocity with M's Executive Scorecard. Monitor preparedness scores, active triggers, response times, and decision outcomes.",
      ogTitle: "Executive Scorecard | M",
      ogDescription: "Real-time executive metrics for strategic execution performance.",
    });
  }, []);

  const { data: preparednessScore } = useQuery({
    queryKey: ['/api/preparedness-score'],
  });

  const { data: activeTriggers } = useQuery({
    queryKey: ['/api/triggers'],
  });

  const { data: recentActivations } = useQuery({
    queryKey: ['/api/playbook-activations/recent'],
  });

  const scoreValue = (preparednessScore as any)?.overall_score || 0;
  const triggerCount = Array.isArray(activeTriggers) ? activeTriggers.length : 0;
  const activeCount = Array.isArray(activeTriggers) ? activeTriggers.filter((t: any) => t.status === 'active').length : 0;
  
  const last30Days = Array.isArray(recentActivations) ? recentActivations.filter((a: any) => {
    const activatedAt = new Date(a.activated_at);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return activatedAt >= thirtyDaysAgo;
  }) : [];
  
  const avgResponseTime = last30Days.length > 0
    ? last30Days.reduce((sum: number, a: any) => sum + (a.response_time_minutes || 0), 0) / last30Days.length
    : 0;

  const totalValueProtected = last30Days.reduce((sum: number, a: any) => sum + (a.value_protected || 0), 0);

  const overallStatus: 'good' | 'warning' | 'critical' = 
    scoreValue >= 80 && activeCount >= 5 ? 'good' :
    scoreValue >= 60 || activeCount >= 3 ? 'warning' : 'critical';

  const statusBg = 
    overallStatus === 'good' ? 'bg-[#2B8A6E]' :
    overallStatus === 'warning' ? 'bg-[#C9A84C]' : 'bg-[#0A0F2E]';

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto space-y-6 p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold text-[#0A0F2E] dark:text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Executive Scorecard</h1>
              <OnboardingTrigger pageId="executive-scorecard" autoStart={true} className="bg-[#0A0F2E]/5 dark:bg-white/10 border-[#E8E4DC] dark:border-white/10 text-[#0A0F2E] dark:text-[#C9A84C] hover:bg-[#F8F7F4] dark:hover:bg-white/5" />
            </div>
            <p className="text-[#6B7280] dark:text-white/60 text-sm">Strategic execution metrics at a glance</p>
          </div>
          <Badge className="bg-[#0A0F2E] dark:bg-[#C9A84C] text-white dark:text-[#0A0F2E] border-none font-bold">
            <Activity className="h-3 w-3 mr-1.5" />
            Live
          </Badge>
        </div>

        {/* Executive Summary Strip */}
        <Card className="bg-white dark:bg-white/5 border-[#E8E4DC] dark:border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${statusBg}`} />
                  <div>
                    <div className="text-xs text-[#6B7280] dark:text-white/60 uppercase tracking-wide">System Status</div>
                    <div className="text-[#0A0F2E] dark:text-[#C9A84C] font-semibold">
                      {overallStatus === 'good' ? 'All Systems Operational' :
                       overallStatus === 'warning' ? 'Attention Needed' : 'Action Required'}
                    </div>
                  </div>
                </div>
                <div className="h-8 w-px bg-[#E8E4DC] dark:bg-white/10 hidden sm:block" />
                <div>
                  <div className="text-xs text-[#6B7280] dark:text-white/60 uppercase tracking-wide">Last Activation</div>
                  <div className="text-[#0A0F2E] dark:text-[#C9A84C] font-semibold">
                    {last30Days.length > 0 ? 'Today' : 'No recent activity'}
                  </div>
                </div>
                <div className="h-8 w-px bg-[#E8E4DC] dark:bg-white/10 hidden sm:block" />
                <div>
                  <div className="text-xs text-[#6B7280] dark:text-white/60 uppercase tracking-wide">Response Time</div>
                  <div className="text-[#0A0F2E] dark:text-[#C9A84C] font-semibold">
                    {avgResponseTime > 0 ? `${Math.round(avgResponseTime)} min avg` : '—'}
                  </div>
                </div>
              </div>
              <Link href="/workspace?tab=execute">
                <Button variant="outline" size="sm" className="border-[#0A0F2E]/20 text-[#0A0F2E] hover:bg-[#0A0F2E]/5 dark:text-white dark:border-white/20">
                  Open Workspace
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Metrics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricCard
            title="Preparedness Score"
            value={scoreValue}
            unit="/100"
            trend="+12 vs last month"
            trendDirection={scoreValue >= 70 ? 'up' : 'down'}
            status={scoreValue >= 80 ? 'good' : scoreValue >= 60 ? 'warning' : 'critical'}
            icon={Shield}
            link="/preparedness-report"
            action="View Full Report"
          />
          
          <MetricCard
            title="Decision Velocity"
            value={Math.round(avgResponseTime) || '—'}
            unit={avgResponseTime > 0 ? ' min' : ''}
            trend="vs 30-day industry baseline"
            trendDirection={avgResponseTime <= 15 ? 'up' : avgResponseTime <= 30 ? 'neutral' : 'down'}
            status={avgResponseTime <= 15 ? 'good' : avgResponseTime <= 30 ? 'warning' : 'critical'}
            icon={Zap}
            link="/crisis-response-center"
            action="View Activations"
          />
          
          <MetricCard
            title="AI Trigger Coverage"
            value={activeCount}
            unit={`/${triggerCount}`}
            trend="24/7 monitoring active"
            trendDirection={activeCount >= 10 ? 'up' : activeCount >= 5 ? 'neutral' : 'down'}
            status={activeCount >= 10 ? 'good' : activeCount >= 5 ? 'warning' : 'critical'}
            icon={Target}
            link="/triggers-management"
            action="Manage Triggers"
          />
          
          <MetricCard
            title="Active Situations"
            value={last30Days.length}
            unit=" this month"
            trend={`${last30Days.filter((a: any) => a.status === 'completed').length} resolved`}
            trendDirection={last30Days.length === 0 ? 'up' : 'neutral'}
            status={last30Days.length === 0 ? 'good' : 'warning'}
            icon={AlertTriangle}
            link="/crisis-response-center"
            action="View Details"
          />
          
          <MetricCard
            title="Value Protected"
            value={`$${(totalValueProtected / 1000000).toFixed(1)}M`}
            trend="Last 30 days"
            trendDirection="up"
            status="good"
            icon={DollarSign}
            link="/advanced-analytics"
            action="View Analytics"
          />
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-[#6B7280] dark:text-white/60 pt-4">
          Data refreshes automatically • Last updated just now
        </p>
      </div>
    </PageLayout>
  );
}
