import IDEALayout from '@/components/layout/IDEALayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, MessageCircle, Video, FileText, Mail, ExternalLink } from 'lucide-react';

const resources = [
  {
    icon: BookOpen,
    title: 'Documentation',
    description: 'Comprehensive guides and API reference',
    action: 'Browse Docs',
    color: 'text-[#0A0F2E]'
  },
  {
    icon: Video,
    title: 'Video Tutorials',
    description: 'Step-by-step walkthroughs of key features',
    action: 'Watch Videos',
    color: 'text-red-500'
  },
  {
    icon: FileText,
    title: 'Best Practices',
    description: 'Learn from enterprise Readiness Protocol templates',
    action: 'Read Guides',
    color: 'text-[#2B8A6E]'
  },
  {
    icon: MessageCircle,
    title: 'Community',
    description: 'Connect with other Readiness OS users',
    action: 'Join Community',
    color: 'text-[#C9A84C]'
  }
];

export default function HelpPage() {
  return (
    <IDEALayout>
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Help & Support</h1>
          <p className="text-muted-foreground">
            Documentation, tutorials, and support resources
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {resources.map((resource) => (
            <Card key={resource.title}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <resource.icon className={`w-5 h-5 ${resource.color}`} />
                  {resource.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{resource.description}</p>
                <Button variant="outline" className="gap-2">
                  {resource.action} <ExternalLink className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#C9A84C]" />
              Contact Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Need personalized help? Our enterprise support team is here for you.
            </p>
            <div className="flex gap-3">
              <Button>
                <Mail className="w-4 h-4 mr-2" /> Email Support
              </Button>
              <Button variant="outline">
                Schedule a Call
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </IDEALayout>
  );
}
