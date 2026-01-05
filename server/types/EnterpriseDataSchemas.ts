/**
 * M Enterprise Data Schemas
 * Comprehensive TypeScript interfaces for 12 enterprise system integrations
 * Used for real-time trigger monitoring and bi-directional playbook execution
 */

// ============================================================================
// SALESFORCE CRM - Customer Relationship Management
// ============================================================================

export interface SalesforceOpportunity {
  Id: string;
  Name: string;
  AccountId: string;
  Amount: number;
  StageName: 'Prospecting' | 'Qualification' | 'Proposal/Price Quote' | 'Negotiation/Review' | 'Closed Won' | 'Closed Lost';
  Probability: number; // 0-100
  CloseDate: string; // ISO date
  ForecastCategory: 'Omitted' | 'Pipeline' | 'BestCase' | 'Commit' | 'Closed';
  Type: 'New Business' | 'Existing Customer - Upgrade' | 'Existing Customer - Replacement' | 'Existing Customer - Downgrade';
  LeadSource: string;
  OwnerId: string;
  IsClosed: boolean;
  IsWon: boolean;
  ExpectedRevenue: number;
  CreatedDate: string;
  LastModifiedDate: string;
}

export interface SalesforceAccount {
  Id: string;
  Name: string;
  Type: 'Customer - Direct' | 'Customer - Channel' | 'Prospect' | 'Partner' | 'Other';
  Industry: string;
  AnnualRevenue: number;
  NumberOfEmployees: number;
  BillingCountry: string;
  BillingState: string;
  OwnerId: string;
  AccountNumber: string;
  CreatedDate: string;
  LastModifiedDate: string;
}

export interface SalesforceContact {
  Id: string;
  AccountId: string;
  FirstName: string;
  LastName: string;
  Email: string;
  Title: string;
  Phone: string;
  MobilePhone: string;
  LeadSource: string;
  CreatedDate: string;
  LastModifiedDate: string;
}

export interface SalesforceTask {
  Id: string;
  Subject: string;
  ActivityDate: string; // YYYY-MM-DD
  Priority: 'High' | 'Normal' | 'Low';
  Status: 'Not Started' | 'In Progress' | 'Completed' | 'Waiting on someone else' | 'Deferred';
  WhoId: string; // Contact/Lead ID
  WhatId: string; // Account/Opportunity ID
  OwnerId: string;
  Description: string;
  CreatedDate: string;
}

// ============================================================================
// SERVICENOW ITSM - IT Service Management
// ============================================================================

export interface ServiceNowIncident {
  sys_id: string;
  number: string; // INC0000001
  short_description: string;
  description: string;
  priority: '1' | '2' | '3' | '4' | '5'; // 1=Critical, 5=Planning
  urgency: '1' | '2' | '3'; // 1=High, 3=Low
  impact: '1' | '2' | '3'; // 1=High, 3=Low
  state: '1' | '2' | '3' | '6' | '7'; // 1=New, 2=In Progress, 3=On Hold, 6=Resolved, 7=Closed
  category: 'Hardware' | 'Software' | 'Network' | 'Database' | 'Inquiry / Help';
  subcategory: string;
  assigned_to: {
    link: string;
    value: string;
  };
  assignment_group: {
    link: string;
    value: string;
  };
  opened_at: string;
  resolved_at: string | null;
  closed_at: string | null;
  business_service: string;
  affected_user: {
    link: string;
    value: string;
  };
  resolution_notes: string;
  sys_created_on: string;
  sys_updated_on: string;
}

export interface ServiceNowChangeRequest {
  sys_id: string;
  number: string; // CHG0000001
  short_description: string;
  description: string;
  type: 'normal' | 'standard' | 'emergency';
  risk: 'high' | 'medium' | 'low';
  impact: '1' | '2' | '3';
  priority: '1' | '2' | '3' | '4';
  state: '-5' | '-4' | '-3' | '-2' | '-1' | '0' | '1' | '2' | '3' | '4'; // New to Closed
  category: string;
  assigned_to: {
    link: string;
    value: string;
  };
  approval: 'not requested' | 'requested' | 'approved' | 'rejected';
  start_date: string;
  end_date: string;
  work_start: string;
  work_end: string;
  business_service: string;
  implementation_plan: string;
  backout_plan: string;
  test_plan: string;
  sys_created_on: string;
  sys_updated_on: string;
}

export interface ServiceNowCatalogTask {
  sys_id: string;
  number: string; // SCTASK0000001
  short_description: string;
  description: string;
  state: '1' | '2' | '3' | '4' | '7'; // Open, Work in Progress, Closed Complete, Closed Incomplete, Closed Skipped
  priority: '1' | '2' | '3' | '4' | '5';
  assigned_to: {
    link: string;
    value: string;
  };
  request_item: {
    link: string;
    value: string;
  };
  due_date: string;
  opened_at: string;
  closed_at: string | null;
}

// ============================================================================
// JIRA PROJECT MANAGEMENT - Agile/Kanban Boards
// ============================================================================

export interface JiraIssue {
  id: string;
  key: string; // PROJ-123
  self: string;
  fields: {
    summary: string;
    description: any; // Atlassian Document Format
    issuetype: {
      id: string;
      name: 'Story' | 'Bug' | 'Task' | 'Epic' | 'Sub-task' | 'Initiative';
      subtask: boolean;
    };
    status: {
      id: string;
      name: string; // 'To Do', 'In Progress', 'In Review', 'Done'
      statusCategory: {
        key: 'new' | 'indeterminate' | 'done';
      };
    };
    priority: {
      id: string;
      name: 'Highest' | 'High' | 'Medium' | 'Low' | 'Lowest';
    };
    assignee: {
      accountId: string;
      displayName: string;
      emailAddress: string;
      avatarUrls: Record<string, string>;
    } | null;
    reporter: {
      accountId: string;
      displayName: string;
      emailAddress: string;
    };
    project: {
      id: string;
      key: string;
      name: string;
    };
    labels: string[];
    created: string;
    updated: string;
    duedate: string | null;
    resolution: {
      id: string;
      name: string;
    } | null;
    customfield_10016: number | null; // Story Points
    sprint: {
      id: number;
      name: string;
      state: 'active' | 'closed' | 'future';
      startDate: string;
      endDate: string;
    } | null;
  };
}

export interface JiraProject {
  id: string;
  key: string;
  name: string;
  projectTypeKey: 'software' | 'business' | 'service_desk';
  lead: {
    accountId: string;
    displayName: string;
    emailAddress: string;
  };
  description: string;
  url: string;
  assigneeType: 'PROJECT_LEAD' | 'UNASSIGNED';
  avatarUrls: Record<string, string>;
}

export interface JiraSprint {
  id: number;
  self: string;
  state: 'active' | 'closed' | 'future';
  name: string;
  startDate: string;
  endDate: string;
  completeDate: string | null;
  originBoardId: number;
  goal: string;
}

// ============================================================================
// SLACK COMMUNICATIONS - Team Messaging
// ============================================================================

export interface SlackChannel {
  id: string; // C1234567890
  name: string;
  is_channel: boolean;
  is_group: boolean;
  is_im: boolean;
  is_private: boolean;
  is_archived: boolean;
  is_general: boolean;
  is_shared: boolean;
  is_ext_shared: boolean;
  is_org_shared: boolean;
  num_members: number;
  topic: {
    value: string;
    creator: string;
    last_set: number;
  };
  purpose: {
    value: string;
    creator: string;
    last_set: number;
  };
  created: number; // Unix timestamp
  creator: string;
}

export interface SlackMessage {
  type: 'message';
  subtype?: string;
  text: string;
  user: string; // U1234567890
  ts: string; // "1234567890.123456"
  channel: string;
  thread_ts?: string;
  reply_count?: number;
  reply_users_count?: number;
  latest_reply?: string;
  reactions?: Array<{
    name: string;
    count: number;
    users: string[];
  }>;
  attachments?: Array<{
    fallback: string;
    color: string;
    pretext: string;
    text: string;
    fields: Array<{
      title: string;
      value: string;
      short: boolean;
    }>;
  }>;
}

export interface SlackUser {
  id: string; // U1234567890
  team_id: string;
  name: string;
  deleted: boolean;
  color: string;
  real_name: string;
  tz: string;
  tz_label: string;
  tz_offset: number;
  profile: {
    avatar_hash: string;
    status_text: string;
    status_emoji: string;
    real_name: string;
    display_name: string;
    real_name_normalized: string;
    display_name_normalized: string;
    email: string;
    image_24: string;
    image_32: string;
    image_48: string;
    image_72: string;
    image_192: string;
    image_512: string;
    team: string;
    title: string;
    phone: string;
  };
  is_admin: boolean;
  is_owner: boolean;
  is_primary_owner: boolean;
  is_restricted: boolean;
  is_ultra_restricted: boolean;
  is_bot: boolean;
  updated: number;
}

// ============================================================================
// HUBSPOT CRM - Marketing & Sales Automation
// ============================================================================

export interface HubSpotContact {
  id: string;
  properties: {
    createdate: string;
    email: string;
    firstname: string;
    lastname: string;
    lastmodifieddate: string;
    phone: string;
    company: string;
    jobtitle: string;
    website: string;
    lifecyclestage: 'subscriber' | 'lead' | 'marketingqualifiedlead' | 'salesqualifiedlead' | 'opportunity' | 'customer' | 'evangelist' | 'other';
    hs_lead_status: string;
    hs_persona: string;
    city: string;
    state: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
  archived: boolean;
}

export interface HubSpotDeal {
  id: string;
  properties: {
    dealname: string;
    amount: string;
    dealstage: string; // Pipeline stage IDs
    pipeline: string;
    closedate: string;
    createdate: string;
    hs_forecast_amount: string;
    hs_forecast_probability: string;
    hs_analytics_source: string;
    hs_deal_stage_probability: string;
    hubspot_owner_id: string;
    dealtype: 'newbusiness' | 'existingbusiness' | 'renewal';
  };
  createdAt: string;
  updatedAt: string;
  archived: boolean;
}

export interface HubSpotCompany {
  id: string;
  properties: {
    name: string;
    domain: string;
    industry: string;
    annualrevenue: string;
    numberofemployees: string;
    city: string;
    state: string;
    country: string;
    createdate: string;
    hs_lastmodifieddate: string;
    hubspot_owner_id: string;
  };
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// GOOGLE WORKSPACE - Calendar, Gmail, Drive
// ============================================================================

export interface GoogleCalendarEvent {
  kind: 'calendar#event';
  id: string;
  status: 'confirmed' | 'tentative' | 'cancelled';
  htmlLink: string;
  created: string;
  updated: string;
  summary: string;
  description: string;
  location: string;
  creator: {
    email: string;
    displayName: string;
    self: boolean;
  };
  organizer: {
    email: string;
    displayName: string;
    self: boolean;
  };
  start: {
    date?: string; // YYYY-MM-DD for all-day events
    dateTime?: string; // RFC3339 for timed events
    timeZone: string;
  };
  end: {
    date?: string;
    dateTime?: string;
    timeZone: string;
  };
  recurrence?: string[]; // RRULE
  attendees?: Array<{
    email: string;
    displayName: string;
    organizer?: boolean;
    self?: boolean;
    resource?: boolean;
    optional?: boolean;
    responseStatus: 'needsAction' | 'declined' | 'tentative' | 'accepted';
    comment?: string;
  }>;
  conferenceData?: {
    createRequest?: any;
    entryPoints: Array<{
      entryPointType: 'video' | 'phone' | 'sip' | 'more';
      uri: string;
      label?: string;
      pin?: string;
      accessCode?: string;
      meetingCode?: string;
      passcode?: string;
      password?: string;
    }>;
    conferenceSolution: {
      key: {
        type: string;
      };
      name: string;
      iconUri: string;
    };
    conferenceId: string;
  };
  reminders: {
    useDefault: boolean;
    overrides?: Array<{
      method: 'email' | 'popup';
      minutes: number;
    }>;
  };
}

export interface GmailMessage {
  id: string;
  threadId: string;
  labelIds: string[];
  snippet: string; // First 200 characters
  historyId: string;
  internalDate: string; // Unix timestamp in milliseconds
  payload: {
    partId: string;
    mimeType: string;
    filename: string;
    headers: Array<{
      name: string;
      value: string;
    }>;
    body: {
      attachmentId?: string;
      size: number;
      data?: string; // Base64url encoded
    };
    parts?: any[];
  };
  sizeEstimate: number;
  raw?: string; // Base64url encoded email
}

// ============================================================================
// MICROSOFT 365 - Teams, Outlook, SharePoint
// ============================================================================

export interface MicrosoftTeamsChannel {
  id: string;
  createdDateTime: string;
  displayName: string;
  description: string;
  email: string;
  webUrl: string;
  membershipType: 'standard' | 'private' | 'shared';
}

export interface MicrosoftTeamsMessage {
  id: string;
  replyToId: string | null;
  etag: string;
  messageType: 'message';
  createdDateTime: string;
  lastModifiedDateTime: string;
  lastEditedDateTime: string | null;
  deletedDateTime: string | null;
  subject: string | null;
  summary: string | null;
  chatId: string | null;
  importance: 'normal' | 'high' | 'urgent';
  locale: string;
  webUrl: string;
  from: {
    application: any | null;
    device: any | null;
    user: {
      id: string;
      displayName: string;
      userIdentityType: 'aadUser' | 'onPremiseAadUser' | 'anonymousGuest' | 'federatedUser' | 'personalMicrosoftAccountUser' | 'skypeUser' | 'phoneUser';
    };
  };
  body: {
    contentType: 'text' | 'html';
    content: string;
  };
  attachments: Array<{
    id: string;
    contentType: string;
    contentUrl: string;
    content: string;
    name: string;
    thumbnailUrl: string;
  }>;
  mentions: Array<{
    id: number;
    mentionText: string;
    mentioned: {
      user: {
        id: string;
        displayName: string;
        userIdentityType: string;
      };
    };
  }>;
  reactions: Array<{
    reactionType: 'like' | 'angry' | 'sad' | 'laugh' | 'heart' | 'surprised';
    createdDateTime: string;
    user: {
      user: {
        id: string;
        displayName: string;
      };
    };
  }>;
}

export interface OutlookCalendarEvent {
  id: string;
  createdDateTime: string;
  lastModifiedDateTime: string;
  changeKey: string;
  categories: string[];
  transactionId: string;
  originalStartTimeZone: string;
  originalEndTimeZone: string;
  iCalUId: string;
  reminderMinutesBeforeStart: number;
  isReminderOn: boolean;
  hasAttachments: boolean;
  subject: string;
  bodyPreview: string;
  importance: 'low' | 'normal' | 'high';
  sensitivity: 'normal' | 'personal' | 'private' | 'confidential';
  isAllDay: boolean;
  isCancelled: boolean;
  isOrganizer: boolean;
  responseRequested: boolean;
  seriesMasterId: string | null;
  showAs: 'free' | 'tentative' | 'busy' | 'oof' | 'workingElsewhere' | 'unknown';
  type: 'singleInstance' | 'occurrence' | 'exception' | 'seriesMaster';
  webLink: string;
  onlineMeetingUrl: string | null;
  isOnlineMeeting: boolean;
  onlineMeetingProvider: 'teamsForBusiness' | 'skypeForBusiness' | 'skypeForConsumer' | 'unknown';
  allowNewTimeProposals: boolean;
  recurrence: any | null;
  responseStatus: {
    response: 'none' | 'organizer' | 'tentativelyAccepted' | 'accepted' | 'declined' | 'notResponded';
    time: string;
  };
  body: {
    contentType: 'text' | 'html';
    content: string;
  };
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  location: {
    displayName: string;
    locationType: 'default' | 'conferenceRoom' | 'homeAddress' | 'businessAddress' | 'geoCoordinates' | 'streetAddress' | 'hotel' | 'restaurant' | 'localBusiness' | 'postalAddress';
    uniqueId: string;
    uniqueIdType: 'unknown' | 'locationStore' | 'directory' | 'private' | 'bing';
    address: {
      street: string;
      city: string;
      state: string;
      countryOrRegion: string;
      postalCode: string;
    };
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  locations: any[];
  attendees: Array<{
    type: 'required' | 'optional' | 'resource';
    status: {
      response: 'none' | 'organizer' | 'tentativelyAccepted' | 'accepted' | 'declined' | 'notResponded';
      time: string;
    };
    emailAddress: {
      name: string;
      address: string;
    };
  }>;
  organizer: {
    emailAddress: {
      name: string;
      address: string;
    };
  };
}

// ============================================================================
// AWS CLOUDWATCH - Infrastructure Monitoring
// ============================================================================

export interface CloudWatchMetricDataResult {
  Id: string;
  Label: string;
  Timestamps: string[];
  Values: number[];
  StatusCode: 'Complete' | 'InternalError' | 'PartialData';
  Messages?: Array<{
    Code: string;
    Value: string;
  }>;
}

export interface CloudWatchMetricAlarm {
  AlarmName: string;
  AlarmArn: string;
  AlarmDescription: string;
  AlarmConfigurationUpdatedTimestamp: string;
  ActionsEnabled: boolean;
  OKActions: string[];
  AlarmActions: string[];
  InsufficientDataActions: string[];
  StateValue: 'OK' | 'ALARM' | 'INSUFFICIENT_DATA';
  StateReason: string;
  StateReasonData: string;
  StateUpdatedTimestamp: string;
  MetricName: string;
  Namespace: string; // 'AWS/EC2', 'AWS/RDS', 'AWS/Lambda', 'AWS/ECS'
  Statistic: 'SampleCount' | 'Average' | 'Sum' | 'Minimum' | 'Maximum';
  ExtendedStatistic: string;
  Dimensions: Array<{
    Name: string;
    Value: string;
  }>;
  Period: number; // Seconds
  Unit: 'Seconds' | 'Microseconds' | 'Milliseconds' | 'Bytes' | 'Kilobytes' | 'Megabytes' | 'Gigabytes' | 'Terabytes' | 'Bits' | 'Kilobits' | 'Megabits' | 'Gigabits' | 'Terabits' | 'Percent' | 'Count' | 'Bytes/Second' | 'Kilobytes/Second' | 'Megabytes/Second' | 'Gigabytes/Second' | 'Terabytes/Second' | 'Bits/Second' | 'Kilobits/Second' | 'Megabits/Second' | 'Gigabits/Second' | 'Terabits/Second' | 'Count/Second' | 'None';
  EvaluationPeriods: number;
  DatapointsToAlarm: number;
  Threshold: number;
  ComparisonOperator: 'GreaterThanOrEqualToThreshold' | 'GreaterThanThreshold' | 'LessThanThreshold' | 'LessThanOrEqualToThreshold' | 'LessThanLowerOrGreaterThanUpperThreshold' | 'LessThanLowerThreshold' | 'GreaterThanUpperThreshold';
  TreatMissingData: string;
  EvaluateLowSampleCountPercentile: string;
}

// ============================================================================
// WORKDAY HCM - Human Capital Management
// ============================================================================

export interface WorkdayWorker {
  Worker_ID: string;
  Employee_ID: string;
  First_Name: string;
  Last_Name: string;
  Legal_Name: string;
  Preferred_Name: string;
  Email_Address: string;
  Work_Email: string;
  Phone: string;
  Mobile_Phone: string;
  Job_Title: string;
  Business_Title: string;
  Management_Level: string;
  Department: string;
  Division: string;
  Cost_Center: string;
  Manager_ID: string;
  Manager_Name: string;
  Location: string;
  Time_Zone: string;
  Hire_Date: string;
  Original_Hire_Date: string;
  Employment_Status: 'Active' | 'Leave of Absence' | 'Terminated';
  Employee_Type: 'Regular' | 'Contractor' | 'Temporary' | 'Intern';
  Full_Time_Equivalent: number;
  Annual_Salary: number;
  Hourly_Rate: number;
  Currency: string;
  Pay_Rate_Type: 'Salary' | 'Hourly';
}

export interface WorkdayJobRequisition {
  Requisition_ID: string;
  Job_Posting_Title: string;
  Job_Family: string;
  Management_Level: string;
  Department: string;
  Location: string;
  Hiring_Manager: string;
  Recruiter: string;
  Status: 'Open' | 'Filled' | 'Closed' | 'Cancelled' | 'On Hold';
  Target_Start_Date: string;
  Number_of_Openings: number;
  Filled_Openings: number;
  Priority: 'High' | 'Medium' | 'Low';
  Created_Date: string;
  Last_Updated_Date: string;
}

// ============================================================================
// OKTA IDENTITY - Single Sign-On & Security
// ============================================================================

export interface OktaUser {
  id: string;
  status: 'STAGED' | 'PROVISIONED' | 'ACTIVE' | 'RECOVERY' | 'PASSWORD_EXPIRED' | 'LOCKED_OUT' | 'SUSPENDED' | 'DEPROVISIONED';
  created: string;
  activated: string;
  statusChanged: string;
  lastLogin: string;
  lastUpdated: string;
  passwordChanged: string;
  type: {
    id: string;
  };
  profile: {
    firstName: string;
    lastName: string;
    mobilePhone: string;
    secondEmail: string;
    login: string;
    email: string;
    department: string;
    manager: string;
    managerId: string;
    employeeNumber: string;
    costCenter: string;
    organization: string;
    division: string;
    title: string;
  };
  credentials: {
    password: {};
    recovery_question: {
      question: string;
    };
    provider: {
      type: string;
      name: string;
    };
  };
  _links: Record<string, any>;
}

export interface OktaSystemLogEvent {
  uuid: string;
  published: string;
  eventType: string; // 'user.session.start', 'user.authentication.sso', 'application.user_membership.add'
  version: string;
  severity: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
  legacyEventType: string;
  displayMessage: string;
  actor: {
    id: string;
    type: string;
    alternateId: string;
    displayName: string;
    detailEntry: any;
  };
  client: {
    userAgent: {
      rawUserAgent: string;
      os: string;
      browser: string;
    };
    geographicalContext: {
      city: string;
      state: string;
      country: string;
      postalCode: string;
      geolocation: {
        lat: number;
        lon: number;
      };
    };
    zone: string;
    ipAddress: string;
    device: string;
    id: string;
  };
  outcome: {
    result: 'SUCCESS' | 'FAILURE' | 'SKIPPED' | 'ALLOW' | 'DENY' | 'CHALLENGE' | 'UNKNOWN';
    reason: string;
  };
  target: Array<{
    id: string;
    type: string;
    alternateId: string;
    displayName: string;
    detailEntry: any;
  }>;
  transaction: {
    type: string;
    id: string;
    detail: Record<string, any>;
  };
  debugContext: {
    debugData: Record<string, any>;
  };
  authenticationContext: {
    authenticationProvider: string;
    credentialProvider: string;
    credentialType: string;
    issuer: any;
    externalSessionId: string;
    interface: string;
  };
  securityContext: {
    asNumber: number;
    asOrg: string;
    isp: string;
    domain: string;
    isProxy: boolean;
  };
}

// ============================================================================
// QUICKBOOKS - Financial Management
// ============================================================================

export interface QuickBooksInvoice {
  Id: string;
  SyncToken: string;
  MetaData: {
    CreateTime: string;
    LastUpdatedTime: string;
  };
  CustomField: Array<{
    DefinitionId: string;
    Name: string;
    Type: string;
    StringValue: string;
  }>;
  DocNumber: string;
  TxnDate: string; // YYYY-MM-DD
  CurrencyRef: {
    value: string;
    name: string;
  };
  Line: Array<{
    Id: string;
    LineNum: number;
    Description: string;
    Amount: number;
    DetailType: 'SalesItemLineDetail' | 'SubTotalLineDetail' | 'DiscountLineDetail';
    SalesItemLineDetail?: {
      ItemRef: {
        value: string;
        name: string;
      };
      UnitPrice: number;
      Qty: number;
      TaxCodeRef: {
        value: string;
      };
    };
  }>;
  TxnTaxDetail: {
    TotalTax: number;
  };
  CustomerRef: {
    value: string;
    name: string;
  };
  CustomerMemo: {
    value: string;
  };
  BillAddr: {
    Line1: string;
    City: string;
    CountrySubDivisionCode: string;
    PostalCode: string;
  };
  ShipAddr: {
    Line1: string;
    City: string;
    CountrySubDivisionCode: string;
    PostalCode: string;
  };
  EmailStatus: 'NotSet' | 'NeedToSend' | 'EmailSent';
  BillEmail: {
    Address: string;
  };
  DueDate: string;
  TotalAmt: number;
  Balance: number; // Unpaid amount
  Deposit: number;
  AllowIPNPayment: boolean;
  AllowOnlinePayment: boolean;
  AllowOnlineCreditCardPayment: boolean;
  AllowOnlineACHPayment: boolean;
}

export interface QuickBooksExpense {
  Id: string;
  SyncToken: string;
  MetaData: {
    CreateTime: string;
    LastUpdatedTime: string;
  };
  TxnDate: string;
  CurrencyRef: {
    value: string;
    name: string;
  };
  Line: Array<{
    Id: string;
    Description: string;
    Amount: number;
    DetailType: 'AccountBasedExpenseLineDetail';
    AccountBasedExpenseLineDetail: {
      AccountRef: {
        value: string;
        name: string;
      };
      BillableStatus: 'Billable' | 'NotBillable' | 'HasBeenBilled';
      TaxCodeRef: {
        value: string;
      };
    };
  }>;
  AccountRef: {
    value: string;
    name: string;
  };
  EntityRef: {
    value: string;
    name: string;
    type: 'Vendor' | 'Employee' | 'Customer';
  };
  TotalAmt: number;
  PaymentType: 'Cash' | 'Check' | 'CreditCard';
}

// ============================================================================
// ACTIVE DIRECTORY - User & Group Management
// ============================================================================

export interface ActiveDirectoryUser {
  id: string;
  deletedDateTime: string | null;
  accountEnabled: boolean;
  ageGroup: string | null;
  businessPhones: string[];
  city: string;
  createdDateTime: string;
  companyName: string;
  consentProvidedForMinor: string | null;
  country: string;
  department: string;
  displayName: string;
  employeeId: string;
  faxNumber: string;
  givenName: string;
  imAddresses: string[];
  jobTitle: string;
  legalAgeGroupClassification: string;
  mail: string;
  mailNickname: string;
  mobilePhone: string;
  officeLocation: string;
  onPremisesDistinguishedName: string;
  onPremisesDomainName: string;
  onPremisesImmutableId: string;
  onPremisesLastSyncDateTime: string;
  onPremisesSecurityIdentifier: string;
  onPremisesSyncEnabled: boolean;
  onPremisesUserPrincipalName: string;
  passwordPolicies: string;
  passwordProfile: {
    forceChangePasswordNextSignIn: boolean;
    forceChangePasswordNextSignInWithMfa: boolean;
    password: string;
  } | null;
  postalCode: string;
  preferredLanguage: string;
  provisionedPlans: Array<{
    capabilityStatus: string;
    provisioningStatus: string;
    service: string;
  }>;
  proxyAddresses: string[];
  refreshTokensValidFromDateTime: string;
  showInAddressList: boolean;
  signInSessionsValidFromDateTime: string;
  state: string;
  streetAddress: string;
  surname: string;
  usageLocation: string;
  userPrincipalName: string;
  userType: 'Member' | 'Guest';
  assignedLicenses: Array<{
    disabledPlans: string[];
    skuId: string;
  }>;
  assignedPlans: Array<{
    assignedDateTime: string;
    capabilityStatus: string;
    service: string;
    servicePlanId: string;
  }>;
}

export interface ActiveDirectoryGroup {
  id: string;
  deletedDateTime: string | null;
  classification: string | null;
  createdDateTime: string;
  creationOptions: string[];
  description: string;
  displayName: string;
  expirationDateTime: string | null;
  groupTypes: string[]; // ['Unified', 'DynamicMembership']
  isAssignableToRole: boolean;
  mail: string;
  mailEnabled: boolean;
  mailNickname: string;
  membershipRule: string | null;
  membershipRuleProcessingState: 'On' | 'Paused' | null;
  onPremisesDomainName: string;
  onPremisesLastSyncDateTime: string;
  onPremisesNetBiosName: string;
  onPremisesSamAccountName: string;
  onPremisesSecurityIdentifier: string;
  onPremisesSyncEnabled: boolean;
  preferredDataLocation: string;
  preferredLanguage: string;
  proxyAddresses: string[];
  renewedDateTime: string;
  resourceBehaviorOptions: string[];
  resourceProvisioningOptions: string[];
  securityEnabled: boolean;
  securityIdentifier: string;
  theme: string | null;
  visibility: 'Private' | 'Public' | 'Hiddenmembership' | null;
  onPremisesProvisioningErrors: any[];
}
