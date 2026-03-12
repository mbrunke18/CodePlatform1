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
import VeridiusPageLayout from '@/components/layout/VeridiusPageLayout';
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
          id: `uat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` // Generate UAT user ID
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
    const randomPassword = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12).toUpperCase() + '123!';
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
    <VeridiusPageLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="uat-admin-title">
                  UAT Administration Center
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">White-Glove Customer Onboarding & Testing Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-200" data-testid="uat-status">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></div>
                UAT Environment Active
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" data-testid="uat-tabs">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="provision" className="flex items-center gap-2" data-testid="tab-provision">
                <Plus className="h-4 w-4" />
                Provision
              </TabsTrigger>
              <TabsTrigger value="monitor" className="flex items-center gap-2" data-testid="tab-monitor">
                <Database className="h-4 w-4" />
                Monitor
              </TabsTrigger>
              <TabsTrigger value="validate" className="flex items-center gap-2" data-testid="tab-validate">
                <Check className="h-4 w-4" />
                Validate
              </TabsTrigger>
              <TabsTrigger value="scenarios" className="flex items-center gap-2" data-testid="tab-scenarios">
                <PlayCircle className="h-4 w-4" />
                UAT Scenarios
              </TabsTrigger>
            </TabsList>

            {/* PROVISION TAB - Stage 1 */}
            <TabsContent value="provision" className="space-y-6" data-testid="provision-content">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Create Organization */}
                <Card className="border-2 border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-blue-600" />
                      Create UAT Organization
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">Stage 1</Badge>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
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
                        data-testid="input-org-description"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="org-type">Type</Label>
                        <Select value={orgFormData.type} onValueChange={(value) => setOrgFormData(prev => ({ ...prev, type: value }))}>
                          <SelectTrigger data-testid="select-org-type">
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
                          data-testid="input-org-size"
                        />
                      </div>
                    </div>
                    <Button 
                      onClick={() => createOrgMutation.mutate(orgFormData)}
                      disabled={!orgFormData.name || createOrgMutation.isPending}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      data-testid="button-create-org"
                    >
                      {createOrgMutation.isPending ? "Creating..." : "Create Organization"}
                    </Button>
                  </CardContent>
                </Card>

                {/* Create Users */}
                <Card className="border-2 border-green-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-green-600" />
                      Provision Test Users
                      <Badge variant="outline" className="bg-green-50 text-green-700">Stage 1</Badge>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Create user accounts linked to the customer organization
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="user-org">Organization</Label>
                      <Select value={userFormData.organizationId} onValueChange={(value) => setUserFormData(prev => ({ ...prev, organizationId: value }))}>
                        <SelectTrigger data-testid="select-user-org">
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
                            data-testid="input-user-password"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
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
                          data-testid="input-user-team"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => createUserMutation.mutate(userFormData)}
                        disabled={!userFormData.email || !userFormData.organizationId || createUserMutation.isPending}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        data-testid="button-create-user"
                      >
                        {createUserMutation.isPending ? "Creating..." : "Create User"}
                      </Button>
                      {userFormData.email && userFormData.password && (
                        <Button
                          variant="outline"
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
              <Alert className="border-purple-200 bg-purple-50">
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Stage 1 Complete:</strong> After creating organizations and users, securely share credentials with the customer team. 
                  Their first task is to log in and confirm they see their company's dashboard.
                </AlertDescription>
              </Alert>
            </TabsContent>

            {/* MONITOR TAB */}
            <TabsContent value="monitor" className="space-y-6" data-testid="monitor-content">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Organizations Monitor */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-blue-600" />
                      UAT Organizations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {orgLoading ? (
                      <p className="text-sm text-gray-500">Loading organizations...</p>
                    ) : (
                      <div className="space-y-3">
                        {(organizations as UATOrganization[]).slice(0, 5).map((org: UATOrganization) => (
                          <div key={org.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium">{org.name}</p>
                              <p className="text-xs text-gray-500">{org.domain} • {org.type}</p>
                            </div>
                            <Badge variant={org.status === 'Active' ? 'secondary' : 'destructive'}>
                              {org.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Users Monitor */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-green-600" />
                      UAT Test Users
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {usersLoading ? (
                      <p className="text-sm text-gray-500">Loading users...</p>
                    ) : (
                      <div className="space-y-3">
                        {(users as UATUser[]).slice(0, 5).map((user: UATUser) => (
                          <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium">{user.firstName} {user.lastName}</p>
                              <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-medium">{user.department}</p>
                              <p className="text-xs text-gray-500">{user.team}</p>
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
              <Card className="border-2 border-orange-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-orange-600" />
                    Decision Outcomes Validation
                    <Badge variant="outline" className="bg-orange-50 text-orange-700">Stage 3</Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Monitor decision logging and institutional memory updates from UAT sessions
                  </p>
                </CardHeader>
                <CardContent>
                  {decisionsLoading ? (
                    <p className="text-sm text-gray-500">Loading decision outcomes...</p>
                  ) : (
                    <div className="space-y-4">
                      {(decisionOutcomes as DecisionOutcome[]).slice(0, 3).map((decision: DecisionOutcome) => (
                        <div key={decision.id} className="p-4 border rounded-lg bg-gray-50">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium">{decision.decisionType}</p>
                              <p className="text-sm text-gray-600 mt-1">{decision.decisionDescription}</p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                <span>Org: {decision.organizationId}</span>
                                {decision.scenarioId && <span>Scenario: {decision.scenarioId}</span>}
                                <span>{new Date(decision.createdAt).toLocaleString()}</span>
                              </div>
                            </div>
                            <Badge variant="secondary">Logged</Badge>
                          </div>
                        </div>
                      ))}
                      {(decisionOutcomes as DecisionOutcome[]).length === 0 && (
                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
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
              <Card className="border-2 border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PlayCircle className="h-5 w-5 text-red-600" />
                    Core UAT Scenario: Supply Chain Disruption
                    <Badge variant="outline" className="bg-red-50 text-red-700">Stage 2</Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Ready-to-execute scenario for customer workflow simulation
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Alert className="border-blue-200 bg-blue-50">
                      <Brain className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Scenario Brief:</strong> A sudden supply chain disruption has occurred affecting key suppliers. 
                        The customer team must activate the War Room, collaborate in real-time, and make strategic decisions.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">1. War Room Activation</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-xs text-gray-600">Customer team lead initiates scenario from template</p>
                          <Badge variant="secondary" className="mt-2 text-xs">Ready</Badge>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">2. Real-time Collaboration</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-xs text-gray-600">All testers join and validate live updates</p>
                          <Badge variant="secondary" className="mt-2 text-xs">Live</Badge>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">3. AI-Powered Insight</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-xs text-gray-600">Test AI co-pilot with relevant questions</p>
                          <Badge variant="secondary" className="mt-2 text-xs">AI Ready</Badge>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Validation Checklist:</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" />
                          <span>Team can access War Room successfully</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" />
                          <span>Real-time updates visible to all participants</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" />
                          <span>AI provides relevant, valuable insights</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" />
                          <span>Decision correctly logged in database</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" />
                          <span>Board-ready report generated successfully</span>
                        </div>
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-red-600 hover:bg-red-700"
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
    </VeridiusPageLayout>
  );
}