export const retailDemoData = {
  organization: {
    name: "Walmart Inc.",
    industry: "Retail / E-Commerce",
    type: "Global Retail Corporation",
    stats: {
      revenue: "$648B Annual Revenue",
      employees: "2.1M Employees Worldwide",
      stores: "10,500 stores in 19 countries",
      aiInvestment: "$20M+ saved via AI supply chain optimization"
    },
    background: "World's largest retailer with industry-leading AI-powered supply chain optimization analyzing 5,000+ daily shipments. But when food safety crises emerge, coordination still moves at email speed while contamination spreads at viral speed."
  },

  crisis: {
    title: "Salmonella Contamination Crisis",
    subtitle: "Lethal bacteria detected in bagged lettuce distributed to 847 stores across 23 states",
    description: "At 2:00 PM, Walmart's distribution center QA testing detected salmonella in bagged lettuce batch #47382. The contaminated product had already been distributed to 847 stores, and 12,847 customers had purchased the lettuce using their loyalty cards. Without immediate coordinated action, dozens of customers would consume the contaminated product, leading to hospitalizations, wrongful death lawsuits, FDA enforcement action, and permanent brand damage.",
    
    impactMetrics: {
      detectedAt: "2:00 PM - Distribution Center Quality Assurance Lab",
      scope: "847 stores • 23 states • 12,847 customers",
      classification: "Class I recall criteria (FDA)",
      immediateRisk: "50+ hospitalizations, $200M in lawsuits, Congressional hearing",
      financialImpact: "$245M+",
      timeWindow: "1 hour",
      stakeholders: 5000
    },
    
    context: "Food safety incidents can escalate from detection to viral social media crisis in hours. Traditional recall coordination takes 5-7 days of staged notifications—during which contaminated product continues to be consumed. Walmart's AI detected the problem instantly, but coordination infrastructure operates at email speed while crisis operates at TikTok speed."
  },

  playbook: {
    id: "#095",
    name: "Food Product Recall (Class I)",
    domain: "Operational Excellence",
    preparedness: 94,
    sections: 8,
    description: "Orchestrates immediate removal of contaminated food products from all retail locations, customer notifications, regulatory filings, and supply chain quarantine within 1 hour of detection."
  },

  aiDataStreams: [
    {
      id: "quality-control",
      name: "Quality Control Systems",
      description: "Salmonella detected in batch #47382 - exceeds FDA threshold",
      status: "CRITICAL ALERT",
      confidence: 98
    },
    {
      id: "supply-chain",
      name: "Supply Chain Intelligence",
      description: "Batch distributed to 847 stores across 23 states",
      status: "TRACKING ACTIVE",
      confidence: 95
    },
    {
      id: "customer-data",
      name: "Customer Analytics",
      description: "12,847 customers purchased via loyalty cards - contact data available",
      status: "QUERY COMPLETE",
      confidence: 99
    },
    {
      id: "regulatory",
      name: "FDA Compliance Monitor",
      description: "Class I recall criteria met - FDA notification required within 24 hours",
      status: "MONITORING",
      confidence: 92
    },
    {
      id: "media-monitoring",
      name: "Brand Reputation (Pulse)",
      description: "Social media mentions stable - window to act before public awareness",
      status: "STANDBY",
      confidence: 88
    },
    {
      id: "supplier-trace",
      name: "Supplier Traceability",
      description: "3 farms in California sourced this batch - quarantine recommended",
      status: "IDENTIFIED",
      confidence: 94
    }
  ],

  stakeholderTiers: {
    tier1: {
      title: "Decision Makers (15 executives)",
      count: 15,
      description: "Emergency Zoom session coordinating immediate recall decision, regulatory strategy, and customer safety response",
      members: [
        "CEO (Doug McMillon) - Final recall authorization",
        "COO (Judith McKenna) - Store operations coordination",
        "CFO (John David Rainey) - Financial impact ($75M budget)",
        "General Counsel - Legal liability strategy",
        "Chief Food Safety Officer - Patient risk assessment",
        "VP Supply Chain - Product quarantine & removal",
        "Chief Marketing Officer - Brand protection",
        "VP Store Operations - 847 stores coordination",
        "External Food Safety Counsel - Regulatory compliance",
        "Crisis PR Firm - Reputation management",
        "FDA Liaison Officer - Federal notification",
        "Insurance Carrier Rep - Claims activation",
        "Board Food Safety Committee Chair - Governance",
        "CDC Notification Coordinator - Public health",
        "State Health Department Liaison - 23 states"
      ]
    },
    tier2: {
      title: "Execution Team (200 specialists)",
      count: 200,
      description: "Simultaneous task distribution across food safety, store operations, supply chain, customer care, communications, and legal teams",
      teams: [
        {
          name: "Food Safety Team (12 people)",
          tasks: [
            "FDA Form 3177 filing (auto-populated, submitted 2:20 PM)",
            "CDC notification (pre-templated alert, sent 2:15 PM)",
            "23 state health departments (automated notifications, sent 2:18 PM)",
            "Root cause investigation with supplier farms"
          ]
        },
        {
          name: "Store Operations (847 store managers)",
          tasks: [
            "Remove ALL bagged lettuce from shelves (abundance of caution)",
            "Post customer notification signs (template to printers)",
            "Block recalled item sales at registers (system auto-blocks)",
            "Document removal process with photos"
          ]
        },
        {
          name: "Supply Chain Team (25 people)",
          tasks: [
            "Halt shipments from 3 California farms (notified 2:14 PM)",
            "Quarantine lettuce in 6 distribution centers (all notified 2:15 PM)",
            "Activate alternative supplier contracts (pre-negotiated rates)",
            "Coordinate product return and disposal"
          ]
        },
        {
          name: "Customer Care (50 representatives)",
          tasks: [
            "Email 12,847 customers: 'Do not consume, return for full refund'",
            "Text message to all customers with mobile numbers",
            "Automated phone calls (completed by 5:00 PM)",
            "Recall hotline activation (pre-trained staff, pre-scripted)"
          ]
        },
        {
          name: "Communications (15 people)",
          tasks: [
            "Website banner posted (2:16 PM): Recall announcement with batch details",
            "Social media posts (Facebook, Twitter, Instagram - 2:20 PM)",
            "Media alert to AP, Reuters, major outlets (2:25 PM)",
            "Store employee talking points (pushed to 847 stores - 2:18 PM)"
          ]
        },
        {
          name: "Legal & Finance (10 people)",
          tasks: [
            "Insurance carrier claim filed (2:30 PM)",
            "Product liability counsel briefed",
            "Documentation protocol activated",
            "Customer compensation calculations"
          ]
        }
      ]
    },
    tier3: {
      title: "Notification Network (5,000+ stakeholders)",
      count: 5000,
      description: "Automated distribution ensuring every stakeholder receives timely, role-appropriate information",
      members: [
        "847 store managers + assistant managers (instant app notification)",
        "12,847 customers who purchased product (email + text + phone)",
        "6 distribution center workers handling produce (safety alert)",
        "All Walmart food suppliers (industry-wide awareness check)",
        "All Board members (FYI with situation summary)",
        "All corporate executives (awareness briefing)",
        "Media contacts (press release distribution)",
        "Investor relations (financial impact briefing)"
      ]
    }
  },

  timelineEvents: [
    {
      time: "2:00 PM",
      title: "Salmonella Detection",
      description: "QA test flags salmonella in lettuce batch #47382 at distribution center",
      status: "complete",
      icon: "alert"
    },
    {
      time: "2:01 PM",
      title: "AI Trigger Activation",
      description: "M AI Trigger #095 confidence: 88% - 'Food contamination + wide distribution = Class I recall criteria'",
      status: "complete",
      icon: "ai"
    },
    {
      time: "2:02 PM",
      title: "Executive Alert",
      description: "CEO, COO, CFO, General Counsel, Chief Food Safety Officer receive simultaneous mobile alerts",
      status: "complete",
      icon: "notification"
    },
    {
      time: "2:05 PM",
      title: "Automated Data Queries",
      description: "Database queries execute: 847 stores identified, 12,847 customers traced, 3 supplier farms located",
      status: "complete",
      icon: "data"
    },
    {
      time: "2:08 PM",
      title: "CEO Reviews Playbook",
      description: "CEO sees pre-filled situation summary, stakeholder matrix, FDA templates, $75M pre-approved budget",
      status: "complete",
      icon: "review"
    },
    {
      time: "2:10 PM",
      title: "Recall Activation",
      description: "CEO approves recall activation with single mobile tap - coordinated execution begins",
      status: "complete",
      icon: "execute"
    },
    {
      time: "2:12 PM",
      title: "Tier 1 Emergency Zoom Live",
      description: "15 decision makers coordinating: CEO, COO, CFO, Legal, FDA liaison, Crisis PR, Insurance",
      status: "complete",
      icon: "coordination",
      stakeholderCount: 15
    },
    {
      time: "2:13 PM",
      title: "Store Alerts Deployed",
      description: "847 store managers receive instant app notifications with removal instructions",
      status: "complete",
      icon: "distribution",
      stakeholderCount: 847
    },
    {
      time: "2:15 PM",
      title: "Regulatory Notifications",
      description: "FDA Form 3177 filed, CDC notified, 23 state health departments alerted",
      status: "complete",
      icon: "regulatory"
    },
    {
      time: "2:16 PM",
      title: "Public Communications",
      description: "Website banner posted, social media updates deployed, media alert sent to AP/Reuters",
      status: "complete",
      icon: "communication"
    },
    {
      time: "2:20 PM",
      title: "Product Removal Begins",
      description: "All 847 stores physically removing bagged lettuce from shelves, posting customer notifications",
      status: "complete",
      icon: "execution",
      stakeholderCount: 847
    },
    {
      time: "2:25 PM",
      title: "Customer Notifications Start",
      description: "12,847 customers receiving emails with safety alert: 'Do not consume, return for full refund'",
      status: "complete",
      icon: "customer",
      stakeholderCount: 12847
    },
    {
      time: "2:30 PM",
      title: "Supply Chain Quarantine",
      description: "All shipments from 3 California farms halted, 6 distribution centers quarantine lettuce",
      status: "complete",
      icon: "supply-chain"
    },
    {
      time: "3:00 PM",
      title: "1-Hour Milestone",
      description: "Product removed from all 847 stores • 12,847 customers notified • FDA/CDC/23 states informed",
      status: "complete",
      icon: "milestone",
      stakeholderCount: 5000
    }
  ],

  roiComparison: {
    traditional: {
      title: "Traditional Coordination",
      timeline: "7 Days",
      outcome: "Catastrophic",
      approach: "Email chains, conference calls, and staged notifications while contaminated product continues to be consumed",
      points: [
        "Week 1: QA detects contamination, internal investigation confirms scope, legal consults FDA requirements",
        "Week 1 End: Quietly notify wholesalers and distribution centers - no public announcement yet",
        "During Gap: 50+ customers consume contaminated lettuce → hospitalizations begin → families traumatized",
        "Week 2: Public recall finally announced on FDA website - but damage already done",
        "Month 1-2: Lawsuits filed: $200M in settlements for hospitalizations and suffering",
        "Regulatory: FDA warning letter for late notification - Congressional hearing scheduled",
        "Brand Impact: Social media: 'Walmart knew for a week' - permanent trust erosion",
        "Total Cost: $245M+ ($200M lawsuits + $50M recall execution + brand damage)"
      ],
      details: {
        coordination: "7 days of email chains",
        impact: "50+ hospitalizations",
        cost: "$245M total cost",
        reputation: "Congressional hearing, FDA warning letter"
      }
    },
    vexor: {
      title: "M Coordination",
      timeline: "1 Hour",
      outcome: "Lives Saved",
      approach: "AI-orchestrated coordination executing across 5,000 stakeholders in parallel within 60 minutes of detection",
      points: [
        "2:00 PM: Contamination detected by QA testing system",
        "2:01 PM: AI Trigger activates Playbook #095 at 88% confidence",
        "2:10 PM: CEO approves recall from mobile phone - single tap activation",
        "2:12 PM: 15 executives coordinating on emergency Zoom - FDA/CDC auto-notified",
        "2:20 PM: 847 stores removing product from shelves simultaneously",
        "2:25 PM: 12,847 customers receiving safety alerts via email, text, and phone",
        "3:00 PM: Complete coordination achieved - zero customers consume contaminated lettuce after detection",
        "Value Preserved: Lives saved + $240M avoided ($200M lawsuits prevented + $40M savings) = $5M total cost"
      ],
      details: {
        coordination: "1 hour to full execution",
        impact: "0 hospitalizations after detection",
        cost: "$5M (only pre-detection cases)",
        reputation: "FDA commendation, 'exemplary response'"
      }
    },
    comparison: [
      {
        metric: "Coordination Speed",
        traditional: "7 days of staged notifications",
        vexor: "1 hour orchestrated execution",
        improvement: "168x faster"
      },
      {
        metric: "Customer Impact",
        traditional: "50+ hospitalizations",
        vexor: "0 hospitalizations after detection",
        improvement: "Lives saved"
      },
      {
        metric: "Legal Liability",
        traditional: "$200M in lawsuit settlements",
        vexor: "$5M (only pre-detection cases)",
        improvement: "$195M saved"
      },
      {
        metric: "Recall Execution",
        traditional: "$50M (chaotic, delayed)",
        vexor: "$5M (coordinated, immediate)",
        improvement: "$45M saved"
      },
      {
        metric: "Brand Reputation",
        traditional: "Congressional hearing + FDA warning + permanent trust damage",
        vexor: "FDA commendation + 'industry exemplar' narrative",
        improvement: "Trust reinforced"
      },
      {
        metric: "Total Value",
        traditional: "$245M+ total cost",
        vexor: "$5M total cost",
        improvement: "$240M+ preserved + lives saved"
      }
    ]
  }
};
