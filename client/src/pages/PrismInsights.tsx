import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'wouter';
import OnboardingTrigger from '@/components/onboarding/OnboardingTrigger';
import { 
  Layers, 
  Brain, 
  Target,
  TrendingUp,
  Users,
  DollarSign,
  Globe,
  Lightbulb,
  Eye,
  Search,
  BarChart3,
  Filter,
  Download,
  ArrowLeft,
  Home
} from 'lucide-react';

export default function PrismInsights() {
  const [selectedDimension, setSelectedDimension] = useState('strategic');

  const strategicInsights = [
    {
      id: 'market-positioning',
      title: 'Market Positioning Analysis',
      dimension: 'strategic',
      confidence: 94,
      impact: 'high',
      timeframe: 'Q4 2025',
      description: 'Multi-dimensional analysis reveals optimal market positioning for competitive advantage',
      insights: [
        'Premium positioning in emerging markets shows 340% ROI potential',
        'Customer acquisition cost decreasing by 23% in target segments',
        'Brand perception alignment with market demands at 89%'
      ],
      recommendations: [
        'Accelerate premium product line expansion',
        'Increase marketing spend in emerging markets by 45%',
        'Develop partnerships with key market influencers'
      ],
      icon: <Target className="h-5 w-5" />,
      color: 'emerald'
    },
    {
      id: 'operational-efficiency',
      title: 'Operational Efficiency Matrix',
      dimension: 'operational',
      confidence: 87,
      impact: 'high',
      timeframe: 'Q1-Q2 2025',
      description: 'Cross-functional analysis identifying efficiency optimization opportunities',
      insights: [
        'Process automation potential in 67% of current workflows',
        'Resource allocation misalignment costing $2.3M annually',
        'Team productivity varies by 34% across departments'
      ],
      recommendations: [
        'Implement AI-driven process automation in high-impact areas',
        'Restructure resource allocation based on performance data',
        'Deploy standardized productivity enhancement protocols'
      ],
      icon: <BarChart3 className="h-5 w-5" />,
      color: 'blue'
    },
    {
      id: 'financial-modeling',
      title: 'Financial Performance Modeling',
      dimension: 'financial',
      confidence: 91,
      impact: 'critical',
      timeframe: 'Ongoing',
      description: 'Multi-variable financial analysis with predictive modeling capabilities',
      insights: [
        'Revenue growth trajectory shows 28% YoY increase potential',
        'Cost optimization opportunities worth $4.7M identified',
        'Investment portfolio showing 15% above-market performance'
      ],
      recommendations: [
        'Diversify revenue streams to reduce single-point risk',
        'Implement advanced cost management systems',
        'Expand high-performing investment allocations'
      ],
      icon: <DollarSign className="h-5 w-5" />,
      color: 'purple'
    },
    {
      id: 'talent-dynamics',
      title: 'Talent & Culture Dynamics',
      dimension: 'human',
      confidence: 83,
      impact: 'medium',
      timeframe: 'Q2-Q3 2025',
      description: 'Comprehensive analysis of human capital and organizational culture',
      insights: [
        'Employee engagement correlation with performance at 0.78',
        'Skills gap analysis reveals critical shortages in 3 key areas',
        'Leadership effectiveness rating increased 12% this quarter'
      ],
      recommendations: [
        'Launch targeted upskilling programs for identified gaps',
        'Implement advanced employee engagement initiatives',
        'Expand leadership development across all levels'
      ],
      icon: <Users className="h-5 w-5" />,
      color: 'orange'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      blue: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
      purple: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      orange: 'text-orange-400 bg-orange-500/10 border-orange-500/30'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const filteredInsights = strategicInsights.filter(insight =>
    selectedDimension === 'all' || insight.dimension === selectedDimension
  );

  return (
    <>
      <div className="page-background min-h-screen bg-transparent p-6" data-testid="prism-insights">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Breadcrumb Navigation */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Link to="/">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-1 h-auto">
                  <Home className="h-4 w-4" />
                </Button>
              </Link>
              <span>/</span>
              <span>AI Intelligence</span>
              <span>/</span>
              <span className="text-white">Prism Insights</span>
            </div>
          </div>

          {/* ROI Value Context - Tier 2 Enhancement */}
          <Card className="mb-4 bg-purple-50 dark:bg-purple-950/20 border-purple-300 dark:border-purple-700" data-testid="prism-roi-context">
            <CardContent className="p-3 flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Layers className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="font-semibold text-purple-900 dark:text-purple-100 text-sm">How Prism Saves You Money</div>
                <div className="text-xs text-purple-700 dark:text-purple-300">Automates 40 hours/month of stakeholder analysis, saving $180K+ annually in executive time</div>
              </div>
            </CardContent>
          </Card>

          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Layers className="h-10 w-10" />
                <div>
                  <h1 className="text-3xl font-bold" data-testid="prism-title">
                    Prism Insights
                  </h1>
                  <p className="text-purple-100">Multi-dimensional strategic analysis and decision support intelligence</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <OnboardingTrigger pageId="prism-insights" autoStart={true} className="bg-white/10 border-white/30 text-white hover:bg-white/20" />
                <Link to="/">
                  <Button variant="secondary" className="bg-purple-700 hover:bg-purple-800 text-purple-100 border-purple-600" data-testid="back-to-dashboard">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Badge variant="secondary" className="bg-purple-700 text-purple-100 border-purple-600" data-testid="ai-analysis-badge">
                  <Brain className="h-4 w-4 mr-2" />
                  AI ANALYSIS
                </Badge>
                <Button variant="secondary" className="bg-pink-600 hover:bg-pink-700 text-white" data-testid="generate-report-button">
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </div>
          </div>

          <Tabs value={selectedDimension} onValueChange={setSelectedDimension} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="strategic" data-testid="tab-strategic">Strategic</TabsTrigger>
              <TabsTrigger value="operational" data-testid="tab-operational">Operational</TabsTrigger>
              <TabsTrigger value="financial" data-testid="tab-financial">Financial</TabsTrigger>
              <TabsTrigger value="human" data-testid="tab-human">Human Capital</TabsTrigger>
              <TabsTrigger value="all" data-testid="tab-all">All Dimensions</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedDimension} className="space-y-6">
              {/* Analysis Tools Bar */}
              <div className="flex items-center justify-between bg-gray-900/50 p-4 rounded-lg border border-gray-700/50">
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Search className="h-4 w-4 mr-2" />
                    Deep Dive
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Visualize
                  </Button>
                </div>
                <div className="text-sm text-gray-400">
                  {filteredInsights.length} insights • Last updated: 2 minutes ago
                </div>
              </div>

              {/* Insights Grid */}
              <div className="space-y-6">
                {filteredInsights.map((insight) => (
                  <Card key={insight.id} className="border-gray-700/50 bg-gray-900/50 backdrop-blur-sm hover:border-purple-500/30 transition-colors" data-testid={`insight-${insight.id}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-lg ${getColorClasses(insight.color)}`}>
                            {insight.icon}
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-white">{insight.title}</h3>
                            <p className="text-gray-400 capitalize">{insight.dimension} Analysis • {insight.timeframe}</p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Badge variant="outline" className={getImpactColor(insight.impact)}>
                            {insight.impact.toUpperCase()} IMPACT
                          </Badge>
                          <div className="text-right">
                            <div className="text-sm text-gray-400">Confidence</div>
                            <div className="text-lg font-bold text-white">{insight.confidence}%</div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <p className="text-gray-300">{insight.description}</p>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                            <Lightbulb className="h-4 w-4 text-yellow-400" />
                            Key Insights
                          </h4>
                          <ul className="space-y-2">
                            {insight.insights.map((item, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                            <Target className="h-4 w-4 text-green-400" />
                            Strategic Recommendations
                          </h4>
                          <ul className="space-y-2">
                            {insight.recommendations.map((item, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4 border-t border-gray-700/50">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-4 w-4 mr-2" />
                          Deep Dive Analysis
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          View Data
                        </Button>
                        <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700">
                          <Download className="h-4 w-4 mr-2" />
                          Export Report
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* AI Summary */}
              <Card className="border-blue-500/30 bg-blue-950/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-300">
                    <Brain className="h-5 w-5" />
                    Cross-Dimensional AI Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-purple-950/30 rounded-lg border border-purple-500/30">
                      <p className="text-purple-300 font-medium mb-2">Strategic Convergence</p>
                      <p className="text-purple-200 text-sm">Market positioning and financial modeling show 87% alignment, suggesting coordinated execution will maximize impact.</p>
                    </div>
                    <div className="p-4 bg-green-950/30 rounded-lg border border-green-500/30">
                      <p className="text-green-300 font-medium mb-2">Optimization Opportunity</p>
                      <p className="text-green-200 text-sm">Operational efficiency improvements can fund 73% of strategic market expansion with neutral cash flow impact.</p>
                    </div>
                    <div className="p-4 bg-orange-950/30 rounded-lg border border-orange-500/30">
                      <p className="text-orange-300 font-medium mb-2">Risk-Adjusted Prioritization</p>
                      <p className="text-orange-200 text-sm">Human capital investments show highest risk-adjusted returns and should be prioritized for Q2 execution.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}