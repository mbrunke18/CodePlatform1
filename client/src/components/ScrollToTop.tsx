import { useEffect, useCallback } from "react";
import { useLocation } from "wouter";

export function scrollToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  
  document.querySelectorAll('[data-scroll-container], main, .overflow-auto, .overflow-y-auto').forEach(el => {
    if (el instanceof HTMLElement) {
      el.scrollTop = 0;
    }
  });
  
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

export function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    scrollToTop();
  }, [location]);

  return null;
}

export function useScrollToTop() {
  return useCallback(() => {
    scrollToTop();
  }, []);
}
