const NAVY = '#0A0F2E';
const GOLD = '#C9A84C';
const TEAL = '#2B8A6E';
const IVORY = '#F0EDE4';

export const EXECUTION_STAGES = [
  {
    number: 1,
    name: 'Triggered',
    shortDef: 'Signal threshold crossed — Readiness Protocol pre-staged and system-deployed.',
    fullDef: 'A monitored signal crosses its threshold. The AI evaluation engine selects the matched Readiness Protocol and begins automated deployment. No human initiates this step.',
    inClock: true,
    color: GOLD,
    icon: '⚡',
  },
  {
    number: 2,
    name: 'Staged',
    shortDef: 'Tasks created, roles assigned, stakeholders identified.',
    fullDef: 'The Readiness Protocol generates the full task sequence. Each task is assigned to the correct role based on the pre-configured stakeholder registry. Nothing is sent yet — the deployment is fully staged.',
    inClock: true,
    color: GOLD,
    icon: '📋',
  },
  {
    number: 3,
    name: 'Notified',
    shortDef: 'All stakeholders alerted — Teams, email, or SMS.',
    fullDef: 'Readiness OS dispatches role-specific alerts to every stakeholder via their configured channel. No manual email chains. No scheduling delays. Notification is simultaneous.',
    inClock: true,
    color: GOLD,
    icon: '📡',
  },
  {
    number: 4,
    name: 'Acknowledged',
    shortDef: 'Role-holder confirmed receipt and accepted their task.',
    fullDef: 'The assigned person confirms they have received, reviewed, and accepted their task. This is the final step of the mobilization cycle — the task is owned and the person is ready to act. The 12-minute clock ends here.',
    inClock: true,
    color: TEAL,
    icon: '✓',
    clockEnd: true,
  },
  {
    number: 5,
    name: 'In Progress',
    shortDef: 'The role-holder is actively performing the assigned work.',
    fullDef: 'This is where the actual work happens — negotiations, remediation, containment, filings, communications. Readiness OS does not perform this work. It ensures the right person started it at minute 13 instead of week 5.',
    inClock: false,
    color: '#6B7280',
    icon: '⚙',
  },
  {
    number: 6,
    name: 'Complete',
    shortDef: 'Deliverable confirmed and verified by the role-holder.',
    fullDef: 'The assigned work is delivered and verified. The role-holder confirms completion, which triggers any downstream tasks in the Readiness Protocol. The audit trail is automatically recorded.',
    inClock: false,
    color: '#6B7280',
    icon: '◉',
  },
] as const;

export type ExecutionStageName = typeof EXECUTION_STAGES[number]['name'];

export function ExecutionStageBadge({
  status,
  size = 'sm',
}: {
  status: string;
  size?: 'xs' | 'sm' | 'md';
}) {
  const stageMap: Record<string, typeof EXECUTION_STAGES[number]> = {
    pending:     EXECUTION_STAGES[1],
    staged:      EXECUTION_STAGES[1],
    notifying:   EXECUTION_STAGES[2],
    notified:    EXECUTION_STAGES[2],
    acknowledged:EXECUTION_STAGES[3],
    in_progress: EXECUTION_STAGES[4],
    inprogress:  EXECUTION_STAGES[4],
    completed:   EXECUTION_STAGES[5],
    complete:    EXECUTION_STAGES[5],
    triggered:   EXECUTION_STAGES[0],
  };

  const stage = stageMap[status?.toLowerCase?.() ?? ''] ?? EXECUTION_STAGES[1];

  const sizes = {
    xs: { fontSize: 9,  padding: '1px 6px',  defSize: 9  },
    sm: { fontSize: 10, padding: '2px 8px',  defSize: 10 },
    md: { fontSize: 12, padding: '4px 10px', defSize: 11 },
  };
  const s = sizes[size];

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 2 }}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        fontSize: s.fontSize, fontWeight: 700, padding: s.padding,
        background: stage.inClock ? `${stage.color}15` : '#F3F4F6',
        color: stage.inClock ? stage.color : '#6B7280',
        border: `1px solid ${stage.inClock ? stage.color + '40' : '#E5E7EB'}`,
        borderRadius: 0, whiteSpace: 'nowrap' as const,
      }}>
        {stage.icon} {stage.name}
        {(stage as any).clockEnd && (
          <span style={{ fontSize: s.fontSize - 1, color: TEAL, fontWeight: 600, marginLeft: 2 }}>← 12-min</span>
        )}
      </span>
      <span style={{ fontSize: s.defSize, color: '#9CA3AF', lineHeight: 1.3, maxWidth: 200 }}>
        {stage.shortDef}
      </span>
    </div>
  );
}

export function ExecutionStageGuide({ variant = 'section' }: { variant?: 'section' | 'banner' | 'compact' }) {

  if (variant === 'banner') {
    return (
      <div style={{
        background: '#0D1640',
        borderTop: `1px solid rgba(201,168,76,0.35)`,
        borderBottom: `1px solid rgba(201,168,76,0.35)`,
        padding: '14px 32px',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ width: 20, height: 1.5, background: GOLD }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: '0.18em', textTransform: 'uppercase' as const }}>
              Execution Stage Reference
            </span>
            <div style={{ width: 20, height: 1.5, background: GOLD }} />
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.68)', marginLeft: 8 }}>
              Stages 1–4 complete in 12 minutes. Stages 5–6 are the actual work that follows.
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'stretch', gap: 0, overflowX: 'auto' as const }}>
            {EXECUTION_STAGES.map((stage, i) => (
              <div key={stage.name} style={{ display: 'flex', alignItems: 'center', gap: 0, flex: 1, minWidth: 0 }}>
                <div style={{
                  flex: 1, padding: '10px 12px',
                  background: stage.inClock ? 'rgba(201,168,76,0.06)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${stage.inClock ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.06)'}`,
                  borderRight: 'none',
                  borderLeft: i === 0 ? undefined : 'none',
                  position: 'relative' as const,
                }}>
                  {(stage as any).clockEnd && (
                    <div style={{
                      position: 'absolute' as const, right: -1, top: 0, bottom: 0,
                      width: 2, background: TEAL,
                      zIndex: 2,
                    }} />
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: stage.inClock ? GOLD : '#6B7280', letterSpacing: '0.06em' }}>
                      {String(stage.number).padStart(2, '0')} {stage.name.toUpperCase()}
                    </span>
                    {(stage as any).clockEnd && (
                      <span style={{ fontSize: 8, fontWeight: 700, color: TEAL, background: 'rgba(43,138,110,0.15)', padding: '1px 4px', borderRadius: 0 }}>12 MIN</span>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: stage.inClock ? 'rgba(240,237,228,0.55)' : 'rgba(255,255,255,0.68)', lineHeight: 1.4 }}>
                    {stage.shortDef}
                  </div>
                </div>
                {i < EXECUTION_STAGES.length - 1 && !(stage as any).clockEnd && (
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.68)', flexShrink: 0, zIndex: 1 }}>→</div>
                )}
                {(stage as any).clockEnd && (
                  <div style={{ fontSize: 10, color: TEAL, flexShrink: 0, zIndex: 1, fontWeight: 700 }}>→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div style={{
        background: '#F8F7F4', border: '1px solid #E8E4DC', borderRadius: 0,
        padding: '16px 20px', marginBottom: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: NAVY, letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Execution Stages</span>
          <span style={{ fontSize: 10, color: '#9CA3AF' }}>— Stages 1–4 complete in 12 minutes. Stages 5–6 are the actual work.</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
          {EXECUTION_STAGES.map((stage) => (
            <div key={stage.name} style={{
              padding: '8px 10px', borderRadius: 0,
              background: stage.inClock ? `${GOLD}08` : 'white',
              border: `1px solid ${stage.inClock ? GOLD + '30' : '#E5E7EB'}`,
              borderTop: `2px solid ${stage.inClock ? GOLD : '#E5E7EB'}`,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: NAVY, marginBottom: 3 }}>
                {stage.number}. {stage.name}
                {(stage as any).clockEnd && <span style={{ color: TEAL, marginLeft: 4, fontSize: 11 }}>←12m</span>}
              </div>
              <div style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.4 }}>{stage.shortDef}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section style={{ background: IVORY, padding: '80px 0' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px' }}>

        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: GOLD, marginBottom: 12, fontFamily: "'DM Sans', Arial, sans-serif" }}>
            The Execution Lifecycle
          </div>
          <h2 style={{ fontSize: 34, fontWeight: 700, color: NAVY, fontFamily: "'Cormorant Garamond', Georgia, serif", lineHeight: 1.2, marginBottom: 14 }}>
            What "Complete" Means at Every Stage
          </h2>
          <p style={{ fontSize: 15, color: '#6B7280', maxWidth: 620, margin: '0 auto', lineHeight: 1.65, fontFamily: "'DM Sans', Arial, sans-serif" }}>
            Not all completions are equal. Readiness OS compresses the mobilization cycle to 12 minutes — Stages 1 through 4. The actual work starts at minute 13. Here is exactly what happens at each stage.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 16 }}>
          {EXECUTION_STAGES.slice(0, 4).map((stage) => (
            <div key={stage.name} style={{
              background: 'white', borderRadius: 0,
              border: `1px solid ${GOLD}30`,
              borderTop: `4px solid ${GOLD}`,
              padding: '24px 24px 20px',
              position: 'relative' as const,
            }}>
              {(stage as any).clockEnd && (
                <div style={{
                  position: 'absolute' as const, top: 12, right: 12,
                  fontSize: 11, fontWeight: 700, color: TEAL,
                  background: 'rgba(43,138,110,0.1)', padding: '2px 8px', borderRadius: 0,
                  letterSpacing: '0.08em',
                }}>
                  12-MIN CLOCK ENDS HERE
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 0,
                  background: `${GOLD}15`, border: `1px solid ${GOLD}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 800, color: GOLD, flexShrink: 0,
                }}>
                  {stage.number}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: NAVY }}>{stage.name}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Within 12 minutes</div>
                </div>
              </div>
              <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6, fontFamily: "'DM Sans', Arial, sans-serif" }}>
                {stage.fullDef}
              </p>
            </div>
          ))}
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16,
        }}>
          <div style={{ flex: 1, height: 1, background: '#D1D5DB' }} />
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 20px',
            background: 'rgba(43,138,110,0.08)', border: `1px solid ${TEAL}30`,
            borderRadius: 0,
          }}>
            <div style={{ width: 8, height: 8, borderRadius: 0, background: TEAL }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: TEAL, letterSpacing: '0.06em' }}>
              Mobilization complete. Execution begins at minute 13.
            </span>
          </div>
          <div style={{ flex: 1, height: 1, background: '#D1D5DB' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {EXECUTION_STAGES.slice(4).map((stage) => (
            <div key={stage.name} style={{
              background: 'white', borderRadius: 0,
              border: '1px solid #E5E7EB',
              borderTop: '4px solid #D1D5DB',
              padding: '24px 24px 20px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 0,
                  background: '#F3F4F6', border: '1px solid #E5E7EB',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 800, color: '#6B7280', flexShrink: 0,
                }}>
                  {stage.number}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: NAVY }}>{stage.name}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>After mobilization — actual work</div>
                </div>
              </div>
              <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6, fontFamily: "'DM Sans', Arial, sans-serif" }}>
                {stage.fullDef}
              </p>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 32, padding: '18px 28px',
          background: NAVY, borderRadius: 0,
          display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' as const,
        }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
              <strong style={{ color: '#fff' }}>The old model took 30 days just to reach Stage 4.</strong>{' '}
              Figuring out who needs to be in the room, aligning on the plan, assigning ownership — all before a single task was executed. Readiness OS compresses Stages 1 through 4 to 12 minutes. The actual work starts immediately after — weeks ahead of where it would have started before.
            </p>
          </div>
          <div style={{ textAlign: 'right' as const, flexShrink: 0 }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: GOLD }}>3,600×</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.68)', letterSpacing: '0.08em' }}>Execution Head Start</div>
          </div>
        </div>

      </div>
    </section>
  );
}
