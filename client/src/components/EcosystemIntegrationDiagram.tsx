/**
 * EcosystemIntegrationDiagram — "Time to Value" Visual
 * Three phases: Connect (30 min) → Stage (Day 1) → Respond (12 min)
 */

const GOLD    = "#C9A84C";
const GOLD_L  = "#DFC178";
const TEAL    = "#2B8A6E";
const IVORY   = "#F0EDE4";

const W = 1160;
const H = 490;

interface Phase {
  n: string;
  timing: string;
  timingColor: string;
  label: string;
  headlineA: string;
  headlineB: string;
  body: string[];
  bullets: string[];
  color: string;
}

const PHASES: Phase[] = [
  {
    n: "01",
    timing: "WEEK 1–2",
    timingColor: TEAL,
    label: "CONNECT",
    headlineA: "Your stack stays.",
    headlineB: "Readiness OS layers on top.",
    body: [
      "SSO, permissions, and integration with your",
      "existing infrastructure — Microsoft, Salesforce,",
      "Slack, ServiceNow, and more. No rip-and-replace.",
      "No new vendor consolidation required.",
    ],
    bullets: ["SSO & identity configuration", "Microsoft 365 + Teams", "Salesforce + ServiceNow", "Existing data sources"],
    color: TEAL,
  },
  {
    n: "02",
    timing: "WEEKS 2–4",
    timingColor: GOLD,
    label: "STAGE",
    headlineA: "180 responses configured",
    headlineB: "to your org and domains.",
    body: [
      "Readiness Protocols are tailored to your industry,",
      "org structure, and executive roles. Teams",
      "review and approve responses before any",
      "situation presents itself. Ownership built in.",
    ],
    bullets: ["9 strategic domains configured", "221 trigger patterns mapped", "Executive roles pre-assigned", "Briefs reviewed and approved"],
    color: GOLD,
  },
  {
    n: "03",
    timing: "12 MINUTES",
    timingColor: "#E8A0A0",
    label: "RESPOND",
    headlineA: "Trigger fires. Brief deploys.",
    headlineB: "Execution begins.",
    body: [
      "When the strategic moment arrives, the",
      "response is already waiting. Brief surfaces,",
      "executive authorizes, team receives",
      "assignments. Not weeks — 12 minutes.",
    ],
    bullets: ["Signal detected automatically", "Pre-staged brief surfaces", "Executive authorizes", "Teams coordinated instantly"],
    color: "#E8A0A0",
  },
];

const MARGIN    = 20;
const PHASE_GAP = 52;
const PHASE_W   = (W - MARGIN * 2 - PHASE_GAP * (PHASES.length - 1)) / PHASES.length;
const PHASE_Y   = 60;
const PHASE_H   = H - PHASE_Y - 50;

function phaseX(i: number) {
  return MARGIN + i * (PHASE_W + PHASE_GAP);
}
function phaseCX(i: number) {
  return phaseX(i) + PHASE_W / 2;
}

function PhaseArrow({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <line x1={x} y1={y} x2={x + 38} y2={y} stroke={GOLD} strokeWidth={1.2} strokeOpacity={0.3} />
      <polygon
        points={`${x + 38},${y - 5} ${x + 50},${y} ${x + 38},${y + 5}`}
        fill={GOLD} opacity={0.3}
      />
    </g>
  );
}

export default function EcosystemIntegrationDiagram() {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      style={{ maxWidth: W, display: "block", margin: "0 auto" }}
      aria-label="Three-phase deployment: Connect in 30 minutes, Stage Readiness Protocols Day 1, Respond in 12 minutes"
    >
      <defs>
        <linearGradient id="diagBg2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#060B1E" />
          <stop offset="100%" stopColor="#0A1028" />
        </linearGradient>
        <pattern id="diagGrid2" width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M 48 0 L 0 0 0 48" fill="none" stroke={GOLD} strokeWidth={0.3} strokeOpacity={0.05} />
        </pattern>
      </defs>

      {/* Background */}
      <rect width={W} height={H} fill="url(#diagBg2)" />
      <rect width={W} height={H} fill="url(#diagGrid2)" />

      {/* Subtle orbs */}
      <ellipse cx={W * 0.75} cy={H * 0.3} rx={260} ry={200} fill={TEAL} opacity={0.04} />
      <ellipse cx={W * 0.2} cy={H * 0.7} rx={200} ry={150} fill={GOLD} opacity={0.03} />

      {/* Top header strip */}
      <rect x={0} y={0} width={W} height={50} fill="rgba(255,255,255,0.018)" />
      <line x1={0} y1={50} x2={W} y2={50} stroke={GOLD} strokeWidth={0.6} strokeOpacity={0.18} />
      <text
        x={W / 2} y={32} textAnchor="middle"
        fill={GOLD} fontSize={9} fontWeight={700} letterSpacing={3.5}
        fontFamily="'Barlow Condensed','DM Mono',sans-serif" opacity={0.8}
      >
        FROM FIRST CONNECTION TO FIRST RESPONSE — THREE STEPS. NO COMPLEXITY.
      </text>

      {/* Phase columns */}
      {PHASES.map((phase, i) => {
        const px = phaseX(i);
        const cx = phaseCX(i);

        return (
          <g key={phase.n}>
            {/* Card background */}
            <rect x={px} y={PHASE_Y} width={PHASE_W} height={PHASE_H} rx={4}
              fill={`${phase.color}09`} stroke={`${phase.color}28`} strokeWidth={1.2}
            />
            {/* Top accent bar */}
            <rect x={px} y={PHASE_Y} width={PHASE_W} height={3} rx={1}
              fill={phase.color} opacity={0.65}
            />

            {/* Phase number */}
            <text x={px + 16} y={PHASE_Y + 24}
              fill={phase.color} fontSize={11} fontWeight={700} letterSpacing={2} opacity={0.82}
              fontFamily="'DM Mono',monospace"
            >
              {phase.n}
            </text>

            {/* Timing badge */}
            <rect x={px + PHASE_W - 92} y={PHASE_Y + 10} width={82} height={20} rx={3}
              fill={`${phase.timingColor}20`} stroke={`${phase.timingColor}55`} strokeWidth={0.8}
            />
            <text x={px + PHASE_W - 51} y={PHASE_Y + 24} textAnchor="middle"
              fill={phase.timingColor} fontSize={8} fontWeight={700} letterSpacing={1.5}
              fontFamily="'Barlow Condensed',sans-serif"
            >
              {phase.timing}
            </text>

            {/* Section label */}
            <text x={cx} y={PHASE_Y + 52} textAnchor="middle"
              fill={IVORY} fontSize={15} fontWeight={700} letterSpacing={4}
              fontFamily="'Barlow Condensed',sans-serif"
            >
              {phase.label}
            </text>

            {/* Divider */}
            <line x1={px + 20} y1={PHASE_Y + 62} x2={px + PHASE_W - 20} y2={PHASE_Y + 62}
              stroke={phase.color} strokeWidth={0.6} strokeOpacity={0.3}
            />

            {/* Headline (2 lines positioned manually) */}
            <text x={cx} y={PHASE_Y + 86} textAnchor="middle"
              fill={IVORY} fontSize={13} fontWeight={600}
              fontFamily="'Cormorant Garamond',serif" letterSpacing={0.3}
            >
              {phase.headlineA}
            </text>
            <text x={cx} y={PHASE_Y + 104} textAnchor="middle"
              fill={IVORY} fontSize={13} fontWeight={600}
              fontFamily="'Cormorant Garamond',serif" letterSpacing={0.3}
            >
              {phase.headlineB}
            </text>

            {/* Body text lines */}
            {phase.body.map((line, li) => (
              <text key={li} x={px + 16} y={PHASE_Y + 136 + li * 17}
                fill={IVORY} fontSize={11} opacity={0.75}
                fontFamily="'Barlow Condensed',sans-serif" letterSpacing={0.2}
              >
                {line}
              </text>
            ))}

            {/* Bullet divider */}
            <line x1={px + 16} y1={PHASE_Y + 218} x2={px + PHASE_W - 16} y2={PHASE_Y + 218}
              stroke={phase.color} strokeWidth={0.4} strokeOpacity={0.2}
            />

            {/* Bullet list */}
            {phase.bullets.map((b, bi) => (
              <g key={b}>
                <rect x={px + 16} y={PHASE_Y + 230 + bi * 28} width={4} height={4}
                  fill={phase.color} opacity={0.7}
                />
                <text x={px + 26} y={PHASE_Y + 243 + bi * 28}
                  fill={IVORY} fontSize={11} fontWeight={600} letterSpacing={0.4}
                  fontFamily="'Barlow Condensed',sans-serif" opacity={0.88}
                >
                  {b}
                </text>
              </g>
            ))}
          </g>
        );
      })}

      {/* Arrows between phases */}
      <PhaseArrow x={phaseX(0) + PHASE_W + 1} y={PHASE_Y + PHASE_H / 2} />
      <PhaseArrow x={phaseX(1) + PHASE_W + 1} y={PHASE_Y + PHASE_H / 2} />

      {/* Bottom bar */}
      <rect x={0} y={H - 38} width={W} height={38} fill="rgba(255,255,255,0.015)" />
      <line x1={0} y1={H - 38} x2={W} y2={H - 38} stroke={GOLD} strokeWidth={0.5} strokeOpacity={0.12} />
      <text x={W / 2} y={H - 14} textAnchor="middle"
        fill={IVORY} fontSize={10} opacity={0.58}
        fontFamily="'DM Mono',monospace" letterSpacing={0.8}
      >
        No rip-and-replace. No new infrastructure required. Executive authority preserved on every activation.
      </text>

      {/* Gold top border */}
      <line x1={0} y1={0} x2={W} y2={0} stroke={GOLD} strokeWidth={2} opacity={0.45} />
    </svg>
  );
}
