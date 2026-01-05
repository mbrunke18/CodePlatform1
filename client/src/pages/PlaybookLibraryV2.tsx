import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import StandardNav from "@/components/layout/StandardNav";
import Footer from "@/components/layout/Footer";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Search, Plus, Eye, Copy, Edit, Target, Shield, Zap, Clock, Users, Star, MoreHorizontal, ArrowLeft, ChevronRight, BookOpen } from "lucide-react";
import type { Playbook } from "@shared/schema";
import { useCustomer } from "@/contexts/CustomerContext";

const categoryConfig = {
  offense: {
    label: 'OFFENSE',
    tagline: 'Seize Opportunities',
    description: 'Market expansion, M&A integration, and product launches',
    icon: Target,
    color: 'emerald',
    bgGradient: 'from-emerald-500 to-emerald-600',
    lightBg: 'bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/40 dark:to-emerald-900/20',
    iconBg: 'bg-emerald-500',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    borderColor: 'border-emerald-200 dark:border-emerald-800/50',
    hoverBorder: 'hover:border-emerald-400 dark:hover:border-emerald-600',
    count: 58,
    domains: [
      { name: 'Market Entry & Expansion', count: 22 },
      { name: 'M&A Integration', count: 16 },
      { name: 'Product Launch', count: 20 }
    ]
  },
  defense: {
    label: 'DEFENSE',
    tagline: 'Protect Value',
    description: 'Crisis response, cyber incidents, and regulatory compliance',
    icon: Shield,
    color: 'blue',
    bgGradient: 'from-blue-500 to-blue-600',
    lightBg: 'bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/40 dark:to-blue-900/20',
    iconBg: 'bg-blue-500',
    textColor: 'text-blue-600 dark:text-blue-400',
    borderColor: 'border-blue-200 dark:border-blue-800/50',
    hoverBorder: 'hover:border-blue-400 dark:hover:border-blue-600',
    count: 56,
    domains: [
      { name: 'Crisis Response', count: 24 },
      { name: 'Cyber Incidents', count: 18 },
      { name: 'Regulatory Compliance', count: 14 }
    ]
  },
  special_teams: {
    label: 'SPECIAL TEAMS',
    tagline: 'Change the Game',
    description: 'Digital transformation, competitive response, and AI governance',
    icon: Zap,
    color: 'purple',
    bgGradient: 'from-purple-500 to-purple-600',
    lightBg: 'bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/40 dark:to-purple-900/20',
    iconBg: 'bg-purple-500',
    textColor: 'text-purple-600 dark:text-purple-400',
    borderColor: 'border-purple-200 dark:border-purple-800/50',
    hoverBorder: 'hover:border-purple-400 dark:hover:border-purple-600',
    count: 52,
    domains: [
      { name: 'Digital Transformation', count: 16 },
      { name: 'Competitive Response', count: 18 },
      { name: 'AI Governance', count: 18 }
    ]
  }
};

type Category = keyof typeof categoryConfig;

export default function PlaybookLibraryV2() {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [search, setSearch] = useState("");
  const [domainFilter, setDomainFilter] = useState<string>("all");
  const { organization } = useCustomer();
  
  const { data: templates, isLoading: loadingTemplates } = useQuery<Playbook[]>({
    queryKey: ['/api/playbooks/templates'],
  });
  
  const { data: myPlaybooks } = useQuery<Playbook[]>({
    queryKey: ['/api/playbooks', organization?.id],
    queryFn: async () => {
      const res = await fetch(`/api/playbooks?organizationId=${organization?.id || ''}`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: true
  });
  
  const domains = Array.from(new Set(templates?.map(t => t.domain).filter(Boolean) || []));
  
  const getCategoryPlaybooks = (category: Category) => {
    return templates?.filter(t => {
      const matchesCategory = t.category === category;
      const matchesSearch = !search || 
        t.name?.toLowerCase().includes(search.toLowerCase()) ||
        t.description?.toLowerCase().includes(search.toLowerCase());
      const matchesDomain = domainFilter === "all" || t.domain === domainFilter;
      return matchesCategory && matchesSearch && matchesDomain;
    }) || [];
  };

  const categoryCounts = {
    offense: templates?.filter(t => t.category === 'offense').length || 58,
    defense: templates?.filter(t => t.category === 'defense').length || 56,
    special_teams: templates?.filter(t => t.category === 'special_teams').length || 52
  };
  
  const totalCount = categoryCounts.offense + categoryCounts.defense + categoryCounts.special_teams;
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <StandardNav />
      
      {!selectedCategory ? (
        <>
          <div className="bg-slate-900 dark:bg-slate-950 border-b border-slate-800">
            <div className="max-w-6xl mx-auto px-6 pt-24 pb-16">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-white" />
                    </div>
                    <h1 className="text-2xl font-semibold text-white tracking-tight">
                      Playbook Library
                    </h1>
                  </div>
                  <p className="text-slate-400 max-w-lg">
                    {totalCount} battle-tested strategic playbooks. Select a category to explore.
                  </p>
                </div>
                <Button 
                  onClick={() => setLocation('/playbooks/create')} 
                  className="bg-white text-slate-900 hover:bg-slate-100"
                  data-testid="button-create-playbook"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Custom
                </Button>
              </div>
            </div>
          </div>
          
          <div className="max-w-6xl mx-auto px-6 -mt-8">
            <div className="grid md:grid-cols-3 gap-5">
              {(['offense', 'defense', 'special_teams'] as Category[]).map((category) => {
                const config = categoryConfig[category];
                const Icon = config.icon;
                const count = categoryCounts[category];
                
                return (
                  <Card
                    key={category}
                    className={`group cursor-pointer bg-white dark:bg-slate-900 border-2 ${config.borderColor} ${config.hoverBorder} transition-all duration-200 hover:shadow-xl hover:-translate-y-1`}
                    onClick={() => setSelectedCategory(category)}
                    data-testid={`card-category-${category}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl ${config.iconBg} flex items-center justify-center shadow-lg`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-3xl font-bold text-slate-900 dark:text-white">
                          {count}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 tracking-tight">
                        {config.label}
                      </h3>
                      <p className={`text-sm font-medium ${config.textColor} mb-3`}>
                        {config.tagline}
                      </p>
                      
                      <div className="space-y-1.5 mb-4">
                        {config.domains.map((domain, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <span className="text-slate-600 dark:text-slate-400">{domain.name}</span>
                            <span className="font-medium text-slate-900 dark:text-white">{domain.count}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className={`flex items-center gap-1 text-sm font-medium ${config.textColor} group-hover:gap-2 transition-all`}>
                        Browse playbooks
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            {myPlaybooks && myPlaybooks.length > 0 && (
              <div className="mt-12 mb-8">
                <div className="flex items-center gap-3 mb-5">
                  <Star className="h-5 w-5 text-amber-500" />
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    My Playbooks
                  </h2>
                  <Badge variant="secondary">{myPlaybooks.length}</Badge>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myPlaybooks.slice(0, 3).map((playbook) => (
                    <PlaybookCard key={playbook.id} playbook={playbook} isCustom={true} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {(() => {
            const config = categoryConfig[selectedCategory];
            const Icon = config.icon;
            const playbooks = getCategoryPlaybooks(selectedCategory);
            
            return (
              <>
                <div className={`bg-gradient-to-r ${config.bgGradient} border-b border-slate-800`}>
                  <div className="max-w-6xl mx-auto px-6 pt-24 pb-12">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => { setSelectedCategory(null); setSearch(""); setDomainFilter("all"); }}
                      className="text-white/80 hover:text-white hover:bg-white/10 mb-4 -ml-2"
                      data-testid="button-back-categories"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      All Categories
                    </Button>
                    
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                          <Icon className="h-7 w-7 text-white" />
                        </div>
                        <div>
                          <h1 className="text-2xl font-semibold text-white tracking-tight">
                            {config.label}
                          </h1>
                          <p className="text-white/80">
                            {config.tagline} • {playbooks.length} playbooks
                          </p>
                        </div>
                      </div>
                      <Button 
                        onClick={() => setLocation('/playbooks/create')} 
                        className="bg-white text-slate-900 hover:bg-slate-100"
                        data-testid="button-create-playbook-detail"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Create Custom
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="max-w-6xl mx-auto px-6 py-8">
                  <div className="flex items-center gap-4 mb-6 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex-1 relative max-w-sm">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input 
                        placeholder="Search playbooks..." 
                        className="pl-10 border-slate-200 dark:border-slate-700"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        data-testid="input-search"
                      />
                    </div>
                    <Select value={domainFilter} onValueChange={setDomainFilter}>
                      <SelectTrigger className="w-48 border-slate-200 dark:border-slate-700" data-testid="select-domain-filter">
                        <SelectValue placeholder="All Domains" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Domains</SelectItem>
                        {domains.map(domain => (
                          <SelectItem key={domain} value={domain!}>{domain}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {(search || domainFilter !== "all") && (
                      <Button variant="ghost" size="sm" onClick={() => { setSearch(""); setDomainFilter("all"); }}>
                        Clear filters
                      </Button>
                    )}
                  </div>
                  
                  {loadingTemplates ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {[1,2,3,4,5,6].map(i => (
                        <div key={i} className="h-52 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
                      ))}
                    </div>
                  ) : playbooks.length === 0 ? (
                    <div className="text-center py-20">
                      <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                        <Search className="h-8 w-8 text-slate-400" />
                      </div>
                      <p className="text-slate-500 dark:text-slate-400">No playbooks found matching your criteria.</p>
                      <Button variant="link" onClick={() => { setSearch(""); setDomainFilter("all"); }}>
                        Clear filters
                      </Button>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {playbooks.map((playbook) => (
                        <PlaybookCard key={playbook.id} playbook={playbook} isCustom={false} />
                      ))}
                    </div>
                  )}
                </div>
              </>
            );
          })()}
        </>
      )}
      
      <Footer />
    </div>
  );
}

function PlaybookCard({ 
  playbook, 
  isCustom
}: { 
  playbook: Playbook; 
  isCustom: boolean;
}) {
  const [, setLocation] = useLocation();
  const category = (playbook.category || 'offense') as Category;
  const config = categoryConfig[category] || categoryConfig.offense;
  
  return (
    <Card 
      className="group bg-white dark:bg-slate-900 hover:shadow-lg transition-all duration-200 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
      data-testid={`card-playbook-${playbook.id}`}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <Badge variant="outline" className={`text-xs font-medium ${config.textColor} border-current`}>
            {config.label}
          </Badge>
          <div className="flex items-center gap-1.5">
            {isCustom && playbook.status && (
              <Badge 
                className={`text-xs ${
                  playbook.status === 'draft' 
                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' 
                    : playbook.status === 'ready'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : playbook.status === 'active'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400'
                }`}
              >
                {playbook.status === 'draft' ? 'Draft' : 
                 playbook.status === 'ready' ? 'Ready' : 
                 playbook.status === 'active' ? 'Active' : 
                 playbook.status}
              </Badge>
            )}
            {isCustom && (
              <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-xs">
                Custom
              </Badge>
            )}
          </div>
        </div>
        
        <h3 className="font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2 leading-snug">
          {playbook.name}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
          {playbook.description}
        </p>
        
        <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
          {!isCustom && (
            <>
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {playbook.timesUsed || 0}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                ~{playbook.avgResponseTimeSeconds ? Math.round(playbook.avgResponseTimeSeconds / 60) : 12}m
              </span>
            </>
          )}
          <span className="truncate flex-1 text-right">{playbook.domain}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 h-9"
            onClick={() => setLocation(`/playbooks/${playbook.id}/preview`)}
            data-testid={`button-preview-${playbook.id}`}
          >
            <Eye className="mr-1.5 h-3.5 w-3.5" />
            Preview
          </Button>
          
          {isCustom ? (
            <Button 
              size="sm" 
              className="flex-1 h-9"
              onClick={() => setLocation(`/playbooks/${playbook.id}/edit`)}
              data-testid={`button-edit-${playbook.id}`}
            >
              <Edit className="mr-1.5 h-3.5 w-3.5" />
              Edit
            </Button>
          ) : (
            <>
              <Button 
                size="sm"
                className="flex-1 h-9"
                onClick={() => setLocation(`/playbooks/${playbook.id}/customize`)}
                data-testid={`button-customize-${playbook.id}`}
              >
                <Edit className="mr-1.5 h-3.5 w-3.5" />
                Customize
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setLocation(`/playbooks/${playbook.id}/customize`)}>
                    <Copy className="mr-2 h-4 w-4" />
                    Clone as new
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
