import { useState } from 'react';
import { Link } from 'wouter';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Rocket,
  Users, 
  Building2,
  Briefcase,
  ChevronRight,
  ArrowRight,
  Clock,
  Star,
  Zap,
  Eye,
  Target,
  Shield,
  Globe
} from 'lucide-react';

const demos = [
  {
    id: "pilot-demo",
    title: "Pilot Demo",
    description: "Experience a full trigger-to-execution cycle with real-time coordination",
    path: "/pilot-demo",
    duration: "5 min",
    category: "interactive",
    audience: "prospects",
    icon: Rocket,
    color: "text-poise-teal",
    bgColor: "bg-poise-teal/10",
    featured: true,
    tags: ["Full Experience", "Live Execution"],
    journeyPhase: "Discovery"
  },
  {
    id: "executive-simulation",
    title: "Executive Simulation",
    description: "Step into the CEO's shoes during a strategic crisis scenario",
    path: "/executive-simulation",
    duration: "10 min",
    category: "interactive",
    audience: "executives",
    icon: Briefcase,
    color: "text-poise-gold",
    bgColor: "bg-poise-gold/10",
    featured: true,
    tags: ["Decision Making", "Crisis Response"],
    journeyPhase: "EXECUTE"
  },
  {
    id: "sandbox",
    title: "Interactive Sandbox",
    description: "Explore Execution OS features at your own pace in a guided environment",
    path: "/sandbox-demo",
    duration: "Self-paced",
    category: "interactive",
    audience: "prospects",
    icon: Zap,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    tags: ["Self-Guided", "Exploration"],
    journeyPhase: "Onboarding"
  },
  {
    id: "investor-demo",
    title: "Investor Demo",
    description: "Comprehensive overview of Execution OS value proposition and market opportunity",
    path: "/investor-demo",
    duration: "15 min",
    category: "presentation",
    audience: "investors",
    icon: Building2,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    tags: ["Market Size", "ROI Metrics"],
    journeyPhase: "Discovery"
  },
  {
    id: "product-tour",
    title: "Product Tour",
    description: "Guided walkthrough of all Execution OS modules and capabilities",
    path: "/product-tour",
    duration: "8 min",
    category: "presentation",
    audience: "prospects",
    icon: Eye,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    tags: ["Feature Overview", "Modules"],
    journeyPhase: "IDENTIFY"
  },
  {
    id: "live-demo",
    title: "One-Click Live Demo",
    description: "Instantly launch a pre-configured demo environment",
    path: "/live-demo",
    duration: "3 min",
    category: "interactive",
    audience: "prospects",
    icon: Play,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    tags: ["Quick Start", "No Setup"],
    journeyPhase: "Discovery"
  }
];

const industryDemos = [
  {
    id: "luxury-crisis",
    title: "Luxury Brand Crisis",
    description: "Hermès-style response to counterfeit scandal",
    path: "/industry-demos",
    industry: "Luxury & Retail",
    icon: Star,
    color: "text-amber-500"
  },
  {
    id: "financial-ransomware",
    title: "Financial Ransomware",
    description: "Coordinated response to cyber attack on banking systems",
    path: "/industry-demos",
    industry: "Financial Services",
    icon: Shield,
    color: "text-red-500"
  },
  {
    id: "market-entry",
    title: "Market Entry Blitz",
    description: "LVMH-style rapid market expansion strategy",
    path: "/industry-demos",
    industry: "Consumer Goods",
    icon: Globe,
    color: "text-blue-500"
  },
  {
    id: "pharma-recall",
    title: "Pharmaceutical Recall",
    description: "FDA compliance and public safety response",
    path: "/industry-demos",
    industry: "Healthcare",
    icon: Target,
    color: "text-purple-500"
  }
];

export default function DemoGallery() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredDemos = activeTab === "all" 
    ? demos 
    : demos.filter(d => d.category === activeTab || d.audience === activeTab);

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50/30 dark:from-poise-navy dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-poise-teal/20 text-poise-teal border-poise-teal/30">
              Experience Execution OS
            </Badge>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Demo Gallery
            </h1>
            <p className="text-xl text-gray-600 dark:text-slate-300 max-w-2xl mx-auto mb-6">
              Choose your experience: interactive simulations, guided tours, or industry-specific scenarios
            </p>
          </div>

          {/* North Star Journey Connection */}
          <Card className="mb-10 bg-gradient-to-r from-poise-teal/10 to-cyan-500/10 border-poise-teal/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-poise-teal/20">
                    <Rocket className="h-6 w-6 text-poise-teal" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Your Journey Starts Here</h3>
                    <p className="text-sm text-gray-600 dark:text-slate-300">
                      These demos map to Phase 1 of your Execution OS North Star™ journey — Discovery to 12-minute execution
                    </p>
                  </div>
                </div>
                <Link href="/north-star">
                  <Button variant="outline" className="border-poise-teal text-poise-teal hover:bg-poise-teal hover:text-white">
                    View Full Journey
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Featured Demos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {demos.filter(d => d.featured).map((demo) => (
              <Link key={demo.id} href={demo.path}>
                <Card className="h-full hover:shadow-xl transition-all cursor-pointer group border-2 border-transparent hover:border-poise-teal/50">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-6">
                      <div className={`p-4 rounded-2xl ${demo.bgColor}`}>
                        <demo.icon className={`h-8 w-8 ${demo.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <Badge variant="secondary" className="text-xs">Featured</Badge>
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {demo.duration}
                          </Badge>
                          {(demo as any).journeyPhase && (
                            <Badge className="text-xs bg-poise-teal/20 text-poise-teal border-poise-teal/30">
                              {(demo as any).journeyPhase}
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-poise-teal transition-colors mb-2">
                          {demo.title}
                        </h3>
                        <p className="text-gray-600 dark:text-slate-300 mb-4">
                          {demo.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {demo.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 mt-4 text-poise-teal opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-sm font-medium">Start Demo</span>
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Filter Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="bg-slate-100 dark:bg-slate-800">
              <TabsTrigger value="all">All Demos</TabsTrigger>
              <TabsTrigger value="interactive">Interactive</TabsTrigger>
              <TabsTrigger value="presentation">Presentations</TabsTrigger>
              <TabsTrigger value="executives">For Executives</TabsTrigger>
              <TabsTrigger value="investors">For Investors</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* All Demos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {filteredDemos.filter(d => !d.featured).map((demo) => (
              <Link key={demo.id} href={demo.path}>
                <Card className="h-full hover:shadow-lg transition-all cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${demo.bgColor}`}>
                        <demo.icon className={`h-6 w-6 ${demo.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-poise-teal transition-colors">
                            {demo.title}
                          </h3>
                          <ChevronRight className="h-4 w-4 text-slate-600 dark:text-slate-200 group-hover:text-poise-teal transition-colors" />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-slate-300 mt-1 mb-3">
                          {demo.description}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {demo.duration}
                          </Badge>
                          {(demo as any).journeyPhase && (
                            <Badge className="text-xs bg-poise-teal/20 text-poise-teal border-poise-teal/30">
                              {(demo as any).journeyPhase}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Industry-Specific Demos */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Industry Scenarios</h2>
            <p className="text-gray-600 dark:text-slate-300 mb-6">
              See Execution OS in action with scenarios tailored to your industry
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {industryDemos.map((demo) => (
                <Link key={demo.id} href={demo.path}>
                  <Card className="h-full hover:shadow-lg transition-all cursor-pointer group">
                    <CardContent className="p-6">
                      <demo.icon className={`h-8 w-8 ${demo.color} mb-4`} />
                      <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-poise-teal transition-colors mb-1">
                        {demo.title}
                      </h3>
                      <p className="text-xs text-gray-600 mb-2">{demo.industry}</p>
                      <p className="text-sm text-gray-600 dark:text-slate-300">
                        {demo.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* CTA - Unified Conversion Funnel: Try Demo + Start Pilot */}
          <Card className="bg-white border border-gray-200 border-0">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Strategic Execution?</h3>
              <p className="text-gray-600 mb-6 max-w-xl mx-auto">
                Join Fortune 1000 companies achieving 12-minute coordinated response with Execution OS
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <Link href="/pilot-demo">
                  <Button size="lg" className="bg-poise-teal hover:bg-cyan-500 text-gray-900 font-semibold">
                    <Play className="h-4 w-4 mr-2" />
                    Try Interactive Demo
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" className="bg-poise-gold hover:bg-amber-500 text-poise-navy font-semibold">
                    Start Pilot Program
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                Q1 2026 Founding Partner Program • 90-day validation • $75K (100% credited to Year 1)
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
