import { useQuery, useMutation } from "@tanstack/react-query";
import PageLayout from "@/components/layout/PageLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  AlertTriangle, Clock, Eye, CheckCircle2, TrendingUp,
  Shield, ArrowRight, FileText, RefreshCw, Activity
} from "lucide-react";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const RED = "#dc2626";
const OFF = "#F8F7F4";
const BORDER = "#E8E4DC";
const MUTED = "#6B7280";
const CG = { fontFamily: "'Cormorant Garamond', Georgia, serif" };

function ageLabel(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  return `${Math.floor(minutes / 1440)}d ${Math.floor((minutes % 1440) / 60)}h`;
}

function EscalationBadge({ level }: { level: string }) {
  const config = {
    BOARD: { bg: `${RED}12`, color: RED, border: `${RED}30`, label: "BOARD LEVEL" },
    EXECUTIVE: { bg: `${GOLD}12`, color: GOLD, border: `${GOLD}30`, label: "EXECUTIVE" },
    MONITORING: { bg: `${TEAL}08`, color: TEAL, border: `${TEAL}20`, label: "MONITORING" },
  }[level] ?? { bg: OFF, color: MUTED, border: BORDER, label: level };
  return (
    <span style={{
      fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase",
      background: config.bg, color: config.color, border: `1px solid ${config.border}`,
      padding: "2px 8px",
    }}>
      {config.label}
    </span>
  );
}

function SignalRow({ signal, onAcknowledge, isPending }: {
  signal: any;
  onAcknowledge: (id: number) => void;
  isPending: boolean;
}) {
  const isBoard = signal.escalationLevel === 'BOARD';
  const isExec = signal.escalationLevel === 'EXECUTIVE';
  const borderColor = isBoard ? RED : isExec ? GOLD : TEAL;

  return (
    <div style={{
      border: `1px solid ${borderColor}30`,
      borderLeft: `4px solid ${borderColor}`,
      background: "#fff",
      padding: "16px 20px",
      display: "flex",
      gap: 16,
      alignItems: "flex-start",
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
          <EscalationBadge level={signal.escalationLevel} />
          {signal.triggerDomain && (
            <span style={{ fontSize: 9, color: MUTED, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {signal.triggerDomain}
            </span>
          )}
          <span style={{ fontSize: 10, color: MUTED, marginLeft: "auto" }}>
            <Clock style={{ width: 10, height: 10, display: "inline", marginRight: 3 }} />
            {ageLabel(signal.ageMinutes)} unacted · {signal.cycles} monitoring cycle{signal.cycles !== 1 ? 's' : ''}
          </span>
        </div>

        <div style={{ ...CG, fontSize: 17, fontWeight: 600, color: NAVY, marginBottom: 4 }}>{signal.triggerName}</div>
        <p style={{ fontSize: 12, color: MUTED, lineHeight: 1.6, marginBottom: 8 }}>{signal.signalDescription}</p>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {signal.signalSource && (
            <span style={{ fontSize: 11, color: MUTED }}>
              Source: <strong style={{ color: NAVY }}>{signal.signalSource}</strong>
            </span>
          )}
          <span style={{ fontSize: 11, color: MUTED }}>
            Confidence: <strong style={{ color: signal.confidenceScore >= 75 ? RED : GOLD }}>{signal.confidenceScore}%</strong>
          </span>
          {signal.recommendedPlaybook && (
            <span style={{ fontSize: 11, color: MUTED }}>
              Recommended: <strong style={{ color: TEAL }}>{signal.recommendedPlaybook}</strong>
            </span>
          )}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
        <Button
          onClick={() => onAcknowledge(signal.id)}
          disabled={isPending}
          style={{ background: NAVY, color: "#fff", borderRadius: 0, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}
        >
          <Eye style={{ width: 12, height: 12, marginRight: 6 }} />
          Acknowledge
        </Button>
        {signal.recommendedPlaybook && (
          <Button variant="outline" style={{ borderRadius: 0, border: `1px solid ${BORDER}`, fontSize: 11, whiteSpace: "nowrap" }}>
            <ArrowRight style={{ width: 12, height: 12, marginRight: 6 }} />
            Activate Playbook
          </Button>
        )}
      </div>
    </div>
  );
}

export default function SignalAccountability() {
  const { toast } = useToast();

  const { data, isLoading, refetch, dataUpdatedAt } = useQuery<any>({
    queryKey: ["/api/signal-accountability"],
    queryFn: () => fetch("/api/signal-accountability").then(r => r.json()),
    refetchInterval: 60000,
  });

  const acknowledgeMutation = useMutation({
    mutationFn: (id: number) => apiRequest("POST", `/api/detections/${id}/acknowledge`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/signal-accountability"] });
      toast({ title: "Signal acknowledged", description: "Recorded decision logged to governance chain." });
    },
  });

  const summary = data?.summary ?? { total: 0, boardEscalated: 0, executiveEscalated: 0, monitoring: 0 };
  const boardEscalated: any[] = data?.boardEscalated ?? [];
  const executiveEscalated: any[] = data?.executiveEscalated ?? [];
  const monitoring: any[] = data?.monitoring ?? [];

  return (
    <PageLayout>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px" }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{ width: 32, height: 2, background: GOLD }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: GOLD }}>
              Governance Report
            </span>
          </div>
          <h1 style={{ ...CG, fontSize: 36, fontWeight: 700, color: NAVY, marginBottom: 8 }}>
            Signal Accountability Report
          </h1>
          <p style={{ fontSize: 14, color: MUTED, maxWidth: 640, lineHeight: 1.7 }}>
            Every signal the system classified but no one acted on is recorded here. The choice not to act is not invisible — it is a governance decision with a timestamp. Signals that persist across two or more monitoring cycles escalate automatically up the accountability chain.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 16 }}>
            <span style={{ fontSize: 11, color: MUTED }}>
              {dataUpdatedAt ? `Generated ${new Date(dataUpdatedAt).toLocaleTimeString()}` : "Loading..."}
            </span>
            <Button variant="outline" onClick={() => refetch()} style={{ borderRadius: 0, border: `1px solid ${BORDER}`, fontSize: 11 }}>
              <RefreshCw style={{ width: 12, height: 12, marginRight: 6 }} /> Refresh
            </Button>
          </div>
        </div>

        {/* Summary stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 36 }}>
          {[
            { label: "Total Unacted", value: summary.total, color: NAVY, icon: Activity },
            { label: "Board-Level", value: summary.boardEscalated, color: RED, icon: AlertTriangle },
            { label: "Executive", value: summary.executiveEscalated, color: GOLD, icon: Shield },
            { label: "Monitoring", value: summary.monitoring, color: TEAL, icon: Eye },
          ].map(({ label, value, color, icon: Icon }) => (
            <div key={label} style={{ padding: "18px 20px", background: "#fff", border: `1px solid ${BORDER}`, borderTop: `3px solid ${color}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Icon style={{ width: 14, height: 14, color }} />
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: MUTED }}>{label}</span>
              </div>
              <div style={{ ...CG, fontSize: 36, fontWeight: 700, color, lineHeight: 1 }}>{isLoading ? "—" : value}</div>
            </div>
          ))}
        </div>

        {/* Escalation logic callout */}
        <div style={{ padding: "14px 18px", background: `${NAVY}04`, border: `1px solid ${NAVY}15`, borderLeft: `3px solid ${NAVY}`, marginBottom: 32, display: "flex", gap: 12, alignItems: "flex-start" }}>
          <TrendingUp style={{ width: 16, height: 16, color: NAVY, flexShrink: 0, marginTop: 1 }} />
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: NAVY, marginBottom: 3 }}>Automatic escalation logic</div>
            <div style={{ fontSize: 11, color: MUTED, lineHeight: 1.6 }}>
              <strong>Monitoring:</strong> Signal detected, no action taken yet (under 2 cycles · 30 min) ·{" "}
              <strong>Executive:</strong> Signal persisted across 2–3 monitoring cycles without acknowledgment ·{" "}
              <strong>Board-Level:</strong> Signal unacted for 4+ cycles (1 hour+). Requires board-level review.
            </div>
          </div>
        </div>

        {isLoading && (
          <div style={{ textAlign: "center", padding: "60px 0", color: MUTED }}>
            <Activity style={{ width: 32, height: 32, margin: "0 auto 12px", opacity: 0.4 }} />
            <p style={{ fontSize: 13 }}>Loading signal accountability data...</p>
          </div>
        )}

        {!isLoading && summary.total === 0 && (
          <div style={{ textAlign: "center", padding: "60px 24px", border: `1px solid ${BORDER}`, background: "#fff" }}>
            <CheckCircle2 style={{ width: 40, height: 40, color: TEAL, margin: "0 auto 16px" }} />
            <div style={{ ...CG, fontSize: 24, fontWeight: 600, color: NAVY, marginBottom: 8 }}>No unacted signals</div>
            <p style={{ fontSize: 13, color: MUTED }}>All classified signals have been acknowledged or dismissed. The governance chain is clear.</p>
          </div>
        )}

        {/* Board-level escalated */}
        {boardEscalated.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <AlertTriangle style={{ width: 16, height: 16, color: RED }} />
              <h2 style={{ fontSize: 13, fontWeight: 700, color: RED, textTransform: "uppercase", letterSpacing: "0.15em" }}>
                Board-Level Escalation — Requires Immediate Attention
              </h2>
              <span style={{ fontSize: 11, background: `${RED}12`, color: RED, border: `1px solid ${RED}30`, padding: "1px 8px", fontWeight: 700 }}>{boardEscalated.length}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {boardEscalated.map(s => (
                <SignalRow key={s.id} signal={s} onAcknowledge={acknowledgeMutation.mutate} isPending={acknowledgeMutation.isPending} />
              ))}
            </div>
          </div>
        )}

        {/* Executive-level escalated */}
        {executiveEscalated.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <Shield style={{ width: 16, height: 16, color: GOLD }} />
              <h2 style={{ fontSize: 13, fontWeight: 700, color: GOLD, textTransform: "uppercase", letterSpacing: "0.15em" }}>
                Executive Escalation — Action Required
              </h2>
              <span style={{ fontSize: 11, background: `${GOLD}12`, color: GOLD, border: `1px solid ${GOLD}30`, padding: "1px 8px", fontWeight: 700 }}>{executiveEscalated.length}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {executiveEscalated.map(s => (
                <SignalRow key={s.id} signal={s} onAcknowledge={acknowledgeMutation.mutate} isPending={acknowledgeMutation.isPending} />
              ))}
            </div>
          </div>
        )}

        {/* Monitoring signals */}
        {monitoring.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <Eye style={{ width: 16, height: 16, color: TEAL }} />
              <h2 style={{ fontSize: 13, fontWeight: 700, color: TEAL, textTransform: "uppercase", letterSpacing: "0.15em" }}>
                Monitoring — Under First Cycle
              </h2>
              <span style={{ fontSize: 11, background: `${TEAL}10`, color: TEAL, border: `1px solid ${TEAL}20`, padding: "1px 8px", fontWeight: 700 }}>{monitoring.length}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {monitoring.map(s => (
                <SignalRow key={s.id} signal={s} onAcknowledge={acknowledgeMutation.mutate} isPending={acknowledgeMutation.isPending} />
              ))}
            </div>
          </div>
        )}

        {/* Dr. Huang framework note */}
        <div style={{ padding: "20px 24px", background: `${NAVY}04`, border: `1px solid ${NAVY}15`, borderLeft: `3px solid ${GOLD}`, marginTop: 40 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: GOLD, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>Research Foundation</div>
          <p style={{ ...CG, fontSize: 17, fontWeight: 500, color: NAVY, lineHeight: 1.7, fontStyle: "italic", marginBottom: 8 }}>
            "Architecture creates the conditions where the choice to ignore is no longer invisible."
          </p>
          <p style={{ fontSize: 11, color: MUTED }}>Dr. Kerry Huang — ESI Top 1% Researcher, Forbes Business Council · 408-firm study on governance and accountability architecture</p>
          <p style={{ fontSize: 12, color: MUTED, marginTop: 8, lineHeight: 1.6 }}>
            This report is the accountability structure that closes the loop. The system surfaces every classified signal. What the organization does with that visibility is a recorded decision — not an invisible one.
          </p>
        </div>

      </div>
    </PageLayout>
  );
}
