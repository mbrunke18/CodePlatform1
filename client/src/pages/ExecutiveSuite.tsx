import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import PageLayout from '@/components/layout/PageLayout';
import { 
  Crown, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target, 
  Briefcase,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Globe,
  Shield,
  Brain,
  Trophy
} from 'lucide-react';

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const GOLD_LT = "#DFC178";
const TEAL = "#2B8A6E";
const OFF = "#F8F7F4";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

export default function ExecutiveSuite() {
  const executiveMetrics = [
    { title: "Strategic Initiatives", value: "12 Active", change: "+3 this quarter", trend: "up" },
    { title: "Organizational Health", value: "92%", change: "+8% vs last quarter", trend: "up" },
    { title: "Crisis Readiness", value: "97%", change: "Protocols updated", trend: "stable" },
    { title: "Innovation Pipeline", value: "28 Projects", change: "+5 breakthrough opportunities", trend: "up" }
  ];

  const boardReports = [
    {
      title: "Q3 Strategic Performance Review",
      type: "Quarterly Board Report",
      status: "Ready for Review",
      date: "September 2025",
      icon: <FileText className="w-5 h-5 text-white" />
    },
    {
      title: "Crisis Response Capabilities Assessment",
      type: "Risk Management Report",
      status: "Completed",
      date: "August 2025",
      icon: <Shield className="w-5 h-5 text-white" />
    },
    {
      title: "Organizational Intelligence ROI Analysis",
      type: "Investment Performance",
      status: "In Progress",
      date: "September 2025",
      icon: <TrendingUp className="w-5 h-5 text-white" />
    }
  ];

  const executivePriorities = [
    "Digital transformation acceleration (+23% efficiency gains)",
    "Strategic execution protocol optimization (12-minute activation time)",
    "AI-powered decision intelligence (85-92% accuracy rate)",
    "Cross-functional team collaboration enhancement",
    "Innovation pipeline management (28 active projects)"
  ];

  return (
    <PageLayout>
      <div className="flex-1 bg-white overflow-auto">
        {/* Navy Hero Section */}
        <div style={{ background: NAVY, padding: "64px 48px", position: "relative", overflow: "hidden", minHeight: 320 }}>
          <div style={{ 
            position: "absolute", 
            inset: 0, 
            backgroundImage: "linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)", 
            backgroundSize: "44px 44px" 
          }} />
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 28, height: 2, background: "rgba(255,255,255,0.35)", flexShrink: 0 }} />
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.45)" }}>C-Suite Intelligence</span>
                </div>
                <h1 style={{ ...CG, fontWeight: 600, fontSize: "clamp(40px,5vw,56px)", lineHeight: 1.05, color: "#fff", marginBottom: 16 }}>
                  Executive <em style={{ fontStyle: "italic", color: GOLD_LT }}>Command Center</em>
                </h1>
                <p className="text-white/60 text-lg max-w-2xl">Strategic decision support and real-time organizational command for executive leadership.</p>
              </div>
              <div className="text-right hidden md:block">
                <div style={{ display:"inline-flex", alignItems:"center", gap:5, background:"rgba(43,138,110,0.12)", color:"#3BAF8A", fontSize:9, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase" as const, padding:"3px 10px" }}>
                  <CheckCircle className="w-3 h-3" />
                  All Systems Operational
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ROI Stats Banner */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", background: OFF, borderBottom:"1px solid #E8E4DC" }}>
          <div style={{ padding:24, borderRight:"1px solid #E8E4DC" }}>
            <div style={{ ...CG, fontSize: 40, fontWeight: 600, color: GOLD, lineHeight: 1 }}>$5.8M</div>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6B7280", marginTop: 4 }}>Avg Annual Value</div>
          </div>
          <div style={{ padding:24, borderRight:"1px solid #E8E4DC" }}>
            <div style={{ ...CG, fontSize: 40, fontWeight: 600, color: GOLD, lineHeight: 1 }}>$4.2M</div>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6B7280", marginTop: 4 }}>Avg Risk Mitigation</div>
          </div>
          <div style={{ padding:24, borderRight:"1px solid #E8E4DC" }}>
            <div style={{ ...CG, fontSize: 40, fontWeight: 600, color: GOLD, lineHeight: 1 }}>720h</div>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6B7280", marginTop: 4 }}>Time Saved/Year</div>
          </div>
          <div style={{ padding:24 }}>
            <div style={{ ...CG, fontSize: 40, fontWeight: 600, color: GOLD, lineHeight: 1 }}>92%</div>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6B7280", marginTop: 4 }}>Board Confidence</div>
          </div>
        </div>

        <div className="p-12 max-w-7xl mx-auto space-y-12">
          {/* Executive Performance Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {executiveMetrics.map((metric, index) => (
              <div key={index} className="border border-[#E8E4DC] bg-white p-6 hover:border-[#0A0F2E] transition-colors">
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6B7280", marginBottom: 8 }}>{metric.title}</div>
                <div style={{ ...CG, fontSize: 28, fontWeight: 600, color: NAVY, marginBottom: 4 }}>{metric.value}</div>
                <div className={`text-xs font-bold ${
                  metric.trend === 'up' ? 'text-[#2B8A6E]' : 'text-[#6B7280]'
                }`}>
                  {metric.change}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Board Reports */}
            <div style={{ border: "1px solid #E8E4DC", borderLeft: `3px solid ${NAVY}`, padding: "32px", background: "#fff" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 28, height: 2, background: NAVY, flexShrink: 0 }} />
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: NAVY }}>Strategic Documentation</span>
              </div>
              <h2 style={{ ...CG, fontSize: 32, fontWeight: 600, color: NAVY, marginBottom: 24 }}>Board Reports</h2>
              <div className="space-y-4">
                {boardReports.map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-[#F8F7F4] border border-[#E8E4DC]">
                    <div className="flex items-center space-x-4">
                      <div style={{ width:32, height:32, background:NAVY, display:"flex", alignItems:"center", justifyContent:"center" }}>
                        {report.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-[#0A0F2E]">{report.title}</h4>
                        <p className="text-xs text-[#6B7280]">{report.type} • {report.date}</p>
                      </div>
                    </div>
                    <span style={{ background: report.status === 'Completed' ? "rgba(43,138,110,0.12)" : "rgba(201,168,76,0.12)", color: report.status === 'Completed' ? "#3BAF8A" : "#C9A84C", fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, padding: "3px 10px" }}>
                      {report.status}
                    </span>
                  </div>
                ))}
              </div>
              <button style={{ background: NAVY, color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "14px 28px", border: "none", cursor: "pointer", width: "100%", marginTop: 24 }}>
                Generate Executive Summary
              </button>
            </div>

            {/* Strategic Priorities */}
            <div style={{ border: "1px solid #E8E4DC", borderLeft: `3px solid ${GOLD}`, padding: "32px", background: "#fff" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 28, height: 2, background: GOLD, flexShrink: 0 }} />
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: GOLD }}>Execution Focus</span>
              </div>
              <h2 style={{ ...CG, fontSize: 32, fontWeight: 600, color: NAVY, marginBottom: 24 }}>Current Priorities</h2>
              <div className="space-y-4 mb-8">
                {executivePriorities.map((priority, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-[#F8F7F4] border border-[#E8E4DC]">
                    <CheckCircle className="w-4 h-4 mt-0.5 text-[#2B8A6E] flex-shrink-0" />
                    <span className="text-sm text-[#0A0F2E]">{priority}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-4">
                <button style={{ border: "1.5px solid #E8E4DC", color: NAVY, background: "transparent", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "12px 24px", cursor: "pointer", flex: 1 }}>
                  Update Priorities
                </button>
                <button style={{ background: GOLD, color: NAVY, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "12px 24px", border: "none", cursor: "pointer", flex: 1 }}>
                  Schedule Review
                </button>
              </div>
            </div>
          </div>

          {/* Executive Command Actions */}
          <div style={{ background: NAVY, padding: "48px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 28, height: 2, background: "rgba(255,255,255,0.35)", flexShrink: 0 }} />
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.45)" }}>Command Override</span>
            </div>
            <h2 style={{ ...CG, fontSize: 32, fontWeight: 600, color: "#fff", marginBottom: 32 }}>Executive Command Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button className="bg-red-600 hover:bg-red-700 text-white font-bold h-20 flex items-center justify-center gap-3">
                <AlertCircle className="w-5 h-5" />
                Emergency Crisis Activation
              </button>
              <button style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontWeight: "bold" }} className="h-20 flex items-center justify-center gap-3 hover:bg-white/10">
                <Brain className="w-5 h-5 text-[#DFC178]" />
                AI Strategic Intelligence
              </button>
              <button style={{ background: GOLD, color: NAVY, fontWeight: "bold" }} className="h-20 flex items-center justify-center gap-3 hover:bg-[#DFC178]">
                <Briefcase className="w-5 h-5" />
                Generate Board Presentation
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}