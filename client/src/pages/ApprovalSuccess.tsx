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
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-[#E8E4DC] shadow-2xl rounded-none">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-[#2B8A6E]/10 rounded-none flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-[#2B8A6E]" />
          </div>
          <CardTitle className="text-2xl text-[#0A0F2E] font-serif">
            {action === 'approve' ? 'Approved Successfully' : 'Action Completed'}
          </CardTitle>
          <CardDescription className="text-[#6B7280] font-light">
            Your decision has been recorded and the execution will proceed accordingly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {executionId && (
            <div className="bg-[#F8F7F4] p-4 rounded-none border border-[#E8E4DC]">
              <p className="text-[10px] text-[#0A0F2E] font-bold uppercase tracking-widest mb-1">Execution ID</p>
              <p className="font-mono text-xs break-all text-[#6B7280]">{executionId}</p>
            </div>
          )}
          
          <div className="space-y-3 text-[11px] text-[#6B7280] font-bold uppercase tracking-widest">
            <p className="flex items-center gap-3"><CheckCircle className="w-3 h-3 text-[#2B8A6E]" /> Your action has been processed</p>
            <p className="flex items-center gap-3"><CheckCircle className="w-3 h-3 text-[#2B8A6E]" /> Stakeholders have been notified</p>
            <p className="flex items-center gap-3"><CheckCircle className="w-3 h-3 text-[#2B8A6E]" /> Execution sequence updated</p>
          </div>

          <Button 
            onClick={() => setLocation('/')} 
            className="w-full bg-[#0A0F2E] hover:bg-[#141B45] text-[#C9A84C] font-bold uppercase tracking-[0.2em] text-[10px] rounded-none py-6 shadow-xl"
            data-testid="button-return-home"
          >
            Return to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
