import { useState, useEffect } from 'react';
import { Clock, Lock, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTrial } from '@/hooks/useTrial';

const NAVY = '#0A0F2E';
const GOLD = '#C9A84C';

export function GuestPreviewBanner() {
  const { isAuthenticated, isLoading: authLoading, login } = useAuth();
  const { isTrial, isExpired, isLoading: trialLoading, firstName, timeRemaining } = useTrial();
  const [dismissed, setDismissed] = useState(false);
  const [remaining, setRemaining] = useState('');

  useEffect(() => {
    if (!isTrial) return;
    setRemaining(timeRemaining());
    const id = setInterval(() => setRemaining(timeRemaining()), 60_000);
    return () => clearInterval(id);
  }, [isTrial, timeRemaining]);

  if (authLoading || trialLoading || isAuthenticated || dismissed) return null;

  // ── Trial expired banner ───────────────────────────────────────────────────
  if (isExpired) {
    return (
      <div style={{
        background: '#1a1a2e',
        borderBottom: `2px solid ${GOLD}`,
        padding: '10px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        flexWrap: 'wrap' as const,
        zIndex: 50,
        position: 'relative' as const,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Clock size={14} color={GOLD} style={{ flexShrink: 0 }} />
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.85)', lineHeight: 1.4 }}>
            <strong style={{ color: GOLD, fontWeight: 700 }}>Your 48-hour trial has ended.</strong>
            {' '}Ready to go deeper? Apply for the Pilot Program — or request extended access if you need more time.
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <a
            href="/pilot-program"
            style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase' as const,
              padding: '7px 18px', background: GOLD, color: NAVY,
              textDecoration: 'none', borderRadius: 4, whiteSpace: 'nowrap' as const,
            }}
          >
            Apply for Pilot →
          </a>
          <a
            href="/request-access"
            style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase' as const,
              padding: '6px 16px', background: 'transparent',
              border: '1px solid rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.7)',
              textDecoration: 'none', borderRadius: 4, whiteSpace: 'nowrap' as const,
            }}
          >
            Request More Time
          </a>
          <button
            onClick={() => setDismissed(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center' }}
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    );
  }

  // ── Trial active banner ────────────────────────────────────────────────────
  if (isTrial) {
    return (
      <div style={{
        background: 'rgba(43,138,110,0.12)',
        borderBottom: '2px solid #2B8A6E',
        padding: '8px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        flexWrap: 'wrap' as const,
        zIndex: 50,
        position: 'relative' as const,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Clock size={14} color="#2B8A6E" style={{ flexShrink: 0 }} />
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: '#111827', lineHeight: 1.4 }}>
            <strong style={{ color: '#2B8A6E', fontWeight: 700 }}>
              {firstName ? `Welcome, ${firstName}` : 'Trial access active'}.
            </strong>
            {' '}You have full platform access.{remaining ? ` ${remaining}.` : ''}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <a
            href="/pilot-program"
            style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase' as const,
              padding: '6px 16px', background: GOLD, color: NAVY,
              textDecoration: 'none', borderRadius: 4, whiteSpace: 'nowrap' as const,
            }}
          >
            Apply for Full Pilot →
          </a>
          <button
            onClick={() => setDismissed(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center' }}
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    );
  }

  // ── Default guest preview banner ───────────────────────────────────────────
  return (
    <div style={{
      background: NAVY,
      borderBottom: `2px solid ${GOLD}`,
      padding: '10px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      flexWrap: 'wrap' as const,
      zIndex: 50,
      position: 'relative' as const,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Lock size={14} color={GOLD} style={{ flexShrink: 0 }} />
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.85)', lineHeight: 1.4 }}>
          <strong style={{ color: '#fff', fontWeight: 700 }}>You are viewing a limited preview.</strong>
          {' '}Full access is available to approved organizations — or request a 48-hour trial to explore the complete platform.
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <a
          href="/trial-access"
          style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase' as const,
            padding: '7px 18px', background: GOLD, color: NAVY,
            textDecoration: 'none', borderRadius: 4, whiteSpace: 'nowrap' as const,
          }}
        >
          Get 24-Hour Access
        </a>
        <button
          onClick={() => login()}
          style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase' as const,
            padding: '6px 16px', background: 'transparent',
            border: '1px solid rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.7)',
            borderRadius: 4, cursor: 'pointer', whiteSpace: 'nowrap' as const,
          }}
        >
          Sign In
        </button>
        <button
          onClick={() => setDismissed(true)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center' }}
          aria-label="Dismiss preview banner"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
