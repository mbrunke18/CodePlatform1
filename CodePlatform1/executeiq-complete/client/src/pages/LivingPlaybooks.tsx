import { useLocation } from 'wouter';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Brain, TrendingUp, Sparkles, History, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const livingPlaybooks = [
  {
    id: 1,
    name: 'Ransomware Response',
    version: '4.2',
    activations: 127,
    successRate: 94,
    aiLearnings: 23,
    lastImproved: '2 days ago',
    improvements: [
      'Response time reduced from 6h to 2h',
      'Added 3 new stakeholder notification templates',
      'Improved IT team coordination checklist',
    ],
  },
  {
    id: 2,
    name: 'Supply Chain Disruption',
    version: '3.8',
    activations: 203,
    successRate: 91,
    aiLearnings: 41,
    lastImproved: '1 week ago',
    improvements: [
      'Enhanced supplier communication protocols',
      'Added alternative vendor matrix',
      'Updated risk assessment framework',
    ],
  },
  {
    id: 3,
    name: 'M&A Integration',
    version: '5.1',
    activations: 78,
    successRate: 88,
    aiLearnings: 15,
    lastImproved: '3 days ago',
    improvements: [
      'Cultural integration best practices',
      'Day-1 coordination improvements',
      'HR integration timeline optimization',
    ],
  },
];

export default function LivingPlaybooks() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleViewHistory = (playbook: typeof livingPlaybooks[0]) => {
    setLocation('/institutional-memory');
    toast({
      title: `Learning History: ${playbook.name}`,
      description: `Version ${playbook.version} - ${playbook.aiLearnings} AI learnings tracked`,
    });
  };

  const handleActivatePlaybook = (playbook: typeof livingPlaybooks[0]) => {
    setLocation('/command-center');
    toast({
      title: `Activating: ${playbook.name}`,
      description: `${playbook.successRate}% success rate across ${playbook.activations} activations`,
    });
  };

  return (
    <PageLayout>
      <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent mb-2 flex items-center gap-3">
            <Brain className="w-10 h-10 text-blue-600" />
            Living Playbooks
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Self-learning strategic playbooks that evolve with every execution through AI-powered analysis
          </p>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                166
              </div>
              <div className="text-sm text-slate-700 dark:text-slate-300">Living Playbooks</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-950/50 dark:to-violet-900/50 border-violet-200 dark:border-violet-800">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-violet-600 dark:text-violet-400 mb-1">
                892
              </div>
              <div className="text-sm text-slate-700 dark:text-slate-300">AI Learnings Applied</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/50 dark:to-emerald-900/50 border-emerald-200 dark:border-emerald-800">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                91%
              </div>
              <div className="text-sm text-slate-700 dark:text-slate-300">Avg Success Rate</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50 border-orange-200 dark:border-orange-800">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                42%
              </div>
              <div className="text-sm text-slate-700 dark:text-slate-300">Speed Improvement</div>
            </CardContent>
          </Card>
        </div>

        {/* Playbook Learning Feed */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Self-Learning Playbooks</h2>
          <div className="space-y-6">
            {livingPlaybooks.map((playbook) => (
              <Card key={playbook.id} className="border-l-4 border-l-violet-500" data-testid={`card-playbook-${playbook.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="bg-violet-100 dark:bg-violet-900 p-3 rounded-lg">
                        <BookOpen className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{playbook.name}</CardTitle>
                        <CardDescription className="mt-1">
                          Version {playbook.version} • {playbook.aiLearnings} AI learnings applied
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className="bg-violet-600">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Self-Learning
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Activations</div>
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        {playbook.activations}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Success Rate</div>
                      <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {playbook.successRate}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Last Improved</div>
                      <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {playbook.lastImproved}
                      </div>
                    </div>
                  </div>

                  {/* Recent AI Improvements */}
                  <div className="bg-violet-50 dark:bg-violet-950/30 p-4 rounded-lg border border-violet-200 dark:border-violet-900">
                    <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                      <Brain className="w-4 h-4 text-violet-600" />
                      Recent AI-Driven Improvements
                    </h4>
                    <ul className="space-y-2">
                      {playbook.improvements.map((improvement, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                          <TrendingUp className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" onClick={() => handleViewHistory(playbook)} data-testid={`button-view-history-${playbook.id}`}>
                      <History className="w-4 h-4 mr-2" />
                      View Learning History
                    </Button>
                    <Button size="sm" onClick={() => handleActivatePlaybook(playbook)} data-testid={`button-activate-${playbook.id}`}>
                      <Target className="w-4 h-4 mr-2" />
                      Activate Playbook
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <Card className="bg-gradient-to-r from-blue-600 to-violet-600 text-white border-0">
          <CardHeader>
            <CardTitle className="text-2xl">How Self-Learning Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h4 className="font-semibold mb-1">Execute</h4>
                <p className="text-sm text-blue-100">Playbook activated for real scenario</p>
              </div>
              <div>
                <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h4 className="font-semibold mb-1">Capture</h4>
                <p className="text-sm text-blue-100">AI analyzes execution data and outcomes</p>
              </div>
              <div>
                <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h4 className="font-semibold mb-1">Learn</h4>
                <p className="text-sm text-blue-100">Generate improvement recommendations</p>
              </div>
              <div>
                <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                  <span className="text-2xl font-bold">4</span>
                </div>
                <h4 className="font-semibold mb-1">Evolve</h4>
                <p className="text-sm text-blue-100">Playbook auto-updates for next execution</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </PageLayout>
  );
}
