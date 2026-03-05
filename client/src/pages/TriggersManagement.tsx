import { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import TriggerConfigurationWizard from '@/components/configuration/TriggerConfigurationWizard';
import { SIGNAL_CATEGORIES } from '@shared/intelligence-signals';
import {
  Activity, Clock, Target, Settings,
  Zap, Pause, Plus, Bell, ChevronRight, ChevronLeft,
  Database, BookOpen,
} from 'lucide-react';
import { format } from 'date-fns';

const NAVY = '#0A0F2E';
const GOLD = '#C9A84C';
const TEAL = '#2B8A6E';
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

const SEV_COLOR: Record<string, string> = {
  critical: '#EF4444', high: '#F97316', medium: GOLD, low: '#6B7280',
};

function formatOp(op: string, val?: any): string {
  const v = val !== undefined ? String(val) : '';
  switch (op) {
    case 'gt':    return `rises above ${v}`;
    case 'gte':   return `reaches ≥ ${v}`;
    case 'lt':    return `drops below ${v}`;
    case 'lte':   return `reaches ≤ ${v}`;
    case 'eq':    return `equals ${v}`;
    case 'spike': return `spikes by ${v}%`;
    case 'drop':  return `drops by ${v}%`;
    default:      return op ? `${op} ${v}` : v;
  }
}

// Map trigger category ID → SIGNAL_CATEGORIES entry
function resolveSignalCat(category: string) {
  const c = (category || '').toLowerCase().replace(/-/g, '').replace(/_/g, '');
  return SIGNAL_CATEGORIES.find(sc =>
    sc.id.replace(/-/g, '').replace(/_/g, '') === c
  );
}

// Find a data point by ID across all signal categories
function findDataPoint(dpId: string) {
  for (const cat of SIGNAL_CATEGORIES) {
    const dp = cat.dataPoints.find(d => d.id === dpId);
    if (dp) return { dp, cat };
  }
  return null;
}

export default function TriggersManagement({ embedded }: { embedded?: boolean }) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus]             = useState<'all' | 'triggered' | 'active' | 'paused'>('all');
  const [isWizardOpen, setIsWizardOpen]             = useState(false);
  const [editTriggerData, setEditTriggerData]       = useState<any>(null);
  const [viewTrigger, setViewTrigger]               = useState<any>(null);
  const { toast } = useToast();

  const { data: triggersData, isLoading } = useQuery<any[]>({
    queryKey: ['/api/executive-triggers'],
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      apiRequest('PUT', `/api/executive-triggers/${id}`, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/executive-triggers'] });
      toast({ title: 'Alert rule updated' });
    },
  });

  const allTriggers = (triggersData ?? []).map((t: any) => ({
    ...t,
    status: t.isActive ? (t.alertThreshold === 'red' ? 'triggered' : 'active') : 'paused',
  }));

  const triggeredCount = allTriggers.filter(t => t.status === 'triggered').length;
  const activeCount    = allTriggers.filter(t => t.status === 'active').length;
  const pausedCount    = allTriggers.filter(t => t.status === 'paused').length;

  // Map ALL 20 signal categories → their triggers (resolve by normalised ID match)
  const triggersByCatId: Record<string, any[]> = {};
  for (const sc of SIGNAL_CATEGORIES) triggersByCatId[sc.id] = [];

  for (const t of allTriggers) {
    const sc = resolveSignalCat(t.category || '');
    if (sc) {
      triggersByCatId[sc.id].push(t);
    } else {
      // fallback: stash under raw category key so nothing is lost
      const key = t.category || 'uncategorized';
      if (!triggersByCatId[key]) triggersByCatId[key] = [];
      triggersByCatId[key].push(t);
    }
  }

  // All 20 signal categories, sorted: triggered first → most rules → alphabetical
  const sortedSignalCats = [...SIGNAL_CATEGORIES].sort((a, b) => {
    const aTrigs = triggersByCatId[a.id] ?? [];
    const bTrigs = triggersByCatId[b.id] ?? [];
    const aFired = aTrigs.some(t => t.status === 'triggered');
    const bFired = bTrigs.some(t => t.status === 'triggered');
    if (aFired && !bFired) return -1;
    if (!aFired && bFired) return 1;
    return bTrigs.length - aTrigs.length;
  });

  // Triggers shown in right panel
  const selectedTriggers = selectedCategoryId
    ? (triggersByCatId[selectedCategoryId] ?? []).filter(t =>
        filterStatus === 'all' || t.status === filterStatus
      )
    : [];

  const selectedSignalCat = selectedCategoryId
    ? SIGNAL_CATEGORIES.find(sc => sc.id === selectedCategoryId) ?? null
    : null;

  if (isLoading) {
    return (
      <PageLayout embedded={embedded}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C9A84C]" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout embedded={embedded}>
      <div className="flex flex-col h-full overflow-hidden bg-white">

        {/* ── Header ── */}
        <div className="flex-shrink-0 border-b border-[#E8E4DC] px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div style={{ width: 44, height: 44, background: NAVY, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[8px] font-black uppercase tracking-[0.3em]" style={{ color: GOLD }}>IDEA Framework</span>
                  <ChevronRight className="w-3 h-3" style={{ color: GOLD }} />
                  <span className="text-[8px] font-black uppercase tracking-[0.3em]" style={{ color: TEAL }}>EXECUTE</span>
                </div>
                <h1 style={{ ...CG, fontWeight: 700, fontSize: '1.5rem', color: NAVY, lineHeight: 1 }}>
                  Trigger Alert Management
                </h1>
              </div>
            </div>
            <Button
              style={{ background: NAVY, color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}
              onClick={() => { setEditTriggerData(null); setIsWizardOpen(true); }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Alert Rule
            </Button>
          </div>

          {/* Stats strip */}
          <div className="flex items-center gap-8 mt-5">
            {[
              { label: 'Triggered',       value: triggeredCount,      color: '#EF4444', icon: Bell },
              { label: 'Active',          value: activeCount,         color: TEAL,      icon: Activity },
              { label: 'Paused',          value: pausedCount,         color: '#6B7280', icon: Pause },
              { label: 'Total Rules',     value: allTriggers.length,  color: NAVY,      icon: Target },
              { label: 'Categories',      value: SIGNAL_CATEGORIES.length, color: GOLD,   icon: Database },
            ].map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="flex items-center gap-2">
                  <Icon className="w-4 h-4" style={{ color: s.color }} />
                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-wider text-gray-400">{s.label}</p>
                    <p className="text-base font-black leading-none" style={{ color: s.color }}>{s.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Split layout: Category list + Trigger detail ── */}
        <div className="flex flex-1 min-h-0 overflow-hidden">

          {/* LEFT — Category list */}
          <div className="w-72 flex-shrink-0 border-r border-[#E8E4DC] overflow-y-auto bg-[#F8F7F4]">
            <div className="p-3 border-b border-[#E8E4DC]">
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                {SIGNAL_CATEGORIES.length} signal categories
              </p>
            </div>
            {sortedSignalCats.map(sigCat => {
              const triggers   = triggersByCatId[sigCat.id] ?? [];
              const triggered  = triggers.filter(t => t.status === 'triggered').length;
              const active     = triggers.filter(t => t.status === 'active').length;
              const paused     = triggers.filter(t => t.status === 'paused').length;
              const isSelected = selectedCategoryId === sigCat.id;
              const statusColor = triggered > 0 ? '#EF4444' : triggers.length > 0 ? TEAL : '#D1D5DB';

              return (
                <button
                  key={sigCat.id}
                  onClick={() => setSelectedCategoryId(isSelected ? null : sigCat.id)}
                  className="w-full text-left px-4 py-3.5 flex items-start gap-3 transition-colors border-b border-[#EDE9E3] hover:bg-white"
                  style={{
                    background: isSelected ? '#fff' : 'transparent',
                    borderLeft: isSelected ? `3px solid ${TEAL}` : '3px solid transparent',
                  }}
                >
                  <div className="w-2 h-2 rounded-full flex-shrink-0 mt-2" style={{ background: statusColor }} />

                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-bold leading-tight truncate" style={{ color: isSelected ? NAVY : '#374151' }}>
                      {sigCat.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-[9px] font-bold" style={{ color: triggers.length > 0 ? NAVY : '#9CA3AF' }}>
                        {triggers.length} rule{triggers.length !== 1 ? 's' : ''}
                      </span>
                      <span className="text-[9px] text-gray-400">{sigCat.dataPoints.length} data pts</span>
                      {triggered > 0 && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444' }}>
                          {triggered} fired
                        </span>
                      )}
                      {paused > 0 && (
                        <span className="text-[9px] font-medium px-1.5 py-0.5" style={{ background: 'rgba(107,114,128,0.1)', color: '#6B7280' }}>
                          {paused} paused
                        </span>
                      )}
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5 transition-transform"
                    style={{ color: isSelected ? TEAL : '#D1D5DB', transform: isSelected ? 'rotate(90deg)' : '' }} />
                </button>
              );
            })}
          </div>

          {/* RIGHT — Trigger detail for selected category */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {selectedCategoryId ? (
              <>
                {/* Detail header */}
                <div className="flex-shrink-0 px-6 py-4 border-b border-[#E8E4DC] bg-white">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedCategoryId(null)}
                        className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider hover:opacity-70 transition-opacity md:hidden"
                        style={{ color: NAVY }}
                      >
                        <ChevronLeft className="w-3 h-3" /> Back
                      </button>
                      <div>
                        <h2 className="text-base font-bold capitalize" style={{ color: NAVY }}>
                          {selectedSignalCat?.name ?? selectedCategoryId?.replace(/-/g, ' ')}
                        </h2>
                        {selectedSignalCat?.description && (
                          <p className="text-xs text-gray-500 mt-0.5 max-w-xl">{selectedSignalCat.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Status filter */}
                      {(['all', 'triggered', 'active', 'paused'] as const).map(s => (
                        <button
                          key={s}
                          onClick={() => setFilterStatus(s)}
                          className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-all"
                          style={{
                            background: filterStatus === s ? NAVY : 'transparent',
                            color: filterStatus === s ? '#fff' : '#6B7280',
                            border: `1px solid ${filterStatus === s ? NAVY : '#E8E4DC'}`,
                          }}
                        >
                          {s}
                        </button>
                      ))}
                      <Button
                        size="sm"
                        onClick={() => { setEditTriggerData(null); setIsWizardOpen(true); }}
                        style={{ background: GOLD, color: NAVY, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" /> Add Rule
                      </Button>
                    </div>
                  </div>

                  {/* Data point coverage row */}
                  {selectedSignalCat && (
                    <div className="flex items-center gap-4 mt-3 flex-wrap">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Monitoring:</span>
                      {selectedSignalCat.dataPoints.slice(0, 6).map(dp => (
                        <span key={dp.id} className="text-[9px] font-medium px-1.5 py-0.5 bg-gray-100 text-gray-600">
                          {dp.name}
                        </span>
                      ))}
                      {selectedSignalCat.dataPoints.length > 6 && (
                        <span className="text-[9px] text-gray-400">+{selectedSignalCat.dataPoints.length - 6} more</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Trigger rows */}
                <div className="flex-1 overflow-y-auto divide-y divide-[#F0EDE8]">
                  {selectedTriggers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                      <Zap className="w-8 h-8 mb-3" />
                      <p className="text-sm font-semibold">No rules match this filter</p>
                    </div>
                  ) : (
                    selectedTriggers.map(trigger => {
                      // Find the specific data point this trigger watches
                      const dpId     = trigger.conditions?.dataPointId || trigger.conditions?.field || trigger.conditions?.metric;
                      const dpLookup = dpId ? findDataPoint(dpId) : null;
                      const dp       = dpLookup?.dp;

                      const condition = trigger.conditions
                        ? formatOp(trigger.conditions.operator, trigger.conditions.value)
                        : trigger.description;

                      return (
                        <div
                          key={trigger.id}
                          className="px-6 py-5 hover:bg-[#FAFAF9] transition-colors group"
                          style={{ borderLeft: `3px solid ${trigger.status === 'triggered' ? '#EF4444' : trigger.isActive ? TEAL : '#E5E7EB'}` }}
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex-1 min-w-0">

                              {/* Data point this trigger watches */}
                              {dp ? (
                                <div className="mb-2">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Watching:</span>
                                    <span className="text-[11px] font-bold" style={{ color: NAVY }}>{dp.name}</span>
                                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5" style={{ background: 'rgba(201,168,76,0.1)', color: GOLD }}>
                                      {dp.metricType}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-400 mt-0.5">{dp.description}</p>
                                </div>
                              ) : (
                                <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-1">Alert Rule</p>
                              )}

                              {/* Trigger name + condition */}
                              <p className="text-sm font-bold mb-1" style={{ color: NAVY }}>{trigger.name}</p>

                              {/* Alert condition — the core of the trigger */}
                              <div className="flex items-center gap-2 px-3 py-2 flex-wrap" style={{ background: 'rgba(43,138,110,0.04)', borderLeft: `2px solid ${TEAL}` }}>
                                <Zap className="w-3.5 h-3.5 flex-shrink-0" style={{ color: TEAL }} />
                                <span className="text-[11px] font-bold" style={{ color: NAVY }}>
                                  Fires when: {condition}
                                </span>
                                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5"
                                  style={{ background: `${SEV_COLOR[trigger.severity] ?? GOLD}20`, color: SEV_COLOR[trigger.severity] ?? GOLD }}>
                                  {trigger.severity}
                                </span>
                              </div>

                              {/* Playbook connections + last eval */}
                              <div className="flex items-center gap-4 mt-2 flex-wrap">
                                {trigger.recommendedPlaybooks?.length > 0 && (
                                  <div className="flex items-center gap-1.5">
                                    <BookOpen className="w-3 h-3" style={{ color: GOLD }} />
                                    <span className="text-[9px] text-gray-500">
                                      {trigger.recommendedPlaybooks.slice(0,2).map((p: string) => p.replace(/-/g,' ')).join(', ')} playbook{trigger.recommendedPlaybooks.length > 1 ? 's' : ''}
                                    </span>
                                  </div>
                                )}
                                {trigger.updatedAt && (
                                  <div className="flex items-center gap-1.5">
                                    <Clock className="w-3 h-3 text-gray-400" />
                                    <span className="text-[9px] text-gray-400">
                                      Last eval: {format(new Date(trigger.updatedAt), 'MMM d, h:mm a')}
                                    </span>
                                  </div>
                                )}
                                {dp?.sources?.slice(0,2).map(src => (
                                  <span key={src} className="text-[9px] font-medium bg-gray-100 text-gray-500 px-1.5 py-0.5">{src}</span>
                                ))}
                              </div>
                            </div>

                            {/* Right actions */}
                            <div className="flex items-center gap-3 flex-shrink-0">
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] font-bold uppercase tracking-wider"
                                  style={{ color: trigger.isActive ? TEAL : '#9CA3AF' }}>
                                  {trigger.isActive ? 'Active' : 'Paused'}
                                </span>
                                <Switch
                                  checked={trigger.isActive}
                                  onCheckedChange={(isActive) => toggleMutation.mutate({ id: trigger.id, isActive })}
                                />
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => { setEditTriggerData(trigger); setIsWizardOpen(true); }}
                                style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: NAVY, border: `1px solid #E8E4DC` }}
                              >
                                <Settings className="w-3 h-3 mr-1" />
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setViewTrigger(trigger)}
                                style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: GOLD, border: `1px solid rgba(201,168,76,0.35)` }}
                              >
                                <Database className="w-3 h-3 mr-1" />
                                Full Detail
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Detail footer */}
                <div className="flex-shrink-0 px-6 py-3 border-t border-[#E8E4DC] bg-[#F8F7F4] flex items-center justify-between">
                  <p className="text-[10px] text-gray-500">
                    <span className="font-bold" style={{ color: NAVY }}>
                      {(categoryGroups[selectedCategoryId] ?? []).length}
                    </span>
                    <span> alert rules in this category · </span>
                    <span className="font-bold" style={{ color: TEAL }}>
                      {(categoryGroups[selectedCategoryId] ?? []).filter(t => t.isActive).length} active
                    </span>
                  </p>
                  {selectedSignalCat && (
                    <span className="text-[9px] text-gray-400">
                      {selectedSignalCat.dataPoints.length} data points available to monitor
                    </span>
                  )}
                </div>
              </>
            ) : (
              /* Empty state — no category selected */
              <div className="flex flex-col items-center justify-center flex-1 text-center px-12">
                <div style={{ width: 56, height: 56, background: 'rgba(201,168,76,0.1)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <Zap className="w-7 h-7" style={{ color: GOLD }} />
                </div>
                <h3 style={{ ...CG, fontSize: '1.25rem', fontWeight: 700, color: NAVY, marginBottom: 8 }}>
                  Select a Category
                </h3>
                <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                  Choose a trigger category on the left to see all alert rules and the exact data points they watch.
                </p>
                <div className="flex items-center gap-3 mt-6 flex-wrap justify-center">
                  {sortedSignalCats.slice(0, 4).map(sigCat => {
                    const triggers     = triggersByCatId[sigCat.id] ?? [];
                    const hasTriggered = triggers.some(t => t.status === 'triggered');
                    return (
                      <button
                        key={sigCat.id}
                        onClick={() => setSelectedCategoryId(sigCat.id)}
                        className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider transition-all hover:opacity-80"
                        style={{ background: hasTriggered ? 'rgba(239,68,68,0.08)' : 'rgba(43,138,110,0.08)', color: hasTriggered ? '#EF4444' : TEAL, border: `1px solid ${hasTriggered ? 'rgba(239,68,68,0.2)' : 'rgba(43,138,110,0.2)'}` }}
                      >
                        {sigCat.name} · {triggers.length}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Wizard */}
      <TriggerConfigurationWizard
        isOpen={isWizardOpen}
        onClose={() => { setIsWizardOpen(false); setEditTriggerData(null); }}
        onSuccess={() => {
          setIsWizardOpen(false);
          setEditTriggerData(null);
          queryClient.invalidateQueries({ queryKey: ['/api/executive-triggers'] });
          toast({ title: editTriggerData ? 'Alert rule updated' : 'Alert rule created', description: editTriggerData ? 'Rule has been updated.' : 'New rule is now monitoring.' });
        }}
        editTrigger={editTriggerData}
      />

      {/* Full detail sheet */}
      <Sheet open={!!viewTrigger} onOpenChange={open => { if (!open) setViewTrigger(null); }}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto" style={{ borderLeft: `3px solid ${GOLD}` }}>
          {viewTrigger && (() => {
            const dpId     = viewTrigger.conditions?.dataPointId || viewTrigger.conditions?.field;
            const dpLookup = dpId ? findDataPoint(dpId) : null;
            const dp       = dpLookup?.dp;
            return (
              <>
                <SheetHeader className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div style={{ width: 16, height: 2, background: GOLD }} />
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: GOLD }}>Alert Rule Detail</span>
                  </div>
                  <SheetTitle style={{ ...CG, fontSize: '1.4rem', fontWeight: 700, color: NAVY }}>{viewTrigger.name}</SheetTitle>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <Badge style={{ background: viewTrigger.status === 'triggered' ? '#EF4444' : TEAL, color: '#fff', fontSize: 9 }}>
                      {viewTrigger.status}
                    </Badge>
                    <Badge variant="outline" style={{ fontSize: 9, color: SEV_COLOR[viewTrigger.severity] ?? GOLD }}>
                      {viewTrigger.severity}
                    </Badge>
                  </div>
                </SheetHeader>

                <div className="space-y-6">
                  {/* Data point being watched */}
                  {dp && (
                    <div className="p-4 border border-[#E8E4DC] bg-[#F8F7F4]">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-2">Data Point Being Watched</p>
                      <p className="text-sm font-bold" style={{ color: NAVY }}>{dp.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{dp.description}</p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {dp.sources?.map(src => (
                          <span key={src} className="text-[9px] bg-white border border-[#E8E4DC] px-2 py-0.5 text-gray-500">{src}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Alert condition */}
                  <div className="p-4 border-l-2" style={{ borderColor: TEAL, background: 'rgba(43,138,110,0.04)' }}>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-2">Alert Condition</p>
                    <p className="text-sm font-bold" style={{ color: NAVY }}>
                      Fires when: {formatOp(viewTrigger.conditions?.operator, viewTrigger.conditions?.value)}
                    </p>
                    {viewTrigger.conditions?.operator && (
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        {[
                          { label: 'Operator', value: viewTrigger.conditions.operator },
                          { label: 'Threshold', value: String(viewTrigger.conditions.value ?? '—') },
                          { label: 'Severity', value: viewTrigger.severity },
                          { label: 'Type', value: viewTrigger.triggerType },
                        ].map(item => (
                          <div key={item.label} className="bg-white border border-[#E8E4DC] p-3">
                            <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-1">{item.label}</p>
                            <p className="text-sm font-semibold capitalize" style={{ color: NAVY }}>{item.value}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Playbook response */}
                  {viewTrigger.recommendedPlaybooks?.length > 0 && (
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-2">Fires These Playbooks</p>
                      <div className="space-y-1">
                        {viewTrigger.recommendedPlaybooks.map((p: string) => (
                          <div key={p} className="flex items-center gap-2 px-3 py-2 bg-[#F8F7F4] border border-[#E8E4DC]">
                            <BookOpen className="w-3 h-3" style={{ color: GOLD }} />
                            <span className="text-xs font-semibold capitalize" style={{ color: NAVY }}>
                              {p.replace(/-/g, ' ')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Edit button */}
                  <Button
                    className="w-full"
                    style={{ background: NAVY, color: '#fff', fontWeight: 700 }}
                    onClick={() => { setViewTrigger(null); setEditTriggerData(viewTrigger); setIsWizardOpen(true); }}
                  >
                    <Settings className="w-4 h-4 mr-2" /> Edit This Alert Rule
                  </Button>
                </div>
              </>
            );
          })()}
        </SheetContent>
      </Sheet>
    </PageLayout>
  );
}
