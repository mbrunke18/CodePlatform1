import { useState } from 'react';
import type { CSSProperties } from 'react';
import { useLocation } from 'wouter';
import {
  Crown, Settings2, Users2, ChevronRight, ArrowRight,
  CheckCircle2, Shield, BookOpen, Zap, Activity, BarChart3,
  Radio, Target, Lock
} from 'lucide-react';

const NAVY    = "#0A0F2E";
const NAVY_BG = "#132558";
const GOLD    = "#C9A84C";
const TEAL    = "#2B8A6E";
const CG: CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

type RoleId = 'executive' | 'admin' | 'functional';

interface Step { label: string; href: string; icon: any; why: string; }
interface Role {
  id: RoleId;
  icon: any;
  title: string;
  subtitle: string;
  accentColor: string;
  steps: Step[];
  firstHref: string;
  outcome: string;
}

const ROLES: Role[] = [
  {
    id: 'executive',
    icon: Crown,
    title: 'Executive Sponsor',
    subtitle: 'CEO · COO · Chief of Staff · Board-facing leader',
    accentColor: GOLD,
    outcome: 'Decision authority aligned. Platform thesis confirmed.',
    firstHref: '/mission-control',
    steps: [
      { label: 'Mission Control', href: '/mission-control', icon: Activity, why: 'Your top-level operating cockpit — active signals, protocol status, authorization queue.' },
      { label: 'How It Executes', href: '/how-it-executes', icon: Zap, why: 'Watch the full signal → protocol → 12-minute execution chain in motion.' },
      { label: 'Board Briefings', href: '/board-briefings', icon: BarChart3, why: 'Inspect board-ready output format — what your governance artifacts look like.' },
    ],
  },
  {
    id: 'admin',
    icon: Settings2,
    title: 'Platform Admin',
    subtitle: 'Operations lead · PMO · IT program owner',
    accentColor: TEAL,
    outcome: 'First protocol operational path configured end-to-end.',
    firstHref: '/getting-started',
    steps: [
      { label: 'Getting Started Hub', href: '/getting-started', icon: Target, why: 'Your go-live checklist — track setup progress across all 4 configuration phases.' },
      { label: 'Triggers Management', href: '/triggers-management', icon: Radio, why: 'Define what the system monitors and when it escalates to you.' },
      { label: 'Protocol Builder', href: '/protocol-builder', icon: BookOpen, why: "Create or customize readiness protocols for your org's specific scenarios." },
    ],
  },
  {
    id: 'functional',
    icon: Users2,
    title: 'Functional Lead',
    subtitle: 'Risk · Legal · Comms · Cyber · Finance · HR · Transformation',
    accentColor: '#E07B4C',
    outcome: 'Functional ownership and execution role clarity before a live event.',
    firstHref: '/playbook-library',
    steps: [
      { label: 'Protocol Library', href: '/playbook-library', icon: BookOpen, why: 'Browse 180 Readiness Protocols — find the ones that cover your domain.' },
      { label: 'Playbook Readiness', href: '/playbook-readiness', icon: Shield, why: 'Assess protocol quality across trigger coverage, stakeholder readiness, and confidence.' },
      { label: 'Practice Drills', href: '/practice-drills', icon: Zap, why: "Run a timed simulation to validate your team's execution before a real trigger fires." },
    ],
  },
];

export default function InteractiveOnboarding() {
  const [, nav] = useLocation();
  const [selected, setSelected] = useState<RoleId | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  function handleBegin() {
    const role = ROLES.find(r => r.id === selected);
    if (!role) return;
    localStorage.setItem('vm_onboard_role', selected!);
    localStorage.setItem('vm_onboard_done', 'true');
    nav(role.firstHref);
  }

  const activeRole = ROLES.find(r => r.id === selected) || null;

  return (
    <div style={{ minHeight: '100vh', background: NAVY_BG, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', position: 'relative', overflow: 'hidden' }}>

      {/* Background grid */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(201,168,76,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.07) 1px,transparent 1px)`, backgroundSize: '48px 48px', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '8%', left: '50%', transform: 'translateX(-50%)', width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle, rgba(43,138,110,0.12) 0%, transparent 65%)', pointerEvents: 'none' }} />

      {/* Top nav */}
      <div style={{ position: 'absolute', top: 20, left: 24, right: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 20 }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600, textDecoration: 'none', letterSpacing: '0.08em', background: 'rgba(0,0,0,0.2)', padding: '6px 12px', border: '1px solid rgba(255,255,255,0.08)' }}>
          ← Homepage
        </a>
        <a href="/request-access" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600, textDecoration: 'none', letterSpacing: '0.08em', background: 'rgba(0,0,0,0.2)', padding: '6px 12px', border: '1px solid rgba(255,255,255,0.08)' }}>
          Request Access →
        </a>
      </div>

      <div className="relative z-10 w-full max-w-5xl">

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
            <div style={{ width: 7, height: 7, background: GOLD }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>VaughnMartin · Readiness OS</span>
          </div>
          <h1 style={{ ...CG, fontSize: 'clamp(28px,4.5vw,52px)', fontWeight: 700, color: '#fff', lineHeight: 1.1, marginBottom: 12 }}>
            Where does your role begin?
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', maxWidth: 480, margin: '0 auto' }}>
            Select your role. We'll map your first three steps and route you directly to the right starting point.
          </p>
        </div>

        {/* Role cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: 16, marginBottom: 40 }}>
          {ROLES.map(role => {
            const Icon = role.icon;
            const isSelected = selected === role.id;
            return (
              <button
                key={role.id}
                onClick={() => setSelected(role.id)}
                style={{
                  background: isSelected ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.025)',
                  border: `1px solid ${isSelected ? role.accentColor : 'rgba(255,255,255,0.08)'}`,
                  borderTop: `3px solid ${isSelected ? role.accentColor : 'rgba(255,255,255,0.1)'}`,
                  padding: 0,
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  outline: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; }}
                onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.025)'; }}
              >
                {/* Card header */}
                <div style={{ padding: '22px 22px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                    <div style={{ padding: 10, background: `${role.accentColor}18` }}>
                      <Icon style={{ width: 20, height: 20, color: role.accentColor }} />
                    </div>
                    {isSelected && (
                      <CheckCircle2 style={{ width: 16, height: 16, color: role.accentColor, marginLeft: 'auto' }} />
                    )}
                  </div>
                  <div style={{ ...CG, fontSize: 19, fontWeight: 700, color: '#fff', marginBottom: 6 }}>
                    {role.title}
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.02em', lineHeight: 1.5 }}>
                    {role.subtitle}
                  </div>
                </div>

                {/* Steps */}
                <div style={{ padding: '16px 22px 18px', flex: 1 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 12 }}>
                    Your first 3 steps
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {role.steps.map((step, i) => {
                      const StepIcon = step.icon;
                      return (
                        <div key={step.href} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                          <div style={{ width: 20, height: 20, background: `${role.accentColor}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                            <span style={{ fontSize: 9, fontWeight: 800, color: role.accentColor }}>{i + 1}</span>
                          </div>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{step.label}</div>
                            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.38)', lineHeight: 1.5 }}>{step.why}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Expected result */}
                <div style={{ padding: '12px 22px 16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: 5 }}>Expected result</div>
                  <div style={{ fontSize: 11, color: isSelected ? role.accentColor : 'rgba(255,255,255,0.45)', fontWeight: isSelected ? 600 : 400, lineHeight: 1.5 }}>
                    {role.outcome}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* CTA row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
          <button
            disabled={!selected}
            onClick={handleBegin}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '14px 32px',
              background: selected ? (activeRole?.accentColor || GOLD) : 'rgba(255,255,255,0.08)',
              color: selected ? NAVY : 'rgba(255,255,255,0.3)',
              border: 'none',
              cursor: selected ? 'pointer' : 'not-allowed',
              fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
              transition: 'all 0.2s',
            }}
          >
            Begin {activeRole ? `as ${activeRole.title}` : 'your path'}
            <ArrowRight style={{ width: 16, height: 16 }} />
          </button>

          <a
            href="/getting-started"
            style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}
          >
            Skip to setup checklist <ChevronRight style={{ width: 12, height: 12 }} />
          </a>
        </div>

        {/* Contextual help note */}
        <div style={{ textAlign: 'center', marginTop: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Lock style={{ width: 11, height: 11, color: 'rgba(255,255,255,0.28)' }} />
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)' }}>
            Guided tours launch automatically on each page · Skip any time · Restart from the Tour button
          </span>
        </div>
      </div>
    </div>
  );
}
