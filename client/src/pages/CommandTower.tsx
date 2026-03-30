import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { updatePageMetadata } from '@/lib/seo';
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
  ExternalLink,
  Layers,
  Eye,
  ChevronRight,
  BarChart3,
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
            position: 'absolute', inset: 0, borderRadius: '50%',
            background: color, opacity: 0.4,
          }}
          animate={{ scale: [1, 1.9, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
        />
      )}
      <span style={{
        position: 'absolute', inset: 0, borderRadius: '50%', background: color,
      }} />
    </span>
  );
}

// ─── Detection Card ───────────────────────────────────────────────────────────
function DetectionCard({ d, index }: { d: Detection; index: number }) {
  const cc = confidenceColor(d.confidenceScore);
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07 }}
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid rgba(255,255,255,0.08)`,
        borderLeft: `3px solid ${cc}`,
        borderRadius: 8,
        padding: '16px 18px',
        marginBottom: 10,
        cursor: 'pointer',
      }}
      onClick={() => window.location.href = '/live-detection-feed'}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <PulseOrb color={cc} size={9} animate={d.status !== 'acknowledged'} />
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 14, lineHeight: 1.3 }}>
              {d.triggerName}
            </span>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>
            {d.triggerDomain}
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{
            color: cc, fontWeight: 800, fontSize: 22, lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
          }}>
            {d.confidenceScore}%
          </div>
          <div style={{ color: cc, fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', marginTop: 2 }}>
            {confidenceLabel(d.confidenceScore)}
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        background: 'rgba(201,168,76,0.08)', borderRadius: 5,
        padding: '6px 10px', marginBottom: 8,
      }}>
        <Target size={11} color={GOLD} />
        <span style={{ color: GOLD, fontSize: 12, fontWeight: 600 }}>{d.recommendedPlaybook}</span>
        <span style={{ marginLeft: 4, background: TEAL, color: '#fff', fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 3, letterSpacing: '0.06em' }}>
          AI RECOMMENDED
        </span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>
          {d.signalSource || 'Live Signal'} · {timeAgo(d.detectedAt)}
        </span>
        <span style={{
          color: GOLD, fontSize: 11, fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          Activate <ChevronRight size={11} />
        </span>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CommandTower() {
  const clock = useClock();
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    updatePageMetadata({
      title: 'Command Tower — Execution OS',
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
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(43,138,110,0.09) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', bottom: '-200px', left: '-100px', width: 600, height: 600,
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

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
              width: 40, height: 40, borderRadius: '50%',
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
                  fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 3,
                  letterSpacing: '0.12em',
                }}>
                  EXECUTION OS
                </span>
              </div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 1 }}>
                Strategic Monitoring &amp; Execution Intelligence
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
              borderRadius: 8, padding: '10px 22px',
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
                padding: '1px 7px', borderRadius: 12, marginLeft: 4,
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
                borderRadius: 6, padding: '7px 12px', color: 'rgba(255,255,255,0.6)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontSize: 11,
              }}
            >
              <RefreshCw size={12} />
              Refresh
            </button>
            <Link href="/dashboard">
              <a style={{
                color: 'rgba(255,255,255,0.4)', fontSize: 11, textDecoration: 'none',
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                Platform <ExternalLink size={11} />
              </a>
            </Link>
          </div>
        </div>

        {/* ── MAIN 3-COLUMN GRID ──────────────────────────────────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 240px 340px',
          gap: 20,
          alignItems: 'start',
        }}>

          {/* ── COLUMN 1: Live Detections ─────────────────────────────────── */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertTriangle size={15} color={GOLD} />
                <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700, fontSize: 11, letterSpacing: '0.12em' }}>
                  LIVE DETECTIONS
                </span>
                {detections.length > 0 && (
                  <span style={{
                    background: 'rgba(201,168,76,0.2)', color: GOLD,
                    fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 10,
                  }}>
                    {detections.length}
                  </span>
                )}
              </div>
              <Link href="/live-detection-feed">
                <a style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3 }}>
                  View all <ArrowRight size={11} />
                </a>
              </Link>
            </div>

            <AnimatePresence mode="popLayout">
              {recentDetections.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    background: 'rgba(43,138,110,0.08)',
                    border: '1px solid rgba(43,138,110,0.2)',
                    borderRadius: 10, padding: '36px 24px',
                    textAlign: 'center',
                  }}
                >
                  <CheckCircle2 size={32} color={TEAL} style={{ margin: '0 auto 12px', display: 'block' }} />
                  <div style={{ color: TEAL, fontWeight: 700, fontSize: 15, marginBottom: 4 }}>
                    All Clear
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
                    No active threat signals. {triggersArmed} triggers armed and monitoring.
                  </div>
                </motion.div>
              ) : (
                recentDetections.map((d, i) => (
                  <DetectionCard key={d.id} d={d} index={i} />
                ))
              )}
            </AnimatePresence>
          </div>

          {/* ── COLUMN 2: System Pulse ────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
              <Activity size={15} color={GOLD} />
              <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700, fontSize: 11, letterSpacing: '0.12em' }}>
                SYSTEM PULSE
              </span>
            </div>

            {/* Stat blocks */}
            {[
              { label: 'Triggers Armed', value: triggersArmed.toLocaleString(), icon: Target, color: GOLD },
              { label: 'Data Points', value: '248+', icon: BarChart3, color: TEAL },
              { label: 'Domains Covered', value: '9', icon: Layers, color: 'rgba(255,255,255,0.7)' },
              { label: 'Signals Monitored', value: '221', icon: Eye, color: 'rgba(255,255,255,0.7)' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 8, padding: '14px 16px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
                  <Icon size={12} color={color} />
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em' }}>
                    {label.toUpperCase()}
                  </span>
                </div>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: 24, fontVariantNumeric: 'tabular-nums' }}>
                  {value}
                </div>
              </div>
            ))}

            {/* Scan timing block */}
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 8, padding: '14px 16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
                <Clock size={12} color={TEAL} />
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em' }}>
                  SCAN CYCLE
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>Last scan</span>
                  <span style={{ color: '#fff', fontSize: 11, fontWeight: 600 }}>
                    {liveStatus?.lastRun ? timeAgo(liveStatus.lastRun) : '—'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>Next scan</span>
                  <span style={{ color: TEAL, fontSize: 11, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                    {nextScanLabel}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>Engine</span>
                  <span style={{
                    background: 'rgba(43,138,110,0.15)', color: TEAL,
                    fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 3, letterSpacing: '0.08em',
                  }}>
                    {modeLabel.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
              <Link href="/live-activation-center">
                <a style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  background: GOLD, color: NAVY,
                  borderRadius: 7, padding: '11px 0',
                  fontWeight: 800, fontSize: 12, letterSpacing: '0.06em',
                  textDecoration: 'none',
                }}>
                  <Zap size={13} /> ACTIVATE PLAYBOOK
                </a>
              </Link>
              <Link href="/live-detection-feed">
                <a style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 7, padding: '10px 0',
                  fontWeight: 600, fontSize: 12, letterSpacing: '0.04em',
                  textDecoration: 'none',
                }}>
                  <Radio size={12} /> DETECTION FEED
                </a>
              </Link>
            </div>
          </div>

          {/* ── COLUMN 3: Execution Log ───────────────────────────────────── */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <TrendingUp size={15} color={TEAL} />
                <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700, fontSize: 11, letterSpacing: '0.12em' }}>
                  EXECUTION LOG
                </span>
              </div>
              {recentActivations.length > 0 && (
                <span style={{
                  background: 'rgba(43,138,110,0.15)', color: TEAL,
                  fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 10,
                }}>
                  {activations.length} total
                </span>
              )}
            </div>

            {recentActivations.length === 0 ? (
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 10, padding: '28px 20px', textAlign: 'center',
              }}>
                <Circle size={28} color="rgba(255,255,255,0.15)" style={{ margin: '0 auto 10px', display: 'block' }} />
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                  No Active Executions
                </div>
                <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, lineHeight: 1.5 }}>
                  170 playbooks are pre-staged and ready to deploy within 12 minutes of trigger detection.
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {recentActivations.map((a, i) => {
                  const isRecent = Date.now() - new Date(a.activatedAt).getTime() < 2 * 60 * 60 * 1000;
                  return (
                    <motion.div
                      key={a.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      style={{
                        background: isRecent ? 'rgba(43,138,110,0.1)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${isRecent ? 'rgba(43,138,110,0.3)' : 'rgba(255,255,255,0.08)'}`,
                        borderRadius: 8, padding: '14px 16px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                            {isRecent && <PulseOrb color={TEAL} size={8} />}
                            <span style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>
                              {a.playbookName}
                            </span>
                          </div>
                          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>
                            {a.domainName}
                          </span>
                        </div>
                        {a.successRating != null && (
                          <div style={{
                            background: 'rgba(43,138,110,0.2)', color: TEAL,
                            fontWeight: 800, fontSize: 14, padding: '3px 8px', borderRadius: 5,
                            flexShrink: 0,
                          }}>
                            {a.successRating}%
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>
                          {isRecent ? '● In progress' : '✓ Completed'}
                        </span>
                        <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10 }}>
                          {timeAgo(a.activatedAt)}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* 12-Minute Metric */}
            <div style={{
              marginTop: 16,
              background: `linear-gradient(135deg, rgba(201,168,76,0.12) 0%, rgba(43,138,110,0.08) 100%)`,
              border: '1px solid rgba(201,168,76,0.2)',
              borderRadius: 10, padding: '18px 20px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <Zap size={13} color={GOLD} />
                <span style={{ color: GOLD, fontWeight: 700, fontSize: 10, letterSpacing: '0.12em' }}>
                  EXECUTION HEAD START
                </span>
              </div>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: 28, lineHeight: 1, marginBottom: 4 }}>
                3,600×
              </div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, lineHeight: 1.5 }}>
                30 days compressed to 12 minutes. Playbooks pre-staged before the trigger fires.
              </div>
            </div>
          </div>
        </div>

        {/* ── BOTTOM: Signal Ticker ────────────────────────────────────────── */}
        <div style={{
          marginTop: 24, marginBottom: 0,
          borderTop: '1px solid rgba(255,255,255,0.07)',
          paddingTop: 14, paddingBottom: 20,
          display: 'flex', alignItems: 'center', gap: 16, overflow: 'hidden',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 7,
            flexShrink: 0,
            background: 'rgba(43,138,110,0.12)',
            border: '1px solid rgba(43,138,110,0.2)',
            borderRadius: 5, padding: '4px 10px',
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
