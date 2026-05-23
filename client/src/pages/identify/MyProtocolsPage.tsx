import IDEALayout from '@/components/layout/IDEALayout';
import { BookOpen, Clock, Users, Plus, CheckCircle2, Zap, Shield, TrendingUp, ChevronRight } from 'lucide-react';
import { Link } from 'wouter';

const NAVY  = "#0A0F2E";
const GOLD  = "#C9A84C";
const TEAL  = "#2B8A6E";
const BORDER = "#E8E4DC";
const MUTED  = "#6B7280";

const MY_PLAYBOOKS = [
  {
    id: 1,
    name: 'Competitive Response — Market Disruption',
    domain: 'Market Dynamics',
    status: 'active',
    lastActivated: '8 days ago',
    activations: 3,
    avgTime: '9.2 min',
    sla: 98,
    stakeholders: 7,
    phases: 4,
    lastOutcome: 'Competitor contained — market share held',
  },
  {
    id: 2,
    name: 'Cybersecurity Breach Response',
    domain: 'Technology & AI Governance',
    status: 'active',
    lastActivated: '21 days ago',
    activations: 2,
    avgTime: '11.4 min',
    sla: 91,
    stakeholders: 9,
    phases: 4,
    lastOutcome: 'Systems isolated — incident contained in 11 min',
  },
  {
    id: 3,
    name: 'Supply Chain Continuity Protocol',
    domain: 'Operational Excellence',
    status: 'monitoring',
    lastActivated: '45 days ago',
    activations: 1,
    avgTime: '12.1 min',
    sla: 85,
    stakeholders: 6,
    phases: 4,
    lastOutcome: 'Backup suppliers activated — zero production impact',
  },
  {
    id: 4,
    name: 'Regulatory Response — SEC / GDPR',
    domain: 'Regulatory & Compliance',
    status: 'monitoring',
    lastActivated: 'Never activated',
    activations: 0,
    avgTime: '—',
    sla: null,
    stakeholders: 5,
    phases: 4,
    lastOutcome: null,
  },
];

const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string; dot: string }> = {
  active:     { label: 'ACTIVE',     bg: 'rgba(43,138,110,0.1)',  color: TEAL, dot: TEAL },
  monitoring: { label: 'MONITORING', bg: 'rgba(201,168,76,0.1)', color: GOLD, dot: GOLD },
};

const KPI = [
  { icon: <BookOpen size={18} color={NAVY} />,       value: '4',     label: 'Active Readiness Protocols',  bg: 'rgba(10,15,46,0.04)',   border: 'rgba(10,15,46,0.15)'   },
  { icon: <Clock size={18} color={TEAL} />,           value: '10.8m', label: 'Avg Response Time', bg: 'rgba(43,138,110,0.06)', border: 'rgba(43,138,110,0.25)' },
  { icon: <Users size={18} color={GOLD} />,           value: '27',    label: 'Stakeholders',      bg: 'rgba(201,168,76,0.06)', border: 'rgba(201,168,76,0.25)' },
  { icon: <CheckCircle2 size={18} color={TEAL} />,   value: '6',     label: 'Activations',       bg: 'rgba(43,138,110,0.06)', border: 'rgba(43,138,110,0.25)' },
];

export default function MyPlaybooksPage() {
  return (
    <IDEALayout>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap' as const, gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ width: 20, height: 2, background: GOLD }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase' as const, color: GOLD }}>
                Identify · My Readiness Protocols
              </span>
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: NAVY, margin: 0 }}>My Active Readiness Protocols</h1>
            <p style={{ fontSize: 14, color: MUTED, marginTop: 6 }}>
              Your organization's configured and monitored Readiness Protocols — ready for immediate activation
            </p>
          </div>
          <Link href="/identify/playbook-library">
            <button style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px',
              background: NAVY, color: '#fff', border: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: 700, letterSpacing: '0.06em',
            }}>
              <Plus size={14} /> Add Readiness Protocol
            </button>
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 28 }}>
          {KPI.map((k, i) => (
            <div key={i} style={{ padding: '16px 18px', background: k.bg, border: `1px solid ${k.border}`, borderLeft: `3px solid ${k.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {k.icon}
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: NAVY }}>{k.value}</div>
                  <div style={{ fontSize: 11, color: MUTED, fontWeight: 500 }}>{k.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 14 }}>
          {MY_PLAYBOOKS.map((pb) => {
            const sta = STATUS_CONFIG[pb.status];
            return (
              <div key={pb.id} style={{ border: `1px solid ${BORDER}`, borderLeft: `3px solid ${sta.dot}`, background: '#fff' }}>
                <div style={{ padding: '18px 20px', display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' as const }}>
                  <div style={{ flex: 1, minWidth: 260 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' as const }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: NAVY }}>{pb.name}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, padding: '2px 8px', background: sta.bg, color: sta.color }}>
                        {sta.label}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' as const }}>
                      <span style={{ fontSize: 11, color: MUTED, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Shield size={11} /> {pb.domain}
                      </span>
                      <span style={{ fontSize: 11, color: MUTED, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Zap size={11} /> {pb.phases} phases
                      </span>
                      <span style={{ fontSize: 11, color: MUTED, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Users size={11} /> {pb.stakeholders} stakeholders
                      </span>
                      <span style={{ fontSize: 11, color: MUTED, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={11} /> Last activated: {pb.lastActivated}
                      </span>
                    </div>
                    {pb.lastOutcome && (
                      <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <CheckCircle2 size={11} color={TEAL} />
                        <span style={{ fontSize: 11, color: TEAL, fontWeight: 600 }}>Last outcome: {pb.lastOutcome}</span>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: 24, flexShrink: 0, flexWrap: 'wrap' as const }}>
                    <div style={{ textAlign: 'center' as const }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: NAVY }}>{pb.activations}</div>
                      <div style={{ fontSize: 10, color: MUTED }}>activations</div>
                    </div>
                    {pb.avgTime !== '—' && (
                      <div style={{ textAlign: 'center' as const }}>
                        <div style={{ fontSize: 18, fontWeight: 800, color: TEAL }}>{pb.avgTime}</div>
                        <div style={{ fontSize: 10, color: MUTED }}>avg time</div>
                      </div>
                    )}
                    {pb.sla !== null && (
                      <div style={{ textAlign: 'center' as const }}>
                        <div style={{ fontSize: 18, fontWeight: 800, color: pb.sla >= 90 ? TEAL : GOLD }}>{pb.sla}%</div>
                        <div style={{ fontSize: 10, color: MUTED }}>SLA</div>
                      </div>
                    )}
                  </div>

                  <Link href={`/identify/playbook-library`}>
                    <button style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '8px 16px', background: NAVY, color: '#fff',
                      border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700,
                      letterSpacing: '0.06em', flexShrink: 0,
                    }}>
                      <Zap size={11} /> ACTIVATE <ChevronRight size={11} />
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 20, padding: '14px 20px', background: 'rgba(10,15,46,0.03)', border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <TrendingUp size={14} color={TEAL} />
            <span style={{ fontSize: 12, color: MUTED }}>
              180 Readiness Protocols available in the library — 9 strategic domains, 221 executive triggers monitored
            </span>
          </div>
          <Link href="/identify/playbook-library">
            <span style={{ fontSize: 12, fontWeight: 700, color: NAVY, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
              Browse Full Library <ChevronRight size={12} />
            </span>
          </Link>
        </div>
      </div>
    </IDEALayout>
  );
}
