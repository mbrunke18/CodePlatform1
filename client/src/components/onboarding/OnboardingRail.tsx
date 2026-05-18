import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { useLocation } from 'wouter';

const NAVY   = '#0A0F2E';
const GOLD   = '#C9A84C';
const TEAL   = '#2B8A6E';
const BORDER = '#E8E4DC';

const STAGES = [
  { num: 1, label: 'Configure',  detail: 'Org setup & industry' },
  { num: 2, label: 'Protocols',  detail: 'Select & assign' },
  { num: 3, label: 'Signals',    detail: 'Triggers & monitoring' },
  { num: 4, label: 'Ready',      detail: 'First activation' },
];

const MISSION_TASKS = [
  { key: 'vm_fc_protocol', label: 'Select a Readiness Protocol', href: '/playbooks' },
  { key: 'vm_fc_trigger',  label: 'Configure a signal trigger',  href: '/triggers-management' },
  { key: 'vm_fc_drill',    label: 'Run a practice drill',        href: '/practice-drills' },
  { key: 'vm_fc_brief',    label: 'Generate an executive brief', href: '/executive-brief' },
];

interface OnboardingRailProps {
  currentStage?: number;
  showMissionCard?: boolean;
}

export default function OnboardingRail({ currentStage = 1, showMissionCard = true }: OnboardingRailProps) {
  const [, setLocation] = useLocation();
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const state: Record<string, boolean> = {};
    MISSION_TASKS.forEach(t => {
      state[t.key] = localStorage.getItem(t.key) === 'true';
    });
    setCompleted(state);
  }, []);

  const doneCount = Object.values(completed).filter(Boolean).length;
  const allDone   = doneCount === MISSION_TASKS.length;

  return (
    <div style={{ background: '#fff', borderBottom: `1px solid ${BORDER}` }}>

      {/* ── Stage Rail ─────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'stretch' }}>
        {STAGES.map((s, i) => {
          const done   = s.num < currentStage;
          const active = s.num === currentStage;
          return (
            <div key={s.num} style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '9px 14px',
              background: active ? 'rgba(201,168,76,0.07)' : done ? 'rgba(43,138,110,0.05)' : 'transparent',
              borderRight: i < 3 ? `1px solid ${BORDER}` : 'none',
              borderBottom: `2px solid ${active ? GOLD : done ? TEAL : 'transparent'}`,
            }}>
              <div style={{
                width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: done ? TEAL : active ? GOLD : '#E5E7EB',
                color: done || active ? '#fff' : '#9CA3AF',
                fontSize: 9, fontWeight: 800, letterSpacing: '-0.02em',
              }}>
                {done ? '✓' : s.num}
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', color: active ? NAVY : done ? TEAL : '#9CA3AF' }}>{s.label}</div>
                <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 1 }}>{s.detail}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── First-Success Mission Card ──────────────────────────────────────── */}
      {showMissionCard && !allDone && (
        <div style={{
          padding: '9px 16px',
          background: 'rgba(201,168,76,0.04)',
          borderTop: `1px solid ${BORDER}`,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          flexWrap: 'wrap',
        }}>
          <div style={{ fontSize: 9, fontWeight: 800, color: NAVY, letterSpacing: '0.14em', textTransform: 'uppercase', flexShrink: 0, whiteSpace: 'nowrap' }}>
            First Readiness Cycle
          </div>
          <div style={{ display: 'flex', gap: 6, flex: 1, flexWrap: 'wrap', alignItems: 'center' }}>
            {MISSION_TASKS.map((t, i) => {
              const done = completed[t.key];
              return (
                <button
                  key={t.key}
                  onClick={() => {
                    localStorage.setItem(t.key, 'true');
                    setCompleted(prev => ({ ...prev, [t.key]: true }));
                    setLocation(t.href);
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    fontSize: 11, color: done ? TEAL : GOLD, fontWeight: 600,
                    padding: '3px 9px',
                    border: `1px solid ${done ? 'rgba(43,138,110,0.25)' : 'rgba(201,168,76,0.4)'}`,
                    background: done ? 'rgba(43,138,110,0.06)' : 'rgba(201,168,76,0.08)',
                    cursor: 'pointer', whiteSpace: 'nowrap',
                    opacity: done ? 0.7 : 1,
                    borderRadius: 2,
                  }}
                >
                  {done ? <CheckCircle2 size={11} /> : <Circle size={11} />}
                  <span>{i + 1}. {t.label}</span>
                  {!done && <ArrowRight size={10} />}
                </button>
              );
            })}
          </div>
          <div style={{ fontSize: 10, color: '#9CA3AF', flexShrink: 0 }}>{doneCount}/{MISSION_TASKS.length}</div>
        </div>
      )}

      {showMissionCard && allDone && (
        <div style={{
          padding: '8px 16px',
          background: 'rgba(43,138,110,0.06)',
          borderTop: `1px solid rgba(43,138,110,0.15)`,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <CheckCircle2 size={13} color={TEAL} />
          <span style={{ fontSize: 11, fontWeight: 700, color: TEAL }}>First Readiness Cycle complete — your organization is ready for 12-minute execution.</span>
        </div>
      )}
    </div>
  );
}
