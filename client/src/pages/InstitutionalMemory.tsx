import PageLayout from '@/components/layout/PageLayout';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, BookOpen, TrendingUp, Award, AlertCircle, CheckCircle } from 'lucide-react';

export default function InstitutionalMemory() {
  const { data: decisionOutcomesData, isLoading: outcomesLoading } = useQuery<any[]>({
    queryKey: ['/api/decision-outcomes'],
  });

  const { data: learningPatternsData, isLoading: patternsLoading } = useQuery<any[]>({
    queryKey: ['/api/learning-patterns'],
  });

  const { data: institutionalKnowledgeData, isLoading: knowledgeLoading } = useQuery<any[]>({
    queryKey: ['/api/institutional-memory'],
  });

  const decisionOutcomes = decisionOutcomesData ?? [];
  const learningPatterns = learningPatternsData ?? [];
  const institutionalKnowledge = institutionalKnowledgeData ?? [];

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case 'successful': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'partially_successful': return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'failed': return <AlertCircle className="h-5 w-5 text-red-500" />;
      default: return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <PageLayout>
      <div className="space-y-6 p-6">
        {/* V2 Feature Banner */}
      <div className="bg-blue-50 dark:bg-blue-950/30 border-2 border-blue-300 dark:border-blue-700 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold">Coming in V2</Badge>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            This feature launches after you run real crises. Institutional Memory learns from your outcomes to make smarter recommendations.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2" data-testid="page-title">
            <Brain className="h-8 w-8 text-purple-500" />
            Institutional Memory
          </h1>
          <p className="text-muted-foreground mt-1">
            Learn from past decisions and continuously improve AI recommendations
          </p>
        </div>
        <Button data-testid="button-record-learning">
          <BookOpen className="h-4 w-4 mr-2" />
          Record New Learning
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card data-testid="card-decisions-tracked">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Decisions Tracked</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{decisionOutcomes.length}</div>
            <p className="text-xs text-muted-foreground">
              Historical decision records
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-patterns-identified">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patterns Identified</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{learningPatterns.length}</div>
            <p className="text-xs text-muted-foreground">
              AI-discovered insights
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-knowledge-base">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Knowledge Base</CardTitle>
            <Award className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{institutionalKnowledge.length}</div>
            <p className="text-xs text-muted-foreground">
              Documented learnings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="outcomes" className="space-y-4">
        <TabsList data-testid="tabs-memory-sections">
          <TabsTrigger value="outcomes" data-testid="tab-outcomes">Decision Outcomes</TabsTrigger>
          <TabsTrigger value="patterns" data-testid="tab-patterns">Learning Patterns</TabsTrigger>
          <TabsTrigger value="knowledge" data-testid="tab-knowledge">Knowledge Base</TabsTrigger>
        </TabsList>

        <TabsContent value="outcomes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Decision Outcomes History</CardTitle>
              <CardDescription>
                Track effectiveness and lessons learned from past executive decisions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {outcomesLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading outcomes...</div>
              ) : decisionOutcomes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p>No decision outcomes recorded yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {decisionOutcomes.map((outcome: any) => (
                    <div 
                      key={outcome.id} 
                      className="border rounded-lg p-4 space-y-3"
                      data-testid={`outcome-${outcome.id}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 page-background space-y-2">
                          <div className="flex items-center gap-2">
                            {getOutcomeIcon(outcome.outcomeType)}
                            <h3 className="font-semibold" data-testid={`text-outcome-type-${outcome.id}`}>
                              {outcome.decisionType}
                            </h3>
                            <Badge variant="outline">{outcome.outcomeType}</Badge>
                          </div>
                          <p className="text-sm">{outcome.decisionDescription}</p>
                          {outcome.lessonsLearned && (
                            <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-md">
                              <p className="text-sm font-medium mb-1">Lessons Learned:</p>
                              <p className="text-sm text-muted-foreground">{outcome.lessonsLearned}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI-Discovered Learning Patterns</CardTitle>
              <CardDescription>
                Patterns identified from historical data to improve future recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {patternsLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading patterns...</div>
              ) : learningPatterns.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p>No patterns identified yet - Need more decision history</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {learningPatterns.map((pattern: any) => (
                    <div 
                      key={pattern.id} 
                      className="border rounded-lg p-4 space-y-2"
                      data-testid={`pattern-${pattern.id}`}
                    >
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{pattern.patternType}</Badge>
                        <Badge variant="outline">{pattern.category}</Badge>
                      </div>
                      <h3 className="font-semibold" data-testid={`text-pattern-title-${pattern.id}`}>{pattern.title}</h3>
                      <p className="text-sm text-muted-foreground">{pattern.description}</p>
                      {pattern.confidenceLevel && (
                        <p className="text-sm">
                          <span className="font-medium">Confidence:</span> {pattern.confidenceLevel}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="knowledge" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Institutional Knowledge Base</CardTitle>
              <CardDescription>
                Documented organizational wisdom and best practices
              </CardDescription>
            </CardHeader>
            <CardContent>
              {knowledgeLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading knowledge base...</div>
              ) : institutionalKnowledge.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Award className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p>Knowledge base is empty - Start documenting learnings</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {institutionalKnowledge.map((knowledge: any) => (
                    <div 
                      key={knowledge.id} 
                      className="border rounded-lg p-4 space-y-2"
                      data-testid={`knowledge-${knowledge.id}`}
                    >
                      <div className="flex items-center gap-2">
                        <Badge>{knowledge.memoryType}</Badge>
                        {knowledge.domain && <Badge variant="outline">{knowledge.domain}</Badge>}
                      </div>
                      <h3 className="font-semibold" data-testid={`text-knowledge-title-${knowledge.id}`}>{knowledge.title}</h3>
                      <p className="text-sm">{knowledge.summary}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </PageLayout>
  );
}
