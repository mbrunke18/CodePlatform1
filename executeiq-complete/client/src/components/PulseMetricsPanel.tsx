import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Activity, Target, Users, Zap } from "lucide-react";

interface PulseMetric {
  id: string;
  metricName: string;
  value: string;
  unit: string;
  category: string;
  timestamp: string;
  metadata?: any;
}

export default function PulseMetricsPanel() {
  const [organizationId, setOrganizationId] = useState<string | null>(null);

  // Get user's organizations first
  const { data: organizations } = useQuery({
    queryKey: ["/api/organizations"],
    enabled: true
  });

  useEffect(() => {
    if (organizations && Array.isArray(organizations) && organizations.length > 0) {
      setOrganizationId(organizations[0].id);
    }
  }, [organizations]);

  const { data: metrics, isLoading } = useQuery({
    queryKey: [`/api/pulse-metrics/${organizationId}/latest`],
    enabled: !!organizationId
  });

  const getMetricIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'performance': return <Target className="h-4 w-4" />;
      case 'productivity': return <Zap className="h-4 w-4" />;
      case 'innovation': return <TrendingUp className="h-4 w-4" />;
      case 'culture': return <Users className="h-4 w-4" />;
      case 'strategy': return <Activity className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getMetricColor = (value: number) => {
    if (value >= 8) return "text-green-600 bg-green-50";
    if (value >= 6) return "text-yellow-600 bg-yellow-50"; 
    return "text-red-600 bg-red-50";
  };

  const formatMetricValue = (value: string, unit: string) => {
    const numValue = parseFloat(value);
    if (unit === 'percentage') return `${numValue.toFixed(1)}%`;
    if (unit === 'score') return `${numValue.toFixed(1)}/10`;
    return `${numValue.toFixed(1)} ${unit}`;
  };

  if (isLoading) {
    return (
      <Card data-testid="pulse-metrics-panel" className="h-80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Pulse Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-2 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="pulse-metrics-panel" className="h-80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Pulse Metrics
        </CardTitle>
        <CardDescription>
          Real-time organizational health indicators
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {metrics && Array.isArray(metrics) && metrics.length > 0 ? (
          metrics.slice(0, 4).map((metric: PulseMetric) => {
            const value = parseFloat(metric.value);
            const progressValue = (value / 10) * 100;
            
            return (
              <div key={metric.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`p-2 rounded-lg ${getMetricColor(value)}`}>
                    {getMetricIcon(metric.category)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium" data-testid={`metric-name-${metric.metricName.replace(/\s+/g, '-').toLowerCase()}`}>
                        {metric.metricName}
                      </span>
                      <span className="text-sm text-muted-foreground" data-testid={`metric-value-${metric.metricName.replace(/\s+/g, '-').toLowerCase()}`}>
                        {formatMetricValue(metric.value, metric.unit)}
                      </span>
                    </div>
                    <Progress value={progressValue} className="h-2" />
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No pulse metrics available</p>
            <p className="text-sm text-muted-foreground mt-1">
              Metrics will appear as data is collected
            </p>
          </div>
        )}
        
        {metrics && Array.isArray(metrics) && metrics.length > 0 && (
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Overall Health</span>
              <Badge variant="secondary" className="bg-blue-50 text-blue-700" data-testid="overall-health-score">
                {Array.isArray(metrics) && metrics.length > 0 ? 
                  `${(metrics.reduce((sum: number, m: PulseMetric) => sum + parseFloat(m.value), 0) / metrics.length).toFixed(1)}/10` 
                  : 'N/A'
                }
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}