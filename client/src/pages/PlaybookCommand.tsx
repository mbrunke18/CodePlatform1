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
          <AlertTriangle className="h-12 w-12 mx-auto text-amber-500 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Playbook Not Found</h1>
          <p className="text-slate-600 mb-6">The requested playbook could not be located.</p>
          <Button onClick={() => setLocation("/playbooks")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Library
          </Button>
        </main>
        <Footer />
      </>
    );
  }

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
                <Badge variant="outline" className="text-lg px-3 py-1">
                  #{playbook.playbookNumber}
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {playbook.triggerCriteria && (
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Target className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-amber-800 dark:text-amber-400 mb-1">
                      Trigger Criteria
                    </div>
                    <p className="text-amber-700 dark:text-amber-300 text-sm">
                      {playbook.triggerCriteria}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Clock className="h-5 w-5" />
                <span>~12 min execution</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Users className="h-5 w-5" />
                <span>Human-led</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Sparkles className="h-5 w-5" />
                <span>AI-assisted</span>
              </div>
              {playbook.preApprovedBudget && (
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <DollarSign className="h-5 w-5" />
                  <span>${Number(playbook.preApprovedBudget).toLocaleString()}</span>
                </div>
              )}
            </div>

            {playbook.primaryResponseStrategy && (
              <div>
                <h3 className="font-medium mb-2">Response Strategy</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  {playbook.primaryResponseStrategy}
                </p>
              </div>
            )}

            <div className="pt-4 border-t">
              {!isAuthenticated ? (
                <div className="text-center py-4">
                  <p className="text-slate-600 mb-4">Sign in to execute this playbook</p>
                  <Button onClick={login} data-testid="button-login">
                    Sign In
                  </Button>
                </div>
              ) : !organization?.id ? (
                <div className="text-center py-4">
                  <p className="text-slate-600 mb-4">No organization configured</p>
                  <Button disabled>Configure Organization</Button>
                </div>
              ) : startExecution.isSuccess ? (
                <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <div>
                    <div className="font-medium text-green-800 dark:text-green-400">
                      Execution Started
                    </div>
                    <p className="text-green-700 dark:text-green-300 text-sm">
                      Playbook activation has been recorded. 12-minute timer started.
                    </p>
                  </div>
                </div>
              ) : (
                <Button
                  size="lg"
                  className="w-full md:w-auto"
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
                  <Badge className="bg-red-100 text-red-700 mb-2">Tier 1 - Immediate</Badge>
                  <p className="text-sm text-slate-600">{(playbook.tier1Stakeholders as string[]).join(", ")}</p>
                </div>
              )}
              {Array.isArray(playbook.tier2Stakeholders) && playbook.tier2Stakeholders.length > 0 && (
                <div>
                  <Badge className="bg-amber-100 text-amber-700 mb-2">Tier 2 - Within 2 Hours</Badge>
                  <p className="text-sm text-slate-600">{(playbook.tier2Stakeholders as string[]).join(", ")}</p>
                </div>
              )}
              {Array.isArray(playbook.tier3Stakeholders) && playbook.tier3Stakeholders.length > 0 && (
                <div>
                  <Badge className="bg-blue-100 text-blue-700 mb-2">Tier 3 - Within 24 Hours</Badge>
                  <p className="text-sm text-slate-600">{(playbook.tier3Stakeholders as string[]).join(", ")}</p>
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
