import { useState } from 'react';
import { useLocation } from 'wouter';
import PageLayout from '@/components/layout/PageLayout';
import { useDynamicStrategy } from '@/contexts/DynamicStrategyContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dumbbell, Target, Trophy, TrendingUp, Play, Lock,
  Star, Clock, Users, Award, Calendar, BarChart3,
  CheckCircle, AlertTriangle, Brain, Zap, Shield, BookOpen,
  ArrowRight, Medal, Flame, Activity
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const OFF = "#F8F7F4";
const BORDER = "#E8E4DC";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

const trainingScenarios = [
  {
    id: 1,
    name: 'Crisis Decision Speed',
    description: 'Practice making critical decisions under time pressure with incomplete information — the executive reality',
    difficulty: 'Advanced',
    duration: '45 min',
    domain: 'Crisis Response',
    completed: false,
    score: null,
    participants: 847,
    successRate: 64,
    skills: ['Decision velocity', 'Risk tolerance calibration', 'Stakeholder sequencing'],
  },
  {
    id: 2,
    name: 'Weak Signal Detection',
    description: 'Train your team to identify early warning signs before they cascade into enterprise-level events',
    difficulty: 'Intermediate',
    duration: '30 min',
    domain: 'Intelligence',
    completed: true,
    score: 87,
    participants: 1240,
    successRate: 78,
    skills: ['Signal reading', 'Pattern recognition', 'Threshold calibration'],
  },
  {
    id: 3,
    name: 'Multi-Team Coordination',
    description: 'Simulate complex cross-functional responses requiring real-time alignment across 4+ departments',
    difficulty: 'Advanced',
    duration: '60 min',
    domain: 'Execution',
    completed: false,
    score: null,
    participants: 623,
    successRate: 58,
    skills: ['War room management', 'Delegation discipline', 'Escalation protocols'],
  },
  {
    id: 4,
    name: 'Readiness Protocol Customization',
    description: 'Adapt standard Readiness Protocols to your specific organizational context, risk tolerance, and governance rules',
    difficulty: 'Beginner',
    duration: '20 min',
    domain: 'IDENTIFY',
    completed: true,
    score: 92,
    participants: 2100,
    successRate: 89,
    skills: ['Readiness Protocol architecture', 'Stakeholder mapping', 'SLA setting'],
  },
  {
    id: 5,
    name: 'Board Communication Under Pressure',
    description: 'Practice delivering concise, accurate executive briefings during an active crisis — when every word counts',
    difficulty: 'Advanced',
    duration: '35 min',
    domain: 'Governance',
    completed: false,
    score: null,
    participants: 432,
    successRate: 61,
    skills: ['Executive communication', 'Board dynamics', 'Crisis framing'],
  },
  {
    id: 6,
    name: 'Regulatory Compliance Sprint',
    description: 'Navigate a surprise regulatory change and execute a compliance response within a compressed timeline',
    difficulty: 'Intermediate',
    duration: '40 min',
    domain: 'Regulatory',
    completed: false,
    score: null,
    participants: 789,
    successRate: 72,
    skills: ['Regulatory mapping', 'Legal escalation', 'Documentation protocols'],
  },
  {
    id: 7,
    name: 'Supply Chain Emergency',
    description: 'Manage a Tier-1 supplier failure with cascading effects on production and customer commitments',
    difficulty: 'Advanced',
    duration: '55 min',
    domain: 'Operations',
    completed: false,
    score: null,
    participants: 561,
    successRate: 67,
    skills: ['Supplier network activation', 'Inventory triage', 'Customer impact communication'],
  },
  {
    id: 8,
    name: 'Cyber Incident Command',
    description: 'Lead the first 12 minutes of a ransomware response — containing blast radius and preserving business continuity',
    difficulty: 'Advanced',
    duration: '50 min',
    domain: 'Cyber',
    completed: false,
    score: null,
    participants: 934,
    successRate: 55,
    skills: ['Incident containment', 'Forensic handoff', 'Business continuity activation'],
  },
  {
    id: 9,
    name: 'M&A Integration Day-1',
    description: 'Simulate the first 72 hours of a major acquisition integration — stakeholder alignment at speed',
    difficulty: 'Intermediate',
    duration: '45 min',
    domain: 'M&A',
    completed: false,
    score: null,
    participants: 312,
    successRate: 70,
    skills: ['Integration sequencing', 'Cultural change management', 'Dual-team coordination'],
  },
  {
    id: 10,
    name: 'Competitor Disruption Response',
    description: 'React to a surprise competitor move that threatens market position — rapid strategy adaptation drill',
    difficulty: 'Intermediate',
    duration: '30 min',
    domain: 'Competitive',
    completed: false,
    score: null,
    participants: 1015,
    successRate: 74,
    skills: ['Competitive intelligence', 'Strategy pivots', 'Sales enablement adjustment'],
  },
];

const leaderboard = [
  { rank: 1, name: 'Sarah Chen', role: 'CHRO', org: 'Fortune 100 Financials', score: 96, exercises: 14, streak: 12 },
  { rank: 2, name: 'Marcus Reid', role: 'COO', org: 'Global Manufacturing', score: 94, exercises: 11, streak: 8 },
  { rank: 3, name: 'Priya Nair', role: 'CRO', org: 'Life Sciences Enterprise', score: 91, exercises: 13, streak: 15 },
  { rank: 4, name: 'James Kovach', role: 'CFO', org: 'Fortune 500 Retail', score: 89, exercises: 9, streak: 6 },
  { rank: 5, name: 'Elena Vasquez', role: 'CMO', org: 'Tech Conglomerate', score: 87, exercises: 10, streak: 10 },
];

const certifications = [
  { id: 'crisis-commander', name: 'Crisis Commander', desc: 'Complete all 3 Advanced crisis exercises with 80%+ score', earned: false, requirement: '3 exercises', icon: Shield, color: '#dc2626' },
  { id: 'signal-reader', name: 'Signal Reader', desc: 'Complete Weak Signal Detection with 90%+ score', earned: true, requirement: '1 exercise', icon: Activity, color: TEAL },
  { id: 'Readiness Protocol-architect', name: 'Readiness Protocol Architect', desc: 'Customize 5 Readiness Protocols with peer-reviewed quality scores', earned: false, requirement: '5 Readiness Protocols', icon: BookOpen, color: NAVY },
  { id: 'coordination-expert', name: 'Coordination Expert', desc: 'Lead 3 multi-team simulation sessions as exercise commander', earned: false, requirement: '3 sessions', icon: Users, color: GOLD },
  { id: 'execution-ready', name: 'Execution Ready', desc: 'Complete all beginner and intermediate exercises with 85%+ average', earned: true, requirement: '6 exercises', icon: CheckCircle, color: TEAL },
  { id: 'elite-responder', name: 'Elite Responder', desc: 'Earn all 5 other certifications — the full strategic readiness credential', earned: false, requirement: 'All certifications', icon: Trophy, color: GOLD },
];

const upcomingDrills = [
  { date: 'Apr 3', name: 'Enterprise-Wide Crisis Simulation', type: 'Live', participants: 24, registered: true },
  { date: 'Apr 11', name: 'Regulatory Sprint Challenge', type: 'Cohort', participants: 12, registered: false },
  { date: 'Apr 18', name: 'Advanced Cyber Command', type: 'Individual', participants: 1, registered: false },
  { date: 'Apr 25', name: 'Board Communication Masterclass', type: 'Cohort', participants: 8, registered: false },
];

const teamStats = {
  totalExercises: 127,
  avgScore: 84,
  hoursTraining: 342,
  certifications: 28,
  streak: 15,
  rank: 4,
};

const difficultyColor = (d: string) =>
  d === 'Advanced' ? NAVY : d === 'Intermediate' ? GOLD : TEAL;

export default function FutureGym() {
  const [, setLocation] = useLocation();
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const { toast } = useToast();
  const { readiness } = useDynamicStrategy();

  const handleStartExercise = (scenario: typeof trainingScenarios[0]) => {
    setLocation('/try-demo');
    toast({
      title: `Starting: ${scenario.name}`,
      description: `${scenario.difficulty} · ${scenario.duration} · ${scenario.domain}`,
    });
  };

  const filteredScenarios = activeFilter === 'all'
    ? trainingScenarios
    : trainingScenarios.filter(s =>
        activeFilter === 'completed' ? s.completed :
        activeFilter === 'advanced' ? s.difficulty === 'Advanced' :
        activeFilter === 'beginner' ? s.difficulty !== 'Advanced' : true
      );

  return (
    <PageLayout>
      <div className="bg-[#F8F7F4] min-h-screen">

        {/* ─── Dark Hero ─── */}
        <div style={{ background: NAVY, padding: '36px 0 32px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)', backgroundSize: '44px 44px', pointerEvents: 'none' }} />
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 28, height: 1.5, background: GOLD }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD }}>Execute Phase · Strategic Preparedness</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap' }}>
              <div>
                <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: '#F0EDE4', marginBottom: 8, lineHeight: 1.1 }}>
                  Future <em style={{ color: GOLD }}>Gym</em>
                </div>
                <div style={{ fontSize: 13, color: 'rgba(240,237,228,0.55)', maxWidth: 540, lineHeight: 1.6 }}>
                  Build strategic muscle through simulated scenarios and practice drills designed for enterprise teams. The executives who respond fastest trained before the trigger fired.
                </div>
              </div>
              <Button size="lg" className="bg-[#C9A84C] text-[#0A0F2E] font-bold hover:bg-[#DFC178] rounded-none" onClick={() => setLocation('/practice-drills')}>
                <Target className="w-4 h-4 mr-2" />
                Create Custom Drill
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-8 py-10 space-y-10">

          {/* Team Performance KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {[
              { value: teamStats.totalExercises, label: 'Exercises Completed', color: NAVY, icon: Dumbbell },
              { value: `${teamStats.avgScore}%`, label: 'Average Score', color: GOLD, icon: BarChart3 },
              { value: teamStats.hoursTraining, label: 'Training Hours', color: TEAL, icon: Clock },
              { value: teamStats.certifications, label: 'Certifications Earned', color: GOLD, icon: Award },
              { value: `#${teamStats.rank}`, label: 'Org Leaderboard Rank', color: TEAL, icon: Trophy },
              { value: `${teamStats.streak}d`, label: 'Current Streak', color: '#dc2626', icon: Flame },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <Card key={i} className="border-[#E8E4DC] bg-white shadow-none">
                  <CardContent className="p-5 text-center">
                    <Icon className="w-5 h-5 mx-auto mb-2" style={{ color: stat.color }} />
                    <div className="text-3xl font-bold mb-1" style={{ ...CG, color: stat.color }}>{stat.value}</div>
                    <div className="text-[9px] uppercase tracking-widest font-bold text-[#6B7280]">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Readiness Improvement Tracker */}
          <Card className="border-[#E8E4DC] bg-white shadow-none">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle style={CG} className="text-xl text-[#0A0F2E]">Readiness Improvement Tracker</CardTitle>
                  <CardDescription className="text-[#6B7280]">Training impact on your Future Readiness Index™ — updated after each exercise</CardDescription>
                </div>
                <Badge className="bg-[#2B8A6E]/12 text-[#2B8A6E] border-none text-[10px] font-bold tracking-widest uppercase px-3 py-1">
                  Live Score
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {Object.entries(readiness).filter(([key]) => key !== 'overall').map(([key, value]) => (
                  <div key={key} className="text-center p-4 bg-[#F8F7F4] border border-[#E8E4DC]">
                    <div className="text-2xl font-bold text-[#0A0F2E] mb-1" style={CG}>{value}%</div>
                    <div className="text-[9px] uppercase tracking-widest font-bold text-[#6B7280] mb-3 capitalize">{key}</div>
                    <Progress value={value} className="h-1.5 bg-[#E8E4DC]" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Main Tabs */}
          <Tabs defaultValue="scenarios" className="w-full">
            <TabsList className="bg-[#E8E4DC] rounded-none mb-6">
              <TabsTrigger value="scenarios" className="rounded-none data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-white">
                <Dumbbell className="w-4 h-4 mr-2" /> Training Scenarios
              </TabsTrigger>
              <TabsTrigger value="leaderboard" className="rounded-none data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-white">
                <Trophy className="w-4 h-4 mr-2" /> Leaderboard
              </TabsTrigger>
              <TabsTrigger value="certifications" className="rounded-none data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-white">
                <Award className="w-4 h-4 mr-2" /> Certifications
              </TabsTrigger>
              <TabsTrigger value="calendar" className="rounded-none data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-white">
                <Calendar className="w-4 h-4 mr-2" /> Upcoming Drills
              </TabsTrigger>
            </TabsList>

            {/* ─ SCENARIOS TAB ─ */}
            <TabsContent value="scenarios">
              {/* Filters */}
              <div className="flex items-center gap-2 mb-6">
                {[
                  { id: 'all', label: 'All Scenarios' },
                  { id: 'completed', label: 'Completed' },
                  { id: 'advanced', label: 'Advanced' },
                  { id: 'beginner', label: 'Beginner / Intermediate' },
                ].map(f => (
                  <button key={f.id} onClick={() => setActiveFilter(f.id)}
                    className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 border transition-all"
                    style={{
                      background: activeFilter === f.id ? NAVY : '#fff',
                      color: activeFilter === f.id ? '#fff' : '#6B7280',
                      borderColor: activeFilter === f.id ? NAVY : BORDER,
                    }}>
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredScenarios.map(scenario => (
                  <Card key={scenario.id} className="border border-[#E8E4DC] bg-white shadow-none relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: difficultyColor(scenario.difficulty) }} />
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className="border-none text-[9px] font-bold tracking-widest uppercase px-2 py-0.5"
                              style={{ background: `${difficultyColor(scenario.difficulty)}18`, color: difficultyColor(scenario.difficulty) }}>
                              {scenario.difficulty}
                            </Badge>
                            <span className="text-[10px] text-[#6B7280] font-medium">{scenario.domain}</span>
                          </div>
                          <CardTitle className="text-lg text-[#0A0F2E]" style={CG}>{scenario.name}</CardTitle>
                          <CardDescription className="mt-1 text-[#6B7280] text-sm">{scenario.description}</CardDescription>
                        </div>
                        {scenario.completed && <Trophy className="w-5 h-5 text-[#C9A84C] flex-shrink-0 ml-3" />}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Stats row */}
                      <div className="grid grid-cols-3 gap-3 p-3 bg-[#F8F7F4] border border-[#E8E4DC]">
                        <div className="text-center">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] mb-1">Duration</div>
                          <div className="font-bold text-sm text-[#0A0F2E]">{scenario.duration}</div>
                        </div>
                        <div className="text-center border-x border-[#E8E4DC]">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] mb-1">Industry Avg</div>
                          <div className="font-bold text-sm text-[#C9A84C]">{scenario.successRate}%</div>
                        </div>
                        <div className="text-center">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] mb-1">Participants</div>
                          <div className="font-bold text-sm text-[#0A0F2E]">{scenario.participants.toLocaleString()}</div>
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-1.5">
                        {scenario.skills.map(skill => (
                          <span key={skill} className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 border border-[#E8E4DC] text-[#6B7280]">
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* Score if completed */}
                      {scenario.completed && scenario.score && (
                        <div className="p-3 border border-[#2B8A6E]/20 bg-[#2B8A6E]/5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-[#2B8A6E]" />
                              <span className="text-[10px] uppercase tracking-wider font-bold text-[#2B8A6E]">Completed</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold text-[#2B8A6E]" style={CG}>{scenario.score}%</span>
                              {scenario.score >= 90 && <Star className="w-4 h-4 text-[#C9A84C] fill-current" />}
                            </div>
                          </div>
                        </div>
                      )}

                      <Button
                        className="w-full rounded-none font-bold text-[11px] uppercase tracking-wider"
                        style={{
                          background: scenario.completed ? 'transparent' : NAVY,
                          color: scenario.completed ? NAVY : '#fff',
                          border: scenario.completed ? `1px solid ${BORDER}` : 'none',
                        }}
                        onClick={() => handleStartExercise(scenario)}>
                        {scenario.completed ? (
                          <><RefreshCcw className="w-4 h-4 mr-2" />Retake Exercise</>
                        ) : (
                          <><Play className="w-4 h-4 mr-2" />Start Exercise</>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* ─ LEADERBOARD TAB ─ */}
            <TabsContent value="leaderboard">
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-[#6B7280]">Rankings across all participating enterprise organizations in the VaughnMartin Founding Partner network.</p>
                  <Badge className="bg-[#C9A84C]/15 text-[#0A0F2E] border-none text-[10px] font-bold tracking-widest uppercase px-3">
                    Updated Weekly
                  </Badge>
                </div>
                {leaderboard.map(entry => (
                  <div key={entry.rank} className="bg-white border border-[#E8E4DC] p-5 flex items-center gap-6">
                    <div className="text-center" style={{ minWidth: 48 }}>
                      <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: entry.rank === 1 ? GOLD : entry.rank === 2 ? '#9CA3AF' : entry.rank === 3 ? '#C97C4C' : NAVY, lineHeight: 1 }}>{entry.rank}</div>
                    </div>
                    <div className="w-10 h-10 rounded-none flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
                      style={{ background: entry.rank <= 3 ? GOLD : NAVY }}>
                      {entry.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-[#0A0F2E]">{entry.name}</div>
                      <div className="text-[11px] text-[#6B7280]">{entry.role} · {entry.org}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-6 text-center">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] mb-1">Score</div>
                        <div className="text-xl font-bold text-[#2B8A6E]" style={CG}>{entry.score}%</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] mb-1">Exercises</div>
                        <div className="text-xl font-bold text-[#0A0F2E]" style={CG}>{entry.exercises}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] mb-1">Streak</div>
                        <div className="text-xl font-bold text-[#C9A84C]" style={CG}>{entry.streak}d</div>
                      </div>
                    </div>
                    {entry.rank <= 3 && <Medal className="w-6 h-6" style={{ color: entry.rank === 1 ? GOLD : entry.rank === 2 ? '#9CA3AF' : '#C97C4C' }} />}
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* ─ CERTIFICATIONS TAB ─ */}
            <TabsContent value="certifications">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certifications.map(cert => {
                  const Icon = cert.icon;
                  return (
                    <div key={cert.id} className="bg-white border p-6 relative overflow-hidden"
                      style={{ borderColor: cert.earned ? cert.color : BORDER, borderTopWidth: cert.earned ? 3 : 1 }}>
                      {cert.earned && (
                        <div className="absolute top-3 right-3">
                          <CheckCircle className="w-5 h-5" style={{ color: cert.color }} />
                        </div>
                      )}
                      <div style={{ width: 32, height: 3, background: cert.color, opacity: cert.earned ? 1 : 0.4, marginBottom: 16 }} />
                      <div className="font-bold text-[#0A0F2E] mb-1" style={{ ...CG, fontSize: 18, opacity: cert.earned ? 1 : 0.6 }}>{cert.name}</div>
                      <div className="text-sm text-[#6B7280] mb-3" style={{ opacity: cert.earned ? 1 : 0.7 }}>{cert.desc}</div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">{cert.requirement}</span>
                        <Badge className="border-none text-[9px] font-bold tracking-widest uppercase"
                          style={cert.earned ? { background: `${cert.color}18`, color: cert.color } : { background: '#F8F7F4', color: '#9CA3AF' }}>
                          {cert.earned ? 'EARNED' : 'IN PROGRESS'}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            {/* ─ CALENDAR TAB ─ */}
            <TabsContent value="calendar">
              <div className="space-y-4">
                {upcomingDrills.map((drill, i) => (
                  <div key={i} className="bg-white border border-[#E8E4DC] p-5 flex items-center gap-6">
                    <div className="text-center border-r border-[#E8E4DC] pr-6" style={{ minWidth: 80 }}>
                      <div style={{ ...CG, fontSize: 22, fontWeight: 700, color: NAVY, lineHeight: 1.1 }}>{drill.date.split(' ')[1]}</div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">{drill.date.split(' ')[0]}</div>
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-[#0A0F2E] mb-1">{drill.name}</div>
                      <div className="flex items-center gap-3 text-[11px] text-[#6B7280]">
                        <span className="uppercase tracking-wider font-bold">{drill.type}</span>
                        <span>·</span>
                        <span><Users className="w-3 h-3 inline mr-1" />{drill.participants} participant{drill.participants !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                    <Button size="sm" className="rounded-none font-bold text-[11px] uppercase tracking-wider"
                      style={drill.registered ? { background: TEAL, color: '#fff' } : { background: NAVY, color: '#fff' }}>
                      {drill.registered ? 'Registered ✓' : 'Register'}
                    </Button>
                  </div>
                ))}
                <div className="text-center pt-4">
                  <Button variant="outline" className="border-[#E8E4DC] text-[#0A0F2E] rounded-none font-bold text-[11px] uppercase tracking-wider">
                    View Full Calendar <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

        </div>
      </div>
    </PageLayout>
  );
}

function RefreshCcw(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 2v6h6"/><path d="M3 13a9 9 0 1 0 3-7.7L3 8"/>
    </svg>
  );
}
