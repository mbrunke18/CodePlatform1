/**
 * Signal-to-Playbook Mapper
 * 
 * Connect triggers to automatic playbook recommendations and activation.
 * Provides a visual interface for mapping signal categories to playbooks.
 */

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Database,
  Filter,
  Link,
  Play,
  Plus,
  Search,
  Settings,
  Target,
  Unlink,
  Zap
} from 'lucide-react';

interface SignalCategory {
  id: string;
  name: string;
  shortName: string;
  description: string;
  phase: 'external' | 'internal';
  color: string;
  recommendedPlaybooks: string[];
  dataPoints: any[];
}

interface PlaybookMapping {
  signalCategoryId: string;
  playbookId: string;
  playbookName: string;
  autoActivate: boolean;
  priority: number;
}

export function SignalPlaybookMapper() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Fetch signal catalog
  const { data: catalogResponse, isLoading: catalogLoading } = useQuery<{
    success: boolean;
    data: SignalCategory[];
  }>({
    queryKey: ['/api/intelligence/catalog']
  });

  // Fetch playbooks - returns array directly
  const { data: playbooksData, isLoading: playbooksLoading } = useQuery<any[]>({
    queryKey: ['/api/scenario-templates']
  });

  const catalog = catalogResponse?.data || [];
  const playbooks = Array.isArray(playbooksData) ? playbooksData : [];
  const isLoading = catalogLoading || playbooksLoading;

  // Filter categories
  const filteredCategories = catalog.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group playbooks by category for easy lookup
  const playbooksByCategory = playbooks.reduce((acc: Record<string, any[]>, pb: any) => {
    const category = pb.category || 'General';
    if (!acc[category]) acc[category] = [];
    acc[category].push(pb);
    return acc;
  }, {});

  const selectedCategoryData = catalog.find(c => c.id === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Link className="w-6 h-6 text-primary" />
            Signal-Playbook Mapping
          </h2>
          <p className="text-muted-foreground">
            Connect intelligence signals to automated playbook recommendations
          </p>
        </div>
        <Button data-testid="button-configure-mappings">
          <Settings className="w-4 h-4 mr-2" />
          Configure Auto-Activation
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          label="Signal Categories"
          value={catalog.length}
          icon={<Database className="w-5 h-5" />}
          color="blue"
        />
        <StatCard
          label="Available Playbooks"
          value={playbooks.length}
          icon={<Play className="w-5 h-5" />}
          color="purple"
        />
        <StatCard
          label="Active Mappings"
          value={catalog.reduce((sum, c) => sum + c.recommendedPlaybooks.length, 0)}
          icon={<Link className="w-5 h-5" />}
          color="green"
        />
        <StatCard
          label="Auto-Activate Enabled"
          value={0}
          icon={<Zap className="w-5 h-5" />}
          color="amber"
        />
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search signal categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          data-testid="input-search-mappings"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Signal Categories List */}
        <div className="col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Signal Categories</CardTitle>
              <CardDescription>Select a category to manage playbook mappings</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                {filteredCategories.map((category) => (
                  <button
                    key={category.id}
                    className={`w-full p-4 text-left border-b hover:bg-muted/50 transition-colors flex items-center gap-3 ${
                      selectedCategory === category.id ? 'bg-primary/10 border-l-4 border-l-primary' : ''
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                    data-testid={`category-select-${category.id}`}
                  >
                    <div 
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{category.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {category.recommendedPlaybooks.length} playbooks linked
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                  </button>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Mapping Configuration */}
        <div className="col-span-2">
          {selectedCategoryData ? (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: selectedCategoryData.color }}
                  ></div>
                  <div>
                    <CardTitle>{selectedCategoryData.name}</CardTitle>
                    <CardDescription>{selectedCategoryData.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Mappings */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium flex items-center gap-2">
                      <Link className="w-4 h-4" />
                      Linked Playbooks
                    </h4>
                    <Button variant="outline" size="sm" data-testid="button-add-mapping">
                      <Plus className="w-4 h-4 mr-1" />
                      Add Playbook
                    </Button>
                  </div>
                  
                  {selectedCategoryData.recommendedPlaybooks.length === 0 ? (
                    <div className="p-8 text-center border rounded-lg border-dashed">
                      <Unlink className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-muted-foreground text-sm">
                        No playbooks linked to this signal category
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedCategoryData.recommendedPlaybooks.map((playbookName, idx) => (
                        <PlaybookMappingCard
                          key={idx}
                          playbookName={playbookName}
                          signalCategory={selectedCategoryData.name}
                          priority={idx + 1}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Signal Triggers */}
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Trigger Conditions
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedCategoryData.dataPoints.slice(0, 4).map((dp) => (
                      <div 
                        key={dp.id}
                        className="p-3 border rounded-lg text-sm"
                      >
                        <div className="font-medium mb-1">{dp.name}</div>
                        {dp.defaultThreshold && (
                          <Badge variant="outline" className="text-xs">
                            {dp.defaultThreshold.operator} {dp.defaultThreshold.value}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                  {selectedCategoryData.dataPoints.length > 4 && (
                    <Button variant="link" size="sm" className="px-0">
                      View all {selectedCategoryData.dataPoints.length} triggers
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  )}
                </div>

                {/* Auto-Activation Settings */}
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">Auto-Activation</h4>
                      <p className="text-sm text-muted-foreground">
                        Automatically recommend playbooks when signals trigger
                      </p>
                    </div>
                    <Switch data-testid="switch-auto-activation" />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    When enabled, M will automatically recommend linked playbooks when any signal in this category triggers an alert.
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-[500px] flex items-center justify-center">
              <CardContent className="text-center">
                <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h4 className="font-semibold mb-2">Select a Signal Category</h4>
                <p className="text-muted-foreground text-sm">
                  Choose a signal category from the list to manage its playbook mappings
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({
  label,
  value,
  icon,
  color
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    green: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
            {icon}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-xs text-muted-foreground">{label}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Playbook Mapping Card
function PlaybookMappingCard({
  playbookName,
  signalCategory,
  priority
}: {
  playbookName: string;
  signalCategory: string;
  priority: number;
}) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
          {priority}
        </div>
        <div>
          <div className="font-medium">{playbookName}</div>
          <div className="text-xs text-muted-foreground">
            Linked to {signalCategory} signals
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="outline">Priority {priority}</Badge>
        <Button variant="ghost" size="sm" data-testid={`button-unlink-${playbookName}`}>
          <Unlink className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export default SignalPlaybookMapper;
