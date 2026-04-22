import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, Rocket, Sparkles } from 'lucide-react';
import ScenarioWizard from './ScenarioWizard';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';

interface CreateScenarioButtonProps {
  organizationId: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export default function CreateScenarioButton({ 
  organizationId, 
  variant = 'default',
  size = 'default',
  className = ''
}: CreateScenarioButtonProps) {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const { toast } = useToast();

  const handleWizardComplete = async (scenarioData: any) => {
    try {
      const response = await fetch('/api/scenarios/comprehensive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scenarioData),
      });
      
      if (!response.ok) throw new Error('Failed to create scenario');
      
      toast({ 
        title: '✓ Prepared Response Created Successfully!',
        description: `${scenarioData.name} is now ready for execution`,
      });
      
      setIsWizardOpen(false);
      queryClient.invalidateQueries({ queryKey: ['/api/scenarios'] });
    } catch (error) {
      toast({ 
        title: 'Creation Failed',
        description: 'Failed to create Prepared Response. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <Button 
        onClick={() => setIsWizardOpen(true)}
        variant={variant}
        size={size}
        className={`bg-gradient-to-r from-[#0A0F2E] to-[#141B45] hover:from-[#0A0F2E] hover:to-[#141B45] text-white ${className}`}
        data-testid="button-create-scenario"
      >
        <Rocket className="w-4 h-4 mr-2" />
        Create New Prepared Response
        <Sparkles className="w-4 h-4 ml-2" />
      </Button>

      <Dialog open={isWizardOpen} onOpenChange={setIsWizardOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden p-0">
          <DialogHeader className="px-6 pt-6 pb-4 bg-gradient-to-r from-[#0A0F2E] to-[#141B45] dark:from-[#0A0F2E]/20 dark:to-[#141B45]/20">
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[#0A0F2E] to-[#141B45] flex items-center justify-center">
                <Rocket className="w-6 h-6 text-gray-900" />
              </div>
              Create Championship-Level Prepared Response
            </DialogTitle>
            <p className="text-sm text-gray-800 dark:text-gray-200 mt-2">
              Build a complete decision operations prepared response in 5 strategic phases
            </p>
          </DialogHeader>
          
          <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
            <ScenarioWizard 
              organizationId={organizationId}
              onComplete={handleWizardComplete}
              onCancel={() => setIsWizardOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
