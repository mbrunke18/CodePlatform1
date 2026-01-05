import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  targetElement?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  phase?: 'IDENTIFY' | 'DETECT' | 'EXECUTE' | 'ADVANCE';
}

interface PageOnboarding {
  pageId: string;
  pageName: string;
  steps: OnboardingStep[];
}

interface OnboardingState {
  hasSeenOnboarding: Record<string, boolean>;
  currentPage: string | null;
  currentStep: number;
  isActive: boolean;
}

interface OnboardingContextType {
  state: OnboardingState;
  startOnboarding: (pageId: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  skipOnboarding: () => void;
  dismissOnboarding: () => void;
  resetOnboarding: (pageId?: string) => void;
  getCurrentPageSteps: () => OnboardingStep[];
  getCurrentStep: () => OnboardingStep | null;
  isPageOnboarded: (pageId: string) => boolean;
}

const OnboardingContext = createContext<OnboardingContextType | null>(null);

const ONBOARDING_STORAGE_KEY = 'm-onboarding-state';

export const pageOnboardingConfigs: Record<string, PageOnboarding> = {
  'command-center': {
    pageId: 'command-center',
    pageName: 'Command Center',
    steps: [
      {
        id: 'cc-welcome',
        title: 'Welcome to Command Center',
        description: 'This is your real-time strategic execution hub. Monitor active scenarios, coordinate teams, and track execution progress across your organization.',
        phase: 'EXECUTE'
      },
      {
        id: 'cc-active-scenarios',
        title: 'Active Scenarios',
        description: 'View all currently active strategic scenarios. Each card shows team coordination status, progress percentage, and allows drill-down to details.',
        targetElement: 'button-launch-scenario',
        position: 'bottom',
        phase: 'EXECUTE'
      },
      {
        id: 'cc-readiness-index',
        title: 'Future Readiness Index™',
        description: 'Your organization\'s preparedness score across 5 dimensions: Foresight, Velocity, Agility, Learning, and Adaptability. Target: 84.4%',
        phase: 'IDENTIFY'
      },
      {
        id: 'cc-weak-signals',
        title: 'Weak Signals Detection',
        description: 'AI continuously monitors 12 intelligence sources for early warning indicators. Higher confidence signals may trigger playbook recommendations.',
        phase: 'DETECT'
      },
      {
        id: 'cc-oracle',
        title: 'Oracle Intelligence',
        description: 'Pattern recognition across market, competitive, and operational data. These patterns inform proactive strategy adjustments.',
        phase: 'DETECT'
      }
    ]
  },
  'executive-scorecard': {
    pageId: 'executive-scorecard',
    pageName: 'Executive Scorecard',
    steps: [
      {
        id: 'es-welcome',
        title: 'Your Executive Scorecard',
        description: 'Track your strategic execution performance with key metrics. This dashboard shows your ROI, time savings, and execution velocity.',
        phase: 'ADVANCE'
      },
      {
        id: 'es-roi',
        title: 'ROI & Value Metrics',
        description: '$5.8M annual value comes from faster decisions (48x ROI), reduced coordination time (720 hours saved), and 12-minute execution vs 72-hour industry standard.',
        targetElement: 'card-roi-banner',
        position: 'bottom',
        phase: 'ADVANCE'
      },
      {
        id: 'es-velocity',
        title: 'Execution Velocity',
        description: 'M compresses 72-hour coordination into 12-minute execution. Track your performance against this benchmark.',
        phase: 'EXECUTE'
      }
    ]
  },
  'what-if-analyzer': {
    pageId: 'what-if-analyzer',
    pageName: 'What-If Analyzer',
    steps: [
      {
        id: 'wia-welcome',
        title: 'What-If Analyzer',
        description: 'Model any business scenario beyond the 166 playbook templates. Test market conditions, assess impact, and get AI-powered recommendations.',
        phase: 'IDENTIFY'
      },
      {
        id: 'wia-quick-start',
        title: 'Quick Start Templates',
        description: 'Start with one of 6 popular scenario templates: Product Recall, Supply Chain, Market Entry, Cyber Incident, M&A Integration, or Regulatory Change.',
        targetElement: 'quick-start-templates',
        position: 'bottom',
        phase: 'IDENTIFY'
      },
      {
        id: 'wia-custom',
        title: 'Custom Scenarios',
        description: 'Build unlimited custom scenarios. Define conditions, assess impact, allocate resources, and receive AI playbook recommendations.',
        phase: 'IDENTIFY'
      }
    ]
  },
  'scenario-gallery': {
    pageId: 'scenario-gallery',
    pageName: 'Scenario Gallery',
    steps: [
      {
        id: 'sg-welcome',
        title: '166 Strategic Playbooks',
        description: 'Browse 166 battle-tested playbooks across 9 strategic domains. Each playbook includes pre-mapped stakeholders, decision trees, and communication templates.',
        phase: 'IDENTIFY'
      },
      {
        id: 'sg-domains',
        title: '9 Strategic Domains',
        description: 'Playbooks are organized into domains: Market Response, Operational Resilience, People & Culture, Technology & Innovation, Regulatory Compliance, Crisis Management, Growth & Expansion, Strategic Partnerships, and AI Governance.',
        phase: 'IDENTIFY'
      },
      {
        id: 'sg-unlimited',
        title: 'Unlimited Custom Scenarios',
        description: 'Use the What-If Analyzer to create unlimited custom scenarios beyond the 166 templates. Every scenario becomes a living playbook that improves over time.',
        phase: 'IDENTIFY'
      }
    ]
  },
  'playbook-readiness': {
    pageId: 'playbook-readiness',
    pageName: 'Playbook Readiness Audit',
    steps: [
      {
        id: 'pr-welcome',
        title: 'Playbook Readiness Audit',
        description: 'Assess the preparedness of your 166 playbooks across 4 key dimensions: Trigger Coverage, Stakeholder Readiness, Practice Frequency, and Outcome Confidence.',
        phase: 'IDENTIFY'
      },
      {
        id: 'pr-quadrant',
        title: 'Readiness Quadrant',
        description: 'Playbooks are categorized into 4 tiers: Combat Ready (80%+), Practice Needed (60-79%), Setup Required (40-59%), and Not Configured (<40%).',
        phase: 'IDENTIFY'
      },
      {
        id: 'pr-actions',
        title: 'Improvement Actions',
        description: 'Each playbook includes specific actions to improve readiness: schedule drills, update stakeholders, configure triggers, or review decision trees.',
        phase: 'ADVANCE'
      }
    ]
  },
  'triggers-management': {
    pageId: 'triggers-management',
    pageName: 'Executive Trigger Dashboard',
    steps: [
      {
        id: 'tm-welcome',
        title: 'Executive Trigger Dashboard',
        description: 'This is where YOU define what matters. Set up trigger conditions that AI monitors 24/7, automatically activating playbooks when your thresholds are breached.',
        phase: 'DETECT'
      },
      {
        id: 'tm-categories',
        title: '16 Intelligence Categories',
        description: 'Monitor 92+ data points across categories: Competitive, Market, Financial, Regulatory, Supply Chain, Customer, Talent, Technology, Cyber, and more.',
        phase: 'DETECT'
      },
      {
        id: 'tm-conditions',
        title: 'Trigger Conditions',
        description: 'Each trigger shows its field, operator, threshold value, and logic. When conditions are met, the system automatically recommends or activates the right playbook.',
        phase: 'EXECUTE'
      },
      {
        id: 'tm-notifications',
        title: 'Notification Settings',
        description: 'Configure how you want to be alerted: Email, In-App, Slack, or full Escalation workflows with approval chains.',
        phase: 'EXECUTE'
      }
    ]
  },
  'ai-radar': {
    pageId: 'ai-radar',
    pageName: 'AI Radar',
    steps: [
      {
        id: 'ar-welcome',
        title: 'AI Radar - Live Intelligence',
        description: 'Your real-time strategic intelligence hub. AI continuously scans 12 signal sources to detect weak signals, emerging patterns, and potential threats before they materialize.',
        phase: 'DETECT'
      },
      {
        id: 'ar-signals',
        title: 'Signal Detection',
        description: 'Watch for weak signals across market, competitive, regulatory, and operational domains. Higher confidence signals may trigger automatic playbook recommendations.',
        phase: 'DETECT'
      },
      {
        id: 'ar-patterns',
        title: 'Pattern Recognition',
        description: 'The Oracle engine identifies patterns across multiple data sources, helping you spot opportunities and threats that would otherwise go unnoticed.',
        phase: 'DETECT'
      }
    ]
  },
  'pulse-intelligence': {
    pageId: 'pulse-intelligence',
    pageName: 'Pulse Intelligence',
    steps: [
      {
        id: 'pi-welcome',
        title: 'Pulse Intelligence',
        description: 'Real-time market pulse monitoring. Track sentiment, news flow, social signals, and market movements that could impact your strategic position.',
        phase: 'DETECT'
      },
      {
        id: 'pi-feeds',
        title: 'Live Data Feeds',
        description: 'Aggregated intelligence from news sources, social media, analyst reports, and market data providers - all analyzed in real-time.',
        phase: 'DETECT'
      }
    ]
  },
  'flux-adaptations': {
    pageId: 'flux-adaptations',
    pageName: 'Flux Adaptations',
    steps: [
      {
        id: 'fa-welcome',
        title: 'Flux Adaptations',
        description: 'Track how your organization adapts to changing conditions. Monitor change velocity, adaptation patterns, and organizational agility metrics.',
        phase: 'ADVANCE'
      },
      {
        id: 'fa-velocity',
        title: 'Adaptation Velocity',
        description: 'Measure how quickly your teams respond to strategic shifts. Identify bottlenecks and accelerate your change capability.',
        phase: 'ADVANCE'
      }
    ]
  },
  'prism-insights': {
    pageId: 'prism-insights',
    pageName: 'Prism Insights',
    steps: [
      {
        id: 'pri-welcome',
        title: 'Prism Insights',
        description: 'Multi-dimensional analysis of your strategic landscape. View opportunities and threats through different lenses - financial, operational, competitive, and stakeholder perspectives.',
        phase: 'DETECT'
      },
      {
        id: 'pri-lenses',
        title: 'Strategic Lenses',
        description: 'Each lens reveals different aspects of the same situation, helping you make more balanced decisions with full context.',
        phase: 'IDENTIFY'
      }
    ]
  },
  'echo-cultural': {
    pageId: 'echo-cultural',
    pageName: 'Echo Cultural Analytics',
    steps: [
      {
        id: 'ec-welcome',
        title: 'Echo Cultural Analytics',
        description: 'Monitor organizational culture and sentiment. Track employee engagement, cultural alignment, and the human side of strategic execution.',
        phase: 'ADVANCE'
      },
      {
        id: 'ec-sentiment',
        title: 'Sentiment Analysis',
        description: 'AI analyzes communication patterns, feedback, and engagement signals to surface cultural health indicators.',
        phase: 'DETECT'
      }
    ]
  },
  'nova-innovations': {
    pageId: 'nova-innovations',
    pageName: 'Nova Innovations',
    steps: [
      {
        id: 'ni-welcome',
        title: 'Nova Innovations',
        description: 'Track your innovation pipeline and emerging opportunities. Monitor R&D progress, competitive innovations, and market disruption signals.',
        phase: 'DETECT'
      },
      {
        id: 'ni-pipeline',
        title: 'Innovation Pipeline',
        description: 'Visualize initiatives from ideation through execution. Identify stalled projects and accelerate high-potential innovations.',
        phase: 'IDENTIFY'
      }
    ]
  }
};

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OnboardingState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(ONBOARDING_STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return {
            ...parsed,
            currentPage: null,
            currentStep: 0,
            isActive: false
          };
        } catch {
          // Invalid saved state
        }
      }
    }
    return {
      hasSeenOnboarding: {},
      currentPage: null,
      currentStep: 0,
      isActive: false
    };
  });

  useEffect(() => {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify({
      hasSeenOnboarding: state.hasSeenOnboarding
    }));
  }, [state.hasSeenOnboarding]);

  const startOnboarding = useCallback((pageId: string) => {
    if (pageOnboardingConfigs[pageId]) {
      setState(prev => ({
        ...prev,
        currentPage: pageId,
        currentStep: 0,
        isActive: true
      }));
    }
  }, []);

  const nextStep = useCallback(() => {
    setState(prev => {
      if (!prev.currentPage) return prev;
      const config = pageOnboardingConfigs[prev.currentPage];
      if (!config) return prev;

      if (prev.currentStep >= config.steps.length - 1) {
        return {
          ...prev,
          hasSeenOnboarding: { ...prev.hasSeenOnboarding, [prev.currentPage]: true },
          currentPage: null,
          currentStep: 0,
          isActive: false
        };
      }

      return {
        ...prev,
        currentStep: prev.currentStep + 1
      };
    });
  }, []);

  const prevStep = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: Math.max(0, prev.currentStep - 1)
    }));
  }, []);

  const skipOnboarding = useCallback(() => {
    setState(prev => {
      if (!prev.currentPage) return prev;
      return {
        ...prev,
        hasSeenOnboarding: { ...prev.hasSeenOnboarding, [prev.currentPage]: true },
        currentPage: null,
        currentStep: 0,
        isActive: false
      };
    });
  }, []);

  const dismissOnboarding = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentPage: null,
      currentStep: 0,
      isActive: false
    }));
  }, []);

  const resetOnboarding = useCallback((pageId?: string) => {
    setState(prev => {
      if (pageId) {
        const { [pageId]: _, ...rest } = prev.hasSeenOnboarding;
        return { ...prev, hasSeenOnboarding: rest };
      }
      return { ...prev, hasSeenOnboarding: {} };
    });
  }, []);

  const getCurrentPageSteps = useCallback(() => {
    if (!state.currentPage) return [];
    return pageOnboardingConfigs[state.currentPage]?.steps || [];
  }, [state.currentPage]);

  const getCurrentStep = useCallback(() => {
    const steps = getCurrentPageSteps();
    return steps[state.currentStep] || null;
  }, [getCurrentPageSteps, state.currentStep]);

  const isPageOnboarded = useCallback((pageId: string) => {
    return state.hasSeenOnboarding[pageId] === true;
  }, [state.hasSeenOnboarding]);

  return (
    <OnboardingContext.Provider value={{
      state,
      startOnboarding,
      nextStep,
      prevStep,
      skipOnboarding,
      dismissOnboarding,
      resetOnboarding,
      getCurrentPageSteps,
      getCurrentStep,
      isPageOnboarded
    }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
