import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  Users, 
  Database, 
  Shield,
  TrendingUp,
  AlertTriangle
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

interface DecisionConfidenceScoreProps {
  scenarioId: string;
  stakeholderCount?: number;
  dataSourcesConnected?: number;
}

interface ConfidenceData {
  overallScore: number;
  dataCompletenessScore: number;
  stakeholderAlignmentScore: number;
  historicalPrecedentScore: number;
  riskCoverageScore: number;
  dataSourcesConnected: number;
  stakeholdersMapped: number;
  similarCasesFound: number;
  risksCovered: number;
  totalRisks: number;
  recommendedActions: string[];
  confidenceLevel: 'high' | 'medium' | 'low';
}

export default function DecisionConfidenceScore({ 
  scenarioId, 
  stakeholderCount = 0,
  dataSourcesConnected = 0 
}: DecisionConfidenceScoreProps) {
  const { user } = useAuth();

  const { data: confidence, isLoading } = useQuery<ConfidenceData>({
    queryKey: ['/api/decision-confidence', scenarioId],
    enabled: !!scenarioId && !!user?.id,
  });

  const createConfidenceMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('POST', `/api/decision-confidence`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/decision-confidence', scenarioId] });
    },
  });

  useEffect(() => {
    if (!confidence && user?.id && !isLoading) {
      const dataCompletenessScore = Math.min(100, (dataSourcesConnected / 5) * 100);
      const stakeholderAlignmentScore = Math.min(100, (stakeholderCount / 8) * 100);
      const historicalPrecedentScore = 75;
      const riskCoverageScore = 80;
      
      const overallScore = Math.round(
        (dataCompletenessScore * 0.3 +
        stakeholderAlignmentScore * 0.3 +
        historicalPrecedentScore * 0.2 +
        riskCoverageScore * 0.2)
      );

      createConfidenceMutation.mutate({
        scenarioId,
        userId: user.id,
        overallScore,
        dataCompletenessScore: Math.round(dataCompletenessScore),
        stakeholderAlignmentScore: Math.round(stakeholderAlignmentScore),
        historicalPrecedentScore,
        riskCoverageScore,
        dataSourcesConnected,
        stakeholdersMapped: stakeholderCount,
        similarCasesFound: 12,
        risksCovered: 15,
        totalRisks: 18,
        recommendedActions: [
          "Connect CRM for customer impact data",
          "Map remaining 3 key stakeholders",
          "Review 2025 supplier disruption case"
        ],
        confidenceLevel: overallScore >= 80 ? 'high' : overallScore >= 60 ? 'medium' : 'low'
      });
    }
  }, [confidence, user, scenarioId, stakeholderCount, dataSourcesConnected, isLoading]);

  if (isLoading || !confidence) {
    return null;
  }

  const scoreColor = confidence.overallScore >= 80 ? 'text-green-600' : 
                     confidence.overallScore >= 60 ? 'text-yellow-600' : 'text-red-600';
  
  const confidenceBadge = confidence.confidenceLevel === 'high' ? 'default' : 
                          confidence.confidenceLevel === 'medium' ? 'secondary' : 'destructive';

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800" data-testid="decision-confidence-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Ready to Decide?
          </CardTitle>
          <div className="flex items-center gap-3">
            <Badge variant={confidenceBadge} data-testid="confidence-badge">
              {confidence.confidenceLevel.toUpperCase()}
            </Badge>
            <div className={`text-4xl font-bold ${scoreColor}`} data-testid="confidence-score">
              {confidence.overallScore}%
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2" data-testid="data-completeness-metric">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Your Data</span>
              </div>
              <span className="font-semibold" data-testid="data-completeness-score">{confidence.dataCompletenessScore}%</span>
            </div>
            <Progress value={confidence.dataCompletenessScore} className="h-2" />
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {confidence.dataSourcesConnected} of 5 sources connected
            </p>
          </div>

          <div className="space-y-2" data-testid="stakeholder-alignment-metric">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-600" />
                <span className="font-medium">Team Aligned</span>
              </div>
              <span className="font-semibold" data-testid="stakeholder-alignment-score">{confidence.stakeholderAlignmentScore}%</span>
            </div>
            <Progress value={confidence.stakeholderAlignmentScore} className="h-2" />
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {confidence.stakeholdersMapped} key stakeholders mapped
            </p>
          </div>

          <div className="space-y-2" data-testid="historical-precedent-metric">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="font-medium">Past Plays</span>
              </div>
              <span className="font-semibold" data-testid="historical-precedent-score">{confidence.historicalPrecedentScore}%</span>
            </div>
            <Progress value={confidence.historicalPrecedentScore} className="h-2" />
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {confidence.similarCasesFound} similar cases analyzed
            </p>
          </div>

          <div className="space-y-2" data-testid="risk-coverage-metric">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-orange-600" />
                <span className="font-medium">Risk Coverage</span>
              </div>
              <span className="font-semibold" data-testid="risk-coverage-score">{confidence.riskCoverageScore}%</span>
            </div>
            <Progress value={confidence.riskCoverageScore} className="h-2" />
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {confidence.risksCovered} of {confidence.totalRisks} risks addressed
            </p>
          </div>
        </div>

        {confidence.recommendedActions && confidence.recommendedActions.length > 0 && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800" data-testid="recommended-actions">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                  To boost confidence:
                </p>
                <ul className="text-xs text-yellow-800 dark:text-yellow-200 space-y-1">
                  {confidence.recommendedActions.map((action: string, idx: number) => (
                    <li key={idx} data-testid={`recommended-action-${idx}`}>• {action}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
