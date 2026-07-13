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
    title: "The response must exist before the trigger fires.",
    body: "Every organization assumes it will mobilize when the situation arrives. That assumption is the gap. Mobilization is not a response — it is a pre-condition for response. An organization that begins organizing when the trigger fires has already lost the window. The only effective response is one that existed before it was needed.",
    implication: "All 180 Readiness Protocols are built and owned before any trigger fires. The trigger does not begin the work. It activates what is already prepared.",
    color: GOLD,
  },
  {
    number: "II",
    title: "Preparation is an organizational function, not a crisis response.",
    body: "Enterprises invest billions in execution capability — talent, technology, process. They invest nothing in the mobilization architecture that determines whether that capability ever reaches a strategic moment. Readiness is not a crisis plan filed in a drawer. It is an ongoing function of the organization — owned, maintained, and improved with every activation. The organizations that treat preparation as infrastructure outperform those that treat it as contingency.",
    implication: "The Preparation Architect role is not a crisis coordinator. It is the function that makes 12-minute execution structurally possible — through configuration, governance, and continuous improvement before the situation arrives.",
    color: TEAL,
  },
  {
    number: "III",
    title: "Every gap in your mobilization architecture has a cost — whether you measure it or not.",
    body: "The Mobilization Tax is not a concept. It is a line item that does not appear on any budget because it is never measured. The average enterprise spends $1.7M per strategic situation on coordination overhead, alignment delays, and improvised mobilization — before a single execution decision is made. Across 15–20 situations per year, the annual tax runs $25.5M–$34M. Most enterprises have never calculated this number. The absence of measurement does not mean the absence of cost.",
    implication: "The 12 Mobilization Gaps are not coordination failures. They are structural absences in the organizational architecture — each one with a measurable cost that Readiness OS eliminates before the next trigger fires.",
    color: GOLD,
  },
  {
    number: "IV",
    title: "Speed is not the outcome. Fearlessness is.",
    body: "The 12-minute mobilization is not a speed metric. It is an organizational posture. An organization that can respond to any of 180 strategic situations in 12 minutes is not faster than its competitors — it is different in kind. Speed is the evidence. Readiness is the promise. Fearlessness is the outcome. The fearless organization does not avoid strategic situations. It meets them from a position of preparation — knowing the response was built before the trigger arrived, that authority is clear, teams are staged, and the first 12 minutes are already mapped.",
    implication: "Every activation on the Readiness OS platform is a proof point — not that the organization responded faster, but that it was ready before it needed to be.",
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
          <p style={{ ...BC, color: NAVY, fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' as const, marginBottom: 14 }}>The Structural Flaw</p>
          <p style={{ ...CG, color: NAVY, fontSize: 22, fontWeight: 600, lineHeight: 1.5, marginBottom: 16 }}>
            Organizations are not organizing work. They are organizing themselves.
          </p>
          <p style={{ color: '#374151', fontSize: 15, lineHeight: 1.75, marginBottom: 12 }}>
            Every time a strategic situation fires, the organization mobilizes: deciding who needs to be in the room, agreeing a plan, aligning stakeholders, authorizing budgets, assembling teams. This is not execution — it is the overhead before execution. It is the 30-day cycle that happens before a single meaningful decision is made.
          </p>
          <p style={{ color: '#374151', fontSize: 15, lineHeight: 1.75 }}>
            Most enterprise software addresses the work that happens after the organization has assembled. Readiness OS addresses the mobilization itself — the structural organizational function that determines whether capability ever reaches a strategic moment. This is a different category. It is not faster software for the same model. It is a new model.
          </p>
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
            <Link href="/the-gap" style={{ ...BC, fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, textDecoration: 'none', border: '1px solid rgba(201,168,76,0.4)', color: GOLD, padding: '13px 28px', display: 'inline-block' }}>
              The 12 Mobilization Gaps →
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
