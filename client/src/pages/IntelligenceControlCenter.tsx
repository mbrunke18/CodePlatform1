import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import StandardNav from '@/components/layout/StandardNav';
import Footer from '@/components/layout/Footer';
import { updatePageMetadata } from '@/lib/seo';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useQuery } from '@tanstack/react-query';
import {
  Radio,
  Brain,
  Activity,
  Zap,
  Target,
  Layers,
  AlertCircle,
  TrendingUp,
  Bell,
  ArrowRight,
  Eye
} from 'lucide-react';

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

export default function IntelligenceControlCenter() {
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    updatePageMetadata({
      title: "Intelligence Control Center - Execution OS Strategic Execution OS",
      description: "Monitor 248+ data points across 20 signal categories. AI-powered pattern detection, trigger management, and strategic intelligence.",
      ogTitle: "Intelligence Control Center",
      ogDescription: "Real-time strategic intelligence with AI-powered pattern detection and 12-minute response coordination.",
    });
  }, []);

  const { data: dynamicStatus } = useQuery<{
    readinessScore: number;
    activeScenarios: number;
    weakSignalsDetected: number;
    oraclePatternsActive: number;
  }>({
    queryKey: ['/api/dynamic-strategy/status'],
  });

  const intelligenceModules = [
    {
      id: 'ai-hub',
      title: 'AI Intelligence Hub',
      description: '5 AI co-pilots for strategic decision-making',
      path: '/ai',
      icon: Brain,
      accentColor: GOLD,
      badge: '5 MODULES',
      stat: '5 Co-Pilots',
      statSub: 'active & monitoring',
      features: ['Pulse Intelligence', 'Flux Adaptations', 'Prism Insights', 'Echo Analytics', 'Nova Innovations'],
      anim: 'icc-tile-1',
    },
    {
      id: 'signal-hub',
      title: 'Signal Intelligence',
      description: 'Configure triggers and monitor data points',
      path: '/signal-intelligence',
      icon: Radio,
      accentColor: TEAL,
      badge: '248+ DATA POINTS',
      stat: '248+ Points',
      statSub: '16 signal categories',
      features: ['16 Signal Categories', '248+ Data Points', 'Custom Triggers', 'Alert Management'],
      anim: 'icc-tile-2',
    },
    {
      id: 'foresight-radar',
      title: 'Foresight Radar',
      description: 'Visual intelligence scanning and pattern detection',
      path: '/foresight-radar',
      icon: Eye,
      accentColor: GOLD,
      badge: 'REAL-TIME',
      stat: 'Live Scan',
      statSub: 'pattern detection',
      features: ['Radar Visualization', 'Trend Detection', 'Early Warning System'],
      anim: 'icc-tile-3',
    },
    {
      id: 'triggers',
      title: 'Trigger Management',
      description: 'Create and manage automated triggers',
      path: '/triggers-management',
      icon: Bell,
      accentColor: TEAL,
      badge: 'CONFIGURE',
      stat: '221 Triggers',
      statSub: 'across all scenarios',
      features: ['Trigger Templates', 'Condition Builder', 'Playbook Mapping'],
      anim: 'icc-tile-4',
    },
  ];

  const quickActions = [
    { id: 'ai', label: 'Launch AI Co-Pilots', sub: 'Strategic decision support', path: '/ai', icon: Brain, accent: NAVY },
    { id: 'signals', label: 'Configure Signals', sub: 'Manage data sources', path: '/signal-intelligence', icon: Radio, accent: TEAL },
    { id: 'triggers', label: 'Set Up Triggers', sub: 'Automate responses', path: '/triggers-management', icon: Bell, accent: GOLD },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#F8F7F4' }} data-testid="intelligence-control-center">
      <StandardNav />

      {/* ─── Dark Tile Hub Header ──────────────────────────────────────── */}
      <div style={{ background: NAVY, padding: '36px 0 0' }}>
        <style>{`
          @keyframes icc-fadeup { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
          .icc-tile-1{animation:icc-fadeup 0.4s ease 0.05s both}
          .icc-tile-2{animation:icc-fadeup 0.4s ease 0.12s both}
          .icc-tile-3{animation:icc-fadeup 0.4s ease 0.19s both}
          .icc-tile-4{animation:icc-fadeup 0.4s ease 0.26s both}
          .icc-qa-1{animation:icc-fadeup 0.4s ease 0.3s both}
          .icc-qa-2{animation:icc-fadeup 0.4s ease 0.36s both}
          .icc-qa-3{animation:icc-fadeup 0.4s ease 0.42s both}
        `}</style>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          {/* Header label */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, background: 'rgba(201,168,76,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Radio style={{ width: 18, height: 18, color: GOLD }} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2 }}>
                  <div style={{ width: 20, height: 1.5, background: GOLD }} />
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD }}>Strategic Intelligence</span>
                </div>
                <div style={{ ...CG, fontSize: 22, fontWeight: 600, color: '#F0EDE4', lineHeight: 1 }}>Intelligence Control Center</div>
              </div>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(43,138,110,0.12)', color: '#3BAF8A', fontSize: 10, fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', padding: '4px 12px', border: '1px solid rgba(43,138,110,0.3)' }}>
              <span style={{ width: 6, height: 6, background: '#3BAF8A', borderRadius: '50%', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              All Systems Online
            </div>
          </div>

          {/* Quick Stats Strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, marginBottom: 24, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.07)' }} data-testid="grid-quick-stats">
            {[
              { label: 'Data Points Monitored', value: '248+', icon: Activity, color: GOLD, id: 'data-points' },
              { label: 'Signal Categories', value: '16', icon: Layers, color: TEAL, id: 'signal-categories' },
              { label: 'Weak Signals', value: String(dynamicStatus?.weakSignalsDetected ?? 0), icon: AlertCircle, color: GOLD, id: 'weak-signals' },
              { label: 'Active Patterns', value: String(dynamicStatus?.oraclePatternsActive ?? 0), icon: TrendingUp, color: TEAL, id: 'active-patterns' },
            ].map(stat => (
              <div key={stat.id} style={{ padding: '14px 18px', background: 'rgba(255,255,255,0.03)' }} data-testid={`stat-${stat.id}`}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 10, color: 'rgba(240,237,228,0.4)', marginBottom: 4 }}>{stat.label}</div>
                    <div style={{ ...CG, fontSize: 26, fontWeight: 700, color: stat.color, lineHeight: 1 }} data-testid={`value-${stat.id}`}>{stat.value}</div>
                  </div>
                  <stat.icon style={{ width: 18, height: 18, color: stat.color, opacity: 0.6 }} />
                </div>
              </div>
            ))}
          </div>

          {/* Intelligence Module Tiles */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(240,237,228,0.45)', marginBottom: 14 }}>Intelligence Modules</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }} data-testid="grid-modules">
              {intelligenceModules.map(mod => {
                const isHov = hovered === mod.id;
                const Icon = mod.icon;
                return (
                  <Link key={mod.id} href={mod.path} data-testid={`link-module-${mod.id}`}>
                    <div
                      className={mod.anim}
                      onMouseEnter={() => setHovered(mod.id)}
                      onMouseLeave={() => setHovered(null)}
                      style={{
                        background: isHov ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.025)',
                        borderTop: `1px solid ${isHov ? mod.accentColor : 'rgba(255,255,255,0.08)'}`,
                        borderLeft: `1px solid ${isHov ? mod.accentColor : 'rgba(255,255,255,0.08)'}`,
                        borderRight: `1px solid ${isHov ? mod.accentColor : 'rgba(255,255,255,0.08)'}`,
                        borderBottom: `3px solid ${isHov ? mod.accentColor : 'rgba(255,255,255,0.06)'}`,
                        padding: '18px 18px 14px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        height: '100%',
                      }}
                      data-testid={`card-module-${mod.id}`}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                        <div style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon style={{ width: 18, height: 18, color: mod.accentColor }} />
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: mod.accentColor, border: `1px solid ${mod.accentColor}40`, padding: '2px 7px' }}>{mod.badge}</span>
                      </div>
                      <div style={{ ...CG, fontSize: 17, fontWeight: 600, color: '#F0EDE4', marginBottom: 4, lineHeight: 1.1 }}>{mod.title}</div>
                      <div style={{ fontSize: 11, color: 'rgba(240,237,228,0.45)', marginBottom: 12, lineHeight: 1.4 }}>{mod.description}</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
                        {mod.features.slice(0, 3).map(f => (
                          <span key={f} style={{ fontSize: 10, color: 'rgba(240,237,228,0.5)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', padding: '2px 7px' }}>{f}</span>
                        ))}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ ...CG, fontSize: 16, fontWeight: 700, color: mod.accentColor, lineHeight: 1 }}>{mod.stat}</div>
                          <div style={{ fontSize: 10, color: 'rgba(240,237,228,0.4)', marginTop: 2 }}>{mod.statSub}</div>
                        </div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: isHov ? mod.accentColor : 'rgba(240,237,228,0.3)', transition: 'color 0.2s' }}>ENTER →</div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Quick Action Tiles */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 1 }} data-testid="section-quick-actions">
            {quickActions.map((qa, i) => {
              const isHov = hovered === `qa-${qa.id}`;
              const Icon = qa.icon;
              return (
                <Link key={qa.id} href={qa.path} data-testid={`link-${qa.id}`}>
                  <div
                    className={`icc-qa-${i + 1}`}
                    onMouseEnter={() => setHovered(`qa-${qa.id}`)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '16px 20px',
                      background: isHov ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                      borderLeft: `3px solid ${isHov ? qa.accent : 'transparent'}`,
                    }}
                    data-testid={`card-${qa.id}`}
                  >
                    <div style={{ width: 34, height: 34, background: isHov ? qa.accent : 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.2s' }}>
                      <Icon style={{ width: 16, height: 16, color: isHov ? NAVY : qa.accent }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#F0EDE4' }}>{qa.label}</div>
                      <div style={{ fontSize: 10, color: 'rgba(240,237,228,0.4)' }}>{qa.sub}</div>
                    </div>
                    <ArrowRight style={{ width: 14, height: 14, color: isHov ? qa.accent : 'rgba(240,237,228,0.2)', transition: 'color 0.2s' }} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
