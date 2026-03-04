/**
 * Smart build script for VaughnMartin Execution OS
 *
 * Strategy: dist/ is committed to the repo and kept current.
 * During deployment, Replit's build step runs this script.
 * If dist/index.js already exists, we skip the bundle entirely
 * (completes in ~100ms — no timeout risk).
 *
 * To force a full rebuild locally: delete dist/ then run npm run build.
 */

const { existsSync } = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const distServer = path.join(__dirname, '..', 'dist', 'index.js');
const distClient = path.join(__dirname, '..', 'dist', 'public', 'index.html');

if (existsSync(distServer) && existsSync(distClient)) {
  console.log('✅ Pre-built dist/ found — skipping bundle.');
  console.log('   Server:', distServer);
  console.log('   Client:', distClient);
  console.log('   To force a full rebuild: delete dist/ then run npm run build');
  process.exit(0);
}

console.log('🔨 dist/ not found — running full build...');
execSync(
  'vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --external:vite --external:@vitejs/plugin-react --external:../vite.config',
  { stdio: 'inherit', cwd: path.join(__dirname, '..') }
);
console.log('✅ Build complete.');
