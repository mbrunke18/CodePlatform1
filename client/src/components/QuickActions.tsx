import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import {
  Zap, X, AlertTriangle, CheckCircle, Shield,
  BarChart3, FileText, Radio, ChevronRight, Clock, Lock
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

const EXCLUDED_ROUTES = [
  '/a16z', '/a16z-print', '/podcast-prep', '/command-tower', '/12-minute-experience',
  '/protocol-builder',
  '/protocol-customize',
  '/protocol-customization',
  '/protocol-settings',
  '/protocol-readiness-audit',
  '/getting-started',
  '/onboarding',
  '/playbook-activation',
  '/situation-intent',
];

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

  const alerts: Alert[] = Array.isArray(alertsData?.data) ? alertsData!.data : [];
  const highAlerts = alerts.filter(a => a.severity === 'HIGH');
  const medAlerts = alerts.filter(a => a.severity === 'MEDIUM');
  const topAlert = highAlerts[0] ?? medAlerts[0] ?? null;
  const readinessScore = maturityData?.score ?? maturityData?.maturityScore ?? null;
  const badgeCount = isAuthenticated ? (highAlerts.length || alerts.length) : 0;

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
          isAuthenticated
            ? <LivePanel
                topAlert={topAlert}
                highAlerts={highAlerts}
                medAlerts={medAlerts}
                readinessScore={readinessScore}
                navigate={navigate}
                onClose={() => setOpen(false)}
              />
            : <TeaserPanel navigate={navigate} onClose={() => setOpen(false)} />
        )}

        <button
          onClick={() => setOpen(o => !o)}
          style={{
            height: 40,
            background: open ? GOLD : NAVY,
            border: `1px solid ${open ? 'rgba(201,168,76,0.4)' : 'rgba(201,168,76,0.25)'}`,
            borderRadius: 20,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '0 16px 0 14px',
            boxShadow: open ? `0 4px 20px rgba(201,168,76,0.4)` : `0 4px 20px rgba(10,15,46,0.28)`,
            transition: 'all 0.2s',
            position: 'relative',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => { if (!open) (e.currentTarget as HTMLElement).style.background = '#132558'; }}
          onMouseLeave={e => { if (!open) (e.currentTarget as HTMLElement).style.background = NAVY; }}
        >
          <Zap size={15} style={{ color: open ? NAVY : GOLD, flexShrink: 0 }} />
          <span style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: open ? NAVY : '#fff',
          }}>
            {open ? 'Close' : 'Command Strip'}
          </span>
          {!open && badgeCount > 0 && (
            <span style={{
              minWidth: 18, height: 18,
              padding: '0 4px',
              background: highAlerts.length > 0 ? RED : GOLD,
              borderRadius: 9,
              fontSize: 11, fontWeight: 800,
              color: highAlerts.length > 0 ? '#fff' : NAVY,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginLeft: 2,
              lineHeight: 1,
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

function PanelShell({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
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
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 2 }}>
            Executive Command Strip
          </div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 15, fontWeight: 700, color: '#fff', letterSpacing: '0.04em' }}>
            Quick Actions
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', padding: 4, display: 'flex' }}>
          <X size={16} />
        </button>
      </div>
      {children}
    </div>
  );
}

function LivePanel({ topAlert, highAlerts, medAlerts, readinessScore, navigate, onClose }: {
  topAlert: Alert | null;
  highAlerts: Alert[];
  medAlerts: Alert[];
  readinessScore: number | null;
  navigate: (path: string) => void;
  onClose: () => void;
}) {
  return (
    <PanelShell onClose={onClose}>
      <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(10,15,46,0.08)' }}>
        <ZoneLabel>Needs Your Attention</ZoneLabel>
        {topAlert ? (
          <div
            onClick={() => { navigate('/live-activation'); onClose(); }}
            style={{ background: highAlerts.length > 0 ? 'rgba(220,38,38,0.05)' : 'rgba(201,168,76,0.06)', border: `1px solid ${highAlerts.length > 0 ? 'rgba(220,38,38,0.2)' : 'rgba(201,168,76,0.3)'}`, borderLeft: `3px solid ${highAlerts.length > 0 ? RED : GOLD}`, borderRadius: 2, padding: '10px 12px', cursor: 'pointer', transition: 'background 0.15s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = highAlerts.length > 0 ? 'rgba(220,38,38,0.09)' : 'rgba(201,168,76,0.1)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = highAlerts.length > 0 ? 'rgba(220,38,38,0.05)' : 'rgba(201,168,76,0.06)'; }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <AlertTriangle size={14} style={{ color: highAlerts.length > 0 ? RED : GOLD, flexShrink: 0, marginTop: 1 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: NAVY, lineHeight: 1.4, marginBottom: 4 }}>{topAlert.title}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: highAlerts.length > 0 ? RED : GOLD }}>
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
        <ZoneLabel>Signal Status</ZoneLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
          <SignalStat label="HIGH" value={highAlerts.length} color={highAlerts.length > 0 ? RED : '#9CA3AF'} />
          <SignalStat label="MEDIUM" value={medAlerts.length} color={medAlerts.length > 0 ? GOLD : '#9CA3AF'} />
          <SignalStat label="Readiness" value={readinessScore !== null ? `${readinessScore}` : '—'} color={TEAL} suffix={readinessScore !== null ? '/100' : ''} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
          <Radio size={9} style={{ color: TEAL }} />
          <span style={{ fontSize: 11, color: '#9CA3AF', fontStyle: 'italic' }}>Live · updates every 15 minutes</span>
        </div>
      </div>

      <div style={{ padding: '12px 16px' }}>
        <ZoneLabel>Fast Path</ZoneLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {FAST_PATHS.map(({ label, icon: Icon, href, color }) => (
            <button
              key={href}
              onClick={() => { navigate(href); onClose(); }}
              style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 10px', background: '#FAFAF8', border: '1px solid rgba(10,15,46,0.1)', borderRadius: 2, cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left' as const }}
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
        <span style={{ fontSize: 11, color: '#9CA3AF' }}>Target response: <strong style={{ color: NAVY }}>12 minutes</strong> from trigger detection</span>
      </div>
    </PanelShell>
  );
}

function TeaserPanel({ navigate, onClose }: { navigate: (path: string) => void; onClose: () => void }) {
  return (
    <PanelShell onClose={onClose}>

      <div style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #132558 100%)`, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid rgba(201,168,76,0.2)' }}>
        <div style={{ width: 32, height: 32, background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Lock size={14} style={{ color: GOLD }} />
        </div>
        <div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: '0.04em' }}>
            Executive Access Required
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', marginTop: 1 }}>
            Preview what your command strip surfaces
          </div>
        </div>
      </div>

      <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(10,15,46,0.08)', position: 'relative' }}>
        <ZoneLabel>Needs Your Attention</ZoneLabel>
        <div style={{ filter: 'blur(3px)', pointerEvents: 'none', userSelect: 'none' }}>
          <div style={{ background: 'rgba(220,38,38,0.05)', border: '1px solid rgba(220,38,38,0.2)', borderLeft: `3px solid ${RED}`, borderRadius: 2, padding: '10px 12px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <AlertTriangle size={14} style={{ color: RED, flexShrink: 0, marginTop: 1 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: NAVY, lineHeight: 1.4, marginBottom: 4 }}>Geopolitical Risk Signal Detected</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: RED }}>
                    HIGH · Awaiting Authorization
                  </span>
                  <ChevronRight size={11} style={{ color: '#9CA3AF' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 8, right: 12, fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#9CA3AF' }}>
          Sample Preview
        </div>
      </div>

      <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(10,15,46,0.08)' }}>
        <ZoneLabel>Signal Status</ZoneLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, filter: 'blur(2.5px)', pointerEvents: 'none', userSelect: 'none' }}>
          <SignalStat label="HIGH" value={3} color={RED} />
          <SignalStat label="MEDIUM" value={12} color={GOLD} />
          <SignalStat label="Readiness" value="74" color={TEAL} suffix="/100" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
          <Radio size={9} style={{ color: '#9CA3AF' }} />
          <span style={{ fontSize: 11, color: '#9CA3AF', fontStyle: 'italic' }}>Live monitoring activates with full access</span>
        </div>
      </div>

      <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(10,15,46,0.08)' }}>
        <ZoneLabel>Fast Path</ZoneLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {FAST_PATHS.map(({ label, icon: Icon, color }) => (
            <div
              key={label}
              style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 10px', background: '#F9F9F7', border: '1px solid rgba(10,15,46,0.07)', borderRadius: 2, opacity: 0.45 }}
            >
              <Icon size={13} style={{ color, flexShrink: 0 }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: NAVY, lineHeight: 1.3 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '14px 16px', background: '#F0EDE4', borderTop: `2px solid ${GOLD}` }}>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: NAVY, marginBottom: 6 }}>
          Get Full Command Access
        </div>
        <div style={{ fontSize: 10.5, color: '#6B7280', lineHeight: 1.5, marginBottom: 10 }}>
          Live signal monitoring, one-tap Protocol activation, and executive authorization — all from this strip.
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={() => { navigate('/request-access'); onClose(); }}
            style={{ flex: 1, background: NAVY, color: '#fff', border: 'none', padding: '9px 10px', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: 2, transition: 'background 0.15s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#132558'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = NAVY; }}
          >
            Request Access
          </button>
          <button
            onClick={() => { navigate('/12-minute-experience'); onClose(); }}
            style={{ flex: 1, background: 'transparent', color: NAVY, border: `1px solid ${NAVY}`, padding: '9px 10px', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: 2, transition: 'all 0.15s' }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = NAVY; el.style.color = '#fff'; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.color = NAVY; }}
          >
            See It Live
          </button>
        </div>
      </div>
    </PanelShell>
  );
}

function ZoneLabel({ children }: { children: string }) {
  return (
    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: GOLD, marginBottom: 10 }}>
      {children}
    </div>
  );
}

function SignalStat({ label, value, color, suffix = '' }: { label: string; value: number | string; color: string; suffix?: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '8px 6px', background: '#FAFAF8', border: '1px solid rgba(10,15,46,0.07)', borderRadius: 2 }}>
      <div style={{ fontSize: 18, fontWeight: 800, color, fontFamily: "'Barlow Condensed', sans-serif", lineHeight: 1 }}>
        {value}<span style={{ fontSize: 11 }}>{suffix}</span>
      </div>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginTop: 3 }}>{label}</div>
    </div>
  );
}
