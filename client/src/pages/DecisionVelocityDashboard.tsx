import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import StandardNav from "@/components/layout/StandardNav";
import Footer from "@/components/layout/Footer";
import { Clock, CheckCircle, TrendingDown, TrendingUp, Trophy, ArrowRight, Zap, Target, Users } from "lucide-react";
import { useLocation } from "wouter";

export default function DecisionVelocityDashboard() {
  const [, setLocation] = useLocation();
  
  // Enhanced response data with DECISION + EXECUTION tracking (the full value prop)
  const responses = [
    {
      id: '1',
      scenario: 'Customer Data Breach Response',
      question: 'Should we disclose publicly immediately?',
      decisionMaker: 'John Smith (CEO)',
      optionChosen: 'Option A: Disclose immediately',
      decisionTimeMinutes: 18,
      executionTimeMinutes: 52,
      totalResponseTimeMinutes: 70,
      tasksCompleted: 47,
      totalTasks: 47,
      outcome: 'Positive - Regulatory compliance met, customer trust maintained (87% retention)',
      lessons: 'Transparency paid off long-term despite short-term media negativity',
      timestamp: '2024-11-15T09:23:00'
    },
    {
      id: '2',
      scenario: 'Competitor Pricing Response',
      question: 'Should we match competitor price cut?',
      decisionMaker: 'Sarah Johnson (CFO)',
      optionChosen: 'Option B: Hold pricing, emphasize value proposition',
      decisionTimeMinutes: 11,
      executionTimeMinutes: 35,
      totalResponseTimeMinutes: 46,
      tasksCompleted: 23,
      totalTasks: 23,
      outcome: 'Positive - Maintained margins (92%), minimal customer loss (3% churn)',
      lessons: 'Value messaging resonated with target customers',
      timestamp: '2024-11-20T14:45:00'
    },
    {
      id: '3',
      scenario: 'Regulatory Audit Response',
      question: 'Which compliance approach to take?',
      decisionMaker: 'Lisa Chen (General Counsel)',
      optionChosen: 'Option C: Full disclosure with remediation plan',
      decisionTimeMinutes: 14,
      executionTimeMinutes: 68,
      totalResponseTimeMinutes: 82,
      tasksCompleted: 31,
      totalTasks: 31,
      outcome: 'Positive - Audit closed favorably, no fines assessed',
      lessons: 'Proactive disclosure builds regulatory goodwill',
      timestamp: '2024-12-02T11:12:00'
    },
    {
      id: '4',
      scenario: 'M&A Target Valuation',
      question: 'Approve preliminary bid?',
      decisionMaker: 'Sarah Johnson (CFO)',
      optionChosen: 'Option A: Proceed with bid at $425M',
      decisionTimeMinutes: 24,
      executionTimeMinutes: 45,
      totalResponseTimeMinutes: 69,
      tasksCompleted: 18,
      totalTasks: 28,
      outcome: 'In Progress - Bid submitted, awaiting response',
      lessons: 'TBD - Decision still playing out',
      timestamp: '2024-12-10T16:30:00'
    },
    {
      id: '5',
      scenario: 'Cybersecurity Vendor Selection',
      question: 'Which vendor to contract?',
      decisionMaker: 'Mike Davis (CISO)',
      optionChosen: 'Option B: Vendor B (higher cost, better integration)',
      decisionTimeMinutes: 9,
      executionTimeMinutes: 28,
      totalResponseTimeMinutes: 37,
      tasksCompleted: 19,
      totalTasks: 19,
      outcome: 'Positive - Implementation ahead of schedule, reduced incidents by 40%',
      lessons: 'Investment in integration capabilities was worth premium',
      timestamp: '2024-12-15T10:05:00'
    }
  ];
  
  // Calculate metrics for DECISION + EXECUTION (the complete value proposition)
  const avgDecisionTime = responses.reduce((sum, d) => sum + d.decisionTimeMinutes, 0) / responses.length;
  const avgExecutionTime = responses.reduce((sum, d) => sum + d.executionTimeMinutes, 0) / responses.length;
  const avgTotalResponseTime = responses.reduce((sum, d) => sum + d.totalResponseTimeMinutes, 0) / responses.length;
  
  // Industry baseline: 72 hours to decide + 2 weeks to execute = ~10,080 min (2 weeks total)
  const baselineDecisionMinutes = 72 * 60; // 72 hours
  const baselineExecutionMinutes = 14 * 24 * 60; // 2 weeks
  const baselineTotalMinutes = baselineDecisionMinutes + baselineExecutionMinutes;
  
  const decisionSpeedMultiplier = Math.round(baselineDecisionMinutes / avgDecisionTime);
  const totalSpeedMultiplier = Math.round(baselineTotalMinutes / avgTotalResponseTime);
  
  // Keep backward compatibility - alias for legacy code
  const decisions = responses;
  const speedMultiplier = decisionSpeedMultiplier;
  const improvement = Math.round(((baselineTotalMinutes - avgTotalResponseTime) / baselineTotalMinutes) * 100);
  
  const decisionMakers = [
    { name: 'Sarah Johnson', role: 'CFO', decisions: 12, avgTime: 11.2, rank: 1 },
    { name: 'John Smith', role: 'CEO', decisions: 18, avgTime: 14.7, rank: 2 },
    { name: 'Mike Davis', role: 'CISO', decisions: 9, avgTime: 16.3, rank: 3 },
    { name: 'Lisa Chen', role: 'General Counsel', decisions: 8, avgTime: 19.4, rank: 4 }
  ];
  
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
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Head coaches make 80+ decisions in 3 hours because they pre-stage decision trees. 
            Track how fast your executive team is deciding.
          </p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="border-2 border-emerald-200 dark:border-emerald-800">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-5 w-5 text-emerald-600" />
                Avg Decision Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-emerald-600" data-testid="avg-decision-time">
                {avgDecisionTime.toFixed(1)} min
              </div>
              <p className="text-sm text-slate-500 mt-2">
                vs. 4,320 min baseline (72 hrs)
              </p>
              <div className="mt-3 flex items-center gap-2 text-sm font-medium text-emerald-600">
                <TrendingDown className="h-4 w-4" />
                {speedMultiplier}X faster
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-blue-200 dark:border-blue-800">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="h-5 w-5 text-blue-600" />
                Avg Execution Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-blue-600" data-testid="avg-execution-time">
                {avgExecutionTime.toFixed(0)} min
              </div>
              <p className="text-sm text-slate-500 mt-2">
                vs. 20,160 min baseline (2 weeks)
              </p>
              <div className="mt-3 flex items-center gap-2 text-sm font-medium text-blue-600">
                <TrendingDown className="h-4 w-4" />
                {Math.round(baselineExecutionMinutes / avgExecutionTime)}X faster
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-purple-200 dark:border-purple-800">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Zap className="h-5 w-5 text-purple-600" />
                Total Response Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-purple-600" data-testid="total-response-time">
                {avgTotalResponseTime.toFixed(0)} min
              </div>
              <p className="text-sm text-slate-500 mt-2">
                decision + execution combined
              </p>
              <div className="mt-3 flex items-center gap-2 text-sm font-medium text-purple-600">
                <TrendingDown className="h-4 w-4" />
                {totalSpeedMultiplier}X faster than industry
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Trophy className="h-5 w-5 text-amber-600" />
                Responses Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-amber-600" data-testid="responses-count">
                {responses.length}
              </div>
              <p className="text-sm text-slate-500 mt-2">
                this quarter
              </p>
              <div className="mt-3 flex items-center gap-2 text-sm font-medium text-emerald-600">
                <CheckCircle className="h-4 w-4" />
                100% on-time completion
              </div>
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
                  Before M Platform
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Avg Decision Time</span>
                    <span className="text-lg font-bold text-red-600">72 hours</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Decisions Per Quarter</span>
                    <span className="text-lg font-bold text-red-600">11</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">On-Time Rate</span>
                    <span className="text-lg font-bold text-red-600">47%</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-4">
                  With M Platform
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Avg Decision Time</span>
                    <span className="text-lg font-bold text-emerald-600">{avgDecisionTime.toFixed(1)} min</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Decisions Per Quarter</span>
                    <span className="text-lg font-bold text-emerald-600">{decisions.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">On-Time Rate</span>
                    <span className="text-lg font-bold text-emerald-600">94%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
              <p className="text-lg font-bold text-blue-900 dark:text-blue-200">
                {speedMultiplier}X faster decisions • {((decisions.length / 11) * 100 - 100).toFixed(0)}% more decisions made • {(94 - 47).toFixed(0)}% improvement in on-time rate
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Trophy className="h-6 w-6 text-amber-500" />
              Decision Maker Leaderboard
            </CardTitle>
            <CardDescription>
              Executives ranked by average decision velocity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {decisionMakers.map((maker) => (
                <div 
                  key={maker.name}
                  className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
                  data-testid={`leaderboard-row-${maker.rank}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                      maker.rank === 1 ? 'bg-gradient-to-br from-amber-400 to-orange-500' :
                      maker.rank === 2 ? 'bg-gradient-to-br from-slate-300 to-slate-400' :
                      maker.rank === 3 ? 'bg-gradient-to-br from-amber-600 to-amber-700' :
                      'bg-slate-500'
                    }`}>
                      {maker.rank}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">{maker.name}</div>
                      <div className="text-sm text-slate-500">{maker.role}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <div className="text-sm text-slate-500">Decisions</div>
                      <div className="font-bold text-slate-900 dark:text-white">{maker.decisions}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-500">Avg Time</div>
                      <div className="font-bold text-emerald-600">{maker.avgTime} min</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Recent Decisions</CardTitle>
            <CardDescription>
              Decision log with outcomes and lessons learned
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {decisions.map((decision) => (
                <div 
                  key={decision.id}
                  className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg"
                  data-testid={`decision-row-${decision.id}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white">{decision.scenario}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{decision.question}</p>
                    </div>
                    <Badge variant={decision.decisionTimeMinutes <= 15 ? 'default' : 'secondary'}>
                      {decision.decisionTimeMinutes} min
                    </Badge>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mt-3 text-sm">
                    <div>
                      <span className="text-slate-500">Decision Maker:</span>
                      <span className="ml-2 font-medium text-slate-700 dark:text-slate-300">{decision.decisionMaker}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Choice:</span>
                      <span className="ml-2 font-medium text-slate-700 dark:text-slate-300">{decision.optionChosen}</span>
                    </div>
                  </div>
                  <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800 rounded text-sm">
                    <div className="text-slate-500 mb-1">Outcome:</div>
                    <div className="text-slate-700 dark:text-slate-300">{decision.outcome}</div>
                    {decision.lessons && (
                      <>
                        <div className="text-slate-500 mt-2 mb-1">Lessons:</div>
                        <div className="text-slate-700 dark:text-slate-300 italic">{decision.lessons}</div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
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
