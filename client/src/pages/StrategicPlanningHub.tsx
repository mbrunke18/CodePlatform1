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
  Home,
  ArrowRight,
  Activity,
  Shield,
  Zap,
  Map
} from 'lucide-react';

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

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

      {/* ─── Dark Hub Header Strip ──────────────────────────────────────── */}
      <div style={{ background: NAVY, padding: '36px 0 32px' }}>
        <style>{`
          @keyframes sph-fadeup { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
          .sph-tile-1{animation:sph-fadeup 0.38s ease 0.05s both}
          .sph-tile-2{animation:sph-fadeup 0.38s ease 0.10s both}
          .sph-tile-3{animation:sph-fadeup 0.38s ease 0.15s both}
          .sph-tile-4{animation:sph-fadeup 0.38s ease 0.20s both}
          .sph-tile-5{animation:sph-fadeup 0.38s ease 0.25s both}
          .sph-tile-6{animation:sph-fadeup 0.38s ease 0.30s both}
        `}</style>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>

          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 38, height: 38, background: 'rgba(201,168,76,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Map style={{ width: 18, height: 18, color: GOLD }} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 3 }}>
                  <div style={{ width: 20, height: 1.5, background: GOLD }} />
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD }}>Strategic Operations</span>
                </div>
                <div style={{ ...CG, fontSize: 24, fontWeight: 600, color: '#F0EDE4', lineHeight: 1 }}>Strategic Planning Hub</div>
                <div style={{ fontSize: 12, color: 'rgba(240,237,228,0.45)', marginTop: 4 }}>Scenario portfolio · milestone tracking · risk exposure</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(43,138,110,0.12)', color: '#3BAF8A', fontSize: 10, fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', padding: '5px 14px', border: '1px solid rgba(43,138,110,0.3)' }}>
                <span style={{ width: 6, height: 6, background: '#3BAF8A', borderRadius: '50%', display: 'inline-block' }} />
                Portfolio Active
              </div>
              <button
                onClick={() => {}}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: GOLD, color: NAVY, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', padding: '8px 18px', border: 'none', cursor: 'pointer' }}
              >
                <Plus style={{ width: 14, height: 14 }} />
                New Scenario
              </button>
            </div>
          </div>

          {/* Quick Stats Strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, marginBottom: 24, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {[
              { label: 'Active Scenarios', value: String(portfolioMetrics.activeProjects), color: GOLD },
              { label: 'Portfolio Health', value: `${portfolioMetrics.portfolioHealth}%`, color: TEAL },
              { label: 'Risk Exposure', value: `${portfolioMetrics.riskExposure}%`, color: GOLD },
              { label: 'Avg. ROI Realized', value: '245%', color: TEAL },
            ].map(stat => (
              <div key={stat.label} style={{ padding: '14px 18px', background: 'rgba(255,255,255,0.025)' }}>
                <div style={{ fontSize: 10, color: 'rgba(240,237,228,0.4)', marginBottom: 4 }}>{stat.label}</div>
                <div style={{ ...CG, fontSize: 26, fontWeight: 700, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Portfolio Command Tiles */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
            {[
              { label: "Active Scenarios", value: String(portfolioMetrics.activeProjects), sub: `${portfolioMetrics.totalScenarios} total in portfolio`, icon: Target, accent: GOLD, tag: "IN FLIGHT", cls: 'sph-tile-1' },
              { label: "Portfolio Health", value: `${portfolioMetrics.portfolioHealth}%`, sub: "Milestone velocity on track", icon: Activity, accent: TEAL, tag: "HEALTHY", cls: 'sph-tile-2' },
              { label: "Total Budget", value: formatCurrency(portfolioMetrics.totalBudget), sub: "Across all active scenarios", icon: DollarSign, accent: GOLD, tag: "AUTHORIZED", cls: 'sph-tile-3' },
              { label: "Completed This Quarter", value: String(portfolioMetrics.completedThisQuarter), sub: "Closed with post-mortem review", icon: CheckCircle, accent: TEAL, tag: "CLOSED", cls: 'sph-tile-4' },
              { label: "Risk Exposure", value: `${portfolioMetrics.riskExposure}%`, sub: "Mitigated via playbook automation", icon: Shield, accent: GOLD, tag: "MONITORED", cls: 'sph-tile-5' },
              { label: "Avg. ROI Realized", value: "245%", sub: "Across completed scenarios", icon: TrendingUp, accent: TEAL, tag: "VERIFIED", cls: 'sph-tile-6' },
            ].map(({ label, value, sub, icon: Icon, accent, tag, cls }) => (
              <div
                key={label}
                className={cls}
                style={{
                  background: 'rgba(255,255,255,0.035)',
                  borderTop: `1px solid ${accent}45`,
                  borderLeft: `1px solid ${accent}20`,
                  borderRight: `1px solid ${accent}20`,
                  borderBottom: `3px solid ${accent}`,
                  padding: '18px 20px',
                  cursor: 'default',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ width: 34, height: 34, background: `${accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon style={{ width: 16, height: 16, color: accent }} />
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: `${accent}99` }}>{tag}</span>
                </div>
                <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: accent, lineHeight: 1, marginBottom: 4 }}>{value}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#F0EDE4', marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 11, color: 'rgba(240,237,228,0.4)' }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Light Body ─────────────────────────────────────────────────── */}
      <div className="flex-1 bg-[#F8F7F4] overflow-y-auto p-8 space-y-6">

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
                    <div key={scenario.id} className="p-4 bg-[#F8F7F4] dark:bg-white/5 border border-[#E8E4DC] dark:border-white/10">
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
                    <div className="flex items-center gap-3 p-3 bg-[#F8F7F4] dark:bg-white/5 border border-[#E8E4DC] dark:border-white/10">
                      <div className="w-2 h-2 bg-[#2B8A6E]" />
                      <div className="flex-1">
                        <div className="text-sm text-[#0A0F2E] dark:text-white">Digital Transformation milestone completed</div>
                        <div className="text-xs text-[#6B7280]">2 hours ago</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-[#F8F7F4] dark:bg-white/5 border border-[#E8E4DC] dark:border-white/10">
                      <div className="w-2 h-2 bg-[#0A0F2E] dark:bg-[#C9A84C]" />
                      <div className="flex-1">
                        <div className="text-sm text-[#0A0F2E] dark:text-white">Market Expansion budget approved</div>
                        <div className="text-xs text-[#6B7280]">1 day ago</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-[#F8F7F4] dark:bg-white/5 border border-[#E8E4DC] dark:border-white/10">
                      <div className="w-2 h-2 bg-[#C9A84C]" />
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
            <div className="flex items-center gap-4 bg-white dark:bg-white/5 p-4 border border-[#E8E4DC] dark:border-white/10">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { title: "Scenario Builder", desc: "Model strategic situations and define response playbooks with AI-guided prompts", icon: Lightbulb, accent: GOLD, tag: "AI-POWERED", path: "/simulation-studio" },
                { title: "Impact Analysis", desc: "Quantify potential outcomes, cost exposure, and revenue risk across scenarios", icon: BarChart3, accent: TEAL, tag: "ANALYTICS", path: "/analytics" },
                { title: "Stakeholder Mapping", desc: "Define who needs to be in the room — roles, authority, and notification tiers", icon: Users, accent: GOLD, tag: "COORDINATION", path: "/setup/team" },
                { title: "Risk Assessment", desc: "Score probability and severity across all active and planned strategic initiatives", icon: Shield, accent: TEAL, tag: "INTELLIGENCE", path: "/ai-radar" },
                { title: "Budget Planning", desc: "Pre-authorize response budgets and resource thresholds before a trigger fires", icon: DollarSign, accent: GOLD, tag: "FINANCIAL", path: "/roi-dashboard" },
                { title: "Timeline Builder", desc: "Map milestones, decision gates, and escalation checkpoints across every phase", icon: Map, accent: TEAL, tag: "EXECUTION", path: "/execution-learning" },
              ].map(({ title, desc, icon: Icon, accent, tag, path }) => (
                <Link key={title} to={path}>
                  <div
                    style={{
                      background: NAVY,
                      borderTop: `1px solid ${accent}40`,
                      borderLeft: `1px solid ${accent}20`,
                      borderRight: `1px solid ${accent}20`,
                      borderBottom: `3px solid ${accent}`,
                      borderRadius: 12,
                    }}
                    className="p-5 hover:scale-[1.02] transition-transform duration-200 cursor-pointer group h-full"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-2" style={{ background: `${accent}18` }}>
                        <Icon className="h-5 w-5" style={{ color: accent }} />
                      </div>
                      <span className="text-xs font-bold tracking-widest" style={{ color: `${accent}99` }}>{tag}</span>
                    </div>
                    <div className="text-base font-bold text-white mb-1.5">{title}</div>
                    <div className="text-xs leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>{desc}</div>
                    <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: accent }}>
                      Open Tool <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
