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
} from "lucide-react";

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
            <p className="text-slate-600 dark:text-slate-400 mt-1">
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
                  <Users className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
                  <p className="text-sm text-slate-500">Total Stakeholders</p>
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
                  <p className="text-sm text-slate-500">C-Suite</p>
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
                  <p className="text-sm text-slate-500">Executives</p>
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
                  <p className="text-sm text-slate-500">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
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
              <p className="text-slate-500 mb-6">Start by adding stakeholders to your directory.</p>
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
                        <span className="text-slate-600 dark:text-slate-400">{stakeholder.department}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={levelConfig.color}>
                          {levelConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                            <Mail className="h-3 w-3" />
                            <span className="truncate max-w-[150px]" data-testid={`text-email-${stakeholder.id}`}>{stakeholder.email}</span>
                          </div>
                          {stakeholder.phone && (
                            <div className="flex items-center gap-1 text-slate-500">
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
                                <Icon className="h-3 w-3 text-slate-600 dark:text-slate-400" />
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
