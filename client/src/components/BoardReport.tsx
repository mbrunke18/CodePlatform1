import { useState } from "react";
import { FileText, Download, Clock, CheckCircle2, Users, DollarSign, ArrowRight, Shield, Zap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const CG = { fontFamily: "'Cormorant Garamond', serif" };

interface BoardReportData {
  activationId: string;
  playbookName: string;
  domain: string;
  trigger: string;
  situationSummary: string;
  activatedAt: string;
  completedAt: string | null;
  elapsedMinutes: number;
  authorizedBy: string;
  tasksCompleted: number;
  tasksTotal: number;
  stakeholdersNotified: number;
  valuePreserved: string;
  outcomeRating: number | null;
  nextSteps: string[];
  organizationName: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function PrintableReport({ data }: { data: BoardReportData }) {
  return (
    <div style={{ fontFamily: "Georgia, serif", maxWidth: 720, margin: "0 auto", padding: "40px 48px", background: "#fff", color: NAVY }}>
      <div style={{ borderBottom: `3px solid ${GOLD}`, paddingBottom: 20, marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD, marginBottom: 6 }}>Board Activation Report · Confidential</div>
            <h1 style={{ ...CG, fontSize: 26, fontWeight: 600, color: NAVY, margin: 0, lineHeight: 1.2 }}>{data.playbookName}</h1>
            <p style={{ fontSize: 12, color: "#6B7280", margin: "6px 0 0" }}>{data.organizationName} · {formatDate(data.activatedAt)}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#9CA3AF" }}>Execution Time</div>
            <div style={{ ...CG, fontSize: 36, fontWeight: 700, color: data.elapsedMinutes <= 12 ? TEAL : GOLD, lineHeight: 1 }}>{data.elapsedMinutes}m</div>
            <div style={{ fontSize: 9, color: "#9CA3AF" }}>Target: 12 minutes</div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, marginBottom: 8 }}>01 — Situation</div>
        <p style={{ fontSize: 13, lineHeight: 1.7, color: NAVY, margin: 0, borderLeft: `3px solid ${GOLD}`, paddingLeft: 14 }}>{data.situationSummary || data.trigger}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
        {[
          { icon: "⚡", label: "Prepared response Deployed", value: data.playbookName.split("—")[0].trim() },
          { icon: "✓", label: "Executive Authorization", value: data.authorizedBy },
          { icon: "👥", label: "Stakeholders Notified", value: `${data.stakeholdersNotified} contacts` },
          { icon: "📋", label: "Tasks Completed", value: `${data.tasksCompleted}/${data.tasksTotal}` },
        ].map((item) => (
          <div key={item.label} style={{ padding: "12px 14px", background: "#F8F7F4", borderTop: `2px solid ${NAVY}` }}>
            <div style={{ fontSize: 16, marginBottom: 6 }}>{item.icon}</div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9CA3AF", marginBottom: 4 }}>{item.label}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: NAVY }}>{item.value}</div>
          </div>
        ))}
      </div>

      {data.valuePreserved && (
        <div style={{ padding: "14px 18px", background: "rgba(43,138,110,0.06)", border: `1px solid rgba(43,138,110,0.2)`, marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: TEAL }}>Value Preserved</div>
          <div style={{ ...CG, fontSize: 20, fontWeight: 700, color: TEAL }}>{data.valuePreserved}</div>
          <div style={{ fontSize: 11, color: "#6B7280", marginLeft: "auto" }}>
            30-day mobilization cycle compressed to {data.elapsedMinutes} minutes · 3,600× execution head start
          </div>
        </div>
      )}

      {data.nextSteps.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, marginBottom: 10 }}>02 — Recommended Next Steps</div>
          {data.nextSteps.map((step, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: GOLD, flexShrink: 0, paddingTop: 2 }}>{String(i + 1).padStart(2, "0")}</span>
              <span style={{ fontSize: 12, color: NAVY, lineHeight: 1.5 }}>{step}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ borderTop: `1px solid #E8E4DC`, paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 10, color: "#9CA3AF" }}>Generated by Readiness OS · VaughnMartin · {new Date().toLocaleDateString()}</div>
        {data.outcomeRating && (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9CA3AF" }}>Outcome Rating</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: data.outcomeRating >= 4 ? TEAL : GOLD }}>{data.outcomeRating}/5</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BoardReport({ activationId }: { activationId: string }) {
  const [expanded, setExpanded] = useState(false);

  const { data, isLoading } = useQuery<BoardReportData>({
    queryKey: ["/api/activations", activationId, "board-report"],
    queryFn: () => fetch(`/api/activations/${activationId}/board-report`).then(r => r.json()),
    enabled: !!activationId,
  });

  const handlePrint = () => {
    window.print();
  };

  if (isLoading || !data) {
    return (
      <div style={{ border: "1px solid #E8E4DC", background: "#fff", padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <FileText style={{ width: 16, height: 16, color: GOLD }} />
          <span style={{ fontSize: 12, color: "#6B7280" }}>Generating board report…</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ border: `1px solid ${GOLD}`, background: "#fff" }}>
      <div
        style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", background: "rgba(201,168,76,0.05)", borderBottom: expanded ? `1px solid ${GOLD}` : "none" }}
        onClick={() => setExpanded(!expanded)}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <FileText style={{ width: 18, height: 18, color: GOLD }} />
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: GOLD }}>Board-Ready Report</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>{data.playbookName}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", background: data.elapsedMinutes <= 12 ? "rgba(43,138,110,0.1)" : "rgba(201,168,76,0.1)" }}>
            <Clock style={{ width: 10, height: 10, color: data.elapsedMinutes <= 12 ? TEAL : GOLD }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: data.elapsedMinutes <= 12 ? TEAL : GOLD }}>{data.elapsedMinutes}m execution</span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); handlePrint(); }}
            style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", background: NAVY, color: "#fff", border: "none", cursor: "pointer", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}
          >
            <Download style={{ width: 10, height: 10 }} /> Export
          </button>
        </div>
      </div>

      {expanded && (
        <div style={{ padding: 0 }}>
          <div style={{ padding: "12px 20px", background: "#F8F7F4", borderBottom: "1px solid #E8E4DC", display: "flex", gap: 24 }}>
            {[
              { label: "Stakeholders", value: data.stakeholdersNotified, icon: Users },
              { label: "Tasks Done", value: `${data.tasksCompleted}/${data.tasksTotal}`, icon: CheckCircle2 },
              { label: "Value Preserved", value: data.valuePreserved || "—", icon: DollarSign },
              { label: "Time to Deploy", value: `${data.elapsedMinutes}m`, icon: Zap },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Icon style={{ width: 12, height: 12, color: GOLD }} />
                <span style={{ fontSize: 10, color: "#6B7280" }}>{label}:</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: NAVY }}>{value}</span>
              </div>
            ))}
          </div>
          <div style={{ maxHeight: 600, overflowY: "auto" }}>
            <PrintableReport data={data} />
          </div>
        </div>
      )}
    </div>
  );
}
