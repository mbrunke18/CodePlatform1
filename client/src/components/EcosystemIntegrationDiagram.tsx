/**
 * EcosystemIntegrationDiagram
 * Shows Readiness OS as the universal coordination layer
 * above all major enterprise technology ecosystems.
 */

const NAVY    = "#0A0F2E";
const GOLD    = "#C9A84C";
const GOLD_L  = "#DFC178";
const TEAL    = "#2B8A6E";
const IVORY   = "#F0EDE4";

const ecosystems = [
  {
    name: "Microsoft",
    label: "MICROSOFT STACK",
    color: "#0078D4",
    tools: ["Azure AI", "Teams", "Copilot Studio", "Microsoft 365", "Entra ID", "Power Platform"],
    note: "Primary integration layer",
  },
  {
    name: "Communication",
    label: "COMMUNICATION",
    color: "#4A154B",
    tools: ["Slack", "Google Meet", "Zoom", "Webex", "Gmail"],
    note: "War room activation",
  },
  {
    name: "CRM & ERP",
    label: "CRM / ERP",
    color: "#1798C1",
    tools: ["Salesforce", "SAP", "Oracle", "HubSpot", "Dynamics 365"],
    note: "Customer & ops data",
  },
  {
    name: "Cloud & Data",
    label: "CLOUD / DATA",
    color: "#FF9900",
    tools: ["AWS", "Google Cloud", "Snowflake", "Databricks", "Azure Fabric"],
    note: "Intelligence sources",
  },
  {
    name: "ITSM & PM",
    label: "ITSM / PROJECT",
    color: "#0052CC",
    tools: ["ServiceNow", "Jira", "Asana", "Monday.com", "Linear"],
    note: "Task orchestration",
  },
  {
    name: "HR & Finance",
    label: "HR / FINANCE",
    color: "#7C3AED",
    tools: ["Workday", "SAP HR", "Oracle HCM", "Rippling", "ADP"],
    note: "Stakeholder data",
  },
];

const W = 1200;
const H = 580;
const COL_COUNT = 6;
const COL_GAP = 12;
const MARGIN = 20;
const COL_W = (W - MARGIN * 2 - COL_GAP * (COL_COUNT - 1)) / COL_COUNT;

const ROS_Y = 20;
const ROS_H = 90;
const CONN_Y = ROS_Y + ROS_H + 40;
const CONN_H = 52;
const ECO_Y = CONN_Y + CONN_H + 36;
const ECO_H = H - ECO_Y - 20;

function colX(i: number) {
  return MARGIN + i * (COL_W + COL_GAP);
}
function colCX(i: number) {
  return colX(i) + COL_W / 2;
}

export default function EcosystemIntegrationDiagram() {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      style={{ maxWidth: W, display: "block", margin: "0 auto" }}
      aria-label="Readiness OS sits above every enterprise technology stack as the universal coordination layer"
    >
      <defs>
        <linearGradient id="ecoBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#060B1E" />
          <stop offset="100%" stopColor="#0D1530" />
        </linearGradient>
        <linearGradient id="rosGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#111740" />
          <stop offset="100%" stopColor="#0A0F2E" />
        </linearGradient>
        <linearGradient id="goldBorder" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={GOLD} stopOpacity="0.3" />
          <stop offset="40%" stopColor={GOLD} stopOpacity="0.9" />
          <stop offset="60%" stopColor={GOLD_L} stopOpacity="0.9" />
          <stop offset="100%" stopColor={GOLD} stopOpacity="0.3" />
        </linearGradient>
        <pattern id="ecoGrid" width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M 48 0 L 0 0 0 48" fill="none" stroke={GOLD} strokeWidth={0.4} strokeOpacity={0.05} />
        </pattern>
        <filter id="ecoGlow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Background */}
      <rect width={W} height={H} fill="url(#ecoBg)" />
      <rect width={W} height={H} fill="url(#ecoGrid)" />

      {/* Teal orb top-right */}
      <ellipse cx={1100} cy={80} rx={220} ry={160} fill={TEAL} opacity={0.06} />
      {/* Gold orb bottom-left */}
      <ellipse cx={100} cy={520} rx={180} ry={140} fill={GOLD} opacity={0.04} />

      {/* ═══ READINESS OS TOP BLOCK ═══════════════════════════════════════════ */}
      {/* Outer glow */}
      <rect x={MARGIN - 3} y={ROS_Y - 3} width={W - MARGIN * 2 + 6} height={ROS_H + 6}
        fill="none" stroke={GOLD} strokeWidth={1} strokeOpacity={0.2} filter="url(#ecoGlow)"
      />
      {/* Main block */}
      <rect x={MARGIN} y={ROS_Y} width={W - MARGIN * 2} height={ROS_H}
        fill="url(#rosGrad)" stroke="url(#goldBorder)" strokeWidth={1.8}
      />
      {/* Inner grid */}
      <rect x={MARGIN} y={ROS_Y} width={W - MARGIN * 2} height={ROS_H}
        fill="url(#ecoGrid)" opacity={0.6}
      />
      {/* Teal accent inside */}
      <ellipse cx={W - 200} cy={ROS_Y + 45} rx={150} ry={60} fill={TEAL} opacity={0.08} />

      {/* Label */}
      <text x={W / 2} y={ROS_Y + 26} textAnchor="middle"
        fill={GOLD} fontSize={9} fontWeight={700} letterSpacing={3.5} opacity={0.85}
        fontFamily="'Barlow Condensed','DM Mono',sans-serif">
        THE UNIVERSAL COORDINATION LAYER
      </text>
      <text x={W / 2} y={ROS_Y + 52} textAnchor="middle"
        fill={IVORY} fontSize={28} fontWeight={700} letterSpacing={5}
        fontFamily="'Barlow Condensed','Cormorant Garamond',serif">
        READINESS OS
      </text>
      <text x={W / 2} y={ROS_Y + 72} textAnchor="middle"
        fill={GOLD} fontSize={10} fontWeight={500} fontStyle="italic" letterSpacing={1}
        fontFamily="'Cormorant Garamond',serif">
        by VaughnMartin — Pre-stage every response. Deploy in 12 minutes.
      </text>

      {/* Left + right tag boxes */}
      <rect x={MARGIN + 10} y={ROS_Y + 30} width={100} height={30} rx={4}
        fill={`${TEAL}18`} stroke={`${TEAL}50`} strokeWidth={1}
      />
      <text x={MARGIN + 60} y={ROS_Y + 49} textAnchor="middle"
        fill={TEAL} fontSize={9} fontWeight={700} letterSpacing={1.5}
        fontFamily="'Barlow Condensed',sans-serif">
        170 PLAYBOOKS
      </text>

      <rect x={W - MARGIN - 110} y={ROS_Y + 30} width={100} height={30} rx={4}
        fill={`${GOLD}14`} stroke={`${GOLD}50`} strokeWidth={1}
      />
      <text x={W - MARGIN - 60} y={ROS_Y + 49} textAnchor="middle"
        fill={GOLD} fontSize={9} fontWeight={700} letterSpacing={1.5}
        fontFamily="'Barlow Condensed',sans-serif">
        3,600× HEAD START
      </text>

      {/* ═══ INTEGRATION CONNECTOR ROW ════════════════════════════════════════ */}
      <text x={W / 2} y={CONN_Y - 10} textAnchor="middle"
        fill={GOLD} fontSize={8.5} fontWeight={700} letterSpacing={3} opacity={0.7}
        fontFamily="'DM Mono',monospace">
        INTEGRATION TOUCHPOINTS — NO RIP-AND-REPLACE
      </text>

      {ecosystems.map((eco, i) => {
        const cx = colCX(i);
        const x = colX(i);
        // Line from ROS bottom to connector box
        return (
          <g key={eco.name + "-conn"}>
            {/* Vertical connecting line */}
            <line
              x1={cx} y1={ROS_Y + ROS_H}
              x2={cx} y2={CONN_Y}
              stroke={eco.color} strokeWidth={1.5} strokeOpacity={0.45}
              strokeDasharray="5 4"
            />
            {/* Connector badge */}
            <rect x={x} y={CONN_Y} width={COL_W} height={CONN_H} rx={5}
              fill={`${eco.color}18`} stroke={eco.color} strokeWidth={1.2} strokeOpacity={0.55}
            />
            <text x={cx} y={CONN_Y + 20} textAnchor="middle"
              fill={IVORY} fontSize={9.5} fontWeight={700} letterSpacing={1.5}
              fontFamily="'Barlow Condensed',sans-serif">
              {eco.label}
            </text>
            <text x={cx} y={CONN_Y + 36} textAnchor="middle"
              fill={IVORY} fontSize={8} fontWeight={400} opacity={0.5}
              fontFamily="'DM Mono',monospace">
              {eco.note}
            </text>
            {/* Line from connector badge down to ecosystem column */}
            <line
              x1={cx} y1={CONN_Y + CONN_H}
              x2={cx} y2={ECO_Y}
              stroke={eco.color} strokeWidth={1.5} strokeOpacity={0.3}
              strokeDasharray="4 4"
            />
          </g>
        );
      })}

      {/* ═══ ECOSYSTEM COLUMNS ══════════════════════════════════════════════════ */}
      {ecosystems.map((eco, i) => {
        const x = colX(i);
        const cx = colCX(i);
        return (
          <g key={eco.name + "-col"}>
            {/* Column box */}
            <rect x={x} y={ECO_Y} width={COL_W} height={ECO_H} rx={6}
              fill="rgba(255,255,255,0.025)" stroke={`${eco.color}30`} strokeWidth={1}
            />
            {/* Top accent bar */}
            <rect x={x} y={ECO_Y} width={COL_W} height={4} rx={2}
              fill={eco.color} opacity={0.75}
            />
            {/* Ecosystem name */}
            <text x={cx} y={ECO_Y + 22} textAnchor="middle"
              fill={eco.color} fontSize={10.5} fontWeight={700} letterSpacing={1.5}
              fontFamily="'Barlow Condensed',sans-serif">
              {eco.name.toUpperCase()}
            </text>
            {/* Divider */}
            <line x1={x + 12} y1={ECO_Y + 30} x2={x + COL_W - 12} y2={ECO_Y + 30}
              stroke={eco.color} strokeWidth={0.6} strokeOpacity={0.35}
            />
            {/* Tool list */}
            {eco.tools.map((tool, j) => (
              <g key={tool}>
                <circle cx={x + 16} cy={ECO_Y + 46 + j * 24} r={2}
                  fill={eco.color} opacity={0.6}
                />
                <text x={x + 24} y={ECO_Y + 50 + j * 24} textAnchor="start"
                  fill={IVORY} fontSize={9.5} fontWeight={400} opacity={0.72}
                  fontFamily="'Barlow Condensed',sans-serif" letterSpacing={0.3}>
                  {tool}
                </text>
              </g>
            ))}
          </g>
        );
      })}

      {/* ═══ BOTTOM ANNOTATION ════════════════════════════════════════════════ */}
      <text x={W / 2} y={H - 8} textAnchor="middle"
        fill={IVORY} fontSize={9.5} opacity={0.28}
        fontFamily="'DM Mono',monospace" letterSpacing={0.8}>
        Readiness OS deploys on top of your existing stack. No rip-and-replace. Executive authority preserved on every activation.
      </text>

      {/* Gold top border */}
      <line x1={0} y1={0} x2={W} y2={0} stroke={GOLD} strokeWidth={2.5} opacity={0.6} />
    </svg>
  );
}
