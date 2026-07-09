import { useEffect } from "react";
import { Link } from "wouter";
import PageLayout from "@/components/layout/PageLayout";
import { updatePageMetadata } from "@/lib/seo";
import { CheckCircle2, ArrowRight, Shield, Award, Clock, Users, RotateCcw } from "lucide-react";

const NAVY   = "#0A0F2E";
const GOLD   = "#C9A84C";
const TEAL   = "#2B8A6E";
const BORDER = "#E2DDD5";
const MUTED  = "#6B7280";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
const BC: React.CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };

const INCLUDED = [
  {
    category: "Platform Access",
    items: [
      "Full Readiness OS platform — all modules, no feature gates",
      "Up to 25 named users across your executive and operations teams",
      "Custom organization configuration with your branding and structure",
      "Real-time signal monitoring across 3 selected intelligence categories",
    ],
  },
  {
    category: "Protocol Library",
    items: [
      "5 fully staged Readiness Protocols — built to your scenarios",
      "Access to all 180 core protocols as reference and templates",
      "Protocol Builder for custom protocol creation",
      "Governance & versioning controls with full audit trail",
    ],
  },
  {
    category: "Implementation Support",
    items: [
      "Dedicated onboarding session (3 hours, executive team)",
      "Protocol staging support — we help pre-draft tasks, budgets, comms",
      "First simulation drill — we run it with your team",
      "Two checkpoint review calls (Day 30 and Day 60)",
    ],
  },
  {
    category: "Integration & Security",
    items: [
      "Microsoft Teams integration for stakeholder notifications",
      "Jira / Asana task sync for protocol task management",
      "SSO / OIDC authentication configuration",
      "Full security & compliance documentation package",
    ],
  },
];

const RISK_REVERSAL = [
  {
    icon: RotateCcw,
    title: "Day 60 Guarantee",
    description: "If the Day 60 success criteria are not met — 5 staged protocols, first simulation drill complete, at least one shadow activation documented — VaughnMartin will extend the engagement at no charge until the criteria are satisfied.",
    color: TEAL,
  },
  {
    icon: Award,
    title: "Full Fee Credit",
    description: "The complete Founding Partner engagement fee is credited against your Year 1 subscription cost. You pay the engagement fee once — it does not add to the platform cost.",
    color: GOLD,
  },
  {
    icon: Shield,
    title: "Partial Refund Option",
    description: "If at Day 90 you determine Readiness OS is not the right fit, and the Day 30 milestone was not achieved, a 50% partial refund is available. We earn the full engagement fee by delivering the value.",
    color: "#6366F1",
  },
];

const STRUCTURE = [
  {
    phase: "Week 1",
    title: "Foundation",
    color: GOLD,
    items: ["Scenario selection workshop", "Authority mapping", "Signal monitoring activated", "Detection thresholds configured"],
    deliverable: "5 situations mapped · Signal monitoring live",
  },
  {
    phase: "Weeks 2–4",
    title: "Protocol Staging",
    color: TEAL,
    items: ["Protocols fully staged (tasks, budgets, comms)", "First simulation drill", "Stakeholder paths validated", "Readiness Score baseline"],
    deliverable: "Day 30 Checkpoint: 5 protocols ready to activate",
  },
  {
    phase: "Days 31–60",
    title: "Shadow Mode",
    color: "#6366F1",
    items: ["Live signal monitoring", "Shadow activations documented", "Protocol library expanded to 10+", "ROI draft prepared"],
    deliverable: "Day 60 Checkpoint: Shadow activations + ROI draft",
  },
  {
    phase: "Days 61–90",
    title: "Live Authorization",
    color: NAVY,
    items: ["First live protocol activation or drill", "Full ROI business case", "90-day closeout session", "Renewal decision with complete data"],
    deliverable: "Day 90 Closeout: Board-ready business case",
  },
];

const FAQS = [
  {
    q: "How many Founding Partners are you accepting?",
    a: "We are accepting a maximum of 2 Founding Partners in the 2026 cohort. This limit is deliberate — each organization receives a dedicated VaughnMartin contact throughout the 90 days, and we cannot maintain that standard at scale. Future cohorts will open as capacity allows.",
  },
  {
    q: "What happens if a real trigger fires during the 90 days?",
    a: "This is the ideal scenario. If a real trigger fires, we activate your staged protocol in a live environment. The 90-day experience becomes a documented, real-world proof of value. Your Day 90 business case writes itself.",
  },
  {
    q: "Do we need technical resources to implement?",
    a: "No. VaughnMartin handles all configuration. Your team provides scenario context and executive participation in the onboarding session and two checkpoint calls. Estimated executive time: 8 hours total over 90 days.",
  },
  {
    q: "What does the Microsoft integration cover?",
    a: "Readiness OS sits above your existing Microsoft investment — Teams for stakeholder notifications, and the architecture is compatible with Copilot Studio and Microsoft Entra. It does not replace your Microsoft stack; it adds the operating model layer that makes it actionable at trigger speed.",
  },
  {
    q: "Is there a minimum contract after 90 days?",
    a: "No. At Day 90 you make a renewal decision based on full data. If you proceed, the engagement fee is credited to your Year 1 subscription. There is no pressure to commit before the business case is complete.",
  },
  {
    q: "Can we start with fewer than 5 protocols?",
    a: "Yes. Some Founding Partners prefer to begin with 2–3 protocols in deep detail rather than 5 in breadth. We calibrate to your pace. The Day 30 milestone is flexible — what matters is that the protocols you do stage are genuinely ready to activate.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  return (
    <div style={{ padding: '20px 0', borderBottom: `1px solid ${BORDER}` }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: NAVY, marginBottom: 10, lineHeight: 1.4 }}>{q}</div>
      <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.7 }}>{a}</div>
    </div>
  );
}

export default function FoundingPartnerPage() {
  useEffect(() => {
    updatePageMetadata({
      title: "Founding Partner Program — VaughnMartin Readiness OS",
      description: "A 90-day structured validation partnership. Know exactly what you get, what success looks like, and what happens if it doesn't work.",
    });
  }, []);

  return (
    <PageLayout>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '60px 32px 80px' }}>

        {/* Hero */}
        <div style={{ marginBottom: 64, textAlign: 'center' }}>
          <div style={{ display: 'inline-block', padding: '6px 16px', background: 'rgba(201,168,76,0.1)', border: `1px solid rgba(201,168,76,0.35)`, borderRadius: '0.15rem', ...BC, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: GOLD, marginBottom: 20 }}>
            Founding Partner Program · 2026 Cohort · 2 Organizations Maximum
          </div>
          <h1 style={{ ...CG, fontSize: 56, fontWeight: 700, color: NAVY, lineHeight: 1.08, marginBottom: 24 }}>
            A partnership,<br />not a purchase.
          </h1>
          <p style={{ fontSize: 17, color: MUTED, lineHeight: 1.75, maxWidth: 640, margin: '0 auto 32px' }}>
            You don't need to bet blindly on a new platform. The Founding Partner Program is a 90-day validation engagement — structured milestones, defined success criteria, a full fee credit, and a partial refund option if we don't deliver.
          </p>
          <Link href="/request-access">
            <button style={{ padding: '16px 36px', background: GOLD, border: 'none', borderRadius: '0.15rem', color: NAVY, fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              Apply for Founding Partner Access <ArrowRight size={18} />
            </button>
          </Link>
          <div style={{ fontSize: 12, color: MUTED, marginTop: 12 }}>2 spots · No commitment required to apply · Response within 48 hours</div>
        </div>

        {/* Investment Comparison */}
        <div style={{ marginBottom: 72 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 36 }}>
            <div style={{ flex: 1, height: 1, background: BORDER }} />
            <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTED }}>The Investment Comparison</div>
            <div style={{ flex: 1, height: 1, background: BORDER }} />
          </div>

          {/* Positioning statement */}
          <div style={{ maxWidth: 680, margin: '0 auto 40px', textAlign: 'center' }}>
            <p style={{ ...CG, fontSize: 22, fontWeight: 600, color: NAVY, lineHeight: 1.55, marginBottom: 16, fontStyle: 'italic' }}>
              Most organizations pay $75K–$300K for a consulting engagement that produces organizational clarity about how to respond to strategic situations.
            </p>
            <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.75 }}>
              The clarity lives in a document. The document does not activate when the next trigger fires.
            </p>
          </div>

          {/* Comparison table */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
            {/* Consulting column */}
            <div style={{ padding: '32px', border: `1px solid ${BORDER}`, borderRadius: '0.15rem', background: '#FAFAF8' }}>
              <div style={{ ...BC, fontSize: 10, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: MUTED, marginBottom: 8 }}>Strategic Consulting Engagement</div>
              <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: NAVY, marginBottom: 24 }}>$75K – $300K</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { label: "Duration", value: "4–12 week engagement" },
                  { label: "Output", value: "Strategic document and recommendations" },
                  { label: "After the engagement ends", value: "The document stays. The consultant leaves." },
                  { label: "Next trigger fires", value: "New engagement. New cost. Same mobilization cycle." },
                  { label: "Institutional memory", value: "Lives with the consultant — not the organization" },
                ].map(row => (
                  <div key={row.label} style={{ paddingBottom: 14, borderBottom: `1px solid ${BORDER}` }}>
                    <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: MUTED, marginBottom: 4 }}>{row.label}</div>
                    <div style={{ fontSize: 13, color: NAVY, lineHeight: 1.5 }}>{row.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Readiness OS column */}
            <div style={{ padding: '32px', border: `1.5px solid ${GOLD}`, borderRadius: '0.15rem', background: 'rgba(201,168,76,0.03)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: -1, left: 0, right: 0, height: 3, background: GOLD, borderRadius: '0.15rem 0.15rem 0 0' }} />
              <div style={{ ...BC, fontSize: 10, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD, marginBottom: 8 }}>Founding Partner Program</div>
              <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: NAVY, marginBottom: 24 }}>$75K</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { label: "Duration", value: "90-day structured onboarding" },
                  { label: "Output", value: "Running infrastructure — 5 staged protocols, live signal monitoring" },
                  { label: "After the engagement ends", value: "The platform stays. The preparation stays. It compounds." },
                  { label: "Next trigger fires", value: "Infrastructure activates. No additional mobilization cost." },
                  { label: "Institutional memory", value: "Encoded in the platform — grows with every activation" },
                ].map(row => (
                  <div key={row.label} style={{ paddingBottom: 14, borderBottom: `1px solid rgba(201,168,76,0.2)` }}>
                    <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: GOLD, marginBottom: 4 }}>{row.label}</div>
                    <div style={{ fontSize: 13, color: NAVY, lineHeight: 1.5, fontWeight: 500 }}>{row.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* The line */}
          <div style={{ textAlign: 'center', padding: '28px 32px', background: NAVY, borderRadius: '0.15rem' }}>
            <p style={{ ...CG, fontSize: 24, fontWeight: 700, color: '#fff', lineHeight: 1.4, margin: 0 }}>
              Same entry investment.&nbsp;&nbsp;<span style={{ color: GOLD }}>Permanently different outcome.</span>
            </p>
          </div>
        </div>

        {/* What you get */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <div style={{ flex: 1, height: 1, background: BORDER }} />
            <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTED }}>What's Included in the 90-Day Engagement</div>
            <div style={{ flex: 1, height: 1, background: BORDER }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
            {INCLUDED.map(cat => (
              <div key={cat.category} style={{ padding: '24px', border: `1px solid ${BORDER}`, borderRadius: '0.15rem', background: '#FAFAF8' }}>
                <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: GOLD, marginBottom: 14 }}>{cat.category}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {cat.items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <CheckCircle2 size={14} color={TEAL} style={{ marginTop: 2, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: NAVY, lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 90-Day Structure */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <div style={{ flex: 1, height: 1, background: BORDER }} />
            <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTED }}>90-Day Structure & Milestones</div>
            <div style={{ flex: 1, height: 1, background: BORDER }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {STRUCTURE.map((s, i) => (
              <div key={s.phase} style={{ position: 'relative' }}>
                <div style={{ padding: '20px', border: `1.5px solid ${s.color === NAVY ? NAVY : BORDER}`, borderTop: `3px solid ${s.color}`, borderRadius: '0.15rem', background: s.color === NAVY ? NAVY : '#FAFAF8', height: '100%' }}>
                  <div style={{ ...BC, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: s.color === NAVY ? GOLD : s.color, marginBottom: 6 }}>{s.phase}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: s.color === NAVY ? '#fff' : NAVY, marginBottom: 14 }}>{s.title}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                    {s.items.map((item, j) => (
                      <div key={j} style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                        <div style={{ width: 4, height: 4, borderRadius: '50%', background: s.color === NAVY ? 'rgba(255,255,255,0.4)' : s.color, marginTop: 7, flexShrink: 0 }} />
                        <span style={{ fontSize: 12, color: s.color === NAVY ? 'rgba(255,255,255,0.75)' : MUTED, lineHeight: 1.5 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ paddingTop: 12, borderTop: `1px solid ${s.color === NAVY ? 'rgba(255,255,255,0.15)' : BORDER}`, fontSize: 11, fontWeight: 600, color: s.color === NAVY ? 'rgba(255,255,255,0.6)' : NAVY, lineHeight: 1.5 }}>
                    ✓ {s.deliverable}
                  </div>
                </div>
                {i < STRUCTURE.length - 1 && (
                  <div style={{ position: 'absolute', right: -10, top: '50%', transform: 'translateY(-50%)', zIndex: 1, color: MUTED, fontSize: 16 }}>›</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Risk Reversal */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <div style={{ flex: 1, height: 1, background: BORDER }} />
            <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTED }}>Risk Reversal — How We Remove the Downside</div>
            <div style={{ flex: 1, height: 1, background: BORDER }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {RISK_REVERSAL.map(r => {
              const Icon = r.icon;
              return (
                <div key={r.title} style={{ padding: '24px', border: `1px solid ${BORDER}`, borderRadius: '0.15rem', background: '#FAFAF8', borderTop: `3px solid ${r.color}` }}>
                  <Icon size={20} color={r.color} style={{ marginBottom: 14 }} />
                  <div style={{ fontSize: 16, fontWeight: 700, color: NAVY, marginBottom: 10 }}>{r.title}</div>
                  <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.7 }}>{r.description}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Who this is for */}
        <div style={{ padding: '32px 40px', background: `linear-gradient(135deg, ${NAVY} 0%, #132558 100%)`, borderRadius: '0.15rem', marginBottom: 64 }}>
          <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: GOLD, marginBottom: 20 }}>Who the Founding Partner Program Is For</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
            {[
              { label: "The right fit", items: ["startup to Fortune 500 or equivalent-scale organization", "Executive sponsor with authorization authority (CISO, CRO, COO, or equivalent)", "Preparation Architect (COO, Chief of Staff, VP Operations, or equivalent) to own the 90-day readiness architecture build", "At least 2 high-priority situations to prepare for (cyber, regulatory, supply chain, M&A)", "Appetite to move from reactive to pre-staged execution model"], color: TEAL },
              { label: "Not the right fit", items: ["Organizations seeking a point tool or dashboard replacement", "Teams without executive sponsorship or authority to map authorization chains", "Organizations requiring customer references before engaging (this cohort is the reference group)", "Companies not currently facing any of the 231 detection threshold categories"], color: "#DC2626" },
            ].map(col => (
              <div key={col.label}>
                <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: col.color, marginBottom: 12 }}>{col.label}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {col.items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: col.color, marginTop: 7, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <div style={{ flex: 1, height: 1, background: BORDER }} />
            <div style={{ ...BC, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTED }}>Common Questions</div>
            <div style={{ flex: 1, height: 1, background: BORDER }} />
          </div>
          <div>
            {FAQS.map((faq, i) => <FAQItem key={i} q={faq.q} a={faq.a} />)}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '48px 32px', border: `1.5px solid ${GOLD}`, borderRadius: '0.15rem', background: 'rgba(201,168,76,0.04)' }}>
          <div style={{ ...CG, fontSize: 38, fontWeight: 700, color: NAVY, lineHeight: 1.2, marginBottom: 16 }}>
            Ready to start the conversation?
          </div>
          <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.7, maxWidth: 520, margin: '0 auto 32px' }}>
            Applications take 5 minutes. We respond within 48 hours with a qualification call scheduled. No commitment required to apply.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/request-access">
              <button style={{ padding: '16px 36px', background: GOLD, border: 'none', borderRadius: '0.15rem', color: NAVY, fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                Apply for Founding Partner Access <ArrowRight size={18} />
              </button>
            </Link>
            <Link href="/board-memo">
              <button style={{ padding: '16px 32px', background: 'none', border: `1.5px solid ${BORDER}`, borderRadius: '0.15rem', color: NAVY, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
                Generate Board Memo First
              </button>
            </Link>
          </div>
          <div style={{ marginTop: 24, display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { label: 'Spots Remaining', value: '12 max · First cohort' },
              { label: 'Response Time', value: 'Within 48 hours' },
              { label: 'Commitment to Apply', value: 'None' },
            ].map(stat => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>{stat.value}</div>
                <div style={{ fontSize: 11, color: MUTED }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </PageLayout>
  );
}
