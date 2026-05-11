import type { Express } from "express";
import { chromium } from "playwright-core";

const CHROMIUM = process.env.REPLIT_PLAYWRIGHT_CHROMIUM_EXECUTABLE ||
  "/nix/store/kcvsxrmgwp3ffz5jijyy7wn9fcsjl4hz-playwright-browsers-1.55.0-with-cjk/chromium-1187/chrome-linux/chrome";

const NAVY    = "#0A0F2E";
const NAVY2   = "#0D1535";
const GOLD    = "#C9A84C";
const GOLD_LT = "#DFC178";
const TEAL_LT = "#3BAF8A";
const WHITE   = "#FDFCFA";
const MUTED   = "rgba(253,252,250,0.55)";
const MUTED2  = "rgba(253,252,250,0.35)";
const BORDER  = "rgba(201,168,76,0.18)";

function buildHtml(): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=430"/>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Barlow+Condensed:wght@500;600;700&display=swap" rel="stylesheet"/>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #06091A; display: flex; justify-content: center; padding: 0; font-family: sans-serif; }
  .card { width: 430px; background: ${NAVY}; border: 1px solid ${BORDER}; overflow: hidden; }
  .geo { font-family: 'Cormorant Garamond', Georgia, serif; }
  .dm  { font-family: 'Barlow Condensed', 'Arial Narrow', sans-serif; }
  .mono { font-family: 'Courier New', monospace; }

  /* HERO */
  .hero { padding: 32px 28px 26px; background: linear-gradient(155deg,${NAVY2} 0%,${NAVY} 55%); position: relative; overflow: hidden; }
  .grid-bg { position: absolute; inset: 0; width: 100%; height: 100%; opacity: .035; pointer-events: none; }
  .logo-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 26px; position: relative; }
  .logo-left { display: flex; align-items: center; gap: 12px; white-space: nowrap; }
  .wordmark { color: ${WHITE}; font-size: 18px; font-weight: 600; letter-spacing: .01em; line-height: 1; }
  .rule-row { display: flex; align-items: center; gap: 6px; margin-top: 4px; }
  .rule-line { width: 18px; height: 1px; background: ${GOLD}; flex-shrink: 0; }
  .os-label { color: ${GOLD}; font-size: 9px; font-weight: 700; letter-spacing: .3em; text-transform: uppercase; }
  .logo-right { text-align: right; color: ${GOLD}; font-size: 7.5px; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; line-height: 1.8; opacity: .9; }
  .logo-right .sub { color: ${TEAL_LT}; font-size: 7px; letter-spacing: .12em; opacity: .75; }
  .headline { margin-bottom: 8px; }
  .hl1 { color: ${WHITE}; font-size: 36px; font-weight: 700; line-height: 1.06; letter-spacing: -.01em; }
  .hl2 { color: ${GOLD}; font-size: 36px; font-weight: 700; line-height: 1.06; letter-spacing: -.01em; }
  .sub-headline { color: ${MUTED}; font-size: 14px; font-weight: 500; line-height: 1.5; margin-bottom: 22px; }
  .sub-headline .secondary { color: ${MUTED2}; font-size: 12px; margin-top: 3px; line-height: 1.45; }
  .gold-rule { width: 100%; height: 1px; background: linear-gradient(90deg, transparent, ${GOLD}, transparent); opacity: .28; margin: 20px 0; }
  .stats-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0; }
  .stat { padding: 0 16px; text-align: center; border-right: 1px solid ${BORDER}; }
  .stat:first-child { padding-left: 0; text-align: left; }
  .stat:last-child { padding-right: 0; text-align: right; border-right: none; }
  .stat-num { font-size: 28px; font-weight: 700; line-height: 1; }
  .stat-label { font-size: 10px; font-weight: 600; margin-top: 4px; line-height: 1.3; color: ${MUTED}; }
  .stat-sub { font-size: 8px; opacity: .65; margin-top: 2px; color: ${GOLD}; }

  /* OLD MODEL */
  .old-model { background: #070B1E; padding: 22px 28px 18px; }
  .section-eyebrow { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
  .eyebrow-rule { width: 22px; height: 1px; background: ${GOLD}; opacity: .5; }
  .eyebrow-text { color: ${GOLD}; font-size: 9.5px; font-weight: 700; letter-spacing: .22em; text-transform: uppercase; }
  .section-body { color: ${MUTED2}; font-size: 11.5px; line-height: 1.55; margin-bottom: 16px; }
  .section-body strong { color: ${MUTED}; font-weight: 500; }
  .prob-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
  .prob-tile { background: rgba(201,168,76,.04); border: 1px solid rgba(201,168,76,.1); padding: 11px 10px; text-align: center; }
  .prob-icon { display: flex; justify-content: center; margin-bottom: 7px; }
  .prob-label { color: rgba(253,252,250,.7); font-size: 10px; font-weight: 700; line-height: 1.3; margin-bottom: 2px; }
  .prob-sub { color: ${MUTED2}; font-size: 7.5px; line-height: 1.3; }
  .prob-footer { color: ${GOLD}; font-size: 9px; font-weight: 700; letter-spacing: .2em; text-align: center; margin-top: 14px; opacity: .5; text-transform: uppercase; }

  /* SPLIT */
  .split { display: flex; border-top: 1px solid ${BORDER}; }
  .split-left { flex: 1; padding: 20px 16px 20px 28px; border-right: 1px solid ${BORDER}; }
  .split-right { flex: 1; padding: 20px 28px 20px 16px; background: rgba(43,138,110,.03); }
  .col-eye { color: ${TEAL_LT}; font-size: 8.5px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; margin-bottom: 8px; }
  .col-hed { color: ${WHITE}; font-size: 15px; font-weight: 700; line-height: 1.25; margin-bottom: 14px; }
  .col-hed .gold { color: ${GOLD}; }
  .col-hed .teal { color: ${TEAL_LT}; }
  .cycle-wrap { display: flex; justify-content: center; margin-bottom: 14px; }
  .features { display: flex; flex-direction: column; gap: 7px; }
  .feat { display: flex; align-items: flex-start; gap: 8px; }
  .feat-dot { width: 4px; height: 4px; background: ${TEAL_LT}; flex-shrink: 0; margin-top: 5px; transform: rotate(45deg); }
  .feat-text { color: ${MUTED}; font-size: 11px; font-weight: 500; line-height: 1.4; }
  .inv-items { display: flex; flex-direction: column; gap: 13px; }
  .inv-item { display: flex; align-items: flex-start; gap: 8px; }
  .inv-title { color: ${GOLD}; font-size: 11px; font-weight: 700; margin-bottom: 2px; }
  .inv-body { color: ${MUTED2}; font-size: 10px; font-weight: 500; line-height: 1.45; }

  /* FOOTER */
  .footer { background: #070B1E; padding: 20px 28px 22px; border-top: 1px solid ${BORDER}; }
  .tagline-wrap { text-align: center; margin-bottom: 16px; }
  .tagline { color: ${GOLD_LT}; font-size: 15px; font-style: italic; line-height: 1.4; margin-bottom: 4px; }
  .tagline-sub { color: ${MUTED2}; font-size: 10px; letter-spacing: .08em; }
  .footer-bottom { display: flex; justify-content: space-between; align-items: center; }
  .footer-logo { display: flex; align-items: center; gap: 10px; }
  .footer-name { color: ${WHITE}; font-size: 13px; font-weight: 600; line-height: 1; }
  .footer-os { color: ${GOLD}; font-size: 8px; font-weight: 700; letter-spacing: .28em; margin-top: 2px; }
  .footer-right { text-align: right; color: ${TEAL_LT}; font-size: 8px; letter-spacing: .1em; line-height: 1.7; text-transform: uppercase; }
  .footer-right .gold { color: ${GOLD}; }
</style>
</head>
<body>
<div class="card">

  <!-- HERO -->
  <div class="hero">
    <svg class="grid-bg" xmlns="http://www.w3.org/2000/svg">
      <defs><pattern id="g" width="28" height="28" patternUnits="userSpaceOnUse">
        <path d="M 28 0 L 0 0 0 28" fill="none" stroke="${GOLD}" stroke-width="0.5"/>
      </pattern></defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
    </svg>

    <div class="logo-row">
      <div class="logo-left">
        <svg width="50" height="50" viewBox="0 0 200 200">
          <defs>
            <radialGradient id="sb" cx="50%" cy="30%" r="70%"><stop offset="0%" stop-color="#1a2860"/><stop offset="100%" stop-color="${NAVY}"/></radialGradient>
            <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${GOLD_LT}"/><stop offset="50%" stop-color="${GOLD}"/><stop offset="100%" stop-color="#8B6212"/></linearGradient>
          </defs>
          <circle cx="100" cy="100" r="86" fill="url(#sb)"/>
          <circle cx="100" cy="100" r="88" fill="none" stroke="${GOLD}" stroke-width="1" opacity=".85"/>
          <circle cx="100" cy="100" r="83" fill="none" stroke="${GOLD}" stroke-width=".4" opacity=".25"/>
          <polygon points="100,8 104,12 100,16 96,12" fill="url(#sg)"/>
          <polygon points="192,100 188,104 184,100 188,96" fill="url(#sg)"/>
          <polygon points="100,192 104,188 100,184 96,188" fill="url(#sg)"/>
          <polygon points="8,100 12,96 16,100 12,104" fill="url(#sg)"/>
          <text x="100" y="114" text-anchor="middle" font-family="Georgia,serif" font-size="52" font-weight="700" fill="url(#sg)" letter-spacing="-2">VM</text>
          <path id="ta" d="M 29.5,100 A 70.5,70.5 0 0,1 170.5,100" fill="none"/>
          <text font-family="Courier New,monospace" font-size="11" fill="${GOLD}" opacity=".85" text-anchor="middle"><textPath href="#ta" startOffset="50%">VAUGHNMARTIN · READINESS OS</textPath></text>
          <path id="ba" d="M 36.6,100 A 63.4,63.4 0 0,0 163.4,100" fill="none"/>
          <text font-family="Courier New,monospace" font-size="9.5" fill="${TEAL_LT}" opacity=".7" text-anchor="middle"><textPath href="#ba" startOffset="50%">ANTE IGNEM PARATUS</textPath></text>
        </svg>
        <div>
          <div class="geo wordmark">VaughnMartin</div>
          <div class="rule-row"><div class="rule-line"></div><div class="dm mono os-label">Readiness OS</div></div>
        </div>
      </div>
      <div class="logo-right mono">
        A NEW CATEGORY<br/>FOR A NEW ERA
        <div class="sub">PRE-STAGED · ALWAYS READY</div>
      </div>
    </div>

    <div class="headline">
      <div class="geo hl1">Welcome to the<br/>execution first.</div>
      <div class="geo hl2">Readiness OS™</div>
    </div>
    <div class="dm sub-headline">
      The Operating Model for the Fortune 1000.
      <div class="secondary">Every vendor bolted AI onto the old model. We replaced the model.<br/>Preparation replaces coordination. 12 minutes replaces 30 days.</div>
    </div>
    <div class="gold-rule"></div>
    <div class="stats-row">
      <div class="stat">
        <div class="geo stat-num" style="color:${GOLD}">3,600×</div>
        <div class="dm stat-label">Execution Head Start</div>
        <div class="mono stat-sub">30 days → 12 minutes</div>
      </div>
      <div class="stat">
        <div class="geo stat-num" style="color:${WHITE}">170</div>
        <div class="dm stat-label">Readiness Protocols</div>
        <div class="mono stat-sub">pre-staged, not assembled</div>
      </div>
      <div class="stat">
        <div class="geo stat-num" style="color:${WHITE}">221</div>
        <div class="dm stat-label">Strategic Triggers</div>
        <div class="mono stat-sub">continuously monitored</div>
      </div>
    </div>
  </div>

  <!-- OLD MODEL -->
  <div class="old-model">
    <div class="section-eyebrow">
      <div class="eyebrow-rule"></div>
      <div class="dm eyebrow-text">The Old Model. Year After Year.</div>
    </div>
    <div class="dm section-body">
      Enterprise work was designed for a world without AI — committees, alignment cycles,
      and coordination delays exist because humans couldn't process information fast enough to act decisively.
      <strong>AI changed the constraint. The operating model didn't.</strong>
    </div>
    <div class="prob-grid">
      ${[
        { svg: `<path d="M4,10 Q8,5 12,10 Q16,15 20,10" stroke="${GOLD}" stroke-width="1.2" fill="none" opacity=".7"/>`, label: "30-Day Mobilization", sub: "before execution even begins" },
        { svg: `<circle cx="12" cy="12" r="8" stroke="${GOLD}" stroke-width="1.2" fill="none" opacity=".7"/>`, label: "Committee Deliberation", sub: "replacing pattern detection" },
        { svg: `<rect x="4" y="4" width="16" height="16" stroke="${GOLD}" stroke-width="1.2" fill="none" opacity=".7"/>`, label: "Reactive Posture", sub: "assembling after the trigger fires" },
        { svg: `<polygon points="12,3 21,12 12,21 3,12" stroke="${GOLD}" stroke-width="1.2" fill="none" opacity=".7"/>`, label: "Stakeholder Alignment", sub: "weeks of coordination overhead" },
        { svg: `<polygon points="12,4 22,20 2,20" stroke="${GOLD}" stroke-width="1.2" fill="none" opacity=".7"/>`, label: "No Signal Layer", sub: "blind to strategic triggers" },
        { svg: `<line x1="12" y1="3" x2="12" y2="21" stroke="${GOLD}" stroke-width="1.2" opacity=".7"/><line x1="3" y1="12" x2="21" y2="12" stroke="${GOLD}" stroke-width="1.2" opacity=".7"/>`, label: "Execution Delays", sub: "30-day response to 12-min triggers" },
      ].map(p => `
      <div class="prob-tile">
        <div class="prob-icon"><svg width="24" height="24" viewBox="0 0 24 24">${p.svg}</svg></div>
        <div class="dm prob-label">${p.label}</div>
        <div class="mono prob-sub">${p.sub}</div>
      </div>`).join("")}
    </div>
    <div class="dm prob-footer">Weeks to mobilize · Months to execute · Strategic windows missed</div>
  </div>

  <!-- SPLIT -->
  <div class="split">
    <div class="split-left">
      <div class="mono col-eye">One Readiness OS</div>
      <div class="geo col-hed">The full readiness cycle.<br/><span class="gold">Pre-staged. Always ready.</span></div>
      <div class="cycle-wrap">
        <svg width="110" height="110" viewBox="0 0 110 110">
          <circle cx="55" cy="55" r="42" fill="none" stroke="${GOLD}" stroke-width=".4" stroke-dasharray="2 6" opacity=".2"/>
          ${[
            { label:"IDENTIFY", sub:"signals", a:-90, c:GOLD },
            { label:"DEVELOP", sub:"protocols", a:-18, c:GOLD_LT },
            { label:"EXECUTE", sub:"12 min", a:54, c:TEAL_LT },
            { label:"ASSESS", sub:"debrief", a:126, c:GOLD_LT },
            { label:"PREPARE", sub:"always", a:198, c:GOLD },
          ].map(s => {
            const r2 = 42, cx2 = 55, cy2 = 55;
            const rad = s.a * Math.PI / 180;
            const x = cx2 + r2 * Math.cos(rad), y = cy2 + r2 * Math.sin(rad);
            return `<g>
              <circle cx="${x}" cy="${y}" r="9" fill="${NAVY2}" stroke="${s.c}" stroke-width=".8" opacity=".9"/>
              <text x="${x}" y="${y-1}" text-anchor="middle" dominant-baseline="middle" font-family="Courier New,monospace" font-size="3.5" fill="${s.c}" font-weight="700">${s.label}</text>
              <text x="${x}" y="${y+4.5}" text-anchor="middle" dominant-baseline="middle" font-family="Courier New,monospace" font-size="3" fill="${MUTED}">${s.sub}</text>
            </g>`;
          }).join("")}
          <circle cx="55" cy="55" r="14" fill="${NAVY2}" stroke="${GOLD}" stroke-width=".6" opacity=".6"/>
          <text x="55" y="52" text-anchor="middle" font-family="Georgia,serif" font-size="6.5" fill="${GOLD}" font-weight="700">IDEA</text>
          <text x="55" y="61" text-anchor="middle" font-family="Courier New,monospace" font-size="4.5" fill="${MUTED}">Framework</text>
        </svg>
      </div>
      <div class="features">
        ${[
          "170 Readiness Protocols pre-staged",
          "221 strategic triggers monitored",
          "12-minute execution design target",
          "Executive authority at every stage",
          "Orchestrates your Microsoft AI stack",
          "Pre-staged before the trigger fires",
        ].map(f => `<div class="feat"><div class="feat-dot"></div><div class="dm feat-text">${f}</div></div>`).join("")}
      </div>
    </div>
    <div class="split-right">
      <div class="mono col-eye">Built for Investors</div>
      <div class="geo col-hed">Built for<br/><span class="teal">the future.</span></div>
      <div class="inv-items">
        ${[
          { svg: `<polygon points="12,2 22,12 12,22 2,12" stroke="${GOLD}" stroke-width="1.2" fill="none" opacity=".7"/>`, title:"Category Creation", body:"Not competing with Copilot, SAP, or Workday — sits above them as the operating model layer they don't provide." },
          { svg: `<polygon points="12,2 20,7 20,17 12,22 4,17 4,7" stroke="${GOLD}" stroke-width="1.2" fill="none" opacity=".7"/>`, title:"Platform Economics", body:"170 core protocols + 6 industry packs + 12 compound protocols. Compounding value with every activation." },
          { svg: `<rect x="3" y="3" width="18" height="18" stroke="${GOLD}" stroke-width="1.2" fill="none" opacity=".7"/>`, title:"Microsoft Amplifier", body:"Every Fortune 1000 has invested in Microsoft AI. None have the operating model to use it when it counts." },
          { svg: `<circle cx="12" cy="12" r="9" stroke="${GOLD}" stroke-width="1.2" fill="none" opacity=".7"/>`, title:"Founding Partner Program", body:"First cohort forming now. Selective by design — validating with Fortune 1000 enterprises only." },
        ].map(item => `
        <div class="inv-item">
          <svg width="16" height="16" viewBox="0 0 24 24" style="flex-shrink:0;margin-top:1px">${item.svg}</svg>
          <div><div class="dm inv-title">${item.title}</div><div class="dm inv-body">${item.body}</div></div>
        </div>`).join("")}
      </div>
    </div>
  </div>

  <!-- FOOTER -->
  <div class="footer">
    <div class="tagline-wrap">
      <div class="geo tagline">"The response is ready before the trigger fires."</div>
      <div class="dm tagline-sub">Preparation → Readiness → Fearless</div>
    </div>
    <div class="gold-rule" style="margin:16px 0"></div>
    <div class="footer-bottom">
      <div class="footer-logo">
        <svg width="30" height="30" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="86" fill="url(#sb)"/>
          <circle cx="100" cy="100" r="88" fill="none" stroke="${GOLD}" stroke-width="1" opacity=".85"/>
          <text x="100" y="114" text-anchor="middle" font-family="Georgia,serif" font-size="52" font-weight="700" fill="url(#sg)" letter-spacing="-2">VM</text>
        </svg>
        <div>
          <div class="geo footer-name">VaughnMartin</div>
          <div class="dm footer-os">READINESS OS</div>
        </div>
      </div>
      <div class="footer-right mono">
        Founding Partner Access<br/>
        <span class="gold">Now Forming — Apply Today</span>
      </div>
    </div>
  </div>

</div>
</body>
</html>`;
}

export function registerMarketingImageRoute(app: Express): void {
  app.get("/api/marketing-infographic.png", async (req, res) => {
    let browser;
    try {
      browser = await chromium.launch({
        executablePath: CHROMIUM,
        args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
      });
      const page = await browser.newPage();
      await page.setViewportSize({ width: 430, height: 1200 });
      await page.setContent(buildHtml(), { waitUntil: "networkidle" });

      // Wait for fonts to load
      await page.waitForTimeout(1500);

      // Screenshot just the card element
      const card = await page.$(".card");
      if (!card) throw new Error("Card element not found");
      const buffer = await card.screenshot({ type: "png" });

      res.setHeader("Content-Type", "image/png");
      res.setHeader("Content-Disposition", 'attachment; filename="VaughnMartin-ReadinessOS.png"');
      res.setHeader("Cache-Control", "public, max-age=300");
      res.send(buffer);
    } catch (err: any) {
      console.error("[MarketingImage] Screenshot failed:", err?.message);
      res.status(500).json({ error: "Image generation failed", detail: err?.message });
    } finally {
      if (browser) await browser.close();
    }
  });
}
