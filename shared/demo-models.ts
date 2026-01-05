// Shared TypeScript contracts for demo components across all industries

export interface RadarDataStream {
  id: string;
  name: string;
  description: string;
  status: string;
  confidence?: number; // Added during runtime, starts at 65
}

export interface CoordinationTimelineEvent {
  time: string; // e.g., "0:00", "1:30", "12:00"
  title: string;
  description: string;
  status: string;
  icon?: string; // Optional icon type for UI
  stakeholderCount?: number;
}

export interface StakeholderTier {
  title: string;
  count: number;
  members: string[];
}

export interface StakeholderTiers {
  tier1: StakeholderTier;
  tier2: StakeholderTier;
  tier3: StakeholderTier;
}

export interface ROISide {
  label: string;
  duration: string;
  approach?: string;
  outcome: string;
  points: string[]; // Can be consequences (traditional) or benefits (M)
  details?: Record<string, any>; // Flexible for industry-specific metrics
}

export interface ROIBottomLine {
  value: string; // e.g., "$280M Value Preserved"
  metric: string; // Additional context
}

export interface DemoROIComparison {
  traditional: ROISide;
  vexor: ROISide;
  bottomLine: ROIBottomLine;
}

export interface DemoSummaryMetrics {
  value: string; // The primary metric value
  label: string; // What the value represents
  icon: string; // Icon identifier
}

export interface DemoMetadata {
  industry: string; // e.g., "Financial Services", "Pharmaceutical"
  crisisType: string; // e.g., "Ransomware Attack", "Product Recall"
  playbookId: string; // e.g., "#065", "#095"
  playbookName: string;
  primaryColor: string; // e.g., "blue", "purple", "green" for theming
}
