import StandardNav from '@/components/layout/StandardNav';
import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ApprovalError() {
  const [, setLocation] = useLocation();
  const params = new URLSearchParams(window.location.search);
  const message = params.get('message') || 'Invalid or expired approval link';

  useEffect(() => {
    document.title = 'Approval Error - M';
  }, []);

  const getErrorDetails = (msg: string) => {
    if (msg.includes('expired')) {
      return {
        title: 'Link Expired',
        description: 'This approval link has expired. Approval links are valid for 72 hours.',
        suggestions: [
          'Request a new approval link from your administrator',
          'Check your email for a more recent approval request',
        ],
      };
    }
    if (msg.includes('already used')) {
      return {
        title: 'Link Already Used',
        description: 'This approval link has already been used and cannot be used again.',
        suggestions: [
          'This execution has already been approved or rejected',
          'Check the execution status in your dashboard',
        ],
      };
    }
    return {
      title: 'Invalid Link',
      description: 'This approval link is invalid or has been revoked.',
      suggestions: [
        'Verify you clicked the correct link from your email',
        'Request a new approval link if needed',
      ],
    };
  };

  const errorDetails = getErrorDetails(message);

  return (
    <div className="page-background min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-2xl">{errorDetails.title}</CardTitle>
          <CardDescription>{errorDetails.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertDescription>{message}</AlertDescription>
          </Alert>

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              What you can do:
            </p>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              {errorDetails.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>

          <Button 
            onClick={() => setLocation('/')} 
            className="w-full"
            variant="outline"
            data-testid="button-return-home"
          >
            Return to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
