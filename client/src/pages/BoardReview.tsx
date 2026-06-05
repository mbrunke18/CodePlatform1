import { useState } from 'react';
import { useLocation } from 'wouter';
import { BOARD_MEMBERS, activateBoardMode } from '@/components/BoardReviewPanel';
import { Shield, ChevronRight, CheckCircle2, ExternalLink } from 'lucide-react';

const NAVY  = '#0A0F2E';
const GOLD  = '#C9A84C';
const TEAL  = '#2B8A6E';

const REVIEW_SCOPE = [
  { label: 'Every page — homepage to admin',   desc: 'Navigate the full platform freely. The feedback panel follows you everywhere.' },
  { label: 'Design & visual presentation',      desc: 'Typography, color, spacing, visual hierarchy, brand consistency.' },
  { label: 'Layout & information architecture', desc: 'What appears where, how pages are structured, what\'s easy or hard to find.' },
  { label: 'Messaging & strategic narrative',   desc: 'Headlines, positioning copy, proof points, the IDEA Framework explanation.' },
  { label: 'Features & functionality',          desc: 'What the product does, what it should do, what should be removed.' },
  { label: 'Navigation & user flows',           desc: 'How you move through the platform, what\'s intuitive, what\'s confusing.' },
];

const S = {
  page:        { minHeight: '100vh', background: NAVY, color: 'white' } as React.CSSProperties,
  headerBar:   { borderBottom: '1px solid rgba(255,255,255,0.10)' } as React.CSSProperties,
  headerInner: { maxWidth: 900, margin: '0 auto', padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' } as React.CSSProperties,
  iconWrap:    { width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: GOLD + '20', border: `1px solid ${GOLD}`, marginRight: 12 } as React.CSSProperties,
  logoLabel:   { fontWeight: 700, fontSize: 14, color: 'white' } as React.CSSProperties,
  logoSub:     { fontSize: 12, color: 'rgba(255,255,255,0.40)' } as React.CSSProperties,
  adminLink:   { display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.40)', textDecoration: 'none' } as React.CSSProperties,
  content:     { maxWidth: 900, margin: '0 auto', padding: '48px 32px' } as React.CSSProperties,
  eyebrow:     { fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: GOLD, marginBottom: 16, textAlign: 'center' as const },
  h1:          { fontSize: 36, fontWeight: 700, color: 'white', marginBottom: 16, textAlign: 'center' as const },
  lead:        { fontSize: 15, color: 'rgba(255,255,255,0.55)', maxWidth: 540, margin: '0 auto', lineHeight: 1.7, textAlign: 'center' as const },
  sectionLabel:{ fontSize: 11, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.30)', marginBottom: 16, textAlign: 'center' as const },
  grid2:       { display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 } as React.CSSProperties,
  scopeCard:   { display: 'flex', alignItems: 'flex-start', gap: 12, padding: 16, borderRadius: 2, border: '1px solid rgba(255,255,255,0.09)', background: 'rgba(255,255,255,0.04)' } as React.CSSProperties,
  scopeTitle:  { fontSize: 12, fontWeight: 700, color: 'white', marginBottom: 4 } as React.CSSProperties,
  scopeDesc:   { fontSize: 11, color: 'rgba(255,255,255,0.40)', lineHeight: 1.6 } as React.CSSProperties,
  memberBtn:   (selected: boolean, color: string) => ({ display: 'flex', alignItems: 'center', gap: 16, padding: 16, borderRadius: 2, border: `2px solid ${selected ? color : 'rgba(255,255,255,0.09)'}`, background: selected ? color + '20' : 'rgba(255,255,255,0.04)', cursor: 'pointer', textAlign: 'left' as const, width: '100%', transition: 'all 0.15s' }) as React.CSSProperties,
  memberName:  { fontWeight: 700, fontSize: 14, color: 'white', marginBottom: 2 } as React.CSSProperties,
  memberRole:  { fontSize: 11, color: 'rgba(255,255,255,0.45)' } as React.CSSProperties,
  howBox:      { border: '1px solid rgba(255,255,255,0.10)', borderRadius: 2, padding: 24, background: 'rgba(255,255,255,0.03)' } as React.CSSProperties,
  stepNum:     { width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, background: GOLD, color: NAVY, flexShrink: 0 } as React.CSSProperties,
  stepTitle:   { fontSize: 12, fontWeight: 700, color: 'white', marginBottom: 4 } as React.CSSProperties,
  stepBody:    { fontSize: 11, color: 'rgba(255,255,255,0.40)', lineHeight: 1.6 } as React.CSSProperties,
  startBtn:    (active: boolean) => ({ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '14px 32px', fontSize: 14, fontWeight: 700, borderRadius: 2, border: 'none', cursor: active ? 'pointer' : 'not-allowed', background: active ? GOLD : 'rgba(255,255,255,0.10)', color: active ? NAVY : 'rgba(255,255,255,0.25)', transition: 'all 0.15s' }) as React.CSSProperties,
  hint:        { marginTop: 12, fontSize: 11, color: 'rgba(255,255,255,0.30)', textAlign: 'center' as const },
};

export default function BoardReview() {
  const [, navigate] = useLocation();
  const [selected, setSelected] = useState<string>('');
  const [started, setStarted] = useState(false);

  function handleStart() {
    if (!selected) return;
    activateBoardMode(selected);
    setStarted(true);
    setTimeout(() => navigate('/'), 1200);
  }

  const member = BOARD_MEMBERS.find(m => m.id === selected);

  if (started) {
    return (
      <div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, background: member?.color, color: 'white', border: '2px solid rgba(255,255,255,0.2)' }}>
            {member?.initials}
          </div>
          <div style={{ fontWeight: 700, fontSize: 20, color: 'white', marginBottom: 8 }}>{member?.name}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 24 }}>Board review mode activated</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: GOLD }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: GOLD }} />
            <span style={{ fontSize: 13, fontWeight: 700 }}>Opening platform…</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.headerBar}>
        <div style={S.headerInner}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={S.iconWrap}>
              <Shield style={{ width: 16, height: 16, color: GOLD }} />
            </div>
            <div>
              <div style={S.logoLabel}>VaughnMartin · Readiness OS</div>
              <div style={S.logoSub}>Board Review Portal</div>
            </div>
          </div>
          <a href="/board-admin" style={S.adminLink}>
            <ExternalLink style={{ width: 14, height: 14 }} />
            Feedback Admin
          </a>
        </div>
      </div>

      <div style={S.content}>

        {/* Intro */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={S.eyebrow}>Confidential · Advisory Board Access</div>
          <h1 style={S.h1}>Board Review Session</h1>
          <p style={S.lead}>
            Your feedback shapes the final product. Every page, every feature, every word of copy
            is open for your review. Identify yourself below to begin, then navigate freely —
            the feedback panel will follow you through the entire platform.
          </p>
        </div>

        {/* Scope */}
        <div style={{ marginBottom: 40 }}>
          <div style={S.sectionLabel}>Scope of Review</div>
          <div style={S.grid2}>
            {REVIEW_SCOPE.map((item, i) => (
              <div key={i} style={S.scopeCard}>
                <CheckCircle2 style={{ width: 16, height: 16, flexShrink: 0, marginTop: 2, color: TEAL }} />
                <div>
                  <div style={S.scopeTitle}>{item.label}</div>
                  <div style={S.scopeDesc}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Member selection */}
        <div style={{ marginBottom: 32 }}>
          <div style={S.sectionLabel}>Identify Yourself</div>
          <div style={S.grid2}>
            {BOARD_MEMBERS.map(m => (
              <button key={m.id} onClick={() => setSelected(m.id)} style={S.memberBtn(selected === m.id, m.color)}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0, background: m.color, color: 'white' }}>
                  {m.initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={S.memberName}>{m.name}</div>
                  <div style={S.memberRole}>{m.role}</div>
                </div>
                {selected === m.id && (
                  <div style={{ width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: m.color, flexShrink: 0 }}>
                    <CheckCircle2 style={{ width: 13, height: 13, color: 'white' }} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div style={{ ...S.howBox, marginBottom: 32 }}>
          <div style={{ ...S.sectionLabel, textAlign: 'left', marginBottom: 16 }}>How It Works</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {[
              { step: '1', title: 'Navigate freely',  body: 'Browse every page of the platform as if you were a new enterprise prospect or an existing client.' },
              { step: '2', title: 'Open the panel',   body: 'Click the gold "Board Review" tab on the right side of any page to open your feedback panel.' },
              { step: '3', title: 'Leave your note',  body: 'Select Change / Add / Eliminate, pick the area, set priority, and write your specific recommendation.' },
            ].map(s => (
              <div key={s.step} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={S.stepNum}>{s.step}</div>
                <div>
                  <div style={S.stepTitle}>{s.title}</div>
                  <div style={S.stepBody}>{s.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Start button */}
        <div style={{ textAlign: 'center' }}>
          <button onClick={handleStart} disabled={!selected} style={S.startBtn(!!selected)}>
            {selected && member ? (
              <>
                <div style={{ width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, background: member.color, color: 'white' }}>
                  {member.initials}
                </div>
                Enter as {member.name}
                <ChevronRight style={{ width: 16, height: 16 }} />
              </>
            ) : <>Select a board member to continue</>}
          </button>
          {selected && (
            <div style={S.hint}>
              Your identity and feedback will be stored for this session.
              Navigate back to /board-review to switch.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
