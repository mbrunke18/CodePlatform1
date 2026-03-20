import IDEALayout from '@/components/layout/IDEALayout';
import { Users, Trophy, Clock, TrendingUp, CheckCircle2, Star, Award } from 'lucide-react';

const NAVY  = "#0A0F2E";
const GOLD  = "#C9A84C";
const TEAL  = "#2B8A6E";
const BORDER = "#E8E4DC";
const MUTED  = "#6B7280";

const TEAM = [
  { rank: 1, role: 'Chief Executive Officer',       initials: 'MR', name: 'M. Richardson', executions: 8,  avgTime: '9.2 min',  sla: 98, trend: '+12%', badge: 'Elite' },
  { rank: 2, role: 'Chief Financial Officer',        initials: 'SC', name: 'S. Chen',       executions: 6,  avgTime: '10.8 min', sla: 94, trend: '+8%',  badge: 'Expert' },
  { rank: 3, role: 'Chief Information Security Off.',initials: 'JW', name: 'J. Williams',   executions: 11, avgTime: '11.4 min', sla: 91, trend: '+22%', badge: 'Expert' },
  { rank: 4, role: 'Chief Operating Officer',        initials: 'AK', name: 'A. Kapur',      executions: 5,  avgTime: '11.9 min', sla: 88, trend: '+5%',  badge: 'Advanced' },
  { rank: 5, role: 'General Counsel',                initials: 'LM', name: 'L. Martinez',   executions: 4,  avgTime: '12.1 min', sla: 85, trend: '+3%',  badge: 'Advanced' },
];

const BADGE_COLORS: Record<string, { bg: string; color: string }> = {
  Elite:    { bg: 'rgba(201,168,76,0.15)', color: GOLD },
  Expert:   { bg: 'rgba(43,138,110,0.10)', color: TEAL },
  Advanced: { bg: 'rgba(10,15,46,0.07)',   color: NAVY },
};

const DOMAINS = [
  { label: 'Market Dynamics',        executions: 12, coverage: 92 },
  { label: 'Regulatory & Compliance',executions: 8,  coverage: 88 },
  { label: 'Cybersecurity',           executions: 7,  coverage: 95 },
  { label: 'Operational Excellence',  executions: 5,  coverage: 80 },
];

const KPI = [
  { icon: <Users size={18} color={GOLD} />,          value: '5',      label: 'Active Executives',   bg: 'rgba(201,168,76,0.06)',  border: 'rgba(201,168,76,0.25)' },
  { icon: <Trophy size={18} color={NAVY} />,          value: '34',     label: 'Executions Complete', bg: 'rgba(10,15,46,0.04)',    border: 'rgba(10,15,46,0.15)'   },
  { icon: <Clock size={18} color={TEAL} />,           value: '10.8m',  label: 'Avg Response Time',  bg: 'rgba(43,138,110,0.06)',  border: 'rgba(43,138,110,0.25)' },
  { icon: <TrendingUp size={18} color="#C0392B" />,   value: '91%',    label: 'SLA Compliance',      bg: 'rgba(192,57,43,0.05)',   border: 'rgba(192,57,43,0.2)'   },
];

export default function TeamPage() {
  return (
    <IDEALayout>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>

        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 20, height: 2, background: GOLD }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase' as const, color: GOLD }}>
              Advance · Team Performance
            </span>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: NAVY, margin: 0 }}>Execution Team Scorecard</h1>
          <p style={{ fontSize: 14, color: MUTED, marginTop: 6 }}>
            Individual executive performance across playbook activations — response velocity, SLA compliance, and domain coverage
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>

          {/* Leaderboard */}
          <div style={{ border: `1px solid ${BORDER}`, borderLeft: `3px solid ${GOLD}`, background: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 20px', borderBottom: `1px solid ${BORDER}` }}>
              <Trophy size={14} color={GOLD} />
              <span style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>Executive Execution Leaderboard</span>
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: TEAL, marginLeft: 'auto' }}>Q1 2026</span>
            </div>

            {TEAM.map((member, idx) => {
              const badge = BADGE_COLORS[member.badge];
              const slaColor = member.sla >= 95 ? TEAL : member.sla >= 88 ? GOLD : '#C0392B';
              return (
                <div key={member.rank} style={{
                  display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px',
                  borderBottom: idx < TEAM.length - 1 ? `1px solid ${BORDER}` : 'none',
                  background: idx === 0 ? 'rgba(201,168,76,0.025)' : '#fff',
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexShrink: 0,
                    background: idx === 0 ? GOLD : idx === 1 ? '#C0C0C0' : idx === 2 ? '#CD7F32' : 'rgba(10,15,46,0.08)',
                    color: idx < 3 ? '#fff' : NAVY, fontWeight: 800, fontSize: 11,
                  }}>
                    {idx < 3 ? <Trophy size={12} /> : member.rank}
                  </div>

                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{member.initials}</span>
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>{member.name}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, padding: '2px 7px', background: badge.bg, color: badge.color }}>
                        {member.badge}
                      </span>
                    </div>
                    <span style={{ fontSize: 11, color: MUTED }}>{member.role}</span>
                  </div>

                  <div style={{ textAlign: 'center' as const, minWidth: 55 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: NAVY }}>{member.executions}</div>
                    <div style={{ fontSize: 10, color: MUTED }}>executions</div>
                  </div>

                  <div style={{ textAlign: 'center' as const, minWidth: 65 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: TEAL }}>{member.avgTime}</div>
                    <div style={{ fontSize: 10, color: MUTED }}>avg time</div>
                  </div>

                  <div style={{ textAlign: 'center' as const, minWidth: 55 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: slaColor }}>{member.sla}%</div>
                    <div style={{ fontSize: 10, color: MUTED }}>SLA</div>
                  </div>

                  <div style={{ fontSize: 11, fontWeight: 700, color: TEAL, minWidth: 40, textAlign: 'right' as const }}>
                    {member.trend}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Domain Coverage */}
          <div style={{ border: `1px solid ${BORDER}`, borderLeft: `3px solid ${TEAL}`, background: '#fff' }}>
            <div style={{ padding: '14px 20px', borderBottom: `1px solid ${BORDER}` }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>Domain Coverage</span>
            </div>
            <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column' as const, gap: 18 }}>
              {DOMAINS.map((d, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: NAVY }}>{d.label}</span>
                    <span style={{ fontSize: 11, color: MUTED }}>{d.executions} executions</span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(10,15,46,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${d.coverage}%`, background: `linear-gradient(to right, ${TEAL}, ${GOLD})`, borderRadius: 3 }} />
                  </div>
                  <div style={{ fontSize: 10, color: MUTED, marginTop: 3, textAlign: 'right' as const }}>{d.coverage}% coverage</div>
                </div>
              ))}
            </div>

            <div style={{ margin: '0 20px 20px', padding: '12px 16px', background: 'rgba(201,168,76,0.06)', border: `1px solid rgba(201,168,76,0.2)` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <Award size={13} color={GOLD} />
                <span style={{ fontSize: 11, fontWeight: 700, color: NAVY }}>Top Achievement</span>
              </div>
              <p style={{ fontSize: 11, color: MUTED, margin: 0, lineHeight: 1.5 }}>
                Team achieved sub-12-minute response across 28 of 34 activations — 82% on-target execution rate.
              </p>
            </div>
          </div>
        </div>
      </div>
    </IDEALayout>
  );
}
