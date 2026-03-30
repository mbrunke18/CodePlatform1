import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PageLayout from '@/components/layout/PageLayout';
import {
  Briefcase, DollarSign, Settings, TrendingUp, Server, Shield,
  Users, Scale, Database, FileCheck, Target, ArrowRight, Zap,
  ChevronRight, AlertTriangle, Clock
} from 'lucide-react';

interface RoleConfig {
  id: string;
  title: string;
  icon: any;
  hookQuestion: string;
  crisisLine: string;
  keyMetric: string;
  metricBefore: string;
  metricAfter: string;
  playbook: string;
  category: 'OFFENSE' | 'DEFENSE' | 'SPECIAL TEAMS';
}

const NAVY = '#0A0F2E';
const GOLD = '#C9A84C';
const TEAL = '#2B8A6E';

const roleConfigs: RoleConfig[] = [
  {
    id: 'ceo',
    title: 'Chief Executive Officer',
    icon: Briefcase,
    hookQuestion: 'What percentage of your strategic initiatives actually deliver on time and on budget?',
    crisisLine: 'Board calls at 7 AM. Activist investor filed. You have no playbook.',
    keyMetric: '$144M execution gap closed',
    metricBefore: '30+ days',
    metricAfter: '12 min',
    playbook: 'M&A Day 1 Integration',
    category: 'OFFENSE',
  },
  {
    id: 'cfo',
    title: 'Chief Financial Officer',
    icon: DollarSign,
    hookQuestion: "What's your company's biggest untracked expense that doesn't appear on any line item?",
    crisisLine: 'Coordinated response delays. Every week without a plan costs millions.',
    keyMetric: '$114M Year 1 ROI · 6.3 week payback',
    metricBefore: '3–5 weeks',
    metricAfter: '12 min',
    playbook: 'Financial Crisis Response',
    category: 'OFFENSE',
  },
  {
    id: 'ciso',
    title: 'Chief Information Security Officer',
    icon: Shield,
    hookQuestion: 'Breach detected at 2 AM. How long until 6 teams have roles, tasks, and execution already live?',
    crisisLine: 'The clock starts the moment the breach is detected. Every minute is exposure.',
    keyMetric: 'Breach contained in 47 min',
    metricBefore: '8 hours',
    metricAfter: '47 min',
    playbook: 'Ransomware Response',
    category: 'DEFENSE',
  },
  {
    id: 'coo',
    title: 'Chief Operating Officer',
    icon: Settings,
    hookQuestion: 'When was the last time you executed your continuity plan at the speed it assumes?',
    crisisLine: 'Supply chain disruption live. Operations halting. You need coordinated response NOW.',
    keyMetric: '$2.1M saved · Full coordination',
    metricBefore: '30 days',
    metricAfter: '12 min',
    playbook: 'Operational Continuity',
    category: 'OFFENSE',
  },
  {
    id: 'cmo',
    title: 'Chief Marketing Officer',
    icon: TrendingUp,
    hookQuestion: 'Competitor launches a product tomorrow. How long until your counter-campaign is in market?',
    crisisLine: 'Competitor announcement live. Media is covering it. Your team is still in Slack.',
    keyMetric: '$12M market share defended',
    metricBefore: '21 days',
    metricAfter: '3 days',
    playbook: 'Competitive Response Playbook',
    category: 'OFFENSE',
  },
  {
    id: 'cto',
    title: 'Chief Technology Officer',
    icon: Server,
    hookQuestion: 'CEO announces digital transformation Monday. How long until 6 teams are coordinating?',
    crisisLine: 'Transformation announcement made. Engineering, Product, Data, Security — all waiting.',
    keyMetric: '$12M ROI · 82% adoption rate',
    metricBefore: '36 months',
    metricAfter: '22 months',
    playbook: 'AI Governance Framework',
    category: 'SPECIAL TEAMS',
  },
  {
    id: 'chro',
    title: 'Chief Human Resources Officer',
    icon: Users,
    hookQuestion: "What's the #1 reason your top performers give in exit interviews?",
    crisisLine: 'Key talent departing. Culture score dropping. Nobody has a retention playbook staged.',
    keyMetric: '85% engagement · $2.1M saved',
    metricBefore: '6 weeks',
    metricAfter: '12 min',
    playbook: 'M&A Day 1 Integration',
    category: 'OFFENSE',
  },
  {
    id: 'gc',
    title: 'General Counsel',
    icon: Scale,
    hookQuestion: 'Regulatory change Friday afternoon. How long until your organization executes compliance?',
    crisisLine: 'Friday 5 PM regulatory filing. Six teams need to move. No one has a mandate.',
    keyMetric: 'Deadline met with 12 days to spare',
    metricBefore: '5 weeks',
    metricAfter: '10 days',
    playbook: 'Regulatory Response',
    category: 'SPECIAL TEAMS',
  },
  {
    id: 'cso',
    title: 'Chief Strategy Officer',
    icon: Target,
    hookQuestion: 'Six months later, how much of your strategy is actually executing as planned?',
    crisisLine: 'Q3 board review reveals 30% execution gap. Strategy is not translating to action.',
    keyMetric: '70% → 95% strategy delivery',
    metricBefore: '70% delivery',
    metricAfter: '95% delivery',
    playbook: 'Strategic Alignment Playbook',
    category: 'OFFENSE',
  },
  {
    id: 'cro',
    title: 'Chief Revenue Officer',
    icon: TrendingUp,
    hookQuestion: "What's your average time from 'customer at risk' to 'retention plan in market'?",
    crisisLine: 'Your #2 account signals churn. Competitive displacement happening in real time.',
    keyMetric: '+5% win rate · $44M revenue added',
    metricBefore: '21 days',
    metricAfter: '5 days',
    playbook: 'Customer Retention Response',
    category: 'OFFENSE',
  },
  {
    id: 'cdo',
    title: 'Chief Data Officer',
    icon: Database,
    hookQuestion: 'Your data signals churn risk. How long until the organization acts on that insight?',
    crisisLine: 'Signal fired 14 days ago. Three teams still haven\'t moved. Insight without execution.',
    keyMetric: '92% customer save rate',
    metricBefore: '14 days',
    metricAfter: '2 hours',
    playbook: 'AI Governance Framework',
    category: 'SPECIAL TEAMS',
  },
  {
    id: 'cco',
    title: 'Chief Compliance Officer',
    icon: FileCheck,
    hookQuestion: 'Audit notification arrives Monday. How long before 6 teams have tasks staged and ready?',
    crisisLine: 'Audit in 10 days. Six departments. No pre-staged compliance playbook. Starting from scratch.',
    keyMetric: 'Audit stress eliminated',
    metricBefore: '10 days scrambling',
    metricAfter: '2 days ready',
    playbook: 'Compliance Audit Response',
    category: 'SPECIAL TEAMS',
  },
];

const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

const CATEGORY_CONFIG = {
  OFFENSE: { accent: TEAL, bg: 'rgba(43,138,110,0.08)', border: 'rgba(43,138,110,0.22)', label: 'Offense', dot: '#2B8A6E' },
  DEFENSE: { accent: '#DC2626', bg: 'rgba(220,38,38,0.06)', border: 'rgba(220,38,38,0.2)', label: 'Defense', dot: '#f87171' },
  'SPECIAL TEAMS': { accent: GOLD, bg: 'rgba(201,168,76,0.07)', border: 'rgba(201,168,76,0.22)', label: 'Special Teams', dot: GOLD },
};

export default function RoleSelector({ embedded }: { embedded?: boolean }) {
  const offenseRoles = roleConfigs.filter(r => r.category === 'OFFENSE');
  const defenseRoles = roleConfigs.filter(r => r.category === 'DEFENSE');
  const specialTeamsRoles = roleConfigs.filter(r => r.category === 'SPECIAL TEAMS');

  const renderCard = (config: RoleConfig) => {
    const Icon = config.icon;
    const cat = CATEGORY_CONFIG[config.category];
    return (
      <Link key={config.id} href={`/experience/${config.id}`}>
        <div
          style={{
            background: '#FFFFFF',
            border: `1px solid ${cat.border}`,
            borderTop: `3px solid ${cat.accent}`,
            borderRadius: 12,
            padding: '22px 22px 18px',
            cursor: 'pointer',
            transition: 'all 0.18s',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px rgba(10,15,46,0.12), 0 2px 8px rgba(10,15,46,0.08)`;
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            (e.currentTarget as HTMLElement).style.transform = 'none';
          }}
        >
          {/* Role header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
            <div style={{ width: 40, height: 40, background: cat.bg, border: `1px solid ${cat.border}`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={18} style={{ color: cat.accent }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: NAVY, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{config.id.toUpperCase()}</span>
                <span style={{ fontSize: 9, fontWeight: 700, color: cat.accent, background: cat.bg, border: `1px solid ${cat.border}`, padding: '2px 7px', borderRadius: 3, letterSpacing: '0.14em', textTransform: 'uppercase' }}>{cat.label}</span>
              </div>
              <p style={{ fontSize: 11, color: '#6B7280', margin: 0, fontWeight: 500 }}>{config.title}</p>
            </div>
          </div>

          {/* The hook — this is the most powerful line */}
          <div style={{ background: `${cat.bg}`, border: `1px solid ${cat.border}`, borderLeft: `3px solid ${cat.accent}`, borderRadius: 6, padding: '10px 12px', marginBottom: 14 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: NAVY, margin: 0, lineHeight: 1.5, fontStyle: 'italic' }}>
              "{config.hookQuestion}"
            </p>
          </div>

          {/* Crisis line */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 14 }}>
            <AlertTriangle size={12} style={{ color: '#f87171', flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 11, color: '#6B7280', margin: 0, lineHeight: 1.5 }}>{config.crisisLine}</p>
          </div>

          {/* Before / After outcome */}
          <div style={{ marginTop: 'auto', display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 8, padding: '10px 12px', background: '#F8F7F4', borderRadius: 8 }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 9, fontWeight: 700, color: '#f87171', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 2px' }}>Without OS</p>
              <p style={{ fontSize: 15, fontWeight: 800, color: '#f87171', margin: 0, lineHeight: 1, fontFamily: "'Cormorant Garamond', serif" }}>{config.metricBefore}</p>
            </div>
            <ArrowRight size={12} style={{ color: '#D1D5DB' }} />
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 9, fontWeight: 700, color: TEAL, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 2px' }}>With OS</p>
              <p style={{ fontSize: 15, fontWeight: 800, color: TEAL, margin: 0, lineHeight: 1, fontFamily: "'Cormorant Garamond', serif" }}>{config.metricAfter}</p>
            </div>
          </div>

          {/* CTA row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, paddingTop: 12, borderTop: '1px solid #E8E4DC' }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: '#9CA3AF' }}>{config.playbook}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: cat.accent }}>
              See My Experience <ChevronRight size={13} />
            </div>
          </div>
        </div>
      </Link>
    );
  };

  const renderCategory = (label: string, desc: string, roles: RoleConfig[], cat: typeof CATEGORY_CONFIG[keyof typeof CATEGORY_CONFIG]) => (
    <div style={{ marginBottom: 48 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: cat.accent, boxShadow: `0 0 8px ${cat.accent}` }} />
        <div>
          <span style={{ fontSize: 11, fontWeight: 800, color: cat.accent, letterSpacing: '0.22em', textTransform: 'uppercase' }}>{label}</span>
          <span style={{ fontSize: 11, color: '#9CA3AF', marginLeft: 10 }}>{desc}</span>
        </div>
        <div style={{ flex: 1, height: 1, background: `${cat.border}`, marginLeft: 8 }} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map(renderCard)}
      </div>
    </div>
  );

  return (
    <PageLayout embedded={embedded}>
      <div style={{ minHeight: '100vh', background: '#F8F7F4', color: NAVY }}>

        {/* Dark Hero Header */}
        <div style={{ background: NAVY, padding: '52px 24px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          {/* Subtle grid */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(201,168,76,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.06) 1px, transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', maxWidth: 760, margin: '0 auto' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 6, padding: '5px 14px', marginBottom: 20 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: GOLD }} className="animate-pulse" />
              <span style={{ fontSize: 9, fontWeight: 800, color: GOLD, letterSpacing: '0.22em', textTransform: 'uppercase' }}>Role-Specific Execution Experience</span>
            </div>
            <h1 style={{ ...CG, fontSize: 44, fontWeight: 700, color: '#FFFFFF', marginBottom: 14, lineHeight: 1.15 }}>
              Your Role. Your Crisis. Your Response.
            </h1>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', maxWidth: 580, margin: '0 auto 28px', lineHeight: 1.6 }}>
              Every C-suite role faces a different trigger. Select yours — then watch Execution OS pre-stage your playbook before the crisis even hits.
            </p>
            {/* The core contrast */}
            <div style={{ display: 'inline-grid', gridTemplateColumns: '1fr auto 1fr', gap: 20, alignItems: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '14px 28px' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 9, fontWeight: 700, color: 'rgba(248,113,113,0.8)', textTransform: 'uppercase', letterSpacing: '0.16em', margin: '0 0 4px' }}>Traditional Enterprise</p>
                <p style={{ fontSize: 24, fontWeight: 800, color: '#f87171', margin: 0, fontFamily: "'Cormorant Garamond', serif" }}>30 days</p>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', margin: '2px 0 0' }}>to mobilize a response</p>
              </div>
              <div style={{ fontSize: 20, color: 'rgba(255,255,255,0.15)' }}>→</div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 9, fontWeight: 700, color: 'rgba(43,138,110,0.8)', textTransform: 'uppercase', letterSpacing: '0.16em', margin: '0 0 4px' }}>Execution OS</p>
                <p style={{ fontSize: 24, fontWeight: 800, color: '#4ade80', margin: 0, fontFamily: "'Cormorant Garamond', serif" }}>12 minutes</p>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', margin: '2px 0 0' }}>full execution underway</p>
              </div>
            </div>
          </div>
        </div>

        {/* Role grid */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '52px 24px' }}>
          {renderCategory('Offense', 'Growth, M&A, market expansion, revenue defense', offenseRoles, CATEGORY_CONFIG.OFFENSE)}
          {renderCategory('Defense', 'Cyber, breach, crisis containment, legal exposure', defenseRoles, CATEGORY_CONFIG.DEFENSE)}
          {renderCategory('Special Teams', 'Compliance, regulatory, AI governance, data strategy', specialTeamsRoles, CATEGORY_CONFIG['SPECIAL TEAMS'])}

          {/* Bottom CTA */}
          <div style={{ background: NAVY, borderRadius: 16, padding: '40px 36px', textAlign: 'center', marginTop: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 12 }}>
              <Clock size={18} style={{ color: GOLD }} />
              <h3 style={{ ...CG, fontSize: 26, fontWeight: 700, color: '#FFFFFF', margin: 0 }}>Not sure where to start?</h3>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', maxWidth: 480, margin: '0 auto 22px', lineHeight: 1.6 }}>
              Jump straight into the full simulation — pick any live crisis scenario and watch the IDEA Framework respond in real time.
            </p>
            <Link href="/try-demo">
              <Button style={{ background: GOLD, color: NAVY, fontWeight: 700, fontSize: 14, padding: '12px 28px', height: 'auto' }}>
                <Zap size={16} style={{ marginRight: 8 }} />
                Try the Full Execution Simulation
                <ArrowRight size={15} style={{ marginLeft: 8 }} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
