export const financialDemoData = {
  organization: {
    name: "LoanDepot",
    type: "Major Mortgage Lender",
    stats: {
      marketCap: "$2.3B",
      loanVolume: "$50B annually",
      employees: "6,000+",
      customers: "2M active borrowers"
    }
  },
  
  crisis: {
    title: "Ransomware Attack on Mortgage Infrastructure",
    subtitle: "Systems Encrypted - 2 Million Customers Unable to Process Payments",
    description: "At 9:00 AM, CISO detects unauthorized encryption spreading across LoanDepot's core banking systems. Customers cannot process mortgage payments. Attackers demand $10M ransom and threaten to release sensitive customer data. Every hour of delay increases recovery costs and regulatory exposure.",
    
    impactMetrics: {
      financialImpact: "$27M",
      timeWindow: "12 minutes",
      stakeholders: 150,
      affectedCustomers: "2M"
    }
  },
  
  playbook: {
    id: "#065",
    name: "Ransomware Attack Response",
    domain: "Technology & Innovation",
    preparedness: 94,
    sections: 8
  },
  
  aiDataStreams: [
    {
      id: "security-monitoring",
      name: "Security Event Monitoring",
      description: "Real-time analysis of network traffic and encryption patterns",
      status: "Critical Alert"
    },
    {
      id: "system-integrity",
      name: "System Integrity Sensors",
      description: "File system change detection across all servers",
      status: "Anomaly Detected"
    },
    {
      id: "threat-intelligence",
      name: "Threat Intelligence Feeds",
      description: "Known ransomware signature matching",
      status: "Match Found"
    },
    {
      id: "regulatory-compliance",
      name: "Compliance Monitoring",
      description: "Notification deadline tracking (72-hour window)",
      status: "Warning"
    },
    {
      id: "customer-impact",
      name: "Customer Impact Analysis",
      description: "Payment system availability monitoring",
      status: "Systems Down"
    }
  ],
  
  stakeholderTiers: {
    tier1: {
      title: "Decision Makers (8 executives)",
      count: 8,
      members: [
        "CEO - Emergency approval",
        "CISO - Incident commander",
        "CTO - System isolation",
        "CFO - Budget authorization",
        "CLO - Legal strategy",
        "Board Chair - Governance",
        "External Counsel - Regulatory",
        "Crisis PR Lead - Communications"
      ]
    },
    tier2: {
      title: "Execution Team (42 specialists)",
      count: 42,
      members: [
        "IT Security → Forensic analysis & containment",
        "External Forensics → Evidence preservation",
        "Legal Team → Regulatory notifications",
        "PR Agency → Media strategy",
        "Investor Relations → Stakeholder comms",
        "Customer Service → Hotline activation",
        "HR → Employee briefing",
        "Compliance → Reporting timeline"
      ]
    },
    tier3: {
      title: "Notification Wave (100+ people)",
      count: 100,
      members: [
        "All employees → Security protocols",
        "Key customers → Service status",
        "Regulators → Incident notification",
        "FBI & CISA → Law enforcement",
        "Cyber insurance → Claim filing",
        "Media contacts → Statement distribution"
      ]
    }
  },
  
  timelineEvents: [
    {
      time: "0:00",
      title: "Playbook Activated",
      description: "CEO approves #065 Ransomware Response",
      status: "complete"
    },
    {
      time: "0:30",
      title: "Tier 1 Assembled",
      description: "8 executives join emergency Zoom",
      status: "complete"
    },
    {
      time: "1:30",
      title: "Systems Isolated",
      description: "CTO initiates network segmentation",
      status: "complete"
    },
    {
      time: "2:00",
      title: "Budget Authorized",
      description: "CFO activates $5M cyber insurance",
      status: "complete"
    },
    {
      time: "3:00",
      title: "Forensics Engaged",
      description: "External team begins evidence collection",
      status: "complete"
    },
    {
      time: "4:30",
      title: "FBI Notified",
      description: "CISA and cyber division alerted",
      status: "complete"
    },
    {
      time: "6:00",
      title: "Customer Hotline Live",
      description: "2M borrowers can call for status",
      status: "complete"
    },
    {
      time: "8:00",
      title: "Media Statement",
      description: "Proactive disclosure prevents speculation",
      status: "complete"
    },
    {
      time: "9:30",
      title: "Backup Systems Online",
      description: "Payment processing restored via failover",
      status: "complete"
    },
    {
      time: "11:00",
      title: "Regulator Briefing",
      description: "OCC, CFPB, state agencies notified",
      status: "complete"
    },
    {
      time: "12:00",
      title: "Coordination Complete",
      description: "All 150 stakeholders executing in parallel",
      status: "complete"
    }
  ],
  
  roiComparison: {
    traditional: {
      label: "Traditional Response",
      duration: "72 Hours",
      approach: "Email chains, emergency meetings, calendar coordination",
      outcome: "$27M in Recovery Costs",
      points: [
        "Systems down for 3 days - customers locked out",
        "Regulatory fines for late notification (90-day delay)",
        "Stock price collapsed before official announcement",
        "Customer attrition as competitors poached accounts",
        "News leaked before controlled messaging"
      ],
      details: {
        recoveryCost: "$27M",
        regulatoryFines: "$2M+",
        customerLoss: "15% attrition",
        stockImpact: "-22% in 48 hours"
      }
    },
    vexor: {
      label: "M Response",
      duration: "12 Minutes",
      approach: "AI-triggered playbook with pre-approved coordination",
      outcome: "Attack Contained - Systems Restored",
      points: [
        "Backup systems online within 4 hours vs. 72 hours",
        "FBI and regulators notified immediately - full compliance",
        "Proactive media strategy - controlled narrative",
        "Customers informed before panic spreads",
        "Recovery cost reduced 80%: $27M → $5M"
      ],
      details: {
        recoveryCost: "$5M",
        regulatoryFines: "$0",
        customerLoss: "2% attrition",
        stockImpact: "-5% (quick recovery)"
      }
    },
    bottomLine: {
      value: "$22M Cost Avoided",
      metric: "Plus: Customer trust preserved, regulatory compliance maintained"
    }
  },
  
  communicationTemplates: [
    {
      name: "Board Emergency Briefing",
      completion: "95%"
    },
    {
      name: "FBI/CISA Notification",
      completion: "100%"
    },
    {
      name: "Customer Service Hotline Script",
      completion: "90%"
    },
    {
      name: "Media Statement Template",
      completion: "85%"
    },
    {
      name: "Employee Security Alert",
      completion: "100%"
    },
    {
      name: "Regulator Notification Forms",
      completion: "95%"
    }
  ],
  
  playbookPreview: {
    section1: "Ransomware detection triggers and response protocols",
    section2: "CISO, CEO, CTO, CFO, CLO, Board + external forensics",
    section3: "Isolate → Contain → Restore → Investigate → Notify",
    section4: "FBI, customers, regulators, media, employees, board",
    section5: "System isolation, forensics, backup restoration, legal filings",
    section6: "$5M cyber insurance + $2M emergency response budget",
    section7: "Systems online <24h, zero data loss, full compliance",
    section8: "Post-incident analysis, security improvements, playbook refinement"
  }
};
