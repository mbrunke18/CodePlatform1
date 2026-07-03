import { useState, useEffect } from "react";
import type { DemoScenario } from "@/pages/demos/scenarioData";

/* ─── Brand ───────────────────────────────────────────────────────────────── */
export const NAVY    = "#0A0F2E";
export const NAVY_BG = "#132558";
export const GOLD    = "#C9A84C";
export const TEAL    = "#2B8A6E";
export const TEAL_LT = "#3BAF8A";
export const RED     = "#e05252";
export const AMB     = "#e09040";
export const W       = "#ffffff";
export const W90     = "rgba(255,255,255,0.90)";
export const W70     = "rgba(255,255,255,0.70)";
export const W50     = "rgba(255,255,255,0.50)";
export const W25     = "rgba(255,255,255,0.25)";
export const W10     = "rgba(255,255,255,0.10)";
export const BD      = "rgba(201,168,76,0.22)";
export const GBG     = "rgba(201,168,76,0.06)";
export const BC      = { fontFamily: "'Barlow Condensed','Arial Narrow',sans-serif" } as const;
export const CG      = { fontFamily: "'Cormorant Garamond',Georgia,serif" } as const;
export const BAR     = { fontFamily: "'Barlow',sans-serif" } as const;
export const MONO    = { fontFamily: "'Courier New',monospace" } as const;

/* ─── Chapter registry ────────────────────────────────────────────────────── */
export const CHAPTER_TITLES = [
  "Welcome",
  "Before the Trigger",
  "The Situation Arrives",
  "Detection & Protocol Lock-On",
  "Executive Authorization",
  "War Room & Mobilization",
  "12 Minutes vs. 30 Days",
  "Debrief & ROI",
  "ADVANCE 2.0",
  "Recap & Founding Partner",
];
export const TOTAL_CHAPTERS = CHAPTER_TITLES.length;

/* ─── Animation hooks (copied from MasterDemo.tsx — do not import, keep isolated) ── */
export function useCountUp(target: number, durationMs: number, active: boolean): number {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = Date.now();
    const t = setInterval(() => {
      const p = Math.min((Date.now() - start) / durationMs, 1);
      setVal(Math.round(target * p));
      if (p >= 1) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, [active, target, durationMs]);
  return val;
}

export function useSimClock(totalSim: number, realMs: number, active: boolean) {
  const [simSec, setSimSec] = useState(0);
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!active) return;
    const start = Date.now();
    const t = setInterval(() => {
      const sim = Math.min(Math.round(((Date.now() - start) / realMs) * totalSim), totalSim);
      setSimSec(sim);
      if (sim >= totalSim) { setDone(true); clearInterval(t); }
    }, 50);
    return () => clearInterval(t);
  }, [active, totalSim, realMs]);
  return { simSec, done };
}

export function useSequential(count: number, intervalMs: number, active: boolean): number {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => setN(v => v < count ? v + 1 : v), intervalMs);
    return () => clearInterval(t);
  }, [active, count, intervalMs]);
  return n;
}

/* ─── Reusable components ─────────────────────────────────────────────────── */
export function SLabel({ children, color = GOLD }: { children: React.ReactNode; color?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
      <span style={{ display: "inline-block", width: 28, height: 1.5, background: color, flexShrink: 0 }}/>
      <span style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.35em", textTransform: "uppercase", color }}>{children}</span>
    </div>
  );
}

export function SeverityColor(s: DemoScenario["signals"][0]["severity"]) {
  return s === "critical" ? RED : s === "high" ? AMB : GOLD;
}

export function CatColor(cat: string) {
  const m: Record<string, string> = {
    "AUTHORITY": GOLD, "LEGAL": AMB, "GOVERNANCE": GOLD,
    "FINANCE": TEAL_LT, "COMMS": AMB, "SECURITY": RED,
    "OPERATIONS": TEAL_LT, "REGULATORY": AMB, "MEDICAL": TEAL,
    "SUPPLY CHAIN": TEAL_LT, "INVESTOR REL.": GOLD, "GROWTH": TEAL_LT,
  };
  return m[cat] || TEAL;
}

export function LiveDot({ color = RED }: { color?: string }) {
  const [on, setOn] = useState(true);
  useEffect(() => { const t = setInterval(() => setOn(v => !v), 600); return () => clearInterval(t); }, []);
  return <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: color, opacity: on ? 1 : 0.2, transition: "opacity 0.3s", flexShrink: 0 }}/>;
}

export function severityColorForRisk(riskScore: number) {
  return riskScore >= 90 ? RED : riskScore >= 75 ? AMB : GOLD;
}

/* ─── Real product screen panel (breadth/depth proof) ─────────────────────── */
export function ProductScreenPanel({ eyebrow, image, alt, route, callouts }: {
  eyebrow: string; image: string; alt: string; route: string; callouts: { title: string; text: string }[];
}) {
  return (
    <div style={{ marginBottom: 28 }} data-testid="panel-product-screen">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
        <span style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", color: GOLD, textTransform: "uppercase" }}>{eyebrow}</span>
        <span style={{ ...MONO, fontSize: 9, color: W50 }}>In the platform: {route}</span>
      </div>
      <div style={{ border: `1px solid ${BD}`, overflow: "hidden", marginBottom: 14, lineHeight: 0 }}>
        <img src={image} alt={alt} loading="lazy" style={{ width: "100%", display: "block" }} />
      </div>
      <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", color: W50, textTransform: "uppercase", marginBottom: 10 }}>
        What to look for as a customer
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {callouts.map((c, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span style={{ ...BC, fontSize: 11, fontWeight: 900, color: GOLD, flexShrink: 0, width: 14 }}>{i + 1}</span>
            <div>
              <div style={{ ...BC, fontSize: 11, fontWeight: 800, color: W, letterSpacing: "0.02em", marginBottom: 2 }}>{c.title}</div>
              <div style={{ ...BAR, fontSize: 11, color: W70, lineHeight: 1.45 }}>{c.text}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Chapter footer nav ──────────────────────────────────────────────────── */
export function ChapterNav({ chapter, onNext, onBack, nextLabel = "Continue →", disabled = false, hideNext = false }:
  { chapter: number; onNext: () => void; onBack: () => void; nextLabel?: string; disabled?: boolean; hideNext?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 36, paddingTop: 24, borderTop: `1px solid ${BD}` }}>
      {chapter > 0
        ? <button onClick={onBack} style={{ ...BC, background: "transparent", border: `1px solid ${W25}`, color: W50, fontSize: 13, fontWeight: 600, letterSpacing: "0.1em", padding: "10px 20px", cursor: "pointer" }} data-testid="button-chapter-back">← Back</button>
        : <div/>}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ ...BC, fontSize: 9, fontWeight: 600, letterSpacing: "0.2em", color: W25 }}>CHAPTER {chapter + 1} OF {TOTAL_CHAPTERS}</span>
        {!hideNext && chapter < TOTAL_CHAPTERS - 1 && (
          <button onClick={onNext} disabled={disabled} data-testid="button-chapter-next" style={{
            ...BC, background: disabled ? W10 : GOLD, border: "none",
            color: disabled ? W25 : NAVY, fontSize: 14, fontWeight: 800,
            letterSpacing: "0.1em", padding: "12px 28px", cursor: disabled ? "not-allowed" : "pointer", textTransform: "uppercase",
          }}>{nextLabel}</button>
        )}
      </div>
    </div>
  );
}

/* ─── Chapter rail (jump nav) ─────────────────────────────────────────────── */
export function ChapterRail({ chapter, furthestUnlocked, onJump }: { chapter: number; furthestUnlocked: number; onJump: (i: number) => void }) {
  return (
    <div style={{ background: NAVY_BG, borderBottom: `1px solid ${BD}`, overflowX: "auto" }}>
      <div style={{ maxWidth: 1040, margin: "0 auto", display: "flex", minWidth: 760 }}>
        {CHAPTER_TITLES.map((label, i) => {
          const unlocked = i <= furthestUnlocked;
          const active = i === chapter;
          return (
            <button
              key={i}
              onClick={() => unlocked && onJump(i)}
              disabled={!unlocked}
              data-testid={`button-chapter-rail-${i}`}
              style={{
                flex: 1, minWidth: 76, background: "transparent", border: "none",
                padding: "10px 4px 8px", textAlign: "center", cursor: unlocked ? "pointer" : "default",
                borderBottom: active ? `2px solid ${GOLD}` : i < chapter ? `2px solid ${TEAL}` : "2px solid transparent",
              }}
            >
              <div style={{ ...BC, fontSize: 7, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: active ? GOLD : i < chapter ? TEAL : unlocked ? W50 : W10, lineHeight: 1.35 }}>
                {i < chapter ? "✓ " : ""}{label}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
