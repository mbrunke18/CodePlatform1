import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { type Server } from "http";
import { nanoid } from "nanoid";
import pino from "pino";

const logger = pino({ name: "vite-service" });

const viteLogger = {
  info: (msg: string) => logger.info(msg),
  warn: (msg: string) => logger.warn(msg),
  warnOnce: (msg: string) => logger.warn(msg),
  error: (msg: string, _opts?: any) => logger.error(msg),
  clearScreen: (_type: string) => {},
  hasErrorLogged: (_error: Error) => false,
  hasWarned: false,
};

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const projectRoot = path.resolve(import.meta.dirname, "..");

  // Import via a native .mjs shim — tsx only transforms .ts/.tsx files, so
  // .mjs files go through Node's native ESM loader which correctly resolves
  // vite's ESM entry (dist/node/index.js) and exposes createServer.
  const setupUrl = new URL("./vite-setup.mjs", import.meta.url);
  const {
    createServer: createViteServer,
    reactPlugin: reactPluginExport,
  } = await import(/* @vite-ignore */ setupUrl.href) as {
    createServer: typeof import("vite").createServer;
    reactPlugin: any;
  };
  const reactPlugin = (reactPluginExport.default ?? reactPluginExport) as () => any;

  const inlineConfig = {
    plugins: [reactPlugin()],
    resolve: {
      alias: {
        "@": path.resolve(projectRoot, "client/src"),
        "@shared": path.resolve(projectRoot, "shared"),
        "@assets": path.resolve(projectRoot, "client/src/assets"),
      },
    },
    root: path.resolve(projectRoot, "client"),
    build: {
      outDir: path.resolve(projectRoot, "dist/public"),
      emptyOutDir: true,
    },
  };

  const vite = await createViteServer({
    ...inlineConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg: string, options?: any) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req: any, res: any, next: any) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path.resolve(projectRoot, "client", "index.html");
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  app.use(express.static("/app/dist/public"));
  app.use("*", (_req: any, res: any) => {
    res.sendFile("/app/dist/public/index.html");
  });
}
