import type { Express } from "express";
import { chromium } from "playwright-core";
import { readFileSync } from "fs";
import { resolve } from "path";

const CHROMIUM = process.env.REPLIT_PLAYWRIGHT_CHROMIUM_EXECUTABLE ||
  "/nix/store/kcvsxrmgwp3ffz5jijyy7wn9fcsjl4hz-playwright-browsers-1.55.0-with-cjk/chromium-1187/chrome-linux/chrome";

const TOTAL_SLIDES = 11;

const SLIDE_TITLES = [
  "01-Opening-Question",
  "02-The-Reality",
  "03-The-Problem-Is-Here",
  "04-The-Solution",
  "05-Why-VaughnMartin",
  "06-Execution-Chain",
  "07-ROI",
  "08-Proof-Points",
  "09-The-Opportunity",
  "10-The-Ask",
  "11-Close",
];

function getPitchDeckHtml(): string {
  const filePath = resolve(process.cwd(), "attached_assets/VaughnMartin-Investor-Pitch-Deck.html");
  return readFileSync(filePath, "utf-8");
}

export function registerPitchDeckRoute(app: Express): void {
  /**
   * GET /api/pitch-slide.png?n=1   (1 – 11)
   * Renders one pitch deck slide as a 1280×720 PNG.
   */
  app.get("/api/pitch-slide.png", async (req: any, res) => {
    const n = parseInt((req.query.n as string) || "1", 10);
    if (isNaN(n) || n < 1 || n > TOTAL_SLIDES) {
      return res.status(400).json({ error: `n must be 1–${TOTAL_SLIDES}` });
    }

    let browser;
    try {
      browser = await chromium.launch({
        executablePath: CHROMIUM,
        args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
      });

      const page = await browser.newPage();
      await page.setViewportSize({ width: 1280, height: 720 });

      const html = getPitchDeckHtml();
      await page.setContent(html, { waitUntil: "networkidle" });
      await page.waitForTimeout(1800);

      // Jump to the requested slide (0-indexed internally)
      await page.evaluate((idx: number) => {
        const slides = document.querySelectorAll<HTMLElement>(".slide");
        slides.forEach(s => s.classList.remove("active"));
        if (slides[idx]) slides[idx].classList.add("active");

        // Update progress bar
        const fill = document.getElementById("progress");
        if (fill) fill.style.width = ((idx + 1) / slides.length * 100) + "%";

        // Hide nav chrome for clean screenshot
        const hint = document.querySelector<HTMLElement>(".fullscreen-hint");
        if (hint) hint.style.display = "none";
        const prev = document.getElementById("prev-btn");
        if (prev) prev.style.display = "none";
        const next = document.getElementById("next-btn");
        if (next) next.style.display = "none";
        const bar = document.querySelector<HTMLElement>(".progress-bar");
        if (bar) bar.style.display = "none";
      }, n - 1);

      await page.waitForTimeout(300);

      const buffer = await page.screenshot({
        type: "png",
        clip: { x: 0, y: 0, width: 1280, height: 720 },
      });

      const title = SLIDE_TITLES[n - 1] || `Slide-${String(n).padStart(2, "0")}`;
      res.setHeader("Content-Type", "image/png");
      res.setHeader("Content-Disposition", `attachment; filename="VaughnMartin-Pitch-${title}.png"`);
      res.setHeader("Cache-Control", "public, max-age=300");
      res.send(buffer);
    } catch (err: any) {
      console.error("[PitchDeck] Screenshot failed:", err?.message);
      res.status(500).json({ error: "Slide render failed", detail: err?.message });
    } finally {
      if (browser) await browser.close();
    }
  });
}
