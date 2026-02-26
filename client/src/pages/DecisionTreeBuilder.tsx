import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StandardNav from "@/components/layout/StandardNav";
import Footer from "@/components/layout/Footer";
import { ArrowLeft, Plus, Save, AlertCircle, Trash2, CheckCircle, BookOpen } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface DecisionOption {
  id: string;
  label: string;
  description: string;
  pros: string[];
  cons: string[];
  criteria: string[];
  triggersPlaybook: string;
}

export default function DecisionTreeBuilder() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [scenario, setScenario] = useState('');
  const [domain, setDomain] = useState('');
  const [category, setCategory] = useState('');
  const [question, setQuestion] = useState('');
  const [decisionMaker, setDecisionMaker] = useState('CEO');
  const [timeWindow, setTimeWindow] = useState('15');
  const [mustWeighIn, setMustWeighIn] = useState<string[]>(['General Counsel', 'CISO']);
  
  const [options, setOptions] = useState<DecisionOption[]>([
    {
      id: '1',
      label: '',
      description: '',
      pros: [],
      cons: [],
      criteria: [],
      triggersPlaybook: ''
    }
  ]);
  
  const addOption = () => {
    setOptions([...options, {
      id: String(options.length + 1),
      label: '',
      description: '',
      pros: [],
      cons: [],
      criteria: [],
      triggersPlaybook: ''
    }]);
  };
  
  const removeOption = (id: string) => {
    if (options.length > 1) {
      setOptions(options.filter(o => o.id !== id));
    }
  };
  
  const toggleWeighIn = (role: string) => {
    if (mustWeighIn.includes(role)) {
      setMustWeighIn(mustWeighIn.filter(r => r !== role));
    } else {
      setMustWeighIn([...mustWeighIn, role]);
    }
  };
  
  const createTreeMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('POST', '/api/decision-trees', data);
    },
    onSuccess: () => {
      toast({
        title: "Decision Tree Saved",
        description: "Your pre-staged decision tree has been created successfully.",
      });
      setLocation('/decisions');
    },
    onError: (error) => {
      toast({
        title: "Save Failed",
        description: "Failed to save decision tree. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  const handleSave = () => {
    if (!scenario || !question) {
      toast({
        title: "Missing required fields",
        description: "Please fill in the scenario name and decision question.",
        variant: "destructive"
      });
      return;
    }
    
    if (!domain || !category) {
      toast({
        title: "Missing category selection",
        description: "Please select a domain and strategic category (Offense, Defense, or Special Teams).",
        variant: "destructive"
      });
      return;
    }
    
    const decisionPoint = {
      id: '1',
      order: 1,
      question,
      decisionMaker,
      mustWeighIn,
      timeWindowMinutes: parseInt(timeWindow),
      options: options.map((opt, idx) => ({
        id: opt.id,
        label: opt.label || `Option ${String.fromCharCode(65 + idx)}`,
        description: opt.description,
        pros: opt.pros,
        cons: opt.cons,
        criteria: opt.criteria.map(c => ({ condition: c, met: null })),
        triggersPlaybookId: opt.triggersPlaybook || undefined,
      })),
      historicalDecisions: [],
    };
    
    createTreeMutation.mutate({
      name: scenario,
      scenario,
      domain,
      category,
      decisionPoints: [decisionPoint],
    });
  };
  
  const weighInRoles = ['General Counsel', 'Chief Communications Officer', 'CISO', 'CFO', 'COO', 'CTO'];
  const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
  const optionColors = [
    'border-[#2B8A6E]/30 bg-[#2B8A6E]/5',
    'border-[#0A0F2E]/30 bg-[#0A0F2E]/5',
    'border-[#C9A84C]/30 bg-[#C9A84C]/5',
    'border-[#DFC178]/30 bg-[#DFC178]/5',
    'border-[#E8E4DC] bg-white',
    'border-[#E8E4DC] bg-[#F8F7F4]',
  ];
  const buttonColors = ['bg-[#2B8A6E]', 'bg-[#0A0F2E]', 'bg-[#C9A84C]', 'bg-[#DFC178]', 'bg-[#6B7280]', 'bg-[#141B45]'];

  const NAVY = "#0A0F2E";
  const GOLD = "#C9A84C";
  const TEAL = "#2B8A6E";
  const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      <StandardNav />
      
      <div className="container mx-auto px-4 py-20 max-w-5xl">
        <Button 
          variant="ghost" 
          className="mb-8 hover:bg-white/50 text-[#6B7280] font-bold text-[10px] tracking-widest uppercase px-0"
          onClick={() => setLocation('/decisions')}
          data-testid="button-back"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        
        <div className="mb-12">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.4em", textTransform: "uppercase" as const, color: GOLD }}>Strategic Planning Hub</span>
          </div>
          <h1 style={CG} className="text-5xl font-bold text-[#0A0F2E] mb-4" data-testid="page-title">
            Create Decision Tree
          </h1>
          <p className="text-xl text-[#6B7280] leading-relaxed max-w-3xl">
            Pre-stage critical decisions before scenarios occur. Head coaches prepare decision trees all week—so should you.
          </p>
        </div>
        
        <Card className="mb-12 bg-[#0A0F2E] border-none rounded-none shadow-xl overflow-hidden relative" data-testid="preparation-mindset-card">
          <div style={{ 
            position: "absolute", 
            inset: 0, 
            backgroundImage: "radial-gradient(#C9A84C 0.5px, transparent 0.5px)", 
            backgroundSize: "24px 24px",
            opacity: 0.1
          }} />
          <CardContent className="p-10 relative z-10">
            <div className="flex items-start gap-8">
              <div className="w-16 h-16 bg-[#C9A84C] rounded-none flex items-center justify-center shrink-0">
                <BookOpen className="h-8 w-8 text-[#0A0F2E]" />
              </div>
              <div className="space-y-6">
                <h3 style={CG} className="font-bold text-white text-3xl leading-tight italic">
                  "I'm not thinking about what I'm doing. I prepared all week so I could just react."
                </h3>
                <div className="space-y-2">
                  <p className="text-[#DFC178] text-sm font-bold tracking-widest uppercase">
                    — The mindset of elite teams in high-pressure environments
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-white/10">
                  <p className="text-white/60 text-sm leading-relaxed">
                    Elite performers don't figure out the play in the moment. They studied, prepared, and know exactly what to do when the opportunity or threat appears.
                  </p>
                  <p className="text-white/60 text-sm leading-relaxed">
                    <strong>Do the same for your business.</strong> Pre-stage critical decisions for any scenario—
                    <span style={{ color: TEAL }} className="font-bold">seizing an M&A opportunity</span>, 
                    <span className="text-[#DFC178] font-bold">defending against a crisis</span>, or 
                    <span className="text-white font-bold">driving AI transformation</span>. 
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-12">
          <Card className="rounded-none border-[#E8E4DC] shadow-sm bg-white p-8">
            <CardHeader className="px-0 pt-0 mb-8 border-b border-[#F8F7F4] pb-6">
              <CardTitle style={CG} className="text-3xl font-bold text-[#0A0F2E]">Scenario Information</CardTitle>
              <CardDescription className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280] mt-1">What high-stakes decision needs a pre-staged tree?</CardDescription>
            </CardHeader>
            <CardContent className="px-0 pb-0 space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#0A0F2E]">
                  Scenario Name <span className="text-red-700">*</span>
                </label>
                <Input 
                  placeholder="e.g., M&A Target Acquisition, Customer Data Breach, AI Model Deployment"
                  className="rounded-none border-[#E8E4DC] h-12 px-4 focus-visible:ring-[#C9A84C]"
                  value={scenario}
                  onChange={(e) => setScenario(e.target.value)}
                  data-testid="input-scenario"
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#0A0F2E]">
                    Domain <span className="text-red-700">*</span>
                  </label>
                  <Select value={domain} onValueChange={setDomain}>
                    <SelectTrigger className="rounded-none border-[#E8E4DC] h-12 px-4" data-testid="select-domain">
                      <SelectValue placeholder="Select a domain..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-none border-[#E8E4DC]">
                      <SelectItem value="crisis-response">Crisis Response</SelectItem>
                      <SelectItem value="regulatory-compliance">Regulatory Compliance</SelectItem>
                      <SelectItem value="cyber-incidents">Cyber Incidents</SelectItem>
                      <SelectItem value="competitive-response">Competitive Response</SelectItem>
                      <SelectItem value="market-entry">Market Entry</SelectItem>
                      <SelectItem value="ma-integration">M&A Integration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#0A0F2E]">
                    Strategic Category <span className="text-red-700">*</span>
                  </label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="rounded-none border-[#E8E4DC] h-12 px-4" data-testid="select-category">
                      <SelectValue placeholder="Select a category..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-none border-[#E8E4DC]">
                      <SelectItem value="defense">Defense - Protect Value</SelectItem>
                      <SelectItem value="offense">Offense - Seize Opportunities</SelectItem>
                      <SelectItem value="special_teams">Special Teams - Change the Game</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="rounded-none border-[#E8E4DC] shadow-sm bg-white p-8">
            <CardHeader className="px-0 pt-0 mb-8 border-b border-[#F8F7F4] pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle style={CG} className="text-3xl font-bold text-[#0A0F2E]">Decision Point #1</CardTitle>
                  <CardDescription className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280] mt-1">The critical question that needs a fast answer</CardDescription>
                </div>
                <Badge className="bg-[#2B8A6E]/10 text-[#2B8A6E] rounded-none px-4 py-2 text-[10px] font-bold tracking-widest uppercase border-none">
                  Target: {timeWindow} min
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="px-0 pb-0 space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#0A0F2E]">
                  Decision Question <span className="text-red-700">*</span>
                </label>
                <Textarea 
                  placeholder="e.g., Should we disclose the breach publicly immediately?"
                  className="rounded-none border-[#E8E4DC] min-h-[100px] p-4 focus-visible:ring-[#C9A84C]"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  data-testid="input-question"
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#0A0F2E]">
                    Primary Decision Maker
                  </label>
                  <Select value={decisionMaker} onValueChange={setDecisionMaker}>
                    <SelectTrigger className="rounded-none border-[#E8E4DC] h-12 px-4" data-testid="select-decision-maker">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-none border-[#E8E4DC]">
                      <SelectItem value="CEO">CEO</SelectItem>
                      <SelectItem value="CFO">CFO</SelectItem>
                      <SelectItem value="COO">COO</SelectItem>
                      <SelectItem value="General Counsel">General Counsel</SelectItem>
                      <SelectItem value="CISO">CISO</SelectItem>
                      <SelectItem value="CTO">CTO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#0A0F2E]">
                    Time Window (minutes)
                  </label>
                  <Input 
                    type="number" 
                    placeholder="15"
                    className="rounded-none border-[#E8E4DC] h-12 px-4 focus-visible:ring-[#C9A84C]"
                    value={timeWindow}
                    onChange={(e) => setTimeWindow(e.target.value)}
                    data-testid="input-time-window"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#0A0F2E]">
                  Must Weigh In Before Decision
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {weighInRoles.map((role) => (
                    <label 
                      key={role} 
                      className={`flex items-center gap-3 p-4 border transition-all cursor-pointer ${mustWeighIn.includes(role) ? 'border-[#C9A84C] bg-[#C9A84C]/5' : 'border-[#F8F7F4] bg-[#F8F7F4] hover:border-[#E8E4DC]'}`}
                    >
                      <input 
                        type="checkbox" 
                        className="rounded-none border-[#E8E4DC] text-[#0A0F2E] focus:ring-[#C9A84C] accent-[#0A0F2E]"
                        checked={mustWeighIn.includes(role)}
                        onChange={() => toggleWeighIn(role)}
                      />
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#0A0F2E]">{role}</span>
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="rounded-none border-[#E8E4DC] shadow-sm bg-white p-8">
            <CardHeader className="px-0 pt-0 mb-8 border-b border-[#F8F7F4] pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle style={CG} className="text-3xl font-bold text-[#0A0F2E]">Decision Options</CardTitle>
                  <CardDescription className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280] mt-1">Map out all possible choices before crisis hits</CardDescription>
                </div>
                <Button className="bg-[#0A0F2E] text-white hover:bg-[#141B45] rounded-none px-6 font-bold text-[10px] tracking-widest uppercase" onClick={addOption} data-testid="button-add-option">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Option
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-0 pb-0 space-y-8">
              {options.map((option, index) => (
                <div 
                  key={option.id}
                  className={`p-8 border rounded-none transition-all ${optionColors[index % optionColors.length]}`}
                  data-testid={`option-${optionLetters[index]}`}
                >
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-6 flex-1">
                      <div className={`w-12 h-12 rounded-none ${buttonColors[index % buttonColors.length]} text-white flex items-center justify-center font-bold text-xl`}>
                        {optionLetters[index]}
                      </div>
                      <Input 
                        placeholder={`Option name (e.g., ${index === 0 ? 'Disclose Immediately' : 'Delay Disclosure'})`}
                        className="flex-1 rounded-none border-[#E8E4DC] h-12 bg-white focus-visible:ring-[#C9A84C] font-bold"
                        value={option.label}
                        onChange={(e) => {
                          const newOptions = [...options];
                          newOptions[index].label = e.target.value;
                          setOptions(newOptions);
                        }}
                        data-testid={`input-option-${optionLetters[index]}-label`}
                      />
                    </div>
                    {options.length > 1 && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeOption(option.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-transparent ml-4"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#0A0F2E]">
                        Strategic Intent
                      </label>
                      <Textarea 
                        placeholder="What does this option entail?"
                        className="rounded-none border-[#E8E4DC] min-h-[80px] bg-white p-4 focus-visible:ring-[#C9A84C]"
                        value={option.description}
                        onChange={(e) => {
                          const newOptions = [...options];
                          newOptions[index].description = e.target.value;
                          setOptions(newOptions);
                        }}
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: TEAL }}>
                          Primary Advantages (Pros)
                        </label>
                        <Textarea 
                          placeholder="• Regulatory compliance&#10;• Transparency&#10;• Customer trust"
                          className="rounded-none border-[#E8E4DC] min-h-[120px] bg-white p-4 focus-visible:ring-[#C9A84C]"
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-red-700">
                          Strategic Risks (Cons)
                        </label>
                        <Textarea 
                          placeholder="• Media reaction&#10;• Stock impact&#10;• Incomplete information"
                          className="rounded-none border-[#E8E4DC] min-h-[120px] bg-white p-4 focus-visible:ring-[#C9A84C]"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#0A0F2E]">
                        Decision Criteria (Select This Option If:)
                      </label>
                      <Textarea 
                        placeholder="• >100K customers affected&#10;• Personal data compromised&#10;• Regulatory deadline <24 hours"
                        className="rounded-none border-[#E8E4DC] min-h-[120px] bg-white p-4 focus-visible:ring-[#C9A84C]"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#0A0F2E]">
                        Execute Playbook on Selection
                      </label>
                      <Select>
                        <SelectTrigger className="rounded-none border-[#E8E4DC] h-12 bg-white">
                          <SelectValue placeholder="Select playbook..." />
                        </SelectTrigger>
                        <SelectContent className="rounded-none border-[#E8E4DC]">
                          <SelectItem value="public-disclosure">Public Disclosure Playbook</SelectItem>
                          <SelectItem value="crisis-comms">Crisis Communications Playbook</SelectItem>
                          <SelectItem value="regulatory">Regulatory Notification Playbook</SelectItem>
                          <SelectItem value="internal-only">Internal Assessment Playbook</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        
        <div className="flex items-center justify-between mt-12 pt-12 border-t border-[#E8E4DC]">
          <Button 
            variant="ghost" 
            className="rounded-none font-bold text-[10px] tracking-widest uppercase text-[#6B7280] hover:text-[#0A0F2E] px-8 h-12"
            onClick={() => setLocation('/decisions')}
            data-testid="button-cancel"
          >
            Cancel
          </Button>
          <Button 
            size="lg"
            onClick={handleSave}
            disabled={createTreeMutation.isPending}
            className="bg-[#0A0F2E] text-white hover:bg-[#141B45] rounded-none px-12 h-14 font-bold text-xs tracking-widest uppercase shadow-xl"
            data-testid="button-save"
          >
            <Save className="mr-3 h-5 w-5 text-[#C9A84C]" />
            Save Decision Tree
          </Button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
