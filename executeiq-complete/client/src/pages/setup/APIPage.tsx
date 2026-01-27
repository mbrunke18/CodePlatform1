import IDEALayout from '@/components/layout/IDEALayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Code, Key, BookOpen, Webhook } from 'lucide-react';

export default function APIPage() {
  return (
    <IDEALayout>
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">API & Automation</h1>
          <p className="text-muted-foreground">
            Developer tools, API documentation, and automation endpoints
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5 text-poise-gold" />
                API Keys
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Manage API keys for programmatic access to ExecuteIQ
              </p>
              <Button variant="outline" disabled>
                Generate API Key
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Available in Enterprise plan
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-poise-teal" />
                API Documentation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Explore REST API endpoints and integration guides
              </p>
              <Button variant="outline">
                View Documentation
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Webhook className="w-5 h-5 text-purple-500" />
                Webhooks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Configure webhooks for real-time event notifications
              </p>
              <Badge variant="secondary">0 Active Webhooks</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5 text-blue-500" />
                SDKs & Libraries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Client libraries for popular programming languages
              </p>
              <div className="flex gap-2">
                <Badge variant="outline">Node.js</Badge>
                <Badge variant="outline">Python</Badge>
                <Badge variant="outline">Go</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </IDEALayout>
  );
}
