import { useState } from 'react';
import { useLocation } from 'wouter';
import { Shield, ArrowRight, CheckCircle2 } from 'lucide-react';

const NAVY = '#0A0F2E';
const GOLD = '#C9A84C';
const TEAL = '#2B8A6E';

const FOUNDER_ID = 'founder';

export function activateFounderMode() {
  localStorage.setItem('vm_board_member', FOUNDER_ID);
  localStorage.setItem('vm_board_mode', 'true');
}

export function deactivateFounderMode() {
  localStorage.removeItem('vm_board_member');
  localStorage.removeItem('vm_board_mode');
}

export function isFounderMode(): boolean {
  return localStorage.getItem('vm_board_mode') === 'true';
}

const AREAS = [
  'Leave notes on any page as you browse',
  'Flag design, copy, layout, or feature issues',
  'Notes are saved by page URL for easy reference',
  'Review everything from your admin dashboard',
];

export default function BoardReview() {
  const [, navigate] = useLocation();
  const [activated, setActivated] = useState(false);

  function handleActivate() {
    activateFounderMode();
    setActivated(true);
    setTimeout(() => navigate('/'), 1000);
  }

  if (activated) {
    return (
      <div style={{ minHeight: '100vh', background: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <Shield style={{ width: 24, height: 24, color: NAVY }} />
          </div>
          <div style={{ fontWeight: 700, fontSize: 20, color: 'white', marginBottom: 8 }}>Review mode on</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.50)' }}>Taking you to the homepage…</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: NAVY }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', padding: '20px 32px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: GOLD + '18', border: `1px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield style={{ width: 15, height: 15, color: GOLD }} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>VaughnMartin · Readiness OS</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>Founder Review Mode</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 560, margin: '0 auto', padding: '64px 32px' }}>

        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: GOLD, marginBottom: 16 }}>
            Private · Founder Only
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: 'white', marginBottom: 16, lineHeight: 1.2 }}>
            Platform Review Mode
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.50)', lineHeight: 1.7 }}>
            Activate to browse the platform with a personal notes panel
            on every page. Invisible to everyone else.
          </p>
        </div>

        {/* What it does */}
        <div style={{ marginBottom: 40, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4, padding: 24 }}>
          {AREAS.map((area, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: i < AREAS.length - 1 ? 16 : 0 }}>
              <CheckCircle2 style={{ width: 16, height: 16, color: TEAL, flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>{area}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={handleActivate}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 36px', background: GOLD, color: NAVY, fontWeight: 700, fontSize: 15, borderRadius: 3, border: 'none', cursor: 'pointer' }}
          >
            Activate Review Mode
            <ArrowRight style={{ width: 16, height: 16 }} />
          </button>
          <div style={{ marginTop: 12, fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>
            A gold tab will appear on every page · Go to /board-admin to see your notes
          </div>
        </div>

      </div>
    </div>
  );
}
