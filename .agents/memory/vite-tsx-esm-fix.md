---
name: Vite dev server initialization in tsx ESM context
description: Why import("vite") gives an empty namespace in tsx, and how to fix it
---

## Rule
Never use package-specifier imports (`"vite"`, `"@vitejs/plugin-react"`) in any file loaded through tsx's module hook to get vite's `createServer`. Use direct `file://` URLs to the ESM entry instead.

## Why
tsx v4's ESM loader hook intercepts ALL module loads, including those from `.mjs` shims. When tsx resolves a package specifier like `"vite"`, it ends up loading `index.cjs` (the CJS build) instead of `dist/node/index.js` (the ESM build). The CJS build assigns `createServer` inside a `forEach` loop — which is not statically detectable — so the synthesized ESM namespace for the CJS module has zero named exports. `import * as viteNs from "vite"` gives `viteNs.keys === []` and `typeof viteNs.createServer === "undefined"`.

Neither `import("vite")` from TypeScript, nor `createRequire(import.meta.url)("vite")` from TypeScript, nor `import * as ns from "vite"` from a `.mjs` shim avoids tsx's intercept.

## How to apply
In `server/vite-setup.mjs`, use explicit file:// URLs:
```javascript
const viteUrl = new URL('../node_modules/vite/dist/node/index.js', import.meta.url);
const reactUrl = new URL('../node_modules/@vitejs/plugin-react/dist/index.js', import.meta.url);
const viteModule = await import(viteUrl.href);
const reactModule = await import(reactUrl.href);
export const createServer = viteModule.createServer;
export const reactPlugin = reactModule.default ?? reactModule;
```
Then in `server/vite.ts`, do a dynamic import of the shim via its file URL and use `createServer` and `reactPlugin` from it.

The `.mjs` extension matters — tsx's transformer only processes `.ts`/`.tsx`/`.mts`/`.cts`, so `.mjs` shims are safe for bootstrapping the vite import chain. The `file://` URL dynamic imports bypass tsx's package specifier resolver entirely.
