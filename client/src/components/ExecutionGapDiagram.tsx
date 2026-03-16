import type { FC } from 'react';

const NAVY  = '#0A0F2E';
const GOLD  = '#C9A84C';
const TEAL  = '#2B8A6E';
const RED   = '#C0392B';
const WHITE = '#FFFFFF';

const ExecutionGapDiagram: FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 1320 730"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-full ${className}`}
    aria-label="Execution Gap Diagram: Traditional 72-hour process vs 12-minute Execution OS"
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
      <marker id="egArrowT" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
        <path d="M0,0 L0,6 L7,3 z" fill={TEAL} />
      </marker>
    </defs>

    {/* Page background */}
    <rect width="1320" height="730" fill="#F8F7F4" rx="14" />

    {/* ── TITLE ── */}
    <text x="660" y="46" textAnchor="middle" fontSize="26" fontWeight="700" fill={NAVY}
      fontFamily="'Cormorant Garamond', Georgia, serif">
      Collapsing the Execution Gap
    </text>
    <line x1="260" y1="56" x2="440" y2="56" stroke={GOLD} strokeWidth="1" opacity="0.5" />
    <line x1="880" y1="56" x2="1060" y2="56" stroke={GOLD} strokeWidth="1" opacity="0.5" />

    {/* ── SECTION LABELS ── */}
    <text x="240" y="78" textAnchor="middle" fontSize="10" fontWeight="700" letterSpacing="0.12em" fill={RED}
      fontFamily="'DM Sans', Arial, sans-serif">
      THE TRADITIONAL EXECUTION GAP
    </text>
    <text x="920" y="78" textAnchor="middle" fontSize="10" fontWeight="700" letterSpacing="0.12em" fill={TEAL}
      fontFamily="'DM Sans', Arial, sans-serif">
      THE EXECUTION OS ARCHITECTURE
    </text>

    {/* ── VERTICAL DIVIDER ── */}
    <line x1="505" y1="62" x2="505" y2="688" stroke={NAVY} strokeWidth="1.5" opacity="0.12" strokeDasharray="6,5" />

    {/* ════════════════ LEFT SIDE ════════════════ */}

    {/* Boardroom box */}
    <rect x="90" y="96" width="300" height="72" rx="8" fill="url(#egNavy)" />
    <text x="240" y="119" textAnchor="middle" fontSize="12" fontWeight="700" fill={WHITE}
      fontFamily="'DM Sans', Arial, sans-serif">BOARDROOM STRATEGY</text>
    <text x="240" y="138" textAnchor="middle" fontSize="10" fill={GOLD}
      fontFamily="'DM Sans', Arial, sans-serif">"Expand into new markets — immediately."</text>
    <text x="240" y="156" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.6)"
      fontFamily="'DM Sans', Arial, sans-serif">Clear direction. No execution system.</text>

    {/* Diverging chaos paths */}
    <path d="M 175 168 Q 130 220 108 295" stroke={RED} strokeWidth="2.5" fill="none" opacity="0.65" />
    <path d="M 200 168 Q 170 222 162 295" stroke={RED} strokeWidth="2.5" fill="none" opacity="0.65" />
    <path d="M 220 168 Q 215 222 215 295" stroke={RED} strokeWidth="2.5" fill="none" opacity="0.65" />
    <path d="M 250 168 Q 262 222 258 295" stroke={RED} strokeWidth="2.5" fill="none" opacity="0.65" />
    <path d="M 278 168 Q 305 222 320 295" stroke={RED} strokeWidth="2.5" fill="none" opacity="0.65" />

    {/* Middle management box */}
    <rect x="82" y="236" width="316" height="125" rx="7" fill={WHITE} stroke={RED} strokeWidth="2" />
    <text x="240" y="258" textAnchor="middle" fontSize="12" fontWeight="700" fill={RED}
      fontFamily="'DM Sans', Arial, sans-serif">MIDDLE MANAGEMENT</text>
    <line x1="95" y1="265" x2="385" y2="265" stroke={RED} strokeWidth="1" opacity="0.25" />
    <text x="100" y="283" fontSize="10" fill={NAVY} fontFamily="'DM Sans', Arial, sans-serif">⚠  Local priorities override strategy</text>
    <text x="100" y="300" fontSize="10" fill={NAVY} fontFamily="'DM Sans', Arial, sans-serif">⚠  Exceptions accumulate — no resolution</text>
    <text x="100" y="317" fontSize="10" fill={NAVY} fontFamily="'DM Sans', Arial, sans-serif">⚠  Escalation loops with no owner</text>
    <text x="100" y="334" fontSize="10" fill={NAVY} fontFamily="'DM Sans', Arial, sans-serif">⚠  Ownership diffuses across layers</text>

    {/* Further fragmentation dashes */}
    <path d="M 120 361 Q 100 425 92 490" stroke={RED} strokeWidth="1.5" fill="none" opacity="0.3" strokeDasharray="5,4" />
    <path d="M 158 361 Q 148 425 142 490" stroke={RED} strokeWidth="1.5" fill="none" opacity="0.3" strokeDasharray="5,4" />
    <path d="M 195 361 Q 193 425 192 490" stroke={RED} strokeWidth="1.5" fill="none" opacity="0.3" strokeDasharray="5,4" />
    <path d="M 238 361 Q 242 425 244 490" stroke={RED} strokeWidth="1.5" fill="none" opacity="0.3" strokeDasharray="5,4" />
    <path d="M 278 361 Q 295 425 310 490" stroke={RED} strokeWidth="1.5" fill="none" opacity="0.3" strokeDasharray="5,4" />
    <path d="M 320 361 Q 348 425 375 490" stroke={RED} strokeWidth="1.5" fill="none" opacity="0.3" strokeDasharray="5,4" />

    {/* Delay labels */}
    <text x="240" y="432" textAnchor="middle" fontSize="12" fontStyle="italic" fill={RED} opacity="0.8"
      fontFamily="'DM Sans', Arial, sans-serif">Execution stalls...</text>
    <text x="240" y="451" textAnchor="middle" fontSize="10" fontStyle="italic" fill={RED} opacity="0.6"
      fontFamily="'DM Sans', Arial, sans-serif">More meetings. More approvals. More delays.</text>
    <text x="240" y="468" textAnchor="middle" fontSize="10" fontStyle="italic" fill={RED} opacity="0.45"
      fontFamily="'DM Sans', Arial, sans-serif">Weeks → Months → Missed window</text>

    {/* 72 HRS box */}
    <rect x="90" y="502" width="300" height="92" rx="8" fill={RED} opacity="0.93" />
    <text x="240" y="526" textAnchor="middle" fontSize="9" fontWeight="700" letterSpacing="0.14em"
      fill="rgba(255,255,255,0.8)" fontFamily="'DM Sans', Arial, sans-serif">TIME JUST TO BEGIN PLANNING</text>
    <text x="240" y="567" textAnchor="middle" fontSize="42" fontWeight="700" fill={WHITE}
      fontFamily="'DM Sans', Arial, sans-serif">72 HRS</text>
    <text x="240" y="585" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.65)"
      fontFamily="'DM Sans', Arial, sans-serif">execution weeks or months away</text>

    {/* ════════════════ RIGHT SIDE ════════════════ */}

    {/* Strategic Decision box */}
    <rect x="770" y="96" width="300" height="72" rx="8" fill="url(#egNavy)" />
    <text x="920" y="119" textAnchor="middle" fontSize="12" fontWeight="700" fill={WHITE}
      fontFamily="'DM Sans', Arial, sans-serif">STRATEGIC DECISION</text>
    <text x="920" y="138" textAnchor="middle" fontSize="10" fill={GOLD}
      fontFamily="'DM Sans', Arial, sans-serif">"Expand into new markets — immediately."</text>
    <text x="920" y="156" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.6)"
      fontFamily="'DM Sans', Arial, sans-serif">Trigger fires. Playbook activates.</text>

    {/* Single clean arrow down */}
    <path d="M 920 168 L 920 208" stroke={TEAL} strokeWidth="3.5" fill="none" markerEnd="url(#egArrowT)" />

    {/* EXECUTION OS container */}
    <rect x="530" y="218" width="780" height="218" rx="10" fill="url(#egTeal)" />
    <text x="920" y="244" textAnchor="middle" fontSize="16" fontWeight="700" fill={WHITE}
      fontFamily="'DM Sans', Arial, sans-serif">EXECUTION OS</text>
    <text x="920" y="262" textAnchor="middle" fontSize="9" letterSpacing="0.14em"
      fill="rgba(201,168,76,0.9)" fontFamily="'DM Sans', Arial, sans-serif">SINGLE ORCHESTRATION LAYER · HUMAN-AI PARTNERSHIP</text>

    {/* Pillar 1 — Playbooks */}
    <rect x="542" y="276" width="228" height="146" rx="6" fill="rgba(255,255,255,0.97)" />
    <text x="656" y="298" textAnchor="middle" fontSize="12" fontWeight="700" fill={NAVY}
      fontFamily="'DM Sans', Arial, sans-serif">170 PLAYBOOKS</text>
    <line x1="552" y1="305" x2="760" y2="305" stroke="#E8E4DC" strokeWidth="1" />
    <text x="560" y="321" fontSize="9" fill="#555" fontFamily="'DM Sans', Arial, sans-serif">Pre-staged across 9 domains:</text>
    <text x="560" y="337" fontSize="9" fill="#555" fontFamily="'DM Sans', Arial, sans-serif">  • Market Entry    • M&A Integration</text>
    <text x="560" y="352" fontSize="9" fill="#555" fontFamily="'DM Sans', Arial, sans-serif">  • Brand Crisis    • Product Recall</text>
    <text x="560" y="367" fontSize="9" fill="#555" fontFamily="'DM Sans', Arial, sans-serif">  • Activist Defense  • ESG Crisis</text>
    <text x="560" y="382" fontSize="9" fill="#555" fontFamily="'DM Sans', Arial, sans-serif">  • Ransomware  + 2 more domains</text>
    <text x="656" y="410" textAnchor="middle" fontSize="9" fontWeight="700" fill={TEAL}
      fontFamily="'DM Sans', Arial, sans-serif">Activated in seconds</text>

    {/* Pillar 2 — Data Points */}
    <rect x="786" y="276" width="268" height="146" rx="6" fill="rgba(255,255,255,0.97)" />
    <text x="920" y="298" textAnchor="middle" fontSize="12" fontWeight="700" fill={NAVY}
      fontFamily="'DM Sans', Arial, sans-serif">248+ DATA POINTS</text>
    <line x1="796" y1="305" x2="1044" y2="305" stroke="#E8E4DC" strokeWidth="1" />
    <text x="804" y="321" fontSize="9" fill="#555" fontFamily="'DM Sans', Arial, sans-serif">Real-time context detection:</text>
    <text x="804" y="339" fontSize="9" fill={TEAL} fontFamily="'DM Sans', Arial, sans-serif">✓  Trade-offs auto-identified</text>
    <text x="804" y="355" fontSize="9" fill={TEAL} fontFamily="'DM Sans', Arial, sans-serif">✓  Ownership automatically assigned</text>
    <text x="804" y="371" fontSize="9" fill={TEAL} fontFamily="'DM Sans', Arial, sans-serif">✓  Dependencies mapped end-to-end</text>
    <text x="804" y="387" fontSize="9" fill={TEAL} fontFamily="'DM Sans', Arial, sans-serif">✓  Escalations prevented at source</text>
    <text x="804" y="403" fontSize="9" fill={TEAL} fontFamily="'DM Sans', Arial, sans-serif">✓  Exceptions resolved automatically</text>

    {/* Pillar 3 — Deployment */}
    <rect x="1070" y="276" width="228" height="146" rx="6" fill="rgba(255,255,255,0.97)" />
    <text x="1184" y="298" textAnchor="middle" fontSize="12" fontWeight="700" fill={NAVY}
      fontFamily="'DM Sans', Arial, sans-serif">FULL DEPLOYMENT</text>
    <line x1="1080" y1="305" x2="1288" y2="305" stroke="#E8E4DC" strokeWidth="1" />
    <text x="1088" y="323" fontSize="9" fill={TEAL} fontFamily="'DM Sans', Arial, sans-serif">✓  Roles assigned</text>
    <text x="1088" y="339" fontSize="9" fill={TEAL} fontFamily="'DM Sans', Arial, sans-serif">✓  Tasks staged</text>
    <text x="1088" y="355" fontSize="9" fill={TEAL} fontFamily="'DM Sans', Arial, sans-serif">✓  Communications drafted</text>
    <text x="1088" y="371" fontSize="9" fill={TEAL} fontFamily="'DM Sans', Arial, sans-serif">✓  Budget pre-approved</text>
    <text x="1184" y="399" textAnchor="middle" fontSize="26" fontWeight="700" fill={TEAL}
      fontFamily="'DM Sans', Arial, sans-serif">LIVE</text>
    <text x="1184" y="415" textAnchor="middle" fontSize="9" fill="#777"
      fontFamily="'DM Sans', Arial, sans-serif">execution in motion</text>

    {/* Arrow from OS to result */}
    <path d="M 920 436 L 920 476" stroke={TEAL} strokeWidth="3.5" fill="none" markerEnd="url(#egArrowT)" />

    {/* Live Execution box */}
    <rect x="770" y="476" width="300" height="64" rx="8" fill={TEAL} />
    <text x="920" y="501" textAnchor="middle" fontSize="13" fontWeight="700" fill={WHITE}
      fontFamily="'DM Sans', Arial, sans-serif">EXECUTION LIVE</text>
    <text x="920" y="519" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.82)"
      fontFamily="'DM Sans', Arial, sans-serif">All stakeholders moving. Leadership informed in real time.</text>

    {/* 12 MIN metric box */}
    <rect x="770" y="553" width="300" height="90" rx="8" fill="rgba(43,138,110,0.08)" stroke={TEAL} strokeWidth="1.5" />
    <text x="920" y="576" textAnchor="middle" fontSize="9" fontWeight="700" letterSpacing="0.14em" fill={TEAL}
      fontFamily="'DM Sans', Arial, sans-serif">TIME TO LIVE EXECUTION</text>
    <text x="920" y="618" textAnchor="middle" fontSize="44" fontWeight="700" fill={TEAL}
      fontFamily="'DM Sans', Arial, sans-serif">12 MIN</text>
    <text x="920" y="636" textAnchor="middle" fontSize="9" fill="#555"
      fontFamily="'DM Sans', Arial, sans-serif">340× faster than traditional coordination</text>

    {/* ── BOTTOM COMPARISON BAR ── */}
    <rect x="60" y="664" width="1200" height="52" rx="8" fill={NAVY} opacity="0.04" />
    <rect x="60" y="664" width="1200" height="52" rx="8" stroke={NAVY} strokeWidth="1" fill="none" opacity="0.08" />
    <text x="240" y="686" textAnchor="middle" fontSize="11" fontWeight="600" fill={RED}
      fontFamily="'DM Sans', Arial, sans-serif">Traditional: 72 hours just to plan</text>
    <text x="240" y="703" textAnchor="middle" fontSize="10" fill={RED} opacity="0.7"
      fontFamily="'DM Sans', Arial, sans-serif">execution weeks or months away</text>
    <text x="660" y="698" textAnchor="middle" fontSize="28" fontWeight="700" fill={GOLD}
      fontFamily="'Cormorant Garamond', Georgia, serif">→</text>
    <text x="920" y="686" textAnchor="middle" fontSize="11" fontWeight="600" fill={TEAL}
      fontFamily="'DM Sans', Arial, sans-serif">Execution OS: 12 minutes to live execution</text>
    <text x="920" y="703" textAnchor="middle" fontSize="10" fill={TEAL} opacity="0.8"
      fontFamily="'DM Sans', Arial, sans-serif">340× faster · Human-approved · AI-orchestrated</text>
  </svg>
);

export default ExecutionGapDiagram;
export { ExecutionGapDiagram };
