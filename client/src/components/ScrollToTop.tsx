import { useEffect, useCallback, useRef } from "react";
import { useLocation } from "wouter";

export function scrollToTop() {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  const root = document.getElementById('root');
  if (root) root.scrollTop = 0;

  document.querySelectorAll('[data-scroll-container], main, .overflow-auto, .overflow-y-auto, .min-h-screen').forEach(el => {
    if (el instanceof HTMLElement) {
      el.scrollTop = 0;
    }
  });

  requestAnimationFrame(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  });

  setTimeout(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, 50);

  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 150);
}

export function ScrollToTop() {
  const [location] = useLocation();
  const prevLocation = useRef(location);

  useEffect(() => {
    if (prevLocation.current !== location) {
      scrollToTop();
      prevLocation.current = location;
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
