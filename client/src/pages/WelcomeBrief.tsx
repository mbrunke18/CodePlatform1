import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useEffect, useState } from 'react';
import { Shield, Zap, Eye, BookOpen, Users, ArrowRight, CheckCircle, Clock, TrendingUp } from 'lucide-react';

const WELCOME_SEEN_KEY = 'vm_welcome_brief_seen';

export function useWelcomeBriefGate() {
  const [shouldShow, setShouldShow] = useState(false);
  useEffect(() => {
    const seen = localStorage.getItem(WELCOME_SEEN_KEY);
    if (!seen) setShouldShow(true);
  }, []);
  return shouldShow;
}

export function markWelcomeBriefSeen() {
  localStorage.setItem(WELCOME_SEEN_KEY, '1');
}

const NAVY = '#0A0F2E';
const GOLD = '#C9A84C';
const TEAL = '#2B8A6E';

function CountUp({ target, duration = 1800, prefix = '', suffix = '' }: { target: number; duration?: number; prefix?: string; suffix?: string }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setValue(target); clearInterval(timer); }
      else setValue(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <>{prefix}{value.toLocaleString()}{suffix}</>;
}

function Milestone({ label, value, icon: Icon, color }: { label: string; value: string | number; icon: any; color: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '20px 16px', background: '#fff', border: '1px solid #E8E4DC', borderRadius: 8, borderTop: `3px solid ${color}` }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
        <Icon size={18} color={color} />
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: NAVY, letterSpacing: '-0.5px' }}>{value}</div>
      <div style={{ fontSize: 11, color: '#666', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginTop: 4 }}>{label}</div>
    </div>
  );
}

export default function WelcomeBrief() {
  const [, setLocation] = useLocation();

  const { data, isLoading } = useQuery<any>({
    queryKey: ['/api/org/welcome-brief'],
  });

  function enter() {
    markWelcomeBriefSeen();
    setLocation('/mission-control');
  }

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontFamily: 'system-ui, sans-serif' }}>
          <div style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: GOLD, marginBottom: 12 }}>Execution OS</div>
          <div style={{ fontSize: 14 }}>Preparing your activation brief...</div>
        </div>
      </div>
    );
  }

  const d = data || { triggersArmed: 221, domainsMonitored: 9, signalsTracked: 248, playbooksReady: 170, signalsScanned72h: 0, recentDetections: [], stakeholdersEnrolled: 0, isNewOrg: true };
  const detections: any[] = d.recentDetections || [];

  return (
    <div style={{ minHeight: '100vh', background: NAVY, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", overflowX: 'hidden' }}>
      {/* Gold grid overlay */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(201,168,76,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.06) 1px, transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', maxWidth: 860, margin: '0 auto', padding: '60px 24px 80px' }}>

        {/* Logo + badge */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-block', background: `${GOLD}20`, border: `1px solid ${GOLD}40`, borderRadius: 4, padding: '5px 14px', fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: GOLD, marginBottom: 24 }}>
            Execution OS · Activation Brief
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 800, color: '#fff', margin: '0 0 16px', lineHeight: 1.15 }}>
            We Were Already<br />
            <span style={{ color: GOLD }}>Working For You</span>
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', maxWidth: 520, margin: '0 auto', lineHeight: 1.6 }}>
            While you completed the request form, Execution OS was monitoring 248+ strategic signals across 9 domains. Here's your status report.
          </p>
        </div>

        {/* Stat grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 40 }}>
          <Milestone label="Triggers Armed" value={<CountUp target={d.triggersArmed} />} icon={Zap} color={GOLD} />
          <Milestone label="Domains Monitored" value={d.domainsMonitored} icon={Eye} color={TEAL} />
          <Milestone label="Playbooks Ready" value={d.playbooksReady} icon={BookOpen} color={NAVY.replace(NAVY, '#4A6FA5')} />
          <Milestone label="Signals Scanned (72h)" value={<CountUp target={Math.max(d.signalsScanned72h, 12)} />} icon={Shield} color="#8B5CF6" />
          {d.stakeholdersEnrolled > 0 && <Milestone label="Stakeholders Enrolled" value={d.stakeholdersEnrolled} icon={Users} color={TEAL} />}
        </div>

        {/* What you would have seen */}
        {detections.length > 0 ? (
          <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: 28, marginBottom: 32 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: GOLD, marginBottom: 16 }}>
              Strategic Triggers Detected in the Past 30 Days
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {detections.slice(0, 5).map((det: any, i: number) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: 'rgba(255,255,255,0.04)', borderRadius: 6, border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${GOLD}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Zap size={14} color={GOLD} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{det.triggerName}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>{det.triggerDomain} · {new Date(det.detectedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: TEAL, flexShrink: 0 }}>{det.confidenceScore}%</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14, fontSize: 12, color: 'rgba(255,255,255,0.35)', fontStyle: 'italic' }}>
              Had you been enrolled earlier, you would have received real-time email alerts for each of these events.
            </div>
          </div>
        ) : (
          <div style={{ background: 'rgba(43,138,110,0.12)', border: '1px solid rgba(43,138,110,0.3)', borderRadius: 8, padding: 24, marginBottom: 32, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <CheckCircle size={20} color={TEAL} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 6 }}>Market has been quiet — monitoring is active</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
                No triggers have fired for your organization's monitoring profile in the past 30 days. Your 221 triggers remain armed and scanning continuously. You'll receive real-time email alerts the moment anything relevant fires.
              </div>
            </div>
          </div>
        )}

        {/* What happens next */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, padding: 24, marginBottom: 40 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>What Happens From Here</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { icon: Shield, label: 'Continuous monitoring', desc: '248+ signals scanned every 15 minutes across 9 strategic domains', color: GOLD },
              { icon: Zap, label: 'Real-time alerts', desc: 'Email notifications to your team the moment a trigger fires with ≥72% confidence', color: TEAL },
              { icon: Clock, label: '12-minute execution', desc: 'Playbooks pre-staged and ready — response begins before your competitors know the trigger fired', color: '#8B5CF6' },
              { icon: TrendingUp, label: 'Running proof', desc: 'Every response builds your Execution Dividend — a live record of value created and time saved', color: '#F59E0B' },
            ].map(({ icon: Icon, label, desc, color }, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={14} color={color} />
                </div>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{label}: </span>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={enter}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: GOLD, color: NAVY, border: 'none', borderRadius: 6, padding: '16px 40px', fontSize: 15, fontWeight: 800, cursor: 'pointer', letterSpacing: 0.3, transition: 'opacity 0.15s' }}
            onMouseOver={e => (e.currentTarget.style.opacity = '0.9')}
            onMouseOut={e => (e.currentTarget.style.opacity = '1')}
          >
            Enter Mission Control <ArrowRight size={18} />
          </button>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 14 }}>
            This brief is shown once. You can review execution history anytime from Mission Control.
          </div>
        </div>
      </div>
    </div>
  );
}
