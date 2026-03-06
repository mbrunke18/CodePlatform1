import { useEffect, useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SIGNAL_CATEGORIES } from '@shared/intelligence-signals';

const NAVY = '#0A0F2E';
const GOLD = '#C9A84C';
const TEAL = '#2B8A6E';

function proximityScore(trigger: any): number {
  const base: Record<string, number> = { red: 80, yellow: 48, green: 12 };
  const sev: Record<string, number> = { critical: 18, high: 11, medium: 5, low: 0 };
  return Math.min(100, (base[trigger.alertThreshold ?? 'green'] ?? 12) + (sev[trigger.severity ?? 'low'] ?? 0));
}

function domainColor(score: number): string {
  if (score >= 80) return '#EF4444';
  if (score >= 55) return '#F97316';
  if (score >= 25) return TEAL;
  return '#374151';
}

interface DomainNode {
  id: string;
  name: string;
  x: number;
  y: number;
  score: number;
  triggerCount: number;
}

const CX = 320;
const CY = 190;
const RINGS = [90, 148, 200];

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const a = (angleDeg - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

export default function PulseMap() {
  const { data: triggersRaw } = useQuery<any[]>({ queryKey: ['/api/executive-triggers'] });
  const { data: activationsRaw } = useQuery<any[]>({ queryKey: ['/api/playbook-activations'] });
  const triggers = Array.isArray(triggersRaw) ? triggersRaw : [];
  const activations = Array.isArray(activationsRaw) ? activationsRaw : [];
  const [tick, setTick] = useState(0);
  const animRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    animRef.current = setInterval(() => setTick(t => t + 1), 2000);
    return () => { if (animRef.current) clearInterval(animRef.current); };
  }, []);

  // Map triggers to categories and compute proximity scores
  const triggerMap: Record<string, any[]> = {};
  for (const t of triggers as any[]) {
    const cat = (t.category || '').toLowerCase();
    if (!triggerMap[cat]) triggerMap[cat] = [];
    triggerMap[cat].push(t);
  }

  // Place categories on rings
  const cats = SIGNAL_CATEGORIES.slice(0, 20);
  const innerCats = cats.slice(0, 6);
  const midCats = cats.slice(6, 14);
  const outerCats = cats.slice(14, 20);

  const nodes: DomainNode[] = [
    ...innerCats.map((sc, i) => {
      const p = polar(CX, CY, RINGS[0], (i / innerCats.length) * 360);
      const ts = triggerMap[sc.id.replace(/-/g, '')] || triggerMap[sc.id] || [];
      const score = ts.length ? Math.max(...ts.map(proximityScore)) : 0;
      return { id: sc.id, name: sc.name.split(' ').slice(-1)[0], x: p.x, y: p.y, score, triggerCount: ts.length };
    }),
    ...midCats.map((sc, i) => {
      const p = polar(CX, CY, RINGS[1], (i / midCats.length) * 360 + 15);
      const ts = triggerMap[sc.id.replace(/-/g, '')] || triggerMap[sc.id] || [];
      const score = ts.length ? Math.max(...ts.map(proximityScore)) : 0;
      return { id: sc.id, name: sc.name.split(' ').slice(-1)[0], x: p.x, y: p.y, score, triggerCount: ts.length };
    }),
    ...outerCats.map((sc, i) => {
      const p = polar(CX, CY, RINGS[2], (i / outerCats.length) * 360 + 30);
      const ts = triggerMap[sc.id.replace(/-/g, '')] || triggerMap[sc.id] || [];
      const score = ts.length ? Math.max(...ts.map(proximityScore)) : 0;
      return { id: sc.id, name: sc.name.split(' ').slice(-1)[0], x: p.x, y: p.y, score, triggerCount: ts.length };
    }),
  ];

  const atRiskCount = nodes.filter(n => n.score >= 80).length;
  const approachingCount = nodes.filter(n => n.score >= 55 && n.score < 80).length;
  const activeActivations = (activations as any[]).filter(a => !a.completedAt).length;

  return (
    <div className="w-full" style={{ background: NAVY, position: 'relative', overflow: 'hidden' }}>
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: `radial-gradient(circle, ${GOLD} 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />

      <div className="relative flex items-stretch">
        {/* SVG Pulse Map */}
        <div className="flex-shrink-0">
          <svg width={640} height={380} viewBox={`0 0 640 380`} style={{ display: 'block' }}>
            {/* Ring backgrounds */}
            {RINGS.map((r, i) => (
              <circle key={r} cx={CX} cy={CY} r={r} fill="none"
                stroke="rgba(255,255,255,0.06)" strokeWidth={1.5} strokeDasharray="4 4" />
            ))}

            {/* Center core */}
            <circle cx={CX} cy={CY} r={30} fill={NAVY} stroke={GOLD} strokeWidth={1.5} opacity={0.9} />
            <circle cx={CX} cy={CY} r={18} fill={GOLD} opacity={0.15 + (tick % 3) * 0.05}>
              <animate attributeName="r" values="18;22;18" dur="3s" repeatCount="indefinite" />
            </circle>
            <text x={CX} y={CY - 4} textAnchor="middle" fill={GOLD} fontSize="7" fontWeight="800" letterSpacing="1">
              EXECUTION
            </text>
            <text x={CX} y={CY + 7} textAnchor="middle" fill={GOLD} fontSize="7" fontWeight="800" letterSpacing="1">
              OS
            </text>

            {/* Connection lines from center to each node */}
            {nodes.map(node => {
              const col = domainColor(node.score);
              const opacity = node.score >= 55 ? 0.3 : 0.08;
              return (
                <line key={`line-${node.id}`} x1={CX} y1={CY} x2={node.x} y2={node.y}
                  stroke={col} strokeWidth={node.score >= 80 ? 1.5 : 0.8} opacity={opacity} />
              );
            })}

            {/* Domain nodes */}
            {nodes.map((node, i) => {
              const col = domainColor(node.score);
              const r = node.score >= 55 ? 16 : node.score >= 25 ? 13 : 10;
              const pulseDelay = i * 0.3;
              return (
                <g key={node.id}>
                  {/* Pulse ring for high-proximity nodes */}
                  {node.score >= 55 && (
                    <circle cx={node.x} cy={node.y} r={r + 8} fill="none" stroke={col} strokeWidth={1} opacity={0.4}>
                      <animate attributeName="r" values={`${r};${r + 14};${r}`} dur={`${2 + pulseDelay}s`} repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.4;0;0.4" dur={`${2 + pulseDelay}s`} repeatCount="indefinite" />
                    </circle>
                  )}
                  <circle cx={node.x} cy={node.y} r={r} fill={`${col}22`} stroke={col} strokeWidth={node.score >= 55 ? 1.5 : 1} />
                  {node.triggerCount > 0 && (
                    <text x={node.x} y={node.y + 1} textAnchor="middle" dominantBaseline="middle"
                      fill={col} fontSize="8" fontWeight="900">{node.triggerCount}</text>
                  )}
                  {/* Label */}
                  <text x={node.x} y={node.y + r + 10} textAnchor="middle" fill="rgba(255,255,255,0.65)"
                    fontSize="7.5" fontWeight={node.score >= 55 ? '700' : '500'}>
                    {node.name.length > 8 ? node.name.slice(0, 8) : node.name}
                  </text>
                </g>
              );
            })}

            {/* Active activations indicator */}
            {activeActivations > 0 && (
              <g>
                <circle cx={CX} cy={CY} r={50} fill="none" stroke={TEAL} strokeWidth={1} opacity={0.4} strokeDasharray="6 3">
                  <animateTransform attributeName="transform" type="rotate" values={`0 ${CX} ${CY};360 ${CX} ${CY}`} dur="20s" repeatCount="indefinite" />
                </circle>
              </g>
            )}
          </svg>
        </div>

        {/* Right panel — live stats */}
        <div className="flex-1 flex flex-col justify-center px-6 py-8" style={{ borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-[8px] font-black uppercase tracking-[0.4em] mb-5" style={{ color: GOLD }}>Strategic Pulse · Live</p>

          {/* Domain risk summary */}
          <div className="space-y-3 mb-6">
            {[
              { label: 'AT RISK', count: atRiskCount, color: '#EF4444', desc: 'domains proximity ≥80%' },
              { label: 'APPROACHING', count: approachingCount, color: '#F97316', desc: 'domains proximity ≥55%' },
              { label: 'ACTIVE RESPONSES', count: activeActivations, color: TEAL, desc: 'playbooks executing now' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black" style={{ color: s.color }}>{s.count}</span>
                    <span className="text-[8px] font-bold uppercase tracking-wider" style={{ color: s.color }}>{s.label}</span>
                  </div>
                  <p className="text-[9px]" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="space-y-1.5">
            <p className="text-[8px] font-bold uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>Node Size = Rule Count</p>
            {[
              { color: '#EF4444', label: 'At Risk (≥80%)' },
              { color: '#F97316', label: 'Approaching (≥55%)' },
              { color: TEAL, label: 'Monitoring (≥25%)' },
              { color: '#374151', label: 'Stable / No Rules' },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: l.color }} />
                <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.5)' }}>{l.label}</span>
              </div>
            ))}
          </div>

          {/* IDEA label */}
          <div className="mt-6 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center gap-1.5">
              {['IDENTIFY', 'DETECT', 'EXECUTE', 'ADVANCE'].map((phase, i) => (
                <span key={phase}>
                  <span className="text-[7px] font-black uppercase tracking-wider" style={{
                    color: phase === 'EXECUTE' ? GOLD : 'rgba(255,255,255,0.25)'
                  }}>{phase}</span>
                  {i < 3 && <span className="text-[7px] mx-1" style={{ color: 'rgba(255,255,255,0.15)' }}>›</span>}
                </span>
              ))}
            </div>
            <p className="text-[8px] mt-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>IDEA Framework · Mission Control</p>
          </div>
        </div>
      </div>
    </div>
  );
}
