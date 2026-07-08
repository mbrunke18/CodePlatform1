import { useEffect, useState, useCallback } from "react";
import CinematicHero from "@/components/marketing/CinematicHero";

const STORAGE_KEY = "vm_seen_brief";
const MAX_VISITS = 3;

const NAVY = "#0A0F2E";
const OFF = "#F8F7F4";

type Props = { onClose: () => void };

function AdContent({ onClose }: Props) {
  return (
    <div
      className="fv-wrap"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 20000,
        background: NAVY,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        overflowY: "auto",
      }}
    >
      <button
        onClick={onClose}
        data-testid="button-skip-first-visit-intro"
        style={{
          position: "absolute",
          top: 20,
          right: 22,
          zIndex: 20,
          background: "none",
          border: "none",
          padding: 0,
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "4px",
          textTransform: "uppercase",
          color: "rgba(248,247,244,0.55)",
          cursor: "pointer",
          transition: "color 0.25s",
        }}
      >
        Skip ×
      </button>
      <div style={{ width: "100%", maxWidth: 1100, border: `1px solid rgba(201,168,76,0.22)` }}>
        <CinematicHero onSkip={onClose} />
      </div>
    </div>
  );
}

export function FirstVisitAdModal() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const forceShow = new URLSearchParams(window.location.search).get("cinematic") === "1";
    const visits = parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);
    if (forceShow || visits < MAX_VISITS) {
      const t = setTimeout(() => setVisible(true), 3500);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    if (visible) setMounted(true);
  }, [visible]);

  const handleClose = useCallback(() => {
    const current = parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);
    localStorage.setItem(STORAGE_KEY, String(current + 1));
    setVisible(false);
    setTimeout(() => setMounted(false), 800);
  }, []);

  if (!mounted) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 19999,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.7s ease",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <AdContent onClose={handleClose} />
    </div>
  );
}
