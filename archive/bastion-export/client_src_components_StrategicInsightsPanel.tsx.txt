import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Eye } from "lucide-react";

interface PrismInsight {
  id: string;
  insightType: string;
  title: string;
  content: string;
  confidence: string;
  createdAt: string;
  sources?: any;
}

export default function StrategicInsightsPanel() {
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

  const { data: insights, isLoading } = useQuery({
    queryKey: [`/api/prism-insights/${organizationId}/latest`],
    enabled: !!organizationId
  });

  const getInsightIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'strategic opportunity': return <TrendingUp className="h-4 w-4" />;
      case 'risk assessment': return <AlertTriangle className="h-4 w-4" />;
      case 'innovation catalyst': return <Lightbulb className="h-4 w-4" />;
      case 'market intelligence': return <Eye className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'strategic opportunity': return "bg-green-50 text-green-700 border-green-200";
      case 'risk assessment': return "bg-red-50 text-red-700 border-red-200";
      case 'innovation catalyst': return "bg-purple-50 text-purple-700 border-purple-200";
      case 'market intelligence': return "bg-blue-50 text-blue-700 border-blue-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "bg-green-100 text-green-800";
    if (confidence >= 0.6) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  if (isLoading) {
    return (
      <Card data-testid="strategic-insights-panel" className="h-96">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Strategic Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-16 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="strategic-insights-panel" className="h-96">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Strategic Insights
        </CardTitle>
        <CardDescription>
          AI-powered strategic intelligence and recommendations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights && Array.isArray(insights) && insights.length > 0 ? (
          <div className="space-y-3 max-h-72 overflow-y-auto">
            {insights.slice(0, 3).map((insight: PrismInsight) => {
              const confidence = parseFloat(insight.confidence);
              
              return (
                <div 
                  key={insight.id} 
                  className={`p-3 rounded-lg border ${getInsightColor(insight.insightType)}`}
                  data-testid={`insight-${insight.insightType.replace(/\s+/g, '-').toLowerCase()}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getInsightIcon(insight.insightType)}
                      <span className="font-medium text-sm" data-testid={`insight-title-${insight.id}`}>
                        {insight.title}
                      </span>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getConfidenceColor(confidence)}`}
                      data-testid={`confidence-${insight.id}`}
                    >
                      {(confidence * 100).toFixed(0)}%
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed" data-testid={`insight-content-${insight.id}`}>
                    {insight.content.length > 150 
                      ? `${insight.content.substring(0, 150)}...` 
                      : insight.content
                    }
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <Badge variant="outline" className="text-xs" data-testid={`insight-type-${insight.id}`}>
                      {insight.insightType}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No strategic insights available</p>
            <p className="text-sm text-muted-foreground mt-1">
              AI analysis will generate insights as data is processed
            </p>
          </div>
        )}
        
        {insights && Array.isArray(insights) && insights.length > 0 && (
          <div className="pt-4 border-t">
            <Button variant="outline" size="sm" className="w-full" data-testid="view-all-insights">
              View All Insights
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}