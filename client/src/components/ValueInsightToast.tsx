import { useState, useEffect, useRef, useCallback } from "react";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";

export interface ValueInsight {
  id: string;
  headline: string;
  body: string;
  metric: { label: string; value: string };
  duration?: number;
}

interface ToastProps {
  insight: ValueInsight;
  onDismiss: () => void;
}

export function ValueInsightToast({ insight, onDismiss }: ToastProps) {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const duration = insight.duration ?? 8000;
  const startRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const dismissedRef = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    startRef.current = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(pct);
      if (pct > 0) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        if (!dismissedRef.current) {
          dismissedRef.current = true;
          onDismiss();
        }
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [duration, onDismiss]);

  const handleDismiss = () => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    cancelAnimationFrame(rafRef.current);
    onDismiss();
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 32,
        right: 32,
        width: 316,
        background: NAVY,
        borderTop: `3px solid ${GOLD}`,
        border: `1px solid rgba(201,168,76,0.28)`,
        borderTopWidth: 3,
        borderTopColor: GOLD,
        zIndex: 99999,
        transform: visible ? "translateY(0) scale(1)" : "translateY(16px) scale(0.98)",
        opacity: visible ? 1 : 0,
        transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease",
        boxShadow: "0 24px 64px rgba(0,0,0,0.45), 0 4px 16px rgba(0,0,0,0.3)",
        fontFamily: "'Inter', sans-serif",
        overflow: "hidden",
      }}
    >
      <div style={{ padding: "14px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: GOLD, flexShrink: 0, marginTop: 1 }} />
            <span
              style={{
                fontSize: 8.5,
                fontWeight: 800,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: GOLD,
                lineHeight: 1,
              }}
            >
              {insight.headline}
            </span>
          </div>
          <button
            onClick={handleDismiss}
            style={{
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.68)",
              cursor: "pointer",
              padding: "0 0 0 4px",
              fontSize: 13,
              lineHeight: 1,
              flexShrink: 0,
              marginTop: -1,
            }}
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>

        <p
          style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.7)",
            lineHeight: 1.65,
            margin: "0 0 12px",
          }}
        >
          {insight.body}
        </p>

        <div
          style={{
            padding: "9px 13px",
            background: "rgba(201,168,76,0.07)",
            border: "1px solid rgba(201,168,76,0.28)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 14,
          }}
        >
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.68)", lineHeight: 1.35 }}>
            {insight.metric.label}
          </span>
          <span
            style={{
              fontSize: 15,
              fontWeight: 800,
              color: GOLD,
              flexShrink: 0,
              letterSpacing: "0.02em",
            }}
          >
            {insight.metric.value}
          </span>
        </div>
      </div>

      <div style={{ height: 2, background: "rgba(255,255,255,0.07)" }}>
        <div
          style={{
            height: "100%",
            background: GOLD,
            width: `${progress}%`,
            transition: "none",
            opacity: 0.7,
          }}
        />
      </div>
    </div>
  );
}

export function useValueInsights() {
  const [current, setCurrent] = useState<ValueInsight | null>(null);
  const queueRef = useRef<ValueInsight[]>([]);
  const currentRef = useRef<ValueInsight | null>(null);
  const firedIds = useRef<Set<string>>(new Set());
  const advanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const advance = useCallback(() => {
    currentRef.current = null;
    setCurrent(null);
    if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);
    advanceTimeoutRef.current = setTimeout(() => {
      if (queueRef.current.length > 0) {
        const next = queueRef.current.shift()!;
        currentRef.current = next;
        setCurrent(next);
      }
    }, 320);
  }, []);

  const enqueue = useCallback((insight: ValueInsight) => {
    if (firedIds.current.has(insight.id)) return;
    firedIds.current.add(insight.id);
    if (!currentRef.current) {
      currentRef.current = insight;
      setCurrent(insight);
    } else {
      queueRef.current.push(insight);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);
    };
  }, []);

  return { current, enqueue, dismiss: advance };
}
