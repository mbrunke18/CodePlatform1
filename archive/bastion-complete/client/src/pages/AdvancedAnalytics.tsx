import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Link } from 'wouter';
import VeridiusPageLayout from '@/components/layout/VeridiusPageLayout';
import { AIChat } from '@/components/AIChat';
import { 
  TrendingUp, 
  BarChart3, 
  Target, 
  DollarSign,
  AlertTriangle,
  Brain,
  Activity,
  Globe,
  Users,
  Zap,
  Clock,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Minus,
  ArrowLeft,
  Home,
  MessageSquare
} from 'lucide-react';

interface PredictiveModel {
  id: string;
  name: string;
  type: 'revenue' | 'market_share' | 'customer_churn' | 'operational_efficiency' | 'risk_assessment';
  accuracy: number;
  confidenceInterval: {
    lower: number;
    upper: number;
  };
  predictions: {
    period: string;
    value: number;
    probability: number;
    factors: string[];
  }[];
  keyDrivers: {
    factor: string;
    impact: number;
    trend: 'positive' | 'negative' | 'stable';
    significance: number;
  }[];
  scenarios: {
    name: string;
    probability: number;
    outcome: number;
    description: string;
  }[];
}

interface BusinessIntelligence {
  id: string;
  category: 'market' | 'financial' | 'operational' | 'competitive' | 'regulatory';
  insight: string;
  impact: 'high' | 'medium' | 'low';
  timeHorizon: 'immediate' | 'short_term' | 'long_term';
  actionRequired: boolean;
  quantifiedValue: number;
  riskLevel: number;
  sources: string[];
  recommendations: {
    action: string;
    priority: number;
    estimatedROI: number;
    timeToImplement: string;
  }[];
}

interface IndustryBenchmark {
  metric: string;
  ourPerformance: number;
  industryAverage: number;
  topQuartile: number;
  percentileRank: number;
  improvementPotential: number;
  competitiveGap: number;
  trends: {
    period: string;
    value: number;
    industryValue: number;
  }[];
}

export default function AdvancedAnalytics() {
  const [activeTab, setActiveTab] = useState('predictive');
  const [predictiveModels, setPredictiveModels] = useState<PredictiveModel[]>([]);
  const [businessIntelligence, setBusinessIntelligence] = useState<BusinessIntelligence[]>([]);
  const [industryBenchmarks, setIndustryBenchmarks] = useState<IndustryBenchmark[]>([]);

  useEffect(() => {
    // Advanced Predictive Models
    const models: PredictiveModel[] = [
      {
        id: 'revenue-forecast',
        name: 'Revenue Forecasting Model',
        type: 'revenue',
        accuracy: 94.7,
        confidenceInterval: { lower: 92.1, upper: 97.3 },
        predictions: [
          { period: 'Q2 2024', value: 3200000, probability: 87.3, factors: ['market expansion', 'product launch', 'seasonal trends'] },
          { period: 'Q3 2024', value: 3850000, probability: 82.1, factors: ['new customer acquisition', 'price optimization'] },
          { period: 'Q4 2024', value: 4100000, probability: 78.9, factors: ['holiday seasonality', 'enterprise contracts'] }
        ],
        keyDrivers: [
          { factor: 'Customer Acquisition Rate', impact: 0.34, trend: 'positive', significance: 0.92 },
          { factor: 'Average Contract Value', impact: 0.28, trend: 'positive', significance: 0.87 },
          { factor: 'Market Expansion', impact: 0.23, trend: 'positive', significance: 0.81 },
          { factor: 'Competitive Pressure', impact: -0.15, trend: 'negative', significance: 0.76 }
        ],
        scenarios: [
          { name: 'Best Case', probability: 15, outcome: 4500000, description: 'Major enterprise wins + market expansion success' },
          { name: 'Expected', probability: 70, outcome: 3850000, description: 'Normal growth trajectory with current initiatives' },
          { name: 'Conservative', probability: 15, outcome: 3200000, description: 'Market headwinds + delayed initiatives' }
        ]
      },
      {
        id: 'churn-prediction',
        name: 'Customer Churn Risk Model',
        type: 'customer_churn',
        accuracy: 91.2,
        confidenceInterval: { lower: 89.8, upper: 92.6 },
        predictions: [
          { period: 'Next 30 Days', value: 3.2, probability: 94.1, factors: ['engagement decline', 'support tickets', 'usage patterns'] },
          { period: 'Next 90 Days', value: 8.7, probability: 89.3, factors: ['contract renewal timing', 'competitive activity'] },
          { period: 'Next 180 Days', value: 15.4, probability: 83.7, factors: ['budget cycles', 'feature gap analysis'] }
        ],
        keyDrivers: [
          { factor: 'Product Engagement Score', impact: -0.42, trend: 'negative', significance: 0.95 },
          { factor: 'Support Ticket Volume', impact: 0.31, trend: 'positive', significance: 0.88 },
          { factor: 'Feature Utilization', impact: -0.29, trend: 'stable', significance: 0.82 },
          { factor: 'Contract Value', impact: -0.18, trend: 'stable', significance: 0.74 }
        ],
        scenarios: [
          { name: 'High Risk', probability: 20, outcome: 22.1, description: 'Major product issues + competitive pressure' },
          { name: 'Baseline', probability: 65, outcome: 8.7, description: 'Normal churn patterns with current interventions' },
          { name: 'Optimized', probability: 15, outcome: 4.2, description: 'Successful retention programs + product improvements' }
        ]
      }
    ];

    // Business Intelligence Insights
    const intelligence: BusinessIntelligence[] = [
      {
        id: 'market-opportunity',
        category: 'market',
        insight: 'AI automation market segment shows 67% growth potential with $4.2M revenue opportunity in next 18 months',
        impact: 'high',
        timeHorizon: 'short_term',
        actionRequired: true,
        quantifiedValue: 4200000,
        riskLevel: 23,
        sources: ['Gartner Research', 'IDC Market Analysis', 'Forrester Reports', 'Internal Sales Data'],
        recommendations: [
          { action: 'Accelerate AI product development', priority: 1, estimatedROI: 340, timeToImplement: '6 months' },
          { action: 'Strategic partnership with AI vendors', priority: 2, estimatedROI: 225, timeToImplement: '3 months' },
          { action: 'Sales team specialization training', priority: 3, estimatedROI: 180, timeToImplement: '2 months' }
        ]
      },
      {
        id: 'operational-efficiency',
        category: 'operational',
        insight: 'Process automation could reduce operational costs by $1.8M annually while improving delivery speed by 34%',
        impact: 'high',
        timeHorizon: 'immediate',
        actionRequired: true,
        quantifiedValue: 1800000,
        riskLevel: 12,
        sources: ['McKinsey Operations Study', 'Internal Process Analysis', 'Vendor Benchmarking'],
        recommendations: [
          { action: 'Implement RPA for finance processes', priority: 1, estimatedROI: 280, timeToImplement: '4 months' },
          { action: 'Automate customer onboarding', priority: 2, estimatedROI: 195, timeToImplement: '3 months' },
          { action: 'Deploy AI-powered quality assurance', priority: 3, estimatedROI: 165, timeToImplement: '5 months' }
        ]
      },
      {
        id: 'competitive-threat',
        category: 'competitive',
        insight: 'Competitor X launching similar solution in Q3 with 25% lower pricing - potential 15% market share impact',
        impact: 'high',
        timeHorizon: 'short_term',
        actionRequired: true,
        quantifiedValue: -2300000,
        riskLevel: 78,
        sources: ['Competitive Intelligence', 'Industry Reports', 'Sales Team Feedback', 'Customer Surveys'],
        recommendations: [
          { action: 'Accelerate unique feature development', priority: 1, estimatedROI: 210, timeToImplement: '4 months' },
          { action: 'Implement value-based pricing strategy', priority: 2, estimatedROI: 175, timeToImplement: '2 months' },
          { action: 'Strengthen customer relationships', priority: 3, estimatedROI: 145, timeToImplement: '1 month' }
        ]
      }
    ];

    // Industry Benchmarks
    const benchmarks: IndustryBenchmark[] = [
      {
        metric: 'Customer Acquisition Cost',
        ourPerformance: 1250,
        industryAverage: 1580,
        topQuartile: 980,
        percentileRank: 72,
        improvementPotential: 270,
        competitiveGap: -330,
        trends: [
          { period: 'Q1 2024', value: 1320, industryValue: 1620 },
          { period: 'Q2 2024', value: 1285, industryValue: 1590 },
          { period: 'Q3 2024', value: 1250, industryValue: 1580 }
        ]
      },
      {
        metric: 'Revenue per Employee',
        ourPerformance: 285000,
        industryAverage: 245000,
        topQuartile: 320000,
        percentileRank: 68,
        improvementPotential: 35000,
        competitiveGap: 40000,
        trends: [
          { period: 'Q1 2024', value: 275000, industryValue: 240000 },
          { period: 'Q2 2024', value: 280000, industryValue: 242000 },
          { period: 'Q3 2024', value: 285000, industryValue: 245000 }
        ]
      },
      {
        metric: 'Net Promoter Score',
        ourPerformance: 67,
        industryAverage: 52,
        topQuartile: 75,
        percentileRank: 78,
        improvementPotential: 8,
        competitiveGap: 15,
        trends: [
          { period: 'Q1 2024', value: 63, industryValue: 50 },
          { period: 'Q2 2024', value: 65, industryValue: 51 },
          { period: 'Q3 2024', value: 67, industryValue: 52 }
        ]
      }
    ];

    setPredictiveModels(models);
    setBusinessIntelligence(intelligence);
    setIndustryBenchmarks(benchmarks);
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'positive': return <ArrowUp className="h-4 w-4 text-emerald-400" />;
      case 'negative': return <ArrowDown className="h-4 w-4 text-red-400" />;
      default: return <Minus className="h-4 w-4 text-amber-400" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'medium': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'low': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  return (
    <VeridiusPageLayout>
      <div className="flex-1 overflow-y-auto p-8 space-y-8">
        
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-1 h-auto">
                <Home className="h-4 w-4" />
              </Button>
            </Link>
            <span>/</span>
            <span>Analytics & Intelligence</span>
            <span>/</span>
            <span className="text-white">Advanced Analytics</span>
          </div>
        </div>

        {/* Advanced Analytics Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Advanced Business Intelligence</h1>
            <p className="text-slate-300">Predictive analytics, market intelligence, and competitive benchmarking</p>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="secondary" className="bg-slate-700 hover:bg-slate-600 text-slate-100 border-slate-600">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
              <Brain className="w-4 h-4 mr-2" />
              AI Models Active: 12
            </Badge>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <BarChart3 className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Advanced Analytics Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-800/50 border border-slate-700/50">
            <TabsTrigger value="predictive" className="data-[state=active]:bg-slate-700">Predictive Models</TabsTrigger>
            <TabsTrigger value="intelligence" className="data-[state=active]:bg-slate-700">Business Intelligence</TabsTrigger>
            <TabsTrigger value="benchmarks" className="data-[state=active]:bg-slate-700">Industry Benchmarks</TabsTrigger>
            <TabsTrigger value="scenarios" className="data-[state=active]:bg-slate-700">Scenario Analysis</TabsTrigger>
            <TabsTrigger value="ai-chat" className="data-[state=active]:bg-slate-700 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              AI Chat
            </TabsTrigger>
          </TabsList>

          {/* Predictive Models */}
          <TabsContent value="predictive" className="space-y-6">
            <div className="space-y-6">
              {predictiveModels.map((model) => (
                <Card key={model.id} className="bg-slate-900/50 border-slate-700/50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white flex items-center gap-3">
                        <Brain className="h-6 w-6" />
                        {model.name}
                      </CardTitle>
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                        {model.accuracy}% Accuracy
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    
                    {/* Predictions */}
                    <div>
                      <h4 className="font-semibold text-white mb-3">Forecasts</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {model.predictions.map((prediction, index) => (
                          <div key={index} className="p-4 bg-slate-800/50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-white font-medium">{prediction.period}</span>
                              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                                {prediction.probability}% Confidence
                              </Badge>
                            </div>
                            <div className="text-2xl font-bold text-white mb-2">
                              {model.type === 'revenue' ? formatCurrency(prediction.value) : 
                               model.type === 'customer_churn' ? `${prediction.value}%` : 
                               prediction.value.toLocaleString()}
                            </div>
                            <div className="text-xs text-slate-400">
                              Key factors: {prediction.factors.slice(0, 2).join(', ')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Key Drivers */}
                    <div>
                      <h4 className="font-semibold text-white mb-3">Key Drivers</h4>
                      <div className="space-y-3">
                        {model.keyDrivers.map((driver, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                            <div className="flex items-center gap-3">
                              {getTrendIcon(driver.trend)}
                              <span className="text-white">{driver.factor}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div className="text-sm font-medium text-white">
                                  {(Math.abs(driver.impact) * 100).toFixed(1)}% Impact
                                </div>
                                <div className="text-xs text-slate-400">
                                  {(driver.significance * 100).toFixed(0)}% Significance
                                </div>
                              </div>
                              <Progress value={driver.significance * 100} className="w-20 h-2" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Scenarios */}
                    <div>
                      <h4 className="font-semibold text-white mb-3">Scenario Analysis</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {model.scenarios.map((scenario, index) => (
                          <div key={index} className="p-4 bg-slate-800/50 rounded-lg border border-slate-600/50">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-white">{scenario.name}</span>
                              <span className="text-sm text-slate-400">{scenario.probability}%</span>
                            </div>
                            <div className="text-xl font-bold text-white mb-2">
                              {model.type === 'revenue' ? formatCurrency(scenario.outcome) : `${scenario.outcome}%`}
                            </div>
                            <p className="text-xs text-slate-400">{scenario.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Business Intelligence */}
          <TabsContent value="intelligence" className="space-y-6">
            <div className="space-y-4">
              {businessIntelligence.map((insight) => (
                <Card key={insight.id} className="bg-slate-900/50 border-slate-700/50">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className={getImpactColor(insight.impact)}>
                            {insight.impact.toUpperCase()} IMPACT
                          </Badge>
                          <Badge variant="outline" className="border-slate-600 text-slate-300">
                            {insight.category.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="border-slate-600 text-slate-300">
                            {insight.timeHorizon.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-white text-lg mb-4">{insight.insight}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-slate-400">Financial Impact</div>
                        <div className={`text-2xl font-bold ${insight.quantifiedValue > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {insight.quantifiedValue > 0 ? '+' : ''}{formatCurrency(insight.quantifiedValue)}
                        </div>
                        <div className="text-sm text-slate-400">Risk Level: {insight.riskLevel}%</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-white mb-2">Data Sources</h4>
                        <div className="space-y-1">
                          {insight.sources.map((source, index) => (
                            <div key={index} className="text-sm text-slate-300 flex items-center gap-2">
                              <CheckCircle className="w-3 h-3 text-emerald-400" />
                              {source}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-white mb-2">Recommended Actions</h4>
                        <div className="space-y-2">
                          {insight.recommendations.slice(0, 2).map((rec, index) => (
                            <div key={index} className="p-2 bg-slate-800/50 rounded">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-white">{rec.action}</span>
                                <span className="text-xs text-emerald-400">{rec.estimatedROI}% ROI</span>
                              </div>
                              <div className="text-xs text-slate-400">Timeline: {rec.timeToImplement}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Industry Benchmarks */}
          <TabsContent value="benchmarks" className="space-y-6">
            <div className="space-y-6">
              {industryBenchmarks.map((benchmark, index) => (
                <Card key={index} className="bg-slate-900/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white">{benchmark.metric}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="text-sm text-slate-400 mb-1">Our Performance</div>
                        <div className="text-2xl font-bold text-white">
                          {benchmark.metric.includes('Cost') || benchmark.metric.includes('Revenue') ? 
                            formatCurrency(benchmark.ourPerformance) : benchmark.ourPerformance.toLocaleString()}
                        </div>
                        <div className="text-xs text-emerald-400">
                          {benchmark.percentileRank}th percentile
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm text-slate-400 mb-1">Industry Average</div>
                        <div className="text-2xl font-bold text-slate-300">
                          {benchmark.metric.includes('Cost') || benchmark.metric.includes('Revenue') ? 
                            formatCurrency(benchmark.industryAverage) : benchmark.industryAverage.toLocaleString()}
                        </div>
                        <div className={`text-xs ${benchmark.competitiveGap > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {benchmark.competitiveGap > 0 ? '+' : ''}{formatCurrency(benchmark.competitiveGap)} vs us
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm text-slate-400 mb-1">Top Quartile</div>
                        <div className="text-2xl font-bold text-amber-300">
                          {benchmark.metric.includes('Cost') || benchmark.metric.includes('Revenue') ? 
                            formatCurrency(benchmark.topQuartile) : benchmark.topQuartile.toLocaleString()}
                        </div>
                        <div className="text-xs text-amber-400">
                          Target performance
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm text-slate-400 mb-1">Improvement Potential</div>
                        <div className="text-2xl font-bold text-blue-300">
                          {benchmark.metric.includes('Cost') || benchmark.metric.includes('Revenue') ? 
                            formatCurrency(benchmark.improvementPotential) : benchmark.improvementPotential.toLocaleString()}
                        </div>
                        <div className="text-xs text-blue-400">
                          To reach top quartile
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Scenario Analysis */}
          <TabsContent value="scenarios" className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Monte Carlo Business Scenarios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-slate-400 py-12">
                  <BarChart3 className="h-16 w-16 mx-auto mb-4" />
                  <p>Advanced Monte Carlo simulations and sensitivity analysis</p>
                  <p className="text-sm">10,000+ scenario iterations with probability distributions</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </VeridiusPageLayout>
  );
}