export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  description: string;
}

export interface NavigationPhase {
  id: 'identify' | 'detect' | 'execute' | 'advance' | 'setup' | 'learn';
  label: string;
  tagline: string;
  icon: string;
  color: string;
  items: NavigationItem[];
}

export interface NavigationConfig {
  phases: NavigationPhase[];
}
