import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "wouter";

const STORAGE_KEY = "vm_seen_brief";

const NAVY = "#0A0F2E";
const NAVY_MID = "#141B45";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const OFF = "#F8F7F4";
const MUTED = "#6B7280";

// 4 scenes — ~26 seconds total
const SCENE_DURATIONS = [7000, 6000, 8000, 8000];
const TOTAL_DURATION = SCENE_DURATIONS.reduce((a, b) => a + b, 0);

type Props = { onClose: () => void };

function AdContent({ onClose }: Props) {
  const [, setLocation] = useLocation();
  const currentSceneRef = useRef(-1);
  const sceneTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);
  const progressStartRef = useRef<number | null>(null);
  const prevElapsedRef = useRef(0);
  const elapsedRef = useRef(0);

  const show = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.classList.add("fv-show");
  }, []);

  const hideAll = useCallback((ids: string[]) => {
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.classList.remove("fv-show");
    });
  }, []);

  const SCENES = [
    // SCENE 1 — THE MOMENT
    {
      id: "fv-s1",
      onEnter: () => {
        setTimeout(() => show("fv-s1-time"), 100);
        setTimeout(() => show("fv-s1-r1"), 900);
        setTimeout(() => show("fv-s1-r2"), 2000);
        setTimeout(() => show("fv-s1-r3"), 3100);
        setTimeout(() => show("fv-s1-r4"), 4200);
        setTimeout(() => show("fv-s1-q"), 5400);
      },
      onExit: () => hideAll(["fv-s1-time","fv-s1-r1","fv-s1-r2","fv-s1-r3","fv-s1-r4","fv-s1-q"]),
    },
    // SCENE 2 — THE COST
    {
      id: "fv-s2",
      onEnter: () => {
        setTimeout(() => show("fv-s2-l1"), 200);
        setTimeout(() => show("fv-s2-l2"), 1400);
        setTimeout(() => show("fv-s2-l3"), 2600);
      },
      onExit: () => hideAll(["fv-s2-l1","fv-s2-l2","fv-s2-l3"]),
    },
    // SCENE 3 — THE MACHINE MOVING
    {
      id: "fv-s3",
      onEnter: () => {
        setTimeout(() => show("fv-s3-hd"), 200);
        setTimeout(() => show("fv-s3-st1"), 800);
        setTimeout(() => show("fv-s3-cn1"), 1300);
        setTimeout(() => show("fv-s3-st2"), 1800);
        setTimeout(() => show("fv-s3-cn2"), 2300);
        setTimeout(() => show("fv-s3-st3"), 2800);
        setTimeout(() => show("fv-s3-cn3"), 3300);
        setTimeout(() => show("fv-s3-st4"), 3800);
        setTimeout(() => show("fv-s3-cn4"), 4300);
        setTimeout(() => show("fv-s3-st5"), 4800);
      },
      onExit: () => hideAll(["fv-s3-hd","fv-s3-st1","fv-s3-cn1","fv-s3-st2","fv-s3-cn2","fv-s3-st3","fv-s3-cn3","fv-s3-st4","fv-s3-cn4","fv-s3-st5"]),
    },
    // SCENE 4 — THE DECLARATION + CTA
    {
      id: "fv-s4",
      onEnter: () => {
        setTimeout(() => show("fv-s4-rule"), 300);
        setTimeout(() => show("fv-s4-tl"), 700);
        setTimeout(() => show("fv-s4-sub"), 2000);
        setTimeout(() => show("fv-s4-cta"), 3200);
        setTimeout(() => show("fv-s4-ghost"), 3700);
      },
      onExit: () => hideAll(["fv-s4-rule","fv-s4-tl","fv-s4-sub","fv-s4-cta","fv-s4-ghost"]),
    },
  ];

  const updateProgress = useCallback(() => {
    if (!progressStartRef.current) return;
    const now = Date.now();
    elapsedRef.current = prevElapsedRef.current + (now - progressStartRef.current);
    const pct = Math.min(100, (elapsedRef.current / TOTAL_DURATION) * 100);
    const bar = document.getElementById("fv-progress");
    if (bar) bar.style.width = pct + "%";
    if (elapsedRef.current < TOTAL_DURATION) {
      rafRef.current = requestAnimationFrame(updateProgress);
    }
  }, []);

  const showScene = useCallback((index: number) => {
    if (currentSceneRef.current >= 0 && currentSceneRef.current < SCENES.length) {
      const prev = SCENES[currentSceneRef.current];
      const prevEl = document.getElementById(prev.id);
      if (prevEl) prevEl.classList.remove("fv-active");
      prev.onExit();
    }
    currentSceneRef.current = index;
    if (index >= SCENES.length) return;
    const scene = SCENES[index];
    const sceneEl = document.getElementById(scene.id);
    if (sceneEl) sceneEl.classList.add("fv-active");
    scene.onEnter();
    sceneTimerRef.current = setTimeout(() => showScene(index + 1), SCENE_DURATIONS[index]);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      progressStartRef.current = Date.now();
      rafRef.current = requestAnimationFrame(updateProgress);
      showScene(0);
    }, 400);
    return () => {
      clearTimeout(timer);
      if (sceneTimerRef.current) clearTimeout(sceneTimerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [showScene, updateProgress]);

  const handleTryIt = () => {
    onClose();
    setLocation("/situation-scanner");
  };

  return (
    <>
      <style>{`
        .fv-wrap {
          position: fixed; inset: 0; z-index: 9000;
          background: ${NAVY};
          font-family: 'Barlow', sans-serif;
          color: ${OFF};
          overflow: hidden;
        }
        .fv-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(201,168,76,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }
        .fv-glow-teal {
          position: absolute; width: 700px; height: 700px; border-radius: 50%;
          background: radial-gradient(circle, rgba(43,138,110,0.06) 0%, transparent 70%);
          top: -250px; right: -250px; pointer-events: none;
        }
        .fv-glow-gold {
          position: absolute; width: 500px; height: 500px; border-radius: 50%;
          background: radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%);
          bottom: -150px; left: -150px; pointer-events: none;
        }
        .fv-scanline {
          position: absolute; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, rgba(201,168,76,0.1), transparent);
          animation: fv-scan 8s linear infinite; pointer-events: none;
        }
        @keyframes fv-scan { 0% { top: -2px; } 100% { top: 100%; } }
        .fv-progress {
          position: absolute; bottom: 0; left: 0; height: 3px;
          background: ${GOLD}; width: 0; transition: width 0.1s linear; z-index: 10;
        }
        .fv-skip {
          position: absolute; top: 22px; right: 24px; z-index: 20;
          background: transparent; border: none;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px; font-weight: 600; letter-spacing: 4px;
          text-transform: uppercase; color: rgba(248,247,244,0.25);
          cursor: pointer; transition: color 0.3s; padding: 0;
        }
        .fv-skip:hover { color: rgba(248,247,244,0.55); }

        /* Scene base */
        .fv-scene {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          justify-content: center; align-items: center;
          opacity: 0; transition: opacity 0.7s ease;
          padding: clamp(36px, 7vw, 80px);
          pointer-events: none;
        }
        .fv-scene.fv-active { opacity: 1; pointer-events: auto; }
        .fv-scene > * { position: relative; z-index: 2; }

        /* ── SCENE 1 — THE MOMENT ── */
        #fv-s1 { text-align: center; gap: 0; }

        #fv-s1-time {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(72px, 13vw, 140px);
          font-weight: 700; color: ${GOLD};
          letter-spacing: -3px; line-height: 1;
          opacity: 0; transform: translateY(12px);
          transition: all 0.8s cubic-bezier(0.34,1.56,0.64,1);
          margin-bottom: 40px;
        }
        #fv-s1-time.fv-show { opacity: 1; transform: translateY(0); }

        .fv-s1-row {
          display: flex; align-items: flex-start; gap: 18px;
          width: 100%; max-width: 620px;
          margin-bottom: 14px;
          opacity: 0; transform: translateY(8px);
          transition: all 0.45s ease;
        }
        .fv-s1-row.fv-show { opacity: 1; transform: translateY(0); }

        .fv-s1-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: ${GOLD}; flex-shrink: 0; margin-top: 8px;
          animation: fv-pulse 2s infinite;
        }
        @keyframes fv-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(1.6)} }

        .fv-s1-type {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(11px,1.2vw,13px); font-weight: 700;
          letter-spacing: 3px; text-transform: uppercase;
          color: ${GOLD}; width: 130px; flex-shrink: 0;
          padding-top: 2px;
        }
        .fv-s1-desc {
          font-size: clamp(14px,1.5vw,17px);
          color: rgba(248,247,244,0.75); line-height: 1.4;
          text-align: left;
        }

        #fv-s1-q {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(20px,3vw,30px); font-style: italic;
          color: rgba(248,247,244,0.45); margin-top: 28px;
          opacity: 0; transition: opacity 0.8s ease;
        }
        #fv-s1-q.fv-show { opacity: 1; }

        /* ── SCENE 2 — THE COST ── */
        #fv-s2 {
          text-align: center; gap: 0;
          background: ${NAVY_MID};
        }

        .fv-s2-line {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 700;
          color: ${OFF};
          line-height: 1.2;
          opacity: 0; transform: translateY(14px);
          transition: all 0.8s cubic-bezier(0.25,1,0.5,1);
        }
        .fv-s2-line.fv-show { opacity: 1; transform: translateY(0); }

        #fv-s2-l1 {
          font-size: clamp(36px,6vw,64px);
          margin-bottom: 6px;
        }
        #fv-s2-l2 {
          font-size: clamp(36px,6vw,64px);
          color: rgba(248,247,244,0.45);
          margin-bottom: 32px;
          font-style: italic;
        }
        #fv-s2-l3 {
          font-family: 'Barlow', sans-serif;
          font-size: clamp(15px,1.8vw,20px);
          font-weight: 400;
          color: rgba(248,247,244,0.38);
          letter-spacing: 0.02em;
          font-style: normal;
        }

        /* ── SCENE 3 — THE MACHINE MOVING ── */
        #fv-s3 {
          align-items: flex-start; gap: 0;
          background: ${NAVY};
        }

        #fv-s3-hd {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 12px; font-weight: 700; letter-spacing: 7px;
          color: ${TEAL}; text-transform: uppercase;
          margin-bottom: 32px; width: 100%;
          opacity: 0; transition: opacity 0.6s ease;
        }
        #fv-s3-hd.fv-show { opacity: 1; }

        .fv-chain { width: 100%; }

        .fv-step {
          display: flex; align-items: flex-start; gap: 24px;
          opacity: 0; transform: translateX(-14px);
          transition: all 0.5s ease;
        }
        .fv-step.fv-show { opacity: 1; transform: translateX(0); }

        .fv-step-left {
          display: flex; flex-direction: column;
          align-items: center; flex-shrink: 0; width: 80px;
        }
        .fv-step-node {
          width: 10px; height: 10px; border-radius: 50%;
          border: 2px solid ${TEAL}; background: ${NAVY};
          flex-shrink: 0; position: relative;
        }
        .fv-step-node.active { background: ${TEAL}; }

        .fv-step-time {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(18px,2.5vw,26px); font-weight: 700;
          color: ${TEAL}; line-height: 1; margin-top: 4px;
        }

        .fv-connector {
          width: 2px; height: 28px; margin-top: 4px;
          background: linear-gradient(to bottom, ${TEAL}, rgba(43,138,110,0.2));
          opacity: 0; transition: opacity 0.4s ease;
        }
        .fv-connector.fv-show { opacity: 1; }

        .fv-step-content { padding-top: 2px; padding-bottom: 20px; }
        .fv-step-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(14px,1.6vw,17px); font-weight: 700;
          color: ${GOLD}; letter-spacing: 2px; text-transform: uppercase;
          margin-bottom: 3px;
        }
        .fv-step-desc {
          font-size: clamp(12px,1.3vw,14px);
          color: rgba(248,247,244,0.5); line-height: 1.4;
        }

        /* ── SCENE 4 — DECLARATION ── */
        #fv-s4 { text-align: center; gap: 0; }

        #fv-s4-rule {
          width: 48px; height: 2px; background: ${GOLD};
          margin: 0 auto 28px;
          opacity: 0; transition: opacity 0.5s ease;
        }
        #fv-s4-rule.fv-show { opacity: 1; }

        #fv-s4-tl {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(34px,5.5vw,58px);
          font-weight: 700; font-style: italic;
          color: ${OFF}; line-height: 1.2; margin-bottom: 18px;
          opacity: 0; transform: translateY(16px);
          transition: all 0.9s cubic-bezier(0.34,1.56,0.64,1) 0.1s;
        }
        #fv-s4-tl.fv-show { opacity: 1; transform: translateY(0); }
        #fv-s4-tl em { color: ${GOLD}; }

        #fv-s4-sub {
          font-family: 'Barlow', sans-serif;
          font-size: clamp(13px,1.5vw,16px);
          color: rgba(248,247,244,0.38);
          letter-spacing: 0.04em; margin-bottom: 44px;
          opacity: 0; transition: opacity 0.6s ease;
        }
        #fv-s4-sub.fv-show { opacity: 1; }

        #fv-s4-cta {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(13px,1.4vw,15px); font-weight: 700;
          letter-spacing: 0.2em; text-transform: uppercase;
          background: ${GOLD}; color: ${NAVY};
          border: none; padding: 14px 36px; border-radius: 0.15rem;
          cursor: pointer;
          opacity: 0; transition: opacity 0.5s ease;
          display: block; margin: 0 auto 14px;
        }
        #fv-s4-cta.fv-show { opacity: 1; }
        #fv-s4-cta:hover { opacity: 0.88; }

        #fv-s4-ghost {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; letter-spacing: 3px; text-transform: uppercase;
          background: transparent; border: none;
          color: rgba(248,247,244,0.25);
          cursor: pointer;
          opacity: 0; transition: opacity 0.5s ease;
          display: block; margin: 0 auto;
          padding: 0;
        }
        #fv-s4-ghost.fv-show { opacity: 1; }
        #fv-s4-ghost:hover { color: rgba(248,247,244,0.5); }
      `}</style>

      <div className="fv-wrap">
        <div className="fv-grid" />
        <div className="fv-glow-teal" />
        <div className="fv-glow-gold" />
        <div className="fv-scanline" />
        <div className="fv-progress" id="fv-progress" />
        <button className="fv-skip" onClick={onClose}>Skip ×</button>

        {/* ── SCENE 1 — THE MOMENT ── */}
        <div className="fv-scene" id="fv-s1">
          <div id="fv-s1-time">3:17 AM</div>

          <div className="fv-s1-row" id="fv-s1-r1">
            <div className="fv-s1-dot" />
            <div className="fv-s1-type">Ransomware</div>
            <div className="fv-s1-desc">23 servers encrypted. Ransom note across payment infrastructure.</div>
          </div>
          <div className="fv-s1-row" id="fv-s1-r2">
            <div className="fv-s1-dot" />
            <div className="fv-s1-type">Activist Investor</div>
            <div className="fv-s1-desc">13D filed. Board seat demanded. Press release in 6 hours.</div>
          </div>
          <div className="fv-s1-row" id="fv-s1-r3">
            <div className="fv-s1-dot" />
            <div className="fv-s1-type">Enforcement</div>
            <div className="fv-s1-desc">Federal notice received. 48-hour disclosure window open.</div>
          </div>
          <div className="fv-s1-row" id="fv-s1-r4">
            <div className="fv-s1-dot" />
            <div className="fv-s1-type">Supply Chain</div>
            <div className="fv-s1-desc">Primary supplier declares force majeure. 14 facilities exposed.</div>
          </div>

          <div id="fv-s1-q">Is the response already built?</div>
        </div>

        {/* ── SCENE 2 — THE COST ── */}
        <div className="fv-scene" id="fv-s2" style={{ background: NAVY_MID }}>
          <div className="fv-s2-line" id="fv-s2-l1">Most organizations spend<br />the next 30 days</div>
          <div className="fv-s2-line" id="fv-s2-l2">just figuring out who<br />should be in the room.</div>
          <div className="fv-s2-line" id="fv-s2-l3">That delay is not a process failure. It is the architecture.</div>
        </div>

        {/* ── SCENE 3 — THE MACHINE MOVING ── */}
        <div className="fv-scene" id="fv-s3">
          <div id="fv-s3-hd">When Readiness OS is active and the trigger fires</div>
          <div className="fv-chain">

            <div className="fv-step" id="fv-s3-st1">
              <div className="fv-step-left">
                <div className="fv-step-node active" />
                <div className="fv-step-time">0:00</div>
              </div>
              <div className="fv-step-content">
                <div className="fv-step-label">Signal Detected</div>
                <div className="fv-step-desc">39 live sources. 231 trigger patterns. Threshold crossed. Protocol matched.</div>
              </div>
            </div>

            <div className="fv-connector" id="fv-s3-cn1" />

            <div className="fv-step" id="fv-s3-st2">
              <div className="fv-step-left">
                <div className="fv-step-node active" />
                <div className="fv-step-time">2:00</div>
              </div>
              <div className="fv-step-content">
                <div className="fv-step-label">Executive Decides</div>
                <div className="fv-step-desc">Four pre-staged choices delivered. One authorized action unlocks everything.</div>
              </div>
            </div>

            <div className="fv-connector" id="fv-s3-cn2" />

            <div className="fv-step" id="fv-s3-st3">
              <div className="fv-step-left">
                <div className="fv-step-node active" />
                <div className="fv-step-time">4:15</div>
              </div>
              <div className="fv-step-content">
                <div className="fv-step-label">Tasks Deploy</div>
                <div className="fv-step-desc">Every role assigned. Budget routed. Stakeholders notified. Zero improvisation.</div>
              </div>
            </div>

            <div className="fv-connector" id="fv-s3-cn3" />

            <div className="fv-step" id="fv-s3-st4">
              <div className="fv-step-left">
                <div className="fv-step-node" />
                <div className="fv-step-time" style={{ color: GOLD }}>12:00</div>
              </div>
              <div className="fv-step-content">
                <div className="fv-step-label" style={{ color: GOLD }}>Execution Live</div>
                <div className="fv-step-desc">Coordinated across your entire stack. The response was ready before the trigger fired.</div>
              </div>
            </div>

          </div>
        </div>

        {/* ── SCENE 4 — THE DECLARATION ── */}
        <div className="fv-scene" id="fv-s4">
          <div id="fv-s4-rule" />
          <div id="fv-s4-tl">
            The response is ready<br />before the <em>trigger fires.</em>
          </div>
          <div id="fv-s4-sub">VaughnMartin · Readiness OS · Coordination Infrastructure</div>
          <button id="fv-s4-cta" onClick={handleTryIt}>
            Try It Now — No Login Required →
          </button>
          <button id="fv-s4-ghost" onClick={onClose}>
            Continue to site ×
          </button>
        </div>
      </div>
    </>
  );
}

export function FirstVisitAdModal() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) {
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    if (visible) setMounted(true);
  }, [visible]);

  const handleClose = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
    setTimeout(() => setMounted(false), 800);
  }, []);

  if (!mounted) return null;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 8999,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.7s ease",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <AdContent onClose={handleClose} />
    </div>
  );
}
