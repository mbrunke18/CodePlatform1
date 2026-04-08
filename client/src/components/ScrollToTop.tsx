import { useEffect, useCallback, useRef } from "react";
import { useLocation } from "wouter";

function resetAllScrollContainers() {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  const root = document.getElementById('root');
  if (root) root.scrollTop = 0;

  document.querySelectorAll(
    '[data-scroll-main], [data-scroll-container], main, .overflow-auto, .overflow-y-auto'
  ).forEach(el => {
    if (el instanceof HTMLElement) {
      el.scrollTop = 0;
    }
  });
}

export function scrollToTop() {
  resetAllScrollContainers();

  requestAnimationFrame(() => {
    resetAllScrollContainers();
  });

  // Catch pages that scroll in their own useEffect (fires ~after mount)
  const t1 = setTimeout(resetAllScrollContainers, 80);
  const t2 = setTimeout(resetAllScrollContainers, 200);
  const t3 = setTimeout(resetAllScrollContainers, 400);

  // Return cleanup so callers can cancel if needed
  return () => {
    clearTimeout(t1);
    clearTimeout(t2);
    clearTimeout(t3);
  };
}

export function ScrollToTop() {
  const [location] = useLocation();
  const prevLocation = useRef(location);

  useEffect(() => {
    if (prevLocation.current !== location) {
      prevLocation.current = location;
      const cleanup = scrollToTop();
      return cleanup;
    }
  }, [location]);

  useEffect(() => {
    scrollToTop();
  }, []);

  return null;
}

export function useScrollToTop() {
  return useCallback(() => {
    scrollToTop();
  }, []);
}
