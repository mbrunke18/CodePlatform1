import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";
import App from "./App";
import "./index.css";

if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    tracesSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    integrations: [
      Sentry.replayIntegration({ maskAllText: false, blockAllMedia: false }),
    ],
  });
}

// ─── Scroll-lock safety patches ───────────────────────────────────────────────
// react-remove-scroll / use-sidecar (bundled via @radix-ui/react-scroll-area)
// can leave stale scroll locks after HMR reloads. These three patches prevent
// the resulting TypeError from reaching either the error boundary or Vite's
// dev overlay, and ensure the page remains scrollable.

// 1) Patch getComputedStyle so it never throws when called with a non-Element
//    (happens when lockRef.current becomes window after an HMR cycle).
const _nativeGetComputedStyle = window.getComputedStyle;
(window as any).getComputedStyle = function (
  element: unknown,
  pseudoElt?: string | null
): CSSStyleDeclaration {
  if (!element || !(element instanceof Element)) {
    return { direction: "ltr", overflow: "auto" } as unknown as CSSStyleDeclaration;
  }
  return _nativeGetComputedStyle.call(window, element as Element, pseudoElt);
};

// 2) Ensure window.contains exists so the subsequent endTarget.contains() call
//    inside use-sidecar's handleScroll doesn't throw.
if (typeof (window as any).contains !== "function") {
  (window as any).contains = () => false;
}

// 3) Suppress residual ErrorEvent propagation (belt-and-suspenders; runs before
//    Vite's dev overlay because we're in capture phase).
const suppressScrollLockError = (event: ErrorEvent) => {
  const msg = event.message || "";
  if (
    msg.includes("getComputedStyle") ||
    msg.includes("parameter 1 is not of type") ||
    msg.includes("not of type 'Element'")
  ) {
    event.stopImmediatePropagation();
    event.preventDefault();
  }
};
window.addEventListener("error", suppressScrollLockError, true);

// 4) After every HMR update, clear any scroll-lock styles that react-remove-scroll
//    left on <body> / <html>. This restores scroll-ability between hot reloads.
function clearStaleScrollLocks() {
  try {
    const targets = [document.body, document.documentElement];
    targets.forEach((el) => {
      if (!el) return;
      el.removeAttribute("data-scroll-locked");
      el.style.overflow = "";
      el.style.paddingRight = "";
    });
  } catch (_) {}
}

if (import.meta.hot) {
  import.meta.hot.on("vite:afterUpdate", clearStaleScrollLocks);
  import.meta.hot.on("vite:error", clearStaleScrollLocks);
}
// ─── End scroll-lock safety patches ──────────────────────────────────────────

// Initialize Google Analytics if measurement ID is configured
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
if (GA_MEASUREMENT_ID) {
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  script.onload = () => {
    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]) {
      (window as any).dataLayer.push(args);
    }
    gtag("js", new Date());
    gtag("config", GA_MEASUREMENT_ID);
    (window as any).gtag = gtag;
  };
}

createRoot(document.getElementById("root")!).render(<App />);
