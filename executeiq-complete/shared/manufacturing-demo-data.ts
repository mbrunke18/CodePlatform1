export const manufacturingDemoData = {
  organization: {
    name: "Toyota Motor Corporation",
    type: "Global Automotive Manufacturer",
    stats: {
      marketCap: "$250B",
      production: "10M vehicles/year",
      suppliers: "40,000+ globally",
      dealers: "4,000+ in North America"
    }
  },
  
  crisis: {
    title: "Critical Supplier Crisis - Semiconductor Shortage",
    subtitle: "Japanese Earthquake Damages Tier-1 Chip Supplier - 50,000 Vehicles at Risk",
    description: "At 3:00 PM, seismic event strikes Japan, damaging semiconductor fabrication plant. Toyota's AI detects supplier disruption: critical automotive chips supply interrupted. Just-in-time manufacturing means zero buffer inventory. Without rapid coordination to activate alternative suppliers, production lines will halt within 48 hours, costing $1M per hour.",
    
    impactMetrics: {
      financialImpact: "$500M",
      timeWindow: "4 hours to coordination",
      stakeholders: 158,
      vehiclesAtRisk: "50,000 units"
    }
  },
  
  playbook: {
    id: "#019",
    name: "Supplier Failure - Critical Component Shortage",
    domain: "Operational Excellence",
    preparedness: 96,
    sections: 8
  },
  
  aiDataStreams: [
    {
      id: "seismic-monitoring",
      name: "Global Seismic & Disaster Feeds",
      description: "Real-time earthquake detection near supplier locations",
      status: "7.2 Magnitude Event"
    },
    {
      id: "supplier-mapping",
      name: "Supplier Dependency Intelligence",
      description: "Critical Tier-1 supplier facility in affected region",
      status: "High Risk Detected"
    },
    {
      id: "inventory-tracking",
      name: "Just-In-Time Inventory Monitoring",
      description: "Buffer stock: 36 hours remaining for critical chips",
      status: "Critical Shortage Imminent"
    },
    {
      id: "alternative-suppliers",
      name: "Pre-Qualified Supplier Network",
      description: "Alternative sources identified and capacity confirmed",
      status: "Backup Ready"
    },
    {
      id: "production-impact",
      name: "Manufacturing Line Simulation",
      description: "Real-time modeling: 50,000 vehicles affected without action",
      status: "Production Halt in 48h"
    }
  ],
  
  stakeholderTiers: {
    tier1: {
      title: "Decision Makers (10 executives)",
      count: 10,
      members: [
        "COO - Operations commander",
        "CPO (Chief Procurement) - Supplier activation",
        "CFO - Budget authorization ($20M)",
        "Head of Engineering - Alternative part specs",
        "Head of Quality - Supplier certification",
        "Head of Manufacturing - Production adjustments",
        "Legal - Force majeure contracts",
        "External Supply Chain Consultants - Pre-retained",
        "Logistics Director - Expedited shipping",
        "Communications - Dealer notifications"
      ]
    },
    tier2: {
      title: "Execution Team (48 specialists)",
      count: 48,
      members: [
        "Procurement → Contact Supplier B & C (pre-vetted)",
        "Engineering → Pull alternative specs (in database)",
        "Quality → Review certifications (pre-approved)",
        "Manufacturing → Production impact modeling",
        "Finance → Authorize $20M expedited order",
        "Legal → File force majeure notices",
        "Communications → Dealer memo (pre-written)",
        "Logistics → Book air freight (pre-contracted FedEx)"
      ]
    },
    tier3: {
      title: "Network Coordination (100+ people)",
      count: 100,
      members: [
        "4,000 dealers → Service status updates",
        "Alternative suppliers → Capacity confirmation",
        "Manufacturing plants → Line adjustments",
        "Freight carriers → Emergency routing",
        "Quality inspectors → Expedited certification",
        "Customer service → Delivery timeline updates"
      ]
    }
  },
  
  timelineEvents: [
    {
      time: "0:00",
      title: "Supplier Crisis Detected",
      description: "COO activates Playbook #019 - Supplier Failure",
      status: "complete"
    },
    {
      time: "0:15",
      title: "Alternative Suppliers Contacted",
      description: "Supplier B & C (pre-vetted) capacity confirmed",
      status: "complete"
    },
    {
      time: "0:45",
      title: "Engineering Specs Verified",
      description: "Supplier B components confirmed compatible",
      status: "complete"
    },
    {
      time: "1:00",
      title: "Quality Certification Approved",
      description: "Pre-qualified 6 months ago in preparation",
      status: "complete"
    },
    {
      time: "1:30",
      title: "$20M Emergency Order Placed",
      description: "CFO authorizes expedited procurement",
      status: "complete"
    },
    {
      time: "2:00",
      title: "Air Freight Secured",
      description: "Pre-contracted FedEx capacity booked",
      status: "complete"
    },
    {
      time: "2:30",
      title: "Production Lines Adjusted",
      description: "Lines 1-3 continue, Line 4 pauses 48h",
      status: "complete"
    },
    {
      time: "3:00",
      title: "Dealers Notified",
      description: "4,000 dealerships: minimal disruption expected",
      status: "complete"
    },
    {
      time: "3:30",
      title: "Force Majeure Filed",
      description: "Legal notifications to affected customers",
      status: "complete"
    },
    {
      time: "4:00",
      title: "Full Coordination Complete",
      description: "Alternative supply chain activated - crisis averted",
      status: "complete"
    }
  ],
  
  roiComparison: {
    traditional: {
      label: "Traditional Response",
      duration: "30 Days",
      approach: "Email chains, emergency meetings, supplier qualification delays",
      outcome: "$500M Production Loss",
      points: [
        "Day 1-2: Assess which suppliers affected",
        "Day 3: Discover 50,000 chip shortage",
        "Day 4-5: Emergency meetings to find alternatives",
        "Week 2: Alternative supplier can't meet quality specs",
        "Week 3: Engineering scrambles to re-qualify parts",
        "Week 4: Production lines shut down - 10,000 vehicles delayed",
        "Month 2: Dealers screaming, customers buying competitors"
      ],
      details: {
        productionLoss: "$500M (10,000 vehicles @ $50K each)",
        expeditedShipping: "$100M to catch up",
        marketShare: "Customers who switch brands don't return",
        dealerConfidence: "Trust collapse - long-term damage",
        stockImpact: "Significant negative movement"
      }
    },
    vexor: {
      label: "M Response",
      duration: "4 Hours",
      approach: "Pre-vetted alternatives, pre-approved budgets, instant coordination",
      outcome: "$450M Saved - 2-Day Pause",
      points: [
        "Hour 1: Alternative Supplier B activated (pre-vetted, pre-negotiated)",
        "Hour 2: Engineering confirms compatibility (prep work already done)",
        "Hour 3: Quality approves (certification completed 6 months ago)",
        "Hour 4: First air shipment departing next day",
        "Result: Production pauses 2 days (not 30 days)",
        "Dealers notified proactively with clear recovery plan"
      ],
      details: {
        productionLoss: "$50M (minimal 2-day pause)",
        expeditedShipping: "$20M (controlled)",
        marketShare: "Customer retention - trust maintained",
        dealerConfidence: "Impressed by decisive action",
        stockImpact: "Minimal - markets reward speed"
      }
    },
    bottomLine: {
      value: "$450M Saved",
      metric: "2-day pause vs 30-day halt - Just-In-Time coordination matching Just-In-Time manufacturing"
    }
  },
  
  communicationTemplates: [
    {
      name: "Dealer Service Bulletin",
      completion: "95%"
    },
    {
      name: "Force Majeure Customer Notice",
      completion: "90%"
    },
    {
      name: "Alternative Supplier Contract",
      completion: "85%"
    },
    {
      name: "Production Adjustment Memo",
      completion: "100%"
    },
    {
      name: "Board Financial Impact Brief",
      completion: "95%"
    },
    {
      name: "Media Statement (if needed)",
      completion: "80%"
    }
  ],
  
  playbookPreview: {
    section1: "Supplier failure triggers: bankruptcy, disaster, quality issues",
    section2: "COO, CPO, Engineering, Quality, Manufacturing + external consultants",
    section3: "Assess → Activate alternatives → Expedite → Adjust production",
    section4: "Alternative suppliers, dealers, customers, freight carriers",
    section5: "Emergency procurement, quality certification, line adjustments",
    section6: "$20M expedited procurement + air freight budget",
    section7: "Production delay <48h, dealer satisfaction, customer retention",
    section8: "Supplier diversity analysis, what-if scenario updates, playbook refinement"
  }
};
