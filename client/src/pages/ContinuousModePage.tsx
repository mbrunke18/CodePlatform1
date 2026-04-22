import PageLayout from '@/components/layout/PageLayout';
import { useDynamicStrategy } from '@/contexts/DynamicStrategyContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, Clock, Calendar, CheckCircle, AlertCircle, PlayCircle, Pause, Wifi, TrendingUp, Brain, Zap, Shield } from 'lucide-react';

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

const scheduledTasks = [
  {
    id: 1,
    name: 'Weak Signal Sweep',
    schedule: 'Every 15 minutes',
    lastRun: '3 minutes ago',
    nextRun: '12 minutes',
    status: 'active',
    executions: 1247,
  },
  {
    id: 2,
    name: 'Oracle Pattern Analysis',
    schedule: 'Every 30 minutes',
    lastRun: '8 minutes ago',
    nextRun: '22 minutes',
    status: 'active',
    executions: 623,
  },
  {
    id: 3,
    name: 'Readiness Index Calculation',
    schedule: 'Daily at 6:00 AM',
    lastRun: '18 hours ago',
    nextRun: 'Tomorrow at 6:00 AM',
    status: 'active',
    executions: 342,
  },
  {
    id: 4,
    name: 'Prepared response Learning Extraction',
    schedule: 'After each activation',
    lastRun: '2 days ago',
    nextRun: 'On demand',
    status: 'active',
    executions: 89,
  },
  {
    id: 5,
    name: 'Compliance Check',
    schedule: 'Weekly on Monday',
    lastRun: '3 days ago',
    nextRun: 'Monday at 9:00 AM',
    status: 'active',
    executions: 52,
  },
];

const recentExecutions = [
  { task: 'Weak Signal Sweep', time: '3 min ago', status: 'success', findings: '2 new signals' },
  { task: 'Oracle Pattern Analysis', time: '8 min ago', status: 'success', findings: '1 pattern detected' },
  { task: 'Weak Signal Sweep', time: '18 min ago', status: 'success', findings: '0 new signals' },
  { task: 'Weak Signal Sweep', time: '33 min ago', status: 'success', findings: '1 new signal' },
  { task: 'Readiness Index Calculation', time: '18 hrs ago', status: 'success', findings: 'Score: 84.4%' },
];

export default function ContinuousModePage() {
  const { continuousMode } = useDynamicStrategy();

  return (
    <PageLayout>
    <div className="min-h-screen bg-[#F8F7F4]">
      {/* ─── Dark Hero ─────────────────────────────────────────────── */}
      <div style={{ background: NAVY, padding: '36px 0 32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)', backgroundSize: '44px 44px', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ width: 28, height: 1.5, background: GOLD }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD }}>Advance Phase · Always-On Intelligence</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap' }}>
            <div>
              <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: '#F0EDE4', marginBottom: 8, lineHeight: 1.1 }}>
                Continuous <em style={{ color: GOLD }}>Operations Mode</em>
              </div>
              <div style={{ fontSize: 13, color: 'rgba(240,237,228,0.55)', maxWidth: 560, lineHeight: 1.6 }}>
                Always-on strategic monitoring, learning, and automated coordination across your enterprise.
              </div>
            </div>
          <Button 
            size="lg"
            className={continuousMode.enabled ? "bg-[#0A0F2E] text-white hover:bg-[#141B45]" : "bg-[#C9A84C] text-[#0A0F2E] font-bold hover:bg-[#DFC178]"}
            data-testid="button-toggle-continuous"
          >
            {continuousMode.enabled ? (
              <>
                <Pause className="w-5 h-5 mr-2" />
                Pause Operations
              </>
            ) : (
              <>
                <PlayCircle className="w-5 h-5 mr-2" />
                Activate Continuous Mode
              </>
            )}
          </Button>
          </div>
        </div>
      </div>

      {/* ─── Content ─────────────────────────────────────────────── */}
      <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className={`border shadow-none ${continuousMode.enabled ? 
            "border-[#2B8A6E] bg-[#2B8A6E]/5" : 
            "border-[#E8E4DC] bg-white"
          }`}>
            <CardHeader className="pb-2">
              <CardDescription className="text-[#6B7280]">System Status</CardDescription>
              <CardTitle className="text-3xl" style={CG}>
                <span className={continuousMode.enabled ? "text-[#2B8A6E]" : "text-[#0A0F2E]"}>
                  {continuousMode.enabled ? "ACTIVE" : "PAUSED"}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {continuousMode.enabled && (
                <div className="flex items-center gap-2 text-sm text-[#2B8A6E]">
                  <div className="w-2 h-2 bg-[#2B8A6E] animate-pulse"></div>
                  <span className="font-semibold uppercase tracking-wider text-[10px]">Monitoring in progress</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-[#E8E4DC] bg-white shadow-none">
            <CardHeader className="pb-2">
              <CardDescription className="text-[#6B7280]">Tasks Scheduled</CardDescription>
              <CardTitle className="text-3xl text-[#0A0F2E]" style={CG}>{continuousMode.tasksScheduled}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#6B7280]">
                Automated operations running
              </p>
            </CardContent>
          </Card>

          <Card className="border-[#E8E4DC] bg-white shadow-none">
            <CardHeader className="pb-2">
              <CardDescription className="text-[#6B7280]">Next Scheduled Run</CardDescription>
              <CardTitle className="text-3xl text-[#C9A84C]" style={CG}>
                {continuousMode.nextRun ? new Date(continuousMode.nextRun).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#6B7280]">
                {continuousMode.nextRun ? 'Weak Signal Sweep' : 'No tasks scheduled'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Scheduled Tasks */}
        <div>
          <h2 className="text-2xl font-bold text-[#0A0F2E] mb-4" style={CG}>Scheduled Automation Tasks</h2>
          <div className="space-y-3">
            {scheduledTasks.map((task) => (
              <Card key={task.id} className="border-[#E8E4DC] shadow-none bg-white overflow-hidden" data-testid={`card-task-${task.id}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="bg-[#0A0F2E] p-3 rounded-none">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#0A0F2E] mb-1">
                          {task.name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-[#6B7280]">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{task.schedule}</span>
                          </div>
                          <span>•</span>
                          <span className="font-medium">{task.executions} executions</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-[10px] uppercase tracking-wider font-bold text-[#6B7280] mb-1">Last run</div>
                        <div className="text-sm font-medium text-[#0A0F2E]">
                          {task.lastRun}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] uppercase tracking-wider font-bold text-[#6B7280] mb-1">Next run</div>
                        <div className="text-sm font-medium text-[#0A0F2E]">
                          {task.nextRun}
                        </div>
                      </div>
                      <Badge className={task.status === 'active' ? 'bg-[#2B8A6E]/12 text-[#2B8A6E] border-none' : 'bg-[#E8E4DC] text-[#6B7280] border-none'}>
                        {task.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Execution Log */}
        <div>
          <h2 className="text-2xl font-bold text-[#0A0F2E] mb-4" style={CG}>Recent Executions</h2>
          <Card className="border-[#E8E4DC] shadow-none bg-white">
            <CardContent className="p-6">
              <div className="space-y-3">
                {recentExecutions.map((execution, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 bg-[#F8F7F4] border border-[#E8E4DC]"
                    data-testid={`execution-log-${index}`}
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-[#2B8A6E]" />
                      <div>
                        <div className="font-medium text-[#0A0F2E]">
                          {execution.task}
                        </div>
                        <div className="text-sm text-[#6B7280]">
                          {execution.findings}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-[#6B7280]">
                      {execution.time}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Integration Health Grid */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <Wifi className="w-5 h-5" style={{ color: GOLD }} />
            <h3 className="text-lg font-bold uppercase tracking-widest text-[10px]" style={{ color: NAVY }}>Integration Health — Live</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Microsoft Teams", latency: "94ms", status: "live", uptime: "99.97%" },
              { name: "Azure OpenAI", latency: "210ms", status: "live", uptime: "99.91%" },
              { name: "Signal Intelligence", latency: "18ms", status: "live", uptime: "100%" },
              { name: "Prepared response Engine", latency: "32ms", status: "live", uptime: "99.99%" },
              { name: "Stakeholder CRM", latency: "55ms", status: "live", uptime: "99.88%" },
              { name: "Budget Allocator", latency: "41ms", status: "live", uptime: "99.95%" },
              { name: "Document Stager", latency: "67ms", status: "live", uptime: "99.93%" },
              { name: "War Room Engine", latency: "29ms", status: "live", uptime: "100%" },
            ].map((int) => (
              <div key={int.name} className="p-4 bg-white border rounded-sm" style={{ borderColor: BORDER }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-2 h-2 bg-[#2B8A6E]" />
                  <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: TEAL }}>LIVE</span>
                </div>
                <div className="font-semibold text-sm mb-1" style={{ color: NAVY }}>{int.name}</div>
                <div className="text-[10px] uppercase tracking-widest" style={{ color: MUTED }}>
                  {int.latency} · {int.uptime} uptime
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Proactive AI Insights */}
        <Card className="border rounded-sm" style={{ borderColor: BORDER, background: "#FDFCFA" }}>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <Brain className="w-5 h-5" style={{ color: GOLD }} />
              <CardTitle className="text-[13px] uppercase tracking-widest font-bold" style={{ color: NAVY }}>
                Proactive AI Insights — Generated This Cycle
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  icon: Shield,
                  confidence: 91,
                  label: "Competitor Pricing Shift Detected",
                  body: "Oracle reduced enterprise licensing by 12% in 3 markets. Prepared response 'Competitive Price Response' pre-staged and ready. Recommend executive review within 6 hours.",
                  urgency: "HIGH",
                  urgencyColor: "#dc2626",
                },
                {
                  icon: TrendingUp,
                  confidence: 84,
                  label: "Talent Pipeline Attrition Risk",
                  body: "Signal clustering across LinkedIn, Glassdoor, and internal HRIS indicates 2 senior engineering roles at departure risk. Retention prepared response can deploy in 12 minutes.",
                  urgency: "MEDIUM",
                  urgencyColor: GOLD,
                },
                {
                  icon: Zap,
                  confidence: 97,
                  label: "Regulatory Filing Window Opens in 72 Hours",
                  body: "SEC Form 10-K deadline approaching. Document staging is 94% complete. 3 pending executive approvals required before automatic submission.",
                  urgency: "CRITICAL",
                  urgencyColor: "#dc2626",
                },
              ].map((insight) => (
                <div key={insight.label} className="flex items-start gap-4 p-4 bg-white rounded-sm border" style={{ borderColor: BORDER }}>
                  <insight.icon className="w-5 h-5 shrink-0 mt-0.5" style={{ color: TEAL }} />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-semibold text-sm" style={{ color: NAVY }}>{insight.label}</span>
                      <Badge className="text-[9px] uppercase tracking-widest font-bold rounded-none px-2" style={{ background: insight.urgencyColor, color: "#fff" }}>{insight.urgency}</Badge>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: MUTED }}>{insight.body}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[9px] font-bold uppercase tracking-widest" style={{ color: MUTED }}>AI Confidence</div>
                    <div className="text-xl font-bold" style={{ color: GOLD }}>{insight.confidence}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Capabilities Overview */}
        <Card style={{ background: NAVY }} className="border-none text-white relative overflow-hidden">
          <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 2px 2px, rgba(201,168,76,0.1) 1px, transparent 0)", backgroundSize: "24px 24px" }} />
          <CardHeader className="relative z-10">
            <CardTitle className="text-2xl" style={CG}>Continuous Mode Capabilities</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-white/5 border border-white/10">
                <h4 className="font-semibold mb-2 flex items-center gap-2 text-[#C9A84C]">
                  <Activity className="w-5 h-5" />
                  Always-On Monitoring
                </h4>
                <p className="text-sm text-white/70">
                  24/7 scanning of intelligence signals for threats and opportunities
                </p>
              </div>
              <div className="p-4 bg-white/5 border border-white/10">
                <h4 className="font-semibold mb-2 flex items-center gap-2 text-[#C9A84C]">
                  <CheckCircle className="w-5 h-5" />
                  Automated Learning
                </h4>
                <p className="text-sm text-white/70">
                  Self-improving prepared responses after every execution
                </p>
              </div>
              <div className="p-4 bg-white/5 border border-white/10">
                <h4 className="font-semibold mb-2 flex items-center gap-2 text-[#C9A84C]">
                  <Clock className="w-5 h-5" />
                  Scheduled Operations
                </h4>
                <p className="text-sm text-white/70">
                  Automated tasks run on smart schedules optimized for your org
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
    </PageLayout>
  );
}
