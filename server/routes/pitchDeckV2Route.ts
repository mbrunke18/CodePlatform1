import type { Express } from "express";
import { chromium } from "playwright-core";

const CHROMIUM =
  process.env.REPLIT_PLAYWRIGHT_CHROMIUM_EXECUTABLE ||
  "/nix/store/kcvsxrmgwp3ffz5jijyy7wn9fcsjl4hz-playwright-browsers-1.55.0-with-cjk/chromium-1187/chrome-linux/chrome";

const NAVY = "#0A0F2E";
const NAVY2 = "#0D1436";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const IVORY = "#F0EDE4";

// ─── Page screenshot cache ────────────────────────────────────────────────────
const screenshotCache = new Map<string, string>(); // url → base64 PNG

async function getPageShot(url: string): Promise<string> {
  if (screenshotCache.has(url)) return screenshotCache.get(url)!;
  const browser = await chromium.launch({
    executablePath: CHROMIUM,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });
  try {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(url, { waitUntil: "networkidle", timeout: 20000 });
    await page.waitForTimeout(2500);
    const buf = await page.screenshot({ type: "png", clip: { x: 0, y: 0, width: 1280, height: 720 } });
    const b64 = `data:image/png;base64,${buf.toString("base64")}`;
    screenshotCache.set(url, b64);
    await page.close();
    return b64;
  } finally {
    await browser.close();
  }
}

// ─── Slide definitions ────────────────────────────────────────────────────────
interface SlideData {
  num: string;
  label: string;
  title: string;
  bullets: string[];
  quote: string;
  pageUrl: string;
  pageLabel: string;
  accent: string;
}

const BASE = "http://localhost:5000";

const SLIDES: SlideData[] = [
  {
    num: "01",
    label: "THE PROBLEM",
    title: "The trigger fires in seconds. Mobilization takes 30 days.",
    bullets: [
      "Fortune 1000 organizations detect strategic triggers quickly",
      "Most still spend weeks aligning ownership, authority, and sequence",
      "The delay is not execution — it is mobilization",
    ],
    quote:
      '"Most organizations do not have a strategy problem. They have a mobilization problem. When a trigger fires, the first weeks are spent figuring out who decides and who owns the response."',
    pageUrl: `${BASE}/`,
    pageLabel: "vaughnmartin.com",
    accent: GOLD,
  },
  {
    num: "02",
    label: "THE PRODUCT",
    title: "Readiness OS: The response is ready before the trigger fires.",
    bullets: [
      "170 Readiness Protocols pre-staged",
      "221 trigger patterns mapped",
      "248+ data points monitored every 15 minutes",
      "AI monitors. Executives authorize.",
    ],
    quote:
      '"We built Readiness OS to pre-stage the response architecture before pressure arrives. Authority remains human; mobilization becomes immediate."',
    pageUrl: `${BASE}/how-it-executes`,
    pageLabel: "vaughnmartin.com/how-it-executes",
    accent: GOLD,
  },
  {
    num: "03",
    label: "HOW IT WORKS",
    title: "From trigger to coordinated execution in minutes.",
    bullets: [
      "① Signal detected",
      "② Matching protocol staged",
      "③ Stakeholders notified",
      "④ Executive authorizes",
      "⑤ Execution launches",
    ],
    quote: '"The key change is that coordination is pre-built, so when the trigger fires, execution starts."',
    pageUrl: `${BASE}/how-it-executes`,
    pageLabel: "vaughnmartin.com/how-it-executes",
    accent: TEAL,
  },
  {
    num: "04",
    label: "PROOF — NOW, NOT ROADMAP",
    title: "Built. Live. In production now.",
    bullets: [
      "Production platform live at vaughnmartin.com",
      "Full public execution walkthrough available",
      "Founding Partner cohort open for 90-day validation",
    ],
    quote: '"This is not a roadmap concept. The platform is live and testable now."',
    pageUrl: `${BASE}/executive-brief`,
    pageLabel: "vaughnmartin.com/executive-brief",
    accent: GOLD,
  },
  {
    num: "05",
    label: "BUSINESS CASE",
    title: "Replace existing response spend with execution infrastructure.",
    bullets: [
      "Existing budgets already fund reactive response motions",
      "Readiness OS shifts spend to pre-staged execution readiness",
      "One high-impact trigger handled well can justify annual investment",
    ],
    quote:
      '"We are not asking enterprises to invent new budget. We are replacing existing response spend with a repeatable operating model."',
    pageUrl: `${BASE}/roi-calculator`,
    pageLabel: "vaughnmartin.com/roi-calculator",
    accent: GOLD,
  },
  {
    num: "06",
    label: "ASK + CLOSE",
    title: "Category creation: Preparation Infrastructure",
    bullets: [
      "Raise: $[AMOUNT]",
      "Product hardening + enterprise controls",
      "Founding Partner conversions",
      "Repeatable GTM motion",
    ],
    quote:
      '"Every enterprise has AI capability. Very few have mobilization readiness. We built that layer. It\'s live now."',
    pageUrl: `${BASE}/founding-partner-program`,
    pageLabel: "vaughnmartin.com/founding-partner-program",
    accent: GOLD,
  },
];

// ─── HTML builder ─────────────────────────────────────────────────────────────
function buildSlideHtml(slide: SlideData, shotB64: string): string {
  const bulletsHtml = slide.bullets
    .map(
      (b) =>
        `<li style="margin-bottom:10px;padding-left:16px;position:relative;">
          <span style="position:absolute;left:0;top:2px;color:${slide.accent};font-size:11px;">▶</span>
          ${b}
        </li>`
    )
    .join("");

  const VM_SEAL = `
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="18" cy="18" r="17" stroke="${GOLD}" stroke-width="1.5"/>
      <circle cx="18" cy="18" r="13" stroke="${GOLD}" stroke-width="0.6" stroke-dasharray="2 2"/>
      <text x="18" y="22" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-size="10" font-weight="700" fill="${GOLD}">VM</text>
    </svg>`;

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800;900&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&display=swap');
  *{margin:0;padding:0;box-sizing:border-box;}
  html,body{width:1280px;height:720px;overflow:hidden;background:${NAVY};}
  .slide{width:1280px;height:720px;display:flex;position:relative;font-family:'Barlow Condensed',sans-serif;}

  /* LEFT PANEL */
  .left{
    width:540px;min-width:540px;height:720px;
    background:${NAVY};
    padding:52px 44px 40px 52px;
    display:flex;flex-direction:column;justify-content:space-between;
    position:relative;overflow:hidden;
  }
  .left::before{
    content:'';position:absolute;inset:0;
    background:radial-gradient(ellipse at 10% 80%, rgba(201,168,76,0.07) 0%, transparent 60%),
               linear-gradient(135deg, rgba(255,255,255,0.015) 0%, transparent 60%);
    pointer-events:none;
  }
  .grid-overlay{
    position:absolute;inset:0;pointer-events:none;
    background-image:linear-gradient(rgba(201,168,76,0.04) 1px,transparent 1px),
                     linear-gradient(90deg,rgba(201,168,76,0.04) 1px,transparent 1px);
    background-size:40px 40px;
  }
  .left-content{position:relative;z-index:1;flex:1;display:flex;flex-direction:column;justify-content:space-between;}

  .slide-label{
    display:inline-block;
    font-size:10px;font-weight:700;letter-spacing:0.22em;
    color:${slide.accent};text-transform:uppercase;
    border-left:3px solid ${slide.accent};
    padding-left:10px;margin-bottom:22px;
  }
  .slide-num{font-size:9px;color:rgba(201,168,76,0.4);letter-spacing:0.18em;margin-bottom:6px;}

  h1{
    font-family:'Barlow Condensed',sans-serif;
    font-size:${slide.title.length > 60 ? "26px" : "30px"};
    font-weight:900;text-transform:uppercase;letter-spacing:0.01em;
    line-height:1.12;color:#fff;margin-bottom:26px;
  }
  h1 em{font-style:normal;color:${slide.accent};}

  .gold-rule{width:44px;height:3px;background:${slide.accent};margin-bottom:22px;border-radius:1px;}

  ul{list-style:none;padding:0;margin:0 0 20px 0;}
  ul li{
    font-size:14px;font-weight:500;color:rgba(255,255,255,0.88);
    line-height:1.5;
  }

  .quote{
    font-family:'Cormorant Garamond',Georgia,serif;
    font-style:italic;font-size:12.5px;
    color:rgba(255,255,255,0.5);line-height:1.6;
    border-left:2px solid rgba(201,168,76,0.3);
    padding-left:12px;margin-top:auto;padding-top:16px;
  }

  .bottom-bar{
    display:flex;align-items:center;gap:12px;
    padding-top:20px;border-top:1px solid rgba(201,168,76,0.15);
  }
  .bottom-bar span{font-size:11px;font-weight:700;letter-spacing:0.08em;color:rgba(255,255,255,0.7);}
  .bottom-bar small{font-size:9px;color:rgba(255,255,255,0.35);letter-spacing:0.1em;}

  /* DIVIDER */
  .divider{width:1px;background:rgba(201,168,76,0.18);height:720px;}

  /* RIGHT PANEL */
  .right{
    flex:1;height:720px;background:${NAVY2};
    display:flex;align-items:center;justify-content:center;
    padding:36px 36px 36px 32px;
    position:relative;overflow:hidden;
  }
  .right::before{
    content:'';position:absolute;inset:0;
    background:radial-gradient(ellipse at 80% 20%, rgba(43,138,110,0.06) 0%, transparent 55%);
    pointer-events:none;
  }

  .browser-wrap{position:relative;z-index:1;width:100%;max-width:672px;}

  .browser-chrome{
    background:#1e2035;border-radius:8px 8px 0 0;
    padding:10px 14px;display:flex;align-items:center;gap:8px;
    border-bottom:1px solid rgba(255,255,255,0.06);
  }
  .dots{display:flex;gap:5px;}
  .dot{width:10px;height:10px;border-radius:50%;}
  .dot.r{background:#FF5F57;}
  .dot.y{background:#FFBD2E;}
  .dot.g{background:#28CA41;}
  .url-bar{
    flex:1;background:rgba(255,255,255,0.06);border-radius:4px;
    padding:4px 10px;font-size:10.5px;color:rgba(255,255,255,0.45);
    font-family:'Barlow Condensed',sans-serif;letter-spacing:0.03em;
    white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
  }

  .browser-screen{
    width:100%;aspect-ratio:16/9;
    background:#0a0f2e;overflow:hidden;
    border-radius:0 0 6px 6px;
    border:1px solid rgba(255,255,255,0.06);border-top:none;
  }
  .browser-screen img{width:100%;height:100%;object-fit:cover;object-position:top left;display:block;}

  .slide-counter{
    position:absolute;bottom:16px;right:20px;
    font-size:9px;color:rgba(255,255,255,0.2);letter-spacing:0.12em;
  }

  /* close line for slide 06 */
  .close-line{
    font-family:'Barlow Condensed',sans-serif;
    font-size:18px;font-weight:800;letter-spacing:0.06em;text-transform:uppercase;
    color:${GOLD};margin-top:16px;line-height:1.2;
  }
</style>
</head>
<body>
<div class="slide">
  <!-- LEFT -->
  <div class="left">
    <div class="grid-overlay"></div>
    <div class="left-content">
      <div>
        <div class="slide-num">SLIDE ${slide.num} · 06</div>
        <div class="slide-label">${slide.label}</div>
        <h1>${slide.title.replace("Readiness OS:", "Readiness OS:<br>")}</h1>
        <div class="gold-rule"></div>
        <ul>${bulletsHtml}</ul>
        ${slide.num === "06" ? `<div class="close-line">The response is ready<br>before the trigger fires.</div>` : ""}
      </div>
      <div class="quote">${slide.quote}</div>
    </div>
    <div class="bottom-bar">
      ${VM_SEAL}
      <div>
        <span>VaughnMartin</span><br>
        <small>READINESS OS</small>
      </div>
    </div>
  </div>

  <!-- DIVIDER -->
  <div class="divider"></div>

  <!-- RIGHT -->
  <div class="right">
    <div class="browser-wrap">
      <div class="browser-chrome">
        <div class="dots">
          <div class="dot r"></div>
          <div class="dot y"></div>
          <div class="dot g"></div>
        </div>
        <div class="url-bar">${slide.pageLabel}</div>
      </div>
      <div class="browser-screen">
        <img src="${shotB64}" alt="Product screenshot" />
      </div>
    </div>
  </div>

  <div class="slide-counter">${slide.num} / 06</div>
</div>
</body>
</html>`;
}

// ─── Route ────────────────────────────────────────────────────────────────────
export function registerPitchDeckV2Route(app: Express): void {
  /**
   * GET /api/pitch-v2-slide.png?n=1  (1–6)
   * Renders one slide of the 6-slide product-screenshot pitch deck.
   */
  app.get("/api/pitch-v2-slide.png", async (req: any, res) => {
    const n = parseInt((req.query.n as string) || "1", 10);
    if (isNaN(n) || n < 1 || n > 6) {
      return res.status(400).json({ error: "n must be 1–6" });
    }

    const slide = SLIDES[n - 1];
    let browser;
    try {
      // Step 1: screenshot the product page
      const shotB64 = await getPageShot(slide.pageUrl);

      // Step 2: build slide HTML with embedded screenshot
      const html = buildSlideHtml(slide, shotB64);

      // Step 3: render the slide HTML → PNG
      browser = await chromium.launch({
        executablePath: CHROMIUM,
        args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
      });
      const page = await browser.newPage();
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.setContent(html, { waitUntil: "networkidle" });
      await page.waitForTimeout(1200);

      const buffer = await page.screenshot({
        type: "png",
        clip: { x: 0, y: 0, width: 1280, height: 720 },
      });

      const labels = ["The-Problem","The-Product","How-It-Works","Proof","Business-Case","Ask-Close"];
      res.setHeader("Content-Type", "image/png");
      res.setHeader("Content-Disposition", `attachment; filename="VM-PitchV2-${String(n).padStart(2,"0")}-${labels[n-1]}.png"`);
      res.setHeader("Cache-Control", "public, max-age=3600");
      res.send(buffer);
    } catch (err: any) {
      console.error("[PitchDeckV2] Failed:", err?.message);
      res.status(500).json({ error: "Slide render failed", detail: err?.message });
    } finally {
      if (browser) await browser.close();
    }
  });

  /**
   * GET /api/pitch-v2-clear-cache
   * Clears the page screenshot cache (force re-screenshot on next request).
   */
  app.get("/api/pitch-v2-clear-cache", (_req, res) => {
    screenshotCache.clear();
    res.json({ ok: true, message: "Screenshot cache cleared" });
  });
}
