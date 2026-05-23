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
  AlertTriangle, Lock, Unlock, Timer
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
  const maxApplied = Math.max(...(lvi?.monthlyTrend?.map(m => m.applied) ?? [1]), 1);

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
                {lvi?.compoundScore ?? 0}
                <span className="text-lg text-gray-400">/100</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">Preparation Compound Score</div>
              {(lvi?.monthsToRebuild ?? 0) > 0 && (
                <div className="text-xs font-bold mt-1" style={{ color: GOLD }}>
                  {lvi?.monthsToRebuild} months to rebuild on any competitor
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8 space-y-10">

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
                value={lvi?.updatesAppliedTotal ?? 0}
                sub={`${lvi?.updatesAppliedLast30Days ?? 0} in past 30 days`}
                icon={GitCommit}
                color={NAVY}
              />
              <StatCard
                label="Proven Improvements"
                value={lvi?.hypothesesProven ?? 0}
                sub={`${lvi?.provenSuccessRate ?? 0}% success rate`}
                icon={CheckCircle2}
                color={TEAL}
              />
              <StatCard
                label="Response Time Saved"
                value={`${lvi?.totalMinutesSaved ?? 0} min`}
                sub={`avg ${lvi?.avgMinutesSavedPerUpdate ?? 0} min per update`}
                icon={Timer}
                color={GOLD}
              />
              <StatCard
                label="Protocols Improved"
                value={`${lvi?.protocolLibraryImprovementPct ?? 0}%`}
                sub={`${lvi?.protocolsWithEvidenceCount ?? 0} of 180 with evidence`}
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
              {lvi?.hypothesesMeasuring ?? 0} active hypotheses. Each will prove or disprove within 3 activations or 90 days.
            </span>
          </div>
        </section>

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
                    {(lvi?.monthlyTrend ?? []).map((m) => (
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

          {!lviLoading && (lvi?.topProvenUpdates?.length ?? 0) === 0 && (
            <div className="border border-gray-100 rounded-sm p-8 text-center">
              <FlaskConical className="h-10 w-10 mx-auto mb-3 text-gray-200" />
              <div className="text-sm font-bold text-gray-400 mb-1">No proven results yet</div>
              <div className="text-xs text-gray-400 max-w-sm mx-auto">
                Apply pending updates and complete activations on the same protocols.
                The system will measure and classify results automatically.
              </div>
            </div>
          )}

          {!lviLoading && (lvi?.topProvenUpdates?.length ?? 0) > 0 && (
            <div className="space-y-2">
              {lvi!.topProvenUpdates.map((p, idx) => (
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
                  {lvi?.monthsToRebuild ?? 0} months for any competitor to replicate what this
                  organization has encoded. That number grows with every close-out.
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {[
                    { label: 'Compound Score', val: `${lvi?.compoundScore ?? 0}/100` },
                    { label: 'Updates Applied', val: lvi?.updatesAppliedTotal ?? 0 },
                    { label: 'Minutes Saved', val: `${lvi?.totalMinutesSaved ?? 0} total` },
                    { label: 'Protocols Hardened', val: `${lvi?.protocolsWithEvidenceCount ?? 0} of 180` },
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
