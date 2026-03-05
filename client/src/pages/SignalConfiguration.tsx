import { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';
import {
  ChevronDown, ChevronRight, Search, Zap, Target, TrendingUp,
  DollarSign, Shield, Activity, Users, Globe, Cpu, BarChart3,
  Eye, BookOpen, AlertTriangle, Radio, Leaf, Brain, Star,
  Building2, Database, Plus, ExternalLink, Filter, CheckCircle2,
  XCircle, Info,
} from 'lucide-react';
import { SIGNAL_CATEGORIES } from '@shared/intelligence-signals';

const NAVY = '#0A0F2E';
const GOLD = '#C9A84C';
const TEAL = '#2B8A6E';
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

const ICON_MAP: Record<string, React.ElementType> = {
  Swords: Target, Zap, TrendingUp, DollarSign, Shield, Globe,
  Cpu, BarChart3, Activity, Eye, Users, Brain, Star, Leaf,
  Radio, BookOpen, AlertTriangle, Building2, Database, Filter,
};

function getCategoryIcon(iconName: string): React.ElementType {
  return ICON_MAP[iconName] || Activity;
}

const PHASE_LABELS: Record<string, string> = {
  external: 'External Signal',
  internal: 'Internal Signal',
};

export default function SignalConfiguration() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [localDisabled, setLocalDisabled] = useState<string[] | null>(null);

  const { data: configData, isLoading: configLoading } = useQuery<{ disabledDataPoints: string[] }>({
    queryKey: ['/api/signal-monitoring-config'],
  });

  const { data: triggersData } = useQuery<any[]>({
    queryKey: ['/api/executive-triggers'],
  });

  const { data: playbooksData } = useQuery<any>({
    queryKey: ['/api/playbooks'],
  });

  const disabledDataPoints: string[] = localDisabled ?? configData?.disabledDataPoints ?? [];

  const configMutation = useMutation({
    mutationFn: async (disabled: string[]) => {
      return apiRequest('PATCH', '/api/signal-monitoring-config', { disabledDataPoints: disabled });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/signal-monitoring-config'] });
    },
    onError: () => {
      setLocalDisabled(null);
      toast({ title: 'Save failed', description: 'Could not update signal configuration.', variant: 'destructive' });
    },
  });

  const toggleDataPoint = useCallback((dpId: string) => {
    const current = localDisabled ?? configData?.disabledDataPoints ?? [];
    const updated = current.includes(dpId)
      ? current.filter(id => id !== dpId)
      : [...current, dpId];
    setLocalDisabled(updated);
    configMutation.mutate(updated);
  }, [localDisabled, configData, configMutation]);

  const toggleCategory = useCallback((categoryId: string, enableAll: boolean) => {
    const categoryDps = SIGNAL_CATEGORIES.find(c => c.id === categoryId)?.dataPoints.map(dp => dp.id) ?? [];
    const current = localDisabled ?? configData?.disabledDataPoints ?? [];
    let updated: string[];
    if (enableAll) {
      updated = current.filter(id => !categoryDps.includes(id));
    } else {
      const toAdd = categoryDps.filter(id => !current.includes(id));
      updated = [...current, ...toAdd];
    }
    setLocalDisabled(updated);
    configMutation.mutate(updated);
  }, [localDisabled, configData, configMutation]);

  const toggleExpanded = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) next.delete(categoryId);
      else next.add(categoryId);
      return next;
    });
  };

  const triggersPerCategory = useMemo(() => {
    const map: Record<string, number> = {};
    if (!triggersData) return map;
    for (const t of triggersData as any[]) {
      if (t.category) map[t.category] = (map[t.category] || 0) + 1;
    }
    return map;
  }, [triggersData]);

  const playbooksByKey = useMemo(() => {
    const map: Record<string, string> = {};
    const list: any[] = playbooksData?.data ?? [];
    for (const p of list) {
      const key = (p.title || p.name || '').toLowerCase().replace(/\s+/g, '-');
      map[key] = p.id;
    }
    return map;
  }, [playbooksData]);

  const totalDataPoints = SIGNAL_CATEGORIES.reduce((sum, c) => sum + c.dataPoints.length, 0);
  const activeDataPoints = totalDataPoints - disabledDataPoints.length;
  const fullyActiveCategories = SIGNAL_CATEGORIES.filter(c =>
    c.dataPoints.every(dp => !disabledDataPoints.includes(dp.id))
  ).length;

  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) return SIGNAL_CATEGORIES;
    const q = searchTerm.toLowerCase();
    return SIGNAL_CATEGORIES.filter(cat => {
      const nameMatch = cat.name.toLowerCase().includes(q) || cat.description.toLowerCase().includes(q);
      const dpMatch = cat.dataPoints.some(dp =>
        dp.name.toLowerCase().includes(q) || dp.description.toLowerCase().includes(q)
      );
      return nameMatch || dpMatch;
    }).map(cat => ({
      ...cat,
      dataPoints: searchTerm.trim()
        ? cat.dataPoints.filter(dp =>
            dp.name.toLowerCase().includes(q) || dp.description.toLowerCase().includes(q)
          )
        : cat.dataPoints,
    }));
  }, [searchTerm]);

  if (configLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: GOLD }} />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="flex-1 overflow-auto bg-white">
        <div className="p-8 max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div style={{ width: 48, height: 48, background: NAVY, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Radio className="w-6 h-6 text-white" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                  <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: GOLD }}>IDEA Framework · DETECT</span>
                </div>
                <h1 style={{ ...CG, fontWeight: 700, fontSize: '2rem', color: NAVY }}>Signal Intelligence Configuration</h1>
                <p className="text-sm text-gray-500 mt-1 max-w-xl">
                  Control exactly what your organization monitors. Each active data point feeds your triggers, which fire your playbooks.
                </p>
              </div>
            </div>
            <Link href="/triggers-management">
              <Button style={{ background: NAVY, color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                <Zap className="w-4 h-4 mr-2" />
                Manage Triggers
              </Button>
            </Link>
          </div>

          {/* Framework chain banner */}
          <div className="mb-8 p-4 border border-[#E8E4DC] bg-[#F8F7F4] flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{ background: TEAL }}>1</div>
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: TEAL }}>Data Points</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{ background: GOLD }}>2</div>
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: GOLD }}>Triggers Fire</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{ background: NAVY }}>3</div>
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: NAVY }}>Playbook Executes</span>
            </div>
            <div className="ml-auto text-[10px] text-gray-500 font-medium">
              Activate data points → define trigger conditions → assign playbooks → respond in 12 minutes
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Active Data Points', value: activeDataPoints, total: totalDataPoints, color: TEAL },
              { label: 'Categories Fully Active', value: fullyActiveCategories, total: SIGNAL_CATEGORIES.length, color: NAVY },
              { label: 'Total Triggers Running', value: (triggersData as any[])?.filter(t => t.isActive)?.length ?? 0, total: undefined, color: GOLD },
              { label: 'Disabled Data Points', value: disabledDataPoints.length, total: undefined, color: '#EF4444' },
            ].map((s, i) => (
              <div key={i} className="border border-[#E8E4DC] p-4 bg-white">
                <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-1">{s.label}</p>
                <p className="text-2xl font-bold" style={{ color: s.color }}>
                  {s.value}
                  {s.total !== undefined && <span className="text-sm text-gray-400 font-normal ml-1">/ {s.total}</span>}
                </p>
              </div>
            ))}
          </div>

          {/* Search + expand all */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search categories or data points..."
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value);
                  if (e.target.value) {
                    setExpandedCategories(new Set(SIGNAL_CATEGORIES.map(c => c.id)));
                  }
                }}
                className="pl-9 border-[#E8E4DC] text-sm"
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-[10px] font-bold uppercase tracking-wider border border-[#E8E4DC]"
              onClick={() => setExpandedCategories(
                expandedCategories.size === SIGNAL_CATEGORIES.length
                  ? new Set()
                  : new Set(SIGNAL_CATEGORIES.map(c => c.id))
              )}
            >
              {expandedCategories.size === SIGNAL_CATEGORIES.length ? 'Collapse All' : 'Expand All'}
            </Button>
          </div>

          {/* Category cards */}
          <div className="space-y-3">
            {filteredCategories.map(category => {
              const Icon = getCategoryIcon(category.icon);
              const isExpanded = expandedCategories.has(category.id);
              const categoryDpIds = category.dataPoints.map(dp => dp.id);
              const activeDps = category.dataPoints.filter(dp => !disabledDataPoints.includes(dp.id)).length;
              const allActive = activeDps === category.dataPoints.length;
              const noneActive = activeDps === 0;
              const triggerCount = triggersPerCategory[category.id] || 0;
              const hasSearch = searchTerm.trim().length > 0;

              return (
                <div
                  key={category.id}
                  className="border border-[#E8E4DC] bg-white overflow-hidden"
                  style={{ borderLeft: `3px solid ${allActive ? TEAL : noneActive ? '#EF4444' : GOLD}` }}
                >
                  {/* Category header row */}
                  <div
                    className="flex items-center gap-4 p-4 cursor-pointer hover:bg-[#F8F7F4] transition-colors"
                    onClick={() => toggleExpanded(category.id)}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div style={{ width: 36, height: 36, background: '#F8F7F4', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon className="w-5 h-5" style={{ color: NAVY }} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm" style={{ color: NAVY }}>{category.name}</span>
                          <span className="text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 border" style={{ color: GOLD, borderColor: 'rgba(201,168,76,0.4)' }}>
                            {PHASE_LABELS[category.phase] ?? category.phase}
                          </span>
                          {triggerCount > 0 && (
                            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5" style={{ background: 'rgba(43,138,110,0.1)', color: TEAL }}>
                              {triggerCount} trigger{triggerCount !== 1 ? 's' : ''} active
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 truncate max-w-xl">{category.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 flex-shrink-0">
                      {/* Active count */}
                      <div className="text-right">
                        <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Data Points</p>
                        <p className="text-lg font-bold" style={{ color: allActive ? TEAL : noneActive ? '#EF4444' : GOLD }}>
                          {activeDps}<span className="text-sm text-gray-400 font-normal">/{category.dataPoints.length}</span>
                        </p>
                      </div>

                      {/* Category-level enable/disable all */}
                      <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">All</span>
                        <Switch
                          checked={allActive}
                          onCheckedChange={(checked) => toggleCategory(category.id, checked)}
                        />
                      </div>

                      {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                    </div>
                  </div>

                  {/* Expanded: data points + playbook chain */}
                  {isExpanded && (
                    <div className="border-t border-[#E8E4DC]">

                      {/* Playbook chain */}
                      {category.recommendedPlaybooks?.length > 0 && (
                        <div className="px-4 py-3 bg-[#F8F7F4] border-b border-[#E8E4DC]">
                          <div className="flex items-start gap-3">
                            <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
                              <BookOpen className="w-4 h-4" style={{ color: GOLD }} />
                              <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: GOLD }}>Recommended Playbooks</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {category.recommendedPlaybooks.map(slug => (
                                <Link key={slug} href="/playbook-library">
                                  <span
                                    className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold cursor-pointer hover:opacity-80 transition-opacity"
                                    style={{ background: 'rgba(10,15,46,0.06)', color: NAVY, border: '1px solid rgba(10,15,46,0.15)' }}
                                  >
                                    {slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    <ExternalLink className="w-2.5 h-2.5" />
                                  </span>
                                </Link>
                              ))}
                            </div>
                            <Link href={`/triggers-management`} className="ml-auto flex-shrink-0">
                              <Button
                                size="sm"
                                style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', background: NAVY, color: '#fff' }}
                              >
                                <Plus className="w-3 h-3 mr-1" />
                                Create Trigger
                              </Button>
                            </Link>
                          </div>
                        </div>
                      )}

                      {/* Data points table */}
                      <div className="divide-y divide-[#F0EDE8]">
                        {(hasSearch ? category.dataPoints : category.dataPoints).map(dp => {
                          const isEnabled = !disabledDataPoints.includes(dp.id);
                          return (
                            <div
                              key={dp.id}
                              className="flex items-center gap-4 px-4 py-3 hover:bg-[#FAFAF9] transition-colors"
                              style={{ opacity: isEnabled ? 1 : 0.5 }}
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                  <span className="text-sm font-semibold" style={{ color: NAVY }}>{dp.name}</span>
                                  <span
                                    className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5"
                                    style={{ background: 'rgba(201,168,76,0.1)', color: GOLD }}
                                  >
                                    {dp.metricType}
                                  </span>
                                  {dp.defaultThreshold && (
                                    <span className="text-[9px] font-semibold text-gray-400 flex items-center gap-1">
                                      <AlertTriangle className="w-3 h-3" />
                                      fires at {dp.defaultThreshold.operator} {dp.defaultThreshold.value}{dp.unit ?? ''}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 leading-relaxed">{dp.description}</p>
                                {dp.sources?.length > 0 && (
                                  <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Sources:</span>
                                    {dp.sources.map(src => (
                                      <span key={src} className="text-[9px] font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                        {src}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center gap-4 flex-shrink-0">
                                {isEnabled ? (
                                  <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider" style={{ color: TEAL }}>
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Monitoring
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-gray-400">
                                    <XCircle className="w-3.5 h-3.5" />
                                    Paused
                                  </div>
                                )}
                                <Switch
                                  checked={isEnabled}
                                  onCheckedChange={() => toggleDataPoint(dp.id)}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Footer CTA for this category */}
                      <div className="px-4 py-3 bg-[#F8F7F4] border-t border-[#E8E4DC] flex items-center justify-between">
                        <p className="text-[10px] text-gray-500">
                          <span className="font-bold" style={{ color: activeDps > 0 ? TEAL : '#EF4444' }}>{activeDps} of {category.dataPoints.length}</span> data points feeding your triggers in this category
                        </p>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleCategory(category.id, true)}
                            className="text-[10px] font-bold uppercase tracking-wider hover:underline"
                            style={{ color: TEAL }}
                          >
                            Enable All
                          </button>
                          <button
                            onClick={() => toggleCategory(category.id, false)}
                            className="text-[10px] font-bold uppercase tracking-wider hover:underline text-gray-400"
                          >
                            Disable All
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom info callout */}
          <div className="mt-8 p-5 border border-[#E8E4DC] bg-[#F8F7F4] flex items-start gap-4">
            <Info className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: GOLD }} />
            <div>
              <p className="text-sm font-bold mb-1" style={{ color: NAVY }}>How this connects to your playbooks</p>
              <p className="text-xs text-gray-600 leading-relaxed">
                Enabling a data point means the platform watches that signal for your organization. When a monitored data point crosses a threshold,
                a trigger fires. That trigger is linked to one or more playbooks, which automatically queue for execution — completing the 12-minute response loop.
                Disable data points that aren't relevant to your industry or current strategic priorities.
              </p>
            </div>
          </div>

        </div>
      </div>
    </PageLayout>
  );
}
