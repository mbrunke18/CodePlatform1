import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  TrendingUp, 
  Clock, 
  MessageSquare, 
  Users, 
  Zap,
  GitBranch,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  History
} from "lucide-react";
import { format } from "date-fns";

interface PlaybookLearning {
  id: string;
  scenarioId: string;
  executionInstanceId: string;
  learning: string;
  category: string;
  impact: string;
  confidence: string;
  status: string;
  extractedAt: string;
  appliedAt?: string;
}

interface PlaybookVersion {
  id: string;
  scenarioId: string;
  versionNumber: number;
  changes: string[];
  createdAt: string;
  createdBy: string;
  metadata: Record<string, any>;
}

interface PlaybookLearningsPanelProps {
  scenarioId: string;
}

export default function PlaybookLearningsPanel({ scenarioId }: PlaybookLearningsPanelProps) {
  const { data: learnings = [], isLoading: learningsLoading } = useQuery<PlaybookLearning[]>({
    queryKey: ['/api/dynamic-strategy/playbook-learnings', scenarioId],
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'communication': return <MessageSquare className="h-4 w-4" />;
      case 'timing': return <Clock className="h-4 w-4" />;
      case 'resource_allocation': return <Users className="h-4 w-4" />;
      case 'escalation': return <Zap className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'communication': return 'text-blue-600 dark:text-blue-400';
      case 'timing': return 'text-purple-600 dark:text-purple-400';
      case 'resource_allocation': return 'text-green-600 dark:text-green-400';
      case 'escalation': return 'text-red-600 dark:text-red-400';
      default: return 'text-slate-600 dark:text-slate-400';
    }
  };

  const getImpactBadge = (impact: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      high: 'destructive',
      medium: 'default',
      low: 'secondary'
    };
    return variants[impact] || 'outline';
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: 'outline',
      under_review: 'default',
      applied: 'secondary',
      rejected: 'destructive'
    };
    return variants[status] || 'outline';
  };

  // Ensure learnings is always an array
  const safeLearnings = learnings || [];

  // Group learnings by category
  const learningsByCategory = safeLearnings.reduce((acc, learning) => {
    const category = learning.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(learning);
    return acc;
  }, {} as Record<string, PlaybookLearning[]>);

  const categories = Object.keys(learningsByCategory);

  // Calculate learning stats
  const totalLearnings = safeLearnings.length;
  const appliedLearnings = safeLearnings.filter(l => l.status === 'applied').length;
  const pendingLearnings = safeLearnings.filter(l => l.status === 'pending' || l.status === 'under_review').length;
  const avgConfidence = safeLearnings.length > 0 
    ? safeLearnings.reduce((sum, l) => sum + parseFloat(l.confidence), 0) / safeLearnings.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Learning Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Learnings</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{totalLearnings}</p>
              </div>
              <Brain className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Applied</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{appliedLearnings}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Pending Review</p>
                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{pendingLearnings}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Avg Confidence</p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {(avgConfidence * 100).toFixed(0)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
            <Progress value={avgConfidence * 100} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Learnings by Category */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            AI-Extracted Learnings
          </CardTitle>
          <CardDescription>
            Automatically captured insights from past executions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {learningsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Brain className="h-12 w-12 text-slate-400 mx-auto mb-4 animate-pulse" />
                <p className="text-slate-600 dark:text-slate-400">Loading learnings...</p>
              </div>
            </div>
          ) : safeLearnings.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Lightbulb className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400">No learnings captured yet</p>
                <p className="text-sm text-slate-500 mt-2">
                  Execute this playbook to start building institutional knowledge
                </p>
              </div>
            </div>
          ) : (
            <Tabs defaultValue={categories[0] || 'all'} className="space-y-4">
              <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${categories.length}, 1fr)` }}>
                {categories.map((category) => (
                  <TabsTrigger 
                    key={category} 
                    value={category}
                    className="gap-2"
                    data-testid={`tab-learning-${category}`}
                  >
                    <span className={getCategoryColor(category)}>
                      {getCategoryIcon(category)}
                    </span>
                    <span className="capitalize">{category.replace('_', ' ')}</span>
                    <Badge variant="outline" className="ml-1">
                      {learningsByCategory[category].length}
                    </Badge>
                  </TabsTrigger>
                ))}
              </TabsList>

              {categories.map((category) => (
                <TabsContent key={category} value={category} className="space-y-4">
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-3">
                      {learningsByCategory[category].map((learning) => (
                        <Card key={learning.id} className="border-l-4" style={{
                          borderLeftColor: category === 'communication' ? '#3b82f6' :
                                         category === 'timing' ? '#a855f7' :
                                         category === 'resource_allocation' ? '#22c55e' :
                                         category === 'escalation' ? '#ef4444' : '#64748b'
                        }}>
                          <CardContent className="pt-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant={getStatusBadge(learning.status)}>
                                    {learning.status.replace('_', ' ')}
                                  </Badge>
                                  <Badge variant={getImpactBadge(learning.impact)}>
                                    {learning.impact} impact
                                  </Badge>
                                  <Badge variant="outline">
                                    {(parseFloat(learning.confidence) * 100).toFixed(0)}% confidence
                                  </Badge>
                                </div>
                                <p className="text-slate-900 dark:text-white font-medium">
                                  {learning.learning}
                                </p>
                                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {format(new Date(learning.extractedAt), 'PPp')}
                                  </span>
                                  {learning.appliedAt && (
                                    <span className="flex items-center gap-1 text-green-600">
                                      <CheckCircle2 className="h-3 w-3" />
                                      Applied {format(new Date(learning.appliedAt), 'PP')}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            {learning.status === 'pending' && (
                              <div className="flex gap-2 mt-3">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="gap-2"
                                  data-testid={`button-apply-learning-${learning.id}`}
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                  Apply to Playbook
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  data-testid={`button-review-learning-${learning.id}`}
                                >
                                  Review Later
                                </Button>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </CardContent>
      </Card>

      {/* Version History Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-purple-600" />
            Version History
          </CardTitle>
          <CardDescription>
            Track playbook evolution over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <History className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400">Version tracking coming soon</p>
              <p className="text-sm text-slate-500 mt-2">
                Playbook changes will be automatically versioned
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
