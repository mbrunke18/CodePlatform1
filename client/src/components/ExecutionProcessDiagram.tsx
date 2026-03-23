import type { FC } from 'react';

const NAVY  = '#0A0F2E';
const NAVY2 = '#1a2850';
const GOLD  = '#C9A84C';
const TEAL  = '#2B8A6E';
const TEAL2 = '#236B56';
const OFF   = '#F5F7FA';
const BORDER= '#E8EDF2';
const WHITE = '#FFFFFF';

const ExecutionProcessDiagram: FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 1600 1440"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-full ${className}`}
    aria-label="Execution OS: From Strategic Trigger to Live Execution in 12 Minutes"
  >
    <defs>
      <linearGradient id="epNavy" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={NAVY} />
        <stop offset="100%" stopColor={NAVY2} />
      </linearGradient>
      <linearGradient id="epTeal" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={TEAL} />
        <stop offset="100%" stopColor={TEAL2} />
      </linearGradient>
      <linearGradient id="epBg" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#F5F7FA" />
        <stop offset="100%" stopColor="#EEF1F6" />
      </linearGradient>
      <filter id="epShadow" x="-5%" y="-5%" width="110%" height="115%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
        <feOffset dx="0" dy="3" result="offsetblur"/>
        <feComponentTransfer><feFuncA type="linear" slope="0.1"/></feComponentTransfer>
        <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>

    {/* Background */}
    <rect width="1600" height="1440" fill="url(#epBg)" />

    {/* ── TITLE BAND ── */}
    <rect x="0" y="0" width="1600" height="112" fill={WHITE} />
    <line x1="0" y1="112" x2="1600" y2="112" stroke={BORDER} strokeWidth="1.5" />
    <text x="800" y="50" textAnchor="middle" fontSize="34" fontWeight="700" fill={NAVY}
      fontFamily="'Cormorant Garamond', Georgia, serif">
      From Strategic Trigger to Live Execution — in 12 Minutes
    </text>
    <text x="800" y="82" textAnchor="middle" fontSize="14" fill={TEAL}
      fontFamily="'DM Sans', Arial, sans-serif">
      Every step that the traditional enterprise spends weeks negotiating — Execution OS delivers automatically.
    </text>

    {/* ══════════════════════════════════════════════════════
        SECTION 1 — YOUR STRATEGIC LAYER
    ══════════════════════════════════════════════════════ */}
    <rect x="50" y="132" width="1500" height="182" rx="8" fill={WHITE} filter="url(#epShadow)" />
    <text x="800" y="165" textAnchor="middle" fontSize="11" fontWeight="700" letterSpacing="0.2em" fill="#6B7280"
      fontFamily="'DM Sans', Arial, sans-serif">YOUR STRATEGIC LAYER — WHAT TRIGGERS IT</text>
    <line x1="300" y1="175" x2="1300" y2="175" stroke={BORDER} strokeWidth="1.5" />

    {/* Trigger input boxes — 4 categories */}
    {[
      { x: 80,  label: 'BOARD DECISIONS',      lines: ['Market expansion  •  Strategic pivots', 'Major investments  •  M&A activity', 'Org restructuring'] },
      { x: 330, label: 'EXECUTIVE PRIORITIES', lines: ['Annual planning  •  Initiative launches', 'OKRs / KPIs  •  Quarterly goals', 'Performance targets'] },
      { x: 580, label: 'CHANGE INITIATIVES',   lines: ['Platform cutovers  •  Tech migrations', 'Compliance mandates  •  Audits', 'Process redesigns'] },
      { x: 830, label: 'CRISIS RESPONSE',       lines: ['Regulatory changes  •  Incidents', 'Market disruptions  •  Threats', 'Competitive moves'] },
    ].map(({ x, label, lines }) => (
      <g key={label}>
        <rect x={x} y="186" width="228" height="108" rx="6" fill={OFF} stroke={TEAL} strokeWidth="1.5" />
        <text x={x + 114} y="206" textAnchor="middle" fontSize="10" fontWeight="700" fill={NAVY}
          fontFamily="'DM Sans', Arial, sans-serif">{label}</text>
        <line x1={x + 12} y1="213" x2={x + 216} y2="213" stroke={BORDER} strokeWidth="1" />
        {lines.map((line, i) => (
          <text key={i} x={x + 114} y={228 + i * 16} textAnchor="middle" fontSize="9" fill="#374151"
            fontFamily="'DM Sans', Arial, sans-serif">{line}</text>
        ))}
      </g>
    ))}

    {/* Example trigger callout */}
    <rect x="1086" y="186" width="442" height="108" rx="6" fill={GOLD} />
    <text x="1307" y="207" textAnchor="middle" fontSize="9" fontWeight="700" letterSpacing="0.14em" fill={NAVY}
      fontFamily="'DM Sans', Arial, sans-serif">EXAMPLE TRIGGER</text>
    <text x="1307" y="236" textAnchor="middle" fontSize="17" fontWeight="700" fill={WHITE}
      fontFamily="'Cormorant Garamond', Georgia, serif">"Competitor launches 30% price</text>
    <text x="1307" y="257" textAnchor="middle" fontSize="17" fontWeight="700" fill={WHITE}
      fontFamily="'Cormorant Garamond', Georgia, serif">reduction in key markets"</text>
    <text x="1307" y="280" textAnchor="middle" fontSize="9" fill={NAVY} fontFamily="'DM Sans', Arial, sans-serif">
      Market Intelligence Alert  |  Monday 7:30 AM
    </text>

    {/* Arrow down */}
    <path d="M 800 314 L 800 358" stroke={TEAL} strokeWidth="4" fill="none" />
    <polygon points="800,370 788,355 812,355" fill={TEAL} />

    {/* ══════════════════════════════════════════════════════
        SECTION 2 — ORCHESTRATION
    ══════════════════════════════════════════════════════ */}
    <rect x="50" y="380" width="1500" height="510" rx="8" fill={WHITE} filter="url(#epShadow)" />
    <rect x="50" y="380" width="1500" height="56" rx="8" fill="url(#epTeal)" />
    {/* Round off bottom corners of header separately */}
    <rect x="50" y="412" width="1500" height="24" fill={TEAL2} />

    <text x="800" y="417" textAnchor="middle" fontSize="18" fontWeight="700" fill={WHITE}
      fontFamily="'DM Sans', Arial, sans-serif">EXECUTION OS ORCHESTRATION LAYER</text>

    {/* 12 min badge */}
    <circle cx="1462" cy="408" r="34" fill={GOLD} />
    <text x="1462" y="402" textAnchor="middle" fontSize="9" fontWeight="700" fill={NAVY}
      fontFamily="'DM Sans', Arial, sans-serif">DEPLOY</text>
    <text x="1462" y="420" textAnchor="middle" fontSize="15" fontWeight="700" fill={NAVY}
      fontFamily="'DM Sans', Arial, sans-serif">12 min</text>

    {/* ── ROW 1: Steps 1–4 ── */}

    {/* Step 1 */}
    <rect x="78" y="456" width="290" height="130" rx="6" fill={OFF} stroke={TEAL} strokeWidth="2" />
    <circle cx="112" cy="490" r="19" fill={TEAL} />
    <text x="112" y="497" textAnchor="middle" fontSize="14" fontWeight="700" fill={WHITE}
      fontFamily="'DM Sans', Arial, sans-serif">1</text>
    <text x="148" y="494" fontSize="12" fontWeight="700" fill={NAVY}
      fontFamily="'DM Sans', Arial, sans-serif">CONTEXT ANALYSIS</text>
    {['Maps to your org structure', 'Identifies stakeholders across depts', 'Reads current system state'].map((t, i) => (
      <text key={i} x="92" y={514 + i * 18} fontSize="9" fill="#374151" fontFamily="'DM Sans', Arial, sans-serif">✓  {t}</text>
    ))}

    {/* Arrow 1→2 */}
    <polygon points="384,521 398,521 398,511 413,526 398,541 398,531 384,531" fill={GOLD} />

    {/* Step 2 */}
    <rect x="428" y="456" width="290" height="130" rx="6" fill={OFF} stroke={TEAL} strokeWidth="2" />
    <circle cx="462" cy="490" r="19" fill={TEAL} />
    <text x="462" y="497" textAnchor="middle" fontSize="14" fontWeight="700" fill={WHITE}
      fontFamily="'DM Sans', Arial, sans-serif">2</text>
    <text x="498" y="494" fontSize="12" fontWeight="700" fill={NAVY}
      fontFamily="'DM Sans', Arial, sans-serif">PLAYBOOK SELECTION</text>
    {['"Competitive Response — Pricing"', 'Customized to your org structure', 'Adapts to your tools & processes'].map((t, i) => (
      <text key={i} x="442" y={514 + i * 18} fontSize="9" fill="#374151" fontFamily="'DM Sans', Arial, sans-serif">✓  {t}</text>
    ))}

    {/* Arrow 2→3 */}
    <polygon points="734,521 748,521 748,511 763,526 748,541 748,531 734,531" fill={GOLD} />

    {/* Step 3 */}
    <rect x="778" y="456" width="290" height="130" rx="6" fill={OFF} stroke={TEAL} strokeWidth="2" />
    <circle cx="812" cy="490" r="19" fill={TEAL} />
    <text x="812" y="497" textAnchor="middle" fontSize="14" fontWeight="700" fill={WHITE}
      fontFamily="'DM Sans', Arial, sans-serif">3</text>
    <text x="848" y="494" fontSize="12" fontWeight="700" fill={NAVY}
      fontFamily="'DM Sans', Arial, sans-serif">IMPACT ANALYSIS</text>
    {['Contract terms & margin thresholds', 'Customer churn risk quantified', 'Sales pipeline exposure mapped'].map((t, i) => (
      <text key={i} x="792" y={514 + i * 18} fontSize="9" fill="#374151" fontFamily="'DM Sans', Arial, sans-serif">✓  {t}</text>
    ))}

    {/* Arrow 3→4 */}
    <polygon points="1084,521 1098,521 1098,511 1113,526 1098,541 1098,531 1084,531" fill={GOLD} />

    {/* Step 4 */}
    <rect x="1128" y="456" width="390" height="130" rx="6" fill={OFF} stroke={TEAL} strokeWidth="2" />
    <circle cx="1163" cy="490" r="19" fill={TEAL} />
    <text x="1163" y="497" textAnchor="middle" fontSize="14" fontWeight="700" fill={WHITE}
      fontFamily="'DM Sans', Arial, sans-serif">4</text>
    <text x="1198" y="494" fontSize="12" fontWeight="700" fill={NAVY}
      fontFamily="'DM Sans', Arial, sans-serif">ROLE ASSIGNMENT</text>
    {['Legal (contracts)  ·  Finance (margin)  ·  Sales (retention)', 'Marketing (positioning)  ·  Product (competitive parity)', 'Named individuals, clear accountability, no overlap'].map((t, i) => (
      <text key={i} x="1144" y={514 + i * 18} fontSize="9" fill="#374151" fontFamily="'DM Sans', Arial, sans-serif">✓  {t}</text>
    ))}

    {/* ── Connector: Row 1 → Row 2 ── */}
    <path d="M 573 586 L 573 624" stroke={GOLD} strokeWidth="2.5" fill="none" />
    <polygon points="573,638 561,623 585,623" fill={GOLD} />

    {/* ── ROW 2: Steps 5–6 + Live badge ── */}

    {/* Step 5 */}
    <rect x="428" y="648" width="290" height="130" rx="6" fill={OFF} stroke={TEAL} strokeWidth="2" />
    <circle cx="462" cy="682" r="19" fill={TEAL} />
    <text x="462" y="689" textAnchor="middle" fontSize="14" fontWeight="700" fill={WHITE}
      fontFamily="'DM Sans', Arial, sans-serif">5</text>
    <text x="498" y="686" fontSize="12" fontWeight="700" fill={NAVY}
      fontFamily="'DM Sans', Arial, sans-serif">TASK ORCHESTRATION</text>
    {['52 tasks across 5 teams created', 'Jira, Asana, Smartsheet, ServiceNow', 'Dependencies visible, timeline set'].map((t, i) => (
      <text key={i} x="442" y={706 + i * 18} fontSize="9" fill="#374151" fontFamily="'DM Sans', Arial, sans-serif">✓  {t}</text>
    ))}

    {/* Arrow 5→6 */}
    <polygon points="734,713 748,713 748,703 763,718 748,733 748,723 734,723" fill={GOLD} />

    {/* Step 6 */}
    <rect x="778" y="648" width="290" height="130" rx="6" fill={OFF} stroke={TEAL} strokeWidth="2" />
    <circle cx="812" cy="682" r="19" fill={TEAL} />
    <text x="812" y="689" textAnchor="middle" fontSize="14" fontWeight="700" fill={WHITE}
      fontFamily="'DM Sans', Arial, sans-serif">6</text>
    <text x="848" y="686" fontSize="12" fontWeight="700" fill={NAVY}
      fontFamily="'DM Sans', Arial, sans-serif">COMMUNICATIONS</text>
    {['Slack messages sent to every team', 'Stakeholder briefings drafted & sent', 'Execution underway — no kickoff needed'].map((t, i) => (
      <text key={i} x="792" y={706 + i * 18} fontSize="9" fill="#374151" fontFamily="'DM Sans', Arial, sans-serif">✓  {t}</text>
    ))}

    {/* Arrow 6→Live */}
    <polygon points="1084,713 1098,713 1098,703 1113,718 1098,733 1098,723 1084,723" fill={GOLD} />

    {/* EXECUTION LIVE badge */}
    <rect x="1128" y="648" width="390" height="130" rx="6" fill={TEAL} />
    <text x="1323" y="690" textAnchor="middle" fontSize="20" fontWeight="700" fill={WHITE}
      fontFamily="'DM Sans', Arial, sans-serif">✓  EXECUTION LIVE</text>
    <line x1="1148" y1="700" x2="1498" y2="700" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
    {['Teams already moving  |  Roles clear', 'Tasks assigned  |  Communications sent', 'Strategy preserved end-to-end'].map((t, i) => (
      <text key={i} x="1323" y={720 + i * 18} textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.9)"
        fontFamily="'DM Sans', Arial, sans-serif">{t}</text>
    ))}

    {/* Compression summary bar */}
    <rect x="78" y="798" width="1440" height="78" rx="6" fill={OFF} />
    <text x="800" y="828" textAnchor="middle" fontSize="13" fontWeight="700" fill={NAVY}
      fontFamily="'DM Sans', Arial, sans-serif">
      THE COMPRESSION: What traditional enterprises spend 30 days trying to plan (and months to execute)...
    </text>
    <text x="800" y="858" textAnchor="middle" fontSize="18" fontWeight="700" fill={TEAL}
      fontFamily="'Cormorant Garamond', Georgia, serif">
      Execution OS delivers in 12 minutes — from trigger to live organizational execution
    </text>

    {/* Arrow down */}
    <path d="M 800 900 L 800 940" stroke={TEAL} strokeWidth="4" fill="none" />
    <polygon points="800,952 788,937 812,937" fill={TEAL} />

    {/* ══════════════════════════════════════════════════════
        SECTION 3 — EXISTING SYSTEMS
    ══════════════════════════════════════════════════════ */}
    <rect x="50" y="962" width="1500" height="388" rx="8" fill={WHITE} filter="url(#epShadow)" />
    <text x="800" y="1002" textAnchor="middle" fontSize="18" fontWeight="700" fill={NAVY}
      fontFamily="'DM Sans', Arial, sans-serif">DELIVERED INTO YOUR EXISTING SYSTEMS</text>
    <text x="800" y="1026" textAnchor="middle" fontSize="12" fill={TEAL}
      fontFamily="'DM Sans', Arial, sans-serif">No replacement. No new tools. Just orchestration across what you already have.</text>
    <line x1="300" y1="1040" x2="1300" y2="1040" stroke={BORDER} strokeWidth="1.5" />

    {/* System cards */}
    {[
      { x: 76,   emoji: '💬', name: 'Slack',      lines: ['Live execution alerts', 'Team notifications'] },
      { x: 262,  emoji: '📋', name: 'Jira',       lines: ['Issue tracking', 'Dev workflow'] },
      { x: 448,  emoji: '✅', name: 'Asana',      lines: ['Task management', 'Project tracking'] },
      { x: 634,  emoji: '📊', name: 'Smartsheet', lines: ['Timeline visibility', 'Resource planning'] },
      { x: 820,  emoji: '🔧', name: 'ServiceNow', lines: ['Change management', 'Incident response'] },
      { x: 1006, emoji: '📧', name: 'Email',      lines: ['Stakeholder briefings', 'Executive comms'] },
      { x: 1192, emoji: '📝', name: 'Confluence', lines: ['Documentation', 'Runbooks'] },
      { x: 1378, emoji: '💼', name: 'Salesforce', lines: ['Account alerts', 'Customer updates'] },
    ].map(({ x, emoji, name, lines }) => (
      <g key={name}>
        <rect x={x} y="1056" width="168" height="98" rx="6" fill={OFF} stroke={TEAL} strokeWidth="1.5" />
        <text x={x + 84} y="1086" textAnchor="middle" fontSize="26">{emoji}</text>
        <text x={x + 84} y="1110" textAnchor="middle" fontSize="10" fontWeight="700" fill={NAVY}
          fontFamily="'DM Sans', Arial, sans-serif">{name}</text>
        {lines.map((l, i) => (
          <text key={i} x={x + 84} y={1126 + i * 14} textAnchor="middle" fontSize="8" fill={TEAL}
            fontFamily="'DM Sans', Arial, sans-serif">{l}</text>
        ))}
      </g>
    ))}

    {/* Audience cards */}
    {[
      {
        x: 78, label: 'WHAT YOUR TEAMS SEE',
        lines: ['Tasks appear in their normal workflow — not a new system', 'Slack: "You own X. Here\'s your context and deadline."', 'Clear accountability from the moment execution goes live', 'No confusion, no coordination latency']
      },
      {
        x: 578, label: 'WHAT YOUR MANAGERS SEE',
        lines: ['Real-time progress across all active playbooks', 'Escalation alerts before problems surface', 'Trade-off decisions surfaced with full context', 'No status meetings required']
      },
      {
        x: 1078, label: 'WHAT YOUR EXECUTIVES SEE',
        lines: ['Decision → live execution status in real-time', 'Strategy preserved through every organizational layer', 'Outcomes tracked against original intent', 'Pattern recognition for future decision-making']
      },
    ].map(({ x, label, lines }) => (
      <g key={label}>
        <rect x={x} y="1174" width="484" height="138" rx="6" fill={OFF} stroke={NAVY} strokeWidth="1.5" />
        <text x={x + 242} y="1198" textAnchor="middle" fontSize="11" fontWeight="700" fill={NAVY}
          fontFamily="'DM Sans', Arial, sans-serif">{label}</text>
        <line x1={x + 16} y1="1207" x2={x + 468} y2="1207" stroke={BORDER} strokeWidth="1" />
        {lines.map((l, i) => (
          <text key={i} x={x + 22} y={1226 + i * 20} fontSize="9" fill="#374151"
            fontFamily="'DM Sans', Arial, sans-serif">•  {l}</text>
        ))}
      </g>
    ))}

    {/* ── FOOTER TAGLINE ── */}
    <rect x="0" y="1382" width="1600" height="58" fill={NAVY} />
    <line x1="0" y1="1382" x2="1600" y2="1382" stroke={GOLD} strokeWidth="2" />
    <text x="800" y="1409" textAnchor="middle" fontSize="16" fontStyle="italic" fill={GOLD}
      fontFamily="'Cormorant Garamond', Georgia, serif">
      "Strategy is executed by systems, not executives."
    </text>
    <text x="800" y="1430" textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.8)"
      fontFamily="'DM Sans', Arial, sans-serif">
      Execution OS is that system — embedded in yours.
    </text>
  </svg>
);

export default ExecutionProcessDiagram;
export { ExecutionProcessDiagram };
