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
import StandardNav from '@/components/layout/StandardNav';
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
  { id: 'crisis', name: 'Crisis Management', icon: AlertTriangle, color: 'text-[#0A0F2E]' },
  { id: 'competitive', name: 'Competitive Response', icon: Target, color: 'text-[#C9A84C]' },
  { id: 'market', name: 'Market Opportunity', icon: TrendingUp, color: 'text-[#2B8A6E]' },
  { id: 'regulatory', name: 'Regulatory Compliance', icon: Shield, color: 'text-[#C9A84C]' },
  { id: 'technology', name: 'Technology', icon: Zap, color: 'text-[#0A0F2E]' },
  { id: 'talent', name: 'Talent & Workforce', icon: Users, color: 'text-[#C9A84C]' },
  { id: 'financial', name: 'Financial Response', icon: DollarSign, color: 'text-[#2B8A6E]' },
  { id: 'operational', name: 'Operational Excellence', icon: Settings, color: 'text-[#0A0F2E]' },
];

const FALLBACK_TEMPLATES: PlaybookTemplate[] = [
  { id: '1', name: 'Supply Chain Disruption Response', category: 'crisis', domain: 'Crisis Management', description: 'Rapid response playbook for supply chain disruptions including supplier failure, logistics issues, or natural disasters', estimatedDuration: '4-12 hours', complexity: 'high', stakeholderCount: 12, tasks: 24 },
  { id: '2', name: 'Competitive Pricing Response', category: 'competitive', domain: 'Market Dynamics', description: 'Quick response to aggressive competitor pricing moves or market share threats', estimatedDuration: '2-4 hours', complexity: 'medium', stakeholderCount: 8, tasks: 16 },
  { id: '3', name: 'Cybersecurity Incident Response', category: 'crisis', domain: 'Crisis Management', description: 'Comprehensive response to security breaches, ransomware, or data compromise', estimatedDuration: '1-24 hours', complexity: 'high', stakeholderCount: 15, tasks: 32 },
];

export default function PlaybookCustomization({ embedded }: { embedded?: boolean }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTemplate, setSelectedTemplate] = useState<PlaybookTemplate | null>(null);
  const [isDialogOpen, setIsDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('all');

  const { data: templates = FALLBACK_TEMPLATES } = useQuery<PlaybookTemplate[]>({
    queryKey: ['/api/playbook-templates'],
    enabled: false, // Using samples for now
  });

  const customizeMutation = useMutation({
    mutationFn: async (data: Partial<CustomizedPlaybook>) => {
      const res = await apiRequest('POST', '/api/playbooks/customize', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/playbooks'] });
      toast({
        title: "Success",
        description: "Playbook customized successfully",
      });
      setIsDialog(false);
    }
  });

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDomain = selectedDomain === 'all' || t.category === selectedDomain;
    return matchesSearch && matchesDomain;
  });

  const NAVY = "#0A0F2E";
  const NAVY_MID = "#141B45";
  const GOLD = "#C9A84C";
  const TEAL = "#2B8A6E";
  const OFF = "#F8F7F4";
  const BORDER = "#E8E4DC";
  const MUTED = "#6B7280";
  const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

  return (
    <PageLayout>
      <div className="min-h-screen bg-[#F8F7F4]">
        {!embedded && <StandardNav />}
        
        <div className="max-w-[1600px] mx-auto px-6 py-12">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-[#6B7280]">
              <Link to="/">
                <Button variant="ghost" size="sm" className="p-0 h-auto font-medium hover:text-[#0A0F2E] bg-transparent">
                  <Home className="h-4 w-4 mr-1" />
                  Execution OS
                </Button>
              </Link>
              <span>/</span>
              <span>Configuration</span>
              <span>/</span>
              <span className="text-[#0A0F2E] font-bold">Playbook Customization</span>
            </div>
          </div>

          {/* Header */}
          <div className="bg-[#0A0F2E] text-white p-10 rounded-2xl border border-[#E8E4DC] mb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                  <BookOpen className="w-8 h-8 text-[#C9A84C]" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-4 w-[2px] bg-[#C9A84C]"></div>
                    <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#C9A84C]">Template Engine</span>
                  </div>
                  <h1 style={CG} className="text-4xl font-bold" data-testid="playbook-customization-title">Strategic Playbook Customization</h1>
                  <p className="text-gray-400 mt-2 text-lg">Architect your organization's response by cloning and configuring battle-tested templates.</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Link to="/">
                  <Button className="bg-[#C9A84C] hover:bg-[#DFC178] text-[#0A0F2E] font-bold h-12 px-8 rounded-xl border-0">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-10">
            <div className="lg:col-span-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#6B7280]" />
                <Input 
                  placeholder="Search playbook templates by keyword, scenario, or domain..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 bg-white border-[#E8E4DC] rounded-xl text-lg focus:ring-[#C9A84C]"
                  data-testid="input-search-playbooks"
                />
              </div>
            </div>
            <div>
              <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                <SelectTrigger className="h-14 bg-white border-[#E8E4DC] rounded-xl font-bold text-[#0A0F2E]">
                  <Filter className="h-4 w-4 mr-2 text-[#C9A84C]" />
                  <SelectValue placeholder="All Domains" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-[#E8E4DC]">
                  <SelectItem value="all">All Strategic Domains</SelectItem>
                  {PLAYBOOK_DOMAINS.map(domain => (
                    <SelectItem key={domain.id} value={domain.id}>{domain.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Template Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredTemplates.map(template => {
              const isOffense = template.category === 'market' || template.category === 'competitive' || template.category === 'growth';
              const isDefense = template.category === 'crisis' || template.category === 'regulatory' || template.category === 'operational' || template.category === 'technology';
              const indicatorColor = isOffense ? TEAL : isDefense ? NAVY : GOLD;
              
              return (
                <Card key={template.id} className="bg-white border-[#E8E4DC] hover:border-[#C9A84C] transition-all duration-300 shadow-sm hover:shadow-md rounded-2xl overflow-hidden group">
                  <div className="h-1.5 transition-colors" style={{ backgroundColor: indicatorColor }} />
                  <CardHeader className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="outline" className="bg-[#F8F7F4] border-[#E8E4DC] text-[#6B7280] font-bold uppercase tracking-widest text-[9px] px-3 py-1">
                        {template.category.toUpperCase()}
                      </Badge>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#6B7280] uppercase">
                      <Clock className="h-3 w-3" />
                      {template.estimatedDuration}
                    </div>
                  </div>
                  <CardTitle style={CG} className="text-2xl font-bold text-[#0A0F2E] mb-3 group-hover:text-[#C9A84C] transition-colors">
                    {template.name}
                  </CardTitle>
                  <CardDescription className="text-[#6B7280] leading-relaxed line-clamp-2 min-h-[3rem]">
                    {template.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-8 pt-0">
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="text-center p-3 rounded-xl bg-[#F8F7F4] border border-[#E8E4DC]">
                      <div className="text-[9px] font-bold text-[#6B7280] uppercase mb-1">STAKEHOLDERS</div>
                      <div className="text-lg font-bold text-[#0A0F2E]">{template.stakeholderCount}</div>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-[#F8F7F4] border border-[#E8E4DC]">
                      <div className="text-[9px] font-bold text-[#6B7280] uppercase mb-1">TASKS</div>
                      <div className="text-lg font-bold text-[#0A0F2E]">{template.tasks}</div>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-[#F8F7F4] border border-[#E8E4DC]">
                      <div className="text-[9px] font-bold text-[#6B7280] uppercase mb-1">COMPLEXITY</div>
                      <div className="text-[10px] font-bold text-[#0A0F2E] uppercase">{template.complexity}</div>
                    </div>
                  </div>
                  <Button 
                    onClick={() => { setSelectedTemplate(template); setIsDialog(true); }}
                    className="w-full bg-[#0A0F2E] hover:bg-[#141B45] text-white font-bold h-12 rounded-xl"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Customize Template
                  </Button>
                </CardContent>
              </Card>
            );
          })}
          </div>
        </div>

        {/* Customization Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border-[#E8E4DC] p-0">
            <div className="h-2 bg-[#C9A84C]" />
            <div className="p-10">
              <DialogHeader className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <Badge className="bg-[#C9A84C] text-[#0A0F2E] font-bold uppercase tracking-widest text-[10px]">Configuring</Badge>
                </div>
                <DialogTitle style={CG} className="text-4xl font-bold text-[#0A0F2E]">
                  Customize: {selectedTemplate?.name}
                </DialogTitle>
                <DialogDescription className="text-lg text-[#6B7280] mt-2">
                  Configure this playbook for your organization's specific operating model and governance.
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="basic" className="space-y-8">
                <TabsList className="bg-[#F8F7F4] p-1 border border-[#E8E4DC] rounded-xl h-12">
                  <TabsTrigger value="basic" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#0A0F2E] font-bold text-[11px] uppercase tracking-wider px-6">1. Identity</TabsTrigger>
                  <TabsTrigger value="stakeholders" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#0A0F2E] font-bold text-[11px] uppercase tracking-wider px-6">2. Command</TabsTrigger>
                  <TabsTrigger value="governance" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#0A0F2E] font-bold text-[11px] uppercase tracking-wider px-6">3. Governance</TabsTrigger>
                  <TabsTrigger value="notifications" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#0A0F2E] font-bold text-[11px] uppercase tracking-wider px-6">4. Comms</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-8">
                  <div className="grid gap-8">
                    <div className="space-y-3">
                      <Label className="text-[10px] uppercase font-bold tracking-widest text-[#6B7280]">Localized Playbook Name</Label>
                      <Input defaultValue={selectedTemplate?.name} className="h-12 border-[#E8E4DC] rounded-xl font-bold text-[#0A0F2E]" />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] uppercase font-bold tracking-widest text-[#6B7280]">Strategic Intent & Scope</Label>
                      <Textarea defaultValue={selectedTemplate?.description} className="min-h-[120px] border-[#E8E4DC] rounded-xl leading-relaxed" />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="stakeholders" className="space-y-8">
                  <div className="space-y-4">
                    <Label className="text-[10px] uppercase font-bold tracking-widest text-[#6B7280]">Role Assignments</Label>
                    <div className="grid gap-4">
                      {[
                        { role: 'Incident Commander', default: 'General Counsel' },
                        { role: 'Communications Lead', default: 'VP Corporate Comms' },
                        { role: 'Operational Lead', default: 'COO' },
                        { role: 'Financial Oversight', default: 'CFO' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-[#F8F7F4] border border-[#E8E4DC]">
                          <div>
                            <div className="text-sm font-bold text-[#0A0F2E]">{item.role}</div>
                            <div className="text-xs text-[#6B7280] mt-1">Default Template Role</div>
                          </div>
                          <Select defaultValue={item.default}>
                            <SelectTrigger className="w-64 bg-white border-[#E8E4DC] rounded-xl font-bold">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-[#E8E4DC]">
                              <SelectItem value="CEO">CEO</SelectItem>
                              <SelectItem value="COO">COO</SelectItem>
                              <SelectItem value="CFO">CFO</SelectItem>
                              <SelectItem value="General Counsel">General Counsel</SelectItem>
                              <SelectItem value="VP Corporate Comms">VP Corporate Comms</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="governance" className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-[10px] uppercase font-bold tracking-widest text-[#6B7280]">Single Action Budget Limit</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
                        <Input type="number" placeholder="50,000" className="pl-10 h-12 border-[#E8E4DC] rounded-xl font-bold" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-5 rounded-2xl bg-[#F8F7F4] border border-[#E8E4DC]">
                      <div className="space-y-1">
                        <Label className="font-bold text-[#0A0F2E]">Board Notification</Label>
                        <p className="text-xs text-[#6B7280]">Trigger board alert on activation</p>
                      </div>
                      <Switch className="data-[state=checked]:bg-[#2B8A6E]" />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-8">
                  <div className="space-y-4">
                    <Label className="text-[10px] uppercase font-bold tracking-widest text-[#6B7280]">Event-Driven Intelligence</Label>
                    <div className="grid gap-4">
                      {[
                        { title: 'Activation Alert', desc: 'Notify stakeholders immediately when playbook is engaged' },
                        { title: 'Milestone Completion', desc: 'Broadcast progress as critical tasks are fulfilled' },
                        { title: 'Escalation Triggers', desc: 'Automate high-priority alerts when timeline slippage occurs' },
                      ].map((pref, i) => (
                        <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-[#F8F7F4] border border-[#E8E4DC]">
                          <div className="space-y-1">
                            <div className="text-sm font-bold text-[#0A0F2E]">{pref.title}</div>
                            <div className="text-xs text-[#6B7280]">{pref.desc}</div>
                          </div>
                          <Switch defaultChecked className="data-[state=checked]:bg-[#2B8A6E]" />
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-12 flex items-center justify-end gap-4 border-t border-[#E8E4DC] pt-10">
                <Button variant="ghost" onClick={() => setIsDialog(false)} className="h-12 px-8 font-bold text-[#6B7280] hover:text-[#0A0F2E] hover:bg-transparent">Cancel</Button>
                <Button 
                  className="bg-[#0A0F2E] hover:bg-[#141B45] text-white font-bold h-12 px-10 rounded-xl"
                  onClick={() => customizeMutation.mutate({})}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Deploy Customized Playbook
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PageLayout>
  );
}
