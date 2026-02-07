import { useLocation } from "wouter";
import { ExecuteIQLogo } from "@/components/ExecuteIQLogo";

export default function Footer() {
  const [, setLocation] = useLocation();

  const navigateTo = (path: string) => {
    setLocation(path);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const footerSections = [
    {
      title: "IDENTIFY",
      links: [
        { label: "Playbook Library (166)", path: "/playbook-library" },
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
      title: "Experience",
      links: [
        { label: "Try Demo", path: "/try-demo" },
        { label: "Start Pilot", path: "/pilot-demo" },
        { label: "Product Tour", path: "/product-tour" },
        { label: "ROI Calculator", path: "/roi-calculator" },
      ]
    },
    {
      title: "Company",
      links: [
        { label: "How It Works", path: "/how-it-works" },
        { label: "Our Story", path: "/our-story" },
        { label: "Why ExecuteIQ", path: "/why-executeiq" },
        { label: "Integrations", path: "/integrations" },
        { label: "Pricing", path: "/pricing" },
        { label: "Contact", path: "/contact" },
      ]
    },
  ];

  return (
    <footer className="bg-poise-navy border-t border-poise-gold/20">
      {/* 4-Phase Methodology Header */}
      <div className="border-b border-poise-gold/10 bg-poise-dark-gray/50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <ExecuteIQLogo 
                width={220} 
                height={66}
                variant="full"
                showTagline={true}
                color="white"
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-poise-gold/20 text-poise-gold border border-poise-gold/30">IDENTIFY</span>
              <span className="text-poise-gold/40">→</span>
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-poise-teal/20 text-poise-teal border border-poise-teal/30">DETECT</span>
              <span className="text-poise-gold/40">→</span>
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-poise-teal/20 text-poise-teal border border-poise-teal/30">EXECUTE</span>
              <span className="text-poise-gold/40">→</span>
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-poise-gold/20 text-poise-gold border border-poise-gold/30">ADVANCE</span>
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
      <div className="border-t border-poise-gold/10 bg-poise-dark-gray/30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 text-center">
            <div>
              <div className="text-xl font-bold text-poise-gold">166</div>
              <div className="text-xs text-slate-400">Strategic Playbooks</div>
            </div>
            <div>
              <div className="text-xl font-bold text-white">9</div>
              <div className="text-xs text-slate-400">Executive Domains</div>
            </div>
            <div>
              <div className="text-xl font-bold text-poise-teal">12 min</div>
              <div className="text-xs text-slate-400">Decision Time</div>
            </div>
            <div>
              <div className="text-xl font-bold text-white">24/7</div>
              <div className="text-xs text-slate-400">AI Monitoring</div>
            </div>
            <div>
              <div className="text-xl font-bold text-white">16</div>
              <div className="text-xs text-slate-400">Signal Categories</div>
            </div>
            <div>
              <div className="text-xl font-bold text-white">92</div>
              <div className="text-xs text-slate-400">Data Points</div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Positioning Tagline */}
      <div className="border-t border-poise-gold/10 bg-gradient-to-r from-poise-navy via-poise-dark-gray/50 to-poise-navy">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <p className="text-2xl font-bold text-poise-gold mb-2" data-testid="footer-idea-tagline">
            ExecuteIQ — The Execution Infrastructure That Makes AI Work
          </p>
          <p className="text-lg text-slate-300 italic mb-4">
            "166 playbooks to start. Customize them. Build your own. Pre-defined governance, clear decision rights, 12 minutes to execution."
          </p>
          <p className="text-sm text-poise-teal">
            The Playbooks Are the Accelerant. The Platform Is the Product.
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-poise-gold/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1A2B3D] rounded-lg flex items-center justify-center border border-[#00A8A8]/30">
                <span className="text-[#D4AF37] font-bold text-lg tracking-tight">P</span>
              </div>
              <div>
                <p className="text-sm text-slate-400">
                  © {new Date().getFullYear()} ExecuteIQ - The Execution Infrastructure Enterprises Are Missing
                </p>
                <p className="text-xs text-slate-600">Governance. Decision Rights. Coordination. In 12 Minutes.</p>
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
