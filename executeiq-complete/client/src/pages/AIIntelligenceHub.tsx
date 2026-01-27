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
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      description: 'Market signals & competitive intelligence',
      component: PulseIntelligence
    },
    {
      id: 'flux',
      name: 'Flux Adaptations',
      icon: Zap,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
      description: 'Dynamic response optimization',
      component: FluxAdaptations
    },
    {
      id: 'prism',
      name: 'Prism Insights',
      icon: Target,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      description: 'Multi-dimensional strategic analysis',
      component: PrismInsights
    },
    {
      id: 'echo',
      name: 'Echo Analytics',
      icon: Users,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
      description: 'Cultural & stakeholder impact',
      component: EchoCulturalAnalytics
    },
    {
      id: 'nova',
      name: 'Nova Innovations',
      icon: Sparkles,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10',
      borderColor: 'border-pink-500/30',
      description: 'Innovation pipeline & opportunities',
      component: NovaInnovations
    }
  ];

  const ActiveComponent = modules.find(m => m.id === activeTab)?.component || PulseIntelligence;

  return (
    <PageLayout>
      <div className="page-background min-h-screen bg-gray-950">
        {/* Page Title Section */}
        <div className="max-w-7xl mx-auto px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">AI Intelligence Hub</h1>
                <p className="text-sm text-gray-400">Strategic co-pilots for executive decision-making</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-500/10 text-green-300 border-green-500/30">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
              All Systems Active
            </Badge>
          </div>
        </div>

        {/* Module Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-gray-800 bg-gray-900/30">
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
                          ? `${module.borderColor} bg-gray-800/50` 
                          : 'border-transparent hover:bg-gray-800/30'
                        }
                        data-[state=active]:shadow-none
                      `}
                      data-testid={`ai-module-${module.id}`}
                    >
                      <div className={`p-2 rounded-lg ${isActive ? module.bgColor : 'bg-gray-800/50'}`}>
                        <Icon className={`h-5 w-5 ${isActive ? module.color : 'text-gray-400'}`} />
                      </div>
                      <div className="text-center">
                        <p className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-gray-400'}`}>
                          {module.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
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
