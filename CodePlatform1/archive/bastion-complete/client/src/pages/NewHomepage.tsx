import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import VeridiusPageLayout from '@/components/layout/VeridiusPageLayout';
import { Link } from 'wouter';
import { 
  Brain, 
  BarChart3, 
  Users, 
  Shield, 
  Zap, 
  TrendingUp,
  Target,
  AlertTriangle,
  Activity,
  ArrowRight,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  Cpu,
  Network,
  BarChart,
  PieChart,
  Lightbulb,
  Globe,
  Layers,
  Settings,
  Building2,
  Home,
  Rocket,
  MapPin,
  Briefcase,
  Database,
  Crown
} from 'lucide-react';

interface RealTimeMetric {
  name: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  color: string;
  bgGradient: string;
}

interface AIModule {
  id: string;
  name: string;
  icon: JSX.Element;
  status: 'operational' | 'processing' | 'standby';
  lastUpdate: string;
  performance: number;
  description: string;
}

export default function ExecutiveCommandCenter() {
  const [realTimeMetrics, setRealTimeMetrics] = useState<RealTimeMetric[]>([]);
  const [aiModules, setAIModules] = useState<AIModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCrisisTemplate, setSelectedCrisisTemplate] = useState('');
  const [collaborationUsers, setCollaborationUsers] = useState(24);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Fetch real data from APIs
  const { data: organizations } = useQuery({ queryKey: ['/api/organizations'] });
  const { data: dashboardMetrics } = useQuery({ queryKey: ['/api/dashboard/metrics'] });
  const { data: activities } = useQuery({ queryKey: ['/api/activities/recent'] });
  const { data: crisisTemplates } = useQuery({ queryKey: ['/api/scenario-templates/crisis'] });

  useEffect(() => {
    // Simulate real-time enterprise metrics
    const updateMetrics = () => {
      setRealTimeMetrics([
        {
          name: "Global Agility Score",
          value: "87.6%",
          change: "+2.4%",
          trend: 'up',
          color: "text-emerald-400",
          bgGradient: "from-emerald-500/20 to-green-500/20"
        },
        {
          name: "Crisis Response Readiness",
          value: "94.8%",
          change: "+0.8%", 
          trend: 'up',
          color: "text-orange-400",
          bgGradient: "from-orange-500/20 to-red-500/20"
        },
        {
          name: "Strategic Intelligence",
          value: "91.2%",
          change: "+1.6%",
          trend: 'up',
          color: "text-blue-400",
          bgGradient: "from-blue-500/20 to-cyan-500/20"
        },
        {
          name: "Innovation Pipeline",
          value: "88.4%",
          change: "+3.2%",
          trend: 'up',
          color: "text-purple-400",
          bgGradient: "from-purple-500/20 to-indigo-500/20"
        }
      ]);

      setAIModules([
        {
          id: 'pulse',
          name: 'Pulse Intelligence',
          icon: <Activity className="w-6 h-6" />,
          status: 'operational',
          lastUpdate: '2.3s ago',
          performance: 96.8,
          description: 'Organizational health monitoring'
        },
        {
          id: 'flux',
          name: 'Flux Adaptations',
          icon: <Zap className="w-6 h-6" />,
          status: 'operational', 
          lastUpdate: '1.7s ago',
          performance: 94.2,
          description: 'Change management intelligence'
        },
        {
          id: 'prism',
          name: 'Prism Insights',
          icon: <Eye className="w-6 h-6" />,
          status: 'processing',
          lastUpdate: '0.9s ago',
          performance: 98.1,
          description: 'Strategic analysis engine'
        },
        {
          id: 'echo',
          name: 'Echo Cultural',
          icon: <Users className="w-6 h-6" />,
          status: 'operational',
          lastUpdate: '3.1s ago',
          performance: 92.7,
          description: 'Cultural intelligence analytics'
        },
        {
          id: 'nova',
          name: 'Nova Innovation',
          icon: <Rocket className="w-6 h-6" />,
          status: 'operational',
          lastUpdate: '1.2s ago',
          performance: 89.4,
          description: 'Innovation opportunity detection'
        }
      ]);
      setIsLoading(false);
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = () => {
    window.location.href = '/api/login';
  };

  const platformSections = [
    {
      icon: <Home className="w-8 h-8" />,
      title: "Core Platform",
      description: "Executive dashboard with AI-powered scenario execution and real-time organizational intelligence",
      href: "/comprehensive-homepage",
      color: "from-blue-500 to-cyan-500",
      badge: "PRIMARY",
      features: ["Executive Dashboard", "Scenario Builder", "AI Analytics"]
    },
    {
      icon: <Crown className="w-8 h-8" />,
      title: "Executive Command",
      description: "C-suite command center with board reporting, strategic oversight, and executive intelligence",
      href: "/executive-suite", 
      color: "from-purple-500 to-indigo-500",
      badge: "C-SUITE",
      features: ["Board Reports", "Executive KPIs", "Strategic Oversight"]
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI Intelligence Modules",
      description: "Five sophisticated AI modules providing organizational, strategic, and cultural intelligence",
      href: "/ai-intelligence",
      color: "from-green-500 to-emerald-500", 
      badge: "AI POWERED",
      features: ["Pulse Intelligence", "Prism Insights", "Echo Cultural"]
    },
    {
      icon: <Building2 className="w-8 h-8" />,
      title: "Enterprise Platform",
      description: "Integration hub, mobile command center, and enterprise-grade operational capabilities",
      href: "/enterprise-metrics",
      color: "from-orange-500 to-red-500",
      badge: "ENTERPRISE",
      features: ["Integration Hub", "Mobile Command", "API Management"]
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Strategic Scenarios",
      description: "Comprehensive templates for crisis response, change management, and strategic opportunities",
      href: "/comprehensive-scenarios",
      color: "from-red-500 to-pink-500", 
      badge: "15+ TEMPLATES",
      features: ["Crisis Response", "Change Management", "Innovation Pipeline"]
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Live AI Intelligence",
      description: "Real-time demonstration of strategic decision intelligence and organizational insights",
      href: "/ai-intelligence-demo",
      color: "from-yellow-500 to-orange-500",
      badge: "LIVE DEMO",
      features: ["Decision Intelligence", "Predictive Analytics", "Strategic Insights"]
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: "System Management", 
      description: "Advanced user management, system configuration, and platform administration tools",
      href: "/settings",
      color: "from-teal-500 to-blue-500",
      badge: "ADMIN",
      features: ["User Management", "System Config", "Security Controls"]
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Business Intelligence",
      description: "Comprehensive analytics, competitive analysis, and enterprise performance metrics",
      href: "/business-intelligence",
      color: "from-green-500 to-emerald-500",
      badge: "ANALYTICS", 
      features: ["Performance Metrics", "Competitive Analysis", "Trend Analysis"]
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: "Investor Relations",
      description: "Series B materials, investor updates, financial projections, and growth metrics",
      href: "/vc-presentations",
      color: "from-yellow-500 to-orange-500",
      badge: "INVESTMENT",
      features: ["Series B Materials", "Growth Metrics", "Financial Reports"]
    }
  ];

  if (isLoading) {
    return (
      <VeridiusPageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Initializing Veridius</h2>
            <p className="text-gray-400">Loading enterprise intelligence systems...</p>
          </div>
        </div>
      </VeridiusPageLayout>
    );
  }

  return (
    <VeridiusPageLayout>
      {/* Premium Enterprise Header */}
      <header className="relative z-20 border-b border-gray-700/30 bg-black/40 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 via-purple-500 to-emerald-400 rounded-xl flex items-center justify-center shadow-2xl">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-300 via-purple-400 to-emerald-300 bg-clip-text text-transparent">
                  Veridius
                </h1>
                <p className="text-sm text-gray-400 font-medium">Enterprise Agility Operating System</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex space-x-3">
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-3 py-1">
                  <CheckCircle className="w-3 h-3 mr-2" />
                  All Systems Operational
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-3 py-1">
                  <Activity className="w-3 h-3 mr-2" />
                  Live Intelligence Active
                </Badge>
              </div>
              <Button
                onClick={handleLogin}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold px-8 py-3 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
                data-testid="button-login-enterprise"
              >
                Access Enterprise Platform
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero Section with Real-Time Intelligence */}
        <section className="container mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-blue-300 via-purple-400 to-emerald-300 bg-clip-text text-transparent mb-6 leading-tight">
              Enterprise Intelligence
              <br />
              Operating System
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
              The world's most advanced organizational intelligence platform. Combining AI-powered insights 
              with immediate crisis response protocols for Fortune 1000 enterprises.
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-400">
              <div className="flex items-center">
                <Database className="w-4 h-4 mr-2 text-blue-400" />
                17,921+ Components
              </div>
              <div className="flex items-center">
                <Brain className="w-4 h-4 mr-2 text-purple-400" />
                5 AI Intelligence Modules
              </div>
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2 text-green-400" />
                Enterprise Security
              </div>
            </div>
          </div>

          {/* Real-Time Intelligence Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {realTimeMetrics.map((metric, index) => (
              <Card key={index} className="bg-black/40 border-gray-700/50 backdrop-blur-sm hover:bg-black/60 transition-all duration-500 group">
                <CardContent className="p-6">
                  <div className={`bg-gradient-to-r ${metric.bgGradient} rounded-xl p-5 mb-4 group-hover:scale-105 transition-transform duration-300`}>
                    <div className={`text-3xl font-bold ${metric.color} mb-1`}>
                      {metric.value}
                    </div>
                    <div className="flex items-center text-xs">
                      <TrendingUp className={`w-3 h-3 mr-1 ${metric.trend === 'up' ? 'text-green-400' : 'text-red-400'}`} />
                      <span className={metric.trend === 'up' ? 'text-green-400' : 'text-red-400'}>
                        {metric.change}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-bold text-white mb-2 text-lg">{metric.name}</h3>
                  <p className="text-sm text-gray-400">Real-time organizational intelligence</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* AI Modules Status */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">AI Intelligence Modules</h2>
              <p className="text-gray-300 text-lg">Advanced organizational intelligence powered by Fortune 1000-grade algorithms</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {aiModules.map((module) => (
                <Card key={module.id} className="bg-black/40 border-gray-700/50 backdrop-blur-sm hover:border-gray-600/50 transition-all duration-300 group">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                      module.status === 'operational' ? 'bg-green-500/20 text-green-400' :
                      module.status === 'processing' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-gray-500/20 text-gray-400'
                    } group-hover:scale-110 transition-transform duration-300`}>
                      {module.icon}
                    </div>
                    <h3 className="font-bold text-white mb-2">{module.name}</h3>
                    <p className="text-xs text-gray-400 mb-3">{module.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Performance</span>
                        <span className="text-green-400">{module.performance}%</span>
                      </div>
                      <Progress value={module.performance} className="h-2" />
                    </div>
                    
                    <div className="mt-4 text-xs text-gray-500">
                      Updated {module.lastUpdate}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Platform Command Centers */}
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-4">Platform Command Centers</h2>
              <p className="text-gray-300 text-lg max-w-3xl mx-auto">
                Access specialized intelligence modules and operational command centers designed for enterprise-grade organizational intelligence
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {platformSections.map((section) => (
                <Link key={section.title} to={section.href}>
                  <Card className="group bg-black/30 border-gray-700/30 hover:border-gray-500/50 transition-all duration-500 cursor-pointer h-full backdrop-blur-sm hover:bg-black/50">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-4 rounded-xl bg-gradient-to-br ${section.color} text-white shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                          {section.icon}
                        </div>
                        <Badge variant="secondary" className="bg-gray-800/50 text-gray-300 border-gray-600/50 text-xs font-bold px-2 py-1">
                          {section.badge}
                        </Badge>
                      </div>
                      
                      <CardTitle className="text-xl text-white group-hover:text-blue-400 transition-colors duration-300 mb-2">
                        {section.title}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <p className="text-gray-300 leading-relaxed">
                        {section.description}
                      </p>
                      
                      <div className="space-y-2">
                        <p className="text-xs text-gray-500 font-medium">KEY FEATURES:</p>
                        <div className="flex flex-wrap gap-2">
                          {section.features.map((feature) => (
                            <Badge key={feature} variant="outline" className="text-xs text-gray-400 border-gray-600/50">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-700/30">
                        <div className="flex items-center text-blue-400 text-sm font-medium group-hover:text-blue-300 transition-colors">
                          <span>Access Platform</span>
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Ready
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Enterprise Intelligence Advantage */}
          <section className="mt-20">
            <Card className="bg-black/20 border-gray-700/30 backdrop-blur-xl">
              <CardContent className="p-12">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-white mb-6">Enterprise Intelligence Advantage</h2>
                  <p className="text-xl text-gray-300 max-w-4xl mx-auto">
                    Unprecedented organizational intelligence with AI-powered decision support, 
                    immediate crisis response activation, and comprehensive strategic oversight
                  </p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
                  <div className="text-center group">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                      <Brain className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">AI-Powered Intelligence</h3>
                    <p className="text-gray-300 leading-relaxed">
                      Advanced decision support with 85-92% strategic accuracy, predictive analytics, 
                      and real-time organizational health monitoring
                    </p>
                    <div className="mt-4 flex items-center justify-center space-x-4 text-sm">
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                        <Cpu className="w-3 h-3 mr-1" />
                        5 AI Modules
                      </Badge>
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                        <Network className="w-3 h-3 mr-1" />
                        Real-time
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="text-center group">
                    <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                      <AlertTriangle className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Crisis Response Excellence</h3>
                    <p className="text-gray-300 leading-relaxed">
                      Immediate crisis activation with comprehensive response protocols, stakeholder coordination, 
                      and 24/7 operational readiness
                    </p>
                    <div className="mt-4 flex items-center justify-center space-x-4 text-sm">
                      <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                        <Shield className="w-3 h-3 mr-1" />
                        15+ Templates
                      </Badge>
                      <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                        <Clock className="w-3 h-3 mr-1" />
                        Instant Response
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="text-center group">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                      <TrendingUp className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Enterprise Scale</h3>
                    <p className="text-gray-300 leading-relaxed">
                      Production-grade platform with sophisticated architecture, comprehensive audit logging, 
                      and enterprise-ready security protocols
                    </p>
                    <div className="mt-4 flex items-center justify-center space-x-4 text-sm">
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                        <BarChart className="w-3 h-3 mr-1" />
                        Fortune 1000
                      </Badge>
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                        <PieChart className="w-3 h-3 mr-1" />
                        Production Ready
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-700/30 pt-8">
                  <div className="flex items-center justify-center space-x-12">
                    <div className="flex items-center text-green-400">
                      <CheckCircle className="w-5 h-5 mr-3" />
                      <span className="font-semibold">Enterprise Security Verified</span>
                    </div>
                    <div className="flex items-center text-blue-400">
                      <Database className="w-5 h-5 mr-3" />
                      <span className="font-semibold">AI Intelligence Modules Active</span>
                    </div>
                    <div className="flex items-center text-orange-400">
                      <Shield className="w-5 h-5 mr-3" />
                      <span className="font-semibold">Crisis Response Systems Ready</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Live System Status */}
          <section className="mb-16">
            <Card className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-green-700/30 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Platform Status: Fully Operational
                    </h3>
                    <p className="text-green-300 text-lg">
                      All enterprise systems, AI modules, and crisis response protocols are active and ready
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse" />
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-sm px-4 py-2">
                      <Activity className="w-4 h-4 mr-2" />
                      Live System
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </section>
      </main>
    </VeridiusPageLayout>
  );
}