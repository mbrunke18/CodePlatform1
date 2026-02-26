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

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const OFF = "#F8F7F4";
const BORDER = "#E8E4DC";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

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
    if (score >= 80) return 'text-[#2B8A6E]';
    if (score >= 60) return 'text-[#C9A84C]';
    return 'text-red-700';
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
      case 'medium': return <TrendingUp className="h-4 w-4 text-[#C9A84C]" />;
      default: return <Activity className="h-4 w-4 text-[#0A0F2E]" />;
    }
  };

  const overallScore = parseFloat(readiness?.overallScore || '0');
  const playbookMaturity = parseFloat(readiness?.playbookMaturity || '0');
  const executionVelocity = parseFloat(readiness?.executionVelocity || '0');
  const learningRate = parseFloat(readiness?.learningRate || '0');
  const signalDetection = parseFloat(readiness?.signalDetection || '0');

  return (
    <div className="bg-[#F8F7F4] min-h-screen">
      <StandardNav />
      <div className="max-w-7xl mx-auto space-y-8 p-12">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 28, height: 2, background: GOLD }} />
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>Readiness Intelligence</span>
            </div>
            <h1 className="text-4xl font-bold flex items-center gap-3 text-[#0A0F2E]" style={CG}>
              Future Readiness <em style={{ fontStyle: "italic", color: "#C9A84C" }}>Index</em>™
            </h1>
            <p className="text-[#6B7280] mt-2">
              Real-time strategic preparedness and self-learning intelligence
            </p>
          </div>
          <Button 
            onClick={handleRecalculate}
            variant="outline"
            className="border-[#E8E4DC] text-[#0A0F2E] hover:bg-white rounded-none h-12 px-8 uppercase tracking-widest font-bold text-[10px]"
            data-testid="button-recalculate-readiness"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Recalculate
          </Button>
        </div>

        {/* Main Readiness Score */}
        <Card className="border-[#E8E4DC] bg-white rounded-none shadow-sm overflow-hidden">
          <CardHeader className="border-b border-[#E8E4DC] bg-[#F8F7F4]/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2 text-[#0A0F2E]" style={CG}>
                  <Target className="h-6 w-6 text-[#0A0F2E]" />
                  Overall Readiness Score
                </CardTitle>
                <CardDescription className="text-[#6B7280]">
                  {readiness?.calculatedAt 
                    ? `Last updated ${format(new Date(readiness.calculatedAt), 'PPp')}`
                    : 'Calculating...'}
                </CardDescription>
              </div>
              <div className={`text-6xl font-bold ${getScoreColor(overallScore)}`} style={CG} data-testid="text-overall-score">
                {overallScore.toFixed(1)}%
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-8">
            <Progress value={overallScore} className="h-2 rounded-none bg-[#F8F7F4] [&>div]:bg-[#C9A84C]" />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">Playbook Maturity</span>
                  <Sparkles className="h-4 w-4 text-[#C9A84C]" />
                </div>
                <div className={`text-3xl font-bold ${getScoreColor(playbookMaturity)}`} style={CG}>
                  {playbookMaturity.toFixed(1)}%
                </div>
                <Progress value={playbookMaturity} className="h-1 rounded-none bg-[#F8F7F4] [&>div]:bg-[#C9A84C]" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">Execution Velocity</span>
                  <Zap className="h-4 w-4 text-[#C9A84C]" />
                </div>
                <div className={`text-3xl font-bold ${getScoreColor(executionVelocity)}`} style={CG}>
                  {executionVelocity.toFixed(1)}%
                </div>
                <Progress value={executionVelocity} className="h-1 rounded-none bg-[#F8F7F4] [&>div]:bg-[#C9A84C]" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">Learning Rate</span>
                  <Brain className="h-4 w-4 text-[#0A0F2E]" />
                </div>
                <div className={`text-3xl font-bold ${getScoreColor(learningRate)}`} style={CG}>
                  {learningRate.toFixed(1)}%
                </div>
                <Progress value={learningRate} className="h-1 rounded-none bg-[#F8F7F4] [&>div]:bg-[#C9A84C]" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">Signal Detection</span>
                  <Eye className="h-4 w-4 text-[#2B8A6E]" />
                </div>
                <div className={`text-3xl font-bold ${getScoreColor(signalDetection)}`} style={CG}>
                  {signalDetection.toFixed(1)}%
                </div>
                <Progress value={signalDetection} className="h-1 rounded-none bg-[#F8F7F4] [&>div]:bg-[#C9A84C]" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for different intelligence feeds */}
        <Tabs defaultValue="weak-signals" className="space-y-8">
          <TabsList className="bg-white border border-[#E8E4DC] rounded-none p-1 h-auto w-full justify-start">
            <TabsTrigger value="weak-signals" className="rounded-none data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-white text-[10px] font-bold uppercase tracking-widest px-6 py-3" data-testid="tab-weak-signals">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Weak Signals ({weakSignals.length})
            </TabsTrigger>
            <TabsTrigger value="oracle-patterns" className="rounded-none data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-white text-[10px] font-bold uppercase tracking-widest px-6 py-3" data-testid="tab-oracle-patterns">
              <Lightbulb className="h-4 w-4 mr-2" />
              Oracle Patterns ({oraclePatterns.length})
            </TabsTrigger>
            <TabsTrigger value="activity-feed" className="rounded-none data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-white text-[10px] font-bold uppercase tracking-widest px-6 py-3" data-testid="tab-activity-feed">
              <Activity className="h-4 w-4 mr-2" />
              Activity Feed ({activityFeed.length})
            </TabsTrigger>
          </TabsList>

          {/* Weak Signals Tab */}
          <TabsContent value="weak-signals" className="space-y-4 mt-0">
            <Card className="border-[#E8E4DC] rounded-none bg-white">
              <CardHeader className="border-b border-[#E8E4DC]">
                <CardTitle className="text-2xl flex items-center gap-2 text-[#0A0F2E]" style={CG}>
                  <AlertTriangle className="h-5 w-5 text-[#C9A84C]" />
                  Weak Signal Detection
                </CardTitle>
                <CardDescription className="text-[#6B7280]">
                  Early indicators of emerging threats and opportunities
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-4">
                    {signalsLoading ? (
                      <p className="text-center text-[#6B7280] italic">Loading signals...</p>
                    ) : weakSignals.length === 0 ? (
                      <p className="text-center text-[#6B7280] italic">No weak signals detected</p>
                    ) : (
                      weakSignals.map((signal) => (
                        <Card key={signal.id} className="border border-[#E8E4DC] border-l-4 border-l-[#C9A84C] rounded-none shadow-sm">
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <h3 className="font-bold text-lg text-[#0A0F2E]" style={CG}>{signal.title}</h3>
                                  <Badge variant={getUrgencyBadgeVariant(signal.urgency)} className="rounded-none uppercase text-[9px] font-bold tracking-widest">
                                    {signal.urgency}
                                  </Badge>
                                  <Badge variant="outline" className="rounded-none uppercase text-[9px] font-bold tracking-widest border-[#E8E4DC] text-[#6B7280]">
                                    {signal.signalType}
                                  </Badge>
                                </div>
                                <p className="text-sm text-[#6B7280] mb-4">
                                  {signal.description}
                                </p>
                                <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">
                                  <span className="flex items-center gap-1">
                                    <BarChart3 className="h-3 w-3" />
                                    Confidence: {parseFloat(signal.confidence).toFixed(0)}%
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {format(new Date(signal.detectedAt), 'PPp')}
                                  </span>
                                  <span>Source: {signal.source}</span>
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
          <TabsContent value="oracle-patterns" className="space-y-4 mt-0">
            <Card className="border-[#E8E4DC] rounded-none bg-white">
              <CardHeader className="border-b border-[#E8E4DC]">
                <CardTitle className="text-2xl flex items-center gap-2 text-[#0A0F2E]" style={CG}>
                  <Lightbulb className="h-5 w-5 text-[#C9A84C]" />
                  Oracle Intelligence Patterns
                </CardTitle>
                <CardDescription className="text-[#6B7280]">
                  AI-detected strategic patterns and predictive insights
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-4">
                    {patternsLoading ? (
                      <p className="text-center text-[#6B7280] italic">Loading patterns...</p>
                    ) : oraclePatterns.length === 0 ? (
                      <p className="text-center text-[#6B7280] italic">No oracle patterns detected</p>
                    ) : (
                      oraclePatterns.map((pattern) => (
                        <Card key={pattern.id} className="border border-[#E8E4DC] border-l-4 border-l-[#0A0F2E] rounded-none shadow-sm">
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <h3 className="font-bold text-lg text-[#0A0F2E]" style={CG}>{pattern.title}</h3>
                                  <Badge variant="secondary" className="rounded-none uppercase text-[9px] font-bold tracking-widest bg-[#0A0F2E] text-white">
                                    {pattern.patternType}
                                  </Badge>
                                  {getImpactIcon(pattern.impact)}
                                </div>
                                <p className="text-sm text-[#6B7280] mb-4">
                                  {pattern.description}
                                </p>
                                <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">
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
          <TabsContent value="activity-feed" className="space-y-4 mt-0">
            <Card className="border-[#E8E4DC] rounded-none bg-white">
              <CardHeader className="border-b border-[#E8E4DC]">
                <CardTitle className="text-2xl flex items-center gap-2 text-[#0A0F2E]" style={CG}>
                  <Activity className="h-5 w-5 text-[#2B8A6E]" />
                  Real-Time Activity Feed
                </CardTitle>
                <CardDescription className="text-[#6B7280]">
                  Live stream of strategic execution events
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-6">
                    {activityLoading ? (
                      <p className="text-center text-[#6B7280] italic">Loading activity...</p>
                    ) : activityFeed.length === 0 ? (
                      <p className="text-center text-[#6B7280] italic">No recent activity</p>
                    ) : (
                      activityFeed.map((event, idx) => (
                        <div key={event.id}>
                          <div className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className="h-2 w-2 rounded-full bg-[#2B8A6E] mt-2" />
                              {idx < activityFeed.length - 1 && (
                                <div className="w-px h-full bg-[#E8E4DC] mt-2" />
                              )}
                            </div>
                            <div className="flex-1 pb-6">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-bold text-[#0A0F2E]" style={CG}>{event.title}</h4>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">
                                  {format(new Date(event.timestamp), 'PPp')}
                                </span>
                              </div>
                              <p className="text-sm text-[#6B7280]">
                                {event.description}
                              </p>
                              <Badge variant="outline" className="mt-3 rounded-none uppercase text-[9px] font-bold tracking-widest border-[#E8E4DC] text-[#6B7280]">
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
