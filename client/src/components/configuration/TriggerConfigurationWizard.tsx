import { useState, useEffect } from 'react';
import { SIGNAL_CATEGORIES as INTEL_CATEGORIES } from '@shared/intelligence-signals';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Check, ChevronRight, Target, Zap, AlertTriangle, TrendingUp, Users, DollarSign, Shield, Globe, Cpu, BarChart3, Activity, Eye, PlayCircle, ArrowLeft, Plus, Minus } from 'lucide-react';

const NAVY = '#0A0F2E';
const GOLD = '#C9A84C';
const TEAL = '#2B8A6E';

interface TriggerConfigurationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  editTrigger?: any;
}

const SITUATIONS = [
  { label: 'Competitor Price Cut', cat: 'competitive', desc: 'A key competitor significantly reduces pricing', signals: ['comp_pricing_change', 'comp_market_share', 'comp_product_launch'] },
  { label: 'Key Executive Departure', cat: 'talent', desc: 'Critical leadership role becomes vacant', signals: ['tal_key_departures', 'tal_attrition', 'tal_enps'] },
  { label: 'Supply Chain Disruption', cat: 'supplychain', desc: 'Supplier failure or logistics breakdown', signals: ['sc_supplier_risk', 'sc_lead_times', 'sc_inventory_risk'] },
  { label: 'Regulatory Mandate', cat: 'regulatory', desc: 'New regulation requires immediate compliance', signals: ['reg_new_rules', 'reg_enforcement', 'reg_compliance_gap'] },
  { label: 'Cybersecurity Incident', cat: 'cyber', desc: 'Security breach or threat detected', signals: ['cyber_threat_level', 'cyber_vulnerabilities', 'cyber_incident'] },
  { label: 'Market Share Decline', cat: 'market', desc: 'Measurable loss of market position', signals: ['mkt_market_share', 'mkt_sentiment', 'mkt_demand_shift'] },
  { label: 'Customer Churn Risk', cat: 'customer', desc: 'Signs of significant customer attrition', signals: ['cust_churn_risk', 'cust_nps', 'cust_csat', 'cust_contract_renewal'] },
  { label: 'Activist Investor Signal', cat: 'financial', desc: 'Activist position or pressure building', signals: ['fin_stock_volatility', 'fin_institutional_flow', 'fin_analyst_ratings'] },
];

const CATEGORY_META: Record<string, { name: string; icon: any; color: string }> = {
  competitive: { name: 'Competitive Intelligence', icon: Target, color: GOLD },
  market:      { name: 'Market Dynamics',          icon: TrendingUp, color: NAVY },
  financial:   { name: 'Financial Signals',        icon: DollarSign, color: '#16A34A' },
  regulatory:  { name: 'Regulatory & Compliance',  icon: Shield, color: '#DC2626' },
  supplychain: { name: 'Supply Chain',             icon: Activity, color: '#EA580C' },
  customer:    { name: 'Customer Signals',         icon: Users, color: NAVY },
  talent:      { name: 'Talent & Workforce',       icon: Users, color: '#EC4899' },
  geopolitical:{ name: 'Geopolitical',             icon: Globe, color: '#D97706' },
  technology:  { name: 'Technology',               icon: Cpu, color: TEAL },
  media:       { name: 'Media & Reputation',       icon: Eye, color: GOLD },
  cyber:       { name: 'Cybersecurity',            icon: Shield, color: '#DC2626' },
  economic:    { name: 'Economic Indicators',      icon: BarChart3, color: TEAL },
  partnership: { name: 'Partnership & Alliance',   icon: Users, color: TEAL },
  execution:   { name: 'Execution Velocity',       icon: Zap, color: '#CA8A04' },
  behavior:    { name: 'Behavioral Analytics',     icon: Activity, color: '#F43F5E' },
  innovation:  { name: 'Innovation Pipeline',      icon: PlayCircle, color: '#0EA5E9' },
};

const CATEGORY_DOMAIN_MAP: Record<string, string> = {
  competitive: 'Market Dynamics', market: 'Market Dynamics',
  financial: 'Financial Strategy', economic: 'Financial Strategy',
  regulatory: 'Regulatory & Compliance', esg: 'Regulatory & Compliance',
  talent: 'Talent & Leadership', customer: 'Operational Excellence',
  supplychain: 'Operational Excellence', execution: 'Operational Excellence',
  behavior: 'Operational Excellence', partnership: 'Market Opportunities',
  technology: 'Technology & Innovation', cyber: 'Technology & Innovation',
  innovation: 'Technology & Innovation', media: 'Brand & Reputation',
  geopolitical: 'AI Governance',
};

function getDefaultThresholdLabel(dp: any): string {
  const dt = dp.defaultThreshold;
  if (!dt) return 'breach detected';
  const ops: Record<string, string> = { gt: 'exceeds', lt: 'drops below', gte: 'reaches', lte: 'falls to', drop: 'drops by', spike: 'spikes by', eq: 'equals', change: 'changes by' };
  const opLabel = ops[dt.operator] || dt.operator;
  const unit = dp.unit || dp.metricType === 'percentage' ? '%' : dp.metricType === 'currency' ? 'USD' : '';
  return `${opLabel} ${dt.value}${unit}`;
}

export default function TriggerConfigurationWizard({ isOpen, onClose, onSuccess, editTrigger }: TriggerConfigurationWizardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [step, setStep] = useState(1);
  const TOTAL_STEPS = 3;

  // Step 1 state
  const [situationName, setSituationName] = useState('');
  const [situationDesc, setSituationDesc] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Step 2 state — array of { dpId, operator, value, isMandatory }
  const [selectedSignals, setSelectedSignals] = useState<{ dpId: string; operator: string; value: string; isMandatory: boolean }[]>([]);
  const [fireThreshold, setFireThreshold] = useState<'any' | 'all' | 'majority'>('any');

  // Step 3 state
  const [selectedPlaybooks, setSelectedPlaybooks] = useState<string[]>([]);
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('high');

  // Fetch all protocols
  const { data: playbooks } = useQuery({ queryKey: ['/api/playbooks/templates'] });

  const relevantPlaybooks = Array.isArray(playbooks)
    ? playbooks.filter((p: any) => !selectedCategory || p.domain === CATEGORY_DOMAIN_MAP[selectedCategory])
    : [];
  const otherPlaybooks = Array.isArray(playbooks)
    ? playbooks.filter((p: any) => selectedCategory && p.domain !== CATEGORY_DOMAIN_MAP[selectedCategory])
    : [];

  const dataPoints = INTEL_CATEGORIES.find(c => (c as any).id === selectedCategory)?.dataPoints ?? [];

  // Pre-populate when editing
  useEffect(() => {
    if (editTrigger && isOpen) {
      setSituationName(editTrigger.name || '');
      setSituationDesc(editTrigger.description || '');
      setSelectedCategory(editTrigger.category || '');
      setSeverity(editTrigger.severity || 'high');
      const preloadIds = editTrigger.linkedPlaybooks?.map((p: any) => p.id) || editTrigger.recommendedPlaybooks || [];
      setSelectedPlaybooks(preloadIds);
      // Reconstruct signals from conditions
      const conds = editTrigger.conditions;
      if (Array.isArray(conds?.signals)) {
        setSelectedSignals(conds.signals);
      } else if (conds?.dataPointId) {
        setSelectedSignals([{ dpId: conds.dataPointId || conds.field || '', operator: conds.operator || 'breach', value: String(conds.value || ''), isMandatory: false }]);
      } else {
        setSelectedSignals([]);
      }
      setFireThreshold(conds?.fireThreshold || 'any');
    }
  }, [editTrigger, isOpen]);

  // When category changes, auto-select recommended signals
  useEffect(() => {
    if (!selectedCategory) return;
    if (editTrigger) return; // don't overwrite when editing
    const catDps = INTEL_CATEGORIES.find(c => (c as any).id === selectedCategory)?.dataPoints ?? [];
    // Pre-select the first 4–6 data points that have defaultThreshold
    const preselect = catDps
      .filter((dp: any) => dp.defaultThreshold)
      .slice(0, 6)
      .map((dp: any) => ({
        dpId: dp.id,
        operator: dp.defaultThreshold?.operator || 'breach',
        value: String(dp.defaultThreshold?.value ?? ''),
        isMandatory: false,
      }));
    setSelectedSignals(preselect);
  }, [selectedCategory]);

  const handleClose = () => {
    setStep(1);
    setSituationName('');
    setSituationDesc('');
    setSelectedCategory('');
    setSelectedSignals([]);
    setFireThreshold('any');
    setSelectedPlaybooks([]);
    setSeverity('high');
    onClose();
  };

  const canProceed = () => {
    if (step === 1) return !!situationName && !!selectedCategory;
    if (step === 2) return selectedSignals.length > 0;
    if (step === 3) return true;
    return false;
  };

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = editTrigger?.id
        ? await apiRequest('PUT', `/api/executive-triggers/${editTrigger.id}`, data)
        : await apiRequest('POST', '/api/config/triggers', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/executive-triggers'] });
      queryClient.invalidateQueries({ queryKey: ['/api/config/triggers'] });
      toast({ title: editTrigger ? 'Trigger updated' : 'Trigger created', description: editTrigger ? 'Monitoring rule updated.' : 'Now monitoring for this situation.' });
      onSuccess?.();
      handleClose();
    },
    onError: (e: any) => {
      toast({ title: 'Error', description: e.message || 'Failed to save trigger', variant: 'destructive' });
    },
  });

  const handleSubmit = () => {
    // Build the operator/value for the primary condition from selected signals for backward compat
    const primary = selectedSignals[0];
    const catDps = INTEL_CATEGORIES.find(c => (c as any).id === selectedCategory)?.dataPoints ?? [];
    const primaryDp = catDps.find((dp: any) => dp.id === primary?.dpId) as any;

    saveMutation.mutate({
      name: situationName,
      description: situationDesc,
      category: selectedCategory,
      signalType: primary?.dpId || '',
      conditionField: primaryDp?.name || primary?.dpId || '',
      conditionOperator: primary?.operator || 'breach',
      conditionValue: parseFloat(primary?.value || '0'),
      conditionUnit: primaryDp?.metricType || '',
      severity,
      conditions: {
        signals: selectedSignals,
        fireThreshold,
        // legacy compat fields
        dataPointId: primary?.dpId,
        field: primary?.dpId,
        operator: primary?.operator || 'breach',
        value: parseFloat(primary?.value || '0'),
      },
      recommendedPlaybooks: selectedPlaybooks,
      notificationChannels: { email: true, inApp: true, slack: false, webhook: false },
      escalationEnabled: true,
      escalationTimeoutMinutes: 30,
      monitoringFrequency: 'realtime',
      autoActivatePlaybook: false,
    });
  };

  const toggleSignal = (dpId: string, dp: any) => {
    setSelectedSignals(prev => {
      const exists = prev.find(s => s.dpId === dpId);
      if (exists) return prev.filter(s => s.dpId !== dpId);
      return [...prev, {
        dpId,
        operator: dp.defaultThreshold?.operator || 'breach',
        value: String(dp.defaultThreshold?.value ?? ''),
        isMandatory: false,
      }];
    });
  };

  const updateSignalValue = (dpId: string, field: 'operator' | 'value', val: string) => {
    setSelectedSignals(prev => prev.map(s => s.dpId === dpId ? { ...s, [field]: val } : s));
  };

  const toggleMandatory = (dpId: string) => {
    setSelectedSignals(prev => prev.map(s => s.dpId === dpId ? { ...s, isMandatory: !s.isMandatory } : s));
  };

  const togglePlaybook = (id: string) => {
    setSelectedPlaybooks(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const stepLabel = ['Name the Situation', 'Select Signals to Watch', 'Link Readiness Protocol'];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-8 pt-8 pb-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 flex items-center justify-center" style={{ background: NAVY }}>
              <Target className="w-4 h-4 text-white" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold" style={{ color: NAVY }}>
                {editTrigger ? 'Edit Trigger' : 'Create a Trigger'}
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-400 mt-0.5">
                Define what you're watching for — the protocol will be ready before it fires
              </DialogDescription>
            </div>
          </div>

          {/* Step progress */}
          <div className="flex items-center gap-0 mt-4 mb-6">
            {[1, 2, 3].map((s, i) => (
              <div key={s} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div className="w-7 h-7 flex items-center justify-center text-xs font-black transition-all"
                    style={{
                      background: s < step ? TEAL : s === step ? NAVY : '#F0EDE8',
                      color: s <= step ? '#fff' : '#9CA3AF',
                    }}>
                    {s < step ? <Check className="w-3.5 h-3.5" /> : s}
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider whitespace-nowrap"
                    style={{ color: s === step ? NAVY : '#9CA3AF' }}>
                    {stepLabel[i]}
                  </span>
                </div>
                {i < 2 && (
                  <div className="flex-1 h-px mx-2 mt-[-12px]"
                    style={{ background: step > s + 1 ? TEAL : step > s ? `${NAVY}30` : '#E8E4DC' }} />
                )}
              </div>
            ))}
          </div>
        </DialogHeader>

        <div className="px-8 pb-8">
          {/* ─── STEP 1: Name the Situation ─────────────────────────────── */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Situation name */}
              <div>
                <Label className="text-xs font-black uppercase tracking-wider mb-2 block" style={{ color: NAVY }}>
                  What strategic situation are you preparing for? *
                </Label>
                <Input
                  placeholder="e.g., Customer Churn Risk, Competitor Price Cut, Regulatory Mandate…"
                  value={situationName}
                  onChange={e => setSituationName(e.target.value)}
                  className="text-base font-semibold border-0 border-b-2 rounded-none focus-visible:ring-0 px-0"
                  style={{ borderColor: situationName ? NAVY : '#E8E4DC', color: NAVY }}
                  data-testid="input-trigger-name"
                />
              </div>

              {/* Quick-pick situations */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: '#9CA3AF' }}>Common situations — click to fill</p>
                <div className="grid grid-cols-2 gap-2">
                  {SITUATIONS.map(s => {
                    const meta = CATEGORY_META[s.cat];
                    const Icon = meta?.icon;
                    const isActive = situationName === s.label;
                    return (
                      <button key={s.label}
                        onClick={() => {
                          setSituationName(s.label);
                          setSituationDesc(s.desc);
                          setSelectedCategory(s.cat);
                        }}
                        className="text-left px-3 py-2.5 border transition-all flex items-center gap-3"
                        style={{
                          borderColor: isActive ? NAVY : '#E8E4DC',
                          background: isActive ? NAVY : '#FAFAF9',
                        }}
                      >
                        {Icon && <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: isActive ? GOLD : '#9CA3AF' }} />}
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold truncate" style={{ color: isActive ? '#fff' : NAVY }}>{s.label}</p>
                          <p className="text-[9px] truncate" style={{ color: isActive ? 'rgba(255,255,255,0.6)' : '#9CA3AF' }}>{s.desc}</p>
                        </div>
                        {isActive && <Check className="w-3.5 h-3.5 ml-auto flex-shrink-0" style={{ color: GOLD }} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Or pick a domain if no quick-pick */}
              {!selectedCategory && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: '#9CA3AF' }}>Or choose a signal domain</p>
                  <div className="grid grid-cols-4 gap-2">
                    {Object.entries(CATEGORY_META).map(([id, meta]) => {
                      const Icon = meta.icon;
                      const isActive = selectedCategory === id;
                      return (
                        <button key={id}
                          onClick={() => setSelectedCategory(id)}
                          className="flex flex-col items-center gap-1.5 p-3 border text-center transition-all"
                          style={{
                            borderColor: isActive ? NAVY : '#E8E4DC',
                            background: isActive ? `${NAVY}06` : '#fff',
                          }}
                          data-testid={`category-card-${id}`}
                        >
                          <Icon className="w-4 h-4" style={{ color: isActive ? NAVY : '#9CA3AF' }} />
                          <span className="text-[9px] font-bold leading-tight" style={{ color: isActive ? NAVY : '#6B7280' }}>{meta.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectedCategory && (
                <div className="flex items-center gap-2 text-[10px]" style={{ color: TEAL }}>
                  {(() => { const meta = CATEGORY_META[selectedCategory]; const Icon = meta?.icon; return Icon ? <Icon className="w-3.5 h-3.5" /> : null; })()}
                  <span className="font-bold">Domain: {CATEGORY_META[selectedCategory]?.name}</span>
                  <button className="ml-auto text-[9px] underline text-gray-400 hover:text-gray-600" onClick={() => setSelectedCategory('')}>Change</button>
                </div>
              )}

              {/* Optional description */}
              <div>
                <Label className="text-xs font-black uppercase tracking-wider mb-1 block" style={{ color: '#9CA3AF' }}>
                  Description <span className="font-normal normal-case tracking-normal">(optional)</span>
                </Label>
                <Input
                  placeholder="Brief context on what this situation means for your organization…"
                  value={situationDesc}
                  onChange={e => setSituationDesc(e.target.value)}
                  className="text-sm"
                  data-testid="input-trigger-description"
                />
              </div>
            </div>
          )}

          {/* ─── STEP 2: Select Signals ──────────────────────────────────── */}
          {step === 2 && (
            <div className="space-y-5">
              {/* Context banner */}
              <div className="flex items-start gap-3 p-4 border-l-4" style={{ background: `${TEAL}06`, borderColor: TEAL }}>
                <Zap className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: TEAL }} />
                <div>
                  <p className="text-xs font-bold" style={{ color: NAVY }}>{situationName}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    We've pre-selected the signals most likely to indicate this situation. Toggle any on or off, and adjust thresholds if needed.
                  </p>
                </div>
              </div>

              {/* Fire threshold selector */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider mb-2" style={{ color: NAVY }}>
                  When should this trigger fire?
                </p>
                <div className="flex gap-2">
                  {([
                    { id: 'any', label: 'Any signal breaches', desc: 'Most sensitive' },
                    { id: 'majority', label: 'Majority breach', desc: '50%+ of signals' },
                    { id: 'all', label: 'All signals breach', desc: 'Most confident' },
                  ] as const).map(opt => (
                    <button key={opt.id}
                      onClick={() => setFireThreshold(opt.id)}
                      className="flex-1 text-center px-3 py-2.5 border transition-all"
                      style={{
                        borderColor: fireThreshold === opt.id ? NAVY : '#E8E4DC',
                        background: fireThreshold === opt.id ? NAVY : '#fff',
                      }}
                    >
                      <p className="text-[10px] font-bold" style={{ color: fireThreshold === opt.id ? '#fff' : NAVY }}>{opt.label}</p>
                      <p className="text-[9px] mt-0.5" style={{ color: fireThreshold === opt.id ? 'rgba(255,255,255,0.6)' : '#9CA3AF' }}>{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Signal list */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: NAVY }}>
                    Signals to Watch
                    <span className="ml-2 font-normal normal-case tracking-normal" style={{ color: TEAL }}>
                      {selectedSignals.length} selected
                    </span>
                  </p>
                  <span className="text-[9px] text-gray-400">{(dataPoints as any[]).length} available in {CATEGORY_META[selectedCategory]?.name}</span>
                </div>

                <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
                  {(dataPoints as any[]).map(dp => {
                    const sig = selectedSignals.find(s => s.dpId === dp.id);
                    const isSelected = !!sig;
                    const thresholdLabel = getDefaultThresholdLabel(dp);
                    return (
                      <div key={dp.id}
                        className="border transition-all"
                        style={{
                          borderColor: isSelected ? `${TEAL}50` : '#F0EDE8',
                          background: isSelected ? `${TEAL}04` : '#FAFAF9',
                        }}
                      >
                        <div className="flex items-center gap-3 px-4 py-3">
                          {/* Checkbox */}
                          <button
                            onClick={() => toggleSignal(dp.id, dp)}
                            className="w-5 h-5 flex-shrink-0 flex items-center justify-center border-2 transition-all"
                            style={{
                              borderColor: isSelected ? TEAL : '#D1D5DB',
                              background: isSelected ? TEAL : 'transparent',
                            }}
                            data-testid={`signal-toggle-${dp.id}`}
                          >
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </button>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-[12px] font-bold" style={{ color: isSelected ? NAVY : '#374151' }}>{dp.name}</p>
                              <span className="text-[8px] font-mono text-gray-400">{dp.metricType}</span>
                              {sig?.isMandatory && (
                                <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5"
                                  style={{ background: `${GOLD}20`, color: GOLD }}>MUST FIRE</span>
                              )}
                            </div>
                            <p className="text-[10px] text-gray-400 mt-0.5">{dp.description}</p>
                            {isSelected && (
                              <p className="text-[9px] mt-1" style={{ color: TEAL }}>
                                Alert when: <span className="font-bold">{thresholdLabel}</span>
                              </p>
                            )}
                          </div>

                          {/* Must-fire toggle */}
                          {isSelected && (
                            <button
                              onClick={() => toggleMandatory(dp.id)}
                              className="text-[8px] font-bold px-2 py-1 border transition-all flex-shrink-0"
                              style={{
                                borderColor: sig?.isMandatory ? GOLD : '#E8E4DC',
                                color: sig?.isMandatory ? GOLD : '#9CA3AF',
                                background: sig?.isMandatory ? `${GOLD}10` : 'transparent',
                              }}
                              title="Mark as must-fire — this signal must breach for the trigger to activate"
                            >
                              ★ {sig?.isMandatory ? 'Must fire' : 'Optional'}
                            </button>
                          )}
                        </div>

                        {/* Threshold editor — shown when selected */}
                        {isSelected && (
                          <div className="px-12 pb-3 flex items-center gap-3">
                            <span className="text-[9px] text-gray-400 w-24 flex-shrink-0">Threshold value:</span>
                            <select
                              value={sig?.operator || 'breach'}
                              onChange={e => updateSignalValue(dp.id, 'operator', e.target.value)}
                              className="text-[10px] border border-gray-200 px-2 py-1 rounded"
                              style={{ color: NAVY }}
                            >
                              <option value="gt">exceeds</option>
                              <option value="lt">drops below</option>
                              <option value="gte">reaches</option>
                              <option value="drop">drops by</option>
                              <option value="spike">spikes by</option>
                              <option value="eq">equals</option>
                            </select>
                            <Input
                              type="number"
                              value={sig?.value || ''}
                              onChange={e => updateSignalValue(dp.id, 'value', e.target.value)}
                              className="h-7 w-24 text-[11px]"
                              placeholder={String(dp.defaultThreshold?.value ?? '')}
                            />
                            <span className="text-[9px] text-gray-400">{dp.unit || dp.metricType}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ─── STEP 3: Link Readiness Protocol ─────────────────────────── */}
          {step === 3 && (
            <div className="space-y-5">
              {/* Summary of what was built */}
              <div className="p-4 border" style={{ background: '#F8F7F4', borderColor: '#E8E4DC' }}>
                <p className="text-[9px] font-black uppercase tracking-wider mb-3" style={{ color: GOLD }}>Situation Summary</p>
                <p className="text-base font-bold mb-1" style={{ color: NAVY }}>{situationName}</p>
                <p className="text-xs text-gray-500 mb-3">{situationDesc}</p>
                <div className="flex items-center gap-4 text-[10px]">
                  <div className="flex items-center gap-1.5" style={{ color: TEAL }}>
                    <div className="w-2 h-2" style={{ background: TEAL }} />
                    <span className="font-bold">{selectedSignals.length} signals monitored</span>
                  </div>
                  <div className="flex items-center gap-1.5" style={{ color: GOLD }}>
                    <div className="w-2 h-2" style={{ background: GOLD }} />
                    <span className="font-bold">{selectedSignals.filter(s => s.isMandatory).length} must-fire signals</span>
                  </div>
                  <div className="flex items-center gap-1.5" style={{ color: '#6B7280' }}>
                    <span>Fires when: <strong style={{ color: NAVY }}>{fireThreshold === 'any' ? 'any signal breaches' : fireThreshold === 'majority' ? 'majority breach' : 'all signals breach'}</strong></span>
                  </div>
                </div>
              </div>

              {/* Severity */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider mb-2" style={{ color: NAVY }}>Severity Level</p>
                <div className="flex gap-2">
                  {([
                    { id: 'low', label: 'Low', color: '#6B7280', desc: 'Monitor only' },
                    { id: 'medium', label: 'Medium', color: '#D97706', desc: 'Notify within 24h' },
                    { id: 'high', label: 'High', color: '#EA580C', desc: 'Notify within 4h' },
                    { id: 'critical', label: 'Critical', color: '#DC2626', desc: 'Immediate response' },
                  ] as const).map(lv => (
                    <button key={lv.id}
                      onClick={() => setSeverity(lv.id)}
                      className="flex-1 px-2 py-2 border text-center transition-all"
                      style={{
                        borderColor: severity === lv.id ? lv.color : '#E8E4DC',
                        background: severity === lv.id ? `${lv.color}12` : '#fff',
                      }}
                    >
                      <p className="text-[10px] font-bold" style={{ color: lv.color }}>{lv.label}</p>
                      <p className="text-[8px] text-gray-400 mt-0.5">{lv.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Protocol picker */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: NAVY }}>
                    Readiness Protocol
                    {selectedPlaybooks.length > 0 && (
                      <span className="ml-2 font-normal normal-case tracking-normal" style={{ color: TEAL }}>
                        {selectedPlaybooks.length} linked
                      </span>
                    )}
                  </p>
                  <span className="text-[9px] text-gray-400">Select one or more protocols to activate when this trigger fires</span>
                </div>

                {relevantPlaybooks.length > 0 && (
                  <>
                    <p className="text-[9px] font-bold uppercase tracking-wider mb-2" style={{ color: GOLD }}>Recommended for this situation</p>
                    <div className="space-y-1.5 max-h-[200px] overflow-y-auto mb-3">
                      {relevantPlaybooks.map((pb: any) => {
                        const selected = selectedPlaybooks.includes(pb.id);
                        return (
                          <button key={pb.id}
                            onClick={() => togglePlaybook(pb.id)}
                            className="w-full text-left flex items-center gap-3 px-4 py-3 border transition-all"
                            style={{
                              borderColor: selected ? NAVY : '#E8E4DC',
                              background: selected ? NAVY : '#fff',
                              borderLeft: `3px solid ${selected ? GOLD : '#E8E4DC'}`,
                            }}
                          >
                            <div className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                              style={{ background: selected ? GOLD : '#F0EDE8' }}>
                              <PlayCircle className="w-4 h-4" style={{ color: selected ? NAVY : '#9CA3AF' }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] font-bold truncate" style={{ color: selected ? '#fff' : NAVY }}>{pb.name}</p>
                              <p className="text-[9px]" style={{ color: selected ? 'rgba(255,255,255,0.55)' : '#6B7280' }}>{pb.domain}</p>
                            </div>
                            {selected && <Check className="w-4 h-4 flex-shrink-0" style={{ color: GOLD }} />}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}

                {otherPlaybooks.length > 0 && (
                  <>
                    <p className="text-[9px] font-bold uppercase tracking-wider mb-2 text-gray-400">Other protocols</p>
                    <div className="space-y-1 max-h-[120px] overflow-y-auto opacity-70">
                      {otherPlaybooks.map((pb: any) => {
                        const selected = selectedPlaybooks.includes(pb.id);
                        return (
                          <button key={pb.id}
                            onClick={() => togglePlaybook(pb.id)}
                            className="w-full text-left flex items-center gap-3 px-4 py-2.5 border transition-all"
                            style={{
                              borderColor: selected ? NAVY : '#F0EDE8',
                              background: selected ? NAVY : '#FAFAF9',
                            }}
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] font-medium truncate" style={{ color: selected ? '#fff' : NAVY }}>{pb.name}</p>
                              <p className="text-[8px]" style={{ color: selected ? 'rgba(255,255,255,0.5)' : '#9CA3AF' }}>{pb.domain}</p>
                            </div>
                            {selected && <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: GOLD }} />}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* What happens next */}
              <div className="p-4 border-l-4" style={{ background: `${NAVY}04`, borderColor: NAVY }}>
                <p className="text-[9px] font-black uppercase tracking-wider mb-2" style={{ color: NAVY }}>When this trigger fires</p>
                <div className="space-y-1.5">
                  {[
                    'Your executive team is notified immediately',
                    `${selectedPlaybooks.length > 0 ? selectedPlaybooks.length + ' Readiness Protocol(s) surface' : 'Linked protocols surface'} for authorization`,
                    'Pre-staged tasks are ready — 12 minutes to full mobilization',
                    'AI monitors continuously — executive authorizes every action',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-[10px] text-gray-600">
                      <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: TEAL }} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── Navigation ─────────────────────────────────────────────── */}
          <div className="flex justify-between items-center mt-8 pt-5 border-t border-[#F0EDE8]">
            <Button variant="outline" onClick={step === 1 ? handleClose : () => setStep(s => s - 1)}
              className="flex items-center gap-2 text-xs"
              data-testid="button-back"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              {step === 1 ? 'Cancel' : 'Back'}
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-[9px] text-gray-400">{step} of {TOTAL_STEPS}</span>
              {step < TOTAL_STEPS ? (
                <Button
                  onClick={() => setStep(s => s + 1)}
                  disabled={!canProceed()}
                  className="flex items-center gap-2 text-xs font-bold"
                  style={{ background: NAVY, color: '#fff' }}
                  data-testid="button-next"
                >
                  Next — {stepLabel[step]}
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={saveMutation.isPending}
                  className="flex items-center gap-2 text-xs font-bold px-6"
                  style={{ background: TEAL, color: '#fff' }}
                  data-testid="button-next"
                >
                  <Check className="w-3.5 h-3.5" />
                  {saveMutation.isPending ? 'Saving…' : editTrigger ? 'Save Changes' : 'Create Trigger'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
