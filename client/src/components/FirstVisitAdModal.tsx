import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "wouter";

const STORAGE_KEY = "vm_seen_brief";

const NAVY = "#0A0F2E";
const NAVY_MID = "#141B45";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const OFF = "#F8F7F4";
const MUTED = "#6B7280";
const RED = "#C0392B";

// 4 scenes, ~30 seconds total
const SCENE_DURATIONS = [7000, 7000, 7000, 9000];
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
  const [ended, setEnded] = useState(false);

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
    {
      id: "fv-s1",
      onEnter: () => {
        setTimeout(() => show("fv-clock"), 200);
        setTimeout(() => show("fv-clock-lbl"), 700);
        setTimeout(() => show("fv-ci1"), 1300);
        setTimeout(() => show("fv-ci2"), 2100);
        setTimeout(() => show("fv-ci3"), 3000);
      },
      onExit: () => hideAll(["fv-clock", "fv-clock-lbl", "fv-ci1", "fv-ci2", "fv-ci3"]),
    },
    {
      id: "fv-s2",
      onEnter: () => {
        setTimeout(() => show("fv-t-eye"), 200);
        setTimeout(() => show("fv-t-time"), 500);
        setTimeout(() => show("fv-ts1"), 1100);
        setTimeout(() => show("fv-ts2"), 1900);
        setTimeout(() => show("fv-ts3"), 2700);
        setTimeout(() => show("fv-t-q"), 4000);
      },
      onExit: () => hideAll(["fv-t-eye", "fv-t-time", "fv-ts1", "fv-ts2", "fv-ts3", "fv-t-q"]),
    },
    {
      id: "fv-s3",
      onEnter: () => {
        setTimeout(() => show("fv-a-eye"), 200);
        setTimeout(() => show("fv-a-hl"), 500);
        setTimeout(() => show("fv-a-sub"), 1100);
        setTimeout(() => show("fv-sb1"), 1700);
        setTimeout(() => show("fv-sb2"), 2100);
        setTimeout(() => show("fv-sb3"), 2500);
        setTimeout(() => show("fv-sb4"), 2900);
      },
      onExit: () => hideAll(["fv-a-eye", "fv-a-hl", "fv-a-sub", "fv-sb1", "fv-sb2", "fv-sb3", "fv-sb4"]),
    },
    {
      id: "fv-s4",
      onEnter: () => {
        setTimeout(() => show("fv-dr"), 300);
        setTimeout(() => show("fv-dt"), 700);
        setTimeout(() => show("fv-pi1"), 1900);
        setTimeout(() => show("fv-pi2"), 2300);
        setTimeout(() => show("fv-pi3"), 2700);
        setTimeout(() => show("fv-pi4"), 3100);
        setTimeout(() => show("fv-ctas"), 4800);
      },
      onExit: () => hideAll(["fv-dr", "fv-dt", "fv-pi1", "fv-pi2", "fv-pi3", "fv-pi4", "fv-ctas"]),
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

    if (index >= SCENES.length) {
      setEnded(true);
      return;
    }

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
    }, 300);

    return () => {
      clearTimeout(timer);
      if (sceneTimerRef.current) clearTimeout(sceneTimerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [showScene, updateProgress]);

  const handleWatchFull = () => {
    onClose();
    setLocation("/readiness-ad");
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
            linear-gradient(rgba(201,168,76,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.035) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }
        .fv-glow-teal {
          position: absolute; width: 500px; height: 500px; border-radius: 50%;
          background: radial-gradient(circle, rgba(43,138,110,0.07) 0%, transparent 70%);
          top: -180px; right: -180px; pointer-events: none;
        }
        .fv-glow-gold {
          position: absolute; width: 400px; height: 400px; border-radius: 50%;
          background: radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%);
          bottom: -120px; left: -120px; pointer-events: none;
        }
        .fv-scanline {
          position: absolute; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, rgba(201,168,76,0.12), transparent);
          animation: fv-scan 8s linear infinite; pointer-events: none; z-index: 1;
        }
        @keyframes fv-scan { 0% { top: -2px; } 100% { top: 100%; } }

        .fv-progress {
          position: absolute; bottom: 0; left: 0; height: 3px;
          background: ${GOLD}; width: 0; transition: width 0.1s linear; z-index: 10;
        }

        .fv-skip {
          position: absolute; top: 24px; right: 28px; z-index: 20;
          background: transparent; border: none;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 600; letter-spacing: 4px;
          text-transform: uppercase; color: rgba(248,247,244,0.3);
          cursor: pointer; transition: color 0.3s; padding: 0;
        }
        .fv-skip:hover { color: ${GOLD}; }

        /* Scene container */
        .fv-scene {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          justify-content: center; align-items: center;
          opacity: 0; transition: opacity 0.7s ease;
          padding: clamp(32px, 6vw, 72px);
          pointer-events: none;
        }
        .fv-scene.fv-active { opacity: 1; pointer-events: auto; }
        .fv-scene > * { position: relative; z-index: 2; }

        /* Show transitions */
        .fv-show-el { opacity: 0; transition: opacity 0.7s ease; }
        .fv-show-el.fv-show { opacity: 1; }
        .fv-slide-el {
          opacity: 0; transform: translateX(-18px);
          transition: all 0.5s ease;
        }
        .fv-slide-el.fv-show { opacity: 1; transform: translateX(0); }
        .fv-up-el {
          opacity: 0; transform: translateY(18px);
          transition: all 0.7s cubic-bezier(0.34,1.56,0.64,1);
        }
        .fv-up-el.fv-show { opacity: 1; transform: translateY(0); }

        /* ── SCENE 1 ── */
        #fv-s1 { text-align: center; gap: 0; }

        #fv-clock {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(100px, 18vw, 200px);
          font-weight: 700; color: ${RED};
          letter-spacing: -4px; line-height: 1;
          opacity: 0; transform: scale(0.8);
          transition: all 0.9s cubic-bezier(0.34,1.56,0.64,1);
        }
        #fv-clock.fv-show { opacity: 1; transform: scale(1); }

        #fv-clock-lbl {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(13px, 2vw, 20px); font-weight: 500;
          letter-spacing: 6px; color: ${MUTED}; text-transform: uppercase;
          margin-top: 12px;
          opacity: 0; transition: opacity 0.8s ease 0.3s;
        }
        #fv-clock-lbl.fv-show { opacity: 1; }

        .fv-cost-list {
          display: flex; flex-direction: column; gap: 12px;
          margin-top: 32px; width: 100%; max-width: 540px;
        }
        .fv-cost-item {
          display: flex; align-items: center; gap: 18px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          border-left: 3px solid ${RED};
          padding: clamp(10px,1.2vw,14px) clamp(14px,1.8vw,22px);
          border-radius: 2px;
        }
        .fv-cost-dot { width: 7px; height: 7px; border-radius: 50%; background: ${RED}; flex-shrink: 0; }
        .fv-cost-text { font-size: clamp(13px,1.5vw,16px); color: rgba(248,247,244,0.75); }

        /* ── SCENE 2 ── */
        #fv-s2 { text-align: center; gap: 24px; }

        .fv-eyebrow {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 600; letter-spacing: 8px;
          color: ${GOLD}; text-transform: uppercase;
        }

        #fv-t-time {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(60px, 10vw, 100px);
          font-weight: 700; color: ${GOLD}; letter-spacing: -2px; line-height: 1;
          opacity: 0; transform: translateY(18px);
          transition: all 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.15s;
        }
        #fv-t-time.fv-show { opacity: 1; transform: translateY(0); }

        .fv-trigger-list { display: flex; flex-direction: column; gap: 9px; width: 100%; max-width: 520px; }
        .fv-trigger-item {
          display: flex; align-items: center; gap: 14px;
          padding: 11px 20px;
          background: rgba(201,168,76,0.05);
          border: 1px solid rgba(201,168,76,0.14);
          border-radius: 2px;
        }
        .fv-tdot {
          width: 5px; height: 5px; border-radius: 50%; background: ${GOLD};
          flex-shrink: 0; animation: fv-pulse 2s infinite;
        }
        @keyframes fv-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.5)} }
        .fv-ttext { font-size: clamp(12px,1.4vw,15px); color: rgba(248,247,244,0.85); }

        #fv-t-q {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(20px,3.2vw,32px); font-style: italic;
          color: rgba(248,247,244,0.6); line-height: 1.3;
        }

        /* ── SCENE 3 ── */
        #fv-s3 { text-align: center; gap: 0; background: ${NAVY_MID}; }

        .fv-teal-eye {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 600; letter-spacing: 8px;
          color: ${TEAL}; text-transform: uppercase; margin-bottom: 18px;
        }

        #fv-a-hl {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(56px, 9vw, 80px);
          font-weight: 700; color: ${OFF}; line-height: 1; margin-bottom: 10px;
          opacity: 0; transform: translateY(18px);
          transition: all 0.8s cubic-bezier(0.34,1.56,0.64,1) 0.15s;
        }
        #fv-a-hl.fv-show { opacity: 1; transform: translateY(0); }
        #fv-a-hl em { color: ${GOLD}; font-style: italic; }

        #fv-a-sub {
          font-size: clamp(13px,1.6vw,18px); color: rgba(248,247,244,0.5);
          margin-bottom: 40px;
          opacity: 0; transition: opacity 0.6s ease 0.4s;
        }
        #fv-a-sub.fv-show { opacity: 1; }

        .fv-stats { display: flex; gap: 2px; width: 100%; }
        .fv-stat {
          flex: 1; padding: clamp(14px,2vw,22px) clamp(10px,1.2vw,16px);
          background: rgba(255,255,255,0.04);
          border-top: 2px solid ${GOLD};
          opacity: 0; transform: translateY(18px); transition: all 0.5s ease;
        }
        .fv-stat.fv-show { opacity: 1; transform: translateY(0); }
        .fv-stat-v {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(26px,4vw,40px); font-weight: 700;
          color: ${GOLD}; line-height: 1; margin-bottom: 6px;
        }
        .fv-stat-l { font-size: 11px; color: ${MUTED}; text-transform: uppercase; letter-spacing: 2px; }

        /* ── SCENE 4 ── */
        #fv-s4 { text-align: center; gap: 0; }

        #fv-dr {
          width: 50px; height: 2px; background: ${GOLD}; margin: 0 auto 28px;
          opacity: 0; transition: opacity 0.6s ease;
        }
        #fv-dr.fv-show { opacity: 1; }

        #fv-dt {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(32px,5vw,54px); font-weight: 700; font-style: italic;
          color: ${OFF}; line-height: 1.2; margin-bottom: 36px;
          opacity: 0; transform: translateY(18px);
          transition: all 0.9s cubic-bezier(0.34,1.56,0.64,1) 0.15s;
        }
        #fv-dt.fv-show { opacity: 1; transform: translateY(0); }
        #fv-dt em { color: ${GOLD}; }

        .fv-proof { display: flex; gap: 2px; width: 100%; margin-bottom: 36px; }
        .fv-pi {
          flex: 1; padding: 14px 12px;
          background: rgba(255,255,255,0.03);
          border-top: 2px solid rgba(201,168,76,0.4);
          opacity: 0; transition: all 0.4s ease;
        }
        .fv-pi.fv-show { opacity: 1; }
        .fv-pv {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(20px,2.8vw,28px); font-weight: 700;
          color: ${GOLD}; margin-bottom: 3px;
        }
        .fv-pl { font-size: 10px; color: ${MUTED}; text-transform: uppercase; letter-spacing: 2px; }

        #fv-ctas {
          display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;
          opacity: 0; transition: opacity 0.6s ease;
        }
        #fv-ctas.fv-show { opacity: 1; }

        .fv-cta-primary {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 700; letter-spacing: 0.18em;
          text-transform: uppercase;
          background: ${GOLD}; color: ${NAVY};
          border: none; padding: 12px 28px; border-radius: 0.15rem;
          cursor: pointer; transition: opacity 0.2s;
        }
        .fv-cta-primary:hover { opacity: 0.88; }

        .fv-cta-ghost {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 600; letter-spacing: 0.18em;
          text-transform: uppercase;
          background: transparent;
          color: rgba(248,247,244,0.5);
          border: 1px solid rgba(248,247,244,0.15);
          padding: 12px 28px; border-radius: 0.15rem;
          cursor: pointer; transition: all 0.2s;
        }
        .fv-cta-ghost:hover { color: ${OFF}; border-color: rgba(248,247,244,0.35); }
      `}</style>

      <div className="fv-wrap">
        <div className="fv-grid" />
        <div className="fv-glow-teal" />
        <div className="fv-glow-gold" />
        <div className="fv-scanline" />
        <div className="fv-progress" id="fv-progress" />

        <button className="fv-skip" onClick={onClose}>Skip ×</button>

        {/* SCENE 1 — THE COST */}
        <div className="fv-scene" id="fv-s1">
          <div id="fv-clock">30</div>
          <div id="fv-clock-lbl">days. before a single action is taken.</div>
          <div className="fv-cost-list">
            <div className="fv-cost-item fv-slide-el" id="fv-ci1"><div className="fv-cost-dot" /><div className="fv-cost-text">Figuring out who needs to be in the room</div></div>
            <div className="fv-cost-item fv-slide-el" id="fv-ci2"><div className="fv-cost-dot" /><div className="fv-cost-text">Agreeing on a plan. Getting budget approved.</div></div>
            <div className="fv-cost-item fv-slide-el" id="fv-ci3"><div className="fv-cost-dot" /><div className="fv-cost-text">Starting from zero. Every. Single. Time.</div></div>
          </div>
        </div>

        {/* SCENE 2 — THE TRIGGER */}
        <div className="fv-scene" id="fv-s2">
          <div className="fv-eyebrow fv-show-el" id="fv-t-eye">It fires without warning</div>
          <div id="fv-t-time">3:17 AM</div>
          <div className="fv-trigger-list">
            <div className="fv-trigger-item fv-slide-el" id="fv-ts1"><div className="fv-tdot" /><div className="fv-ttext">23 servers encrypted. Ransom note across payment infrastructure.</div></div>
            <div className="fv-trigger-item fv-slide-el" id="fv-ts2"><div className="fv-tdot" /><div className="fv-ttext">Activist investor files 13D. Board seat demanded.</div></div>
            <div className="fv-trigger-item fv-slide-el" id="fv-ts3"><div className="fv-tdot" /><div className="fv-ttext">Primary supplier declares force majeure. 14 facilities exposed.</div></div>
          </div>
          <div className="fv-show-el" id="fv-t-q" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(20px,3.2vw,32px)", fontStyle: "italic", color: "rgba(248,247,244,0.6)" }}>
            Is the response already built?
          </div>
        </div>

        {/* SCENE 3 — THE ANSWER */}
        <div className="fv-scene" id="fv-s3" style={{ background: NAVY_MID }}>
          <div className="fv-teal-eye fv-show-el" id="fv-a-eye">The alternative</div>
          <div id="fv-a-hl">12 <em>minutes.</em></div>
          <div id="fv-a-sub">From signal detection to full coordinated execution.</div>
          <div className="fv-stats">
            <div className="fv-stat" id="fv-sb1"><div className="fv-stat-v">180</div><div className="fv-stat-l">Protocols</div></div>
            <div className="fv-stat" id="fv-sb2"><div className="fv-stat-v">231</div><div className="fv-stat-l">Triggers</div></div>
            <div className="fv-stat" id="fv-sb3"><div className="fv-stat-v">3,600×</div><div className="fv-stat-l">Head Start</div></div>
            <div className="fv-stat" id="fv-sb4"><div className="fv-stat-v">39</div><div className="fv-stat-l">Data Sources</div></div>
          </div>
        </div>

        {/* SCENE 4 — THE DECLARATION */}
        <div className="fv-scene" id="fv-s4">
          <div id="fv-dr" />
          <div id="fv-dt">The response is ready<br />before the <em>trigger fires.</em></div>
          <div className="fv-proof">
            <div className="fv-pi" id="fv-pi1"><div className="fv-pv">180</div><div className="fv-pl">Protocols</div></div>
            <div className="fv-pi" id="fv-pi2"><div className="fv-pv">12 min</div><div className="fv-pl">To Execution</div></div>
            <div className="fv-pi" id="fv-pi3"><div className="fv-pv">3,600×</div><div className="fv-pl">Head Start</div></div>
            <div className="fv-pi" id="fv-pi4"><div className="fv-pv">24/7</div><div className="fv-pl">Monitoring</div></div>
          </div>
          <div id="fv-ctas">
            <button className="fv-cta-primary" onClick={handleWatchFull}>
              Watch the Full 60-Second Brief →
            </button>
            <button className="fv-cta-ghost" onClick={onClose}>
              Continue to Site ×
            </button>
          </div>
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
      // Small delay so the homepage finishes its initial paint first
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
