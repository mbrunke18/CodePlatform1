import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  DollarSign,
  Users,
  Package,
  Clock,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  Search,
  Filter,
  Zap,
  Shield,
  Calendar,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { format, formatDistanceToNow, isAfter } from 'date-fns';

interface PreApprovedResourcesAdminProps {
  organizationId?: string;
  scenarioId?: string;
}

interface PreApprovedResource {
  id: string;
  organizationId: string;
  scenarioId?: string;
  resourceType: string;
  name: string;
  description?: string;
  allocatedAmount?: number;
  consumedAmount?: number;
  unit?: string;
  approvedBy?: string;
  approvalDate?: string;
  expiryDate?: string;
  status: string;
  conditions?: string;
  createdAt?: string;
}

const resourceTypeIcons: Record<string, any> = {
  budget: DollarSign,
  personnel: Users,
  equipment: Package,
  time: Clock,
  vendor: Shield,
};

const resourceTypeColors: Record<string, string> = {
  budget: 'text-green-500',
  personnel: 'text-blue-500',
  equipment: 'text-orange-500',
  time: 'text-purple-500',
  vendor: 'text-cyan-500',
};

export function PreApprovedResourcesAdmin({
  organizationId,
  scenarioId,
}: PreApprovedResourcesAdminProps) {
  const { toast } = useToast();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingResource, setEditingResource] = useState<PreApprovedResource | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  const [formData, setFormData] = useState<Partial<PreApprovedResource>>({
    resourceType: 'budget',
    name: '',
    description: '',
    allocatedAmount: 0,
    unit: '',
    status: 'active',
    conditions: '',
  });
  
  const { data: resources = [], isLoading } = useQuery<PreApprovedResource[]>({
    queryKey: ['/api/pre-approved-resources', organizationId, scenarioId],
    enabled: !!organizationId,
  });
  
  const createMutation = useMutation({
    mutationFn: async (data: Partial<PreApprovedResource>) => {
      const response = await apiRequest('POST', '/api/pre-approved-resources', {
        ...data,
        organizationId,
        scenarioId,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({ title: 'Resource Created', description: 'Pre-approved resource has been added.' });
      queryClient.invalidateQueries({ queryKey: ['/api/pre-approved-resources'] });
      setShowAddDialog(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: 'Creation Failed',
        description: error instanceof Error ? error.message : 'Failed to create resource',
        variant: 'destructive',
      });
    },
  });
  
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<PreApprovedResource> }) => {
      const response = await apiRequest('PATCH', `/api/pre-approved-resources/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: 'Resource Updated', description: 'Changes have been saved.' });
      queryClient.invalidateQueries({ queryKey: ['/api/pre-approved-resources'] });
      setEditingResource(null);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: 'Update Failed',
        description: error instanceof Error ? error.message : 'Failed to update resource',
        variant: 'destructive',
      });
    },
  });
  
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/pre-approved-resources/${id}`);
    },
    onSuccess: () => {
      toast({ title: 'Resource Deleted', description: 'Pre-approved resource has been removed.' });
      queryClient.invalidateQueries({ queryKey: ['/api/pre-approved-resources'] });
    },
    onError: (error) => {
      toast({
        title: 'Delete Failed',
        description: error instanceof Error ? error.message : 'Failed to delete resource',
        variant: 'destructive',
      });
    },
  });
  
  const activateMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest('POST', `/api/pre-approved-resources/${id}/activate`);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: 'Resource Activated', description: 'Resource is now available for use.' });
      queryClient.invalidateQueries({ queryKey: ['/api/pre-approved-resources'] });
    },
    onError: (error) => {
      toast({
        title: 'Activation Failed',
        description: error instanceof Error ? error.message : 'Failed to activate resource',
        variant: 'destructive',
      });
    },
  });
  
  const resetForm = () => {
    setFormData({
      resourceType: 'budget',
      name: '',
      description: '',
      allocatedAmount: 0,
      unit: '',
      status: 'active',
      conditions: '',
    });
  };
  
  const handleEdit = (resource: PreApprovedResource) => {
    setEditingResource(resource);
    setFormData({
      resourceType: resource.resourceType,
      name: resource.name,
      description: resource.description || '',
      allocatedAmount: resource.allocatedAmount || 0,
      unit: resource.unit || '',
      status: resource.status,
      conditions: resource.conditions || '',
      expiryDate: resource.expiryDate,
    });
    setShowAddDialog(true);
  };
  
  const handleSubmit = () => {
    if (editingResource) {
      updateMutation.mutate({ id: editingResource.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };
  
  const filteredResources = resources.filter((resource) => {
    const matchesSearch = 
      resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || resource.resourceType === filterType;
    const matchesStatus = filterStatus === 'all' || resource.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });
  
  const getStatusBadge = (status: string, expiryDate?: string) => {
    const isExpired = expiryDate && isAfter(new Date(), new Date(expiryDate));
    
    if (isExpired) {
      return (
        <Badge variant="outline" className="text-muted-foreground">
          <XCircle className="h-3 w-3 mr-1" />
          Expired
        </Badge>
      );
    }
    
    const statusConfig: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: any }> = {
      active: { variant: 'default', icon: CheckCircle },
      pending: { variant: 'secondary', icon: Clock },
      consumed: { variant: 'outline', icon: Package },
      expired: { variant: 'outline', icon: XCircle },
      revoked: { variant: 'destructive', icon: AlertTriangle },
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };
  
  const getUtilizationProgress = (resource: PreApprovedResource) => {
    if (!resource.allocatedAmount || resource.allocatedAmount === 0) return 0;
    return Math.round(((resource.consumedAmount || 0) / resource.allocatedAmount) * 100);
  };
  
  const formatResourceValue = (resource: PreApprovedResource) => {
    if (resource.resourceType === 'budget') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(resource.allocatedAmount || 0);
    }
    return `${resource.allocatedAmount || 0} ${resource.unit || ''}`;
  };
  
  const resourceTypeTotals = resources.reduce((acc, resource) => {
    if (!acc[resource.resourceType]) {
      acc[resource.resourceType] = { count: 0, totalAllocated: 0, totalConsumed: 0 };
    }
    acc[resource.resourceType].count++;
    acc[resource.resourceType].totalAllocated += resource.allocatedAmount || 0;
    acc[resource.resourceType].totalConsumed += resource.consumedAmount || 0;
    return acc;
  }, {} as Record<string, { count: number; totalAllocated: number; totalConsumed: number }>);
  
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Pre-Approved Resources
            </CardTitle>
            <CardDescription>
              Manage resources available for instant activation during execution
            </CardDescription>
          </div>
          <Button onClick={() => { resetForm(); setEditingResource(null); setShowAddDialog(true); }} data-testid="button-add-resource">
            <Plus className="h-4 w-4 mr-2" />
            Add Resource
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(resourceTypeIcons).map(([type, Icon]) => {
            const totals = resourceTypeTotals[type] || { count: 0, totalAllocated: 0 };
            return (
              <Card key={type} className="p-4">
                <div className="flex items-center gap-3">
                  <div className={cn("w-10 h-10 rounded-lg bg-muted flex items-center justify-center", resourceTypeColors[type])}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totals.count}</p>
                    <p className="text-xs text-muted-foreground capitalize">{type}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-resources"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[150px]" data-testid="select-filter-type">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="budget">Budget</SelectItem>
              <SelectItem value="personnel">Personnel</SelectItem>
              <SelectItem value="equipment">Equipment</SelectItem>
              <SelectItem value="time">Time</SelectItem>
              <SelectItem value="vendor">Vendor</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[150px]" data-testid="select-filter-status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="consumed">Consumed</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium">No Resources Found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {searchQuery || filterType !== 'all' || filterStatus !== 'all'
                ? 'Try adjusting your filters'
                : 'Add pre-approved resources to enable instant activation'}
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Resource</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Allocation</TableHead>
                  <TableHead>Utilization</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResources.map((resource) => {
                  const Icon = resourceTypeIcons[resource.resourceType] || Package;
                  const utilization = getUtilizationProgress(resource);
                  
                  return (
                    <TableRow key={resource.id} data-testid={`resource-row-${resource.id}`}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{resource.name}</p>
                          {resource.description && (
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {resource.description}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Icon className={cn("h-4 w-4", resourceTypeColors[resource.resourceType])} />
                          <span className="capitalize">{resource.resourceType}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{formatResourceValue(resource)}</span>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Progress value={utilization} className="h-2 w-24" />
                          <span className="text-xs text-muted-foreground">{utilization}% used</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(resource.status, resource.expiryDate)}
                      </TableCell>
                      <TableCell>
                        {resource.expiryDate ? (
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(resource.expiryDate), 'MMM d, yyyy')}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">No expiry</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" data-testid={`button-actions-${resource.id}`}>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(resource)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            {resource.status === 'pending' && (
                              <DropdownMenuItem onClick={() => activateMutation.mutate(resource.id)}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Activate
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => deleteMutation.mutate(resource.id)}
                              className="text-destructive"
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
          </ScrollArea>
        )}
      </CardContent>
      
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingResource ? 'Edit Resource' : 'Add Pre-Approved Resource'}
            </DialogTitle>
            <DialogDescription>
              Resources that can be instantly activated during execution
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="resourceType">Resource Type</Label>
              <Select 
                value={formData.resourceType} 
                onValueChange={(v) => setFormData({ ...formData, resourceType: v })}
              >
                <SelectTrigger id="resourceType" data-testid="select-resource-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="budget">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      Budget
                    </div>
                  </SelectItem>
                  <SelectItem value="personnel">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-500" />
                      Personnel
                    </div>
                  </SelectItem>
                  <SelectItem value="equipment">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-orange-500" />
                      Equipment
                    </div>
                  </SelectItem>
                  <SelectItem value="time">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-purple-500" />
                      Time Allocation
                    </div>
                  </SelectItem>
                  <SelectItem value="vendor">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-cyan-500" />
                      Vendor Contract
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Resource Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Emergency PR Budget"
                data-testid="input-resource-name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the resource..."
                rows={2}
                data-testid="input-resource-description"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Allocated Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.allocatedAmount}
                  onChange={(e) => setFormData({ ...formData, allocatedAmount: Number(e.target.value) })}
                  placeholder="0"
                  data-testid="input-resource-amount"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  placeholder={formData.resourceType === 'budget' ? 'USD' : 'hours, units, etc.'}
                  data-testid="input-resource-unit"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
              <Input
                id="expiryDate"
                type="date"
                value={formData.expiryDate || ''}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                data-testid="input-resource-expiry"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="conditions">Approval Conditions</Label>
              <Textarea
                id="conditions"
                value={formData.conditions}
                onChange={(e) => setFormData({ ...formData, conditions: e.target.value })}
                placeholder="Any conditions or restrictions..."
                rows={2}
                data-testid="input-resource-conditions"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!formData.name || createMutation.isPending || updateMutation.isPending}
              data-testid="button-save-resource"
            >
              {(createMutation.isPending || updateMutation.isPending) ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                editingResource ? 'Save Changes' : 'Add Resource'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
