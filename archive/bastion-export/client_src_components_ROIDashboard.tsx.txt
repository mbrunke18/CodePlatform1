import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface ROIMetrics {
  totalValueGenerated: number;
  totalCostAvoided: number;
  avgTimeToResolution: number;
  completedTasks: number;
  completedSimulations: number;
  efficiencyGains: number;
  qualityScore: number;
  monthlyTrend: number;
}

interface ValueEvent {
  id: string;
  eventType: string;
  entityType: string;
  valueGenerated: number;
  costAvoided: number;
  timeToResolution: number;
  qualityScore: number;
  createdAt: string;
  evidenceData?: any;
}

export default function ROIDashboard() {
  const { data: roiMetrics, isLoading: metricsLoading } = useQuery<ROIMetrics>({
    queryKey: ["/api/roi-metrics"],
    refetchInterval: 30000, // Update every 30 seconds
  });

  const { data: recentEvents, isLoading: eventsLoading } = useQuery<ValueEvent[]>({
    queryKey: ["/api/roi-events/recent"],
    refetchInterval: 30000,
  });

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);

  const formatNumber = (num: number) => 
    new Intl.NumberFormat('en-US').format(num);

  if (metricsLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-24 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!roiMetrics) {
    return (
      <div className="text-center text-muted-foreground p-8">
        ROI data unavailable. Complete strategic tasks and crisis simulations to see value metrics.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key ROI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Value Generated */}
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Value Generated</p>
                <p className="text-2xl font-bold text-green-600" data-testid="text-value-generated">
                  {formatCurrency(roiMetrics.totalValueGenerated)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  From strategic work completion
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-chart-line text-green-600 w-6"></i>
              </div>
            </div>
            {roiMetrics.monthlyTrend > 0 && (
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 font-medium">+{roiMetrics.monthlyTrend}%</span>
                <span className="text-muted-foreground ml-2">this month</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cost Avoided */}
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cost Avoided</p>
                <p className="text-2xl font-bold text-blue-600" data-testid="text-cost-avoided">
                  {formatCurrency(roiMetrics.totalCostAvoided)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  From crisis preparedness & efficiency
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-shield-alt text-blue-600 w-6"></i>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Efficiency Gains */}
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Efficiency Score</p>
                <p className="text-2xl font-bold text-purple-600" data-testid="text-efficiency-score">
                  {roiMetrics.qualityScore * 100}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Avg resolution: {roiMetrics.avgTimeToResolution}min
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-tachometer-alt text-purple-600 w-6"></i>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Strategic Activities */}
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed Activities</p>
                <p className="text-2xl font-bold text-orange-600" data-testid="text-activities-completed">
                  {formatNumber(roiMetrics.completedTasks + roiMetrics.completedSimulations)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {roiMetrics.completedTasks} tasks, {roiMetrics.completedSimulations} simulations
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-tasks text-orange-600 w-6"></i>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ROI Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <i className="fas fa-chart-pie text-primary w-5"></i>
              <span>ROI Value Sources</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-foreground">Strategic Task Completion</span>
                <span className="text-sm font-medium text-foreground">
                  {formatCurrency(roiMetrics.totalValueGenerated * 0.6)}
                </span>
              </div>
              <Progress value={60} className="h-2" />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-foreground">Crisis Preparedness</span>
                <span className="text-sm font-medium text-foreground">
                  {formatCurrency(roiMetrics.totalValueGenerated * 0.35)}
                </span>
              </div>
              <Progress value={35} className="h-2" />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-foreground">Process Optimization</span>
                <span className="text-sm font-medium text-foreground">
                  {formatCurrency(roiMetrics.totalValueGenerated * 0.05)}
                </span>
              </div>
              <Progress value={5} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Recent Value Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <i className="fas fa-clock text-primary w-5"></i>
              <span>Recent Value Creation</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {eventsLoading ? (
                <div className="text-sm text-muted-foreground">Loading recent activities...</div>
              ) : recentEvents && recentEvents.length > 0 ? (
                recentEvents.slice(0, 5).map((event) => (
                  <div key={event.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <i className={`fas ${
                          event.eventType === 'task_completed' ? 'fa-check' : 
                          event.eventType === 'crisis_simulation_completed' ? 'fa-shield-alt' : 
                          'fa-star'
                        } text-primary w-3`}></i>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {event.eventType === 'task_completed' ? 'Strategic Task Completed' :
                           event.eventType === 'crisis_simulation_completed' ? 'Crisis Simulation' :
                           'Strategic Activity'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(event.createdAt).toLocaleDateString()} • {event.timeToResolution}min
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="text-green-600 bg-green-50">
                        +{formatCurrency(event.valueGenerated)}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground text-center py-4">
                  Complete strategic tasks and crisis simulations to see value tracking here.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Executive Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <i className="fas fa-brain text-primary w-5"></i>
            <span>Strategic Intelligence ROI Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {((roiMetrics.totalValueGenerated / Math.max(roiMetrics.totalValueGenerated * 0.3, 1)) * 100 - 100).toFixed(0)}%
                </p>
                <p className="text-sm text-muted-foreground">Platform ROI</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{roiMetrics.avgTimeToResolution}min</p>
                <p className="text-sm text-muted-foreground">Avg Decision Speed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{(roiMetrics.qualityScore * 100).toFixed(0)}%</p>
                <p className="text-sm text-muted-foreground">Executive Efficiency</p>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Your strategic intelligence platform has generated <strong className="text-primary">
                {formatCurrency(roiMetrics.totalValueGenerated)}</strong> in measurable business value 
                through enhanced decision-making and crisis preparedness.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}