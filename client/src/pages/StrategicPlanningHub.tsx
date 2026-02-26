import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import PageLayout from '@/components/layout/PageLayout';
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
  Lightbulb, 
  Plus, 
  Edit, 
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
  const [portfolioMetrics] = useState<PortfolioMetrics>({
    totalScenarios: 18,
    activeProjects: 12,
    completedThisQuarter: 6,
    totalBudget: 12500000,
    portfolioHealth: 87,
    riskExposure: 23
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus] = useState('all');
  const [filterPriority] = useState('all');

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
      case 'active': return 'bg-[#2B8A6E]/20 text-[#2B8A6E] border-[#2B8A6E]/30';
      case 'planning': return 'bg-[#0A0F2E]/10 text-[#0A0F2E] dark:text-[#C9A84C] border-[#0A0F2E]/20';
      case 'completed': return 'bg-[#2B8A6E]/20 text-[#2B8A6E] border-[#2B8A6E]/30';
      case 'on-hold': return 'bg-[#C9A84C]/20 text-[#C9A84C] border-[#C9A84C]/30';
      default: return 'bg-[#E8E4DC] text-[#6B7280] border-[#E8E4DC]';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-[#0A0F2E]/10 text-[#0A0F2E] dark:text-[#C9A84C] border-[#0A0F2E]/20';
      case 'high': return 'bg-[#C9A84C]/20 text-[#C9A84C] border-[#C9A84C]/30';
      case 'medium': return 'bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/20';
      case 'low': return 'bg-[#2B8A6E]/20 text-[#2B8A6E] border-[#2B8A6E]/30';
      default: return 'bg-[#E8E4DC] text-[#6B7280] border-[#E8E4DC]';
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
    <PageLayout>
      <div className="flex-1 bg-[#F8F7F4] dark:bg-[#0A0F2E] overflow-y-auto p-8 space-y-8">
        
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-[#6B7280]">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-[#6B7280] hover:text-[#0A0F2E] dark:hover:text-white p-1 h-auto">
                <Home className="h-4 w-4" />
              </Button>
            </Link>
            <span>/</span>
            <span>Strategic Operations</span>
            <span>/</span>
            <span className="text-[#0A0F2E] dark:text-[#C9A84C]">Strategic Planning Hub</span>
          </div>
        </div>

        {/* Strategic Planning Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#0A0F2E] dark:text-white mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Strategic Planning Hub</h1>
            <p className="text-[#6B7280]">Comprehensive scenario planning and strategic execution management</p>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="secondary" className="bg-white hover:bg-[#F8F7F4] text-[#0A0F2E] border-[#E8E4DC]">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Button className="bg-[#0A0F2E] text-white hover:bg-[#141B45]">
              <Plus className="w-4 h-4 mr-2" />
              New Scenario
            </Button>
            <Button variant="outline" className="bg-transparent border-[#E8E4DC] text-[#0A0F2E] dark:text-white hover:bg-[#F8F7F4] dark:hover:bg-white/5">
              <Download className="w-4 h-4 mr-2" />
              Export Portfolio
            </Button>
          </div>
        </div>

        {/* Portfolio Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          <Card className="bg-white dark:bg-white/5 border-[#E8E4DC] dark:border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#0A0F2E] dark:text-white">Total Scenarios</h3>
                <Target className="h-5 w-5 text-[#C9A84C]" />
              </div>
              <div className="text-2xl font-bold text-[#C9A84C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{portfolioMetrics.totalScenarios}</div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-white/5 border-[#E8E4DC] dark:border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#0A0F2E] dark:text-white">Active Projects</h3>
                <CheckCircle className="h-5 w-5 text-[#2B8A6E]" />
              </div>
              <div className="text-2xl font-bold text-[#C9A84C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{portfolioMetrics.activeProjects}</div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-white/5 border-[#E8E4DC] dark:border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#0A0F2E] dark:text-white">Completed Q1</h3>
                <TrendingUp className="h-5 w-5 text-[#2B8A6E]" />
              </div>
              <div className="text-2xl font-bold text-[#C9A84C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{portfolioMetrics.completedThisQuarter}</div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-white/5 border-[#E8E4DC] dark:border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#0A0F2E] dark:text-white">Total Budget</h3>
                <DollarSign className="h-5 w-5 text-[#C9A84C]" />
              </div>
              <div className="text-2xl font-bold text-[#C9A84C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{formatCurrency(portfolioMetrics.totalBudget)}</div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-white/5 border-[#E8E4DC] dark:border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#0A0F2E] dark:text-white">Portfolio Health</h3>
                <BarChart3 className="h-5 w-5 text-[#2B8A6E]" />
              </div>
              <div className="text-2xl font-bold text-[#C9A84C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{portfolioMetrics.portfolioHealth}%</div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-white/5 border-[#E8E4DC] dark:border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#0A0F2E] dark:text-white">Risk Exposure</h3>
                <AlertCircle className="h-5 w-5 text-[#C9A84C]" />
              </div>
              <div className="text-2xl font-bold text-[#C9A84C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{portfolioMetrics.riskExposure}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-[#E8E4DC]/30 border border-[#E8E4DC] dark:border-white/10">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-white">Portfolio Dashboard</TabsTrigger>
            <TabsTrigger value="scenarios" className="data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-white">Strategic Scenarios</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-white">Performance Analytics</TabsTrigger>
            <TabsTrigger value="planning" className="data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-white">Planning Tools</TabsTrigger>
          </TabsList>

          {/* Portfolio Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Active Scenarios Overview */}
              <Card className="bg-white dark:bg-white/5 border-[#E8E4DC] dark:border-white/10">
                <CardHeader>
                  <CardTitle className="text-[#0A0F2E] dark:text-white flex items-center gap-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    <Target className="h-5 w-5 text-[#C9A84C]" />
                    Active Scenarios
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {scenarios.filter(s => s.status === 'active').map((scenario) => (
                    <div key={scenario.id} className="p-4 bg-[#F8F7F4] dark:bg-white/5 rounded-lg border border-[#E8E4DC] dark:border-white/10">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-[#0A0F2E] dark:text-white">{scenario.name}</h4>
                        <Badge className={getPriorityColor(scenario.priority)}>
                          {scenario.priority.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-[#6B7280]">Progress</span>
                          <span className="text-[#0A0F2E] dark:text-[#C9A84C] font-bold">{scenario.progress}%</span>
                        </div>
                        <Progress value={scenario.progress} className="h-2" />
                        <div className="flex justify-between text-xs">
                          <span className="text-[#6B7280]">Owner: {scenario.owner}</span>
                          <span className="text-[#6B7280]">Budget: {formatCurrency(scenario.budget)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-white dark:bg-white/5 border-[#E8E4DC] dark:border-white/10">
                <CardHeader>
                  <CardTitle className="text-[#0A0F2E] dark:text-white flex items-center gap-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    <Clock className="h-5 w-5 text-[#C9A84C]" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-[#F8F7F4] dark:bg-white/5 rounded-lg border border-[#E8E4DC] dark:border-white/10">
                      <div className="w-2 h-2 bg-[#2B8A6E] rounded-full" />
                      <div className="flex-1">
                        <div className="text-sm text-[#0A0F2E] dark:text-white">Digital Transformation milestone completed</div>
                        <div className="text-xs text-[#6B7280]">2 hours ago</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-[#F8F7F4] dark:bg-white/5 rounded-lg border border-[#E8E4DC] dark:border-white/10">
                      <div className="w-2 h-2 bg-[#0A0F2E] dark:bg-[#C9A84C] rounded-full" />
                      <div className="flex-1">
                        <div className="text-sm text-[#0A0F2E] dark:text-white">Market Expansion budget approved</div>
                        <div className="text-xs text-[#6B7280]">1 day ago</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-[#F8F7F4] dark:bg-white/5 rounded-lg border border-[#E8E4DC] dark:border-white/10">
                      <div className="w-2 h-2 bg-[#C9A84C] rounded-full" />
                      <div className="flex-1">
                        <div className="text-sm text-[#0A0F2E] dark:text-white">Sustainability initiative risk review</div>
                        <div className="text-xs text-[#6B7280]">3 days ago</div>
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
            <div className="flex items-center gap-4 bg-white dark:bg-white/5 p-4 rounded-lg border border-[#E8E4DC] dark:border-white/10">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
                <Input
                  placeholder="Search scenarios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-[#F8F7F4] dark:bg-white/5 border-[#E8E4DC] dark:border-white/10 text-[#0A0F2E] dark:text-white"
                />
              </div>
            </div>

            {/* Scenarios Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredScenarios.map((scenario) => (
                <Card key={scenario.id} className="bg-white dark:bg-white/5 border-[#E8E4DC] dark:border-white/10 hover:border-[#C9A84C] transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-[#0A0F2E] dark:text-white text-lg" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{scenario.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(scenario.status)}>
                          {scenario.status.toUpperCase()}
                        </Badge>
                        <Badge className={getPriorityColor(scenario.priority)}>
                          {scenario.priority.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-[#6B7280] text-sm">{scenario.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-[#6B7280]">Owner</div>
                        <div className="text-[#0A0F2E] dark:text-white font-medium">{scenario.owner}</div>
                      </div>
                      <div>
                        <div className="text-[#6B7280]">Budget</div>
                        <div className="text-[#0A0F2E] dark:text-white font-medium">{formatCurrency(scenario.budget)}</div>
                      </div>
                      <div>
                        <div className="text-[#6B7280]">Timeline</div>
                        <div className="text-[#0A0F2E] dark:text-white font-medium">{scenario.startDate} - {scenario.endDate}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#6B7280]">Overall Progress</span>
                        <span className="text-[#0A0F2E] dark:text-[#C9A84C] font-bold">{scenario.progress}%</span>
                      </div>
                      <Progress value={scenario.progress} className="h-2" />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 bg-[#0A0F2E] text-white hover:bg-[#141B45]">
                        <FileText className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline" className="bg-transparent border-[#E8E4DC] text-[#0A0F2E] dark:text-white hover:bg-[#F8F7F4] dark:hover:bg-white/5">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="bg-transparent border-[#E8E4DC] text-[#0A0F2E] dark:text-white hover:bg-[#F8F7F4] dark:hover:bg-white/5">
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
              <Card className="bg-white dark:bg-white/5 border-[#E8E4DC] dark:border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-[#0A0F2E] dark:text-white">Success Rate</h3>
                    <TrendingUp className="h-5 w-5 text-[#2B8A6E]" />
                  </div>
                  <div className="text-2xl font-bold text-[#C9A84C] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>94%</div>
                  <div className="text-sm text-[#6B7280]">Scenario completion</div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-white/5 border-[#E8E4DC] dark:border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-[#0A0F2E] dark:text-white">Avg Timeline</h3>
                    <Calendar className="h-5 w-5 text-[#0A0F2E] dark:text-[#C9A84C]" />
                  </div>
                  <div className="text-2xl font-bold text-[#C9A84C] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>8.2</div>
                  <div className="text-sm text-[#6B7280]">months</div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-white/5 border-[#E8E4DC] dark:border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-[#0A0F2E] dark:text-white">ROI Average</h3>
                    <DollarSign className="h-5 w-5 text-[#2B8A6E]" />
                  </div>
                  <div className="text-2xl font-bold text-[#C9A84C] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>245%</div>
                  <div className="text-sm text-[#6B7280]">Return on investment</div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-white/5 border-[#E8E4DC] dark:border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-[#0A0F2E] dark:text-white">Risk Mitigation</h3>
                    <AlertCircle className="h-5 w-5 text-[#C9A84C]" />
                  </div>
                  <div className="text-2xl font-bold text-[#C9A84C] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>87%</div>
                  <div className="text-sm text-[#6B7280]">Issues prevented</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Planning Tools */}
          <TabsContent value="planning" className="space-y-6">
            <Card className="bg-white dark:bg-white/5 border-[#E8E4DC] dark:border-white/10">
              <CardHeader>
                <CardTitle className="text-[#0A0F2E] dark:text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Strategic Planning Tools</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Button className="h-24 bg-[#0A0F2E] text-white hover:bg-[#141B45] flex-col gap-2">
                  <Lightbulb className="w-8 h-8" />
                  Scenario Builder
                </Button>
                <Button className="h-24 bg-[#2B8A6E] text-white hover:bg-[#3BAF8A] flex-col gap-2">
                  <BarChart3 className="w-8 h-8" />
                  Impact Analysis
                </Button>
                <Button className="h-24 bg-[#0A0F2E] text-white hover:bg-[#141B45] flex-col gap-2">
                  <Users className="w-8 h-8" />
                  Stakeholder Mapping
                </Button>
                <Button className="h-24 bg-[#C9A84C] text-[#0A0F2E] hover:bg-[#DFC178] flex-col gap-2">
                  <AlertCircle className="w-8 h-8" />
                  Risk Assessment
                </Button>
                <Button className="h-24 bg-[#2B8A6E] text-white hover:bg-[#3BAF8A] flex-col gap-2">
                  <DollarSign className="w-8 h-8" />
                  Budget Planning
                </Button>
                <Button className="h-24 bg-[#0A0F2E] text-white hover:bg-[#141B45] flex-col gap-2">
                  <Calendar className="w-8 h-8" />
                  Timeline Builder
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
