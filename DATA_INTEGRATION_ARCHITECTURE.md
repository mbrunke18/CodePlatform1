# Bastion Data Integration Layer - Architecture

**Purpose**: Transform Bastion from coordination shell → Executive Decision Operations Platform  
**Vision**: Connect all business systems into unified decision engine

---

## 1. Architecture Overview

### Current State (MVP)
```
User Manual Input → Bastion Database → Display in UI
```

### Target State (Platform)
```
External Systems ⟷ Data Integration Layer ⟷ Bastion Core ⟷ AI Intelligence
                            ↓
                  Scenario-Specific Schemas
                            ↓
                     Playbook Engine
                            ↓
                  Execution & Learning
```

---

## 2. Core Components

### A. Data Source Registry
**Purpose**: Catalog of all connected external systems

**Schema**: `enterpriseIntegrations` + `dataSources` (already exists)

**Capabilities**:
- Connection management (OAuth, API keys, webhooks)
- Health monitoring (last sync, error tracking)
- Permission mapping (who can access what data)
- Auto-discovery (scan for available fields/entities)

**UI Components**:
- Integration marketplace (browse available connectors)
- Connection wizard (OAuth flow, API key setup)
- Status dashboard (sync health, error logs)

### B. Scenario Data Models
**Purpose**: Define what data each scenario needs

**Structure**:
```typescript
interface ScenarioDataModel {
  scenarioType: 'crisis' | 'product-launch' | 'ma' | ...;
  requiredFields: Field[];
  optionalFields: Field[];
  dataSources: DataSourceMapping[];
  validationRules: ValidationRule[];
}

interface Field {
  id: string;
  label: string;
  type: 'text' | 'select' | 'multi-select' | 'stakeholder-list' | ...;
  dataSource?: {
    integrationId: string;
    endpoint: string;
    mapping: string; // JSONPath or similar
  };
  defaultValue?: any;
  required: boolean;
}
```

**Examples**:

**Crisis Management Scenario**:
- Stakeholders → Pull from Active Directory
- Communication Channels → Pull from Slack workspace
- Incident History → Pull from PagerDuty/ServiceNow
- Legal Templates → Pull from SharePoint
- Media Contacts → Pull from CRM

**Product Launch Scenario**:
- Product Specs → Pull from Productboard/Aha
- Sales Targets → Pull from Salesforce
- Marketing Assets → Pull from DAM (Brandfolder)
- Launch Timeline → Pull from Jira/Asana
- Competitive Intel → Pull from Crayon/Klue

**M&A Scenario**:
- Deal Details → Pull from data room (Datasite)
- Financial Models → Pull from Excel/Google Sheets
- Legal Requirements → Pull from DealRoom
- Integration Tasks → Pull from Jira
- Stakeholder Directory → Pull from LinkedIn/org chart

### C. Dynamic Form Builder
**Purpose**: Auto-generate forms based on scenario + available data

**Features**:
- **Smart Dropdowns**: Populate from live data
  - Example: "Select stakeholders" → Query Active Directory → Show dropdown
- **Pre-fill Logic**: Use historical data or defaults
  - Example: "Last crisis team" → Auto-populate from previous playbook
- **Conditional Fields**: Show/hide based on selections
  - Example: If crisis type = "Security Breach" → Show CISO-specific fields
- **Validation**: Real-time validation against source systems
  - Example: "Legal must be on crisis team" → Enforce in form

**Technical Implementation**:
```typescript
// Backend: Generate form schema
GET /api/scenarios/{scenarioId}/form-schema
→ Returns: {fields, dataSources, validations}

// Frontend: Render dynamic form
<DynamicForm 
  schema={formSchema} 
  dataSources={connectedSources}
  onFieldChange={handleDataSourceQuery}
/>
```

### D. Bi-Directional Sync Engine
**Purpose**: Data flows IN (populate playbooks) and OUT (execute actions)

**Data Flow IN (Preparation)**:
```
External System → API Call → Transform → Bastion DB → Form Display
```

Example:
- User selects "Import stakeholders from Active Directory"
- System queries AD API → Gets user list with roles
- Transforms to Bastion schema → Stores in `stakeholders` JSONB
- Displays in stakeholder matrix UI

**Data Flow OUT (Execution)**:
```
Playbook Activation → Create Tasks → Push to External System → Track Status
```

Example:
- User activates Crisis Response playbook
- System creates 17 tasks → Pushes to Jira (creates tickets)
- Creates Slack channel → Invites stakeholders
- Books conference room → Creates Google Calendar event
- Sends notifications → Via email/SMS/Slack

### E. Data Transformation Layer
**Purpose**: Map external data formats to Bastion schema

**Transformers**:
```typescript
interface DataTransformer {
  sourceType: 'jira' | 'salesforce' | 'active-directory' | ...;
  transform(rawData: any): BastionEntity;
  reverse(bastionData: BastionEntity): ExternalFormat;
}
```

**Examples**:

**Jira Transformer**:
```typescript
// IN: Pull project data
rawJiraProject → {
  title: project.name,
  description: project.description,
  status: mapStatus(project.status),
  assignedTo: findBastionUser(project.lead),
  dueDate: project.dueDate
}

// OUT: Create task
bastionTask → {
  summary: task.description,
  project: config.projectKey,
  issuetype: 'Task',
  assignee: findJiraUser(task.assignedTo),
  duedate: task.dueDate
}
```

**Salesforce Transformer**:
```typescript
// IN: Pull deal data for M&A scenario
rawSFDeal → {
  dealName: opportunity.Name,
  value: opportunity.Amount,
  closeDate: opportunity.CloseDate,
  stakeholders: opportunity.Team__c,
  stage: mapStage(opportunity.StageName)
}
```

---

## 3. Integration Priorities

### Phase 1: Foundation (Weeks 1-2)
Build the framework without specific connectors

**Tasks**:
1. Create Data Source Registry UI
2. Build scenario data model definitions
3. Implement dynamic form builder
4. Test with manual CSV imports

**Deliverable**: Design partners can import stakeholders via CSV, see dynamic forms

### Phase 2: Core Connectors (Weeks 3-4)
Implement top 5 universal integrations

**Priority Integrations**:
1. **Slack** (Communication)
   - Create channels
   - Send messages
   - Invite users
   - Post notifications

2. **Jira** (Task Management) ✅ Replit connector available
   - Create issues
   - Update status
   - Assign tasks
   - Track progress

3. **Google Calendar** (Scheduling) ✅ Replit connector available
   - Create events
   - Invite attendees
   - Book resources
   - Send reminders

4. **HubSpot/Salesforce** (CRM) ✅ HubSpot connector available
   - Pull deal data
   - Get stakeholder lists
   - Update opportunities
   - Track pipeline

5. **Active Directory/Okta** (Identity)
   - Pull org chart
   - Get user directory
   - Map roles
   - Access permissions

### Phase 3: Scenario-Specific (Weeks 5-8)
Add specialized integrations per scenario

**Crisis Management**:
- PagerDuty (incident management)
- Twilio (SMS alerts)
- StatusPage (public communication)

**Product Launch**:
- Productboard (roadmap)
- Intercom (customer feedback)
- Amplitude (analytics)

**M&A**:
- Datasite (data room)
- DocuSign (legal signatures)
- Carta (cap table)

---

## 4. Data Security & Governance

### Authentication Methods
- **OAuth 2.0**: Preferred for SaaS tools (Slack, Google, Salesforce)
- **API Keys**: For tools without OAuth
- **Service Accounts**: For enterprise systems (Active Directory)
- **Webhook Secrets**: For inbound data

### Security Requirements
- **Encryption**: All credentials encrypted at rest (AES-256)
- **Scope Limitation**: Request minimum necessary permissions
- **Token Rotation**: Auto-refresh OAuth tokens
- **Audit Trail**: Log all data access and modifications
- **RBAC**: Role-based access to integrations

### Compliance
- **SOC 2 Type II**: Required for enterprise adoption
- **GDPR**: Handle EU customer data properly
- **CCPA**: California privacy compliance
- **HIPAA**: If healthcare customers need it

---

## 5. Technical Implementation

### Database Schema (Additions)

```typescript
// Scenario Data Models (new table)
export const scenarioDataModels = pgTable('scenario_data_models', {
  id: uuid('id').primaryKey().defaultRandom(),
  scenarioType: varchar('scenario_type', { length: 100 }).notNull(),
  version: integer('version').default(1),
  fieldDefinitions: jsonb('field_definitions').notNull(),
  dataSourceMappings: jsonb('data_source_mappings'),
  validationRules: jsonb('validation_rules'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Integration Credentials (encrypted)
export const integrationCredentials = pgTable('integration_credentials', {
  id: uuid('id').primaryKey().defaultRandom(),
  integrationId: uuid('integration_id').references(() => enterpriseIntegrations.id).notNull(),
  credentialType: varchar('credential_type', { length: 50 }), // 'oauth', 'api_key', 'service_account'
  encryptedData: text('encrypted_data').notNull(), // Encrypted credentials
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Data Sync Jobs (track background syncs)
export const dataSyncJobs = pgTable('data_sync_jobs', {
  id: uuid('id').primaryKey().defaultRandom(),
  integrationId: uuid('integration_id').references(() => enterpriseIntegrations.id).notNull(),
  jobType: varchar('job_type', { length: 50 }), // 'import', 'export', 'sync'
  status: jobStatusEnum('status').default('pending'),
  recordsProcessed: integer('records_processed').default(0),
  errorCount: integer('error_count').default(0),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  errorLog: jsonb('error_log'),
  metadata: jsonb('metadata'),
});
```

### Backend Services

```typescript
// server/services/dataSourceService.ts
class DataSourceService {
  async connectIntegration(type, credentials, config);
  async testConnection(integrationId);
  async syncData(integrationId, dataType);
  async queryData(integrationId, query);
  async pushData(integrationId, data);
  async getAvailableFields(integrationId);
}

// server/services/formBuilderService.ts
class FormBuilderService {
  async getScenarioFormSchema(scenarioType);
  async populateFieldFromSource(fieldId, integrationId);
  async validateFormData(scenarioType, data);
  async saveFormWithSourceMapping(scenarioId, data);
}

// server/services/syncEngine.ts
class SyncEngine {
  async scheduleSync(integrationId, frequency);
  async executeSyncJob(jobId);
  async handleWebhook(integrationId, payload);
  async pushToExternalSystem(integrationId, action, data);
}
```

### API Endpoints

```typescript
// Integration Management
POST   /api/integrations/connect          // Connect new integration
GET    /api/integrations                  // List connected integrations
GET    /api/integrations/:id              // Get integration details
PUT    /api/integrations/:id/config       // Update configuration
DELETE /api/integrations/:id              // Disconnect integration
POST   /api/integrations/:id/test         // Test connection
POST   /api/integrations/:id/sync         // Trigger manual sync

// Data Source Operations
GET    /api/data-sources/:id/fields       // Get available fields
POST   /api/data-sources/:id/query        // Query data
POST   /api/data-sources/:id/push         // Push data

// Dynamic Forms
GET    /api/scenarios/:type/form-schema   // Get form schema for scenario type
POST   /api/scenarios/:id/populate-field  // Populate specific field from source
POST   /api/scenarios/:id/validate        // Validate form data

// Webhook Receivers
POST   /api/webhooks/:integrationId       // Receive webhook from external system
```

### Frontend Components

```typescript
// Integration Marketplace
<IntegrationMarketplace 
  availableIntegrations={connectors}
  onConnect={handleConnect}
/>

// Connection Wizard
<ConnectionWizard 
  integrationType="jira"
  onComplete={handleConnectionComplete}
/>

// Dynamic Form with Data Sources
<DynamicScenarioForm 
  scenarioType="crisis"
  dataSources={connectedIntegrations}
  onSubmit={handleSubmit}
/>

// Data Source Field Picker
<DataSourceFieldPicker 
  field={fieldDef}
  integration={integration}
  onSelect={handleFieldMapping}
/>
```

---

## 6. User Experience Flow

### Design Partner Onboarding (Week 1)

**Step 1: Discover Integrations**
```
Dashboard → "Connect Your Tools" → Integration Marketplace
→ Shows: Jira, Slack, Google Calendar, Active Directory, etc.
→ Status: "Not Connected" | "Connected" | "Available"
```

**Step 2: Connect First Integration (Jira)**
```
Click "Connect Jira" → OAuth flow
→ Authorize Bastion → Select Jira project
→ Map fields: "Bastion Tasks" ↔ "Jira Issues"
→ Test connection → Success!
```

**Step 3: Build Crisis Playbook with Real Data**
```
Create Scenario → "Crisis Management"
→ Stakeholders field shows: "Import from Active Directory" button
→ Click import → Select users → Auto-populate
→ Communication channels: "Import from Slack" → Select channels
→ Tasks: "Will create in Jira on activation"
→ Save playbook
```

**Step 4: Activate Playbook (Execution)**
```
Trigger detected → "Activate Crisis Playbook"
→ System automatically:
  - Creates Slack channel (#crisis-2024-10-15)
  - Invites stakeholders to Slack
  - Creates 17 Jira tickets
  - Books conference room in Google Calendar
  - Sends email/SMS notifications
→ War Room dashboard shows real-time status
```

### Value Demonstration

**Before Data Integration**:
- User types 20 stakeholder names manually
- User creates Slack channel manually
- User creates Jira tickets one-by-one
- User sends emails individually
- **Time**: 2 hours of manual work

**After Data Integration**:
- Click "Import stakeholders" → 20 people auto-populated
- Click "Activate" → Slack channel created automatically
- System creates all Jira tickets in 30 seconds
- Notifications sent to all stakeholders instantly
- **Time**: 2 minutes

**ROI**: 98% time savings on coordination

---

## 7. Technical Challenges & Solutions

### Challenge 1: API Rate Limits
**Problem**: Salesforce allows 5,000 API calls/day, we might exceed

**Solution**:
- Caching layer (Redis)
- Batch operations where possible
- Webhook-based updates (push vs. pull)
- Queue system for non-urgent syncs

### Challenge 2: Data Staleness
**Problem**: Active Directory updated, Bastion has old org chart

**Solutions**:
- Real-time webhooks (when available)
- Incremental sync (only changes, not full refresh)
- TTL-based cache invalidation
- Manual "Refresh now" button

### Challenge 3: Schema Mapping Complexity
**Problem**: Every Jira instance has custom fields

**Solutions**:
- Field auto-discovery during setup
- Smart mapping suggestions (AI-powered)
- Custom mapping UI (drag-and-drop)
- Template library for common setups

### Challenge 4: Authentication Failures
**Problem**: OAuth tokens expire, API keys revoked

**Solutions**:
- Auto-refresh tokens before expiry
- Graceful degradation (show cached data)
- Admin alerts for auth failures
- Re-auth flow without losing config

---

## 8. Success Metrics

### Integration Health
- **Connection Uptime**: >99.5% availability
- **Sync Success Rate**: >95% successful syncs
- **API Error Rate**: <1% API call failures
- **Data Freshness**: <5 minute lag for critical data

### User Adoption
- **Integrations Per Customer**: Target 5+ connected systems
- **Data Import Usage**: 80% of playbooks use imported data
- **Manual Entry Reduction**: 75% decrease in manual typing
- **Time Savings**: 85% reduction in playbook setup time

### Business Impact
- **Design Partner Satisfaction**: "Data integration is game-changing"
- **Reference Story**: "Connected 8 systems, reduced crisis response from 72 hours to 4 hours"
- **Expansion Revenue**: Customers add integrations = upsell opportunity

---

## 9. Phase 1 Implementation Checklist

### Week 1-2: Foundation
- [ ] Create scenario data model definitions (Crisis, Launch, M&A)
- [ ] Build Data Source Registry UI
- [ ] Implement CSV import for manual data
- [ ] Test dynamic form generation

### Week 3-4: Core Connectors
- [ ] Set up Replit Jira connector
- [ ] Set up Replit Google Calendar connector
- [ ] Build custom Slack integration (API-based)
- [ ] Set up Replit HubSpot connector
- [ ] Test bi-directional sync

### Week 5-6: Design Partner Testing
- [ ] Connect design partner's Jira/Slack/Calendar
- [ ] Import their stakeholders from Active Directory
- [ ] Build crisis playbook with their real data
- [ ] Execute playbook → create real Jira tickets, Slack channels
- [ ] Measure time savings vs. manual approach

### Week 7-8: Refinement & Expansion
- [ ] Fix bugs from design partner testing
- [ ] Add 2nd scenario (Product Launch or Compliance)
- [ ] Build custom connector for design partner's unique tool
- [ ] Document integration setup for other customers

---

## 10. Long-Term Vision

### Platform Maturity (Months 6-12)

**Integration Ecosystem**:
- 50+ pre-built connectors
- Custom connector SDK for partners
- Integration marketplace (3rd party developers)
- Zapier/Make.com-style workflow builder

**AI-Powered Automation**:
- AI suggests which data to import based on scenario
- Auto-mapping: AI figures out field mappings
- Anomaly detection: AI spots data quality issues
- Predictive sync: AI predicts when data will be needed

**Enterprise Features**:
- Multi-region data residency
- Customer-managed encryption keys
- Audit logs for compliance
- SLA guarantees for integrations

---

## Final Thought

**This data integration layer transforms Bastion from a "pretty coordination tool" into "enterprise infrastructure."**

Without it: Bastion is PowerPoint  
With it: Bastion is the operating system for strategic decisions

**This is the moat. This is the category. This is Executive Decision Operations.**
