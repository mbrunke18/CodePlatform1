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

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const OFF = "#F8F7F4";
const BORDER = "#E8E4DC";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

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
      case 'up': return <TrendingUp className="h-4 w-4 text-[#2B8A6E]" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-[#C9A84C]" />;
      default: return <Activity className="h-4 w-4 text-[#C9A84C]" />;
    }
  };

  const getInsightColor = (category: string) => {
    switch (category) {
      case 'achievement': return 'bg-[#2B8A6E]/10 text-[#2B8A6E] border-none rounded-none';
      case 'opportunity': return 'bg-[#0A0F2E]/10 text-[#0A0F2E] border-none rounded-none';
      case 'risk': return 'bg-[#C9A84C]/10 text-[#C9A84C] border-none rounded-none';
      case 'alert': return 'bg-[#dc2626]/10 text-[#dc2626] border-none rounded-none';
      default: return 'bg-[#F8F7F4] text-[#6B7280] border-none rounded-none';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-[#dc2626] text-white border-none rounded-none';
      case 'high': return 'bg-[#C9A84C] text-[#0A0F2E] border-none rounded-none';
      case 'medium': return 'bg-[#C9A84C] text-[#0A0F2E] border-none rounded-none';
      case 'low': return 'bg-[#2B8A6E] text-white border-none rounded-none';
      default: return 'bg-[#6B7280] text-white border-none rounded-none';
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
      <div className="flex-1 bg-[#F8F7F4] overflow-y-auto p-0 space-y-0">
        
        {/* Navy Header Section */}
        <div style={{ background: "#0A0F2E", padding: "80px 48px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)", backgroundSize: "44px 44px" }} />
          <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
                <div className="w-6 h-0.5" style={{ background: "#C9A84C" }} />
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "#C9A84C" }}>
                  Executive Intelligence
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6" style={CG}>
                Executive <em style={{ fontStyle: "italic", color: "#C9A84C" }}>Analytics</em>
              </h1>
              <p className="text-xl text-white/70 max-w-2xl leading-relaxed">
                startup to Fortune 500-grade business intelligence and performance analytics. 
                Real-time strategic visibility across the enterprise.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-44 h-12 bg-white/5 border-white/10 text-white rounded-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-none border-[#E8E4DC]">
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
              <Button style={{ background: "#C9A84C", color: "#0A0F2E" }} className="hover:bg-[#DFC178] rounded-none h-12 px-8 uppercase tracking-widest font-bold text-[10px]">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-8 py-12 space-y-8">
          {/* Real-Time Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card className="bg-white border-[#E8E4DC] rounded-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">Active Users</h3>
                <Users className="h-5 w-5 text-[#C9A84C]" />
              </div>
              <div className="text-3xl font-bold text-[#C9A84C]" style={CG}>{realTimeData.activeUsers.toLocaleString()}</div>
              <div className="text-xs text-[#6B7280] mt-1 uppercase tracking-widest font-bold">Live concurrent</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#E8E4DC] rounded-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">Revenue</h3>
                <DollarSign className="h-5 w-5 text-[#2B8A6E]" />
              </div>
              <div className="text-3xl font-bold text-[#2B8A6E]" style={CG}>{formatCurrency(realTimeData.revenue)}</div>
              <div className="text-xs text-[#6B7280] mt-1 uppercase tracking-widest font-bold">Today's total</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#E8E4DC] rounded-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">Conversion</h3>
                <Target className="h-5 w-5 text-[#C9A84C]" />
              </div>
              <div className="text-3xl font-bold text-[#C9A84C]" style={CG}>{realTimeData.conversionRate}%</div>
              <div className="text-xs text-[#6B7280] mt-1 uppercase tracking-widest font-bold">Target: 4.0%</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#E8E4DC] rounded-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">Customer Sat</h3>
                <CheckCircle className="h-5 w-5 text-[#2B8A6E]" />
              </div>
              <div className="text-3xl font-bold text-[#2B8A6E]" style={CG}>{realTimeData.customerSat}%</div>
              <div className="text-xs text-[#6B7280] mt-1 uppercase tracking-widest font-bold">Industry leading</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#E8E4DC] rounded-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">System Health</h3>
                <Activity className="h-5 w-5 text-[#2B8A6E]" />
              </div>
              <div className="text-3xl font-bold text-[#2B8A6E]" style={CG}>{realTimeData.systemHealth}%</div>
              <div className="text-xs text-[#6B7280] mt-1 uppercase tracking-widest font-bold">SLA compliant</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Analytics Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white border border-[#E8E4DC] rounded-none p-1 h-auto w-full justify-start">
            <TabsTrigger value="overview" className="rounded-none data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-white text-[10px] font-bold uppercase tracking-widest px-6 py-3">Executive Overview</TabsTrigger>
            <TabsTrigger value="performance" className="rounded-none data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-white text-[10px] font-bold uppercase tracking-widest px-6 py-3">Performance</TabsTrigger>
            <TabsTrigger value="roi" className="rounded-none data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-white text-[10px] font-bold uppercase tracking-widest px-6 py-3">ROI Analytics</TabsTrigger>
            <TabsTrigger value="insights" className="rounded-none data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-white text-[10px] font-bold uppercase tracking-widest px-6 py-3">AI Insights</TabsTrigger>
          </TabsList>

          {/* Executive Overview */}
          <TabsContent value="overview" className="space-y-6 mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {executiveMetrics.map((metric) => (
                <Card key={metric.id} className="bg-white border-[#E8E4DC] rounded-none ">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">{metric.name}</h3>
                      {getTrendIcon(metric.trend)}
                    </div>
                    <div className="text-2xl font-bold text-[#C9A84C] mb-2" style={CG}>{metric.value}</div>
                    <div className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${metric.trend === 'up' ? 'text-[#2B8A6E]' : metric.trend === 'down' ? 'text-[#C9A84C]' : 'text-[#C9A84C]'}`}>
                      {metric.change} vs period
                    </div>
                    <div className="text-xs text-[#6B7280]">{metric.description}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* AI Insights */}
          <TabsContent value="insights" className="space-y-6 mt-0">
            <div className="space-y-4">
              {performanceInsights.map((insight) => (
                <Card key={insight.id} className="bg-white border-[#E8E4DC] rounded-none">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div style={{ width: 24, height: 2, background: GOLD }} />
                          <h3 className="text-xl font-bold text-[#C9A84C]" style={CG}>{insight.title}</h3>
                          <Badge className={getInsightColor(insight.category)}>
                            {insight.category.toUpperCase()}
                          </Badge>
                          <Badge className={getPriorityColor(insight.priority)}>
                            {insight.priority.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-[#4B5563] mb-6 max-w-3xl">{insight.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">Confidence</div>
                        <div className="text-2xl font-bold text-[#C9A84C]" style={CG}>{insight.confidence}%</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280] mb-2">Projected Impact</div>
                        <div className="text-lg font-bold text-[#2B8A6E]" style={CG}>{insight.impact}</div>
                      </div>
                      
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280] mb-2">Recommended Actions</div>
                        <div className="space-y-2">
                          {insight.recommendations.map((rec, index) => (
                            <div key={index} className="text-sm text-[#6B7280] flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-[#2B8A6E] shrink-0 mt-0.5" />
                              {rec}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {insight.actionRequired && (
                      <div className="mt-8 pt-6 border-t border-[#E8E4DC]">
                        <Button className="bg-[#0A0F2E] hover:bg-[#141B45] text-white rounded-none h-12 px-8 uppercase tracking-widest font-bold text-[10px]">
                          <Zap className="w-4 h-4 mr-2" />
                          Activate Strategic Readiness Protocol
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Organizational Resilience Score */}
        <div className="bg-white border rounded-sm p-8" style={{ borderColor: "#E8E4DC" }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "#6B7280" }}>Organizational Resilience Score</div>
              <h3 className="text-2xl font-bold" style={{ color: "#0A0F2E", fontFamily: "'Cormorant Garamond', serif" }}>Enterprise Execution Readiness</h3>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold" style={{ color: "#C9A84C", fontFamily: "'Cormorant Garamond', serif" }}>87</div>
              <div className="text-[10px] uppercase tracking-widest font-bold" style={{ color: "#2B8A6E" }}>/ 100 — Strong</div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { dimension: "Detection Speed", score: 94, color: "#2B8A6E" },
              { dimension: "Readiness Protocol Coverage", score: 89, color: "#C9A84C" },
              { dimension: "Stakeholder Reach", score: 83, color: "#0A0F2E" },
              { dimension: "Decision Velocity", score: 91, color: "#2B8A6E" },
              { dimension: "Learning Capture", score: 78, color: "#C9A84C" },
            ].map((dim) => (
              <div key={dim.dimension} className="text-center p-4 bg-[#F8F7F4] rounded-sm">
                <div className="text-2xl font-bold mb-1" style={{ color: dim.color, fontFamily: "'Cormorant Garamond', serif" }}>{dim.score}</div>
                <div className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "#6B7280" }}>{dim.dimension}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 90-Day Strategic Forecast */}
        <div className="bg-white border rounded-sm p-8" style={{ borderColor: "#E8E4DC" }}>
          <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "#6B7280" }}>System-Generated</div>
          <h3 className="text-xl font-bold mb-6" style={{ color: "#0A0F2E", fontFamily: "'Cormorant Garamond', serif" }}>90-Day Strategic Forecast</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                window: "Next 30 Days",
                confidence: 94,
                headline: "Regulatory review cycle peaks",
                detail: "3 compliance Readiness Protocols should be elevated to Primary status. Legal team coverage at 87% — one gap identified in GDPR documentation.",
                action: "Review Compliance Readiness Protocols",
              },
              {
                window: "Days 31–60",
                confidence: 82,
                headline: "M&A integration risk window",
                detail: "Q2 integration milestones due. Change management Readiness Protocol should be activated by Day 45 to protect employee retention score.",
                action: "Activate Integration Readiness Protocol",
              },
              {
                window: "Days 61–90",
                confidence: 76,
                headline: "Competitive market shift probable",
                detail: "Signal clusters across 4 sources suggest a competitor pricing action in Q3. Strategic Response Readiness Protocol pre-staged and ready.",
                action: "Pre-Stage Response Readiness Protocol",
              },
            ].map((f) => (
              <div key={f.window} className="p-5 bg-[#F8F7F4] rounded-sm border" style={{ borderColor: "#E8E4DC" }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#0A0F2E" }}>{f.window}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#C9A84C" }}>{f.confidence}% confidence</span>
                </div>
                <div className="font-semibold text-sm mb-2" style={{ color: "#0A0F2E" }}>{f.headline}</div>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "#6B7280" }}>{f.detail}</p>
                <button className="text-[10px] font-bold uppercase tracking-widest px-4 py-2 border" style={{ color: "#0A0F2E", borderColor: "#0A0F2E" }}>
                  {f.action} →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </PageLayout>
  );
}
