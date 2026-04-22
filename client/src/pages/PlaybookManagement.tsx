import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import PageLayout from "@/components/layout/PageLayout";
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
import { BrandStamp } from "@/components/BrandStamp";

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

const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

const CATEGORY_CONFIG = {
  offense: { label: "Growth & Positioning", icon: Target, color: "text-[#2B8A6E]", bg: "bg-[#2B8A6E]/12" },
  defense: { label: "Risk & Resilience", icon: Shield, color: "text-[#0A0F2E]", bg: "bg-[#0A0F2E]/12" },
  special_teams: { label: "Transformation", icon: Zap, color: "text-[#C9A84C]", bg: "bg-[#C9A84C]/12" },
};

const STATUS_CONFIG = {
  draft: { label: "Draft", color: "bg-slate-100 text-slate-700 dark:bg-[#141B45] dark:text-slate-300" },
  ready: { label: "Ready", color: "bg-[#2B8A6E]/12 text-[#3BAF8A]" },
  active: { label: "Active", color: "bg-[#C9A84C]/12 text-[#C9A84C]" },
  archived: { label: "Archived", color: "bg-amber-100 text-[#C9A84C] dark:bg-amber-900/30 dark:text-amber-400" },
};

const PRIORITY_CONFIG = {
  critical: { label: "Critical", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  high: { label: "High", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
  medium: { label: "Medium", color: "bg-[#F8F7F4] text-[#0A0F2E] dark:bg-[#0A0F2E]/30 dark:text-[#0A0F2E]" },
  low: { label: "Low", color: "bg-slate-100 text-gray-800 dark:bg-[#141B45] dark:text-slate-300" },
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
        title: "Prepared response Deleted",
        description: "The prepared response has been permanently deleted.",
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
    <PageLayout>
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
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.45)" }}>Prepared response Management</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 style={{ ...CG, fontWeight: 600, fontSize: "clamp(32px,4vw,48px)", lineHeight: 1.1, color: "#fff" }}>
                Strategic <em style={{ fontStyle: "italic", color: "#DFC178" }}>Readiness Prepared responses</em>
              </h1>
              <p className="text-white/60 mt-1 max-w-2xl">
                Create, customize, and manage your organization's strategic prepared responses
              </p>
            </div>
            <Button 
              onClick={() => setLocation('/playbook-customize/new')}
              className="bg-[#0A0F2E] text-white hover:bg-[#141B45]"
              data-testid="button-create-prepared response"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Prepared response
            </Button>
          </div>
        </div>
      </div>
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card data-testid="stat-total" className="border-[#E8E4DC] bg-[#F8F7F4]">
            <CardContent className="p-6">
              <div className="flex flex-col gap-2">
                <div style={{ width: 32, height: 32, background: "#0A0F2E", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <FileText className="h-4 w-4 text-white" />
                </div>
                <div style={{ ...CG, fontSize: 32, fontWeight: 600, color: "#0A0F2E", lineHeight: 1 }}>{stats.total}</div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6B7280" }}>Total Prepared responses</div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="stat-active" className="border-[#E8E4DC] bg-[#F8F7F4]">
            <CardContent className="p-6">
              <div className="flex flex-col gap-2">
                <div style={{ width: 32, height: 32, background: "#0A0F2E", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <div style={{ ...CG, fontSize: 32, fontWeight: 600, color: "#2B8A6E", lineHeight: 1 }}>{stats.active}</div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6B7280" }}>Active</div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="stat-ready" className="border-[#E8E4DC] bg-[#F8F7F4]">
            <CardContent className="p-6">
              <div className="flex flex-col gap-2">
                <div style={{ width: 32, height: 32, background: "#0A0F2E", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Play className="h-4 w-4 text-white" />
                </div>
                <div style={{ ...CG, fontSize: 32, fontWeight: 600, color: "#C9A84C", lineHeight: 1 }}>{stats.ready}</div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6B7280" }}>Ready</div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="stat-draft" className="border-[#E8E4DC] bg-[#F8F7F4]">
            <CardContent className="p-6">
              <div className="flex flex-col gap-2">
                <div style={{ width: 32, height: 32, background: "#0A0F2E", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Edit className="h-4 w-4 text-white" />
                </div>
                <div style={{ ...CG, fontSize: 32, fontWeight: 600, color: "#0A0F2E", lineHeight: 1 }}>{stats.draft}</div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6B7280" }}>Drafts</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-800 dark:text-slate-200" />
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
                  className="px-3 py-2 border rounded-none bg-white dark:bg-[#0A0F2E] text-sm"
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
                  className="px-3 py-2 border rounded-none bg-white dark:bg-[#0A0F2E] text-sm"
                  data-testid="select-category-filter"
                >
                  <option value="all">All Categories</option>
                  <option value="offense">Growth & Positioning</option>
                  <option value="defense">Risk & Resilience</option>
                  <option value="special_teams">Transformation</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-slate-200 dark:bg-[#141B45] rounded w-1/3 mx-auto"></div>
                <div className="h-4 bg-slate-200 dark:bg-[#141B45] rounded w-1/2 mx-auto"></div>
              </div>
            </CardContent>
          </Card>
        ) : filteredPlaybooks.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-800 dark:text-slate-400" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                {playbooks.length === 0 ? "No Prepared responses Yet" : "No Matching Prepared responses"}
              </h3>
              <p className="text-gray-800 mb-6 max-w-md mx-auto">
                {playbooks.length === 0 
                  ? "Create your first prepared response to start building your strategic response library."
                  : "Try adjusting your search or filter criteria."}
              </p>
              {playbooks.length === 0 && (
                <Button onClick={() => setLocation('/playbook-customize/new')} data-testid="button-create-first">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Prepared response
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Prepared response</TableHead>
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
                      className="cursor-pointer hover:bg-slate-50 dark:hover:bg-[#141B45]/50"
                      data-testid={`row-prepared response-${playbook.id}`}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className={`p-2 ${categoryConfig?.bg || 'bg-slate-100 dark:bg-[#141B45]'}`}>
                            <CategoryIcon className={`h-4 w-4 ${categoryConfig?.color || 'text-gray-800'}`} />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">{playbook.name}</p>
                            <p className="text-sm text-gray-800 truncate max-w-xs">{playbook.domain}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <BrandStamp variant="dual" size="md" className="mb-8" />
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
                          <span className="text-gray-800 dark:text-slate-300" data-testid={`text-budget-${playbook.id}`}>
                            ${Number(playbook.totalBudget).toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-gray-800 dark:text-slate-200" data-testid={`text-budget-${playbook.id}`}>-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-gray-800 dark:text-slate-300" data-testid={`text-uses-${playbook.id}`}>
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
                              onClick={() => setLocation(`/prepared response-library/${playbook.id}`)}
                              data-testid={`menu-view-${playbook.id}`}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => setLocation(`/prepared response-customize/${playbook.id}`)}
                              data-testid={`menu-edit-${playbook.id}`}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => setLocation(`/prepared response-customize/new?template=${playbook.id}`)}
                              data-testid={`menu-duplicate-${playbook.id}`}
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => setDeleteId(playbook.id)}
                              className="text-red-700 focus:text-red-600"
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
              <AlertDialogTitle>Delete Prepared response</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this prepared response? This action cannot be undone and will permanently remove the prepared response and all its configuration.
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
    </PageLayout>
  );
}
