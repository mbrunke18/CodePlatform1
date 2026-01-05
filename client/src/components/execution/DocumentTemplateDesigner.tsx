import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FileText,
  Newspaper,
  Briefcase,
  FileWarning,
  ClipboardList,
  FileCheck,
  Presentation,
  Mail,
  Scale,
  DollarSign,
  Users,
  Download,
  Eye,
  Wand2,
  Copy,
  Check,
  Loader2,
  ChevronRight,
  FileEdit,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface DocumentTemplateDesignerProps {
  executionInstanceId?: string;
  scenarioId?: string;
  organizationId?: string;
  onDocumentGenerated?: (document: GeneratedDocument) => void;
}

interface TemplateType {
  type: string;
  name: string;
  description: string;
}

interface TemplateVariable {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: any;
  description?: string;
  source?: string;
}

interface GeneratedDocument {
  id: string;
  name: string;
  content: string;
  format: string;
  metadata: {
    templateId: string;
    generatedAt: string;
    variablesUsed: Record<string, any>;
    wordCount: number;
  };
}

const templateIcons: Record<string, any> = {
  press_release: Newspaper,
  stakeholder_memo: FileText,
  executive_briefing: Briefcase,
  project_charter: ClipboardList,
  risk_assessment: FileWarning,
  action_plan: FileCheck,
  status_report: FileEdit,
  board_presentation: Presentation,
  customer_communication: Mail,
  regulatory_filing: Scale,
  budget_request: DollarSign,
  resource_allocation: Users,
};

export function DocumentTemplateDesigner({
  executionInstanceId,
  scenarioId,
  organizationId,
  onDocumentGenerated,
}: DocumentTemplateDesignerProps) {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [variableValues, setVariableValues] = useState<Record<string, any>>({});
  const [showPreview, setShowPreview] = useState(false);
  const [generatedDoc, setGeneratedDoc] = useState<GeneratedDocument | null>(null);
  const [copied, setCopied] = useState(false);
  
  const { data: templateTypes = [], isLoading: loadingTemplates } = useQuery<TemplateType[]>({
    queryKey: ['/api/documents/template-types'],
  });
  
  const { data: templateVariables = [], isLoading: loadingVariables } = useQuery<TemplateVariable[]>({
    queryKey: ['/api/documents/template-types', selectedTemplate, 'variables'],
    enabled: !!selectedTemplate,
  });
  
  const generateMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/documents/generate-from-type', {
        templateType: selectedTemplate,
        variables: variableValues,
        executionInstanceId,
        scenarioId,
        organizationId,
      });
      return response.json();
    },
    onSuccess: (data: GeneratedDocument) => {
      setGeneratedDoc(data);
      setShowPreview(true);
      toast({
        title: 'Document Generated',
        description: `${data.name} has been created successfully.`,
      });
      onDocumentGenerated?.(data);
    },
    onError: (error) => {
      toast({
        title: 'Generation Failed',
        description: error instanceof Error ? error.message : 'Failed to generate document',
        variant: 'destructive',
      });
    },
  });
  
  const handleVariableChange = (name: string, value: any) => {
    setVariableValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleCopyToClipboard = () => {
    if (generatedDoc) {
      navigator.clipboard.writeText(generatedDoc.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: 'Copied',
        description: 'Document content copied to clipboard.',
      });
    }
  };
  
  const handleDownload = () => {
    if (!generatedDoc) return;
    
    const blob = new Blob([generatedDoc.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedDoc.name.replace(/\s+/g, '_')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Downloaded',
      description: 'Document saved to your downloads.',
    });
  };
  
  const getRequiredVariables = () => 
    templateVariables.filter(v => v.required && v.source === 'user_input');
  
  const getOptionalVariables = () => 
    templateVariables.filter(v => !v.required || v.source !== 'user_input');
  
  const canGenerate = () => {
    const required = getRequiredVariables();
    return required.every(v => variableValues[v.name] && String(variableValues[v.name]).trim());
  };
  
  const renderTemplateSelection = () => {
    if (loadingTemplates) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {templateTypes.map((template) => {
          const Icon = templateIcons[template.type] || FileText;
          const isSelected = selectedTemplate === template.type;
          
          return (
            <button
              key={template.type}
              onClick={() => {
                setSelectedTemplate(template.type);
                setVariableValues({});
                setGeneratedDoc(null);
              }}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-lg border text-center transition-all",
                isSelected 
                  ? "border-primary bg-primary/5 shadow-sm" 
                  : "border-border hover:border-primary/50 hover:bg-muted/50"
              )}
              data-testid={`template-type-${template.type}`}
            >
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
              )}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="font-medium text-sm">{template.name}</span>
            </button>
          );
        })}
      </div>
    );
  };
  
  const renderVariableForm = () => {
    if (!selectedTemplate) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          Select a template type to configure variables
        </div>
      );
    }
    
    if (loadingVariables) {
      return (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      );
    }
    
    const required = getRequiredVariables();
    const optional = getOptionalVariables();
    
    return (
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-6">
          {required.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium text-sm flex items-center gap-2">
                Required Information
                <Badge variant="secondary" className="text-xs">
                  {required.length} fields
                </Badge>
              </h4>
              {required.map((variable) => (
                <div key={variable.name} className="space-y-2">
                  <Label htmlFor={variable.name} className="flex items-center gap-1">
                    {formatVariableName(variable.name)}
                    <span className="text-destructive">*</span>
                  </Label>
                  {variable.type === 'string' && variable.name.includes('content') || 
                   variable.name.includes('summary') || 
                   variable.name.includes('description') ||
                   variable.name.includes('body') ? (
                    <Textarea
                      id={variable.name}
                      value={variableValues[variable.name] || ''}
                      onChange={(e) => handleVariableChange(variable.name, e.target.value)}
                      placeholder={variable.description || `Enter ${formatVariableName(variable.name).toLowerCase()}`}
                      rows={4}
                      data-testid={`input-${variable.name}`}
                    />
                  ) : (
                    <Input
                      id={variable.name}
                      type={variable.type === 'date' ? 'date' : 'text'}
                      value={variableValues[variable.name] || ''}
                      onChange={(e) => handleVariableChange(variable.name, e.target.value)}
                      placeholder={variable.description || `Enter ${formatVariableName(variable.name).toLowerCase()}`}
                      data-testid={`input-${variable.name}`}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
          
          {optional.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium text-sm flex items-center gap-2 text-muted-foreground">
                Optional / Auto-filled
                <Badge variant="outline" className="text-xs">
                  {optional.length} fields
                </Badge>
              </h4>
              {optional.filter(v => v.source === 'user_input').map((variable) => (
                <div key={variable.name} className="space-y-2">
                  <Label htmlFor={variable.name} className="text-muted-foreground">
                    {formatVariableName(variable.name)}
                    {variable.source !== 'user_input' && (
                      <span className="text-xs ml-2">({variable.source})</span>
                    )}
                  </Label>
                  <Input
                    id={variable.name}
                    type={variable.type === 'date' ? 'date' : 'text'}
                    value={variableValues[variable.name] || variable.defaultValue || ''}
                    onChange={(e) => handleVariableChange(variable.name, e.target.value)}
                    placeholder={variable.description}
                    data-testid={`input-${variable.name}`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    );
  };
  
  const formatVariableName = (name: string) => {
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  const renderMarkdownPreview = (content: string) => {
    return (
      <div 
        className="prose prose-sm dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ 
          __html: content
            .replace(/^### (.+)$/gm, '<h3>$1</h3>')
            .replace(/^## (.+)$/gm, '<h2>$1</h2>')
            .replace(/^# (.+)$/gm, '<h1>$1</h1>')
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
            .replace(/^- (.+)$/gm, '<li>$1</li>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>')
        }}
      />
    );
  };
  
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5" />
              Document Generator
            </CardTitle>
            <CardDescription>
              Auto-generate professional documents from execution context
            </CardDescription>
          </div>
          {selectedTemplate && (
            <Button
              onClick={() => generateMutation.mutate()}
              disabled={!canGenerate() || generateMutation.isPending}
              data-testid="button-generate-document"
            >
              {generateMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="template" className="space-y-4">
          <TabsList>
            <TabsTrigger value="template" data-testid="tab-template">
              <FileText className="h-4 w-4 mr-2" />
              Template
            </TabsTrigger>
            <TabsTrigger value="variables" data-testid="tab-variables" disabled={!selectedTemplate}>
              <FileEdit className="h-4 w-4 mr-2" />
              Variables
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="template">
            {renderTemplateSelection()}
          </TabsContent>
          
          <TabsContent value="variables">
            {renderVariableForm()}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {generatedDoc?.name}
            </DialogTitle>
            <DialogDescription>
              {generatedDoc?.metadata.wordCount} words generated
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[50vh] pr-4">
            {generatedDoc && renderMarkdownPreview(generatedDoc.content)}
          </ScrollArea>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleCopyToClipboard}
              data-testid="button-copy-document"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
            <Button onClick={handleDownload} data-testid="button-download-document">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
