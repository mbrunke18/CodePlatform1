import type { FC } from 'react';

const NAVY  = '#0A0F2E';
const GOLD  = '#C9A84C';
const TEAL  = '#2B8A6E';
const RED   = '#C0392B';
const WHITE = '#FFFFFF';

const ExecutionGapDiagram: FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 1320 762"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-full ${className}`}
    aria-label="The real comparison: 30 days to still be planning vs 12 minutes to live execution"
  >
    <defs>
      <linearGradient id="egTeal" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#2B8A6E" />
        <stop offset="100%" stopColor="#1E6B54" />
      </linearGradient>
      <linearGradient id="egNavy" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#0D1436" />
        <stop offset="100%" stopColor="#0A0F2E" />
      </linearGradient>
      <linearGradient id="egRed" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#C0392B" />
        <stop offset="100%" stopColor="#A93226" />
      </linearGradient>
      <marker id="egArrowT" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
        <path d="M0,0 L0,6 L7,3 z" fill={TEAL} />
      </marker>
    </defs>

    {/* Background */}
    <rect width="1320" height="800" fill="#F8F7F4" rx="14" />

    {/* ── TITLE ── */}
    <text x="660" y="46" textAnchor="middle" fontSize="24" fontWeight="700" fill={NAVY}
      fontFamily="'Cormorant Garamond', Georgia, serif">
      The Execution Gap — What's Really Being Compared
    </text>
    <text x="660" y="68" textAnchor="middle" fontSize="12" fill="#6B7280"
      fontFamily="'DM Sans', Arial, sans-serif">
      30 days = still trying to get the right people in the room.  12 minutes = execution already live across the organization.
    </text>

    {/* ── SECTION LABELS ── */}
    <text x="240" y="96" textAnchor="middle" fontSize="10" fontWeight="700" letterSpacing="0.12em" fill={RED}
      fontFamily="'DM Sans', Arial, sans-serif">TRADITIONAL ENTERPRISE</text>
    <text x="920" y="96" textAnchor="middle" fontSize="10" fontWeight="700" letterSpacing="0.12em" fill={TEAL}
      fontFamily="'DM Sans', Arial, sans-serif">READINESS OS</text>

    {/* ── VERTICAL DIVIDER ── */}
    <line x1="510" y1="78" x2="510" y2="758" stroke={NAVY} strokeWidth="1.5" opacity="0.12" strokeDasharray="6,5" />

    {/* ════════════════ LEFT SIDE — TRADITIONAL ════════════════ */}

    {/* TRIGGER event — same for both sides */}
    <rect x="90" y="108" width="300" height="66" rx="8" fill="url(#egNavy)" />
    <text x="240" y="130" textAnchor="middle" fontSize="11" fontWeight="700" fill={WHITE}
      fontFamily="'DM Sans', Arial, sans-serif">STRATEGIC TRIGGER FIRES</text>
    <text x="240" y="148" textAnchor="middle" fontSize="10" fill={GOLD}
      fontFamily="'DM Sans', Arial, sans-serif">"Activist investor takes 8% stake"</text>
    <text x="240" y="163" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.6)"
      fontFamily="'DM Sans', Arial, sans-serif">Board notified. Clock starts.</text>

    {/* Chaos paths down */}
    <path d="M 170 174 Q 128 228 108 300" stroke={RED} strokeWidth="2.5" fill="none" opacity="0.6" />
    <path d="M 198 174 Q 168 228 160 300" stroke={RED} strokeWidth="2.5" fill="none" opacity="0.6" />
    <path d="M 222 174 Q 218 228 218 300" stroke={RED} strokeWidth="2.5" fill="none" opacity="0.6" />
    <path d="M 252 174 Q 265 228 262 300" stroke={RED} strokeWidth="2.5" fill="none" opacity="0.6" />
    <path d="M 280 174 Q 308 228 322 300" stroke={RED} strokeWidth="2.5" fill="none" opacity="0.6" />

    {/* WHAT HAPPENS IN 72 HRS — still just figuring it out */}
    <rect x="76" y="240" width="328" height="170" rx="7" fill={WHITE} stroke={RED} strokeWidth="2" />
    <text x="240" y="262" textAnchor="middle" fontSize="12" fontWeight="700" fill={RED}
      fontFamily="'DM Sans', Arial, sans-serif">30 DAYS LATER — STILL FIGURING IT OUT</text>
    <line x1="90" y1="269" x2="390" y2="269" stroke={RED} strokeWidth="1" opacity="0.2" />

    <text x="96" y="288" fontSize="10" fontWeight="600" fill={NAVY} fontFamily="'DM Sans', Arial, sans-serif">Who owns this response?</text>
    <text x="96" y="288" fontSize="10" fill={RED} fontFamily="'DM Sans', Arial, sans-serif" opacity="0">·</text>
    <text x="96" y="306" fontSize="10" fill="#555" fontFamily="'DM Sans', Arial, sans-serif">  → Unclear. Three VPs believe they own it.</text>
    <text x="96" y="324" fontSize="10" fontWeight="600" fill={NAVY} fontFamily="'DM Sans', Arial, sans-serif">What are the actual tasks?</text>
    <text x="96" y="342" fontSize="10" fill="#555" fontFamily="'DM Sans', Arial, sans-serif">  → Still being debated in committee.</text>
    <text x="96" y="360" fontSize="10" fontWeight="600" fill={NAVY} fontFamily="'DM Sans', Arial, sans-serif">What do we communicate, to whom?</text>
    <text x="96" y="378" fontSize="10" fill="#555" fontFamily="'DM Sans', Arial, sans-serif">  → Legal review not started. Comms on hold.</text>
    <text x="96" y="396" fontSize="10" fontWeight="600" fill={NAVY} fontFamily="'DM Sans', Arial, sans-serif">When does execution begin?</text>

    {/* More fragmentation */}
    <path d="M 120 410 Q 100 460 92 520" stroke={RED} strokeWidth="1.5" fill="none" opacity="0.28" strokeDasharray="5,4" />
    <path d="M 160 410 Q 148 460 142 520" stroke={RED} strokeWidth="1.5" fill="none" opacity="0.28" strokeDasharray="5,4" />
    <path d="M 200 410 Q 198 460 196 520" stroke={RED} strokeWidth="1.5" fill="none" opacity="0.28" strokeDasharray="5,4" />
    <path d="M 244 410 Q 248 460 250 520" stroke={RED} strokeWidth="1.5" fill="none" opacity="0.28" strokeDasharray="5,4" />
    <path d="M 285 410 Q 300 460 314 520" stroke={RED} strokeWidth="1.5" fill="none" opacity="0.28" strokeDasharray="5,4" />
    <path d="M 325 410 Q 352 460 378 520" stroke={RED} strokeWidth="1.5" fill="none" opacity="0.28" strokeDasharray="5,4" />

    {/* Status at 72 hrs */}
    <text x="240" y="488" textAnchor="middle" fontSize="11" fontStyle="italic" fill={RED} opacity="0.85"
      fontFamily="'DM Sans', Arial, sans-serif">Still scheduling the kickoff meeting.</text>
    <text x="240" y="507" textAnchor="middle" fontSize="10" fontStyle="italic" fill={RED} opacity="0.6"
      fontFamily="'DM Sans', Arial, sans-serif">Execution has not started.</text>

    {/* THE BRUTAL TRUTH BOX */}
    <rect x="90" y="533" width="300" height="106" rx="8" fill="url(#egRed)" />
    <text x="240" y="557" textAnchor="middle" fontSize="9" fontWeight="700" letterSpacing="0.14em"
      fill="rgba(255,255,255,0.75)" fontFamily="'DM Sans', Arial, sans-serif">WHAT 30 DAYS GETS YOU</text>
    <line x1="110" y1="564" x2="370" y2="564" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
    <text x="240" y="582" textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.9)"
      fontFamily="'DM Sans', Arial, sans-serif">A meeting agenda.</text>
    <text x="240" y="599" textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.9)"
      fontFamily="'DM Sans', Arial, sans-serif">A draft RACI. Unresolved ownership.</text>
    <text x="240" y="616" textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.9)"
      fontFamily="'DM Sans', Arial, sans-serif">No tasks staged. No comms sent.</text>
    <text x="240" y="633" textAnchor="middle" fontSize="13" fontWeight="700" fill={GOLD}
      fontFamily="'DM Sans', Arial, sans-serif">Execution hasn't started.</text>

    {/* ════════════════ RIGHT SIDE — READINESS OS ════════════════ */}

    {/* Same trigger */}
    <rect x="770" y="108" width="300" height="66" rx="8" fill="url(#egNavy)" />
    <text x="920" y="130" textAnchor="middle" fontSize="11" fontWeight="700" fill={WHITE}
      fontFamily="'DM Sans', Arial, sans-serif">STRATEGIC TRIGGER FIRES</text>
    <text x="920" y="148" textAnchor="middle" fontSize="10" fill={GOLD}
      fontFamily="'DM Sans', Arial, sans-serif">"Activist investor takes 8% stake"</text>
    <text x="920" y="163" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.6)"
      fontFamily="'DM Sans', Arial, sans-serif">Readiness OS detects. Readiness Protocol activates.</text>

    {/* Single clean arrow */}
    <path d="M 920 174 L 920 214" stroke={TEAL} strokeWidth="3.5" fill="none" markerEnd="url(#egArrowT)" />

    {/* READINESS OS BOX */}
    <rect x="535" y="224" width="770" height="204" rx="10" fill="url(#egTeal)" />
    <text x="920" y="250" textAnchor="middle" fontSize="15" fontWeight="700" fill={WHITE}
      fontFamily="'DM Sans', Arial, sans-serif">READINESS OS — SINGLE ORCHESTRATION LAYER</text>
    <text x="920" y="268" textAnchor="middle" fontSize="9" letterSpacing="0.13em"
      fill="rgba(201,168,76,0.9)" fontFamily="'DM Sans', Arial, sans-serif">170 PREPARED RESPONSES · 248+ DATA POINTS · 221 EXECUTIVE TRIGGERS · HUMAN-APPROVED AT EVERY GATE</text>

    {/* Three pillars */}
    {/* Pillar 1 */}
    <rect x="548" y="282" width="228" height="132" rx="6" fill="rgba(255,255,255,0.97)" />
    <text x="662" y="302" textAnchor="middle" fontSize="11" fontWeight="700" fill={NAVY}
      fontFamily="'DM Sans', Arial, sans-serif">ROLES ASSIGNED</text>
    <line x1="558" y1="309" x2="766" y2="309" stroke="#E8E4DC" strokeWidth="1" />
    <text x="566" y="326" fontSize="9" fill="#555" fontFamily="'DM Sans', Arial, sans-serif">Every stakeholder notified.</text>
    <text x="566" y="342" fontSize="9" fill={TEAL} fontFamily="'DM Sans', Arial, sans-serif">✓  CFO — financial exposure lead</text>
    <text x="566" y="357" fontSize="9" fill={TEAL} fontFamily="'DM Sans', Arial, sans-serif">✓  General Counsel — legal strategy</text>
    <text x="566" y="372" fontSize="9" fill={TEAL} fontFamily="'DM Sans', Arial, sans-serif">✓  IR lead — investor comms</text>
    <text x="566" y="387" fontSize="9" fill={TEAL} fontFamily="'DM Sans', Arial, sans-serif">✓  Board secretary — filings</text>
    <text x="662" y="406" textAnchor="middle" fontSize="8" fontWeight="700" fill="#999"
      fontFamily="'DM Sans', Arial, sans-serif">No ambiguity. No overlap.</text>

    {/* Pillar 2 */}
    <rect x="792" y="282" width="256" height="132" rx="6" fill="rgba(255,255,255,0.97)" />
    <text x="920" y="302" textAnchor="middle" fontSize="11" fontWeight="700" fill={NAVY}
      fontFamily="'DM Sans', Arial, sans-serif">TASKS STAGED</text>
    <line x1="802" y1="309" x2="1038" y2="309" stroke="#E8E4DC" strokeWidth="1" />
    <text x="810" y="326" fontSize="9" fill="#555" fontFamily="'DM Sans', Arial, sans-serif">Full execution sequence ready:</text>
    <text x="810" y="342" fontSize="9" fill={TEAL} fontFamily="'DM Sans', Arial, sans-serif">✓  Phase 1 tasks assigned with owners</text>
    <text x="810" y="357" fontSize="9" fill={TEAL} fontFamily="'DM Sans', Arial, sans-serif">✓  Dependencies mapped end-to-end</text>
    <text x="810" y="372" fontSize="9" fill={TEAL} fontFamily="'DM Sans', Arial, sans-serif">✓  Decision gates pre-configured</text>
    <text x="810" y="387" fontSize="9" fill={TEAL} fontFamily="'DM Sans', Arial, sans-serif">✓  Budget pre-authorized</text>
    <text x="920" y="406" textAnchor="middle" fontSize="8" fontWeight="700" fill="#999"
      fontFamily="'DM Sans', Arial, sans-serif">Teams already executing.</text>

    {/* Pillar 3 */}
    <rect x="1064" y="282" width="228" height="132" rx="6" fill="rgba(255,255,255,0.97)" />
    <text x="1178" y="302" textAnchor="middle" fontSize="11" fontWeight="700" fill={NAVY}
      fontFamily="'DM Sans', Arial, sans-serif">COMMS DRAFTED</text>
    <line x1="1074" y1="309" x2="1282" y2="309" stroke="#E8E4DC" strokeWidth="1" />
    <text x="1082" y="326" fontSize="9" fill="#555" fontFamily="'DM Sans', Arial, sans-serif">All communications ready:</text>
    <text x="1082" y="342" fontSize="9" fill={TEAL} fontFamily="'DM Sans', Arial, sans-serif">✓  Board memo drafted</text>
    <text x="1082" y="357" fontSize="9" fill={TEAL} fontFamily="'DM Sans', Arial, sans-serif">✓  Investor statement ready</text>
    <text x="1082" y="372" fontSize="9" fill={TEAL} fontFamily="'DM Sans', Arial, sans-serif">✓  Internal briefing sent</text>
    <text x="1082" y="387" fontSize="9" fill={TEAL} fontFamily="'DM Sans', Arial, sans-serif">✓  Regulatory filing staged</text>
    <text x="1178" y="406" textAnchor="middle" fontSize="8" fontWeight="700" fill="#999"
      fontFamily="'DM Sans', Arial, sans-serif">Legal-approved. Ready to send.</text>

    {/* Arrow down from OS */}
    <path d="M 920 428 L 920 466" stroke={TEAL} strokeWidth="3.5" fill="none" markerEnd="url(#egArrowT)" />

    {/* LIVE EXECUTION */}
    <rect x="770" y="466" width="300" height="62" rx="8" fill={TEAL} />
    <text x="920" y="490" textAnchor="middle" fontSize="13" fontWeight="700" fill={WHITE}
      fontFamily="'DM Sans', Arial, sans-serif">EXECUTION IS LIVE</text>
    <text x="920" y="510" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.85)"
      fontFamily="'DM Sans', Arial, sans-serif">Teams moving. Strategy preserved end-to-end.</text>

    {/* THE REAL OUTCOME BOX */}
    <rect x="770" y="542" width="300" height="106" rx="8" fill="rgba(43,138,110,0.08)" stroke={TEAL} strokeWidth="2" />
    <text x="920" y="566" textAnchor="middle" fontSize="9" fontWeight="700" letterSpacing="0.14em" fill={TEAL}
      fontFamily="'DM Sans', Arial, sans-serif">WHAT 12 MINUTES DELIVERS</text>
    <line x1="790" y1="573" x2="1050" y2="573" stroke={TEAL} strokeWidth="1" opacity="0.3" />
    <text x="800" y="591" fontSize="9" fill={TEAL} fontFamily="'DM Sans', Arial, sans-serif">✓  Roles assigned across the full org</text>
    <text x="800" y="607" fontSize="9" fill={TEAL} fontFamily="'DM Sans', Arial, sans-serif">✓  Tasks staged and already in motion</text>
    <text x="800" y="623" fontSize="9" fill={TEAL} fontFamily="'DM Sans', Arial, sans-serif">✓  Communications drafted and approved</text>
    <text x="920" y="641" textAnchor="middle" fontSize="13" fontWeight="700" fill={TEAL}
      fontFamily="'DM Sans', Arial, sans-serif">Execution underway.</text>

    {/* ── PROOF NUMBERS BAR ── */}
    <rect x="0" y="666" width="1320" height="96" fill={NAVY} />
    <line x1="0" y1="666" x2="1320" y2="666" stroke={GOLD} strokeWidth="1.5" opacity="0.4" />

    {/* 4 stats — equally spaced */}
    {[
      { x: 165,  num: '170',   label: 'Pre-Built Prepared responses' },
      { x: 495,  num: '221',   label: 'Executive Triggers' },
      { x: 825,  num: '248+',  label: 'Signal Data Points' },
      { x: 1155, num: '12 min', label: 'To Live Execution' },
    ].map(({ x, num, label }) => (
      <g key={label}>
        <text x={x} y="706" textAnchor="middle" fontSize="22" fontWeight="700" fill={GOLD}
          fontFamily="'Cormorant Garamond', Georgia, serif">{num}</text>
        <text x={x} y="726" textAnchor="middle" fontSize="9" fontWeight="700" letterSpacing="0.14em"
          fill="rgba(255,255,255,0.55)" fontFamily="'DM Sans', Arial, sans-serif">{label.toUpperCase()}</text>
      </g>
    ))}

    {/* Vertical dividers */}
    <line x1="330"  y1="682" x2="330"  y2="742" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
    <line x1="660"  y1="682" x2="660"  y2="742" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
    <line x1="990"  y1="682" x2="990"  y2="742" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

    {/* Tagline */}
    <text x="660" y="752" textAnchor="middle" fontSize="10" fontStyle="italic"
      fill="rgba(255,255,255,0.35)" fontFamily="'Cormorant Garamond', Georgia, serif">
      The infrastructure behind the 12-minute promise — built before the moment arrives.
    </text>
  </svg>
);

export default ExecutionGapDiagram;
export { ExecutionGapDiagram };
