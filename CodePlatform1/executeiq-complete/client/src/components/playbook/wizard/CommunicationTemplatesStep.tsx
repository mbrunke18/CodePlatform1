import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, X, FileText } from 'lucide-react';

interface CommunicationTemplatesStepProps {
  data: any;
  onChange: (data: any) => void;
  playbook: any;
}

const TEMPLATE_TYPES = [
  { id: 'board_memo', name: 'Board Memo', icon: '📋' },
  { id: 'customer_email', name: 'Customer Email', icon: '📧' },
  { id: 'media_statement', name: 'Media Statement', icon: '📰' },
  { id: 'employee_townhall', name: 'Employee Townhall', icon: '👥' },
  { id: 'regulator_notification', name: 'Regulator Notification', icon: '⚖️' },
  { id: 'social_media', name: 'Social Media Response', icon: '📱' },
];

export default function CommunicationTemplatesStep({ data, onChange }: CommunicationTemplatesStepProps) {
  const [activeTemplate, setActiveTemplate] = useState('board_memo');
  const [newTemplate, setNewTemplate] = useState({ type: 'board_memo', subject: '', body: '' });

  const templates = Array.isArray(data?.communicationTemplates) ? data.communicationTemplates : [];

  const addTemplate = () => {
    if (!newTemplate.subject || !newTemplate.body) return;
    
    const updated = [...templates, newTemplate];
    onChange({ ...data, communicationTemplates: updated });
    setNewTemplate({ type: activeTemplate, subject: '', body: '' });
  };

  const removeTemplate = (index: number) => {
    const updated = [...templates];
    updated.splice(index, 1);
    onChange({ ...data, communicationTemplates: updated });
  };

  const getTemplatesOfType = (type: string) => {
    return templates.filter((t: any) => t.type === type);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-sm mb-2">80% Pre-filled Template</h3>
        <p className="text-xs text-muted-foreground">
          Pre-drafted communications with &#123;&#123;variables&#125;&#125; for customization. Fill in your specific details.
        </p>
      </div>

      <Tabs value={activeTemplate} onValueChange={setActiveTemplate}>
        <TabsList className="grid grid-cols-3 lg:grid-cols-6">
          {TEMPLATE_TYPES.map((type) => (
            <TabsTrigger key={type.id} value={type.id} className="text-xs">
              <span className="mr-1">{type.icon}</span>
              <span className="hidden lg:inline">{type.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {TEMPLATE_TYPES.map((templateType) => (
          <TabsContent key={templateType.id} value={templateType.id} className="space-y-4">
            {/* Add Template Form */}
            <Card className="p-4 bg-primary/5 border-primary/20">
              <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Create {templateType.name}
              </h4>
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor={`subject-${templateType.id}`}>Subject / Title *</Label>
                  <Input
                    id={`subject-${templateType.id}`}
                    value={newTemplate.type === templateType.id ? newTemplate.subject : ''}
                    onChange={(e) => setNewTemplate({ type: templateType.id, subject: e.target.value, body: newTemplate.body })}
                    placeholder="Enter subject line"
                    data-testid={`input-subject-${templateType.id}`}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`body-${templateType.id}`}>Message Body *</Label>
                  <Textarea
                    id={`body-${templateType.id}`}
                    value={newTemplate.type === templateType.id ? newTemplate.body : ''}
                    onChange={(e) => setNewTemplate({ type: templateType.id, subject: newTemplate.subject, body: e.target.value })}
                    placeholder="Use {{variables}} for dynamic content: {{company_name}}, {{crisis_name}}, {{date}}, {{executive_name}}, etc."
                    rows={8}
                    data-testid={`textarea-body-${templateType.id}`}
                  />
                  <p className="text-xs text-muted-foreground">
                    💡 Tip: Use double curly braces &#x7B;&#x7B;variable_name&#x7D;&#x7D; for content that changes per situation
                  </p>
                </div>

                <Button
                  onClick={addTemplate}
                  className="w-full"
                  disabled={!newTemplate.subject || !newTemplate.body || newTemplate.type !== templateType.id}
                  data-testid={`button-add-template-${templateType.id}`}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add {templateType.name}
                </Button>
              </div>
            </Card>

            {/* Existing Templates */}
            <div className="space-y-2">
              <h5 className="text-sm font-medium">
                Saved Templates ({getTemplatesOfType(templateType.id).length})
              </h5>
              {getTemplatesOfType(templateType.id).map((template: any, index: number) => {
                const globalIndex = templates.indexOf(template);
                return (
                  <Card key={globalIndex} className="p-3" data-testid={`template-${templateType.id}-${index}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-sm mb-1">{template.subject}</div>
                        <div className="text-xs text-muted-foreground line-clamp-2">{template.body}</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTemplate(globalIndex)}
                        data-testid={`button-remove-template-${globalIndex}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
