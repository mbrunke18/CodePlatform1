import { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { useLocation } from 'wouter';

const NAVY = '#0A0F2E';
const GOLD = '#C9A84C';
const TEAL = '#2B8A6E';
const IVORY = '#F8F7F4';

const roles = [
  {
    id: 'sponsor',
    title: 'Executive Sponsor',
    subtitle: 'The proof-of-concept owner',
    who: 'CEO, President, or designated C-suite sponsor',
    icon: (
      <svg width={22} height={22} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
      </svg>
    ),
    color: GOLD,
    sees: [
      { label: 'Execution Intelligence Dashboard', detail: 'Real-time coordination velocity, active trigger count, and how your organization\'s speed compares to the 30-day industry baseline — expressed as the 3,600× head start.' },
      { label: 'Coordination Intelligence', detail: 'Historical activation records with timestamps proving the 12-minute standard. Board-ready AI narrative generated on demand from live activation data.' },
      { label: 'Execution History', detail: 'KPI trends across the 90-day pilot — activations completed, time-to-coordination, and the compounding ROI as more triggers are handled through the platform.' },
    ],
    owns: [
      'Go / No-Go decision authority on high-stakes activations during the pilot',
      'Success criteria sign-off — what "working" looks like at 30, 60, and 90 days',
      'Renewal decision at day 90 based on documented activation performance',
    ],
    success: 'At least 3 live activations with documented coordination time under 12 minutes. AI-generated board brief produced from real activation data. ROI case quantified and ready for the next board cycle.',
    pages: [
      { label: 'Execution Intelligence', href: '/coordination-intelligence' },
      { label: 'Execution History', href: '/execution-history' },
      { label: 'Dashboard', href: '/dashboard' },
    ],
  },
  {
    id: 'ops',
    title: 'Operational Owner',
    subtitle: 'The execution quarterback',
    who: 'COO, Chief of Staff, or SVP Operations',
    icon: (
      <svg width={22} height={22} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    color: TEAL,
    sees: [
      { label: 'Command Center', detail: 'Live view of who owns what task, what is overdue, where bottlenecks are forming, and playbook progress across all active workstreams — without a single status meeting.' },
      { label: 'Live Activation Center', detail: 'Step-by-step playbook execution in real time. Stakeholder acknowledgment tracking, task completion rate, and the live 3,600× Execution Head Start as execution progresses.' },
      { label: 'Mission Control', detail: 'Strategic overview of all active and completed scenarios — coordination timeline, escalation history, and workstream health at a glance.' },
    ],
    owns: [
      'Playbook activation decision — which playbook fires for which trigger',
      'Stakeholder assignment — who gets what task, in what sequence',
      'Escalation calls — when a task is overdue and needs to move up the chain',
      'Maintaining execution velocity — keeping the platform active across all 10 pilot users',
    ],
    success: 'Zero unacknowledged tasks beyond 15 minutes. All pilot triggers activated and resolved within the 12-minute coordination target. Full adoption across all 10 pilot users by day 45.',
    pages: [
      { label: 'Command Center', href: '/command-center' },
      { label: 'Live Activation', href: '/live-activation' },
      { label: 'Mission Control', href: '/mission-control' },
      { label: 'Playbook Library', href: '/playbook-library' },
    ],
  },
  {
    id: 'finance',
    title: 'Financial Stakeholder',
    subtitle: 'The ROI validator',
    who: 'CFO, VP Finance, or Head of Financial Planning',
    icon: (
      <svg width={22} height={22} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    color: '#7C6FD4',
    sees: [
      { label: 'Execution History & KPIs', detail: 'Coordination time trends across every activation, executive hours recovered per event, and projected annual value if the pilot performance holds at scale.' },
      { label: 'Pre-Approved Budget Allocations', detail: 'Each playbook carries pre-staged resource authorizations — no mid-crisis approval cycles. The CFO reviews and approves these ceilings before the trigger fires, not after.' },
      { label: 'ROI Benchmarks', detail: 'Side-by-side comparison of your organization\'s coordination speed vs. the 30-day industry baseline — expressed in time saved, headcount hours, and revenue-at-risk events resolved.' },
    ],
    owns: [
      'Pre-approved budget ceilings per playbook domain — set before triggers fire',
      'ROI validation at 30, 60, and 90-day pilot checkpoints',
      'Renewal business case — quantified value that justifies full enterprise rollout',
    ],
    success: 'ROI case fully documented with hard numbers: executive hours recovered per activation, coordination cost reduction vs. baseline, and at least one revenue-at-risk event resolved within the pilot window.',
    pages: [
      { label: 'Execution History', href: '/execution-history' },
      { label: 'Coordination Intelligence', href: '/coordination-intelligence' },
    ],
  },
  {
    id: 'cto',
    title: 'CTO / CIO',
    subtitle: 'The technical clearance gate',
    who: 'Chief Technology Officer, Chief Information Officer, or VP IT',
    icon: (
      <svg width={22} height={22} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" />
      </svg>
    ),
    color: '#2B8A9E',
    sees: [
      { label: 'Integration Hub', detail: 'Live status of all enterprise connections — Microsoft 365, Teams, Azure OpenAI, Salesforce, ServiceNow, and 6 additional ecosystems. Connection health, data flow direction, and authentication status in one view.' },
      { label: 'Microsoft Ecosystem Architecture', detail: 'The three-layer model: Execution OS sits above your Microsoft investment as an orchestration layer — not inside it. No new data stores. No new agents on endpoints. Authentication runs through Microsoft Entra you already license.' },
      { label: 'Settings & Security Configuration', detail: 'Role-based access control, audit logging, and organization-level configuration. Every action on the platform is logged with user, timestamp, and decision context.' },
    ],
    owns: [
      'Technical integration sign-off before pilot goes live',
      'Security review confirmation — data flows, authentication model, audit trail',
      'Ensuring zero new infrastructure requirements are introduced during the pilot',
      'Architecture documentation for any future compliance or procurement review',
    ],
    success: 'Clean integration running for the full 90-day pilot with zero security incidents. Complete audit log available for any compliance review. Architecture documentation produced that can be handed to a procurement or vendor management team for full enterprise rollout.',
    note: 'Execution OS does not replace your Microsoft stack — it orchestrates it. Every enterprise already has Microsoft\'s AI investment. None have the operating model to use it. This is that operating model layer.',
    pages: [
      { label: 'Integration Hub', href: '/integrations' },
      { label: 'Microsoft Ecosystem', href: '/ecosystem' },
      { label: 'Settings', href: '/settings' },
    ],
  },
  {
    id: 'champion',
    title: 'Internal Champion',
    subtitle: 'The adoption driver',
    who: 'Chief of Staff, Head of Strategy, or designated Pilot Coordinator',
    icon: (
      <svg width={22} height={22} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    color: '#C97B4C',
    sees: [
      { label: 'Full Platform Access', detail: 'This role has access to every section of the platform — they are the bridge between all other pilot users and the central point of contact for the VaughnMartin team.' },
      { label: 'Stakeholder Management', detail: 'Overview of all 10 pilot users — who has logged in, which roles have acknowledged their tasks, and where adoption is lagging before it becomes a problem.' },
      { label: 'Success Metrics Configuration', detail: 'The dashboard where pilot KPIs are configured, tracked, and reported. The Internal Champion owns this view and surfaces the data the Executive Sponsor needs at each 30-day checkpoint.' },
    ],
    owns: [
      'Onboarding all 10 pilot users — getting each role into the platform and active within the first two weeks',
      'Managing the 90-day pilot calendar — activation exercises, checkpoint reviews, and escalations',
      'Surfacing wins to the Executive Sponsor in real time — not waiting for the 90-day review',
      'Producing the internal case study at day 90 that makes the renewal conversation easy',
    ],
    success: 'All 10 pilot users active by day 14. At least 3 documented activation wins with timestamps and outcome records. Internal renewal case study complete and ready for the Executive Sponsor before the 90-day review.',
    pages: [
      { label: 'Platform Overview', href: '/platform-overview' },
      { label: 'Stakeholder Management', href: '/stakeholder-management' },
      { label: 'Success Metrics', href: '/success-metrics-configuration' },
      { label: 'Playbook Library', href: '/playbook-library' },
    ],
  },
];

const timeline = [
  {
    phase: 'Days 1–30',
    label: 'Foundation',
    color: TEAL,
    milestones: [
      'All 10 pilot users onboarded and active',
      'Microsoft integration configured and tested',
      'First live playbook activation completed',
      'Pre-approved budget ceilings set per domain',
      '30-day checkpoint with Executive Sponsor',
    ],
  },
  {
    phase: 'Days 31–60',
    label: 'Velocity',
    color: GOLD,
    milestones: [
      'Minimum 2 additional activations with documented outcomes',
      'Coordination time benchmarks established',
      'ROI data capture begins (hours, events, revenue protected)',
      'Internal Champion produces first activation win report',
      '60-day checkpoint — course corrections if needed',
    ],
  },
  {
    phase: 'Days 61–90',
    label: 'Proof',
    color: '#7C6FD4',
    milestones: [
      'Full activation history documented with timestamps',
      'AI-generated board brief produced from real data',
      'ROI case quantified with hard numbers',
      'Internal case study complete',
      '90-day review — renewal decision',
    ],
  },
];

export default function PilotOnboarding() {
  const [activeRole, setActiveRole] = useState('sponsor');
  const [, setLocation] = useLocation();

  const role = roles.find(r => r.id === activeRole)!;

  return (
    <PageLayout>
      <div style={{ background: IVORY, minHeight: '100vh' }}>

        {/* ── HERO ── */}
        <div style={{
          background: NAVY, padding: '64px 0 56px', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.07,
            backgroundImage: 'linear-gradient(rgba(201,168,76,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.6) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }} />
          <div style={{ position: 'absolute', top: -200, right: -200, width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(43,138,110,0.14) 0%, transparent 70%)' }} />
          <div style={{ position: 'absolute', bottom: -150, left: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.10) 0%, transparent 70%)' }} />

          <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 40px', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 3, height: 20, background: GOLD, borderRadius: 2 }} />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: 2, color: 'rgba(240,237,228,0.5)', textTransform: 'uppercase' }}>Pilot Onboarding Guide</span>
            </div>
            <h1 style={{ fontSize: 42, fontWeight: 700, color: '#F0EDE4', margin: '0 0 16px', lineHeight: 1.15, fontFamily: "'Inter', sans-serif" }}>
              Your First 90 Days<br />
              <span style={{ color: GOLD }}>Inside Execution OS</span>
            </h1>
            <p style={{ fontSize: 17, color: 'rgba(240,237,228,0.65)', maxWidth: 620, margin: '0 0 40px', lineHeight: 1.65, fontFamily: "'Inter', sans-serif" }}>
              This guide is built for your pilot team — not a generic walkthrough.
              Each role has a specific view, a specific set of decisions, and a specific
              definition of success at day 90.
            </p>

            {/* Pilot structure pills */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {[
                { label: '90-Day Pilot', icon: '◷' },
                { label: '10 Pilot Users', icon: '◈' },
                { label: 'Single Domain', icon: '◉' },
                { label: '5 Role Paths', icon: '◆' },
                { label: '12-Min Execution Target', icon: '◎' },
              ].map(p => (
                <div key={p.label} style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '7px 14px', borderRadius: 6,
                  background: 'rgba(240,237,228,0.06)',
                  border: '1px solid rgba(240,237,228,0.12)',
                }}>
                  <span style={{ color: GOLD, fontSize: 13 }}>{p.icon}</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: 1, color: 'rgba(240,237,228,0.6)', textTransform: 'uppercase' }}>{p.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── ROLE SELECTOR ── */}
        <div style={{ borderBottom: `1px solid rgba(10,15,46,0.1)`, background: '#fff', position: 'sticky', top: 0, zIndex: 50 }}>
          <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 40px', display: 'flex', gap: 0 }}>
            {roles.map(r => (
              <button
                key={r.id}
                onClick={() => setActiveRole(r.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '18px 22px', border: 'none', cursor: 'pointer',
                  background: 'transparent',
                  borderBottom: activeRole === r.id ? `3px solid ${r.color}` : '3px solid transparent',
                  color: activeRole === r.id ? NAVY : 'rgba(10,15,46,0.45)',
                  fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: activeRole === r.id ? 600 : 400,
                  transition: 'all 0.2s ease', whiteSpace: 'nowrap',
                }}
              >
                <span style={{ color: activeRole === r.id ? r.color : 'rgba(10,15,46,0.3)' }}>{r.icon}</span>
                {r.title}
              </button>
            ))}
          </div>
        </div>

        {/* ── ROLE CONTENT ── */}
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '56px 40px 80px' }}>

          {/* Role header */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 16 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 12, flexShrink: 0,
                background: `rgba(${role.color === GOLD ? '201,168,76' : role.color === TEAL ? '43,138,110' : '124,111,212'},0.12)`,
                border: `1px solid ${role.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: role.color,
              }}>
                {role.icon}
              </div>
              <div>
                <h2 style={{ fontSize: 30, fontWeight: 700, color: NAVY, margin: '0 0 4px', fontFamily: "'Inter', sans-serif" }}>{role.title}</h2>
                <p style={{ fontSize: 15, color: 'rgba(10,15,46,0.5)', margin: '0 0 6px', fontFamily: "'Inter', sans-serif" }}>{role.subtitle}</p>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '4px 12px', borderRadius: 20, background: `${role.color}14`, border: `1px solid ${role.color}25` }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: role.color, display: 'inline-block' }} />
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 1, color: role.color, textTransform: 'uppercase' }}>{role.who}</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>

            {/* What they see */}
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid rgba(10,15,46,0.09)', padding: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 22 }}>
                <div style={{ width: 3, height: 16, background: role.color, borderRadius: 2 }} />
                <h3 style={{ fontSize: 11, fontWeight: 700, color: 'rgba(10,15,46,0.4)', letterSpacing: 2, textTransform: 'uppercase', margin: 0, fontFamily: "'DM Mono', monospace" }}>What They See</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {role.sees.map((s, i) => (
                  <div key={i} style={{ paddingLeft: 14, borderLeft: `2px solid ${role.color}30` }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: NAVY, marginBottom: 4, fontFamily: "'Inter', sans-serif" }}>{s.label}</div>
                    <div style={{ fontSize: 13, color: 'rgba(10,15,46,0.55)', lineHeight: 1.6, fontFamily: "'Inter', sans-serif" }}>{s.detail}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* What they own */}
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid rgba(10,15,46,0.09)', padding: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 22 }}>
                <div style={{ width: 3, height: 16, background: role.color, borderRadius: 2 }} />
                <h3 style={{ fontSize: 11, fontWeight: 700, color: 'rgba(10,15,46,0.4)', letterSpacing: 2, textTransform: 'uppercase', margin: 0, fontFamily: "'DM Mono', monospace" }}>What They Own</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {role.owns.map((o, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: role.color, flexShrink: 0, marginTop: 6 }} />
                    <span style={{ fontSize: 13, color: 'rgba(10,15,46,0.65)', lineHeight: 1.6, fontFamily: "'Inter', sans-serif" }}>{o}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Success at 90 days */}
          <div style={{ background: NAVY, borderRadius: 12, padding: 28, marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: `radial-gradient(circle, ${role.color}18 0%, transparent 70%)` }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, position: 'relative' }}>
              <div style={{ width: 3, height: 16, background: role.color, borderRadius: 2 }} />
              <h3 style={{ fontSize: 11, fontWeight: 700, color: 'rgba(240,237,228,0.4)', letterSpacing: 2, textTransform: 'uppercase', margin: 0, fontFamily: "'DM Mono', monospace" }}>Success at Day 90</h3>
            </div>
            <p style={{ fontSize: 15, color: '#F0EDE4', lineHeight: 1.7, margin: 0, fontFamily: "'Inter', sans-serif", position: 'relative' }}>{role.success}</p>
          </div>

          {/* Note if applicable */}
          {role.note && (
            <div style={{ background: `${role.color}10`, border: `1px solid ${role.color}25`, borderRadius: 10, padding: '16px 20px', marginBottom: 24 }}>
              <p style={{ fontSize: 13, color: NAVY, margin: 0, lineHeight: 1.65, fontFamily: "'Inter', sans-serif" }}>
                <strong>Note:</strong> {role.note}
              </p>
            </div>
          )}

          {/* Key pages */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 1.5, color: 'rgba(10,15,46,0.35)', textTransform: 'uppercase' }}>Key Pages</span>
            {role.pages.map(p => (
              <button
                key={p.href}
                onClick={() => setLocation(p.href)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '6px 14px', borderRadius: 6, cursor: 'pointer',
                  background: '#fff', border: `1px solid rgba(10,15,46,0.12)`,
                  fontFamily: "'Inter', sans-serif", fontSize: 12, color: NAVY, fontWeight: 500,
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = role.color;
                  (e.currentTarget as HTMLButtonElement).style.color = role.color;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(10,15,46,0.12)';
                  (e.currentTarget as HTMLButtonElement).style.color = NAVY;
                }}
              >
                {p.label}
                <svg width={12} height={12} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* ── 90-DAY TIMELINE ── */}
        <div style={{ background: '#fff', borderTop: '1px solid rgba(10,15,46,0.07)', padding: '56px 0' }}>
          <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 40px' }}>
            <div style={{ marginBottom: 36 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 3, height: 18, background: GOLD, borderRadius: 2 }} />
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: 2, color: 'rgba(10,15,46,0.4)', textTransform: 'uppercase' }}>Pilot Timeline</span>
              </div>
              <h2 style={{ fontSize: 26, fontWeight: 700, color: NAVY, margin: 0, fontFamily: "'Inter', sans-serif" }}>What Happens Across 90 Days</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {timeline.map((t, i) => (
                <div key={i} style={{ background: IVORY, borderRadius: 12, padding: 24, border: `1px solid rgba(10,15,46,0.07)`, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: t.color, borderRadius: '12px 12px 0 0' }} />
                  <div style={{ marginBottom: 6 }}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 1.5, color: t.color, textTransform: 'uppercase' }}>{t.phase}</span>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: NAVY, marginBottom: 16, fontFamily: "'Inter', sans-serif" }}>{t.label}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {t.milestones.map((m, j) => (
                      <div key={j} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <div style={{ width: 16, height: 16, borderRadius: '50%', background: `${t.color}15`, border: `1px solid ${t.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                          <span style={{ fontSize: 8, color: t.color, fontWeight: 700 }}>{j + 1}</span>
                        </div>
                        <span style={{ fontSize: 12, color: 'rgba(10,15,46,0.65)', lineHeight: 1.5, fontFamily: "'Inter', sans-serif" }}>{m}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── CLOSING CTA ── */}
        <div style={{ background: NAVY, padding: '56px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.06, backgroundImage: 'linear-gradient(rgba(201,168,76,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.8) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
          <div style={{ position: 'relative', maxWidth: 600, margin: '0 auto' }}>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: 2, color: 'rgba(240,237,228,0.4)', textTransform: 'uppercase', marginBottom: 16 }}>Questions During Your Pilot</p>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: '#F0EDE4', margin: '0 0 14px', fontFamily: "'Inter', sans-serif" }}>Your VaughnMartin team is your co-pilot.</h2>
            <p style={{ fontSize: 15, color: 'rgba(240,237,228,0.55)', margin: '0 0 32px', lineHeight: 1.65, fontFamily: "'Inter', sans-serif" }}>
              Every pilot has a dedicated success lead. Reach them directly at{' '}
              <a href="mailto:pilot@vaughnmartin.com" style={{ color: GOLD, textDecoration: 'none' }}>pilot@vaughnmartin.com</a>
            </p>
            <button
              onClick={() => setLocation('/platform-overview')}
              style={{
                padding: '12px 28px', borderRadius: 8, cursor: 'pointer',
                background: GOLD, border: 'none',
                fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600, color: NAVY,
              }}
            >
              Explore the Full Platform
            </button>
          </div>
        </div>

      </div>
    </PageLayout>
  );
}
