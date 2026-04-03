import { TrendingDown, TrendingUp } from 'lucide-react';

interface ROISideProps {
  label: string;
  duration: string;
  approach?: string;
  outcome: string;
  points: string[];
  details?: Record<string, any>;
}

interface ROIComparisonProps {
  traditional: ROISideProps;
  executionOS: ROISideProps;
  vexor?: ROISideProps;
  bottomLine: {
    value: string;
    metric: string;
  };
}

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const TEAL_LT = "#3BAF8A";

export default function ROIComparison({ traditional, executionOS, vexor, bottomLine }: ROIComparisonProps) {
  const rightSide = executionOS ?? vexor!;

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">

        {/* Traditional — Without Execution OS */}
        <div
          style={{
            border: "1px solid rgba(239,68,68,0.35)",
            borderTop: "3px solid #ef4444",
            borderRadius: 10,
            background: "rgba(239,68,68,0.06)",
            padding: "24px",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingDown style={{ width: 16, height: 16, color: "#ef4444" }} />
              <span style={{ fontWeight: 700, fontSize: 14, color: "rgba(255,255,255,0.85)" }}>
                {traditional.label}
              </span>
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                padding: "3px 10px",
                borderRadius: 4,
                background: "rgba(239,68,68,0.18)",
                color: "#f87171",
                border: "1px solid rgba(239,68,68,0.3)",
              }}
            >
              {traditional.duration}
            </span>
          </div>

          {traditional.approach && (
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 14, lineHeight: 1.5 }}>
              {traditional.approach}
            </p>
          )}

          <div
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.25)",
              borderRadius: 6,
              padding: "10px 14px",
              marginBottom: 14,
            }}
          >
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#f87171", marginBottom: 4 }}>
              Outcome
            </p>
            <p style={{ fontSize: 18, fontWeight: 700, color: "#f87171" }} data-testid="text-traditional-lost">
              {traditional.outcome}
            </p>
          </div>

          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>
              Impact
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
              {traditional.points.map((point, idx) => (
                <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <span style={{ color: "#f87171", marginTop: 2, flexShrink: 0, fontSize: 10 }}>✕</span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Execution OS — With Execution OS */}
        <div
          style={{
            border: `1px solid rgba(43,138,110,0.4)`,
            borderTop: `3px solid ${TEAL_LT}`,
            borderRadius: 10,
            background: "rgba(43,138,110,0.07)",
            padding: "24px",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp style={{ width: 16, height: 16, color: TEAL_LT }} />
              <span style={{ fontWeight: 700, fontSize: 14, color: "rgba(255,255,255,0.85)" }}>
                {rightSide.label}
              </span>
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                padding: "3px 10px",
                borderRadius: 4,
                background: "rgba(43,138,110,0.2)",
                color: TEAL_LT,
                border: `1px solid rgba(43,138,110,0.3)`,
              }}
            >
              {rightSide.duration}
            </span>
          </div>

          {rightSide.approach && (
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 14, lineHeight: 1.5 }}>
              {rightSide.approach}
            </p>
          )}

          <div
            style={{
              background: "rgba(43,138,110,0.12)",
              border: `1px solid rgba(43,138,110,0.3)`,
              borderRadius: 6,
              padding: "10px 14px",
              marginBottom: 14,
            }}
          >
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: TEAL_LT, marginBottom: 4 }}>
              Outcome
            </p>
            <p style={{ fontSize: 18, fontWeight: 700, color: TEAL_LT }} data-testid="text-vexor-preserved">
              {rightSide.outcome}
            </p>
          </div>

          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>
              Benefits
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
              {rightSide.points.map((point, idx) => (
                <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <span style={{ color: TEAL_LT, marginTop: 2, flexShrink: 0, fontSize: 10 }}>✓</span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div
        style={{
          borderRadius: 10,
          border: `1px solid rgba(201,168,76,0.3)`,
          background: "rgba(201,168,76,0.07)",
          padding: "20px 24px",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, marginBottom: 6 }}>
          Bottom Line
        </p>
        <p style={{ fontSize: 28, fontWeight: 700, color: "#FFFFFF", marginBottom: 4, fontFamily: "'Cormorant Garamond', serif" }}>
          {bottomLine.value}
        </p>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>
          {bottomLine.metric}
        </p>
      </div>
    </div>
  );
}
