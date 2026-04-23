import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'wouter';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import TriggerConfigurationWizard from '@/components/configuration/TriggerConfigurationWizard';
import { SIGNAL_CATEGORIES } from '@shared/intelligence-signals';
import {
  Activity, Clock, Target, Settings, Zap, Plus, Bell,
  ChevronRight, BookOpen, AlertTriangle, TrendingUp, Shield,
  Radio, Database, Layers, CheckCircle2, ArrowRight, Info,
} from 'lucide-react';
import { format } from 'date-fns';

const NAVY  = '#0A0F2E';
const GOLD  = '#C9A84C';
const TEAL  = '#2B8A6E';
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

// ── Category → domain mapping (for Readiness Protocol routing) ─────────────────────────
const TRIGGER_CATEGORY_TO_DOMAIN: Record<string, string> = {
  behavior: 'gtm', competitive: 'competitive', customer: 'gtm',
  cyber: 'crisis', economic: 'financial', esg: 'regulatory',
  execution: 'gtm', financial: 'financial', geopolitical: 'strategic',
  innovation: 'technology', market: 'competitive', media: 'technology',
  partnership: 'ma', regulatory: 'regulatory', supplychain: 'gtm',
  talent: 'talent', technology: 'crisis',
};

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

// ── Proximity scoring ─────────────────────────────────────────────────────────
function proximityScore(trigger: any): number {
  const base: Record<string, number> = { red: 80, yellow: 48, green: 12 };
  const sev:  Record<string, number> = { critical: 18, high: 11, medium: 5, low: 0 };
  return Math.min(100, (base[trigger.alertThreshold ?? 'green'] ?? 12) + (sev[trigger.severity ?? 'low'] ?? 0));
}
function categoryProximity(triggers: any[]): number {
  return triggers.length ? Math.max(...triggers.map(proximityScore)) : 0;
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
  const c = (category || '').toLowerCase().replace(/[-_]/g, '');
  return SIGNAL_CATEGORIES.find(sc => sc.id.replace(/[-_]/g, '') === c);
}
function findDataPoint(dpId: string) {
  for (const cat of SIGNAL_CATEGORIES) {
    const dp = cat.dataPoints.find(d => d.id === dpId);
    if (dp) return { dp, cat };
  }
  return null;
}

// ── Threshold level config ─────────────────────────────────────────────────────
const THRESHOLD_CONFIG: Record<string, { label: string; color: string; desc: string }> = {
  red:    { label: 'Critical Alert', color: '#EF4444', desc: 'Immediate action required — highest urgency' },
  yellow: { label: 'High Alert',     color: '#F97316', desc: 'Elevated concern — executive attention needed' },
  green:  { label: 'Watch Alert',    color: TEAL,      desc: 'Early signal — monitor closely for escalation' },
};

// ─────────────────────────────────────────────────────────────────────────────
export default function TriggersManagement({ embedded }: { embedded?: boolean }) {
  const [location, setLocation] = useLocation();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('category');
  });
  const [selectedTriggerId, setSelectedTriggerId] = useState<string | null>(null);
  const [isWizardOpen, setIsWizardOpen]           = useState(false);
  const [editTriggerData, setEditTriggerData]     = useState<any>(null);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('category');
    if (cat) setSelectedCategoryId(cat);
  }, [location]);

  // Clear trigger selection when category changes
  useEffect(() => { setSelectedTriggerId(null); }, [selectedCategoryId]);

  const { data: triggersData, isLoading } = useQuery<any[]>({
    queryKey: ['/api/executive-triggers'],
  });

  const { data: situationIntents = [] } = useQuery<any[]>({
    queryKey: ['/api/situation-intents'],
    enabled: isAuthenticated,
  });
  const configuredIntentIds = new Set((situationIntents as any[]).map((i: any) => i.triggerId));

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

  const triggersByCatId = useMemo(() => {
    const map: Record<string, any[]> = {};
    for (const sc of SIGNAL_CATEGORIES) map[sc.id] = [];
    for (const t of allTriggers) {
      const sc = resolveSignalCat(t.category || '');
      if (sc) map[sc.id].push(t);
    }
    return map;
  }, [allTriggers]);

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
  const activeCount    = allTriggers.filter(t => t.isActive).length;

  const selectedEntry    = selectedCategoryId ? sortedCats.find(c => c.sc.id === selectedCategoryId) : null;
  const selectedTriggers = useMemo(() =>
    (selectedEntry?.triggers ?? []).slice().sort((a, b) => b.proximity - a.proximity),
  [selectedEntry]);
  const selectedTrigger  = selectedTriggerId
    ? selectedTriggers.find(t => t.id === selectedTriggerId) ?? null
    : null;

  // Resolve the data point for the selected trigger
  const selectedDpId  = selectedTrigger?.conditions?.dataPointId
    || selectedTrigger?.conditions?.field
    || selectedTrigger?.conditions?.metric;
  const selectedDpRes = selectedDpId ? findDataPoint(selectedDpId) : null;
  const selectedDp    = selectedDpRes?.dp ?? null;

  if (isLoading) {
    return (
      <PageLayout embedded={embedded}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin h-8 w-8 border-b-2" style={{ borderColor: GOLD }} />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout embedded={embedded}>
      <div className="flex flex-col h-full overflow-hidden bg-white">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex-shrink-0 border-b border-[#E8E4DC] bg-white px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div style={{ width: 44, height: 44, background: NAVY, borderRadius: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                <p className="text-xs text-gray-400 mt-0.5">
                  Category → Trigger → Data Points · Select any trigger to see every data point behind it
                </p>
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
              { label: 'At Risk',       value: atRiskCount,       color: '#EF4444', icon: AlertTriangle, desc: 'categories' },
              { label: 'Approaching',   value: approachingCount,  color: '#F97316', icon: TrendingUp,    desc: 'categories' },
              { label: 'Rules Active',  value: activeCount,       color: TEAL,      icon: Activity,      desc: 'monitoring' },
              { label: 'Total Rules',   value: allTriggers.length, color: NAVY,     icon: Target,        desc: 'configured' },
            ].map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="flex items-center gap-2.5">
                  <div className="w-8 h-8 flex items-center justify-center" style={{ background: `${s.color}12` }}>
                    <Icon className="w-4 h-4" style={{ color: s.color }} />
                  </div>
                  <div>
                    <p className="text-base font-black leading-none" style={{ color: s.color }}>{s.value}</p>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">{s.label}</p>
                  </div>
                </div>
              );
            })}

            {/* Breadcrumb trail */}
            {(selectedEntry || selectedTrigger) && (
              <div className="ml-auto flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                <button onClick={() => { setSelectedCategoryId(null); setSelectedTriggerId(null); }}
                  className="hover:text-navy transition-colors" style={{ color: GOLD }}>
                  All Categories
                </button>
                {selectedEntry && (
                  <>
                    <ChevronRight className="w-3 h-3" />
                    <button onClick={() => setSelectedTriggerId(null)}
                      className="hover:opacity-70 transition-opacity" style={{ color: selectedTrigger ? '#6B7280' : NAVY }}>
                      {selectedEntry.sc.name}
                    </button>
                  </>
                )}
                {selectedTrigger && (
                  <>
                    <ChevronRight className="w-3 h-3" />
                    <span style={{ color: NAVY }}>{selectedTrigger.name}</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Three-pane body ─────────────────────────────────────────────── */}
        <div className="flex flex-1 min-h-0 overflow-hidden">

          {/* ═══ PANE 1: Category list ══════════════════════════════════════ */}
          <div className="w-60 flex-shrink-0 border-r border-[#E8E4DC] overflow-y-auto bg-[#F8F7F4]">
            <div className="px-4 py-2.5 border-b border-[#E8E4DC]">
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Proximity Rank</p>
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
                  className="w-full text-left px-3 py-3 border-b border-[#EDE9E3] transition-all"
                  style={{
                    background:  isSelected ? '#fff' : 'transparent',
                    borderLeft:  isSelected ? `3px solid ${barColor}` : '3px solid transparent',
                    cursor:      hasRules ? 'pointer' : 'default',
                    opacity:     hasRules ? 1 : 0.4,
                  }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-[8px] font-black text-gray-300" style={{ minWidth: 14 }}>
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <p className="text-[11px] font-bold truncate" style={{ color: isSelected ? NAVY : '#374151' }}>
                        {sc.name}
                      </p>
                    </div>
                    {hasRules && (
                      <span className="text-[7px] font-black uppercase tracking-wider px-1.5 py-0.5 flex-shrink-0 ml-1 rounded"
                        style={{ background: lbl.bg, color: lbl.color }}>
                        {lbl.label}
                      </span>
                    )}
                  </div>
                  {hasRules && (
                    <div className="w-full h-1 bg-gray-200 overflow-hidden mb-1.5">
                      <div className="h-full" style={{ width: `${proximity}%`, background: barColor }} />
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-gray-400">
                      {hasRules
                        ? `${triggers.length} rule${triggers.length !== 1 ? 's' : ''}`
                        : 'No rules'}
                    </span>
                    {hasRules && (
                      <span className="text-[9px] font-bold" style={{ color: barColor }}>{proximity}%</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* ═══ PANE 2: Trigger list ═══════════════════════════════════════ */}
          <div className="w-80 flex-shrink-0 border-r border-[#E8E4DC] flex flex-col overflow-hidden"
            style={{ background: selectedEntry ? '#fff' : '#FAFAF9' }}>

            {selectedEntry ? (
              <>
                {/* Category header */}
                <div className="flex-shrink-0 px-5 py-4 border-b border-[#E8E4DC]"
                  style={{ background: '#F8F7F4' }}>
                  <div className="flex items-center gap-2 mb-1">
                    {(() => {
                      const lbl = proximityLabel(selectedEntry.proximity);
                      return (
                        <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded"
                          style={{ background: lbl.bg, color: lbl.color }}>{lbl.label}</span>
                      );
                    })()}
                    <span className="text-[9px] font-bold text-gray-400">
                      {selectedEntry.proximity}% proximity
                    </span>
                  </div>
                  <h2 className="text-sm font-bold mb-0.5" style={{ color: NAVY }}>{selectedEntry.sc.name}</h2>
                  <p className="text-[10px] text-gray-400 leading-snug">{selectedEntry.sc.description}</p>
                  <div className="w-full h-1.5 bg-gray-200 overflow-hidden mt-2">
                    <div className="h-full"
                      style={{ width: `${selectedEntry.proximity}%`, background: proximityBarColor(selectedEntry.proximity) }} />
                  </div>
                </div>

                {/* Trigger list */}
                <div className="flex-1 overflow-y-auto">
                  {selectedTriggers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400 px-6 text-center">
                      <Zap className="w-7 h-7 mb-3" />
                      <p className="text-sm font-semibold mb-1">No rules in this category</p>
                      <p className="text-xs">Configure your first trigger for {selectedEntry.sc.name}.</p>
                    </div>
                  ) : (
                    selectedTriggers.map(trigger => {
                      const isActive   = selectedTriggerId === trigger.id;
                      const barColor   = proximityBarColor(trigger.proximity);
                      const lbl        = proximityLabel(trigger.proximity);
                      const sevColor   = SEV_COLOR[trigger.severity] ?? GOLD;
                      const dpId       = trigger.conditions?.dataPointId || trigger.conditions?.field || trigger.conditions?.metric;
                      const dpRes      = dpId ? findDataPoint(dpId) : null;
                      const dp         = dpRes?.dp ?? null;

                      return (
                        <button
                          key={trigger.id}
                          onClick={() => setSelectedTriggerId(isActive ? null : trigger.id)}
                          className="w-full text-left px-4 py-4 border-b border-[#F0EDE8] transition-all hover:bg-[#FAFAF9]"
                          style={{
                            background:  isActive ? `${barColor}06` : 'transparent',
                            borderLeft:  isActive ? `3px solid ${barColor}` : '3px solid transparent',
                          }}
                        >
                          {/* Trigger name */}
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <p className="text-[12px] font-bold leading-snug" style={{ color: NAVY }}>
                              {trigger.name}
                            </p>
                            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"
                              style={{ color: isActive ? barColor : '#D1D5DB', transform: isActive ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }} />
                          </div>

                          {/* Data point being watched */}
                          {dp && (
                            <div className="flex items-center gap-1.5 mb-2">
                              <Database className="w-3 h-3 flex-shrink-0" style={{ color: GOLD }} />
                              <span className="text-[10px] font-semibold" style={{ color: '#555' }}>{dp.name}</span>
                            </div>
                          )}

                          {/* Status row */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded"
                              style={{ background: lbl.bg, color: lbl.color }}>{lbl.label}</span>
                            <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded"
                              style={{ background: `${sevColor}15`, color: sevColor }}>{trigger.severity}</span>
                            <span className="text-[9px] font-bold ml-auto" style={{ color: barColor }}>
                              {trigger.proximity}%
                            </span>
                          </div>

                          {/* Proximity micro bar */}
                          <div className="w-full h-0.5 bg-gray-100 mt-2">
                            <div className="h-full" style={{ width: `${trigger.proximity}%`, background: barColor }} />
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>

                {/* Pane 2 footer */}
                <div className="flex-shrink-0 px-4 py-3 border-t border-[#E8E4DC] bg-[#F8F7F4] flex items-center justify-between">
                  <span className="text-[9px] text-gray-400">
                    <span className="font-bold" style={{ color: NAVY }}>{selectedEntry.triggers.length}</span> rules ·{' '}
                    <span className="font-bold" style={{ color: TEAL }}>{selectedEntry.triggers.filter(t => t.isActive).length} active</span>
                  </span>
                  {isAuthenticated && (
                    <button
                      onClick={() => { setEditTriggerData(null); setIsWizardOpen(true); }}
                      className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider hover:opacity-70 transition-opacity"
                      style={{ color: NAVY }}
                    >
                      <Plus className="w-3 h-3" /> Add Rule
                    </button>
                  )}
                </div>
              </>
            ) : (
              /* No category selected */
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400">
                <Layers className="w-10 h-10 mb-4" style={{ color: '#D1D5DB' }} />
                <p className="text-sm font-semibold mb-2" style={{ color: NAVY }}>Select a Category</p>
                <p className="text-xs leading-relaxed">Choose a category from the left to see its configured alert rules.</p>
              </div>
            )}
          </div>

          {/* ═══ PANE 3: Full data detail ═══════════════════════════════════ */}
          <div className="flex-1 flex flex-col overflow-hidden bg-white">
            {selectedTrigger ? (
              /* ── Trigger detail ───────────────────────────────────────────── */
              <>
                {/* Detail header */}
                <div className="flex-shrink-0 px-8 py-5 border-b border-[#E8E4DC]"
                  style={{ background: NAVY }}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div style={{ width: 6, height: 6, borderRadius: 0, background: proximityBarColor(selectedTrigger.proximity) }} className="animate-pulse flex-shrink-0" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: GOLD }}>Alert Rule · Data Evidence</span>
                      </div>
                      <h2 style={{ ...CG, fontSize: '1.35rem', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.2, marginBottom: 8 }}>
                        {selectedTrigger.name}
                      </h2>
                      {selectedTrigger.description && (
                        <p className="text-sm text-white/50 leading-relaxed mb-3">{selectedTrigger.description}</p>
                      )}
                      {/* Proximity bar in header */}
                      <div className="flex items-center gap-3">
                        <div className="w-40 h-2 overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                          <div className="h-full"
                            style={{ width: `${selectedTrigger.proximity}%`, background: proximityBarColor(selectedTrigger.proximity) }} />
                        </div>
                        <span className="text-[11px] font-black" style={{ color: proximityBarColor(selectedTrigger.proximity) }}>
                          {selectedTrigger.proximity}% proximity to alert
                        </span>
                        <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded"
                          style={{ background: `${SEV_COLOR[selectedTrigger.severity] ?? GOLD}25`, color: SEV_COLOR[selectedTrigger.severity] ?? GOLD }}>
                          {selectedTrigger.severity}
                        </span>
                      </div>
                    </div>
                    {/* Toggle */}
                    {isAuthenticated && (
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[9px] font-bold" style={{ color: selectedTrigger.isActive ? '#4ade80' : 'rgba(255,255,255,0.3)' }}>
                          {selectedTrigger.isActive ? 'Active' : 'Paused'}
                        </span>
                        <Switch
                          checked={selectedTrigger.isActive}
                          onCheckedChange={(isActive) => toggleMutation.mutate({ id: selectedTrigger.id, isActive })}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Detail body — scrollable */}
                <div className="flex-1 overflow-y-auto">
                  <div className="p-8 space-y-8 max-w-3xl">

                    {/* ── SECTION 1: Data Point ──────────────────────────────── */}
                    <section>
                      <div className="flex items-center gap-2 mb-4">
                        <Database className="w-4 h-4" style={{ color: GOLD }} />
                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: NAVY }}>
                          Data Point Being Monitored
                        </h3>
                        <div className="flex-1 h-px" style={{ background: '#E8E4DC' }} />
                      </div>

                      {selectedDp ? (
                        <div className="border border-[#E8E4DC] overflow-hidden">
                          {/* Data point name + type */}
                          <div className="px-6 py-4" style={{ background: '#F8F7F4' }}>
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <p className="text-base font-bold mb-1" style={{ color: NAVY }}>{selectedDp.name}</p>
                                <p className="text-sm text-gray-500 leading-relaxed">{selectedDp.description}</p>
                              </div>
                              <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 flex-shrink-0 rounded"
                                style={{ background: `${GOLD}15`, color: GOLD, border: `1px solid ${GOLD}30` }}>
                                {selectedDp.metricType}
                              </span>
                            </div>
                          </div>

                          {/* Default threshold reference */}
                          {(selectedDp as any).defaultThreshold && (
                            <div className="px-6 py-3 border-t border-[#E8E4DC]" style={{ background: '#fff' }}>
                              <div className="flex items-center gap-2">
                                <Info className="w-3.5 h-3.5 flex-shrink-0" style={{ color: TEAL }} />
                                <span className="text-[10px] text-gray-500">
                                  Default threshold: fires when value{' '}
                                  <strong style={{ color: NAVY }}>
                                    {formatOp((selectedDp as any).defaultThreshold.operator, (selectedDp as any).defaultThreshold.value)}
                                  </strong>{' '}
                                  · urgency: <strong style={{ color: SEV_COLOR[(selectedDp as any).defaultThreshold.urgency] ?? GOLD }}>
                                    {(selectedDp as any).defaultThreshold.urgency}
                                  </strong>
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="px-5 py-4 border border-[#E8E4DC] text-sm text-gray-400">
                          No data point linked to this rule. Use <strong>Edit</strong> to configure one.
                        </div>
                      )}
                    </section>

                    {/* ── SECTION 2: Alert Condition ─────────────────────────── */}
                    <section>
                      <div className="flex items-center gap-2 mb-4">
                        <Zap className="w-4 h-4" style={{ color: TEAL }} />
                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: NAVY }}>
                          Alert Condition — When This Rule Fires
                        </h3>
                        <div className="flex-1 h-px" style={{ background: '#E8E4DC' }} />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {/* Condition */}
                        <div className="border border-[#E8E4DC] p-5">
                          <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-2">Fires When</p>
                          <div className="flex items-center gap-2 px-3 py-2.5 rounded"
                            style={{ background: `${proximityBarColor(selectedTrigger.proximity)}0D`, border: `1px solid ${proximityBarColor(selectedTrigger.proximity)}30` }}>
                            <Zap className="w-3.5 h-3.5 flex-shrink-0" style={{ color: proximityBarColor(selectedTrigger.proximity) }} />
                            <span className="text-sm font-bold" style={{ color: NAVY }}>
                              {selectedTrigger.conditions
                                ? formatOp(selectedTrigger.conditions.operator, selectedTrigger.conditions.value)
                                : selectedTrigger.description || 'Condition not configured'}
                            </span>
                          </div>
                        </div>

                        {/* Alert level */}
                        <div className="border border-[#E8E4DC] p-5">
                          <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-2">Alert Level</p>
                          {(() => {
                            const th = THRESHOLD_CONFIG[selectedTrigger.alertThreshold] ?? THRESHOLD_CONFIG.yellow;
                            return (
                              <div>
                                <div className="flex items-center gap-2 mb-1.5">
                                  <div style={{ width: 10, height: 10, borderRadius: 0, background: th.color, flexShrink: 0 }} />
                                  <span className="text-sm font-bold" style={{ color: th.color }}>{th.label}</span>
                                </div>
                                <p className="text-[10px] text-gray-400 leading-snug">{th.desc}</p>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    </section>

                    {/* ── SECTION 3: Data Sources ────────────────────────────── */}
                    {selectedDp?.sources && selectedDp.sources.length > 0 && (
                      <section>
                        <div className="flex items-center gap-2 mb-4">
                          <Radio className="w-4 h-4" style={{ color: TEAL }} />
                          <h3 className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: NAVY }}>
                            Data Sources Feeding This Signal
                          </h3>
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded" style={{ background: `${TEAL}12`, color: TEAL }}>
                            {selectedDp.sources.length} sources
                          </span>
                          <div className="flex-1 h-px" style={{ background: '#E8E4DC' }} />
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                          {selectedDp.sources.map((src: string, i: number) => (
                            <div key={src}
                              className="flex items-center gap-3 px-4 py-3 border border-[#E8E4DC]"
                              style={{ background: '#F8F7F4' }}>
                              <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
                                style={{ background: `${TEAL}15` }}>
                                <span className="text-[8px] font-black" style={{ color: TEAL }}>{i + 1}</span>
                              </div>
                              <div className="min-w-0">
                                <p className="text-[11px] font-bold truncate" style={{ color: NAVY }}>{sourceLabel(src)}</p>
                                <p className="text-[9px] text-gray-400 font-mono">{src}</p>
                              </div>
                              <div className="w-1.5 h-1.5 flex-shrink-0 ml-auto animate-pulse"
                                style={{ background: TEAL }} />
                            </div>
                          ))}
                        </div>

                        <p className="text-[10px] text-gray-400 mt-3 flex items-center gap-1.5">
                          <Radio className="w-3 h-3" />
                          All {selectedDp.sources.length} sources are continuously monitored — data refreshes every scan cycle
                        </p>
                      </section>
                    )}

                    {/* ── SECTION 4: Linked Readiness Protocols ────────────────────────── */}
                    {selectedTrigger.linkedPlaybooks?.length > 0 && (
                      <section>
                        <div className="flex items-center gap-2 mb-4">
                          <BookOpen className="w-4 h-4" style={{ color: GOLD }} />
                          <h3 className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: NAVY }}>
                            Pre-Staged Readiness Protocols — Ready When This Fires
                          </h3>
                          <div className="flex-1 h-px" style={{ background: '#E8E4DC' }} />
                        </div>

                        <div className="space-y-2.5">
                          {selectedTrigger.linkedPlaybooks.map((p: { id: string; name: string; domain: string }, idx: number) => (
                            <div key={p.id}
                              className="flex items-center gap-4 px-5 py-4 border cursor-pointer transition-all"
                              style={{ borderColor: idx === 0 ? `${GOLD}50` : '#E8E4DC', background: idx === 0 ? `${GOLD}05` : '#fff' }}
                              onClick={() => setLocation(`/Readiness Protocol-library/${p.id}`)}>
                              <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
                                style={{ background: idx === 0 ? `${GOLD}18` : `${NAVY}0A` }}>
                                <BookOpen className="w-4 h-4" style={{ color: idx === 0 ? GOLD : NAVY }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold" style={{ color: NAVY }}>{p.name}</p>
                                {p.domain && <p className="text-[10px] text-gray-400 mt-0.5">{p.domain}</p>}
                              </div>
                              {idx === 0 && (
                                <span className="text-[8px] font-black uppercase tracking-wider px-2 py-1 rounded flex-shrink-0"
                                  style={{ background: `${GOLD}15`, color: GOLD }}>Primary</span>
                              )}
                              <ArrowRight className="w-3.5 h-3.5 flex-shrink-0 text-gray-300" />
                            </div>
                          ))}
                        </div>

                        {/* One-click activate CTA */}
                        {isAuthenticated ? (
                          <button
                            onClick={() => {
                              const first = selectedTrigger.linkedPlaybooks?.[0];
                              if (first?.id) {
                                setLocation(`/Readiness Protocol-activation/${selectedTrigger.id}/${first.id}`);
                              } else {
                                const domain = TRIGGER_CATEGORY_TO_DOMAIN[selectedTrigger.category] || 'all';
                                setLocation(`/identify/Readiness Protocol-library?domain=${encodeURIComponent(domain)}`);
                              }
                            }}
                            className="mt-3 w-full flex items-center justify-center gap-2 px-5 py-3 font-bold text-sm hover:opacity-90 transition-opacity"
                            style={{ background: GOLD, color: NAVY }}
                          >
                            <Zap className="w-4 h-4" />
                            Activate Readiness Protocol Now
                          </button>
                        ) : (
                          <button
                            onClick={() => setLocation('/get-started')}
                            className="mt-3 w-full flex items-center justify-center gap-2 px-5 py-3 font-bold text-sm hover:opacity-80 transition-opacity"
                            style={{ background: '#E8E4DC', color: '#9CA3AF' }}
                          >
                            Sign In to Activate Readiness Protocols
                          </button>
                        )}

                        {/* Configure Intent button */}
                        {isAuthenticated && (
                          <button
                            onClick={() => setLocation(`/identify/situation-intent/new?triggerId=${selectedTrigger.id}&triggerName=${encodeURIComponent(selectedTrigger.name)}&triggerDomain=${encodeURIComponent(selectedTrigger.domain || selectedTrigger.category || '')}`)}
                            className="mt-2 w-full flex items-center justify-center gap-2 px-5 py-3 font-bold text-sm hover:opacity-90 transition-opacity"
                            style={{
                              background: configuredIntentIds.has(selectedTrigger.id) ? `${TEAL}12` : 'rgba(0,0,0,0.04)',
                              border: configuredIntentIds.has(selectedTrigger.id) ? `1px solid ${TEAL}40` : '1px solid #E8E4DC',
                              color: configuredIntentIds.has(selectedTrigger.id) ? TEAL : '#6B7280',
                            }}
                          >
                            <Target className="w-4 h-4" />
                            {configuredIntentIds.has(selectedTrigger.id) ? 'Edit Situation Intent ✓' : 'Configure Situation Intent'}
                          </button>
                        )}
                      </section>
                    )}

                    {/* ── SECTION 5: Category Data Points Overview ───────────── */}
                    {selectedEntry && (
                      <section>
                        <div className="flex items-center gap-2 mb-4">
                          <Layers className="w-4 h-4" style={{ color: '#6B7280' }} />
                          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
                            All Data Points in {selectedEntry.sc.name}
                          </h3>
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded" style={{ background: '#F0EDE4', color: '#6B7280' }}>
                            {selectedEntry.sc.dataPoints.length} available
                          </span>
                          <div className="flex-1 h-px" style={{ background: '#E8E4DC' }} />
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          {selectedEntry.sc.dataPoints.map((dp: any) => {
                            const isThisOne = dp.id === selectedDpId;
                            return (
                              <div key={dp.id}
                                className="flex items-start gap-3 px-4 py-3 border"
                                style={{
                                  borderColor: isThisOne ? `${GOLD}50` : '#F0EDE8',
                                  background:  isThisOne ? `${GOLD}06` : '#FAFAF9',
                                }}>
                                {isThisOne
                                  ? <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: GOLD }} />
                                  : <div className="w-3.5 h-3.5 border border-gray-200 flex-shrink-0 mt-0.5" />
                                }
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-0.5">
                                    <p className="text-[11px] font-bold" style={{ color: isThisOne ? NAVY : '#374151' }}>{dp.name}</p>
                                    {isThisOne && (
                                      <span className="text-[7px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded"
                                        style={{ background: `${GOLD}20`, color: GOLD }}>THIS RULE</span>
                                    )}
                                    <span className="text-[8px] text-gray-400 font-mono ml-auto">{dp.metricType}</span>
                                  </div>
                                  <p className="text-[10px] text-gray-400 leading-snug">{dp.description}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </section>
                    )}

                    {/* ── Edit footer ───────────────────────────────────────── */}
                    {isAuthenticated && (
                      <div className="flex items-center gap-3 pt-4 border-t border-[#E8E4DC]">
                        <Button
                          onClick={() => { setEditTriggerData(selectedTrigger); setIsWizardOpen(true); }}
                          style={{ background: NAVY, color: '#fff', fontWeight: 700, fontSize: 12 }}
                        >
                          <Settings className="w-3.5 h-3.5 mr-2" /> Edit This Rule
                        </Button>
                        <span className="text-[9px] text-gray-400">
                          {selectedTrigger.updatedAt && `Last updated ${format(new Date(selectedTrigger.updatedAt), 'MMM d, yyyy')}`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : selectedEntry ? (
              /* ── Category overview (no trigger selected) ─────────────────── */
              <div className="flex-1 overflow-y-auto p-8">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-1">
                    <div style={{ width: 20, height: 2, background: GOLD }} />
                    <span className="text-[9px] font-black uppercase tracking-[0.25em]" style={{ color: GOLD }}>
                      Category Overview
                    </span>
                  </div>
                  <h2 className="text-xl font-bold mb-1" style={{ ...CG, color: NAVY }}>
                    {selectedEntry.sc.name}
                  </h2>
                  <p className="text-sm text-gray-500 mb-6 max-w-xl">{selectedEntry.sc.description}</p>

                  {selectedTriggers.length > 0 ? (
                    <div className="mb-2 flex items-center gap-2">
                      <Info className="w-3.5 h-3.5" style={{ color: TEAL }} />
                      <p className="text-xs text-gray-400">
                        Select a trigger on the left to see every data point, source, and condition behind it.
                      </p>
                    </div>
                  ) : null}
                </div>

                {/* All data points in this category */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Database className="w-4 h-4" style={{ color: GOLD }} />
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: NAVY }}>
                      Available Data Points in This Category
                    </h3>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded"
                      style={{ background: `${GOLD}12`, color: GOLD }}>
                      {selectedEntry.sc.dataPoints.length} data points
                    </span>
                    <div className="flex-1 h-px" style={{ background: '#E8E4DC' }} />
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {selectedEntry.sc.dataPoints.map((dp: any) => {
                      const isWatched = selectedTriggers.some(t =>
                        (t.conditions?.dataPointId || t.conditions?.field || t.conditions?.metric) === dp.id
                      );
                      return (
                        <div key={dp.id}
                          className="border overflow-hidden"
                          style={{ borderColor: isWatched ? `${TEAL}40` : '#E8E4DC' }}>
                          <div className="px-5 py-4" style={{ background: isWatched ? `${TEAL}05` : '#F8F7F4' }}>
                            <div className="flex items-start justify-between gap-3 mb-1">
                              <p className="text-sm font-bold" style={{ color: NAVY }}>{dp.name}</p>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                {isWatched && (
                                  <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded"
                                    style={{ background: `${TEAL}15`, color: TEAL }}>
                                    <CheckCircle2 className="w-2.5 h-2.5 inline mr-0.5" />
                                    Monitored
                                  </span>
                                )}
                                <span className="text-[9px] font-bold px-2 py-0.5 rounded"
                                  style={{ background: `${GOLD}10`, color: GOLD }}>{dp.metricType}</span>
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed">{dp.description}</p>
                          </div>
                          {dp.sources?.length > 0 && (
                            <div className="px-5 py-2.5 border-t border-[#E8E4DC] flex flex-wrap gap-1.5">
                              {dp.sources.map((src: string) => (
                                <span key={src} className="text-[9px] font-semibold px-2 py-0.5 rounded"
                                  style={{ background: 'rgba(43,138,110,0.08)', color: TEAL, border: '1px solid rgba(43,138,110,0.2)' }}>
                                  {sourceLabel(src)}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              /* ── Nothing selected ─────────────────────────────────────────── */
              <div className="flex-1 overflow-y-auto p-8">
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-2">
                    <div style={{ width: 20, height: 2, background: GOLD }} />
                    <span className="text-[9px] font-black uppercase tracking-[0.25em]" style={{ color: GOLD }}>Proximity Overview</span>
                  </div>
                  <p className="text-sm text-gray-500 max-w-xl">
                    Select a category → choose a trigger → see every data point, source, and condition behind it.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sortedCats.filter(c => c.triggers.length > 0).slice(0, 6).map(({ sc, triggers, proximity }) => {
                    const lbl      = proximityLabel(proximity);
                    const barColor = proximityBarColor(proximity);
                    const topTrigger = triggers[0];

                    return (
                      <button
                        key={sc.id}
                        onClick={() => setSelectedCategoryId(sc.id)}
                        className="text-left p-5 border transition-all group"
                        style={{
                          borderColor: proximity >= 55 ? `${barColor}40` : '#E8E4DC',
                          background:  proximity >= 55 ? `${barColor}04` : '#fff',
                        }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="text-sm font-bold" style={{ color: NAVY }}>{sc.name}</p>
                            <p className="text-[9px] text-gray-400 mt-0.5">
                              {triggers.length} rule{triggers.length !== 1 ? 's' : ''} · {sc.dataPoints.length} data pts
                            </p>
                          </div>
                          <span className="text-[8px] font-black uppercase tracking-wider px-2 py-1 rounded"
                            style={{ background: lbl.bg, color: lbl.color }}>{lbl.label}</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 overflow-hidden mb-2">
                          <div className="h-full" style={{ width: `${proximity}%`, background: barColor }} />
                        </div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[9px] text-gray-400">0%</span>
                          <span className="text-[10px] font-black" style={{ color: barColor }}>{proximity}% proximity</span>
                          <span className="text-[9px] text-gray-400">100%</span>
                        </div>
                        {topTrigger && (
                          <div className="text-[10px] text-gray-500 border-t border-[#F0EDE8] pt-2.5 flex items-center gap-1.5">
                            <Bell className="w-3 h-3 flex-shrink-0" style={{ color: barColor }} />
                            <span className="truncate">{topTrigger.name}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-end mt-2">
                          <span className="text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 group-hover:gap-2 transition-all"
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

      {/* ── Wizard ─────────────────────────────────────────────────────────── */}
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
    </PageLayout>
  );
}
