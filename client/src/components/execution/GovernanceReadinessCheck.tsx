import { useState } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Shield, Users, ChevronRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GovernanceCheck {
  id: string;
  question: string;
  subtext: string;
  icon: React.ElementType;
  domain: string;
}

const CHECKS: GovernanceCheck[] = [
  {
    id: 'decision_authority',
    question: 'Decision authority is assigned for this domain',
    subtext: 'A named executive holds final approval rights for this trigger area',
    icon: Shield,
    domain: 'Authority',
  },
  {
    id: 'exec_sponsorship',
    question: 'Executive sponsorship is confirmed',
    subtext: 'A C-suite sponsor is committed to this activation and will remove blockers',
    icon: Users,
    domain: 'Sponsorship',
  },
  {
    id: 'escalation_authority',
    question: 'Conflict escalation authority is named',
    subtext: 'If alignment breaks down, there is a designated decision-maker to resolve it',
    icon: AlertTriangle,
    domain: 'Escalation',
  },
];

type CheckState = 'unanswered' | 'yes' | 'no';

interface GovernanceReadinessCheckProps {
  playbookName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isActivating?: boolean;
}

const NAVY = '#0A0F2E';
const GOLD = '#C9A84C';
const TEAL = '#2B8A6E';

export function GovernanceReadinessCheck({
  playbookName,
  onConfirm,
  onCancel,
  isActivating = false,
}: GovernanceReadinessCheckProps) {
  const [checks, setChecks] = useState<Record<string, CheckState>>({
    decision_authority: 'unanswered',
    exec_sponsorship: 'unanswered',
    escalation_authority: 'unanswered',
  });

  const answered = Object.values(checks).filter(v => v !== 'unanswered').length;
  const greenCount = Object.values(checks).filter(v => v === 'yes').length;
  const allAnswered = answered === CHECKS.length;
  const allGreen = greenCount === CHECKS.length;
  const someRed = Object.values(checks).some(v => v === 'no');

  const readinessScore = Math.round((greenCount / CHECKS.length) * 100);

  const setCheck = (id: string, val: CheckState) => {
    setChecks(prev => ({ ...prev, [id]: val }));
  };

  const scoreColor = allGreen ? TEAL : someRed ? '#D97706' : '#6B7280';
  const statusLabel = !allAnswered
    ? 'Answer all 3 questions to proceed'
    : allGreen
      ? 'All Clear — Governance Infrastructure Confirmed'
      : greenCount === 2
        ? 'Proceed with Awareness — 1 gap identified'
        : greenCount === 1
          ? 'Proceed with Caution — 2 gaps identified'
          : 'Not Ready — Address governance gaps before activating';

  const canActivate = allAnswered;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(10,15,46,0.72)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        background: '#fff', borderRadius: 12, maxWidth: 580, width: '100%',
        overflow: 'hidden', boxShadow: '0 32px 80px rgba(10,15,46,0.35)',
      }}>
        {/* Header */}
        <div style={{ background: NAVY, padding: '28px 36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 24, height: 2, background: GOLD }} />
            <span style={{ color: GOLD, fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              Pre-Flight Check
            </span>
          </div>
          <div style={{ color: '#fff', fontSize: 20, fontWeight: 700, lineHeight: 1.3, marginBottom: 6 }}>
            Governance Readiness Check
          </div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
            Before activating <strong style={{ color: 'rgba(255,255,255,0.9)' }}>{playbookName}</strong>, confirm the governance infrastructure is in place.
          </div>
        </div>

        {/* Questions */}
        <div style={{ padding: '28px 36px 0' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 16 }}>
            3 Pre-Flight Questions
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {CHECKS.map((check) => {
              const state = checks[check.id];
              const Icon = check.icon;
              const isYes = state === 'yes';
              const isNo = state === 'no';

              return (
                <div key={check.id} style={{
                  border: `1.5px solid ${isYes ? `${TEAL}40` : isNo ? '#F59E0B40' : '#E8E4DC'}`,
                  borderRadius: 8,
                  padding: '16px 18px',
                  background: isYes ? `${TEAL}08` : isNo ? '#FFF7ED' : '#FAFAFA',
                  transition: 'all 0.15s ease',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: 6, flexShrink: 0, marginTop: 2,
                      background: isYes ? `${TEAL}15` : isNo ? '#FEF3C720' : '#F3F4F6',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon size={16} color={isYes ? TEAL : isNo ? '#D97706' : '#9CA3AF'} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: NAVY, marginBottom: 4, lineHeight: 1.4 }}>
                        {check.question}
                      </div>
                      <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 14, lineHeight: 1.5 }}>
                        {check.subtext}
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => setCheck(check.id, 'yes')}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            padding: '6px 14px', borderRadius: 5, border: 'none', cursor: 'pointer',
                            fontSize: 12, fontWeight: 700,
                            background: isYes ? TEAL : '#F3F4F6',
                            color: isYes ? '#fff' : '#4B5563',
                            transition: 'all 0.15s',
                          }}
                        >
                          <CheckCircle2 size={13} />
                          Yes, confirmed
                        </button>
                        <button
                          onClick={() => setCheck(check.id, 'no')}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            padding: '6px 14px', borderRadius: 5, border: 'none', cursor: 'pointer',
                            fontSize: 12, fontWeight: 700,
                            background: isNo ? '#FEF3C7' : '#F3F4F6',
                            color: isNo ? '#D97706' : '#4B5563',
                            transition: 'all 0.15s',
                          }}
                        >
                          <XCircle size={13} />
                          Not yet
                        </button>
                      </div>
                    </div>
                    {/* Status indicator */}
                    <div style={{ marginTop: 6, flexShrink: 0 }}>
                      {isYes && <CheckCircle2 size={18} color={TEAL} />}
                      {isNo && <AlertTriangle size={18} color='#D97706' />}
                      {state === 'unanswered' && <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid #E8E4DC' }} />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Score + Status */}
        <div style={{ padding: '20px 36px 0' }}>
          {allAnswered && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px',
              borderRadius: 8, marginBottom: 4,
              background: allGreen ? `${TEAL}10` : someRed ? '#FFF7ED' : '#F3F4F6',
              border: `1px solid ${allGreen ? `${TEAL}30` : someRed ? '#FDE68A' : '#E8E4DC'}`,
            }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: scoreColor, lineHeight: 1 }}>
                {readinessScore}%
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>{statusLabel}</div>
                {!allGreen && (
                  <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>
                    You can still activate — gaps are flagged for awareness, not enforcement.
                  </div>
                )}
              </div>
            </div>
          )}
          {!allAnswered && (
            <div style={{ fontSize: 12, color: '#9CA3AF', textAlign: 'center', padding: '8px 0' }}>
              {3 - answered} question{3 - answered !== 1 ? 's' : ''} remaining
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ padding: '20px 36px 28px', display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <Button
            variant="ghost"
            onClick={onCancel}
            disabled={isActivating}
            style={{ color: '#6B7280', fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={!canActivate || isActivating}
            style={{
              background: canActivate ? (allGreen ? TEAL : '#D97706') : '#E8E4DC',
              color: canActivate ? '#fff' : '#9CA3AF',
              fontWeight: 700, padding: '10px 24px',
              display: 'flex', alignItems: 'center', gap: 8,
              opacity: isActivating ? 0.75 : 1,
            }}
          >
            {isActivating ? (
              'Initializing...'
            ) : !canActivate ? (
              'Answer all questions to proceed'
            ) : allGreen ? (
              <>
                <Play size={14} fill="white" />
                Activate — All Clear
              </>
            ) : (
              <>
                <ChevronRight size={14} />
                Override & Activate
              </>
            )}
          </Button>
        </div>

        {/* Footer note */}
        <div style={{ background: '#F8F7F4', borderTop: '1px solid #E8E4DC', padding: '12px 36px' }}>
          <div style={{ fontSize: 11, color: '#9CA3AF', textAlign: 'center' }}>
            This check does not block activation. It surfaces governance gaps so your orchestrator can act with full situational awareness.
          </div>
        </div>
      </div>
    </div>
  );
}
