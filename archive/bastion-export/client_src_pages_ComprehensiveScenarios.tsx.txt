import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VeridiusPageLayout from '@/components/layout/VeridiusPageLayout';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { 
  MapPin, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  Building2,
  Shield,
  DollarSign,
  Globe,
  Zap,
  Target,
  CheckCircle,
  Clock,
  ArrowRight,
  PlayCircle,
  FileText,
  Brain,
  Rocket,
  CircleDot,
  Calendar,
  Percent,
  Trophy
} from 'lucide-react';

export default function ComprehensiveScenarios() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  // Fetch real scenarios from database
  const { data: scenarios = [], isLoading, isError } = useQuery<any[]>({
    queryKey: ['/api/scenarios'],
  });

  // Import template mutation
  const importTemplateMutation = useMutation({
    mutationFn: async (templateId: string) => {
      const response = await fetch(`/api/scenarios/${templateId}/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to import template');
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/scenarios'] });
      toast({
        title: 'Template Imported',
        description: 'The playbook template has been added to your organization.',
      });
      // Switch to "All Playbooks" tab to see the imported template
      setSelectedCategory('all');
    },
    onError: () => {
      toast({
        title: 'Import Failed',
        description: 'Failed to import template. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const scenarioCategories = [
    {
      id: 'all',
      name: 'All Playbooks',
      icon: <Target className="w-5 h-5" />,
      count: scenarios.length,
      description: 'All available executive playbooks ready for execution',
      color: 'text-blue-500'
    },
    {
      id: 'crisis',
      name: 'Crisis Response',
      icon: <AlertTriangle className="w-5 h-5" />,
      count: scenarios.filter((s: any) => (s.type || s.category) === 'crisis').length,
      description: 'Emergency response and crisis management scenarios',
      color: 'text-red-500'
    },
    {
      id: 'strategic',
      name: 'Strategic Opportunities',
      icon: <Target className="w-5 h-5" />,
      count: scenarios.filter((s: any) => (s.type || s.category) === 'strategic').length,
      description: 'Strategic planning and opportunity capture scenarios', 
      color: 'text-blue-500'
    },
    {
      id: 'templates',
      name: 'Industry Templates',
      icon: <Building2 className="w-5 h-5" />,
      count: scenarios.filter((s: any) => s.isTemplate).length,
      description: 'Pre-built industry-specific playbooks ready to import',
      color: 'text-purple-500'
    }
  ];

  const industryOptions = [
    { id: 'all', name: 'All Industries', icon: <Globe className="w-4 h-4" />, color: 'text-blue-500' },
    { id: 'financial', name: 'Financial Services', icon: <DollarSign className="w-4 h-4" />, color: 'text-green-500' },
    { id: 'manufacturing', name: 'Manufacturing', icon: <Building2 className="w-4 h-4" />, color: 'text-orange-500' },
    { id: 'healthcare', name: 'Healthcare', icon: <Shield className="w-4 h-4" />, color: 'text-red-500' },
    { id: 'retail', name: 'Retail', icon: <Users className="w-4 h-4" />, color: 'text-purple-500' },
    { id: 'technology', name: 'Technology', icon: <Zap className="w-4 h-4" />, color: 'text-cyan-500' }
  ];

  const filteredScenarios = scenarioCategories.find(cat => cat.id === selectedCategory);
  
  let filteredScenariosData = selectedCategory === 'all' 
    ? scenarios 
    : selectedCategory === 'templates'
    ? scenarios.filter((s: any) => s.isTemplate)
    : scenarios.filter((s: any) => (s.type || s.category) === selectedCategory);
  
  // Filter by industry if in templates tab
  if (selectedCategory === 'templates' && selectedIndustry !== 'all') {
    filteredScenariosData = filteredScenariosData.filter((s: any) => 
      s.industry === selectedIndustry
    );
  }

  return (
    <VeridiusPageLayout>
      <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="p-8">
          {/* Scenarios Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Comprehensive Scenarios</h1>
                <p className="text-gray-600 dark:text-gray-300">Strategic Response Templates & AI-Powered Workflows</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="text-green-600 border-green-500/50">
                <CheckCircle className="w-3 h-3 mr-1" />
                21+ Scenarios Active
              </Badge>
              <Badge className="bg-red-600 text-white">
                Crisis Ready
              </Badge>
            </div>
          </div>

          {/* Scenario Categories */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
            <TabsList className="grid w-full grid-cols-4 bg-slate-100 dark:bg-slate-800">
              {scenarioCategories.map((category) => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="flex items-center space-x-2"
                  data-testid={`tab-scenario-${category.id}`}
                >
                  {category.icon}
                  <span>{category.name}</span>
                  <Badge variant="secondary">{category.count}</Badge>
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="mt-6">
              <TabsContent value={selectedCategory} className="space-y-6">
                {/* Category Overview */}
                <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg bg-white dark:bg-slate-800 ${filteredScenarios?.color}`}>
                        {filteredScenarios?.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{filteredScenarios?.name} Scenarios</h3>
                        <p className="text-gray-600 dark:text-gray-400">{filteredScenarios?.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span>{filteredScenarios?.count} templates available</span>
                          <span>•</span>
                          <span>Enterprise-grade protocols</span>
                          <span>•</span>
                          <span>AI-powered execution</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Industry Filter (only show in templates tab) */}
                {selectedCategory === 'templates' && (
                  <Card className="bg-white dark:bg-slate-800">
                    <CardHeader>
                      <CardTitle className="text-base">Browse by Industry</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        {industryOptions.map((industry) => (
                          <Button
                            key={industry.id}
                            variant={selectedIndustry === industry.id ? 'default' : 'outline'}
                            className={`flex items-center justify-start gap-2 ${selectedIndustry === industry.id ? '' : industry.color}`}
                            onClick={() => setSelectedIndustry(industry.id)}
                            data-testid={`button-industry-${industry.id}`}
                          >
                            {industry.icon}
                            <span className="text-xs">{industry.name}</span>
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Scenarios Grid */}
                {isLoading && (
                  <div className="text-center py-12 text-gray-500">
                    Loading playbooks...
                  </div>
                )}
                
                {isError && (
                  <div className="text-center py-12">
                    <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600">Failed to load playbooks. Please try again.</p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {!isLoading && !isError && filteredScenariosData.length === 0 && (
                    <div className="col-span-2 text-center py-12 text-gray-500">
                      {scenarios.length === 0 
                        ? "No playbooks available yet. Create your first playbook to get started."
                        : `No ${selectedCategory} playbooks available. Select a different category.`}
                    </div>
                  )}
                  
                  {!isLoading && !isError && filteredScenariosData.map((scenario) => {
                    const readinessColor = scenario.readinessState === 'green' ? 'text-green-500' : 
                                          scenario.readinessState === 'yellow' ? 'text-yellow-500' : 'text-red-500';
                    const readinessBg = scenario.readinessState === 'green' ? 'bg-green-50 dark:bg-green-900/20 border-green-200' : 
                                       scenario.readinessState === 'yellow' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200' : 
                                       'bg-red-50 dark:bg-red-900/20 border-red-200';
                                       
                    return (
                      <Card key={scenario.id} className={`bg-white/90 dark:bg-slate-800/90 backdrop-blur hover:shadow-lg transition-shadow border-l-4 ${scenario.readinessState === 'green' ? 'border-l-green-500' : scenario.readinessState === 'yellow' ? 'border-l-yellow-500' : 'border-l-red-500'}`}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center gap-2">
                              <CircleDot className={`w-5 h-5 ${readinessColor}`} />
                              {scenario.title || scenario.name}
                            </CardTitle>
                            <Badge 
                              variant={scenario.readinessState === 'green' ? 'default' : scenario.readinessState === 'yellow' ? 'secondary' : 'destructive'}
                              className="text-xs"
                              data-testid={`badge-readiness-${scenario.id}`}
                            >
                              {scenario.readinessState === 'green' ? '✓ Ready' : 
                               scenario.readinessState === 'yellow' ? '⚠ Needs Review' : 
                               '✗ Requires Setup'}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400">{scenario.description}</p>
                          
                          {/* NFL-Style Readiness Indicators */}
                          <div className={`p-3 rounded-lg border ${readinessBg}`}>
                            <div className="grid grid-cols-2 gap-3 text-xs">
                              {/* Last Drill Date */}
                              <div className="flex items-center gap-2">
                                <Calendar className="w-3 h-3" />
                                <div>
                                  <div className="text-gray-500">Last Drill</div>
                                  <div className="font-semibold">
                                    {scenario.lastDrillDate 
                                      ? formatDistanceToNow(new Date(scenario.lastDrillDate), { addSuffix: true })
                                      : 'Never practiced'}
                                  </div>
                                </div>
                              </div>
                              
                              {/* Automation Coverage */}
                              <div className="flex items-center gap-2">
                                <Percent className="w-3 h-3" />
                                <div>
                                  <div className="text-gray-500">Automated</div>
                                  <div className="font-semibold">
                                    {scenario.automationCoverage 
                                      ? `${Math.round(parseFloat(scenario.automationCoverage) * 100)}%`
                                      : 'Not configured'}
                                  </div>
                                </div>
                              </div>
                              
                              {/* Average Execution Time */}
                              <div className="flex items-center gap-2">
                                <Clock className="w-3 h-3" />
                                <div>
                                  <div className="text-gray-500">Avg Execution</div>
                                  <div className="font-semibold">
                                    {scenario.averageExecutionTime 
                                      ? `${scenario.averageExecutionTime} min`
                                      : scenario.executionCount > 0 ? 'Calculating...' : 'First run'}
                                  </div>
                                </div>
                              </div>
                              
                              {/* Execution Count */}
                              <div className="flex items-center gap-2">
                                <Trophy className="w-3 h-3" />
                                <div>
                                  <div className="text-gray-500">Executions</div>
                                  <div className="font-semibold">
                                    {scenario.executionCount || 0} times
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Approval Status */}
                          {scenario.approvalStatus && (
                            <div className="flex items-center gap-2 text-xs">
                              <CheckCircle className="w-3 h-3 text-green-600" />
                              <span className="text-gray-600">
                                {scenario.approvalStatus === 'approved' 
                                  ? `Approved ${scenario.approvedAt ? formatDistanceToNow(new Date(scenario.approvedAt), { addSuffix: true }) : ''}`
                                  : `Status: ${scenario.approvalStatus}`}
                              </span>
                            </div>
                          )}

                          <div className="flex space-x-2 pt-2">
                            {scenario.isTemplate && selectedCategory === 'templates' ? (
                              <>
                                <Button 
                                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                                  data-testid={`button-import-${scenario.id}`}
                                  onClick={() => importTemplateMutation.mutate(scenario.id)}
                                  disabled={importTemplateMutation.isPending}
                                >
                                  <Rocket className="w-4 h-4 mr-2" />
                                  {importTemplateMutation.isPending ? 'Importing...' : 'Import Template'}
                                </Button>
                                <Button 
                                  variant="outline"
                                  data-testid={`button-preview-${scenario.id}`}
                                >
                                  <FileText className="w-4 h-4 mr-2" />
                                  Preview
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button 
                                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                  data-testid={`button-activate-${scenario.id}`}
                                  disabled={scenario.readinessState === 'red'}
                                  onClick={() => setLocation(`/playbook-activation/manual/${scenario.id}`)}
                                >
                                  <PlayCircle className="w-4 h-4 mr-2" />
                                  {scenario.readinessState === 'red' ? 'Setup Required' : 'Execute Now'}
                                </Button>
                                <Button 
                                  variant="outline"
                                  data-testid={`button-preview-${scenario.id}`}
                                >
                                  <FileText className="w-4 h-4 mr-2" />
                                  Preview
                                </Button>
                              </>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            </div>
          </Tabs>

          {/* AI-Powered Scenario Intelligence */}
          <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900 dark:text-white">
                <Brain className="w-5 h-5 mr-2 text-purple-500" />
                AI-Powered Scenario Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Trigger-Based Intelligence</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">YOU define trigger conditions, AI monitors 24/7 and recommends optimal response strategies with 85-92% success rate</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Instant Activation</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">One-click scenario activation with automated stakeholder notification and resource allocation</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Success Optimization</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Continuous learning from scenario outcomes to optimize future response effectiveness</p>
                </div>
              </div>

              <div className="flex justify-center mt-8">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white" data-testid="button-ai-scenario-builder">
                  <Brain className="w-5 h-5 mr-2" />
                  Launch AI Scenario Builder
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </VeridiusPageLayout>
  );
}