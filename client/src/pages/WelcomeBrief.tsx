import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useEffect, useRef, useState } from 'react';
import { Shield, Zap, Eye, BookOpen, Users, ArrowRight, CheckCircle, Clock, TrendingUp, Radio, AlertTriangle } from 'lucide-react';

const WELCOME_SEEN_KEY = 'vm_welcome_brief_seen';
const NAVY = '#0A0F2E';
const GOLD = '#C9A84C';
const TEAL = '#2B8A6E';

export function markWelcomeBriefSeen() {
  localStorage.setItem(WELCOME_SEEN_KEY, '1');
}

function useCountUp(target: number, duration = 2000, delay = 0) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      const start = Date.now();
      const tick = () => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.floor(eased * target));
        if (progress < 1) requestAnimationFrame(tick);
        else setValue(target);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(t);
  }, [target, duration, delay]);
  return value;
}

function AnimatedStat({ target, label, prefix = '', suffix = '', delay = 0, color = GOLD }: {
  target: number; label: string; prefix?: string; suffix?: string; delay?: number; color?: string;
}) {
  const value = useCountUp(target, 1800, delay);
  return (
    <div style={{ textAlign: 'center', padding: '24px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderTop: `2px solid ${color}` }}>
      <div style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: '#fff', lineHeight: 1, letterSpacing: '-1px', fontVariantNumeric: 'tabular-nums' }}>
        {prefix}{value.toLocaleString()}{suffix}
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '1.2px', marginTop: 8 }}>{label}</div>
    </div>
  );
}

function PulseOrb({ color, size = 8 }: { color: string; size?: number }) {
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: 0, background: color, opacity: 0.25, animation: 'pulse 2s ease-in-out infinite' }} />
      <div style={{ position: 'absolute', inset: 2, borderRadius: 0, background: color }} />
      <style>{`@keyframes pulse { 0%,100%{transform:scale(1);opacity:0.25} 50%{transform:scale(2.2);opacity:0.1} }`}</style>
    </div>
  );
}

function DetectionRow({ det, i }: { det: any; i: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 600 + i * 120); return () => clearTimeout(t); }, [i]);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px',
      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
      borderLeft: `2px solid ${GOLD}50`,
      transition: 'opacity 0.5s, transform 0.5s', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(8px)',
    }}>
      <div style={{ width: 6, height: 6, background: GOLD, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{det.triggerName}</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
          {det.triggerDomain} · {new Date(det.detectedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: TEAL }}>{det.confidenceScore}%</div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>confidence</div>
      </div>
    </div>
  );
}

export default function WelcomeBrief() {
  const [, setLocation] = useLocation();
  const [heroVisible, setHeroVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  const { data, isLoading } = useQuery<any>({ queryKey: ['/api/org/welcome-brief'] });

  useEffect(() => {
    markWelcomeBriefSeen();
    const t1 = setTimeout(() => setHeroVisible(true), 100);
    const t2 = setTimeout(() => setStatsVisible(true), 500);
    const t3 = setTimeout(() => setContentVisible(true), 900);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  function enter() {
    markWelcomeBriefSeen();
    setLocation('/mission-control');
  }

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: `2px solid ${GOLD}30`, borderTop: `2px solid ${GOLD}`, borderRadius: 0, margin: '0 auto 20px', animation: 'spin 1s linear infinite' }} />
          <div style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: GOLD, marginBottom: 8 }}>Readiness OS</div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Preparing your activation brief...</div>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      </div>
    );
  }

  const d = data || {
    triggersArmed: 221, domainsMonitored: 9, signalsTracked: 248, playbooksReady: 170,
    signalsScanned72h: 0, recentDetections: [], stakeholdersEnrolled: 0, isNewOrg: true,
  };
  const detections: any[] = d.recentDetections || [];
  const hasDetections = detections.length > 0;
  const activationDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div style={{ minHeight: '100vh', background: NAVY, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", overflowX: 'hidden' }}>
      {/* Gold grid overlay */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(201,168,76,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.06) 1px, transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none', zIndex: 0 }} />

      {/* Ambient orbs */}
      <div style={{ position: 'fixed', top: -200, right: -200, width: 700, height: 700, borderRadius: 0, background: 'radial-gradient(circle, rgba(43,138,110,0.12) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: -300, left: -200, width: 800, height: 800, borderRadius: 0, background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Top navigation escape */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10, padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', pointerEvents: 'none' }}>
        <a href="/" style={{ pointerEvents: 'all', display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.45)', fontSize: 12, fontWeight: 600, textDecoration: 'none', letterSpacing: '0.06em', background: 'rgba(0,0,0,0.25)', padding: '6px 12px', borderRadius: 0, border: '1px solid rgba(255,255,255,0.1)' }}>
          ← Homepage
        </a>
        <a href="/mission-control" style={{ pointerEvents: 'all', display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.45)', fontSize: 12, fontWeight: 600, textDecoration: 'none', letterSpacing: '0.06em', background: 'rgba(0,0,0,0.25)', padding: '6px 12px', borderRadius: 0, border: '1px solid rgba(255,255,255,0.1)' }}>
          Skip to Mission Control →
        </a>
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 880, margin: '0 auto', padding: '64px 24px 96px' }}>

        {/* ── HEADER ── */}
        <div style={{
          textAlign: 'center', marginBottom: 56,
          opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(-16px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
        }}>
          {/* Status badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
            <div style={{ width: 24, height: 1, background: TEAL }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: TEAL }}>System Live · {activationDate}</span>
            <div style={{ width: 24, height: 1, background: TEAL }} />
          </div>

          {/* Headline */}
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(32px, 5.5vw, 56px)', fontWeight: 700, color: '#fff', margin: '0 0 16px', lineHeight: 1.1 }}>
            Your Readiness Infrastructure<br />
            <em style={{ fontStyle: 'italic', color: GOLD }}>Was Already Working</em>
          </h1>

          <p style={{ fontSize: 'clamp(13px, 1.6vw, 15px)', fontStyle: 'italic', color: GOLD, maxWidth: 480, margin: '0 auto 12px', lineHeight: 1.5, fontWeight: 500 }}>
            The response is ready before the trigger fires.
          </p>

          <p style={{ fontSize: 'clamp(14px, 2vw, 17px)', color: 'rgba(255,255,255,0.5)', maxWidth: 560, margin: '0 auto 28px', lineHeight: 1.65 }}>
            We didn't wait for you to log in. While your account was being configured, Readiness OS was monitoring
            248+ strategic signals across 9 domains. This is your activation brief.
          </p>

          {/* 3,600× callout */}
          <div style={{ display: 'inline-block', background: `${GOLD}10`, border: `1px solid ${GOLD}30`, padding: '14px 28px', maxWidth: 560 }}>
            <div style={{ fontSize: 12, color: GOLD, fontWeight: 700, letterSpacing: '0.5px', marginBottom: 4 }}>3,600× EXECUTION HEAD START</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.55 }}>
              When the first trigger fires, your organization activates in 12 minutes. Competitors spend 30 days just figuring out who needs to be in the room. That gap is structural — and it's already in your favor.
            </div>
          </div>
        </div>

        {/* ── STAT GRID ── */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 48,
          opacity: statsVisible ? 1 : 0, transform: statsVisible ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
        }}>
          <AnimatedStat target={d.triggersArmed} label="Triggers Armed" color={GOLD} delay={0} />
          <AnimatedStat target={d.domainsMonitored} label="Domains Monitored" color={TEAL} delay={120} />
          <AnimatedStat target={d.playbooksReady} label="Readiness Protocols Pre-Staged" color={TEAL} delay={240} />
          <AnimatedStat target={d.signalsTracked} label="Signals Tracked" suffix="+" color={GOLD} delay={360} />
          {d.stakeholdersEnrolled > 0 && (
            <AnimatedStat target={d.stakeholdersEnrolled} label="Stakeholders Enrolled" color={TEAL} delay={480} />
          )}
        </div>

        {/* ── DETECTION PANEL ── */}
        <div style={{
          marginBottom: 40,
          opacity: contentVisible ? 1 : 0, transform: contentVisible ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
        }}>
          {hasDetections ? (
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.10)', padding: '28px 28px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1.8px', textTransform: 'uppercase', color: GOLD, marginBottom: 6 }}>
                    Strategic Triggers Detected — Past 30 Days
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>
                    These events fired while monitoring was active. You would have received real-time alerts for each.
                  </div>
                </div>
                <div style={{ background: `${GOLD}18`, border: `1px solid ${GOLD}30`, padding: '4px 12px', flexShrink: 0, marginLeft: 20 }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: GOLD }}>{detections.length}</span>
                  <span style={{ fontSize: 10, color: `${GOLD}80`, marginLeft: 4, textTransform: 'uppercase', letterSpacing: 1 }}>events</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {detections.slice(0, 6).map((det: any, i: number) => (
                  <DetectionRow key={i} det={det} i={i} />
                ))}
              </div>
              <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.07)', fontSize: 12, color: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Radio size={12} color="rgba(255,255,255,0.3)" />
                Continuous monitoring is active. Alerts will be sent to enrolled stakeholders in real time.
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ background: 'rgba(43,138,110,0.09)', border: '1px solid rgba(43,138,110,0.25)', borderLeft: `3px solid ${TEAL}`, padding: '24px 24px' }}>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: TEAL, marginBottom: 8 }}>Signal Status</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Market has been quiet</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
                  No triggers have fired in the past 30 days. Your {d.triggersArmed} armed triggers remain active and scanning every 15 minutes across all 9 strategic domains.
                </div>
              </div>
              <div style={{ background: 'rgba(201,168,76,0.07)', border: '1px solid rgba(201,168,76,0.22)', borderLeft: `3px solid ${GOLD}`, padding: '24px 24px' }}>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD, marginBottom: 8 }}>Active Coverage</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 8 }}>What's being watched</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
                  248+ signals across market dynamics, regulatory change, geopolitical risk, technology disruption, supply chain, talent, ESG, financial performance, and operational risk.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── 30-DAY ACTIVATION ARC ── */}
        <div style={{
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderLeft: `3px solid ${GOLD}`,
          padding: '28px 28px 24px', marginBottom: 24,
          opacity: contentVisible ? 1 : 0, transition: 'opacity 0.7s ease 0.15s',
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1.8px', textTransform: 'uppercase', color: GOLD, marginBottom: 20 }}>Your First 30 Days — Activation Arc</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
            {[
              {
                day: 'Day 1',
                title: 'Platform Armed',
                desc: '221 triggers active. 248+ signals scanning. Your organization is already being monitored.',
                color: TEAL,
              },
              {
                day: 'Week 1',
                title: 'First Alert',
                desc: 'Your first trigger fires. You built the response. You activate it — not because it was handed to you, but because you constructed it.',
                color: GOLD,
              },
              {
                day: 'Week 2',
                title: 'Shadow Simulation',
                desc: 'Run a dry-run through your top 3 strategic scenarios. Board-ready confidence scores generated.',
                color: TEAL,
              },
              {
                day: 'Day 30',
                title: 'Execution Benchmark',
                desc: '30-day debrief: activation count, response time vs. industry baseline, institutional memory built.',
                color: GOLD,
              },
            ].map(({ day, title, desc, color }, i) => (
              <div key={day} style={{ position: 'relative', paddingLeft: 16, borderLeft: `2px solid ${color}30` }}>
                <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color, marginBottom: 4 }}>{day}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{title}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', lineHeight: 1.6 }}>{desc}</div>
                {i < 3 && (
                  <div style={{ position: 'absolute', right: -12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.15)', fontSize: 16, display: 'none' }}>→</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── WHAT HAPPENS NEXT ── */}
        <div style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '28px 28px 24px', marginBottom: 48,
          opacity: contentVisible ? 1 : 0, transition: 'opacity 0.7s ease 0.2s',
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1.8px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 20 }}>Your Readiness Infrastructure — Live Now</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 0 }}>
            {[
              { label: 'Continuous Monitoring', desc: '248+ signals scanned every 15 minutes, 24/7, across 9 strategic domains.', color: GOLD },
              { label: 'Real-Time Alerts', desc: 'Email notifications to enrolled stakeholders within minutes of a trigger firing at ≥72% confidence.', color: TEAL },
              { label: '12-Minute Activation', desc: '170 Readiness Protocols are pre-staged. Response begins before competitors know the trigger fired.', color: GOLD },
              { label: 'Readiness Dividend', desc: 'Every response builds a live record of executive hours saved and value created.', color: TEAL },
            ].map(({ label, desc, color }, i) => (
              <div key={i} style={{ padding: '16px 20px 16px 16px', borderLeft: `2px solid ${color}30`, marginLeft: i === 0 ? 0 : 0 }}>
                <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color, marginBottom: 6 }}>{label}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div style={{
          textAlign: 'center',
          opacity: contentVisible ? 1 : 0, transition: 'opacity 0.7s ease 0.3s',
        }}>
          <button
            onClick={enter}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 12,
              background: GOLD, color: NAVY, border: 'none',
              padding: '18px 48px', fontSize: 15, fontWeight: 800, cursor: 'pointer',
              letterSpacing: '0.08em', textTransform: 'uppercase',
              fontFamily: "'Barlow Condensed', sans-serif",
              transition: 'all 0.2s ease',
            }}
            onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.9'; }}
            onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
          >
            Enter Mission Control
            <ArrowRight size={20} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 16 }}>
            <Eye size={11} color="rgba(255,255,255,0.2)" />
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>
              This brief is shown once. Full execution history is always available from Mission Control.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
