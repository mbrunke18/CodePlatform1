const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const CRIMSON = "#991B1B";

export type ValueGainMode = "offense" | "defense" | "special-teams";

interface GainSpec {
  label: string;
  value: string;
}

interface ValueGainCalloutProps {
  mode: ValueGainMode;
  position: string;
  insight: string;
  gain: GainSpec;
  compact?: boolean;
  dark?: boolean;
  style?: React.CSSProperties;
}

const MODE_CONFIG: Record<ValueGainMode, {
  accentColor: string;
  labelColor: string;
  bgColor: string;
  borderColor: string;
  dot: string;
}> = {
  offense: {
    accentColor: TEAL,
    labelColor: TEAL,
    bgColor: "rgba(43,138,110,0.04)",
    borderColor: "rgba(43,138,110,0.2)",
    dot: TEAL,
  },
  defense: {
    accentColor: NAVY,
    labelColor: NAVY,
    bgColor: "rgba(10,15,46,0.03)",
    borderColor: "rgba(10,15,46,0.15)",
    dot: NAVY,
  },
  "special-teams": {
    accentColor: GOLD,
    labelColor: "#8B6914",
    bgColor: "rgba(201,168,76,0.04)",
    borderColor: "rgba(201,168,76,0.25)",
    dot: GOLD,
  },
};

const MODE_LABELS: Record<ValueGainMode, string> = {
  offense:        "◆ OFFENSIVE POSITION",
  defense:        "◆ DEFENSIVE POSITION",
  "special-teams":"◆ SPECIAL TEAMS POSITION",
};

export function ValueGainCallout({
  mode,
  position,
  insight,
  gain,
  compact = false,
  dark = false,
  style,
}: ValueGainCalloutProps) {
  const cfg = MODE_CONFIG[mode];

  const darkAccent = mode === "defense" ? "rgba(255,255,255,0.75)" : cfg.accentColor;
  const darkLabel  = mode === "defense" ? "rgba(255,255,255,0.5)"
                   : mode === "offense" ? "#3BAF8A"
                   : GOLD;

  return (
    <div
      style={{
        display: "flex",
        gap: 0,
        background: dark ? "rgba(255,255,255,0.05)" : cfg.bgColor,
        border: dark ? "1px solid rgba(255,255,255,0.1)" : `1px solid ${cfg.borderColor}`,
        borderLeft: dark ? `3px solid ${darkAccent}` : `3px solid ${cfg.accentColor}`,
        fontFamily: "'Inter', sans-serif",
        ...style,
      }}
    >
      <div style={{ padding: compact ? "14px 18px" : "18px 22px", flex: 1 }}>
        <div
          style={{
            fontSize: 8.5,
            fontWeight: 800,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: dark ? darkLabel : cfg.labelColor,
            marginBottom: compact ? 6 : 8,
          }}
        >
          {MODE_LABELS[mode]}
        </div>
        <p
          style={{
            fontSize: compact ? 12 : 13,
            color: dark ? "rgba(255,255,255,0.85)" : NAVY,
            lineHeight: 1.65,
            fontWeight: 500,
            margin: compact ? "0 0 10px" : "0 0 14px",
            maxWidth: 720,
          }}
        >
          {insight}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 20,
              height: 1,
              background: dark ? darkAccent : cfg.accentColor,
              opacity: 0.6,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: dark ? "rgba(255,255,255,0.38)" : "#6B7280",
            }}
          >
            {gain.label}
          </span>
          <div
            style={{
              flex: 1,
              height: 1,
              background: dark ? "rgba(255,255,255,0.1)" : cfg.borderColor,
            }}
          />
          <span
            style={{
              fontSize: compact ? 13 : 15,
              fontWeight: 800,
              color: dark ? darkAccent : cfg.accentColor,
              letterSpacing: "0.02em",
              flexShrink: 0,
            }}
          >
            {gain.value}
          </span>
        </div>
      </div>
    </div>
  );
}

interface PositionStripProps {
  style?: React.CSSProperties;
}

export function ThreePositionStrip({ style }: PositionStripProps) {
  const items: Array<{ mode: ValueGainMode; insight: string; gain: GainSpec }> = [
    {
      mode: "offense",
      insight:
        "Every playbook staged here is a competitive position taken before the trigger fires. When the moment arrives, you move. Rivals spend the next 30 days figuring out who needs to be in the room.",
      gain: { label: "Their mobilization cycle", value: "Your 12 minutes" },
    },
    {
      mode: "defense",
      insight:
        "Resilience isn't protection from loss — it's the freedom to act decisively when others freeze. Every scenario prepared here is one less crisis improvised under pressure.",
      gain: { label: "Scenarios pre-staged", value: "170 playbooks" },
    },
    {
      mode: "special-teams",
      insight:
        "The decision logic encoded in each playbook — who owns what, under what conditions, with what authority — cannot be licensed. Competitors can buy the platform. They cannot buy what your team built inside it.",
      gain: { label: "Competitor advantage", value: "Cannot be copied" },
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 0,
        fontFamily: "'Inter', sans-serif",
        ...style,
      }}
    >
      {items.map((item, i) => {
        const cfg = MODE_CONFIG[item.mode];
        return (
          <div
            key={item.mode}
            style={{
              background: cfg.bgColor,
              borderTop: `3px solid ${cfg.accentColor}`,
              borderBottom: `1px solid ${cfg.borderColor}`,
              borderLeft: i === 0 ? `1px solid ${cfg.borderColor}` : "none",
              borderRight: `1px solid ${cfg.borderColor}`,
              padding: "18px 20px",
            }}
          >
            <div
              style={{
                fontSize: 8,
                fontWeight: 800,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: cfg.labelColor,
                marginBottom: 8,
              }}
            >
              {MODE_LABELS[item.mode]}
            </div>
            <p
              style={{
                fontSize: 12,
                color: NAVY,
                lineHeight: 1.65,
                fontWeight: 500,
                margin: "0 0 14px",
              }}
            >
              {item.insight}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 14, height: 1, background: cfg.accentColor, opacity: 0.5, flexShrink: 0 }} />
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9CA3AF" }}>
                {item.gain.label}
              </span>
              <div style={{ flex: 1, height: 1, background: cfg.borderColor }} />
              <span style={{ fontSize: 13, fontWeight: 800, color: cfg.accentColor, flexShrink: 0 }}>
                {item.gain.value}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
