export const spacexLaunchDemoData = {
  organization: {
    name: "SpaceX",
    industry: "Aerospace / Space Transportation",
    type: "Private Space Launch Provider",
    stats: {
      revenue: "$9B Annual Revenue (2024)",
      launches: "96 successful Falcon 9 launches (2023)",
      cadence: "World's highest launch frequency - 1 launch every 3.8 days",
      capability: "Rapid reusability: Booster turnaround in 21 days"
    },
    background: "SpaceX revolutionized aerospace by treating launch operations like a software company treats deployments: iterate fast, coordinate tightly, execute flawlessly. Elon Musk demands decision velocity—when he decides to accelerate a launch, the entire organization must coordinate instantly across FAA, ground crews, payload customers, engineering, and safety teams. Traditional aerospace coordination takes 5-7 days. M compresses it to 12 minutes."
  },

  crisis: {
    title: "Strategic Launch Acceleration: Starlink Orbital Window",
    subtitle: "Moving Starlink Group 7-8 Launch Forward by 3 Days to Capture Optimal Orbital Geometry",
    description: "At 9:00 AM, SpaceX trajectory analysis identifies rare orbital window opening 3 days early due to favorable atmospheric conditions and competitor launch delays. Moving Starlink Group 7-8 launch from April 18 to April 15 would: (1) optimize satellite constellation geometry, (2) capture vacated launch slot from delayed ULA mission, (3) accelerate Starlink service expansion to Southeast Asia by 2 weeks, unlocking $47M in subscriber revenue. Challenge: coordinate 1,847 stakeholders across FAA approvals, ground operations, payload processing, weather analysis, range safety, customer notifications, and media relations in hours, not days.",
    
    impactMetrics: {
      detectedAt: "9:00 AM PT - Trajectory Analysis & Orbital Dynamics Team",
      scope: "Starlink Group 7-8 mission • 23 satellites • Falcon 9 Block 5 • 1,847 stakeholders",
      classification: "Strategic Offensive - Schedule Acceleration (Playbook #155)",
      opportunityWindow: "3 days to coordinate launch acceleration",
      financialImpact: "$47M revenue acceleration + strategic orbital position",
      timeWindow: "12 minutes coordination, 72-hour execution prep",
      stakeholders: 1847
    },
    
    context: "Space launch windows are determined by orbital mechanics—miss a window and you wait weeks for the next one. When a favorable window opens unexpectedly, the first company to coordinate wins the slot. SpaceX's advantage isn't just technology—it's coordination velocity. When Elon decides to accelerate, everyone needs their assignment within minutes. Traditional aerospace: 5-7 days to coordinate. SpaceX with M: 12 minutes."
  },

  playbook: {
    id: "#155",
    name: "Launch Schedule Acceleration",
    domain: "Technology & Innovation (Offensive)",
    preparedness: 92,
    sections: 8,
    description: "Orchestrates rapid launch schedule acceleration when favorable orbital windows emerge—coordinating FAA approvals, ground operations, payload processing, range safety, engineering validation, and customer communications to capture time-sensitive launch opportunities."
  },

  aiDataStreams: [
    {
      id: "orbital-dynamics",
      name: "Orbital Dynamics (Nova)",
      description: "Favorable atmospheric conditions, optimal inclination geometry for constellation expansion",
      status: "WINDOW DETECTED",
      confidence: 94
    },
    {
      id: "range-availability",
      name: "Range Availability (Echo)",
      description: "Cape Canaveral LC-40: ULA mission delayed, slot available April 15, 6:30 AM",
      status: "SLOT OPEN",
      confidence: 97
    },
    {
      id: "vehicle-readiness",
      name: "Vehicle Readiness (Pulse)",
      description: "Falcon 9 B1062.12: Post-flight inspection complete, propellant loading possible within 48 hrs",
      status: "READY",
      confidence: 91
    },
    {
      id: "payload-status",
      name: "Payload Status (Pulse)",
      description: "23 Starlink satellites: Integration complete, final checks can be accelerated by 36 hours",
      status: "INTEGRATION COMPLETE",
      confidence: 89
    },
    {
      id: "weather-forecast",
      name: "Weather Analysis (Prism)",
      description: "April 15: 85% favorable weather, low winds, minimal lightning risk—optimal conditions",
      status: "FAVORABLE",
      confidence: 88
    },
    {
      id: "faa-coordination",
      name: "FAA Regulatory (Flux)",
      description: "Launch license modification possible via expedited review (48-hour turnaround feasible)",
      status: "EXPEDITED PATH AVAILABLE",
      confidence: 86
    }
  ],

  stakeholderTiers: {
    tier1: {
      title: "Executive Leadership & Mission Directors (34 leaders)",
      count: 34,
      description: "CEO, COO, Chief Engineer, VP Launch Operations, Mission Directors coordinating go-decision, regulatory strategy, customer communications, and risk assessment for 3-day acceleration",
      members: [
        "Elon Musk (CEO & Chief Engineer) - Final launch acceleration decision",
        "Gwynne Shotwell (President & COO) - FAA coordination, customer relations",
        "Tom Ochinero (VP Commercial Sales) - Customer notification, schedule impact",
        "Bill Gerstenmaier (VP Build & Flight Reliability) - Vehicle readiness validation",
        "Kiko Dontchev (VP Launch Operations) - Ground crew coordination, pad operations",
        "Hans Koenigsmann (VP Build & Flight Reliability) - Engineering validation",
        "VP Safety & Mission Assurance - Risk assessment for accelerated timeline",
        "General Counsel - Regulatory compliance, FAA license modification",
        "Chief Financial Officer - Financial impact analysis ($47M revenue acceleration)",
        "VP Government Affairs - FAA, Air Force, NASA coordination",
        "Mission Director (Starlink) - Payload readiness, orbital insertion validation",
        "Launch Weather Officer - Weather forecast confidence for April 15",
        "Range Safety Officer - Safety protocols for accelerated schedule"
      ]
    },
    tier2: {
      title: "Operational Execution Teams (813 specialists)",
      count: 813,
      description: "Ground operations, vehicle processing, payload integration, propellant loading, range coordination, weather analysis, safety teams, engineering validation, and communications executing 72-hour acceleration timeline",
      teams: [
        {
          name: "Ground Operations (340 crew)",
          tasks: [
            "LC-40 pad preparation: accelerate readiness checks by 72 hours",
            "Transporter-erector operations: vehicle rollout scheduling",
            "Strongback operations: Falcon 9 positioning and integration",
            "Ground support equipment: fueling systems, power, communications",
            "Coordinate with Range Control for April 15 slot confirmation"
          ]
        },
        {
          name: "Vehicle Processing (180 engineers)",
          tasks: [
            "Falcon 9 B1062.12: Complete post-flight inspection ahead of schedule",
            "Stage 1 (booster): Validate structural integrity, engine performance",
            "Stage 2 (upper stage): Propellant systems check, engine qualification",
            "Grid fins, landing legs: Deployment mechanism validation",
            "Telemetry systems: Data acquisition equipment testing"
          ]
        },
        {
          name: "Payload Integration (120 specialists)",
          tasks: [
            "23 Starlink satellites: Accelerate final integration checks by 36 hours",
            "Dispenser mechanism: Validate deployment sequencing",
            "Satellite health checks: Power, communications, propulsion systems",
            "Fairing encapsulation: Protect payload during ascent",
            "Mass properties validation: Center of gravity calculations"
          ]
        },
        {
          name: "Propellant & Fueling (67 technicians)",
          tasks: [
            "RP-1 (rocket-grade kerosene): Transfer to storage tanks",
            "LOX (liquid oxygen): Cryogenic loading operations coordination",
            "Helium pressurant: Loading systems validation",
            "Fueling timeline: Accelerate by 48 hours with safety protocols maintained"
          ]
        },
        {
          name: "Range Coordination (45 specialists)",
          tasks: [
            "Eastern Range (Space Force): Coordinate April 15 slot takeover",
            "Range Safety: Flight termination system validation",
            "Tracking systems: Radar, telemetry, optical tracking setup",
            "Airspace coordination: NOTAMs (Notice to Airmen), marine exclusion zones"
          ]
        },
        {
          name: "Weather & Trajectory (28 analysts)",
          tasks: [
            "Weather forecasting: April 15 conditions analysis (winds, lightning, clouds)",
            "Upper atmosphere analysis: Favorable for orbital insertion",
            "Trajectory planning: Optimize for accelerated timeline",
            "Abort scenarios: Weather contingency planning"
          ]
        },
        {
          name: "Engineering Validation (33 engineers)",
          tasks: [
            "Flight readiness review: Accelerated timeline risk assessment",
            "Booster reuse certification: 12th flight validation for B1062",
            "Telemetry analysis: Pre-flight data review",
            "Simulation runs: Validate trajectory with April 15 parameters"
          ]
        }
      ]
    },
    tier3: {
      title: "External Partners & Regulatory Agencies (1,000 stakeholders)",
      count: 1000,
      description: "FAA, U.S. Space Force (Eastern Range), NASA, weather services, marine coordination, airspace control, media partners, and vendor support teams enabling accelerated launch timeline",
      partners: [
        {
          category: "Regulatory Agencies (67 officials)",
          examples: [
            "FAA Office of Commercial Space Transportation - Launch license modification",
            "U.S. Space Force (45th Space Wing) - Eastern Range operations approval",
            "NASA - ISS coordination (deconfliction with other missions)",
            "FCC - Satellite communications licensing"
          ]
        },
        {
          category: "Range & Safety (180 personnel)",
          examples: [
            "Eastern Range Control - Launch slot management",
            "Range Safety Officers - Flight termination system oversight",
            "Tracking stations - Radar, telemetry, optical tracking",
            "Marine patrol - Exclusion zone enforcement"
          ]
        },
        {
          category: "Weather Services (45 forecasters)",
          examples: [
            "45th Weather Squadron - Launch weather forecasting",
            "National Weather Service - Upper atmosphere analysis",
            "Private weather contractors - Specialized aerospace forecasting"
          ]
        },
        {
          category: "Airspace & Marine Coordination (450 entities)",
          examples: [
            "FAA Air Traffic Control - Airspace closures, NOTAMs",
            "U.S. Coast Guard - Marine exclusion zones",
            "Commercial aviation - Flight path deconfliction",
            "Cruise lines, fishing vessels - Maritime coordination"
          ]
        },
        {
          category: "Media & Communications (58 outlets)",
          examples: [
            "SpaceX webcast team - Live stream production",
            "Space media (Space.com, NASASpaceFlight, etc.) - Coverage coordination",
            "Mainstream media - Launch event notification",
            "Social media - Fan engagement, public communications"
          ]
        },
        {
          category: "Vendor & Supplier Support (200 partners)",
          examples: [
            "Propellant suppliers - RP-1, LOX delivery acceleration",
            "Ground support equipment vendors - Maintenance and spares",
            "Telemetry equipment providers - Data acquisition systems",
            "Transportation contractors - Vehicle and payload transport"
          ]
        }
      ]
    }
  },

  timelineEvents: [
    {
      time: "0:00",
      title: "Playbook Activation: Launch Schedule Acceleration",
      description: "M activates Playbook #155 across SpaceX. Elon Musk's decision triggers coordinated response across 1,847 stakeholders.",
      status: "initiated",
      icon: "Rocket",
      stakeholderCount: 1847
    },
    {
      time: "1:30",
      title: "Executive Leadership Briefing",
      description: "34 executives (Elon, Gwynne Shotwell, Mission Directors, VP Launch Ops) receive orbital window analysis: favorable atmospheric conditions, ULA slot available April 15, $47M revenue acceleration, Starlink Southeast Asia expansion accelerated by 2 weeks. Risk assessment: manageable with expedited coordination.",
      status: "coordinating",
      icon: "Target",
      stakeholderCount: 34
    },
    {
      time: "3:00",
      title: "Go-Decision: Move Launch to April 15",
      description: "Elon approves 3-day acceleration. Gwynne Shotwell initiates FAA expedited license modification. Mission Directors confirm vehicle and payload readiness. 72-hour execution timeline begins.",
      status: "coordinating",
      icon: "CheckCircle",
      stakeholderCount: 34
    },
    {
      time: "4:00",
      title: "Ground Operations: LC-40 Pad Prep Accelerated",
      description: "340 ground crew receive accelerated timeline. LC-40 pad preparation begins immediately: transporter-erector positioning, strongback integration, ground support equipment activation. Vehicle rollout scheduled 48 hours ahead of original plan.",
      status: "executing",
      icon: "Construction",
      stakeholderCount: 340
    },
    {
      time: "5:30",
      title: "Vehicle Processing: Falcon 9 B1062 Validation",
      description: "180 engineers complete post-flight inspection ahead of schedule. Booster (12th flight) validated for reuse. Stage 2 propellant systems checked. Telemetry equipment tested. Vehicle cleared for 72-hour turnaround.",
      status: "executing",
      icon: "Settings",
      stakeholderCount: 180
    },
    {
      time: "6:30",
      title: "FAA & Range Coordination Initiated",
      description: "1,000 external partners activated: FAA expedited review begins (48-hour target), U.S. Space Force confirms Eastern Range availability April 15, airspace closures coordinated, marine exclusion zones scheduled. NOTAMs issued.",
      status: "executing",
      icon: "FileText",
      stakeholderCount: 1000
    },
    {
      time: "8:00",
      title: "Payload Integration: 23 Starlink Satellites",
      description: "120 payload specialists accelerate final integration checks. Satellite health validated (power, comms, propulsion). Dispenser mechanism tested. Fairing encapsulation scheduled 36 hours ahead. Mass properties confirmed.",
      status: "executing",
      icon: "Satellite",
      stakeholderCount: 120
    },
    {
      time: "9:30",
      title: "Propellant Operations: Fueling Timeline Advanced",
      description: "67 fueling technicians coordinate accelerated propellant loading. RP-1 transfer to storage tanks. LOX cryogenic operations scheduled. Helium pressurant systems checked. Safety protocols maintained despite compressed schedule.",
      status: "executing",
      icon: "Droplet",
      stakeholderCount: 67
    },
    {
      time: "11:00",
      title: "Weather & Trajectory Analysis Complete",
      description: "28 analysts confirm April 15 forecast: 85% favorable (winds <20 knots, minimal lightning risk, good visibility). Trajectory optimized for accelerated launch. Abort scenarios planned. Flight readiness review scheduled for T-24 hours.",
      status: "executing",
      icon: "CloudSun",
      stakeholderCount: 28
    },
    {
      time: "12:00",
      title: "Execution Underway: T-72 Hours to Launch",
      description: "All 1,847 stakeholders aligned and executing. Ground crews preparing LC-40, vehicle processing complete, FAA expedited review in progress, payload integration on schedule, fueling prep underway. April 15 launch confirmed—SpaceX captures optimal orbital window, accelerates Starlink expansion, unlocks $47M revenue. When Elon calls the play, the entire organization executes in minutes.",
      status: "complete",
      icon: "Trophy",
      stakeholderCount: 1847
    }
  ],

  roiComparisonData: {
    title: "Launch Schedule Acceleration: Starlink Orbital Window",
    timeline: "5-7 Days vs 12 Minutes",
    outcome: "$47M Revenue + Strategic Orbital Position Through Coordination Velocity",
    traditional: {
      label: "Traditional Aerospace Coordination",
      duration: "5-7 Days",
      outcome: "Missed Orbital Window",
      approach: "Traditional aerospace coordination requires 5-7 days of sequential approvals across engineering, safety, regulatory, and operations teams. By the time coordination completes, the favorable orbital window has closed—atmospheric conditions shift, range conflicts emerge, and the opportunity is lost. The launch proceeds on the original April 18 date.",
      points: [
        "5-7 days to coordinate 1,847 stakeholders (sequential approvals bog down decision velocity)",
        "FAA license modification takes 7-10 days (standard review process, no expedited path)",
        "Favorable orbital window closes by day 5 (atmospheric conditions shift)",
        "ULA mission reschedules, reclaims April 15 slot—opportunity lost",
        "Launch proceeds April 18 on original schedule (suboptimal orbital geometry)",
        "Starlink Southeast Asia expansion delayed by 2 weeks ($47M revenue deferred)",
        "Competitor OneWeb captures better constellation position",
        "Missed demonstration of operational agility to payload customers"
      ]
    },
    vexor: {
      label: "M Coordination",
      duration: "12 Minutes",
      outcome: "Optimal Orbital Window Captured",
      approach: "M coordinates all 1,847 stakeholders in 12 minutes. Elon's decision triggers instant alignment across 34 executives, 813 operational specialists, and 1,000 external partners (FAA, Space Force, Range Control). SpaceX moves launch forward 3 days, captures April 15 optimal window, accelerates Starlink expansion, and demonstrates coordination velocity that traditional aerospace cannot match.",
      points: [
        "12-minute coordination across 1,847 stakeholders (parallel activation, not sequential)",
        "FAA expedited review: 48-hour turnaround (government relations team activates fast-track path)",
        "April 15 orbital window secured (optimal atmospheric conditions, superior constellation geometry)",
        "Eastern Range slot captured before ULA reschedules—first-mover advantage",
        "Starlink Southeast Asia expansion accelerated by 2 weeks ($47M revenue brought forward)",
        "72-hour vehicle turnaround achieved (Falcon 9 B1062.12 processed flawlessly)",
        "Market signal to competitors: SpaceX operates at decision velocity aerospace has never seen",
        "Payload customer confidence reinforced—SpaceX can adapt launch schedules faster than anyone"
      ]
    },
    bottomLine: {
      value: "$47M",
      metric: "Revenue Acceleration + Strategic Orbital Position Secured"
    }
  }
};
