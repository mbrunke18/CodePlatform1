import { useEffect, useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { SIGNAL_CATEGORIES } from '@shared/intelligence-signals';

const NAVY = '#0A0F2E';
const GOLD = '#C9A84C';
const TEAL = '#2B8A6E';

// Short display labels for each domain — shown on the radar node
const DOMAIN_LABELS: Record<string, string> = {
  competitive: 'Competitive',
  market: 'Market',
  financial: 'Financial',
  regulatory: 'Regulatory',
  supplychain: 'Supply Chain',
  customer: 'Customer',
  talent: 'Talent',
  technology: 'Technology',
  media: 'Media',
  geopolitical: 'Geopolitical',
  economic: 'Economic',
  partnership: 'Partnership',
  execution: 'Execution',
  behavior: 'Behavior',
  innovation: 'Innovation',
  esg: 'ESG',
  cyber: 'Cyber',
  operational: 'Operational',
  ai_governance: 'AI Gov.',
  brand_reputation: 'Brand',
};

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
  label: string;
  fullName: string;
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
  const [, setLocation] = useLocation();
  const { data: triggersRaw } = useQuery<any[]>({ queryKey: ['/api/executive-triggers'] });
  const { data: activationsRaw } = useQuery<any[]>({ queryKey: ['/api/playbook-activations'] });
  const triggers = Array.isArray(triggersRaw) ? triggersRaw : [];
  const activations = Array.isArray(activationsRaw) ? activationsRaw : [];
  const [tick, setTick] = useState(0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
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
      return { id: sc.id, label: DOMAIN_LABELS[sc.id] || sc.name.split(' ')[0], fullName: sc.name, x: p.x, y: p.y, score, triggerCount: ts.length };
    }),
    ...midCats.map((sc, i) => {
      const p = polar(CX, CY, RINGS[1], (i / midCats.length) * 360 + 15);
      const ts = triggerMap[sc.id.replace(/-/g, '')] || triggerMap[sc.id] || [];
      const score = ts.length ? Math.max(...ts.map(proximityScore)) : 0;
      return { id: sc.id, label: DOMAIN_LABELS[sc.id] || sc.name.split(' ')[0], fullName: sc.name, x: p.x, y: p.y, score, triggerCount: ts.length };
    }),
    ...outerCats.map((sc, i) => {
      const p = polar(CX, CY, RINGS[2], (i / outerCats.length) * 360 + 30);
      const ts = triggerMap[sc.id.replace(/-/g, '')] || triggerMap[sc.id] || [];
      const score = ts.length ? Math.max(...ts.map(proximityScore)) : 0;
      return { id: sc.id, label: DOMAIN_LABELS[sc.id] || sc.name.split(' ')[0], fullName: sc.name, x: p.x, y: p.y, score, triggerCount: ts.length };
    }),
  ];

  const atRiskCount = nodes.filter(n => n.score >= 80).length;
  const approachingCount = nodes.filter(n => n.score >= 55 && n.score < 80).length;
  const activeActivations = (activations as any[]).filter(a => !a.completedAt).length;

  const handleNodeClick = (node: DomainNode) => {
    setLocation(`/triggers-management?category=${encodeURIComponent(node.id)}`);
  };

  const hoveredNode = hoveredId ? nodes.find(n => n.id === hoveredId) : null;

  return (
    <div className="w-full" style={{ background: NAVY, position: 'relative', overflow: 'hidden' }}>
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: `radial-gradient(circle, ${GOLD} 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />

      <div className="relative flex items-stretch">
        {/* SVG Pulse Map */}
        <div className="flex-shrink-0" style={{ position: 'relative' }}>
          <svg width={640} height={380} viewBox="0 0 640 380" style={{ display: 'block' }}>
            {/* Ring backgrounds */}
            {RINGS.map((r) => (
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
              const isHovered = hoveredId === node.id;
              return (
                <line key={`line-${node.id}`} x1={CX} y1={CY} x2={node.x} y2={node.y}
                  stroke={col} strokeWidth={isHovered ? 2 : (node.score >= 80 ? 1.5 : 0.8)}
                  opacity={isHovered ? 0.6 : opacity} />
              );
            })}

            {/* Domain nodes — all clickable */}
            {nodes.map((node, i) => {
              const col = domainColor(node.score);
              const r = node.score >= 55 ? 16 : node.score >= 25 ? 13 : 10;
              const pulseDelay = i * 0.3;
              const isHovered = hoveredId === node.id;
              return (
                <g key={node.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleNodeClick(node)}
                  onMouseEnter={() => setHoveredId(node.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Pulse ring for high-proximity nodes */}
                  {node.score >= 55 && (
                    <circle cx={node.x} cy={node.y} r={r + 8} fill="none" stroke={col} strokeWidth={1} opacity={0.4}>
                      <animate attributeName="r" values={`${r};${r + 14};${r}`} dur={`${2 + pulseDelay}s`} repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.4;0;0.4" dur={`${2 + pulseDelay}s`} repeatCount="indefinite" />
                    </circle>
                  )}
                  {/* Hover highlight ring */}
                  {isHovered && (
                    <circle cx={node.x} cy={node.y} r={r + 6} fill="none" stroke={GOLD} strokeWidth={1.5} opacity={0.7} />
                  )}
                  <circle cx={node.x} cy={node.y} r={r}
                    fill={isHovered ? `${col}44` : `${col}22`}
                    stroke={isHovered ? GOLD : col}
                    strokeWidth={isHovered ? 2 : (node.score >= 55 ? 1.5 : 1)} />
                  {node.triggerCount > 0 && (
                    <text x={node.x} y={node.y + 1} textAnchor="middle" dominantBaseline="middle"
                      fill={col} fontSize="8" fontWeight="900">{node.triggerCount}</text>
                  )}
                  {/* Label — uses full readable domain name */}
                  <text x={node.x} y={node.y + r + 10} textAnchor="middle"
                    fill={isHovered ? GOLD : 'rgba(255,255,255,0.65)'}
                    fontSize="7.5" fontWeight={node.score >= 55 || isHovered ? '700' : '500'}>
                    {node.label}
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

          {/* Hover tooltip — positioned below the SVG */}
          {hoveredNode && (
            <div style={{
              position: 'absolute',
              bottom: 8,
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(10,15,46,0.95)',
              border: `1px solid ${GOLD}`,
              padding: '6px 14px',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
              zIndex: 10,
            }}>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', color: GOLD, textTransform: 'uppercase' }}>
                {hoveredNode.fullName}
              </span>
              <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', marginLeft: 8 }}>
                {hoveredNode.triggerCount} trigger{hoveredNode.triggerCount !== 1 ? 's' : ''} · click to view
              </span>
            </div>
          )}
        </div>

        {/* Right panel — live stats */}
        <div className="flex-1 flex flex-col justify-center px-6 py-8" style={{ borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-[8px] font-black uppercase tracking-[0.4em] mb-5" style={{ color: GOLD }}>Strategic Pulse · Live</p>

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

          <div className="space-y-1.5">
            <p className="text-[8px] font-bold uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>Node Size = Trigger Count · Click Any Domain</p>
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
