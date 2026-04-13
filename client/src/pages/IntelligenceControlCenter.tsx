import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import PageLayout from '@/components/layout/PageLayout';
import { updatePageMetadata } from '@/lib/seo';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useQuery } from '@tanstack/react-query';
import {
  Radio, Brain, Activity, Zap, Target, Layers, AlertCircle,
  TrendingUp, Bell, ArrowRight, Eye, Shield, BarChart3, Clock,
  CheckCircle, AlertTriangle, Globe, Cpu, Database, Lock,
  Wifi, WifiOff, RefreshCw, ChevronRight
} from 'lucide-react';

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const OFF = "#F8F7F4";
const BORDER = "#E8E4DC";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

const SIGNAL_CATEGORIES = [
  { name: 'Financial Markets', health: 98, signals: 28, trend: 'stable', last: '2 min ago', icon: BarChart3, color: TEAL },
  { name: 'Competitive Intelligence', health: 94, signals: 31, trend: 'up', last: '5 min ago', icon: Target, color: GOLD },
  { name: 'Regulatory & Policy', health: 91, signals: 24, trend: 'stable', last: '8 min ago', icon: Shield, color: TEAL },
  { name: 'Supply Chain', health: 87, signals: 19, trend: 'down', last: '3 min ago', icon: Globe, color: '#dc2626' },
  { name: 'Talent & Workforce', health: 96, signals: 22, trend: 'stable', last: '11 min ago', icon: Activity, color: TEAL },
  { name: 'Technology Risk', health: 99, signals: 33, trend: 'up', last: '1 min ago', icon: Cpu, color: TEAL },
  { name: 'Brand & Reputation', health: 93, signals: 17, trend: 'stable', last: '6 min ago', icon: Eye, color: GOLD },
  { name: 'Macroeconomic', health: 89, signals: 21, trend: 'down', last: '4 min ago', icon: TrendingUp, color: GOLD },
  { name: 'ESG & Sustainability', health: 97, signals: 14, trend: 'up', last: '9 min ago', icon: Globe, color: TEAL },
  { name: 'Cyber & Threat Intel', health: 100, signals: 18, trend: 'stable', last: '30 sec ago', icon: Lock, color: TEAL },
  { name: 'M&A Activity', health: 85, signals: 12, trend: 'up', last: '7 min ago', icon: Layers, color: GOLD },
  { name: 'Customer Sentiment', health: 92, signals: 26, trend: 'stable', last: '3 min ago', icon: Brain, color: TEAL },
  { name: 'Partner Ecosystem', health: 88, signals: 9, trend: 'down', last: '12 min ago', icon: Database, color: GOLD },
  { name: 'Geopolitical Risk', health: 79, signals: 15, trend: 'down', last: '2 min ago', icon: Globe, color: '#dc2626' },
  { name: 'Innovation Signals', health: 95, signals: 11, trend: 'up', last: '8 min ago', icon: Zap, color: TEAL },
  { name: 'Operational Risk', health: 91, signals: 23, trend: 'stable', last: '5 min ago', icon: AlertCircle, color: GOLD },
];

const RECENT_DETECTIONS = [
  { time: '2 min ago', category: 'Supply Chain', signal: 'Tier-2 component supplier flagged for financial distress — Q3 delivery risk elevated', severity: 'critical', confidence: 91, playbook: 'Supply Chain Disruption Response' },
  { time: '8 min ago', category: 'Competitive', signal: 'Competitor hiring surge detected in APAC — market entry signals identified', severity: 'high', confidence: 84, playbook: 'Competitive Market Defense' },
  { time: '14 min ago', category: 'Regulatory', signal: 'EU AI Act enforcement guidance released — compliance review required within 90 days', severity: 'high', confidence: 97, playbook: 'Regulatory Compliance Sprint' },
  { time: '21 min ago', category: 'Technology', signal: 'Zero-day vulnerability disclosed for widely-used enterprise library — patch advisory issued', severity: 'critical', confidence: 99, playbook: 'Cyber Incident Response' },
  { time: '35 min ago', category: 'Geopolitical', signal: 'Trade corridor disruption signal — shipping lanes showing delay pattern', severity: 'medium', confidence: 72, playbook: 'Supply Chain Disruption Response' },
];

const PREDICTIVE_ALERTS = [
  { window: '72 hours', category: 'Financial', prediction: 'Earnings season volatility window opens — market sensitivity elevated for all public-facing metrics', probability: 83, impact: 'high' },
  { window: '14 days', category: 'Regulatory', prediction: 'Data privacy regulation effective date approaching — 3 jurisdictions require action', probability: 96, impact: 'critical' },
  { window: '30 days', category: 'Competitive', prediction: 'Competitor product launch anticipated based on job posting patterns and partner signals', probability: 68, impact: 'high' },
  { window: '90 days', category: 'Supply Chain', prediction: 'Seasonal demand spike will stress current supplier capacity by an estimated 40%', probability: 77, impact: 'medium' },
];

const PATTERN_CORRELATIONS = [
  { name: 'Supply + Geopolitical Compound', strength: 89, triggers: 4, risk: 'high', desc: 'Supply chain stress + geopolitical signal = elevated disruption probability' },
  { name: 'Talent + Competitive Erosion', strength: 74, triggers: 3, risk: 'medium', desc: 'Hiring signals from competitors correlating with attrition uptick in engineering' },
  { name: 'Regulatory + Operational Cascade', strength: 81, triggers: 5, risk: 'high', desc: 'New regulation aligning with system audit gaps — dual exposure window detected' },
];

export default function IntelligenceControlCenter() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [tab, setTab] = useState<'signals' | 'patterns' | 'predictive'>('signals');

  useEffect(() => {
    updatePageMetadata({
      title: "Intelligence Control Center - VaughnMartin Readiness OS",
      description: "Monitor 248+ data points across 9 strategic domains. Pattern-based detection, trigger management, and strategic intelligence.",
      ogTitle: "Intelligence Control Center",
      ogDescription: "Real-time strategic intelligence with Pattern-based detection and 12-minute response coordination.",
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
      id: 'ai-hub', title: 'Intelligence Hub',
      description: '5 intelligence modules for strategic decision-making',
      path: '/ai', icon: Brain, accentColor: GOLD, badge: '5 MODULES',
      stat: '5 Co-Pilots', statSub: 'active & monitoring',
      features: ['Pulse Intelligence', 'Flux Adaptations', 'Prism Insights', 'Echo Analytics', 'Nova Innovations'],
      anim: 'icc-tile-1',
    },
    {
      id: 'signal-hub', title: 'Signal Intelligence',
      description: 'Configure triggers and monitor data points',
      path: '/signal-intelligence', icon: Radio, accentColor: TEAL, badge: '248+ DATA POINTS',
      stat: '248+ Points', statSub: '9 strategic domains',
      features: ['9 Strategic Domains', '248+ Data Points', 'Custom Triggers', 'Alert Management'],
      anim: 'icc-tile-2',
    },
    {
      id: 'foresight-radar', title: 'Foresight Radar',
      description: 'Visual intelligence scanning and pattern detection',
      path: '/foresight-radar', icon: Eye, accentColor: GOLD, badge: 'REAL-TIME',
      stat: 'Live Scan', statSub: 'pattern detection',
      features: ['Radar Visualization', 'Trend Detection', 'Early Warning System'],
      anim: 'icc-tile-3',
    },
    {
      id: 'triggers', title: 'Trigger Management',
      description: 'Create and manage automated triggers',
      path: '/triggers-management', icon: Bell, accentColor: TEAL, badge: 'CONFIGURE',
      stat: '221 Triggers', statSub: 'across all scenarios',
      features: ['Trigger Templates', 'Condition Builder', 'Playbook Mapping'],
      anim: 'icc-tile-4',
    },
  ];

  const quickActions = [
    { id: 'ai', label: 'Launch AI Co-Pilots', sub: 'Strategic decision support', path: '/ai', icon: Brain, accent: NAVY },
    { id: 'signals', label: 'Configure Signals', sub: 'Manage data sources', path: '/signal-intelligence', icon: Radio, accent: TEAL },
    { id: 'triggers', label: 'Set Up Triggers', sub: 'Automate responses', path: '/triggers-management', icon: Bell, accent: GOLD },
  ];

  const overallHealth = Math.round(SIGNAL_CATEGORIES.reduce((s, c) => s + c.health, 0) / SIGNAL_CATEGORIES.length);

  return (
    <PageLayout>

      {/* ─── Dark Hub Header ──────────────────────────────────────── */}
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
              <span style={{ width: 6, height: 6, background: '#3BAF8A', borderRadius: 0, display: 'inline-block', animation: 'pulse 2s infinite' }} />
              All Systems Online
            </div>
          </div>

          {/* Quick Stats Strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, marginBottom: 24, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.07)' }} data-testid="grid-quick-stats">
            {[
              { label: 'Data Points Monitored', value: '248+', icon: Activity, color: GOLD, id: 'data-points' },
              { label: 'Signal Categories', value: '16', icon: Layers, color: TEAL, id: 'signal-categories' },
              { label: 'Weak Signals', value: String(dynamicStatus?.weakSignalsDetected ?? 3), icon: AlertCircle, color: GOLD, id: 'weak-signals' },
              { label: 'Active Patterns', value: String(dynamicStatus?.oraclePatternsActive ?? 3), icon: TrendingUp, color: TEAL, id: 'active-patterns' },
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

      {/* ─── White Body Section ───────────────────────────────────────── */}
      <div style={{ background: OFF, minHeight: 'calc(100vh - 400px)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px' }}>

          {/* Tab Nav */}
          <div style={{ display: 'flex', gap: 1, borderBottom: `1px solid ${BORDER}`, marginBottom: 32 }}>
            {[
              { id: 'signals', label: 'Signal Health Dashboard', icon: Wifi },
              { id: 'patterns', label: 'Pattern Intelligence', icon: Layers },
              { id: 'predictive', label: 'Predictive Alerts', icon: Brain },
            ].map(t => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button key={t.id} onClick={() => setTab(t.id as any)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    padding: '10px 20px', border: 'none',
                    borderBottom: `2px solid ${active ? GOLD : 'transparent'}`,
                    background: 'none', cursor: 'pointer',
                    fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: active ? NAVY : '#9CA3AF',
                    transition: 'all 0.15s',
                    marginBottom: -1,
                  }}>
                  <Icon style={{ width: 14, height: 14 }} />
                  {t.label}
                </button>
              );
            })}
            <div style={{ flex: 1 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 4px' }}>
              <div style={{ width: 7, height: 7, borderRadius: 0, background: TEAL, animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: TEAL, letterSpacing: '0.1em' }}>LIVE · Last sweep 2 min ago</span>
            </div>
          </div>

          {/* ─ SIGNAL HEALTH TAB ─ */}
          {tab === 'signals' && (
            <div>
              {/* Overall health bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, padding: '16px 20px', background: '#fff', border: `1px solid ${BORDER}` }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 4 }}>Overall Signal Network Health</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ ...CG, fontSize: 36, fontWeight: 700, color: overallHealth >= 90 ? TEAL : GOLD, lineHeight: 1 }}>{overallHealth}%</div>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <Progress value={overallHealth} className="h-2" />
                      <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 4 }}>16 of 16 categories operational</div>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 16, textAlign: 'center' }}>
                  <div>
                    <div style={{ ...CG, fontSize: 22, fontWeight: 700, color: TEAL }}>14</div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Healthy</div>
                  </div>
                  <div>
                    <div style={{ ...CG, fontSize: 22, fontWeight: 700, color: GOLD }}>2</div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Degraded</div>
                  </div>
                  <div>
                    <div style={{ ...CG, fontSize: 22, fontWeight: 700, color: NAVY }}>248+</div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Data Points</div>
                  </div>
                </div>
              </div>

              {/* Signal category grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 32 }}>
                {SIGNAL_CATEGORIES.map(cat => {
                  const Icon = cat.icon;
                  const isHealthy = cat.health >= 90;
                  const isDegraded = cat.health < 85;
                  const healthColor = isDegraded ? '#dc2626' : isHealthy ? TEAL : GOLD;
                  return (
                    <div key={cat.name} style={{ background: '#fff', border: `1px solid ${BORDER}`, borderTop: `3px solid ${healthColor}`, padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                        <Icon style={{ width: 16, height: 16, color: healthColor, flexShrink: 0 }} />
                        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: healthColor, background: `${healthColor}12`, padding: '2px 7px' }}>
                          {cat.health}%
                        </span>
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: NAVY, marginBottom: 4, lineHeight: 1.3 }}>{cat.name}</div>
                      <Progress value={cat.health} className="h-1 mb-2" />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#9CA3AF' }}>
                        <span>{cat.signals} signals</span>
                        <span>{cat.last}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Recent Detections */}
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 14 }}>Recent Signal Detections</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {RECENT_DETECTIONS.map((det, i) => {
                    const sc = det.severity === 'critical' ? '#dc2626' : det.severity === 'high' ? GOLD : '#6B7280';
                    return (
                      <div key={i} style={{ background: '#fff', border: `1px solid ${BORDER}`, borderLeft: `4px solid ${sc}`, padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                        <div style={{ flexShrink: 0, marginTop: 2 }}>
                          {det.severity === 'critical' ? <AlertTriangle style={{ width: 16, height: 16, color: '#dc2626' }} /> : <AlertCircle style={{ width: 16, height: 16, color: GOLD }} />}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <span style={{ fontSize: 10, fontWeight: 700, color: sc, textTransform: 'uppercase', letterSpacing: '0.12em' }}>{det.severity}</span>
                            <span style={{ fontSize: 10, color: '#9CA3AF' }}>·</span>
                            <span style={{ fontSize: 10, color: '#9CA3AF' }}>{det.category}</span>
                            <span style={{ fontSize: 10, color: '#9CA3AF' }}>·</span>
                            <span style={{ fontSize: 10, color: '#9CA3AF' }}>{det.time}</span>
                          </div>
                          <div style={{ fontSize: 13, color: NAVY, lineHeight: 1.5, marginBottom: 6 }}>{det.signal}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{ fontSize: 10, color: TEAL, fontWeight: 700 }}>→ {det.playbook}</span>
                            <span style={{ fontSize: 10, color: '#9CA3AF' }}>AI Confidence: {det.confidence}%</span>
                          </div>
                        </div>
                        <Button size="sm" style={{ flexShrink: 0, background: NAVY, color: '#fff', borderRadius: 0, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                          Activate
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ─ PATTERN INTELLIGENCE TAB ─ */}
          {tab === 'patterns' && (
            <div>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 6 }}>Active Pattern Correlations</div>
                <div style={{ fontSize: 13, color: '#6B7280', maxWidth: 680, lineHeight: 1.6 }}>
                  AI cross-references signals from multiple categories to detect compound threats. Single-domain signals often precede multi-domain events. Pattern recognition gives you a head start before a crisis compounds.
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
                {PATTERN_CORRELATIONS.map((pat, i) => {
                  const riskColor = pat.risk === 'high' ? '#dc2626' : GOLD;
                  return (
                    <div key={i} style={{ background: '#fff', border: `1px solid ${BORDER}`, borderLeft: `4px solid ${riskColor}`, padding: '20px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                            <div style={{ ...CG, fontSize: 17, fontWeight: 700, color: NAVY }}>{pat.name}</div>
                            <span style={{ fontSize: 10, fontWeight: 700, color: riskColor, background: `${riskColor}12`, padding: '2px 8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{pat.risk} risk</span>
                          </div>
                          <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 12 }}>{pat.desc}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                            <div>
                              <div style={{ fontSize: 10, color: '#9CA3AF', marginBottom: 2 }}>Pattern Strength</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Progress value={pat.strength} className="w-24 h-1.5" />
                                <span style={{ fontSize: 12, fontWeight: 700, color: NAVY }}>{pat.strength}%</span>
                              </div>
                            </div>
                            <div>
                              <div style={{ fontSize: 10, color: '#9CA3AF', marginBottom: 2 }}>Contributing Signals</div>
                              <div style={{ fontSize: 12, fontWeight: 700, color: NAVY }}>{pat.triggers} active</div>
                            </div>
                          </div>
                        </div>
                        <Link href="/playbook-library">
                          <Button style={{ background: NAVY, color: '#fff', borderRadius: 0, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', flexShrink: 0 }}>
                            View Playbooks <ArrowRight style={{ width: 14, height: 14, marginLeft: 6 }} />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pattern explanation */}
              <div style={{ background: NAVY, padding: '28px 32px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(201,168,76,0.08) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <Brain style={{ width: 18, height: 18, color: GOLD }} />
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD }}>How Pattern Intelligence Works</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
                    {[
                      { title: 'Signal Correlation', desc: 'AI cross-references signals across all 16 categories every 15 minutes looking for co-occurrence patterns.' },
                      { title: 'Historical Matching', desc: 'Pattern signatures are matched against your organization\'s and industry peer historical events to estimate probability.' },
                      { title: 'Compound Detection', desc: 'When 3+ correlated signals fire within a 72-hour window, a compound pattern alert is generated and scored.' },
                    ].map((item, idx) => (
                      <div key={idx}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: GOLD, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{item.title}</div>
                        <div style={{ fontSize: 12, color: 'rgba(240,237,228,0.6)', lineHeight: 1.6 }}>{item.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─ PREDICTIVE ALERTS TAB ─ */}
          {tab === 'predictive' && (
            <div>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 6 }}>Forward-Looking Intelligence</div>
                <div style={{ fontSize: 13, color: '#6B7280', maxWidth: 680, lineHeight: 1.6 }}>
                  AI surfaces events before they fire — based on signal velocity, external data patterns, and historical enterprise cycles. Predictive alerts give you a mobilization window before execution pressure begins.
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }}>
                {PREDICTIVE_ALERTS.map((alert, i) => {
                  const probColor = alert.probability >= 90 ? '#dc2626' : alert.probability >= 75 ? GOLD : TEAL;
                  const impColor = alert.impact === 'critical' ? '#dc2626' : alert.impact === 'high' ? GOLD : TEAL;
                  return (
                    <div key={i} style={{ background: '#fff', border: `1px solid ${BORDER}`, padding: '20px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
                        <div style={{ flexShrink: 0, width: 80, textAlign: 'center', padding: '10px 0', borderRight: `1px solid ${BORDER}` }}>
                          <div style={{ ...CG, fontSize: 28, fontWeight: 700, color: probColor, lineHeight: 1 }}>{alert.probability}%</div>
                          <div style={{ fontSize: 9, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 4 }}>probability</div>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                            <span style={{ fontSize: 10, fontWeight: 700, color: NAVY, background: `${NAVY}10`, padding: '2px 8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Within {alert.window}</span>
                            <span style={{ fontSize: 10, fontWeight: 700, color: impColor, background: `${impColor}12`, padding: '2px 8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{alert.impact} impact</span>
                            <span style={{ fontSize: 10, color: '#9CA3AF' }}>{alert.category}</span>
                          </div>
                          <div style={{ fontSize: 13, color: NAVY, lineHeight: 1.6, fontWeight: 500 }}>{alert.prediction}</div>
                        </div>
                        <Button size="sm" style={{ background: 'transparent', color: NAVY, border: `1px solid ${BORDER}`, borderRadius: 0, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', flexShrink: 0 }}>
                          Pre-Stage Response
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Prediction accuracy stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {[
                  { value: '79%', label: 'Prediction Accuracy', sub: 'Validated against past events', color: TEAL },
                  { value: '14 days', label: 'Average Lead Time', sub: 'Before event materializes', color: NAVY },
                  { value: '3.2×', label: 'Mobilization Advantage', sub: 'vs reactive organizations', color: GOLD },
                ].map((stat, i) => (
                  <div key={i} style={{ background: '#fff', border: `1px solid ${BORDER}`, padding: '20px 24px', textAlign: 'center' }}>
                    <div style={{ ...CG, fontSize: 36, fontWeight: 700, color: stat.color, lineHeight: 1, marginBottom: 6 }}>{stat.value}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: NAVY, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4 }}>{stat.label}</div>
                    <div style={{ fontSize: 11, color: '#9CA3AF' }}>{stat.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

    </PageLayout>
  );
}
