import { useState } from 'react';
import { Lock, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const NAVY = '#0A0F2E';
const GOLD = '#C9A84C';

export function GuestPreviewBanner() {
  const { isAuthenticated, isLoading, login } = useAuth();
  const [dismissed, setDismissed] = useState(false);

  if (isLoading || isAuthenticated || dismissed) return null;

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
          {' '}Full platform access is available to approved organizations. Apply for the Pilot Program if you meet the requirements, or sign in if you already have access.
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
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
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: 4, color: 'rgba(255,255,255,0.4)',
            display: 'flex', alignItems: 'center',
          }}
          aria-label="Dismiss preview banner"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
