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

// Suppress known third-party scroll-lock errors (react-remove-scroll / Radix UI)
// that fire when a dialog/sheet/popover closes while a scroll event is still in-flight.
// Uses capture phase so this runs before Vite's dev overlay listener.
const suppressScrollLockError = (event: ErrorEvent) => {
  const msg = event.message || '';
  if (
    msg.includes('getComputedStyle') ||
    msg.includes('parameter 1 is not of type') ||
    msg.includes("not of type 'Element'")
  ) {
    event.stopImmediatePropagation();
    event.preventDefault();
  }
};
window.addEventListener('error', suppressScrollLockError, true);

// Initialize Google Analytics if measurement ID is configured
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
if (GA_MEASUREMENT_ID) {
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  script.onload = () => {
    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]) {
      (window as any).dataLayer.push(args);
    }
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID);
    (window as any).gtag = gtag;
  };
}

createRoot(document.getElementById("root")!).render(<App />);
