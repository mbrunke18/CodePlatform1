import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'wouter';
import PageLayout from '@/components/layout/PageLayout';
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
import { BrandStamp } from "@/components/BrandStamp";

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
    const fetchData = async () => {
      try {
        const [metricsRes, velocityRes] = await Promise.all([
          fetch('/api/dashboard/metrics'),
          fetch('/api/decision-velocity/metrics')
        ]);

        if (metricsRes.ok) {
          const metricsData = await metricsRes.json();
          if (metricsData.success) {
            if (metricsData.executiveMetrics) setExecutiveMetrics(metricsData.executiveMetrics);
            if (metricsData.performanceInsights) setPerformanceInsights(metricsData.performanceInsights);
            if (metricsData.departmentData) setDepartmentData(metricsData.departmentData);
            if (metricsData.realTimeData) setRealTimeData(metricsData.realTimeData);
          }
        }
      } catch (error) {
        console.error('Error fetching executive dashboard data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
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
      default: return 'bg-slate-500/20 text-gray-800 border-slate-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-slate-500/20 text-gray-800 border-slate-500/30';
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
    <PageLayout>
      <div className="flex-1 page-background overflow-y-auto p-8 space-y-8">
        
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-200">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-gray-800 dark:text-gray-200 hover:text-white p-1 h-auto">
                <Home className="h-4 w-4" />
              </Button>
            </Link>
            <span>/</span>
            <span>Analytics & Intelligence</span>
            <span>/</span>
            <span className="text-gray-900">Executive Dashboard</span>
          </div>
        </div>

        {/* Executive Dashboard Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Executive Analytics Dashboard</h1>
            <p className="text-gray-800">Fortune 1000-grade business intelligence and performance analytics</p>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="secondary" className="bg-gray-50 hover:bg-slate-600 text-gray-700 border-slate-600">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40 bg-gray-50 border-slate-600 text-gray-900">
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
          <Card className="bg-white border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Active Users</h3>
                <Users className="h-5 w-5 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{realTimeData.activeUsers.toLocaleString()}</div>
              <div className="text-sm text-gray-800 dark:text-slate-200">Live concurrent users</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Revenue</h3>
                <DollarSign className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(realTimeData.revenue)}</div>
              <div className="text-sm text-gray-800 dark:text-slate-200">Today's revenue</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Conversion</h3>
                <Target className="h-5 w-5 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{realTimeData.conversionRate}%</div>
              <div className="text-sm text-gray-800 dark:text-slate-200">Conversion rate</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Customer Sat</h3>
                <CheckCircle className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{realTimeData.customerSat}%</div>
              <div className="text-sm text-gray-800 dark:text-slate-200">Satisfaction score</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">System Health</h3>
                <Activity className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{realTimeData.systemHealth}%</div>
              <div className="text-sm text-gray-800 dark:text-slate-200">Platform uptime</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Analytics Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-gray-50 border border-gray-200">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gray-50">Executive Overview</TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-gray-50">Performance</TabsTrigger>
            <TabsTrigger value="roi" className="data-[state=active]:bg-gray-50">ROI Analytics</TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-gray-50">AI Insights</TabsTrigger>
            <TabsTrigger value="departments" className="data-[state=active]:bg-gray-50">Departments</TabsTrigger>
            <TabsTrigger value="forecasting" className="data-[state=active]:bg-gray-50">Forecasting</TabsTrigger>
          </TabsList>

          {/* Executive Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {executiveMetrics.map((metric) => (
                <Card key={metric.id} className="bg-white border-gray-200 hover:bg-slate-800/50 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">{metric.name}</h3>
                      {getTrendIcon(metric.trend)}
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-2">{metric.value}</div>
                    <div className={`text-sm mb-2 ${metric.trend === 'up' ? 'text-emerald-400' : metric.trend === 'down' ? 'text-red-400' : 'text-amber-400'}`}>
                      {metric.change} vs previous period
                    </div>
                    <div className="text-xs text-gray-800 dark:text-slate-200">{metric.description}</div>
                    {metric.benchmark && (
                      <div className="text-xs text-gray-800 mt-2">{metric.benchmark}</div>
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
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Revenue Trend Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <LineChart className="h-16 w-16 text-gray-800 dark:text-slate-200 mx-auto mb-4" />
                      <p className="text-gray-800 dark:text-slate-200">Interactive revenue chart</p>
                      <p className="text-xs text-gray-800">12.4% growth trajectory</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* KPI Performance */}
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center gap-2">
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
                        <span className="text-gray-900">{kpi.name}</span>
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
                <Card key={insight.id} className="bg-white border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 page-background">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{insight.title}</h3>
                          <BrandStamp variant="dual" size="md" className="mb-8" />
                          <Badge className={getInsightColor(insight.category)}>
                            {insight.category.toUpperCase()}
                          </Badge>
                          <Badge className={getPriorityColor(insight.priority)}>
                            {insight.priority.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-gray-800 mb-4">{insight.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-800 dark:text-slate-200">Confidence</div>
                        <div className="text-xl font-bold text-gray-900">{insight.confidence}%</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="text-sm font-semibold text-gray-900 mb-2">Impact</div>
                        <div className="text-emerald-400 font-medium">{insight.impact}</div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-semibold text-gray-900 mb-2">Recommendations</div>
                        <div className="space-y-1">
                          {insight.recommendations.map((rec, index) => (
                            <div key={index} className="text-sm text-gray-800 flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                              {rec}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {insight.actionRequired && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
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
                <Card key={dept.department} className="bg-white border-gray-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-gray-900">{dept.department}</CardTitle>
                      <Badge className={dept.performance >= 100 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'}>
                        {dept.performance}% Performance
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-800 dark:text-slate-200">Budget</div>
                        <div className="text-gray-900 font-medium">{formatCurrency(dept.budget)}</div>
                      </div>
                      <div>
                        <div className="text-gray-800 dark:text-slate-200">Headcount</div>
                        <div className="text-gray-900 font-medium">{dept.headcount} people</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {dept.kpis.map((kpi, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-900">{kpi.name}</span>
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
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Revenue Forecast
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <BarChart className="h-12 w-12 text-gray-800 dark:text-slate-200 mx-auto mb-2" />
                      <p className="text-gray-800 dark:text-slate-200">Predictive revenue model</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-800 dark:text-slate-200">Q2 Forecast</div>
                      <div className="text-gray-900 font-medium">$3.2M (+12.3%)</div>
                    </div>
                    <div>
                      <div className="text-gray-800 dark:text-slate-200">Confidence</div>
                      <div className="text-emerald-400 font-medium">87%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Market Trends */}
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Market Intelligence
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-900 font-medium">Market Growth</span>
                        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">POSITIVE</Badge>
                      </div>
                      <div className="text-sm text-gray-800 dark:text-slate-200">Industry expanding 8.2% annually</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-900 font-medium">Competitive Position</span>
                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">STRONG</Badge>
                      </div>
                      <div className="text-sm text-gray-800 dark:text-slate-200">Top 3 market position maintained</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-900 font-medium">Customer Demand</span>
                        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">HIGH</Badge>
                      </div>
                      <div className="text-sm text-gray-800 dark:text-slate-200">23% increase in qualified leads</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}