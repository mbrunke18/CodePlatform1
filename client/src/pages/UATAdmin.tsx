import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import PageLayout from '@/components/layout/PageLayout';
import { 
  Settings, 
  Users, 
  Building2, 
  Plus, 
  Check, 
  AlertTriangle, 
  Copy,
  Key,
  Database,
  PlayCircle,
  FileText,
  Shield,
  Brain
} from 'lucide-react';

interface UATOrganization {
  id: string;
  name: string;
  description?: string;
  domain?: string;
  type: string;
  industry?: string;
  size?: number;
  status: string;
  createdAt: string;
}

interface UATUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  organizationId?: string;
  department?: string;
  team?: string;
  createdAt: string;
}

interface DecisionOutcome {
  id: string;
  organizationId: string;
  scenarioId?: string;
  decisionType: string;
  decisionDescription: string;
  decisionMaker?: string;
  createdAt: string;
}

export default function UATAdmin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('provision');
  
  // State for organization creation
  const [orgFormData, setOrgFormData] = useState({
    name: '',
    description: '',
    domain: '',
    type: 'enterprise',
    industry: '',
    size: ''
  });

  // State for user creation
  const [userFormData, setUserFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    organizationId: '',
    department: '',
    team: '',
    password: ''
  });

  // Fetch organizations for UAT
  const { data: organizations = [], isLoading: orgLoading } = useQuery({
    queryKey: ['/api/organizations'],
    enabled: true
  });

  // Fetch users for UAT
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['/api/users'],
    enabled: true
  });

  // Fetch decision outcomes for UAT validation
  const { data: decisionOutcomes = [], isLoading: decisionsLoading } = useQuery({
    queryKey: ['/api/decision-outcomes'],
    enabled: true
  });

  // Create organization mutation
  const createOrgMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          size: data.size ? parseInt(data.size) : null,
          ownerId: 'uat-admin' // Special UAT owner
        })
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Organization Created",
        description: `Successfully created ${data.name} for UAT testing.`
      });
      queryClient.invalidateQueries({ queryKey: ['/api/organizations'] });
      setOrgFormData({
        name: '',
        description: '',
        domain: '',
        type: 'enterprise',
        industry: '',
        size: ''
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create organization",
        variant: "destructive"
      });
    }
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          id: `uat-${Date.now()}` // Generate UAT user ID
        })
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "User Created",
        description: `Successfully created user ${data.email} for UAT testing.`
      });
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      setUserFormData({
        email: '',
        firstName: '',
        lastName: '',
        organizationId: '',
        department: '',
        team: '',
        password: ''
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create user",
        variant: "destructive"
      });
    }
  });

  // Generate secure credentials
  const generateCredentials = () => {
    const timestamp = Date.now().toString(36);
    const randomPassword = timestamp + timestamp.toUpperCase() + '123!';
    setUserFormData(prev => ({ ...prev, password: randomPassword }));
  };

  // Copy credentials to clipboard
  const copyCredentials = async (email: string, password: string) => {
    const credentials = `Email: ${email}\nPassword: ${password}`;
    await navigator.clipboard.writeText(credentials);
    toast({
      title: "Credentials Copied",
      description: "User credentials copied to clipboard"
    });
  };

  return (
    <PageLayout>
      <div className="page-background min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#0A0F2E] rounded-lg flex items-center justify-center">
                <Settings className="h-6 w-6 text-[#C9A84C]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#0A0F2E] dark:text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }} data-testid="uat-admin-title">
                  UAT Administration Center
                </h1>
                <p className="text-sm text-[#6B7280]">White-Glove Customer Onboarding & Testing Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-[#C9A84C]/20 text-[#C9A84C] border-[#C9A84C]/30" data-testid="uat-status">
                <div className="w-2 h-2 bg-[#C9A84C] rounded-full mr-2 animate-pulse"></div>
                UAT Environment Active
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" data-testid="uat-tabs">
            <TabsList className="grid w-full grid-cols-4 mb-6 bg-white dark:bg-white/5 border border-[#E8E4DC] dark:border-white/10">
              <TabsTrigger value="provision" className="data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-white flex items-center gap-2" data-testid="tab-provision">
                <Plus className="h-4 w-4" />
                Provision
              </TabsTrigger>
              <TabsTrigger value="monitor" className="data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-white flex items-center gap-2" data-testid="tab-monitor">
                <Database className="h-4 w-4" />
                Monitor
              </TabsTrigger>
              <TabsTrigger value="validate" className="data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-white flex items-center gap-2" data-testid="tab-validate">
                <Check className="h-4 w-4" />
                Validate
              </TabsTrigger>
              <TabsTrigger value="scenarios" className="data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-white flex items-center gap-2" data-testid="tab-scenarios">
                <PlayCircle className="h-4 w-4" />
                UAT Scenarios
              </TabsTrigger>
            </TabsList>

            {/* PROVISION TAB - Stage 1 */}
            <TabsContent value="provision" className="space-y-6" data-testid="provision-content">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Create Organization */}
                <Card className="border-2 border-[#0A0F2E]/30 bg-white dark:bg-white/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      <Building2 className="h-5 w-5 text-[#0A0F2E] dark:text-[#C9A84C]" />
                      Create UAT Organization
                      <Badge variant="outline" className="bg-[#0A0F2E]/5 text-[#0A0F2E] dark:text-[#C9A84C]">Stage 1</Badge>
                    </CardTitle>
                    <p className="text-sm text-[#6B7280]">
                      Manually provision customer organization for white-glove onboarding
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="org-name">Organization Name</Label>
                        <Input
                          id="org-name"
                          value={orgFormData.name}
                          onChange={(e) => setOrgFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Customer Company Inc."
                          className="bg-[#F8F7F4] dark:bg-white/5 border-[#E8E4DC] dark:border-white/10"
                          data-testid="input-org-name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="org-domain">Domain</Label>
                        <Input
                          id="org-domain"
                          value={orgFormData.domain}
                          onChange={(e) => setOrgFormData(prev => ({ ...prev, domain: e.target.value }))}
                          placeholder="customer.com"
                          className="bg-[#F8F7F4] dark:bg-white/5 border-[#E8E4DC] dark:border-white/10"
                          data-testid="input-org-domain"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="org-description">Description</Label>
                      <Textarea
                        id="org-description"
                        value={orgFormData.description}
                        onChange={(e) => setOrgFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Brief description of the customer organization..."
                        rows={3}
                        className="bg-[#F8F7F4] dark:bg-white/5 border-[#E8E4DC] dark:border-white/10"
                        data-testid="input-org-description"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="org-type">Type</Label>
                        <Select value={orgFormData.type} onValueChange={(value) => setOrgFormData(prev => ({ ...prev, type: value }))}>
                          <SelectTrigger className="bg-[#F8F7F4] dark:bg-white/5 border-[#E8E4DC] dark:border-white/10" data-testid="select-org-type">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="enterprise">Enterprise</SelectItem>
                            <SelectItem value="mid-market">Mid-Market</SelectItem>
                            <SelectItem value="startup">Startup</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="org-industry">Industry</Label>
                        <Input
                          id="org-industry"
                          value={orgFormData.industry}
                          onChange={(e) => setOrgFormData(prev => ({ ...prev, industry: e.target.value }))}
                          placeholder="Technology"
                          className="bg-[#F8F7F4] dark:bg-white/5 border-[#E8E4DC] dark:border-white/10"
                          data-testid="input-org-industry"
                        />
                      </div>
                      <div>
                        <Label htmlFor="org-size">Employee Count</Label>
                        <Input
                          id="org-size"
                          type="number"
                          value={orgFormData.size}
                          onChange={(e) => setOrgFormData(prev => ({ ...prev, size: e.target.value }))}
                          placeholder="500"
                          className="bg-[#F8F7F4] dark:bg-white/5 border-[#E8E4DC] dark:border-white/10"
                          data-testid="input-org-size"
                        />
                      </div>
                    </div>
                    <Button 
                      onClick={() => createOrgMutation.mutate(orgFormData)}
                      disabled={!orgFormData.name || createOrgMutation.isPending}
                      className="w-full bg-[#0A0F2E] text-white hover:bg-[#141B45]"
                      data-testid="button-create-org"
                    >
                      {createOrgMutation.isPending ? "Creating..." : "Create Organization"}
                    </Button>
                  </CardContent>
                </Card>

                {/* Create Users */}
                <Card className="border-2 border-[#2B8A6E]/30 bg-white dark:bg-white/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      <Users className="h-5 w-5 text-[#2B8A6E]" />
                      Provision Test Users
                      <Badge variant="outline" className="bg-[#2B8A6E]/5 text-[#2B8A6E]">Stage 1</Badge>
                    </CardTitle>
                    <p className="text-sm text-[#6B7280]">
                      Create user accounts linked to the customer organization
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="user-org">Organization</Label>
                      <Select value={userFormData.organizationId} onValueChange={(value) => setUserFormData(prev => ({ ...prev, organizationId: value }))}>
                        <SelectTrigger className="bg-[#F8F7F4] dark:bg-white/5 border-[#E8E4DC] dark:border-white/10" data-testid="select-user-org">
                          <SelectValue placeholder="Select organization" />
                        </SelectTrigger>
                        <SelectContent>
                          {(organizations as UATOrganization[]).map((org: UATOrganization) => (
                            <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="user-email">Email</Label>
                        <Input
                          id="user-email"
                          type="email"
                          value={userFormData.email}
                          onChange={(e) => setUserFormData(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="tester@customer.com"
                          className="bg-[#F8F7F4] dark:bg-white/5 border-[#E8E4DC] dark:border-white/10"
                          data-testid="input-user-email"
                        />
                      </div>
                      <div>
                        <Label htmlFor="user-password">Password</Label>
                        <div className="flex gap-2">
                          <Input
                            id="user-password"
                            type="text"
                            value={userFormData.password}
                            onChange={(e) => setUserFormData(prev => ({ ...prev, password: e.target.value }))}
                            placeholder="Secure password"
                            className="bg-[#F8F7F4] dark:bg-white/5 border-[#E8E4DC] dark:border-white/10"
                            data-testid="input-user-password"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="border-[#E8E4DC] dark:border-white/10 hover:bg-[#F8F7F4] dark:hover:bg-white/5"
                            onClick={generateCredentials}
                            data-testid="button-generate-password"
                          >
                            <Key className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="user-firstName">First Name</Label>
                        <Input
                          id="user-firstName"
                          value={userFormData.firstName}
                          onChange={(e) => setUserFormData(prev => ({ ...prev, firstName: e.target.value }))}
                          placeholder="John"
                          className="bg-[#F8F7F4] dark:bg-white/5 border-[#E8E4DC] dark:border-white/10"
                          data-testid="input-user-first-name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="user-lastName">Last Name</Label>
                        <Input
                          id="user-lastName"
                          value={userFormData.lastName}
                          onChange={(e) => setUserFormData(prev => ({ ...prev, lastName: e.target.value }))}
                          placeholder="Doe"
                          className="bg-[#F8F7F4] dark:bg-white/5 border-[#E8E4DC] dark:border-white/10"
                          data-testid="input-user-last-name"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="user-department">Department</Label>
                        <Input
                          id="user-department"
                          value={userFormData.department}
                          onChange={(e) => setUserFormData(prev => ({ ...prev, department: e.target.value }))}
                          placeholder="Operations"
                          className="bg-[#F8F7F4] dark:bg-white/5 border-[#E8E4DC] dark:border-white/10"
                          data-testid="input-user-department"
                        />
                      </div>
                      <div>
                        <Label htmlFor="user-team">Team</Label>
                        <Input
                          id="user-team"
                          value={userFormData.team}
                          onChange={(e) => setUserFormData(prev => ({ ...prev, team: e.target.value }))}
                          placeholder="Crisis Response"
                          className="bg-[#F8F7F4] dark:bg-white/5 border-[#E8E4DC] dark:border-white/10"
                          data-testid="input-user-team"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => createUserMutation.mutate(userFormData)}
                        disabled={!userFormData.email || !userFormData.organizationId || createUserMutation.isPending}
                        className="flex-1 bg-[#2B8A6E] text-white hover:bg-[#3BAF8A]"
                        data-testid="button-create-user"
                      >
                        {createUserMutation.isPending ? "Creating..." : "Create User"}
                      </Button>
                      {userFormData.email && userFormData.password && (
                        <Button
                          variant="outline"
                          className="border-[#E8E4DC] dark:border-white/10 hover:bg-[#F8F7F4] dark:hover:bg-white/5"
                          onClick={() => copyCredentials(userFormData.email, userFormData.password)}
                          data-testid="button-copy-credentials"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Instructions */}
              <Alert className="border-[#C9A84C]/30 bg-[#C9A84C]/5">
                <Shield className="h-4 w-4 text-[#C9A84C]" />
                <AlertDescription className="text-[#6B7280]">
                  <strong className="text-[#0A0F2E] dark:text-[#C9A84C]">Stage 1 Complete:</strong> After creating organizations and users, securely share credentials with the customer team. 
                  Their first task is to log in and confirm they see their company's dashboard.
                </AlertDescription>
              </Alert>
            </TabsContent>

            {/* MONITOR TAB */}
            <TabsContent value="monitor" className="space-y-6" data-testid="monitor-content">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Organizations Monitor */}
                <Card className="border-[#E8E4DC] dark:border-white/10 bg-white dark:bg-white/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      <Building2 className="h-5 w-5 text-[#0A0F2E] dark:text-[#C9A84C]" />
                      UAT Organizations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {orgLoading ? (
                      <p className="text-sm text-[#6B7280]">Loading organizations...</p>
                    ) : (
                      <div className="space-y-3">
                        {(organizations as UATOrganization[]).slice(0, 5).map((org: UATOrganization) => (
                          <div key={org.id} className="flex items-center justify-between p-3 bg-[#F8F7F4] dark:bg-white/5 rounded-lg border border-[#E8E4DC] dark:border-white/10">
                            <div>
                              <p className="font-medium text-[#0A0F2E] dark:text-white">{org.name}</p>
                              <p className="text-xs text-[#6B7280]">{org.domain} • {org.type}</p>
                            </div>
                            <Badge className={org.status === 'Active' ? 'bg-[#2B8A6E]/20 text-[#2B8A6E] border-[#2B8A6E]/30' : 'bg-[#E8E4DC] text-[#6B7280]'}>
                              {org.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Users Monitor */}
                <Card className="border-[#E8E4DC] dark:border-white/10 bg-white dark:bg-white/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      <Users className="h-5 w-5 text-[#2B8A6E]" />
                      UAT Test Users
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {usersLoading ? (
                      <p className="text-sm text-[#6B7280]">Loading users...</p>
                    ) : (
                      <div className="space-y-3">
                        {(users as UATUser[]).slice(0, 5).map((user: UATUser) => (
                          <div key={user.id} className="flex items-center justify-between p-3 bg-[#F8F7F4] dark:bg-white/5 rounded-lg border border-[#E8E4DC] dark:border-white/10">
                            <div>
                              <p className="font-medium text-[#0A0F2E] dark:text-white">{user.firstName} {user.lastName}</p>
                              <p className="text-xs text-[#6B7280]">{user.email}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-medium text-[#0A0F2E] dark:text-[#C9A84C]">{user.department}</p>
                              <p className="text-xs text-[#6B7280]">{user.team}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* VALIDATE TAB - Stage 3 */}
            <TabsContent value="validate" className="space-y-6" data-testid="validate-content">
              <Card className="border-2 border-[#C9A84C]/30 bg-white dark:bg-white/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    <Database className="h-5 w-5 text-[#C9A84C]" />
                    Decision Outcomes Validation
                    <Badge variant="outline" className="bg-[#C9A84C]/5 text-[#C9A84C]">Stage 3</Badge>
                  </CardTitle>
                  <p className="text-sm text-[#6B7280]">
                    Monitor decision logging and institutional memory updates from UAT sessions
                  </p>
                </CardHeader>
                <CardContent>
                  {decisionsLoading ? (
                    <p className="text-sm text-[#6B7280]">Loading decision outcomes...</p>
                  ) : (
                    <div className="space-y-4">
                      {(decisionOutcomes as DecisionOutcome[]).slice(0, 3).map((decision: DecisionOutcome) => (
                        <div key={decision.id} className="p-4 bg-[#F8F7F4] dark:bg-white/5 rounded-lg border border-[#E8E4DC] dark:border-white/10">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-[#0A0F2E] dark:text-white">{decision.decisionType}</p>
                              <p className="text-sm text-[#6B7280] mt-1">{decision.decisionDescription}</p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-[#6B7280]">
                                <span>Org: {decision.organizationId}</span>
                                {decision.scenarioId && <span>Scenario: {decision.scenarioId}</span>}
                                <span>{new Date(decision.createdAt).toLocaleString()}</span>
                              </div>
                            </div>
                            <Badge className="bg-[#2B8A6E]/20 text-[#2B8A6E] border-[#2B8A6E]/30">Logged</Badge>
                          </div>
                        </div>
                      ))}
                      {(decisionOutcomes as DecisionOutcome[]).length === 0 && (
                        <Alert className="border-[#C9A84C]/30 bg-[#C9A84C]/5">
                          <AlertTriangle className="h-4 w-4 text-[#C9A84C]" />
                          <AlertDescription className="text-[#6B7280]">
                            No decision outcomes logged yet. Decisions will appear here once the UAT team completes Stage 2.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* UAT SCENARIOS TAB - Stage 2 */}
            <TabsContent value="scenarios" className="space-y-6" data-testid="scenarios-content">
              <Card className="border-2 border-red-200 bg-white dark:bg-white/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    <PlayCircle className="h-5 w-5 text-red-700" />
                    Core UAT Scenario: Supply Chain Disruption
                    <Badge variant="outline" className="bg-red-50 text-red-700">Stage 2</Badge>
                  </CardTitle>
                  <p className="text-sm text-[#6B7280]">
                    Ready-to-execute scenario for customer workflow simulation
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Alert className="border-[#0A0F2E]/30 bg-[#0A0F2E]/5">
                      <Brain className="h-4 w-4 text-[#C9A84C]" />
                      <AlertDescription className="text-[#6B7280]">
                        <strong className="text-[#0A0F2E] dark:text-[#C9A84C]">Scenario Brief:</strong> A sudden supply chain disruption has occurred affecting key suppliers. 
                        The customer team must activate the War Room, collaborate in real-time, and make strategic decisions.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="border-[#E8E4DC] dark:border-white/10 bg-[#F8F7F4] dark:bg-white/5">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-[#0A0F2E] dark:text-white">1. War Room Activation</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-xs text-[#6B7280]">Customer team lead initiates scenario from template</p>
                          <Badge className="mt-2 text-xs bg-[#2B8A6E]/20 text-[#2B8A6E]">Ready</Badge>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-[#E8E4DC] dark:border-white/10 bg-[#F8F7F4] dark:bg-white/5">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-[#0A0F2E] dark:text-white">2. Real-time Collaboration</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-xs text-[#6B7280]">All testers join and validate live updates</p>
                          <Badge className="mt-2 text-xs bg-[#C9A84C]/20 text-[#C9A84C]">Live</Badge>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-[#E8E4DC] dark:border-white/10 bg-[#F8F7F4] dark:bg-white/5">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-[#0A0F2E] dark:text-white">3. AI-Powered Insight</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-xs text-[#6B7280]">Test AI co-pilot with relevant questions</p>
                          <Badge className="mt-2 text-xs bg-[#0A0F2E] text-white">AI Ready</Badge>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="p-4 bg-[#F8F7F4] dark:bg-white/5 rounded-lg border border-[#E8E4DC] dark:border-white/10">
                      <h4 className="font-medium text-[#0A0F2E] dark:text-white mb-2">Validation Checklist:</h4>
                      <div className="space-y-2 text-sm text-[#6B7280]">
                        <div className="flex items-center gap-2">
                          <input type="checkbox" className="rounded border-[#E8E4DC]" />
                          <span>Team can access War Room successfully</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" className="rounded border-[#E8E4DC]" />
                          <span>Real-time updates visible to all participants</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" className="rounded border-[#E8E4DC]" />
                          <span>AI provides relevant, valuable insights</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" className="rounded border-[#E8E4DC]" />
                          <span>Decision correctly logged in database</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" className="rounded border-[#E8E4DC]" />
                          <span>Board-ready report generated successfully</span>
                        </div>
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => window.open('/war-room', '_blank')}
                      data-testid="button-launch-scenario"
                    >
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Launch UAT Scenario
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageLayout>
  );
}