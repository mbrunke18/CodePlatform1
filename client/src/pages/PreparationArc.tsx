import { useState } from 'react';
import { useLocation } from 'wouter';
import PageLayout from '@/components/layout/PageLayout';
import {
  CheckCircle2, ChevronRight, Target, Users, Grid3X3,
  Activity, Shield, Zap, BookOpen, Play, BarChart3,
  ArrowRight, Lock, Clock, Star, Layers, Radio
} from 'lucide-react';

const NAVY = '#0A0F2E';
const GOLD = '#C9A84C';
const TEAL = '#2B8A6E';
const IVORY = '#F0EDE4';
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

// ─── Week Data ────────────────────────────────────────────────────────────────

const WEEKS = [
  {
    num: 1,
    label: 'Week 1',
    title: 'Install',
    tagline: 'Configure your foundation. Define who owns what when the trigger fires.',
    color: TEAL,
    commitment: '4–6 hours total · Executive Sponsor + Preparation Architect',
    outcome: 'Platform is configured for your organization. Decision rights are mapped. Signal monitoring is active.',
    milestone: 'Signal monitoring live · Decision rights defined · Stakeholder roster complete',
    tasks: [
      {
        day: 'Day 1–2',
        title: 'Organization Foundation',
        description: 'Complete the Setup Wizard — company profile, industry vertical, employee count, public or private classification, and primary market regions. These fields determine which of the 231 detection thresholds apply to your organization.',
        actions: [
          { label: 'Open Setup Wizard', href: '/onboarding-wizard', primary: true },
        ],
        fields: ['Company profile', 'Industry vertical', 'Employee count', 'Public / Private', 'Primary markets'],
      },
      {
        day: 'Day 2–3',
        title: 'Decision Rights & Domain Owners',
        description: 'Name the executive sponsor and Preparation Architect. Assign a named owner, backup, email, and mobile number to each of the 6 response domains. This is the most critical setup step — without it, the system cannot route execution to the right person in 12 minutes.',
        actions: [
          { label: 'Configure Domain Owners', href: '/onboarding-wizard', primary: true },
        ],
        fields: ['Executive sponsor', 'Preparation Architect', '6 domain owners', 'Backup owners', 'Mobile + email for each'],
      },
      {
        day: 'Day 3–4',
        title: 'Organization Structure',
        description: 'Add your department structure, configure at least one escalation policy, and connect a minimum of two communication channels — email, Microsoft Teams, Slack, or webhook. Redundancy in channels ensures delivery when the primary channel fails.',
        actions: [
          { label: 'Open Organization Setup', href: '/organization-setup', primary: true },
        ],
        fields: ['3+ departments', 'Escalation policy', '2 communication channels'],
      },
      {
        day: 'Day 4–5',
        title: 'Priority Configuration',
        description: 'Set your target execution time (default 12 minutes), define the pre-approved budget threshold per activation, and configure approval requirements. These three settings determine the speed and authority envelope of every future activation.',
        actions: [
          { label: 'Configure Priority Settings', href: '/onboarding-wizard', primary: true },
        ],
        fields: ['Execution time target', 'Pre-approved budget threshold', 'Approval requirements'],
      },
    ],
  },
  {
    num: 2,
    label: 'Week 2',
    title: 'Build',
    tagline: 'Build your call sheets. Pre-stage the response before the trigger fires.',
    color: GOLD,
    commitment: '6–10 hours total · Executive team + domain owners',
    outcome: '5–10 complete Readiness Protocols staged and ready. Every priority trigger has a defined role × situation call sheet.',
    milestone: '5 protocols published · Call sheets built · Authorization chains defined',
    tasks: [
      {
        day: 'Day 8–9',
        title: 'Build Your First Call Sheet',
        description: 'Use the Situation Matrix Builder to build your first priority protocol. Start with the trigger your organization is most likely to face — Regulatory Investigation, Activist Investor, or Cybersecurity/Ransomware are the most common starting points. Accept all system suggestions and publish. Refine later.',
        actions: [
          { label: 'Open Situation Matrix Builder', href: '/situation-matrix-builder', primary: true },
          { label: 'Browse Protocol Library', href: '/playbooks', primary: false },
        ],
        fields: ['Select situation', 'Confirm roles', 'Accept or customize matrix', 'Define authorization chain', 'Publish call sheet'],
      },
      {
        day: 'Day 9–11',
        title: 'Build 4 More Priority Protocols',
        description: 'Build one call sheet per priority trigger across your three strategic domains. Each takes 5–30 minutes depending on depth. Use "Accept All Suggestions" for speed on triggers you\'ll refine later. Prioritize: your highest-probability triggers first, your highest-consequence triggers second.',
        actions: [
          { label: 'Build Another Protocol', href: '/situation-matrix-builder', primary: true },
          { label: 'Choose Which Builder', href: '/build-protocol', primary: false },
        ],
        fields: ['2 RISK & RESILIENCE protocols', '2 GROWTH & POSITIONING protocols', '1 TRANSFORMATION protocol'],
      },
      {
        day: 'Day 11–12',
        title: 'Configure Signal Coverage',
        description: 'For each published protocol, confirm which signal sources and detection threshold categories feed it. Signal coverage determines when the system automatically surfaces each protocol as the recommended response. The more precisely configured, the faster the surface time.',
        actions: [
          { label: 'Open Protocol Library', href: '/my-protocols', primary: true },
        ],
        fields: ['Signal sources per protocol', 'Trigger category mapping', 'Readiness threshold (%)'],
      },
      {
        day: 'Day 12–14',
        title: 'Intelligence Review',
        description: 'Review the Predictive Signal Intelligence page to identify which additional triggers the system is detecting for your sector. This tells you which protocols to build next — the ones the signal environment is already suggesting you need.',
        actions: [
          { label: 'Predictive Intelligence', href: '/predictive-intelligence', primary: true },
          { label: 'Sector Intelligence', href: '/sector-intelligence', primary: false },
        ],
        fields: ['Sector signal patterns', 'Emerging trigger indicators', 'Recommended next protocols'],
      },
    ],
  },
  {
    num: 3,
    label: 'Week 3',
    title: 'Drill',
    tagline: 'Run it before it fires. Gaps found in practice do not cost anything. Gaps found in execution cost everything.',
    color: TEAL,
    commitment: '3–5 hours total · Full executive team',
    outcome: 'At least one full activation drill completed and debriefed. Call sheets refined based on real drill performance.',
    milestone: '1 drill completed · Debrief recorded · Protocols refined',
    tasks: [
      {
        day: 'Day 15–16',
        title: '12-Minute Test Drive',
        description: 'Run the public 4-step simulation first — no login required for observers. This orients your executive team on what activation looks like before you run a live drill. Share the Test Drive URL with every domain owner ahead of the full drill session.',
        actions: [
          { label: 'Run the 12-Minute Test Drive', href: '/12-minute-experience', primary: true },
        ],
        fields: ['Select a scenario', 'Run 4-step simulation', 'Share with executive team'],
      },
      {
        day: 'Day 17–18',
        title: 'Full Activation Drill',
        description: 'Run a full practice drill against your highest-priority protocol. Every domain owner participates. The system generates real stakeholder alerts, task assignments, and executive authorization requests — exactly as it will in a live situation. Observe what breaks.',
        actions: [
          { label: 'Schedule Practice Drill', href: '/practice-drills', primary: true },
        ],
        fields: ['Select priority protocol', 'Activate drill mode', 'Full stakeholder notification', 'Executive authorization flow', 'Task assignment execution'],
      },
      {
        day: 'Day 18–19',
        title: 'Post-Drill Debrief',
        description: 'Record the post-drill debrief immediately after the drill completes. What worked. What failed. Which cell in the call sheet was wrong. Which stakeholder was unreachable. Every finding becomes a protocol update. This is how the call sheet gets better.',
        actions: [
          { label: 'Open Post-Drill Debrief', href: '/practice-drills', primary: true },
        ],
        fields: ['What worked', 'What failed', 'Protocol updates needed', 'Stakeholder gaps identified'],
      },
      {
        day: 'Day 19–21',
        title: 'Refine Call Sheets',
        description: 'Return to the Situation Matrix Builder and update the cells the drill exposed. A cell that said "issue litigation hold immediately" but the General Counsel was in a timezone that made that impossible in 12 minutes — fix that now. Not when the trigger fires.',
        actions: [
          { label: 'Open Situation Matrix Builder', href: '/situation-matrix-builder', primary: true },
          { label: 'View My Protocols', href: '/my-protocols', primary: false },
        ],
        fields: ['Update exposed cells', 'Adjust authorization chain', 'Refine watch signals', 'Add situation variants missed'],
      },
    ],
  },
  {
    num: 4,
    label: 'Week 4',
    title: 'Go-Live',
    tagline: 'Confirm readiness. Brief the board. Activate the system. The response is ready before the trigger fires.',
    color: NAVY,
    commitment: '2–4 hours total · Executive Sponsor + Board Chair',
    outcome: 'System is live and monitoring. Board is briefed. Readiness score confirmed. ADVANCE loop begins measuring.',
    milestone: 'Go-live confirmed · Board briefed · ADVANCE loop active',
    tasks: [
      {
        day: 'Day 22–23',
        title: 'Readiness Audit',
        description: 'Complete the Getting Started checklist — verify that all critical items across all four phases are complete. The system scores your configuration against 10 critical readiness indicators. Target 90% or above before declaring go-live.',
        actions: [
          { label: 'Open Readiness Checklist', href: '/getting-started', primary: true },
          { label: 'Run Readiness Assessment', href: '/readiness-assessment', primary: false },
        ],
        fields: ['10 critical indicators', 'Phase 1–4 completion', '90%+ readiness score'],
      },
      {
        day: 'Day 24–25',
        title: 'Executive Team Access',
        description: 'Ensure every domain owner and backup owner has platform access and has logged in at least once. Stakeholders who have never seen the platform before a trigger fires create a 12-minute delay that defeats the preparation.',
        actions: [
          { label: 'Manage Team Access', href: '/settings', primary: true },
        ],
        fields: ['All domain owners logged in', 'Backup owners verified', 'Mobile notifications tested'],
      },
      {
        day: 'Day 26–27',
        title: 'Board Briefing',
        description: 'Brief the board on the platform\'s readiness posture. Use the Executive Brief — a full printable one-pager covering your configuration, readiness score, protocols staged, and the 3,600× execution head start. Board awareness accelerates authorization during live situations.',
        actions: [
          { label: 'Generate Executive Brief', href: '/executive-brief', primary: true },
        ],
        fields: ['Readiness score', 'Protocols staged', 'Authorization chain', '3,600× framing'],
      },
      {
        day: 'Day 28–30',
        title: 'Declare Go-Live',
        description: 'Signal monitoring is active. Call sheets are staged. The executive team is ready. When a trigger fires from this point forward, your organization mobilizes in 12 minutes — not because you move fast, but because the preparation was already done.',
        actions: [
          { label: 'View Live Signal Dashboard', href: '/mission-control', primary: true },
          { label: 'Open Intelligence Hub', href: '/predictive-intelligence', primary: false },
        ],
        fields: ['Signal monitoring confirmed', 'Protocols staged and live', 'ADVANCE loop begins measuring'],
      },
    ],
  },
];

// ─── Components ───────────────────────────────────────────────────────────────

function WeekTab({ week, active, onClick }: { week: typeof WEEKS[0]; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex-1 py-4 px-3 text-left transition-all border-b-2"
      style={{
        borderColor: active ? week.color : 'transparent',
        background: active ? week.color + '08' : 'transparent',
      }}
    >
      <div className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: active ? week.color : '#9CA3AF' }}>
        {week.label}
      </div>
      <div className="text-sm font-bold" style={{ color: active ? NAVY : '#9CA3AF' }}>{week.title}</div>
    </button>
  );
}

function TaskCard({ task, weekColor, nav }: { task: typeof WEEKS[0]['tasks'][0]; weekColor: string; nav: (p: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border rounded-sm bg-white overflow-hidden" style={{ borderColor: '#E5E7EB' }}>
      <button
        className="w-full text-left p-5 flex items-start justify-between gap-4"
        onClick={() => setOpen(o => !o)}
      >
        <div className="flex items-start gap-4">
          <div
            className="text-[10px] font-bold tracking-wider px-2 py-1 rounded-sm flex-shrink-0 mt-0.5"
            style={{ background: weekColor + '15', color: weekColor }}
          >
            {task.day}
          </div>
          <div>
            <div className="text-sm font-bold mb-1" style={{ color: NAVY }}>{task.title}</div>
            <div className="text-xs text-gray-500 leading-relaxed pr-4">{task.description}</div>
          </div>
        </div>
        <ChevronRight className={`h-4 w-4 flex-shrink-0 text-gray-300 transition-transform ${open ? 'rotate-90' : ''}`} />
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-gray-50 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-2">Checklist</div>
              <ul className="space-y-1.5">
                {task.fields.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
                    <div className="w-3.5 h-3.5 rounded-full border-2 flex-shrink-0" style={{ borderColor: weekColor + '60' }} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-2">Actions</div>
              <div className="space-y-2">
                {task.actions.map((a, i) => (
                  <button
                    key={i}
                    onClick={e => { e.stopPropagation(); nav(a.href); }}
                    className="w-full px-3 py-2 rounded-sm text-xs font-bold text-left flex items-center justify-between gap-2 transition-all"
                    style={a.primary
                      ? { background: NAVY, color: '#fff' }
                      : { background: '#F3F4F6', color: NAVY, border: '1px solid #E5E7EB' }
                    }
                  >
                    {a.label}
                    <ArrowRight className="h-3 w-3 flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function PreparationArc() {
  const [, nav] = useLocation();
  const [activeWeek, setActiveWeek] = useState(0);
  const week = WEEKS[activeWeek];

  return (
    <PageLayout>

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ background: NAVY, padding: '56px 48px 52px' }}>
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(201,168,76,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.04) 1px,transparent 1px)`,
          backgroundSize: '44px 44px'
        }} />
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: GOLD }}>— 30-Day Preparation Arc</div>
          <h1 style={{ ...CG, fontSize: 'clamp(32px,4vw,54px)', fontWeight: 600, color: '#fff', lineHeight: 1.05, marginBottom: 14 }}>
            The preparation that makes<br />
            <em style={{ color: GOLD }}>12-minute execution possible.</em>
          </h1>
          <p className="text-sm max-w-2xl leading-relaxed mb-10" style={{ color: 'rgba(255,255,255,0.55)' }}>
            The 12 minutes is the payoff. The 30 days is the investment. Every field you configure, every call sheet you build, every drill you run — that preparation compresses the mobilization cycle. When the trigger fires, your organization doesn't scramble. It executes.
          </p>

          {/* Week summary strip */}
          <div className="grid grid-cols-4 gap-1" style={{ background: 'rgba(255,255,255,0.04)' }}>
            {WEEKS.map((w, i) => (
              <button
                key={w.num}
                onClick={() => setActiveWeek(i)}
                className="p-4 text-left transition-all"
                style={{ background: activeWeek === i ? 'rgba(255,255,255,0.08)' : 'transparent' }}
              >
                <div className="text-[9px] font-bold tracking-widest uppercase mb-1" style={{ color: w.color }}>{w.label}</div>
                <div className="text-sm font-bold text-white mb-1">{w.title}</div>
                <div className="text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{w.tagline.split('.')[0]}.</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Thesis bar */}
      <div className="border-b" style={{ background: IVORY, borderColor: '#E8E4DC' }}>
        <div className="max-w-5xl mx-auto px-8 py-3 flex items-center gap-8">
          {[
            { label: '30 Days', sub: 'Preparation investment' },
            { label: '→', sub: '' },
            { label: '4 Phases', sub: 'Install · Build · Drill · Go-Live' },
            { label: '→', sub: '' },
            { label: '12 Minutes', sub: 'Trigger-to-execution window' },
            { label: '→', sub: '' },
            { label: '3,600×', sub: 'Execution head start' },
          ].map((item, i) => (
            <div key={i} className={item.label === '→' ? 'text-gray-300 text-lg font-light' : ''}>
              {item.label === '→' ? item.label : (
                <div>
                  <div className="text-sm font-bold" style={{ color: NAVY }}>{item.label}</div>
                  <div className="text-[10px] text-gray-500">{item.sub}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Week Detail */}
      <div className="max-w-5xl mx-auto px-8 py-10">

        {/* Week Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          {WEEKS.map((w, i) => (
            <WeekTab key={w.num} week={w} active={activeWeek === i} onClick={() => setActiveWeek(i)} />
          ))}
        </div>

        {/* Active Week */}
        <div className="grid grid-cols-3 gap-8">
          {/* Tasks — left 2/3 */}
          <div className="col-span-2 space-y-3">
            <div className="mb-5">
              <div className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: week.color }}>{week.label} — {week.title}</div>
              <h2 className="text-2xl font-bold mb-1" style={{ color: NAVY }}>{week.tagline.split('.')[0]}.</h2>
              <p className="text-xs text-gray-500 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {week.commitment}
              </p>
            </div>

            {week.tasks.map((task, i) => (
              <TaskCard key={i} task={task} weekColor={week.color} nav={nav} />
            ))}
          </div>

          {/* Week Sidebar — right 1/3 */}
          <div className="space-y-4">
            {/* Week Outcome */}
            <div className="p-5 rounded-sm" style={{ background: week.color + '08', border: `1px solid ${week.color}25` }}>
              <div className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: week.color }}>Week {week.num} Outcome</div>
              <p className="text-xs text-gray-700 leading-relaxed mb-3">{week.outcome}</p>
              <div className="pt-3 border-t" style={{ borderColor: week.color + '20' }}>
                <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1.5">Milestone</div>
                <p className="text-xs font-bold" style={{ color: week.color }}>{week.milestone}</p>
              </div>
            </div>

            {/* Phase nav */}
            <div className="rounded-sm overflow-hidden border border-gray-100">
              {WEEKS.map((w, i) => (
                <button
                  key={w.num}
                  onClick={() => setActiveWeek(i)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left border-b border-gray-50 last:border-0 transition-all"
                  style={{ background: activeWeek === i ? NAVY : '#fff' }}
                >
                  <div
                    className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold"
                    style={activeWeek === i ? { background: GOLD, color: NAVY } : { background: w.color + '20', color: w.color }}
                  >
                    {w.num}
                  </div>
                  <div>
                    <div className="text-[10px] font-bold" style={{ color: activeWeek === i ? 'rgba(255,255,255,0.5)' : '#9CA3AF' }}>{w.label}</div>
                    <div className="text-xs font-bold" style={{ color: activeWeek === i ? '#fff' : NAVY }}>{w.title}</div>
                  </div>
                  {activeWeek === i && <ChevronRight className="h-3.5 w-3.5 ml-auto" style={{ color: GOLD }} />}
                </button>
              ))}
            </div>

            {/* Quick link to Getting Started */}
            <button
              onClick={() => nav('/getting-started')}
              className="w-full p-4 rounded-sm text-left transition-all hover:opacity-90"
              style={{ background: NAVY }}
            >
              <div className="text-[10px] font-bold tracking-widest uppercase text-white/50 mb-1">Track Progress</div>
              <div className="text-sm font-bold text-white mb-0.5">Go-Live Readiness Hub</div>
              <div className="text-xs text-white/50">Your setup completion score across all four phases.</div>
              <div className="mt-3 flex items-center gap-1.5 text-xs font-bold" style={{ color: GOLD }}>
                Open Readiness Hub <ChevronRight className="h-3 w-3" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Footer — the thesis */}
      <div className="border-t" style={{ borderColor: '#E8E4DC', background: IVORY }}>
        <div className="max-w-5xl mx-auto px-8 py-10 flex items-start gap-12">
          <div className="flex-1">
            <div className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: GOLD }}>The Thesis</div>
            <blockquote style={{ ...CG, fontSize: 22, fontWeight: 600, color: NAVY, lineHeight: 1.4, marginBottom: 12 }}>
              "The trigger doesn't create the response. It releases it."
            </blockquote>
            <p className="text-sm text-gray-600 leading-relaxed max-w-xl">
              Every enterprise that completes the 30-day preparation arc is no longer afraid of strategic triggers. They're fearless — not because the triggers are less serious, but because the response is already staged.
            </p>
          </div>
          <div className="flex-shrink-0 flex gap-3">
            <button
              onClick={() => nav('/situation-matrix-builder')}
              className="px-6 py-3 rounded-sm text-sm font-bold tracking-wide text-white transition-all hover:opacity-90"
              style={{ background: NAVY }}
            >
              Build First Protocol
            </button>
            <button
              onClick={() => nav('/getting-started')}
              className="px-6 py-3 rounded-sm text-sm font-bold tracking-wide border transition-all hover:opacity-90"
              style={{ borderColor: NAVY, color: NAVY }}
            >
              Readiness Hub
            </button>
          </div>
        </div>
      </div>

    </PageLayout>
  );
}
