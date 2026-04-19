import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { updatePageMetadata } from '@/lib/seo';
import { LiveSignalFeed } from '@/components/LiveSignalFeed';
import { ExecutionStageGuide } from '@/components/ExecutionStageGuide';
import {
  Radio,
  Shield,
  AlertTriangle,
  Zap,
  Clock,
  Activity,
  Target,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Circle,
  RefreshCw,
  Layers,
  Eye,
  ChevronRight,
  MinusCircle,
  GitBranch,
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
  activatedAt: string;
  completedAt?: string;
  successRating?: number;
}

interface LiveStatus {
  isRunning: boolean;
  lastRun?: string;
  nextRun?: string;
  intervalMinutes?: number;
  signalsIngested?: number;
  detectionsCreated?: number;
}

// ─── System status derivation ─────────────────────────────────────────────────
type SystemStatus = 'executing' | 'alert' | 'monitoring';

function deriveSystemStatus(
  detections: Detection[],
  activations: Activation[]
): SystemStatus {
  const now = Date.now();
  const recentActivation = activations.find(a => {
    const age = now - new Date(a.activatedAt).getTime();
    return age < 2 * 60 * 60 * 1000; // within 2 hours
  });
  if (recentActivation) return 'executing';

  const recentDetection = detections.find(d => {
    const age = now - new Date(d.detectedAt).getTime();
    return age < 24 * 60 * 60 * 1000; // within 24 hours
  });
  if (recentDetection) return 'alert';

  return 'monitoring';
}

const STATUS_CONFIG = {
  executing: {
    label: 'EXECUTION IN PROGRESS',
    color: RED_ALT,
    bg: 'rgba(192,57,43,0.12)',
    border: 'rgba(192,57,43,0.35)',
    icon: Zap,
    pulse: true,
  },
  alert: {
    label: 'TRIGGER DETECTED',
    color: GOLD,
    bg: 'rgba(201,168,76,0.12)',
    border: 'rgba(201,168,76,0.35)',
    icon: AlertTriangle,
    pulse: true,
  },
  monitoring: {
    label: 'MONITORING ACTIVE',
    color: TEAL,
    bg: 'rgba(43,138,110,0.12)',
    border: 'rgba(43,138,110,0.35)',
    icon: Radio,
    pulse: false,
  },
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

// ─── Live Countdown ───────────────────────────────────────────────────────────
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

// ─── Live Clock ───────────────────────────────────────────────────────────────
function useClock(): string {
  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

// ─── Pulse Orb ───────────────────────────────────────────────────────────────
function PulseOrb({ color, size = 14, animate: shouldAnimate = true }: { color: string; size?: number; animate?: boolean }) {
  return (
    <span style={{ position: 'relative', display: 'inline-block', width: size, height: size, flexShrink: 0 }}>
      {shouldAnimate && (
        <motion.span
          style={{
            position: 'absolute', inset: 0, borderRadius: 0,
            background: color, opacity: 0.4,
          }}
          animate={{ scale: [1, 1.9, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
        />
      )}
      <span style={{
        position: 'absolute', inset: 0, borderRadius: 0, background: color,
      }} />
    </span>
  );
}

// ─── Detection Card (NOC Alert Block) ────────────────────────────────────────
function DetectionCard({ d, index }: { d: Detection; index: number }) {
  const cc = confidenceColor(d.confidenceScore);
  const isCritical = d.confidenceScore >= 85;
  const storageKey = `no_action_${d.id}`;
  const [noActionLogged, setNoActionLogged] = useState<string | null>(() =>
    localStorage.getItem(storageKey)
  );
  const handleLogNoAction = () => {
    const ts = new Date().toISOString();
    localStorage.setItem(storageKey, ts);
    setNoActionLogged(ts);
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
        borderRadius: 0,
        padding: '20px 22px',
        marginBottom: 12,
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14, marginBottom: 14 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 5 }}>
            <PulseOrb color={cc} size={10} animate={d.status !== 'acknowledged'} />
            <span style={{
              background: cc, color: '#fff',
              fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 0, letterSpacing: '0.1em',
            }}>
              {confidenceLabel(d.confidenceScore).toUpperCase()}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>
              {d.triggerDomain}
            </span>
          </div>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 17, lineHeight: 1.35, marginBottom: 4 }}>
            {d.triggerName}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
            {d.signalSource || 'Live Signal'} · {timeAgo(d.detectedAt)}
          </div>
        </div>
        {/* Confidence Score — big NOC-style */}
        <div style={{
          background: `linear-gradient(135deg, ${cc}22 0%, ${cc}11 100%)`,
          border: `1px solid ${cc}55`,
          borderRadius: 0, padding: '12px 16px', textAlign: 'center', flexShrink: 0, minWidth: 80,
        }}>
          <div style={{ color: cc, fontWeight: 800, fontSize: 34, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
            {d.confidenceScore}
          </div>
          <div style={{ color: cc, fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', marginTop: 3 }}>
            CONF%
          </div>
        </div>
      </div>

      {/* Recommended Playbook */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.15)',
        borderRadius: 0, padding: '9px 14px', marginBottom: 14,
      }}>
        <Target size={13} color={GOLD} />
        <div style={{ flex: 1 }}>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', marginBottom: 1 }}>
            AI RECOMMENDED PLAYBOOK
          </div>
          <div style={{ color: GOLD, fontSize: 13, fontWeight: 700 }}>{d.recommendedPlaybook}</div>
        </div>
      </div>

      {/* Recorded Decision State — shown if no action was logged */}
      {noActionLogged ? (
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderLeft: '4px solid rgba(255,255,255,0.25)',
          borderRadius: 0, padding: '10px 14px',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <MinusCircle size={13} color="rgba(255,255,255,0.35)" />
          <div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em' }}>
              DECISION RECORDED — NO ACTION TAKEN
            </div>
            <div style={{ color: 'rgba(255,255,255,0.28)', fontSize: 10, marginTop: 2 }}>
              {new Date(noActionLogged).toLocaleString()} · Signal remained visible
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 8 }}>
          <a
            href="/live-activation-center"
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              background: GOLD, color: NAVY,
              borderRadius: 0, padding: '12px 0',
              fontWeight: 800, fontSize: 13, letterSpacing: '0.05em',
              textDecoration: 'none',
            }}
          >
            <Zap size={14} /> ACTIVATE PLAYBOOK
          </a>
          <a
            href="/live-detection-feed"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.7)',
              borderRadius: 0, padding: '12px 16px',
              fontWeight: 600, fontSize: 12,
              textDecoration: 'none',
            }}
          >
            Details <ArrowRight size={12} />
          </a>
          <button
            onClick={handleLogNoAction}
            title="Record that this signal was reviewed with no action taken"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.4)',
              borderRadius: 0, padding: '12px 14px',
              fontWeight: 600, fontSize: 11, cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            <MinusCircle size={12} /> Log No Action
          </button>
        </div>
      )}
    </motion.div>
  );
}

// ─── Domain Status Grid ───────────────────────────────────────────────────────
const DOMAINS = [
  'Competitive', 'M&A', 'Regulatory',
  'Talent', 'Market Ops', 'Financial',
  'Technology', 'Supply Chain', 'Stakeholder',
];

function DomainStatusGrid({ detections }: { detections: Detection[] }) {
  const detectionDomains = detections.map(d => (d.triggerDomain || '').toLowerCase());
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Layers size={14} color={GOLD} />
        <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700, fontSize: 11, letterSpacing: '0.12em' }}>
          DOMAIN STATUS BOARD
        </span>
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>— 9 of 9 monitored</span>
      </div>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8,
      }}>
        {DOMAINS.map((domain) => {
          const hasAlert = detectionDomains.some(d => d.includes(domain.toLowerCase().split(' ')[0]));
          const color = hasAlert ? GOLD : TEAL;
          return (
            <div key={domain} style={{
              background: hasAlert ? 'rgba(201,168,76,0.08)' : 'rgba(43,138,110,0.06)',
              border: `1px solid ${hasAlert ? 'rgba(201,168,76,0.25)' : 'rgba(43,138,110,0.2)'}`,
              borderRadius: 0, padding: '10px 10px 8px',
              textAlign: 'center',
            }}>
              <PulseOrb color={color} size={8} animate={hasAlert} />
              <div style={{ color: hasAlert ? GOLD : 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 700, marginTop: 6, letterSpacing: '0.04em' }}>
                {domain}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CommandTower() {
  const clock = useClock();
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    updatePageMetadata({
      title: 'Command Tower — Readiness OS',
      description: 'Real-time strategic execution monitoring. Live trigger detections, playbook executions, and signal intelligence at a glance.',
    });
  }, []);

  // ── Data fetching (auto-refresh every 30 seconds) ──────────────────────────
  const { data: detectionsData, refetch: refetchDetections } = useQuery<{ detections: Detection[] }>({
    queryKey: ['/api/detections'],
    refetchInterval: 30000,
  });

  const { data: activationsData, refetch: refetchActivations } = useQuery<Activation[]>({
    queryKey: ['/api/playbook-activations'],
    refetchInterval: 30000,
  });

  const { data: liveStatus, refetch: refetchStatus } = useQuery<LiveStatus>({
    queryKey: ['/api/signals/live/status'],
    refetchInterval: 10000,
  });

  const { data: triggerSummary } = useQuery<{
    total: number;
    byAlertLevel: Record<string, number>;
    byCategory: Record<string, number>;
  }>({
    queryKey: ['/api/trigger-evaluation-summary'],
    refetchInterval: 60000,
  });

  const { data: monitoringConfig } = useQuery<{
    disabledDataPoints: string[];
    evaluationMode: string;
  }>({
    queryKey: ['/api/signal-monitoring-config'],
    refetchInterval: 60000,
  });

  const detections: Detection[] = detectionsData?.detections || [];
  const activations: Activation[] = activationsData || [];
  const systemStatus = deriveSystemStatus(detections, activations);
  const statusCfg = STATUS_CONFIG[systemStatus];
  const StatusIcon = statusCfg.icon;
  const nextScanLabel = useCountdown(liveStatus?.nextRun);

  const handleManualRefresh = async () => {
    await Promise.all([refetchDetections(), refetchActivations(), refetchStatus()]);
    setLastRefresh(new Date());
  };

  // ── WebSocket — live push updates ─────────────────────────────────────────
  const wsRef = useRef<WebSocket | null>(null);
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}`);
    wsRef.current = ws;
    ws.onmessage = (evt) => {
      try {
        const data = JSON.parse(evt.data);
        if (data.type === 'new-detection') {
          refetchDetections();
          refetchStatus();
        }
      } catch {}
    };
    return () => ws.close();
  }, []);

  // ── Derived stats ─────────────────────────────────────────────────────────
  const recentDetections = detections.slice(0, 6);
  const recentActivations = activations.slice(0, 5);
  const triggersArmed = triggerSummary?.total || 221;
  const evaluationMode = monitoringConfig?.evaluationMode || 'both';
  const modeLabel = evaluationMode === 'configured' ? 'Custom Engine' : evaluationMode === 'default' ? 'Default Engine' : 'Dual Engine';

  // ── Red-level alerts count (for status badge) ────────────────────────────
  const criticalCount = detections.filter(d =>
    d.confidenceScore >= 85 &&
    Date.now() - new Date(d.detectedAt).getTime() < 24 * 60 * 60 * 1000
  ).length;

  return (
    <div style={{
      minHeight: '100vh',
      background: NAVY,
      color: '#fff',
      fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient grid overlay */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
      }} />

      {/* Ambient glow orbs */}
      <div style={{
        position: 'fixed', top: '-200px', right: '-100px', width: 700, height: 700,
        borderRadius: 0, background: 'radial-gradient(circle, rgba(43,138,110,0.09) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', bottom: '-200px', left: '-100px', width: 600, height: 600,
        borderRadius: 0, background: 'radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <ExecutionStageGuide variant="banner" />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1400, margin: '0 auto', padding: '0 28px' }}>

        {/* ── TOP HEADER BAR ──────────────────────────────────────────────── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 0 0',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          paddingBottom: 16, marginBottom: 28,
        }}>
          {/* Left: Identity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 0,
              border: `2px solid ${GOLD}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(201,168,76,0.1)',
            }}>
              <span style={{ color: GOLD, fontWeight: 800, fontSize: 14 }}>VM</span>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: GOLD, fontWeight: 800, fontSize: 18, letterSpacing: '0.04em' }}>
                  COMMAND TOWER
                </span>
                <span style={{
                  background: 'rgba(201,168,76,0.15)', color: GOLD,
                  fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 0,
                  letterSpacing: '0.12em',
                }}>
                  READINESS OS
                </span>
              </div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 1 }}>
                Live Wall Display · Auto-Refreshing · Read-Only
                <Link href="/mission-control" style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, marginLeft: 12, textDecoration: 'none', fontWeight: 600 }}>
                  ← Back to Mission Control
                </Link>
              </div>
            </div>
          </div>

          {/* Center: System Status Badge */}
          <motion.div
            key={systemStatus}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: statusCfg.bg,
              border: `1px solid ${statusCfg.border}`,
              borderRadius: 0, padding: '10px 22px',
            }}
          >
            <PulseOrb color={statusCfg.color} size={11} animate={statusCfg.pulse} />
            <StatusIcon size={16} color={statusCfg.color} />
            <span style={{ color: statusCfg.color, fontWeight: 800, fontSize: 13, letterSpacing: '0.12em' }}>
              {statusCfg.label}
            </span>
            {systemStatus === 'alert' && criticalCount > 0 && (
              <span style={{
                background: RED_ALT, color: '#fff', fontSize: 10, fontWeight: 800,
                padding: '1px 7px', borderRadius: 0, marginLeft: 4,
              }}>
                {criticalCount} CRITICAL
              </span>
            )}
          </motion.div>

          {/* Right: Clock + Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, fontVariantNumeric: 'tabular-nums' }}>
                {clock}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, marginTop: 1 }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
            </div>
            <button
              onClick={handleManualRefresh}
              style={{
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 0, padding: '7px 12px', color: 'rgba(255,255,255,0.6)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontSize: 11,
              }}
            >
              <RefreshCw size={12} />
              Refresh
            </button>
            <Link href="/request-access" style={{
                display: 'flex', alignItems: 'center', gap: 7,
                background: GOLD, color: NAVY,
                borderRadius: 0, padding: '9px 18px',
                fontWeight: 800, fontSize: 12, letterSpacing: '0.06em',
                textDecoration: 'none', whiteSpace: 'nowrap',
              }}>
                ACCESS PLATFORM <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* ── NOC STAT RAIL ─────────────────────────────────────────────────── */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24,
        }}>
          {[
            { label: 'TRIGGERS ARMED', value: triggersArmed.toLocaleString(), sub: '221 signals', icon: Target, color: GOLD, bg: 'rgba(201,168,76,0.08)', border: 'rgba(201,168,76,0.2)' },
            { label: 'ACTIVE DETECTIONS', value: detections.length.toString(), sub: detections.length > 0 ? 'Review required' : 'All clear', icon: AlertTriangle, color: detections.length > 0 ? RED_ALT : TEAL, bg: detections.length > 0 ? 'rgba(192,57,43,0.08)' : 'rgba(43,138,110,0.07)', border: detections.length > 0 ? 'rgba(192,57,43,0.25)' : 'rgba(43,138,110,0.2)' },
            { label: 'PLAYBOOKS READY', value: '170', sub: 'Pre-staged', icon: Layers, color: TEAL, bg: 'rgba(43,138,110,0.07)', border: 'rgba(43,138,110,0.2)' },
            { label: 'NEXT SCAN', value: nextScanLabel, sub: `Engine: ${modeLabel}`, icon: Clock, color: 'rgba(255,255,255,0.7)', bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.1)' },
          ].map(({ label, value, sub, icon: Icon, color, bg, border }) => (
            <div key={label} style={{
              background: bg, border: `1px solid ${border}`,
              borderRadius: 0, padding: '18px 20px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
                <Icon size={13} color={color} />
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em' }}>
                  {label}
                </span>
              </div>
              <div style={{ color, fontWeight: 800, fontSize: 32, fontVariantNumeric: 'tabular-nums', lineHeight: 1, marginBottom: 5 }}>
                {value}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* ── NOC MAIN GRID: Alert Zone (left) + Control Panels (right) ─────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 380px',
          gap: 20,
          alignItems: 'start',
        }}>

          {/* ── LEFT: LIVE ALERT ZONE ─────────────────────────────────────── */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: detections.length > 0 ? '1px solid rgba(201,168,76,0.2)' : '1px solid rgba(255,255,255,0.07)',
            borderRadius: 0, padding: '20px 22px',
          }}>
            {/* Zone Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 20, paddingBottom: 16,
              borderBottom: '1px solid rgba(255,255,255,0.07)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  background: detections.length > 0 ? 'rgba(201,168,76,0.15)' : 'rgba(43,138,110,0.12)',
                  border: `1px solid ${detections.length > 0 ? 'rgba(201,168,76,0.3)' : 'rgba(43,138,110,0.25)'}`,
                  borderRadius: 0, padding: '4px 10px',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <PulseOrb color={detections.length > 0 ? GOLD : TEAL} size={8} animate />
                  <span style={{ color: detections.length > 0 ? GOLD : TEAL, fontSize: 10, fontWeight: 800, letterSpacing: '0.1em' }}>
                    {detections.length > 0 ? `${detections.length} ALERT${detections.length > 1 ? 'S' : ''} ACTIVE` : 'ALL CLEAR'}
                  </span>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700, fontSize: 13, letterSpacing: '0.06em' }}>
                  LIVE ALERT ZONE
                </span>
              </div>
              <Link href="/live-detection-feed" style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                Full Feed <ArrowRight size={11} />
              </Link>
            </div>

            <AnimatePresence mode="popLayout">
              {recentDetections.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    background: 'rgba(43,138,110,0.07)',
                    border: '1px solid rgba(43,138,110,0.2)',
                    borderRadius: 0, padding: '60px 24px',
                    textAlign: 'center',
                  }}
                >
                  <CheckCircle2 size={48} color={TEAL} style={{ margin: '0 auto 16px', display: 'block' }} />
                  <div style={{ color: TEAL, fontWeight: 800, fontSize: 22, marginBottom: 8, letterSpacing: '0.04em' }}>
                    ALL SYSTEMS CLEAR
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, maxWidth: 400, margin: '0 auto', lineHeight: 1.6 }}>
                    No trigger events detected. {triggersArmed} triggers are armed and continuously monitoring across 9 strategic domains.
                  </div>
                  <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 10 }}>
                    <a href="/live-activation-center" style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      background: GOLD, color: NAVY,
                      borderRadius: 0, padding: '11px 22px',
                      fontWeight: 800, fontSize: 13, textDecoration: 'none',
                    }}>
                      <Zap size={14} /> Activate Playbook
                    </a>
                    <a href="/triggers-management" style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)',
                      color: 'rgba(255,255,255,0.7)',
                      borderRadius: 0, padding: '11px 22px',
                      fontWeight: 600, fontSize: 13, textDecoration: 'none',
                    }}>
                      <Eye size={13} /> View Triggers
                    </a>
                  </div>
                </motion.div>
              ) : (
                recentDetections.map((d, i) => (
                  <DetectionCard key={d.id} d={d} index={i} />
                ))
              )}
            </AnimatePresence>
          </div>

          {/* ── RIGHT: CONTROL PANELS ─────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Domain Status Board */}
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 0, padding: '18px 20px',
            }}>
              <DomainStatusGrid detections={detections} />
            </div>

            {/* Execution Log */}
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 0, padding: '18px 20px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <TrendingUp size={14} color={TEAL} />
                  <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700, fontSize: 11, letterSpacing: '0.12em' }}>
                    EXECUTION LOG
                  </span>
                </div>
                {activations.length > 0 && (
                  <span style={{ background: 'rgba(43,138,110,0.15)', color: TEAL, fontSize: 10, fontWeight: 700, padding: '1px 8px', borderRadius: 0 }}>
                    {activations.length} total
                  </span>
                )}
              </div>

              {recentActivations.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px 12px' }}>
                  <Circle size={24} color="rgba(255,255,255,0.12)" style={{ margin: '0 auto 8px', display: 'block' }} />
                  <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>No executions yet</div>
                  <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, lineHeight: 1.5 }}>
                    170 playbooks pre-staged. 12-minute deployment on trigger.
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {recentActivations.map((a, i) => {
                    const isRecent = Date.now() - new Date(a.activatedAt).getTime() < 2 * 60 * 60 * 1000;
                    return (
                      <motion.div
                        key={a.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        style={{
                          background: isRecent ? 'rgba(43,138,110,0.1)' : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${isRecent ? 'rgba(43,138,110,0.25)' : 'rgba(255,255,255,0.07)'}`,
                          borderLeft: `4px solid ${isRecent ? TEAL : 'rgba(255,255,255,0.15)'}`,
                          borderRadius: 0, padding: '12px 14px',
                        }}
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
                            <div style={{ background: 'rgba(43,138,110,0.2)', color: TEAL, fontWeight: 800, fontSize: 13, padding: '2px 8px', borderRadius: 0, flexShrink: 0 }}>
                              {a.successRating}%
                            </div>
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
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 0, padding: '18px 20px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14 }}>
                <Clock size={13} color={TEAL} />
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em' }}>SCAN CYCLE</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                {[
                  { label: 'Last scan', value: liveStatus?.lastRun ? timeAgo(liveStatus.lastRun) : '—', color: '#fff' },
                  { label: 'Next scan', value: nextScanLabel, color: TEAL },
                  { label: 'Engine', value: modeLabel.toUpperCase(), color: TEAL },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{label}</span>
                    <span style={{ color, fontSize: 12, fontWeight: 700 }}>{value}</span>
                  </div>
                ))}
              </div>
              <div style={{
                background: `linear-gradient(135deg, rgba(201,168,76,0.12) 0%, rgba(43,138,110,0.08) 100%)`,
                border: '1px solid rgba(201,168,76,0.2)',
                borderRadius: 0, padding: '14px 16px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
                  <Zap size={12} color={GOLD} />
                  <span style={{ color: GOLD, fontSize: 9, fontWeight: 700, letterSpacing: '0.12em' }}>EXECUTION HEAD START</span>
                </div>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: 30, lineHeight: 1, marginBottom: 3 }}>3,600×</div>
                <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, lineHeight: 1.5 }}>
                  30 days → 12 minutes. 170 playbooks pre-staged.
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: 10 }}>
              <a href="/live-activation-center" style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                background: GOLD, color: NAVY, borderRadius: 0, padding: '13px 0',
                fontWeight: 800, fontSize: 12, letterSpacing: '0.05em', textDecoration: 'none',
              }}>
                <Zap size={13} /> ACTIVATE
              </a>
              <a href="/live-detection-feed" style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.7)', borderRadius: 0, padding: '13px 0',
                fontWeight: 600, fontSize: 12, textDecoration: 'none',
              }}>
                <Radio size={12} /> FEED
              </a>
            </div>
          </div>
        </div>

        {/* ── CLASSIFIED BUT UNMATCHED — ADVANCE PHASE ─────────────────────── */}
        <div style={{
          marginTop: 24,
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 0, padding: '20px 22px',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 16, paddingBottom: 14,
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <GitBranch size={14} color="rgba(255,255,255,0.4)" />
              <span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700, fontSize: 11, letterSpacing: '0.12em' }}>
                CLASSIFIED — NO PLAYBOOK MATCH
              </span>
              <span style={{
                background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.4)', fontSize: 9, fontWeight: 700,
                padding: '2px 8px', borderRadius: 0, letterSpacing: '0.1em',
              }}>
                ADVANCE PHASE REQUIRED
              </span>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11 }}>
              Map grows through human encoding
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[
              {
                domain: 'Geopolitical',
                signal: 'Tariff reclassification affecting 14 component categories — no Fortune 1000 precedent yet established',
                impact: 'Supply chain + Financial exposure',
                classified: '47 min ago',
              },
              {
                domain: 'Technology',
                signal: 'Regulatory draft language would require explainability audits for automated decisioning systems above $10M threshold',
                impact: 'AI Governance + Compliance',
                classified: '2 hr ago',
              },
              {
                domain: 'Talent',
                signal: 'Cross-industry exodus pattern in mid-level operations roles — no single causal trigger identified across 6 sectors',
                impact: 'Workforce + Execution capacity',
                classified: '4 hr ago',
              },
            ].map((item, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderLeft: '3px solid rgba(255,255,255,0.2)',
                borderRadius: 0, padding: '14px 16px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <span style={{
                    background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.45)',
                    fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 0, letterSpacing: '0.08em',
                  }}>
                    {item.domain.toUpperCase()}
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10 }}>{item.classified}</span>
                </div>
                <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, lineHeight: 1.5, marginBottom: 10 }}>
                  {item.signal}
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 8,
                }}>
                  <span style={{ color: 'rgba(255,255,255,0.28)', fontSize: 10 }}>{item.impact}</span>
                  <span style={{
                    color: 'rgba(255,255,255,0.3)', fontSize: 9, fontWeight: 700,
                    letterSpacing: '0.08em', background: 'rgba(255,255,255,0.05)',
                    padding: '2px 7px', borderRadius: 0,
                  }}>
                    NO PLAYBOOK
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, color: 'rgba(255,255,255,0.2)', fontSize: 11, lineHeight: 1.6 }}>
            These signals have been classified by domain and impact shape. No existing playbook matches. Human encoding through the ADVANCE phase will expand the map.
            Ignoring them is now a recorded choice, not an invisible one.
          </div>
        </div>

        {/* ── LIVE SIGNAL ACTIVITY FEED ────────────────────────────────────── */}
        <div style={{ marginTop: 24 }}>
          <LiveSignalFeed dark={true} maxRows={25} />
        </div>

        {/* ── DRILL-DOWN ACCESS STRIP ──────────────────────────────────────── */}
        <div style={{
          marginTop: 24,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 0, padding: '14px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ChevronRight size={13} color={GOLD} />
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em' }}>
              DRILL DOWN INTO READINESS OS
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {[
              { label: 'Live Detections', href: '/live-detection-feed', color: GOLD },
              { label: 'Playbook Library', href: '/playbooks', color: 'rgba(255,255,255,0.6)' },
              { label: 'Trigger Intelligence', href: '/triggers-management', color: 'rgba(255,255,255,0.6)' },
              { label: 'Command Center', href: '/command-center', color: 'rgba(255,255,255,0.6)' },
              { label: 'Signal Intelligence', href: '/signal-intelligence', color: 'rgba(255,255,255,0.6)' },
            ].map(({ label, href, color }) => (
              <Link key={href} href={href} style={{
                display: 'flex', alignItems: 'center', gap: 5,
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 0, padding: '6px 12px',
                color, fontSize: 11, fontWeight: 600,
                textDecoration: 'none', transition: 'all 0.14s',
              }}>
                {label} <ArrowRight size={10} />
              </Link>
            ))}
            <Link href="/request-access" style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: GOLD, borderRadius: 0, padding: '6px 14px',
              color: NAVY, fontSize: 11, fontWeight: 800,
              textDecoration: 'none', letterSpacing: '0.04em',
            }}>
              Get Full Access <ArrowRight size={10} />
            </Link>
          </div>
        </div>

        {/* ── BOTTOM: Signal Ticker ────────────────────────────────────────── */}
        <div style={{
          marginTop: 16, marginBottom: 0,
          borderTop: '1px solid rgba(255,255,255,0.07)',
          paddingTop: 14, paddingBottom: 20,
          display: 'flex', alignItems: 'center', gap: 16, overflow: 'hidden',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 7,
            flexShrink: 0,
            background: 'rgba(43,138,110,0.12)',
            border: '1px solid rgba(43,138,110,0.2)',
            borderRadius: 0, padding: '4px 10px',
          }}>
            <PulseOrb color={TEAL} size={7} />
            <span style={{ color: TEAL, fontWeight: 700, fontSize: 10, letterSpacing: '0.1em' }}>
              LIVE
            </span>
          </div>

          <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
            <motion.div
              style={{ display: 'flex', gap: 32, whiteSpace: 'nowrap' }}
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            >
              {[
                'Monitoring 248+ data points across 9 strategic domains',
                `${triggersArmed} triggers armed and evaluating`,
                `Evaluation engine: ${modeLabel}`,
                'Signal scan interval: every 15 minutes',
                'Sources: Reuters, Bloomberg, SEC EDGAR, AP News + 4 more',
                '170 playbooks pre-staged and ready to deploy',
                'Response time: 30 days → 12 minutes  ·  3,600× Execution Head Start',
                'Monitoring 248+ data points across 9 strategic domains',
                `${triggersArmed} triggers armed and evaluating`,
                `Evaluation engine: ${modeLabel}`,
                'Signal scan interval: every 15 minutes',
                'Sources: Reuters, Bloomberg, SEC EDGAR, AP News + 4 more',
                '170 playbooks pre-staged and ready to deploy',
                'Response time: 30 days → 12 minutes  ·  3,600× Execution Head Start',
              ].map((item, i) => (
                <span key={i} style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>
                  {item}
                  <span style={{ margin: '0 16px', color: 'rgba(255,255,255,0.1)' }}>·</span>
                </span>
              ))}
            </motion.div>
          </div>
        </div>

      </div>
    </div>
  );
}
