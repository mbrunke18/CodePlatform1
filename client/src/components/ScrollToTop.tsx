import { useEffect, useCallback, useRef } from "react";
import { useLocation } from "wouter";

export function scrollToTop() {
  requestAnimationFrame(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    
    document.querySelectorAll('[data-scroll-container], main, .overflow-auto, .overflow-y-auto, .min-h-screen').forEach(el => {
      if (el instanceof HTMLElement) {
        el.scrollTop = 0;
      }
    });
    
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    const root = document.getElementById('root');
    if (root) root.scrollTop = 0;
  });
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
