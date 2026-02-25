import PageLayout from '@/components/layout/PageLayout';
import PlatformVisual from '@/components/marketing/PlatformVisual';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';
import { useLocation } from 'wouter';

export default function PlatformOverview() {
  const [, setLocation] = useLocation();

  return (
    <PageLayout>
      <div>
        <PlatformVisual />

        <section className="py-16 px-6 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              See It in Action
            </h2>
            <p className="text-lg text-slate-700 dark:text-slate-300 mb-8">
              Experience the full trigger-to-execution loop with a live interactive demo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => setLocation('/try-demo')}
                className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-gray-900 px-8 py-6 text-lg"
              >
                <Play className="mr-2 h-5 w-5" />
                Try Interactive Demo
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setLocation('/contact')}
                className="px-8 py-6 text-lg"
              >
                Start Pilot Program
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
