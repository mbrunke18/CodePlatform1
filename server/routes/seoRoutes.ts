import type { Express } from "express";

const BASE_URL = "https://vaughnmartin.com";

const PUBLIC_PAGES: Array<{ path: string; priority: string; changefreq: string }> = [
  { path: "/",                         priority: "1.0", changefreq: "weekly" },
  { path: "/about",                    priority: "0.9", changefreq: "monthly" },
  { path: "/how-it-executes",          priority: "0.9", changefreq: "monthly" },
  { path: "/proof-story",              priority: "0.8", changefreq: "monthly" },
  { path: "/roi-calculator",           priority: "0.8", changefreq: "monthly" },
  { path: "/executive-brief",          priority: "0.8", changefreq: "monthly" },
  { path: "/12-minute-experience",     priority: "0.8", changefreq: "monthly" },
  { path: "/demo-hub",                 priority: "0.7", changefreq: "monthly" },
  { path: "/master-demo",              priority: "0.7", changefreq: "monthly" },
  { path: "/founding-partner",         priority: "0.8", changefreq: "monthly" },
  { path: "/partner-brief",            priority: "0.7", changefreq: "monthly" },
  { path: "/request-access",           priority: "0.8", changefreq: "monthly" },
  { path: "/investors",                priority: "0.8", changefreq: "monthly" },
  { path: "/investor-landing",         priority: "0.7", changefreq: "monthly" },
  { path: "/security-compliance",      priority: "0.7", changefreq: "monthly" },
  { path: "/technical-architecture",   priority: "0.6", changefreq: "monthly" },
  { path: "/platform-reality",         priority: "0.7", changefreq: "monthly" },
  { path: "/ms-project",               priority: "0.6", changefreq: "monthly" },
  { path: "/vs-consulting",            priority: "0.6", changefreq: "monthly" },
  { path: "/research",                 priority: "0.6", changefreq: "monthly" },
  { path: "/why-execution-os",         priority: "0.7", changefreq: "monthly" },
  { path: "/cost-of-inaction",         priority: "0.7", changefreq: "monthly" },
  { path: "/channel-partners",         priority: "0.6", changefreq: "monthly" },
  { path: "/pmo-onboarding",           priority: "0.5", changefreq: "monthly" },
  { path: "/getting-started",          priority: "0.5", changefreq: "monthly" },
  { path: "/sitemap",                  priority: "0.3", changefreq: "monthly" },
];

export function registerSeoRoutes(app: Express) {
  app.get("/sitemap.xml", (_req, res) => {
    const today = new Date().toISOString().split("T")[0];
    const urls = PUBLIC_PAGES.map(
      ({ path, priority, changefreq }) => `
  <url>
    <loc>${BASE_URL}${path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
    ).join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.send(xml);
  });

  app.get("/robots.txt", (_req, res) => {
    const txt = `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`;
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.send(txt);
  });
}
