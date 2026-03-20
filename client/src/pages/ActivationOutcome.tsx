import { useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle2, Clock, Zap, Brain, AlertTriangle, BookOpen } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const OFF = "#F8F7F4";
const BORDER = "#E8E4DC";
const MUTED = "#6B7280";
const CG = { fontFamily: "'Cormorant Garamond', Georgia, serif" };

export default function ActivationOutcome() {
  const { activationId } = useParams<{ activationId: string }>();
  const { toast } = useToast();
  const [humanNote, setHumanNote] = useState("");
  const [noteSaved, setNoteSaved] = useState(false);

  const { data: outcome, isLoading, refetch } = useQuery<any>({
    queryKey: ["/api/activation-outcomes", activationId],
    queryFn: () => fetch(`/api/activation-outcomes/${activationId}`).then(r => r.json()),
    enabled: !!activationId,
    retry: false,
  });

  const createMutation = useMutation({
    mutationFn: (body: { activationId: string; playbookId: string }) =>
      apiRequest("POST", "/api/activation-outcomes", body),
    onSuccess: () => {
      refetch();
      toast({ title: "Outcome record created" });
    },
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
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>ADVANCE Phase · Outcome Report</span>
            </div>
            <h1 style={{ ...CG, fontWeight: 700, fontSize: "clamp(28px,5vw,44px)", color: "#fff", lineHeight: 1.1, marginBottom: 8 }}>
              Activation <em style={{ fontStyle: "italic", color: GOLD }}>Outcome</em>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>
              Close the ADVANCE loop — capture what happened, what you'd change, and let AI synthesize the learning.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8 max-w-3xl">
          {isLoading ? (
            <div style={{ textAlign: "center", padding: 60, color: MUTED }}>Loading outcome data...</div>
          ) : !outcome || outcome?.error ? (
            <Card style={{ border: `1px solid ${BORDER}`, borderRadius: 0 }}>
              <CardContent className="p-8 text-center">
                <BookOpen className="h-10 w-10 mx-auto mb-4" style={{ color: GOLD }} />
                <h3 style={{ ...CG, fontSize: 22, fontWeight: 600, color: NAVY, marginBottom: 8 }}>No Outcome Record Found</h3>
                <p style={{ color: MUTED, fontSize: 14, marginBottom: 20 }}>
                  This activation doesn't have an outcome record yet. Create one to begin capturing institutional learning.
                </p>
                <p style={{ color: MUTED, fontSize: 12, marginBottom: 20 }}>
                  Activation ID: <code style={{ background: "#F3F4F6", padding: "2px 6px", borderRadius: 3 }}>{activationId}</code>
                </p>
                <Button
                  onClick={() => createMutation.mutate({ activationId: activationId!, playbookId: "unknown" })}
                  disabled={createMutation.isPending}
                  style={{ background: NAVY, color: "#fff", borderRadius: 0 }}
                >
                  {createMutation.isPending ? "Creating..." : "Initialize Outcome Record"}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Stats row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                {[
                  {
                    icon: CheckCircle2,
                    label: "Task Completion",
                    value: `${taskCompletionRate}%`,
                    color: taskCompletionRate >= 80 ? TEAL : taskCompletionRate >= 50 ? GOLD : "#DC2626",
                  },
                  {
                    icon: Zap,
                    label: "Tasks Done",
                    value: `${outcome.tasksCompleted} / ${outcome.totalTasks}`,
                    color: NAVY,
                  },
                  {
                    icon: Clock,
                    label: "Execution Time",
                    value: outcome.actualMinutes ? `${outcome.actualMinutes}m` : "—",
                    color: NAVY,
                  },
                  {
                    icon: CheckCircle2,
                    label: "12-Min Target",
                    value: outcome.targetMet === true ? "Hit" : outcome.targetMet === false ? "Missed" : "—",
                    color: outcome.targetMet === true ? TEAL : outcome.targetMet === false ? "#DC2626" : MUTED,
                  },
                ].map(({ icon: Icon, label, value, color }) => (
                  <Card key={label} style={{ border: `1px solid ${BORDER}`, borderRadius: 0 }}>
                    <CardContent className="p-4 text-center">
                      <Icon className="h-5 w-5 mx-auto mb-2" style={{ color: MUTED }} />
                      <div style={{ fontSize: 20, fontWeight: 700, color, fontFamily: "'Cormorant Garamond', Georgia, serif", lineHeight: 1.2 }}>{value}</div>
                      <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: MUTED, marginTop: 4 }}>{label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Human note section */}
              <Card style={{ border: `1px solid ${BORDER}`, borderLeft: `3px solid ${GOLD}`, borderRadius: 0 }}>
                <CardContent className="p-6">
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <div style={{ width: 20, height: 2, background: GOLD }} />
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD }}>Your Insight</span>
                  </div>
                  <h3 style={{ ...CG, fontSize: 20, fontWeight: 600, color: NAVY, marginBottom: 6 }}>What Would You Change?</h3>
                  <p style={{ fontSize: 13, color: MUTED, marginBottom: 16 }}>
                    One field. No forms. What would you do differently if this happened tomorrow?
                  </p>
                  {outcome.humanNote && !humanNote ? (
                    <div>
                      <div style={{ background: "#F8F7F4", border: `1px solid ${BORDER}`, padding: "14px 16px", fontSize: 14, color: NAVY, lineHeight: 1.6, marginBottom: 12 }}>
                        {outcome.humanNote}
                      </div>
                      <button
                        onClick={() => setHumanNote(outcome.humanNote)}
                        style={{ fontSize: 12, color: MUTED, textDecoration: "underline", background: "none", border: "none", cursor: "pointer" }}
                      >
                        Edit note
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Textarea
                        value={humanNote || outcome.humanNote || ""}
                        onChange={(e) => setHumanNote(e.target.value)}
                        placeholder="e.g. 'The legal team wasn't looped in fast enough — we should trigger the CLO in Phase 1, not Phase 2.'"
                        style={{ minHeight: 100, borderRadius: 0, border: `1px solid ${BORDER}`, fontSize: 14 }}
                      />
                      <Button
                        onClick={() => saveNoteMutation.mutate({ id: outcome.id, note: humanNote || outcome.humanNote })}
                        disabled={saveNoteMutation.isPending || (!humanNote && !outcome.humanNote)}
                        style={{ background: NAVY, color: "#fff", borderRadius: 0 }}
                      >
                        {saveNoteMutation.isPending ? "Saving..." : noteSaved ? "Saved ✓" : "Save Insight"}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* AI Summary section */}
              <Card style={{ border: `1px solid ${BORDER}`, borderLeft: `3px solid ${TEAL}`, borderRadius: 0 }}>
                <CardContent className="p-6">
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <div style={{ width: 20, height: 2, background: TEAL }} />
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: TEAL }}>AI Synthesis</span>
                    {outcome.status === "generated" && (
                      <Badge style={{ background: "rgba(43,138,110,0.1)", color: TEAL, border: `1px solid ${TEAL}`, fontSize: 10, borderRadius: 2 }}>Generated</Badge>
                    )}
                  </div>
                  <h3 style={{ ...CG, fontSize: 20, fontWeight: 600, color: NAVY, marginBottom: 6 }}>Executive Outcome Summary</h3>
                  {outcome.aiSummary ? (
                    <div>
                      <p style={{ fontSize: 14, color: NAVY, lineHeight: 1.7, fontStyle: "italic", borderLeft: `2px solid ${TEAL}`, paddingLeft: 16 }}>
                        {outcome.aiSummary}
                      </p>
                      <p style={{ fontSize: 11, color: MUTED, marginTop: 12 }}>
                        Generated {outcome.generatedAt ? new Date(outcome.generatedAt).toLocaleDateString() : "recently"}
                      </p>
                      <Button
                        onClick={() => generateMutation.mutate(outcome.id)}
                        disabled={generateMutation.isPending}
                        variant="outline"
                        style={{ marginTop: 12, borderRadius: 0, border: `1px solid ${BORDER}`, fontSize: 12 }}
                      >
                        {generateMutation.isPending ? "Regenerating..." : "Regenerate Summary"}
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <p style={{ fontSize: 13, color: MUTED, marginBottom: 16 }}>
                        GPT-4o will synthesize the execution data and your team note into a board-ready outcome summary — 3–4 sentences, past tense, focused on velocity and coordination.
                      </p>
                      <Button
                        onClick={() => generateMutation.mutate(outcome.id)}
                        disabled={generateMutation.isPending}
                        style={{ background: TEAL, color: "#fff", borderRadius: 0 }}
                      >
                        <Brain className="h-4 w-4 mr-2" />
                        {generateMutation.isPending ? "Generating..." : "Generate AI Summary"}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Status footer */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderTop: `1px solid ${BORDER}` }}>
                <span style={{ fontSize: 11, color: MUTED }}>
                  Outcome record created {outcome.createdAt ? new Date(outcome.createdAt).toLocaleDateString() : "recently"}
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: outcome.status === "generated" ? TEAL : MUTED }}>
                  {outcome.status === "generated" ? "Loop Closed ✓" : outcome.humanNote ? "Note Captured" : "Pending"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
