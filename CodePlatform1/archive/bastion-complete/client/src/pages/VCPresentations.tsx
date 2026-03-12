import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import VeridiusPageLayout from '@/components/layout/VeridiusPageLayout';
import { 
  Briefcase, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target,
  Globe,
  ArrowRight,
  Download,
  Play,
  FileText,
  BarChart3,
  Presentation,
  Building2,
  Rocket,
  Crown,
  Star,
  CheckCircle,
  Clock
} from 'lucide-react';

export default function VCPresentations() {
  const investmentHighlights = [
    {
      title: "Market Opportunity",
      value: "$847B",
      subtitle: "Enterprise intelligence market size",
      growth: "+18.2% CAGR",
      color: "text-blue-600"
    },
    {
      title: "Current Traction",
      value: "178",
      subtitle: "Enterprise components deployed",
      growth: "98/100 quality score",
      color: "text-green-600"
    },
    {
      title: "Competitive Advantage",
      value: "4 min",
      subtitle: "Crisis response vs 6-month traditional",
      growth: "15,000x faster",
      color: "text-purple-600"
    },
    {
      title: "AI Accuracy",
      value: "85-92%",
      subtitle: "Strategic decision intelligence",
      growth: "Industry leading",
      color: "text-orange-600"
    }
  ];

  const pitchMaterials = [
    {
      title: "Series B Executive Deck",
      description: "Comprehensive pitch presentation for Series B funding round",
      slides: 24,
      duration: "18 min",
      status: "Ready",
      type: "Primary Deck",
      icon: <Presentation className="w-6 h-6 text-blue-500" />
    },
    {
      title: "Financial Projections Model",
      description: "5-year financial model with revenue projections and market analysis",
      slides: 12,
      duration: "8 min", 
      status: "Updated",
      type: "Financial",
      icon: <BarChart3 className="w-6 h-6 text-green-500" />
    },
    {
      title: "Product Demo Presentation",
      description: "Live platform demonstration showcasing AI intelligence and crisis response",
      slides: 16,
      duration: "12 min",
      status: "Live Demo",
      type: "Product",
      icon: <Play className="w-6 h-6 text-purple-500" />
    },
    {
      title: "Competitive Analysis Deep Dive",
      description: "Comprehensive competitive landscape and differentiation strategy",
      slides: 20,
      duration: "15 min",
      status: "Ready",
      type: "Market Analysis",
      icon: <Target className="w-6 h-6 text-red-500" />
    },
    {
      title: "Technology Architecture Overview",
      description: "Platform scalability, security architecture, and technical roadmap",
      slides: 18,
      duration: "14 min",
      status: "Ready",
      type: "Technical",
      icon: <Building2 className="w-6 h-6 text-teal-500" />
    },
    {
      title: "Market Expansion Strategy",
      description: "Go-to-market strategy and international expansion plans",
      slides: 14,
      duration: "10 min",
      status: "In Review",
      type: "Growth Strategy",
      icon: <Globe className="w-6 h-6 text-indigo-500" />
    }
  ];

  const keyInvestmentThesis = [
    "First platform to combine AI intelligence with immediate crisis response",
    "15,000x faster crisis activation than traditional consulting approaches",
    "Fortune 1000 enterprises require both strategic intelligence and crisis readiness",
    "Market-leading AI accuracy (85-92%) for strategic decision support",
    "Scalable enterprise architecture serving organizations with 10,000+ employees"
  ];

  return (
    <VeridiusPageLayout>
      <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="p-8">
          {/* VC Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Briefcase className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Investor Relations Center</h1>
                <p className="text-gray-600 dark:text-gray-300">Series B Presentation Materials & Financial Projections</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="text-yellow-600 border-yellow-500/50">
                <Star className="w-3 h-3 mr-1" />
                Series B Ready
              </Badge>
              <Badge className="bg-yellow-600 text-white">
                Investment Grade
              </Badge>
            </div>
          </div>

          {/* Investment Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {investmentHighlights.map((highlight, index) => (
              <Card key={index} className="bg-white/90 dark:bg-slate-800/90 backdrop-blur border-slate-200 dark:border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">{highlight.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{highlight.value}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{highlight.subtitle}</div>
                  <div className={`text-sm font-medium ${highlight.color}`}>{highlight.growth}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pitch Materials Library */}
            <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900 dark:text-white">
                  <FileText className="w-5 h-5 mr-2 text-blue-500" />
                  Series B Presentation Materials
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pitchMaterials.map((material, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {material.icon}
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">{material.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{material.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                            <span>{material.slides} slides</span>
                            <span>{material.duration}</span>
                            <Badge variant="outline">{material.type}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={material.status === 'Ready' ? 'default' : 'secondary'}>
                          {material.status}
                        </Badge>
                        <Button size="sm" variant="outline" data-testid={`button-download-${material.title.toLowerCase().replace(/\s+/g, '-')}`}>
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Investment Thesis */}
            <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900 dark:text-white">
                  <Rocket className="w-5 h-5 mr-2 text-purple-500" />
                  Investment Thesis & Value Proposition
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  {keyInvestmentThesis.map((point, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <CheckCircle className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{point}</span>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-3">
                  <Button className="w-full" data-testid="button-full-investor-package">
                    <Crown className="w-4 h-4 mr-2" />
                    Download Complete Investor Package
                  </Button>
                  <Button className="w-full" variant="outline" data-testid="button-schedule-presentation">
                    <Clock className="w-4 h-4 mr-2" />
                    Schedule Investor Presentation
                  </Button>
                </div>

                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center text-green-800 dark:text-green-200">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Investment Readiness Score: 96/100</span>
                  </div>
                  <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                    Platform demonstrates clear market leadership with unprecedented competitive advantages in enterprise intelligence and crisis response.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </VeridiusPageLayout>
  );
}