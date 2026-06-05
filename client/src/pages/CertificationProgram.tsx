import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import {
  Award, CheckCircle2, Clock, ArrowRight, Shield,
  RefreshCw, Zap, Users, GitBranch, Play,
  Star, Calendar, Building2, Lock, Unlock, ChevronDown, ChevronRight
} from 'lucide-react';

const NAVY  = '#0A0F2E';
const GOLD  = '#C9A84C';
const TEAL  = '#2B8A6E';

// ─── Phase definitions ────────────────────────────────────────────────────────
const PHASES = [
  {
    num: 1,
    label: 'Protocol Configuration',
    days: 'Days 1–7',
    icon: GitBranch,
    description: 'Configure your Readiness Protocol library, map triggers to protocols, and assign stakeholder roles across all 3 strategic domains.',
    milestones: [
      { key: 'protocolCount', label: 'Readiness Protocols configured', target: 10, unit: 'protocols' },
      { key: 'triggerCount', label: 'Triggers mapped and armed', target: 5, unit: 'triggers' },
      { key: 'stakeholderCount', label: 'Stakeholders assigned and notified', target: 8, unit: 'stakeholders' },
    ],
    completeAction: 'Confirm Protocol Library Ready',
    demoData: { protocolCount: 12, triggerCount: 8, stakeholderCount: 10 },
  },
  {
    num: 2,
    label: 'Integration Setup',
    days: 'Days 8–14',
    icon: Zap,
    description: 'Connect your Microsoft 365 stack, validate webhook flows across Teams, SharePoint, and Power Automate, and run integration health checks.',
    milestones: [
      { key: 'connectorCount', label: 'Microsoft 365 connectors active', target: 3, unit: 'connectors' },
      { key: 'webhookTests', label: 'Webhook flows validated end-to-end', target: 3, unit: 'flows' },
      { key: 'teamsTest', label: 'Teams notification test passed', target: 1, unit: 'test' },
    ],
    completeAction: 'Confirm Integrations Validated',
    demoData: { connectorCount: 4, webhookTests: 4, teamsTest: 1 },
  },
  {
    num: 3,
    label: 'Drill & Validate',
    days: 'Days 15–21',
    icon: Play,
    description: 'Run 3 timed practice drills across different scenario types. Each drill measures actual response time. You must hit sub-15-minute execution to advance.',
    milestones: [
      { key: 'drillsCompleted', label: 'Practice drills completed', target: 3, unit: 'drills' },
      { key: 'bestTime', label: 'Best drill response time', target: 15, unit: 'min or less' },
      { key: 'stakeholderParticipation', label: 'Stakeholder participation rate', target: 80, unit: '%' },
    ],
    completeAction: 'Submit Drill Results',
    demoData: { drillsCompleted: 3, bestTime: 11, stakeholderParticipation: 92, responseTimeSeconds: 660 },
  },
  {
    num: 4,
    label: 'Live Certification',
    days: 'Days 22–30',
    icon: Award,
    description: 'One final live drill, unannounced, against an unfamiliar scenario. A VaughnMartin observer timestamps the activation. Sub-12-minute execution earns certification.',
    milestones: [
      { key: 'liveTrialCompleted', label: 'Live certification drill completed', target: 1, unit: 'drill' },
      { key: 'responseTime', label: 'Certified response time achieved', target: 720, unit: 'sec or less' },
      { key: 'deviationRate', label: 'Protocol adherence rate', target: 95, unit: '% min' },
    ],
    completeAction: 'Issue Certification',
    demoData: { liveTrialCompleted: 1, responseTime: 710, deviationRate: 97, responseTimeSeconds: 710 },
  },
];

function PhaseCard({
  phase, isActive, isComplete, isFuture, onComplete, completing
}: {
  phase: typeof PHASES[0];
  isActive: boolean;
  isComplete: boolean;
  isFuture: boolean;
  onComplete: (data: any) => void;
  completing: boolean;
}) {
  const [expanded, setExpanded] = useState(isActive);
  const Icon = phase.icon;

  const borderColor = isComplete ? TEAL : isActive ? GOLD : '#E5E7EB';
  const bgColor = isComplete ? '#F0FDF4' : isActive ? '#FFFBEB' : 'white';

  return (
    <div className="rounded-sm border overflow-hidden" style={{ borderColor, background: bgColor }}>
      <button
        className="w-full flex items-center gap-4 p-5 text-left"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Phase number / status icon */}
        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
          style={{
            background: isComplete ? TEAL : isActive ? GOLD : '#E5E7EB',
            color: isComplete || isActive ? 'white' : '#9CA3AF',
          }}>
          {isComplete ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-4 w-4" />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-0.5">
            <span className="text-sm font-bold" style={{ color: NAVY }}>{phase.label}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm"
              style={{
                background: isComplete ? TEAL + '20' : isActive ? GOLD + '20' : '#F3F4F6',
                color: isComplete ? TEAL : isActive ? GOLD : '#9CA3AF',
              }}>
              {isComplete ? 'Complete' : isActive ? 'In Progress' : phase.days}
            </span>
          </div>
          <p className="text-xs text-gray-500 line-clamp-1">{phase.description}</p>
        </div>

        {expanded ? <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" /> : <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />}
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t" style={{ borderColor }}>
          <p className="text-sm text-gray-600 leading-relaxed mt-4 mb-5">{phase.description}</p>

          {/* Milestones */}
          <div className="space-y-3 mb-5">
            {phase.milestones.map(m => (
              <div key={m.key} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${isComplete ? 'bg-teal-500' : isFuture ? 'bg-gray-200' : 'bg-amber-400'}`}>
                  {isComplete ? <CheckCircle2 className="h-3 w-3 text-white" /> : <span className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <span className="text-xs text-gray-600 flex-1">{m.label}</span>
                <span className="text-xs font-bold" style={{ color: isComplete ? TEAL : NAVY }}>
                  {isComplete
                    ? `${m.target} ${m.unit}`
                    : isActive
                      ? `Target: ${m.target} ${m.unit}`
                      : <Lock className="h-3 w-3 text-gray-300" />}
                </span>
              </div>
            ))}
          </div>

          {isActive && (
            <Button
              className="w-full text-xs gap-2"
              style={{ background: GOLD, color: NAVY }}
              disabled={completing}
              onClick={() => onComplete(phase.demoData)}
            >
              {completing
                ? <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                : <CheckCircle2 className="h-3.5 w-3.5" />}
              {phase.completeAction}
            </Button>
          )}

          {isFuture && (
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Lock className="h-3.5 w-3.5" />
              Complete Phase {phase.num - 1} to unlock
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CertificationBadge({ record }: { record: any }) {
  const mins = Math.floor((record.certifiedResponseTimeSeconds ?? 720) / 60);
  const secs = (record.certifiedResponseTimeSeconds ?? 720) % 60;
  const timeStr = `${mins}m ${secs > 0 ? secs + 's' : ''}`.trim();
  const certDate = record.certifiedAt ? new Date(record.certifiedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';

  return (
    <div className="relative rounded-sm overflow-hidden border-2 p-8 text-center" style={{ borderColor: GOLD, background: NAVY }}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'repeating-linear-gradient(45deg, #C9A84C, #C9A84C 1px, transparent 1px, transparent 20px)' }} />

      <div className="relative z-10">
        <Award className="h-16 w-16 mx-auto mb-4" style={{ color: GOLD }} />

        <div className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: GOLD }}>
          VaughnMartin · Readiness OS
        </div>
        <div className="text-2xl font-bold text-white mb-1">
          12-Minute Readiness Certified
        </div>
        <div className="text-lg font-bold mb-4" style={{ color: GOLD }}>
          {record.organizationName}
        </div>

        <div className="inline-flex items-center gap-3 bg-white/10 rounded-sm px-6 py-3 mb-4">
          <div className="text-center">
            <div className="text-3xl font-bold" style={{ color: GOLD }}>{timeStr}</div>
            <div className="text-xs text-white/60 mt-0.5">Certified Response Time</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto mb-5">
          <div className="bg-white/10 rounded-sm p-3">
            <div className="text-sm font-bold text-white">{record.certificationNumber}</div>
            <div className="text-[10px] text-white/50 mt-0.5">Certificate Number</div>
          </div>
          <div className="bg-white/10 rounded-sm p-3">
            <div className="text-sm font-bold text-white">{certDate}</div>
            <div className="text-[10px] text-white/50 mt-0.5">Certification Date</div>
          </div>
        </div>

        <div className="text-xs text-white/50">
          Valid through {record.expiresAt ? new Date(record.expiresAt).toLocaleDateString() : 'N/A'}
          {' · '}Annual recertification required
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CertificationProgram() {
  const { toast } = useToast();
  const [completing, setCompleting] = useState(false);

  const { data: record, isLoading } = useQuery<any>({
    queryKey: ['/api/certification'],
  });

  const completePhaseMutation = useMutation({
    mutationFn: ({ phase, phaseData }: { phase: number; phaseData: any }) =>
      apiRequest('POST', '/api/certification/complete-phase', { phase, phaseData }).then(r => r.json()),
    onSuccess: (updated: any) => {
      queryClient.invalidateQueries({ queryKey: ['/api/certification'] });
      setCompleting(false);
      if (updated.status === 'certified') {
        toast({
          title: '🏆 Certification Issued',
          description: `${updated.organizationName} is officially certified. Response time: ${Math.floor((updated.certifiedResponseTimeSeconds ?? 720) / 60)} minutes.`,
        });
      } else {
        toast({ title: `Phase ${updated.currentPhase - 1} complete`, description: 'Advancing to next phase.' });
      }
    },
    onError: () => {
      setCompleting(false);
      toast({ title: 'Failed to complete phase', variant: 'destructive' });
    },
  });

  const resetMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/certification/reset', {}).then(r => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/certification'] });
      toast({ title: 'Certification reset', description: 'Starting fresh from Phase 1.' });
    },
  });

  const completedPhases: number[] = record?.completedPhases ?? [];
  const currentPhase: number = record?.currentPhase ?? 1;
  const isCertified = record?.status === 'certified';
  const progressPct = (completedPhases.length / 4) * 100;

  return (
    <PageLayout>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="border-b border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto px-8 py-10">
          <div className="flex items-start justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: GOLD }}>
                  — BOARD PRIORITY 3
                </span>
              </div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: NAVY }}>
                12-Minute Certification Program
              </h1>
              <p className="text-gray-500 max-w-xl leading-relaxed">
                A structured 30-day path that produces one measurable outcome: a certified organizational response time.
                Not a promise. A timestamp. A number you can put in a board presentation, a procurement document, and an insurance filing.
              </p>
            </div>

            {isCertified && (
              <div className="flex-shrink-0">
                <div className="text-center bg-teal-50 border border-teal-200 rounded-sm p-4">
                  <CheckCircle2 className="h-8 w-8 mx-auto mb-1" style={{ color: TEAL }} />
                  <div className="text-sm font-bold" style={{ color: TEAL }}>Certified</div>
                  <div className="text-xs text-gray-500">{record?.certificationNumber}</div>
                </div>
              </div>
            )}
          </div>

          {/* Blakely framing */}
          <div className="mt-6 p-4 rounded-sm border" style={{ borderColor: NAVY + '20', background: NAVY + '06' }}>
            <p className="text-xs text-gray-600 leading-relaxed">
              <strong style={{ color: NAVY }}>Blakely Directive:</strong>{' '}
              "The 12-minute promise is on every page — but has a real human, outside your team, actually executed in 12 minutes
              without hand-holding? That's the gap. The Founding Partner program needs a defined path:
              Day 1 protocol upload, Day 3 first trigger drill, Day 7 first live authorization.
              If you can't define those three milestones, the 90-day validation is just a fancy pilot with no success criteria."
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-8">

        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            {[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-sm" />)}
          </div>
        ) : (
          <>
            {/* ── Progress bar ──────────────────────────────────────────────── */}
            <div className="bg-white border border-gray-100 rounded-sm p-5 mb-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm font-bold" style={{ color: NAVY }}>
                    {isCertified ? 'Certification Complete' : `Phase ${currentPhase} of 4 — ${PHASES[currentPhase - 1]?.label}`}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {completedPhases.length} of 4 phases complete
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold" style={{ color: isCertified ? TEAL : GOLD }}>
                    {Math.round(progressPct)}%
                  </div>
                  <div className="text-xs text-gray-400">Progress</div>
                </div>
              </div>
              <Progress value={progressPct} className="h-2" />
              <div className="flex justify-between mt-2">
                {PHASES.map(p => (
                  <div key={p.num} className="flex flex-col items-center gap-1">
                    <div className="w-2.5 h-2.5 rounded-full"
                      style={{ background: completedPhases.includes(p.num) ? TEAL : p.num === currentPhase && !isCertified ? GOLD : '#E5E7EB' }} />
                    <span className="text-[10px] text-gray-400 hidden md:block">{p.days}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Certified badge ────────────────────────────────────────────── */}
            {isCertified && (
              <div className="mb-6">
                <CertificationBadge record={record} />
                <div className="mt-3 flex justify-center">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs gap-1.5"
                    onClick={() => resetMutation.mutate()}
                    disabled={resetMutation.isPending}
                  >
                    <RefreshCw className="h-3 w-3" />
                    Restart Certification (Demo Reset)
                  </Button>
                </div>
              </div>
            )}

            {/* ── Phase cards ────────────────────────────────────────────────── */}
            {!isCertified && (
              <div className="space-y-3 mb-6">
                {PHASES.map(phase => (
                  <PhaseCard
                    key={phase.num}
                    phase={phase}
                    isActive={phase.num === currentPhase && !isCertified}
                    isComplete={completedPhases.includes(phase.num)}
                    isFuture={phase.num > currentPhase}
                    completing={completing && phase.num === currentPhase}
                    onComplete={(data) => {
                      setCompleting(true);
                      completePhaseMutation.mutate({ phase: phase.num, phaseData: data });
                    }}
                  />
                ))}
              </div>
            )}

            {/* ── What Certification Means ───────────────────────────────────── */}
            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  icon: Building2,
                  title: 'Board Presentation Asset',
                  body: 'A timestamped certification number with your organization\'s certified response time. Concrete evidence for any board conversation about crisis readiness.',
                },
                {
                  icon: Shield,
                  title: 'Procurement Differentiator',
                  body: 'Enterprise procurement teams ask: "How fast can you respond?" Certification gives you a specific, auditable answer — not a claim, a proof.',
                },
                {
                  icon: Star,
                  title: 'Insurance & Regulatory Signal',
                  body: 'Cyber insurers and regulators increasingly reward organizations that can demonstrate pre-staged response. Certification is that demonstration.',
                },
              ].map((card, i) => {
                const Icon = card.icon;
                return (
                  <div key={i} className="bg-white border border-gray-100 rounded-sm p-5 shadow-sm">
                    <Icon className="h-5 w-5 mb-3" style={{ color: GOLD }} />
                    <div className="text-sm font-bold mb-2" style={{ color: NAVY }}>{card.title}</div>
                    <p className="text-xs text-gray-500 leading-relaxed">{card.body}</p>
                  </div>
                );
              })}
            </div>

            {/* ── Timeline overview ──────────────────────────────────────────── */}
            <div className="mt-6 border border-gray-100 rounded-sm bg-white p-6">
              <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-5">30-Day Timeline</div>
              <div className="space-y-2">
                {[
                  { days: 'Day 1', label: 'Protocol library configured — triggers armed, stakeholders mapped' },
                  { days: 'Day 3', label: 'First trigger drill — unannounced, timed, debriefed' },
                  { days: 'Day 7', label: 'First live authorization — real executive sign-off captured' },
                  { days: 'Day 14', label: 'Microsoft 365 connectors validated — Teams, SharePoint, Automate' },
                  { days: 'Day 21', label: '3rd practice drill — must achieve sub-15-minute execution' },
                  { days: 'Day 28', label: 'Live certification drill — unfamiliar scenario, observer timestamps' },
                  { days: 'Day 30', label: 'Certification issued — number, timestamp, response time on record' },
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-14 text-xs font-bold flex-shrink-0" style={{ color: GOLD }}>{step.days}</div>
                    <div className="h-px flex-1 border-t border-dashed border-gray-200" />
                    <div className="text-xs text-gray-600 flex-1">{step.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
}
