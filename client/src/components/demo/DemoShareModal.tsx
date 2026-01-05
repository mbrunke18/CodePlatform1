import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  X, 
  Copy, 
  Mail, 
  Share2,
  CheckCircle,
  Link as LinkIcon,
  Users
} from 'lucide-react';

interface DemoShareModalProps {
  onClose: () => void;
  persona?: 'ceo' | 'coo' | 'chro' | 'cto' | 'cio' | 'cdo' | 'ciso' | 'cfo';
  industry?: 'healthcare' | 'finance' | 'manufacturing' | 'retail' | 'general';
}

export default function DemoShareModal({ onClose, persona = 'ceo', industry = 'general' }: DemoShareModalProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [emailText, setEmailText] = useState('');
  
  // Generate personalized demo URL
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const demoUrl = `${baseUrl}/hybrid-demo?persona=${persona}&industry=${industry}&autostart=true`;
  
  // Generate email template
  const emailTemplates = {
    ceo: {
      subject: "Executive Decision Velocity Platform - Live Demo",
      body: `I wanted to share this interactive demo showcasing how Fortune 1000 companies achieve 12-minute execution vs the 72-hour industry standard.

Key highlights:
• Strategic ROI: $8.2M monthly value creation
• Decision Velocity: 85% faster than traditional coordination
• Comprehensive template library (12+ starting templates) + What-If Analyzer to build YOUR playbooks
• Real-time threat detection and response

The demo is fully interactive and takes about 5-10 minutes. It's personalized for CEO-level strategic priorities.

Launch Demo: ${demoUrl}

Best regards`
    },
    coo: {
      subject: "Operational Excellence Platform - Interactive Demo",
      body: `I wanted to share an interactive demo showing operational excellence in action - 12-minute coordination that typically takes 72 hours.

Key benefits:
• 85% reduction in coordination time
• 94% first-time execution success rate
• Automated playbook activation
• Real-time progress tracking

This 5-10 minute demo is tailored for operational leaders and shows the complete execution workflow.

Launch Demo: ${demoUrl}

Best regards`
    },
    chro: {
      subject: "Workforce Intelligence Platform - Live Demo",
      body: `I wanted to share this demo showing how our platform improves workforce stability and organizational health during crisis situations.

Key features:
• 34% better retention during disruptions
• 41% higher employee morale
• Automated workforce communication
• Cultural analytics and insights

The demo takes 5-10 minutes and focuses on people-first crisis management.

Launch Demo: ${demoUrl}

Best regards`
    },
    cto: {
      subject: "Technical Resilience Platform - Interactive Demo",
      body: `I wanted to share a demo showing how our Strategic Execution Operating System enables technical resilience and innovation velocity through AI intelligence, 24/7 monitoring, and coordinated execution. Launch Demo: ${demoUrl}`
    },
    cio: {
      subject: "Digital Continuity Platform - Interactive Demo",
      body: `I wanted to share a demo showing how our Strategic Execution Operating System ensures IT compliance and operational reliability with complete ecosystem integration and institutional memory. Launch Demo: ${demoUrl}`
    },
    cdo: {
      subject: "Data Governance Platform - Interactive Demo",
      body: `I wanted to share a demo showing how our Strategic Execution Operating System protects data integrity and accelerates analytics through AI-powered monitoring and strategic preparation. Launch Demo: ${demoUrl}`
    },
    ciso: {
      subject: "Security Response Platform - Interactive Demo",
      body: `I wanted to share a demo showing how our Strategic Execution Operating System strengthens cybersecurity posture with 12-minute response capabilities and complete integration hub. Launch Demo: ${demoUrl}`
    },
    cfo: {
      subject: "Financial Stability Platform - Interactive Demo",
      body: `I wanted to share a demo showing how our Strategic Execution Operating System protects liquidity and optimizes costs with executive intelligence and institutional memory. Launch Demo: ${demoUrl}`
    },
    general: {
      subject: "M - Strategic Execution Operating System Demo",
      body: `I wanted to share this interactive demo of M's Strategic Execution Operating System.

See how Fortune 1000 companies achieve:
• 12-minute execution (vs 72-hour standard)
• $8.2M monthly value creation
• 94% execution success rate
• Comprehensive template library (12+ starting templates) + What-If Analyzer to build YOUR playbooks

Experience "Certainty, Engineered" - the demo is fully interactive and takes about 5-10 minutes.

Launch Demo: ${demoUrl}

Best regards`
    }
  } as const;

  const template = emailTemplates[persona];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(demoUrl);
      setCopied(true);
      toast({
        title: "Link Copied!",
        description: "Demo URL has been copied to your clipboard"
      });
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Please manually copy the link",
        variant: "destructive"
      });
    }
  };

  const handleCopyEmail = async () => {
    const fullEmail = `Subject: ${template.subject}\n\n${template.body}`;
    try {
      await navigator.clipboard.writeText(fullEmail);
      toast({
        title: "Email Template Copied!",
        description: "Paste into your email client"
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Please manually copy the email text",
        variant: "destructive"
      });
    }
  };

  const handleEmailClient = () => {
    const mailtoLink = `mailto:?subject=${encodeURIComponent(template.subject)}&body=${encodeURIComponent(template.body)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div 
      className="fixed inset-0 z-[10002] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      data-testid="demo-share-modal"
    >
      <Card className="bg-gray-900/98 border-blue-500/70 shadow-2xl backdrop-blur-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <CardContent className="p-8 space-y-6">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Share2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Share Demo</h2>
                <p className="text-gray-400 text-sm">Send this experience to your team</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white hover:bg-white/10"
              data-testid="share-close-btn"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Personalization Info */}
          <div className="flex items-center gap-2 bg-blue-950/30 rounded-lg p-3 border border-blue-500/30">
            <Users className="h-5 w-5 text-blue-400" />
            <span className="text-sm text-gray-300">
              This demo link is personalized for:
            </span>
            <Badge variant="outline" className="bg-blue-600/20 text-blue-300 border-blue-500/50">
              {persona.toUpperCase()}
            </Badge>
            <Badge variant="outline" className="bg-purple-600/20 text-purple-300 border-purple-500/50">
              {industry.charAt(0).toUpperCase() + industry.slice(1)}
            </Badge>
          </div>

          {/* Direct Link */}
          <div className="space-y-3">
            <Label className="text-white font-semibold flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              Direct Demo Link
            </Label>
            <div className="flex gap-2">
              <Input 
                value={demoUrl}
                readOnly
                className="bg-gray-800 border-gray-700 text-gray-300 font-mono text-sm"
                data-testid="demo-url-input"
              />
              <Button 
                onClick={handleCopyLink}
                variant="outline"
                className={`${copied ? 'border-green-500 text-green-300' : 'border-blue-500 text-blue-300'} hover:bg-blue-600/20 min-w-[100px]`}
                data-testid="copy-link-btn"
              >
                {copied ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-400">
              This link will automatically start the demo with your selected settings
            </p>
          </div>

          {/* Email Template */}
          <div className="space-y-3">
            <Label className="text-white font-semibold flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Template
            </Label>
            
            {/* Subject */}
            <div className="space-y-2">
              <Label className="text-sm text-gray-400">Subject Line</Label>
              <Input 
                value={template.subject}
                readOnly
                className="bg-gray-800 border-gray-700 text-gray-300"
                data-testid="email-subject-input"
              />
            </div>

            {/* Body */}
            <div className="space-y-2">
              <Label className="text-sm text-gray-400">Email Body</Label>
              <Textarea 
                value={template.body}
                readOnly
                rows={12}
                className="bg-gray-800 border-gray-700 text-gray-300 font-mono text-sm"
                data-testid="email-body-textarea"
              />
            </div>

            {/* Email Actions */}
            <div className="flex gap-2">
              <Button 
                onClick={handleEmailClient}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                data-testid="open-email-client-btn"
              >
                <Mail className="h-4 w-4 mr-2" />
                Open in Email Client
              </Button>
              <Button 
                onClick={handleCopyEmail}
                variant="outline"
                className="border-gray-600 hover:bg-gray-800"
                data-testid="copy-email-btn"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Template
              </Button>
            </div>
          </div>

          {/* Usage Tips */}
          <div className="bg-purple-950/30 rounded-lg p-4 border border-purple-500/30">
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              <Share2 className="h-4 w-4 text-purple-400" />
              Sharing Tips
            </h3>
            <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
              <li>Demo auto-starts when recipients click the link</li>
              <li>Takes 5-10 minutes depending on selected duration</li>
              <li>Fully interactive - no installation required</li>
              <li>Recipients can pause/replay any scene</li>
              <li>Perfect for board presentations and executive reviews</li>
            </ul>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
