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
    <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-[#E8E4DC] shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-[#2B8A6E]/10 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-[#2B8A6E]" />
          </div>
          <CardTitle className="text-2xl text-[#0A0F2E]">
            {action === 'approve' ? 'Approved Successfully' : 'Action Completed'}
          </CardTitle>
          <CardDescription className="text-gray-800">
            Your decision has been recorded and the execution will proceed accordingly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {executionId && (
            <div className="bg-[#0A0F2E]/5 p-4 rounded-lg border border-[#0A0F2E]/10">
              <p className="text-sm text-[#0A0F2E] font-medium">Execution ID</p>
              <p className="font-mono text-sm break-all text-gray-800">{executionId}</p>
            </div>
          )}
          
          <div className="space-y-2 text-sm text-gray-800">
            <p className="flex items-center gap-2"><span className="text-[#2B8A6E]">✓</span> Your approval has been processed</p>
            <p className="flex items-center gap-2"><span className="text-[#2B8A6E]">✓</span> Stakeholders have been notified</p>
            <p className="flex items-center gap-2"><span className="text-[#2B8A6E]">✓</span> Execution will begin shortly</p>
          </div>

          <Button 
            onClick={() => setLocation('/')} 
            className="w-full bg-[#0A0F2E] hover:bg-[#141B45] text-white"
            data-testid="button-return-home"
          >
            Return to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
