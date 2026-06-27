import { useEffect, useState } from "react";
import { Link } from "wouter";
import PageLayout from "@/components/layout/PageLayout";
import { updatePageMetadata } from "@/lib/seo";
import { CheckCircle2, ArrowRight, Calendar, Users, Activity, Award } from "lucide-react";

const NAVY   = "#0A0F2E";
const GOLD   = "#C9A84C";
const TEAL   = "#2B8A6E";
const BORDER = "#E2DDD5";
const MUTED  = "#6B7280";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
const BC: React.CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };

const PHASES = [
  {
    id: "week1",
    timing: "Week 1",
    timingDetail: "Days 1–7",
    title: "Foundation Setup",
    subtitle: "Scenario selection · Authority mapping · Signal configuration",
    color: GOLD,
    milestone: "Day 7 Milestone",
    milestoneItems: [
      "5 priority protocols selected from 180 library",
      "Executive authorization chain documented",
      "Trigger conditions configured for your top scenarios",
      "Signal monitoring categories activated",
    ],
    activities: [
      { who: "VaughnMartin", what: "Dedicated onboarding session with your executive team — 3 hours total" },
      { who: "VaughnMartin", what: "Protocol selection workshop: map your top 5 likely situations" },
      { who: "Your Team", what: "Authority mapping: define who authorizes, who executes, who observes for each protocol" },
      { who: "Platform", what: "Signal monitoring goes live across your selected intelligence categories" },
    ],
  },
  {
    id: "week2to4",
    timing: "Weeks 2 – 4",
    timingDetail: "Days 8–30",
    title: "Protocol Staging & First Drill",
    subtitle: "Pre-stage tasks · Budget envelopes · Communication templates · Simulation",
    color: TEAL,
    milestone: "Day 30 Checkpoint",
    milestoneItems: [
      "5 protocols fully staged (tasks, budgets, comms pre-drafted)",
      "First simulation drill completed with your team",
      "Stakeholder notification paths validated",
      "First Readiness Score generated — baseline established",
    ],
    activities: [
      { who: "VaughnMartin", what: "Protocol staging support: help pre-draft tasks, budget envelopes, and board notification templates" },
      { who: "Your Team", what: "Review and approve staged protocol content — estimated 4 hours of exec time" },
      { who: "VaughnMartin + Team", what: "Run first simulation drill: trigger a protocol live, validate the 12-minute execution flow" },
      { who: "Platform", what: "Readiness Score calculated — your baseline for the 90-day ROI comparison" },
    ],
  },
  {
    id: "day31to60",
    timing: "Days 31 – 60",
    timingDetail: "Shadow Mode",
    title: "Live Signal Monitoring + Shadow Activations",
    subtitle: "Real signals · Shadow mode · Pattern detection · Protocol refinement",
    color: "#6366F1",
    milestone: "Day 60 Checkpoint",
    milestoneItems: [
      "Shadow activations documented (protocols that would have fired)",
      "Signal detection patterns refined based on real data",
      "Protocol library expanded to 10+ staged protocols",
      "Draft ROI business case prepared with real activation data",
    ],
    activities: [
      { who: "Platform", what: "Live signal monitoring runs continuously — 248+ data points across your configured categories" },
      { who: "Platform", what: "Shadow mode: when a detection threshold is crossed, the system logs the activation without executing — you see exactly what would have fired" },
      { who: "VaughnMartin", what: "Mid-point review call — walk through shadow activations, refine detection thresholds and protocols" },
      { who: "Your Team", what: "Optional: expand to 10 staged protocols based on patterns observed in first 30 days" },
    ],
  },
  {
    id: "day61to90",
    timing: "Days 61 – 90",
    timingDetail: "Live Authorization",
    title: "Live Authorization + Business Case Closeout",
    subtitle: "First live activation · Full ROI documentation · Renewal decision with real data",
    color: NAVY,
    milestone: "Day 90 Closeout",
    milestoneItems: [
      "Board-ready activation report produced",
      "Full ROI / business case with actual shadow activation data",
      "Renewal or expansion decision — made with complete information",
      "Year 1 contract credit applied if continuing",
    ],
    activities: [
      { who: "Your Team", what: "Authorize first live protocol activation if a real trigger fires — or run a sanctioned live drill" },
      { who: "VaughnMartin", what: "Produce full ROI business case: shadow activations × delay cost = documented value" },
      { who: "VaughnMartin + Team", what: "90-day closeout session: review outcomes against Day 7, 30, and 60 milestones" },
      { who: "Both", what: "Renewal / expansion decision — based on actual data, not promises" },
    ],
  },
];

const SUCCESS_CRITERIA = [
  {
    checkpoint: "Day 7",
    color: GOLD,
    criteria: [
      "5 situations identified and mapped",
      "Authorization chain documented for each",
      "Signal monitoring live — first detections visible",
    ],
  },
  {
    checkpoint: "Day 30",
    color: TEAL,
    criteria: [
      "5 protocols fully staged — ready to activate",
      "First simulation drill completed",
      "Readiness Score baseline established",
    ],
  },
  {
    checkpoint: "Day 60",
    color: "#6366F1",
    criteria: [
      "At least 1 shadow activation documented",
      "ROI draft prepared with real signal data",
      "Protocol library at 10+ staged protocols",
    ],
  },
  {
    checkpoint: "Day 90",
    color: NAVY,
    criteria: [
      "Board-ready activation report delivered",
      "Full ROI business case with documented value",
      "Renewal decision made with complete information",
    ],
  },
];

export default function FirstNinetyDays() {
  const [activePhase, setActivePhase] = useState("week1");

  useEffect(() => {
    updatePageMetadata({
      title: "First 90 Days — VaughnMartin Readiness OS",
      description: "A concrete implementation path from Day 1 to Day 90. Know exactly what happens, when, and what success looks like at every checkpoint.",
    });
  }, []);

  const phase = PHASES.find(p => p.id === activePhase)!;

  return (
    <PageLayout>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '60px 32px 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: 56, textAlign: 'center' }}>
          <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: GOLD, marginBottom: 16 }}>Implementation Certainty</div>
          <h1 style={{ ...CG, fontSize: 52, fontWeight: 700, color: NAVY, lineHeight: 1.1, marginBottom: 20 }}>
            Your First 90 Days —<br />Every Step Defined
          </h1>
          <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.7, maxWidth: 620, margin: '0 auto 24px' }}>
            Uncertainty kills deals more than price. Here is exactly what happens from Day 1 to Day 90 — what we do, what your team does, and what success looks like at every checkpoint.
          </p>
        </div>

        {/* Phase selector */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 40, border: `1px solid ${BORDER}`, borderRadius: '0.15rem', overflow: 'hidden' }}>
          {PHASES.map((p, i) => (
            <button key={p.id} onClick={() => setActivePhase(p.id)} style={{
              flex: 1, padding: '14px 8px', border: 'none', cursor: 'pointer',
              borderRight: i < PHASES.length - 1 ? `1px solid ${BORDER}` : 'none',
              background: activePhase === p.id ? NAVY : '#fff',
              transition: 'all 0.15s',
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: activePhase === p.id ? p.color : MUTED, marginBottom: 3 }}>{p.timing}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: activePhase === p.id ? '#fff' : NAVY, lineHeight: 1.3 }}>{p.title}</div>
            </button>
          ))}
        </div>

        {/* Phase detail */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 28, alignItems: 'start', marginBottom: 48 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: phase.color }} />
              <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: phase.color }}>{phase.timingDetail}</div>
            </div>
            <h2 style={{ ...CG, fontSize: 32, fontWeight: 700, color: NAVY, marginBottom: 6 }}>{phase.title}</h2>
            <div style={{ fontSize: 13, color: MUTED, marginBottom: 28, lineHeight: 1.5 }}>{phase.subtitle}</div>

            <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: MUTED, marginBottom: 14 }}>Activity Breakdown</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {phase.activities.map((a, i) => (
                <div key={i} style={{ padding: '14px 16px', border: `1px solid ${BORDER}`, borderRadius: '0.15rem', background: '#FAFAF8' }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <div style={{
                      flexShrink: 0, padding: '2px 8px', borderRadius: '0.15rem',
                      background: a.who === 'Platform' ? 'rgba(43,138,110,0.1)' : a.who === 'VaughnMartin' ? 'rgba(201,168,76,0.1)' : 'rgba(10,15,46,0.07)',
                      color: a.who === 'Platform' ? TEAL : a.who === 'VaughnMartin' ? '#92700A' : NAVY,
                      fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                    }}>{a.who}</div>
                  </div>
                  <div style={{ fontSize: 13, color: NAVY, marginTop: 8, lineHeight: 1.5 }}>{a.what}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Milestone card */}
          <div style={{ background: `linear-gradient(160deg, ${NAVY} 0%, #132558 100%)`, borderRadius: '0.15rem', padding: '24px', position: 'sticky', top: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Award size={16} color={phase.color} />
              <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: phase.color }}>{phase.milestone}</div>
            </div>
            <div style={{ ...CG, fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 16, lineHeight: 1.3 }}>
              What success looks like at the end of this phase
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {phase.milestoneItems.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <CheckCircle2 size={14} color={TEAL} style={{ marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.82)', lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: 11, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
              If this milestone is not met, VaughnMartin extends the phase at no additional cost until the criteria are satisfied.
            </div>
          </div>
        </div>

        {/* Success Criteria summary */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
            <div style={{ flex: 1, height: 1, background: BORDER }} />
            <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTED }}>All Checkpoint Success Criteria</div>
            <div style={{ flex: 1, height: 1, background: BORDER }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {SUCCESS_CRITERIA.map(c => (
              <div key={c.checkpoint} style={{ padding: '20px', border: `1px solid ${BORDER}`, borderRadius: '0.15rem', background: '#FAFAF8' }}>
                <div style={{ ...CG, fontSize: 22, fontWeight: 700, color: c.color, marginBottom: 12 }}>{c.checkpoint}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {c.criteria.map((cr, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: c.color, marginTop: 6, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: NAVY, lineHeight: 1.5 }}>{cr}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What you need to commit */}
        <div style={{ padding: '28px 32px', border: `1px solid ${BORDER}`, borderRadius: '0.15rem', background: '#FAFAF8', marginBottom: 48 }}>
          <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: NAVY, marginBottom: 16 }}>What your organization commits to</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              { label: 'Executive time', value: '~8 hours', detail: 'Across 90 days — 3 onboarding, 2 checkpoint reviews, drill participation' },
              { label: 'Named executive sponsor', value: '1 person', detail: 'Owns the Founding Partner engagement internally — approves protocol authority mapping' },
              { label: 'Scenario input', value: 'Week 1 only', detail: 'Your top 5 likely triggers — we handle the rest of the protocol configuration' },
            ].map(item => (
              <div key={item.label}>
                <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: GOLD, marginBottom: 6 }}>{item.value}</div>
                <div style={{ ...BC, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: NAVY, marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.5 }}>{item.detail}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #132558 100%)`, borderRadius: '0.15rem', padding: '36px', textAlign: 'center' }}>
          <div style={{ ...CG, fontSize: 32, fontWeight: 700, color: '#fff', marginBottom: 12 }}>
            Certainty is the product.
          </div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 28, maxWidth: 500, margin: '0 auto 28px', lineHeight: 1.6 }}>
            Every milestone is defined. Every checkpoint has a success standard. You make the renewal decision at Day 90 with complete data — not a pitch.
          </div>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/founding-partner">
              <button style={{ padding: '14px 28px', background: GOLD, border: 'none', borderRadius: '0.15rem', color: NAVY, fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                Apply for Founding Partner Access <ArrowRight size={16} />
              </button>
            </Link>
            <Link href="/board-memo">
              <button style={{ padding: '14px 28px', background: 'none', border: `1.5px solid rgba(255,255,255,0.3)`, borderRadius: '0.15rem', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                Generate Board Memo
              </button>
            </Link>
          </div>
        </div>

      </div>
    </PageLayout>
  );
}
