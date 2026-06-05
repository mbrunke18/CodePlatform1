import { useState } from "react";
import { useLocation } from "wouter";
import PageLayout from "@/components/layout/PageLayout";
import { VaughnMartinLogo } from "@/components/VaughnMartinLogo";
import { Shield, Download, Printer, CheckCircle, Clock, User, FileText, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const BORDER = "#E8E4DC";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
const BC: React.CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };

const SAMPLE_RECORD = {
  activationId: "ACT-2026-0047",
  protocol: "Ransomware Response & Business Continuity",
  protocolId: "Protocol #14",
  domain: "RISK & RESILIENCE",
  triggeredAt: "June 4, 2026 · 09:14 AM",
  authorizedAt: "June 4, 2026 · 09:22 AM",
  completedAt: "June 4, 2026 · 09:26 AM",
  responseTime: "12 minutes",
  authorizedBy: "Chief Executive Officer",
  authorizationMethod: "Platform console — executive sign-off captured",
  decision: "Full activation — execute exactly as pre-staged",
  deviations: "None. Protocol executed without modification.",
  classification: "Optimization",
  outcome: "Containment protocols deployed. IT, Legal, Communications, and Board workstreams activated simultaneously. Regulatory notification template distributed. No manual coordination required.",
  tasksDeployed: 18,
  stakeholdersNotified: 7,
  workstreams: ["IT Containment", "Legal Hold", "Regulator Notification", "Board Briefing", "Communications", "Insurance", "Recovery"],
  deltaFromPrior: "−3 min (ADVANCE update #12 applied: IT containment checklist refined after prior activation)",
  hypothesisStatus: "Proving: expected −3 min reduction from update #12. Measurement period: next 2 activations.",
  protocolVersion: "v4 (ADVANCE update #12, applied May 28, 2026)",
};

function Field({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: GOLD, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: accent ? 700 : 500, color: accent ? NAVY : "#374151", lineHeight: 1.5 }}>{value}</div>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 32, paddingBottom: 32, borderBottom: `1px solid ${BORDER}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{ width: 16, height: 1.5, background: GOLD }} />
        <span style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: NAVY }}>{label}</span>
        <div style={{ flex: 1, height: 1, background: BORDER }} />
      </div>
      {children}
    </div>
  );
}

export default function AuthorizationRecord() {
  const [copied, setCopied] = useState(false);
  const record = SAMPLE_RECORD;

  const handlePrint = () => window.print();
  const handleCopy = () => {
    navigator.clipboard.writeText(record.activationId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <PageLayout>
      {/* ── Action Bar ──────────────────────────────────────────────────── */}
      <div style={{ background: "#F8F7F4", borderBottom: `1px solid ${BORDER}`, padding: "14px 40px" }} className="print:hidden">
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Link href="/advance-intelligence">
              <button style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: NAVY, fontSize: 12, fontWeight: 600 }}>
                <ArrowLeft size={14} />
                ADVANCE Intelligence
              </button>
            </Link>
            <div style={{ width: 1, height: 16, background: BORDER }} />
            <span style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: GOLD }}>Authorization Record</span>
            <span style={{ ...BC, fontSize: 10, fontWeight: 600, color: "#6B7280", letterSpacing: "0.1em" }}>{record.activationId}</span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={handleCopy}
              style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: `1px solid ${BORDER}`, padding: "7px 14px", cursor: "pointer", fontSize: 11, fontWeight: 600, color: NAVY, borderRadius: "0.15rem" }}
            >
              {copied ? <CheckCircle size={13} style={{ color: TEAL }} /> : <FileText size={13} />}
              {copied ? "Copied" : "Copy ID"}
            </button>
            <button
              onClick={handlePrint}
              style={{ display: "flex", alignItems: "center", gap: 6, background: NAVY, border: "none", padding: "7px 18px", cursor: "pointer", fontSize: 11, fontWeight: 700, color: "#fff", letterSpacing: "0.1em", borderRadius: "0.15rem" }}
            >
              <Printer size={13} />
              Print / Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* ── Document ────────────────────────────────────────────────────── */}
      <div style={{ background: "#fff", minHeight: "100vh" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "56px 40px" }}>

          {/* Document Header */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 40, paddingBottom: 32, borderBottom: `2px solid ${NAVY}` }}>
            <div>
              <VaughnMartinLogo size={28} />
              <div style={{ marginTop: 20 }}>
                <div style={{ ...BC, fontSize: 9, fontWeight: 800, letterSpacing: "0.35em", textTransform: "uppercase", color: GOLD, marginBottom: 8 }}>Activation Authorization Record</div>
                <h1 style={{ ...CG, fontSize: "clamp(26px,2.8vw,36px)", fontWeight: 600, color: NAVY, lineHeight: 1.1, margin: 0 }}>
                  {record.protocol}
                </h1>
              </div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 32 }}>
              <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: "#6B7280", marginBottom: 4 }}>Record ID</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: NAVY, fontFamily: "monospace", marginBottom: 12 }}>{record.activationId}</div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#EBF5F1", padding: "5px 12px", borderRadius: "0.15rem" }}>
                <CheckCircle size={12} style={{ color: TEAL }} />
                <span style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: TEAL }}>Closed · {record.classification}</span>
              </div>
            </div>
          </div>

          {/* Section 1: Trigger & Timing */}
          <Section label="I · Trigger & Timing">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
              <Field label="Protocol" value={`${record.protocolId} — ${record.protocol}`} accent />
              <Field label="Strategic Domain" value={record.domain} />
              <Field label="Protocol Version" value={record.protocolVersion} />
              <Field label="Trigger Detected" value={record.triggeredAt} />
              <Field label="Executive Authorization" value={record.authorizedAt} />
              <Field label="Activation Completed" value={record.completedAt} />
            </div>
            <div style={{ marginTop: 8 }}>
              <Field label="Total Response Time" value={record.responseTime} accent />
            </div>
          </Section>

          {/* Section 2: Authorization */}
          <Section label="II · Executive Authorization">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 16 }}>
              <Field label="Authorized By" value={record.authorizedBy} accent />
              <Field label="Authorization Method" value={record.authorizationMethod} />
            </div>
            <div style={{ background: "#F8F7F4", border: `1px solid ${BORDER}`, borderLeft: `3px solid ${GOLD}`, padding: "20px 24px" }}>
              <Field label="Executive Decision" value={record.decision} accent />
              <Field label="Protocol Deviations" value={record.deviations} />
            </div>
            <div style={{ marginTop: 16, padding: "12px 16px", background: "#EBF5F1", display: "flex", alignItems: "flex-start", gap: 10 }}>
              <Shield size={14} style={{ color: TEAL, flexShrink: 0, marginTop: 2 }} />
              <p style={{ ...BC, fontSize: 12, color: TEAL, fontWeight: 600, margin: 0 }}>
                No Readiness Protocol activates without executive sign-off. Executive authority preserved — preparation compresses mobilization; the decision remains human.
              </p>
            </div>
          </Section>

          {/* Section 3: Execution Record */}
          <Section label="III · Execution Record">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, marginBottom: 20 }}>
              <div style={{ background: "#F8F7F4", border: `1px solid ${BORDER}`, padding: "16px 20px", textAlign: "center" }}>
                <div style={{ ...CG, fontSize: 32, fontWeight: 700, color: NAVY }}>{record.tasksDeployed}</div>
                <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6B7280" }}>Tasks Deployed</div>
              </div>
              <div style={{ background: "#F8F7F4", border: `1px solid ${BORDER}`, padding: "16px 20px", textAlign: "center" }}>
                <div style={{ ...CG, fontSize: 32, fontWeight: 700, color: TEAL }}>{record.stakeholdersNotified}</div>
                <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6B7280" }}>Stakeholders Notified</div>
              </div>
              <div style={{ background: "#F8F7F4", border: `1px solid ${BORDER}`, padding: "16px 20px", textAlign: "center" }}>
                <div style={{ ...CG, fontSize: 32, fontWeight: 700, color: GOLD }}>{record.workstreams.length}</div>
                <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6B7280" }}>Workstreams Active</div>
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: GOLD, marginBottom: 8 }}>Workstreams Deployed</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {record.workstreams.map((w) => (
                  <span key={w} style={{ display: "inline-flex", alignItems: "center", gap: 5, border: `1px solid ${BORDER}`, padding: "4px 10px", fontSize: 12, fontWeight: 600, color: NAVY }}>
                    <CheckCircle size={11} style={{ color: TEAL }} />
                    {w}
                  </span>
                ))}
              </div>
            </div>
            <Field label="Outcome Summary" value={record.outcome} />
          </Section>

          {/* Section 4: ADVANCE Learning Record */}
          <Section label="IV · ADVANCE Learning Record">
            <div style={{ background: "#F8F7F4", border: `1px solid ${BORDER}`, padding: "24px 28px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 16 }}>
                <Field label="Response Time Delta vs. Prior Activation" value={record.deltaFromPrior} accent />
                <Field label="Protocol Version at Activation" value={record.protocolVersion} />
              </div>
              <Field label="Active Hypothesis" value={record.hypothesisStatus} />
              <div style={{ marginTop: 12, padding: "10px 14px", background: "#fff", border: `1px solid ${TEAL}30`, display: "flex", alignItems: "flex-start", gap: 8 }}>
                <Clock size={13} style={{ color: TEAL, flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontSize: 12, color: "#374151", margin: 0, lineHeight: 1.6 }}>
                  ADVANCE 2.0 will automatically measure this hypothesis against the next activation on Protocol #14 and classify as proven or disproven. Results appear in the Learning Velocity Index.
                </p>
              </div>
            </div>
          </Section>

          {/* Section 5: Debrief Classification */}
          <Section label="V · Close-Out & Debrief Classification">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <Field label="Debrief Classification" value={record.classification} accent />
              <Field label="Behavioral Confidence Event" value="Protocol executed as pre-staged. No deviation recorded. Contributes to Protocol Adherence Rate." />
            </div>
          </Section>

          {/* Signature Block */}
          <div style={{ marginTop: 40, paddingTop: 32, borderTop: `2px solid ${NAVY}`, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 32 }}>
            {[
              { label: "Executive Authorizing", name: record.authorizedBy, date: record.authorizedAt },
              { label: "Platform Record", name: "VaughnMartin Readiness OS", date: `Generated: ${new Date().toLocaleDateString()}` },
              { label: "Audit Reference", name: record.activationId, date: record.protocolVersion },
            ].map((sig) => (
              <div key={sig.label}>
                <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: GOLD, marginBottom: 6 }}>{sig.label}</div>
                <div style={{ height: 32, borderBottom: `1px solid ${NAVY}`, marginBottom: 8 }} />
                <div style={{ fontSize: 12, fontWeight: 700, color: NAVY }}>{sig.name}</div>
                <div style={{ fontSize: 11, color: "#6B7280" }}>{sig.date}</div>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div style={{ marginTop: 32, textAlign: "center" }}>
            <p style={{ ...BC, fontSize: 11, color: "#9CA3AF", letterSpacing: "0.08em" }}>
              This Authorization Record is a governance artifact generated by the VaughnMartin Readiness OS platform. It is suitable for audit, board review, legal hold, and risk committee documentation.
            </p>
          </div>

        </div>
      </div>
    </PageLayout>
  );
}
