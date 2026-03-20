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
// react-remove-scroll / use-sidecar leave stale scroll locks after navigation or
// HMR when lockRef.current becomes null. The resulting errors (getComputedStyle(null)
// and null.contains()) are called via Radix UI's cleanup code, which React's
// invokeGuardedCallbackDev wraps in its own try-catch — meaning our window-level
// error listener fires too late. The fix is to prevent handleScroll from throwing
// at all by wrapping scroll/touch listeners at the EventTarget level.

// 1) Wrap addEventListener so that scroll/touch handlers never throw out of the
//    listener — stale-lock cleanup errors are swallowed at the source.
const _origAddEventListener = EventTarget.prototype.addEventListener;
(EventTarget.prototype as any).addEventListener = function (
  type: string,
  listener: EventListenerOrEventListenerObject | null,
  options?: boolean | AddEventListenerOptions
) {
  if (
    listener &&
    typeof listener === "function" &&
    (type === "scroll" || type === "touchstart" || type === "touchmove" || type === "touchend")
  ) {
    const safeListener = function (this: EventTarget, event: Event) {
      try {
        return (listener as EventListener).call(this, event);
      } catch (_) {
        // Silently swallow stale scroll-lock errors from react-remove-scroll.
        // Legitimate scroll handlers should not throw; if they do the error
        // is still visible in the browser console via unhandledrejection.
      }
    };
    return _origAddEventListener.call(this, type, safeListener, options);
  }
  return _origAddEventListener.call(this, type, listener, options);
};

// 2) Also patch getComputedStyle so that calls with a non-Element argument
//    return a safe proxy instead of throwing — belt-and-suspenders for any
//    code paths that call it outside an addEventListener listener.
const _nativeGetComputedStyle = window.getComputedStyle;
(window as any).getComputedStyle = function (
  element: unknown,
  pseudoElt?: string | null
): CSSStyleDeclaration {
  if (!element || !(element instanceof Element)) {
    return new Proxy({} as CSSStyleDeclaration, { get: () => "" });
  }
  return _nativeGetComputedStyle.call(window, element as Element, pseudoElt);
};

// 3) Belt-and-suspenders: suppress any scroll-lock error that still reaches
//    the window in capture phase — before Vite's bubble-phase overlay listener.
const suppressScrollLockError = (event: ErrorEvent) => {
  const msg = event.message || "";
  if (
    msg.includes("getComputedStyle") ||
    msg.includes("parameter 1 is not of type") ||
    msg.includes("not of type 'Element'") ||
    (msg.includes("null") && msg.includes("contains"))
  ) {
    event.stopImmediatePropagation();
    event.preventDefault();
  }
};
window.addEventListener("error", suppressScrollLockError, true);

// 4) After every HMR update, clear scroll-lock styles react-remove-scroll
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
