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
          description: 'Browse all 170 pre-built playbooks across 9 domains'
        },
        {
          id: 'templates',
          label: 'Scenario Templates',
          path: '/identify/templates',
          icon: '📋',
          description: 'Pre-configured templates by industry and threat type'
        },
        {
          id: 'my-playbooks',
          label: 'My Playbooks',
          path: '/identify/my-playbooks',
          icon: '✅',
          description: 'Your customized playbooks ready for activation'
        },
        {
          id: 'wizard',
          label: 'Create Playbook',
          path: '/identify/wizard',
          icon: '➕',
          description: 'Build a new playbook from scratch or template'
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
          description: 'Define execution velocity targets per phase'
        },
        {
          id: 'metrics',
          label: 'Success Metrics',
          path: '/identify/metrics',
          icon: '🎯',
          description: 'Define KPIs and success criteria for playbooks'
        }
      ]
    },
    {
      id: 'detect',
      label: 'DETECT',
      tagline: 'Monitor 24/7',
      icon: '👁️',
      color: 'from-purple-600 to-pink-600',
      items: [
        {
          id: 'dashboard',
          label: 'Monitoring Dashboard',
          path: '/detect/dashboard',
          icon: '📊',
          description: 'Real-time view of all monitored signals'
        },
        {
          id: 'alerts',
          label: 'Alert Configuration',
          path: '/detect/alerts',
          icon: '🔔',
          description: 'Configure triggers and notification thresholds'
        },
        {
          id: 'signals',
          label: 'Signal Intelligence',
          path: '/detect/signals',
          icon: '📡',
          description: 'AI-powered signal monitoring and analysis'
        },
        {
          id: 'threats',
          label: 'Threat Detection',
          path: '/detect/threats',
          icon: '⚠️',
          description: 'Real-time threat identification and warnings'
        },
        {
          id: 'compound-threats',
          label: 'Compound Threat Intelligence',
          path: '/dashboard',
          icon: '🔗',
          description: 'AI-detected cross-domain threat patterns'
        },
        {
          id: 'trends',
          label: 'Trend Analysis',
          path: '/detect/trends',
          icon: '📈',
          description: 'Pattern recognition and predictive insights'
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
          id: 'shadow-simulator',
          label: 'Shadow Simulator',
          path: '/simulation-studio',
          icon: '🧪',
          description: 'Dry-run scenarios before activation — Survive vs. Thrive'
        },
        {
          id: 'activation',
          label: 'Playbook Activation',
          path: '/execute/activation',
          icon: '⚡',
          description: 'Trigger playbooks and initiate response'
        },
        {
          id: 'tasks',
          label: 'Task Distribution',
          path: '/execute/tasks',
          icon: '📤',
          description: 'Auto-assign tasks to teams and systems'
        },
        {
          id: 'tracking',
          label: 'Real-time Tracking',
          path: '/execute/tracking',
          icon: '⏩',
          description: 'Monitor 12-minute response progress'
        },
        {
          id: 'updates',
          label: 'Stakeholder Updates',
          path: '/execute/updates',
          icon: '📧',
          description: 'Automated communication and status updates'
        },
        {
          id: 'decisions',
          label: 'Decision Points',
          path: '/execute/decisions',
          icon: '👍',
          description: 'Go/no-go checkpoints and approvals'
        },
        {
          id: 'concurrent-situations',
          label: 'Concurrent Situation Board',
          path: '/concurrent-situations',
          icon: '🗂️',
          description: 'Command view when multiple crises compete for bandwidth'
        },
        {
          id: 'crisis-communications',
          label: 'Crisis Communications',
          path: '/crisis-communications',
          icon: '📢',
          description: '5 audience messages generated in 18 seconds'
        },
        {
          id: 'financial-exposure',
          label: 'Financial Exposure Estimator',
          path: '/financial-exposure',
          icon: '💵',
          description: 'Instant dollar-range exposure at trigger point'
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
          description: 'AI-powered performance intelligence and continuous improvement'
        },
        {
          id: 'roi-dashboard',
          label: 'Execution ROI Dashboard',
          path: '/roi-dashboard',
          icon: '💰',
          description: 'Board-ready value preserved metrics & response time ROI'
        },
        {
          id: 'metrics',
          label: 'Execution Metrics',
          path: '/advance/metrics',
          icon: '📊',
          description: 'SLA compliance and velocity analytics'
        },
        {
          id: 'outcomes',
          label: 'Outcome Analysis',
          path: '/advance/outcomes',
          icon: '🥧',
          description: 'What did we achieve? Impact assessment'
        },
        {
          id: 'effectiveness',
          label: 'Playbook Effectiveness',
          path: '/advance/effectiveness',
          icon: '✔️',
          description: 'ROI per scenario and playbook performance'
        },
        {
          id: 'team',
          label: 'Team Performance',
          path: '/advance/team',
          icon: '👥',
          description: 'Individual and team execution metrics'
        },
        {
          id: 'lessons',
          label: 'Lessons Learned',
          path: '/advance/lessons',
          icon: '💡',
          description: 'Capture insights and update playbooks'
        },
        {
          id: 'audit',
          label: 'Audit Trail',
          path: '/advance/audit',
          icon: '🔒',
          description: 'Governance, compliance, and full history'
        },
        {
          id: 'workforce-intelligence',
          label: 'Workforce Intelligence',
          path: '/workforce-intelligence',
          icon: '🧠',
          description: 'Cultural health, team dynamics, and organizational resilience'
        },
        {
          id: 'strategic-innovation',
          label: 'Strategic Innovation Pipeline',
          path: '/strategic-innovation',
          icon: '🚀',
          description: 'Innovation pipeline management and AI opportunity scoring'
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
          description: 'What is Execution OS? Interactive overview'
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
