import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import PageLayout from '@/components/layout/PageLayout';
import {
  ArrowRight, Zap,
  ChevronRight, AlertTriangle, Clock, Play, Radio, Brain,
  CheckCircle2, Layers, BookOpen
} from 'lucide-react';
import { roleConfigs, type RoleConfig } from '@/data/roleConfigs';

const NAVY = '#0A0F2E';
const GOLD = '#C9A84C';
const TEAL = '#2B8A6E';

const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

const CATEGORY_CONFIG = {
  OFFENSE: { accent: TEAL, bg: 'rgba(43,138,110,0.08)', border: 'rgba(43,138,110,0.22)', label: 'Growth & Positioning', dot: '#2B8A6E' },
  DEFENSE: { accent: '#DC2626', bg: 'rgba(220,38,38,0.06)', border: 'rgba(220,38,38,0.2)', label: 'Risk & Resilience', dot: '#f87171' },
  'SPECIAL TEAMS': { accent: GOLD, bg: 'rgba(201,168,76,0.07)', border: 'rgba(201,168,76,0.22)', label: 'Transformation', dot: GOLD },
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
            borderRadius: 0,
            padding: '22px 22px 20px',
            cursor: 'pointer',
            transition: 'all 0.18s',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.borderColor = cat.accent;
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.borderColor = cat.border;
          }}
        >
          {/* Role header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
            <div style={{ width: 40, height: 40, background: cat.bg, border: `1px solid ${cat.border}`, borderRadius: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={18} style={{ color: cat.accent }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: NAVY, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{config.id.toUpperCase()}</span>
                <span style={{ fontSize: 9, fontWeight: 700, color: cat.accent, background: cat.bg, border: `1px solid ${cat.border}`, padding: '2px 7px', borderRadius: 0, letterSpacing: '0.14em', textTransform: 'uppercase' }}>{cat.label}</span>
              </div>
              <p style={{ fontSize: 11, color: '#6B7280', margin: 0, fontWeight: 500 }}>{config.title}</p>
            </div>
            {/* Simulation badge */}
            <div style={{ flexShrink: 0, background: 'rgba(10,15,46,0.05)', border: '1px solid rgba(10,15,46,0.1)', borderRadius: 0, padding: '3px 7px', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Play size={8} style={{ color: NAVY }} />
              <span style={{ fontSize: 11, fontWeight: 800, color: NAVY, letterSpacing: '0.1em', textTransform: 'uppercase' }}>12-Step</span>
            </div>
          </div>

          {/* The hook */}
          <div style={{ background: `${cat.bg}`, border: `1px solid ${cat.border}`, borderLeft: `3px solid ${cat.accent}`, borderRadius: 0, padding: '10px 12px', marginBottom: 14 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: NAVY, margin: 0, lineHeight: 1.5, fontStyle: 'italic' }}>
              "{config.hookQuestion}"
            </p>
          </div>

          {/* Situation line */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 14 }}>
            <AlertTriangle size={12} style={{ color: '#f87171', flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 11, color: '#6B7280', margin: 0, lineHeight: 1.5 }}>{config.situationLine}</p>
          </div>

          {/* Before / After outcome */}
          <div style={{ marginTop: 'auto', display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 8, padding: '10px 12px', background: '#F8F7F4', borderRadius: 0, marginBottom: 14 }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#f87171', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 2px' }}>Without OS</p>
              <p style={{ fontSize: 15, fontWeight: 800, color: '#f87171', margin: 0, lineHeight: 1, fontFamily: "'Cormorant Garamond', serif" }}>{config.metricBefore}</p>
            </div>
            <ArrowRight size={12} style={{ color: '#D1D5DB' }} />
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: TEAL, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 2px' }}>With OS</p>
              <p style={{ fontSize: 15, fontWeight: 800, color: TEAL, margin: 0, lineHeight: 1, fontFamily: "'Cormorant Garamond', serif" }}>{config.metricAfter}</p>
            </div>
          </div>

          {/* Readiness Protocol label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <BookOpen size={10} style={{ color: GOLD, flexShrink: 0 }} />
            <span style={{ fontSize: 10, fontWeight: 600, color: '#9CA3AF' }}>{config.playbook}</span>
          </div>

          {/* CTA button — full width, prominent */}
          <div
            style={{
              background: cat.accent,
              color: cat.accent === GOLD ? NAVY : '#fff',
              borderRadius: 0,
              padding: '11px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.88'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
          >
            <Play size={12} />
            Enter My {config.id.toUpperCase()} Simulation
            <ChevronRight size={13} style={{ marginLeft: 'auto' }} />
          </div>
        </div>
      </Link>
    );
  };

  const renderCategory = (label: string, desc: string, roles: RoleConfig[], cat: typeof CATEGORY_CONFIG[keyof typeof CATEGORY_CONFIG]) => (
    <div style={{ marginBottom: 48 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
        <div style={{ width: 10, height: 10, borderRadius: 0, background: cat.accent, boxShadow: `0 0 8px ${cat.accent}` }} />
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
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 0, padding: '5px 14px', marginBottom: 20 }}>
              <div style={{ width: 6, height: 6, borderRadius: 0, background: GOLD }} className="animate-pulse" />
              <span style={{ fontSize: 11, fontWeight: 800, color: GOLD, letterSpacing: '0.22em', textTransform: 'uppercase' }}>Role-Specific Execution Experience</span>
            </div>
            <h1 style={{ ...CG, fontSize: 44, fontWeight: 700, color: '#FFFFFF', marginBottom: 14, lineHeight: 1.15 }}>
              Your Role. Your Situation. Your Readiness Protocol.
            </h1>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', maxWidth: 580, margin: '0 auto 28px', lineHeight: 1.6 }}>
              Every C-suite role faces a different strategic situation — competitive moves, regulatory deadlines, M&A signals, talent shifts. Select yours — then watch Readiness OS pre-stage your Readiness Protocol before the trigger fires.
            </p>
            {/* The core contrast */}
            <div style={{ display: 'inline-grid', gridTemplateColumns: '1fr auto 1fr', gap: 20, alignItems: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 0, padding: '14px 28px' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(248,113,113,0.8)', textTransform: 'uppercase', letterSpacing: '0.16em', margin: '0 0 4px' }}>Traditional Enterprise</p>
                <p style={{ fontSize: 24, fontWeight: 800, color: '#f87171', margin: 0, fontFamily: "'Cormorant Garamond', serif" }}>30 days</p>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.68)', margin: '2px 0 0' }}>to mobilize a response</p>
              </div>
              <div style={{ fontSize: 20, color: 'rgba(255,255,255,0.68)' }}>→</div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(43,138,110,0.8)', textTransform: 'uppercase', letterSpacing: '0.16em', margin: '0 0 4px' }}>Readiness OS</p>
                <p style={{ fontSize: 24, fontWeight: 800, color: '#4ade80', margin: 0, fontFamily: "'Cormorant Garamond', serif" }}>12 minutes</p>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.68)', margin: '2px 0 0' }}>full execution underway</p>
              </div>
            </div>
          </div>
        </div>

        {/* Journey preview strip */}
        <div style={{ background: '#fff', borderBottom: '1px solid #E8E4DC' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <div style={{ width: 18, height: 2, background: GOLD }} />
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.25em', textTransform: 'uppercase', color: GOLD }}>What You'll Experience</span>
              <div style={{ flex: 1, height: 1, background: '#E8E4DC' }} />
              <span style={{ fontSize: 10, fontWeight: 600, color: '#9CA3AF' }}>12-step interactive simulation · No login required · ~8 minutes</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 0, position: 'relative' }}>
              {[
                { icon: Layers, label: 'Your Scenario', sub: 'Real situation. Your role. Real stakes.', color: NAVY, step: 1 },
                { icon: BookOpen, label: 'Build Readiness Protocol', sub: 'Configure tasks, stakeholders & budget.', color: TEAL, step: 2 },
                { icon: Radio, label: 'Situation Arrives', sub: 'Signal detected. OS pre-staged & ready.', color: GOLD, step: 3 },
                { icon: Brain, label: 'Signal Analysis', sub: '4 system insights surface in real time.', color: TEAL, step: 4 },
                { icon: Zap, label: 'Live Execution', sub: 'Watch 8 tasks coordinate in 12 minutes.', color: '#DC2626', step: 5 },
                { icon: CheckCircle2, label: 'Outcomes', sub: 'Before/after. Metrics. Your lesson.', color: TEAL, step: 6 },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', padding: '0 12px' }}>
                    {/* Connector line */}
                    {i < 5 && (
                      <div style={{ position: 'absolute', top: 20, left: '50%', width: '100%', height: 1, background: 'linear-gradient(90deg, #E8E4DC, transparent)', zIndex: 0 }} />
                    )}
                    <div style={{ width: 40, height: 40, borderRadius: 0, background: `${item.color}12`, border: `2px solid ${item.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1, marginBottom: 8 }}>
                      <Icon size={16} style={{ color: item.color }} />
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: item.color, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 3 }}>Step {item.step}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: NAVY, marginBottom: 3, lineHeight: 1.2 }}>{item.label}</div>
                    <div style={{ fontSize: 10, color: '#9CA3AF', lineHeight: 1.4 }}>{item.sub}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 18, padding: '12px 18px', background: '#F8F7F4', borderRadius: 0, border: '1px solid #E8E4DC', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 6, height: 6, borderRadius: 0, background: GOLD, flexShrink: 0 }} className="animate-pulse" />
              <p style={{ fontSize: 12, color: '#374151', margin: 0, lineHeight: 1.5 }}>
                <strong style={{ color: NAVY }}>Pick your role below.</strong> You'll enter a live, interactive 12-step simulation — configure your Readiness Protocol, watch the trigger fire, make the executive decision, and see real execution metrics for your function.
              </p>
              <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontWeight: 700, color: GOLD }}>
                <Play size={10} /> No login required
              </div>
            </div>
          </div>
        </div>

        {/* Role grid */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '52px 24px' }}>
          {renderCategory('Growth & Positioning', 'Growth, M&A, market expansion, revenue acceleration', offenseRoles, CATEGORY_CONFIG.OFFENSE)}
          {renderCategory('Risk & Resilience', 'Cyber, breach, crisis containment, legal exposure', defenseRoles, CATEGORY_CONFIG.DEFENSE)}
          {renderCategory('Transformation', 'Compliance, regulatory, AI governance, data strategy', specialTeamsRoles, CATEGORY_CONFIG['SPECIAL TEAMS'])}

          {/* Bottom CTA */}
          <div style={{ background: NAVY, borderRadius: 0, padding: '40px 36px', textAlign: 'center', marginTop: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 12 }}>
              <Clock size={18} style={{ color: GOLD }} />
              <h3 style={{ ...CG, fontSize: 26, fontWeight: 700, color: '#FFFFFF', margin: 0 }}>Not sure where to start?</h3>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', maxWidth: 480, margin: '0 auto 22px', lineHeight: 1.6 }}>
              See how your seat fits into the full organization — all 14 roles, one coordinated system, walked end to end.
            </p>
            <Link href="/full-experience">
              <Button style={{ background: GOLD, color: NAVY, fontWeight: 700, fontSize: 14, padding: '12px 28px', height: 'auto' }}>
                <Zap size={16} style={{ marginRight: 8 }} />
                See the Full Platform Experience
                <ArrowRight size={15} style={{ marginLeft: 8 }} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
