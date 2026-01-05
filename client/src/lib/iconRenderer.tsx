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
import { IconName } from '../navigation/config';

// Icon mapping from name to component
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

// Icon renderer function that converts icon names to JSX components
export function renderIcon(iconName: IconName, className?: string) {
  const IconComponent = iconMap[iconName];
  if (!IconComponent) {
    console.warn(`Icon "${iconName}" not found in iconMap`);
    return null;
  }
  return <IconComponent className={className} />;
}

// Helper function with default styling for navigation icons
export function renderNavigationIcon(iconName: IconName, size: 'sm' | 'md' = 'md') {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5'
  };
  return renderIcon(iconName, sizeClasses[size]);
}