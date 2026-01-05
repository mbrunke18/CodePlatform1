import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Rocket, Lightbulb, Zap, CheckCircle, Clock, TrendingUp } from "lucide-react";

interface Innovation {
  id: string;
  title: string;
  description: string;
  category: string;
  stage: string;
  potential: string;
  createdAt: string;
  resources?: any;
  timeline?: any;
}

export default function InnovationPipelinePanel() {
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

  const { data: innovations, isLoading } = useQuery({
    queryKey: [`/api/nova-innovations/${organizationId}`],
    enabled: !!organizationId
  });

  const getStageIcon = (stage: string) => {
    switch (stage.toLowerCase()) {
      case 'ideation': return <Lightbulb className="h-4 w-4" />;
      case 'prototyping': return <Zap className="h-4 w-4" />;
      case 'testing': return <Clock className="h-4 w-4" />;
      case 'scaling': return <TrendingUp className="h-4 w-4" />;
      case 'deployed': return <CheckCircle className="h-4 w-4" />;
      default: return <Rocket className="h-4 w-4" />;
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage.toLowerCase()) {
      case 'ideation': return "bg-blue-50 text-blue-600";
      case 'prototyping': return "bg-yellow-50 text-yellow-600";
      case 'testing': return "bg-purple-50 text-purple-600";
      case 'scaling': return "bg-green-50 text-green-600";
      case 'deployed': return "bg-emerald-50 text-emerald-600";
      default: return "bg-gray-50 text-gray-600";
    }
  };

  const getPotentialColor = (potential: string) => {
    switch (potential.toLowerCase()) {
      case 'breakthrough': return "bg-red-50 text-red-700 border-red-200";
      case 'incremental': return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case 'sustaining': return "bg-blue-50 text-blue-700 border-blue-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStageProgress = (stage: string) => {
    switch (stage.toLowerCase()) {
      case 'ideation': return 20;
      case 'prototyping': return 40;
      case 'testing': return 60;
      case 'scaling': return 80;
      case 'deployed': return 100;
      default: return 0;
    }
  };

  if (isLoading) {
    return (
      <Card data-testid="innovation-pipeline-panel" className="h-80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5" />
            Innovation Pipeline
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

  const stageDistribution = innovations && Array.isArray(innovations) ? {
    ideation: innovations.filter((i: Innovation) => i.stage === 'ideation').length,
    prototyping: innovations.filter((i: Innovation) => i.stage === 'prototyping').length,
    testing: innovations.filter((i: Innovation) => i.stage === 'testing').length,
    scaling: innovations.filter((i: Innovation) => i.stage === 'scaling').length,
    deployed: innovations.filter((i: Innovation) => i.stage === 'deployed').length
  } : null;

  return (
    <Card data-testid="innovation-pipeline-panel" className="h-80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Rocket className="h-5 w-5" />
          Innovation Pipeline
        </CardTitle>
        <CardDescription>
          Innovation initiatives and development progress
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {innovations && Array.isArray(innovations) && innovations.length > 0 ? (
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {innovations.slice(0, 3).map((innovation: Innovation) => {
              const progress = getStageProgress(innovation.stage);
              
              return (
                <div 
                  key={innovation.id} 
                  className="p-3 rounded-lg border bg-card"
                  data-testid={`innovation-${innovation.title.replace(/\s+/g, '-').toLowerCase()}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded ${getStageColor(innovation.stage)}`}>
                        {getStageIcon(innovation.stage)}
                      </div>
                      <span className="font-medium text-sm" data-testid={`innovation-title-${innovation.id}`}>
                        {innovation.title}
                      </span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getPotentialColor(innovation.potential)}`}
                      data-testid={`potential-${innovation.id}`}
                    >
                      {innovation.potential}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2" data-testid={`innovation-description-${innovation.id}`}>
                    {innovation.description && innovation.description.length > 100 
                      ? `${innovation.description.substring(0, 100)}...` 
                      : innovation.description
                    }
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <Badge variant="secondary" className={getStageColor(innovation.stage)} data-testid={`stage-${innovation.id}`}>
                        {innovation.stage}
                      </Badge>
                    </div>
                    <Progress value={progress} className="h-1.5" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Rocket className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No innovations in pipeline</p>
            <p className="text-sm text-muted-foreground mt-1">
              Innovation projects will appear as they are created
            </p>
          </div>
        )}
        
        {stageDistribution && (
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Pipeline Summary</span>
              <div className="flex gap-2" data-testid="pipeline-summary">
                <Badge variant="secondary" className="text-xs">
                  {Object.values(stageDistribution).reduce((a, b) => a + b, 0)} Total
                </Badge>
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                  {stageDistribution.deployed + stageDistribution.scaling} Active
                </Badge>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}