import { useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";

const NAVY = "#0A0F2E";
const NAVY_MID = "#141B45";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const OFF = "#F8F7F4";
const MUTED = "#6B7280";
const RED = "#C0392B";

type SceneConfig = {
  id: string;
  duration: number;
  onEnter: () => void;
  onExit: () => void;
};

export default function ReadinessAd() {
  const [, setLocation] = useLocation();
  const currentSceneRef = useRef(-1);
  const sceneTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);
  const progressStartRef = useRef<number | null>(null);
  const elapsedRef = useRef(0);
  const prevElapsedRef = useRef(0);

  const TOTAL_DURATION = 8000 + 8000 + 9000 + 8000 + 9000 + 8000 + 10000;

  const show = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.classList.add("ad-show");
  }, []);

  const hideAll = useCallback((ids: string[]) => {
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.classList.remove("ad-show");
    });
  }, []);

  const SCENES: SceneConfig[] = [
    {
      id: "ad-scene-1",
      duration: 8000,
      onEnter: () => {
        setTimeout(() => show("ad-clock-num"), 200);
        setTimeout(() => show("ad-clock-lbl"), 800);
        setTimeout(() => show("ad-ci-1"), 1400);
        setTimeout(() => show("ad-ci-2"), 2000);
        setTimeout(() => show("ad-ci-3"), 2600);
        setTimeout(() => show("ad-ci-4"), 3200);
      },
      onExit: () => hideAll(["ad-clock-num","ad-clock-lbl","ad-ci-1","ad-ci-2","ad-ci-3","ad-ci-4"]),
    },
    {
      id: "ad-scene-2",
      duration: 8000,
      onEnter: () => {
        setTimeout(() => show("ad-t-eyebrow"), 200);
        setTimeout(() => show("ad-t-time"), 600);
        setTimeout(() => show("ad-ts-1"), 1200);
        setTimeout(() => show("ad-ts-2"), 1800);
        setTimeout(() => show("ad-ts-3"), 2400);
        setTimeout(() => show("ad-ts-4"), 3000);
        setTimeout(() => show("ad-t-q"), 4500);
      },
      onExit: () => hideAll(["ad-t-eyebrow","ad-t-time","ad-ts-1","ad-ts-2","ad-ts-3","ad-ts-4","ad-t-q"]),
    },
    {
      id: "ad-scene-3",
      duration: 9000,
      onEnter: () => {
        setTimeout(() => show("ad-q-header"), 200);
        setTimeout(() => show("ad-qr-1"), 800);
        setTimeout(() => show("ad-qr-2"), 1800);
        setTimeout(() => show("ad-qr-3"), 2800);
        setTimeout(() => show("ad-qr-4"), 3800);
      },
      onExit: () => hideAll(["ad-q-header","ad-qr-1","ad-qr-2","ad-qr-3","ad-qr-4"]),
    },
    {
      id: "ad-scene-4",
      duration: 8000,
      onEnter: () => {
        setTimeout(() => show("ad-a-eyebrow"), 200);
        setTimeout(() => show("ad-a-headline"), 500);
        setTimeout(() => show("ad-a-sub"), 1200);
        setTimeout(() => show("ad-sb-1"), 1800);
        setTimeout(() => show("ad-sb-2"), 2200);
        setTimeout(() => show("ad-sb-3"), 2600);
        setTimeout(() => show("ad-sb-4"), 3000);
      },
      onExit: () => hideAll(["ad-a-eyebrow","ad-a-headline","ad-a-sub","ad-sb-1","ad-sb-2","ad-sb-3","ad-sb-4"]),
    },
    {
      id: "ad-scene-5",
      duration: 9000,
      onEnter: () => {
        setTimeout(() => show("ad-hw-header"), 200);
        setTimeout(() => show("ad-fs-1"), 800);
        setTimeout(() => show("ad-fs-2"), 2000);
        setTimeout(() => show("ad-fs-3"), 3200);
        setTimeout(() => show("ad-fs-4"), 4400);
      },
      onExit: () => hideAll(["ad-hw-header","ad-fs-1","ad-fs-2","ad-fs-3","ad-fs-4"]),
    },
    {
      id: "ad-scene-6",
      duration: 8000,
      onEnter: () => {
        setTimeout(() => show("ad-m-eyebrow"), 200);
        setTimeout(() => show("ad-m-headline"), 600);
        setTimeout(() => show("ad-m-body"), 1400);
        setTimeout(() => show("ad-m-metric"), 2600);
      },
      onExit: () => hideAll(["ad-m-eyebrow","ad-m-headline","ad-m-body","ad-m-metric"]),
    },
    {
      id: "ad-scene-7",
      duration: 10000,
      onEnter: () => {
        setTimeout(() => show("ad-dr"), 300);
        setTimeout(() => show("ad-dt"), 700);
        setTimeout(() => show("ad-pi-1"), 2000);
        setTimeout(() => show("ad-pi-2"), 2400);
        setTimeout(() => show("ad-pi-3"), 2800);
        setTimeout(() => show("ad-pi-4"), 3200);
        setTimeout(() => show("ad-du"), 4000);
        setTimeout(() => show("ad-db"), 4600);
        setTimeout(() => show("ad-replay-btn"), 6000);
      },
      onExit: () => {
        hideAll(["ad-dr","ad-dt","ad-pi-1","ad-pi-2","ad-pi-3","ad-pi-4","ad-du","ad-db"]);
        const btn = document.getElementById("ad-replay-btn");
        if (btn) btn.classList.remove("ad-show");
      },
    },
  ];

  const updateProgress = useCallback(() => {
    if (!progressStartRef.current) return;
    const now = Date.now();
    elapsedRef.current = prevElapsedRef.current + (now - progressStartRef.current);
    const pct = Math.min(100, (elapsedRef.current / TOTAL_DURATION) * 100);
    const bar = document.getElementById("ad-progress");
    if (bar) bar.style.width = pct + "%";
    if (elapsedRef.current < TOTAL_DURATION) {
      rafRef.current = requestAnimationFrame(updateProgress);
    }
  }, [TOTAL_DURATION]);

  const showScene = useCallback((index: number) => {
    if (currentSceneRef.current >= 0 && currentSceneRef.current < SCENES.length) {
      const prev = SCENES[currentSceneRef.current];
      const prevEl = document.getElementById(prev.id);
      if (prevEl) prevEl.classList.remove("ad-active");
      prev.onExit();
    }

    currentSceneRef.current = index;

    if (index >= SCENES.length) return;

    const scene = SCENES[index];
    const sceneEl = document.getElementById(scene.id);
    if (sceneEl) sceneEl.classList.add("ad-active");
    scene.onEnter();

    sceneTimerRef.current = setTimeout(() => showScene(index + 1), scene.duration);
  }, []);

  const startAd = useCallback(() => {
    if (sceneTimerRef.current) clearTimeout(sceneTimerRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    SCENES.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) el.classList.remove("ad-active");
      s.onExit();
    });
    const replayBtn = document.getElementById("ad-replay-btn");
    if (replayBtn) replayBtn.classList.remove("ad-show");

    elapsedRef.current = 0;
    prevElapsedRef.current = 0;
    const bar = document.getElementById("ad-progress");
    if (bar) bar.style.width = "0%";
    currentSceneRef.current = -1;

    setTimeout(() => {
      progressStartRef.current = Date.now();
      rafRef.current = requestAnimationFrame(updateProgress);
      showScene(0);
    }, 100);
  }, [showScene, updateProgress]);

  useEffect(() => {
    startAd();
    return () => {
      if (sceneTimerRef.current) clearTimeout(sceneTimerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [startAd]);

  return (
    <>
      <style>{`
        .ad-wrap {
          background: ${NAVY};
          color: ${OFF};
          font-family: 'Barlow', sans-serif;
          overflow: hidden;
          width: 100vw;
          height: 100vh;
          position: fixed;
          inset: 0;
          z-index: 0;
        }

        .ad-grid-bg {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
          z-index: 0;
        }

        .ad-glow-teal {
          position: fixed;
          width: 600px; height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(43,138,110,0.08) 0%, transparent 70%);
          top: -200px; right: -200px;
          pointer-events: none; z-index: 0;
        }

        .ad-glow-gold {
          position: fixed;
          width: 500px; height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%);
          bottom: -150px; left: -150px;
          pointer-events: none; z-index: 0;
        }

        .ad-scanline {
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(201,168,76,0.15), transparent);
          animation: ad-scan 8s linear infinite;
          pointer-events: none; z-index: 50;
        }

        @keyframes ad-scan {
          0% { top: -2px; }
          100% { top: 100%; }
        }

        .ad-progress-bar {
          position: fixed;
          bottom: 0; left: 0;
          height: 3px;
          background: ${GOLD};
          width: 0%;
          transition: width 0.1s linear;
          z-index: 100;
        }

        .ad-scene {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          opacity: 0;
          transition: opacity 0.8s ease;
          padding: clamp(40px, 7vw, 80px);
          pointer-events: none;
        }
        .ad-scene.ad-active {
          opacity: 1;
          pointer-events: auto;
        }
        .ad-scene > * { position: relative; z-index: 1; }

        /* ── SHARED SHOW TRANSITIONS ── */
        .ad-fade { opacity: 0; transition: opacity 0.8s ease; }
        .ad-fade.ad-show { opacity: 1; }

        /* ── SCENE 1 ── */
        #ad-scene-1 { text-align: center; gap: 0; background: ${NAVY}; }

        #ad-clock-num {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(90px, 16vw, 180px);
          font-weight: 700;
          color: ${RED};
          letter-spacing: -4px;
          line-height: 1;
          opacity: 0;
          transform: scale(0.8);
          transition: all 1s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        #ad-clock-num.ad-show { opacity: 1; transform: scale(1); }

        #ad-clock-lbl {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(14px, 2vw, 22px);
          font-weight: 500;
          letter-spacing: 6px;
          color: ${MUTED};
          text-transform: uppercase;
          margin-top: 16px;
          opacity: 0;
          transition: opacity 0.8s ease 0.4s;
        }
        #ad-clock-lbl.ad-show { opacity: 1; }

        .ad-cost-items {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-top: 40px;
          width: 100%;
          max-width: 600px;
        }

        .ad-cost-item {
          display: flex;
          align-items: center;
          gap: 20px;
          opacity: 0;
          transform: translateX(-20px);
          transition: all 0.5s ease;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          border-left: 3px solid ${RED};
          padding: clamp(12px, 1.4vw, 16px) clamp(16px, 2vw, 24px);
          border-radius: 2px;
        }
        .ad-cost-item.ad-show { opacity: 1; transform: translateX(0); }

        .ad-cost-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: ${RED};
          flex-shrink: 0;
        }
        .ad-cost-text {
          font-size: clamp(14px, 1.6vw, 18px);
          color: rgba(248,247,244,0.75);
        }

        /* ── SCENE 2 ── */
        #ad-scene-2 { text-align: center; gap: 28px; background: ${NAVY}; }

        .ad-eyebrow {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 14px; font-weight: 600;
          letter-spacing: 8px;
          color: ${GOLD};
          text-transform: uppercase;
          opacity: 0;
          transition: opacity 0.6s ease;
        }
        .ad-eyebrow.ad-show { opacity: 1; }

        #ad-t-time {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(56px, 9vw, 96px);
          font-weight: 700;
          color: ${GOLD};
          letter-spacing: -2px;
          line-height: 1;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s;
        }
        #ad-t-time.ad-show { opacity: 1; transform: translateY(0); }

        .ad-trigger-scenarios {
          display: flex; flex-direction: column;
          gap: 10px; width: 100%; max-width: 560px;
        }

        .ad-trigger-scenario {
          display: flex; align-items: center; gap: 16px;
          padding: 13px 22px;
          background: rgba(201,168,76,0.06);
          border: 1px solid rgba(201,168,76,0.15);
          border-radius: 2px;
          opacity: 0; transform: translateY(10px);
          transition: all 0.5s ease;
        }
        .ad-trigger-scenario.ad-show { opacity: 1; transform: translateY(0); }

        .ad-scenario-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: ${GOLD};
          flex-shrink: 0;
          animation: ad-pulse 2s infinite;
        }
        @keyframes ad-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.5); }
        }

        .ad-scenario-text { font-size: clamp(13px, 1.5vw, 17px); color: rgba(248,247,244,0.85); }

        #ad-t-q {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(22px, 3.5vw, 36px);
          font-style: italic;
          color: rgba(248,247,244,0.6);
          opacity: 0; transition: opacity 0.8s ease 0.3s;
          line-height: 1.3;
        }
        #ad-t-q.ad-show { opacity: 1; }

        /* ── SCENE 3 ── */
        #ad-scene-3 { align-items: flex-start; gap: 0; background: ${NAVY}; }

        .ad-section-header {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 14px; font-weight: 600;
          letter-spacing: 8px; color: ${GOLD};
          text-transform: uppercase;
          margin-bottom: 36px;
          opacity: 0; transition: opacity 0.6s ease;
          width: 100%;
        }
        .ad-section-header.ad-show { opacity: 1; }

        .ad-question-row {
          display: flex; align-items: flex-start;
          gap: 24px; padding: 18px 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          width: 100%;
          opacity: 0; transform: translateX(-16px);
          transition: all 0.5s ease;
        }
        .ad-question-row.ad-show { opacity: 1; transform: translateX(0); }
        .ad-question-row:last-child { border-bottom: none; }

        .ad-q-number {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 600;
          color: ${GOLD}; letter-spacing: 2px;
          flex-shrink: 0; padding-top: 2px; width: 32px;
        }
        .ad-q-text { font-size: clamp(14px, 1.6vw, 18px); color: rgba(248,247,244,0.8); line-height: 1.5; }

        /* ── SCENE 4 ── */
        #ad-scene-4 { text-align: center; gap: 0; background: ${NAVY_MID}; }

        .ad-teal-eyebrow {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 14px; font-weight: 600;
          letter-spacing: 8px; color: ${TEAL};
          text-transform: uppercase; margin-bottom: 22px;
          opacity: 0; transition: opacity 0.6s ease;
        }
        .ad-teal-eyebrow.ad-show { opacity: 1; }

        #ad-a-headline {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(52px, 8vw, 72px);
          font-weight: 700; color: ${OFF};
          line-height: 1.1; margin-bottom: 14px;
          opacity: 0; transform: translateY(20px);
          transition: all 0.8s ease 0.2s;
        }
        #ad-a-headline.ad-show { opacity: 1; transform: translateY(0); }
        #ad-a-headline em { color: ${GOLD}; font-style: italic; }

        #ad-a-sub {
          font-size: clamp(15px, 1.8vw, 20px);
          color: rgba(248,247,244,0.55); margin-bottom: 48px;
          opacity: 0; transition: opacity 0.6s ease 0.5s;
        }
        #ad-a-sub.ad-show { opacity: 1; }

        .ad-stats-row { display: flex; gap: 2px; width: 100%; }
        .ad-stat-block {
          flex: 1; padding: clamp(18px, 2.5vw, 28px) clamp(12px, 1.5vw, 20px);
          background: rgba(255,255,255,0.04);
          border-top: 2px solid ${GOLD};
          opacity: 0; transform: translateY(20px);
          transition: all 0.5s ease;
        }
        .ad-stat-block.ad-show { opacity: 1; transform: translateY(0); }
        .ad-stat-val {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(30px, 4.5vw, 48px);
          font-weight: 700; color: ${GOLD};
          line-height: 1; margin-bottom: 8px;
        }
        .ad-stat-lbl {
          font-size: 12px; color: ${MUTED};
          text-transform: uppercase; letter-spacing: 2px;
        }

        /* ── SCENE 5 ── */
        #ad-scene-5 { gap: 0; align-items: flex-start; background: ${NAVY}; }

        .ad-flow-step {
          display: flex; gap: 28px;
          padding: 22px 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          opacity: 0; transform: translateX(-20px);
          transition: all 0.6s ease;
          width: 100%; position: relative;
        }
        .ad-flow-step.ad-show { opacity: 1; transform: translateX(0); }

        .ad-step-time {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(22px, 3vw, 32px);
          font-weight: 700; color: ${TEAL};
          width: 110px; flex-shrink: 0; padding-top: 4px;
        }
        .ad-step-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(14px, 1.6vw, 18px);
          font-weight: 600; color: ${GOLD};
          letter-spacing: 2px; text-transform: uppercase;
          margin-bottom: 5px;
        }
        .ad-step-desc { font-size: clamp(13px, 1.4vw, 16px); color: rgba(248,247,244,0.65); line-height: 1.5; }

        /* ── SCENE 6 ── */
        #ad-scene-6 { text-align: center; gap: 40px; background: ${NAVY_MID}; }

        #ad-m-headline {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(40px, 6vw, 64px);
          font-weight: 700; color: ${OFF};
          line-height: 1.15;
          opacity: 0; transform: translateY(16px);
          transition: all 0.8s ease 0.2s;
        }
        #ad-m-headline.ad-show { opacity: 1; transform: translateY(0); }
        #ad-m-headline em { color: ${TEAL}; font-style: italic; }

        #ad-m-body {
          font-size: clamp(15px, 1.7vw, 20px);
          color: rgba(248,247,244,0.6); line-height: 1.7;
          max-width: 640px;
          opacity: 0; transition: opacity 0.6s ease 0.5s;
        }
        #ad-m-body.ad-show { opacity: 1; }

        #ad-m-metric {
          display: flex; align-items: center; gap: 24px;
          padding: 22px 36px;
          border: 1px solid rgba(43,138,110,0.3);
          background: rgba(43,138,110,0.08);
          border-radius: 2px;
          opacity: 0; transition: opacity 0.6s ease 0.8s;
        }
        #ad-m-metric.ad-show { opacity: 1; }

        .ad-moat-val {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(36px, 5.5vw, 56px);
          font-weight: 700; color: ${TEAL}; flex-shrink: 0;
        }
        .ad-moat-lbl { font-size: clamp(13px, 1.4vw, 16px); color: rgba(248,247,244,0.6); text-align: left; line-height: 1.5; }

        /* ── SCENE 7 ── */
        #ad-scene-7 { text-align: center; gap: 0; justify-content: center; background: ${NAVY}; }

        #ad-dr {
          width: 60px; height: 2px;
          background: ${GOLD}; margin: 0 auto 36px;
          opacity: 0; transition: opacity 0.6s ease;
        }
        #ad-dr.ad-show { opacity: 1; }

        #ad-dt {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(36px, 5.5vw, 60px);
          font-weight: 700; font-style: italic;
          color: ${OFF}; line-height: 1.2; margin-bottom: 44px;
          opacity: 0; transform: translateY(20px);
          transition: all 1s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s;
        }
        #ad-dt.ad-show { opacity: 1; transform: translateY(0); }
        #ad-dt em { color: ${GOLD}; }

        .ad-decl-proof { display: flex; gap: 2px; width: 100%; margin-bottom: 48px; }
        .ad-proof-item {
          flex: 1; padding: 18px 14px;
          background: rgba(255,255,255,0.03);
          border-top: 2px solid rgba(201,168,76,0.4);
          opacity: 0; transition: all 0.4s ease;
        }
        .ad-proof-item.ad-show { opacity: 1; }
        .ad-proof-val {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(22px, 3vw, 32px);
          font-weight: 700; color: ${GOLD}; margin-bottom: 4px;
        }
        .ad-proof-lbl { font-size: 11px; color: ${MUTED}; text-transform: uppercase; letter-spacing: 2px; }

        #ad-du {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(18px, 2.5vw, 28px);
          font-weight: 500; letter-spacing: 4px;
          color: ${GOLD}; text-transform: uppercase;
          opacity: 0; transition: opacity 0.6s ease 0.8s;
          margin-bottom: 10px;
        }
        #ad-du.ad-show { opacity: 1; }

        #ad-db {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; letter-spacing: 5px;
          color: rgba(248,247,244,0.3); text-transform: uppercase;
          opacity: 0; transition: opacity 0.6s ease 1s;
        }
        #ad-db.ad-show { opacity: 1; }

        /* ── CONTROLS ── */
        #ad-replay-btn {
          position: fixed; bottom: 40px; right: 40px;
          padding: 11px 26px;
          background: transparent;
          border: 1px solid rgba(201,168,76,0.4);
          color: ${GOLD};
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; letter-spacing: 4px;
          text-transform: uppercase;
          cursor: pointer;
          opacity: 0; transition: all 0.4s ease;
          z-index: 200;
        }
        #ad-replay-btn:hover { background: rgba(201,168,76,0.1); border-color: ${GOLD}; }
        #ad-replay-btn.ad-show { opacity: 1; }

        #ad-back-btn {
          position: fixed; top: 28px; left: 32px;
          background: transparent;
          border: none;
          color: rgba(248,247,244,0.35);
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 12px; letter-spacing: 4px;
          text-transform: uppercase;
          cursor: pointer;
          z-index: 200;
          transition: color 0.3s ease;
          padding: 0;
        }
        #ad-back-btn:hover { color: ${GOLD}; }
      `}</style>

      <div className="ad-wrap">
        <div className="ad-grid-bg" />
        <div className="ad-glow-teal" />
        <div className="ad-glow-gold" />
        <div className="ad-scanline" />
        <div className="ad-progress-bar" id="ad-progress" />

        <button id="ad-back-btn" onClick={() => setLocation("/")}>← Exit</button>

        {/* SCENE 1 — THE COST */}
        <div className="ad-scene" id="ad-scene-1">
          <div id="ad-clock-num">30</div>
          <div id="ad-clock-lbl">days. before a single action is taken.</div>
          <div className="ad-cost-items">
            <div className="ad-cost-item" id="ad-ci-1"><div className="ad-cost-dot" /><div className="ad-cost-text">Figuring out who needs to be in the room</div></div>
            <div className="ad-cost-item" id="ad-ci-2"><div className="ad-cost-dot" /><div className="ad-cost-text">Agreeing on a plan. Getting budget approved.</div></div>
            <div className="ad-cost-item" id="ad-ci-3"><div className="ad-cost-dot" /><div className="ad-cost-text">Coordinating stakeholders. Building the project plan.</div></div>
            <div className="ad-cost-item" id="ad-ci-4"><div className="ad-cost-dot" /><div className="ad-cost-text">Starting from zero. Every. Single. Time.</div></div>
          </div>
        </div>

        {/* SCENE 2 — THE TRIGGER */}
        <div className="ad-scene" id="ad-scene-2">
          <div className="ad-eyebrow" id="ad-t-eyebrow">It fires without warning</div>
          <div id="ad-t-time">3:17 AM</div>
          <div className="ad-trigger-scenarios">
            <div className="ad-trigger-scenario" id="ad-ts-1"><div className="ad-scenario-dot" /><div className="ad-scenario-text">23 servers encrypted. Ransom note across payment infrastructure.</div></div>
            <div className="ad-trigger-scenario" id="ad-ts-2"><div className="ad-scenario-dot" /><div className="ad-scenario-text">Activist investor files 13D. Board seat demanded.</div></div>
            <div className="ad-trigger-scenario" id="ad-ts-3"><div className="ad-scenario-dot" /><div className="ad-scenario-text">Federal enforcement notice. 48-hour disclosure window open.</div></div>
            <div className="ad-trigger-scenario" id="ad-ts-4"><div className="ad-scenario-dot" /><div className="ad-scenario-text">Primary supplier declares force majeure. 14 facilities exposed.</div></div>
          </div>
          <div id="ad-t-q">Is the response already built?</div>
        </div>

        {/* SCENE 3 — THE QUESTIONS */}
        <div className="ad-scene" id="ad-scene-3">
          <div className="ad-section-header" id="ad-q-header">Ask yourself honestly</div>
          <div style={{ width: "100%", maxWidth: 760 }}>
            <div className="ad-question-row" id="ad-qr-1"><div className="ad-q-number">01</div><div className="ad-q-text">How did you find out about it. Did a defined detection system notify you — or did you hear through someone in a meeting?</div></div>
            <div className="ad-question-row" id="ad-qr-2"><div className="ad-q-number">02</div><div className="ad-q-text">When it crossed the line — who got notified. Automatically. Within minutes. Or did someone have to make calls?</div></div>
            <div className="ad-question-row" id="ad-qr-3"><div className="ad-q-number">03</div><div className="ad-q-text">Were roles already defined. Tasks already assigned. Budget already routed. Or did the first two weeks get consumed figuring it out?</div></div>
            <div className="ad-question-row" id="ad-qr-4"><div className="ad-q-number">04</div><div className="ad-q-text">When it was over — what did you encode so the next response is faster? Or did the learning disappear with the debrief document?</div></div>
          </div>
        </div>

        {/* SCENE 4 — THE ANSWER */}
        <div className="ad-scene" id="ad-scene-4">
          <div className="ad-teal-eyebrow" id="ad-a-eyebrow">The alternative</div>
          <div id="ad-a-headline">12 <em>minutes.</em></div>
          <div id="ad-a-sub">From signal detection to full coordinated execution.</div>
          <div className="ad-stats-row">
            <div className="ad-stat-block" id="ad-sb-1"><div className="ad-stat-val">180</div><div className="ad-stat-lbl">Pre-Staged Protocols</div></div>
            <div className="ad-stat-block" id="ad-sb-2"><div className="ad-stat-val">231</div><div className="ad-stat-lbl">Triggers Monitored</div></div>
            <div className="ad-stat-block" id="ad-sb-3"><div className="ad-stat-val">3,600×</div><div className="ad-stat-lbl">Execution Head Start</div></div>
            <div className="ad-stat-block" id="ad-sb-4"><div className="ad-stat-val">39</div><div className="ad-stat-lbl">Live Data Sources</div></div>
          </div>
        </div>

        {/* SCENE 5 — HOW IT WORKS */}
        <div className="ad-scene" id="ad-scene-5">
          <div className="ad-section-header" id="ad-hw-header">What happens when the trigger fires</div>
          <div style={{ width: "100%" }}>
            <div className="ad-flow-step" id="ad-fs-1">
              <div className="ad-step-time">0:00</div>
              <div><div className="ad-step-label">Signal Detected</div><div className="ad-step-desc">39 live data sources. 231 detection thresholds. Threshold crossed. Protocol matched.</div></div>
            </div>
            <div className="ad-flow-step" id="ad-fs-2">
              <div className="ad-step-time">2:00</div>
              <div><div className="ad-step-label">Executive Decides</div><div className="ad-step-desc">Four pre-staged choices. Execute. Adjust. Choose different. Stand down with a record.</div></div>
            </div>
            <div className="ad-flow-step" id="ad-fs-3">
              <div className="ad-step-time">4:15</div>
              <div><div className="ad-step-label">Tasks Deploy</div><div className="ad-step-desc">Every role assigned. Every stakeholder notified. Budget routed. Communications staged.</div></div>
            </div>
            <div className="ad-flow-step" id="ad-fs-4">
              <div className="ad-step-time">12:00</div>
              <div><div className="ad-step-label">Execution Live</div><div className="ad-step-desc">Coordinated across your entire stack. Microsoft. Salesforce. ServiceNow. Everything you already own.</div></div>
            </div>
          </div>
        </div>

        {/* SCENE 6 — THE MOAT */}
        <div className="ad-scene" id="ad-scene-6">
          <div className="ad-teal-eyebrow" id="ad-m-eyebrow">The irreversible advantage</div>
          <div id="ad-m-headline">Every activation makes<br />the next response <em>smarter.</em></div>
          <div id="ad-m-body">The ADVANCE loop encodes what held and what did not back into the preparation before the next trigger arrives. The institutional memory that compounds with every use is the only moat that cannot be rebuilt.</div>
          <div id="ad-m-metric">
            <div className="ad-moat-val">14–18</div>
            <div className="ad-moat-lbl">months for a competitor to replicate<br />your organization's activation history<br />on any other platform</div>
          </div>
        </div>

        {/* SCENE 7 — THE DECLARATION */}
        <div className="ad-scene" id="ad-scene-7">
          <div id="ad-dr" />
          <div id="ad-dt">The response is ready<br />before the <em>trigger fires.</em></div>
          <div className="ad-decl-proof">
            <div className="ad-proof-item" id="ad-pi-1"><div className="ad-proof-val">180</div><div className="ad-proof-lbl">Protocols</div></div>
            <div className="ad-proof-item" id="ad-pi-2"><div className="ad-proof-val">12 min</div><div className="ad-proof-lbl">To Execution</div></div>
            <div className="ad-proof-item" id="ad-pi-3"><div className="ad-proof-val">3,600×</div><div className="ad-proof-lbl">Head Start</div></div>
            <div className="ad-proof-item" id="ad-pi-4"><div className="ad-proof-val">24/7</div><div className="ad-proof-lbl">Monitoring</div></div>
          </div>
          <div id="ad-du">vaughnmartin.com</div>
          <div id="ad-db">VaughnMartin · Readiness OS · Coordination Infrastructure</div>
        </div>

        <button id="ad-replay-btn" onClick={startAd}>↺ REPLAY</button>
      </div>
    </>
  );
}
