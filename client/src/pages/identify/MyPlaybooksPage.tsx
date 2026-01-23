import IDEALayout from '@/components/layout/IDEALayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, Users, Plus } from 'lucide-react';
import { Link } from 'wouter';

export default function MyPlaybooksPage() {
  return (
    <IDEALayout>
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Playbooks</h1>
            <p className="text-muted-foreground">
              Your customized playbooks ready for monitoring and activation
            </p>
          </div>
          <Link href="/identify/wizard">
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> Create Playbook
            </Button>
          </Link>
        </div>

        <div className="grid gap-4">
          <Card className="border-dashed border-2 hover:border-poise-gold/50 transition-colors">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No playbooks yet</h3>
              <p className="text-muted-foreground text-center mb-4 max-w-md">
                Create your first playbook by customizing one of our 166 pre-built templates
              </p>
              <Link href="/identify/playbooks">
                <Button>Browse Playbook Library</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-poise-gold" />
                <div>
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-xs text-muted-foreground">Active Playbooks</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Avg Response Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-poise-teal" />
                <div>
                  <div className="text-2xl font-bold">--</div>
                  <div className="text-xs text-muted-foreground">Minutes</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Team Coverage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">--</div>
                  <div className="text-xs text-muted-foreground">Stakeholders</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </IDEALayout>
  );
}
