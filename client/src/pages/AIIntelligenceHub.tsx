import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import PageLayout from '@/components/layout/PageLayout';
import { Activity, Brain, Zap, Users, Sparkles } from 'lucide-react';

// Import existing AI module components
import PulseIntelligence from './PulseIntelligence';
import FluxAdaptations from './FluxAdaptations';
import PrismInsights from './PrismInsights';
import EchoCulturalAnalytics from './EchoCulturalAnalytics';
import NovaInnovations from './NovaInnovations';

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

export default function AIIntelligenceHub() {
  const [location] = useLocation();
  
  // Derive initial tab from URL path
  const getInitialTab = () => {
    const path = location.replace('/ai', '').replace('/', '').toLowerCase();
    const validModules = ['pulse', 'flux', 'prism', 'echo', 'nova'];
    return validModules.includes(path) ? path : 'pulse';
  };
  
  const [activeTab, setActiveTab] = useState(getInitialTab());
  
  // Update active tab when location changes
  useEffect(() => {
    const tab = getInitialTab();
    setActiveTab(tab);
  }, [location]);

  const modules = [
    {
      id: 'pulse',
      name: 'Pulse Intelligence',
      icon: Activity,
      color: 'text-[#C9A84C]',
      bgColor: 'bg-[#C9A84C]/10',
      borderColor: 'border-[#C9A84C]/30',
      description: 'Market signals & competitive intelligence',
      component: PulseIntelligence
    },
    {
      id: 'flux',
      name: 'Flux Adaptations',
      icon: Zap,
      color: 'text-[#2B8A6E]',
      bgColor: 'bg-[#2B8A6E]/10',
      borderColor: 'border-[#2B8A6E]/30',
      description: 'Dynamic response optimization',
      component: FluxAdaptations
    },
    {
      id: 'prism',
      name: 'Prism Insights',
      icon: Target,
      color: 'text-[#C9A84C]',
      bgColor: 'bg-[#C9A84C]/10',
      borderColor: 'border-[#C9A84C]/30',
      description: 'Multi-dimensional strategic analysis',
      component: PrismInsights
    },
    {
      id: 'echo',
      name: 'Echo Analytics',
      icon: Users,
      color: 'text-[#2B8A6E]',
      bgColor: 'bg-[#2B8A6E]/10',
      borderColor: 'border-[#2B8A6E]/30',
      description: 'Cultural & stakeholder impact',
      component: EchoCulturalAnalytics
    },
    {
      id: 'nova',
      name: 'Nova Innovations',
      icon: Sparkles,
      color: 'text-[#C9A84C]',
      bgColor: 'bg-[#C9A84C]/10',
      borderColor: 'border-[#C9A84C]/30',
      description: 'Innovation pipeline & opportunities',
      component: NovaInnovations
    }
  ];

  const ActiveComponent = modules.find(m => m.id === activeTab)?.component || PulseIntelligence;

  return (
    <PageLayout>
      <div className="page-background min-h-screen bg-white">

        {/* ─── Dark Tile Module Hub ─────────────────────────────────────── */}
        <div style={{ background: NAVY, padding: '28px 0 0' }}>
          <style>{`
            @keyframes ai-fadeup { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
            .ai-tile-1{animation:ai-fadeup 0.4s ease 0.04s both}
            .ai-tile-2{animation:ai-fadeup 0.4s ease 0.1s both}
            .ai-tile-3{animation:ai-fadeup 0.4s ease 0.16s both}
            .ai-tile-4{animation:ai-fadeup 0.4s ease 0.22s both}
            .ai-tile-5{animation:ai-fadeup 0.4s ease 0.28s both}
          `}</style>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, background: 'rgba(201,168,76,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Brain style={{ width: 18, height: 18, color: GOLD }} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2 }}>
                    <div style={{ width: 20, height: 1.5, background: GOLD }} />
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD }}>Intelligence Suite</span>
                  </div>
                  <div style={{ ...CG, fontSize: 21, fontWeight: 600, color: '#F0EDE4', lineHeight: 1 }}>AI Intelligence Hub</div>
                </div>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(43,138,110,0.12)', color: '#3BAF8A', fontSize: 10, fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', padding: '4px 12px', border: '1px solid rgba(43,138,110,0.3)' }}>
                <span style={{ width: 6, height: 6, background: '#3BAF8A', borderRadius: '50%', display: 'inline-block' }} />
                All Systems Active
              </div>
            </div>

            {/* Module Tiles */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10 }}>
              {modules.map((module, i) => {
                const Icon = module.icon;
                const isActive = activeTab === module.id;
                const accentColor = module.id === 'flux' || module.id === 'echo' ? '#2B8A6E' : GOLD;
                return (
                  <div
                    key={module.id}
                    className={`ai-tile-${i + 1}`}
                    onClick={() => setActiveTab(module.id)}
                    data-testid={`ai-module-${module.id}`}
                    style={{
                      background: isActive ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.025)',
                      border: `1px solid ${isActive ? accentColor : 'rgba(255,255,255,0.08)'}`,
                      borderBottom: `3px solid ${isActive ? accentColor : 'transparent'}`,
                      padding: '16px 14px',
                      cursor: 'pointer',
                      transition: 'all 0.18s ease',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
                      <div style={{ width: 34, height: 34, background: isActive ? `${accentColor}22` : 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon style={{ width: 16, height: 16, color: isActive ? accentColor : 'rgba(240,237,228,0.4)' }} />
                      </div>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: isActive ? '#F0EDE4' : 'rgba(240,237,228,0.5)', marginBottom: 4, letterSpacing: '0.01em' }}>{module.name}</div>
                    <div style={{ fontSize: 11, color: 'rgba(240,237,228,0.45)', lineHeight: 1.35 }}>{module.description}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Module Content */}
        <ActiveComponent />
      </div>
    </PageLayout>
  );
}
