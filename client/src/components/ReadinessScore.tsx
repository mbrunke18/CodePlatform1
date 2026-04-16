import { useQuery } from "@tanstack/react-query";
import { Shield, TrendingUp, TrendingDown, Minus, ChevronRight, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { useLocation } from "wouter";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const CG = { fontFamily: "'Cormorant Garamond', serif" };

interface ReadinessScoreData {
  score: number;
  tier: "CRITICAL" | "DEVELOPING" | "READY" | "ELITE";
  delta: number;
  dimensions: {
    label: string;
    score: number;
    max: number;
    detail: string;
  }[];
  recommendation: string;
  lastUpdated: string;
}

function ScoreArc({ score }: { score: number }) {
  const radius = 52;
  const circumference = Math.PI * radius;
  const progress = Math.max(0, Math.min(100, score));
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const color = score >= 80 ? TEAL : score >= 60 ? GOLD : score >= 40 ? "#F59E0B" : "#DC2626";

  return (
    <svg width="130" height="72" viewBox="0 0 130 72">
      <path
        d={`M 13 70 A ${radius} ${radius} 0 0 1 117 70`}
        fill="none"
        stroke="#E8E4DC"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d={`M 13 70 A ${radius} ${radius} 0 0 1 117 70`}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        style={{ transition: "stroke-dashoffset 1s ease" }}
      />
      <text x="65" y="60" textAnchor="middle" fontSize="28" fontWeight="700" fill={NAVY} fontFamily="'Cormorant Garamond', serif">
        {score}
      </text>
    </svg>
  );
}

const TIER_CONFIG = {
  CRITICAL:   { label: "Critical",   color: "#DC2626", bg: "rgba(220,38,38,0.08)",   desc: "Significant preparation gaps — activate priority domains now." },
  DEVELOPING: { label: "Developing", color: "#F59E0B", bg: "rgba(245,158,11,0.08)",  desc: "Foundation in place — expand coverage and run first drills." },
  READY:      { label: "Ready",      color: TEAL,      bg: "rgba(43,138,110,0.08)",  desc: "Strong readiness posture — maintain cadence and refine." },
  ELITE:      { label: "Elite",      color: GOLD,      bg: "rgba(201,168,76,0.10)",  desc: "Best-in-class readiness — 12-minute execution confirmed." },
};

export default function ReadinessScore({ compact = false }: { compact?: boolean }) {
  const [, setLocation] = useLocation();

  const { data, isLoading } = useQuery<ReadinessScoreData>({
    queryKey: ["/api/readiness-score"],
  });

  if (isLoading || !data) {
    return (
      <div style={{ background: "#fff", border: "1px solid #E8E4DC", padding: compact ? 16 : 24 }}>
        <div style={{ height: compact ? 60 : 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", border: `3px solid ${GOLD}`, borderTopColor: "transparent", animation: "spin 1s linear infinite" }} />
        </div>
      </div>
    );
  }

  const tier = TIER_CONFIG[data.tier];
  const DeltaIcon = data.delta > 0 ? TrendingUp : data.delta < 0 ? TrendingDown : Minus;

  if (compact) {
    return (
      <div
        style={{ background: "#fff", border: "1px solid #E8E4DC", padding: "16px 20px", cursor: "pointer", display: "flex", alignItems: "center", gap: 16 }}
        onClick={() => setLocation("/executive-dashboard")}
      >
        <Shield style={{ width: 18, height: 18, color: tier.color, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#6B7280" }}>Readiness Score</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ ...CG, fontSize: 28, fontWeight: 700, color: NAVY, lineHeight: 1 }}>{data.score}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: tier.color, letterSpacing: "0.1em" }}>{tier.label.toUpperCase()}</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, color: data.delta >= 0 ? TEAL : "#DC2626" }}>
          <DeltaIcon style={{ width: 14, height: 14 }} />
          <span style={{ fontSize: 12, fontWeight: 600 }}>{Math.abs(data.delta)}</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#fff", border: "1px solid #E8E4DC" }}>
      <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #E8E4DC" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <div style={{ width: 20, height: 1, background: GOLD }} />
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: GOLD }}>Executive Readiness Score</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={{ ...CG, fontSize: 20, fontWeight: 600, color: NAVY, margin: 0 }}>Organizational Readiness</h3>
          <span style={{ fontSize: 9, color: "#9CA3AF", fontWeight: 500 }}>Updated {data.lastUpdated}</span>
        </div>
      </div>

      <div style={{ padding: "20px 24px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 24, marginBottom: 20 }}>
          <div style={{ textAlign: "center" }}>
            <ScoreArc score={data.score} />
            <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: tier.bg, padding: "3px 10px", marginTop: 4 }}>
              <Shield style={{ width: 10, height: 10, color: tier.color }} />
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: tier.color }}>{tier.label}</span>
            </div>
          </div>
          <div style={{ flex: 1, paddingTop: 4 }}>
            <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.6, margin: "0 0 12px" }}>{tier.desc}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", background: "rgba(10,15,46,0.03)", borderLeft: `3px solid ${GOLD}` }}>
              <AlertCircle style={{ width: 12, height: 12, color: GOLD, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: NAVY, fontWeight: 500 }}>{data.recommendation}</span>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
          {data.dimensions.map((dim) => {
            const pct = Math.round((dim.score / dim.max) * 100);
            const dimColor = pct >= 80 ? TEAL : pct >= 60 ? GOLD : "#F59E0B";
            return (
              <div key={dim.label} style={{ padding: "10px 12px", border: "1px solid #E8E4DC", background: "#FAFAF8" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: NAVY }}>{dim.label}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: dimColor }}>{dim.score}/{dim.max}</span>
                </div>
                <div style={{ height: 3, background: "#E8E4DC", marginBottom: 5 }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: dimColor, transition: "width 1s ease" }} />
                </div>
                <span style={{ fontSize: 9, color: "#9CA3AF" }}>{dim.detail}</span>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => setLocation("/preparedness-report")}
          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px 16px", background: NAVY, color: "#fff", border: "none", cursor: "pointer", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}
        >
          Full Readiness Breakdown <ChevronRight style={{ width: 12, height: 12 }} />
        </button>
      </div>
    </div>
  );
}
