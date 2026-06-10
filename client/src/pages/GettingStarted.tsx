import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useRef, useEffect, useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import OnboardingRail from '@/components/onboarding/OnboardingRail';
import {
  CheckCircle2, Circle, ArrowRight, ChevronRight, AlertTriangle,
  Building2, Users, Shield, Rocket, Globe, Phone, Mail, Clock,
  DollarSign, Target, Zap, Radio, BookOpen, ClipboardList, Lock,
  RotateCcw, Save,
} from 'lucide-react';

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const OFF = "#F8F7F4";
const BORDER = "#E8E4DC";
const MUTED = "#6B7280";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

function Check({ done, partial }: { done: boolean; partial?: boolean }) {
  if (done) return <CheckCircle2 size={16} color={TEAL} style={{ flexShrink: 0 }} />;
  if (partial) return <AlertTriangle size={16} color={GOLD} style={{ flexShrink: 0 }} />;
  return <Circle size={16} color="#D1D5DB" style={{ flexShrink: 0 }} />;
}

function PhaseBar({ pct }: { pct: number }) {
  return (
    <div style={{ height: 3, background: BORDER, borderRadius: 0, overflow: 'hidden', marginBottom: 20 }}>
      <div style={{ height: '100%', width: `${pct}%`, background: pct === 100 ? TEAL : GOLD, transition: 'width 0.5s ease' }} />
    </div>
  );
}

function Item({ done, label, sub, href, partial }: { done: boolean; label: string; sub?: string; href?: string; partial?: boolean }) {
  const [, nav] = useLocation();
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '10px 0', borderBottom: `1px solid ${BORDER}` }}>
      <Check done={done} partial={partial} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: done ? MUTED : NAVY, textDecoration: done ? 'none' : 'none' }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{sub}</div>}
      </div>
      {!done && href && (
        <button onClick={() => nav(href)} style={{ fontSize: 11, fontWeight: 700, color: GOLD, background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 4 }}>
          Fix this <ChevronRight size={12} />
        </button>
      )}
      {done && <div style={{ fontSize: 11, fontWeight: 700, color: TEAL }}>Done</div>}
    </div>
  );
}

function PhaseCard({
  num, title, timing, doing, score, children, cta, ctaHref, locked, phaseRef,
}: {
  num: string; title: string; timing: string; doing: string; score: number;
  children: React.ReactNode; cta?: string; ctaHref?: string; locked?: boolean;
  phaseRef?: React.RefObject<HTMLDivElement>;
}) {
  const [, nav] = useLocation();
  const isComplete = score === 100;
  return (
    <div ref={phaseRef} style={{
      background: '#fff', border: `1px solid ${BORDER}`, borderLeft: `4px solid ${isComplete ? TEAL : score > 0 ? GOLD : '#E5E7EB'}`,
      marginBottom: 16, opacity: locked ? 0.55 : 1,
    }}>
      <div style={{ padding: '24px 28px 8px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div style={{
            width: 40, height: 40, background: isComplete ? TEAL : score > 0 ? `rgba(201,168,76,0.12)` : OFF,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            {isComplete
              ? <CheckCircle2 size={20} color="#fff" />
              : locked ? <Lock size={16} color={MUTED} />
              : <span style={{ ...CG, fontSize: 20, fontWeight: 600, color: score > 0 ? GOLD : '#9CA3AF' }}>{num}</span>
            }
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: NAVY }}>{title}</div>
            <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{timing} · {doing}</div>
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: isComplete ? TEAL : score > 0 ? GOLD : '#D1D5DB', ...CG }}>{score}%</div>
          <div style={{ fontSize: 10, color: MUTED, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Complete</div>
        </div>
      </div>
      <div style={{ padding: '4px 28px 20px' }}>
        <PhaseBar pct={score} />
        {children}
        {cta && ctaHref && !isComplete && !locked && (
          <button onClick={() => nav(ctaHref)} style={{
            marginTop: 16, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px',
            background: NAVY, color: '#fff', border: 'none', cursor: 'pointer',
            fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>
            {cta} <ArrowRight size={14} />
          </button>
        )}
        {isComplete && (
          <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle2 size={14} color={TEAL} />
            <span style={{ fontSize: 12, fontWeight: 700, color: TEAL }}>Phase complete</span>
            <span style={{ fontSize: 11, color: MUTED }}>— continue to the next phase below</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function GettingStarted() {
  const [, nav] = useLocation();
  const phaseRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
  const [showResumeBanner, setShowResumeBanner] = useState(false);
  const [resumePhase, setResumePhase] = useState(1);
  const [lastSavedLabel, setLastSavedLabel] = useState<string | null>(null);

  const { data: orgs } = useQuery<any[]>({ queryKey: ['/api/organizations'] });
  const { data: user } = useQuery<any>({ queryKey: ['/api/auth/user'] });
  const { data: departments } = useQuery<any[]>({ queryKey: ['/api/config/departments'], enabled: !!user });
  const { data: escalationPolicies } = useQuery<any[]>({ queryKey: ['/api/config/escalation-policies'], enabled: !!user });
  const { data: channels } = useQuery<any[]>({ queryKey: ['/api/config/communication-channels'], enabled: !!user });

  const org = Array.isArray(orgs) ? orgs[0] : null;
  const settings = org?.settings || {};
  const ideaConfig = settings.ideaConfig || {};
  const orgProfile = settings.orgProfile || {};
  const playbookSettings = settings.playbooks || {};

  const domainOwners: any[] = ideaConfig.domainOwners || [];
  const ownersWithName = domainOwners.filter((d: any) => d.owner?.trim());
  const ownersWithEmail = domainOwners.filter((d: any) => d.email?.trim());
  const ownersWithMobile = domainOwners.filter((d: any) => d.mobile?.trim());
  const ownersWithBackup = domainOwners.filter((d: any) => d.backup?.trim());
  const protocolsSelected: string[] = playbookSettings.selected || [];
  const deptCount = (departments || []).length;
  const escalationCount = (escalationPolicies || []).length;
  const channelCount = (channels || []).length;

  const stakeholderCount = ownersWithName.length;

  const testDriveComplete = typeof window !== 'undefined' && !!localStorage.getItem('vm_test_drive_completed');
  const drillComplete = typeof window !== 'undefined' && !!localStorage.getItem('vm_drill_completed');
  const drillDebriefed = typeof window !== 'undefined' && !!localStorage.getItem('vm_drill_debriefed');

  const c = {
    // Phase 1 — Foundation
    companyName: !!org?.name,
    industry: !!org?.industry,
    employeeCount: !!org?.size,
    companyType: !!orgProfile.companyType,
    primaryMarkets: (orgProfile.primaryMarkets || []).length > 0,
    executiveSponsor: !!ideaConfig.executiveSponsor?.trim(),
    pmoContact: !!ideaConfig.pmoContact?.trim(),
    domainOwnersNamed: ownersWithName.length >= 5,
    domainOwnerEmails: ownersWithEmail.length >= 4,
    domainOwnerMobiles: ownersWithMobile.length >= 3,
    backupOwners: ownersWithBackup.length >= 3,
    protocolsSelected: protocolsSelected.length >= 3,
    executionTarget: !!ideaConfig.responseTarget,
    budgetThreshold: !!ideaConfig.budgetThreshold,
    approvalConfig: ideaConfig.approvalRequired !== undefined,
    // Phase 2 — Org Structure
    departments3: deptCount >= 3,
    stakeholders: stakeholderCount >= 3 || (ownersWithName.length >= 3 && ownersWithEmail.length >= 3 && ownersWithMobile.length >= 3),
    escalation: escalationCount >= 1,
    channels: channelCount >= 1,
    channels2: channelCount >= 2,
    // Phase 3 — Protocol Readiness
    signalMonitoring: true,
    protocolReviewed: protocolsSelected.length > 0,
    riskThresholdsSet: !!ideaConfig.budgetThreshold,
    // Phase 4 — Validation
    testDrive: testDriveComplete,
    drill: drillComplete,
    drillDebrief: drillDebriefed,
    teamInvited: false,
  };

  const p1Items = ['companyName', 'industry', 'employeeCount', 'companyType', 'primaryMarkets', 'executiveSponsor', 'pmoContact', 'domainOwnersNamed', 'domainOwnerEmails', 'domainOwnerMobiles', 'backupOwners', 'protocolsSelected', 'executionTarget', 'budgetThreshold', 'approvalConfig'];
  const p2Items = ['departments3', 'escalation', 'channels'];
  const p3Items = ['signalMonitoring', 'protocolReviewed', 'riskThresholdsSet'];
  const p4Items = ['testDrive', 'drill', 'drillDebrief'];

  const score = (keys: string[]) => Math.round(keys.filter(k => c[k as keyof typeof c]).length / keys.length * 100);
  const p1 = score(p1Items);
  const p2 = score(p2Items);
  const p3 = score(p3Items);
  const p4 = score(p4Items);

  const criticalKeys = ['companyName', 'industry', 'executiveSponsor', 'domainOwnersNamed', 'domainOwnerEmails', 'protocolsSelected', 'departments3', 'escalation', 'channels', 'signalMonitoring'];
  const overallScore = Math.round(criticalKeys.filter(k => c[k as keyof typeof c]).length / criticalKeys.length * 100);
  const isLive = overallScore >= 90;

  const orgName = org?.name || user?.firstName ? `${user?.firstName}'s Org` : 'Your Organization';

  const activePhase = p1 < 100 ? 1 : p2 < 100 ? 2 : p3 < 100 ? 3 : 4;

  useEffect(() => {
    const LS_KEY = 'vm_getting_started_last_visit';
    const prev = localStorage.getItem(LS_KEY);
    if (prev) {
      const ms = Date.now() - parseInt(prev, 10);
      const mins = Math.floor(ms / 60000);
      const hrs = Math.floor(mins / 60);
      const days = Math.floor(hrs / 24);
      let label = 'just now';
      if (days > 0) label = `${days} day${days > 1 ? 's' : ''} ago`;
      else if (hrs > 0) label = `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
      else if (mins >= 5) label = `${mins} minutes ago`;
      if (mins >= 5) {
        setResumePhase(activePhase);
        setShowResumeBanner(true);
      }
      setLastSavedLabel(label);
    }
    localStorage.setItem(LS_KEY, String(Date.now()));
  }, []);

  const scrollToPhase = (phase: number) => {
    const ref = phaseRefs[phase - 1];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setShowResumeBanner(false);
  };

  return (
    <PageLayout>
      {/* Resume banner */}
      {showResumeBanner && (
        <div style={{ background: GOLD, padding: '12px 48px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <RotateCcw size={14} color={NAVY} />
          <span style={{ fontSize: 13, fontWeight: 600, color: NAVY, flex: 1 }}>
            Welcome back — your setup progress was saved automatically. You were working on Phase {resumePhase}.
          </span>
          <button
            onClick={() => scrollToPhase(resumePhase)}
            style={{ padding: '6px 18px', background: NAVY, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6, borderRadius: '0.15rem' }}
          >
            Resume Phase {resumePhase} <ChevronRight size={12} />
          </button>
          <button onClick={() => setShowResumeBanner(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: NAVY, opacity: 0.6, fontSize: 18, lineHeight: 1, padding: 0 }}>×</button>
        </div>
      )}

      {/* Header */}
      <div style={{ background: NAVY, padding: '48px 48px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)`, backgroundSize: '44px 44px' }} />
        <div style={{ position: 'absolute', top: -100, right: -60, width: 500, height: 500, background: 'radial-gradient(ellipse,rgba(43,138,110,0.1) 0%,transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 32 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 24, height: 2, background: 'rgba(255,255,255,0.2)' }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>Readiness OS — Setup</span>
                {lastSavedLabel && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, marginLeft: 12, fontSize: 10, color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
                    <Save size={10} />
                    Progress saved {lastSavedLabel}
                  </span>
                )}
              </div>
              <h1 style={{ ...CG, fontSize: 'clamp(32px,4vw,52px)', fontWeight: 600, color: '#fff', lineHeight: 1.05, marginBottom: 10 }}>
                {isLive ? <>You're <em style={{ color: TEAL }}>Live.</em></> : <>Your Path to <em style={{ color: GOLD }}>Live Execution.</em></>}
              </h1>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', maxWidth: 540, lineHeight: 1.75 }}>
                {isLive
                  ? `${orgName} is fully configured. When a trigger fires, execution begins in 12 minutes.`
                  : 'Complete the four phases below to configure Readiness OS for your organization. Every field you fill unlocks faster, more precise execution when a trigger fires.'}
              </p>
            </div>

            {/* Score ring */}
            <div style={{ flexShrink: 0, textAlign: 'center', padding: '16px 28px', border: `1px solid ${isLive ? 'rgba(43,138,110,0.4)' : 'rgba(201,168,76,0.3)'}`, background: isLive ? 'rgba(43,138,110,0.1)' : 'rgba(201,168,76,0.06)' }}>
              <div style={{ ...CG, fontSize: 54, fontWeight: 700, color: isLive ? '#4ADE80' : GOLD, lineHeight: 1 }}>{overallScore}%</div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginTop: 4 }}>Go-Live Readiness</div>
              {isLive && (
                <div style={{ marginTop: 10, fontSize: 11, fontWeight: 700, color: '#4ADE80', display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'center' }}>
                  <div style={{ width: 6, height: 6, background: '#4ADE80', borderRadius: '50%' }} />
                  SYSTEM ACTIVE
                </div>
              )}
            </div>
          </div>

          {/* Phase progress strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, marginTop: 40, background: 'rgba(255,255,255,0.06)' }}>
            {[
              { label: 'Phase 1', title: 'Foundation', pct: p1 },
              { label: 'Phase 2', title: 'Org Structure', pct: p2 },
              { label: 'Phase 3', title: 'Readiness', pct: p3 },
              { label: 'Phase 4', title: 'Validation', pct: p4 },
            ].map((ph, i) => (
              <div key={i} style={{ padding: '14px 20px', background: 'rgba(10,15,46,0.4)' }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>{ph.label}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{ph.title}</div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${ph.pct}%`, background: ph.pct === 100 ? TEAL : GOLD }} />
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: ph.pct === 100 ? '#4ADE80' : GOLD, marginTop: 4 }}>{ph.pct}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CxO Execution Chain */}
      <div style={{ background: '#F0EDE4', borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', borderLeft: `1px solid ${BORDER}` }}>
          {[
            { step: 'DETECT', label: 'Signals monitored continuously', sub: '231 triggers · 248+ data points', color: TEAL },
            { step: 'COORDINATE', label: 'Stakeholders & tasks staged automatically', sub: 'Roles, budgets, comms — pre-staged', color: GOLD },
            { step: 'EXECUTE', label: 'Executive authorizes — response deploys', sub: '12-minute activation window', color: GOLD },
            { step: 'LEARN', label: 'Every activation improves the next', sub: 'ADVANCE phase closes the loop', color: TEAL },
          ].map(({ step, label, sub, color }) => (
            <div key={step} style={{ padding: '14px 24px', borderRight: `1px solid ${BORDER}` }}>
              <div style={{ fontSize: 9, fontWeight: 800, color, letterSpacing: '0.18em', fontFamily: "'Barlow Condensed', sans-serif", marginBottom: 3 }}>{step}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: NAVY, lineHeight: 1.35, marginBottom: 2 }}>{label}</div>
              <div style={{ fontSize: 10, color: '#6B7280' }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* User Guide callout */}
      <div style={{ background: '#fff', borderBottom: `1px solid ${BORDER}`, padding: '14px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <BookOpen size={15} color={TEAL} />
            <span style={{ fontSize: 13, color: MUTED }}>
              <strong style={{ color: NAVY }}>New to Readiness OS?</strong> The complete User Guide covers every feature, concept, and workflow — from first login to super user.
            </span>
          </div>
          <button
            onClick={() => nav('/user-guide')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px', background: 'transparent', border: `1px solid ${TEAL}`, color: TEAL, borderRadius: '0.15rem', cursor: 'pointer', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', flexShrink: 0 }}
          >
            Read the User Guide <ChevronRight size={12} />
          </button>
        </div>
      </div>

      <OnboardingRail
        currentStage={overallScore < 34 ? 1 : overallScore < 67 ? 2 : overallScore < 100 ? 3 : 4}
        showMissionCard={!isLive}
      />

      {/* Body */}
      <div style={{ background: OFF, minHeight: '100vh' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 48px 80px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32, alignItems: 'start' }}>

          {/* Left: Phase checklists */}
          <div>

            {/* PHASE 1 */}
            <PhaseCard num="01" title="Foundation" timing="~20 minutes" doing="You complete this" score={p1} cta="Open Setup Wizard" ctaHref="/onboarding-wizard" phaseRef={phaseRefs[0]}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: MUTED, marginBottom: 8 }}>Organization Profile</div>
              <Item done={c.companyName} label="Company name" sub={org?.name || undefined} href="/onboarding-wizard" />
              <Item done={c.industry} label="Industry vertical" sub={org?.industry || undefined} href="/onboarding-wizard" />
              <Item done={c.employeeCount} label="Employee count" sub={org?.size ? `${org.size.toLocaleString()} employees` : undefined} href="/onboarding-wizard" />
              <Item done={c.companyType} label="Company type — Public or Private" sub="Determines disclosure and regulatory obligations" href="/onboarding-wizard" />
              <Item done={c.primaryMarkets} label="Primary markets and regions" sub="Determines which regulatory bodies and triggers apply" href="/onboarding-wizard" />

              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: MUTED, margin: '20px 0 8px' }}>Decision Rights — IDEA Framework</div>
              <Item done={c.executiveSponsor} label="Executive sponsor named" sub={ideaConfig.executiveSponsor || 'The C-suite owner of Readiness OS outcomes'} href="/onboarding-wizard" />
              <Item done={c.pmoContact} label="PMO / program lead named" sub={ideaConfig.pmoContact || 'The operational owner of day-to-day readiness'} href="/onboarding-wizard" />
              <Item done={c.domainOwnersNamed} label={`Domain owners named — ${ownersWithName.length} of 6 domains`} sub="Who owns each response domain when a trigger fires" href="/onboarding-wizard" partial={ownersWithName.length > 0 && ownersWithName.length < 6} />
              <Item done={c.domainOwnerEmails} label={`Domain owner emails — ${ownersWithEmail.length} of 6`} sub="Required to reach owners within the 12-minute window" href="/onboarding-wizard" partial={ownersWithEmail.length > 0 && ownersWithEmail.length < 6} />
              <Item done={c.domainOwnerMobiles} label={`Domain owner mobile numbers — ${ownersWithMobile.length} of 6`} sub="Email alone is too slow — mobile is the 12-minute channel" href="/onboarding-wizard" partial={ownersWithMobile.length > 0 && ownersWithMobile.length < 6} />
              <Item done={c.backupOwners} label={`Backup owners designated — ${ownersWithBackup.length} of 6`} sub="If a domain owner is unavailable when the trigger fires" href="/onboarding-wizard" partial={ownersWithBackup.length > 0 && ownersWithBackup.length < 6} />

              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: MUTED, margin: '20px 0 8px' }}>Priority Configuration</div>
              <Item done={c.protocolsSelected} label={`Priority protocols selected — ${protocolsSelected.length} of 9 domains`} sub="Pins your highest-risk scenarios to the top of your console" href="/onboarding-wizard" partial={protocolsSelected.length > 0 && protocolsSelected.length < 3} />
              <Item done={c.executionTarget} label="Target execution time set" sub={ideaConfig.responseTarget ? `${ideaConfig.responseTarget} minutes trigger-to-execution` : 'Default is 12 minutes'} href="/onboarding-wizard" />
              <Item done={c.budgetThreshold} label="Pre-approved budget threshold" sub={ideaConfig.budgetThreshold ? `$${parseInt(ideaConfig.budgetThreshold).toLocaleString()} per activation — no additional approval required` : 'Eliminates budget delays during activation'} href="/onboarding-wizard" />
              <Item done={c.approvalConfig} label="Approval requirements configured" sub="Human approval before every activation — AI recommends, executives authorize" href="/onboarding-wizard" />
            </PhaseCard>

            {/* PHASE 2 */}
            <PhaseCard num="02" title="Organization Structure" timing="30–60 minutes" doing="You + your team" score={p2} cta="Open Organization Setup" ctaHref="/organization-setup" phaseRef={phaseRefs[1]}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: MUTED, marginBottom: 8 }}>Team Structure</div>
              <Item done={c.departments3} label={`Departments configured — ${deptCount} added`} sub="Minimum 3 departments for routing and task assignment" href="/organization-setup" partial={deptCount > 0 && deptCount < 3} />
              <Item done={c.stakeholders} label="Executives added with full contact details" sub={`Name, email, mobile, role — ${stakeholderCount > 0 ? stakeholderCount + ' added' : (ownersWithEmail.length + ' domain owners with email')}`} href="/organization-setup" partial={!c.stakeholders && (stakeholderCount > 0 || ownersWithEmail.length > 0)} />

              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: MUTED, margin: '20px 0 8px' }}>Response Governance</div>
              <Item done={c.escalation} label={`Escalation policy configured — ${escalationCount} policy${escalationCount !== 1 ? 'ies' : ''}`} sub="What happens if a domain owner doesn't respond in time" href="/organization-setup" />
              <Item done={c.channels} label={`Communication channels connected — ${channelCount} channel${channelCount !== 1 ? 's' : ''}`} sub="Email, Slack, MS Teams, or webhook — how the system reaches your team" href="/organization-setup" partial={channelCount === 1} />
              <Item done={c.channels2} label="At least 2 channels configured" sub="Redundancy ensures delivery when primary channel is unavailable" href="/organization-setup" partial={channelCount === 1} />
            </PhaseCard>

            {/* PHASE 3 */}
            <PhaseCard num="03" title="Protocol Readiness" timing="Week 2 — ongoing" doing="Executive team + domain owners" score={p3} phaseRef={phaseRefs[2]}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: MUTED, marginBottom: 8 }}>Signal Monitoring</div>
              <Item done={c.signalMonitoring} label="Signal monitoring active" sub="231 triggers scanned across 8 sources every 15 minutes — always on" />

              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: MUTED, margin: '20px 0 8px' }}>Call Sheet Build — Situation Matrix Builder</div>

              {/* Matrix Builder callout */}
              <div style={{ background: `rgba(43,138,110,0.06)`, border: `1px solid rgba(43,138,110,0.2)`, borderLeft: `3px solid ${TEAL}`, padding: '14px 16px', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: NAVY, marginBottom: 3 }}>Build your first call sheet</div>
                    <div style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.6 }}>
                      Use the Situation Matrix Builder to pre-stage a role × situation call sheet for your highest-priority trigger. Every role. Every scenario variant. Every responsibility defined before the trigger fires.
                    </div>
                  </div>
                  <button
                    onClick={() => nav('/situation-matrix-builder')}
                    style={{ flexShrink: 0, padding: '8px 14px', background: NAVY, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' as const, borderRadius: '0.15rem' }}
                  >
                    Build Call Sheet <ChevronRight size={12} />
                  </button>
                </div>
              </div>

              <Item done={c.protocolReviewed} label={`Priority protocols selected — ${protocolsSelected.length} domains`} sub="Your top trigger scenarios have published call sheets ready" href="/situation-matrix-builder" />
              <Item done={c.riskThresholdsSet} label="Budget authority defined per activation" sub="Eliminates the most common cause of execution delay — funding approval" href="/onboarding-wizard" />

              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: MUTED, margin: '20px 0 8px' }}>30-Day Preparation Arc</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${BORDER}` }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>View the full 30-day preparation journey</div>
                  <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>Week-by-week arc from Installation to Go-Live — with task-level detail and direct links to each tool</div>
                </div>
                <button
                  onClick={() => nav('/preparation-arc')}
                  style={{ fontSize: 11, fontWeight: 700, color: GOLD, background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' as const, display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  View Arc <ChevronRight size={12} />
                </button>
              </div>
            </PhaseCard>

            {/* PHASE 4 */}
            <PhaseCard num="04" title="Validation" timing="Week 3–4" doing="Your executive team" score={p4} locked={p1 < 50 || p2 < 67} phaseRef={phaseRefs[3]}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: MUTED, marginBottom: 8 }}>Proof of Readiness</div>
              <Item done={c.testDrive} label="12-Minute Test Drive completed" sub="Runs a live scenario end-to-end — verifies timing, routing, and task assignment" href="/12-minute-experience" />
              <Item done={c.drill} label="Practice drill completed" sub="Full team activation simulation — reveals gaps before a real trigger fires" href="/practice-drills" />
              <Item done={c.drillDebrief} label="Post-drill debrief recorded" sub="Captures what worked, what failed, and protocol changes needed" href="/practice-drills" partial={c.drill && !c.drillDebrief} />
              <Item done={c.teamInvited} label="Executive team invited to platform" sub="Every domain owner needs platform access before you go live" href="/settings" />
            </PhaseCard>
          </div>

          {/* Right rail */}
          <div style={{ position: 'sticky', top: 24 }}>

            {/* Go Live block */}
            <div style={{ background: isLive ? TEAL : NAVY, padding: '24px 22px', marginBottom: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>
                {isLive ? 'Status' : 'Go-Live Readiness'}
              </div>
              <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: '#fff', lineHeight: 1.1, marginBottom: 8 }}>
                {isLive ? 'Live and monitoring.' : `${10 - criticalKeys.filter(k => c[k as keyof typeof c]).length} items to complete.`}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, marginBottom: 20 }}>
                {isLive
                  ? 'Readiness OS is configured and monitoring for your priority triggers. Execution will begin in 12 minutes when a situation presents itself.'
                  : 'Complete the critical items across all four phases to activate the 12-minute execution guarantee.'}
              </div>
              {!isLive && (
                <button onClick={() => nav('/onboarding-wizard')} style={{ width: '100%', padding: '12px 0', background: GOLD, color: NAVY, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  Continue Setup <ArrowRight size={14} />
                </button>
              )}
            </div>

            {/* Critical missing items */}
            {!isLive && (
              <div style={{ background: '#fff', border: `1px solid ${BORDER}`, padding: '20px 20px', marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: NAVY, marginBottom: 14 }}>Critical Missing Items</div>
                {[
                  { key: 'domainOwnerEmails', label: 'Domain owner emails', href: '/onboarding-wizard', icon: Mail },
                  { key: 'domainOwnerMobiles', label: 'Domain owner mobile numbers', href: '/onboarding-wizard', icon: Phone },
                  { key: 'departments3', label: '3+ departments configured', href: '/organization-setup', icon: Building2 },
                  { key: 'escalation', label: 'Escalation policy set', href: '/organization-setup', icon: Shield },
                  { key: 'channels', label: 'Communication channel connected', href: '/organization-setup', icon: Radio },
                  { key: 'companyType', label: 'Company type (public/private)', href: '/onboarding-wizard', icon: Building2 },
                  { key: 'primaryMarkets', label: 'Primary markets/regions', href: '/onboarding-wizard', icon: Globe },
                ].filter(item => !c[item.key as keyof typeof c]).slice(0, 5).map(item => {
                  const Icon = item.icon;
                  return (
                    <div key={item.key} onClick={() => nav(item.href)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: `1px solid ${BORDER}`, cursor: 'pointer' }}>
                      <Icon size={13} color={GOLD} />
                      <span style={{ fontSize: 12, color: NAVY, fontWeight: 500, flex: 1 }}>{item.label}</span>
                      <ChevronRight size={12} color={MUTED} />
                    </div>
                  );
                })}
              </div>
            )}

            {/* What's already working */}
            <div style={{ background: '#fff', border: `1px solid ${BORDER}`, padding: '20px 20px', marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: NAVY, marginBottom: 14 }}>Already Working</div>
              {[
                { label: '180 Readiness Protocols', sub: 'Pre-staged, ready to activate', icon: ClipboardList },
                { label: '231 triggers monitored', sub: 'Scanning every 15 minutes', icon: Radio },
                { label: 'Signal scoring active', sub: 'LOW / MEDIUM / HIGH risk levels', icon: Zap },
                { label: 'Executive approval flow', sub: 'No protocol activates without sign-off', icon: Shield },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '8px 0', borderBottom: i < 3 ? `1px solid ${BORDER}` : 'none' }}>
                    <div style={{ width: 26, height: 26, background: `rgba(43,138,110,0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={12} color={TEAL} />
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: NAVY }}>{item.label}</div>
                      <div style={{ fontSize: 10, color: MUTED }}>{item.sub}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick links */}
            <div style={{ background: '#fff', border: `1px solid ${BORDER}`, padding: '20px 20px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: NAVY, marginBottom: 14 }}>Quick Actions</div>
              {[
                { label: 'Setup Wizard', href: '/onboarding-wizard', icon: Target },
                { label: 'Organization Setup', href: '/organization-setup', icon: Building2 },
                { label: 'Situation Matrix Builder', href: '/situation-matrix-builder', icon: Radio },
                { label: 'Build a Protocol', href: '/build-protocol', icon: BookOpen },
                { label: '30-Day Preparation Arc', href: '/preparation-arc', icon: Rocket },
                { label: 'Protocol Library', href: '/playbooks', icon: ClipboardList },
                { label: '12-Minute Test Drive', href: '/12-minute-experience', icon: Zap },
              ].map((link, i) => {
                const Icon = link.icon;
                return (
                  <button key={i} onClick={() => nav(link.href)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', border: 'none', background: 'transparent', cursor: 'pointer', borderBottom: i < 5 ? `1px solid ${BORDER}` : 'none', textAlign: 'left' }}>
                    <Icon size={13} color={TEAL} />
                    <span style={{ fontSize: 12, fontWeight: 500, color: NAVY }}>{link.label}</span>
                    <ChevronRight size={11} color={MUTED} style={{ marginLeft: 'auto' }} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── READINESS PLANNING SPRINT — Gates ── */}
      <section style={{ background: NAVY, padding: '64px 48px', borderTop: '1px solid rgba(201,168,76,0.15)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 28, height: 2, background: GOLD }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase' as const, color: GOLD }}>Readiness Planning Sprint</span>
            <div style={{ width: 28, height: 2, background: GOLD }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
            <div>
              <h2 style={{ ...CG, fontSize: 'clamp(24px,3vw,34px)', fontWeight: 700, color: '#fff', lineHeight: 1.2, marginBottom: 16 }}>
                Redirect Part of Your Annual Planning Cycle — Not All of It
              </h2>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, marginBottom: 16 }}>
                Your organization already has the offseason — it is called annual planning. Budget cycles. Q4 roadmap sessions. Executive time carved out specifically to prepare for what is coming. The calendar already exists. The Readiness Planning Sprint redirects 15–20% of that existing window toward pre-staging responses to situations that were not on the roadmap but will arrive anyway.
              </p>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, marginBottom: 24 }}>
                This is not new budget. It is not new time. It is a redirect of preparation capacity toward the category of situations that your planning cycle has never addressed — until now.
              </p>
              <div style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', borderLeft: `3px solid ${GOLD}`, padding: '18px 20px' }}>
                <p style={{ fontSize: 13, fontStyle: 'italic', color: 'rgba(255,255,255,0.75)', lineHeight: 1.65, margin: 0 }}>
                  "In your last annual planning cycle, how much time was spent preparing for situations that were not on your roadmap — the ones that arrived anyway?" The answer is almost always zero.
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { session: 'Session 1', title: 'Map Your Unintended Situations', desc: 'Identify the 10–15 strategic triggers most likely to fire in your industry this year that are not currently on your roadmap. Use the 231-trigger library as your starting point.', cta: 'Open Protocol Library →', href: '/playbooks', color: GOLD },
                { session: 'Session 2', title: 'Select Your Priority Protocols', desc: 'From the 180 Readiness Protocols, select the 5–10 most critical for your organization. Configure them to your specific org structure, decision rights, and stakeholder roster.', cta: 'Browse 180 Protocols →', href: '/playbooks', color: TEAL },
                { session: 'Session 3', title: 'Run a Tabletop Simulation', desc: 'Activate your top protocol against a practice trigger. Full execution chain — stakeholder alerts, task assignments, executive authorization — before a real situation demands it.', cta: 'Schedule a Practice Drill →', href: '/practice-drills', color: GOLD },
                { session: 'Session 4', title: 'Confirm Your Readiness Benchmark', desc: 'Document your confirmed response time, activation chain, and readiness score. This is your baseline — every future activation improves it.', cta: 'View Readiness Score →', href: '/mission-control', color: TEAL },
              ].map(({ session, title, desc, cta, href, color }) => (
                <div key={session} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderLeft: `3px solid ${color}30`, padding: '18px 20px', cursor: 'pointer' }}
                  onClick={() => {}}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color }}>{session}</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{title}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, marginBottom: 10 }}>{desc}</div>
                  <a href={href} style={{ fontSize: 11, fontWeight: 700, color, textDecoration: 'none', letterSpacing: '0.04em' }}>{cta}</a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </PageLayout>
  );
}
