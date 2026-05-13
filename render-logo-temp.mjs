import { chromium } from 'playwright';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const svgPath = resolve('attached_assets/vaughnmartin-profile-logo-300.svg');
const svgContent = readFileSync(svgPath, 'utf8');

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
* { margin: 0; padding: 0; }
html, body { width: 300px; height: 300px; background: #0A0F2E; overflow: hidden; }
svg { display: block; }
</style>
</head>
<body>${svgContent}</body>
</html>`;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 300, height: 300 });
await page.setContent(html, { waitUntil: 'load' });
await page.waitForTimeout(600);
await page.screenshot({
  path: 'attached_assets/vaughnmartin-profile-logo-300.png',
  clip: { x: 0, y: 0, width: 300, height: 300 }
});
await browser.close();
console.log('done');
