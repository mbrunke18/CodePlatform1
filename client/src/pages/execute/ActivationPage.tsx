import { useQuery } from "@tanstack/react-query";
import IDEALayout from '@/components/layout/IDEALayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Zap, Clock, Target, Star, Loader2, AlertTriangle, CheckCircle } from "lucide-react";

interface PlaybookActivation {
  id: string;
  playbookId: string;
  activationReason: string;
  situationSummary: string;
  successRating: number;
  playbookImprovements: any;
  activatedAt: string;
  playbookName: string;
  domainName: string;
}

export default function ActivationPage() {
  const { data: activations = [], isLoading } = useQuery<PlaybookActivation[]>({
    queryKey: ['/api/playbook-activations'],
  });

  const avgRating = activations.length > 0
    ? Math.round(activations.reduce((sum, a) => sum + (a.successRating || 0), 0) / activations.length)
    : 0;

  return (
    <IDEALayout>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Zap className="w-6 h-6 text-amber-500" />
            Playbook Activation History
          </h1>
          <p className="text-muted-foreground mt-1">
            Track every playbook activation, success ratings, and lessons learned across your organization.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Loading activation history...</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{activations.length}</div>
                    <div className="text-sm text-muted-foreground mt-1">Total Activations</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#2B8A6E]">{avgRating}%</div>
                    <div className="text-sm text-muted-foreground mt-1">Avg Success Rating</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#0A0F2E]">
                      {new Set(activations.map(a => a.domainName)).size}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">Domains Covered</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#C9A84C]">
                      {activations.filter(a => (a.successRating || 0) >= 90).length}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">High-Performance (90+)</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              {activations.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium text-muted-foreground">No activations yet</p>
                    <p className="text-sm text-muted-foreground mt-1">Playbook activations will appear here once triggered.</p>
                  </CardContent>
                </Card>
              ) : (
                activations.map((activation) => (
                  <Card key={activation.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Target className="w-5 h-5 text-primary" />
                            {activation.playbookName}
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{activation.domainName}</Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(activation.activatedAt).toLocaleDateString('en-US', {
                                month: 'short', day: 'numeric', year: 'numeric',
                                hour: '2-digit', minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-amber-500" />
                          <span className="font-bold text-lg">{activation.successRating}%</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Activation Reason</p>
                        <p className="text-sm mt-1">{activation.activationReason}</p>
                      </div>
                      {activation.situationSummary && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Situation Summary</p>
                          <p className="text-sm mt-1">{activation.situationSummary}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Success Rating</p>
                        <div className="flex items-center gap-3">
                          <Progress 
                            value={activation.successRating} 
                            className="flex-1 h-2"
                          />
                          <Badge variant={activation.successRating >= 90 ? "default" : activation.successRating >= 70 ? "secondary" : "destructive"}>
                            {activation.successRating >= 90 ? (
                              <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Excellent</span>
                            ) : activation.successRating >= 70 ? "Good" : "Needs Improvement"}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </IDEALayout>
  );
}
