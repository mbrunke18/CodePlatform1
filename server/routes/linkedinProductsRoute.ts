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
    tagline: "The operating model Fortune 1000 enterprises need to act in 12 minutes",
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
    tagline: "170 pre-staged Readiness Protocols across 3 strategic domains",
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
    tagline: "221 strategic triggers monitored in real time across 8 data sources",
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
    tagline: "90-day validation partnership — first Fortune 1000 cohort forming now",
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

// ─── Product icon HTML builder (600 × 600 px) ────────────────────────────────
function buildProductIconHtml(product: LinkedInProduct): string {
  const isEven = product.id % 2 === 0;
  const bg = isEven ? "#0B1535" : "#080d24";
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,600&family=Barlow+Condensed:wght@400;600;700;800;900&display=swap" rel="stylesheet"/>
<style>
  *{margin:0;padding:0;box-sizing:border-box;}
  html,body{width:600px;height:600px;overflow:hidden;font-family:'Barlow Condensed',sans-serif;}
  .card{
    width:600px;height:600px;
    background:linear-gradient(145deg,${bg} 0%,#0d1c4a 100%);
    position:relative;overflow:hidden;
    display:flex;flex-direction:column;
  }
  /* Gold grid texture */
  .grid{
    position:absolute;inset:0;
    background-image:
      linear-gradient(rgba(201,168,76,0.04) 1px,transparent 1px),
      linear-gradient(90deg,rgba(201,168,76,0.04) 1px,transparent 1px);
    background-size:50px 50px;
  }
  /* Top accent bar */
  .topbar{
    position:absolute;top:0;left:0;right:0;height:4px;
    background:linear-gradient(90deg,${product.accentColor},rgba(201,168,76,0.2));
  }
  /* Side ambient glow */
  .glow{
    position:absolute;top:-60px;right:-60px;
    width:300px;height:300px;border-radius:50%;
    background:radial-gradient(circle,rgba(201,168,76,0.07) 0%,transparent 70%);
  }
  /* Product number badge */
  .badge{
    position:absolute;top:20px;right:20px;
    font-size:11px;font-weight:800;letter-spacing:.25em;
    color:rgba(201,168,76,0.35);
  }
  /* Content */
  .content{
    position:relative;z-index:2;
    flex:1;display:flex;flex-direction:column;
    justify-content:center;align-items:center;
    padding:0 48px;text-align:center;
  }
  .icon-wrap{width:90px;height:90px;margin-bottom:28px;}
  .product-num{
    font-size:10px;font-weight:800;letter-spacing:.35em;
    text-transform:uppercase;color:rgba(201,168,76,0.45);
    margin-bottom:12px;
  }
  .name{
    font-size:28px;font-weight:800;line-height:1.1;
    color:#ffffff;margin-bottom:16px;letter-spacing:.02em;
    text-transform:uppercase;
  }
  .rule{width:40px;height:1.5px;background:${product.accentColor};margin:0 auto 16px;}
  .tagline{
    font-size:14px;font-weight:500;letter-spacing:.05em;
    color:rgba(255,255,255,0.5);line-height:1.5;
  }
  /* Bottom brand strip */
  .bottom{
    position:relative;z-index:2;
    height:60px;
    border-top:1px solid rgba(201,168,76,0.12);
    display:flex;align-items:center;justify-content:space-between;
    padding:0 28px;
    background:rgba(0,0,0,0.2);
  }
  .brand-left{display:flex;align-items:center;gap:10px;}
  .seal{width:28px;height:28px;}
  .bname{font-size:13px;font-weight:700;letter-spacing:.1em;color:#ffffff;}
  .bprod{font-size:9px;font-weight:600;letter-spacing:.3em;color:#C9A84C;text-transform:uppercase;}
  .product-id{
    font-size:10px;font-weight:800;letter-spacing:.2em;
    color:rgba(201,168,76,0.35);text-transform:uppercase;
  }
</style>
</head>
<body>
<div class="card">
  <div class="grid"></div>
  <div class="topbar"></div>
  <div class="glow"></div>

  <div class="content">
    <div class="icon-wrap">${product.iconSvg}</div>
    <div class="product-num">Product ${String(product.id).padStart(2,"0")} of 10</div>
    <div class="name">${product.name}</div>
    <div class="rule"></div>
    <div class="tagline">${product.tagline}</div>
  </div>

  <div class="bottom">
    <div class="brand-left">
      <svg class="seal" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="12.5" stroke="#C9A84C" stroke-width="1"/>
        <circle cx="14" cy="14" r="9" stroke="rgba(201,168,76,0.3)" stroke-width="0.75"/>
        <text x="14" y="17" text-anchor="middle"
          font-family="Barlow Condensed,sans-serif" font-size="6" font-weight="800" fill="#C9A84C">VM</text>
      </svg>
      <div>
        <div class="bname">VaughnMartin</div>
        <div class="bprod">Readiness OS</div>
      </div>
    </div>
    <div class="product-id">LinkedIn Product</div>
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
    tagline: "The operating model layer above the Fortune 1000's AI stack",
    description: "Readiness OS is the coordination infrastructure Fortune 1000 enterprises use to replace 30-day mobilization cycles with 12-minute execution. 170 pre-staged Readiness Protocols activate the moment a strategic trigger fires — with executive authority preserved at every step. The response is ready before the trigger fires.",
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
        description: "Every Fortune 1000 has invested in Microsoft's AI stack. Readiness OS is the operating model layer above it — not a replacement, the orchestrator.",
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
        description: "221 strategic triggers mapped and monitored across Growth & Positioning, Risk & Resilience, and Transformation domains. Real-time scoring before any executive is notified.",
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
    description: "The 12-Minute Execution capability is the core of Readiness OS. When a strategic trigger is detected, a pre-staged Readiness Protocol activates, tasks are assigned, stakeholders are notified, and the executive authorization chain begins — all within 12 minutes. The old model took 30 days just to mobilize.",
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
        description: "30-day mobilization cycles vs. 12-minute execution. In a Fortune 1000, that gap is the difference between controlling a narrative and reacting to one.",
      },
    ],
    cta: { label: "Start the 12-Minute Test Drive", url: "https://vaughnmartin.com/12-minute-experience" },
  },
  {
    id: 4,
    name: "Protocol Library",
    tagline: "170 pre-staged Readiness Protocols across 3 strategic domains",
    description: "170 cross-industry Readiness Protocols organized across Growth & Positioning, Risk & Resilience, and Transformation. Each protocol includes pre-staged tasks, stakeholder assignments, budget allocations, and document staging — fully ready to activate the moment a trigger fires. Plus 12 compound protocols for multi-domain threats.",
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
        description: "Sector-specific packs layered on top of the 170 core protocols for Healthcare, Financial Services, Manufacturing, Retail, Energy, and Technology.",
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
    tagline: "221 strategic triggers monitored in real time — before they become crises",
    description: "VaughnMartin's Signal Detection Engine continuously monitors 221 strategic trigger patterns across 8 real-time data sources. Incoming signals are scored against keyword density, confidence thresholds, and trigger alignment. When a signal qualifies, executives are notified in minutes — not weeks.",
    highlights: [
      {
        title: "221 Trigger Patterns",
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
    tagline: "90-day validation partnership — first Fortune 1000 cohort forming now",
    description: "The Founding Partner Program is VaughnMartin's selective pre-launch partnership for Fortune 1000 enterprises ready to validate Readiness OS against their actual strategic landscape. A 90-day structured engagement with dedicated implementation support, direct roadmap influence, and Founding Partner pricing.",
    highlights: [
      {
        title: "Selective by Design",
        description: "Fortune 1000 enterprises only. Each partner is assessed for strategic fit, trigger landscape alignment, and readiness infrastructure compatibility.",
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
