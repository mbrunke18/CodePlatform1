import PageLayout from '@/components/layout/PageLayout';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, BookOpen, Play, Star, TrendingUp, ArrowRight } from 'lucide-react';
import { useLocation } from 'wouter';

const playbookCategories = [
  { name: 'Crisis Response', count: 24, color: 'bg-red-500' },
  { name: 'Market Opportunities', count: 18, color: 'bg-blue-500' },
  { name: 'Competitive Threats', count: 16, color: 'bg-orange-500' },
  { name: 'Regulatory Changes', count: 22, color: 'bg-purple-500' },
  { name: 'Technology Disruption', count: 20, color: 'bg-cyan-500' },
  { name: 'M&A Activity', count: 14, color: 'bg-green-500' },
  { name: 'Supply Chain', count: 18, color: 'bg-yellow-500' },
  { name: 'Talent & Culture', count: 16, color: 'bg-pink-500' },
];

const featuredPlaybooks = [
  { id: 1, name: 'Ransomware Attack Response', category: 'Crisis Response', activations: 127, rating: 4.9, lastUsed: '2 days ago' },
  { id: 2, name: 'Emerging Market Entry', category: 'Market Opportunities', activations: 94, rating: 4.8, lastUsed: '1 week ago' },
  { id: 3, name: 'Competitor Product Launch', category: 'Competitive Threats', activations: 156, rating: 4.7, lastUsed: '3 days ago' },
  { id: 4, name: 'Supply Chain Disruption', category: 'Supply Chain', activations: 203, rating: 4.9, lastUsed: 'Today' },
  { id: 5, name: 'M&A Integration Playbook', category: 'M&A Activity', activations: 78, rating: 4.6, lastUsed: '5 days ago' },
  { id: 6, name: 'Data Breach Response', category: 'Crisis Response', activations: 112, rating: 4.8, lastUsed: '1 day ago' },
];

export default function ScenarioLibraryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [, setLocation] = useLocation();

  // Filter playbooks based on search query
  const filteredPlaybooks = featuredPlaybooks.filter(playbook =>
    playbook.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    playbook.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageLayout>
      <div className="p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-title mb-2">
            Scenario Library
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            166 battle-tested strategic playbooks across 9 domains
          </p>

          {/* Search */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search playbooks by name, category, or trigger..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-2 border-slate-300 focus:border-blue-500"
              data-testid="input-search-playbooks"
            />
            {searchQuery && (
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-slate-500">
                {filteredPlaybooks.length} result{filteredPlaybooks.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Categories Grid */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {playbookCategories.map((category) => (
              <Card 
                key={category.name} 
                className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 hover:border-blue-400 dark:hover:border-blue-500"
                data-testid={`card-category-${category.name.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => setLocation('/playbook-library')}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                    <CardTitle className="text-sm">{category.name}</CardTitle>
                  </div>
                  <CardDescription className="text-2xl font-bold">
                    {category.count}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Playbooks */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            {searchQuery ? 'Search Results' : 'Most Activated Playbooks'}
          </h2>
          {filteredPlaybooks.length === 0 ? (
            <Card className="bg-slate-50 dark:bg-slate-900 border-dashed">
              <CardContent className="p-12 text-center">
                <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600 dark:text-slate-400">
                  No playbooks found matching "{searchQuery}". Try a different search term.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPlaybooks.map((playbook) => (
              <Card 
                key={playbook.id} 
                data-testid={`card-playbook-${playbook.id}`}
                className="cursor-pointer hover:shadow-lg transition-all hover:border-blue-400 dark:hover:border-blue-500 group"
                onClick={() => setLocation('/playbook-library')}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-semibold">{playbook.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{playbook.name}</CardTitle>
                  <CardDescription>{playbook.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Activations:</span>
                      <Badge variant="secondary">{playbook.activations}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Last used:</span>
                      <span className="font-medium">{playbook.lastUsed}</span>
                    </div>
                    <Button className="w-full" size="sm" data-testid={`button-view-details-${playbook.id}`}>
                      <ArrowRight className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            </div>
          )}
        </div>

        {/* Total Count */}
        <Card className="bg-gradient-to-r from-blue-600 to-violet-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-1">166 Strategic Playbooks</h3>
                <p className="text-blue-100">Ready to deploy across your organization</p>
              </div>
              <Button 
                variant="secondary" 
                size="lg" 
                data-testid="button-view-all"
                onClick={() => setLocation('/playbook-library')}
              >
                View All Playbooks
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </PageLayout>
  );
}
