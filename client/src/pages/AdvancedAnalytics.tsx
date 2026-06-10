import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Link, useLocation } from 'wouter';
import PageLayout from '@/components/layout/PageLayout';
import { AIChat } from '@/components/AIChat';
import { 
  TrendingUp, 
  BarChart3, 
  Target, 
  DollarSign,
  AlertTriangle,
  Brain,
  Activity,
  Globe,
  Users,
  Zap,
  Clock,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Minus,
  ArrowLeft,
  Home,
  MessageSquare
} from 'lucide-react';

interface PredictiveModel {
  id: string;
  name: string;
  type: 'revenue' | 'market_share' | 'customer_churn' | 'operational_efficiency' | 'risk_assessment';
  accuracy: number;
  confidenceInterval: {
    lower: number;
    upper: number;
  };
  predictions: {
    period: string;
    value: number;
    probability: number;
    factors: string[];
  }[];
  keyDrivers: {
    factor: string;
    impact: number;
    trend: 'positive' | 'negative' | 'stable';
    significance: number;
  }[];
  scenarios: {
    name: string;
    probability: number;
    outcome: number;
    description: string;
  }[];
}

interface BusinessIntelligence {
  id: string;
  category: 'market' | 'financial' | 'operational' | 'competitive' | 'regulatory';
  insight: string;
  impact: 'high' | 'medium' | 'low';
  timeHorizon: 'immediate' | 'short_term' | 'long_term';
  actionRequired: boolean;
  quantifiedValue: number;
  riskLevel: number;
  sources: string[];
  recommendations: {
    action: string;
    priority: number;
    estimatedROI: number;
    timeToImplement: string;
  }[];
}

interface IndustryBenchmark {
  metric: string;
  ourPerformance: number;
  industryAverage: number;
  topQuartile: number;
  percentileRank: number;
  improvementPotential: number;
  competitiveGap: number;
  trends: {
    period: string;
    value: number;
    industryValue: number;
  }[];
}

export default function AdvancedAnalytics() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('lifecycle');
  const [predictiveModels, setPredictiveModels] = useState<PredictiveModel[]>([]);
  const [businessIntelligence, setBusinessIntelligence] = useState<BusinessIntelligence[]>([]);
  const [industryBenchmarks, setIndustryBenchmarks] = useState<IndustryBenchmark[]>([]);

  useEffect(() => {
    // Advanced Predictive Models
    const models: PredictiveModel[] = [
      {
        id: 'revenue-forecast',
        name: 'Revenue Forecasting Model',
        type: 'revenue',
        accuracy: 94.7,
        confidenceInterval: { lower: 92.1, upper: 97.3 },
        predictions: [
          { period: 'Q2 2024', value: 3200000, probability: 87.3, factors: ['market expansion', 'product launch', 'seasonal trends'] },
          { period: 'Q3 2024', value: 3850000, probability: 82.1, factors: ['new customer acquisition', 'price optimization'] },
          { period: 'Q4 2024', value: 4100000, probability: 78.9, factors: ['holiday seasonality', 'enterprise contracts'] }
        ],
        keyDrivers: [
          { factor: 'Customer Acquisition Rate', impact: 0.34, trend: 'positive', significance: 0.92 },
          { factor: 'Average Contract Value', impact: 0.28, trend: 'positive', significance: 0.87 },
          { factor: 'Market Expansion', impact: 0.23, trend: 'positive', significance: 0.81 },
          { factor: 'Competitive Pressure', impact: -0.15, trend: 'negative', significance: 0.76 }
        ],
        scenarios: [
          { name: 'Best Case', probability: 15, outcome: 4500000, description: 'Major enterprise wins + market expansion success' },
          { name: 'Expected', probability: 70, outcome: 3850000, description: 'Normal growth trajectory with current initiatives' },
          { name: 'Conservative', probability: 15, outcome: 3200000, description: 'Market headwinds + delayed initiatives' }
        ]
      },
      {
        id: 'churn-prediction',
        name: 'Customer Churn Risk Model',
        type: 'customer_churn',
        accuracy: 91.2,
        confidenceInterval: { lower: 89.8, upper: 92.6 },
        predictions: [
          { period: 'Next 30 Days', value: 3.2, probability: 94.1, factors: ['engagement decline', 'support tickets', 'usage patterns'] },
          { period: 'Next 90 Days', value: 8.7, probability: 89.3, factors: ['contract renewal timing', 'competitive activity'] },
          { period: 'Next 180 Days', value: 15.4, probability: 83.7, factors: ['budget cycles', 'feature gap analysis'] }
        ],
        keyDrivers: [
          { factor: 'Product Engagement Score', impact: -0.42, trend: 'negative', significance: 0.95 },
          { factor: 'Support Ticket Volume', impact: 0.31, trend: 'positive', significance: 0.88 },
          { factor: 'Feature Utilization', impact: -0.29, trend: 'stable', significance: 0.82 },
          { factor: 'Contract Value', impact: -0.18, trend: 'stable', significance: 0.74 }
        ],
        scenarios: [
          { name: 'High Risk', probability: 20, outcome: 22.1, description: 'Major product issues + competitive pressure' },
          { name: 'Baseline', probability: 65, outcome: 8.7, description: 'Normal churn patterns with current interventions' },
          { name: 'Optimized', probability: 15, outcome: 4.2, description: 'Successful retention programs + product improvements' }
        ]
      }
    ];

    // Business Intelligence Insights
    const intelligence: BusinessIntelligence[] = [
      {
        id: 'market-opportunity',
        category: 'market',
        insight: 'AI automation market segment shows 67% growth potential with $4.2M revenue opportunity in next 18 months',
        impact: 'high',
        timeHorizon: 'short_term',
        actionRequired: true,
        quantifiedValue: 4200000,
        riskLevel: 23,
        sources: ['Gartner Research', 'IDC Market Analysis', 'Forrester Reports', 'Internal Sales Data'],
        recommendations: [
          { action: 'Accelerate AI product development', priority: 1, estimatedROI: 340, timeToImplement: '6 months' },
          { action: 'Strategic partnership with AI vendors', priority: 2, estimatedROI: 225, timeToImplement: '3 months' },
          { action: 'Sales team specialization training', priority: 3, estimatedROI: 180, timeToImplement: '2 months' }
        ]
      },
      {
        id: 'operational-efficiency',
        category: 'operational',
        insight: 'Process automation could reduce operational costs by $1.8M annually while improving delivery speed by 34%',
        impact: 'high',
        timeHorizon: 'immediate',
        actionRequired: true,
        quantifiedValue: 1800000,
        riskLevel: 12,
        sources: ['McKinsey Operations Study', 'Internal Process Analysis', 'Vendor Benchmarking'],
        recommendations: [
          { action: 'Implement RPA for finance processes', priority: 1, estimatedROI: 280, timeToImplement: '4 months' },
          { action: 'Automate customer onboarding', priority: 2, estimatedROI: 195, timeToImplement: '3 months' },
          { action: 'Deploy Continuous quality monitoring', priority: 3, estimatedROI: 165, timeToImplement: '5 months' }
        ]
      },
      {
        id: 'competitive-threat',
        category: 'competitive',
        insight: 'Competitor X launching similar solution in Q3 with 25% lower pricing - potential 15% market share impact',
        impact: 'high',
        timeHorizon: 'short_term',
        actionRequired: true,
        quantifiedValue: -2300000,
        riskLevel: 78,
        sources: ['Competitive Intelligence', 'Industry Reports', 'Sales Team Feedback', 'Customer Surveys'],
        recommendations: [
          { action: 'Accelerate unique feature development', priority: 1, estimatedROI: 210, timeToImplement: '4 months' },
          { action: 'Implement value-based pricing strategy', priority: 2, estimatedROI: 175, timeToImplement: '2 months' },
          { action: 'Strengthen customer relationships', priority: 3, estimatedROI: 145, timeToImplement: '1 month' }
        ]
      }
    ];

    // Industry Benchmarks
    const benchmarks: IndustryBenchmark[] = [
      {
        metric: 'Customer Acquisition Cost',
        ourPerformance: 1250,
        industryAverage: 1580,
        topQuartile: 980,
        percentileRank: 72,
        improvementPotential: 270,
        competitiveGap: -330,
        trends: [
          { period: 'Q1 2024', value: 1320, industryValue: 1620 },
          { period: 'Q2 2024', value: 1285, industryValue: 1590 },
          { period: 'Q3 2024', value: 1250, industryValue: 1580 }
        ]
      },
      {
        metric: 'Revenue per Employee',
        ourPerformance: 285000,
        industryAverage: 245000,
        topQuartile: 320000,
        percentileRank: 68,
        improvementPotential: 35000,
        competitiveGap: 40000,
        trends: [
          { period: 'Q1 2024', value: 275000, industryValue: 240000 },
          { period: 'Q2 2024', value: 280000, industryValue: 242000 },
          { period: 'Q3 2024', value: 285000, industryValue: 245000 }
        ]
      },
      {
        metric: 'Net Promoter Score',
        ourPerformance: 67,
        industryAverage: 52,
        topQuartile: 75,
        percentileRank: 78,
        improvementPotential: 8,
        competitiveGap: 15,
        trends: [
          { period: 'Q1 2024', value: 63, industryValue: 50 },
          { period: 'Q2 2024', value: 65, industryValue: 51 },
          { period: 'Q3 2024', value: 67, industryValue: 52 }
        ]
      }
    ];

    setPredictiveModels(models);
    setBusinessIntelligence(intelligence);
    setIndustryBenchmarks(benchmarks);
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'positive': return <ArrowUp className="h-4 w-4 text-[#2B8A6E]" />;
      case 'negative': return <ArrowDown className="h-4 w-4 text-red-600" />;
      default: return <Minus className="h-4 w-4 text-[#C9A84C]" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'medium': return 'bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/20';
      case 'low': return 'bg-[#2B8A6E]/10 text-[#2B8A6E] border-[#2B8A6E]/20';
      default: return 'bg-[#0A0F2E]/5 text-[#0A0F2E] border-[#0A0F2E]/10';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  return (
    <PageLayout>
      <div className="flex-1 bg-[#F8F7F4] overflow-y-auto p-8 space-y-8">
        
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-[#0A0F2E]">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-[#0A0F2E] hover:bg-[#0A0F2E]/5 p-1 h-auto">
                <Home className="h-4 w-4" />
              </Button>
            </Link>
            <span className="text-[#6B7280]">/</span>
            <span className="text-[#6B7280]">Analytics & Intelligence</span>
            <span className="text-[#6B7280]">/</span>
            <span className="text-[#0A0F2E] font-medium">Advanced Analytics</span>
          </div>
        </div>

        {/* Advanced Analytics Header */}
        <div className="flex items-center justify-between">
          <div className="bg-[#0A0F2E] text-white p-8 relative overflow-hidden w-full flex items-center justify-between">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#C9A84C 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            <div className="relative z-10">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 24, height: 1, background: '#C9A84C' }} />
                <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C9A84C' }}>Analytics &amp; Intelligence</span>
              </div>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px,3.5vw,40px)', fontWeight: 700, color: '#fff', lineHeight: 1.15, marginBottom: 8 }}>
                Advanced Business <em style={{ fontStyle: 'italic', color: '#C9A84C' }}>Intelligence</em>
              </h1>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>Predictive analytics, market intelligence, and competitive benchmarking</p>
            </div>
            <div className="relative z-10 flex items-center gap-4">
              <Link to="/">
                <Button variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10 rounded-none text-xs tracking-wider uppercase font-bold">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(43,138,110,0.15)', color: '#2B8A6E', fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' as const, padding: '6px 14px' }}>
                <Brain className="w-3 h-3" />
                12 Models Active
              </div>
              <Button className="bg-[#C9A84C] text-[#0A0F2E] font-bold hover:bg-[#DFC178] rounded-none text-xs tracking-wider uppercase" onClick={() => setLocation('/roi-calculator')}>
                <BarChart3 className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>
        </div>

        {/* Advanced Analytics Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white border border-[#E8E4DC] rounded-none h-12 p-0 gap-0 px-2">
            <TabsTrigger value="lifecycle" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#C9A84C] data-[state=active]:bg-transparent data-[state=active]:text-[#0A0F2E] text-[#6B7280] font-bold text-[10px] uppercase tracking-wider px-4">Lifecycle Performance</TabsTrigger>
            <TabsTrigger value="predictive" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#C9A84C] data-[state=active]:bg-transparent data-[state=active]:text-[#0A0F2E] text-[#6B7280] font-bold text-[10px] uppercase tracking-wider px-4">Predictive Models</TabsTrigger>
            <TabsTrigger value="intelligence" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#C9A84C] data-[state=active]:bg-transparent data-[state=active]:text-[#0A0F2E] text-[#6B7280] font-bold text-[10px] uppercase tracking-wider px-4">Business Intelligence</TabsTrigger>
            <TabsTrigger value="benchmarks" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#C9A84C] data-[state=active]:bg-transparent data-[state=active]:text-[#0A0F2E] text-[#6B7280] font-bold text-[10px] uppercase tracking-wider px-4">Industry Benchmarks</TabsTrigger>
            <TabsTrigger value="scenarios" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#C9A84C] data-[state=active]:bg-transparent data-[state=active]:text-[#0A0F2E] text-[#6B7280] font-bold text-[10px] uppercase tracking-wider px-4">Scenario Analysis</TabsTrigger>
            <TabsTrigger value="ai-chat" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#C9A84C] data-[state=active]:bg-transparent data-[state=active]:text-[#0A0F2E] text-[#6B7280] font-bold text-[10px] uppercase tracking-wider px-4 flex items-center gap-2">
              <MessageSquare className="h-3 w-3" />
              Strategic Chat
            </TabsTrigger>
          </TabsList>

          {/* Lifecycle Performance */}
          <TabsContent value="lifecycle" className="space-y-6">
            <div className="space-y-6">

              {/* Stage banner */}
              <div style={{ background: '#0A0F2E', padding: '28px 32px', display: 'flex', gap: 1, overflow: 'hidden' }}>
                {[
                  { num: '01', stage: 'IDENTIFY', label: 'Situations Catalogued', value: '231', color: '#C9A84C' },
                  { num: '02', stage: 'DETECT', label: 'Signal Data Points', value: '248+', color: '#2B8A6E' },
                  { num: '03', stage: 'AUTHORIZE', label: 'Decision Lead-Time', value: '< 3 min', color: '#C9A84C' },
                  { num: '04', stage: 'EXECUTE', label: 'Full Deploy Window', value: '12 min', color: '#2B8A6E' },
                  { num: '05', stage: 'ADVANCE', label: 'Improvement / Cycle', value: '+18%', color: '#C9A84C' },
                ].map((s, i) => (
                  <div key={i} style={{ flex: 1, padding: '0 20px', borderRight: i < 4 ? '1px solid rgba(255,255,255,0.07)' : 'none', textAlign: 'center' }}>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 8, fontWeight: 800, letterSpacing: '0.22em', color: s.color, textTransform: 'uppercase' as const, marginBottom: 6 }}>{s.num} · {s.stage}</div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, color: '#fff', lineHeight: 1, marginBottom: 4 }}>{s.value}</div>
                    <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Detection Lead-Time */}
              <Card className="bg-white border-[#E8E4DC] rounded-none">
                <CardHeader style={{ borderBottom: '1px solid #E8E4DC', paddingBottom: 16 }}>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-[#0A0F2E] flex items-center gap-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20 }}>
                      <Clock className="h-5 w-5 text-[#C9A84C]" />
                      Detection Lead-Time
                    </CardTitle>
                    <Badge className="bg-[#C9A84C]/15 text-[#C9A84C] border-[#C9A84C]/25 rounded-none text-[9px] tracking-wider uppercase font-bold px-2">Stage 02 · Monitor</Badge>
                  </div>
                  <p className="text-[#6B7280] text-sm mt-1">How far ahead of trigger escalation signals are detected — the earlier the detection, the more options available to the executive.</p>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {[
                      { label: 'Avg. Signal Lead', value: '4.2 days', sub: 'Before trigger becomes critical', color: '#2B8A6E' },
                      { label: 'Early Detections', value: '73%', sub: 'Detected before public escalation', color: '#C9A84C' },
                      { label: 'Monitoring Cadence', value: '15 min', sub: 'Signal refresh cycle', color: '#0A0F2E' },
                    ].map((m, i) => (
                      <div key={i} style={{ padding: '20px', background: '#F8F7F4', borderLeft: `3px solid ${m.color}` }}>
                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color: m.color, lineHeight: 1, marginBottom: 4 }}>{m.value}</div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#0A0F2E', marginBottom: 2 }}>{m.label}</div>
                        <div style={{ fontSize: 10, color: '#6B7280' }}>{m.sub}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ padding: '14px 20px', background: '#F0FDF8', border: '1px solid #2B8A6E22', fontSize: 12, color: '#2B8A6E', lineHeight: 1.6 }}>
                    <strong>Why it matters:</strong> Detection lead-time is the advantage that enables all other stages. Every extra day of lead-time expands available response options and reduces mobilization cost.
                  </div>
                </CardContent>
              </Card>

              {/* Decision-to-Action */}
              <Card className="bg-white border-[#E8E4DC] rounded-none">
                <CardHeader style={{ borderBottom: '1px solid #E8E4DC', paddingBottom: 16 }}>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-[#0A0F2E] flex items-center gap-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20 }}>
                      <Zap className="h-5 w-5 text-[#2B8A6E]" />
                      Decision-to-Action
                    </CardTitle>
                    <Badge className="bg-[#2B8A6E]/15 text-[#2B8A6E] border-[#2B8A6E]/25 rounded-none text-[9px] tracking-wider uppercase font-bold px-2">Stages 03–04 · Decide → Execute</Badge>
                  </div>
                  <p className="text-[#6B7280] text-sm mt-1">Time from executive authorization to full organizational deployment — the core 3,600× Execution Head Start metric.</p>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: '#6B7280', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Old Operating Model</div>
                      {[
                        { phase: 'Identify response owners', days: '2–5 days' },
                        { phase: 'Align on approach', days: '5–10 days' },
                        { phase: 'Assign tasks & budget', days: '3–7 days' },
                        { phase: 'Begin coordinated execution', days: '10–20 days' },
                      ].map((r, i) => (
                        <div key={i} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid #F0EDE4' }}>
                          <span style={{ fontSize: 12, color: '#374151' }}>{r.phase}</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: '#EF4444' }}>{r.days}</span>
                        </div>
                      ))}
                      <div className="flex items-center justify-between pt-3">
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#0A0F2E' }}>Total Mobilization</span>
                        <span style={{ fontSize: 14, fontWeight: 800, color: '#EF4444' }}>20–42 days</span>
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: '#2B8A6E', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>With Readiness OS</div>
                      {[
                        { phase: 'Trigger detected & matched', time: '< 1 min' },
                        { phase: 'Protocol surfaced to executive', time: '< 2 min' },
                        { phase: 'Executive authorizes', time: '< 8 min' },
                        { phase: 'Full org deploying', time: '12 min total' },
                      ].map((r, i) => (
                        <div key={i} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid #F0EDE4' }}>
                          <span style={{ fontSize: 12, color: '#374151' }}>{r.phase}</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: '#2B8A6E' }}>{r.time}</span>
                        </div>
                      ))}
                      <div className="flex items-center justify-between pt-3">
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#0A0F2E' }}>Total Mobilization</span>
                        <span style={{ fontSize: 14, fontWeight: 800, color: '#2B8A6E' }}>12 minutes</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: '14px 20px', background: '#F8F4E8', border: '1px solid #C9A84C22', fontSize: 12, color: '#92650A', lineHeight: 1.6 }}>
                    <strong>3,600× Execution Head Start:</strong> 30 conservative days vs. 12 minutes. Every Readiness Protocol pre-stages this entire sequence — tasks, budgets, communications, stakeholder assignments — before the trigger fires.
                  </div>
                </CardContent>
              </Card>

              {/* Learning Loop */}
              <Card className="bg-white border-[#E8E4DC] rounded-none">
                <CardHeader style={{ borderBottom: '1px solid #E8E4DC', paddingBottom: 16 }}>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-[#0A0F2E] flex items-center gap-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20 }}>
                      <TrendingUp className="h-5 w-5 text-[#C9A84C]" />
                      Learning Loop
                    </CardTitle>
                    <Badge className="bg-[#C9A84C]/15 text-[#C9A84C] border-[#C9A84C]/25 rounded-none text-[9px] tracking-wider uppercase font-bold px-2">Stage 05 · Learn</Badge>
                  </div>
                  <p className="text-[#6B7280] text-sm mt-1">How each activation improves institutional readiness — the compounding advantage that grows with every event.</p>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {[
                      { label: 'Avg. Protocol Improvement', value: '+18%', sub: 'Per activation cycle', color: '#C9A84C' },
                      { label: 'Institutional Memory Score', value: '84/100', sub: 'Encoded scenarios + outcomes', color: '#2B8A6E' },
                      { label: 'Repeat-Trigger Response', value: '3.1 min', sub: 'For previously-activated protocols', color: '#0A0F2E' },
                    ].map((m, i) => (
                      <div key={i} style={{ padding: '20px', background: '#F8F7F4', borderLeft: `3px solid ${m.color}` }}>
                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color: m.color, lineHeight: 1, marginBottom: 4 }}>{m.value}</div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#0A0F2E', marginBottom: 2 }}>{m.label}</div>
                        <div style={{ fontSize: 10, color: '#6B7280' }}>{m.sub}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: '#0A0F2E', padding: '20px 24px' }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontStyle: 'italic', color: '#fff', lineHeight: 1.6, marginBottom: 8 }}>
                      "The first activation makes your organization better at the second. The tenth makes you nearly impossible to catch off-guard."
                    </div>
                    <div style={{ fontSize: 10, color: 'rgba(201,168,76,0.8)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Compounding Readiness Advantage</div>
                  </div>
                </CardContent>
              </Card>

            </div>
          </TabsContent>

          {/* Predictive Models */}
          <TabsContent value="predictive" className="space-y-6">
            <div className="space-y-6">
              {predictiveModels.map((model) => (
                <Card key={model.id} className="bg-white border-[#E8E4DC]">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-[#0A0F2E] flex items-center gap-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        <Brain className="h-6 w-6 text-[#C9A84C]" />
                        {model.name}
                      </CardTitle>
                      <Badge className="bg-[#2B8A6E]/20 text-[#2B8A6E] border-[#2B8A6E]/30">
                        {model.accuracy}% Accuracy
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    
                    {/* Predictions */}
                    <div>
                      <h4 className="font-semibold text-[#0A0F2E] mb-3">Forecasts</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {model.predictions.map((prediction, index) => (
                          <div key={index} className="p-4 bg-[#F8F7F4] border border-[#E8E4DC]">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[#0A0F2E] font-medium">{prediction.period}</span>
                              <Badge className="bg-[#0A0F2E]/10 text-[#0A0F2E] border-[#0A0F2E]/20">
                                {prediction.probability}% Confidence
                              </Badge>
                            </div>
                            <div className="text-2xl font-bold text-[#C9A84C] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                              {model.type === 'revenue' ? formatCurrency(prediction.value) : 
                               model.type === 'customer_churn' ? `${prediction.value}%` : 
                               prediction.value.toLocaleString()}
                            </div>
                            <div className="text-xs text-[#6B7280]">
                              Key factors: {prediction.factors.slice(0, 2).join(', ')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Key Drivers */}
                    <div>
                      <h4 className="font-semibold text-[#0A0F2E] mb-3">Key Drivers</h4>
                      <div className="space-y-3">
                        {model.keyDrivers.map((driver, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-[#F8F7F4] border border-[#E8E4DC]">
                            <div className="flex items-center gap-3">
                              {getTrendIcon(driver.trend)}
                              <span className="text-[#0A0F2E]">{driver.factor}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div className="text-sm font-medium text-[#0A0F2E]">
                                  {(Math.abs(driver.impact) * 100).toFixed(1)}% Impact
                                </div>
                                <div className="text-xs text-[#6B7280]">
                                  {(driver.significance * 100).toFixed(0)}% Significance
                                </div>
                              </div>
                              <Progress value={driver.significance * 100} className="w-20 h-2 [&>div]:bg-[#C9A84C]" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Scenarios */}
                    <div>
                      <h4 className="font-semibold text-[#0A0F2E] mb-3">Scenario Analysis</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {model.scenarios.map((scenario, index) => (
                          <div key={index} className="p-4 bg-white border border-[#E8E4DC]">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-[#0A0F2E]">{scenario.name}</span>
                              <span className="text-sm text-[#6B7280]">{scenario.probability}%</span>
                            </div>
                            <div className="text-xl font-bold text-[#0A0F2E] mb-2">
                              {model.type === 'revenue' ? formatCurrency(scenario.outcome) : `${scenario.outcome}%`}
                            </div>
                            <p className="text-xs text-[#6B7280]">{scenario.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Business Intelligence */}
          <TabsContent value="intelligence" className="space-y-6">
            <div className="space-y-4">
              {businessIntelligence.map((insight) => (
                <Card key={insight.id} className="bg-white border-[#E8E4DC]">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className={getImpactColor(insight.impact)}>
                            {insight.impact.toUpperCase()} IMPACT
                          </Badge>
                          <Badge variant="outline" className="border-[#E8E4DC] text-[#6B7280]">
                            {insight.category.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="border-[#E8E4DC] text-[#6B7280]">
                            {insight.timeHorizon.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-[#0A0F2E] text-lg mb-4 font-medium">{insight.insight}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-[#6B7280]">Financial Impact</div>
                        <div className={`text-2xl font-bold ${insight.quantifiedValue > 0 ? 'text-[#2B8A6E]' : 'text-red-600'}`} style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                          {insight.quantifiedValue > 0 ? '+' : ''}{formatCurrency(insight.quantifiedValue)}
                        </div>
                        <div className="text-sm text-[#6B7280]">Risk Level: {insight.riskLevel}%</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-[#0A0F2E] mb-2">Data Sources</h4>
                        <div className="space-y-1">
                          {insight.sources.map((source, index) => (
                            <div key={index} className="text-sm text-[#6B7280] flex items-center gap-2">
                              <CheckCircle className="w-3 h-3 text-[#2B8A6E]" />
                              {source}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-[#0A0F2E] mb-2">Recommended Actions</h4>
                        <div className="space-y-2">
                          {insight.recommendations.slice(0, 2).map((rec, index) => (
                            <div key={index} className="p-2 bg-[#F8F7F4] rounded border border-[#E8E4DC]">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-[#0A0F2E] font-medium">{rec.action}</span>
                                <span className="text-xs text-[#2B8A6E] font-bold">{rec.estimatedROI}% ROI</span>
                              </div>
                              <div className="text-xs text-[#6B7280]">Timeline: {rec.timeToImplement}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Industry Benchmarks */}
          <TabsContent value="benchmarks" className="space-y-6">
            <div className="space-y-6">
              {industryBenchmarks.map((benchmark, index) => (
                <Card key={index} className="bg-white border-[#E8E4DC]">
                  <CardHeader>
                    <CardTitle className="text-[#0A0F2E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{benchmark.metric}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="text-sm text-[#6B7280] mb-1">Our Performance</div>
                        <div className="text-2xl font-bold text-[#C9A84C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                          {benchmark.metric.includes('Cost') || benchmark.metric.includes('Revenue') ? 
                            formatCurrency(benchmark.ourPerformance) : benchmark.ourPerformance.toLocaleString()}
                        </div>
                        <div className="text-xs text-[#2B8A6E] font-bold">
                          {benchmark.percentileRank}th percentile
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm text-[#6B7280] mb-1">Industry Average</div>
                        <div className="text-2xl font-bold text-[#0A0F2E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                          {benchmark.metric.includes('Cost') || benchmark.metric.includes('Revenue') ? 
                            formatCurrency(benchmark.industryAverage) : benchmark.industryAverage.toLocaleString()}
                        </div>
                        <div className={`text-xs ${benchmark.competitiveGap > 0 ? 'text-[#2B8A6E]' : 'text-red-400'}`}>
                          {benchmark.competitiveGap > 0 ? '+' : ''}{formatCurrency(benchmark.competitiveGap)} vs us
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm text-[#6B7280] mb-1">Top Quartile</div>
                        <div className="text-2xl font-bold text-[#C9A84C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                          {benchmark.metric.includes('Cost') || benchmark.metric.includes('Revenue') ? 
                            formatCurrency(benchmark.topQuartile) : benchmark.topQuartile.toLocaleString()}
                        </div>
                        <div className="text-xs text-[#C9A84C]">
                          Target performance
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm text-[#6B7280] mb-1">Improvement Potential</div>
                        <div className="text-2xl font-bold text-[#2B8A6E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                          {benchmark.metric.includes('Cost') || benchmark.metric.includes('Revenue') ? 
                            formatCurrency(benchmark.improvementPotential) : benchmark.improvementPotential.toLocaleString()}
                        </div>
                        <div className="text-xs text-[#0A0F2E]">
                          To reach top quartile
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Scenario Analysis */}
          <TabsContent value="scenarios" className="space-y-6">
            <Card className="bg-white border-[#E8E4DC]">
              <CardHeader>
                <CardTitle className="text-[#0A0F2E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Monte Carlo Business Scenarios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-[#6B7280] py-12">
                  <BarChart3 className="h-16 w-16 mx-auto mb-4 text-[#C9A84C]" />
                  <p className="text-[#0A0F2E] font-medium">Advanced Monte Carlo simulations and sensitivity analysis</p>
                  <p className="text-sm">10,000+ scenario iterations with probability distributions</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}