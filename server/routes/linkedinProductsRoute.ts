import type { Express } from "express";
import { chromium } from "playwright-core";

const CHROMIUM = process.env.REPLIT_PLAYWRIGHT_CHROMIUM_EXECUTABLE ||
  "/nix/store/kcvsxrmgwp3ffz5jijyy7wn9fcsjl4hz-playwright-browsers-1.55.0-with-cjk/chromium-1187/chrome-linux/chrome";

// ─── Product definitions ──────────────────────────────────────────────────────
export interface LinkedInProduct {
  id: number;
  name: string;
  tagline: string;
  accentColor: string;
  iconSvg: string;
}

export const LINKEDIN_PRODUCTS: LinkedInProduct[] = [
  {
    id: 1,
    name: "Readiness OS Platform",
    tagline: "The operating model startup to Fortune 500 enterprises need to act in 12 minutes",
    accentColor: "#C9A84C",
    iconSvg: `<svg viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="40" r="36" stroke="#C9A84C" stroke-width="2"/>
      <circle cx="40" cy="40" r="24" stroke="rgba(201,168,76,0.4)" stroke-width="1.5"/>
      <circle cx="40" cy="40" r="10" fill="rgba(201,168,76,0.12)" stroke="#C9A84C" stroke-width="1.5"/>
      <path d="M40 10 A30 30 0 0 1 70 40" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/>
      <path d="M70 40 A30 30 0 0 1 40 70" stroke="rgba(201,168,76,0.4)" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M40 70 A30 30 0 0 1 10 40" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/>
      <path d="M10 40 A30 30 0 0 1 40 10" stroke="rgba(201,168,76,0.4)" stroke-width="1.5" stroke-linecap="round"/>
      <text x="40" y="44" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-size="9" font-weight="900" fill="#C9A84C" letter-spacing="1">OS</text>
    </svg>`,
  },
  {
    id: 2,
    name: "IDEA Framework™",
    tagline: "Identify · Detect · Execute · Advance — the 4-phase execution chain",
    accentColor: "#2B8A6E",
    iconSvg: `<svg viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="12" r="9" fill="rgba(201,168,76,0.1)" stroke="#C9A84C" stroke-width="1.5"/>
      <circle cx="68" cy="40" r="9" fill="rgba(43,138,110,0.1)" stroke="#2B8A6E" stroke-width="1.5"/>
      <circle cx="40" cy="68" r="9" fill="rgba(201,168,76,0.1)" stroke="#C9A84C" stroke-width="1.5"/>
      <circle cx="12" cy="40" r="9" fill="rgba(43,138,110,0.1)" stroke="#2B8A6E" stroke-width="1.5"/>
      <circle cx="40" cy="40" r="14" fill="rgba(201,168,76,0.08)" stroke="rgba(201,168,76,0.5)" stroke-width="1.5"/>
      <path d="M40 21 A22 22 0 0 1 59 40" stroke="#C9A84C" stroke-width="1.5" stroke-dasharray="3 3"/>
      <path d="M59 40 A22 22 0 0 1 40 59" stroke="#2B8A6E" stroke-width="1.5" stroke-dasharray="3 3"/>
      <path d="M40 59 A22 22 0 0 1 21 40" stroke="#C9A84C" stroke-width="1.5" stroke-dasharray="3 3"/>
      <path d="M21 40 A22 22 0 0 1 40 21" stroke="#2B8A6E" stroke-width="1.5" stroke-dasharray="3 3"/>
      <text x="40" y="43" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-size="8" font-weight="800" fill="#C9A84C" letter-spacing="0.5">IDEA</text>
      <text x="40" y="9" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-size="6" font-weight="700" fill="#C9A84C">I</text>
      <text x="68" y="43" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-size="6" font-weight="700" fill="#2B8A6E">D</text>
      <text x="40" y="72" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-size="6" font-weight="700" fill="#C9A84C">E</text>
      <text x="12" y="43" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-size="6" font-weight="700" fill="#2B8A6E">A</text>
    </svg>`,
  },
  {
    id: 3,
    name: "12-Minute Execution",
    tagline: "30 days of mobilization compressed to 12 minutes",
    accentColor: "#C9A84C",
    iconSvg: `<svg viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="42" r="28" stroke="#C9A84C" stroke-width="2"/>
      <circle cx="40" cy="42" r="2.5" fill="#C9A84C"/>
      <line x1="40" y1="42" x2="40" y2="22" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/>
      <line x1="40" y1="42" x2="52" y2="36" stroke="rgba(201,168,76,0.6)" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M30 12 L40 8 L50 12" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M52 24 L58 20" stroke="rgba(201,168,76,0.4)" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M28 24 L22 20" stroke="rgba(201,168,76,0.4)" stroke-width="1.5" stroke-linecap="round"/>
      <text x="40" y="60" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-size="8" font-weight="700" fill="rgba(201,168,76,0.5)" letter-spacing="0.5">12 MIN</text>
    </svg>`,
  },
  {
    id: 4,
    name: "Protocol Library",
    tagline: "180 pre-staged Readiness Protocols across 3 strategic domains",
    accentColor: "#C9A84C",
    iconSvg: `<svg viewBox="0 0 80 80" fill="none">
      <rect x="10" y="14" width="60" height="10" rx="2" fill="rgba(201,168,76,0.12)" stroke="#C9A84C" stroke-width="1.5"/>
      <rect x="10" y="30" width="60" height="10" rx="2" fill="rgba(201,168,76,0.08)" stroke="rgba(201,168,76,0.6)" stroke-width="1.5"/>
      <rect x="10" y="46" width="60" height="10" rx="2" fill="rgba(43,138,110,0.08)" stroke="#2B8A6E" stroke-width="1.5"/>
      <rect x="10" y="62" width="60" height="10" rx="2" fill="rgba(201,168,76,0.06)" stroke="rgba(201,168,76,0.4)" stroke-width="1"/>
      <text x="40" y="21" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-size="6.5" font-weight="700" fill="#C9A84C" letter-spacing="0.5">GROWTH &amp; POSITIONING</text>
      <text x="40" y="37" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-size="6.5" font-weight="700" fill="rgba(201,168,76,0.7)" letter-spacing="0.5">RISK &amp; RESILIENCE</text>
      <text x="40" y="53" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-size="6.5" font-weight="700" fill="#2B8A6E" letter-spacing="0.5">TRANSFORMATION</text>
      <text x="40" y="69" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-size="6" font-weight="600" fill="rgba(201,168,76,0.4)" letter-spacing="0.5">12 COMPOUND PROTOCOLS</text>
    </svg>`,
  },
  {
    id: 5,
    name: "Command Tower",
    tagline: "Full-screen executive readiness display — live, continuous, board-ready",
    accentColor: "#2B8A6E",
    iconSvg: `<svg viewBox="0 0 80 80" fill="none">
      <rect x="28" y="52" width="24" height="20" rx="1" stroke="#C9A84C" stroke-width="1.5"/>
      <rect x="18" y="36" width="44" height="18" rx="1" stroke="#C9A84C" stroke-width="1.5"/>
      <rect x="22" y="20" width="36" height="18" rx="1" fill="rgba(201,168,76,0.06)" stroke="#2B8A6E" stroke-width="1.5"/>
      <rect x="28" y="8" width="24" height="14" rx="1" fill="rgba(201,168,76,0.1)" stroke="#C9A84C" stroke-width="2"/>
      <line x1="40" y1="8" x2="40" y2="4" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round"/>
      <circle cx="40" cy="3" r="2" fill="#C9A84C"/>
      <path d="M26 44 L32 40 L36 43 L42 38 L46 41 L52 36" stroke="#2B8A6E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
  },
  {
    id: 6,
    name: "Signal Detection Engine",
    tagline: "231 strategic situations monitored in real time across 8 data sources",
    accentColor: "#2B8A6E",
    iconSvg: `<svg viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="40" r="6" fill="#C9A84C"/>
      <circle cx="40" cy="40" r="14" stroke="rgba(43,138,110,0.5)" stroke-width="1.5" stroke-dasharray="2 3"/>
      <circle cx="40" cy="40" r="22" stroke="rgba(43,138,110,0.35)" stroke-width="1.5" stroke-dasharray="2 4"/>
      <circle cx="40" cy="40" r="30" stroke="rgba(43,138,110,0.2)" stroke-width="1.5" stroke-dasharray="2 5"/>
      <circle cx="40" cy="18" r="3" fill="#2B8A6E"/>
      <circle cx="62" cy="40" r="3" fill="#C9A84C"/>
      <circle cx="40" cy="62" r="3" fill="#2B8A6E"/>
      <circle cx="18" cy="40" r="3" fill="rgba(201,168,76,0.6)"/>
      <circle cx="58" cy="22" r="2.5" fill="rgba(43,138,110,0.7)"/>
      <circle cx="20" cy="22" r="2.5" fill="rgba(201,168,76,0.4)"/>
      <line x1="40" y1="40" x2="55" y2="25" stroke="rgba(201,168,76,0.4)" stroke-width="1" stroke-dasharray="2 2"/>
    </svg>`,
  },
  {
    id: 7,
    name: "War Room",
    tagline: "Pre-staged live activation — tasks assigned, stakeholders notified, executive authorized",
    accentColor: "#C9A84C",
    iconSvg: `<svg viewBox="0 0 80 80" fill="none">
      <rect x="8" y="8" width="64" height="40" rx="2" stroke="#C9A84C" stroke-width="1.5"/>
      <line x1="8" y1="22" x2="72" y2="22" stroke="rgba(201,168,76,0.3)" stroke-width="1"/>
      <line x1="40" y1="8" x2="40" y2="48" stroke="rgba(201,168,76,0.3)" stroke-width="1"/>
      <rect x="13" y="13" width="12" height="6" rx="1" fill="rgba(43,138,110,0.2)" stroke="#2B8A6E" stroke-width="1"/>
      <rect x="29" y="13" width="8" height="6" rx="1" fill="rgba(201,168,76,0.15)" stroke="#C9A84C" stroke-width="1"/>
      <rect x="13" y="26" width="20" height="5" rx="1" fill="rgba(201,168,76,0.08)" stroke="rgba(201,168,76,0.4)" stroke-width="1"/>
      <rect x="13" y="34" width="14" height="5" rx="1" fill="rgba(43,138,110,0.08)" stroke="rgba(43,138,110,0.4)" stroke-width="1"/>
      <rect x="45" y="26" width="20" height="5" rx="1" fill="rgba(201,168,76,0.12)" stroke="rgba(201,168,76,0.5)" stroke-width="1"/>
      <rect x="45" y="34" width="14" height="5" rx="1" fill="rgba(43,138,110,0.1)" stroke="rgba(43,138,110,0.4)" stroke-width="1"/>
      <path d="M20 56 L30 52 L40 56 L50 52 L60 56" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M20 64 L30 60 L40 64 L50 60 L60 64" stroke="rgba(201,168,76,0.4)" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
  },
  {
    id: 8,
    name: "ROI Dashboard",
    tagline: "Measure the financial return on organizational readiness",
    accentColor: "#C9A84C",
    iconSvg: `<svg viewBox="0 0 80 80" fill="none">
      <line x1="10" y1="70" x2="10" y2="10" stroke="rgba(201,168,76,0.3)" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="10" y1="70" x2="74" y2="70" stroke="rgba(201,168,76,0.3)" stroke-width="1.5" stroke-linecap="round"/>
      <rect x="16" y="50" width="10" height="20" rx="1" fill="rgba(201,168,76,0.15)" stroke="rgba(201,168,76,0.5)" stroke-width="1"/>
      <rect x="30" y="38" width="10" height="32" rx="1" fill="rgba(201,168,76,0.2)" stroke="#C9A84C" stroke-width="1"/>
      <rect x="44" y="26" width="10" height="44" rx="1" fill="rgba(201,168,76,0.3)" stroke="#C9A84C" stroke-width="1.5"/>
      <rect x="58" y="14" width="10" height="56" rx="1" fill="rgba(201,168,76,0.45)" stroke="#C9A84C" stroke-width="1.5"/>
      <path d="M21 48 L35 36 L49 24 L63 12" stroke="#2B8A6E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="21" cy="48" r="2.5" fill="#2B8A6E"/>
      <circle cx="35" cy="36" r="2.5" fill="#2B8A6E"/>
      <circle cx="49" cy="24" r="2.5" fill="#2B8A6E"/>
      <circle cx="63" cy="12" r="2.5" fill="#2B8A6E"/>
    </svg>`,
  },
  {
    id: 9,
    name: "Founding Partner Program",
    tagline: "90-day validation partnership — first startup to Fortune 500 cohort forming now",
    accentColor: "#C9A84C",
    iconSvg: `<svg viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="40" r="32" stroke="rgba(201,168,76,0.2)" stroke-width="1" stroke-dasharray="3 3"/>
      <polygon points="40,10 46,28 66,28 50,40 56,58 40,46 24,58 30,40 14,28 34,28" fill="rgba(201,168,76,0.1)" stroke="#C9A84C" stroke-width="1.5" stroke-linejoin="round"/>
      <circle cx="40" cy="40" r="8" fill="rgba(201,168,76,0.15)" stroke="#C9A84C" stroke-width="1.5"/>
      <text x="40" y="43" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-size="6" font-weight="800" fill="#C9A84C">FP</text>
    </svg>`,
  },
  {
    id: 10,
    name: "Executive Brief",
    tagline: "The one-page board-ready case for Readiness OS",
    accentColor: "#C9A84C",
    iconSvg: `<svg viewBox="0 0 80 80" fill="none">
      <rect x="14" y="8" width="44" height="58" rx="2" fill="rgba(201,168,76,0.06)" stroke="#C9A84C" stroke-width="1.5"/>
      <rect x="14" y="8" width="44" height="10" rx="2" fill="rgba(201,168,76,0.15)" stroke="#C9A84C" stroke-width="1.5"/>
      <line x1="22" y1="26" x2="50" y2="26" stroke="rgba(201,168,76,0.5)" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="22" y1="33" x2="50" y2="33" stroke="rgba(201,168,76,0.3)" stroke-width="1" stroke-linecap="round"/>
      <line x1="22" y1="40" x2="42" y2="40" stroke="rgba(201,168,76,0.3)" stroke-width="1" stroke-linecap="round"/>
      <rect x="22" y="47" width="28" height="5" rx="1" fill="rgba(43,138,110,0.12)" stroke="#2B8A6E" stroke-width="1"/>
      <rect x="22" y="55" width="22" height="5" rx="1" fill="rgba(201,168,76,0.1)" stroke="rgba(201,168,76,0.4)" stroke-width="1"/>
      <path d="M56 60 L70 60 M63 53 L70 60 L63 67" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
  },
];

// ─── Product icon HTML builder (600 × 600 px) — scenario-driven cards ─────────
function buildProductIconHtml(product: LinkedInProduct): string {
  const ac = product.accentColor;
  const isEven = product.id % 2 === 0;
  const bg = isEven ? "#091333" : "#080D24";
  const num = String(product.id).padStart(2, "0");

  // ── Per-card scenario panels (product shown IN ACTION, not as icon) ──────────
  const scenarios: Record<number, string> = {
    1: `
      <div class="flow">
        <div class="flow-row"><div class="flow-dot gold">●</div><div class="flow-content"><div class="flow-label">DETECT</div><div class="flow-val">Signal threshold crossed · Score 94 · Activist Investor</div></div><div class="flow-time">T+0:00</div></div>
        <div class="flow-line"></div>
        <div class="flow-row"><div class="flow-dot gold">●</div><div class="flow-content"><div class="flow-label">IDENTIFY</div><div class="flow-val">Protocol #47 matched · 28 tasks staged · 8 stakeholders</div></div><div class="flow-time">T+0:04</div></div>
        <div class="flow-line"></div>
        <div class="flow-row"><div class="flow-dot teal">●</div><div class="flow-content"><div class="flow-label">AUTHORIZE</div><div class="flow-val">Executive sign-off requested · One-click activation ready</div></div><div class="flow-time">T+0:09</div></div>
        <div class="flow-line"></div>
        <div class="flow-row teal-row"><div class="flow-dot teal">●</div><div class="flow-content"><div class="flow-label">EXECUTE</div><div class="flow-val">Response live · Legal, IR, Board, Counsel — all notified</div></div><div class="flow-time teal-t">T+12:00</div></div>
      </div>
      <div class="hero-strip">
        <div class="hero-num">3,600×</div>
        <div class="hero-lbl">Execution Head Start vs. the old model</div>
      </div>`,

    2: `
      <div class="idea-chain">
        <div class="idea-phase gold-phase"><div class="phase-letter">I</div><div class="phase-content"><div class="phase-name">IDENTIFY</div><div class="phase-desc">231 strategic situations mapped across 3 domains</div></div></div>
        <div class="idea-phase gold-phase"><div class="phase-letter">D</div><div class="phase-content"><div class="phase-name">DETECT</div><div class="phase-desc">248+ data points · signal scored every 15 minutes</div></div></div>
        <div class="idea-phase teal-phase"><div class="phase-letter">E</div><div class="phase-content"><div class="phase-name">EXECUTE</div><div class="phase-desc">Pre-staged protocols activate · executive authorized</div></div></div>
        <div class="idea-phase teal-phase"><div class="phase-letter">A</div><div class="phase-content"><div class="phase-name">ADVANCE</div><div class="phase-desc">Post-activation debrief · readiness improves each cycle</div></div></div>
      </div>`,

    3: `
      <div class="timer-panel">
        <div class="timer-hero">12:00</div>
        <div class="timer-label">Response complete</div>
        <div class="timer-bar-wrap"><div class="timer-bar"></div></div>
      </div>
      <div class="exec-log">
        <div class="log-row"><span class="log-time">9:47 AM</span><span class="log-evt">Trigger detected · Protocol #47 identified</span></div>
        <div class="log-row"><span class="log-time">9:49 AM</span><span class="log-evt">Stakeholder map loaded · Documents staged</span></div>
        <div class="log-row"><span class="log-time">9:54 AM</span><span class="log-evt">Executive authorization received</span></div>
        <div class="log-row teal-row"><span class="log-time">9:59 AM</span><span class="log-evt">Response live · Legal, IR, Board notified</span></div>
      </div>`,

    4: `
      <div class="proto-stack">
        <div class="proto-card gold-card"><div class="proto-left"><div class="proto-domain">GROWTH &amp; POSITIONING</div><div class="proto-meta">58 Protocols · Pre-staged</div></div><div class="proto-badge gold-badge">READY</div></div>
        <div class="proto-card"><div class="proto-left"><div class="proto-domain">RISK &amp; RESILIENCE</div><div class="proto-meta">74 Protocols · Pre-staged</div></div><div class="proto-badge gold-badge">READY</div></div>
        <div class="proto-card teal-card"><div class="proto-left"><div class="proto-domain">TRANSFORMATION</div><div class="proto-meta">38 Protocols · Pre-staged</div></div><div class="proto-badge teal-badge">READY</div></div>
        <div class="proto-footer">+12 COMPOUND PROTOCOLS · CROSS-DOMAIN ACTIVATION</div>
      </div>`,

    5: `
      <div class="alert-feed">
        <div class="feed-header">LIVE SIGNAL DETECTIONS · NOW</div>
        <div class="alert-row critical"><div class="sev-dot red-dot"></div><div class="alert-info"><div class="alert-name">Activist Investor Disclosure</div><div class="alert-sub">8.3% stake · Protocol #47 matched</div></div><div class="score-block"><div class="score-num">97</div><div class="score-bar"><div class="score-fill red-fill" style="width:97%"></div></div></div></div>
        <div class="alert-row high"><div class="sev-dot amber-dot"></div><div class="alert-info"><div class="alert-name">Supply Chain Disruption</div><div class="alert-sub">Tier-1 supplier · Protocol #83 matched</div></div><div class="score-block"><div class="score-num">78</div><div class="score-bar"><div class="score-fill amber-fill" style="width:78%"></div></div></div></div>
        <div class="alert-row med"><div class="sev-dot teal-dot"></div><div class="alert-info"><div class="alert-name">Regulatory Filing Deadline</div><div class="alert-sub">SEC · 14 days · Protocol #129 recommended</div></div><div class="score-block"><div class="score-num">52</div><div class="score-bar"><div class="score-fill teal-fill" style="width:52%"></div></div></div></div>
        <div class="feed-footer">231 detection thresholds monitored · 248+ data points · Continuous</div>
      </div>`,

    6: `
      <div class="scan-panel">
        <div class="scan-header">CONTINUOUS PATTERN SCORING · LIVE</div>
        <div class="scan-rows">
          <div class="scan-row"><div class="pulse-dot"></div><div class="scan-src">SEC &amp; Regulatory Filings</div><div class="scan-status">SCANNING</div></div>
          <div class="scan-row"><div class="pulse-dot"></div><div class="scan-src">Market Intelligence</div><div class="scan-status">SCANNING</div></div>
          <div class="scan-row"><div class="pulse-dot"></div><div class="scan-src">News &amp; Media Intelligence</div><div class="scan-status">SCANNING</div></div>
          <div class="scan-row"><div class="pulse-dot"></div><div class="scan-src">Financial Signal Sources</div><div class="scan-status">SCANNING</div></div>
        </div>
        <div class="scan-meta">
          <div class="meta-stat"><span class="meta-num">248+</span><span class="meta-lbl"> data points</span></div>
          <div class="meta-div">·</div>
          <div class="meta-stat"><span class="meta-num">15 min</span><span class="meta-lbl"> cycle</span></div>
          <div class="meta-div">·</div>
          <div class="meta-stat"><span class="meta-num">231</span><span class="meta-lbl"> patterns</span></div>
        </div>
      </div>`,

    7: `
      <div class="war-room">
        <div class="wr-header"><div class="wr-proto">PROTOCOL #47 ACTIVE · Activist Investor Response</div><div class="wr-status">AUTHORIZED</div></div>
        <div class="task-grid">
          <div class="task-row"><div class="task-name">CFO Brief</div><div class="task-status complete">COMPLETE</div></div>
          <div class="task-row"><div class="task-name">Board Alert</div><div class="task-status complete">COMPLETE</div></div>
          <div class="task-row"><div class="task-name">Legal Counsel</div><div class="task-status active">ACTIVE</div></div>
          <div class="task-row"><div class="task-name">IR Statement</div><div class="task-status active">ACTIVE</div></div>
          <div class="task-row"><div class="task-name">External PR</div><div class="task-status staged">STAGED</div></div>
          <div class="task-row"><div class="task-name">SEC Response</div><div class="task-status staged">STAGED</div></div>
        </div>
        <div class="wr-footer">28 tasks · 8 stakeholders · Response complete at T+12:00</div>
      </div>`,

    8: `
      <div class="roi-panel">
        <div class="roi-hero"><div class="roi-num">3,600×</div><div class="roi-lbl">Execution Head Start</div></div>
        <div class="roi-rule"></div>
        <div class="roi-stats">
          <div class="roi-stat"><div class="rs-val">30 days</div><div class="rs-lbl">Old model mobilization</div></div>
          <div class="roi-arrow">→</div>
          <div class="roi-stat"><div class="rs-val teal-v">12 min</div><div class="rs-lbl">Readiness OS execution</div></div>
        </div>
        <div class="roi-bars">
          <div class="bar-row"><div class="bar-lbl">Year 1 ROI</div><div class="bar-wrap"><div class="bar-fill gold-fill" style="width:85%"></div></div><div class="bar-val">847%</div></div>
          <div class="bar-row"><div class="bar-lbl">3-Year Net Value</div><div class="bar-wrap"><div class="bar-fill teal-fill-b" style="width:72%"></div></div><div class="bar-val teal-v">$7.2M</div></div>
        </div>
      </div>`,

    9: `
      <div class="fp-panel">
        <div class="fp-badge">FOUNDING PARTNER PROGRAM</div>
        <div class="fp-headline">First startup to Fortune 500 Cohort<br/>Forming Now</div>
        <div class="fp-rule"></div>
        <div class="fp-points">
          <div class="fp-pt"><span class="fp-check">✓</span> 90-day structured validation partnership</div>
          <div class="fp-pt"><span class="fp-check">✓</span> Direct founder access throughout</div>
          <div class="fp-pt"><span class="fp-check">✓</span> Live trigger handled inside Readiness OS</div>
          <div class="fp-pt"><span class="fp-check">✓</span> Documented mobilization compression data</div>
        </div>
        <div class="fp-cta">Apply for Founding Partner Access</div>
      </div>`,

    10: `
      <div class="brief-panel">
        <div class="brief-header">EXECUTIVE BRIEF · BOARD-READY · ONE PAGE</div>
        <div class="brief-hero">"The response is ready<br/>before the trigger fires."</div>
        <div class="brief-stats">
          <div class="bs-row"><span class="bs-key">Mobilization compression</span><span class="bs-val">3,600×</span></div>
          <div class="bs-row"><span class="bs-key">Pre-authorized budget</span><span class="bs-val">$2.4M avg</span></div>
          <div class="bs-row"><span class="bs-key">Readiness Protocols</span><span class="bs-val">180 ready</span></div>
          <div class="bs-row"><span class="bs-key">Founding Partner ROI</span><span class="bs-val">847% Yr 1</span></div>
        </div>
        <div class="brief-cta">vaughnmartin.com/executive-brief</div>
      </div>`,
  };

  const scenario = scenarios[product.id] || scenarios[1];

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,600&family=Barlow+Condensed:wght@400;600;700;800;900&display=swap" rel="stylesheet"/>
<style>
  *{margin:0;padding:0;box-sizing:border-box;}
  html,body{width:600px;height:600px;overflow:hidden;font-family:'Barlow Condensed',sans-serif;}
  .card{width:600px;height:600px;background:linear-gradient(150deg,${bg} 0%,#0D1C4A 100%);position:relative;overflow:hidden;display:flex;flex-direction:column;}
  .grid{position:absolute;inset:0;background-image:linear-gradient(rgba(201,168,76,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,.035) 1px,transparent 1px);background-size:40px 40px;}
  .topbar{position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,${ac},rgba(201,168,76,.15));}
  .glow{position:absolute;top:-80px;right:-80px;width:320px;height:320px;border-radius:50%;background:radial-gradient(circle,rgba(201,168,76,.06) 0%,transparent 65%);}
  /* Header */
  .hdr{position:relative;z-index:2;display:flex;align-items:center;justify-content:space-between;padding:16px 22px 12px;border-bottom:1px solid rgba(201,168,76,.1);}
  .hdr-left{display:flex;align-items:center;gap:7px;}
  .hdr-num{font-size:10px;font-weight:800;letter-spacing:.3em;color:rgba(201,168,76,.55);}
  .hdr-sep{font-size:10px;color:rgba(255,255,255,.15);}
  .hdr-name{font-size:10px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.4);}
  .live-pill{display:flex;align-items:center;gap:5px;background:rgba(43,138,110,.12);border:1px solid rgba(43,138,110,.3);padding:3px 9px;}
  .live-dot{width:5px;height:5px;border-radius:50%;background:#2B8A6E;}
  .live-txt{font-size:8px;font-weight:800;letter-spacing:.2em;color:#2B8A6E;}
  /* Scenario */
  .scenario{position:relative;z-index:2;flex:1;padding:14px 22px;display:flex;flex-direction:column;gap:9px;overflow:hidden;}
  /* FLOW (Card 1) */
  .flow{display:flex;flex-direction:column;gap:0;}
  .flow-row{display:flex;align-items:flex-start;gap:9px;padding:6px 0;}
  .flow-dot{font-size:9px;line-height:1.5;flex-shrink:0;width:13px;text-align:center;}
  .flow-dot.gold{color:#C9A84C;} .flow-dot.teal{color:#2B8A6E;}
  .flow-content{flex:1;}
  .flow-label{font-size:8.5px;font-weight:800;letter-spacing:.28em;color:rgba(201,168,76,.7);margin-bottom:1px;}
  .flow-val{font-size:10.5px;font-weight:500;color:rgba(255,255,255,.55);letter-spacing:.02em;}
  .flow-time{font-size:8.5px;font-weight:700;letter-spacing:.08em;color:rgba(201,168,76,.4);flex-shrink:0;}
  .flow-line{width:1px;height:7px;background:rgba(201,168,76,.18);margin-left:5px;}
  .teal-row .flow-label{color:rgba(43,138,110,.9);} .teal-row .flow-val{color:rgba(61,187,151,.75);}
  .teal-t{color:#2B8A6E!important;}
  .hero-strip{background:rgba(201,168,76,.06);border:1px solid rgba(201,168,76,.18);padding:8px 14px;display:flex;align-items:center;gap:12px;}
  .hero-num{font-size:26px;font-weight:900;color:#C9A84C;letter-spacing:-.01em;line-height:1;}
  .hero-lbl{font-size:9.5px;font-weight:600;color:rgba(255,255,255,.4);letter-spacing:.1em;text-transform:uppercase;line-height:1.35;}
  /* IDEA (Card 2) */
  .idea-chain{display:flex;flex-direction:column;gap:7px;}
  .idea-phase{display:flex;align-items:center;gap:11px;padding:9px 12px;border-left:3px solid transparent;}
  .gold-phase{border-left-color:rgba(201,168,76,.6);background:rgba(201,168,76,.04);}
  .teal-phase{border-left-color:rgba(43,138,110,.6);background:rgba(43,138,110,.04);}
  .phase-letter{font-size:20px;font-weight:900;color:#C9A84C;width:24px;flex-shrink:0;}
  .teal-phase .phase-letter{color:#2B8A6E;}
  .phase-name{font-size:9.5px;font-weight:800;letter-spacing:.22em;color:rgba(255,255,255,.8);margin-bottom:2px;}
  .phase-desc{font-size:9.5px;font-weight:500;color:rgba(255,255,255,.42);letter-spacing:.02em;}
  /* TIMER (Card 3) */
  .timer-panel{text-align:center;padding:4px 0 8px;}
  .timer-hero{font-size:54px;font-weight:900;color:#C9A84C;letter-spacing:-.02em;line-height:1;}
  .timer-label{font-size:8.5px;font-weight:800;letter-spacing:.35em;color:rgba(43,138,110,.8);text-transform:uppercase;margin-top:2px;}
  .timer-bar-wrap{height:2px;background:rgba(201,168,76,.15);margin:8px 24px 0;}
  .timer-bar{width:100%;height:100%;background:linear-gradient(to right,#C9A84C,#2B8A6E);}
  .exec-log{display:flex;flex-direction:column;gap:5px;}
  .log-row{display:flex;align-items:center;gap:9px;padding:5px 9px;background:rgba(255,255,255,.03);border-left:2px solid rgba(201,168,76,.15);}
  .log-row.teal-row{border-left-color:rgba(43,138,110,.5);background:rgba(43,138,110,.05);}
  .log-time{font-size:8.5px;font-weight:800;letter-spacing:.08em;color:rgba(201,168,76,.6);width:48px;flex-shrink:0;}
  .log-evt{font-size:10px;font-weight:500;color:rgba(255,255,255,.52);}
  .teal-row .log-time{color:#2B8A6E;} .teal-row .log-evt{color:rgba(43,138,110,.9);}
  /* PROTOCOL LIBRARY (Card 4) */
  .proto-stack{display:flex;flex-direction:column;gap:8px;}
  .proto-card{padding:9px 13px;border:1px solid rgba(201,168,76,.1);background:rgba(201,168,76,.03);display:flex;align-items:center;justify-content:space-between;}
  .gold-card{border-color:rgba(201,168,76,.28);background:rgba(201,168,76,.06);}
  .teal-card{border-color:rgba(43,138,110,.28);background:rgba(43,138,110,.05);}
  .proto-domain{font-size:11px;font-weight:800;letter-spacing:.1em;color:rgba(255,255,255,.85);}
  .proto-meta{font-size:8.5px;font-weight:600;color:rgba(255,255,255,.32);letter-spacing:.05em;margin-top:1px;}
  .proto-badge{font-size:7.5px;font-weight:900;letter-spacing:.2em;padding:3px 8px;border:1px solid;flex-shrink:0;}
  .gold-badge{color:#C9A84C;border-color:rgba(201,168,76,.4);}
  .teal-badge{color:#2B8A6E;border-color:rgba(43,138,110,.4);}
  .proto-footer{font-size:8.5px;font-weight:700;letter-spacing:.14em;color:rgba(201,168,76,.32);text-align:center;padding:6px 0 0;border-top:1px solid rgba(201,168,76,.08);}
  /* ALERT FEED (Card 5) */
  .alert-feed{display:flex;flex-direction:column;gap:7px;}
  .feed-header{font-size:8.5px;font-weight:800;letter-spacing:.22em;color:rgba(201,168,76,.5);padding-bottom:6px;border-bottom:1px solid rgba(201,168,76,.1);}
  .alert-row{display:flex;align-items:center;gap:9px;padding:8px 10px;border:1px solid rgba(201,168,76,.07);}
  .alert-row.critical{border-color:rgba(220,60,50,.25);background:rgba(220,60,50,.04);}
  .alert-row.high{border-color:rgba(201,168,76,.2);background:rgba(201,168,76,.04);}
  .alert-row.med{border-color:rgba(43,138,110,.2);background:rgba(43,138,110,.03);}
  .sev-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;}
  .red-dot{background:#DC3C32;} .amber-dot{background:#C9A84C;} .teal-dot{background:#2B8A6E;}
  .alert-info{flex:1;}
  .alert-name{font-size:10.5px;font-weight:700;color:rgba(255,255,255,.85);letter-spacing:.02em;}
  .alert-sub{font-size:8.5px;font-weight:500;color:rgba(255,255,255,.32);margin-top:1px;}
  .score-block{display:flex;flex-direction:column;align-items:flex-end;gap:3px;flex-shrink:0;}
  .score-num{font-size:12px;font-weight:900;color:#C9A84C;line-height:1;}
  .score-bar{width:44px;height:3px;background:rgba(255,255,255,.07);overflow:hidden;}
  .score-fill{height:100%;}
  .red-fill{background:#DC3C32;} .amber-fill{background:#C9A84C;} .teal-fill{background:#2B8A6E;}
  .feed-footer{font-size:8px;font-weight:700;letter-spacing:.14em;color:rgba(201,168,76,.28);text-align:center;padding-top:3px;}
  /* SIGNAL DETECTION (Card 6) */
  .scan-panel{display:flex;flex-direction:column;gap:9px;}
  .scan-header{font-size:8.5px;font-weight:800;letter-spacing:.22em;color:rgba(43,138,110,.7);padding-bottom:7px;border-bottom:1px solid rgba(43,138,110,.14);}
  .scan-rows{display:flex;flex-direction:column;gap:6px;}
  .scan-row{display:flex;align-items:center;gap:10px;padding:8px 12px;border:1px solid rgba(43,138,110,.1);background:rgba(43,138,110,.03);}
  .pulse-dot{width:7px;height:7px;border-radius:50%;background:#2B8A6E;flex-shrink:0;box-shadow:0 0 6px rgba(43,138,110,.5);}
  .scan-src{flex:1;font-size:11px;font-weight:600;color:rgba(255,255,255,.62);letter-spacing:.03em;}
  .scan-status{font-size:8px;font-weight:800;letter-spacing:.18em;color:rgba(43,138,110,.7);}
  .scan-meta{display:flex;align-items:center;gap:8px;padding:8px 12px;border:1px solid rgba(201,168,76,.1);background:rgba(201,168,76,.04);}
  .meta-stat{display:flex;align-items:baseline;gap:2px;}
  .meta-num{font-size:14px;font-weight:900;color:#C9A84C;}
  .meta-lbl{font-size:8.5px;font-weight:600;color:rgba(255,255,255,.32);letter-spacing:.04em;}
  .meta-div{color:rgba(255,255,255,.14);font-size:11px;}
  /* WAR ROOM (Card 7) */
  .war-room{display:flex;flex-direction:column;gap:8px;}
  .wr-header{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:4px;}
  .wr-proto{font-size:8.5px;font-weight:800;letter-spacing:.15em;color:rgba(201,168,76,.6);}
  .wr-status{font-size:7.5px;font-weight:900;letter-spacing:.18em;color:#2B8A6E;background:rgba(43,138,110,.12);border:1px solid rgba(43,138,110,.35);padding:3px 8px;}
  .task-grid{display:grid;grid-template-columns:1fr 1fr;gap:5px;}
  .task-row{display:flex;align-items:center;justify-content:space-between;padding:6px 9px;background:rgba(255,255,255,.03);border:1px solid rgba(201,168,76,.07);}
  .task-name{font-size:10px;font-weight:600;color:rgba(255,255,255,.62);letter-spacing:.02em;}
  .task-status{font-size:7px;font-weight:900;letter-spacing:.14em;padding:2px 5px;}
  .task-status.complete{color:#2B8A6E;background:rgba(43,138,110,.1);border:1px solid rgba(43,138,110,.28);}
  .task-status.active{color:#C9A84C;background:rgba(201,168,76,.08);border:1px solid rgba(201,168,76,.28);}
  .task-status.staged{color:rgba(255,255,255,.3);background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);}
  .wr-footer{font-size:8.5px;font-weight:700;letter-spacing:.1em;color:rgba(43,138,110,.58);text-align:center;padding:4px;border-top:1px solid rgba(43,138,110,.12);}
  /* ROI (Card 8) */
  .roi-panel{display:flex;flex-direction:column;gap:10px;}
  .roi-hero{text-align:center;padding:2px 0 6px;}
  .roi-num{font-size:56px;font-weight:900;color:#C9A84C;letter-spacing:-.02em;line-height:1;}
  .roi-lbl{font-size:8.5px;font-weight:700;letter-spacing:.28em;color:rgba(255,255,255,.38);text-transform:uppercase;margin-top:2px;}
  .roi-rule{height:1px;background:linear-gradient(to right,transparent,rgba(201,168,76,.28),transparent);}
  .roi-stats{display:flex;align-items:center;justify-content:center;gap:10px;padding:3px 0;}
  .roi-stat{text-align:center;}
  .rs-val{font-size:15px;font-weight:800;color:rgba(255,255,255,.55);}
  .rs-val.teal-v{color:#2B8A6E;} .bar-val.teal-v{color:#2B8A6E;}
  .rs-lbl{font-size:8px;font-weight:600;letter-spacing:.08em;color:rgba(255,255,255,.28);margin-top:1px;}
  .roi-arrow{font-size:16px;color:rgba(201,168,76,.38);}
  .roi-bars{display:flex;flex-direction:column;gap:7px;}
  .bar-row{display:flex;align-items:center;gap:9px;}
  .bar-lbl{font-size:8.5px;font-weight:600;color:rgba(255,255,255,.38);letter-spacing:.04em;width:86px;flex-shrink:0;}
  .bar-wrap{flex:1;height:4px;background:rgba(255,255,255,.06);}
  .bar-fill{height:100%;}
  .gold-fill{background:#C9A84C;} .teal-fill-b{background:#2B8A6E;}
  .bar-val{font-size:10px;font-weight:800;color:#C9A84C;width:34px;text-align:right;flex-shrink:0;}
  /* FOUNDING PARTNER (Card 9) */
  .fp-panel{display:flex;flex-direction:column;gap:9px;}
  .fp-badge{font-size:8.5px;font-weight:900;letter-spacing:.28em;color:#C9A84C;padding:5px 10px;border:1px solid rgba(201,168,76,.35);background:rgba(201,168,76,.07);text-align:center;}
  .fp-headline{font-family:'Cormorant Garamond',Georgia,serif;font-size:19px;font-weight:600;font-style:italic;color:rgba(255,255,255,.9);line-height:1.2;text-align:center;}
  .fp-rule{height:1px;background:linear-gradient(to right,transparent,rgba(201,168,76,.28),transparent);}
  .fp-points{display:flex;flex-direction:column;gap:5px;}
  .fp-pt{font-size:10.5px;font-weight:500;color:rgba(255,255,255,.55);letter-spacing:.02em;display:flex;align-items:center;gap:7px;}
  .fp-check{color:#2B8A6E;font-weight:900;}
  .fp-cta{font-size:9.5px;font-weight:800;letter-spacing:.1em;color:#0A0F2E;background:#C9A84C;text-align:center;padding:9px 14px;text-transform:uppercase;}
  /* EXECUTIVE BRIEF (Card 10) */
  .brief-panel{display:flex;flex-direction:column;gap:9px;}
  .brief-header{font-size:8.5px;font-weight:800;letter-spacing:.28em;color:rgba(201,168,76,.52);padding-bottom:6px;border-bottom:1px solid rgba(201,168,76,.1);}
  .brief-hero{font-family:'Cormorant Garamond',Georgia,serif;font-size:17px;font-weight:600;font-style:italic;color:rgba(255,255,255,.9);line-height:1.3;}
  .brief-stats{display:flex;flex-direction:column;gap:5px;}
  .bs-row{display:flex;align-items:center;justify-content:space-between;padding:5px 9px;border-bottom:1px solid rgba(201,168,76,.06);}
  .bs-key{font-size:9.5px;font-weight:500;color:rgba(255,255,255,.42);letter-spacing:.02em;}
  .bs-val{font-size:10.5px;font-weight:800;color:#C9A84C;letter-spacing:.04em;}
  .brief-cta{font-size:8.5px;font-weight:700;letter-spacing:.08em;color:rgba(43,138,110,.65);padding-top:3px;border-top:1px solid rgba(43,138,110,.12);}
  /* Tagline strip */
  .tagline-strip{position:relative;z-index:2;padding:8px 22px;border-top:1px solid rgba(201,168,76,.08);}
  .tagline{font-family:'Cormorant Garamond',Georgia,serif;font-size:12.5px;font-style:italic;font-weight:600;color:rgba(240,237,228,.42);line-height:1.35;}
  /* Brand strip */
  .bottom{position:relative;z-index:2;height:52px;display:flex;align-items:center;justify-content:space-between;padding:0 22px;background:rgba(0,0,0,.22);border-top:1px solid rgba(201,168,76,.09);}
  .brand-left{display:flex;align-items:center;gap:9px;}
  .seal{width:26px;height:26px;}
  .bname{font-size:12px;font-weight:700;letter-spacing:.1em;color:#ffffff;}
  .bprod{font-size:8px;font-weight:600;letter-spacing:.26em;color:#C9A84C;text-transform:uppercase;margin-top:1px;}
  .prod-tag{font-size:8.5px;font-weight:800;letter-spacing:.16em;color:rgba(201,168,76,.28);text-transform:uppercase;}
</style>
</head>
<body>
<div class="card">
  <div class="grid"></div>
  <div class="topbar"></div>
  <div class="glow"></div>

  <div class="hdr">
    <div class="hdr-left">
      <div class="hdr-num">PRODUCT ${num}</div>
      <div class="hdr-sep">·</div>
      <div class="hdr-name">READINESS OS</div>
    </div>
    <div class="live-pill"><div class="live-dot"></div><div class="live-txt">LIVE</div></div>
  </div>

  <div class="scenario">${scenario}</div>

  <div class="tagline-strip">
    <div class="tagline">${product.tagline}</div>
  </div>

  <div class="bottom">
    <div class="brand-left">
      <svg class="seal" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="12.5" stroke="#C9A84C" stroke-width="1"/>
        <circle cx="14" cy="14" r="9" stroke="rgba(201,168,76,.28)" stroke-width=".75"/>
        <text x="14" y="17.5" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-size="7" font-weight="800" fill="#C9A84C">VM</text>
      </svg>
      <div>
        <div class="bname">VaughnMartin</div>
        <div class="bprod">Readiness OS</div>
      </div>
    </div>
    <div class="prod-tag">LI PRODUCT ${num}</div>
  </div>
</div>
</body>
</html>`;
}

// ─── Route ────────────────────────────────────────────────────────────────────
export function registerLinkedInProductsRoute(app: Express): void {
  /**
   * GET /api/linkedin-product-icon.png?pid=1   (1–10)
   * Returns a 600×600 product card PNG for uploading to LinkedIn Products tab.
   */
  app.get("/api/linkedin-product-icon.png", async (req: any, res) => {
    const pid = parseInt((req.query.pid as string) || "1", 10);
    const product = LINKEDIN_PRODUCTS.find(p => p.id === pid);
    if (!product) {
      return res.status(400).json({ error: `pid must be 1–${LINKEDIN_PRODUCTS.length}` });
    }

    let browser;
    try {
      browser = await chromium.launch({
        executablePath: CHROMIUM,
        args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
      });
      const page = await browser.newPage();
      await page.setViewportSize({ width: 600, height: 600 });
      await page.emulateMedia({ colorScheme: "dark" });
      await page.setContent(buildProductIconHtml(product), { waitUntil: "networkidle" });
      await page.waitForTimeout(1500);

      const buffer = await page.screenshot({
        type: "png",
        clip: { x: 0, y: 0, width: 600, height: 600 },
      });

      const filename = `VaughnMartin-LinkedIn-Product-${String(product.id).padStart(2,"0")}-${product.name.replace(/[^a-zA-Z0-9]/g,"-")}.png`;
      res.setHeader("Content-Type", "image/png");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.setHeader("Cache-Control", "public, max-age=300");
      res.send(buffer);
    } catch (err: any) {
      console.error("[LinkedInProducts] Screenshot failed:", err?.message);
      res.status(500).json({ error: "Image generation failed", detail: err?.message });
    } finally {
      if (browser) await browser.close();
    }
  });

  /**
   * GET /api/linkedin-product-copy.json
   * Returns all 10 product listings as structured JSON (name, description, highlights, cta).
   */
  app.get("/api/linkedin-product-copy.json", (_req, res) => {
    res.json(LINKEDIN_PRODUCTS_COPY);
  });
}

// ─── Full copy for all 10 LinkedIn Product listings ──────────────────────────
export const LINKEDIN_PRODUCTS_COPY = [
  {
    id: 1,
    name: "Readiness OS Platform",
    tagline: "The operating model layer above the startup to Fortune 500's AI stack",
    description: "Readiness OS is the coordination infrastructure startup to Fortune 500 enterprises use to replace 30-day mobilization cycles with 12-minute execution. 180 pre-staged Readiness Protocols activate the moment a strategic trigger fires — with executive authority preserved at every step. The response is ready before the trigger fires.",
    highlights: [
      {
        title: "3,600× Execution Head Start",
        description: "30 days of mobilization compressed to 12 minutes. Pre-staged protocols activate the moment a trigger is detected — no committee, no coordination delay.",
      },
      {
        title: "Executive Authority Preserved",
        description: "AI monitors, executives authorize. No Readiness Protocol activates without sign-off. Preparation compresses the cycle; the decision remains human.",
      },
      {
        title: "Microsoft AI Orchestrator",
        description: "Every startup to Fortune 500 has invested in Microsoft's AI stack. Readiness OS is the operating model layer above it — not a replacement, the orchestrator.",
      },
    ],
    cta: { label: "Request Founding Partner Access", url: "https://vaughnmartin.com/founding-partner-program" },
  },
  {
    id: 2,
    name: "IDEA Framework™",
    tagline: "Identify · Detect · Execute · Advance — proprietary 4-phase execution chain",
    description: "The IDEA Framework is VaughnMartin's proprietary execution chain that powers every Readiness Protocol. Identify strategic triggers → Detect signal patterns → Execute pre-staged responses → Advance organizational readiness. Built for enterprises that can't afford to assemble a response after the trigger fires.",
    highlights: [
      {
        title: "Identify & Detect",
        description: "231 strategic situations mapped and monitored across Growth & Positioning, Risk & Resilience, and Transformation domains. Real-time scoring before any executive is notified.",
      },
      {
        title: "Execute",
        description: "Pre-staged protocols activate through an authorized execution chain. Tasks assigned, stakeholders notified, documents staged — before the trigger fires.",
      },
      {
        title: "Advance",
        description: "Each activation deepens organizational readiness. Post-activation debriefs classify outcomes and feed forward to improve the next response.",
      },
    ],
    cta: { label: "See How It Executes", url: "https://vaughnmartin.com/how-it-executes" },
  },
  {
    id: 3,
    name: "12-Minute Execution",
    tagline: "30 days of mobilization. 12 minutes of execution.",
    description: "The 12-Minute Execution capability is the core of Readiness OS. When a strategic situation is detected, a pre-staged Readiness Protocol activates, tasks are assigned, stakeholders are notified, and the executive authorization chain begins — all within 12 minutes. The old model took 30 days just to mobilize.",
    highlights: [
      {
        title: "Pre-Staged Before the Trigger Fires",
        description: "Every response is prepared in advance. The moment a trigger is detected, the protocol is already designed, assigned, and waiting for authorization.",
      },
      {
        title: "12-Minute Test Drive",
        description: "Experience the full cycle in a live simulation: 7 scenarios across all three strategic domains, including compound multi-protocol activations.",
      },
      {
        title: "3,600× Head Start vs. the Old Model",
        description: "30-day mobilization cycles vs. 12-minute execution. In a startup to Fortune 500, that gap is the difference between controlling a narrative and reacting to one.",
      },
    ],
    cta: { label: "Start the 12-Minute Test Drive", url: "https://vaughnmartin.com/12-minute-experience" },
  },
  {
    id: 4,
    name: "Protocol Library",
    tagline: "180 pre-staged Readiness Protocols across 3 strategic domains",
    description: "180 cross-industry Readiness Protocols organized across Growth & Positioning, Risk & Resilience, and Transformation. Each protocol includes pre-staged tasks, stakeholder assignments, budget allocations, and document staging — fully ready to activate the moment a trigger fires. Plus 12 compound protocols for multi-domain threats.",
    highlights: [
      {
        title: "Three Strategic Domains",
        description: "Growth & Positioning (formerly Offense), Risk & Resilience (formerly Defense), and Transformation — covering the full enterprise threat and opportunity landscape.",
      },
      {
        title: "12 Compound Protocols",
        description: "Multi-domain protocols that activate two simultaneous response tracks for complex threats requiring coordinated cross-functional execution.",
      },
      {
        title: "6 Industry Protocol Packs",
        description: "Sector-specific packs layered on top of the 180 core protocols for Healthcare, Financial Services, Manufacturing, Retail, Energy, and Technology.",
      },
    ],
    cta: { label: "Explore the Protocol Library", url: "https://vaughnmartin.com/playbook-library" },
  },
  {
    id: 5,
    name: "Command Tower",
    tagline: "Full-screen executive readiness display — live, continuous, board-ready",
    description: "A real-time, full-screen executive display showing live trigger detections, system readiness scores, signal confidence feeds, and activation status. Designed for the executive floor, the Command Tower makes organizational readiness visible and continuous — not just post-incident.",
    highlights: [
      {
        title: "Live Signal Feed",
        description: "Real-time display of detected signals, confidence scores, trigger classifications, and recommended Readiness Protocols — updated every 15 minutes.",
      },
      {
        title: "Executive Readiness Score",
        description: "A 0–100 score derived from live signals, active protocols, and activation history. Continuously updated. Board-ready at any moment.",
      },
      {
        title: "War Room Pulse Map",
        description: "Visual map of stakeholder readiness and task completion across all active activations — one screen, total situational awareness.",
      },
    ],
    cta: { label: "Request Executive Access", url: "https://vaughnmartin.com/request-access" },
  },
  {
    id: 6,
    name: "Signal Detection Engine",
    tagline: "231 detection thresholds monitored in real time — before they become crises",
    description: "VaughnMartin's Signal Detection Engine continuously monitors 231 detection thresholds across 8 real-time data sources. Incoming signals are scored against keyword density, confidence thresholds, and detection alignment. When a signal qualifies, executives are notified in minutes — not weeks.",
    highlights: [
      {
        title: "231 Detection Thresholds",
        description: "Mapped across geopolitical, cybersecurity, market valuation, regulatory, reputational, and financial distress domains. Continuously monitored.",
      },
      {
        title: "Confidence Scoring",
        description: "Signals are scored against pattern matching, keyword density, and temporal proximity. Quality gates prevent alert fatigue — only high-signal detections reach executives.",
      },
      {
        title: "4-Hour Deduplication",
        description: "Intelligent deduplication windows prevent repeat notifications on the same trigger, preserving executive attention for genuine strategic events.",
      },
    ],
    cta: { label: "See Live Signal Activity", url: "https://vaughnmartin.com/command-tower" },
  },
  {
    id: 7,
    name: "War Room",
    tagline: "Pre-staged live activation — tasks assigned, stakeholders ready, executive authorizes",
    description: "When a Readiness Protocol activates, the War Room becomes the command center. Pre-staged tasks, real-time stakeholder status, executive authorization gate, and post-activation debrief — all in one coordinated execution environment designed to compress decision cycles from weeks to minutes.",
    highlights: [
      {
        title: "Pre-Staged Task Execution",
        description: "Every task in the protocol is pre-defined, pre-assigned, and ready at activation. No coordination overhead. No 'who's responsible?' delays.",
      },
      {
        title: "Executive Authorization Gate",
        description: "No action proceeds without sign-off. Executive authority is preserved at every step. Preparation compresses the cycle; the decision remains human.",
      },
      {
        title: "Post-Activation Intelligence",
        description: "Automated debrief classifies each activation (Optimization, Mixed-Signal, or Recovery) and feeds insights forward to improve future readiness.",
      },
    ],
    cta: { label: "See a Live Activation", url: "https://vaughnmartin.com/demo-hub" },
  },
  {
    id: 8,
    name: "ROI Dashboard",
    tagline: "Measure the financial return on organizational readiness",
    description: "The Readiness ROI Dashboard quantifies the value of pre-staged execution: consulting costs avoided, response time compression, activation outcomes, and projected value across the protocol portfolio. See the business case in your numbers — not ours. Includes break-even analysis, 3-year net value projection, and consulting retainer comparison.",
    highlights: [
      {
        title: "Break-Even Analysis",
        description: "Compare platform cost ($60K–$240K) against consulting retainer rates and incident response costs. See exactly when Readiness OS pays for itself.",
      },
      {
        title: "3-Year Net Value Projection",
        description: "Projects cumulative value delivered across the full Readiness Protocol portfolio, using your actual trigger frequency and response cost baselines.",
      },
      {
        title: "Outcome Classification",
        description: "Each activation is classified (Optimization vs. Recovery) and its financial impact tracked. The dashboard builds the board case automatically.",
      },
    ],
    cta: { label: "Calculate Your ROI", url: "https://vaughnmartin.com/roi-calculator" },
  },
  {
    id: 9,
    name: "Founding Partner Program",
    tagline: "90-day validation partnership — first startup to Fortune 500 cohort forming now",
    description: "The Founding Partner Program is VaughnMartin's selective pre-launch partnership for startup to Fortune 500 enterprises ready to validate Readiness OS against their actual strategic landscape. A 90-day structured engagement with dedicated implementation support, direct roadmap influence, and Founding Partner pricing.",
    highlights: [
      {
        title: "Selective by Design",
        description: "startup to Fortune 500 enterprises only. Each partner is assessed for strategic fit, trigger landscape alignment, and readiness infrastructure compatibility.",
      },
      {
        title: "90-Day Validation",
        description: "Full platform implementation against your actual triggers, protocols, and execution chains — not a sandbox. Real organizational readiness, measured.",
      },
      {
        title: "Roadmap Influence",
        description: "Founding Partners shape the direction of future protocol development, industry packs, Microsoft integration priorities, and product evolution.",
      },
    ],
    cta: { label: "Apply for Founding Partner Access", url: "https://vaughnmartin.com/founding-partner-program" },
  },
  {
    id: 10,
    name: "Executive Brief",
    tagline: "The one-page board-ready case for Readiness OS",
    description: "A printable, board-ready one-pager covering the Readiness OS value proposition, the 3,600× comparison table, ROI case, proof numbers, and Founding Partner CTA. Designed for board presentations, vendor evaluations, executive conversations, and procurement review. Share it. Print it. Present it.",
    highlights: [
      {
        title: "3,600× Comparison Table",
        description: "Side-by-side view of Readiness OS vs. the old mobilization model across 6 key dimensions — mobilization time, protocol readiness, signal detection, budget staging, and more.",
      },
      {
        title: "Board-Ready ROI Case",
        description: "First-year ROI, break-even timeline, 3-year net value, and consulting retainer comparison — in one printable view that passes the CFO and board bar.",
      },
      {
        title: "Founding Partner CTA",
        description: "Closes with clear next steps and the Founding Partner Program application — designed to move executives from awareness to conversation.",
      },
    ],
    cta: { label: "View the Executive Brief", url: "https://vaughnmartin.com/executive-brief" },
  },
];
