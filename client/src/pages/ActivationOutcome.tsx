import { useState } from "react";
import { useParams, Link, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import PageLayout from "@/components/layout/PageLayout";
import { ExecutionStageGuide } from "@/components/ExecutionStageGuide";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft, CheckCircle2, Clock, Zap, Brain, AlertTriangle,
  BookOpen, TrendingUp, Users, Star, ArrowRight, Target,
  Shield, BarChart3, FileText, CheckCircle, ChevronRight,
  Loader2, Award, Activity
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const RED = "#dc2626";
const OFF = "#F8F7F4";
const BORDER = "#E8E4DC";
const MUTED = "#6B7280";
const CG = { fontFamily: "'Cormorant Garamond', Georgia, serif" };

const WIZARD_STEPS = [
  { id: 'summary', label: 'Situation Summary', icon: Target },
  { id: 'timeline', label: 'Timeline Review', icon: Clock },
  { id: 'decisions', label: 'Key Decisions', icon: Brain },
  { id: 'performance', label: 'Performance vs. Benchmark', icon: BarChart3 },
  { id: 'learning', label: 'Learning Capture', icon: TrendingUp },
  { id: 'board-brief', label: 'Board Brief', icon: FileText },
];

const DECISION_TYPES = [
  'Escalated to board level',
  'Budget authorization issued',
  'External experts engaged',
  'Communication released publicly',
  'Regulatory notification filed',
  'Operations paused/modified',
  'Key personnel reassigned',
  'Partner/supplier notified',
];

const PEER_BENCHMARKS: Record<string, { p25: number; p50: number; p75: number; label: string }> = {
  taskCompletion: { p25: 62, p50: 78, p75: 91, label: 'Task Completion Rate' },
  timeToContain: { p25: 48, p50: 28, p75: 14, label: 'Time to Milestone (min)' },
  stakeholderLoop: { p25: 45, p50: 22, p75: 11, label: 'Stakeholder Loop Time (min)' },
};

function percentileLabel(value: number, benchmark: { p25: number; p50: number; p75: number }): { label: string; color: string } {
  if (value >= benchmark.p75) return { label: 'Top Quartile', color: TEAL };
  if (value >= benchmark.p50) return { label: 'Above Median', color: GOLD };
  if (value >= benchmark.p25) return { label: 'Below Median', color: GOLD };
  return { label: 'Bottom Quartile', color: RED };
}

export default function ActivationOutcome() {
  const { activationId } = useParams<{ activationId: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [step, setStep] = useState(0);
  const [humanNote, setHumanNote] = useState("");
  const [noteSaved, setNoteSaved] = useState(false);
  const [selectedDecisions, setSelectedDecisions] = useState<string[]>([]);
  const [additionalDecision, setAdditionalDecision] = useState("");
  const [lessonsLearned, setLessonsLearned] = useState("");
  const [wouldChange, setWouldChange] = useState("");
  const [playbookRating, setPlaybookRating] = useState(0);

  const { data: outcome, isLoading, refetch } = useQuery<any>({
    queryKey: ["/api/activation-outcomes", activationId],
    queryFn: () => fetch(`/api/activation-outcomes/${activationId}`).then(r => r.json()),
    enabled: !!activationId,
    retry: false,
  });

  const createMutation = useMutation({
    mutationFn: (body: { activationId: string; playbookId: string }) =>
      apiRequest("POST", "/api/activation-outcomes", body),
    onSuccess: () => { refetch(); toast({ title: "Outcome record created" }); },
  });

  const saveNoteMutation = useMutation({
    mutationFn: ({ id, note }: { id: string; note: string }) =>
      apiRequest("PATCH", `/api/activation-outcomes/${id}/note`, { humanNote: note }),
    onSuccess: () => {
      setNoteSaved(true);
      queryClient.invalidateQueries({ queryKey: ["/api/activation-outcomes", activationId] });
      toast({ title: "Note saved", description: "Your insight has been captured." });
    },
  });

  const generateMutation = useMutation({
    mutationFn: (id: string) => apiRequest("POST", `/api/activation-outcomes/${id}/generate`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/activation-outcomes", activationId] });
      toast({ title: "AI Summary generated", description: "Your ADVANCE outcome report is ready." });
    },
    onError: () => toast({ title: "Generation failed", description: "Check API configuration.", variant: "destructive" }),
  });

  const taskCompletionRate = outcome?.totalTasks > 0
    ? Math.round((outcome.tasksCompleted / outcome.totalTasks) * 100)
    : 0;

  const toggleDecision = (d: string) => {
    setSelectedDecisions(prev =>
      prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]
    );
  };

  const isLastStep = step === WIZARD_STEPS.length - 1;

  return (
    <PageLayout>
      <div style={{ background: OFF, minHeight: "100vh" }}>
        {/* Header */}
        <div style={{ background: NAVY, padding: "40px 0 32px" }}>
          <div className="container mx-auto px-6">
            <Link href="/institutional-memory">
              <Button variant="ghost" className="text-white/60 hover:text-white mb-4 p-0 h-auto font-normal">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Institutional Memory
              </Button>
            </Link>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>ADVANCE Phase · Outcome Debrief</span>
            </div>
            <h1 style={{ ...CG, fontWeight: 700, fontSize: 36, color: "#fff", lineHeight: 1.1, marginBottom: 8 }}>
              Post-Execution <em style={{ fontStyle: "italic", color: GOLD }}>Debrief</em>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, maxWidth: 560 }}>
              Close the ADVANCE loop. Every activation feeds institutional memory — making your next response faster, sharper, and more coordinated.
            </p>
          </div>
        </div>

        <ExecutionStageGuide variant="compact" />
        <div className="container mx-auto px-6 py-8 max-w-4xl">
          {isLoading ? (
            <div style={{ textAlign: "center", padding: 60, color: MUTED }}>Loading debrief data...</div>
          ) : !outcome || outcome?.error ? (
            <Card style={{ border: `1px solid ${BORDER}`, borderRadius: 0 }}>
              <CardContent className="p-8 text-center">
                <BookOpen className="h-10 w-10 mx-auto mb-4" style={{ color: GOLD }} />
                <h3 style={{ ...CG, fontSize: 22, fontWeight: 600, color: NAVY, marginBottom: 8 }}>No Outcome Record Found</h3>
                <p style={{ color: MUTED, fontSize: 14, marginBottom: 20 }}>Initialize an outcome record to begin the debrief process.</p>
                <Button
                  onClick={() => createMutation.mutate({ activationId: activationId!, playbookId: "unknown" })}
                  disabled={createMutation.isPending}
                  style={{ background: NAVY, color: "#fff", borderRadius: 0 }}
                >
                  {createMutation.isPending ? "Creating..." : "Initialize Debrief Record"}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">

              {/* Stats Strip */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                {[
                  { icon: CheckCircle2, label: "Task Completion", value: `${taskCompletionRate}%`, color: taskCompletionRate >= 80 ? TEAL : taskCompletionRate >= 50 ? GOLD : RED },
                  { icon: Zap, label: "Tasks Done", value: `${outcome.tasksCompleted ?? 0} / ${outcome.totalTasks ?? 0}`, color: NAVY },
                  { icon: Clock, label: "Execution Time", value: outcome.actualMinutes ? `${outcome.actualMinutes}m` : "—", color: NAVY },
                  { icon: Award, label: "12-Min Target", value: outcome.targetMet === true ? "Hit ✓" : outcome.targetMet === false ? "Missed" : "—", color: outcome.targetMet === true ? TEAL : outcome.targetMet === false ? RED : MUTED },
                ].map(({ icon: Icon, label, value, color }) => (
                  <Card key={label} style={{ border: `1px solid ${BORDER}`, borderRadius: 0, borderTop: `3px solid ${color}` }}>
                    <CardContent className="p-4 text-center">
                      <Icon className="h-5 w-5 mx-auto mb-2" style={{ color }} />
                      <div style={{ fontSize: 22, fontWeight: 700, color, ...CG, lineHeight: 1.2 }}>{value}</div>
                      <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: MUTED, marginTop: 4 }}>{label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Wizard Step Progress */}
              <div style={{ background: "#fff", border: `1px solid ${BORDER}`, padding: "20px 24px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#9CA3AF", marginBottom: 16 }}>Debrief Progress</div>
                <div style={{ display: "flex", gap: 0, alignItems: "center" }}>
                  {WIZARD_STEPS.map((s, i) => {
                    const Icon = s.icon;
                    const done = i < step;
                    const active = i === step;
                    return (
                      <div key={s.id} style={{ display: "flex", alignItems: "center", flex: i < WIZARD_STEPS.length - 1 ? 1 : 'none' }}>
                        <button onClick={() => setStep(i)}
                          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", border: "none", background: "none", padding: "0 4px" }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: "50%",
                            background: done ? TEAL : active ? NAVY : "#F3F4F6",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            border: active ? `2px solid ${GOLD}` : "none",
                            transition: "all 0.2s",
                          }}>
                            {done ? <CheckCircle style={{ width: 14, height: 14, color: "#fff" }} /> : <Icon style={{ width: 14, height: 14, color: active ? "#fff" : "#9CA3AF" }} />}
                          </div>
                          <div style={{ fontSize: 9, fontWeight: 700, color: active ? NAVY : done ? TEAL : "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{s.label}</div>
                        </button>
                        {i < WIZARD_STEPS.length - 1 && (
                          <div style={{ flex: 1, height: 1, background: done ? TEAL : "#E5E7EB", margin: "0 4px", marginBottom: 16 }} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ─── Step Content ─── */}

              {/* Step 0: Summary */}
              {step === 0 && (
                <Card style={{ border: `1px solid ${BORDER}`, borderLeft: `4px solid ${GOLD}`, borderRadius: 0 }}>
                  <CardContent className="p-6 space-y-4">
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                      <Target style={{ width: 18, height: 18, color: GOLD }} />
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD }}>Situation Summary</span>
                    </div>
                    <h3 style={{ ...CG, fontSize: 22, fontWeight: 600, color: NAVY, marginBottom: 6 }}>What happened?</h3>
                    <p style={{ fontSize: 13, color: MUTED, marginBottom: 16 }}>
                      Summarize the situation that triggered this activation — the event, initial scope, and how it was identified.
                    </p>
                    <Textarea
                      value={humanNote}
                      onChange={e => setHumanNote(e.target.value)}
                      placeholder="e.g. 'Ransomware detected in APAC infrastructure at 14:32. Immediate containment protocol activated. Systems isolated within 18 minutes. No confirmed data exfiltration at close.'"
                      style={{ minHeight: 120, borderRadius: 0, border: `1px solid ${BORDER}`, fontSize: 13 }}
                    />
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <div style={{ fontSize: 11, color: MUTED }}>Situation severity:&nbsp;</div>
                      {['Critical', 'High', 'Medium'].map(s => (
                        <button key={s} style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", padding: "4px 10px", border: `1px solid ${BORDER}`, background: "none", cursor: "pointer", color: NAVY }}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 1: Timeline */}
              {step === 1 && (
                <Card style={{ border: `1px solid ${BORDER}`, borderLeft: `4px solid ${TEAL}`, borderRadius: 0 }}>
                  <CardContent className="p-6">
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                      <Clock style={{ width: 18, height: 18, color: TEAL }} />
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: TEAL }}>Timeline Review</span>
                    </div>
                    <h3 style={{ ...CG, fontSize: 22, fontWeight: 600, color: NAVY, marginBottom: 16 }}>How did time flow?</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {[
                        { milestone: 'Trigger Detected', target: '00:00', actual: '00:00', status: 'hit' },
                        { milestone: 'Playbook Activated', target: '00:02', actual: outcome.actualMinutes ? '00:03' : '—', status: 'hit' },
                        { milestone: 'First Stakeholder Engaged', target: '00:04', actual: '00:07', status: 'miss' },
                        { milestone: 'Phase 1 Complete', target: '00:12', actual: outcome.actualMinutes ? `00:${outcome.actualMinutes}` : '—', status: outcome.targetMet ? 'hit' : 'miss' },
                        { milestone: 'Board Notified', target: '00:15', actual: '00:22', status: 'miss' },
                        { milestone: 'Containment Confirmed', target: '01:00', actual: '01:14', status: 'near' },
                      ].map((m, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 14px", background: OFF, border: `1px solid ${BORDER}` }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: m.status === 'hit' ? TEAL : m.status === 'near' ? GOLD : RED, flexShrink: 0 }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>{m.milestone}</div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: 10, color: MUTED }}>Target</div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: NAVY }}>{m.target}</div>
                          </div>
                          <div style={{ textAlign: "right", minWidth: 60 }}>
                            <div style={{ fontSize: 10, color: MUTED }}>Actual</div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: m.status === 'hit' ? TEAL : m.status === 'miss' ? RED : GOLD }}>{m.actual}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Decisions */}
              {step === 2 && (
                <Card style={{ border: `1px solid ${BORDER}`, borderLeft: `4px solid ${NAVY}`, borderRadius: 0 }}>
                  <CardContent className="p-6">
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                      <Brain style={{ width: 18, height: 18, color: NAVY }} />
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: NAVY }}>Key Decisions Made</span>
                    </div>
                    <h3 style={{ ...CG, fontSize: 22, fontWeight: 600, color: NAVY, marginBottom: 6 }}>What decisions were made?</h3>
                    <p style={{ fontSize: 13, color: MUTED, marginBottom: 16 }}>Select all decision types that were made during this activation. This becomes the legal-grade decision record.</p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginBottom: 16 }}>
                      {DECISION_TYPES.map(d => {
                        const selected = selectedDecisions.includes(d);
                        return (
                          <button key={d} onClick={() => toggleDecision(d)}
                            style={{
                              display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
                              border: `1px solid ${selected ? TEAL : BORDER}`,
                              background: selected ? `${TEAL}08` : "#fff",
                              cursor: "pointer", textAlign: "left",
                              transition: "all 0.15s",
                            }}>
                            <div style={{ width: 16, height: 16, border: `2px solid ${selected ? TEAL : "#D1D5DB"}`, background: selected ? TEAL : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              {selected && <CheckCircle style={{ width: 10, height: 10, color: "#fff" }} />}
                            </div>
                            <span style={{ fontSize: 12, color: NAVY }}>{d}</span>
                          </button>
                        );
                      })}
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>Additional decision not listed</div>
                      <Textarea
                        value={additionalDecision}
                        onChange={e => setAdditionalDecision(e.target.value)}
                        placeholder="Describe any other significant decisions made during this activation..."
                        style={{ minHeight: 80, borderRadius: 0, border: `1px solid ${BORDER}`, fontSize: 13 }}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Performance */}
              {step === 3 && (
                <Card style={{ border: `1px solid ${BORDER}`, borderLeft: `4px solid ${GOLD}`, borderRadius: 0 }}>
                  <CardContent className="p-6">
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                      <BarChart3 style={{ width: 18, height: 18, color: GOLD }} />
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD }}>Performance vs. Benchmark</span>
                    </div>
                    <h3 style={{ ...CG, fontSize: 22, fontWeight: 600, color: NAVY, marginBottom: 16 }}>How did this compare to peers?</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      {[
                        { label: "Task Completion Rate", value: taskCompletionRate, bm: PEER_BENCHMARKS.taskCompletion, suffix: "%" },
                        { label: "Time to Initial Containment", value: outcome.actualMinutes ?? 0, bm: PEER_BENCHMARKS.timeToContain, suffix: " min", lowerIsBetter: true },
                      ].map((m, i) => {
                        const percentile = percentileLabel(m.lowerIsBetter ? (100 - m.value) : m.value, m.bm);
                        return (
                          <div key={i} style={{ padding: "16px 18px", background: OFF, border: `1px solid ${BORDER}` }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 10 }}>
                              <div>
                                <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>{m.label}</div>
                                <div style={{ ...CG, fontSize: 30, fontWeight: 700, color: NAVY, lineHeight: 1 }}>{m.value}{m.suffix}</div>
                              </div>
                              <div style={{ textAlign: "right" }}>
                                <div style={{ fontSize: 10, color: MUTED }}>Your performance</div>
                                <div style={{ fontSize: 12, fontWeight: 700, color: percentile.color }}>{percentile.label}</div>
                              </div>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: 8 }}>
                              {[
                                { label: "Bottom Quartile", value: m.bm.p25, suffix: m.suffix },
                                { label: "Median (peer)", value: m.bm.p50, suffix: m.suffix },
                                { label: "Top Quartile", value: m.bm.p75, suffix: m.suffix },
                              ].map((b, bi) => (
                                <div key={bi} style={{ textAlign: "center", padding: "8px", background: "#fff", border: `1px solid ${BORDER}` }}>
                                  <div style={{ fontSize: 11, color: MUTED, marginBottom: 2 }}>{b.label}</div>
                                  <div style={{ fontSize: 16, fontWeight: 700, color: NAVY }}>{b.value}{b.suffix}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 4: Learning */}
              {step === 4 && (
                <Card style={{ border: `1px solid ${BORDER}`, borderLeft: `4px solid ${TEAL}`, borderRadius: 0 }}>
                  <CardContent className="p-6 space-y-6">
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                      <TrendingUp style={{ width: 18, height: 18, color: TEAL }} />
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: TEAL }}>Learning Capture</span>
                    </div>
                    <h3 style={{ ...CG, fontSize: 22, fontWeight: 600, color: NAVY }}>What did this teach us?</h3>

                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.1em" }}>What would you do differently?</div>
                      <Textarea
                        value={wouldChange}
                        onChange={e => setWouldChange(e.target.value)}
                        placeholder="e.g. 'Legal should be looped in at Phase 1 rather than Phase 2. The 7-minute delay in CLO notification added 40 minutes to the regulatory review.'"
                        style={{ minHeight: 100, borderRadius: 0, border: `1px solid ${BORDER}`, fontSize: 13 }}
                      />
                    </div>

                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.1em" }}>Lessons for the playbook</div>
                      <Textarea
                        value={lessonsLearned}
                        onChange={e => setLessonsLearned(e.target.value)}
                        placeholder="e.g. 'Add a dedicated task for external forensics engagement in Phase 1 — this was ad hoc and cost 25 minutes.'"
                        style={{ minHeight: 100, borderRadius: 0, border: `1px solid ${BORDER}`, fontSize: 13 }}
                      />
                    </div>

                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.1em" }}>Playbook effectiveness rating</div>
                      <div style={{ display: "flex", gap: 8 }}>
                        {[1, 2, 3, 4, 5].map(n => (
                          <button key={n} onClick={() => setPlaybookRating(n)}
                            style={{ width: 40, height: 40, border: `2px solid ${n <= playbookRating ? GOLD : BORDER}`, background: n <= playbookRating ? `${GOLD}12` : "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Star style={{ width: 18, height: 18, color: n <= playbookRating ? GOLD : "#D1D5DB", fill: n <= playbookRating ? GOLD : "none" }} />
                          </button>
                        ))}
                        {playbookRating > 0 && <span style={{ fontSize: 12, color: MUTED, alignSelf: "center" }}>{['', 'Needs major rework', 'Below expectations', 'Met expectations', 'Above expectations', 'Outstanding'][playbookRating]}</span>}
                      </div>
                    </div>

                    <Button
                      style={{ background: TEAL, color: "#fff", borderRadius: 0 }}
                      onClick={() => {
                        if (!outcome?.id) return;
                        const note = `SUMMARY: ${humanNote}\n\nDECISIONS: ${selectedDecisions.join(', ')}${additionalDecision ? `. Additional: ${additionalDecision}` : ''}\n\nWOULD CHANGE: ${wouldChange}\n\nLESSONS: ${lessonsLearned}\n\nPLAYBOOK RATING: ${playbookRating}/5`;
                        saveNoteMutation.mutate({ id: outcome.id, note });
                      }}
                      disabled={saveNoteMutation.isPending}
                    >
                      {saveNoteMutation.isPending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : <><CheckCircle className="h-4 w-4 mr-2" />Save Learning Capture</>}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Step 5: Board Brief + AI Summary */}
              {step === 5 && (
                <Card style={{ border: `1px solid ${BORDER}`, borderLeft: `4px solid ${NAVY}`, borderRadius: 0 }}>
                  <CardContent className="p-6 space-y-6">
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                      <FileText style={{ width: 18, height: 18, color: NAVY }} />
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: NAVY }}>Board Brief & AI Summary</span>
                    </div>
                    <h3 style={{ ...CG, fontSize: 22, fontWeight: 600, color: NAVY }}>Board-ready outcome summary</h3>

                    {outcome.aiSummary ? (
                      <div style={{ background: OFF, border: `1px solid ${BORDER}`, borderLeft: `3px solid ${TEAL}`, padding: "20px 24px" }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: TEAL, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>AI-Generated Outcome Summary</div>
                        <p style={{ fontSize: 14, color: NAVY, lineHeight: 1.7 }}>{outcome.aiSummary}</p>
                        <p style={{ fontSize: 11, color: MUTED, marginTop: 12 }}>Generated {outcome.generatedAt ? new Date(outcome.generatedAt).toLocaleDateString() : "recently"}</p>
                        <Button variant="outline" onClick={() => generateMutation.mutate(outcome.id)}
                          disabled={generateMutation.isPending}
                          style={{ marginTop: 12, borderRadius: 0, border: `1px solid ${BORDER}`, fontSize: 12 }}>
                          {generateMutation.isPending ? "Regenerating..." : "Regenerate"}
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <p style={{ fontSize: 13, color: MUTED, marginBottom: 16 }}>
                          AI will synthesize all debrief data into a board-ready 3–4 sentence outcome summary — suitable for the audit committee or investor update.
                        </p>
                        <Button style={{ background: TEAL, color: "#fff", borderRadius: 0 }}
                          onClick={() => generateMutation.mutate(outcome.id)}
                          disabled={generateMutation.isPending}>
                          <Brain className="h-4 w-4 mr-2" />
                          {generateMutation.isPending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Generating...</> : "Generate Board Brief"}
                        </Button>
                      </div>
                    )}

                    {/* Loop closed */}
                    <div style={{ padding: "16px 20px", background: `${TEAL}06`, border: `1px solid ${TEAL}20`, display: "flex", alignItems: "center", gap: 12 }}>
                      <CheckCircle2 style={{ width: 20, height: 20, color: TEAL, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: TEAL }}>ADVANCE Loop Closed</div>
                        <div style={{ fontSize: 12, color: MUTED }}>This debrief will feed into your Living Playbooks — improving the next activation based on what you just learned.</div>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 10 }}>
                      <Link href="/living-playbooks">
                        <Button style={{ background: NAVY, color: "#fff", borderRadius: 0, fontSize: 11, fontWeight: 700 }}>
                          View Living Playbooks <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                      <Link href="/institutional-memory">
                        <Button variant="outline" style={{ borderRadius: 0, border: `1px solid ${BORDER}`, fontSize: 11, fontWeight: 700 }}>
                          Institutional Memory
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Navigation */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0", borderTop: `1px solid ${BORDER}` }}>
                <Button variant="ghost" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} style={{ borderRadius: 0 }}>
                  <ArrowLeft className="h-4 w-4 mr-2" /> Previous
                </Button>
                <div style={{ fontSize: 11, color: MUTED }}>Step {step + 1} of {WIZARD_STEPS.length}: {WIZARD_STEPS[step].label}</div>
                {!isLastStep ? (
                  <Button onClick={() => setStep(Math.min(WIZARD_STEPS.length - 1, step + 1))} style={{ background: NAVY, color: "#fff", borderRadius: 0 }}>
                    Next Step <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button onClick={() => setLocation('/institutional-memory')} style={{ background: GOLD, color: NAVY, borderRadius: 0, fontWeight: 700 }}>
                    Complete Debrief <CheckCircle className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
