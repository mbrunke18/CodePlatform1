import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "wouter";
import { VaughnMartinLogo } from "@/components/VaughnMartinLogo";

const STORAGE_KEY = "vm_seen_brief";

const NAVY = "#0A0F2E";
const NAVY_MID = "#0E1538";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const OFF = "#F8F7F4";

// Scene durations in ms
const SCENE_DURATIONS = [7500, 6500, 8000, 8000];
const TOTAL_DURATION = SCENE_DURATIONS.reduce((a, b) => a + b, 0);

type Props = { onClose: () => void };

function AdContent({ onClose }: Props) {
  const [, setLocation] = useLocation();
  const currentSceneRef = useRef(-1);
  const sceneTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);
  const progressStartRef = useRef<number | null>(null);
  const prevElapsedRef = useRef(0);

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
    // ── SCENE 1 — THE TRUTH
    {
      id: "fv-s1",
      onEnter: () => {
        setTimeout(() => show("fv-s1-l1"), 150);
        setTimeout(() => show("fv-s1-l2"), 1300);
        setTimeout(() => show("fv-s1-l3"), 2500);
        setTimeout(() => show("fv-s1-l4"), 3700);
        setTimeout(() => show("fv-s1-l5"), 5000);
        setTimeout(() => show("fv-s1-l6"), 6100);
      },
      onExit: () => hideAll(["fv-s1-l1","fv-s1-l2","fv-s1-l3","fv-s1-l4","fv-s1-l5","fv-s1-l6"]),
    },
    // ── SCENE 2 — THE FAILURE OF HALF-MEASURES
    {
      id: "fv-s2",
      onEnter: () => {
        setTimeout(() => show("fv-s2-l1"), 200);
        setTimeout(() => show("fv-s2-l2"), 1400);
        setTimeout(() => show("fv-s2-l3"), 2600);
        setTimeout(() => show("fv-s2-rule"), 3600);
        setTimeout(() => show("fv-s2-l4"), 4100);
      },
      onExit: () => hideAll(["fv-s2-l1","fv-s2-l2","fv-s2-l3","fv-s2-rule","fv-s2-l4"]),
    },
    // ── SCENE 3 — THE NEW ARCHITECTURE
    {
      id: "fv-s3",
      onEnter: () => {
        setTimeout(() => show("fv-s3-hd"), 200);
        setTimeout(() => show("fv-s3-st1"), 900);
        setTimeout(() => show("fv-s3-cn1"), 1500);
        setTimeout(() => show("fv-s3-st2"), 2100);
        setTimeout(() => show("fv-s3-cn2"), 2700);
        setTimeout(() => show("fv-s3-st3"), 3300);
        setTimeout(() => show("fv-s3-cn3"), 3900);
        setTimeout(() => show("fv-s3-st4"), 4500);
      },
      onExit: () => hideAll(["fv-s3-hd","fv-s3-st1","fv-s3-cn1","fv-s3-st2","fv-s3-cn2","fv-s3-st3","fv-s3-cn3","fv-s3-st4"]),
    },
    // ── SCENE 4 — FEARLESS
    {
      id: "fv-s4",
      onEnter: () => {
        setTimeout(() => show("fv-s4-l1"), 200);
        setTimeout(() => show("fv-s4-l2"), 1500);
        setTimeout(() => show("fv-s4-l3"), 2800);
        setTimeout(() => show("fv-s4-logo"), 3500);
        setTimeout(() => show("fv-s4-rule"), 3900);
        setTimeout(() => show("fv-s4-tl"), 4400);
        setTimeout(() => show("fv-s4-cta"), 5700);
        setTimeout(() => show("fv-s4-ghost"), 6200);
      },
      onExit: () => hideAll(["fv-s4-l1","fv-s4-l2","fv-s4-l3","fv-s4-logo","fv-s4-rule","fv-s4-tl","fv-s4-cta","fv-s4-ghost"]),
    },
  ];

  const updateProgress = useCallback(() => {
    if (!progressStartRef.current) return;
    const elapsed = prevElapsedRef.current + (Date.now() - progressStartRef.current);
    const pct = Math.min(100, (elapsed / TOTAL_DURATION) * 100);
    const bar = document.getElementById("fv-progress");
    if (bar) bar.style.width = pct + "%";
    if (elapsed < TOTAL_DURATION) {
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
      setTimeout(() => onClose(), 1200);
      return;
    }
    const scene = SCENES[index];
    const el = document.getElementById(scene.id);
    if (el) el.classList.add("fv-active");
    scene.onEnter();
    sceneTimerRef.current = setTimeout(() => showScene(index + 1), SCENE_DURATIONS[index]);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      progressStartRef.current = Date.now();
      rafRef.current = requestAnimationFrame(updateProgress);
      showScene(0);
    }, 400);
    return () => {
      clearTimeout(t);
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
        /* ── Wrap ── */
        .fv-wrap {
          position: fixed; inset: 0; z-index: 9000;
          background: ${NAVY};
          font-family: 'Barlow', sans-serif;
          color: ${OFF};
          overflow: hidden;
        }

        /* ── Ambient layers ── */
        .fv-grid {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(201,168,76,0.028) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.028) 1px, transparent 1px);
          background-size: 64px 64px;
        }
        .fv-glow-a {
          position: absolute; width: 800px; height: 800px; border-radius: 50%;
          background: radial-gradient(circle, rgba(43,138,110,0.055) 0%, transparent 65%);
          top: -320px; right: -280px; pointer-events: none;
        }
        .fv-glow-b {
          position: absolute; width: 600px; height: 600px; border-radius: 50%;
          background: radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 65%);
          bottom: -200px; left: -200px; pointer-events: none;
        }
        .fv-scan {
          position: absolute; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(43,138,110,0.12), transparent);
          animation: fv-scanline 10s linear infinite; pointer-events: none;
        }
        @keyframes fv-scanline { 0% { top: -2px; } 100% { top: 100%; } }

        /* ── Chrome ── */
        .fv-progress {
          position: absolute; bottom: 0; left: 0; height: 2px;
          background: linear-gradient(90deg, ${TEAL}, ${GOLD});
          width: 0; z-index: 10;
        }
        .fv-skip {
          position: absolute; top: 20px; right: 22px; z-index: 20;
          background: none; border: none; padding: 0;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px; font-weight: 600; letter-spacing: 4px;
          text-transform: uppercase;
          color: rgba(248,247,244,0.2); cursor: pointer;
          transition: color 0.25s;
        }
        .fv-skip:hover { color: rgba(248,247,244,0.45); }

        /* ── Scene base ── */
        .fv-scene {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          justify-content: center; align-items: center;
          padding: clamp(40px, 8vw, 100px);
          opacity: 0; transition: opacity 0.8s ease;
          pointer-events: none;
        }
        .fv-scene.fv-active { opacity: 1; pointer-events: auto; }

        /* ── Shared animation ── */
        .fv-rise {
          opacity: 0; transform: translateY(14px);
          transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.25,1,0.5,1);
        }
        .fv-rise.fv-show { opacity: 1; transform: translateY(0); }
        .fv-fade {
          opacity: 0; transition: opacity 0.6s ease;
        }
        .fv-fade.fv-show { opacity: 1; }

        /* ══════════════════════════════
           SCENE 1 — THE TRUTH
        ══════════════════════════════ */
        #fv-s1 { text-align: center; gap: 0; }

        .fv-truth-line {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(22px, 3.8vw, 42px);
          font-weight: 700;
          line-height: 1.25;
          color: ${OFF};
          margin-bottom: clamp(6px, 1vw, 10px);
        }
        #fv-s1-l1 { font-size: clamp(26px, 4.5vw, 50px); }
        #fv-s1-l2, #fv-s1-l3 {
          color: rgba(248,247,244,0.42);
          font-size: clamp(17px, 2.6vw, 30px);
          font-style: italic;
        }
        #fv-s1-l4 { margin-top: clamp(14px, 2vw, 22px); }
        #fv-s1-l5 {
          color: rgba(248,247,244,0.42);
          font-size: clamp(17px, 2.6vw, 30px);
          font-style: italic;
        }
        #fv-s1-l6 {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(13px, 1.5vw, 16px);
          font-weight: 700; letter-spacing: 4px;
          text-transform: uppercase;
          color: ${GOLD};
          margin-top: clamp(16px, 2.5vw, 28px);
        }

        /* ══════════════════════════════
           SCENE 2 — THE FAILURE OF HALF-MEASURES
        ══════════════════════════════ */
        #fv-s2 {
          text-align: center; gap: 0;
          background: ${NAVY_MID};
        }

        .fv-s2-body {
          font-size: clamp(16px, 2vw, 22px);
          color: rgba(248,247,244,0.5);
          line-height: 1.6; margin-bottom: clamp(6px, 1vw, 10px);
        }
        #fv-s2-rule {
          width: 40px; height: 2px;
          background: ${GOLD};
          margin: clamp(18px, 2.5vw, 28px) auto;
        }
        #fv-s2-l4 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(28px, 4.8vw, 52px);
          font-weight: 700;
          color: ${OFF};
          line-height: 1.2; text-align: center;
        }

        /* ══════════════════════════════
           SCENE 3 — THE NEW ARCHITECTURE
        ══════════════════════════════ */
        #fv-s3 {
          align-items: flex-start;
          max-width: 680px; margin: 0 auto;
        }
        #fv-s3-hd {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(11px, 1.2vw, 13px);
          font-weight: 700; letter-spacing: 6px;
          text-transform: uppercase; color: ${TEAL};
          margin-bottom: clamp(24px, 3.5vw, 40px);
          width: 100%;
        }

        .fv-step {
          display: flex; align-items: flex-start;
          gap: clamp(16px, 2.5vw, 28px);
          width: 100%;
        }
        .fv-step-left {
          display: flex; flex-direction: column;
          align-items: center; flex-shrink: 0;
          width: clamp(56px, 7vw, 80px);
        }
        .fv-node {
          width: 10px; height: 10px; border-radius: 50%;
          border: 2px solid ${TEAL}; background: ${NAVY};
        }
        .fv-node.lit { background: ${TEAL}; }
        .fv-node.gold { border-color: ${GOLD}; background: ${GOLD}; }
        .fv-time {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(16px, 2.2vw, 24px);
          font-weight: 700; color: ${TEAL};
          margin-top: 4px; line-height: 1;
        }
        .fv-time.gold { color: ${GOLD}; }
        .fv-connector {
          width: 2px;
          height: clamp(22px, 3vw, 32px);
          margin-top: 4px;
          background: linear-gradient(to bottom, ${TEAL}, rgba(43,138,110,0.15));
        }
        .fv-step-body { padding-top: 2px; padding-bottom: clamp(14px, 2vw, 22px); }
        .fv-step-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(13px, 1.5vw, 16px);
          font-weight: 700; letter-spacing: 2.5px;
          text-transform: uppercase; color: ${GOLD};
          margin-bottom: 3px;
        }
        .fv-step-label.gold-final { color: ${GOLD}; }
        .fv-step-desc {
          font-size: clamp(12px, 1.3vw, 14px);
          color: rgba(248,247,244,0.48); line-height: 1.5;
        }

        /* ══════════════════════════════
           SCENE 4 — FEARLESS
        ══════════════════════════════ */
        #fv-s4 { text-align: center; gap: 0; }

        .fv-fearless-line {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(18px, 2.8vw, 32px);
          font-weight: 500; font-style: italic;
          color: rgba(248,247,244,0.5);
          line-height: 1.4; margin-bottom: clamp(6px, 1vw, 10px);
        }
        #fv-s4-rule {
          width: 44px; height: 2px;
          background: ${GOLD};
          margin: clamp(18px, 2.5vw, 28px) auto;
        }
        #fv-s4-tl {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(30px, 5vw, 54px);
          font-weight: 700; font-style: italic;
          color: ${OFF}; line-height: 1.2;
          margin-bottom: clamp(32px, 4vw, 48px);
        }
        #fv-s4-tl em { color: ${GOLD}; font-style: italic; }

        #fv-s4-cta {
          display: block; margin: 0 auto clamp(10px, 1.5vw, 14px);
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(12px, 1.4vw, 14px);
          font-weight: 700; letter-spacing: 0.18em;
          text-transform: uppercase;
          background: ${GOLD}; color: ${NAVY};
          border: none; border-radius: 0.15rem;
          padding: clamp(12px, 1.5vw, 15px) clamp(28px, 4vw, 40px);
          cursor: pointer; transition: opacity 0.2s;
        }
        #fv-s4-cta:hover { opacity: 0.85; }

        #fv-s4-ghost {
          display: block; margin: 0 auto;
          background: none; border: none; padding: 0;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px; letter-spacing: 3px;
          text-transform: uppercase;
          color: rgba(248,247,244,0.2);
          cursor: pointer; transition: color 0.25s;
        }
        #fv-s4-ghost:hover { color: rgba(248,247,244,0.45); }
      `}</style>

      <div className="fv-wrap">
        <div className="fv-grid" />
        <div className="fv-glow-a" />
        <div className="fv-glow-b" />
        <div className="fv-scan" />
        <div className="fv-progress" id="fv-progress" />
        <button className="fv-skip" onClick={onClose}>Skip ×</button>

        {/* ══ SCENE 1 — THE TRUTH ══ */}
        <div className="fv-scene" id="fv-s1">
          <div className="fv-truth-line fv-rise" id="fv-s1-l1">
            Every enterprise was built<br />for a world without AI.
          </div>
          <div className="fv-truth-line fv-rise" id="fv-s1-l2">
            Committees. Alignment cycles. 30-day mobilization.
          </div>
          <div className="fv-truth-line fv-rise" id="fv-s1-l3">
            They existed because humans couldn't process<br />information fast enough to act decisively.
          </div>
          <div className="fv-truth-line fv-rise" id="fv-s1-l4">
            AI changed the constraint.
          </div>
          <div className="fv-truth-line fv-rise" id="fv-s1-l5">
            The operating model didn't.
          </div>
          <div className="fv-fade" id="fv-s1-l6">
            Until now.
          </div>
        </div>

        {/* ══ SCENE 2 — THE FAILURE OF HALF-MEASURES ══ */}
        <div className="fv-scene" id="fv-s2" style={{ background: NAVY_MID }}>
          <div className="fv-s2-body fv-rise" id="fv-s2-l1">
            Every vendor bolted AI onto the old model.
          </div>
          <div className="fv-s2-body fv-rise" id="fv-s2-l2">
            Faster spreadsheets. Smarter summaries.<br />Better notes from the same slow meetings.
          </div>
          <div className="fv-s2-body fv-rise" id="fv-s2-l3">
            The alignment cycle remained.
          </div>
          <div className="fv-fade" id="fv-s2-rule" style={{
            width: 40, height: 2, background: GOLD, margin: "clamp(18px,2.5vw,28px) auto"
          }} />
          <div className="fv-rise" id="fv-s2-l4">
            VaughnMartin rebuilt<br />from first principles.
          </div>
        </div>

        {/* ══ SCENE 3 — THE NEW ARCHITECTURE ══ */}
        <div className="fv-scene" id="fv-s3">
          <div className="fv-fade" id="fv-s3-hd" style={{ width: "100%", maxWidth: 680 }}>
            What "rebuilt from first principles" looks like
          </div>

          <div style={{ width: "100%", maxWidth: 680 }}>
            <div className="fv-step fv-rise" id="fv-s3-st1">
              <div className="fv-step-left">
                <div className="fv-node lit" />
                <div className="fv-time">0:00</div>
              </div>
              <div className="fv-step-body">
                <div className="fv-step-label">Signal Detected</div>
                <div className="fv-step-desc">231 trigger patterns. Continuous monitoring. Threshold crossed. Readiness Protocol matched automatically.</div>
              </div>
            </div>

            <div className="fv-connector fv-fade" id="fv-s3-cn1" />

            <div className="fv-step fv-rise" id="fv-s3-st2">
              <div className="fv-step-left">
                <div className="fv-node lit" />
                <div className="fv-time">2:00</div>
              </div>
              <div className="fv-step-body">
                <div className="fv-step-label">Executive Decides</div>
                <div className="fv-step-desc">Four pre-staged response paths delivered. One authorized action unlocks execution. No meeting required.</div>
              </div>
            </div>

            <div className="fv-connector fv-fade" id="fv-s3-cn2" />

            <div className="fv-step fv-rise" id="fv-s3-st3">
              <div className="fv-step-left">
                <div className="fv-node lit" />
                <div className="fv-time">4:15</div>
              </div>
              <div className="fv-step-body">
                <div className="fv-step-label">Tasks Deploy</div>
                <div className="fv-step-desc">Every role assigned. Budget routed. Stakeholders notified. Zero improvisation — zero coordination overhead.</div>
              </div>
            </div>

            <div className="fv-connector fv-fade" id="fv-s3-cn3" />

            <div className="fv-step fv-rise" id="fv-s3-st4">
              <div className="fv-step-left">
                <div className="fv-node gold" />
                <div className="fv-time gold">12:00</div>
              </div>
              <div className="fv-step-body">
                <div className="fv-step-label gold-final">Execution Live</div>
                <div className="fv-step-desc">Coordinated response across your entire organization. The response was ready before the trigger fired.</div>
              </div>
            </div>
          </div>
        </div>

        {/* ══ SCENE 4 — FEARLESS ══ */}
        <div className="fv-scene" id="fv-s4">
          <div className="fv-fearless-line fv-rise" id="fv-s4-l1">
            When every trigger has a response already staged —
          </div>
          <div className="fv-fearless-line fv-rise" id="fv-s4-l2">
            when the protocol matches before the phone rings —
          </div>
          <div className="fv-fearless-line fv-rise" id="fv-s4-l3">
            the organization stops being afraid of what comes next.
          </div>
          <div className="fv-fade" id="fv-s4-logo" style={{ marginBottom: "clamp(14px,2vw,20px)" }}>
            <VaughnMartinLogo variant="icon-only" height={88} color="light" noLink animated />
          </div>
          <div className="fv-fade" id="fv-s4-rule" />
          <div className="fv-rise" id="fv-s4-tl">
            The response is ready<br />before the <em>trigger fires.</em>
          </div>
          <button id="fv-s4-cta" className="fv-rise" onClick={handleTryIt}>
            See It Execute — No Login Required →
          </button>
          <button id="fv-s4-ghost" className="fv-fade" onClick={onClose}>
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
    if (!localStorage.getItem(STORAGE_KEY)) {
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
