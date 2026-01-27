import StandardNav from '@/components/layout/StandardNav';
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  AlertTriangle, 
  Lightbulb, 
  Brain, 
  Target,
  Sparkles,
  Zap,
  Eye,
  Clock,
  BarChart3,
  ArrowUpRight,
  RefreshCw
} from "lucide-react";
import { format } from "date-fns";
import { queryClient } from "@/lib/queryClient";

interface ReadinessMetric {
  id: string;
  organizationId: string;
  overallScore: string;
  playbookMaturity: string;
  executionVelocity: string;
  learningRate: string;
  signalDetection: string;
  insights: Record<string, any>;
  calculatedAt: string;
}

interface WeakSignal {
  id: string;
  organizationId: string;
  source: string;
  signalType: string;
  title: string;
  description: string;
  confidence: string;
  urgency: string;
  status: string;
  detectedAt: string;
  metadata: Record<string, any>;
}

interface OraclePattern {
  id: string;
  organizationId: string;
  patternType: string;
  title: string;
  description: string;
  confidence: string;
  impact: string;
  detectedAt: string;
  metadata: Record<string, any>;
}

interface ActivityFeedEvent {
  id: string;
  organizationId: string;
  eventType: string;
  title: string;
  description: string;
  timestamp: string;
  metadata: Record<string, any>;
}

export default function FutureReadinessDashboard() {
  const { data: readiness, isLoading: readinessLoading } = useQuery<ReadinessMetric>({
    queryKey: ['/api/dynamic-strategy/readiness'],
  });

  const { data: weakSignalsData, isLoading: signalsLoading } = useQuery<WeakSignal[]>({
    queryKey: ['/api/dynamic-strategy/weak-signals'],
  });

  const { data: oraclePatternsData, isLoading: patternsLoading } = useQuery<OraclePattern[]>({
    queryKey: ['/api/dynamic-strategy/oracle-patterns'],
  });

  const { data: activityFeedData, isLoading: activityLoading } = useQuery<ActivityFeedEvent[]>({
    queryKey: ['/api/dynamic-strategy/activity-feed'],
  });

  const weakSignals = weakSignalsData ?? [];
  const oraclePatterns = oraclePatternsData ?? [];
  const activityFeed = activityFeedData ?? [];

  const handleRecalculate = async () => {
    try {
      await fetch('/api/dynamic-strategy/readiness/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/dynamic-strategy/readiness'] });
    } catch (error) {
      console.error('Failed to recalculate readiness:', error);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getUrgencyBadgeVariant = (urgency: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (urgency) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high': return <ArrowUpRight className="h-4 w-4 text-red-500" />;
      case 'medium': return <TrendingUp className="h-4 w-4 text-yellow-500" />;
      default: return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  const overallScore = parseFloat(readiness?.overallScore || '0');
  const playbookMaturity = parseFloat(readiness?.playbookMaturity || '0');
  const executionVelocity = parseFloat(readiness?.executionVelocity || '0');
  const learningRate = parseFloat(readiness?.learningRate || '0');
  const signalDetection = parseFloat(readiness?.signalDetection || '0');

  return (
    <div className="page-background min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-title flex items-center gap-3">
              <Brain className="h-10 w-10 text-slate-900 dark:text-slate-100" />
              Future Readiness Index™
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Real-time strategic preparedness and self-learning intelligence
            </p>
          </div>
          <Button 
            onClick={handleRecalculate}
            variant="outline"
            className="gap-2"
            data-testid="button-recalculate-readiness"
          >
            <RefreshCw className="h-4 w-4" />
            Recalculate
          </Button>
        </div>

        {/* Main Readiness Score */}
        <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-slate-900">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Target className="h-6 w-6 text-blue-600" />
                  Overall Readiness Score
                </CardTitle>
                <CardDescription>
                  {readiness?.calculatedAt 
                    ? `Last updated ${format(new Date(readiness.calculatedAt), 'PPp')}`
                    : 'Calculating...'}
                </CardDescription>
              </div>
              <div className={`text-6xl font-bold ${getScoreColor(overallScore)}`} data-testid="text-overall-score">
                {overallScore.toFixed(1)}%
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={overallScore} className="h-4" />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Playbook Maturity</span>
                  <Sparkles className="h-4 w-4 text-purple-500" />
                </div>
                <div className={`text-2xl font-bold ${getScoreColor(playbookMaturity)}`}>
                  {playbookMaturity.toFixed(1)}%
                </div>
                <Progress value={playbookMaturity} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Execution Velocity</span>
                  <Zap className="h-4 w-4 text-yellow-500" />
                </div>
                <div className={`text-2xl font-bold ${getScoreColor(executionVelocity)}`}>
                  {executionVelocity.toFixed(1)}%
                </div>
                <Progress value={executionVelocity} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Learning Rate</span>
                  <Brain className="h-4 w-4 text-blue-500" />
                </div>
                <div className={`text-2xl font-bold ${getScoreColor(learningRate)}`}>
                  {learningRate.toFixed(1)}%
                </div>
                <Progress value={learningRate} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Signal Detection</span>
                  <Eye className="h-4 w-4 text-green-500" />
                </div>
                <div className={`text-2xl font-bold ${getScoreColor(signalDetection)}`}>
                  {signalDetection.toFixed(1)}%
                </div>
                <Progress value={signalDetection} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for different intelligence feeds */}
        <Tabs defaultValue="weak-signals" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="weak-signals" className="gap-2" data-testid="tab-weak-signals">
              <AlertTriangle className="h-4 w-4" />
              Weak Signals ({weakSignals.length})
            </TabsTrigger>
            <TabsTrigger value="oracle-patterns" className="gap-2" data-testid="tab-oracle-patterns">
              <Lightbulb className="h-4 w-4" />
              Oracle Patterns ({oraclePatterns.length})
            </TabsTrigger>
            <TabsTrigger value="activity-feed" className="gap-2" data-testid="tab-activity-feed">
              <Activity className="h-4 w-4" />
              Activity Feed ({activityFeed.length})
            </TabsTrigger>
          </TabsList>

          {/* Weak Signals Tab */}
          <TabsContent value="weak-signals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Weak Signal Detection
                </CardTitle>
                <CardDescription>
                  Early indicators of emerging threats and opportunities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-4">
                    {signalsLoading ? (
                      <p className="text-center text-slate-500">Loading signals...</p>
                    ) : weakSignals.length === 0 ? (
                      <p className="text-center text-slate-500">No weak signals detected</p>
                    ) : (
                      weakSignals.map((signal) => (
                        <Card key={signal.id} className="border-l-4 border-l-orange-500">
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-semibold text-lg">{signal.title}</h3>
                                  <Badge variant={getUrgencyBadgeVariant(signal.urgency)}>
                                    {signal.urgency}
                                  </Badge>
                                  <Badge variant="outline">{signal.signalType}</Badge>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                  {signal.description}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-slate-500">
                                  <span className="flex items-center gap-1">
                                    <BarChart3 className="h-3 w-3" />
                                    Confidence: {parseFloat(signal.confidence).toFixed(0)}%
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {format(new Date(signal.detectedAt), 'PPp')}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    Source: {signal.source}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Oracle Patterns Tab */}
          <TabsContent value="oracle-patterns" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-purple-500" />
                  Oracle Intelligence Patterns
                </CardTitle>
                <CardDescription>
                  AI-detected strategic patterns and predictive insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-4">
                    {patternsLoading ? (
                      <p className="text-center text-slate-500">Loading patterns...</p>
                    ) : oraclePatterns.length === 0 ? (
                      <p className="text-center text-slate-500">No oracle patterns detected</p>
                    ) : (
                      oraclePatterns.map((pattern) => (
                        <Card key={pattern.id} className="border-l-4 border-l-purple-500">
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-semibold text-lg">{pattern.title}</h3>
                                  <Badge variant="secondary">{pattern.patternType}</Badge>
                                  {getImpactIcon(pattern.impact)}
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                  {pattern.description}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-slate-500">
                                  <span className="flex items-center gap-1">
                                    <BarChart3 className="h-3 w-3" />
                                    Confidence: {parseFloat(pattern.confidence).toFixed(0)}%
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {format(new Date(pattern.detectedAt), 'PPp')}
                                  </span>
                                  <span>Impact: {pattern.impact}</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Feed Tab */}
          <TabsContent value="activity-feed" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-500" />
                  Real-Time Activity Feed
                </CardTitle>
                <CardDescription>
                  Live stream of strategic execution events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-3">
                    {activityLoading ? (
                      <p className="text-center text-slate-500">Loading activity...</p>
                    ) : activityFeed.length === 0 ? (
                      <p className="text-center text-slate-500">No recent activity</p>
                    ) : (
                      activityFeed.map((event, idx) => (
                        <div key={event.id}>
                          <div className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                              {idx < activityFeed.length - 1 && (
                                <div className="w-px h-full bg-slate-200 dark:bg-slate-700 mt-1" />
                              )}
                            </div>
                            <div className="flex-1 pb-4">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-medium">{event.title}</h4>
                                <span className="text-xs text-slate-500">
                                  {format(new Date(event.timestamp), 'PPp')}
                                </span>
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {event.description}
                              </p>
                              <Badge variant="outline" className="mt-2 text-xs">
                                {event.eventType}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
