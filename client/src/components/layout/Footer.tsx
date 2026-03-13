import { useLocation } from "wouter";
import { ExecuteIQLogo } from "@/components/ExecuteIQLogo";
import { VaughnMartinLogo } from "@/components/VaughnMartinLogo";

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
        { label: "Playbook Library — 170", path: "/playbooks" },
        { label: "Sample Playbooks", path: "/playbook-library" },
        { label: "Situations Hub", path: "/situations-hub" },
        { label: "Strategic Readiness Report", path: "/preparedness-report" },
        { label: "Board Briefings", path: "/board-briefings" },
      ]
    },
    {
      title: "DETECT",
      links: [
        { label: "Signal Intelligence", path: "/signal-intelligence" },
        { label: "AI Trigger Monitoring", path: "/triggers-management" },
        { label: "Signal Configuration", path: "/signal-configuration" },
        { label: "AI Radar", path: "/ai-radar" },
        { label: "Intelligence Hub", path: "/intelligence-hub" },
      ]
    },
    {
      title: "EXECUTE",
      links: [
        { label: "Command Center", path: "/command-center" },
        { label: "Workspace", path: "/workspace" },
        { label: "Live Activation Center", path: "/live-activation-center" },
        { label: "Practice Drills", path: "/practice-drills" },
        { label: "Execution Coordination", path: "/execution-coordination" },
      ]
    },
    {
      title: "ADVANCE",
      links: [
        { label: "Executive Hub", path: "/executive-hub" },
        { label: "ROI Dashboard", path: "/roi-dashboard" },
        { label: "Decision Velocity", path: "/decision-velocity" },
        { label: "Executive Analytics", path: "/analytics" },
        { label: "Enterprise Metrics", path: "/enterprise-metrics" },
      ]
    },
    {
      title: "Experience",
      links: [
        { label: "Try Demo", path: "/try-demo" },
        { label: "Shadow Simulator", path: "/simulation-studio" },
        { label: "Strategic Recorder", path: "/strategic-recorder" },
        { label: "Readiness Assessment", path: "/readiness-assessment" },
        { label: "ROI Calculator", path: "/roi-calculator" },
      ]
    },
    {
      title: "Company",
      links: [
        { label: "IDEA Framework", path: "/idea-framework" },
        { label: "Why Execution OS", path: "/why-executeiq" },
        { label: "Platform Overview", path: "/platform-overview" },
        { label: "Founder's Story", path: "/founder-story" },
        { label: "Integrations", path: "/integrations" },
        { label: "Request Pilot", path: "/pilot-program" },
        { label: "Investors", path: "/investors" },
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
                height={54}
                variant="full"
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
                      className="text-sm text-slate-300 hover:text-white transition-colors text-left"
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
              <div className="text-xl font-bold text-poise-gold">170</div>
              <div className="text-xs text-slate-300">Strategic Playbooks</div>
            </div>
            <div>
              <div className="text-xl font-bold text-white">9</div>
              <div className="text-xs text-slate-300">Executive Domains</div>
            </div>
            <div>
              <div className="text-xl font-bold text-poise-teal">12 min</div>
              <div className="text-xs text-slate-300">Decision Time</div>
            </div>
            <div>
              <div className="text-xl font-bold text-white">24/7</div>
              <div className="text-xs text-slate-300">AI Monitoring</div>
            </div>
            <div>
              <div className="text-xl font-bold text-white">20</div>
              <div className="text-xs text-slate-300">Signal Categories</div>
            </div>
            <div>
              <div className="text-xl font-bold text-white">248+</div>
              <div className="text-xs text-slate-300">Live Data Points</div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Positioning Tagline */}
      <div className="border-t border-poise-gold/10 bg-gradient-to-r from-poise-navy via-poise-dark-gray/50 to-poise-navy">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <p className="text-2xl font-bold text-poise-gold mb-2" data-testid="footer-idea-tagline">
            We Make Enterprises Fearless.
          </p>
          <p className="text-lg text-slate-300 italic mb-4">
            "Stop improvising. Start executing."
          </p>
          <p className="text-sm text-poise-teal">
            170 playbooks. Pre-staged coordination. Clear decision rights. 12 minutes to execution.
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-poise-gold/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <VaughnMartinLogo height={40} color="light" />
              <p className="text-xs text-gray-500" style={{ paddingLeft: '2px' }}>
                © {new Date().getFullYear()} VaughnMartin — Execution OS
              </p>
            </div>
            <div className="flex items-center gap-6">
              <a 
                href="https://www.vaughnmartin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-poise-teal hover:text-poise-teal/80 transition-colors font-medium"
              >
                www.vaughnmartin.com
              </a>
              <a 
                href="mailto:mbrunke@vaughnmartin.com"
                className="text-sm text-slate-300 hover:text-white transition-colors"
              >
                mbrunke@vaughnmartin.com
              </a>
              <button 
                onClick={() => navigateTo('/try-demo')}
                className="text-sm text-[#2B8A6E] hover:text-[#2B8A6E] transition-colors font-medium"
              >
                See Demo →
              </button>
              <button 
                onClick={() => navigateTo("/investors")}
                className="text-sm text-[#C9A84C] hover:text-[#C9A84C] transition-colors font-medium"
              >
                Investors →
              </button>
              <button 
                onClick={() => navigateTo("/contact")}
                className="text-sm text-slate-300 hover:text-white transition-colors"
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
