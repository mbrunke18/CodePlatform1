import { useEffect, useCallback, useRef } from "react";
import { useLocation } from "wouter";

// Disable browser native scroll restoration — must happen once at module load
if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

function clearScrollLock() {
  try {
    [document.body, document.documentElement].forEach((el) => {
      if (!el) return;
      el.removeAttribute('data-scroll-locked');
      el.style.overflow = '';
      el.style.overflowX = '';
      el.style.overflowY = '';
      el.style.paddingRight = '';
      el.style.position = '';
    });
  } catch (_) {}
}

function resetAllScrollContainers() {
  clearScrollLock();
  try {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  } catch (_) {
    window.scrollTo(0, 0);
  }
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  const root = document.getElementById('root');
  if (root) root.scrollTop = 0;

  document.querySelectorAll('*').forEach(el => {
    if (el instanceof HTMLElement && el.scrollTop > 0) {
      el.scrollTop = 0;
    }
  });
}

export function scrollToTop() {
  resetAllScrollContainers();

  requestAnimationFrame(() => {
    resetAllScrollContainers();
  });

  // Staggered resets to catch both fast-cached and slower lazy-loaded pages
  const timers = [
    setTimeout(resetAllScrollContainers, 80),
    setTimeout(resetAllScrollContainers, 220),
    setTimeout(resetAllScrollContainers, 450),
    setTimeout(resetAllScrollContainers, 700),
    setTimeout(resetAllScrollContainers, 1100),
  ];

  return () => timers.forEach(clearTimeout);
}

export function ScrollToTop() {
  const [location] = useLocation();
  const prevLocation = useRef(location);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (prevLocation.current !== location) {
      prevLocation.current = location;
      if (cleanupRef.current) cleanupRef.current();
      cleanupRef.current = scrollToTop();
    }
  }, [location]);

  useEffect(() => {
    cleanupRef.current = scrollToTop();
    return () => {
      if (cleanupRef.current) cleanupRef.current();
    };
  }, []);

  return null;
}

export function useScrollToTop() {
  return useCallback(() => {
    scrollToTop();
  }, []);
}
