import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import StandardNav from "@/components/layout/StandardNav";
import Footer from "@/components/layout/Footer";
import { useCustomer } from "@/contexts/CustomerContext";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Plus,
  Search,
  Users,
  Mail,
  Phone,
  Building2,
  Shield,
  Edit,
  Trash2,
  UserCircle,
  Bell,
  MessageSquare,
  Smartphone,
  Clock,
  Activity,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Zap,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Stakeholder {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  level: number;
  responsibility: string;
  notificationChannels: string[];
  isBackup: boolean;
  backupFor?: string;
  isActive: boolean;
}

const STAKEHOLDER_ROLES = [
  { value: "CEO", label: "Chief Executive Officer", level: 1 },
  { value: "COO", label: "Chief Operating Officer", level: 1 },
  { value: "CFO", label: "Chief Financial Officer", level: 1 },
  { value: "CLO", label: "Chief Legal Officer", level: 1 },
  { value: "CTO", label: "Chief Technology Officer", level: 1 },
  { value: "CISO", label: "Chief Information Security Officer", level: 2 },
  { value: "CMO", label: "Chief Marketing Officer", level: 2 },
  { value: "CHRO", label: "Chief Human Resources Officer", level: 2 },
  { value: "VP Operations", label: "VP of Operations", level: 3 },
  { value: "VP Strategy", label: "VP of Strategy", level: 3 },
  { value: "VP Communications", label: "VP of Communications", level: 3 },
  { value: "General Counsel", label: "General Counsel", level: 2 },
  { value: "Director of Risk", label: "Director of Risk", level: 4 },
  { value: "Director of Compliance", label: "Director of Compliance", level: 4 },
  { value: "Project Manager", label: "Project Manager", level: 5 },
  { value: "HR Director", label: "HR Director", level: 4 },
  { value: "IT Director", label: "IT Director", level: 4 },
  { value: "Security Lead", label: "Security Lead", level: 5 },
];

const DEPARTMENTS = [
  "Executive", "Legal", "Finance", "Operations", "Technology", 
  "Human Resources", "Marketing", "Communications", "Compliance", "Security"
];

const NOTIFICATION_CHANNELS = [
  { id: "email", label: "Email", icon: Mail },
  { id: "sms", label: "SMS", icon: Smartphone },
  { id: "phone", label: "Phone", icon: Phone },
  { id: "slack", label: "Slack", icon: MessageSquare },
  { id: "in_app", label: "In-App", icon: Bell },
];

const LEVEL_CONFIG: Record<number, { label: string; color: string }> = {
  1: { label: "C-Suite", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  2: { label: "Executive", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  3: { label: "VP", color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400" },
  4: { label: "Director", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  5: { label: "Manager", color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300" },
};

const generateId = () => Math.random().toString(36).substring(2, 11);

const DEFAULT_STAKEHOLDERS: Stakeholder[] = [
  { id: '1', name: 'Sarah Chen', email: 'sarah.chen@company.com', phone: '+1 (555) 100-0001', role: 'CEO', department: 'Executive', level: 1, responsibility: 'Final decision authority, external communications approval', notificationChannels: ['email', 'phone', 'sms'], isBackup: false, isActive: true },
  { id: '2', name: 'Michael Torres', email: 'michael.torres@company.com', phone: '+1 (555) 100-0002', role: 'COO', department: 'Operations', level: 1, responsibility: 'Operations oversight, resource allocation', notificationChannels: ['email', 'slack', 'phone'], isBackup: false, isActive: true },
  { id: '3', name: 'Jennifer Wright', email: 'jennifer.wright@company.com', phone: '+1 (555) 100-0003', role: 'CFO', department: 'Finance', level: 1, responsibility: 'Financial impact assessment, budget approvals', notificationChannels: ['email', 'phone'], isBackup: false, isActive: true },
  { id: '4', name: 'David Park', email: 'david.park@company.com', phone: '+1 (555) 100-0004', role: 'General Counsel', department: 'Legal', level: 2, responsibility: 'Legal review, regulatory compliance', notificationChannels: ['email', 'phone', 'slack'], isBackup: false, isActive: true },
  { id: '5', name: 'Lisa Anderson', email: 'lisa.anderson@company.com', phone: '+1 (555) 100-0005', role: 'VP Communications', department: 'Communications', level: 3, responsibility: 'External messaging, media relations', notificationChannels: ['email', 'sms', 'slack'], isBackup: false, isActive: true },
  { id: '6', name: 'Robert Kim', email: 'robert.kim@company.com', phone: '+1 (555) 100-0006', role: 'CISO', department: 'Security', level: 2, responsibility: 'Security assessment, incident response', notificationChannels: ['email', 'phone', 'sms', 'slack'], isBackup: false, isActive: true },
];

export default function StakeholderManagement() {
  const { organization } = useCustomer();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>(DEFAULT_STAKEHOLDERS);
  const [editingStakeholder, setEditingStakeholder] = useState<Stakeholder | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");

  const [formData, setFormData] = useState<Partial<Stakeholder>>({
    name: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    level: 3,
    responsibility: '',
    notificationChannels: ['email'],
    isBackup: false,
    isActive: true,
  });

  const filteredStakeholders = stakeholders.filter(s => {
    const matchesSearch = !search || 
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.role.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = levelFilter === "all" || s.level.toString() === levelFilter;
    const matchesDept = departmentFilter === "all" || s.department === departmentFilter;
    return matchesSearch && matchesLevel && matchesDept;
  });

  const stats = {
    total: stakeholders.length,
    cSuite: stakeholders.filter(s => s.level === 1).length,
    executives: stakeholders.filter(s => s.level === 2).length,
    active: stakeholders.filter(s => s.isActive).length,
  };

  const handleOpenCreate = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: '',
      department: '',
      level: 3,
      responsibility: '',
      notificationChannels: ['email'],
      isBackup: false,
      isActive: true,
    });
    setEditingStakeholder(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (stakeholder: Stakeholder) => {
    setFormData({ ...stakeholder });
    setEditingStakeholder(stakeholder);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.email || !formData.role) {
      toast({
        title: "Missing Fields",
        description: "Please fill in name, email, and role.",
        variant: "destructive",
      });
      return;
    }

    if (editingStakeholder) {
      setStakeholders(stakeholders.map(s => 
        s.id === editingStakeholder.id 
          ? { ...s, ...formData } as Stakeholder
          : s
      ));
      toast({ title: "Stakeholder Updated", description: "The stakeholder has been updated." });
    } else {
      const roleInfo = STAKEHOLDER_ROLES.find(r => r.value === formData.role);
      const newStakeholder: Stakeholder = {
        id: generateId(),
        name: formData.name || '',
        email: formData.email || '',
        phone: formData.phone || '',
        role: formData.role || '',
        department: formData.department || '',
        level: roleInfo?.level || formData.level || 3,
        responsibility: formData.responsibility || '',
        notificationChannels: formData.notificationChannels || ['email'],
        isBackup: formData.isBackup || false,
        isActive: formData.isActive ?? true,
      };
      setStakeholders([...stakeholders, newStakeholder]);
      toast({ title: "Stakeholder Added", description: "New stakeholder has been added to the directory." });
    }
    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      setStakeholders(stakeholders.filter(s => s.id !== deleteId));
      setDeleteId(null);
      toast({ title: "Stakeholder Removed", description: "The stakeholder has been removed." });
    }
  };

  const handleToggleChannel = (channel: string) => {
    const current = formData.notificationChannels || [];
    if (current.includes(channel)) {
      setFormData({ ...formData, notificationChannels: current.filter(c => c !== channel) });
    } else {
      setFormData({ ...formData, notificationChannels: [...current, channel] });
    }
  };

  const handleRoleChange = (role: string) => {
    const roleInfo = STAKEHOLDER_ROLES.find(r => r.value === role);
    setFormData({ 
      ...formData, 
      role, 
      level: roleInfo?.level || formData.level 
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <>
      <StandardNav />
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white" data-testid="text-page-title">
              Stakeholder Directory
            </h1>
            <p className="text-slate-400 dark:text-slate-300 mt-1">
              Manage your organization's stakeholders, roles, and contact information
            </p>
          </div>
          <Button 
            onClick={handleOpenCreate}
            className="bg-purple-600 hover:bg-purple-700"
            data-testid="button-add-stakeholder"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Stakeholder
          </Button>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card data-testid="stat-total">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <Users className="h-5 w-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
                  <p className="text-sm text-slate-300">Total Stakeholders</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card data-testid="stat-csuite">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Shield className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">{stats.cSuite}</p>
                  <p className="text-sm text-slate-300">C-Suite</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card data-testid="stat-executives">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">{stats.executives}</p>
                  <p className="text-sm text-slate-300">Executives</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card data-testid="stat-active">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <UserCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                  <p className="text-sm text-slate-300">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-600 dark:text-slate-200" />
                <Input
                  placeholder="Search by name, role, or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                  data-testid="input-search"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-white dark:bg-slate-900 text-sm"
                  data-testid="select-level-filter"
                >
                  <option value="all">All Levels</option>
                  <option value="1">C-Suite</option>
                  <option value="2">Executive</option>
                  <option value="3">VP</option>
                  <option value="4">Director</option>
                  <option value="5">Manager</option>
                </select>
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-white dark:bg-slate-900 text-sm"
                  data-testid="select-department-filter"
                >
                  <option value="all">All Departments</option>
                  {DEPARTMENTS.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {filteredStakeholders.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No Stakeholders Found</h3>
              <p className="text-slate-300 mb-6">Start by adding stakeholders to your directory.</p>
              <Button onClick={handleOpenCreate} data-testid="button-add-first-stakeholder">
                <Plus className="h-4 w-4 mr-2" />
                Add First Stakeholder
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Stakeholder</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Channels</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStakeholders.map((stakeholder) => {
                  const levelConfig = LEVEL_CONFIG[stakeholder.level] || LEVEL_CONFIG[5];

                  return (
                    <TableRow key={stakeholder.id} data-testid={`row-stakeholder-${stakeholder.id}`}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                              {getInitials(stakeholder.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">{stakeholder.name}</p>
                            {stakeholder.isBackup && (
                              <Badge variant="outline" className="text-xs">Backup</Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{stakeholder.role}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-slate-400 dark:text-slate-300">{stakeholder.department}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={levelConfig.color}>
                          {levelConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-1 text-slate-400 dark:text-slate-300">
                            <Mail className="h-3 w-3" />
                            <span className="truncate max-w-[150px]" data-testid={`text-email-${stakeholder.id}`}>{stakeholder.email}</span>
                          </div>
                          {stakeholder.phone && (
                            <div className="flex items-center gap-1 text-slate-300">
                              <Phone className="h-3 w-3" />
                              <span data-testid={`text-phone-${stakeholder.id}`}>{stakeholder.phone}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {stakeholder.notificationChannels.map(ch => {
                            const channel = NOTIFICATION_CHANNELS.find(c => c.id === ch);
                            if (!channel) return null;
                            const Icon = channel.icon;
                            return (
                              <div 
                                key={ch} 
                                className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center"
                                title={channel.label}
                                data-testid={`badge-channel-${stakeholder.id}-${ch}`}
                              >
                                <Icon className="h-3 w-3 text-slate-400 dark:text-slate-300" />
                              </div>
                            );
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleOpenEdit(stakeholder)}
                            data-testid={`button-edit-${stakeholder.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setDeleteId(stakeholder.id)}
                            className="text-red-600 hover:text-red-700"
                            data-testid={`button-delete-${stakeholder.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        )}

        {/* Engagement Analytics Section */}
        <div className="mt-10 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Activity className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Engagement Analytics</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">94% within SLA</Badge>
                </div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">3.2 minutes</p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">Average Response Time</p>
                <p className="text-xs text-slate-400 dark:text-slate-400">Stakeholders acknowledge notifications within avg 3.2 min</p>
                <Progress value={94} className="mt-3 h-1.5" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">All channels</Badge>
                </div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">98.4%</p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">Notification Reach</p>
                <p className="text-xs text-slate-400 dark:text-slate-400">Percentage of stakeholders successfully reached on first attempt</p>
                <Progress value={98.4} className="mt-3 h-1.5" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">Above benchmark</Badge>
                </div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">92%</p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">Participation Rate</p>
                <p className="text-xs text-slate-400 dark:text-slate-400">Stakeholder participation rate in practice drills</p>
                <Progress value={92} className="mt-3 h-1.5" />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Communication Timeline Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Recent Communication Timeline</h2>
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />
                {[
                  { date: "Feb 15, 2:14 PM", description: "Competitive Response playbook activated — 18 stakeholders notified via Slack, Email, SMS", badge: "Playbook #45", badgeClass: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400", dotClass: "bg-purple-500", icon: Zap },
                  { date: "Feb 10, 9:30 AM", description: "Monthly practice drill completed — 92% participation, avg response 2.8 min", badge: "Drill", badgeClass: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", dotClass: "bg-blue-500", icon: Activity },
                  { date: "Feb 3, 2:17 AM", description: "CRITICAL: Ransomware incident triggered — 47 stakeholders notified, all C-Suite reached in 45 sec", badge: "Emergency", badgeClass: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", dotClass: "bg-red-500", icon: AlertTriangle },
                  { date: "Jan 28, 10:00 AM", description: "M&A integration playbook activated — 45 stakeholders coordinated across 6 departments", badge: "Playbook #12", badgeClass: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400", dotClass: "bg-indigo-500", icon: Building2 },
                  { date: "Jan 15, 11:00 AM", description: "GDPR compliance audit response — 28 stakeholders notified, Legal team first response in 90 sec", badge: "Playbook #67", badgeClass: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", dotClass: "bg-green-500", icon: Shield },
                ].map((entry, index) => {
                  const EntryIcon = entry.icon;
                  return (
                    <div
                      key={index}
                      className={`relative pl-12 pb-8 last:pb-0 ${index % 2 === 0 ? 'bg-slate-50/50 dark:bg-slate-800/20' : ''} rounded-lg p-4 pl-12`}
                    >
                      <div className={`absolute left-2.5 top-5 w-3.5 h-3.5 rounded-full ${entry.dotClass} border-2 border-white dark:border-slate-900 z-10`} />
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <EntryIcon className="h-4 w-4 text-slate-400 dark:text-slate-300" />
                            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{entry.date}</span>
                          </div>
                          <p className="text-sm text-slate-700 dark:text-slate-200">{entry.description}</p>
                        </div>
                        <Badge className={`${entry.badgeClass} shrink-0`}>{entry.badge}</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RACI Matrix Visualization */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">RACI Matrix — Active Playbooks</h2>
          </div>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Stakeholder</TableHead>
                  <TableHead className="text-center">M&A Integration</TableHead>
                  <TableHead className="text-center">Crisis Response</TableHead>
                  <TableHead className="text-center">Competitive Counter</TableHead>
                  <TableHead className="text-center">Regulatory</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { name: "Sarah Chen", role: "CEO", raci: ["R", "I", "I", "I"] },
                  { name: "Michael Torres", role: "COO", raci: ["A", "A", "R", "I"] },
                  { name: "Jennifer Wright", role: "CFO", raci: ["C", "I", "C", "I"] },
                  { name: "David Park", role: "Gen Counsel", raci: ["C", "C", "I", "R"] },
                  { name: "Lisa Anderson", role: "VP Comms", raci: ["I", "R", "C", "C"] },
                  { name: "Robert Kim", role: "CISO", raci: ["I", "R", "I", "C"] },
                ].map((row) => (
                  <TableRow key={row.name}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 text-xs">
                            {row.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white text-sm">{row.name}</p>
                          <p className="text-xs text-slate-400 dark:text-slate-400">{row.role}</p>
                        </div>
                      </div>
                    </TableCell>
                    {row.raci.map((value, i) => {
                      const raciConfig: Record<string, string> = {
                        R: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
                        A: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                        C: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                        I: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
                      };
                      return (
                        <TableCell key={i} className="text-center">
                          <Badge className={`${raciConfig[value]} min-w-[28px] justify-center`}>{value}</Badge>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex flex-wrap gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 text-xs px-1.5">R</Badge>
                  <span className="text-slate-500 dark:text-slate-400">Responsible</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs px-1.5">A</Badge>
                  <span className="text-slate-500 dark:text-slate-400">Accountable</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-xs px-1.5">C</Badge>
                  <span className="text-slate-500 dark:text-slate-400">Consulted</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Badge className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-xs px-1.5">I</Badge>
                  <span className="text-slate-500 dark:text-slate-400">Informed</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingStakeholder ? 'Edit Stakeholder' : 'Add New Stakeholder'}</DialogTitle>
              <DialogDescription>
                Enter the stakeholder's contact information and notification preferences.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Smith"
                    data-testid="input-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john.smith@company.com"
                    data-testid="input-email"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                    data-testid="input-phone"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role *</Label>
                  <Select 
                    value={formData.role || ''} 
                    onValueChange={handleRoleChange}
                  >
                    <SelectTrigger data-testid="select-role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {STAKEHOLDER_ROLES.map(role => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.value} - {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select 
                    value={formData.department || ''} 
                    onValueChange={(v) => setFormData({ ...formData, department: v })}
                  >
                    <SelectTrigger data-testid="select-department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Level</Label>
                  <Select 
                    value={formData.level?.toString() || '3'} 
                    onValueChange={(v) => setFormData({ ...formData, level: parseInt(v) })}
                  >
                    <SelectTrigger data-testid="select-level">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(LEVEL_CONFIG).map(([level, config]) => (
                        <SelectItem key={level} value={level}>{config.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsibility">Responsibility</Label>
                <Textarea
                  id="responsibility"
                  value={formData.responsibility || ''}
                  onChange={(e) => setFormData({ ...formData, responsibility: e.target.value })}
                  placeholder="Describe their role and responsibilities during crisis response"
                  data-testid="input-responsibility"
                />
              </div>

              <div className="space-y-2">
                <Label>Notification Channels</Label>
                <div className="flex flex-wrap gap-2 p-3 border rounded-lg">
                  {NOTIFICATION_CHANNELS.map(channel => {
                    const Icon = channel.icon;
                    const isSelected = formData.notificationChannels?.includes(channel.id);
                    return (
                      <Button
                        key={channel.id}
                        type="button"
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleToggleChannel(channel.id)}
                        className={isSelected ? "bg-purple-600 hover:bg-purple-700" : ""}
                        data-testid={`button-channel-${channel.id}`}
                      >
                        <Icon className="h-4 w-4 mr-1" />
                        {channel.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.isBackup || false}
                    onCheckedChange={(v) => setFormData({ ...formData, isBackup: v })}
                    data-testid="switch-is-backup"
                  />
                  <Label>Is Backup Contact</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.isActive ?? true}
                    onCheckedChange={(v) => setFormData({ ...formData, isActive: v })}
                    data-testid="switch-is-active"
                  />
                  <Label>Active</Label>
                </div>
              </div>

              {formData.isBackup && (
                <div className="space-y-2">
                  <Label>Backup For</Label>
                  <Select 
                    value={formData.backupFor || ''} 
                    onValueChange={(v) => setFormData({ ...formData, backupFor: v })}
                  >
                    <SelectTrigger data-testid="select-backup-for">
                      <SelectValue placeholder="Select primary stakeholder" />
                    </SelectTrigger>
                    <SelectContent>
                      {stakeholders.filter(s => s.id !== editingStakeholder?.id && !s.isBackup).map(s => (
                        <SelectItem key={s.id} value={s.id}>{s.name} - {s.role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} data-testid="button-cancel">
                Cancel
              </Button>
              <Button onClick={handleSave} data-testid="button-save-stakeholder">
                {editingStakeholder ? 'Update Stakeholder' : 'Add Stakeholder'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Stakeholder</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove this stakeholder from the directory? They will no longer receive notifications.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
                data-testid="button-confirm-delete"
              >
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>

      <Footer />
    </>
  );
}
