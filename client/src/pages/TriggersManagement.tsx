import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'wouter';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import TriggerConfigurationWizard from '@/components/configuration/TriggerConfigurationWizard';
import { SIGNAL_CATEGORIES } from '@shared/intelligence-signals';
import {
  Activity, Clock, Target, Settings, Zap, Pause, Plus, Bell,
  ChevronRight, ChevronLeft, Database, BookOpen, AlertTriangle,
  TrendingUp, Shield,
} from 'lucide-react';
import { format } from 'date-fns';

const NAVY = '#0A0F2E';
const GOLD = '#C9A84C';
const TEAL = '#2B8A6E';
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

const SEV_COLOR: Record<string, string> = {
  critical: '#EF4444', high: '#F97316', medium: GOLD, low: '#6B7280',
};

const SOURCE_LABELS: Record<string, string> = {
  'news-api': 'News API', 'press-releases': 'Press Releases', 'competitor-monitoring': 'Competitor Monitoring',
  'web-scraping': 'Web Intelligence', 'competitive-intel': 'Competitive Intel', 'uspto': 'USPTO',
  'epo': 'EPO', 'wipo': 'WIPO', 'linkedin': 'LinkedIn', 'indeed': 'Indeed', 'sec-filings': 'SEC Filings',
  'bloomberg': 'Bloomberg', 'semrush': 'SEMrush', 'similarweb': 'SimilarWeb', 'adbeat': 'Adbeat',
  'sprout-social': 'Sprout Social', 'brandwatch': 'Brandwatch', 'regulatory-filings': 'Regulatory Filings',
  'g2': 'G2', 'capterra': 'Capterra', 'crm-salesforce': 'Salesforce CRM', 'crm-hubspot': 'HubSpot CRM',
  'crm': 'CRM', 'pitchbook': 'PitchBook', 'crunchbase': 'Crunchbase', 'capital-iq': 'S&P Capital IQ',
  'hr-systems': 'HR Systems', 'hris': 'HRIS', 'workday': 'Workday', 'glassdoor': 'Glassdoor',
  'greenhouse': 'Greenhouse ATS', 'erp': 'ERP', 'erp-systems': 'ERP Systems', 'sap': 'SAP',
  'federal-register': 'Federal Register', 'ftc': 'FTC', 'fda': 'FDA', 'doj': 'DOJ',
  'congress-api': 'Congress.gov', 'govtrack': 'GovTrack', 'state-agencies': 'State Agencies',
  'fred': 'Fed FRED', 'fed': 'Federal Reserve', 'bis': 'BIS', 'world-bank': 'World Bank',
  'treasury': 'US Treasury', 'bls': 'Bureau of Labor Statistics', 'forex-data': 'Forex Data',
  'earnings-transcripts': 'Earnings Transcripts', 'analyst-reports': 'Analyst Reports',
  'github': 'GitHub', 'github-api': 'GitHub API', 'datadog': 'Datadog', 'aws': 'AWS',
  'aws-cloudwatch': 'AWS CloudWatch', 'azure': 'Azure', 'api-monitoring': 'API Monitoring',
  'threat-intel': 'Threat Intelligence', 'cisa-alerts': 'CISA Alerts', 'darkweb-monitoring': 'Dark Web Monitoring',
  'google-news-api': 'Google News', 'twitter-api': 'X (Twitter)', 'survey-platforms': 'Survey Platforms',
  'supplier-database': 'Supplier Database', 'supplier-monitoring': 'Supplier Monitoring',
  'freight-indices': 'Freight Indices', 'commodity-exchanges': 'Commodity Exchanges',
  'gainsight': 'Gainsight', 'zendesk': 'Zendesk', 'customer-success': 'Customer Success Platform',
  'gartner': 'Gartner', 'forrester': 'Forrester', 'sustainability-platform': 'Sustainability Platform',
  'weather-api': 'Weather API', 'eiu': 'Economist Intelligence Unit',
};

function sourceLabel(src: string): string {
  return SOURCE_LABELS[src] ?? src.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// ── Proximity scoring ────────────────────────────────────────────────────────
// Produces 0–100 score for how close a trigger is to firing
function proximityScore(trigger: any): number {
  const threshold = trigger.alertThreshold ?? 'green';
  const severity  = trigger.severity ?? 'low';

  const base: Record<string, number> = { red: 80, yellow: 48, green: 12 };
  const sev:  Record<string, number> = { critical: 18, high: 11, medium: 5, low: 0 };

  return Math.min(100, (base[threshold] ?? 12) + (sev[severity] ?? 0));
}

function categoryProximity(triggers: any[]): number {
  if (!triggers.length) return 0;
  return Math.max(...triggers.map(proximityScore));
}

function proximityLabel(score: number): { label: string; color: string; bg: string } {
  if (score >= 80) return { label: 'AT RISK',     color: '#EF4444', bg: 'rgba(239,68,68,0.08)' };
  if (score >= 55) return { label: 'APPROACHING', color: '#F97316', bg: 'rgba(249,115,22,0.08)' };
  if (score >= 25) return { label: 'MONITORING',  color: TEAL,      bg: 'rgba(43,138,110,0.08)' };
  if (score > 0)   return { label: 'STABLE',      color: '#6B7280', bg: 'rgba(107,114,128,0.06)' };
  return              { label: 'NO RULES',    color: '#D1D5DB', bg: 'transparent' };
}

function proximityBarColor(score: number): string {
  if (score >= 80) return '#EF4444';
  if (score >= 55) return '#F97316';
  if (score >= 25) return TEAL;
  return '#9CA3AF';
}

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

function resolveSignalCat(category: string) {
  const c = (category || '').toLowerCase().replace(/-/g, '').replace(/_/g, '');
  return SIGNAL_CATEGORIES.find(sc =>
    sc.id.replace(/-/g, '').replace(/_/g, '') === c
  );
}

function findDataPoint(dpId: string) {
  for (const cat of SIGNAL_CATEGORIES) {
    const dp = cat.dataPoints.find(d => d.id === dpId);
    if (dp) return { dp, cat };
  }
  return null;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function TriggersManagement({ embedded }: { embedded?: boolean }) {
  const [location, setLocation] = useLocation();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('category');
  });
  const [isWizardOpen, setIsWizardOpen]             = useState(false);
  const [editTriggerData, setEditTriggerData]       = useState<any>(null);
  const [viewTrigger, setViewTrigger]               = useState<any>(null);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('category');
    if (cat) setSelectedCategoryId(cat);
  }, [location]);

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

  const allTriggers = useMemo(() =>
    (triggersData ?? []).map((t: any) => ({
      ...t,
      status: t.isActive ? (t.alertThreshold === 'red' ? 'triggered' : 'active') : 'paused',
      proximity: proximityScore(t),
    })),
  [triggersData]);

  // Map all 20 signal categories → their triggers
  const triggersByCatId = useMemo(() => {
    const map: Record<string, any[]> = {};
    for (const sc of SIGNAL_CATEGORIES) map[sc.id] = [];
    for (const t of allTriggers) {
      const sc = resolveSignalCat(t.category || '');
      if (sc) map[sc.id].push(t);
    }
    return map;
  }, [allTriggers]);

  // Sort categories: highest proximity first, then by rule count
  const sortedCats = useMemo(() =>
    [...SIGNAL_CATEGORIES]
      .map(sc => ({
        sc,
        triggers: triggersByCatId[sc.id] ?? [],
        proximity: categoryProximity(triggersByCatId[sc.id] ?? []),
      }))
      .sort((a, b) => b.proximity - a.proximity || b.triggers.length - a.triggers.length),
  [triggersByCatId]);

  const atRiskCount    = sortedCats.filter(c => c.proximity >= 80).length;
  const approachingCount = sortedCats.filter(c => c.proximity >= 55 && c.proximity < 80).length;
  const triggeredCount = allTriggers.filter(t => t.status === 'triggered').length;
  const activeCount    = allTriggers.filter(t => t.isActive).length;

  const selectedEntry  = selectedCategoryId ? sortedCats.find(c => c.sc.id === selectedCategoryId) : null;
  const selectedTriggers = useMemo(() =>
    (selectedEntry?.triggers ?? []).slice().sort((a, b) => b.proximity - a.proximity),
  [selectedEntry]);

  if (isLoading) {
    return (
      <PageLayout embedded={embedded}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: GOLD }} />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout embedded={embedded}>
      <div className="flex flex-col h-full overflow-hidden bg-white">

        {/* ── Header ── */}
        <div className="flex-shrink-0 border-b border-[#E8E4DC] bg-white px-8 py-5">
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
                  Trigger Proximity Monitor
                </h1>
                <p className="text-xs text-gray-400 mt-0.5">Categories ranked by how close they are to firing an alert</p>
              </div>
            </div>
            {isAuthenticated && (
              <Button
                style={{ background: NAVY, color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}
                onClick={() => { setEditTriggerData(null); setIsWizardOpen(true); }}
              >
                <Plus className="w-4 h-4 mr-2" /> Add Alert Rule
              </Button>
            )}
          </div>

          {/* Stats strip */}
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-[#F0EDE8]">
            {[
              { label: 'At Risk',      value: atRiskCount,      color: '#EF4444', icon: AlertTriangle, desc: 'categories' },
              { label: 'Approaching',  value: approachingCount, color: '#F97316', icon: TrendingUp,    desc: 'categories' },
              { label: 'Rules Fired',  value: triggeredCount,   color: '#EF4444', icon: Bell,          desc: 'alert rules' },
              { label: 'Rules Active', value: activeCount,      color: TEAL,      icon: Activity,      desc: 'monitoring' },
              { label: 'Total Rules',  value: allTriggers.length, color: NAVY,    icon: Target,        desc: 'configured' },
            ].map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="flex items-center gap-2.5">
                  <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: `${s.color}12` }}>
                    <Icon className="w-4 h-4" style={{ color: s.color }} />
                  </div>
                  <div>
                    <p className="text-base font-black leading-none" style={{ color: s.color }}>{s.value}</p>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">{s.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Split layout ── */}
        <div className="flex flex-1 min-h-0 overflow-hidden">

          {/* LEFT — Category proximity list */}
          <div className="w-72 flex-shrink-0 border-r border-[#E8E4DC] overflow-y-auto bg-[#F8F7F4]">
            <div className="px-4 py-2.5 border-b border-[#E8E4DC] flex items-center justify-between">
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Proximity Rank</p>
              <Shield className="w-3.5 h-3.5 text-gray-300" />
            </div>

            {sortedCats.map(({ sc, triggers, proximity }, idx) => {
              const lbl        = proximityLabel(proximity);
              const barColor   = proximityBarColor(proximity);
              const isSelected = selectedCategoryId === sc.id;
              const hasRules   = triggers.length > 0;

              return (
                <button
                  key={sc.id}
                  onClick={() => hasRules ? setSelectedCategoryId(isSelected ? null : sc.id) : undefined}
                  disabled={!hasRules}
                  className="w-full text-left px-4 py-3 border-b border-[#EDE9E3] transition-colors"
                  style={{
                    background:   isSelected ? '#fff' : 'transparent',
                    borderLeft:   isSelected ? `3px solid ${barColor}` : '3px solid transparent',
                    cursor:       hasRules ? 'pointer' : 'default',
                    opacity:      hasRules ? 1 : 0.45,
                  }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-[9px] font-black text-gray-300" style={{ minWidth: 16 }}>
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <p className="text-[11px] font-bold truncate" style={{ color: isSelected ? NAVY : '#374151' }}>
                        {sc.name}
                      </p>
                    </div>
                    {hasRules && (
                      <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 flex-shrink-0 ml-1"
                        style={{ background: lbl.bg, color: lbl.color }}>
                        {lbl.label}
                      </span>
                    )}
                  </div>

                  {/* Proximity bar */}
                  {hasRules && (
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mb-1.5">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${proximity}%`, background: barColor }}
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-gray-400">
                      {hasRules ? `${triggers.length} rule${triggers.length !== 1 ? 's' : ''} · ${sc.dataPoints.length} data pts` : 'No rules configured'}
                    </span>
                    {hasRules && (
                      <span className="text-[9px] font-bold" style={{ color: barColor }}>
                        {proximity}%
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* RIGHT — Category detail */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {selectedEntry ? (
              <>
                {/* Detail header */}
                <div className="flex-shrink-0 px-6 py-4 border-b border-[#E8E4DC] bg-white">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => setSelectedCategoryId(null)}
                        className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider hover:opacity-70 transition-opacity mt-0.5 md:hidden"
                        style={{ color: NAVY }}
                      >
                        <ChevronLeft className="w-3 h-3" />
                      </button>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h2 className="text-lg font-bold" style={{ color: NAVY }}>{selectedEntry.sc.name}</h2>
                          {(() => {
                            const lbl = proximityLabel(selectedEntry.proximity);
                            return (
                              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-1"
                                style={{ background: lbl.bg, color: lbl.color }}>
                                {lbl.label}
                              </span>
                            );
                          })()}
                        </div>
                        <p className="text-xs text-gray-500 max-w-xl">{selectedEntry.sc.description}</p>

                        {/* Category proximity bar */}
                        <div className="flex items-center gap-3 mt-2">
                          <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${selectedEntry.proximity}%`,
                                background: proximityBarColor(selectedEntry.proximity),
                              }}
                            />
                          </div>
                          <span className="text-[10px] font-black" style={{ color: proximityBarColor(selectedEntry.proximity) }}>
                            {selectedEntry.proximity}% proximity to alert
                          </span>
                        </div>
                      </div>
                    </div>
                    {isAuthenticated && (
                      <Button
                        size="sm"
                        onClick={() => { setEditTriggerData(null); setIsWizardOpen(true); }}
                        style={{ background: GOLD, color: NAVY, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', flexShrink: 0 }}
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" /> Add Rule
                      </Button>
                    )}
                  </div>
                </div>

                {/* Trigger rows — sorted highest proximity first */}
                <div className="flex-1 overflow-y-auto divide-y divide-[#F0EDE8]">
                  {selectedTriggers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                      <Zap className="w-8 h-8 mb-3" />
                      <p className="text-sm font-semibold">No alert rules in this category</p>
                    </div>
                  ) : (
                    selectedTriggers.map(trigger => {
                      const dpId     = trigger.conditions?.dataPointId || trigger.conditions?.field || trigger.conditions?.metric;
                      const dpLookup = dpId ? findDataPoint(dpId) : null;
                      const dp       = dpLookup?.dp;
                      const condition = trigger.conditions
                        ? formatOp(trigger.conditions.operator, trigger.conditions.value)
                        : trigger.description;
                      const lbl      = proximityLabel(trigger.proximity);
                      const barColor = proximityBarColor(trigger.proximity);
                      const preActivate = trigger.proximity >= 55;

                      return (
                        <div
                          key={trigger.id}
                          className="px-6 py-5 hover:bg-[#FAFAF9] transition-colors"
                          style={{ borderLeft: `3px solid ${barColor}` }}
                        >
                          {/* Top row: proximity bar + status + actions */}
                          <div className="flex items-start gap-4">
                            <div className="flex-1 min-w-0">

                              {/* Proximity row */}
                              <div className="flex items-center gap-3 mb-3">
                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden max-w-[180px]">
                                  <div className="h-full rounded-full transition-all"
                                    style={{ width: `${trigger.proximity}%`, background: barColor }} />
                                </div>
                                <span className="text-[10px] font-black" style={{ color: barColor }}>
                                  {trigger.proximity}%
                                </span>
                                <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5"
                                  style={{ background: lbl.bg, color: lbl.color }}>
                                  {lbl.label}
                                </span>
                                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5"
                                  style={{ background: `${SEV_COLOR[trigger.severity] ?? GOLD}18`, color: SEV_COLOR[trigger.severity] ?? GOLD }}>
                                  {trigger.severity}
                                </span>
                              </div>

                              {/* What it watches */}
                              {dp && (
                                <div className="flex items-baseline gap-2 mb-1.5">
                                  <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 flex-shrink-0">Watching:</span>
                                  <span className="text-[12px] font-bold" style={{ color: NAVY }}>{dp.name}</span>
                                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5" style={{ background: 'rgba(201,168,76,0.1)', color: GOLD }}>
                                    {dp.metricType}
                                  </span>
                                </div>
                              )}

                              {/* Rule name */}
                              <p className="text-[11px] font-semibold text-gray-500 mb-2">{trigger.name}</p>

                              {/* Alert condition */}
                              <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-2"
                                style={{ background: `${barColor}0D`, border: `1px solid ${barColor}30` }}>
                                <Zap className="w-3 h-3 flex-shrink-0" style={{ color: barColor }} />
                                <span className="text-[11px] font-bold" style={{ color: NAVY }}>
                                  Fires when {condition}
                                </span>
                              </div>

                              {/* Pre-activate recommendation */}
                              {preActivate && trigger.recommendedPlaybooks?.length > 0 && (
                                <div className="flex items-center gap-2 px-3 py-1.5 mt-1"
                                  style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.25)' }}>
                                  <BookOpen className="w-3 h-3 flex-shrink-0" style={{ color: GOLD }} />
                                  <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: GOLD }}>
                                    Consider pre-activating:
                                  </span>
                                  <span className="text-[9px] text-gray-600">
                                    {trigger.recommendedPlaybooks.slice(0, 2).map((p: string) =>
                                      p.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())
                                    ).join(' · ')}
                                  </span>
                                </div>
                              )}

                              {/* Monitored from — data sources */}
                              {dp?.sources?.length > 0 && (
                                <div className="mt-2">
                                  <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mr-2">Monitored via:</span>
                                  <span className="inline-flex flex-wrap gap-1">
                                    {dp.sources.map((src: string) => (
                                      <span key={src} className="text-[9px] font-semibold px-2 py-0.5"
                                        style={{ background: 'rgba(43,138,110,0.08)', color: TEAL, border: '1px solid rgba(43,138,110,0.2)' }}>
                                        {sourceLabel(src)}
                                      </span>
                                    ))}
                                  </span>
                                </div>
                              )}
                              {/* Meta row */}
                              <div className="flex items-center gap-4 mt-2">
                                {trigger.updatedAt && (
                                  <div className="flex items-center gap-1 text-[9px] text-gray-400">
                                    <Clock className="w-3 h-3" />
                                    {format(new Date(trigger.updatedAt), 'MMM d')}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Right: toggle + edit + activate */}
                            <div className="flex flex-col items-end gap-2 flex-shrink-0">
                              {isAuthenticated && (
                                <div className="flex items-center gap-2">
                                  <span className="text-[9px] font-bold uppercase tracking-wider"
                                    style={{ color: trigger.isActive ? TEAL : '#9CA3AF' }}>
                                    {trigger.isActive ? 'On' : 'Off'}
                                  </span>
                                  <Switch
                                    checked={trigger.isActive}
                                    onCheckedChange={(isActive) => toggleMutation.mutate({ id: trigger.id, isActive })}
                                  />
                                </div>
                              )}
                              {isAuthenticated ? (
                                <button
                                  onClick={() => {
                                    const rec = trigger.recommendedPlaybooks?.[0];
                                    const searchTerm = rec
                                      ? rec.replace(/-/g, ' ')
                                      : trigger.name || '';
                                    setLocation(`/identify/playbook-library?search=${encodeURIComponent(searchTerm)}`);
                                  }}
                                  className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 hover:opacity-80 transition-opacity"
                                  style={{ background: GOLD, color: NAVY }}
                                >
                                  <BookOpen className="w-3 h-3" /> Activate Playbook
                                </button>
                              ) : (
                                <button
                                  onClick={() => setLocation('/get-started')}
                                  className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 hover:opacity-80 transition-opacity"
                                  style={{ background: '#E8E4DC', color: '#9CA3AF', cursor: 'pointer' }}
                                  title="Sign in to activate playbooks"
                                >
                                  <BookOpen className="w-3 h-3" /> Sign In to Activate
                                </button>
                              )}
                              {isAuthenticated && (
                                <button
                                  onClick={() => { setEditTriggerData(trigger); setIsWizardOpen(true); }}
                                  className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 hover:opacity-80 transition-opacity"
                                  style={{ background: NAVY, color: '#fff' }}
                                >
                                  <Settings className="w-3 h-3" /> Edit
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 px-6 py-4 border-t border-[#E8E4DC] bg-[#F8F7F4] flex items-center justify-between gap-4">
                  <p className="text-[10px] text-gray-500">
                    <span className="font-bold" style={{ color: NAVY }}>
                      {selectedEntry.triggers.length}
                    </span>
                    <span> rules · </span>
                    <span className="font-bold" style={{ color: TEAL }}>
                      {selectedEntry.triggers.filter(t => t.isActive).length} active
                    </span>
                    <span> · highest proximity </span>
                    <span className="font-bold" style={{ color: proximityBarColor(selectedEntry.proximity) }}>
                      {selectedEntry.proximity}%
                    </span>
                  </p>
                  {isAuthenticated ? (
                    <button
                      onClick={() => setLocation('/identify/playbook-library')}
                      className="flex items-center gap-2 px-4 py-2 font-bold uppercase tracking-wider text-[10px] hover:opacity-90 transition-opacity flex-shrink-0"
                      style={{ background: GOLD, color: NAVY }}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      Activate a Playbook for This Trigger
                    </button>
                  ) : (
                    <button
                      onClick={() => setLocation('/get-started')}
                      className="flex items-center gap-2 px-4 py-2 font-bold uppercase tracking-wider text-[10px] hover:opacity-90 transition-opacity flex-shrink-0"
                      style={{ background: '#E8E4DC', color: '#9CA3AF' }}
                      title="Sign in to activate playbooks"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      Sign In to Activate Playbooks
                    </button>
                  )}
                  <span className="text-[9px] text-gray-400 hidden">
                    {selectedEntry.sc.dataPoints.length} data points available in this category
                  </span>
                </div>
              </>
            ) : (
              /* ── Empty state: overview of top at-risk categories ── */
              <div className="flex-1 overflow-y-auto p-8">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-1">
                    <div style={{ width: 20, height: 2, background: GOLD }} />
                    <span className="text-[9px] font-black uppercase tracking-[0.25em]" style={{ color: GOLD }}>
                      Proximity Overview
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Select a category on the left to drill into its alert rules. Below are your highest-proximity categories.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sortedCats.filter(c => c.triggers.length > 0).slice(0, 6).map(({ sc, triggers, proximity }) => {
                    const lbl      = proximityLabel(proximity);
                    const barColor = proximityBarColor(proximity);
                    const topTrigger = triggers[0];
                    const preActivate = proximity >= 55 && topTrigger?.recommendedPlaybooks?.length > 0;

                    return (
                      <button
                        key={sc.id}
                        onClick={() => setSelectedCategoryId(sc.id)}
                        className="text-left p-5 border hover:shadow-md transition-all group"
                        style={{
                          borderColor: proximity >= 55 ? `${barColor}40` : '#E8E4DC',
                          background: proximity >= 55 ? `${barColor}05` : '#fff',
                        }}
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="text-sm font-bold" style={{ color: NAVY }}>{sc.name}</p>
                            <p className="text-[9px] text-gray-400 mt-0.5">
                              {triggers.length} rule{triggers.length !== 1 ? 's' : ''} · {sc.dataPoints.length} data pts
                            </p>
                          </div>
                          <span className="text-[8px] font-black uppercase tracking-wider px-2 py-1"
                            style={{ background: lbl.bg, color: lbl.color }}>
                            {lbl.label}
                          </span>
                        </div>

                        {/* Proximity bar */}
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                          <div className="h-full rounded-full transition-all"
                            style={{ width: `${proximity}%`, background: barColor }} />
                        </div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[9px] text-gray-400">0%</span>
                          <span className="text-[10px] font-black" style={{ color: barColor }}>{proximity}% proximity</span>
                          <span className="text-[9px] text-gray-400">100%</span>
                        </div>

                        {/* Top trigger preview */}
                        {topTrigger && (
                          <div className="text-[10px] text-gray-500 border-t border-[#F0EDE8] pt-2.5">
                            <span className="font-bold" style={{ color: NAVY }}>Highest risk: </span>
                            {topTrigger.name}
                          </div>
                        )}

                        {/* Pre-activate nudge */}
                        {preActivate && (
                          <div className="mt-2 flex items-center gap-1.5 text-[9px]" style={{ color: GOLD }}>
                            <BookOpen className="w-3 h-3" />
                            <span className="font-bold">Playbook pre-activation recommended</span>
                          </div>
                        )}

                        <div className="flex items-center justify-end mt-2">
                          <span className="text-[9px] font-bold uppercase tracking-wider group-hover:gap-2 transition-all flex items-center gap-1"
                            style={{ color: barColor }}>
                            Drill in <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
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
          toast({
            title: editTriggerData ? 'Alert rule updated' : 'Alert rule created',
            description: editTriggerData ? 'Rule has been updated.' : 'New rule is now monitoring.',
          });
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
                </SheetHeader>
                <div className="space-y-4">
                  {dp && (
                    <div className="p-4 border border-[#E8E4DC] bg-[#F8F7F4] space-y-3">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-1">Watching</p>
                        <p className="text-sm font-bold" style={{ color: NAVY }}>{dp.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{dp.description}</p>
                      </div>
                      {dp.sources?.length > 0 && (
                        <div className="pt-3 border-t border-[#E8E4DC]">
                          <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-2">Monitored From</p>
                          <div className="flex flex-wrap gap-1.5">
                            {dp.sources.map((src: string) => (
                              <span key={src} className="text-[10px] font-semibold px-2.5 py-1"
                                style={{ background: 'rgba(43,138,110,0.08)', color: TEAL, border: '1px solid rgba(43,138,110,0.25)' }}>
                                {sourceLabel(src)}
                              </span>
                            ))}
                          </div>
                          <p className="text-[9px] text-gray-400 mt-2">{dp.sources.length} data {dp.sources.length === 1 ? 'source' : 'sources'} feeding this signal</p>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="p-4" style={{ borderLeft: `2px solid ${TEAL}`, background: 'rgba(43,138,110,0.04)' }}>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-1">Alert Condition</p>
                    <p className="text-sm font-bold" style={{ color: NAVY }}>
                      Fires when {formatOp(viewTrigger.conditions?.operator, viewTrigger.conditions?.value)}
                    </p>
                  </div>
                  {isAuthenticated && (
                    <Button className="w-full" style={{ background: NAVY, color: '#fff', fontWeight: 700 }}
                      onClick={() => { setViewTrigger(null); setEditTriggerData(viewTrigger); setIsWizardOpen(true); }}>
                      <Settings className="w-4 h-4 mr-2" /> Edit This Rule
                    </Button>
                  )}
                </div>
              </>
            );
          })()}
        </SheetContent>
      </Sheet>
    </PageLayout>
  );
}
