import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import StandardNav from "@/components/layout/StandardNav";
import Footer from "@/components/layout/Footer";
import { PageHero } from "@/components/layout/PageHero";
import {
  ArrowRight,
  ArrowLeft,
  Mail,
  Zap,
  BookOpen,
  CheckCircle,
  Clock,
  AlertTriangle,
  Radio,
  Users,
  FileText,
  Rocket,
  Play,
  RefreshCw,
  Target,
  Shield,
  TrendingUp,
  Building2,
  Loader2
} from "lucide-react";


type Step = "setup" | "configure" | "ready" | "executing" | "complete";

interface ExecutionEvent {
  id: string;
  timestamp: Date;
  type: string;
  title: string;
  description: string;
  valueCallout: string;
  traditionalTime: string;
  status: "pending" | "active" | "complete";
  icon: any;
}

const TRIGGER_SCENARIOS = [
  {
    id: "competitor_launch",
    name: "Competitor Product Launch",
    description: "A major competitor announces a new product in your category",
    icon: Target,
    color: "text-[#2B8A6E]",
    bgColor: "bg-[#2B8A6E]/10",
    sampleSignal: "TechCorp announces AI-powered enterprise solution competing directly with your flagship product"
  },
  {
    id: "regulatory_change",
    name: "Regulatory Change",
    description: "New compliance requirements affecting your industry",
    icon: Shield,
    color: "text-[#C9A84C]",
    bgColor: "bg-[#C9A84C]/10",
    sampleSignal: "SEC announces new AI disclosure requirements for financial services effective Q2 2026"
  },
  {
    id: "market_opportunity",
    name: "Market Expansion Opportunity",
    description: "Strategic window opens for market expansion",
    icon: TrendingUp,
    color: "text-[#2B8A6E]",
    bgColor: "bg-[#2B8A6E]/10",
    sampleSignal: "European Union announces $2B digital transformation fund for enterprise software adoption"
  },
  {
    id: "crisis_event",
    name: "Crisis Response",
    description: "Security breach or operational crisis detected",
    icon: AlertTriangle,
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-950/30",
    sampleSignal: "Unusual network activity detected - potential data exfiltration attempt from internal systems"
  }
];

const PLAYBOOK_OPTIONS = [
  {
    id: "competitive_response",
    name: "Competitive Response Playbook",
    description: "Coordinate cross-functional response to competitive threats",
    tasks: 12,
    stakeholders: 6,
    estimatedTime: "12 min activation"
  },
  {
    id: "regulatory_compliance",
    name: "Regulatory Compliance Playbook",
    description: "Ensure rapid compliance with new regulatory requirements",
    tasks: 18,
    stakeholders: 8,
    estimatedTime: "12 min activation"
  },
  {
    id: "market_expansion",
    name: "Market Expansion Playbook",
    description: "Seize market opportunities with coordinated go-to-market",
    tasks: 15,
    stakeholders: 7,
    estimatedTime: "12 min activation"
  },
  {
    id: "crisis_management",
    name: "Crisis Management Playbook",
    description: "Rapid incident response with clear accountability chain",
    tasks: 20,
    stakeholders: 10,
    estimatedTime: "8 min activation"
  }
];

export default function PilotDemo() {
  const [step, setStep] = useState<Step>("setup");
  const [email, setEmail] = useState("");
  const [selectedTrigger, setSelectedTrigger] = useState<string | null>(null);
  const [selectedPlaybook, setSelectedPlaybook] = useState<string | null>(null);
  const [executionEvents, setExecutionEvents] = useState<ExecutionEvent[]>([]);
  const [executionProgress, setExecutionProgress] = useState(0);
  const [executionStartTime, setExecutionStartTime] = useState<Date | null>(null);
  const { toast } = useToast();

  const triggerData = TRIGGER_SCENARIOS.find(t => t.id === selectedTrigger);
  const playbookData = PLAYBOOK_OPTIONS.find(p => p.id === selectedPlaybook);

  const executePilotMutation = useMutation({
    mutationFn: async (data: { email: string; triggerId: string; playbookId: string }) => {
      return apiRequest("POST", "/api/pilot/execute", data);
    },
    onSuccess: () => {
      toast({
        title: "Pilot Execution Complete",
        description: "Check your email for the stakeholder notification!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Execution Error",
        description: error.message || "Something went wrong",
        variant: "destructive"
      });
    }
  });

  const startExecution = () => {
    setStep("executing");
    setExecutionStartTime(new Date());
    setExecutionProgress(0);
    setExecutionEvents([]);

    const events: Omit<ExecutionEvent, "status">[] = [
      { 
        id: "1", 
        timestamp: new Date(), 
        type: "signal", 
        title: "Signal Detected & Captured", 
        description: triggerData?.sampleSignal || "Business event detected",
        valueCallout: "Execution OS monitors 50+ data sources 24/7 so you never miss a critical signal",
        traditionalTime: "Hours to days for manual discovery",
        icon: Radio 
      },
      { 
        id: "2", 
        timestamp: new Date(), 
        type: "analysis", 
        title: "AI-Powered Signal Analysis", 
        description: "GPT-4o analyzing strategic impact, urgency level, and affected business units",
        valueCallout: "AI classifies severity and recommends immediate actions",
        traditionalTime: "4-8 hours for analyst review",
        icon: Zap 
      },
      { 
        id: "3", 
        timestamp: new Date(), 
        type: "match", 
        title: "Trigger Condition Matched", 
        description: `Pattern matched to "${triggerData?.name}" with 94% confidence`,
        valueCallout: "Pre-defined triggers eliminate decision paralysis",
        traditionalTime: "2-4 hours for leadership alignment",
        icon: Target 
      },
      { 
        id: "4", 
        timestamp: new Date(), 
        type: "playbook", 
        title: "Strategic Playbook Activated", 
        description: `"${playbookData?.name}" loaded with ${playbookData?.tasks} pre-approved tasks`,
        valueCallout: "Pre-built playbooks mean no scrambling to figure out next steps",
        traditionalTime: "8-16 hours to develop response plan",
        icon: BookOpen 
      },
      { 
        id: "5", 
        timestamp: new Date(), 
        type: "stakeholders", 
        title: "Stakeholder Notifications Sent", 
        description: `Priority alerts sent to ${playbookData?.stakeholders} key stakeholders including ${email}`,
        valueCallout: "Everyone knows their role instantly—no email chains or meetings to align",
        traditionalTime: "4-8 hours to identify and notify stakeholders",
        icon: Users 
      },
      { 
        id: "6", 
        timestamp: new Date(), 
        type: "tasks", 
        title: "Tasks Assigned & Tracked", 
        description: `${playbookData?.tasks} tasks auto-assigned with owners, deadlines, and dependencies`,
        valueCallout: "Work streams launch in parallel, not sequentially",
        traditionalTime: "6-12 hours for task allocation meetings",
        icon: FileText 
      },
      { 
        id: "7", 
        timestamp: new Date(), 
        type: "integration", 
        title: "Enterprise Systems Updated", 
        description: "Jira tickets created, Slack channels notified, documents staged",
        valueCallout: "Your existing tools are orchestrated automatically",
        traditionalTime: "2-4 hours for manual system updates",
        icon: Rocket 
      },
      { 
        id: "8", 
        timestamp: new Date(), 
        type: "complete", 
        title: "Full Coordination Achieved", 
        description: "All systems synchronized—your organization is executing as one",
        valueCallout: "From signal to coordinated action in minutes, not days",
        traditionalTime: "Total: 30-60+ hours traditionally",
        icon: CheckCircle 
      }
    ];

    let currentIndex = 0;
    const totalEvents = events.length;

    const addNextEvent = () => {
      if (currentIndex >= totalEvents) {
        setExecutionEvents(prev => prev.map(e => ({ ...e, status: "complete" as const })));
        setStep("complete");
        executePilotMutation.mutate({
          email,
          triggerId: selectedTrigger!,
          playbookId: selectedPlaybook!
        });
        return;
      }

      const event = events[currentIndex];
      setExecutionEvents(prev => [
        ...prev.map(e => ({ ...e, status: "complete" as const })),
        { ...event, timestamp: new Date(), status: "active" as const }
      ]);
      setExecutionProgress(Math.round(((currentIndex + 1) / totalEvents) * 100));
      currentIndex++;

      const delays = [2500, 3000, 2500, 3000, 2800, 2500, 2200, 1500];
      setTimeout(addNextEvent, delays[currentIndex - 1] || 2500);
    };

    setTimeout(addNextEvent, 1000);
  };

  const resetDemo = () => {
    setStep("setup");
    setEmail("");
    setSelectedTrigger(null);
    setSelectedPlaybook(null);
    setExecutionEvents([]);
    setExecutionProgress(0);
    setExecutionStartTime(null);
  };

  const canProceedToConfig = email.includes("@") && email.includes(".");
  const canProceedToReady = selectedTrigger && selectedPlaybook;

  return (
    <div className="min-h-screen bg-[#F8F7F4] dark:bg-[#0A0F2E]">
      <StandardNav />
      
      <PageHero
        eyebrow="Pilot Demo"
        title="Prove It Works"
        subtitle="Experience the full trigger → execution flow with real notifications and live email delivery."
        size="md"
      />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
                      {["setup", "configure", "ready", "executing", "complete"].map((s, i) => (
                <div key={s} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    step === s 
                      ? "bg-[#0A0F2E] text-white" 
                      : ["setup", "configure", "ready", "executing", "complete"].indexOf(step) > i
                        ? "bg-[#2B8A6E] text-white"
                        : "bg-[#E8E4DC] text-[#6B7280]"
                  }`}>
                    {["setup", "configure", "ready", "executing", "complete"].indexOf(step) > i ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  {i < 4 && (
                    <div className={`w-12 h-1 mx-1 ${
                      ["setup", "configure", "ready", "executing", "complete"].indexOf(step) > i
                        ? "bg-[#2B8A6E]"
                        : "bg-[#E8E4DC]"
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === "setup" && (
              <motion.div
                key="setup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="border-[#E8E4DC] dark:border-slate-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#0A0F2E]">
                      <Mail className="w-5 h-5 text-[#0A0F2E]" />
                      Step 1: Enter Your Email
                    </CardTitle>
                    <CardDescription>
                      You'll receive a real notification when the playbook executes
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-[#0A0F2E]">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="text-lg py-6 border-[#E8E4DC]"
                        data-testid="input-pilot-email"
                      />
                      <p className="text-sm text-[#6B7280]">
                        We'll send you a stakeholder notification just like your team would receive
                      </p>
                    </div>

                    <div className="bg-[#0A0F2E] dark:bg-[#0A0F2E]/30 rounded-lg p-4 border border-[#0A0F2E] dark:border-[#0A0F2E]">
                      <h4 className="font-medium text-[#C9A84C] mb-2">What happens next:</h4>
                      <ul className="text-sm text-white/90 dark:text-slate-300 space-y-1">
                        <li>1. You'll pick a trigger scenario (competitor move, crisis, etc.)</li>
                        <li>2. You'll select a playbook to execute</li>
                        <li>3. Watch the 12-minute activation happen in real-time</li>
                        <li>4. Receive an actual email notification as a stakeholder</li>
                      </ul>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        size="lg"
                        onClick={() => setStep("configure")}
                        disabled={!canProceedToConfig}
                        className="gap-2 bg-[#0A0F2E] hover:bg-[#141B45] text-white"
                        data-testid="button-next-configure"
                      >
                        Continue <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === "configure" && (
              <motion.div
                key="configure"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <Card className="border-[#E8E4DC] dark:border-slate-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#0A0F2E]">
                      <Radio className="w-5 h-5 text-[#C9A84C]" />
                      Step 2: Choose a Trigger Scenario
                    </CardTitle>
                    <CardDescription>
                      What business event should activate your playbook?
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {TRIGGER_SCENARIOS.map((trigger) => (
                        <button
                          key={trigger.id}
                          onClick={() => setSelectedTrigger(trigger.id)}
                          className={`p-4 rounded-lg border-2 text-left transition-all ${
                            selectedTrigger === trigger.id
                              ? "border-[#0A0F2E] bg-[#0A0F2E]/5 dark:bg-[#0A0F2E]/30"
                              : "border-[#E8E4DC] dark:border-slate-700 hover:border-[#C9A84C]/30"
                          }`}
                          data-testid={`button-trigger-${trigger.id}`}
                        >
                          <div className={`inline-flex p-2 rounded-lg ${trigger.bgColor} mb-3`}>
                            <trigger.icon className={`w-5 h-5 ${trigger.color}`} />
                          </div>
                          <h4 className="font-medium text-[#0A0F2E] dark:text-white mb-1">
                            {trigger.name}
                          </h4>
                          <p className="text-sm text-[#6B7280] dark:text-slate-300">
                            {trigger.description}
                          </p>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-[#E8E4DC] dark:border-slate-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#0A0F2E]">
                      <BookOpen className="w-5 h-5 text-[#C9A84C]" />
                      Step 3: Select a Playbook
                    </CardTitle>
                    <CardDescription>
                      Which pre-built response should execute?
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {PLAYBOOK_OPTIONS.map((playbook) => (
                        <button
                          key={playbook.id}
                          onClick={() => setSelectedPlaybook(playbook.id)}
                          className={`p-4 rounded-lg border-2 text-left transition-all ${
                            selectedPlaybook === playbook.id
                              ? "border-[#C9A84C] bg-[#C9A84C]/5 dark:bg-[#C9A84C]/30"
                              : "border-[#E8E4DC] dark:border-slate-700 hover:border-[#C9A84C]/30"
                          }`}
                          data-testid={`button-playbook-${playbook.id}`}
                        >
                          <h4 className="font-medium text-[#0A0F2E] dark:text-white mb-1">
                            {playbook.name}
                          </h4>
                          <p className="text-sm text-[#6B7280] dark:text-slate-300 mb-3">
                            {playbook.description}
                          </p>
                          <div className="flex gap-3 text-xs">
                            <span className="text-[#6B7280] dark:text-slate-300">
                              {playbook.tasks} tasks
                            </span>
                            <span className="text-[#6B7280] dark:text-slate-300">
                              {playbook.stakeholders} stakeholders
                            </span>
                            <span className="text-[#2B8A6E] dark:text-[#2B8A6E] font-medium">
                              {playbook.estimatedTime}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setStep("setup")}
                    className="gap-2 text-[#0A0F2E] border-[#E8E4DC] hover:bg-[#0A0F2E] hover:text-white"
                    data-testid="button-back-setup"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </Button>
                  <Button
                    size="lg"
                    onClick={() => setStep("ready")}
                    disabled={!canProceedToReady}
                    className="gap-2 bg-[#0A0F2E] hover:bg-[#141B45] text-white"
                    data-testid="button-next-ready"
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === "ready" && (
              <motion.div
                key="ready"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="border-[#E8E4DC] dark:border-slate-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#0A0F2E]">
                      <Rocket className="w-5 h-5 text-[#2B8A6E]" />
                      Ready to Execute
                    </CardTitle>
                    <CardDescription>
                      Review your configuration and fire the trigger
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-[#F8F7F4] dark:bg-[#141B45]/50 rounded-lg p-6 space-y-4 border border-[#E8E4DC]">
                      <div className="flex items-start gap-4">
                        <div className="bg-[#0A0F2E]/10 dark:bg-[#0A0F2E]/30 p-2 rounded-lg">
                          <Mail className="w-5 h-5 text-[#0A0F2E] dark:text-[#0A0F2E]" />
                        </div>
                        <div>
                          <p className="text-sm text-[#6B7280] dark:text-slate-300">Stakeholder Email</p>
                          <p className="font-medium text-[#0A0F2E] dark:text-white">{email}</p>
                        </div>
                      </div>
                      <Separator className="bg-[#E8E4DC]" />
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg ${triggerData?.bgColor}`}>
                          {triggerData && <triggerData.icon className={`w-5 h-5 ${triggerData.color}`} />}
                        </div>
                        <div>
                          <p className="text-sm text-[#6B7280] dark:text-slate-300">Trigger Scenario</p>
                          <p className="font-medium text-[#0A0F2E] dark:text-white">{triggerData?.name}</p>
                          <p className="text-sm text-[#6B7280] mt-1">"{triggerData?.sampleSignal}"</p>
                        </div>
                      </div>
                      <Separator className="bg-[#E8E4DC]" />
                      <div className="flex items-start gap-4">
                        <div className="bg-[#0A0F2E] dark:bg-[#C9A84C]/30 p-2 rounded-lg">
                          <BookOpen className="w-5 h-5 text-[#C9A84C] dark:text-[#C9A84C]" />
                        </div>
                        <div>
                          <p className="text-sm text-[#6B7280] dark:text-slate-300">Playbook to Execute</p>
                          <p className="font-medium text-[#0A0F2E] dark:text-white">{playbookData?.name}</p>
                          <p className="text-sm text-[#6B7280] mt-1">
                            {playbookData?.tasks} tasks • {playbookData?.stakeholders} stakeholders
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#F8F7F4] dark:bg-[#2B8A6E]/15 rounded-lg p-4 border border-[#2B8A6E] dark:border-[#2B8A6E]">
                      <h4 className="font-medium text-[#0A2920] dark:text-[#2B8A6E] mb-2 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        What you'll see:
                      </h4>
                      <ul className="text-sm text-[#2B8A6E] dark:text-[#2B8A6E] space-y-1">
                        <li>• Real-time Command Center showing each execution step</li>
                        <li>• AI analyzing the signal and matching to your trigger</li>
                        <li>• Playbook activation with task and stakeholder assignments</li>
                        <li>• Actual email notification sent to {email}</li>
                      </ul>
                    </div>

                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => setStep("configure")}
                        className="gap-2 text-gray-900 border-slate-600 hover:bg-[#141B45] hover:text-white hover:border-[#141B45]"
                        data-testid="button-back-configure"
                      >
                        <ArrowLeft className="w-4 h-4" /> Back
                      </Button>
                      <Button
                        size="lg"
                        onClick={startExecution}
                        className="gap-2 bg-[#2B8A6E] hover:bg-[#256B56]"
                        data-testid="button-fire-trigger"
                      >
                        <Play className="w-4 h-4" /> Fire Trigger
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {(step === "executing" || step === "complete") && (
              <motion.div
                key="executing"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="border-slate-200 dark:border-slate-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {step === "complete" ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-[#2B8A6E]" />
                          Execution Complete
                        </>
                      ) : (
                        <>
                          <Loader2 className="w-5 h-5 text-[#0A0F2E] animate-spin" />
                          Command Center - Live Execution
                        </>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {step === "complete" 
                        ? "12-minute activation simulated successfully"
                        : "Simulating 12-minute production activation (compressed for demo)"
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-800 dark:text-slate-300">Execution Progress</span>
                        <span className="font-medium">{executionProgress}%</span>
                      </div>
                      <Progress value={executionProgress} className="h-2" />
                    </div>

                    <div className="space-y-4">
                      {executionEvents.map((event, index) => (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`rounded-lg border transition-colors overflow-hidden ${
                            event.status === "active"
                              ? "bg-[#0A0F2E] dark:bg-[#0A0F2E]/30 border-[#0A0F2E] dark:border-[#0A0F2E]"
                              : event.status === "complete"
                                ? "bg-[#F0F9F6]/50 dark:bg-[#2B8A6E]/15 border-[#2B8A6E] dark:border-[#2B8A6E]"
                                : "bg-slate-50 dark:bg-[#141B45]/50 border-slate-200 dark:border-slate-700"
                          }`}
                          data-testid={`event-${event.type}`}
                        >
                          <div className="flex items-start gap-4 p-4">
                            <div className={`p-2.5 rounded-lg shrink-0 ${
                              event.status === "active" 
                                ? "bg-[#0A0F2E]/10 dark:bg-[#0A0F2E]/50" 
                                : "bg-[#F0F9F6] dark:bg-[#2B8A6E]/15/50"
                            }`}>
                              <event.icon className={`w-5 h-5 ${
                                event.status === "active"
                                  ? "text-[#0A0F2E] dark:text-[#0A0F2E]"
                                  : "text-[#2B8A6E] dark:text-[#2B8A6E]"
                              }`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-slate-900 dark:text-white">
                                  {event.title}
                                </span>
                                {event.status === "active" && (
                                  <Loader2 className="w-4 h-4 text-[#0A0F2E] animate-spin" />
                                )}
                                {event.status === "complete" && (
                                  <CheckCircle className="w-4 h-4 text-[#2B8A6E]" />
                                )}
                              </div>
                              <p className="text-sm text-gray-800 dark:text-slate-300 mb-2">
                                {event.description}
                              </p>
                              <div className="flex items-center gap-2 text-xs">
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#F0F9F6] dark:bg-[#2B8A6E]/15/40 text-[#2B8A6E] dark:text-[#2B8A6E]">
                                  <Zap className="w-3 h-3" />
                                  {event.valueCallout}
                                </span>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <div className="text-xs text-gray-800 mb-1">
                                {event.timestamp.toLocaleTimeString()}
                              </div>
                              <div className="text-xs px-2 py-1 rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 line-through">
                                {event.traditionalTime}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {step === "complete" && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                      >
                        <div className="bg-gradient-to-br from-[#2B8A6E] to-[#3BAF8A] dark:from-[#2B8A6E]/15 dark:to-[#3BAF8A]/40 rounded-xl p-6 border border-[#2B8A6E] dark:border-[#2B8A6E]">
                          <div className="text-center mb-6">
                            <CheckCircle className="w-14 h-14 text-[#2B8A6E] mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-[#0A2920] dark:text-[#2B8A6E] mb-2">
                              Coordination Achieved!
                            </h3>
                            <p className="text-[#2B8A6E] dark:text-[#2B8A6E]">
                              Check your email at <strong>{email}</strong> for the stakeholder notification.
                            </p>
                          </div>

                          <div className="bg-[#0A0F2E] dark:bg-[#0A0F2E]/30 rounded-lg p-3 mb-4 border border-[#0A0F2E] dark:border-[#0A0F2E] text-center">
                            <p className="text-sm text-[#0A0F2E] dark:text-slate-300">
                              <span className="font-semibold">Demo Mode:</span> This {executionStartTime ? Math.round((new Date().getTime() - executionStartTime.getTime()) / 1000) : 0}-second simulation represents the full 12-minute production activation, compressed for demonstration.
                            </p>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 mb-6">
                            <div className="bg-red-50 dark:bg-red-950/30 rounded-lg p-4 border border-red-200 dark:border-red-800">
                              <div className="flex items-center gap-2 mb-3">
                                <Clock className="w-5 h-5 text-red-500" />
                                <span className="font-semibold text-red-900 dark:text-red-200">Traditional Approach</span>
                              </div>
                              <div className="text-3xl font-bold text-red-700 dark:text-red-400 mb-1">30-60+ hours</div>
                              <p className="text-sm text-red-700 dark:text-red-300">
                                Meetings, email chains, manual coordination, decision delays
                              </p>
                            </div>
                            <div className="bg-[#F0F9F6] dark:bg-[#2B8A6E]/15 rounded-lg p-4 border border-[#2B8A6E] dark:border-[#2B8A6E]">
                              <div className="flex items-center gap-2 mb-3">
                                <Zap className="w-5 h-5 text-[#2B8A6E]" />
                                <span className="font-semibold text-[#0A2920] dark:text-[#2B8A6E]">With Execution OS</span>
                              </div>
                              <div className="text-3xl font-bold text-[#2B8A6E] dark:text-[#2B8A6E] mb-1">12 minutes</div>
                              <p className="text-sm text-[#2B8A6E] dark:text-[#2B8A6E]">
                                Full coordination: detection, analysis, playbook activation, stakeholder alignment
                              </p>
                            </div>
                          </div>

                          <div className="bg-white/50 dark:bg-[#141B45]/50 rounded-lg p-4 mb-6">
                            <h4 className="font-semibold text-slate-900 dark:text-white mb-3 text-center">
                              Value Created in This Demo
                            </h4>
                            <div className="grid grid-cols-3 gap-4 text-center">
                              <div>
                                <div className="text-2xl font-bold text-[#0A0F2E] dark:text-[#0A0F2E]">30-60</div>
                                <div className="text-xs text-gray-800 dark:text-slate-300">Hours Saved</div>
                              </div>
                              <div>
                                <div className="text-2xl font-bold text-[#C9A84C] dark:text-[#C9A84C]">$15-30K</div>
                                <div className="text-xs text-gray-800 dark:text-slate-300">Executive Time Recovered</div>
                              </div>
                              <div>
                                <div className="text-2xl font-bold text-[#C9A84C] dark:text-amber-400">340x</div>
                                <div className="text-xs text-gray-800 dark:text-slate-300">Faster Response</div>
                              </div>
                            </div>
                          </div>

                          <p className="text-sm text-gray-800 dark:text-slate-300 text-center mb-6">
                            In production, Execution OS also creates Jira tickets, notifies Slack channels, stages documents, and unlocks pre-approved budgets—all automatically.
                          </p>

                          <div className="flex justify-center gap-4">
                            <Button
                              variant="outline"
                              onClick={resetDemo}
                              className="gap-2 text-gray-900 border-slate-600 hover:bg-[#141B45] hover:text-white hover:border-[#141B45]"
                              data-testid="button-reset-demo"
                            >
                              <RefreshCw className="w-4 h-4" /> Run Another Demo
                            </Button>
                            <Button
                              onClick={() => window.location.href = "/contact"}
                              className="gap-2 bg-[#2B8A6E] hover:bg-[#256B56]"
                              data-testid="button-start-pilot"
                            >
                              Start Full Pilot <ArrowRight className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}
