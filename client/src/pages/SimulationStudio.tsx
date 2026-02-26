import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Play, 
  Pause,
  RotateCcw,
  Trophy,
  Users,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle2,
  Activity
} from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const NAVY = "#0A0F2E";
const NAVY_MID = "#141B45";
const GOLD = "#C9A84C";
const GOLD_LT = "#DFC178";
const TEAL = "#2B8A6E";
const TEAL_LT = "#3BAF8A";
const OFF = "#F8F7F4";
const BORDER = "#E8E4DC";
const MUTED = "#6B7280";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

export default function SimulationStudio() {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [simulationName, setSimulationName] = useState('');
  const [selectedScenarioId, setSelectedScenarioId] = useState('');
  const [participants, setParticipants] = useState('');
  const [duration, setDuration] = useState('60');
  const [complications, setComplications] = useState('');

  const { data: organizations = [] } = useQuery<any[]>({ 
    queryKey: ['/api/organizations'] 
  });
  const organizationId = organizations[0]?.id;

  const { data: scenarios = [] } = useQuery<any[]>({
    queryKey: ['/api/strategic-scenarios', organizationId],
    enabled: !!organizationId,
  });

  const { data: simulations = [], isLoading } = useQuery<any[]>({
    queryKey: ['/api/crisis-simulations', organizationId],
    enabled: !!organizationId,
  });

  const createSimulation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('POST', '/api/crisis-simulations', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/crisis-simulations'] });
      toast({
        title: 'Simulation Created',
        description: 'Crisis simulation has been scheduled successfully',
      });
      setIsCreating(false);
      resetForm();
    },
  });

  const startSimulation = useMutation({
    mutationFn: async (simulationId: string) => {
      return apiRequest('PATCH', `/api/crisis-simulations/${simulationId}/status`, { status: 'running' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/crisis-simulations'] });
      toast({
        title: 'Simulation Started',
        description: 'Crisis simulation is now running',
      });
    },
  });

  const resetForm = () => {
    setSimulationName('');
    setSelectedScenarioId('');
    setParticipants('');
    setDuration('60');
    setComplications('');
  };

  const handleCreateSimulation = () => {
    if (!simulationName || !selectedScenarioId || !organizationId) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    createSimulation.mutate({
      organizationId,
      scenarioId: selectedScenarioId,
      simulationName,
      facilitator: 'System',
      participants: participants.split(',').map(p => p.trim()).filter(Boolean),
      duration: parseInt(duration),
      complications: complications ? complications.split('\n').filter(Boolean) : [],
      status: 'scheduled',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return `bg-[${TEAL}]/12 text-[${TEAL}]`;
      case 'completed': return `bg-[${NAVY}]/12 text-[${NAVY}]`;
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return `bg-[${BORDER}] text-[${MUTED}]`;
    }
  };

  return (
    <PageLayout>
      <div className="p-6 space-y-6 bg-white" data-testid="simulation-studio-page">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <div style={{ width: 28, height: 2, background: GOLD }} />
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>Strategic Operations</span>
            </div>
            <h1 className="text-3xl font-bold mb-2 text-[#0A0F2E]" style={CG} data-testid="page-title">Simulation Studio</h1>
            <p className="text-[#6B7280]">
              War-game your crisis playbooks to turn abstract preparedness into measurable performance
            </p>
          </div>
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-[#0A0F2E] text-white hover:bg-[#141B45]" data-testid="button-create-simulation">
                <Play className="mr-2 h-5 w-5" />
                New Simulation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-white border-[#E8E4DC]">
              <DialogHeader>
                <DialogTitle style={CG} className="text-2xl text-[#0A0F2E]">Create Crisis Simulation</DialogTitle>
                <DialogDescription className="text-[#6B7280]">
                  Set up a war-gaming exercise to practice your crisis response
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="sim-name" className="text-[#0A0F2E] font-semibold">Simulation Name</Label>
                  <Input
                    id="sim-name"
                    placeholder="Q4 2026 Crisis Drill"
                    value={simulationName}
                    onChange={(e) => setSimulationName(e.target.value)}
                    className="border-[#E8E4DC]"
                    data-testid="input-simulation-name"
                  />
                </div>

                <div>
                  <Label htmlFor="scenario" className="text-[#0A0F2E] font-semibold">Scenario to Simulate</Label>
                  <Select value={selectedScenarioId} onValueChange={setSelectedScenarioId}>
                    <SelectTrigger id="scenario" className="border-[#E8E4DC]" data-testid="select-scenario">
                      <SelectValue placeholder="Select a crisis scenario" />
                    </SelectTrigger>
                    <SelectContent>
                      {scenarios.map((scenario) => (
                        <SelectItem key={scenario.id} value={scenario.id}>
                          {scenario.title || scenario.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="participants" className="text-[#0A0F2E] font-semibold">Participants (comma-separated emails)</Label>
                  <Input
                    id="participants"
                    placeholder="ceo@company.com, cfo@company.com, cto@company.com"
                    value={participants}
                    onChange={(e) => setParticipants(e.target.value)}
                    className="border-[#E8E4DC]"
                    data-testid="input-participants"
                  />
                </div>

                <div>
                  <Label htmlFor="duration" className="text-[#0A0F2E] font-semibold">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="60"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="border-[#E8E4DC]"
                    data-testid="input-duration"
                  />
                </div>

                <div>
                  <Label htmlFor="complications" className="text-[#0A0F2E] font-semibold">AI-Injected Complications (one per line, optional)</Label>
                  <Textarea
                    id="complications"
                    placeholder="CFO is on a flight and unreachable&#10;Main PR firm's system is down&#10;Social media amplifies the story faster than expected"
                    value={complications}
                    onChange={(e) => setComplications(e.target.value)}
                    rows={4}
                    className="border-[#E8E4DC]"
                    data-testid="textarea-complications"
                  />
                  <p className="text-xs text-[#6B7280] mt-1">
                    Add realistic complications to test your team's adaptability
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" className="border-[#E8E4DC] text-[#0A0F2E]" onClick={() => setIsCreating(false)} data-testid="button-cancel">
                  Cancel
                </Button>
                <Button className="bg-[#C9A84C] text-[#0A0F2E] font-bold hover:bg-[#DFC178]" onClick={handleCreateSimulation} data-testid="button-create-confirm">
                  Create Simulation
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Value Proposition */}
        <Card className="bg-white border-[#E8E4DC] shadow-none overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#2B8A6E]" />
          <CardHeader>
            <CardTitle style={CG} className="text-[#0A0F2E] text-xl">Why Simulations Matter</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-[#0A0F2E] space-y-3">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5 text-[#2B8A6E]" />
              <p><strong className="font-bold">Find Bottlenecks:</strong> Discover that your Legal counsel takes 22 minutes to respond, not the planned 2 minutes</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5 text-[#2B8A6E]" />
              <p><strong className="font-bold">Build Muscle Memory:</strong> Turn a 72-hour chaos into 20 minutes, then 15, then the target 12 minutes</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5 text-[#2B8A6E]" />
              <p><strong className="font-bold">Prove ROI:</strong> Demonstrate to the board that your crisis preparedness is real, not theoretical</p>
            </div>
          </CardContent>
        </Card>

        {/* Simulations List */}
        <Card className="border-[#E8E4DC] bg-white shadow-none">
          <CardHeader>
            <CardTitle style={CG} className="text-[#0A0F2E] text-2xl">Scheduled & Past Simulations</CardTitle>
            <CardDescription className="text-[#6B7280]">Track your war-gaming exercises and performance improvements</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-[#6B7280]">Loading simulations...</div>
            ) : simulations.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <Activity className="h-12 w-12 mx-auto text-[#6B7280]" />
                <p className="text-[#6B7280]">No simulations scheduled yet</p>
                <Button className="bg-[#0A0F2E] text-white" onClick={() => setIsCreating(true)} data-testid="button-create-first">
                  Create Your First Simulation
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {simulations.map((sim) => (
                  <div
                    key={sim.id}
                    className="border border-[#E8E4DC] rounded-lg p-4 space-y-3 hover:bg-[#F8F7F4] transition-colors"
                    data-testid={`card-simulation-${sim.id}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-[#0A0F2E]">{sim.simulationName}</h3>
                        <p className="text-sm text-[#6B7280]">
                          Scenario: {scenarios.find(s => s.id === sim.scenarioId)?.title || 'Unknown'}
                        </p>
                      </div>
                      <Badge className={`${getStatusColor(sim.status)} border-none`} data-testid={`badge-status-${sim.id}`}>
                        {sim.status.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-[#6B7280]" />
                        <span className="text-[#0A0F2E] font-medium">{sim.participants?.length || 0} participants</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-[#6B7280]" />
                        <span className="text-[#0A0F2E] font-medium">{sim.duration} minutes</span>
                      </div>
                      {sim.results && (
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-[#C9A84C]" />
                          <span className="text-[#0A0F2E] font-medium">Results available</span>
                        </div>
                      )}
                    </div>

                    {sim.status === 'scheduled' && (
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          className="bg-[#0A0F2E] text-white hover:bg-[#141B45]"
                          onClick={() => startSimulation.mutate(sim.id)}
                          data-testid={`button-start-${sim.id}`}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Start Simulation
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
