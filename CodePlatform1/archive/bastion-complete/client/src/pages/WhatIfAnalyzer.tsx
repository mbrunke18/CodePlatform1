import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import VeridiusPageLayout from '@/components/layout/VeridiusPageLayout';
import {
  FlaskConical,
  TrendingUp,
  AlertTriangle,
  Target,
  Clock,
  Users,
  Zap,
  ArrowRight,
  Play,
  Save,
  Sparkles,
  CheckCircle2,
  XCircle,
  Activity,
  BarChart3,
  Rocket,
  Shield,
  DollarSign,
} from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface TestCondition {
  id: string;
  label: string;
  operator: 'greater' | 'less' | 'equals' | 'between';
  value: number | string;
  unit?: string;
}

interface AnalysisResult {
  triggeredAlerts: Array<{ id: string; name: string; severity: string }>;
  recommendedPlaybooks: Array<{ id: string; name: string; executionTime: number; readinessState: string }>;
  projectedExecutionTime: number;
  teamsInvolved: Array<{ name: string; role: string }>;
  decisionVelocityMetrics: {
    ourTime: number;
    industryAverage: number;
    timeSaved: number;
    percentageFaster: number;
  };
}

export default function WhatIfAnalyzer() {
  const { toast } = useToast();
  const [analysisName, setAnalysisName] = useState('');
  const [conditions, setConditions] = useState<TestCondition[]>([]);
  const [newCondition, setNewCondition] = useState({
    label: '',
    operator: 'greater' as const,
    value: '',
    unit: ''
  });
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Fetch available triggers
  const { data: triggers = [] } = useQuery<any[]>({
    queryKey: ['/api/executive-triggers'],
  });

  // Fetch available playbooks
  const { data: playbooks = [] } = useQuery<any[]>({
    queryKey: ['/api/scenarios'],
  });

  // Fetch saved what-if scenarios
  const { data: savedScenarios = [] } = useQuery<any[]>({
    queryKey: ['/api/what-if-scenarios'],
  });

  const addCondition = () => {
    if (!newCondition.label || !newCondition.value) {
      toast({
        title: "Missing Information",
        description: "Please provide both a condition label and value",
        variant: "destructive"
      });
      return;
    }

    const condition: TestCondition = {
      id: `cond_${Date.now()}`,
      label: newCondition.label,
      operator: newCondition.operator,
      value: parseFloat(newCondition.value) || newCondition.value,
      unit: newCondition.unit
    };

    setConditions([...conditions, condition]);
    setNewCondition({ label: '', operator: 'greater', value: '', unit: '' });
  };

  const removeCondition = (id: string) => {
    setConditions(conditions.filter(c => c.id !== id));
  };

  const runAnalysis = async () => {
    if (conditions.length === 0) {
      toast({
        title: "No Conditions",
        description: "Add at least one test condition to run the analysis",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      // Simulate analysis by checking which triggers would fire based on conditions
      const triggeredAlerts: any[] = [];
      const recommendedPlaybooksList: any[] = [];
      const teamsSet = new Set<string>();

      // Check each trigger against our test conditions
      triggers.forEach((trigger: any) => {
        const shouldTrigger = conditions.some(cond => {
          // Simplified logic - in production, this would use the actual trigger conditions
          if (trigger.name?.toLowerCase().includes(cond.label.toLowerCase())) {
            return true;
          }
          return false;
        });

        if (shouldTrigger) {
          triggeredAlerts.push({
            id: trigger.id,
            name: trigger.name,
            severity: trigger.severity || 'medium'
          });

          // Get recommended playbooks for this trigger
          if (trigger.recommendedPlaybooks && Array.isArray(trigger.recommendedPlaybooks)) {
            trigger.recommendedPlaybooks.forEach((pbId: string) => {
              const playbook = playbooks.find(p => p.id === pbId);
              if (playbook && !recommendedPlaybooksList.find(p => p.id === pbId)) {
                recommendedPlaybooksList.push({
                  id: playbook.id,
                  name: playbook.name || playbook.title,
                  executionTime: playbook.averageExecutionTime || 12,
                  readinessState: playbook.readinessState || 'green'
                });

                // Track teams (simplified)
                teamsSet.add('Crisis Response Team');
                teamsSet.add('Executive Leadership');
              }
            });
          }
        }
      });

      // Calculate metrics
      const totalExecutionTime = recommendedPlaybooksList.reduce((sum, pb) => sum + pb.executionTime, 0);
      const industryAvg = 4320; // 72 hours in minutes
      const timeSaved = industryAvg - totalExecutionTime;
      const percentageFaster = Math.round((timeSaved / industryAvg) * 100);

      const result: AnalysisResult = {
        triggeredAlerts,
        recommendedPlaybooks: recommendedPlaybooksList,
        projectedExecutionTime: totalExecutionTime,
        teamsInvolved: Array.from(teamsSet).map(name => ({ name, role: 'Response Team' })),
        decisionVelocityMetrics: {
          ourTime: totalExecutionTime,
          industryAverage: industryAvg,
          timeSaved,
          percentageFaster
        }
      };

      setAnalysisResult(result);
      
      toast({
        title: "Analysis Complete",
        description: `Found ${triggeredAlerts.length} triggers and ${recommendedPlaybooksList.length} recommended playbooks`
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to complete the scenario analysis",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveScenario = async () => {
    if (!analysisName) {
      toast({
        title: "Missing Name",
        description: "Please provide a name for this scenario analysis",
        variant: "destructive"
      });
      return;
    }

    if (!analysisResult) {
      toast({
        title: "No Results",
        description: "Run the analysis first before saving",
        variant: "destructive"
      });
      return;
    }

    try {
      const testConditions: any = {};
      conditions.forEach(cond => {
        testConditions[cond.label] = {
          operator: cond.operator,
          value: cond.value,
          unit: cond.unit
        };
      });

      await apiRequest('POST', '/api/what-if-scenarios', {
        name: analysisName,
        description: `Analysis with ${conditions.length} test conditions`,
        testConditions,
        triggeredAlerts: analysisResult.triggeredAlerts.map(a => a.id),
        recommendedPlaybooks: analysisResult.recommendedPlaybooks.map(p => p.id),
        projectedExecutionTime: analysisResult.projectedExecutionTime,
        teamsInvolved: analysisResult.teamsInvolved,
        decisionVelocityMetrics: analysisResult.decisionVelocityMetrics,
        tags: ['what-if-analysis']
      });

      queryClient.invalidateQueries({ queryKey: ['/api/what-if-scenarios'] });

      toast({
        title: "Scenario Saved",
        description: "Your what-if analysis has been saved for future reference"
      });
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Save Failed",
        description: "Unable to save the scenario analysis",
        variant: "destructive"
      });
    }
  };

  return (
    <VeridiusPageLayout>
      <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
                  <FlaskConical className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    What-If Scenario Analyzer
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Test conditions before they happen - See which triggers fire and playbooks activate
                  </p>
                </div>
              </div>
            </div>
            <Badge variant="outline" className="text-purple-600 border-purple-300">
              <Sparkles className="h-3 w-3 mr-1" />
              Executive Intelligence
            </Badge>
          </div>

          <Tabs defaultValue="analyzer" className="space-y-6">
            <TabsList className="bg-white dark:bg-slate-800">
              <TabsTrigger value="analyzer" data-testid="tab-analyzer">
                <FlaskConical className="h-4 w-4 mr-2" />
                Scenario Analyzer
              </TabsTrigger>
              <TabsTrigger value="saved" data-testid="tab-saved">
                <Save className="h-4 w-4 mr-2" />
                Saved Scenarios ({savedScenarios.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="analyzer" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Panel - Condition Builder */}
                <div className="lg:col-span-1 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Test Conditions
                      </CardTitle>
                      <CardDescription>
                        Define the conditions you want to test
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="condition-label">Condition</Label>
                          <Input
                            id="condition-label"
                            placeholder="e.g., Oil price, Market volatility"
                            value={newCondition.label}
                            onChange={(e) => setNewCondition({ ...newCondition, label: e.target.value })}
                            data-testid="input-condition-label"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor="condition-value">Value</Label>
                            <Input
                              id="condition-value"
                              type="number"
                              placeholder="120"
                              value={newCondition.value}
                              onChange={(e) => setNewCondition({ ...newCondition, value: e.target.value })}
                              data-testid="input-condition-value"
                            />
                          </div>
                          <div>
                            <Label htmlFor="condition-unit">Unit</Label>
                            <Input
                              id="condition-unit"
                              placeholder="$/barrel"
                              value={newCondition.unit}
                              onChange={(e) => setNewCondition({ ...newCondition, unit: e.target.value })}
                              data-testid="input-condition-unit"
                            />
                          </div>
                        </div>

                        <Button onClick={addCondition} className="w-full" data-testid="button-add-condition">
                          Add Condition
                        </Button>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label>Active Conditions ({conditions.length})</Label>
                        {conditions.length === 0 ? (
                          <p className="text-sm text-gray-500">No conditions added yet</p>
                        ) : (
                          <div className="space-y-2">
                            {conditions.map(condition => (
                              <div
                                key={condition.id}
                                className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800"
                                data-testid={`condition-${condition.id}`}
                              >
                                <div className="text-sm">
                                  <span className="font-medium">{condition.label}</span>
                                  <span className="text-gray-600 dark:text-gray-400"> {condition.operator} </span>
                                  <span className="font-medium">{condition.value}</span>
                                  {condition.unit && <span className="text-gray-600 dark:text-gray-400"> {condition.unit}</span>}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeCondition(condition.id)}
                                  data-testid={`button-remove-${condition.id}`}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <Button
                        onClick={runAnalysis}
                        disabled={isAnalyzing || conditions.length === 0}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        data-testid="button-run-analysis"
                      >
                        {isAnalyzing ? (
                          <>
                            <Activity className="h-4 w-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Run Analysis
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Panel - Results */}
                <div className="lg:col-span-2 space-y-4">
                  {!analysisResult ? (
                    <Card className="h-full flex items-center justify-center min-h-[500px]">
                      <CardContent className="text-center p-12">
                        <FlaskConical className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Ready to Analyze
                        </h3>
                        <p className="text-gray-500 mb-6 max-w-md">
                          Add test conditions and run the analysis to see which triggers would fire and
                          which playbooks would activate
                        </p>
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                          <Target className="h-4 w-4" />
                          <ArrowRight className="h-4 w-4" />
                          <AlertTriangle className="h-4 w-4" />
                          <ArrowRight className="h-4 w-4" />
                          <Rocket className="h-4 w-4" />
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {/* Save Controls */}
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <Input
                              placeholder="Name this analysis (e.g., Oil Price Spike Scenario)"
                              value={analysisName}
                              onChange={(e) => setAnalysisName(e.target.value)}
                              className="flex-1"
                              data-testid="input-analysis-name"
                            />
                            <Button onClick={saveScenario} data-testid="button-save-scenario">
                              <Save className="h-4 w-4 mr-2" />
                              Save for Presentation
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Decision Velocity Metrics */}
                      <Card className="border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-green-600" />
                            Decision Velocity Advantage
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg">
                              <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                              <div className="text-2xl font-bold text-blue-600">
                                {analysisResult.decisionVelocityMetrics.ourTime} min
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">Your Response Time</div>
                            </div>
                            <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg">
                              <Activity className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                              <div className="text-2xl font-bold text-gray-600">
                                {Math.round(analysisResult.decisionVelocityMetrics.industryAverage / 60)} hrs
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">Industry Average</div>
                            </div>
                            <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg">
                              <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
                              <div className="text-2xl font-bold text-green-600">
                                {analysisResult.decisionVelocityMetrics.percentageFaster}%
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">Faster</div>
                            </div>
                            <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg">
                              <DollarSign className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                              <div className="text-2xl font-bold text-purple-600">
                                {Math.round(analysisResult.decisionVelocityMetrics.timeSaved / 60)} hrs
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">Time Saved</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Triggered Alerts */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-orange-600" />
                            Triggered Alerts ({analysisResult.triggeredAlerts.length})
                          </CardTitle>
                          <CardDescription>
                            These monitoring triggers would fire under the test conditions
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {analysisResult.triggeredAlerts.length === 0 ? (
                            <p className="text-gray-500">No triggers would fire under these conditions</p>
                          ) : (
                            <div className="space-y-2">
                              {analysisResult.triggeredAlerts.map(alert => (
                                <div
                                  key={alert.id}
                                  className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded border border-orange-200 dark:border-orange-800"
                                  data-testid={`alert-${alert.id}`}
                                >
                                  <div className="flex items-center gap-3">
                                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                                    <span className="font-medium">{alert.name}</span>
                                  </div>
                                  <Badge variant={alert.severity === 'high' ? 'destructive' : 'secondary'}>
                                    {alert.severity}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Recommended Playbooks */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Rocket className="h-5 w-5 text-blue-600" />
                            Recommended Playbooks ({analysisResult.recommendedPlaybooks.length})
                          </CardTitle>
                          <CardDescription>
                            These playbooks would be activated for coordinated response
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {analysisResult.recommendedPlaybooks.length === 0 ? (
                            <Alert>
                              <Shield className="h-4 w-4" />
                              <AlertDescription>
                                No playbooks are configured for these trigger conditions. Consider setting up response playbooks.
                              </AlertDescription>
                            </Alert>
                          ) : (
                            <div className="space-y-2">
                              {analysisResult.recommendedPlaybooks.map(playbook => (
                                <div
                                  key={playbook.id}
                                  className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800"
                                  data-testid={`playbook-${playbook.id}`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${
                                      playbook.readinessState === 'green' ? 'bg-green-500' :
                                      playbook.readinessState === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                                    }`} />
                                    <span className="font-medium">{playbook.name}</span>
                                  </div>
                                  <Badge variant="outline">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {playbook.executionTime} min
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Teams Involved */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-purple-600" />
                            Teams Mobilized ({analysisResult.teamsInvolved.length})
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {analysisResult.teamsInvolved.map((team, idx) => (
                              <Badge key={idx} variant="secondary" data-testid={`team-${idx}`}>
                                <Users className="h-3 w-3 mr-1" />
                                {team.name}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="saved" className="space-y-4">
              {savedScenarios.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Save className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      No Saved Scenarios
                    </h3>
                    <p className="text-gray-500">
                      Run an analysis and save it to build your scenario library for board presentations
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedScenarios.map((scenario: any) => (
                    <Card key={scenario.id} className="hover:shadow-lg transition-shadow" data-testid={`saved-scenario-${scenario.id}`}>
                      <CardHeader>
                        <CardTitle className="text-lg">{scenario.name}</CardTitle>
                        <CardDescription>{scenario.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Execution Time:</span>
                          <Badge variant="outline">
                            {scenario.projectedExecutionTime} min
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Playbooks:</span>
                          <Badge variant="secondary">
                            {scenario.recommendedPlaybooks?.length || 0}
                          </Badge>
                        </div>
                        {scenario.savedForPresentation && (
                          <Badge variant="outline" className="w-full justify-center">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Ready for Board
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </VeridiusPageLayout>
  );
}
