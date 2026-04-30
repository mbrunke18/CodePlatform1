import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { TrendingUp, Clock, Zap, BarChart2 } from 'lucide-react';

const NAVY = '#0A0F2E';
const GOLD = '#C9A84C';
const TEAL = '#2B8A6E';

function AnimatedCount({ target, prefix = '', suffix = '', decimals = 0, duration = 2000 }: {
  target: number; prefix?: string; suffix?: string; decimals?: number; duration?: number;
}) {
  const [val, setVal] = useState(0);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!target) return;
    let start = 0;
    const steps = duration / 16;
    const increment = target / steps;
    ref.current = setInterval(() => {
      start += increment;
      if (start >= target) { setVal(target); if (ref.current) clearInterval(ref.current); }
      else setVal(start);
    }, 16);
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [target, duration]);

  const display = decimals > 0 ? val.toFixed(decimals) : Math.floor(val).toLocaleString();
  return <>{prefix}{display}{suffix}</>;
}

export function ExecutionDividend({ compact = false }: { compact?: boolean }) {
  const { data, isLoading } = useQuery<any>({
    queryKey: ['/api/org/execution-dividend'],
    refetchInterval: 60000,
  });

  if (isLoading || !data) return null;

  const d = data;
  const hasData = d.totalTriggersResponded > 0;

  if (compact) {
    return (
      <div style={{ background: '#fff', border: '1px solid #E8E4DC', borderRadius: 0, padding: 20, display: 'flex', alignItems: 'center', gap: 16, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
        <div style={{ width: 44, height: 44, borderRadius: 0, background: `${TEAL}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <TrendingUp size={20} color={TEAL} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>Readiness Dividend</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: TEAL }}>
            {hasData
              ? <AnimatedCount target={d.totalValueCreated} prefix="$" duration={2000} />
              : 'Tracking begins at first trigger'
            }
          </div>
        </div>
        {hasData && (
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>{(d.totalHoursSaved || 0).toLocaleString()}h</div>
            <div style={{ fontSize: 10, color: '#999', textTransform: 'uppercase' }}>saved</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ background: '#fff', border: '1px solid #E8E4DC', borderRadius: 0, overflow: 'hidden', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      {/* Header */}
      <div style={{ background: NAVY, padding: '20px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(201,168,76,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.07) 1px, transparent 1px)', backgroundSize: '32px 32px', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12 }}>
          <TrendingUp size={18} color={GOLD} />
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: GOLD }}>Readiness Dividend</span>
        </div>
        <div style={{ position: 'relative', marginTop: 10 }}>
          <div style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: '#fff', letterSpacing: '-1px', lineHeight: 1 }}>
            {hasData
              ? <AnimatedCount target={d.totalValueCreated} prefix="$" duration={2200} />
              : <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.68)' }}>Value accumulates as triggers are responded to</span>
            }
          </div>
          {hasData && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 6 }}>estimated executive value created since deployment</div>}
        </div>
      </div>

      {/* Metric grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1, background: '#E8E4DC' }}>
        {[
          { icon: Clock, label: 'Hours Saved', value: hasData ? <AnimatedCount target={d.totalHoursSaved} suffix="h" duration={1800} /> : '—', color: TEAL },
          { icon: Zap, label: 'Triggers Responded', value: d.totalTriggersResponded, color: GOLD },
          { icon: BarChart2, label: 'Avg Response', value: `${d.avgResponseMinutes}m`, color: NAVY },
          { icon: TrendingUp, label: 'Speed Multiplier', value: hasData ? <><AnimatedCount target={d.avgSpeedMultiplier} duration={2000} />×</> : '3,600×', color: TEAL },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} style={{ background: '#fff', padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Icon size={14} color={color} />
              <span style={{ fontSize: 10, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{label}</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: NAVY }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Explanation */}
      <div style={{ padding: '14px 20px', background: '#F8F7F4', borderTop: '1px solid #E8E4DC' }}>
        <div style={{ fontSize: 11, color: '#999', lineHeight: 1.6 }}>
          Calculated at $500/hr executive rate × hours saved vs. 30-day traditional mobilization baseline. Each trigger response avoids weeks of alignment cycles.
          {d.sinceDate && <> Tracking since {new Date(d.sinceDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}.</>}
        </div>
      </div>
    </div>
  );
}
