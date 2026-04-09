import { useState, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertTriangle, CheckCircle2, ChevronDown, ChevronRight, Lock, Plus, Search, Trash2, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SIGNAL_CATEGORIES } from "@shared/intelligence-signals";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";

const OPERATORS = [
  { value: "gt", label: "Greater than" },
  { value: "lt", label: "Less than" },
  { value: "gte", label: "At least" },
  { value: "lte", label: "At most" },
  { value: "eq", label: "Equal to" },
  { value: "spike", label: "Spikes above" },
  { value: "drop", label: "Drops below" },
  { value: "trend_up", label: "Trending up" },
  { value: "trend_down", label: "Trending down" },
];

const SEVERITY_OPTIONS = [
  { value: "low", label: "Low", color: "#6B7280" },
  { value: "medium", label: "Medium", color: "#F59E0B" },
  { value: "high", label: "High", color: "#EF4444" },
  { value: "critical", label: "Critical", color: "#7C3AED" },
];

interface SelectedDataPoint {
  id: string;
  name: string;
  category: string;
  categoryName: string;
  unit: string;
  operator: string;
  value: number;
  mandatory: boolean;
}

interface TriggerGroup {
  id: string;
  name: string;
  description?: string;
  severity: string;
  conditions: {
    type: string;
    dataPoints: SelectedDataPoint[];
    minimumRequired: number;
  };
  currentStatus?: string;
  triggerCount?: number;
  associationId: string;
}

function TriggerGroupCard({ group, playbookId, onEdit }: { group: TriggerGroup; playbookId: string; onEdit: (g: TriggerGroup) => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const points: SelectedDataPoint[] = group.conditions?.dataPoints ?? [];
  const minRequired = group.conditions?.minimumRequired ?? 1;

  const deleteMutation = useMutation({
    mutationFn: () => apiRequest("DELETE", `/api/playbooks/${playbookId}/trigger-groups/${group.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/playbooks/${playbookId}/trigger-groups`] });
      toast({ title: "Trigger group removed" });
    },
    onError: () => toast({ title: "Failed to remove trigger group", variant: "destructive" }),
  });

  const sev = SEVERITY_OPTIONS.find(s => s.value === group.severity) ?? SEVERITY_OPTIONS[1];

  return (
    <div style={{ border: `1px solid ${GOLD}30`, borderLeft: `4px solid ${sev.color}`, background: "#FAFAF8", borderRadius: 0, padding: "20px 24px", marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <Zap size={14} color={GOLD} />
            <span style={{ fontSize: 15, fontWeight: 700, color: NAVY }}>{group.name}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: sev.color, background: `${sev.color}18`, padding: "2px 8px", borderRadius: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {sev.label}
            </span>
          </div>
          {group.description && (
            <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 12, lineHeight: 1.5 }}>{group.description}</p>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <span style={{ fontSize: 12, color: "#6B7280" }}>Fires when</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: NAVY, background: `${GOLD}18`, padding: "2px 10px", borderRadius: 0 }}>
              {minRequired} of {points.length}
            </span>
            <span style={{ fontSize: 12, color: "#6B7280" }}>data points are valid</span>
            {points.some(p => p.mandatory) && (
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#EF4444" }}>
                <Lock size={11} /> + all mandatory points
              </span>
            )}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {points.map(dp => (
              <div key={dp.id} style={{
                display: "flex", alignItems: "center", gap: 6,
                border: dp.mandatory ? "1px solid #EF444440" : `1px solid ${GOLD}30`,
                borderRadius: 0, padding: "4px 10px", fontSize: 12,
                background: dp.mandatory ? "#FEF2F2" : "#F9F8F5", color: NAVY, fontWeight: 500
              }}>
                {dp.mandatory && <Lock size={10} color="#EF4444" />}
                <span>{dp.name}</span>
                <span style={{ color: TEAL, fontWeight: 700 }}>
                  {OPERATORS.find(o => o.value === dp.operator)?.label?.toLowerCase() ?? dp.operator} {dp.value}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <Button variant="outline" size="sm" onClick={() => onEdit(group)} style={{ fontSize: 12, fontWeight: 600 }}>
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={() => deleteMutation.mutate()} disabled={deleteMutation.isPending}
            style={{ fontSize: 12, fontWeight: 600, borderColor: "#EF444440", color: "#EF4444" }}>
            <Trash2 size={13} />
          </Button>
        </div>
      </div>
    </div>
  );
}

function DataPointPicker({ selected, onToggle }: { selected: SelectedDataPoint[]; onToggle: (dp: SelectedDataPoint) => void }) {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string[]>([]);

  const filtered = useMemo(() => {
    if (!search.trim()) return SIGNAL_CATEGORIES;
    const q = search.toLowerCase();
    return SIGNAL_CATEGORIES.map(cat => ({
      ...cat,
      dataPoints: cat.dataPoints.filter(dp => dp.name.toLowerCase().includes(q) || cat.name.toLowerCase().includes(q)),
    })).filter(cat => cat.dataPoints.length > 0);
  }, [search]);

  const toggleCategory = (id: string) => {
    setExpanded(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const isSelected = (id: string) => selected.some(s => s.id === id);

  return (
    <div style={{ border: `1px solid #E5E7EB`, borderRadius: 0, overflow: "hidden" }}>
      <div style={{ padding: "10px 12px", borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", gap: 8 }}>
        <Search size={14} color="#9CA3AF" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search data points..."
          style={{ flex: 1, border: "none", outline: "none", fontSize: 13, color: NAVY, background: "transparent" }}
        />
        {search && <button onClick={() => setSearch("")} style={{ fontSize: 11, color: "#9CA3AF", background: "none", border: "none", cursor: "pointer" }}>Clear</button>}
      </div>
      <div style={{ maxHeight: 320, overflowY: "auto" }}>
        {filtered.map(cat => (
          <div key={cat.id}>
            <button
              onClick={() => toggleCategory(cat.id)}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "8px 12px", background: "#F9F8F5", border: "none", borderBottom: "1px solid #E5E7EB",
                cursor: "pointer", textAlign: "left",
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 700, color: NAVY, textTransform: "uppercase", letterSpacing: "0.05em" }}>{cat.name}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11, color: "#9CA3AF" }}>{cat.dataPoints.length} points</span>
                {expanded.includes(cat.id) ? <ChevronDown size={13} color="#9CA3AF" /> : <ChevronRight size={13} color="#9CA3AF" />}
              </div>
            </button>
            {expanded.includes(cat.id) && cat.dataPoints.map(dp => (
              <div
                key={dp.id}
                onClick={() => onToggle({
                  id: dp.id,
                  name: dp.name,
                  category: cat.id,
                  categoryName: cat.name,
                  unit: dp.unit ?? dp.metricType ?? "value",
                  operator: dp.defaultThreshold?.operator ?? "gt",
                  value: typeof dp.defaultThreshold?.value === "number" ? dp.defaultThreshold.value : 0,
                  mandatory: false,
                })}
                style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "8px 20px",
                  cursor: "pointer", borderBottom: "1px solid #F3F4F6",
                  background: isSelected(dp.id) ? `${TEAL}10` : "white",
                  transition: "background 0.15s",
                }}
              >
                <div style={{
                  width: 16, height: 16, borderRadius: 0, border: isSelected(dp.id) ? `2px solid ${TEAL}` : "2px solid #D1D5DB",
                  background: isSelected(dp.id) ? TEAL : "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  {isSelected(dp.id) && <CheckCircle2 size={10} color="white" />}
                </div>
                <span style={{ fontSize: 13, color: NAVY, fontWeight: isSelected(dp.id) ? 600 : 400 }}>{dp.name}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

interface BuilderDialogProps {
  open: boolean;
  onClose: () => void;
  playbookId: string;
  editing?: TriggerGroup | null;
}

function BuilderDialog({ open, onClose, playbookId, editing }: BuilderDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [name, setName] = useState(editing?.name ?? "");
  const [description, setDescription] = useState(editing?.description ?? "");
  const [severity, setSeverity] = useState(editing?.severity ?? "medium");
  const [selectedPoints, setSelectedPoints] = useState<SelectedDataPoint[]>(editing?.conditions?.dataPoints ?? []);
  const [minimumRequired, setMinimumRequired] = useState(editing?.conditions?.minimumRequired ?? 1);
  const [step, setStep] = useState<"details" | "points" | "thresholds">("details");

  const reset = () => {
    setName(""); setDescription(""); setSeverity("medium");
    setSelectedPoints([]); setMinimumRequired(1); setStep("details");
  };

  const handleClose = () => { reset(); onClose(); };

  const togglePoint = (dp: SelectedDataPoint) => {
    setSelectedPoints(prev => {
      const exists = prev.find(p => p.id === dp.id);
      if (exists) return prev.filter(p => p.id !== dp.id);
      const updated = [...prev, dp];
      setMinimumRequired(Math.min(minimumRequired, updated.length));
      return updated;
    });
  };

  const updatePoint = (id: string, updates: Partial<SelectedDataPoint>) => {
    setSelectedPoints(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const saveMutation = useMutation({
    mutationFn: () => {
      const body = { name, description, dataPoints: selectedPoints, minimumRequired, severity };
      if (editing) {
        return apiRequest("PATCH", `/api/playbooks/${playbookId}/trigger-groups/${editing.id}`, body);
      }
      return apiRequest("POST", `/api/playbooks/${playbookId}/trigger-groups`, body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/playbooks/${playbookId}/trigger-groups`] });
      toast({ title: editing ? "Trigger group updated" : "Trigger group created" });
      handleClose();
    },
    onError: () => toast({ title: "Failed to save trigger group", variant: "destructive" }),
  });

  const canProceed = step === "details" ? name.trim().length > 0
    : step === "points" ? selectedPoints.length > 0
    : true;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent style={{ maxWidth: 680, maxHeight: "90vh", overflow: "auto" }}>
        <DialogHeader>
          <DialogTitle style={{ fontSize: 18, fontWeight: 700, color: NAVY }}>
            {editing ? "Edit Trigger Group" : "New Trigger Group"}
          </DialogTitle>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            {(["details", "points", "thresholds"] as const).map((s, i) => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{
                  width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700,
                  background: step === s ? GOLD : (["details", "points", "thresholds"].indexOf(step) > i ? TEAL : "#E5E7EB"),
                  color: step === s || ["details", "points", "thresholds"].indexOf(step) > i ? "white" : "#9CA3AF",
                }}>
                  {["details", "points", "thresholds"].indexOf(step) > i ? "✓" : i + 1}
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: step === s ? NAVY : "#9CA3AF", textTransform: "capitalize" }}>{s}</span>
                {i < 2 && <ChevronRight size={12} color="#D1D5DB" />}
              </div>
            ))}
          </div>
        </DialogHeader>

        <div style={{ paddingTop: 8 }}>
          {step === "details" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <Label style={{ fontSize: 12, fontWeight: 700, color: NAVY, textTransform: "uppercase", letterSpacing: "0.05em" }}>Trigger Group Name *</Label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Competitive Threat Escalation" style={{ marginTop: 6, fontSize: 14 }} />
              </div>
              <div>
                <Label style={{ fontSize: 12, fontWeight: 700, color: NAVY, textTransform: "uppercase", letterSpacing: "0.05em" }}>Description</Label>
                <Textarea value={description} onChange={e => setDescription(e.target.value)}
                  placeholder="When should this trigger group fire? What signals indicate this playbook is needed?"
                  style={{ marginTop: 6, fontSize: 13, resize: "none", minHeight: 80 }} />
              </div>
              <div>
                <Label style={{ fontSize: 12, fontWeight: 700, color: NAVY, textTransform: "uppercase", letterSpacing: "0.05em" }}>Alert Severity</Label>
                <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                  {SEVERITY_OPTIONS.map(s => (
                    <button
                      key={s.value}
                      onClick={() => setSeverity(s.value)}
                      style={{
                        flex: 1, padding: "8px 4px", borderRadius: 0, border: severity === s.value ? `2px solid ${s.color}` : "2px solid #E5E7EB",
                        background: severity === s.value ? `${s.color}12` : "white", cursor: "pointer",
                        fontSize: 12, fontWeight: 700, color: s.color, textAlign: "center",
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === "points" && (
            <div>
              <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 14, lineHeight: 1.5 }}>
                Select the data points that compose this trigger. Each point will be monitored individually. You'll set thresholds in the next step.
              </p>
              <DataPointPicker selected={selectedPoints} onToggle={togglePoint} />
              {selectedPoints.length > 0 && (
                <div style={{ marginTop: 12, padding: "10px 14px", background: `${TEAL}08`, border: `1px solid ${TEAL}30`, borderRadius: 0 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: TEAL }}>{selectedPoints.length} data point{selectedPoints.length !== 1 ? "s" : ""} selected</span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                    {selectedPoints.map(p => (
                      <span key={p.id} style={{ fontSize: 11, padding: "3px 8px", background: "white", border: `1px solid ${TEAL}40`, borderRadius: 0, color: NAVY, fontWeight: 500 }}>
                        {p.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === "thresholds" && (
            <div>
              <div style={{ marginBottom: 16, padding: "14px 16px", background: `${GOLD}08`, border: `1px solid ${GOLD}30`, borderRadius: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 4 }}>Group Threshold</p>
                <p style={{ fontSize: 12, color: "#6B7280", marginBottom: 12 }}>
                  How many data points must be valid before this trigger fires? Mandatory points must always be valid regardless of this count.
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 13, color: "#6B7280" }}>Fire when at least</span>
                  <Select value={String(minimumRequired)} onValueChange={v => setMinimumRequired(Number(v))}>
                    <SelectTrigger style={{ width: 70, fontSize: 13, fontWeight: 700, color: NAVY }}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedPoints.map((_, i) => (
                        <SelectItem key={i + 1} value={String(i + 1)}>{i + 1}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span style={{ fontSize: 13, color: "#6B7280" }}>of {selectedPoints.length} data points are valid</span>
                </div>
              </div>

              <p style={{ fontSize: 12, fontWeight: 700, color: NAVY, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>
                Individual Data Point Thresholds
              </p>
              {selectedPoints.map(dp => (
                <div key={dp.id} style={{ border: `1px solid #E5E7EB`, borderRadius: 0, padding: "14px 16px", marginBottom: 10, background: dp.mandatory ? "#FEF2F230" : "white" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 2 }}>{dp.name}</p>
                      <p style={{ fontSize: 11, color: "#9CA3AF" }}>{dp.categoryName}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Label style={{ fontSize: 11, fontWeight: 600, color: dp.mandatory ? "#EF4444" : "#6B7280", display: "flex", alignItems: "center", gap: 4 }}>
                        <Lock size={11} /> Mandatory
                      </Label>
                      <Switch
                        checked={dp.mandatory}
                        onCheckedChange={v => updatePoint(dp.id, { mandatory: v })}
                        style={{ transform: "scale(0.85)" }}
                      />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <Select value={dp.operator} onValueChange={v => updatePoint(dp.id, { operator: v })}>
                      <SelectTrigger style={{ flex: 2, fontSize: 13 }}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {OPERATORS.map(op => <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      value={dp.value}
                      onChange={e => updatePoint(dp.id, { value: Number(e.target.value) })}
                      style={{ flex: 1, fontSize: 13 }}
                      placeholder="Value"
                    />
                    {dp.unit && <span style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 500, minWidth: 30 }}>{dp.unit}</span>}
                  </div>
                  {dp.mandatory && (
                    <p style={{ fontSize: 11, color: "#EF4444", marginTop: 8, display: "flex", alignItems: "center", gap: 4 }}>
                      <AlertTriangle size={11} /> This point must fire for the trigger group to activate.
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter style={{ marginTop: 20, gap: 10 }}>
          {step !== "details" && (
            <Button variant="outline" onClick={() => setStep(step === "thresholds" ? "points" : "details")}>
              Back
            </Button>
          )}
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          {step !== "thresholds" ? (
            <Button
              disabled={!canProceed}
              onClick={() => setStep(step === "details" ? "points" : "thresholds")}
              style={{ background: GOLD, color: "white", border: "none", fontWeight: 700 }}
            >
              Continue
            </Button>
          ) : (
            <Button
              disabled={saveMutation.isPending || !name.trim()}
              onClick={() => saveMutation.mutate()}
              style={{ background: NAVY, color: "white", border: "none", fontWeight: 700 }}
            >
              {saveMutation.isPending ? "Saving..." : editing ? "Save Changes" : "Create Trigger Group"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Pre-Armed Signal card (read-only) ───────────────────────────────────────

const CATEGORY_LABELS: Record<string, string> = {
  competitive: "Competitive", market: "Market", financial: "Financial",
  regulatory: "Regulatory", supplychain: "Supply Chain", customer: "Customer",
  talent: "Talent", technology: "Technology", cyber: "Cybersecurity",
  media: "Media", geopolitical: "Geopolitical", economic: "Economic",
  partnership: "Partnership", execution: "Execution", behavior: "Customer Behavior",
  innovation: "Innovation", esg: "ESG", operational: "Operational",
  ai_governance: "AI Governance", brand_reputation: "Brand & Reputation",
};

const SEVERITY_COLORS: Record<string, string> = {
  low: "#6B7280", medium: "#F59E0B", high: "#EF4444", critical: "#7C3AED",
};

interface PreArmedSignal {
  id: string;
  name: string;
  category: string;
  severity: string;
  triggerType: string;
  currentStatus: string;
  lastTriggeredAt: string | null;
  triggerCount: number;
  directlyMapped: boolean;
}

interface PreArmedData {
  domainName: string;
  playbookName: string;
  totalWatching: number;
  directlyMapped: number;
  triggers: PreArmedSignal[];
}

function PreArmedSignalCard({ signal }: { signal: PreArmedSignal }) {
  const sevColor = SEVERITY_COLORS[signal.severity] ?? "#6B7280";
  const hasActivity = signal.triggerCount > 0;
  const lastFired = signal.lastTriggeredAt
    ? new Date(signal.lastTriggeredAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : null;

  return (
    <div style={{
      border: `1px solid ${signal.directlyMapped ? GOLD + "60" : "#E5E7EB"}`,
      borderTop: `3px solid ${signal.directlyMapped ? GOLD : sevColor}`,
      borderRadius: 0, padding: "14px 16px", background: signal.directlyMapped ? `${GOLD}04` : "white",
    }}>
      {signal.directlyMapped && (
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: GOLD, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            ⬡ Directly Mapped
          </span>
        </div>
      )}
      <p style={{ fontSize: 12, fontWeight: 700, color: NAVY, lineHeight: 1.4, marginBottom: 10 }}>
        {signal.name}
      </p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{
            fontSize: 10, fontWeight: 600, color: "#6B7280",
            background: "#F3F4F6", padding: "2px 6px", borderRadius: 0,
          }}>
            {CATEGORY_LABELS[signal.category] ?? signal.category}
          </span>
          <span style={{
            fontSize: 10, fontWeight: 700, color: sevColor,
            background: `${sevColor}12`, padding: "2px 6px", borderRadius: 0,
          }}>
            {signal.severity}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{
            width: 7, height: 7, borderRadius: "50%",
            background: hasActivity ? "#10B981" : "#D1D5DB",
          }} />
          <span style={{ fontSize: 10, color: "#9CA3AF" }}>
            {hasActivity ? (lastFired ? `Last fired ${lastFired}` : `${signal.triggerCount}× fired`) : "Monitoring"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function TriggerGroupManager({ playbookId }: { playbookId: string }) {
  const [builderOpen, setBuilderOpen] = useState(false);
  const [editing, setEditing] = useState<TriggerGroup | null>(null);
  const [showAllPreArmed, setShowAllPreArmed] = useState(false);

  const { data: groups = [], isLoading: groupsLoading } = useQuery<TriggerGroup[]>({
    queryKey: [`/api/playbooks/${playbookId}/trigger-groups`],
  });

  const { data: preArmed, isLoading: preArmedLoading } = useQuery<PreArmedData>({
    queryKey: [`/api/playbooks/${playbookId}/pre-armed-signals`],
  });

  const openEdit = (g: TriggerGroup) => { setEditing(g); setBuilderOpen(true); };
  const openNew = () => { setEditing(null); setBuilderOpen(true); };

  const visiblePreArmed = showAllPreArmed
    ? (preArmed?.triggers ?? [])
    : (preArmed?.triggers ?? []).slice(0, 9);

  return (
    <div>

      {/* ── Hero Status Banner ────────────────────────────────────────────── */}
      <div style={{
        background: `linear-gradient(135deg, ${NAVY} 0%, #1a2f6e 100%)`,
        borderRadius: 0, padding: "24px 32px", marginBottom: 36,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 20,
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#10B981", boxShadow: "0 0 0 3px #10B98130" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#10B981", textTransform: "uppercase", letterSpacing: "0.12em" }}>
              Live Monitoring Active
            </span>
          </div>
          <p style={{ fontSize: 24, fontWeight: 700, color: "white", marginBottom: 4 }}>
            {preArmedLoading ? "—" : preArmed?.totalWatching ?? 0} signals watching this playbook
          </p>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
            {preArmed?.domainName ? `${preArmed.domainName} domain` : "All domains"} ·{" "}
            {preArmed?.directlyMapped ?? 0} directly mapped ·{" "}
            {groups.length} custom trigger group{groups.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {[
            { label: "System Signals", value: preArmed?.totalWatching ?? 0, color: TEAL },
            { label: "Direct Maps", value: preArmed?.directlyMapped ?? 0, color: GOLD },
            { label: "Custom Groups", value: groups.length, color: "#A78BFA" },
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: "center", padding: "10px 20px", background: "rgba(255,255,255,0.07)", borderRadius: 0 }}>
              <p style={{ fontSize: 22, fontWeight: 700, color: stat.color, marginBottom: 2 }}>{stat.value}</p>
              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 1: Pre-Armed Signals ─────────────────────────────────── */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <div style={{ width: 28, height: 2, background: TEAL }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: TEAL, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Pre-Armed — System Signals
              </span>
            </div>
            <p style={{ fontSize: 13, color: "#6B7280", maxWidth: 560 }}>
              These signals were active the moment this playbook was created. Readiness OS monitors them continuously — no setup required.
            </p>
          </div>
          <span style={{
            fontSize: 11, fontWeight: 600, color: "#6B7280",
            background: "#F3F4F6", padding: "4px 10px", borderRadius: 0,
          }}>
            Read-only
          </span>
        </div>

        {preArmedLoading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ height: 90, background: "#F9F8F5", borderRadius: 0, animation: "pulse 1.5s infinite" }} />
            ))}
          </div>
        ) : visiblePreArmed.length === 0 ? (
          <div style={{ padding: "24px", border: "1px dashed #E5E7EB", borderRadius: 0, textAlign: "center" }}>
            <p style={{ fontSize: 13, color: "#9CA3AF" }}>No pre-armed signals found for this playbook domain.</p>
          </div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {visiblePreArmed.map(signal => (
                <PreArmedSignalCard key={signal.id} signal={signal} />
              ))}
            </div>
            {(preArmed?.triggers.length ?? 0) > 9 && (
              <button
                onClick={() => setShowAllPreArmed(v => !v)}
                style={{
                  display: "block", width: "100%", marginTop: 12, padding: "10px",
                  border: `1px solid #E5E7EB`, borderRadius: 0, background: "#F9F8F5",
                  fontSize: 12, fontWeight: 600, color: "#6B7280", cursor: "pointer",
                  textAlign: "center",
                }}
              >
                {showAllPreArmed
                  ? "Show fewer signals"
                  : `Show all ${preArmed?.triggers.length} signals →`}
              </button>
            )}
          </>
        )}
      </div>

      {/* ── Divider ───────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 36 }}>
        <div style={{ flex: 1, height: 1, background: "#E8E4DC" }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.1em", whiteSpace: "nowrap" }}>
          Your Precision Trigger Groups
        </span>
        <div style={{ flex: 1, height: 1, background: "#E8E4DC" }} />
      </div>

      {/* ── Section 2: Custom Trigger Groups ─────────────────────────────── */}
      <div>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <div style={{ width: 28, height: 2, background: GOLD }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: GOLD, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Custom — Your Trigger Groups
              </span>
            </div>
            <p style={{ fontSize: 13, color: "#6B7280", maxWidth: 560 }}>
              Layer precise, composite conditions on top of system monitoring. Define exact thresholds, mandatory signals, and group logic tailored to your organization.
            </p>
          </div>
          <Button onClick={openNew} style={{ background: GOLD, color: "white", border: "none", fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0 }}>
            <Plus size={15} style={{ marginRight: 6 }} />
            New Trigger Group
          </Button>
        </div>

        {groupsLoading ? (
          <div style={{ padding: 32, textAlign: "center", color: "#9CA3AF", fontSize: 14 }}>Loading...</div>
        ) : groups.length === 0 ? (
          <div style={{ padding: "36px 32px", textAlign: "center", border: `2px dashed ${GOLD}30`, borderRadius: 0, background: `${GOLD}03` }}>
            <Zap size={28} color={`${GOLD}60`} style={{ display: "block", margin: "0 auto 10px" }} />
            <p style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 6 }}>No custom trigger groups yet</p>
            <p style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 18, maxWidth: 380, margin: "0 auto 18px" }}>
              The system signals above are already watching. Add a custom group to define precise composite conditions with mandatory flags and group thresholds.
            </p>
            <Button onClick={openNew} style={{ background: GOLD, color: "white", border: "none", fontWeight: 700 }}>
              <Plus size={14} style={{ marginRight: 6 }} />
              Create First Trigger Group
            </Button>
          </div>
        ) : (
          <div>
            {groups.map(g => <TriggerGroupCard key={g.id} group={g} playbookId={playbookId} onEdit={openEdit} />)}
          </div>
        )}
      </div>

      <BuilderDialog
        open={builderOpen}
        onClose={() => { setBuilderOpen(false); setEditing(null); }}
        playbookId={playbookId}
        editing={editing}
      />
    </div>
  );
}
