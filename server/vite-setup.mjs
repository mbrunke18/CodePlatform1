// Native ESM module — NOT processed by tsx.
// tsx's load hook zeroes out package-specifier imports ("vite") by resolving
// them to index.cjs via the "require" condition, giving an empty namespace.
// Fix: load vite's ESM entry by direct file:// URL, bypassing tsx's resolver.
const viteUrl = new URL('../node_modules/vite/dist/node/index.js', import.meta.url);
const reactUrl = new URL('../node_modules/@vitejs/plugin-react/dist/index.js', import.meta.url);

const viteModule = await import(viteUrl.href);
const reactModule = await import(reactUrl.href);

export const createServer = viteModule.createServer;
export const reactPlugin = reactModule.default ?? reactModule;
