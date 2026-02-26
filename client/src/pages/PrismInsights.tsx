import { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
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
      timeframe: 'Q4 2026',
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
      color: 'teal'
    },
    {
      id: 'operational-efficiency',
      title: 'Operational Efficiency Matrix',
      dimension: 'operational',
      confidence: 87,
      impact: 'high',
      timeframe: 'Q1-Q2 2026',
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
      color: 'navy'
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
      color: 'gold'
    },
    {
      id: 'talent-dynamics',
      title: 'Talent & Culture Dynamics',
      dimension: 'human',
      confidence: 83,
      impact: 'medium',
      timeframe: 'Q2-Q3 2026',
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
      color: 'gold'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      teal: 'text-[#2B8A6E] bg-[#2B8A6E]/10 border-[#2B8A6E]/30',
      navy: 'text-[#0A0F2E] bg-[#0A0F2E]/10 border-[#0A0F2E]/30',
      gold: 'text-[#C9A84C] bg-[#C9A84C]/10 border-[#C9A84C]/30'
    };
    return colors[color as keyof typeof colors] || colors.navy;
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'bg-red-500/20 text-red-600 border-red-500/30';
      case 'high': return 'bg-[#C9A84C]/20 text-[#C9A84C] border-[#C9A84C]/30';
      case 'medium': return 'bg-[#C9A84C]/20 text-[#C9A84C] border-[#C9A84C]/30';
      case 'low': return 'bg-[#2B8A6E]/20 text-[#2B8A6E] border-[#2B8A6E]/30';
      default: return 'bg-black/5 text-gray-700 border-black/10';
    }
  };

  const filteredInsights = strategicInsights.filter(insight =>
    selectedDimension === 'all' || insight.dimension === selectedDimension
  );

  return (
    <PageLayout>
      <div className="bg-[#F8F7F4] min-h-screen p-6" data-testid="prism-insights">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Breadcrumb Navigation */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-[#0A0F2E]">
              <Link to="/">
                <Button variant="ghost" size="sm" className="text-[#0A0F2E] hover:bg-[#0A0F2E]/5 p-1 h-auto">
                  <Home className="h-4 w-4" />
                </Button>
              </Link>
              <span className="text-[#6B7280]">/</span>
              <span className="text-[#6B7280]">AI Intelligence</span>
              <span className="text-[#6B7280]">/</span>
              <span className="text-[#0A0F2E] font-medium">Prism Insights</span>
            </div>
          </div>

          {/* ROI Value Context */}
          <Card className="mb-4 bg-[#0A0F2E]/5 border-[#E8E4DC]" data-testid="prism-roi-context">
            <CardContent className="p-3 flex items-center gap-3">
              <div className="p-2 bg-[#0A0F2E] rounded-lg">
                <Layers className="h-5 w-5 text-[#C9A84C]" />
              </div>
              <div>
                <div className="font-semibold text-[#0A0F2E] text-sm">How Prism Saves You Money</div>
                <div className="text-xs text-[#6B7280]">Automates 40 hours/month of stakeholder analysis, saving $180K+ annually in executive time</div>
              </div>
            </CardContent>
          </Card>

          {/* Header */}
          <div className="bg-[#0A0F2E] text-white p-8 rounded-lg relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#C9A84C 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Layers className="h-10 w-10 text-[#C9A84C]" />
                <div>
                  <h1 className="text-3xl font-bold" style={{ fontFamily: "'Cormorant Garamond', serif" }} data-testid="prism-title">
                    Prism Insights
                  </h1>
                  <p className="text-white/70">Multi-dimensional strategic analysis and decision support intelligence</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <OnboardingTrigger pageId="prism-insights" autoStart={true} className="bg-white/10 border-white/30 text-white hover:bg-white/20" />
                <Link to="/">
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10" data-testid="back-to-dashboard">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Badge variant="outline" className="bg-[#2B8A6E]/20 text-[#2B8A6E] border-[#2B8A6E]/30" data-testid="ai-analysis-badge">
                  <Brain className="h-4 w-4 mr-2" />
                  AI ANALYSIS
                </Badge>
                <Button className="bg-[#C9A84C] text-[#0A0F2E] font-bold hover:bg-[#DFC178]" data-testid="generate-report-button">
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </div>
          </div>

          <Tabs value={selectedDimension} onValueChange={setSelectedDimension} className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-[#E8E4DC]">
              <TabsTrigger value="strategic" className="data-[state=active]:bg-white data-[state=active]:text-[#0A0F2E]">Strategic</TabsTrigger>
              <TabsTrigger value="operational" className="data-[state=active]:bg-white data-[state=active]:text-[#0A0F2E]">Operational</TabsTrigger>
              <TabsTrigger value="financial" className="data-[state=active]:bg-white data-[state=active]:text-[#0A0F2E]">Financial</TabsTrigger>
              <TabsTrigger value="human" className="data-[state=active]:bg-white data-[state=active]:text-[#0A0F2E]">Human Capital</TabsTrigger>
              <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-[#0A0F2E]">All Dimensions</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedDimension} className="space-y-6">
              {/* Analysis Tools Bar */}
              <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
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
                <div className="text-sm text-gray-800">
                  {filteredInsights.length} insights • Last updated: 2 minutes ago
                </div>
              </div>

              {/* Insights Grid */}
              <div className="space-y-6">
                {filteredInsights.map((insight) => (
                  <Card key={insight.id} className="border-gray-200 bg-white backdrop-blur-sm hover:border-[#C9A84C]/30 transition-colors" data-testid={`insight-${insight.id}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-lg ${getColorClasses(insight.color)}`}>
                            {insight.icon}
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">{insight.title}</h3>
                            <p className="text-gray-800 capitalize">{insight.dimension} Analysis • {insight.timeframe}</p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Badge variant="outline" className={getImpactColor(insight.impact)}>
                            {insight.impact.toUpperCase()} IMPACT
                          </Badge>
                          <div className="text-right">
                            <div className="text-sm text-gray-800">Confidence</div>
                            <div className="text-lg font-bold text-gray-900">{insight.confidence}%</div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <p className="text-gray-800">{insight.description}</p>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Lightbulb className="h-4 w-4 text-[#C9A84C]" />
                            Key Insights
                          </h4>
                          <ul className="space-y-2">
                            {insight.insights.map((item, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm text-[#6B7280]">
                                <div className="w-1.5 h-1.5 bg-[#0A0F2E] rounded-full mt-2 flex-shrink-0"></div>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Target className="h-4 w-4 text-[#2B8A6E]" />
                            Strategic Recommendations
                          </h4>
                          <ul className="space-y-2">
                            {insight.recommendations.map((item, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm text-[#6B7280]">
                                <div className="w-1.5 h-1.5 bg-[#2B8A6E] rounded-full mt-2 flex-shrink-0"></div>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-4 w-4 mr-2" />
                          Deep Dive Analysis
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          View Data
                        </Button>
                        <Button size="sm" className="flex-1 bg-[#0A0F2E] hover:bg-[#0A0F2E]">
                          <Download className="h-4 w-4 mr-2" />
                          Export Report
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* AI Summary */}
              <Card className="border-[#0A0F2E]/30 bg-[#0A0F2E]/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#C9A84C]">
                    <Brain className="h-5 w-5" />
                    Cross-Dimensional AI Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-[#C9A84C]/5 rounded-lg border border-[#C9A84C]/30">
                      <p className="text-[#C9A84C] font-medium mb-2">Strategic Convergence</p>
                      <p className="text-[#6B7280] text-sm">Market positioning and financial modeling show 87% alignment, suggesting coordinated execution will maximize impact.</p>
                    </div>
                    <div className="p-4 bg-[#2B8A6E]/5 rounded-lg border border-[#2B8A6E]/30">
                      <p className="text-[#2B8A6E] font-medium mb-2">Optimization Opportunity</p>
                      <p className="text-[#6B7280] text-sm">Operational efficiency improvements can fund 73% of strategic market expansion with neutral cash flow impact.</p>
                    </div>
                    <div className="p-4 bg-[#C9A84C]/5 rounded-lg border border-[#C9A84C]/20">
                      <p className="text-[#C9A84C] font-medium mb-2">Risk-Adjusted Prioritization</p>
                      <p className="text-[#6B7280] text-sm">Human capital investments show highest risk-adjusted returns and should be prioritized for Q2 execution.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageLayout>
  );
}