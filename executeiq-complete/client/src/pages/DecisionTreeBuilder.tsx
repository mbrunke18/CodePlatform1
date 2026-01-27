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
    'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/10',
    'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10',
    'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/10',
    'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/10',
    'border-pink-200 dark:border-pink-800 bg-pink-50 dark:bg-pink-900/10',
    'border-cyan-200 dark:border-cyan-800 bg-cyan-50 dark:bg-cyan-900/10',
  ];
  const buttonColors = ['bg-emerald-600', 'bg-blue-600', 'bg-purple-600', 'bg-amber-600', 'bg-pink-600', 'bg-cyan-600'];
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <StandardNav />
      
      <div className="container mx-auto px-4 py-20 max-w-5xl">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => setLocation('/decisions')}
          data-testid="button-back"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2" data-testid="page-title">
            Create Decision Tree
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Pre-stage critical decisions before scenarios occur. Head coaches prepare decision trees all week—so should you.
          </p>
        </div>
        
        <Card className="mb-8 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800" data-testid="preparation-mindset-card">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-blue-900 dark:text-blue-200 text-xl mb-2">
                  "I'm not thinking about what I'm doing. I prepared all week so I could just react."
                </h3>
                <p className="text-blue-800 dark:text-blue-300 mb-4">
                  — The mindset of elite teams in high-pressure environments
                </p>
                <p className="text-slate-700 dark:text-slate-300">
                  Elite performers don't figure out the play in the moment. They studied, prepared, and know exactly what to do when the opportunity or threat appears.
                </p>
                <p className="text-slate-700 dark:text-slate-300 mt-2">
                  <strong>Do the same for your business.</strong> Pre-stage critical decisions for any scenario—
                  <span className="text-emerald-600 dark:text-emerald-400">seizing an M&A opportunity</span>, 
                  <span className="text-blue-600 dark:text-blue-400">defending against a crisis</span>, or 
                  <span className="text-purple-600 dark:text-purple-400">driving AI transformation</span>. 
                  You don't panic—you execute what you already prepared.
                </p>
                <div className="mt-4 p-4 bg-white dark:bg-slate-800 rounded-lg border border-blue-200 dark:border-blue-700">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                    That's the IDEA:
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Comfortable and confident that we are prepared to execute. No matter the situation.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Scenario Information</CardTitle>
            <CardDescription>What high-stakes decision needs a pre-staged tree?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Scenario Name *
              </label>
              <Input 
                placeholder="e.g., M&A Target Acquisition, Customer Data Breach, AI Model Deployment"
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
                data-testid="input-scenario"
              />
              <p className="text-xs text-slate-500 mt-1">
                What situation triggers this decision?
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Domain *
                </label>
                <Select value={domain} onValueChange={setDomain}>
                  <SelectTrigger data-testid="select-domain">
                    <SelectValue placeholder="Select a domain..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="crisis-response">Crisis Response</SelectItem>
                    <SelectItem value="regulatory-compliance">Regulatory Compliance</SelectItem>
                    <SelectItem value="cyber-incidents">Cyber Incidents</SelectItem>
                    <SelectItem value="competitive-response">Competitive Response</SelectItem>
                    <SelectItem value="market-entry">Market Entry</SelectItem>
                    <SelectItem value="ma-integration">M&A Integration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Strategic Category *
                </label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger data-testid="select-category">
                    <SelectValue placeholder="Select a category..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="defense">Defense - Protect Value</SelectItem>
                    <SelectItem value="offense">Offense - Seize Opportunities</SelectItem>
                    <SelectItem value="special_teams">Special Teams - Change the Game</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Decision Point #1</CardTitle>
                <CardDescription>The critical question that needs a fast answer</CardDescription>
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                Target: {timeWindow} min
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Decision Question *
              </label>
              <Textarea 
                placeholder="e.g., Should we disclose the breach publicly immediately?"
                rows={2}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                data-testid="input-question"
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Primary Decision Maker
                </label>
                <Select value={decisionMaker} onValueChange={setDecisionMaker}>
                  <SelectTrigger data-testid="select-decision-maker">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CEO">CEO</SelectItem>
                    <SelectItem value="CFO">CFO</SelectItem>
                    <SelectItem value="COO">COO</SelectItem>
                    <SelectItem value="General Counsel">General Counsel</SelectItem>
                    <SelectItem value="CISO">CISO</SelectItem>
                    <SelectItem value="CTO">CTO</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Time Window (minutes)
                </label>
                <Input 
                  type="number" 
                  placeholder="15"
                  value={timeWindow}
                  onChange={(e) => setTimeWindow(e.target.value)}
                  data-testid="input-time-window"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Must Weigh In Before Decision
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {weighInRoles.map((role) => (
                  <label 
                    key={role} 
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <input 
                      type="checkbox" 
                      className="rounded"
                      checked={mustWeighIn.includes(role)}
                      onChange={() => toggleWeighIn(role)}
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{role}</span>
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Pre-Staged Decision Options</CardTitle>
                <CardDescription>Map out all possible choices before crisis hits</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={addOption} data-testid="button-add-option">
                <Plus className="mr-2 h-4 w-4" />
                Add Option
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {options.map((option, index) => (
              <div 
                key={option.id}
                className={`p-6 border-2 rounded-lg ${optionColors[index % optionColors.length]}`}
                data-testid={`option-${optionLetters[index]}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${buttonColors[index % buttonColors.length]} text-white flex items-center justify-center font-bold`}>
                      {optionLetters[index]}
                    </div>
                    <Input 
                      placeholder={`Option name (e.g., ${index === 0 ? 'Disclose Immediately' : 'Delay Disclosure'})`}
                      className="flex-1 bg-white dark:bg-slate-800"
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
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Description
                    </label>
                    <Textarea 
                      placeholder="What does this option entail?"
                      rows={2}
                      className="bg-white dark:bg-slate-800"
                      value={option.description}
                      onChange={(e) => {
                        const newOptions = [...options];
                        newOptions[index].description = e.target.value;
                        setOptions(newOptions);
                      }}
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Pros
                      </label>
                      <Textarea 
                        placeholder="• Regulatory compliance&#10;• Transparency&#10;• Customer trust"
                        rows={3}
                        className="bg-white dark:bg-slate-800"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Cons
                      </label>
                      <Textarea 
                        placeholder="• Media reaction&#10;• Stock impact&#10;• Incomplete information"
                        rows={3}
                        className="bg-white dark:bg-slate-800"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Choose This Option If:
                    </label>
                    <Textarea 
                      placeholder="• >100K customers affected&#10;• Personal data compromised&#10;• Regulatory deadline <24 hours"
                      rows={3}
                      className="bg-white dark:bg-slate-800"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Decision criteria help executives choose fast
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      If Chosen → Trigger Playbook
                    </label>
                    <Select>
                      <SelectTrigger className="bg-white dark:bg-slate-800">
                        <SelectValue placeholder="Select playbook..." />
                      </SelectTrigger>
                      <SelectContent>
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
        
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => setLocation('/decisions')}
            data-testid="button-cancel"
          >
            Cancel
          </Button>
          <Button 
            size="lg"
            onClick={handleSave}
            disabled={createTreeMutation.isPending}
            className="bg-emerald-600 hover:bg-emerald-700"
            data-testid="button-save"
          >
            <Save className="mr-2 h-5 w-5" />
            Save Decision Tree
          </Button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
