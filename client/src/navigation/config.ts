import { NavigationConfig, NavigationPhase } from './types';

export const navigationConfig: NavigationConfig = {
  phases: [
    {
      id: 'identify',
      label: 'IDENTIFY',
      tagline: 'Prepare & Define',
      icon: '🎯',
      color: 'from-blue-600 to-cyan-600',
      items: [
        {
          id: 'playbooks-library',
          label: 'Strategic Playbooks Library',
          path: '/identify/playbooks',
          icon: '📚',
          description: '180 protocols pre-staged — every situation mapped, budgeted, stakeholders pre-assigned. Zero mobilization cost when the trigger fires.'
        },
        {
          id: 'my-playbooks',
          label: 'My Playbooks',
          path: '/identify/my-playbooks',
          icon: '✅',
          description: 'Your protocols configured and pre-authorized — execution begins in 12 minutes, not 30 days.'
        },
        {
          id: 'situation-intents',
          label: 'Situation Intents',
          path: '/identify/situation-intents',
          icon: '🗂️',
          description: 'The Install — define what you\'re protecting, who authorizes it, and how it executes. The architecture that makes 12-minute response possible.'
        },
        {
          id: 'wizard',
          label: 'Create Playbook',
          path: '/identify/wizard',
          icon: '➕',
          description: 'Build a new Readiness Protocol — every situation you pre-stage is one less crisis that costs 30 days of mobilization overhead.'
        },
        {
          id: 'situation-matrix-builder',
          label: 'Situation Matrix Builder',
          path: '/situation-matrix-builder',
          icon: '⬛',
          description: 'Build a Role × Situation call sheet — every role, every scenario variant, every responsibility pre-staged before the trigger fires'
        },
        {
          id: 'build-protocol',
          label: 'Build a Protocol',
          path: '/build-protocol',
          icon: '🔀',
          description: 'Not sure which builder? One question routes you to the right path — Matrix Builder, Protocol Builder, or Compound'
        },
        {
          id: 'preparation-arc',
          label: '30-Day Preparation Arc',
          path: '/preparation-arc',
          icon: '📅',
          description: 'Week-by-week preparation journey from installation to go-live — the 30 days that make 12-minute execution possible'
        },
        {
          id: 'templates',
          label: 'Scenario Templates',
          path: '/identify/templates',
          icon: '📋',
          description: 'Pre-configured templates by industry and threat type — go from zero to a staged protocol in minutes, not months.'
        },
        {
          id: 'strategic-recorder',
          label: 'Strategic Recorder',
          path: '/strategic-recorder',
          icon: '🎙️',
          description: 'Paste crisis notes — AI builds custom playbooks instantly'
        },
        {
          id: 'sla',
          label: 'SLA & Timeframes',
          path: '/identify/sla',
          icon: '⏱️',
          description: 'Set execution velocity targets per phase — the parameters that keep every response inside the 12-minute window.'
        },
        {
          id: 'metrics',
          label: 'Success Metrics',
          path: '/identify/metrics',
          icon: '📊',
          description: 'Define success criteria — the metrics that prove execution value to the board before the next trigger fires.'
        },
        {
          id: 'readiness-maturity-model',
          label: 'Readiness Maturity Model',
          path: '/readiness-maturity-model',
          icon: '📊',
          description: 'Assess where your organization stands on the path from Reactive to Autonomous — and what it will take to level up.'
        },
        {
          id: 'readiness-audit',
          label: 'Readiness Audit',
          path: '/playbook-readiness',
          icon: '🔍',
          description: 'Evaluate coverage gaps across 180 protocols — every gap identified now is a mobilization cost avoided when the next trigger fires.'
        }
      ]
    },
    {
      id: 'detect',
      label: 'DETECT',
      tagline: 'Monitor 24/7',
      icon: '👁️',
      color: 'from-teal-700 to-emerald-600',
      items: [
        {
          id: 'dashboard',
          label: 'Monitoring Dashboard',
          path: '/detect/dashboard',
          icon: '📊',
          description: 'Live view of every monitored signal — threats and opportunities surfaced before the 30-day mobilization gap opens and costs compound.'
        },
        {
          id: 'triggers-management',
          label: 'AI Trigger Monitoring',
          path: '/triggers-management',
          icon: '⚡',
          description: '231 detection thresholds configured — every situation you\'ve prepared for costs 12 minutes. Every unprepared one costs 30 days.'
        },
        {
          id: 'alerts',
          label: 'Alert Configuration',
          path: '/detect/alerts',
          icon: '🔔',
          description: 'Configure trigger thresholds — the settings that determine whether a situation costs you 12 minutes or 30 days.'
        },
        {
          id: 'signals',
          label: 'Signal Intelligence',
          path: '/detect/signals',
          icon: '📡',
          description: 'Continuous signal analysis — every pattern matched to a pre-staged protocol before it becomes a crisis with a price tag.'
        },
        {
          id: 'threats',
          label: 'Threat Detection',
          path: '/detect/threats',
          icon: '⚠️',
          description: 'Real-time threat identification — every warning surfaced early enough to respond with a pre-staged protocol, not a reactive 30-day scramble.'
        },
        {
          id: 'compound-threats',
          label: 'Compound Threat Intelligence',
          path: '/dashboard',
          icon: '🔗',
          description: 'Cross-domain threat patterns — compound situations identified before they compound your financial exposure.'
        },
        {
          id: 'trends',
          label: 'Trend Analysis',
          path: '/detect/trends',
          icon: '📈',
          description: 'Predictive pattern recognition — respond to what is emerging, not what already happened and already cost you.'
        },
        {
          id: 'history',
          label: 'Alert History',
          path: '/detect/history',
          icon: '📜',
          description: 'Historical detection log and audit trail'
        },
        {
          id: 'live-detection',
          label: 'Live Detection Feed',
          path: '/live-detection',
          icon: '🔴',
          description: 'Real signals crossing trigger thresholds — Slack + email auto-fired'
        },
        {
          id: 'predictive-intelligence',
          label: 'Predictive Signal Intelligence',
          path: '/predictive-intelligence',
          icon: '🎯',
          description: 'Pattern-matched clusters — pre-stage protocols before the trigger fires'
        },
        {
          id: 'foresight-radar',
          label: 'Foresight Radar',
          path: '/foresight-radar',
          icon: '📡',
          description: 'Forward-looking signal patterns — emerging risks before they cross trigger thresholds'
        },
        {
          id: 'future-readiness',
          label: 'Future Readiness',
          path: '/future-readiness',
          icon: '🔭',
          description: 'Long-horizon readiness projection — coverage gaps mapped to your strategic calendar'
        },
        {
          id: 'intelligence-control',
          label: 'Intelligence Control',
          path: '/intelligence',
          icon: '🧠',
          description: 'Signal management, pattern classification, and detection configuration'
        },
        {
          id: 'prism-insights',
          label: 'Prism Insights',
          path: '/prism-insights',
          icon: '◈',
          description: 'Pattern recognition scoring and insight mapping across all monitored domains'
        }
      ]
    },
    {
      id: 'execute',
      label: 'EXECUTE',
      tagline: 'Coordinated Response',
      icon: '⚡',
      color: 'from-orange-600 to-red-600',
      items: [
        {
          id: 'command-tower',
          label: 'Command Tower',
          path: '/command-tower',
          icon: '🗼',
          description: 'Executive display — live trigger detections, playbooks in flight, system status'
        },
        {
          id: 'war-room',
          label: 'Mission Control',
          path: '/mission-control',
          icon: '🛡️',
          description: 'Authenticated NOC home — live alerts, domain status board, execution log'
        },
        {
          id: 'executive-scenarios',
          label: 'Executive Scenario Suite',
          path: '/executive-scenarios',
          icon: '🎯',
          description: 'Industry + role walk-throughs — see exactly what 12-minute execution looks like in your sector and your boardroom. Then calculate what 30 days would have cost.'
        },
        {
          id: 'platform-capabilities',
          label: 'Platform Capabilities',
          path: '/capabilities',
          icon: '🗂️',
          description: 'Every capability across the full decision lifecycle — the complete operating model that replaces 30-day alignment cycles with 12-minute execution.'
        },
        {
          id: 'shadow-simulator',
          label: 'Shadow Simulator',
          path: '/simulation-studio',
          icon: '🧪',
          description: 'Dry-run your top scenarios before a trigger fires — the preparation that separates Survive from Thrive when costs are real.'
        },
        {
          id: 'execution-clock',
          label: 'Execution Clock',
          path: '/mission-control#execution-clock',
          icon: '⏱️',
          description: 'Live 12-minute execution clock — milestone tracker per situation'
        },
        {
          id: 'activation',
          label: 'Playbook Activation',
          path: '/execute/activation',
          icon: '⚡',
          description: 'Authorize execution and initiate response — 12 minutes from trigger to full organizational coordination.'
        },
        {
          id: 'tasks',
          label: 'Task Distribution',
          path: '/execute/tasks',
          icon: '📤',
          description: 'Auto-assign tasks to pre-designated owners — zero coordination overhead, full execution velocity from the first minute.'
        },
        {
          id: 'tracking',
          label: 'Real-time Tracking',
          path: '/execute/tracking',
          icon: '⏩',
          description: 'Monitor 12-minute response progress — every milestone tracked against the benchmark your unprepared competitors cannot match.'
        },
        {
          id: 'updates',
          label: 'Stakeholder Updates',
          path: '/execute/updates',
          icon: '📧',
          description: 'Automated stakeholder communications — reputational and regulatory exposure managed at execution speed, not committee speed.'
        },
        {
          id: 'decisions',
          label: 'Decision Points',
          path: '/execute/decisions',
          icon: '👍',
          description: 'Executive go/no-go authorization — human decision preserved, 30-day mobilization cost eliminated.'
        },
        {
          id: 'concurrent-situations',
          label: 'Concurrent Situation Board',
          path: '/concurrent-situations',
          icon: '🗂️',
          description: 'Command view when multiple triggers compete for executive bandwidth — compound situations managed without compound delays or compounding costs.'
        },
        {
          id: 'crisis-communications',
          label: 'Crisis Communications',
          path: '/crisis-communications',
          icon: '📢',
          description: '5 audience communications in 18 seconds — reputational costs contained before stakeholder escalation compounds the damage.'
        },
        {
          id: 'financial-exposure',
          label: 'Financial Exposure Estimator',
          path: '/financial-exposure',
          icon: '💵',
          description: 'Instant dollar-range exposure at trigger point'
        },
        {
          id: 'live-activation-center',
          label: 'Live Activation Center',
          path: '/live-activation-center',
          icon: '🚨',
          description: 'Real-time playbook activation management — tasks, owners, and 12-minute execution clock'
        }
      ]
    },
    {
      id: 'advance',
      label: 'ADVANCE',
      tagline: 'Measure & Improve',
      icon: '📈',
      color: 'from-green-600 to-emerald-600',
      items: [
        {
          id: 'learning-center',
          label: 'Strategic Learning Center',
          path: '/execution-learning',
          icon: '🧠',
          description: 'Performance intelligence that compounds — every activation improves the next one, widening your execution advantage over every competitor who is still mobilizing.'
        },
        {
          id: 'roi-dashboard',
          label: 'Readiness ROI Dashboard',
          path: '/roi-dashboard',
          icon: '💰',
          description: 'Board-ready value metrics — the financial proof that preparation cost less than the mobilization overhead it replaced.'
        },
        {
          id: 'board-readiness',
          label: 'Board Readiness Snapshot',
          path: '/board-readiness',
          icon: '📋',
          description: 'Print-ready board report — domain coverage, response velocity, and the financial value of 12-minute execution vs. what 30 days would have cost.'
        },
        {
          id: 'metrics',
          label: 'Execution Metrics',
          path: '/advance/metrics',
          icon: '📊',
          description: 'Execution velocity analytics — the SLA data that proves your 12-minute benchmark is being held across every activation.'
        },
        {
          id: 'outcomes',
          label: 'Outcome Analysis',
          path: '/advance/outcomes',
          icon: '🥧',
          description: 'Impact assessment — the financial and operational value recovered in every activation, measured against what unpreparedness would have cost.'
        },
        {
          id: 'effectiveness',
          label: 'Playbook Effectiveness',
          path: '/advance/effectiveness',
          icon: '✔️',
          description: 'ROI per Readiness Protocol — which protocols delivered the greatest financial return in live execution.'
        },
        {
          id: 'team',
          label: 'Team Performance',
          path: '/advance/team',
          icon: '👥',
          description: 'Team execution metrics — who accelerates your 12-minute window and who expands it. The data that closes the gap.'
        },
        {
          id: 'lessons',
          label: 'Lessons Learned',
          path: '/advance/lessons',
          icon: '💡',
          description: 'Capture execution insights and update protocols — the closed loop that makes every activation better and every future trigger less costly.'
        },
        {
          id: 'audit',
          label: 'Audit Trail',
          path: '/advance/audit',
          icon: '🔒',
          description: 'Full governance and audit trail — regulatory compliance proven and executive authorization preserved at every decision point.'
        },
        {
          id: 'workforce-intelligence',
          label: 'Workforce Intelligence',
          path: '/workforce-intelligence',
          icon: '🧠',
          description: 'Organizational resilience metrics — the cultural and team health data that determines whether your 12-minute window holds under real pressure.'
        },
        {
          id: 'tendency-intelligence',
          label: 'Organizational Tendency Intelligence',
          path: '/tendency-intelligence',
          icon: '📐',
          description: 'Your organization benchmarked against itself — the bottlenecks, patterns, and stakeholder dynamics that expand your response time and what to do about them.'
        },
        {
          id: 'sector-intelligence',
          label: 'Sector Intelligence Library',
          path: '/sector-intelligence',
          icon: '🏛️',
          description: 'How organizations in your sector have responded — anonymized, aggregated, actionable'
        },
        {
          id: 'strategic-innovation',
          label: 'Strategic Innovation Pipeline',
          path: '/strategic-innovation',
          icon: '🚀',
          description: 'Innovation pipeline management and opportunity scoring'
        },
        {
          id: 'enterprise-metrics',
          label: 'Enterprise Metrics',
          path: '/enterprise-metrics',
          icon: '📐',
          description: 'Enterprise-wide readiness KPIs and performance benchmarks across all domains'
        }
      ]
    },
    {
      id: 'setup',
      label: 'SETUP',
      tagline: 'Configuration',
      icon: '⚙️',
      color: 'from-slate-600 to-gray-600',
      items: [
        {
          id: 'team',
          label: 'Team Management',
          path: '/setup/team',
          icon: '👥',
          description: 'Manage roles, permissions, and team members'
        },
        {
          id: 'integrations',
          label: 'Integrations',
          path: '/setup/integrations',
          icon: '🔗',
          description: 'Connect Jira, Slack, Active Directory, and more'
        },
        {
          id: 'organization',
          label: 'Organization Settings',
          path: '/setup/organization',
          icon: '⚙️',
          description: 'Company-wide configuration and preferences'
        },
        {
          id: 'api',
          label: 'API & Automation',
          path: '/setup/api',
          icon: '💻',
          description: 'Developer tools and API documentation'
        }
      ]
    },
    {
      id: 'learn',
      label: 'LEARN',
      tagline: 'Get Started',
      icon: '❓',
      color: 'from-indigo-600 to-violet-600',
      items: [
        {
          id: 'quick-demo',
          label: 'Quick Demo (5 min)',
          path: '/learn/quick-demo',
          icon: '▶️',
          description: 'What is Readiness OS? Interactive overview'
        },
        {
          id: 'role-demo',
          label: 'Your Role Demo',
          path: '/learn/role-demo',
          icon: '👤',
          description: 'Personalized demo for CEO/COO/CHRO/CTO'
        },
        {
          id: 'drills',
          label: 'Practice Drills',
          path: '/learn/drills',
          icon: '🔄',
          description: 'Test playbooks without triggering real responses'
        },
        {
          id: 'help',
          label: 'Help & Support',
          path: '/learn/help',
          icon: '❓',
          description: 'Documentation, tutorials, and support'
        }
      ]
    }
  ]
};

export default navigationConfig;
