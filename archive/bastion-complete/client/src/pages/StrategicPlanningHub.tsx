import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import VeridiusPageLayout from '@/components/layout/VeridiusPageLayout';
import { Link } from 'wouter';
import { 
  Target, 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Users, 
  DollarSign, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Zap,
  Building2,
  Globe,
  Lightbulb,
  Settings,
  Plus,
  Edit,
  Trash2,
  Filter,
  Search,
  Download,
  Share,
  ArrowLeft,
  Home
} from 'lucide-react';

interface StrategicScenario {
  id: string;
  name: string;
  category: string;
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  owner: string;
  startDate: string;
  endDate: string;
  budget: number;
  progress: number;
  kpis: {
    name: string;
    target: string;
    current: string;
    trend: 'up' | 'down' | 'stable';
  }[];
  milestones: {
    name: string;
    date: string;
    status: 'completed' | 'in-progress' | 'pending';
  }[];
  risksOpportunities: {
    type: 'risk' | 'opportunity';
    description: string;
    impact: 'low' | 'medium' | 'high';
    probability: 'low' | 'medium' | 'high';
    mitigation?: string;
  }[];
}

interface PortfolioMetrics {
  totalScenarios: number;
  activeProjects: number;
  completedThisQuarter: number;
  totalBudget: number;
  portfolioHealth: number;
  riskExposure: number;
}

export default function StrategicPlanningHub() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [scenarios, setScenarios] = useState<StrategicScenario[]>([]);
  const [portfolioMetrics, setPortfolioMetrics] = useState<PortfolioMetrics>({
    totalScenarios: 18,
    activeProjects: 12,
    completedThisQuarter: 6,
    totalBudget: 12500000,
    portfolioHealth: 87,
    riskExposure: 23
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  useEffect(() => {
    // Load strategic scenarios
    const mockScenarios: StrategicScenario[] = [
      {
        id: 'sc-001',
        name: 'Digital Transformation Initiative',
        category: 'Technology',
        status: 'active',
        priority: 'critical',
        description: 'Comprehensive digital transformation to modernize operations and enhance customer experience',
        owner: 'CTO Office',
        startDate: '2024-01-15',
        endDate: '2024-12-31',
        budget: 2500000,
        progress: 45,
        kpis: [
          { name: 'System Modernization', target: '100%', current: '45%', trend: 'up' },
          { name: 'User Adoption', target: '85%', current: '32%', trend: 'up' },
          { name: 'Cost Savings', target: '$500K', current: '$120K', trend: 'up' }
        ],
        milestones: [
          { name: 'Infrastructure Assessment', date: '2024-02-28', status: 'completed' },
          { name: 'Platform Selection', date: '2024-04-15', status: 'completed' },
          { name: 'Phase 1 Implementation', date: '2024-07-30', status: 'in-progress' },
          { name: 'User Training Program', date: '2024-09-15', status: 'pending' }
        ],
        risksOpportunities: [
          { type: 'risk', description: 'User resistance to new systems', impact: 'medium', probability: 'medium', mitigation: 'Comprehensive training and change management' },
          { type: 'opportunity', description: 'Process automation potential', impact: 'high', probability: 'high' }
        ]
      },
      {
        id: 'sc-002',
        name: 'Market Expansion Strategy',
        category: 'Growth',
        status: 'planning',
        priority: 'high',
        description: 'Strategic expansion into three new geographic markets with localized offerings',
        owner: 'VP Growth',
        startDate: '2024-03-01',
        endDate: '2025-02-28',
        budget: 1800000,
        progress: 15,
        kpis: [
          { name: 'Market Penetration', target: '15%', current: '2%', trend: 'up' },
          { name: 'Revenue Growth', target: '$2.5M', current: '$125K', trend: 'up' },
          { name: 'Customer Acquisition', target: '1000', current: '45', trend: 'up' }
        ],
        milestones: [
          { name: 'Market Research', date: '2024-03-30', status: 'completed' },
          { name: 'Regulatory Approval', date: '2024-05-15', status: 'in-progress' },
          { name: 'Local Partnerships', date: '2024-07-01', status: 'pending' },
          { name: 'Market Launch', date: '2024-09-01', status: 'pending' }
        ],
        risksOpportunities: [
          { type: 'risk', description: 'Regulatory delays', impact: 'high', probability: 'medium', mitigation: 'Early regulatory engagement and compliance planning' },
          { type: 'opportunity', description: 'First-mover advantage', impact: 'high', probability: 'medium' }
        ]
      },
      {
        id: 'sc-003',
        name: 'Sustainability Initiative',
        category: 'ESG',
        status: 'active',
        priority: 'medium',
        description: 'Comprehensive sustainability program to achieve carbon neutrality by 2026',
        owner: 'Chief Sustainability Officer',
        startDate: '2024-01-01',
        endDate: '2026-12-31',
        budget: 3200000,
        progress: 28,
        kpis: [
          { name: 'Carbon Reduction', target: '50%', current: '12%', trend: 'up' },
          { name: 'Renewable Energy', target: '100%', current: '35%', trend: 'up' },
          { name: 'Waste Reduction', target: '75%', current: '23%', trend: 'up' }
        ],
        milestones: [
          { name: 'Baseline Assessment', date: '2024-02-15', status: 'completed' },
          { name: 'Renewable Energy Plan', date: '2024-06-30', status: 'in-progress' },
          { name: 'Waste Reduction Program', date: '2024-09-30', status: 'pending' },
          { name: 'Carbon Offset Strategy', date: '2025-03-31', status: 'pending' }
        ],
        risksOpportunities: [
          { type: 'risk', description: 'Technology readiness', impact: 'medium', probability: 'low' },
          { type: 'opportunity', description: 'Cost savings from efficiency', impact: 'high', probability: 'high' },
          { type: 'opportunity', description: 'Brand differentiation', impact: 'medium', probability: 'high' }
        ]
      }
    ];

    setScenarios(mockScenarios);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'planning': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'completed': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'on-hold': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
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
    }).format(amount);
  };

  const filteredScenarios = scenarios.filter((scenario) => {
    const matchesSearch = scenario.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scenario.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || scenario.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || scenario.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

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
            <span>Strategic Operations</span>
            <span>/</span>
            <span className="text-white">Strategic Planning Hub</span>
          </div>
        </div>

        {/* Strategic Planning Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Strategic Planning Hub</h1>
            <p className="text-slate-300">Comprehensive scenario planning and strategic execution management</p>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="secondary" className="bg-slate-700 hover:bg-slate-600 text-slate-100 border-slate-600">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              New Scenario
            </Button>
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
              <Download className="w-4 w-4 mr-2" />
              Export Portfolio
            </Button>
          </div>
        </div>

        {/* Portfolio Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Total Scenarios</h3>
                <Target className="h-5 w-5 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white">{portfolioMetrics.totalScenarios}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Active Projects</h3>
                <CheckCircle className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-white">{portfolioMetrics.activeProjects}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Completed Q1</h3>
                <TrendingUp className="h-5 w-5 text-green-400" />
              </div>
              <div className="text-2xl font-bold text-white">{portfolioMetrics.completedThisQuarter}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Total Budget</h3>
                <DollarSign className="h-5 w-5 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white">{formatCurrency(portfolioMetrics.totalBudget)}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Portfolio Health</h3>
                <BarChart3 className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-white">{portfolioMetrics.portfolioHealth}%</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Risk Exposure</h3>
                <AlertCircle className="h-5 w-5 text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-white">{portfolioMetrics.riskExposure}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-800/50 border border-slate-700/50">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-slate-700">Portfolio Dashboard</TabsTrigger>
            <TabsTrigger value="scenarios" className="data-[state=active]:bg-slate-700">Strategic Scenarios</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-slate-700">Performance Analytics</TabsTrigger>
            <TabsTrigger value="planning" className="data-[state=active]:bg-slate-700">Planning Tools</TabsTrigger>
          </TabsList>

          {/* Portfolio Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Active Scenarios Overview */}
              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Active Scenarios
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {scenarios.filter(s => s.status === 'active').map((scenario) => (
                    <div key={scenario.id} className="p-4 bg-slate-800/50 rounded-lg border border-slate-600/50">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-white">{scenario.name}</h4>
                        <Badge className={getPriorityColor(scenario.priority)}>
                          {scenario.priority.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Progress</span>
                          <span className="text-white">{scenario.progress}%</span>
                        </div>
                        <Progress value={scenario.progress} className="h-2" />
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Owner: {scenario.owner}</span>
                          <span className="text-slate-500">Budget: {formatCurrency(scenario.budget)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                      <div className="flex-1">
                        <div className="text-sm text-white">Digital Transformation milestone completed</div>
                        <div className="text-xs text-slate-400">2 hours ago</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-400 rounded-full" />
                      <div className="flex-1">
                        <div className="text-sm text-white">Market Expansion budget approved</div>
                        <div className="text-xs text-slate-400">1 day ago</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                      <div className="w-2 h-2 bg-amber-400 rounded-full" />
                      <div className="flex-1">
                        <div className="text-sm text-white">Sustainability initiative risk review</div>
                        <div className="text-xs text-slate-400">3 days ago</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Strategic Scenarios */}
          <TabsContent value="scenarios" className="space-y-6">
            
            {/* Filters and Search */}
            <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search scenarios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-600 text-white"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40 bg-slate-800 border-slate-600 text-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-40 bg-slate-800 border-slate-600 text-white">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Scenarios Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredScenarios.map((scenario) => (
                <Card key={scenario.id} className="bg-slate-900/50 border-slate-700/50 hover:bg-slate-800/50 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-lg">{scenario.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(scenario.status)}>
                          {scenario.status.toUpperCase()}
                        </Badge>
                        <Badge className={getPriorityColor(scenario.priority)}>
                          {scenario.priority.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm">{scenario.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-slate-400">Owner</div>
                        <div className="text-white">{scenario.owner}</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Budget</div>
                        <div className="text-white">{formatCurrency(scenario.budget)}</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Timeline</div>
                        <div className="text-white">{scenario.startDate} - {scenario.endDate}</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Progress</div>
                        <div className="text-white">{scenario.progress}%</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Overall Progress</span>
                        <span className="text-white">{scenario.progress}%</span>
                      </div>
                      <Progress value={scenario.progress} className="h-2" />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                        <FileText className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                        <Share className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Performance Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white">Success Rate</h3>
                    <TrendingUp className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-2">94%</div>
                  <div className="text-sm text-slate-400">Scenario completion</div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white">Avg Timeline</h3>
                    <Calendar className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-2">8.2</div>
                  <div className="text-sm text-slate-400">months</div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white">ROI Average</h3>
                    <DollarSign className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-2">245%</div>
                  <div className="text-sm text-slate-400">Return on investment</div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white">Risk Mitigation</h3>
                    <AlertCircle className="h-5 w-5 text-amber-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-2">87%</div>
                  <div className="text-sm text-slate-400">Issues prevented</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Planning Tools */}
          <TabsContent value="planning" className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Strategic Planning Tools</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Button className="h-24 bg-blue-600 hover:bg-blue-700 flex-col gap-2">
                  <Lightbulb className="w-8 h-8" />
                  Scenario Builder
                </Button>
                <Button className="h-24 bg-emerald-600 hover:bg-emerald-700 flex-col gap-2">
                  <BarChart3 className="w-8 h-8" />
                  Impact Analysis
                </Button>
                <Button className="h-24 bg-purple-600 hover:bg-purple-700 flex-col gap-2">
                  <Users className="w-8 h-8" />
                  Stakeholder Mapping
                </Button>
                <Button className="h-24 bg-amber-600 hover:bg-amber-700 flex-col gap-2">
                  <AlertCircle className="w-8 h-8" />
                  Risk Assessment
                </Button>
                <Button className="h-24 bg-pink-600 hover:bg-pink-700 flex-col gap-2">
                  <DollarSign className="w-8 h-8" />
                  Budget Planning
                </Button>
                <Button className="h-24 bg-indigo-600 hover:bg-indigo-700 flex-col gap-2">
                  <Calendar className="w-8 h-8" />
                  Timeline Builder
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </VeridiusPageLayout>
  );
}