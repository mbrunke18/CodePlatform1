import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import StandardNav from "@/components/layout/StandardNav";
import Footer from "@/components/layout/Footer";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  Clock,
  Download,
  FileText,
  Loader2,
  Play,
  RefreshCw,
  Shield,
  Users,
  Zap,
  Target,
  BookOpen,
  Edit3,
  Check,
  X,
  Building2,
  Mail,
  Brain,
  DollarSign,
  Activity,
  CircleDot,
  Settings,
  Rocket,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const STEP_LABELS = ["Describe", "Analyze", "Playbook", "Simulate", "Report"];

function domainColors(domain: string) {
  switch (domain) {
    case "offense":
      return { bg: "bg-[#2B8A6E]/20", text: "text-[#2B8A6E]", border: "border-[#2B8A6E]/30", darkBg: "bg-[#2B8A6E]/15", label: "OFFENSE", realityBg: "bg-amber-950/30", realityBorder: "border-amber-500/20" };
    case "special_teams":
      return { bg: "bg-[#C9A84C]/20", text: "text-[#C9A84C]", border: "border-[#C9A84C]/30", darkBg: "bg-[#C9A84C]/30", label: "SPECIAL TEAMS", realityBg: "bg-[#C9A84C]/30", realityBorder: "border-[#C9A84C]/20" };
    default:
      return { bg: "bg-red-500/20", text: "text-red-400", border: "border-red-500/30", darkBg: "bg-red-950/30", label: "DEFENSE", realityBg: "bg-red-950/30", realityBorder: "border-red-500/20" };
  }
}

function DomainIcon({ domain, className }: { domain: string; className?: string }) {
  switch (domain) {
    case "offense":
      return <Target className={className} />;
    case "special_teams":
      return <Settings className={className} />;
    default:
      return <Shield className={className} />;
  }
}

function raciColor(r: string) {
  switch (r?.toUpperCase()) {
    case "R": return "bg-red-500/20 text-red-600 border-red-500/30";
    case "A": return "bg-[#C9A84C]/20 text-[#C9A84C] border-[#C9A84C]/30";
    case "C": return "bg-[#0A0F2E]/10 text-[#0A0F2E] border-[#0A0F2E]/30";
    case "I": return "bg-slate-500/20 text-[#6B7280] border-slate-500/30";
    default: return "bg-slate-500/20 text-[#6B7280] border-slate-500/30";
  }
}

function priorityColor(p: string) {
  switch (p?.toLowerCase()) {
    case "critical": return "bg-red-500/20 text-red-600 border-red-500/30";
    case "high": return "bg-[#C9A84C]/20 text-[#C9A84C] border-[#C9A84C]/30";
    case "medium": return "bg-[#0A0F2E]/10 text-[#0A0F2E] border-[#0A0F2E]/30";
    case "low": return "bg-slate-500/20 text-[#6B7280] border-slate-500/30";
    default: return "bg-slate-500/20 text-[#6B7280] border-slate-500/30";
  }
}

function getPlaceholder(domain: string) {
  switch (domain) {
    case "offense":
      return "Example: We identified a major opportunity to enter the Southeast Asian market before our competitors. By the time we aligned stakeholders...";
    case "defense":
      return "Example: Last year ransomware hit our Atlanta office. It took 3 days to figure out who was in charge...";
    case "special_teams":
      return "Example: We launched a digital transformation initiative to modernize our supply chain. After 18 months and $40M spent...";
    default:
      return "Describe any strategic situation \u2014 a crisis, an opportunity, a transformation, or a competitive threat...";
  }
}

export default function IncidentAnalyzer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedDomain, setSelectedDomain] = useState<'auto' | 'offense' | 'defense' | 'special_teams'>('auto');
  const [description, setDescription] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [incidentId, setIncidentId] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [playbook, setPlaybook] = useState<any>(null);
  const [editablePlaybook, setEditablePlaybook] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [simulationId, setSimulationId] = useState("");
  const [simulationData, setSimulationData] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [error, setError] = useState("");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const activeDomain = analysis?.domain || (selectedDomain === 'auto' ? 'defense' : selectedDomain);
  const dc = domainColors(activeDomain);

  const handleAnalyze = async () => {
    if (!description.trim()) return;
    setError("");
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/incidents/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, companyName, email: email || undefined, domain: selectedDomain }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Analysis failed (${res.status})`);
      }
      const data = await res.json();
      const raw = data.analysis || data;
      const rawMetrics = raw.comparison_metrics || raw.comparisonMetrics;
      let metricsArray: any[] | undefined;
      if (rawMetrics && !Array.isArray(rawMetrics) && typeof rawMetrics === 'object') {
        metricsArray = Object.entries(rawMetrics).map(([key, val]: [string, any]) => ({
          metric: key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          without: val.reality || val.without || val.before || val.current || '',
          with: val.executeiq || val.with || val.after || val.improved || '',
        }));
      } else if (Array.isArray(rawMetrics)) {
        metricsArray = rawMetrics;
      }
      const normalized = {
        ...raw,
        domain: raw.domain,
        incidentType: raw.incidentType || raw.incident_type,
        incident_type: raw.incident_type || raw.incidentType,
        matched_playbook: raw.matched_playbook || raw.matchedPlaybook,
        situation_summary: raw.situation_summary || raw.situationSummary,
        whatWentWrong: raw.whatWentWrong || raw.what_went_wrong || [],
        root_causes: raw.root_causes || raw.rootCauses || [],
        rootCause: raw.rootCause || raw.root_cause,
        estimatedImpact: raw.estimatedImpact || raw.estimated_impact,
        timeToCoordination: raw.timeToCoordination || raw.time_to_coordination,
        your_reality: raw.your_reality || raw.yourReality || [],
        with_executeiq: raw.with_executeiq || raw.withExecuteiq || [],
        cost_without: raw.cost_without || raw.costWithout,
        cost_with: raw.cost_with || raw.costWith,
        costWithout: raw.cost_without || raw.costWithout,
        costWith: raw.cost_with || raw.costWith,
        comparison_metrics: metricsArray,
        comparison: raw.comparison,
      };
      setAnalysis(normalized);
      setIncidentId(data.incidentId || data.id || "inc-" + Date.now());
      setCurrentStep(2);
    } catch (e: any) {
      setError(e.message || "Failed to analyze situation");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGeneratePlaybook = async () => {
    setError("");
    setIsGenerating(true);
    try {
      const res = await fetch("/api/incidents/generate-playbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          incidentId,
          incidentType: analysis?.incidentType,
          description,
          whatWentWrong: analysis?.whatWentWrong,
        }),
      });
      if (!res.ok) throw new Error(`Playbook generation failed (${res.status})`);
      const data = await res.json();
      const pb = data.playbook || data;
      setPlaybook(pb);
      setEditablePlaybook(JSON.parse(JSON.stringify(pb)));
      setCurrentStep(3);
    } catch (e: any) {
      setError(e.message || "Failed to generate playbook");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRunSimulation = async () => {
    setError("");
    setIsSimulating(true);
    setElapsedSeconds(0);
    setSimulationData(null);
    try {
      const res = await fetch("/api/incidents/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ incidentId, playbook: editablePlaybook || playbook, email }),
      });
      if (!res.ok) throw new Error(`Simulation start failed (${res.status})`);
      const data = await res.json();
      setSimulationId(data.simulationId || data.id || "sim-" + Date.now());
      setCurrentStep(4);

      timerRef.current = setInterval(() => {
        setElapsedSeconds((p) => p + 1);
      }, 1000);

      const simId = data.simulationId || data.id || "sim-" + Date.now();
      pollingRef.current = setInterval(async () => {
        try {
          const statusRes = await fetch(`/api/incidents/simulate/status/${simId}`);
          if (statusRes.ok) {
            const statusData = await statusRes.json();
            setSimulationData(statusData);
            if (statusData.status === "completed" || statusData.completed) {
              if (timerRef.current) clearInterval(timerRef.current);
              if (pollingRef.current) clearInterval(pollingRef.current);
              setIsSimulating(false);
            }
          }
        } catch {
        }
      }, 1000);
    } catch (e: any) {
      setError(e.message || "Failed to start simulation");
      setIsSimulating(false);
    }
  };

  const handleGoToReport = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (pollingRef.current) clearInterval(pollingRef.current);
    setCurrentStep(5);
  };

  const handleReset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (pollingRef.current) clearInterval(pollingRef.current);
    setCurrentStep(0);
    setSelectedDomain('auto');
    setDescription("");
    setCompanyName("");
    setEmail("");
    setIncidentId("");
    setAnalysis(null);
    setPlaybook(null);
    setEditablePlaybook(null);
    setIsEditing(false);
    setSimulationId("");
    setSimulationData(null);
    setElapsedSeconds(0);
    setError("");
    setIsAnalyzing(false);
    setIsGenerating(false);
    setIsSimulating(false);
  };

  const generateIncidentPDF = () => {
    const doc = new jsPDF();
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 297, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.text("Execution OS", 105, 50, { align: "center" });
    doc.setFontSize(14);
    doc.setTextColor(94, 234, 212);
    doc.text("Strategic Analysis Report", 105, 65, { align: "center" });
    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, 80, { align: "center" });
    if (companyName) doc.text(`Company: ${companyName}`, 105, 90, { align: "center" });

    doc.addPage();
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 297, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text("Strategic Analysis", 20, 25);

    doc.setFontSize(11);
    doc.setTextColor(148, 163, 184);
    const descLines = doc.splitTextToSize(description, 170);
    doc.text(descLines, 20, 40);

    let y = 40 + descLines.length * 6 + 10;
    if (analysis?.domain) {
      doc.setTextColor(94, 234, 212);
      doc.text(`Domain: ${analysis.domain.toUpperCase()}`, 20, y);
      y += 10;
    }
    if (analysis?.incidentType || analysis?.incident_type) {
      doc.setTextColor(94, 234, 212);
      doc.text(`Type: ${analysis.incidentType || analysis.incident_type}`, 20, y);
      y += 10;
    }
    if (analysis?.estimatedImpact) {
      doc.setTextColor(248, 113, 113);
      doc.text(`Estimated Impact: ${analysis.estimatedImpact}`, 20, y);
      y += 10;
    }
    if (analysis?.timeToCoordination) {
      doc.setTextColor(251, 191, 36);
      doc.text(`Time to Coordination: ${analysis.timeToCoordination}`, 20, y);
      y += 10;
    }

    if (analysis?.whatWentWrong?.length) {
      y += 5;
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.text("What Went Wrong", 20, y);
      y += 8;
      doc.setFontSize(10);
      doc.setTextColor(248, 113, 113);
      analysis.whatWentWrong.forEach((item: string, i: number) => {
        const lines = doc.splitTextToSize(`${i + 1}. ${item}`, 170);
        doc.text(lines, 20, y);
        y += lines.length * 5 + 3;
      });
    }

    const comparisonData = analysis?.comparison || analysis?.your_reality?.map((r: any, i: number) => ({
      phase: r.phase || r.label || `Phase ${i + 1}`,
      without: r.description || r.without || r.yourReality || "",
      with: analysis?.with_executeiq?.[i]?.description || analysis?.with_executeiq?.[i]?.with || analysis?.with_executeiq?.[i]?.withExecutionOS || "",
    }));

    if (comparisonData?.length) {
      doc.addPage();
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, 210, 297, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.text("Side-by-Side Comparison", 20, 25);

      autoTable(doc, {
        startY: 35,
        head: [["Phase", "Your Reality", "With Execution OS"]],
        body: comparisonData.map((row: any) => [
          row.phase || row.label || "",
          row.without || row.yourReality || "",
          row.with || row.withExecutionOS || "",
        ]),
        styles: { fillColor: [30, 41, 59], textColor: [226, 232, 240], fontSize: 9 },
        headStyles: { fillColor: [51, 65, 85], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [15, 23, 42] },
      });
    }

    if (playbook) {
      doc.addPage();
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, 210, 297, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.text("Playbook Summary", 20, 25);
      doc.setFontSize(11);
      doc.setTextColor(94, 234, 212);
      doc.text(`Name: ${playbook.name || "Generated Playbook"}`, 20, 40);
      doc.text(`Code: ${playbook.code || "N/A"}`, 20, 50);
      doc.text(`Domain: ${playbook.domain || "N/A"}`, 20, 60);
    }

    if (simulationData) {
      doc.addPage();
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, 210, 297, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.text("Simulation Results", 20, 25);
      doc.setFontSize(11);
      doc.setTextColor(94, 234, 212);
      doc.text(`Elapsed Time: ${formatTime(elapsedSeconds)}`, 20, 40);
      doc.text(`Status: ${simulationData.status || "Completed"}`, 20, 50);
    }

    doc.save("Execution OS-Strategic-Report.pdf");
  };

  const generateBoardPDF = () => {
    const doc = new jsPDF();
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 297, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.text("Execution OS", 105, 50, { align: "center" });
    doc.setFontSize(16);
    doc.setTextColor(94, 234, 212);
    doc.text("Board Briefing Deck", 105, 65, { align: "center" });
    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184);
    doc.text(`Prepared: ${new Date().toLocaleDateString()}`, 105, 80, { align: "center" });
    if (companyName) doc.text(`Organization: ${companyName}`, 105, 90, { align: "center" });

    doc.addPage();
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 297, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text("Executive Summary", 20, 25);
    doc.setFontSize(11);
    doc.setTextColor(226, 232, 240);
    const summaryLines = doc.splitTextToSize(
      `A strategic analysis was conducted for ${companyName || "the organization"} regarding: ${description.slice(0, 200)}...`,
      170
    );
    doc.text(summaryLines, 20, 40);

    let y = 40 + summaryLines.length * 6 + 15;
    doc.setTextColor(94, 234, 212);
    doc.setFontSize(14);
    doc.text("Key Findings", 20, y);
    y += 10;
    doc.setFontSize(10);
    doc.setTextColor(226, 232, 240);
    if (analysis?.domain) { doc.text(`\u2022 Domain: ${analysis.domain.toUpperCase()}`, 25, y); y += 7; }
    if (analysis?.incidentType) { doc.text(`\u2022 Type: ${analysis.incidentType}`, 25, y); y += 7; }
    if (analysis?.estimatedImpact) { doc.text(`\u2022 Estimated Impact: ${analysis.estimatedImpact}`, 25, y); y += 7; }
    if (analysis?.rootCause) { doc.text(`\u2022 Root Cause: ${analysis.rootCause}`, 25, y); y += 7; }

    doc.addPage();
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 297, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text("Risk Assessment", 20, 25);
    doc.setFontSize(11);
    doc.setTextColor(226, 232, 240);
    if (analysis?.whatWentWrong?.length) {
      let ry = 40;
      analysis.whatWentWrong.forEach((item: string, i: number) => {
        const lines = doc.splitTextToSize(`${i + 1}. ${item}`, 170);
        doc.text(lines, 20, ry);
        ry += lines.length * 5 + 4;
      });
    }

    doc.addPage();
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 297, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text("Playbook Overview", 20, 25);
    doc.setFontSize(11);
    doc.setTextColor(94, 234, 212);
    if (playbook) {
      doc.text(`Playbook: ${playbook.name || "Generated"}`, 20, 40);
      doc.text(`Tasks: ${playbook.taskSequence?.length || 0}`, 20, 50);
      doc.text(`Stakeholders: ${playbook.raciMatrix?.length || 0}`, 20, 60);
    }

    doc.addPage();
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 297, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text("ROI Projection", 20, 25);
    doc.setFontSize(11);
    doc.setTextColor(226, 232, 240);
    const roiItems = [
      `Coordination time reduced from days to minutes`,
      `Impact avoided: ${analysis?.estimatedImpact || "Significant"}`,
      `Playbook pre-authorization eliminates decision bottlenecks`,
      `Institutional memory captured for future situations`,
    ];
    let roiY = 40;
    roiItems.forEach((item) => {
      doc.text(`\u2022 ${item}`, 25, roiY);
      roiY += 8;
    });

    doc.save("Execution OS-Board-Briefing.pdf");
  };

  const stakeholders = simulationData?.stakeholders || editablePlaybook?.raciMatrix || playbook?.raciMatrix || [];
  const tasks = simulationData?.tasks || editablePlaybook?.taskSequence || playbook?.taskSequence || [];
  const acknowledgedCount = stakeholders.filter((s: any) => s.status === "acknowledged" || s.acknowledged).length;
  const completedTaskCount = tasks.filter((t: any) => t.status === "completed" || t.completed).length;
  const simulationComplete = simulationData?.status === "completed" || simulationData?.completed;

  const comparisonRows = analysis?.comparison || analysis?.your_reality?.map((r: any, i: number) => ({
    phase: r.phase || r.label || r.time || `Phase ${i + 1}`,
    without: r.description || r.without || r.yourReality || "",
    with: analysis?.with_executeiq?.[i]?.description || analysis?.with_executeiq?.[i]?.with || analysis?.with_executeiq?.[i]?.withExecutionOS || "",
  }));

  const simBannerConfig = (() => {
    const d = activeDomain;
    if (d === "offense") return { bg: "bg-[#2B8A6E]/15", border: "border-[#2B8A6E]/30", dotColor: "bg-[#2B8A6E]", textColor: "text-[#2B8A6E]", label: "OPPORTUNITY DETECTED" };
    if (d === "special_teams") return { bg: "bg-[#C9A84C]/30", border: "border-[#C9A84C]/30", dotColor: "bg-[#0A0F2E]", textColor: "text-[#C9A84C]", label: "INITIATIVE TRIGGERED" };
    return { bg: "bg-teal-950/30", border: "border-teal-500/30", dotColor: "bg-teal-400", textColor: "text-teal-400", label: "Playbook Activated" };
  })();

  return (
    <div className="min-h-screen bg-white">
      <StandardNav />

      <main className="container mx-auto px-4 py-12 pt-24 max-w-5xl">
        {/* STEP 0: WELCOME LANDING */}
        {currentStep === 0 && (
          <div className="space-y-10">
            <div className="text-center">
              <Badge className="mb-4 bg-teal-500/20 text-teal-400 border-teal-500/30">
                <Brain className="w-4 h-4 mr-2" />
                Strategic Analyzer
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                See How Execution OS Would Have<br className="hidden md:block" /> Transformed Your Outcome
              </h1>
              <p className="text-lg text-gray-800 max-w-2xl mx-auto">
                Describe any strategic situation your company faced and watch our AI analyze it, generate a custom playbook, and simulate full execution in under 12 minutes.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 text-center">How It Works</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { num: 1, label: "Describe", desc: "Tell us what happened", icon: FileText, color: "text-teal-400" },
                  { num: 2, label: "Analyze", desc: "AI identifies gaps & root causes", icon: Brain, color: "text-[#0A0F2E]" },
                  { num: 3, label: "Playbook", desc: "Custom playbook generated", icon: BookOpen, color: "text-[#2B8A6E]" },
                  { num: 4, label: "Simulate", desc: "Live 12-minute execution", icon: Play, color: "text-[#C9A84C]" },
                  { num: 5, label: "Report", desc: "Download executive report", icon: Download, color: "text-amber-400" },
                ].map((step) => (
                  <div key={step.num} className="text-center">
                    <div className={`w-12 h-12 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center mx-auto mb-3`}>
                      <step.icon className={`w-5 h-5 ${step.color}`} />
                    </div>
                    <div className="text-sm font-semibold text-gray-900">{step.label}</div>
                    <div className="text-xs text-gray-700 mt-1">{step.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2 text-center">Try a Preset Scenario</h2>
              <p className="text-sm text-gray-700 text-center mb-5">Select one to see the analyzer in action, or write your own below</p>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { domain: 'defense', label: 'DEFENSE', icon: Shield, title: 'Ransomware Attack', desc: 'Last year ransomware hit our Atlanta office. It took 3 days to figure out who was in charge of the response. By then, the damage had spread to 4 other offices.', borderCls: 'border-red-500/30 hover:border-red-500/50', bgCls: 'bg-red-950/20', textCls: 'text-red-400', badgeCls: 'bg-red-500/20 text-red-400 border-red-500/30' },
                  { domain: 'offense', label: 'OFFENSE', icon: Rocket, title: 'Missed Market Entry', desc: 'We identified a major opportunity to enter the Southeast Asian market before our competitors. By the time we aligned stakeholders and got budget approval, two competitors had already launched.', borderCls: 'border-[#2B8A6E]/30 hover:border-[#2B8A6E]/50', bgCls: 'bg-[#2B8A6E]/15', textCls: 'text-[#2B8A6E]', badgeCls: 'bg-[#2B8A6E]/20 text-[#2B8A6E] border-[#2B8A6E]/30' },
                  { domain: 'special_teams', label: 'SPECIAL TEAMS', icon: Settings, title: 'Stalled Transformation', desc: 'We launched a digital transformation initiative to modernize our supply chain. After 18 months and $40M spent, we\'re only 30% through the original scope.', borderCls: 'border-[#C9A84C]/30 hover:border-[#C9A84C]/50', bgCls: 'bg-[#C9A84C]/20', textCls: 'text-[#C9A84C]', badgeCls: 'bg-[#C9A84C]/20 text-[#C9A84C] border-[#C9A84C]/30' },
                ].map((preset) => (
                  <button
                    key={preset.domain}
                    onClick={() => {
                      setSelectedDomain(preset.domain as any);
                      setDescription(preset.desc);
                      setCurrentStep(1);
                    }}
                    className={`text-left rounded-xl border ${preset.borderCls} ${preset.bgCls} p-5 transition-all hover:scale-[1.01] group`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <preset.icon className={`w-4 h-4 ${preset.textCls}`} />
                      <Badge className={`${preset.badgeCls} text-xs`}>
                        {preset.label}
                      </Badge>
                    </div>
                    <h3 className="text-gray-900 font-semibold mb-1">{preset.title}</h3>
                    <p className="text-gray-800 text-sm line-clamp-3">{preset.desc}</p>
                    <div className={`${preset.textCls} text-xs font-medium mt-3 flex items-center gap-1 group-hover:gap-2 transition-all`}>
                      Analyze this scenario <ArrowRight className="w-3 h-3" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center gap-3 text-gray-700 text-sm mb-4">
                <div className="h-px w-12 bg-gray-50" />
                or
                <div className="h-px w-12 bg-gray-50" />
              </div>
              <div>
                <Button
                  size="lg"
                  onClick={() => setCurrentStep(1)}
                  className="bg-teal-500 hover:bg-teal-600 text-gray-900 gap-2 px-10 py-6 text-lg"
                >
                  <FileText className="w-5 h-5" /> Describe Your Own Situation
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 py-4 px-6 bg-gray-50 rounded-xl border border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#2B8A6E]">58</div>
                <div className="text-xs text-gray-800">Offense Playbooks</div>
              </div>
              <div className="w-px h-8 bg-gray-50" />
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">56</div>
                <div className="text-xs text-gray-800">Defense Playbooks</div>
              </div>
              <div className="w-px h-8 bg-gray-50" />
              <div className="text-center">
                <div className="text-2xl font-bold text-[#C9A84C]">52</div>
                <div className="text-xs text-gray-800">Special Teams</div>
              </div>
              <div className="w-px h-8 bg-gray-50" />
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-400">12 min</div>
                <div className="text-xs text-gray-800">Avg Coordination</div>
              </div>
              <div className="w-px h-8 bg-gray-50" />
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-400">$450M+</div>
                <div className="text-xs text-gray-800">Value Protected</div>
              </div>
            </div>
          </div>
        )}

        {/* Active Steps Header (Steps 1-5) */}
        {currentStep >= 1 && (
          <>
            <div className="text-center mb-10">
              <Badge className="mb-4 bg-teal-500/20 text-teal-400 border-teal-500/30">
                <Brain className="w-4 h-4 mr-2" />
                Strategic Analyzer
              </Badge>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                See How Execution OS Transforms Execution
              </h1>
              <p className="text-lg text-gray-800 max-w-2xl mx-auto">
                Describe any strategic situation. A crisis you faced. An opportunity you missed. A transformation that stalled.
              </p>
            </div>

            <div className="flex justify-center mb-10">
              <div className="flex items-center gap-1">
                {STEP_LABELS.map((label, i) => {
                  const stepNum = i + 1;
                  const isActive = currentStep === stepNum;
                  const isComplete = currentStep > stepNum;
                  return (
                    <div key={label} className="flex items-center">
                      <div className="flex flex-col items-center gap-1">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                            isActive
                              ? "bg-teal-500 text-gray-900 shadow-lg shadow-teal-500/30"
                              : isComplete
                              ? "bg-[#2B8A6E] text-gray-900"
                              : "bg-gray-50 text-gray-700"
                          }`}
                        >
                          {isComplete ? <Check className="w-4 h-4" /> : stepNum}
                        </div>
                        <span
                          className={`text-xs font-medium ${
                            isActive ? "text-teal-400" : isComplete ? "text-[#2B8A6E]" : "text-gray-800"
                          }`}
                        >
                          {label}
                        </span>
                      </div>
                      {i < STEP_LABELS.length - 1 && (
                        <div
                          className={`w-10 h-0.5 mx-1 mt-[-12px] ${
                            currentStep > stepNum ? "bg-[#2B8A6E]" : "bg-gray-50"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/50 border border-red-500/30 text-red-400 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
            <button onClick={() => setError("")} className="ml-auto">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 1: DESCRIBE SITUATION */}
        {currentStep === 1 && (
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center gap-2 text-2xl">
                <FileText className="w-6 h-6 text-teal-400" />
                Describe Your Situation
              </CardTitle>
              <p className="text-gray-800 mt-1">
                Tell us about a crisis, missed opportunity, or coordination failure your company experienced.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Domain Selector */}
              <div className="space-y-3">
                <Label className="text-gray-800">Strategic Domain</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button
                    onClick={() => setSelectedDomain('auto')}
                    className={`relative rounded-xl border p-4 text-left transition-all ${
                      selectedDomain === 'auto'
                        ? 'bg-teal-500/10 border-teal-500/50 ring-1 ring-teal-500/30'
                        : 'bg-gray-50 border-gray-200 hover:border-slate-600'
                    }`}
                  >
                    <Brain className={`w-6 h-6 mb-2 ${selectedDomain === 'auto' ? 'text-teal-400' : 'text-gray-700'}`} />
                    <p className={`text-sm font-semibold ${selectedDomain === 'auto' ? 'text-teal-400' : 'text-gray-800'}`}>
                      Let AI Detect
                    </p>
                    <p className="text-xs text-gray-700 mt-1">Auto-classify</p>
                  </button>
                  <button
                    onClick={() => setSelectedDomain('offense')}
                    className={`relative rounded-xl border p-4 text-left transition-all ${
                      selectedDomain === 'offense'
                        ? 'bg-[#2B8A6E]/10 border-[#2B8A6E]/50 ring-1 ring-[#2B8A6E]/30'
                        : 'bg-gray-50 border-gray-200 hover:border-slate-600'
                    }`}
                  >
                    <Rocket className={`w-6 h-6 mb-2 ${selectedDomain === 'offense' ? 'text-[#2B8A6E]' : 'text-gray-700'}`} />
                    <p className={`text-sm font-semibold ${selectedDomain === 'offense' ? 'text-[#2B8A6E]' : 'text-gray-800'}`}>
                      OFFENSE
                    </p>
                    <p className="text-xs text-gray-700 mt-0.5">58 Playbooks</p>
                    <p className="text-xs text-gray-800 mt-1">Market Entry &bull; M&amp;A &bull; Product Launch</p>
                  </button>
                  <button
                    onClick={() => setSelectedDomain('defense')}
                    className={`relative rounded-xl border p-4 text-left transition-all ${
                      selectedDomain === 'defense'
                        ? 'bg-red-500/10 border-red-500/50 ring-1 ring-red-500/30'
                        : 'bg-gray-50 border-gray-200 hover:border-slate-600'
                    }`}
                  >
                    <Shield className={`w-6 h-6 mb-2 ${selectedDomain === 'defense' ? 'text-red-400' : 'text-gray-700'}`} />
                    <p className={`text-sm font-semibold ${selectedDomain === 'defense' ? 'text-red-400' : 'text-gray-800'}`}>
                      DEFENSE
                    </p>
                    <p className="text-xs text-gray-700 mt-0.5">58 Playbooks</p>
                    <p className="text-xs text-gray-800 mt-1">Crisis &bull; Cyber &bull; Regulatory</p>
                  </button>
                  <button
                    onClick={() => setSelectedDomain('special_teams')}
                    className={`relative rounded-xl border p-4 text-left transition-all ${
                      selectedDomain === 'special_teams'
                        ? 'bg-[#C9A84C]/10 border-[#C9A84C]/50 ring-1 ring-[#C9A84C]/30'
                        : 'bg-gray-50 border-gray-200 hover:border-slate-600'
                    }`}
                  >
                    <Settings className={`w-6 h-6 mb-2 ${selectedDomain === 'special_teams' ? 'text-[#C9A84C]' : 'text-gray-700'}`} />
                    <p className={`text-sm font-semibold ${selectedDomain === 'special_teams' ? 'text-[#C9A84C]' : 'text-gray-800'}`}>
                      SPECIAL TEAMS
                    </p>
                    <p className="text-xs text-gray-700 mt-0.5">54 Playbooks</p>
                    <p className="text-xs text-gray-800 mt-1">Digital Transformation &bull; AI Governance</p>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-800">Situation Description *</Label>
                <Textarea
                  rows={6}
                  placeholder={getPlaceholder(selectedDomain)}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-slate-600 focus:border-teal-500 resize-none"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-800 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-700" />
                    Company Name (optional)
                  </Label>
                  <Input
                    placeholder="Acme Corp"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-slate-600 focus:border-teal-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-800 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-700" />
                    Email (optional)
                  </Label>
                  <Input
                    type="email"
                    placeholder="exec@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-slate-600 focus:border-teal-500"
                  />
                  <p className="text-xs text-gray-800">
                    Enter your email to receive a real notification during the simulation
                  </p>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button
                  size="lg"
                  onClick={handleAnalyze}
                  disabled={!description.trim() || isAnalyzing}
                  className="bg-teal-500 hover:bg-teal-600 text-gray-900 gap-2 px-8"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" /> Analyze My Situation
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 2: AI ANALYSIS */}
        {currentStep === 2 && analysis && (
          <div className="space-y-6">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <CardTitle className="text-gray-900 flex items-center gap-2 text-2xl">
                    <Brain className="w-6 h-6 text-teal-400" />
                    AI Analysis Results
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {analysis.domain && (
                      <Badge className={`${dc.bg} ${dc.text} ${dc.border} text-sm`}>
                        <DomainIcon domain={activeDomain} className="w-3.5 h-3.5 mr-1.5" />
                        {dc.label}
                      </Badge>
                    )}
                    {(analysis.incidentType || analysis.incident_type) && (
                      <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/30 text-sm">
                        {analysis.incidentType || analysis.incident_type}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Matched Playbook */}
                {analysis.matched_playbook && (
                  <div className={`${dc.darkBg} border ${dc.border} rounded-xl p-5`}>
                    <div className="flex items-center gap-3 mb-2">
                      <BookOpen className={`w-5 h-5 ${dc.text}`} />
                      <h4 className={`font-semibold ${dc.text}`}>Matched Playbook</h4>
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      {analysis.matched_playbook.code && (
                        <Badge className="bg-gray-50 text-gray-800 border-gray-200 text-xs">
                          {analysis.matched_playbook.code}
                        </Badge>
                      )}
                      <span className="text-gray-900 font-medium">{analysis.matched_playbook.name}</span>
                    </div>
                    <p className={`text-sm ${dc.text}`}>This playbook exists. Ready to deploy today.</p>
                  </div>
                )}

                {/* Situation Summary */}
                {analysis.situation_summary && (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-teal-400 mb-2">Situation Summary</h4>
                    <p className="text-gray-800 text-sm">{analysis.situation_summary}</p>
                  </div>
                )}

                {/* Stats */}
                <div className="grid md:grid-cols-2 gap-4">
                  {analysis.estimatedImpact && (
                    <div className="bg-red-950/30 border border-red-500/20 rounded-xl p-5 text-center">
                      <DollarSign className="w-8 h-8 text-red-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-800 mb-1">Estimated Impact</p>
                      <p className="text-2xl font-bold text-red-400">{analysis.estimatedImpact}</p>
                    </div>
                  )}
                  {analysis.timeToCoordination && (
                    <div className="bg-amber-950/30 border border-amber-500/20 rounded-xl p-5 text-center">
                      <Clock className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-800 mb-1">Time to Coordination</p>
                      <p className="text-2xl font-bold text-amber-400">{analysis.timeToCoordination}</p>
                    </div>
                  )}
                </div>

                {/* What Went Wrong */}
                {analysis.whatWentWrong?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                      What Went Wrong
                    </h3>
                    <div className="space-y-2">
                      {analysis.whatWentWrong.map((item: string, i: number) => (
                        <div
                          key={i}
                          className="bg-red-950/20 border border-red-500/15 rounded-lg p-3 flex items-start gap-3"
                        >
                          <span className="bg-red-500/20 text-red-400 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <p className="text-gray-800 text-sm">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Root Causes (array) */}
                {analysis.root_causes?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Target className="w-5 h-5 text-amber-400" />
                      Root Causes
                    </h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {analysis.root_causes.map((cause: any, i: number) => (
                        <div key={i} className="bg-amber-950/20 border border-amber-500/20 rounded-lg p-3">
                          <p className="text-sm font-medium text-gray-900">{typeof cause === 'string' ? cause : cause.cause || cause.title || cause.name || cause.description}</p>
                          {typeof cause !== 'string' && (cause.detail || cause.description) && (
                            <p className="text-xs text-gray-800 mt-1">{cause.detail || (cause.cause ? cause.description : '')}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Root Cause (single) */}
                {analysis.rootCause && !analysis.root_causes && (
                  <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-amber-400 mb-2 flex items-center gap-2">
                      <Target className="w-4 h-4" /> Root Cause
                    </h4>
                    <p className="text-gray-800 text-sm">{analysis.rootCause}</p>
                  </div>
                )}

                {/* Comparison Metrics */}
                {analysis.comparison_metrics?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Comparison Metrics</h3>
                    <div className="overflow-x-auto rounded-xl border border-gray-200">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-800 uppercase">Metric</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-red-400 uppercase">Without</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-teal-400 uppercase">With Execution OS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {analysis.comparison_metrics.map((m: any, i: number) => (
                            <tr key={i} className="border-t border-gray-200">
                              <td className="px-4 py-3 text-sm font-medium text-gray-800">{m.metric || m.label || m.name}</td>
                              <td className="px-4 py-3 text-sm text-red-300">{m.without || m.before || m.current}</td>
                              <td className="px-4 py-3 text-sm text-teal-300">{m.with || m.after || m.improved}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Side-by-Side Comparison */}
                {comparisonRows?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Side-by-Side Comparison</h3>
                    <div className="overflow-x-auto rounded-xl border border-gray-200">
                      <table className="w-full">
                        <thead>
                          <tr>
                            <th className="bg-gray-50 px-4 py-3 text-left text-xs font-semibold text-gray-800 uppercase w-1/4">
                              Phase
                            </th>
                            <th className={`${activeDomain === 'offense' ? 'bg-amber-950/40' : activeDomain === 'special_teams' ? 'bg-[#0A0F2E]/40' : 'bg-red-950/40'} px-4 py-3 text-left text-xs font-semibold ${activeDomain === 'offense' ? 'text-amber-400' : activeDomain === 'special_teams' ? 'text-[#C9A84C]' : 'text-red-400'} uppercase w-[37.5%]`}>
                              Your Reality
                            </th>
                            <th className="bg-teal-950/40 px-4 py-3 text-left text-xs font-semibold text-teal-400 uppercase w-[37.5%]">
                              With Execution OS
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {comparisonRows.map((row: any, i: number) => (
                            <tr key={i} className="border-t border-gray-200">
                              <td className="bg-white px-4 py-3 text-sm font-medium text-gray-800">
                                {row.phase || row.label}
                              </td>
                              <td className={`${activeDomain === 'offense' ? 'bg-amber-950/10' : activeDomain === 'special_teams' ? 'bg-[#C9A84C]/10' : 'bg-red-950/10'} px-4 py-3 text-sm ${activeDomain === 'offense' ? 'text-amber-300' : activeDomain === 'special_teams' ? 'text-[#C9A84C]' : 'text-red-300'}`}>
                                {row.without || row.yourReality}
                              </td>
                              <td className="bg-teal-950/10 px-4 py-3 text-sm text-teal-300">
                                {row.with || row.withExecutionOS}
                              </td>
                            </tr>
                          ))}
                          {(analysis.costWithout || analysis.costWith || analysis.cost_without || analysis.cost_with) && (
                            <tr className="border-t-2 border-gray-200">
                              <td className="bg-white px-4 py-4 text-sm font-bold text-gray-900">
                                Total Cost
                              </td>
                              <td className={`${activeDomain === 'offense' ? 'bg-amber-950/20' : activeDomain === 'special_teams' ? 'bg-[#C9A84C]/20' : 'bg-red-950/20'} px-4 py-4 text-lg font-bold ${activeDomain === 'offense' ? 'text-amber-400' : activeDomain === 'special_teams' ? 'text-[#C9A84C]' : 'text-red-400'}`}>
                                {analysis.costWithout || analysis.cost_without}
                              </td>
                              <td className="bg-teal-950/20 px-4 py-4 text-lg font-bold text-teal-400">
                                {analysis.costWith || analysis.cost_with}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                size="lg"
                onClick={handleGeneratePlaybook}
                disabled={isGenerating}
                className="bg-teal-500 hover:bg-teal-600 text-gray-900 gap-2 px-8"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Generating Playbook...
                  </>
                ) : (
                  <>
                    <BookOpen className="w-5 h-5" /> Generate Playbook
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: GENERATED PLAYBOOK */}
        {currentStep === 3 && (editablePlaybook || playbook) && (
          <div className="space-y-6">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <CardTitle className="text-gray-900 flex items-center gap-2 text-2xl">
                    <BookOpen className="w-6 h-6 text-teal-400" />
                    {editablePlaybook?.name || playbook?.name || "Generated Playbook"}
                  </CardTitle>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      isEditing
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        : "bg-gray-50 text-gray-800 hover:text-white border border-gray-200"
                    }`}
                  >
                    {isEditing ? <Check className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                    {isEditing ? "Done Editing" : "Edit Playbook"}
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {editablePlaybook?.code && (
                    <Badge className="bg-gray-50 text-gray-800 border-gray-200">
                      Code: {editablePlaybook.code}
                    </Badge>
                  )}
                  {editablePlaybook?.domain && (
                    <Badge className={`${domainColors(editablePlaybook.domain).bg} ${domainColors(editablePlaybook.domain).text} ${domainColors(editablePlaybook.domain).border}`}>
                      <DomainIcon domain={editablePlaybook.domain} className="w-3.5 h-3.5 mr-1" />
                      {domainColors(editablePlaybook.domain).label}
                    </Badge>
                  )}
                  {editablePlaybook?.category && (
                    <Badge className="bg-[#2B8A6E]/20 text-[#2B8A6E] border-[#2B8A6E]/30">
                      {editablePlaybook.category}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Trigger Conditions */}
            {editablePlaybook?.triggerConditions?.length > 0 && (
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900 text-lg flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-400" /> Trigger Conditions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-3">
                    {editablePlaybook.triggerConditions.map((tc: any, i: number) => (
                      <div key={i} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-900">{tc.condition || tc.name || tc.trigger}</p>
                        {tc.threshold && (
                          <p className="text-xs text-amber-400 mt-1">Threshold: {tc.threshold}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* RACI Matrix */}
            {editablePlaybook?.raciMatrix?.length > 0 && (
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900 text-lg flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#0A0F2E]" /> Stakeholder RACI Matrix
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-800 uppercase">Role</th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-800 uppercase">Name</th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-800 uppercase">Department</th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-800 uppercase">RACI</th>
                        </tr>
                      </thead>
                      <tbody>
                        {editablePlaybook.raciMatrix.map((s: any, i: number) => (
                          <tr key={i} className="border-t border-gray-200">
                            <td className="px-4 py-2 text-sm text-gray-800">{s.role}</td>
                            <td className="px-4 py-2 text-sm">
                              {isEditing ? (
                                <Input
                                  value={s.name || ""}
                                  onChange={(e) => {
                                    const updated = { ...editablePlaybook };
                                    updated.raciMatrix[i].name = e.target.value;
                                    setEditablePlaybook({ ...updated });
                                  }}
                                  className="bg-gray-50 border-slate-600 text-gray-900 h-8 text-sm"
                                />
                              ) : (
                                <span className="text-gray-900">{s.name}</span>
                              )}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-800">{s.department}</td>
                            <td className="px-4 py-2">
                              <Badge className={`${raciColor(s.responsibility || s.raci)} text-xs`}>
                                {s.responsibility || s.raci || "I"}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Task Sequence */}
            {editablePlaybook?.taskSequence?.length > 0 && (
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900 text-lg flex items-center gap-2">
                    <Activity className="w-5 h-5 text-[#2B8A6E]" /> Task Sequence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {editablePlaybook.taskSequence.map((task: any, i: number) => (
                      <div
                        key={i}
                        className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center gap-3"
                      >
                        <span className="bg-gray-50 text-gray-800 rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{task.name || task.task || task.title}</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {task.owner && <span className="text-xs text-gray-700">Owner: {task.owner}</span>}
                            {task.duration && <span className="text-xs text-gray-700">Duration: {task.duration}</span>}
                            {task.phase && <span className="text-xs text-teal-500">{task.phase}</span>}
                          </div>
                        </div>
                        {task.priority && (
                          <Badge className={`${priorityColor(task.priority)} text-xs flex-shrink-0`}>
                            {task.priority}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Pre-Authorized Thresholds */}
            {editablePlaybook?.preAuthorizedThresholds?.length > 0 && (
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900 text-lg flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#C9A84C]" /> Pre-Authorized Thresholds
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-3">
                    {editablePlaybook.preAuthorizedThresholds.map((t: any, i: number) => (
                      <div key={i} className="bg-gray-50 border border-[#C9A84C]/20 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-900">{t.decision}</p>
                        <p className="text-xs text-[#C9A84C] mt-1">Limit: {t.limit}</p>
                        <p className="text-xs text-gray-700 mt-0.5">Approver: {t.approver}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-end">
              <Button
                size="lg"
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="bg-teal-500 hover:bg-teal-600 text-gray-900 gap-2 px-8"
              >
                {isSimulating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Starting Simulation...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" /> Run Simulation
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: LIVE SIMULATION */}
        {currentStep === 4 && (
          <div className="space-y-6">
            {/* Domain-colored Alert Banner */}
            <div className={`${simBannerConfig.bg} border ${simBannerConfig.border} rounded-xl p-4 flex items-center gap-3`}>
              <div className={`w-3 h-3 ${simBannerConfig.dotColor} rounded-full animate-pulse`} />
              <span className={`${simBannerConfig.textColor} font-semibold`}>{simBannerConfig.label}</span>
              <span className="text-gray-800 text-sm ml-auto">
                {editablePlaybook?.name || playbook?.name || "Simulation Running"}
              </span>
            </div>

            {/* Elapsed Timer */}
            <div className="text-center">
              <p className="text-gray-700 text-sm uppercase tracking-wide mb-1">Elapsed Time</p>
              <p className="text-5xl font-mono font-bold text-gray-900">{formatTime(elapsedSeconds)}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Stakeholder Status */}
              <Card className="bg-white border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-gray-900 text-lg flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#0A0F2E]" /> Stakeholder Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {stakeholders.length > 0 ? (
                      stakeholders.map((s: any, i: number) => {
                        const status = s.status || (s.acknowledged ? "acknowledged" : s.notified ? "notified" : "pending");
                        return (
                          <div key={i} className="flex items-center gap-3 py-1.5">
                            {status === "acknowledged" ? (
                              <div className="w-3 h-3 bg-[#2B8A6E] rounded-full flex items-center justify-center">
                                <Check className="w-2 h-2 text-gray-900" />
                              </div>
                            ) : status === "notified" ? (
                              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
                            ) : (
                              <div className="w-3 h-3 bg-[#6B7280] rounded-full" />
                            )}
                            <span className="text-sm text-gray-800 flex-1">{s.name || s.role || `Stakeholder ${i + 1}`}</span>
                            <span className={`text-xs ${
                              status === "acknowledged" ? "text-[#2B8A6E]" : status === "notified" ? "text-yellow-400" : "text-gray-800"
                            }`}>
                              {status}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-gray-800 text-sm">Waiting for stakeholder data...</p>
                    )}
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-700 mb-1">
                      <span>Coordination</span>
                      <span>{acknowledgedCount}/{stakeholders.length} acknowledged</span>
                    </div>
                    <Progress
                      value={stakeholders.length > 0 ? (acknowledgedCount / stakeholders.length) * 100 : 0}
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Task Progress */}
              <Card className="bg-white border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-gray-900 text-lg flex items-center gap-2">
                    <Activity className="w-5 h-5 text-[#2B8A6E]" /> Task Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {tasks.length > 0 ? (
                      tasks.map((t: any, i: number) => {
                        const status = t.status || (t.completed ? "completed" : t.inProgress ? "in_progress" : "pending");
                        return (
                          <div key={i} className="flex items-center gap-3 py-1.5">
                            {status === "completed" ? (
                              <CheckCircle className="w-4 h-4 text-[#2B8A6E] flex-shrink-0" />
                            ) : status === "in_progress" ? (
                              <div className="w-4 h-4 border-2 border-[#0A0F2E] rounded-full animate-pulse flex-shrink-0" />
                            ) : (
                              <CircleDot className="w-4 h-4 text-gray-800 flex-shrink-0" />
                            )}
                            <span className="text-sm text-gray-800 flex-1 truncate">
                              {t.name || t.task || t.title || `Task ${i + 1}`}
                            </span>
                            <span className={`text-xs flex-shrink-0 ${
                              status === "completed" ? "text-[#2B8A6E]" : status === "in_progress" ? "text-[#0A0F2E]" : "text-gray-800"
                            }`}>
                              {status === "in_progress" ? "In Progress" : status}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-gray-800 text-sm">Waiting for task data...</p>
                    )}
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-700 mb-1">
                      <span>Task Completion</span>
                      <span>{completedTaskCount}/{tasks.length}</span>
                    </div>
                    <Progress
                      value={tasks.length > 0 ? (completedTaskCount / tasks.length) * 100 : 0}
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {simulationComplete && (
              <div className={`${dc.darkBg} border ${dc.border} rounded-xl p-6 text-center`}>
                <CheckCircle className="w-10 h-10 text-[#2B8A6E] mx-auto mb-3" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Simulation Complete</h3>
                <p className="text-gray-800 mb-4">
                  All stakeholders coordinated and tasks completed in {formatTime(elapsedSeconds)}
                </p>
                <Button
                  size="lg"
                  onClick={handleGoToReport}
                  className="bg-teal-500 hover:bg-teal-600 text-gray-900 gap-2 px-8"
                >
                  <Download className="w-5 h-5" /> Download Report
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}

            {!simulationComplete && (
              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={handleGoToReport}
                  className="text-gray-800 border-gray-200 hover:bg-[#141B45] hover:text-white"
                >
                  Skip to Report
                </Button>
              </div>
            )}
          </div>
        )}

        {/* STEP 5: DOWNLOAD REPORT */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <Card className="bg-white border-gray-200">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-teal-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-teal-400" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Executive Report is Ready</h2>
                <p className="text-gray-800 max-w-lg mx-auto">
                  Download your strategic analysis, playbook, and simulation results as professional PDF reports.
                </p>
              </CardContent>
            </Card>

            {/* Summary Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                <DomainIcon domain={activeDomain} className={`w-6 h-6 ${dc.text} mx-auto mb-2`} />
                <p className="text-xs text-gray-700 mb-1">Domain</p>
                <p className={`text-sm font-semibold ${dc.text}`}>{dc.label}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                <DollarSign className="w-6 h-6 text-[#2B8A6E] mx-auto mb-2" />
                <p className="text-xs text-gray-700 mb-1">Impact Avoided</p>
                <p className="text-sm font-semibold text-[#2B8A6E]">{analysis?.estimatedImpact || "Significant"}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                <Clock className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                <p className="text-xs text-gray-700 mb-1">Coordination Time</p>
                <p className="text-sm font-semibold text-amber-400">{formatTime(elapsedSeconds)}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                <BookOpen className="w-6 h-6 text-[#0A0F2E] mx-auto mb-2" />
                <p className="text-xs text-gray-700 mb-1">Playbook Generated</p>
                <p className="text-sm font-semibold text-gray-900">{playbook?.name || "Custom Playbook"}</p>
              </div>
            </div>

            {/* Download Buttons */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Card className="bg-white border-gray-200 hover:border-teal-500/30 transition-colors cursor-pointer group">
                <CardContent className="pt-6 text-center">
                  <Download className="w-10 h-10 text-teal-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Strategic Analysis Report</h3>
                  <p className="text-sm text-gray-800 mb-4">
                    Complete analysis with side-by-side comparison, playbook summary, and simulation results
                  </p>
                  <Button
                    onClick={generateIncidentPDF}
                    className="bg-teal-500 hover:bg-teal-600 text-gray-900 gap-2 w-full"
                  >
                    <Download className="w-4 h-4" /> Download Strategic Report (PDF)
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200 hover:border-[#2B8A6E]/30 transition-colors cursor-pointer group">
                <CardContent className="pt-6 text-center">
                  <FileText className="w-10 h-10 text-[#2B8A6E] mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Board Briefing Deck</h3>
                  <p className="text-sm text-gray-800 mb-4">
                    Executive summary, risk assessment, playbook overview, and ROI projection for board presentation
                  </p>
                  <Button
                    onClick={generateBoardPDF}
                    className="bg-[#2B8A6E] hover:bg-[#2B8A6E] text-gray-900 gap-2 w-full"
                  >
                    <Download className="w-4 h-4" /> Download Board Briefing (PDF)
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="text-center pt-4">
              <Button
                variant="outline"
                size="lg"
                onClick={handleReset}
                className="text-gray-800 border-gray-200 hover:bg-[#141B45] hover:text-white gap-2"
              >
                <RefreshCw className="w-4 h-4" /> Start New Analysis
              </Button>
            </div>
          </div>
        )}

        {/* Validation Banner */}
        <div className="max-w-4xl mx-auto mb-12 px-6">
          <div className="bg-gradient-to-r   border border-[#2B8A6E]/40 rounded-xl p-6 text-center">
            <p className="text-[#3BAF8A] font-semibold mb-2">
              McKinsey, BCG, Bain, Deloitte, PwC, and 10 more firms all published 2025-2026 guides confirming the execution infrastructure gap.
            </p>
            <p className="text-gray-800 text-sm">
              Execution OS is that infrastructure -- ready to deploy today.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
