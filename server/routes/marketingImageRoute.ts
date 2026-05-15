import type { Express } from "express";
import { chromium } from "playwright-core";

const CHROMIUM = process.env.REPLIT_PLAYWRIGHT_CHROMIUM_EXECUTABLE ||
  "/nix/store/kcvsxrmgwp3ffz5jijyy7wn9fcsjl4hz-playwright-browsers-1.55.0-with-cjk/chromium-1187/chrome-linux/chrome";

// ─── Format presets ──────────────────────────────────────────────────────────
// cardWidth: CSS px width of the card in the HTML
// scale: Playwright deviceScaleFactor (multiplies output resolution)
// Result pixel width ≈ cardWidth × scale
//
//   web              480 × 1×  →  ~480 × ~1100 px   (quick web preview)
//   hd               800 × 2×  →  ~1600 × ~2200 px  (website / email)
//   linkedin         600 × 2×  →  ~1200 × ~628 px   (landscape share — fixed height)
//   linkedin-banner  792 × 2×  →  1584 × 396 px     (LinkedIn company page banner — exact spec)
//   portrait         540 × 2×  →  ~1080 × ~1350 px  (LinkedIn / Instagram portrait)
//   letter           850 × 3×  →  ~2550 × ~3300 px  (8.5″ × 11″ @ 300 dpi)
//   a4               827 × 3×  →  ~2480 × ~3508 px  (A4 @ 300 dpi)

type Format = "web" | "hd" | "linkedin" | "linkedin-banner" | "portrait" | "letter" | "a4";

interface Preset {
  cardWidth: number;
  scale: number;
  label: string;
  /** Constrain screenshot to exact pixel height */
  clipHeight?: number;
  /** Use the LinkedIn banner HTML builder instead of the infographic builder */
  isBanner?: boolean;
}

const PRESETS: Record<Format, Preset> = {
  web:              { cardWidth: 480,  scale: 1, label: "Web (480px)"                              },
  hd:               { cardWidth: 800,  scale: 2, label: "HD Web (1600px)"                          },
  linkedin:         { cardWidth: 600,  scale: 2, label: "LinkedIn Share (1200×628)",   clipHeight: 314 },
  "linkedin-banner":{ cardWidth: 1584, scale: 1, label: "LinkedIn Banner (1584×396)",  clipHeight: 396, isBanner: true },
  portrait:         { cardWidth: 540,  scale: 2, label: "LinkedIn/Instagram (1080×1350)"            },
  letter:           { cardWidth: 850,  scale: 3, label: "Print Letter 8.5×11 @ 300 dpi"            },
  a4:               { cardWidth: 827,  scale: 3, label: "Print A4 @ 300 dpi"                       },
};

// ─── HTML template ────────────────────────────────────────────────────────────
function buildHtml(cardWidth: number): string {
  // All font sizes / spacing are relative to a 480-base.
  // We scale them proportionally so the design looks identical at any width.
  const s = cardWidth / 480;
  const px = (n: number) => `${Math.round(n * s)}px`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Barlow+Condensed:wght@300;400;500;600;700;800;900&family=Barlow:wght@300;400;500;600&display=swap" rel="stylesheet"/>
<style>
  :root {
    --navy:   #080d24;
    --gold:   #C9A84C;
    --gold2:  #e2c068;
    --teal:   #4dc4a0;
    --w:      #ffffff;
    --w80:    rgba(255,255,255,0.80);
    --w55:    rgba(255,255,255,0.55);
    --bd:     rgba(201,168,76,0.22);
    --cbg:    rgba(255,255,255,0.04);
  }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { background:#04070f; font-family:'Barlow',sans-serif; width:${cardWidth}px; margin:0 auto; }

  .header { display:flex; justify-content:space-between; align-items:center; padding:${px(24)} ${px(28)} ${px(20)}; border-bottom:1px solid var(--bd); }
  .logo-group { display:flex; align-items:center; gap:${px(10)}; }
  .logo-mark { width:${px(38)}; height:${px(38)}; border:${px(1.5)} solid var(--gold); border-radius:50%; display:flex; align-items:center; justify-content:center; }
  .logo-mark span { font-family:'Barlow Condensed',sans-serif; font-size:${px(11)}; font-weight:800; letter-spacing:.05em; color:var(--gold); }
  .logo-name { font-family:'Barlow Condensed',sans-serif; font-size:${px(13)}; font-weight:700; letter-spacing:.12em; color:var(--w); }
  .logo-product { font-family:'Barlow Condensed',sans-serif; font-size:${px(9)}; font-weight:600; letter-spacing:.35em; color:var(--gold); text-transform:uppercase; margin-top:${px(1)}; display:flex; align-items:center; gap:${px(6)}; }
  .logo-product::before { content:''; display:inline-block; width:${px(18)}; height:1px; background:var(--gold); }
  .header-right { text-align:right; }
  .htag { font-family:'Barlow Condensed',sans-serif; font-size:${px(8)}; font-weight:700; letter-spacing:.3em; text-transform:uppercase; color:var(--w55); line-height:1.9; }
  .htag .accent { color:var(--teal); }

  .hero { padding:${px(44)} ${px(28)} ${px(36)}; border-bottom:1px solid var(--bd); }
  .hero h1 { font-family:'Barlow Condensed',sans-serif; font-size:${px(48)}; font-weight:800; line-height:1.0; color:var(--w); margin-bottom:${px(4)}; letter-spacing:-0.01em; }
  .hero-product { font-family:'Cormorant Garamond',serif; font-size:${px(46)}; font-weight:700; color:var(--gold); line-height:1.05; margin-bottom:${px(20)}; }
  .hero-sub { font-family:'Barlow Condensed',sans-serif; font-size:${px(13)}; font-weight:600; letter-spacing:.06em; color:var(--w); margin-bottom:${px(10)}; text-transform:uppercase; }
  .hero-body { font-size:${px(13)}; font-weight:400; color:var(--w80); line-height:1.65; }

  .metrics { display:grid; grid-template-columns:1fr 1fr 1fr; border-top:1px solid var(--bd); border-bottom:1px solid var(--bd); }
  .metric { padding:${px(22)} ${px(18)}; border-right:1px solid var(--bd); }
  .metric:last-child { border-right:none; }
  .metric-num { font-family:'Barlow Condensed',sans-serif; font-size:${px(40)}; font-weight:900; color:var(--gold); line-height:1; letter-spacing:-0.02em; display:block; margin-bottom:${px(6)}; }
  .metric-title { font-family:'Barlow Condensed',sans-serif; font-size:${px(11)}; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--w); margin-bottom:${px(3)}; }
  .metric-sub { font-size:${px(10)}; font-weight:400; color:var(--w55); line-height:1.4; }

  .section-label { display:flex; align-items:center; gap:${px(12)}; font-family:'Barlow Condensed',sans-serif; font-size:${px(9)}; font-weight:700; letter-spacing:.35em; text-transform:uppercase; color:var(--gold); margin-bottom:${px(18)}; }
  .section-label::before { content:''; display:inline-block; width:${px(28)}; height:${px(1.5)}; background:var(--gold); flex-shrink:0; }

  .problem { padding:${px(36)} ${px(28)}; border-bottom:1px solid var(--bd); }
  .prob-intro { font-size:${px(13)}; font-weight:400; color:var(--w80); line-height:1.65; margin-bottom:${px(4)}; }
  .prob-intro strong { color:var(--w); font-weight:600; }
  .prob-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:${px(8)}; margin:${px(24)} 0 ${px(20)}; }
  .pcard { background:var(--cbg); border:1px solid rgba(255,255,255,0.09); padding:${px(16)} ${px(12)}; text-align:center; }
  .pcard-icon { width:${px(28)}; height:${px(28)}; margin:0 auto ${px(10)}; display:block; }
  .pcard-title { font-family:'Barlow Condensed',sans-serif; font-size:${px(11)}; font-weight:700; letter-spacing:.06em; text-transform:uppercase; color:var(--w); margin-bottom:${px(5)}; line-height:1.3; }
  .pcard-desc { font-size:${px(10)}; font-weight:400; color:var(--w80); line-height:1.5; }
  .band-text { font-family:'Barlow Condensed',sans-serif; font-size:${px(9)}; font-weight:700; letter-spacing:.28em; text-transform:uppercase; color:var(--w55); text-align:center; padding-top:${px(10)}; }

  .solution { padding:${px(36)} ${px(28)}; border-bottom:1px solid var(--bd); display:grid; grid-template-columns:1fr 1fr; gap:${px(28)}; }
  .sol-left-label { font-family:'Barlow Condensed',sans-serif; font-size:${px(9)}; font-weight:700; letter-spacing:.3em; text-transform:uppercase; color:var(--teal); margin-bottom:${px(10)}; }
  .sol-left h2 { font-family:'Cormorant Garamond',serif; font-size:${px(24)}; font-weight:600; line-height:1.25; color:var(--w); margin-bottom:${px(4)}; }
  .sol-left h2 em { color:var(--gold); font-style:italic; }
  .idea-wrap { margin:${px(20)} auto; width:${px(140)}; height:${px(140)}; }
  .sol-checks { list-style:none; margin-top:${px(4)}; }
  .sol-checks li { font-size:${px(11)}; font-weight:400; color:var(--w80); padding:${px(5)} 0; display:flex; align-items:flex-start; gap:${px(8)}; border-bottom:1px solid rgba(255,255,255,0.06); line-height:1.4; }
  .sol-checks li::before { content:'◆'; color:var(--teal); font-size:${px(6)}; flex-shrink:0; margin-top:${px(3)}; }
  .sol-right-label { font-family:'Barlow Condensed',sans-serif; font-size:${px(9)}; font-weight:700; letter-spacing:.3em; text-transform:uppercase; color:var(--w55); margin-bottom:${px(10)}; }
  .sol-right h2 { font-family:'Barlow Condensed',sans-serif; font-size:${px(26)}; font-weight:700; line-height:1.15; color:var(--w); margin-bottom:${px(20)}; }
  .sol-right h2 em { color:var(--gold); font-style:italic; font-family:'Cormorant Garamond',serif; font-size:${px(28)}; }
  .icard { margin-bottom:${px(16)}; padding-bottom:${px(16)}; border-bottom:1px solid rgba(255,255,255,0.07); display:flex; gap:${px(10)}; align-items:flex-start; }
  .icard:last-child { border-bottom:none; margin-bottom:0; padding-bottom:0; }
  .icard-icon { width:${px(22)}; height:${px(22)}; flex-shrink:0; margin-top:${px(1)}; }
  .icard-title { font-family:'Barlow Condensed',sans-serif; font-size:${px(12)}; font-weight:700; letter-spacing:.05em; color:var(--gold); margin-bottom:${px(4)}; text-transform:uppercase; }
  .icard-desc { font-size:${px(11)}; font-weight:400; color:var(--w80); line-height:1.5; }

  .footer-quote { padding:${px(36)} ${px(28)} ${px(24)}; text-align:center; border-top:1px solid var(--bd); }
  .quote-text { font-family:'Cormorant Garamond',serif; font-style:italic; font-size:${px(20)}; font-weight:400; color:var(--w); line-height:1.4; margin-bottom:${px(10)}; }
  .quote-arc { font-family:'Barlow Condensed',sans-serif; font-size:${px(10)}; font-weight:600; letter-spacing:.25em; text-transform:uppercase; color:var(--w55); }

  .footer-bar { display:flex; justify-content:space-between; align-items:center; padding:${px(20)} ${px(28)}; border-top:1px solid var(--bd); background:rgba(0,0,0,0.25); }
  .footer-cta { text-align:right; }
  .footer-cta-top { font-family:'Barlow Condensed',sans-serif; font-size:${px(9)}; font-weight:700; letter-spacing:.28em; text-transform:uppercase; color:var(--gold); }
  .footer-cta-bot { font-family:'Barlow Condensed',sans-serif; font-size:${px(11)}; font-weight:800; letter-spacing:.18em; text-transform:uppercase; color:var(--w); margin-top:${px(2)}; }
</style>
</head>
<body>

<header class="header">
  <div class="logo-group">
    <div class="logo-mark"><span>VM</span></div>
    <div>
      <div class="logo-name">VaughnMartin</div>
      <div class="logo-product">Readiness OS</div>
    </div>
  </div>
  <div class="header-right">
    <div class="htag">A New Category</div>
    <div class="htag">For a New Era</div>
    <div class="htag"><span class="accent">Pre-Staged · Always Ready</span></div>
  </div>
</header>

<section class="hero">
  <h1>Welcome to the<br>category first.</h1>
  <div class="hero-product">Readiness OS™</div>
  <div class="hero-sub">The readiness infrastructure for the Fortune 1000.</div>
  <p class="hero-body">Every vendor bolted AI onto the old model. We replaced the model.<br>Preparation replaces coordination. 12 minutes replaces 30 days.</p>
</section>

<div class="metrics">
  <div class="metric">
    <span class="metric-num">3,600×</span>
    <div class="metric-title">Execution Head Start</div>
    <div class="metric-sub">30 days → 12 minutes</div>
  </div>
  <div class="metric">
    <span class="metric-num">170</span>
    <div class="metric-title">Readiness Protocols</div>
    <div class="metric-sub">Pre-staged, not assembled</div>
  </div>
  <div class="metric">
    <span class="metric-num">221</span>
    <div class="metric-title">Strategic Triggers</div>
    <div class="metric-sub">Continuously monitored</div>
  </div>
</div>

<section class="problem">
  <div class="section-label">The Old Model. Year After Year.</div>
  <p class="prob-intro">Enterprise work was designed for a world without AI — committees, alignment cycles, and coordination delays exist because humans couldn't process information fast enough to act decisively. <strong>AI changed the constraint. The operating model didn't.</strong></p>
  <div class="prob-grid">
    <div class="pcard">
      <svg class="pcard-icon" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="11" stroke="#C9A84C" stroke-width="1.5"/>
        <path d="M14 8v6l4 2" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      <div class="pcard-title">30-Day Mobilization</div>
      <div class="pcard-desc">Before execution even begins</div>
    </div>
    <div class="pcard">
      <svg class="pcard-icon" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="11" stroke="#C9A84C" stroke-width="1.5"/>
        <circle cx="14" cy="14" r="5"  stroke="#C9A84C" stroke-width="1.5"/>
      </svg>
      <div class="pcard-title">Committee Deliberation</div>
      <div class="pcard-desc">Replacing pattern detection</div>
    </div>
    <div class="pcard">
      <svg class="pcard-icon" viewBox="0 0 28 28" fill="none">
        <rect x="6" y="6" width="16" height="16" stroke="#C9A84C" stroke-width="1.5"/>
      </svg>
      <div class="pcard-title">Reactive Posture</div>
      <div class="pcard-desc">Assembling after the trigger fires</div>
    </div>
    <div class="pcard">
      <svg class="pcard-icon" viewBox="0 0 28 28" fill="none">
        <path d="M14 4L24 21H4L14 4z" stroke="#C9A84C" stroke-width="1.5"/>
      </svg>
      <div class="pcard-title">No Decision Rights</div>
      <div class="pcard-desc">Weeks of coordination overhead</div>
    </div>
    <div class="pcard">
      <svg class="pcard-icon" viewBox="0 0 28 28" fill="none">
        <path d="M14 4l10 10-10 10L4 14z" stroke="#C9A84C" stroke-width="1.5"/>
      </svg>
      <div class="pcard-title">No Signal Layer</div>
      <div class="pcard-desc">Blind to strategic triggers</div>
    </div>
    <div class="pcard">
      <svg class="pcard-icon" viewBox="0 0 28 28" fill="none">
        <line x1="14" y1="5"  x2="14" y2="23" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="5"  y1="14" x2="23" y2="14" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      <div class="pcard-title">Execution Delays</div>
      <div class="pcard-desc">30-day response to 12-min triggers</div>
    </div>
  </div>
  <div class="band-text">Weeks to Mobilize &nbsp;·&nbsp; Months to Execute &nbsp;·&nbsp; Strategic Windows Missed</div>
</section>

<section class="solution">
  <div class="sol-left">
    <div class="sol-left-label">One Readiness OS</div>
    <h2>The full readiness cycle.<br><em>Pre-staged. Always ready.</em></h2>
    <div class="idea-wrap">
      <svg viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <circle cx="70" cy="70" r="64" fill="none" stroke="rgba(201,168,76,0.2)" stroke-width="1"/>
        <circle cx="70" cy="70" r="26" fill="rgba(201,168,76,0.07)" stroke="rgba(201,168,76,0.4)" stroke-width="1"/>
        <text x="70" y="66" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-size="10" font-weight="800" fill="#C9A84C" letter-spacing="1">IDEA</text>
        <text x="70" y="78" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-size="7"  font-weight="500" fill="rgba(201,168,76,0.7)" letter-spacing="1">FRAMEWORK</text>
        <circle cx="70" cy="10"  r="14" fill="rgba(201,168,76,0.08)" stroke="rgba(201,168,76,0.5)" stroke-width="1"/>
        <text x="70" y="14"  text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-size="8" font-weight="700" fill="#C9A84C">IDENTIFY</text>
        <circle cx="128" cy="70" r="14" fill="rgba(77,196,160,0.08)" stroke="rgba(77,196,160,0.5)" stroke-width="1"/>
        <text x="128" y="74" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-size="8" font-weight="700" fill="#4dc4a0">DETECT</text>
        <circle cx="70"  cy="130" r="14" fill="rgba(201,168,76,0.08)" stroke="rgba(201,168,76,0.5)" stroke-width="1"/>
        <text x="70"  y="134" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-size="8" font-weight="700" fill="#C9A84C">EXECUTE</text>
        <circle cx="12"  cy="70"  r="14" fill="rgba(77,196,160,0.08)" stroke="rgba(77,196,160,0.5)" stroke-width="1"/>
        <text x="12"  y="74"  text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-size="8" font-weight="700" fill="#4dc4a0">ADVANCE</text>
        <path d="M70 24 A50 50 0 0 1 114 70"  fill="none" stroke="rgba(201,168,76,0.3)" stroke-width="1" stroke-dasharray="3 3"/>
        <path d="M114 70 A50 50 0 0 1 70 116" fill="none" stroke="rgba(77,196,160,0.3)" stroke-width="1" stroke-dasharray="3 3"/>
        <path d="M70 116 A50 50 0 0 1 26 70"  fill="none" stroke="rgba(201,168,76,0.3)" stroke-width="1" stroke-dasharray="3 3"/>
        <path d="M26 70 A50 50 0 0 1 70 24"   fill="none" stroke="rgba(77,196,160,0.3)" stroke-width="1" stroke-dasharray="3 3"/>
      </svg>
    </div>
    <ul class="sol-checks">
      <li>170 Readiness Protocols pre-staged</li>
      <li>221 strategic triggers monitored</li>
      <li>12-minute execution design target</li>
      <li>Executive authority at every stage</li>
      <li>Orchestrates your Microsoft AI stack</li>
      <li>Pre-staged before the trigger fires</li>
    </ul>
  </div>
  <div class="sol-right">
    <div class="sol-right-label">Built for Investors</div>
    <h2>Built for<br><em>the future.</em></h2>
    <div class="icard">
      <svg class="icard-icon" viewBox="0 0 22 22" fill="none"><path d="M11 2l9 9-9 9-9-9z" stroke="#C9A84C" stroke-width="1.5"/></svg>
      <div>
        <div class="icard-title">Category Creation</div>
        <div class="icard-desc">Not competing with Copilot, SAP, or Workday — sits above them as the operating model layer they don't provide.</div>
      </div>
    </div>
    <div class="icard">
      <svg class="icard-icon" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="9" stroke="#C9A84C" stroke-width="1.5"/></svg>
      <div>
        <div class="icard-title">Platform Economics</div>
        <div class="icard-desc">170 core protocols + 6 industry packs + 12 compound protocols. Compounding value with every activation.</div>
      </div>
    </div>
    <div class="icard">
      <svg class="icard-icon" viewBox="0 0 22 22" fill="none"><rect x="2" y="2" width="18" height="18" stroke="#C9A84C" stroke-width="1.5"/></svg>
      <div>
        <div class="icard-title">Microsoft Amplifier</div>
        <div class="icard-desc">Every Fortune 1000 has invested in Microsoft AI. None have the operating model to use it when it counts.</div>
      </div>
    </div>
    <div class="icard">
      <svg class="icard-icon" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="9" stroke="#4dc4a0" stroke-width="1.5"/>
        <circle cx="11" cy="11" r="4" stroke="#4dc4a0" stroke-width="1.5"/>
      </svg>
      <div>
        <div class="icard-title">Founding Partner Program</div>
        <div class="icard-desc">First cohort forming now. Selective by design — validating with Fortune 1000 enterprises only.</div>
      </div>
    </div>
  </div>
</section>

<div class="footer-quote">
  <div class="quote-text">"The response is ready before the trigger fires."</div>
  <div class="quote-arc">Preparation &nbsp;→&nbsp; Readiness &nbsp;→&nbsp; Fearless</div>
</div>

<footer class="footer-bar">
  <div class="logo-group">
    <div class="logo-mark"><span>VM</span></div>
    <div>
      <div class="logo-name">VaughnMartin</div>
      <div class="logo-product">Readiness OS</div>
    </div>
  </div>
  <div class="footer-cta">
    <div class="footer-cta-top">Founding Partner Access</div>
    <div class="footer-cta-bot">Now Forming — Apply Today</div>
  </div>
</footer>

</body>
</html>`;
}

// ─── LinkedIn Company Page Banner (1584 × 396) ───────────────────────────────
// cardWidth=792, scale=2, clipHeight=198  →  exact 1584×396 output
//
// Layout zones (at 792px CSS width):
//   [0–152px]  LOGO SAFE ZONE — LinkedIn profile picture overlaps lower-left;
//              keep this area clear of all critical text/branding
//   [153px]    Gold vertical rule
//   [156–530px] Headline zone — editorial tagline + subtext
//   [531px]    Gold vertical rule
//   [534–720px] Stats zone — 3,600×  /  170  /  221
//   [721px]    Gold vertical rule
//   [724–792px] Brand zone — VM seal + VaughnMartin / READINESS OS
//   [bottom 36px] Strip — Preparation → Readiness → Fearless + vaughnmartin.com
function buildLinkedInBannerHtml(): string {
  // Rendered natively at 1584 × 396 px (cardWidth=1584, scale=1).
  // Left 304 px is deliberately clear — LinkedIn profile photo overlaps here.
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,400;1,600;1,700&family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@400;500&display=swap" rel="stylesheet"/>
<style>
  *{margin:0;padding:0;box-sizing:border-box;}
  html,body{
    width:1584px;height:396px;overflow:hidden;
    background:#080d24;font-family:'Barlow',sans-serif;
    position:relative;
  }
  /* Subtle grid texture */
  .grid{
    position:absolute;inset:0;
    background-image:
      linear-gradient(rgba(201,168,76,0.04) 1px,transparent 1px),
      linear-gradient(90deg,rgba(201,168,76,0.04) 1px,transparent 1px);
    background-size:76px 76px;
  }
  /* Teal ambient glow in logo safe zone */
  .left-glow{
    position:absolute;left:0;top:0;width:440px;height:100%;
    background:linear-gradient(90deg,rgba(43,138,110,0.08) 0%,transparent 100%);
  }
  /* Warm right edge glow */
  .right-glow{
    position:absolute;right:0;top:0;width:220px;height:100%;
    background:linear-gradient(270deg,rgba(201,168,76,0.05) 0%,transparent 100%);
  }
  /* Subtle diagonal light sweep */
  .sweep{
    position:absolute;inset:0;
    background:linear-gradient(135deg,transparent 35%,rgba(255,255,255,0.018) 50%,transparent 65%);
  }
  /* Main flex row — sits above the bottom strip */
  .main{
    position:absolute;inset:0 0 72px 0;
    display:flex;align-items:stretch;
    z-index:2;
  }
  /* ── Logo safe zone (profile pic overlaps lower-left ~180px circle) ── */
  .safe{width:304px;flex-shrink:0;}
  /* ── Gold vertical rules ── */
  .vr{width:1px;background:rgba(201,168,76,0.2);margin:40px 0 0;flex-shrink:0;}
  /* ── Headline zone ── */
  .hl-zone{
    flex:1;padding:0 56px;
    display:flex;flex-direction:column;justify-content:center;
  }
  .eyebrow{
    font-family:'Barlow Condensed',sans-serif;
    font-size:15px;font-weight:800;letter-spacing:.3em;
    text-transform:uppercase;color:rgba(201,168,76,0.6);
    display:flex;align-items:center;gap:20px;margin-bottom:18px;
  }
  .eyebrow::before{
    content:'';display:inline-block;
    width:36px;height:1px;background:rgba(201,168,76,0.4);flex-shrink:0;
  }
  .headline{
    font-family:'Cormorant Garamond',serif;font-style:italic;
    font-size:52px;font-weight:600;line-height:1.06;
    color:#ffffff;margin-bottom:18px;
    text-shadow:0 2px 24px rgba(0,0,0,0.4);
  }
  .headline em{color:#C9A84C;font-style:italic;}
  .sub{
    font-family:'Barlow Condensed',sans-serif;
    font-size:15px;font-weight:600;letter-spacing:.16em;
    text-transform:uppercase;color:rgba(255,255,255,0.36);
    line-height:1.5;
  }
  .sub .dot{color:rgba(201,168,76,0.35);margin:0 12px;}
  /* ── Stats zone ── */
  .stats-zone{
    width:380px;flex-shrink:0;padding:0 36px;
    display:flex;flex-direction:column;justify-content:center;gap:8px;
  }
  .stat{
    display:flex;align-items:baseline;gap:14px;
    padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,0.05);
  }
  .stat:last-child{border-bottom:none;padding-bottom:0;}
  .snum{
    font-family:'Barlow Condensed',sans-serif;
    font-size:44px;font-weight:900;
    color:#C9A84C;line-height:1;letter-spacing:-0.02em;
    min-width:108px;
  }
  .slabel{
    font-family:'Barlow Condensed',sans-serif;
    font-size:14px;font-weight:700;letter-spacing:.1em;
    text-transform:uppercase;color:rgba(255,255,255,0.42);
    line-height:1.3;
  }
  /* ── Brand zone ── */
  .brand-zone{
    width:192px;flex-shrink:0;
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    gap:12px;padding:0 20px;
  }
  .vm-seal{width:72px;height:72px;flex-shrink:0;}
  .bname{
    font-family:'Barlow Condensed',sans-serif;
    font-size:20px;font-weight:700;letter-spacing:.12em;
    color:#ffffff;text-align:center;line-height:1.15;
  }
  .bprod{
    font-family:'Barlow Condensed',sans-serif;
    font-size:12px;font-weight:600;letter-spacing:.35em;
    color:#C9A84C;text-transform:uppercase;text-align:center;
    margin-top:-4px;
  }
  /* ── Bottom strip ── */
  .bottom{
    position:absolute;bottom:0;left:0;right:0;height:72px;
    background:rgba(4,6,18,0.75);
    border-top:1px solid rgba(201,168,76,0.15);
    display:flex;align-items:center;justify-content:space-between;
    padding:0 40px 0 316px;z-index:3;
  }
  .arc{
    font-family:'Barlow Condensed',sans-serif;
    font-size:14px;font-weight:700;letter-spacing:.3em;
    text-transform:uppercase;color:rgba(255,255,255,0.3);
    display:flex;align-items:center;gap:0;
  }
  .arc .ag{color:rgba(201,168,76,0.6);}
  .arc .arr{color:rgba(201,168,76,0.3);margin:0 16px;}
  .url{
    font-family:'Barlow Condensed',sans-serif;
    font-size:14px;font-weight:600;letter-spacing:.16em;
    color:rgba(201,168,76,0.4);
  }
</style>
</head>
<body>
  <div class="grid"></div>
  <div class="left-glow"></div>
  <div class="right-glow"></div>
  <div class="sweep"></div>

  <div class="main">
    <!-- Profile photo safe zone — LinkedIn logo overlaps this area -->
    <div class="safe"></div>
    <div class="vr"></div>

    <!-- Headline -->
    <div class="hl-zone">
      <div class="eyebrow">Strategic Readiness Platform &nbsp;·&nbsp; Fortune 1000</div>
      <div class="headline">The response is ready<br><em>before the trigger fires.</em></div>
      <div class="sub">
        30 days compressed to 12 minutes
        <span class="dot">·</span>
        170 Readiness Protocols pre-staged
        <span class="dot">·</span>
        Executive authority preserved
      </div>
    </div>

    <div class="vr"></div>

    <!-- Key metrics -->
    <div class="stats-zone">
      <div class="stat">
        <span class="snum">3,600×</span>
        <span class="slabel">Execution<br>Head Start</span>
      </div>
      <div class="stat">
        <span class="snum">170</span>
        <span class="slabel">Readiness<br>Protocols</span>
      </div>
      <div class="stat">
        <span class="snum">221</span>
        <span class="slabel">Strategic<br>Triggers</span>
      </div>
    </div>

    <div class="vr"></div>

    <!-- Brand mark -->
    <div class="brand-zone">
      <svg class="vm-seal" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="36" cy="36" r="33.5" stroke="#C9A84C" stroke-width="1.5"/>
        <circle cx="36" cy="36" r="26.5" stroke="rgba(201,168,76,0.25)" stroke-width="1"/>
        <text x="36" y="41" text-anchor="middle"
          font-family="Barlow Condensed,sans-serif"
          font-size="17" font-weight="800" fill="#C9A84C" letter-spacing="1">VM</text>
      </svg>
      <div class="bname">VaughnMartin</div>
      <div class="bprod">Readiness OS</div>
    </div>
  </div>

  <!-- Bottom identity strip -->
  <div class="bottom">
    <div class="arc">
      <span class="ag">Preparation</span>
      <span class="arr">→</span>
      <span class="ag">Readiness</span>
      <span class="arr">→</span>
      <span class="ag">Fearless</span>
    </div>
    <div class="url">vaughnmartin.com</div>
  </div>
</body>
</html>`;
}

// ─── Route ────────────────────────────────────────────────────────────────────
export function registerMarketingImageRoute(app: Express): void {
  /**
   * GET /api/marketing-infographic.png
   *
   * Query params:
   *   ?format=web              480px  × 1× scale  (default, quick preview)
   *   ?format=hd               800px  × 2× scale  (~1600px — website/email)
   *   ?format=linkedin         600px  × 2× scale  (~1200×628 landscape share)
   *   ?format=linkedin-banner  792px  × 2× scale  (1584×396 LinkedIn company page banner)
   *   ?format=portrait         540px  × 2× scale  (~1080×1350 LinkedIn/Instagram)
   *   ?format=letter           850px  × 3× scale  (8.5×11″ @ 300 dpi)
   *   ?format=a4               827px  × 3× scale  (A4 @ 300 dpi)
   */
  app.get("/api/marketing-infographic.png", async (req: any, res) => {
    const formatKey = (req.query.format as string) || "hd";
    const preset: Preset = PRESETS[formatKey as Format] ?? PRESETS.web;

    // For the banner the HTML has a fixed height; for all other formats use
    // a tall viewport so the full infographic renders before we clip.
    const viewH = preset.isBanner
      ? Math.round((preset.clipHeight ?? 198) * preset.scale)
      : Math.round(preset.cardWidth * preset.scale * 3);

    let browser;
    try {
      browser = await chromium.launch({
        executablePath: CHROMIUM,
        args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
      });

      const page = await browser.newPage();
      await page.setViewportSize({
        width:  Math.round(preset.cardWidth * preset.scale),
        height: viewH,
      });

      await page.emulateMedia({ colorScheme: "dark" });

      // Use CDP to set exact device scale factor
      const session = await page.context().newCDPSession(page);
      await session.send("Emulation.setDeviceMetricsOverride", {
        width:             Math.round(preset.cardWidth * preset.scale),
        height:            viewH,
        deviceScaleFactor: preset.scale,
        mobile:            false,
      });

      const html = preset.isBanner
        ? buildLinkedInBannerHtml()
        : buildHtml(preset.cardWidth);

      await page.setContent(html, { waitUntil: "networkidle" });
      await page.waitForTimeout(2000);

      let buffer: Buffer;

      if (preset.isBanner) {
        // For the fixed-height banner, screenshot the page directly.
        // page.screenshot clip coords are in CSS pixels; deviceScaleFactor=2
        // means output dimensions = clip_css_px × scale = 1584×396.
        buffer = await page.screenshot({
          type: "png",
          clip: {
            x: 0, y: 0,
            width:  preset.cardWidth,               // 792 CSS px → 1584 output px
            height: preset.clipHeight ?? 198,       // 198 CSS px → 396  output px
          },
        });
      } else {
        const body = await page.$("body");
        if (!body) throw new Error("Body element not found");

        const screenshotOpts: Parameters<typeof body.screenshot>[0] = { type: "png" };
        if (preset.clipHeight) {
          const bodyBox = await body.boundingBox();
          if (bodyBox) {
            screenshotOpts.clip = {
              x: 0, y: 0,
              width:  bodyBox.width,
              height: Math.min(preset.clipHeight * preset.scale, bodyBox.height),
            };
          }
        }
        buffer = await body.screenshot(screenshotOpts);
      }

      const filename = `VaughnMartin-ReadinessOS-${preset.label.replace(/[^a-zA-Z0-9]/g, "-")}.png`;
      res.setHeader("Content-Type", "image/png");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.setHeader("Cache-Control", "public, max-age=300");
      res.setHeader("X-Image-Size", `${preset.cardWidth * preset.scale}x${(preset.clipHeight ?? 0) * preset.scale}`);
      res.setHeader("X-Format", preset.label);
      res.send(buffer);
    } catch (err: any) {
      console.error("[MarketingImage] Screenshot failed:", err?.message);
      res.status(500).json({ error: "Image generation failed", detail: err?.message });
    } finally {
      if (browser) await browser.close();
    }
  });
}
