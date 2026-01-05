import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertTriangle, 
  Shield, 
  Truck, 
  DollarSign, 
  Clock, 
  Users, 
  Activity,
  CheckCircle2,
  ArrowRight,
  Zap,
  TrendingUp,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { Link } from 'wouter';

interface CrisisTemplate {
  id: string;
  name: string;
  category: string;
  severity: string;
  typicalTimeframe: string;
  description: string;
  responsePhases: any[];
  escalationTriggers: string[];
}

export default function CrisisResponseDashboard({ organizationId }: { organizationId: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch crisis response templates
  const { data: crisisTemplates = [], isLoading } = useQuery<CrisisTemplate[]>({
    queryKey: ['/api/scenario-templates/crisis'],
  });

  // Fetch active scenarios to show crisis response status
  const { data: activeScenarios = [] } = useQuery<any[]>({
    queryKey: [`/api/crises?organizationId=${organizationId}`],
  });

  // Quick activation mutation for crisis scenarios
  const quickActivateMutation = useMutation({
    mutationFn: async ({ templateId }: { templateId: string }) => {
      const timestamp = new Date().toISOString();
      const template = crisisTemplates.find((t: CrisisTemplate) => t.id === templateId);
      return apiRequest('POST', `/api/scenarios/from-template`, { 
        templateId, 
        customData: { 
          organizationId, 
          name: `CRISIS: ${template?.name} - ${timestamp}`,
          activated_at: timestamp,
          activation_type: 'emergency'
        } 
      });
    },
    onSuccess: () => {
      toast({
        title: 'Crisis Response Activated',
        description: 'Emergency scenario is now active with immediate response protocols',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/scenarios'] });
    },
  });

  const getCrisisIcon = (category: string) => {
    switch (category) {
      case 'security': return <Shield className="h-6 w-6 text-red-600" />;
      case 'supply-chain': return <Truck className="h-6 w-6 text-orange-600" />;
      case 'financial': return <DollarSign className="h-6 w-6 text-yellow-600" />;
      default: return <AlertTriangle className="h-6 w-6 text-red-600" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'catastrophic': return 'border-red-600 bg-red-50 dark:bg-red-900/20';
      case 'severe': return 'border-orange-500 bg-orange-50 dark:bg-orange-900/20';
      case 'significant': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      default: return 'border-gray-300 bg-gray-50 dark:bg-gray-800';
    }
  };

  const activeCrisisScenarios = activeScenarios.filter((s: any) => 
    s.status === 'active' && s.scenario && JSON.parse(s.scenario).activation_type === 'emergency'
  );

  if (isLoading) {
    return <div className="flex items-center justify-center py-8">Loading crisis response systems...</div>;
  }

  return (
    <div className="space-y-6" data-testid="crisis-response-dashboard">
      {/* Crisis Status Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Crisis Response Command Center</h1>
            <p className="text-red-100 mt-1">Enterprise-grade crisis management and immediate response protocols</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{activeCrisisScenarios.length}</div>
            <div className="text-red-100">Active Crisis</div>
          </div>
        </div>
      </div>

      {/* Active Crisis Alert */}
      {activeCrisisScenarios.length > 0 && (
        <Alert className="border-red-500 bg-red-50 dark:bg-red-900/20" data-testid="active-crisis-alert">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <AlertDescription className="text-red-800 dark:text-red-200">
            <div className="font-semibold">Active Crisis Scenarios Detected</div>
            <div className="mt-1">{activeCrisisScenarios.length} emergency scenarios are currently active and require immediate attention</div>
          </AlertDescription>
        </Alert>
      )}

      {/* Active Crisis Scenarios */}
      {activeScenarios.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Active Crisis Scenarios</h2>
            <Badge variant="destructive">{activeScenarios.length} Active</Badge>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {activeScenarios.map((scenario: any) => (
              <Card key={scenario.id} className="border-red-200 bg-red-50 dark:bg-red-900/20 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-red-800 dark:text-red-200">
                        {scenario.title || scenario.name}
                      </CardTitle>
                      <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                        {scenario.organizationId && 'Organization: ' + scenario.organizationId.split('-')[0]}
                      </p>
                    </div>
                    <Badge variant="destructive">
                      {scenario.status?.toUpperCase() || 'ACTIVE'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                    {scenario.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <Clock className="h-3 w-3" />
                    Created {new Date(scenario.createdAt).toLocaleDateString()}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Link href={`/crisis/${scenario.id}`}>
                      <Button className="flex-1" data-testid={`view-crisis-${scenario.id}`}>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Crisis Details
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Crisis Response Templates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {crisisTemplates.map((template: CrisisTemplate) => (
          <Card 
            key={template.id} 
            className={`${getSeverityColor(template.severity)} border-2 hover:shadow-lg transition-all duration-200`}
            data-testid={`crisis-template-${template.id}`}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  {getCrisisIcon(template.category)}
                  <div>
                    <div className="text-lg">{template.name}</div>
                    <div className="text-sm font-normal text-gray-600 dark:text-gray-400 capitalize">
                      {template.category.replace('-', ' ')} Crisis
                    </div>
                  </div>
                </CardTitle>
                <div className="text-right">
                  <Badge variant={template.severity === 'severe' ? 'destructive' : 'secondary'} className="mb-1">
                    {template.severity}
                  </Badge>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {template.typicalTimeframe}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 mb-4">{template.description}</p>
              
              {/* Response Overview */}
              <div className="space-y-3 mb-4">
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Response Phases:</div>
                  <div className="flex items-center gap-2">
                    {template.responsePhases.map((phase: any, index: number) => (
                      <div key={index} className="flex items-center gap-1">
                        <Badge variant="outline" className="text-xs">
                          {phase.phase}
                        </Badge>
                        {index < template.responsePhases.length - 1 && <ArrowRight className="h-3 w-3 text-gray-400" />}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Escalation Triggers:</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {template.escalationTriggers.slice(0, 2).map((trigger, index) => (
                      <div key={index} className="flex items-center gap-1">
                        <AlertCircle className="h-3 w-3 text-orange-500" />
                        {trigger}
                      </div>
                    ))}
                    {template.escalationTriggers.length > 2 && (
                      <div className="text-gray-500 mt-1">+{template.escalationTriggers.length - 2} more triggers</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <Button 
                  variant="destructive" 
                  className="flex-1"
                  onClick={() => quickActivateMutation.mutate({ templateId: template.id })}
                  disabled={quickActivateMutation.isPending}
                  data-testid={`quick-activate-${template.id}`}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  {quickActivateMutation.isPending ? 'Activating...' : 'Emergency Activation'}
                </Button>
                <Button variant="outline" size="sm" data-testid={`view-details-${template.id}`}>
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Crisis Readiness Metrics */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white" data-testid="crisis-readiness-metrics">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Crisis Readiness Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">{crisisTemplates.length}</div>
              <div className="text-blue-100 text-sm">Response Templates</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">24/7</div>
              <div className="text-blue-100 text-sm">Monitoring Status</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">&lt;1hr</div>
              <div className="text-blue-100 text-sm">Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">98%</div>
              <div className="text-blue-100 text-sm">Readiness Score</div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Overall Crisis Preparedness</span>
              <span className="text-sm">98%</span>
            </div>
            <Progress value={98} className="bg-blue-400" />
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact Information */}
      <Card className="border-green-200 bg-green-50 dark:bg-green-900/20" data-testid="emergency-contacts">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
            <Users className="h-5 w-5" />
            Emergency Response Team
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
              <div className="font-semibold">Crisis Commander</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">24/7 Emergency Line</div>
              <Button variant="outline" size="sm" className="mt-2" data-testid="contact-crisis-commander">
                Contact Now
              </Button>
            </div>
            <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
              <div className="font-semibold">Legal Counsel</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Regulatory & Compliance</div>
              <Button variant="outline" size="sm" className="mt-2" data-testid="contact-legal">
                Contact Now
              </Button>
            </div>
            <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
              <div className="font-semibold">Communications Lead</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Media & Stakeholder</div>
              <Button variant="outline" size="sm" className="mt-2" data-testid="contact-communications">
                Contact Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}