import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { 
  Zap, X, AlertTriangle, CheckCircle, Shield, 
  BarChart3, FileText, Radio, ChevronRight, Clock
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const NAVY = '#0A0F2E';
const GOLD = '#C9A84C';
const TEAL = '#2B8A6E';
const RED = '#DC2626';

interface Alert {
  id: string;
  title: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  type: string;
  timestamp?: string;
}

interface AlertsResponse {
  data: Alert[];
  success: boolean;
}

interface MaturityResponse {
  score?: number;
  maturityScore?: number;
  level?: string;
}

const FAST_PATHS = [
  { label: 'Activate a Protocol', icon: Zap, href: '/live-activation', color: GOLD },
  { label: 'War Room', icon: Shield, href: '/war-room', color: TEAL },
  { label: 'Readiness Score', icon: BarChart3, href: '/dashboard', color: NAVY },
  { label: 'Board Report', icon: FileText, href: '/board-briefings', color: NAVY },
];

const EXCLUDED_ROUTES = ['/a16z', '/a16z-print', '/podcast-prep', '/command-tower', '/12-minute-experience'];

export default function QuickActions() {
  const [open, setOpen] = useState(false);
  const [location, navigate] = useLocation();
  const { isAuthenticated } = useAuth();

  const { data: alertsData } = useQuery<AlertsResponse>({
    queryKey: ['/api/intelligence/alerts'],
    refetchInterval: 60000,
    enabled: isAuthenticated,
  });

  const { data: maturityData } = useQuery<MaturityResponse>({
    queryKey: ['/api/intelligence/maturity-score'],
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) return null;
  if (EXCLUDED_ROUTES.some(r => location.startsWith(r))) return null;

  const alerts: Alert[] = alertsData?.data ?? [];
  const highAlerts = alerts.filter(a => a.severity === 'HIGH');
  const medAlerts = alerts.filter(a => a.severity === 'MEDIUM');
  const totalActive = alerts.length;
  const topAlert = highAlerts[0] ?? medAlerts[0] ?? null;
  const readinessScore = maturityData?.score ?? maturityData?.maturityScore ?? null;

  const badgeCount = highAlerts.length || totalActive;

  return (
    <>
      {open && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 9998 }}
          onClick={() => setOpen(false)}
        />
      )}

      <div style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>

        {open && (
          <div style={{
            width: 320,
            background: '#fff',
            border: `1px solid rgba(10,15,46,0.12)`,
            boxShadow: '0 20px 60px rgba(10,15,46,0.18)',
            borderRadius: 4,
            overflow: 'hidden',
            animation: 'qa-slide-up 0.18s ease-out',
          }}>

            <div style={{ background: NAVY, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 8, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 2 }}>
                  Executive Command Strip
                </div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 15, fontWeight: 700, color: '#fff', letterSpacing: '0.04em' }}>
                  Quick Actions
                </div>
              </div>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', padding: 4, display: 'flex' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(10,15,46,0.08)' }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 8, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD, marginBottom: 10 }}>
                Needs Your Attention
              </div>

              {topAlert ? (
                <div
                  onClick={() => { navigate('/live-activation'); setOpen(false); }}
                  style={{ background: highAlerts.length > 0 ? 'rgba(220,38,38,0.05)' : 'rgba(201,168,76,0.06)', border: `1px solid ${highAlerts.length > 0 ? 'rgba(220,38,38,0.2)' : 'rgba(201,168,76,0.3)'}`, borderLeft: `3px solid ${highAlerts.length > 0 ? RED : GOLD}`, borderRadius: 2, padding: '10px 12px', cursor: 'pointer', transition: 'background 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = highAlerts.length > 0 ? 'rgba(220,38,38,0.09)' : 'rgba(201,168,76,0.1)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = highAlerts.length > 0 ? 'rgba(220,38,38,0.05)' : 'rgba(201,168,76,0.06)'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <AlertTriangle size={14} style={{ color: highAlerts.length > 0 ? RED : GOLD, flexShrink: 0, marginTop: 1 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: NAVY, lineHeight: 1.4, marginBottom: 4 }}>{topAlert.title}</div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: highAlerts.length > 0 ? RED : GOLD }}>
                          {topAlert.severity} · Awaiting Authorization
                        </span>
                        <ChevronRight size={11} style={{ color: '#9CA3AF' }} />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: 'rgba(43,138,110,0.05)', border: '1px solid rgba(43,138,110,0.15)', borderLeft: `3px solid ${TEAL}`, borderRadius: 2 }}>
                  <CheckCircle size={14} style={{ color: TEAL, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: NAVY }}>No active alerts</div>
                    <div style={{ fontSize: 10, color: '#6B7280', marginTop: 1 }}>Continuous monitoring active</div>
                  </div>
                </div>
              )}
            </div>

            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(10,15,46,0.08)' }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 8, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD, marginBottom: 10 }}>
                Signal Status
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
                <SignalStat label="HIGH" value={highAlerts.length} color={highAlerts.length > 0 ? RED : '#9CA3AF'} />
                <SignalStat label="MEDIUM" value={medAlerts.length} color={medAlerts.length > 0 ? GOLD : '#9CA3AF'} />
                <SignalStat label="Readiness" value={readinessScore !== null ? `${readinessScore}` : '—'} color={TEAL} suffix={readinessScore !== null ? '/100' : ''} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
                <Radio size={9} style={{ color: TEAL }} />
                <span style={{ fontSize: 9.5, color: '#9CA3AF', fontStyle: 'italic' }}>Live · updates every 15 minutes</span>
              </div>
            </div>

            <div style={{ padding: '12px 16px' }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 8, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD, marginBottom: 10 }}>
                Fast Path
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {FAST_PATHS.map(({ label, icon: Icon, href, color }) => (
                  <button
                    key={href}
                    onClick={() => { navigate(href); setOpen(false); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 10px', background: '#FAFAF8', border: '1px solid rgba(10,15,46,0.1)', borderRadius: 2, cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left' }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = '#F0EDE4'; el.style.borderColor = GOLD; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = '#FAFAF8'; el.style.borderColor = 'rgba(10,15,46,0.1)'; }}
                  >
                    <Icon size={13} style={{ color, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: NAVY, lineHeight: 1.3 }}>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ padding: '10px 16px', background: '#FAFAF8', borderTop: '1px solid rgba(10,15,46,0.06)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Clock size={10} style={{ color: '#9CA3AF' }} />
              <span style={{ fontSize: 9.5, color: '#9CA3AF' }}>Target response: <strong style={{ color: NAVY }}>12 minutes</strong> from trigger detection</span>
            </div>
          </div>
        )}

        <button
          onClick={() => setOpen(o => !o)}
          style={{
            width: 52, height: 52,
            background: open ? GOLD : NAVY,
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: open ? `0 4px 20px rgba(201,168,76,0.5)` : `0 4px 20px rgba(10,15,46,0.35)`,
            transition: 'all 0.2s',
            position: 'relative',
          }}
          title="Quick Actions"
        >
          <Zap size={20} style={{ color: open ? NAVY : GOLD }} />
          {!open && badgeCount > 0 && (
            <span style={{
              position: 'absolute', top: 0, right: 0,
              width: 18, height: 18,
              background: highAlerts.length > 0 ? RED : GOLD,
              borderRadius: '50%',
              fontSize: 9, fontWeight: 800,
              color: highAlerts.length > 0 ? '#fff' : NAVY,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid #fff',
            }}>
              {badgeCount > 9 ? '9+' : badgeCount}
            </span>
          )}
        </button>
      </div>

      <style>{`
        @keyframes qa-slide-up {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}

function SignalStat({ label, value, color, suffix = '' }: { label: string; value: number | string; color: string; suffix?: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '8px 6px', background: '#FAFAF8', border: '1px solid rgba(10,15,46,0.07)', borderRadius: 2 }}>
      <div style={{ fontSize: 18, fontWeight: 800, color, fontFamily: "'Barlow Condensed', sans-serif", lineHeight: 1 }}>
        {value}<span style={{ fontSize: 11 }}>{suffix}</span>
      </div>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9CA3AF', marginTop: 3 }}>{label}</div>
    </div>
  );
}
