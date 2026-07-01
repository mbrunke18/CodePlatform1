import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "wouter";

if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

function resetScroll() {
  try {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  } catch (_) {
    window.scrollTo(0, 0);
  }
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  const root = document.getElementById("root");
  if (root) root.scrollTop = 0;

  try {
    [document.body, document.documentElement].forEach((el) => {
      el.removeAttribute("data-scroll-locked");
      el.style.overflow = "";
      el.style.paddingRight = "";
      el.style.position = "";
    });
  } catch (_) {}
}

export function ScrollToTop() {
  const [location] = useLocation();

  useLayoutEffect(() => {
    resetScroll();
  }, [location]);

  useEffect(() => {
    resetScroll();
    const t1 = setTimeout(resetScroll, 80);
    const t2 = setTimeout(resetScroll, 300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [location]);

  return null;
}

export function scrollToTop() {
  resetScroll();
  setTimeout(resetScroll, 80);
}

export function useScrollToTop() {
  return scrollToTop;
}
