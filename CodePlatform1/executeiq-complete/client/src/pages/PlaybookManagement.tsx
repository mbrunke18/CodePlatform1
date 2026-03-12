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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Copy,
  Target,
  Shield,
  Zap,
  Clock,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  FileText,
  Play,
} from "lucide-react";

import type { Playbook } from "@shared/schema";

const CATEGORY_CONFIG = {
  offense: { label: "Offense", icon: Target, color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
  defense: { label: "Defense", icon: Shield, color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30" },
  special_teams: { label: "Special Teams", icon: Zap, color: "text-purple-600", bg: "bg-purple-100 dark:bg-purple-900/30" },
};

const STATUS_CONFIG = {
  draft: { label: "Draft", color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300" },
  ready: { label: "Ready", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  active: { label: "Active", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  archived: { label: "Archived", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
};

const PRIORITY_CONFIG = {
  critical: { label: "Critical", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  high: { label: "High", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
  medium: { label: "Medium", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  low: { label: "Low", color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" },
};

export default function PlaybookManagement() {
  const [, setLocation] = useLocation();
  const { organization } = useCustomer();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const { data: playbooksData, isLoading } = useQuery<Playbook[]>({
    queryKey: ["/api/playbooks", organization?.id],
    queryFn: async () => {
      const res = await fetch(`/api/playbooks?organizationId=${organization?.id || ''}`);
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
    enabled: true,
  });
  
  const playbooks = Array.isArray(playbooksData) ? playbooksData : [];

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/playbooks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/playbooks"] });
      toast({
        title: "Playbook Deleted",
        description: "The playbook has been permanently deleted.",
      });
      setDeleteId(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete playbook. Please try again.",
        variant: "destructive",
      });
    },
  });

  const filteredPlaybooks = playbooks.filter((pb) => {
    const matchesSearch = !search || 
      pb.name.toLowerCase().includes(search.toLowerCase()) ||
      (pb.domain && pb.domain.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === "all" || pb.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || pb.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const stats = {
    total: playbooks.length,
    active: playbooks.filter(p => p.status === 'active').length,
    ready: playbooks.filter(p => p.status === 'ready').length,
    draft: playbooks.filter(p => p.status === 'draft').length,
  };

  const getCategoryIcon = (category: string | null) => {
    const config = CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG];
    if (!config) return Target;
    return config.icon;
  };

  return (
    <>
      <StandardNav />
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white" data-testid="text-page-title">
              Playbook Management
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Create, customize, and manage your organization's strategic playbooks
            </p>
          </div>
          <Button 
            onClick={() => setLocation('/playbook-customize/new')}
            className="bg-purple-600 hover:bg-purple-700"
            data-testid="button-create-playbook"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Playbook
          </Button>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card data-testid="stat-total">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <FileText className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
                  <p className="text-sm text-slate-500">Total Playbooks</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card data-testid="stat-active">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                  <p className="text-sm text-slate-500">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card data-testid="stat-ready">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Play className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">{stats.ready}</p>
                  <p className="text-sm text-slate-500">Ready</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card data-testid="stat-draft">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <Edit className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-600">{stats.draft}</p>
                  <p className="text-sm text-slate-500">Drafts</p>
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
                  placeholder="Search playbooks..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                  data-testid="input-search"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-white dark:bg-slate-900 text-sm"
                  data-testid="select-status-filter"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="ready">Ready</option>
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </select>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-white dark:bg-slate-900 text-sm"
                  data-testid="select-category-filter"
                >
                  <option value="all">All Categories</option>
                  <option value="offense">Offense</option>
                  <option value="defense">Defense</option>
                  <option value="special_teams">Special Teams</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mx-auto"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mx-auto"></div>
              </div>
            </CardContent>
          </Card>
        ) : filteredPlaybooks.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                {playbooks.length === 0 ? "No Playbooks Yet" : "No Matching Playbooks"}
              </h3>
              <p className="text-slate-500 mb-6 max-w-md mx-auto">
                {playbooks.length === 0 
                  ? "Create your first playbook to start building your strategic response library."
                  : "Try adjusting your search or filter criteria."}
              </p>
              {playbooks.length === 0 && (
                <Button onClick={() => setLocation('/playbook-customize/new')} data-testid="button-create-first">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Playbook
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Playbook</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead className="text-right">Budget</TableHead>
                  <TableHead className="text-right">Uses</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlaybooks.map((playbook) => {
                  const CategoryIcon = getCategoryIcon(playbook.category);
                  const categoryConfig = CATEGORY_CONFIG[playbook.category as keyof typeof CATEGORY_CONFIG];
                  const statusConfig = STATUS_CONFIG[playbook.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.draft;
                  const priorityConfig = PRIORITY_CONFIG[playbook.priority as keyof typeof PRIORITY_CONFIG] || PRIORITY_CONFIG.medium;

                  return (
                    <TableRow 
                      key={playbook.id} 
                      className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      data-testid={`row-playbook-${playbook.id}`}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${categoryConfig?.bg || 'bg-slate-100 dark:bg-slate-800'}`}>
                            <CategoryIcon className={`h-4 w-4 ${categoryConfig?.color || 'text-slate-600'}`} />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">{playbook.name}</p>
                            <p className="text-sm text-slate-500 truncate max-w-xs">{playbook.domain}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={categoryConfig?.color}>
                          {categoryConfig?.label || 'Uncategorized'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusConfig.color}>
                          {statusConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={priorityConfig.color}>
                          {priorityConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {playbook.totalBudget ? (
                          <span className="text-slate-600 dark:text-slate-400" data-testid={`text-budget-${playbook.id}`}>
                            ${Number(playbook.totalBudget).toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-slate-400" data-testid={`text-budget-${playbook.id}`}>-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-slate-600 dark:text-slate-400" data-testid={`text-uses-${playbook.id}`}>
                          {playbook.timesUsed || 0}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" data-testid={`button-actions-${playbook.id}`}>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={() => setLocation(`/playbook-command/${playbook.id}`)}
                              data-testid={`menu-view-${playbook.id}`}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => setLocation(`/playbook-customize/${playbook.id}`)}
                              data-testid={`menu-edit-${playbook.id}`}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => setLocation(`/playbook-customize/new?template=${playbook.id}`)}
                              data-testid={`menu-duplicate-${playbook.id}`}
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => setDeleteId(playbook.id)}
                              className="text-red-600 focus:text-red-600"
                              data-testid={`menu-delete-${playbook.id}`}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        )}

        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Playbook</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this playbook? This action cannot be undone and will permanently remove the playbook and all its configuration.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteId && deleteMutation.mutate(deleteId)}
                className="bg-red-600 hover:bg-red-700"
                data-testid="button-confirm-delete"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>

      <Footer />
    </>
  );
}
