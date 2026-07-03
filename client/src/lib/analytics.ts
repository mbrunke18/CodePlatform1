/**
 * Lightweight GA4 event instrumentation.
 *
 * Pushes structured events to window.dataLayer so they are picked up by the
 * GA4 tag already loaded on every page (see client/index.html + main.tsx).
 * Safe to call anywhere — no-ops if dataLayer isn't present (e.g. SSR, ad
 * blockers, or GA not yet initialized).
 */
export function trackEvent(eventName: string, params: Record<string, unknown> = {}) {
  try {
    if (typeof window !== "undefined") {
      const w = window as any;
      w.dataLayer = w.dataLayer || [];
      w.dataLayer.push({ event: eventName, ...params });
    }
  } catch (_) {
    // analytics must never break the UI
  }
}
