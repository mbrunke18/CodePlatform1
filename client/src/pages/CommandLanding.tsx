import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { ExecuteIQLogo } from '@/components/ExecuteIQLogo';

interface ProviderStatus {
  provider: string;
  azureReady: boolean;
  configured: boolean;
  teamsConfigured: boolean;
  slackConfigured: boolean;
  ideaAgentsEnabled: boolean;
  multiAgentParallel: boolean;
}

const NAVY = '#0A0F2E';
const GOLD = '#C9A84C';
const TEAL = '#2B8A6E';

function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

function formatDatetime(d: Date) {
  return d.toLocaleString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  }).replace(',', '').replace(',', ' ·');
}

function RadarCanvas({ signalCount }: { signalCount: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frame = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 180, H = 180;
    const cx = W / 2, cy = H / 2, r = 76;
    const sweepRef = { angle: 0 };

    const dots: { angle: number; dist: number; age: number; size: number }[] = [];
    for (let i = 0; i < 8; i++) {
      dots.push({ angle: Math.random() * Math.PI * 2, dist: 0.3 + Math.random() * 0.65, age: Math.random() * 120, size: 1.5 + Math.random() * 2 });
    }

    function draw() {
      ctx!.clearRect(0, 0, W, H);

      // Rings
      [0.33, 0.66, 1].forEach(f => {
        ctx!.beginPath();
        ctx!.arc(cx, cy, r * f, 0, Math.PI * 2);
        ctx!.strokeStyle = 'rgba(43,138,110,0.18)';
        ctx!.lineWidth = 1;
        ctx!.stroke();
      });

      // Cross lines
      ctx!.strokeStyle = 'rgba(43,138,110,0.12)';
      ctx!.lineWidth = 0.5;
      [[cx, cy - r, cx, cy + r], [cx - r, cy, cx + r, cy]].forEach(([x1, y1, x2, y2]) => {
        ctx!.beginPath(); ctx!.moveTo(x1, y1); ctx!.lineTo(x2, y2); ctx!.stroke();
      });

      // Sweep gradient
      const a = sweepRef.angle;
      const grad = ctx!.createConicalGradient ? null : null;
      ctx!.save();
      ctx!.translate(cx, cy);
      ctx!.rotate(a);
      const sweepGrad = ctx!.createLinearGradient(0, 0, r, 0);
      sweepGrad.addColorStop(0, 'rgba(43,138,110,0.55)');
      sweepGrad.addColorStop(1, 'rgba(43,138,110,0)');
      ctx!.beginPath();
      ctx!.moveTo(0, 0);
      ctx!.arc(0, 0, r, -Math.PI * 0.35, 0);
      ctx!.closePath();
      ctx!.fillStyle = sweepGrad;
      ctx!.fill();
      ctx!.restore();

      // Sweep line
      ctx!.beginPath();
      ctx!.moveTo(cx, cy);
      ctx!.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
      ctx!.strokeStyle = 'rgba(43,138,110,0.9)';
      ctx!.lineWidth = 1.5;
      ctx!.stroke();

      // Dots
      dots.forEach(dot => {
        const angleDiff = (a - dot.angle + Math.PI * 2) % (Math.PI * 2);
        const opacity = angleDiff < 0.6 ? (1 - angleDiff / 0.6) * 0.9 : Math.max(0, 0.4 - dot.age / 200);
        if (opacity <= 0) return;
        const dx = cx + Math.cos(dot.angle) * r * dot.dist;
        const dy = cy + Math.sin(dot.angle) * r * dot.dist;
        ctx!.beginPath();
        ctx!.arc(dx, dy, dot.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(43,138,110,${opacity})`;
        ctx!.fill();
        dot.age++;
        if (dot.age > 160) { dot.age = 0; dot.angle = Math.random() * Math.PI * 2; dot.dist = 0.3 + Math.random() * 0.65; }
      });

      sweepRef.angle = (sweepRef.angle + 0.018) % (Math.PI * 2);
      frame.current = requestAnimationFrame(draw);
    }

    frame.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame.current);
  }, []);

  return (
    <div style={{ position: 'relative', width: 180, height: 180, margin: '0 auto' }}>
      <canvas ref={canvasRef} width={180} height={180} style={{ width: 180, height: 180 }} />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center', pointerEvents: 'none' }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: TEAL, lineHeight: 1 }}>{signalCount}</div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'rgba(240,237,228,0.3)', letterSpacing: 1 }}>SIGNALS</div>
      </div>
    </div>
  );
}

function NavIcon({ active, title, onClick, children }: { active?: boolean; title: string; onClick: () => void; children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      title={title}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 40, height: 40, borderRadius: 8,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', transition: 'all 0.2s ease',
        background: (active || hovered) ? 'rgba(201,168,76,0.15)' : 'transparent',
        border: `1px solid ${(active || hovered) ? 'rgba(201,168,76,0.2)' : 'transparent'}`,
        color: (active || hovered) ? GOLD : 'rgba(240,237,228,0.45)',
      }}
    >{children}</div>
  );
}

function PulseDot({ color = TEAL, delay = 0 }: { color?: string; delay?: number }) {
  return (
    <span style={{
      display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
      background: color, animation: `cl-pulse 1.5s ease-in-out ${delay}s infinite`,
    }} />
  );
}

function Tile({ children, className, style, onClick }: { children: React.ReactNode; className?: string; style?: React.CSSProperties; onClick?: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={className}
      style={{
        background: '#111830', border: '1px solid rgba(240,237,228,0.08)',
        borderRadius: 12, padding: 28, cursor: 'pointer', position: 'relative', overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        borderColor: hovered ? 'rgba(240,237,228,0.15)' : 'rgba(240,237,228,0.08)',
        ...style,
      }}
    >{children}</div>
  );
}

function TileArrow({ hovered }: { hovered?: boolean }) {
  return (
    <div style={{
      position: 'absolute', bottom: 20, right: 20,
      width: 28, height: 28, borderRadius: '50%',
      border: '1px solid rgba(240,237,228,0.2)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      opacity: hovered ? 1 : 0, transition: 'opacity 0.2s ease',
    }}>
      <svg width={12} height={12} fill="none" viewBox="0 0 24 24" stroke="rgba(240,237,228,0.6)" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
      </svg>
    </div>
  );
}

function HoverTile({ children, style, onClick, borderGold, borderTeal }: {
  children: (hovered: boolean) => React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
  borderGold?: boolean;
  borderTeal?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const base = borderGold ? 'rgba(201,168,76,0.2)' : borderTeal ? 'rgba(43,138,110,0.25)' : 'rgba(240,237,228,0.08)';
  const hov = borderGold ? GOLD : borderTeal ? TEAL : 'rgba(240,237,228,0.15)';
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 12, cursor: 'pointer', position: 'relative', overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        border: `1px solid ${hovered ? hov : base}`,
        boxShadow: hovered && borderGold ? '0 0 40px rgba(201,168,76,0.12),0 20px 60px rgba(0,0,0,0.4)'
          : hovered && borderTeal ? '0 0 40px rgba(43,138,110,0.1),0 20px 60px rgba(0,0,0,0.4)'
          : hovered ? '0 20px 60px rgba(0,0,0,0.3)' : 'none',
        ...style,
      }}
    >{children(hovered)}</div>
  );
}

export default function CommandLanding() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const now = useClock();

  const { data: statusData } = useQuery<any>({ queryKey: ['/api/dynamic-strategy/status'], retry: false });
  const { data: signalsData } = useQuery<any>({ queryKey: ['/api/dynamic-strategy/weak-signals'], retry: false });
  const { data: maturityData } = useQuery<any>({ queryKey: ['/api/intelligence/maturity-score'], retry: false });
  const { data: providerData } = useQuery<ProviderStatus>({ queryKey: ['/api/ai/provider-status'], retry: false, staleTime: 60000 });

  const rawStatus = statusData?.status;
  const status = (rawStatus && typeof rawStatus === 'object') ? rawStatus : null;
  const activeScenarios = status?.activeScenarios ?? 0;

  const signals = signalsData?.signals ?? [];
  const signalCount = 248;

  const maturity = maturityData?.maturityScore ?? maturityData?.score ?? 12;
  const readiness = maturityData?.readiness ?? 35;

  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.firstName || 'Executive';
  const lastName = user?.lastName || '';
  const initials = user?.initials || (firstName[0] + (lastName[0] || '')).toUpperCase();
  const displayName = lastName || firstName;

  const environmentStatus = activeScenarios > 0
    ? `${activeScenarios} active execution${activeScenarios > 1 ? 's' : ''} in progress.`
    : 'Your environment is stable. No active triggers.';

  const signalItems = signals.length > 0
    ? signals.slice(0, 3).map((s: any) => ({ name: s.title || s.category, level: s.confidence > 0.7 ? 'high' : s.confidence > 0.4 ? 'med' : 'low' }))
    : [
        { name: 'Market Dynamics', level: 'high' },
        { name: 'Competitive Intel', level: 'med' },
        { name: 'Regulatory', level: 'low' },
      ];

  const badgeColor = (level: string) => ({
    high: { bg: 'rgba(201,168,76,0.15)', color: GOLD, border: 'rgba(201,168,76,0.25)', label: 'Elevated' },
    med:  { bg: 'rgba(43,138,110,0.15)',  color: TEAL, border: 'rgba(43,138,110,0.25)',  label: 'Nominal' },
    low:  { bg: 'rgba(240,237,228,0.05)', color: 'rgba(240,237,228,0.45)', border: 'rgba(240,237,228,0.1)', label: 'Stable' },
  })[level] ?? { bg: 'rgba(240,237,228,0.05)', color: 'rgba(240,237,228,0.45)', border: 'rgba(240,237,228,0.1)', label: level };

  return (
    <>
      <style>{`
        @keyframes cl-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.7)} }
        @keyframes cl-live { 0%,100%{box-shadow:0 0 0 0 rgba(43,138,110,0.4)} 50%{box-shadow:0 0 0 6px rgba(43,138,110,0)} }
        @keyframes cl-fadeup { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes cl-prog { 0%,100%{opacity:1} 50%{opacity:0.7} }
        .cl-tile-1{animation:cl-fadeup 0.5s ease 0.1s both}
        .cl-tile-2{animation:cl-fadeup 0.5s ease 0.2s both}
        .cl-tile-3{animation:cl-fadeup 0.5s ease 0.25s both}
        .cl-tile-4{animation:cl-fadeup 0.5s ease 0.3s both}
        .cl-tile-5{animation:cl-fadeup 0.5s ease 0.35s both}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(240,237,228,0.08);border-radius:2px}
      `}</style>

      <div style={{ background: NAVY, minHeight: '100vh', color: '#F0EDE4', fontFamily: "'Crimson Pro', serif", overflow: 'hidden' }}>

        {/* Grain overlay */}
        <div style={{
          position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1000, opacity: 0.35,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
        }} />

        {/* Grid background */}
        <div style={{
          position: 'fixed', inset: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(240,237,228,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(240,237,228,0.06) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }} />

        {/* ── HEADER ── */}
        <header style={{
          position: 'fixed', top: 0, left: 0, right: 0, height: 64,
          background: 'rgba(10,15,46,0.94)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(240,237,228,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 32px', zIndex: 200,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }} onClick={() => setLocation('/')}>
            <ExecuteIQLogo height={38} color="white" variant="full" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {/* AI Provider badge */}
            {providerData && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '4px 10px', borderRadius: 4,
                background: providerData.azureReady ? 'rgba(0,120,212,0.12)' : 'rgba(43,138,110,0.1)',
                border: `1px solid ${providerData.azureReady ? 'rgba(0,120,212,0.25)' : 'rgba(43,138,110,0.2)'}`,
              }}>
                <svg width={9} height={9} viewBox="0 0 24 24" fill={providerData.azureReady ? '#0078D4' : TEAL}>
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 1.5, color: providerData.azureReady ? '#5BA3E8' : TEAL }}>
                  {providerData.azureReady ? 'AZURE AI' : 'AI'} · {providerData.multiAgentParallel ? '4 AGENTS' : 'READY'}
                </span>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'rgba(240,237,228,0.5)' }}>
              <PulseDot color={TEAL} />SIGNALS ACTIVE
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'rgba(240,237,228,0.5)' }}>
              <PulseDot color={GOLD} delay={0.5} />{signalCount} MONITORING
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'rgba(240,237,228,0.3)' }}>
              {activeScenarios > 0 ? `${activeScenarios} ACTIVE` : 'NO ACTIVE TRIGGERS'}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'rgba(240,237,228,0.45)', letterSpacing: 1 }}>
              {lastName ? `${lastName.toUpperCase()}` : firstName.toUpperCase()} · {user?.role?.toUpperCase() || 'EXEC'}
            </div>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'DM Mono', monospace", fontSize: 12, color: GOLD,
            }}>{initials}</div>
          </div>
        </header>

        {/* ── SIDE NAV ── */}
        <nav style={{
          position: 'fixed', left: 0, top: 64, bottom: 0, width: 56,
          background: 'rgba(10,15,46,0.88)', backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(240,237,228,0.08)',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '24px 0', gap: 8, zIndex: 100,
        }}>
          <NavIcon active title="Command Center" onClick={() => setLocation('/command-center')}>
            <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
          </NavIcon>
          <NavIcon title="Signal Intelligence" onClick={() => setLocation('/signal-intelligence')}>
            <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.348 14.651a3.75 3.75 0 010-5.303m5.304 0a3.75 3.75 0 010 5.303m-7.425 2.122a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M5.106 18.894c-3.808-3.808-3.808-9.98 0-13.789m13.788 0c3.808 3.809 3.808 9.981 0 13.79M12 12h.008v.007H12V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </NavIcon>
          <NavIcon title="Playbook Library" onClick={() => setLocation('/playbook-library')}>
            <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </NavIcon>
          <div style={{ width: 24, height: 1, background: 'rgba(240,237,228,0.08)', margin: '8px 0' }} />
          <NavIcon title="Mission Control" onClick={() => setLocation('/mission-control')}>
            <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </NavIcon>
          <NavIcon title="Performance & ROI" onClick={() => setLocation('/execution-history')}>
            <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
          </NavIcon>
          <div style={{ width: 24, height: 1, background: 'rgba(240,237,228,0.08)', margin: '8px 0' }} />
          <NavIcon title="Settings" onClick={() => setLocation('/settings')}>
            <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </NavIcon>
        </nav>

        {/* ── MAIN ── */}
        <main style={{ marginLeft: 56, marginTop: 64, padding: '40px 40px 60px 48px', minHeight: 'calc(100vh - 64px)' }}>

          {/* Page header */}
          <div style={{ marginBottom: 36, animation: 'cl-fadeup 0.5s ease both' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 13, letterSpacing: 4, color: GOLD, textTransform: 'uppercase' }}>
                Command Center
              </div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'rgba(240,237,228,0.25)', letterSpacing: 1 }}>
                {formatDatetime(now)}
              </div>
            </div>
            <div style={{ fontFamily: "'Crimson Pro', serif", fontSize: 32, fontWeight: 300, color: '#F0EDE4', letterSpacing: 0.5, lineHeight: 1.2 }}>
              {greeting}, <strong style={{ fontWeight: 600, color: '#fff' }}>{displayName}.</strong>{' '}
              {environmentStatus}
            </div>
          </div>

          {/* Tile Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr', gridTemplateRows: 'auto auto', gap: 16, maxWidth: 1400 }}>

            {/* ── TILE 1: ACTIVATE (spans 2 rows) ── */}
            <div className="cl-tile-1" style={{ gridColumn: 1, gridRow: '1 / 3' }}>
              <HoverTile
                borderGold
                onClick={() => setLocation('/playbook-library')}
                style={{
                  background: 'linear-gradient(135deg, #1A1200 0%, #0A0F2E 60%)',
                  padding: 36, height: '100%',
                }}
              >
                {(hovered) => (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 3, color: GOLD, textTransform: 'uppercase' }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: GOLD, display: 'inline-block', animation: 'cl-pulse 1.5s infinite' }} />
                      Primary Action
                    </div>

                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 52, lineHeight: 0.95, color: GOLD, letterSpacing: 2, marginBottom: 16 }}>
                      ACTIVATE<br />PLAYBOOK
                    </div>

                    <div style={{ fontSize: 17, fontWeight: 300, color: 'rgba(240,237,228,0.65)', lineHeight: 1.5, marginBottom: 32, maxWidth: 320 }}>
                      A strategic event just fired.<br /><em style={{ color: '#F0EDE4', fontStyle: 'italic' }}>Start here.</em> Deploy a pre-staged response architecture in under 12 minutes.
                    </div>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 28 }}>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 48, fontWeight: 300, color: GOLD, lineHeight: 1 }}>12</div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'rgba(240,237,228,0.45)', letterSpacing: 2 }}>MIN TO<br />EXECUTION</div>
                    </div>

                    <button
                      onClick={(e) => { e.stopPropagation(); setLocation('/playbook-library'); }}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                        background: GOLD, color: NAVY,
                        fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 500, letterSpacing: 2, textTransform: 'uppercase',
                        padding: '14px 28px', borderRadius: 6, border: 'none', cursor: 'pointer',
                        width: '100%', marginBottom: 12, transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#DFB85C'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = GOLD; }}
                    >
                      SELECT PLAYBOOK & ACTIVATE
                      <svg width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </button>

                    <button
                      onClick={(e) => { e.stopPropagation(); setLocation('/12-minute-experience'); }}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        background: 'transparent', color: 'rgba(240,237,228,0.45)',
                        fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase',
                        padding: '10px 20px', borderRadius: 6, border: '1px solid rgba(240,237,228,0.1)', cursor: 'pointer',
                        width: '100%', transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,168,76,0.3)'; (e.currentTarget as HTMLButtonElement).style.color = GOLD; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(240,237,228,0.1)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(240,237,228,0.45)'; }}
                    >
                      RUN SIMULATION FIRST
                    </button>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 24 }}>
                      {[
                        { label: 'Competitive', type: 'offense' }, { label: 'M&A', type: 'offense' },
                        { label: 'Crisis', type: 'defense' }, { label: 'Cyber', type: 'defense' },
                        { label: 'Regulatory', type: 'defense' }, { label: 'AI Gov', type: 'special' },
                        { label: 'Transform', type: 'special' },
                      ].map(({ label, type }) => (
                        <div key={label} style={{
                          fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase',
                          padding: '4px 10px', borderRadius: 3,
                          border: `1px solid ${type === 'offense' ? 'rgba(43,138,110,0.3)' : type === 'defense' ? 'rgba(201,168,76,0.25)' : 'rgba(130,100,200,0.3)'}`,
                          color: type === 'offense' ? TEAL : type === 'defense' ? GOLD : 'rgba(180,150,255,0.7)',
                        }}>{label}</div>
                      ))}
                    </div>
                  </>
                )}
              </HoverTile>
            </div>

            {/* ── TILE 2: SIGNAL RADAR ── */}
            <div className="cl-tile-2" style={{ gridColumn: 2, gridRow: 1 }}>
              <HoverTile
                borderTeal
                onClick={() => setLocation('/signal-intelligence')}
                style={{ background: 'linear-gradient(135deg, #001A12 0%, #0A0F2E 60%)', minHeight: 320 }}
              >
                {(hovered) => (
                  <div style={{ padding: 28 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 3, color: TEAL, textTransform: 'uppercase' }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: TEAL, display: 'inline-block', animation: 'cl-pulse 2s infinite 0.3s' }} />
                      Signal Intelligence
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0' }}>
                      <RadarCanvas signalCount={signalCount} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                      {signalItems.map((sig, i) => {
                        const b = badgeColor(sig.level);
                        return (
                          <div key={i} style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '7px 10px', background: 'rgba(43,138,110,0.05)',
                            border: '1px solid rgba(43,138,110,0.1)', borderRadius: 4,
                            fontFamily: "'DM Mono', monospace", fontSize: 10,
                          }}>
                            <span style={{ color: '#F0EDE4', letterSpacing: 0.5 }}>{sig.name}</span>
                            <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 2, letterSpacing: 1, textTransform: 'uppercase', background: b.bg, color: b.color, border: `1px solid ${b.border}` }}>
                              {b.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <TileArrow hovered={hovered} />
                  </div>
                )}
              </HoverTile>
            </div>

            {/* ── TILE 3: PLAYBOOKS ── */}
            <div className="cl-tile-3" style={{ gridColumn: 3, gridRow: 1 }}>
              <HoverTile
                onClick={() => setLocation('/playbook-library')}
                style={{ background: '#111830', minHeight: 320 }}
              >
                {(hovered) => (
                  <div style={{ padding: 28 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 3, color: 'rgba(240,237,228,0.4)', textTransform: 'uppercase' }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(240,237,228,0.3)', display: 'inline-block' }} />
                      Playbook Library
                    </div>

                    <div style={{ fontFamily: "'Crimson Pro', serif", fontSize: 22, fontWeight: 600, color: '#fff', lineHeight: 1.2, marginBottom: 8 }}>
                      170 Response<br />Architectures
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 300, color: 'rgba(240,237,228,0.45)', lineHeight: 1.5, marginBottom: 20 }}>
                      Pre-built, AI-informed execution playbooks across 9 strategic domains.
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, margin: '16px 0' }}>
                      {[
                        { label: 'Offense', count: 58, type: 'offense' },
                        { label: 'Defense', count: 58, type: 'defense' },
                        { label: 'Sp. Teams', count: 54, type: 'special' },
                      ].map(({ label, count, type }) => (
                        <div key={label} style={{
                          padding: '12px 10px', borderRadius: 6, textAlign: 'center',
                          border: `1px solid ${type === 'offense' ? 'rgba(43,138,110,0.2)' : type === 'defense' ? 'rgba(201,168,76,0.2)' : 'rgba(130,100,200,0.2)'}`,
                          transition: 'all 0.2s ease',
                        }}>
                          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4, color: type === 'offense' ? TEAL : type === 'defense' ? GOLD : 'rgba(180,150,255,0.8)' }}>{label}</div>
                          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, lineHeight: 1, color: '#fff' }}>{count}</div>
                          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'rgba(240,237,228,0.3)', letterSpacing: 0.5 }}>playbooks</div>
                        </div>
                      ))}
                    </div>
                    <TileArrow hovered={hovered} />
                  </div>
                )}
              </HoverTile>
            </div>

            {/* ── TILE 4: MISSION CONTROL ── */}
            <div className="cl-tile-4" style={{ gridColumn: 2, gridRow: 2 }}>
              <HoverTile onClick={() => setLocation('/mission-control')} style={{ background: '#111830' }}>
                {(hovered) => (
                  <div style={{ padding: 28 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 3, color: 'rgba(240,237,228,0.4)', textTransform: 'uppercase' }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(240,237,228,0.3)', display: 'inline-block' }} />
                      Mission Control
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: TEAL, display: 'inline-block', animation: 'cl-live 1s ease-in-out infinite' }} />
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: TEAL, letterSpacing: 2, textTransform: 'uppercase' }}>Live Coordination</span>
                    </div>

                    <div style={{ background: 'rgba(43,138,110,0.05)', border: '1px solid rgba(43,138,110,0.15)', borderRadius: 6, padding: 12, marginBottom: 12 }}>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#F0EDE4', letterSpacing: 0.5, marginBottom: 8 }}>
                        {activeScenarios > 0 ? `${activeScenarios} active execution${activeScenarios > 1 ? 's' : ''}` : 'No active executions'}
                      </div>
                      <div style={{ height: 3, background: 'rgba(240,237,228,0.06)', borderRadius: 2, overflow: 'hidden', marginBottom: 6 }}>
                        <div style={{ width: activeScenarios > 0 ? '67%' : '0%', height: '100%', background: `linear-gradient(90deg, ${TEAL}, rgba(43,138,110,0.6))`, borderRadius: 2, animation: activeScenarios > 0 ? 'cl-prog 2s ease-in-out infinite' : 'none' }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'rgba(240,237,228,0.3)' }}>
                        <span>Awaiting activation</span>
                        <span>221 triggers ready</span>
                      </div>
                    </div>

                    <div style={{ fontSize: 13, fontWeight: 300, color: 'rgba(240,237,228,0.45)', lineHeight: 1.5 }}>
                      Real-time coordination hub. When a playbook activates, your war room opens here.
                    </div>
                    <TileArrow hovered={hovered} />
                  </div>
                )}
              </HoverTile>
            </div>

            {/* ── TILE 5: PERFORMANCE ── */}
            <div className="cl-tile-5" style={{ gridColumn: 3, gridRow: 2 }}>
              <HoverTile onClick={() => setLocation('/execution-history')} style={{ background: '#111830' }}>
                {(hovered) => (
                  <div style={{ padding: 28 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 3, color: 'rgba(240,237,228,0.4)', textTransform: 'uppercase' }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(240,237,228,0.3)', display: 'inline-block' }} />
                      Performance & ROI
                    </div>

                    <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                      {[
                        { value: '0', label: 'Activations', color: GOLD },
                        { value: '—', label: 'Avg Score', color: TEAL },
                        { value: '$0', label: 'ROI Tracked', color: '#fff' },
                      ].map(({ value, label, color }) => (
                        <div key={label} style={{ flex: 1, padding: 12, background: 'rgba(240,237,228,0.03)', border: '1px solid rgba(240,237,228,0.08)', borderRadius: 6, textAlign: 'center' }}>
                          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, lineHeight: 1, marginBottom: 4, color }}>{value}</div>
                          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(240,237,228,0.3)' }}>{label}</div>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {[
                        { label: 'Maturity Score', value: maturity, color: GOLD },
                        { label: 'Decision Velocity', value: 0, color: TEAL },
                        { label: 'Readiness', value: readiness, color: 'rgba(240,237,228,0.4)' },
                      ].map(({ label, value, color }) => (
                        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'rgba(240,237,228,0.45)', width: 110, flexShrink: 0, letterSpacing: 0.5 }}>{label}</div>
                          <div style={{ flex: 1, height: 4, background: 'rgba(240,237,228,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${Math.min(value, 100)}%`, background: color, borderRadius: 2, transition: 'width 1s ease' }} />
                          </div>
                          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'rgba(240,237,228,0.45)', width: 28, textAlign: 'right' }}>
                            {value || '—'}
                          </div>
                        </div>
                      ))}
                    </div>
                    <TileArrow hovered={hovered} />
                  </div>
                )}
              </HoverTile>
            </div>

          </div>
        </main>

        {/* ── BOTTOM STATUS BAR ── */}
        <div style={{
          position: 'fixed', bottom: 0, left: 56, right: 0, height: 36,
          background: 'rgba(10,15,46,0.94)', backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(240,237,228,0.08)',
          display: 'flex', alignItems: 'center', padding: '0 32px', gap: 32, zIndex: 100,
        }}>
          {[
            { dot: TEAL, label: `${signalCount} signals monitored` },
            { dot: GOLD, label: '221 executive triggers configured' },
            { dot: 'rgba(240,237,228,0.3)', label: '170 playbooks ready' },
            { dot: providerData?.multiAgentParallel ? TEAL : 'rgba(240,237,228,0.3)', label: providerData?.multiAgentParallel ? '4-agent IDEA framework active' : 'AI agents ready' },
            { dot: providerData?.teamsConfigured ? TEAL : GOLD, label: providerData?.teamsConfigured ? 'Teams notifications active' : 'Teams webhook: configure in integrations' },
          ].map(({ dot, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'rgba(240,237,228,0.3)', letterSpacing: 0.5 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: dot, display: 'inline-block' }} />
              {label}
            </div>
          ))}
        </div>

      </div>
    </>
  );
}
