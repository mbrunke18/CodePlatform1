import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  Target, Plus, CheckCircle2, AlertCircle, Zap, Edit2,
  Trash2, ChevronRight, Shield, DollarSign, TrendingUp,
  BarChart3, Star, Settings, Users, Globe, FileText
} from "lucide-react";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const TEAL_LIGHT = "#3BAF8A";
const MUTED = "#6B7280";
const BORDER = "#E8E4DC";

const IMPACT_ICONS: Record<string, any> = {
  revenue: DollarSign, market_share: TrendingUp, margin: BarChart3,
  compliance: Shield, reputation: Star, operations: Settings,
  customer: Users, talent: Globe,
};

const IMPACT_LABELS: Record<string, string> = {
  revenue: "Revenue", market_share: "Market Share", margin: "Margin",
  compliance: "Compliance", reputation: "Reputation", operations: "Operations",
  customer: "Customer", talent: "Talent",
};

const URGENCY_COLORS: Record<string, string> = {
  critical: "#DC2626", high: GOLD, medium: TEAL,
};

export default function SituationIntentsHub() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const { data: intents = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/situation-intents"],
    enabled: isAuthenticated,
  });

  const { data: triggers = [] } = useQuery<any[]>({
    queryKey: ["/api/executive-triggers"],
    enabled: isAuthenticated,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/situation-intents/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/situation-intents"] });
      toast({ title: "Situation intent removed" });
    },
    onError: () => toast({ title: "Error", description: "Failed to delete", variant: "destructive" }),
  });

  const configuredTriggerIds = new Set(intents.map((i: any) => i.triggerId));
  const unconfiguredTriggers = triggers.filter((t: any) => !configuredTriggerIds.has(t.id) && t.isActive !== false);
  const completionRate = triggers.length ? Math.round((intents.length / triggers.length) * 100) : 0;

  return (
    <div style={{ minHeight: "100vh", background: "#F8F7F4", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ background: NAVY, padding: "32px 40px 28px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
                <a href="/mission-control" style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.68)", fontSize: 11, fontWeight: 600, textDecoration: "none", letterSpacing: "0.06em" }}>
                  ← Mission Control
                </a>
                <div style={{ width: 1, height: 12, background: "rgba(255,255,255,0.15)" }} />
                <Target size={14} color={GOLD} />
                <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: GOLD }}>
                  The Install — Phase Configuration
                </span>
              </div>
              <h1 style={{ fontSize: 28, fontWeight: 700, color: "#fff", margin: "0 0 6px" }}>
                Situation Intents
              </h1>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", margin: 0, maxWidth: 580 }}>
                Define what you're protecting, what the executive needs to see, and who gets notified — 
                per situation. This is what makes authorization instantaneous when a trigger fires.
              </p>
            </div>
            <button
              onClick={() => setLocation("/identify/situation-intent/new")}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 22px", background: GOLD, border: "none", borderRadius: 0, fontSize: 14, fontWeight: 700, color: NAVY, cursor: "pointer" }}
            >
              <Plus size={16} />
              New Situation Intent
            </button>
          </div>

          {/* Stats bar */}
          <div style={{ display: "flex", gap: 24, marginTop: 28 }}>
            {[
              { label: "Configured", value: intents.length, color: TEAL_LIGHT },
              { label: "Unconfigured", value: unconfiguredTriggers.length, color: GOLD },
              { label: "Active Triggers", value: triggers.filter((t: any) => t.isActive !== false).length, color: "rgba(255,255,255,0.7)" },
              { label: "Install Completion", value: `${completionRate}%`, color: completionRate === 100 ? TEAL_LIGHT : GOLD },
            ].map(stat => (
              <div key={stat.label}>
                <div style={{ fontSize: 22, fontWeight: 700, color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "32px auto", padding: "0 40px" }}>

        {/* Progress bar */}
        {triggers.length > 0 && (
          <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 0, padding: "16px 20px", marginBottom: 28, display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: NAVY }}>Install Completion</span>
                <span style={{ fontSize: 12, color: MUTED }}>{intents.length} of {triggers.filter((t: any) => t.isActive !== false).length} situations configured</span>
              </div>
              <div style={{ height: 6, background: BORDER, borderRadius: 0, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${completionRate}%`, background: completionRate === 100 ? TEAL : GOLD, borderRadius: 0, transition: "width 0.5s" }} />
              </div>
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: completionRate === 100 ? TEAL : GOLD, minWidth: 52, textAlign: "right" }}>
              {completionRate}%
            </div>
          </div>
        )}

        {/* Configured intents */}
        {intents.length > 0 && (
          <div style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: NAVY, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <CheckCircle2 size={16} color={TEAL} />
              Configured Situations
            </h2>
            <div style={{ display: "grid", gap: 12 }}>
              {intents.map((intent: any) => {
                const ImpactIcon = IMPACT_ICONS[intent.businessImpact] || Target;
                const urgencyColor = URGENCY_COLORS[intent.urgencyLevel] || GOLD;
                return (
                  <div
                    key={intent.id}
                    style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 0, padding: "20px 24px", display: "flex", alignItems: "flex-start", gap: 20, transition: "box-shadow 0.15s" }}
                  >
                    <div style={{ width: 44, height: 44, borderRadius: 0, background: `${TEAL}10`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <ImpactIcon size={20} color={TEAL} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: NAVY }}>{intent.triggerName}</span>
                        <span style={{ fontSize: 10, fontWeight: 700, background: `${urgencyColor}15`, color: urgencyColor, padding: "2px 8px", borderRadius: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                          {intent.urgencyLevel}
                        </span>
                        {intent.businessImpact && (
                          <span style={{ fontSize: 10, fontWeight: 600, background: `${NAVY}08`, color: NAVY, padding: "2px 8px", borderRadius: 0 }}>
                            {IMPACT_LABELS[intent.businessImpact] || intent.businessImpact}
                          </span>
                        )}
                      </div>
                      {intent.protectedOutcome && (
                        <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.5, marginBottom: 10, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any, overflow: "hidden" }}>
                          {intent.protectedOutcome}
                        </p>
                      )}
                      <div style={{ display: "flex", gap: 16 }}>
                        {Array.isArray(intent.primaryDataPoints) && intent.primaryDataPoints.length > 0 && (
                          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            <BarChart3 size={11} color={TEAL} />
                            <span style={{ fontSize: 11, color: MUTED }}>{intent.primaryDataPoints.length} primary indicator{intent.primaryDataPoints.length !== 1 ? "s" : ""}</span>
                          </div>
                        )}
                        {Array.isArray(intent.briefRequirements) && intent.briefRequirements.length > 0 && (
                          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            <FileText size={11} color={TEAL} />
                            <span style={{ fontSize: 11, color: MUTED }}>{intent.briefRequirements.length} brief item{intent.briefRequirements.length !== 1 ? "s" : ""}</span>
                          </div>
                        )}
                        {Array.isArray(intent.situationStakeholders) && intent.situationStakeholders.length > 0 && (
                          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            <Users size={11} color={TEAL} />
                            <span style={{ fontSize: 11, color: MUTED }}>{intent.situationStakeholders.length} stakeholder{intent.situationStakeholders.length !== 1 ? "s" : ""}</span>
                          </div>
                        )}
                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <Shield size={11} color={TEAL} />
                          <span style={{ fontSize: 11, color: MUTED }}>{intent.sensitivityLevel} sensitivity</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                      <button
                        onClick={() => setLocation(`/identify/situation-intent/new?triggerId=${intent.triggerId}&triggerName=${encodeURIComponent(intent.triggerName)}&triggerDomain=${encodeURIComponent(intent.triggerDomain || "")}`)}
                        style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: `${NAVY}08`, border: `1px solid ${BORDER}`, borderRadius: 0, fontSize: 12, fontWeight: 600, color: NAVY, cursor: "pointer" }}
                      >
                        <Edit2 size={12} />
                        Edit
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate(intent.id)}
                        style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: 0, fontSize: 12, fontWeight: 600, color: "#DC2626", cursor: "pointer" }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Unconfigured triggers */}
        {unconfiguredTriggers.length > 0 && (
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: NAVY, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <AlertCircle size={16} color={GOLD} />
              Not Yet Configured ({unconfiguredTriggers.length})
            </h2>
            <div style={{ display: "grid", gap: 8 }}>
              {unconfiguredTriggers.map((trigger: any) => (
                <div
                  key={trigger.id}
                  style={{ background: "#fff", border: `1px dashed ${BORDER}`, borderRadius: 0, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16 }}
                >
                  <div style={{ width: 8, height: 8, borderRadius: 0, background: BORDER, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: MUTED }}>{trigger.name}</span>
                    {trigger.domain && <span style={{ fontSize: 12, color: BORDER, marginLeft: 8 }}>{trigger.domain}</span>}
                  </div>
                  <button
                    onClick={() => setLocation(`/identify/situation-intent/new?triggerId=${trigger.id}&triggerName=${encodeURIComponent(trigger.name)}&triggerDomain=${encodeURIComponent(trigger.domain || trigger.category || "")}`)}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: `${GOLD}10`, border: `1px solid ${GOLD}35`, borderRadius: 0, fontSize: 12, fontWeight: 700, color: GOLD, cursor: "pointer" }}
                  >
                    <Plus size={12} />
                    Configure
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {isLoading && (
          <div style={{ textAlign: "center", padding: 60, color: MUTED }}>
            <Target size={32} style={{ marginBottom: 12, opacity: 0.3 }} />
            <p>Loading situation intents...</p>
          </div>
        )}

        {!isLoading && intents.length === 0 && triggers.length === 0 && (
          <div style={{ textAlign: "center", padding: 80, background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 0 }}>
            <Target size={48} color={BORDER} style={{ marginBottom: 16 }} />
            <h3 style={{ fontSize: 18, fontWeight: 700, color: NAVY, marginBottom: 8 }}>No triggers configured yet</h3>
            <p style={{ fontSize: 14, color: MUTED, marginBottom: 24 }}>
              Set up triggers in Signal Configuration first, then return here to define the strategic intent for each situation.
            </p>
            <button
              onClick={() => setLocation("/detect/alerts")}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", background: NAVY, border: "none", borderRadius: 0, fontSize: 14, fontWeight: 600, color: "#fff", cursor: "pointer" }}
            >
              <Zap size={16} />
              Configure Alert Rules
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
