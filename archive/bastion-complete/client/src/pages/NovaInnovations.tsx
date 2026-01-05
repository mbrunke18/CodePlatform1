import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'wouter';
import VeridiusPageLayout from '@/components/layout/VeridiusPageLayout';
import { 
  Brain, 
  Rocket, 
  Lightbulb,
  TrendingUp,
  Target,
  DollarSign,
  Users,
  Clock,
  Star,
  Zap,
  Layers,
  BarChart3,
  PlusCircle,
  Eye,
  ArrowLeft,
  Home
} from 'lucide-react';

export default function NovaInnovations() {
  const [selectedPipeline, setSelectedPipeline] = useState('discovery');

  const innovationProjects = [
    {
      id: 'ai-automation',
      name: 'AI-Powered Process Automation',
      stage: 'development',
      priority: 'high',
      potential: 95,
      investment: 2.4,
      timeline: '6-9 months',
      description: 'Revolutionary AI system to automate complex business processes',
      impact: {
        efficiency: 85,
        cost: 78,
        revenue: 92,
        risk: 34
      },
      team: ['AI/ML Team', 'Process Engineering', 'QA'],
      milestones: [
        { name: 'Proof of Concept', status: 'completed', date: '2024-Q4' },
        { name: 'MVP Development', status: 'in-progress', date: '2025-Q1' },
        { name: 'Pilot Testing', status: 'planned', date: '2025-Q2' },
        { name: 'Full Deployment', status: 'planned', date: '2025-Q3' }
      ],
      icon: <Brain className="h-5 w-5" />,
      color: 'blue'
    },
    {
      id: 'quantum-security',
      name: 'Quantum-Resistant Security Protocol',
      stage: 'research',
      priority: 'critical',
      potential: 89,
      investment: 3.8,
      timeline: '12-18 months',
      description: 'Next-generation security framework resistant to quantum computing threats',
      impact: {
        efficiency: 67,
        cost: 45,
        revenue: 73,
        risk: 12
      },
      team: ['Security Research', 'Cryptography', 'Platform'],
      milestones: [
        { name: 'Research Phase', status: 'in-progress', date: '2025-Q1' },
        { name: 'Algorithm Development', status: 'planned', date: '2025-Q2' },
        { name: 'Security Testing', status: 'planned', date: '2025-Q3' },
        { name: 'Implementation', status: 'planned', date: '2025-Q4' }
      ],
      icon: <Zap className="h-5 w-5" />,
      color: 'purple'
    },
    {
      id: 'sustainable-tech',
      name: 'Carbon-Neutral Computing Infrastructure',
      stage: 'ideation',
      priority: 'medium',
      potential: 76,
      investment: 1.9,
      timeline: '9-12 months',
      description: 'Innovative green computing solutions with zero carbon footprint',
      impact: {
        efficiency: 71,
        cost: 82,
        revenue: 65,
        risk: 28
      },
      team: ['Sustainability', 'Infrastructure', 'R&D'],
      milestones: [
        { name: 'Feasibility Study', status: 'in-progress', date: '2025-Q1' },
        { name: 'Prototype Development', status: 'planned', date: '2025-Q2' },
        { name: 'Pilot Implementation', status: 'planned', date: '2025-Q3' },
        { name: 'Scale-up', status: 'planned', date: '2025-Q4' }
      ],
      icon: <Layers className="h-5 w-5" />,
      color: 'emerald'
    },
    {
      id: 'market-intelligence',
      name: 'Predictive Market Intelligence Platform',
      stage: 'discovery',
      priority: 'high',
      potential: 93,
      investment: 2.1,
      timeline: '8-10 months',
      description: 'AI-driven market analysis and prediction system for strategic advantage',
      impact: {
        efficiency: 88,
        cost: 61,
        revenue: 96,
        risk: 22
      },
      team: ['Data Science', 'Business Intelligence', 'Strategy'],
      milestones: [
        { name: 'Market Research', status: 'completed', date: '2024-Q4' },
        { name: 'Data Architecture', status: 'planned', date: '2025-Q1' },
        { name: 'AI Model Training', status: 'planned', date: '2025-Q2' },
        { name: 'Platform Launch', status: 'planned', date: '2025-Q3' }
      ],
      icon: <Target className="h-5 w-5" />,
      color: 'orange'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
      purple: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      orange: 'text-orange-400 bg-orange-500/10 border-orange-500/30'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'development': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'research': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'ideation': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'discovery': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const filteredProjects = innovationProjects.filter(project =>
    selectedPipeline === 'all' || project.stage === selectedPipeline
  );

  return (
    <VeridiusPageLayout>
      <div className="min-h-screen bg-transparent p-6" data-testid="nova-innovations">
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
              <span className="text-white">Nova Innovations</span>
            </div>
          </div>

          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Brain className="h-10 w-10" />
                <div>
                  <h1 className="text-3xl font-bold" data-testid="nova-title">
                    Nova Innovations
                  </h1>
                  <p className="text-purple-100">Innovation pipeline management and breakthrough opportunity identification</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Link to="/">
                  <Button variant="secondary" className="bg-purple-700 hover:bg-purple-800 text-purple-100 border-purple-600" data-testid="back-to-dashboard">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Badge variant="secondary" className="bg-purple-700 text-purple-100 border-purple-600" data-testid="ai-discovery-badge">
                  <Rocket className="h-4 w-4 mr-2" />
                  AI DISCOVERY
                </Badge>
                <Button variant="secondary" className="bg-indigo-600 hover:bg-indigo-700 text-white" data-testid="new-innovation-button">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  New Innovation
                </Button>
              </div>
            </div>
          </div>

          {/* Innovation Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-blue-500/30 bg-blue-950/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-300 text-sm font-medium">Active Projects</p>
                    <p className="text-2xl font-bold text-white">{innovationProjects.length}</p>
                  </div>
                  <Rocket className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-emerald-500/30 bg-emerald-950/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-300 text-sm font-medium">Total Investment</p>
                    <p className="text-2xl font-bold text-white">$10.2M</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-emerald-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-purple-500/30 bg-purple-950/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-300 text-sm font-medium">Avg Potential</p>
                    <p className="text-2xl font-bold text-white">88.3%</p>
                  </div>
                  <Star className="h-8 w-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-orange-500/30 bg-orange-950/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-300 text-sm font-medium">Expected ROI</p>
                    <p className="text-2xl font-bold text-white">340%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-orange-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={selectedPipeline} onValueChange={setSelectedPipeline} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="discovery" data-testid="tab-discovery">Discovery</TabsTrigger>
              <TabsTrigger value="ideation" data-testid="tab-ideation">Ideation</TabsTrigger>
              <TabsTrigger value="research" data-testid="tab-research">Research</TabsTrigger>
              <TabsTrigger value="development" data-testid="tab-development">Development</TabsTrigger>
              <TabsTrigger value="all" data-testid="tab-all">All Projects</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedPipeline} className="space-y-6">
              {/* Innovation Projects Grid */}
              <div className="space-y-6">
                {filteredProjects.map((project) => (
                  <Card key={project.id} className="border-gray-700/50 bg-gray-900/50 backdrop-blur-sm hover:border-purple-500/30 transition-colors" data-testid={project.id === 'ai-automation' ? 'innovation-project-ai' : `project-${project.id}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-lg ${getColorClasses(project.color)}`}>
                            {project.icon}
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-white">{project.name}</h3>
                            <p className="text-gray-400">{project.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-sm text-gray-400">Timeline: {project.timeline}</span>
                              <span className="text-gray-600">•</span>
                              <span className="text-sm text-gray-400">Investment: ${project.investment}M</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Badge variant="outline" className={getPriorityColor(project.priority)}>
                            {project.priority.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className={getStageColor(project.stage)}>
                            {project.stage.toUpperCase()}
                          </Badge>
                          <div className="text-right">
                            <div className="text-sm text-gray-400">Potential</div>
                            <div className="text-lg font-bold text-white">{project.potential}%</div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Impact Metrics */}
                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-400">Efficiency</span>
                            <span className="text-blue-400 font-medium">{project.impact.efficiency}%</span>
                          </div>
                          <Progress value={project.impact.efficiency} className="h-2" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-400">Cost Impact</span>
                            <span className="text-emerald-400 font-medium">{project.impact.cost}%</span>
                          </div>
                          <Progress value={project.impact.cost} className="h-2" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-400">Revenue</span>
                            <span className="text-purple-400 font-medium">{project.impact.revenue}%</span>
                          </div>
                          <Progress value={project.impact.revenue} className="h-2" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-400">Risk</span>
                            <span className="text-orange-400 font-medium">{project.impact.risk}%</span>
                          </div>
                          <Progress value={project.impact.risk} className="h-2" />
                        </div>
                      </div>

                      {/* Team and Milestones */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                            <Users className="h-4 w-4 text-blue-400" />
                            Project Team
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {project.team.map((member, index) => (
                              <Badge key={index} variant="outline" className="bg-gray-800/50 text-gray-300 border-gray-600">
                                {member}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                            <Clock className="h-4 w-4 text-purple-400" />
                            Key Milestones
                          </h4>
                          <div className="space-y-2">
                            {project.milestones.slice(0, 2).map((milestone, index) => (
                              <div key={index} className="flex items-center justify-between text-sm">
                                <span className="text-gray-300">{milestone.name}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-400">{milestone.date}</span>
                                  <Badge 
                                    variant="outline" 
                                    className={
                                      milestone.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                                      milestone.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                                      'bg-gray-500/20 text-gray-400 border-gray-500/30'
                                    }
                                  >
                                    {milestone.status}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4 border-t border-gray-700/50">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Analytics
                        </Button>
                        <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700">
                          <Rocket className="h-4 w-4 mr-2" />
                          Accelerate
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* AI Recommendations */}
              <Card className="border-indigo-500/30 bg-indigo-950/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-indigo-300">
                    <Brain className="h-5 w-5" />
                    AI Innovation Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-purple-950/30 rounded-lg border border-purple-500/30">
                      <p className="text-purple-300 font-medium mb-2">Priority Alignment</p>
                      <p className="text-purple-200 text-sm">Focus on AI-Powered Process Automation and Predictive Market Intelligence for maximum ROI in Q1-Q2.</p>
                    </div>
                    <div className="p-4 bg-blue-950/30 rounded-lg border border-blue-500/30">
                      <p className="text-blue-300 font-medium mb-2">Resource Optimization</p>
                      <p className="text-blue-200 text-sm">Cross-project synergies identified: AI/ML expertise can accelerate both automation and market intelligence initiatives.</p>
                    </div>
                    <div className="p-4 bg-emerald-950/30 rounded-lg border border-emerald-500/30">
                      <p className="text-emerald-300 font-medium mb-2">Breakthrough Opportunity</p>
                      <p className="text-emerald-200 text-sm">Quantum-Resistant Security shows potential for industry disruption - consider fast-track development with additional resources.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </VeridiusPageLayout>
  );
}