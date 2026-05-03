import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Activity,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Users,
  Zap,
  Clock,
  BarChart3
} from "lucide-react";
import { useEffect } from "react";
import { updatePageMetadata } from "@/lib/seo";
import PageLayout from "@/components/layout/PageLayout";
import { useQuery } from "@tanstack/react-query";

export default function FoundingPartnerMonitoring() {
  useEffect(() => {
    updatePageMetadata({
      title: "Founding Partner Monitoring - Readiness OS | System Health Dashboard",
      description: "Real-time monitoring dashboard for Readiness OS Founding Partner Program. Track system health, partner company activity, and platform performance.",
      ogTitle: "Readiness OS Founding Partner Monitoring Dashboard",
      ogDescription: "Monitor system health and Founding Partner Program success metrics in real-time.",
    });
  }, []);

  // Fetch real-time data from backend
  const { data: systemHealth, isLoading: healthLoading, isError: healthError } = useQuery<any>({
    queryKey: ['/api/pilot-monitoring/system-health'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: pilotMetrics, isLoading: metricsLoading, isError: metricsError } = useQuery<any>({
    queryKey: ['/api/pilot-monitoring/pilot-metrics'],
    refetchInterval: 60000, // Refresh every minute
  });

  const { data: recentActivity, isLoading: activityLoading, isError: activityError } = useQuery<any[]>({
    queryKey: ['/api/pilot-monitoring/recent-activity'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Show loading state while initial data loads
  if (healthLoading || metricsLoading || activityLoading) {
    return (
      <PageLayout>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center py-12">
            <div className="animate-spin h-12 w-12 border-b-2 border-[#C9A84C] mx-auto"></div>
            <p className="mt-4 text-gray-800 dark:text-slate-300">Loading monitoring dashboard...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Show error state if any queries failed
  if (healthError || metricsError || activityError) {
    return (
      <PageLayout>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-red-700 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Unable to Load Monitoring Data
            </h2>
            <p className="text-gray-800 dark:text-slate-300">
              Please check your connection and try again. If the problem persists, contact support.
            </p>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Guard against undefined data
  if (!systemHealth || !pilotMetrics || !recentActivity) {
    return (
      <PageLayout>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center py-12">
            <p className="text-gray-800 dark:text-slate-300">No monitoring data available.</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  const performanceMetrics = [
    { label: 'Avg Scenario Creation Time', value: '4.2 min', target: '< 5 min', status: 'good' },
    { label: 'Trigger Activation Success Rate', value: '98.3%', target: '> 95%', status: 'good' },
    { label: 'Execution Completion Rate', value: '94.1%', target: '> 90%', status: 'good' },
    { label: 'User Satisfaction Score', value: '8.7/10', target: '> 8.0', status: 'good' },
  ];

  return (
    <PageLayout>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold text-[#0A0F2E] dark:text-white" data-testid="heading-pilot-monitoring">
              Founding Partner Monitoring
            </h1>
            <Badge className={`text-base px-4 py-2 ${
              systemHealth.status === 'healthy' 
                ? 'bg-[#2B8A6E] text-white' 
                : 'bg-[#C9A84C] text-[#0A0F2E]'
            }`} data-testid="badge-system-status">
              <Activity className="w-4 h-4 mr-2" />
              System {systemHealth.status === 'healthy' ? 'Healthy' : 'Warning'}
            </Badge>
          </div>
          <p className="text-lg text-gray-800 dark:text-slate-300">
            Real-time monitoring for Founding Partner Early Access Program
          </p>
        </div>

        {/* System Health Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card data-testid="card-uptime">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-800 dark:text-slate-300">Uptime</div>
                <CheckCircle2 className="w-5 h-5 text-[#2B8A6E]" />
              </div>
              <div className="text-3xl font-bold text-[#0A0F2E] dark:text-white mb-1">
                {systemHealth.uptime}%
              </div>
              <div className="text-xs text-gray-800">Last 30 days</div>
            </CardContent>
          </Card>

          <Card data-testid="card-response-time">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-800 dark:text-slate-300">Avg Response</div>
                <Clock className="w-5 h-5 text-[#0A0F2E]" />
              </div>
              <div className="text-3xl font-bold text-[#0A0F2E] dark:text-white mb-1">
                {systemHealth.avgResponseTime}ms
              </div>
              <div className="text-xs text-gray-800">Target: {'<'} 200ms</div>
            </CardContent>
          </Card>

          <Card data-testid="card-active-users">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-800 dark:text-slate-300">Active Users</div>
                <Users className="w-5 h-5 text-[#C9A84C]" />
              </div>
              <div className="text-3xl font-bold text-[#0A0F2E] dark:text-white mb-1">
                {systemHealth.activeUsers}
              </div>
              <div className="text-xs text-gray-800">Currently online</div>
            </CardContent>
          </Card>

          <Card data-testid="card-executions">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-800 dark:text-slate-300">Executions</div>
                <Zap className="w-5 h-5 text-[#2B8A6E]" />
              </div>
              <div className="text-3xl font-bold text-[#0A0F2E] dark:text-white mb-1">
                {pilotMetrics.executionsCompleted}
              </div>
              <div className="text-xs text-gray-800">Total completed</div>
            </CardContent>
          </Card>
        </div>

        {/* Pilot Company Status */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#0A0F2E]">
                <Users className="w-5 h-5 text-[#0A0F2E]" />
                Pilot Company Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <div className="text-2xl font-bold text-[#0A0F2E] dark:text-white">
                    {pilotMetrics.totalPilots}
                  </div>
                  <div className="text-sm text-gray-800 dark:text-slate-300">Total Pilots</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#2B8A6E]">
                    {pilotMetrics.activePilots}
                  </div>
                  <div className="text-sm text-gray-800 dark:text-slate-300">Active</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">
                    {pilotMetrics.totalPilots - pilotMetrics.activePilots}
                  </div>
                  <div className="text-sm text-gray-800 dark:text-slate-300">Onboarding</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-800 dark:text-slate-300">Adoption Rate</span>
                    <span className="font-semibold text-[#0A0F2E] dark:text-white">70%</span>
                  </div>
                  <div className="w-full bg-[#E8E4DC] dark:bg-[#141B45] h-2">
                    <div className="bg-[#2B8A6E] h-2" style={{ width: '70%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-800 dark:text-slate-300">Average Engagement</span>
                    <span className="font-semibold text-[#0A0F2E] dark:text-white">85%</span>
                  </div>
                  <div className="w-full bg-[#E8E4DC] dark:bg-[#141B45] h-2">
                    <div className="bg-[#0A0F2E] h-2" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#0A0F2E]">
                <BarChart3 className="w-5 h-5 text-[#C9A84C]" />
                Platform Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-800 dark:text-slate-300">Scenarios Created</div>
                    <div className="text-2xl font-bold text-[#0A0F2E] dark:text-white">{pilotMetrics.scenariosCreated}</div>
                  </div>
                  <TrendingUp className="w-8 h-8 text-[#2B8A6E]" />
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-800 dark:text-slate-300">Triggers Configured</div>
                    <div className="text-2xl font-bold text-[#0A0F2E] dark:text-white">{pilotMetrics.triggersConfigured}</div>
                  </div>
                  <TrendingUp className="w-8 h-8 text-[#0A0F2E]" />
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-800 dark:text-slate-300">Avg Execution Time</div>
                    <div className="text-2xl font-bold text-[#0A0F2E] dark:text-white">{pilotMetrics.avgExecutionTime} min</div>
                  </div>
                  <Badge className="bg-[#2B8A6E] text-white">
                    Target: 12 min
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-[#0A0F2E]">Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="bg-[#F8F7F4] dark:bg-[#141B45] p-4 border border-[#E8E4DC]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {metric.label}
                    </div>
                    <CheckCircle2 className={`w-5 h-5 ${
                      metric.status === 'good' ? 'text-[#2B8A6E]' : 'text-[#C9A84C]'
                    }`} />
                  </div>
                  <div className="text-2xl font-bold text-[#0A0F2E] dark:text-white mb-1">
                    {metric.value}
                  </div>
                  <div className="text-xs text-gray-800">
                    Target: {metric.target}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#0A0F2E]">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-[#F8F7F4] dark:bg-[#0A0F2E] border border-[#E8E4DC]">
                  <div className="flex-shrink-0 mt-1">
                    {activity.success ? (
                      <CheckCircle2 className="w-5 h-5 text-[#2B8A6E]" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-[#C9A84C]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-[#0A0F2E] dark:text-white text-sm">
                      {activity.pilot}
                    </div>
                    <div className="text-sm text-gray-800 dark:text-slate-300">
                      {activity.action}
                    </div>
                  </div>
                  <div className="text-xs text-gray-800 whitespace-nowrap">
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
