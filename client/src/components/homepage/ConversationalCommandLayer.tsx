import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, Zap, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import { SiSlack } from 'react-icons/si';

export default function ConversationalCommandLayer() {
  return (
    <section className="py-20 bg-gradient-to-b from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10" data-testid="section-conversational-command">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-12">
            <Badge className="mb-4 bg-purple-600 text-white text-sm px-4 py-1" data-testid="badge-conversational">
              Coming Soon: Conversational Command & Control
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4" data-testid="heading-conversational">
              From Dashboard to Conversation
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The future of strategic execution isn't logging into another dashboard—it's having a conversation 
              where you already work. M's upcoming conversational interface will bring AI-powered command and control directly into Slack and Teams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            
            <Card className="border-2 border-purple-500" data-testid="card-conversational-interface">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold">Conversational Interface</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      <strong>Query status:</strong> "What's our ransomware preparedness score?"
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      <strong>Activate playbooks:</strong> "Launch Product-101 for APAC expansion"
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      <strong>Run hypotheses:</strong> "What if a competitor enters with 50% lower pricing?"
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      <strong>Real-time updates:</strong> Automatic status feeds to War Room channels
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-500" data-testid="card-ai-orchestration">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold">AI Orchestration</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      <strong>Autonomous tasks:</strong> AI drafts comms, generates reports, summarizes data
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      <strong>Human checkpoints:</strong> Executives review and approve AI outputs
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      <strong>Instant coordination:</strong> 67% of tasks automated, humans focus on judgment
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      <strong>Override controls:</strong> Humans maintain full authority over every decision
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-2 border-purple-500" data-testid="card-command-flow">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-center">
                Coming Soon: 10-Second Command → 12-Minute Execution
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                <div className="text-center">
                  <div className="bg-purple-600 text-white rounded-lg p-4 mb-2">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm font-semibold">Conversation</p>
                  </div>
                  <p className="text-xs text-muted-foreground">@M activate SC-101</p>
                </div>

                <div className="flex justify-center">
                  <ArrowRight className="w-6 h-6 text-purple-600" />
                </div>

                <div className="text-center">
                  <div className="bg-blue-600 text-white rounded-lg p-4 mb-2">
                    <Shield className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm font-semibold">Approval</p>
                  </div>
                  <p className="text-xs text-muted-foreground">One-click confirm</p>
                </div>

                <div className="flex justify-center">
                  <ArrowRight className="w-6 h-6 text-purple-600" />
                </div>

                <div className="text-center">
                  <div className="bg-green-600 text-white rounded-lg p-4 mb-2">
                    <Zap className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm font-semibold">Execution</p>
                  </div>
                  <p className="text-xs text-muted-foreground">30 stakeholders aligned</p>
                </div>
              </div>

              <div className="mt-8 text-center">
                <div className="inline-flex items-center gap-4 bg-white dark:bg-gray-900 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center gap-2">
                    <SiSlack className="w-6 h-6 text-[#4A154B]" />
                    <span className="text-sm font-semibold">Slack</span>
                  </div>
                  <div className="h-6 w-px bg-border" />
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-6 h-6 text-[#6264A7]" />
                    <span className="text-sm font-semibold">Microsoft Teams</span>
                  </div>
                  <div className="h-6 w-px bg-border" />
                  <span className="text-sm text-muted-foreground">Meet executives where they work</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-lg text-muted-foreground mb-6">
              See how M's current execution orchestration capabilities lay the foundation for conversational command—watch our live demos
            </p>
            <Button size="lg" asChild data-testid="button-see-conversational-demo">
              <a href="/demo-selector">
                See M Execution in Action
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </Button>
          </div>

        </div>
      </div>
    </section>
  );
}
