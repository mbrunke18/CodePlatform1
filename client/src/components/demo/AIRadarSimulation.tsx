import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, TrendingDown, Activity } from 'lucide-react';
import { aiDataStreams } from '@shared/luxury-demo-data';

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const TEAL_LT = "#3BAF8A";

interface DataStream {
  id: string;
  name: string;
  description: string;
  status: string;
}

interface AIRadarSimulationProps {
  title?: string;
  subtitle?: string;
  dataStreams?: DataStream[];
  playbookId?: string;
  playbookName?: string;
  onTriggerFired?: () => void;
  autoStart?: boolean;
}

export default function AIRadarSimulation({
  title = "AI Intelligence Monitoring",
  subtitle = "Real-time crisis detection across data streams",
  dataStreams: customDataStreams,
  playbookId = "#044",
  playbookName = "Revenue Shortfall - Asia Pacific",
  onTriggerFired,
  autoStart = false,
}: AIRadarSimulationProps) {
  const [confidence, setConfidence] = useState(65);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [triggered, setTriggered] = useState(false);

  const initialStreams = customDataStreams || aiDataStreams;
  const [streams, setStreams] = useState(initialStreams.map(s => ({ ...s, confidence: 65 })));

  useEffect(() => {
    if (autoStart) setIsMonitoring(true);
  }, [autoStart]);

  useEffect(() => {
    if (!isMonitoring || triggered) return;

    const interval = setInterval(() => {
      setConfidence(prev => {
        const next = Math.min(prev + Math.random() * 3, 95);
        if (next >= 88 && !triggered) {
          setTriggered(true);
          setTimeout(() => { onTriggerFired?.(); }, 500);
        }
        return next;
      });

      setStreams(prev => prev.map(stream => ({
        ...stream,
        confidence: Math.min(stream.confidence + Math.random() * 5, 95),
      })));
    }, 800);

    return () => clearInterval(interval);
  }, [isMonitoring, triggered, onTriggerFired]);

  const getConfidenceColor = (conf: number) => {
    if (conf >= 85) return '#ef4444';
    if (conf >= 70) return GOLD;
    return TEAL_LT;
  };

  const getStreamStatus = (conf: number) => {
    if (conf >= 85) return 'critical';
    if (conf >= 70) return 'warning';
    return 'normal';
  };

  return (
    <div className="space-y-5">
      <div className="text-center mb-2">
        <h2 style={{ fontSize: 26, fontWeight: 700, color: '#FFFFFF', marginBottom: 6 }}>{title}</h2>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)' }}>{subtitle}</p>
      </div>

      {/* Main Confidence Meter */}
      <div
        style={{
          borderRadius: 0,
          border: triggered ? '2px solid #ef4444' : '1px solid rgba(255,255,255,0.12)',
          background: triggered ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.04)',
          padding: '20px 22px',
          transition: 'border-color 0.3s, background 0.3s',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Activity style={{ width: 16, height: 16, color: isMonitoring ? TEAL_LT : 'rgba(255,255,255,0.4)' }}
              className={isMonitoring ? 'animate-pulse' : ''} />
            <span style={{ fontWeight: 600, fontSize: 14, color: 'rgba(255,255,255,0.85)' }}>
              Trigger Monitoring
            </span>
          </div>
          <Badge
            variant={triggered ? 'destructive' : isMonitoring ? 'default' : 'outline'}
            data-testid="badge-monitoring"
            style={isMonitoring && !triggered ? { background: TEAL, color: '#fff', border: 'none' } : {}}
          >
            {triggered ? '🚨 TRIGGERED' : isMonitoring ? '● Live' : '○ Inactive'}
          </Badge>
        </div>

        <div className="space-y-3">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>Trigger Confidence</span>
            <span style={{ fontSize: 24, fontWeight: 700, color: getConfidenceColor(confidence) }}
              data-testid="text-confidence">
              {confidence.toFixed(1)}%
            </span>
          </div>

          <Progress value={confidence} className="h-3" data-testid="progress-confidence" />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>Threshold: 85%</span>
            {triggered && (
              <span style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', display: 'flex', alignItems: 'center', gap: 4 }}>
                <AlertTriangle style={{ width: 12, height: 12 }} />
                THRESHOLD EXCEEDED
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Trigger Alert */}
      {triggered && (
        <div
          style={{
            borderRadius: 0,
            border: '2px solid #ef4444',
            background: 'rgba(239,68,68,0.1)',
            padding: '20px 22px',
            animation: 'pulse 2s infinite',
          }}
          data-testid="card-trigger-alert"
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <div style={{ padding: 8, background: '#ef4444', borderRadius: 0, flexShrink: 0 }}>
              <AlertTriangle style={{ width: 20, height: 20, color: '#fff' }} />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontWeight: 700, fontSize: 16, color: '#FFFFFF', marginBottom: 4 }}>
                Prepared Response {playbookId} Recommended
              </h4>
              <p style={{ fontSize: 13, color: '#f87171', marginBottom: 10 }}>{playbookName}</p>
              <div style={{
                background: 'rgba(239,68,68,0.12)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 0,
                padding: '8px 12px',
              }}>
                <p style={{ fontSize: 11, fontFamily: 'monospace', color: '#fca5a5' }}>
                  <TrendingDown style={{ display: 'inline', width: 12, height: 12, marginRight: 4 }} />
                  Confidence: {confidence.toFixed(1)}% | Prepared Response activation recommended
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Streams */}
      <div style={{
        borderRadius: 0,
        border: '1px solid rgba(255,255,255,0.10)',
        background: 'rgba(255,255,255,0.03)',
        padding: '20px 22px',
      }}>
        <h4 style={{ fontWeight: 600, fontSize: 13, color: 'rgba(255,255,255,0.55)',
          textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>
          Intelligence Data Streams
        </h4>
        <div className="space-y-3">
          {streams.map(stream => (
            <div key={stream.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: 0,
                  background: getStreamStatus(stream.confidence) === 'critical' ? '#ef4444'
                    : getStreamStatus(stream.confidence) === 'warning' ? GOLD
                    : TEAL_LT,
                  flexShrink: 0,
                }} className={getStreamStatus(stream.confidence) === 'critical' ? 'animate-pulse' : ''} />
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{stream.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Progress value={stream.confidence} className="w-20 h-2" />
                <span style={{ fontSize: 11, fontFamily: 'monospace', width: 40, textAlign: 'right',
                  color: getConfidenceColor(stream.confidence) }}>
                  {stream.confidence.toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {!isMonitoring && (
        <button
          onClick={() => setIsMonitoring(true)}
          style={{
            width: '100%', padding: '12px 0',
            background: GOLD, color: NAVY,
            borderRadius: 0, fontWeight: 700, fontSize: 14,
            border: 'none', cursor: 'pointer',
          }}
          className="hover:opacity-90 transition-opacity"
          data-testid="button-start-monitoring"
        >
          Start AI Monitoring Simulation
        </button>
      )}
    </div>
  );
}
