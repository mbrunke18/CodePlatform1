import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import PageLayout from "@/components/layout/PageLayout";
import { useAuth } from "@/hooks/useAuth";
import { updatePageMetadata } from "@/lib/seo";
import {
  Activity, AlertTriangle, CheckCircle2, Clock, Users,
  Zap, BookOpen, ArrowRight, RefreshCw, Shield, TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const NAVY  = "#0A0F2E";
const GOLD  = "#C9A84C";
const TEAL  = "#2B8A6E";
const RED   = "#C0392B";
const AMBER = "#D97706";

interface PilotOrg {
  id: string;
  name: string;
  industry: string;
  subscriptionTier: string;
  createdAt: string;
  lastUserLoginAt: string | null;
  daysSinceLogin: number | null;
  health: "active" | "watch" | "stalled" | "pending";
  triggerDetections7d: number;
  triggerDetections30d: number;
  playbookActivations: number;
  stakeholderContactsCount: number;
  taskAcknowledgments30d: number;
  onboardingCompleted: boolean;
  milestone: "setup" | "dry-run" | "live" | "readout";
  pilotDayRemaining: number | null;
}

const HEALTH_CONFIG = {
  active:  { label: "Active",   bg: `${TEAL}20`,  border: `${TEAL}50`,  text: TEAL,  icon: CheckCircle2 },
  watch:   { label: "Watch",    bg: "#D9770620",   border: "#D9770650",   text: AMBER, icon: AlertTriangle },
  stalled: { label: "Stalled",  bg: `${RED}20`,   border: `${RED}50`,   text: RED,   icon: AlertTriangle },
  pending: { label: "Pending",  bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.15)", text: "rgba(255,255,255,0.4)", icon: Clock },
};

const MILESTONE_CONFIG = {
  setup:    { label: "Setup",    color: "rgba(255,255,255,0.3)" },
  "dry-run":{ label: "Dry Run", color: GOLD },
  live:     { label: "Live",     color: TEAL },
  readout:  { label: "Readout",  color: "#8B5CF6" },
};

function StatCell({ value, label, accent }: { value: string | number; label: string; accent?: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: accent || "#fff", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 4 }}>{label}</div>
    </div>
  );
}

function PilotCard({ org }: { org: PilotOrg }) {
  const hc = HEALTH_CONFIG[org.health];
  const mc = MILESTONE_CONFIG[org.milestone];
  const Icon = hc.icon;

  const loginLabel = org.daysSinceLogin === null
    ? "Never logged in"
    : org.daysSinceLogin === 0
    ? "Today"
    : `${org.daysSinceLogin}d ago`;

  const progressPct = org.pilotDayRemaining !== null
    ? Math.round(((90 - org.pilotDayRemaining) / 90) * 100)
    : 0;

  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: `1px solid ${hc.border}`,
      borderRadius: 0,
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{ padding: "18px 22px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{org.name}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{org.industry}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, background: hc.bg, border: `1px solid ${hc.border}`, borderRadius: 0, padding: "3px 10px" }}>
            <Icon size={10} color={hc.text} />
            <span style={{ fontSize: 10, fontWeight: 700, color: hc.text, letterSpacing: "0.08em" }}>{hc.label}</span>
          </div>
          <div style={{ fontSize: 10, fontWeight: 700, color: mc.color, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            {mc.label}
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: "rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        {[
          { v: org.triggerDetections7d,     label: "Triggers 7d",  accent: org.triggerDetections7d > 0 ? TEAL : undefined },
          { v: org.triggerDetections30d,    label: "Triggers 30d", accent: undefined },
          { v: org.playbookActivations,     label: "Activations",  accent: org.playbookActivations > 0 ? GOLD : undefined },
          { v: org.stakeholderContactsCount,label: "Contacts",     accent: org.stakeholderContactsCount >= 3 ? TEAL : AMBER },
        ].map((s, i) => (
          <div key={i} style={{ background: "rgba(10,15,46,0.6)", padding: "14px 8px" }}>
            <StatCell value={s.v} label={s.label} accent={s.accent} />
          </div>
        ))}
      </div>

      {/* Footer row */}
      <div style={{ padding: "12px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Clock size={11} color="rgba(255,255,255,0.3)" />
          <span style={{ fontSize: 11, color: org.daysSinceLogin !== null && org.daysSinceLogin > 7 ? AMBER : "rgba(255,255,255,0.4)" }}>
            Last login: {loginLabel}
          </span>
        </div>
        {org.pilotDayRemaining !== null && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 60, height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 0, overflow: "hidden" }}>
              <div style={{ width: `${progressPct}%`, height: "100%", background: progressPct >= 75 ? AMBER : TEAL, borderRadius: 0, transition: "width 0.3s" }} />
            </div>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>
              {org.pilotDayRemaining}d left
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PilotHealthMonitor() {
  const { user } = useAuth();

  useEffect(() => {
    updatePageMetadata({
      title: "Pilot Health Monitor — Readiness OS Admin",
      description: "Real-time health view for all active pilot organizations.",
    });
  }, []);

  const { data, isLoading, refetch, dataUpdatedAt } = useQuery<{ orgs: PilotOrg[]; generatedAt: string }>({
    queryKey: ["/api/admin/pilot-health"],
    refetchInterval: 5 * 60 * 1000,
  });

  const orgs = data?.orgs ?? [];
  const summary = {
    total:   orgs.length,
    active:  orgs.filter(o => o.health === "active").length,
    watch:   orgs.filter(o => o.health === "watch").length,
    stalled: orgs.filter(o => o.health === "stalled").length,
    live:    orgs.filter(o => o.milestone === "live").length,
  };

  const lastRefreshed = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : "—";

  if (user?.role !== "admin") {
    return (
      <PageLayout>
        <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <Shield size={40} color={GOLD} style={{ marginBottom: 16 }} />
            <div style={{ fontSize: 18, fontWeight: 700, color: NAVY, marginBottom: 8 }}>Admin Access Required</div>
            <div style={{ fontSize: 14, color: "#666" }}>This page is only accessible to platform administrators.</div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div style={{ background: NAVY, minHeight: "100vh", padding: "40px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, marginBottom: 32, flexWrap: "wrap" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ width: 3, height: 20, background: GOLD, borderRadius: 0 }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD }}>Admin · Internal View</span>
              </div>
              <h1 style={{ fontSize: 28, fontWeight: 700, color: "#fff", margin: 0, lineHeight: 1.1 }}>Pilot Health Monitor</h1>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", marginTop: 8 }}>
                Real-time engagement and milestone tracking across all pilot organizations.
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Updated {lastRefreshed}</span>
              <Button
                onClick={() => refetch()}
                variant="outline"
                size="sm"
                style={{ borderColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)", background: "transparent" }}
              >
                <RefreshCw size={12} className="mr-2" /> Refresh
              </Button>
              <Link href="/admin/customer-health">
                <Button variant="outline" size="sm" style={{ borderColor: `${GOLD}40`, color: GOLD, background: "transparent" }}>
                  Customer Health <ArrowRight size={12} className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Summary strip */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 28 }}>
            {[
              { label: "Total Orgs",    value: summary.total,   icon: Users,       color: "rgba(255,255,255,0.7)" },
              { label: "Active (≤2d)",  value: summary.active,  icon: Activity,    color: TEAL },
              { label: "Watch (3–7d)",  value: summary.watch,   icon: AlertTriangle, color: AMBER },
              { label: "Stalled (7d+)", value: summary.stalled, icon: AlertTriangle, color: RED },
              { label: "In Live Phase", value: summary.live,    icon: Zap,         color: GOLD },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 0, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
                  <Icon size={18} color={s.color} />
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: s.color, lineHeight: 1 }}>{isLoading ? "—" : s.value}</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 4 }}>{s.label}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 20, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Milestone:</span>
            {(Object.entries(MILESTONE_CONFIG) as [string, { label: string; color: string }][]).map(([k, v]) => (
              <div key={k} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: v.color }} />
                <span style={{ fontSize: 11, color: v.color }}>{v.label}</span>
              </div>
            ))}
            <div style={{ width: 1, height: 14, background: "rgba(255,255,255,0.1)" }} />
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Health:</span>
            {(Object.entries(HEALTH_CONFIG) as [string, typeof HEALTH_CONFIG.active][]).map(([k, v]) => (
              <div key={k} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: v.text }} />
                <span style={{ fontSize: 11, color: v.text }}>{v.label}</span>
              </div>
            ))}
          </div>

          {/* Grid */}
          {isLoading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 0, height: 180, animation: "pulse 1.5s ease-in-out infinite" }} />
              ))}
            </div>
          ) : orgs.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <BookOpen size={40} color="rgba(255,255,255,0.15)" style={{ marginBottom: 16 }} />
              <div style={{ fontSize: 16, color: "rgba(255,255,255,0.4)" }}>No pilot organizations yet.</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.25)", marginTop: 8 }}>Organizations will appear here once pilots are active.</div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
              {orgs.map(org => <PilotCard key={org.id} org={org} />)}
            </div>
          )}

          {/* Footer note */}
          <div style={{ marginTop: 32, padding: "16px 20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 0, display: "flex", alignItems: "center", gap: 10 }}>
            <TrendingUp size={14} color={GOLD} />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
              Health is based on last user login: Active ≤2 days · Watch 3–7 days · Stalled 7+ days. Weekly digest emails send automatically every Monday. Compound threat scans run every 4 hours.
            </span>
          </div>

        </div>
      </div>
    </PageLayout>
  );
}
