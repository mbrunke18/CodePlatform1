import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Brain, 
  Zap, 
  Users, 
  Sparkles,
  TrendingUp,
  Target,
  AlertCircle
} from 'lucide-react';

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
        {/* Page Title Section */}
        <div className="max-w-7xl mx-auto px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div style={{ width: 40, height: 40, background: NAVY, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>Intelligence Suite</span>
                </div>
                <h1 style={{ ...CG, fontWeight: 600, fontSize: "1.5rem", color: NAVY }}>AI Intelligence Hub</h1>
                <p className="text-sm text-gray-500">Strategic co-pilots for executive decision-making</p>
              </div>
            </div>
            <div style={{ display:"inline-flex", alignItems:"center", gap:5, background:"rgba(43,138,110,0.12)", color:"#3BAF8A", fontSize:9, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", padding:"3px 10px", border: "1px solid rgba(43,138,110,0.3)" }}>
              <div className="w-2 h-2 bg-[#3BAF8A] rounded-full mr-1 animate-pulse" />
              All Systems Active
            </div>
          </div>
        </div>

        {/* Module Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-[#E8E4DC] bg-white">
            <div className="max-w-7xl mx-auto px-6">
              <TabsList className="grid w-full grid-cols-5 bg-transparent gap-2 h-auto p-0 border-0">
                {modules.map((module) => {
                  const Icon = module.icon;
                  const isActive = activeTab === module.id;
                  return (
                    <TabsTrigger
                      key={module.id}
                      value={module.id}
                      className={`
                        flex flex-col items-center gap-2 py-4 px-4 rounded-none border-b-2 transition-all
                        ${isActive 
                          ? `border-[#C9A84C] bg-[#F8F7F4]` 
                          : 'border-transparent hover:bg-gray-50'
                        }
                        data-[state=active]:shadow-none
                      `}
                      data-testid={`ai-module-${module.id}`}
                    >
                      <div className={`p-2 rounded-lg ${isActive ? module.bgColor : 'bg-[#F8F7F4]'}`}>
                        <Icon className={`h-5 w-5 ${isActive ? (module.id === 'flux' || module.id === 'echo' ? 'text-[#2B8A6E]' : 'text-[#C9A84C]') : 'text-gray-400'}`} />
                      </div>
                      <div className="text-center">
                        <p style={{ fontSize: "14px", fontWeight: 600, color: isActive ? NAVY : "#6B7280" }}>
                          {module.name}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {module.description}
                        </p>
                      </div>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>
          </div>

          {/* Module Content */}
          {modules.map((module) => (
            <TabsContent key={module.id} value={module.id} className="m-0 focus-visible:outline-none">
              <ActiveComponent />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </PageLayout>
  );
}
