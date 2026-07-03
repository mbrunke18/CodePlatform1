import { INDUSTRY_OPTIONS, type IndustryOption } from "../industryMap";
import { NAVY_BG, GOLD, TEAL, TEAL_LT, W, W70, W50, W25, BD, GBG, BC, CG, BAR } from "../shared";

const PILLAR_ORDER: IndustryOption["pillar"][] = ["growth", "resilience", "transformation", "roles"];
const PILLAR_COLOR: Record<IndustryOption["pillar"], string> = {
  growth: TEAL_LT,
  resilience: "#e09040",
  transformation: GOLD,
  roles: W50,
};

export default function Ch0Welcome({ onSelect }: { onSelect: (industryId: string) => void }) {
  const grouped = PILLAR_ORDER.map(pillar => ({
    pillar,
    label: pillar === "roles" ? "OR START FROM YOUR SEAT" : INDUSTRY_OPTIONS.find(o => o.pillar === pillar)?.pillarLabel ?? pillar,
    options: INDUSTRY_OPTIONS.filter(o => o.pillar === pillar),
  }));

  return (
    <div style={{ maxWidth: 1040, margin: "0 auto", padding: "56px 28px 60px" }}>
      <div style={{ ...BC, fontSize: 9, fontWeight: 700, letterSpacing: "0.4em", color: GOLD, textTransform: "uppercase", marginBottom: 18 }}>
        The Full Platform Experience · 10 Chapters · Skim in 10, Immerse in 30 · No Sign-Up Required
      </div>
      <h1 style={{ ...CG, fontSize: 50, fontWeight: 600, color: W, lineHeight: 1.08, letterSpacing: "-0.01em", marginBottom: 16, maxWidth: 780 }}>
        It's 2:47 AM. <em style={{ color: GOLD }}>Your phone just lit up.</em>
      </h1>
      <p style={{ ...BAR, fontSize: 15, color: W70, lineHeight: 1.75, maxWidth: 680, marginBottom: 20 }}>
        Somewhere in your organization, a situation just crossed the line — a competitor move, a breach, a regulator's letter, a resignation nobody saw coming. In the next fifteen minutes, someone will ask who owns this. In most enterprises, the honest answer is: nobody yet. That's the gap this walkthrough closes.
      </p>
      <p style={{ ...BAR, fontSize: 14, color: W50, lineHeight: 1.7, maxWidth: 680, marginBottom: 20 }}>
        Readiness OS replaces that gap with 180 pre-staged Readiness Protocols and a 12-minute mobilization clock — system-detected patterns instead of committee deliberation, executive authorization instead of a 30-day alignment cycle.
      </p>
      <p style={{ ...BAR, fontSize: 15, color: W70, lineHeight: 1.75, maxWidth: 680, marginBottom: 40 }}>
        Pick the situation closest to your world below. You'll live through the whole loop — the quiet before it fires, the moment it does, and the compounding advantage after — from the seat of the executive who has to decide.
      </p>

      {grouped.map(({ pillar, label, options }) => (
        <div key={pillar} style={{ marginBottom: 36 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <span style={{ display: "inline-block", width: 22, height: 1.5, background: PILLAR_COLOR[pillar], flexShrink: 0 }}/>
            <span style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: PILLAR_COLOR[pillar] }}>{label}</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
            {options.map(opt => (
              <button
                key={opt.id}
                onClick={() => onSelect(opt.id)}
                data-testid={`button-industry-${opt.id}`}
                style={{
                  textAlign: "left", background: GBG, border: `1px solid ${BD}`, padding: "20px 20px",
                  cursor: "pointer", display: "flex", flexDirection: "column", gap: 8, transition: "border-color 0.2s, background 0.2s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = `${PILLAR_COLOR[pillar]}80`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = BD; }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 22 }}>{opt.icon}</span>
                  <span style={{ ...BC, fontSize: 9, fontWeight: 700, color: PILLAR_COLOR[pillar], letterSpacing: "0.1em" }}>#{opt.protocolNumber}</span>
                </div>
                <div style={{ ...BC, fontSize: 16, fontWeight: 800, color: W, letterSpacing: "0.01em" }}>{opt.label}</div>
                <div style={{ ...BAR, fontSize: 12, color: W50, lineHeight: 1.5 }}>{opt.tagline}</div>
              </button>
            ))}
          </div>
        </div>
      ))}

      <div style={{ ...BAR, fontSize: 11, color: W25, marginTop: 8 }}>
        Fully public — no account, no email required. Every scenario below is illustrative, built on real product mechanics.
      </div>
    </div>
  );
}
