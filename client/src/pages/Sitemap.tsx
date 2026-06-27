import { useState } from 'react';
import { useLocation } from 'wouter';
import PageLayout from '@/components/layout/PageLayout';
import {
  Compass, Radio, Layers, Brain, BookOpen, Target, Lightbulb, ClipboardCheck,
  Radar, Eye, AlertCircle, Zap, Globe, LayoutGrid, MessageSquare, DollarSign,
  BarChart3, Users, TrendingUp, ClipboardList, Shield, Calendar, Rocket,
  Play, Scale, FileText, Calculator, Settings, Building, ChevronRight,
  Activity, FlaskConical, Video, Search, Map
} from 'lucide-react';

const NAVY = '#0A0F2E';
const GOLD = '#C9A84C';
const TEAL = '#2B8A6E';
const IVORY = '#F0EDE4';

type Entry = { name: string; path: string; desc?: string; tag?: string; icon: any };
type Section = { title: string; color: string; icon: any; entries: Entry[] };

const SECTIONS: Section[] = [
  {
    title: 'Start Here',
    color: GOLD,
    icon: Rocket,
    entries: [
      { name: 'Homepage', path: '/', desc: 'The Readiness OS overview and thesis', icon: Compass },
      { name: 'Interactive Onboarding', path: '/onboard', desc: 'Pick your role — get a personalised first path', tag: 'NEW', icon: Rocket },
      { name: 'Go-Live Checklist', path: '/getting-started', desc: 'Track all 4 setup phases with a live completion score', icon: ClipboardList },
      { name: 'Onboarding Guide', path: '/onboarding-guide', desc: 'Step-by-step guide for Founding Partner customers', icon: BookOpen },
      { name: 'New User Journey', path: '/new-user-journey', desc: '8-step guided configuration wizard', icon: Target },
      { name: 'Welcome Brief', path: '/welcome-brief', desc: 'Live stats and first-run orientation', icon: FileText },
    ],
  },
  {
    title: 'Experience It — Demos',
    color: TEAL,
    icon: Play,
    entries: [
      { name: '12-Minute Test Drive', path: '/12-minute-experience', desc: 'Trigger to execution in real time — no login needed', tag: 'POPULAR', icon: Rocket },
      { name: 'Full Scenario Experience Center', path: '/demo-hub', desc: '12 complete simulations across all 3 strategic domains', icon: LayoutGrid },
      { name: 'Master Demo — Activist Investor', path: '/master-demo', desc: 'Elliott Management files 13D. 7-phase CEO walkthrough.', icon: Play },
      { name: 'How It Executes', path: '/how-it-executes', desc: 'Animated signal → protocol → 12-minute chain', tag: 'NEW', icon: Zap },
      { name: 'Protocol Builder', path: '/protocol-builder', desc: 'Pre-stage your own Readiness Protocol in 6 steps', icon: ClipboardCheck },
      { name: 'Competitor Displacement Sprint', path: '/demo/market-entry', desc: 'Protocol #31 — LegacyPoint Ch.11, 1,400 accounts in play', icon: TrendingUp },
      { name: 'M&A Rapid Response', path: '/demo/acquisition', desc: 'Protocol #58 — LOI required in 48 hours', icon: Target },
      { name: 'Financial Ransomware', path: '/demo/ransomware', desc: 'SWIFT offline. Trading systems encrypted. Market open in 4 hrs.', icon: Zap },
      { name: 'FDA Recall Response', path: '/demo/pharma', desc: 'Class I recall — 340,000 units in distribution', icon: AlertCircle },
      { name: 'Supply Chain Collapse', path: '/demo/supply-chain', desc: 'Primary supplier files Ch.11 — 60% of Q3 production at risk', icon: Globe },
      { name: 'Energy Grid Failure', path: '/demo/energy', desc: 'Regional grid offline — 18-hour restoration window', icon: Zap },
      { name: 'Retail Food Safety Crisis', path: '/demo/food-safety', desc: 'Multi-state contamination — 847 SKUs across 3,200 locations', icon: AlertCircle },
      { name: 'Technology Data Breach', path: '/demo/data-breach', desc: '2.3M records on dark web. GDPR 72-hour clock started.', icon: Shield },
      { name: 'DOJ Investigation', path: '/demo/regulatory', desc: 'Civil investigative demand received — 14-day response window', icon: Scale },
      { name: 'GTM Acceleration Sprint', path: '/demo/product-launch', desc: 'Protocol #89 — board authorises 6-week pull-forward', icon: Rocket },
      { name: 'Workforce Transformation', path: '/demo/workforce', desc: 'Protocol #112 — 6,720 roles, 12 countries, WARN Act', icon: Users },
    ],
  },
  {
    title: 'Core Platform',
    color: NAVY,
    icon: Compass,
    entries: [
      { name: 'Mission Control', path: '/mission-control', desc: 'Your interactive operations center', icon: Compass },
      { name: 'Command Tower', path: '/command-tower', desc: 'Executive wall display — live trigger and signal feed', icon: Radio },
      { name: 'Execution Workspace', path: '/workspace', desc: 'All 4 IDEA phases in one surface', icon: Layers },
      { name: 'Intelligence Hub', path: '/intelligence-hub', desc: 'Signal radar, monitoring and compound synthesis', icon: Brain },
      { name: 'Strategic Monitoring', path: '/strategic-monitoring', desc: 'Active trigger monitoring with pre-staged protocols', icon: AlertCircle },
      { name: 'Live Activation Center', path: '/live-activation-center', desc: 'Activate and manage Readiness Protocols in real time', icon: Zap },
      { name: 'Concurrent Situation Board', path: '/concurrent-situations', desc: 'Command view when multiple triggers compete for bandwidth', icon: LayoutGrid },
      { name: 'Decision Velocity', path: '/decision-velocity', desc: 'Real coordination speed vs. the 12-minute benchmark', icon: TrendingUp },
      { name: 'War Room', path: '/war-room', desc: 'Collaborative activation and stakeholder coordination', icon: Globe },
      { name: 'Crisis Communications', path: '/crisis-communications', desc: '5 audience-specific messages generated in 18 seconds', icon: MessageSquare },
      { name: 'Financial Exposure Estimator', path: '/financial-exposure', desc: "CFO's first question answered the moment a trigger fires", icon: DollarSign },
      { name: 'What-If Analyzer', path: '/what-if-analyzer', desc: 'Model scenarios before they become crises', icon: Lightbulb },
    ],
  },
  {
    title: 'Identify — Readiness Protocols',
    color: GOLD,
    icon: BookOpen,
    entries: [
      { name: 'Readiness Protocol Library', path: '/playbooks', desc: '180 pre-staged protocols across 9 strategic domains', icon: BookOpen },
      { name: 'Situation Intents', path: '/identify/situation-intents', desc: 'Define what your org is monitoring — IDEA configuration start', icon: Target },
      { name: 'Triggers Management', path: '/triggers-management', desc: '231 detection thresholds — configure monitoring settings', icon: Zap },
      { name: 'Signal Configuration', path: '/signal-configuration', desc: 'Configure your 39 pre-configured signal sources and trigger detection thresholds', icon: Radio },
      { name: 'Response Customization', path: '/playbook-customization', desc: 'Tailor Readiness Protocols to your org context', icon: ClipboardCheck },
      { name: 'Strategic Planning Hub', path: '/strategic', desc: 'Long-range readiness planning and scenario mapping', icon: Target },
      { name: 'Preparedness Report', path: '/preparedness-report', desc: 'Scored readiness across all 9 strategic domains', icon: Shield },
      { name: 'Practice Drills', path: '/practice-drills', desc: 'Structured drills with post-drill debrief scoring', icon: FlaskConical },
      { name: 'Regulatory Calendar', path: '/regulatory-calendar', desc: 'Compliance deadlines mapped to pre-staged responses', icon: Calendar },
      { name: '9-Domain Coverage Board', path: '/situations-hub', desc: 'Exposure and readiness across M&A, Competitive, Regulatory & more', icon: LayoutGrid },
    ],
  },
  {
    title: 'Detect — Signal Intelligence',
    color: TEAL,
    icon: Radar,
    entries: [
      { name: 'Signal Radar Dashboard', path: '/ai-radar', desc: 'Real-time average response times vs. benchmarks', icon: Radar },
      { name: 'Foresight Radar', path: '/foresight-radar', desc: 'Emerging signal patterns before they become triggers', icon: Eye },
      { name: 'Signal Intelligence', path: '/signal-intelligence', desc: '8 live RSS feeds ingested every 15 minutes', icon: Radio },
      { name: 'Incident Analyzer', path: '/incident-analyzer', desc: 'Post-incident signal analysis and classification', icon: AlertCircle },
      { name: 'Coordination Intelligence', path: '/coordination-intelligence', desc: 'Live speed data — where your org loses minutes', icon: Activity },
    ],
  },
  {
    title: 'Analytics & Reporting',
    color: '#6366f1',
    icon: BarChart3,
    entries: [
      { name: 'Advanced Analytics', path: '/advanced-analytics', desc: 'Execution performance across all activations', icon: BarChart3 },
      { name: 'Board Readiness Snapshot', path: '/board-readiness', desc: 'Board-ready readiness report with export', icon: ClipboardList },
      { name: 'Board Briefings', path: '/board-briefings', desc: 'Executive-ready board reporting templates', icon: FileText },
      { name: 'Execution History', path: '/execution-history', desc: 'Full audit trail of every activation and debrief', icon: Activity },
      { name: 'ROI Breakdown', path: '/roi-breakdown', desc: '3-year net value, break-even, and consulting comparison', icon: Calculator },
      { name: 'Operating Model Alignment', path: '/operating-model', desc: 'Map Readiness OS to your existing operating model', icon: Layers },
      { name: 'Decision Tree Builder', path: '/decision-trees', desc: 'Pre-wire executive decision paths before triggers fire', icon: Target },
      { name: 'Stakeholder Management', path: '/stakeholder-management', desc: 'Role-mapped stakeholders for instant notification', icon: Users },
    ],
  },
  {
    title: 'The Evidence',
    color: GOLD,
    icon: Scale,
    entries: [
      { name: 'Why Readiness OS', path: '/the-proof', desc: 'The 30-day mobilization gap — and how we close it', icon: Shield },
      { name: 'Readiness Benchmark', path: '/readiness-benchmark', desc: 'Free 3-min score — where does your org stand? (22 typical vs. 87 Founding Partners)', tag: 'FREE', icon: Target },
      { name: 'Strategic Foresight Engine', path: '/readiness-oracle', desc: 'Digital Twin simulation, predictive war gaming, and the Executive Time Machine', tag: 'NEW', icon: Brain },
      { name: 'Executive Brief', path: '/executive-brief', desc: 'Board-ready one-pager — thesis, 3,600× metric, ROI case', icon: FileText },
      { name: 'Proof Story', path: '/proof-story', desc: 'Same trigger, entirely different outcome — numbers side by side', icon: Scale },
      { name: 'ROI Calculator', path: '/roi-calculator', desc: 'See the competitive window your org is leaving open', icon: Calculator },
      { name: 'Research & Validation', path: '/research', desc: 'McKinsey, Gartner, IBM, PwC — the evidence base', icon: FileText },
      { name: 'How It Works', path: '/how-it-works', desc: 'The complete trigger → 12-minute execution sequence', icon: Play },
      { name: 'Readiness Assessment', path: '/readiness-assessment', desc: 'Score your org across all 9 strategic domains', icon: ClipboardCheck },
      { name: 'Why Not Consulting', path: '/vs-consulting', desc: 'McKinsey charges $300K for PDFs. We deliver infrastructure.', icon: Scale },
      { name: 'MS Project Comparison', path: '/ms-project', desc: "Don't just migrate — eliminate the 30-day mobilization cycle", icon: Target },
      { name: 'Platform Reality', path: '/platform-reality', desc: 'Every keynote proved the problem. We shipped the solution.', icon: Zap },
      { name: 'Pricing & Plans', path: '/growth', desc: '$60K–$240K — accessible entry, full platform', icon: TrendingUp },
    ],
  },
  {
    title: 'Configuration & Setup',
    color: '#8B7355',
    icon: Settings,
    entries: [
      { name: 'Settings Hub', path: '/settings-hub', desc: 'Platform preferences, integrations, and account settings', icon: Settings },
      { name: 'Organization Setup', path: '/organization-setup', desc: 'Departments, stakeholders, and org structure', icon: Building },
      { name: 'Success Metrics', path: '/success-metrics', desc: 'Define velocity targets and decision benchmarks', icon: TrendingUp },
      { name: 'Integration Hub', path: '/integration-hub', desc: 'Microsoft, Slack, Teams, Salesforce and more', icon: Layers },
    ],
  },
  {
    title: 'Company & Investors',
    color: NAVY,
    icon: Video,
    entries: [
      { name: 'Founder\'s Story', path: '/founder-story', desc: 'The vision behind Readiness OS', icon: Video },
      { name: 'Our Story', path: '/our-story', desc: 'Origin, mission, and why this matters now', icon: FileText },
      { name: 'About', path: '/about', desc: 'VaughnMartin and the Readiness OS team', icon: Users },
      { name: 'Product Roadmap', path: '/roadmap', desc: 'Live features, in development, and what\'s next', icon: TrendingUp },
      { name: 'Investor Resources', path: '/investor-resources', desc: 'Full materials — framework, thesis, and deck', icon: FileText },
      { name: 'Investment Thesis', path: '/investors', desc: 'Market opportunity and ROI case', icon: TrendingUp },
      { name: 'Pitch Deck', path: '/pitch-deck', desc: 'Pre-seed investor presentation', icon: Layers },
      { name: 'IDEA Framework', path: '/idea-framework', icon: Layers, desc: 'Identify · Detect · Execute · Advance — the operating model' },
      { name: 'Platform Overview', path: '/platform-overview', desc: 'Every capability connected in one view', icon: Eye },
      { name: 'Pricing', path: '/pricing', desc: 'Plans and tiers', icon: Calculator },
    ],
  },
  {
    title: 'Get Access',
    color: TEAL,
    icon: Rocket,
    entries: [
      { name: 'Founding Partner Program', path: '/request-access', desc: '90-day validation partnership — apply now', tag: 'CTA', icon: Target },
      { name: 'Request Access', path: '/request-access', desc: 'Submit your application for platform access', icon: Rocket },
      { name: 'Contact', path: '/contact', desc: 'Reach the VaughnMartin team directly', icon: MessageSquare },
      { name: 'Security & Compliance', path: '/security-compliance', desc: 'Procurement-ready one-pager — auth, data governance, AI safety', icon: Shield },
    ],
  },
];

const FILTER_OPTIONS = ['All', 'Platform', 'Demos', 'Evidence', 'Company'];
const FILTER_MAP: Record<string, string[]> = {
  'Platform': ['Core Platform', 'Identify — Readiness Protocols', 'Detect — Signal Intelligence', 'Analytics & Reporting', 'Configuration & Setup'],
  'Demos': ['Experience It — Demos'],
  'Evidence': ['The Evidence'],
  'Company': ['Company & Investors', 'Get Access', 'Start Here'],
};

export default function Sitemap() {
  const [, setLocation] = useLocation();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const visible = SECTIONS.filter(s => {
    if (filter !== 'All') {
      const allowed = FILTER_MAP[filter] ?? [];
      if (!allowed.includes(s.title)) return false;
    }
    if (search) {
      const q = search.toLowerCase();
      return s.title.toLowerCase().includes(q) || s.entries.some(e => e.name.toLowerCase().includes(q) || (e.desc ?? '').toLowerCase().includes(q));
    }
    return true;
  }).map(s => {
    if (!search) return s;
    const q = search.toLowerCase();
    return {
      ...s,
      entries: s.entries.filter(e => e.name.toLowerCase().includes(q) || (e.desc ?? '').toLowerCase().includes(q) || s.title.toLowerCase().includes(q)),
    };
  }).filter(s => s.entries.length > 0);

  const totalPages = SECTIONS.reduce((n, s) => n + s.entries.length, 0);

  return (
    <PageLayout>
      <h1 className="sr-only">Platform Sitemap — Readiness OS</h1>
      <div style={{ background: NAVY, padding: '60px 0 36px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)', backgroundSize: '44px 44px', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ width: 28, height: 1.5, background: GOLD }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD }}>Platform Directory</span>
          </div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 700, color: IVORY, marginBottom: 10, lineHeight: 1.1 }}>
            Readiness OS — <em style={{ color: GOLD }}>Complete Directory</em>
          </div>
          <div style={{ fontSize: 13, color: 'rgba(240,237,228,0.55)', maxWidth: 560, lineHeight: 1.6, marginBottom: 28 }}>
            Every page, feature, and experience — organised by how you use the platform.
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.13)', padding: '8px 14px', gap: 8, flex: '1 1 260px', maxWidth: 340 }}>
              <Search size={14} style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search pages and features…"
                style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: 13, width: '100%' }}
              />
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {FILTER_OPTIONS.map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: '7px 14px', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                    border: `1px solid ${filter === f ? GOLD : 'rgba(255,255,255,0.18)'}`,
                    background: filter === f ? 'rgba(201,168,76,0.15)' : 'transparent',
                    color: filter === f ? GOLD : 'rgba(255,255,255,0.55)',
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: '#F9F8F5', padding: '40px 0 80px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>

          {visible.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#9CA3AF', fontSize: 14 }}>
              No results for "{search}" — try a different search term.
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
            {visible.map(section => {
              const SectionIcon = section.icon;
              return (
                <div key={section.title} style={{ background: '#fff', border: '1px solid #E8E4DC', borderTop: `3px solid ${section.color}`, padding: '20px 0 8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 20px 14px', borderBottom: '1px solid #F3F0EB' }}>
                    <div style={{ width: 28, height: 28, background: `${section.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <SectionIcon size={13} style={{ color: section.color }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', color: NAVY }}>{section.title}</span>
                  </div>
                  <div>
                    {section.entries.map(entry => {
                      const EntryIcon = entry.icon;
                      return (
                        <button
                          key={entry.path}
                          onClick={() => setLocation(entry.path)}
                          style={{ width: '100%', display: 'flex', alignItems: 'flex-start', gap: 10, padding: '9px 20px', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer', transition: 'background 0.12s' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#F9F8F5'; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                        >
                          <EntryIcon size={13} style={{ color: section.color, marginTop: 2, flexShrink: 0 }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{ fontSize: 12, fontWeight: 700, color: NAVY, lineHeight: 1.3 }}>{entry.name}</span>
                              {entry.tag && (
                                <span style={{
                                  fontSize: 9, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '2px 6px',
                                  background: entry.tag === 'NEW' ? `${TEAL}20` : entry.tag === 'POPULAR' ? `${GOLD}20` : `${NAVY}15`,
                                  color: entry.tag === 'NEW' ? TEAL : entry.tag === 'POPULAR' ? '#9A7B3A' : NAVY,
                                  border: `1px solid ${entry.tag === 'NEW' ? `${TEAL}40` : entry.tag === 'POPULAR' ? `${GOLD}40` : `${NAVY}25`}`,
                                }}>
                                  {entry.tag}
                                </span>
                              )}
                            </div>
                            {entry.desc && (
                              <span style={{ fontSize: 11, color: '#9CA3AF', lineHeight: 1.45, display: 'block', marginTop: 1 }}>{entry.desc}</span>
                            )}
                          </div>
                          <ChevronRight size={12} style={{ color: '#D1CEC7', marginTop: 2, flexShrink: 0 }} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 40, background: NAVY, padding: '28px 40px', display: 'flex', gap: 40, flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { n: totalPages.toString(), label: 'Total Pages & Features' },
              { n: '180', label: 'Readiness Protocols' },
              { n: '12', label: 'Scenario Simulations' },
              { n: '231', label: 'Monitored Triggers' },
              { n: '12 min', label: 'Execution Head Start' },
            ].map(({ n, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: GOLD, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{n}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '1.1px', marginTop: 5 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
