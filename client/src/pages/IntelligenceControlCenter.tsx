import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import StandardNav from '@/components/layout/StandardNav';
import Footer from '@/components/layout/Footer';
import { updatePageMetadata } from '@/lib/seo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useQuery } from '@tanstack/react-query';
import { 
  Radio, 
  Brain, 
  Activity, 
  Zap, 
  Target, 
  Users, 
  Sparkles,
  Bell,
  Settings,
  BarChart3,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Eye,
  Layers,
  ChevronRight,
  Clock,
  ArrowRight
} from 'lucide-react';

export default function IntelligenceControlCenter() {
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    updatePageMetadata({
      title: "Intelligence Control Center - Execution OS Strategic Execution OS",
      description: "Monitor 216+ data points across 16 signal categories. AI-powered pattern detection, trigger management, and strategic intelligence.",
      ogTitle: "M Intelligence Control Center",
      ogDescription: "Real-time strategic intelligence with AI-powered pattern detection and 12-minute response coordination.",
    });
  }, []);

  const { data: dynamicStatus } = useQuery<{
    readinessScore: number;
    activeScenarios: number;
    weakSignalsDetected: number;
    oraclePatternsActive: number;
  }>({
    queryKey: ['/api/dynamic-strategy/status'],
  });

  const intelligenceModules = [
    {
      id: 'ai-hub',
      title: 'AI Intelligence Hub',
      description: '5 AI co-pilots for strategic decision-making',
      path: '/ai',
      icon: Brain,
      color: 'gold',
      status: 'active',
      features: ['Pulse Intelligence', 'Flux Adaptations', 'Prism Insights', 'Echo Analytics', 'Nova Innovations'],
      badge: '5 MODULES'
    },
    {
      id: 'signal-hub',
      title: 'Signal Intelligence',
      description: 'Configure triggers and monitor data points',
      path: '/signal-intelligence',
      icon: Radio,
      color: 'navy',
      status: 'active',
      features: ['16 Signal Categories', '216+ Data Points', 'Custom Triggers', 'Alert Management'],
      badge: '216+ DATA POINTS'
    },
    {
      id: 'foresight-radar',
      title: 'Foresight Radar',
      description: 'Visual intelligence scanning and pattern detection',
      path: '/foresight-radar',
      icon: Eye,
      color: 'teal',
      status: 'active',
      features: ['Radar Visualization', 'Trend Detection', 'Early Warning System'],
      badge: 'REAL-TIME'
    },
    {
      id: 'triggers',
      title: 'Trigger Management',
      description: 'Create and manage automated triggers',
      path: '/triggers-management',
      icon: Bell,
      color: 'gold',
      status: 'active',
      features: ['Trigger Templates', 'Condition Builder', 'Playbook Mapping'],
      badge: 'CONFIGURE'
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; border: string; text: string; badge: string }> = {
      gold: { bg: ' ', border: 'border-[#C9A84C]/20 hover:border-[#C9A84C]/40', text: 'text-[#C9A84C]', badge: 'bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/20' },
      navy: { bg: ' ', border: 'border-[#0A0F2E]/10 hover:border-[#0A0F2E]/30', text: 'text-[#0A0F2E]', badge: 'bg-[#0A0F2E]/10 text-[#0A0F2E] border-[#0A0F2E]/20' },
      teal: { bg: ' ', border: 'border-[#2B8A6E]/20 hover:border-[#2B8A6E]/40', text: 'text-[#2B8A6E]', badge: 'bg-[#2B8A6E]/10 text-[#2B8A6E] border-[#2B8A6E]/20' },
    };
    return colors[color] || colors.navy;
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4]" data-testid="intelligence-control-center">
      <StandardNav />
      
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#0A0F2E]/10 rounded-lg">
                <Radio className="h-5 w-5 text-[#C9A84C]" />
              </div>
              <h1 className="text-2xl font-bold text-[#0A0F2E]" style={{ fontFamily: "'Cormorant Garamond', serif" }} data-testid="page-title">Intelligence Control Center</h1>
            </div>
            <p className="text-[#6B7280]">Real-time strategic intelligence and AI-powered pattern detection</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-[#2B8A6E]/10 text-[#2B8A6E] border-[#2B8A6E]/30 px-3 py-1">
              <div className="w-2 h-2 bg-[#2B8A6E] rounded-full mr-2 animate-pulse" />
              All Systems Online
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4" data-testid="grid-quick-stats">
          <Card className="bg-white border-[#E8E4DC]" data-testid="stat-data-points">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#6B7280]">Data Points Monitored</p>
                  <p className="text-2xl font-bold text-[#0A0F2E]" style={{ fontFamily: "'Cormorant Garamond', serif" }} data-testid="value-data-points">92+</p>
                </div>
                <div style={{ width: 40, height: 40, background: "#0A0F2E", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Activity className="h-5 w-5 text-[#C9A84C]" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-[#E8E4DC]" data-testid="stat-signal-categories">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#6B7280]">Signal Categories</p>
                  <p className="text-2xl font-bold text-[#0A0F2E]" style={{ fontFamily: "'Cormorant Garamond', serif" }} data-testid="value-signal-categories">16</p>
                </div>
                <div style={{ width: 40, height: 40, background: "#2B8A6E", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Layers className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-[#E8E4DC]" data-testid="stat-weak-signals">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#6B7280]">Weak Signals</p>
                  <p className="text-2xl font-bold text-[#C9A84C]" style={{ fontFamily: "'Cormorant Garamond', serif" }} data-testid="value-weak-signals">{dynamicStatus?.weakSignalsDetected ?? 0}</p>
                </div>
                <div style={{ width: 40, height: 40, background: "rgba(201,168,76,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <AlertCircle className="h-5 w-5 text-[#C9A84C]" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-[#E8E4DC]" data-testid="stat-active-patterns">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#6B7280]">Active Patterns</p>
                  <p className="text-2xl font-bold text-[#2B8A6E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{dynamicStatus?.oraclePatternsActive ?? 0}</p>
                </div>
                <div style={{ width: 40, height: 40, background: "#2B8A6E", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
              </div>
              <Progress value={75} className="h-1 mt-2 [&>div]:bg-[#C9A84C]" />
            </CardContent>
          </Card>
        </div>

        {/* Intelligence Modules Grid */}
        <div className="space-y-4" data-testid="section-modules">
          <h2 className="text-lg font-semibold text-[#0A0F2E] flex items-center gap-2">
            <Brain className="h-5 w-5 text-[#C9A84C]" />
            Intelligence Modules
          </h2>
          <div className="grid md:grid-cols-2 gap-4" data-testid="grid-modules">
            {intelligenceModules.map(module => {
              const colors = getColorClasses(module.color);
              const Icon = module.icon;
              return (
                <Link key={module.id} href={module.path} data-testid={`link-module-${module.id}`}>
                  <Card className={`${colors.border} bg-white transition-all cursor-pointer h-full`} data-testid={`card-module-${module.id}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div style={{
                            width: 44, height: 44, flexShrink: 0,
                            background: module.color === 'gold' ? 'rgba(201,168,76,0.12)' : module.color === 'teal' ? '#2B8A6E' : '#0A0F2E',
                            display: "flex", alignItems: "center", justifyContent: "center"
                          }}>
                            <Icon className={`h-6 w-6 ${module.color === 'gold' ? 'text-[#C9A84C]' : 'text-white'}`} />
                          </div>
                          <div>
                            <CardTitle className="text-lg text-[#0A0F2E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{module.title}</CardTitle>
                            <CardDescription className="text-[#6B7280] text-sm">
                              {module.description}
                            </CardDescription>
                          </div>
                        </div>
                        {module.badge && (
                          <Badge variant="outline" className={colors.badge}>
                            {module.badge}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {module.features.slice(0, 3).map((feature, idx) => (
                            <span key={idx} className="text-xs text-[#6B7280] bg-[#F8F7F4] border border-[#E8E4DC] px-2 py-1 rounded">
                              {feature}
                            </span>
                          ))}
                        </div>
                        <ChevronRight className="h-5 w-5 text-[#0A0F2E]" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 pt-4" data-testid="section-quick-actions">
          <Link href="/ai" data-testid="link-ai-copilots">
            <Card className="bg-white border-[#E8E4DC] hover:border-[#0A0F2E]/50 transition-all cursor-pointer" data-testid="card-ai-copilots">
              <CardContent className="p-4 flex items-center gap-4">
                <div style={{ width: 40, height: 40, background: "#0A0F2E", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Brain className="h-5 w-5 text-[#C9A84C]" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-[#0A0F2E]">Launch AI Co-Pilots</p>
                  <p className="text-sm text-[#6B7280]">Strategic decision support</p>
                </div>
                <ArrowRight className="h-4 w-4 text-[#0A0F2E]" />
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/signal-intelligence" data-testid="link-configure-signals">
            <Card className="bg-white border-[#E8E4DC] hover:border-[#0A0F2E]/50 transition-all cursor-pointer" data-testid="card-configure-signals">
              <CardContent className="p-4 flex items-center gap-4">
                <div style={{ width: 40, height: 40, background: "#2B8A6E", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Radio className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-[#0A0F2E]">Configure Signals</p>
                  <p className="text-sm text-[#6B7280]">Manage data sources</p>
                </div>
                <ArrowRight className="h-4 w-4 text-[#0A0F2E]" />
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/triggers-management" data-testid="link-manage-triggers">
            <Card className="bg-white border-[#E8E4DC] hover:border-[#C9A84C]/50 transition-all cursor-pointer" data-testid="card-manage-triggers">
              <CardContent className="p-4 flex items-center gap-4">
                <div style={{ width: 40, height: 40, background: "rgba(201,168,76,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Bell className="h-5 w-5 text-[#C9A84C]" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-[#0A0F2E]">Set Up Triggers</p>
                  <p className="text-sm text-[#6B7280]">Automate responses</p>
                </div>
                <ArrowRight className="h-4 w-4 text-[#0A0F2E]" />
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
