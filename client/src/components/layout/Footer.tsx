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
        { label: "Protocol Library — 170", path: "/playbook-library" },
        { label: "Situations Hub", path: "/situations-hub" },
        { label: "Strategic Readiness Report", path: "/preparedness-report" },
        { label: "Board Briefings", path: "/board-briefings" },
      ]
    },
    {
      title: "DETECT",
      links: [
        { label: "Signal Intelligence", path: "/signal-intelligence" },
        { label: "Trigger Monitoring", path: "/triggers-management" },
        { label: "Command Tower", path: "/command-tower" },
      ]
    },
    {
      title: "EXECUTE",
      links: [
        { label: "Mission Control", path: "/mission-control" },
        { label: "Live Activation Center", path: "/live-activation-center" },
        { label: "Concurrent Situation Board", path: "/concurrent-situations" },
        { label: "Practice Drills", path: "/practice-drills" },
      ]
    },
    {
      title: "ADVANCE",
      links: [
        { label: "ROI Dashboard", path: "/roi-dashboard" },
        { label: "Executive Analytics", path: "/analytics" },
        { label: "Institutional Memory", path: "/institutional-memory" },
      ]
    },
    {
      title: "Experience",
      links: [
        { label: "12-Minute Test Drive", path: "/test-drive" },
        { label: "Shadow Simulator", path: "/simulation-studio" },
        { label: "Strategic Recorder", path: "/strategic-recorder" },
        { label: "Readiness Assessment", path: "/readiness-assessment" },
        { label: "ROI Calculator", path: "/roi-calculator" },
      ]
    },
    {
      title: "Company",
      links: [
        { label: "What is Readiness Infrastructure?", path: "/readiness-infrastructure" },
        { label: "IDEA Framework", path: "/idea-framework" },
        { label: "Why Readiness OS", path: "/the-proof" },
        { label: "Why Not Consulting?", path: "/vs-consulting" },
        { label: "About the Founder", path: "/about" },
        { label: "Founder's Story", path: "/founder-story" },
        { label: "Microsoft Ecosystem", path: "/ecosystems" },
        { label: "Request Access", path: "/request-access" },
        { label: "Investors", path: "/investors" },
        { label: "Contact", path: "/contact" },
        { label: "Terms of Service", path: "/terms" },
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
                height={80}
                variant="full"
                color="white"
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium px-3 py-1 bg-poise-gold/20 text-poise-gold border border-poise-gold/30">IDENTIFY</span>
              <span className="text-poise-gold/40">→</span>
              <span className="text-xs font-medium px-3 py-1 bg-poise-teal/20 text-poise-teal border border-poise-teal/30">DETECT</span>
              <span className="text-poise-gold/40">→</span>
              <span className="text-xs font-medium px-3 py-1 bg-poise-teal/20 text-poise-teal border border-poise-teal/30">EXECUTE</span>
              <span className="text-poise-gold/40">→</span>
              <span className="text-xs font-medium px-3 py-1 bg-poise-gold/20 text-poise-gold border border-poise-gold/30">ADVANCE</span>
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
      <div style={{ borderTop: '1px solid rgba(201,168,76,0.1)', background: 'rgba(255,255,255,0.03)' }}>
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 text-center">
            {[
              { value: '180', label: 'Readiness Protocols', color: '#C9A84C' },
              { value: '9', label: 'Executive Domains', color: '#C9A84C' },
              { value: '12 min', label: 'To Live Execution', color: '#2B8A6E' },
              { value: '3,600×', label: 'Execution Head Start', color: '#2B8A6E' },
              { value: '221', label: 'Executive Triggers', color: '#C9A84C' },
              { value: '248+', label: 'Live Data Points', color: '#2B8A6E' },
            ].map(({ value, label, color }) => (
              <div key={label}>
                <div className="text-xl font-bold" style={{ color }}>{value}</div>
                <div className="text-xs" style={{ color: 'rgba(240,237,228,0.45)', marginTop: 2 }}>{label}</div>
              </div>
            ))}
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
            180 Readiness Protocols. Pre-staged coordination. Clear decision rights. 12 minutes to execution.
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-poise-gold/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <VaughnMartinLogo height={72} color="light" />
              <p className="text-xs text-gray-500" style={{ paddingLeft: '2px' }}>
                © {new Date().getFullYear()} VaughnMartin — Readiness OS
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6">
              <a 
                href="https://www.vaughnmartin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-poise-teal hover:text-poise-teal/80 transition-colors font-medium"
              >
                www.vaughnmartin.com
              </a>
              <a 
                href="mailto:info@vaughnmartin.com"
                className="text-sm text-slate-300 hover:text-white transition-colors"
              >
                info@vaughnmartin.com
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
