import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Heart, Users, TrendingUp, Shield, Lightbulb, Target } from "lucide-react";

interface CulturalMetric {
  id: string;
  dimension: string;
  score: string;
  trend: string;
  assessmentDate: string;
  factors?: any;
  recommendations?: any;
}

export default function CulturalAnalyticsPanel() {
  const [organizationId, setOrganizationId] = useState<string | null>(null);

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
    queryKey: [`/api/echo-cultural-metrics/${organizationId}/latest`],
    enabled: !!organizationId
  });

  const getDimensionIcon = (dimension: string) => {
    switch (dimension.toLowerCase()) {
      case 'psychological safety': return <Shield className="h-4 w-4" />;
      case 'innovation culture': return <Lightbulb className="h-4 w-4" />;
      case 'collaboration': return <Users className="h-4 w-4" />;
      case 'purpose alignment': return <Target className="h-4 w-4" />;
      case 'leadership trust': return <Heart className="h-4 w-4" />;
      default: return <TrendingUp className="h-4 w-4" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend.toLowerCase()) {
      case 'improving': return "text-green-600";
      case 'stable': return "text-blue-600";
      case 'declining': return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  if (isLoading) {
    return (
      <Card data-testid="cultural-analytics-panel" className="h-80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Cultural Analytics
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

  const overallHealth = metrics && Array.isArray(metrics) && metrics.length > 0 
    ? metrics.reduce((sum: number, m: CulturalMetric) => sum + parseFloat(m.score), 0) / metrics.length 
    : 0;

  return (
    <Card data-testid="cultural-analytics-panel" className="h-80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5" />
          Cultural Analytics
        </CardTitle>
        <CardDescription>
          Organizational culture health assessment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {metrics && Array.isArray(metrics) && metrics.length > 0 ? (
          <div className="space-y-3">
            {metrics.slice(0, 4).map((metric: CulturalMetric) => {
              const score = parseFloat(metric.score);
              const progressValue = (score / 10) * 100;
              
              return (
                <div key={metric.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                      {getDimensionIcon(metric.dimension)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium" data-testid={`dimension-${metric.dimension.replace(/\s+/g, '-').toLowerCase()}`}>
                          {metric.dimension}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${getScoreColor(score)}`} data-testid={`score-${metric.dimension.replace(/\s+/g, '-').toLowerCase()}`}>
                            {score.toFixed(1)}/10
                          </span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getTrendColor(metric.trend)}`}
                            data-testid={`trend-${metric.dimension.replace(/\s+/g, '-').toLowerCase()}`}
                          >
                            {metric.trend}
                          </Badge>
                        </div>
                      </div>
                      <Progress value={progressValue} className="h-2" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No cultural metrics available</p>
            <p className="text-sm text-muted-foreground mt-1">
              Cultural assessment data will appear here
            </p>
          </div>
        )}
        
        {metrics && Array.isArray(metrics) && metrics.length > 0 && (
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Cultural Health</span>
              <div className="flex items-center gap-2">
                <Badge 
                  variant="secondary" 
                  className={`${getScoreColor(overallHealth) === 'text-green-600' ? 'bg-green-50 text-green-700' : 
                              getScoreColor(overallHealth) === 'text-yellow-600' ? 'bg-yellow-50 text-yellow-700' : 
                              'bg-red-50 text-red-700'}`}
                  data-testid="cultural-health-score"
                >
                  {overallHealth.toFixed(1)}/10
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {overallHealth >= 8 ? 'Excellent' : overallHealth >= 6 ? 'Good' : 'Needs Attention'}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}