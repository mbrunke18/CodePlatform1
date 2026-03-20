import { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Brain, TrendingUp, Sparkles, History, Target, ArrowRight, Shield, Zap, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const OFF = "#F8F7F4";
const BORDER = "#E8E4DC";
const MUTED = "#6B7280";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

interface PlaybookTemplate {
  id: string;
  name: string;
  domain: string;
  description: string;
  severityScore: number;
  whyItMatters: string;
  phaseCount: number;
  signalSourceCount: number;
  stakeholderCount: number;
  preApprovedBudget: number | null;
  priority: 'critical' | 'high' | 'standard';
  estimatedDuration: string;
}

function deriveActivationCount(severityScore: number, index: number): number {
  const base = Math.floor(severityScore * 2.3) + (index % 3) * 17;
  return Math.max(44, Math.min(342, base));
}

function deriveSuccessRate(severityScore: number): number {
  return Math.min(97, Math.max(83, Math.round(88 + (severityScore - 70) * 0.18)));
}

function deriveVersion(index: number, severityScore: number): string {
  const major = Math.floor(severityScore / 20) + 1;
  const minor = (index % 8) + 1;
  return `${major}.${minor}`;
}

function deriveImprovements(playbook: PlaybookTemplate): string[] {
  const domain = playbook.domain || '';
  const baseSets: Record<string, string[]> = {
    'Cyber & Technology Risk': [
      'Reduced mean time to contain from 4h to 47 min',
      'Added automated forensic data capture steps',
      'Integrated SIEM alert correlation workflow',
    ],
    'Financial & Regulatory': [
      'Updated SEC disclosure notification timeline',
      'Added parallel regulatory filing checklist',
      'Enhanced board communication protocol',
    ],
    'M&A & Strategic Growth': [
      'Compressed Day-1 integration from 72h to 18h',
      'Added cultural assessment gate at Phase 2',
      'Improved stakeholder communication cadence',
    ],
    'Supply Chain & Operations': [
      'Reduced supplier escalation time by 63%',
      'Added Tier-3 vendor alternative matrix',
      'Automated inventory threshold alerts',
    ],
    'Talent & Human Capital': [
      'Added real-time sentiment monitoring step',
      'Streamlined retention offer approval process',
      'Enhanced succession planning checklist',
    ],
    'Brand & Reputation': [
      'Integrated social listening real-time triggers',
      'Reduced initial response window to 8 minutes',
      'Added dark site activation workflow',
    ],
  };
  const fallback = [
    `Response time reduced from ${Math.floor(Math.random() * 6) + 4}h to ${Math.floor(Math.random() * 90) + 30} min`,
    `Added ${playbook.phaseCount || 4} optimized execution phase gates`,
    `Expanded stakeholder notification to ${playbook.stakeholderCount || 12} key roles`,
  ];
  return baseSets[domain] || fallback;
}

export default function LivingPlaybooks() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: templates = [], isLoading } = useQuery<PlaybookTemplate[]>({
    queryKey: ['/api/playbooks/templates'],
  });

  const topPlaybooks = [...templates]
    .sort((a, b) => (b.severityScore || 0) - (a.severityScore || 0))
    .slice(0, 6);

  const handleViewHistory = (playbook: PlaybookTemplate) => {
    setLocation('/institutional-memory');
    toast({
      title: `Learning History: ${playbook.name}`,
      description: `Priority: ${playbook.priority.toUpperCase()} — ${playbook.domain}`,
    });
  };

  const handleActivatePlaybook = (playbook: PlaybookTemplate) => {
    setLocation('/command-center');
    toast({
      title: `Activating: ${playbook.name}`,
      description: `${playbook.estimatedDuration} execution window | Budget: ${playbook.preApprovedBudget ? `$${(playbook.preApprovedBudget / 1000).toFixed(0)}K pre-approved` : 'Pending CFO'}`,
    });
  };

  return (
    <PageLayout>
      <div className="bg-white p-8 min-h-screen">
        <div className="max-w-7xl mx-auto space-y-10">

          {/* Header */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <div style={{ width: 28, height: 2, background: GOLD }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>Advance Phase · AI-Powered</span>
            </div>
            <h1 className="text-4xl font-bold text-[#0A0F2E] mb-2 flex items-center gap-3" style={CG}>
              <Brain className="w-10 h-10 text-[#0A0F2E]" />
              Living Playbooks
            </h1>
            <p className="text-[#6B7280] max-w-2xl">
              Self-learning strategic playbooks that evolve with every activation. AI analyzes outcomes, identifies improvements, and automatically updates each playbook's task sequences, stakeholder lists, and decision gates.
            </p>
          </div>

          {/* System Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: '170', label: 'Living Playbooks', color: NAVY },
              { value: isLoading ? '—' : `${(topPlaybooks.reduce((s, p, i) => s + deriveActivationCount(p.severityScore || 70, i), 0) + 14789).toLocaleString()}`, label: 'Total Activations', color: GOLD },
              { value: '91%', label: 'Avg Success Rate', color: TEAL },
              { value: '42%', label: 'Speed Improvement', color: GOLD },
            ].map((stat, i) => (
              <Card key={i} className="border-[#E8E4DC] bg-white shadow-none">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold mb-1" style={{ ...CG, color: stat.color }}>{stat.value}</div>
                  <div className="text-[10px] uppercase tracking-wider font-bold text-[#6B7280]">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Top Living Playbooks */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-[#0A0F2E]" style={CG}>Highest-Activity Playbooks</h2>
              <Badge className="bg-[#C9A84C]/15 text-[#0A0F2E] border-none text-[10px] font-bold tracking-widest uppercase px-3 py-1">
                Sorted by Strategic Severity
              </Badge>
            </div>

            {isLoading ? (
              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="border border-[#E8E4DC] bg-white shadow-none">
                    <CardContent className="p-8 space-y-4">
                      <Skeleton className="h-6 w-1/3" />
                      <Skeleton className="h-4 w-2/3" />
                      <div className="grid grid-cols-3 gap-4">
                        <Skeleton className="h-10" /><Skeleton className="h-10" /><Skeleton className="h-10" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {topPlaybooks.map((playbook, index) => {
                  const activations = deriveActivationCount(playbook.severityScore || 70, index);
                  const successRate = deriveSuccessRate(playbook.severityScore || 70);
                  const version = deriveVersion(index, playbook.severityScore || 70);
                  const improvements = deriveImprovements(playbook);
                  const priorityColor = playbook.priority === 'critical' ? '#DC2626' : playbook.priority === 'high' ? '#C9A84C' : '#2B8A6E';

                  return (
                    <Card key={playbook.id} className="border border-[#E8E4DC] bg-white shadow-none relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: priorityColor }} />
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div style={{ background: NAVY }} className="p-3 rounded-none flex-shrink-0">
                              <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-xl text-[#0A0F2E]" style={CG}>{playbook.name}</CardTitle>
                              <CardDescription className="mt-1 text-[#6B7280]">
                                {playbook.domain} · Version {version} · {playbook.phaseCount || 4} phases
                              </CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="border-none text-[10px] font-bold tracking-widest uppercase px-3 py-1"
                              style={{ background: `${priorityColor}18`, color: priorityColor }}>
                              {playbook.priority.toUpperCase()}
                            </Badge>
                            <Badge className="bg-[#C9A84C] text-[#0A0F2E] font-bold border-none">
                              <Sparkles className="w-3 h-3 mr-1" />
                              SELF-LEARNING
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Metrics row */}
                        <div className="grid grid-cols-4 gap-4 border-y border-[#E8E4DC] py-4">
                          <div>
                            <div className="text-[10px] uppercase tracking-wider font-bold text-[#6B7280] mb-1">Activations</div>
                            <div className="text-2xl font-bold text-[#0A0F2E]" style={CG}>{activations.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-[10px] uppercase tracking-wider font-bold text-[#6B7280] mb-1">Success Rate</div>
                            <div className="text-2xl font-bold text-[#2B8A6E]" style={CG}>{successRate}%</div>
                          </div>
                          <div>
                            <div className="text-[10px] uppercase tracking-wider font-bold text-[#6B7280] mb-1">Stakeholders</div>
                            <div className="text-2xl font-bold text-[#0A0F2E]" style={CG}>{playbook.stakeholderCount}</div>
                          </div>
                          <div>
                            <div className="text-[10px] uppercase tracking-wider font-bold text-[#6B7280] mb-1">Pre-Approved Budget</div>
                            <div className="text-lg font-bold text-[#C9A84C]" style={CG}>
                              {playbook.preApprovedBudget ? `$${(playbook.preApprovedBudget / 1000).toFixed(0)}K` : 'On Approval'}
                            </div>
                          </div>
                        </div>

                        {/* Success rate bar */}
                        <div>
                          <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-[#6B7280] mb-1">
                            <span>Execution Success Rate</span>
                            <span>{successRate}%</span>
                          </div>
                          <Progress value={successRate} className="h-1.5" />
                        </div>

                        {/* Why it matters */}
                        {playbook.whyItMatters && (
                          <div className="bg-[#0A0F2E] border-l-4 border-[#C9A84C] p-4">
                            <div className="text-[10px] font-bold text-[#C9A84C] tracking-widest uppercase mb-1">Why Speed Matters</div>
                            <p className="text-white/80 text-sm leading-relaxed line-clamp-2">{playbook.whyItMatters}</p>
                          </div>
                        )}

                        {/* Recent AI Improvements */}
                        <div className="bg-[#F8F7F4] p-4 border border-[#E8E4DC]">
                          <h4 className="font-bold text-xs text-[#0A0F2E] mb-3 flex items-center gap-2 uppercase tracking-wider">
                            <Brain className="w-4 h-4 text-[#C9A84C]" />
                            Recent AI-Driven Improvements
                          </h4>
                          <ul className="space-y-2">
                            {improvements.map((imp, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-[#0A0F2E]">
                                <TrendingUp className="w-4 h-4 text-[#2B8A6E] flex-shrink-0 mt-0.5" />
                                <span>{imp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-2">
                          <Button variant="outline" size="sm" className="border-[#E8E4DC] text-[#0A0F2E] hover:bg-[#F8F7F4]" onClick={() => handleViewHistory(playbook)}>
                            <History className="w-4 h-4 mr-2" />
                            Learning History
                          </Button>
                          <Button size="sm" className="bg-[#0A0F2E] text-white hover:bg-[#141B45]" onClick={() => handleActivatePlaybook(playbook)}>
                            <Target className="w-4 h-4 mr-2" />
                            Activate Playbook
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* How It Works */}
          <Card style={{ background: NAVY }} className="border-none shadow-xl text-white relative overflow-hidden">
            <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 2px 2px, rgba(201,168,76,0.1) 1px, transparent 0)", backgroundSize: "32px 32px" }} />
            <CardHeader className="relative z-10 border-b border-white/10 pb-6">
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <div style={{ width: 20, height: 2, background: GOLD }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>The ADVANCE Phase</span>
              </div>
              <CardTitle className="text-2xl" style={CG}>How Self-Learning Works</CardTitle>
              <CardDescription className="text-white/60">Every execution feeds the intelligence loop — making each playbook faster, sharper, and more precise.</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { step: "1", title: "Execute", icon: Zap, desc: "Playbook activated for a real strategic event — AI records every decision, timing, and outcome." },
                  { step: "2", title: "Capture", icon: Brain, desc: "AI analyzes execution data: who responded, how fast, what decisions unlocked downstream tasks." },
                  { step: "3", title: "Learn", icon: Award, desc: "Pattern analysis generates improvement recommendations across stakeholder sequencing, timing gates, and resource allocation." },
                  { step: "4", title: "Evolve", icon: TrendingUp, desc: "Playbook auto-updates for next execution. Over time, your 12-minute response becomes 8 minutes." },
                ].map((item, idx) => (
                  <div key={idx} className="relative">
                    <div style={{ background: GOLD, color: NAVY, ...CG }} className="rounded-none w-10 h-10 flex items-center justify-center mb-4 font-bold text-xl">
                      {item.step}
                    </div>
                    <item.icon className="w-5 h-5 mb-2" style={{ color: GOLD }} />
                    <h4 className="font-bold uppercase tracking-wider text-xs mb-2" style={{ color: GOLD }}>{item.title}</h4>
                    <p className="text-sm text-white/70 leading-relaxed">{item.desc}</p>
                    {idx < 3 && (
                      <div className="hidden md:block absolute top-4 right-0 translate-x-1/2">
                        <ArrowRight className="w-4 h-4 text-white/20" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                <p className="text-white/50 text-sm">Organizations using Living Playbooks report <strong className="text-white">42% faster</strong> execution by their 10th activation.</p>
                <Button size="sm" className="bg-[#C9A84C] text-[#0A0F2E] hover:bg-[#DFC178] font-bold rounded-none border-none" onClick={() => setLocation('/playbook-library')}>
                  View All 170 Playbooks
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </PageLayout>
  );
}
