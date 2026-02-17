import {
  LayoutDashboard,
  Brain,
  AlertTriangle,
  Target,
  Building2,
  Settings,
  Activity,
  TrendingUp,
  Users,
  Lightbulb,
  Shield,
  Zap,
  FileText,
  BarChart3,
  MessageSquare,
  Network,
  Layers,
  Radio,
  PlayCircle,
  Presentation,
  Timer,
  Rocket
} from 'lucide-react';

const iconMap = {
  LayoutDashboard,
  Brain,
  AlertTriangle,
  Target,
  Building2,
  Settings,
  Activity,
  TrendingUp,
  Users,
  Lightbulb,
  Shield,
  Zap,
  FileText,
  BarChart3,
  MessageSquare,
  Network,
  Layers,
  Radio,
  PlayCircle,
  Presentation,
  Timer,
  Rocket
} as const;

export type IconName = keyof typeof iconMap;

export function renderIcon(iconName: IconName, className?: string) {
  const IconComponent = iconMap[iconName];
  if (!IconComponent) {
    console.warn(`Icon "${iconName}" not found in iconMap`);
    return null;
  }
  return <IconComponent className={className} />;
}

export function renderNavigationIcon(iconName: IconName, size: 'sm' | 'md' = 'md') {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5'
  };
  return renderIcon(iconName, sizeClasses[size]);
}
