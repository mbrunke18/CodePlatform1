import type { FC } from 'react';

const NAVY   = '#0A0F2E';
const NAVY_B = '#132558';
const GOLD   = '#C9A84C';
const TEAL   = '#2B8A6E';
const TEAL_D = '#1D6954';
const OFF    = '#F5F7FA';
const IVORY  = '#F0EDE4';
const BORDER = '#E8EDF2';
const WHITE  = '#FFFFFF';

const ReadinessOSFullStoryDiagram: FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 1600 1660"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-full ${className}`}
    aria-label="The Complete Readiness OS Story — From Preparation to Execution to Continuous Improvement"
  >
    <defs>
      <linearGradient id="fsBg" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#F5F7FA"/>
        <stop offset="100%" stopColor="#EEF1F6"/>
      </linearGradient>
      <linearGradient id="fsTeal" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={TEAL}/>
        <stop offset="100%" stopColor={TEAL_D}/>
      </linearGradient>
      <linearGradient id="fsNavy" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={NAVY}/>
        <stop offset="100%" stopColor={NAVY_B}/>
      </linearGradient>
      <filter id="fsShadow" x="-5%" y="-5%" width="110%" height="116%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
        <feOffset dx="0" dy="3" result="offsetblur"/>
        <feComponentTransfer><feFuncA type="linear" slope="0.1"/></feComponentTransfer>
        <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>

    {/* Background */}
    <rect width="1600" height="1660" fill="url(#fsBg)"/>

    {/* ══════════════════════════════════════════════
        TITLE BAND
    ══════════════════════════════════════════════ */}
    <rect x="0" y="0" width="1600" height="90" fill={WHITE}/>
    <line x1="0" y1="90" x2="1600" y2="90" stroke={BORDER} strokeWidth="1.5"/>
    <text x="800" y="44" textAnchor="middle" fontSize="30" fontWeight="700" fill={NAVY}
      fontFamily="'Cormorant Garamond',Georgia,serif">The Complete Readiness OS Story</text>
    <text x="800" y="72" textAnchor="middle" fontSize="12.5" fill={TEAL}
      fontFamily="'Barlow',Arial,sans-serif">
      From Preparation to Execution to Continuous Improvement — the full platform story, end to end
    </text>

    {/* ══════════════════════════════════════════════
        PHASE INDICATOR BAR
    ══════════════════════════════════════════════ */}
    <rect x="0" y="90" width="534" height="34" fill={GOLD}/>
    <text x="267" y="113" textAnchor="middle" fontSize="9" fontWeight="800" letterSpacing="3.5" fill={NAVY}
      fontFamily="'Barlow',Arial,sans-serif">BEFORE THE TRIGGER</text>
    <rect x="534" y="90" width="532" height="34" fill={TEAL}/>
    <text x="800" y="113" textAnchor="middle" fontSize="9" fontWeight="800" letterSpacing="3.5" fill={WHITE}
      fontFamily="'Barlow',Arial,sans-serif">DURING THE 12 MINUTES</text>
    <rect x="1066" y="90" width="534" height="34" fill="url(#fsNavy)"/>
    <text x="1333" y="113" textAnchor="middle" fontSize="9" fontWeight="800" letterSpacing="3.5" fill={GOLD}
      fontFamily="'Barlow',Arial,sans-serif">AFTER EVERY ACTIVATION</text>

    {/* ══════════════════════════════════════════════
        SECTION 1 — THE READINESS FOUNDATION
        y=124 – 332
    ══════════════════════════════════════════════ */}
    <rect x="0" y="124" width="1600" height="208" fill={IVORY}/>
    <line x1="0" y1="332" x2="1600" y2="332" stroke="#D0CBBF" strokeWidth="1.5"/>
    <text x="800" y="152" textAnchor="middle" fontSize="10" fontWeight="800" letterSpacing="3.5" fill={NAVY}
      fontFamily="'Barlow',Arial,sans-serif">
      THE READINESS FOUNDATION — PRE-STAGED BEFORE ANY SITUATION ARRIVES
    </text>

    {/* Pillar 1 — 180 Protocols */}
    <rect x="52" y="162" width="484" height="128" rx="6" fill={WHITE} stroke={GOLD} strokeWidth="2" filter="url(#fsShadow)"/>
    <rect x="52" y="162" width="484" height="5" fill={GOLD}/>
    <text x="294" y="189" textAnchor="middle" fontSize="14" fontWeight="700" fill={NAVY}
      fontFamily="'Barlow',Arial,sans-serif">180 Readiness Protocols</text>
    <text x="294" y="207" textAnchor="middle" fontSize="9.5" fill="#6B7280"
      fontFamily="'Barlow',Arial,sans-serif">Pre-configured responses for every situation you'd expect to face</text>
    <line x1="72" y1="215" x2="516" y2="215" stroke={BORDER} strokeWidth="1"/>
    <text x="76" y="234" fontSize="9.5" fill="#374151" fontFamily="'Barlow',Arial,sans-serif">✓  Staged before the trigger fires</text>
    <text x="76" y="252" fontSize="9.5" fill="#374151" fontFamily="'Barlow',Arial,sans-serif">✓  Customized to your org structure &amp; industry</text>
    <text x="76" y="270" fontSize="9.5" fill="#374151" fontFamily="'Barlow',Arial,sans-serif">✓  Ready on day one — no build required</text>

    {/* Pillar 2 — 231 Thresholds */}
    <rect x="558" y="162" width="484" height="128" rx="6" fill={WHITE} stroke={TEAL} strokeWidth="2" filter="url(#fsShadow)"/>
    <rect x="558" y="162" width="484" height="5" fill={TEAL}/>
    <text x="800" y="189" textAnchor="middle" fontSize="14" fontWeight="700" fill={NAVY}
      fontFamily="'Barlow',Arial,sans-serif">231 Detection Thresholds</text>
    <text x="800" y="207" textAnchor="middle" fontSize="9.5" fill="#6B7280"
      fontFamily="'Barlow',Arial,sans-serif">Monitoring 248+ data points across 20 signal categories, 24/7</text>
    <line x1="578" y1="215" x2="1022" y2="215" stroke={BORDER} strokeWidth="1"/>
    <text x="582" y="234" fontSize="9.5" fill="#374151" fontFamily="'Barlow',Arial,sans-serif">✓  Scanned every 15 minutes</text>
    <text x="582" y="252" fontSize="9.5" fill="#374151" fontFamily="'Barlow',Arial,sans-serif">✓  Alerts at earliest signal — before the announcement</text>
    <text x="582" y="270" fontSize="9.5" fill="#374151" fontFamily="'Barlow',Arial,sans-serif">✓  Detect on your terms, not the market's</text>

    {/* Pillar 3 — Authority */}
    <rect x="1064" y="162" width="484" height="128" rx="6" fill={WHITE} stroke={NAVY} strokeWidth="2" filter="url(#fsShadow)"/>
    <rect x="1064" y="162" width="484" height="5" fill={NAVY}/>
    <text x="1306" y="189" textAnchor="middle" fontSize="14" fontWeight="700" fill={NAVY}
      fontFamily="'Barlow',Arial,sans-serif">Stakeholders, Budgets &amp; Authority</text>
    <text x="1306" y="207" textAnchor="middle" fontSize="9.5" fill="#6B7280"
      fontFamily="'Barlow',Arial,sans-serif">Decision rights assigned before the pressure arrives</text>
    <line x1="1084" y1="215" x2="1528" y2="215" stroke={BORDER} strokeWidth="1"/>
    <text x="1088" y="234" fontSize="9.5" fill="#374151" fontFamily="'Barlow',Arial,sans-serif">✓  Named owners pre-assigned by domain</text>
    <text x="1088" y="252" fontSize="9.5" fill="#374151" fontFamily="'Barlow',Arial,sans-serif">✓  Budget thresholds pre-approved</text>
    <text x="1088" y="270" fontSize="9.5" fill="#374151" fontFamily="'Barlow',Arial,sans-serif">✓  Escalation paths locked in advance</text>

    {/* Quote */}
    <text x="800" y="318" textAnchor="middle" fontSize="13" fontStyle="italic" fill={GOLD}
      fontFamily="'Cormorant Garamond',Georgia,serif">
      "The response is ready before the trigger fires."
    </text>

    {/* Arrow ↓ */}
    <path d="M 800 332 L 800 358" stroke={TEAL} strokeWidth="3.5" fill="none"/>
    <polygon points="800,371 787,356 813,356" fill={TEAL}/>
    <text x="824" y="352" fontSize="10" fill={TEAL} fontFamily="'Barlow',Arial,sans-serif">A situation presents itself →</text>

    {/* ══════════════════════════════════════════════
        SECTION 2 — YOUR STRATEGIC LAYER
        y=374 – 554
    ══════════════════════════════════════════════ */}
    <rect x="50" y="374" width="1500" height="178" rx="8" fill={WHITE} filter="url(#fsShadow)"/>
    <text x="800" y="404" textAnchor="middle" fontSize="10" fontWeight="700" letterSpacing="3.5" fill="#6B7280"
      fontFamily="'Barlow',Arial,sans-serif">YOUR STRATEGIC LAYER — WHAT TRIGGERS IT</text>
    <line x1="300" y1="412" x2="1300" y2="412" stroke={BORDER} strokeWidth="1.5"/>

    {/* 4 category boxes */}
    {([
      { x: 78,  label: 'BOARD DECISIONS',      lines: ['Market expansion  •  Strategic pivots', 'Major investments  •  M&A activity', 'Org restructuring'] },
      { x: 325, label: 'EXECUTIVE PRIORITIES', lines: ['Annual planning  •  Initiative launches', 'OKRs / KPIs  •  Quarterly goals', 'Performance targets'] },
      { x: 572, label: 'CHANGE INITIATIVES',   lines: ['Platform cutovers  •  Tech migrations', 'Compliance mandates  •  Audits', 'Process redesigns'] },
      { x: 819, label: 'CRISIS RESPONSE',       lines: ['Regulatory changes  •  Incidents', 'Market disruptions  •  Threats', 'Competitive moves'] },
    ] as { x: number; label: string; lines: string[] }[]).map(({ x, label, lines }) => (
      <g key={label}>
        <rect x={x} y="422" width="220" height="110" rx="6" fill={OFF} stroke={TEAL} strokeWidth="1.5"/>
        <text x={x + 110} y="440" textAnchor="middle" fontSize="9.5" fontWeight="700" fill={NAVY}
          fontFamily="'Barlow',Arial,sans-serif">{label}</text>
        <line x1={x + 10} y1="447" x2={x + 210} y2="447" stroke={BORDER} strokeWidth="1"/>
        {lines.map((line, i) => (
          <text key={i} x={x + 110} y={463 + i * 17} textAnchor="middle" fontSize="8.5" fill="#374151"
            fontFamily="'Barlow',Arial,sans-serif">{line}</text>
        ))}
      </g>
    ))}

    {/* Example trigger (gold) */}
    <rect x="1064" y="422" width="466" height="110" rx="6" fill={GOLD}/>
    <text x="1297" y="442" textAnchor="middle" fontSize="9" fontWeight="700" letterSpacing="3" fill={NAVY}
      fontFamily="'Barlow',Arial,sans-serif">EXAMPLE TRIGGER</text>
    <text x="1297" y="466" textAnchor="middle" fontSize="16" fontWeight="700" fill={WHITE}
      fontFamily="'Cormorant Garamond',Georgia,serif">"Competitor launches 30% price</text>
    <text x="1297" y="485" textAnchor="middle" fontSize="16" fontWeight="700" fill={WHITE}
      fontFamily="'Cormorant Garamond',Georgia,serif">reduction in key markets"</text>
    <text x="1297" y="510" textAnchor="middle" fontSize="9" fill={NAVY}
      fontFamily="'Barlow',Arial,sans-serif">Market Intelligence Alert  |  Monday 7:30 AM</text>

    {/* Arrow ↓ */}
    <path d="M 800 552 L 800 570" stroke={TEAL} strokeWidth="4" fill="none"/>
    <polygon points="800,583 787,568 813,568" fill={TEAL}/>

    {/* ══════════════════════════════════════════════
        SECTION 3 — ORCHESTRATION LAYER
        y=584 – 946
    ══════════════════════════════════════════════ */}
    <rect x="50" y="584" width="1500" height="360" rx="8" fill={WHITE} filter="url(#fsShadow)"/>
    <rect x="50" y="584" width="1500" height="54" rx="8" fill="url(#fsTeal)"/>
    <rect x="50" y="610" width="1500" height="28" fill={TEAL_D}/>
    <text x="780" y="617" textAnchor="middle" fontSize="17" fontWeight="700" fill={WHITE}
      fontFamily="'Barlow',Arial,sans-serif">READINESS OS ORCHESTRATION LAYER</text>
    <circle cx="1462" cy="611" r="33" fill={GOLD}/>
    <text x="1462" y="604" textAnchor="middle" fontSize="8.5" fontWeight="700" fill={NAVY}
      fontFamily="'Barlow',Arial,sans-serif">DEPLOY</text>
    <text x="1462" y="622" textAnchor="middle" fontSize="14" fontWeight="700" fill={NAVY}
      fontFamily="'Barlow',Arial,sans-serif">12 min</text>

    {/* Row 1: Steps 1–4 */}
    {([
      { n: '1', title: 'CONTEXT ANALYSIS',   items: ['Maps to your org structure', 'Identifies stakeholders across depts', 'Reads current system state'] },
      { n: '2', title: 'PROTOCOL SELECTION', items: ['"Competitive Response — Pricing"', 'Customized to your org structure', 'Adapts to your tools & processes'] },
      { n: '3', title: 'IMPACT ANALYSIS',    items: ['Contract terms & margin thresholds', 'Customer churn risk quantified', 'Sales pipeline exposure mapped'] },
      { n: '4', title: 'ROLE ASSIGNMENT',    items: ['Legal · Finance · Sales · Marketing', 'Named individuals, clear accountability', 'No overlap, no confusion'] },
    ] as { n: string; title: string; items: string[] }[]).map((s, i) => {
      const bx = 78 + i * 362;
      return (
        <g key={s.n}>
          <rect x={bx} y="652" width="290" height="124" rx="6" fill={OFF} stroke={TEAL} strokeWidth="2"/>
          <circle cx={bx + 32} cy={683} r="18" fill={TEAL}/>
          <text x={bx + 32} y="689" textAnchor="middle" fontSize="13" fontWeight="700" fill={WHITE}
            fontFamily="'Barlow',Arial,sans-serif">{s.n}</text>
          <text x={bx + 56} y="688" fontSize="10" fontWeight="700" fill={NAVY}
            fontFamily="'Barlow',Arial,sans-serif">{s.title}</text>
          {s.items.map((t, j) => (
            <text key={j} x={bx + 14} y={706 + j * 18} fontSize="8.5" fill="#374151"
              fontFamily="'Barlow',Arial,sans-serif">✓  {t}</text>
          ))}
          {i < 3 && (
            <polygon points={`${bx+298},714 ${bx+312},714 ${bx+312},704 ${bx+326},718 ${bx+312},732 ${bx+312},722 ${bx+298},722`} fill={GOLD}/>
          )}
        </g>
      );
    })}

    {/* Connector Row 1 → Row 2 */}
    <path d="M 573 776 L 573 806" stroke={GOLD} strokeWidth="2.5" fill="none"/>
    <polygon points="573,818 561,803 585,803" fill={GOLD}/>

    {/* Row 2: Steps 5, 6 */}
    {([
      { n: '5', title: 'TASK ORCHESTRATION', items: ['52 tasks across 5 teams created', 'Jira, Asana, Smartsheet, ServiceNow', 'Dependencies visible, timeline set'] },
      { n: '6', title: 'COMMUNICATIONS',     items: ['Slack messages sent to every team', 'Stakeholder briefings drafted & sent', 'Execution underway — no kickoff needed'] },
    ] as { n: string; title: string; items: string[] }[]).map((s, i) => {
      const bx = 428 + i * 362;
      return (
        <g key={s.n}>
          <rect x={bx} y="828" width="290" height="124" rx="6" fill={OFF} stroke={TEAL} strokeWidth="2"/>
          <circle cx={bx + 32} cy={859} r="18" fill={TEAL}/>
          <text x={bx + 32} y="865" textAnchor="middle" fontSize="13" fontWeight="700" fill={WHITE}
            fontFamily="'Barlow',Arial,sans-serif">{s.n}</text>
          <text x={bx + 56} y="864" fontSize="10" fontWeight="700" fill={NAVY}
            fontFamily="'Barlow',Arial,sans-serif">{s.title}</text>
          {s.items.map((t, j) => (
            <text key={j} x={bx + 14} y={882 + j * 18} fontSize="8.5" fill="#374151"
              fontFamily="'Barlow',Arial,sans-serif">✓  {t}</text>
          ))}
          {i === 0 && (
            <polygon points="726,890 740,890 740,880 754,894 740,908 740,898 726,898" fill={GOLD}/>
          )}
        </g>
      );
    })}

    {/* Authorization Gate — replaces old EXECUTION LIVE box */}
    <rect x="1152" y="828" width="386" height="124" rx="6" fill="url(#fsNavy)"/>
    <rect x="1152" y="828" width="386" height="4" fill={GOLD}/>
    {/* Arrow step 6 → auth */}
    <polygon points="1144,890 1158,890 1158,880 1172,894 1158,908 1158,898 1144,898" fill={GOLD}/>
    <text x="1345" y="860" textAnchor="middle" fontSize="10" fontWeight="800" letterSpacing="2.5" fill={GOLD}
      fontFamily="'Barlow',Arial,sans-serif">EXECUTIVE AUTHORIZATION</text>
    <line x1="1170" y1="868" x2="1520" y2="868" stroke="rgba(201,168,76,0.3)" strokeWidth="1"/>
    <text x="1345" y="886" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.85)"
      fontFamily="'Barlow',Arial,sans-serif">Full context. Pre-staged options.</text>
    <text x="1345" y="904" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.85)"
      fontFamily="'Barlow',Arial,sans-serif">Human decision preserved.</text>
    <text x="1345" y="922" textAnchor="middle" fontSize="9" fill={GOLD}
      fontFamily="'Barlow',Arial,sans-serif">AI monitors · Executives authorize</text>

    {/* Arrow ↓ to Execution Live */}
    <path d="M 800 952 L 800 970" stroke={TEAL} strokeWidth="4" fill="none"/>
    <polygon points="800,983 787,968 813,968" fill={TEAL}/>

    {/* ══════════════════════════════════════════════
        EXECUTION LIVE BANNER
        y=986 – 1042
    ══════════════════════════════════════════════ */}
    <rect x="50" y="986" width="1500" height="54" rx="6" fill="url(#fsTeal)"/>
    <text x="800" y="1020" textAnchor="middle" fontSize="20" fontWeight="700" fill={WHITE}
      fontFamily="'Barlow',Arial,sans-serif">✓  EXECUTION LIVE — Teams Already Moving. Strategy Deployed End-to-End.</text>

    {/* Arrow ↓ */}
    <path d="M 800 1040 L 800 1058" stroke={TEAL} strokeWidth="3" fill="none"/>
    <polygon points="800,1071 787,1056 813,1056" fill={TEAL}/>

    {/* ══════════════════════════════════════════════
        SECTION 4 — SYSTEMS + AUDIENCE
        y=1074 – 1376
    ══════════════════════════════════════════════ */}
    <rect x="50" y="1074" width="1500" height="300" rx="8" fill={WHITE} filter="url(#fsShadow)"/>
    <text x="800" y="1108" textAnchor="middle" fontSize="16" fontWeight="700" fill={NAVY}
      fontFamily="'Barlow',Arial,sans-serif">DELIVERED INTO YOUR EXISTING SYSTEMS</text>
    <text x="800" y="1128" textAnchor="middle" fontSize="11" fill={TEAL}
      fontFamily="'Barlow',Arial,sans-serif">No replacement. No new tools. Just orchestration across what you already have.</text>
    <line x1="300" y1="1140" x2="1300" y2="1140" stroke={BORDER} strokeWidth="1.5"/>

    {/* Tool cards */}
    {([
      { x: 66,   emoji: '💬', name: 'Slack',      l1: 'Live execution alerts',   l2: 'Team notifications' },
      { x: 252,  emoji: '📋', name: 'Jira',       l1: 'Issue tracking',          l2: 'Dev workflow' },
      { x: 438,  emoji: '✅', name: 'Asana',      l1: 'Task management',         l2: 'Project tracking' },
      { x: 624,  emoji: '📊', name: 'Smartsheet', l1: 'Timeline visibility',     l2: 'Resource planning' },
      { x: 810,  emoji: '🔧', name: 'ServiceNow', l1: 'Change management',       l2: 'Incident response' },
      { x: 996,  emoji: '📧', name: 'Email',      l1: 'Stakeholder briefings',   l2: 'Executive comms' },
      { x: 1182, emoji: '📝', name: 'Confluence', l1: 'Documentation',           l2: 'Runbooks' },
      { x: 1368, emoji: '💼', name: 'Salesforce', l1: 'Account alerts',          l2: 'Customer updates' },
    ] as { x: number; emoji: string; name: string; l1: string; l2: string }[]).map(({ x, emoji, name, l1, l2 }) => (
      <g key={name}>
        <rect x={x} y="1148" width="170" height="88" rx="5" fill={OFF} stroke={TEAL} strokeWidth="1.5"/>
        <text x={x + 85} y="1175" textAnchor="middle" fontSize="22">{emoji}</text>
        <text x={x + 85} y="1196" textAnchor="middle" fontSize="9.5" fontWeight="700" fill={NAVY}
          fontFamily="'Barlow',Arial,sans-serif">{name}</text>
        <text x={x + 85} y="1212" textAnchor="middle" fontSize="8" fill={TEAL}
          fontFamily="'Barlow',Arial,sans-serif">{l1}</text>
        <text x={x + 85} y="1225" textAnchor="middle" fontSize="8" fill={TEAL}
          fontFamily="'Barlow',Arial,sans-serif">{l2}</text>
      </g>
    ))}

    {/* Audience cards */}
    {([
      { x: 56,   label: 'WHAT YOUR TEAMS SEE',      lines: ["Tasks appear in their normal workflow — not a new system", "Slack: \"You own X. Here's your context and deadline.\"", 'Clear accountability from the moment execution goes live', 'No confusion, no coordination latency'] },
      { x: 572,  label: 'WHAT YOUR MANAGERS SEE',   lines: ['Real-time progress across all active Readiness Protocols', 'Escalation alerts before problems surface', 'Trade-off decisions surfaced with full context', 'No status meetings required'] },
      { x: 1088, label: 'WHAT YOUR EXECUTIVES SEE', lines: ['Decision → live execution status in real-time', 'Strategy preserved through every organizational layer', 'Outcomes tracked against original intent', 'Pattern recognition for future decision-making'] },
    ] as { x: number; label: string; lines: string[] }[]).map(({ x, label, lines }) => (
      <g key={label}>
        <rect x={x} y="1252" width="482" height="110" rx="6" fill={OFF} stroke={NAVY} strokeWidth="1.5"/>
        <text x={x + 241} y="1274" textAnchor="middle" fontSize="9.5" fontWeight="700" fill={NAVY}
          fontFamily="'Barlow',Arial,sans-serif">{label}</text>
        <line x1={x + 14} y1="1282" x2={x + 468} y2="1282" stroke={BORDER} strokeWidth="1"/>
        {lines.map((l, i) => (
          <text key={i} x={x + 18} y={1301 + i * 18} fontSize="8.5" fill="#374151"
            fontFamily="'Barlow',Arial,sans-serif">•  {l}</text>
        ))}
      </g>
    ))}

    {/* ══════════════════════════════════════════════
        COMPRESSION SUMMARY BAR
        y=1386 – 1456
    ══════════════════════════════════════════════ */}
    <rect x="52" y="1386" width="1496" height="68" rx="6" fill={OFF}/>
    <text x="800" y="1414" textAnchor="middle" fontSize="12" fontWeight="700" fill={NAVY}
      fontFamily="'Barlow',Arial,sans-serif">
      THE COMPRESSION: What traditional enterprises spend 30 days trying to plan (and months to execute)...
    </text>
    <text x="800" y="1440" textAnchor="middle" fontSize="16" fontWeight="700" fill={TEAL}
      fontFamily="'Cormorant Garamond',Georgia,serif">
      Readiness OS delivers in 12 minutes — from trigger to live organizational execution
    </text>

    {/* Arrow ↓ */}
    <path d="M 800 1454 L 800 1474" stroke={TEAL} strokeWidth="3.5" fill="none"/>
    <polygon points="800,1487 787,1472 813,1472" fill={TEAL}/>

    {/* ══════════════════════════════════════════════
        SECTION 5 — ADVANCE 2.0
        y=1490 – 1642
    ══════════════════════════════════════════════ */}
    <rect x="50" y="1490" width="1500" height="152" rx="8" fill="url(#fsNavy)" filter="url(#fsShadow)"/>
    <rect x="50" y="1490" width="1500" height="4" fill={GOLD}/>
    <text x="800" y="1520" textAnchor="middle" fontSize="10" fontWeight="800" letterSpacing="3.5" fill={GOLD}
      fontFamily="'Barlow',Arial,sans-serif">ADVANCE 2.0 — CONTINUOUS LEARNING LOOP</text>
    <text x="800" y="1538" textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.68)"
      fontFamily="'Barlow',Arial,sans-serif">
      Every activation makes the next response faster. Every cycle builds institutional memory that compounds over time.
    </text>

    {/* 3 Advance cards */}
    {([
      { x: 70,   num: '01', title: 'Every Activation Scored',           b1: 'Outcomes classified. Elapsed time logged.', b2: 'Response quality measured against intent.' },
      { x: 570,  num: '02', title: 'Causal Hypotheses Proven',           b1: 'Expected −4 min → confirmed after next run.', b2: 'System learns what actually makes you faster.' },
      { x: 1070, num: '03', title: 'Protocols Updated Automatically',    b1: 'Proven improvements applied to the library.', b2: '180 protocols evolve with every real activation.' },
    ] as { x: number; num: string; title: string; b1: string; b2: string }[]).map(({ x, num, title, b1, b2 }) => (
      <g key={num}>
        <rect x={x} y="1550" width="476" height="80" rx="6"
          fill="rgba(255,255,255,0.06)" stroke="rgba(201,168,76,0.35)" strokeWidth="1.5"/>
        <text x={x + 16} y="1572" fontSize="9" fontWeight="700" fill={GOLD} letterSpacing="3"
          fontFamily="'Barlow',Arial,sans-serif">{num}</text>
        <text x={x + 40} y="1572" fontSize="11" fontWeight="700" fill={WHITE}
          fontFamily="'Barlow',Arial,sans-serif">{title}</text>
        <text x={x + 16} y="1591" fontSize="9" fill="rgba(255,255,255,0.65)"
          fontFamily="'Barlow',Arial,sans-serif">{b1}</text>
        <text x={x + 16} y="1607" fontSize="9" fill="rgba(255,255,255,0.65)"
          fontFamily="'Barlow',Arial,sans-serif">{b2}</text>
      </g>
    ))}

    {/* ══════════════════════════════════════════════
        FOOTER
    ══════════════════════════════════════════════ */}
    <rect x="0" y="1642" width="1600" height="60" fill={NAVY}/>
    <line x1="0" y1="1642" x2="1600" y2="1642" stroke={GOLD} strokeWidth="2"/>
    <text x="800" y="1668" textAnchor="middle" fontSize="15" fontStyle="italic" fill={GOLD}
      fontFamily="'Cormorant Garamond',Georgia,serif">
      "Strategy is executed by systems, not executives."
    </text>
    <text x="800" y="1690" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.75)"
      fontFamily="'Barlow',Arial,sans-serif">
      Readiness OS is that system — embedded in yours.
    </text>
  </svg>
);

export default ReadinessOSFullStoryDiagram;
export { ReadinessOSFullStoryDiagram };
