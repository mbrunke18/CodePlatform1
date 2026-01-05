import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Shield, 
  Zap,
  Users,
  Smartphone,
  Briefcase,
  Target,
  GitBranch,
  Layers,
  Globe,
  Leaf,
  AlertTriangle,
  GitMerge,
  Network,
  ChevronRight,
  Sparkles,
  Rocket,
  DollarSign,
  Building2
} from 'lucide-react';
import { updatePageMetadata } from '@/lib/seo';
import StandardNav from '@/components/layout/StandardNav';
import OnboardingTrigger from '@/components/onboarding/OnboardingTrigger';

const iconMap: Record<string, any> = {
  Users,
  Smartphone,
  Briefcase,
  Target,
  GitBranch,
  Layers,
  Shield,
  Globe,
  Leaf,
  AlertTriangle,
  GitMerge,
  Network,
  Rocket,
  DollarSign,
  Building2,
  TrendingUp
};

const domainColors: Record<string, any> = {
  'Market Dynamics': {
    border: 'border-green-200 dark:border-green-800',
    bg: 'bg-green-50 dark:bg-green-950/10',
    hover: 'hover:border-green-500 dark:hover:border-green-500',
    badge: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-400',
    icon: 'text-green-600'
  },
  'Financial Strategy': {
    border: 'border-emerald-200 dark:border-emerald-800',
    bg: 'bg-emerald-50 dark:bg-emerald-950/10',
    hover: 'hover:border-emerald-500 dark:hover:border-emerald-500',
    badge: 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-400',
    icon: 'text-emerald-600'
  },
  'Operational Excellence': {
    border: 'border-blue-200 dark:border-blue-800',
    bg: 'bg-blue-50 dark:bg-blue-950/10',
    hover: 'hover:border-blue-500 dark:hover:border-blue-500',
    badge: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-400',
    icon: 'text-blue-600'
  },
  'Technology & Innovation': {
    border: 'border-purple-200 dark:border-purple-800',
    bg: 'bg-purple-50 dark:bg-purple-950/10',
    hover: 'hover:border-purple-500 dark:hover:border-purple-500',
    badge: 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-400',
    icon: 'text-purple-600'
  },
  'Talent & Leadership': {
    border: 'border-amber-200 dark:border-amber-800',
    bg: 'bg-amber-50 dark:bg-amber-950/10',
    hover: 'hover:border-amber-500 dark:hover:border-amber-500',
    badge: 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-400',
    icon: 'text-amber-600'
  },
  'Brand & Reputation': {
    border: 'border-pink-200 dark:border-pink-800',
    bg: 'bg-pink-50 dark:bg-pink-950/10',
    hover: 'hover:border-pink-500 dark:hover:border-pink-500',
    badge: 'bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-400',
    icon: 'text-pink-600'
  },
  'Regulatory & Compliance': {
    border: 'border-cyan-200 dark:border-cyan-800',
    bg: 'bg-cyan-50 dark:bg-cyan-950/10',
    hover: 'hover:border-cyan-500 dark:hover:border-cyan-500',
    badge: 'bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-400',
    icon: 'text-cyan-600'
  },
  'Market Opportunities': {
    border: 'border-indigo-200 dark:border-indigo-800',
    bg: 'bg-indigo-50 dark:bg-indigo-950/10',
    hover: 'hover:border-indigo-500 dark:hover:border-indigo-500',
    badge: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-400',
    icon: 'text-indigo-600'
  }
};

const defaultColors = {
  border: 'border-slate-200 dark:border-slate-800',
  bg: 'bg-slate-50 dark:bg-slate-950/10',
  hover: 'hover:border-slate-500 dark:hover:border-slate-500',
  badge: 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-400',
  icon: 'text-slate-600'
};

export default function ScenarioGallery() {
  const [, setLocation] = useLocation();
  const [selectedDomain, setSelectedDomain] = useState<string>('all');

  const { data: playbooks, isLoading } = useQuery<any[]>({
    queryKey: ['/api/playbook-library/featured'],
  });

  useEffect(() => {
    updatePageMetadata({
      title: "Strategic Playbook Library | M Executive Decision Platform",
      description: "Explore M's 166 strategic playbooks across 9 domains: digital transformation, M&A integration, crisis management, new product launches, global expansion, AI governance, and more. See the human-AI partnership in action.",
      ogTitle: "Experience M Strategic Playbook Library",
      ogDescription: "From culture transformation to new product launches - see how executives prepare, AI monitors, and teams execute across 166 strategic playbooks.",
    });
  }, []);

  const playbookList = playbooks || [];
  
  const filteredPlaybooks = selectedDomain === 'all' 
    ? playbookList
    : playbookList.filter((p: any) => p.domain?.name === selectedDomain);

  const domainCounts = playbookList.reduce((acc: Record<string, number>, p: any) => {
    const domainName = p.domain?.name || 'Unknown';
    acc[domainName] = (acc[domainName] || 0) + 1;
    return acc;
  }, {});

  const uniqueDomains = Array.from(new Set(playbookList.map((p: any) => p.domain?.name).filter(Boolean)));

  return (
    <div className="page-background min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <StandardNav />

      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Badge className="bg-cyan-600 text-white border-0 text-sm px-4 py-1.5" data-testid="badge-scenarios">
              <Sparkles className="w-4 h-4 inline mr-2" />
              166 Strategic Playbooks + Unlimited Custom Scenarios
            </Badge>
            <OnboardingTrigger pageId="scenario-gallery" autoStart={true} className="bg-white/10 border-white/30 text-white hover:bg-white/20" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight max-w-5xl mx-auto" data-testid="heading-hero">
            Experience How M Handles Real Business Situations
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-4xl mx-auto" data-testid="text-subtitle">
            <strong>166 battle-tested playbooks</strong> ready for immediate deployment. <strong>Unlimited custom scenarios</strong> via What-If Analyzer.
            See how your team prepares, AI monitors, and everyone executes with confidence.
          </p>

          <div className="flex items-center justify-center gap-8 text-blue-200">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span>Market Dynamics</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400" />
              <span>Operational Excellence</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-400" />
              <span>Technology & Innovation</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter & Playbooks */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="text-center py-16" data-testid="loading-playbooks">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">Loading featured playbooks...</p>
            </div>
          ) : (
            <>
              <Tabs value={selectedDomain} onValueChange={setSelectedDomain} className="w-full">
                <TabsList className="grid w-full max-w-4xl mx-auto mb-12" style={{ gridTemplateColumns: `repeat(${Math.min(uniqueDomains.length + 1, 5)}, minmax(0, 1fr))` }}>
                  <TabsTrigger value="all" data-testid="tab-all">All ({playbookList.length})</TabsTrigger>
                  {uniqueDomains.slice(0, 4).map((domain: string) => (
                    <TabsTrigger key={domain} value={domain} data-testid={`tab-${domain}`}>
                      {domain} ({domainCounts[domain] || 0})
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value={selectedDomain} className="mt-0">
                  <div className="grid md:grid-cols-3 gap-6">
                    {filteredPlaybooks.map((playbook: any) => {
                      const domainName = playbook.domain?.name || 'Unknown';
                      const colors = domainColors[domainName] || defaultColors;
                      const Icon = iconMap[playbook.icon] || Briefcase;
                      const playbookId = playbook.playbookNumber;

                      return (
                        <Card 
                          key={playbook.id}
                          className={`${colors.border} ${colors.bg} ${colors.hover} border-2 transition-all cursor-pointer group`}
                          onClick={() => setLocation(`/business-scenario/${playbookId}`)}
                          data-testid={`card-playbook-${playbookId}`}
                        >
                          <CardContent className="pt-8 pb-8">
                            <div className="flex items-start justify-between mb-4">
                              <Icon className={`h-12 w-12 ${colors.icon} group-hover:scale-110 transition-transform`} />
                              <Badge variant="outline" className={colors.badge}>
                                {domainName}
                              </Badge>
                            </div>

                            <div className="mb-2">
                              <Badge variant="secondary" className="text-xs">
                                Playbook #{playbookId}
                              </Badge>
                            </div>

                            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                              {playbook.name}
                            </h3>

                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">
                              {playbook.description}
                            </p>

                            <div className="mb-4 space-y-2">
                              <div className="text-xs text-slate-500 dark:text-slate-500 font-semibold uppercase">
                                Trigger Criteria
                              </div>
                              <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2">
                                {playbook.triggerCriteria}
                              </p>
                            </div>

                            {playbook.estimatedTimeSaved && (
                              <div className="mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                                <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                                  Est. {playbook.estimatedTimeSaved} saved
                                </div>
                              </div>
                            )}

                            <Button 
                              variant="ghost" 
                              className="w-full justify-between group-hover:bg-white/50 dark:group-hover:bg-slate-800/50"
                              data-testid={`button-explore-${playbookId}`}
                            >
                              <span>Experience This Playbook</span>
                              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </TabsContent>
              </Tabs>

              {/* Human-AI Partnership Message */}
              <div className="mt-16 max-w-4xl mx-auto">
                <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-2 border-blue-200 dark:border-blue-800">
                  <CardContent className="pt-8 pb-8">
                    <div className="flex items-start gap-4">
                      <Sparkles className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                          How It Works: Human Preparation + AI Intelligence
                        </h3>
                        <p className="text-slate-700 dark:text-slate-300 mb-4">
                          Each playbook demonstrates the M partnership model: <strong>You and your team prepare the playbook</strong> (define triggers, map stakeholders, sequence tasks). <strong>AI monitors 24/7</strong> (watches signals, detects patterns, triggers alerts). <strong>You decide and execute</strong> (activate your plan, coordinate your team). <strong>AI learns</strong> (captures outcomes, improves recommendations).
                        </p>
                        <p className="text-sm text-blue-700 dark:text-blue-400 italic">
                          The platform is only as good as your preparation. Strong inputs → Smarter AI → Better outcomes.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Conversion CTA */}
              <div className="mt-12 max-w-4xl mx-auto">
                <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-2 border-purple-300 dark:border-purple-700">
                  <CardContent className="pt-8 pb-8 text-center">
                    <h3 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
                      Ready to Operationalize Your Playbooks?
                    </h3>
                    <p className="text-lg text-slate-700 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
                      Join M's Q1 2025 pilot program and transform your strategic execution from 72-hour coordination to 12-minute response. Limited to 10 Fortune 1000 companies.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                      <Button 
                        onClick={() => setLocation('/contact')}
                        size="lg"
                        className="bg-purple-600 hover:bg-purple-700 text-white text-lg px-8 py-6"
                        data-testid="button-request-early-access-scenarios"
                      >
                        Request Early Access Interview
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </Button>
                      <Button 
                        onClick={() => setLocation('/how-it-works')}
                        size="lg"
                        variant="outline"
                        className="border-2 text-lg px-8 py-6"
                        data-testid="button-see-how-it-works"
                      >
                        See How It Works
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      90-day validation partnership • Full platform access • Strategic implementation support
                    </p>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
