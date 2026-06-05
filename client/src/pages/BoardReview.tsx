import { useState } from 'react';
import { useLocation } from 'wouter';
import { Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import { BOARD_MEMBERS, activateBoardMode } from '@/components/BoardReviewPanel';

const NAVY = '#0A0F2E';
const GOLD = '#C9A84C';
const TEAL = '#2B8A6E';

// All identities including founder
const IDENTITIES = [
  ...BOARD_MEMBERS.filter(m => m.id !== 'founder'),
  { id: 'founder', name: 'Founder', initials: 'VM', color: NAVY, role: 'Platform Review (Private)' },
];

export default function BoardReview() {
  const [, navigate] = useLocation();
  const [selected, setSelected] = useState<string>('');
  const [activated, setActivated] = useState(false);

  function handleActivate() {
    if (!selected) return;
    activateBoardMode(selected);
    setActivated(true);
    setTimeout(() => navigate('/'), 900);
  }

  if (activated) {
    const m = IDENTITIES.find(i => i.id === selected);
    return (
      <div style={{ minHeight: '100vh', background: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: m?.color ?? NAVY, border: `2px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 16, fontWeight: 700, color: 'white' }}>
            {m?.initials}
          </div>
          <div style={{ fontWeight: 700, fontSize: 18, color: 'white', marginBottom: 6 }}>Review mode active — {m?.name}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>Taking you to the homepage…</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: NAVY }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '18px 32px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: GOLD + '18', border: `1px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield style={{ width: 14, height: 14, color: GOLD }} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>VaughnMartin · Readiness OS</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>Board Review Mode · Private</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '56px 32px' }}>

        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: GOLD, marginBottom: 16 }}>
            Private · Board Review Access
          </div>
          <h1 style={{ fontSize: 30, fontWeight: 700, color: 'white', marginBottom: 14, lineHeight: 1.2 }}>
            Select Your Identity to Begin
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.48)', lineHeight: 1.7, maxWidth: 520, margin: '0 auto' }}>
            Your perspective will be tagged to every piece of feedback you leave.
            A notes panel will appear on every page of the platform.
          </p>
        </div>

        {/* Identity grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 32 }}>
          {IDENTITIES.map(identity => {
            const isSelected = selected === identity.id;
            const isFounder  = identity.id === 'founder';
            return (
              <button
                key={identity.id}
                onClick={() => setSelected(identity.id)}
                style={{
                  padding: '16px 14px',
                  background: isSelected ? identity.color : 'rgba(255,255,255,0.04)',
                  border: `2px solid ${isSelected ? GOLD : 'rgba(255,255,255,0.10)'}`,
                  borderRadius: 4,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s',
                  gridColumn: isFounder ? '1 / -1' : 'auto',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: '50%',
                    background: isSelected ? 'rgba(255,255,255,0.2)' : identity.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, color: 'white', flexShrink: 0,
                  }}>
                    {identity.initials}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'white', marginBottom: 2 }}>{identity.name}</div>
                    <div style={{ fontSize: 10, color: isSelected ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.38)', lineHeight: 1.3 }}>{identity.role}</div>
                  </div>
                  {isSelected && (
                    <div style={{ marginLeft: 'auto' }}>
                      <CheckCircle2 style={{ width: 16, height: 16, color: GOLD }} />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={handleActivate}
            disabled={!selected}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '14px 36px', background: selected ? GOLD : 'rgba(255,255,255,0.08)',
              color: selected ? NAVY : 'rgba(255,255,255,0.25)',
              fontWeight: 700, fontSize: 15, borderRadius: 3, border: 'none',
              cursor: selected ? 'pointer' : 'not-allowed', transition: 'all 0.2s',
            }}
          >
            {selected ? `Enter as ${IDENTITIES.find(i => i.id === selected)?.name}` : 'Select an identity above'}
            {selected && <ArrowRight style={{ width: 16, height: 16 }} />}
          </button>
          <div style={{ marginTop: 12, fontSize: 12, color: 'rgba(255,255,255,0.22)' }}>
            A review tab will appear on every page · Notes saved by page · Dashboard at /board-admin
          </div>
        </div>
      </div>
    </div>
  );
}
