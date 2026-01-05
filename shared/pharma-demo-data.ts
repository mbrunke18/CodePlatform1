export const pharmaDemoData = {
  organization: {
    name: "Glenmark Pharmaceuticals",
    type: "Global Pharmaceutical Manufacturer",
    stats: {
      marketCap: "$1.2B",
      products: "150+ medications",
      facilities: "12 global manufacturing sites",
      patients: "50M+ worldwide"
    }
  },
  
  crisis: {
    title: "Class I Product Recall - Lethal Defect Detected",
    subtitle: "47 Million Potassium Chloride Capsules Fail to Dissolve Properly",
    description: "Quality control AI detects capsules failing dissolution tests - medication not releasing properly in patients' systems, causing lethal potassium levels. Class I recall criteria met: reasonable probability of serious adverse events or death. 91-year-old patient died during delayed coordination. Every day of delay risks more lives.",
    
    impactMetrics: {
      financialImpact: "$50M+",
      timeWindow: "12 minutes",
      stakeholders: 2052,
      unitsAffected: "47M capsules"
    }
  },
  
  playbook: {
    id: "#095",
    name: "Product Recall - Class I (Life-Threatening)",
    domain: "Operational Excellence",
    preparedness: 92,
    sections: 8
  },
  
  aiDataStreams: [
    {
      id: "quality-control",
      name: "Manufacturing Quality Systems",
      description: "Automated dissolution testing showing failure patterns",
      status: "Critical Defect"
    },
    {
      id: "adverse-events",
      name: "Adverse Event Monitoring",
      description: "Patient safety database showing elevated potassium reports",
      status: "Pattern Detected"
    },
    {
      id: "batch-tracking",
      name: "Batch Genealogy System",
      description: "Tracking all affected lot numbers across distribution",
      status: "47M Units Mapped"
    },
    {
      id: "regulatory-filing",
      name: "FDA Reporting System",
      description: "Class I recall criteria assessment - immediate action required",
      status: "Trigger Threshold Met"
    },
    {
      id: "supply-chain",
      name: "Distribution Intelligence",
      description: "Real-time tracking: 200 wholesalers, 15,000 pharmacies",
      status: "Network Identified"
    }
  ],
  
  stakeholderTiers: {
    tier1: {
      title: "Decision Makers (12 executives)",
      count: 12,
      members: [
        "CEO - Final recall authorization",
        "COO - Operations shutdown",
        "CFO - Financial impact ($50M+)",
        "CLO - Legal liability strategy",
        "CMO - Medical safety assessment",
        "Head of Quality - Root cause",
        "Head of Regulatory - FDA coordination",
        "Board Chair - Governance oversight",
        "External Counsel - Liability defense",
        "Crisis PR Firm - Reputation management",
        "FDA Liaison - Regulatory interface",
        "Medical Safety Officer - Patient risk"
      ]
    },
    tier2: {
      title: "Execution Team (40 specialists)",
      count: 40,
      members: [
        "Legal → FDA Form 3177 filing (pre-drafted)",
        "Manufacturing → Production halt, inventory secure",
        "Supply Chain → Contact 200 wholesalers (automated)",
        "Medical Affairs → Physician notification protocol",
        "Customer Service → Recall hotline (pre-scripted)",
        "IT → Website recall notice (pre-approved)",
        "Finance → $25M recall insurance activation",
        "HR → Employee briefing (pre-written memo)"
      ]
    },
    tier3: {
      title: "Notification Wave (2,000+ contacts)",
      count: 2000,
      members: [
        "15,000 pharmacies → Direct email + phone",
        "Prescribing physicians → Dear Doctor letter",
        "Patients with prescriptions → Direct outreach",
        "FDA → Official Class I notification",
        "Media → Press release (proactive)",
        "Investors → Financial impact disclosure"
      ]
    }
  },
  
  timelineEvents: [
    {
      time: "0:00",
      title: "Recall Activated",
      description: "CEO authorizes Playbook #095 - Class I Recall",
      status: "complete"
    },
    {
      time: "0:45",
      title: "Tier 1 Emergency Session",
      description: "12 decision makers convened via Zoom",
      status: "complete"
    },
    {
      time: "1:30",
      title: "Production Halted",
      description: "All manufacturing lines stopped immediately",
      status: "complete"
    },
    {
      time: "2:00",
      title: "FDA Notification Filed",
      description: "Form 3177 submitted electronically - full compliance",
      status: "complete"
    },
    {
      time: "3:00",
      title: "Wholesaler Alert Sent",
      description: "200 distributors contacted - return process initiated",
      status: "complete"
    },
    {
      time: "4:30",
      title: "Public Announcement Live",
      description: "Website updated, press release distributed",
      status: "complete"
    },
    {
      time: "6:00",
      title: "Pharmacy Network Notified",
      description: "15,000 pharmacies - stop dispensing immediately",
      status: "complete"
    },
    {
      time: "7:30",
      title: "Patient Hotline Activated",
      description: "Pre-scripted responses for affected patients",
      status: "complete"
    },
    {
      time: "9:00",
      title: "Physician Communications",
      description: "Dear Doctor letter to all prescribers",
      status: "complete"
    },
    {
      time: "10:30",
      title: "Direct Patient Outreach Begins",
      description: "Patients with recent prescriptions contacted",
      status: "complete"
    },
    {
      time: "12:00",
      title: "Full Coordination Complete",
      description: "2,052 stakeholders executing recall protocol",
      status: "complete"
    }
  ],
  
  roiComparison: {
    traditional: {
      label: "Traditional Response (Glenmark Actual)",
      duration: "6 Weeks",
      approach: "Staged notification: Wholesalers (Week 4) → Public (Week 6)",
      outcome: "Patient Death + $50M Liability",
      points: [
        "Week 1-3: Internal investigation and legal consultation",
        "Week 4 (May): Quiet notification to wholesalers only",
        "Week 5: 91-year-old patient takes defective capsules",
        "Week 5: Patient dies from lethal potassium levels",
        "Week 6 (June): Public announcement on FDA website",
        "Family learns weeks later their loved one died from recalled medication"
      ],
      details: {
        deaths: "1 confirmed (likely more unreported)",
        lawsuitLiability: "$50M+",
        brandDamage: "7th FDA warning letter to Glenmark",
        criminalRisk: "Investigation pending"
      }
    },
    vexor: {
      label: "M Response",
      duration: "12 Minutes",
      approach: "Simultaneous coordination across all 2,052 stakeholders",
      outcome: "Lives Saved + Liability Avoided",
      points: [
        "FDA notified within 2 minutes of detection",
        "Public announcement live within 4.5 minutes",
        "Wholesalers alerted and return process active within 3 minutes",
        "Pharmacies stop dispensing within 6 minutes",
        "Patients contacted directly within 10.5 minutes",
        "Patient NEVER receives the deadly capsules"
      ],
      details: {
        deaths: "0 - lives saved through speed",
        lawsuitLiability: "$0",
        brandDamage: "Proactive safety leadership demonstrated",
        criminalRisk: "None - full transparency and compliance"
      }
    },
    bottomLine: {
      value: "A Life Saved",
      metric: "Plus: $50M+ liability avoided, brand reputation preserved, regulatory compliance"
    }
  },
  
  communicationTemplates: [
    {
      name: "FDA Form 3177 (Class I Recall)",
      completion: "100%"
    },
    {
      name: "Dear Doctor Letter",
      completion: "90%"
    },
    {
      name: "Patient Safety Communication",
      completion: "85%"
    },
    {
      name: "Pharmacy Notification",
      completion: "95%"
    },
    {
      name: "Media Press Release",
      completion: "80%"
    },
    {
      name: "Board Emergency Memo",
      completion: "95%"
    },
    {
      name: "Employee Safety Briefing",
      completion: "90%"
    },
    {
      name: "Investor Disclosure Letter",
      completion: "85%"
    }
  ],
  
  playbookPreview: {
    section1: "Class I recall triggers: life-threatening defects detected",
    section2: "CEO, COO, CMO, Quality, Regulatory, FDA + external counsel",
    section3: "Halt → Notify FDA → Alert distribution → Contact patients",
    section4: "FDA, wholesalers, pharmacies, physicians, patients, media",
    section5: "Production stop, FDA filing, network alerts, patient outreach",
    section6: "$25M recall insurance + emergency response budget",
    section7: "100% FDA compliance, zero additional adverse events",
    section8: "Root cause analysis, manufacturing improvements, patient safety review"
  }
};
