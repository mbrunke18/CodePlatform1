import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import PageLayout from "@/components/layout/PageLayout";
import { ExecutionStageGuide } from "@/components/ExecutionStageGuide";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
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

import { Progress } from "@/components/ui/progress";
import {
  Plus,
  Search,
  Clock,
  Users,
  CheckCircle2,
  Circle,
  ArrowRight,
  Timer,
  GitBranch,
  Edit,
  Trash2,
  AlertTriangle,
  Layers,
  ListChecks,
  Library,
  Filter,
  Briefcase,
  Shield,
  Zap,
  Target,
  BookOpen,
  Loader2,
  Activity,
  Home,
} from "lucide-react";

import { 
  ENTERPRISE_TASK_LIBRARY, 
  TASK_CATEGORIES, 
  IDEA_PHASES,
  type TaskTemplate,
  type TaskCategory,
  type IdeaPhase,
  getTaskLibraryStats,
} from "@shared/constants/taskLibrary";

interface Task {
  id: string;
  templateId?: string; // Original template ID from library for duplicate detection
  title: string;
  description: string;
  assignedRole: string;
  estimatedMinutes: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  dependsOn: string[];
  approvalRequired: string;
  deliverables: string;
  playbookId?: string;
  playbookName?: string;
}

const STAKEHOLDER_ROLES = [
  "CEO", "COO", "CFO", "CLO", "CTO", "CISO", "CMO", "CHRO",
  "General Counsel", "VP Operations", "VP Strategy", "VP Communications",
  "Director of Risk", "Director of Compliance", "Project Manager",
  "Legal Counsel", "HR Director", "IT Director", "Security Lead"
];

const PRIORITY_CONFIG = {
  critical: { label: "Critical", color: "bg-red-600 text-white rounded-none" },
  high: { label: "High", color: "bg-[#0A0F2E] text-white rounded-none" },
  medium: { label: "Medium", color: "bg-[#DFC178] text-[#0A0F2E] rounded-none" },
  low: { label: "Low", color: "bg-[#F8F7F4] text-[#6B7280] border border-[#E8E4DC] rounded-none" },
};

const STATUS_CONFIG = {
  pending: { label: "Pending", icon: Circle, color: "text-[#6B7280]" },
  in_progress: { label: "In Progress", icon: Timer, color: "text-[#0A0F2E]" },
  completed: { label: "Completed", icon: CheckCircle2, color: "text-[#2B8A6E]" },
  blocked: { label: "Blocked", icon: AlertTriangle, color: "text-red-600" },
};

const APPROVAL_TYPES = [
  { value: "none", label: "No approval needed" },
  { value: "manager", label: "Manager approval" },
  { value: "director", label: "Director approval" },
  { value: "vp", label: "VP approval" },
  { value: "c_suite", label: "C-Suite approval" },
  { value: "board", label: "Board approval" }
];

const generateId = () => Date.now().toString(36);

// Convert library template to Readiness Protocol task format
const templateToTask = (template: TaskTemplate): Task => ({
  id: template.id,
  templateId: template.id, // Preserve original template ID for duplicate detection
  title: template.title,
  description: template.description,
  assignedRole: template.suggestedOwner,
  estimatedMinutes: template.estimatedMinutes,
  priority: template.priority,
  status: 'pending',
  dependsOn: [],
  approvalRequired: template.approvalRequired,
  deliverables: template.deliverables,
});

// Pre-load critical tasks from the library - these are the essential tasks everyone needs
const CRITICAL_PRELOADED_TASKS = ENTERPRISE_TASK_LIBRARY
  .filter(t => t.priority === 'critical' || (t.priority === 'high' && t.phase === 'detect'))
  .slice(0, 12)
  .map(templateToTask);

// Build dependency chain for critical tasks - preserve templateId for duplicate detection
const DEFAULT_TASKS: Task[] = CRITICAL_PRELOADED_TASKS.map((task, index) => ({
  ...task,
  id: String(index + 1),
  templateId: task.templateId, // Keep original template ID
  dependsOn: index === 0 ? [] : [String(index)],
}));

const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

export default function TaskManagement({ embedded }: { embedded?: boolean }) {
  const { organization } = useCustomer();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [tasks, setTasks] = useState<Task[]>(DEFAULT_TASKS);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"playbook" | "library" | "sequences">("playbook");
  
  interface SequenceSummary {
    domainName: string;
    playbookCount: string;
    taskCount: string;
  }
  
  const { data: sequenceSummary, isLoading: sequencesLoading } = useQuery<SequenceSummary[]>({
    queryKey: ['/api/playbook-task-sequences/summary'],
  });
  
  // Library filters
  const [librarySearch, setLibrarySearch] = useState("");
  const [selectedPhase, setSelectedPhase] = useState<IdeaPhase | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | "all">("all");
  
  // Track which library tasks have been added (by templateId for proper duplicate detection)
  const addedLibraryIds = useMemo(() => new Set(tasks.map(t => t.templateId).filter(Boolean)), [tasks]);

  const [formData, setFormData] = useState<Partial<Task>>({
    title: '',
    description: '',
    assignedRole: '',
    estimatedMinutes: 15,
    priority: 'medium',
    status: 'pending',
    dependsOn: [],
    approvalRequired: 'none',
    deliverables: '',
  });
  
  // Filter library tasks
  const filteredLibraryTasks = useMemo(() => {
    return ENTERPRISE_TASK_LIBRARY.filter(task => {
      const matchesSearch = !librarySearch || 
        task.title.toLowerCase().includes(librarySearch.toLowerCase()) ||
        task.description.toLowerCase().includes(librarySearch.toLowerCase()) ||
        task.suggestedOwner.toLowerCase().includes(librarySearch.toLowerCase());
      
      const matchesPhase = selectedPhase === "all" || task.phase === selectedPhase;
      const matchesCategory = selectedCategory === "all" || task.category === selectedCategory;
      
      return matchesSearch && matchesPhase && matchesCategory;
    });
  }, [librarySearch, selectedPhase, selectedCategory]);
  
  // Library stats
  const libraryStats = useMemo(() => getTaskLibraryStats(), []);
  
  // Add task from library
  const handleAddFromLibrary = (template: TaskTemplate) => {
    // Prevent duplicates using templateId
    if (addedLibraryIds.has(template.id)) {
      toast({
        title: "Already Added",
        description: `"${template.title}" is already in your Readiness Protocol library.`,
        variant: "destructive",
      });
      return;
    }
    
    const existingIds = tasks.map(t => parseInt(t.id)).filter(n => !isNaN(n));
    const nextId = Math.max(0, ...existingIds) + 1;
    
    const newTask: Task = {
      ...templateToTask(template),
      id: String(nextId),
      templateId: template.id, // Preserve for duplicate detection
      dependsOn: tasks.length > 0 ? [tasks[tasks.length - 1].id] : [],
    };
    
    setTasks([...tasks, newTask]);
    toast({
      title: "Task Added",
      description: `"${template.title}" has been added to your Readiness Protocol library.`,
    });
  };
  
  // Add multiple tasks from library by phase
  const handleAddPhaseTasksFromLibrary = (phase: IdeaPhase) => {
    // Check by template id for proper duplicate detection
    const phaseTasks = ENTERPRISE_TASK_LIBRARY.filter(t => t.phase === phase && !addedLibraryIds.has(t.id));
    if (phaseTasks.length === 0) {
      toast({
        title: "No New Tasks",
        description: `All ${IDEA_PHASES[phase].label} tasks are already in your Readiness Protocol library.`,
      });
      return;
    }
    
    let lastId = Math.max(0, ...tasks.map(t => parseInt(t.id)).filter(n => !isNaN(n)));
    const newTasks = phaseTasks.map((template, index) => {
      lastId++;
      return {
        ...templateToTask(template),
        id: String(lastId),
        templateId: template.id, // Preserve templateId for duplicate detection
        dependsOn: index === 0 && tasks.length > 0 ? [tasks[tasks.length - 1].id] : index > 0 ? [String(lastId - 1)] : [],
      };
    });
    
    setTasks([...tasks, ...newTasks]);
    toast({
      title: "Tasks Added",
      description: `${newTasks.length} ${IDEA_PHASES[phase].label} tasks have been added.`,
    });
  };

  const filteredTasks = tasks.filter(task =>
    !search || 
    task.title.toLowerCase().includes(search.toLowerCase()) ||
    task.assignedRole.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    totalMinutes: tasks.reduce((sum, t) => sum + t.estimatedMinutes, 0),
  };

  const handleOpenCreate = () => {
    setFormData({
      title: '',
      description: '',
      assignedRole: '',
      estimatedMinutes: 15,
      priority: 'medium',
      status: 'pending',
      dependsOn: [],
      approvalRequired: 'none',
      deliverables: '',
    });
    setEditingTask(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (task: Task) => {
    setFormData({ ...task });
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.assignedRole) {
      toast({
        title: "Missing Fields",
        description: "Please fill in title and assigned role.",
        variant: "destructive",
      });
      return;
    }

    if (editingTask) {
      setTasks(tasks.map(t => 
        t.id === editingTask.id 
          ? { ...t, ...formData } as Task
          : t
      ));
      toast({ title: "Task Updated", description: "The task has been updated." });
    } else {
      const newTask: Task = {
        id: generateId(),
        title: formData.title || '',
        description: formData.description || '',
        assignedRole: formData.assignedRole || '',
        estimatedMinutes: formData.estimatedMinutes || 15,
        priority: formData.priority as Task['priority'] || 'medium',
        status: formData.status as Task['status'] || 'pending',
        dependsOn: formData.dependsOn || [],
        approvalRequired: formData.approvalRequired || 'none',
        deliverables: formData.deliverables || '',
      };
      setTasks([...tasks, newTask]);
      toast({ title: "Task Created", description: "New task has been added." });
    }
    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      setTasks(tasks.filter(t => t.id !== deleteId));
      setDeleteId(null);
      toast({ title: "Task Deleted", description: "The task has been removed." });
    }
  };

  const handleToggleDependency = (taskId: string) => {
    const current = formData.dependsOn || [];
    if (current.includes(taskId)) {
      setFormData({ ...formData, dependsOn: current.filter(id => id !== taskId) });
    } else {
      setFormData({ ...formData, dependsOn: [...current, taskId] });
    }
  };

  return (
    <PageLayout embedded={embedded}>
      <div style={{ background: "#0A0F2E", padding: "40px 48px", position: "relative", overflow: "hidden" }}>
        <div style={{ 
          position: "absolute", 
          inset: 0, 
          backgroundImage: "linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)", 
          backgroundSize: "44px 44px" 
        }} />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 28, height: 2, background: "rgba(255,255,255,0.35)", flexShrink: 0 }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.55)" }}>Task Management</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 style={{ ...CG, fontWeight: 600, fontSize: "clamp(32px,4vw,48px)", lineHeight: 1.1, color: "#fff" }}>
                Execution <em style={{ fontStyle: "italic", color: "#DFC178" }}>Task Library</em>
              </h1>
              <p className="text-white/60 mt-1 max-w-2xl">
                Define and manage execution tasks with dependencies and approval gates
              </p>
            </div>
            <Button 
              onClick={handleOpenCreate}
              className="bg-[#C9A84C] text-[#0A0F2E] font-bold hover:bg-[#DFC178] border-none"
              data-testid="button-create-task"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>
      </div>
      
      <ExecutionStageGuide variant="compact" />
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-[#0A0F2E]">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="text-[#0A0F2E] hover:text-[#C9A84C] p-1 h-auto">
                <Home className="h-4 w-4" />
              </Button>
            </Link>
            <span>/</span>
            <span>Configuration</span>
            <span>/</span>
            <span className="text-[#0A0F2E] font-medium">Task Management</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          <Card data-testid="stat-total" className="border-[#E8E4DC] bg-[#F8F7F4]">
            <CardContent className="p-6">
              <div className="flex flex-col gap-2">
                <div style={{ width: 32, height: 32, background: "#0A0F2E", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ListChecks className="h-4 w-4 text-white" />
                </div>
                <div style={{ ...CG, fontSize: 32, fontWeight: 600, color: "#0A0F2E", lineHeight: 1 }}>{stats.total}</div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6B7280" }}>Total Tasks</div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="stat-pending" className="border-[#E8E4DC] bg-[#F8F7F4]">
            <CardContent className="p-6">
              <div className="flex flex-col gap-2">
                <div style={{ width: 32, height: 32, background: "#0A0F2E", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Circle className="h-4 w-4 text-white" />
                </div>
                <div style={{ ...CG, fontSize: 32, fontWeight: 600, color: "#0A0F2E", lineHeight: 1 }}>{stats.pending}</div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6B7280" }}>Pending</div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="stat-in-progress" className="border-[#E8E4DC] bg-[#F8F7F4]">
            <CardContent className="p-6">
              <div className="flex flex-col gap-2">
                <div style={{ width: 32, height: 32, background: "#0A0F2E", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Timer className="h-4 w-4 text-white" />
                </div>
                <div style={{ ...CG, fontSize: 32, fontWeight: 600, color: "#2B8A6E", lineHeight: 1 }}>{stats.inProgress}</div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6B7280" }}>Active Execution</div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="stat-completed" className="border-[#E8E4DC] bg-[#F8F7F4]">
            <CardContent className="p-6">
              <div className="flex flex-col gap-2">
                <div style={{ width: 32, height: 32, background: "#0A0F2E", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <CheckCircle2 className="h-4 w-4 text-white" />
                </div>
                <div style={{ ...CG, fontSize: 32, fontWeight: 600, color: "#2B8A6E", lineHeight: 1 }}>{stats.completed}</div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6B7280" }}>Completed</div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="stat-duration" className="border-[#E8E4DC] bg-[#F8F7F4]">
            <CardContent className="p-6">
              <div className="flex flex-col gap-2">
                <div style={{ width: 32, height: 32, background: "#0A0F2E", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Clock className="h-4 w-4 text-white" />
                </div>
                <div style={{ ...CG, fontSize: 32, fontWeight: 600, color: "#C9A84C", lineHeight: 1 }}>{stats.totalMinutes}m</div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6B7280" }}>Total Duration</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "Readiness Protocol" | "library" | "sequences")} className="mb-6">
          <TabsList className="bg-white border border-[#E8E4DC] rounded-none h-12 p-0 gap-8 px-6">
            <TabsTrigger 
              value="Readiness Protocol" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#C9A84C] data-[state=active]:bg-transparent data-[state=active]:text-[#0A0F2E] text-[#6B7280] font-bold text-[10px] uppercase tracking-wider px-2" 
              data-testid="tab-Readiness Protocol-tasks"
            >
              Readiness Protocol Tasks ({tasks.length})
            </TabsTrigger>
            <TabsTrigger 
              value="library" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#C9A84C] data-[state=active]:bg-transparent data-[state=active]:text-[#0A0F2E] text-[#6B7280] font-bold text-[10px] uppercase tracking-wider px-2" 
              data-testid="tab-task-library"
            >
              Task Library ({libraryStats.total})
            </TabsTrigger>
            <TabsTrigger 
              value="sequences" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#C9A84C] data-[state=active]:bg-transparent data-[state=active]:text-[#0A0F2E] text-[#6B7280] font-bold text-[10px] uppercase tracking-wider px-2" 
              data-testid="tab-execution-sequences"
            >
              Execution Sequences
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="Readiness Protocol" className="mt-6">
            <Card className="mb-6 rounded-none border-[#E8E4DC]">
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#6B7280]" />
                  <Input
                    placeholder="Search tasks..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 bg-white border-[#E8E4DC] rounded-none"
                    data-testid="input-search"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <Card className="rounded-none border-[#E8E4DC]">
              <CardContent className="py-16 text-center">
                <ListChecks className="h-12 w-12 mx-auto mb-4 text-[#6B7280]" />
                <h3 className="text-lg font-medium text-[#0A0F2E] mb-2">No Tasks Found</h3>
                <p className="text-[#6B7280] mb-6">Start by creating your first execution task.</p>
                <Button onClick={handleOpenCreate} className="bg-[#0A0F2E] text-white hover:bg-[#141B45]" data-testid="button-add-first-task">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredTasks.map((task, index) => {
              const StatusIcon = STATUS_CONFIG[task.status].icon;
              const priorityConfig = PRIORITY_CONFIG[task.priority];
              const dependencies = task.dependsOn.map(id => tasks.find(t => t.id === id)?.title || id).join(', ');

              return (
                <Card key={task.id} data-testid={`card-task-${task.id}`} className="rounded-none border-[#E8E4DC] hover:border-[#C9A84C] transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center gap-1 min-w-[40px]">
                        <div className="w-8 h-8 rounded-none bg-[#0A0F2E] flex items-center justify-center text-white text-sm font-bold">
                          {index + 1}
                        </div>
                        {index < filteredTasks.length - 1 && (
                          <div className="w-0.5 h-8 bg-[#E8E4DC]" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <StatusIcon className={`h-4 w-4 ${STATUS_CONFIG[task.status].color}`} />
                              <h3 className="font-semibold text-[#0A0F2E]">{task.title}</h3>
                            </div>
                            <p className="text-sm text-[#6B7280] mb-3">{task.description}</p>
                            
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="outline" className="text-[9px] uppercase tracking-wider font-bold border-[#E8E4DC] text-[#6B7280]">
                                <Users className="h-3 w-3 mr-1" />
                                {task.assignedRole}
                              </Badge>
                              <Badge variant="outline" className="text-[9px] uppercase tracking-wider font-bold border-[#E8E4DC] text-[#6B7280]">
                                <Clock className="h-3 w-3 mr-1" />
                                {task.estimatedMinutes} min
                              </Badge>
                              <Badge className={`${priorityConfig.color} text-[9px] uppercase tracking-wider font-bold rounded-none`}>
                                {priorityConfig.label}
                              </Badge>
                              {task.approvalRequired !== 'none' && (
                                <Badge variant="outline" className="text-[9px] uppercase tracking-wider font-bold text-[#0A0F2E] border-[#E8E4DC]">
                                  <GitBranch className="h-3 w-3 mr-1" />
                                  {APPROVAL_TYPES.find(a => a.value === task.approvalRequired)?.label}
                                </Badge>
                              )}
                              {task.dependsOn.length > 0 && (
                                <Badge variant="outline" className="text-xs text-[#C9A84C] border-[#C9A84C]/30">
                                  <ArrowRight className="h-3 w-3 mr-1" />
                                  Depends on: {dependencies}
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleOpenEdit(task)}
                              className="text-[#0A0F2E] hover:bg-[#0A0F2E]/5"
                              data-testid={`button-edit-${task.id}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setDeleteId(task.id)}
                              className="text-[#0A0F2E] hover:text-red-700 hover:bg-red-50"
                              data-testid={`button-delete-${task.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-[#E8E4DC] flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                              <Briefcase className="h-3.5 w-3.5" />
                              <span>{task.playbookName || 'Global Library'}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {task.status !== 'completed' && (
                              <Button 
                                size="sm" 
                                className="bg-[#2B8A6E] hover:bg-[#3BAF8A] text-white h-8 text-[10px] uppercase font-bold tracking-wider rounded-none"
                                onClick={() => {
                                  setTasks(tasks.map(t => t.id === task.id ? { ...t, status: 'completed' } : t));
                                  toast({ title: "Task Completed", description: `"${task.title}" marked as complete.` });
                                }}
                              >
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Mark Complete
                              </Button>
                            )}
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 text-[10px] uppercase font-bold tracking-wider border-[#E8E4DC] text-[#0A0F2E] rounded-none"
                              onClick={() => {
                                const statusOrder: Task['status'][] = ['pending', 'in_progress', 'completed', 'blocked'];
                                const currentIndex = statusOrder.indexOf(task.status);
                                const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
                                setTasks(tasks.map(t => t.id === task.id ? { ...t, status: nextStatus } : t));
                              }}
                            >
                              Change Status
                              <ArrowRight className="h-3 w-3 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
            </div>
          </TabsContent>
          
          <TabsContent value="library" className="mt-6">
            <div className="space-y-6">
              {/* Library Header with Stats */}
              <Card className="bg-[#F8F7F4] border-[#E8E4DC]">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-[#0A0F2E] flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-[#0A0F2E]" />
                        Enterprise Task Library
                      </h2>
                      <p className="text-[#6B7280] mt-1">
                        {libraryStats.total} pre-defined tasks across all IDEA phases. Add tasks to your Readiness Protocol to ensure everyone knows their role.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-white">
                        <Target className="h-3 w-3 mr-1 text-[#0A0F2E]" />
                        {libraryStats.phases.identify} IDENTIFY
                      </Badge>
                      <Badge variant="outline" className="bg-white">
                        <Zap className="h-3 w-3 mr-1 text-[#C9A84C]" />
                        {libraryStats.phases.detect} DETECT
                      </Badge>
                      <Badge variant="outline" className="bg-white">
                        <Shield className="h-3 w-3 mr-1 text-[#2B8A6E]" />
                        {libraryStats.phases.execute} EXECUTE
                      </Badge>
                      <Badge variant="outline" className="bg-white">
                        <Briefcase className="h-3 w-3 mr-1 text-[#0A0F2E]" />
                        {libraryStats.phases.advance} ADVANCE
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Quick Add by Phase */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(Object.keys(IDEA_PHASES) as IdeaPhase[]).map((phase) => (
                  <Button
                    key={phase}
                    variant="outline"
                    className="h-auto py-3 flex flex-col items-center gap-1"
                    onClick={() => handleAddPhaseTasksFromLibrary(phase)}
                    data-testid={`button-add-phase-${phase}`}
                  >
                    <span className={`text-xs font-bold ${IDEA_PHASES[phase].color}`}>
                      {IDEA_PHASES[phase].label}
                    </span>
                    <span className="text-xs text-[#6B7280]">Add all tasks</span>
                  </Button>
                ))}
              </div>
              
              {/* Filters */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#6B7280]" />
                      <Input
                        placeholder="Search tasks..."
                        value={librarySearch}
                        onChange={(e) => setLibrarySearch(e.target.value)}
                        className="pl-10"
                        data-testid="input-library-search"
                      />
                    </div>
                    <Select value={selectedPhase} onValueChange={(v) => setSelectedPhase(v as IdeaPhase | "all")}>
                      <SelectTrigger className="w-40" data-testid="select-filter-phase">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Phase" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Phases</SelectItem>
                        {(Object.keys(IDEA_PHASES) as IdeaPhase[]).map((phase) => (
                          <SelectItem key={phase} value={phase}>{IDEA_PHASES[phase].label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as TaskCategory | "all")}>
                      <SelectTrigger className="w-48" data-testid="select-filter-category">
                        <Layers className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {(Object.keys(TASK_CATEGORIES) as TaskCategory[]).map((cat) => (
                          <SelectItem key={cat} value={cat}>{TASK_CATEGORIES[cat].label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
              
              {/* Task Library Grid */}
              <div className="grid gap-4 md:grid-cols-2">
                {filteredLibraryTasks.map((template) => {
                  const isAdded = addedLibraryIds.has(template.id);
                  const categoryConfig = TASK_CATEGORIES[template.category];
                  const phaseConfig = IDEA_PHASES[template.phase];
                  
                  return (
                    <Card 
                      key={template.id} 
                      className={`transition-all ${isAdded ? 'opacity-60 bg-[#2B8A6E]/10' : ''}`}
                      data-testid={`card-library-task-${template.id}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs font-bold ${phaseConfig.color}`}>
                                {phaseConfig.label}
                              </span>
                              <Badge className={`text-xs ${categoryConfig.color}`}>
                                {categoryConfig.label}
                              </Badge>
                            </div>
                            <h3 className="font-semibold text-[#0A0F2E] text-sm mb-1">
                              {template.title}
                            </h3>
                            <p className="text-xs text-[#6B7280] mb-2 line-clamp-2">
                              {template.description}
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              <Badge variant="outline" className="text-xs">
                                <Users className="h-3 w-3 mr-1" />
                                {template.suggestedOwner}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                {template.estimatedMinutes}m
                              </Badge>
                              <Badge className={PRIORITY_CONFIG[template.priority].color}>
                                {PRIORITY_CONFIG[template.priority].label}
                              </Badge>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant={isAdded ? "ghost" : "default"}
                            disabled={isAdded}
                            onClick={() => handleAddFromLibrary(template)}
                            className={isAdded ? "text-[#2B8A6E]" : ""}
                            data-testid={`button-add-library-task-${template.id}`}
                          >
                            {isAdded ? (
                              <>
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                Added
                              </>
                            ) : (
                              <>
                                <Plus className="h-4 w-4 mr-1" />
                                Add
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              
              {filteredLibraryTasks.length === 0 && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Library className="h-12 w-12 mx-auto mb-4 text-[#0A0F2E]" />
                    <h3 className="text-lg font-medium text-[#0A0F2E] mb-2">No Tasks Found</h3>
                    <p className="text-[#6B7280]">Try adjusting your filters or search terms.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="sequences" className="mt-6">
            {sequencesLoading ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <Loader2 className="h-8 w-8 mx-auto mb-4 text-[#C9A84C] animate-spin" />
                  <p className="text-[#6B7280]">Loading execution sequences...</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <Card className="bg-gradient-to-r from-[#0A0F2E] to-[#141B45] dark:from-[#0A0F2E]/40 dark:to-[#141B45]/40 border-[#C9A84C] dark:border-[#C9A84C]">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-bold text-[#0A0F2E] flex items-center gap-2">
                          <Activity className="h-5 w-5 text-[#C9A84C]" />
                          Readiness Protocol Execution Sequences
                        </h2>
                        <p className="text-[#6B7280] mt-1">
                          Real task sequences from the database across all strategic domains
                        </p>
                      </div>
                      <div className="flex gap-4">
                        <div className="text-center px-4 py-2 bg-white dark:bg-[#0A0F2E] rounded-none border">
                          <p className="text-2xl font-bold text-[#C9A84C]">
                            {sequenceSummary?.reduce((sum, d) => sum + parseInt(d.playbookCount), 0)?.toLocaleString() ?? '0'}
                          </p>
                          <p className="text-xs text-[#6B7280]">Total Readiness Protocols</p>
                        </div>
                        <div className="text-center px-4 py-2 bg-white dark:bg-[#0A0F2E] rounded-none border">
                          <p className="text-2xl font-bold text-[#0A0F2E]">
                            {sequenceSummary?.reduce((sum, d) => sum + parseInt(d.taskCount), 0)?.toLocaleString() ?? '0'}
                          </p>
                          <p className="text-xs text-[#6B7280]">Total Task Sequences</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sequenceSummary?.map((domain) => {
                    const playbookCount = parseInt(domain.playbookCount);
                    const taskCount = parseInt(domain.taskCount);
                    const coverage = Math.min(100, Math.round((taskCount / (playbookCount * 8)) * 100));
                    
                    const isDefense = /regulatory|brand|compliance|legal/i.test(domain.domainName);
                    const isOffense = /market|growth|revenue|sales/i.test(domain.domainName);
                    const DomainIcon = isDefense ? Shield : isOffense ? Target : Zap;
                    const iconColor = isDefense ? "text-[#0A0F2E]" : isOffense ? "text-[#2B8A6E]" : "text-[#C9A84C]";
                    const iconBg = isDefense ? "bg-[#F8F7F4] dark:bg-[#0A0F2E]/30" : isOffense ? "bg-[#2B8A6E]/15 dark:bg-[#2B8A6E]/30" : "bg-[#0A0F2E] dark:bg-[#C9A84C]/30";
                    const progressColor = coverage >= 80 ? "bg-[#2B8A6E]" : coverage >= 50 ? "bg-[#C9A84C]" : "bg-red-600";
                    
                    return (
                      <Card key={domain.domainName} className=" ">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-none ${iconBg}`}>
                                <DomainIcon className={`h-5 w-5 ${iconColor}`} />
                              </div>
                              <div>
                                <CardTitle className="text-base">{domain.domainName}</CardTitle>
                                <CardDescription className="text-xs mt-0.5">
                                  {isDefense ? "Risk & Resilience" : isOffense ? "Growth & Positioning" : "Transformation"}
                                </CardDescription>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {coverage}%
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0 space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-[#6B7280] flex items-center gap-1">
                              <BookOpen className="h-3.5 w-3.5" />
                              {playbookCount} Readiness Protocols
                            </span>
                            <span className="text-[#6B7280] flex items-center gap-1">
                              <ListChecks className="h-3.5 w-3.5" />
                              {taskCount} tasks
                            </span>
                          </div>
                          <div>
                            <div className="flex justify-between text-xs text-[#6B7280] mb-1">
                              <span>Task Coverage</span>
                              <span>{taskCount} / {playbookCount * 8}</span>
                            </div>
                            <div className="h-2 w-full bg-[#E8E4DC] dark:bg-[#141B45] rounded-none overflow-hidden">
                              <div
                                className={`h-full rounded-none transition-all ${progressColor}`}
                                style={{ width: `${coverage}%` }}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                
                {(!sequenceSummary || sequenceSummary.length === 0) && (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Activity className="h-12 w-12 mx-auto mb-4 text-[#0A0F2E]" />
                      <h3 className="text-lg font-medium text-[#0A0F2E] mb-2">No Execution Sequences</h3>
                      <p className="text-[#6B7280]">No Readiness Protocol task sequences found in the database.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingTask ? 'Edit Task' : 'Create New Task'}</DialogTitle>
              <DialogDescription>
                Define the task details, dependencies, and approval requirements.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Task Title *</Label>
                <Input
                  id="title"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter task title"
                  data-testid="input-task-title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what this task involves"
                  data-testid="input-task-description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Assigned Role *</Label>
                  <Select 
                    value={formData.assignedRole || ''} 
                    onValueChange={(v) => setFormData({ ...formData, assignedRole: v })}
                  >
                    <SelectTrigger data-testid="select-assigned-role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {STAKEHOLDER_ROLES.map(role => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimatedMinutes">Estimated Duration (min)</Label>
                  <Input
                    id="estimatedMinutes"
                    type="number"
                    value={formData.estimatedMinutes || 15}
                    onChange={(e) => setFormData({ ...formData, estimatedMinutes: parseInt(e.target.value) || 15 })}
                    data-testid="input-estimated-minutes"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select 
                    value={formData.priority || 'medium'} 
                    onValueChange={(v) => setFormData({ ...formData, priority: v as Task['priority'] })}
                  >
                    <SelectTrigger data-testid="select-priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select 
                    value={formData.status || 'pending'} 
                    onValueChange={(v) => setFormData({ ...formData, status: v as Task['status'] })}
                  >
                    <SelectTrigger data-testid="select-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="blocked">Blocked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Approval Required</Label>
                <Select 
                  value={formData.approvalRequired || 'none'} 
                  onValueChange={(v) => setFormData({ ...formData, approvalRequired: v })}
                >
                  <SelectTrigger data-testid="select-approval">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {APPROVAL_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Dependencies (Tasks that must complete first)</Label>
                <div className="grid grid-cols-2 gap-2 p-3 border rounded-none max-h-40 overflow-y-auto">
                  {tasks.filter(t => t.id !== editingTask?.id).map(task => (
                    <div key={task.id} className="flex items-center gap-2">
                      <Switch
                        checked={formData.dependsOn?.includes(task.id) || false}
                        onCheckedChange={() => handleToggleDependency(task.id)}
                      />
                      <span className="text-sm truncate">{task.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliverables">Deliverables</Label>
                <Textarea
                  id="deliverables"
                  value={formData.deliverables || ''}
                  onChange={(e) => setFormData({ ...formData, deliverables: e.target.value })}
                  placeholder="Expected outputs from this task"
                  data-testid="input-deliverables"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-[#E8E4DC] text-[#0A0F2E]" data-testid="button-cancel">
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-[#0A0F2E] text-white hover:bg-[#141B45]" data-testid="button-save-task">
                {editingTask ? 'Update Task' : 'Create Task'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Task</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this task? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
                data-testid="button-confirm-delete"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </PageLayout>
  );
}
