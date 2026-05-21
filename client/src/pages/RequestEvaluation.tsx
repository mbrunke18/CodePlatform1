import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import PageLayout from '@/components/layout/PageLayout';
import { updatePageMetadata } from '@/lib/seo';
import { useEffect } from 'react';
import { CheckCircle, Clock, Shield, Zap } from 'lucide-react';

const NAVY = '#0A0F2E';
const GOLD = '#C9A84C';
const TEAL = '#2B8A6E';
const IVORY = '#F0EDE4';
const BAR = { fontFamily: 'Barlow Condensed, sans-serif' } as const;
const GEO = { fontFamily: 'Cormorant Garamond, Georgia, serif' } as const;
const BORDER_R = { borderRadius: '0.15rem' } as const;

const schema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  email: z.string().email('Valid email required'),
  company: z.string().min(1, 'Required'),
  role: z.string().min(1, 'Required'),
  useCase: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const EVAL_INCLUDES = [
  { icon: Zap, label: 'Signal Detection', desc: 'Live RSS ingestion — 248+ signals scored every 15 minutes' },
  { icon: Shield, label: 'Protocol Matching', desc: 'Watch a trigger map to a pre-staged Readiness Protocol in real time' },
  { icon: CheckCircle, label: 'Authorization Simulation', desc: 'Complete the executive authorization gate and see the response stage' },
  { icon: Clock, label: 'Execution Timeline', desc: 'Full 12-minute chain — tasks deployed, war room live, memo generated' },
];

const EVAL_EXCLUDES = [
  'Production integrations (Microsoft, Salesforce, ServiceNow)',
  'Unrestricted data exports',
  'Multi-organization admin controls',
  'Audit log access',
];

export default function RequestEvaluation() {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    updatePageMetadata({
      title: '48-Hour Guided Evaluation | VaughnMartin Readiness OS',
      description: 'Request a 48-hour guided evaluation workspace. Hands-on access to signal detection, protocol matching, executive authorization simulation, and full execution timeline.',
    });
  }, []);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => apiRequest('POST', '/api/eval/request', data),
    onSuccess: () => setSubmitted(true),
  });

  const onSubmit = (data: FormData) => mutation.mutate(data);

  return (
    <PageLayout>
      <div style={{ minHeight: '100vh', background: '#F8F7F4' }}>

        {/* Hero */}
        <div style={{ background: NAVY, padding: '80px 0 64px' }}>
          <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
            <div style={{ ...BAR, fontSize: 11, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD, marginBottom: 16 }}>
              48-Hour Guided Evaluation
            </div>
            <h1 style={{ ...GEO, fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 700, color: '#fff', lineHeight: 1.2, marginBottom: 20 }}>
              Hands-On Workspace.<br />Realistic Data. 48 Hours.
            </h1>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: 32, maxWidth: 560, margin: '0 auto 32px' }}>
              Your evaluation workspace is pre-seeded with realistic synthetic data across a full strategic scenario.
              Walk the complete IDEA chain — from signal ingestion to authorized execution — with a structured success path.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: 'rgba(201,168,76,0.12)', border: `1px solid rgba(201,168,76,0.3)`, ...BORDER_R }}>
              <Clock size={14} color={GOLD} />
              <span style={{ ...BAR, fontSize: 13, color: GOLD, fontWeight: 700, letterSpacing: '0.06em' }}>Access activates within 24 hours of approval</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: 1040, margin: '0 auto', padding: '64px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 48, alignItems: 'start' }}>

            {/* Left: what's included */}
            <div>
              <div style={{ ...BAR, fontSize: 11, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: TEAL, marginBottom: 20 }}>
                What You'll Experience
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 36 }}>
                {EVAL_INCLUDES.map(({ icon: Icon, label, desc }) => (
                  <div key={label} style={{ display: 'flex', gap: 14, padding: '16px 20px', background: '#fff', border: `1px solid #E8E4DC`, borderLeft: `3px solid ${TEAL}`, ...BORDER_R }}>
                    <Icon size={18} color={TEAL} style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <div style={{ ...BAR, fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 3, letterSpacing: '0.04em' }}>{label}</div>
                      <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.55 }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ padding: '20px 24px', background: IVORY, border: `1px solid #E8E4DC`, ...BORDER_R }}>
                <div style={{ ...BAR, fontSize: 10, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 12 }}>
                  Evaluation Guardrails
                </div>
                {EVAL_EXCLUDES.map(item => (
                  <div key={item} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
                    <span style={{ color: '#D1D5DB', fontSize: 12, marginTop: 1, flexShrink: 0 }}>—</span>
                    <span style={{ fontSize: 12, color: '#9CA3AF', lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #E8E4DC', fontSize: 11, color: '#6B7280', lineHeight: 1.6 }}>
                  All data in the evaluation workspace is synthetic. No production systems are connected.
                </div>
              </div>
            </div>

            {/* Right: form or confirmation */}
            <div>
              {submitted ? (
                <div style={{ padding: '48px 40px', background: '#fff', border: `1px solid #E8E4DC`, borderTop: `3px solid ${TEAL}`, ...BORDER_R, textAlign: 'center' }}>
                  <CheckCircle size={40} color={TEAL} style={{ margin: '0 auto 20px' }} />
                  <h2 style={{ ...GEO, fontSize: 28, fontWeight: 700, color: NAVY, marginBottom: 12 }}>Request Received</h2>
                  <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.7, maxWidth: 380, margin: '0 auto 24px' }}>
                    We review every evaluation request personally. You'll hear from us within one business day.
                    If approved, your workspace access activates with a guided onboarding link.
                  </p>
                  <a
                    href="/how-it-executes"
                    style={{ ...BAR, display: 'inline-block', background: NAVY, color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '10px 24px', textDecoration: 'none', ...BORDER_R }}
                  >
                    See How It Executes →
                  </a>
                </div>
              ) : (
                <div style={{ background: '#fff', border: `1px solid #E8E4DC`, borderTop: `3px solid ${GOLD}`, ...BORDER_R, padding: '36px 36px' }}>
                  <div style={{ ...BAR, fontSize: 11, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD, marginBottom: 6 }}>
                    Request Access
                  </div>
                  <h2 style={{ ...GEO, fontSize: 26, fontWeight: 700, color: NAVY, marginBottom: 24 }}>
                    48-Hour Guided Evaluation
                  </h2>

                  <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: NAVY, marginBottom: 5, letterSpacing: '0.06em', textTransform: 'uppercase' }}>First Name *</label>
                        <input {...register('firstName')} style={{ width: '100%', padding: '9px 12px', border: `1px solid ${errors.firstName ? '#EF4444' : '#D1D5DB'}`, ...BORDER_R, fontSize: 14, color: NAVY, outline: 'none', boxSizing: 'border-box' }} />
                        {errors.firstName && <p style={{ fontSize: 11, color: '#EF4444', marginTop: 3 }}>{errors.firstName.message}</p>}
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: NAVY, marginBottom: 5, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Last Name *</label>
                        <input {...register('lastName')} style={{ width: '100%', padding: '9px 12px', border: `1px solid ${errors.lastName ? '#EF4444' : '#D1D5DB'}`, ...BORDER_R, fontSize: 14, color: NAVY, outline: 'none', boxSizing: 'border-box' }} />
                        {errors.lastName && <p style={{ fontSize: 11, color: '#EF4444', marginTop: 3 }}>{errors.lastName.message}</p>}
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: NAVY, marginBottom: 5, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Work Email *</label>
                      <input {...register('email')} type="email" style={{ width: '100%', padding: '9px 12px', border: `1px solid ${errors.email ? '#EF4444' : '#D1D5DB'}`, ...BORDER_R, fontSize: 14, color: NAVY, outline: 'none', boxSizing: 'border-box' }} />
                      {errors.email && <p style={{ fontSize: 11, color: '#EF4444', marginTop: 3 }}>{errors.email.message}</p>}
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: NAVY, marginBottom: 5, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Company *</label>
                      <input {...register('company')} style={{ width: '100%', padding: '9px 12px', border: `1px solid ${errors.company ? '#EF4444' : '#D1D5DB'}`, ...BORDER_R, fontSize: 14, color: NAVY, outline: 'none', boxSizing: 'border-box' }} />
                      {errors.company && <p style={{ fontSize: 11, color: '#EF4444', marginTop: 3 }}>{errors.company.message}</p>}
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: NAVY, marginBottom: 5, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Your Role *</label>
                      <input {...register('role')} placeholder="e.g. Chief Operating Officer, VP Strategy" style={{ width: '100%', padding: '9px 12px', border: `1px solid ${errors.role ? '#EF4444' : '#D1D5DB'}`, ...BORDER_R, fontSize: 14, color: NAVY, outline: 'none', boxSizing: 'border-box' }} />
                      {errors.role && <p style={{ fontSize: 11, color: '#EF4444', marginTop: 3 }}>{errors.role.message}</p>}
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: NAVY, marginBottom: 5, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Primary Use Case <span style={{ fontWeight: 400, color: '#9CA3AF' }}>(Optional)</span></label>
                      <textarea
                        {...register('useCase')}
                        rows={3}
                        placeholder="What strategic scenario are you most focused on? (e.g. supply chain risk, M&A readiness, regulatory response)"
                        style={{ width: '100%', padding: '9px 12px', border: '1px solid #D1D5DB', ...BORDER_R, fontSize: 13, color: NAVY, outline: 'none', boxSizing: 'border-box', resize: 'vertical', lineHeight: 1.6 }}
                      />
                    </div>

                    {mutation.isError && (
                      <div style={{ padding: '10px 14px', background: '#FEF2F2', border: '1px solid #FCA5A5', ...BORDER_R, fontSize: 12, color: '#991B1B' }}>
                        Something went wrong. Please try again or email us directly.
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={mutation.isPending}
                      style={{ ...BAR, background: NAVY, color: '#fff', border: 'none', padding: '13px 28px', fontSize: 13, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: mutation.isPending ? 'not-allowed' : 'pointer', opacity: mutation.isPending ? 0.7 : 1, ...BORDER_R, marginTop: 4 }}
                    >
                      {mutation.isPending ? 'Submitting…' : 'Request 48-Hour Evaluation Access'}
                    </button>

                    <p style={{ fontSize: 11, color: '#9CA3AF', textAlign: 'center', lineHeight: 1.6 }}>
                      Every request is reviewed personally. We prioritize organizations with a clear strategic trigger or initiative underway.
                    </p>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
