import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import PageLayout from '@/components/layout/PageLayout';
import { useEffect, useState } from 'react';
import { updatePageMetadata } from '@/lib/seo';
import { VaughnMartinLogo } from "@/components/VaughnMartinLogo";
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

const pilotPhases = [
  {
    phase: 'Phase 0',
    name: 'Readiness & Setup',
    duration: 'Weeks 1-2',
    color: 'bg-[#6B7280]',
    activities: [
      'Executive sponsor alignment session',
      'Integration setup (Jira, Slack/Teams)',
      'Select 3-5 Readiness Protocols from your priority domains',
      'Configure signal monitoring for priority triggers',
      'Baseline current response metrics'
    ],
    deliverables: ['Integration complete', 'Readiness Protocols configured', 'Baseline metrics documented'],
    successMetrics: 'All integrations tested and operational'
  },
  {
    phase: 'Phase 1',
    name: 'Dry Runs & Training',
    duration: 'Weeks 3-6',
    color: 'bg-[#0A0F2E]',
    activities: [
      'Conduct 2-3 tabletop exercises with Readiness OS',
      'Measure activation time (target: <12 min)',
      'Train response team leads on Readiness OS workflow',
      'Refine Readiness Protocols based on dry run feedback',
      'Establish KPI tracking dashboard'
    ],
    deliverables: ['Dry run reports', 'Training completion', 'Refined Readiness Protocols'],
    successMetrics: 'Activation time under 15 minutes in dry runs'
  },
  {
    phase: 'Phase 2',
    name: 'Live Activation',
    duration: 'Weeks 7-10',
    color: 'bg-[#2B8A6E]',
    activities: [
      'Enable live signal monitoring',
      'First live Readiness Protocol activation',
      'Track all coordination metrics',
      'Document lessons learned',
      'Capture stakeholder feedback'
    ],
    deliverables: ['Live activation data', 'ROI evidence', 'User testimonials'],
    successMetrics: 'At least 1 live activation with measured 12-minute response'
  },
  {
    phase: 'Phase 3',
    name: 'Executive Readout',
    duration: 'Weeks 11-12',
    color: 'bg-[#C9A84C]',
    activities: [
      'Compile ROI scorecard',
      'Present results to executive sponsor',
      'Define production rollout plan',
      'Negotiate enterprise agreement',
      'Plan Phase 2 expansion'
    ],
    deliverables: ['Executive presentation', 'ROI scorecard', 'Expansion proposal'],
    successMetrics: 'Clear go/no-go decision with quantified value'
  }
];

const pilotInclusions = [
  {
    category: 'Platform Access',
    items: [
      'Full Readiness OS platform access for Founding Partner team (up to 25 users)',
      '5 customizable Readiness Protocols from 180 library',
      'Signal monitoring for 3 intelligence categories',
      'Command Center with real-time coordination'
    ]
  },
  {
    category: 'Integrations',
    items: [
      'Bi-directional Jira or Asana sync',
      'Slack or Microsoft Teams notifications',
      'Email notification integration',
      'SSO configuration (if needed)'
    ]
  },
  {
    category: 'Support',
    items: [
      'Dedicated Customer Success Manager',
      'Weekly check-in calls',
      'Priority support response (4hr SLA)',
      'Executive sponsor alignment sessions'
    ]
  },
  {
    category: 'Training',
    items: [
      '2-hour platform training session',
      'Readiness Protocol customization workshop',
      'Tabletop exercise facilitation (2-3 sessions)',
      'Documentation and quick-start guides'
    ]
  }
];

const idealCandidates = [
  {
    criteria: 'C-Suite Executive Sponsor',
    description: 'COO, CFO, or CEO with personal accountability for the deployment outcome — not a project owner, not a delegated team.',
    importance: 'Required'
  },
  {
    criteria: 'Named Technical Owner',
    description: 'A designated internal owner who can complete onboarding and protocol configuration within 30 days without requiring daily external support.',
    importance: 'Required'
  },
  {
    criteria: 'Three Real Situations',
    description: 'At least three specific situations your executive sponsor can name right now where Readiness OS would deploy if a trigger fired — recognized as genuinely important, not hypothetical.',
    importance: 'Required'
  },
  {
    criteria: 'Enterprise Tech Stack',
    description: 'An existing deployment of at least one live connector — Microsoft Teams, Slack, Jira, or any of the 55+ supported integrations the platform deploys into.',
    importance: 'Required'
  },
  {
    criteria: 'Trigger Plausibility',
    description: 'A real strategic trigger plausible within the 90-day window. Not guaranteed — plausible. Financial, regulatory, competitive, or operational pressure already building.',
    importance: 'Required'
  },
  {
    criteria: 'Explicit Commitment',
    description: 'Confirmed willingness — stated before access is granted — to participate in a 60-day progress conversation and a 90-day conversion discussion.',
    importance: 'Required'
  }
];

const roiCalculator = [
  {
    metric: 'Hours Saved per Event',
    baseline: '20-50 hours',
    withExecutionOS: '0 hours (pre-planned)',
    calculation: '20-50 × $500/hr executive time',
    value: '$10,000-$25,000'
  },
  {
    metric: 'Response Time',
    baseline: '30 days to full coordination',
    withExecutionOS: '12 minutes to full coordination',
    calculation: 'Revenue protected by faster response',
    value: '$500K-$2M per major event'
  },
  {
    metric: 'C-Suite Time Recovery',
    baseline: '50+ hours per event',
    withExecutionOS: '5 hours oversight only',
    calculation: '45 hours × $1,000/hr',
    value: '$45,000+ per event'
  },
  {
    metric: 'Tool Consolidation',
    baseline: 'Multiple point solutions',
    withExecutionOS: 'Single execution platform',
    calculation: 'Reduced platform licensing',
    value: '$50-100K annually'
  }
];

const conversionTerms = [
  {
    term: '100% Investment Credit',
    description: 'Full engagement investment applies to enterprise contract',
  },
  {
    term: 'Preferred Pricing',
    description: 'Founding partner rates locked for 3 years',
  },
  {
    term: 'Priority Roadmap',
    description: 'Input on feature development priorities',
  },
  {
    term: 'Enterprise SLA',
    description: '99.9% uptime, 2-hour priority support',
  }
];

const appFormSchema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  email: z.string().email('Enter a valid work email'),
  company: z.string().min(1, 'Required'),
  title: z.string().min(1, 'Required'),
  triggerDomain: z.string().optional(),
  message: z.string().optional(),
});
type AppFormData = z.infer<typeof appFormSchema>;

const FP_BC: React.CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };
const FP_CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
const FP_FIELD: React.CSSProperties = {
  background: 'transparent', border: 'none',
  borderBottom: '1px solid rgba(240,237,228,0.2)', borderRadius: 0,
  color: '#F0EDE4', fontSize: 15, fontWeight: 400,
  padding: '10px 0', width: '100%', outline: 'none',
};

function ApplicationForm() {
  const [submitted, setSubmitted] = useState(false);
  const form = useForm<AppFormData>({
    resolver: zodResolver(appFormSchema),
    defaultValues: { firstName: '', lastName: '', email: '', company: '', title: '', triggerDomain: '', message: '' },
  });
  const mutation = useMutation({
    mutationFn: (data: AppFormData) => apiRequest('POST', '/api/founding-partner/apply', data),
    onSuccess: () => setSubmitted(true),
  });
  const onSubmit = (data: AppFormData) => mutation.mutate(data);

  if (submitted) return (
    <div style={{ textAlign: 'center', padding: '48px 0' }}>
      <div style={{ width: 1, height: 48, background: 'linear-gradient(to bottom, transparent, #C9A84C)', margin: '0 auto 28px' }} />
      <p style={{ ...FP_BC, fontSize: 10, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: '#2B8A6E', marginBottom: 12 }}>Application Received</p>
      <h3 style={{ ...FP_CG, fontSize: 32, fontWeight: 700, color: '#fff', marginBottom: 12, lineHeight: 1.2 }}>We'll be in touch within 48 hours.</h3>
      <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(240,237,228,0.65)', lineHeight: 1.7, maxWidth: 400, margin: '0 auto' }}>
        We review every application personally. If your organization is a strong fit for the 2026 cohort, you'll hear from the founder directly.
      </p>
    </div>
  );

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <style>{`.fp-field::placeholder{color:rgba(240,237,228,0.4)}.fp-field:focus{border-bottom-color:rgba(201,168,76,0.6)!important}.fp-field{transition:border-color 0.2s ease}.fp-select option{background:#0A0F2E;color:#F0EDE4}`}</style>
      <div className="fpp-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 32px' }}>
        <div style={{ marginBottom: 28 }}>
          <label style={{ ...FP_BC, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: 'rgba(240,237,228,0.55)', display: 'block', marginBottom: 6 }}>First Name</label>
          <input {...form.register('firstName')} placeholder="Jane" style={FP_FIELD} className="fp-field" />
          {form.formState.errors.firstName && <p style={{ color: '#EF4444', fontSize: 11, marginTop: 4 }}>{form.formState.errors.firstName.message}</p>}
        </div>
        <div style={{ marginBottom: 28 }}>
          <label style={{ ...FP_BC, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: 'rgba(240,237,228,0.55)', display: 'block', marginBottom: 6 }}>Last Name</label>
          <input {...form.register('lastName')} placeholder="Smith" style={FP_FIELD} className="fp-field" />
          {form.formState.errors.lastName && <p style={{ color: '#EF4444', fontSize: 11, marginTop: 4 }}>{form.formState.errors.lastName.message}</p>}
        </div>
      </div>
      <div style={{ marginBottom: 28 }}>
        <label style={{ ...FP_BC, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: 'rgba(240,237,228,0.55)', display: 'block', marginBottom: 6 }}>Work Email</label>
        <input {...form.register('email')} placeholder="jane.smith@company.com" style={FP_FIELD} className="fp-field" />
        {form.formState.errors.email && <p style={{ color: '#EF4444', fontSize: 11, marginTop: 4 }}>{form.formState.errors.email.message}</p>}
      </div>
      <div className="fpp-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 32px' }}>
        <div style={{ marginBottom: 28 }}>
          <label style={{ ...FP_BC, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: 'rgba(240,237,228,0.55)', display: 'block', marginBottom: 6 }}>Company</label>
          <input {...form.register('company')} placeholder="Acme Corporation" style={FP_FIELD} className="fp-field" />
          {form.formState.errors.company && <p style={{ color: '#EF4444', fontSize: 11, marginTop: 4 }}>{form.formState.errors.company.message}</p>}
        </div>
        <div style={{ marginBottom: 28 }}>
          <label style={{ ...FP_BC, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: 'rgba(240,237,228,0.55)', display: 'block', marginBottom: 6 }}>Title / Role</label>
          <input {...form.register('title')} placeholder="Chief Strategy Officer" style={FP_FIELD} className="fp-field" />
          {form.formState.errors.title && <p style={{ color: '#EF4444', fontSize: 11, marginTop: 4 }}>{form.formState.errors.title.message}</p>}
        </div>
      </div>
      <div style={{ marginBottom: 28 }}>
        <label style={{ ...FP_BC, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: 'rgba(240,237,228,0.55)', display: 'block', marginBottom: 6 }}>Strategic Domain of Greatest Concern</label>
        <select {...form.register('triggerDomain')} style={{ ...FP_FIELD, cursor: 'pointer', appearance: 'none' as any }} className="fp-field fp-select">
          <option value="">Select a domain (optional)</option>
          <option value="Growth & Positioning">Growth &amp; Positioning — M&amp;A, market entry, competitive response</option>
          <option value="Risk & Resilience">Risk &amp; Resilience — regulatory, cyber, activist investor, supply chain</option>
          <option value="Transformation">Transformation — restructuring, leadership change, technology shift</option>
          <option value="All Domains">All Domains — broad strategic readiness across every domain</option>
        </select>
      </div>
      <div style={{ marginBottom: 36 }}>
        <label style={{ ...FP_BC, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: 'rgba(240,237,228,0.55)', display: 'block', marginBottom: 6 }}>
          Anything Else? <span style={{ opacity: 0.5, fontWeight: 400, textTransform: 'none' as const }}>(optional)</span>
        </label>
        <textarea {...form.register('message')} placeholder="A recent trigger you faced, a specific protocol you want to pre-stage, or the question you'd most want answered in 90 days." style={{ ...FP_FIELD, resize: 'vertical', minHeight: 72 }} className="fp-field" />
      </div>
      {mutation.isError && (
        <p style={{ color: '#EF4444', fontSize: 12, marginBottom: 16, ...FP_BC }}>
          Something went wrong. Email <span style={{ color: '#C9A84C' }}>founding@vaughnmartin.com</span> directly.
        </p>
      )}
      <button
        type="submit"
        disabled={mutation.isPending}
        style={{
          width: '100%', padding: '18px 0',
          background: '#C9A84C', color: '#0A0F2E',
          ...FP_BC, fontSize: 13, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase' as const,
          border: 'none', cursor: mutation.isPending ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          opacity: mutation.isPending ? 0.7 : 1, transition: 'opacity 0.2s ease',
        }}
      >
        {mutation.isPending
          ? <><Loader2 style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }} /> Submitting…</>
          : 'Submit Application for 2026 Cohort →'}
      </button>
      <p style={{ ...FP_BC, fontSize: 11, color: 'rgba(240,237,228,0.4)', textAlign: 'center', marginTop: 14, lineHeight: 1.6 }}>
        We review every application personally. No automated responses, no sales calls unless you request them.
      </p>
    </form>
  );
}

export default function FoundingPartnerProgram() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    updatePageMetadata({
      title: "Founding Partner Program — Readiness OS | VaughnMartin",
      description: "Validate Readiness OS' 12-minute coordination claim with a structured 90-day founding partnership. Includes 5 Readiness Protocols, Jira integration, and dedicated success manager. 100% credit applies to enterprise contract.",
      ogTitle: "Founding Partner Program — Readiness OS by VaughnMartin",
      ogDescription: "90-day validation partnership for startup to Fortune 500 founding partners. ROI measurement, live activation, and clear conversion path.",
    });
  }, []);

  return (
    <PageLayout className="vm-page-fpp">
      <div className="bg-[#F8F7F4] dark:bg-[#0A0F2E]">
        
        {/* Hero Section */}
        <section style={{ background: '#0A0F2E', padding: '96px 32px 80px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(201,168,76,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.04) 1px,transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 900px 700px at 100% 0%, rgba(43,138,110,0.10) 0%, transparent 60%)', pointerEvents: 'none' }} />

          <div style={{ maxWidth: 960, margin: '0 auto', position: 'relative' }}>
            <div style={{ marginBottom: 32 }}>
              <VaughnMartinLogo color="light" height={40} variant="full" />
            </div>

            {/* Scarcity badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 20, padding: '8px 16px', border: '1px solid rgba(201,168,76,0.3)', background: 'rgba(201,168,76,0.06)' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#C9A84C', flexShrink: 0 }} />
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: '#C9A84C' }}>
                2026 Founding Partner Cohort · 2 of 12 Spots Filled · 10 Remaining
              </span>
            </div>

            {/* Budget qualifier */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 44, padding: '8px 16px', border: '1px solid rgba(43,138,110,0.25)', background: 'rgba(43,138,110,0.05)' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#2B8A6E', flexShrink: 0 }} />
              <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'rgba(240,237,228,0.65)' }}>
                Founding Partner engagements are structured for organizations with operational budgets of <strong style={{ color: 'rgba(240,237,228,0.90)' }}>$50M+</strong>
              </span>
            </div>

            {/* Problem-first headline */}
            <div style={{ maxWidth: 800, marginBottom: 32 }}>
              <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', color: 'rgba(240,237,228,0.5)', marginBottom: 20, textTransform: 'uppercase' as const }}>
                The last time a strategic trigger fired at your organization — how long did mobilization take?
              </p>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(40px,5.5vw,64px)', fontWeight: 700, color: '#fff', lineHeight: 1.06, marginBottom: 4 }} data-testid="heading-pilot-program">
                The response was ready
              </h1>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(40px,5.5vw,64px)', fontWeight: 700, color: '#C9A84C', lineHeight: 1.06, marginBottom: 32, fontStyle: 'italic' }}>
                before you knew you needed it.
              </h2>
            </div>

            <div style={{ maxWidth: 640, marginBottom: 52 }}>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 16, color: 'rgba(240,237,228,0.78)', lineHeight: 1.85, marginBottom: 20, fontWeight: 400 }}>
                180 Readiness Protocols pre-staged. 221 trigger patterns monitored. Full coordination deployed in 12 minutes — with executive authorization at every step.
              </p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, color: '#C9A84C', fontStyle: 'italic', lineHeight: 1.65 }}>
                2 Founding Partners will prove this in their environment. You're not paying to test software. You're building the operating model your competitors will spend three years trying to replicate.
              </p>
            </div>

            {/* Stats strip */}
            <div style={{ display: 'flex', gap: 0, marginBottom: 52, borderTop: '1px solid rgba(201,168,76,0.18)', paddingTop: 32 }}>
              {[
                { val: '2', label: 'Founding Partner Seats' },
                { val: '$75K', label: 'Engagement Investment' },
                { val: '90', label: 'Days' },
                { val: '100%', label: 'Credited to Enterprise Contract' },
                { val: '25', label: 'Users Included' },
              ].map((s, i) => (
                <div key={s.label} style={{ flex: 1, paddingRight: 24, borderRight: i < 4 ? '1px solid rgba(255,255,255,0.07)' : 'none', paddingLeft: i > 0 ? 24 : 0 }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 700, color: '#C9A84C', lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: 'rgba(240,237,228,0.42)', marginTop: 7 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Readiness Guarantee */}
            <div style={{ marginBottom: 36, padding: '20px 24px', border: '1px solid rgba(43,138,110,0.35)', background: 'rgba(43,138,110,0.06)', display: 'flex', alignItems: 'flex-start', gap: 16, maxWidth: 640 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2B8A6E', flexShrink: 0, marginTop: 5 }} />
              <div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: '#2B8A6E', marginBottom: 6 }}>The Readiness Guarantee</div>
                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(240,237,228,0.75)', lineHeight: 1.65, margin: 0 }}>
                  Your first live activation will be measured. If your first Readiness Protocol execution exceeds 20 minutes, we extend the engagement at no additional charge until the 12-minute target is achieved — or we refund the program fee. The guarantee is simple: <em style={{ color: '#C9A84C' }}>if we can't prove the claim in your environment, you don't pay for it.</em>
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' as const }}>
              <button
                style={{ fontFamily: "'Barlow Condensed', sans-serif", background: '#C9A84C', color: '#0A0F2E', fontWeight: 800, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase' as const, padding: '16px 40px', border: 'none', cursor: 'pointer' }}
                onClick={() => document.getElementById('fp-application')?.scrollIntoView({ behavior: 'smooth' })}
                data-testid="button-apply-pilot"
              >
                Apply for the 2026 Cohort →
              </button>
              <button
                style={{ fontFamily: "'Barlow Condensed', sans-serif", background: 'transparent', color: 'rgba(240,237,228,0.72)', fontWeight: 700, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase' as const, padding: '16px 32px', border: '1px solid rgba(255,255,255,0.18)', cursor: 'pointer' }}
                onClick={() => setLocation('/protocol-builder')}
                data-testid="button-try-builder"
              >
                Preview the Protocol Builder →
              </button>
            </div>
          </div>
        </section>

        {/* Differentiation Strip */}
        <section className="py-8 px-6 bg-[#0A0F2E] border-t border-white/5">
          <div className="max-w-5xl mx-auto grid grid-cols-3 gap-px bg-white/5" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
            {[
              { label: "Pre-staged, not assembled", body: "180 Readiness Protocols exist before any trigger fires. When the moment hits, execution begins in minutes — not after the first alignment meeting." },
              { label: "Coordination, not capability", body: "Every startup to Fortune 500 already has the AI capability. What's missing is the coordination layer that makes the whole stack act — not just recommend." },
              { label: "The response before the trigger", body: "The canonical test: how long does mobilization take after a strategic trigger fires? Founding Partners answer that question with live data. The target is 12 minutes." },
            ].map((item) => (
              <div key={item.label} style={{ padding: '20px 24px', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 8 }}>{item.label}</div>
                <div style={{ fontSize: 12, color: 'rgba(240,237,228,0.55)', lineHeight: 1.6 }}>{item.body}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Staged Before It Fired — Three Domain Vignettes */}
        <section style={{ padding: '72px 32px', background: '#fff', borderTop: '1px solid #E8E4DC' }}>
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            <div style={{ marginBottom: 48 }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: '#C9A84C', marginBottom: 14 }}>
                Across Every Domain
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(26px,3.5vw,40px)', fontWeight: 700, color: '#0A0F2E', lineHeight: 1.2, marginBottom: 12 }}>
                The response was staged before the situation required it.
              </h2>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: '#4B5563', lineHeight: 1.7, maxWidth: 620 }}>
                Strategic situations don't announce themselves — they arrive. Growth windows, risk events, and transformation moments all share the same constraint: the organization that's already staged wins. Three profiles across three domains.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0, border: '1px solid #E8E4DC' }}>
              {[
                {
                  domain: "GROWTH & POSITIONING",
                  borderColor: '#2B8A6E',
                  profile: "Series C SaaS · $180M ARR · 340 employees",
                  situation: "Primary competitor announced direct product overlap at their annual conference. A 72-hour window to reach enterprise accounts before the narrative was set.",
                  staged: "Protocol #18 — Competitive Response — pre-staged. Battle card, counter-positioning brief, top-account call list, and CEO talking points loaded before the conference ended.",
                  outcome: "17 of top 20 enterprise accounts contacted within 2 hours. Company narrative led every analyst conversation that week. Zero accounts lost.",
                  metric: "$14M pipeline protected",
                  metricColor: '#2B8A6E',
                },
                {
                  domain: "RISK & RESILIENCE",
                  borderColor: '#C9A84C',
                  profile: "Industrial manufacturer · $2.4B revenue · 8,200 employees",
                  situation: "FDA audit triggered with 48-hour notice. Three product lines under review. Legal, Quality, Operations, and Communications all needed to coordinate simultaneously.",
                  staged: "Protocol #67 — Regulatory Audit Response — pre-staged. Document packages assembled, spokesperson designated, external counsel on standby, board notification drafted.",
                  outcome: "Full response package ready in 12 minutes. Audit completed without findings. Zero production halt. Board notified before the audit team arrived.",
                  metric: "$0 in penalties or disruption",
                  metricColor: '#C9A84C',
                },
                {
                  domain: "TRANSFORMATION",
                  borderColor: '#0A0F2E',
                  profile: "Professional services firm · 2,800 employees · 6 countries",
                  situation: "Board approved a workforce restructuring affecting 420 roles across 6 jurisdictions. Day-one execution required coordinated communications, legal filings, and manager briefings simultaneously.",
                  staged: "Protocol #112 — Workforce Transformation — pre-staged by country. Legal templates per jurisdiction, manager scripts, HR workflows, and executive communications — all ready before the board vote.",
                  outcome: "All 6 country notifications executed within 4 hours of board approval. Zero legal challenges. Employee communication consistency rated 94% by external review.",
                  metric: "Day-one execution flawless",
                  metricColor: '#0A0F2E',
                },
              ].map((v) => (
                <div key={v.domain} style={{ padding: '32px 28px', borderRight: v.domain !== 'TRANSFORMATION' ? '1px solid #E8E4DC' : 'none', borderTop: `4px solid ${v.borderColor}` }}>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: v.borderColor, marginBottom: 8 }}>{v.domain}</div>
                  <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: '#6B7280', marginBottom: 16, lineHeight: 1.5 }}>{v.profile}</div>
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: 5 }}>The Situation</div>
                    <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: '#374151', lineHeight: 1.65 }}>{v.situation}</p>
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: 5 }}>Pre-Staged Before It Fired</div>
                    <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: '#374151', lineHeight: 1.65 }}>{v.staged}</p>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: 5 }}>What Happened</div>
                    <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: '#374151', lineHeight: 1.65 }}>{v.outcome}</p>
                  </div>
                  <div style={{ paddingTop: 14, borderTop: '1px solid #E8E4DC' }}>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 700, color: v.metricColor }}>{v.metric}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Platform Architecture — Three Tiers */}
        <section style={{ padding: '72px 32px', background: '#F8F7F4', borderTop: '1px solid #E8E4DC' }}>
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            <div style={{ marginBottom: 48 }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: '#C9A84C', marginBottom: 14 }}>
                Platform Architecture
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(26px,3.5vw,38px)', fontWeight: 700, color: '#0A0F2E', lineHeight: 1.2, marginBottom: 12 }}>
                What you get access to as a Founding Partner.
              </h2>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: '#4B5563', lineHeight: 1.7, maxWidth: 640 }}>
                Three platform layers — each deployable independently. Founding Partners access all three, and their operational logic shapes how Tier 3 gets built.
              </p>
            </div>

            <div className="fpp-three-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0, border: '1px solid #E8E4DC' }}>

              {/* Tier 1 */}
              <div style={{ padding: '32px 28px', borderRight: '1px solid #E8E4DC', borderTop: '4px solid #0A0F2E' }}>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: '#0A0F2E', opacity: 0.45, marginBottom: 6 }}>Tier 1 · Included</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: '#0A0F2E', marginBottom: 12, lineHeight: 1.2 }}>Readiness OS Core</div>
                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12.5, color: '#4B5563', lineHeight: 1.65, marginBottom: 20 }}>
                  180 pre-staged protocols, 221 trigger monitors, 12-minute execution engine. The full platform — available from day one.
                </p>
                {['180 Readiness Protocols ready to deploy', '221 strategic triggers monitored continuously', '12-minute trigger-to-coordination engine', 'Executive authorization at every activation'].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
                    <div style={{ width: 3, height: 3, background: '#0A0F2E', flexShrink: 0, marginTop: 6 }} />
                    <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: '#374151', lineHeight: 1.55 }}>{item}</span>
                  </div>
                ))}
                <div style={{ marginTop: 20, padding: '8px 14px', background: 'rgba(10,15,46,0.05)', borderLeft: '3px solid #0A0F2E' }}>
                  <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#0A0F2E' }}>Immediate deployment</span>
                </div>
              </div>

              {/* Tier 2 */}
              <div style={{ padding: '32px 28px', borderRight: '1px solid #E8E4DC', borderTop: '4px solid #2B8A6E' }}>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: '#2B8A6E', marginBottom: 6 }}>Tier 2 · Included</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: '#0A0F2E', marginBottom: 12, lineHeight: 1.2 }}>Industry Protocol Pack</div>
                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12.5, color: '#4B5563', lineHeight: 1.65, marginBottom: 20 }}>
                  Pre-configured for your vertical's specific trigger patterns. Reduces deployment time from weeks to days.
                </p>
                {['Financial Services — activist, regulatory, cyber', 'Healthcare — recall, FDA action, supply chain', 'Energy — grid, regulatory, infrastructure', 'Manufacturing, Pharma, Technology packs available'].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
                    <div style={{ width: 3, height: 3, background: '#2B8A6E', flexShrink: 0, marginTop: 6 }} />
                    <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: '#374151', lineHeight: 1.55 }}>{item}</span>
                  </div>
                ))}
                <div style={{ marginTop: 20, padding: '8px 14px', background: 'rgba(43,138,110,0.07)', borderLeft: '3px solid #2B8A6E' }}>
                  <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#2B8A6E' }}>6 industry packs · Sector-specific depth</span>
                </div>
              </div>

              {/* Tier 3 */}
              <div style={{ padding: '32px 28px', borderTop: '4px solid #C9A84C' }}>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: '#C9A84C', marginBottom: 6 }}>Tier 3 · Co-Designed With You</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: '#0A0F2E', marginBottom: 12, lineHeight: 1.2 }}>Protocol Builder</div>
                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12.5, color: '#4B5563', lineHeight: 1.65, marginBottom: 20 }}>
                  Build custom protocols from scratch for scenarios unique to your organization. Founding Partners shape how this gets built.
                </p>
                {['Custom trigger conditions and signal thresholds', 'Your org structure, task sequences, and owners', 'Approval workflows and decision authority mapping', 'Your operational logic defines the design'].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
                    <div style={{ width: 3, height: 3, background: '#C9A84C', flexShrink: 0, marginTop: 6 }} />
                    <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: '#374151', lineHeight: 1.55 }}>{item}</span>
                  </div>
                ))}
                <div style={{ marginTop: 20, padding: '8px 14px', background: 'rgba(201,168,76,0.08)', borderLeft: '3px solid #C9A84C' }}>
                  <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#8B6914' }}>Founding Partner early access · In development</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 4-Phase Timeline */}
        <section style={{ padding: '80px 32px', background: '#F8F7F4' }}>
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            <div style={{ marginBottom: 52 }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: '#C9A84C', marginBottom: 16 }}>
                Structured 90-Day Journey
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px,4vw,40px)', fontWeight: 700, color: '#0A0F2E', lineHeight: 1.2, marginBottom: 0 }} data-testid="heading-phases">
                Crawl, walk, run — with clear milestones at every phase.
              </h2>
            </div>

            <div className="fpp-four-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, borderTop: '2px solid #0A0F2E' }} data-testid="phases-grid">
              {pilotPhases.map((phase, i) => {
                const phaseColors = ['#6B7280', '#0A0F2E', '#2B8A6E', '#C9A84C'];
                const color = phaseColors[i];
                return (
                  <div key={i} style={{ padding: '28px 24px 28px', borderRight: i < 3 ? '1px solid #E8E4DC' : 'none', borderTop: `3px solid ${color}`, marginTop: -2 }} data-testid={`phase-${i}`}>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color, marginBottom: 4 }}>{phase.duration}</div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: '#0A0F2E', marginBottom: 4 }}>{phase.phase}</div>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 700, color: '#0A0F2E', marginBottom: 16, letterSpacing: '0.04em' }}>{phase.name}</div>
                    <div style={{ marginBottom: 20 }}>
                      {phase.activities.slice(0, 3).map((activity, j) => (
                        <div key={j} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
                          <div style={{ width: 3, height: 3, background: color, marginTop: 6, flexShrink: 0 }} />
                          <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: '#555', lineHeight: 1.5 }}>{activity}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ borderTop: '1px solid #E8E4DC', paddingTop: 16 }}>
                      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: '#6B7280', marginBottom: 4 }}>Success Metric</div>
                      <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: '#555', lineHeight: 1.5 }}>{phase.successMetrics}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section style={{ padding: '80px 32px', background: '#fff' }}>
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            <div style={{ marginBottom: 52 }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: '#C9A84C', marginBottom: 16 }}>
                What's Included
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px,4vw,40px)', fontWeight: 700, color: '#0A0F2E', lineHeight: 1.2 }} data-testid="heading-inclusions">
                Everything needed to validate Readiness OS in your environment.
              </h2>
            </div>
            <div className="fpp-four-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, border: '1px solid #E8E4DC' }}>
              {pilotInclusions.map((inclusion, i) => (
                <div key={i} style={{ padding: '28px 24px', borderRight: i < pilotInclusions.length - 1 ? '1px solid #E8E4DC' : 'none' }} data-testid={`card-inclusion-${i}`}>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: '#0A0F2E', marginBottom: 20, borderBottom: '1px solid #E8E4DC', paddingBottom: 12 }}>{inclusion.category}</div>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                    {inclusion.items.map((item, j) => (
                      <li key={j} style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'flex-start' }}>
                        <div style={{ width: 3, height: 3, background: '#2B8A6E', marginTop: 6, flexShrink: 0 }} />
                        <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: '#555', lineHeight: 1.5 }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Board-Grade Deliverables */}
        <section style={{ padding: '72px 32px', background: '#0A0F2E' }}>
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            <div style={{ marginBottom: 48 }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: '#C9A84C', marginBottom: 16 }}>
                What Your Board Will See
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(26px,3.5vw,38px)', fontWeight: 700, color: '#fff', lineHeight: 1.2, marginBottom: 12 }}>
                Board-grade reporting, produced automatically.
              </h2>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, maxWidth: 600 }}>
                Every Founding Partner activation generates a complete evidence package. No manual assembly — the platform produces it at the moment of close.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
              {[
                { label: 'Activation Timeline', icon: '01', desc: 'Timestamped execution record from signal detection through final acknowledgment — fully auditable.', color: '#2B8A6E' },
                { label: 'Ownership Acknowledgment Log', icon: '02', desc: 'Named stakeholder confirmation record. Who was notified, who confirmed, and when — no ambiguity for governance.', color: '#2B8A6E' },
                { label: 'Decision Velocity Measurement', icon: '03', desc: 'Time from trigger detection to executive authorization. Your 12-minute benchmark, measured against actual outcome.', color: '#C9A84C' },
                { label: 'Value Preserved Calculation', icon: '04', desc: 'Risk avoided and opportunity cost of response speed — expressed in financial terms your CFO will recognize.', color: '#C9A84C' },
                { label: 'Audit-Ready Board Export', icon: '05', desc: 'One-click PDF export. Activation debrief with classification, financial outcome, and recommended next steps.', color: '#fff' },
                { label: 'Readiness Benchmark Report', icon: '06', desc: 'Before and after mobilization speed. Establishes your baseline and quantifies the operational improvement.', color: '#fff' },
              ].map((item) => (
                <div key={item.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '24px 22px' }}>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: '0.16em', color: 'rgba(255,255,255,0.25)', marginBottom: 12 }}>{item.icon}</div>
                  <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 700, color: item.color, marginBottom: 8, lineHeight: 1.3 }}>{item.label}</div>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 24, padding: '20px 28px', background: 'rgba(201,168,76,0.08)', borderLeft: '3px solid #C9A84C', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', margin: 0 }}>
                Every Founding Partner leaves with a measured mobilization benchmark and a board-ready activation record.
              </p>
              <a href="/executive-brief" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: '#C9A84C', textDecoration: 'none', borderBottom: '1px solid rgba(201,168,76,0.3)', paddingBottom: 2, whiteSpace: 'nowrap' as const }}>
                View Executive Brief →
              </a>
            </div>
          </div>
        </section>

        {/* Executive Questions — Short Version */}
        <section style={{ padding: '64px 32px', background: '#F8F7F4', borderTop: '1px solid #E8E4DC' }}>
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 10 }}>What Leaders Ask Before They Apply</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(26px,3.5vw,38px)', fontWeight: 700, color: '#0A0F2E', marginBottom: 40, lineHeight: 1.25 }}>
              Executive Questions, Answered
            </h2>
            <div style={{ display: 'grid', gap: 2 }}>
              {[
                {
                  q: "Is this replacing our current stack?",
                  a: "No. Readiness OS is the operating model layer above your existing systems — Microsoft, Jira, ServiceNow, collaboration tools. No rip-and-replace. Value is demonstrable before deep integration begins.",
                },
                {
                  q: "Is AI making decisions for us?",
                  a: "No. AI monitors signals and prepares context. Executives authorize activation. Authority stays human at every step — governance and decision authority are explicit, auditable, and pre-staged.",
                },
                {
                  q: "What does a 90-day Founding Partner engagement actually produce?",
                  a: "A fully configured set of Readiness Protocols mapped to your real scenarios, stakeholders, and risk calendar — plus a measured mobilization benchmark you can take to your board.",
                },
                {
                  q: "How do we know this works before we commit?",
                  a: "Run the full execution sequence in a live test environment. Inspect exactly what is staged, activated, and acknowledged. The product makes readiness visible and auditable, not abstract.",
                },
              ].map((item, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', border: '1px solid #E8E4DC', borderTopWidth: i === 0 ? 1 : 0, borderTopColor: i === 0 ? '#E8E4DC' : 'transparent' }}>
                  <div style={{ padding: '24px 28px', borderRight: '1px solid #E8E4DC', background: '#fff' }}>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 8 }}>Q{String(i + 1).padStart(2, '0')}</div>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 600, color: '#0A0F2E', lineHeight: 1.45, margin: 0 }}>{item.q}</p>
                  </div>
                  <div style={{ padding: '24px 32px', background: '#FAFAF8', display: 'flex', alignItems: 'center' }}>
                    <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.75, margin: 0 }}>{item.a}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 28, padding: '20px 28px', background: '#fff', borderLeft: '3px solid #2B8A6E', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <p style={{ fontSize: 13, color: '#0A0F2E', fontWeight: 600, margin: 0 }}>
                Want to test this in your environment before you apply?
              </p>
              <a href="/12-minute-experience" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#2B8A6E', textDecoration: 'none', borderBottom: '1px solid rgba(43,138,110,0.3)', paddingBottom: 2, whiteSpace: 'nowrap' }}>
                Run the 12-Minute Test Drive →
              </a>
            </div>
          </div>
        </section>

        {/* Ideal Candidates */}
        <section style={{ padding: '80px 32px', background: '#F8F7F4' }}>
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            <div style={{ marginBottom: 52 }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: '#C9A84C', marginBottom: 16 }}>
                Ideal Founding Partners
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px,4vw,40px)', fontWeight: 700, color: '#0A0F2E', lineHeight: 1.2 }} data-testid="heading-candidates">
                Six criteria. All required. No exceptions.
              </h2>
            </div>
            <div className="fpp-three-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>
              {idealCandidates.map((candidate, i) => {
                const isRequired = candidate.importance === 'Required';
                return (
                  <div key={i} style={{ padding: '28px 24px', borderLeft: i > 0 ? '1px solid #E8E4DC' : 'none', borderTop: i >= 3 ? '1px solid #E8E4DC' : 'none' }} data-testid={`card-candidate-${i}`}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 700, color: '#0A0F2E', letterSpacing: '0.04em', lineHeight: 1.3 }}>{candidate.criteria}</div>
                      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: isRequired ? '#fff' : '#6B7280', background: isRequired ? '#0A0F2E' : 'transparent', padding: isRequired ? '2px 6px' : '2px 0', whiteSpace: 'nowrap' as const, marginLeft: 8, flexShrink: 0 }}>
                        {candidate.importance}
                      </div>
                    </div>
                    <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: '#555', lineHeight: 1.6 }}>{candidate.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ROI Measurement Framework */}
        <section className="py-16 px-6 bg-[#0A0F2E]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 14 }}>
                <div style={{ width: 20, height: 1.5, background: '#C9A84C' }} />
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: 'rgba(201,168,76,0.7)' }}>
                  Quantified Value Capture
                </span>
                <div style={{ width: 20, height: 1.5, background: '#C9A84C' }} />
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px,4vw,42px)', fontWeight: 700, color: '#fff', lineHeight: 1.15, margin: 0 }} data-testid="heading-roi">
                ROI Measurement Framework
              </h2>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 16, color: 'rgba(255,255,255,0.5)', marginTop: 12, lineHeight: 1.6 }}>
                Every milestone produces evidence. Every activation is measured.
              </p>
            </div>

            <div style={{ border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }} data-testid="card-roi-framework">
              <div style={{ padding: 0, overflowX: 'auto' }}>
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-4 font-semibold text-white">Value Metric</th>
                      <th className="text-left p-4 font-semibold text-red-400">Before Readiness OS</th>
                      <th className="text-left p-4 font-semibold text-[#3BAF8A]">With Readiness OS</th>
                      <th className="text-left p-4 font-semibold text-white/70">Calculation</th>
                      <th className="text-right p-4 font-semibold text-[#C9A84C]">Value Captured</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roiCalculator.map((row, i) => (
                      <tr key={i} className="border-b border-white/5 last:border-0">
                        <td className="p-4 text-white font-medium">{row.metric}</td>
                        <td className="p-4 text-red-400/80">{row.baseline}</td>
                        <td className="p-4 text-[#3BAF8A]">{row.withExecutionOS}</td>
                        <td className="p-4 text-white/60 text-sm">{row.calculation}</td>
                        <td className="p-4 text-[#C9A84C] font-bold text-right">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-white/5">
                      <td colSpan={4} className="p-4 text-white font-bold text-right">Total Value per Major Event:</td>
                      <td className="p-4 text-2xl font-bold text-[#C9A84C] text-right">$60K - $2M+</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Conversion Terms */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div style={{ borderBottom: '1px solid #E8E4DC', paddingBottom: 28, marginBottom: 48 }}>
              <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#2B8A6E', marginBottom: 12 }}>Founding Partner Benefits</p>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px,4vw,40px)', fontWeight: 700, color: '#0A0F2E', lineHeight: 1.2 }} data-testid="heading-conversion">
                Founding Partner to Production Path
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
              {conversionTerms.map((term, i) => (
                <div key={i} style={{ borderLeft: i === 0 ? '1px solid #E8E4DC' : 'none', borderRight: '1px solid #E8E4DC', borderTop: '3px solid #2B8A6E', borderBottom: '1px solid #E8E4DC', padding: '28px 24px' }} data-testid={`card-term-${i}`}>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2B8A6E', marginBottom: 14 }}>Benefit {String(i + 1).padStart(2, '0')}</div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: '#0A0F2E', marginBottom: 10, lineHeight: 1.2 }}>{term.term}</h3>
                  <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: '#4B5563', lineHeight: 1.6 }}>{term.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories Preview */}
        <section className="py-16 px-6 bg-[#F8F7F4]">
          <div className="max-w-4xl mx-auto">
            <div style={{ background: '#fff', borderTop: '3px solid #0A0F2E', borderLeft: '1px solid #E8E4DC', borderRight: '1px solid #E8E4DC', borderBottom: '1px solid #E8E4DC', padding: '40px 48px' }} data-testid="card-success-preview">
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#0A0F2E', marginBottom: 8, opacity: 0.45 }}>Founding Partner Success Target</div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(24px,3vw,32px)', fontWeight: 700, color: '#0A0F2E', marginBottom: 28 }}>
                What Success Looks Like
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                {[
                  "At least 1 live activation under 15 minutes",
                  "5+ Readiness Protocols customized and operational",
                  "Quantified ROI with executive sign-off",
                  "Clear expansion plan for enterprise rollout"
                ].map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ width: 6, height: 6, background: '#2B8A6E', flexShrink: 0, marginTop: 7 }} />
                    <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: '#374151', lineHeight: 1.6 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Independent Peer Assessment */}
        <section className="py-16 px-6 bg-[#F8F7F4]">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 14 }}>
                <div style={{ width: 20, height: 1.5, background: '#C9A84C' }} />
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: '#C9A84C' }}>Part of the Founding Partner Structure</span>
                <div style={{ width: 20, height: 1.5, background: '#C9A84C' }} />
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px,4vw,40px)', fontWeight: 700, color: '#0A0F2E', lineHeight: 1.2, margin: '0 0 16px' }}>Independent Peer Assessment</h2>
              <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed">
                Every Founding Partner completes a structured 28-question independent assessment. Your unfiltered perspective — credibility gaps, competitive concerns, pricing instincts — is captured and used to improve the product and sharpen the go-to-market approach.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {[
                { label: "Before Engagement", description: "Section A (The Problem Space) establishes your baseline — what the execution gap looks like in your organization before you have experienced the platform.", color: "#6B7280" },
                { label: "After Engagement", description: "Sections B–F capture your full verdict: product clarity, market viability, gaps, competitive landscape, and whether you would buy or refer.", color: "#0A0F2E" },
                { label: "Becomes Product Intelligence", description: "Responses feed directly into a private analytics dashboard. Patterns across reviewers drive the product roadmap and sharpen messaging.", color: "#2B8A6E" },
              ].map(item => (
                <div key={item.label} className="bg-white border border-[#E8E4DC] p-6" style={{ borderTop: `3px solid ${item.color}` }}>
                  <h3 className="font-bold text-[#0A0F2E] mb-2 text-sm uppercase tracking-wide">{item.label}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
            <div className="bg-white border border-[#E8E4DC] p-8 flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <div className="text-xs font-bold tracking-[0.2em] uppercase text-[#C9A84C] mb-2">Independent Assessment</div>
                <h3 className="text-xl font-bold text-[#0A0F2E] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Ready to Share Your Assessment?</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Critical and skeptical feedback is more valuable than a positive review. 28 questions across 6 sections. Estimated 25–35 minutes.</p>
              </div>
              <div className="flex-shrink-0">
                <button
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", background: '#0A0F2E', color: '#C9A84C', fontWeight: 800, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '14px 28px', border: 'none', cursor: 'pointer' }}
                  onClick={() => { setLocation('/peer-review'); window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }); }}
                >
                  Begin Peer Assessment
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Pilot Onboarding Preview */}
        <section className="py-14 px-6 bg-[#0A0F2E]">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 14 }}>
                <div style={{ width: 20, height: 1.5, background: '#C9A84C' }} />
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: 'rgba(201,168,76,0.7)' }}>What Happens After You Sign</span>
                <div style={{ width: 20, height: 1.5, background: '#C9A84C' }} />
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(24px,3.5vw,36px)', fontWeight: 700, color: '#fff', lineHeight: 1.2, margin: '0 0 12px' }}>Your first 90 days, by role.</h2>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xl mx-auto">
                Every Founding Partner engagement includes a structured onboarding guide built around the five roles present in every startup to Fortune 500 deployment — so each person on your team knows exactly what they see, what they own, and what success looks like at day 90.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { phase: 'Days 1–30', label: 'Foundation', color: '#2B8A6E', desc: 'All 25 users onboarded. Integration live. First Readiness Protocol activation completed.' },
                { phase: 'Days 31–60', label: 'Velocity', color: '#C9A84C', desc: 'Multiple activations with documented outcomes. ROI data capture begins.' },
                { phase: 'Days 61–90', label: 'Proof', color: '#2B8A6E', desc: 'Full activation history. Board brief generated. Renewal case quantified.' },
              ].map((t) => (
                <div key={t.label} style={{ borderTop: `3px solid ${t.color}` }} className="bg-white/5 p-5">
                  <p style={{ color: t.color }} className="text-xs font-bold tracking-widest uppercase mb-1">{t.phase}</p>
                  <p className="text-white font-semibold text-sm mb-2">{t.label}</p>
                  <p className="text-slate-400 text-xs leading-relaxed">{t.desc}</p>
                </div>
              ))}
            </div>
            <div className="text-center">
              <button
                onClick={() => setLocation('/founding-partner-onboarding')}
                className="inline-flex items-center gap-2 text-[#C9A84C] text-sm font-semibold hover:text-white transition-colors"
              >
                See the full role-by-role onboarding guide
                <svg width={14} height={14} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* Microsoft / Existing Stack Objection Section */}
        <section className="py-16 px-6 bg-[#F8F7F4]">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 14 }}>
                <div style={{ width: 20, height: 1.5, background: '#C9A84C' }} />
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: '#C9A84C' }}>A Question Every Founding Partner Asks</span>
                <div style={{ width: 20, height: 1.5, background: '#C9A84C' }} />
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(26px,4vw,42px)', fontWeight: 700, color: '#0A0F2E', lineHeight: 1.2, margin: '0 0 16px' }}>
                "We already have Microsoft Copilot. Why Readiness OS?"
              </h2>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
                Every startup to Fortune 500 has Microsoft's AI stack. None have the operating model to execute with it. Readiness OS is not a replacement — it is the coordination layer that makes your existing investment actionable.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-10">
              {/* What Microsoft does */}
              <div className="bg-white border border-[#E8E4DC] p-6">
                <div className="text-xs font-bold tracking-[0.18em] uppercase text-gray-400 mb-4">Your Microsoft Investment Does</div>
                <div className="space-y-3">
                  {[
                    "Copilot summarizes meetings and drafts documents",
                    "Azure OpenAI powers intelligent search and analysis",
                    "Teams connects your people for communication",
                    "Purview manages data governance and compliance",
                    "Defender monitors for security threats",
                  ].map(item => (
                    <div key={item} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-gray-300 flex-shrink-0 mt-2" />
                      <span className="text-sm text-gray-600 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-3 bg-[#F0EDE4] border border-[#E8E4DC]">
                  <p className="text-xs font-semibold text-[#0A0F2E]">What it doesn't do</p>
                  <p className="text-xs text-[#4B5563] mt-1 leading-relaxed">None of these tools coordinate your organization when a high-stakes situation presents itself. They surface information — but someone still has to mobilize the people, assign the tasks, and execute the Readiness Protocol. That coordination takes 30 days. That's the gap.</p>
                </div>
              </div>

              {/* What Readiness OS adds */}
              <div className="bg-[#0A0F2E] border border-[#0A0F2E] p-6">
                <div className="text-xs font-bold tracking-[0.18em] uppercase text-[#C9A84C] mb-4">Readiness OS Adds</div>
                <div className="space-y-3">
                  {[
                    "Pre-staged Readiness Protocols — 180 across 9 domains, ready before any trigger fires",
                    "Automated stakeholder cascade — every role notified and assigned in 12 minutes",
                    "Trigger-to-coordination engine — detection becomes execution, not a meeting",
                    "Decision authority preserved — AI orchestrates, your executives decide",
                    "Continuous improvement — every activation makes your Readiness Protocols smarter",
                  ].map(item => (
                    <div key={item} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-[#C9A84C] flex-shrink-0 mt-2" />
                      <span className="text-sm text-white/80 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-3 border border-[#C9A84C]/30 bg-[#C9A84C]/5">
                  <p className="text-xs font-semibold text-[#C9A84C]">The operating model layer</p>
                  <p className="text-xs text-white/70 mt-1 leading-relaxed">Readiness OS sits above your Microsoft investment — not beside it, not replacing it. Copilot detects and summarizes. Readiness OS deploys your people at the speed of detection.</p>
                </div>
              </div>
            </div>

            {/* Stack diagram */}
            <div className="bg-white border border-[#E8E4DC] p-6">
              <div className="text-xs font-bold tracking-[0.18em] uppercase text-[#C9A84C] mb-5 text-center">Enterprise Stack — Where Readiness OS Fits</div>
              <div className="space-y-2 max-w-2xl mx-auto">
                {[
                  { layer: "Readiness OS", role: "Operating Model — coordinates humans at the speed of AI detection", highlight: true },
                  { layer: "Microsoft Copilot & Azure OpenAI", role: "Signal Intelligence — detects, summarizes, analyzes", highlight: false },
                  { layer: "Microsoft Teams & Outlook", role: "Communication Infrastructure — how people connect", highlight: false },
                  { layer: "Jira / Asana / ServiceNow", role: "Work Management — where tasks are tracked", highlight: false },
                  { layer: "Defender / Purview / Sentinel", role: "Security & Compliance — what is monitored", highlight: false },
                ].map(({ layer, role, highlight }, i) => (
                  <div key={layer} className={`flex items-center gap-4 p-3 border ${highlight ? "border-[#C9A84C] bg-[#0A0F2E]" : "border-[#E8E4DC] bg-[#F8F7F4]"}`}>
                    <div className={`w-2 h-2 flex-shrink-0 ${highlight ? "bg-[#C9A84C]" : "bg-gray-300"}`} />
                    <div className={`text-sm font-semibold min-w-[240px] ${highlight ? "text-[#C9A84C]" : "text-[#0A0F2E]"}`}>{layer}</div>
                    <div className={`text-xs ${highlight ? "text-white/70" : "text-gray-500"}`}>{role}</div>
                    {highlight && <span className="ml-auto text-[10px] font-bold tracking-wider uppercase text-[#C9A84C] whitespace-nowrap">← Readiness OS</span>}
                    {!highlight && <span className="ml-auto text-[10px] text-gray-400 whitespace-nowrap">Already invested</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Application Section */}
        <section id="fp-application" style={{ background: '#0A0F2E', padding: '96px 32px 80px', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(201,168,76,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.04) 1px,transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />
          {/* Strategic Foresight Engine callout */}
          <div style={{ background: 'rgba(43,138,110,0.08)', border: '1px solid rgba(43,138,110,0.22)', borderLeft: '4px solid #2B8A6E', padding: '32px 36px', marginBottom: 48 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' as const }}>
              <div style={{ flex: 1, minWidth: 280 }}>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, fontWeight: 800, letterSpacing: '0.25em', textTransform: 'uppercase' as const, color: '#2B8A6E', marginBottom: 8 }}>Being co-developed with this cohort</div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: '#fff', lineHeight: 1.25, marginBottom: 10 }}>
                  Readiness Oracle — Strategic Foresight Engine
                </h3>
                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(240,237,228,0.65)', lineHeight: 1.7, margin: '0 0 16px' }}>
                  The next layer beyond 12-minute response — a living organizational digital twin, autonomous war gaming against emerging patterns, and collective readiness intelligence across the entire customer base. The response ready before the trigger is even a pattern.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8, marginBottom: 4 }}>
                  {['Living Digital Twin', 'Autonomous War Gaming', 'Collective Intelligence', 'Executive Time Machine'].map(cap => (
                    <span key={cap} style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(43,138,110,0.9)', background: 'rgba(43,138,110,0.10)', border: '1px solid rgba(43,138,110,0.22)', padding: '4px 10px' }}>{cap}</span>
                  ))}
                </div>
              </div>
              <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                <a href="/readiness-oracle" style={{ fontFamily: "'Barlow Condensed', sans-serif", display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', color: '#2B8A6E', fontWeight: 800, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' as const, padding: '12px 20px', border: '1px solid rgba(43,138,110,0.4)', textDecoration: 'none', whiteSpace: 'nowrap' as const }}>
                  See Full Vision →
                </a>
              </div>
            </div>
          </div>

          <div style={{ maxWidth: 720, margin: '0 auto', position: 'relative' }}>

            {/* Section header */}
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 24, padding: '6px 14px', border: '1px solid rgba(201,168,76,0.25)', background: 'rgba(201,168,76,0.05)' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#C9A84C' }} />
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: '#C9A84C' }}>
                  2026 Cohort · Selective Cohort
                </span>
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(30px,4vw,46px)', fontWeight: 700, color: '#fff', lineHeight: 1.15, marginBottom: 16 }} data-testid="heading-cta">
                Apply for the Founding Partner Program.
              </h2>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: 'rgba(240,237,228,0.6)', lineHeight: 1.75, maxWidth: 540, margin: '0 auto 28px' }}>
                We review every application personally. Priority given to enterprise organizations with a C-level sponsor, active Microsoft or enterprise stack, and a recent strategic trigger they weren't fully ready for.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 36, flexWrap: 'wrap' as const }}>
                {[
                  { val: '$75K', label: 'investment — 100% credited' },
                  { val: '90 days', label: 'structured engagement' },
                  { val: '48 hrs', label: 'application response' },
                ].map((s, i) => (
                  <div key={i} style={{ textAlign: 'center' as const }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: '#C9A84C', lineHeight: 1 }}>{s.val}</div>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: 'rgba(240,237,228,0.42)', marginTop: 5 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Application form */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.15)', padding: '48px' }}>
              <ApplicationForm />
            </div>

            {/* Below-form links */}
            <div style={{ marginTop: 32, textAlign: 'center' as const }}>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'rgba(240,237,228,0.4)', lineHeight: 1.6, marginBottom: 16 }}>
                Questions before applying? <span style={{ color: '#C9A84C' }}>founding@vaughnmartin.com</span>
              </p>
              <button
                onClick={() => setLocation('/request-access')}
                style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.3)', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                Want to explore the platform before committing? Request executive access →
              </button>
            </div>
          </div>
        </section>

      </div>
    </PageLayout>
  );
}
