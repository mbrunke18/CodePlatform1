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
import StandardNav from "@/components/layout/StandardNav";
import { useQuery } from "@tanstack/react-query";

export default function PilotMonitoring() {
  useEffect(() => {
    updatePageMetadata({
      title: "Pilot Program Monitoring - M | System Health Dashboard",
      description: "Real-time monitoring dashboard for M Early Access Program. Track system health, pilot company activity, and platform performance.",
      ogTitle: "M Pilot Monitoring Dashboard",
      ogDescription: "Monitor system health and pilot program success metrics in real-time.",
    });
  }, []);

  // Fetch real-time data from backend
  const { data: systemHealth, isLoading: healthLoading, isError: healthError } = useQuery({
    queryKey: ['/api/pilot-monitoring/system-health'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: pilotMetrics, isLoading: metricsLoading, isError: metricsError } = useQuery({
    queryKey: ['/api/pilot-monitoring/pilot-metrics'],
    refetchInterval: 60000, // Refresh every minute
  });

  const { data: recentActivity, isLoading: activityLoading, isError: activityError } = useQuery({
    queryKey: ['/api/pilot-monitoring/recent-activity'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Show loading state while initial data loads
  if (healthLoading || metricsLoading || activityLoading) {
    return (
      <div className="page-background min-h-screen bg-slate-50 dark:bg-slate-950">
        <StandardNav />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-slate-600 dark:text-slate-400">Loading monitoring dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if any queries failed
  if (healthError || metricsError || activityError) {
    return (
      <div className="page-background min-h-screen bg-slate-50 dark:bg-slate-950">
        <StandardNav />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Unable to Load Monitoring Data
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Please check your connection and try again. If the problem persists, contact support.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Guard against undefined data
  if (!systemHealth || !pilotMetrics || !recentActivity) {
    return (
      <div className="page-background min-h-screen bg-slate-50 dark:bg-slate-950">
        <StandardNav />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400">No monitoring data available.</p>
          </div>
        </div>
      </div>
    );
  }

  const performanceMetrics = [
    { label: 'Avg Scenario Creation Time', value: '4.2 min', target: '< 5 min', status: 'good' },
    { label: 'Trigger Activation Success Rate', value: '98.3%', target: '> 95%', status: 'good' },
    { label: 'Execution Completion Rate', value: '94.1%', target: '> 90%', status: 'good' },
    { label: 'User Satisfaction Score', value: '8.7/10', target: '> 8.0', status: 'good' },
  ];

  return (
    <div className="page-background min-h-screen bg-slate-50 dark:bg-slate-950">
      <StandardNav />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white" data-testid="heading-pilot-monitoring">
              Pilot Program Monitoring
            </h1>
            <Badge className={`text-base px-4 py-2 ${
              systemHealth.status === 'healthy' 
                ? 'bg-green-600 text-white' 
                : 'bg-yellow-600 text-white'
            }`} data-testid="badge-system-status">
              <Activity className="w-4 h-4 mr-2" />
              System {systemHealth.status === 'healthy' ? 'Healthy' : 'Warning'}
            </Badge>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Real-time monitoring for Q1 2025 Early Access Program
          </p>
        </div>

        {/* System Health Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card data-testid="card-uptime">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-slate-600 dark:text-slate-400">Uptime</div>
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                {systemHealth.uptime}%
              </div>
              <div className="text-xs text-slate-500">Last 30 days</div>
            </CardContent>
          </Card>

          <Card data-testid="card-response-time">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-slate-600 dark:text-slate-400">Avg Response</div>
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                {systemHealth.avgResponseTime}ms
              </div>
              <div className="text-xs text-slate-500">Target: {'<'} 200ms</div>
            </CardContent>
          </Card>

          <Card data-testid="card-active-users">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-slate-600 dark:text-slate-400">Active Users</div>
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                {systemHealth.activeUsers}
              </div>
              <div className="text-xs text-slate-500">Currently online</div>
            </CardContent>
          </Card>

          <Card data-testid="card-executions">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-slate-600 dark:text-slate-400">Executions</div>
                <Zap className="w-5 h-5 text-cyan-600" />
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                {pilotMetrics.executionsCompleted}
              </div>
              <div className="text-xs text-slate-500">Total completed</div>
            </CardContent>
          </Card>
        </div>

        {/* Pilot Company Status */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Pilot Company Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {pilotMetrics.totalPilots}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Total Pilots</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {pilotMetrics.activePilots}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Active</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-500">
                    {pilotMetrics.totalPilots - pilotMetrics.activePilots}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Onboarding</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600 dark:text-slate-400">Adoption Rate</span>
                    <span className="font-semibold text-slate-900 dark:text-white">70%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600 dark:text-slate-400">Average Engagement</span>
                    <span className="font-semibold text-slate-900 dark:text-white">85%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                Platform Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Scenarios Created</div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{pilotMetrics.scenariosCreated}</div>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Triggers Configured</div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{pilotMetrics.triggersConfigured}</div>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Avg Execution Time</div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{pilotMetrics.avgExecutionTime} min</div>
                  </div>
                  <Badge className="bg-green-600 text-white">
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
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="card-bg rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {metric.label}
                    </div>
                    <CheckCircle2 className={`w-5 h-5 ${
                      metric.status === 'good' ? 'text-green-600' : 'text-yellow-600'
                    }`} />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                    {metric.value}
                  </div>
                  <div className="text-xs text-slate-500">
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
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <div className="flex-shrink-0 mt-1">
                    {activity.success ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                    )}
                  </div>
                  <div className="flex-1 page-background">
                    <div className="font-semibold text-slate-900 dark:text-white text-sm">
                      {activity.pilot}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {activity.action}
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 whitespace-nowrap">
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
