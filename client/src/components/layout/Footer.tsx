import { useLocation } from "wouter";

export default function Footer() {
  const [, setLocation] = useLocation();

  const navigateTo = (path: string) => {
    setLocation(path);
    window.scrollTo(0, 0);
  };

  const footerSections = [
    {
      title: "IDENTIFY",
      links: [
        { label: "Playbook Library (166)", path: "/playbooks" },
        { label: "Scenario Planning Hub", path: "/strategic" },
        { label: "Strategic Readiness Report", path: "/preparedness-report" },
        { label: "What-If Analyzer", path: "/what-if-analyzer" },
        { label: "Board Briefings", path: "/board-briefings" },
      ]
    },
    {
      title: "DETECT",
      links: [
        { label: "Signal Intelligence Hub", path: "/signal-intelligence" },
        { label: "AI Trigger Monitoring", path: "/triggers-management" },
        { label: "AI Radar Dashboard", path: "/ai-radar" },
        { label: "Foresight Radar", path: "/foresight-radar" },
        { label: "Weak Signal Detection", path: "/pulse-intelligence" },
      ]
    },
    {
      title: "EXECUTE",
      links: [
        { label: "Command Center", path: "/command-center" },
        { label: "Crisis Response", path: "/crisis" },
        { label: "Situation Room", path: "/war-room" },
        { label: "Practice Drills", path: "/drill-tracking" },
        { label: "Team Collaboration", path: "/collaboration" },
      ]
    },
    {
      title: "ADVANCE",
      links: [
        { label: "Institutional Memory", path: "/institutional-memory" },
        { label: "Decision Velocity", path: "/decision-velocity" },
        { label: "Executive Analytics", path: "/analytics" },
        { label: "AI Intelligence Hub", path: "/ai" },
        { label: "Executive Dashboard", path: "/executive-dashboard" },
      ]
    },
    {
      title: "Demos",
      links: [
        { label: "Interactive Demo", path: "/demo" },
        { label: "Investor Demo", path: "/investor-demo" },
        { label: "Executive Simulation", path: "/executive-simulation" },
        { label: "Industry Scenarios", path: "/industry-demos" },
        { label: "Product Tour", path: "/product-tour" },
      ]
    },
    {
      title: "Company",
      links: [
        { label: "How It Works", path: "/how-it-works" },
        { label: "Our Story", path: "/our-story" },
        { label: "Why M", path: "/why-m" },
        { label: "Integrations", path: "/integrations" },
        { label: "Pricing", path: "/pricing" },
        { label: "Contact", path: "/contact" },
      ]
    },
  ];

  return (
    <footer className="bg-slate-950 border-t border-slate-800">
      {/* 4-Phase Methodology Header */}
      <div className="border-b border-slate-800 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-white font-semibold">M Strategic Execution Operating System</h3>
              <p className="text-sm text-slate-400">Explore the complete platform capabilities below</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-violet-500/20 text-violet-400">IDENTIFY</span>
              <span className="text-slate-600">→</span>
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-blue-500/20 text-blue-400">DETECT</span>
              <span className="text-slate-600">→</span>
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400">EXECUTE</span>
              <span className="text-slate-600">→</span>
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-amber-500/20 text-amber-400">ADVANCE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Grid - 6 Columns */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-white mb-4 text-sm">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.path}>
                    <button
                      onClick={() => navigateTo(link.path)}
                      className="text-sm text-slate-400 hover:text-white transition-colors text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Key Stats Bar */}
      <div className="border-t border-slate-800 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 text-center">
            <div>
              <div className="text-xl font-bold text-white">166</div>
              <div className="text-xs text-slate-500">Strategic Playbooks</div>
            </div>
            <div>
              <div className="text-xl font-bold text-white">9</div>
              <div className="text-xs text-slate-500">Executive Domains</div>
            </div>
            <div>
              <div className="text-xl font-bold text-emerald-400">15 min</div>
              <div className="text-xs text-slate-500">Decision Time</div>
            </div>
            <div>
              <div className="text-xl font-bold text-white">24/7</div>
              <div className="text-xs text-slate-500">AI Monitoring</div>
            </div>
            <div>
              <div className="text-xl font-bold text-white">16</div>
              <div className="text-xs text-slate-500">Signal Categories</div>
            </div>
            <div>
              <div className="text-xl font-bold text-white">92</div>
              <div className="text-xs text-slate-500">Data Points</div>
            </div>
          </div>
        </div>
      </div>

      {/* That's the IDEA Tagline */}
      <div className="border-t border-slate-800 bg-gradient-to-r from-slate-900 via-blue-950/30 to-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <p className="text-2xl font-bold text-white mb-2" data-testid="footer-idea-tagline">
            That's the IDEA.
          </p>
          <p className="text-lg text-slate-400 italic mb-4">
            "Comfortable and confident that we are prepared to execute. No matter the situation."
          </p>
          <p className="text-sm text-slate-500">
            Success Favors the Prepared
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <div>
                <p className="text-sm text-slate-400">
                  © {new Date().getFullYear()} M Strategic Execution Operating System
                </p>
                <p className="text-xs text-slate-600">The preparation mindset of elite teams, systematized for enterprise execution.</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <button 
                onClick={() => navigateTo("/demo")}
                className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
              >
                See Demo →
              </button>
              <button 
                onClick={() => navigateTo("/investor-demo")}
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors font-medium"
              >
                Investors →
              </button>
              <button 
                onClick={() => navigateTo("/contact")}
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                Contact
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
