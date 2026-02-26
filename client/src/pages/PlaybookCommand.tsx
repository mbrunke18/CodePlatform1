import { useParams, useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";

import StandardNav from "@/components/layout/StandardNav";
import Footer from "@/components/layout/Footer";
import { useCustomer } from "@/contexts/CustomerContext";
import { useAuth } from "@/hooks/useAuth";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Clock, 
  Play, 
  Users, 
  Sparkles, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Target,
} from "lucide-react";

import { apiRequest, queryClient } from "@/lib/queryClient";
import type { PlaybookLibrary } from "@shared/schema";

interface PlaybookDetailResponse {
  playbook: PlaybookLibrary;
  domain: { name: string; color: string } | null;
  category: { name: string } | null;
  communicationTemplates: unknown[];
  decisionTrees: unknown[];
}

export default function PlaybookCommand() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { organization } = useCustomer();
  const { isAuthenticated, login } = useAuth();

  const { data, isLoading } = useQuery<PlaybookDetailResponse>({
    queryKey: ["/api/playbook-library", id],
  });

  const playbook = data?.playbook;
  const domain = data?.domain;

  const startExecution = useMutation({
    mutationFn: async () => {
      const res = await apiRequest(
        "POST",
        `/api/playbook-library/${id}/execute`,
        {
          organizationId: organization?.id,
          reason: "Manual execution from Command Center",
        }
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/playbook-library/telemetry"],
      });
    },
  });

  if (isLoading) {
    return (
      <>
        <StandardNav />
        <main className="max-w-4xl mx-auto px-6 py-16">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-4 w-1/3 mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-12 w-40" />
            </CardContent>
          </Card>
        </main>
        <Footer />
      </>
    );
  }

  if (!playbook) {
    return (
      <>
        <StandardNav />
        <main className="max-w-4xl mx-auto px-6 py-16 text-center">
          <AlertTriangle className="h-12 w-12 mx-auto text-[#C9A84C] mb-4" />
          <h1 className="text-2xl font-bold mb-2">Playbook Not Found</h1>
          <p className="text-gray-800 mb-6">The requested playbook could not be located.</p>
          <Button onClick={() => setLocation("/playbooks")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Library
          </Button>
        </main>
        <Footer />
      </>
    );
  }

  const isOffense = playbook.primaryExecutiveRole?.toLowerCase().includes('sales') || playbook.primaryExecutiveRole?.toLowerCase().includes('marketing') || playbook.primaryExecutiveRole?.toLowerCase().includes('growth') || playbook.primaryExecutiveRole?.toLowerCase().includes('finance');
  const isDefense = playbook.primaryExecutiveRole?.toLowerCase().includes('security') || playbook.primaryExecutiveRole?.toLowerCase().includes('risk') || playbook.primaryExecutiveRole?.toLowerCase().includes('legal') || playbook.primaryExecutiveRole?.toLowerCase().includes('compliance') || playbook.primaryExecutiveRole?.toLowerCase().includes('ops');
  const badgeColor = isOffense ? "#2B8A6E" : isDefense ? "#0A0F2E" : "#C9A84C";
  const badgeBg = isOffense ? "rgba(43, 138, 110, 0.1)" : isDefense ? "rgba(10, 15, 46, 0.1)" : "rgba(201, 168, 76, 0.1)";

  return (
    <>
      <StandardNav />

      <main className="max-w-4xl mx-auto px-6 py-16">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => setLocation("/playbooks")}
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Library
        </Button>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl" data-testid="text-playbook-name">
                  {playbook.name}
                </CardTitle>
                {domain && (
                  <CardDescription className="mt-2" data-testid="text-domain">
                    {domain.name}
                  </CardDescription>
                )}
              </div>
              {playbook.playbookNumber && (
                <Badge variant="outline" className="text-lg px-3 py-1" style={{ color: badgeColor, backgroundColor: badgeBg, borderColor: badgeColor }}>
                  #{playbook.playbookNumber}
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {playbook.triggerCriteria && (
              <div className="bg-[#0A0F2E] text-white border border-[#E8E4DC] rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Target className="h-5 w-5 text-[#C9A84C] mt-0.5" />
                  <div>
                    <div className="font-medium text-[#DFC178] mb-1">
                      Trigger Criteria
                    </div>
                    <p className="text-gray-300 text-sm">
                      {playbook.triggerCriteria}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 text-gray-800 dark:text-slate-300">
                <Clock className="h-5 w-5 text-[#2B8A6E]" />
                <span>~12 min execution</span>
              </div>
              <div className="flex items-center gap-2 text-gray-800 dark:text-slate-300">
                <Users className="h-5 w-5 text-[#2B8A6E]" />
                <span>Human-led</span>
              </div>
              <div className="flex items-center gap-2 text-gray-800 dark:text-slate-300">
                <Sparkles className="h-5 w-5 text-[#2B8A6E]" />
                <span>AI-assisted</span>
              </div>
              {playbook.preApprovedBudget && (
                <div className="flex items-center gap-2 text-gray-800 dark:text-slate-300">
                  <DollarSign className="h-5 w-5 text-[#2B8A6E]" />
                  <span>${Number(playbook.preApprovedBudget).toLocaleString()}</span>
                </div>
              )}
            </div>

            {playbook.primaryResponseStrategy && (
              <div>
                <h3 className="font-medium mb-2">Response Strategy</h3>
                <p className="text-gray-800 dark:text-slate-300 text-sm">
                  {playbook.primaryResponseStrategy}
                </p>
              </div>
            )}

            <div className="pt-4 border-t">
              {!isAuthenticated ? (
                <div className="text-center py-4">
                  <p className="text-gray-800 mb-1">Sign in to execute this playbook</p>
                  <p className="text-sm text-[#6B7280] mb-4">Continue with Google, GitHub, or Apple</p>
                  <Button onClick={() => login()} data-testid="button-login">
                    Sign In
                  </Button>
                </div>
              ) : !organization?.id ? (
                <div className="text-center py-4">
                  <p className="text-gray-800 mb-4">No organization configured</p>
                  <Button disabled>Configure Organization</Button>
                </div>
              ) : startExecution.isSuccess ? (
                <div className="bg-[#2B8A6E]/10 border border-[#2B8A6E]/20 rounded-lg p-4 flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-[#2B8A6E]" />
                  <div>
                    <div className="font-medium text-[#2B8A6E]">
                      Execution Started
                    </div>
                    <p className="text-[#2B8A6E]/80 text-sm">
                      Playbook activation has been recorded. 12-minute timer started.
                    </p>
                  </div>
                </div>
              ) : (
                <Button
                  size="lg"
                  className="w-full md:w-auto bg-[#0A0F2E] text-white hover:bg-[#141B45]"
                  onClick={() => startExecution.mutate()}
                  disabled={startExecution.isPending}
                  data-testid="button-start-execution"
                >
                  <Play className="h-5 w-5 mr-2" />
                  {startExecution.isPending ? "Starting..." : "Start Execution"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {Array.isArray(playbook.tier1Stakeholders) && playbook.tier1Stakeholders.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Stakeholder Tiers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.isArray(playbook.tier1Stakeholders) && playbook.tier1Stakeholders.length > 0 && (
                <div>
                  <Badge className="bg-[#0A0F2E] text-white mb-2 border-white/10">Tier 1 - Immediate</Badge>
                  <p className="text-sm text-gray-800">{(playbook.tier1Stakeholders as string[]).join(", ")}</p>
                </div>
              )}
              {Array.isArray(playbook.tier2Stakeholders) && playbook.tier2Stakeholders.length > 0 && (
                <div>
                  <Badge className="bg-[#C9A84C]/10 text-[#C9A84C] mb-2 border-[#C9A84C]/20">Tier 2 - Within 2 Hours</Badge>
                  <p className="text-sm text-gray-800">{(playbook.tier2Stakeholders as string[]).join(", ")}</p>
                </div>
              )}
              {Array.isArray(playbook.tier3Stakeholders) && playbook.tier3Stakeholders.length > 0 && (
                <div>
                  <Badge className="bg-[#0A0F2E]/5 text-[#0A0F2E] mb-2 border-[#0A0F2E]/10">Tier 3 - Within 24 Hours</Badge>
                  <p className="text-sm text-gray-800">{(playbook.tier3Stakeholders as string[]).join(", ")}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </>
  );
}
