// Scenario-Specific Data Models for Dynamic Forms
// Defines what data each scenario needs and how to source it

export type FieldType = 
  | 'text' 
  | 'textarea'
  | 'number' 
  | 'date'
  | 'select' 
  | 'multi-select'
  | 'stakeholder-list' 
  | 'file-upload'
  | 'url'
  | 'email'
  | 'phone';

export type DataSourceType = 
  | 'active-directory' 
  | 'jira' 
  | 'slack' 
  | 'google-calendar'
  | 'salesforce'
  | 'hubspot'
  | 'manual'
  | 'csv-import';

export interface DataSourceMapping {
  integrationId?: string; // UUID of connected integration
  integrationType: DataSourceType;
  endpoint?: string; // API endpoint to query
  queryPath?: string; // JSONPath to extract data
  transformFunction?: string; // Name of transform function to apply
  cacheMinutes?: number; // How long to cache this data
}

export interface ValidationRule {
  type: 'required' | 'min-length' | 'max-length' | 'email' | 'url' | 'custom';
  value?: any;
  message: string;
  customValidator?: string; // Name of custom validator function
}

export interface FieldDefinition {
  id: string;
  label: string;
  description?: string;
  type: FieldType;
  required: boolean;
  defaultValue?: any;
  placeholder?: string;
  
  // Data source configuration
  dataSource?: DataSourceMapping;
  allowManualEntry?: boolean; // Can user type instead of importing?
  
  // For select/multi-select fields
  options?: Array<{
    value: string;
    label: string;
  }>;
  
  // Conditional display
  showIf?: {
    fieldId: string;
    operator: 'equals' | 'not-equals' | 'contains';
    value: any;
  };
  
  // Validation
  validations?: ValidationRule[];
  
  // UI hints
  helpText?: string;
  gridColumn?: string; // Tailwind grid column span
}

export interface ScenarioDataModel {
  scenarioType: string;
  version: number;
  displayName: string;
  description: string;
  icon: string; // lucide-react icon name
  
  // Field groups for better UX
  fieldGroups: Array<{
    id: string;
    label: string;
    description?: string;
    fields: FieldDefinition[];
  }>;
  
  // Required integrations for this scenario
  recommendedIntegrations?: Array<{
    type: DataSourceType;
    purpose: string;
    required: boolean;
  }>;
}

// ==========================================
// CRISIS MANAGEMENT SCENARIO
// ==========================================

export const crisisManagementDataModel: ScenarioDataModel = {
  scenarioType: 'crisis-management',
  version: 1,
  displayName: 'Crisis Management',
  description: 'Emergency response coordination and stakeholder management',
  icon: 'AlertTriangle',
  
  recommendedIntegrations: [
    { type: 'active-directory', purpose: 'Import stakeholder directory and org chart', required: true },
    { type: 'slack', purpose: 'Auto-create war room channels and send notifications', required: true },
    { type: 'jira', purpose: 'Create and track response tasks', required: false },
    { type: 'google-calendar', purpose: 'Schedule crisis response meetings', required: false },
  ],
  
  fieldGroups: [
    {
      id: 'crisis-details',
      label: 'Crisis Details',
      description: 'Define the crisis scenario and trigger conditions',
      fields: [
        {
          id: 'crisis-type',
          label: 'Crisis Type',
          type: 'select',
          required: true,
          options: [
            { value: 'security-breach', label: 'Security Breach / Data Leak' },
            { value: 'product-failure', label: 'Product Failure / Recall' },
            { value: 'pr-disaster', label: 'PR Disaster / Brand Crisis' },
            { value: 'executive-departure', label: 'Executive Departure' },
            { value: 'regulatory-violation', label: 'Regulatory Violation' },
            { value: 'supply-chain-disruption', label: 'Supply Chain Disruption' },
            { value: 'financial-crisis', label: 'Financial Crisis' },
            { value: 'natural-disaster', label: 'Natural Disaster / Force Majeure' },
            { value: 'custom', label: 'Custom Crisis Type' },
          ],
          validations: [{ type: 'required', message: 'Crisis type is required' }],
        },
        {
          id: 'crisis-name',
          label: 'Crisis Scenario Name',
          type: 'text',
          required: true,
          placeholder: 'e.g., "Customer Data Breach Response" or "Product Recall Protocol"',
          validations: [
            { type: 'required', message: 'Crisis name is required' },
            { type: 'min-length', value: 5, message: 'Name must be at least 5 characters' },
          ],
        },
        {
          id: 'crisis-description',
          label: 'Description',
          type: 'textarea',
          required: true,
          placeholder: 'Describe the crisis scenario, potential impact, and key considerations...',
          helpText: 'This helps AI understand context for recommendations',
        },
        {
          id: 'severity-level',
          label: 'Severity Level',
          type: 'select',
          required: true,
          options: [
            { value: 'critical', label: 'Critical - Board-level immediate response' },
            { value: 'high', label: 'High - Executive team coordination required' },
            { value: 'medium', label: 'Medium - Department-level response' },
            { value: 'low', label: 'Low - Standard procedures' },
          ],
        },
      ],
    },
    
    {
      id: 'stakeholders',
      label: 'Crisis Response Team',
      description: 'Define who needs to be involved in the response',
      fields: [
        {
          id: 'response-team',
          label: 'Core Response Team',
          type: 'stakeholder-list',
          required: true,
          dataSource: {
            integrationType: 'active-directory',
            endpoint: '/users',
            queryPath: '$.users[*]',
            transformFunction: 'transformADUsers',
            cacheMinutes: 30,
          },
          allowManualEntry: true,
          helpText: 'Import from Active Directory or add manually',
          validations: [
            { type: 'required', message: 'At least one team member required' },
          ],
        },
        {
          id: 'executive-sponsors',
          label: 'Executive Sponsors',
          type: 'stakeholder-list',
          required: true,
          dataSource: {
            integrationType: 'active-directory',
            endpoint: '/users',
            queryPath: '$.users[?(@.level=="executive")]',
            transformFunction: 'transformADUsers',
          },
          helpText: 'C-suite executives who need to be informed/involved',
        },
        {
          id: 'legal-team',
          label: 'Legal Team',
          type: 'stakeholder-list',
          required: false,
          showIf: {
            fieldId: 'crisis-type',
            operator: 'equals',
            value: 'security-breach',
          },
          dataSource: {
            integrationType: 'active-directory',
            endpoint: '/users',
            queryPath: '$.users[?(@.department=="Legal")]',
            transformFunction: 'transformADUsers',
          },
        },
        {
          id: 'pr-team',
          label: 'PR / Communications Team',
          type: 'stakeholder-list',
          required: false,
          dataSource: {
            integrationType: 'active-directory',
            endpoint: '/users',
            queryPath: '$.users[?(@.department=="Communications")]',
            transformFunction: 'transformADUsers',
          },
        },
        {
          id: 'external-contacts',
          label: 'External Contacts',
          type: 'stakeholder-list',
          required: false,
          allowManualEntry: true,
          helpText: 'Board members, advisors, external counsel, PR agencies',
        },
      ],
    },
    
    {
      id: 'communication',
      label: 'Communication Setup',
      description: 'Configure crisis communication channels',
      fields: [
        {
          id: 'slack-channel-name',
          label: 'Crisis War Room Channel',
          type: 'text',
          required: true,
          placeholder: 'e.g., #crisis-2024-10-15',
          helpText: 'Slack channel will be auto-created when crisis is triggered',
          dataSource: {
            integrationType: 'slack',
            endpoint: '/channels/suggest',
            transformFunction: 'generateChannelName',
          },
        },
        {
          id: 'notification-channels',
          label: 'Notification Channels',
          type: 'multi-select',
          required: true,
          options: [
            { value: 'email', label: 'Email' },
            { value: 'slack', label: 'Slack Direct Message' },
            { value: 'sms', label: 'SMS (Twilio)' },
            { value: 'phone', label: 'Phone Call' },
          ],
          defaultValue: ['email', 'slack'],
        },
        {
          id: 'communication-templates',
          label: 'Communication Templates',
          type: 'multi-select',
          required: false,
          options: [
            { value: 'internal-alert', label: 'Internal Alert Template' },
            { value: 'customer-notification', label: 'Customer Notification' },
            { value: 'press-release', label: 'Press Release' },
            { value: 'board-briefing', label: 'Board Briefing' },
            { value: 'stakeholder-update', label: 'Stakeholder Update' },
          ],
          helpText: 'Pre-approved communication templates for rapid deployment',
        },
      ],
    },
    
    {
      id: 'response-tasks',
      label: 'Response Tasks & Timeline',
      description: 'Define tasks that need to be executed during crisis response',
      fields: [
        {
          id: 'task-template',
          label: 'Response Task Template',
          type: 'select',
          required: false,
          options: [
            { value: 'security-breach', label: 'Security Breach Response Tasks' },
            { value: 'product-recall', label: 'Product Recall Tasks' },
            { value: 'pr-crisis', label: 'PR Crisis Tasks' },
            { value: 'custom', label: 'Custom Task List' },
          ],
          helpText: 'Load pre-built task templates or create custom',
        },
        {
          id: 'jira-project',
          label: 'Jira Project (for task tracking)',
          type: 'select',
          required: false,
          dataSource: {
            integrationType: 'jira',
            endpoint: '/projects',
            queryPath: '$.projects[*]',
            transformFunction: 'transformJiraProjects',
          },
          helpText: 'Tasks will be created in this Jira project when activated',
        },
        {
          id: 'response-timeline',
          label: 'Target Response Time',
          type: 'select',
          required: true,
          options: [
            { value: '30min', label: '30 minutes - Critical' },
            { value: '2hr', label: '2 hours - High Priority' },
            { value: '4hr', label: '4 hours - Standard' },
            { value: '24hr', label: '24 hours - Non-Critical' },
          ],
          defaultValue: '4hr',
        },
      ],
    },
    
    {
      id: 'monitoring',
      label: 'AI Monitoring & Triggers',
      description: 'Configure what AI should monitor to detect this crisis',
      fields: [
        {
          id: 'monitoring-sources',
          label: 'Data Sources to Monitor',
          type: 'multi-select',
          required: true,
          options: [
            { value: 'news', label: 'News Feeds' },
            { value: 'social', label: 'Social Media' },
            { value: 'internal-alerts', label: 'Internal Alert Systems' },
            { value: 'security-logs', label: 'Security Logs' },
            { value: 'customer-feedback', label: 'Customer Feedback' },
            { value: 'monitoring-tools', label: 'Monitoring Tools (PagerDuty, etc.)' },
          ],
          defaultValue: ['news', 'internal-alerts'],
        },
        {
          id: 'trigger-keywords',
          label: 'Trigger Keywords',
          type: 'textarea',
          required: false,
          placeholder: 'e.g., "data breach", "security incident", "customer data exposed"',
          helpText: 'AI will alert when these keywords appear in monitored sources',
        },
        {
          id: 'auto-activate',
          label: 'Auto-Activate Playbook',
          type: 'select',
          required: true,
          options: [
            { value: 'manual', label: 'Manual - Require human approval' },
            { value: 'auto-notify', label: 'Auto-notify team, manual activation' },
            { value: 'auto-activate', label: 'Fully automated activation' },
          ],
          defaultValue: 'auto-notify',
          helpText: 'How should M respond when crisis is detected?',
        },
      ],
    },
  ],
};

// ==========================================
// PRODUCT LAUNCH SCENARIO
// ==========================================

export const productLaunchDataModel: ScenarioDataModel = {
  scenarioType: 'product-launch',
  version: 1,
  displayName: 'Product Launch',
  description: 'Go-to-market coordination across product, marketing, and sales teams',
  icon: 'Rocket',
  
  recommendedIntegrations: [
    { type: 'jira', purpose: 'Track launch tasks and dependencies', required: true },
    { type: 'salesforce', purpose: 'Manage sales enablement and pipeline', required: false },
    { type: 'slack', purpose: 'Coordinate cross-functional teams', required: true },
  ],
  
  fieldGroups: [
    {
      id: 'product-details',
      label: 'Product Details',
      fields: [
        {
          id: 'product-name',
          label: 'Product Name',
          type: 'text',
          required: true,
          placeholder: 'e.g., "AI Analytics Pro" or "Enterprise Suite v2.0"',
        },
        {
          id: 'product-type',
          label: 'Product Type',
          type: 'select',
          required: true,
          options: [
            { value: 'new-product', label: 'New Product' },
            { value: 'new-feature', label: 'Major Feature Release' },
            { value: 'version-upgrade', label: 'Version Upgrade' },
            { value: 'service-launch', label: 'New Service' },
          ],
        },
        {
          id: 'target-market',
          label: 'Target Market',
          type: 'multi-select',
          required: true,
          options: [
            { value: 'enterprise', label: 'Enterprise (5000+ employees)' },
            { value: 'mid-market', label: 'Mid-Market (500-5000)' },
            { value: 'smb', label: 'Small Business (<500)' },
            { value: 'consumer', label: 'Consumer/B2C' },
          ],
        },
        {
          id: 'launch-date',
          label: 'Target Launch Date',
          type: 'date',
          required: true,
          helpText: 'When do you plan to announce/release?',
        },
      ],
    },
    
    {
      id: 'gtm-team',
      label: 'Go-To-Market Team',
      fields: [
        {
          id: 'product-lead',
          label: 'Product Lead',
          type: 'stakeholder-list',
          required: true,
          dataSource: {
            integrationType: 'active-directory',
            endpoint: '/users',
            queryPath: '$.users[?(@.department=="Product")]',
          },
        },
        {
          id: 'marketing-team',
          label: 'Marketing Team',
          type: 'stakeholder-list',
          required: true,
          dataSource: {
            integrationType: 'active-directory',
            endpoint: '/users',
            queryPath: '$.users[?(@.department=="Marketing")]',
          },
        },
        {
          id: 'sales-team',
          label: 'Sales Team',
          type: 'stakeholder-list',
          required: false,
          dataSource: {
            integrationType: 'salesforce',
            endpoint: '/users',
            queryPath: '$.users[?(@.role=="Sales")]',
          },
        },
      ],
    },
    
    {
      id: 'launch-execution',
      label: 'Launch Execution',
      fields: [
        {
          id: 'jira-epic',
          label: 'Jira Epic (for launch tasks)',
          type: 'select',
          required: false,
          dataSource: {
            integrationType: 'jira',
            endpoint: '/epics',
            queryPath: '$.epics[*]',
          },
          helpText: 'Link to existing Jira epic or create new',
        },
        {
          id: 'revenue-target',
          label: 'Revenue Target (First Quarter)',
          type: 'number',
          required: false,
          placeholder: 'e.g., 2000000 for $2M',
          helpText: 'Expected revenue from this launch',
        },
      ],
    },
  ],
};

// ==========================================
// M&A SCENARIO
// ==========================================

export const maDataModel: ScenarioDataModel = {
  scenarioType: 'mergers-acquisitions',
  version: 1,
  displayName: 'Mergers & Acquisitions',
  description: 'Deal execution and integration coordination',
  icon: 'Building2',
  
  recommendedIntegrations: [
    { type: 'salesforce', purpose: 'Track deal pipeline and due diligence', required: false },
    { type: 'jira', purpose: 'Manage integration tasks', required: true },
    { type: 'slack', purpose: 'Confidential deal team communication', required: true },
  ],
  
  fieldGroups: [
    {
      id: 'deal-details',
      label: 'Deal Details',
      fields: [
        {
          id: 'deal-name',
          label: 'Deal Code Name',
          type: 'text',
          required: true,
          placeholder: 'e.g., "Project Eagle" (use code names for confidentiality)',
        },
        {
          id: 'target-company',
          label: 'Target Company',
          type: 'text',
          required: true,
        },
        {
          id: 'deal-type',
          label: 'Deal Type',
          type: 'select',
          required: true,
          options: [
            { value: 'acquisition', label: 'Acquisition' },
            { value: 'merger', label: 'Merger' },
            { value: 'joint-venture', label: 'Joint Venture' },
            { value: 'divestiture', label: 'Divestiture' },
          ],
        },
        {
          id: 'deal-value',
          label: 'Deal Value',
          type: 'number',
          required: false,
          placeholder: 'Enter amount in USD',
        },
        {
          id: 'expected-close',
          label: 'Expected Close Date',
          type: 'date',
          required: true,
        },
      ],
    },
    
    {
      id: 'deal-team',
      label: 'Deal Team',
      fields: [
        {
          id: 'deal-lead',
          label: 'Deal Lead',
          type: 'stakeholder-list',
          required: true,
          dataSource: {
            integrationType: 'active-directory',
            endpoint: '/users',
            queryPath: '$.users[?(@.level=="executive")]',
          },
        },
        {
          id: 'legal-team',
          label: 'Legal Team',
          type: 'stakeholder-list',
          required: true,
          dataSource: {
            integrationType: 'active-directory',
            endpoint: '/users',
            queryPath: '$.users[?(@.department=="Legal")]',
          },
        },
        {
          id: 'finance-team',
          label: 'Finance Team',
          type: 'stakeholder-list',
          required: true,
          dataSource: {
            integrationType: 'active-directory',
            endpoint: '/users',
            queryPath: '$.users[?(@.department=="Finance")]',
          },
        },
        {
          id: 'integration-team',
          label: 'Integration Team',
          type: 'stakeholder-list',
          required: false,
          allowManualEntry: true,
          helpText: 'People responsible for post-merger integration',
        },
      ],
    },
  ],
};

// Export all scenario data models
export const scenarioDataModels: Record<string, ScenarioDataModel> = {
  'crisis-management': crisisManagementDataModel,
  'product-launch': productLaunchDataModel,
  'mergers-acquisitions': maDataModel,
};

// Helper to get scenario data model by type
export function getScenarioDataModel(scenarioType: string): ScenarioDataModel | null {
  return scenarioDataModels[scenarioType] || null;
}
