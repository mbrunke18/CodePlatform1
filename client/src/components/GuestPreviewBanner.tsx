import { useState, useEffect, useRef } from 'react';
import { Clock, X, Radio } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTrial } from '@/hooks/useTrial';

const NAVY = '#0A0F2E';
const GOLD = '#C9A84C';
const TEAL = '#2B8A6E';

function timeAgo(dateStr: string | Date | null): string {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function truncate(str: string, max: number): string {
  if (!str) return '';
  return str.length <= max ? str : str.slice(0, max - 1) + '…';
}

interface LiveContext {
  totalToday: number;
  domainsActive: string[];
  latestSignal: {
    triggerName: string;
    triggerDomain: string | null;
    signalDescription: string;
    detectedAt: string | null;
    confidenceScore: number;
  } | null;
  recentDetections: Array<{
    triggerName: string;
    triggerDomain: string;
    signalDescription: string;
    detectedAt: string | null;
    confidenceScore: number;
  }>;
}

function useLiveContext() {
  const [data, setData] = useState<LiveContext | null>(null);
  useEffect(() => {
    fetch('/api/public/live-context')
      .then(r => r.json())
      .then(d => { if (d.success !== false) setData(d); })
      .catch(() => {});
  }, []);
  return data;
}

export function GuestPreviewBanner() {
  const { isAuthenticated, isLoading: authLoading, login } = useAuth();
  const { isTrial, isExpired, isLoading: trialLoading, firstName, timeRemaining } = useTrial();
  const [dismissed, setDismissed] = useState(false);
  const [remaining, setRemaining] = useState('');
  const [tickerIdx, setTickerIdx] = useState(0);
  const tickerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const liveCtx = useLiveContext();

  useEffect(() => {
    if (!isTrial) return;
    setRemaining(timeRemaining());
    const id = setInterval(() => setRemaining(timeRemaining()), 60_000);
    return () => clearInterval(id);
  }, [isTrial, timeRemaining]);

  const headlines = liveCtx?.recentDetections?.length
    ? liveCtx.recentDetections.map(d => ({
        domain: d.triggerDomain || 'Strategic',
        text: truncate(d.signalDescription, 72),
        ago: timeAgo(d.detectedAt),
      }))
    : null;

  useEffect(() => {
    if (!headlines || headlines.length < 2) return;
    tickerRef.current = setInterval(() => {
      setTickerIdx(i => (i + 1) % headlines.length);
    }, 5000);
    return () => { if (tickerRef.current) clearInterval(tickerRef.current); };
  }, [headlines?.length]);

  if (authLoading || trialLoading || isAuthenticated || dismissed) return null;

  // ── Trial expired ─────────────────────────────────────────────────────────
  if (isExpired) {
    return (
      <div style={{
        background: '#1a1a2e', borderBottom: `2px solid ${GOLD}`,
        padding: '10px 24px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' as const,
        zIndex: 50, position: 'relative' as const,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Clock size={14} color={GOLD} style={{ flexShrink: 0 }} />
          <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.85)', lineHeight: 1.4 }}>
            <strong style={{ color: GOLD, fontWeight: 700 }}>Your 48-hour trial has ended.</strong>
            {' '}Ready to activate your organization? Apply for Founding Partner Access — or reach out if you need more time.
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <a href="/request-access" style={{
            fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase' as const,
            padding: '7px 18px', background: GOLD, color: NAVY,
            textDecoration: 'none', borderRadius: 0, whiteSpace: 'nowrap' as const,
          }}>Apply for Founding Partner Access →</a>
          <a href="/request-access" style={{
            fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase' as const,
            padding: '6px 16px', background: 'transparent',
            border: '1px solid rgba(255,255,255,0.68)', color: 'rgba(255,255,255,0.7)',
            textDecoration: 'none', borderRadius: 0, whiteSpace: 'nowrap' as const,
          }}>Request More Time</a>
          <button onClick={() => setDismissed(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center' }} aria-label="Dismiss">
            <X size={14} />
          </button>
        </div>
      </div>
    );
  }

  // ── Trial active ──────────────────────────────────────────────────────────
  if (isTrial) {
    return (
      <div style={{
        background: 'rgba(43,138,110,0.12)', borderBottom: '2px solid #2B8A6E',
        padding: '8px 24px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' as const,
        zIndex: 50, position: 'relative' as const,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Clock size={14} color="#2B8A6E" style={{ flexShrink: 0 }} />
          <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 500, color: '#111827', lineHeight: 1.4 }}>
            <strong style={{ color: '#2B8A6E', fontWeight: 700 }}>
              {firstName ? `Welcome, ${firstName}` : 'Trial access active'}.
            </strong>
            {' '}You have full platform access.{remaining ? ` ${remaining}.` : ''}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <a href="/request-access" style={{
            fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase' as const,
            padding: '6px 16px', background: GOLD, color: NAVY,
            textDecoration: 'none', borderRadius: 0, whiteSpace: 'nowrap' as const,
          }}>Apply for Founding Partner Access →</a>
          <button onClick={() => setDismissed(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center' }} aria-label="Dismiss">
            <X size={14} />
          </button>
        </div>
      </div>
    );
  }

  // ── Default guest — live monitoring strip ─────────────────────────────────
  const currentHeadline = headlines?.[tickerIdx] ?? null;
  const signalCount = liveCtx?.totalToday ?? 0;
  const domainCount = liveCtx?.domainsActive?.length ?? 0;

  return (
    <>
    <style>{`
      @media (max-width: 768px) {
        .guest-banner-shell { padding: 8px 12px !important; flex-direction: column !important; align-items: stretch !important; }
        .guest-banner-left { width: 100% !important; min-width: 0 !important; }
        .guest-banner-right {
          width: 100% !important;
          display: grid !important;
          grid-template-columns: 1fr !important;
          gap: 6px !important;
          flex-shrink: unset !important;
        }
        .guest-banner-right a,
        .guest-banner-right button:not([aria-label="Dismiss"]) {
          width: 100% !important;
          text-align: center !important;
          box-sizing: border-box !important;
        }
      }
    `}</style>
    <div className="guest-banner-shell" style={{
      background: NAVY, borderBottom: `2px solid ${GOLD}`,
      padding: '10px 24px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' as const,
      zIndex: 50, position: 'relative' as const,
    }}>
      {/* Left — live monitor status */}
      <div className="guest-banner-left" style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0, flex: 1 }}>
        {/* Pulsing dot */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <span style={{
            display: 'inline-block', width: 7, height: 7, borderRadius: '50%',
            background: TEAL, boxShadow: `0 0 0 3px rgba(43,138,110,0.25)`,
            animation: 'vm-pulse 2s ease-in-out infinite',
          }} />
          <span style={{
            fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: TEAL,
          }}>Monitoring active</span>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.12)', flexShrink: 0 }} />

        {/* Signal count */}
        {signalCount > 0 && (
          <>
            <span style={{
              fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 500,
              color: 'rgba(255,255,255,0.55)', whiteSpace: 'nowrap' as const, flexShrink: 0,
            }}>
              <strong style={{ color: GOLD, fontWeight: 700 }}>{signalCount}</strong> signal{signalCount !== 1 ? 's' : ''} detected
              {domainCount > 0 && <> across <strong style={{ color: GOLD, fontWeight: 700 }}>{domainCount}</strong> domain{domainCount !== 1 ? 's' : ''}</>}
              {' '}today
            </span>
            <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.12)', flexShrink: 0 }} />
          </>
        )}

        {/* Scrolling headline */}
        {currentHeadline ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0, overflow: 'hidden' }}>
            <Radio size={11} color={GOLD} style={{ flexShrink: 0 }} />
            <span style={{
              fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 500,
              color: 'rgba(255,255,255,0.75)', whiteSpace: 'nowrap' as const,
              overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              <span style={{ color: 'rgba(201,168,76,0.7)', fontWeight: 600, marginRight: 4 }}>{currentHeadline.domain} ·</span>
              {currentHeadline.text}
              <span style={{ color: 'rgba(255,255,255,0.68)', marginLeft: 6 }}>{currentHeadline.ago}</span>
            </span>
          </div>
        ) : (
          <span style={{
            fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 500,
            color: 'rgba(255,255,255,0.5)',
          }}>
            248+ signals monitored every 15 minutes across 9 strategic domains
          </span>
        )}
      </div>

      {/* Right — sign-in only; no competing CTA (board: ticker = signal info only) */}
      <div className="guest-banner-right" style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <a href="/situation-scanner" style={{
          fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 600,
          letterSpacing: '0.06em', textTransform: 'uppercase' as const,
          padding: '5px 12px', background: 'transparent',
          border: '1px solid rgba(201,168,76,0.35)', color: GOLD,
          textDecoration: 'none', borderRadius: 0, whiteSpace: 'nowrap' as const,
        }}>Try it — no login →</a>
        <a href="/api/login" style={{
          fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 600,
          padding: '5px 12px', background: 'transparent', border: 'none',
          color: 'rgba(255,255,255,0.68)', borderRadius: 0, cursor: 'pointer', whiteSpace: 'nowrap' as const,
          textDecoration: 'none',
        }}>Executive Sign-In</a>
        <button onClick={() => setDismissed(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center' }} aria-label="Dismiss">
          <X size={14} />
        </button>
      </div>
    </div>
    </>
  );
}
