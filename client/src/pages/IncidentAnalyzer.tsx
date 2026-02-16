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
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const STEP_LABELS = ["Describe", "Analyze", "Playbook", "Simulate", "Report"];

function raciColor(r: string) {
  switch (r?.toUpperCase()) {
    case "R": return "bg-red-500/20 text-red-400 border-red-500/30";
    case "A": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    case "C": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "I": return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    default: return "bg-slate-500/20 text-slate-400 border-slate-500/30";
  }
}

function priorityColor(p: string) {
  switch (p?.toLowerCase()) {
    case "critical": return "bg-red-500/20 text-red-400 border-red-500/30";
    case "high": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    case "medium": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "low": return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    default: return "bg-slate-500/20 text-slate-400 border-slate-500/30";
  }
}

export default function IncidentAnalyzer() {
  const [currentStep, setCurrentStep] = useState(1);
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

  const handleAnalyze = async () => {
    if (!description.trim()) return;
    setError("");
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/incidents/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, companyName, email }),
      });
      if (!res.ok) throw new Error(`Analysis failed (${res.status})`);
      const data = await res.json();
      setAnalysis(data);
      setIncidentId(data.incidentId || data.id || "inc-" + Date.now());
      setCurrentStep(2);
    } catch (e: any) {
      setError(e.message || "Failed to analyze incident");
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
      setPlaybook(data);
      setEditablePlaybook(JSON.parse(JSON.stringify(data)));
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
          // continue polling
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
    setCurrentStep(1);
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
    doc.text("ExecuteIQ", 105, 50, { align: "center" });
    doc.setFontSize(14);
    doc.setTextColor(94, 234, 212);
    doc.text("Incident Analysis Report", 105, 65, { align: "center" });
    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, 80, { align: "center" });
    if (companyName) doc.text(`Company: ${companyName}`, 105, 90, { align: "center" });

    doc.addPage();
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 297, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text("Incident Analysis", 20, 25);

    doc.setFontSize(11);
    doc.setTextColor(148, 163, 184);
    const descLines = doc.splitTextToSize(description, 170);
    doc.text(descLines, 20, 40);

    let y = 40 + descLines.length * 6 + 10;
    if (analysis?.incidentType) {
      doc.setTextColor(94, 234, 212);
      doc.text(`Incident Type: ${analysis.incidentType}`, 20, y);
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

    if (analysis?.comparison?.length) {
      doc.addPage();
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, 210, 297, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.text("Side-by-Side Comparison", 20, 25);

      autoTable(doc, {
        startY: 35,
        head: [["Phase", "Your Reality", "With ExecuteIQ"]],
        body: analysis.comparison.map((row: any) => [
          row.phase || row.label || "",
          row.without || row.yourReality || "",
          row.with || row.withExecuteIQ || "",
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

    doc.save("ExecuteIQ-Incident-Report.pdf");
  };

  const generateBoardPDF = () => {
    const doc = new jsPDF();
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 297, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.text("ExecuteIQ", 105, 50, { align: "center" });
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
      `An incident analysis was conducted for ${companyName || "the organization"} regarding: ${description.slice(0, 200)}...`,
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
    if (analysis?.incidentType) { doc.text(`• Incident Type: ${analysis.incidentType}`, 25, y); y += 7; }
    if (analysis?.estimatedImpact) { doc.text(`• Estimated Impact: ${analysis.estimatedImpact}`, 25, y); y += 7; }
    if (analysis?.rootCause) { doc.text(`• Root Cause: ${analysis.rootCause}`, 25, y); y += 7; }

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
      `Institutional memory captured for future incidents`,
    ];
    let roiY = 40;
    roiItems.forEach((item) => {
      doc.text(`• ${item}`, 25, roiY);
      roiY += 8;
    });

    doc.save("ExecuteIQ-Board-Briefing.pdf");
  };

  const stakeholders = simulationData?.stakeholders || editablePlaybook?.raciMatrix || playbook?.raciMatrix || [];
  const tasks = simulationData?.tasks || editablePlaybook?.taskSequence || playbook?.taskSequence || [];
  const acknowledgedCount = stakeholders.filter((s: any) => s.status === "acknowledged" || s.acknowledged).length;
  const completedTaskCount = tasks.filter((t: any) => t.status === "completed" || t.completed).length;
  const simulationComplete = simulationData?.status === "completed" || simulationData?.completed;

  return (
    <div className="min-h-screen bg-slate-950">
      <StandardNav />

      <main className="container mx-auto px-4 py-12 pt-24 max-w-5xl">
        <div className="text-center mb-10">
          <Badge className="mb-4 bg-teal-500/20 text-teal-400 border-teal-500/30">
            <Brain className="w-4 h-4 mr-2" />
            Incident Analyzer
          </Badge>
          <h1 className="text-4xl font-bold text-white mb-3">
            AI-Powered Incident Analysis
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Describe a past incident and get actionable playbooks, simulations, and executive reports
          </p>
        </div>

        {/* Step Indicator */}
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
                          ? "bg-teal-500 text-white shadow-lg shadow-teal-500/30"
                          : isComplete
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-800 text-slate-500"
                      }`}
                    >
                      {isComplete ? <Check className="w-4 h-4" /> : stepNum}
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        isActive ? "text-teal-400" : isComplete ? "text-emerald-400" : "text-slate-600"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                  {i < STEP_LABELS.length - 1 && (
                    <div
                      className={`w-10 h-0.5 mx-1 mt-[-12px] ${
                        currentStep > stepNum ? "bg-emerald-500" : "bg-slate-800"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Proof Points Bar */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 py-4 px-6 bg-slate-800/50 rounded-xl border border-slate-700/50 mb-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-400">166</div>
            <div className="text-xs text-slate-400">Playbooks Ready</div>
          </div>
          <div className="w-px h-8 bg-slate-700" />
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-400">9</div>
            <div className="text-xs text-slate-400">Strategic Domains</div>
          </div>
          <div className="w-px h-8 bg-slate-700" />
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-400">12 min</div>
            <div className="text-xs text-slate-400">Avg Coordination</div>
          </div>
          <div className="w-px h-8 bg-slate-700" />
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-400">$450M+</div>
            <div className="text-xs text-slate-400">Value Protected</div>
          </div>
          <div className="w-px h-8 bg-slate-700" />
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400">15</div>
            <div className="text-xs text-slate-400">Firms Validated</div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/50 border border-red-500/30 text-red-400 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
            <button onClick={() => setError("")} className="ml-auto">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 1: DESCRIBE INCIDENT */}
        {currentStep === 1 && (
          <Card className="bg-slate-900/80 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-2xl">
                <FileText className="w-6 h-6 text-teal-400" />
                Describe a Real Incident
              </CardTitle>
              <p className="text-slate-400 mt-1">
                Tell us about a crisis, missed opportunity, or coordination failure your company experienced.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-slate-300">Incident Description *</Label>
                <Textarea
                  rows={6}
                  placeholder="Last year ransomware hit our Atlanta office. It took 3 days to figure out who was in charge. By then it had spread to 4 other locations."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-600 focus:border-teal-500 resize-none"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-500" />
                    Company Name (optional)
                  </Label>
                  <Input
                    placeholder="Acme Corp"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-600 focus:border-teal-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-500" />
                    Email (optional)
                  </Label>
                  <Input
                    type="email"
                    placeholder="exec@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-600 focus:border-teal-500"
                  />
                  <p className="text-xs text-slate-600">
                    Enter your email to receive a real notification during the simulation
                  </p>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button
                  size="lg"
                  onClick={handleAnalyze}
                  disabled={!description.trim() || isAnalyzing}
                  className="bg-teal-500 hover:bg-teal-600 text-white gap-2 px-8"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" /> Analyze Incident
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
            <Card className="bg-slate-900/80 border-slate-800">
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <CardTitle className="text-white flex items-center gap-2 text-2xl">
                    <Brain className="w-6 h-6 text-teal-400" />
                    AI Analysis Results
                  </CardTitle>
                  {analysis.incidentType && (
                    <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/30 text-sm">
                      {analysis.incidentType}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Stats */}
                <div className="grid md:grid-cols-2 gap-4">
                  {analysis.estimatedImpact && (
                    <div className="bg-red-950/30 border border-red-500/20 rounded-xl p-5 text-center">
                      <DollarSign className="w-8 h-8 text-red-400 mx-auto mb-2" />
                      <p className="text-sm text-slate-400 mb-1">Estimated Impact</p>
                      <p className="text-2xl font-bold text-red-400">{analysis.estimatedImpact}</p>
                    </div>
                  )}
                  {analysis.timeToCoordination && (
                    <div className="bg-amber-950/30 border border-amber-500/20 rounded-xl p-5 text-center">
                      <Clock className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                      <p className="text-sm text-slate-400 mb-1">Time to Coordination</p>
                      <p className="text-2xl font-bold text-amber-400">{analysis.timeToCoordination}</p>
                    </div>
                  )}
                </div>

                {/* What Went Wrong */}
                {analysis.whatWentWrong?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
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
                          <p className="text-slate-300 text-sm">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Root Cause */}
                {analysis.rootCause && (
                  <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-amber-400 mb-2 flex items-center gap-2">
                      <Target className="w-4 h-4" /> Root Cause
                    </h4>
                    <p className="text-slate-300 text-sm">{analysis.rootCause}</p>
                  </div>
                )}

                {/* Side-by-Side Comparison */}
                {analysis.comparison?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Side-by-Side Comparison</h3>
                    <div className="overflow-x-auto rounded-xl border border-slate-700">
                      <table className="w-full">
                        <thead>
                          <tr>
                            <th className="bg-slate-800 px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase w-1/4">
                              Phase
                            </th>
                            <th className="bg-red-950/40 px-4 py-3 text-left text-xs font-semibold text-red-400 uppercase w-[37.5%]">
                              Your Reality
                            </th>
                            <th className="bg-teal-950/40 px-4 py-3 text-left text-xs font-semibold text-teal-400 uppercase w-[37.5%]">
                              With ExecuteIQ
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {analysis.comparison.map((row: any, i: number) => (
                            <tr key={i} className="border-t border-slate-800">
                              <td className="bg-slate-900/50 px-4 py-3 text-sm font-medium text-slate-300">
                                {row.phase || row.label}
                              </td>
                              <td className="bg-red-950/10 px-4 py-3 text-sm text-red-300">
                                {row.without || row.yourReality}
                              </td>
                              <td className="bg-teal-950/10 px-4 py-3 text-sm text-teal-300">
                                {row.with || row.withExecuteIQ}
                              </td>
                            </tr>
                          ))}
                          {(analysis.costWithout || analysis.costWith) && (
                            <tr className="border-t-2 border-slate-700">
                              <td className="bg-slate-900/50 px-4 py-4 text-sm font-bold text-white">
                                Total Cost
                              </td>
                              <td className="bg-red-950/20 px-4 py-4 text-lg font-bold text-red-400">
                                {analysis.costWithout}
                              </td>
                              <td className="bg-teal-950/20 px-4 py-4 text-lg font-bold text-teal-400">
                                {analysis.costWith}
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
                className="bg-teal-500 hover:bg-teal-600 text-white gap-2 px-8"
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
            {/* Playbook Header */}
            <Card className="bg-slate-900/80 border-slate-800">
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <CardTitle className="text-white flex items-center gap-2 text-2xl">
                    <BookOpen className="w-6 h-6 text-teal-400" />
                    {editablePlaybook?.name || playbook?.name || "Generated Playbook"}
                  </CardTitle>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      isEditing
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        : "bg-slate-800 text-slate-400 hover:text-white border border-slate-700"
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
                    <Badge className="bg-slate-800 text-slate-300 border-slate-700">
                      Code: {editablePlaybook.code}
                    </Badge>
                  )}
                  {editablePlaybook?.domain && (
                    <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/30">
                      {editablePlaybook.domain}
                    </Badge>
                  )}
                  {editablePlaybook?.category && (
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                      {editablePlaybook.category}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Trigger Conditions */}
            {editablePlaybook?.triggerConditions?.length > 0 && (
              <Card className="bg-slate-900/80 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-400" /> Trigger Conditions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-3">
                    {editablePlaybook.triggerConditions.map((tc: any, i: number) => (
                      <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
                        <p className="text-sm font-medium text-white">{tc.condition || tc.name || tc.trigger}</p>
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
              <Card className="bg-slate-900/80 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-400" /> Stakeholder RACI Matrix
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto rounded-lg border border-slate-700">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-800">
                          <th className="px-4 py-2 text-left text-xs font-semibold text-slate-400 uppercase">Role</th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-slate-400 uppercase">Name</th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-slate-400 uppercase">Department</th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-slate-400 uppercase">RACI</th>
                        </tr>
                      </thead>
                      <tbody>
                        {editablePlaybook.raciMatrix.map((s: any, i: number) => (
                          <tr key={i} className="border-t border-slate-800">
                            <td className="px-4 py-2 text-sm text-slate-300">{s.role}</td>
                            <td className="px-4 py-2 text-sm">
                              {isEditing ? (
                                <Input
                                  value={s.name || ""}
                                  onChange={(e) => {
                                    const updated = { ...editablePlaybook };
                                    updated.raciMatrix[i].name = e.target.value;
                                    setEditablePlaybook({ ...updated });
                                  }}
                                  className="bg-slate-800 border-slate-600 text-white h-8 text-sm"
                                />
                              ) : (
                                <span className="text-white">{s.name}</span>
                              )}
                            </td>
                            <td className="px-4 py-2 text-sm text-slate-400">{s.department}</td>
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
              <Card className="bg-slate-900/80 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-400" /> Task Sequence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {editablePlaybook.taskSequence.map((task: any, i: number) => (
                      <div
                        key={i}
                        className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 flex items-center gap-3"
                      >
                        <span className="bg-slate-700 text-slate-300 rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{task.name || task.task || task.title}</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {task.owner && <span className="text-xs text-slate-500">Owner: {task.owner}</span>}
                            {task.duration && <span className="text-xs text-slate-500">Duration: {task.duration}</span>}
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
              <Card className="bg-slate-900/80 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <Shield className="w-5 h-5 text-purple-400" /> Pre-Authorized Thresholds
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-3">
                    {editablePlaybook.preAuthorizedThresholds.map((t: any, i: number) => (
                      <div key={i} className="bg-slate-800/50 border border-purple-500/20 rounded-lg p-3">
                        <p className="text-sm font-medium text-white">{t.decision}</p>
                        <p className="text-xs text-purple-400 mt-1">Limit: {t.limit}</p>
                        <p className="text-xs text-slate-500 mt-0.5">Approver: {t.approver}</p>
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
                className="bg-teal-500 hover:bg-teal-600 text-white gap-2 px-8"
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
            {/* Playbook Activated Alert */}
            <div className="bg-teal-950/30 border border-teal-500/30 rounded-xl p-4 flex items-center gap-3">
              <div className="w-3 h-3 bg-teal-400 rounded-full animate-pulse" />
              <span className="text-teal-400 font-semibold">Playbook Activated</span>
              <span className="text-slate-400 text-sm ml-auto">
                {editablePlaybook?.name || playbook?.name || "Simulation Running"}
              </span>
            </div>

            {/* Elapsed Timer */}
            <div className="text-center">
              <p className="text-slate-500 text-sm uppercase tracking-wide mb-1">Elapsed Time</p>
              <p className="text-5xl font-mono font-bold text-white">{formatTime(elapsedSeconds)}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Stakeholder Status */}
              <Card className="bg-slate-900/80 border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-400" /> Stakeholder Status
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
                              <div className="w-3 h-3 bg-emerald-400 rounded-full flex items-center justify-center">
                                <Check className="w-2 h-2 text-white" />
                              </div>
                            ) : status === "notified" ? (
                              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
                            ) : (
                              <div className="w-3 h-3 bg-slate-600 rounded-full" />
                            )}
                            <span className="text-sm text-slate-300 flex-1">{s.name || s.role || `Stakeholder ${i + 1}`}</span>
                            <span className={`text-xs ${
                              status === "acknowledged" ? "text-emerald-400" : status === "notified" ? "text-yellow-400" : "text-slate-600"
                            }`}>
                              {status}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-slate-600 text-sm">Waiting for stakeholder data...</p>
                    )}
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
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
              <Card className="bg-slate-900/80 border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-400" /> Task Progress
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
                              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                            ) : status === "in_progress" ? (
                              <div className="w-4 h-4 border-2 border-blue-400 rounded-full animate-pulse flex-shrink-0" />
                            ) : (
                              <CircleDot className="w-4 h-4 text-slate-600 flex-shrink-0" />
                            )}
                            <span className="text-sm text-slate-300 flex-1 truncate">
                              {t.name || t.task || t.title || `Task ${i + 1}`}
                            </span>
                            <span className={`text-xs flex-shrink-0 ${
                              status === "completed" ? "text-emerald-400" : status === "in_progress" ? "text-blue-400" : "text-slate-600"
                            }`}>
                              {status === "in_progress" ? "In Progress" : status}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-slate-600 text-sm">Waiting for task data...</p>
                    )}
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
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
              <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-6 text-center">
                <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-white mb-2">Simulation Complete</h3>
                <p className="text-slate-400 mb-4">
                  All stakeholders coordinated and tasks completed in {formatTime(elapsedSeconds)}
                </p>
                <Button
                  size="lg"
                  onClick={handleGoToReport}
                  className="bg-teal-500 hover:bg-teal-600 text-white gap-2 px-8"
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
                  className="text-slate-400 border-slate-700 hover:bg-slate-800 hover:text-white"
                >
                  Skip to Report →
                </Button>
              </div>
            )}
          </div>
        )}

        {/* STEP 5: DOWNLOAD REPORT */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <Card className="bg-slate-900/80 border-slate-800">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-teal-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-teal-400" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Your Executive Report is Ready</h2>
                <p className="text-slate-400 max-w-lg mx-auto">
                  Download your incident analysis, playbook, and simulation results as professional PDF reports.
                </p>
              </CardContent>
            </Card>

            {/* Summary Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-center">
                <Shield className="w-6 h-6 text-teal-400 mx-auto mb-2" />
                <p className="text-xs text-slate-500 mb-1">Incident Type</p>
                <p className="text-sm font-semibold text-white">{analysis?.incidentType || "Analyzed"}</p>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-center">
                <DollarSign className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <p className="text-xs text-slate-500 mb-1">Impact Avoided</p>
                <p className="text-sm font-semibold text-emerald-400">{analysis?.estimatedImpact || "Significant"}</p>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-center">
                <Clock className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                <p className="text-xs text-slate-500 mb-1">Coordination Time</p>
                <p className="text-sm font-semibold text-amber-400">{formatTime(elapsedSeconds)}</p>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-center">
                <BookOpen className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <p className="text-xs text-slate-500 mb-1">Playbook Generated</p>
                <p className="text-sm font-semibold text-white">{playbook?.name || "Custom Playbook"}</p>
              </div>
            </div>

            {/* Download Buttons */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Card className="bg-slate-900/80 border-slate-800 hover:border-teal-500/30 transition-colors cursor-pointer group">
                <CardContent className="pt-6 text-center">
                  <Download className="w-10 h-10 text-teal-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-semibold text-white mb-2">Incident Report</h3>
                  <p className="text-sm text-slate-400 mb-4">
                    Complete analysis with side-by-side comparison, playbook summary, and simulation results
                  </p>
                  <Button
                    onClick={generateIncidentPDF}
                    className="bg-teal-500 hover:bg-teal-600 text-white gap-2 w-full"
                  >
                    <Download className="w-4 h-4" /> Download Incident Report (PDF)
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/80 border-slate-800 hover:border-emerald-500/30 transition-colors cursor-pointer group">
                <CardContent className="pt-6 text-center">
                  <FileText className="w-10 h-10 text-emerald-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-semibold text-white mb-2">Board Briefing Deck</h3>
                  <p className="text-sm text-slate-400 mb-4">
                    Executive summary, risk assessment, playbook overview, and ROI projection for board presentation
                  </p>
                  <Button
                    onClick={generateBoardPDF}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2 w-full"
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
                className="text-slate-400 border-slate-700 hover:bg-slate-800 hover:text-white gap-2"
              >
                <RefreshCw className="w-4 h-4" /> Start New Analysis
              </Button>
            </div>
          </div>
        )}

        {/* Validation Banner */}
        <div className="max-w-4xl mx-auto mb-12 px-6">
          <div className="bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border border-emerald-700/40 rounded-xl p-6 text-center">
            <p className="text-emerald-300 font-semibold mb-2">
              McKinsey, BCG, Bain, Deloitte, PwC, and 10 more firms all published 2025-2026 guides confirming the execution infrastructure gap.
            </p>
            <p className="text-slate-400 text-sm">
              ExecuteIQ is that infrastructure — ready to deploy today.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
