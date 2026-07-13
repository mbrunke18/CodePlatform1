import { useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Link } from "wouter";
import { updatePageMetadata } from "@/lib/seo";

const NAVY    = "#0A0F2E";
const NAVY_BG = "#132558";
const GOLD    = "#C9A84C";
const TEAL    = "#2B8A6E";
const IVORY   = "#F0EDE4";
const BORDER  = "#E8E4DC";
const MUTED   = "#6B7280";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
const BC: React.CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };

const LAWS = [
  {
    number: "I",
    title: "Every Strategic Situation Begins With Intake",
    body: "Every important initiative begins with preparation. Projects have intake. Customers have onboarding. Acquisitions have due diligence. Yet the most consequential events an organization faces — a cyberattack, executive departure, regulatory inquiry, activist investor, market disruption — typically begin with no preparation at all. Instead, organizations start by organizing themselves. Strategic situations deserve the same discipline we've long applied to projects.",
    implication: "180 strategic situations have the intake work already done. Work identified. Roles assigned. Budget authorized. Dependencies mapped. Risks documented. Stakeholders sequenced. Before any trigger fires.",
    color: GOLD,
  },
  {
    number: "II",
    title: "The Cost Is the Mobilization Tax",
    body: "Organizations pay twice for every strategic situation. First, they pay to organize themselves. Then they pay to execute. The first cost is largely invisible — but it drains leadership attention, slows decisions, increases risk, and often allows competitors to move first. Leadership time. Outside counsel. Revenue at risk during the mobilization window. Operational disruption. External advisors engaged cold at emergency rates. That's the Mobilization Tax. It averages $1.7M per situation. Across 15 to 20 situations annually: $25.5M to $34M in organizational drag with no line item on any budget.",
    implication: "It is invisible because nobody owns it. Nobody has ever named it. Nobody has ever built a platform to close it. Until now.",
    color: TEAL,
  },
  {
    number: "III",
    title: "Competitive Advantage Lives in the Mobilization Window",
    body: "Every strategic situation creates a window of opportunity. Sometimes it's measured in hours. Sometimes in days. The organizations that capture those windows are rarely the smartest. They're the most prepared. Preparation determines who moves first. The organizations still assembling the room on Day 4 surrender the window — to a competitor who was already ready when they were not.",
    implication: "The only question is whether the response existed before the window opened. Readiness OS answers that question before the situation arrives.",
    color: GOLD,
  },
  {
    number: "IV",
    title: "Readiness Is an Enterprise Capability",
    body: "Readiness isn't a meeting. It isn't a project. It isn't a playbook. It's an operating capability that can be designed, measured, improved, and institutionalized. Organizations have spent decades investing in execution. The next generation of enterprise performance will come from investing in readiness. For twenty years we've optimized execution. We forgot to optimize what happens before execution.",
    implication: "Readiness OS operationalizes Enterprise Readiness. Every activation makes the next response faster, sharper, and more decisive. The institutional memory compounds. The moat grows with every event.",
    color: TEAL,
  },
];

export default function ReadinessManifesto() {
  useEffect(() => {
    updatePageMetadata({
      title: "The Readiness Manifesto — Four Laws of Readiness | VaughnMartin Readiness OS",
      description: "The Four Laws of Readiness: the philosophical and operational foundation behind VaughnMartin Readiness OS. Why preparation replaces mobilization, and why fearlessness is the outcome.",
      ogTitle: "The Readiness Manifesto — VaughnMartin",
      ogDescription: "The response must exist before the trigger fires. Four laws that define what it means to be a ready organization.",
    });
  }, []);

  return (
    <PageLayout>

      {/* ── BACK NAV ── */}
      <div style={{ background: NAVY, borderBottom: '1px solid rgba(201,168,76,0.15)', padding: '10px 48px' }}>
        <button onClick={() => window.history.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 6, ...BC, fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', padding: 0 }}>
          ← Back
        </button>
      </div>

      {/* ── HERO ── */}
      <section style={{ background: NAVY, padding: '72px 0 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(201,168,76,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.05) 1px, transparent 1px)`, backgroundSize: '48px 48px', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 48px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 40, height: 1, background: GOLD }} />
            <span style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: '0.32em', textTransform: 'uppercase' as const, color: GOLD }}>VaughnMartin · Readiness OS</span>
            <div style={{ width: 40, height: 1, background: GOLD }} />
          </div>
          <h1 style={{ ...CG, color: '#fff', fontSize: 'clamp(40px,6vw,68px)', fontWeight: 600, lineHeight: 1.05, marginBottom: 24 }}>
            The Readiness<br /><em style={{ color: GOLD }}>Manifesto</em>
          </h1>
          <p style={{ ...BC, color: 'rgba(240,237,228,0.65)', fontSize: 15, lineHeight: 1.7, maxWidth: 640, margin: '0 auto 32px' }}>
            Enterprise work was designed for a world without AI — where committees, alignment cycles, and coordination delays existed because humans could not process information fast enough to act decisively. AI changed the constraint. Most organizations bolted AI onto the old model. VaughnMartin rebuilds from first principles.
          </p>
          <div style={{ ...CG, color: IVORY, fontSize: 'clamp(18px,2.2vw,26px)', fontStyle: 'italic', fontWeight: 500, lineHeight: 1.5, maxWidth: 700, margin: '0 auto 36px' }}>
            "When the Situation Arrives — The Response Is Ready Before the Trigger Fires."
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 1, background: 'rgba(201,168,76,0.4)' }} />
            <span style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: 'rgba(201,168,76,0.55)' }}>Four Laws</span>
            <div style={{ width: 28, height: 1, background: 'rgba(201,168,76,0.4)' }} />
          </div>
        </div>
      </section>

      {/* ── PREFACE ── */}
      <section style={{ background: IVORY, borderBottom: `1px solid ${BORDER}`, padding: '44px 48px' }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <p style={{ ...BC, color: NAVY, fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' as const, marginBottom: 14 }}>Core Belief</p>
          <p style={{ ...CG, color: NAVY, fontSize: 24, fontWeight: 600, lineHeight: 1.45, marginBottom: 20 }}>
            Organizations don't fail because they lack intelligence.<br />They fail because they haven't engineered readiness.
          </p>
          <p style={{ ...CG, color: NAVY, fontSize: 18, fontStyle: 'italic', fontWeight: 500, lineHeight: 1.5, marginBottom: 16, borderLeft: `2px solid ${GOLD}`, paddingLeft: 20 }}>
            "Organizations are not organizing work. They are organizing themselves."
          </p>
          <p style={{ color: '#374151', fontSize: 15, lineHeight: 1.75, marginBottom: 12 }}>
            A cyberattack happens. An activist files. An executive departs. A competitor exits your market. And before a single execution decision is made, the organization spends days on the same questions: Who owns it? Who decides? Who needs approval? Who informs Legal? Who informs the Board? Who owns communications? That is not execution — it is the overhead before execution. It is the mobilization cycle every organization runs from scratch, every time.
          </p>
          <p style={{ color: '#374151', fontSize: 15, lineHeight: 1.75 }}>
            <strong>For decades we've optimized execution. The next competitive advantage belongs to organizations that optimize readiness.</strong>
          </p>
        </div>
      </section>

      {/* ── AUTHOR ATTRIBUTION ── */}
      <section style={{ background: '#fff', borderBottom: `1px solid ${BORDER}`, padding: '36px 48px' }}>
        <div style={{ maxWidth: 820, margin: '0 auto', display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' as const }}>
          <div style={{ flexShrink: 0, width: 3, alignSelf: 'stretch', background: GOLD, borderRadius: 2 }} />
          <div style={{ flex: 1, minWidth: 280 }}>
            <p style={{ ...BC, color: GOLD, fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' as const, marginBottom: 10 }}>About the Author</p>
            <p style={{ color: '#374151', fontSize: 15, lineHeight: 1.8, marginBottom: 10 }}>
              <strong style={{ color: NAVY }}>Martin Brunke</strong> spent five years coaching major college football at Stanford — watching championship programs deploy a pre-staged, fully-coordinated response to any situation on the field in under 40 seconds. Every game required preparation for a different opponent. Every situation had already been built, practiced, and owned before Saturday. The speed came from the preparation, not from the people.
            </p>
            <p style={{ color: '#374151', fontSize: 15, lineHeight: 1.8, marginBottom: 10 }}>
              He spent the next twenty years inside Fortune 500 organizations running transformation programs — and watched the same caliber of people handle the same category of high-stakes situations from scratch, every time. No pre-staged response. No owned architecture. Thirty days of mobilization before execution could begin.
            </p>
            <p style={{ color: '#374151', fontSize: 15, lineHeight: 1.8 }}>
              Readiness OS is the infrastructure he built to close that gap. <span style={{ color: NAVY, fontWeight: 600 }}>180 Readiness Protocols. 231 detection thresholds. Full organizational deployment in 12 minutes — with the response already staged before the trigger fires.</span>
            </p>
          </div>
        </div>
      </section>

      {/* ── FOUR LAWS ── */}
      <section style={{ background: '#fff', padding: '80px 0' }}>
        <div style={{ maxWidth: 920, margin: '0 auto', padding: '0 48px' }}>
          {LAWS.map((law, idx) => (
            <div key={law.number} style={{ marginBottom: idx < LAWS.length - 1 ? 72 : 0 }}>
              {/* Law header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 28, marginBottom: 24 }}>
                <div style={{ flexShrink: 0, width: 56, height: 56, background: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'center', borderTop: `3px solid ${law.color}` }}>
                  <span style={{ ...CG, color: law.color, fontSize: 22, fontWeight: 700 }}>{law.number}</span>
                </div>
                <div style={{ paddingTop: 4 }}>
                  <div style={{ ...BC, color: law.color, fontSize: 10, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase' as const, marginBottom: 8 }}>
                    Law {law.number === 'I' ? 'One' : law.number === 'II' ? 'Two' : law.number === 'III' ? 'Three' : 'Four'} of Readiness
                  </div>
                  <h2 style={{ ...CG, color: NAVY, fontSize: 'clamp(22px,3vw,32px)', fontWeight: 700, lineHeight: 1.2, margin: 0 }}>
                    {law.title}
                  </h2>
                </div>
              </div>
              {/* Body */}
              <div style={{ paddingLeft: 84 }}>
                <p style={{ color: '#374151', fontSize: 16, lineHeight: 1.8, marginBottom: 20 }}>
                  {law.body}
                </p>
                {/* Implication strip */}
                <div style={{ background: NAVY, padding: '18px 24px', borderLeft: `3px solid ${law.color}` }}>
                  <div style={{ ...BC, color: law.color, fontSize: 9, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase' as const, marginBottom: 8 }}>In Readiness OS</div>
                  <p style={{ ...CG, color: '#E8E4DC', fontSize: 16, fontWeight: 500, lineHeight: 1.55, margin: 0 }}>
                    {law.implication}
                  </p>
                </div>
              </div>
              {idx < LAWS.length - 1 && (
                <div style={{ marginTop: 64, height: 1, background: BORDER }} />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── THE LANGUAGE WE OWN ── */}
      <section style={{ background: IVORY, borderBottom: `1px solid ${BORDER}`, padding: '64px 48px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <p style={{ ...BC, color: NAVY, fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' as const, marginBottom: 8 }}>The Language We Own</p>
          <p style={{ ...CG, color: NAVY, fontSize: 20, fontWeight: 600, lineHeight: 1.4, marginBottom: 8 }}>
            Every category has vocabulary. These are ours.
          </p>
          <p style={{ color: MUTED, fontSize: 14, lineHeight: 1.7, maxWidth: 620, marginBottom: 36 }}>
            When executives begin using this vocabulary in boardrooms, PMOs, transformation offices, and strategy sessions — the category exists. When they ask "Have we completed situation intake?" the language has taken hold.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1px', background: BORDER }}>
            {[
              { term: 'Enterprise Readiness', def: 'The organizational capability to recognize a strategic situation, align the right people, and execute without first organizing yourself.' },
              { term: 'Situation Intake', def: 'The preparation completed before a strategic situation occurs — ownership, authority, dependencies, budget, risks, communications, governance.' },
              { term: 'Mobilization Tax', def: 'The hidden cost of organizing under pressure. $1.7M per situation on average. It has no line item on any budget and appears on no balance sheet.' },
              { term: 'Mobilization Window', def: 'The period in which speed creates competitive advantage. Sometimes measured in hours. Sometimes days. Preparation determines who moves first.' },
              { term: 'Preparation Architecture', def: 'The organizational design that makes rapid mobilization possible — owned, maintained, and improved with every activation before any trigger fires.' },
              { term: 'Strategic Situation', def: 'An event requiring coordinated executive action. Not a project. Not a meeting. The most consequential moments an organization faces — and the least prepared for.' },
            ].map(item => (
              <div key={item.term} style={{ background: '#fff', padding: '24px 28px' }}>
                <div style={{ ...BC, color: GOLD, fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' as const, marginBottom: 8 }}>{item.term}</div>
                <p style={{ color: '#374151', fontSize: 14, lineHeight: 1.7, margin: 0 }}>{item.def}</p>
              </div>
            ))}
          </div>
          <p style={{ ...CG, color: NAVY, fontSize: 16, fontStyle: 'italic', fontWeight: 500, lineHeight: 1.6, marginTop: 28, maxWidth: 680 }}>
            "If organizations begin asking — 'What's our readiness capability?' 'Have we completed situation intake?' 'What's the Mobilization Tax on this event?' 'How long is our mobilization window?' — then you've changed how leaders think. And that's how enduring business ideas are created."
          </p>
        </div>
      </section>

      {/* ── SEE IT IN PRACTICE ── */}
      <section style={{ background: IVORY, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, padding: '64px 48px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <p style={{ ...BC, color: NAVY, fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' as const, marginBottom: 8 }}>See It In Practice</p>
          <p style={{ ...CG, color: NAVY, fontSize: 20, fontWeight: 600, lineHeight: 1.4, marginBottom: 8 }}>
            Readiness OS operationalizes every law in this manifesto.
          </p>
          <p style={{ color: MUTED, fontSize: 14, lineHeight: 1.7, maxWidth: 600, marginBottom: 36 }}>
            180 Readiness Protocols. 231 detection thresholds. Full organizational deployment in 12 minutes — with executive authorization at every step and the response already staged before the trigger fires.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {[
              { label: 'Watch It Execute', desc: 'See a live ransomware, activist investor, or supply chain situation mobilize in 12 minutes from trigger to full deployment.', href: '/how-it-executes', cta: 'See the execution chain' },
              { label: 'Read the Proof', desc: 'Three activation narratives — side-by-side timelines of organizations with and without Readiness OS. Financial outcomes included.', href: '/proof-story', cta: 'Read proof stories' },
              { label: 'Calculate Your ROI', desc: 'The Mobilization Tax your organization pays today — $1.7M per situation — mapped against the cost of eliminating it permanently.', href: '/roi-calculator', cta: 'Run the calculation' },
              { label: 'Diagnose the Gap', desc: 'The 12 Mobilization Gaps — the specific points where every enterprise response slows, stalls, or fails under pressure.', href: '/the-gap', cta: 'See the 12 gaps' },
            ].map(item => (
              <Link key={item.href} href={item.href} style={{ textDecoration: 'none', display: 'block', background: '#fff', border: `1px solid ${BORDER}`, padding: '24px 24px 20px', transition: 'border-color 0.15s' }}>
                <div style={{ ...BC, color: GOLD, fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' as const, marginBottom: 8 }}>{item.label}</div>
                <p style={{ color: '#374151', fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>{item.desc}</p>
                <div style={{ ...BC, color: NAVY, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>{item.cta} →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE READINESS SEQUENCE ── */}
      <section style={{ background: '#0F1629', padding: '64px 0', borderTop: '1px solid rgba(201,168,76,0.15)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 48px', textAlign: 'center' }}>
          <div style={{ ...BC, color: GOLD, fontSize: 10, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase' as const, marginBottom: 16 }}>The Readiness Sequence</div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0, flexWrap: 'wrap' as const, marginBottom: 40 }}>
            {['Preparation', 'Readiness', 'Fearless'].map((word, i) => (
              <div key={word} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ textAlign: 'center', padding: '20px 32px' }}>
                  <div style={{ ...CG, color: i === 2 ? GOLD : '#fff', fontSize: i === 2 ? 32 : 26, fontWeight: 700, lineHeight: 1 }}>{word}</div>
                  <div style={{ ...BC, color: 'rgba(255,255,255,0.35)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginTop: 6 }}>
                    {i === 0 ? 'Before the trigger' : i === 1 ? 'At the moment' : 'The outcome'}
                  </div>
                </div>
                {i < 2 && <div style={{ color: 'rgba(201,168,76,0.4)', fontSize: 20, padding: '0 8px' }}>→</div>}
              </div>
            ))}
          </div>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, lineHeight: 1.7, maxWidth: 580, margin: '0 auto 36px' }}>
            Any organization can be ready and prepared to respond to any situation they would expect to encounter — or have encountered. The emotional endpoint is fearlessness, not speed. Speed is the evidence. Readiness is the promise.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' as const }}>
            <Link href="/request-access" style={{ ...BC, fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, textDecoration: 'none', background: GOLD, color: NAVY, padding: '13px 28px', display: 'inline-block' }}>
              Apply for Founding Partner Access →
            </Link>
            <Link href="/founding-partner" style={{ ...BC, fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, textDecoration: 'none', border: '1px solid rgba(201,168,76,0.4)', color: GOLD, padding: '13px 28px', display: 'inline-block' }}>
              Founding Partner Program →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER STRIP ── */}
      <section style={{ background: NAVY, borderTop: '1px solid rgba(255,255,255,0.06)', padding: '28px 48px' }}>
        <div style={{ maxWidth: 920, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: 16 }}>
          <div style={{ ...BC, color: 'rgba(255,255,255,0.3)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase' as const }}>
            VaughnMartin · Readiness OS · Readiness Infrastructure
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            {[
              { label: 'Protocol Library', href: '/playbook-library' },
              { label: 'Proof Story', href: '/proof-story' },
              { label: 'ROI Calculator', href: '/roi-calculator' },
              { label: 'The Gap', href: '/the-gap' },
            ].map(l => (
              <Link key={l.href} href={l.href} style={{ ...BC, fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', textTransform: 'uppercase' as const, transition: 'color 0.15s' }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

    </PageLayout>
  );
}
