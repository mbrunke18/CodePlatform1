import IDEALayout from '@/components/layout/IDEALayout';
import { AlertTriangle, Shield, TrendingUp, Clock, ChevronRight, Radio, Eye, Zap } from 'lucide-react';
import { Link } from 'wouter';

const NAVY  = "#0A0F2E";
const GOLD  = "#C9A84C";
const TEAL  = "#2B8A6E";
const BORDER = "#E8E4DC";
const MUTED  = "#6B7280";

const THREATS = [
  {
    id: 1,
    title: 'Competitor Strategic Acquisition — Target Identified',
    domain: 'Market Dynamics',
    severity: 'critical',
    signals: 12,
    time: '14 min ago',
    detail: 'Rival firm in late-stage acquisition talks for a key distribution channel. Immediate competitive response recommended.',
    playbook: 'Competitive Response Protocol',
    status: 'active',
  },
  {
    id: 2,
    title: 'APAC Supply Chain Disruption — Tier 1 Supplier',
    domain: 'Operational Excellence',
    severity: 'high',
    signals: 8,
    time: '1 hr ago',
    detail: 'Port congestion at Busan affecting 3 critical components. Lead time extending 14–21 days beyond SLA.',
    playbook: 'Supply Chain Resilience',
    status: 'monitoring',
  },
  {
    id: 3,
    title: 'SEC Comment Letter — 10-Day Response Window Opened',
    domain: 'Regulatory & Compliance',
    severity: 'high',
    signals: 5,
    time: '3 hrs ago',
    detail: 'SEC issued comment letter on Q3 disclosure language. Legal review and regulatory response team required immediately.',
    playbook: 'Regulatory Response Playbook',
    status: 'monitoring',
  },
  {
    id: 4,
    title: 'Negative Social Sentiment Spike — Brand Mentions +340%',
    domain: 'Brand & Reputation',
    severity: 'medium',
    signals: 34,
    time: '2 hrs ago',
    detail: 'Sentiment index dropped 18 points following viral post. Media pickup risk elevated — PR team on standby.',
    playbook: 'Reputation Crisis Response',
    status: 'watching',
  },
  {
    id: 5,
    title: 'GDPR Enforcement Update — New Data Residency Rules',
    domain: 'Technology & AI Governance',
    severity: 'medium',
    signals: 3,
    time: '6 hrs ago',
    detail: 'EU regulators issued new guidance on cross-border data transfers effective in 90 days. Compliance sprint required.',
    playbook: 'Regulatory Compliance Sprint',
    status: 'watching',
  },
  {
    id: 6,
    title: 'Key Talent Departure Signal — VP Engineering',
    domain: 'Talent & Leadership',
    severity: 'low',
    signals: 2,
    time: '8 hrs ago',
    detail: 'Resume activity and recruiter engagement detected for a critical role holder. Retention protocol recommended.',
    playbook: 'Talent Retention Protocol',
    status: 'watching',
  },
];

const SEV: Record<string, { label: string; bg: string; color: string; dot: string }> = {
  critical: { label: 'CRITICAL', bg: 'rgba(192,57,43,0.08)',  color: '#C0392B', dot: '#C0392B' },
  high:     { label: 'HIGH',     bg: 'rgba(201,168,76,0.10)', color: GOLD,      dot: GOLD      },
  medium:   { label: 'MEDIUM',   bg: 'rgba(43,138,110,0.08)', color: TEAL,      dot: TEAL      },
  low:      { label: 'LOW',      bg: 'rgba(10,15,46,0.05)',   color: MUTED,     dot: '#bbb'    },
};

const STA: Record<string, { label: string; color: string }> = {
  active:     { label: '● ACTIVE',     color: '#C0392B' },
  monitoring: { label: '◆ MONITORING', color: GOLD      },
  watching:   { label: '○ WATCHING',   color: MUTED     },
};

const KPI = [
  { icon: <AlertTriangle size={18} color="#C0392B" />, value: '1',    label: 'Critical',         bg: 'rgba(192,57,43,0.06)', border: 'rgba(192,57,43,0.25)' },
  { icon: <AlertTriangle size={18} color={GOLD} />,    value: '2',    label: 'High Priority',    bg: 'rgba(201,168,76,0.06)', border: 'rgba(201,168,76,0.25)' },
  { icon: <Eye size={18} color={TEAL} />,              value: '248+', label: 'Signals Monitored', bg: 'rgba(43,138,110,0.06)', border: 'rgba(43,138,110,0.25)' },
  { icon: <Shield size={18} color={NAVY} />,           value: '99.2%','label': 'Detection Rate', bg: 'rgba(10,15,46,0.04)',   border: 'rgba(10,15,46,0.15)' },
];

export default function ThreatsPage() {
  return (
    <IDEALayout>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>

        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 20, height: 2, background: GOLD }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase' as const, color: GOLD }}>
              Detect · Threat Intelligence
            </span>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: NAVY, margin: 0 }}>Threat Detection Center</h1>
          <p style={{ fontSize: 14, color: MUTED, marginTop: 6 }}>
            Real-time strategic threat identification across 248+ monitored data points — 20 signal categories
          </p>
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

        <div style={{ border: `1px solid ${BORDER}`, borderLeft: `3px solid #C0392B`, background: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: `1px solid ${BORDER}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Radio size={13} color="#C0392B" />
              <span style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>Live Threat Feed</span>
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#C0392B' }}>● LIVE</span>
            </div>
            <span style={{ fontSize: 11, color: MUTED }}>{THREATS.length} active threats · Updated 14 min ago</span>
          </div>

          {THREATS.map((threat, idx) => {
            const sev = SEV[threat.severity];
            const sta = STA[threat.status];
            return (
              <div key={threat.id} style={{
                padding: '16px 20px',
                borderBottom: idx < THREATS.length - 1 ? `1px solid ${BORDER}` : 'none',
                background: idx === 0 ? 'rgba(192,57,43,0.018)' : '#fff',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%', background: sev.dot,
                    flexShrink: 0, marginTop: 6,
                    boxShadow: idx === 0 ? `0 0 0 3px rgba(192,57,43,0.15)` : 'none',
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' as const, marginBottom: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>{threat.title}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, padding: '2px 8px', background: sev.bg, color: sev.color }}>
                        {sev.label}
                      </span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: sta.color }}>{sta.label}</span>
                    </div>
                    <p style={{ fontSize: 12, color: '#555', margin: '4px 0 8px', lineHeight: 1.5 }}>{threat.detail}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' as const }}>
                      <span style={{ fontSize: 11, color: MUTED, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Eye size={11} /> {threat.domain}
                      </span>
                      <span style={{ fontSize: 11, color: MUTED, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Zap size={11} /> {threat.signals} signals
                      </span>
                      <span style={{ fontSize: 11, color: MUTED, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={11} /> {threat.time}
                      </span>
                      <Link href="/identify/playbook-library">
                        <span style={{ fontSize: 11, color: TEAL, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                          <TrendingUp size={11} /> Activate: {threat.playbook} <ChevronRight size={11} />
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Shield size={12} color={TEAL} />
          <span style={{ fontSize: 11, color: MUTED }}>
            Each detected threat maps directly to a pre-built response playbook across 9 strategic domains. Target: roles assigned, tasks staged, communications sent — execution live in 12 minutes.
          </span>
        </div>
      </div>
    </IDEALayout>
  );
}
