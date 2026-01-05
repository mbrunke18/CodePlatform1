// Comprehensive Scenario Templates for M Executive Decision Operations Platform
// World-class strategic execution and decision readiness templates

export interface ComprehensiveScenarioTemplate {
  id: string;
  name: string;
  category: 'operational' | 'security' | 'financial' | 'regulatory' | 'human-capital' | 'market' | 'supply-chain' | 'technology' | 'strategic';
  description: string;
  likelihood: 'low' | 'medium' | 'high';
  severity: 'minimal' | 'moderate' | 'significant' | 'severe' | 'catastrophic';
  typicalTimeframe: 'immediate' | 'hours' | 'days' | 'weeks' | 'months';
  
  // Enhanced data capture fields
  requiredDataPoints: EnhancedDataPoint[];
  criticalDecisionPoints: string[];
  stakeholderMapping: StakeholderRole[];
  resourceRequirements: ResourceRequirement[];
  successMetrics: string[];
  industrySpecific: boolean;
  applicableIndustries: string[];
  
  // Crisis execution specifics
  responsePhases: ResponsePhase[];
  escalationTriggers: string[];
  communicationPlan: CommunicationStep[];
  recoveryMetrics: string[];
}

export interface EnhancedDataPoint {
  fieldName: string;
  label: string;
  fieldType: 'text' | 'number' | 'select' | 'multiselect' | 'date' | 'currency' | 'percentage' | 'textarea';
  required: boolean;
  placeholder?: string;
  options?: string[];
  validationRules?: string[];
  helpText?: string;
  category: 'situation' | 'organization' | 'resources' | 'timeline' | 'stakeholders' | 'financial' | 'regulatory';
}

export interface StakeholderRole {
  role: string;
  department: string;
  responsibility: string;
  decisionAuthority: 'low' | 'medium' | 'high' | 'critical';
  communicationPriority: 'immediate' | 'hourly' | 'daily';
}

export interface ResourceRequirement {
  resourceType: 'personnel' | 'technology' | 'financial' | 'external' | 'facilities';
  description: string;
  urgency: 'immediate' | 'hours' | 'days' | 'weeks';
  estimatedCost: string;
  alternatives: string[];
}

export interface ResponsePhase {
  phase: 'immediate' | 'short-term' | 'long-term';
  timeline: string;
  objectives: string[];
  keyActions: string[];
  successCriteria: string[];
}

export interface CommunicationStep {
  audience: string;
  timing: string;
  channel: string;
  keyMessages: string[];
  responsibleParty: string;
}

// Comprehensive template collection with world-class crisis response scenarios
export const COMPREHENSIVE_SCENARIO_TEMPLATES: ComprehensiveScenarioTemplate[] = [
  
  // === CRITICAL CRISIS RESPONSE TEMPLATES ===
  
  {
    id: 'supply-chain-crisis',
    name: 'Supply Chain Disruption Crisis',
    category: 'supply-chain',
    description: 'Complete supply chain disruption requiring immediate intervention and alternative sourcing strategies',
    likelihood: 'high',
    severity: 'severe',
    typicalTimeframe: 'immediate',
    requiredDataPoints: [
      {
        fieldName: 'disruption_type',
        label: 'Type of Disruption',
        fieldType: 'select',
        required: true,
        options: ['Natural disaster', 'Supplier bankruptcy', 'Geopolitical', 'Quality issue', 'Transportation', 'Other'],
        category: 'situation'
      },
      {
        fieldName: 'affected_suppliers',
        label: 'Number of Affected Suppliers',
        fieldType: 'number',
        required: true,
        category: 'situation'
      },
      {
        fieldName: 'revenue_at_risk',
        label: 'Monthly Revenue at Risk',
        fieldType: 'currency',
        required: true,
        category: 'financial'
      },
      {
        fieldName: 'inventory_days',
        label: 'Current Inventory Days Available',
        fieldType: 'number',
        required: true,
        category: 'resources'
      },
      {
        fieldName: 'alternative_suppliers',
        label: 'Available Alternative Suppliers',
        fieldType: 'number',
        required: true,
        category: 'resources'
      }
    ],
    criticalDecisionPoints: [
      'Activate alternative suppliers immediately',
      'Communicate with customers about delays',
      'Implement rationing of existing inventory',
      'Evaluate production capacity adjustments',
      'Consider expedited shipping options'
    ],
    stakeholderMapping: [
      {
        role: 'Chief Operating Officer',
        department: 'Operations',
        responsibility: 'Overall crisis coordination and supplier relationship management',
        decisionAuthority: 'critical',
        communicationPriority: 'immediate'
      },
      {
        role: 'Procurement Manager',
        department: 'Supply Chain',
        responsibility: 'Alternative supplier activation and contract negotiation',
        decisionAuthority: 'high',
        communicationPriority: 'immediate'
      },
      {
        role: 'Customer Success Manager',
        department: 'Sales',
        responsibility: 'Customer communication and expectation management',
        decisionAuthority: 'medium',
        communicationPriority: 'hourly'
      }
    ],
    resourceRequirements: [
      {
        resourceType: 'financial',
        description: 'Emergency procurement budget for alternative suppliers',
        urgency: 'immediate',
        estimatedCost: '$100K-500K depending on disruption scale',
        alternatives: ['Credit line activation', 'Supplier financing', 'Emergency reserves']
      },
      {
        resourceType: 'personnel',
        description: 'Crisis management team and emergency procurement specialists',
        urgency: 'immediate',
        estimatedCost: 'Internal resource reallocation',
        alternatives: ['External consulting', 'Contractor specialists', 'Overtime authorization']
      }
    ],
    successMetrics: [
      'Time to activate alternative suppliers',
      'Percentage of customer orders fulfilled on time',
      'Cost increase vs. normal operations',
      'Customer satisfaction during crisis',
      'Inventory days maintained above critical threshold'
    ],
    industrySpecific: false,
    applicableIndustries: ['Manufacturing', 'Retail', 'Healthcare', 'Automotive', 'Technology', 'Food & Beverage'],
    responsePhases: [
      {
        phase: 'immediate',
        timeline: '0-4 hours',
        objectives: ['Assess disruption scope', 'Activate crisis team', 'Secure existing inventory'],
        keyActions: ['Confirm disruption details', 'Contact alternative suppliers', 'Implement inventory controls'],
        successCriteria: ['Crisis team assembled', 'Initial supplier contacts made', 'Inventory secured']
      },
      {
        phase: 'short-term',
        timeline: '4-72 hours',
        objectives: ['Establish alternative supply sources', 'Communicate with stakeholders', 'Adjust production plans'],
        keyActions: ['Negotiate with backup suppliers', 'Issue customer communications', 'Modify production schedules'],
        successCriteria: ['Alternative suppliers confirmed', 'Customer notifications sent', 'Production adjusted']
      },
      {
        phase: 'long-term',
        timeline: '3-30 days',
        objectives: ['Restore normal operations', 'Conduct lessons learned', 'Strengthen supply chain resilience'],
        keyActions: ['Monitor supplier performance', 'Document crisis response', 'Update contingency plans'],
        successCriteria: ['Operations normalized', 'Lessons documented', 'Improved contingency plans']
      }
    ],
    escalationTriggers: [
      'Inventory drops below 7 days',
      'Alternative suppliers unavailable',
      'Customer order fulfillment below 80%',
      'Cost increase exceeds 50% of normal operations'
    ],
    communicationPlan: [
      {
        audience: 'Executive Leadership',
        timing: 'Within 1 hour',
        channel: 'Emergency phone call',
        keyMessages: ['Disruption scope', 'Initial response actions', 'Resource requirements'],
        responsibleParty: 'Chief Operating Officer'
      },
      {
        audience: 'Key Customers',
        timing: 'Within 4 hours',
        channel: 'Personal call/email',
        keyMessages: ['Service impact assessment', 'Mitigation measures', 'Updated timelines'],
        responsibleParty: 'Customer Success Manager'
      },
      {
        audience: 'All Employees',
        timing: 'Within 8 hours',
        channel: 'Internal announcement',
        keyMessages: ['Situation overview', 'Company response', 'Employee expectations'],
        responsibleParty: 'Chief Operating Officer'
      }
    ],
    recoveryMetrics: [
      'Supplier diversity index improvement',
      'Inventory buffer days increased',
      'Alternative supplier qualification time',
      'Crisis response time improvement',
      'Supply chain risk assessment score'
    ]
  },

  {
    id: 'cybersecurity-incident',
    name: 'Cybersecurity Incident Response',
    category: 'security',
    description: 'Major cybersecurity breach requiring immediate containment and comprehensive response strategy',
    likelihood: 'high',
    severity: 'severe',
    typicalTimeframe: 'immediate',
    requiredDataPoints: [
      {
        fieldName: 'incident_type',
        label: 'Type of Security Incident',
        fieldType: 'select',
        required: true,
        options: ['Data breach', 'Ransomware', 'DDoS attack', 'Insider threat', 'Phishing', 'System intrusion', 'Other'],
        category: 'situation'
      },
      {
        fieldName: 'affected_systems',
        label: 'Number of Affected Systems',
        fieldType: 'number',
        required: true,
        category: 'situation'
      },
      {
        fieldName: 'data_at_risk',
        label: 'Records/Data at Risk',
        fieldType: 'number',
        required: true,
        helpText: 'Number of customer records, financial records, or sensitive data points potentially compromised',
        category: 'situation'
      },
      {
        fieldName: 'business_impact',
        label: 'Estimated Business Impact per Hour',
        fieldType: 'currency',
        required: true,
        category: 'financial'
      },
      {
        fieldName: 'regulatory_requirements',
        label: 'Regulatory Reporting Requirements',
        fieldType: 'multiselect',
        required: true,
        options: ['GDPR', 'HIPAA', 'SOX', 'PCI-DSS', 'CCPA', 'FISMA', 'Other'],
        category: 'regulatory'
      }
    ],
    criticalDecisionPoints: [
      'Isolate affected systems immediately',
      'Determine if law enforcement should be contacted',
      'Decide on external forensics team engagement',
      'Evaluate need for public disclosure',
      'Consider cyber insurance claim activation'
    ],
    stakeholderMapping: [
      {
        role: 'Chief Information Security Officer',
        department: 'IT Security',
        responsibility: 'Incident response coordination and technical containment',
        decisionAuthority: 'critical',
        communicationPriority: 'immediate'
      },
      {
        role: 'Chief Legal Officer',
        department: 'Legal',
        responsibility: 'Regulatory compliance and legal implications management',
        decisionAuthority: 'critical',
        communicationPriority: 'immediate'
      },
      {
        role: 'Chief Executive Officer',
        department: 'Executive',
        responsibility: 'Strategic decision making and external communications',
        decisionAuthority: 'critical',
        communicationPriority: 'immediate'
      }
    ],
    resourceRequirements: [
      {
        resourceType: 'external',
        description: 'Cybersecurity forensics and incident response specialists',
        urgency: 'immediate',
        estimatedCost: '$50K-200K for comprehensive incident response',
        alternatives: ['Internal IT team', 'Cyber insurance resources', 'FBI/law enforcement assistance']
      },
      {
        resourceType: 'technology',
        description: 'Emergency IT infrastructure for business continuity',
        urgency: 'hours',
        estimatedCost: '$25K-100K for temporary systems',
        alternatives: ['Cloud services', 'Partner system access', 'Manual processes']
      }
    ],
    successMetrics: [
      'Time to containment',
      'Systems restored within 24-72 hours',
      'Zero additional data compromise',
      'Regulatory compliance maintained',
      'Customer trust retention above 85%'
    ],
    industrySpecific: false,
    applicableIndustries: ['Financial Services', 'Healthcare', 'Technology', 'Retail', 'Government', 'Education'],
    responsePhases: [
      {
        phase: 'immediate',
        timeline: '0-1 hour',
        objectives: ['Contain the incident', 'Assess the scope', 'Activate response team'],
        keyActions: ['Isolate affected systems', 'Preserve evidence', 'Contact key stakeholders'],
        successCriteria: ['Incident contained', 'Response team activated', 'Evidence preserved']
      },
      {
        phase: 'short-term',
        timeline: '1-24 hours',
        objectives: ['Investigate the incident', 'Communicate with stakeholders', 'Begin recovery'],
        keyActions: ['Conduct forensics', 'Notify authorities if required', 'Start system restoration'],
        successCriteria: ['Root cause identified', 'Stakeholders notified', 'Recovery initiated']
      },
      {
        phase: 'long-term',
        timeline: '1-30 days',
        objectives: ['Full system recovery', 'Prevent recurrence', 'Restore stakeholder confidence'],
        keyActions: ['Complete system restoration', 'Implement security improvements', 'Conduct lessons learned'],
        successCriteria: ['Systems fully operational', 'Security enhanced', 'Stakeholder confidence restored']
      }
    ],
    escalationTriggers: [
      'Data exfiltration confirmed',
      'Ransom demand received',
      'Media attention or public exposure',
      'Regulatory investigation initiated',
      'Business operations halted for >4 hours'
    ],
    communicationPlan: [
      {
        audience: 'Board of Directors',
        timing: 'Within 2 hours',
        channel: 'Secure emergency call',
        keyMessages: ['Incident overview', 'Containment status', 'Business impact assessment'],
        responsibleParty: 'Chief Executive Officer'
      },
      {
        audience: 'Regulatory Bodies',
        timing: 'Within 24-72 hours (as required)',
        channel: 'Official notification',
        keyMessages: ['Incident details', 'Affected data/customers', 'Remediation steps'],
        responsibleParty: 'Chief Legal Officer'
      },
      {
        audience: 'Affected Customers',
        timing: 'Within 72 hours',
        channel: 'Direct communication',
        keyMessages: ['Incident disclosure', 'Personal impact', 'Protective measures'],
        responsibleParty: 'Chief Marketing Officer'
      }
    ],
    recoveryMetrics: [
      'Security posture improvement score',
      'Incident detection time reduction',
      'Employee security awareness increase',
      'Cyber insurance premium impact',
      'Customer trust and retention metrics'
    ]
  },

  // === ADDITIONAL STRATEGIC TEMPLATES ===

  {
    id: 'financial-liquidity-crisis',
    name: 'Financial Liquidity Crisis',
    category: 'financial',
    description: 'Severe cash flow disruption requiring immediate financial stabilization measures',
    likelihood: 'medium',
    severity: 'severe',
    typicalTimeframe: 'immediate',
    requiredDataPoints: [
      {
        fieldName: 'cash_position',
        label: 'Current Cash Position',
        fieldType: 'currency',
        required: true,
        category: 'financial'
      },
      {
        fieldName: 'burn_rate',
        label: 'Monthly Burn Rate',
        fieldType: 'currency',
        required: true,
        category: 'financial'
      },
      {
        fieldName: 'credit_available',
        label: 'Available Credit Facilities',
        fieldType: 'currency',
        required: true,
        category: 'financial'
      }
    ],
    criticalDecisionPoints: [
      'Activate emergency credit lines',
      'Implement immediate cost reduction measures',
      'Negotiate payment deferrals with vendors',
      'Accelerate receivables collection',
      'Consider asset liquidation options'
    ],
    stakeholderMapping: [
      {
        role: 'Chief Financial Officer',
        department: 'Finance',
        responsibility: 'Financial crisis coordination and cash management',
        decisionAuthority: 'critical',
        communicationPriority: 'immediate'
      }
    ],
    resourceRequirements: [
      {
        resourceType: 'financial',
        description: 'Emergency funding or credit line activation',
        urgency: 'immediate',
        estimatedCost: 'Variable based on credit terms',
        alternatives: ['Asset-based lending', 'Invoice factoring', 'Emergency investor funding']
      }
    ],
    successMetrics: [
      'Cash runway extended beyond 90 days',
      'Credit facilities secured',
      'Operational costs reduced by 20-40%',
      'Customer payment terms improved',
      'Vendor payment agreements renegotiated'
    ],
    industrySpecific: false,
    applicableIndustries: ['All Industries'],
    responsePhases: [
      {
        phase: 'immediate',
        timeline: '0-24 hours',
        objectives: ['Assess liquidity position', 'Secure emergency funding', 'Implement cash preservation'],
        keyActions: ['Calculate exact cash position', 'Contact lenders immediately', 'Freeze non-essential spending'],
        successCriteria: ['Cash position confirmed', 'Emergency funding secured', 'Spending controlled']
      }
    ],
    escalationTriggers: [
      'Cash position below 30 days operating expenses',
      'Credit facilities unavailable',
      'Major customer payment defaults',
      'Inability to meet payroll or critical vendor payments'
    ],
    communicationPlan: [
      {
        audience: 'Board of Directors',
        timing: 'Within 4 hours',
        channel: 'Emergency board call',
        keyMessages: ['Liquidity crisis scope', 'Immediate actions taken', 'Funding requirements'],
        responsibleParty: 'Chief Executive Officer'
      }
    ],
    recoveryMetrics: [
      'Cash flow positive within 90 days',
      'Debt-to-equity ratio improvement',
      'Working capital optimization',
      'Credit rating maintenance',
      'Stakeholder confidence restoration'
    ]
  },

  {
    id: 'market-disruption-opportunity',
    name: 'Market Disruption Opportunity',
    category: 'strategic',
    description: 'Rapid market change creating strategic opportunities requiring immediate action',
    likelihood: 'medium',
    severity: 'significant',
    typicalTimeframe: 'days',
    requiredDataPoints: [
      {
        fieldName: 'market_change_type',
        label: 'Type of Market Change',
        fieldType: 'select',
        required: true,
        options: ['New regulation', 'Competitor exit', 'Technology shift', 'Consumer behavior change', 'Economic shift'],
        category: 'situation'
      },
      {
        fieldName: 'opportunity_size',
        label: 'Estimated Market Opportunity',
        fieldType: 'currency',
        required: true,
        category: 'financial'
      },
      {
        fieldName: 'competitive_advantage',
        label: 'Current Competitive Advantage',
        fieldType: 'textarea',
        required: true,
        category: 'organization'
      }
    ],
    criticalDecisionPoints: [
      'Assess competitive positioning for opportunity',
      'Determine resource allocation for market entry',
      'Evaluate partnership or acquisition opportunities',
      'Develop go-to-market acceleration plan',
      'Consider strategic pricing adjustments'
    ],
    stakeholderMapping: [
      {
        role: 'Chief Strategy Officer',
        department: 'Strategy',
        responsibility: 'Strategic opportunity assessment and execution planning',
        decisionAuthority: 'critical',
        communicationPriority: 'immediate'
      },
      {
        role: 'Chief Marketing Officer',
        department: 'Marketing',
        responsibility: 'Market analysis and go-to-market strategy',
        decisionAuthority: 'high',
        communicationPriority: 'immediate'
      }
    ],
    resourceRequirements: [
      {
        resourceType: 'personnel',
        description: 'Strategic opportunity assessment team and market research',
        urgency: 'days',
        estimatedCost: '$25K-100K for comprehensive market analysis',
        alternatives: ['External consultants', 'Market research firms', 'Internal strategy team']
      }
    ],
    successMetrics: [
      'Market share capture within target timeframe',
      'Revenue from new opportunity exceeds investment',
      'Competitive positioning strengthened',
      'Customer acquisition accelerated',
      'Strategic partnerships established'
    ],
    industrySpecific: false,
    applicableIndustries: ['All Industries'],
    responsePhases: [
      {
        phase: 'immediate',
        timeline: '0-7 days',
        objectives: ['Assess opportunity scope', 'Evaluate competitive position', 'Develop initial strategy'],
        keyActions: ['Market analysis', 'Competitive assessment', 'Resource requirement planning'],
        successCriteria: ['Opportunity validated', 'Strategy outlined', 'Resources identified']
      }
    ],
    escalationTriggers: [
      'Competitor moving faster than anticipated',
      'Market opportunity larger than initially assessed',
      'Regulatory changes affecting timeline',
      'Customer demand exceeding capacity'
    ],
    communicationPlan: [
      {
        audience: 'Executive Team',
        timing: 'Within 24 hours',
        channel: 'Strategy meeting',
        keyMessages: ['Opportunity assessment', 'Resource requirements', 'Competitive implications'],
        responsibleParty: 'Chief Strategy Officer'
      }
    ],
    recoveryMetrics: [
      'Market opportunity capture rate',
      'Speed to market improvement',
      'Strategic decision-making acceleration',
      'Competitive intelligence enhancement',
      'Revenue diversification success'
    ]
  },

  {
    id: 'regulatory-compliance-crisis',
    name: 'Regulatory Compliance Crisis',
    category: 'regulatory',
    description: 'Regulatory violations or compliance failures requiring immediate remediation and stakeholder management',
    likelihood: 'medium',
    severity: 'severe',
    typicalTimeframe: 'immediate',
    requiredDataPoints: [
      {
        fieldName: 'violation_type',
        label: 'Type of Regulatory Violation',
        fieldType: 'select',
        required: true,
        options: ['Data privacy', 'Financial reporting', 'Environmental', 'Safety', 'Antitrust', 'Industry-specific'],
        category: 'situation'
      },
      {
        fieldName: 'regulatory_body',
        label: 'Regulatory Agency Involved',
        fieldType: 'text',
        required: true,
        category: 'regulatory'
      },
      {
        fieldName: 'potential_fines',
        label: 'Potential Financial Penalties',
        fieldType: 'currency',
        required: true,
        category: 'financial'
      },
      {
        fieldName: 'affected_customers',
        label: 'Number of Affected Customers',
        fieldType: 'number',
        required: false,
        category: 'stakeholders'
      }
    ],
    criticalDecisionPoints: [
      'Immediate legal counsel engagement',
      'Regulatory self-disclosure decision',
      'Public communication strategy',
      'Remediation plan development',
      'Third-party compliance audit initiation'
    ],
    stakeholderMapping: [
      {
        role: 'Chief Compliance Officer',
        department: 'Legal/Compliance',
        responsibility: 'Regulatory response coordination and compliance remediation',
        decisionAuthority: 'critical',
        communicationPriority: 'immediate'
      },
      {
        role: 'General Counsel',
        department: 'Legal',
        responsibility: 'Legal strategy and regulatory communication',
        decisionAuthority: 'critical',
        communicationPriority: 'immediate'
      }
    ],
    resourceRequirements: [
      {
        resourceType: 'external',
        description: 'Specialized regulatory and legal counsel',
        urgency: 'immediate',
        estimatedCost: '$100K-500K for comprehensive response',
        alternatives: ['Internal legal team', 'Compliance consulting', 'Industry association support']
      }
    ],
    successMetrics: [
      'Regulatory violation resolved without additional penalties',
      'Compliance program strengthened',
      'Stakeholder trust maintained',
      'Operational disruption minimized',
      'Industry reputation preserved'
    ],
    industrySpecific: false,
    applicableIndustries: ['Financial Services', 'Healthcare', 'Energy', 'Manufacturing', 'Technology'],
    responsePhases: [
      {
        phase: 'immediate',
        timeline: '0-24 hours',
        objectives: ['Assess violation scope', 'Engage legal counsel', 'Preserve documentation'],
        keyActions: ['Document review', 'Legal team activation', 'Regulatory contact'],
        successCriteria: ['Scope assessed', 'Legal support secured', 'Documentation preserved']
      }
    ],
    escalationTriggers: [
      'Regulatory investigation formal launch',
      'Media coverage of violation',
      'Customer complaints exceeding threshold',
      'Additional violations discovered'
    ],
    communicationPlan: [
      {
        audience: 'Board of Directors',
        timing: 'Within 6 hours',
        channel: 'Emergency board briefing',
        keyMessages: ['Violation details', 'Response strategy', 'Financial implications'],
        responsibleParty: 'Chief Executive Officer'
      }
    ],
    recoveryMetrics: [
      'Compliance program maturity improvement',
      'Regulatory relationship restoration',
      'Risk management framework enhancement',
      'Employee compliance training completion',
      'Third-party audit score improvement'
    ]
  },

  {
    id: 'product-recall-crisis',
    name: 'Product Recall Crisis',
    category: 'operational',
    description: 'Product safety or quality issues requiring immediate recall and comprehensive customer protection measures',
    likelihood: 'low',
    severity: 'severe',
    typicalTimeframe: 'immediate',
    requiredDataPoints: [
      {
        fieldName: 'safety_issue_type',
        label: 'Type of Safety/Quality Issue',
        fieldType: 'select',
        required: true,
        options: ['Safety hazard', 'Quality defect', 'Contamination', 'Mislabeling', 'Component failure'],
        category: 'situation'
      },
      {
        fieldName: 'products_affected',
        label: 'Number of Products in Market',
        fieldType: 'number',
        required: true,
        category: 'situation'
      },
      {
        fieldName: 'recall_cost_estimate',
        label: 'Estimated Recall Cost',
        fieldType: 'currency',
        required: true,
        category: 'financial'
      },
      {
        fieldName: 'injury_reports',
        label: 'Number of Injury Reports',
        fieldType: 'number',
        required: true,
        category: 'situation'
      }
    ],
    criticalDecisionPoints: [
      'Determine recall scope and severity',
      'Coordinate with regulatory agencies',
      'Develop customer communication plan',
      'Implement return/refund process',
      'Assess legal liability exposure'
    ],
    stakeholderMapping: [
      {
        role: 'Chief Quality Officer',
        department: 'Quality Assurance',
        responsibility: 'Product safety assessment and recall coordination',
        decisionAuthority: 'critical',
        communicationPriority: 'immediate'
      }
    ],
    resourceRequirements: [
      {
        resourceType: 'financial',
        description: 'Recall execution budget and customer compensation',
        urgency: 'immediate',
        estimatedCost: '$500K-5M+ depending on recall scope',
        alternatives: ['Product insurance claims', 'Supplier cost sharing', 'Phased recall approach']
      }
    ],
    successMetrics: [
      'Customer safety ensured',
      'Recall completion rate >95%',
      'Brand reputation recovery',
      'Legal liability minimized',
      'Time to market re-entry'
    ],
    industrySpecific: true,
    applicableIndustries: ['Manufacturing', 'Food & Beverage', 'Automotive', 'Consumer Goods', 'Pharmaceuticals'],
    responsePhases: [
      {
        phase: 'immediate',
        timeline: '0-6 hours',
        objectives: ['Stop production/distribution', 'Assess safety scope', 'Notify authorities'],
        keyActions: ['Production halt', 'Safety assessment', 'Regulatory notification'],
        successCriteria: ['Distribution stopped', 'Safety confirmed', 'Authorities contacted']
      }
    ],
    escalationTriggers: [
      'Serious injury or death reported',
      'Media coverage escalating',
      'Regulatory enforcement action',
      'Class action lawsuit filed'
    ],
    communicationPlan: [
      {
        audience: 'Affected Customers',
        timing: 'Within 12 hours',
        channel: 'Multiple channels (email, media, retail)',
        keyMessages: ['Safety concern details', 'Immediate actions required', 'Return/refund process'],
        responsibleParty: 'Chief Marketing Officer'
      }
    ],
    recoveryMetrics: [
      'Product quality system improvement',
      'Customer satisfaction recovery',
      'Market share restoration',
      'Supplier quality program enhancement',
      'Regulatory compliance score improvement'
    ]
  },

  {
    id: 'talent-acquisition-crisis',
    name: 'Critical Talent Acquisition Crisis',
    category: 'human-capital',
    description: 'Severe talent shortage or key personnel loss threatening business operations and strategic objectives',
    likelihood: 'high',
    severity: 'significant',
    typicalTimeframe: 'days',
    requiredDataPoints: [
      {
        fieldName: 'talent_gap_type',
        label: 'Type of Talent Gap',
        fieldType: 'select',
        required: true,
        options: ['Executive leadership', 'Technical expertise', 'Sales team', 'Operations staff', 'Specialized skills'],
        category: 'situation'
      },
      {
        fieldName: 'positions_vacant',
        label: 'Number of Critical Vacant Positions',
        fieldType: 'number',
        required: true,
        category: 'situation'
      },
      {
        fieldName: 'business_impact',
        label: 'Monthly Business Impact',
        fieldType: 'currency',
        required: true,
        category: 'financial'
      },
      {
        fieldName: 'time_to_fill_target',
        label: 'Target Time to Fill (Days)',
        fieldType: 'number',
        required: true,
        category: 'timeline'
      }
    ],
    criticalDecisionPoints: [
      'Activate emergency recruitment strategy',
      'Consider interim/contract talent solutions',
      'Evaluate compensation enhancement packages',
      'Implement retention programs for existing talent',
      'Explore strategic partnerships or acquisitions'
    ],
    stakeholderMapping: [
      {
        role: 'Chief Human Resources Officer',
        department: 'Human Resources',
        responsibility: 'Talent strategy and acquisition acceleration',
        decisionAuthority: 'critical',
        communicationPriority: 'immediate'
      }
    ],
    resourceRequirements: [
      {
        resourceType: 'external',
        description: 'Executive search firms and specialized recruiters',
        urgency: 'days',
        estimatedCost: '$50K-200K for comprehensive search',
        alternatives: ['Internal recruiting team', 'Employee referral programs', 'Contractor networks']
      }
    ],
    successMetrics: [
      'Critical positions filled within target timeframe',
      'Quality of hire exceeding benchmarks',
      'Retention rate of new hires >90%',
      'Team productivity restoration',
      'Competitive positioning maintained'
    ],
    industrySpecific: false,
    applicableIndustries: ['Technology', 'Healthcare', 'Financial Services', 'Manufacturing', 'Professional Services'],
    responsePhases: [
      {
        phase: 'immediate',
        timeline: '0-7 days',
        objectives: ['Assess talent gap impact', 'Activate recruitment acceleration', 'Implement retention measures'],
        keyActions: ['Skills gap analysis', 'Recruiter engagement', 'Compensation review'],
        successCriteria: ['Gap assessed', 'Recruitment activated', 'Retention improved']
      }
    ],
    escalationTriggers: [
      'Key client relationships at risk',
      'Project delivery timelines threatened',
      'Competitor talent poaching',
      'Existing team morale declining'
    ],
    communicationPlan: [
      {
        audience: 'Existing Team',
        timing: 'Within 48 hours',
        channel: 'Team meetings',
        keyMessages: ['Hiring priority', 'Team support measures', 'Career development opportunities'],
        responsibleParty: 'Chief Human Resources Officer'
      }
    ],
    recoveryMetrics: [
      'Time to fill improvement',
      'Talent pipeline strength',
      'Employee satisfaction scores',
      'Succession planning completeness',
      'Employer brand strength'
    ]
  },

  {
    id: 'digital-transformation-acceleration',
    name: 'Digital Transformation Acceleration',
    category: 'technology',
    description: 'Accelerated digital transformation initiative to maintain competitive advantage and operational efficiency',
    likelihood: 'high',
    severity: 'significant',
    typicalTimeframe: 'weeks',
    requiredDataPoints: [
      {
        fieldName: 'transformation_scope',
        label: 'Transformation Scope',
        fieldType: 'multiselect',
        required: true,
        options: ['Customer experience', 'Operations automation', 'Data analytics', 'Cloud migration', 'AI integration'],
        category: 'situation'
      },
      {
        fieldName: 'investment_budget',
        label: 'Transformation Investment Budget',
        fieldType: 'currency',
        required: true,
        category: 'financial'
      },
      {
        fieldName: 'timeline_target',
        label: 'Target Implementation Timeline (Months)',
        fieldType: 'number',
        required: true,
        category: 'timeline'
      }
    ],
    criticalDecisionPoints: [
      'Select transformation technology platforms',
      'Determine implementation methodology',
      'Establish change management approach',
      'Define success metrics and KPIs',
      'Plan workforce reskilling programs'
    ],
    stakeholderMapping: [
      {
        role: 'Chief Technology Officer',
        department: 'Technology',
        responsibility: 'Technical architecture and implementation leadership',
        decisionAuthority: 'critical',
        communicationPriority: 'immediate'
      }
    ],
    resourceRequirements: [
      {
        resourceType: 'external',
        description: 'Digital transformation consultants and technology partners',
        urgency: 'weeks',
        estimatedCost: '$200K-1M+ for comprehensive transformation',
        alternatives: ['Internal IT team', 'Phased implementation', 'Technology vendor partnerships']
      }
    ],
    successMetrics: [
      'Digital maturity score improvement',
      'Operational efficiency gains >20%',
      'Customer satisfaction increase',
      'Employee productivity enhancement',
      'Competitive advantage strengthened'
    ],
    industrySpecific: false,
    applicableIndustries: ['All Industries'],
    responsePhases: [
      {
        phase: 'immediate',
        timeline: '0-30 days',
        objectives: ['Assess digital readiness', 'Select technology partners', 'Develop implementation roadmap'],
        keyActions: ['Current state analysis', 'Vendor selection', 'Change management planning'],
        successCriteria: ['Readiness assessed', 'Partners selected', 'Roadmap approved']
      }
    ],
    escalationTriggers: [
      'Competitor digital advantage widening',
      'Customer expectations exceeding capabilities',
      'Operational inefficiencies increasing costs',
      'Talent seeking more modern work environment'
    ],
    communicationPlan: [
      {
        audience: 'All Employees',
        timing: 'Within 1 week',
        channel: 'Company-wide announcement',
        keyMessages: ['Transformation vision', 'Employee impact', 'Training and support'],
        responsibleParty: 'Chief Executive Officer'
      }
    ],
    recoveryMetrics: [
      'Digital capability maturity',
      'Technology adoption rates',
      'Process automation percentage',
      'Data-driven decision making improvement',
      'Innovation pipeline enhancement'
    ]
  },

  {
    id: 'merger-acquisition-integration',
    name: 'Merger & Acquisition Integration',
    category: 'strategic',
    description: 'Strategic merger or acquisition requiring comprehensive integration planning and execution',
    likelihood: 'low',
    severity: 'significant',
    typicalTimeframe: 'months',
    requiredDataPoints: [
      {
        fieldName: 'deal_value',
        label: 'Transaction Value',
        fieldType: 'currency',
        required: true,
        category: 'financial'
      },
      {
        fieldName: 'integration_complexity',
        label: 'Integration Complexity Level',
        fieldType: 'select',
        required: true,
        options: ['Low - Similar operations', 'Medium - Some overlap', 'High - Different systems', 'Very High - Different industries'],
        category: 'situation'
      },
      {
        fieldName: 'employee_count',
        label: 'Total Employee Count (Combined)',
        fieldType: 'number',
        required: true,
        category: 'organization'
      }
    ],
    criticalDecisionPoints: [
      'Define integration timeline and milestones',
      'Establish governance and decision-making structure',
      'Determine cultural integration approach',
      'Plan systems and technology integration',
      'Develop communication and change management strategy'
    ],
    stakeholderMapping: [
      {
        role: 'Chief Integration Officer',
        department: 'Strategy',
        responsibility: 'Overall integration planning and execution',
        decisionAuthority: 'critical',
        communicationPriority: 'immediate'
      }
    ],
    resourceRequirements: [
      {
        resourceType: 'external',
        description: 'M&A integration consultants and change management specialists',
        urgency: 'weeks',
        estimatedCost: '$500K-2M+ for comprehensive integration support',
        alternatives: ['Internal integration team', 'Phased integration approach', 'Industry specialists']
      }
    ],
    successMetrics: [
      'Synergy targets achieved within 24 months',
      'Employee retention >85%',
      'Customer retention >90%',
      'Cultural integration success',
      'Financial targets met or exceeded'
    ],
    industrySpecific: false,
    applicableIndustries: ['All Industries'],
    responsePhases: [
      {
        phase: 'immediate',
        timeline: '0-90 days',
        objectives: ['Establish integration governance', 'Conduct detailed planning', 'Begin cultural integration'],
        keyActions: ['Integration team formation', 'Detailed planning workshops', 'Employee communication'],
        successCriteria: ['Governance established', 'Plans developed', 'Communication launched']
      }
    ],
    escalationTriggers: [
      'Key talent departures exceeding threshold',
      'Customer defection rates increasing',
      'Integration timeline delays',
      'Synergy realization behind targets'
    ],
    communicationPlan: [
      {
        audience: 'All Employees (Both Organizations)',
        timing: 'Within 1 week of closing',
        channel: 'Town halls and digital communications',
        keyMessages: ['Integration vision', 'Timeline and process', 'Employee impact and support'],
        responsibleParty: 'Chief Executive Officer'
      }
    ],
    recoveryMetrics: [
      'Integration milestone completion rate',
      'Synergy realization progress',
      'Employee engagement scores',
      'Customer satisfaction maintenance',
      'Market position strengthening'
    ]
  },

  {
    id: 'esg-compliance-initiative',
    name: 'ESG Compliance Initiative',
    category: 'regulatory',
    description: 'Environmental, Social, and Governance compliance initiative to meet stakeholder expectations and regulatory requirements',
    likelihood: 'high',
    severity: 'moderate',
    typicalTimeframe: 'months',
    requiredDataPoints: [
      {
        fieldName: 'esg_focus_areas',
        label: 'ESG Focus Areas',
        fieldType: 'multiselect',
        required: true,
        options: ['Carbon reduction', 'Diversity & inclusion', 'Board governance', 'Supply chain ethics', 'Community impact'],
        category: 'situation'
      },
      {
        fieldName: 'compliance_deadline',
        label: 'Compliance Deadline',
        fieldType: 'date',
        required: true,
        category: 'timeline'
      },
      {
        fieldName: 'investment_required',
        label: 'Estimated Investment Required',
        fieldType: 'currency',
        required: true,
        category: 'financial'
      }
    ],
    criticalDecisionPoints: [
      'Establish ESG governance structure',
      'Define measurable ESG targets',
      'Implement data collection systems',
      'Develop stakeholder reporting framework',
      'Create employee engagement programs'
    ],
    stakeholderMapping: [
      {
        role: 'Chief Sustainability Officer',
        department: 'Sustainability',
        responsibility: 'ESG strategy development and implementation oversight',
        decisionAuthority: 'critical',
        communicationPriority: 'immediate'
      }
    ],
    resourceRequirements: [
      {
        resourceType: 'external',
        description: 'ESG consulting and reporting platform implementation',
        urgency: 'weeks',
        estimatedCost: '$100K-500K for comprehensive ESG program',
        alternatives: ['Internal sustainability team', 'Industry partnerships', 'Phased implementation']
      }
    ],
    successMetrics: [
      'ESG score improvement',
      'Stakeholder satisfaction with ESG progress',
      'Regulatory compliance achievement',
      'Employee engagement in ESG initiatives',
      'Investor confidence enhancement'
    ],
    industrySpecific: false,
    applicableIndustries: ['All Industries'],
    responsePhases: [
      {
        phase: 'immediate',
        timeline: '0-60 days',
        objectives: ['Assess current ESG position', 'Establish governance', 'Define targets'],
        keyActions: ['ESG baseline assessment', 'Governance structure setup', 'Target setting workshops'],
        successCriteria: ['Baseline established', 'Governance active', 'Targets defined']
      }
    ],
    escalationTriggers: [
      'Investor ESG requirements tightening',
      'Regulatory deadline approaching',
      'Competitive ESG advantage gap',
      'Stakeholder pressure increasing'
    ],
    communicationPlan: [
      {
        audience: 'Investors and Stakeholders',
        timing: 'Within 30 days',
        channel: 'ESG report and investor communications',
        keyMessages: ['ESG commitment', 'Targets and timeline', 'Progress reporting framework'],
        responsibleParty: 'Chief Sustainability Officer'
      }
    ],
    recoveryMetrics: [
      'ESG rating improvement',
      'Sustainability program maturity',
      'Stakeholder trust enhancement',
      'Risk management improvement',
      'Long-term value creation'
    ]
  },

  {
    id: 'operational-excellence-program',
    name: 'Operational Excellence Program',
    category: 'operational',
    description: 'Comprehensive operational transformation focused on efficiency, quality, and customer satisfaction',
    likelihood: 'medium',
    severity: 'moderate',
    typicalTimeframe: 'months',
    requiredDataPoints: [
      {
        fieldName: 'improvement_areas',
        label: 'Operational Improvement Areas',
        fieldType: 'multiselect',
        required: true,
        options: ['Process efficiency', 'Quality systems', 'Cost reduction', 'Customer service', 'Technology automation'],
        category: 'situation'
      },
      {
        fieldName: 'baseline_metrics',
        label: 'Current Operational Efficiency (%)',
        fieldType: 'percentage',
        required: true,
        category: 'organization'
      },
      {
        fieldName: 'target_improvement',
        label: 'Target Efficiency Improvement (%)',
        fieldType: 'percentage',
        required: true,
        category: 'organization'
      }
    ],
    criticalDecisionPoints: [
      'Select operational excellence methodology',
      'Establish improvement project portfolio',
      'Define measurement and reporting systems',
      'Plan change management and training',
      'Determine resource allocation and priorities'
    ],
    stakeholderMapping: [
      {
        role: 'Chief Operating Officer',
        department: 'Operations',
        responsibility: 'Operational excellence strategy and program leadership',
        decisionAuthority: 'critical',
        communicationPriority: 'immediate'
      }
    ],
    resourceRequirements: [
      {
        resourceType: 'external',
        description: 'Operational excellence consultants and training programs',
        urgency: 'weeks',
        estimatedCost: '$200K-800K for comprehensive program',
        alternatives: ['Internal process improvement team', 'Lean Six Sigma certification', 'Industry benchmarking']
      }
    ],
    successMetrics: [
      'Operational efficiency improvement >20%',
      'Quality metrics improvement',
      'Customer satisfaction increase',
      'Cost reduction achievement',
      'Employee engagement in improvement'
    ],
    industrySpecific: false,
    applicableIndustries: ['Manufacturing', 'Healthcare', 'Financial Services', 'Retail', 'Technology'],
    responsePhases: [
      {
        phase: 'immediate',
        timeline: '0-90 days',
        objectives: ['Assess current state', 'Design improvement program', 'Launch pilot projects'],
        keyActions: ['Process mapping', 'Program design', 'Pilot implementation'],
        successCriteria: ['Assessment completed', 'Program designed', 'Pilots launched']
      }
    ],
    escalationTriggers: [
      'Competitive cost advantage eroding',
      'Customer satisfaction declining',
      'Quality issues increasing',
      'Employee productivity stagnating'
    ],
    communicationPlan: [
      {
        audience: 'All Employees',
        timing: 'Within 2 weeks',
        channel: 'Department meetings and digital communications',
        keyMessages: ['Excellence vision', 'Employee role', 'Training and support'],
        responsibleParty: 'Chief Operating Officer'
      }
    ],
    recoveryMetrics: [
      'Process maturity improvement',
      'Continuous improvement culture',
      'Operational resilience enhancement',
      'Customer value delivery',
      'Competitive advantage strengthening'
    ]
  },

  {
    id: 'customer-experience-transformation',
    name: 'Customer Experience Transformation',
    category: 'strategic',
    description: 'Comprehensive customer experience redesign to enhance satisfaction, loyalty, and competitive differentiation',
    likelihood: 'medium',
    severity: 'moderate',
    typicalTimeframe: 'months',
    requiredDataPoints: [
      {
        fieldName: 'cx_improvement_areas',
        label: 'Customer Experience Focus Areas',
        fieldType: 'multiselect',
        required: true,
        options: ['Digital touchpoints', 'Service quality', 'Response times', 'Personalization', 'Omnichannel integration'],
        category: 'situation'
      },
      {
        fieldName: 'current_nps',
        label: 'Current Net Promoter Score',
        fieldType: 'number',
        required: true,
        category: 'organization'
      },
      {
        fieldName: 'target_nps',
        label: 'Target Net Promoter Score',
        fieldType: 'number',
        required: true,
        category: 'organization'
      }
    ],
    criticalDecisionPoints: [
      'Define customer journey mapping approach',
      'Select customer experience technology platform',
      'Establish customer feedback and measurement systems',
      'Plan employee training and empowerment',
      'Determine implementation timeline and priorities'
    ],
    stakeholderMapping: [
      {
        role: 'Chief Customer Officer',
        department: 'Customer Experience',
        responsibility: 'Customer experience strategy and transformation leadership',
        decisionAuthority: 'critical',
        communicationPriority: 'immediate'
      }
    ],
    resourceRequirements: [
      {
        resourceType: 'technology',
        description: 'Customer experience platform and analytics tools',
        urgency: 'weeks',
        estimatedCost: '$150K-600K for comprehensive CX platform',
        alternatives: ['Existing system enhancement', 'Phased technology rollout', 'Partner platform solutions']
      }
    ],
    successMetrics: [
      'Net Promoter Score improvement',
      'Customer satisfaction increase >15%',
      'Customer retention improvement',
      'Customer lifetime value increase',
      'Service resolution time reduction'
    ],
    industrySpecific: false,
    applicableIndustries: ['Retail', 'Financial Services', 'Healthcare', 'Technology', 'Hospitality'],
    responsePhases: [
      {
        phase: 'immediate',
        timeline: '0-60 days',
        objectives: ['Map current customer journey', 'Identify improvement opportunities', 'Design new experience'],
        keyActions: ['Journey mapping workshops', 'Customer research', 'Experience design'],
        successCriteria: ['Journey mapped', 'Opportunities identified', 'New experience designed']
      }
    ],
    escalationTriggers: [
      'Customer satisfaction declining',
      'Competitive CX advantage gap',
      'Customer churn rate increasing',
      'Service quality complaints rising'
    ],
    communicationPlan: [
      {
        audience: 'Customer-Facing Employees',
        timing: 'Within 1 week',
        channel: 'Training sessions and team meetings',
        keyMessages: ['CX vision', 'New standards', 'Tools and training'],
        responsibleParty: 'Chief Customer Officer'
      }
    ],
    recoveryMetrics: [
      'Customer experience maturity',
      'Employee customer advocacy',
      'Customer journey optimization',
      'Brand loyalty enhancement',
      'Revenue from customer satisfaction'
    ]
  },

  {
    id: 'technology-infrastructure-crisis',
    name: 'Technology Infrastructure Crisis',
    category: 'technology',
    description: 'Critical technology infrastructure failure requiring immediate restoration and business continuity measures',
    likelihood: 'medium',
    severity: 'severe',
    typicalTimeframe: 'immediate',
    requiredDataPoints: [
      {
        fieldName: 'infrastructure_type',
        label: 'Type of Infrastructure Failure',
        fieldType: 'select',
        required: true,
        options: ['Data center outage', 'Network failure', 'Cloud service disruption', 'Database corruption', 'Application crash'],
        category: 'situation'
      },
      {
        fieldName: 'systems_affected',
        label: 'Number of Critical Systems Affected',
        fieldType: 'number',
        required: true,
        category: 'situation'
      },
      {
        fieldName: 'downtime_cost',
        label: 'Estimated Downtime Cost per Hour',
        fieldType: 'currency',
        required: true,
        category: 'financial'
      },
      {
        fieldName: 'users_impacted',
        label: 'Number of Users Impacted',
        fieldType: 'number',
        required: true,
        category: 'stakeholders'
      }
    ],
    criticalDecisionPoints: [
      'Activate disaster recovery procedures',
      'Determine backup system capabilities',
      'Communicate with affected users',
      'Engage vendor emergency support',
      'Assess data integrity and security'
    ],
    stakeholderMapping: [
      {
        role: 'Chief Technology Officer',
        department: 'Technology',
        responsibility: 'Technical recovery coordination and system restoration',
        decisionAuthority: 'critical',
        communicationPriority: 'immediate'
      }
    ],
    resourceRequirements: [
      {
        resourceType: 'external',
        description: 'Emergency technical support and recovery specialists',
        urgency: 'immediate',
        estimatedCost: '$25K-150K for emergency response',
        alternatives: ['Internal IT team', 'Vendor emergency support', 'Cloud failover services']
      }
    ],
    successMetrics: [
      'System restoration within RTO targets',
      'Data integrity maintained',
      'User productivity impact minimized',
      'Service level agreements met',
      'Preventive measures implemented'
    ],
    industrySpecific: false,
    applicableIndustries: ['All Industries'],
    responsePhases: [
      {
        phase: 'immediate',
        timeline: '0-2 hours',
        objectives: ['Contain infrastructure failure', 'Activate backup systems', 'Assess damage scope'],
        keyActions: ['Failure isolation', 'Backup activation', 'Impact assessment'],
        successCriteria: ['Failure contained', 'Backups active', 'Scope assessed']
      }
    ],
    escalationTriggers: [
      'Recovery time exceeding RTO',
      'Data loss confirmed',
      'Security breach suspected',
      'Customer-facing services down >2 hours'
    ],
    communicationPlan: [
      {
        audience: 'All Users',
        timing: 'Within 30 minutes',
        channel: 'Multiple channels (email, intranet, SMS)',
        keyMessages: ['Outage acknowledgment', 'Expected restoration time', 'Workaround procedures'],
        responsibleParty: 'Chief Technology Officer'
      }
    ],
    recoveryMetrics: [
      'Infrastructure resilience improvement',
      'Disaster recovery capability',
      'Mean time to recovery reduction',
      'System monitoring enhancement',
      'Business continuity maturity'
    ]
  },

  {
    id: 'competitive-threat-response',
    name: 'Competitive Threat Response',
    category: 'strategic',
    description: 'Significant competitive threat requiring immediate strategic countermeasures and market position defense',
    likelihood: 'high',
    severity: 'significant',
    typicalTimeframe: 'days',
    requiredDataPoints: [
      {
        fieldName: 'threat_type',
        label: 'Type of Competitive Threat',
        fieldType: 'select',
        required: true,
        options: ['New market entrant', 'Price war', 'Product innovation', 'Customer poaching', 'Market disruption'],
        category: 'situation'
      },
      {
        fieldName: 'market_share_risk',
        label: 'Market Share at Risk (%)',
        fieldType: 'percentage',
        required: true,
        category: 'organization'
      },
      {
        fieldName: 'revenue_impact',
        label: 'Potential Revenue Impact',
        fieldType: 'currency',
        required: true,
        category: 'financial'
      }
    ],
    criticalDecisionPoints: [
      'Assess competitive threat severity',
      'Develop strategic response options',
      'Determine pricing and positioning strategy',
      'Plan customer retention and acquisition',
      'Evaluate partnership or acquisition opportunities'
    ],
    stakeholderMapping: [
      {
        role: 'Chief Strategy Officer',
        department: 'Strategy',
        responsibility: 'Competitive analysis and strategic response development',
        decisionAuthority: 'critical',
        communicationPriority: 'immediate'
      }
    ],
    resourceRequirements: [
      {
        resourceType: 'external',
        description: 'Competitive intelligence and strategic consulting',
        urgency: 'days',
        estimatedCost: '$50K-200K for comprehensive competitive analysis',
        alternatives: ['Internal strategy team', 'Market research services', 'Industry analysts']
      }
    ],
    successMetrics: [
      'Market share defense >90%',
      'Customer retention >85%',
      'Competitive positioning strengthened',
      'Revenue impact minimized',
      'Strategic advantage established'
    ],
    industrySpecific: false,
    applicableIndustries: ['All Industries'],
    responsePhases: [
      {
        phase: 'immediate',
        timeline: '0-14 days',
        objectives: ['Analyze competitive threat', 'Develop response strategy', 'Execute defensive measures'],
        keyActions: ['Threat assessment', 'Strategy development', 'Response implementation'],
        successCriteria: ['Threat assessed', 'Strategy developed', 'Response launched']
      }
    ],
    escalationTriggers: [
      'Customer defection rate increasing',
      'Market share loss exceeding threshold',
      'Competitive advantage eroding',
      'Price pressure intensifying'
    ],
    communicationPlan: [
      {
        audience: 'Sales Team',
        timing: 'Within 48 hours',
        channel: 'Sales meetings and briefings',
        keyMessages: ['Competitive situation', 'Response strategy', 'Sales tools and support'],
        responsibleParty: 'Chief Sales Officer'
      }
    ],
    recoveryMetrics: [
      'Competitive intelligence capability',
      'Market responsiveness improvement',
      'Strategic agility enhancement',
      'Customer loyalty strengthening',
      'Market position consolidation'
    ]
  },

  {
    id: 'brand-reputation-crisis',
    name: 'Brand Reputation Crisis',
    category: 'strategic',
    description: 'Significant brand reputation threat requiring immediate communications response and stakeholder management',
    likelihood: 'medium',
    severity: 'severe',
    typicalTimeframe: 'immediate',
    requiredDataPoints: [
      {
        fieldName: 'reputation_issue',
        label: 'Type of Reputation Issue',
        fieldType: 'select',
        required: true,
        options: ['Social media controversy', 'Product/service failure', 'Executive misconduct', 'Environmental incident', 'Customer service failure'],
        category: 'situation'
      },
      {
        fieldName: 'media_coverage',
        label: 'Current Media Coverage Level',
        fieldType: 'select',
        required: true,
        options: ['Local', 'Regional', 'National', 'International', 'Viral social media'],
        category: 'situation'
      },
      {
        fieldName: 'stakeholder_impact',
        label: 'Primary Stakeholders Affected',
        fieldType: 'multiselect',
        required: true,
        options: ['Customers', 'Employees', 'Investors', 'Partners', 'Communities', 'Regulators'],
        category: 'stakeholders'
      }
    ],
    criticalDecisionPoints: [
      'Determine communication strategy and messaging',
      'Identify spokesperson and communication channels',
      'Assess legal and regulatory implications',
      'Plan stakeholder outreach and engagement',
      'Develop reputation recovery roadmap'
    ],
    stakeholderMapping: [
      {
        role: 'Chief Communications Officer',
        department: 'Communications',
        responsibility: 'Crisis communications strategy and media response',
        decisionAuthority: 'critical',
        communicationPriority: 'immediate'
      }
    ],
    resourceRequirements: [
      {
        resourceType: 'external',
        description: 'Crisis communications specialists and PR agencies',
        urgency: 'immediate',
        estimatedCost: '$75K-300K for comprehensive crisis response',
        alternatives: ['Internal communications team', 'Industry PR specialists', 'Legal communications counsel']
      }
    ],
    successMetrics: [
      'Media sentiment improvement',
      'Stakeholder trust restoration',
      'Brand perception recovery',
      'Customer retention >80%',
      'Employee confidence maintained'
    ],
    industrySpecific: false,
    applicableIndustries: ['All Industries'],
    responsePhases: [
      {
        phase: 'immediate',
        timeline: '0-24 hours',
        objectives: ['Control narrative', 'Address stakeholder concerns', 'Prevent escalation'],
        keyActions: ['Crisis communications activation', 'Stakeholder outreach', 'Media response'],
        successCriteria: ['Narrative controlled', 'Stakeholders contacted', 'Media engaged']
      }
    ],
    escalationTriggers: [
      'Viral social media spread',
      'Major media pickup',
      'Customer boycott threats',
      'Regulatory investigation launched'
    ],
    communicationPlan: [
      {
        audience: 'General Public',
        timing: 'Within 6 hours',
        channel: 'Press release and social media',
        keyMessages: ['Issue acknowledgment', 'Action plan', 'Company values'],
        responsibleParty: 'Chief Communications Officer'
      }
    ],
    recoveryMetrics: [
      'Brand reputation score recovery',
      'Media sentiment improvement',
      'Stakeholder trust restoration',
      'Crisis communication effectiveness',
      'Reputation risk management capability'
    ]
  },

  {
    id: 'international-expansion-opportunity',
    name: 'International Market Expansion',
    category: 'strategic',
    description: 'Strategic international market expansion opportunity requiring comprehensive market entry planning and execution',
    likelihood: 'medium',
    severity: 'moderate',
    typicalTimeframe: 'months',
    requiredDataPoints: [
      {
        fieldName: 'target_markets',
        label: 'Target International Markets',
        fieldType: 'multiselect',
        required: true,
        options: ['Europe', 'Asia-Pacific', 'Latin America', 'Middle East', 'Africa', 'North America'],
        category: 'situation'
      },
      {
        fieldName: 'expansion_investment',
        label: 'Total Expansion Investment',
        fieldType: 'currency',
        required: true,
        category: 'financial'
      },
      {
        fieldName: 'market_entry_mode',
        label: 'Preferred Market Entry Mode',
        fieldType: 'select',
        required: true,
        options: ['Direct investment', 'Joint venture', 'Licensing', 'Franchising', 'Export/Distribution'],
        category: 'situation'
      },
      {
        fieldName: 'timeline_months',
        label: 'Target Market Entry Timeline (Months)',
        fieldType: 'number',
        required: true,
        category: 'timeline'
      }
    ],
    criticalDecisionPoints: [
      'Select target markets and entry strategy',
      'Establish local partnerships and operations',
      'Adapt products/services for local markets',
      'Develop regulatory compliance framework',
      'Plan marketing and brand localization'
    ],
    stakeholderMapping: [
      {
        role: 'Chief International Officer',
        department: 'International Development',
        responsibility: 'International expansion strategy and execution',
        decisionAuthority: 'critical',
        communicationPriority: 'immediate'
      }
    ],
    resourceRequirements: [
      {
        resourceType: 'external',
        description: 'International expansion consultants and local market experts',
        urgency: 'weeks',
        estimatedCost: '$200K-800K for comprehensive expansion support',
        alternatives: ['Internal international team', 'Government trade assistance', 'Industry partnerships']
      }
    ],
    successMetrics: [
      'Market entry timeline achievement',
      'Local market share capture',
      'Revenue targets in new markets',
      'Regulatory compliance success',
      'Cultural adaptation effectiveness'
    ],
    industrySpecific: false,
    applicableIndustries: ['Manufacturing', 'Technology', 'Professional Services', 'Retail', 'Healthcare'],
    responsePhases: [
      {
        phase: 'immediate',
        timeline: '0-120 days',
        objectives: ['Conduct market research', 'Develop entry strategy', 'Establish local presence'],
        keyActions: ['Market analysis', 'Strategy development', 'Local partnerships'],
        successCriteria: ['Research completed', 'Strategy approved', 'Partnerships established']
      }
    ],
    escalationTriggers: [
      'Competitor entering target market first',
      'Regulatory barriers increasing',
      'Local economic conditions deteriorating',
      'Cultural adaptation challenges'
    ],
    communicationPlan: [
      {
        audience: 'International Team',
        timing: 'Within 1 week',
        channel: 'Strategy workshops and planning sessions',
        keyMessages: ['Expansion vision', 'Market strategy', 'Implementation plan'],
        responsibleParty: 'Chief International Officer'
      }
    ],
    recoveryMetrics: [
      'International market presence',
      'Global brand recognition',
      'Cross-border operational capability',
      'Cultural intelligence development',
      'International revenue diversification'
    ]
  }
];

// Utility functions for template management
export function getTemplateById(id: string): ComprehensiveScenarioTemplate | undefined {
  return COMPREHENSIVE_SCENARIO_TEMPLATES.find(template => template.id === id);
}

export function getTemplatesByCategory(category: ComprehensiveScenarioTemplate['category']): ComprehensiveScenarioTemplate[] {
  return COMPREHENSIVE_SCENARIO_TEMPLATES.filter(template => template.category === category);
}

export function getTemplatesBySeverity(severity: ComprehensiveScenarioTemplate['severity']): ComprehensiveScenarioTemplate[] {
  return COMPREHENSIVE_SCENARIO_TEMPLATES.filter(template => template.severity === severity);
}

export function getCrisisTemplates(): ComprehensiveScenarioTemplate[] {
  const crisisCategories: ComprehensiveScenarioTemplate['category'][] = ['supply-chain', 'security', 'financial', 'operational'];
  return COMPREHENSIVE_SCENARIO_TEMPLATES.filter(template => 
    crisisCategories.includes(template.category) && 
    (template.severity === 'severe' || template.severity === 'catastrophic')
  );
}

export function generateFormFields(template: ComprehensiveScenarioTemplate) {
  return template.requiredDataPoints.map(field => ({
    name: field.fieldName,
    label: field.label,
    type: field.fieldType,
    required: field.required,
    options: field.options,
    placeholder: field.placeholder,
    helpText: field.helpText,
    category: field.category
  }));
}