import StandardNav from '@/components/layout/StandardNav';
import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ApprovalSuccess() {
  const [, setLocation] = useLocation();
  const params = new URLSearchParams(window.location.search);
  const action = params.get('action') || 'approved';
  const executionId = params.get('execution');

  useEffect(() => {
    document.title = 'Approval Successful - M';
  }, []);

  return (
    <div className="page-background min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl">
            {action === 'approve' ? 'Approved Successfully' : 'Action Completed'}
          </CardTitle>
          <CardDescription>
            Your decision has been recorded and the execution will proceed accordingly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {executionId && (
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Execution ID</p>
              <p className="font-mono text-sm break-all">{executionId}</p>
            </div>
          )}
          
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p>✓ Your approval has been processed</p>
            <p>✓ Stakeholders have been notified</p>
            <p>✓ Execution will begin shortly</p>
          </div>

          <Button 
            onClick={() => setLocation('/')} 
            className="w-full"
            data-testid="button-return-home"
          >
            Return to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
