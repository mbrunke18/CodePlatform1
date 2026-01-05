import { useMemo, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";

import StandardNav from "@/components/layout/StandardNav";
import Footer from "@/components/layout/Footer";
import { useCustomer } from "@/contexts/CustomerContext";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

import {
  ArrowRight,
  Layers,
  BookOpen,
  Shield,
  Zap,
  Search,
  Target,
  Clock,
  Users,
  Sparkles,
  AlertTriangle,
  TrendingUp,
  Settings,
  Copy,
  Loader2,
} from "lucide-react";

import type { PlaybookLibrary as PlaybookType } from "@shared/schema";

type Telemetry = {
  lastUsedAt: string | null;
  avgOutcomeScore: number | null;
  executionCount: number;
};

// Marketing category display configuration
// Counts are now driven by strategicCategory field from database (58/56/52 split)
const CATEGORIES = {
  offense: {
    label: "OFFENSE",
    tagline: "Seize Opportunities",
    icon: Target,
    color: "emerald",
    gradient: "from-emerald-50 to-emerald-100 dark:from-emerald-950/40 dark:to-emerald-900/30",
    border: "border-emerald-200 dark:border-emerald-800",
    text: "text-emerald-700 dark:text-emerald-400",
    badge: "bg-emerald-500 text-white",
    domains: ["Market Dynamics", "Market Opportunities"],
  },
  defense: {
    label: "DEFENSE",
    tagline: "Protect Value",
    icon: Shield,
    color: "blue",
    gradient: "from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/30",
    border: "border-blue-200 dark:border-blue-800",
    text: "text-blue-700 dark:text-blue-400",
    badge: "bg-blue-500 text-white",
    domains: ["Regulatory & Compliance", "Operational Excellence", "Financial Strategy", "Brand & Reputation"],
  },
  special_teams: {
    label: "SPECIAL TEAMS",
    tagline: "Change the Game",
    icon: Zap,
    color: "purple",
    gradient: "from-purple-50 to-purple-100 dark:from-purple-950/40 dark:to-purple-900/30",
    border: "border-purple-200 dark:border-purple-800",
    text: "text-purple-700 dark:text-purple-400",
    badge: "bg-purple-500 text-white",
    domains: ["Technology & Innovation", "Talent & Leadership", "AI Governance"],
  },
} as const;

type Category = keyof typeof CATEGORIES;

interface PlaybookLibraryResponse {
  domains: unknown[];
  categories: unknown[];
  playbooks: PlaybookType[];
}

export default function PlaybookLibrary() {
  const [location, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [actNowMode, setActNowMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const { organization } = useCustomer();
  
  const basePath = location.startsWith('/identify/') ? '/identify' : '';

  const { data: response, isLoading } = useQuery<PlaybookLibraryResponse>({
    queryKey: ["/api/playbook-library"],
  });

  const { data: telemetry } = useQuery<Record<string, Telemetry>>({
    queryKey: ["/api/playbook-library/telemetry", organization?.id],
    queryFn: async () => {
      if (!organization?.id) return {};
      const res = await fetch(`/api/playbook-library/telemetry?organizationId=${organization.id}`);
      if (!res.ok) return {};
      return res.json();
    },
    enabled: !!organization?.id,
  });

  const { toast } = useToast();
  const [copyingId, setCopyingId] = useState<string | null>(null);

  const copyTemplateMutation = useMutation({
    mutationFn: async (templateId: string) => {
      if (!organization?.id) {
        throw new Error("Please select an organization first");
      }
      const res = await apiRequest('POST', `/api/playbooks/copy-template/${templateId}`, {
        organizationId: organization.id
      });
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Template copied!",
        description: "You can now customize this playbook with your organization's details.",
      });
      if (data.redirectTo) {
        setLocation(data.redirectTo);
      }
    },
    onError: (error) => {
      toast({
        title: "Copy failed",
        description: error instanceof Error ? error.message : "Could not copy the template. Please try again.",
        variant: "destructive",
      });
      console.error('Copy template error:', error);
    },
    onSettled: () => {
      setCopyingId(null);
    }
  });

  const handleCopyAndCustomize = (templateId: string) => {
    if (!organization?.id) {
      toast({
        title: "Organization required",
        description: "Please select an organization from your profile to customize playbooks.",
        variant: "destructive",
      });
      return;
    }
    setCopyingId(templateId);
    copyTemplateMutation.mutate(templateId);
  };

  const data = response?.playbooks;

  const enriched = useMemo(() => {
    if (!data) return [];

    return data.map((pb) => {
      const t = telemetry?.[pb.id];
      const daysAgo = t?.lastUsedAt
        ? Math.floor(
            (Date.now() - new Date(t.lastUsedAt).getTime()) / 86400000
          )
        : 999;

      const urgency =
        daysAgo > 30 || (t?.avgOutcomeScore ?? 100) < 70 ? "high" : "normal";

      return {
        ...pb,
        executions: t?.executionCount ?? 0,
        avgOutcome: t?.avgOutcomeScore,
        daysAgo,
        urgency,
      };
    });
  }, [data, telemetry]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    
    return enriched.filter((pb) => {
      if (!pb || !pb.name) return false;
      
      const matchesSearch = !q || 
        pb.name.toLowerCase().includes(q) ||
        pb.description?.toLowerCase().includes(q) ||
        pb.triggerCriteria?.toLowerCase().includes(q);
      
      if (!matchesSearch) return false;
      
      // Filter by strategicCategory field directly from database
      if (selectedCategory) {
        const pbCategory = (pb as any).strategicCategory || "";
        return pbCategory === selectedCategory;
      }
      
      return true;
    });
  }, [enriched, search, selectedCategory]);

  const sorted = useMemo(() => {
    if (!actNowMode) return filtered;
    return [...filtered].sort((a, b) => {
      if (a.urgency !== b.urgency) return a.urgency === "high" ? -1 : 1;
      return a.daysAgo - b.daysAgo;
    });
  }, [filtered, actNowMode]);

  const totalCount = sorted.length;

  const categoryCounts = useMemo(() => {
    const counts: Record<Category, number> = { offense: 0, defense: 0, special_teams: 0 };
    enriched.forEach((pb) => {
      const category = (pb as any).strategicCategory as Category;
      if (category && counts[category] !== undefined) {
        counts[category]++;
      }
    });
    return counts;
  }, [enriched]);

  // Count domains per category (accounts for Financial Strategy being split)
  const domainCountsByCategory = useMemo(() => {
    const counts: Record<Category, Record<string, number>> = {
      offense: {},
      defense: {},
      special_teams: {},
    };
    enriched.forEach((pb) => {
      const category = (pb as any).strategicCategory as Category;
      const domain = (pb as any).domainName || "Unknown";
      if (category && counts[category]) {
        counts[category][domain] = (counts[category][domain] || 0) + 1;
      }
    });
    return counts;
  }, [enriched]);

  return (
    <>
      <StandardNav />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-10" data-testid="playbook-library-header">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
            {actNowMode ? "Act Now" : "Playbook Library"}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            {actNowMode 
              ? "Prioritized plays based on real execution data."
              : "From signal to coordinated action in minutes—not days. Success favors the prepared."
            }
          </p>
        </header>

        <div className="flex flex-wrap items-center gap-6 mb-10">
          <div className="max-w-md relative flex-1" data-testid="search-container">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by scenario, domain, or objective…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
              data-testid="input-search"
            />
          </div>

          <div className="flex items-center gap-3">
            <Switch 
              checked={actNowMode} 
              onCheckedChange={setActNowMode}
              data-testid="switch-act-now"
            />
            <span className="text-sm text-slate-600 dark:text-slate-400">Act Now priority</span>
          </div>
        </div>

        {!isLoading && !actNowMode && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-14" data-testid="stats-bar">
            <Stat label="Total Playbooks" value={enriched.length} testId="stat-total" />
            <Stat label="Offense" value={categoryCounts.offense} testId="stat-offense" />
            <Stat label="Defense" value={categoryCounts.defense} testId="stat-defense" />
            <Stat label="Special Teams" value={categoryCounts.special_teams} testId="stat-special" />
          </div>
        )}

        {!actNowMode && (
          <div className="grid md:grid-cols-3 gap-6 mb-14">
            {(Object.keys(CATEGORIES) as Category[]).map((category) => {
              const meta = CATEGORIES[category];
              const IconComponent = meta.icon;
              const isSelected = selectedCategory === category;

              return (
                <Card 
                  key={category} 
                  className={`bg-gradient-to-br ${meta.gradient} ${meta.border} cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 ${isSelected ? 'ring-2 ring-offset-2 ring-slate-900 dark:ring-white' : ''}`}
                  onClick={() => setSelectedCategory(isSelected ? null : category)}
                  data-testid={`card-category-${category}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-white/50 dark:bg-black/20`}>
                        <IconComponent className={`h-5 w-5 ${meta.text}`} />
                      </div>
                      <div>
                        <CardTitle className={meta.text}>{meta.label}</CardTitle>
                        <CardDescription className="text-slate-600 dark:text-slate-400">{meta.tagline}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 text-sm">
                      {Object.entries(domainCountsByCategory[category])
                        .sort(([,a], [,b]) => b - a)
                        .map(([domainName, count]) => (
                        <div key={domainName} className="flex justify-between items-center">
                          <span className="text-slate-600 dark:text-slate-400 truncate">{domainName}</span>
                          <span className={`${meta.text} font-medium ml-2`}>{count}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <Badge className={meta.badge}>{categoryCounts[category]} Playbooks</Badge>
                      {isSelected && (
                        <span className="text-xs text-slate-500">Click to clear</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
        
        {selectedCategory && (
          <div className="mb-6 flex items-center gap-3">
            <Badge variant="secondary" className="text-sm py-1 px-3">
              Filtering: {CATEGORIES[selectedCategory].label}
            </Badge>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSelectedCategory(null)}
              data-testid="button-clear-filter"
            >
              Clear filter
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="py-24 text-center text-slate-500" data-testid="loading-state">
            <Layers className="h-8 w-8 mx-auto mb-3 animate-pulse" />
            {actNowMode ? "Analyzing execution history…" : "Loading strategic plays…"}
          </div>
        )}

        {!isLoading && totalCount === 0 && (
          <div className="py-24 text-center text-slate-500" data-testid="empty-state">
            <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">No playbooks found.</p>
            <p className="text-sm mt-1">Strategy gaps often hide here.</p>
          </div>
        )}

        {!isLoading && totalCount > 0 && (
          <section data-testid="playbooks-grid">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              {actNowMode 
                ? "Priority Playbooks" 
                : selectedCategory 
                  ? `${CATEGORIES[selectedCategory].label} Playbooks` 
                  : "All Playbooks"
              } ({totalCount})
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sorted.map((playbook) => (
                <Card
                  key={playbook.id}
                  className="cursor-pointer transition hover:shadow-xl hover:-translate-y-1"
                  onClick={() => setLocation(`${basePath}/playbook-command/${playbook.id}`)}
                  data-testid={`card-playbook-${playbook.id}`}
                >
                  <CardHeader className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg leading-tight">{playbook.name}</CardTitle>
                      {playbook.playbookNumber && (
                        <Badge variant="outline" className="shrink-0">
                          #{playbook.playbookNumber}
                        </Badge>
                      )}
                    </div>
                    {playbook.primaryExecutiveRole && (
                      <CardDescription>{playbook.primaryExecutiveRole}</CardDescription>
                    )}

                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">
                        <Clock className="h-3 w-3 mr-1" />
                        ~12 min
                      </Badge>
                      
                      {playbook.urgency === "high" && (
                        <Badge className="bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Act now
                        </Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="text-sm text-slate-500 dark:text-slate-400 space-y-1">
                      <div>
                        Last used:{" "}
                        {playbook.daysAgo === 999 ? "Never" : `${playbook.daysAgo} days ago`}
                      </div>
                      <div>Executions: {playbook.executions}</div>
                      {playbook.avgOutcome !== null && playbook.avgOutcome !== undefined && (
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          Avg outcome: {Math.round(playbook.avgOutcome)}%
                        </div>
                      )}
                    </div>

                    {playbook.preApprovedBudget && (
                      <div className="text-sm text-slate-500">
                        Pre-approved: ${Number(playbook.preApprovedBudget).toLocaleString()}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        disabled={copyingId === playbook.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyAndCustomize(playbook.id);
                        }}
                        data-testid={`button-customize-${playbook.id}`}
                      >
                        {copyingId === playbook.id ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Copy className="h-4 w-4 mr-2" />
                        )}
                        {copyingId === playbook.id ? "Copying..." : "Copy & Customize"}
                      </Button>
                      <Button
                        variant="default"
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLocation(`${basePath}/playbook-command/${playbook.id}`);
                        }}
                        data-testid={`button-execute-${playbook.id}`}
                      >
                        Execute
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}

function Stat({ label, value, testId }: { label: string; value: number; testId: string }) {
  return (
    <div className="text-center" data-testid={testId}>
      <div className="text-3xl font-bold text-slate-900 dark:text-white">{value}</div>
      <div className="text-sm text-slate-500">{label}</div>
    </div>
  );
}
