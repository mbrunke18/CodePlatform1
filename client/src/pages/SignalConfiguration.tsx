import { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Search, Zap, Target, TrendingUp, DollarSign, Shield, Activity,
  Users, Globe, Cpu, BarChart3, Eye, BookOpen, AlertTriangle,
  Radio, Leaf, Brain, Star, Building2, Database, Plus, ChevronRight,
  Settings, CheckCircle2,
} from 'lucide-react';
import { SIGNAL_CATEGORIES } from '@shared/intelligence-signals';
import TriggerConfigurationWizard from '@/components/configuration/TriggerConfigurationWizard';

const NAVY  = '#0A0F2E';
const GOLD  = '#C9A84C';
const TEAL  = '#2B8A6E';
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

const ICON_MAP: Record<string, React.ElementType> = {
  Swords: Target, Zap, TrendingUp, DollarSign, Shield, Globe,
  Cpu, BarChart3, Activity, Eye, Users, Brain, Star, Leaf,
  Radio, BookOpen, AlertTriangle, Building2, Database, Settings,
};
function getIcon(name: string): React.ElementType {
  return ICON_MAP[name] || Activity;
}

function formatOp(op: string, val?: any, unit?: string): string {
  const v = val !== undefined ? `${val}${unit ?? ''}` : '';
  switch (op) {
    case 'gt':    return `rises above ${v}`;
    case 'gte':   return `reaches ≥ ${v}`;
    case 'lt':    return `drops below ${v}`;
    case 'lte':   return `reaches ≤ ${v}`;
    case 'eq':    return `equals ${v}`;
    case 'spike': return `spikes by ${v}%`;
    case 'drop':  return `drops by ${v}%`;
    case 'trend': return `trends ${v}`;
    default:      return `${op} ${v}`;
  }
}

const SEV_COLOR: Record<string, string> = {
  critical: '#EF4444',
  high:     '#F97316',
  medium:   GOLD,
  low:      '#6B7280',
};

type DpFilter = 'all' | 'monitoring' | 'paused';

export default function SignalConfiguration() {
  const { toast } = useToast();

  const [search, setSearch]               = useState('');
  const [selectedCatId, setSelectedCatId] = useState(SIGNAL_CATEGORIES[0]?.id ?? '');
  const [dpFilter, setDpFilter]           = useState<DpFilter>('all');
  const [localDisabled, setLocalDisabled] = useState<string[] | null>(null);
  const [wizardOpen, setWizardOpen]       = useState(false);
  const [wizardCategory, setWizardCategory] = useState('');
  const [editingTrigger, setEditingTrigger] = useState<any>(null);

  const { data: configData, isLoading } = useQuery<{ disabledDataPoints: string[] }>({
    queryKey: ['/api/signal-monitoring-config'],
  });
  const { data: triggersData } = useQuery<any[]>({
    queryKey: ['/api/executive-triggers'],
  });

  const disabled: string[] = localDisabled ?? configData?.disabledDataPoints ?? [];

  const configMutation = useMutation({
    mutationFn: (d: string[]) => apiRequest('PATCH', '/api/signal-monitoring-config', { disabledDataPoints: d }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/signal-monitoring-config'] }),
    onError: () => {
      setLocalDisabled(null);
      toast({ title: 'Save failed', variant: 'destructive' });
    },
  });

  const toggleDp = useCallback((dpId: string) => {
    const cur = localDisabled ?? configData?.disabledDataPoints ?? [];
    const next = cur.includes(dpId) ? cur.filter(id => id !== dpId) : [...cur, dpId];
    setLocalDisabled(next);
    configMutation.mutate(next);
  }, [localDisabled, configData, configMutation]);

  const toggleCategory = useCallback((catId: string, enable: boolean) => {
    const dpIds = SIGNAL_CATEGORIES.find(c => c.id === catId)?.dataPoints.map(d => d.id) ?? [];
    const cur = localDisabled ?? configData?.disabledDataPoints ?? [];
    const next = enable
      ? cur.filter(id => !dpIds.includes(id))
      : [...cur, ...dpIds.filter(id => !cur.includes(id))];
    setLocalDisabled(next);
    configMutation.mutate(next);
  }, [localDisabled, configData, configMutation]);

  // category → trigger count
  const triggersPerCategory = useMemo(() => {
    const map: Record<string, number> = {};
    for (const t of (triggersData ?? []) as any[]) {
      if (t.category) map[t.category] = (map[t.category] || 0) + 1;
    }
    return map;
  }, [triggersData]);

  // dataPointId → trigger object (exact match wins, category fallback second)
  const triggerByDpId = useMemo(() => {
    const map: Record<string, any> = {};
    for (const t of (triggersData ?? []) as any[]) {
      const dpId = t.conditions?.dataPointId || t.conditions?.field || t.conditions?.metric;
      if (dpId && !map[dpId]) map[dpId] = t;
      if (Array.isArray(t.conditions?.dataPointIds)) {
        for (const id of t.conditions.dataPointIds) {
          if (!map[id]) map[id] = t;
        }
      }
    }
    return map;
  }, [triggersData]);

  const totalDps      = SIGNAL_CATEGORIES.reduce((s, c) => s + c.dataPoints.length, 0);
  const activeDps     = totalDps - disabled.length;
  const activeTriggers = ((triggersData ?? []) as any[]).filter(t => t.isActive).length;

  const q = search.toLowerCase();
  const visibleCategories = SIGNAL_CATEGORIES.filter(cat => {
    if (!q) return true;
    return (
      cat.name.toLowerCase().includes(q) ||
      cat.description.toLowerCase().includes(q) ||
      cat.dataPoints.some(dp => dp.name.toLowerCase().includes(q) || dp.description.toLowerCase().includes(q))
    );
  });

  const activeCat = visibleCategories.find(c => c.id === selectedCatId) ?? visibleCategories[0];

  const visibleDps = useMemo(() => {
    if (!activeCat) return [];
    return activeCat.dataPoints.filter(dp => {
      const textMatch = !q || dp.name.toLowerCase().includes(q) || dp.description.toLowerCase().includes(q);
      const isEnabled = !disabled.includes(dp.id);
      if (dpFilter === 'monitoring') return textMatch && isEnabled;
      if (dpFilter === 'paused')     return textMatch && !isEnabled;
      return textMatch;
    });
  }, [activeCat, q, dpFilter, disabled]);

  const catAllActive = activeCat
    ? activeCat.dataPoints.every(dp => !disabled.includes(dp.id))
    : false;

  const openWizardFor = (categoryId: string, trigger?: any) => {
    setWizardCategory(categoryId);
    setEditingTrigger(trigger ?? null);
    setWizardOpen(true);
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin h-8 w-8 border-b-2" style={{ borderColor: GOLD }} />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="flex flex-col h-full overflow-hidden bg-white">

        {/* ── Top bar ─────────────────────────────────────────────── */}
        <div className="flex-shrink-0 border-b border-[#E8E4DC] bg-white">
          <div className="px-6 pt-6 pb-4 flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div style={{ width: 44, height: 44, background: NAVY, borderRadius: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Radio className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[8px] font-black uppercase tracking-[0.3em]" style={{ color: GOLD }}>IDEA Framework</span>
                  <ChevronRight className="w-3 h-3" style={{ color: GOLD }} />
                  <span className="text-[8px] font-black uppercase tracking-[0.3em]" style={{ color: TEAL }}>DETECT</span>
                </div>
                <h1 style={{ ...CG, fontWeight: 700, fontSize: '1.5rem', color: NAVY, lineHeight: 1 }}>
                  Signal Intelligence Configuration
                </h1>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-6">
              {[
                { label: 'Active Data Points', value: `${activeDps} / ${totalDps}`, color: TEAL },
                { label: 'Alert Rules Set',    value: activeTriggers,               color: GOLD },
                { label: 'Categories',         value: SIGNAL_CATEGORIES.length,     color: NAVY },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <p className="text-[8px] font-bold uppercase tracking-wider text-gray-400">{s.label}</p>
                  <p className="text-lg font-black" style={{ color: s.color }}>{s.value}</p>
                </div>
              ))}
            </div>

            <Button
              onClick={() => openWizardFor(selectedCatId)}
              style={{ background: GOLD, color: NAVY, fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', flexShrink: 0 }}
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Set Alert Rule
            </Button>
          </div>

          <div className="px-6 pb-4 flex items-center gap-4">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search categories, data points, or sources…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 h-10 border-[#E8E4DC] text-sm bg-[#F8F7F4] focus:bg-white"
                autoFocus
              />
            </div>
            <div className="hidden lg:flex items-center gap-1 ml-auto">
              {[
                { letter: 'I', label: 'IDENTIFY', color: '#6366F1', active: false },
                { letter: 'D', label: 'DETECT',   color: TEAL,      active: true  },
                { letter: 'E', label: 'EXECUTE',  color: GOLD,      active: false },
                { letter: 'A', label: 'ADVANCE',  color: NAVY,      active: false },
              ].map((step, i) => (
                <div key={step.letter} className="flex items-center gap-1">
                  <div
                    className="flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider"
                    style={{
                      background: step.active ? step.color : 'transparent',
                      color: step.active ? '#fff' : '#9CA3AF',
                      border: `1px solid ${step.active ? step.color : '#E8E4DC'}`,
                    }}
                  >
                    <span>{step.letter}</span>
                    <span>{step.label}</span>
                  </div>
                  {i < 3 && <ChevronRight className="w-3 h-3 text-gray-300" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Split layout ─────────────────────────────────────────── */}
        <div className="flex flex-1 min-h-0 overflow-hidden">

          {/* LEFT — Category list */}
          <div className="w-64 flex-shrink-0 border-r border-[#E8E4DC] overflow-y-auto bg-[#F8F7F4]">
            <div className="p-3 border-b border-[#E8E4DC]">
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                {visibleCategories.length} of {SIGNAL_CATEGORIES.length} categories
              </p>
            </div>
            {visibleCategories.map(cat => {
              const Icon      = getIcon(cat.icon);
              const active    = cat.id === activeCat?.id;
              const catDps    = cat.dataPoints.length;
              const catOff    = cat.dataPoints.filter(dp => disabled.includes(dp.id)).length;
              const catTriggers = triggersPerCategory[cat.id] || 0;
              const allOn     = catOff === 0;
              const noneOn    = catOff === catDps;
              const statusColor = noneOn ? '#EF4444' : allOn ? TEAL : GOLD;

              return (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCatId(cat.id); setDpFilter('all'); }}
                  className="w-full text-left px-3 py-3 flex items-start gap-3 transition-colors border-b border-[#EDE9E3] hover:bg-white"
                  style={{ background: active ? '#fff' : 'transparent', borderLeft: active ? `3px solid ${TEAL}` : '3px solid transparent' }}
                >
                  <div style={{ width: 28, height: 28, background: active ? `rgba(43,138,110,0.1)` : '#EDE9E3', borderRadius: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <Icon className="w-3.5 h-3.5" style={{ color: active ? TEAL : '#6B7280' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold leading-tight truncate" style={{ color: active ? NAVY : '#374151' }}>{cat.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[9px] font-bold" style={{ color: statusColor }}>
                        {catDps - catOff}/{catDps}
                      </span>
                      {catTriggers > 0 && (
                        <span className="text-[8px] font-bold uppercase tracking-wider px-1 py-0.5" style={{ background: 'rgba(201,168,76,0.15)', color: GOLD }}>
                          {catTriggers} alert{catTriggers !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-2 h-2 flex-shrink-0 mt-1.5" style={{ background: statusColor }} />
                </button>
              );
            })}
          </div>

          {/* RIGHT — Data points panel */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {activeCat ? (
              <>
                {/* Panel header */}
                <div className="flex-shrink-0 px-6 py-4 border-b border-[#E8E4DC] bg-white">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h2 className="text-lg font-bold" style={{ color: NAVY }}>{activeCat.name}</h2>
                        <span className="text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 border" style={{ color: GOLD, borderColor: 'rgba(201,168,76,0.4)' }}>
                          {activeCat.phase === 'external' ? 'External Signal' : 'Internal Signal'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 max-w-2xl">{activeCat.description}</p>
                      {activeCat.recommendedPlaybooks?.length > 0 && (
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <BookOpen className="w-3 h-3 flex-shrink-0" style={{ color: GOLD }} />
                          <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: GOLD }}>Playbooks:</span>
                          {activeCat.recommendedPlaybooks.map(slug => (
                            <span key={slug} className="text-[10px] font-medium" style={{ color: NAVY }}>
                              {slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">All</span>
                        <Switch checked={catAllActive} onCheckedChange={checked => toggleCategory(activeCat.id, checked)} />
                      </div>
                      <Button
                        size="sm"
                        onClick={() => openWizardFor(activeCat.id)}
                        style={{ background: NAVY, color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" />
                        Set Alert Rule
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    {([
                      { key: 'all',        label: 'All Data Points' },
                      { key: 'monitoring', label: 'Monitoring' },
                      { key: 'paused',     label: 'Paused' },
                    ] as { key: DpFilter; label: string }[]).map(f => (
                      <button
                        key={f.key}
                        onClick={() => setDpFilter(f.key)}
                        className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-all"
                        style={{
                          background: dpFilter === f.key ? NAVY : 'transparent',
                          color: dpFilter === f.key ? '#fff' : '#6B7280',
                          border: `1px solid ${dpFilter === f.key ? NAVY : '#E8E4DC'}`,
                        }}
                      >
                        {f.label}
                        {f.key === 'monitoring' && <span className="ml-1.5 text-[9px]">({activeCat.dataPoints.filter(dp => !disabled.includes(dp.id)).length})</span>}
                        {f.key === 'paused'     && <span className="ml-1.5 text-[9px]">({activeCat.dataPoints.filter(dp => disabled.includes(dp.id)).length})</span>}
                      </button>
                    ))}
                    <span className="ml-auto text-[10px] text-gray-400 font-medium">{visibleDps.length} data point{visibleDps.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>

                {/* ── Data point rows ── */}
                <div className="flex-1 overflow-y-auto divide-y divide-[#F0EDE8]">
                  {visibleDps.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                      <Search className="w-8 h-8 mb-3" />
                      <p className="text-sm font-semibold">No data points match your filter</p>
                    </div>
                  ) : (
                    visibleDps.map(dp => {
                      const isEnabled = !disabled.includes(dp.id);
                      const trigger   = triggerByDpId[dp.id];

                      return (
                        <div
                          key={dp.id}
                          className="px-6 py-4 hover:bg-[#FAFAF9] transition-colors group"
                          style={{ opacity: isEnabled ? 1 : 0.55 }}
                        >
                          <div className="flex items-start gap-4">
                            {/* Status dot — gold if alert rule set, teal if monitoring, gray if off */}
                            <div className="w-2 h-2 flex-shrink-0 mt-2"
                              style={{ background: trigger ? GOLD : isEnabled ? TEAL : '#D1D5DB' }} />

                            {/* Main content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                <span className="text-sm font-bold" style={{ color: NAVY }}>{dp.name}</span>
                                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5" style={{ background: 'rgba(201,168,76,0.1)', color: GOLD }}>
                                  {dp.metricType}
                                </span>
                                {trigger && (
                                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 flex items-center gap-1" style={{ background: 'rgba(43,138,110,0.1)', color: TEAL }}>
                                    <Zap className="w-2.5 h-2.5" /> Alert Rule Active
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 leading-relaxed">{dp.description}</p>

                              {/* ── Inline alert rule display or default threshold ── */}
                              {trigger ? (
                                <div className="mt-2 flex items-center gap-3 flex-wrap px-3 py-2 border-l-2" style={{ background: 'rgba(43,138,110,0.04)', borderColor: TEAL }}>
                                  <Zap className="w-3.5 h-3.5 flex-shrink-0" style={{ color: TEAL }} />
                                  <div className="flex-1 min-w-0">
                                    <span className="text-[11px] font-bold" style={{ color: NAVY }}>
                                      Alert fires when: {formatOp(trigger.conditions?.operator, trigger.conditions?.value)}
                                    </span>
                                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5"
                                        style={{ background: `${SEV_COLOR[trigger.severity] ?? GOLD}20`, color: SEV_COLOR[trigger.severity] ?? GOLD }}>
                                        {trigger.severity}
                                      </span>
                                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5"
                                        style={{ background: trigger.isActive ? 'rgba(43,138,110,0.1)' : 'rgba(107,114,128,0.1)', color: trigger.isActive ? TEAL : '#6B7280' }}>
                                        {trigger.isActive ? 'Monitoring' : 'Paused'}
                                      </span>
                                      {trigger.recommendedPlaybooks?.length > 0 && (
                                        <span className="text-[9px] text-gray-400">
                                          Fires → {trigger.recommendedPlaybooks.slice(0,2).map((p: string) => p.replace(/-/g,' ')).join(', ')} playbook{trigger.recommendedPlaybooks.length > 1 ? 's' : ''}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => openWizardFor(activeCat.id, trigger)}
                                    className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 flex-shrink-0 hover:opacity-80 transition-opacity"
                                    style={{ background: NAVY, color: '#fff' }}
                                  >
                                    <Settings className="w-3 h-3" />
                                    Edit Rule
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-3 flex-wrap mt-1">
                                  {dp.defaultThreshold && (
                                    <span className="text-[9px] text-gray-400 flex items-center gap-1">
                                      <AlertTriangle className="w-3 h-3" />
                                      Default: fires when {formatOp(dp.defaultThreshold.operator, dp.defaultThreshold.value, dp.unit)}
                                    </span>
                                  )}
                                  {dp.sources?.slice(0, 3).map(src => (
                                    <span key={src} className="text-[9px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5">{src}</span>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Right actions */}
                            <div className="flex items-center gap-3 flex-shrink-0">
                              {!trigger && isEnabled && (
                                <button
                                  onClick={() => openWizardFor(activeCat.id)}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5"
                                  style={{ background: NAVY, color: '#fff' }}
                                >
                                  <Plus className="w-3 h-3" />
                                  Set Alert
                                </button>
                              )}
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: isEnabled ? TEAL : '#9CA3AF' }}>
                                  {isEnabled ? 'On' : 'Off'}
                                </span>
                                <Switch checked={isEnabled} onCheckedChange={() => toggleDp(dp.id)} />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Panel footer */}
                <div className="flex-shrink-0 px-6 py-3 border-t border-[#E8E4DC] bg-[#F8F7F4] flex items-center justify-between">
                  <p className="text-[10px] text-gray-500">
                    <span className="font-bold" style={{ color: TEAL }}>
                      {activeCat.dataPoints.filter(dp => !disabled.includes(dp.id)).length}
                    </span>
                    <span> of {activeCat.dataPoints.length} data points monitoring · </span>
                    <span className="font-bold" style={{ color: GOLD }}>
                      {triggersPerCategory[activeCat.id] || 0} alert rule{triggersPerCategory[activeCat.id] !== 1 ? 's' : ''}
                    </span>
                    <span> configured</span>
                  </p>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-3.5 h-3.5" style={{ color: TEAL }} />
                    <span className="text-[10px] text-gray-400">Changes saved automatically</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 text-gray-400">
                <Radio className="w-10 h-10 mb-3" />
                <p className="text-sm font-semibold">No categories match your search</p>
              </div>
            )}
          </div>
        </div>

        {/* Alert rule wizard */}
        <TriggerConfigurationWizard
          isOpen={wizardOpen}
          onClose={() => { setWizardOpen(false); setEditingTrigger(null); }}
          onSuccess={() => {
            setWizardOpen(false);
            setEditingTrigger(null);
            queryClient.invalidateQueries({ queryKey: ['/api/executive-triggers'] });
            toast({ title: editingTrigger ? 'Alert rule updated' : 'Alert rule created', description: 'This data point is now being monitored.' });
          }}
          editTrigger={editingTrigger}
        />
      </div>
    </PageLayout>
  );
}
