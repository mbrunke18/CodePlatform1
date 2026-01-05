import { useState } from 'react';
import bastionLogo from '@assets/bastion-logo.png';
import { Link, useLocation } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Shield } from 'lucide-react';
import { navigationItems, categories, getItemsByCategory, NavigationCategory } from '@/navigation/config';
import { renderIcon } from '@/lib/iconRenderer';

// Now using centralized navigation config from @/navigation/config

export default function EnterpriseNavigation() {
  const [location] = useLocation();
  const [expandedCategory, setExpandedCategory] = useState<NavigationCategory | null>('intelligence');

  // Map centralized categories to display config with gradients
  const categoryDisplayConfig = {
    intelligence: {
      gradient: 'bg-gradient-to-r from-primary via-blue-500 to-teal-500'
    },
    crisis: {
      gradient: 'bg-gradient-to-r from-red-600 to-orange-600'
    },
    strategic: {
      gradient: 'bg-gradient-to-r from-teal-600 to-primary'
    },
    system: {
      gradient: 'bg-gradient-to-r from-gray-600 to-gray-700'
    }
  };

  // Use centralized categories and group items
  const groupedItems = Object.entries(categories).map(([categoryKey, categoryInfo]) => ({
    ...categoryInfo,
    key: categoryKey as NavigationCategory,
    gradient: categoryDisplayConfig[categoryKey as NavigationCategory]?.gradient || 'bg-gradient-to-r from-gray-600 to-gray-700',
    items: getItemsByCategory(categoryKey as NavigationCategory)
  }));

  return (
    <div className="w-96 min-h-screen bg-gray-950/95 backdrop-blur-md border-r border-gray-700/50 overflow-y-auto flex-shrink-0" data-testid="enterprise-navigation">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <img 
            src={bastionLogo} 
            alt="Bastion Logo" 
            className="h-10 w-auto"
          />
          <div>
            <h1 className="text-xl font-bold text-white">Bastion</h1>
            <p className="text-sm text-gray-300">Certainty, Engineered.</p>
          </div>
        </div>

        <div className="space-y-4">
          {groupedItems.map((category) => (
            <div key={category.key}>
              <Button
                variant="ghost"
                className={`w-full justify-start h-auto p-3 ${category.gradient} text-white hover:opacity-90`}
                onClick={() => setExpandedCategory(expandedCategory === category.key ? null : category.key)}
                data-testid={`nav-category-${category.key}`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    {renderIcon(category.icon, "h-4 w-4")}
                    <span className="font-medium">{category.label}</span>
                  </div>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    {category.items.length}
                  </Badge>
                </div>
              </Button>

              {expandedCategory === category.key && (
                <div className="mt-2 space-y-1 pl-4">
                  {category.items.map((item) => (
                    <Link key={item.id} to={item.path}>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start h-auto p-3 text-gray-300 hover:text-white hover:bg-gray-800/50 ${location === item.path ? 'bg-primary/20 text-primary-foreground border-l-4 border-l-primary' : ''}`}
                        data-testid={`nav-item-${item.id}`}
                      >
                        <div className="flex items-center justify-between w-full min-w-0">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            {renderIcon(item.icon, "h-5 w-5")}
                            <div className="text-left min-w-0 flex-1">
                              <div className="font-medium truncate">{item.label}</div>
                              <div className="text-xs text-gray-400 truncate">{item.description}</div>
                            </div>
                          </div>
                          {item.badge && (
                            <Badge 
                              variant={item.badge === 'LIVE' ? 'destructive' : 'secondary'} 
                              className="text-xs"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                      </Button>
                    </Link>
                  ))}
                </div>
              )}
              
              {category.key !== 'system' && <Separator className="my-2" />}
            </div>
          ))}
        </div>

        {/* Crisis Response Quick Access */}
        <Card className="mt-6 border-destructive/30 bg-destructive/20 backdrop-blur-sm" data-testid="crisis-quick-access">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="font-semibold text-destructive-foreground">Emergency Response</span>
            </div>
            <p className="text-xs text-destructive-foreground/80 mb-3">
              Immediate access to crisis management protocols
            </p>
            <Link to="/crisis">
              <Button variant="destructive" size="sm" className="w-full" data-testid="emergency-response-button">
                <Shield className="h-4 w-4 mr-2" />
                Activate Crisis Response
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Platform Status */}
        <div className="mt-6 p-4 bg-primary/10 backdrop-blur-sm rounded-lg border border-primary/30" data-testid="platform-status">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-primary-foreground">Platform Status</span>
          </div>
          <div className="text-xs text-primary-foreground/80">
            All systems operational • AI modules active • Crisis response ready
          </div>
        </div>
      </div>
    </div>
  );
}