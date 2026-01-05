import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import VeridiusPageLayout from '@/components/layout/VeridiusPageLayout';
import { 
  Zap, 
  Brain, 
  Play, 
  Target, 
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Clock,
  Users,
  BarChart3,
  Lightbulb,
  ArrowRight,
  Sparkles,
  Activity
} from 'lucide-react';

interface AnalysisResult {
  confidence: number;
  timeline: string;
  stakeholders: number;
  protocols: number;
  recommendations: string[];
}

export default function AIIntelligenceDemo() {
  const [demoScenario, setDemoScenario] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const demoScenarios = [
    {
      title: "Supply Chain Disruption", 
      description: "Major supplier bankruptcy affecting 40% of production capacity",
      aiRecommendation: "Activate alternative supplier network, implement rationing protocols, communicate with top 20 customers"
    },
    {
      title: "Market Opportunity",
      description: "Competitor withdrew from European market, leaving $200M opportunity",
      aiRecommendation: "Immediate market entry strategy, reallocate 30% of R&D budget, establish European operations"
    },
    {
      title: "Organizational Change",
      description: "Implementing hybrid work model across 5,000 employee organization",
      aiRecommendation: "Phased rollout starting with tech teams, invest in collaboration tools, cultural adaptation program"
    }
  ];

  const handleRunDemo = async (scenario: string) => {
    setIsAnalyzing(true);
    setDemoScenario(scenario);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setAnalysisResult({
      confidence: Math.floor(Math.random() * 8) + 85,
      timeline: "Immediate action required",
      stakeholders: Math.floor(Math.random() * 10) + 15,
      protocols: Math.floor(Math.random() * 5) + 6,
      recommendations: [
        "Activate crisis response protocols immediately",
        "Notify C-suite and board within 30 minutes", 
        "Implement stakeholder communication plan",
        "Deploy alternative resource allocation strategy"
      ]
    });
    
    setIsAnalyzing(false);
  };

  return (
    <VeridiusPageLayout>
      <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="p-8">
          {/* Demo Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Intelligence Live Demo</h1>
                <p className="text-gray-600 dark:text-gray-300">Experience Strategic Decision Intelligence in Real-Time</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="text-yellow-600 border-yellow-500/50">
                <Sparkles className="w-3 h-3 mr-1" />
                Live Demo Active
              </Badge>
              <Badge className="bg-yellow-600 text-white">
                Interactive
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Demo Scenarios */}
            <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900 dark:text-white">
                  <Play className="w-5 h-5 mr-2 text-blue-500" />
                  Interactive Demo Scenarios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  {demoScenarios.map((scenario, index) => (
                    <div key={index} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{scenario.title}</h4>
                        <Button 
                          size="sm" 
                          onClick={() => handleRunDemo(scenario.description)}
                          disabled={isAnalyzing}
                          data-testid={`button-demo-${scenario.title.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <Brain className="w-3 h-3 mr-1" />
                          Run AI Analysis
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{scenario.description}</p>
                      <div className="text-xs text-blue-600 dark:text-blue-400">
                        AI Recommendation: {scenario.aiRecommendation}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <Textarea 
                    placeholder="Or describe your own strategic scenario for AI analysis..."
                    value={demoScenario}
                    onChange={(e) => setDemoScenario(e.target.value)}
                    data-testid="textarea-custom-scenario"
                  />
                  <Button 
                    className="w-full" 
                    onClick={() => handleRunDemo(demoScenario)}
                    disabled={isAnalyzing || !demoScenario.trim()}
                    data-testid="button-analyze-custom-scenario"
                  >
                    {isAnalyzing ? (
                      <>
                        <Activity className="w-4 h-4 mr-2 animate-spin" />
                        AI Analyzing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Analyze with AI Intelligence
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* AI Analysis Results */}
            <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900 dark:text-white">
                  <Brain className="w-5 h-5 mr-2 text-purple-500" />
                  AI Intelligence Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!analysisResult && !isAnalyzing && (
                  <div className="text-center py-12">
                    <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Select a demo scenario to see AI intelligence in action</p>
                  </div>
                )}

                {isAnalyzing && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Brain className="w-8 h-8 text-white animate-pulse" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">AI Intelligence Processing...</p>
                    <p className="text-sm text-gray-500">Analyzing strategic options and generating recommendations</p>
                  </div>
                )}

                {analysisResult && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{(analysisResult as any).confidence}%</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">AI Confidence</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{(analysisResult as any).stakeholders}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Stakeholders</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">AI Strategic Recommendations</h4>
                      <div className="space-y-2">
                        {(analysisResult as any).recommendations.map((rec: string, index: number) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <CheckCircle className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <Button className="flex-1" data-testid="button-implement-recommendations">
                        <Target className="w-4 h-4 mr-2" />
                        Implement Recommendations
                      </Button>
                      <Button variant="outline" data-testid="button-export-analysis">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Export Analysis
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Demo Features */}
          <Card className="mt-8 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-200 dark:border-yellow-800">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900 dark:text-white">
                <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                Platform Demonstration Capabilities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <h5 className="font-medium text-gray-900 dark:text-white">Predictive Intelligence</h5>
                  <p className="text-xs text-gray-600 dark:text-gray-400">85-92% accuracy</p>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h5 className="font-medium text-gray-900 dark:text-white">Rapid Response</h5>
                  <p className="text-xs text-gray-600 dark:text-gray-400">4-minute activation</p>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h5 className="font-medium text-gray-900 dark:text-white">Stakeholder Coordination</h5>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Automated notifications</p>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h5 className="font-medium text-gray-900 dark:text-white">Success Optimization</h5>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Continuous learning</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </VeridiusPageLayout>
  );
}