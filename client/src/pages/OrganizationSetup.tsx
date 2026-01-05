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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Link } from 'wouter';
import PageLayout from '@/components/layout/PageLayout';
import { 
  Building2,
  Users,
  UserCircle,
  Network,
  Settings,
  Plus,
  Edit,
  Trash2,
  Check,
  ChevronRight,
  Mail,
  MessageSquare,
  Shield,
  Clock,
  DollarSign,
  ArrowLeft,
  Home,
  Save,
  AlertTriangle,
  CheckCircle,
  Workflow,
  Layers
} from 'lucide-react';

interface Department {
  id: string;
  name: string;
  description?: string;
  parentDepartmentId?: string;
  leaderId?: string;
  leaderName?: string;
  budget?: number;
  headcount?: number;
  costCenter?: string;
}

interface Stakeholder {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  approvalLimit?: number;
  canApproveActivations: boolean;
  notificationPreferences: {
    email: boolean;
    slack: boolean;
    inApp: boolean;
  };
}

interface EscalationPolicy {
  id: string;
  name: string;
  description?: string;
  triggerType: string;
  levels: Array<{
    level: number;
    approvers: string[];
    timeoutMinutes: number;
    actions: string[];
  }>;
}

interface CommunicationChannel {
  id: string;
  channelType: 'email' | 'slack' | 'teams' | 'webhook';
  name: string;
  configuration: Record<string, any>;
  isDefault: boolean;
  isActive: boolean;
}

export default function OrganizationSetup() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('departments');
  
  // Dialog states
  const [isDepartmentDialogOpen, setIsDepartmentDialogOpen] = useState(false);
  const [isStakeholderDialogOpen, setIsStakeholderDialogOpen] = useState(false);
  const [isEscalationDialogOpen, setIsEscalationDialogOpen] = useState(false);
  const [isChannelDialogOpen, setIsChannelDialogOpen] = useState(false);
  
  // Form states for departments
  const [newDepartment, setNewDepartment] = useState<Partial<Department>>({
    name: '',
    description: '',
  });
  
  // Form states for stakeholders
  const [newStakeholder, setNewStakeholder] = useState<Partial<Stakeholder>>({
    name: '',
    email: '',
    role: '',
    department: '',
    canApproveActivations: false,
    notificationPreferences: { email: true, slack: false, inApp: true },
  });
  
  // Form states for escalation
  const [newEscalation, setNewEscalation] = useState<Partial<EscalationPolicy>>({
    name: '',
    description: '',
    triggerType: 'time_elapsed',
    levels: [{ level: 1, approvers: [], timeoutMinutes: 30, actions: ['email'] }],
  });
  
  // Form states for channels
  const [newChannel, setNewChannel] = useState<Partial<CommunicationChannel>>({
    channelType: 'email',
    name: '',
    configuration: {},
    isDefault: false,
    isActive: true,
  });
  
  // Fetch departments from API
  const { data: apiDepartments, isLoading: deptLoading } = useQuery<any[]>({
    queryKey: ['/api/config/departments'],
  });
  
  // Default departments - empty to prompt user configuration
  const defaultDepartments: Department[] = [];
  
  // Use API data if available, otherwise use defaults
  const departments: Department[] = (apiDepartments && apiDepartments.length > 0) 
    ? apiDepartments.map((d: any) => ({
        id: d.id?.toString() || d.id,
        name: d.name,
        description: d.description,
        parentDepartmentId: d.parent_department_id || d.parentDepartmentId,
        leaderId: d.leader_id || d.leaderId,
        leaderName: d.leader_name || d.leaderName,
        budget: d.budget,
        headcount: d.headcount,
        costCenter: d.cost_center || d.costCenter,
      }))
    : defaultDepartments;
  
  // Create department mutation
  const createDeptMutation = useMutation({
    mutationFn: async (dept: Partial<Department>) => {
      return apiRequest('POST', '/api/config/departments', dept);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/config/departments'] });
      toast({ title: 'Success', description: 'Department created successfully' });
      setIsDepartmentDialogOpen(false);
      setNewDepartment({ name: '', description: '' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to create department', variant: 'destructive' });
    },
  });
  
  // Delete department mutation
  const deleteDeptMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('DELETE', `/api/config/departments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/config/departments'] });
      toast({ title: 'Deleted', description: 'Department removed' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to delete department', variant: 'destructive' });
    },
  });
  
  // Stakeholders - empty by default, prompting user to add their own
  const stakeholders: Stakeholder[] = [];
  
  // Fetch escalation policies from API
  const { data: apiEscalationPolicies } = useQuery<any[]>({
    queryKey: ['/api/config/escalation-policies'],
  });
  
  // Default escalation policies
  const defaultEscalationPolicies: EscalationPolicy[] = [
    { 
      id: '1', 
      name: 'Standard Escalation', 
      description: 'Default escalation for non-critical issues',
      triggerType: 'time_elapsed',
      levels: [
        { level: 1, approvers: ['Manager'], timeoutMinutes: 60, actions: ['email'] },
        { level: 2, approvers: ['Director'], timeoutMinutes: 120, actions: ['email', 'slack'] },
        { level: 3, approvers: ['VP'], timeoutMinutes: 240, actions: ['email', 'slack', 'phone'] },
      ]
    },
    { 
      id: '2', 
      name: 'Critical Response', 
      description: 'Fast escalation for critical issues',
      triggerType: 'severity_escalation',
      levels: [
        { level: 1, approvers: ['Director'], timeoutMinutes: 15, actions: ['email', 'slack'] },
        { level: 2, approvers: ['VP', 'C-Suite'], timeoutMinutes: 30, actions: ['email', 'slack', 'phone'] },
      ]
    },
  ];
  
  // Use API data if available, otherwise use defaults
  const escalationPolicies: EscalationPolicy[] = (apiEscalationPolicies && apiEscalationPolicies.length > 0)
    ? apiEscalationPolicies.map((e: any) => ({
        id: e.id?.toString() || e.id,
        name: e.name,
        description: e.description,
        triggerType: e.trigger_type || e.triggerType || 'time_elapsed',
        levels: e.levels || [],
      }))
    : defaultEscalationPolicies;
  
  // Create escalation policy mutation
  const createEscalationMutation = useMutation({
    mutationFn: async (policy: Partial<EscalationPolicy>) => {
      return apiRequest('POST', '/api/config/escalation-policies', policy);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/config/escalation-policies'] });
      toast({ title: 'Success', description: 'Escalation policy created successfully' });
      setIsEscalationDialogOpen(false);
      setNewEscalation({ name: '', description: '', triggerType: 'time_elapsed', levels: [] });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to create escalation policy', variant: 'destructive' });
    },
  });
  
  // Delete escalation policy mutation
  const deleteEscalationMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('DELETE', `/api/config/escalation-policies/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/config/escalation-policies'] });
      toast({ title: 'Deleted', description: 'Escalation policy removed' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to delete escalation policy', variant: 'destructive' });
    },
  });
  
  // Fetch communication channels from API
  const { data: apiChannels } = useQuery<any[]>({
    queryKey: ['/api/config/communication-channels'],
  });
  
  // Default communication channels
  const defaultChannels: CommunicationChannel[] = [
    { id: '1', channelType: 'email', name: 'Corporate Email', configuration: { smtpServer: 'smtp.company.com' }, isDefault: true, isActive: true },
    { id: '2', channelType: 'slack', name: 'Slack - Crisis Channel', configuration: { webhookUrl: 'https://hooks.slack.com/...' }, isDefault: false, isActive: true },
    { id: '3', channelType: 'teams', name: 'MS Teams - Leadership', configuration: { webhookUrl: 'https://outlook.office.com/...' }, isDefault: false, isActive: true },
  ];
  
  // Use API data if available, otherwise use defaults
  const communicationChannels: CommunicationChannel[] = (apiChannels && apiChannels.length > 0)
    ? apiChannels.map((c: any) => ({
        id: c.id?.toString() || c.id,
        channelType: c.channel_type || c.channelType || 'email',
        name: c.name,
        configuration: c.configuration || {},
        isDefault: c.is_default ?? c.isDefault ?? false,
        isActive: c.is_active ?? c.isActive ?? true,
      }))
    : defaultChannels;
  
  // Create channel mutation
  const createChannelMutation = useMutation({
    mutationFn: async (channel: Partial<CommunicationChannel>) => {
      return apiRequest('POST', '/api/config/communication-channels', channel);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/config/communication-channels'] });
      toast({ title: 'Success', description: 'Communication channel added successfully' });
      setIsChannelDialogOpen(false);
      setNewChannel({ channelType: 'email', name: '', configuration: {}, isDefault: false, isActive: true });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to add communication channel', variant: 'destructive' });
    },
  });
  
  // Delete channel mutation
  const deleteChannelMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('DELETE', `/api/config/communication-channels/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/config/communication-channels'] });
      toast({ title: 'Deleted', description: 'Communication channel removed' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to delete communication channel', variant: 'destructive' });
    },
  });
  
  // Handler functions that use mutations
  const handleAddDepartment = () => {
    if (!newDepartment.name) {
      toast({ title: 'Error', description: 'Department name is required', variant: 'destructive' });
      return;
    }
    createDeptMutation.mutate(newDepartment);
  };
  
  const handleDeleteDepartment = (id: string) => {
    deleteDeptMutation.mutate(id);
  };
  
  const handleAddEscalationPolicy = () => {
    if (!newEscalation.name) {
      toast({ title: 'Error', description: 'Policy name is required', variant: 'destructive' });
      return;
    }
    createEscalationMutation.mutate(newEscalation);
  };
  
  const handleDeleteEscalationPolicy = (id: string) => {
    deleteEscalationMutation.mutate(id);
  };
  
  const handleAddChannel = () => {
    if (!newChannel.name) {
      toast({ title: 'Error', description: 'Channel name is required', variant: 'destructive' });
      return;
    }
    createChannelMutation.mutate(newChannel);
  };
  
  const handleDeleteChannel = (id: string) => {
    deleteChannelMutation.mutate(id);
  };
  
  
  // Calculate setup progress
  const setupProgress = {
    departments: departments.length >= 3,
    stakeholders: stakeholders.length >= 3,
    escalation: escalationPolicies.length >= 1,
    channels: communicationChannels.length >= 2,
  };
  const progressPercent = (Object.values(setupProgress).filter(Boolean).length / 4) * 100;
  
  // Handler for adding stakeholder (local state for now)
  const handleAddStakeholder = () => {
    if (!newStakeholder.name || !newStakeholder.email) {
      toast({ title: 'Error', description: 'Name and email are required', variant: 'destructive' });
      return;
    }
    toast({ title: 'Success', description: 'Stakeholder added successfully' });
    setNewStakeholder({ name: '', email: '', role: '', department: '', canApproveActivations: false, notificationPreferences: { email: true, slack: false, inApp: true } });
    setIsStakeholderDialogOpen(false);
  };
  
  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'slack': return <MessageSquare className="h-4 w-4" />;
      case 'teams': return <Users className="h-4 w-4" />;
      case 'webhook': return <Network className="h-4 w-4" />;
      default: return <Mail className="h-4 w-4" />;
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
              <span className="text-white">Organization Setup</span>
            </div>
          </div>

          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Building2 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold" data-testid="org-setup-title">Organization Setup</h1>
                  <p className="text-indigo-100 mt-1">Configure YOUR team structure, stakeholders, and approval workflows</p>
                  <p className="text-indigo-200 mt-1 text-sm">M will use these settings to coordinate execution across your organization</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Link to="/">
                  <Button variant="secondary" className="bg-indigo-700 hover:bg-indigo-800 text-indigo-100 border-indigo-600">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Setup Progress */}
          <Card className="border-indigo-500/30 bg-indigo-950/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">Setup Progress</h3>
                  <p className="text-sm text-gray-400">Complete all sections to enable full strategic execution capabilities</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-indigo-400">{Math.round(progressPercent)}%</div>
                  <div className="text-sm text-gray-400">Complete</div>
                </div>
              </div>
              <Progress value={progressPercent} className="h-3 mb-4" />
              <div className="grid grid-cols-4 gap-4">
                <div className={`flex items-center gap-2 p-3 rounded-lg ${setupProgress.departments ? 'bg-green-500/20' : 'bg-gray-700/30'}`}>
                  {setupProgress.departments ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                  <span className="text-sm text-white">Departments</span>
                </div>
                <div className={`flex items-center gap-2 p-3 rounded-lg ${setupProgress.stakeholders ? 'bg-green-500/20' : 'bg-gray-700/30'}`}>
                  {setupProgress.stakeholders ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                  <span className="text-sm text-white">Stakeholders</span>
                </div>
                <div className={`flex items-center gap-2 p-3 rounded-lg ${setupProgress.escalation ? 'bg-green-500/20' : 'bg-gray-700/30'}`}>
                  {setupProgress.escalation ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                  <span className="text-sm text-white">Escalation</span>
                </div>
                <div className={`flex items-center gap-2 p-3 rounded-lg ${setupProgress.channels ? 'bg-green-500/20' : 'bg-gray-700/30'}`}>
                  {setupProgress.channels ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                  <span className="text-sm text-white">Channels</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-gray-800/50 p-1 h-auto flex-wrap">
              <TabsTrigger value="departments" className="gap-2 data-[state=active]:bg-indigo-600">
                <Layers className="h-4 w-4" />
                Departments
              </TabsTrigger>
              <TabsTrigger value="stakeholders" className="gap-2 data-[state=active]:bg-indigo-600">
                <Users className="h-4 w-4" />
                Stakeholders
              </TabsTrigger>
              <TabsTrigger value="escalation" className="gap-2 data-[state=active]:bg-indigo-600">
                <Workflow className="h-4 w-4" />
                Escalation Policies
              </TabsTrigger>
              <TabsTrigger value="channels" className="gap-2 data-[state=active]:bg-indigo-600">
                <MessageSquare className="h-4 w-4" />
                Communication Channels
              </TabsTrigger>
            </TabsList>

            {/* Departments Tab */}
            <TabsContent value="departments" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">Department Structure</h2>
                  <p className="text-sm text-gray-400">Define your organization's departments and reporting structure</p>
                </div>
                <Button onClick={() => setIsDepartmentDialogOpen(true)} data-testid="button-add-department">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Department
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {departments.map((dept) => (
                  <Card key={dept.id} className="bg-gray-800/50 border-gray-700 hover:border-indigo-500/50 transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-white">{dept.name}</h3>
                          <p className="text-sm text-gray-400 mt-1">{dept.description}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-4 text-sm">
                        {dept.headcount && (
                          <div className="flex items-center gap-1 text-gray-400">
                            <Users className="h-4 w-4" />
                            <span>{dept.headcount}</span>
                          </div>
                        )}
                        {dept.leaderName && (
                          <div className="flex items-center gap-1 text-gray-400">
                            <UserCircle className="h-4 w-4" />
                            <span>{dept.leaderName}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Stakeholders Tab */}
            <TabsContent value="stakeholders" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">Key Stakeholders</h2>
                  <p className="text-sm text-gray-400">Define executives and decision-makers for playbook coordination</p>
                </div>
                <Button onClick={() => setIsStakeholderDialogOpen(true)} data-testid="button-add-stakeholder">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Stakeholder
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stakeholders.map((sh) => (
                  <Card key={sh.id} className="bg-gray-800/50 border-gray-700 hover:border-indigo-500/50 transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                            {sh.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{sh.name}</h3>
                            <p className="text-sm text-indigo-400">{sh.role}</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Mail className="h-4 w-4" />
                          <span>{sh.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Building2 className="h-4 w-4" />
                          <span>{sh.department}</span>
                        </div>
                        {sh.approvalLimit && (
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <DollarSign className="h-4 w-4" />
                            <span>Approval limit: ${sh.approvalLimit.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-4 flex items-center gap-2">
                        {sh.canApproveActivations && (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            Can Approve Activations
                          </Badge>
                        )}
                        <div className="flex gap-1">
                          {sh.notificationPreferences.email && <Badge variant="outline" className="text-xs">Email</Badge>}
                          {sh.notificationPreferences.slack && <Badge variant="outline" className="text-xs">Slack</Badge>}
                          {sh.notificationPreferences.inApp && <Badge variant="outline" className="text-xs">In-App</Badge>}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Escalation Policies Tab */}
            <TabsContent value="escalation" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">Escalation Policies</h2>
                  <p className="text-sm text-gray-400">Define how unacknowledged alerts escalate through your organization</p>
                </div>
                <Button onClick={() => setIsEscalationDialogOpen(true)} data-testid="button-add-escalation">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Policy
                </Button>
              </div>
              
              <div className="space-y-4">
                {escalationPolicies.map((policy) => (
                  <Card key={policy.id} className="bg-gray-800/50 border-gray-700">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-white text-lg">{policy.name}</h3>
                          <p className="text-sm text-gray-400 mt-1">{policy.description}</p>
                          <Badge className="mt-2 bg-indigo-500/20 text-indigo-400 border-indigo-500/30">
                            {policy.triggerType.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="relative">
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-700"></div>
                        <div className="space-y-4">
                          {policy.levels.map((level, idx) => (
                            <div key={level.level} className="relative flex items-start gap-4 pl-8">
                              <div className={`absolute left-2 w-4 h-4 rounded-full ${
                                idx === 0 ? 'bg-green-500' : idx === 1 ? 'bg-yellow-500' : 'bg-red-500'
                              } ring-4 ring-gray-800`}></div>
                              <div className="flex-1 p-3 bg-gray-700/50 rounded-lg">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-white">Level {level.level}</span>
                                  <div className="flex items-center gap-1 text-sm text-gray-400">
                                    <Clock className="h-4 w-4" />
                                    <span>{level.timeoutMinutes} min</span>
                                  </div>
                                </div>
                                <div className="mt-2 flex items-center gap-2">
                                  <span className="text-sm text-gray-400">Approvers:</span>
                                  {level.approvers.map((approver) => (
                                    <Badge key={approver} variant="outline" className="text-xs">
                                      {approver}
                                    </Badge>
                                  ))}
                                </div>
                                <div className="mt-2 flex items-center gap-2">
                                  <span className="text-sm text-gray-400">Actions:</span>
                                  {level.actions.map((action) => (
                                    <Badge key={action} className="text-xs bg-blue-500/20 text-blue-400 border-blue-500/30">
                                      {action}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Communication Channels Tab */}
            <TabsContent value="channels" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">Communication Channels</h2>
                  <p className="text-sm text-gray-400">Configure how M will notify stakeholders during activations</p>
                </div>
                <Button onClick={() => setIsChannelDialogOpen(true)} data-testid="button-add-channel">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Channel
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {communicationChannels.map((channel) => (
                  <Card key={channel.id} className={`bg-gray-800/50 border-gray-700 ${channel.isActive ? '' : 'opacity-50'}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            channel.channelType === 'email' ? 'bg-blue-500/20 text-blue-400' :
                            channel.channelType === 'slack' ? 'bg-purple-500/20 text-purple-400' :
                            channel.channelType === 'teams' ? 'bg-indigo-500/20 text-indigo-400' :
                            'bg-orange-500/20 text-orange-400'
                          }`}>
                            {getChannelIcon(channel.channelType)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{channel.name}</h3>
                            <p className="text-sm text-gray-400 capitalize">{channel.channelType}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {channel.isDefault && (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              Default
                            </Badge>
                          )}
                          <Switch checked={channel.isActive} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Add Department Dialog */}
          <Dialog open={isDepartmentDialogOpen} onOpenChange={setIsDepartmentDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Department</DialogTitle>
                <DialogDescription>Add a new department to your organization structure</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Department Name *</Label>
                  <Input 
                    placeholder="e.g., Marketing" 
                    value={newDepartment.name}
                    onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                    data-testid="input-department-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea 
                    placeholder="Brief description of the department..."
                    value={newDepartment.description}
                    onChange={(e) => setNewDepartment({ ...newDepartment, description: e.target.value })}
                    data-testid="input-department-description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Headcount</Label>
                    <Input 
                      type="number"
                      placeholder="0"
                      value={newDepartment.headcount || ''}
                      onChange={(e) => setNewDepartment({ ...newDepartment, headcount: parseInt(e.target.value) || undefined })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Cost Center</Label>
                    <Input 
                      placeholder="e.g., CC-001"
                      value={newDepartment.costCenter || ''}
                      onChange={(e) => setNewDepartment({ ...newDepartment, costCenter: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDepartmentDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddDepartment} data-testid="button-save-department">
                  <Save className="h-4 w-4 mr-2" />
                  Save Department
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Add Stakeholder Dialog */}
          <Dialog open={isStakeholderDialogOpen} onOpenChange={setIsStakeholderDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Stakeholder</DialogTitle>
                <DialogDescription>Add a key stakeholder for playbook coordination</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input 
                    placeholder="e.g., John Smith" 
                    value={newStakeholder.name}
                    onChange={(e) => setNewStakeholder({ ...newStakeholder, name: e.target.value })}
                    data-testid="input-stakeholder-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input 
                    type="email"
                    placeholder="john.smith@company.com"
                    value={newStakeholder.email}
                    onChange={(e) => setNewStakeholder({ ...newStakeholder, email: e.target.value })}
                    data-testid="input-stakeholder-email"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Input 
                      placeholder="e.g., VP Operations"
                      value={newStakeholder.role}
                      onChange={(e) => setNewStakeholder({ ...newStakeholder, role: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Select 
                      value={newStakeholder.department}
                      onValueChange={(value) => setNewStakeholder({ ...newStakeholder, department: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Approval Limit ($)</Label>
                  <Input 
                    type="number"
                    placeholder="100000"
                    value={newStakeholder.approvalLimit || ''}
                    onChange={(e) => setNewStakeholder({ ...newStakeholder, approvalLimit: parseInt(e.target.value) || undefined })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Can Approve Playbook Activations</Label>
                  <Switch 
                    checked={newStakeholder.canApproveActivations}
                    onCheckedChange={(checked) => setNewStakeholder({ ...newStakeholder, canApproveActivations: checked })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsStakeholderDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddStakeholder} data-testid="button-save-stakeholder">
                  <Save className="h-4 w-4 mr-2" />
                  Save Stakeholder
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Add Communication Channel Dialog */}
          <Dialog open={isChannelDialogOpen} onOpenChange={setIsChannelDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Communication Channel</DialogTitle>
                <DialogDescription>Configure a new notification channel</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Channel Type</Label>
                  <Select 
                    value={newChannel.channelType}
                    onValueChange={(value: any) => setNewChannel({ ...newChannel, channelType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="slack">Slack</SelectItem>
                      <SelectItem value="teams">Microsoft Teams</SelectItem>
                      <SelectItem value="webhook">Webhook</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Channel Name *</Label>
                  <Input 
                    placeholder="e.g., Crisis Response Slack" 
                    value={newChannel.name}
                    onChange={(e) => setNewChannel({ ...newChannel, name: e.target.value })}
                    data-testid="input-channel-name"
                  />
                </div>
                {newChannel.channelType === 'slack' && (
                  <div className="space-y-2">
                    <Label>Webhook URL</Label>
                    <Input 
                      placeholder="https://hooks.slack.com/services/..."
                      onChange={(e) => setNewChannel({ ...newChannel, configuration: { webhookUrl: e.target.value } })}
                    />
                  </div>
                )}
                {newChannel.channelType === 'webhook' && (
                  <div className="space-y-2">
                    <Label>Endpoint URL</Label>
                    <Input 
                      placeholder="https://api.yourcompany.com/webhooks/..."
                      onChange={(e) => setNewChannel({ ...newChannel, configuration: { endpointUrl: e.target.value } })}
                    />
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <Label>Set as Default Channel</Label>
                  <Switch 
                    checked={newChannel.isDefault}
                    onCheckedChange={(checked) => setNewChannel({ ...newChannel, isDefault: checked })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsChannelDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddChannel} data-testid="button-save-channel">
                  <Save className="h-4 w-4 mr-2" />
                  Save Channel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
        </div>
      </div>
    </PageLayout>
  );
}