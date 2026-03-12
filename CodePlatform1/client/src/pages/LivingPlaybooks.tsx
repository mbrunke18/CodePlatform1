import { useState } from 'react';
import { useLocation } from 'wouter';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Brain, TrendingUp, Sparkles, History, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const NAVY = "#0A0F2E";
const NAVY_MID = "#141B45";
const GOLD = "#C9A84C";
const GOLD_LT = "#DFC178";
const TEAL = "#2B8A6E";
const TEAL_LT = "#3BAF8A";
const OFF = "#F8F7F4";
const BORDER = "#E8E4DC";
const MUTED = "#6B7280";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

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
      <div className="bg-white p-8 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div style={{ width: 28, height: 2, background: GOLD }} />
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>Advance Phase</span>
          </div>
          <h1 className="text-4xl font-bold text-[#0A0F2E] mb-2 flex items-center gap-3" style={CG}>
            <Brain className="w-10 h-10 text-[#0A0F2E]" />
            Living Playbooks
          </h1>
          <p className="text-[#6B7280]">
            Self-learning strategic playbooks that evolve with every execution through AI-powered analysis
          </p>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-[#E8E4DC] bg-white shadow-none">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-[#0A0F2E] mb-1" style={CG}>
                170
              </div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-[#6B7280]">Living Playbooks</div>
            </CardContent>
          </Card>
          <Card className="border-[#E8E4DC] bg-white shadow-none">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-[#C9A84C] mb-1" style={CG}>
                892
              </div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-[#6B7280]">AI Learnings Applied</div>
            </CardContent>
          </Card>
          <Card className="border-[#E8E4DC] bg-white shadow-none">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-[#2B8A6E] mb-1" style={CG}>
                91%
              </div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-[#6B7280]">Avg Success Rate</div>
            </CardContent>
          </Card>
          <Card className="border-[#E8E4DC] bg-white shadow-none">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-[#C9A84C] mb-1" style={CG}>
                42%
              </div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-[#6B7280]">Speed Improvement</div>
            </CardContent>
          </Card>
        </div>

        {/* Playbook Learning Feed */}
        <div>
          <h2 className="text-2xl font-bold text-[#0A0F2E] mb-4" style={CG}>Self-Learning Playbooks</h2>
          <div className="space-y-6">
            {livingPlaybooks.map((playbook) => (
              <Card key={playbook.id} className="border border-[#E8E4DC] bg-white shadow-none relative overflow-hidden" data-testid={`card-playbook-${playbook.id}`}>
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C9A84C]" />
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="bg-[#0A0F2E] p-3 rounded-none">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-[#0A0F2E]" style={CG}>{playbook.name}</CardTitle>
                        <CardDescription className="mt-1 text-[#6B7280]">
                          Version {playbook.version} • {playbook.aiLearnings} AI learnings applied
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className="bg-[#C9A84C] text-[#0A0F2E] font-bold border-none">
                      <Sparkles className="w-3 h-3 mr-1" />
                      SELF-LEARNING
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-4 border-y border-[#E8E4DC] py-4">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider font-bold text-[#6B7280] mb-1">Activations</div>
                      <div className="text-2xl font-bold text-[#0A0F2E]" style={CG}>
                        {playbook.activations}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider font-bold text-[#6B7280] mb-1">Success Rate</div>
                      <div className="text-2xl font-bold text-[#2B8A6E]" style={CG}>
                        {playbook.successRate}%
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider font-bold text-[#6B7280] mb-1">Last Improved</div>
                      <div className="text-sm font-semibold text-[#0A0F2E]">
                        {playbook.lastImproved}
                      </div>
                    </div>
                  </div>

                  {/* Recent AI Improvements */}
                  <div className="bg-[#F8F7F4] p-4 border border-[#E8E4DC] rounded-none">
                    <h4 className="font-bold text-xs text-[#0A0F2E] mb-3 flex items-center gap-2 uppercase tracking-wider">
                      <Brain className="w-4 h-4 text-[#C9A84C]" />
                      Recent AI-Driven Improvements
                    </h4>
                    <ul className="space-y-2">
                      {playbook.improvements.map((improvement, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-[#0A0F2E]">
                          <TrendingUp className="w-4 h-4 text-[#2B8A6E] flex-shrink-0 mt-0.5" />
                          <span>{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-2">
                    <Button variant="outline" size="sm" className="border-[#E8E4DC] text-[#0A0F2E] hover:bg-[#F8F7F4]" onClick={() => handleViewHistory(playbook)} data-testid={`button-view-history-${playbook.id}`}>
                      <History className="w-4 h-4 mr-2" />
                      View Learning History
                    </Button>
                    <Button size="sm" className="bg-[#0A0F2E] text-white hover:bg-[#141B45]" onClick={() => handleActivatePlaybook(playbook)} data-testid={`button-activate-${playbook.id}`}>
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
        <Card style={{ background: NAVY }} className="border-none shadow-xl text-white relative overflow-hidden">
          <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 2px 2px, rgba(201,168,76,0.1) 1px, transparent 0)", backgroundSize: "32px 32px" }} />
          <CardHeader className="relative z-10 border-b border-white/10 mb-6">
            <CardTitle className="text-2xl" style={CG}>How Self-Learning Works</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { step: "1", title: "Execute", desc: "Playbook activated for real scenario" },
                { step: "2", title: "Capture", desc: "AI analyzes execution data and outcomes" },
                { step: "3", title: "Learn", desc: "Generate improvement recommendations" },
                { step: "4", title: "Evolve", desc: "Playbook auto-updates for next execution" }
              ].map((item, idx) => (
                <div key={idx} className="relative">
                  <div className="bg-[#C9A84C] text-[#0A0F2E] rounded-none w-10 h-10 flex items-center justify-center mb-4 font-bold text-xl" style={CG}>
                    {item.step}
                  </div>
                  <h4 className="font-bold text-[#C9A84C] mb-1 uppercase tracking-wider text-xs">{item.title}</h4>
                  <p className="text-sm text-white/70">{item.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </PageLayout>
  );
}
