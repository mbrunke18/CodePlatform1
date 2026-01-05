export const energyDemoData = {
  organization: {
    name: "Pacific Grid & Power",
    industry: "Energy & Utilities",
    description: "Major Regional Power Provider",
    stats: {
      revenue: "$12.4B Annual Revenue",
      customers: "8.2M",
      coverage: "3-State Region",
      facilities: "247 Substations"
    }
  },

  crisis: {
    title: "Cascading Grid Failure Crisis",
    subtitle: "Critical Infrastructure Emergency Across 3 States",
    description: "Severe heat wave triggers cascading transformer failures across 247 substations threatening 8.2 million customers. Hospital backup systems failing. Federal agencies on alert. National security implications.",
    triggerTime: "2:15 PM",
    impactMetrics: {
      scope: "8.2M customers • 247 substations • 3 states",
      financialImpact: "$450M+",
      timeWindow: "3 hours",
      stakeholders: 2500
    }
  },

  playbook: {
    id: "#082",
    name: "Grid Emergency Response (NERC Category 3)",
    domain: "Infrastructure Crisis",
    preparednessScore: 94
  },

  aiDataStreams: [
    {
      id: "grid-sensors",
      name: "Grid Sensor Network",
      description: "247 substation temperature sensors + load monitoring",
      confidence: 96,
      status: "critical",
      signals: "18 transformers above 95°C critical threshold, cascading pattern detected"
    },
    {
      id: "weather-data",
      name: "Weather Intelligence",
      description: "NOAA heat wave tracking + forecast models",
      confidence: 94,
      status: "critical",
      signals: "Heat wave intensifying: 112°F peak, 6-hour duration forecast"
    },
    {
      id: "hospital-monitors",
      name: "Critical Facility Status",
      description: "47 hospitals + 12 data centers backup system monitoring",
      confidence: 99,
      status: "critical",
      signals: "8 hospitals reporting backup generator stress, fuel reserves <4 hours"
    },
    {
      id: "nerc-compliance",
      name: "NERC Compliance Monitor",
      description: "Federal energy regulatory requirements tracking",
      confidence: 92,
      status: "critical",
      signals: "Category 3 emergency criteria met: cascading failures imminent"
    },
    {
      id: "social-monitoring",
      name: "Social Media/311 Calls",
      description: "Public safety monitoring + emergency call volume",
      confidence: 89,
      status: "warning",
      signals: "311 calls surge 340%, social reports of power flickers across 12 counties"
    },
    {
      id: "federal-systems",
      name: "Federal Emergency Integration",
      description: "FEMA + DoE + DHS coordination systems",
      confidence: 91,
      status: "critical",
      signals: "DoE requesting briefing, DHS evaluating national security implications"
    }
  ],

  stakeholderTiers: {
    tier1: {
      count: 12,
      title: "Crisis Command",
      description: "CEO, CTO, COO, Federal liaisons, State emergency directors",
      members: [
        { role: "CEO", name: "Sarah Chen", department: "Executive", action: "Crisis authorization" },
        { role: "CTO", name: "Marcus Rodriguez", department: "Operations", action: "Grid stability" },
        { role: "COO", name: "Jennifer Park", department: "Operations", action: "Customer coordination" },
        { role: "Federal Liaison", name: "David Kim", department: "Government Relations", action: "DoE/FEMA coordination" },
        { role: "VP Engineering", name: "Robert Taylor", department: "Engineering", action: "Load shedding plan" },
        { role: "State Emergency Director", name: "Lisa Johnson", department: "Government", action: "Public safety coordination" }
      ]
    },
    tier2: {
      count: 250,
      title: "Field Execution",
      description: "Substation crews, hospital liaisons, load coordinators, repair teams",
      departments: [
        "247 Substation managers receiving load reduction orders",
        "47 Hospital facility coordinators implementing backup protocols",
        "85 Field crews mobilizing emergency repairs",
        "32 Municipal emergency coordinators implementing rotating outages",
        "18 Federal agency liaisons coordinating response"
      ]
    },
    tier3: {
      count: 2500,
      title: "Coordination Network",
      description: "All field personnel, municipal partners, federal agencies, customer communications",
      scope: "2,500 personnel including line workers, emergency responders, public affairs, regulatory compliance, and federal coordination teams"
    }
  },

  timelineEvents: [
    {
      time: "2:15 PM",
      title: "Grid Crisis Detection",
      description: "AI detects cascading transformer failures: 18 substations above 95°C, heat wave peak approaching",
      status: "complete",
      icon: "detection",
      stakeholderCount: 0
    },
    {
      time: "2:16 PM",
      title: "AI Trigger Fires",
      description: "Playbook #082 activated at 96% confidence - NERC Category 3 emergency criteria met",
      status: "complete",
      icon: "ai-trigger",
      stakeholderCount: 0
    },
    {
      time: "2:17 PM",
      title: "CEO Emergency Authorization",
      description: "CEO Sarah Chen approves grid emergency protocol via mobile - load shedding authorized",
      status: "complete",
      icon: "authorization",
      stakeholderCount: 1
    },
    {
      time: "2:18 PM",
      title: "Tier 1 Emergency Call",
      description: "12 crisis command leaders join secure video conference - grid stability briefing",
      status: "complete",
      icon: "meeting",
      stakeholderCount: 12
    },
    {
      time: "2:22 PM",
      title: "Federal Agencies Notified",
      description: "DoE, FEMA, DHS receive automated briefings - national coordination activated",
      status: "complete",
      icon: "federal",
      stakeholderCount: 3
    },
    {
      time: "2:25 PM",
      title: "Hospital Priority Protocol",
      description: "47 hospitals receive priority power status - backup systems monitored",
      status: "complete",
      icon: "hospital",
      stakeholderCount: 47
    },
    {
      time: "2:30 PM",
      title: "Load Shedding Execution",
      description: "247 substations implementing coordinated load reduction - 15% grid capacity freed",
      status: "complete",
      icon: "execution",
      stakeholderCount: 247
    },
    {
      time: "2:45 PM",
      title: "Rotating Outages Start",
      description: "32 municipalities implementing 30-minute rotating outages - hospitals protected",
      status: "complete",
      icon: "coordination",
      stakeholderCount: 32
    },
    {
      time: "3:00 PM",
      title: "Emergency Repairs Mobilized",
      description: "85 field crews deployed to critical transformers - targeted cooling initiated",
      status: "complete",
      icon: "repair",
      stakeholderCount: 85
    },
    {
      time: "3:30 PM",
      title: "Customer Communications Sent",
      description: "8.2M customers receive SMS/email with safety instructions and outage schedules",
      status: "complete",
      icon: "customer",
      stakeholderCount: 8200000
    },
    {
      time: "4:45 PM",
      title: "Heat Wave Peak Managed",
      description: "Grid stabilized through peak demand period - zero uncontrolled outages",
      status: "complete",
      icon: "success",
      stakeholderCount: 0
    },
    {
      time: "5:15 PM",
      title: "3-Hour Milestone - Crisis Resolved",
      description: "All 247 substations stable • 47 hospitals uninterrupted • Zero casualties • $450M infrastructure saved",
      status: "complete",
      icon: "milestone",
      stakeholderCount: 2500
    }
  ],

  roiComparison: {
    traditional: {
      title: "Traditional Coordination",
      timeline: "3-5 Days",
      outcome: "Catastrophic Blackout",
      approach: "Manual phone trees, sequential approvals, siloed departments while grid cascades into uncontrolled failure",
      points: [
        "Day 1 (2:15 PM): Substation managers notice high temps → report to regional supervisors → escalation chain begins",
        "Day 1 (3:00 PM): Still assembling crisis team → CEO in meetings → Engineering waiting for approval to act",
        "Day 1 (4:00 PM): GRID COLLAPSES - Cascading failures overwhelm coordination capacity",
        "Day 1-3: Complete regional blackout: 8.2M customers without power for 36-72 hours",
        "Health Crisis: 12 hospital patients die due to backup system failures during coordination delays",
        "Infrastructure Damage: $450M in destroyed transformers that cascade-failed during coordination gap",
        "National Security: DHS escalates to national emergency - military backup power deployed",
        "Economic Impact: $2.1B in lost productivity, spoiled food, business interruption across 3 states",
        "Regulatory: Congressional hearing on 'preventable crisis' - CEO testifies under oath"
      ],
      details: {
        coordination: "3-5 days of sequential approvals",
        impact: "8.2M customers, 36-72 hour blackout",
        cost: "$2.5B total economic loss",
        casualties: "12 preventable deaths"
      }
    },
    vexor: {
      title: "M Coordination",
      timeline: "3 Hours",
      outcome: "Zero Uncontrolled Outages",
      approach: "AI-orchestrated parallel coordination across 2,500 stakeholders executing load shedding and emergency protocols simultaneously",
      points: [
        "2:15 PM: AI detects cascading risk at 96% confidence across 18 critical substations",
        "2:16 PM: CEO receives mobile alert with one-tap approval for Playbook #082",
        "2:18 PM: 12 crisis command leaders briefed - load shedding authorized with federal coordination",
        "2:22-2:30 PM: 247 substations simultaneously reducing load, 47 hospitals priority-protected",
        "2:30-4:45 PM: Coordinated rotating outages manage peak demand - all hospitals operational",
        "3:00-5:15 PM: 85 repair crews execute targeted transformer cooling - grid stabilized",
        "Zero Deaths: All hospitals maintained power throughout crisis - backup systems never stressed",
        "Infrastructure Preserved: $450M in transformers saved through proactive load management",
        "Federal Commendation: DoE cites as 'model response' - NERC case study for industry"
      ],
      details: {
        coordination: "3 hours to full stabilization",
        impact: "Zero uncontrolled outages",
        savings: "$2.5B economic loss prevented",
        outcome: "Zero casualties - all hospitals protected"
      }
    },
    bottomLine: {
      value: "$2.5B Economic Loss Prevented + Lives Saved",
      metric: "24-40x Faster Coordination (3-5 days → 3 hours)"
    }
  }
};
