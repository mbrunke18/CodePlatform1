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
// react-remove-scroll / use-sidecar leave stale scroll locks after HMR reloads
// or navigation when lockRef.current becomes null. These patches prevent the
// resulting TypeError from reaching either the error boundary or Vite's overlay.

// 1) Patch getComputedStyle so that when it is called with a non-Element
//    (null, window, etc.) it returns a safe empty proxy instead of throwing.
//    Throwing inside React's Suspense/event cycle stalls lazy-loaded pages.
//    Any null.contains() that follows fires as a plain window error caught below.
const _nativeGetComputedStyle = window.getComputedStyle;
(window as any).getComputedStyle = function (
  element: unknown,
  pseudoElt?: string | null
): CSSStyleDeclaration {
  if (!element || !(element instanceof Element)) {
    // Return a safe proxy instead of throwing — throwing inside React's
    // event cycle (e.g. Radix DropdownMenu close) interrupts Suspense lazy
    // loads and stalls newly-visited pages. Any null.contains() that follows
    // will fire as a plain window error and be caught by suppressScrollLockError.
    return new Proxy({} as CSSStyleDeclaration, { get: () => "" });
  }
  return _nativeGetComputedStyle.call(window, element as Element, pseudoElt);
};

// 2) Suppress both the getComputedStyle error AND the fallback null.contains
//    error in the rare case the patched code path is skipped.
//    Runs in capture phase — before Vite's bubble-phase overlay listener.
const suppressScrollLockError = (event: ErrorEvent) => {
  const msg = event.message || "";
  if (
    msg.includes("getComputedStyle") ||
    msg.includes("parameter 1 is not of type") ||
    msg.includes("not of type 'Element'") ||
    (msg.includes("null") && msg.includes("contains")) ||
    (msg.includes("null") && msg.includes("reading 'contains'"))
  ) {
    event.stopImmediatePropagation();
    event.preventDefault();
  }
};
window.addEventListener("error", suppressScrollLockError, true);

// 3) After every HMR update, clear scroll-lock styles react-remove-scroll
//    left on <body> / <html> so the page stays scrollable between hot reloads.
function clearStaleScrollLocks() {
  try {
    [document.body, document.documentElement].forEach((el) => {
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
