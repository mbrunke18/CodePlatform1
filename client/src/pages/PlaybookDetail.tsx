import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, Link, useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  ArrowLeft,
  Play,
  Target,
  Zap,
  Clock,
  Users,
  Shield,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Settings,
  BarChart3,
  Layers,
  ArrowRight,
  Lock,
} from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import PageLayout from '@/components/layout/PageLayout';
import { useAuth } from '@/hooks/useAuth';
import { PhaseProgressBar } from '@/components/playbook/PhaseProgressBar';
import { PreparePhaseView } from '@/components/playbook/PreparePhaseView';
import { MonitorPhaseView } from '@/components/playbook/MonitorPhaseView';
import { LearnPhaseView } from '@/components/playbook/LearnPhaseView';
import { AIPrinciplesScorecard, DeterministicExecutionBadge } from '@/components/ai/AIPrinciplesScorecard';
import { ExecutionCommandCenter } from '@/components/execution/ExecutionCommandCenter';
import { PhaseSLASummary } from '@/components/playbook/PhaseSLASummary';

const SAMPLE_PLAYBOOK_IDS = [
  "a8d182bd-7f3a-4a70-8818-8b80790394b2", // Aggressive Pricing Disruption (Offense)
  "1a309274-6068-46f3-bb17-4303c184939c", // Compound: Geopolitical + Supply Chain Disruption (Defense)
  "da7df303-a5bd-4fc0-a8b7-492f8619c500", // AI Competitive Disruption (Special Teams)
];

const SEVERITY_COLORS = {
  critical: 'bg-red-50 text-red-700',
  high: 'bg-[#C9A84C]/10 text-[#C9A84C]',
  medium: 'bg-[#2B8A6E]/10 text-[#2B8A6E]',
  low: 'bg-[#0A0F2E]/10 text-[#0A0F2E]',
};

export default function PlaybookDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const isSampleView = SAMPLE_PLAYBOOK_IDS.includes(id || "") && !isAuthenticated;

  const { data: organizations = [] } = useQuery<any[]>({
    queryKey: ['/api/organizations'],
  });
  const organizationId = organizations[0]?.id;

  const { data: playbookData, isLoading } = useQuery<any>({
    queryKey: ['/api/playbook-library', id],
    queryFn: async () => {
      const response = await fetch(`/api/playbook-library/${id}`);
      if (!response.ok) throw new Error('Failed to fetch playbook');
      return response.json();
    },
    enabled: !!id,
  });
  
  const playbook = playbookData?.playbook;

  const { data: readiness } = useQuery<any>({
    queryKey: ['/api/playbook-library', id, 'readiness', { organizationId }],
    queryFn: async () => {
      const response = await fetch(
        `/api/playbook-library/${id}/readiness?organizationId=${organizationId}`
      );
      if (!response.ok) return null;
      return response.json();
    },
    enabled: !!id && !!organizationId,
  });

  const { data: users = [] } = useQuery<any[]>({
    queryKey: ['/api/users'],
    enabled: !!organizationId,
  });

  const activatePlaybookMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', `/api/playbook-library/${id}/activate`, {
        scenarioId: `scenario-${Date.now()}`,
      });
      return response.json();
    },
    onSuccess: (result) => {
      toast({
        title: 'Playbook Activated',
        description: `12-minute execution window initiated. ${result.stakeholders} stakeholders notified.`,
      });
      setLocation('/command-center');
    },
    onError: (error) => {
      toast({
        title: 'Activation Failed',
        description: error instanceof Error ? error.message : 'Unable to activate playbook',
        variant: 'destructive',
      });
    },
  });

  const startDrillMutation = useMutation({
    mutationFn: async () => {
      if (!organizationId || !users[0]?.id) throw new Error('No organization or user found');

      const drillData = {
        organizationId,
        playbookId: id,
        drillName: `Practice Drill: ${playbook?.name || 'Playbook'}`,
        drillType: 'simulation',
        scenarioDescription: playbook?.description || 'Practice drill simulation',
        scheduledDate: new Date(),
        scheduledTime: new Date().toTimeString().slice(0, 5),
        estimatedDuration: 30,
        invitedParticipants: [],
        actualParticipants: [],
        status: 'scheduled',
        complications: null,
        createdBy: users[0].id,
      };

      const drillResponse = await apiRequest('POST', '/api/practice-drills', drillData);
      const drill = await drillResponse.json();
      await apiRequest('POST', `/api/practice-drills/${drill.id}/start`, {});
      return drill;
    },
    onSuccess: (drill) => {
      toast({
        title: 'Practice Drill Started',
        description: 'Navigating to live execution...',
      });
      setLocation(`/practice-drills/${drill.id}/live`);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to start drill',
        variant: 'destructive',
      });
    },
  });

  const overallScore = readiness?.overallScore ?? 0;
  const canActivate = overallScore >= 50;

  const NAVY = "#0A0F2E";
  const NAVY_MID = "#141B45";
  const GOLD = "#C9A84C";
  const TEAL = "#2B8A6E";
  const OFF = "#F8F7F4";
  const BORDER = "#E8E4DC";
  const MUTED = "#6B7280";
  const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="container mx-auto p-6 animate-pulse">
          <div className="h-8 w-64 bg-slate-200 dark:bg-[#141B45] rounded mb-4" />
          <div className="h-48 bg-slate-200 dark:bg-[#141B45] rounded" />
        </div>
      </PageLayout>
    );
  }

  if (!playbook) {
    return (
      <PageLayout>
        <div className="container mx-auto p-6 text-center">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-amber-500" />
          <h2 className="text-xl font-semibold mb-2">Playbook Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The requested playbook could not be found.
          </p>
          <Button asChild>
            <Link href="/playbook-library">Back to Library</Link>
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div style={{ background: OFF, minHeight: "100vh" }}>
        <div className="container mx-auto px-6 py-12 space-y-8" data-testid="playbook-detail-page">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild data-testid="button-back" style={{ color: NAVY }}>
              <Link href="/playbook-library">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Library
              </Link>
            </Button>
            <div className="flex gap-3">
              <Button 
                onClick={() => setLocation(`/playbook/${id}/customize`)}
                style={{ border: `1.5px solid ${BORDER}`, color: NAVY, background: "transparent", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}
              >
                <Settings className="h-4 w-4 mr-2" />
                Customize
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div style={{ border: `1px solid ${BORDER}`, borderLeft: `4px solid ${GOLD}`, padding: 40, background: "#fff" }}>
                <div className="flex items-center gap-3 mb-6">
                  <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>Playbook No. {playbook.playbookNumber}</span>
                </div>
                <h1 style={{ ...CG, fontSize: "clamp(32px,5vw,48px)", fontWeight: 600, color: NAVY, lineHeight: 1.05, marginBottom: 24 }}>
                  {playbook.name}
                </h1>
                <p style={{ fontSize: 18, color: MUTED, lineHeight: 1.6, marginBottom: 40 }}>
                  {playbook.description}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-8 border-t border-[#E8E4DC]">
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED, marginBottom: 8 }}>Target Execution</div>
                    <div style={{ ...CG, fontSize: 24, fontWeight: 600, color: NAVY }}>{playbook.averageExecutionTime || 12}m</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED, marginBottom: 8 }}>Tier 1 Roles</div>
                    <div style={{ ...CG, fontSize: 24, fontWeight: 600, color: NAVY }}>{playbook.tier1Count || 6}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED, marginBottom: 8 }}>Severity</div>
                    <div style={{ ...CG, fontSize: 24, fontWeight: 600, color: playbook.severity === 'critical' ? '#EF4444' : NAVY }}>
                      {playbook.severityScore || 85}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED, marginBottom: 8 }}>Status</div>
                    <div style={{ ...CG, fontSize: 24, fontWeight: 600, color: TEAL }}>Active</div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                  <div style={{ width: 28, height: 2, background: NAVY, flexShrink: 0 }} />
                  <span style={{ ...CG, fontSize: 18, fontWeight: 600, color: NAVY }}>Strategic Parameters</span>
                </div>

                <div className="grid gap-6">
                  <div style={{ border: `1px solid ${BORDER}`, padding: 32, background: "#fff" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: GOLD, marginBottom: 16 }}>Trigger Criteria</div>
                    <p style={{ color: NAVY, lineHeight: 1.6 }}>{playbook.triggerCriteria}</p>
                  </div>

                  <div style={{ border: `1px solid ${BORDER}`, padding: 32, background: "#fff" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: GOLD, marginBottom: 16 }}>Core Stakeholders</div>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h4 style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: "uppercase", marginBottom: 16 }}>Tier 1 - Decision Makers</h4>
                        <div className="flex flex-wrap gap-2">
                          {(typeof playbook.tier1Stakeholders === 'object' ? Object.values(playbook.tier1Stakeholders) : [playbook.tier1Stakeholders]).map((s: any, i: number) => (
                            <span key={i} style={{ padding: "4px 12px", background: OFF, border: `1px solid ${BORDER}`, fontSize: 11, fontWeight: 600, color: NAVY }}>
                              {typeof s === 'string' ? s : s?.role || 'Stakeholder'}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: "uppercase", marginBottom: 16 }}>Tier 2 - Execution Team</h4>
                        <div className="flex flex-wrap gap-2">
                          {(typeof playbook.tier2Stakeholders === 'object' ? Object.values(playbook.tier2Stakeholders) : [playbook.tier2Stakeholders]).map((s: any, i: number) => (
                            <span key={i} style={{ padding: "4px 12px", background: "#fff", border: `1px solid ${BORDER}`, fontSize: 11, fontWeight: 600, color: MUTED }}>
                              {typeof s === 'string' ? s : s?.role || 'Support'}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <aside className="space-y-6">
              <div style={{ border: `1px solid ${BORDER}`, padding: 32, background: "#fff", textAlign: "center" }}>
                {isSampleView ? (
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, marginBottom: 12 }}>Free Sample Preview</div>
                    <div style={{ ...CG, fontSize: 15, fontWeight: 600, color: NAVY, marginBottom: 8, lineHeight: 1.4 }}>
                      167 more playbooks are waiting for your team
                    </div>
                    <p style={{ fontSize: 12, color: MUTED, marginBottom: 24, lineHeight: 1.6 }}>
                      Access the full library, activate playbooks in real-time, and run practice drills with your executive team.
                    </p>
                    <Button
                      style={{ width: "100%", background: GOLD, color: NAVY, height: 54, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}
                      onClick={() => window.location.href = "/api/login"}
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Start Free Trial
                    </Button>
                    <Button
                      variant="outline"
                      style={{ width: "100%", border: `1.5px solid ${BORDER}`, color: NAVY, background: "transparent", height: 44, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}
                      onClick={() => setLocation("/pilot-program")}
                    >
                      Request Pilot Access
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED, marginBottom: 24 }}>Readiness Score</div>
                    <div style={{ ...CG, fontSize: 64, fontWeight: 600, color: overallScore >= 80 ? TEAL : overallScore >= 50 ? GOLD : "#EF4444", lineHeight: 1, marginBottom: 8 }}>
                      {overallScore}%
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: MUTED, marginBottom: 32 }}>
                      {overallScore >= 80 ? 'Combat Ready' : 'Optimization Required'}
                    </div>
                    <div className="space-y-3">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            style={{ width: "100%", background: NAVY, color: "#fff", height: 54, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}
                            disabled={!canActivate || activatePlaybookMutation.isPending}
                            data-testid="button-activate"
                          >
                            <Zap className="h-4 w-4 mr-2" />
                            Activate Playbook
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent style={{ borderRadius: 0, border: `1px solid ${GOLD}` }}>
                          <AlertDialogHeader>
                            <AlertDialogTitle style={{ ...CG, fontSize: 24, color: NAVY }}>Confirm Activation</AlertDialogTitle>
                            <AlertDialogDescription style={{ color: MUTED }}>
                              This will initiate the 12-minute execution window. All stakeholders will
                              be notified, tasks will be created, and budgets will be unlocked.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel style={{ borderRadius: 0 }}>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => activatePlaybookMutation.mutate()}
                              style={{ background: NAVY, color: "#fff", borderRadius: 0 }}
                            >
                              Initiate Execution
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <Button
                        variant="outline"
                        style={{ width: "100%", border: `1.5px solid ${BORDER}`, color: NAVY, background: "transparent", height: 54, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}
                        onClick={() => startDrillMutation.mutate()}
                        disabled={startDrillMutation.isPending}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Practice Drill
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ border: `1px solid ${BORDER}`, padding: 32, background: NAVY, color: "#fff" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: GOLD, marginBottom: 16 }}>Mission Summary</div>
                <ul className="space-y-4">
                  {[
                    'Automatic Jira project creation',
                    'Role-based stakeholder notification',
                    'Real-time SLA tracking (12 min target)',
                    'Dynamic post-execution reporting'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" style={{ color: GOLD }} />
                      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
          {isSampleView && (
            <div style={{ background: NAVY, padding: "64px 48px", marginTop: 0 }}>
              <div className="max-w-3xl mx-auto text-center">
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD, marginBottom: 16 }}>
                  VaughnMartin · Execution OS
                </div>
                <div style={{ ...CG, fontSize: "clamp(28px,4vw,40px)", fontWeight: 600, color: "#fff", lineHeight: 1.15, marginBottom: 16 }}>
                  You just read one playbook.<br />
                  <em style={{ color: GOLD }}>167 more are protecting your competitors.</em>
                </div>
                <p style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: 40, maxWidth: 560, margin: "0 auto 40px" }}>
                  Every playbook in the Execution OS library is built from 20+ years of Fortune 500 transformation. 
                  Your team can be execution-ready in 12 minutes — not 12 weeks.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    style={{ background: GOLD, color: NAVY, height: 56, paddingLeft: 36, paddingRight: 36, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", borderRadius: 0 }}
                    onClick={() => window.location.href = "/api/login"}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Start Free Trial — Full Access
                  </Button>
                  <Button
                    style={{ background: "transparent", color: "#fff", height: 56, paddingLeft: 36, paddingRight: 36, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", borderRadius: 0, border: "1.5px solid rgba(255,255,255,0.25)" }}
                    onClick={() => setLocation("/pilot-program")}
                  >
                    Request Enterprise Pilot
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
                <div className="flex items-center justify-center gap-8 mt-12 flex-wrap">
                  {["170 Playbooks", "9 Strategic Domains", "12-Minute Execution", "Fortune 1000 Ready"].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5" style={{ color: GOLD }} />
                      <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
