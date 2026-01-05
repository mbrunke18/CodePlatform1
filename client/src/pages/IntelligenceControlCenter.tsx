import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import StandardNav from '@/components/layout/StandardNav';
import Footer from '@/components/layout/Footer';
import { updatePageMetadata } from '@/lib/seo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
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
      title: "Intelligence Control Center - M Strategic Execution OS",
      description: "Monitor 92+ data points across 16 signal categories. AI-powered pattern detection, trigger management, and strategic intelligence.",
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
      color: 'purple',
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
      color: 'blue',
      status: 'active',
      features: ['16 Signal Categories', '92+ Data Points', 'Custom Triggers', 'Alert Management'],
      badge: '92 DATA POINTS'
    },
    {
      id: 'foresight-radar',
      title: 'Foresight Radar',
      description: 'Visual intelligence scanning and pattern detection',
      path: '/foresight-radar',
      icon: Eye,
      color: 'cyan',
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
      color: 'amber',
      status: 'active',
      features: ['Trigger Templates', 'Condition Builder', 'Playbook Mapping'],
      badge: 'CONFIGURE'
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; border: string; text: string; badge: string }> = {
      purple: { bg: 'from-purple-950/40 to-slate-950/40', border: 'border-purple-500/30 hover:border-purple-500/50', text: 'text-purple-400', badge: 'bg-purple-500/10 text-purple-300 border-purple-500/30' },
      blue: { bg: 'from-blue-950/40 to-slate-950/40', border: 'border-blue-500/30 hover:border-blue-500/50', text: 'text-blue-400', badge: 'bg-blue-500/10 text-blue-300 border-blue-500/30' },
      cyan: { bg: 'from-cyan-950/40 to-slate-950/40', border: 'border-cyan-500/30 hover:border-cyan-500/50', text: 'text-cyan-400', badge: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30' },
      amber: { bg: 'from-amber-950/40 to-slate-950/40', border: 'border-amber-500/30 hover:border-amber-500/50', text: 'text-amber-400', badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30' },
      green: { bg: 'from-green-950/40 to-slate-950/40', border: 'border-green-500/30 hover:border-green-500/50', text: 'text-green-400', badge: 'bg-green-500/10 text-green-300 border-green-500/30' },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-slate-950" data-testid="intelligence-control-center">
      <StandardNav />
      
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                <Radio className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white" data-testid="page-title">Intelligence Control Center</h1>
            </div>
            <p className="text-slate-400">Real-time strategic intelligence and AI-powered pattern detection</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-green-500/10 text-green-300 border-green-500/30 px-3 py-1">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
              All Systems Online
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4" data-testid="grid-quick-stats">
          <Card className="bg-slate-900/50 border-slate-800" data-testid="stat-data-points">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Data Points Monitored</p>
                  <p className="text-2xl font-bold text-white" data-testid="value-data-points">92+</p>
                </div>
                <Activity className="h-8 w-8 text-blue-400 opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800" data-testid="stat-signal-categories">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Signal Categories</p>
                  <p className="text-2xl font-bold text-white" data-testid="value-signal-categories">16</p>
                </div>
                <Layers className="h-8 w-8 text-purple-400 opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800" data-testid="stat-weak-signals">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Weak Signals</p>
                  <p className="text-2xl font-bold text-white" data-testid="value-weak-signals">{dynamicStatus?.weakSignalsDetected ?? 0}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-amber-400 opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800" data-testid="stat-active-patterns">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Active Patterns</p>
                  <p className="text-2xl font-bold text-white">{dynamicStatus?.oraclePatternsActive ?? 0}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-400 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Intelligence Modules Grid */}
        <div className="space-y-4" data-testid="section-modules">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-400" />
            Intelligence Modules
          </h2>
          <div className="grid md:grid-cols-2 gap-4" data-testid="grid-modules">
            {intelligenceModules.map(module => {
              const colors = getColorClasses(module.color);
              const Icon = module.icon;
              return (
                <Link key={module.id} href={module.path} data-testid={`link-module-${module.id}`}>
                  <Card className={`${colors.border} bg-gradient-to-br ${colors.bg} transition-all cursor-pointer h-full`} data-testid={`card-module-${module.id}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 ${colors.text.replace('text-', 'bg-')}/10 rounded-lg`}>
                            <Icon className={`h-6 w-6 ${colors.text}`} />
                          </div>
                          <div>
                            <CardTitle className="text-lg text-white">{module.title}</CardTitle>
                            <CardDescription className="text-slate-400 text-sm">
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
                            <span key={idx} className="text-xs text-slate-500 bg-slate-800/50 px-2 py-1 rounded">
                              {feature}
                            </span>
                          ))}
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-500" />
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
            <Card className="bg-slate-900/50 border-slate-700 hover:border-purple-500/50 transition-all cursor-pointer" data-testid="card-ai-copilots">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Brain className="h-5 w-5 text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">Launch AI Co-Pilots</p>
                  <p className="text-sm text-slate-400">Strategic decision support</p>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-500" />
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/signal-intelligence" data-testid="link-configure-signals">
            <Card className="bg-slate-900/50 border-slate-700 hover:border-blue-500/50 transition-all cursor-pointer" data-testid="card-configure-signals">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Radio className="h-5 w-5 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">Configure Signals</p>
                  <p className="text-sm text-slate-400">Manage data sources</p>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-500" />
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/triggers-management" data-testid="link-manage-triggers">
            <Card className="bg-slate-900/50 border-slate-700 hover:border-amber-500/50 transition-all cursor-pointer" data-testid="card-manage-triggers">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <Bell className="h-5 w-5 text-amber-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">Set Up Triggers</p>
                  <p className="text-sm text-slate-400">Automate responses</p>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-500" />
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
