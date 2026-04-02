import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  ChevronRight, ChevronLeft, CheckCircle2, Target, FileText,
  Zap, Users, AlertTriangle, BarChart3, Shield, TrendingUp,
  Globe, DollarSign, Settings, Plus, X, Search, Check,
  Lightbulb, Clock, Star, ArrowRight, BookOpen, Trash2
} from "lucide-react";
import { SIGNAL_CATEGORIES } from "@shared/intelligence-signals";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const TEAL_LIGHT = "#3BAF8A";
const IVORY = "#F0EDE4";
const MUTED = "#6B7280";
const BORDER = "#E8E4DC";

const STEPS = [
  { id: 1, label: "Situation", icon: Target },
  { id: 2, label: "Intent", icon: Lightbulb },
  { id: 3, label: "Indicators", icon: BarChart3 },
  { id: 4, label: "Decision Brief", icon: FileText },
  { id: 5, label: "Stakeholders", icon: Users },
  { id: 6, label: "Confirm", icon: CheckCircle2 },
];

const BUSINESS_IMPACT_OPTIONS = [
  { id: "revenue", label: "Revenue", icon: DollarSign, desc: "Protecting or growing top-line revenue" },
  { id: "market_share", label: "Market Share", icon: TrendingUp, desc: "Defending or capturing competitive position" },
  { id: "margin", label: "Margin", icon: BarChart3, desc: "Protecting profitability and cost structure" },
  { id: "compliance", label: "Compliance", icon: Shield, desc: "Meeting regulatory and legal obligations" },
  { id: "reputation", label: "Reputation", icon: Star, desc: "Protecting brand and stakeholder trust" },
  { id: "operations", label: "Operations", icon: Settings, desc: "Maintaining operational continuity" },
  { id: "customer", label: "Customer", icon: Users, desc: "Retaining and satisfying key customers" },
  { id: "talent", label: "Talent", icon: Globe, desc: "Protecting workforce and leadership stability" },
];

const URGENCY_OPTIONS = [
  { id: "critical", label: "Critical", desc: "Executive response required within minutes", color: "#DC2626" },
  { id: "high", label: "High", desc: "Executive response required within hours", color: GOLD },
  { id: "medium", label: "Medium", desc: "Executive response required within 24 hours", color: TEAL },
];

const SENSITIVITY_OPTIONS = [
  { id: "low", label: "Low", desc: "Conservative — only fire on clear, high-confidence signals" },
  { id: "standard", label: "Standard", desc: "Balanced — default calibration for most organizations" },
  { id: "high", label: "High", desc: "Proactive — fire earlier to get a head start on emerging threats" },
  { id: "critical", label: "Critical", desc: "Maximum vigilance — fire on any credible indicator" },
];

const BRIEF_SUGGESTIONS = [
  "Current revenue impact estimate at time of trigger",
  "Which customer segments are directly exposed",
  "Competitor or threat actor's current position and intent",
  "Pre-staged playbook summary and first 3 actions",
  "Estimated execution cost and budget runway",
  "Regulatory or legal exposure if we act vs. if we don't",
  "Which internal teams are already mobilized",
  "Historical precedent — how similar situations resolved",
  "Confidence score and evidence quality from signal detection",
  "Time window — how long before situation becomes unrecoverable",
];

interface SituationStakeholder {
  name: string;
  role: string;
  email: string;
  notifyOn: "detection" | "activation" | "both";
  decisionOrientation: "financial" | "operational" | "risk" | "growth" | "";
}

const DECISION_ORIENTATIONS = [
  { value: "financial", label: "Financial", icon: "💰", desc: "Brief leads with revenue, margin, and dollar exposure" },
  { value: "operational", label: "Operational", icon: "⚙️", desc: "Brief leads with process, system, and team disruption" },
  { value: "risk", label: "Risk", icon: "🛡️", desc: "Brief leads with compliance, regulatory, and reputational exposure" },
  { value: "growth", label: "Growth", icon: "📈", desc: "Brief leads with market position, competitive, and strategic impact" },
] as const;

interface FormState {
  triggerId: string;
  triggerName: string;
  triggerDomain: string;
  protectedOutcome: string;
  businessImpact: string;
  urgencyLevel: string;
  briefRequirements: string[];
  primaryDataPoints: string[];
  primaryDataPointLabels: string[];
  sensitivityLevel: string;
  situationStakeholders: SituationStakeholder[];
  contextNotes: string;
}

export default function SituationIntentWizard() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [dpSearch, setDpSearch] = useState("");
  const [dpCategoryFilter, setDpCategoryFilter] = useState("all");
  const [newBriefItem, setNewBriefItem] = useState("");
  const [newStakeholder, setNewStakeholder] = useState<SituationStakeholder>({
    name: "", role: "", email: "", notifyOn: "both", decisionOrientation: ""
  });

  const params = new URLSearchParams(window.location.search);
  const preTriggerId = params.get("triggerId") || "";
  const preTriggerName = params.get("triggerName") || "";
  const preTriggerDomain = params.get("triggerDomain") || "";

  const [form, setForm] = useState<FormState>({
    triggerId: preTriggerId,
    triggerName: preTriggerName,
    triggerDomain: preTriggerDomain,
    protectedOutcome: "",
    businessImpact: "",
    urgencyLevel: "high",
    briefRequirements: [],
    primaryDataPoints: [],
    primaryDataPointLabels: [],
    sensitivityLevel: "standard",
    situationStakeholders: [],
    contextNotes: "",
  });

  const { data: triggers = [] } = useQuery<any[]>({
    queryKey: ["/api/executive-triggers"],
    enabled: isAuthenticated,
  });

  const { data: existingIntent } = useQuery<any>({
    queryKey: ["/api/situation-intents", form.triggerId],
    enabled: isAuthenticated && !!form.triggerId,
    retry: false,
  });

  useEffect(() => {
    if (existingIntent && existingIntent.id) {
      setForm(prev => ({
        ...prev,
        protectedOutcome: existingIntent.protectedOutcome || "",
        businessImpact: existingIntent.businessImpact || "",
        urgencyLevel: existingIntent.urgencyLevel || "high",
        briefRequirements: Array.isArray(existingIntent.briefRequirements) ? existingIntent.briefRequirements : [],
        primaryDataPoints: Array.isArray(existingIntent.primaryDataPoints) ? existingIntent.primaryDataPoints : [],
        primaryDataPointLabels: Array.isArray(existingIntent.primaryDataPointLabels) ? existingIntent.primaryDataPointLabels : [],
        sensitivityLevel: existingIntent.sensitivityLevel || "standard",
        situationStakeholders: Array.isArray(existingIntent.situationStakeholders) ? existingIntent.situationStakeholders : [],
        contextNotes: existingIntent.contextNotes || "",
      }));
    }
  }, [existingIntent]);

  const saveMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/situation-intents", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/situation-intents"] });
      toast({ title: "Situation configured", description: `Intent saved for "${form.triggerName}"` });
      setLocation("/identify/situation-intents");
    },
    onError: () => toast({ title: "Error", description: "Failed to save", variant: "destructive" }),
  });

  const handleSave = () => {
    saveMutation.mutate({
      triggerId: form.triggerId,
      triggerName: form.triggerName,
      triggerDomain: form.triggerDomain,
      protectedOutcome: form.protectedOutcome,
      businessImpact: form.businessImpact,
      urgencyLevel: form.urgencyLevel,
      briefRequirements: form.briefRequirements,
      primaryDataPoints: form.primaryDataPoints,
      primaryDataPointLabels: form.primaryDataPointLabels,
      sensitivityLevel: form.sensitivityLevel,
      situationStakeholders: form.situationStakeholders,
      contextNotes: form.contextNotes,
      isConfigured: true,
    });
  };

  const allDataPoints = SIGNAL_CATEGORIES.flatMap(cat =>
    cat.dataPoints.map(dp => ({ ...dp, categoryId: cat.id, categoryName: cat.name }))
  );

  const filteredDPs = allDataPoints.filter(dp => {
    const matchSearch = !dpSearch ||
      dp.name.toLowerCase().includes(dpSearch.toLowerCase()) ||
      dp.description.toLowerCase().includes(dpSearch.toLowerCase()) ||
      (dp as any).categoryName.toLowerCase().includes(dpSearch.toLowerCase());
    const matchCat = dpCategoryFilter === "all" || (dp as any).categoryId === dpCategoryFilter;
    return matchSearch && matchCat;
  });

  const toggleDataPoint = (dp: any) => {
    const alreadySelected = form.primaryDataPoints.includes(dp.id);
    if (alreadySelected) {
      setForm(prev => ({
        ...prev,
        primaryDataPoints: prev.primaryDataPoints.filter(id => id !== dp.id),
        primaryDataPointLabels: prev.primaryDataPointLabels.filter((_, i) => prev.primaryDataPoints[i] !== dp.id),
      }));
    } else if (form.primaryDataPoints.length < 5) {
      setForm(prev => ({
        ...prev,
        primaryDataPoints: [...prev.primaryDataPoints, dp.id],
        primaryDataPointLabels: [...prev.primaryDataPointLabels, dp.name],
      }));
    } else {
      toast({ title: "Maximum 5 indicators", description: "Remove one to add another", variant: "destructive" });
    }
  };

  const addBriefItem = (item: string) => {
    if (!item.trim() || form.briefRequirements.includes(item.trim())) return;
    if (form.briefRequirements.length >= 6) {
      toast({ title: "Maximum 6 items", description: "Remove one to add another" });
      return;
    }
    setForm(prev => ({ ...prev, briefRequirements: [...prev.briefRequirements, item.trim()] }));
    setNewBriefItem("");
  };

  const addStakeholder = () => {
    if (!newStakeholder.name || !newStakeholder.email) return;
    setForm(prev => ({
      ...prev,
      situationStakeholders: [...prev.situationStakeholders, { ...newStakeholder }]
    }));
    setNewStakeholder({ name: "", role: "", email: "", notifyOn: "both", decisionOrientation: "" });
  };

  const canProceed = () => {
    if (step === 1) return !!form.triggerId && !!form.triggerName;
    if (step === 2) return !!form.businessImpact && !!form.protectedOutcome.trim();
    if (step === 3) return form.primaryDataPoints.length >= 1;
    if (step === 4) return form.briefRequirements.length >= 1;
    return true;
  };

  const isEditing = existingIntent?.id;

  return (
    <div style={{ minHeight: "100vh", background: "#F8F7F4", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ background: NAVY, borderBottom: `1px solid rgba(255,255,255,0.08)`, padding: "20px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <Target size={14} color={GOLD} />
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: GOLD }}>
                {isEditing ? "Edit Situation Intent" : "Configure Situation Intent"}
              </span>
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: 0 }}>
              {form.triggerName || "Select a Situation"}
            </h1>
            {form.triggerDomain && (
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{form.triggerDomain}</span>
            )}
          </div>
          <button
            onClick={() => setLocation("/identify/situation-intents")}
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 6, padding: "8px 18px", color: "rgba(255,255,255,0.7)", fontSize: 13, cursor: "pointer" }}
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Step progress */}
      <div style={{ background: "#fff", borderBottom: `1px solid ${BORDER}`, padding: "0 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "stretch" }}>
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = step === s.id;
            const isDone = step > s.id;
            return (
              <button
                key={s.id}
                onClick={() => isDone && setStep(s.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "16px 20px",
                  background: "none", border: "none", borderBottom: isActive ? `2px solid ${GOLD}` : "2px solid transparent",
                  cursor: isDone ? "pointer" : "default", transition: "all 0.2s",
                }}
              >
                <div style={{
                  width: 24, height: 24, borderRadius: "50%",
                  background: isDone ? TEAL : isActive ? GOLD : "rgba(0,0,0,0.06)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  {isDone
                    ? <Check size={12} color="#fff" />
                    : <Icon size={12} color={isActive ? "#fff" : MUTED} />
                  }
                </div>
                <span style={{
                  fontSize: 12, fontWeight: isActive ? 700 : 500,
                  color: isActive ? NAVY : isDone ? TEAL : MUTED,
                  whiteSpace: "nowrap",
                }}>
                  {s.label}
                </span>
                {i < STEPS.length - 1 && <ChevronRight size={12} color={BORDER} style={{ marginLeft: 4 }} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 1100, margin: "40px auto", padding: "0 32px" }}>

        {/* ── STEP 1: Situation Selection ── */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: NAVY, marginBottom: 8 }}>
              Which situation are you configuring?
            </h2>
            <p style={{ fontSize: 15, color: MUTED, marginBottom: 32, lineHeight: 1.6 }}>
              Select the trigger situation you want to pre-stage intent for. This determines which 
              playbook gets deployed, which data points matter, and who gets notified when it fires.
            </p>

            {preTriggerId ? (
              <div style={{ background: "#fff", border: `2px solid ${GOLD}`, borderRadius: 12, padding: 24, marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: `${GOLD}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Target size={20} color={GOLD} />
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: NAVY }}>{form.triggerName}</div>
                    {form.triggerDomain && <div style={{ fontSize: 12, color: MUTED }}>{form.triggerDomain}</div>}
                  </div>
                  <div style={{ marginLeft: "auto", background: `${GOLD}15`, border: `1px solid ${GOLD}40`, borderRadius: 4, padding: "3px 10px" }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: GOLD, textTransform: "uppercase", letterSpacing: "0.1em" }}>Pre-selected</span>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: "grid", gap: 12, maxHeight: 480, overflowY: "auto", paddingRight: 8 }}>
                  {triggers.filter(t => t.isActive !== false).map((t: any) => (
                    <div
                      key={t.id}
                      onClick={() => setForm(prev => ({ ...prev, triggerId: t.id, triggerName: t.name, triggerDomain: t.domain || t.category || "" }))}
                      style={{
                        background: form.triggerId === t.id ? `${GOLD}08` : "#fff",
                        border: form.triggerId === t.id ? `2px solid ${GOLD}` : `1px solid ${BORDER}`,
                        borderRadius: 8, padding: "16px 20px",
                        cursor: "pointer", display: "flex", alignItems: "center", gap: 16,
                        transition: "all 0.15s",
                      }}
                    >
                      <div style={{
                        width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                        background: form.triggerId === t.id ? GOLD : BORDER,
                      }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: NAVY }}>{t.name}</div>
                        {t.domain && <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{t.domain}</div>}
                      </div>
                      {form.triggerId === t.id && <Check size={16} color={GOLD} />}
                    </div>
                  ))}
                  {triggers.length === 0 && (
                    <div style={{ padding: 40, textAlign: "center", color: MUTED }}>
                      <BookOpen size={32} style={{ marginBottom: 12, opacity: 0.4 }} />
                      <p style={{ fontSize: 14 }}>No triggers configured yet. Set up triggers in Signal Configuration first.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 2: Strategic Intent ── */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: NAVY, marginBottom: 8 }}>
              What are you protecting when this fires?
            </h2>
            <p style={{ fontSize: 15, color: MUTED, marginBottom: 32, lineHeight: 1.6 }}>
              This becomes the anchor context for the authorizing executive. When the trigger fires, 
              they'll see this intent immediately — clarifying exactly why this situation matters and 
              what the organization is defending.
            </p>

            <div style={{ marginBottom: 32 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: NAVY, display: "block", marginBottom: 12, letterSpacing: "0.04em" }}>
                PRIMARY BUSINESS IMPACT
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                {BUSINESS_IMPACT_OPTIONS.map(opt => {
                  const Icon = opt.icon;
                  const selected = form.businessImpact === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setForm(prev => ({ ...prev, businessImpact: opt.id }))}
                      style={{
                        background: selected ? NAVY : "#fff",
                        border: selected ? `2px solid ${NAVY}` : `1px solid ${BORDER}`,
                        borderRadius: 8, padding: "16px 14px",
                        cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                      }}
                    >
                      <Icon size={18} color={selected ? GOLD : MUTED} style={{ marginBottom: 8 }} />
                      <div style={{ fontSize: 13, fontWeight: 700, color: selected ? "#fff" : NAVY, marginBottom: 4 }}>{opt.label}</div>
                      <div style={{ fontSize: 11, color: selected ? "rgba(255,255,255,0.6)" : MUTED, lineHeight: 1.4 }}>{opt.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: NAVY, display: "block", marginBottom: 8, letterSpacing: "0.04em" }}>
                WHAT SPECIFICALLY ARE YOU PROTECTING OR ACHIEVING?
              </label>
              <p style={{ fontSize: 12, color: MUTED, marginBottom: 10 }}>
                Be precise. This appears in the executive decision brief at the moment of authorization.
              </p>
              <textarea
                value={form.protectedOutcome}
                onChange={e => setForm(prev => ({ ...prev, protectedOutcome: e.target.value }))}
                placeholder="e.g. Protect our $340M enterprise segment from competitor pricing erosion. Our top 12 accounts represent 68% of ARR and are actively being targeted by our main competitor's new mid-market offer."
                rows={4}
                style={{
                  width: "100%", padding: "14px 16px", border: `1px solid ${BORDER}`,
                  borderRadius: 8, fontSize: 14, color: NAVY, outline: "none",
                  fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6, resize: "vertical",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: NAVY, display: "block", marginBottom: 12, letterSpacing: "0.04em" }}>
                RESPONSE URGENCY
              </label>
              <div style={{ display: "flex", gap: 12 }}>
                {URGENCY_OPTIONS.map(opt => {
                  const selected = form.urgencyLevel === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setForm(prev => ({ ...prev, urgencyLevel: opt.id }))}
                      style={{
                        flex: 1, padding: "14px 16px",
                        background: selected ? opt.color + "12" : "#fff",
                        border: selected ? `2px solid ${opt.color}` : `1px solid ${BORDER}`,
                        borderRadius: 8, cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <Clock size={14} color={selected ? opt.color : MUTED} />
                        <span style={{ fontSize: 13, fontWeight: 700, color: selected ? opt.color : NAVY }}>{opt.label}</span>
                      </div>
                      <div style={{ fontSize: 11, color: MUTED, lineHeight: 1.4 }}>{opt.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: NAVY, display: "block", marginBottom: 12, letterSpacing: "0.04em" }}>
                SIGNAL SENSITIVITY CALIBRATION
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
                {SENSITIVITY_OPTIONS.map(opt => {
                  const selected = form.sensitivityLevel === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setForm(prev => ({ ...prev, sensitivityLevel: opt.id }))}
                      style={{
                        padding: "12px 16px",
                        background: selected ? `${TEAL}08` : "#fff",
                        border: selected ? `2px solid ${TEAL}` : `1px solid ${BORDER}`,
                        borderRadius: 8, cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                        display: "flex", gap: 10, alignItems: "flex-start",
                      }}
                    >
                      <div style={{ width: 8, height: 8, borderRadius: "50%", marginTop: 3, flexShrink: 0, background: selected ? TEAL : BORDER }} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: selected ? TEAL : NAVY, marginBottom: 3 }}>{opt.label}</div>
                        <div style={{ fontSize: 11, color: MUTED, lineHeight: 1.4 }}>{opt.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: Primary Indicators ── */}
        {step === 3 && (
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: NAVY, marginBottom: 8 }}>
              Which data points are your strongest early warnings?
            </h2>
            <p style={{ fontSize: 15, color: MUTED, marginBottom: 12, lineHeight: 1.6 }}>
              From the 248 monitored data points, select up to 5 that are the most critical early indicators 
              for <strong style={{ color: NAVY }}>{form.triggerName}</strong> specifically at your organization. 
              These will be highlighted in the decision brief and weighted in signal detection.
            </p>

            {form.primaryDataPoints.length > 0 && (
              <div style={{ background: `${TEAL}08`, border: `1px solid ${TEAL}30`, borderRadius: 8, padding: "12px 16px", marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: TEAL, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
                  Selected ({form.primaryDataPoints.length}/5)
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {form.primaryDataPointLabels.map((label, i) => (
                    <div key={form.primaryDataPoints[i]} style={{ display: "flex", alignItems: "center", gap: 6, background: "#fff", border: `1px solid ${TEAL}40`, borderRadius: 20, padding: "4px 10px 4px 12px" }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: NAVY }}>{label}</span>
                      <button
                        onClick={() => {
                          const dpId = form.primaryDataPoints[i];
                          setForm(prev => ({
                            ...prev,
                            primaryDataPoints: prev.primaryDataPoints.filter(id => id !== dpId),
                            primaryDataPointLabels: prev.primaryDataPointLabels.filter((_, idx) => idx !== i),
                          }));
                        }}
                        style={{ background: "none", border: "none", cursor: "pointer", padding: 2, display: "flex", alignItems: "center" }}
                      >
                        <X size={12} color={MUTED} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1, position: "relative" }}>
                <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: MUTED }} />
                <input
                  value={dpSearch}
                  onChange={e => setDpSearch(e.target.value)}
                  placeholder="Search data points..."
                  style={{ width: "100%", paddingLeft: 36, padding: "10px 12px 10px 36px", border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 13, outline: "none", boxSizing: "border-box" }}
                />
              </div>
              <select
                value={dpCategoryFilter}
                onChange={e => setDpCategoryFilter(e.target.value)}
                style={{ padding: "10px 12px", border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 13, color: NAVY, background: "#fff", cursor: "pointer", outline: "none" }}
              >
                <option value="all">All Categories</option>
                {SIGNAL_CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div style={{ maxHeight: 440, overflowY: "auto", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, paddingRight: 4 }}>
              {filteredDPs.slice(0, 60).map(dp => {
                const selected = form.primaryDataPoints.includes(dp.id);
                return (
                  <button
                    key={dp.id}
                    onClick={() => toggleDataPoint(dp)}
                    style={{
                      background: selected ? `${TEAL}08` : "#fff",
                      border: selected ? `2px solid ${TEAL}` : `1px solid ${BORDER}`,
                      borderRadius: 8, padding: "12px 14px",
                      cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                      display: "flex", gap: 10, alignItems: "flex-start",
                    }}
                  >
                    <div style={{
                      width: 18, height: 18, borderRadius: 4, border: `2px solid ${selected ? TEAL : BORDER}`,
                      background: selected ? TEAL : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1,
                    }}>
                      {selected && <Check size={10} color="#fff" />}
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: NAVY, marginBottom: 2 }}>{dp.name}</div>
                      <div style={{ fontSize: 10, color: MUTED, lineHeight: 1.4 }}>{dp.description}</div>
                      <div style={{ fontSize: 9, color: TEAL, marginTop: 4, fontWeight: 600 }}>{(dp as any).categoryName}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── STEP 4: Decision Brief ── */}
        {step === 4 && (
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: NAVY, marginBottom: 8 }}>
              What does the executive need to see to decide?
            </h2>
            <p style={{ fontSize: 15, color: MUTED, marginBottom: 32, lineHeight: 1.6 }}>
              When this trigger fires, the authorizing executive sees a pre-built decision brief. 
              Define exactly what information they need to feel confident authorizing in seconds — 
              not what you'll figure out later, but what you're committing to surface right now.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: NAVY, display: "block", marginBottom: 12, letterSpacing: "0.04em" }}>
                  REQUIRED BRIEF ITEMS ({form.briefRequirements.length}/6)
                </label>

                <div style={{ marginBottom: 16 }}>
                  {form.briefRequirements.map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, marginBottom: 8 }}>
                      <div style={{ width: 20, height: 20, borderRadius: "50%", background: `${GOLD}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                        <span style={{ fontSize: 10, fontWeight: 800, color: GOLD }}>{i + 1}</span>
                      </div>
                      <span style={{ flex: 1, fontSize: 13, color: NAVY, lineHeight: 1.5 }}>{item}</span>
                      <button
                        onClick={() => setForm(prev => ({ ...prev, briefRequirements: prev.briefRequirements.filter((_, idx) => idx !== i) }))}
                        style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}
                      >
                        <X size={14} color={MUTED} />
                      </button>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    value={newBriefItem}
                    onChange={e => setNewBriefItem(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && addBriefItem(newBriefItem)}
                    placeholder="Add a custom brief requirement..."
                    style={{ flex: 1, padding: "10px 12px", border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 13, outline: "none" }}
                  />
                  <button
                    onClick={() => addBriefItem(newBriefItem)}
                    style={{ padding: "10px 14px", background: NAVY, border: "none", borderRadius: 6, cursor: "pointer" }}
                  >
                    <Plus size={16} color="#fff" />
                  </button>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: NAVY, display: "block", marginBottom: 12, letterSpacing: "0.04em" }}>
                  SUGGESTIONS — CLICK TO ADD
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {BRIEF_SUGGESTIONS.filter(s => !form.briefRequirements.includes(s)).map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => addBriefItem(suggestion)}
                      style={{
                        padding: "10px 14px", background: "#fff", border: `1px solid ${BORDER}`,
                        borderRadius: 8, cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                        display: "flex", alignItems: "center", gap: 10,
                      }}
                    >
                      <Plus size={12} color={TEAL} style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: NAVY, lineHeight: 1.5 }}>{suggestion}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 5: Situation Stakeholders ── */}
        {step === 5 && (
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: NAVY, marginBottom: 8 }}>
              Who gets notified specifically for this situation?
            </h2>
            <p style={{ fontSize: 15, color: MUTED, marginBottom: 32, lineHeight: 1.6 }}>
              Beyond your org-wide stakeholder contacts, define who receives alerts specifically when 
              <strong style={{ color: NAVY }}> {form.triggerName}</strong> fires — and at which point 
              in the activation sequence.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: NAVY, display: "block", marginBottom: 16, letterSpacing: "0.04em" }}>
                  SITUATION-SPECIFIC CONTACTS
                </label>

                {form.situationStakeholders.length === 0 && (
                  <div style={{ padding: "24px", textAlign: "center", background: "#fff", border: `1px dashed ${BORDER}`, borderRadius: 8, marginBottom: 16 }}>
                    <Users size={24} color={BORDER} style={{ marginBottom: 8 }} />
                    <p style={{ fontSize: 13, color: MUTED }}>No situation-specific contacts yet.</p>
                    <p style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>Your org-wide stakeholders still receive notifications.</p>
                  </div>
                )}

                {form.situationStakeholders.map((s, i) => {
                  const orient = DECISION_ORIENTATIONS.find(o => o.value === s.decisionOrientation);
                  return (
                    <div key={i} style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "14px 16px", marginBottom: 10, display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${NAVY}10`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Users size={16} color={NAVY} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>{s.name}</div>
                        <div style={{ fontSize: 11, color: MUTED }}>{s.role} · {s.email}</div>
                        <div style={{ display: "flex", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 10, color: TEAL, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                            Notify: {s.notifyOn}
                          </span>
                          {orient && (
                            <span style={{ fontSize: 10, background: `${TEAL}12`, color: TEAL, fontWeight: 700, padding: "1px 7px", borderRadius: 4, letterSpacing: "0.06em" }}>
                              {orient.icon} {orient.label} lens
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => setForm(prev => ({ ...prev, situationStakeholders: prev.situationStakeholders.filter((_, idx) => idx !== i) }))}
                        style={{ background: "none", border: "none", cursor: "pointer" }}
                      >
                        <Trash2 size={14} color={MUTED} />
                      </button>
                    </div>
                  );
                })}

                <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, padding: 16 }}>
                  <div style={{ display: "grid", gap: 10, marginBottom: 12 }}>
                    <input
                      value={newStakeholder.name}
                      onChange={e => setNewStakeholder(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Full name"
                      style={{ padding: "9px 12px", border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 13, outline: "none" }}
                    />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      <input
                        value={newStakeholder.role}
                        onChange={e => setNewStakeholder(prev => ({ ...prev, role: e.target.value }))}
                        placeholder="Role (e.g. CFO)"
                        style={{ padding: "9px 12px", border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 13, outline: "none" }}
                      />
                      <input
                        value={newStakeholder.email}
                        onChange={e => setNewStakeholder(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Email address"
                        style={{ padding: "9px 12px", border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 13, outline: "none" }}
                      />
                    </div>
                    <select
                      value={newStakeholder.notifyOn}
                      onChange={e => setNewStakeholder(prev => ({ ...prev, notifyOn: e.target.value as any }))}
                      style={{ padding: "9px 12px", border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 13, color: NAVY, background: "#fff", outline: "none" }}
                    >
                      <option value="detection">On signal detection</option>
                      <option value="activation">On playbook activation</option>
                      <option value="both">On both events</option>
                    </select>
                  </div>

                  {/* Decision Orientation */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: NAVY, marginBottom: 8, letterSpacing: "0.05em" }}>
                      DECISION ORIENTATION <span style={{ color: MUTED, fontWeight: 400, fontSize: 10 }}>— how does this executive process information under pressure?</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                      {DECISION_ORIENTATIONS.map(o => {
                        const selected = newStakeholder.decisionOrientation === o.value;
                        return (
                          <button
                            key={o.value}
                            type="button"
                            onClick={() => setNewStakeholder(prev => ({ ...prev, decisionOrientation: selected ? "" : o.value as any }))}
                            style={{
                              padding: "8px 10px", border: `1px solid ${selected ? TEAL : BORDER}`,
                              borderRadius: 6, background: selected ? `${TEAL}10` : "#fff",
                              cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 6,
                            }}
                          >
                            <span style={{ fontSize: 14 }}>{o.icon}</span>
                            <div>
                              <div style={{ fontSize: 11, fontWeight: 700, color: selected ? TEAL : NAVY }}>{o.label}</div>
                              <div style={{ fontSize: 9, color: MUTED, lineHeight: 1.3 }}>{o.desc}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    onClick={addStakeholder}
                    style={{ width: "100%", padding: "10px", background: NAVY, border: "none", borderRadius: 6, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                  >
                    <Plus size={14} />
                    Add Stakeholder
                  </button>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: NAVY, display: "block", marginBottom: 12, letterSpacing: "0.04em" }}>
                  CONTEXT NOTES (OPTIONAL)
                </label>
                <p style={{ fontSize: 12, color: MUTED, marginBottom: 10, lineHeight: 1.5 }}>
                  Any additional context that should be visible to the authorizing executive or implementation team when this situation fires.
                </p>
                <textarea
                  value={form.contextNotes}
                  onChange={e => setForm(prev => ({ ...prev, contextNotes: e.target.value }))}
                  placeholder="e.g. This trigger is most likely to fire in Q4 during competitor earnings announcements. Ensure the CFO and VP Sales are always in the loop before activation. Pre-approved budget: $250K."
                  rows={6}
                  style={{
                    width: "100%", padding: "12px 14px", border: `1px solid ${BORDER}`,
                    borderRadius: 8, fontSize: 13, color: NAVY, outline: "none",
                    fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6, resize: "vertical",
                    boxSizing: "border-box",
                  }}
                />

                <div style={{ background: `${GOLD}08`, border: `1px solid ${GOLD}30`, borderRadius: 8, padding: "16px", marginTop: 16 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <AlertTriangle size={16} color={GOLD} style={{ marginTop: 1, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: NAVY, marginBottom: 4 }}>Threshold reminder</div>
                      <div style={{ fontSize: 11, color: MUTED, lineHeight: 1.5 }}>
                        System-wide trigger thresholds (confidence ≥72%, 3+ keyword matches) remain in effect. 
                        Sensitivity calibration from Step 2 adjusts weighting within those constraints.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 6: Confirmation Summary ── */}
        {step === 6 && (
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: NAVY, marginBottom: 8 }}>
              Review and save situation intent
            </h2>
            <p style={{ fontSize: 15, color: MUTED, marginBottom: 32, lineHeight: 1.6 }}>
              Everything below gets attached to this trigger. When it fires, the authorizing executive 
              sees this context immediately — and the organization moves without deliberation.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
              {/* Trigger */}
              <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 12, padding: 24 }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: TEAL, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>Situation</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: NAVY }}>{form.triggerName}</div>
                {form.triggerDomain && <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>{form.triggerDomain}</div>}
              </div>

              {/* Impact + Urgency */}
              <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 12, padding: 24 }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: TEAL, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>Strategic Intent</div>
                <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, background: `${NAVY}10`, color: NAVY, padding: "3px 10px", borderRadius: 20 }}>
                    {BUSINESS_IMPACT_OPTIONS.find(o => o.id === form.businessImpact)?.label || "—"}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 700, background: `${GOLD}15`, color: GOLD, padding: "3px 10px", borderRadius: 20 }}>
                    {URGENCY_OPTIONS.find(o => o.id === form.urgencyLevel)?.label || "—"} Urgency
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 700, background: `${TEAL}12`, color: TEAL, padding: "3px 10px", borderRadius: 20 }}>
                    {SENSITIVITY_OPTIONS.find(o => o.id === form.sensitivityLevel)?.label || "—"} Sensitivity
                  </span>
                </div>
                <div style={{ fontSize: 13, color: NAVY, lineHeight: 1.6, marginTop: 8 }}>{form.protectedOutcome}</div>
              </div>

              {/* Primary Indicators */}
              <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 12, padding: 24 }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: TEAL, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>
                  Primary Indicators ({form.primaryDataPoints.length})
                </div>
                {form.primaryDataPointLabels.map((label, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: NAVY }}>{label}</span>
                  </div>
                ))}
                {form.primaryDataPoints.length === 0 && <span style={{ fontSize: 13, color: MUTED }}>None selected</span>}
              </div>

              {/* Decision Brief */}
              <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 12, padding: 24 }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: TEAL, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>
                  Decision Brief ({form.briefRequirements.length} items)
                </div>
                {form.briefRequirements.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: GOLD, minWidth: 16 }}>{i + 1}.</span>
                    <span style={{ fontSize: 13, color: NAVY, lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
                {form.briefRequirements.length === 0 && <span style={{ fontSize: 13, color: MUTED }}>None defined</span>}
              </div>
            </div>

            {/* Stakeholders */}
            {form.situationStakeholders.length > 0 && (
              <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 12, padding: 24, marginBottom: 24 }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: TEAL, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>
                  Situation-Specific Stakeholders ({form.situationStakeholders.length})
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {form.situationStakeholders.map((s, i) => {
                    const orient = DECISION_ORIENTATIONS.find(o => o.value === s.decisionOrientation);
                    return (
                      <div key={i} style={{ background: `${NAVY}05`, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "10px 14px" }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>{s.name}</div>
                        <div style={{ fontSize: 11, color: MUTED }}>{s.role} · Notify on {s.notifyOn}</div>
                        {orient && (
                          <div style={{ fontSize: 10, color: TEAL, fontWeight: 600, marginTop: 3 }}>
                            {orient.icon} {orient.label} decision lens
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Context Notes */}
            {form.contextNotes && (
              <div style={{ background: `${GOLD}06`, border: `1px solid ${GOLD}25`, borderRadius: 12, padding: 24, marginBottom: 24 }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: GOLD, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>Context Notes</div>
                <div style={{ fontSize: 13, color: NAVY, lineHeight: 1.6 }}>{form.contextNotes}</div>
              </div>
            )}

            <div style={{ background: `${TEAL}08`, border: `1px solid ${TEAL}30`, borderRadius: 8, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
              <CheckCircle2 size={18} color={TEAL} />
              <span style={{ fontSize: 13, color: NAVY, lineHeight: 1.5 }}>
                Once saved, this intent configuration is immediately active. When <strong>{form.triggerName}</strong> fires, 
                the authorizing executive will see this full context and can authorize in seconds — not weeks.
              </span>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 40, paddingTop: 24, borderTop: `1px solid ${BORDER}` }}>
          <button
            onClick={() => step > 1 ? setStep(step - 1) : setLocation("/identify/situation-intents")}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 24px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 14, fontWeight: 600, color: NAVY, cursor: "pointer" }}
          >
            <ChevronLeft size={16} />
            {step === 1 ? "Cancel" : "Back"}
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {STEPS.map(s => (
              <div key={s.id} style={{ width: step === s.id ? 24 : 8, height: 8, borderRadius: 4, background: step > s.id ? TEAL : step === s.id ? GOLD : BORDER, transition: "all 0.2s" }} />
            ))}
          </div>

          {step < 6 ? (
            <button
              onClick={() => canProceed() && setStep(step + 1)}
              disabled={!canProceed()}
              style={{
                display: "flex", alignItems: "center", gap: 8, padding: "12px 28px",
                background: canProceed() ? NAVY : BORDER, border: "none", borderRadius: 8,
                fontSize: 14, fontWeight: 700, color: canProceed() ? "#fff" : MUTED,
                cursor: canProceed() ? "pointer" : "not-allowed", transition: "all 0.2s",
              }}
            >
              Continue
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={saveMutation.isPending}
              style={{
                display: "flex", alignItems: "center", gap: 8, padding: "12px 28px",
                background: GOLD, border: "none", borderRadius: 8,
                fontSize: 14, fontWeight: 700, color: NAVY,
                cursor: saveMutation.isPending ? "not-allowed" : "pointer",
                opacity: saveMutation.isPending ? 0.7 : 1,
              }}
            >
              <Zap size={16} />
              {saveMutation.isPending ? "Saving..." : isEditing ? "Update Intent" : "Save Situation Intent"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
