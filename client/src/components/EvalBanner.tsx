import { useAccessTier } from '@/hooks/useAccessTier';
import { Clock, ArrowRight, X } from 'lucide-react';
import { useState } from 'react';

const NAVY = '#0A0F2E';
const GOLD = '#C9A84C';
const TEAL = '#2B8A6E';

export default function EvalBanner() {
  const { isEval, isExpired, hoursRemaining, minutesRemaining } = useAccessTier();
  const [dismissed, setDismissed] = useState(false);

  if (!isEval || dismissed) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      background: isExpired ? '#7F1D1D' : NAVY,
      borderBottom: `2px solid ${isExpired ? '#EF4444' : GOLD}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px 20px',
      gap: 12,
    }}>
      {/* Left: status indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: '0 0 auto' }}>
        <div style={{
          fontSize: 9, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800,
          letterSpacing: '0.2em', textTransform: 'uppercase',
          color: isExpired ? '#FCA5A5' : GOLD,
          border: `1px solid ${isExpired ? '#FCA5A5' : GOLD}`,
          padding: '2px 8px',
          borderRadius: '0.15rem',
        }}>
          {isExpired ? 'Evaluation Expired' : 'Evaluation Environment'}
        </div>
      </div>

      {/* Center: countdown or expired message */}
      <div style={{ flex: 1, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        {!isExpired ? (
          <>
            <Clock size={13} color={GOLD} />
            <span style={{
              fontSize: 12, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 600,
              color: 'rgba(255,255,255,0.85)', letterSpacing: '0.05em',
            }}>
              <span style={{ color: GOLD, fontWeight: 800 }}>
                {hoursRemaining}h {minutesRemaining}m
              </span>
              {' '}remaining in your 48-hour guided evaluation
            </span>
          </>
        ) : (
          <span style={{
            fontSize: 12, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 600,
            color: '#FCA5A5', letterSpacing: '0.05em',
          }}>
            Your evaluation period has ended — apply for full access to continue
          </span>
        )}
      </div>

      {/* Right: CTA */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '0 0 auto' }}>
        <a
          href="/request-access"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: GOLD, color: NAVY,
            fontSize: 11, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            padding: '5px 14px', textDecoration: 'none',
            borderRadius: '0.15rem', whiteSpace: 'nowrap',
          }}
        >
          Apply for Full Access <ArrowRight size={11} />
        </a>
        <button
          onClick={() => setDismissed(true)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', padding: 4, display: 'flex', alignItems: 'center' }}
          aria-label="Dismiss"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
