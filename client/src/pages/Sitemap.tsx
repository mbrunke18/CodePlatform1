import StandardNav from '@/components/layout/StandardNav';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";

export default function Sitemap() {
  const [, setLocation] = useLocation();

  const sections = [
    {
      title: "Core Pages",
      pages: [
        { name: "Home", path: "/" },
        { name: "Demo Selector", path: "/demo-selector" },
        { name: "Playbook Library", path: "/playbook-library" },
        { name: "Dashboard", path: "/dashboard" },
        { name: "Executive Suite", path: "/executive-suite" },
        { name: "ROI Calculator", path: "/calculator" },
      ]
    },
    {
      title: "Live Interactive Demos",
      pages: [
        { name: "4-Phase System Demo", path: "/four-phase-demo" },
        { name: "Ransomware Response", path: "/demo/ransomware" },
        { name: "M&A Integration", path: "/demo/ma-integration" },
        { name: "Product Launch", path: "/demo/product-launch" },
        { name: "Supplier Crisis", path: "/demo/supplier-crisis" },
        { name: "Competitive Response", path: "/demo/competitive-response" },
        { name: "Regulatory Crisis", path: "/demo/regulatory-crisis" },
        { name: "Customer Crisis", path: "/demo/customer-crisis" },
      ]
    },
    {
      title: "Industry Crisis Demos",
      pages: [
        { name: "Industry Demos Hub", path: "/industry-demos" },
        { name: "Luxury Crisis Demo", path: "/luxury-crisis-demo" },
        { name: "Financial Ransomware Demo", path: "/financial-demo" },
        { name: "Pharmaceutical Recall Demo", path: "/pharma-demo" },
        { name: "Manufacturing Supplier Demo", path: "/manufacturing-demo" },
        { name: "Retail Food Safety Demo", path: "/retail-demo" },
        { name: "Energy Grid Failure Demo", path: "/energy-demo" },
      ]
    },
    {
      title: "Strategic Opportunity Demos",
      pages: [
        { name: "LVMH Market Entry", path: "/lvmh-demo" },
        { name: "SHEIN Trend Response", path: "/shein-demo" },
        { name: "SpaceX Launch Coordination", path: "/spacex-demo" },
      ]
    },
    {
      title: "Strategic Operations",
      pages: [
        { name: "Strategic Monitoring", path: "/strategic-monitoring" },
        { name: "Command Center", path: "/command-center" },
        { name: "Collaboration", path: "/collaboration" },
        { name: "Decision Velocity", path: "/decision-velocity" },
        { name: "What-If Analyzer", path: "/what-if-analyzer" },
      ]
    },
    {
      title: "AI Intelligence",
      pages: [
        { name: "AI Intelligence Hub", path: "/ai" },
        { name: "AI Radar Dashboard", path: "/ai-radar" },
        { name: "Pulse Intelligence", path: "/pulse" },
        { name: "Flux Adaptations", path: "/flux" },
        { name: "Prism Insights", path: "/prism" },
        { name: "Echo Cultural Analytics", path: "/echo" },
        { name: "Nova Innovations", path: "/nova" },
      ]
    },
    {
      title: "Planning & Preparedness",
      pages: [
        { name: "Strategic Planning Hub", path: "/strategic" },
        { name: "Triggers Management", path: "/triggers-management" },
        { name: "Preparedness Report", path: "/preparedness-report" },
        { name: "Practice Drills", path: "/practice-drills" },
        { name: "Drill Tracking", path: "/drill-tracking" },
        { name: "Crisis Exposure Matrix", path: "/crisis-exposure-matrix" },
        { name: "Simulation Studio", path: "/simulation-studio" },
        { name: "NFL Learning Dashboard", path: "/nfl-learning" },
      ]
    },
    {
      title: "Analytics & Reporting",
      pages: [
        { name: "Advanced Analytics", path: "/analytics" },
        { name: "Executive Analytics", path: "/executive-analytics-dashboard" },
        { name: "Audit Logging Center", path: "/audit-logging-center" },
        { name: "Business Intelligence", path: "/business-intelligence" },
        { name: "Operating Model Alignment", path: "/operating-model" },
        { name: "Operating Model Health", path: "/operating-model-health" },
        { name: "ROI Breakdown", path: "/roi-breakdown" },
      ]
    },
    {
      title: "Enterprise Features",
      pages: [
        { name: "Integration Hub", path: "/integration-hub" },
        { name: "Integrations", path: "/integrations" },
        { name: "Institutional Memory", path: "/institutional-memory" },
        { name: "Board Briefings", path: "/board-briefings" },
        { name: "Platform", path: "/platform" },
      ]
    },
    {
      title: "Demo Experiences",
      pages: [
        { name: "How It Works", path: "/how-it-works" },
        { name: "Watch Demo", path: "/watch-demo" },
        { name: "Trade Show Demo", path: "/trade-show-demo" },
        { name: "Executive Demo", path: "/executive-demo" },
        { name: "Hybrid Demo", path: "/hybrid-demo" },
        { name: "Executive Walkthrough", path: "/executive-demo-walkthrough" },
      ]
    },
    {
      title: "Company & Resources",
      pages: [
        { name: "Our Story", path: "/our-story" },
        { name: "Pricing", path: "/pricing" },
        { name: "Contact", path: "/contact" },
        { name: "Early Access", path: "/early-access" },
        { name: "Settings", path: "/settings" },
      ]
    }
  ];

  return (
    <div className="page-background min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            M Sitemap
          </h1>
          <p className="text-xl text-slate-400">
            Complete directory of all pages and features available in M
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <Card key={section.title} className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-xl text-blue-400">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {section.pages.map((page) => (
                    <li key={page.path}>
                      <button
                        onClick={() => setLocation(page.path)}
                        className="text-slate-300 hover:text-white hover:underline text-left w-full"
                      >
                        {page.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8 bg-slate-800/50 border-slate-700">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">Quick Stats</h2>
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-4xl font-bold text-blue-400 mb-2">7</div>
                <div className="text-slate-400">Live Interactive Demos</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-400 mb-2">10</div>
                <div className="text-slate-400">Industry Demos</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-400 mb-2">166</div>
                <div className="text-slate-400">Strategic Playbooks</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-orange-400 mb-2">70+</div>
                <div className="text-slate-400">Total Pages</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
