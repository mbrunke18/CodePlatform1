import IDEALayout from '@/components/layout/IDEALayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';

const templates = [
  { name: 'Competitive Response', domain: 'Market Entry', count: 12, color: 'bg-[#0A0F2E]' },
  { name: 'M&A Integration', domain: 'M&A', count: 15, color: 'bg-[#0A0F2E]' },
  { name: 'Product Launch', domain: 'Product', count: 8, color: 'bg-[#2B8A6E]' },
  { name: 'Crisis Management', domain: 'Crisis', count: 22, color: 'bg-red-500' },
  { name: 'Cyber Incident', domain: 'Cyber', count: 18, color: 'bg-orange-500' },
  { name: 'Regulatory Change', domain: 'Regulatory', count: 14, color: 'bg-yellow-500' },
  { name: 'Digital Transformation', domain: 'Digital', count: 20, color: 'bg-[#2B8A6E]' },
  { name: 'AI Governance', domain: 'AI', count: 18, color: 'bg-[#0A0F2E]' },
];

export default function TemplatesPage() {
  return (
    <IDEALayout>
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Scenario Templates</h1>
          <p className="text-muted-foreground">
            Pre-configured prepared response templates by industry and threat type. Select a template to customize for your organization.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <Card key={template.name} className="hover:border-[#C9A84C]/50/50 transition-colors cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${template.color} flex items-center justify-center`}>
                    <FileText className="w-5 h-5 text-gray-900" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    <Badge variant="secondary" className="text-xs mt-1">
                      {template.domain}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  {template.count} pre-built prepared responses ready for customization
                </p>
                <Link href="/identify/prepared responses">
                  <Button variant="outline" size="sm" className="w-full">
                    View Templates <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </IDEALayout>
  );
}
