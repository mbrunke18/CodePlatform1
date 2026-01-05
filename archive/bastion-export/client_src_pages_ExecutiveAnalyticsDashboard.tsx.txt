import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'wouter';
import VeridiusPageLayout from '@/components/layout/VeridiusPageLayout';
import ROIDashboard from '@/components/ROIDashboard';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Users, 
  Target, 
  Activity, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  Zap,
  Eye,
  Brain,
  Download,
  Filter,
  Calendar,
  PieChart,
  LineChart,
  BarChart,
  ArrowLeft,
  Home
} from 'lucide-react';

interface ExecutiveMetric {
  id: string;
  name: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  category: string;
  description: string;
  benchmark?: string;
}

interface PerformanceInsight {
  id: string;
  title: string;
  category: 'opportunity' | 'risk' | 'achievement' | 'alert';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  actionRequired: boolean;
  impact: string;
  recommendations: string[];
  confidence: number;
}

interface DepartmentPerformance {
  department: string;
  performance: number;
  budget: number;
  headcount: number;
  kpis: {
    name: string;
    value: number;
    target: number;
    trend: 'up' | 'down' | 'stable';
  }[];
}

export default function ExecutiveAnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('quarter');
  const [executiveMetrics, setExecutiveMetrics] = useState<ExecutiveMetric[]>([]);
  const [performanceInsights, setPerformanceInsights] = useState<PerformanceInsight[]>([]);
  const [departmentData, setDepartmentData] = useState<DepartmentPerformance[]>([]);
  const [realTimeData, setRealTimeData] = useState({
    activeUsers: 2847,
    revenue: 2845000,
    conversionRate: 3.42,
    customerSat: 94.2,
    systemHealth: 99.1
  });

  useEffect(() => {
    // Load executive metrics
    const metrics: ExecutiveMetric[] = [
      {
        id: 'revenue',
        name: 'Quarterly Revenue',
        value: '$2.85M',
        change: '+12.4%',
        trend: 'up',
        category: 'Financial',
        description: 'Total revenue for current quarter vs previous quarter',
        benchmark: 'Industry avg: +8.2%'
      },
      {
        id: 'profit-margin',
        name: 'Profit Margin',
        value: '18.7%',
        change: '+2.1%',
        trend: 'up',
        category: 'Financial',
        description: 'Net profit margin improvement through operational efficiency',
        benchmark: 'Industry avg: 15.3%'
      },
      {
        id: 'customer-acquisition',
        name: 'Customer Acquisition',
        value: '1,247',
        change: '+23.6%',
        trend: 'up',
        category: 'Growth',
        description: 'New customers acquired this quarter',
        benchmark: 'Target: 1,200'
      },
      {
        id: 'customer-retention',
        name: 'Customer Retention',
        value: '94.2%',
        change: '+1.8%',
        trend: 'up',
        category: 'Growth',
        description: 'Customer retention rate improvement',
        benchmark: 'Industry avg: 89.5%'
      },
      {
        id: 'employee-satisfaction',
        name: 'Employee Satisfaction',
        value: '87.5%',
        change: '+5.2%',
        trend: 'up',
        category: 'Operations',
        description: 'Employee satisfaction survey results',
        benchmark: 'Target: 85%'
      },
      {
        id: 'market-share',
        name: 'Market Share',
        value: '23.8%',
        change: '+3.4%',
        trend: 'up',
        category: 'Market',
        description: 'Market share growth in core segments',
        benchmark: 'Competitor avg: 18.2%'
      },
      {
        id: 'operational-efficiency',
        name: 'Operational Efficiency',
        value: '92.1%',
        change: '+4.7%',
        trend: 'up',
        category: 'Operations',
        description: 'Overall operational efficiency rating',
        benchmark: 'Target: 90%'
      },
      {
        id: 'innovation-index',
        name: 'Innovation Index',
        value: '8.3/10',
        change: '+0.6',
        trend: 'up',
        category: 'Innovation',
        description: 'Innovation capability and R&D effectiveness',
        benchmark: 'Industry avg: 7.1/10'
      }
    ];

    const insights: PerformanceInsight[] = [
      {
        id: 'insight-1',
        title: 'Digital Transformation ROI Acceleration',
        category: 'achievement',
        priority: 'high',
        description: 'Digital transformation initiatives have exceeded ROI projections by 34%, delivering $1.2M additional value.',
        actionRequired: false,
        impact: '$1.2M additional value',
        recommendations: ['Accelerate Phase 2 implementation', 'Expand to additional business units', 'Document best practices'],
        confidence: 94
      },
      {
        id: 'insight-2',
        title: 'Supply Chain Optimization Opportunity',
        category: 'opportunity',
        priority: 'medium',
        description: 'AI analysis identifies 18% cost reduction potential through supplier consolidation and logistics optimization.',
        actionRequired: true,
        impact: '$450K annual savings',
        recommendations: ['Conduct supplier assessment', 'Implement logistics AI', 'Negotiate volume discounts'],
        confidence: 87
      },
      {
        id: 'insight-3',
        title: 'Customer Acquisition Cost Trend',
        category: 'alert',
        priority: 'medium',
        description: 'Customer acquisition costs have increased 15% due to competitive market conditions and ad spend inflation.',
        actionRequired: true,
        impact: '+$47 per acquisition',
        recommendations: ['Optimize marketing channels', 'Improve conversion funnels', 'Explore referral programs'],
        confidence: 91
      },
      {
        id: 'insight-4',
        title: 'Team Productivity Surge',
        category: 'achievement',
        priority: 'low',
        description: 'Implementation of new collaboration tools has increased team productivity by 28% across all departments.',
        actionRequired: false,
        impact: '28% productivity increase',
        recommendations: ['Share success metrics', 'Expand tool rollout', 'Recognition program'],
        confidence: 96
      }
    ];

    const departments: DepartmentPerformance[] = [
      {
        department: 'Sales',
        performance: 112,
        budget: 2400000,
        headcount: 24,
        kpis: [
          { name: 'Revenue Target', value: 112, target: 100, trend: 'up' },
          { name: 'Pipeline Health', value: 134, target: 120, trend: 'up' },
          { name: 'Conversion Rate', value: 98, target: 100, trend: 'stable' }
        ]
      },
      {
        department: 'Marketing',
        performance: 108,
        budget: 1800000,
        headcount: 18,
        kpis: [
          { name: 'Lead Generation', value: 124, target: 110, trend: 'up' },
          { name: 'Brand Awareness', value: 103, target: 105, trend: 'stable' },
          { name: 'Campaign ROI', value: 156, target: 130, trend: 'up' }
        ]
      },
      {
        department: 'Product',
        performance: 95,
        budget: 3200000,
        headcount: 32,
        kpis: [
          { name: 'Feature Delivery', value: 87, target: 95, trend: 'down' },
          { name: 'Quality Score', value: 94, target: 90, trend: 'up' },
          { name: 'User Satisfaction', value: 104, target: 100, trend: 'up' }
        ]
      },
      {
        department: 'Operations',
        performance: 104,
        budget: 1600000,
        headcount: 28,
        kpis: [
          { name: 'Efficiency Rating', value: 108, target: 100, trend: 'up' },
          { name: 'Cost Control', value: 96, target: 98, trend: 'stable' },
          { name: 'Process Optimization', value: 118, target: 110, trend: 'up' }
        ]
      }
    ];

    setExecutiveMetrics(metrics);
    setPerformanceInsights(insights);
    setDepartmentData(departments);

    // Update real-time data every 30 seconds
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 20 - 10),
        revenue: prev.revenue + Math.floor(Math.random() * 10000 - 5000),
        conversionRate: +(prev.conversionRate + (Math.random() * 0.2 - 0.1)).toFixed(2),
        customerSat: +(prev.customerSat + (Math.random() * 1 - 0.5)).toFixed(1),
        systemHealth: +(prev.systemHealth + (Math.random() * 0.5 - 0.25)).toFixed(1)
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-emerald-400" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-400" />;
      default: return <Activity className="h-4 w-4 text-amber-400" />;
    }
  };

  const getInsightColor = (category: string) => {
    switch (category) {
      case 'achievement': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'opportunity': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'risk': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'alert': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
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
            <span className="text-white">Executive Dashboard</span>
          </div>
        </div>

        {/* Executive Dashboard Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Executive Analytics Dashboard</h1>
            <p className="text-slate-300">Fortune 1000-grade business intelligence and performance analytics</p>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="secondary" className="bg-slate-700 hover:bg-slate-600 text-slate-100 border-slate-600">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40 bg-slate-800 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Real-Time Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Active Users</h3>
                <Users className="h-5 w-5 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white">{realTimeData.activeUsers.toLocaleString()}</div>
              <div className="text-sm text-slate-400">Live concurrent users</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Revenue</h3>
                <DollarSign className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-white">{formatCurrency(realTimeData.revenue)}</div>
              <div className="text-sm text-slate-400">Today's revenue</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Conversion</h3>
                <Target className="h-5 w-5 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white">{realTimeData.conversionRate}%</div>
              <div className="text-sm text-slate-400">Conversion rate</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Customer Sat</h3>
                <CheckCircle className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-white">{realTimeData.customerSat}%</div>
              <div className="text-sm text-slate-400">Satisfaction score</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">System Health</h3>
                <Activity className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-white">{realTimeData.systemHealth}%</div>
              <div className="text-sm text-slate-400">Platform uptime</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Analytics Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-800/50 border border-slate-700/50">
            <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700">Executive Overview</TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-slate-700">Performance</TabsTrigger>
            <TabsTrigger value="roi" className="data-[state=active]:bg-slate-700">ROI Analytics</TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-slate-700">AI Insights</TabsTrigger>
            <TabsTrigger value="departments" className="data-[state=active]:bg-slate-700">Departments</TabsTrigger>
            <TabsTrigger value="forecasting" className="data-[state=active]:bg-slate-700">Forecasting</TabsTrigger>
          </TabsList>

          {/* Executive Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {executiveMetrics.map((metric) => (
                <Card key={metric.id} className="bg-slate-900/50 border-slate-700/50 hover:bg-slate-800/50 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-white">{metric.name}</h3>
                      {getTrendIcon(metric.trend)}
                    </div>
                    <div className="text-2xl font-bold text-white mb-2">{metric.value}</div>
                    <div className={`text-sm mb-2 ${metric.trend === 'up' ? 'text-emerald-400' : metric.trend === 'down' ? 'text-red-400' : 'text-amber-400'}`}>
                      {metric.change} vs previous period
                    </div>
                    <div className="text-xs text-slate-400">{metric.description}</div>
                    {metric.benchmark && (
                      <div className="text-xs text-slate-500 mt-2">{metric.benchmark}</div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Performance Analytics */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Performance Chart Placeholder */}
              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Revenue Trend Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-64 flex items-center justify-center bg-slate-800/50 rounded-lg">
                    <div className="text-center">
                      <LineChart className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-400">Interactive revenue chart</p>
                      <p className="text-xs text-slate-500">12.4% growth trajectory</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* KPI Performance */}
              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    KPI Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: 'Revenue Growth', value: 112, target: 110, unit: '%' },
                    { name: 'Customer Retention', value: 94, target: 90, unit: '%' },
                    { name: 'Market Share', value: 24, target: 25, unit: '%' },
                    { name: 'Profit Margin', value: 19, target: 18, unit: '%' }
                  ].map((kpi, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white">{kpi.name}</span>
                        <span className={`${kpi.value >= kpi.target ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {kpi.value}{kpi.unit} / {kpi.target}{kpi.unit}
                        </span>
                      </div>
                      <Progress value={(kpi.value / kpi.target) * 100} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ROI Analytics */}
          <TabsContent value="roi" className="space-y-6">
            <ROIDashboard />
          </TabsContent>

          {/* AI Insights */}
          <TabsContent value="insights" className="space-y-6">
            <div className="space-y-4">
              {performanceInsights.map((insight) => (
                <Card key={insight.id} className="bg-slate-900/50 border-slate-700/50">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">{insight.title}</h3>
                          <Badge className={getInsightColor(insight.category)}>
                            {insight.category.toUpperCase()}
                          </Badge>
                          <Badge className={getPriorityColor(insight.priority)}>
                            {insight.priority.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-slate-300 mb-4">{insight.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-slate-400">Confidence</div>
                        <div className="text-xl font-bold text-white">{insight.confidence}%</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="text-sm font-semibold text-white mb-2">Impact</div>
                        <div className="text-emerald-400 font-medium">{insight.impact}</div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-semibold text-white mb-2">Recommendations</div>
                        <div className="space-y-1">
                          {insight.recommendations.map((rec, index) => (
                            <div key={index} className="text-sm text-slate-300 flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                              {rec}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {insight.actionRequired && (
                      <div className="mt-4 pt-4 border-t border-slate-700">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          <Zap className="w-4 h-4 mr-2" />
                          Take Action
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Department Performance */}
          <TabsContent value="departments" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {departmentData.map((dept) => (
                <Card key={dept.department} className="bg-slate-900/50 border-slate-700/50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">{dept.department}</CardTitle>
                      <Badge className={dept.performance >= 100 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'}>
                        {dept.performance}% Performance
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-slate-400">Budget</div>
                        <div className="text-white font-medium">{formatCurrency(dept.budget)}</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Headcount</div>
                        <div className="text-white font-medium">{dept.headcount} people</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {dept.kpis.map((kpi, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-white">{kpi.name}</span>
                            <div className="flex items-center gap-2">
                              <span className={`${kpi.value >= kpi.target ? 'text-emerald-400' : 'text-amber-400'}`}>
                                {kpi.value}% / {kpi.target}%
                              </span>
                              {getTrendIcon(kpi.trend)}
                            </div>
                          </div>
                          <Progress value={Math.min((kpi.value / kpi.target) * 100, 100)} className="h-1.5" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Forecasting */}
          <TabsContent value="forecasting" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Revenue Forecast */}
              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Revenue Forecast
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="h-48 flex items-center justify-center bg-slate-800/50 rounded-lg">
                    <div className="text-center">
                      <BarChart className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                      <p className="text-slate-400">Predictive revenue model</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-slate-400">Q2 Forecast</div>
                      <div className="text-white font-medium">$3.2M (+12.3%)</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Confidence</div>
                      <div className="text-emerald-400 font-medium">87%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Market Trends */}
              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Market Intelligence
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">Market Growth</span>
                        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">POSITIVE</Badge>
                      </div>
                      <div className="text-sm text-slate-400">Industry expanding 8.2% annually</div>
                    </div>
                    <div className="p-3 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">Competitive Position</span>
                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">STRONG</Badge>
                      </div>
                      <div className="text-sm text-slate-400">Top 3 market position maintained</div>
                    </div>
                    <div className="p-3 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">Customer Demand</span>
                        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">HIGH</Badge>
                      </div>
                      <div className="text-sm text-slate-400">23% increase in qualified leads</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </VeridiusPageLayout>
  );
}