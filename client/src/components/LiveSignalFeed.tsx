import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { Radio, Shield, AlertTriangle, CheckCircle, Zap, Activity } from 'lucide-react';

const NAVY = '#0A0F2E';
const GOLD = '#C9A84C';
const TEAL = '#2B8A6E';

interface ActivityEntry {
  id: number;
  eventType: string;
  source: string | null;
  signalTitle: string | null;
  details: string | null;
  confidence: number | null;
  keywordsMatched: string[] | null;
  createdAt: string;
}

function EventIcon({ type }: { type: string }) {
  const map: Record<string, { icon: any; color: string }> = {
    scanning: { icon: Activity, color: '#6B7280' },
    evaluated: { icon: Shield, color: TEAL },
    threshold_not_met: { icon: CheckCircle, color: '#9CA3AF' },
    trigger_fired: { icon: Zap, color: GOLD },
    dismissed: { icon: CheckCircle, color: '#9CA3AF' },
  };
  const { icon: Icon, color } = map[type] || { icon: Radio, color: '#6B7280' };
  return (
    <div style={{ width: 26, height: 26, borderRadius: 0, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon size={12} color={color} />
    </div>
  );
}

function EventLabel({ type }: { type: string }) {
  const map: Record<string, { label: string; color: string }> = {
    scanning: { label: 'SCANNING', color: '#6B7280' },
    evaluated: { label: 'EVALUATED', color: TEAL },
    threshold_not_met: { label: 'DISMISSED', color: '#9CA3AF' },
    trigger_fired: { label: '⚡ TRIGGER FIRED', color: GOLD },
    dismissed: { label: 'DISMISSED', color: '#9CA3AF' },
  };
  const { label, color } = map[type] || { label: type.toUpperCase(), color: '#999' };
  return <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color }}>{label}</span>;
}

export function LiveSignalFeed({ maxRows = 20, dark = false }: { maxRows?: number; dark?: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [liveEntries, setLiveEntries] = useState<ActivityEntry[]>([]);
  const isFirstLoad = useRef(true);

  const { data: rawFeedData } = useQuery<ActivityEntry[]>({
    queryKey: ['/api/signal-activity-log'],
    refetchInterval: 30000,
  });
  const data = Array.isArray(rawFeedData) ? rawFeedData : [];

  useEffect(() => {
    if (data.length === 0) return;
    if (isFirstLoad.current) {
      setLiveEntries(data.slice(0, maxRows));
      isFirstLoad.current = false;
    } else {
      // Merge new entries at the top
      setLiveEntries(prev => {
        const existingIds = new Set(prev.map(e => e.id));
        const newItems = data.filter(e => !existingIds.has(e.id));
        if (newItems.length === 0) return prev;
        return [...newItems, ...prev].slice(0, maxRows);
      });
    }
  }, [data, maxRows]);

  const bg = dark ? 'rgba(255,255,255,0.04)' : '#fff';
  const border = dark ? 'rgba(255,255,255,0.10)' : '#E8E4DC';
  const textPrimary = dark ? 'rgba(255,255,255,0.85)' : NAVY;
  const textSub = dark ? 'rgba(255,255,255,0.4)' : '#9CA3AF';
  const rowBorder = dark ? 'rgba(255,255,255,0.06)' : '#F0EDE4';

  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 0, overflow: 'hidden', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      {/* Header */}
      <div style={{ padding: '14px 18px', borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ position: 'relative' }}>
          <Radio size={15} color={TEAL} />
          <span style={{ position: 'absolute', top: -2, right: -2, width: 6, height: 6, borderRadius: 0, background: TEAL, animation: 'pulse 2s infinite' }} />
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: dark ? GOLD : NAVY }}>Live Signal Activity</span>
        <span style={{ fontSize: 10, color: textSub, marginLeft: 'auto' }}>Refreshes every 30s</span>
      </div>
      <style>{`@keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } }`}</style>

      {/* Feed */}
      <div ref={scrollRef} style={{ maxHeight: 380, overflowY: 'auto' }}>
        {liveEntries.length === 0 ? (
          <div style={{ padding: '32px 18px', textAlign: 'center' }}>
            <Activity size={24} color="#DDD" style={{ margin: '0 auto 10px' }} />
            <div style={{ fontSize: 12, color: textSub }}>Signal scanning begins at the next 15-minute cycle</div>
          </div>
        ) : (
          liveEntries.map((entry, i) => (
            <div key={entry.id ?? i} style={{ padding: '12px 18px', borderBottom: `1px solid ${rowBorder}`, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <EventIcon type={entry.eventType} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3, flexWrap: 'wrap' }}>
                  <EventLabel type={entry.eventType} />
                  {entry.source && <span style={{ fontSize: 11, color: textSub, fontWeight: 500 }}>· {entry.source}</span>}
                  {entry.confidence != null && (
                    <span style={{ fontSize: 11, fontWeight: 700, color: entry.eventType === 'trigger_fired' ? GOLD : textSub }}>{entry.confidence}%</span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: textPrimary, fontWeight: entry.eventType === 'trigger_fired' ? 700 : 400, lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' } as any}>
                  {entry.signalTitle || entry.details || '—'}
                </div>
                {entry.keywordsMatched && entry.keywordsMatched.length > 0 && (
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 5 }}>
                    {entry.keywordsMatched.slice(0, 4).map((kw, ki) => (
                      <span key={ki} style={{ fontSize: 9, background: entry.eventType === 'trigger_fired' ? `${GOLD}20` : `${TEAL}12`, color: entry.eventType === 'trigger_fired' ? '#8B6914' : TEAL, border: `1px solid ${entry.eventType === 'trigger_fired' ? `${GOLD}30` : `${TEAL}25`}`, borderRadius: 0, padding: '2px 6px', fontWeight: 600 }}>{kw}</span>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ fontSize: 10, color: textSub, flexShrink: 0, whiteSpace: 'nowrap', paddingTop: 1 }}>
                {new Date(entry.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
