import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Clock, Zap, CheckCircle, Play, Flag, AlertCircle } from 'lucide-react';
import { useState } from 'react';

const NAVY = '#0A0F2E';
const GOLD = '#C9A84C';
const TEAL = '#2B8A6E';

function elapsed(start: string, end?: string | null): string {
  const s = new Date(start).getTime();
  const e = end ? new Date(end).getTime() : Date.now();
  const diff = Math.max(0, e - s);
  const mins = Math.floor(diff / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
}

function milliDiff(start: string, end?: string | null): number {
  return end ? new Date(end).getTime() - new Date(start).getTime() : 0;
}

function Badge({ status }: { status: string }) {
  const cfg: Record<string, { label: string; color: string; bg: string }> = {
    detected: { label: 'DETECTED', color: GOLD, bg: `${GOLD}15` },
    notified: { label: 'TEAM NOTIFIED', color: '#F59E0B', bg: '#F59E0B15' },
    activated: { label: 'PLAYBOOK LIVE', color: TEAL, bg: `${TEAL}15` },
    completed: { label: 'COMPLETE', color: TEAL, bg: `${TEAL}20` },
  };
  const c = cfg[status] || cfg.detected;
  return (
    <span style={{ display: 'inline-block', fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: c.color, background: c.bg, padding: '3px 8px', borderRadius: 0 }}>
      {c.label}
    </span>
  );
}

function TimelineRow({ icon: Icon, label, timestamp, start, color, last = false }: { icon: any; label: string; timestamp?: string | null; start: string; color: string; last?: boolean }) {
  const hit = !!timestamp;
  return (
    <div style={{ display: 'flex', gap: 14, position: 'relative' }}>
      {!last && <div style={{ position: 'absolute', left: 17, top: 34, bottom: 0, width: 2, background: hit ? `${color}30` : '#E8E4DC', zIndex: 0 }} />}
      <div style={{ width: 36, height: 36, borderRadius: '50%', background: hit ? `${color}15` : '#F3F4F6', border: `2px solid ${hit ? color : '#E8E4DC'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1 }}>
        <Icon size={15} color={hit ? color : '#CCC'} />
      </div>
      <div style={{ paddingTop: 8, paddingBottom: last ? 0 : 20 }}>
        <div style={{ fontSize: 13, fontWeight: hit ? 700 : 500, color: hit ? NAVY : '#9CA3AF' }}>{label}</div>
        {hit ? (
          <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>
            T+{elapsed(start, timestamp)} · {new Date(timestamp!).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
        ) : (
          <div style={{ fontSize: 11, color: '#CCC', marginTop: 2 }}>Pending</div>
        )}
      </div>
    </div>
  );
}

export function ExecutionClock({ compact = false }: { compact?: boolean }) {
  const qc = useQueryClient();
  const [expanded, setExpanded] = useState<number | null>(null);

  const { data: timelinesRaw, isLoading } = useQuery<any[]>({
    queryKey: ['/api/org/execution-timelines'],
    refetchInterval: 30000,
  });
  const timelines = Array.isArray(timelinesRaw) ? timelinesRaw : [];

  const advanceMutation = useMutation({
    mutationFn: ({ id, milestone, playbookName }: { id: number; milestone: string; playbookName?: string }) =>
      apiRequest('PATCH', `/api/org/execution-timelines/${id}/advance`, { milestone, playbookName }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['/api/org/execution-timelines'] }),
  });

  if (isLoading) return null;

  if (timelines.length === 0) {
    return (
      <div style={{ background: '#fff', border: '1px solid #E8E4DC', borderRadius: 0, padding: 24, textAlign: 'center' }}>
        <Clock size={24} color="#DDD" style={{ margin: '0 auto 12px' }} />
        <div style={{ fontSize: 13, fontWeight: 600, color: '#999' }}>No execution events yet</div>
        <div style={{ fontSize: 12, color: '#bbb', marginTop: 4 }}>The clock starts automatically when the first trigger fires</div>
      </div>
    );
  }

  if (compact) {
    const latest = timelines[0];
    const totalMs = latest.executionCompletedAt && latest.detectedAt
      ? milliDiff(latest.detectedAt, latest.executionCompletedAt)
      : null;
    return (
      <div style={{ background: '#fff', border: '1px solid #E8E4DC', borderRadius: 0, padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: `${GOLD}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Clock size={20} color={GOLD} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>Latest Execution</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{latest.triggerName}</div>
          <Badge status={latest.status} />
        </div>
        {totalMs && (
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: TEAL }}>{Math.round(totalMs / 60000)}m</div>
            <div style={{ fontSize: 10, color: '#999', textTransform: 'uppercase', letterSpacing: 0.8 }}>Total time</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <Clock size={18} color={GOLD} />
        <h3 style={{ fontSize: 14, fontWeight: 700, color: NAVY, margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Execution Clock</h3>
        <span style={{ fontSize: 11, color: '#999', marginLeft: 'auto' }}>{timelines.length} event{timelines.length !== 1 ? 's' : ''}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {timelines.slice(0, 5).map((t: any) => {
          const isOpen = expanded === t.id;
          const totalMs = t.executionCompletedAt && t.detectedAt ? milliDiff(t.detectedAt, t.executionCompletedAt) : null;
          const totalMins = totalMs ? Math.round(totalMs / 60000) : null;
          return (
            <div key={t.id} style={{ background: '#fff', border: '1px solid #E8E4DC', borderRadius: 0, overflow: 'hidden' }}>
              {/* Summary row */}
              <div
                onClick={() => setExpanded(isOpen ? null : t.id)}
                style={{ padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}
              >
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${GOLD}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Zap size={15} color={GOLD} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.triggerName}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <Badge status={t.status} />
                    <span style={{ fontSize: 11, color: '#999' }}>{t.triggerDomain}</span>
                    <span style={{ fontSize: 11, color: '#CCC' }}>·</span>
                    <span style={{ fontSize: 11, color: '#999' }}>{new Date(t.detectedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
                {totalMins !== null ? (
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: totalMins <= 12 ? TEAL : GOLD }}>{totalMins}m</div>
                    {t.speedMultiplier && <div style={{ fontSize: 10, color: '#999' }}>{Math.round(t.speedMultiplier).toLocaleString()}× Head Start</div>}
                  </div>
                ) : (
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 12, color: '#999' }}>T+{elapsed(t.detectedAt)}</div>
                    <div style={{ fontSize: 10, color: '#bbb' }}>In progress</div>
                  </div>
                )}
              </div>

              {/* Expanded timeline */}
              {isOpen && (
                <div style={{ padding: '0 20px 20px', borderTop: '1px solid #F0EDE4' }}>
                  <div style={{ paddingTop: 16 }}>
                    <TimelineRow icon={Zap} label="Trigger detected" timestamp={t.detectedAt} start={t.detectedAt} color={GOLD} />
                    <TimelineRow icon={AlertCircle} label="Team notified" timestamp={t.notificationSentAt} start={t.detectedAt} color="#F59E0B" />
                    <TimelineRow icon={Play} label={t.playbookName ? `Playbook activated: ${t.playbookName}` : 'Playbook activated'} timestamp={t.playbookActivatedAt} start={t.detectedAt} color={TEAL} />
                    <TimelineRow icon={CheckCircle} label="First task acknowledged" timestamp={t.firstTaskAcknowledgedAt} start={t.detectedAt} color={TEAL} />
                    <TimelineRow icon={Flag} label="Execution complete" timestamp={t.executionCompletedAt} start={t.detectedAt} color={NAVY} last />
                  </div>

                  {/* Advance controls for in-progress events */}
                  {t.status !== 'completed' && (
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 16, paddingTop: 14, borderTop: '1px solid #F0EDE4' }}>
                      {!t.playbookActivatedAt && (
                        <button onClick={() => advanceMutation.mutate({ id: t.id, milestone: 'activated', playbookName: t.recommendedPlaybook })}
                          style={{ fontSize: 11, fontWeight: 700, background: `${TEAL}15`, color: TEAL, border: `1px solid ${TEAL}30`, borderRadius: 0, padding: '5px 12px', cursor: 'pointer' }}>
                          Mark Playbook Activated
                        </button>
                      )}
                      {t.playbookActivatedAt && !t.firstTaskAcknowledgedAt && (
                        <button onClick={() => advanceMutation.mutate({ id: t.id, milestone: 'task_acknowledged' })}
                          style={{ fontSize: 11, fontWeight: 700, background: `${TEAL}15`, color: TEAL, border: `1px solid ${TEAL}30`, borderRadius: 0, padding: '5px 12px', cursor: 'pointer' }}>
                          Mark First Task Done
                        </button>
                      )}
                      {t.playbookActivatedAt && (
                        <button onClick={() => advanceMutation.mutate({ id: t.id, milestone: 'completed' })}
                          style={{ fontSize: 11, fontWeight: 700, background: `${NAVY}10`, color: NAVY, border: `1px solid ${NAVY}20`, borderRadius: 0, padding: '5px 12px', cursor: 'pointer' }}>
                          Mark Execution Complete
                        </button>
                      )}
                    </div>
                  )}

                  {/* Completed summary */}
                  {t.status === 'completed' && totalMins !== null && (
                    <div style={{ marginTop: 16, background: `${TEAL}08`, border: `1px solid ${TEAL}20`, borderRadius: 0, padding: '12px 16px', display: 'flex', gap: 20 }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 22, fontWeight: 800, color: TEAL }}>{totalMins}m</div>
                        <div style={{ fontSize: 10, color: '#999', textTransform: 'uppercase', letterSpacing: 0.8 }}>Actual time</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 22, fontWeight: 800, color: NAVY }}>30 days</div>
                        <div style={{ fontSize: 10, color: '#999', textTransform: 'uppercase', letterSpacing: 0.8 }}>Traditional</div>
                      </div>
                      {t.speedMultiplier && (
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 22, fontWeight: 800, color: GOLD }}>{Math.round(t.speedMultiplier).toLocaleString()}×</div>
                          <div style={{ fontSize: 10, color: '#999', textTransform: 'uppercase', letterSpacing: 0.8 }}>Execution Head Start</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
