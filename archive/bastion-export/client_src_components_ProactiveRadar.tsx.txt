import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { 
  Radar, 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  RefreshCw,
  Lightbulb,
  Target,
  Search,
  BarChart3,
  Activity,
  Eye,
  Zap
} from 'lucide-react';

interface RadarStatus {
  isScanning: boolean;
  activeDataStreams: number;
  totalDataStreams: number;
  activeAlertTriggers: number;
  totalAlertTriggers: number;
  lastScanTime?: string;
}

interface RadarResponse {
  success: boolean;
  status: RadarStatus;
  timestamp: string;
}

interface SyntheticScenario {
  title: string;
  description: string;
  category: string;
  likelihood: number;
  potentialImpact: string;
  timeHorizon: string;
  triggerSigns: string[];
  keyStakeholders: string[];
  strategicImplications: string;
}

interface IntuitionValidation {
  validation: string;
  validationScore: number;
  supportingData: string[];
  contradictingData: string[];
  recommendedActions: string[];
  reasoning: string;
}

/**
 * Proactive AI Radar Component - The Executive Strategic Co-pilot
 * 
 * This component provides C-suite executives with:
 * - Real-time AI radar monitoring status
 * - Manual trigger capabilities for immediate insights
 * - Synthetic scenario generation beyond historical templates
 * - Executive intuition validation with data backing
 */
export default function ProactiveRadar() {
  const [activeTab, setActiveTab] = useState('status');
  const [scenarioQuery, setScenarioQuery] = useState('');
  const [intuitionForm, setIntuitionForm] = useState({
    title: '',
    description: '',
    timeframe: 'medium-term',
    relatedDomain: 'general',
    confidenceLevel: 'medium'
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query AI Radar status
  const { data: radarStatus, isLoading: statusLoading } = useQuery<RadarResponse>({
    queryKey: ['/api/ai-radar/status'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Manual scan mutation
  const scanMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/ai-radar/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "AI Radar Scan Completed",
        description: "Proactive analysis completed. Check your dashboard for new strategic insights.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/ai-radar/status'] });
    },
    onError: () => {
      toast({
        title: "Scan Failed",
        description: "AI Radar scan encountered an issue. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Synthetic scenarios mutation
  const scenarioMutation = useMutation({
    mutationFn: async (query: string) => {
      const response = await fetch('/api/synthetic-scenarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query,
          organizationId: 'current-org' 
        }),
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Synthetic Scenarios Generated",
        description: "AI has generated novel strategic scenarios based on your query.",
      });
      setScenarioQuery('');
    },
    onError: () => {
      toast({
        title: "Generation Failed",
        description: "Failed to generate synthetic scenarios. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Intuition validation mutation
  const intuitionMutation = useMutation({
    mutationFn: async (intuition: typeof intuitionForm) => {
      const response = await fetch('/api/intuition-validation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(intuition),
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Intuition Validated",
        description: "AI has analyzed your strategic hunch with data-driven insights.",
      });
      setIntuitionForm({
        title: '',
        description: '',
        timeframe: 'medium-term',
        relatedDomain: 'general',
        confidenceLevel: 'medium'
      });
    },
    onError: () => {
      toast({
        title: "Validation Failed",
        description: "Failed to validate executive intuition. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleScenarioGeneration = () => {
    if (!scenarioQuery.trim()) {
      toast({
        title: "Query Required",
        description: "Please enter a strategic question or context for scenario generation.",
        variant: "destructive",
      });
      return;
    }
    scenarioMutation.mutate(scenarioQuery);
  };

  const handleIntuitionValidation = () => {
    if (!intuitionForm.title.trim() || !intuitionForm.description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both a title and description for your intuition.",
        variant: "destructive",
      });
      return;
    }
    intuitionMutation.mutate(intuitionForm);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6" data-testid="proactive-radar-dashboard">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Radar className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Proactive AI Radar</h2>
            <p className="text-gray-600">Strategic Co-pilot for Executive Decision Making</p>
          </div>
        </div>
        
        <Button 
          onClick={() => scanMutation.mutate()}
          disabled={scanMutation.isPending}
          className="bg-blue-600 hover:bg-blue-700"
          data-testid="button-manual-scan"
        >
          {scanMutation.isPending ? (
            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Search className="h-4 w-4 mr-2" />
          )}
          {scanMutation.isPending ? 'Scanning...' : 'Manual Scan'}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="status" data-testid="tab-status">Radar Status</TabsTrigger>
          <TabsTrigger value="scenarios" data-testid="tab-scenarios">Synthetic Futures</TabsTrigger>
          <TabsTrigger value="intuition" data-testid="tab-intuition">Intuition Validation</TabsTrigger>
          <TabsTrigger value="insights" data-testid="tab-insights">Live Insights</TabsTrigger>
        </TabsList>

        {/* Radar Status Tab */}
        <TabsContent value="status" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* System Status */}
            <Card data-testid="card-system-status">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Activity className="h-4 w-4 mr-2" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  {radarStatus?.status?.isScanning ? (
                    <>
                      <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-green-600">Active Scanning</span>
                    </>
                  ) : (
                    <>
                      <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm font-medium text-yellow-600">Standby Mode</span>
                    </>
                  )}
                </div>
                <div className="mt-2 text-xs text-gray-500" data-testid="text-last-scan">
                  Last Scan: {radarStatus?.status?.lastScanTime ? 
                    new Date(radarStatus.status.lastScanTime).toLocaleTimeString() : 
                    'Never'
                  }
                </div>
              </CardContent>
            </Card>

            {/* Data Streams */}
            <Card data-testid="card-data-streams">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Data Streams
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-active-streams">
                  {radarStatus?.status?.activeDataStreams || 0}/{radarStatus?.status?.totalDataStreams || 0}
                </div>
                <div className="text-xs text-gray-500">Active Monitoring</div>
                <Progress 
                  value={radarStatus?.status?.totalDataStreams ? 
                    (radarStatus.status.activeDataStreams / radarStatus.status.totalDataStreams) * 100 : 0
                  } 
                  className="mt-2 h-2"
                />
              </CardContent>
            </Card>

            {/* Alert Triggers */}
            <Card data-testid="card-alert-triggers">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Alert Triggers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-active-triggers">
                  {radarStatus?.status?.activeAlertTriggers || 0}/{radarStatus?.status?.totalAlertTriggers || 0}
                </div>
                <div className="text-xs text-gray-500">Ready to Alert</div>
                <Progress 
                  value={radarStatus?.status?.totalAlertTriggers ? 
                    (radarStatus.status.activeAlertTriggers / radarStatus.status.totalAlertTriggers) * 100 : 0
                  } 
                  className="mt-2 h-2"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Synthetic Scenarios Tab */}
        <TabsContent value="scenarios" className="space-y-4">
          <Card data-testid="card-scenario-generator">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                Synthetic Futures Engine
              </CardTitle>
              <p className="text-sm text-gray-600">
                Generate novel strategic scenarios beyond historical templates using AI intelligence.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="scenario-query">Executive Query</Label>
                <Textarea
                  id="scenario-query"
                  placeholder="Ask strategic questions like: 'What are the three most likely black swan events for our industry in the next 18 months?' or 'How might AI disruption affect our supply chain over the next 2 years?'"
                  value={scenarioQuery}
                  onChange={(e) => setScenarioQuery(e.target.value)}
                  className="mt-1"
                  data-testid="textarea-scenario-query"
                />
              </div>
              
              <Button 
                onClick={handleScenarioGeneration}
                disabled={scenarioMutation.isPending}
                className="w-full"
                data-testid="button-generate-scenarios"
              >
                {scenarioMutation.isPending ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Lightbulb className="h-4 w-4 mr-2" />
                )}
                {scenarioMutation.isPending ? 'Generating...' : 'Generate Synthetic Scenarios'}
              </Button>

              {scenarioMutation.data?.scenarios && (
                <div className="space-y-3 mt-4" data-testid="div-generated-scenarios">
                  <h4 className="font-medium">Generated Scenarios:</h4>
                  {scenarioMutation.data.scenarios.map((scenario: SyntheticScenario, index: number) => (
                    <Alert key={index} className="border-blue-200">
                      <Target className="h-4 w-4" />
                      <AlertDescription>
                        <div className="space-y-2">
                          <div className="font-medium">{scenario.title}</div>
                          <div className="text-sm text-gray-600">{scenario.description}</div>
                          <div className="flex space-x-4 text-xs">
                            <Badge variant="outline">Likelihood: {(scenario.likelihood * 100).toFixed(0)}%</Badge>
                            <Badge variant="outline">Impact: {scenario.potentialImpact}</Badge>
                            <Badge variant="outline">Timeline: {scenario.timeHorizon}</Badge>
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Intuition Validation Tab */}
        <TabsContent value="intuition" className="space-y-4">
          <Card data-testid="card-intuition-validator">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                Intuition Validation
              </CardTitle>
              <p className="text-sm text-gray-600">
                Submit your strategic hunches for AI validation and data-driven analysis.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="intuition-title">Intuition Title</Label>
                  <Input
                    id="intuition-title"
                    placeholder="Brief title for your strategic hunch"
                    value={intuitionForm.title}
                    onChange={(e) => setIntuitionForm({...intuitionForm, title: e.target.value})}
                    data-testid="input-intuition-title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="intuition-timeframe">Timeframe</Label>
                  <Select 
                    value={intuitionForm.timeframe} 
                    onValueChange={(value) => setIntuitionForm({...intuitionForm, timeframe: value})}
                  >
                    <SelectTrigger data-testid="select-intuition-timeframe">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate (0-3 months)</SelectItem>
                      <SelectItem value="short-term">Short-term (3-12 months)</SelectItem>
                      <SelectItem value="medium-term">Medium-term (1-3 years)</SelectItem>
                      <SelectItem value="long-term">Long-term (3+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="intuition-description">Detailed Description</Label>
                <Textarea
                  id="intuition-description"
                  placeholder="Describe your strategic intuition in detail. What patterns do you see? What makes you think this might happen?"
                  value={intuitionForm.description}
                  onChange={(e) => setIntuitionForm({...intuitionForm, description: e.target.value})}
                  className="mt-1"
                  data-testid="textarea-intuition-description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="intuition-domain">Related Domain</Label>
                  <Select 
                    value={intuitionForm.relatedDomain} 
                    onValueChange={(value) => setIntuitionForm({...intuitionForm, relatedDomain: value})}
                  >
                    <SelectTrigger data-testid="select-intuition-domain">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Business</SelectItem>
                      <SelectItem value="market">Market Dynamics</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="regulation">Regulatory</SelectItem>
                      <SelectItem value="competitive">Competitive Landscape</SelectItem>
                      <SelectItem value="financial">Financial Markets</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="intuition-confidence">Your Confidence</Label>
                  <Select 
                    value={intuitionForm.confidenceLevel} 
                    onValueChange={(value) => setIntuitionForm({...intuitionForm, confidenceLevel: value})}
                  >
                    <SelectTrigger data-testid="select-intuition-confidence">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Confidence</SelectItem>
                      <SelectItem value="medium">Medium Confidence</SelectItem>
                      <SelectItem value="high">High Confidence</SelectItem>
                      <SelectItem value="very_high">Very High Confidence</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={handleIntuitionValidation}
                disabled={intuitionMutation.isPending}
                className="w-full"
                data-testid="button-validate-intuition"
              >
                {intuitionMutation.isPending ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                {intuitionMutation.isPending ? 'Validating...' : 'Validate with AI Analysis'}
              </Button>

              {intuitionMutation.data?.validation && (
                <Alert className="border-green-200 mt-4" data-testid="alert-validation-results">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <div className="font-medium">AI Validation Results</div>
                      <div className="text-sm">
                        <strong>Assessment:</strong> {intuitionMutation.data.validation.validation}
                      </div>
                      <div className="text-sm">
                        <strong>Confidence Score:</strong> {(intuitionMutation.data.validation.validationScore * 100).toFixed(0)}%
                      </div>
                      <div className="text-sm">
                        <strong>Reasoning:</strong> {intuitionMutation.data.validation.reasoning}
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Live Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          <Card data-testid="card-live-insights">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Live Strategic Insights
              </CardTitle>
              <p className="text-sm text-gray-600">
                Real-time AI-generated insights and proactive alerts from continuous monitoring.
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500" data-testid="div-insights-placeholder">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>AI Radar is continuously scanning for strategic opportunities and risks.</p>
                <p className="text-sm mt-2">New insights will appear here as they are discovered.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => scanMutation.mutate()}
                  disabled={scanMutation.isPending}
                  data-testid="button-trigger-scan"
                >
                  Trigger Immediate Scan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}