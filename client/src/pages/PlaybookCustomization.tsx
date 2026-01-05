import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Link } from 'wouter';
import PageLayout from '@/components/layout/PageLayout';
import { 
  BookOpen,
  Copy,
  Edit,
  Users,
  DollarSign,
  Clock,
  Shield,
  Target,
  ArrowLeft,
  Home,
  Save,
  Check,
  ChevronRight,
  Play,
  Settings,
  AlertTriangle,
  Plus,
  Trash2,
  Search,
  Filter,
  Zap,
  TrendingUp
} from 'lucide-react';

interface PlaybookTemplate {
  id: string;
  name: string;
  category: string;
  domain: string;
  description: string;
  estimatedDuration: string;
  complexity: 'low' | 'medium' | 'high';
  stakeholderCount: number;
  tasks: number;
}

interface CustomizedPlaybook {
  id: string;
  templateId: string;
  name: string;
  description: string;
  budgetLimit: number;
  approvalRequired: boolean;
  stakeholderAssignments: Array<{
    role: string;
    assignedTo: string;
    approvalAuthority: number;
  }>;
  customTasks: string[];
  notificationPreferences: {
    onActivation: boolean;
    onTaskComplete: boolean;
    onEscalation: boolean;
  };
}

const PLAYBOOK_DOMAINS = [
  { id: 'crisis', name: 'Crisis Management', icon: AlertTriangle, color: 'text-red-500' },
  { id: 'competitive', name: 'Competitive Response', icon: Target, color: 'text-purple-500' },
  { id: 'market', name: 'Market Opportunity', icon: TrendingUp, color: 'text-blue-500' },
  { id: 'regulatory', name: 'Regulatory Compliance', icon: Shield, color: 'text-orange-500' },
  { id: 'technology', name: 'Technology', icon: Zap, color: 'text-cyan-500' },
  { id: 'talent', name: 'Talent & Workforce', icon: Users, color: 'text-pink-500' },
  { id: 'financial', name: 'Financial Response', icon: DollarSign, color: 'text-green-500' },
  { id: 'operational', name: 'Operational Excellence', icon: Settings, color: 'text-indigo-500' },
];

const SAMPLE_TEMPLATES: PlaybookTemplate[] = [
  { id: '1', name: 'Supply Chain Disruption Response', category: 'crisis', domain: 'operations', description: 'Rapid response playbook for supply chain disruptions including supplier failure, logistics issues, or natural disasters', estimatedDuration: '4-12 hours', complexity: 'high', stakeholderCount: 12, tasks: 24 },
  { id: '2', name: 'Competitive Pricing Response', category: 'competitive', domain: 'market', description: 'Quick response to aggressive competitor pricing moves or market share threats', estimatedDuration: '2-4 hours', complexity: 'medium', stakeholderCount: 8, tasks: 16 },
  { id: '3', name: 'Cybersecurity Incident Response', category: 'crisis', domain: 'technology', description: 'Comprehensive response to security breaches, ransomware, or data compromise', estimatedDuration: '1-24 hours', complexity: 'high', stakeholderCount: 15, tasks: 32 },
  { id: '4', name: 'Product Recall Execution', category: 'crisis', domain: 'operations', description: 'Coordinated product recall with regulatory notification, customer communication, and logistics', estimatedDuration: '24-72 hours', complexity: 'high', stakeholderCount: 20, tasks: 45 },
  { id: '5', name: 'Market Entry Acceleration', category: 'market', domain: 'strategy', description: 'Rapid deployment playbook for entering new markets or launching products', estimatedDuration: '2-4 weeks', complexity: 'high', stakeholderCount: 18, tasks: 38 },
  { id: '6', name: 'Regulatory Compliance Response', category: 'regulatory', domain: 'compliance', description: 'Response to new regulations, audit findings, or compliance gaps', estimatedDuration: '1-2 weeks', complexity: 'medium', stakeholderCount: 10, tasks: 20 },
  { id: '7', name: 'Talent Retention Crisis', category: 'talent', domain: 'hr', description: 'Response to key talent departures or retention challenges', estimatedDuration: '1-4 weeks', complexity: 'medium', stakeholderCount: 8, tasks: 18 },
  { id: '8', name: 'Financial Liquidity Response', category: 'financial', domain: 'finance', description: 'Emergency response to cash flow challenges or financial stress', estimatedDuration: '24-48 hours', complexity: 'high', stakeholderCount: 12, tasks: 25 },
];

export default function PlaybookCustomization() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [isCustomizationDialogOpen, setIsCustomizationDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<PlaybookTemplate | null>(null);
  
  // Customization form state
  const [customName, setCustomName] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [budgetLimit, setBudgetLimit] = useState('');
  const [approvalRequired, setApprovalRequired] = useState(true);
  const [customizationStep, setCustomizationStep] = useState(1);
  
  // Stakeholder assignments
  const [stakeholderAssignments, setStakeholderAssignments] = useState<Array<{role: string; assignedTo: string; approvalAuthority: number}>>([]);
  
  // Fetch playbooks from API
  const { data: playbooks, isLoading } = useQuery({
    queryKey: ['/api/playbooks'],
  });
  
  // Mutation for saving customized playbooks
  const savePlaybookMutation = useMutation({
    mutationFn: async (customizedPlaybook: CustomizedPlaybook) => {
      return apiRequest('POST', '/api/scenarios', {
        title: customizedPlaybook.name,
        description: customizedPlaybook.description,
        category: selectedTemplate?.category || 'custom',
        status: 'preparing',
        budgetLimit: customizedPlaybook.budgetLimit,
        approvalRequired: customizedPlaybook.approvalRequired,
        stakeholderAssignments: customizedPlaybook.stakeholderAssignments,
        notificationPreferences: customizedPlaybook.notificationPreferences,
        templateId: customizedPlaybook.templateId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/playbooks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/scenarios'] });
      toast({ 
        title: 'Playbook Customized', 
        description: `"${customName}" has been saved to your organization's playbook library`,
      });
      setIsCustomizationDialogOpen(false);
      setSelectedTemplate(null);
    },
    onError: () => {
      toast({ 
        title: 'Error', 
        description: 'Failed to save playbook customization. Please try again.',
        variant: 'destructive',
      });
    },
  });
  
  const templates = Array.isArray(playbooks) && playbooks.length > 0 
    ? playbooks.map((p: any) => ({
        id: p.id,
        name: p.name || p.title,
        category: p.category || 'general',
        domain: p.domain || 'general',
        description: p.description || '',
        estimatedDuration: p.estimatedDuration || '4-12 hours',
        complexity: p.complexity || 'medium',
        stakeholderCount: p.stakeholderCount || 10,
        tasks: p.tasksCount || 20,
      }))
    : SAMPLE_TEMPLATES;
  
  const filteredTemplates = templates.filter((template: PlaybookTemplate) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDomain = selectedDomain === 'all' || template.category === selectedDomain;
    return matchesSearch && matchesDomain;
  });
  
  const handleStartCustomization = (template: PlaybookTemplate) => {
    setSelectedTemplate(template);
    setCustomName(template.name);
    setCustomDescription(template.description);
    setStakeholderAssignments([
      { role: 'Executive Sponsor', assignedTo: '', approvalAuthority: 1000000 },
      { role: 'Decision Maker', assignedTo: '', approvalAuthority: 500000 },
      { role: 'Primary Executor', assignedTo: '', approvalAuthority: 100000 },
    ]);
    setCustomizationStep(1);
    setIsCustomizationDialogOpen(true);
  };
  
  const handleSaveCustomization = () => {
    if (!customName) {
      toast({ title: 'Error', description: 'Playbook name is required', variant: 'destructive' });
      return;
    }
    
    const customizedPlaybook: CustomizedPlaybook = {
      id: `custom-${Date.now()}`,
      templateId: selectedTemplate?.id || '',
      name: customName,
      description: customDescription,
      budgetLimit: budgetLimit ? parseFloat(budgetLimit) : 0,
      approvalRequired,
      stakeholderAssignments,
      customTasks: [],
      notificationPreferences: {
        onActivation: true,
        onTaskComplete: true,
        onEscalation: true,
      },
    };
    
    savePlaybookMutation.mutate(customizedPlaybook);
  };
  
  const addStakeholderRole = () => {
    setStakeholderAssignments([
      ...stakeholderAssignments,
      { role: '', assignedTo: '', approvalAuthority: 50000 }
    ]);
  };
  
  const removeStakeholderRole = (index: number) => {
    setStakeholderAssignments(stakeholderAssignments.filter((_, i) => i !== index));
  };
  
  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <PageLayout>
      <div className="page-background min-h-screen bg-transparent p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Breadcrumb Navigation */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Link to="/">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-1 h-auto">
                  <Home className="h-4 w-4" />
                </Button>
              </Link>
              <span>/</span>
              <span>Configuration</span>
              <span>/</span>
              <span className="text-white">Playbook Customization</span>
            </div>
          </div>

          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold" data-testid="playbook-customization-title">Playbook Customization</h1>
                  <p className="text-emerald-100 mt-1">Clone templates and customize for YOUR organization</p>
                  <p className="text-emerald-200 mt-1 text-sm">Assign your stakeholders, set budgets, and configure execution parameters</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Link to="/">
                  <Button variant="secondary" className="bg-emerald-700 hover:bg-emerald-800 text-emerald-100 border-emerald-600">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Templates</p>
                    <p className="text-2xl font-bold text-white">{templates.length}</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-emerald-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Customized</p>
                    <p className="text-2xl font-bold text-white">3</p>
                  </div>
                  <Edit className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Active</p>
                    <p className="text-2xl font-bold text-white">2</p>
                  </div>
                  <Play className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Domains</p>
                    <p className="text-2xl font-bold text-white">8</p>
                  </div>
                  <Target className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search playbook templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800/50 border-gray-700"
                data-testid="input-search-playbooks"
              />
            </div>
            <Select value={selectedDomain} onValueChange={setSelectedDomain}>
              <SelectTrigger className="w-48 bg-gray-800/50 border-gray-700">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="All Domains" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Domains</SelectItem>
                {PLAYBOOK_DOMAINS.map((domain) => (
                  <SelectItem key={domain.id} value={domain.id}>{domain.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Domain Quick Filters */}
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={selectedDomain === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedDomain('all')}
              className="gap-2"
            >
              All
            </Button>
            {PLAYBOOK_DOMAINS.map((domain) => {
              const Icon = domain.icon;
              return (
                <Button 
                  key={domain.id}
                  variant={selectedDomain === domain.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedDomain(domain.id)}
                  className="gap-2"
                >
                  <Icon className={`h-4 w-4 ${domain.color}`} />
                  {domain.name}
                </Button>
              );
            })}
          </div>

          {/* Playbook Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template: PlaybookTemplate) => (
              <Card key={template.id} className="bg-gray-800/50 border-gray-700 hover:border-emerald-500/50 transition-all">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-white text-lg">{template.name}</CardTitle>
                      <CardDescription className="mt-1 text-gray-400 line-clamp-2">
                        {template.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getComplexityColor(template.complexity)}>
                      {template.complexity} complexity
                    </Badge>
                    <Badge variant="outline" className="text-gray-400">
                      {template.category}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="flex items-center gap-1 text-gray-400">
                      <Clock className="h-4 w-4" />
                      <span>{template.estimatedDuration}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Users className="h-4 w-4" />
                      <span>{template.stakeholderCount}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Target className="h-4 w-4" />
                      <span>{template.tasks} tasks</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => handleStartCustomization(template)}
                    data-testid={`button-customize-${template.id}`}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Clone & Customize
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-12 text-center">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No Playbooks Found</h3>
                <p className="text-gray-400">Try adjusting your search or filter criteria</p>
              </CardContent>
            </Card>
          )}

          {/* Customization Dialog */}
          <Dialog open={isCustomizationDialogOpen} onOpenChange={setIsCustomizationDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Copy className="h-5 w-5 text-emerald-500" />
                  Customize Playbook
                </DialogTitle>
                <DialogDescription>
                  Customize "{selectedTemplate?.name}" for your organization
                </DialogDescription>
              </DialogHeader>
              
              {/* Step Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Step {customizationStep} of 3</span>
                </div>
                <Progress value={(customizationStep / 3) * 100} className="h-2" />
                <div className="flex justify-between mt-2">
                  <span className={`text-xs ${customizationStep >= 1 ? 'text-emerald-500' : 'text-gray-500'}`}>Details</span>
                  <span className={`text-xs ${customizationStep >= 2 ? 'text-emerald-500' : 'text-gray-500'}`}>Stakeholders</span>
                  <span className={`text-xs ${customizationStep >= 3 ? 'text-emerald-500' : 'text-gray-500'}`}>Settings</span>
                </div>
              </div>
              
              {/* Step 1: Basic Details */}
              {customizationStep === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Playbook Name *</Label>
                    <Input 
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="Enter playbook name"
                      data-testid="input-custom-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea 
                      value={customDescription}
                      onChange={(e) => setCustomDescription(e.target.value)}
                      placeholder="Describe this playbook..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Budget Limit ($)</Label>
                    <Input 
                      type="number"
                      value={budgetLimit}
                      onChange={(e) => setBudgetLimit(e.target.value)}
                      placeholder="e.g., 500000"
                    />
                    <p className="text-xs text-gray-500">Maximum budget that can be authorized during playbook execution</p>
                  </div>
                </div>
              )}
              
              {/* Step 2: Stakeholder Assignments */}
              {customizationStep === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-lg">Assign Stakeholders</Label>
                    <Button variant="outline" size="sm" onClick={addStakeholderRole}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Role
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">Assign people from your organization to each role in this playbook</p>
                  
                  <div className="space-y-3">
                    {stakeholderAssignments.map((assignment, idx) => (
                      <Card key={idx} className="bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="flex-1 grid grid-cols-3 gap-3">
                              <div className="space-y-1">
                                <Label className="text-xs">Role</Label>
                                <Input 
                                  value={assignment.role}
                                  onChange={(e) => {
                                    const updated = [...stakeholderAssignments];
                                    updated[idx].role = e.target.value;
                                    setStakeholderAssignments(updated);
                                  }}
                                  placeholder="e.g., Executive Sponsor"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">Assigned To</Label>
                                <Input 
                                  value={assignment.assignedTo}
                                  onChange={(e) => {
                                    const updated = [...stakeholderAssignments];
                                    updated[idx].assignedTo = e.target.value;
                                    setStakeholderAssignments(updated);
                                  }}
                                  placeholder="Name or email"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">Approval Limit ($)</Label>
                                <Input 
                                  type="number"
                                  value={assignment.approvalAuthority}
                                  onChange={(e) => {
                                    const updated = [...stakeholderAssignments];
                                    updated[idx].approvalAuthority = parseInt(e.target.value) || 0;
                                    setStakeholderAssignments(updated);
                                  }}
                                />
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => removeStakeholderRole(idx)}
                              className="text-gray-400 hover:text-red-500 mt-5"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Step 3: Execution Settings */}
              {customizationStep === 3 && (
                <div className="space-y-4">
                  <Label className="text-lg">Execution Settings</Label>
                  <p className="text-sm text-gray-500">Configure how this playbook should be executed when activated</p>
                  
                  <Card className="bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <CardContent className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Require Approval Before Activation</p>
                          <p className="text-sm text-gray-500">Playbook must be approved by designated stakeholder before tasks begin</p>
                        </div>
                        <Switch checked={approvalRequired} onCheckedChange={setApprovalRequired} />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Notify on Activation</p>
                          <p className="text-sm text-gray-500">Send notifications when playbook is activated</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Notify on Task Completion</p>
                          <p className="text-sm text-gray-500">Send notifications as tasks are completed</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Auto-Escalate Blocked Tasks</p>
                          <p className="text-sm text-gray-500">Automatically escalate if tasks are blocked for too long</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Summary */}
                  <Card className="bg-emerald-500/10 border-emerald-500/30">
                    <CardContent className="p-4">
                      <h4 className="font-medium text-emerald-400 mb-2">Customization Summary</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-gray-400">Playbook Name:</div>
                        <div className="text-white">{customName}</div>
                        <div className="text-gray-400">Budget Limit:</div>
                        <div className="text-white">${parseInt(budgetLimit || '0').toLocaleString()}</div>
                        <div className="text-gray-400">Stakeholders:</div>
                        <div className="text-white">{stakeholderAssignments.length} assigned</div>
                        <div className="text-gray-400">Approval Required:</div>
                        <div className="text-white">{approvalRequired ? 'Yes' : 'No'}</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              <DialogFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    if (customizationStep > 1) {
                      setCustomizationStep(customizationStep - 1);
                    } else {
                      setIsCustomizationDialogOpen(false);
                    }
                  }}
                >
                  {customizationStep === 1 ? 'Cancel' : 'Back'}
                </Button>
                <Button 
                  onClick={() => {
                    if (customizationStep < 3) {
                      setCustomizationStep(customizationStep + 1);
                    } else {
                      handleSaveCustomization();
                    }
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700"
                  data-testid="button-next-step"
                  disabled={customizationStep === 3 && savePlaybookMutation.isPending}
                >
                  {customizationStep === 3 ? (
                    savePlaybookMutation.isPending ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Playbook
                      </>
                    )
                  ) : (
                    <>
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
        </div>
      </div>
    </PageLayout>
  );
}