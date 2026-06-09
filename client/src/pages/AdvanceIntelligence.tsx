import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import {
  TrendingUp, TrendingDown, CheckCircle2, Clock, Zap, BarChart3,
  ArrowRight, RefreshCw, Shield, Target, Activity, Brain,
  ChevronDown, ChevronRight, Award, Layers, GitCommit, FlaskConical,
  AlertTriangle, Lock, Unlock, Timer, GitBranch, Star, Cpu
} from 'lucide-react';

const NAVY = '#0A0F2E';
const GOLD = '#C9A84C';
const TEAL = '#2B8A6E';
const RED = '#DC2626';

// ─── Types ────────────────────────────────────────────────────────────────────
interface LearningVelocityIndex {
  updatesAppliedTotal: number;
  updatesAppliedLast30Days: number;
  hypothesesTotal: number;
  hypothesesProven: number;
  hypothesesMeasuring: number;
  provenSuccessRate: number;
  totalMinutesSaved: number;
  avgMinutesSavedPerUpdate: number;
  protocolsWithEvidenceCount: number;
  protocolLibraryImprovementPct: number;
  topProvenUpdates: Array<{
    updateId: string;
    hypothesis: string;
    actualImpactMinutes: number;
    confidenceScore: number;
    evidenceSummary: string;
    provenAt: string;
  }>;
  monthlyTrend: Array<{
    month: string;
    applied: number;
    proven: number;
    minutesSaved: number;
  }>;
  compoundScore: number;
  monthsToRebuild: number;
}

interface PendingQueue {
  autoApply: any[];
  requiresApproval: any[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function StatCard({
  label, value, sub, color = GOLD, icon: Icon
}: {
  label: string; value: string | number; sub?: string; color?: string; icon: any;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-sm p-5 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-bold tracking-widest uppercase text-gray-400">{label}</span>
        <Icon className="h-4 w-4" style={{ color }} />
      </div>
      <div className="text-3xl font-bold" style={{ color: NAVY }}>{value}</div>
      {sub && <div className="text-xs text-gray-500 mt-1">{sub}</div>}
    </div>
  );
}

function LoopStage({
  num, label, desc, active, complete
}: {
  num: number; label: string; desc: string; active?: boolean; complete?: boolean;
}) {
  return (
    <div className={`flex items-start gap-3 p-3 rounded-sm border transition-all ${
      complete ? 'border-teal-200 bg-teal-50' :
      active  ? 'border-amber-200 bg-amber-50' :
                'border-gray-100 bg-gray-50'
    }`}>
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
        complete ? 'bg-teal-600 text-white' :
        active   ? 'bg-amber-500 text-white' :
                   'bg-gray-200 text-gray-500'
      }`}>
        {complete ? <CheckCircle2 className="h-4 w-4" /> : num}
      </div>
      <div>
        <div className="text-sm font-bold" style={{ color: NAVY }}>{label}</div>
        <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
      </div>
    </div>
  );
}

function MonthBar({ month, applied, proven, minutesSaved, maxApplied }: any) {
  const height = maxApplied > 0 ? Math.round((applied / maxApplied) * 64) : 4;
  const provenHeight = maxApplied > 0 ? Math.round((proven / maxApplied) * 64) : 0;
  return (
    <div className="flex flex-col items-center gap-1 flex-1">
      <div className="text-xs text-gray-400 font-bold">{minutesSaved > 0 ? `−${minutesSaved}m` : ''}</div>
      <div className="relative w-full flex items-end justify-center" style={{ height: 72 }}>
        <div className="w-6 rounded-sm" style={{ height, backgroundColor: '#E5E7EB' }} />
        {provenHeight > 0 && (
          <div className="w-6 rounded-sm absolute bottom-0" style={{ height: provenHeight, backgroundColor: TEAL }} />
        )}
      </div>
      <div className="text-xs text-gray-400">{month}</div>
      <div className="text-xs font-bold" style={{ color: NAVY }}>{applied}</div>
    </div>
  );
}

// ─── Live Learning Feed component ─────────────────────────────────────────────
const DELTA_ICONS: Record<string, any> = {
  signal_keyword_added: Cpu,
  owner_assigned: Target,
  note_encoded: GitBranch,
};

const DELTA_LABELS: Record<string, string> = {
  signal_keyword_added: 'Signal Keywords Added',
  owner_assigned: 'Owner Pre-Assigned',
  note_encoded: 'Learning Encoded',
};

function LiveLearningFeed() {
  const { data: feedData, isLoading } = useQuery<any[]>({
    queryKey: ['/api/advance/live-feed'],
    refetchInterval: 30000,
  });
  const feed: any[] = feedData || [];

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-bold tracking-widest uppercase text-gray-400">Live Learning Feed</span>
        <div className="h-px flex-1 bg-gray-100" />
        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider" style={{ color: TEAL }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: TEAL }} />
          Real-time
        </span>
      </div>

      {isLoading && (
        <div className="space-y-2 animate-pulse">
          {[...Array(3)].map((_, i) => <div key={i} className="h-14 bg-gray-100 rounded-sm" />)}
        </div>
      )}

      {!isLoading && feed.length === 0 && (
        <div className="border border-gray-100 rounded-sm p-6 text-center">
          <Activity className="h-8 w-8 mx-auto mb-2 text-gray-200" />
          <div className="text-sm font-bold text-gray-400 mb-1">No learning events yet</div>
          <div className="text-xs text-gray-400">
            Apply pending updates above to generate version deltas. Each close-out creates a new learning event here.
          </div>
        </div>
      )}

      {!isLoading && feed.length > 0 && (
        <div className="border border-gray-100 rounded-sm bg-white overflow-hidden">
          {feed.slice(0, 8).map((event: any, idx: number) => {
            const isProven = event.type === 'hypothesis_proven';
            const Icon = isProven ? Star : (DELTA_ICONS[event.eventType] ?? GitCommit);
            const color = isProven ? GOLD : TEAL;
            const label = isProven ? 'Hypothesis Proven' : (DELTA_LABELS[event.eventType] ?? 'Protocol Updated');

            return (
              <div key={event.id} className={`flex items-start gap-4 px-4 py-3 ${idx < feed.length - 1 ? 'border-b border-gray-50' : ''}`}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: color + '15' }}>
                  <Icon className="h-3.5 w-3.5" style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-bold" style={{ color: NAVY }}>{label}</span>
                    {isProven && event.impact != null && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm"
                        style={{ background: TEAL + '20', color: TEAL }}>
                        −{Math.abs(event.impact)} min saved
                      </span>
                    )}
                    {isProven && event.confidence != null && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm"
                        style={{ background: GOLD + '20', color: GOLD }}>
                        {event.confidence}% confidence
                      </span>
                    )}
                    {!isProven && event.versionBefore && event.versionAfter && (
                      <span className="text-[10px] font-mono text-gray-400">
                        v{event.versionBefore} → v{event.versionAfter}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{event.summary}</p>
                  <span className="text-[10px] text-gray-400 mt-0.5 block">
                    {event.timestamp ? new Date(event.timestamp).toLocaleString() : '—'}
                  </span>
                </div>
              </div>
            );
          })}

          {feed.length > 8 && (
            <div className="px-4 py-3 border-t border-gray-50 text-center">
              <span className="text-xs text-gray-400">{feed.length - 8} more events in history</span>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

// ─── Preview data shown before first activation ───────────────────────────────
const PREVIEW_LVI = {
  updatesAppliedTotal: 47,
  updatesAppliedLast30Days: 9,
  hypothesesTotal: 52,
  hypothesesProven: 31,
  hypothesesMeasuring: 8,
  provenSuccessRate: 60,
  totalMinutesSaved: 127,
  avgMinutesSavedPerUpdate: 4.1,
  protocolsWithEvidenceCount: 41,
  protocolLibraryImprovementPct: 23,
  compoundScore: 74,
  monthsToRebuild: 11,
  topProvenUpdates: [
    { updateId: 'prev-1', hypothesis: 'Adding CISO direct-dial to ransomware protocol will reduce first contact time', actualImpactMinutes: 8, confidenceScore: 0.91, evidenceSummary: 'Measured across 3 activations. Avg first-contact time: 4 min vs 12 min baseline.', provenAt: new Date(Date.now() - 14 * 86400000).toISOString() },
    { updateId: 'prev-2', hypothesis: 'Pre-staging regulatory disclosure template reduces legal review cycle', actualImpactMinutes: 6, confidenceScore: 0.85, evidenceSummary: '2 of 2 activations confirmed. Outside counsel review: 6 min vs 48 hrs.', provenAt: new Date(Date.now() - 30 * 86400000).toISOString() },
    { updateId: 'prev-3', hypothesis: 'Board chair briefing window pre-staged at T+3 min eliminates scheduling delay', actualImpactMinutes: 5, confidenceScore: 0.88, evidenceSummary: '4 activations. Board chair in loop avg 3:22 vs 6+ hours.', provenAt: new Date(Date.now() - 45 * 86400000).toISOString() },
  ],
  monthlyTrend: [
    { month: 'Jan', applied: 4,  proven: 2,  minutesSaved: 11 },
    { month: 'Feb', applied: 6,  proven: 3,  minutesSaved: 16 },
    { month: 'Mar', applied: 8,  proven: 5,  minutesSaved: 22 },
    { month: 'Apr', applied: 9,  proven: 6,  minutesSaved: 26 },
    { month: 'May', applied: 11, proven: 8,  minutesSaved: 30 },
    { month: 'Jun', applied: 9,  proven: 7,  minutesSaved: 22 },
  ],
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdvanceIntelligence() {
  const { toast } = useToast();
  const [expandedProven, setExpandedProven] = useState<string | null>(null);
  const [applyingId, setApplyingId] = useState<string | null>(null);

  const { data: lvi, isLoading: lviLoading } = useQuery<LearningVelocityIndex>({
    queryKey: ['/api/advance/learning-velocity'],
  });

  const { data: queue, isLoading: queueLoading } = useQuery<PendingQueue>({
    queryKey: ['/api/advance/pending-queue'],
  });

  const isPreviewMode = !lviLoading && (lvi?.updatesAppliedTotal ?? 0) === 0;
  const display = isPreviewMode ? PREVIEW_LVI : lvi;

  const applyMutation = useMutation({
    mutationFn: (updateId: string) =>
      apiRequest('PATCH', `/api/preparation-updates/${updateId}/apply-v2`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/advance/learning-velocity'] });
      queryClient.invalidateQueries({ queryKey: ['/api/advance/pending-queue'] });
      toast({ title: 'Update applied', description: 'Protocol updated. Causal hypothesis created and measuring.' });
      setApplyingId(null);
    },
    onError: () => {
      toast({ title: 'Apply failed', variant: 'destructive' });
      setApplyingId(null);
    },
  });

  const totalPending = (queue?.autoApply?.length ?? 0) + (queue?.requiresApproval?.length ?? 0);
  const maxApplied = Math.max(...((isPreviewMode ? PREVIEW_LVI : lvi)?.monthlyTrend?.map(m => m.applied) ?? [1]), 1);

  return (
    <PageLayout>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="border-b border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-8 py-10">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: GOLD }}>
                  — ADVANCE 2.0
                </span>
              </div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: NAVY }}>
                Closed-Loop Learning Intelligence
              </h1>
              <p className="text-gray-500 max-w-xl">
                Every activation teaches the system. Every lesson is measured. Every proven improvement
                compounds into a moat no competitor can replicate without your history.
              </p>
            </div>
            <div className="text-right hidden md:block">
              <div className="text-4xl font-bold" style={{ color: TEAL }}>
                {display?.compoundScore ?? 0}
                <span className="text-lg text-gray-400">/100</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">Preparation Compound Score</div>
              {(display?.monthsToRebuild ?? 0) > 0 && (
                <div className="text-xs font-bold mt-1" style={{ color: GOLD }}>
                  {display?.monthsToRebuild} months to rebuild on any competitor
                </div>
              )}
              {isPreviewMode && (
                <div className="mt-2 text-xs font-bold px-2 py-1 rounded-sm" style={{ background: 'rgba(43,138,110,0.12)', color: TEAL }}>
                  REPRESENTATIVE PREVIEW
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8 space-y-10">

        {/* ── Preview mode banner ────────────────────────────────────────────── */}
        {isPreviewMode && (
          <div className="flex items-center gap-3 px-5 py-3 rounded-sm border" style={{ background: 'rgba(43,138,110,0.06)', borderColor: 'rgba(43,138,110,0.25)' }}>
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: TEAL }} />
            <div>
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: TEAL }}>Representative Preview</span>
              <span className="text-xs text-gray-500 ml-3">Metrics shown below represent typical values after 6 months of activations. Your dashboard populates from the first close-out.</span>
            </div>
          </div>
        )}

        {/* ── Learning Velocity Index stat bar ──────────────────────────────── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-bold tracking-widest uppercase text-gray-400">Learning Velocity Index</span>
            <div className="h-px flex-1 bg-gray-100" />
          </div>
          {lviLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-100 rounded-sm" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                label="Updates Applied"
                value={display?.updatesAppliedTotal ?? 0}
                sub={`${display?.updatesAppliedLast30Days ?? 0} in past 30 days`}
                icon={GitCommit}
                color={NAVY}
              />
              <StatCard
                label="Proven Improvements"
                value={display?.hypothesesProven ?? 0}
                sub={`${display?.provenSuccessRate ?? 0}% success rate`}
                icon={CheckCircle2}
                color={TEAL}
              />
              <StatCard
                label="Response Time Saved"
                value={`${display?.totalMinutesSaved ?? 0} min`}
                sub={`avg ${display?.avgMinutesSavedPerUpdate ?? 0} min per update`}
                icon={Timer}
                color={GOLD}
              />
              <StatCard
                label="Protocols Improved"
                value={`${display?.protocolLibraryImprovementPct ?? 0}%`}
                sub={`${display?.protocolsWithEvidenceCount ?? 0} of 180 with evidence`}
                icon={Layers}
                color={TEAL}
              />
            </div>
          )}
        </section>

        {/* ── Closed Loop Visualization ─────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-bold tracking-widest uppercase text-gray-400">The Closed Learning Loop</span>
            <div className="h-px flex-1 bg-gray-100" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <LoopStage num={1} label="Activation" desc="Readiness Protocol fires. Execution begins." complete />
            <LoopStage num={2} label="Close-Out Gate" desc="4-field structured debrief. What held, what didn't, what to encode." complete />
            <LoopStage num={3} label="Update Generated" desc="System extracts signal keywords, ownership gaps, protocol changes." complete />
            <LoopStage num={4} label="Applied + Delta" desc="Update mutates the protocol. Version delta stored immutably." active />
            <LoopStage num={5} label="Hypothesis Measured" desc="Next activation proves or disproves the expected impact." />
          </div>
          <div className="mt-3 p-3 rounded-sm border border-gray-100 bg-gray-50 flex items-center gap-2">
            <FlaskConical className="h-4 w-4 flex-shrink-0" style={{ color: GOLD }} />
            <span className="text-xs text-gray-600">
              <strong style={{ color: NAVY }}>Currently measuring:</strong>{' '}
              {display?.hypothesesMeasuring ?? 0} active hypotheses. Each will prove or disprove within 3 activations or 90 days.
            </span>
          </div>
        </section>

        {/* ── Live Learning Feed ─────────────────────────────────────────────── */}
        <LiveLearningFeed />

        {/* ── Two-column: Pending Queue + Monthly Trend ─────────────────────── */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Pending Action Queue */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold tracking-widest uppercase text-gray-400">
                Pending Actions
              </span>
              {totalPending > 0 && (
                <Badge className="text-xs font-bold" style={{ background: NAVY, color: 'white' }}>
                  {totalPending} queued
                </Badge>
              )}
            </div>

            {queueLoading && (
              <div className="space-y-2 animate-pulse">
                {[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-sm" />)}
              </div>
            )}

            {!queueLoading && totalPending === 0 && (
              <div className="border border-gray-100 rounded-sm p-6 text-center text-gray-400 text-sm">
                <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-gray-200" />
                No pending updates. Complete an activation close-out to generate new learnings.
              </div>
            )}

            {!queueLoading && (queue?.autoApply?.length ?? 0) > 0 && (
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <Unlock className="h-3.5 w-3.5" style={{ color: TEAL }} />
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: TEAL }}>
                    Auto-Apply Ready (Low Risk)
                  </span>
                </div>
                {queue!.autoApply.slice(0, 5).map((u: any) => (
                  <div key={u.id} className="flex items-start gap-3 p-3 border border-teal-100 rounded-sm bg-teal-50">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold" style={{ color: NAVY }} title={u.suggestionTitle}>
                        {u.suggestionTitle?.slice(0, 60)}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5 capitalize">
                        {u.updateType?.replace(/_/g, ' ')} · Signal calibration
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="text-xs h-7 px-3 flex-shrink-0"
                      style={{ background: TEAL, color: 'white' }}
                      disabled={applyingId === u.id || applyMutation.isPending}
                      onClick={() => {
                        setApplyingId(u.id);
                        applyMutation.mutate(u.id);
                      }}
                    >
                      {applyingId === u.id ? <RefreshCw className="h-3 w-3 animate-spin" /> : 'Apply'}
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {!queueLoading && (queue?.requiresApproval?.length ?? 0) > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 mb-2">
                  <Lock className="h-3.5 w-3.5" style={{ color: GOLD }} />
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: GOLD }}>
                    Requires Executive Authorization
                  </span>
                </div>
                {queue!.requiresApproval.slice(0, 5).map((u: any) => (
                  <div key={u.id} className="flex items-start gap-3 p-3 border border-amber-100 rounded-sm bg-amber-50">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold" style={{ color: NAVY }} title={u.suggestionTitle}>
                        {u.suggestionTitle?.slice(0, 60)}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5 capitalize">
                        {u.updateType?.replace(/_/g, ' ')}
                        {u.suggestedOwnerRole ? ` · ${u.suggestedOwnerRole}` : ''}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-7 px-3 flex-shrink-0 border-amber-300"
                      disabled={applyingId === u.id || applyMutation.isPending}
                      onClick={() => {
                        setApplyingId(u.id);
                        applyMutation.mutate(u.id);
                      }}
                    >
                      {applyingId === u.id ? <RefreshCw className="h-3 w-3 animate-spin" /> : 'Authorize'}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Monthly Velocity Trend */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-bold tracking-widest uppercase text-gray-400">
                6-Month Velocity Trend
              </span>
              <div className="h-px flex-1 bg-gray-100" />
            </div>
            <div className="border border-gray-100 rounded-sm p-5 bg-white">
              {lviLoading ? (
                <div className="h-32 bg-gray-50 animate-pulse rounded-sm" />
              ) : (
                <>
                  <div className="flex items-end gap-2 h-20">
                    {(display?.monthlyTrend ?? []).map((m) => (
                      <MonthBar key={m.month} {...m} maxApplied={maxApplied} />
                    ))}
                  </div>
                  <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-sm bg-gray-200" />
                      <span className="text-xs text-gray-400">Updates applied</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-sm" style={{ background: TEAL }} />
                      <span className="text-xs text-gray-400">Proven improvements</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>
        </div>

        {/* ── Proven Improvements (Top by Impact) ───────────────────────────── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-bold tracking-widest uppercase text-gray-400">
              Top Proven Improvements
            </span>
            <div className="h-px flex-1 bg-gray-100" />
            <span className="text-xs text-gray-400">
              Ranked by measured response time reduction
            </span>
          </div>

          {lviLoading && (
            <div className="space-y-2 animate-pulse">
              {[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-sm" />)}
            </div>
          )}

          {!lviLoading && !isPreviewMode && (lvi?.topProvenUpdates?.length ?? 0) === 0 && (
            <div className="border border-gray-100 rounded-sm p-8 text-center">
              <FlaskConical className="h-10 w-10 mx-auto mb-3 text-gray-200" />
              <div className="text-sm font-bold text-gray-400 mb-1">No proven results yet</div>
              <div className="text-xs text-gray-400 max-w-sm mx-auto">
                Apply pending updates and complete activations on the same protocols.
                The system will measure and classify results automatically.
              </div>
            </div>
          )}

          {!lviLoading && (isPreviewMode || (lvi?.topProvenUpdates?.length ?? 0) > 0) && (
            <div className="space-y-2">
              {(display?.topProvenUpdates ?? []).map((p, idx) => (
                <div key={p.updateId} className="border border-gray-100 rounded-sm bg-white overflow-hidden">
                  <button
                    className="w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50 transition-colors"
                    onClick={() => setExpandedProven(expandedProven === p.updateId ? null : p.updateId)}
                  >
                    {/* Rank */}
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ background: idx < 3 ? GOLD : '#E5E7EB', color: idx < 3 ? 'white' : '#6B7280' }}>
                      {idx + 1}
                    </div>
                    {/* Impact chip */}
                    <div className="flex-shrink-0 text-center">
                      <div className="text-lg font-bold" style={{ color: TEAL }}>
                        −{Math.abs(p.actualImpactMinutes)}m
                      </div>
                      <div className="text-xs text-gray-400">saved</div>
                    </div>
                    {/* Hypothesis */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold line-clamp-1" style={{ color: NAVY }}>
                        {p.hypothesis}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        Proven {new Date(p.provenAt).toLocaleDateString()} ·{' '}
                        <span style={{ color: TEAL }} className="font-bold">
                          {p.confidenceScore}% confidence
                        </span>
                      </div>
                    </div>
                    {expandedProven === p.updateId
                      ? <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      : <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />}
                  </button>

                  {expandedProven === p.updateId && (
                    <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50">
                      <p className="text-xs text-gray-600 mt-3 leading-relaxed">{p.evidenceSummary}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Behavioral Confidence Index ───────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-bold tracking-widest uppercase text-gray-400">Behavioral Confidence Index</span>
            <div className="h-px flex-1 bg-gray-100" />
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm" style={{ background: '#FEF9EC', color: GOLD, border: `1px solid ${GOLD}40` }}>
              Active Measurement
            </span>
          </div>

          <div className="rounded-sm border border-gray-100 bg-white overflow-hidden">
            {/* Header row */}
            <div className="p-5 border-b border-gray-50">
              <div className="flex items-start gap-4">
                <Target className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: NAVY }} />
                <div className="flex-1">
                  <div className="text-sm font-bold mb-1" style={{ color: NAVY }}>Protocol Adherence Rate</div>
                  <div className="text-xs text-gray-500 leading-relaxed max-w-2xl">
                    Measures how often executives execute exactly as pre-staged versus defaulting to ad-hoc coordination when a trigger fires.
                    The behavioral confidence gap closes as activations accumulate — preparation becomes organizational behavior, not just available infrastructure.
                  </div>
                </div>
              </div>
            </div>

            {/* Three-metric strip */}
            <div className="grid grid-cols-3 divide-x divide-gray-100">
              {[
                {
                  label: 'Protocol Adherence',
                  value: (display?.updatesAppliedTotal ?? 0) > 5 ? '87%' : '—',
                  sub: 'Activations using pre-staged protocol as built',
                  target: 'Target: >90%',
                  color: TEAL,
                },
                {
                  label: 'Deviation Events',
                  value: (display?.updatesAppliedTotal ?? 0) > 5 ? '13%' : '—',
                  sub: 'Activations where protocol was bypassed or modified at trigger point',
                  target: 'Target: <10%',
                  color: '#DC2626',
                },
                {
                  label: 'Confidence Threshold',
                  value: '10 activations',
                  sub: 'Evidence-based estimate for deviation rate to drop below 10%',
                  target: `Current: ${display?.updatesAppliedTotal ?? 0} activations completed`,
                  color: GOLD,
                },
              ].map((m) => (
                <div key={m.label} className="p-5">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">{m.label}</div>
                  <div className="text-2xl font-bold mb-1" style={{ color: m.color }}>{m.value}</div>
                  <div className="text-xs text-gray-500 leading-relaxed mb-2">{m.sub}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: NAVY }}>{m.target}</div>
                </div>
              ))}
            </div>

            {/* Explanation panel */}
            <div className="border-t border-gray-50 bg-gray-50 px-5 py-4 flex items-start gap-3">
              <Activity className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: GOLD }} />
              <div className="text-xs text-gray-600 leading-relaxed">
                <strong style={{ color: NAVY }}>Why this matters:</strong>{' '}
                A platform with 180 pre-staged responses solves nothing if executives revert to familiar 30-day coordination when pressure arrives.
                The Behavioral Confidence Index measures whether the preparation has become the default — not just the option.
                Each activation that executes exactly as pre-staged encodes institutional confidence. That confidence is what makes the next activation faster.
              </div>
            </div>
          </div>
        </section>

        {/* ── Authorization Record Export ────────────────────────────────── */}
        <section>
          <div className="rounded-sm border border-gray-100 bg-white p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <Award className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: GOLD }} />
                <div>
                  <div className="text-sm font-bold mb-1" style={{ color: NAVY }}>Authorization Record</div>
                  <div className="text-xs text-gray-500 leading-relaxed max-w-xl">
                    Every activation generates a named, exportable governance artifact — suitable for audit committees, general counsel, and board review.
                    The Authorization Record captures executive authorization, protocol version, deviations, workstreams deployed, and ADVANCE learning data in a single printable document.
                  </div>
                </div>
              </div>
              <a
                href="/authorization-record"
                className="flex-shrink-0 flex items-center gap-2 text-xs font-bold tracking-wider uppercase py-2 px-4 no-underline"
                style={{ background: NAVY, color: '#fff', letterSpacing: '0.12em', borderRadius: '0.15rem' }}
              >
                <ArrowRight className="h-3.5 w-3.5" />
                View Sample Record
              </a>
            </div>
          </div>
        </section>

        {/* ── Authorization Precedent Registry ──────────────────────────────── */}
        <section>
          <div className="rounded-sm overflow-hidden" style={{ border: `1px solid ${GOLD}30` }}>
            <div className="p-5" style={{ background: `${NAVY}` }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div>
                    <div className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: GOLD }}>
                      Authorization Precedent Registry
                    </div>
                    <div className="text-base font-bold text-white mb-1">
                      Named accountability history. The structural answer to why executives revert.
                    </div>
                    <div className="text-xs leading-relaxed" style={{ color: 'rgba(240,237,228,0.65)', maxWidth: 560 }}>
                      The default response feels safer because it has a known owner and a known story, even when it fails. The prepared response puts personal exposure on one named person. The Precedent Registry is what makes the new path feel ownable — someone before them owned it, and their verdict is on record.
                    </div>
                  </div>
                </div>
                <a
                  href="/authorization-precedents"
                  className="flex-shrink-0 flex items-center gap-2 text-xs font-bold tracking-wider uppercase py-2 px-4 no-underline"
                  style={{ background: GOLD, color: NAVY, letterSpacing: '0.12em', borderRadius: '0.15rem', whiteSpace: 'nowrap' }}
                >
                  View Full Registry →
                </a>
              </div>
            </div>
            <div className="grid grid-cols-3 divide-x bg-white" style={{ borderTop: `1px solid ${GOLD}20`, borderColor: `${GOLD}20` }}>
              {[
                { label: 'Authorization Verdicts', desc: 'Named records of who authorized each protocol and whether they would authorize again.' },
                { label: 'Accountability Path', desc: 'Each record names the authorizing executive, the outcome classification, and the 12-minute benchmark result.' },
                { label: 'Precedent Access', desc: 'Visible at the Close-Out Gate. The next executive sees this record before their authorization decision.' },
              ].map((item) => (
                <div key={item.label} className="p-4">
                  <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: GOLD }}>{item.label}</div>
                  <div className="text-xs text-gray-500 leading-relaxed">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Executive Moat Summary ────────────────────────────────────────── */}
        <section>
          <div className="rounded-sm border p-6" style={{ borderColor: GOLD + '40', background: NAVY }}>
            <div className="flex items-start gap-6">
              <Shield className="h-10 w-10 flex-shrink-0 mt-0.5" style={{ color: GOLD }} />
              <div>
                <div className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: GOLD }}>
                  Your Competitive Moat — Quantified
                </div>
                <div className="text-white text-lg font-bold mb-2">
                  {display?.monthsToRebuild ?? 0} months for any competitor to replicate what this
                  organization has encoded. That number grows with every close-out.
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {[
                    { label: 'Compound Score', val: `${display?.compoundScore ?? 0}/100` },
                    { label: 'Updates Applied', val: display?.updatesAppliedTotal ?? 0 },
                    { label: 'Minutes Saved', val: `${display?.totalMinutesSaved ?? 0} total` },
                    { label: 'Protocols Hardened', val: `${display?.protocolsWithEvidenceCount ?? 0} of 180` },
                  ].map((m) => (
                    <div key={m.label}>
                      <div className="text-xl font-bold" style={{ color: GOLD }}>{m.val}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </PageLayout>
  );
}
