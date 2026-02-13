import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import StandardNav from "@/components/layout/StandardNav";
import Footer from "@/components/layout/Footer";
import { Clock, CheckCircle, TrendingUp, Trophy, ArrowRight, Zap, Target, Users, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

function formatDecisionType(type: string): string {
  return type
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getOutcomeBadgeVariant(outcome: string): "default" | "secondary" | "destructive" | "outline" {
  switch (outcome) {
    case 'successful': return 'default';
    case 'partially_successful': return 'secondary';
    case 'unsuccessful': return 'destructive';
    case 'pending': return 'outline';
    default: return 'secondary';
  }
}

function formatOutcome(outcome: string): string {
  return outcome
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getEffectivenessColor(effectiveness: string): string {
  switch (effectiveness) {
    case 'excellent': return 'text-emerald-600';
    case 'high': return 'text-blue-600';
    case 'moderate': return 'text-amber-600';
    case 'low': return 'text-orange-600';
    case 'poor': return 'text-red-600';
    default: return 'text-slate-600';
  }
}

export default function DecisionVelocityDashboard() {
  const [, setLocation] = useLocation();

  const { data: decisions = [], isLoading } = useQuery<any[]>({
    queryKey: ['/api/decision-outcomes'],
  });

  const confidenceToScore: Record<string, number> = { very_high: 95, high: 80, medium: 60, low: 40 };
  const effectivenessToScore: Record<string, number> = { excellent: 95, high: 80, moderate: 60, low: 40, poor: 20 };

  const totalDecisions = decisions.length;
  const successfulCount = decisions.filter((d: any) => d.actualOutcome === 'successful').length;
  const successRate = totalDecisions > 0 ? Math.round((successfulCount / totalDecisions) * 100) : 0;
  const avgConfidence = totalDecisions > 0
    ? Math.round(decisions.reduce((sum: number, d: any) => sum + (confidenceToScore[d.confidence] || 50), 0) / totalDecisions)
    : 0;
  const avgEffectiveness = totalDecisions > 0
    ? Math.round(decisions.reduce((sum: number, d: any) => sum + (effectivenessToScore[d.effectiveness] || 50), 0) / totalDecisions)
    : 0;

  const excellentCount = decisions.filter((d: any) => d.effectiveness === 'excellent').length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        <StandardNav />
        <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mb-4" />
          <p className="text-lg text-slate-600 dark:text-slate-300">Loading decision outcomes...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <StandardNav />
      
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
            <Zap className="h-3 w-3 mr-1" />
            Decision Velocity Tracking
          </Badge>
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-4" data-testid="page-title">
            Decision Velocity Dashboard
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Head coaches make 80+ decisions in 3 hours because they pre-stage decision trees. 
            Track how fast your executive team is deciding.
          </p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="border-2 border-emerald-200 dark:border-emerald-800">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Trophy className="h-5 w-5 text-emerald-600" />
                Total Decisions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-emerald-600" data-testid="total-decisions">
                {totalDecisions}
              </div>
              <p className="text-sm text-slate-500 mt-2">
                decisions tracked
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-blue-200 dark:border-blue-800">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                Success Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-blue-600" data-testid="success-rate">
                {successRate}%
              </div>
              <p className="text-sm text-slate-500 mt-2">
                {successfulCount} of {totalDecisions} successful
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-purple-200 dark:border-purple-800">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="h-5 w-5 text-purple-600" />
                Avg Confidence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-purple-600" data-testid="avg-confidence">
                {avgConfidence}%
              </div>
              <p className="text-sm text-slate-500 mt-2">
                average decision confidence
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Zap className="h-5 w-5 text-amber-600" />
                Effectiveness
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-amber-600" data-testid="avg-effectiveness">
                {avgEffectiveness}%
              </div>
              <p className="text-sm text-slate-500 mt-2">
                {excellentCount} excellent decisions
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-12 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Target className="h-6 w-6 text-blue-600" />
              The Decision Velocity Gap
            </CardTitle>
            <CardDescription className="text-base">
              Head coaches make 80+ critical decisions in 3 hours. Your team now decides at head coach speed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-4">
                  Before ExecuteIQ
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Avg Decision Confidence</span>
                    <span className="text-lg font-bold text-red-600">45%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Decisions Per Quarter</span>
                    <span className="text-lg font-bold text-red-600">11</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Success Rate</span>
                    <span className="text-lg font-bold text-red-600">47%</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-4">
                  With ExecuteIQ
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Avg Decision Confidence</span>
                    <span className="text-lg font-bold text-emerald-600">{avgConfidence}%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Decisions Per Quarter</span>
                    <span className="text-lg font-bold text-emerald-600">{totalDecisions}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Success Rate</span>
                    <span className="text-lg font-bold text-emerald-600">{successRate}%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
              <p className="text-lg font-bold text-blue-900 dark:text-blue-200">
                {totalDecisions} decisions tracked • {successRate}% success rate • {avgConfidence}% avg confidence
              </p>
            </div>
          </CardContent>
        </Card>
        
        {decisions.length > 0 && (
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Trophy className="h-6 w-6 text-amber-500" />
                Decision Type Breakdown
              </CardTitle>
              <CardDescription>
                Strategic decisions by category and effectiveness
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-5 gap-3">
                {Object.entries(decisions.reduce((acc: Record<string, { count: number; successful: number }>, d: any) => {
                  const type = d.decisionType || 'unknown';
                  if (!acc[type]) acc[type] = { count: 0, successful: 0 };
                  acc[type].count++;
                  if (d.actualOutcome === 'successful') acc[type].successful++;
                  return acc;
                }, {})).map(([type, stats]: [string, any]) => (
                  <div key={type} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.count}</div>
                    <div className="text-xs font-medium text-slate-500 mt-1">{formatDecisionType(type)}</div>
                    <Badge variant="outline" className="mt-2 text-xs">
                      {Math.round((stats.successful / stats.count) * 100)}% success
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Recent Decisions</CardTitle>
            <CardDescription>
              Decision log with outcomes and lessons learned
            </CardDescription>
          </CardHeader>
          <CardContent>
            {decisions.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No decisions recorded yet</p>
                <p className="text-sm mt-1">Decision outcomes will appear here once they are tracked.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {decisions.map((decision: any) => (
                  <div 
                    key={decision.id}
                    className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg"
                    data-testid={`decision-row-${decision.id}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">
                          {formatDecisionType(decision.decisionType)}
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300">{decision.decisionDescription}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getOutcomeBadgeVariant(decision.actualOutcome)}>
                          {formatOutcome(decision.actualOutcome)}
                        </Badge>
                        {decision.effectiveness && (
                          <Badge variant="outline" className={getEffectivenessColor(decision.effectiveness)}>
                            {decision.effectiveness}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 mt-3 text-sm">
                      <div>
                        <span className="text-slate-500">Decision Maker:</span>
                        <span className="ml-2 font-medium text-slate-700 dark:text-slate-300">{decision.decisionMaker}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Choice:</span>
                        <span className="ml-2 font-medium text-slate-700 dark:text-slate-300">
                          {decision.chosenOption?.title || 'N/A'}
                        </span>
                      </div>
                      {decision.confidence && (
                        <div>
                          <span className="text-slate-500">Confidence:</span>
                          <Badge variant="outline" className="ml-2">{formatDecisionType(decision.confidence)}</Badge>
                        </div>
                      )}
                      {decision.timeToImplement != null && (
                        <div>
                          <span className="text-slate-500">Implementation Time:</span>
                          <span className="ml-2 font-medium text-slate-700 dark:text-slate-300">{decision.timeToImplement} days</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800 rounded text-sm">
                      {decision.actualResults?.description && (
                        <>
                          <div className="text-slate-500 mb-1">Results:</div>
                          <div className="text-slate-700 dark:text-slate-300">{decision.actualResults.description}</div>
                        </>
                      )}
                      {decision.actualResults?.metricsImpacted && decision.actualResults.metricsImpacted.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {decision.actualResults.metricsImpacted.map((metric: string, i: number) => (
                            <Badge key={i} variant="outline" className="text-xs">{metric}</Badge>
                          ))}
                        </div>
                      )}
                      {decision.lessonsLearned?.keyTakeaways && decision.lessonsLearned.keyTakeaways.length > 0 && (
                        <>
                          <div className="text-slate-500 mt-2 mb-1">Lessons Learned:</div>
                          <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 italic space-y-1">
                            {decision.lessonsLearned.keyTakeaways.map((takeaway: string, i: number) => (
                              <li key={i}>{takeaway}</li>
                            ))}
                          </ul>
                        </>
                      )}
                      {!decision.actualResults?.description && (!decision.lessonsLearned?.keyTakeaways || decision.lessonsLearned.keyTakeaways.length === 0) && (
                        <div className="text-slate-400 italic">No outcome details recorded yet.</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="text-center">
          <Button 
            size="lg" 
            onClick={() => setLocation('/decision-trees')}
            className="bg-blue-600 hover:bg-blue-700"
            data-testid="button-create-tree"
          >
            <ArrowRight className="mr-2 h-5 w-5" />
            Create Your First Decision Tree
          </Button>
          <p className="mt-3 text-sm text-slate-500">
            Pre-stage decisions before scenarios occur—just like head coaches do
          </p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
