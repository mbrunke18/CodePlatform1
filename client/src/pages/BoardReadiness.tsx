import { useQuery } from '@tanstack/react-query';
import { useRef } from 'react';
import { Shield, Zap, Clock, Users, BookOpen, TrendingUp, CheckCircle, AlertTriangle, Printer, Link, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const NAVY = '#0A0F2E';
const GOLD = '#C9A84C';
const TEAL = '#2B8A6E';

function ScoreRing({ score }: { score: number }) {
  const r = 52, circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ;
  const color = score >= 80 ? TEAL : score >= 60 ? GOLD : '#EF4444';
  return (
    <svg width={130} height={130} style={{ display: 'block', margin: '0 auto' }}>
      <circle cx={65} cy={65} r={r} fill="none" stroke="#E8E4DC" strokeWidth={10} />
      <circle cx={65} cy={65} r={r} fill="none" stroke={color} strokeWidth={10}
        strokeDasharray={`${filled} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 65 65)" style={{ transition: 'stroke-dasharray 1s ease' }} />
      <text x={65} y={60} textAnchor="middle" fontSize={26} fontWeight={800} fill={NAVY}>{score}</text>
      <text x={65} y={78} textAnchor="middle" fontSize={10} fontWeight={600} fill="#999" letterSpacing={1}>READINESS</text>
    </svg>
  );
}

function StatCard({ label, value, sub, icon: Icon, color = NAVY }: { label: string; value: any; sub?: string; icon: any; color?: string }) {
  return (
    <div style={{ padding: '20px 18px', background: '#fff', border: '1px solid #E8E4DC', borderRadius: 8, borderLeft: `3px solid ${color}` }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={16} color={color} />
        </div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: NAVY, lineHeight: 1 }}>{value}</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.8px', marginTop: 4 }}>{label}</div>
          {sub && <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>{sub}</div>}
        </div>
      </div>
    </div>
  );
}

function DomainBar({ domain, active }: { domain: string; active: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #F0EDE4' }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: active ? TEAL : '#D1D5DB', flexShrink: 0 }} />
      <span style={{ fontSize: 13, color: active ? NAVY : '#9CA3AF', fontWeight: active ? 600 : 400, flex: 1 }}>{domain}</span>
      {active
        ? <span style={{ fontSize: 10, fontWeight: 700, color: TEAL, background: `${TEAL}12`, padding: '2px 8px', borderRadius: 3, letterSpacing: 0.5 }}>MONITORING</span>
        : <span style={{ fontSize: 10, color: '#9CA3AF', background: '#F3F4F6', padding: '2px 8px', borderRadius: 3 }}>ARMED</span>
      }
    </div>
  );
}

const ALL_DOMAINS = [
  'Market Dynamics', 'Regulatory & Compliance', 'Operational Risk', 'Financial Performance',
  'Geopolitical Risk', 'Technology & Cybersecurity', 'ESG & Sustainability', 'Talent & Culture', 'Supply Chain',
];

export default function BoardReadiness() {
  const { toast } = useToast();
  const printRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery<any>({ queryKey: ['/api/org/board-readiness'] });
  const { data: dividend } = useQuery<any>({ queryKey: ['/api/org/execution-dividend'] });

  function handlePrint() { window.print(); }

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast({ title: 'Link copied', description: 'Board Readiness Snapshot link copied to clipboard.' });
    });
  }

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#F8F7F4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: GOLD, marginBottom: 8, fontFamily: 'system-ui' }}>Generating snapshot...</div>
        </div>
      </div>
    );
  }

  const d = data || { readinessScore: 0, domainCoverage: 0, activeDomains: [], totalDomains: 9, triggerCount90d: 0, triggerCount30d: 0, activationCount: 0, avgResponseMinutes: null, stakeholderCount: 0, recentDetections: [], monitoringStatus: 'MONITORING', generatedAt: new Date().toISOString() };
  const div = dividend || { totalValueCreated: 0, totalHoursSaved: 0, totalTriggersResponded: 0, avgResponseMinutes: 12, avgSpeedMultiplier: 3600 };
  const statusColor = d.monitoringStatus === 'ALERT' ? '#EF4444' : TEAL;
  const generatedDate = new Date(d.generatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div style={{ minHeight: '100vh', background: '#F8F7F4', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: #fff !important; }
          .print-page { box-shadow: none !important; margin: 0 !important; max-width: 100% !important; }
        }
      `}</style>

      {/* Action bar (no-print) */}
      <div className="no-print" style={{ background: NAVY, padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Award size={16} color={GOLD} />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Board Readiness Snapshot</span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginLeft: 4 }}>· {generatedDate}</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={handleCopyLink} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: 5, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            <Link size={13} /> Copy Link
          </button>
          <button onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: 6, background: GOLD, color: NAVY, border: 'none', borderRadius: 5, padding: '7px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
            <Printer size={13} /> Print / Export PDF
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="print-page" ref={printRef} style={{ maxWidth: 900, margin: '40px auto', padding: '0 24px 60px' }}>

        {/* Header */}
        <div style={{ background: NAVY, borderRadius: 8, padding: '36px 40px', marginBottom: 28, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(201,168,76,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.07) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', display: 'flex', gap: 40, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 220 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: GOLD, marginBottom: 12 }}>VaughnMartin Execution OS</div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', margin: '0 0 10px', lineHeight: 1.2 }}>Strategic Readiness Report</h1>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Generated {generatedDate} · Confidential</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: statusColor }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: statusColor }}>{d.monitoringStatus}</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>· 221 triggers armed · 248+ signals tracked</span>
              </div>
            </div>
            <ScoreRing score={d.readinessScore} />
          </div>
        </div>

        {/* Key stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 28 }}>
          <StatCard label="Triggers Monitored (90d)" value={d.triggerCount90d} icon={Zap} color={GOLD} sub={`${d.triggerCount30d} in past 30 days`} />
          <StatCard label="Avg Response Time" value={d.avgResponseMinutes ? `${d.avgResponseMinutes}m` : '< 12m'} icon={Clock} color={TEAL} sub="vs. 30-day industry baseline" />
          <StatCard label="Playbooks Activated" value={d.activationCount} icon={BookOpen} color={NAVY} sub="Across all execution events" />
          <StatCard label="Stakeholders Enrolled" value={d.stakeholderCount} icon={Users} color="#8B5CF6" sub="Receiving real-time alerts" />
        </div>

        {/* Two columns: domains + dividend */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>

          {/* Domain coverage */}
          <div style={{ background: '#fff', border: '1px solid #E8E4DC', borderRadius: 8, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: NAVY, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Domain Coverage</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: d.domainCoverage >= 60 ? TEAL : GOLD }}>{d.domainCoverage}%</div>
            </div>
            <div style={{ height: 6, background: '#F0EDE4', borderRadius: 3, overflow: 'hidden', marginBottom: 18 }}>
              <div style={{ height: '100%', width: `${d.domainCoverage}%`, background: d.domainCoverage >= 60 ? TEAL : GOLD, borderRadius: 3, transition: 'width 1s ease' }} />
            </div>
            {ALL_DOMAINS.map(domain => (
              <DomainBar key={domain} domain={domain} active={d.activeDomains?.includes(domain)} />
            ))}
          </div>

          {/* Execution Dividend */}
          <div style={{ background: '#fff', border: '1px solid #E8E4DC', borderRadius: 8, padding: 24, display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: NAVY, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 20 }}>Execution Dividend</div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ textAlign: 'center', padding: '20px 0', borderBottom: '1px solid #F0EDE4' }}>
                <div style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Estimated Value Created</div>
                <div style={{ fontSize: 36, fontWeight: 800, color: TEAL, letterSpacing: '-1px' }}>
                  ${(div.totalValueCreated || 0).toLocaleString()}
                </div>
                <div style={{ fontSize: 11, color: '#999', marginTop: 4 }}>Based on {div.totalTriggersResponded} trigger responses</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { label: 'Hours Saved', value: (div.totalHoursSaved || 0).toLocaleString() },
                  { label: 'Speed Multiplier', value: `${(div.avgSpeedMultiplier || 3600).toLocaleString()}×` },
                  { label: 'Avg Response', value: `${div.avgResponseMinutes || 12}m` },
                  { label: 'Baseline Replaced', value: '30 days' },
                ].map(({ label, value }) => (
                  <div key={label} style={{ textAlign: 'center', padding: '12px 8px', background: '#F8F7F4', borderRadius: 6 }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: NAVY }}>{value}</div>
                    <div style={{ fontSize: 10, color: '#999', textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 3 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ marginTop: 16, fontSize: 10, color: '#bbb', lineHeight: 1.5, borderTop: '1px solid #F0EDE4', paddingTop: 12 }}>
              Value estimated at $500/hr executive rate × hours saved vs. 30-day traditional mobilization baseline.
            </div>
          </div>
        </div>

        {/* Recent detections */}
        {d.recentDetections?.length > 0 && (
          <div style={{ background: '#fff', border: '1px solid #E8E4DC', borderRadius: 8, padding: 24, marginBottom: 28 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: NAVY, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 16 }}>Recent Trigger Events (30 Days)</div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${NAVY}` }}>
                  {['Trigger', 'Domain', 'Confidence', 'Detected'].map(h => (
                    <th key={h} style={{ padding: '8px 0', textAlign: 'left', fontSize: 10, color: NAVY, letterSpacing: '0.8px', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {d.recentDetections.map((det: any, i: number) => (
                  <tr key={i} style={{ borderBottom: '1px solid #F0EDE4' }}>
                    <td style={{ padding: '10px 0', fontSize: 13, fontWeight: 600, color: NAVY }}>{det.triggerName}</td>
                    <td style={{ padding: '10px 0', fontSize: 12, color: '#666' }}>{det.triggerDomain}</td>
                    <td style={{ padding: '10px 0', fontSize: 12, fontWeight: 700, color: TEAL }}>{det.confidenceScore}%</td>
                    <td style={{ padding: '10px 0', fontSize: 12, color: '#999' }}>{new Date(det.detectedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Board attestation */}
        <div style={{ background: `${NAVY}08`, border: `1px solid ${NAVY}15`, borderRadius: 8, padding: 24, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <CheckCircle size={18} color={TEAL} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 6 }}>Executive Attestation</div>
            <div style={{ fontSize: 12, color: '#555', lineHeight: 1.7 }}>
              This organization's strategic execution infrastructure is actively monitoring {d.triggersArmed || 221} trigger patterns across {d.totalDomains} domains.
              Stakeholder teams are enrolled to receive real-time alerts within minutes of a trigger detection. 170 pre-staged playbooks are available for immediate deployment.
              This report was generated automatically by Execution OS and reflects live system state as of {generatedDate}.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 40, fontSize: 11, color: '#bbb' }}>
          VaughnMartin Execution OS · Confidential · Generated {generatedDate} · execution-os.vaughnmartin.com
        </div>
      </div>
    </div>
  );
}
