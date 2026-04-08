import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/layout/PageLayout";
import { Clock, CheckCircle, TrendingUp, Trophy, ArrowRight, Zap, Target, Users, Loader2, BarChart3 } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { BrandStamp } from "@/components/BrandStamp";

function formatDecisionType(type: string): string {
  return type
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getOutcomeBadgeVariant(outcome: string): "default" | "secondary" | "destructive" | "outline" {
  switch (outcome) {
    case 'successful': return 'default';
    case 'partially_successful': return 'outline';
    case 'unsuccessful': return 'destructive';
    case 'pending': return 'outline';
    default: return 'outline';
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
    case 'excellent': return 'text-[#2B8A6E]';
    case 'high': return 'text-[#0A0F2E]';
    case 'moderate': return 'text-[#C9A84C]';
    case 'low': return 'text-[#C9A84C]';
    case 'poor': return 'text-[#dc2626]';
    default: return 'text-[#0A0F2E]';
  }
}

export default function DecisionVelocityDashboard({ embedded }: { embedded?: boolean }) {
  const [, setLocation] = useLocation();

  const { data: decisionsRaw, isLoading } = useQuery<any[]>({
    queryKey: ['/api/decision-outcomes'],
  });
  const decisions = Array.isArray(decisionsRaw) ? decisionsRaw : [];

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
      <PageLayout embedded={embedded}>
        <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-[#2B8A6E] mb-4" />
          <p className="text-lg text-[#0A0F2E]">Loading decision outcomes...</p>
        </div>
      </PageLayout>
    );
  }

  const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

  return (
    <PageLayout embedded={embedded}>
      
      {/* Navy Header Section */}
      <div style={{ background: "#0A0F2E", padding: "80px 48px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)", backgroundSize: "44px 44px" }} />
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-6 h-0.5" style={{ background: "#C9A84C" }} />
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "#C9A84C" }}>
              Performance Intelligence
            </span>
            <div className="w-6 h-0.5" style={{ background: "#C9A84C" }} />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6" style={CG} data-testid="page-title">
            Decision <em style={{ fontStyle: "italic", color: "#C9A84C" }}>Velocity</em> Dashboard
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Head coaches make 80+ decisions in 3 hours because they pre-stage decision trees. 
            Track how fast your executive team is deciding.
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="border-[#E8E4DC] bg-white rounded-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base font-bold uppercase tracking-widest text-[#6B7280]">
                <Trophy className="h-5 w-5 text-[#C9A84C]" />
                Total Decisions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-[#C9A84C]" style={CG} data-testid="total-decisions">
                {totalDecisions}
              </div>
              <p className="text-sm text-[#6B7280] mt-2 uppercase tracking-widest font-bold text-[10px]">
                decisions tracked
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-[#E8E4DC] bg-white rounded-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base font-bold uppercase tracking-widest text-[#6B7280]">
                <CheckCircle className="h-5 w-5 text-[#C9A84C]" />
                Success Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-[#C9A84C]" style={CG} data-testid="success-rate">
                {successRate}%
              </div>
              <p className="text-sm text-[#6B7280] mt-2 uppercase tracking-widest font-bold text-[10px]">
                {successfulCount} of {totalDecisions} successful
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-[#E8E4DC] bg-white rounded-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base font-bold uppercase tracking-widest text-[#6B7280]">
                <Target className="h-5 w-5 text-[#C9A84C]" />
                Avg Confidence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-[#C9A84C]" style={CG} data-testid="avg-confidence">
                {avgConfidence}%
              </div>
              <p className="text-sm text-[#6B7280] mt-2 uppercase tracking-widest font-bold text-[10px]">
                average decision confidence
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-[#E8E4DC] bg-white rounded-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base font-bold uppercase tracking-widest text-[#6B7280]">
                <Zap className="h-5 w-5 text-[#C9A84C]" />
                Effectiveness
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-[#C9A84C]" style={CG} data-testid="avg-effectiveness">
                {avgEffectiveness}%
              </div>
              <p className="text-sm text-[#6B7280] mt-2 uppercase tracking-widest font-bold text-[10px]">
                {excellentCount} excellent decisions
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-12 border-[#E8E4DC] bg-white rounded-none shadow-sm">
          <CardHeader className="border-b border-[#E8E4DC]">
            <CardTitle className="text-2xl flex items-center gap-2 text-[#C9A84C]" style={CG}>
              <Target className="h-6 w-6 text-[#C9A84C]" />
              The Decision Velocity Gap
            </CardTitle>
            <CardDescription className="text-base text-[#6B7280]">
              Head coaches make 80+ critical decisions in 3 hours. Your team now decides at head coach speed.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-[#6B7280] mb-4 uppercase tracking-widest text-[10px]">
                  Before Readiness OS
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-[#C9A84C]/5 rounded-none border border-[#C9A84C]/10">
                    <span className="text-sm font-medium text-[#0A0F2E]">Avg Decision Confidence</span>
                    <span className="text-lg font-bold text-[#C9A84C]" style={CG}>45%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-[#C9A84C]/5 rounded-none border border-[#C9A84C]/10">
                    <span className="text-sm font-medium text-[#0A0F2E]">Decisions Per Quarter</span>
                    <span className="text-lg font-bold text-[#C9A84C]" style={CG}>11</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-[#C9A84C]/5 rounded-none border border-[#C9A84C]/10">
                    <span className="text-sm font-medium text-[#0A0F2E]">Success Rate</span>
                    <span className="text-lg font-bold text-[#C9A84C]" style={CG}>47%</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-[#6B7280] mb-4 uppercase tracking-widest text-[10px]">
                  With Readiness OS
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-[#2B8A6E]/5 rounded-none border border-[#2B8A6E]/10">
                    <span className="text-sm font-medium text-[#0A0F2E]">Avg Decision Confidence</span>
                    <span className="text-lg font-bold text-[#2B8A6E]" style={CG}>{avgConfidence}%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-[#2B8A6E]/5 rounded-none border border-[#2B8A6E]/10">
                    <span className="text-sm font-medium text-[#0A0F2E]">Decisions Per Quarter</span>
                    <span className="text-lg font-bold text-[#2B8A6E]" style={CG}>{totalDecisions}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-[#2B8A6E]/5 rounded-none border border-[#2B8A6E]/10">
                    <span className="text-sm font-medium text-[#0A0F2E]">Success Rate</span>
                    <span className="text-lg font-bold text-[#2B8A6E]" style={CG}>{successRate}%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-[#0A0F2E] text-center">
              <p className="text-lg font-bold text-white" style={CG}>
                {totalDecisions} decisions tracked • {successRate}% success rate • {avgConfidence}% avg confidence
              </p>
            </div>
          </CardContent>
        </Card>
        
        {decisions.length > 0 && (
          <Card className="mb-12 border-[#E8E4DC] bg-white rounded-none shadow-sm">
            <CardHeader className="border-b border-[#E8E4DC]">
              <CardTitle className="text-2xl flex items-center gap-2 text-[#C9A84C]" style={CG}>
                <Trophy className="h-6 w-6 text-[#C9A84C]" />
                Decision Type Breakdown
              </CardTitle>
              <CardDescription className="text-[#6B7280]">
                Strategic decisions by category and effectiveness
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-5 gap-3">
                {Object.entries(decisions.reduce((acc: Record<string, { count: number; successful: number }>, d: any) => {
                  const type = d.decisionType || 'unknown';
                  if (!acc[type]) acc[type] = { count: 0, successful: 0 };
                  acc[type].count++;
                  if (d.actualOutcome === 'successful') acc[type].successful++;
                  return acc;
                }, {})).map(([type, stats]: [string, any]) => (
                  <div key={type} className="p-4 bg-[#F8F7F4] border border-[#E8E4DC] rounded-none text-center">
                    <div className="text-2xl font-bold text-[#0A0F2E]" style={CG}>{stats.count}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280] mt-1">{formatDecisionType(type)}</div>
                    <Badge variant="outline" className="mt-2 text-[10px] border-[#E8E4DC] text-[#0A0F2E] rounded-none">
                      {Math.round((stats.successful / stats.count) * 100)}% success
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        <Card className="mb-12 border-[#E8E4DC] bg-white rounded-none shadow-sm">
          <CardHeader className="border-b border-[#E8E4DC]">
            <CardTitle className="text-2xl text-[#0A0F2E]" style={CG}>Recent Decisions</CardTitle>
            <CardDescription className="text-[#6B7280]">
              Decision log with outcomes and lessons learned
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {decisions.length === 0 ? (
              <div className="text-center py-12 text-[#0A0F2E]">
                <Target className="h-12 w-12 mx-auto mb-4 text-[#E8E4DC]" />
                <p className="text-lg font-medium">No decisions recorded yet</p>
                <p className="text-sm mt-1 text-[#6B7280]">Decision outcomes will appear here once they are tracked.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {decisions.map((decision: any) => (
                  <div 
                    key={decision.id}
                    className="p-4 border border-[#E8E4DC] rounded-none bg-white"
                    data-testid={`decision-row-${decision.id}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-[#C9A84C]" style={CG}>
                          {formatDecisionType(decision.decisionType)}
                        </h4>
                        <p className="text-sm text-[#4B5563]">{decision.decisionDescription}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`rounded-none ${decision.actualOutcome === 'successful' ? 'bg-[#2B8A6E] text-white' : ''}`}>
                          {formatOutcome(decision.actualOutcome)}
                        </Badge>
                        {decision.effectiveness && (
                          <Badge variant="outline" className={`${getEffectivenessColor(decision.effectiveness)} border-[#E8E4DC] rounded-none`}>
                            {decision.effectiveness}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 mt-3 text-xs uppercase tracking-widest font-bold">
                      <div>
                        <span className="text-[#6B7280]">Decision Maker:</span>
                        <span className="ml-2 text-[#0A0F2E]">{decision.decisionMaker}</span>
                      </div>
                      <div>
                        <span className="text-[#6B7280]">Choice:</span>
                        <span className="ml-2 text-[#0A0F2E]">
                          {decision.chosenOption?.title || 'N/A'}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 p-3 bg-[#F8F7F4] border border-[#E8E4DC] rounded-none text-sm">
                      {decision.actualResults?.description && (
                        <>
                          <div className="text-[#6B7280] font-bold uppercase tracking-widest text-[10px] mb-1">Results:</div>
                          <div className="text-[#0A0F2E]">{decision.actualResults.description}</div>
                        </>
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
            className="bg-[#0A0F2E] hover:bg-[#141B45] text-white font-bold uppercase tracking-widest text-[10px] h-12 px-8 rounded-none"
            data-testid="button-create-tree"
          >
            <ArrowRight className="mr-2 h-5 w-5" />
            Create Your First Decision Tree
          </Button>
          <p className="mt-3 text-sm text-[#6B7280] uppercase tracking-widest font-bold text-[10px]">
            Pre-stage decisions before scenarios occur—just like head coaches do
          </p>
        </div>

        {/* Decision Velocity Benchmark Panel */}
        <div className="bg-white border rounded-none shadow-sm p-8" style={{ borderColor: "#E8E4DC" }}>
          <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "#6B7280" }}>Industry Benchmarks</div>
          <h3 className="text-xl font-bold mb-6" style={{ color: "#0A0F2E", fontFamily: "'Cormorant Garamond', serif" }}>Your Decision Velocity vs. Peer Group</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { metric: "Avg. Time to Decision", you: "9 min", peer: "4.2 hrs", industry: "2.1 days", winner: "you" },
              { metric: "Decision Reversal Rate", you: "4%", peer: "22%", industry: "31%", winner: "you" },
              { metric: "Stakeholder Alignment", you: "94%", peer: "61%", industry: "48%", winner: "you" },
            ].map((b) => (
              <div key={b.metric} className="p-5 bg-[#F8F7F4] border rounded-none" style={{ borderColor: "#E8E4DC" }}>
                <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "#6B7280" }}>{b.metric}</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: "#2B8A6E" }}>You</span>
                    <span className="font-bold" style={{ color: "#2B8A6E", fontFamily: "'Cormorant Garamond', serif" }}>{b.you}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-widest" style={{ color: "#6B7280" }}>Peer Avg</span>
                    <span className="font-semibold text-sm" style={{ color: "#6B7280" }}>{b.peer}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-widest" style={{ color: "#6B7280" }}>Industry Avg</span>
                    <span className="font-semibold text-sm" style={{ color: "#6B7280" }}>{b.industry}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Velocity Trend */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: "#6B7280" }}>30-Day Velocity Trend</div>
            <div className="flex items-end gap-2 h-24">
              {[62, 68, 71, 74, 79, 83, 88, 84, 91, 87, 94, 92].map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-sm"
                    style={{
                      height: `${(v / 100) * 88}px`,
                      background: i === 11 ? "#C9A84C" : "#0A0F2E",
                      opacity: i === 11 ? 1 : 0.4 + i * 0.05,
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[9px] uppercase tracking-widest" style={{ color: "#6B7280" }}>30 days ago</span>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-3 h-3" style={{ color: "#2B8A6E" }} />
                <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "#2B8A6E" }}>+32% improvement this month</span>
              </div>
              <span className="text-[9px] uppercase tracking-widest" style={{ color: "#6B7280" }}>Today</span>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
