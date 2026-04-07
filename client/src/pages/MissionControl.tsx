import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { updatePageMetadata } from '@/lib/seo';
import { useAuth } from '@/hooks/useAuth';
import PageLayout from '@/components/layout/PageLayout';
import PulseMap from '@/components/mission/PulseMap';
import TriggerProbabilityForecast from '@/components/predictive/TriggerProbabilityForecast';
import { ExecutionClock } from '@/components/ExecutionClock';
import { ExecutionDividend } from '@/components/ExecutionDividend';
import { ExecutionStageGuide } from '@/components/ExecutionStageGuide';
import {
  Radio, Shield, AlertTriangle, Zap, Clock, Activity, Target,
  TrendingUp, ArrowRight, CheckCircle2, Circle, RefreshCw,
  Layers, Eye, ChevronRight, BarChart3, Radar, Sparkles,
} from 'lucide-react';

// ─── Brand ───────────────────────────────────────────────────────────────────
const NAVY    = '#0A0F2E';
const GOLD    = '#C9A84C';
const TEAL    = '#2B8A6E';
const RED_ALT = '#C0392B';

// ─── Types ───────────────────────────────────────────────────────────────────
interface Detection {
  id: string | number;
  triggerName: string;
  triggerDomain: string;
  confidenceScore: number;
  recommendedPlaybook: string;
  alternatePlaybooks?: string[];
  status: string;
  signalDescription?: string;
  signalSource?: string;
  detectedAt: string;
}

interface Activation {
  id: string | number;
  playbookName: string;
  domainName: string;
  activationReason?: string;
  situationSummary?: string;
  activatedAt: string;
  completedAt?: string;
  successRating?: number;
  playbookImprovements?: Array<{ area: string; suggestion: string }>;
}

interface LiveStatus {
  isRunning: boolean;
  lastRun?: string;
  nextRun?: string;
  intervalMinutes?: number;
  signalsIngested?: number;
  detectionsCreated?: number;
}

// ─── System status ────────────────────────────────────────────────────────────
type SystemStatus = 'executing' | 'alert' | 'monitoring';

function deriveSystemStatus(detections: Detection[], activations: Activation[]): SystemStatus {
  const now = Date.now();
  if (activations.find(a => now - new Date(a.activatedAt).getTime() < 2 * 3600000)) return 'executing';
  if (detections.find(d => now - new Date(d.detectedAt).getTime() < 86400000)) return 'alert';
  return 'monitoring';
}

const STATUS_CONFIG = {
  executing: { label: 'EXECUTION IN PROGRESS', color: RED_ALT, bg: 'rgba(192,57,43,0.14)', border: 'rgba(192,57,43,0.35)', icon: Zap, pulse: true },
  alert:     { label: 'TRIGGER DETECTED',       color: GOLD,    bg: 'rgba(201,168,76,0.12)', border: 'rgba(201,168,76,0.35)', icon: AlertTriangle, pulse: true },
  monitoring:{ label: 'MONITORING ACTIVE',      color: TEAL,    bg: 'rgba(43,138,110,0.12)', border: 'rgba(43,138,110,0.35)', icon: Radio, pulse: false },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function confidenceColor(score: number): string {
  if (score >= 85) return RED_ALT;
  if (score >= 72) return GOLD;
  return TEAL;
}

function confidenceLabel(score: number): string {
  if (score >= 85) return 'Critical';
  if (score >= 72) return 'High';
  if (score >= 60) return 'Moderate';
  return 'Low';
}

function useCountdown(targetDate: string | undefined): string {
  const [label, setLabel] = useState('—');
  useEffect(() => {
    if (!targetDate) return;
    const tick = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) { setLabel('Now'); return; }
      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setLabel(`${m}m ${s < 10 ? '0' : ''}${s}s`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return label;
}

function useClock(): string {
  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

// ─── Execution Intelligence Trend Panel ──────────────────────────────────────
function ExecutionIntelligenceTrend({ activations }: { activations: Activation[] }) {
  const sorted = [...activations]
    .filter(a => a.successRating != null)
    .sort((a, b) => new Date(a.activatedAt).getTime() - new Date(b.activatedAt).getTime());

  const hasData = sorted.length > 0;
  const scores = sorted.map(a => a.successRating as number);
  const avgScore = hasData ? Math.round(scores.reduce((s, n) => s + n, 0) / scores.length) : null;
  const latest = sorted[sorted.length - 1];
  const latestScore = latest?.successRating ?? null;
  const trend = scores.length >= 2 ? latestScore! - scores[0] : null;
  const improvements = latest?.playbookImprovements ?? [];
  const maxScore = Math.max(...scores, 60);

  const barColor = (score: number) => {
    if (score >= 85) return TEAL;
    if (score >= 70) return '#5BB89B';
    if (score >= 55) return GOLD;
    return '#E8A94B';
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(43,138,110,0.06) 0%, rgba(10,15,46,0.6) 100%)',
      border: '1px solid rgba(43,138,110,0.22)',
      borderLeft: `3px solid ${TEAL}`,
      borderRadius: 10, padding: '20px 24px', marginBottom: 18,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <TrendingUp size={13} color={TEAL} />
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9, fontWeight: 700, letterSpacing: '0.18em' }}>
            EXECUTION INTELLIGENCE TREND
          </span>
        </div>
        {hasData && trend !== null && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: trend > 0 ? 'rgba(43,138,110,0.15)' : 'rgba(201,168,76,0.12)',
            border: `1px solid ${trend > 0 ? 'rgba(43,138,110,0.3)' : 'rgba(201,168,76,0.25)'}`,
            borderRadius: 20, padding: '3px 10px',
          }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: trend > 0 ? TEAL : GOLD }}>
              {trend > 0 ? `+${trend}` : trend} pts
            </span>
            <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>
              {trend > 0 ? 'compounding ↑' : 'stabilizing'}
            </span>
          </div>
        )}
      </div>

      {hasData ? (
        <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr 220px', gap: 24, alignItems: 'center' }}>
          {/* Left — EQS Score */}
          <div>
            <div style={{ marginBottom: 4 }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 52, fontWeight: 700, color: avgScore! >= 80 ? TEAL : GOLD, lineHeight: 1 }}>
                {avgScore}
              </span>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', fontWeight: 600, marginLeft: 4 }}>/100</span>
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 8 }}>
              AVG EXECUTION QUALITY
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', lineHeight: 1.5 }}>
              {sorted.length} activation{sorted.length !== 1 ? 's' : ''} captured<br />
              Each cycle feeds the next
            </div>
          </div>

          {/* Center — Sparkline */}
          <div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 64, marginBottom: 8 }}>
              {sorted.map((a, i) => {
                const score = a.successRating as number;
                const height = Math.max(8, Math.round((score / maxScore) * 60));
                return (
                  <div key={a.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                    <div
                      title={`Cycle ${i + 1}: ${score}/100`}
                      style={{
                        width: '100%', height,
                        background: barColor(score),
                        borderRadius: 3,
                        opacity: i === sorted.length - 1 ? 1 : 0.55 + (i / sorted.length) * 0.4,
                        transition: 'all 0.3s',
                        cursor: 'default',
                      }}
                    />
                  </div>
                );
              })}
              {sorted.length < 6 && Array.from({ length: 6 - sorted.length }).map((_, i) => (
                <div key={`empty-${i}`} style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 3 }} />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', fontWeight: 600 }}>Cycle 1</span>
              <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', fontWeight: 600 }}>
                {sorted.length < 6 ? `${6 - sorted.length} cycles to full baseline` : 'Baseline established'}
              </span>
              <span style={{ fontSize: 9, color: TEAL, fontWeight: 700 }}>Latest</span>
            </div>
          </div>

          {/* Right — Institutional Memory */}
          <div style={{ borderLeft: '1px solid rgba(255,255,255,0.07)', paddingLeft: 20 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.25)', marginBottom: 10 }}>
              ENCODED FROM LAST CYCLE
            </div>
            {improvements.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {improvements.slice(0, 3).map(({ area, suggestion }, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8 }}>
                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: TEAL, flexShrink: 0, marginTop: 5 }} />
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: 1 }}>{area}</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', lineHeight: 1.4 }}>{suggestion}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', lineHeight: 1.5 }}>
                Learning captured after first activation completes
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Empty state */
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '8px 0' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>
              Decision quality compounds with every activation
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', lineHeight: 1.6, maxWidth: 500 }}>
              Each time a playbook activates, execution quality is scored, improvements are encoded, and the next response starts from a better place. Activate your first playbook to begin the intelligence loop.
            </div>
          </div>
          <a href="/playbooks" style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(43,138,110,0.15)', color: TEAL, border: '1px solid rgba(43,138,110,0.3)', borderRadius: 6, padding: '9px 16px', fontSize: 11, fontWeight: 700, textDecoration: 'none' }}>
            Browse Playbooks <ChevronRight size={11} />
          </a>
        </div>
      )}
    </div>
  );
}

// ─── Pulse Orb ───────────────────────────────────────────────────────────────
function PulseOrb({ color, size = 10, animate: shouldAnimate = true }: { color: string; size?: number; animate?: boolean }) {
  return (
    <span style={{ position: 'relative', display: 'inline-block', width: size, height: size, flexShrink: 0 }}>
      {shouldAnimate && (
        <motion.span
          style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: color, opacity: 0.4 }}
          animate={{ scale: [1, 1.9, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
        />
      )}
      <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: color }} />
    </span>
  );
}

// ─── NOC Detection Card (authenticated — real activation) ─────────────────────
function DetectionCard({ d, index, scenarios }: { d: Detection; index: number; scenarios: any[] }) {
  const [, setLocation] = useLocation();
  const cc = confidenceColor(d.confidenceScore);
  const isCritical = d.confidenceScore >= 85;

  const handleActivate = () => {
    if (scenarios.length === 0) { setLocation('/live-activation-center'); return; }
    const keyword = d.recommendedPlaybook.toLowerCase();
    const match = scenarios.find((p: any) => p.name?.toLowerCase().includes(keyword.split(' ')[0]));
    setLocation('/playbook-activation/manual/' + (match?.id || scenarios[0]?.id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      style={{
        background: isCritical ? 'rgba(192,57,43,0.07)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${isCritical ? 'rgba(192,57,43,0.3)' : 'rgba(255,255,255,0.1)'}`,
        borderLeft: `5px solid ${cc}`,
        borderRadius: 10, padding: '20px 22px', marginBottom: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14, marginBottom: 14 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 5 }}>
            <PulseOrb color={cc} size={10} animate={d.status !== 'acknowledged'} />
            <span style={{ background: cc, color: '#fff', fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 3, letterSpacing: '0.1em' }}>
              {confidenceLabel(d.confidenceScore).toUpperCase()}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>{d.triggerDomain}</span>
          </div>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 17, lineHeight: 1.35, marginBottom: 4 }}>{d.triggerName}</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{d.signalSource || 'Live Signal'} · {timeAgo(d.detectedAt)}</div>
        </div>
        <div style={{ background: `linear-gradient(135deg, ${cc}22, ${cc}11)`, border: `1px solid ${cc}55`, borderRadius: 10, padding: '12px 16px', textAlign: 'center', flexShrink: 0, minWidth: 80 }}>
          <div style={{ color: cc, fontWeight: 800, fontSize: 34, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{d.confidenceScore}</div>
          <div style={{ color: cc, fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', marginTop: 3 }}>CONF%</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 7, padding: '9px 14px', marginBottom: 14 }}>
        <Target size={13} color={GOLD} />
        <div style={{ flex: 1 }}>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', marginBottom: 1 }}>AI RECOMMENDED PLAYBOOK</div>
          <div style={{ color: GOLD, fontSize: 13, fontWeight: 700 }}>{d.recommendedPlaybook}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={handleActivate}
          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, background: GOLD, color: NAVY, borderRadius: 8, padding: '12px 0', fontWeight: 800, fontSize: 13, letterSpacing: '0.05em', border: 'none', cursor: 'pointer' }}
        >
          <Zap size={14} /> ACTIVATE PLAYBOOK
        </button>
        <Link href="/live-detection-feed" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)', borderRadius: 8, padding: '12px 16px', fontWeight: 600, fontSize: 12, textDecoration: 'none' }}>
            Details <ArrowRight size={12} />
          
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Domain Status Grid ───────────────────────────────────────────────────────
const DOMAINS = [
  'Competitive', 'M&A', 'Regulatory',
  'Talent', 'Market', 'Financial',
  'Technology', 'Supply Chain', 'Stakeholder',
];

function DomainStatusGrid({ detections }: { detections: Detection[] }) {
  const detectionDomains = detections.map(d => (d.triggerDomain || '').toLowerCase());
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Layers size={14} color={GOLD} />
        <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700, fontSize: 11, letterSpacing: '0.12em' }}>DOMAIN STATUS BOARD</span>
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>9 of 9 monitored</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {DOMAINS.map((domain) => {
          const hasAlert = detectionDomains.some(d => d.includes(domain.toLowerCase().split(' ')[0]));
          const color = hasAlert ? GOLD : TEAL;
          return (
            <div key={domain} style={{ background: hasAlert ? 'rgba(201,168,76,0.08)' : 'rgba(43,138,110,0.06)', border: `1px solid ${hasAlert ? 'rgba(201,168,76,0.25)' : 'rgba(43,138,110,0.18)'}`, borderRadius: 7, padding: '10px 10px 8px', textAlign: 'center' }}>
              <PulseOrb color={color} size={8} animate={hasAlert} />
              <div style={{ color: hasAlert ? GOLD : 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 700, marginTop: 6, letterSpacing: '0.04em' }}>{domain}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MissionControl() {
  const { user } = useAuth() as any;
  const clock = useClock();
  const [, setLocation] = useLocation();

  useEffect(() => {
    updatePageMetadata({
      title: 'Mission Control — Execution OS | VaughnMartin',
      description: 'Single-pane executive NOC for strategic execution. Live trigger detections, domain monitoring, playbook activation.',
    });
  }, []);

  // ── Data ──────────────────────────────────────────────────────────────────
  const { data: detectionsData, refetch: refetchDetections } = useQuery<{ detections: Detection[] }>({
    queryKey: ['/api/detections'], refetchInterval: 30000,
  });
  const { data: activationsData, refetch: refetchActivations } = useQuery<Activation[]>({
    queryKey: ['/api/playbook-activations'], refetchInterval: 30000,
  });
  const { data: liveStatus, refetch: refetchStatus } = useQuery<LiveStatus>({
    queryKey: ['/api/signals/live/status'], refetchInterval: 10000,
  });
  const { data: triggerSummary } = useQuery<{ total: number; byAlertLevel: Record<string, number>; byCategory: Record<string, number> }>({
    queryKey: ['/api/trigger-evaluation-summary'], refetchInterval: 60000,
  });
  const { data: monitoringConfig } = useQuery<{ evaluationMode: string }>({
    queryKey: ['/api/signal-monitoring-config'], refetchInterval: 60000,
  });
  const { data: triggersRaw } = useQuery<any[]>({ queryKey: ['/api/triggers'] });
  const { data: scenariosRaw } = useQuery<any[]>({ queryKey: ['/api/scenarios'] });

  const detections: Detection[] = detectionsData?.detections || [];
  const activations: Activation[] = activationsData || [];
  const triggers = Array.isArray(triggersRaw) ? triggersRaw : [];
  const scenarios = Array.isArray(scenariosRaw) ? scenariosRaw : [];

  const systemStatus = deriveSystemStatus(detections, activations);
  const statusCfg = STATUS_CONFIG[systemStatus];
  const StatusIcon = statusCfg.icon;
  const nextScanLabel = useCountdown(liveStatus?.nextRun);
  const triggersArmed = triggerSummary?.total || 221;
  const evaluationMode = monitoringConfig?.evaluationMode || 'both';
  const modeLabel = evaluationMode === 'configured' ? 'Custom Engine' : evaluationMode === 'default' ? 'Default Engine' : 'Dual Engine';
  const criticalCount = detections.filter(d => d.confidenceScore >= 85 && Date.now() - new Date(d.detectedAt).getTime() < 86400000).length;
  const recentDetections = detections.slice(0, 6);
  const recentActivations = activations.slice(0, 5);

  const handleRefresh = async () => {
    await Promise.all([refetchDetections(), refetchActivations(), refetchStatus()]);
  };

  // ── WebSocket ─────────────────────────────────────────────────────────────
  const wsRef = useRef<WebSocket | null>(null);
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}`);
    wsRef.current = ws;
    ws.onmessage = (evt) => {
      try {
        const data = JSON.parse(evt.data);
        if (data.type === 'new-detection') { refetchDetections(); refetchStatus(); }
      } catch {}
    };
    return () => ws.close();
  }, []);

  const firstName = (user as any)?.firstName || (user as any)?.username?.split(' ')[0] || 'Executive';

  return (
    <PageLayout>
      <div style={{
        minHeight: '100vh',
        background: NAVY,
        color: '#fff',
        fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Ambient grid */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: `linear-gradient(rgba(201,168,76,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.04) 1px,transparent 1px)`, backgroundSize: '48px 48px' }} />
        {/* Glow orbs */}
        <div style={{ position: 'absolute', top: -200, right: -100, width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle, rgba(43,138,110,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -200, left: -100, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <ExecutionStageGuide variant="banner" />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1500, margin: '0 auto', padding: '0 32px' }}>

          {/* ── NOC HEADER BAR ──────────────────────────────────────────────── */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0 18px', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: 26 }}>
            {/* Identity */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 42, height: 42, borderRadius: '50%', border: `2px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(201,168,76,0.1)', flexShrink: 0 }}>
                <span style={{ color: GOLD, fontWeight: 800, fontSize: 14 }}>VM</span>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: GOLD, fontWeight: 800, fontSize: 18, letterSpacing: '0.04em' }}>MISSION CONTROL</span>
                  <span style={{ background: 'rgba(201,168,76,0.15)', color: GOLD, fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 3, letterSpacing: '0.12em' }}>EXECUTION OS</span>
                </div>
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, marginTop: 1 }}>
                  Welcome back, {firstName} · Strategic Execution Intelligence
                </div>
              </div>
            </div>

            {/* System Status Badge */}
            <motion.div key={systemStatus} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ display: 'flex', alignItems: 'center', gap: 10, background: statusCfg.bg, border: `1px solid ${statusCfg.border}`, borderRadius: 8, padding: '10px 22px' }}>
              <PulseOrb color={statusCfg.color} size={11} animate={statusCfg.pulse} />
              <StatusIcon size={16} color={statusCfg.color} />
              <span style={{ color: statusCfg.color, fontWeight: 800, fontSize: 13, letterSpacing: '0.12em' }}>{statusCfg.label}</span>
              {systemStatus === 'alert' && criticalCount > 0 && (
                <span style={{ background: RED_ALT, color: '#fff', fontSize: 10, fontWeight: 800, padding: '1px 7px', borderRadius: 12, marginLeft: 4 }}>
                  {criticalCount} CRITICAL
                </span>
              )}
            </motion.div>

            {/* Clock + Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, fontVariantNumeric: 'tabular-nums' }}>{clock}</div>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, marginTop: 1 }}>
                  {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </div>
              </div>
              <button onClick={handleRefresh} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6, padding: '7px 12px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontSize: 11 }}>
                <RefreshCw size={12} /> Refresh
              </button>
              <Link href="/command-tower" title="Command Tower — Live wall display for conference rooms & NOC screens (auto-refreshing, read-only)" style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6, padding: '7px 14px', color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 600, textDecoration: 'none' }}>
                <Radar size={11} /> Command Tower
              </Link>
            </div>
          </div>

          {/* ── NOC STAT RAIL ───────────────────────────────────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginBottom: 24 }}>
            {[
              { label: 'TRIGGERS ARMED',     value: triggersArmed.toLocaleString(), sub: '221 signals',                     icon: Target,       color: GOLD,                           bg: 'rgba(201,168,76,0.08)',  border: 'rgba(201,168,76,0.2)' },
              { label: 'ACTIVE DETECTIONS',  value: detections.length.toString(),   sub: detections.length > 0 ? `${criticalCount} critical` : 'All clear', icon: AlertTriangle, color: detections.length > 0 ? RED_ALT : TEAL, bg: detections.length > 0 ? 'rgba(192,57,43,0.08)' : 'rgba(43,138,110,0.07)', border: detections.length > 0 ? 'rgba(192,57,43,0.25)' : 'rgba(43,138,110,0.2)' },
              { label: 'PLAYBOOKS READY',    value: '170',                          sub: 'Pre-staged',                       icon: Layers,       color: TEAL,                           bg: 'rgba(43,138,110,0.07)', border: 'rgba(43,138,110,0.2)' },
              { label: 'EXECUTIONS LOGGED',  value: activations.length.toString(),  sub: activations.length > 0 ? timeAgo(activations[0]?.activatedAt || '') : 'None yet', icon: TrendingUp, color: 'rgba(255,255,255,0.7)', bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.1)' },
              { label: 'NEXT SCAN',          value: nextScanLabel,                  sub: `Engine: ${modeLabel}`,             icon: Clock,        color: 'rgba(255,255,255,0.7)',        bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.1)' },
            ].map(({ label, value, sub, icon: Icon, color, bg, border }) => (
              <div key={label} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 10, padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
                  <Icon size={13} color={color} />
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em' }}>{label}</span>
                </div>
                <div style={{ color, fontWeight: 800, fontSize: 30, fontVariantNumeric: 'tabular-nums', lineHeight: 1, marginBottom: 4 }}>{value}</div>
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>{sub}</div>
              </div>
            ))}
          </div>

          {/* ── CONFIGURE YOUR OS ──────────────────────────────────────────── */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 9, fontWeight: 700, letterSpacing: '0.18em' }}>CONFIGURE YOUR OS</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              {[
                { label: 'Situation Intents', desc: 'Define what you\'re watching for — the starting point', href: '/identify/situation-intents', gold: true, icon: '🎯' },
                { label: 'Trigger Configuration', desc: 'Set signal thresholds & monitoring rules', href: '/triggers-management', gold: false, icon: '⚡' },
                { label: 'Stakeholder Registry', desc: 'Map who gets notified when triggers fire', href: '/stakeholders', gold: false, icon: '👥' },
                { label: 'Playbook Library', desc: '170 pre-staged playbooks ready to deploy', href: '/playbooks', gold: false, icon: '📚' },
              ].map(({ label, desc, href, gold, icon }) => (
                <a key={href} href={href} style={{
                  display: 'block', textDecoration: 'none',
                  background: gold ? 'rgba(201,168,76,0.1)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${gold ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.07)'}`,
                  borderRadius: 8, padding: '12px 14px',
                  transition: 'all 0.15s',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
                    <span style={{ fontSize: 14 }}>{icon}</span>
                    <span style={{ color: gold ? GOLD : 'rgba(255,255,255,0.8)', fontWeight: 700, fontSize: 12 }}>{label}</span>
                    {gold && <span style={{ marginLeft: 'auto', background: GOLD, color: NAVY, fontSize: 8, fontWeight: 800, padding: '1px 6px', borderRadius: 3, letterSpacing: '0.08em' }}>START HERE</span>}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, lineHeight: 1.4 }}>{desc}</div>
                </a>
              ))}
            </div>
          </div>

          {/* ── EXECUTIVE SCENARIO SUITE CALLOUT ─────────────────────────── */}
          <a href="/executive-scenarios" style={{ display: 'flex', alignItems: 'center', gap: 20, textDecoration: 'none', background: 'rgba(43,138,110,0.06)', border: '1px solid rgba(43,138,110,0.2)', borderLeft: '3px solid rgba(43,138,110,0.7)', borderRadius: 8, padding: '14px 20px', marginBottom: 18, transition: 'all 0.15s' }}
            onMouseOver={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(43,138,110,0.10)'; }}
            onMouseOut={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(43,138,110,0.06)'; }}
          >
            <span style={{ fontSize: 22, flexShrink: 0 }}>🎯</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(43,138,110,0.9)' }}>Executive Scenario Suite</span>
                <span style={{ fontSize: 9, fontWeight: 800, background: 'rgba(43,138,110,0.25)', color: 'rgba(43,138,110,0.9)', padding: '1px 7px', borderRadius: 3, letterSpacing: '0.1em' }}>AUTHENTICATED</span>
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)', lineHeight: 1.45 }}>
                Walk through your industry scenario — full IDEA chain, real playbooks, 12-minute execution data. Technology · Financial Services · Manufacturing · Healthcare.
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(43,138,110,0.8)', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
              Begin <ChevronRight size={13} />
            </div>
          </a>

          {/* ── SIGNAL COVERAGE ──────────────────────────────────────────── */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 9, fontWeight: 700, letterSpacing: '0.18em' }}>SIGNAL COVERAGE — TOP PLAYBOOK AREAS</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
              <a href="/playbooks" style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textDecoration: 'none', fontWeight: 600, letterSpacing: '0.08em', flexShrink: 0 }}>View All Playbooks →</a>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              {[
                { domain: 'Market Opportunities',    signals: 82,  color: '#2B8A6E', href: '/playbooks', desc: 'Competitive, market & innovation signals' },
                { domain: 'Market Dynamics',          signals: 51,  color: '#C9A84C', href: '/playbooks', desc: 'Competitive moves & market shifts' },
                { domain: 'Regulatory & Compliance', signals: 38,  color: '#A78BFA', href: '/playbooks', desc: 'Regulatory, ESG & cyber signals' },
                { domain: 'Technology & Innovation', signals: 34,  color: '#38BDF8', href: '/playbooks', desc: 'Technology & innovation indicators' },
              ].map(({ domain, signals, color, href, desc }) => (
                <a key={domain} href={href} style={{ display: 'block', textDecoration: 'none', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderLeft: `3px solid ${color}`, borderRadius: 8, padding: '12px 14px', transition: 'all 0.15s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 0 2px rgba(16,185,129,0.2)' }} />
                      <span style={{ fontSize: 9, color: '#10B981', fontWeight: 700, letterSpacing: '0.1em' }}>LIVE</span>
                    </div>
                    <span style={{ fontSize: 18, fontWeight: 800, color, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{signals}</span>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.75)', marginBottom: 3, lineHeight: 1.3 }}>{domain}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', lineHeight: 1.4 }}>{desc}</div>
                </a>
              ))}
            </div>
          </div>

          {/* ── EXECUTION INTELLIGENCE TREND ─────────────────────────────── */}
          <ExecutionIntelligenceTrend activations={activations} />

          {/* ── RESEARCH CONSENSUS INDICATOR ──────────────────────────────── */}
          <div style={{ background: 'rgba(43,138,110,0.03)', border: '1px solid rgba(43,138,110,0.1)', borderRadius: 8, padding: '9px 18px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' as const }}>
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', flexShrink: 0 }}>RESEARCH CONSENSUS</span>
            {[
              { label: 'McKinsey EA 2025–26', note: '"Named the gap"' },
              { label: 'MGI Nov 2025', note: '"Org change is the constraint"' },
              { label: 'WEF × Accenture Mar 2026', note: '"Not the AI — the operating model"' },
            ].map(({ label, note }, i) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {i > 0 && <span style={{ color: 'rgba(255,255,255,0.1)', fontSize: 10 }}>·</span>}
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>{label}</span>
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.18)', fontStyle: 'italic' }}>{note}</span>
              </div>
            ))}
          </div>

          {/* ── MCKINSEY MATURITY INDICATOR ─────────────────────────────────── */}
          <div style={{ background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.14)', borderRadius: 10, padding: '14px 22px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' as const }}>
            <div style={{ flexShrink: 0 }}>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', marginBottom: 4 }}>MCKINSEY AI MATURITY INDEX</div>
              <div style={{ color: GOLD, fontSize: 11, fontWeight: 600 }}>Where does your enterprise stand?</div>
            </div>
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 6 }}>
                <div style={{ width: '65%', background: 'rgba(192,57,43,0.5)', position: 'relative' }} title="65% still piloting" />
                <div style={{ width: '23%', background: 'rgba(201,168,76,0.55)' }} title="23% scaling" />
                <div style={{ width: '11%', background: 'rgba(43,138,110,0.65)' }} title="11% not yet scaling" />
                <div style={{ width: '1%', background: '#2B8A6E' }} title="1% mature" />
              </div>
              <div style={{ display: 'flex', gap: 16, fontSize: 10 }}>
                <span style={{ color: 'rgba(192,57,43,0.8)' }}>■ 65% Piloting</span>
                <span style={{ color: 'rgba(201,168,76,0.8)' }}>■ 23% Scaling</span>
                <span style={{ color: 'rgba(43,138,110,0.9)', fontWeight: 700 }}>■ 1% Mature</span>
              </div>
            </div>
            <div style={{ flexShrink: 0, textAlign: 'right' as const }}>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, marginBottom: 2 }}>Execution OS puts you in the</div>
              <div style={{ color: TEAL, fontWeight: 800, fontSize: 14 }}>1% Mature</div>
              <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: 9 }}>12-min activation · 170 pre-staged playbooks</div>
            </div>
          </div>

          {/* ── EXECUTION PULSE ROW (compact) ────────────────────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
            <div>
              <ExecutionClock compact />
            </div>
            <div>
              <ExecutionDividend compact />
            </div>
          </div>

          {/* ── NOC MAIN GRID ───────────────────────────────────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 390px', gap: 20, alignItems: 'start', marginBottom: 24 }}>

            {/* ── LEFT: LIVE ALERT ZONE ─────────────────────────────────── */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: detections.length > 0 ? '1px solid rgba(201,168,76,0.2)' : '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '22px 24px' }}>
              {/* Zone header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ background: detections.length > 0 ? 'rgba(201,168,76,0.15)' : 'rgba(43,138,110,0.12)', border: `1px solid ${detections.length > 0 ? 'rgba(201,168,76,0.3)' : 'rgba(43,138,110,0.25)'}`, borderRadius: 6, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <PulseOrb color={detections.length > 0 ? GOLD : TEAL} size={8} animate />
                    <span style={{ color: detections.length > 0 ? GOLD : TEAL, fontSize: 10, fontWeight: 800, letterSpacing: '0.1em' }}>
                      {detections.length > 0 ? `${detections.length} ALERT${detections.length > 1 ? 'S' : ''} ACTIVE` : 'ALL CLEAR'}
                    </span>
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700, fontSize: 13, letterSpacing: '0.06em' }}>LIVE ALERT ZONE</span>
                </div>
                <Link href="/live-detection-feed" style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                    Full Feed <ArrowRight size={11} />
                </Link>
              </div>

              <AnimatePresence mode="popLayout">
                {recentDetections.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: 'rgba(43,138,110,0.07)', border: '1px solid rgba(43,138,110,0.2)', borderRadius: 12, padding: '56px 24px', textAlign: 'center' }}>
                    <CheckCircle2 size={52} color={TEAL} style={{ margin: '0 auto 18px', display: 'block' }} />
                    <div style={{ color: TEAL, fontWeight: 800, fontSize: 22, marginBottom: 10, letterSpacing: '0.04em' }}>ALL SYSTEMS CLEAR</div>
                    <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, maxWidth: 440, margin: '0 auto', lineHeight: 1.6 }}>
                      No trigger events detected. {triggersArmed} triggers armed and continuously monitoring across 9 strategic domains.
                    </div>
                    <div style={{ marginTop: 28, display: 'flex', justifyContent: 'center', gap: 12 }}>
                      <button
                        onClick={() => setLocation('/live-activation-center')}
                        style={{ display: 'flex', alignItems: 'center', gap: 7, background: GOLD, color: NAVY, borderRadius: 8, padding: '12px 24px', fontWeight: 800, fontSize: 13, border: 'none', cursor: 'pointer' }}
                      >
                        <Zap size={14} /> Activate Playbook
                      </button>
                      <Link href="/triggers-management" style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)', borderRadius: 8, padding: '12px 24px', fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>
                          <Eye size={13} /> View Triggers
                      </Link>
                    </div>
                  </motion.div>
                ) : (
                  recentDetections.map((d, i) => <DetectionCard key={d.id} d={d} index={i} scenarios={scenarios} />)
                )}
              </AnimatePresence>
            </div>

            {/* ── RIGHT: CONTROL PANELS ──────────────────────────────────── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Domain Status Board */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '18px 20px' }}>
                <DomainStatusGrid detections={detections} />
              </div>

              {/* Execution Log */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '18px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <TrendingUp size={14} color={TEAL} />
                    <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700, fontSize: 11, letterSpacing: '0.12em' }}>EXECUTION LOG</span>
                  </div>
                  {activations.length > 0 && (
                    <span style={{ background: 'rgba(43,138,110,0.15)', color: TEAL, fontSize: 10, fontWeight: 700, padding: '1px 8px', borderRadius: 10 }}>{activations.length} total</span>
                  )}
                </div>
                {recentActivations.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '18px 12px' }}>
                    <Circle size={24} color="rgba(255,255,255,0.12)" style={{ margin: '0 auto 8px', display: 'block' }} />
                    <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>No executions yet</div>
                    <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, lineHeight: 1.5 }}>170 playbooks pre-staged. 12-minute deployment on trigger.</div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {recentActivations.map((a, i) => {
                      const isRecent = Date.now() - new Date(a.activatedAt).getTime() < 7200000;
                      return (
                        <motion.div key={a.id as string} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                          style={{ background: isRecent ? 'rgba(43,138,110,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${isRecent ? 'rgba(43,138,110,0.25)' : 'rgba(255,255,255,0.07)'}`, borderLeft: `4px solid ${isRecent ? TEAL : 'rgba(255,255,255,0.15)'}`, borderRadius: 8, padding: '12px 14px' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
                                {isRecent && <PulseOrb color={TEAL} size={7} />}
                                <span style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>{a.playbookName}</span>
                              </div>
                              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>{a.domainName}</span>
                            </div>
                            {a.successRating != null && (
                              <div style={{ background: 'rgba(43,138,110,0.2)', color: TEAL, fontWeight: 800, fontSize: 13, padding: '2px 8px', borderRadius: 5, flexShrink: 0 }}>{a.successRating}%</div>
                            )}
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>{isRecent ? '● In progress' : '✓ Completed'}</span>
                            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>{timeAgo(a.activatedAt)}</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Scan Timing + 3600x Metric */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '18px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
                  <Clock size={13} color={TEAL} />
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em' }}>SCAN CYCLE</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                  {[
                    { label: 'Last scan', value: liveStatus?.lastRun ? timeAgo(liveStatus.lastRun) : '—', color: '#fff' },
                    { label: 'Next scan', value: nextScanLabel, color: TEAL },
                    { label: 'Engine',    value: modeLabel.toUpperCase(), color: TEAL },
                  ].map(({ label, value, color }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{label}</span>
                      <span style={{ color, fontSize: 12, fontWeight: 700 }}>{value}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: `linear-gradient(135deg, rgba(201,168,76,0.12), rgba(43,138,110,0.08))`, border: '1px solid rgba(201,168,76,0.2)', borderRadius: 8, padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
                    <Zap size={12} color={GOLD} />
                    <span style={{ color: GOLD, fontSize: 9, fontWeight: 700, letterSpacing: '0.12em' }}>EXECUTION HEAD START</span>
                  </div>
                  <div style={{ color: '#fff', fontWeight: 800, fontSize: 30, lineHeight: 1, marginBottom: 3 }}>3,600×</div>
                  <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, lineHeight: 1.5 }}>30 days → 12 minutes. 170 playbooks pre-staged.</div>
                </div>
              </div>

              {/* Quick Actions */}
              <div style={{ display: 'flex', gap: 10 }}>
                <Link href="/live-activation-center" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: GOLD, color: NAVY, borderRadius: 8, padding: '13px 20px', fontWeight: 800, fontSize: 12, letterSpacing: '0.05em', textDecoration: 'none' }}>
                    <Zap size={13} /> ACTIVATE
                </Link>
                <Link href="/live-detection-feed" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)', borderRadius: 8, padding: '13px 20px', fontWeight: 600, fontSize: 12, textDecoration: 'none' }}>
                    <Radio size={12} /> FEED
                </Link>
              </div>
            </div>
          </div>

          {/* ── STRATEGIC PULSE MAP ─────────────────────────────────────────── */}
          <div style={{ marginBottom: 24, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '16px 22px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <Radar size={14} color={GOLD} />
              <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700, fontSize: 11, letterSpacing: '0.12em' }}>STRATEGIC PULSE MAP</span>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>— Domain activity visualization</span>
            </div>
            <PulseMap />
          </div>

          {/* ── TRIGGER FORECAST ────────────────────────────────────────────── */}
          {triggers.length > 0 && (
            <div style={{ marginBottom: 24, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '16px 22px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <BarChart3 size={14} color={TEAL} />
                <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700, fontSize: 11, letterSpacing: '0.12em' }}>TRIGGER PROBABILITY FORECAST</span>
              </div>
              <div style={{ padding: '4px 0' }}>
                <TriggerProbabilityForecast triggers={triggers} compact={true} />
              </div>
            </div>
          )}

          {/* ── EXECUTION CLOCK + DIVIDEND ──────────────────────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            <div>
              <ExecutionClock />
            </div>
            <div>
              <ExecutionDividend />
            </div>
          </div>

          {/* ── PLATFORM INTEL STRIP ────────────────────────────────────────── */}
          <div style={{ marginBottom: 32, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ChevronRight size={13} color={GOLD} />
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em' }}>NAVIGATE EXECUTION OS</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              {[
                { label: 'Situation Intents', href: '/identify/situation-intents', gold: true },
                { label: 'Playbook Library', href: '/playbooks', gold: false },
                { label: 'Trigger Intelligence', href: '/triggers-management', gold: false },
                { label: 'Signal Intelligence', href: '/signal-intelligence', gold: false },
                { label: 'Board Readiness', href: '/board-readiness', gold: false },
                { label: 'Execution History', href: '/execution-history', gold: false },
                { label: 'Settings', href: '/settings', gold: false },
              ].map(({ label, href, gold }) => (
                <Link key={href} href={href} style={{ display: 'flex', alignItems: 'center', gap: 5, background: gold ? GOLD : 'rgba(255,255,255,0.05)', border: `1px solid ${gold ? GOLD : 'rgba(255,255,255,0.1)'}`, borderRadius: 6, padding: '6px 12px', color: gold ? NAVY : 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: gold ? 800 : 600, textDecoration: 'none' }}>
                    {label} <ArrowRight size={10} />
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </PageLayout>
  );
}
